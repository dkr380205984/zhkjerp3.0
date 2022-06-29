<template>
  <div class="bodyContainer"
    id="materialManageDetail"
    v-loading="loading">
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">计划原料信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">计划单编号：</div>
            <div class="text">{{materialPlanInfo.code||materialSupplementInfo.code}}</div>
          </div>
          <div class="col">
            <div class="label">关联订单：</div>
            <div class="text">{{materialPlanInfo.order_code||materialSupplementInfo.order_code}}</div>
          </div>
          <div class="col">
            <div class="label">创建人：</div>
            <div class="text">{{materialPlanInfo.user_name||materialSupplementInfo.user_name}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">总计划数：</div>
            <div class="text">{{materialPlanInfo.total_plan_number||materialSupplementInfo.total_plan_number}}</div>
          </div>
          <div class="col">
            <div class="label">总订购数：</div>
            <div class="text">{{materialPlanInfo.total_order_number||materialSupplementInfo.total_order_number}}</div>
          </div>
          <div class="col">
            <div class="label">总加工数：</div>
            <div class="text">{{materialPlanInfo.total_process_number||materialSupplementInfo.total_process_number}}</div>
          </div>
        </div>
        <div class="row"
          v-if="$route.query.supFlag">
          <div class="col">
            <div class="label">补纱原因：</div>
            <div class="text"
              :class="{'gray':!materialSupplementInfo.desc}">{{materialSupplementInfo.desc || '无'}}</div>
          </div>
        </div>
      </div>
      <div class="tableCtn"
        style="padding-top:0">
        <div class="thead">
          <div class="trow">
            <div class="tcol"
              style="flex:0.3">
              <el-checkbox v-model="checkAllPlanFlag">全选</el-checkbox>
            </div>
            <div class="tcol">原料名称</div>
            <div class="tcol">原料颜色</div>
            <div class="tcol">计划数量</div>
            <div class="tcol">采购数量</div>
            <div class="tcol">调取数量</div>
            <div class="tcol">数量差值</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in planMaterialList"
            :key="index">
            <div class="tcol"
              style="flex:0.3">
              <el-checkbox v-model="item.check"
                @change="$forceUpdate()"></el-checkbox>
            </div>
            <div class="tcol">{{item.material_name}}</div>
            <div class="tcol">{{item.material_color}}</div>
            <div class="tcol">{{item.final_number}}{{item.unit}}</div>
            <div class="tcol">{{item.total_order_number}}{{item.unit}}</div>
            <div class="tcol">{{item.total_transfer_number}}{{item.unit}}</div>
            <div class="tcol"
              :class="{
              'red':item.total_order_number+item.total_transfer_number>item.final_number,
              'green':item.total_order_number+item.total_transfer_number===item.final_number,
              'orange':item.total_order_number+item.total_transfer_number<item.final_number
              }">{{(item.total_order_number+item.total_transfer_number>item.final_number?'+':'')+(item.total_order_number+item.total_transfer_number - item.final_number)}}{{item.unit}}</div>
          </div>
        </div>
      </div>
      <div class="buttonList">
        <div style="margin-right:12px"
          class="btn backHoverBlue"
          :class="{'backGray':checkMaterialOrderList().length===0}"
          @click="goOrderMaterial('色纱')">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-xiugaidingdan"></use>
          </svg>
          <span class="text">订购成品</span>
        </div>
        <div style="margin-right:12px"
          class="btn backHoverBlue"
          :class="{'backGray':checkMaterialOrderList().length===0}"
          @click="goOrderMaterial('白胚')">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-xiugaidingdan"></use>
          </svg>
          <span class="text">订购白胚</span>
        </div>
        <div class="btn backHoverOrange"
          :class="{'backGray':checkMaterialOrderList().length===0}"
          @click="goStockMaterial()">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-xiugaidingdan"></use>
          </svg>
          <span class="text">库存调取</span>
        </div>
      </div>
    </div>
    <!-- 订购单列表 -->
    <div class="module"
      v-if="materialOrderList.length>0">
      <el-tabs type="border-card"
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
              @click="checkType=2;checkDetailFlag=true;is_check=item.is_check">
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
                <div class="label">订购总数：</div>
                <div class="text">{{item.total_number}}</div>
              </div>
              <div class="col">
                <div class="label">订购总额：</div>
                <div class="text">{{item.total_price}}元</div>
              </div>
              <div class="col">
                <div class="label">交货日期：</div>
                <div class="text">{{item.delivery_time}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">创建日期：</div>
                <div class="text">{{item.created_at.slice(0,10)}}</div>
              </div>
              <div class="col flex3">
                <div class="label">创建人：</div>
                <div class="text">{{item.user_name}}</div>
              </div>
              <div class="col flex3">
                <div class="label">结算状态：</div>
                <div class="text"
                  :class="{'green':item.has_invoice===1||item.has_pay===1,'gray':item.has_invoice!==1&&item.has_pay!==1}">{{item.has_invoice===1||item.has_pay===1?'已结算':'待结算'}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">额外费用：</div>
                <div class="text">
                  <others-fee-data :data="item.others_fee_data"></others-fee-data>
                </div>
              </div>
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
                <div class="tcol"
                  style="flex:0.3">
                  <el-checkbox v-model="checkAllOrderFlag">全选</el-checkbox>
                </div>
                <div class="tcol">原料名称</div>
                <div class="tcol">订购颜色</div>
                <div class="tcol">{{$route.query.supFlag?'补纱单':'计划单'}}颜色</div>
                <div class="tcol">订购属性</div>
                <div class="tcol">订购数量</div>
                <div class="tcol">订购单价</div>
                <div class="tcol">订购总价</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.info_data"
                :key="indexChild">
                <div class="tcol"
                  style="flex:0.3">
                  <el-checkbox v-model="itemChild.check"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="tcol">{{itemChild.material_name}}</div>
                <div class="tcol">{{itemChild.material_color}}</div>
                <div class="tcol">{{$route.query.supFlag?itemChild.sup_color:itemChild.plan_color}}</div>
                <div class="tcol">{{itemChild.attribute}}</div>
                <div class="tcol">{{itemChild.number}}{{itemChild.unit}}</div>
                <div class="tcol">{{itemChild.price}}元</div>
                <div class="tcol">{{$toFixed(itemChild.price*itemChild.number)}}元</div>
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
                <div class="btn backHoverBlue"
                  @click="goProcessMaterial('订购加工')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">物料加工</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="Number($getsessionStorage('has_check'))!==1&&(item.has_invoice===1||item.has_pay===1)?$message.error('单据已结算，无法修改，可联系管理员操作'):materialOrderUpdataInfo=$clone(item);materialOrderUpdataFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">单据修改</span>
                </div>
                <div class="btn backHoverGreen"
                  @click="goDeduct(item,2)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">单据扣款</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteMaterialOrder(item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">删除单据</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$openUrl('/materialManage/orderPrint?id='+item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-dayindingdan"></use>
                  </svg>
                  <span class="text">打印订购</span>
                </div>
                <div class="btn"
                  :class="item.deduct_data && item.deduct_data.length>0?'backHoverBlue':'backGray'"
                  @click="getDeduct(item.deduct_data)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">扣款记录</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="checkType=2;checkFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shenhedingdan"></use>
                  </svg>
                  <span class="text">单据审核</span>
                </div>
              </div>
            </div>
          </div>
          <div class="titleCtn"
            style="margin-top:32px">
            <div class="title">加工信息</div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">加工单号</div>
                <div class="tcol">加工单位</div>
                <div class="tcol"
                  style="flex:0.5">工序</div>
                <div class="tcol noPad"
                  style="flex:5">
                  <div class="trow">
                    <div class="tcol">纱线名称</div>
                    <div class="tcol">加工详情</div>
                    <div class="tcol"
                      style="flex:0.5">数量</div>
                    <div class="tcol"
                      style="flex:0.5">单价</div>
                    <div class="tcol"
                      style="flex:0.5">小计</div>
                  </div>
                </div>
                <div class="tcol"
                  style="flex:0.8">截止日期</div>
                <div class="tcol">备注信息</div>
                <div class="tcol">额外费用</div>
                <div class="tcol"
                  style="flex:1.3">操作</div>
              </div>
            </div>
            <template v-if="item.process_info.length>0">
              <div class="tbody"
                style="font-size:14px">
                <div class="trow"
                  v-for="itemProcess in item.process_info"
                  :key="itemProcess.id">
                  <div class="tcol">
                    <span class="overText">{{itemProcess.code}}
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'创建日期：'+itemProcess.created_at.slice(0,10) + ';创建人：'+itemProcess.user_name"
                        placement="top">
                        <i class="el-icon-timer hoverBlue"></i>
                      </el-tooltip>
                    </span>
                  </div>
                  <div class="tcol">{{itemProcess.client_name}}</div>
                  <div class="tcol"
                    style="flex:0.5">{{itemProcess.process}}</div>
                  <div class="tcol noPad"
                    style="flex:5">
                    <div class="trow"
                      v-for="(itemMat,indexMat) in itemProcess.info_data"
                      :key="indexMat">
                      <div class="tcol">{{itemMat.material_order_name}}</div>
                      <div class="tcol">
                        <template v-if="itemProcess.process==='染色'">
                          <div class="changeCtn">
                            <span>白胚</span>
                            <span class="el-icon-s-unfold blue"></span>
                            <span>{{itemMat.after_color}}</span>
                          </div>
                        </template>
                        <template v-if="itemProcess.process==='倒纱'">
                          <div class="changeCtn">
                            <span>{{itemMat.before_attribute}}</span>
                            <span class="el-icon-s-unfold blue"></span>
                            <span>{{itemMat.after_attribute}}</span>
                          </div>
                        </template>
                        <template v-if="itemProcess.process==='并线'">
                          <span>{{itemMat.bingxian_desc}}</span>
                        </template>
                        <template v-if="itemProcess.process==='膨纱'">
                          <span>{{itemMat.pengsha_desc}}</span>
                        </template>
                        <template v-if="itemProcess.process==='切割'">
                          <span>{{itemMat.qiege_desc}}</span>
                        </template>
                      </div>
                      <div class="tcol"
                        style="flex:0.5">{{itemMat.number}}{{itemMat.unit}}</div>
                      <div class="tcol"
                        style="flex:0.5">{{itemMat.price}}元</div>
                      <div class="tcol"
                        style="flex:0.5">{{$toFixed(itemMat.price*itemMat.number)}}元</div>
                    </div>
                  </div>
                  <div class="tcol"
                    style="flex:0.8">{{itemProcess.delivery_time}}</div>
                  <div class="tcol">{{itemProcess.desc || '无备注'}}</div>
                  <div class="tcol">
                    <others-fee-data :data="itemProcess.others_fee_data"></others-fee-data>
                  </div>
                  <div class="tcol"
                    style="flex:1.3">
                    <div class="oprCtn">
                      <div class="opr hoverOrange"
                        @click="Number($getsessionStorage('has_check'))!==1&&(itemProcess.has_invoice===1||itemProcess.has_pay===1)?$message.error('单据已结算，无法修改，可联系管理员操作'):goUpdateMaterialProcess(itemProcess);materialProcessUpdataFlag=true">修改</div>
                      <div class="opr hoverGreen"
                        @click="$openUrl('/materialManage/processPrint?id='+itemProcess.id)">打印</div>
                      <div class="opr hoverRed"
                        @click="deleteMaterialProcess(itemProcess.id)">删除</div>
                    </div>
                    <div class="oprCtn">
                      <div class="opr hoverGreen"
                        @click="goDeduct(itemProcess,3)">扣款</div>
                      <div class="opr"
                        :class="itemProcess.deduct_data&&itemProcess.deduct_data.length>0?'hoverBlue':'gray'"
                        @click="getDeduct(itemProcess.deduct_data)">扣款记录</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="tbody">
                <div class="trow">
                  <div class="tcol gray"
                    style="text-align:center">
                    <span>暂无加工信息</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 调取单列表 -->
    <div class="module"
      v-if="materialStockLog.length>0">
      <el-tabs type="border-card"
        v-model="materialStockIndex">
        <el-tab-pane v-for="(item,index) in materialStockLog"
          :key="index"
          :name="item.id.toString()">
          <div slot="label">
            <div style="display:flex;flex-direction:column">
              <div style="line-height:20px;font-size:14px">调取单{{(index+1)}}</div>
              <div style="line-height:20px;font-size:14px">{{item.code}}</div>
            </div>
          </div>
          <div class="titleCtn">
            <div class="title">调取信息</div>
          </div>
          <div class="detailCtn">
            <div class="checkCtn"
              @click="checkType=6;checkDetailFlag=true;is_check=item.is_check">
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
                <div class="label">来源仓库：</div>
                <div class="text">{{item.store}}/{{item.secondary_store}}</div>
              </div>
              <div class="col">
                <div class="col">
                  <div class="label">调取总数：</div>
                  <div class="text">{{item.info_data.reduce((total,cur)=>total+Number(cur.number),0)}}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">创建日期：</div>
                <div class="text">{{item.created_at.slice(0,10)}}</div>
              </div>
              <div class="col flex3">
                <div class="label">创建人：</div>
                <div class="text">{{item.user_name}}</div>
              </div>
              <div class="col">
                <div class="label">调取总价：</div>
                <div class="text">{{item.info_data.reduce((total,cur)=>total+Number(cur.number)*Number(cur.price),0)}}元</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            style="padding-top:0">
            <div class="thead">
              <div class="trow">
                <div class="tcol"
                  style="flex:0.3">
                  <el-checkbox v-model="checkAllStockFlag">全选</el-checkbox>
                </div>
                <div class="tcol">原料名称</div>
                <div class="tcol">调取颜色</div>
                <div class="tcol">调取属性</div>
                <div class="tcol">批号/缸号/色号</div>
                <div class="tcol">调取数量</div>
                <div class="tcol">调取单价</div>
                <div class="tcol">调取总价</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.info_data"
                :key="indexChild">
                <div class="tcol"
                  style="flex:0.3">
                  <el-checkbox v-model="itemChild.check"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="tcol">{{itemChild.material_name}}</div>
                <div class="tcol">{{itemChild.material_color}}</div>
                <div class="tcol">{{itemChild.attribute}}</div>
                <div class="tcol">{{itemChild.batch_code}}/{{itemChild.vat_code}}/{{itemChild.color_code}}</div>
                <div class="tcol">{{itemChild.number}}{{itemChild.unit}}</div>
                <div class="tcol">{{itemChild.price||0}}元</div>
                <div class="tcol">{{$toFixed(itemChild.price*itemChild.number)}}元</div>
              </div>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue"
              style="margin-right:12px"
              @click="goProcessMaterial('调取加工')">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">物料加工</span>
            </div>
            <div class="btn backHoverOrange"
              style="margin-right:12px"
              @click="checkType=6;checkFlag=true">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">单据审核</span>
            </div>
            <div class="btn backHoverRed"
              @click="deleteMaterialStock(item.id)">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">删除单据</span>
            </div>
          </div>
          <div class="titleCtn"
            style="margin-top:32px">
            <div class="title">加工信息</div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">加工单号</div>
                <div class="tcol">加工单位</div>
                <div class="tcol"
                  style="flex:0.5">工序</div>
                <div class="tcol noPad"
                  style="flex:5">
                  <div class="trow">
                    <div class="tcol">纱线名称</div>
                    <div class="tcol">加工详情</div>
                    <div class="tcol"
                      style="flex:0.5">数量</div>
                    <div class="tcol"
                      style="flex:0.5">单价</div>
                    <div class="tcol"
                      style="flex:0.5">小计</div>
                  </div>
                </div>
                <div class="tcol"
                  style="flex:0.8">截止日期</div>
                <div class="tcol">备注信息</div>
                <div class="tcol">额外费用</div>
                <div class="tcol"
                  style="flex:1.3">操作</div>
              </div>
            </div>
            <template v-if="item.process_info.length>0">
              <div class="tbody"
                style="font-size:14px">
                <div class="trow"
                  v-for="itemProcess in item.process_info"
                  :key="itemProcess.id">
                  <div class="tcol"><span class="overText">{{itemProcess.code}}
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'创建日期：'+itemProcess.created_at.slice(0,10) + ';创建人：'+itemProcess.user_name"
                        placement="top">
                        <i class="el-icon-timer hoverBlue"></i>
                      </el-tooltip>
                    </span>
                  </div>
                  <div class="tcol">{{itemProcess.client_name}}</div>
                  <div class="tcol"
                    style="flex:0.5">{{itemProcess.process}}</div>
                  <div class="tcol noPad"
                    style="flex:5">
                    <div class="trow"
                      v-for="(itemMat,indexMat) in itemProcess.info_data"
                      :key="indexMat">
                      <div class="tcol">{{itemMat.material_transfer_name}}</div>
                      <div class="tcol">
                        <template v-if="itemProcess.process==='染色'">
                          <div class="changeCtn">
                            <span>白胚</span>
                            <span class="el-icon-s-unfold blue"></span>
                            <span>{{itemMat.after_color}}</span>
                          </div>
                        </template>
                        <template v-if="itemProcess.process==='倒纱'">
                          <div class="changeCtn">
                            <span>{{itemMat.before_attribute}}</span>
                            <span class="el-icon-s-unfold blue"></span>
                            <span>{{itemMat.after_attribute}}</span>
                          </div>
                        </template>
                        <template v-if="itemProcess.process==='并线'">
                          <span>{{itemMat.bingxian_desc}}</span>
                        </template>
                        <template v-if="itemProcess.process==='膨纱'">
                          <span>{{itemMat.pengsha_desc}}</span>
                        </template>
                        <template v-if="itemProcess.process==='切割'">
                          <span>{{itemMat.qiege_desc}}</span>
                        </template>
                      </div>
                      <div class="tcol"
                        style="flex:0.5">{{itemMat.number}}{{itemMat.unit}}</div>
                      <div class="tcol"
                        style="flex:0.5">{{itemMat.price}}元</div>
                      <div class="tcol"
                        style="flex:0.5">{{$toFixed(itemMat.price*itemMat.number)}}元</div>
                    </div>
                  </div>
                  <div class="tcol"
                    style="flex:0.8">{{itemProcess.delivery_time}}</div>
                  <div class="tcol">{{itemProcess.desc || '无备注'}}</div>
                  <div class="tcol">
                    <others-fee-data :data="itemProcess.others_fee_data"></others-fee-data>
                  </div>
                  <div class="tcol"
                    style="flex:1.3">
                    <div class="oprCtn">
                      <div class="opr hoverOrange"
                        @click="Number($getsessionStorage('has_check'))!==1&&(itemProcess.has_invoice===1||itemProcess.has_pay===1)?$message.error('单据已结算，无法修改，可联系管理员操作'):goUpdateMaterialProcess(itemProcess);materialProcessUpdataFlag=true">修改</div>
                      <div class="opr hoverGreen"
                        @click="$openUrl('/materialManage/processPrint?id='+itemProcess.id)">打印</div>
                      <div class="opr hoverRed"
                        @click="deleteMaterialProcess(itemProcess.id)">删除</div>
                    </div>
                    <div class="oprCtn">
                      <div class="opr hoverGreen"
                        @click="goDeduct(itemProcess,3)">扣款</div>
                      <div class="opr"
                        :class="itemProcess.deduct_data&&itemProcess.deduct_data.length>0?'hoverBlue':'gray'"
                        @click="getDeduct(itemProcess.deduct_data)">扣款记录</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="tbody">
                <div class="trow">
                  <div class="tcol gray"
                    style="text-align:center">
                    <span>暂无加工信息</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 物料订购 -->
    <div class="popup"
      v-if="materialOrderFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">物料订购</span>
          <div class="closeCtn"
            @click="closeOrder">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
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
                  <el-cascader placeholder="请选择订购单位"
                    v-model="item.client_id_arr"
                    :options="orderClientList"
                    @change="getMatAttr($event,item)"></el-cascader>
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
                  <el-date-picker style="width:100%"
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
                  <el-tooltip class="item"
                    effect="dark"
                    content="设置成功后请点击此按钮刷新数据"
                    placement="top">
                    <i class="el-icon-refresh hoverGreen fr"
                      style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                      @click="$checkCommonInfo([{
                        checkWhich: 'api/yarnType',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getYarnTypeAsync',
                        forceUpdate:true
                      }])"></i>
                  </el-tooltip>
                  <el-tooltip class="item"
                    effect="dark"
                    content="添加新原料"
                    placement="top">
                    <i class="el-icon-upload hoverOrange fr"
                      style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                      @click="$openUrl('/setting/?pName=物料设置&cName=纱线原料')"></i>
                  </el-tooltip>
                </div>
                <div class="info elCtn">
                  <el-select placeholder="请选择物料名称"
                    v-model="itemMat.material_id"
                    disabled>
                    <el-option v-for="item in selectMaterialOrderList()"
                      :key="item.material_id"
                      :value="item.material_id"
                      :label="item.material_name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">订购属性</span>
                    <span class="explanation">(选填)</span>
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一属性"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        aria-hidden="true"
                        @click="$copyInfo(item.info_data,['attribute'])">
                        <use xlink:href='#icon-tongbushuju1'></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="once">
                    <span class="text">订购颜色</span>
                    <span class="explanation">(必选)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-autocomplete class="once"
                    @focus="$focusInput($event)"
                    v-model="itemMat.attribute"
                    :fetch-suggestions="searchAttribute"
                    placeholder="物料属性"></el-autocomplete>
                  <template>
                    <el-input class="once"
                      placeholder="白胚"
                      disabled
                      v-model="itemMat.material_color"></el-input>
                  </template>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">订购单价</span>
                    <span class="explanation">(必填)</span>
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一单价"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        aria-hidden="true"
                        @click="$copyInfo(item.info_data,['price'])">
                        <use xlink:href='#icon-tongbushuju1'></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="once">
                    <span class="text">订购数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input :ref="'price'+ '-'+index+'-'+indexMat"
                    class="once"
                    @keydown.native="$focusByKeydown($event,'price',[index,indexMat],'',['materialOrderInfo','info_data'])"
                    @focus="$focusInput($event)"
                    placeholder="单价"
                    v-model="itemMat.price">
                    <template slot="append">元</template>
                  </el-input>
                  <el-input :ref="'number'+ '-'+index+'-'+indexMat"
                    class="once UnitCtn"
                    @keydown.native="$focusByKeydown($event,'number',[index,indexMat],'',['materialOrderInfo','info_data'])"
                    @focus="$focusInput($event)"
                    placeholder="数量"
                    v-model="itemMat.number">
                    <template slot="append">
                      <el-input v-model="itemMat.unit"
                        placeholder="单位"></el-input>
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverRed"
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
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="btn backHoverBlue"
            style="margin-bottom:16px"
            @click="$addItem(materialOrderInfo,{
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
                  material_type:1,
                  material_id: '',
                  material_name: '',
                  material_color: '',
                  attribute: '',
                  price: '',
                  number: '',
                  unit: 'kg'
                }
              ]
            })">添加订购单位</div> -->
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeOrder">取消</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialOrder()">确认</span>
          <span class="btn backHoverOrange"
            @click="saveMaterialOrder(true)">确认并打印</span>
        </div>
      </div>
    </div>
    <!-- 物料调取 -->
    <div class="popup"
      v-if="materialStockFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">物料调取</span>
          <div class="closeCtn"
            @click="closeStock">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="stepCtn">
            <div class="step"
              :class="{'active':step===1}">
              <div class="circle">
                <span class="white">1</span>
              </div>
              <div class="name">选择库存</div>
            </div>
            <div class="step"
              :class="{'active':step===2}">
              <div class="circle">
                <span class="white">2</span>
              </div>
              <div class="name">调取信息</div>
            </div>
          </div>
          <template v-if="step===1">
            <div class="selectCtn">
              <div class="label">已选择物料：</div>
              <div class="boxCtn">
                <div class="box"
                  v-for="item in checkMaterialOrderList()"
                  :key="item.id">{{item.material_name}}/{{item.material_color}}
                  <span class="el-icon-search closeIcon hoverGreen"
                    @click="materialStockFilter.material_name=item.material_name;materialStockFilter.material_color=materialStockFilter.color_flag?'白胚':item.material_color;searchMaterial()"></span>
                </div>
              </div>
            </div>
            <div class="listCtn">
              <div class="filterCtn">
                <div class="elCtn">
                  <el-input placeholder="物料名称"
                    v-model="materialStockFilter.material_name"></el-input>
                </div>
                <div class="elCtn">
                  <el-input placeholder="物料颜色"
                    v-model="materialStockFilter.material_color"></el-input>
                </div>
                <div class="elCtn">
                  <el-input placeholder="批号"
                    v-model="materialStockFilter.batch_code"></el-input>
                </div>
                <div class="elCtn">
                  <el-input placeholder="缸号"
                    v-model="materialStockFilter.vat_code"></el-input>
                </div>
                <div class="elCtn">
                  <el-input placeholder="色号"
                    v-model="materialStockFilter.color_code"></el-input>
                </div>
                <div class="elCtn">
                  <el-cascader placeholder="筛选仓库"
                    v-model="materialStockFilter.store_id_arr"
                    :options="storeList"
                    @change="searchMaterial"></el-cascader>
                </div>
                <el-checkbox v-model="materialStockFilter.color_flag">搜索白胚</el-checkbox>
                <div class="btn backHoverBlue fr"
                  @click="searchMaterial">搜索</div>
              </div>
              <div class="list"
                v-loading="searchLoading">
                <div class="row title">
                  <div class="col">仓库名称</div>
                  <div class="col">物料名称</div>
                  <div class="col">物料颜色</div>
                  <div class="col">物料属性</div>
                  <div class="col">批号/缸号/色号</div>
                  <div class="col">库存数量</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="item in materialStockList"
                  :key="item.id">
                  <div class="col">{{item.store}}/{{item.secondary_store}}</div>
                  <div class="col">{{item.material_name}}</div>
                  <div class="col">{{item.material_color}}</div>
                  <div class="col">{{item.attribute}}</div>
                  <div class="col">{{item.batch_code}}/{{item.vat_code}}/{{item.color_code}}</div>
                  <div class="col">{{item.number}}kg</div>
                  <div class="col">
                    <el-checkbox v-model="item.check"
                      @change="checkMaterialStock($event,item)"></el-checkbox>
                  </div>
                </div>
                <div class="pageCtn">
                  <el-pagination background
                    :page-size="5"
                    layout="prev, pager, next"
                    :total="searchTotal"
                    :current-page.sync="searchPage"
                    @current-change="searchMaterial">
                  </el-pagination>
                </div>
              </div>
            </div>
            <div class="selectCtn">
              <div class="label">计划调取物料：</div>
              <div class="boxCtn">
                <div class="box"
                  v-for="(item,index) in materialStockCheckList"
                  :key="item.id">{{item.material_name}}/{{item.material_color}}/{{item.attribute}}/{{item.batch_code}}/{{item.vat_code}}/{{item.color_code}}
                  <span class="el-icon-circle-close closeIcon hoverRed"
                    @click="$deleteItem(materialStockCheckList,index)"></span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="step===2">
            <div class="editCtn">
              <div class="row"
                v-for="(item,index) in materialStockInfo.info_data"
                :key="index">
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">库存物料</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择库存物料"
                      v-model="item.tree_data"
                      @change="getMatId($event,item)">
                      <el-option v-for="item in materialStockCheckList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.material_name+'/'+item.material_color +'/'+item.attribute +'/'+item.batch_code +'/'+item.vat_code +'/'+item.color_code"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">单据物料</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select :class="{'error':mustFlag&&!item.rel_doc_info_id}"
                      placeholder="请选择单据物料"
                      v-model="item.rel_doc_info_id">
                      <el-option v-for="item in checkMaterialOrderList()"
                        :key="item.id"
                        :value="item.id"
                        :label="item.material_name+'/'+item.material_color"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label spaceBetween"
                    v-if="index===0">
                    <div class="once">
                      <span class="text">调取单价</span>
                      <span class="explanation">(选填)</span>
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一单价"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          style="width:16px;height:16px"
                          aria-hidden="true"
                          @click="$copyInfo(materialStockInfo.info_data,['price']);$forceUpdate()">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="once">
                      <span class="text">调取数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                  </div>
                  <div class="info spaceBetween elCtn">
                    <div class="once">
                      <el-input :ref="'price'+ '-'+index"
                        :class="{'error':mustFlag&&!item.price}"
                        placeholder="调取单价"
                        @keydown.native="$focusByKeydown($event,'price',[index],materialStockInfo,['info_data'])"
                        v-model="item.price">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                    <div class="once UnitCtn">
                      <el-input :ref="'number'+ '-'+index"
                        :class="{'error':mustFlag&&!item.number}"
                        placeholder="调取数量"
                        @keydown.native="$focusByKeydown($event,'number',[index],materialStockInfo,['info_data'])"
                        v-model="item.number">
                        <template slot="append">
                          <el-input v-model="item.unit"
                            placeholder="单位"></el-input>
                        </template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  @click="$addItem(materialStockInfo.info_data,{
                    material_id: '',
                    material_color: '',
                    color_code: '',
                    batch_code: '',
                    vat_code: '',
                    attribute: '',
                    number: item.final_number,
                    item: '', // 件数
                    unit: 'kg',
                    rel_doc_info_id: '' // 采购单调取单加工单子项id
                })">添加</div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">调取总价</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="调取总价"
                      disabled
                      v-model="totalStockPrice">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">调取总数</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="调取总数"
                      disabled
                      v-model="totalStockNumber">
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">备注信息</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="备注信息"
                      v-model="materialStockInfo.desc">
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeStock">取消</span>
          <span class="btn backHoverBlue"
            @click="goCheckRealStock"
            v-if="step===1">填写实际调取值</span>
          <span class="btn backHoverOrange"
            @click="step=1"
            v-if="step===2">上一步</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialStock"
            v-if="step===2">确认调取</span>
        </div>
      </div>
    </div>
    <!-- 物料加工 -->
    <div class="popup"
      v-if="materialProcessFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">物料加工</span>
          <div class="closeCtn"
            @click="closeProcess">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn"
            v-for="(item,index) in materialProcessInfo"
            :key="index">
            <div class="deleteIcon"
              @click="materialProcessInfo.length>1?$deleteItem(materialProcessInfo,index):$message.error('至少有一家加工单位')">
              <i class="el-icon-close"></i>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">加工单位</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-cascader :class="{'error':mustFlag&&item.client_id_arr.length===0}"
                    placeholder="请选择加工单位"
                    v-model="item.client_id_arr"
                    :options="prcessClientList"></el-cascader>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">加工工序</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select :class="{'error':mustFlag&&item.process}"
                    v-model="item.process"
                    placeholder="选择加工工序"
                    @change="getProcess($event,item)">
                    <el-option v-for="item in yarnProcessList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween">
                  <div class="once">
                    <span class="text">下单日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="once">
                    <span class="text">交货日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-date-picker style="width:100%"
                    class="once"
                    placeholder="下单日期"
                    value-format="yyyy-MM-dd"
                    v-model="item.order_time"></el-date-picker>
                  <el-date-picker :class="{'error':mustFlag&&item.delivery_time}"
                    style="width:100%"
                    class="once"
                    placeholder="交货日期"
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
                  <span class="text">物料信息</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select v-if="materialProcessFlag==='订购加工'"
                    placeholder="请选择订购物料"
                    v-model="itemMat.material_order_info_id"
                    @change="getAfterColor($event,itemMat,'订购加工')"
                    :class="{'error':mustFlag&&!itemMat.material_order_info_id}">
                    <el-option v-for="item in checkMaterialProcessList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.material_name + '/' + item.material_color + '(' +(item.plan_color||item.sup_color) + ')/' + item.attribute"></el-option>
                  </el-select>
                  <el-select v-if="materialProcessFlag==='调取加工'"
                    placeholder="请选择调取物料"
                    v-model="itemMat.material_transfer_info_id"
                    @change="getAfterColor($event,itemMat,'调取加工')"
                    :class="{'error':mustFlag&&!itemMat.material_transfer_info_id}">
                    <el-option v-for="item in checkMaterialStockList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.material_name + '/' + item.material_color+'(' +(item.plan_color||item.sup_color) + ')/' + item.attribute"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <template v-if="!item.process">
                    <div class="once">
                      <span class="text">加工详情</span>
                      <span class="explanation">(请先选择加工工序)</span>
                    </div>
                  </template>
                  <template v-if="item.process==='染色'">
                    <div class="once">
                      <span class="text">加工前</span>
                      <span class="explanation">(默认)</span>
                    </div>
                    <div class="once">
                      <span class="text">加工后</span>
                      <span class="explanation">(必选)</span>
                    </div>
                  </template>
                  <template v-if="item.process==='倒纱'">
                    <div class="once">
                      <span class="text">加工前</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="once">
                      <span class="text">加工后</span>
                      <span class="explanation">(必选)</span>
                    </div>
                  </template>
                  <template v-if="item.process==='膨纱'">
                    <div class="once">
                      <span class="text">膨纱要求</span>
                    </div>
                  </template>
                  <template v-if="item.process==='并线'">
                    <div class="once">
                      <span class="text">并线描述</span>
                    </div>
                  </template>
                  <template v-if="item.process==='切割'">
                    <div class="once">
                      <span class="text">切割描述</span>
                    </div>
                  </template>
                </div>
                <div class="info elCtn spaceBetween">
                  <template v-if="!item.process">
                    <el-input v-model="item.process"
                      disabled
                      placeholder="请先选择加工工序"></el-input>
                  </template>
                  <template v-if="item.process==='染色'">
                    <el-input class="once"
                      placeholder="白胚"
                      disabled>
                    </el-input>
                    <el-autocomplete class="once"
                      v-model="itemMat.after_color"
                      :fetch-suggestions="searchColor"
                      placeholder="物料颜色"
                      disabled></el-autocomplete>
                  </template>
                  <template v-if="item.process==='倒纱'">
                    <el-autocomplete class="once"
                      v-model="itemMat.before_attribute"
                      :fetch-suggestions="searchAttribute"
                      placeholder="物料属性"
                      @select="getProcessAttribute($event,itemMat)"></el-autocomplete>
                    <el-autocomplete class="once"
                      v-model="itemMat.after_attribute"
                      :fetch-suggestions="searchAttribute"
                      placeholder="物料属性"></el-autocomplete>
                  </template>
                  <template v-if="item.process==='膨纱'">
                    <el-input class="once"
                      placeholder="请输入膨纱要求"
                      v-model="itemMat.pengsha_desc">
                    </el-input>
                  </template>
                  <template v-if="item.process==='并线'">
                    <el-input class="once"
                      placeholder="请输入并线描述"
                      v-model="itemMat.bingxian_desc">
                    </el-input>
                  </template>
                  <template v-if="item.process==='切割'">
                    <el-input class="once"
                      placeholder="请输入切割描述"
                      v-model="itemMat.qiege_desc">
                    </el-input>
                  </template>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">加工单价</span>
                    <span class="explanation">(必填)</span>
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一单价"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        aria-hidden="true"
                        @click="$copyInfo(item.info_data,['price'])">
                        <use xlink:href='#icon-tongbushuju1'></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="once">
                    <span class="text">加工数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input :ref="'price'+ '-'+index+'-'+indexMat"
                    :class="{'error':mustFlag&&!itemMat.price}"
                    class="once"
                    placeholder="单价"
                    v-model="itemMat.price"
                    @focus="$focusInput($event)"
                    @keydown.native="$focusByKeydown($event,'price',[index,indexMat],'',['materialProcessInfo','info_data'])">
                    <template slot="append">元</template>
                  </el-input>
                  <el-input :ref="'number'+ '-'+index+'-'+indexMat"
                    :class="{'error':mustFlag&&!itemMat.number}"
                    class="once UnitCtn"
                    placeholder="数量"
                    v-model="itemMat.number"
                    @focus="$focusInput($event)"
                    @keydown.native="$focusByKeydown($event,'number',[index,indexMat],'',['materialProcessInfo','info_data'])">
                    <template slot="append">
                      <el-input v-model="itemMat.unit"
                        placeholder="单位"></el-input>
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexMat===0"
                @click="$addItem(item.info_data,{
                  material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
                  material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
                  before_attribute: '', // 原属性
                  after_attribute: '',
                  before_color: null,
                  after_color: '', // 加工后颜色
                  price: '',
                  number: '',
                  unit: 'kg',
                  pengsha_desc: '', // 膨纱要求
                  qiege_desc: '', // 切割要求
                  bingxian_desc: '' // 并线要求
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
                    v-model="totalProcessPriceList[index]"
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
                    v-model="totalProcessNumberList[index]"
                    disabled>
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="btn backHoverBlue"
            style="margin-bottom:16px"
            @click="$addItem(materialProcessInfo,{
              order_id: '',
              plan_id: '',
              process: '',
              material_order_id: '',
              material_transfer_id: '',
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
                  material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
                  material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
                  before_attribute: '', // 原属性
                  after_attribute: '',
                  after_color: '', // 加工后颜色
                  price: '',
                  number: '',
                  unit: 'kg',
                  pengsha_desc: '', // 膨纱要求
                  qiege_desc: '', // 切割要求
                  bingxian_desc: '' // 并线要求
                }
              ]
            })">添加加工单位</div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeProcess">取消</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialProcess()">确认</span>
          <span class="btn backHoverOrange"
            @click="saveMaterialProcess(true)">确认并打印</span>
        </div>
      </div>
    </div>
    <!-- 物料订购单修改 -->
    <div class="popup"
      v-if="materialOrderUpdataFlag">
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
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">订购属性</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="once">
                    <span class="text">订购颜色</span>
                    <span class="explanation">(默认)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-autocomplete class="once"
                    v-model="itemMat.attribute"
                    :fetch-suggestions="searchAttribute"
                    disabled
                    placeholder="物料属性"></el-autocomplete>
                  <template>
                    <el-input class="once"
                      v-model="itemMat.material_color"
                      placeholder="颜色"
                      disabled></el-input>
                    <!-- <el-autocomplete v-else
                      class="once"
                      v-model="itemMat.material_color"
                      :fetch-suggestions="searchColor"
                      placeholder="物料颜色"></el-autocomplete> -->
                  </template>
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
                    @keydown.native="$focusByKeydown($event,'price',[indexMat],materialOrderUpdataInfo,['info_data'])"
                    @focus="$focusInput($event)"
                    placeholder="单价"
                    v-model="itemMat.price">
                    <template slot="append">元</template>
                  </el-input>
                  <el-input :ref="'number'+ '-'+indexMat"
                    class="once UnitCtn"
                    @keydown.native="$focusByKeydown($event,'number',[indexMat],materialOrderUpdataInfo,['info_data'])"
                    @focus="$focusInput($event)"
                    placeholder="数量"
                    v-model="itemMat.number">
                    <template slot="append">
                      <el-input v-model="itemMat.unit"
                        placeholder="单位"></el-input>
                    </template>
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
            @click="updateMaterialOrder">确认修改</span>
        </div>
      </div>
    </div>
    <!-- 物料加工单修改 -->
    <div class="popup"
      v-show="materialProcessUpdataFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">修改物料加工单</span>
          <div class="closeCtn"
            @click="materialProcessUpdataFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">加工单位</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-cascader placeholder="请选择加工单位"
                    v-model="materialProcessUpdataInfo.client_id_arr"
                    :options="prcessClientList"></el-cascader>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">加工工序</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="materialProcessUpdataInfo.process"
                    placeholder="选择加工工序">
                    <el-option v-for="item in yarnProcessList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween">
                  <div class="once">
                    <span class="text">下单日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="once">
                    <span class="text">交货日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-date-picker style="width:100%"
                    class="once"
                    placeholder="下单日期"
                    value-format="yyyy-MM-dd"
                    v-model="materialProcessUpdataInfo.order_time"></el-date-picker>
                  <el-date-picker style="width:100%"
                    class="once"
                    placeholder="交货日期"
                    value-format="yyyy-MM-dd"
                    v-model="materialProcessUpdataInfo.delivery_time"></el-date-picker>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemMat,indexMat) in materialProcessUpdataInfo.info_data"
              :key="'mat' + indexMat">
              <div class="col">
                <div class="label"
                  v-if="indexMat===0">
                  <span class="text">物料名称</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input v-if="itemMat.material_order_name"
                    placeholder="请选择订购物料"
                    v-model="itemMat.material_order_name"
                    disabled>
                  </el-input>
                  <el-input v-else
                    placeholder="请选择订购物料"
                    v-model="itemMat.material_transfer_name"
                    disabled>
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <template v-if="!materialProcessUpdataInfo.process">
                    <div class="once">
                      <span class="text">加工详情</span>
                      <span class="explanation">(请先选择加工工序)</span>
                    </div>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='染色'">
                    <div class="once">
                      <span class="text">加工前</span>
                      <span class="explanation">(默认)</span>
                    </div>
                    <div class="once">
                      <span class="text">加工后</span>
                      <span class="explanation">(必选)</span>
                    </div>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='倒纱'">
                    <div class="once">
                      <span class="text">加工前</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="once">
                      <span class="text">加工后</span>
                      <span class="explanation">(必选)</span>
                    </div>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='膨纱'">
                    <div class="once">
                      <span class="text">膨纱要求</span>
                    </div>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='并线'">
                    <div class="once">
                      <span class="text">并线描述</span>
                    </div>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='切割'">
                    <div class="once">
                      <span class="text">切割描述</span>
                    </div>
                  </template>
                </div>
                <div class="info elCtn spaceBetween">
                  <template v-if="!materialProcessUpdataInfo.process">
                    <el-input v-model="materialProcessUpdataInfo.process"
                      disabled
                      placeholder="请先选择加工工序"></el-input>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='染色'">
                    <el-input class="once"
                      placeholder="白胚"
                      disabled>
                    </el-input>
                    <el-autocomplete class="once"
                      v-model="itemMat.after_color"
                      :fetch-suggestions="searchColor"
                      placeholder="物料颜色"
                      disabled></el-autocomplete>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='倒纱'">
                    <el-autocomplete class="once"
                      v-model="itemMat.before_attribute"
                      :fetch-suggestions="searchAttribute"
                      placeholder="物料属性"
                      @focus="$focusInput($event)"></el-autocomplete>
                    <el-autocomplete class="once"
                      v-model="itemMat.after_attribute"
                      :fetch-suggestions="searchAttribute"
                      placeholder="物料属性"
                      @focus="$focusInput($event)"></el-autocomplete>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='膨纱'">
                    <el-input class="once"
                      placeholder="请输入膨纱要求"
                      v-model="itemMat.pengsha_desc"
                      @focus="$focusInput($event)">
                    </el-input>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='并线'">
                    <el-input class="once"
                      placeholder="请输入并线描述"
                      v-model="itemMat.bingxian_desc"
                      @focus="$focusInput($event)">
                    </el-input>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='切割'">
                    <el-input class="once"
                      placeholder="请输入切割描述"
                      v-model="itemMat.qiege_desc"
                      @focus="$focusInput($event)">
                    </el-input>
                  </template>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">加工单价</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="once">
                    <span class="text">加工数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once"
                    placeholder="单价"
                    v-model="itemMat.price"
                    @focus="$focusInput($event)">
                    <template slot="append">元</template>
                  </el-input>
                  <el-input class="once"
                    placeholder="数量"
                    v-model="itemMat.number"
                    @focus="$focusInput($event)">
                    <template slot="append">{{itemMat.unit}}</template>
                  </el-input>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemOther,indexOther) in materialProcessUpdataInfo.others_fee_data"
              :key="'other'+indexOther">
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">额外费用名称</span>
                </div>
                <div class="info elCtn">
                  <el-input @focus="$focusInput($event)"
                    placeholder="请输入额外费用名称"
                    v-model="itemOther.name"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">额外费用金额</span>
                </div>
                <div class="info elCtn">
                  <el-input @focus="$focusInput($event)"
                    placeholder="请输入额外费用金额"
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
                  <el-input @focus="$focusInput($event)"
                    placeholder="请输入额外费用备注"
                    v-model="itemOther.desc"></el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexOther===0"
                @click="$addItem(materialProcessUpdataInfo.others_fee_data,{
                  desc: '',
                  name: '',
                  price: ''
                })">添加</div>
              <div class="opr hoverRed"
                v-if="indexOther>0"
                @click="$deleteItem(materialProcessUpdataInfo.others_fee_data,indexOther)">删除</div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">订购备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input @focus="$focusInput($event)"
                    placeholder="请输入订购备注信息"
                    v-model="materialProcessUpdataInfo.desc"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">订购总价</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="自动计算"
                    v-model="totalProcessPrice"
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
                    v-model="totalProcessNumber"
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
            @click="materialProcessUpdataFlag = false">取消</span>
          <span class="btn backHoverOrange"
            @click="updataMaterialProcess">确认修改</span>
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
        <div class="btnCtn"
          style="float:left">
          <div class="btn backHoverGreen"
            @click="showAssociatedPage=true">
            <span class="text">关联页面</span>
          </div>
        </div>
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
      :order_id="$route.query.supFlag?materialSupplementInfo.top_order_id:materialPlanInfo.top_order_id"
      :client_id="deductInfo.client_id"
      :client_name="deductInfo.client_name"></zh-deduct>
    <zh-deduct-detail :show="deductDetailFlag"
      @close="deductDetailFlag = false"
      :data="deductDetail"></zh-deduct-detail>
    <associated-page :data="associatedPage"
      :nowPage="true"
      @close="showAssociatedPage = false"
      :show="showAssociatedPage"></associated-page>
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{checkType===2?(materialOrderList.find((item)=>Number(item.id)===Number(materialOrderIndex)).is_check=ev):(materialStockLog.find((item)=>Number(item.id)===Number(materialStockIndex)).is_check=ev)}"
      :show="checkFlag"
      :pid="checkType===2?materialOrderIndex:materialStockIndex"
      :check_type="checkType"
      :reason="[]"></zh-check>
    <zh-check-detail :pid="checkType===2?materialOrderIndex:materialStockIndex"
      :check_type="checkType"
      :show="checkDetailFlag"
      :is_check="is_check"
      :errMsg="checkType===2?[
      '情况一：由于【计划原料数量】发生了修改。该原料采购单已变为异常状态。以下为异常单据处理办法：',
      '1. 修改此原料订购单，同步最新的原料数量。注意：已采购的原料不能删除，但可以将数量改为0。实际已入库的原料，可以在原料出入库页面进行结余操作。',
      '2. 如果该单据没有后续加工单、入库单，您也可以删除该单据再新建一张。',
      '3. 如果您不想修改原料订购单，您也可以直接点击审核通过，并新建一张原料订购单，以补充新的订购数量。',
      '情况二：提交超出数量，导致单据异常。以下为异常单据处理办法：',
      '1. 检查订购数量，如果数量录入错误，您可以修改单据，或删除重新创建。',
      '2. 如果录入的数量为实际订购数量，则无需操作，或点击审核通过即可。'
      ]:[
      '情况一：由于【计划单数量】发生了修改。该原料调取单已变为异常状态。以下为异常单据处理办法：',
      '1. 如果该单据没有后续入库单，您也可以删除该单据再新建一张。',
      '2. 如果该单据有后续入库单，您也可以直接点击审核通过，实际已入库的原料，可以在原料出入库页面进行结余操作。',
      '情况二：提交超出数量，导致单据异常。以下为异常单据处理办法：',
      '1. 检查调取数量，如果数量录入错误，您可以修改单据，或删除重新创建。',
      '2. 如果录入的数量为实际调取数量，则无需操作，或点击审核通过即可。'
      ]"
      @close="checkDetailFlag=false"></zh-check-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MaterialOrderInfo, MaterialListInfo } from '@/types/materialOrder'
