import http from './http'
const baseUrl = '/api'
const baseUrlYarn = '/yarn'
const baseUrlScarf = '/scarf'
interface ListParams {
  [sort: string]: any
  page: number | string
  limit: number | string
}
interface DetailParams {
  [sort: string]: any
  id: number | string
}
interface DeleteParams {
  id: number | string
}
// 登录
import { LoginInfo } from '@/types/logReg'
const login = (params: LoginInfo) => http.post(`${baseUrl}/auth/login`, params, 'application/json')

// 注销
const logout = () => http.post(`${baseUrl}/auth/logout`, {}, 'application/json')

// 设置登录信息
const userCompanySetting = (params: { company_id: number }) => http.post(`${baseUrl}/user/company/set`, params, 'application/json')

// 获取验证码
const getCoder = {
  forgetPassword: (params: {
    telephone: string
  }) => http.post(`${baseUrl}/user/password/forget/send/code`, params, 'application/json')
}

// 忘记密码
import { ForgetPasswordInfo } from '@/types/logReg'
const forgetPassword = (params: ForgetPasswordInfo) => http.post(`${baseUrl}/user/password/forget`, params, 'application/json')

// 修改密码
const changePassword = (params: {
  new_password: string
  sms_code: string
}) => http.post(`${baseUrl}/user/change/password`, params, 'application/json')

// 用户信息
const getAuthorization = () => http.post(`${baseUrl}/auth/info`, {}, 'application/json')

// token
const getToken = () => http.get(`${baseUrl}/upload/token`)

// 版本公告
const systemMessage = (params?: { start_time: string, end_time: string }) => http.get(`${baseUrl}/system/update/log`, params)

// 修改结算单价
const updateSettlePrice = (params: any) => http.post(`${baseUrl}/update/settle/price`, params, 'application/json')
//工厂信息
const companyInfo = {
  detail: () => http.get(`${baseUrl}/company/info`, {}),
  create: (params: any) => http.post(`${baseUrl}/company/info/edit`, params, 'application/json')
}

// 发货大屏接口
const chartsApi = {
  appLog: (params: any) => http.get(`${baseUrl}/order/mini_program/update/log`, params), //小程序更新日志
  batchLog: (params: any) => http.get(`${baseUrl}/order/dispatch/calendar`, params), // 发货日历
  appLogNew: (params: any) => http.get(`/ever/mini_program/update/log`, params), //小程序更新日志
  batchLogNew: (params: any) => http.get(`/ever/order/dispatch/calendar`, params), // 发货日历
}

// 查询单据数量是否超额
import { CheckBeyondInfo } from '@/types/otherInfo'
const checkBeyond = (params: CheckBeyondInfo) => http.post(`${baseUrl}/doc/beyond/check`, params, 'application/json')

// 首页
const homePage = {
  searchAll: (params: {
    keyword: string
    type: number | string // 1:订单 2样单 3报价单 4工艺单 5物料计划 空:所有
  }) => http.get(`${baseUrl}/index/search`, params)
}

// 系统教程
const tutorialSystem = {
  list: (params: any) => http.get(`${baseUrl}/system/study/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/system/study/detail`, params),
}

// 待办事项
const todoInfo = {
  list: (params: any) => http.get(`${baseUrl}/todo/lists`, params),
  complete: (params: { id: number[] }) => http.post(`${baseUrl}/todo/complete`, params, 'application/json'),
}
// 纱线报价
interface YarnPrice {
  id: string | number
  client_id: string | number
  info_data: Array<{
    id?: string | number
    material_id: string | number
    material_arr?: number[]
    material_color: string
    attribute: string
    price: string | number
    desc: string
  }>
}
const yarnPrice = {
  create: (params: YarnPrice) => http.post(`${baseUrl}/yarn/price/save`, params, 'application/json'),
  list: (params?: { material_type: 1 | 2, keyword: string }) => http.get(`${baseUrl}/yarn/price/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/yarn/price/delete`, params, 'application/json'),
}
// 单据审核
// 单据类型 1订单 2物料订购 3物料加工 4制造计划/生产计划 5报价 6原料出入库/物料调取 7原料预订购 8产品出入库 9物料计划 10补纱 11包装采购 12扣款单 13运输单 14车间管理 15开票单 16收款单 17样单 18辅料采购单 19检验入库单
const check = {
  create: (params:
    {
      pid: number | string | Array<number>
      check_type: number
      check_desc: string | string[]
      is_check: 1 | 2 // 1通过 2没通过
      desc: string
    }) => http.post(`${baseUrl}/doc/check`, params, 'application/json'),
  list: (params: { pid: string | number, check_type: number }) => http.get(`${baseUrl}/doc/check/lists`, params),
}

// 单据扣款
// 类型同审核
const deduct = {
  create: (params:
    {
      id?: string
      doc_type: number
      client_id: number | string
      data: Array<{
        order_id: number | string
        doc_code: string
        rel_doc_id: number | string
        reason: string
        price: string
        file_url: string
      }>
    }) => http.post(`${baseUrl}/doc/deduct`, params, 'application/json'),
  list: (params: {
    order_id?: number | string
    client_id?: number | string
    order_code?: string | number
    is_check?: string | number
    limit?: number
    page?: number
    code?: string
    user_id?: number | string
    group_id?: number | string
    rel_doc_id?: number | string
    doc_type?: number | string
    start_time?: string
    end_time?: string
    export_excel?: 1
  }) => http.get(`${baseUrl}/doc/deduct/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/doc/deduct/delete`, params, 'application/json'),
}

// 单据收款
const collection = {
  list: (params: {
    order_id?: number | string
    client_id?: number | string
    order_code?: string | number
    is_check?: string | number
    limit?: number
    page?: number
    code?: string
    user_id?: number | string
    group_id?: number | string
    rel_doc_id?: number | string
    doc_type?: number | string
    start_time?: string
    end_time?: string
    export_excel?: 1
  }) => http.get(`${baseUrl}/doc/collect/lists`, params),
  create: (params: {
    id?: string
    doc_type: number
    client_id: number | string
    data: Array<{
      order_id: number | string
      doc_code: string
      rel_doc_id: number | string
      desc: string
      complete_time: string
      price: string
    }>
  }) => http.post(`${baseUrl}/doc/collect/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/doc/collect/delete`, params, 'application/json'),
}

