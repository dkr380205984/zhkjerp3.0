<template>
  <div id="materialPlanCreate"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :id="$route.query.order_id"></order-detail>
    <div class="module">
      <div class="titleCtn flexBetween">
        <div class="title">生产计划单</div>
      </div>
      <div class="tableCtn">
        <div class="description">
          <span>请输入产品各部位需要原料生产的数量，填写完成后点击
            <span class="blue">确认生产数量</span>
            按钮开始填写产品物料信息。
            <span class="red">注意：</span>
            未填写计划生产数量的部位，或者填写值为0的产品部位将不计入物料填写。
          </span>
        </div>
        <div class="thead">
          <div class="trow">
            <div class="tcol">产品品类</div>
            <div class="tcol noPad"
              style="flex:7">
              <div class="trow">
                <div class="tcol">尺码颜色</div>
                <div class="tcol">下单数量</div>
                <div class="tcol">总数量百分比</div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow">
                    <div class="tcol">产品部位</div>
                    <div class="tcol">计划生产数量</div>
                    <div class="tcol">操作</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="item in materialPlanInfo.production_plan_data"
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
                <div class="tcol">
                  <div class="elCtn">
                    <el-input placeholder="百分比"
                      v-model="itemChild.add_percent"
                      @input="getPlanNum($event,itemChild)">
                      <template slot="append">%</template>
                    </el-input>
                  </div>
                </div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow"
                    v-for="(itemPart,indexPart) in itemChild.info_data"
                    :key="indexPart">
                    <div class="tcol">
                      <div class="elCtn">
                        <el-select v-model="itemPart.part_id">
                          <el-option v-for="item in item.part_data"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="tcol">
                      <div class="elCtn">
                        <el-input v-model="itemPart.number"
                          placeholder="计划生产数量"
                          @change="getMaterialPlanDetail(itemPart.part_id,itemPart.number,itemChild)"></el-input>
                      </div>
                    </div>
                    <div class="tcol oprCtn">
                      <div class="gray"
                        v-if="item.part_data.length===1">无配件信息</div>
                      <div class="opr hoverBlue"
                        v-if="itemChild.info_data.length<item.part_data.length"
                        @click="$addItem(itemChild.info_data,{
                          unit: '',
                          name: '',
                          part_id: '', // 下拉框选id用
                          number: ''
                        })">添加</div>
                      <div class="opr hoverRed"
                        v-if="itemChild.info_data.length>1"
                        @click="$deleteItem(itemChild.info_data,indexPart)">删除</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">物料计划详情</div>
      </div>
      <template v-if="materialPlanInfo.type===1">
        <div class="flattenTableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">产品品类</div>
              <div class="tcol">尺码颜色</div>
              <div class="tcol">产品部位</div>
              <div class="tcol">下单数量</div>
              <div class="tcol">计划生产数量</div>
              <div class="tcol">操作</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trowCtn"
              v-for="(item,index) in materialPlanInfo.material_plan_data"
              :key="index">
              <div class="trow">
                <div class="tcol">
                  <span>{{item.product_code || item.system_code}}</span>
                  <span>{{item.category}}/{{item.secondary_category}}</span>
                </div>
                <div class="tcol">{{item.size_name}}/{{item.color_name}}</div>
                <div class="tcol">{{item.part_name}}</div>
                <div class="tcol">{{item.order_number}}</div>
                <div class="tcol">{{item.number}}</div>
                <div class="tcol oprCtn">
                  <span class="opr blue"
                    @click="$addItem(item.info_data,{
                        process_name_arr:[],
                        process_name: '',
                        tree_data: [],
                        material_id: '',
                        material_type: '',
                        material_color: '',
                        assist_material_number: '',
                        need_number: '',
                        production_number: '',
                        loss: '',
                        final_number: '',
                        unit: 'kg'
                    })">新增物料</span>
                  <div class="opr hoverRed"
                    @click="item.info_data=[]">不需要物料</div>
                </div>
              </div>
              <div class="childrenCtn"
                v-if="item.info_data.length>0">
                <div class="trow">
                  <div class="tcol">计划工序
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一工序"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        aria-hidden="true"
                        @click="copyInfo(item.info_data,['process_name_arr','process_name','process_type'])">
                        <use xlink:href='#icon-tongbushuju1'></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="tcol">原料名称
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一原料"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        aria-hidden="true"
                        @click="copyInfo(item.info_data,['tree_data','material_name','material_id'])">
                        <use xlink:href='#icon-tongbushuju1'></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="tcol">原料颜色
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一颜色"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        aria-hidden="true"
                        @click="copyInfo(item.info_data,['material_color'])">
                        <use xlink:href='#icon-tongbushuju1'></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="tcol">单个数量</div>
                  <div class="tcol">所需数量</div>
                  <div class="tcol">原料损耗
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一损耗"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        aria-hidden="true"
                        @click="copyInfo(item.info_data,['loss']);changeAllLoss(item.info_data)">
                        <use xlink:href='#icon-tongbushuju1'></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="tcol">最终数量
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一数量"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        aria-hidden="true"
                        @click="copyInfo(item.info_data,['final_number','unit'])">
                        <use xlink:href='#icon-tongbushuju1'></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="tcol">操作</div>
                </div>
                <div class="trow"
                  v-for="(itemChild,indexChild) in item.info_data"
                  :key="indexChild">
                  <div class="tcol">
                    <div class="elCtn">
                      <el-cascader placeholder="选择工序"
                        :show-all-levels="false"
                        v-model="itemChild.process_name_arr"
                        :options="processList"
                        @change="(ev)=>{itemChild.process_type=ev[0];itemChild.process_name=ev[1]}"
                        filterable
                        clearable>
                      </el-cascader>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn"
                      v-if="itemChild.tree_data">
                      <el-cascader placeholder="物料名称"
                        :show-all-levels="false"
                        v-model="itemChild.tree_data"
                        :options="yarnTypeList"
                        filterable
                        @change="getMatId($event,itemChild)"
                        clearable>
                      </el-cascader>
                    </div>
                    <span class="text"
                      v-else>{{itemChild.material_name}}</span>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-autocomplete class="inline-input"
                        v-model="itemChild.material_color"
                        :fetch-suggestions="searchColor"
                        placeholder="物料颜色"></el-autocomplete>
                    </div>
                  </div>
                  <div class="tcol"
                    :class="itemChild.production_number?'blue':'gray'">
                    <div class="elCtn">
                      <el-input v-model="itemChild.production_number"
                        placeholder="无计划值"
                        @input="(ev)=>{
                        itemChild.need_number=numberAutoMethod(Number(ev)*item.number/(itemChild.unit==='g'||itemChild.unit==='kg'?1000:1));
                        itemChild.final_number=numberAutoMethod((Number(itemChild.loss)/100+1)*itemChild.need_number)}">
                        <template slot="append">
                          {{itemChild.unit==='kg'?'g':itemChild.unit}}
                        </template>
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    {{itemChild.need_number}}{{itemChild.unit}}
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input v-model="itemChild.loss"
                        placeholder="损耗"
                        @input="(ev)=>itemChild.final_number=numberAutoMethod((Number(ev)/100+1)*itemChild.need_number)">
                        <template slot="append">%</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn UnitCtn">
                      <el-input v-model="itemChild.final_number"
                        placeholder="数量">
                        <template slot="append">
                          <el-input v-model="itemChild.unit"
                            placeholder="单位"></el-input>
                        </template>
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="oprCtn">
                      <span class="opr blue"
                        @click="$addItem(item.info_data,{
                          process_name_arr:[],
                          process_name: '',
                          tree_data: [],
                          material_id: '',
                          material_type: '',
                          material_color: '',
                          assist_material_number: '',
                          need_number: '',
                          production_number: '',
                          loss: '',
                          final_number: '',
                          unit: 'kg'
                        })">添加</span>
                      <span class="opr orange"
                        @click="$addItem(item.info_data,{
                          process_name_arr:itemChild.process_name_arr,
                          process_name: itemChild.process_name,
                          tree_data: itemChild.tree_data,
                          material_id: itemChild.material_id,
                          material_type: itemChild.material_type,
                          material_color: itemChild.material_color,
                          assist_material_number: itemChild.assist_material_number,
                          need_number: itemChild.need_number,
                          production_number: itemChild.production_number,
                          loss: itemChild.loss,
                          final_number: itemChild.final_number,
                          unit: itemChild.unit
                        })">复制</span>
                      <span class="opr red"
                        @click="item.info_data.length>1?$deleteItem(item.info_data,indexChild):$message.error('至少有一项，可以不填')">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="childrenCtn"
                v-else>
                <div class="trow">
                  <div class="tcol gray"
                    style="text-align: center;">确认不需要物料</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flattenTableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">产品品类</div>
              <div class="tcol">产品部位</div>
              <div class="tcol">下单数量</div>
              <div class="tcol">计划生产数量</div>
              <div class="tcol">操作</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trowCtn"
              v-for="(item,index) in materialPlanInfo.material_plan_data"
              :key="index">
              <div class="trow">
                <div class="tcol">
                  <span>{{item.product_code || item.system_code}}</span>
                  <span>{{item.category}}/{{item.secondary_category}}</span>
                </div>
                <div class="tcol">{{item.part_name}}</div>
                <div class="tcol">{{item.order_number}}</div>
                <div class="tcol">{{item.number}}</div>
                <div class="tcol oprCtn">
                  <span class="opr blue"
                    @click="$addItem(item.info_data,{
                        process_name_arr:[],
                        process_name: '',
                        tree_data: [],
                        material_id: '',
                        material_type: '',
                        material_color: '',
                        assist_material_number: '',
                        need_number: '',
                        production_number: '',
                        loss: '',
                        final_number: '',
                        unit: 'kg'
                    })">新增物料</span>
                  <div class="opr hoverRed"
                    @click="item.info_data=[]">不需要物料</div>
                </div>
              </div>
              <div class="childrenCtn"
                v-if="item.info_data.length>0">
                <div class="trow">
                  <div class="tcol">计划工序</div>
                  <div class="tcol">原料名称</div>
                  <div class="tcol">原料颜色</div>
                  <div class="tcol">单个数量</div>
                  <div class="tcol">所需数量</div>
                  <div class="tcol">原料损耗</div>
                  <div class="tcol">最终数量</div>
                  <div class="tcol">操作</div>
                </div>
                <div class="trow"
                  v-for="(itemChild,indexChild) in item.info_data"
                  :key="indexChild">
                  <div class="tcol">
                    <div class="elCtn">
                      <el-cascader placeholder="选择工序"
                        :show-all-levels="false"
                        v-model="itemChild.process_name_arr"
                        :options="processList"
                        @change="(ev)=>{itemChild.process_type=ev[0];itemChild.process_name=ev[1]}"
                        filterable
                        clearable>
                      </el-cascader>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn"
                      v-if="!itemChild.has_plan">
                      <el-cascader placeholder="物料名称"
                        :show-all-levels="false"
                        v-model="itemChild.tree_data"
                        :options="yarnTypeList"
                        @change="getMatId($event,itemChild)"
                        clearable>
                      </el-cascader>
                    </div>
                    <span class="text"
                      v-else>{{itemChild.material_name}}</span>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-autocomplete class="inline-input"
                        v-model="itemChild.material_color"
                        :fetch-suggestions="searchColor"
                        placeholder="物料颜色"></el-autocomplete>
                    </div>
                  </div>
                  <div class="tcol"
                    :class="itemChild.production_number?'blue':'gray'">
                    <el-input v-model="itemChild.production_number"
                      placeholder="无计划值"
                      @input="(ev)=>{
                        itemChild.need_number=numberAutoMethod(Number(ev)*item.number/(itemChild.unit==='g'||itemChild.unit==='kg'?1000:1));
                        itemChild.final_number=numberAutoMethod((Number(itemChild.loss)/100+1)*itemChild.need_number)}">
                      <template slot="append">
                        {{itemChild.unit==='kg'?'g':itemChild.unit}}
                      </template>
                    </el-input>
                  </div>
                  <div class="tcol">{{itemChild.need_number}}{{itemChild.unit}}</div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input v-model="itemChild.loss"
                        placeholder="损耗"
                        @input="(ev)=>itemChild.final_number=numberAutoMethod((Number(ev)/100+1)*itemChild.need_number)">
                        <template slot="append">%</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input class="UnitCtn"
                        v-model="itemChild.final_number"
                        placeholder="数量">
                        <template slot="append">
                          <el-input v-model="itemChild.unit"
                            placeholder="单位"></el-input>
                        </template>
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="oprCtn">
                      <span class="opr blue"
                        @click="$addItem(item.info_data,{
                          process_name: '',
                          tree_data: [],
                          material_id: '',
                          material_type: '',
                          material_color: '',
                          assist_material_number: '',
                          need_number: '',
                          production_number: '',
                          loss: '',
                          final_number: '',
                          unit: 'kg'
                        })">添加</span>
                      <span class="opr red"
                        @click="item.info_data.length>1?$deleteItem(item.info_data,indexChild):$message.error('至少有一项，可以不填')">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="childrenCtn"
                v-else>
                <div class="trow">
                  <div class="tcol gray"
                    style="text-align: center;">确认不需要物料</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">所需原料预览</div>
      </div>
      <div class="tableCtn">
        <div class="description">
          <span>表格信息由物料计划自动生成，请填写物料计划。</span>
        </div>
        <div class="thead"
          v-if="materialPlanInfo.material_plan_gather_data.length>0">
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
            v-for="(item,index) in materialPlanInfo.material_plan_gather_data"
            :key="index">
            <div class="tcol">{{index+1}}</div>
            <div class="tcol">{{item.material_name}}</div>
            <div class="tcol">{{item.material_color}}</div>
            <div class="tcol">{{item.need_number}}kg</div>
            <div class="tcol">
              <div class="elCtn">
                <el-input v-model="item.loss"
                  placeholder="原料损耗"
                  @input="getMaterialFinalNum($event,item)">
                  <template slot="append">%</template>
                </el-input>
              </div>
            </div>
            <div class="tcol">
              <div class="elCtn">
                <el-input v-model="item.final_number"
                  placeholder="最终数量">
                  <template slot="append">{{item.unit==='g'?'kg':item.unit}}</template>
                </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">备注信息</div>
            <div class="info elCtn">
              <el-input placeholder="请输入备注信息"
                v-model="materialPlanInfo.desc"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverBlue"
            @click="saveMaterialPlan">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlan } from '@/assets/js/api'
