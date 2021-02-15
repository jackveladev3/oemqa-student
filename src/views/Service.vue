<template>

  <v-container class="pa-0">

    <v-subheader>
      <router-link to="/settings" class="text-nodecoration">設定・サポート</router-link>
      <v-icon size="14px" class="mx-2">fas fa-chevron-right</v-icon>
      契約内容の確認・変更
    </v-subheader>

    <v-card class="mb-10">

      <v-card-title class="body-1 green--text font-weight-bold">ご利用中のサービス</v-card-title>

      <v-card-text v-if="loading">
        <v-skeleton-loader
          type="list-item-two-line"
          class="mx-auto"
          width="100%"
        ></v-skeleton-loader>
      </v-card-text>

      <v-card-text v-else>
        <p v-if="!service.subscriptionStatus" class="mb-10">
          パイセンQの利用開始から質問3回まで無料でサービスをお試しいただけます。
        </p>
        <table class="req-table" border="1" bordercolor="#bdbdbd">
          <tr>
            <td colspan="2">
              <b>月額サービス</b>
              <v-chip
                small
                color="grey"
                dark
                v-if="!service.subscriptionStatus"
                class="ml-3"
              >
                未契約
              </v-chip>
              <v-chip
                small
                color="primary"
                v-else-if="service.subscriptionStatus === 1"
                class="ml-3"
              >
                無料トライアル
              </v-chip>
              <v-chip
                small
                color="success"
                v-else-if="service.subscriptionStatus === 2"
                class="ml-3"
              >
                利用中
              </v-chip>
              <v-chip
                small
                color="error"
                v-else-if="service.subscriptionStatus === 3"
                class="ml-3"
              >
                終了予定
              </v-chip>
              <v-chip
                small
                color="grey"
                dark
                v-else-if="service.subscriptionStatus === 4"
                class="ml-3"
              >
                終了
                </v-chip>
            </td>
          </tr>
          <tr>
            <td class="req-table-thread grey--text text--darken-1">
              月額利用料
            </td>
            <td>
              {{service.amount}}円(税別)<br>
              <span
                class="grey--text text--darken-1"
                v-if="service.subscriptionStatus && service.nextInvoiceDate"
              >
                次回の請求日は{{service.nextInvoiceDate}}です
              </span>
            </td>
          </tr>
          <tr v-if="service.subscriptionStatus">
            <td class="req-table-thread grey--text text--darken-1">
              利用開始日
            </td>
            <td>
              {{service.startDate}}
            </td>
          </tr>
          <tr v-if="service.subscriptionStatus >= 3">
            <td class="req-table-thread grey--text text--darken-1">
              終了日
            </td>
            <td>
              {{service.endDate}}
            </td>
          </tr>
        </table>

        <div
          class="text-center mt-10"
          v-if="!service.subscriptionStatus || service.subscriptionStatus >= 3"
        >
          <v-btn
            color="orange"
            dark
            @click="$emit('payment', service.subscriptionStatus >= 3)"
          >
            <span v-if="!service.subscriptionStatus">お申し込み</span>
            <span v-else>利用を再開する</span>
          </v-btn>
          <p v-if="!service.subscriptionStatus" class="mt-5 mb-0">
            お申し込みいただくと何回でも質問し放題！
          </p>
        </div>

        <p
          class="grey--text text--darken-1 caption mt-5 mb-0"
          v-if="service.subscriptionStatus && service.subscriptionStatus < 3"
        >
          サービスの解約をご希望の場合は<a @click="finish">こちら</a>
        </p>
      </v-card-text>

    </v-card>

    <v-card class="mb-10" v-if="!loading && service.subscriptionStatus === 2">

      <v-card-title class="body-1 blue--text font-weight-bold">お支払い情報</v-card-title>

      <v-card-text>
        <table class="req-table" border="1" bordercolor="#bdbdbd">
          <tr>
            <td colspan="2">
              <b>クレジットカード</b>
            </td>
          </tr>
          <tr>
            <td class="req-table-thread grey--text text--darken-1">
              カード番号
            </td>
            <td>
              末尾 {{service.paymentMethod.last4}}<br>
            </td>
          </tr>
          <tr>
            <td class="req-table-thread grey--text text--darken-1">
              タイプ
            </td>
            <td>
              {{service.paymentMethod.type}}<br>
            </td>
          </tr>
          <tr>
            <td class="req-table-thread grey--text text--darken-1">
              有効期限
            </td>
            <td>
              {{service.paymentMethod.exp_month}}/{{service.paymentMethod.exp_year}}<br>
            </td>
          </tr>
          <tr>
            <td class="req-table-thread grey--text text--darken-1">
              名義人
            </td>
            <td>
              {{service.paymentMethod.name}}<br>
            </td>
          </tr>
          <tr>
            <td class="req-table-thread grey--text text--darken-1">
              メールアドレス
            </td>
            <td>
              <a :href="`mailto:${service.paymentMethod.email}`">
                {{service.paymentMethod.email}}
              </a>
            </td>
          </tr>
        </table>

      </v-card-text>

    </v-card>

    <Cancel
      :sp="device.isSp"
      :dialog="dialog"
      :service="service"
      @close="dialog=false"
      @cancel="onInit();dialog=false;"
    />

  </v-container>

</template>

<script>
import * as invoiceService from '@/service/invoice';
import Cancel from '@/components/invoice/Cancel.vue';

export default {
  name: 'Service',
  components: { Cancel },
  computed: {
    device() {
      return this.$store.getters['account/device'];
    },
  },
  data: () => ({
    loading: true,
    service: {
      subscriptionStatus: 0,
    },
    dialog: false,
  }),
  async created() {
    await this.onInit();
  },
  methods: {
    async onInit() {
      this.loading = true;

      try {
        const response = await invoiceService.fetchService();
        this.service = response.data;
        this.loading = false;
      } catch (err) {
        this.$store.commit('accounts/setError', err.response.data);
        this.loading = false;
      }
    },
    finish() {
      this.dialog = true;
    },
  },
};
</script>

<style scoped>
.text-nodecoration {
  text-decoration: none;
}
</style>