// 单据付款，其实和收款一毛一样
const payment = {
  list: (params: {
    order_id?: number | string
    client_id?: number | string
    order_code?: string | number
    is_check?: string | number
    limit?: number
    page?: number
    code?: string
    user_id?: number | string
    group_id?: number | string
    rel_doc_id?: number | string
    doc_type?: number | string
    start_time?: string
    end_time?: string
    export_excel?: 1
  }) => http.get(`${baseUrl}/doc/pay/lists`, params),
  create: (params: {
    id?: string
    doc_type: number
    client_id: number | string
    data: Array<{
      order_id: number | string
      doc_code: string
      rel_doc_id: number | string
      desc: string
      complete_time: string
      price: string
    }>
  }) => http.post(`${baseUrl}/doc/pay/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/doc/pay/delete`, params, 'application/json'),
}

// 单据开票
const invoice = {
  list: (params: {
    order_id?: string
    client_id?: string
    order_code?: string
    code?: string
    start_time?: string
    invoice_code?: string
    end_time?: string
    user_id?: string,
    page?: number
    limit?: number
    export_excel?: number
    invoice_type?: 1 | 2,
  }) => http.get(`${baseUrl}/doc/invoice/lists`, params),
  create: (params: {
    id?: string
    doc_type: number
    client_id: number | string
    data: Array<{
      order_id: number | string
      doc_code: string
      rel_doc_id: number | string
      desc: string
      invoice_code: string
      price: string
    }>
  }) => http.post(`${baseUrl}/doc/invoice/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/doc/invoice/delete`, params, 'application/json'),
}

// 文件管理
const fileManage = {
  list: (params?: {
    page: number | string
    limit: number | string
    file_name?: string
    tag?: string
    start_time?: string
    end_time?: string
    user_id?: string
    group_id?: string
    client_id?: string | number
  }) => http.get(`${baseUrl}/file/lists`, params),
  create: (params: {
    id?: string | number
    file_url: string
    tag: string
    file_type: string
    client_id: string
    file_name: string
  }) => http.post(`${baseUrl}/save/file`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/file/delete`, params, 'application/json'),
  share: (params: {
    id: string | number
    share_user_id: any[]
  }) => http.post(`${baseUrl}/file/share`, params, 'application/json'),
}
// 产品品类
import { CategoryInfo } from '@/types/productSetting'
const category = {
  create: (params: CategoryInfo) => http.post(`${baseUrl}/product/category/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/product/category/delete`, params, 'application/json'),
  deleteSecond: (params: DeleteParams) => http.post(`${baseUrl}/product/secondary/category/delete`, params, 'application/json'), // 删除二级品类
  list: (params?: ListParams) => http.get(`${baseUrl}/product/category/lists`, params)
}
// 产品款式
import { StyleInfo } from '@/types/productSetting'
const style = {
  create: (params: { data: StyleInfo[] }) => http.post(`${baseUrl}/product/style/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/product/style/delete`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/product/style/lists`, params)
}

// 产品成分
import { IngredientInfo } from '@/types/productSetting'
const ingredient = {
  create: (params: { data: IngredientInfo[] }) => http.post(`${baseUrl}/product/component/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/product/component/delete`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/product/component/lists`, params)
}

// 产品配色
import { ColourInfo } from '@/types/productSetting'
const colour = {
  create: (params: { data: ColourInfo[] }) => http.post(`${baseUrl}/product/color/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/product/color/delete`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/product/color/lists`, params)
}

// 产品尺码设置
import { SizeSetting } from '@/types/productSetting'
const productType = {
  create: (params: SizeSetting) => http.post(`${baseUrl}/product/category/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/product/category/delete`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/category/lists`, params)
}

// 产品尺码
import { SizeInfo } from '@/types/productSetting'
const size = {
  create: (params: SizeInfo) => http.post(`${baseUrl}/category/size/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/category/size/delete`, params, 'application/json')
}

// 订单样单类型设置
import { OrderType } from '@/types/orderSetting'
const orderType = {
  list: (params: {
    order_type: 1 | 2
  }) => http.get(`${baseUrl}/order/type/lists`, params),
  create: (params: OrderType) => http.post(`${baseUrl}/order/type/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/order/type/delete `, params, 'application/json')
}

import { ProcessInfo } from '@/types/processSetting'
// 工序
const process = {
  create: (params: { data: ProcessInfo[] }) => http.post(`${baseUrl}/process/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/process/delete`, params, 'application/json'),
  list: (params?: {
    type?: 1 | 2 | 3
    name?: String
  }) => http.get(`${baseUrl}/process/lists`, params)
}

// 工艺单设置
import { SideInfo, MachineInfo, MethodsInfo } from '@/types/craftSetting'
const craftSetting = {
  listSide: () => http.get(`${baseUrl}/craft/side/type/lists`, {}), createSide: (params: { data: SideInfo[] }) => http.post(`${baseUrl}/craft/side/type/save`, params, 'application/json'),
  deleteSide: (params: DeleteParams) => http.post(`${baseUrl}/craft/side/delete`, params, 'application/json'),
  listMachine: () => http.get(`${baseUrl}/craft/machine/type/lists`, {}),
  createMachine: (params: { data: MachineInfo[] }) => http.post(`${baseUrl}/craft/machine/type/save`, params, 'application/json'),
  deleteMachine: (params: DeleteParams) => http.post(`${baseUrl}/craft/machine/type/delete`, params, 'application/json'),
  listMethods: () => http.get(`${baseUrl}/craft/organization/method/lists`, {}),
  createMethods: (params: { data: MethodsInfo[] }) => http.post(`${baseUrl}/craft/organization/method/save`, params, 'application/json'),
  deleteMethods: (params: DeleteParams) => http.post(`${baseUrl}/craft/organization/method/delete`, params, 'application/json')
}

// 纱线颜色
import { YarnColorInfo } from '@/types/craftSetting'
const yarnColor = {
  create: (params: { data: YarnColorInfo[] }) => http.post(`${baseUrl}/yarn/color/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/yarn/color/delete`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/yarn/color/lists`, params)
}
// 潘通色号
const pantongList = (params: { keyword?: string }) => http.get(`${baseUrl}/pan/color/list`, params)

