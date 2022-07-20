import { CascaderInfo } from '@/types/vuex'
const systemModule = [{
  id: 1,
  name: '报价管理',
  detail: [{
    id: '1-1',
    name: '添加单据',
  }, {
    id: '1-2',
    name: '修改单据',
  }, {
    id: '1-3',
    name: '单据列表',
  }, {
    id: '1-4',
    name: '删除单据',
  }]
}, {
  id: 2,
  name: '样单管理',
  detail: [{
    id: '2-1',
    name: '添加单据',
  }, {
    id: '2-2',
    name: '修改单据',
  }, {
    id: '2-3',
    name: '单据列表',
  }, {
    id: '2-4',
    name: '删除单据',
  }]
}, {
  id: 3,
  name: '订单管理',
  detail: [{
    id: '3-1',
    name: '添加单据',
  }, {
    id: '3-2',
    name: '修改单据',
  }, {
    id: '3-3',
    name: '单据列表',
  }, {
    id: '3-4',
    name: '删除单据',
  }]
}, {
  id: 4,
  name: '物料计划',
  detail: [{
    id: '4-1',
    name: '添加单据',
  }, {
    id: '4-2',
    name: '修改单据',
  }, {
    id: '4-3',
    name: '单据列表',
  }, {
    id: '4-4',
    name: '删除单据',
  }]
}, {
  id: 5,
  name: '原料管理',
  detail: [{
    id: '5-1',
    name: '添加单据',
  }, {
    id: '5-2',
    name: '修改单据',
  }, {
    id: '5-3',
    name: '单据列表',
  }, {
    id: '5-4',
    name: '删除单据',
  }]
}, {
  id: 6,
  name: '辅料管理',
  detail: [{
    id: '6-1',
    name: '添加单据',
  }, {
    id: '6-2',
    name: '修改单据',
  }, {
    id: '6-3',
    name: '单据列表',
  }, {
    id: '6-4',
    name: '删除单据',
  }]
}, {
  id: 7,
  name: '物料出入库',
  detail: [{
    id: '7-1',
    name: '添加单据',
  }, {
    id: '7-2',
    name: '修改单据',
  }, {
    id: '7-3',
    name: '单据列表',
  }, {
    id: '7-4',
    name: '删除单据',
  }]
}, {
  id: 8,
  name: '生产计划',
  detail: [{
    id: '8-1',
    name: '添加单据',
  }, {
    id: '8-2',
    name: '修改单据',
  }, {
    id: '8-3',
    name: '单据列表',
  }, {
    id: '8-4',
    name: '删除单据',
  }]
}, {
  id: 9,
  name: '产品检验',
  detail: [{
    id: '9-1',
    name: '添加单据',
  }, {
    id: '9-2',
    name: '修改单据',
  }, {
    id: '9-3',
    name: '单据列表',
  }, {
    id: '9-4',
    name: '删除单据',
  }]
}, {
  id: 10,
  name: '装箱计划',
  detail: [{
    id: '10-1',
    name: '添加单据',
  }, {
    id: '10-2',
    name: '修改单据',
  }, {
    id: '10-3',
    name: '单据列表',
  }, {
    id: '10-4',
    name: '删除单据',
  }]
}, {
  id: 11,
  name: '包装管理',
  detail: [{
    id: '11-1',
    name: '添加单据',
  }, {
    id: '11-2',
    name: '修改单据',
  }, {
    id: '11-3',
    name: '单据列表',
  }, {
    id: '11-4',
    name: '删除单据',
  }]
}, {
  id: 12,
  name: '仓库管理',
  detail: [{
    id: '12-1',
    name: '纱线仓库',
  }, {
    id: '12-2',
    name: '面料仓库',
  }, {
    id: '12-3',
    name: '辅料仓库',
  }, {
    id: '12-4',
    name: '产品仓库',
  }]
}, {
  id: 13,
  name: '客户与合作商管理',
  detail: [{
    id: '13-1',
    name: '添加单据',
  }, {
    id: '13-2',
    name: '修改单据',
  }, {
    id: '13-3',
    name: '单据列表',
  }, {
    id: '13-4',
    name: '删除单据',
  }]
}, {
  id: 14,
  name: '原料预订购',
  detail: [{
    id: '14-1',
    name: '添加单据',
  }, {
    id: '14-2',
    name: '修改单据',
  }, {
    id: '14-3',
    name: '单据列表',
  }, {
    id: '14-4',
    name: '删除单据',
  }]
}, {
  id: 15,
  name: '工艺单管理',
  detail: [{
    id: '15-1',
    name: '添加单据',
  }, {
    id: '15-2',
    name: '修改单据',
  }, {
    id: '15-3',
    name: '单据列表',
  }, {
    id: '15-4',
    name: '删除单据',
  }]
}, {
  id: 16,
  name: '系统设置',
  detail: [{
    id: '16-1',
    name: '产品设置',
  }, {
    id: '16-2',
    name: '订单设置',
  }, {
    id: '16-3',
    name: '报价单设置',
  }, {
    id: '16-4',
    name: '工序设置',
  }, {
    id: '16-5',
    name: '工艺单设置',
  }, {
    id: '16-6',
    name: '物料设置',
  }, {
    id: '16-7',
    name: '工厂信息设置',
  }, {
    id: '16-8',
    name: '系统账户设置',
  },]
}, {
  id: 17,
  name: '员工管理',
  detail: [{
    id: '17-1',
    name: '添加员工',
  }, {
    id: '17-2',
    name: '修改员工',
  }, {
    id: '17-3',
    name: '员工列表',
  }, {
    id: '17-4',
    name: '删除员工',
  }]
}, {
  id: 18,
  name: '报销单管理',
  detail: [{
    id: '18-1',
    name: '添加报销单',
  }, {
    id: '18-2',
    name: '修改报销单',
  }, {
    id: '18-3',
    name: '报销单列表',
  }, {
    id: '18-4',
    name: '删除报销单',
  }]
}, {
  id: 19,
  name: '车间管理',
  detail: [{
    id: '19-1',
    name: '添加单据',
  }, {
    id: '19-2',
    name: '修改单据',
  }, {
    id: '19-3',
    name: '按订单录入列表',
  }, {
    id: '19-4',
    name: '删除单据',
  }, {
    id: '19-5',
    name: '按员工录入列表',
  },]
}, {
  id: 20,
  name: '数据报表',
  detail: [{
    id: '20-1',
    name: '订单数据图表',
  }, {
    id: '20-2',
    name: '样单数据图表',
  }, {
    id: '20-3',
    name: '计划数据统计',
  }, {
    id: '20-4',
    name: '订购数据统计',
  }, {
    id: '20-5',
    name: '调取数据统计',
  }, {
    id: '20-6',
    name: '加工数据统计',
  }, {
    id: '20-7',
    name: '原料库存数据统计',
  }, {
    id: '20-8',
    name: '装饰辅料订购图表',
  }, {
    id: '20-9',
    name: '包装辅料订购图表',
  }, {
    id: '20-10',
    name: '生产计划图表',
  }, {
    id: '20-11',
    name: '检验收发图表',
  }, {
    id: '20-12',
    name: '车间工资图表',
  }, {
    id: '20-13',
    name: '运输出库图表',
  }, {
    id: '20-14',
    name: '报销费用图表',
  }]
},
{
  id: 21,
  name: '系统单据管理',
  detail: [{
    id: '21-1',
    name: '单据管理-原料计划单',
  }, {
    id: '21-2',
    name: '单据管理-原料补充单',
  }, {
    id: '21-3',
    name: '单据管理-原料订购单',
  }, {
    id: '21-4',
    name: '单据管理-原料调取单',
  }, {
    id: '21-5',
    name: '单据管理-原料加工单',
  }, {
    id: '21-6',
    name: '单据管理-生产计划单',
  }, {
    id: '21-7',
    name: '单据管理-车间结算日志',
  }, {
    id: '21-8',
    name: '单据管理-辅料订购单',
  }, {
    id: '21-9',
    name: '单据管理-包装订购单',
  }, {
    id: '21-10',
    name: '单据管理-运输出库单',
  }, {
    id: '21-11',
    name: '单据管理-我方扣款单据',
  }, {
    id: '21-12',
    name: '单据管理-我方发票单据',
  }, {
    id: '21-13',
    name: '单据管理-收款单据',
  }, {
    id: '21-14',
    name: '单据管理-付款单据',
  }, {
    id: '21-15',
    name: '单据管理-检验入库单据',
  }, {
    id: '21-16',
    name: '单据管理-对方发票单据',
  }, {
    id: '21-17',
    name: '单据管理-订单报价单对比单据',
  },]
},
{
  id: 22,
  name: '客户结算',
  detail: [{
    id: '22-1',
    name: '客户收款列表'
  }, {
    id: '22-2',
    name: '客户收款列表'
  }, {
    id: '22-3',
    name: '客户付款列表'
  }, {
    id: '22-4',
    name: '客户付款详情'
  }]
}, {
  id: 23,
  name: '文件管理',
  detail: [{
    id: '23-1',
    name: '文件列表'
  }]
}, {
  id: 24,
  name: '产品管理',
  detail: [{
    id: '24-3',
    name: '产品列表',
  }]
}, {
  id: 25,
  name: '单证管理',
  detail: [{
    id: '25-1',
    name: '添加单证',
  }, {
    id: '25-2',
    name: '修改单证',
  }, {
    id: '25-3',
    name: '单证列表',
  }, {
    id: '25-4',
    name: '删除单证',
  }]
}]

