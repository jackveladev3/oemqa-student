/* eslint-disable */
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

export default class Cognito {
  configure(config) {
    this.config = config;
    AWS.config.region = config.Region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: config.IdentityPoolId,
    });
    this.options = config;
  }

  static install = (Vue, options) => {
    Object.defineProperty(Vue.prototype, '$cognito', {
      get() { return this.$root._cognito; },
    });

    Vue.mixin({
      beforeCreate() {
        if (this.$options.cognito) {
          this._cognito = this.$options.cognito;
          this._cognito.configure(options);
        }
      },
    });
  }

  /**
   * ログアウト
   */
  logout() {
    const cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser != null) {
      if (AWS.config.credentials && AWS.config.credentials.clearCachedId) {
        AWS.config.credentials.clearCachedId();
      }
      cognitoUser.signOut();
    }
  }

  /**
   * ログインしているかの判定とアクセストークン取得
   */
  isAuthenticated() {
    const cognitoUser = this.userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      if (cognitoUser === null) {
        console.log('cognitoUser is none');
        reject(cognitoUser);
      }
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
        } else if (!session.isValid()) {
          this.refreshSession(cognitoUser, session)
            .then((newSession) => {
              this.getCredentials(newSession)
                .then((credentials) => {
                  resolve(credentials);
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          this.getCredentials(session)
            .then((credentials) => {
              resolve(credentials);
            })
            .catch((err) => {
              reject(err);
            });
        }
      });
    });
  }

  /**
  * クレデンシャル情報の取得
  */
  async getCredentials() {
    return new Promise((resolve, reject) => {
      if (!window.liff.isLoggedIn()) return reject('not logged in');

      console.log(window.liff.getIDToken());
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.config.IdentityPoolId,
        Logins: {
          'access.line.me': window.liff.getIDToken(),
        },
      });
      AWS.config.credentials.get((err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(AWS.config.credentials);
        }
      });
    });
  }

  /**
   * 未承認ユーザーのcredential取得
   */
  getCredentialsNoAuth() {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.config.IdentityPoolId,
    });

    return new Promise((resolve, reject) => {
      AWS.config.credentials.get((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(AWS.config.credentials);
        }
      });
    });
  }

  /**
  * リフレッシュ
  */
  refreshSession(cognitoUser, session) {
    const RefreshToken = new CognitoRefreshToken({ RefreshToken: session.getRefreshToken().getToken() });
    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(RefreshToken, (err, newSession) => {
        if (err) reject(err);
        else resolve(newSession);
      });
    });
  }
}