// 工艺单
import { CraftInfo, DraftMethods } from '@/types/craft'
const craft = {
  create: (params: CraftInfo) => http.post(`${baseUrl}/craft/save`, params, 'application/json'),
  detail: (params: DeleteParams) => http.get(`${baseUrl}/craft/detail`, params),
  list: (params?: ListParams) => http.get(`${baseUrl}/craft/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/craft/delete`, params, 'application/json'),
  uploadImg: (params: {
    craft_id: number
    is_back: number
    color_id: number
    file_url: string
  }) => http.post(`${baseUrl}/craft/image/save`, params, 'application/json'),
  czfCreate: (params: { pattern_loop: DraftMethods | string, name: string }) => http.post(`${baseUrl}/craft/pattern/save`, params, 'application/json'),
  czfDetail: (params: DeleteParams) => http.get(`${baseUrl}/craft/pattern/detail`, params),
  czfList: (params?: ListParams) => http.get(`${baseUrl}/craft/pattern/lists`, params),
  czfDelete: (params: DeleteParams) => http.post(`${baseUrl}/craft/pattern/delete`, params, 'application/json'),
  getOldCraft: (params: { export_key: string }) => http.get(`${baseUrl}/get/old/craft`, params),
}

// 单证设置
import { ClientEN, BankEN } from '@/types/billDocumentSetting'
interface HScodeListParams extends ListParams {
  hs_code: string
}
const billDocumentSetting = {
  clientENDetail: () => http.get(`${baseUrl}/document/company/detail`, {}),
  clientENCreate: (params: ClientEN) => http.post(`${baseUrl}/document/company/save`, params, 'application/json'),
  bankENDetail: () => http.get(`${baseUrl}/document/bank/detail`, {}),
  bankENCreate: (params: BankEN) => http.post(`${baseUrl}/document/bank/save`, params, 'application/json'),
  HSCodeList: (params: HScodeListParams) => http.get(`${baseUrl}/document/hscode/list`, params)
}

// 纱线类型
import { YarnTypeInfo } from '@/types/yarnSetting'
const yarnType = {
  create: (params: YarnTypeInfo) => http.post(`${baseUrl}/yarn/type/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/yarn/type/delete`, params, 'application/json'),
  list: (params?: { type: 1 | 2 | 3 }) => http.get(`${baseUrl}/yarn/type/lists`, params)
}
// 纱线
import { YarnInfo } from '@/types/yarnSetting'
interface YarnListParams extends ListParams {
  type?: 1 | 2 | 3
  material_id?: number
}
const yarn = {
  create: (params: YarnInfo) => http.post(`${baseUrl}/yarn/save`, params, 'application/json'),
  list: (params?: YarnListParams) => http.get(`${baseUrl}/yarn/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/yarn/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/yarn/delete`, params, 'application/json')
}

// 装饰辅料
import { DecorateMaterialInfo } from '@/types/materialSetting'
const decorateMaterial = {
  create: (params: { data: DecorateMaterialInfo[] }) => http.post(`${baseUrl}/decorate/material/save`, params, 'application/json'),
  list: (params?: any) => http.get(`${baseUrl}/decorate/material/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/decorate/material/delete`, params, 'application/json')
}

// 包装辅料
import { PackMaterialInfo } from '@/types/materialSetting'
const packMaterial = {
  create: (params: PackMaterialInfo) => http.post(`${baseUrl}/pack/material/save`, params, 'application/json'),
  list: (params?: any) => http.get(`${baseUrl}/pack/material/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/pack/material/delete`, params, 'application/json')
}

// 客户信息
import { ClientInfo } from '@/types/client'
const client = {
  create: (params: ClientInfo) => http.post(`${baseUrl}/client/save`, params, 'application/json'),
  detail: (params: DetailParams) => http.get(`${baseUrl}/client/detail`, params),
  list: (params?: {
    limit?: number | string
    page?: number | string
    name?: string
    status?: number | string
    tag_id?: number[] | string[] | null
    client_type_id?: number | string
    workshop_id?: 0
    only_delete?: number
  }) => http.get(`${baseUrl}/client/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/client/delete`, params, 'application/json'),
  check: (params: DetailParams) => http.post(`${baseUrl}/client/check/status`, params, 'application/json'), // 启用/禁用客户
  financialList: (params: any) => http.get(`${baseUrl}/financial/client/lists`, params), // 收款列表
  financialDetail: (params: DetailParams) => http.get(`${baseUrl}/financial/client/detail`, params),
}

// 公司类型
import { ClientTypeInfo } from '@/types/client'
const clientType = {
  create: (params: ClientTypeInfo) => http.post(`${baseUrl}/client/tag/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/client/type/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/client/tag/delete`, params, 'application/json')
}

