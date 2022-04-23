<template>
  <div id="paymentDetail"
    class="bodyContainer">
    <div class="module"
      id="基本信息">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">客户简称：</div>
            <div class="text">{{clientFinancial.name}}</div>
          </div>
          <div class="col">
            <div class="label">客户全称：</div>
            <div class="text">{{clientFinancial.alias}}</div>
          </div>
          <div class="col">
            <div class="label">客户状态：</div>
            <div class="text">{{clientFinancial.status===1?'合作中':'暂停合作'}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">公司地址：</div>
            <div class="text"></div>
          </div>
          <div class="col flex3">
            <div class="label">客户类型：</div>
            <div class="text">{{clientFinancial.client_type_name}}</div>
          </div>
        </div>
        <div class="row"
          v-for="(item,index) in clientFinancial.contacts_data"
          :key="item.id">
          <div class="col specialInfo">
            <div class="label"
              v-if="index===0">联系人信息</div>
            <div class="info">
              <div class="row">
                <div class="col flex3">
                  <div class="label">姓名：</div>
                  <div class="text">{{item.name}}</div>
                </div>
                <div class="col flex3">
                  <div class="label">电话：</div>
                  <div class="text">{{item.phone}}</div>
                </div>
              </div>
              <div class="row">
                <div class="col flex3">
                  <div class="label">职务：</div>
                  <div class="text">{{item.station}}</div>
                </div>
                <div class="col flex3">
                  <div class="label">邮箱：</div>
                  <div class="text">{{item.email}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      id="统计报表">
      <div class="titleCtn">
        <div class="title">统计报表</div>
      </div>
      <div class="listCtn"
        style="padding-bottom:0">
        <div class="filterCtn"
          style="margin-bottom:0">
          <div class="elCtn">
            <el-date-picker v-model="year"
              @change="getFinancialDetail"
              value-format="yyyy"
              type="year"
              placeholder="选择年">
            </el-date-picker>
          </div>
        </div>
      </div>
      <template v-if="clientType===2">
        <div class="specialCtn">
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">计划订购数量</span>
                    <span class="number blue">{{$toFixed(clientFinancial.total_plan_number/1000)}}
                      <span class="unit">{{$route.query.type==='纱线原料单位'?'吨':'千米'}}</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">计划订购总额</span>
                    <span class="number blue">
                      {{$toFixed(clientFinancial.total_plan_price/10000)}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">实际入库数量</span>
                    <span class="number green">{{$toFixed(clientFinancial.total_real_number/1000)}}
                      <span class="unit">{{$route.query.type==='纱线原料单位'?'吨':'千米'}}</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">实际入库总额</span>
                    <span class="number green">
                      {{$toFixed(clientFinancial.total_real_price)}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="infoCtn">
                <span class="title">扣款金额</span>
                <span class="number orange">{{clientFinancial.total_deduct_price}}
                  <span class="unit">万元</span>
                </span>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">对方已开票金额</span>
                    <span class="number green">{{clientFinancial.total_invoice_price}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">我方已付款金额</span>
                    <span class="number green">{{clientFinancial.total_pay_price}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="clientType===3">
        <div class="specialCtn">
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">计划加工数量</span>
                    <span class="number blue">{{$toFixed(clientFinancial.total_plan_number/1000)}}
                      <span class="unit">{{$route.query.type==='纱线原料单位'?'吨':'千米'}}</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">计划加工总额</span>
                    <span class="number blue">
                      {{$toFixed(clientFinancial.total_plan_price/10000)}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">实际加工数量</span>
                    <span class="number green">{{$toFixed(clientFinancial.total_real_number/1000)}}
                      <span class="unit">{{$route.query.type==='纱线原料单位'?'吨':'千米'}}</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">实际加工总额</span>
                    <span class="number green">
                      {{$toFixed(clientFinancial.total_real_price/10000)}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="infoCtn">
                <span class="title">扣款金额</span>
                <span class="number orange">{{clientFinancial.total_deduct_price}}
                  <span class="unit">万元</span>
                </span>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">对方已开票金额</span>
                    <span class="number green">{{clientFinancial.total_invoice_price}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">我方已付款金额</span>
                    <span class="number green">{{clientFinancial.total_pay_price}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="clientType===4">
        <div class="specialCtn">
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">计划生产数量</span>
                    <span class="number blue">{{$toFixed(clientFinancial.total_plan_number/10000)}}
                      <span class="unit">万件</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">计划生产总额</span>
                    <span class="number blue">
                      {{$toFixed(clientFinancial.total_plan_price/10000)}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">实际生产数量</span>
                    <span class="number green">{{$toFixed(clientFinancial.total_real_number/10000)}}
                      <span class="unit">万</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">实际生产总额</span>
                    <span class="number green">
                      {{$toFixed(clientFinancial.total_real_price/10000)}}
                      <span class="unit">万件</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="infoCtn">
                <span class="title">扣款金额</span>
                <span class="number orange">{{clientFinancial.total_deduct_price}}
                  <span class="unit">万元</span>
                </span>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">对方已开票金额</span>
                    <span class="number green">{{clientFinancial.total_invoice_price}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">我方已付款金额</span>
                    <span class="number green">{{clientFinancial.total_pay_price}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="clientType===11">
        <div class="specialCtn">
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">计划订购数量</span>
                    <span class="number blue">{{$toFixed(clientFinancial.total_plan_number/10000)}}
                      <span class="unit">万个</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">计划订购总额</span>
                    <span class="number blue">
                      {{$toFixed(clientFinancial.total_plan_price/10000)}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">实际订购数量</span>
                    <span class="number green">{{$toFixed(clientFinancial.total_real_number/10000)}}
                      <span class="unit">万个</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">实际订购总额</span>
                    <span class="number green">
                      {{$toFixed(clientFinancial.total_real_price/10000)}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="infoCtn">
                <span class="title">扣款金额</span>
                <span class="number orange">{{clientFinancial.total_deduct_price}}
                  <span class="unit">万元</span>
                </span>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">对方已开票金额</span>
                    <span class="number green">{{clientFinancial.total_invoice_price}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">我方已付款金额</span>
                    <span class="number green">{{clientFinancial.total_pay_price}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="clientType===13">
        <div class="specialCtn">
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">计划发货数量</span>
                    <span class="number blue">{{$toFixed(clientFinancial.total_plan_number/10000)}}
                      <span class="unit">万件</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">计划发货总额</span>
                    <span class="number blue">
                      {{$toFixed(clientFinancial.total_plan_price/10000)}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">实际发货数量</span>
                    <span class="number green">{{$toFixed(clientFinancial.total_real_number/10000)}}
                      <span class="unit">万件</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">实际发货总额</span>
                    <span class="number green">
                      {{$toFixed(clientFinancial.total_real_price/10000)}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="infoCtn">
                <span class="title">扣款金额</span>
                <span class="number orange">{{clientFinancial.total_deduct_price}}
                  <span class="unit">万元</span>
                </span>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">对方已开票金额</span>
                    <span class="number green">{{clientFinancial.total_invoice_price}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
                <div class="col">
                  <div class="infoCtn">
                    <span class="title">我方已付款金额</span>
                    <span class="number green">{{clientFinancial.total_pay_price}}
                      <span class="unit">万元</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="module"
      id="单据列表">
      <div class="titleCtn">
        <div class="title">单据列表</div>
      </div>
      <div class="listCtn"
        v-loading="listLoading">
        <!-- 物料订购 -->
        <template v-if="clientType===2">
          <div class="filterCtn">
            <div class="elCtn">
              <el-input v-model="materialOrderFilter.keyword"
                placeholder="筛选订购单号/订单号"
                @keydown.enter.native="getBill"></el-input>
            </div>
            <div class="elCtn">
              <el-select @change="getBill"
                v-model="materialOrderFilter.user_id"
                placeholder="筛选创建人"
                clearable>
                <el-option v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-date-picker v-model="materialOrderFilter.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="订购日期"
                end-placeholder="订购日期"
                :picker-options="pickerOptions"
                @change="getBill"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
            <div class="elCtn">
              <el-date-picker v-model="materialOrderFilter.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="入库日期"
                end-placeholder="入库日期"
                :picker-options="pickerOptions"
                @change="getBill"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
            <div class="btn borderBtn"
              @click="reset">重置</div>
          </div>
          <div class="filterCtn clearfix">
            <div class="label">已勾选单据：</div>
            <div class="elCtn check"
              v-for="(item,index) in materialOrderCheckList"
              :key="item.id">
              <el-input v-model="item.code"
                disabled>
                <template slot="append">
                  <i class="el-icon-close hoverRed"
                    style="cursor:pointer"
                    @click="materialOrderCheckList.splice(index,1)"></i>
                </template>
              </el-input>
            </div>
            <div class="buttonList fr">
              <div class="btn backHoverBlue">
                <i class="el-icon-s-grid"></i>
                <span class="text">批量操作</span>
              </div>
              <div class="otherInfoCtn">
                <div class="otherInfo">
                  <div class="btn backHoverBlue"
                    @click="goPayment(materialOrderCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量付款</span>
                  </div>
                  <div class="btn backHoverOrange"
                    @click="goInvoice(materialOrderCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量开票</span>
                  </div>
                  <div class="btn backHoverRed"
                    @click="goDeduct(materialOrderCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量扣款</span>
                  </div>
                  <div class="btn backHoverOrange"
                    @click="updatePriceFlag=true">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">修改单价</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="row title">
              <div class="col"
                style="flex:0.1">
                <el-checkbox v-model="checkAll">
                </el-checkbox>
              </div>
              <div class="col">订购单号</div>
              <div class="col">关联订单号</div>
              <div class="col">合计订购数量</div>
              <div class="col">合计订购金额</div>
              <div class="col">合计入库数量</div>
              <div class="col">合计入库金额</div>
              <div class="col">审核状态</div>
              <div class="col">创建人</div>
              <div class="col">创建时间</div>
              <div class="col"
                style="flex: 2">操作</div>
            </div>
            <div v-for="(item, index) in materialOrderList"
              :key="index">
              <div class="row">
                <div class="col"
                  style="flex:0.1">
                  <el-checkbox v-model="item.check"
                    @change="(ev)=>getCheckInfo(ev,item,materialOrderCheckList)">
                  </el-checkbox>
                </div>
                <div class="col">{{ item.code }}</div>
                <div class="col">{{ item.order_code}}</div>
                <div class="col">{{ (+item.total_number).toFixed(2) }}</div>
                <div class="col">{{ (+item.total_price).toFixed(2) }}</div>
                <div class="col">{{ item.total_push_number.toFixed(2) }}</div>
                <div class="col">{{ item.total_push_price.toFixed(2) }}</div>
                <div class="col">
                  <div v-if="item.is_check === 0"
                    class="orange">未审核</div>
                  <div v-if="item.is_check === 1"
                    class="blue">已通过</div>
                  <div v-if="item.is_check === 2"
                    class="red">已驳回</div>
                </div>
                <div class="col">{{ item.user_name }}</div>
                <div class="col">{{ item.created_at }}</div>
                <div class="col"
                  style="flex:2">
                  <span class="opr hoverBlue"
                    @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                  <span class="opr hoverOrange"
                    @click="goInvoice([item])">开票</span>
                  <span class="opr hoverBlue"
                    @click="goPayment([item])">付款</span>
                  <span class="opr hoverRed"
                    @click="goDeduct([item])">扣款</span>
                </div>
              </div>
              <div v-if="item.isShow"
                style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
                <div class="tableCtn"
                  style="padding-top: 0">
                  <template v-if="item.detail.info_data.length>0">
                    <div class="btn backBlue"
                      style="margin:12px 24px 12px 0"
                      @click="item.showStock=false;$forceUpdate()"
                      :class="{'backGray':!item.showStock}">查看订购信息</div>
                    <div class="btn backBlue"
                      style="margin:12px 24px 12px 0"
                      @click="item.showStock=true;$forceUpdate()"
                      :class="{'backGray':item.showStock}">查看出入库信息</div>
                  </template>
                  <template v-if="!item.showStock">
                    <div class="thead">
                      <div class="trow">
                        <div class="tcol">原料名称</div>
                        <div class="tcol">订购颜色</div>
                        <div class="tcol">计划颜色</div>
                        <div class="tcol">订购属性</div>
                        <div class="tcol">订购数量</div>
                        <div class="tcol">订购单价</div>
                        <div class="tcol">结算单价</div>
                      </div>
                    </div>
                    <div class="tbody">
                      <div class="trow"
                        v-for="(itemChild, indexChild) in item.detail.info_data"
                        :key="indexChild">
                        <div class="tcol">{{ itemChild.material_name }}</div>
                        <div class="tcol">{{ itemChild.material_color }}</div>
                        <div class="tcol">{{itemChild.plan_color || itemChild.sup_color  }}</div>
                        <div class="tcol">{{ itemChild.attribute }}</div>
                        <div class="tcol">{{ itemChild.number }}{{ itemChild.unit }}</div>
                        <div class="tcol">{{ itemChild.price }}元</div>
                        <div class="tcol">{{itemChild.settle_price?itemChild.settle_price+'元' : '暂无'}}</div>
                      </div>
                    </div>
                  </template>
                  <template v-if="item.showStock">
                    <div class="thead">
                      <div class="trow">
                        <div class="tcol">入库仓库</div>
                        <div class="tcol">原料名称</div>
                        <div class="tcol">入库颜色</div>
                        <div class="tcol">入库属性</div>
                        <div class="tcol">入库数量</div>
                      </div>
                    </div>
                    <div class="tbody"
                      v-for="itemChild in item.detail.final_push_log"
                      :key="itemChild.id">
                      <div class="trow"
                        v-for="itemMat in itemChild.info_data"
                        :key="itemMat.id">
                        <div class="tcol">{{itemChild.store}}/{{itemChild.secondary_store}}</div>
                        <div class="tcol">{{itemMat.material_name}}</div>
                        <div class="tcol">{{itemMat.material_color}}</div>
                        <div class="tcol">{{itemMat.attribute}}</div>
                        <div class="tcol">{{itemMat.number}}{{itemMat.unit}}</div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div style="margin-top: 20px">
              <span style="line-height: 35px; margin-left: 40px">
                合计订购数量：
                <span class="green"
                  style="font-weight: bold">
                  {{ (materialOrderSts.total_order_number / 1000).toFixed(2) }} {{$route.query.type==='纱线原料单位'?'吨':'千米'}}
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计订购金额：
                <span class="green"
                  style="font-weight: bold">
                  {{ (materialOrderSts.total_order_price / 10000).toFixed(2) }} 万元
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计入库数量：
                <span class="green"
                  style="font-weight: bold">
                  {{ (materialOrderSts.total_push_number / 1000).toFixed(2) }} {{$route.query.type==='纱线原料单位'?'吨':'千米'}}
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计入库金额：
                <span class="green"
                  style="font-weight: bold">
                  {{ (materialOrderSts.total_push_price / 10000).toFixed(2) }} 万元
                </span>
              </span>
            </div>
          </div>
        </template>
        <!-- 物料加工 -->
        <template v-else-if="clientType===3">
          <div class="filterCtn">
            <div class="elCtn">
              <el-input v-model="materialOrderFilter.keyword"
                placeholder="筛选订购单号/订单号"
                @keydown.enter.native="getBill"></el-input>
            </div>
            <div class="elCtn">
              <el-select @change="getBill"
                v-model="materialOrderFilter.user_id"
                placeholder="筛选创建人"
                clearable>
                <el-option v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-date-picker v-model="materialOrderFilter.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="getBill"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
            <div class="btn borderBtn"
              @click="reset">重置</div>
          </div>
          <div class="filterCtn clearfix">
            <div class="label">已勾选单据：</div>
            <div class="elCtn check"
              v-for="(item,index) in materialProcessCheckList"
              :key="item.id">
              <el-input v-model="item.code"
                disabled>
                <template slot="append">
                  <i class="el-icon-close hoverRed"
                    style="cursor:pointer"
                    @click="materialProcessCheckList.splice(index,1)"></i>
                </template>
              </el-input>
            </div>
            <div class="buttonList fr">
              <div class="btn backHoverBlue">
                <i class="el-icon-s-grid"></i>
                <span class="text">批量操作</span>
              </div>
              <div class="otherInfoCtn">
                <div class="otherInfo">
                  <div class="btn backHoverBlue"
                    @click="goPayment(materialProcessCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量付款</span>
                  </div>
                  <div class="btn backHoverOrange"
                    @click="goInvoice(materialProcessCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量开票</span>
                  </div>
                  <div class="btn backHoverRed"
                    @click="goDeduct(materialProcessCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量扣款</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="row title">
              <div class="col"
                style="flex: 0.1">
                <el-checkbox v-model="checkAll"
                  @change="(ev)=>checkAllInfo(ev,materialProcessList,materialProcessCheckList)">
                </el-checkbox>
              </div>
              <div class="col">加工单号</div>
              <div class="col">关联订单号</div>
              <div class="col">合计加工数量</div>
              <div class="col">合计加工金额</div>
              <div class="col">合计完成数量</div>
              <div class="col">合计完成金额</div>
              <div class="col">审核状态</div>
              <div class="col">创建人</div>
              <div class="col">创建时间</div>
              <div class="col"
                style="flex: 2">操作</div>
            </div>
            <div v-for="(item, index) in materialProcessList"
              :key="index">
              <div class="row">
                <div class="col"
                  style="flex: 0.1">
                  <el-checkbox v-model="item.checked"
                    @change="(ev)=>getCheckInfo(ev,item,materialProcessCheckList)"></el-checkbox>
                </div>
                <div class="col">{{ item.code }}</div>
                <div class="col">{{item.order_code}}</div>
                <div class="col">{{ (+item.total_number).toFixed(2) }}</div>
                <div class="col">{{ (+item.total_price).toFixed(2) }}</div>
                <div class="col">{{ (+item.total_push_number).toFixed(2) }}</div>
                <div class="col">{{ (+item.total_push_price).toFixed(2) }}</div>
                <div class="col">
                  <div v-if="item.is_check === 0"
                    class="orange">未审核</div>
                  <div v-if="item.is_check === 1"
                    class="blue">已通过</div>
                  <div v-if="item.is_check === 2"
                    class="red">已驳回</div>
                </div>
                <div class="col">{{ item.user_name }}</div>
                <div class="col">{{ item.created_at }}</div>
                <div class="col"
                  style="flex: 2">
                  <span class="opr hoverBlue"
                    @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                  <span class="opr hoverOrange"
                    @click="goInvoice([item])">开票</span>
                  <span class="opr hoverBlue"
                    @click="goPayment([item])">付款</span>
                  <span class="opr hoverRed"
                    @click="goDeduct([item])">扣款</span>
                </div>
              </div>
              <div v-if="item.isShow"
                style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
                <div class="tableCtn"
                  v-if="item.detail.info_data.length > 0">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">加工单号</div>
                      <div class="tcol">加工单位</div>
                      <div class="tcol"
                        style="flex: 0.5">工序</div>
                      <div class="tcol noPad"
                        style="flex: 3">
                        <div class="trow">
                          <div class="tcol">纱线名称</div>
                          <div class="tcol">加工详情</div>
                          <div class="tcol"
                            style="flex: 0.5">数量</div>
                          <div class="tcol"
                            style="flex: 0.5">单价</div>
                        </div>
                      </div>
                      <div class="tcol"
                        style="flex: 0.8">截止日期</div>
                      <div class="tcol">备注信息</div>
                      <div class="tcol">额外费用</div>
                    </div>
                  </div>
                  <div class="tbody"
                    style="font-size: 14px">
                    <div class="trow">
                      <div class="tcol">
                        <span class="overText">{{ item.detail.code }}
                          <el-tooltip class="item"
                            effect="dark"
                            :content="'创建日期：' + item.detail.created_at.slice(0, 10) + ';创建人：' + item.detail.user_name"
                            placement="top">
                            <i class="el-icon-timer hoverBlue"></i>
                          </el-tooltip>
                        </span>
                      </div>
                      <div class="tcol">{{ item.detail.client_name }}</div>
                      <div class="tcol"
                        style="flex: 0.5">{{ item.detail.process }}</div>
                      <div class="tcol noPad"
                        style="flex: 3">
                        <div class="trow"
                          v-for="(itemMat, indexMat) in item.detail.info_data"
                          :key="indexMat">
                          <div class="tcol">{{ itemMat.material_order_name || itemMat.material_transfer_name }}</div>
                          <div class="tcol">
                            <template v-if="item.detail.process === '染色'">
                              <div class="changeCtn">
                                <span>白胚</span>
                                <span class="el-icon-s-unfold blue"></span>
                                <span>{{ itemMat.after_color }}</span>
                              </div>
                            </template>
                            <template v-if="item.detail.process === '倒纱'">
                              <div class="changeCtn">
                                <span>{{ itemMat.before_attribute }}</span>
                                <span class="el-icon-s-unfold blue"></span>
                                <span>{{ itemMat.after_attribute }}</span>
                              </div>
                            </template>
                            <template v-if="item.detail.process === '并线'">
                              <span>{{ itemMat.bingxian_desc }}</span>
                            </template>
                            <template v-if="item.detail.process === '膨纱'">
                              <span>{{ itemMat.pengsha_desc }}</span>
                            </template>
                            <template v-if="item.detail.process === '切割'">
                              <span>{{ itemMat.qiege_desc }}</span>
                            </template>
                          </div>
                          <div class="tcol"
                            style="flex: 0.5">{{ itemMat.number }}{{ itemMat.unit }}</div>
                          <div class="tcol"
                            style="flex: 0.5">{{ itemMat.price }}元</div>
                        </div>
                      </div>
                      <div class="tcol"
                        style="flex: 0.8">{{ item.detail.delivery_time }}</div>
                      <div class="tcol">{{ item.detail.desc || '无备注' }}</div>
                      <div class="tcol">
                        <others-fee-data :data="item.detail.others_fee_data"></others-fee-data>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top: 20px">
              <span style="line-height: 35px; margin-left: 40px">
                合计加工数量：
                <span class="green"
                  style="font-weight: bold">
                  {{ (materialProcessSts.total_number / 1000).toFixed(2) }} 吨或千米
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计加工金额：
                <span class="green"
                  style="font-weight: bold">
                  {{ (materialProcessSts.total_price / 10000).toFixed(2) }} 万元
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计完成数量：
                <span class="green"
                  style="font-weight: bold">
                  {{ (materialProcessSts.total_push_number / 1000).toFixed(2) }} 吨或千米
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计完成金额：
                <span class="green"
                  style="font-weight: bold">
                  {{ (materialProcessSts.total_push_price / 10000).toFixed(2) }} 万元
                </span>
              </span>
            </div>
          </div>
        </template>
        <!-- 生产织造 -->
        <template v-else-if="clientType===4">
          <div class="filterCtn">
            <div class="elCtn">
              <el-input v-model="productionPlanFilter.keyword"
                placeholder="筛选订购单号/订单号"
                @keydown.enter.native="getBill"></el-input>
            </div>
            <div class="elCtn">
              <el-select @change="getBill"
                v-model="productionPlanFilter.user_id"
                placeholder="筛选创建人"
                clearable>
                <el-option v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-date-picker v-model="productionPlanFilter.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="getBill"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
            <div class="btn borderBtn"
              @click="reset">重置</div>
          </div>
          <div class="filterCtn clearfix">
            <div class="label">已勾选单据：</div>
            <div class="elCtn check"
              v-for="(item,index) in productionPlanCheckList"
              :key="item.id">
              <el-input v-model="item.code"
                disabled>
                <template slot="append">
                  <i class="el-icon-close hoverRed"
                    style="cursor:pointer"
                    @click="productionPlanCheckList.splice(index,1)"></i>
                </template>
              </el-input>
            </div>
            <div class="buttonList fr">
              <div class="btn backHoverBlue">
                <i class="el-icon-s-grid"></i>
                <span class="text">批量操作</span>
              </div>
              <div class="otherInfoCtn">
                <div class="otherInfo">
                  <div class="btn backHoverBlue"
                    @click="goPayment(productionPlanCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量付款</span>
                  </div>
                  <div class="btn backHoverOrange"
                    @click="goInvoice(productionPlanCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量开票</span>
                  </div>
                  <div class="btn backHoverRed"
                    @click="goDeduct(productionPlanCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量扣款</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="row title">
              <div class="col"
                style="flex: 0.1">
                <el-checkbox v-model="checkAll"
                  @change="(ev)=>checkAllInfo(ev,productionPlanList,productionPlanCheckList)">
                </el-checkbox>
              </div>
              <div class="col">生产单号</div>
              <div class="col">关联订单号</div>
              <div class="col">合计计划数量</div>
              <div class="col">合计计划金额</div>
              <div class="col">合计完成数量</div>
              <div class="col">审核状态</div>
              <div class="col">创建人</div>
              <div class="col">创建时间</div>
              <div class="col"
                style="flex:2">操作</div>
            </div>
            <div v-for="(item, index) in productionPlanList"
              :key="index">
              <div class="row">
                <div class="col"
                  style="flex: 0.1">
                  <el-checkbox v-model="item.checked"
                    @change="(ev)=>getCheckInfo(ev,item,productionPlanCheckList)"></el-checkbox>
                </div>
                <div class="col">{{ item.code }}</div>
                <div class="col">{{item.order_code}}</div>
                <div class="col">{{ (+item.total_number).toFixed(2) }}</div>
                <div class="col">{{ (+item.total_price).toFixed(2) }}</div>
                <div class="col">{{ (+item.total_real_number).toFixed(2) }}</div>
                <div class="col">
                  <div v-if="item.is_check === 0"
                    class="orange">未审核</div>
                  <div v-if="item.is_check === 1"
                    class="blue">已通过</div>
                  <div v-if="item.is_check === 2"
                    class="red">已驳回</div>
                </div>
                <div class="col">{{ item.user_name }}</div>
                <div class="col">{{ item.created_at }}</div>
                <div class="col"
                  style="flex: 2">
                  <span class="opr hoverBlue"
                    @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                  <span class="opr hoverOrange"
                    @click="goInvoice([item])">开票</span>
                  <span class="opr hoverBlue"
                    @click="goPayment([item])">付款</span>
                  <span class="opr hoverRed"
                    @click="goDeduct([item])">扣款</span>
                </div>
              </div>
              <div v-if="item.isShow"
                style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
                <div class="detailCtn"
                  style="padding-bottom:0">
                  <div class="row">
                    <div class="col">
                      <div class="label">加工工序：</div>
                      <div class="text">{{ item.detail.process_name || '无' }}</div>
                    </div>
                    <div class="col">
                      <div class="label">工序说明：</div>
                      <div class="text">{{ item.detail.process_desc || '无' }}</div>
                    </div>
                  </div>
                </div>
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">产品信息</div>
                      <div class="tcol">产品部位</div>
                      <div class="tcol">尺码颜色</div>
                      <div class="tcol">加工数量</div>
                      <div class="tcol">加工单价</div>
                      <div class="tcol">加工总价</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="(itemPro, indexPro) in item.detail.product_info_data"
                      :key="indexPro">
                      <div class="tcol hoverBlue"
                        style="cursor: pointer"
                        @click="showProduct(itemPro)">
                        <span>{{ itemPro.product_code || itemPro.system_code }}</span>
                        <span>{{ itemPro.category_name }}/{{ itemPro.secondary_category_name }}</span>
                      </div>
                      <div class="tcol">
                        {{ itemPro.part_name }}
                      </div>
                      <div class="tcol">
                        {{ itemPro.size_name ? itemPro.size_name + '/' + itemPro.color_name : '未选择尺码颜色' }}
                      </div>
                      <div class="tcol">{{ itemPro.number }}</div>
                      <div class="tcol">{{ itemPro.price }}元</div>
                      <div class="tcol">{{ $toFixed(itemPro.price * itemPro.number) }}元</div>
                    </div>
                  </div>
                </div>
                <div class="tableCtn"
                  v-if="item.detail.material_info_data.length > 0">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">物料名称</div>
                      <div class="tcol">物料颜色</div>
                      <div class="tcol">分配数量</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="(itemMat, indexMat) in item.detail.material_info_data"
                      :key="indexMat">
                      <div class="tcol">{{ itemMat.material_name }}</div>
                      <div class="tcol">{{ itemMat.material_color }}</div>
                      <div class="tcol">{{ itemMat.number }}{{ itemMat.unit }}</div>
                    </div>
                  </div>
                </div>
                <div class="titleCtn"
                  style="margin-top: 40px"
                  v-if="item.detail.sup_data.length > 0">
                  <div class="title">加工物料补充</div>
                </div>
                <div class="tableCtn"
                  v-if="item.detail.sup_data.length > 0">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">补纱单编号</div>
                      <div class="tcol noPad"
                        style="flex: 2">
                        <div class="trow">
                          <div class="tcol">承担单位</div>
                          <div class="tcol">承担金额</div>
                        </div>
                      </div>
                      <div class="tcol noPad"
                        style="flex: 3">
                        <div class="trow">
                          <div class="tcol">物料名称</div>
                          <div class="tcol">物料颜色</div>
                          <div class="tcol">物料数量</div>
                        </div>
                      </div>
                      <div class="tcol">备注信息</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="itemChild in item.detail.sup_data"
                      :key="itemChild.id">
                      <div class="tcol">{{ itemChild.code }}</div>
                      <div class="tcol noPad"
                        style="flex: 2">
                        <div class="trow"
                          v-for="(itemClient, indexClient) in itemChild.client_data"
                          :key="indexClient">
                          <div class="tcol">{{ itemClient.bear_client_name }}</div>
                          <div class="tcol">{{ itemClient.bear_price }}元</div>
                        </div>
                      </div>
                      <div class="tcol noPad"
                        style="flex: 3">
                        <div class="trow"
                          v-for="itemMat in itemChild.info_data"
                          :key="itemMat.id">
                          <div class="tcol">{{ itemMat.material_name }}</div>
                          <div class="tcol">{{ itemMat.material_color }}</div>
                          <div class="tcol">{{ itemMat.number }}{{ itemMat.unit }}</div>
                        </div>
                      </div>
                      <div class="tcol">{{ itemChild.desc }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top: 20px">
              <span style="line-height: 35px; margin-left: 40px">
                合计计划数量：
                <span class="green"
                  style="font-weight: bold">
                  {{ (productionPlanSts.total_number / 10000).toFixed(2) }} 万件
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计计划金额：
                <span class="green"
                  style="font-weight: bold">
                  {{ (productionPlanSts.total_price / 10000).toFixed(2) }} 万元
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计完成数量：
                <span class="green"
                  style="font-weight: bold">
                  {{ (productionPlanSts.total_real_number / 10000).toFixed(2) }} 万件
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计完成金额：
                <span class="green"
                  style="font-weight: bold">
                  {{ (productionPlanSts.total_real_price / 10000).toFixed(2) }} 万元
                </span>
              </span>
            </div>
          </div>
        </template>
        <!-- 包装订购 -->
        <template v-else-if="clientType===11">
          <div class="filterCtn">
            <div class="elCtn">
              <el-input v-model="packOrderFilter.keyword"
                placeholder="筛选订购单号/订单号"
                @keydown.enter.native="getBill"></el-input>
            </div>
            <div class="elCtn">
              <el-select @change="getBill"
                v-model="packOrderFilter.user_id"
                placeholder="筛选创建人"
                clearable>
                <el-option v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-date-picker v-model="packOrderFilter.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="getBill"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
            <div class="btn borderBtn"
              @click="reset">重置</div>
          </div>
          <div class="filterCtn clearfix">
            <div class="label">已勾选单据：</div>
            <div class="elCtn check"
              v-for="(item,index) in packOrderCheckList"
              :key="item.id">
              <el-input v-model="item.code"
                disabled>
                <template slot="append">
                  <i class="el-icon-close hoverRed"
                    style="cursor:pointer"
                    @click="packOrderCheckList.splice(index,1)"></i>
                </template>
              </el-input>
            </div>
            <div class="buttonList fr">
              <div class="btn backHoverBlue">
                <i class="el-icon-s-grid"></i>
                <span class="text">批量操作</span>
              </div>
              <div class="otherInfoCtn">
                <div class="otherInfo">
                  <div class="btn backHoverBlue"
                    @click="goPayment(packOrderCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量付款</span>
                  </div>
                  <div class="btn backHoverOrange"
                    @click="goInvoice(packOrderCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量开票</span>
                  </div>
                  <div class="btn backHoverRed"
                    @click="goDeduct(packOrderCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量扣款</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="row title">
              <div class="col"
                style="flex: 0.1">
                <el-checkbox v-model="checkAll"
                  @change="(ev)=>checkAllInfo(ev,packOrderList,packOrderCheckList)">
                </el-checkbox>
              </div>
              <div class="col">订购单号</div>
              <div class="col">关联订单号</div>
              <div class="col">合计订购数量</div>
              <div class="col">合计订购金额</div>
              <div class="col">审核状态</div>
              <div class="col">创建人</div>
              <div class="col">创建时间</div>
              <div class="col"
                style="flex: 1.4">操作</div>
            </div>
            <div v-for="(item, index) in packOrderList"
              :key="index">
              <div class="row">
                <div class="col"
                  style="flex: 0.1">
                  <el-checkbox v-model="item.checked"
                    @change="(ev)=>getCheckInfo(ev,item,packOrderCheckList)"></el-checkbox>
                </div>
                <div class="col">{{ item.code }}</div>
                <div class="col">{{item.order_code}}</div>
                <div class="col">{{ (+item.total_number).toFixed(2) }}</div>
                <div class="col">{{ (+item.total_price).toFixed(2) }}</div>
                <div class="col">
                  <div v-if="item.is_check === 0"
                    class="orange">未审核</div>
                  <div v-if="item.is_check === 1"
                    class="blue">已通过</div>
                  <div v-if="item.is_check === 2"
                    class="red">已驳回</div>
                </div>
                <div class="col">{{ item.user_name }}</div>
                <div class="col">{{ item.created_at }}</div>
                <div class="col"
                  style="flex: 1.4">
                  <span class="opr hoverBlue"
                    @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                  <span class="opr hoverOrange"
                    @click="goInvoice([item])">开票</span>
                  <span class="opr hoverBlue"
                    @click="goPayment([item])">付款</span>
                  <span class="opr hoverRed"
                    @click="goDeduct([item])">扣款</span>
                </div>
              </div>
              <div v-if="item.isShow"
                style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">包装名称</div>
                      <div class="tcol">包装规格</div>
                      <div class="tcol">属性或说明</div>
                      <div class="tcol">面积单价</div>
                      <div class="tcol">数量单价</div>
                      <div class="tcol">订购数量</div>
                      <div class="tcol">备注信息</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="(itemChild, indexChild) in item.detail.info_data"
                      :key="indexChild">
                      <div class="tcol">{{ itemChild.pack_material_name }}</div>
                      <div class="tcol">
                        <template v-if="Number(itemChild.price_type) === 1">
                          {{ itemChild.length }}*{{ itemChild.width }}*{{ itemChild.height }}cm
                        </template>
                        <template v-else-if="Number(itemChild.price_type) === 2">
                          {{ itemChild.length }}*{{ itemChild.width }}cm
                        </template>
                        <template v-else-if="Number(itemChild.price_type) === 3">
                          {{ itemChild.length }}
                        </template>
                      </div>
                      <div class="tcol">{{ itemChild.desc }}</div>
                      <div class="tcol">{{ itemChild.bulk_price ? itemChild.bulk_price + '元' : '-' }}</div>
                      <div class="tcol">{{ itemChild.count_price ? itemChild.count_price + '元' : '-' }}</div>
                      <div class="tcol">{{ itemChild.number }}</div>
                      <div class="tcol">{{ itemChild.desc }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top: 20px">
              <span style="line-height: 35px; margin-left: 40px">
                合计订购数量：
                <span class="green"
                  style="font-weight: bold">
                  {{ (packOrderSts.total_number / 10000).toFixed(2) }} 万元
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计订购金额：
                <span class="green"
                  style="font-weight: bold">
                  {{ (packOrderSts.total_price / 10000).toFixed(2) }} 万元
                </span>
              </span>
            </div>
          </div>
        </template>
        <!-- 发货单 -->
        <template v-else-if="clientType===13">
          <div class="filterCtn">
            <div class="elCtn">
              <el-input v-model="boxManageFilter.keyword"
                placeholder="筛选订购单号/订单号"
                @keydown.enter.native="getBill"></el-input>
            </div>
            <div class="elCtn">
              <el-select @change="getBill"
                v-model="boxManageFilter.user_id"
                placeholder="筛选创建人"
                clearable>
                <el-option v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="elCtn">
              <el-date-picker v-model="boxManageFilter.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="getBill"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
            <div class="btn borderBtn"
              @click="reset">重置</div>
          </div>
          <div class="filterCtn clearfix">
            <div class="label">已勾选单据：</div>
            <div class="elCtn check"
              v-for="(item,index) in packOrderCheckList"
              :key="item.id">
              <el-input v-model="item.code"
                disabled>
                <template slot="append">
                  <i class="el-icon-close hoverRed"
                    style="cursor:pointer"
                    @click="packOrderCheckList.splice(index,1)"></i>
                </template>
              </el-input>
            </div>
            <div class="buttonList fr">
              <div class="btn backHoverBlue">
                <i class="el-icon-s-grid"></i>
                <span class="text">批量操作</span>
              </div>
              <div class="otherInfoCtn">
                <div class="otherInfo">
                  <div class="btn backHoverBlue"
                    @click="goPayment(packOrderCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量付款</span>
                  </div>
                  <div class="btn backHoverOrange"
                    @click="goInvoice(packOrderCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量开票</span>
                  </div>
                  <div class="btn backHoverRed"
                    @click="goDeduct(packOrderCheckList)">
                    <svg class="iconFont"
                      aria-hidden="true">
                      <use xlink:href="#icon-xiugaidingdan"></use>
                    </svg>
                    <span class="text">批量扣款</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="row title">
              <div class="col"
                style="flex: 0.1">
                <el-checkbox v-model="checkAll"
                  @change="(ev)=>checkAllInfo(ev,packOrderList,boxManageCheckList)">
                </el-checkbox>
              </div>
              <div class="col"
                style="flex: 1.3">发货单号</div>
              <div class="col">合计运输立方</div>
              <div class="col">合计运输金额</div>
              <div class="col">审核状态</div>
              <div class="col">创建人</div>
              <div class="col">创建时间</div>
              <div class="col"
                style="flex: 1.4">操作</div>
            </div>
            <div v-for="(item, index) in boxManageList"
              :key="index">
              <div class="row">
                <div class="col"
                  style="flex: 0.1">
                  <el-checkbox v-model="item.checked"
                    @change="(ev)=>getCheckInfo(ev,item,boxManageCheckList)"></el-checkbox>
                </div>
                <div class="col">{{ item.code }}</div>
                <div class="col">{{ (+item.total_bulk).toFixed(2) }}</div>
                <div class="col">{{ (+item.total_price).toFixed(2) }}</div>
                <div class="col">
                  <div v-if="item.is_check === 0"
                    class="orange">未审核</div>
                  <div v-if="item.is_check === 1"
                    class="blue">已通过</div>
                  <div v-if="item.is_check === 2"
                    class="red">已驳回</div>
                </div>
                <div class="col">{{ item.user_name }}</div>
                <div class="col">{{ item.created_at }}</div>
                <div class="col"
                  style="flex: 1.4">
                  <span class="opr hoverBlue"
                    @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                  <span class="opr hoverOrange"
                    @click="goInvoice([item])">开票</span>
                  <span class="opr hoverBlue"
                    @click="goPayment([item])">付款</span>
                  <span class="opr hoverRed"
                    @click="goDeduct([item])">扣款</span>
                </div>
              </div>
              <div v-if="item.isShow"
                style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
                <div class="detailCtn">
                  <div class="row">
                    <div class="col">
                      <div class="label">总箱数：</div>
                      <div class="text">{{ item.detail.total_box }}箱</div>
                    </div>
                    <div class="col">
                      <div class="label">总毛重：</div>
                      <div class="text">{{ item.detail.total_gross_weight }}kg</div>
                    </div>
                    <div class="col">
                      <div class="label">总净重：</div>
                      <div class="text">{{ item.detail.total_net_weight }}kg</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="label">总体积：</div>
                      <div class="text">{{ item.detail.total_bulk }}m³</div>
                    </div>
                    <div class="col">
                      <div class="label">运输单价：</div>
                      <div class="text">{{ item.detail.price }}元/m³</div>
                    </div>
                    <div class="col">
                      <div class="label">体积价：</div>
                      <div class="text">{{ item.detail.price_bulk }}元</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="label">额外费用：</div>
                      <div class="text">{{ item.detail.others_fee }}元</div>
                    </div>
                    <div class="col">
                      <div class="label">运输总价：</div>
                      <div class="text">{{ item.detail.total_price }}元</div>
                    </div>
                    <div class="col"></div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="label">运输单位：</div>
                      <div class="text">{{ item.detail.client_name }}</div>
                    </div>
                    <div class="col">
                      <div class="label">运输城市：</div>
                      <div class="text">{{ item.detail.city }}</div>
                    </div>
                    <div class="col">
                      <div class="label">运输地址：</div>
                      <div class="text">{{ item.detail.address }}</div>
                    </div>
                  </div>
                </div>
                <div class="tableCtn"
                  v-for="(itema, index) in item.detail.packPlanLogCopy"
                  :key="index + 'tszd'">
                  <div class="thead"
                    v-if="itema">
                    <div class="trow">
                      <div class="tcol">计划单号</div>
                      <div class="tcol">订单号</div>
                      <div class="tcol noPad"
                        style="flex: 8">
                        <div class="trow">
                          <div class="tcol noPad"
                            style="flex: 4">
                            <div class="trow">
                              <div class="tcol">产品</div>
                              <div class="tcol">尺码颜色</div>
                              <div class="tcol">计划装箱数量</div>
                              <div class="tcol">实际装箱数量</div>
                            </div>
                          </div>
                          <div class="tcol"
                            style="flex: 0.5">总箱数</div>
                          <div class="tcol"
                            style="flex: 0.5">总毛重</div>
                          <div class="tcol"
                            style="flex: 0.5">总净重</div>
                          <div class="tcol"
                            style="flex: 0.5">总体积</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tbody"
                    v-if="itema">
                    <div class="trow">
                      <div class="tcol">{{ itema.code }}</div>
                      <div class="tcol">{{ itema.order_code }}</div>
                      <div class="tcol noPad"
                        style="flex: 8">
                        <div class="trow"
                          v-for="(itemData, indexData) in itema.data"
                          :key="indexData">
                          <div class="tcol noPad"
                            style="flex: 4">
                            <div class="trow"
                              v-for="(itemPro, indexPro) in itemData.product_info"
                              :key="indexPro">
                              <div class="tcol">
                                <span>{{ itemPro.product_code }}</span>
                                <span>{{ itemPro.category }}/{{ itemPro.secondary_category }}</span>
                              </div>
                              <div class="tcol">{{ itemPro.size_name }}/{{ itemPro.color_name }}</div>
                              <div class="tcol">{{ itemPro.pack_number_all }}</div>
                              <div class="tcol">{{ itemPro.transport_number }}</div>
                            </div>
                          </div>
                          <div class="tcol"
                            style="flex: 0.5">{{ itemData.total_box_count }}箱</div>
                          <div class="tcol"
                            style="flex: 0.5">{{ itemData.total_gross_weight }}kg</div>
                          <div class="tcol"
                            style="flex: 0.5">{{ itemData.total_net_weight }}kg</div>
                          <div class="tcol"
                            style="flex: 0.5">{{ itemData.total_bulk }}m³</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="detailCtn"
                  v-for="(itemBatch, indexBatch) in item.detail.orderBatchCopy"
                  :key="indexBatch">
                  <div class="tableCtn noPadBtm"
                    style="padding-left: 0; padding-right: 0">
                    <div class="thead">
                      <div class="trow">
                        <div class="tcol"
                          style="flex: 0.72">批次序号</div>
                        <div class="tcol">发货时间</div>
                        <div class="tcol noPad"
                          style="flex: 8.7">
                          <div class="trow">
                            <div class="tcol">产品品类</div>
                            <div class="tcol noPad"
                              style="flex: 3">
                              <div class="trow">
                                <div class="tcol">尺码颜色</div>
                                <div class="tcol">计划发货数量</div>
                                <div class="tcol">实际发货数量</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="tcol">箱数</div>
                        <div class="tcol">总毛重kg</div>
                        <div class="tcol">总净重kg</div>
                        <div class="tcol">总体积m³</div>
                      </div>
                    </div>
                    <div class="tbody">
                      <div class="trow">
                        <div class="tcol"
                          style="flex: 0.72">
                          <span>第{{ itemBatch.batch_number }}批</span>
                        </div>
                        <div class="tcol">
                          <span class="green">{{ itemBatch.delivery_time }}</span>
                        </div>
                        <div class="tcol noPad"
                          style="flex: 8.7">
                          <div class="trow"
                            v-for="itemPro in itemBatch.product_data"
                            :key="itemPro.id">
                            <div class="tcol">
                              <span>{{ itemPro.product_code || itemPro.system_code || '无编号' }}</span>
                              <span class="gray">({{ itemPro.category }}/{{ itemPro.secondary_category }})</span>
                            </div>
                            <div class="tcol noPad"
                              style="flex: 3">
                              <div class="trow"
                                v-for="(itemChild, indexChild) in itemPro.product_info"
                                :key="indexChild">
                                <div class="tcol">{{ itemChild.size_name }}/{{ itemChild.color_name }}</div>
                                <div class="tcol">{{ itemChild.number }}</div>
                                <div class="tcol">{{ itemChild.real_number }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="tcol">{{ itemBatch.total_box_count }}箱</div>
                        <div class="tcol">{{ itemBatch.total_gross_weight }}kg</div>
                        <div class="tcol">{{ itemBatch.total_net_weight }}kg</div>
                        <div class="tcol">{{ itemBatch.total_bulk }}m³</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">产品信息</div>
                      <div class="tcol">尺码颜色</div>
                      <div class="tcol">计划发货数量</div>
                      <div class="tcol">实际发货数量</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="(item, index) in item.detail.batchInfo"
                      :key="index">
                      <div class="tcol hoverBlue"
                        style="cursor: pointer"
                        @click="showProduct(item)">
                        {{ item.product_code }}
                        <span>({{ item.category }}/{{ item.secondary_category }})</span>
                      </div>
                      <div class="tcol">{{ item.size_name }}/{{ item.color_name }}</div>
                      <div class="tcol">{{ item.number }}</div>
                      <div class="tcol">{{ item.transport_number }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px">
            <span style="line-height: 35px; margin-left: 40px">
              合计运输立方：
              <span class="green"
                style="font-weight: bold">
                {{ (boxManageSts.total_number / 10000).toFixed(2) }} 万元
              </span>
            </span>
            <span style="line-height: 35px; margin-left: 40px">
              合计运输金额：
              <span class="green"
                style="font-weight: bold">
                {{ (boxManageSts.total_price / 10000).toFixed(2) }} 万元
              </span>
            </span>
          </div>
        </template>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="listTotal"
            :current-page.sync="listPage"
            @current-change="getBill">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module"
      id="开票单据">
      <div class="titleCtn">
        <div class="title">开票单据</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="invoiceOrderCode"
              placeholder="搜索订单号"
              @keydown.enter.native="getInvoiceLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="invoiceKeyword"
              placeholder="搜索票据编号"
              @keydown.enter.native="getInvoiceLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-select @change="getInvoiceLogList"
              v-model="invoiceUser"
              placeholder="筛选创建人"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="invoiceDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getInvoiceLogList"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="backHoverBlue btn">搜索</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">票据编号</div>
            <div class="col">关联订单号</div>
            <div class="col">开票金额</div>
            <div class="col">开票号码</div>
            <div class="col">备注信息</div>
            <div class="col">开票人</div>
            <div class="col">开票日期</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in invoiceLog"
            :key="item.id">
            <div class="col">{{item.code}}</div>
            <div class="col">{{item.order_code||'未关联订单'}}</div>
            <div class="col">{{item.price}}元</div>
            <div class="col">{{item.invoice_code}}</div>
            <div class="col">{{item.desc}}</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.created_at}}</div>
            <div class="col oprCtn">
              <span class="opr orange"
                @click="goInvoice([item],true)">修改</span>
              <span class="opr red">删除</span>
            </div>
          </div>
          <div class="row">
            <div class="col">合计：</div>
            <div class="col"></div>
            <div class="col green bold">{{invoiceTotalPrice}}元</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="invoiceTotal"
            :current-page.sync="invoicePage"
            @current-change="getInvoiceLogList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module"
      id="付款单据">
      <div class="titleCtn">
        <div class="title">付款单据</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="paymentOrderCode"
              placeholder="搜索订单号"
              @keydown.enter.native="getPaymentLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="paymentKeyword"
              placeholder="搜索票据编号"
              @keydown.enter.native="getPaymentLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-select @change="getPaymentLogList"
              v-model="paymentUser"
              placeholder="筛选创建人"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="paymentDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getPaymentLogList"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="backHoverBlue btn">搜索</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">票据编号</div>
            <div class="col">关联订单号</div>
            <div class="col">付款金额</div>
            <div class="col">备注信息</div>
            <div class="col">付款人</div>
            <div class="col">付款日期</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in paymentLog"
            :key="item.id">
            <div class="col">{{item.code}}</div>
            <div class="col">{{item.order_code||'未关联订单'}}</div>
            <div class="col">{{item.price}}元</div>
            <div class="col">{{item.desc}}</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.created_at}}</div>
            <div class="col oprCtn">
              <span class="opr orange"
                @click="goPayment([item],true)">修改</span>
              <span class="opr red">删除</span>
            </div>
          </div>
          <div class="row">
            <div class="col">合计：</div>
            <div class="col"></div>
            <div class="col green bold">{{paymentTotalPrice}}元</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="paymentTotal"
            :current-page.sync="paymentPage"
            @current-change="getPaymentLogList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module"
      id="扣款单据">
      <div class="titleCtn">
        <div class="title">扣款单据</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="deductOrderCode"
              placeholder="搜索订单号"
              @keydown.enter.native="getDeductList"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="deductKeyword"
              placeholder="搜索票据编号"
              @keydown.enter.native="getDeductList"></el-input>
          </div>
          <div class="elCtn">
            <el-select @change="getDeductList"
              v-model="deductUser"
              placeholder="筛选创建人"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="deductDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getDeductList"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="backHoverBlue btn">搜索</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">票据编号</div>
            <div class="col">关联订单号</div>
            <div class="col">扣款金额</div>
            <div class="col">扣款原因</div>
            <div class="col">图片信息</div>
            <div class="col">开票人</div>
            <div class="col">开票日期</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in deductLog"
            :key="item.id">
            <div class="col">{{item.code}}</div>
            <div class="col">{{item.order_code||'未关联订单'}}</div>
            <div class="col">{{item.price}}元</div>
            <div class="col">{{item.reason}}</div>
            <div class="col">
              <div class="imageCtn">
                <el-image style="width:100%;height:100%"
                  :src="item.file_url?item.file_url:''"
                  :preview-src-list="[item.file_url]">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"
                      style="font-size:42px"></i>
                  </div>
                </el-image>
              </div>
            </div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.create_time}}</div>
            <div class="col oprCtn">
              <span class="opr orange"
                @click="goDeduct([item],true)">修改</span>
              <span class="opr red">删除</span>
            </div>
          </div>
          <div class="row">
            <div class="col">合计：</div>
            <div class="col"></div>
            <div class="col green bold">{{deductTotalPrice}}元</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="deductTotal"
            :current-page.sync="deductPage"
            @current-change="getDeductList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverOrange"
            @click="goInvoice([])">直接开票</div>
          <div class="btn backHoverBlue"
            @click="goPayment([])">直接付款</div>
          <div class="btn backHoverRed"
            @click="goDeduct([])">直接扣款</div>
        </div>
      </div>
    </div>
    <!-- 付款 -->
    <zh-payment :type="clientType"
      :update="paymentUpdate"
      :show="paymentFlag"
      :data="paymentData"
      :client_name="clientFinancial.name"
      :client_id="$route.query.id"
      @close="paymentFlag=false;init()"></zh-payment>
    <!-- 开票 -->
    <zh-invoice :type="clientType"
      :update="invoiceUpdate"
      :show="invoiceFlag"
      :data="invoiceData"
      :client_name="clientFinancial.name"
      :client_id="$route.query.id"
      @close="invoiceFlag=false;init()"></zh-invoice>
    <!-- 扣款 -->
    <zh-deduct :type="clientType"
      :update="deductUpdate"
      :show="deductFlag"
      :data="deductData"
      :client_name="clientFinancial.name"
      :client_id="$route.query.id"
      @close="deductFlag=false;init()"></zh-deduct>
    <!-- 批量修改结算单价功能 -->
    <div class="popup"
      v-show="updatePriceFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">批量修改结算单价</span>
          <div class="closeCtn"
            @click="updatePriceFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <!-- <div class="description">搜索物料订购信息批量修改结算单价。</div> -->
          <div class="row">
            <div class="label">物料名称：</div>
            <div class="info elCtn">
              <el-autocomplete v-model="updatePriceInfo.material_name"
                :fetch-suggestions="searchMaterial"
                placeholder="物料名称搜索"></el-autocomplete>
            </div>
          </div>
          <div class="row">
            <div class="label">物料属性：</div>
            <div class="info elCtn">
              <el-autocomplete :fetch-suggestions="searchAttribute"
                v-model="updatePriceInfo.attribute"
                placeholder="物料属性"></el-autocomplete>
            </div>
          </div>
          <div class="row">
            <div class="label">物料颜色：</div>
            <div class="info elCtn">
              <el-radio style="line-height:32px"
                v-model="updatePriceInfo.material_color"
                :label="null">色纱</el-radio>
              <el-radio style="line-height:32px"
                v-model="updatePriceInfo.material_color"
                :label="'白胚'">白胚</el-radio>
            </div>
          </div>
          <div class="row">
            <div class="label">日期范围：</div>
            <div class="info elCtn">
              <el-date-picker v-model="updatePriceInfo.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label">结算单价：</div>
            <div class="info elCtn">
              <el-input v-model="updatePriceInfo.settle_price"
                placeholder="请输入结算单价">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">修改范围：</div>
            <div class="info elCtn">
              <el-radio style="line-height:32px"
                v-model="updatePriceInfo.client_id"
                :label="$route.query.id">仅当前付款单位</el-radio>
              <el-radio style="line-height:32px"
                v-model="updatePriceInfo.client_id"
                :label="null">所有单位</el-radio>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="updatePriceFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveUpdatePrice">确认修改</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  client,
  payment,
  deduct,
  invoice,
  materialOrder,
  materialProcess,
  productionPlan,
  packMaterial,
  packManage,
  boxManage,
  yarn,
  updateSettlePrice
} from '@/assets/js/api'
import { yarnAttributeArr } from '@/assets/js/dictionary'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      paymentFlag: false,
      paymentData: [],
      paymentLog: [],
      paymentTotalPrice: 0,
      paymentTotal: 1,
      paymentPage: 1,
      paymentUpdate: false,
      paymentOrderCode: '',
      paymentKeyword: '',
      paymentDate: [],
      paymentUser: '',
      invoiceFlag: false,
      invoiceData: [],
      invoiceTotalPrice: 0,
      invoiceLog: [],
      invoiceTotal: 1,
      invoicePage: 1,
      invoiceUpdate: false,
      invoiceOrderCode: '',
      invoiceKeyword: '',
      invoiceDate: [],
      invoiceUser: '',
      deductFlag: false,
      deductData: [],
      deductLog: [],
      deductTotalPrice: 0,
      deductTotal: 1,
      deductPage: 1,
      deductUpdate: false,
      deductOrderCode: '',
      deductKeyword: '',
      deductDate: [],
      deductUser: '',
      clientFinancial: {
        total_pay_price: 0,
        total_deduct_price: 0,
        total_invoice_price: 0,
        total_plan_number: 0,
        total_plan_price: 0,
        total_real_number: 0,
        total_real_price: 0,
        status: 0,
        name: '',
        client_type_name: '',
        alias: '',
        contacts_data: []
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      checkAll: false,
      year: new Date().getFullYear().toString(),
      listPage: 1,
      listTotal: 1,
      materialOrderFilter: {
        date: [],
        user_id: '',
        keyword: ''
      },
      materialOrderSts: {
        total_order_number: 0,
        total_order_price: 0,
        total_push_number: 0,
        total_push_price: 0
      },
      materialOrderList: [],
      materialOrderCheckList: [],
      materialProcessFilter: {
        date: [],
        user_id: '',
        keyword: ''
      },
      materialProcessSts: {
        total_number: 0,
        total_price: 0,
        total_push_number: 0,
        total_push_price: 0,
        total_settle_price: 0
      },
      materialProcessList: [],
      materialProcessCheckList: [],
      productionPlanFilter: {
        date: [],
        user_id: '',
        keyword: ''
      },
      productionPlanSts: {
        total_number: 0,
        total_price: 0,
        total_push_number: 0,
        total_push_price: 0,
        total_settle_price: 0
      },
      productionPlanList: [],
      productionPlanCheckList: [],
      packOrderFilter: {
        total_number: 0,
        total_price: 0
      },
      packOrderSts: {
        date: [],
        user_id: '',
        keyword: ''
      },
      packOrderList: [],
      packOrderCheckList: [],
      boxManageFilter: { date: [], user_id: '', keyword: '' },
      boxManageSts: {
        total_number: 0,
        total_price: 0
      },
      boxManageList: [],
      boxManageCheckList: [],
      listLoading: false,
      updatePriceFlag: false,
      updatePriceInfo: {
        material_name: '',
        material_color: '白胚',
        settle_price: '',
        attribute: '',
        start_time: '',
        end_time: '',
        date: [],
        client_id: null
      },
      yarnAttributeList: yarnAttributeArr,
      yarnList: []
    }
  },
  computed: {
    userList() {
      return this.$store.state.api.user.arr
    },
    groupList() {
      return this.$store.state.api.group.arr
    },
    clientType() {
      const filter: any = {
        面料原料单位: 2,
        纱线原料单位: 2,
        原料加工单位: 3,
        生产织造单位: 4,
        包装辅料单位: 11,
        运输单位: 13
      }
      return filter[this.$route.query.type as string]
    }
  },
  methods: {
    getFinancialDetail() {
      client
        .financialDetail({
          id: Number(this.$route.query.id),
          year: this.year
        })
        .then((res) => {
          console.log(res.data.data)
          this.clientFinancial = res.data.data
        })
    },
    // 获取不同的单据
    getBill() {
      this.listLoading = true
      if (this.clientType === 2) {
        // 物料订购单
        materialOrder
          .list({
            client_id: Number(this.$route.query.id),
            page: this.materialOrderFilter.page,
            limit: 5
          })
          .then((res) => {
            this.materialOrderList = res.data.data.items
            this.listPage = res.data.data.total
            this.materialOrderSts = res.data.data.additional
            this.listLoading = false
          })
      } else if (this.clientType === 3) {
        // 物料加工单
        materialProcess
          .list({
            client_id: Number(this.$route.query.id),
            page: this.materialOrderFilter.page,
            limit: 5
          })
          .then((res) => {
            this.materialProcessList = res.data.data.items
            this.listPage = res.data.data.total
            this.materialProcessSts = res.data.data.additional
            this.listLoading = false
          })
      } else if (this.clientType === 4) {
        // 生产计划单
        productionPlan
          .list({
            client_id: Number(this.$route.query.id),
            page: this.materialOrderFilter.page,
            limit: 5
          })
          .then((res) => {
            console.log(res)
            this.productionPlanList = res.data.data.items
            this.listPage = res.data.data.total
            this.productionPlanSts = res.data.data.additional
            this.listLoading = false
          })
      } else if (this.clientType === 11) {
        // 包装订购单
        packManage
          .orderList({
            client_id: Number(this.$route.query.id),
            page: this.materialOrderFilter.page,
            limit: 5
          })
          .then((res) => {
            console.log(res)
            this.packOrderList = res.data.data.items
            this.listPage = res.data.data.total
            this.packOrderSts = res.data.data.additional
            this.listLoading = false
          })
      } else if (this.clientType === 13) {
        // 发货单
        boxManage
          .list({
            client_id: Number(this.$route.query.id),
            page: this.materialOrderFilter.page,
            limit: 5
          })
          .then((res) => {
            console.log(res)
            this.boxManageList = res.data.data.items
            this.listPage = res.data.data.total
            this.boxManageSts = res.data.data.additional
            this.listLoading = false
          })
      }
    },
    changeShow(item: any) {
      this.listLoading = true
      if (!item.detail) {
        if (this.clientType === 2) {
          materialOrder
            .detail({
              id: item.id
            })
            .then((res) => {
              if (res.status) {
                item.detail = res.data.data
                console.log(item.detail)
                item.isShow = true
              }
              this.listLoading = false
            })
        } else if (this.clientType === 3) {
          materialProcess
            .detail({
              id: item.id
            })
            .then((res) => {
              if (res.status) {
                item.detail = res.data.data
                item.isShow = true
              }
              this.listLoading = false
            })
        } else if (this.clientType === 4) {
          productionPlan
            .detail({
              id: item.id
            })
            .then((res) => {
              if (res.status) {
                item.detail = res.data.data
                item.isShow = true
              }
              this.listLoading = false
            })
        }
      } else {
        item.isShow = !item.isShow
        this.listLoading = false
      }

      this.$forceUpdate()
    },
    getCheckInfo(ev: boolean, item: any, checkList: any[]) {
      if (ev) {
        if (!checkList.find((itemFind) => itemFind.id === item.id)) {
          checkList.push(item)
        }
      } else {
        const index = checkList.map((itemFind) => itemFind.id).indexOf(item.id)
        if (index !== -1) {
          checkList.splice(index, 1)
        }
      }
      this.$forceUpdate()
    },
    checkAllInfo(ev: boolean, list: any[], checkList: any[]) {
      list.forEach((item) => {
        item.checked = ev
        this.getCheckInfo(ev, item, checkList)
      })
      this.$forceUpdate()
    },
    getPaymentLogList() {
      payment
        .list({
          order_id: '',
          client_id: this.$route.query.id as string,
          order_code: this.paymentOrderCode,
          code: this.paymentKeyword,
          start_time: this.paymentDate.length > 1 ? this.paymentDate[0] : '',
          end_time: this.paymentDate.length > 1 ? this.paymentDate[1] : '',
          user_id: this.paymentUser,
          page: this.paymentPage,
          limit: 5
        })
        .then((res) => {
          if (res.data.status) {
            this.paymentLog = res.data.data.items
            this.paymentTotal = res.data.data.total
            this.paymentTotalPrice = res.data.data.additional.total_price
          }
        })
    },
    goPayment(data: any[], update?: boolean) {
      this.paymentUpdate = update
      this.paymentData = data
      this.paymentFlag = true
    },
    getInvoiceLogList() {
      invoice
        .list({
          order_id: '',
          client_id: this.$route.query.id as string,
          order_code: this.invoiceOrderCode,
          code: this.invoiceKeyword,
          start_time: this.invoiceDate.length > 1 ? this.invoiceDate[0] : '',
          end_time: this.invoiceDate.length > 1 ? this.invoiceDate[1] : '',
          user_id: this.invoiceUser,
          page: this.paymentPage,
          limit: 5
        })
        .then((res) => {
          if (res.data.status) {
            this.invoiceLog = res.data.data.items
            this.invoiceTotal = res.data.data.total
            this.invoiceTotalPrice = res.data.data.additional.total_price
          }
        })
    },
    goInvoice(data: any[], update?: boolean) {
      console.log(data)
      this.invoiceUpdate = update
      this.invoiceData = data
      this.invoiceFlag = true
    },
    getDeductList() {
      deduct
        .list({
          order_id: '',
          client_id: this.$route.query.id as string,
          order_code: this.deductOrderCode,
          code: this.deductKeyword,
          start_time: this.deductDate.length > 1 ? this.deductDate[0] : '',
          end_time: this.deductDate.length > 1 ? this.deductDate[1] : '',
          user_id: this.deductUser,
          page: this.deductPage,
          limit: 5
        })
        .then((res) => {
          if (res.data.status) {
            this.deductLog = res.data.data.items
            this.deductTotal = res.data.data.total
            this.deductTotalPrice = res.data.data.additional.total_price
          }
        })
    },
    goDeduct(data: any[], update?: boolean) {
      this.deductUpdate = update
      this.deductData = data
      this.deductFlag = true
    },
    reset() {},
    init() {
      this.getFinancialDetail()
      this.getBill()
      this.getPaymentLogList()
      this.getInvoiceLogList()
      this.getDeductList()
    },
    // 原料名称搜索
    searchMaterial(str: string, cb: any) {
      let results = str ? this.yarnList.filter(this.createFilter(str)) : this.yarnList.slice(0, 10)
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
    saveUpdatePrice() {
      const formCheck = this.$formCheck(this.updatePriceInfo, [
        {
          key: 'material_name',
          errMsg: '请输入物料名称'
        },
        {
          key: 'settle_price',
          errMsg: '请输入结算单价'
        },
        {
          key: 'date',
          errMsg: '请选择日期范围',
          regNormal: 'checkArr'
        }
      ])
      if (!formCheck) {
        this.updatePriceInfo.start_time = this.updatePriceInfo.date[0]
        this.updatePriceInfo.end_time = this.updatePriceInfo.date[1]
        updateSettlePrice(this.updatePriceInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
          }
          this.updatePriceFlag = false
        })
      }
    }
  },
  mounted() {
    this.init()
    yarn.list().then((res) => {
      if (res.data.status) {
        this.yarnList = res.data.data.map((item: any) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      }
    })
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/settlement/paymentDetail.less';
</style>