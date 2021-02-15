<template>
  <div class="sign-in d-flex align-center justify-center">
    <div class="text-center">
      <p>
        パイセンQの利用のため<br>
        LINEアカウントに接続してください
      </p>
      <v-btn color="#00c300" dark large @click="$liff.login()" class="font-weight-bold">
        <v-icon class="mr-2">fab fa-line</v-icon>LINEでログイン
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignIn',
  created() {
    console.log(this.$liff.isLoggedIn());
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
.sign-in {
  background: #fafafa;
  height: 100%;
  padding: 30px;
}
</style>