// 小组/人
import { GroupInfo } from '@/types/factoryInfoSetting'
const group = {
  create: (params: GroupInfo) => http.post(`${baseUrl}/user/group/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/user/group/list`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/user/group/delete`, params, 'application/json')
}

// 用户
import { UserInfo } from '@/types/user'
const user = {
  update: (params: UserInfo) => http.post(`${baseUrl}/user/edit`, params, 'application/json'), // 内部用户
  create: (params: UserInfo) => http.post(`${baseUrl}/user/add`, params, 'application/json'), // 内部用户
  list: (params?: ListParams) => http.get(`${baseUrl}/user/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/user/delete`, params, 'application/json'),
  getSms: (params: { phone: string }) => http.post(`${baseUrl}/user/add/send/sms`, params, 'application/json'),
}

// 报价单
import { QuotedPriceInfo } from '@/types/quotedPrice'
const quotedPrice = {
  create: (params: QuotedPriceInfo) => http.post(`${baseUrl}/quote/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/quote/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/quote/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/quote/delete`, params, 'application/json'),
  settingCreate: (params: any) => http.post(`${baseUrl}/quote/demo/save`, params, 'application/json'),
  bindOrder: (params: { quote_product_id: string | number, product_id: string | number }) => http.post(`${baseUrl}/order/bind/quote`, params, 'application/json'),
  settingList: (params?: ListParams) => http.get(`${baseUrl}/quote/demo/lists`, params),
  settingDelete: (params: DeleteParams) => http.post(`${baseUrl}/quote/demo/delete`, params, 'application/json'),
  deleteProMat: (params: DeleteParams) => http.post(`${baseUrl}/quote/product/material/delete`, params, 'application/json'), //删除报价单产品原料项
  deleteProAss: (params: DeleteParams) => http.post(`${baseUrl}/quote/product/assist/material/delete`, params, 'application/json'), // 删除报价单产品辅料项
  deleteWeave: (params: DeleteParams) => http.post(`${baseUrl}/quote/product/material/delete`, params, 'application/json'), // 删除报价单产品织造项
  deleteSemi: (params: DeleteParams) => http.post(`${baseUrl}/quote/product/semi/product/delete`, params, 'application/json'), // 删除报价单产品半成品加工项
  deleteInspection: (params: DeleteParams) => http.post(`${baseUrl}/quote/product/production/delete`, params, 'application/json'), // 删除报价单产品成品加工项
  deletePack: (params: DeleteParams) => http.post(`${baseUrl}/quote/product/pack/material/delete`, params, 'application/json'), // 删除报价单产品包装辅料项
  deleteOther: (params: DeleteParams) => http.post(`${baseUrl}/quote/product/others/fee/delete`, params, 'application/json'), // 额外费用
  oprLog: (params: DetailParams) => http.get(`${baseUrl}/quote/activity/logs`, params), // 操作记录
  descCreate: (params: { name?: string, type: string, desc: string, category_id: string | number }) => http.post(`${baseUrl}/quote/explain/save`, params, 'application/json'),
  descDetail: (params: any) => http.get(`${baseUrl}/quote/explain/detail`, params),
  detailByOrder: (params: { order_id?: string | number, order_time_id?: string | number }) => http.get(`${baseUrl}/quote/by/order`, params),
}

// 列表设置信息 type 1:报价单列表 , 2:样单列表
const listSetting = {
  create: (params: { id: number | null, type: number, value: string }) => http.post(`${baseUrl}/list/setting/save`, params, 'application/json'),
  detail: (params: { type: number }) => http.get(`${baseUrl}/list/setting`, params)
}

// 仓库
import { StoreInfo } from '@/types/store'
const store = {
  create: (params: StoreInfo) => http.post(`${baseUrl}/store/save`, params, 'application/json'),
  list: (params?: any) => http.get(`${baseUrl}/store/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/store/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/store/delete`, params, 'application/json'),
  searchMat: (params: {
    material_id?: string | number
    store_id?: string | number
    secondary_id?: string | number
    keyword?: string
    material_name?: string
    material_color?: string
    vat_code?: string
    color_code?: string
    batch_code?: string
    page?: string | number
    limit?: string | number
    material_type?: number | string
    attribute?: string
  }) => http.get(`${baseUrl}/store/total/lists`, params), // 这个接口用于筛选仓库有多少物料
  getMatName: (params: {
    material_name: string
    material_type: number
  }) => http.get(`${baseUrl}/search/material/by/name`, params), // 这个接口用于筛选某一类型的物料列表
  searchPro: (params: {
    [propName: string]: any
    page?: string | number
    limit?: string | number
  }) => http.get(`${baseUrl}/product/store/total/lists`, params),
  proLog: (params: {
    [propName: string]: any
    page?: string | number
    limit?: string | number
  }) => http.get(`${baseUrl}/product/store/log/lists`, params),
}

// 样品
import { SampleInfo } from '@/types/sample'
const sample = {
  create: (params: SampleInfo) => http.post(`${baseUrl}/product/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/product/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/product/detail`, params)
}

// 样单
import { SampleOrderInfo, SampleOrderTime } from '@/types/sampleOrder'
const sampleOrder = {
  again: (params: SampleOrderTime) => http.post(`${baseUrl}/order/time/save`, params, 'application/json'),
  create: (params: SampleOrderInfo) => http.post(`${baseUrl}/order/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/order/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/order/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/order/delete`, params, 'application/json'),
  confirm: (params: { id: string | number, status: 1 | 2 | 3 | 4 | 5 | 6 }) => http.post(`${baseUrl}/order/product/confirm`, params, 'application/json'),
  confirmList: (params: { order_id: number, status?: number[] }) => http.get(`${baseUrl}/order/confirm/product/lists`, params),
  deletePro: (params: DeleteParams) => http.post(`${baseUrl}/order/delete/rel/product`, params, 'application/json'), // 删除产品
  materialDetail: (params: { order_id: string | number }) => http.get(`${baseUrl}/order/material/info`, params),
  deleteProChild: (params: DeleteParams) => http.post(`${baseUrl}/order/delete/rel/product/info`, params, 'application/json'), // 删除产品子项
  clientCheck: (params: { order_id: string | number }) => http.post(`${baseUrl}/order/time/client/confirm`, params, 'application/json'), // 客户确认完成
  completeCheck: (params: { order_id: string | number }) => http.post(`${baseUrl}/order/time/complete`, params, 'application/json'), // 打样次数确认完成
}

// 产品 产品和样品的接口是同一个，前端方便区分
import { ProductInfo } from '@/types/product'
const product = {
  create: (params: ProductInfo) => http.post(`${baseUrl}/product/save`, params, 'application/json'),
  list: (params?: {
    limit: string | number
    page: string | number
    product_code?: string
    order_code?: string
    category_id?: string | number
    secondary_category_id?: string | number
    product_name?: string
    product_type?: string | number
    user_id?: string | number
    craft_status?: 0 | 1
  }) => http.get(`${baseUrl}/product/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/product/detail`, params),
}

// 订单 
import { OrderInfo } from '@/types/order'
const order = {
  create: (params: OrderInfo) => http.post(`${baseUrl}/order/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/order/lists`, params),
  confirmBatch: (params: { batch_id: Array<string | number> }) => http.post(`${baseUrl}/order/batch/complete`, params, 'application/json'),
  simpleList: (params?: { keyword?: string, product_code?: string, order_code?: string }) => http.get(`${baseUrl}/order/simple/lists`, params),
  timeList: (params?: ListParams) => http.get(`${baseUrl}/order/time/lists`, params), // 根据time_data查询的列表
  detail: (params: DetailParams) => http.get(`${baseUrl}/order/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/order/delete`, params, 'application/json'),
  cancel: (params: DeleteParams) => http.post(`${baseUrl}/order/time/cancel`, params, 'application/json'),
  oprLog: (params: DetailParams) => http.get(`${baseUrl}/order/activity/logs`, params), // 操作记录
  deliveryList: (params?: ListParams) => http.get(`${baseUrl}/order/dispatch/lists`, params), // 大屏发货列表
  deliveryListNoLog: (params?: ListParams) => http.get('/ever/order/dispatch/lists', params), // 大屏发货列表
  financial: (params: { order_id: string | number, product_id: string | number }) => http.get(`${baseUrl}/financial/order/detail`, params), // 操作记录
  deletePro: (params: DeleteParams) => http.post(`${baseUrl}/order/delete/rel/product`, params, 'application/json'), // 删除订单里的产品
  deleteProChild: (params: DeleteParams) => http.post(`${baseUrl}/order/delete/rel/product/info`, params, 'application/json'), // 删除订单里的子项
  deleteBatch: (params: DeleteParams) => http.post(`${baseUrl}/order/delete/rel/batch`, params, 'application/json'), // 删除订单里的批次
  processList: (params: { order_id: string | number, product_id?: string | number }) => http.get(`${baseUrl}/order/all/process`, params), // 订单相关所有工序
  logList: (params: { order_id: string | number }) => http.get(`${baseUrl}/order/rel/doc/info`, params), // 订单相关所有单据信息
  materialDetail: (params: { order_id: string | number }) => http.get(`${baseUrl}/order/material/info`, params), // 物料汇总表
  productionDetail: (params: { order_time_id: string | number }) => http.get(`${baseUrl}/order/weave/info`, params), // 生产汇总表
}

// 跟单据相关的所有单位
// 1.下单公司 2.原料采购单位 3.辅料采购单位 4.生产分配单位 5.原料加工单位
const clientInOrder = (params: { order_id: string | number }) => http.get(`${baseUrl}/order/all/rel/client`, params)

// 物料计划单
import { MaterialPlanInfo } from '@/types/materialPlan'
const materialPlan = {
  create: (params: MaterialPlanInfo) => http.post(`${baseUrl}/material/plan/save`, params, 'application/json'),
  list: (params: {
    top_order_id?: string | number // 最外层order_id
    plan_id?: string | number
    order_id?: string | number // time_data里的
    client_id?: string | number
    limit?: number
    page?: number
    start_time?: string
    end_time?: string
    keyword?: string
    code?: string
    user_id?: string | number
    group_id?: string | number
    order_code?: string
    is_check?: number
    type?: 1 | 2 // 1.原料计划单 2.辅料计划单
    order_type?: string // 1.订单 2.样单
    filter_way?: string
    filter_progress?: string | number
  }) => http.get(`${baseUrl}/material/plan/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/material/plan/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/material/plan/delete`, params, 'application/json')
}
// 物料订购
import { MaterialOrderInfo } from '@/types/materialOrder'
const materialOrder = {
  create: (params: { data: MaterialOrderInfo[] }) => http.post(`${baseUrl}/material/order/save`, params, 'application/json'),
  update: (params: MaterialOrderInfo) => http.post(`${baseUrl}/material/order/edit`, params, 'application/json'),
  list: (params: {
    plan_id?: string | number
    order_id?: string | number
    client_id?: string | number
    is_check?: string | number
    limit?: string | number
    page?: string | number
    code?: string
    start_time?: string
    end_time?: string
    start_push_time?: string
    end_push_time?: string
    user_id?: string | number
    reserve_id?: string | number // 预订购单
    top_order_id?: string | number // 最外层order_id
    material_type?: 1 | 2
    sup_id?: string | number //补纱单id
    [propName: string]: any
  }) => http.get(`${baseUrl}/material/order/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/material/order/detail`, params),
  delete: (params: DetailParams) => http.post(`${baseUrl}/material/order/delete`, params, 'application/json')
}

// 原料预订购
import { MaterialPlanOrderClient } from '@/types/materialPlanOrder'
const materialPlanOrder = {
  create: (params: MaterialPlanOrderClient) => http.post(`${baseUrl}/material/reserve/order/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/material/reserve/order/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/material/reserve/order/detail`, params),
  delete: (params: DetailParams) => http.post(`${baseUrl}/material/reserve/order/delete`, params, 'application/json'),
  stockSts: (params: {
    reserve_id: number | string
    year: string | number
    month: string | number
  }) => http.get(`${baseUrl}/material/reserve/store/count`, params)
}

// 物料加工
import { MaterialProcessInfo } from '@/types/materialProcess'
const materialProcess = {
  create: (params: { data: MaterialProcessInfo[] }) => http.post(`${baseUrl}/material/process/save`, params, 'application/json'),
  update: (params: MaterialProcessInfo) => http.post(`${baseUrl}/material/process/edit`, params, 'application/json'),
  list: (params: {
    plan_id?: string | number
    order_id?: string | number
    client_id?: string | number
    user_id?: string | number
    id?: string | number
    limit?: number
    page?: number
    code?: string
    start_time?: string
    end_time?: string
    is_check?: string | number
    export_excel?: 1
    [propName: string]: any
  }) => http.get(`${baseUrl}/material/process/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/material/process/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/material/process/delete`, params, 'application/json')
}

// 物料出入库
import { MaterialStockInfo } from '@/types/materialStock'
const materialStock = {
  create: (params: { data: MaterialStockInfo[] }) => http.post(`${baseUrl}/store/log/save`, params, 'application/json'),
  list: (params: {
    action_type?: number | Array<number> // 搜调取单的时候用，一般是出库单10
    order_id?: string | number
    client_id?: string | number
    is_check?: string | number
    code?: string
    start_time?: string
    end_time?: string
    store_id?: string | number
    page?: string | number
    limit?: string | number
    user_id?: string | number
    group_id?: string | number
    reserve_id?: string | number // 预订购单
    top_order_id?: string | number // 最外层order_id
    rel_doc_id?: string | number
    order_type?: string
    export_excel?: 1
  }) => http.get(`${baseUrl}/store/log/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/store/log/delete`, params, 'application/json'),
  detail: (params: DetailParams) => http.get(`${baseUrl}/store/log/detail`, params),
  merge: (params: {
    store_id: string | number
    secondary_store_id: string | number
    store_arr: Array<any>
    material_id: string | number
    from_store_total_id: Array<any>
    material_color: string | number
    attribute: string | number
    color_code: string | number
    batch_code: string | number
    vat_code: string | number
    number: string | number
  }) => http.post(`${baseUrl}/combine/store/total`, params, 'application/json'),
}

// 产品出入库
import { ProductStockInfo } from '@/types/productStock'
const productStock = {
  create: (params: ProductStockInfo) => http.post(`${baseUrl}/product/store/log/save`, params, 'application/json'),
}

// 生产计划
import { ProductionPlanInfo } from '@/types/productionPlan'
const productionPlan = {
  create: (params: { data: ProductionPlanInfo[] }) => http.post(`${baseUrl}/weave/plan/save`, params, 'application/json'),
  update: (params: ProductionPlanInfo) => http.post(`${baseUrl}/weave/plan/edit`, params, 'application/json'),
  list: (params: {
    plan_id?: string | number
    is_check?: string | number
    order_id?: string | number
    client_id?: string | number
    user_id?: string | number
    top_order_id?: string | number // 最外层order_id
    code?: string
    start_time?: string
    end_time?: string
    limit?: number
    page?: number
    [propName: string]: any
  }) => http.get(`${baseUrl}/weave/plan/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/weave/plan/delete`, params, 'application/json'),
  detail: (params: DetailParams) => http.get(`${baseUrl}/weave/plan/detail`, params),
}

// 生产进度
const productionProgress = {
  list: (params: {
    code?: string
    keyword?: string // 计划单/客户/加工单位
    status: string | number // 1 已分配 2 已逾期 3 生产中 4 生产完成
    start_time?: string
    end_time?: string
    page?: number | string
    limit?: number | string
    user_id?: string | number
    order_type: 1 | 2
    client_id?: number | string
    process_name?: string
  }) => http.get(`${baseUrl}/weave/plan/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/production/detail`, params),
  updateLog: (params: {
    plan_id?: number | string
    order_id?: number | string
  }) => http.get(`${baseUrl}/weave/plan/product/update/log/detail`, params),
  updateDetail: (params: {
    order_ids?: Array<number> // 根据订单id批量查询
    plan_ids?: Array<number> // 根据生产计划单id批量查询
  }) => http.get(`${baseUrl}/weave/plan/product/lists`, params),
  updateNumber: (params: {
    data: Array<{
      pid: number | string
      number: number | string
      desc: string
    }>
  }) => http.post(`${baseUrl}/weave/plan/product/update/log/save`, params, 'application/json'),
  codeInfo: (params: {
    hash: number | string
  }) => http.get(`${baseUrl}/production/code/info`, params),
}

// 补纱
import { MaterialSupplementInfo } from '@/types/materialSupplement'
const materialSupplement = {
  create: (params: MaterialSupplementInfo) => http.post(`${baseUrl}/material/sup/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/material/sup/delete`, params, 'application/json'),
  list: (params: {
    top_order_id?: string | number // 最外层order_id
    plan_id?: string | number
    order_id?: string | number // time_data里的
    client_id?: string | number
    group_id?: string | number
    is_check?: string | number
    limit?: number
    page?: number
    start_time?: string
    end_time?: string
    keyword?: string
    code?: string
    user_id?: string | number
    order_code?: string
    type?: 1 | 2 // 1.原料计划单 2.辅料计划单
    export_excel?: 1
  }) => http.get(`${baseUrl}/material/sup/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrl}/material/sup/detail`, params),
}

// 检验
import { InspectionInfo } from '@/types/inspection'
const inspection = {
  create: (params: { data: InspectionInfo[] }) => http.post(`${baseUrl}/inspection/save`, params, 'application/json'),
  list: (params: {
    plan_id?: string | number
    order_id?: string | number
    client_id?: string | number
    is_check?: string | number
    user_id?: string | number
    keyword?: string
    start_time?: string
    end_time?: string
    type?: 1 | 2 | null
    export_excel?: 1
    limit?: string | number
    page?: string | number
  }) => http.get(`${baseUrl}/inspection/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/inspection/delete`, params, 'application/json')
}

// 包装
import { PackOrderInfo, PackPlanInfo } from '@/types/packManage'
const packManage = {
  UpdateOrder: (params: PackOrderInfo) => http.post(`${baseUrl}/pack/order/edit`, params, 'application/json'),
  createOrder: (params: { data: PackOrderInfo[] }) => http.post(`${baseUrl}/pack/order/save`, params, 'application/json'),
  orderList: (params: {
    order_id?: string | number
    is_check?: string | number
    client_id?: string | number
    user_id?: string | number
    code?: string
    start_time?: string
    end_time?: string
    limit?: number
    page?: number
    [propName: string]: any
  }) => http.get(`${baseUrl}/pack/order/lists`, params),
  orderListDetail: (params: {
    id?: string | number
  }) => http.get(`${baseUrl}/pack/order/detail`, params),
  deleteOrder: (params: DeleteParams) => http.post(`${baseUrl}/pack/order/delete`, params, 'application/json'),
  createPlan: (params: PackPlanInfo) => http.post(`${baseUrl}/pack/plan/save`, params, 'application/json'),
  planList: (params: { order_id?: string | number, [propName: string]: any }) => http.get(`${baseUrl}/pack/plan/lists`, params),
  deletePlan: (params: DeleteParams) => http.post(`${baseUrl}/pack/plan/delete`, params, 'application/json'),
  detailPlan: (params: { id: number[] }) => http.get(`${baseUrl}/pack/plan/detail`, params),
}

// 装箱
import { BoxInfo } from '@/types/boxManage'
const boxManage = {
  create: (params: BoxInfo) => http.post(`${baseUrl}/transport/dispatch/save`, params, 'application/json'),
  list: (params: any) => http.get(`${baseUrl}/transport/dispatch/lists`, params),
  detail: (params: any) => http.get(`${baseUrl}/transport/dispatch/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/transport/dispatch/delete`, params, 'application/json'),
  addOtherFee: (params: {
    id: string | number
    data: Array<{
      name: string
      price: string | number
      desc: string
    }>
  }) => http.post(`${baseUrl}/transport/save/others/fee`, params, 'application/json'),
}
// excel导出
const exportExcel = {
  materialLog: (params: {
    store_id: string | number
    material_type: number
    material_name: string
    client_id: string
    start_time: string
    end_time: string
    action_type: number
  }) => http.get(`${baseUrl}/export/material/store/log`, params),
  materialTotal: (params: {
    store_id: string | number
    material_name: string
    material_type: number
  }) => http.get(`${baseUrl}/export/material/store/total`, params),
  quoteList: (params: {
    client_id: number,
    id: Array<number>
  }) => http.get(`${baseUrl}/export/quote/list`, params),
  orderInfo: (params: {
    client_id: number
    id: Array<number>
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/export/order/info`, params),
  staff: (params: {
    limit?: number | string
    page?: number | string
    process?: number | string
    keyword?: string
    department?: string
    month?: string
    status?: string | number
    type?: string | number
  }) => http.get(`${baseUrl}/export/staff`, params),
  staffYear: (params: {
    limit?: number | string
    page?: number | string
    process?: number | string
    keyword?: string
    department?: string
    year?: number | string
    status?: string | number
    type?: string | number
  }) => http.get(`${baseUrl}/export/staff/year`, params),
  staffMonth: (params: {
    limit?: number | string
    page?: number | string
    process?: number | string
    keyword?: string
    department?: string
    month?: number | string
    status?: string | number
    type?: string | number
  }) => http.get(`${baseUrl}/export/staff/month`, params),
  receipt: (params: {
    keyword: string
    group: string
    status: string | number
  }) => http.get(`${baseUrl}/export/receipt`, params),
}

