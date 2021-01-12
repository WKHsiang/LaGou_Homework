<template>
  <div>
    <div class="settings-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Your Settings</h1>

            <ul class="error-messages">
              <template v-for="(messages, field) in errors">
                <li v-for="(message, index) in messages" :key="index">{{ field }} {{message}}</li>
              </template>
            </ul>
            <form @submit.prevent="onSubmit">
              <fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    v-model="user.image"
                    required
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    v-model="user.username"
                    minlength="1"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <textarea
                    class="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    v-model="user.bio"
                  ></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    v-model="user.email"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    v-model="user.password"
                    required
                  />
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
              </fieldset>
            </form>
            <hr />
            <button class="btn btn-outline-danger" @click="logout">Or click here to logout.</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updateUser } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'SettingsIndex',
  middleware: 'auth',
  data() {
    return {
      user: {
        image: '',
        username: '',
        bio: '',
        email: '',
        password: ''
      },
      errors: []
    }
  },
  async mounted() {
    const { data } = await getUser()
    this.user = data.user
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = await updateUser({ user: this.user })
        this.$router.push(`/profile/${data.user.username}`)
      } catch (error) {
        this.errors = error.response.data.errors
      }
    },
    logout() {
      this.$store.commit('setUser', null)
      Cookie.set('user', null)
      this.$router.push('/')
    }
  }
}
</script>

<style>
</style>