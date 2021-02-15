<template>
  <div>
    <v-dialog
      v-model="paymentDialog"
      max-width="720px"
      scrollable
      @click:outside="$emit('close')"
      :fullscreen="sp"
      :hide-overlay="sp"
      :transition="sp ? 'slide-x-reverse-transition' : 'dialog-transition'"
    >
      <v-card>
        <v-toolbar color="white" :max-height="sp ? '56px' : '64px'">
          <v-btn icon @click="$emit('close')" color="grey" v-if="!sp && !isParent">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn large icon @click="$emit('close')" color="grey" v-if="sp && !isParent">
            <v-icon large>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title class="text-truncate">パイセンQのご利用の流れ</v-toolbar-title>
        </v-toolbar>

        <v-card-text class="px-0 pb-0">
          <p class="mb-0 pa-3" v-if="!isParent">
            クレジットカードをお持ちでない方は「保護者にお願いする」を押してください。<br>
            LINEメッセージが届くので、保護者に転送しましょう！
          </p>
          <p class="mb-0 pa-3 success--text" v-else>
            {{displayName}}さんのパイセンQの利用申し込みを行います。
          </p>
          <div class="pa-3 d-flex align-center h-100 grey lighten-4">

            <v-timeline :dense="sp">

              <v-timeline-item
                color="orange"
                v-if="!isRestart"
              >

                <v-card>

                  <v-card-title class="orange white--text body-1 font-weight-bold">
                    1.無料で質問してみる
                  </v-card-title>

                  <v-card-text class="pt-3">
                    勉強でつまづいたら写真をとって投稿しよう！質問をみた先生から回答が届きます。毎月3問まで無料でお試しいただけます。
                  </v-card-text>

                </v-card>

              </v-timeline-item>

              <v-timeline-item
                color="success"
                v-if="!isRestart"
              >

                <v-card>

                  <v-card-title class="success white--text body-1 font-weight-bold">
                    2.クレジットカードの登録
                  </v-card-title>

                  <v-card-text class="pt-3">
                    クレジットカード情報をご登録いただき有料プランをご利用いただくと、質問し放題となります！
                  </v-card-text>

                </v-card>

              </v-timeline-item>

              <v-timeline-item
                color="primary"
              >

                <v-card>

                  <v-card-title class="primary white--text body-1 font-weight-bold">
                    <span v-if="!isRestart">3.</span>月額料金の引落とし
                  </v-card-title>

                  <v-card-text class="pt-3">
                    ご登録いただいたカードから自動的に月額料金500円(税別)が引き落とされます。
                    その後は質問数によらず毎月、月額利用料が引き落とされます。
                  </v-card-text>

                </v-card>

              </v-timeline-item>

            </v-timeline>
          </div>
        </v-card-text>

        <v-card-actions class="border-top">
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            text
            dark
            :loading="loading.parent"
            @click="sendParent"
            v-if="!isParent"
          >
            保護者にお願いする
          </v-btn>

          <stripe-checkout
            ref="checkoutRef"
            :pk="pk"
            :session-id="stripe.sessionId"
          >
            <template slot="checkout-button">
              <v-btn
                color="orange"
                dark
                @click="checkout"
                class="font-weight-bold ml-2"
                :loading="loading.stripe"
              >
                お申し込みに進む
              </v-btn>
            </template>
          </stripe-checkout>
        </v-card-actions>
      </v-card>

    </v-dialog>

    <v-snackbar
      v-model="isSent"
      bottom
      color="success"
      :timeout="timeout"
    >
      LINEメッセージを送信しました。トーク画面を確認してください。
      <v-btn
        dark
        text
        @click="isSent=false"
      >
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { StripeCheckout } from 'vue-stripe-checkout';
import * as invoiceService from '@/service/invoice';

export default {
  name: 'PaymentModal',
  components: { StripeCheckout },
  props: ['paymentDialog', 'sp', 'isRestart', 'isParent', 'displayName'],
  data() {
    return {
      loading: {
        parent: false,
        stripe: false,
      },
      stripe: {
        sessionId: null,
      },
      pk: process.env.VUE_APP_STRIPE,
      isSent: false,
      timeout: 0,
    };
  },
  methods: {
    async checkout() {
      this.loading.stripe = true;

      if (!this.isParent) {
        try {
          const response = await invoiceService.checkout();

          this.stripe.sessionId = response.data.sessionId;
          this.$refs.checkoutRef.redirectToCheckout();
        } catch (err) {
          this.$store.commit('accounts/setError', err.response.data);
          this.loading.stripe = false;
        }
      } else {
        this.stripe.sessionId = this.$route.query.id;
        this.$refs.checkoutRef.redirectToCheckout();
      }
    },
    async sendParent() {
      this.loading.parent = true;

      try {
        await invoiceService.sendParent();
        this.isSent = true;
        this.loading.parent = false;
      } catch (err) {
        this.$store.commit('accounts/setError', err.response.data);
        this.loading.parent = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .close {
    position: absolute;
    top: 0px;
    right: 8px;
    background: #ffffff;
    border-radius: 50%;
  }

  .answer {
    color: #212121;
    white-space: pre-line;
  }
</style>
