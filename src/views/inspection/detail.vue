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
                    @change="(ev)=>{itemChild.product_info_data.forEach((itemPro)=>itemPro.check=ev);$forceUpdate();checkList()}">{{itemChild.code}}</el-checkbox>
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
                        @change="$forceUpdate();checkList()"
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
                    <div class="tcol">{{itemPro.real_number || 0}}</div>
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
            <div class="btn backHoverBlue"
              :class="{'backGray':checkListLength===0}"
              @click="goInspection(1)"
              style="margin-right:12px">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">检验入库</span>
            </div>
            <div class="btn backHoverOrange"
              :class="{'backGray':checkListLength===0}"
              @click="goInspection(2)">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">生产出库</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">收发检验日志</div>
      </div>
      <div class="listCtn"
        v-if="inspectionList.filter((item)=>item.type===1).length>0">
        <div class="list"
          style="min-height: 0px;">
          <div class="row title">
            <div class="col">单据类型</div>
            <div class="col">单据编号</div>
            <div class="col">检验单位</div>
            <div class="col">产品信息</div>
            <div class="col">尺码颜色</div>
            <div class="col">检验数量</div>
            <div class="col">半次(B品)/全次数</div>
            <div class="col">扣款金额</div>
            <div class="col">次品原因</div>
            <div class="col">操作时间</div>
            <div class="col">创建人</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row fontSmall"
            v-for="item in inspectionList.filter((item)=>item.type===1)"
            :key="item.id">
            <div class="col"
              :class="{'blue':item.type===1,'orange':item.type===2,'green':item.type===3}">{{item.type===1?'检验入库':item.type===2?'生产出库':'成品入库'}}</div>
            <div class="col">{{item.doc_code}}</div>
            <div class="col">{{item.client_name}}</div>
            <div class="col">{{item.product_code}}/{{item.part_name}}
            </div>
            <div class="col">{{item.color}}/{{item.size}}</div>
            <div class="col"
              :class="{'blue':item.type===1,'orange':item.type===2}">{{item.number}}</div>
            <div class="col">
              <span :class="{'gray':!item.part_shoddy_number,'orange':item.part_shoddy_number}">{{item.part_shoddy_number||'0'}}</span>/
              <span :class="{'gray':!item.shoddy_number,'red':item.shoddy_number}">{{item.shoddy_number||'0'}}</span>
            </div>
            <div class="col"
              :class="{'red':item.deduct_price}">{{item.deduct_price||0}}元</div>
            <div class="col"
              :class="{'gray':!item.shoddy_reason}">{{item.shoddy_reason||'无'}}</div>
            <div class="col">{{item.complete_time}}</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col"
              :class="item.is_check|filterCheckClass">
              <span>{{item.is_check|filterCheck}}
                <el-tooltip v-if="item.is_check===4"
                  class="item"
                  effect="dark"
                  content="由于【检验入库数量】超过了【分配数量】的10%。该检验入库单已变为异常状态。以下为异常单据处理办法：1. 检查入库数量。如果入库数量录入错误，您可以删除重新创建。2. 如果录入的数量为实际入库数量，则无需操作，或点击审核通过即可。"
                  placement="top">
                  <i class="el-icon-warning hoverRed"></i>
                </el-tooltip>
              </span>
            </div>
            <div class="col">
              <div class="oprCtn">
                <span class="opr hoverBlue"
                  @click="checkId=item.id;checkFlag=true">审核</span>
                <span class="opr hoverRed"
                  @click="deleteInspection(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="listCtn"
        style="min-height: 0px;"
        v-if="inspectionList.filter((item)=>item.type===2).length>0">
        <div class="list">
          <div class="row title">
            <div class="col">单据类型</div>
            <div class="col">单据编号</div>
            <div class="col">检验单位</div>
            <div class="col">产品信息</div>
            <div class="col">尺码颜色</div>
            <div class="col">出库数量</div>
            <div class="col">出库单位</div>
            <div class="col">操作时间</div>
            <div class="col">创建人</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row fontSmall"
            v-for="item in inspectionList.filter((item)=>item.type===2)"
            :key="item.id">
            <div class="col"
              :class="{'blue':item.type===1,'orange':item.type===2}">{{item.type===1?'检验入库':'生产出库'}}</div>
            <div class="col">{{item.doc_code}}</div>
            <div class="col">{{item.client_name}}</div>
            <div class="col">{{item.product_code}}/{{item.part_name}}
            </div>
            <div class="col">{{item.color}}/{{item.size}}</div>
            <div class="col"
              :class="{'blue':item.type===1,'orange':item.type===2}">{{item.number}}</div>
            <div class="col">{{item.client}}</div>
            <div class="col">{{item.complete_time}}</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col"
              :class="item.is_check|filterCheckClass">{{item.is_check|filterCheck}}</div>
            <div class="col">
              <div class="oprCtn">
                <span class="opr hoverBlue"
                  @click="checkId=item.id;checkFlag=true">审核</span>
                <span class="opr hoverRed"
                  @click="deleteInspection(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="listCtn"
        style="min-height: 0px;"
        v-if="inspectionList.filter((item)=>item.type===3).length>0">
        <div class="list">
          <div class="row title">
            <div class="col">单据类型</div>
            <div class="col">单据编号</div>
            <div class="col">检验单位</div>
            <div class="col">产品信息</div>
            <div class="col">尺码颜色</div>
            <div class="col">入库数量</div>
            <div class="col">操作时间</div>
            <div class="col">创建人</div>
            <div class="col">状态</div>
            <div class="col">操作</div>
          </div>
          <div class="row fontSmall"
            v-for="item in inspectionList.filter((item)=>item.type===3)"
            :key="item.id">
            <div class="col green">成品入库</div>
            <div class="col">{{item.doc_code}}</div>
            <div class="col">{{item.client_name}}</div>
            <div class="col">{{item.product_code}}
            </div>
            <div class="col">{{item.color}}/{{item.size}}</div>
            <div class="col green">{{item.number}}</div>
            <div class="col">{{item.complete_time}}</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col"
              :class="item.is_check|filterCheckClass">{{item.is_check|filterCheck}}</div>
            <div class="col">
              <div class="oprCtn">
                <span class="opr hoverBlue"
                  @click="checkId=item.id;checkFlag=true">审核</span>
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
          <el-checkbox v-model="keyBoard"
            @change="changeKeyBoard"
            style="margin-top:15px">开启小数字键盘</el-checkbox>
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
                <div class="label"
                  v-if="indexChild===0">
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
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">分配数</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="数量"
                        v-model="itemChild.production_number"
                        disabled></el-input>
                    </div>
                  </div>
                  <div class="once">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text">{{item.type===1?'检验数':'出库数'}}</span>
                    </div>
                    <div class="info elCtn">
                      <zh-input class="inputs"
                        :keyBoard="keyBoard"
                        v-model="itemChild.number"
                        placeholder="数量"
                        type="number">
                      </zh-input>
                    </div>
                  </div>
                  <div class="once"
                    v-if="item.type===1">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text"
                        style="color: #FA9036;">半次品/B品</span>
                    </div>
                    <div class="info elCtn">
                      <zh-input class="inputs"
                        :keyBoard="keyBoard"
                        v-model="itemChild.part_shoddy_number"
                        placeholder="数量"
                        type="number">
                      </zh-input>
                    </div>
                  </div>
                  <div class="once"
                    v-if="item.type===1">
                    <div class="label"
                      v-if="indexChild===0">
                      <span class="text"
                        style="color: #F5222D;">全次数</span>
                      <span class="explanation"
                        v-if="item.type===2">(无)</span>
                    </div>
                    <div class="info elCtn">
                      <zh-input class="inputs"
                        :keyBoard="keyBoard"
                        v-model="itemChild.shoddy_number"
                        placeholder="数量"
                        type="number">
                      </zh-input>
                    </div>
                  </div>
                </div>
              </div>
              <template v-if="item.type===1">
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once"
                      v-if="item.type===1">
                      <div class="label"
                        v-if="indexChild===0">
                        <span class="text">扣款金额</span>
                      </div>
                      <div class="info elCtn">
                        <zh-input class="inputs"
                          :keyBoard="keyBoard"
                          v-model="itemChild.deduct_price"
                          placeholder="金额"
                          type="number">
                          <template slot="append">元</template>
                        </zh-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="indexChild===0">
                        <span class="text">次品或扣款原因说明</span>
                        <span class="explanation"
                          v-if="item.type===2">(无)</span>
                      </div>
                      <div class="info elCtn">
                        <el-autocomplete placeholder="请填写次品原因"
                          v-model="itemChild.shoddy_reason"
                          :fetch-suggestions="searchReason"
                          :disabled="item.type===2">
                          <!-- <el-option v-for="item in shoddy_reason"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option> -->
                        </el-autocomplete>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="col">
                  <div class="label"
                    v-if="indexChild===0">
                    <span class="text">出库单位
                      <el-tooltip effect="dark"
                        content="统一出库单位"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="$copyInfo(item.child_data,['client'])">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择出库单位"
                      multiple
                      clearable
                      v-model="itemChild.client">
                      <el-option v-for="item in bearClientArr"
                        :key="item.client_name"
                        :value="item.client_name"
                        :label="item.client_name"></el-option>
                    </el-select>
                  </div>
                </div>
              </template>
              <div class="opr hoverRed"
                @click="item.child_data.length>1?$deleteItem(item.child_data,indexChild):$message.error('至少有一项')">删除</div>
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
    <div class="popup"
      v-show="cprkFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">成品入库</span>
          <div class="closeCtn"
            @click="cprkFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="tableCtn">
            <el-checkbox v-for="item,index in cprkProList"
              :key="index"
              v-model="item.check"
              @change="$forceUpdate()"> <span class="blue"
                style="cursor:pointer">{{item.product_code||item.system_code}}</span>
              <span class="gray">({{item.category}}/{{item.secondary_category}})</span>
            </el-checkbox>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">产品编号</div>
                <div class="tcol">产品名称</div>
                <div class="tcol">产品图片</div>
                <div class="tcol noPad"
                  style="flex:4">
                  <div class="trow">
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">下单数量</div>
                    <div class="tcol">已入库数量</div>
                    <div class="tcol">本次入库数量</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(item,index) in cprkProList.filter((item)=>item.check)"
                :key="index">
                <div class="tcol">
                  <span class="blue"
                    style="cursor:pointer">{{item.product_code||item.system_code}}</span>
                  <span class="gray">({{item.category}}/{{item.secondary_category}})</span>
                </div>
                <div class="tcol">{{item.name}}</div>
                <div class="tcol">
                  <div class="imageCtn">
                    <el-image style="width:100%;height:100%"
                      :src="item.image_data.length>0?item.image_data[0]:''"
                      :preview-src-list="item.image_data">
                      <div slot="error"
                        class="image-slot">
                        <i class="el-icon-picture-outline"
                          style="font-size:42px"></i>
                      </div>
                    </el-image>
                  </div>
                </div>
                <div class="tcol noPad"
                  style="flex:4">
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.product_info"
                    :key="indexChild">
                    <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                    <div class="tcol">{{itemChild.number}}</div>
                    <div class="tcol">{{itemChild.production_push_number}}</div>
                    <div class="tcol">
                      <div class="elCtn">
                        <el-input v-model="itemChild.inNum"
                          placeholder="数量"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="cprkFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveCprk">确认入库</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn backHoverBlue"
            @click="cprkFlag=true">成品入库</div>
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
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{inspectionList.find((item)=>Number(item.id)===Number(checkId)).is_check=ev}"
      :show="checkFlag"
      :pid="checkId"
      :check_type="checkType"
      :reason="[]"></zh-check>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, productionPlan, clientInOrder, check, checkBeyond } from '@/assets/js/api'
