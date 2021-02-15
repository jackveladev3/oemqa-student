<template>
  <v-container>

    <PaymentModal
      :paymentDialog="true"
      :sp="device.isSp"
      :isParent="true"
      :displayName="displayName"
    />

    <v-snackbar
      v-model="isPaid"
      bottom
      color="success"
      :timeout="timeout"
    >
      パイセンQのお申し込みが完了しました。<br>
      お申し込みありがとうございます。
    </v-snackbar>

  </v-container>

</template>

<script>
import PaymentModal from '@/components/app-bar/PaymentModal.vue';

export default {
  name: 'Payment',
  components: { PaymentModal },
  computed: {
    device() {
      return this.$store.getters['account/device'];
    },
  },
  data() {
    return {
      isPaid: false,
      timeout: 0,
      displayName: null,
    };
  },
  created() {
    if (this.$route.query.paid === 'success') this.isPaid = true;
    if (this.$route.query.dn) this.displayName = decodeURIComponent(this.$route.query.dn);
  },
};
</script>

<style scoped>
.text-nodecoration {
  text-decoration: none;
}
</style>
