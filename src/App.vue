<template>
  <v-app>
    <v-app-bar
      app
      color="white"
    >
      <v-img
        alt="logo"
        class="shrink ps-logo"
        cover
        src="@/assets/logo.svg"
        transition="scale-transition"
        height="40px"
        width="140px"
      />

      <v-btn
        @click="overlay = !overlay"
        v-if="isLoggedIn"
        icon
      >
        <v-img
          class="shrink avatar"
          cover
          :src="user.pictureUrl"
          transition="scale-transition"
          width="36px"
          height="36px"
          v-if="user.pictureUrl"
        />
        <v-responsive width="36px" height="36px" class="d-fex align-center" v-else>
          <v-icon large>fas fa-user-circle</v-icon>
        </v-responsive>
        <div class="sidemenu-icon">
          <v-icon size="10px">fas fa-bars</v-icon>
        </div>
      </v-btn>

      <v-spacer></v-spacer>

      <div
        v-if="isLoggedIn
          && !user.subscriptionStatus
          && $route.name !== 'Payment'"
        class="text-center"
      >
        <p class="caption mb-0">
          残り
          <b class="pink--text body-1 font-weight-bold mx-1">
            {{user.trialCnt > 0 ? user.trialCnt : 0}}
          </b>
          回
        </p>
        <v-btn x-small color="orange" dark class="font-weight-bold" @click="openPayment()">
          サービス利用
        </v-btn>
      </div>

      <div
        v-if="isLoggedIn
          && user.subscriptionStatus
          && noAccessAuthorizations
          && $route.name !== 'Payment'"
        class="text-center"
      >
        <p class="caption mb-0">
          <b class="pink--text body-2 font-weight-bold">未契約</b>
        </p>
        <v-btn
          x-small
          color="orange"
          dark
          class="font-weight-bold"
          @click="openPayment(!!user.subscriptionStatus)"
        >
          サービス利用
        </v-btn>
      </div>

    </v-app-bar>

    <v-content>
      <router-view
        @payment="openPayment"
        @tutorial="openTutorial"
      />
    </v-content>

    <SideMenu
      :overlay="overlay"
      @close="overlay=false"
      @tutorial="openTutorial"
    />

    <PaymentModal
      :paymentDialog="paymentDialog"
      :sp="device.isSp"
      :isRestart="isRestart"
      @close="paymentDialog=false"
    />

    <Tutorial
      ref="tutorialModal"
      :dialog="tutorialDialog"
      :sp="device.isSp"
      @close="closeTutorial"
    />

    <v-snackbar
      v-model="error"
      bottom
      color="error"
      :timeout="timeout"
    >
      {{ accountError.message || questionsError.message }}
      <v-btn
        dark
        text
        @click="clear"
      >
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </v-snackbar>

    <v-alert
      v-if="notification"
      close-icon="mdi-delete"
      color="orange"
      border="left"
      elevation="2"
      colored-border
      class="bottom-alert"
    >
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="d-flex align-center">
          <v-icon color="orange" class="mr-1">mdi-alert-circle</v-icon><b>お知らせ</b>
        </div>
        <v-btn
          text
          @click="$store.commit('account/setNotification', false)"
          class="pa-0"
          x-small
          color="grey"
        >
          <v-icon small>fas fa-times</v-icon>
        </v-btn>
      </div>
      <div>
        {{ notification }}
      </div>
    </v-alert>

  </v-app>
</template>

<script>
import SideMenu from '@/components/app-bar/SideMenu.vue';
import PaymentModal from '@/components/app-bar/PaymentModal.vue';
import Tutorial from '@/components/app-bar/Tutorial.vue';

