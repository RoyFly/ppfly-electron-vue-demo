import Vue from 'vue';
import axios from 'axios'
import { Notify,Toast } from 'vant';
import store from '../../store'
import GLOBAL from '../globalVariable'

const instance = axios.create({

  // `url` is the server URL that will be used for the request
  url: '/',

  // `method` is the request method to be used when making the request
  method: 'post', // default

  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
  // to methods of that instance.
  baseURL: GLOBAL.baseAPI,

  withCredentials: true,

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  // timeout: 10000, // default is `0` (no timeout)

  // `responseEncoding` indicates encoding to use for decoding responses
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // default
});

/*
* 自定义配置
* 使用方法: apiTest.getTest({
*             wait: true,
*             waitMsg: '不要急哦, 正在为您快马加鞭中'
*          })
* */

// 自定义的配置
instance.custom = {
  wait: false, // 是否在请求数据的时候, 显示正在加载中, 默认不显示
  waitMsg: '正在加载...', // 加载中提示消息内容
};

// 加载中提示 (防止网络情况不好时, 用户一直点击提交按钮)
instance.__proto__.customLoading = function (msg) {
  instance.custom.wait = true;
  msg && (instance.custom.waitMsg = msg);
}

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log("拦截到请求啦")

  // 添加时间戳
  config.params = {...config.params, timestamp: Date.now()};
    if(store){
        config.headers['Authorization'] = store.getters['request/Authorization'];
    }


  // 进行url格式化  统一加.sp   (后台验证方面的问题)
  let currUrl = config.url;
  if (currUrl.indexOf('.') == -1) {
    var wenhaoIndex = currUrl.indexOf('?');
    if (wenhaoIndex > -1) {
      currUrl = currUrl.slice(0, wenhaoIndex) + '.sp' + currUrl.slice(wenhaoIndex)
    } else {
      currUrl += '.sp';
    }
    config.url = currUrl;
  }


  // config.data 不能为空  不然后台的 @RequestBody 会出问题
  if (config.data == undefined) {
    config.data = {};
  }


  // 需要显示加载中----特效
  if (instance.custom.wait == true) {
    // 显示加载进度条
    Toast.loading({
      message: instance.custom.waitMsg || "正在加载...",
      forbidClick: true, // 是否禁止背景点击
      duration: 0, // 展示时长(ms)，值为 0 时，toast 不会消失
    });
  }



  return config;
}, function (error) {
  // 对请求错误做些什么
  console.log("请求出现错误了", error)
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {

  // 本次数据请求的状态
  var currState = true;

  if (instance.custom.wait) {
    // 下一次请求默认不显示加载中特效
    instance.custom.wait = false;
    Toast.clear();
  }

  // console.log(JSON.parse(response.data))

  // 服务器内部错误
  if (typeof (response.data) == "string" && response.data.substring(1, 14) == '!DOCTYPE html') {
     Notify({ type: 'danger', message: '服务器开小差啦' });
    currState = false;
  }

  // 参数错误
  else if (response.data.code != 100) {
    if (response.data.message) {
      Notify({ type: 'danger', message: response.data.message});
    } else {
      Notify({ type: 'danger', message: '服务器开小差啦' });
    }

    currState = false;
  }

  // 后台接口没有返回正确的数据格式
  else if (response.data.code == null || response.data.code == undefined) {
    if (response.data["body"]) {
      let body = response.data["body"];
      if (body.code) {
        if (body.code != 100) {
          Notify({type: 'danger', message: "错误的数据格式"});
          currState = false;
        }
      }
    } else {
      Notify({type: 'danger', message: "错误的数据格式"});
      currState = false;
    }

  }


  if (!currState) {
    console.log("http请求出错了---------------------");
    console.log(JSON.parse(JSON.stringify(response)));
    console.log("------------------------------------------");

    // 清空数据, 防止页面得到错误的数据, 解析报错
    response.data = {};
  }

  // console.log(response.data)

  return response.data.content || (response.data["body"] ? response.data["body"].content : '');

}, function (error) {
  // 对响应错误做点什么
  console.log("响应出现错误");
  console.log(error);
  console.log(error.response.data.message, error.toJSON());
// alert("响应出现错误了")

  // 关闭请求中遮罩
  if (instance.custom.wait) {
    // 下一次请求默认不显示加载中特效
    instance.custom.wait = false;
    Toast.clear();
  }

  // 提示用户
  Notify({ type: 'danger', message: error.response.data.message || '服务器开小差啦' });



  //============  报错的详细信息  ==================
  // console.log(error.response.data);
  // console.log(error.response.status);
  // console.log(error.response.headers);
  // console.log('request', error.request);
  // console.log('Error', error.message);
  // console.log(error.config);

  return Promise.reject(error);
});

Vue.prototype.$request = instance;

export default instance