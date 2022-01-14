<template>
  <div id="productionPlanDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
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
                <!-- <div class="btn backHoverBlue">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">加工计划</span>
                </div> -->
                <div class="btn backHoverOrange"
                  @click="getProductionPlan">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">内部派单</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module"
      v-if="productionPlanList.length>0">
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
                <div class="text">{{item.code}}</div>
              </div>
              <div class="col">
                <div class="label">加工单位：</div>
                <div class="text">{{item.client_name}}</div>
              </div>
              <div class="col">
                <div class="label">加工日期：</div>
                <div class="text">{{item.start_time}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">加工工序：</div>
                <div class="text">{{item.process_name}}</div>
              </div>
              <div class="col">
                <div class="label">交货日期：</div>
                <div class="text">{{item.end_time}}</div>
              </div>
              <div class="col"></div>
            </div>
          </div>
          <div class="tableCtn"
            style="padding-top:0">
            <div class="thead">
              <div class="trow">
                <div class="tcol">序号</div>
                <div class="tcol">产品信息</div>
                <div class="tcol">尺码颜色</div>
                <div class="tcol">加工数量</div>
                <div class="tcol">加工单价</div>
                <div class="tcol">加工总价</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemPro,indexPro) in item.product_info_data"
                :key="indexPro">
                <div class="tcol">{{indexPro+1}}</div>
                <div class="tcol">
                  <span>{{itemPro.product_code||itemPro.system_code}}</span>
                  <span>{{itemPro.category_name}}/{{itemPro.secondary_category_name}}</span>
                </div>
                <div class="tcol">{{itemPro.size_name?itemPro.size_name + '/' + itemPro.color_name:'未选择尺码颜色'}}</div>
                <div class="tcol">{{itemPro.number}}</div>
                <div class="tcol">{{itemPro.price}}元</div>
                <div class="tcol">{{itemPro.price*itemPro.number}}元</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            v-if="item.material_info_data.length>0">
            <div class="thead">
              <div class="trow">
                <div class="tcol">序号</div>
                <div class="tcol">物料名称</div>
                <div class="tcol">物料颜色</div>
                <div class="tcol">分配数量</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemMat,indexMat) in item.material_info_data"
                :key="indexMat">
                <div class="tcol">{{indexMat+1}}</div>
                <div class="tcol">{{itemMat.material_name}}</div>
                <div class="tcol">{{itemMat.material_color}}</div>
                <div class="tcol">{{itemMat.number}}{{itemMat.unit}}</div>
              </div>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">加工单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverBlue"
                  @click="$openUrl('/productionPlan/print?id='+item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">打印单据</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteProductionPlan(item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">删除单据</span>
                </div>
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
          <div class="closeCtn"
            @click="productionPlanFlag = false">
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
                    <el-cascader placeholder="请选择加工单位"
                      v-model="item.client_id_arr"
                      :options="processClientList"
                      @change="(ev)=>{item.client_id=ev[2]}"></el-cascader>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">加工工序</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader placeholder="选择工序"
                      :show-all-levels="false"
                      v-model="item.process_name_arr"
                      :options="processList"
                      @change="(ev)=>{item.process_type=ev[0];item.process_name=ev[1]}"
                      filterable
                      clearable>
                    </el-cascader>
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
                      v-model="itemPro.select_arr"
                      @change="getProInfo($event,itemPro)">
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
                          :disabled="materialPlanList.find((item) => Number(item.id) === Number(materialPlanIndex))&&materialPlanList.find((item) => Number(item.id) === Number(materialPlanIndex)).type===2"
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
            <!-- 物料计划单按照尺码颜色填才能分给多家单位 -->
            <div class="btn backHoverBlue"
              style="margin-bottom:16px"
              v-if="materialPlanList.find((item) => Number(item.id) === Number(materialPlanIndex))&&materialPlanList.find((item) => Number(item.id) === Number(materialPlanIndex)).type===1">添加加工单位</div>
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
                  <div class="tcol">
                    <span>{{item.client_name||'未选择单位'}}</span>
                    <span class="green">({{item.process_name}})</span>
                  </div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="gray trow"
                      v-if="item.material_info_data.length===0">
                      <div class="tcol">
                        <span class="gray">该工序未分配任何物料</span>
                      </div>
                    </div>
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
          <span class="btn borderBtn"
            @click="productionPlanFlag = false">取消</span>
          <span class="btn backHoverOrange"
            @click="materialPlanFlag?materialPlanFlag=false:getMaterialInfo(true)">{{materialPlanFlag?'查看排产信息':'查看物料分配'}}</span>
          <span class="btn backHoverBlue"
            @click="saveProductionPlan">确认</span>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlan, order, productionPlan } from '@/assets/js/api'
