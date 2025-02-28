import Vue from 'vue';
import Vuex from 'vuex';
import account from './account';
import questions from './questions';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    account,
    questions,
  },
});
