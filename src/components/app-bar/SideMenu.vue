<template>
  <div class="menu-wrapper d-flex" :class="{'is-open': overlay}">
    <div class="sidemenu">
      <v-responsive width="240px" min-width="240px">
        <v-card
          elevation="10"
          height="100vh"
          tile
          color="white"
          class="mx-auto"
        >
          <v-list>
            <v-subheader class="d-flex align-center my-4">
              <v-img
                alt="smartrador Logo"
                class="shrink mr-2 avatar"
                cover
                :src="user.pictureUrl"
                width="36px"
                v-if="user.pictureUrl"
              />
              <v-icon v-else class="mr-2" large>fas fa-user-circle</v-icon>
              {{user.displayName}}
            </v-subheader>
            <v-list-item-group color="success">
              <v-list-item @click="move('/home')">
                <v-list-item-icon class="mr-2">
                  <v-icon small :color="$route.path == '/home' ? 'success' : ''">fas fa-pen</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    class="body-2"
                    :class="$route.path == '/home' ? 'green--text' : ''"
                  >
                    勉強の質問をする
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="move('/settings')">
                <v-list-item-icon class="mr-2">
                  <v-icon
                    small
                    :color="$route.path == '/settings' ? 'success' : ''"
                  >
                    fas fa-sliders-h
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    class="body-2"
                    :class="$route.path == '/settings' ? 'green--text' : ''"
                  >
                    設定・サポート
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="my-3"></v-divider>
              <v-list-item @click="$emit('tutorial')">
                <v-list-item-content>
                  <v-list-item-title class="body-2">
                    使い方をみる
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-responsive>
    </div>
    <div class="close-area" @click="$emit('close')"></div>
  </div>
</template>

<script>
export default {
  name: 'SideMenu',
  props: ['overlay'],
  computed: {
    user() {
      return this.$store.getters['account/data'];
    },
  },
  data: () => ({
    env: process.env,
  }),
  methods: {
    move(path) {
      this.$emit('close');
      this.$router.push({ query: { utm_source: this.$route.query.utm_source }, path });
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