// 客户绑定小程序
const clientBind = {
  list: (params?: ListParams) => http.get(`${baseUrl}/workshop/apply/list`, params),
  qrCode: (params?: ListParams) => http.get(`${baseUrl}/workshop/qrcode`, params),
  bind: (params: { client_id: string | number, uuid: string }) => http.post(`${baseUrl}/workshop/client/save`, params, 'application/json'),
  unbind: (params: { client_id: string | number }) => http.post(`${baseUrl}/workshop/client/unbind`, params, 'application/json'),
  cancel: (params: { uuid: string }) => http.post(`${baseUrl}/workshop/client/cancel`, params, 'application/json'),
}

// 员工管理
const staff = {
  departmentList: (params: {
    limit?: string | number
    keyword?: string
  }) => http.get(`${baseUrl}/staff/department/list`, params),
  departmentDetail: (params: {
    id?: number | string
  }) => http.get(`${baseUrl}/staff/department/detail`, params),
  importStaff: (params?: any) => http.post(`${baseUrl}/import/staff`, params),
  list: (params: any) => http.get(`${baseUrl}/staff/list`, params),
  departmentAdd: (params: {
    id: number | string
    name: string
  }) => http.post(`${baseUrl}/staff/department/save`, params),
  downloadExcel: (params?: any) => http.get(`${baseUrl}/staff/download`, params),
  changeStaffStatus: (params: {
    data: Array<{
      id: number | string
      status: number | string
    }>
  }) => http.post(`${baseUrl}/staff/status`, params),
  addStaff: (params: {
    name: string
    phone: string
    type: number | string
    entry_time: string
    resign_time: string
    department: string
    age: string
    id_number: string
    nation: string
    bank: string
    card_number: string
    social_security: number | string
    desc: string
    id: number | string
    process: string
    health: string
    sex: number | string
    education: string
  }) => http.post(`${baseUrl}/staff/save`, params),
  detail: (params: {
    id: number | string
  }) => http.get(`${baseUrl}/staff/detail`, params),
}

