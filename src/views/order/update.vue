<template>
  <div id="orderUpdate"
    class="bodyContainer"
    v-loading="loading"
    @keydown="saveSuccess=false">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">订单号</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入订单号"
                v-model="orderInfo.code"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">下单公司</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-cascader placeholder="请选择下单公司"
                v-model="orderInfo.tree_data"
                :options="clientList"
                @change="getContacts">
              </el-cascader>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">公司联系人</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择公司联系人"
                v-model="orderInfo.contacts_id"
                no-data-text="请先选择报价公司">
                <el-option v-for="item in contactsList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">负责小组/人</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择负责小组/人"
                v-model="orderInfo.group_id">
                <el-option v-for="item in groupList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">报价币种</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择报价币种"
                v-model="orderInfo.settle_unit">
                <el-option v-for="item in unitArr"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                  class="between">
                  <span>{{item.name}}</span>
                  <span class="gray">({{item.short}})</span>
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">结算汇率
                <el-tooltip class="item"
                  effect="dark"
                  content="点击查看实时汇率"
                  placement="top-start">
                  <em class="el-icon-question"
                    @click="$openUrl('http://forex.hexun.com/rmbhl/#zkRate')"></em>
                </el-tooltip>
              </span>
              <span class="explanation">(必填,例：100人民币=600美元,填入"600"。)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入汇率"
                v-model="orderInfo.settle_tax"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">下单日期</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-date-picker style="width:100%"
                placeholder="请选择下单日期"
                v-model="orderInfo.time_data.order_time"
                value-format="yyyy-MM-dd"></el-date-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn flexBetween">
        <div class="title">添加产品</div>
        <div class="btn backHoverBlue"
          @click="proId=null;pid=null;pid_status=null;addProductFlag = true;">添加新产品</div>
      </div>
      <div class="noDate"
        v-show="productList.length === 0">暂无产品信息</div>
      <div class="checkList"
        v-show="productList.length>0">
        <div class="label">已选产品：</div>
        <div class="once"
          v-for="(item,index) in productList"
          :key="item.id">
          <span class="text">{{item.product_code}}</span>
          <span class="el-icon-view detailIcon hoverBlue"
            @click="getProductDetail(item)"></span>
          <span class="el-icon-delete deleteIcon hoverRed"
            @click="$deleteItem(productList,index)"></span>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn flexBetween"
        :style="{'border-bottom':!showTable?'0':'1px solid #e9e9e9'}">
        <div class="title">添加批次信息
          <el-tooltip class="item"
            effect="dark"
            :content="showTable?'切换为输入框模式':'切换为表格模式'"
            placement="top">
            <svg class="iconFont hoverBlue"
              style="cursor:pointer;color:#1A95FF;margin-left:12px;font-size:28px"
              aria-hidden="true"
              @click="showTable = !showTable">
              <use xlink:href='#icon-qiehuanshurukuang'></use>
            </svg>
          </el-tooltip>
        </div>
        <div class="btn backHoverBlue"
          @click="$addItem(orderInfo.time_data.batch_data, {
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
                size_color_list: [], // 用于下拉框选择尺码颜色
                product_info: [
                  {
                    size_color: '', // 用于下拉框选择尺码颜色
                    size_id: '',
                    color_id: '',
                    number: '',
                    price: ''
                  }
                ]
              }
            ]
        })">添加新批次</div>
      </div>
      <div v-if="showTable">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">发货日期</div>
              <div class="tcol">批次名称</div>
              <div class="tcol">批次类型</div>
              <div class="tcol">批次备注</div>
              <div class="tcol noPad"
                style="flex:6">
                <div class="trow">
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcol"
                        style="flex:1.2">产品编号</div>
                      <div class="tcol noPad"
                        style="flex:4">
                        <div class="trow">
                          <div class="tcol"
                            style="flex:1.5">尺码颜色</div>
                          <div class="tcol">单价</div>
                          <div class="tcol">数量</div>
                          <div class="tcol"
                            style="flex:1.5">操作</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in orderInfo.time_data.batch_data"
              :key="'tableIcon_'+index">
              <div class="tcol">
                <div class="info elCtn noPadRight">
                  <el-date-picker style="width:100%"
                    placeholder="发货日期"
                    v-model="item.delivery_time"
                    value-format="yyyy-MM-dd"></el-date-picker>
                </div>
              </div>
              <div class="tcol">
                <div class="elCtn">
                  <el-input v-model="item.batch_title"
                    placeholder="批次名称">
                  </el-input>
                </div>
              </div>
              <div class="tcol">
                <div class="elCtn">
                  <div class="info elCtn">
                    <el-select v-model="item.batch_type_id">
                      <el-option v-for="item in orderTypeList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="tcol">
                <div class="elCtn">
                  <el-input v-model="item.desc"
                    placeholder="批次备注">
                  </el-input>
                </div>
              </div>
              <div class="tcol noPad"
                style="flex:6">
                <div class="trow"
                  v-for="itemPro,indexPro in item.product_data"
                  :key="itemPro.id">
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcol"
                        style="flex:1.2">
                        <div class="elCtn"
                          style="width:87%">
                          <el-select v-model="itemPro.product_id"
                            placeholder="选择产品"
                            @change="getColour($event,itemPro)"
                            no-data-text="请先添加/导入产品"
                            clearable>
                            <el-option v-for="itemProduct in productList"
                              :key="itemProduct.id"
                              :value="itemProduct.id"
                              :label="itemProduct.product_code + '/' + itemProduct.name"
                              :disabled="proDisable(index,itemProduct.id)"></el-option>
                          </el-select>
                          <el-tooltip class="item"
                            effect="dark"
                            content="统一单价和数量"
                            placement="top">
                            <svg class="iconFont copyIcon hoverBlue"
                              style="width:16px;height:16px"
                              aria-hidden="true"
                              @click="$copyInfo(itemPro.product_info,['price','number'])">
                              <use xlink:href='#icon-tongbushuju1'></use>
                            </svg>
                          </el-tooltip>
                        </div>
                      </div>
                      <div class="tcol noPad"
                        style="flex:4">
                        <div class="trow"
                          v-for="(itemProInfo,indexProInfo) in itemPro.product_info"
                          :key="indexProInfo">
                          <div class="tcol"
                            style="flex:1.5">
                            <div class="elCtn">
                              <el-select v-model="itemProInfo.size_color"
                                placeholder="尺码颜色"
                                no-data-text="请先选择产品">
                                <el-option v-for="itemColor in itemPro.size_color_list"
                                  :key="itemColor.value"
                                  :label="itemColor.label"
                                  :value="itemColor.value"></el-option>
                              </el-select>
                            </div>
                          </div>
                          <div class="tcol">
                            <div class="elCtn">
                              <el-input v-model="itemProInfo.price"
                                placeholder="单价">
                              </el-input>
                            </div>
                          </div>
                          <div class="tcol">
                            <div class="elCtn">
                              <el-input v-model="itemProInfo.number"
                                placeholder="数量">
                              </el-input>
                            </div>
                          </div>
                          <div class="tcol oprCtn"
                            style="flex:1.5;font-size:12px">
                            <div class="opr hoverBlue"
                              @click="$addItem(item.product_data, {
                                  product_id: '',
                                  size_color_list: [],
                                  product_info: [
                                    {
                                      size_color: [], 
                                      size_id: '',
                                      color_id: '',
                                      number: '',
                                      price: ''
                                    }
                                  ]
                                })">新增</div>
                            <div class="opr hoverBlue"
                              @click="$addItem(itemPro.product_info,{
                                  size_color: [], // 用于下拉框选择尺码颜色
                                  size_id: '',
                                  color_id: '',
                                  number: '',
                                  price: ''
                                })">新增尺码</div>
                            <div class="opr hoverRed"
                              @click="deleteInfo(item,itemPro,itemProInfo,index,indexPro,indexProInfo)">删除</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-for="(item,index) in orderInfo.time_data.batch_data"
          :key="index">
          <div class="lineInfo">
            <div class="text">批次{{index+1}}</div>
            <div class="deleteIcon"
              @click="orderInfo.time_data.batch_data.length>1?deleteBatch(item.id,index,orderInfo.time_data.batch_data):$message.error('至少有一批')">删除</div>
          </div>
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">发货日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    placeholder="请选择发货日期"
                    v-model="item.delivery_time"
                    value-format="yyyy-MM-dd"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">批次名称</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="item.batch_title"
                    placeholder="批次名称、PO号或者其它订单号"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">批次类型</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="item.batch_type_id">
                    <el-option v-for="item in orderTypeList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">批次备注</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="item.desc"
                    placeholder="如有需要，请在此输入其它批次备注"></el-input>
                </div>
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">产品编号</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcol">尺码颜色</div>
                      <div class="tcol">下单单价</div>
                      <div class="tcol">下单数量</div>
                      <div class="tcol">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(itemChild,indexChild) in item.product_data"
                  :key="indexChild">
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select v-model="itemChild.product_id"
                        placeholder="选择产品"
                        @change="getColour($event,item)"
                        no-data-text="请先添加/导入产品">
                        <el-option v-for="itemPro in productList"
                          :key="itemPro.id"
                          :value="itemPro.id"
                          :label="itemPro.product_code + '/' + item.name"
                          :disabled="proDisable(index,itemPro.id)"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemPro,indexPro) in itemChild.product_info"
                      :key="indexPro">
                      <div class="tcol">
                        <div class="elCtn">
                          <el-select v-model="itemPro.size_color"
                            placeholder="尺码颜色"
                            no-data-text="请先选择产品">
                            <el-option v-for="item in itemChild.size_color_list"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="tcol">
                        <div class="elCtn">
                          <el-input v-model="itemPro.price"
                            placeholder="下单单价">
                            <template slot="append">{{orderInfo.settle_unit||'元'}}</template>
                          </el-input>
                        </div>
                      </div>
                      <div class="tcol">
                        <div class="elCtn">
                          <el-input v-model="itemPro.number"
                            placeholder="下单数量">
                          </el-input>
                        </div>
                      </div>
                      <div class="tcol oprCtn">
                        <div class="opr hoverBlue"
                          @click="$addItem(itemChild.product_info,{
                            size_color: [], // 用于下拉框选择尺码颜色
                            size_id: '',
                            color_id: '',
                            number: '',
                            price: ''
                          })">新增尺码</div>
                        <div class="opr hoverRed"
                          @click="itemChild.product_info.length===1?deletePro(itemChild.id,indexChild,item.product_data):deleteProChild(itemPro.id,indexPro,itemChild.product_info)">删除</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="oprRow"
                style="margin-right:0">
                <div class="once"
                  @click="$addItem(item.product_data, {
                    product_id: '',
                    size_color_list: [],
                    product_info: [
                      {
                        size_color: [], 
                        size_id: '',
                        color_id: '',
                        number: '',
                        price: ''
                      }
                    ]
                  })">新增产品
                  <i class="el-icon-plus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">其他信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">是否要求寄送产前样</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-radio-group v-model="orderInfo.time_data.is_send">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
              <span class="hoverBlue"
                style="margin-left:12px;cursor:pointer;font-size:14px"
                @click="sendFlag = true"
                v-show="orderInfo.time_data.is_send===1">编辑寄送要求</span>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">是否需要产前信息确认</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-radio-group v-model="orderInfo.time_data.is_before_confirm">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">是否加急生产</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-radio-group v-model="orderInfo.time_data.is_urgent">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">下单款数</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入下单款数"
                v-model="totalStyle"
                disabled></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">下单总数</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入下单总数"
                v-model="totalNumber"
                disabled></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">下单总费用</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入下单总费用"
                v-model="totalPrice"
                disabled></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">公开文件</span>
              <span class="explanation">(涉及订单流程权限的帐号均可查看)</span>
            </div>
            <div class="info">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                :before-upload="beforeAvatarUpload"
                :data="postData"
                :on-remove="(ev)=>{return removeFile(ev,orderInfo.public_files)}"
                :on-success="(ev)=>{return successFile(ev,orderInfo.public_files)}"
                :file-list="pub_file_list"
                ref="uploada">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">可以上传word、excel、pdf等格式的文件，且不超过10M(请勿上传带特殊字符的文件)</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">私密文件</span>
              <span class="explanation">(只有具有审核权限的帐号可查看)</span>
            </div>
            <div class="info">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                :before-upload="beforeAvatarUpload"
                :data="postData"
                :on-remove="(ev)=>{return removeFile(ev,orderInfo.private_files)}"
                :on-success="(ev)=>{return successFile(ev,orderInfo.private_files)}"
                :file-list="pri_file_list"
                ref="uploada">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">可以上传word、excel、pdf等格式的文件，且不超过10M(请勿上传带特殊字符的文件)</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="row"
          style="z-index: 0;">
          <div class="col">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div id='editorOrder'
              style="z-index: 0;position: relative;">
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
          <div class="btn backHoverOrange"
            @click="saveOrder(true)"
            v-if="orderInfo.status<2">保存为草稿</div>
          <div class="btn backHoverBlue"
            @click="saveOrder(false)">修改</div>
        </div>
      </div>
    </div>
    <zh-order-send :editFlag="true"
      :show="sendFlag"
      :time_id="orderInfo.time_data.id"
      :data="orderInfo.time_data.send_info"
      @close="sendFlag=false"
      @saveInfo="(ev)=>{orderInfo.time_data.send_info=ev;sendFlag=false;$message.success('保存成功')}"></zh-order-send>
    <product-edit :pid="pid"
      :pid_status="pid_status"
      :id="proId"
      :show="addProductFlag"
      @close="addProductFlag = false"
      @afterSave="getNewProduct"></product-edit>
    <product-detail :id="productDetail.id"
      :show="productShow"
      @close="productShow = false"></product-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { OrderInfo, OrderTime } from '@/types/order'
