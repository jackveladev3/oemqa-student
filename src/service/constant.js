module.exports = {
  SUBJECT: [
    {
      value: 1, text: '英語', bg: 'red darken-1', color: 'white',
    },
    {
      value: 2, text: '算数', bg: 'blue', color: 'white',
    },
    {
      value: 3, text: '中学数学', bg: 'blue darken-2', color: 'white',
    },
    {
      value: 4, text: '高校数学', bg: 'blue darken-4', color: 'white',
    },
    {
      value: 5, text: '理科', bg: 'green lighten-2', color: 'white',
    },
    {
      value: 6, text: '物理', bg: 'green darken-1', color: 'white',
    },
    {
      value: 7, text: '化学', bg: 'light-green darken-1', color: 'white',
    },
    {
      value: 8, text: '生物', bg: 'lime darken-1', color: 'white',
    },
    {
      value: 9, text: '地学', bg: 'teal darken-1', color: 'white',
    },
    {
      value: 10, text: '国語', bg: 'orange darken-1', color: 'white',
    },
    {
      value: 11, text: '古典', bg: 'deep-orange darken-1', color: 'white',
    },
    {
      value: 12, text: '社会', bg: 'brown darken-1', color: 'white',
    },
    {
      value: 13, text: 'その他', bg: 'grey darken-1', color: 'white',
    },
  ],
  OBJECTIVE: [
    { value: 1, text: '私の考えはどこがおかしいですか？' },
    { value: 2, text: '1つだけわからないところがあります' },
    { value: 3, text: 'ほとんど分かりません' },
  ],
  DETAIL_TEXT: {
    1: [
      'あなたが考えている内容や答えを教えてください',
      '不安な点や、確認したいことを書いてください',
    ],
    2: [
      'どこまで理解していますか？',
      '具体的にわからない部分を教えてください',
    ],
    3: [
      '質問の本文',
    ],
  },
  KANBAN: [
    { value: 'draft', text: '下書き', icon: 'mdi-file-hidden' },
    { value: 'active', text: '回答待ち', icon: 'mdi-timer-sand' },
    { value: 'done', text: '回答済み', icon: 'mdi-comment-text-outline' },
    { value: 'close', text: '解決済み', icon: 'mdi-check' },
  ],
};
