<template>
  <div id="materialPlanOrderDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn flexBetween">
        <div class="title">原料预订购详情</div>
        <div class="btn backHoverBlue"
          @click="materialPlanOrderFlag=true">添加物料订购</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">订购公司：</div>
            <div class="text">{{materialPlanOrderDetail.client_name}}</div>
          </div>
          <div class="col">
            <div class="label">订购年份：</div>
            <div class="text">{{materialPlanOrderDetail.year}}</div>
          </div>
          <div class="col">
            <div class="label">预订购数量：</div>
            <div class="text">{{materialPlanOrderDetail.total_number}}kg</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">订购日志</div>
      </div>
      <div class="listCtn">
        <div class="tableCtn noPad">
          <div class="thead">
            <div class="trow">
              <div class="tcol"
                style="flex:1.6">单据编号</div>
              <div class="tcol noPad"
                style="flex:6">
                <div class="trow">
                  <div class="tcol">纱线名称</div>
                  <div class="tcol">颜色</div>
                  <div class="tcol">属性</div>
                  <div class="tcol">订购数量</div>
                  <div class="tcol">订购单价</div>
                  <div class="tcol">入库数量</div>
                </div>
              </div>
              <div class="tcol">额外费用</div>
              <div class="tcol">日期</div>
              <div class="tcol">备注信息</div>
              <div class="tcol"
                style="min-width:144px">操作</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in materialOrderListShow"
              :key="item.id">
              <div class="tcol"
                style="flex:1.6">{{item.code}}</div>
              <div class="tcol noPad"
                style="flex:6">
                <div class="trow"
                  v-for="itemChild in item.info_data"
                  :key="itemChild.id">
                  <div class="tcol">{{itemChild.material_name}}</div>
                  <div class="tcol">{{itemChild.material_color}}</div>
                  <div class="tcol">{{itemChild.attribute}}</div>
                  <div class="tcol">{{itemChild.number}}{{itemChild.unit}}</div>
                  <div class="tcol">{{itemChild.price||0}}元</div>
                  <div class="tcol">{{itemChild.final_push_number || 0}}{{itemChild.unit}}</div>
                </div>
              </div>
              <div class="tcol">
                <others-fee-data :data="item.others_fee_data"></others-fee-data>
              </div>
              <div class="tcol">{{item.order_time}}</div>
              <div class="tcol">{{item.desc}}</div>
              <div class="tcol oprCtn"
                style="min-width:144px">
                <div class="opr hoverGreen"
                  @click="goOrder(item)">继续订购</div>
                <div class="opr hoverBlue"
                  @click="goStock([item])">入库</div>
                <div class="opr hoverRed"
                  @click="deleteMaterialOrder(item.id)">删除</div>
              </div>
            </div>
            <div class="trow noData"
              v-if="materialOrderList.length===0">暂无数据</div>
            <div class="trow">
              <div class="tcol green"
                style="flex:1.6">合计:</div>
              <div class="tcol noPad"
                style="flex:6">
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                  <div class="tcol green">{{$toFixed(materialOrderTotal.totalNum/1000)}}吨</div>
                  <div class="tcol green"></div>
                  <div class="tcol green">{{$toFixed(materialOrderTotal.totalPush/1000)}}吨</div>
                </div>
              </div>
              <div class="tcol"></div>
              <div class="tcol"></div>
              <div class="tcol"></div>
              <div class="tcol"
                style="min-width:144px"></div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="orderTotal"
            :current-page.sync="orderPage">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">入库日志</div>
      </div>
      <div class="listCtn">
        <div class="tableCtn noPad">
          <div class="thead">
            <div class="trow">
              <div class="tcol">单据编号</div>
              <div class="tcol">入库仓库</div>
              <div class="tcol"
                style="flex:6">
                <div class="trow">
                  <div class="tcol">原料名称</div>
                  <div class="tcol">入库颜色</div>
                  <div class="tcol">入库属性</div>
                  <div class="tcol">批号/缸号/色号</div>
                  <div class="tcol">入库数量</div>
                  <div class="tcol">件数</div>
                  <div class="tcol">入库单价</div>
                </div>
              </div>
              <div class="tcol">创建人</div>
              <div class="tcol">入库日期</div>
              <div class="tcol">操作</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in materialStockListShow"
              :key="index">
              <div class="tcol">{{item.code}}</div>
              <div class="tcol">{{item.store}}/{{item.secondary_store}}</div>
              <div class="tcol"
                style="flex:6">
                <div class="trow"
                  v-for="(itemChild,indexChild) in item.info_data"
                  :key="indexChild">
                  <div class="tcol">{{itemChild.material_name}}</div>
                  <div class="tcol">{{itemChild.material_color}}</div>
                  <div class="tcol">{{itemChild.attribute}}</div>
                  <div class="tcol">{{itemChild.batch_code}}/{{itemChild.vat_code}}/{{itemChild.color_code}}</div>
                  <div class="tcol">{{itemChild.number}}{{itemChild.unit}}</div>
                  <div class="tcol">{{itemChild.item||0}}件</div>
                  <div class="tcol">{{itemChild.price||0}}元</div>
                </div>
              </div>
              <div class="tcol">{{item.user_name}}</div>
              <div class="tcol">{{item.created_at}}</div>
              <div class="tcol oprCtn">
                <div class="opr hoverRed"
                  @click="deleteMaterialStock(item.id)">删除</div>
                <span class="opr hoverBlue"
                  @click="$openUrl('/store/materialLogPrint?id='+item.id + '&type=' + item.action_type)">打印</span>
              </div>
            </div>
            <div class="trow noData"
              v-if="materialStockList.length===0">暂无数据</div>
            <div class="trow">
              <div class="tcol green">合计:</div>
              <div class="tcol"></div>
              <div class="tcol"
                style="flex:6">
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                  <div class="tcol green">{{$toFixed(materialStockTotal.totalNum/1000)}}吨</div>
                  <div class="tcol"></div>
                  <div class="tcol green">{{$toFixed(materialStockTotal.totalPrice/10000)}}万元</div>
                </div>
              </div>
              <div class="tcol"></div>
              <div class="tcol"></div>
              <div class="tcol"></div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="storeTotal"
            :current-page.sync="storePage">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">入库统计</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-date-picker @change="getMatSts"
              v-model="date"
              value-format="yyyy-MM"
              type="month"
              placeholder="选择月份">
            </el-date-picker>
          </div>
        </div>
        <div class="tableCtn noPad">
          <div class="thead">
            <div class="trow">
              <div class="tcol">物料名称</div>
              <div class="tcol">物料颜色</div>
              <div class="tcol">物料属性</div>
              <div class="tcol">入库数量</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in materialStsList"
              :key="item.id">
              <div class="tcol">{{item.material_name}}</div>
              <div class="tcol">{{item.material_color}}</div>
              <div class="tcol">{{item.attribute}}</div>
              <div class="tcol">{{item.number}}{{item.unit||'kg'}}</div>
            </div>
            <div class="trow noData"
              v-if="materialStsList.length===0">暂无数据</div>
            <div class="trow">
              <div class="tcol green">合计:</div>
              <div class="tcol"></div>
              <div class="tcol"></div>
              <div class="tcol green">{{$toFixed(materialStsTotal/1000)}}吨</div>
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
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="materialPlanOrderFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">{{step===1?'订购':'入库'}}物料</span>
          <div class="closeCtn"
            @click="closeAll">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <template v-if="step===1">
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">订购单位</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="materialPlanOrderInfo.client_name"
                      disabled></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">订购时间</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-date-picker style="width:100%"
                      placeholder="请选择时间"
                      type="date"
                      value-format="yyyy-MM-dd"
                      v-model="materialPlanOrderInfo.order_time"></el-date-picker>
                  </div>
                </div>
                <div class="col">
                  <!-- 占位 -->
                </div>
              </div>
              <div class="row"
                v-for="(itemMat,indexMat) in materialPlanOrderInfo.info_data"
                :key="'mat' + indexMat">
                <div class="col">
                  <div class="label"
                    v-if="indexMat===0">
                    <span class="text">物料名称</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader v-if="!itemMat.id"
                      filterable
                      placeholder="物料名称"
                      :show-all-levels="false"
                      v-model="itemMat.tree_data"
                      :options="yarnTypeList"
                      @change="(ev)=>{itemMat.material_id=ev[2]}"
                      clearable>
                    </el-cascader>
                    <el-input v-else
                      placeholder="物料名称"
                      disabled
                      v-model="itemMat.material_name"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label spaceBetween"
                    v-if="indexMat===0">
                    <div class="once">
                      <span class="text">订购属性</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="once">
                      <span class="text">订购颜色</span>
                      <span class="explanation">(必选)</span>
                    </div>
                  </div>
                  <div class="info elCtn spaceBetween">
                    <el-select class="once"
                      placeholder="属性"
                      v-model="itemMat.attribute"
                      v-if="materialPlanOrderDetail.material_type===1">
                      <el-option v-for="item in yarnAttributeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                    <el-autocomplete class="once"
                      v-model="itemMat.material_color"
                      :fetch-suggestions="searchColor"
                      placeholder="物料颜色"></el-autocomplete>
                  </div>
                </div>
                <div class="col">
                  <div class="label spaceBetween"
                    v-if="indexMat===0">
                    <div class="once">
                      <span class="text">订购单价</span>
                    </div>
                    <div class="once">
                      <span class="text">订购数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                  </div>
                  <div class="info elCtn spaceBetween">
                    <el-input class="once"
                      placeholder="单价"
                      v-model="itemMat.price">
                      <template slot="append">元</template>
                    </el-input>
                    <el-input class="once UnitCtn"
                      placeholder="数量"
                      v-model="itemMat.number">
                      <template slot="append">
                        <el-input v-model="itemMat.unit"
                          placeholder="单位"></el-input>
                      </template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexMat===0"
                  @click="$addItem(materialPlanOrderInfo.info_data,{
                    material_id: '',
                    material_name: '',
                    material_color_id: itemMat.material_color_id===0?0:'',
                    attribute: '',
                    price: '',
                    number: '',
                    unit: 'kg'
                  })">添加</div>
                <div class="opr hoverRed"
                  v-if="indexMat>0"
                  @click="$deleteItem(materialPlanOrderInfo.info_data,indexMat)">删除</div>
              </div>
              <div class="row"
                v-for="(itemOther,indexOther) in materialPlanOrderInfo.others_fee_data"
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
                  @click="$addItem(materialPlanOrderInfo.others_fee_data,{
                  desc: '',
                  name: '',
                  price: ''
                })">添加</div>
                <div class="opr hoverRed"
                  v-if="indexOther>0"
                  @click="$deleteItem(materialPlanOrderInfo.others_fee_data,indexOther)">删除</div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">订购备注信息</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入订购备注信息"
                      v-model="materialPlanOrderInfo.desc"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">订购总价</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="自动计算"
                      v-model="totalOrderPrice"
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
                    <el-input placeholder="自动计算"
                      v-model="totalOrderNumber"
                      disabled>
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="step===2">
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">入库仓库</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader v-model="materialStockInfo.tree_data"
                      :options="storeList"
                      placeholder="请选择仓库"
                      @change="(ev)=>{materialStockInfo.store_id=ev[0];materialStockInfo.secondary_store_id=ev[1]}"></el-cascader>
                  </div>
                </div>
                <div class="col">
                </div>
                <div class="col">
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in materialStockInfo.info_data"
                :key="index">
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">单据物料</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="单据物料"
                      v-model="item.rel_doc_info_id"
                      @change="getMatId($event,item)">
                      <el-option v-for="item in materialStockInfo.selectList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">批号</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="批号"
                          v-model="item.batch_code"></el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">缸号</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="缸号"
                          v-model="item.vat_code"></el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">色号</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="色号"
                          v-model="item.color_code"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">数量</span>
                        <span class="explanation">(必填)</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="数量"
                          class="UnitCtn"
                          v-model="item.number">
                          <template slot="append">
                            <el-input v-model="item.unit"
                              placeholder="单位"></el-input>
                          </template>
                        </el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">件数</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="数量"
                          v-model="item.item">
                          <template slot="append">件</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="index===0"
                  @click="$addItem(materialStockInfo.info_data,{
                  material_id: '',
                  material_color: '',
                  color_code: '',
                  batch_code: '',
                  vat_code: '',
                  attribute: '',
                  number: '',
                  item: '', // 件数
                  rel_doc_info_id: '' // 采购单调取单加工单子项id
                })">添加</div>
                <div class="opr hoverRed"
                  v-if="index>0"
                  @click="$deleteItem(materialStockInfo.info_data,index)">删除</div>
              </div>
              <div class="row">
                <div class="col"
                  style="max-width:322px">
                  <div class="label">
                    <span class="text">入库日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-date-picker style="width:100%"
                      class="once"
                      placeholder="入库日期"
                      value-format="yyyy-MM-dd"
                      v-model="materialStockInfo.complete_time"></el-date-picker>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">备注信息</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="materialStockInfo.desc"
                      placeholder="备注信息"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeAll">取消</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialOrderPlan(false)"
            v-if="step===1">完成订购</span>
          <span class="btn backHoverGreen"
            @click="saveMaterialOrderPlan(true)"
            v-if="step===1">订购并入库</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialStock"
            v-if="step===2">确认入库</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlanOrder, materialOrder, materialStock, store } from '@/assets/js/api'
