import * as accountService from '@/service/account';

const account = {
  namespaced: true,
  state: {
    isLoggedIn: false,
    device: {
      isSp: false,
      isiPhoneXSeries: false,
    },
    data: {
      studentId: null,
      displayName: null,
      pictureUrl: null,
      subscriptionStatus: null,
      trialDt: null,
      isTutorial: false,
    },
    loading: false,
    error: false,
    noAccessAuthorizations: false,
    notification: false,
  },
  mutations: {
    setIsLoggedIn: (state, data) => {
      state.isLoggedIn = data;
    },
    setDevice: (state, data) => {
      state.device = data;
    },
    setData: (state, data) => {
      state.data = data;
    },
    setLoading: (state, data) => {
      state.loading = data;
    },
    setError: (state, data) => {
      state.error = data;
    },
    setNoAccessAuthorizations: (state, data) => {
      state.noAccessAuthorizations = data;
    },
    setNotification: (state, data) => {
      state.notification = data;
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    device: (state) => state.device,
    data: (state) => state.data,
    loading: (state) => state.loading,
    error: (state) => state.error,
    noAccessAuthorizations: (state) => state.noAccessAuthorizations,
    notification: (state) => state.notification,
  },
  actions: {
    initializeLiff: async (context) => {
      let isLoggedIn = false;
      let response;
      context.commit('setLoading', true);
      context.commit('setError', false);
      try {
        isLoggedIn = await accountService.initializeLiff();
        if (isLoggedIn) await context.dispatch('fetchAccount', true);
        context.commit('setIsLoggedIn', isLoggedIn);
      } catch (e) {
        console.log('error', e);
        context.commit('setError', e);
      }
      context.commit('setLoading', false);
      return response;
    },
    checkDevice: (context) => {
      const response = accountService.checkDevice();
      context.commit('setDevice', response);
    },
    fetchAccount: async (context, isLoginAction) => {
      try {
        const { data } = await accountService.fetchAccount();
        context.commit('setData', data);
        if (data.subscriptionStatus === 4 || data.trialCnt <= 0) {
          if (isLoginAction) {
            context.commit('setError', {
              message: data.trialCnt <= 0 ? '無料の質問数を超えたため、機能が制限されています' : 'サービス未契約のため、機能が制限されています',
            });
          }
          context.commit('setNoAccessAuthorizations', true);
        }
        if (data.notification) {
          context.commit('setNotification', data.notification);
        }
      } catch (e) {
        console.log('error', e);
        context.commit('setError', e);
      }
    },
  },
};

export default account;
