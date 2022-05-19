<template>
  <div id="collectionDetail"
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
              <div class="row"
                style="margin:0">
                <div class="col flex3">
                  <div class="label">姓名：</div>
                  <div class="text">{{item.name}}</div>
                </div>
                <div class="col flex3">
                  <div class="label">电话：</div>
                  <div class="text">{{item.phone}}</div>
                </div>
                <div class="col">
                  <div class="label">职务：</div>
                  <div class="text">{{item.station}}</div>
                </div>
                <div class="col">
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
        <div class="title">统计报表
          <el-tooltip class="item"
            effect="dark"
            content="以下统计已默认将美元按汇率转成了人民币，如需单独显示，请单独筛选人民币或者美元币种"
            placement="right">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
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
          <div class="elCtn">
            <el-select placeholder="筛选币种"
              v-model="settle_unit_sts"
              @change="getFinancialDetail"
              clearable>
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
      </div>
      <div class="specialCtn">
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col">
                <div class="infoCtn">
                  <span class="title">订单下单数量</span>
                  <span class="number blue">{{clientFinancial.total_order_number}}
                    <span class="unit">万</span>
                  </span>
                </div>
              </div>
              <div class="col">
                <div class="infoCtn">
                  <span class="title">订单下单总额</span>
                  <span class="number blue">
                    <template v-if="!settle_unit_sts"> {{clientFinancial.total_order_price}}</template>
                    <template v-else-if="settle_unit_sts==='元'"> {{clientFinancial.total_order_price_rmb}}</template>
                    <template v-else-if="settle_unit_sts==='美元'"> {{clientFinancial.total_order_price_usd}}</template>
                    <span class="unit">万{{settle_unit_sts?settle_unit_sts:'元'}}</span>
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
                  <span class="number green">{{clientFinancial.total_transport_number}}
                    <span class="unit">万</span>
                  </span>
                </div>
              </div>
              <div class="col">
                <div class="infoCtn">
                  <span class="title">实际发货总额</span>
                  <span class="number green">
                    <template v-if="!settle_unit_sts"> {{clientFinancial.total_transport_price}}</template>
                    <template v-else-if="settle_unit_sts==='元'"> {{clientFinancial.total_transport_price_rmb}}</template>
                    <template v-else-if="settle_unit_sts==='美元'"> {{clientFinancial.total_transport_price_usd}}</template>
                    <span class="unit">万{{settle_unit_sts?settle_unit_sts:'元'}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="infoCtn">
              <span class="title">客户扣款金额</span>
              <span class="number orange">{{clientFinancial.total_deduct_price}}
                <span class="unit">万元</span>
              </span>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">
                <div class="infoCtn">
                  <span class="title">我方已开票金额</span>
                  <span class="number green">{{clientFinancial.total_invoice_price}}
                    <span class="unit">万元</span>
                  </span>
                </div>
              </div>
              <div class="col">
                <div class="infoCtn">
                  <span class="title">我方已收款金额</span>
                  <span class="number green">{{clientFinancial.total_collect_price}}
                    <span class="unit">万元</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      id="下单明细">
      <div class="titleCtn">
        <div class="title">下单明细</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="keyword"
              placeholder="筛选报价/产品/样品编号"
              @keydown.enter.native="getOrderList"></el-input>
          </div>
          <div class="elCtn">
            <el-select placeholder="请选择公司联系人"
              v-model="contacts_id"
              no-data-text="请先选择下单公司"
              filterable
              clearable
              @change="getOrderList">
              <el-option v-for="item in contactsList"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select v-model="type"
              placeholder="订单状态筛选"
              @change="getOrderList">
              <el-option label="全部"
                value="null"></el-option>
              <el-option label="已创建"
                :value="1"></el-option>
              <el-option label="进行中"
                :value="2"></el-option>
              <el-option label="已完成"
                :value="3"></el-option>
              <el-option label="已取消"
                :value="5"></el-option>
              <el-option label="已延期"
                :value="6"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select placeholder="请选择下单币种"
              v-model="settle_unit"
              @change="getOrderList"
              clearable>
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
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select @change="getOrderList"
              v-model="user_id"
              placeholder="筛选创建人"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="getOrderList"
              v-model="group_id"
              placeholder="筛选负责小组"
              clearable>
              <el-option v-for="item in groupList"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getOrderList"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="elCtn">
            <el-select v-model="order_type"
              @change="getOrderList">
              <el-option label="所有单据"
                :value="null"></el-option>
              <el-option label="订单"
                :value="1"></el-option>
              <el-option label="样单"
                :value="2"></el-option>
            </el-select>
          </div>
        </div>
        <div class="filterCtn clearfix">
          <div class="label">已勾选单据：</div>
          <div class="elCtn check"
            v-for="(item,index) in orderCheckList"
            :key="item.id">
            <el-input v-model="item.code"
              disabled>
              <template slot="append">
                <i class="el-icon-close hoverRed"
                  style="cursor:pointer"
                  @click="orderCheckList.splice(index,1)"></i>
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
                  @click="goCollection(orderCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量收款</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="goInvoice(orderCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量开票</span>
                </div>
                <div class="btn backHoverRed"
                  @click="goDeduct(orderCheckList)">
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
        <zh-list :list="orderList"
          :listKey="originalSetting"
          :check="true"
          :checkedCount="orderCheckList"
          :loading="orderLoading"
          :oprList="oprList"></zh-list>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="orderTotal"
            :current-page.sync="orderPage"
            @current-change="getOrderList">
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
        <div class="filterCtn clearfix">
          <div class="btn backHoverBlue"
            @click="exportExcel(1,'invoice')">
            <span class="text">导出月度报表</span>
          </div>
          <div class="btn backHoverBlue"
            @click="exportExcel(2,'invoice')">
            <span class="text">导出季度报表</span>
          </div>
          <div class="btn backHoverBlue"
            @click="exportExcel(3,'invoice')">
            <span class="text">导出年度报表</span>
          </div>
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
              <span class="opr blue"
                @click="goCollection([{ order_id: item.order_id, doc_code: item.order_code, rel_doc_id: item.rel_doc_id, price: item.price, desc: '', complete_time: $getDate(new Date()) }],false,true)">收款</span>
              <span class="opr orange"
                @click="goInvoice([item],true)">修改</span>
              <span class="opr red">删除</span>
            </div>
          </div>
          <div class="row">
            <div class="col">合计：</div>
            <div class="col"></div>
            <div class="col green bold">{{invoiceTotalPrice}}万元</div>
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
      id="收款单据">
      <div class="titleCtn">
        <div class="title">收款单据</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="collectionOrderCode"
              placeholder="搜索订单号"
              @keydown.enter.native="getCollectionLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="collectionKeyword"
              placeholder="搜索票据编号"
              @keydown.enter.native="getCollectionLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-select @change="getCollectionLogList"
              v-model="collectionUser"
              placeholder="筛选创建人"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="collectionDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getCollectionLogList"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="backHoverBlue btn">搜索</div>
        </div>
        <div class="filterCtn clearfix">
          <div class="btn backHoverBlue"
            @click="exportExcel(1,'collection')">
            <span class="text">导出月度报表</span>
          </div>
          <div class="btn backHoverBlue"
            @click="exportExcel(2,'collection')">
            <span class="text">导出季度报表</span>
          </div>
          <div class="btn backHoverBlue"
            @click="exportExcel(3,'collection')">
            <span class="text">导出年度报表</span>
          </div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">票据编号</div>
            <div class="col">关联订单号</div>
            <div class="col">收款金额</div>
            <div class="col">备注信息</div>
            <div class="col">收款人</div>
            <div class="col">收款日期</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in collectionLog"
            :key="item.id">
            <div class="col">{{item.code}}</div>
            <div class="col">{{item.order_code||'未关联订单'}}</div>
            <div class="col">{{item.price}}元</div>
            <div class="col">{{item.desc}}</div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.created_at}}</div>
            <div class="col oprCtn">
              <span class="opr orange"
                @click="goCollection([item],true)">修改</span>
              <span class="opr red">删除</span>
            </div>
          </div>
          <div class="row">
            <div class="col">合计：</div>
            <div class="col"></div>
            <div class="col green bold">{{collectionTotalPrice}}万元</div>
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
            :total="collectionTotal"
            :current-page.sync="collectionPage"
            @current-change="getCollectionLogList">
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
        <div class="filterCtn clearfix">
          <div class="btn backHoverBlue"
            @click="exportExcel(1,'deduct')">
            <span class="text">导出月度报表</span>
          </div>
          <div class="btn backHoverBlue"
            @click="exportExcel(2,'deduct')">
            <span class="text">导出季度报表</span>
          </div>
          <div class="btn backHoverBlue"
            @click="exportExcel(3,'deduct')">
            <span class="text">导出年度报表</span>
          </div>
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
            <div class="col green bold">{{deductTotalPrice}}万元</div>
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
            @click="goCollection([])">直接收款</div>
          <div class="btn backHoverRed"
            @click="goDeduct([])">直接扣款</div>
        </div>
      </div>
    </div>
    <!-- 收款 -->
    <zh-collection :type="1"
      :update="collectionUpdate"
      :invoiceChange="invoiceChange"
      :show="collectionFlag"
      :data="collectionData"
      :client_name="clientFinancial.name"
      :client_id="$route.query.id"
      @close="collectionFlag=false;init()"></zh-collection>
    <!-- 开票 -->
    <zh-invoice :type="1"
      :update="invoiceUpdate"
      :show="invoiceFlag"
      :data="invoiceData"
      :client_name="clientFinancial.name"
      :client_id="$route.query.id"
      @close="invoiceFlag=false;init()"></zh-invoice>
    <!-- 扣款 -->
    <zh-deduct :type="1"
      :update="deductUpdate"
      :show="deductFlag"
      :data="deductData"
      :client_name="clientFinancial.name"
      :client_id="$route.query.id"
      @close="deductFlag=false;init()"></zh-deduct>
    <!-- 侧边导航栏 -->
    <zh-side-nav :data="[{
      name:'基本信息',
      mark:'#基本信息'
    },{
      name:'统计报表',
      mark:'#统计报表'
    },{
      name:'下单明细',
      mark:'#下单明细'
    },{
      name:'开票单据',
      mark:'#开票单据'
    },{
      name:'收款单据',
      mark:'#收款单据'
    },{
      name:'扣款单据',
      mark:'#扣款单据'
    }]"></zh-side-nav>
  </div>
