<template>

  <v-container class="pa-0">

    <v-subheader>設定・サポート</v-subheader>

    <v-list class="py-0">

      <v-list-item to="/invoice" class="d-flex justify-between">

        <v-list-item-content>
          <v-list-item-title class="body-2">請求金額の確認</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-icon size="16px">fas fa-chevron-right</v-icon>
        </v-list-item-action>

      </v-list-item>

      <v-divider></v-divider>

      <v-list-item to="/service" class="d-flex justify-between">

        <v-list-item-content>
          <v-list-item-title class="body-2">契約内容の確認・変更</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-icon size="16px">fas fa-chevron-right</v-icon>
        </v-list-item-action>

      </v-list-item>

      <v-divider></v-divider>

      <v-list-item to="/terms" class="d-flex justify-between">

        <v-list-item-content>
          <v-list-item-title class="body-2">利用規約</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-icon size="16px">fas fa-chevron-right</v-icon>
        </v-list-item-action>

      </v-list-item>

      <v-divider></v-divider>

      <v-list-item href="https://smartrador.com/family/policy.html" target="_blank" class="d-flex justify-between">

        <v-list-item-content>
          <v-list-item-title class="body-2">プライバシーポリシー</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-icon size="16px">fas fa-external-link-square-alt</v-icon>
        </v-list-item-action>

      </v-list-item>

      <v-divider></v-divider>

      <v-list-item href="https://prd-inc.jp" target="_blank" class="d-flex justify-between">

        <v-list-item-content>
          <v-list-item-title class="body-2">運営会社</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-icon size="16px">fas fa-external-link-square-alt</v-icon>
        </v-list-item-action>

      </v-list-item>

    </v-list>

    <div class="text-center white pa-5 mt-10 mx-5 elevation-2 rounded">

      <p class="text-origin body-2">パイセンQはprdが学研ホールディングスとのコラボレーションにより提供するサービスです</p>

      <div class="d-flex align-center justify-space-around white">
        <v-sheet
          height="80px"
          width="80px"
          class="d-flex align-center justify-center"
        >
          <v-img
            height="80px"
            width="80px"
            :src="require('@/assets/gakken-logo.png')"
            class="shrink white"
            contain
          />
        </v-sheet>
        <v-icon color="grey darken-1">fas fa-times</v-icon>
        <v-sheet
          height="80px"
          width="80px"
          color="white"
          class="d-flex align-center justify-center"
          tile
        >
          <v-img
            height="50px"
            width="70px"
            :src="require('@/assets/prd-logo.svg')"
            class="shrink white"
            contain
          />
        </v-sheet>
      </div>
    </div>

  </v-container>

</template>

<script>
export default {
  name: 'Settings',
  computed: {
    device() {
      return this.$store.getters['account/device'];
    },
  },
  data: () => ({
  }),
};
</script>

<style scoped>

</style>