import { MaterialProcessInfo } from '@/types/materialProcess'
import { MaterialPlanInfo, MaterialPlanGatherData } from '@/types/materialPlan'
import {
  materialPlan,
  materialOrder,
  materialProcess,
  store,
  materialStock,
  materialSupplement,
  quotedPrice,
  checkBeyond
} from '@/assets/js/api'
import { CascaderInfo } from '@/types/vuex'
import { yarnAttributeArr, yarnProcessArr } from '@/assets/js/dictionary'
import { MaterialStockInfo } from '@/types/materialStock'
import { MaterialSupplementInfo } from '@/types/materialSupplement'
import { QuotedPriceInfo } from '@/types/quotedPrice'
export default Vue.extend({
  data(): {
    materialSupplementInfo: MaterialSupplementInfo
    materialPlanInfo: MaterialPlanInfo
    materialOrderInfo: MaterialOrderInfo[]
    materialOrderUpdataInfo: MaterialOrderInfo
    materialProcessInfo: MaterialProcessInfo[]
    materialProcessUpdataInfo: MaterialProcessInfo
    materialProcessList: MaterialProcessInfo[]
    materialOrderList: MaterialOrderInfo[]
    materialStockInfo: MaterialStockInfo
    materialStockLog: MaterialStockInfo[]
    [propName: string]: any
  } {
    return {
      checkFlag: false,
      checkDetailFlag: false,
      is_check: 0,
      checkType: 2, // 标记审核订购单还是调取单
      loading: true,
      saveLock: false,
      mustFlag: false,
      showAssociatedPage: false,
      materialOrderFlag: false,
      materialStockFlag: false,
      step: 1,
      materialProcessFlag: false,
      checkAllPlanFlag: false,
      checkAllOrderFlag: false,
      checkAllStockFlag: false,
      materialOrderUpdataFlag: false,
      materialProcessUpdataFlag: false,
      deductFlag: false,
      deductDetailFlag: false,
      deductDetail: [],
      deductInfo: {
        client_id: '',
        client_name: '',
        doc_id: '',
        type: 2
      },
      searchLoading: false,
      storeList: [],
      materialSupplementInfo: {
        order_id: '',
        rel_doc_id: '',
        client_id: '',
        client_name: '',
        client_data: [
          {
            bear_client_id: '',
            bear_price: ''
          }
        ],
        desc: '',
        info_data: [
          {
            id: '',
            tree_data: [],
            material_id: '',
            material_color: '',
            material_type: 1,
            number: '',
            unit: ''
          }
        ]
      },
      materialPlanInfo: {
        order_id: '',
        type: '1', // 1、按颜色尺码 2.按产品
        desc: '',
        is_draft: 2,
        production_plan_data: [],
        material_plan_data: [],
        material_plan_gather_data: []
      },
      searchPage: 1,
      searchTotal: 1,
      materialOrderInfo: [
        {
          material_type: 1,
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
      ],
      materialOrderUpdataInfo: {
        material_type: 1,
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
      },
      materialOrderList: [],
      materialStockFilter: {
        material_id: '',
        material_name: '',
        store_id_arr: [],
        store_id: '',
        second_store_id: '',
        vat_code: '',
        batch_code: '',
        color_code: '',
        material_color: '白胚',
        color_flag: true
      },
      materialStockInfo: {
        material_type: 1,
        action_type: 10, // 仓库出库绑定订单
        rel_doc_type: '',
        rel_doc_id: '',
        rel_doc_code: '',
        complete_time: this.$getDate(new Date()),
        client_id: '',
        desc: '',
        store_id: '',
        secondary_store_id: '',
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
        ],
        selectList: []
      },
      materialStockArr: [],
      materialStockCheckList: [],
      materialStockLog: [],
      materialProcessInfo: [
        {
          order_id: '',
          plan_id: '',
          process: '',
          material_order_id: '',
          material_transfer_id: '',
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
              material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
              material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
              before_attribute: '', // 原属性
              after_attribute: '',
              after_color: '', // 加工后颜色
              price: '',
              number: '',
              unit: 'kg',
              pengsha_desc: '', // 膨纱要求
              qiege_desc: '', // 切割要求
              bingxian_desc: '' // 并线要求
            }
          ]
        }
      ],
      materialProcessUpdataInfo: {
        order_id: '',
        plan_id: '',
        process: '',
        material_order_id: '',
        material_transfer_id: '',
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
            material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
            material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
            before_attribute: '', // 原属性
            after_attribute: '',
            after_color: '', // 加工后颜色
            price: '',
            number: '',
            unit: 'kg',
            pengsha_desc: '', // 膨纱要求
            qiege_desc: '', // 切割要求
            bingxian_desc: '' // 并线要求
          }
        ]
      },
      materialProcessList: [],
      materialOrderIndex: '0', // el-tab-pane组件需要字符串
      materialStockIndex: '0',
      yarnAttributeList: yarnAttributeArr,
      yarnProcessList: yarnProcessArr,
      showPrice: false,
      priceMaterialList: [] // 报价单报价信息
    }
  },
  methods: {
    // 选取物料本来应该在computed里面，因为不触发更新拿到methods里每次获取强致重新计算
    checkMaterialOrderList(): MaterialPlanGatherData[] {
      return this.planMaterialList.filter((item) => item.check)
    },
    // 同理监听不到放在methods里
    selectMaterialOrderList(): any[] {
      return this.$mergeData(this.checkMaterialOrderList(), {
        mainRule: ['material_id'],
        otherRule: [{ name: 'material_name' }]
      })
    },
    // 初始化函数没有拿加工信息，是因为所有采购和加工信息都放在采购单列表里了
    init() {
      const api = this.$route.query.supFlag ? materialSupplement : materialPlan
      this.loading = true
      Promise.all([
        api.detail({
          id: Number(this.$route.query.id)
        }),
        materialOrder.list({
          plan_id: this.$route.query.supFlag ? '' : Number(this.$route.query.id),
          sup_id: this.$route.query.supFlag ? Number(this.$route.query.id) : ''
        }),
        materialStock.list({
          action_type: this.$route.query.supFlag ? 12 : 10,
          rel_doc_id: Number(this.$route.query.id)
        })
      ]).then((res) => {
        if (this.$route.query.supFlag) {
          this.materialSupplementInfo = res[0].data.data
        } else {
          this.materialPlanInfo = res[0].data.data
        }
        this.materialOrderList = res[1].data.data
        if (this.materialOrderList.length > 0) {
          this.materialOrderIndex = this.materialOrderList[0].id!.toString()
        }
        this.materialStockLog = res[2].data.data
        if (this.materialStockLog.length > 0) {
          this.materialStockIndex = this.materialStockLog[0].id!.toString()
        }
        this.loading = false

        // 优化报价信息
        this.priceMaterialList = []
        quotedPrice
          .detailByOrder({
            order_time_id: this.$route.query.supFlag
              ? this.materialSupplementInfo.order_id
              : this.materialPlanInfo.order_id
          })
          .then((res) => {
            if (res.data.status) {
              if (res.data.data.length > 0) {
                res.data.data.forEach((item: QuotedPriceInfo) => {
                  item.product_data.forEach((itemPro) => {
                    itemPro.material_data.forEach((itemMat) => {
                      this.priceMaterialList.push(itemMat)
                    })
                  })
                })
              }
            }
          })
      })
    },
    // 原料颜色搜索
    searchColor(str: string, cb: any) {
      let results = str
        ? this.planMaterialList
            .map((item) => {
              return {
                value: item.material_color
              }
            })
            .filter(this.createFilter(str))
        : this.planMaterialList.map((item) => {
            return {
              value: item.material_color
            }
          })
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 原料属性搜索
    searchAttribute(str: string, cb: any) {
      let results = str ? this.yarnAttributeList.filter(this.createFilter(str)) : this.yarnAttributeList.slice(0, 10)
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    // 加工工序优化
    getProcess(ev: string, info: MaterialProcessInfo) {
      if (ev === '染色') {
        // 染色逻辑已经写死了，只能染成计划单颜色
      } else if (ev === '倒纱') {
        info.info_data.forEach((item) => {
          if (item.before_attribute === '筒纱') {
            item.after_attribute = '绞纱'
          } else if (item.before_attribute === '绞纱') {
            item.after_attribute = '筒纱'
          }
        })
      }
    },
    getProcessAttribute(str: any, info: any) {
      if (str.value === '筒纱') {
        info.after_attribute = '绞纱'
      } else if (str.value === '绞纱') {
        info.after_attribute = '筒纱'
      }
    },
    goOrderMaterial(type: '白胚' | '色纱') {
      if (this.checkMaterialOrderList().length > 0) {
        this.materialOrderFlag = true
        if (type === '色纱') {
          this.materialOrderInfo[0].info_data = this.checkMaterialOrderList().map((item) => {
            return {
              sup_info_id: this.$route.query.supFlag ? item.id : '',
              plan_info_id: this.$route.query.supFlag ? '' : item.id,
              material_id: item.material_id,
              material_name: '',
              material_color: item.material_color,
              attribute: '',
              price: '',
              number: item.final_number,
              unit: item.unit
            }
          })
        } else {
          // 这部分的逻辑是4个颜色的纱线订购白胚可以合起来订，现在不需要这个逻辑，因为要一一绑定计划单
          // this.materialOrderInfo[0].info_data = []
          // this.checkMaterialOrderList().forEach((item) => {
          //   const finded = this.materialOrderInfo[0].info_data.find(
          //     (itemFind) => itemFind.material_id === item.material_id
          //   )
          //   if (finded) {
          //     finded!.number = Number(item.final_number) + Number(finded!.number)
          //   } else {
          //     this.materialOrderInfo[0].info_data.push({
          //       material_id: item.material_id,
          //       material_name: '',
          //       material_color: '白胚',
          //       attribute: '绞纱',
          //       price: '',
          //       number: item.final_number,
          //       unit: item.unit
          //     })
          //   }
          // })
          this.materialOrderInfo[0].info_data = this.checkMaterialOrderList().map((item) => {
            return {
              sup_info_id: this.$route.query.supFlag ? item.id : '',
              plan_info_id: this.$route.query.supFlag ? '' : item.id,
              material_id: item.material_id,
              material_name: '',
              material_color: '白胚',
              attribute: '',
              price: '',
              number: item.final_number,
              unit: item.unit
            }
          })
        }
      } else {
        this.$message.error('请在表格中选择需要订购的物料')
      }
    },
    resetOrderMaterial() {
      this.materialOrderInfo = [
        {
          material_type: 1,
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
    getMatOrderCmpData(is_check?: number) {
      this.materialOrderInfo.forEach((item, index) => {
        item.is_check = is_check ? is_check : ''
        item.client_id = item.client_id_arr![2]
        item.order_id = this.materialPlanInfo.order_id
        item.total_price = this.totalOrderPriceList[index]
        item.total_number = this.totalOrderNumberList[index]
        if (this.$route.query.supFlag) {
          item.sup_id = this.$route.query.id
        } else {
          item.plan_id = this.$route.query.id
        }
      })
    },
    saveMaterialOrder(ifPrint?: boolean) {
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
                // {
                //   key: 'attribute',
                //   errMsg: '请选择物料属性'
                // },
                {
                  key: 'material_color',
                  errMsg: '请选择物料颜色'
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
        const checkArr: any[] = []
        this.materialOrderInfo.forEach((item) => {
          item.info_data.forEach((itemChild) => {
            checkArr.push({
              plan_info_id: itemChild.plan_info_id || '',
              sup_info_id: itemChild.sup_info_id || '',
              number: itemChild.number,
              attribute: itemChild.attribute || ''
            })
          })
        })
        checkBeyond({
          doc_type: 2,
          data: checkArr
        }).then((res) => {
          if (res.data.data.length === 0) {
            this.getMatOrderCmpData()
            this.saveMaterialOrderFn(ifPrint)
          } else {
            const createHtml = this.$createElement
            this.$msgbox({
              message: createHtml(
                'p',
                null,
                res.data.data.map((item: string) => {
                  return createHtml('p', null, item)
                })
              ),
              title: '提示',
              showCancelButton: true,
              confirmButtonText: '继续提交',
              cancelButtonText: '取消提交',
              type: 'warning'
            })
              .then(() => {
                this.getMatOrderCmpData(4)
                this.saveMaterialOrderFn(ifPrint)
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消提交'
                })
              })
          }
        })
      }
    },
    saveMaterialOrderFn(ifPrint?: boolean) {
      this.loading = true
      this.saveLock = true
      materialOrder.create({ data: this.materialOrderInfo }).then((res) => {
        if (res.data.status) {
          this.$message.success('物料订购成功')
          this.materialOrderFlag = false
          this.resetOrderMaterial()
          this.init()
          if (ifPrint) {
            this.$openUrl('/materialManage/orderPrint?id=' + res.data.data.id)
          }
        }
        this.saveLock = false
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
    updateMaterialOrder() {
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
        this.materialOrderUpdataInfo.total_price = this.totalOrderPrice
        this.materialOrderUpdataInfo.order_id = this.materialPlanInfo.order_id
        materialOrder.update(this.materialOrderUpdataInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
            this.init()
          }
          this.materialOrderUpdataFlag = false
        })
      }
    },
    goStockMaterial() {
      if (this.checkMaterialOrderList().length > 0) {
        this.materialStockInfo.info_data = this.checkMaterialOrderList().map((item) => {
          return {
            material_id: '',
            material_color: '',
            color_code: '',
            batch_code: '',
            vat_code: '',
            attribute: '',
            number: item.final_number,
            price: '',
            item: '', // 件数
            unit: item.unit,
            rel_doc_info_id: item.id // 采购单调取单加工单子项id
          }
        })
        this.step = 1
        this.materialStockFlag = true
      } else {
        this.$message.error('请在表格中选择需要调取的物料')
      }
    },
    // 填写实际调取值
    goCheckRealStock() {
      if (this.materialStockCheckList.length === 0) {
        this.$message.error('请选择需要调取的物料')
      } else {
        this.materialStockInfo.rel_doc_id = this.$route.query.id
        if (this.materialStockCheckList.length === 1) {
          this.materialStockInfo.info_data.forEach((item) => {
            item.tree_data = this.materialStockCheckList[0].id
            this.getMatId(this.materialStockCheckList[0].id, item)
          })
        }
        this.step = 2
      }
    },
    getMatId(id: number, info: any) {
      const finded = this.materialStockCheckList.find((item: any) => item.id === id)
      info.material_id = finded.material_id
      info.materail_name = finded.material_name
      info.material_color = finded.material_color
      info.attribute = finded.attribute
      info.batch_code = finded.batch_code
      info.color_code = finded.color_code
      info.vat_code = finded.vat_code
    },
    getMatAttr(id: string[], info: any) {
      if (this.orderClientList.find((item) => item.value === id[0])!.label === '面料原料单位') {
        info.info_data.forEach((item: any) => {
          item.attribute = '面料'
        })
      } else {
        info.info_data.forEach((item: any) => {
          if (item.color_name === '白胚') {
            item.attribute = '绞纱'
          } else {
            item.attribute = '筒纱'
          }
        })
      }
    },
    resetStockMaterial() {
      this.materialStockFilter = {
        material_id: '',
        material_name: '',
        store_id_arr: [],
        store_id: '',
        second_store_id: '',
        vat_code: '',
        batch_code: '',
        color_code: '',
        material_color: '白胚',
        color_flag: true
      }
    },
    searchMaterial() {
      store
        .searchMat({
          material_id: '',
          store_id: this.materialStockFilter.store_id_arr.length > 0 ? this.materialStockFilter.store_id_arr[0] : '',
          secondary_id:
            this.materialStockFilter.store_id_arr.length > 0 ? this.materialStockFilter.store_id_arr[1] : '',
          keyword: '',
          material_name: this.materialStockFilter.material_name,
          material_color: this.materialStockFilter.material_color,
          vat_code: this.materialStockFilter.vat_code,
          color_code: this.materialStockFilter.color_code,
          batch_code: this.materialStockFilter.batch_code
        })
        .then((res) => {
          if (res.data.status) {
            this.materialStockArr = res.data.data
            this.searchTotal = this.materialStockArr.length
          }
        })
    },
    checkMaterialStock(ev: boolean, info: any) {
      if (ev) {
        if (this.materialStockCheckList.find((item: any) => item.id === info.id)) {
          this.$message.error('请不要重复选择物料')
        } else if (
          this.materialStockCheckList.length > 0 &&
          this.materialStockCheckList.find(
            (item: any) => item.store_id !== info.store_id || item.secondary_store_id !== info.secondary_store_id
          )
        ) {
          this.$message.error('只能选择同一仓库的物料进行调取，如有需要请分两次调取')
        } else {
          this.materialStockCheckList.push(info)
          this.materialStockInfo.store_id = this.materialStockCheckList[0].store_id
          this.materialStockInfo.secondary_store_id = this.materialStockCheckList[0].secondary_store_id
          this.$message.success('选取成功')
        }
      } else {
        let deleteIndex = null
        this.materialStockCheckList.find((item: any, index: number) => {
          return item.id === info.id && (deleteIndex = index)
        })
        this.$deleteItem(this.materialStockCheckList, deleteIndex)
      }
    },
    closeStock() {
      this.$confirm('关闭页面会导致已填写的数据丢失，且不会保存，是否确认关闭订购页面?', '提示', {
        confirmButtonText: '确认关闭',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.materialStockFlag = false
          this.resetStockMaterial()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭'
          })
        })
    },
    saveMaterialStock() {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      this.materialStockInfo.order_id = this.$route.query.supFlag
        ? this.materialSupplementInfo.order_id
        : this.materialPlanInfo.order_id
      this.materialStockInfo.action_type = this.$route.query.supFlag ? 12 : 10
      const formCheck = this.materialStockInfo.info_data.some((item) => {
        return this.$formCheck(item, [
          {
            key: 'tree_data',
            errMsg: '请选择库存数据'
          },
          {
            key: 'rel_doc_info_id',
            errMsg: '请选择单价信息'
          },
          {
            key: 'number',
            errMsg: '请输入调取数量'
          }
        ])
      })
      if (!formCheck) {
        const checkArr: any[] = []
        this.materialStockInfo.info_data.forEach((item) => {
          checkArr.push({
            action_type: this.$route.query.supFlag ? 12 : 10,
            rel_doc_info_id: item.rel_doc_info_id,
            number: item.number,
            attribute: item.attribute
          })
        })
        checkBeyond({
          doc_type: 6,
          data: checkArr
        }).then((res) => {
          if (res.data.data.length === 0) {
            this.saveMaterialStockFn()
          } else {
            const createHtml = this.$createElement
            this.$msgbox({
              message: createHtml(
                'p',
                null,
                res.data.data.map((item: string) => {
                  return createHtml('p', null, item)
                })
              ),
              title: '提示',
              showCancelButton: true,
              confirmButtonText: '继续提交',
              cancelButtonText: '取消提交',
              type: 'warning'
            })
              .then(() => {
                this.materialStockInfo.is_check = 4
                this.saveMaterialStockFn()
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
        this.mustFlag = true
      }
    },
    saveMaterialStockFn() {
      this.saveLock = true
      materialStock.create({ data: [this.materialStockInfo] }).then((res) => {
        if (res.data.status) {
          this.$message.success('调取成功')
          this.step = 1
          this.materialStockFlag = false
          this.init()
        }
        this.saveLock = false
        this.mustFlag = false
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
    // 加工单获取after_color信息
    getAfterColor(ev: number, info: any, type: '订购加工' | '调取加工') {
      console.log(ev, this.checkMaterialProcessList)
      if (type === '订购加工') {
        const finded = this.checkMaterialProcessList.find((item) => item.id === ev)
        info.after_color = finded!.plan_color || finded!.sup_color
      } else {
        const finded = this.checkMaterialStockList.find((item) => item.id === ev)
        info.after_color = finded!.plan_color || finded!.sup_color
      }
    },
    goProcessMaterial(type: '订购加工' | '调取加工') {
      if (type === '订购加工') {
        if (this.checkMaterialProcessList.length > 0) {
          this.materialProcessFlag = type
          this.materialProcessInfo[0].info_data = this.checkMaterialProcessList.map((item) => {
            return {
              material_order_info_id: item.id, // 采购单子项id 可以通过这个查询到原纱线id，颜色id
              material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
              before_attribute: item.attribute, // 原属性
              after_attribute: '',
              before_color: null,
              after_color: item.plan_color || item.sup_color, // 加工后颜色
              price: '',
              number: item.number,
              unit: item.unit,
              pengsha_desc: '', // 膨纱要求
              qiege_desc: '', // 切割要求
              bingxian_desc: '' // 并线要求
            }
          })
        } else {
          this.$message.error('请在表格中选择需要加工的物料')
        }
      } else {
        if (this.checkMaterialStockList.length > 0) {
          this.materialProcessFlag = type
          this.materialProcessInfo[0].info_data = this.checkMaterialStockList.map((item) => {
            return {
              material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
              material_transfer_info_id: item.id, // 调取单子项id 可以通过这个查询到原纱线id，颜色id
              before_attribute: item.attribute, // 原属性
              after_attribute: '',
              before_color: null,
              after_color: item.plan_color || item.sup_color, // 加工后颜色,默认拿物料计划单的颜色
              price: '',
              number: item.number,
              unit: item.unit,
              pengsha_desc: '', // 膨纱要求
              qiege_desc: '', // 切割要求
              bingxian_desc: '' // 并线要求
            }
          })
        } else {
          this.$message.error('请在表格中选择需要加工的物料')
        }
      }
    },
    resetProcessMaterial() {
      this.materialProcessInfo = [
        {
          order_id: '',
          plan_id: '',
          process: '',
          material_order_id: '',
          material_transfer_id: '',
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
              material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
              material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
              before_attribute: '', // 原属性
              after_attribute: '',
              after_color: '', // 加工后颜色
              price: '',
              number: '',
              unit: 'kg',
              pengsha_desc: '', // 膨纱要求
              qiege_desc: '', // 切割要求
              bingxian_desc: '' // 并线要求
            }
          ]
        }
      ]
    },
    closeProcess() {
      this.$confirm('关闭页面会导致已填写的数据丢失，且不会保存，是否确认关闭订购页面?', '提示', {
        confirmButtonText: '确认关闭',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.materialProcessFlag = false
          this.resetProcessMaterial()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭'
          })
        })
    },
    getMatProcessCmpData() {
      this.materialProcessInfo.forEach((item) => {
        item.client_id = item.client_id_arr![2]
        item.order_id = this.materialPlanInfo.order_id
        item.plan_id = this.$route.query.id
        item.material_order_id = this.materialProcessFlag === '订购加工' ? this.materialOrderIndex : ''
        item.material_transfer_id = this.materialProcessFlag === '调取加工' ? this.materialStockIndex : ''
      })
    },
    saveMaterialProcess(ifPrint?: boolean) {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      const formCheck = this.materialProcessInfo.some((item) => {
        return (
          this.$formCheck(item, [
            {
              key: 'client_id_arr',
              errMsg: '请选择订购单位',
              regNormal: 'checkArr'
            },
            {
              key: 'process',
              errMsg: '请选择工序'
            },
            {
              key: 'delivery_time',
              errMsg: '请选择发货日期'
            }
          ]) ||
          item.info_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
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
      if (!formCheck) {
        this.saveLock = true
        this.getMatProcessCmpData()
        materialProcess.create({ data: this.materialProcessInfo }).then((res) => {
          if (res.data.status) {
            this.$message.success('加工单添加成功')
            this.materialProcessFlag = false
            this.resetProcessMaterial()
            this.init()
            if (ifPrint) {
              this.$openUrl('/materialManage/processPrint?id=' + res.data.data)
            }
          }
          this.saveLock = false
          this.mustFlag = false
        })
      } else {
        this.mustFlag = true
      }
    },
    goUpdateMaterialProcess(itemProcess: MaterialProcessInfo) {
      this.materialProcessUpdataInfo = this.$clone(itemProcess)
      this.prcessClientList.forEach((item) => {
        item.children!.forEach((itemChild) => {
          itemChild.children!.forEach((itemSon) => {
            if (itemSon.value === this.materialProcessUpdataInfo.client_id) {
              // @ts-ignore
              this.materialProcessUpdataInfo.client_id_arr = [item.value, itemChild.value, itemSon.value]
            }
          })
        })
      })
    },
    updataMaterialProcess() {
      const formCheck = this.materialProcessUpdataInfo.info_data.some((itemChild) => {
        return this.$formCheck(itemChild, [
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
      if (!formCheck) {
        this.materialProcessUpdataInfo.order_id = this.materialPlanInfo.order_id
        materialProcess.update(this.materialProcessUpdataInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
            this.materialProcessUpdataFlag = false
            this.init()
          }
        })
      }
    },
    deleteMaterialProcess(id: number) {
      this.$confirm('是否删除该加工单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialProcess.delete({ id }).then((res) => {
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
    // 扣款
    goDeduct(info: MaterialOrderInfo, type: 2 | 3) {
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
    }
  },
  watch: {
    checkAllPlanFlag(val: boolean) {
      this.planMaterialList.forEach((item) => (item.check = val))
    },
    checkAllOrderFlag(val: boolean) {
      const nowOrder = this.materialOrderList.find((item) => item.id!.toString() === this.materialOrderIndex)
      nowOrder!.info_data.forEach((item) => (item.check = val))
    },
    checkAllStockFlag(val: boolean) {
      const nowStock = this.materialStockLog.find((item) => item.id!.toString() === this.materialStockIndex)
      nowStock!.info_data.forEach((item) => (item.check = val))
    }
  },
  computed: {
    associatedPage(): any[] {
      return [
        {
          name: '物料计划单',
          url:
            '/materialPlan/detail?id=' +
            // @ts-ignore
            this.materialPlanInfo.top_order_id +
            '&sampleOrderIndex=' +
            this.materialPlanInfo.order_id
        },
        {
          name: '物料出入库',
          url:
            '/materialStock/detail?id=' +
            // @ts-ignore
            this.materialPlanInfo.top_order_id +
            '&sampleOrderIndex=' +
            this.materialPlanInfo.order_id
        }
      ]
    },
    materialStockList(): any[] {
      return this.materialStockArr.slice((this.searchPage - 1) * 5, this.searchPage * 5)
    },
    planMaterialList(): MaterialPlanGatherData[] {
      return this.$route.query.supFlag
        ? this.materialSupplementInfo.info_data.map((item) => {
            return {
              id: Number(item.id),
              check: false,
              need_number: item.number,
              material_color: item.material_color,
              material_name: item.material_name,
              material_id: item.material_id,
              unit: item.unit,
              loss: 0,
              final_number: item.number,
              material_type: 1
            }
          })
        : this.materialPlanInfo.material_plan_gather_data.filter((item) => item.material_type === 1)
    },
    checkMaterialProcessList(): MaterialListInfo[] {
      console.log(this.checkAllOrderFlag)
      const nowOrder = this.materialOrderList.find((item) => item.id!.toString() === this.materialOrderIndex)
      return nowOrder ? nowOrder!.info_data.filter((item) => item.check) : []
    },
    checkMaterialStockList(): any[] {
      console.log(this.checkAllStockFlag)
      const nowStock = this.materialStockLog.find((item) => item.id!.toString() === this.materialStockIndex)
      return nowStock ? nowStock!.info_data.filter((item) => item.check) : []
    },
    orderClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter(
        (item: { label: string }) => item.label === '纱线原料单位' || item.label === '面料原料单位'
      )
    },
    prcessClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '原料加工单位')
    },
    yarnColorList() {
      return this.$store.state.api.yarnColor.arr.map((item: { name: any }) => {
        return {
          value: item.name,
          label: item.name
        }
      })
    },
    totalOrderNumberList(): number[] {
      return this.materialOrderInfo.map((item) => {
        return item.info_data.reduce((total, current) => {
          return total + Number(current.number)
        }, 0)
      })
    },
    totalOrderPriceList(): string[] {
      return this.materialOrderInfo.map((item) => {
        return (
          item.info_data.reduce((total, current) => {
            return total + Number(current.number) * Number(current.price)
          }, 0) +
          item.others_fee_data.reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        ).toFixed(2)
      })
    },
    totalOrderNumber(): number {
      return this.materialOrderUpdataInfo.info_data.reduce((total, current) => {
        return total + Number(current.number)
      }, 0)
    },
    totalOrderPrice(): string {
      return (
        this.materialOrderUpdataInfo.info_data.reduce((total, current) => {
          return total + Number(current.number) * Number(current.price)
        }, 0) +
        this.materialOrderUpdataInfo.others_fee_data.reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
      ).toFixed(2)
    },
    totalProcessNumberList(): number[] {
      return this.materialProcessInfo.map((item) => {
        return item.info_data.reduce((total, current) => {
          return total + Number(current.number)
        }, 0)
      })
    },
    totalProcessPriceList(): string[] {
      return this.materialProcessInfo.map((item) => {
        return (
          item.info_data.reduce((total, current) => {
            return total + Number(current.number) * Number(current.price)
          }, 0) +
          item.others_fee_data.reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        ).toFixed(2)
      })
    },
    totalProcessNumber(): number {
      return this.materialProcessUpdataInfo.info_data.reduce((total, current) => {
        return total + Number(current.number)
      }, 0)
    },
    totalProcessPrice(): string {
      return (
        this.materialProcessUpdataInfo.info_data.reduce((total, current) => {
          return total + Number(current.number) * Number(current.price)
        }, 0) +
        this.materialProcessUpdataInfo.others_fee_data.reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
      ).toFixed(2)
    },
    totalStockNumber(): number {
      return this.materialStockInfo.info_data.reduce((total, current) => {
        return total + Number(current.number)
      }, 0)
    },
    totalStockPrice(): string {
      return this.materialStockInfo.info_data
        .reduce((total, current) => {
          return total + Number(current.number) * Number(current.price)
        }, 0)
        .toFixed(2)
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
        checkWhich: 'api/yarnColor',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnColorAsync'
      }
    ])
    store.list().then((res) => {
      if (res.data.status) {
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
      }
    })
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialManage/detail.less';
</style>
<style lang="less">
#materialManageDetail {
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