import { MaterialStockInfo, MaterialStockLog } from '@/types/materialStock'
import { MaterialOrderInfo } from '@/types/materialOrder'
import { MaterialPlanOrderClient } from '@/types/materialPlanOrder'
import { yarnAttributeArr } from '@/assets/js/dictionary'
import { CascaderInfo } from '@/types/vuex'
import othersFeeData from '@/components/othersFeeData/othersFeeData.vue'
export default Vue.extend({
  components: { othersFeeData },
  data(): {
    storeList: CascaderInfo[]
    materialPlanOrderDetail: MaterialPlanOrderClient
    materialPlanOrderInfo: MaterialOrderInfo
    materialStockInfo: MaterialStockInfo
    materialStockList: MaterialStockInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      stockLock: false,
      step: 1,
      yarnAttributeList: yarnAttributeArr,
      storeList: [],
      materialPlanOrderFlag: false,
      materialPlanOrderDetail: {
        year: '',
        material_type: '',
        client_id: '',
        tree_data: [],
        total_number: '',
        desc: ''
      },
      storePage: 1,
      storeTotal: 0,
      orderPage: 1,
      orderTotal: 1,
      materialOrderList: [],
      materialPlanOrderInfo: {
        material_type: 1,
        order_id: '',
        plan_id: '',
        reserve_id: '',
        client_name: '',
        client_id: '',
        client_id_arr: [],
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        total_number: 0,
        total_price: 0,
        others_fee_data: [
          {
            desc: '', // 额外费用备注
            name: '',
            price: ''
          }
        ],
        desc: '',
        info_data: [
          {
            material_id: '',
            material_name: '',
            material_color: '',
            attribute: '',
            price: '',
            number: '',
            unit: 'kg'
          }
        ]
      },
      materialStockInfo: {
        material_type: 1,
        action_type: 14, // 预订购采购单最终入库
        rel_doc_type: '',
        rel_doc_id: '',
        rel_doc_code: '',
        complete_time: this.$getDate(new Date()),
        client_id: '',
        desc: '',
        store_id: '',
        secondary_store_id: '',
        tree_data: [], //仓库下拉框
        selectList: [],
        info_data: [
          {
            material_id: '',
            material_color: '',
            color_code: '',
            batch_code: '',
            vat_code: '',
            attribute: '',
            number: '',
            item: '', // 件数
            rel_doc_info_id: '' // 采购单调取单加工单子项id
          }
        ]
      },
      materialStockList: [],
      materialStsList: [],
      date: '',
      materialOrderTotal: {
        totalNum: 0,
        totalPrice: 0,
        totalPush: 0
      },
      materialStockTotal: {
        totalNum: 0,
        totalPrice: 0
      },
      materialStsTotal: 0
    }
  },
  computed: {
    materialStockListShow(): any[] {
      return this.materialStockList.slice((this.storePage - 1) * 10, this.storePage * 10)
    },
    materialOrderListShow(): any[] {
      return this.materialOrderList.slice((this.orderPage - 1) * 10, this.orderPage * 10)
    },
    yarnTypeList(): CascaderInfo[] {
      return this.$store.state.api.yarnType.arr.filter(
        (item: any) => item.value === this.materialPlanOrderDetail.material_type
      )
    },
    totalOrderPrice(): number {
      return (
        this.materialPlanOrderInfo.info_data.reduce((total, current) => {
          return total + Number(current.number) * Number(current.price)
        }, 0) +
        this.materialPlanOrderInfo.others_fee_data.reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
      )
    },
    totalOrderNumber(): number {
      return this.materialPlanOrderInfo.info_data.reduce((total, current) => {
        return total + Number(current.number)
      }, 0)
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
  methods: {
    init() {
      this.loading = true
      Promise.all([
        materialOrder.list({
          reserve_id: Number(this.$route.query.id)
        }),
        materialStock.list({
          reserve_id: Number(this.$route.query.id)
        }),
        materialPlanOrder.stockSts({
          year: '',
          month: '',
          reserve_id: Number(this.$route.query.id)
        })
      ]).then((res) => {
        this.materialOrderList = res[0].data.data
        this.materialOrderTotal = res[0].data.data.reduce(
          (total: any, cur: any) => {
            return {
              totalNum:
                total.totalNum +
                cur.info_data.reduce((totalChild: any, curChild: any) => {
                  return totalChild + Number(curChild.number)
                }, 0),
              totalPrice:
                total.totalPrice +
                cur.info_data.reduce((totalChild: any, curChild: any) => {
                  return totalChild + (Number(curChild.price) || 0) * Number(curChild.number)
                }, 0),
              totalPush:
                total.totalPush +
                cur.info_data.reduce((totalChild: any, curChild: any) => {
                  return totalChild + Number(curChild.final_push_number)
                }, 0)
            }
          },
          {
            totalNum: 0,
            totalPrice: 0,
            totalPush: 0
          }
        )
        this.orderTotal = this.materialOrderList.length
        this.materialStockList = res[1].data.data
        this.materialStockTotal = res[1].data.data.reduce(
          (total: any, cur: any) => {
            return {
              totalNum:
                total.totalNum +
                cur.info_data.reduce((totalChild: any, curChild: any) => {
                  return totalChild + Number(curChild.number)
                }, 0),
              totalPrice:
                total.totalPrice +
                cur.info_data.reduce((totalChild: any, curChild: any) => {
                  return totalChild + (Number(curChild.price) || 0) * Number(curChild.number)
                }, 0)
            }
          },
          {
            totalNum: 0,
            totalPrice: 0
          }
        )
        this.storeTotal = this.materialStockList.length
        this.materialStsList = res[2].data.data
        this.materialStsTotal = res[2].data.data.reduce((total: any, cur: any) => {
          return total + Number(cur.number)
        }, 0)
        this.loading = false
      })
    },
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
    getMatSts() {
      console.log(new Date(this.date))
      materialPlanOrder
        .stockSts({
          year: this.date ? new Date(this.date).getFullYear() : '',
          month: this.date ? new Date(this.date).getMonth() + 1 : '',
          reserve_id: Number(this.$route.query.id)
        })
        .then((res) => {
          if (res.data.status) {
            this.materialStsList = res.data.data
          }
        })
    },
    saveMaterialOrderPlan(ifStock: boolean) {
      const formCheck = this.materialPlanOrderInfo.info_data.some((itemChild) => {
        return this.$formCheck(itemChild, [
          {
            key: 'material_id',
            errMsg: '请选择物料名称'
          },
          // {
          //   key: 'attribute',
          //   errMsg: '请选择物料属性'
          // },
          {
            key: 'material_color',
            errMsg: '请选择物料颜色'
          },
          {
            key: 'unit',
            errMsg: '物料的单位只能为kg或m',
            regExp: /^m$|^kg$/,
            regNegate: true
          },
          // {
          //   key: 'price',
          //   errMsg: '请输入订购单价'
          // },
          {
            key: 'number',
            errMsg: '请输入订购数量'
          }
        ])
      })
      if (!formCheck) {
        this.loading = true
        materialOrder.create({ data: [this.materialPlanOrderInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('物料订购成功')
            this.loading = false
            if (ifStock) {
              this.goStock(res.data.data)
            } else {
              this.step = 1
              this.resetAll()
              this.materialPlanOrderFlag = false
              this.init()
            }
          }
        })
      }
    },
    goStock(materialOrderList: MaterialOrderInfo[]) {
      // 其实只有一条订购信息，这个函数是订单物料出入库页面复制粘贴拿来的
      materialOrderList.forEach((item) => {
        this.materialStockInfo.rel_doc_code = item.code
        this.materialStockInfo.rel_doc_id = item.id as number
        item.info_data.forEach((itemChild) => {
          this.materialStockInfo.selectList!.push({
            value: itemChild.id as number,
            name: itemChild.material_name + '/' + itemChild.material_color + '/' + itemChild.attribute,
            material_color: itemChild.material_color,
            material_id: itemChild.material_id,
            attribute: itemChild.attribute,
            number: itemChild.number,
            unit: itemChild.unit || 'kg'
          })
        })
      })
      this.materialStockInfo.info_data = this.materialStockInfo.selectList!.map((item: any) => {
        return {
          material_id: item.material_id,
          material_color: item.material_color,
          color_code: '',
          batch_code: '',
          vat_code: '',
          attribute: item.attribute,
          number: item.number,
          item: '', // 件数
          unit: item.unit,
          rel_doc_info_id: item.value // 采购单调取单加工单子项id
        }
      })
      this.step = 2
      this.materialPlanOrderFlag = true
    },
    // 入库选采购单的时候给material_id赋值
    getMatId(id: number, info: MaterialStockLog) {
      const finded = this.materialStockInfo.selectList!.find((itemFind: any) => itemFind.value === id)
      info.material_id = finded!.material_id as number
      info.material_color = finded!.material_color as string
      info.attribute = finded!.attribute as string
    },
    saveMaterialStock() {
      if (this.stockLock) {
        return
      }
      const formCheck =
        this.$formCheck(this.materialStockInfo, [
          {
            key: 'tree_data',
            errMsg: '请选择入库仓库',
            regNormal: 'checkArr'
          }
        ]) ||
        this.materialStockInfo.info_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'rel_doc_info_id',
              errMsg: '请选择单据物料'
            },
            {
              key: 'material_id',
              errMsg: '请选择物料'
            }
          ])
        })
      if (!formCheck) {
        this.loading = true
        this.stockLock = true
        materialStock.create({ data: [this.materialStockInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.step = 1
            this.resetAll()
            this.materialPlanOrderFlag = false
            this.init()
          }
          this.stockLock = false
        })
      }
    },
    resetAll() {
      this.materialPlanOrderInfo.info_data = [
        {
          material_id: '',
          material_name: '',
          material_color: '',
          attribute: '',
          price: '',
          number: '',
          unit: 'kg'
        }
      ]
      this.materialStockInfo.selectList = []
      this.materialStockInfo.info_data = [
        {
          material_id: '',
          material_color: '',
          color_code: '',
          batch_code: '',
          vat_code: '',
          attribute: '',
          number: '',
          item: '', // 件数
          unit: 'kg',
          rel_doc_info_id: '' // 采购单调取单加工单子项id
        }
      ]
    },
    closeAll() {
      this.$confirm('是否关闭窗口?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.resetAll()
          this.materialPlanOrderFlag = false
          this.step = 1
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleteMaterialOrder(id: number) {
      this.$confirm('是否删除该订购单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialOrder.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
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
    },
    deleteMaterialStock(id: number) {
      this.$confirm('是否删除该调取单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialStock.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
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
    },
    goOrder(info: MaterialOrderInfo) {
      this.materialPlanOrderInfo.material_type = info.material_type
      this.materialPlanOrderInfo.info_data = info.info_data
      info.info_data.forEach((item: any) => {
        item.id = null
      })
      this.materialPlanOrderFlag = true
    }
  },
  mounted() {
    // this.date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
    materialPlanOrder
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.materialPlanOrderDetail = res.data.data
          this.materialPlanOrderInfo.client_id = this.materialPlanOrderDetail.client_id
          this.materialPlanOrderInfo.client_name = this.materialPlanOrderDetail.client_name
          this.materialPlanOrderInfo.reserve_id = Number(this.$route.query.id)
          this.materialStockInfo.client_id = this.materialPlanOrderDetail.client_id
        }
        this.loading = false
      })
      .then(() => {
        store.list().then((res) => {
          if (res.data.status) {
            this.storeList = res.data.data
              .filter((item: any) => item.store_type === this.materialPlanOrderDetail.material_type)
              .map((item: any) => {
                return {
                  label: item.name,
                  value: item.id,
                  children: item.secondary_store.map((itemChild: any) => {
                    return {
                      label: itemChild.name,
                      value: itemChild.id
                    }
                  })
                }
              })
          }
        })
      })
    this.init()
    this.$checkCommonInfo([
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
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialPlanOrder/detail.less';
</style>
<style lang="less">
#materialPlanOrderDetail {
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