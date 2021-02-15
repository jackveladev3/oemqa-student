<template>
  <v-card class="kanban" :class="status">
    <div class="pt-3 px-3 mb-2 d-flex justify-space-between align-center">
      <span class="body-2 font-weight-bold">{{title[status]}}</span>
      <v-chip small>{{list.length}}</v-chip>
    </div>
    <div class="ma-3">
      <v-skeleton-loader
        ref="skeleton"
        :type="type"
        class="mx-auto"
        elevation="2"
        v-if="loading"
      ></v-skeleton-loader>
    </div>
    <div v-if="!loading" class="list-area px-3">
      <v-card
        color="white"
        class="pa-3 mb-3"
        hover
        v-for="item in list"
        :key="item.questionId"
        @click="$emit('openCard', item)"
      >
        <div class="d-flex align-center justify-space-between mb-3">
          <v-chip
            small
            :color="constant.SUBJECT[item.subject - 1].bg"
            :text-color="constant.SUBJECT[item.subject - 1].color"
            class="font-weight-bold"
          >
            {{constant.SUBJECT[item.subject - 1].text}}
          </v-chip>
          <p class="overline mb-0 grey--text text--darken-1 text-right">{{item.date}}</p>
        </div>
        <p class="body-2 text-truncate mb-0">{{item.detail1 || '未設定'}}</p>
        <p
          class="caption grey--text text--darken-1 text-truncate mb-0"
          v-if="constant.DETAIL_TEXT[item.objective].length > 1"
        >
          {{item.detail2}}
        </p>
        <div class="d-flex align-center mt-2">
          <v-spacer></v-spacer>
          <v-btn
            icon
            x-small
            class="mr-4"
            @click="$emit('openAnswer', item)"
            v-if="item.answer_cnt"
          >
            <v-icon x-small>fas fa-pen</v-icon>{{item.answer_cnt}}
          </v-btn>
          <v-menu offset-y >
            <template v-slot:activator="{ on }">
              <v-btn icon x-small v-on="on">
                <v-icon x-small>fas fa-ellipsis-h</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item dense @click="deleteQuestion(item)">
                <v-list-item-title>削除する</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import Constant from '@/service/constant';
import * as questionService from '@/service/questions';

export default {
  name: 'Kanban',
  props: ['status', 'loading', 'list'],
  data: () => ({
    type: 'article',
    title: {
      draft: '下書き',
      active: '回答待ち',
      done: '回答済み',
      close: '解決済み',
    },
    constant: Constant,
  }),
  methods: {
    async deleteQuestion(item) {
      this.$store.commit('questions/setLoading', true);

      try {
        await questionService.updateQuestion(item.questionId, 'delete', {
          subject: item.subject,
          objective: item.objective,
          detail1: item.detail1,
          detail2: item.detail2,
          question_img: item.question_img,
          answer_img: item.answer_img,
          status: item.status,
        });
        this.$emit('onInit');
      } catch (err) {
        this.$store.commit('questions/setError', err.response.data);
        this.$store.commit('questions/setLoading', false);
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .kanban {
    border-top: 10px solid rgb(54, 195, 152);
    background: #f9f7f5;
    height: calc(100vh - 290px);
  }

  .draft {
    border-color: #4DABFF;
  }

  .active {
    border-color: #FF954A;
  }

  .done {
    border-color: rgb(54, 195, 152);
  }

  .close {
    border-color: #FC78B9;
  }

  .list-area {
    height: calc(100% - 49px);
    overflow: auto;
  }

  @media (max-width:600px) {
    .kanban {
      height: calc(100vh - 180px);
    }
  }
</style>
