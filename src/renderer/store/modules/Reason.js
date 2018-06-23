const state = {
    mainreason: [],
    subreason: []
}

const mutations = {
    updateReason(state, val) {
        state.mainreason = val.mainreason,
        state.subreason = val.subreason
    }
}

const actions = {

}

export default {
    state,
    mutations,
    actions
}
