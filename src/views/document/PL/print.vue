<template>
  <div class='tableCtn'
    id='PLPrint'>
    <div class="headerCtn">
      <div class="top">
        <div class="title">公司名称</div>
        <div class="title2">公司地址</div>
        <div class="title3">Tel:电话&nbsp;&nbsp;Fax:传真</div>
        <div class="title">COMMERICAL INVOICE</div>
      </div>
    </div>
    <div class="tbody noBorder">
      <div class="trow">
        <div class="tcol">To：</div>
        <div class="tcol infoCtn">
          <div class="label">Invoice Number:</div>
          <div class="text">{{documentInfo.invoice}}</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol">{{documentInfo.company_name}}</div>
        <div class="tcol infoCtn">
          <div class="label">PO NO.:</div>
          <div class="text">{{documentInfo.po}}</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol">{{documentInfo.company_address}}</div>
        <div class="tcol infoCtn">
          <div class="label">Date:</div>
          <div class="text">{{documentInfo.date}}</div>
        </div>
      </div>
    </div>
    <div class="tbody">
      <div class="trow">
        <div class="tcol infoCtn">
          <div class="label">LOADING PORT:</div>
          <div class="text">{{PLInfo.from_address}}</div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">DESTINATION PORT:</div>
          <div class="text">{{PLInfo.to_address}}</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol infoCtn">
          <div class="label">PAYMENT TERMS:</div>
          <div class="text">{{PLInfo.payment}}</div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">SHIPMENT DATE:</div>
          <div class="text">{{PLInfo.shipment_date}}</div>
        </div>
      </div>
    </div>
    <div class="tbody">
      <div class="trow">
        <div class="tcol">CTN NO./TTL.</div>
        <div class="tcol">Order No.</div>
        <div class="tcol">ItemNumber</div>
        <div class="tcol">Description</div>
        <div class="tcol">Size</div>
        <div class="tcol">Quantity/PCS</div>
        <div class="tcol">Total CTNS NO.</div>
        <div class="tcol">N.W./KGS</div>
        <div class="tcol">G.W./KGS</div>
        <div class="tcol">Vol/CBM</div>
      </div>
      <div class="trow"
        v-for="(item,index) in PLInfo.box_orders"
        :key="index">
        <div class="tcol">{{item.ctn_no}}</div>
        <div class="tcol">{{item.order_no}}</div>
        <div class="tcol">{{item.item_number}}</div>
        <div class="tcol">{{item.description}}</div>
        <div class="tcol">{{item.size}}</div>
        <div class="tcol">{{item.number}}</div>
        <div class="tcol">{{item.ctn_total}}</div>
        <div class="tcol">{{item.nwkgs}}</div>
        <div class="tcol">{{item.gwkgs}}</div>
        <div class="tcol">{{item.volume}}</div>
      </div>
      <div class="trow">
        <div class="tcol">Total</div>
        <div class="tcol"></div>
        <div class="tcol"></div>
        <div class="tcol"></div>
        <div class="tcol"></div>
        <div class="tcol">Quantity/PCS</div>
        <div class="tcol">Total CTNS NO.</div>
        <div class="tcol">N.W./KGS</div>
        <div class="tcol">G.W./KGS</div>
        <div class="tcol">Vol/CBM</div>
      </div>
    </div>
    <div class="tbody">
      <div class="trow">
        <div class="tcol">
          <div class="label">Remarks:</div>
          <div class="text">{{PLInfo.remarks}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PLInfo } from '@/types/document'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    PLInfo: PLInfo
    [propName: string]: any
  } {
    return {
      PLInfo: {
        document_id: this.$route.params.id,
        to_company_name: '',
        to_company_address: '',
        invoice: '',
        po: '',
        order_date: '',
        from_address: '',
        to_address: '',
        payment: '',
        shipment_date: '',
        box_orders: [
          {
            ctn_no: '',
            order_no: '',
            item_number: '',
            description: '',
            size: '',
            number: '',
            ctn_total: '',
            nwkgs: '',
            gwkgs: '',
            volume: ''
          }
        ],
        remarks: ''
      }
    }
  },
  computed: {
    documentInfo() {
      // @ts-ignore
      return this.$parent.documentInfo
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/document/PL/print.less';
</style>