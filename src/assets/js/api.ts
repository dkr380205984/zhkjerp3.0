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

// 用户信息
const getAuthorization = () => http.post(`${baseUrl}/auth/info`, {}, 'application/json')

// token
const getToken = () => http.get(`${baseUrl}/upload/token`)


// 单据审核
// 单据类型 1订单 2物料订购 3无聊加工 4制造计划 5报价 6原料出入库 7原料预订购 8产品出入库 9物料计划单
const check = {
  create: (params:
    {
      pid: number | string
      check_type: number
      check_desc: string | string[]
      is_check: 1 | 2 // 1通过 2没通过
      desc: string
    }) => http.post(`${baseUrlScarf}/doc/check`, params, 'application/json'),
}
// 产品款式
import { StyleInfo } from '@/types/productSetting'
const style = {
  create: (params: { data: StyleInfo[] }) => http.post(`${baseUrlScarf}/product/style/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/product/style/delete`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/product/style/lists`, params)
}

// 产品成分
import { IngredientInfo } from '@/types/productSetting'
const ingredient = {
  create: (params: { data: IngredientInfo[] }) => http.post(`${baseUrlScarf}/product/component/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/product/component/delete`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/product/component/lists`, params)
}

// 产品配色
import { ColourInfo } from '@/types/productSetting'
const colour = {
  create: (params: { data: ColourInfo[] }) => http.post(`${baseUrlScarf}/product/color/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/product/color/delete`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/product/color/lists`, params)
}

// 产品品类
import { ProductTypeInfo } from '@/types/productSetting'
const productType = {
  create: (params: ProductTypeInfo) => http.post(`${baseUrlScarf}/product/category/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/product/category/delete`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/category/lists`, params)
}

// 产品尺码
import { SizeInfo } from '@/types/productSetting'
const size = {
  create: (params: SizeInfo) => http.post(`${baseUrlScarf}/category/size/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/category/size/delete`, params, 'application/json')
}

// 订单样单类型设置
import { OrderType } from '@/types/orderSetting'
const orderType = {
  list: (params: {
    order_type: 1 | 2
  }) => http.get(`${baseUrlScarf}/order/type/lists`, params),
  create: (params: OrderType) => http.post(`${baseUrlScarf}/order/type/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/order/type/delete `, params, 'application/json')
}

import { ProcessInfo } from '@/types/processSetting'
// 工序
const process = {
  create: (params: { data: ProcessInfo[] }) => http.post(`${baseUrlScarf}/process/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/process/delete`, params, 'application/json'),
  list: (params?: { type: 1 | 2 | 3 }) => http.get(`${baseUrlScarf}/process/lists`, params)
}

// 工艺单设置
import { SideInfo, MachineInfo, MethodsInfo } from '@/types/craftSetting'
const craftSetting = {
  listSide: () => http.get(`${baseUrlScarf}/craft/side/type/lists`, {}),
  createSide: (params: { data: SideInfo[] }) => http.post(`${baseUrlScarf}/craft/side/type/save`, params, 'application/json'),
  deleteSide: (params: DeleteParams) => http.post(`${baseUrlScarf}/craft/side/delete`, params, 'application/json'),
  listMachine: () => http.get(`${baseUrlScarf}/craft/machine/type/lists`, {}),
  createMachine: (params: { data: MachineInfo[] }) => http.post(`${baseUrlScarf}/craft/machine/type/save`, params, 'application/json'),
  deleteMachine: (params: DeleteParams) => http.post(`${baseUrlScarf}/craft/machine/type/delete`, params, 'application/json'),
  listMethods: () => http.get(`${baseUrlScarf}/craft/organization/method/lists`, {}),
  createMethods: (params: { data: MethodsInfo[] }) => http.post(`${baseUrlScarf}/craft/organization/method/save`, params, 'application/json'),
  deleteMethods: (params: DeleteParams) => http.post(`${baseUrlScarf}/craft/organization/method/delete`, params, 'application/json')
}