import { moneyArr } from '@/assets/js/dictionary'
import { ProductInfo } from '@/types/product'
import { client, fileManage, order } from '@/assets/js/api'
interface OrderCreate extends OrderInfo {
  time_data: OrderTime
}
export default Vue.extend({
  data(): {
    productDetail: ProductInfo
    productList: ProductInfo[]
    orderInfo: OrderCreate
    [propName: string]: any
  } {
    return {
      loading: true,
      sendFlag: false,
      showTable: true,
      unitArr: moneyArr,
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
        editor: '',
        time_data: {
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
          send_info: {
            other_desc: '',
            info: []
          },
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
                  size_color_list: [], // 用于下拉框选择尺码颜色
                  product_info: [
                    {
                      size_color: '', // 用于下拉框选择尺码颜色
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
      },
      addProductFlag: false,
      productList: [],
      productShow: false,
      contactsList: [],
      productDetail: {
        id: null,
        product_type: 1,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category_id: '',
        secondary_category_id: '',
        type: [], // 品类下拉框
        image_data: [],
        desc: '',
        style_data: [], // 款式
        component_data: [
          {
            component_id: '',
            number: '' // 成分信息
          }
        ],
        size_data: [
          {
            id: '',
            size_id: '',
            size_info: '',
            weight: ''
          }
        ], // 尺码组
        color_data: [], // 配色组
        // 配件信息
        part_data: [
          {
            name: '',
            unit: '',
            part_size_data: [
              {
                id: '',
                size_id: '',
                size_info: '',
                weight: ''
              }
            ],
            part_component_data: [
              {
                component_id: '',
                number: '' // 成分信息
              }
            ]
          }
        ]
      },
      pid: null,
      pid_status: null,
      proId: null,
      postData: {
        key: '',
        token: ''
      },
      pub_file_list: [],
      pri_file_list: [],
      saveSuccess: false
    }
  },
  computed: {
    token(): string {
      return this.$store.state.status.token
    },
    clientList(): any[] {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    },
    groupList(): any[] {
      return this.$store.state.api.group.arr
    },
    orderTypeList(): any[] {
      return this.$store.state.api.orderType.arr
    },
    totalStyle(): number {
      return this.orderInfo.time_data.batch_data.reduce((total, current) => {
        return total + current.product_data.length
      }, 0)
    },
    totalPrice(): number {
      return this.orderInfo.time_data.batch_data.reduce((totalBatch, currentBatch) => {
        return (
          totalBatch +
          currentBatch.product_data.reduce((total, current) => {
            return (
              total +
              current.product_info.reduce((totalChild, itemChild) => {
                return totalChild + Number(itemChild.price) * Number(itemChild.number)
              }, 0)
            )
          }, 0)
        )
      }, 0)
    },
    totalNumber(): number {
      return this.orderInfo.time_data.batch_data.reduce((totalBatch, currentBatch) => {
        return (
          totalBatch +
          currentBatch.product_data.reduce((total, current) => {
            return (
              total +
              current.product_info.reduce((totalChild, itemChild) => {
                return totalChild + Number(itemChild.number)
              }, 0)
            )
          }, 0)
        )
      }, 0)
    }
  },
  methods: {
    // 筛选出每个批次中还未被选中的产品，做个优化
    proDisable(index: number, id: number) {
      if (this.orderInfo.time_data.batch_data[index].product_data.find((item) => item.product_id === id)) {
        return true
      } else {
        return false
      }
    },
    getOrderProduct(orderInfo: OrderCreate): ProductInfo[] {
      const flattenArr: ProductInfo[] = [] // 存储return信息
      orderInfo.time_data.batch_data.forEach((itemBatch) => {
        itemBatch.product_data.forEach((itemPro: any) => {
          if (!itemPro.product_id) {
            return
          }
          flattenArr.push({
            system_code: itemPro.system_code,
            id: itemPro.product_id,
            product_type: 1,
            name: itemPro.name as string,
            product_code: itemPro.product_code,
            category: itemPro.category,
            secondary_category: itemPro.secondary_category,
            size_data: itemPro.size_data!,
            color_data: itemPro.color_data!,
            style_data: itemPro.style_data,
            part_data: [],
            desc: '',
            image_data: [],
            component_data: []
          })
        })
      })
      return flattenArr
    },
    getColour(ev: number, info: any) {
      if (!ev) {
        return
      }
      info.size_color_list = []
      const product: ProductInfo = this.productList.find((item) => item.id === ev) as ProductInfo
      product.size_data.forEach((itemSize: any) => {
        product.color_data.forEach((itemColor: any) => {
          info.size_color_list.push({
            label: itemSize.name + '/' + itemColor.name,
            value: itemSize.id + '/' + itemColor.id
          })
        })
      })
    },
    getContacts(ev: number[]) {
      if (ev) {
        client
          .detail({
            id: ev[2]
          })
          .then((res) => {
            if (res.data.status) {
              this.contactsList = res.data.data.contacts_data
            }
          })
      }
    },
    getNewProduct(product: ProductInfo) {
      this.productList.push(product)
      if (!this.orderInfo.time_data.batch_data[0].product_data[0].product_id) {
        this.orderInfo.time_data.batch_data[0].product_data = []
      }
      let productInfo = {
        product_id: product.id as number,
        quote_product_id: '',
        size_color_list: [], // 用于下拉框选择尺码颜色
        product_info: [
          {
            size_color: '', // 用于下拉框选择尺码颜色
            size_id: '',
            color_id: '',
            number: '',
            price: ''
          }
        ]
      }
      product.size_data.forEach((itemSize: any) => {
        product.color_data.forEach((itemColor: any) => {
          productInfo.size_color_list.push({
            // @ts-ignore
            label: itemSize.name + '/' + itemColor.name,
            // @ts-ignore
            value: itemSize.id + '/' + itemColor.id
          })
        })
      })
      // @ts-ignore
      productInfo.product_info = productInfo.size_color_list.map((item: any) => {
        return {
          size_color: item.value,
          size_id: item.value.split('/')[0],
          color_id: item.value.split('/')[1],
          number: '',
          price: 0
        }
      })
      productInfo.quote_product_id = product.quote_product_id as string
      this.orderInfo.time_data.batch_data[0].product_data.push(productInfo)
    },
    getProductDetail(product: ProductInfo) {
      this.productShow = true
      this.productDetail = product
      console.log(this.productDetail.id)
    },
    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      const haveSpecial = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？；‘']/im
      if (haveSpecial.test(file.name.split('.')[0])) {
        this.$message.error('文件名称要以中文或字母的方式命名，不能带特殊字符，请重命名文件上传!')
        return false
      }
      this.postData.token = this.token
      this.postData.key = file.name.split('.')[0] + Date.parse(new Date() + '') + '.' + fileFormat
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    successFile(response: { hash: string; key: string }, orderFile: any[]) {
      orderFile.push('https://file.zwyknit.com/' + response.key)
    },
    removeFile(file: { url: string; response: { hash: string; key: string } }, orderFile: any[]) {
      if (this.pub_file_list.find((item: any) => item.url === file.url)) {
        fileManage
          .delete({
            id: this.pub_file_list.find((item: any) => item.url === file.url).id
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.$deleteItem(this.pub_file_list, this.pub_file_list.map((item: any) => item.url).indexOf(file.url))
            }
          })
      } else if (this.pri_file_list.find((item: any) => item.url === file.url)) {
        fileManage
          .delete({
            id: this.pri_file_list.find((item: any) => item.url === file.url).id
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.$deleteItem(this.pri_file_list, this.pri_file_list.map((item: any) => item.url).indexOf(file.url))
            }
          })
      } else {
        this.$deleteItem(orderFile, orderFile.indexOf('https://file.zwyknit.com/' + file.response.key))
      }
    },
    getCmpData() {
      // 不用拼接文件啦，直接提交新的就行
      // this.orderInfo.public_files = this.orderInfo.public_files.concat(this.pub_file_list.map((item: any) => item.url))
      // this.orderInfo.private_files = this.orderInfo.private_files.concat(
      //   this.pri_file_list.map((item: any) => item.url)
      // )
      this.orderInfo.client_id = (this.orderInfo.tree_data as number[])[2]
      this.orderInfo.tree_data = (this.orderInfo.tree_data as number[]).join(',')
      this.orderInfo.time_data.total_style = this.totalStyle
      this.orderInfo.time_data.total_number = this.totalNumber
      this.orderInfo.time_data.total_price = this.totalPrice
      this.orderInfo.time_data.batch_data.forEach((itemBatch) => {
        itemBatch.product_data.forEach((item) => {
          item.product_info.forEach((itemChild) => {
            itemChild.size_id = itemChild.size_color!.split('/')[0]
            itemChild.color_id = itemChild.size_color!.split('/')[1]
          })
        })
      })
      this.orderInfo.editor = ''
    },
    deleteInfo(itemBatch: any, itemPro: any, itemChild: any, indexBatch: number, indexPro: number, indexChild: number) {
      if (itemPro.product_info.length === 1) {
        if (itemBatch.product_data.length === 1) {
          if (this.orderInfo.time_data.batch_data.length === 1) {
            this.$message.error('订单至少有一个批次')
          } else {
            this.deleteBatch(itemBatch.id, indexBatch, this.orderInfo.time_data.batch_data)
          }
        } else {
          this.deletePro(itemPro.id, indexPro, itemBatch.product_data)
        }
      } else {
        this.deleteProChild(itemChild.id, indexChild, itemPro.product_info)
      }
    },
    deleteBatch(id: number, index: number, info: any[]) {
      if (!id) {
        this.$deleteItem(info, index)
        return
      }
      this.$confirm('是否删除该批次?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          order
            .deleteBatch({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$deleteItem(info, index)
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
    deletePro(id: number, index: number, info: any[]) {
      if (!id) {
        this.$deleteItem(info, index)
        return
      }
      this.$confirm('是否删除该产品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          order
            .deletePro({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$deleteItem(info, index)
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
    deleteProChild(id: number, index: number, info: any[]) {
      if (!id) {
        this.$deleteItem(info, index)
        return
      }
      this.$confirm(
        '注意：点击确定删除该尺码颜色后，无需点击修改按钮，该尺码颜色将会直接从该订单中删除，是否需要删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          order
            .deleteProChild({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$deleteItem(info, index)
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
    saveOrder(ifCaogao: boolean) {
      if (ifCaogao) {
        this.orderInfo.is_draft = 1
        this.getCmpData()
        order.create(this.orderInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('草稿保存成功')
            this.$router.push('/order/list?page=1&keyword=&client_id=&user_id=&status=null&date=')
          }
        })
      } else {
        this.orderInfo.is_draft = 2
        const formCheck =
          this.$formCheck(this.orderInfo, [
            {
              key: 'code',
              errMsg: '请输入订单号'
            },
            {
              key: 'tree_data',
              errMsg: '请选择下单公司',
              regNormal: 'checkArr'
            }
          ]) ||
          this.$formCheck(this.orderInfo.time_data, [
            {
              key: 'order_time',
              errMsg: '请选择下单时间'
            }
          ]) ||
          this.orderInfo.time_data.batch_data.some((item) => {
            return (
              this.$formCheck(item, [
                {
                  key: 'delivery_time',
                  errMsg: '请选择发货日期'
                }
                // {
                //   key: 'batch_type_id',
                //   errMsg: '请选择批次类型'
                // }
              ]) ||
              item.product_data.some((itemChild) => {
                return (
                  this.$formCheck(itemChild, [
                    {
                      key: 'product_id',
                      errMsg: '请选择产品'
                    }
                  ]) ||
                  itemChild.product_info.some((itemPro) => {
                    return this.$formCheck(itemPro, [
                      {
                        key: 'size_color',
                        errMsg: '请选择尺码颜色'
                      },
                      {
                        key: 'price',
                        errMsg: '请输入下单单价'
                      },
                      {
                        key: 'number',
                        errMsg: '请输入下单数量'
                      }
                    ])
                  })
                )
              })
            )
          })
        if (
          this.orderInfo.time_data.batch_data.some((item) => {
            return this.$ifRepeatArray(item.product_data.map((itemChild) => itemChild.product_id) as string[])
          })
        ) {
          this.$message.error('相同产品请不要分多次添加')
          return
        }
        if (!formCheck) {
          this.getCmpData()
          order.create(this.orderInfo).then((res) => {
            if (res.data.status) {
              this.$message.success('修改成功')
              this.saveSuccess = true
              this.$router.push('/order/detail?id=' + this.$route.query.id)
            }
          })
        }
      }
    }
  },
  mounted() {
    // 这个页面调用了添加产品组件，已经拿过token了
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/orderType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getOrderTypeAsync'
      }
    ])
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          // @ts-ignore
          this.orderInfo.time_data = this.orderInfo.time_data[0]
          this.productList = this.getOrderProduct(this.orderInfo)
          this.orderInfo.tree_data = (this.orderInfo.tree_data as string).split(',').map((item) => Number(item))
          this.getContacts(this.orderInfo.tree_data as number[])
          this.orderInfo.private_files = this.orderInfo.private_files || []
          this.pub_file_list = this.orderInfo.public_files.map((item: any, index: number) => {
            return {
              name: '文件' + (index + 1) + '.' + item.file_url.split('.')[item.file_url.split('.').length - 1],
              id: index,
              url: item
            }
          })
          this.pri_file_list = this.orderInfo.private_files.map((item: any, index: number) => {
            return {
              name: '文件' + (index + 1) + '.' + item.file_url.split('.')[item.file_url.split('.').length - 1],
              id: index,
              url: item.file_url
            }
          })
          this.orderInfo.public_files = []
          this.orderInfo.private_files = []
          this.orderInfo.time_data.batch_data.forEach((item) => {
            item.product_data.forEach((itemChild) => {
              this.getColour(Number(itemChild.product_id), itemChild)
              itemChild.product_info.forEach((itemPro) => {
                itemPro.size_color = itemPro.size_id + '/' + itemPro.color_id
              })
            })
          })
        }
        this.loading = false
        this.$nextTick(() => {
          this.$initEditor(this.orderInfo, 'Order')
        })
      })
  },
  beforeRouteLeave(to, from, next) {
    if (this.saveSuccess) {
      next()
    } else {
      this.$confirm('是否离开修改页面，这会导致已填写的数据丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          next()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/order/update.less';
</style>
<style lang="less">
#orderUpdate {
  .noPadRight {
    .el-input--suffix .el-input__inner {
      padding-right: 0;
    }
  }
}
</style>