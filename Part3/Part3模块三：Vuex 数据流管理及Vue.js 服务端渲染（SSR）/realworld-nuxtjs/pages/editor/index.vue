<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <div>Split by ,</div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="article.tagList"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary">Publish Article</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postArticle, getArticle } from '@/api/article'
export default {
  name: 'EditorIndex',
  middleware: 'auth',    //['auth'] also works
  data() {
    return {
      article: {
        "title": "",
        "description": "",
        "body": "",
        "tagList": ""
      }
    }
  },
  methods: {
    async onSubmit() {
      const postData = Object.assign({}, this.article)
      postData.tagList = (postData.tagList && postData.tagList.split(',')) || []
      postData.tagList.forEach(tag => {
        tag = tag.trim()
      })
      const { data } = await postArticle({ article: postData })
      this.$router.push(`/article/${data.article.slug}`)
    },
  },
  async mounted() {
    if (this.$route.params.slug) {
      const { data } = await getArticle(this.$route.params.slug)
      data.article.tagList = data.article.tagList.join(',')
      this.article = data.article
    }
  }
}
</script>

<style>
</style>