import store from '../../store/index'
import Message from 'element-ui'
import { CheckCommonInfo } from '@/types/vuex'
import { OrderInfo } from '@/types/order'
import E from 'wangeditor'
import Vue from 'vue'
interface MapTitle {
  title: string
  key: string
}

type regNormal = 'isNum' | 'isEmail' | 'isPhone' | 'isNull'
const plugin = {
  getDataType(data: any) {
    if (data === null) {
      return 'Null'
    } else if (data === undefined) {
      return 'Undefined'
    }
    return Object.prototype.toString.call(data).split(' ')[1].split(']')[0]
  },
  clone<T extends any | any[]>(data: T): T {
    const selfThis = plugin
    const type = selfThis.getDataType(data)
    let newData = null
    if (type === 'Array') {
      newData = [] as any
      (data as any[]).forEach((item: any, index: any) => {
        newData[index] = selfThis.clone(item)
      })
    } else if (type === 'Object') {
      newData = {} as any
      let index: any
      for (index of Object.keys((data as any[]))) {
        newData[index] = selfThis.clone((data as any[])[index])
      }
    } else {
      newData = data ? JSON.parse(JSON.stringify(data)) : data
    }
    return newData
  },
  getHash(hashStr: string): object {
    const json = {} as any
    const params = hashStr.split('&&')
    params.forEach((item) => {
      const arr = item.split('=')
      json[arr[0]] = arr[1]
    })
    return json
  },
  mergeData: (datas: any[], rule: any) => {
    const selfThis = plugin
    const data = selfThis.clone(datas)
    const newData: any[] = []
    if (selfThis.getDataType(data) === 'Array') {
      data.forEach((item: any) => {
        const ruleType = selfThis.getDataType(rule.mainRule)
        const flag = newData.find((value: any) => {
          if (ruleType === 'Array') { // 处理根据多个key合并的情况
            const itemStr: any[] = []
            const valueStr: any[] = []
            rule.mainRule.forEach((itemMain: string) => {
              const mainName = itemMain.split('/')
              itemStr.push(item[mainName[0]])
              valueStr.push(value[mainName[1] || mainName[0]])
            })
            return itemStr.join('/') === valueStr.join('/')
          } else if (ruleType === 'String') {
            const mainName = rule.mainRule.split('/')
            return value[mainName[1] || mainName[0]] === item[mainName[0]]
          }
        }) as any
        const cloneItem = selfThis.clone(item) // clone其他项数据以方便保留
        if (!flag) {
          const obj = {} as any
          if (ruleType === 'Array') {
            rule.mainRule.forEach((itemRule: any) => {
              const mainName = itemRule.split('/')
              obj[mainName[1] || mainName[0]] = item[mainName[0]]
              delete cloneItem[mainName[0]]
            })
          } else if (ruleType === 'String') {
            const mainName = rule.mainRule.split('/')
            obj[mainName[1] || mainName[0]] = item[mainName[0]]
            delete cloneItem[mainName[0]]
          }
          if (selfThis.getDataType(rule.otherRule) === 'Array' && rule.otherRule.length > 0) {
            rule.otherRule.forEach((itemRule: any) => {
              const otherName = itemRule.name.split('/')
              obj[otherName[1] || otherName[0]] = item[otherName[0]]
              delete cloneItem[otherName[0]]
            })
          }
          if (rule.childrenName) {
            obj[rule.childrenName] = [cloneItem]
          } else {
            obj.childrenMergeInfo = [cloneItem]
          }
          newData.push(obj)
        } else {
          if (ruleType === 'Array') {
            rule.mainRule.forEach((itemMain: any) => {
              const mainName = itemMain.split('/')
              delete cloneItem[mainName[0]]
            })
          } else if (ruleType === 'String') {
            const mainName = rule.mainRule.split('/')
            delete cloneItem[mainName[0]]
          }
          if (selfThis.getDataType(rule.otherRule) === 'Array' && rule.otherRule.length > 0) {
            rule.otherRule.forEach((itemRule: any) => {
              const otherName = itemRule.name.split('/')
              delete cloneItem[otherName[0]]
              if (itemRule.type === 'add') {
                flag[otherName[1] || otherName[0]] = (Number(flag[otherName[1] || otherName[0]]) || 0) +
                  (Number(item[otherName[0]]) || 0)
              } else if (itemRule.type === 'concat') {
                flag[otherName[1] || otherName[0]] = flag[otherName[1] || otherName[0]].concat(item[otherName[0]])
              }
            })
          }
          if (rule.childrenName) {
            flag[rule.childrenName].push(cloneItem)
          } else {
            flag.childrenMergeInfo.push(cloneItem)
          }
        }
      })
      if (rule.childrenRule) {
        newData.forEach((item: any) => {
          item[rule.childrenName || 'childrenMergeInfo'] = selfThis.mergeData(item[rule.childrenName || 'childrenMergeInfo'], rule.childrenRule)
        })
      }
    } else {
      const type = selfThis.getDataType(data)
      throw new TypeError('An unknown error occurred from the mergeData function, and the parameter "data" expects to get an "array" but gets an "' + type + '"')
    }
    return newData
  },
  // 摊平数据
  flatten: (datas: any[]): any[] => {
    const self = plugin
    const oldData = self.clone(datas)
    const type = self.getDataType(oldData)
    if (type === 'Object') {
      for (const index of Object.keys(oldData)) {
        const item = oldData[index as any]
        const itemType = self.getDataType(item)
        if (itemType === 'Object') {
          const deleteProp = self.clone(item) // 保存一份需要处理的数据
          delete oldData[index as any]
          for (const hasKey in oldData) {
            if (deleteProp.hasOwnProperty(hasKey)) {
              throw new TypeError('存在相同的key值，无法执行')
            }
          }
          return self.flatten({ ...oldData, ...deleteProp })
        } else if (itemType === 'Array') {
          const newData = []
          const deleteProp = self.clone(item) // 保存一份需要处理的数据
          delete oldData[index as any]
          if (deleteProp.length < 1) {
            newData.push({ ...oldData })
          } else {
            deleteProp.forEach((itemDel: any) => {
              newData.push({ ...oldData, [index]: itemDel })
            })
          }
          return self.flatten(newData)
        }
      }
      return oldData
    } else if (type === 'Array') {
      for (const index of Object.keys(oldData)) {
        const item = oldData[index as any]
        const itemType = self.getDataType(item)
        if (itemType === 'Object') {
          oldData[index as any] = self.flatten(item)
        } else if (itemType === 'Array') {
          const newArr: any[] = []
          oldData.forEach((itemOld) => {
            newArr.push(...itemOld)
          })
          return self.flatten(newArr)
        }
      }
      return oldData
    } else {
      return oldData
    }
  },
  // 日期相差时间 用于计算过期时间
  diffDate(date: DateConstructor): string {
    if (!date) {
      return '日期格式错误'
    }
    const now = Date.parse(new Date().toString())
    const past = Date.parse(date.toString())
    const diff = now - past
    if ((diff / (24 * 60 * 60 * 1000)) > 30) {
      return '超过30天'
    } else if ((diff / (24 * 60 * 60 * 1000)) <= 30 && (diff / (24 * 60 * 60 * 1000)) > 1) {
      return parseInt((diff / (24 * 60 * 60 * 1000)).toString(), 0) + '天前'
    } else {
      if (diff / (60 * 60 * 1000) > 1) {
        return parseInt((diff / (60 * 60 * 1000)).toString(), 0) + '小时前'
      } else {
        if (diff / (60 * 1000) > 3) {
          return parseInt((diff / (60 * 1000)).toString(), 0) + '分钟前'
        } else {
          return '刚刚'
        }
      }
    }
  },
  // 日期相差时间，用于计算相差时间 ,比如离交货还有几天
  diffByDate(date: DateConstructor): number | string {
    if (!date) {
      return '日期格式错误'
    }
    const now = Date.parse(new Date().toString())
    const past = Date.parse(date.toString())
    const diff = past - now
    return (diff / (24 * 60 * 60 * 1000)).toFixed()
  },
  getDate(date?: Date, connector: string = '-'): string {
    date = date ? new Date(date) : new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [
      year,
      (month < 10 ? ('0' + month) : month),
      (day < 10 ? ('0' + day) : day)
    ].join(connector)
  },
  downloadExcel(data: any[], mapTitle: MapTitle[], excelName: string) {
    const orderElement = ''
    const aLink = document.createElement('a')
    const excelHeader = '<tr>' + mapTitle.map((item) =>
      '<td style="text-align:left">' + item.title + '</td>').join('') + '</tr>'
    const excelContent = data.map((itemData) => {
      return '<tr>' + mapTitle.map((itemTitle) =>
        '<td style="text-align:left">' + ((itemData[itemTitle.key] !== 0 && !itemData[itemTitle.key]) ?
          '' : itemData[itemTitle.key]) + '</td>').join('') + '</tr>'
    })
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
                      xmlns:x="urn:schemas-microsoft-com:office:excel"
                      xmlns="http://www.w3.org/TR/REC-html40">
                <meta http-equiv="content-type" content="application/vnd.ms-excel; charset="UTF-8">
                <head>
                  <!--[if gte mso 9]>
                  <xml>
                  <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                      <x:ExcelWorksheet>
                        <x:Name>${excelName || 'worksheet1'}</x:Name>
                        <x:WorksheetOptions>
                          <x:DisplayGridlines/>
                        </x:WorksheetOptions>
                      </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                  </x:ExcelWorkbook>
                  </xml>
                  <![endif]-->
                </head>
                <body>
                  ${orderElement}
                  <table>${excelHeader}${excelContent.join('')}</table>
                </body>
              </html>`
    const url = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html)
    aLink.href = url
    aLink.download = (excelName ? excelName + '-' : '') + new Date().getTime() + '.xls'
    aLink.click()
  },
  checkCommonInfo(info: CheckCommonInfo[]) {
    info.forEach((item) => {
      const checkInfo = item.checkWhich.split('/')
      // 是否强致刷新
      if (item.forceUpdate) {
        if (item.getInfoMethed && item.getInfoMethed === 'commit') {
          store.commit(checkInfo[0] + '/' + item.getInfoApi)
        } else {
          store.dispatch(checkInfo[0] + '/' + item.getInfoApi)
        }
      } else {
        if (!(store as any).state[checkInfo[0]][checkInfo[1]].status) {
          if (item.getInfoMethed && item.getInfoMethed === 'commit') {
            store.commit(checkInfo[0] + '/' + item.getInfoApi)
          } else {
            store.dispatch(checkInfo[0] + '/' + item.getInfoApi)
          }
        }
      }

    })
  },
  checkPhone(phoneNumber: string) {
    if (!(/^1[34578]\d{9}$/.test(phoneNumber))) {
      return false;
    }
    return true
  },
  checkIdCardNumber(idCardNumber: string) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(idCardNumber) === false) {
      return false;
    }
    return true
  },
  getQueryArgs(url: string) {
    let qs = (url.length > 0 ? url.substring(url.indexOf('?')).substr(1) : ''),
      //保存每一项
      args: any = {},
      //得到每一项
      items = qs.length ? qs.split('&') : [],
      item = null,
      name = null,
      value = null,
      i = 0,
      len = items.length;

    for (i = 0; i < len; i++) {
      item = items[i].split('='),
        name = decodeURIComponent(item[0])
      value = decodeURIComponent(item[1])
      if (name.length) {
        args[name] = value;
      }
    }
    return args;
  },
  addItem<T>(father: T[], son: T): void {
    father.push(son)
  },
  deleteItem(father: any[], index: number | string): void {
    father.splice(index as number, 1)
  },
  // 统一输入行逻辑
  copyInfo(info: any, keyArr: string[], callback?: Function) {
    info.forEach((item: any, index: number) => {
      if (index !== 0) {
        keyArr.forEach((key) => {
          item[key] = plugin.clone(info[0][key])
        })
      }
    })
    console.log(info)
    if (callback) {
      callback()
    }
  },
  // 表单验证，这里只验证对象，不验证数组，通常数组只要检测到某一次formCheck返回false即可停止验证
  // 第一个参数接收一个待验证对象 第二个参数接收一个待验证字段数组，如有特殊正则验证可以自定义new RegExp,通常我们只验证是否为空
  // regNormal:isNum | isEmail | isNull | isPhone
  // regNegate 对正则验证的结果是否取反
  formCheck(
    data: any,
    checkArr: Array<{ key: string, errMsg?: string, regExp?: RegExp, regNormal?: regNormal, regNegate?: boolean }>
  ): boolean {
    let msg = ''
    return checkArr.some((item) => {
      // 默认不需要正则验证，只验证是否为空
      if (!item.regExp) {
        if (!item.regNormal || item.regNormal === 'isNull') {
          if (!data[item.key] && data[item.key] !== '0' && data[item.key] !== 0) {
            msg = item.errMsg || '数据不得为空'
          }
        } else {
          if (item.regNormal === 'isNum') {
            msg = /^(-?\d+)(\.\d+)?$/.test(data[item.key]) ? msg : (item.errMsg || '请输入数字')
          } else if (item.regNormal === 'isEmail') {
            msg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
              .test(data[item.key]) ? msg : (item.errMsg || '请输入正确邮箱')
          } else if (item.regNormal === 'isPhone') {
            msg = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/.test(data[item.key]) ? msg : (item.errMsg || '请输入正确手机号')
          } else if (item.regNormal === 'checkArr') {
            // checkArr一般用于校验多选框，级联框的数据是否存在，就是校验数据长度
            msg = (Array.isArray(data[item.key]) && data[item.key].length > 0) ? msg : (item.errMsg || '请选择')
          }
        }
      } else {
        const result = item.regExp.test(data[item.key])
        if (item.regNegate ? !result : result) {
          msg = item.errMsg || '验证失败'
        }
      }
      if (msg) {
        Message.Message.error(msg)
      }
      return msg
    })
  },
  // 下载文件
  downLoadFile(url: string) {
    const aLink = document.createElement('a')
    aLink.href = url
    aLink.download = url
    aLink.click()
    aLink.remove()
  },
  // 对象数组查找id对应的name，一般用于下拉框的值查找对应的名称
  findId<T, K extends keyof T>(jsonArr: T[], id: number | string, returnKey: K, findKey: K): T[K] | string {
    const finded = jsonArr.find((item) => {
      return Number(item[findKey]) === Number(id)
    })
    if (finded) {
      return finded![returnKey]
    } else {
      return '无匹配值'
    }
  },
  // 设置localstorage
  setLocalStorage(name: string, info: any) {
    window.localStorage.setItem(name, info)
    Message.Message.success('已保存')
  },
  getLocalStorage(name: string) {
    return window.localStorage.getItem(name)
  },
  // 设置localstorage
  setSessionStorage(name: string, info: any) {
    window.sessionStorage.setItem(name, info)
    Message.Message.success('已保存')
  },
  getsessionStorage(name: string) {
    return window.sessionStorage.getItem(name)
  }
}
const submitLock = () => {
  let lock: boolean = true
  return function lockFun(messageStr: string = '请勿频繁点击') { // 采用闭包保存lock状态
    if (!lock) {
      Message.Message.warning(messageStr)
      return true
    }
    lock = false
    setTimeout(() => {
      lock = true
    }, 1000)
  }
}
const unique = (arr: any[], key: string) => {
  if (key) {
    const newArr: any[] = []
    arr.forEach((itemF: { [key: string]: number | string }) => {
      if (!newArr.find((itemFI: { [key: string]: number | string }) => itemFI[key] === itemF[key])) {
        newArr.push(itemF)
      }
    })
    return newArr
  } else {
    return [...new Set(arr)]
  }
}
// 编辑器通用创建
const initEditor = (item: any, index?: number) => {
  const id = index === 0 ? '#editor0' : ('#editor' + (index || ''))
  item.editor = new E(id)
  item.editor.config.menus = [
    'head', // 标题
    'bold', // 粗体
    'fontSize', // 字号
    'fontName', // 字体
    'italic', // 斜体
    'underline', // 下划线
    'strikeThrough', // 删除线
    'foreColor', // 文字颜色
    'backColor', // 背景颜色
    'link', // 插入链接
    'list', // 列表
    'justify', // 对齐方式
    'quote', // 引用
    'undo', // 撤销
    'redo' // 重复
  ]
  item.editor.config.onchange = (html: any) => {
    item.desc = html // 绑定当前逐渐地值
  }
  item.editor.config.height = 100
  item.editor.create()
  if (item.desc) {
    Vue.nextTick(() => {
      item.editor.txt.html(item.desc)
    })
  }
}
/**
 * @param {string} el 到达其视图的id
 * @returns {void|boolean}
 */
const goElView = (el: string) => {
  if (!el) {
    throw new TypeError('请传入element的"id"')
  }
  const ele = document.getElementById(el)
  if (ele) {
    ele.scrollIntoView(true)
  } else {
    return false
  }
}
// 123456转123，456
const formatNum = (num: number): string => {
  if (num === null || num === undefined) {
    return 'NaN'
  }
  const str: string = num.toString()
  const reg: RegExp = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}

/**
 * @param { number | string[number]} num:需要处理的数据
 * @param {number} precision 精度
 * @returns {number}
 */
const toFixedAuto = (num: number, precision: number = 2): number => {
  if (isNaN(Number(num))) {
    return NaN
  }
  if (precision === 0) {
    return Math.round(num)
  } else if (precision) {
    return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
  } else {
    return num
  }
}

// 一维数组切割成二维数组,接受一个一维数组和切割长度
const sliceToArray = (arr: any[], num: number) => {
  let newArr = []
  for (let i = 0; i < plugin.clone(arr).length; i = i + num) {
    newArr.push(plugin.clone(arr).slice(i, i + num))
  }
  return newArr
}

// 数组查重，有重复return true
const ifRepeatArray = (arr: string[]): boolean => {
  return Array.from(new Set(arr)).length !== arr.length
}

const formatDate = (formatStr: string, date: Date) => {
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

/**
 *获取日期区间的每一个日期，返回日期数组
 *@method getEveryDayDateByBetweenDate
 *@start_date {date} 开始日期 YYYY-MM-DD
 *@end_date   {date} 结束日期 YYYY-MM-DD
 *@return {arr} 返回日期数组
*/
function getEveryDayDateByBetweenDate(start_date: string, end_date: string, formatStr: string = 'YYYY-MM-DD') {
  var dateList = [start_date];
  if (start_date == end_date) return dateList;
  var i = 1;
  while (true) {
    let dateTime: any = new Date(dateList[i - 1]);
    dateTime = dateTime.setDate(dateTime.getDate() + 1);
    var date = formatDate(formatStr, new Date(dateTime))
    dateList.push(date);
    if (date == end_date) {
      break;
    }
    i++;
  }
  return dateList;
}

// 输入框防抖函数
function debounce(val: string, timer: any, fn: Function, time: number = 1000) {
  if (val) {
    if (timer) {
      clearTimeout(timer)
    } else {
      timer = setTimeout(fn(val), time)
    }
  } else {
    clearTimeout(timer)
  }
}

// 数字转汉字，网上抄的
function changeNumToHan(num: number): string {
  var arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  var arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿']
  if (!num || isNaN(num)) return '零'
  var english = num.toString().split('')
  var result = ''
  for (var i = 0; i < english.length; i++) {
    var des_i = english.length - 1 - i // 倒序排列设值
    result = arr2[i] + result
    var arr1_index = english[des_i]
    // @ts-ignore
    result = arr1[arr1_index] + result
  }
  result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十') // 将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零+/g, '零') // 合并中间多个零为一个零
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万') // 将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/亿万/g, '亿') // 将【亿万】换成【亿】
  result = result.replace(/零+$/, '') // 移除末尾的零
  // 将【一十】换成【十】
  result = result.replace(/^一十/g, '十')
  return result
}

/**
 *获取前后N天的日期，返回一个字符串
 *@method GetDateStr
 *@AddDayCount {number} AddDayCount天后
 *@formatStr   {string} 日期格式
 *@return {str} 返回AddDayCount天后的日期
*/
function GetDateStr(AddDayCount: number, formatStr: string = 'YYYY-MM-DD') {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
  return formatDate(formatStr, dd)
}
export default {
  install: (Vue: any) => {
    Vue.prototype.$getHash = plugin.getHash
    Vue.prototype.$clone = plugin.clone
    Vue.prototype.$getDataType = plugin.getDataType
    Vue.prototype.$mergeData = plugin.mergeData
    Vue.prototype.$diffDate = plugin.diffDate
    Vue.prototype.$diffByDate = plugin.diffByDate
    Vue.prototype.$getDate = plugin.getDate
    Vue.prototype.$downloadExcel = plugin.downloadExcel
    Vue.prototype.$checkCommonInfo = plugin.checkCommonInfo
    Vue.prototype.$addItem = plugin.addItem
    Vue.prototype.$checkPhone = plugin.checkPhone
    Vue.prototype.$checkIdCardNumber = plugin.checkIdCardNumber
    Vue.prototype.$getQueryArgs = plugin.getQueryArgs
    Vue.prototype.$deleteItem = plugin.deleteItem
    Vue.prototype.$submitLock = submitLock()
    Vue.prototype.$goElView = goElView
    Vue.prototype.$formatNum = formatNum
    Vue.prototype.$unique = unique
    Vue.prototype.$formCheck = plugin.formCheck
    Vue.prototype.$flatten = plugin.flatten
    Vue.prototype.$toFixed = toFixedAuto
    Vue.prototype.$openUrl = (url: string) => window.open(url)
    Vue.prototype.$downLoadFile = plugin.downLoadFile
    Vue.prototype.$ifRepeatArray = ifRepeatArray
    Vue.prototype.$findId = plugin.findId
    Vue.prototype.$sliceToArray = sliceToArray
    Vue.prototype.$copyInfo = plugin.copyInfo
    Vue.prototype.$setLocalStorage = plugin.setLocalStorage
    Vue.prototype.$getLocalStorage = plugin.getLocalStorage
    Vue.prototype.$setSessionStorage = plugin.setSessionStorage
    Vue.prototype.$getsessionStorage = plugin.getsessionStorage
    Vue.prototype.$initEditor = initEditor
    Vue.prototype.$formatDate = formatDate
    Vue.prototype.$getEveryDayDateByBetweenDate = getEveryDayDateByBetweenDate
    Vue.prototype.$GetDateStr = GetDateStr
    Vue.prototype.$debounce = debounce
    Vue.prototype.$changeNumToHan = changeNumToHan
  }
}
