<template>
  <div id="inspectionDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
    <div class="module">
      <el-tabs type="border-card"
        v-model="productionPlanIndex">
        <el-tab-pane v-for="(item,index) in productionPlanMergeList"
          :key="index"
          :name="item.process_name"
          :label="item.process_name">
          <div class="titleCtn">
            <div class="title">计划加工</div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">生产单号</div>
                <div class="tcol">生产单位</div>
                <div class="tcol">计划完成</div>
                <div class="tcol noPad"
                  style="flex:5">
                  <div class="trow">
                    <div class="tcol">产品信息</div>
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">部位及分配数量</div>
                    <div class="tcol">已完成数量</div>
                    <div class="tcol">已入库检验数量</div>
                  </div>
                </div>
                <div class="tcol">操作</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                :key="indexChild">
                <div class="tcol">
                  <el-checkbox v-model="itemChild.checkAll"
                    @change="(ev)=>{itemChild.product_info_data.forEach((itemPro)=>itemPro.check=ev);$forceUpdate()}">{{itemChild.code}}</el-checkbox>
                </div>
                <div class="tcol">
                  <span>{{itemChild.client_name}}</span>
                  <span>{{itemChild.process_name}}</span>
                </div>
                <div class="tcol">{{itemChild.end_time}}
                  <span :class="$diffByDate(itemChild.end_time)>0?'green':'red'">({{$diffByDate(itemChild.end_time)>0?'还剩'+$diffByDate(itemChild.end_time)+'天':'逾期'+Math.abs($diffByDate(itemChild.end_time))+'天'}})</span>
                </div>
                <div class="tcol noPad"
                  style="flex:5">
                  <div class="trow"
                    v-for="(itemPro,indexPro) in itemChild.product_info_data"
                    :key="indexPro">
                    <div class="tcol">
                      <el-checkbox v-model="itemPro.check"
                        @change="$forceUpdate()"
                        style="display: flex;align-items: center;">
                        <div style="display:flex;flex-direction:column">
                          <span>{{itemPro.product_code}}</span>
                          <span>{{itemPro.category_name}}/{{itemPro.secondary_category_name}}</span>
                        </div>
                      </el-checkbox>
                    </div>
                    <div class="tcol">{{itemPro.size_name+'/'+itemPro.color_name}}</div>
                    <div class="tcol">
                      <span>{{itemPro.part_name}}</span>
                      <span class="blue">{{itemPro.number}}</span>
                    </div>
                    <div class="tcol gray">未统计</div>
                    <div class="tcol green">{{itemPro.inspection_number}}</div>
                  </div>
                </div>
                <div class="tcol oprCtn">
                  <div class="opr hoverGreen"
                    @click="goDeduct(itemChild,3)">扣款</div>
                  <div class="opr"
                    :class="itemChild.deduct_data&&itemChild.deduct_data.length>0?'hoverBlue':'gray'"
                    @click="getDeduct(itemChild.deduct_data)">扣款记录</div>
                </div>
              </div>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">生产单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverBlue"
                  @click="goInspection(1)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">检验入库</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="goInspection(2)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">生产出库</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">收发检验日志</div>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="row title">
            <div class="col">单据编号</div>
            <div class="col">检验单位</div>
            <div class="col">入库时间</div>
            <div class="col">产品编号</div>
            <div class="col">产品部位</div>
            <div class="col">尺码颜色</div>
            <div class="col">检验数量</div>
            <div class="col">次品数量</div>
            <div class="col">次品原因</div>
            <div class="col">创建人</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in inspectionList"
            :key="item.id">
            <div class="col">{{item.doc_code}}</div>
            <div class="col">{{item.client_name}}</div>
            <div class="col">{{item.complete_time}}</div>
            <div class="col">{{item.product_code}}</div>
            <div class="col">{{item.part_name}}</div>
            <div class="col">{{item.color}}/{{item.size}}</div>
            <div class="col">{{item.number}}</div>
            <div class="col">{{item.shoddy_number}}</div>
            <div class="col">{{item.shoddy_reason}}</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">
              <div class="oprCtn">
                <span class="opr hoverRed"
                  @click="deleteInspection(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="inspectionFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">生产检验</span>
          <div class="closeCtn"
            @click="closeInspection">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn"
            v-for="(item,index) in inspectionInfo"
            :key="index">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">收发检验类型</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-select placeholder="选择收发类型"
                    v-model="item.type"
                    disabled>
                    <el-option :value="1"
                      label="检验入库"></el-option>
                    <el-option :value="2"
                      label="生产出库"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">收发日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    placeholder="请选择时间"
                    value-format="yyyy-MM-dd"
                    v-model="item.complete_time"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">单据编号</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="item.code"
                    disabled
                    placeholder="单据编号"></el-input>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemChild,indexChild) in item.child_data"
              :key="indexChild">
              <div class="col">
                <div class="label">
                  <span class="text">产品信息</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemChild.doc_info"
                    placeholder="产品信息"
                    disabled></el-input>
                </div>
              </div>
              <div class="col">
                <div class="spaceBetween">
                  <div class="once">
                    <div class="label">
                      <span class="text">分配数量</span>
                      <span class="explanation">(默认)</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="请填写分配数量"
                        v-model="itemChild.production_number"
                        disabled></el-input>
                    </div>
                  </div>
                  <div class="once">
                    <div class="label">
                      <span class="text">{{item.type===1?'检验数量':'出库数量'}}</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="请填写数量"
                        v-model="itemChild.number"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="spaceBetween">
                  <div class="once">
                    <div class="label">
                      <span class="text">次品数量</span>
                      <span class="explanation"
                        v-if="item.type===2">(无)</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="请填写次品数量"
                        v-model="itemChild.shoddy_number"
                        :disabled="item.type===2"></el-input>
                    </div>
                  </div>
                  <div class="once">
                    <div class="label">
                      <span class="text">次品原因</span>
                      <span class="explanation"
                        v-if="item.type===2">(无)</span>
                    </div>
                    <div class="info elCtn">
                      <el-select placeholder="请填写次品原因"
                        v-model="itemChild.shoddy_reason"
                        multiple
                        :disabled="item.type===2">
                        <el-option v-for="item in shoddy_reason"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeInspection">取消</span>
          <span class="btn backHoverBlue"
            @click="saveInspection">确认</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
    <zh-deduct :show="deductFlag"
      @close="deductFlag = false"
      :type="deductInfo.type"
      :id="deductInfo.doc_id"
      :order_id="$route.query.id"
      :client_id="deductInfo.client_id"
      :client_name="deductInfo.client_name"></zh-deduct>
    <zh-deduct-detail :show="deductDetailFlag"
      @close="deductDetailFlag = false"
      :data="deductDetail"></zh-deduct-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, productionPlan } from '@/assets/js/api'
