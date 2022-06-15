<template>
  <div id="orderCreate"
    class="bodyContainer"
    v-loading="loading">
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
              <el-tooltip class="item"
                effect="dark"
                content="设置成功后请点击此按钮刷新数据"
                placement="top">
                <i class="el-icon-refresh hoverGreen fr"
                  style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                  @click="$checkCommonInfo([{
                    checkWhich: 'api/clientType',
                    getInfoMethed: 'dispatch',
                    getInfoApi: 'getClientTypeAsync',
                    forceUpdate:true
                  }])"></i>
              </el-tooltip>
              <el-tooltip class="item"
                effect="dark"
                content="添加新客户"
                placement="top">
                <i class="el-icon-upload hoverOrange fr"
                  style="line-height:38px;font-size:18px;cursor:pointer;"
                  @click="$openUrl('/client/create?type=1')"></i>
              </el-tooltip>
            </div>
            <div class="info elCtn">
              <el-cascader :class="{'error':mustFlag&&orderInfo.tree_data.length===0}"
                placeholder="请选择下单公司"
                v-model="orderInfo.tree_data"
                :options="clientList"
                @change="getContacts"
                filterable>
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
                no-data-text="请先选择下单公司">
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
              <span class="text">下单币种</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择下单币种"
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
              <span class="text">币种汇率
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
              <el-input :class="{'error':mustFlag&&!orderInfo.settle_tax}"
                placeholder="请输入汇率"
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
              <el-date-picker :class="{'error':mustFlag&&!orderInfo.order_time}"
                style="width:100%"
                placeholder="请选择下单日期"
                v-model="orderInfo.time_data.order_time"
                value-format="yyyy-MM-dd"></el-date-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="confirmSampleInfo.length>0">
      <div class="titleCtn">
        <div class="title">已确认样品信息</div>
      </div>
      <div class="notes">已确认的样品需要通过<span class="blue">转产品</span>按钮转换成产品后，才能下单。
        在确认产品信息的时候，可以对其中的信息进行修改，这不会影响样单里的样品信息。
        注意：样品在转产品之后工艺单信息需要重新添加，通过<span class="blue">快捷导入</span>按钮可以快速导入相关工艺单。</div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">样品编号</div>
            <div class="tcol">样品名称</div>
            <div class="tcol">样品图片</div>
            <div class="tcol noPad"
              style="flex:2">
              <div class="trow">
                <div class="tcol">尺码颜色</div>
                <div class="tcol">单价</div>
                <div class="tcol">数量</div>
              </div>
            </div>
            <div class="tcol">转换状态</div>
            <div class="tcol">样品描述</div>
            <div class="tcol">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in confirmSampleInfo"
            :key="index">
            <div class="tcol">
              <span>{{item.product_code||item.system_code}}</span>
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
              style="flex:2">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.product_info"
                :key="indexChild">
                <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                <div class="tcol">{{itemChild.price}}元</div>
                <div class="tcol">{{itemChild.number}}</div>
              </div>
            </div>
            <div class="tcol"> <span :class="item.status|productStatusClassFilter">{{item.status|productStatusFilter}}</span></div>
            <div class="tcol">{{item.desc}}</div>
            <div class="tcol oprCtn">
              <div class="opr blue"
                @click="changeToPro(item.product_id)">样品转产品</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn flexBetween">
        <div class="title">添加产品</div>
        <div class="btn backHoverBlue"
          @click="proId=null;pid=null;pid_status=null;addProductFlag = true;"
          v-show="quotedPriceProductList.length===0">添加新产品</div>
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
    <div class="module"
      v-if="quotedPriceProductList.length>0">
      <div class="titleCtn">
        <div class="title">报价信息表</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">序号</div>
            <div class="tcol">样品品类</div>
            <div class="tcol">样品图片</div>
            <div class="tcol">实际报价</div>
            <div class="tcol">样品描述</div>
            <div class="tcol">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in quotedPriceProductList"
            :key="item.id">
            <div class="tcol">{{index+1}}</div>
            <div class="tcol">{{item.category_name}}/{{item.secondary_category}}</div>
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
            <div class="tcol">{{item.client_target_price}}元</div>
            <div class="tcol"
              v-html="item.desc"></div>
            <div class="tcol oprCtn">
              <div class="opr hoverBlue"
                @click="supplementInfo(item)"
                v-if="!item.has_change">补充信息</div>
              <div class="opr orange"
                v-else>已转换</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn flexBetween"
        :style="{'border-bottom':!showTable?'0':'1px solid #e9e9e9'}">
        <div class="title">
          添加批次信息
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
            batch_number: orderInfo.time_data.batch_data.length+1,
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
                <div class="info elCtn">
                  <el-date-picker :class="{'error':mustFlag&&!item.delivery_time}"
                    style="width:100%"
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
                          <el-select :class="{'error':mustFlag&&!itemPro.product_id}"
                            v-model="itemPro.product_id"
                            placeholder="选择产品"
                            @change="getColour($event,itemPro)"
                            no-data-text="请先添加/导入产品">
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
                              <el-select :class="{'error':mustFlag&&!itemProInfo.size_color}"
                                v-model="itemProInfo.size_color"
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
                              <el-input :class="{'error':mustFlag&&!itemProInfo.price}"
                                v-model="itemProInfo.price"
                                placeholder="单价">
                              </el-input>
                            </div>
                          </div>
                          <div class="tcol">
                            <div class="elCtn">
                              <el-input :class="{'error':mustFlag&&!itemProInfo.number}"
                                v-model="itemProInfo.number"
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
                              @click="tableDelete(orderInfo.time_data.batch_data,index,item.product_data,indexPro,itemPro.product_info,indexProInfo)">删除</div>
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
              @click="orderInfo.time_data.batch_data.length>1?$deleteItem(orderInfo.time_data.batch_data,index):$message.error('至少有一批')">删除</div>
          </div>
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">发货日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker :class="{'error':mustFlag&&!item.delivery_time}"
                    style="width:100%"
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
                  <div class="tcol">尺码颜色</div>
                  <div class="tcol">下单单价</div>
                  <div class="tcol">下单数量</div>
                  <div class="tcol">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(itemChild,indexChild) in item.product_data"
                  :key="indexChild">
                  <div class="tcol">
                    <div class="elCtn"
                      style="width:220px">
                      <el-select :class="{'error':mustFlag&&!itemChild.product_id}"
                        v-model="itemChild.product_id"
                        placeholder="选择产品"
                        @change="getColour($event,itemChild)"
                        no-data-text="请先添加/导入产品">
                        <el-option v-for="itemProduct in productList"
                          :key="itemProduct.id"
                          :value="itemProduct.id"
                          :label="itemProduct.product_code + '/' + item.name"
                          :disabled="proDisable(index,itemProduct.id)"></el-option>
                      </el-select>
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一单价和数量"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          style="width:16px;height:16px"
                          aria-hidden="true"
                          @click="$copyInfo(itemChild.product_info,['price','number'])">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="tcol noPad"
                    style="flex:4.35">
                    <div class="trow"
                      v-for="(itemPro,indexPro) in itemChild.product_info"
                      :key="indexPro">
                      <div class="tcol">
                        <div class="elCtn">
                          <el-select v-model="itemPro.size_color"
                            placeholder="尺码颜色"
                            no-data-text="请先选择产品"
                            :class="{'error':mustFlag&&!itemPro.size_color}">
                            <el-option v-for="item in itemChild.size_color_list"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="tcol">
                        <div class="elCtn">
                          <el-input :class="{'error':mustFlag&&!itemPro.price}"
                            v-model="itemPro.price"
                            placeholder="下单单价">
                            <template slot="append">{{orderInfo.settle_unit||'元'}}</template>
                          </el-input>
                        </div>
                      </div>
                      <div class="tcol">
                        <div class="elCtn">
                          <el-input :class="{'error':mustFlag&&!itemPro.number}"
                            v-model="itemPro.number"
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
                          @click="itemChild.product_info.length>1?$deleteItem(itemChild.product_info,indexPro):$deleteItem(item.product_data,indexChild)">删除</div>
                      </div>
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
              <span class="explanation">(自动计算))</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入下单总数"
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
                disabled>
                <template slot="append">{{orderInfo.settle_unit||'元'}}</template>
              </el-input>
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
                ref="uploada">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">可以上传word、excel、pdf等格式的文件，且不超过10M</div>
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
                ref="uploada">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">可以上传word、excel、pdf等格式的文件，且不超过10M</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入订单描述及备注信息"
                v-model="orderInfo.desc"></el-input>
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
            @click="saveOrder(true)">保存为草稿</div>
          <div class="btn backHoverBlue"
            @click="saveOrder(false)">提交</div>
        </div>
      </div>
    </div>
    <product-edit :pid="pid"
      :pid_status="pid_status"
      :id="proId"
      :show="addProductFlag"
      @close="addProductFlag = false"
      @afterSave="getNewProduct"
      :quote_product_id="quotedPriceProductInfo.id"
      :quote_rel_product_data="quotedPriceProductInfo"></product-edit>
    <!-- 任何有编辑页面的detail组件请务必去掉编辑功能，noOpr = true,因为wangeditor组件是填充到id里，新增和修改的editor重复了 -->
    <product-detail :noOpr="true"
      :data="productDetail"
      :show="productShow"
      @close="productShow = false"></product-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { OrderInfo, OrderTime } from '@/types/order'
