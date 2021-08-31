import { ActionContext } from 'vuex'
import { ApiState } from '@/types/vuex'
import { CascaderInfo } from '@/types/vuex'
import { YarnInfo } from '@/types/yarnSetting'
import { PackMaterialInfo, DecorateMaterialInfo } from '@/types/materialSetting'
import { ProcessInfo } from '@/types/processSetting'
import { ClientTypeInfo } from '@/types/client'
import { GroupInfo } from '@/types/factoryInfoSetting'
import { StyleInfo, IngredientInfo, ColourInfo } from '@/types/productSetting'
import { productType, yarnType, clientType, decorateMaterial, packMaterial, process, group, style, colour, ingredient, orderType, yarnColor } from '@/assets/js/api'
import { OrderType } from '@/types/orderSetting'

const apiState: ApiState = {
  orderType: {
    status: false,
    arr: []
  },
  sampleOrderType: {
    status: false,
    arr: []
  },
  productStyle: {
    status: false,
    arr: []
  },
  productType: {
    status: false,
    arr: []
  },
  ingredient: {
    status: false,
    arr: []
  },
  colour: {
    status: false,
    arr: []
  },
  yarnType: {
    status: false,
    arr: []
  },
  yarnColor: {
    status: false,
    arr: []
  },
  // 下单和销售客户
  clientType: {
    status: false,
    arr: []
  },
  decorateMaterial: {
    status: false,
    arr: []
  },
  packMaterial: {
    status: false,
    arr: []
  },
  materialProcess: {
    status: false,
    arr: []
  },
  halfProcess: {
    status: false,
    arr: []
  },
  staffProcess: {
    status: false,
    arr: []
  },
  group: {
    status: false,
    arr: []
  }
}
const apiMutations = {
  getProductStyle(state: ApiState, productStyleSelf: StyleInfo[]) {
    state.productStyle.status = true
    state.productStyle.arr = productStyleSelf
  },
  getProductType(state: ApiState, productTypeSelf: CascaderInfo[]) {
    state.productType.status = true
    state.productType.arr = productTypeSelf
  },
  getIngredient(state: ApiState, ingredientSelf: IngredientInfo[]) {
    state.ingredient.status = true
    state.ingredient.arr = ingredientSelf
  },
  getColour(state: ApiState, colourSelf: ColourInfo[]) {
    state.colour.status = true
    state.colour.arr = colourSelf
  },
  getYarnType(state: ApiState, yarnSelf: CascaderInfo[]) {
    state.yarnType.status = true
    state.yarnType.arr = yarnSelf
  },
  getYarnColor(state: ApiState, yarnColorSelf: CascaderInfo[]) {
    state.yarnColor.status = true
    state.yarnColor.arr = yarnColorSelf
  },
  getclientType(state: ApiState, clientTypeSelf: CascaderInfo[]) {
    state.clientType.status = true
    state.clientType.arr = clientTypeSelf
  },
  getDecorateMaterial(state: ApiState, decorateMaterialSelf: DecorateMaterialInfo[]) {
    state.decorateMaterial.status = true
    state.decorateMaterial.arr = decorateMaterialSelf
  },
  getPackMaterial(state: ApiState, packMaterialSelf: PackMaterialInfo[]) {
    state.packMaterial.status = true
    state.packMaterial.arr = packMaterialSelf
  },
  getMaterialProcess(state: ApiState, materialProcessSelf: ProcessInfo[]) {
    state.materialProcess.status = true
    state.materialProcess.arr = materialProcessSelf
  },
  getHalfProcess(state: ApiState, halfProcessSelf: ProcessInfo[]) {
    state.halfProcess.status = true
    state.halfProcess.arr = halfProcessSelf
  },
  getStaffProcess(state: ApiState, staffProcessSelf: ProcessInfo[]) {
    state.staffProcess.status = true
    state.staffProcess.arr = staffProcessSelf
  },
  getGroup(state: ApiState, groupSelf: GroupInfo[]) {
    state.group.status = true
    state.group.arr = groupSelf
  },
  getOrderType(state: ApiState, orderTypeSelf: OrderType[]) {
    state.orderType.status = true
    state.orderType.arr = orderTypeSelf
  },
  getSampleOrderType(state: ApiState, sampleOrderTypeSelf: OrderType[]) {
    state.sampleOrderType.status = true
    state.sampleOrderType.arr = sampleOrderTypeSelf
  }
}

