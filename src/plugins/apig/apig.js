/* eslint-disable no-underscore-dangle */
import apigClientFactory from 'aws-api-gateway-client';
import api from '@/service/api';
import cognito from '@/plugins/cognito';

export default class Apig {
  configure(config) {
    this.config = config;
  }

  static install = (Vue, options) => {
    Object.defineProperty(Vue.prototype, '$apig', {
      get() { return this.$root._apig; },
    });

    Vue.mixin({
      beforeCreate() {
        if (this.$options.apig) {
          this._apig = this.$options.apig;
          this._apig.configure(options);
        }
      },
    });
  }

  init() {
    return new Promise((resolve, reject) => {
      cognito.getCredentialsNoAuth()
        .then((credentials) => {
          this.apigClient = apigClientFactory.newClient({
            region: this.config.region,
            invokeUrl: this.config.invokeUrl,
            accessKey: credentials.data.Credentials.AccessKeyId,
            secretKey: credentials.data.Credentials.SecretKey,
            sessionToken: credentials.data.Credentials.SessionToken,
          });

          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  initNoAuth() {
    return new Promise((resolve, reject) => {
      cognito.getCredentialsNoAuth()
        .then((credentials) => {
          this.apigClient = apigClientFactory.newClient({
            region: this.config.region,
            invokeUrl: this.config.invokeUrl,
            accessKey: credentials.data.Credentials.AccessKeyId,
            secretKey: credentials.data.Credentials.SecretKey,
            sessionToken: credentials.data.Credentials.SessionToken,
          });

          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  invokeApi(pathParams, pathTemplate, method, additionalParams, body) {
    return new Promise((resolve, reject) => {
      this.init()
        .then(() => {
          this.apigInvokeApi(pathParams, pathTemplate, method, additionalParams, body)
            .then((data) => {
              resolve(data);
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  invokeApiNoAuth(pathParams, pathTemplate, method, additionalParams, body) {
    return new Promise((resolve, reject) => {
      this.initNoAuth()
        .then(() => {
          this.apigInvokeApi(pathParams, pathTemplate, method, additionalParams, body)
            .then((data) => {
              resolve(data);
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  apigInvokeApi(pathParams, pathTemplate, method, additionalParams, body) {
    return new Promise((resolve, reject) => {
      this.apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
        .then((response) => {
          resolve(response);
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  get(pathTemplate, pathParams, additionalParams, body, isNoAuth) {
    if (!isNoAuth) {
      return new Promise((resolve, reject) => {
        this.invokeApi(pathParams, pathTemplate, 'GET', additionalParams, body)
          .then((response) => {
            resolve(response);
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    }
    return new Promise((resolve, reject) => {
      this.invokeApiNoAuth(pathParams, pathTemplate, 'GET', additionalParams, body)
        .then((response) => {
          resolve(response);
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  post(pathTemplate, pathParams, additionalParams, body, isNoAuth) {
    if (!isNoAuth) {
      return new Promise((resolve, reject) => {
        this.invokeApi(pathParams, pathTemplate, 'POST', additionalParams, body)
          .then((response) => {
            resolve(response);
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    }
    return new Promise((resolve, reject) => {
      this.invokeApiNoAuth(pathParams, pathTemplate, 'POST', additionalParams, body)
        .then((response) => {
          resolve(response);
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  patch(pathTemplate, pathParams, additionalParams, body, isNoAuth) {
    if (!isNoAuth) {
      return new Promise((resolve, reject) => {
        this.invokeApi(pathParams, pathTemplate, 'PATCH', additionalParams, body)
          .then((response) => {
            resolve(response);
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    }
    return new Promise((resolve, reject) => {
      this.invokeApiNoAuth(pathParams, pathTemplate, 'PATCH', additionalParams, body)
        .then((response) => {
          resolve(response);
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  getSignedURL(file, additionalParams) {
    const pathTemplate = api.GETSIGNEDURL;
    const body = {
      contentType: file.type,
      fileName: file.name,
    };

    return new Promise((resolve, reject) => {
      this.invokeApi({}, pathTemplate, 'POST', additionalParams, body)
        .then((res) => {
          resolve(res || '/');
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
}
