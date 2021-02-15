import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const initializeLiff = async (to, from, next) => {
  if (!store.getters['account/isLoggedIn']) {
    try {
      await store.dispatch('account/initializeLiff');
    } catch (err) {
      console.log('LIFF initialization failed', err);
      next({ name: 'SignIn' });
    }
  }

  if (!store.getters['account/isLoggedIn']) next({ name: 'SignIn' });
  else {
    // console.log(to, from);
    const query = {
      ...to.query,
      v: store.getters['account/data'].version,
    };
    delete query.code;
    delete query.liffClientId;
    delete query.state;
    delete query.liffRedirectUri;

    if (to.path === '/') {
      next({
        name: 'Home',
        query,
      });
    } else if (!to.query.v || to.query.v !== query.v) {
      next({
        ...to,
        query,
      });
    } else next();
  }
};

const checkAuth = async (to, from, next) => {
  if (!store.getters['account/isLoggedIn']) {
    try {
      await store.dispatch('account/initializeLiff');
    } catch (err) {
      console.log('LIFF initialization failed', err);
      next();
    }
  }

  if (store.getters['account/isLoggedIn']) next({ name: 'Home' });
  else next();
};

const logout = (to, from, next) => {
  window.liff.logout();
  store.commit('account/setIsLoggedIn', false);
  next({
    path: '/sign-in',
    query: to.query,
  });
};

const routes = [
  {
    path: '/',
    beforeEnter: initializeLiff,
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    beforeEnter: initializeLiff,
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('../views/SignIn.vue'),
    beforeEnter: checkAuth,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    beforeEnter: initializeLiff,
  },
  {
    path: '/invoice',
    name: 'Invoice',
    component: () => import('../views/Invoice.vue'),
    beforeEnter: initializeLiff,
  },
  {
    path: '/service',
    name: 'Service',
    component: () => import('../views/Service.vue'),
    beforeEnter: initializeLiff,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('../views/Terms.vue'),
    beforeEnter: initializeLiff,
  },
  {
    path: '/policy',
    name: 'Policy',
    component: () => import('../views/Policy.vue'),
    beforeEnter: initializeLiff,
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../views/Payment.vue'),
  },
  {
    path: '/logout',
    beforeEnter: logout,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
