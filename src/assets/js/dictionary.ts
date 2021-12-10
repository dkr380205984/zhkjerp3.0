import { CascaderInfo } from '@/types/vuex'
const yarnAttributeArr: CascaderInfo[] = [{
  label: '筒纱',
  value: '筒纱'
}, {
  label: '绞纱',
  value: '绞纱'
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
  name: '最终入库', // 采购单，以4为准统计入库值
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
  name: '仓库出库',
  value: 10
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
  limitArr
}