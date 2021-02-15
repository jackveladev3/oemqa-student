<template>
  <div class="h-100 white">

    <v-container fluid class="h-100 d-flex align-center">
      <v-row v-if="!device.isSp">
        <v-col cols="12" md="3" v-for="item in constant.KANBAN" :key="item.value">
          <Kanban
            class="elevation-2"
            :status="item.value"
            :loading="loading"
            :list="list[item.value]"
            @openCard="openCard"
            @openAnswer="openAnswer"
            @onInit="onInit"
          />
        </v-col>
      </v-row>
      <div v-else class="w-100p">
        <v-tabs
          center-active
          show-arrows
          background-color="white"
          color="success"
          v-model="tab"
        >
          <v-tab
            v-for="item in constant.KANBAN"
            :key="item.value"
            class="d-none"
          >
            {{item.text}}
          </v-tab>

          <v-tab-item
            v-for="item in constant.KANBAN"
            :key="item.value"
            class="bg-origin"
          >
            <Kanban
              class="elevation-2"
              :status="item.value"
              :loading="loading"
              :list="list[item.value]"
              @openCard="openCard"
              @openAnswer="openAnswer"
              @onInit="onInit"
            />
          </v-tab-item>
        </v-tabs>
      </div>
    </v-container>

    <v-btn
      color="success"
      class="question-btn"
      @click.stop="dialog = true"
      height="60px"
      min-width="60px"
      width="60px"
    >
      <div class="text-center">
        <v-icon small class="mb-1">fas fa-pen</v-icon>
        <div class="caption">質問する</div>
      </div>
    </v-btn>

    <Question
      :dialog="dialog"
      @close="closeQuestion"
      @complete="closeQuestion();onInit();"
    />

    <QuestionDetail
      ref="QuestionDetail"
      :card="card"
      :overlay="overlay"
      :sp="device.isSp"
      @close="closed"
      @complete="closed();onInit();"
    />

    <v-bottom-navigation
      app
      grow
      :color="bottomNav[tab]"
      height="56px"
      :min-height="device.isiPhoneXSeries ? '70px' : '56px'"
      v-model="tab"
    >
      <v-btn :value="i" v-for="(item, i) in constant.KANBAN" :key="item.value">
        <span class="mt-1">{{item.text}}</span>
        <v-icon>{{item.icon}}</v-icon>
      </v-btn>
    </v-bottom-navigation>

  </div>
</template>

<script>
import Kanban from '@/components/home/Kanban.vue';
import Question from '@/components/home/Question.vue';
import QuestionDetail from '@/components/home/QuestionDetail.vue';
import constant from '@/service/constant';

export default {
  name: 'Home',
  components: {
    Kanban,
    Question,
    QuestionDetail,
  },
  computed: {
    device() {
      return this.$store.getters['account/device'];
    },
    user() {
      return this.$store.getters['account/data'];
    },
    list() {
      return this.$store.getters['questions/items'];
    },
    loading() {
      return this.$store.getters['questions/loading'];
    },
  },
  data: () => ({
    bottomNav: ['#4DABFF', '#FF954A', 'rgb(54, 195, 152)', '#FC78B9'],
    constant,
    dialog: false,
    overlay: false,
    card: {},
    tab: 1,
    reload: false,
    description: false,
  }),
  created() {
    this.onInit();
    if (this.user.isTutorial) this.$emit('tutorial');
  },
  methods: {
    async onInit() {
      await this.$store.dispatch('questions/fetchQuestionList', this.$route.query.id ? this.$route.query.id : 'list');

      if (this.$route.query.type === 'question') this.dialog = true;
      else if (this.$route.query.type === 'done') this.tab = 2;
      else if (this.list.selected && this.$route.query.type === 'answer') this.openAnswer(this.list.selected);
      else if (this.list.selected) this.openCard(this.list.selected);
    },
    closeQuestion() {
      this.dialog = false;
      this.deleteQuery(['type']);
    },
    openCard(item) {
      this.reload = true;

      this.setQuery([{
        key: 'id',
        value: item.questionId,
      }]);
      this.card = item;
      this.overlay = true;
      this.$refs.QuestionDetail.open(item);
    },
    openAnswer(item) {
      this.reload = true;

      this.setQuery([
        {
          key: 'id',
          value: item.questionId,
        },
        {
          key: 'type',
          value: 'answer',
        },
      ]);
      this.card = item;
      this.overlay = true;
      this.$refs.QuestionDetail.open(item);
      this.$refs.QuestionDetail.getAnswers(item.questionId);
    },
    closed() {
      this.overlay = false;
      this.deleteQuery(['id', 'type']);

      setTimeout(() => {
        this.card = {};
        this.$refs.QuestionDetail.tab = 0;
        this.$refs.QuestionDetail.answers = [];
        this.reload = false;
      }, 300);
    },
    setQuery(queries) {
      const query = { ...this.$route.query };
      let { path } = this.$route;

      // eslint-disable-next-line no-restricted-syntax
      for (const item of queries) {
        delete query[item.key];
        if (path === this.$route.path) path += `?${item.key}=${item.value}`;
        else path += `&${item.key}=${item.value}`;
      }

      this.$router.push({
        path,
        query,
      }, () => {});
    },
    deleteQuery(keyArray) {
      const query = { ...this.$route.query };

      // eslint-disable-next-line no-restricted-syntax
      for (const key of keyArray) {
        delete query[key];
      }

      this.$router.push({
        query,
      }, () => {});
    },
  },
};
</script>

<style scoped>
  /deep/ .v-slide-group__next,
  /deep/ .v-slide-group__prev,
  /deep/ .v-tabs-bar {
    display: none;
  }

  .rotate {
    transition: all 200ms ease-in;
  }

  .rotate.active {
    transform: rotate(90deg);
    transition-timing-function: ease-out;
  }

  .question-btn {
    z-index: 1;
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 60px;
    height: 60px;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 1px 6px 0px, rgba(0, 0, 0, 0.16) 0px 2px 32px 0px;
    border-radius: 50%;
    background: #00B050;
    transition: opacity 0.3s ease 0s;
    cursor: pointer;
  }
</style>
