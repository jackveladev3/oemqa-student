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
    <v-card>
      <v-toolbar dark color="success" height="56px" max-height="56px">
        <v-toolbar-title>質問する</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pt-4">
        <p class="body-1">すぐに良い回答をもらうためのヒント</p>
        <div class="d-flex align-center mb-2">
          <v-icon small color="success" class="mr-2">far fa-check-circle</v-icon>質問は簡潔に要点をまとめてください
        </div>
        <div class="d-flex align-center mb-2">
          <v-icon small color="success" class="mr-2">far fa-check-circle</v-icon>誤字脱字がないか確認してください
        </div>
        <div class="d-flex align-center mb-2">
          <v-icon small color="success" class="mr-2">far fa-check-circle</v-icon>
          回答がつかない場合もあります
        </div>
        <div class="d-flex align-center mb-2">
          <v-icon small color="success" class="mr-2">far fa-check-circle</v-icon>
          できるだけ具体的な質問をしましょう
        </div>
        <div class="border-top my-4"></div>
        <v-select
          :items="constant.SUBJECT"
          label="まずは質問する科目を教えてください"
          color="success"
          v-model="selected.subject"
          required
        ></v-select>
        <v-select
          :items="constant.OBJECTIVE"
          label="質問の目的を教えてください"
          color="success"
          v-model="selected.objective"
          required
          v-if="selected.subject"
        ></v-select>
        <v-textarea
          v-model="selected.detail1"
          :label="constant.DETAIL_TEXT[selected.objective][0]"
          auto-grow
          color="success"
          required
          v-if="selected.objective"
        ></v-textarea>
        <v-textarea
          v-model="selected.detail2"
          :label="constant.DETAIL_TEXT[selected.objective][1]"
          auto-grow
          color="success"
          required
          v-if="selected.objective && constant.DETAIL_TEXT[selected.objective].length > 1"
        ></v-textarea>
        <div v-if="selected.objective" class="mb-4">
          <p>問題の画像を添付する</p>
          <div class="d-flex flex-wrap">
            <dropzone
              :type="'question'"
              @data="getDropzoneData"
              class="mb-2 mr-2"
            ></dropzone>
            <div v-for="(item, i) in selected.question_img" :key="i" style="position:relative;">
              <v-img
                :src="question_base_url + item + '.png'"
                width="120px"
                height="120px"
                cover
                transition="scale-transition"
                class="shrink mb-2 mr-2 rounded"
              />
              <v-icon class="close" @click="remove(i, 'question_img')">fas fa-times-circle</v-icon>
            </div>
          </div>
          <p class="caption mb-0">※1ファイル3MBまで</p>
        </div>
        <div v-if="selected.objective">
          <p>答えの画像を添付する</p>
          <div class="d-flex flex-wrap">
            <dropzone
              :type="'answer'"
              @data="getDropzoneData"
              class="mb-2 mr-2"
            ></dropzone>
            <div v-for="(item, i) in selected.answer_img" :key="i" style="position:relative;">
              <v-img
                :src="question_base_url + item + '.png'"
                width="120px"
                height="120px"
                cover
                transition="scale-transition"
                class="shrink mb-2 mr-2 rounded"
              />
              <v-icon class="close" @click="remove(i, 'answer_img')">fas fa-times-circle</v-icon>
            </div>
          </div>
          <p class="caption mb-0">※1ファイル3MBまで</p>
        </div>
      </v-card-text>

      <v-card-actions class="border-top">
        <v-spacer></v-spacer>

        <v-btn
          color="grey darken-1"
          text
          :loading="loading.draft"
          :disabled="!selected.subject
            || !selected.objective
            || loading.question
            || noAccessAuthorizations"
          @click="postQuestion('draft')"
        >
          下書き保存
        </v-btn>

        <v-btn
          color="green"
          :dark="publishState && !noAccessAuthorizations"
          :loading="loading.question"
          :disabled="!publishState || noAccessAuthorizations"
          @click="postQuestion('question')"
        >
          質問する
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Dropzone from '@/components/share/Dropzone.vue';
import constant from '@/service/constant';
import * as questionService from '@/service/questions';

export default {
  name: 'Question',
  props: ['dialog'],
  components: {
    Dropzone,
  },
  computed: {
    sp() {
      return this.$store.getters['account/device'].isSp;
    },
    noAccessAuthorizations() {
      return this.$store.getters['account/noAccessAuthorizations'];
    },
    publishState() {
      let isPublish = false;

      if (!this.selected.objective) isPublish = false;
      else if (this.selected.objective < 3
        && this.selected.detail1
        && this.selected.detail2) isPublish = true;
      else if (this.selected.objective === 3 && this.selected.detail1) isPublish = true;

      return isPublish;
    },
  },
  data() {
    return {
      selected: {
        subject: '',
        objective: '',
        detail1: '',
        detail2: '',
        question_img: [],
        answer_img: [],
      },
      loading: {
        draft: false,
        question: false,
      },
      constant,
      question_base_url: `${process.env.VUE_APP_S3}/paisen/question/`,
    };
  },
  methods: {
    getDropzoneData(data) {
      setTimeout(() => {
        this.selected[data.key].push(data.fileId);
      }, 1000);
    },
    remove(i, key) {
      this.selected[key].splice(i, 1);
    },
    async postQuestion(type) {
      this.loading[type] = true;

      try {
        await questionService.createQuestion(type, this.selected);
        await this.$store.dispatch('account/fetchAccount');

        this.$emit('complete');
        this.selected = {
          subject: '',
          objective: '',
          detail1: '',
          detail2: '',
          question_img: [],
          answer_img: [],
        };
        this.loading[type] = false;
      } catch (err) {
        this.$store.commit('questions/setError', err.response.data);
        this.loading[type] = false;
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
</style>
