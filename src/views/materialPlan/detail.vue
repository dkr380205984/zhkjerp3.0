<template>
  <div id="materialPlanDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
    <div class="module">
      <el-tabs type="border-card"
        v-model="materialPlanIndex">
        <el-tab-pane v-for="(itemFather,indexFather) in materialPlanInfo"
          :key="indexFather"
          :name="itemFather.id.toString()"
          :label="'计划单'+(indexFather+1)">
          <div class="titleCtn">
            <div class="title">生产计划</div>
          </div>
          <div class="detailCtn">
            <div class="row">
              <div class="col">
                <div class="label">单据编号：</div>
                <div class="text">{{itemFather.code}}</div>
              </div>
              <div class="col">
                <div class="label">创建人：</div>
                <div class="text">{{itemFather.user_name}}</div>
              </div>
              <div class="col">
                <div class="label">更新时间：</div>
                <div class="text">{{itemFather.created_at.slice(0,10)}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">关联订单：</div>
                <div class="text">{{itemFather.order_code}}</div>
              </div>
              <div class="col">
                <div class="label">采购状态：</div>
                <div class="text">暂无</div>
              </div>
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text"
                  :class="itemFather.desc?'':'gray'">{{itemFather.desc || '无'}}</div>
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
                v-for="item in itemFather.production_plan_data"
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
                    <div class="tcol">{{itemChild.order_number}}</div>
                    <div class="tcol">{{itemChild.info_data.reduce((total,cur)=>{return total+cur.number},0)}}</div>
                    <div class="tcol">{{itemChild.add_percent}}%</div>
                    <div class="tcol noPad"
                      style="flex:2">
                      <div class="trow"
                        v-for="(itemPart,indexPart) in itemChild.info_data"
                        :key="indexPart">
                        <div class="tcol">{{itemPart.part_name}}</div>
                        <div class="tcol">{{itemPart.number}}</div>
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
          <template v-if="Number(itemFather.type)===1">
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
                  v-for="(item,index) in itemFather.material_plan_data"
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
                  <div class="tcol">{{item.number}}</div>
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
                      <div class="tcol">{{itemChild.final_number}}{{itemChild.unit}}</div>
                      <div class="tcol">{{itemChild.unit==='kg'?$toFixed(itemChild.final_number/item.number*1000)+'g':$toFixed(itemChild.final_number/item.number)+itemChild.unit}}</div>
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
                  v-for="(item,index) in itemFather.material_plan_data"
                  :key="index">
                  <div class="tcol">
                    <el-checkbox v-model="item.check"
                      style="align-items: center;display: flex;">
                      <span>{{item.product_code||item.system_code}}</span>
                      <span>{{item.category}}/{{item.secondary_category}}</span>
                    </el-checkbox>
                  </div>
                  <div class="tcol">{{item.part_name}}</div>
                  <div class="tcol">{{item.order_number}}</div>
                  <div class="tcol noPad"
                    style="flex:6">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.info_data"
                      :key="indexChild">
                      <div class="tcol">{{itemChild.process_name}}</div>
                      <div class="tcol">{{itemChild.material_name}}</div>
                      <div class="tcol">{{itemChild.material_color}}</div>
                      <div class="tcol">{{itemChild.loss}}%</div>
                      <div class="tcol">{{itemChild.final_number}}kg</div>
                      <div class="tcol">{{$toFixed(itemChild.final_number/item.order_number*1000)}}g</div>
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
                v-if="itemFather.material_plan_gather_data.length===0">
                <div class="tcol gray"
                  style="text-align:center">不需要物料</div>
              </div>
              <div class="trow"
                v-for="(item,index) in itemFather.material_plan_gather_data"
                :key="index">
                <div class="tcol">{{index+1}}</div>
                <div class="tcol">{{item.material_name}}</div>
                <div class="tcol">{{item.material_color}}</div>
                <div class="tcol">{{item.need_number}}{{item.unit}}</div>
                <div class="tcol">{{item.loss}}%</div>
                <div class="tcol">{{item.final_number}}{{item.unit}}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bottomFixBar">
      <div class="main">
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
                <el-tooltip class="item"
                  effect="dark"
                  content="可勾选部分产品信息进行打印"
                  placement="top">
                  <div class="btn backHoverBlue"
                    @click="openPrint">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-dayindingdan"></use>
                    </svg>
                    <span class="text">打印计划</span>
                  </div>
                </el-tooltip>
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
                <div class="btn backHoverGreen"
                  @click="showAssociatedPage=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">关联页面</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="chooseIndexFlag">
      <div class="main"
        style=" width: 500px;">
        <div class="titleCtn">
          <div class="text">选择打样次数</div>
          <div class="closeCtn"
            @click="init();chooseIndexFlag=false">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="contentCtn">
          <div class="tag"
            v-for="(item,index) in orderInfo.time_data"
            :key="index"
            :class="{'backHoverBlue':index===orderIndex}"
            @click="orderIndex=index"
            v-show="item.has_material_plan===2">第{{index+1}}次打样</div>
        </div>
        <div class="oprCtn">
          <div class="btn borderBtn"
            @click="init();chooseIndexFlag=false">取消</div>
          <div class="btn backHoverBlue"
            @click="init();chooseIndexFlag=false">确定</div>
        </div>
      </div>
    </div>
    <associated-page :data="associatedPage"
      @close="showAssociatedPage = false"
      :show="showAssociatedPage"></associated-page>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlan, order } from '@/assets/js/api'
import { MaterialPlanInfo } from '@/types/materialPlan'
export default Vue.extend({
  data(): {
    materialPlanInfo: MaterialPlanInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      orderIndex: 0,
      chooseIndexFlag: false,
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
      materialPlanIndex: '0',
      materialPlanInfo: [],
      showAssociatedPage: false
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
          url: '/materialStock/detail?id=' + this.$route.query.id
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
          order_id: this.orderInfo.time_data[this.orderIndex].id
        })
        .then((res) => {
          if (res.data.status) {
            this.materialPlanInfo = res.data.data
            this.materialPlanIndex = this.materialPlanInfo[0].id?.toString()
          }
          this.loading = false
        })
    },
    deleteMaterialPlan() {
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
      const planInfo = this.materialPlanInfo.find((item) => item.id!.toString() === this.materialPlanIndex)
      let arr = planInfo!.material_plan_data.filter((item) => item.check).map((item) => item.id)
      // 没选就是全选
      if (arr.length === 0) {
        arr = planInfo!.material_plan_data.map((item) => item.id)
      }
      this.$openUrl('/materialPlan/print?id=' + this.materialPlanIndex + '&proId=' + JSON.stringify(arr))
    }
  },
  mounted() {
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          if (this.orderInfo.time_data.length > 1) {
            if (this.orderInfo.time_data.filter((item: any) => item.has_material_plan === 1).length > 1) {
              this.chooseIndexFlag = true
            } else {
              this.orderInfo.time_data.forEach((item: any, index: number) => {
                if (item.has_material_plan === 1) {
                  this.orderIndex = index
                }
              })
              this.init()
            }
          } else {
            this.init()
          }
          if (this.$route.query.ifprint) {
            this.showAssociatedPage = true
          }
          this.loading = false
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