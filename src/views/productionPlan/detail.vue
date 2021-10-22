<template>
  <div id="productionPlanDetail"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">订单组件</div>
      </div>
    </div>
    <div class="module">
      <el-tabs type="border-card"
        v-model="materialPlanIndex">
        <el-tab-pane v-for="(item,index) in materialPlanList"
          :key="index"
          :name="item.id.toString()"
          :label="'计划单'+(index+1)">
          <div class="titleCtn">
            <div class="title">计划加工</div>
          </div>
          <!-- 按尺码配色填 -->
          <template v-if="Number(item.type)===1">
            <div class="description">
              <span>生产加工的物料信息由物料计划确定，如需补充加工步骤所需的物料请<span class="orange">修改物料计划单</span>。注意！已经分配过生产计划的物料计划单不能被修改。</span>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">产品信息</div>
                  <div class="tcol">产品部位</div>
                  <div class="tcol">尺码颜色</div>
                  <div class="tcol">下单数量</div>
                  <div class="tcol">计划生产数量</div>
                  <div class="tcol">产品部位</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(itemPro,indexPro) in item.material_plan_data"
                  :key="indexPro">
                  <div class="tcol">
                    <el-checkbox v-model="itemPro.check"> {{itemPro.product_code}}</el-checkbox>
                  </div>
                  <div class="tcol">{{itemPro.part_name}}</div>
                  <div class="tcol">{{itemPro.size_name}}/{{itemPro.color_name}}</div>
                  <div class="tcol">{{itemPro.order_number}}</div>
                  <div class="tcol">{{itemPro.number}}</div>
                  <div class="tcol">产品部位</div>
                </div>
              </div>
            </div>
          </template>
          <!-- 按产品款式填 -->
          <template v-else>
            <div class="description">
              <span>由于计划单是按照产品款式进行填写的，所以<span class="green">同一款产品只能被分配给同一家单位进行生产</span>，如需分配给不同加工单位请<span class="orange">修改物料计划单</span>。</span>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">产品信息</div>
                  <div class="tcol">产品部位</div>
                  <div class="tcol">下单数量</div>
                  <div class="tcol">计划生产数量</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(itemPro,indexPro) in item.material_plan_data"
                  :key="indexPro">
                  <div class="tcol">
                    <el-checkbox v-model="itemPro.check"> {{itemPro.product_code}}</el-checkbox>
                  </div>
                  <div class="tcol">{{itemPro.part_name}}</div>
                  <div class="tcol">{{itemPro.order_number}}</div>
                  <div class="tcol">{{itemPro.number}}</div>
                </div>
              </div>
            </div>
          </template>
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">计划单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverBlue">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">加工计划</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="getProductionPlan">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">内部派单</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module">
      <el-tabs type="border-card"
        v-model="productionPlanIndex">
        <el-tab-pane v-for="(item,index) in productionPlanList"
          :key="index"
          :name="item.id.toString()"
          :label="'加工单'+(index+1)">
          <div class="titleCtn">
            <div class="title">加工单据</div>
          </div>
          <div class="detailCtn">
            <div class="row">
              <div class="col">
                <div class="label">加工单号：</div>
                <div class="text blue">{{item.code}}</div>
              </div>
              <div class="col">
                <div class="label">加工单位：</div>
                <div class="text">{{item.client_name}}</div>
              </div>
              <div class="col">
                <div class="label">订购日期：</div>
                <div class="text">{{item.code}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">加工单号：</div>
                <div class="text blue">{{item.code}}</div>
              </div>
              <div class="col">
                <div class="label">加工单位：</div>
                <div class="text">{{item.code}}</div>
              </div>
              <div class="col">
                <div class="label">订购日期：</div>
                <div class="text">{{item.code}}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="popup"
      v-show="productionPlanFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">生产计划单填写</span>
          <div class="closeCtn">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="stepCtn">
            <div class="step"
              :class="{'active':!materialPlanFlag}">
              <div class="circle">
                <span class="white">1</span>
              </div>
              <div class="name">排产信息</div>
            </div>
            <div class="step"
              :class="{'active':materialPlanFlag}">
              <div class="circle">
                <span class="white">2</span>
              </div>
              <div class="name">原料信息</div>
            </div>
          </div>
          <template v-if="!materialPlanFlag">
            <div class="editCtn"
              v-for="(item,index) in productionPlanInfo"
              :key="index">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">加工单位</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader placeholder="请选择订购单位"
                      v-model="item.client_id_arr"
                      :options="processClientList"
                      @change="(ev)=>{item.client_id=ev[2]}"></el-cascader>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label">
                        <span class="text">加工类型</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-select placeholder="请选择加工类型"
                          v-model="item.type">
                          <el-option v-for="item in productionTypeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label">
                        <span class="text">加工工序</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-select placeholder="请选择加工工序"
                          v-model="item.process_id">
                          <el-option v-for="item in halfProcessList"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"></el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label">
                        <span class="text">订购时间</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-date-picker style="width:100%"
                          placeholder="请选择时间"
                          value-format="yyyy-MM-dd"
                          v-model="item.start_time"></el-date-picker>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label">
                        <span class="text">交货日期</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-date-picker style="width:100%"
                          placeholder="请选择交货日期"
                          value-format="yyyy-MM-dd"
                          v-model="item.end_time"></el-date-picker>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row"
                v-for="(itemPro,indexPro) in item.product_info_data"
                :key="'pro'+ indexPro">
                <div class="col">
                  <div class="label"
                    v-if="indexPro===0">
                    <span class="text">产品信息</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择产品信息"
                      v-model="itemPro.select_arr">
                      <el-option v-for="(item,index) in checkList"
                        :key="index"
                        :value="item.product_id+'/'+ item.part_id+'/'+item.size_id+'/'+ item.color_id"
                        :label="item.size_name?item.product_code+'/'+ item.part_name+'/'+item.size_name+'/'+ item.color_name:item.product_code+'/'+ item.part_name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="indexPro===0">
                        <span class="text">单价</span>
                        <span class="explanation">(必填)</span>
                      </div>
                      <div class="info elCtn">
                        <el-input v-model="itemPro.price"
                          placeholder="请输入单价"
                          @input="(ev)=>{itemPro.total_price=Number(ev)*Number(itemPro.number)}">
                          <template slot="append">元</template>
                        </el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="indexPro===0">
                        <span class="text">数量</span>
                        <span class="explanation">(必填)</span>
                      </div>
                      <div class="info elCtn">
                        <el-input v-model="itemPro.number"
                          @input="(ev)=>{itemPro.total_price=Number(ev)*Number(itemPro.price)}"
                          placeholder="请输入数量">
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexPro===0">
                    <span class="text">合计总价</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemPro.total_price"
                      placeholder="默认"
                      disabled>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexPro===0">添加</div>
                <div class="opr hoverRed"
                  v-if="indexPro>0"
                  @click="$deleteItem(item.product_info_data,indexPro)">删除</div>
              </div>
              <div class="row"
                v-for="(itemOther,indexOther) in item.others_fee"
                :key="'other'+indexOther">
                <div class="col">
                  <div class="label"
                    v-if="indexOther===0">
                    <span class="text">额外费用名称</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入额外费用名称"
                      v-model="itemOther.name"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexOther===0">
                    <span class="text">额外费用金额</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入额外费用金额"
                      v-model="itemOther.price">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexOther===0">
                    <span class="text">额外费用备注</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入额外费用备注"
                      v-model="itemOther.desc"></el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexOther===0"
                  @click="$addItem(item.others_fee,{
                  desc: '',
                  name: '',
                  price: ''
                })">添加</div>
                <div class="opr hoverRed"
                  v-if="indexOther>0"
                  @click="$deleteItem(item.others_fee,indexOther)">删除</div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">订购备注信息</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入订购备注信息"
                      v-model="item.desc"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">订购总价</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="totalPlanPriceList[index]"
                      placeholder="自动计算"
                      disabled>
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">订购总数</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="totalPlanNumberList[index]"
                      placeholder="自动计算"
                      disabled>
                      <template slot="append">kg</template>
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn backHoverBlue"
              style="margin-bottom:16px">添加加工单位</div>
          </template>
          <template v-else>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">单位名称</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcol">物料名称</div>
                      <div class="tcol">物料颜色</div>
                      <div class="tcol">所需数量</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in productionPlanInfo"
                  :key="index">
                  <div class="tcol">{{item.client_id}}</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemMat,indexMat) in item.material_info_data"
                      :key="indexMat">
                      <div class="tcol">{{itemMat.material_name}}</div>
                      <div class="tcol">{{itemMat.material_color}}</div>
                      <div class="tcol">{{itemMat.number}}kg</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn">取消</span>
          <span class="btn backHoverOrange"
            @click="getMaterialInfo">查看物料分配</span>
          <span class="btn backHoverBlue"
            @click="saveProductionPlan">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlan, order, productionPlan } from '@/assets/js/api'