// 纱线颜色
import { YarnColorInfo } from '@/types/craftSetting'
const yarnColor = {
  create: (params: { data: YarnColorInfo[] }) => http.post(`${baseUrlScarf}/yarn/color/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/yarn/color/delete`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/yarn/color/lists`, params)
}
// 潘通色号
const pantongList = (params: { keyword?: string }) => http.get(`${baseUrl}/pan/color/list`, { params })

// 工艺单
import { CraftInfo } from '@/types/craft'
const craft = {
  create: (params: CraftInfo) => http.post(`${baseUrlScarf}/craft/save`, params, 'application/json'),
  detail: (params: DeleteParams) => http.get(`${baseUrlScarf}/craft/detail`, params),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/craft/lists`, params)
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
  create: (params: YarnTypeInfo) => http.post(`${baseUrlScarf}/yarn/type/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/yarn/type/delete`, params, 'application/json'),
  list: (params?: { type: 1 | 2 | 3 }) => http.get(`${baseUrlScarf}/yarn/type/lists`, params)
}
// 纱线
import { YarnInfo } from '@/types/yarnSetting'
interface YarnListParams extends ListParams {
  type: 1 | 2 | 3
}
const yarn = {
  create: (params: YarnInfo) => http.post(`${baseUrlScarf}/yarn/save`, params, 'application/json'),
  list: (params?: YarnListParams) => http.get(`${baseUrlScarf}/yarn/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/yarn/delete`, params, 'application/json')
}

// 装饰辅料
import { DecorateMaterialInfo } from '@/types/materialSetting'
const decorateMaterial = {
  create: (params: DecorateMaterialInfo) => http.post(`${baseUrlScarf}/decorate/material/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/decorate/material/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/decorate/material/delete`, params, 'application/json')
}

// 包装辅料
import { PackMaterialInfo } from '@/types/materialSetting'
const packMaterial = {
  create: (params: PackMaterialInfo) => http.post(`${baseUrlScarf}/pack/material/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/pack/material/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/pack/material/delete`, params, 'application/json')
}

// 客户信息
import { ClientInfo } from '@/types/client'
const client = {
  create: (params: ClientInfo) => http.post(`${baseUrlScarf}/client/save`, params, 'application/json'),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/client/detail`, params),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/client/lists`, params)
}

// 公司类型
import { ClientTypeInfo } from '@/types/client'
const clientType = {
  create: (params: ClientTypeInfo) => http.post(`${baseUrlScarf}/client/tag/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/client/type/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/client/tag/delete`, params, 'application/json')
}