const yarnAttributeArr: CascaderInfo[] = [{
  label: '筒纱',
  value: '筒纱'
}, {
  label: '绞纱',
  value: '绞纱'
}, {
  label: '面料',
  value: '面料'
}]

const yarnProcessArr: CascaderInfo[] = [{
  label: '染色',
  value: '染色'
}, {
  label: '倒纱',
  value: '倒纱'
}, {
  label: '并线',
  value: '并线'
}, {
  label: '膨纱',
  value: '膨纱'
}, {
  label: '切割',
  value: '切割'
}]

const moneyArr = [{
  name: '元',
  short: '人民币',
  id: 1,
  sign: '￥',
  default: '100',
  tax_prop: '12'
}, {
  name: '美元',
  short: 'USD',
  id: 2,
  sign: 'US$',
  default: '670',
  tax_prop: '0'
}]

// 出入库类型
const stockType = [{
  name: '中转入库', // 采购单半成品原料入库
  value: 1
}, {
  name: '客供入库',
  value: 2
}, {
  name: '中转出库', // 物料加工出库
  value: 3
}, {
  name: '订购最终入库', // 采购单，以4为准统计入库值
  value: 4
}, {
  name: '单据生产出库', // 织造半成品单位出库
  value: 5
}, {
  name: '订单结余入库',
  value: 6
}, {
  name: '移库出库',
  value: 7
}, {
  name: '移库入库',
  value: 8
}, {
  name: '仓库入库',
  value: 9
}, {
  name: '调取出库',
  value: 10
}, {
  name: '调取最终入库',
  value: 11
}, {
  name: '补纱调取出库',
  value: 12
}, {
  name: '仓库出库',
  value: 13
}, {
  name: '预订购入库',
  value: 14
}]

