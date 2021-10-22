<template>
  <div id="inspectionDetail"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">订单组件</div>
      </div>
    </div>
    <div class="module">
      <el-tabs type="border-card"
        v-model="productionPlanIndex">
        <el-tab-pane v-for="(item,index) in productionPlanMergeList"
          :key="index"
          :name="item.process_id.toString()"
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
                  style="flex:5"
                  v-for="(itemPro,indexPro) in itemChild.product_info_data"
                  :key="indexPro">
                  <div class="trow">
                    <div class="tcol">
                      <el-checkbox v-model="itemPro.check"
                        @change="$forceUpdate()">
                        <div style="display:flex;flex-direction:column">
                          <span>{{itemPro.product_code}}</span>
                          <span>{{itemPro.category_name}}/{{itemPro.type_name}}</span>
                        </div>
                      </el-checkbox>
                    </div>
                    <div class="tcol">{{itemPro.size_name}}/{{itemPro.color_name}}</div>
                    <div class="tcol">
                      <span>{{itemPro.part_name}}</span>
                      <span>{{itemPro.number}}</span>
                    </div>
                    <div class="tcol">已完成数量</div>
                    <div class="tcol">{{itemPro.inspection_number}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">计划单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverBlue"
                  @click="goInspection(1)">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">检验入库</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="goInspection(2)">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">检验出库</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
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
                      label="入库"></el-option>
                    <el-option :value="2"
                      label="出库"></el-option>
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
                      <span class="text">检验数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="请填写检验数量"
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
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="请填写次品数量"
                        v-model="itemChild.shoddy_number"></el-input>
                    </div>
                  </div>
                  <div class="once">
                    <div class="label">
                      <span class="text">次品原因</span>
                    </div>
                    <div class="info elCtn">
                      <el-select placeholder="请填写次品原因"
                        v-model="itemChild.shoddy_reason"
                        multiple>
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
    [propName: string]: any
  } {
    return {
      productionPlanMergeList: [],
      productionPlanList: [],
      productionPlanIndex: '0',
      orderIndex: '0',
      order_id: 0,
      inspectionFlag: false,
      inspectionInfo: [],
      shoddy_reason: [
        {
          value: '原因1',
          label: '原因1'
        },
        {
          value: '原因2',
          label: '原因2'
        },
        {
          value: '原因3',
          label: '原因3'
        },
        {
          value: '原因4',
          label: '原因4'
        }
      ]
    }
  },
  computed: {
    checkList(): ProductionPlanInfo[] {
      const finded = this.productionPlanMergeList.find(
        (itemFind) => itemFind.process_id.toString() === this.productionPlanIndex
      )
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
                itemChild.color_name +
                '/' +
                itemChild.size_name,
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
          this.$message.success('添加成功')
          this.closeInspection()
        }
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
        productionPlan
          .list({
            order_id: this.order_id
          })
          .then((res) => {
            if (res.data.status) {
              this.productionPlanList = res.data.data
              if (this.productionPlanList.length > 0) {
                this.productionPlanMergeList = this.$mergeData(this.productionPlanList, {
                  mainRule: ['process_name', 'process_id']
                })
                this.productionPlanIndex = this.productionPlanMergeList[0].process_id.toString()
              } else {
                this.$message.warning('该订单还未创建生产计划信息，请先填写生产计划')
                this.$router.push('/productionPlan/detail?id=' + this.$route.query.id)
              }
              console.log(this.productionPlanMergeList)
            }
          })
        inspection
          .list({
            order_id: this.order_id,
            type: null
          })
          .then((res) => {
            if (res.data.status) {
              console.log(res)
            }
          })
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