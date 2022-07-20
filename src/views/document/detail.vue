<template>
  <div id="documentDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col flex3">
            <div class="label">Po Number：</div>
            <div class="text"></div>
          </div>
          <div class="col flex3">
            <div class="label">Invoice Number：</div>
            <div class="text"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">Order Date：</div>
            <div class="text"></div>
          </div>
          <div class="col">
            <div class="label">Ex-factory Date：</div>
            <div class="text"></div>
          </div>
          <div class="col">
            <div class="label">Shipment Date：</div>
            <div class="text"></div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">From：</div>
            <div class="text"></div>
          </div>
          <div class="col flex3">
            <div class="label">To：</div>
            <div class="text"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">Loading Port：</div>
            <div class="text"></div>
          </div>
          <div class="col">
            <div class="label">Destination Port：</div>
            <div class="text"></div>
          </div>
          <div class="col">
            <div class="label">Currency System：</div>
            <div class="text"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">Payment Term：</div>
            <div class="text"></div>
          </div>
          <div class="col">
            <div class="label">Company Name：</div>
            <div class="text"></div>
          </div>
          <div class="col">
            <div class="label">Company Address：</div>
            <div class="text"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">包含订单</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">订单号</div>
            <div class="tcol">下单公司</div>
            <div class="tcol">下单数量</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow">
            <div class="tcol">订单号</div>
            <div class="tcol">下单公司</div>
            <div class="tcol">下单数量</div>
          </div>
        </div>
      </div>
    </div>
    <div class="topTagCtn">
      <div class="tag"
        :class="{'acitve':type==='CL'}"
        @click="goRouter('CL')">
        <span class="text">形式发票</span>
        <span class="text">Commercial Invoice</span>
      </div>
      <div class="tag"
        :class="{'acitve':type==='PL'}"
        @click="goRouter('PL')">
        <span class="text">装箱单</span>
        <span class="text">Packing list</span>
      </div>
      <div class="tag">
        <span class="text">出口货物报关单</span>
        <span class="text">Export declaration</span>
      </div>
      <div class="tag">
        <span class="text">申报要素</span>
        <span class="text">Declare elements</span>
      </div>
      <div class="tag">
        <span class="text">货运委托书</span>
        <span class="text">Entrusting transport</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">标题
          <div class="btn backHoverOrange fr"
            style="margin-top:11px;font-weight:normal;margin-left:12px">打印</div>
          <div class="btn backHoverBlue fr"
            style="margin-top:11px;font-weight:normal"
            @click="edit">编辑</div>
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: false,
      documentInfo: {
        id: '',
        document_orders: [],
        po: '',
        invoice: '',
        payment: '',
        to_company_name: '',
        to_company_address: '',
        order_date: '',
        ex_factory_date: '',
        shipment_date: '',
        from_address: '',
        to_address: '',
        loading_port: '',
        destination_port: '',
        currency_system: ''
      },
      type: ''
    }
  },
  methods: {
    goRouter(type: string) {
      this.type = type
      this.$router.push('/document/detail/' + type + '/print')
    },
    edit() {
      this.$router.push('/document/detail/' + this.type + '/edit')
    }
  },
  mounted() {
    console.log(this.$route)
    if (this.$route.name === '形式发票详情' || this.$route.name === '形式发票编辑') {
      this.type = 'CL'
    }
  }
})
</script>

<style lang="less">
@import '~@/assets/css/document/detail.less';
</style>