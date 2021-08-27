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
  list: () => http.get(`${baseUrl}/production/edit/list`, {}),
  createSide: (params: { data: SideInfo[] }) => http.post(`${baseUrl}/production/side/save`, params, 'application/json'),
  deleteSide: (params: DeleteParams) => http.post(`${baseUrl}/production/side/delete`, params, 'application/json'),
  createMachine: (params: { data: MachineInfo[] }) => http.post(`${baseUrl}/production/type/save`, params, 'application/json'),
  deleteMachine: (params: DeleteParams) => http.post(`${baseUrl}/production/type/delete`, params, 'application/json'),
  createMethods: (params: { data: MethodsInfo[] }) => http.post(`${baseUrl}/production/method/save`, params, 'application/json'),
  deleteMethods: (params: DeleteParams) => http.post(`${baseUrl}/production/method/delete`, params, 'application/json')
}

// 纱线颜色
import { YarnColorInfo } from '@/types/craftSetting'
const yarnColor = {
  create: (params: { data: YarnColorInfo[] }) => http.post(`${baseUrl}/yarn/color/save`, params, 'application/json'),
  delete: (params: DeleteParams) => http.post(`${baseUrl}/yarn/color/delete`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrl}/yarn/color/list`, params)
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
  list: (params: YarnListParams) => http.get(`${baseUrlScarf}/yarn/lists`, params),
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
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/client/detail`, params)
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

// 报价单
import { QuotedPriceInfo } from '@/types/quotedPrice'
const quotedPrice = {
  create: (params: QuotedPriceInfo) => http.post(`${baseUrlScarf}/quote/save`, params, 'application/json'),
  list: (params?: ListParams) => http.get(`${baseUrlScarf}/quote/lists`, params),
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/quote/detail`, params)
}

// 列表设置信息 type 1:报价单列表 , 2:样单列表
const listSetting = {
  create: (params: { id: number | null, type: number, value: string }) => http.post(`${baseUrlScarf}/list/setting/save`, params, 'application/json'),
  detail: (params: { type: number }) => http.get(`${baseUrlScarf}/list/setting`, params)
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
  detail: (params: DetailParams) => http.get(`${baseUrlScarf}/order/detail`, params)
}
export {
  login,
  logout,
  userCompanySetting,
  forgetPassword,
  getAuthorization,
  getToken,
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
  billDocumentSetting,
  yarnType,
  yarn,
  client,
  clientType,
  decorateMaterial,
  packMaterial,
  group,
  quotedPrice,
  listSetting,
  sample,
  sampleOrder
}