<template>
  <div>
    <form class="card comment-form" @submit.prevent="onSubmit" v-if="user">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." rows="3" v-model="body"></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
          class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>&nbsp;
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
          class="comment-author"
        >{{ comment.author.username }}</nuxt-link>

        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY')}}</span>
        <span class="mod-options" v-if="canModify(comment)">
          <i class="ion-trash-a" @click="onDeleteComment(comment)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, postComment, deleteComment } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true,
      default: function () {
        return { author: {} }
      }
    }
  },
  data() {
    return {
      comments: [],
      body: ''
    }
  },
  mounted() {
    this.loadComments()
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async loadComments() {
      const { data } = await getComments(this.article.slug)
      this.comments = data.comments
    },
    async onSubmit() {
      const { data } = await postComment(this.article.slug, { comment: { body: this.body } })
      this.comments.unshift(data.comment)
      this.body = ''
    },
    async onDeleteComment(comment) {
      await deleteComment(this.article.slug, comment.id)
      this.loadComments()
    },
    canModify(comment) {
      return this.user && comment.author.username === this.user.username
    }
  }
}
</script>

<style>
</style>