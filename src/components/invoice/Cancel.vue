<template>

  <v-dialog
    v-model="dialog"
    max-width="720px"
    scrollable
    @click:outside="$emit('close')"
    :fullscreen="sp"
    :hide-overlay="sp"
    :transition="sp ? 'dialog-bottom-transition' : 'dialog-transition'"
  >
    <v-card v-if="service.subscriptionStatus">

      <v-toolbar dark color="error" height="56px" max-height="56px">
        <v-toolbar-title>サービスを解約する</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pt-4">

        <div>
          <p class="text-origin body-1">サービスの解約についての注意事項</p>
          <div
            class="d-flex align-center mb-2 red--text"
            v-if="service.subscriptionStatus !== 1"
          >
            <v-icon small color="error" class="mr-2">fas fa-exclamation-triangle</v-icon>
            本日解約手続きをすると、{{service.nextInvoiceDate}}にサービスが解約されます
          </div>
          <div class="d-flex align-center mb-2 red--text" v-else>
            <v-icon small color="error" class="mr-2">fas fa-exclamation-triangle</v-icon>
            解約手続きをすると、パイセンQのご利用ができなくなります
          </div>
          <div class="d-flex align-center mb-2 red--text">
            <v-icon small color="error" class="mr-2">fas fa-exclamation-triangle</v-icon>
            次回の引き落としは発生しません
          </div>
          <div class="d-flex align-center mb-2 red--text">
            <v-icon small color="error" class="mr-2">fas fa-exclamation-triangle</v-icon>
            一度解約すると取り消すことができませんのでご了承ください
          </div>
        </div>

        <v-divider class="pb-5"></v-divider>

        <p class="body-2 text-origin">
          本当にサービスを解約しますか？<br>
          解約する場合は解約理由を入力の上、「解約する」ボタンを押してください
        </p>

        <v-textarea
          v-model="reason"
          label="解約する理由を教えてください"
          auto-grow
          required
          outlined
        ></v-textarea>

      </v-card-text>

      <v-card-actions class="border-top">
        <v-spacer></v-spacer>

        <v-btn
          color="grey darken-3"
          text
          :disabled="loading"
          @click="$emit('close')"
        >
          解約しない
        </v-btn>

        <v-btn
          color="error"
          text
          :loading="loading"
          @click="cancel"
        >
          解約する
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>
import * as invoiceService from '@/service/invoice';

export default {
  name: 'Cancel',
  props: ['dialog', 'service', 'sp'],
  computed: {
    user() {
      return this.$store.getters['account/data'];
    },
  },
  data() {
    return {
      loading: false,
      reason: '',
    };
  },
  methods: {
    async cancel() {
      this.loading = true;

      try {
        await invoiceService.quitSubscription(this.reason);
        this.$store.commit('account/setData', {
          ...this.user,
          subscriptionStatus: this.user.subscriptionStatus === 2 ? 3 : 4,
        });

        this.$emit('cancel');
        this.reason = '';
        this.loading = false;
      } catch (err) {
        this.$store.commit('account/setError', err.response.data);
        this.loading = false;
      }
    },
  },
};
</script>
