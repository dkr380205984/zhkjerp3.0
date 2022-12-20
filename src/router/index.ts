import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store/index'
import Message from 'element-ui'
Vue.use(VueRouter)
// 解决ele组件点击当前页路由时出错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location: string) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}
const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    name: '登录',
    component: () => import('@/views/login.vue')
  }, {
    path: '/commonPrint/printEasy',
    name: '普通打印页',
    component: () => import('../views/commonPrint/printEasy.vue')
  }, {
    path: '/commonPrint/printMenu',
    name: '菜单打印页',
    component: () => import('../views/commonPrint/printMenu.vue')
  }, {
    path: '/craft/print',
    name: '工艺单打印',
    component: () => import('../views/craft/print.vue')
  }, {
    path: '/materialPlan/print',
    name: '物料计划单打印',
    component: () => import('../views/materialPlan/print.vue')
  }, {
    path: '/materialManage/orderPrint',
    name: '物料订购单打印',
    component: () => import('../views/materialManage/orderPrint.vue')
  }, {
    meta: {
      permissions_id: '6-4',
    },
    path: '/accessoriesManage/print',
    name: '辅料订购单打印',
    component: () => import('../views/accessoriesManage/print.vue')
  }, {
    path: '/materialManage/processPrint',
    name: '物料加工单打印',
    component: () => import('../views/materialManage/processPrint.vue')
  }, {
    path: '/store/materialLogPrint',
    name: '原料出入库打印',
    component: () => import('../views/store/materialLogPrint.vue')
  }, {
    path: '/store/productLogPrint',
    name: '产品出入库打印',
    component: () => import('../views/store/productLogPrint.vue')
  }, {
    path: '/tagEditPrint/tagPrint',
    name: '产品标签打印',
    component: () => import('../views/tagEditPrint/tagPrint.vue')
  }, {
    path: '/quotedPrice/print',
    name: '报价单打印',
    component: () => import('../views/quotedPrice/print.vue')
  }, {
    path: '/sampleOrder/print',
    name: '布置单打印',
    component: () => import('../views/sampleOrder/print.vue')
  }, {
    path: '/productionPlan/print',
    name: '生产计划单打印',
    component: () => import('../views/productionPlan/print.vue')
  }, {
    path: '/productionPlan/codePrint',
    name: '生产流转码打印',
    component: () => import('../views/productionPlan/codePrint.vue')
  }, {
    path: '/materialManage/supPrint',
    name: '补纱单打印',
    component: () => import('../views/materialManage/supPrint.vue')
  }, {
    path: '/packManage/printPlan',
    name: '装箱计划单打印',
    component: () => import('../views/packManage/printPlan.vue')
  }, {
    path: '/packManage/printOrder',
    name: '包装订购单打印',
    component: () => import('../views/packManage/printOrder.vue')
  }, {
    path: '/boxManage/print',
    name: '发货单打印',
    component: () => import('../views/boxManage/print.vue')
  }, {
    path: '/setting/printQRCode',
    name: '公司二维码打印',
    component: () => import('../views/setting/printQRCode.vue')
  }, {
    path: '/reimbursementManage/print',
    name: '报销单打印',
    component: () => import('../views/reimbursementManage/print.vue')
  }, {
    path: '/deliveryVisualization',
    name: '大屏发货列表',
    component: () => import('../views/deliveryVisualization.vue')
  }, {
    path: '/order/print',
    name: '生产布置单打印',
    component: () => import('../views/order/print.vue')
  }, {
    path: '/index',
    name: 'index',
    component: () => import('../views/index.vue'),
    children: [{
      meta: {
        permissions_id: '24-3',
      },
      path: '/product/list',
      name: '产品列表',
      component: () => import('../views/product/list.vue')
    }, {
      path: '/menu',
      name: '其他管理',
      component: () => import('../views/menu.vue')
    }, {
      path: '/homePage',
      name: '主页',
      component: () => import('../views/homePage.vue')
    }, {
      meta: {
        permissions_id: 16,
      },
      path: '/setting',
      name: '系统设置',
      component: () => import('../views/setting/setting.vue')
    }, {
      path: '/otherPage/msgList',
      name: '待办事项列表',
      component: () => import('../views/otherPage/msgList.vue')
    }, {
      meta: {
        permissions_id: '23-1',
      },
      path: '/fileManage/list',
      name: '文件管理',
      component: () => import('../views/fileManage/list.vue')
    }, {
      meta: {
        permissions_id: '1-1',
      },
      path: '/quotedPrice/create',
      name: '添加报价单',
      component: () => import('../views/quotedPrice/create.vue')
    }, {
      meta: {
        permissions_id: '1-3',
      },
      path: '/quotedPrice/list',
      name: '报价单列表',
      component: () => import('../views/quotedPrice/list.vue')
    }, {
      meta: {
        permissions_id: '1-3',
      },
      path: '/quotedPrice/detail',
      name: '报价单详情',
      component: () => import('../views/quotedPrice/detail.vue')
    }, {
      meta: {
        permissions_id: '1-2',
      },
      path: '/quotedPrice/update',
      name: '修改报价单',
      component: () => import('../views/quotedPrice/update.vue')
    }, {
      meta: {
        permissions_id: '13-1',
      },
      path: '/client/list',
      name: '客户/单位列表',
      component: () => import('../views/client/list.vue')
    }, {
      path: '/client/create',
      name: '添加客户/单位',
      component: () => import('../views/client/create.vue')
    }, {
      path: '/client/update',
      name: '修改客户/单位',
      component: () => import('../views/client/update.vue')
    }, {
      meta: {
        permissions_id: '2-3',
      },
      path: '/sampleOrder/list',
      name: '样单列表',
      component: () => import('../views/sampleOrder/list.vue')
    }, {
      meta: {
        permissions_id: '2-1',
      },
      path: '/sampleOrder/create',
      name: '样单添加',
      component: () => import('../views/sampleOrder/create.vue')
    }, {
      meta: {
        permissions_id: '2-3',
      },
      path: '/sampleOrder/detail',
      name: '样单详情',
      component: () => import('../views/sampleOrder/detail.vue')
    }, {
      meta: {
        permissions_id: '2-2',
      },
      path: '/sampleOrder/update',
      name: '样单修改',
      component: () => import('../views/sampleOrder/update.vue')
    }, {
      meta: {
        permissions_id: '2-1',
      },
      path: '/sampleOrder/again',
      name: '继续打样',
      component: () => import('../views/sampleOrder/again.vue')
    }, {
      meta: {
        permissions_id: '3-3',
      },
      path: '/order/list',
      name: '订单列表',
      component: () => import('../views/order/list.vue')
    }, {
      meta: {
        permissions_id: '3-1',
      },
      path: '/order/create',
      name: '订单添加',
      component: () => import('../views/order/create.vue')
    }, {
      meta: {
        permissions_id: '3-3',
      },
      path: '/order/detail',
      name: '订单详情',
      component: () => import('../views/order/detail.vue')
    }, {
      meta: {
        permissions_id: '3-2',
      },
      path: '/order/update',
      name: '订单修改',
      component: () => import('../views/order/update.vue')
    }, {
      path: '/tagEditPrint/editTag',
      name: '编辑标签',
      component: () => import('../views/tagEditPrint/editTag.vue')
    }, {
      meta: {
        permissions_id: '15-1',
      },
      path: '/craft/create',
      name: '创建工艺单',
      component: () => import('../views/craft/create.vue')
    }, {
      meta: {
        permissions_id: '15-2',
      },
      path: '/craft/update',
      name: '修改工艺单',
      component: () => import('../views/craft/update.vue')
    }, {
      meta: {
        permissions_id: '15-3',
      },
      path: '/craft/detail',
      name: '工艺单详情',
      component: () => import('../views/craft/detail.vue')
    }, {
      meta: {
        permissions_id: '15-3',
      },
      path: '/craft/list',
      name: '工艺单列表',
      component: () => import('../views/craft/list.vue')
    }, {
      meta: {
        permissions_id: '20-1',
      },
      path: '/dataReport/orderStatistics',
      name: '订单数据图表',
      component: () => import('../views/dataReport/orderStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-2',
      },
      path: '/dataReport/sampleOrderStatistics',
      name: '样单数据图表',
      component: () => import('../views/dataReport/sampleOrderStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-3',
      },
      path: '/dataReport/materialsUsePlanDataStatistics',
      name: '计划数据统计',
      component: () => import('../views/dataReport/materialsUsePlanDataStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-4',
      },
      path: '/dataReport/materialsOrderingStatistics',
      name: '订购数据统计',
      component: () => import('../views/dataReport/materialsOrderingStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-5',
      },
      path: '/dataReport/materialsTransferStatistics',
      name: '调取数据统计',
      component: () => import('../views/dataReport/materialsTransferStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-6',
      },
      path: '/dataReport/materialsMachiningStatistics',
      name: '加工数据统计',
      component: () => import('../views/dataReport/materialsMachiningStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-7',
      },
      path: '/dataReport/materialsStockStatistics',
      name: '原料库存数据统计',
      component: () => import('../views/dataReport/materialsStockStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-8',
      },
      path: '/dataReport/accessoriesDecorationOrderStatistics',
      name: '装饰辅料订购图表',
      component: () => import('../views/dataReport/accessoriesDecorationOrderStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-9',
      },
      path: '/dataReport/accessoriesPackagingOrderStatistics',
      name: '包装辅料订购图表',
      component: () => import('../views/dataReport/accessoriesPackagingOrderStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-10',
      },
      path: '/dataReport/productionPlanChartStatistics',
      name: '生产计划图表',
      component: () => import('../views/dataReport/productionPlanChartStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-11',
      },
      path: '/dataReport/inspectionReceivingDispatchingStatistic',
      name: '检验收发图表',
      component: () => import('../views/dataReport/inspectionReceivingDispatchingStatistic.vue')
    }, {
      meta: {
        permissions_id: '20-12',
      },
      path: '/dataReport/workshopSalaryStatistics',
      name: '车间工资图表',
      component: () => import('../views/dataReport/workshopSalaryStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-13',
      },
      path: '/dataReport/reimbursementChartStatistics',
      name: '报销费用图表',
      component: () => import('../views/dataReport/reimbursementChartStatistics.vue')
    }, {
      meta: {
        permissions_id: '20-14',
      },
      path: '/dataReport/transportationOutboundStatistics',
      name: '运输出库图表',
      component: () => import('../views/dataReport/transportationOutboundStatistics.vue')
    }, {
      meta: {
        permissions_id: '21-1',
      },
      path: '/billingManagement/rawMaterialPlan',
      name: '单据管理-原料计划单',
      component: () => import('../views/billingManagement/rawMaterialPlan.vue')
    }, {
      meta: {
        permissions_id: '21-2',
      },
      path: '/billingManagement/rawMaterialSupplement',
      name: '单据管理-原料补充单',
      component: () => import('../views/billingManagement/rawMaterialSupplement.vue')
    }, {
      meta: {
        permissions_id: '21-3',
      },
      path: '/billingManagement/rawMaterialPurchaseOrder',
      name: '单据管理-原料订购单',
      component: () => import('../views/billingManagement/rawMaterialPurchaseOrder.vue')
    }, {
      meta: {
        permissions_id: '21-4',
      },
      path: '/billingManagement/rawMaterialTransferOrder',
      name: '单据管理-原料调取单',
      component: () => import('../views/billingManagement/rawMaterialTransferOrder.vue')
    }, {
      meta: {
        permissions_id: '21-5',
      },
      path: '/billingManagement/rawMaterialProcessingOrder',
      name: '单据管理-原料加工单',
      component: () => import('../views/billingManagement/rawMaterialProcessingOrder.vue')
    }, {
      meta: {
        permissions_id: '21-6',
      },
      path: '/billingManagement/productionPlan',
      name: '单据管理-生产计划单',
      component: () => import('../views/billingManagement/productionPlan.vue')
    }, {
      meta: {
        permissions_id: '21-7',
      },
      path: '/billingManagement/workshopSettlementLog',
      name: '单据管理-结算日志-计件',
      component: () => import('../views/billingManagement/workshopSettlementLog.vue')
    },{
      meta: {
        permissions_id: '21-22',
      },
      path: '/billingManagement/workshopPayTimeLog',
      name: '单据管理-结算日志-计时',
      component: () => import('../views/billingManagement/workshopPayTimeLog.vue')
    }, {
      meta: {
        permissions_id: '21-8',
      },
      path: '/billingManagement/auxiliaryMaterialPurchaseOrder',
      name: '单据管理-辅料订购单',
      component: () => import('../views/billingManagement/auxiliaryMaterialPurchaseOrder.vue')
    }, {
      meta: {
        permissions_id: '21-9',
      },
      path: '/billingManagement/packingOrder',
      name: '单据管理-包装订购单',
      component: () => import('../views/billingManagement/packingOrder.vue')
    }, {
      meta: {
        permissions_id: '21-10',
      },
      path: '/billingManagement/transportationDeliveryOrder',
      name: '单据管理-运输出库单',
      component: () => import('../views/billingManagement/transportationDeliveryOrder.vue')
    }, {
      meta: {
        permissions_id: '21-11',
      },
      path: '/billingManagement/deductionForm',
      name: '单据管理-我方扣款单据',
      component: () => import('../views/billingManagement/deductionForm.vue')
    }, {
      meta: {
        permissions_id: '21-12',
      },
      path: '/billingManagement/ourInvoiceList',
      name: '单据管理-我方发票单据',
      component: () => import('../views/billingManagement/ourInvoiceList.vue')
    }, {
      meta: {
        permissions_id: '21-13',
      },
      path: '/billingManagement/collectionList',
      name: '单据管理-收款单据',
      component: () => import('../views/billingManagement/collectionList.vue')
    }, {
      meta: {
        permissions_id: '21-14',
      },
      path: '/billingManagement/paymentDocument',
      name: '单据管理-付款单据',
      component: () => import('../views/billingManagement/paymentDocument.vue')
    }, {
      meta: {
        permissions_id: '21-15',
      },
      path: '/billingManagement/inspectionReceiptDocument',
      name: '单据管理-检验入库单据',
      component: () => import('../views/billingManagement/inspectionReceiptDocument.vue')
    }, {
      meta: {
        permissions_id: '21-16',
      },
      path: '/billingManagement/oppositeInvoicing',
      name: '单据管理-对方发票单据',
      component: () => import('../views/billingManagement/oppositeInvoicing.vue')
    }, {
      meta: {
        permissions_id: '21-17',
      },
      path: '/billingManagement/orderQuotationComparison',
      name: '单据管理-订单报价单对比单据',
      component: () => import('../views/billingManagement/orderQuotationComparison.vue')
    }, {
      meta: {
        permissions_id: '21-18',
      },
      path: '/billingManagement/shaXianInOutList',
      name: '单据管理-补纱入出库单据',
      component: () => import('../views/billingManagement/shaXianInOutList.vue')
    }, {
      meta: {
        permissions_id: '21-19',
      },
      path: '/billingManagement/fabricWarehousing',
      name: '单据管理-面料入出库单据',
      component: () => import('../views/billingManagement/fabricWarehousing.vue')
    }, {
      meta: {
        permissions_id: '21-20',
      },
      path: '/billingManagement/auxiliaryInOutList',
      name: '单据管理-辅料入出库单据',
      component: () => import('../views/billingManagement/auxiliaryInOutList.vue')
    }, {
      meta: {
        permissions_id: '21-21',
      },
      path: '/billingManagement/productStoreLogList',
      name: '单据管理-产品入出库单据',
      component: () => import('../views/billingManagement/productStoreLogList.vue')
    }, {
      meta: {
        permissions_id: '17-1',
      },
      path: '/workerManage/create',
      name: '添加员工',
      component: () => import('../views/workerManage/create.vue')
    }, {
      meta: {
        permissions_id: '17-2',
      },
      path: '/workerManage/detail',
      name: '员工详情',
      component: () => import('../views/workerManage/detail.vue')
    }, {
      meta: {
        permissions_id: '17-2',
      },
      path: '/workerManage/update',
      name: '修改员工',
      component: () => import('../views/workerManage/update.vue')
    }, {
      meta: {
        permissions_id: '17-3',
      },
      path: '/workerManage/list',
      name: '员工列表',
      component: () => import('../views/workerManage/list.vue')
    }, {
      meta: {
        permissions_id: '18-1',
      },
      path: '/reimbursementManage/create',
      name: '添加报销单',
      component: () => import('../views/reimbursementManage/create.vue')
    }, {
      meta: {
        permissions_id: '18-3',
      },
      path: '/reimbursementManage/detail',
      name: '报销单详情',
      component: () => import('../views/reimbursementManage/detail.vue')
    }, {
      meta: {
        permissions_id: '18-3',
      },
      path: '/reimbursementManage/list',
      name: '报销单列表',
      component: () => import('../views/reimbursementManage/list.vue')
    }, {
      meta: {
        permissions_id: '18-2',
      },
      path: '/reimbursementManage/update',
      name: '修改报销单',
      component: () => import('../views/reimbursementManage/update.vue')
    }, {
      meta: {
        permissions_id: '12-3',
      },
      path: '/store/list',
      name: '仓库列表',
      component: () => import('../views/store/list.vue')
    }, {
      meta: {
        permissions_id: '12-3',
      },
      path: '/store/productList',
      name: '产品仓库列表',
      component: () => import('../views/store/productList.vue')
    }, {
      meta: {
        permissions_id: '12-1',
      },
      path: '/store/create',
      name: '添加仓库',
      component: () => import('../views/store/create.vue')
    }, {
      path: '/store/materialDetail',
      name: '物料仓库详情',
      component: () => import('../views/store/materialDetail.vue')
    }, {
      path: '/store/productDetail',
      name: '产品仓库详情',
      component: () => import('../views/store/productDetail.vue')
    }, {
      meta: {
        permissions_id: '4-1',
      },
      path: '/materialPlan/create',
      name: '物料计划添加',
      component: () => import('../views/materialPlan/create.vue')
    }, {
      meta: {
        permissions_id: '4-3',
      },
      path: '/materialPlan/list',
      name: '物料计划列表',
      component: () => import('../views/materialPlan/list.vue')
    }, {
      meta: {
        permissions_id: '4-3',
      },
      path: '/materialPlan/detail',
      name: '物料计划详情',
      component: () => import('../views/materialPlan/detail.vue')
    }, {
      meta: {
        permissions_id: '4-2',
      },
      path: '/materialPlan/update',
      name: '物料计划修改',
      component: () => import('../views/materialPlan/update.vue')
    }, {
      meta: {
        permissions_id: '5-3',
      },
      path: '/materialManage/list',
      name: '原料管理列表',
      component: () => import('../views/materialManage/list.vue')
    }, {
      meta: {
        permissions_id: '5-3',
      },
      path: '/materialManage/detail',
      name: '原料管理详情',
      component: () => import('../views/materialManage/detail.vue')
    }, {
      meta: {
        permissions_id: '5-3',
      },
      path: '/materialManage/supList',
      name: '补充物料列表',
      component: () => import('../views/materialManage/supList.vue')
    }, {
      meta: {
        permissions_id: '6-3',
      },
      path: '/accessoriesManage/list',
      name: '辅料管理列表',
      component: () => import('../views/accessoriesManage/list.vue')
    }, {
      meta: {
        permissions_id: '6-3',
      },
      path: '/accessoriesManage/detail',
      name: '辅料管理详情',
      component: () => import('../views/accessoriesManage/detail.vue')
    }, {
      meta: {
        permissions_id: '7-3',
      },
      path: '/materialStock/detail',
      name: '物料出入库详情',
      component: () => import('../views/materialStock/detail.vue')
    }, {
      meta: {
        permissions_id: '7-3',
      },
      path: '/materialStock/list',
      name: '物料出入库列表',
      component: () => import('../views/materialStock/list.vue')
    }, {
      meta: {
        permissions_id: '8-3',
      },
      path: '/productionPlan/list',
      name: '生产计划列表',
      component: () => import('../views/productionPlan/list.vue')
    }, {
      meta: {
        permissions_id: '8-3',
      },
      path: '/productionPlan/progressList',
      name: '生产进度列表',
      component: () => import('../views/productionPlan/progressList.vue')
    }, {
      meta: {
        permissions_id: '8-3',
      },
      path: '/productionPlan/codeList',
      name: '生产流转卡列表',
      component: () => import('../views/productionPlan/codeList.vue')
    }, {
      meta: {
        permissions_id: '8-3',
      },
      path: '/productionPlan/detail',
      name: '生产计划详情',
      component: () => import('../views/productionPlan/detail.vue')
    }, {
      meta: {
        permissions_id: '8-3',
      },
      path: '/productionPlan/progressDetail',
      name: '生产进度详情',
      component: () => import('../views/productionPlan/progressDetail.vue')
    }, {
      meta: {
        permissions_id: '9-3',
      },
      path: '/inspection/detail',
      name: '检验收发详情',
      component: () => import('../views/inspection/detail.vue')
    }, {
      meta: {
        permissions_id: '9-3',
      },
      path: '/inspection/list',
      name: '检验收发列表',
      component: () => import('../views/inspection/list.vue')
    }, {
      meta: {
        permissions_id: '10-3',
      },
      path: '/packManage/list',
      name: '包装管理列表',
      component: () => import('../views/packManage/list.vue')
    }, {
      meta: {
        permissions_id: '10-3',
      },
      path: '/packManage/detail',
      name: '包装管理详情',
      component: () => import('../views/packManage/detail.vue')
    }, {
      meta: {
        permissions_id: '19-3',
      },
      path: '/workshopManagement/payTimeList',
      name: '车间管理日志',
      component: () => import('../views/workshopManagement/payTimeList.vue')
    }, {
      meta: {
        permissions_id: '19-3',
      },
      path: '/workshopManagement/list',
      name: '车间管理订单列表',
      component: () => import('../views/workshopManagement/list.vue')
    }, {
      meta: {
        permissions_id: '19-5',
      },
      path: '/workshopManagement/staffList',
      name: '车间管理员工列表',
      component: () => import('../views/workshopManagement/staffList.vue')
    }, {
      meta: {
        permissions_id: '19-2',
      },
      path: '/workshopManagement/detail',
      name: '车间管理订单添加',
      component: () => import('../views/workshopManagement/detail.vue')
    }, {
      meta: {
        permissions_id: '19-2',
      },
      path: '/workshopManagement/staffDetail',
      name: ' 车间管理员工添加',
      component: () => import('../views/workshopManagement/staffDetail.vue')
    }, {
      meta: {
        permissions_id: '19-2',
      },
      path: '/workshopManagement/payTimeDetail',
      name: ' 车间管理计时添加',
      component: () => import('../views/workshopManagement/payTimeDetail.vue')
    }, {
      meta: {
        permissions_id: '19-2',
      },
      path: '/workshopManagement/staffInputDetail',
      name: ' 车间管理员工录入详情',
      component: () => import('../views/workshopManagement/staffInputDetail.vue')
    }, {
      meta: {
        permissions_id: '11-3',
      },
      path: '/boxManage/list',
      name: '装箱计划列表',
      component: () => import('../views/boxManage/list.vue')
    }, {
      meta: {
        permissions_id: '11-3',
      },
      path: '/boxManage/orderList',
      name: '装箱管理列表',
      component: () => import('../views/boxManage/orderList.vue')
    }, {
      meta: {
        permissions_id: '11-3',
      },
      path: '/boxManage/detail',
      name: '装箱计划详情',
      component: () => import('../views/boxManage/detail.vue')
    }, {
      meta: {
        permissions_id: '11-3',
      },
      path: '/boxManage/orderDetail',
      name: '装箱管理详情',
      component: () => import('../views/boxManage/orderDetail.vue')
    }, {
      path: '/boxManage/boxList',
      name: '发货单列表',
      component: () => import('../views/boxManage/boxList.vue')
    }, {
      path: '/boxManage/boxDetail',
      name: '发货单详情',
      component: () => import('../views/boxManage/boxDetail.vue')
    }, {
      meta: {
        permissions_id: '14-3',
      },
      path: '/materialPlanOrder/list',
      name: '原料预订购列表',
      component: () => import('../views/materialPlanOrder/list.vue')
    }, {
      meta: {
        permissions_id: '14-3',
      },
      path: '/materialPlanOrder/detail',
      name: '原料预订购详情',
      component: () => import('../views/materialPlanOrder/detail.vue')
    }, {
      path: '/tutorialSystem/create',
      name: '添加系统教程',
      component: () => import('../views/tutorialSystem/create.vue')
    }, {
      path: '/tutorialSystem/detail',
      name: '系统教程详情',
      component: () => import('../views/tutorialSystem/detail.vue')
    }, {
      path: '/tutorialSystem/list',
      name: '系统教程列表',
      component: () => import('../views/tutorialSystem/list.vue')
    }, {
      meta: {
        permissions_id: '22-1',
      },
      path: '/settlement/collectionList',
      name: '客户收款列表',
      component: () => import('../views/settlement/collectionList.vue')
    }, {
      meta: {
        permissions_id: '22-2',
      },
      path: '/settlement/collectionDetail',
      name: '客户收款详情',
      component: () => import('../views/settlement/collectionDetail.vue')
    }, {
      meta: {
        permissions_id: '22-3',
      },
      path: '/settlement/paymentList',
      name: '客户付款列表',
      component: () => import('../views/settlement/paymentList.vue')
    }, {
      meta: {
        permissions_id: '22-4',
      },
      path: '/settlement/paymentDetail',
      name: '客户付款详情',
      component: () => import('../views/settlement/paymentDetail.vue')
    }, {
      meta: {
        permissions_id: '25-3',
      },
      path: '/document/list',
      name: '单证列表',
      component: () => import('../views/document/list.vue')
    }, {
      meta: {
        permissions_id: '25-1',
      },
      path: '/document/create',
      name: '单证添加',
      component: () => import('../views/document/create.vue')
    }, {
      path: '/document/detail',
      name: '单证详情',
      component: () => import('../views/document/detail.vue'),
      children: [{
        path: '/document/detail/CL/edit',
        name: '形式发票编辑',
        component: () => import('../views/document/CL/edit.vue')
      }, {
        path: '/document/detail/CL/print',
        name: '形式发票详情',
        component: () => import('../views/document/CL/print.vue')
      }, {
        path: '/document/detail/PL/edit',
        name: '装箱单编辑',
        component: () => import('../views/document/PL/edit.vue')
      }, {
        path: '/document/detail/PL/print',
        name: '装箱单详情',
        component: () => import('../views/document/PL/print.vue')
      }, {
        path: '/document/detail/ED/edit',
        name: '出口货物报关单编辑',
        component: () => import('../views/document/ED/edit.vue')
      }, {
        path: '/document/detail/ED/print',
        name: '出口货物报关单详情',
        component: () => import('../views/document/ED/print.vue')
      }]
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/**
 *  专用于判断权限
 * @param {string|number} id 需要判断权限的id
 * @returns {boolean}
 */
const isHasPermissions = (id: string | number) => {
  if (!window.sessionStorage.getItem('module_id')) {
    return true
  }
  const moduleId = JSON.parse(window.sessionStorage.getItem('module_id') as string)
  if (!moduleId.includes(id)) return
  return true
}

// 路由守卫
router.beforeEach((to, from, next) => {
  // 权限判断 新增无权限即为初始帐号权限
  if (to.meta && to.meta.permissions_id && window.sessionStorage.getItem('module_id') && JSON.parse(window.sessionStorage.getItem('module_id') as string).length > 0) {
    if (!isHasPermissions(to.meta.permissions_id)) {
      next(false)
      Message.Message.warning('抱歉，您没有相应的权限')
      return
    }
  }
  // 获取路由
  // store.commit('status/getTitle', to.name ? to.name : from.name)
  store.commit('status/getRoute', {
    name: to.name,
    fullPath: to.fullPath
  })
  next()
})


export default router

