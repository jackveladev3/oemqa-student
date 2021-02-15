import * as questionService from '@/service/questions';

const questions = {
  namespaced: true,
  state: {
    items: {
      draft: [],
      active: [],
      done: [],
      close: [],
    },
    nextToken: null,
    loading: false,
    error: false,
  },
  mutations: {
    setItems: (state, data) => {
      state.items = data;
    },
    setNextToken: (state, data) => {
      state.nextToken = data;
    },
    setLoading: (state, data) => {
      state.loading = data;
    },
    setError: (state, data) => {
      state.error = data;
    },
    addQuestion: (state, data) => {
      state.items = [data, ...state.items];
    },
    updateQuestion: (state, data) => {
      const items = state.items.filter((item) => item.id !== data.old.id);
      state.items = [data.new, ...items];
    },
    deleteQuestion: (state, data) => {
      state.items = state.items.filter((item) => item.id !== data.id);
    },
  },
  getters: {
    items: (state) => state.items,
    nextToken: (state) => state.nextToken,
    loading: (state) => state.loading,
    error: (state) => state.error,
  },
  actions: {
    fetchQuestionList: async (context, id) => {
      context.commit('setLoading', true);
      context.commit('setError', false);
      try {
        const response = await questionService.fetchQuestionList(id);
        context.commit('setItems', response.data);
        context.commit('setNextToken', response.nextToken);
      } catch (e) {
        console.log('error', e);
        context.commit('setError', e);
      }
      context.commit('setLoading', false);
    },
  },
};

export default questions;
