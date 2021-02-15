<template>
  <div class="comment-area mt-5 rounded">
    <v-skeleton-loader
      ref="skeleton"
      type="list-item-avatar-two-line"
      class="mx-auto"
      v-if="loading.comment"
    ></v-skeleton-loader>
    <div v-else>
      <v-text-field
        :label="user.displayName"
        placeholder="コメント"
        v-model="text"
        background-color="white"
        rounded
        color="success"
      >
        <template v-slot:prepend>
          <v-img
            alt="smartrador Logo"
            class="shrink avatar"
            cover
            :src="user.pictureUrl"
            v-if="user.pictureUrl"
            width="24px"
            height="24px"
          />
          <v-icon v-else>fas fa-user-circle</v-icon>
        </template>
        <template v-slot:append-outer>
          <v-btn
            icon
            small
            color="success"
            @click="postComment('post', 'comment')"
            :loading="loading.post"
          >
            <v-icon small>fas fa-paper-plane</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      <div v-for="item in comments" :key="item.commentId" class="d-flex align-start">
        <v-img
          alt="smartrador Logo"
          class="shrink avatar mr-3"
          cover
          :src="getAvatar(item.teacherId, item.photoId)"
          v-if="item.type === 'teacher' && item.photoFlag !== '0'"
          width="24px"
          height="24px"
          :class="item.sex == '2' ? 'fm' : ''"
        />
        <v-img
          alt="smartrador Logo"
          class="shrink avatar mr-3"
          cover
          :src="item.photoId"
          v-else-if="item.type === 'student' && item.photoId"
          width="24px"
          height="24px"
          :class="item.sex == '2' ? 'fm' : ''"
        />
        <v-icon
          v-else
          :color="item.sex == '2' ? '#c51515' : '#00672f'"
          class="mr-3"
        >
          fas fa-user-circle
        </v-icon>
        <div>
          <div class="comment-area-list">
            <p class="caption mb-2">{{item.initial}} {{item.school}} {{item.grade}}</p>
            <p class="text-origin mb-1">{{item.comment}}</p>
          </div>
          <p class="mt-1 caption">{{item.date}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as answerService from '@/service/answers';

export default {
  name: 'QuestionComment',
  props: ['answer', 'question'],
  computed: {
    user() {
      return this.$store.getters['account/data'];
    },
    noAccessAuthorizations() {
      return this.$store.getters['account/noAccessAuthorizations'];
    },
  },
  data() {
    return {
      loading: {
        comment: false,
        post: false,
      },
      comments: [],
      text: '',
      env: process.env,
    };
  },
  created() {
    this.getComments(this.question.questionId);
  },
  methods: {
    async postComment(type, key) {
      this.loading[type] = true;

      try {
        await answerService.createComment(key, this.question.questionId, {
          answer: this.answer,
          text: this.text,
          studentId: this.user.studentId,
          type: 'student',
        });

        this.text = '';
        await this.getComments(this.question.questionId);
        this.loading[type] = false;
      } catch (err) {
        this.$store.commit('answers/setError', err.response.data);
        this.loading[type] = false;
      }
    },
    async getComments(questionId) {
      this.loading.comment = true;

      try {
        const response = await answerService.fetchAnswerComments(questionId, this.answer.teacherId);
        this.comments = response.data;
        this.loading.comment = false;
      } catch (err) {
        this.$store.commit('answers/setError', err.response.data);
        this.loading.comment = false;
      }
    },
    getAvatar(teacherId, photoId) {
      return `${this.env.VUE_APP_S3}/users/public/ap-northeast-1%3A${teacherId}/profile/${photoId}.medium.png`;
    },
  },
};
</script>

<style scoped lang="scss">
  .comment-area {
    background: #f9f7f5;
    padding: 14px;

    &-list {
      background: #fff;
      border-radius: 10px;
      padding: 4px 8px;
    }
  }
</style>
