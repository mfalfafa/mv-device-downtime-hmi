const state = {
  userid: 0,
  role: 0,
  username: ''
}

const mutations = {
  updateLogin (state, val) {
    state.userid = val.userid
    state.role = val.role
    state.username = val.username
  },
  setOffLogin (state) {
    state.userid = 0
    state.role = 0
    state.username = ''
  }
}

const actions = {
  someAsyncTask ({
    commit
  }) {
    // do something async
    commit('setOffLogin')
  }
}

export default {
  state,
  mutations,
  actions
}
