import axios from 'axios'
import Message from 'element-ui'
import router from '../../router'
import qs from 'qs'
// 设置请求头
axios.defaults.headers.get['Content-Type'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'
axios.defaults.headers.delete['Content-Type'] = 'application/json'
// 请求超时时间
axios.defaults.timeout = 30000

// 在请求拦截器中 设置token,更新token
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token_type') + ' ' + window.sessionStorage.getItem('token')
  return config
}, (error) => {
  return Promise.reject(error)
})

// 回调拦截
axios.interceptors.response.use(
  // 请求成功回调
  (res) => {
    if (res.data.status) {
      // do nothing
      window.localStorage.setItem('lastActive',formatDate(new Date()))
    } else {
      if (res.data.code === 401) {
        Message.Message.error(res.data.msg)
        router.push('/login')
      } else {
        Message.Message.error(res.data.msg)
      }
    }
    // if (res.data.code === 200) {
    //   // do nothing
    // } else if (res.data.code === 406 || res.data.code === 402 || res.data.code === 403 || res.data.code === 404 || res.data.code === 405 || res.data.code === 500) {
    //   // do nothing 这个编码专门用于登录页面设置公司用
    //   Message.Message.error(res.data.msg)
    // } else if (res.data.code === 401) {
    //   Message.Message.error(res.data.msg)
    //   router.push('/login')
    // } else {
    //   Message.Message.error(res.data.msg)
    // }
    return res
  },
  // 请求失败回调
  (error) => {
    console.log(error)
    // router.push({ path: '/index/error/' + error.response.status })
    return Promise.reject(error)
  }
)
function get(url: string, params?: object) {
  params = typeof (params) === 'object' ? params : {}
  const response = axios({
    method: 'get',
    url,
    params
  })
  return Promise.resolve(response)
}

function post(url: any, params?: object | string, contentType?: string, responseType?: any) {
  params = typeof (params) === 'object' ? params : {}
  // 设置请求头
  let headers = {}
  if (contentType && contentType === 'application/json') {
    headers = { 'Content-Type': 'application/json' }
  } else if (contentType && contentType === 'form-data') {
    headers = {
      'Content-Type': 'multipart/form-data',
      'processData': false
    }
  } else {
    params = qs.stringify(params)
    headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
  // 设置响应头
  responseType = responseType || 'json'
  const response = axios({
    method: 'post',
    data: params,
    url,
    headers,
    responseType
  })
  return Promise.resolve(response)
}

const formatDate = (date: Date, formatStr: string = 'YYYY-MM-DD') => {
  var str = formatStr;
  var Week = ["日", "一", "二", "三", "四", "五", "六"];
  str = str.replace(/yyyy|YYYY/, date.getFullYear() + '');
  str = str.replace(
    /yy|YY/,
    //@ts-ignore
    date.getYear() % 100 > 9
      //@ts-ignore
      ? (date.getYear() % 100).toString()
      //@ts-ignore
      : "0" + (date.getYear() % 100)
  );
  str = str.replace(
    /MM/,
    date.getMonth() + 1 > 9
      ? (date.getMonth() + 1).toString()
      : "0" + (date.getMonth() + 1)
  );
  str = str.replace(/M/g, date.getMonth() + 1 + '');
  str = str.replace(/w|W/g, Week[date.getDay()]);
  str = str.replace(
    /dd|DD/,
    date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate()
  );
  str = str.replace(/d|D/g, date.getDate() + '');
  str = str.replace(
    /hh|HH/,
    date.getHours() > 9 ? date.getHours().toString() : "0" + date.getHours()
  );
  str = str.replace(/h|H/g, date.getHours() + '');
  str = str.replace(
    /mm/,
    date.getMinutes() > 9
      ? date.getMinutes().toString()
      : "0" + date.getMinutes()
  );
  str = str.replace(/m/g, date.getMinutes() + '');
  str = str.replace(
    /ss|SS/,
    date.getSeconds() > 9
      ? date.getSeconds().toString()
      : "0" + date.getSeconds()
  );
  str = str.replace(/s|S/g, date.getSeconds() + '');
  return str;
};

const http = {
  get,
  post
}
export default http