const productStockType = [{
  name: '普通入库',
  value: 1
}, {
  name: '订单结余入库',
  value: 2
}, {
  name: '移库入库',
  value: 3
}, {
  name: '移库出库',
  value: 4
}, {
  name: '销售出库',
  value: 5
}, {
  name: '销毁出库',
  value: 6
}, {
  name: '订单调取出库',
  value: 7
}]
// 仓库类型
const storeType = [{
  name: '本厂仓库',
  value: 1
}, {
  name: '加工厂仓库',
  value: 2
}, {
  name: '供货商仓库',
  value: 3
}]

// 生产类型
const productionType = [{
  name: '机织计划',
  value: 1
}, {
  name: '半成品加工计划',
  value: 2
}, {
  name: '成品加工计划',
  value: 3
}]

const limitArr = [{
  name: '每页5条',
  value: 5
}, {
  name: '每页10条',
  value: 10
}, {
  name: '每页15条',
  value: 15
}, {
  name: '每页20条',
  value: 20
}]
// handsontable 汉化包
import Handsontable from 'handsontable'
const C: any = Handsontable.languages.dictionaryKeys
const languages: {
  [propName: string]: any
} = {
  languageCode: 'en-US',
  [C.CONTEXTMENU_ITEMS_ROW_ABOVE]: '上方插入一行',
  [C.CONTEXTMENU_ITEMS_ROW_BELOW]: '下方插入一行',
  [C.CONTEXTMENU_ITEMS_INSERT_LEFT]: '左方插入一列',
  [C.CONTEXTMENU_ITEMS_INSERT_RIGHT]: '右方插入一列',
  [C.CONTEXTMENU_ITEMS_REMOVE_ROW]: ['删除行', '删除行'],
  [C.CONTEXTMENU_ITEMS_REMOVE_COLUMN]: ['删除列', '删除列'],
  [C.CONTEXTMENU_ITEMS_UNDO]: '撤销',
  [C.CONTEXTMENU_ITEMS_REDO]: '恢复',
  [C.CONTEXTMENU_ITEMS_READ_ONLY]: '只读',
  [C.CONTEXTMENU_ITEMS_CLEAR_COLUMN]: '清空列',

  [C.CONTEXTMENU_ITEMS_ALIGNMENT]: '对齐方式',
  [C.CONTEXTMENU_ITEMS_ALIGNMENT_LEFT]: '左对齐',
  [C.CONTEXTMENU_ITEMS_ALIGNMENT_CENTER]: '水平居中',
  [C.CONTEXTMENU_ITEMS_ALIGNMENT_RIGHT]: '右对齐',
  [C.CONTEXTMENU_ITEMS_ALIGNMENT_JUSTIFY]: '两端对齐',
  [C.CONTEXTMENU_ITEMS_ALIGNMENT_TOP]: '顶端对齐',
  [C.CONTEXTMENU_ITEMS_ALIGNMENT_MIDDLE]: '垂直居中',
  [C.CONTEXTMENU_ITEMS_ALIGNMENT_BOTTOM]: '底端对齐',

  [C.CONTEXTMENU_ITEMS_FREEZE_COLUMN]: '冻结列',
  [C.CONTEXTMENU_ITEMS_UNFREEZE_COLUMN]: '解冻列',

  [C.CONTEXTMENU_ITEMS_BORDERS]: '边框',
  [C.CONTEXTMENU_ITEMS_BORDERS_TOP]: '上',
  [C.CONTEXTMENU_ITEMS_BORDERS_RIGHT]: '右',
  [C.CONTEXTMENU_ITEMS_BORDERS_BOTTOM]: '下',
  [C.CONTEXTMENU_ITEMS_BORDERS_LEFT]: '左',
  [C.CONTEXTMENU_ITEMS_REMOVE_BORDERS]: '去掉边框',

  [C.CONTEXTMENU_ITEMS_ADD_COMMENT]: '添加批注',
  [C.CONTEXTMENU_ITEMS_EDIT_COMMENT]: '编辑批注',
  [C.CONTEXTMENU_ITEMS_REMOVE_COMMENT]: '删除批注',
  [C.CONTEXTMENU_ITEMS_READ_ONLY_COMMENT]: '批注只读',

  [C.CONTEXTMENU_ITEMS_MERGE_CELLS]: '合并单元格',
  [C.CONTEXTMENU_ITEMS_UNMERGE_CELLS]: '拆分单元格',

  [C.CONTEXTMENU_ITEMS_COPY]: '复制(Ctrl + C)',
  [C.CONTEXTMENU_ITEMS_CUT]: '剪切',
  [C.CONTEXTMENU_ITEMS_PASTE]: '粘贴',

  [C.CONTEXTMENU_ITEMS_NESTED_ROWS_INSERT_CHILD]: '插入子行',
  [C.CONTEXTMENU_ITEMS_NESTED_ROWS_DETACH_CHILD]: '从父行分离',

  [C.CONTEXTMENU_ITEMS_HIDE_COLUMN]: ['隐藏列', '隐藏列'],
  [C.CONTEXTMENU_ITEMS_SHOW_COLUMN]: ['取消隐藏', '取消隐藏'],

  [C.CONTEXTMENU_ITEMS_HIDE_ROW]: ['隐藏行', '隐藏行'],
  [C.CONTEXTMENU_ITEMS_SHOW_ROW]: ['取消隐藏', '取消隐藏'],

  [C.FILTERS_CONDITIONS_NONE]: '无',
  [C.FILTERS_CONDITIONS_EMPTY]: '为空',
  [C.FILTERS_CONDITIONS_NOT_EMPTY]: '非空',
  [C.FILTERS_CONDITIONS_EQUAL]: '等于',
  [C.FILTERS_CONDITIONS_NOT_EQUAL]: '不等于',
  [C.FILTERS_CONDITIONS_BEGINS_WITH]: '开始于',
  [C.FILTERS_CONDITIONS_ENDS_WITH]: '结束于',
  [C.FILTERS_CONDITIONS_CONTAINS]: '包含',
  [C.FILTERS_CONDITIONS_NOT_CONTAIN]: '不包含',
  [C.FILTERS_CONDITIONS_GREATER_THAN]: 'Greater than',
  [C.FILTERS_CONDITIONS_GREATER_THAN_OR_EQUAL]: 'Greater than or equal to',
  [C.FILTERS_CONDITIONS_LESS_THAN]: 'Less than',
  [C.FILTERS_CONDITIONS_LESS_THAN_OR_EQUAL]: 'Less than or equal to',
  [C.FILTERS_CONDITIONS_BETWEEN]: 'Is between',
  [C.FILTERS_CONDITIONS_NOT_BETWEEN]: 'Is not between',
  [C.FILTERS_CONDITIONS_AFTER]: '前',
  [C.FILTERS_CONDITIONS_BEFORE]: '后',
  [C.FILTERS_CONDITIONS_TODAY]: '今天',
  [C.FILTERS_CONDITIONS_TOMORROW]: '明天',
  [C.FILTERS_CONDITIONS_YESTERDAY]: '昨天',

  [C.FILTERS_VALUES_BLANK_CELLS]: '空单元格',

  [C.FILTERS_DIVS_FILTER_BY_CONDITION]: '条件筛选',
  [C.FILTERS_DIVS_FILTER_BY_VALUE]: '值筛选',

  [C.FILTERS_LABELS_CONJUNCTION]: '和',
  [C.FILTERS_LABELS_DISJUNCTION]: '或',

  [C.FILTERS_BUTTONS_SELECT_ALL]: '全选',
  [C.FILTERS_BUTTONS_CLEAR]: '清空',
  [C.FILTERS_BUTTONS_OK]: '确认',
  [C.FILTERS_BUTTONS_CANCEL]: '取消',

  [C.FILTERS_BUTTONS_PLACEHOLDER_SEARCH]: '搜索',
  [C.FILTERS_BUTTONS_PLACEHOLDER_VALUE]: '值',
  [C.FILTERS_BUTTONS_PLACEHOLDER_SECOND_VALUE]: '第二个值'
}
export {
  moneyArr,
  languages,
  yarnAttributeArr,
  yarnProcessArr,
  stockType,
  storeType,
  productionType,
  limitArr,
  systemModule,
  productStockType
}