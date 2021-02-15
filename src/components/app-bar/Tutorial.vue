<template>
  <v-dialog
    v-model="dialog"
    max-width="720px"
    scrollable
    no-click-animation
    persistent
    transition="dialog-transition"
  >
    <v-card>
      <v-carousel
        height="450px"
        :show-arrows="false"
        v-model="slide"
      >
        <v-carousel-item
          v-for="(fileName, i) in slides"
          :key="i"
          color="green darken-1"
        >
          <v-sheet
            height="100%"
            color="green darken-1"
          >
            <v-img
              v-if="fileName"
              height="100%"
              width="100%"
              :src="require('@/assets/' + fileName)"
              class="shrink"
              contain
            />
            <v-row
              no-gutters
              class="fill-height"
              align="center"
              justify="center"
              v-if="i === slides.length - 1"
            >
              <div class="text-center w-100p white pa-5">
                <p class="text-origin body-2">
                  パイセンQはprdが学研ホールディングスとのコラボレーションにより提供するサービスです
                </p>
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
                <v-btn
                  @click="$emit('close')"
                  class="mt-5"
                  color="teal"
                >
                  はじめる
                </v-btn>
                <div class="mt-5 red--text caption d-none">準備中のため、しばらくお待ちください</div>
                <div class="grey--text mt-5 d-flex align-center caption justify-center flex-wrap">
                  <v-btn
                    text
                    @click="moveToTerms()"
                    class="primary--text px-0 caption"
                  >
                    利用規約
                  </v-btn>
                  ・
                  <v-btn
                    text
                    href="https://smartrador.com/family/policy.html"
                    target="_blank"
                    class="primary--text px-0 caption"
                  >
                    プライバシーポリシー
                  </v-btn>
                  に同意の上でお進みください
                </div>
              </div>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-card>

  </v-dialog>
</template>

<script>
export default {
  name: 'TutorialModal',
  props: ['dialog', 'sp', 'isRestart'],
  data() {
    return {
      slides: [
        'tutorial-1.jpg',
        'tutorial-2-new.jpg',
        'tutorial-3.jpg',
        '',
      ],
      slide: 0,
    };
  },
  methods: {
    moveToTerms() {
      this.$router.push({ name: 'Terms' });
      this.$emit('close');
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
