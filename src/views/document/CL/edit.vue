<template>
  <div class='tableCtn'
    id="CLEdit">
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
          <div class="elCtn">
            <el-input placeholder="发票号码"
              v-model="documentInfo.invoice"></el-input>
          </div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol">
          <div class="elCtn">
            <el-input placeholder="公司名称(company name)"
              v-model="documentInfo.company_name"></el-input>
          </div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">PO NO.:</div>
          <div class="elCtn">
            <el-input placeholder="订单号"
              v-model="documentInfo.po"></el-input>
          </div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol">
          <div class="elCtn">
            <el-input placeholder="公司地址(company address)"
              v-model="documentInfo.company_address"></el-input>
          </div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">Date:</div>
          <div class="elCtn">
            <el-input placeholder="下单日期"
              v-model="documentInfo.date"></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="tbody noBorder">
      <div class="trow">
        <div class="tcol infoCtn">
          <div class="label">From:</div>
          <div class="elCtn">
            <el-input v-model="CLInfo.from"
              placeholder="生产地"></el-input>
          </div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">TO:</div>
          <div class="elCtn">
            <el-input v-model="CLInfo.to"
              placeholder="发货地"></el-input>
          </div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol infoCtn">
          <div class="label">PAYMENT TERMS:</div>
          <div class="elCtn">
            <el-autocomplete v-model="CLInfo.payment_terms"
              placeholder="付款方式"></el-autocomplete>
          </div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">SHIPMENT DATE:</div>
          <div class="elCtn">
            <el-input v-model="CLInfo.shipment_date"
              placeholder="发货日期"></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="tbody"
      v-for="(itemOrder,indexOrder) in CLInfo.orderInfo"
      :key="indexOrder">
      <div class="trow">
        <el-tooltip class="item"
          effect="dark"
          content="添加订单"
          placement="top">
          <div class="el-icon-circle-plus icon1 hoverBlue"
            v-if="indexOrder===0"
            @click="$addItem(CLInfo.orderInfo,{
            order_data: [{
              style_no: '',
              desc: '',
              qty_pcs: '',
              unit_price: '',
              amount: ''
            }],
            price_data: [{
              content: '',
              price: ''
            }],
            order_no: '',
            pcs: '',
            amount: ''
          })"></div>
        </el-tooltip>
        <el-tooltip class="item"
          effect="dark"
          content="删除订单"
          placement="top">
          <div class="el-icon-remove icon1 hoverRed"
            v-if="indexOrder>0"
            @click="$deleteItem(CLInfo.orderInfo,indexOrder)"></div>
        </el-tooltip>
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
        <el-tooltip class="item"
          effect="dark"
          content="添加产品"
          placement="top">
          <div class="el-icon-circle-plus icon1 hoverBlue"
            v-if="indexOD===0"
            @click="$addItem(itemOrder.order_data,{
              style_no: '',
              desc: '',
              qty_pcs: '',
              unit_price: '',
              amount: ''
          })"></div>
        </el-tooltip>
        <el-tooltip class="item"
          effect="dark"
          content="删除产品"
          placement="top">
          <div class="el-icon-remove icon1 hoverRed"
            v-if="indexOD>0"
            @click="$deleteItem(itemOrder.order_data,indexOD)"></div>
        </el-tooltip>
        <div class="tcol">
          <div class="elCtn">
            <el-select v-model="itemOrder.order_no"
              placeholder="选择订单号"></el-select>
          </div>
        </div>
        <div class="tcol">
          <div class="elCtn">
            <el-select v-model="itemOrder.style_no"
              placeholder="选择款号"></el-select>
          </div>
        </div>
        <div class="tcol">
          <div class="elCtn">
            <el-input placeholder="产品描述"
              v-model="itemOD.desc"></el-input>
          </div>
        </div>
        <div class="tcol">
          <div class="elCtn">
            <el-input placeholder="输入数量"
              v-model="itemOD.qty_pcs"></el-input>
          </div>
        </div>
        <div class="tcol">
          <div class="elCtn">
            <el-input placeholder="输入单价"
              v-model="itemOD.unit_price"></el-input>
          </div>
        </div>
        <div class="tcol">
          <div class="elCtn">
            <el-input placeholder="输入总价"
              v-model="itemOD.amount"></el-input>
          </div>
        </div>
      </div>
      <div class="trow"
        v-for="(itemPrice,indexPrice) in itemOrder.price_data"
        :key="`price_${indexPrice}`">
        <el-tooltip class="item"
          effect="dark"
          content="添加额外费用"
          placement="top">
          <div class="el-icon-circle-plus icon1 hoverBlue"
            v-if="indexPrice===0"
            @click="$addItem(itemOrder.price_data,{
              content: '',
              price: ''
          })"></div>
        </el-tooltip>
        <el-tooltip class="item"
          effect="dark"
          content="删除额外费用"
          placement="top">
          <div class="el-icon-remove icon1 hoverRed"
            v-if="indexPrice>0"
            @click="$deleteItem(itemOrder.price_data,indexPrice)"></div>
        </el-tooltip>
        <div class="tcol">
          <div class="elCtn">
            <el-input placeholder="额外费用名称"
              v-model="itemPrice.content"></el-input>
          </div>
        </div>
        <div class="tcol"
          style="max-width:196px">
          <div class="elCtn">
            <el-input placeholder="额外费用"
              v-model="itemPrice.price"></el-input>
          </div>
        </div>
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
        style="flex:1;margin-right:12px;display:inline-flex;flex-direction:column;">
        <div class="trow">
          <div class="tcol infoCtn">
            <div class="label">Bank Information:</div>
          </div>
        </div>
        <div class="trow">
          <div class="tcol infoCtn">
            <div class="label">Bank:</div>
            <div class="elCtn">
              <el-input placeholder="银行名称"
                v-model="CLInfo.bank"></el-input>
            </div>
          </div>
        </div>
        <div class="trow">
          <div class="tcol infoCtn">
            <div class="label">Address:</div>
            <div class="elCtn">
              <el-input placeholder="银行抵制"
                v-model="CLInfo.address"></el-input>
            </div>
          </div>
        </div>
        <div class="trow">
          <div class="tcol infoCtn">
            <div class="label">SWIFT:</div>
            <div class="elCtn">
              <el-input placeholder="银行行号"
                v-model="CLInfo.code"></el-input>
            </div>
          </div>
        </div>
        <div class="trow">
          <div class="tcol infoCtn">
            <div class="label">Beneficiary:</div>
            <div class="elCtn">
              <el-input placeholder="收款人"
                v-model="CLInfo.beneficiary"></el-input>
            </div>
          </div>
        </div>
        <div class="trow">
          <div class="tcol infoCtn">
            <div class="label">Account No:</div>
            <div class="elCtn">
              <el-input placeholder="银行账号"
                v-model="CLInfo.account_no"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="tbody"
        style="width:323px">
        <div class="trow">
          <div class="tcol infoCtn">
            <div class="label">Remark:</div>
            <div class="elCtn">
              <el-input placeholder="备注信息"
                v-model="CLInfo.remark"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
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
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/document/CL/edit.less';
</style>
<style lang="less">
#CLEdit {
  .el-input .el-input__inner {
    font-size: 16px;
    border-color: transparent !important;
    line-height: 32px;
  }
}
</style>