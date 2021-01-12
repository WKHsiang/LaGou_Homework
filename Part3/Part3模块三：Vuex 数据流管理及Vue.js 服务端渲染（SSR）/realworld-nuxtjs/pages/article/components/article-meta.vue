<template>
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
        class="author"
        :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }"
      >{{article.author.username}}</nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY')}}</span>
    </div>
    <template v-if="user && article.author.username === user.username">
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
            name: 'editor',
            params: {
              slug: article.slug
            }
          }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button class="btn btn-outline-danger btn-sm" @click="deleteArticle">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-if="user && article.author.username !== user.username">
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following
        }"
        @click="onFollow"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{article.author.following ? "Unfollow" : "Follow"}} {{article.author.username}}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited
        }"
        @click="onFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{article.favorited? 'Unfavorite' : 'Favorite'}} Post
        <span
          class="counter"
        >({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>
  
<script>
import { mapState } from 'vuex'
import { deleteArticle, addFavorite, deleteFavorite } from '@/api/article'
import { followUser, unFollowUser } from '@/api/user'

export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true,
      default: function(){
        return {author: {username: ''}}
      }
    }
  },
  methods: {
    async deleteArticle() {
      await deleteArticle(this.article.slug)
      this.$router.push('/')
    },
    async onFollow() {
      if(!this.user){
        return this.$router.push('/login')
      }
      const method = this.article.author.following ? followUser : unFollowUser
      await method(this.article.author.username)
      this.article.author.following = !this.article.author.following
    },
    async onFavorite() {
      if(!this.user){
        return this.$router.push('/login')
      }
      const method = this.article.favorited ? deleteFavorite : addFavorite
      await method(this.article.slug)
      if (this.article.favorited) {
        this.article.favoritesCount -= 1
      } else {
        this.article.favoritesCount += 1
      }
      this.article.favorited = !this.article.favorited
    }
  },
  computed: {
    ...mapState(['user']),
  },
}
</script>

<style>
</style>