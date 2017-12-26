import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    meetsupData: [
      {
        imgUrl: 'http://static6.businessinsider.com/image/58753f70ee14b6a27b8b4972/7-billion-dollar-mega-projects-that-will-transform-new-york-city-by-2035.jpg',
        title: 'New York',
        id: 'asdasdas12456461',
        date: new Date(),
        location: 'New York',
        description: 'New York !!!'
      },
      {
        imgUrl: 'http://www.businesseurope.org/wp-content/uploads/2017/03/paris.jpg',
        title: 'Paris',
        id: 'asdasdas12456451',
        date: new Date(),
        location: 'Paris',
        description: 'Paris !!!'
      }
    ],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    createMeetUp (state, payload) {
      state.meetsupData.push(payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    createMeetUp ({commit}, payload) {
      const meetup = {
        id: payload.id,
        title: payload.title,
        description: payload.description,
        imgUrl: payload.imgUrl,
        location: payload.location,
        date: payload.date
      }
      // settiong firebase
      commit('createMeetUp', meetup)
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit('setLoading', false)
          const newUser = {
            user: user.uid,
            registerMeetUp: []
          }
          commit('setUser', newUser)
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err)
          console.log(err)
        })
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit('setLoading', false)
          const newUser = {
            user: user.uid,
            registerMeetUp: []
          }
          commit('setUser', newUser)
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err)
          console.log(err)
        })
    },
    clearError ({commit}) {
      commit('clearError')
    }
  },
  getters: {
    loadMeetups (state) {
      return state.meetsupData.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featureMeetups (state, getters) {
      return getters.loadMeetups.slice(0, 5)
    },
    loadMeetup (state) {
      return (meetUpId) => {
        return state.meetsupData.find((meetup) => {
          return meetup.id === meetUpId
        })
      }
    },
    user (state) {
      return state.user
    },
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    }
  }
})
