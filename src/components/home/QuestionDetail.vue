<template>
  <v-dialog
    v-model="overlay"
    max-width="720px"
    scrollable
    @click:outside="$emit('close')"
    :fullscreen="sp"
    :hide-overlay="sp"
    :transition="sp ? 'slide-x-reverse-transition' : 'dialog-transition'"
  >
    <v-card>
      <v-toolbar dark color="success" :max-height="sp ? '104px' : '112px'">
        <v-btn icon dark @click="$emit('close')" color="white" v-if="!sp">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn large icon dark @click="$emit('close')" color="white" v-if="sp">
          <v-icon large>mdi-chevron-left</v-icon>
        </v-btn>
        <v-toolbar-title class="text-truncate">{{card.detail1}}</v-toolbar-title>

        <template v-slot:extension>
          <v-tabs
            v-model="tab"
            centered
            @change="change"
            grow
          >
            <v-tab>質問内容</v-tab>
            <v-tab>回答一覧</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-card-text class="pt-4" :class="tab===1 ? 'px-2' : ''">
        <v-tabs-items v-model="tab">
          <v-tab-item :value="0">
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
                  <v-icon
                    class="close"
                    @click="remove(i, 'question_img')"
                  >
                    fas fa-times-circle
                  </v-icon>
                </div>
              </div>
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
                  <v-icon
                    class="close"
                    @click="remove(i, 'answer_img')"
                  >
                    fas fa-times-circle
                  </v-icon>
                </div>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item :value="1">
            <div v-if="loading.answer">
              <v-skeleton-loader
                ref="skeleton"
                type="list-item-avatar-two-line,list-item-three-line,actions"
                class="mx-auto border mb-5"
                v-for="i in loader"
                :key="i"
              ></v-skeleton-loader>
            </div>
            <div v-else>
              <p v-if="!answers.length" class="answer">まだ回答はありません</p>
              <v-card
                class="mx-auto mb-5"
                outlined
                v-for="(item) in answers"
                :key="item.teacherId"
              >
                <v-card-title>
                  <v-img
                    alt="smartrador Logo"
                    class="shrink mr-2 avatar"
                    cover
                    :src="getAvatar(item.teacherId, item.photoId)"
                    width="36px"
                    height="36px"
                    v-if="item.photoFlag == '2'"
                    :class="item.sex == '2' ? 'fm' : ''"
                  />
                  <v-icon
                    v-else
                    class="mr-2"
                    :color="item.sex == '2' ? '#c51515' : '#00672f'"
                    large
                  >
                    fas fa-user-circle
                  </v-icon>
                  <div>
                    <div class="d-flex algin-center">
                      <p class="body-2 mb-0">{{item.initial}}</p>
                      <p class="body-2 grey--text text--darken-2 ml-2 mb-0">{{item.school}}</p>
                      <p class="body-2 grey--text text--darken-2 ml-2 mb-0">{{item.grade}}</p>
                      <v-img
                        alt="認定バッチ"
                        class="shrink ml-2 medal"
                        src="@/assets/medal.svg"
                        v-if="item.isCertified"
                      />
                    </div>
                    <p class="caption grey--text text--darken-2 mb-0">{{item.date}}</p>
                  </div>
                </v-card-title>
                <v-card-text>
                  <p class="answer">{{item.description}}</p>
                  <div class="d-flex flex-wrap">
                    <div v-for="(item, i) in item.images" :key="i" style="position:relative;">
                      <v-img
                        :src="answer_base_url + item + '.png'"
                        width="120px"
                        height="120px"
                        cover
                        transition="scale-transition"
                        class="shrink mb-2 mr-2 rounded"
                      />
                      <v-btn
                        icon
                        small
                        class="close"
                         eslint-disable-next-line max-len
                        @click="openUrl(answer_base_url + item + '.png')"
                      >
                        <v-icon small>far fa-window-restore</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <v-btn
                      small
                      icon
                      @click="item.comment=!item.comment"
                      color="success"
                      class="mr-3"
                    >
                      <v-icon small>far fa-comment-dots</v-icon>
                      <span>{{item.commentCnt}}</span>
                    </v-btn>
                    <div class="text-right">
                      <v-btn
                        small
                        :href="smartrador_url + '/teacher/page/' + item.teacherId"
                        target="_blank"
                        color="orange"
                        dark
                        class="font-weight-bold"
                      >
                        先生のプロフィールをみる<v-icon>mdi-chevron-right</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <div v-if="item.comment">
                    <QuestionComment :answer="item" :question="card" />
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>

      <v-card-actions class="border-top">
        <v-spacer></v-spacer>
        <v-btn
          color="grey darken-1"
          text
          :loading="loading.update"
          :disabled="!selected.subject || !selected.objective || loading.question"
          @click="patchQuestion('update')"
          v-if="card.status === 1 && tab === 0"
        >
          下書き保存
        </v-btn>

        <v-btn
          class="ml-2"
          color="green"
          :dark="publishState && !(noAccessAuthorizations && card.status===1)"
          :loading="loading.publish"
          :disabled="!publishState || (noAccessAuthorizations && card.status===1)"
          @click="patchQuestion('publish')"
          v-if="tab === 0"
        >
          <span v-if="card.status===1">質問する</span>
          <span v-if="card.status > 1">質問を更新する</span>
        </v-btn>

        <v-btn
          class="ml-2"
          color="primary"
          text
          :loading="loading.close"
          @click="patchQuestion('close')"
          v-if="tab === 1 && card.status > 1"
        >
          解決済みにする
        </v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