import { SampleOrderInfo, SampleOrderTime } from '@/types/sampleOrder'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import { moneyArr } from '@/assets/js/dictionary'
import { ProductInfo } from '@/types/product'
import { client, order, sampleOrder, quotedPrice } from '@/assets/js/api'
import { SampleInfo } from '@/types/sample'
interface OrderCreate extends OrderInfo {
  time_data: OrderTime
}
interface SampleOrderDetail extends SampleOrderInfo {
  time_data: SampleOrderTime[]
}
export default Vue.extend({
  data(): {
    productDetail: ProductInfo
    changeToProDetail: ProductInfo
    productList: ProductInfo[]
    orderInfo: OrderCreate
    confirmSampleInfo: SampleInfo[]
    [propName: string]: any
  } {
    return {
      showTable: true,
      loading: false,
      saveLock: false,
      mustFlag: false,
      unitArr: moneyArr,
      quotedPriceProductInfo: {
        id: '',
        category_id: '',
        secondary_category_id: ''
      },
      quotedPriceProductList: [], // 报价单的产品描述
      orderInfo: {
        pid: null,
        id: null,
        client_id: '',
        group_id: Number(this.$getsessionStorage('group_id')) || Number(this.$getLocalStorage('group_id')) || '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        order_type: 1,
        code: '',
        desc: '',
        rel_quote_id: '',
        settle_unit: '元',
        settle_tax: '100',
        tree_data: [],
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
      changeToProDetail: {
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
      saveSuccess: false,
      confirmSampleInfo: [] // 已经确认的样品信息
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
    tableDelete(
      orderInfo_batch_data: Array<any>,
      index: number,
      product_data: Array<any>,
      indexPro: number,
      itemProInfo: Array<any>,
      indexProInfo: number
    ) {
      if (itemProInfo.length !== 1) {
        console.log(itemProInfo)
        this.$deleteItem(itemProInfo, indexProInfo)
      } else {
        if (product_data.length !== 1) {
          this.$deleteItem(product_data, indexPro)
        } else {
          if (orderInfo_batch_data.length !== 1) {
            this.$deleteItem(orderInfo_batch_data, index)
          } else {
            this.$message.error('至少有一批')
          }
        }
      }
    },
    // 报价单转订单逻辑
    getQuotedPrice() {
      if (this.$route.query.quotedPriceId) {
        this.loading = true
        quotedPrice
          .detail({
            id: Number(this.$route.query.quotedPriceId)
          })
          .then((res) => {
            const quotedPriceInfo: QuotedPriceInfo = res.data.data
            this.orderInfo.tree_data = (quotedPriceInfo.tree_data as string).split(',').map((item) => Number(item))
            this.getContacts(this.orderInfo.tree_data as number[])
            this.orderInfo.contacts_id = quotedPriceInfo.contacts_id
            this.orderInfo.group_id = quotedPriceInfo.group_id
            this.orderInfo.rel_quote_id = Number(this.$route.query.quotedPriceId)
            this.quotedPriceProductList = quotedPriceInfo.product_data
            this.loading = false
          })
      }
    },
    supplementInfo(productInfo: ProductInfo) {
      this.addProductFlag = true
      this.quotedPriceProductInfo = productInfo
    },
    // 样品转产品
    changeToPro(id: number) {
      this.pid = id
      this.pid_status = 4
      this.proId = id
      this.addProductFlag = true
    },
    getColour(ev: number, info: any) {
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
      info.product_info = info.size_color_list.map((item: any) => {
        return {
          size_color: item.value,
          size_id: item.value.split('/')[0],
          color_id: item.value.split('/')[1],
          number: '',
          price: 0
        }
      })
      info.quote_product_id = product.quote_product_id
    },
    // 筛选出每个批次中还未被选中的产品，做个优化
    proDisable(index: number, id: number) {
      return !!this.orderInfo.time_data.batch_data[index].product_data.find((item) => item.product_id === id)
    },

    getContacts(ev: number[]) {
      this.orderInfo.contacts_id = ''
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
      const finded = this.confirmSampleInfo.find((item) => item.product_id === product.id)
      if (finded) {
        finded.status = 4
      }
      if (this.quotedPriceProductInfo) {
        // 标记一下报价产品已经转换了，不能二次转换了
        this.quotedPriceProductInfo.has_change = true
        product.quote_product_id = this.quotedPriceProductInfo.id
      }
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
    },
    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.postData.token = this.token
      this.postData.key = Date.parse(new Date() + '') + '.' + fileFormat
      // const isJPG = file.type === 'image/jpeg'
      // const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      // if (!isJPG && !isPNG) {
      //   this.$message.error('图片只能是 JPG/PNG 格式!')
      //   return false
      // }
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 10MB!')
        return false
      }
    },
    successFile(response: { hash: string; key: string }, orderFile: any[]) {
      orderFile.push('https://file.zwyknit.com/' + response.key)
    },
    removeFile(file: { response: { hash: string; key: string } }, orderFile: any[]) {
      this.$deleteItem(orderFile, orderFile.indexOf('https://file.zwyknit.com/' + file.response.key))
    },
    getCmpData() {
      this.orderInfo.pid = Number(this.$route.query.sampleOrderId) ? Number(this.$route.query.sampleOrderId) : null
      this.orderInfo.client_id = this.orderInfo.tree_data!.length > 0 ? (this.orderInfo.tree_data as number[])[2] : ''
      this.orderInfo.tree_data =
        this.orderInfo.tree_data!.length > 0 ? (this.orderInfo.tree_data as number[]).join(',') : ''
      this.orderInfo.time_data.total_style = this.totalStyle
      this.orderInfo.time_data.total_number = this.totalNumber
      this.orderInfo.time_data.total_price = this.totalPrice
      this.orderInfo.time_data.batch_data.forEach((itemBatch) => {
        itemBatch.product_data.forEach((item) => {
          item.product_info.forEach((itemChild) => {
            itemChild.size_id = itemChild.size_color!.length > 0 ? itemChild.size_color!.split('/')[0] : ''
            itemChild.color_id = itemChild.size_color!.length > 0 ? itemChild.size_color!.split('/')[1] : ''
          })
        })
      })
    },
    saveOrder(ifCaogao: boolean) {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      if (ifCaogao) {
        this.orderInfo.is_draft = 1
        this.getCmpData()
        this.saveLock = true
        order.create(this.orderInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('草稿保存成功')
            this.saveSuccess = true // 可以离开了
            this.$router.push('/order/list?page=1&keyword=&client_id=&user_id=&status=null&date=')
          }
          this.saveLock = false
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
          this.saveLock = true
          order.create(this.orderInfo).then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.saveSuccess = true // 可以离开了
              this.$router.push('/order/list?page=1&keyword=&client_id=&user_id=&status=null&date=')
            }
            this.saveLock = false
          })
        } else {
          this.mustFlag = true
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
    // 报价单转订单
    this.getQuotedPrice()
    // 是否样单转订单
    if (this.$route.query.sampleOrderId) {
      this.loading = true
      Promise.all([
        sampleOrder.detail({
          id: Number(this.$route.query.sampleOrderId)
        }),
        sampleOrder.confirmList({
          order_id: Number(this.$route.query.sampleOrderId)
        })
      ]).then((res) => {
        const sampleOrderInfo: SampleOrderDetail = res[0].data.data
        // @ts-ignore
        this.orderInfo.tree_data = sampleOrderInfo.tree_data.split(',').map((item) => Number(item))
        this.getContacts(this.orderInfo.tree_data as number[])
        this.orderInfo.contacts_id = sampleOrderInfo.contacts_id
        this.orderInfo.group_id = sampleOrderInfo.group_id
        this.orderInfo.rel_quote_id = sampleOrderInfo.rel_quote_id
        this.confirmSampleInfo = res[1].data.data.filter((item: any) => item.status === 2)
        this.loading = false
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.saveSuccess) {
      next()
    } else {
      this.$confirm('是否离开添加页面，这会导致已填写的数据丢失', '提示', {
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
@import '~@/assets/css/order/create.less';
</style>
<style lang="less">
#orderCreate {
  .el-input--suffix .el-input__inner {
    padding-right: 0;
  }
  .error {
    .el-input__inner {
      border-color: red !important;
    }
  }
}
</style>