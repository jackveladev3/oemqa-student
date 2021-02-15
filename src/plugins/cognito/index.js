import Vue from 'vue';
import Cognito from './cognito';

Vue.use(Cognito, {
  Region: process.env.VUE_APP_COGNITO_REGION,
  IdentityPoolId: process.env.VUE_APP_COGNITO_IDENTITY_POOL_ID,
});

export default new Cognito();
