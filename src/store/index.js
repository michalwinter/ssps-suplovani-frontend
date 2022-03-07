import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    seenUpdate: null,
    dark: false,
    grade: "",
    days: [],
  },
  mutations: {
    setDark(state, dark) {
      state.dark = dark
    },
    setGrade(state, grade) {
      state.grade = grade
    },
    setDays(state, days) {
      state.days = days
    },
    setSeenUpdate(state, seenUpdate) {
      state.seenUpdate = seenUpdate
    }
  },
  actions: {
    getData({ commit }) {
      axios.get('https://api.michalwinter.cz/6574/suplovani')
        .then(res => {
          console.log(res.data);
          commit('setDays', res.data)
        })
    }
  },
  modules: {
  },
  plugins: [
    new VuexPersist({
      key: 'sablovo-uloziste',
      reducer: (state) => ({
        dark: state.dark,
        grade: state.grade,
        days: state.days,
        seenUpdate: state.seenUpdate
      }),
    }).plugin,
  ],
})