</template>

<script lang="ts">
import { client, collection, deduct, order, invoice } from '@/assets/js/api'
import { moneyArr } from '@/assets/js/dictionary'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      invoiceChange: false, // 开票转收款
      collectionFlag: false,
      collectionData: [],
      collectionLog: [],
      collectionTotalPrice: 0,
      collectionTotal: 1,
      collectionPage: 1,
      collectionUpdate: false,
      collectionOrderCode: '',
      collectionKeyword: '',
      collectionDate: [],
      collectionUser: '',
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
        total_collect_price: 0,
        total_deduct_price: 0,
        total_invoice_price: 0,
        total_order_number: 0,
        total_order_price: 0,
        total_order_price_rmb: 0,
        total_order_price_usd: 0,
        total_transport_price: 0,
        total_transport_price_rmb: 0,
        total_transport_price_usd: 0,
        total_transport_number: 0,
        status: 0,
        name: '',
        client_type_name: '',
        alias: '',
        contacts_data: []
      },
      originalSetting: [
        {
          key: 'code',
          name: '单据编号',
          ifShow: true,
          ifLock: true,
          ifCaogao: 'order_type',
          caogaoArr: ['订', '样'],
          index: 0
        },
        {
          key: 'client_name',
          name: '下单公司',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'contacts_name',
          name: '公司联系人',
          ifShow: true,
          ifLock: false,
          index: 2
        },
        {
          key: 'invoice_status',
          name: '开票状态',
          ifShow: true,
          ifLock: false,
          index: 11,
          filterArr: ['', '已开票', '待开票'],
          classArr: ['', 'green', 'orange']
        },
        {
          key: 'collect_status',
          name: '收款状态',
          ifShow: true,
          ifLock: false,
          index: 12,
          filterArr: ['', '已收款', '待收款'],
          classArr: ['', 'green', 'orange']
        },
        {
          key: 'product_code',
          otherkey: 'system_code',
          name: '产品编号',
          ifShow: true,
          ifLock: false,
          index: 3,
          from: 'product_data',
          mark: true
        },
        {
          key: 'image_data',
          name: '产品图片',
          ifShow: true,
          ifLock: false,
          ifImage: true,
          index: 4,
          from: 'product_data'
        },
        {
          key: 'group_name',
          name: '负责小组',
          ifShow: true,
          ifLock: false,
          index: 5
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 6
        },
        {
          key: 'total_number',
          name: '下单总数',
          ifShow: true,
          ifLock: false,
          index: 7,
          errVal: '0'
        },
        {
          key: 'total_price',
          name: '下单总额',
          ifShow: true,
          ifLock: false,
          index: 8,
          errVal: '0'
        },
        {
          key: 'total_transport_number',
          name: '发货总数',
          ifShow: true,
          ifLock: false,
          index: 9,
          errVal: '0'
        },
        {
          key: 'total_transport_price',
          name: '发货总额',
          ifShow: true,
          ifLock: false,
          index: 10,
          errVal: '0'
        }
      ],
      oprList: [
        // {
        //   name: '开票',
        //   class: 'orange',
        //   fn: (item: any) => {
        //     // @ts-ignore
        //     this.goInvoice([item])
        //   }
        // },
        // {
        //   name: '收款',
        //   class: 'blue',
        //   fn: (item: any) => {
        //     // @ts-ignore
        //     this.goCollection([item])
        //   }
        // },
        // {
        //   name: '扣款',
        //   class: 'red',
        //   fn: (item: any) => {
        //     // @ts-ignore
        //     this.goDeduct([item])
        //   }
        // },
        {
          name: '详情',
          class: 'blue',
          fn: (item: any) => {
            this.$openUrl('/order/detail?id=' + item.id)
          }
        }
      ],
      orderCheckList: [],
      orderList: [],
      orderLoading: true,
      orderPage: 1,
      orderTotal: 1,
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
      year: new Date().getFullYear().toString(),
      keyword: '',
      contacts_id: '',
      contactsList: [],
      client_id: [],
      group_id: '',
      user_id: '',
      type: 'null',
      status: 'null',
      settle_unit: '',
      settle_unit_sts: '',
      date: [],
      order_type: 1,
      unitArr: moneyArr
    }
  },
  computed: {
    userList() {
      return this.$store.state.api.user.arr
    },
    groupList() {
      return this.$store.state.api.group.arr
    }
  },
  methods: {
    init() {
      this.getFinancialDetail()
      this.getOrderList()
      this.getCollectionLogList()
      this.getInvoiceLogList()
      this.getDeductList()
    },
    exportExcel(type: number, payType: string) {
      this.loading = true

      let start_time = ''
      let end_time = ''
      let y = new Date().getFullYear()
      let m = new Date().getMonth() + 1
      // @ts-ignore
      let q = Math.floor(m % 3 == 0 ? m / 3 : m / 3 + 1)

      switch (type) {
        case 1:
          start_time = new Date(y, m - 1, 1).toLocaleDateString().replaceAll('/', '-')
          end_time = new Date(y, m, 0).toLocaleDateString().replaceAll('/', '-')
          break
        case 2:
          start_time = new Date(y, (q - 1) * 3, 1).toLocaleDateString().replaceAll('/', '-')
          end_time = new Date(y, q * 3, 0).toLocaleDateString().replaceAll('/', '-')
          break
        case 3:
          start_time = y + '-01-01'
          end_time = y + '-12-31'
          break
      }
      if (payType === 'invoice') {
        invoice
          .list({
            start_time: start_time,
            end_time: end_time,
            export_excel: 1,
            client_id: this.$route.query.id as string
          })
          .then((res) => {
            window.location.href = res.data.data
            this.loading = false
          })
      } else if (payType === 'deduct') {
        deduct
          .list({
            start_time: start_time,
            end_time: end_time,
            export_excel: 1,
            client_id: this.$route.query.id as string
          })
          .then((res) => {
            window.location.href = res.data.data
            this.loading = false
          })
      } else {
        collection
          .list({
            start_time: start_time,
            end_time: end_time,
            export_excel: 1,
            client_id: this.$route.query.id as string
          })
          .then((res) => {
            window.location.href = res.data.data
            this.loading = false
          })
      }
    },
    getContacts() {
      client
        .detail({
          id: Number(this.$route.query.id)
        })
        .then((res) => {
          if (res.data.status) {
            this.contactsList = res.data.data.contacts_data
          }
        })
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.client_id = []
          this.keyword = ''
          this.user_id = ''
          this.group_id = ''
          this.date = []
          this.type = 'null'
          this.status = 'null'
          this.contacts_id = ''
          this.limit = 10
          this.getOrderList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    getFinancialDetail() {
      client
        .financialDetail({
          id: Number(this.$route.query.id),
          year: this.year,
          settle_unit: this.settle_unit_sts
        })
        .then((res) => {
          this.clientFinancial = res.data.data
        })
    },
    getOrderList() {
      this.orderLoading = true
      order
        .list({
          order_type: this.order_type,
          client_id: this.$route.query.id,
          keyword: this.keyword,
          page: this.orderPage,
          limit: 10,
          is_check: this.status,
          status: this.type,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : '',
          user_id: this.user_id,
          group_id: this.group_id,
          contacts_id: this.contacts_id,
          settle_unit: this.settle_unit
        })
        .then((res) => {
          if (res.data.status) {
            this.orderList = res.data.data.items
            this.orderList.forEach((item: any) => {
              item.collect_status = item.has_collect.status
              item.invoice_status = item.has_invoice.status
            })
            this.orderTotal = res.data.data.total
            this.orderLoading = false
          }
          this.orderLoading = false
        })
    },
    getCollectionLogList() {
      collection
        .list({
          order_id: '',
          client_id: this.$route.query.id as string,
          order_code: this.collectionOrderCode,
          code: this.collectionKeyword,
          start_time: this.collectionDate.length > 1 ? this.collectionDate[0] : '',
          end_time: this.collectionDate.length > 1 ? this.collectionDate[1] : '',
          user_id: this.collectionUser,
          page: this.collectionPage,
          limit: 5
        })
        .then((res) => {
          if (res.data.status) {
            this.collectionLog = res.data.data.items
            this.collectionTotal = res.data.data.total
            this.collectionTotalPrice = this.$toFixed(res.data.data.additional.total_price / 10000)
          }
        })
    },
    goCollection(data: any[], update?: boolean, invoiceChange?: boolean) {
      this.invoiceChange = invoiceChange
      this.collectionUpdate = update
      this.collectionData = data
      this.collectionFlag = true
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
          page: this.collectionPage,
          limit: 5
        })
        .then((res) => {
          if (res.data.status) {
            this.invoiceLog = res.data.data.items
            this.invoiceTotal = res.data.data.total
            this.invoiceTotalPrice = this.$toFixed(res.data.data.additional.total_price / 10000)
          }
        })
    },
    goInvoice(data: any[], update?: boolean) {
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
            this.deductTotalPrice = this.$toFixed(res.data.data.additional.total_price / 10000)
          }
        })
    },
    goDeduct(data: any[], update?: boolean) {
      this.deductUpdate = update
      this.deductData = data
      this.deductFlag = true
    }
  },
  mounted() {
    this.init()
    this.getContacts()
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
@import '~@/assets/css/settlement/collectionDetail.less';
</style>