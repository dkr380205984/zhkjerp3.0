<template>
  <div id="accessoriesManageDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
    <div class="module">
      <div class="titleCtn">
        <div class="title">订购单据</div>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="row title">
            <div class="col"
              style="max-width:36px">序号</div>
            <div class="col">订购单号</div>
            <div class="col">订购单位</div>
            <div class="col">订购总数</div>
            <div class="col">订购总价</div>
            <div class="col">审核状态</div>
            <div class="col">结算状态</div>
            <div class="col">订购日期</div>
            <div class="col">交货日期</div>
            <div class="col">创建人</div>
            <div class="col">操作</div>
          </div>
          <div class="rowCtn"
            v-for="(item,index) in materialOrderList"
            :key="index">
            <div class="row"
              @click.prevent="item.show=!item.show;$forceUpdate()">
              <div class="col"
                style="max-width:36px">{{index+1}}</div>
              <div class="col">{{item.code}}</div>
              <div class="col">{{item.client_name}}</div>
              <div class="col">{{$toFixed(item.total_number,3,true)}}</div>
              <div class="col">{{$toFixed(item.total_price,3,true)}}元</div>
              <div class="col"
                :class="item.is_check|filterCheckClass">
                <el-tooltip class="item"
                  effect="dark"
                  :content="item.is_check>=3?'点击查看异常处理办法':'点击查看审核日志'"
                  placement="top">
                  <span style="cursor:pointer"
                    @click="productionPlanIndex=item.id;checkType=4;checkDetailFlag=true;is_check=item.is_check">{{item.is_check|filterCheck}}</span>
                </el-tooltip>
              </div>
              <div class="col"
                :class="{'green':item.has_invoice===1||item.has_pay===1,'gray':item.has_invoice!==1&&item.has_pay!==1}">{{item.has_invoice===1||item.has_pay===1?'已结算':'待结算'}}</div>
              <div class="col">{{item.order_time}}</div>
              <div class="col">{{item.delivery_time}}</div>
              <div class="col">{{item.user_name}}</div>
              <div class="col">
                <div class="opr hoverBlue">{{item.show?'收回':'展开'}}</div>
                <div class="buttonList"
                  style="margin:0;padding:0">
                  <div class="btn hoverBlue"
                    style="padding:0">
                    <span class="text">操作</span>
                  </div>
                  <div class="otherInfoCtn">
                    <div class="otherInfo">
                      <div style="margin-right:12px"
                        class="btn backHoverBlue"
                        @click="goStock([item])">
                        <svg class="iconFont"
                          aria-hidden="true">
                          <use xlink:href="#icon-xiugaidingdan"></use>
                        </svg>
                        <span class="text">订购入库</span>
                      </div>
                      <div style="margin-right:12px"
                        class="btn backHoverOrange"
                        @click="Number($getsessionStorage('has_check'))!==1&&(item.has_invoice===1||item.has_pay===1)?$message.error('单据已结算，无法修改，可联系管理员操作'):materialOrderUpdataInfo=$clone(item);materialOrderUpdataFlag=true">
                        <svg class="iconFont"
                          aria-hidden="true">
                          <use xlink:href="#icon-xiugaidingdan"></use>
                        </svg>
                        <span class="text">单据修改</span>
                      </div>
                      <div class="btn backHoverBlue"
                        @click="$openUrl('/accessoriesManage/print?id='+item.id)">
                        <svg class="iconFont"
                          aria-hidden="true">
                          <use xlink:href="#icon-dayindingdan"></use>
                        </svg>
                        <span class="text">打印订购</span>
                      </div>
                      <div class="btn backHoverRed"
                        @click="Number($getsessionStorage('has_check'))!==1&&(item.has_invoice===1||item.has_pay===1)?$message.error('单据已结算，无法修改，可联系管理员操作'):deleteMaterialOrder(item.id)">
                        <svg class="iconFont"
                          aria-hidden="true">
                          <use xlink:href="#icon-xiugaidingdan"></use>
                        </svg>
                        <span class="text">删除单据</span>
                      </div>
                      <div class="btn backHoverOrange"
                        style="margin-right:12px"
                        @click="checkFlag=true">
                        <svg class="iconFont"
                          aria-hidden="true">
                          <use xlink:href="#icon-xiugaidingdan"></use>
                        </svg>
                        <span class="text">单据审核</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="otherInfo clearfix"
              v-show="item.show">
              <div class="titleCtn">
                <div class="title">基本信息</div>
              </div>
              <div class="editCtn">
                <div class="row">
                  <div class="col">
                    <div class="label">备注信息：</div>
                    <div class="text"
                      :class="{'gray':!item.desc}">{{item.desc || '无'}}</div>
                  </div>
                </div>
              </div>
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcol">计划订购费用</div>
                    <div class="tcol">实际订购费用</div>
                    <div class="tcol">额外费用</div>
                    <div class="tcol">扣款费用</div>
                    <div class="tcol">计划合计费用</div>
                    <div class="tcol">实际合计费用</div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol green">{{$toFixed(item.total_price - item.others_fee)}}元</div>
                  <div class="tcol green">{{item.real_fee}}元</div>
                  <div class="tcol"
                    :class="{'green':item.others_fee>0,'gray':item.others_fee===0}">{{item.others_fee}}元</div>
                  <div class="tcol"
                    :class="{'red':item.deduct_fee>0,'gray':item.deduct_fee===0}">{{item.deduct_fee}}元</div>
                  <div class="tcol green">{{$toFixed(item.total_price - item.deduct_fee)}}元</div>
                  <div class="tcol green">{{$toFixed(item.real_fee + item.others_fee - item.deduct_fee)}}元</div>
                </div>
                <div class="tbody">
                  <div class="trow">
                    <div class="tcol gray">详情见下表</div>
                    <div class="tcol gray">详情见下表</div>
                    <div class="tcol">
                      <others-fee-data :data="item.others_fee_data"></others-fee-data>
                    </div>
                    <div class="tcol">
                      <span style="cursor:pointer"
                        :class="item.deduct_data && item.deduct_data.length>0?'blue':'gray'"
                        @click="getDeduct(item.deduct_data)">扣款费用明细</span>
                    </div>
                    <div class="tcol gray">计划费用</div>
                    <div class="tcol gray">实际费用</div>
                  </div>
                </div>
              </div>
              <div class="titleCtn">
                <div class="title">辅料订购信息</div>
              </div>
              <div class="tableCtn">
                <div class="thead">
                  <div class="trow">
                    <div class="tcol">辅料名称</div>
                    <div class="tcol">物料信息</div>
                    <div class="tcol">订购数量</div>
                    <div class="tcol">订购单价</div>
                    <div class="tcol">订购总价</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.info_data"
                    :key="indexChild">
                    <div class="tcol">{{itemChild.material_name}}</div>
                    <div class="tcol">{{itemChild.attribute}}</div>
                    <div class="tcol">{{$toFixed(itemChild.number,3,true)}}{{itemChild.unit}}</div>
                    <div class="tcol">{{itemChild.price}}元</div>
                    <div class="tcol">{{$toFixed(itemChild.price*itemChild.number,3,true)}}元</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 旧的订购单展示方式 -->
      <!-- <el-tabs type="border-card"
        v-model="materialOrderIndex">
        <el-tab-pane v-for="(item,index) in materialOrderList"
          :key="index"
          :name="item.id.toString()">
          <div slot="label">
            <div style="display:flex;flex-direction:column">
              <div style="line-height:20px;font-size:14px">订购单{{(index+1)}}</div>
              <div style="line-height:20px;font-size:14px">{{item.code}}</div>
            </div>
          </div>
          <div class="titleCtn">
            <div class="title">订购信息</div>
          </div>
          <div class="detailCtn">
            <div class="checkCtn"
              @click="checkDetailFlag=true">
              <el-tooltip class="item"
                effect="dark"
                :content="item.is_check>=3?'点击查看异常处理办法':'点击查看审核日志'"
                placement="bottom">
                <img :src="item.is_check|checkFilter" />
              </el-tooltip>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">单据编号：</div>
                <div class="text">{{item.code}}</div>
              </div>
              <div class="col">
                <div class="label">订购单位：</div>
                <div class="text">{{item.client_name}}</div>
              </div>
              <div class="col">
                <div class="label">下单日期：</div>
                <div class="text">{{item.order_time}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">交货日期：</div>
                <div class="text">{{item.delivery_time}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text">{{item.desc}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            style="padding-top:0">
            <div class="thead">
              <div class="trow">
                <div class="tcol">辅料名称</div>
                <div class="tcol">物料信息</div>
                <div class="tcol">订购数量</div>
                <div class="tcol">订购单价</div>
                <div class="tcol">订购总价</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.info_data"
                :key="indexChild">
                <div class="tcol">{{itemChild.material_name}}</div>
                <div class="tcol">{{itemChild.attribute}}</div>
                <div class="tcol">{{itemChild.number}}{{itemChild.unit}}</div>
                <div class="tcol">{{itemChild.price}}元</div>
                <div class="tcol">{{$toFixed(itemChild.price*itemChild.number,3)}}元</div>
              </div>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">订购单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div style="margin-right:12px"
                  class="btn backHoverBlue"
                  @click="goStock([item])">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">订购入库</span>
                </div>
                <div style="margin-right:12px"
                  class="btn backHoverOrange"
                  @click="Number($getsessionStorage('has_check'))!==1&&(item.has_invoice===1||item.has_pay===1)?$message.error('单据已结算，无法修改，可联系管理员操作'):materialOrderUpdataInfo=$clone(item);materialOrderUpdataFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">单据修改</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$openUrl('/accessoriesManage/print?id='+item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-dayindingdan"></use>
                  </svg>
                  <span class="text">打印订购</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteMaterialOrder(item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">删除单据</span>
                </div>
                <div class="btn backHoverOrange"
                  style="margin-right:12px"
                  @click="checkFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">单据审核</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs> -->
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">出入库单据</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">单据编号</div>
            <div class="tcol">出入库类型</div>
            <div class="tcol">库存转移</div>
            <div class="tcol noPad"
              style="flex:4">
              <div class="trow">
                <div class="tcol">辅料名称</div>
                <div class="tcol">辅料属性</div>
                <div class="tcol">数量</div>
              </div>
            </div>
            <div class="tcol">审核状态</div>
            <div class="tcol">操作人</div>
            <div class="tcol">操作日期</div>
            <div class="tcol"
              style="min-width:112px">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="item in materialStockList"
            :key="item.id">
            <div class="tcol">{{item.code}}</div>
            <div class="tcol"
              :class="item.action_type|materialStockTypeClassFilter">{{item.action_type|materialStockTypeFilter}}</div>
            <div class="tcol">
              <template v-if="item.action_type===1">
                <div class="changeCtn">
                  <span>{{item.client_name}}</span>
                  <span class="el-icon-s-unfold green"></span>
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                </div>
              </template>
              <template v-else-if="item.action_type===2 || item.action_type===4">
                <div class="changeCtn">
                  <span>{{item.client_name}}</span>
                  <span class="el-icon-s-unfold green"></span>
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                </div>
              </template>
              <template v-else-if="item.action_type===3 || item.action_type===5 || item.action_type===10">
                <div class="changeCtn">
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                  <span class="el-icon-s-unfold orange"></span>
                  <span>{{item.client_name}}</span>
                </div>
              </template>
              <template v-else-if="item.action_type===6 || item.action_type===9 || item.action_type===11 || item.action_type===12">
                <div class="changeCtn">
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                </div>
              </template>
              <template v-else-if="item.action_type===7">
                <div class="changeCtn">
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                  <span class="el-icon-s-unfold orange"></span>
                  <span>{{item.move_store}}/{{item.move_secondary_store}}</span>
                </div>
              </template>
              <template v-else-if="item.action_type===8">
                <div class="changeCtn">
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                  <span class="el-icon-s-unfold green"></span>
                  <span>{{item.move_store}}/{{item.move_secondary_store}}</span>
                </div>
              </template>
            </div>
            <div class="tcol noPad"
              style="flex:4">
              <div class="trow"
                v-for="itemChild in item.info_data"
                :key="itemChild.id">
                <div class="tcol">{{itemChild.material_name}}</div>
                <div class="tcol">{{itemChild.attribute}}</div>
                <div class="tcol"
                  :class="itemChild.batch_code||itemChild.vat_code||itemChild.color_code?'':'gray'">{{itemChild.batch_code||'无'}}/{{itemChild.vat_code||'无'}}/{{itemChild.color_code||'无'}}</div>
                <div class="tcol">{{itemChild.number}}{{itemChild.unit || 'kg'}}</div>
              </div>
            </div>
            <div class="tcol"
              :class="item.is_check|filterCheckClass">
              <span>{{item.is_check|filterCheck}}
                <el-tooltip v-if="item.is_check===4"
                  class="item"
                  effect="dark"
                  content="由于【分配数量】超过了【计划数量】的10%。该生产计划单已变为异常状态。以下为异常单据处理办法：1. 检查分配数量。如果分配数量录入错误，您可以修改单据，或删除重新创建。2. 如果录入的数量为实际分配数量，则无需操作，或点击审核通过即可。"
                  placement="top">
                  <i class="el-icon-warning hoverRed"></i>
                </el-tooltip>
              </span>
            </div>
            <div class="tcol">{{item.user_name}}</div>
            <div class="tcol">{{item.created_at.slice(0,10)}}</div>
            <div class="tcol oprCtn"
              style="font-size:12px;min-width:112px">
              <div class="opr hoverGreen"
                @click="materialStockCheckId=item.id;checkFlag=true">审核</div>
              <div class="opr hoverRed"
                @click="deleteMaterialStockList(item.id)">删除</div>
              <div class="opr hoverBlue"
                @click="$openUrl('/store/materialLogPrint?id='+item.id + '&type=' + item.action_type)">打印</div>
            </div>
          </div>
          <div class="trow"
            v-if="materialStockList.length===0">
            <div class="tcol gray"
              style="text-align:center">暂无单据</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 物料订购 -->
    <div class="popup"
      v-show="materialOrderFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">辅料订购/入库</span>
          <div class="closeCtn"
            @click="closeOrder">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <template v-if="step===1">
            <div class="editCtn"
              v-for="(item,index) in materialOrderInfo"
              :key="index">
              <div class="deleteIcon"
                @click="materialOrderInfo.length>1?$deleteItem(materialOrderInfo,index):$message.error('至少有一家订购单位')">
                <i class="el-icon-close"></i>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">订购单位</span>
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
                      content="添加新单位"
                      placement="top">
                      <i class="el-icon-upload hoverOrange fr"
                        style="line-height:38px;font-size:18px;cursor:pointer;"
                        @click="$openUrl('/client/create?type=2')"></i>
                    </el-tooltip>
                  </div>
                  <div class="info elCtn">
                    <el-cascader :class="{'error':mustFlag&&item.client_id_arr.length===0}"
                      placeholder="请选择订购单位"
                      v-model="item.client_id_arr"
                      :options="orderClientList"></el-cascader>
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
                      value-format="yyyy-MM-dd"
                      v-model="item.order_time"></el-date-picker>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">交货日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-date-picker :class="{'error':mustFlag&&!item.delivery_time}"
                      style="width:100%"
                      placeholder="请选择交货日期"
                      value-format="yyyy-MM-dd"
                      v-model="item.delivery_time"></el-date-picker>
                  </div>
                </div>
              </div>
              <div class="row"
                v-for="(itemMat,indexMat) in item.info_data"
                :key="'mat' + indexMat">
                <div class="col">
                  <div class="label"
                    v-if="indexMat===0">
                    <span class="text">物料名称</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select :class="{'error':mustFlag&&!itemMat.material_id}"
                      placeholder="请选择物料名称"
                      v-model="itemMat.material_id"
                      @change="getUnit($event,itemMat)">
                      <el-option v-for="item in decorateMaterialList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexMat===0">
                    <span class="text">物料信息</span>
                    <el-tooltip class="item"
                      effect="dark"
                      content="设置成功后请点击此按钮刷新数据"
                      placement="top">
                      <i class="el-icon-refresh hoverGreen fr"
                        style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                        @click="$checkCommonInfo([{
                          checkWhich: 'api/decorateMaterial',
                          getInfoMethed: 'dispatch',
                          getInfoApi: 'getDecorateMaterialAsync',
                          forceUpdate:true
                        }])"></i>
                    </el-tooltip>
                    <el-tooltip class="item"
                      effect="dark"
                      content="添加新物料"
                      placement="top">
                      <i class="el-icon-upload hoverOrange fr"
                        style="line-height:38px;font-size:18px;cursor:pointer;"
                        @click="$openUrl('/setting/?pName=物料设置&cName=装饰辅料')"></i>
                    </el-tooltip>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="订购颜色、材质、属性或尺寸"
                      v-model="itemMat.attribute">
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label spaceBetween"
                    v-if="indexMat===0">
                    <div class="once">
                      <span class="text">订购单价</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="once">
                      <span class="text">订购数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                  </div>
                  <div class="info elCtn spaceBetween">
                    <el-input :ref="'price'+ '-'+index+'-'+indexMat"
                      :class="{'error':mustFlag&&!itemMat.price}"
                      class="once"
                      placeholder="单价"
                      @keydown.native="$focusByKeydown($event,'price',[index,indexMat],'',['materialOrderInfo','info_data'])"
                      v-model="itemMat.price">
                      <template slot="append">元</template>
                    </el-input>
                    <el-input :ref="'number'+ '-'+index+'-'+indexMat"
                      :class="{'error':mustFlag&&!itemMat.number}"
                      class="once"
                      placeholder="数量"
                      @keydown.native="$focusByKeydown($event,'number',[index,indexMat],'',['materialOrderInfo','info_data'])"
                      v-model="itemMat.number">
                      <template slot="append">{{itemMat.unit}}</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexMat===0"
                  @click="$addItem(item.info_data,{
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
                  @click="$deleteItem(item.info_data,indexMat)">删除</div>
              </div>
              <div class="row"
                v-for="(itemOther,indexOther) in item.others_fee_data"
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
                  @click="$addItem(item.others_fee_data,{
                  desc: '',
                  name: '',
                  price: ''
                })">添加</div>
                <div class="opr hoverRed"
                  v-if="indexOther>0"
                  @click="$deleteItem(item.others_fee_data,indexOther)">删除</div>
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
                    <el-input placeholder="自动计算"
                      v-model="totalOrderPriceList[index]"
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
                      v-model="totalOrderNumberList[index]"
                      disabled>
                      <template slot="append">kg</template>
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn backHoverBlue"
              style="margin-bottom:16px"
              @click="$addItem(materialOrderInfo,{
              material_type: 2,
              order_id: '',
              plan_id: '',
              client_id: '',
              client_id_arr: [],
              order_time:$getDate(new Date()),
              delivery_time: '',
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
            })">添加订购单位</div>
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
                    <el-cascader :class="{'error':mustFlag&&materialStockInfo.tree_data.length===0}"
                      v-model="materialStockInfo.tree_data"
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
              <template v-if="materialStockInfo.action_type===2">
                <div class="row"
                  v-for="(itemMat,indexMat) in materialStockInfo.info_data"
                  :key="indexMat">
                  <div class="col">
                    <div class="label"
                      v-if="indexMat===0">
                      <span class="text">物料名称</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="info elCtn">
                      <el-select :class="{'error':mustFlag&&!itemMat.material_id}"
                        placeholder="请选择物料名称"
                        v-model="itemMat.material_id"
                        @change="getUnit($event,itemMat)">
                        <el-option v-for="item in decorateMaterialList"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="col">
                    <div class="label"
                      v-if="indexMat===0">
                      <span class="text">物料信息</span>
                      <el-tooltip class="item"
                        effect="dark"
                        content="设置成功后请点击此按钮刷新数据"
                        placement="top">
                        <i class="el-icon-refresh hoverGreen fr"
                          style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                          @click="$checkCommonInfo([{
                          checkWhich: 'api/decorateMaterial',
                          getInfoMethed: 'dispatch',
                          getInfoApi: 'getDecorateMaterialAsync',
                          forceUpdate:true
                        }])"></i>
                      </el-tooltip>
                      <el-tooltip class="item"
                        effect="dark"
                        content="添加新物料"
                        placement="top">
                        <i class="el-icon-upload hoverOrange fr"
                          style="line-height:38px;font-size:18px;cursor:pointer;"
                          @click="$openUrl('/setting/?pName=物料设置&cName=装饰辅料')"></i>
                      </el-tooltip>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="订购颜色、材质、属性或尺寸"
                        v-model="itemMat.attribute">
                      </el-input>
                    </div>
                  </div>
                  <div class="col">
                    <div class="label spaceBetween"
                      v-if="indexMat===0">
                      <div class="once">
                        <span class="text">入库数量</span>
                        <span class="explanation">(必填)</span>
                      </div>
                    </div>
                    <div class="info elCtn spaceBetween">
                      <el-input :class="{'error':mustFlag&&!itemMat.number}"
                        class="once"
                        placeholder="数量"
                        v-model="itemMat.number">
                        <template slot="append">{{itemMat.unit}}</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="opr hoverBlue"
                    v-if="indexMat===0"
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
                    v-if="indexMat>0"
                    @click="$deleteItem(materialStockInfo.info_data,index)">删除</div>
                </div>
              </template>
              <template v-else>
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
                      <el-select :class="{'error':mustFlag&&!item.rel_doc_info_id}"
                        placeholder="单据物料"
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
                    <div class="label"
                      v-if="index===0">
                      <span class="text">数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="info elCtn">
                      <el-input :ref="'number'+ '-'+index"
                        :class="{'error':mustFlag&&!item.number}"
                        placeholder="数量"
                        class="UnitCtn"
                        @keydown.native="$focusByKeydown($event,'number',[index],materialStockInfo,['info_data'])"
                        v-model="item.number">
                        <template slot="append">
                          <el-input v-model="item.unit"
                            placeholder="单位"></el-input>
                        </template>
                      </el-input>
                    </div>
                  </div>
                  <div class="col">
                    <div class="label"
                      v-if="index===0">
                      <span class="text">件数</span>
                    </div>
                    <div class="info elCtn">
                      <el-input :ref="'item'+ '-'+index"
                        placeholder="数量"
                        @keydown.native="$focusByKeydown($event,'item',[index],materialStockInfo,['info_data'])"
                        v-model="item.item">
                        <template slot="append">件</template>
                      </el-input>
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
              </template>
              <div class="row">
                <div class="col"
                  style="max-width:322px">
                  <div class="label">
                    <span class="text">入库日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-date-picker :class="{'error':mustFlag&&!materialStockInfo.complete_time}"
                      style="width:100%"
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
            @click="closeOrder">取消</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialOrder(false)"
            v-if="step===1">确认</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialOrder(false,true)"
            v-if="step===1">订购并打印</span>
          <span class="btn backHoverGreen"
            @click="saveMaterialOrder(true)"
            v-if="step===1">订购并入库</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialStock"
            v-if="step===2">确认入库</span>
        </div>
      </div>
    </div>
    <!-- 物料订购单修改 -->
    <div class="popup"
      v-show="materialOrderUpdataFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">修改物料订购单</span>
          <div class="closeCtn"
            @click="materialOrderUpdataFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="description">订购单只能修改原有的单价和数量信息,选错单位或订错原料请删除订购单后重新下单</div>
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">订购单位</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="materialOrderUpdataInfo.client_name"
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
                    value-format="yyyy-MM-dd"
                    v-model="materialOrderUpdataInfo.order_time"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">交货日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    placeholder="请选择交货日期"
                    value-format="yyyy-MM-dd"
                    v-model="materialOrderUpdataInfo.delivery_time"></el-date-picker>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemMat,indexMat) in materialOrderUpdataInfo.info_data"
              :key="'mat' + indexMat">
              <div class="col">
                <div class="label"
                  v-if="indexMat===0">
                  <span class="text">物料名称</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请选择物料名称"
                    v-model="itemMat.material_name"
                    disabled>
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexMat===0">
                  <span class="text">物料信息</span>
                  <span class="explanation"></span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="订购颜色、材质、属性或尺寸"
                    v-model="itemMat.attribute"
                    @focus="$focusInput($event)">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">订购单价</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="once">
                    <span class="text">订购数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input :ref="'price'+ '-'+indexMat"
                    class="once"
                    placeholder="单价"
                    v-model="itemMat.price"
                    @keydown.native="$focusByKeydown($event,'price',[indexMat],materialOrderUpdataInfo,['info_data'])"
                    @focus="$focusInput($event)">
                    <template slot="append">元</template>
                  </el-input>
                  <el-input :ref="'number'+ '-'+indexMat"
                    class="once"
                    placeholder="数量"
                    v-model="itemMat.number"
                    @keydown.native="$focusByKeydown($event,'number',[indexMat],materialOrderUpdataInfo,['info_data'])"
                    @focus="$focusInput($event)">
                    <template slot="append">{{itemMat.unit}}</template>
                  </el-input>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemOther,indexOther) in materialOrderUpdataInfo.others_fee_data"
              :key="'other'+indexOther">
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">额外费用名称</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入额外费用名称"
                    v-model="itemOther.name"
                    @focus="$focusInput($event)"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">额外费用金额</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入额外费用金额"
                    v-model="itemOther.price"
                    @focus="$focusInput($event)">
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
                    v-model="itemOther.desc"
                    @focus="$focusInput($event)"></el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexOther===0"
                @click="$addItem(materialOrderUpdataInfo.others_fee_data,{
                  desc: '',
                  name: '',
                  price: ''
                })">添加</div>
              <div class="opr hoverRed"
                v-if="indexOther>0"
                @click="$deleteItem(materialOrderUpdataInfo.others_fee_data,indexOther)">删除</div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">订购备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入订购备注信息"
                    v-model="materialOrderUpdataInfo.desc"
                    @focus="$focusInput($event)"></el-input>
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
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="materialOrderUpdataFlag = false">取消</span>
          <span class="btn backHoverOrange"
            @click="updataMaterialOrder">确认修改</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <!-- 报价单表格 -->
        <div class="priceCtn fl">
          <div class="btn"
            :class="{'backHoverBlue':priceMaterialList.length>0,'backGray':priceMaterialList.length===0}"
            @click="showPrice=!showPrice">{{priceMaterialList.length>0?(showPrice?'关闭报价':'查看报价'):'暂无报价'}}</div>
          <div class="priceTable"
            v-show="showPrice && priceMaterialList.length>0">
            <div class="module">
              <div class="titleCtn">
                <div class="title">报价信息</div>
              </div>
              <div class="contentCtn">
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">原料名称</div>
                      <div class="tcol">单价</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="(item,index) in priceMaterialList"
                      :key="index">
                      <div class="tcol">{{item.material_name}}</div>
                      <div class="tcol">{{item.price}}元/{{item.unit==='g'?'kg':item.unit}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn">
          <div class="btn backHoverOrange"
            @click="goStock()">客供入库</div>
          <div class="btn backHoverBlue"
            @click="goOrder()">订购辅料</div>
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{materialOrderList.find((item)=>Number(item.id)===Number(materialOrderIndex)).is_check=ev}"
      :show="checkFlag"
      :pid="materialOrderIndex"
      :check_type="18"
      :reason="[]"></zh-check>
    <zh-check-detail :pid="materialOrderIndex"
      :check_type="18"
      :show="checkDetailFlag"
      @close="checkDetailFlag=false"></zh-check-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, materialOrder, materialStock, store, quotedPrice } from '@/assets/js/api'