export default {
  name: 'App',
  components: { SideMenu, PaymentModal, Tutorial },
  computed: {
    isLoggedIn() {
      return this.$store.getters['account/isLoggedIn'];
    },
    device() {
      return this.$store.getters['account/device'];
    },
    error: {
      get() {
        return this.$store.getters['account/error']
          || this.$store.getters['questions/error'];
      },
      set() {},
    },
    accountError() {
      return this.$store.getters['account/error'];
    },
    questionsError() {
      return this.$store.getters['questions/error'];
    },
    user() {
      return this.$store.getters['account/data'];
    },
    noAccessAuthorizations() {
      return this.$store.getters['account/noAccessAuthorizations'];
    },
    notification() {
      return this.$store.getters['account/notification'];
    },
  },
  data: () => ({
    overlay: false,
    timeout: 3000,
    paymentDialog: false,
    isRestart: false,
    tutorialDialog: false,
  }),
  created() {
    this.$store.dispatch('account/checkDevice');
  },
  methods: {
    clear() {
      this.$store.commit('account/setError', false);
      this.$store.commit('questions/setError', false);
    },
    openPayment(isRestart) {
      this.isRestart = isRestart;
      this.paymentDialog = true;
    },
    openTutorial() {
      this.overlay = false;
      this.tutorialDialog = true;
    },
    closeTutorial() {
      this.tutorialDialog = false;
      this.$store.commit('account/setData', {
        ...this.user,
        isTutorial: false,
      });
      this.$refs.tutorialModal.slide = 0;
    },
  },
};
</script>

<style>
  #app {
    background-color: #f9f7f5;
  }

  .w-100 {
    width: 100vw;
  }

  .w-100p {
    width: 100%;
  }

  .avatar {
    background-color: #d3d3d3;
    border: 1px solid #00672f;
    border-radius: 50%;
  }

  .medal {
    width: 20px;
    height: auto;
    object-fit: cover;
  }

  .avatar.fm {
    border-color: #c51515;
  }

  .rounded {
    border-radius: 4px;
  }

  .rounded-50 {
    border-radius: 50%;
  }

  .menu-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: rgb(33, 33, 33, 0.46);
    border-color: rgb(33, 33, 33, 0.46);
    opacity: 0;
    visibility: hidden;
    transition: 0.2s linear;
    transform: translateX(-100%);
  }

  .menu-wrapper.is-open {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }

  .menu-wrapper .sidemenu {
    width: 240px;
    height: 100vh;
    background: #ffffff;
  }

  .close-area {
    width: calc(100vw - 240px);
    height: 100vh;
  }

  .border {
    border: 1px solid rgba(0,0,0,0.1);
  }

  .border-top {
    border-top: 1px solid rgba(0,0,0,.1);
  }

  .border-bottom {
    border-bottom: 1px solid rgba(0,0,0,.1);
  }

  .border-right {
    border-right: 1px solid rgba(0,0,0,.1);
  }

  .bg-origin {
    background: #f9f7f5;
  }

  .text-origin {
    color: #212121;
  }

  .ps-logo {
    position: absolute;
    left: calc(50% - 75px);
  }

  .text-show {
    text-overflow: inherit;
    white-space: inherit;
  }

  .h-100 {
    height: 100%;
  }

  .req-table {
    border-collapse: collapse;
    width: 100%;
  }

  .req-table td {
    padding: 10px;
    color: #212121;
    white-space: pre-line;
    font-size: 14px;
  }

  .req-table td.req-table-thread {
    white-space: nowrap;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .chip-origin {
    border-radius: 12px;
    font-size: 12px;
    height: 24px;
    align-items: center;
    display: inline-flex;
    line-height: 20px;
    padding: 0 12px;
    position: relative;
    white-space: nowrap;
    border: 1px solid #1976d2;
  }

  .position-fixed-top {
    position: fixed;
    top: 0;
    z-index: 10;
  }

  .position-fixed-bottom {
    position: fixed;
    bottom: 0;
    z-index: 10;
  }

  .sidemenu-icon {
    position: absolute;
    bottom: -4px;
    right: 0;
    color: #ffffff;
    background: #00672f;
    font-size: 10px;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .v-alert.bottom-alert {
    position: fixed;
    z-index: 10;
    bottom: 8px;
    left: 8px;
    right: 8px;
    font-size: 14px;
    margin-bottom: 0;
    white-space: pre-line;
  }

  @media (max-width:600px) {
    .sr-logo {
      width: 170px;
    }

    .req-table td.req-table-thread {
        white-space: initial;
    }
  }
</style>
