const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => {
  return {
    user: null
  }
}
export const mutations = {
  setUser (state, data) {
    state.user = data
  }
}
export const actions = {
  //只会在服务端渲染期间执行
  nuxtServerInit ({ commit }, { req }) {
    let user = null
    if (req && req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setUser', user)
  }
}
