<template>

  <v-container class="pa-0">

    <v-subheader>
      <router-link to="/settings" class="text-nodecoration">設定・サポート</router-link>
      <v-icon size="14px" class="mx-2">fas fa-chevron-right</v-icon>
      請求金額の確認
    </v-subheader>

    <v-card>
      <v-card-title class="body-1 green--text font-weight-bold">請求履歴</v-card-title>

      <v-card-text>

        <v-data-table
          :loading="loading"
          loading-text="読み込んでいます"
          no-data-text="お支払いがある場合はこちらに表示されます"
          :headers="headers"
          :items="items"
          mobile-breakpoint="0"
          hide-default-footer
          :page.sync="page"
          :items-per-page="pageSize"
        >
          <template v-slot:item.url="{ item }">
            <v-btn
              :href="item.url"
              target="_blank"
              color="success"
              rounded
              text
              class="px-0"
            >
              請求書を見る
              <v-icon size="14px" class="ml-2">fas fa-external-link-alt</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <v-pagination
          v-model="page"
          :length="pageCount"
          class="mt-3"
          circle
          color="success"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
        ></v-pagination>

      </v-card-text>

    </v-card>

  </v-container>

</template>

<script>
import * as invoiceService from '@/service/invoice';

export default {
  name: 'Invoice',
  computed: {
    device() {
      return this.$store.getters['account/device'];
    },
  },
  data: () => ({
    loading: true,
    headers: [
      { text: '請求内容', value: 'description', class: 'text-no-wrap' },
      { text: '請求金額', value: 'amount', class: 'text-no-wrap' },
      { text: '日時', value: 'paidDate', class: 'text-no-wrap' },
      { text: '請求書', value: 'url', class: 'text-no-wrap' },
    ],
    items: [],
    page: 1,
    pageCount: 0,
    pageSize: 10,
  }),
  async created() {
    this.loading = true;

    try {
      const response = await invoiceService.fetchInvoice();
      this.items = response.data.invoice;
      this.loading = false;
    } catch (err) {
      this.$store.commit('accounts/setError', err.response.data);
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.text-nodecoration {
  text-decoration: none;
}
</style>