import { ProductionPlanInfo } from '@/types/productionPlan'
import { InspectionInfo } from '@/types/inspection'
import { inspection } from '@/assets/js/api'
import zhInput from '@/components/zhInput/zhInput.vue'
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
  is_check?: string | number
}
export default Vue.extend({
  components: { zhInput },
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
      saveLock: false,
      deductDetailFlag: false,
      checkFlag: false,
      checkType: 19,
      checkId: 0,
      keyBoard: localStorage.showWorkShopKeyBoard === 'true',
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
      bearClientArr: [],
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
      ],
      cprkFlag: false,
      cprkProList: [],
      checkListLength: 0
    }
  },
  methods: {
    searchReason(str: string, cb: any) {
      let results = str
        ? this.shoddy_reason.filter((val: any) => {
            return val.value.toLowerCase().indexOf(str.toLowerCase()) === 0
          })
        : this.shoddy_reason.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    changeKeyBoard(bol: any) {
      localStorage.showWorkShopKeyBoard = bol
    },
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
          // 类型为梭织织造、针织织造的永远排在切换按钮的最前面
          this.productionPlanMergeList = this.$mergeData(this.productionPlanList, {
            mainRule: ['process_name']
          }).sort((a: any, b: any) => {
            if (a.process_name === '针织织造' || a.name === '梭织织造') {
              return 1
            } else if (b.process_name === '针织织造' || b.name === '梭织织造') {
              return -1
            } else {
              return 0
            }
          })
          this.productionPlanMergeList.reverse()
          // 类型为梭织织造、针织织造的永远排在切换按钮的最前面的代码截至到这一句

          this.productionPlanIndex = this.productionPlanMergeList[0].process_name
          if (this.$route.query.isBarcodeScanner === 'true') {
            const finded: any = this.productionPlanMergeList.find(
              (itemFind) => itemFind.process_name === this.productionPlanIndex
            )
            const findChild = finded.childrenMergeInfo.find(
              (itemChild: any) => itemChild.code === this.$route.query.code
            )
            findChild.product_info_data.forEach((itemPro: any) => {
              if (itemPro.product_id == this.$route.query.product_id) {
                itemPro.check = true
              }
            })
            findChild.checkAll = true
            this.$forceUpdate()
            this.goInspection(1)
          } else {
            // 重置勾选
            this.productionPlanMergeList.forEach((item) => {
              item.childrenMergeInfo.forEach((itemChild) => {
                // @ts-ignore
                itemChild.checkAll = null
                itemChild.product_info_data.forEach((itemPro) => {
                  itemPro.check = false
                })
              })
            })
            this.$forceUpdate()
          }
        } else {
          this.$message.warning('该订单还未创建生产计划信息，请先填写生产计划')
          this.$router.push('/productionPlan/detail?id=' + this.$route.query.id)
        }
        this.inspectionList = res[1].data.data
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
    checkList(): ProductionPlanInfo[] {
      const finded = this.$clone(
        this.productionPlanMergeList.find((itemFind) => itemFind.process_name === this.productionPlanIndex)
      )
      const checkInfo = finded
        ? finded.childrenMergeInfo.filter((item) => {
            return item.product_info_data.filter((itemChild) => itemChild.check).length > 0
          })
        : []
      this.checkListLength = checkInfo.length
      if (checkInfo.length === 0) {
        return []
      } else {
        return checkInfo.map((item) => {
          item.product_info_data = item.product_info_data.filter((item) => item.check)
          return item
        })
      }
    },
    goInspection(type: 1 | 2) {
      const checkList = this.$clone(this.checkList())
      if (checkList.length === 0) {
        this.$message.error('请选择产品信息进行检验操作')
        return
      }
      this.InspectionInfo = []
      checkList.forEach((item) => {
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
              part_shoddy_number: '',
              deduct_price: '',
              shoddy_reason: '',
              client: []
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
        item.child_data.forEach((itemChild) => {
          itemChild.client = (itemChild.client as string[]).join(',')
        })
      )
    },
    saveInspection() {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      const formCheck = this.inspectionInfo.some((item) => {
        return item.child_data.some((itemChild) => {
          return this.$formCheck(itemChild, [
            {
              key: 'number',
              errMsg: '请填写数量'
            }
          ])
        })
      })
      if (!formCheck) {
        if (this.inspectionInfo[0].type === 1) {
          const checkArr: any = []
          this.inspectionInfo.forEach((item) => {
            item.child_data.forEach((itemChild) => {
              checkArr.push({
                doc_info_id: itemChild.doc_info_id,
                number: itemChild.number,
                type: 1
              })
            })
          })
          checkBeyond({
            doc_type: 19,
            data: checkArr
          }).then((res) => {
            if (res.data.data.length === 0) {
              this.getCmpData()
              this.saveInspectionFn()
            } else {
              const createHtml = this.$createElement
              this.$msgbox({
                message: createHtml(
                  'p',
                  undefined,
                  res.data.data.map((item: string) => {
                    return createHtml('p', undefined, item)
                  })
                ),
                title: '提示',
                showCancelButton: true,
                confirmButtonText: '继续提交',
                cancelButtonText: '取消提交',
                type: 'warning'
              })
                .then(() => {
                  this.getCmpData()
                  this.inspectionInfo.forEach((item) => (item.is_check = 4))
                  this.saveInspectionFn()
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消提交'
                  })
                })
            }
          })
        } else {
          this.getCmpData()
          this.saveInspectionFn()
        }
      }
    },
    saveInspectionFn() {
      this.saveLock = true
      const formData: InspectionInfo[] = this.$flatten(this.$flatten(this.inspectionInfo))
      inspection.create({ data: formData }).then((res) => {
        if (res.data.status) {
          this.$message.success('检验成功')
          this.closeInspection()
          this.init()
        }
        this.saveLock = false
      })
    },
    saveCprk() {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      const formArr: InspectionInfo[] = []
      this.cprkProList.forEach((item: any) => {
        if (item.check) {
          item.product_info.forEach((itemChild: any) => {
            if (itemChild.inNum) {
              formArr.push({
                id: null,
                type: 3,
                order_id: this.order_id,
                doc_info_id: itemChild.id,
                complete_time: this.$getDate(new Date()),
                number: itemChild.inNum,
                size: itemChild.size_name,
                color: itemChild.color_name,
                part_name: '',
                shoddy_number: '',
                part_shoddy_number: '',
                deduct_price: '',
                shoddy_reason: '',
                client: ''
              })
            }
          })
        }
      })
      if (formArr.length === 0) {
        this.$message.error('请填写入库数量')
        return
      }
      const checkArr = formArr.map((item) => {
        return {
          doc_info_id: item.doc_info_id,
          number: item.number,
          type: 3
        }
      })
      checkBeyond({
        doc_type: 19,
        data: checkArr
      }).then((res) => {
        if (res.data.data.length === 0) {
          this.saveCprkFn(formArr)
        } else {
          const createHtml = this.$createElement
          this.$msgbox({
            message: createHtml(
              'p',
              undefined,
              res.data.data.map((item: string) => {
                return createHtml('p', undefined, item)
              })
            ),
            title: '提示',
            showCancelButton: true,
            confirmButtonText: '继续提交',
            cancelButtonText: '取消提交',
            type: 'warning'
          })
            .then(() => {
              formArr.forEach((item: any) => (item.is_check = 4))
              this.saveCprkFn(formArr)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              })
            })
        }
      })
    },
    saveCprkFn(formArr: any[]) {
      this.saveLock = true
      inspection.create({ data: formArr }).then((res) => {
        if (res.data.status) {
          this.$message.success('入库成功')
          this.cprkFlag = false
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
        this.saveLock = false
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
        this.orderInfo.time_data.forEach((itemTime: any) => {
          itemTime.batch_data.forEach((itemBatch: any) => {
            this.cprkProList = this.cprkProList.concat(itemBatch.product_data)
          })
        })
        this.cprkProList.forEach((item: any) => (item.check = true))
        this.init()
        // 订单相关单位，用于检验出库
        clientInOrder({
          order_id: this.order_id
        }).then((res) => {
          if (res.data.status) {
            this.bearClientArr = res.data.data[4]
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