import { ProductionPlanInfo } from '@/types/productionPlan'
import { MaterialPlanInfo, MaterailPlanData } from '@/types/materialPlan'
import { CascaderInfo } from '@/types/vuex'
import { productionType } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    materialPlanList: MaterialPlanInfo[]
    productionPlanInfo: ProductionPlanInfo[]
    productionPlanList: ProductionPlanInfo[]
    [propName: string]: any
  } {
    return {
      order_id: 0,
      orderIndex: '0',
      materialPlanList: [],
      materialPlanIndex: '0',
      productionPlanFlag: false,
      materialPlanFlag: false,
      productionPlanInfo: [
        {
          type: null,
          order_id: '',
          client_id: '',
          start_time: this.$getDate(new Date()),
          end_time: '',
          desc: '',
          total_price: '',
          total_number: '',
          process_id: '',
          product_info_data: [
            {
              product_id: '',
              size_id: '',
              color_id: '',
              part_id: '',
              number: '',
              price: '',
              total_price: '',
              select_arr: ''
            }
          ],
          material_info_data: [
            {
              material_id: '',
              material_name: '',
              material_color: '',
              number: ''
            }
          ],
          others_fee: [
            {
              name: '',
              price: '',
              desc: ''
            }
          ]
        }
      ],
      productionTypeList: productionType,
      productionPlanList: [],
      productionPlanIndex: '0'
    }
  },
  computed: {
    processClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter(
        (item: { label: string }) => item.label === '生产织造单位' || item.label === '生产加工单位'
      )
    },
    halfProcessList() {
      return this.$store.state.api.halfProcess.arr
    },
    // 被选中的产品信息
    checkList(): MaterailPlanData[] {
      const finded = this.materialPlanList.find((item) => Number(item.id) === Number(this.materialPlanIndex))
      return finded ? finded.material_plan_data.filter((item) => item.check) : []
    },
    // 被选中的产品的物料信息展开
    checkMaterialFlattenList(): any[] {
      return this.$flatten(this.$flatten(this.checkList))
    },
    totalPlanNumberList(): number[] {
      return this.productionPlanInfo.map((item) => {
        return item.product_info_data.reduce((total, current) => {
          return total + Number(current.number)
        }, 0)
      })
    },
    totalPlanPriceList(): number[] {
      return this.productionPlanInfo.map((item) => {
        return (
          item.product_info_data.reduce((total, current) => {
            return total + Number(current.number) * Number(current.price)
          }, 0) +
          item.others_fee.reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        )
      })
    }
  },
  methods: {
    getProductionPlan() {
      const checkLength = this.checkList.length
      if (checkLength === 0) {
        this.$message.error('请选择产品信息进行加工操作')
        return
      }
      this.productionPlanInfo[0].product_info_data = this.checkList.map((item) => {
        return {
          product_id: item.product_id,
          size_id: item.size_id,
          color_id: item.color_id,
          part_id: item.part_id,
          number: item.number as number,
          price: '',
          total_price: '',
          select_arr: item.product_id + '/' + item.part_id + '/' + item.size_id + '/' + item.color_id
        }
      })
      this.productionPlanFlag = true
    },
    // 根据加工单选的信息计算物料信息
    getMaterialInfo(ifShow: boolean = false) {
      // 填写方式
      const edit_type = this.materialPlanList.find((item) => Number(item.id) === Number(this.materialPlanIndex))?.type
      this.productionPlanInfo.forEach((item) => {
        item.material_info_data = []
        item.product_info_data.forEach((itemChild) => {
          const matList = this.checkMaterialFlattenList.filter((itemFind) => {
            if (edit_type === 1) {
              // 物料计划单按照尺码颜色匹配
              return (
                itemFind.process_id === item.process_id &&
                itemFind.product_id === itemChild.product_id &&
                itemFind.part_id === itemChild.part_id &&
                itemFind.color_id === itemChild.color_id &&
                itemFind.size_id === itemChild.size_id
              )
            } else {
              // 按照产品id匹配
              return (
                itemFind.process_id === item.process_id &&
                itemFind.product_id === itemChild.product_id &&
                itemFind.part_id === itemChild.part_id
              )
            }
          })
          item.material_info_data = item.material_info_data.concat(
            matList.map((itemMat) => {
              return {
                material_id: itemMat.material_id,
                material_name: itemMat.material_name,
                material_color: itemMat.material_color,
                number: this.$toFixed((itemMat.final_number / itemMat.number) * Number(itemChild.number))
              }
            })
          )
        })
      })
      this.productionPlanInfo.forEach((itemMerge) => {
        itemMerge.material_info_data = this.$mergeData(itemMerge.material_info_data, {
          mainRule: ['material_id', 'material_color'],
          otherRule: [{ name: 'number', type: 'add' }, { name: 'material_name' }]
        }).map((itemMat: any) => {
          return {
            material_id: itemMat.material_id,
            material_name: itemMat.material_name,
            material_color: itemMat.material_color,
            number: itemMat.number
          }
        })
      })
      this.materialPlanFlag = ifShow
    },
    getCmpData() {
      this.productionPlanInfo.forEach((item, index) => {
        item.plan_id = this.materialPlanIndex
        item.order_id = this.order_id
        item.total_price = this.totalPlanPriceList[index]
        item.total_number = this.totalPlanNumberList[index]
        item.product_info_data.forEach((itemChild) => {})
      })
    },
    saveProductionPlan() {
      // 获取物料信息
      this.getMaterialInfo()
      this.getCmpData()
      productionPlan
        .create({
          data: this.productionPlanInfo
        })
        .then((res) => {
          if (res.data.status) {
            this.$$message.success('添加成功')
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
        materialPlan
          .list({
            order_id: this.order_id
          })
          .then((res) => {
            if (res.data.status) {
              this.materialPlanList = res.data.data
              if (this.materialPlanList.length > 0) {
                this.materialPlanIndex = this.materialPlanList[0].id?.toString()
              } else {
                this.$message.warning('该订单还未创建物料计划单,请填写计划单信息')
                this.$router.push('/materialPlan/create?id=' + this.$route.query.id)
              }
              console.log(this.materialPlanList)
            }
          })
        productionPlan
          .list({
            order_id: this.order_id
          })
          .then((res) => {
            // console.log(res)
            if (res.data.status) {
              this.productionPlanList = res.data.data
              if (this.productionPlanList.length > 0) {
                this.productionPlanIndex = this.productionPlanList[0].id?.toString()
              }
            }
          })
      })
    this.$checkCommonInfo([
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/halfProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getHalfProcessAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/productionPlan/detail.less';
</style>
<style lang="less">
#productionPlanDetail {
  .el-tabs__content {
    padding: 0;
  }
}
</style>