// 车间管理
const workshop = {
  save: (params: {
    data: Array<{
      order_id: number | string
      staff_id: number | string
      process_name: number | string
      process_type: number | string
      process_desc: string
      extra_number: number | string
      order_product_id?: number | string
      product_id: number | string
      size_id: number | string
      color_id: number | string
      number: number | string
      price: number | string
      total_price: number | string
      shoddy_number: number | string
      shoddy_reason: string
      complete_time: string
    }>
  }) => http.post(`${baseUrl}/production/inspection/save`, params),
  list: (params: {
    order_id?: string | number
    is_check?: string | number
    code?: string
    keyword?: string
    department?: string
    staff_id?: string | number
    user_id?: string | number
    group_id?: string | number
    start_time?: string
    end_time?: string
    process?: string
    limit?: number
    page?: number
    export_excel?: 1
    month?: string | number
    year?: string | number
  }) => http.get(`${baseUrl}/production/inspection/lists`, params),
  detail: (params: {
    order_id?: number | string
    staff_id?: number | string
  }) => http.get(`${baseUrl}/production/inspection/detail`, params),
  delete: (params: {
    id: Array<number | string>
  }) => http.post(`${baseUrl}/production/inspection/delete`, params),
  check: (params: {
    id: Array<number | string>
    is_check: 1 | 2 | 3
  }) => http.post(`${baseUrl}/production/inspection/check`, params),
}