import { MaterialPlanInfo, MaterailPlanData } from '@/types/materialPlan'
import { CascaderInfo } from '@/types/vuex'
export default Vue.extend({
  data(): {
    materialPlanInfo: MaterialPlanInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      testValue: '',
      confirmFlag: 1,
      settingMethod: 2, // 数字取整方式
      orderIndex: 0, // 多张订单/样单
      materialPlanInfo: {
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
      }
    }
  },
  computed: {
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
    yarnTypeList(): CascaderInfo[] {
      return this.$store.state.api.yarnType.arr
    },
    yarnColorList() {
      return this.$store.state.api.yarnColor.arr.map((item: { name: any }) => {
        return {
          value: item.name,
          label: item.name
        }
      })
    }
  },
  watch: {
    // 监听物料计划表的变化，来计算所需物料概览
    'materialPlanInfo.material_plan_data': {
      handler: function (materailPlanData: MaterailPlanData[]) {
        this.materialPlanInfo.material_plan_gather_data = []
        const flattenYarnList: CascaderInfo[] = []
        this.yarnTypeList.forEach((item) => {
          item.children!.forEach((itemChild) => {
            itemChild.children!.forEach((itemSon) => {
              flattenYarnList.push(itemSon)
            })
          })
        })
        materailPlanData.forEach((item) => {
          item.info_data.forEach((itemChild) => {
            if (itemChild.material_id || itemChild.tree_data!.length > 0) {
              const finded = this.materialPlanInfo.material_plan_gather_data.find(
                (item) =>
                  item.material_id === (itemChild.material_id || itemChild.tree_data![2]) &&
                  item.material_color === itemChild.material_color
              )
              if (finded) {
                finded.need_number = Number(itemChild.need_number) + Number(finded.need_number)
                finded.final_number = Number(itemChild.final_number) + Number(finded.final_number)
                this.numberAutoMethod(100 * (Number(finded.final_number) / Number(finded.need_number) - 1))
              } else {
                this.materialPlanInfo.material_plan_gather_data.push({
                  material_name: itemChild.tree_data
                    ? this.$findId(flattenYarnList, itemChild.tree_data![2], 'label', 'value')
                    : itemChild.material_name,
                  material_id: itemChild.material_id || itemChild.tree_data![2],
                  material_type: 1, // 目前只有原料
                  material_color: itemChild.material_color,
                  need_number: Number(itemChild.need_number),
                  loss: itemChild.need_number
                    ? this.numberAutoMethod(100 * (Number(itemChild.final_number) / Number(itemChild.need_number) - 1))
                    : 0,
                  final_number: Number(itemChild.final_number),
                  unit: itemChild.unit
                })
              }
            }
          })
        })
      },
      deep: true
    }
  },
  methods: {
    // 原料颜色搜索
    searchColor(str: string, cb: any) {
      let results = str ? this.yarnColorList.filter(this.createFilter(str)) : this.yarnColorList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    // 统一输入行逻辑
    copyInfo(info: any, keyArr: string[]) {
      info.forEach((item: any, index: number) => {
        if (index !== 0) {
          keyArr.forEach((key) => {
            item[key] = info[0][key]
          })
        }
      })
      this.justWatch = !this.justWatch
    },
    // 统一损耗逻辑
    changeAllLoss(info: any) {
      info.forEach((itemChild: any) => {
        itemChild.final_number = this.numberAutoMethod((Number(itemChild.loss) / 100 + 1) * itemChild.need_number)
      })
    },
    // 小数点处理方式
    numberAutoMethod(num: number | string) {
      const number = Number(num)
      if (number || number === 0) {
        if (+this.settingMethod === 1) {
          // 向上取整
          return Math.ceil(number)
        } else if (+this.settingMethod === 2) {
          // 四舍五入
          return Math.round(number)
        } else if (+this.settingMethod === 3) {
          // @ts-ignore 向下取整
          return parseInt(number)
        } else {
          return this.$toFixed(number)
        }
      } else if (isNaN(num as number)) {
        return ''
      } else {
        throw new TypeError('“' + num + '”is not a number')
      }
    },
    // 计划生产数量 = 下单数量*(数量百分比+1)
    getPlanNum(rate: number, productInfo: any) {
      productInfo.info_data.forEach((item: any) => {
        // 只能确定大身数量，配件数量不计算
        if (item.part_id === 0) {
          item.number = this.numberAutoMethod(productInfo.order_number * (rate / 100 + 1))
          this.getMaterialPlanDetail(0, item.number, productInfo)
        }
      })
    },
    // 数量百分比 = 计划生产数量/下单数量 - 1
    // 物料最终数量 = 物料计划数量*(原料损耗百分比+1)
    getMaterialFinalNum(rate: number, materail: any) {
      materail.final_number = this.numberAutoMethod(materail.need_number * (rate / 100 + 1))
    },
    // 计算所需物料--按尺码颜色
    getMaterialPlanDetail(partId?: number, number?: number, proInfo?: any) {
      if (partId || partId === 0) {
        const finded = this.materialPlanInfo.material_plan_data.find(
          (itemFind) =>
            itemFind.part_id === partId &&
            itemFind.color_id === proInfo.color_id &&
            itemFind.size_id === proInfo.size_id
        )
        if (finded) {
          finded.number = number
        } else {
        }
      }
    },
    getMatId(ev: number[], info: any) {
      info.material_id = ev![2]
      if (this.yarnTypeList.find((item) => item.value === ev[0])?.label === '面料') {
        info.unit = 'm'
      } else {
        info.unit = 'kg'
      }
    },
    getCmpData() {
      this.materialPlanInfo.material_plan_data.forEach((item) => {
        item.info_data.forEach((itemChild) => {
          // @ts-ignore
          itemChild.tree_data = itemChild.tree_data ? itemChild.tree_data.join(',') : itemChild.tree_data
        })
      })
    },
    saveMaterialPlan() {
      const formCheck =
        // this.materialPlanInfo.production_plan_data.some((item) => {
        //   return item.product_data.some((itemChild) => {
        //     return itemChild.info_data.some((itemPart) => {
        //       return this.$formCheck(itemPart, [
        //         {
        //           key: 'number',
        //           errMsg: '请输入计划生产数量'
        //         }
        //       ])
        //     })
        //   })
        // }) ||
        this.materialPlanInfo.material_plan_data.some((item) => {
          return item.info_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
              {
                key: 'process_name',
                errMsg: '检测到有未选择工序信息，请补充'
              },
              {
                key: 'material_id',
                errMsg: '检测到有未选择的物料名称，请补充'
              },
              {
                key: 'material_color',
                errMsg: '检测到有未选择的物料颜色，请补充'
              },
              {
                key: 'final_number',
                errMsg: '检测到有未填写的物料最终数量，请补充'
              },
              {
                key: 'unit',
                errMsg: '物料的单位只能为kg或m',
                regExp: /^m$|^kg$/,
                regNegate: true
              }
            ])
          })
        })
      if (!formCheck) {
        this.loading = true
        this.getCmpData()
        materialPlan.create(this.materialPlanInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
            this.$router.push('/materialPlan/detail?id=' + this.$route.query.order_id)
          }
          this.loading = false
        })
      }
    },
    getUpdateData() {
      this.materialPlanInfo.material_plan_data.forEach((item) => {
        item.info_data.forEach((itemChild) => {
          // @ts-ignore
          itemChild.tree_data = itemChild.tree_data && itemChild.tree_data.split(',').map((item) => Number(item))
          itemChild.process_name_arr = [
            // @ts-ignore
            this.processList.find((item) => {
              return item.children.find((itemFind: any) => {
                return itemFind.value === itemChild.process_name
              })
            }).value,
            // @ts-ignore
            itemChild.process_name
          ]
        })
      })
      this.materialPlanInfo.production_plan_data.forEach((item) => {
        item.part_data = [
          {
            name: '大身',
            id: 0, // 大身给零，接口写的
            unit: '件'
          }
        ].concat(
          // @ts-ignore
          item.product_detail!.part_data
        )
      })
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      },
      {
        checkWhich: 'api/halfProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getHalfProcessAsync'
      },
      {
        checkWhich: 'api/staffProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStaffProcessAsync'
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      },
      {
        checkWhich: 'api/yarnColor',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnColorAsync'
      }
    ])
    materialPlan
      .detail({
        id: this.$route.query.id
      })
      .then((res) => {
        this.materialPlanInfo = res.data.data
        // this.materialPlanInfo.type = this.materialPlanInfo.type.toString()
        this.getUpdateData()
        this.loading = false
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialPlan/create.less';
</style>
<style lang="less">
#materialPlanCreate {
  .el-tabs__content {
    padding: 20px 32px;
  }
  .UnitCtn {
    .el-input-group__append {
      padding: 0;
      .el-input {
        width: 45px;
        .el-input__inner {
          padding: 0 8px;
          border: 0;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
}
</style>