import { ProductionPlanInfo } from '@/types/productionPlan'
import { InspectionInfo } from '@/types/inspection'
import { inspection } from '@/assets/js/api'
interface ProductionPlanInfoMerge {
  process_id: number
  process_name: string
  checkAll?: boolean
  childrenMergeInfo: ProductionPlanInfo[]
}
interface InspectionInfoMerge {
  type: 1 | 2
  order_id: number
  complete_time: string
  code?: string
  child_data: InspectionInfo[]
}
export default Vue.extend({
  data(): {
    productionPlanMergeList: ProductionPlanInfoMerge[]
    productionPlanList: ProductionPlanInfo[]
    inspectionInfo: InspectionInfoMerge[]
    inspectionList: InspectionInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      deductFlag: false,
      deductDetailFlag: false,
      deductDetail: [],
      deductInfo: {
        client_id: '',
        client_name: '',
        doc_id: '',
        type: 2
      },
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
      productionPlanMergeList: [],
      productionPlanList: [],
      productionPlanIndex: '0',
      orderIndex: '0',
      order_id: 0,
      inspectionFlag: false,
      inspectionInfo: [],
      inspectionList: [],
      shoddy_reason: [
        {
          value: '织造原因'
        },
        {
          value: '捻须原因'
        },
        {
          value: '拉毛原因'
        },
        {
          value: '刺毛原因'
        },
        {
          value: '水洗原因'
        },
        {
          value: '车缝原因'
        },
        {
          value: '套口原因'
        },
        {
          value: '整烫原因'
        },
        {
          value: '手工原因'
        },
        {
          value: '其它原因'
        }
      ]
    }
  },
  computed: {
    checkList(): ProductionPlanInfo[] {
      const finded = this.productionPlanMergeList.find((itemFind) => itemFind.process_name === this.productionPlanIndex)
      const checkInfo = finded
        ? finded.childrenMergeInfo.filter((item) => {
            return item.product_info_data.filter((itemChild) => itemChild.check).length > 0
          })
        : []
      if (checkInfo.length === 0) {
        return []
      } else {
        return checkInfo.map((item) => {
          item.product_info_data = item.product_info_data.filter((item) => item.check)
          return item
        })
      }
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        productionPlan.list({
          order_id: this.order_id
        }),
        inspection.list({
          order_id: this.order_id,
          type: null
        })
      ]).then((res) => {
        this.productionPlanList = res[0].data.data
        if (this.productionPlanList.length > 0) {
          this.productionPlanMergeList = this.$mergeData(this.productionPlanList, {
            mainRule: ['process_name']
          })
          this.productionPlanIndex = this.productionPlanMergeList[0].process_name
          if (this.$route.query.isBarcodeScanner === 'true') {
            const finded: any = this.productionPlanMergeList.find(
              (itemFind) => itemFind.process_name === this.productionPlanIndex
            )
            const findChild = finded.childrenMergeInfo.find(
              (itemChild: any) => itemChild.code === this.$route.query.code
            )
            const findPro = findChild.product_info_data.find(
              (itemPro: any) => itemPro.product_id == this.$route.query.product_id
            )
            findChild.checkAll = true
            findPro.check = true
            this.$forceUpdate()
            this.goInspection(1)
          }
        } else {
          this.$message.warning('该订单还未创建生产计划信息，请先填写生产计划')
          this.$router.push('/productionPlan/detail?id=' + this.$route.query.id)
        }
        this.inspectionList = res[1].data.data
        console.log(this.inspectionList)
        this.loading = false
      })
    },
    // 扣款
    goDeduct(info: any, type: 3) {
      this.deductInfo.client_id = info.client_id
      this.deductInfo.client_name = info.client_name
      this.deductInfo.doc_id = info.id
      this.deductInfo.type = type
      this.deductFlag = true
    },
    getDeduct(info: any[]) {
      if (!info || info.length === 0) {
        this.$message.warning('暂无扣款信息')
      } else {
        this.deductDetail = info
        this.deductDetailFlag = true
      }
    },
    goInspection(type: 1 | 2) {
      if (this.checkList.length === 0) {
        this.$message.error('请选择产品信息进行检验操作')
        return
      }
      this.InspectionInfo = []
      this.checkList.forEach((item) => {
        this.inspectionInfo.push({
          type: type,
          order_id: this.order_id,
          complete_time: this.$getDate(new Date()),
          code: item.code,
          child_data: item.product_info_data.map((itemChild) => {
            return {
              doc_info:
                itemChild.product_code +
                '/' +
                itemChild.part_name +
                '/' +
                (itemChild.color_name || '无配色') +
                '/' +
                (itemChild.size_name || '无尺码'),
              doc_info_id: itemChild.id,
              production_number: itemChild.number,
              number: '',
              shoddy_number: '',
              shoddy_reason: []
            }
          })
        })
      })
      this.inspectionFlag = true
    },
    closeInspection() {
      this.inspectionInfo = []
      this.inspectionFlag = false
    },
    getCmpData() {
      this.inspectionInfo.forEach((item) =>
        item.child_data.forEach(
          (itemChild) => (itemChild.shoddy_reason = (itemChild.shoddy_reason as string[]).join(','))
        )
      )
    },
    saveInspection() {
      this.getCmpData()
      const formData: InspectionInfo[] = this.$flatten(this.$flatten(this.inspectionInfo))
      inspection.create({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success('检验成功')
          this.closeInspection()
          this.init()
        }
      })
    },
    deleteInspection(id: number) {
      this.$confirm('是否删除该检验日志?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          inspection
            .delete({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('删除成功')
                this.init()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  mounted() {
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.order_id = res.data.data.time_data[this.orderIndex].id
        this.orderInfo = res.data.data
        this.init()
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/inspection/detail.less';
</style>
<style lang="less">
#inspectionDetail {
  .el-tabs__content {
    padding: 0;
  }
}
</style>