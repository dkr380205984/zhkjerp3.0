import store from '../../store/index'
import Message from 'element-ui'
import { CheckCommonInfo } from '@/types/vuex'
import { OrderInfo } from '@/types/order'
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
          item[key] = info[0][key]
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
  }
}
