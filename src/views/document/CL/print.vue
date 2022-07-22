<template>
  <div class='tableCtn'
    id='CLPrint'>
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
    <div class="tbody noBorder">
      <div class="trow">
        <div class="tcol">
          <div class="label">From:</div>
          <div class="text">{{CLInfo.from}}</div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">TO:</div>
          <div class="text">{{CLInfo.to}}</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol">
          <div class="label">PAYMENT TERMS:</div>
          <div class="text">{{CLInfo.payment_terms}}</div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">SHIPMENT DATE:</div>
          <div class="text">{{CLInfo.shipment_date}}</div>
        </div>
      </div>
    </div>
    <div class="tbody"
      v-for="(itemOrder,indexOrder) in CLInfo.orderInfo"
      :key="indexOrder">
      <div class="trow">
        <div class="tcol">ORDER NO</div>
        <div class="tcol">STYLE NO</div>
        <div class="tcol">DESC.</div>
        <div class="tcol">QTY/PCS</div>
        <div class="tcol">UNIT PRICE</div>
        <div class="tcol">Amount</div>
      </div>
      <div class="trow"
        v-for="(itemOD,indexOD) in itemOrder.order_data"
        :key='`order_${indexOD}`'>
        <div class="tcol">{{itemOrder.order_no}} </div>
        <div class="tcol">{{itemOD.style_no}} </div>
        <div class="tcol">{{itemOD.desc}} </div>
        <div class="tcol">{{itemOD.qty_pcs}} </div>
        <div class="tcol">{{itemOD.unit_price}} </div>
        <div class="tcol">{{itemOD.amount}} </div>
      </div>
      <div class="trow"
        v-for="(itemPrice,indexPrice) in itemOrder.price_data"
        :key="`price_${indexPrice}`">
        <div class="tcol">{{itemPrice.content}}</div>
        <div class="tcol">{{itemPrice.price}}</div>
      </div>
      <div class="trow">
        <div class="tcol"
          style="border-right:0">
          <div class="label">TOTAL FOR:</div>
          <div class="text">{{itemOrder.pcs}}</div>
        </div>
        <div class="tcol"
          style="border-right:0">
          <div class="label">PCS:</div>
          <div class="text">{{itemOrder.amount}}</div>
        </div>
        <div class="tcol">货币单位匹配</div>
      </div>
    </div>
    <div class="tbody">
      <div class="trow">
        <div class="tcol">ORDER NO</div>
        <div class="tcol">STYLE NO</div>
        <div class="tcol">DESC.</div>
        <div class="tcol">QTY/PCS</div>
        <div class="tcol">UNIT PRICE</div>
        <div class="tcol">Amount</div>
      </div>
      <div class="trow">
        <div class="tcol"></div>
        <div class="tcol"></div>
        <div class="tcol"></div>
        <div class="tcol"></div>
        <div class="tcol"></div>
        <div class="tcol"></div>
      </div>
      <div class="trow">
        <div class="tcol">占位看效果用的</div>
        <div class="tcol"
          style="max-width:196px">占位看效果用的</div>
      </div>
      <div class="trow">
        <div class="tcol"
          style="border-right:0">
          <div class="label">TOTAL FOR:</div>
          <div class="text"></div>
        </div>
        <div class="tcol"
          style="border-right:0">
          <div class="label">PCS:</div>
        </div>
        <div class="tcol">货币单位匹配</div>
      </div>
    </div>
    <div class="tbody">
      <div class="trow">
        <div class="tcol"
          style="border-right:0">
          <div class="label">TOTAL FOR:</div>
          <div class="text"></div>
        </div>
        <div class="tcol"
          style="border-right:0">
          <div class="label">PCS:</div>
        </div>
        <div class="tcol">货币单位匹配</div>
      </div>
      <div class="trow">
        <div class="tcol">
          <div class="label">TOTAL VALUE:</div>
          <div class="text"></div>
        </div>
      </div>
    </div>
    <div style="display:flex">
      <div class="tbody noBorder"
        style="flex:1;margin-right:12px;display: inline-flex;flex-direction: column;">
        <div class="trow">
          <div class="tcol">
            <div class="label">Bank Information:</div>
          </div>
        </div>
        <div class="trow">
          <div class="tcol">
            <div class="label">Bank:</div>
            <div class="text">{{CLInfo.bank}}</div>
          </div>
        </div>
        <div class="trow">
          <div class="tcol">
            <div class="label">Address:</div>
            <div class="text">{{CLInfo.address}}</div>
          </div>
        </div>
        <div class="trow">
          <div class="tcol">
            <div class="label">SWIFT:</div>
            <div class="text">{{CLInfo.code}}</div>
          </div>
        </div>
        <div class="trow">
          <div class="tcol">
            <div class="label">Beneficiary:</div>
            <div class="text">{{CLInfo.beneficiary}}</div>
          </div>
        </div>
        <div class="trow">
          <div class="tcol">
            <div class="label">Account No:</div>
            <div class="text">{{CLInfo.account_no}}</div>
          </div>
        </div>
      </div>
      <div class="tbody"
        style="width:323px">
        <div class="trow">
          <div class="tcol">
            <div class="label">Remark:</div>
            <div class="text">{{CLInfo.remarks}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CLInfo } from '@/types/document'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    CLInfo: CLInfo
    [propName: string]: any
  } {
    return {
      CLInfo: {
        document_id: this.$route.params.id,
        bank: '',
        address: '',
        code: '',
        beneficiary: '',
        account_no: '',
        remarks: '',
        to_company_name: '',
        to_company_address: '',
        invoice: '',
        po: '',
        order_date: '',
        from_address: '',
        to_address: '',
        payment: '',
        shipment_date: '',
        total_for: '',
        orderInfo: [
          {
            order_data: [
              {
                style_no: '',
                desc: '',
                qty_pcs: '',
                unit_price: '',
                amount: ''
              }
            ],
            price_data: [
              {
                content: '',
                price: ''
              }
            ],
            order_no: '',
            pcs: '',
            amount: ''
          }
        ]
      }
    }
  },
  computed: {
    documentInfo() {
      // @ts-ignore
      return this.$parent.documentInfo
    }
  },
  methods: {}
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/document/CL/print.less';
</style>