import { ProductionPlanInfo } from '@/types/productionPlan'
import { MaterialPlanInfo, MaterailPlanData } from '@/types/materialPlan'
import { CascaderInfo } from '@/types/vuex'
export default Vue.extend({
  data(): {
    materialPlanList: MaterialPlanInfo[]
    productionPlanInfo: ProductionPlanInfo[]
    productionPlanList: ProductionPlanInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      order_id: 0,
      orderIndex: '0',
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
      materialPlanList: [],
      materialPlanIndex: '0',
      productionPlanFlag: false,
      materialPlanFlag: false,
      productionPlanInfo: [
        {
          process_type: '',
          order_id: '',
          client_id: '',
          start_time: this.$getDate(new Date()),
          end_time: '',
          desc: '',
          total_price: '',
          total_number: '',
          process_id: '',
          process_name: '',
          process_name_arr: [],
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
              number: '',
              unit: ''
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
    processList() {
      return [
        {
          label: '织造工序',
          value: '织造工序',
          children: [
            { label: '针织织造', value: '针织织造' },
            { label: '梭织织造', value: '梭织织造' },
            { label: '制版费', value: '制版费' }
          ]
        },
        {
          label: '成品加工工序',
          value: '成品加工工序',
          children: this.$store.state.api.staffProcess.arr.map((item: any) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        },
        {
          label: '半成品加工工序',
          value: '半成品加工工序',
          children: this.$store.state.api.halfProcess.arr.map((item: any) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        }
      ]
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
    init() {
      this.loading = true
      Promise.all([
        materialPlan.list({
          order_id: this.order_id
        }),
        productionPlan.list({
          order_id: this.order_id
        })
      ]).then((res) => {
        this.loading = false
        this.materialPlanList = res[0].data.data
        if (this.materialPlanList.length > 0) {
          this.materialPlanIndex = this.materialPlanList[0].id?.toString()
        } else {
          this.$message.warning('该订单还未创建物料计划单,请填写计划单信息')
          this.$router.push('/materialPlan/create?id=' + this.$route.query.id)
        }
        this.productionPlanList = res[1].data.data
        if (this.productionPlanList.length > 0) {
          this.productionPlanIndex = this.productionPlanList[0].id?.toString()
        }
      })
    },
    getProInfo(ev: string, info: any) {
      const idArr = ev.split(',')
      info.product_id = Number(idArr[0])
      info.part_id = Number(idArr[1])
      info.size_id = Number(idArr[2])
      info.color_id = Number(idArr[3])
    },
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
        // 获取单位名称————展示用
        this.processClientList.forEach((item1) => {
          item1.children?.forEach((item2) => {
            item2.children?.forEach((item3) => {
              if (item3.value === item.client_id) {
                item.client_name = item3.label
              }
            })
          })
        })
        item.material_info_data = []
        item.product_info_data.forEach((itemChild) => {
          const matList = this.checkMaterialFlattenList.filter((itemFind) => {
            if (edit_type === 1) {
              // 物料计划单按照尺码颜色匹配
              return (
                itemFind.process_name === item.process_name &&
                itemFind.product_id === itemChild.product_id &&
                itemFind.part_id === itemChild.part_id &&
                itemFind.color_id === itemChild.color_id &&
                itemFind.size_id === itemChild.size_id
              )
            } else {
              // 按照产品id匹配
              return (
                itemFind.process_name === item.process_name &&
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
                number: this.$toFixed((itemMat.final_number / itemMat.number) * Number(itemChild.number)),
                unit: itemMat.unit
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
      const finded = this.materialPlanList.find((item) => Number(item.id) === Number(this.materialPlanIndex))
      const edit_type = finded!.type
      this.productionPlanInfo.forEach((item, index) => {
        item.plan_id = this.materialPlanIndex
        item.order_id = this.order_id
        item.total_price = this.totalPlanPriceList[index]
        item.total_number = this.totalPlanNumberList[index]
        // 按产品款式填的自动补充所有尺码配色
        if (edit_type === 2) {
          let colorSizeInfo: any[] = []
          item.product_info_data.forEach((itemPro) => {
            const findPlanPro = finded!.production_plan_data.find(
              (itemFind) => itemFind.product_id === itemPro.product_id
            )
            // 这一步单纯是为了展开函数不能有两个number，把后台给的无用number给去掉
            findPlanPro!.product_data.forEach((itemChild) => {
              delete itemChild.number
            })
            // 把计划单信息按照尺码配色全部展开
            const allColorSizeInfo = this.$flatten(this.$flatten(findPlanPro!.product_data))
            colorSizeInfo = colorSizeInfo.concat(
              allColorSizeInfo
                .filter((item) => item.part_id === itemPro.part_id)
                .map((itemReal) => {
                  return {
                    product_id: itemPro.product_id,
                    size_id: itemReal.size_id,
                    color_id: itemReal.color_id,
                    part_id: itemPro.part_id,
                    number: itemReal.number,
                    price: itemPro.price,
                    total_price: itemPro.total_price,
                    select_arr: itemPro.select_arr
                  }
                })
            )
          })
          item.product_info_data = colorSizeInfo
        }
      })
    },
    saveProductionPlan() {
      const formcheck = this.productionPlanInfo.some((item) => {
        return (
          this.$formCheck(item, [
            {
              key: 'client_id',
              errMsg: '请选择加工单位'
            },
            {
              key: 'process_name',
              errMsg: '请选择加工工序'
            },
            {
              key: 'start_time',
              errMsg: '请选择订购日期'
            },
            {
              key: 'end_time',
              errMsg: '请选择交货日期'
            }
          ]) ||
          item.product_info_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
              {
                key: 'select_arr',
                errMsg: '请选择产品信息'
              },
              {
                key: 'price',
                errMsg: '请输入加工单价'
              },
              {
                key: 'number',
                errMsg: '请输入加工数量'
              }
            ])
          })
        )
      })
      if (!formcheck) {
        // 获取物料信息
        this.getMaterialInfo()
        this.getCmpData()
        this.loading = true
        productionPlan
          .create({
            data: this.productionPlanInfo
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.productionPlanFlag = false
              this.loading = false
              this.init()
            }
          })
      }
    },
    deleteProductionPlan(id: number) {
      this.$confirm('是否删除该加工单据?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          productionPlan
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
    this.$checkCommonInfo([
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/staffProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStaffProcessAsync'
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