<template>
  <div id="materialPlanDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
    <div class="module">
      <el-tabs type="border-card"
        v-model="materialPlanIndex"
        :before-leave="getMaterialPlanDetail">
        <el-tab-pane v-for="(itemFather,indexFather) in materialPlanInfo"
          :key="indexFather"
          :name="itemFather.id.toString()">
          <div slot="label">
            <div style="display:flex;flex-direction:column">
              <div style="line-height:20px;font-size:14px">计划单{{(indexFather+1)}}</div>
              <div style="line-height:20px;font-size:14px">{{itemFather.code}}</div>
            </div>
          </div>
          <div class="titleCtn">
            <div class="title">生产计划</div>
          </div>
          <div class="detailCtn">
            <div class="checkCtn"
              @click="checkDetailFlag=true;is_check=materialPlanDetail.is_check">
              <el-tooltip class="item"
                effect="dark"
                :content="materialPlanDetail.is_check>=3?'点击查看异常处理办法':'点击查看审核日志'"
                placement="bottom">
                <img :src="materialPlanDetail.is_check|checkFilter" />
              </el-tooltip>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">单据编号：</div>
                <div class="text">{{materialPlanDetail.code}}
                  <span class="hoverBlue"
                    style="cursor:pointer;font-size:14px"
                    @click="$copyTextInfo(materialPlanDetail.code)">复制</span>
                </div>
              </div>
              <div class="col">
                <div class="label">创建人：</div>
                <div class="text">{{materialPlanDetail.user_name}}</div>
              </div>
              <div class="col">
                <div class="label">更新时间：</div>
                <div class="text">{{materialPlanDetail.created_at.slice(0,10)}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">关联订单：</div>
                <div class="text">{{materialPlanDetail.order_code}}</div>
              </div>
              <div class="col">
                <div class="label">采购状态：</div>
                <div class="text"
                  :class="materialPlanDetail.material_order_progress|filterOrderProgressClass">{{materialPlanDetail.material_order_progress|filterOrderProgress}}</div>
              </div>
              <div class="col">
                <div class="label">生产计划：</div>
                <div class="text"
                  :class="{'hoverBlue':materialPlanDetail.weave_plan_count>0,'gray':materialPlanDetail.weave_plan_count===0}">{{materialPlanDetail.weave_plan_count>0?('已有计划单'+(materialPlanDetail.weave_plan_count)+'张'):'暂无生产计划'}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text"
                  :class="materialPlanDetail.desc?'':'gray'">{{materialPlanDetail.desc || '无'}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            style="padding-top:0">
            <div class="thead">
              <div class="trow">
                <div class="tcol">产品品类</div>
                <div class="tcol noPad"
                  style="flex:7">
                  <div class="trow">
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">下单数量</div>
                    <div class="tcol">已计划</div>
                    <div class="tcol">总数量百分比</div>
                    <div class="tcol noPad"
                      style="flex:2">
                      <div class="trow">
                        <div class="tcol">产品部位</div>
                        <div class="tcol">计划生产数量</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in materialPlanDetail.production_plan_data"
                :key="item.product_id">
                <div class="tcol">
                  <span>{{item.product_code || item.system_code}}</span>
                  <span>{{item.category}}/{{item.secondary_category}}</span>
                </div>
                <div class="tcol noPad"
                  style="flex:7">
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.product_data"
                    :key="indexChild">
                    <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                    <div class="tcol">{{$toFixed(itemChild.order_number,3,true)}}</div>
                    <div class="tcol">{{$toFixed(itemChild.info_data.reduce((total,cur)=>{return total+cur.number},0),3,true)}}</div>
                    <div class="tcol">{{itemChild.add_percent}}%</div>
                    <div class="tcol noPad"
                      style="flex:2">
                      <div class="trow"
                        v-for="(itemPart,indexPart) in itemChild.info_data"
                        :key="indexPart">
                        <div class="tcol">{{itemPart.part_name}}</div>
                        <div class="tcol">{{$toFixed(itemPart.number,3,true)}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="titleCtn">
            <div class="title">工序物料详情</div>
          </div>
          <template v-if="Number(materialPlanDetail.type)===1">
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">产品信息</div>
                  <div class="tcol">尺码颜色</div>
                  <div class="tcol">产品部位</div>
                  <div class="tcol">计划生产数量</div>
                  <div class="tcol noPad"
                    style="flex:6">
                    <div class="trow">
                      <div class="tcol">工序名称</div>
                      <div class="tcol">物料名称</div>
                      <div class="tcol">物料颜色</div>
                      <div class="tcol">损耗</div>
                      <div class="tcol">合计最终数量</div>
                      <div class="tcol">平均所需物料</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in materialPlanDetail.material_plan_data"
                  :key="index">
                  <div class="tcol">
                    <el-checkbox v-model="item.check"
                      style="align-items: center;display: flex;">
                      <div>{{item.product_code||item.system_code}}</div>
                      <div>{{item.category}}/{{item.secondary_category}}</div>
                    </el-checkbox>
                  </div>
                  <div class="tcol">{{item.size_name}}/{{item.color_name}}</div>
                  <div class="tcol">{{item.part_name}}</div>
                  <div class="tcol">{{$toFixed(item.number,3,true)}}</div>
                  <div class="tcol noPad"
                    style="flex:6">
                    <div class="trow"
                      v-if="item.info_data.length===0">
                      <div class="tcol gray"
                        style="text-align:center">不需要物料</div>
                    </div>
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.info_data"
                      :key="indexChild">
                      <div class="tcol">{{itemChild.process_name}}</div>
                      <div class="tcol">{{itemChild.material_name}}</div>
                      <div class="tcol">{{itemChild.material_color}}</div>
                      <div class="tcol">{{itemChild.loss}}%</div>
                      <div class="tcol">{{$toFixed(itemChild.final_number,3,true)}}{{itemChild.unit}}</div>
                      <div class="tcol">{{itemChild.unit==='kg'?$toFixed(itemChild.final_number/item.number*1000,3,true)+'g':$toFixed(itemChild.final_number/item.number,3,true)+itemChild.unit}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">产品信息</div>
                  <div class="tcol">产品部位</div>
                  <div class="tcol">计划生产数量</div>
                  <div class="tcol noPad"
                    style="flex:6">
                    <div class="trow">
                      <div class="tcol">工序名称</div>
                      <div class="tcol">物料名称</div>
                      <div class="tcol">物料颜色</div>
                      <div class="tcol">损耗</div>
                      <div class="tcol">合计最终数量</div>
                      <div class="tcol">平均所需物料</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in materialPlanDetail.material_plan_data"
                  :key="index">
                  <div class="tcol">
                    <el-checkbox v-model="item.check"
                      style="align-items: center;display: flex;">
                      <span>{{item.product_code||item.system_code}}</span>
                      <span>{{item.category}}/{{item.secondary_category}}</span>
                    </el-checkbox>
                  </div>
                  <div class="tcol">{{item.part_name}}</div>
                  <div class="tcol">{{item.number}}</div>
                  <div class="tcol noPad"
                    style="flex:6">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.info_data"
                      :key="indexChild">
                      <div class="tcol">{{itemChild.process_name}}</div>
                      <div class="tcol">{{itemChild.material_name}}</div>
                      <div class="tcol">{{itemChild.material_color}}</div>
                      <div class="tcol">{{itemChild.loss}}%</div>
                      <div class="tcol">{{$toFixed(itemChild.final_number,3,true)}}kg</div>
                      <div class="tcol">{{$toFixed(itemChild.final_number/item.number*1000,3,true)}}g</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="titleCtn">
            <div class="title">物料信息合计</div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">序号</div>
                <div class="tcol">原料名称</div>
                <div class="tcol">原料颜色</div>
                <div class="tcol">所需数量</div>
                <div class="tcol">原料损耗</div>
                <div class="tcol">最终数量</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-if="materialPlanDetail.material_plan_gather_data.length===0">
                <div class="tcol gray"
                  style="text-align:center">不需要物料</div>
              </div>
              <div class="trow"
                v-for="(item,index) in materialPlanDetail.material_plan_gather_data"
                :key="index">
                <div class="tcol">{{index+1}}</div>
                <div class="tcol">{{item.material_name}}</div>
                <div class="tcol">{{item.material_color}}</div>
                <div class="tcol">{{$toFixed(item.need_number,3,true)}}{{item.unit}}</div>
                <div class="tcol">{{item.loss}}%</div>
                <div class="tcol">{{$toFixed(item.final_number,3,true)}}{{item.unit}}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn"
          style="float:left">
          <div class="btn backHoverGreen"
            @click="showAssociatedPage=true">
            <span class="text">关联页面</span>
          </div>
        </div>
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="buttonList"
            style="margin-left:12px">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">计划单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange"
                  @click="goUpdate">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">修改计划</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$router.push('/materialPlan/create?id=' + $route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">继续添加</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="openPrint">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-dayindingdan"></use>
                  </svg>
                  <span class="text">打印计划</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteMaterialPlan">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">删除计划</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="$router.push('/materialPlan/create?id='+ orderInfo.id +'&copyId='+materialPlanIndex)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">复制计划</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="checkFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shenhedingdan"></use>
                  </svg>
                  <span class="text">审核计划</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{materialPlanDetail.is_check=ev;$forceUpdate()}"
      :show="checkFlag"
      :pid="materialPlanIndex"
      :check_type="9"
      :reason="[]"></zh-check>
    <zh-check-detail :pid="materialPlanIndex"
      :check_type="9"
      :show="checkDetailFlag"
      @close="checkDetailFlag=false"
      :is_check="is_check"
      :errMsg="[
      '由于【订单数量】发生了修改。该原料计划单已变为异常状态。以下为异常单据处理办法：',
      '1. 修改此原料计划单，同步最新的下单尺码颜色以及数量，已计划的原料不能删除，但可以将数量改为0。注意：即使该单据有后续采购单、生产单也可进行修改。系统会通知后续操作人员，对后续单据进行修改。',
      '2. 如果该单据没有后续采购单、生产单，您也可以删除该单据再新建一张。',
      '3. 如果您不想修改原料计划单，并且该单据有后续采购单、生产单，您也可以直接点击审核通过，并新建一张原料计划单，以补充新的下单数量以及原料数量。'
      ]"></zh-check-detail>
    <associated-page :data="associatedPage"
      @close="showAssociatedPage = false"
      :nowPage="true"
      :show="showAssociatedPage"></associated-page>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlan, order } from '@/assets/js/api'
import { MaterialPlanInfo } from '@/types/materialPlan'
import { OrderInfo, OrderTime } from '@/types/order'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  data(): {
    orderInfo: OrderDetail
    materialPlanInfo: MaterialPlanInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      detailLoading: true,
      orderIndex: 0,
      checkFlag: false,
      checkDetailFlag: false,
      is_check: 0,
      orderInfo: {
        id: null,
        client_id: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '',
        settle_unit: '',
        order_type: 1,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: this.$getDate(new Date()),
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
            is_before_confirm: 2,
            is_send: 2,
            batch_data: [
              {
                id: '',
                batch_number: 1,
                batch_title: '',
                batch_type_id: '',
                delivery_time: '',
                is_urgent: 2,
                is_draft: 2,
                total_style: '',
                total_number: '',
                total_price: '',
                desc: '',
                product_data: [
                  {
                    product_id: '',
                    size_color_list: [],
                    product_info: [
                      {
                        size_color: '',
                        size_id: '',
                        color_id: '',
                        number: '',
                        price: ''
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      materialPlanDetail: {
        created_at: '',
        order_id: '',
        type: '1', // 1、按颜色尺码 2.按产品
        desc: '',
        is_draft: 2,
        production_plan_data: [
          {
            product_id: '',
            part_data: [],
            product_data: [
              {
                material_info: [],
                size_color: [],
                color_id: '',
                size_id: '',
                add_percent: '',
                order_number: '',
                info_data: [
                  {
                    part_id: '',
                    number: ''
                  }
                ]
              }
            ]
          }
        ],
        material_plan_data: [],
        material_plan_gather_data: []
      },
      orderId: '',
      materialPlanIndex: '0',
      materialPlanInfo: [],
      showAssociatedPage: false
    }
  },
  filters: {
    filterOrderProgress(val: string) {
      if (Number(val) === 0) {
        return '未采购'
      } else if (Number(val) > 0 && Number(val) < 100) {
        return '部分采购'
      } else if (Number(val) >= 100) {
        return '采购完毕'
      } else {
        return '暂无'
      }
    },
    filterOrderProgressClass(val: string) {
      if (Number(val) === 0) {
        return 'gray'
      } else if (Number(val) > 0 && Number(val) < 100) {
        return 'orange'
      } else if (Number(val) >= 100) {
        return 'green'
      } else {
        return 'gray'
      }
    }
  },
  computed: {
    associatedPage(): any[] {
      return [
        {
          name: '原料采购',
          url: '/materialManage/detail?id=' + this.materialPlanIndex
        },
        {
          name: '原料出入库',
          url:
            '/materialStock/detail?id=' +
            this.$route.query.id +
            '&sampleOrderIndex=' +
            this.$route.query.sampleOrderIndex
        },
        {
          name: '生产计划',
          url:
            '/productionPlan/detail?id=' +
            this.$route.query.id +
            '&sampleOrderIndex=' +
            this.$route.query.sampleOrderIndex
        }
      ]
    }
  },
  methods: {
    goUpdate() {
      this.$router.push('/materialPlan/update?id=' + this.materialPlanIndex + '&order_id=' + this.$route.query.id)
    },
    init() {
      materialPlan
        .list({
          order_id: this.orderInfo.time_data[this.orderIndex].id as number
        })
        .then((res) => {
          if (res.data.status) {
            this.materialPlanInfo = res.data.data
            // 其他页面跳转进来的
            this.materialPlanIndex = this.$route.query.planId || this.materialPlanInfo[0].id!.toString()
            this.getMaterialPlanDetail(this.materialPlanIndex)
          }
          this.loading = false
        })
    },
    deleteMaterialPlan() {
      if (!this.$permissionsFlag('4-4')) {
        return
      }
      this.$confirm('是否删除改物料计划单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialPlan
            .delete({
              id: this.materialPlanIndex
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                if (this.materialPlanInfo.length > 1) {
                  this.materialPlanInfo = this.materialPlanInfo.filter(
                    (item) => item.id !== Number(this.materialPlanIndex)
                  )
                  this.materialPlanIndex = this.materialPlanInfo[0].id?.toString()
                } else {
                  this.$router.push(
                    '/materialPlan/list?page=1&keyword=&client_id=&user_id=&status=0&date=&&order_type=null'
                  )
                }
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    openPrint() {
      this.$confirm('可勾选部分产品信息进行打印,不勾选则打印全部?', '提示', {
        confirmButtonText: '确定打印',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const planInfo = this.materialPlanInfo.find((item) => item.id!.toString() === this.materialPlanIndex)
          let arr = planInfo!.material_plan_data.filter((item) => item.check).map((item) => item.id)
          // 没选就是全选
          if (arr.length === 0) {
            arr = planInfo!.material_plan_data.map((item) => item.id)
          }
          this.$openUrl('/materialPlan/print?id=' + this.materialPlanIndex + '&proId=' + JSON.stringify(arr))
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getMaterialPlanDetail(id: string) {
      this.loading = true
      materialPlan
        .detail({
          id: Number(id)
        })
        .then((res) => {
          this.materialPlanDetail = res.data.data
          this.loading = false
        })
    }
  },
  mounted() {
    this.materialPlanIndex = this.$route.query.materialPlanId || '0'
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          this.orderInfo.time_data.forEach((item, index) => {
            if (item.id === Number(this.$route.query.sampleOrderIndex)) {
              this.orderIndex = index
            }
          })
          this.init()
          if (this.$route.query.ifprint) {
            this.showAssociatedPage = true
          }
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialPlan/detail.less';
</style>
<style lang="less">
#materialPlanDetail {
  .el-tabs__content {
    padding: 0;
  }
}
</style>