// 报销单管理
const receipt = {
  save: (params: {
    name: string
    staff_id: number | string
    group: string
    certificate: string
    id: number | string
    amount: number | string
    staff_departments: Array<{
      name: string
      amount: number | string
    }>
  }) => http.post(`${baseUrl}/receipt/save`, params),
  list: (params: {
    limit: number | string
    page: number | string
    keyword: string
    group: string
    start_time: string
    end_time: string
    status: string | number
  }) => http.get(`${baseUrl}/receipt/list`, params),
  detail: (params: {
    id: number | string
  }) => http.get(`${baseUrl}/receipt/detail`, params),
  delete: (params: {
    id: Array<number | string>
  }) => http.post(`${baseUrl}/receipt/delete`, params),
  reviewer: (params: {
    id: number | string
    status: number | string
    content: string
    desc: string
  }) => http.post(`${baseUrl}/receipt/reviewer`, params),
  reviewerList: (params: {
    limit?: string
    receipt_id: string
  }) => http.get(`${baseUrl}/receipt/reviewer/list`, params),
  total: () => http.get(`${baseUrl}/receipt/total`),
}

interface CheckConfigInfo {
  doc_type: number
  data: {
    auto_pass: 1 | 2 // 是否自动通过 1是 2否
    has_condition: 1 | 2 // 是否根据条件判断 1是 2否
    user_id: Array<number>
    client_id?: Array<number>
    number?: any
    order_type?: number | string
    total_number?: number | string
    total_price?: number | string
    total_order_number?: number | string
    total_material_number?: number | string
    contrast_quote_extent?: number | string | any[] // 报价单浮动
    by_process_price?: number // 是否根据工序单价判断 1是 2否
    ranse?: string // 对比报价单价格浮动
    daosha?: string
    bingxian?: string
    pengsha?: string
    qiege?: string
    not_allow_operate: 1 | 2 // 	是否限制后续操作 1是 2否
    not_allow_print: 1 | 2 // 限制打印 1是 2否
    not_allow_add_rel_doc: 1 | 2 // 是否限制添加关联单据 1是 2否
    not_allow_settle: 1 | 2 // 限制结算 1是 2否
  }
}
// 审核设置
const checkConfig = {
  pushDetail: () => http.get(`${baseUrl}/doc/push/status/info`, {}),
  detail: (params: { doc_type: number }) => http.get(`${baseUrl}/doc/push/config/detail`, params),
  save: (params: CheckConfigInfo) => http.post(`${baseUrl}/doc/push/config/save`, params, 'application/json'),
  savePush: (params: {
    push_status: 1 | 2
    push_user: Array<{
      user_id: string | number
      doc_type: Array<number>
    }>
  }) => http.post(`${baseUrl}/doc/push/status/save`, params, 'application/json'),
}