const apiActions = {
  getProductStyleAsync(content: ActionContext<ApiState, any>) {
    style.list().then((res) => {
      if (res.data.status) {
        content.commit('getProductStyle', res.data.data)
      }
    })
  },
  getColourAsync(content: ActionContext<ApiState, any>) {
    colour.list().then((res) => {
      if (res.data.status) {
        content.commit('getColour', res.data.data)
      }
    })
  },
  getIngredientAsync(content: ActionContext<ApiState, any>) {
    ingredient.list().then((res) => {
      if (res.data.status) {
        content.commit('getIngredient', res.data.data)
      }
    })
  },
  getProductTypeAsync(content: ActionContext<ApiState, any>) {
    productType.list().then((res) => {
      if (res.data.status) {
        // 直接把数据处理成级联选择器需要的数据
        const cascaderData: CascaderInfo = res.data.data.items.map((item: { id: any; name: any; unit: any; child_info: any[], size: any[] }) => {
          return {
            value: item.id,
            label: item.name,
            unit: item.unit,
            size: item.size,
            children: item.child_info.map((itemChild) => {
              return {
                value: itemChild.id,
                label: itemChild.name
              }
            })
          }
        })
        content.commit('getProductType', cascaderData)
      }
    })
  },
  getYarnTypeAsync(content: ActionContext<ApiState, any>) {
    yarnType.list().then((res) => {
      const data: YarnInfo[] = res.data.data
      const shaxian = data.filter((item) => item.type === 1)
      const mianliao = data.filter((item) => item.type === 2)
      const maoliao = data.filter((item) => item.type === 3)
      const cascaderData: CascaderInfo[] = [{
        label: '纱线',
        value: 1,
        children: shaxian.map((item) => {
          return {
            label: item.name as string,
            value: item.id as number,
            children: item.yarn_data?.map((itemChild) => {
              return {
                label: itemChild.name as string,
                value: itemChild.id as number
              }
            })
          }
        })
      }, {
        label: '面料',
        value: 2,
        children: mianliao.map((item) => {
          return {
            label: item.name as string,
            value: item.id as number,
            children: item.yarn_data?.map((itemChild) => {
              return {
                label: itemChild.name as string,
                value: itemChild.id as number
              }
            })
          }
        })
      }, {
        label: '毛料',
        value: 3,
        children: maoliao.map((item) => {
          return {
            label: item.name as string,
            value: item.id as number,
            children: item.yarn_data?.map((itemChild) => {
              return {
                label: itemChild.name as string,
                value: itemChild.id as number
              }
            })
          }
        })
      }]
      content.commit('getYarnType', cascaderData)
    })
  },
  getYarnColorAsync(content: ActionContext<ApiState, any>) {
    yarnColor.list().then((res) => {
      if (res.data.status) {
        content.commit('getYarnColor', res.data.data)
      }
    })
  },
  getClientTypeAsync(content: ActionContext<ApiState, any>) {
    clientType.list().then((res) => {
      const data: ClientTypeInfo[] = res.data.data
      const cascaderData: CascaderInfo[] = data.map((item) => {
        return {
          type: item.type,
          label: item.name,
          value: item.id as number,
          children: item.public_tag!.map((itemChild) => {
            return {
              type: 'public',
              label: itemChild.name,
              value: itemChild.id as number,
              children: itemChild.rel_client!.map((itemClient) => {
                return {
                  label: itemClient.name,
                  value: itemClient.id as number
                }
              })
            }
          }).concat(item.rel_tag!.map((itemChild) => {
            return {
              type: 'private',
              label: itemChild.name,
              value: itemChild.id as number,
              children: itemChild.rel_client!.map((itemClient) => {
                return {
                  label: itemClient.name,
                  value: itemClient.id as number
                }
              })
            }
          }))
        }
      })
      content.commit('getclientType', cascaderData)
    })
  },
  getDecorateMaterialAsync(content: ActionContext<ApiState, any>) {
    decorateMaterial.list().then((res) => {
      if (res.data.status) {
        content.commit('getDecorateMaterial', res.data.data)
      }
    })
  },
  getPackMaterialAsync(content: ActionContext<ApiState, any>) {
    packMaterial.list().then((res) => {
      if (res.data.status) {
        content.commit('getPackMaterial', res.data.data)
      }
    })
  },
  getHalfProcessAsync(content: ActionContext<ApiState, any>) {
    process.list({
      type: 2
    }).then((res) => {
      if (res.data.status) {
        content.commit('getHalfProcess', res.data.data)
      }
    })
  },
  getGroupAsync(content: ActionContext<ApiState, any>) {
    group.list().then((res) => {
      if (res.data.status) {
        content.commit('getGroup', res.data.data)
      }
    })
  },
  getOrderTypeAsync(content: ActionContext<ApiState, any>) {
    orderType.list({
      order_type: 1
    }).then((res) => {
      content.commit('getOrderType', res.data.data)
    })
  },
  getSampleOrderTypeAsync(content: ActionContext<ApiState, any>) {
    orderType.list({
      order_type: 2
    }).then((res) => {
      content.commit('getSampleOrderType', res.data.data)
    })
  }
}
export default {
  // 表示允许  使用namespaced方法使用该模块，必须有
  namespaced: true,
  state: apiState,
  mutations: apiMutations,
  actions: apiActions
}