import Dropzone from '@/components/share/Dropzone.vue';
import constant from '@/service/constant';
import * as answerService from '@/service/answers';
import * as questionService from '@/service/questions';
import QuestionComment from './QuestionComment.vue';

export default {
  name: 'QuestionDetail',
  props: ['overlay', 'card', 'sp'],
  components: {
    Dropzone,
    QuestionComment,
  },
  computed: {
    api() {
      return this.$store.getters.api;
    },
    noAccessAuthorizations() {
      return this.$store.getters['account/noAccessAuthorizations'];
    },
    publishState() {
      let isPublish = false;

      if (this.loading.update || this.loading.close) isPublish = false;
      else if (!this.selected.objective) isPublish = false;
      else if (this.selected.objective < 3
        && this.selected.detail1
        && this.selected.detail2) isPublish = true;
      else if (this.selected.objective === 3 && this.selected.detail1) isPublish = true;

      return isPublish;
    },
  },
  data() {
    return {
      loading: {
        update: false,
        publish: false,
        answer: true,
        close: false,
      },
      selected: {},
      loader: 3,
      answers: [],
      tab: 0,
      mentor: {
        dialog: false,
        data: {},
      },
      constant,
      avatar_base_url: `${process.env.VUE_APP_S3}/users/public/`,
      question_base_url: `${process.env.VUE_APP_S3}/paisen/question/`,
      answer_base_url: `${process.env.VUE_APP_S3}/paisen/answer/`,
      smartrador_url: process.env.VUE_APP_SR,
    };
  },
  methods: {
    open(item) {
      this.selected = { ...item };
    },
    getDropzoneData(data) {
      setTimeout(() => {
        this.selected[data.key].push(data.fileId);
      }, 1000);
    },
    remove(i, key) {
      this.selected[key].splice(i, 1);
    },
    async patchQuestion(type) {
      this.loading[type] = true;

      try {
        await questionService.updateQuestion(this.card.questionId, type, {
          subject: this.selected.subject,
          objective: this.selected.objective,
          detail1: this.selected.detail1,
          detail2: this.selected.detail2,
          question_img: this.selected.question_img,
          answer_img: this.selected.answer_img,
          status: this.selected.status,
        });
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
    async getAnswers(questionId) {
      this.tab = 1;
      this.loading.answer = true;

      try {
        const response = await answerService.fetchAnswerList(questionId || this.item.questionId);
        this.answers = response.data.other;
        this.loading.answer = false;
      } catch (err) {
        this.$store.commit('questions/setError', err.response.data);
        this.loading.answer = false;
      }
    },
    getAvatar(teacherId, photoId) {
      return `${this.avatar_base_url}ap-northeast-1%3A${teacherId}/profile/${photoId}.medium.png`;
    },
    openUrl(url) {
      window.open(url, '_blank');
    },
    change(number) {
      if (number === 1) this.getAnswers(this.card.questionId);
    },
    closed() {
      this.mentor.dialog = false;
      setTimeout(() => {
        this.mentor.data = {};
      }, 300);
    },
    complete(conversationId) {
      this.$router.push({ path: `/chat?id=${conversationId}` });
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