const statistics = {
  order: (params?: {
    start_time: string
    end_time: string
    client_id: number | string
    user_id: number | string
    group_id: number | string
    settle_unit: number | string
  }) => http.get(`${baseUrl}/statistics/financial/order`, params),
  sampleOrder: (params?: {
    start_time: string
    end_time: string
    client_id: number | string
    group_id: number | string
    user_id: number | string
  }) => http.get(`${baseUrl}/statistics/financial/sample_order`, params),
  orderProgressChart: (params?: {
    order_type: number | string
    keyword: string
    start_time: string
    end_time: string
    client_id: number | string
    user_id: number | string
    group_id: number | string
    is_check: number | string
    status: number | string
  }) => http.get(`${baseUrl}/statistics/order`, params),
  sampleOrderProgressChart: (params?: {
    order_type: number | string
    keyword: string
    start_time: string
    end_time: string
    client_id: number | string
    user_id: number | string
    group_id: number | string
    is_check: number | string
    status: number | string
  }) => http.get(`${baseUrl}/statistics/sample_order`, params),
  rawMaterial: (params?: {
    order_type: number | string
    user_id: number | string
    group_id: number | string
    contacts_id: number | string
    name: string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/rawmaterial`, params),
  rawMaterialOrder: (params?: {
    order_type: number | string
    user_id: number | string
    group_id: number | string
    client_id: number | string
    contacts_id: number | string
    name: string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/rawmaterial/order`, params),
  rawMaterialTransfer: (params?: {
    order_type: number | string
    user_id: number | string
    group_id: number | string
    store_id: number | string
    name: string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/rawmaterial/transfer`, params),
  rawMaterialMachining: (params?: {
    order_type: number | string
    user_id: number | string
    group_id: number | string
    name: string
    client_id: number | string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/rawmaterial/process`, params),
  auxmaterial: (params?: {
    order_type: number | string
    client_id: number | string
    user_id: number | string
    group_id: number | string
    name: string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/auxmaterial`, params),
  auxmaterialPack: (params?: {
    client_id: number | string
    user_id: number | string
    group_id: number | string
    pack_material_id: number | string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/auxmaterial/pack`, params),
  weavePlan: (params?: {
    client_id: number | string
    order_type: number | string
    user_id: number | string
    group_id: number | string
    process_name: string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/weave/plan`, params),
  inspection: (params?: {
    client_id: number | string
    order_type: number | string
    user_id: number | string
    group_id: number | string
    process_name: string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/inspection`, params),
  productionInspection: (params?: {
    staff_id: number | string
    user_id: number | string
    process_name: string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/production/inspection`, params),
  transportDispatch: (params?: {
    group_id: number | string
    user_id: number | string
    client_id: string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/transport/dispatch`, params),
  receipt: (params?: {
    staff_id: number | string
    group: string
    user_id: string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/receipt/contents`, params),
  storeTotal: (params?: {
    store_id: number | string
    name: string
    start_time: string
    end_time: string
  }) => http.get(`${baseUrl}/statistics/store/total`, params),
}
export {
  checkBeyond,
  fileManage,
  todoInfo,
  checkConfig,
  payment,
  statistics,
  receipt,
  workshop,
  staff,
  clientBind,
  systemMessage,
  login,
  logout,
  userCompanySetting,
  forgetPassword,
  changePassword,
  getAuthorization,
  getToken,
  homePage,
  companyInfo,
  category,
  check,
  deduct,
  collection,
  style,
  ingredient,
  getCoder,
  colour,
  productType,
  size,
  orderType,
  process,
  craftSetting,
  yarnColor,
  yarnPrice,
  craft,
  pantongList,
  billDocumentSetting,
  yarnType,
  yarn,
  client,
  clientType,
  decorateMaterial,
  packMaterial,
  group,
  user,
  quotedPrice,
  listSetting,
  store,
  sample,
  sampleOrder,
  product,
  order,
  materialPlan,
  materialOrder,
  materialPlanOrder,
  materialProcess,
  materialStock,
  productionPlan,
  inspection,
  packManage,
  boxManage,
  exportExcel,
  tutorialSystem,
  materialSupplement,
  clientInOrder,
  productStock,
  productionProgress,
  invoice,
  updateSettlePrice,
  chartsApi
}