// 小组/人
import { GroupInfo } from '@/types/factoryInfoSetting'
const group = {
  create: (params: GroupInfo) => http.post(`${baseUrlScarf}/user/group/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/user/group/list`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/user/group/delete`, params, 'application/json')
}

// 用户
import { UserInfo } from '@/types/user'
const user = {
  create: (params: UserInfo) => http.post(`${baseUrl}/company/member/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/company/member/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/company/member/delete`, params, 'application/json')
}

// 报价单
import { QuotedPriceInfo } from '@/types/quotedPrice'
const quotedPrice = {
  create: (params: QuotedPriceInfo) => http.post(`${baseUrlScarf}/quote/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/quote/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/quote/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/quote/delete`, params, 'application/json')
}

// 列表设置信息 type 1:报价单列表 , 2:样单列表
const listSetting = {
  create: (params: { id: number | null, type: number, value: string }) => http.post(`${baseUrlScarf}/list/setting/save`, params, 'application/json'),
  detail: (params: { type: number }) => http.get(`${baseUrlScarf}/list/setting`, params)
}

// 仓库
import { StoreInfo } from '@/types/store'
const store = {
  create: (params: StoreInfo) => http.post(`${baseUrlScarf}/store/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/store/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/store/detail`, params),
  searchMat: (params: {
    material_id?: string | number
    store_id?: string | number
    secondary_id?: string | number
    keyword?: string
  }) => http.get(`${baseUrlScarf}/store/total/lists`, params),
}

// 样品
import { SampleInfo } from '@/types/sample'
const sample = {
  create: (params: SampleInfo) => http.post(`${baseUrlScarf}/product/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/product/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/product/detail`, params)
}

// 样单
import { SampleOrderInfo, SampleOrderTime } from '@/types/sampleOrder'
const sampleOrder = {
  again: (params: SampleOrderTime) => http.post(`${baseUrlScarf}/order/time/save`, params, 'application/json'),
  create: (params: SampleOrderInfo) => http.post(`${baseUrlScarf}/order/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/order/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/order/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/order/delete`, params, 'application/json'),
  confirm: (params: { id: string | number, status: 1 | 2 | 3 }) => http.post(`${baseUrlScarf}/order/product/confirm`, params, 'application/json'),
  confirmList: (params: { order_id: number }) => http.get(`${baseUrlScarf}/order/confirm/product/lists`, params)
}

// 产品 产品和样品的接口是同一个，前端方便区分
import { ProductInfo } from '@/types/product'
const product = {
  create: (params: ProductInfo) => http.post(`${baseUrlScarf}/product/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/product/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/product/detail`, params),
}

// 订单 
import { OrderInfo } from '@/types/order'
const order = {
  create: (params: OrderInfo) => http.post(`${baseUrlScarf}/order/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/order/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/order/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/order/delete`, params, 'application/json')
}

// 物料计划单
import { MaterialPlanInfo } from '@/types/materialPlan'
const materialPlan = {
  create: (params: MaterialPlanInfo) => http.post(`${baseUrlScarf}/material/plan/save`, params, 'application/json'),
  list: (params: {
    top_order_id?: string | number // 最外层order_id
    plan_id?: string | number
    order_id?: string | number // time_data里的
    client_id?: string | number
    limit?: number
    page?: number
  }) => http.get(`${baseUrlScarf}/material/plan/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/material/plan/detail`, params),
}
// 物料订购
import { MaterialOrderInfo } from '@/types/materialOrder'
const materialOrder = {
  create: (params: { data: MaterialOrderInfo[] }) => http.post(`${baseUrlScarf}/material/order/save`, params, 'application/json'),
  list: (params: {
    plan_id?: string | number
    order_id?: string | number
    client_id?: string | number
    reserve_id?: string | number // 预订购单
    top_order_id?: string | number // 最外层order_id
  }) => http.get(`${baseUrlScarf}/material/order/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/material/order/detail`, params),
  delete: (params: DetailParams) => http.post(`${baseUrlScarf}/material/order/delete`, params, 'application/json')
}

// 物料预订购
import { MaterialPlanOrderClient } from '@/types/materialPlanOrder'
const materialPlanOrder = {
  create: (params: MaterialPlanOrderClient) => http.post(`${baseUrlScarf}/material/reserve/order/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/material/reserve/order/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/material/reserve/order/detail`, params),
  stockSts: (params: {
    reserve_id: number | string
    year: string | number
    month: string | number
  }) => http.get(`${baseUrlScarf}/material/reserve/store/count`, params)
}

// 物料加工
import { MaterialProcessInfo } from '@/types/materialProcess'
const materialProcess = {
  create: (params: { data: MaterialProcessInfo[] }) => http.post(`${baseUrlScarf}/material/process/save`, params, 'application/json'),
  list: (params: {
    plan_id?: string | number
    order_id?: string | number
    client_id?: string | number
  }) => http.get(`${baseUrlScarf}/material/process/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/material/process/detail`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/material/process/delete`, params, 'application/json')
}

// 物料出入库
import { MaterialStockInfo } from '@/types/materialStock'
const materialStock = {
  create: (params: MaterialStockInfo) => http.post(`${baseUrlScarf}/store/log/save`, params, 'application/json'),
  list: (params: {
    action_type?: number // 搜调取单的时候用，一般是出库单10
    plan_id?: string | number
    order_id?: string | number
    client_id?: string | number
    reserve_id?: string | number // 预订购单
    top_order_id?: string | number // 最外层order_id
  }) => http.get(`${baseUrlScarf}/store/log/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/store/log/delete`, params, 'application/json')
}

// 生产计划
import { ProductionPlanInfo } from '@/types/productionPlan'
const productionPlan = {
  create: (params: { data: ProductionPlanInfo[] }) => http.post(`${baseUrlScarf}/weave/plan/save`, params, 'application/json'),
  list: (params: {
    plan_id?: string | number
    order_id?: string | number
    client_id?: string | number
    top_order_id?: string | number // 最外层order_id
  }) => http.get(`${baseUrlScarf}/weave/plan/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/weave/plan/delete`, params, 'application/json')
}

import { InspectionInfo } from '@/types/inspection'
const inspection = {
  create: (params: { data: InspectionInfo[] }) => http.post(`${baseUrlScarf}/inspection/save`, params, 'application/json'),
  list: (params: {
    plan_id?: string | number
    order_id?: string | number
    client_id?: string | number
    type: 1 | 2 | null
  }) => http.get(`${baseUrlScarf}/inspection/lists`, params),
  delete: (params: DeleteParams) => http.post(`${baseUrlScarf}/inspection/delete`, params, 'application/json')
}
export {
  login,
  logout,
  userCompanySetting,
  forgetPassword,
  getAuthorization,
  getToken,
  check,
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
  inspection
}