import { CascaderInfo } from '@/types/vuex'
import { MaterialOrderInfo, MaterialListInfo } from '@/types/materialOrder'
import { yarnAttributeArr, yarnProcessArr } from '@/assets/js/dictionary'
import { MaterialProcessInfo } from '@/types/materialProcess'
import { MaterialStockInfo } from '@/types/materialStock'
import { QuotedPriceInfo } from '@/types/quotedPrice'
export default Vue.extend({
  data(): {
    materialOrderInfo: MaterialOrderInfo[]
    materialOrderList: MaterialOrderInfo[]
    materialOrderUpdataInfo: MaterialOrderInfo
    materialStockInfo: MaterialStockInfo
    [propName: string]: any
  } {
    return {
      checkFlag: false,
      checkDetailFlag: false,
      loading: true,
      saveLock: false,
      mustFlag: false,
      step: 1,
      orderInfo: {
        id: null,
        client_id: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '', // 订单用无用字段
        settle_unit: '', // 订单用无用字段
        order_type: 1,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: '',
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
            batch_data: [
              {
                id: '',
                batch_number: 1,
                batch_title: '',
                batch_type: '',
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
        ]
      },
      materialOrderFlag: false,
      materialOrderUpdataFlag: false,
      yarnAttributeList: yarnAttributeArr,
      materialOrderInfo: [
        {
          total_number: 0,
          total_price: 0,
          material_type: 2,
          order_id: '',
          plan_id: '',
          client_id: '',
          client_id_arr: [],
          order_time: this.$getDate(new Date()),
          delivery_time: '',
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
        }
      ],
      materialOrderIndex: '0',
      materialOrderList: [],
      materialOrderUpdataInfo: {
        material_type: 2,
        order_id: '',
        plan_id: '',
        client_id: '',
        client_id_arr: [],
        total_price: 0,
        total_number: 0,
        order_time: this.$getDate(new Date()),
        delivery_time: '',
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
        material_type: 2,
        action_type: 4, // 采购单最终入库
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
      orderIndex: 0,
      storeList: [],
      showPrice: false,
      materialStockList: [],
      priceMaterialList: [] // 报价单报价信息
    }
  },
  computed: {
    orderClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '装饰辅料单位')
    },
    decorateMaterialList() {
      return this.$store.state.api.decorateMaterial.arr
    },
    totalOrderNumberList(): number[] {
      return this.materialOrderInfo.map((item) => {
        return item.info_data.reduce((total, current) => {
          return total + Number(current.number)
        }, 0)
      })
    },
    totalOrderPriceList(): number[] {
      return this.materialOrderInfo.map((item) => {
        return this.$toFixed(
          item.info_data.reduce((total, current) => {
            return total + Number(current.number) * Number(current.price)
          }, 0) +
            item.others_fee_data.reduce((total, current) => {
              return total + Number(current.price)
            }, 0),
          3
        )
      })
    },
    totalOrderNumber(): number {
      return this.materialOrderUpdataInfo.info_data.reduce((total, current) => {
        return total + Number(current.number)
      }, 0)
    },
    totalOrderPrice(): number {
      return (
        this.materialOrderUpdataInfo.info_data.reduce((total, current) => {
          return total + Number(current.number) * Number(current.price)
        }, 0) +
        this.materialOrderUpdataInfo.others_fee_data.reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
      )
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        materialOrder.list({
          order_id: this.orderInfo.time_data[this.orderIndex].id,
          material_type: 2
        }),
        materialStock.list({
          order_id: this.orderInfo.time_data[this.orderIndex].id,
          material_type: 2
        })
      ]).then((res) => {
        this.loading = false
        this.materialOrderList = res[0].data.data
        if (this.materialOrderList.length > 0) {
          this.materialOrderIndex = this.materialOrderList[0].id!.toString()
        }
        // 算一下乱七八糟一堆费用
        this.materialOrderList.forEach((item) => {
          // @ts-ignore
          item.others_fee = item.others_fee_data.reduce((total, cur) => {
            return total + Number(cur.price)
          }, 0)
          // @ts-ignore
          item.deduct_fee = item.deduct_data.reduce((total, cur) => {
            return total + Number(cur.price)
          }, 0)
          // @ts-ignore
          item.real_fee = this.$toFixed(
            item.info_data.reduce((total, cur) => {
              // @ts-ignore
              return total + Number(cur.final_push_number) * Number(cur.price)
            }, 0)
          )
          item.total_price = this.$toFixed(
            item.info_data.reduce((total, cur) => {
              // @ts-ignore
              return total + Number(cur.number) * Number(cur.price)
            }, 0)
          )
        })
        this.materialStockList = res[1].data.data.filter(
          (item: any) => item.action_type !== 10 && item.action_type !== 12
        )
      })
    },
    getUnit(ev: number, info: any) {
      info.unit = this.decorateMaterialList.find((item: any) => item.id === ev).unit
    },
    closeOrder() {
      this.$confirm('关闭页面会导致已填写的数据丢失，且不会保存，是否确认关闭订购页面?', '提示', {
        confirmButtonText: '确认关闭',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.materialOrderFlag = false
          this.resetOrderMaterial()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭'
          })
        })
    },
    resetOrderMaterial() {
      this.materialOrderInfo = [
        {
          material_type: 2,
          order_id: '',
          plan_id: '',
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
        }
      ]
    },
    getMatOrderCmpData() {
      this.materialOrderInfo.forEach((item, index) => {
        item.total_number = this.totalOrderNumberList[index]
        item.total_price = this.totalOrderPriceList[index]
        item.client_id = item.client_id_arr![2]
        item.order_id = this.orderInfo.time_data[this.orderIndex].id
      })
    },
    saveMaterialOrder(ifStock: boolean, ifPrint?: boolean) {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      const formCheck = this.materialOrderInfo.some((item) => {
        return this.$formCheck(item, [
          {
            key: 'client_id_arr',
            errMsg: '请选择订购单位',
            regNormal: 'checkArr'
          },
          {
            key: 'delivery_time',
            errMsg: '请选择发货日期'
          } ||
            item.info_data.some((itemChild) => {
              return this.$formCheck(itemChild, [
                {
                  key: 'material_id',
                  errMsg: '请选择物料名称'
                },
                {
                  key: 'price',
                  errMsg: '请输入订购单价'
                },
                {
                  key: 'number',
                  errMsg: '请输入订购数量'
                }
              ])
            })
        ])
      })
      if (!formCheck) {
        this.getMatOrderCmpData()
        this.loading = true
        this.saveLock = true
        materialOrder.create({ data: this.materialOrderInfo }).then((res) => {
          if (res.data.status) {
            if (ifStock) {
              this.goStock(res.data.data)
            } else {
              this.$message.success('辅料订购成功')
              this.materialOrderFlag = false
              this.resetOrderMaterial()
              this.init()
              if (ifPrint) {
                res.data.data.forEach((item: any) => {
                  this.$openUrl('/accessoriesManage/print?id=' + item.id)
                })
              }
            }
          }
          this.saveLock = false
          this.mustFlag = false
          this.loading = false
        })
      } else {
        this.mustFlag = true
      }
    },
    goOrder() {
      if (!this.$permissionsFlag('6-1')) {
        return
      }
      this.materialOrderFlag = true
      this.step = 1
    },
    goStock(materialOrderList?: MaterialOrderInfo[]) {
      if (!this.$permissionsFlag('6-1')) {
        return
      }
      if (materialOrderList) {
        materialOrderList.forEach((item) => {
          this.materialStockInfo.rel_doc_code = item.code
          this.materialStockInfo.rel_doc_id = item.id as number
          item.info_data.forEach((itemChild) => {
            this.materialStockInfo.selectList!.push({
              value: itemChild.id as number,
              name: itemChild.material_name + '/' + itemChild.attribute,
              material_color: itemChild.material_color,
              material_id: itemChild.material_id,
              attribute: itemChild.attribute,
              number: itemChild.number,
              unit: itemChild.unit
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
      } else {
        this.materialStockInfo.client_id = this.orderInfo.client_id
        this.materialStockInfo.rel_doc_code = this.orderInfo.code
        this.materialStockInfo.rel_doc_id = Number(this.$route.query.sampleOrderIndex)
        this.materialStockInfo.action_type = 2
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
            rel_doc_info_id: '' // 采购单调取单加工单子项id
          }
        ]
      }
      this.step = 2
      this.materialOrderFlag = true
    },
    saveMaterialStock() {
      const formCheck =
        this.$formCheck(this.materialStockInfo, [
          {
            key: 'tree_data',
            errMsg: '请选择仓库',
            regNormal: 'checkArr'
          }
        ]) ||
        this.materialStockInfo.info_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'material_id',
              errMsg: '请选择物料'
            },
            {
              key: 'number',
              errMsg: '请输入数量'
            }
          ])
        })
      if (!formCheck) {
        this.materialStockInfo.order_id = this.orderInfo.time_data[this.orderIndex].id
        materialStock.create({ data: [this.materialStockInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.step = 1
            this.resetOrderMaterial()
            this.materialOrderFlag = false
            this.init()
            this.mustFlag = false
          }
        })
      } else {
        this.mustFlag = true
      }
    },
    deleteMaterialOrder(id: number) {
      if (!this.$permissionsFlag('6-4')) {
        return
      }
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
    updataMaterialOrder() {
      if (!this.$permissionsFlag('6-2')) {
        return
      }
      const formCheck = this.$formCheck(this.materialOrderUpdataInfo, [
        {
          key: 'delivery_time',
          errMsg: '请选择发货日期'
        } ||
          this.materialOrderUpdataInfo.info_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
              {
                key: 'price',
                errMsg: '请输入订购单价'
              },
              {
                key: 'number',
                errMsg: '请输入订购数量'
              }
            ])
          })
      ])
      if (!formCheck) {
        this.loading = true
        this.materialOrderUpdataInfo.order_id = this.orderInfo.time_data[this.orderIndex].id
        this.materialOrderUpdataInfo.total_number = this.totalOrderNumber
        this.materialOrderUpdataInfo.total_price = this.totalOrderPrice
        // this.materialOrderUpdataInfo.order_id = this.$route.query.id as string
        materialOrder.update(this.materialOrderUpdataInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
            this.materialOrderUpdataFlag = false
            this.init()
          }
        })
      }
    },
    deleteMaterialStockList(id: string) {
      if (!this.$permissionsFlag('6-4')) {
        return
      }
      this.$confirm('是否删除该出入库单据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialStock
            .delete({
              id: id
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
    this.$checkCommonInfo([
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/decorateMaterial',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getDecorateMaterialAsync'
      }
    ])
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          this.orderInfo.time_data.forEach((item: any, index: number) => {
            if (item.id === Number(this.$route.query.sampleOrderIndex)) {
              this.orderIndex = index
            }
          })
          this.init()
          this.loading = false
        }
      })
    store
      .list({
        store_type: 4 // 装饰辅料仓库
      })
      .then((res) => {
        this.storeList = res.data.data.map((item: any) => {
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
      })
    // 优化报价信息
    quotedPrice
      .detailByOrder({
        order_time_id: Number(this.$route.query.sampleOrderIndex)
      })
      .then((res) => {
        if (res.data.status) {
          if (res.data.data.length > 0) {
            res.data.data.forEach((item: QuotedPriceInfo) => {
              item.product_data.forEach((itemPro) => {
                itemPro.assist_material_data.forEach((itemMat) => {
                  this.priceMaterialList.push(itemMat)
                })
              })
            })
          }
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/accessoriesManage/detail.less';
</style>
<style lang="less">
#accessoriesManageDetail {
  .el-tabs__content {
    padding: 0;
  }
  .error {
    .el-input__inner {
      border-color: red !important;
    }
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