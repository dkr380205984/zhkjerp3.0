<template>
  <div id="collectionDetail"
    class="bodyContainer">
    <div class="module">
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
            <div class="text">{{clientFinancial.status}}</div>
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
    <div class="module">
      <div class="titleCtn">
        <div class="title">统计报表</div>
      </div>
      <div class="specialCtn">
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col">
                <div class="infoCtn">
                  <span class="title">订单下单数量</span>
                  <span class="number blue">{{clientFinancial.total_order_number/10000}}
                    <span class="unit">万</span>
                  </span>
                </div>
              </div>
              <div class="col">
                <div class="infoCtn">
                  <span class="title">订单下单总额</span>
                  <span class="number blue">{{clientFinancial.total_order_price/10000}}
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
                  <span class="number green">{{clientFinancial.total_transport_number/10000}}
                    <span class="unit">万</span>
                  </span>
                </div>
              </div>
              <div class="col">
                <div class="infoCtn">
                  <span class="title">实际发货总额</span>
                  <span class="number green">{{clientFinancial.total_transport_price/10000}}
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
              <span class="title">客户扣款金额</span>
              <span class="number orange">{{clientFinancial.total_deduct_price/10000}}
                <span class="unit">万元</span>
              </span>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <div class="col">
                <div class="infoCtn">
                  <span class="title">我方已开票金额</span>
                  <span class="number green">{{clientFinancial.total_invoice_price/10000}}
                    <span class="unit">万元</span>
                  </span>
                </div>
              </div>
              <div class="col">
                <div class="infoCtn">
                  <span class="title">我方已收款金额</span>
                  <span class="number green">{{clientFinancial.total_collect_price/10000}}
                    <span class="unit">万元</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">下单明细</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn clearfix">
          <div class="label">已勾选单据：</div>
          <div class="elCtn check"
            v-for="item in orderCheckList"
            :key="item.id">
            <el-input v-model="item.code"
              disabled></el-input>
          </div>
          <div class="buttonList fr">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">批量操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverBlue">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量收款</span>
                </div>
                <div class="btn backHoverOrange">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量开票</span>
                </div>
                <div class="btn backHoverOrange">
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
          :loading="orderLoading"
          :oprList="oprList"></zh-list>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="order_total"
            :current-page.sync="order_page"
            @current-change="getOrderList">
          </el-pagination>
        </div>
      </div>

    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">操作日志</div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverBlue"
            @click="collectionFlag=true">直接收款</div>
          <div class="btn backHoverOrange">直接开票</div>
          <div class="btn backHoverRed">直接扣款</div>
        </div>
      </div>
    </div>
    <zh-collection :type="1"
      :show="collectionFlag"
      :client_name="clientFinancial.name"
      :client_id="$route.query.id"
      @close="collectionFlag=false;init()"></zh-collection>
  </div>
</template>

<script lang="ts">
import { client, order } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      collectionFlag: false,
      clientFinancial: {
        total_collect_price: 0,
        total_deduct_price: 0,
        total_invoice_price: 0,
        total_order_number: 0,
        total_order_price: 0,
        total_transport_price: 0,
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
          key: 'total_number',
          name: '下单总数',
          ifShow: true,
          ifLock: false,
          index: 5,
          errVal: '0'
        },
        {
          key: '',
          name: '流程进度',
          ifShow: true,
          ifLock: false,
          index: 6,
          specialForOrderPrcess: 'order'
        },
        {
          key: 'group_name',
          name: '负责小组',
          ifShow: true,
          ifLock: false,
          index: 8
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 9
        }
      ],
      oprList: [
        {
          name: '收款',
          class: 'blue',
          fn: (item: any) => {
            //  this.
          }
        },
        {
          name: '开票',
          class: 'orange',
          fn: (item: any) => {
            //  this.
          }
        },
        {
          name: '扣款',
          class: 'red',
          fn: (item: any) => {
            //  this.
          }
        },
        {
          name: '勾选',
          class: 'blue',
          fn: (item: any) => {
            //  this.
          }
        }
      ],
      orderCheckList: [],
      orderList: [],
      orderLoading: true,
      order_page: 1,
      order_total: 1
    }
  },
  methods: {
    init() {
      client
        .financialDetail({
          id: Number(this.$route.query.id)
        })
        .then((res) => {
          console.log(res)
          this.clientFinancial = res.data.data
        })
      this.getOrderList()
    },
    getOrderList() {
      this.orderLoading = true
      order
        .list({
          client_id: this.$route.query.id,
          keyword: '',
          page: this.order_page,
          limit: 10,
          // is_check: this.status,
          // status: this.type,
          start_time: '',
          end_time: '',
          user_id: '',
          group_id: '',
          contacts_id: ''
        })
        .then((res) => {
          if (res.data.status) {
            this.orderList = res.data.data.items
            this.order_total = res.data.data.total
            this.orderLoading = false
          }
          this.orderLoading = false
        })
    }
  },
  mounted() {
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/settlement/collectionDetail.less';
</style>