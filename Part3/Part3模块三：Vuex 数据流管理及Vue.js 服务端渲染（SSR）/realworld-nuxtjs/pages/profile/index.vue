<template>
  <div>
    <div class="profile-page">
      <div class="user-info">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              <img :src="profile.image" class="user-img" />
              <h4>{{ profile.username }}</h4>
              <p>{{ profile.bio }}</p>
              <nuxt-link
                v-if="isCurrentUser()"
                class="btn btn-sm btn-outline-secondary action-btn"
                :to="{
                  name: 'settings'
                }"
              >
                <i class="ion-gear-a"></i> Edit Profile Settings
              </nuxt-link>
              <button v-else class="btn btn-sm btn-outline-secondary action-btn" @click="onFollow">
                <i class="ion-plus-round"></i>
                &nbsp;
                {{ profile.following ? 'Unfollow': 'Follow' }} {{ profile.username }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
              <ul class="nav nav-pills outline-active">
                <li class="nav-item">
                  <a
                    href
                    class="nav-link"
                    :class="{
                      active: mode === 'myArticles'
                    }"
                    @click.stop.prevent="changeMode('myArticles')"
                  >My Articles</a>
                </li>
                <li class="nav-item">
                  <a
                    href
                    class="nav-link"
                    :class="{
                      active: mode === 'favoritedArticles'
                    }"
                    @click.stop.prevent="changeMode('favoritedArticles')"
                  >Favorited Articles</a>
                </li>
              </ul>
            </div>

            <div class="article-preview" v-for="article in articles" :key="article.slug">
              <div class="article-meta">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username
                    }
                  }"
                >
                  <img :src="article.author.image" />
                </nuxt-link>
                <div class="info">
                  <nuxt-link
                    :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username
                    }
                  }"
                  >{{ article.author.username }}</nuxt-link>

                  <span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{
                  active: article.favorited
                  }"
                  v-if="user"
                  :disabled="article.favoriteDisabled"
                  @click="onFavorite(article)"
                >
                  <i class="ion-heart"></i>
                  {{article.favoritesCount}}
                </button>
              </div>
              <nuxt-link
                :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
                class="preview-link"
              >
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
              </nuxt-link>
            </div>
            <div class="article-preview" v-if="articles.length === 0">No articles are here... yet.</div>

            <nav v-if='totalPage > 1'>
              <ul class="pagination">
                <li
                  class="page-item"
                  :class="{
                    active: page === item
                  }"
                  v-for="item in totalPage"
                  :key="item"
                >
                  <a
                    href
                    class="page-link"
                    @click.stop.prevent="changePage(item)"
                  >{{item}}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, addFavorite, deleteFavorite  } from '@/api/article'
import { getProfile, followUser, unFollowUser } from '@/api/user'
import { mapState } from 'vuex'

export default {
  name: 'UserProfile',
  // middleware: 'auth',
  data() {
    return {
      mode: 'myArticles',
      page: 1
    }
  },
  async asyncData({ params, query }) {
    const limit = 3
    const page = Number.parseInt(query.page || 1)
    const offset = (page - 1) * limit
    const [articlesRes, profileRes] = await Promise.all([
      getArticles({ author: params.username, limit, offset }),
      getProfile(params.username)
    ])

    return {
      limit,
      articles: articlesRes.data.articles,
      articlesCount: articlesRes.data.articlesCount,
      page,
      profile: profileRes.data.profile
    }
  },
  methods: {
    isCurrentUser() {
      if (this.user && this.user.username && this.profile.username) {
        return this.user.username === this.profile.username
      }
      return false
    },
    changeMode(mode) {
      this.page = 1
      this.loadArticles({mode})
    },
    changePage(page){
      this.loadArticles({page})
    },
    async loadArticles({mode, page}){
      this.mode = mode || this.mode
      this.page = page || this.page
      const username = this.profile.username
      const params = this.mode === 'myArticles' ? { author: username } : { favorited: username }
      const offset = (page - 1) * this.limit
      params.offset = offset
      params.limit = this.limit
      const { data } = await getArticles(params)
      this.articles = data.articles
      this.articlesCount = data.articlesCount
    },
    async onFavorite(article) {
      if(!this.user){
        return this.$router.push('/login')
      }
      article.favoriteDisabled = true
      if(article.favorited){
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
    async onFollow(){
      if(!this.user){
        return this.$router.push('/login')
      }
      const method = this.profile.following ? unFollowUser : followUser
      await method(this.profile.username)
      this.profile.following = !this.profile.following
    }
  },
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  }
}
</script>

<style>
</style>