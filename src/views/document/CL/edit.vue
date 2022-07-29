<template>
  <div class='tableCtn'
    id="CLEdit">
    <div class="headerCtn">
      <div class="top">
        <div class="title">{{clientEN.name}}</div>
        <div class="title2">{{clientEN.address}}</div>
        <div class="title3">Tel:{{clientEN.tel}}&nbsp;&nbsp;Fax:{{clientEN.fax}}</div>
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
              v-model="CLInfo.invoice"></el-input>
          </div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol">
          <div class="elCtn">
            <el-input placeholder="公司名称(company name)"
              v-model="CLInfo.to_company_name"></el-input>
          </div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">PO NO.:</div>
          <div class="elCtn">
            <el-input placeholder="订单号"
              v-model="CLInfo.po"></el-input>
          </div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol">
          <div class="elCtn">
            <el-input placeholder="公司地址(company address)"
              v-model="CLInfo.to_company_address"></el-input>
          </div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">Date:</div>
          <div class="elCtn">
            <el-date-picker placeholder="下单日期"
              v-model="CLInfo.order_date"
              value-format="yyyy-MM-dd"></el-date-picker>
          </div>
        </div>
      </div>
    </div>
    <div class="tbody noBorder">
      <div class="trow">
        <div class="tcol infoCtn">
          <div class="label">From:</div>
          <div class="elCtn">
            <el-input v-model="CLInfo.from_address"
              placeholder="生产地"></el-input>
          </div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">TO:</div>
          <div class="elCtn">
            <el-input v-model="CLInfo.to_address"
              placeholder="发货地"></el-input>
          </div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol infoCtn">
          <div class="label">PAYMENT TERMS:</div>
          <div class="elCtn">
            <el-autocomplete v-model="CLInfo.payment"
              placeholder="付款方式"></el-autocomplete>
          </div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">SHIPMENT DATE:</div>
          <div class="elCtn">
            <el-date-picker placeholder="发货日期"
              v-model="CLInfo.shipment_date"
              value-format="yyyy-MM-dd"></el-date-picker>
          </div>
        </div>
      </div>
    </div>
    <div class="tbody"
      v-for="(itemOrder,indexOrder) in CLInfo.order_info"
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
              placeholder="选择订单号">
              <el-option v-for="(item,index) in documentInfo.rel_order"
                :key="index"
                :label="item.order_code"
                :value="item.order_code"></el-option>
            </el-select>
          </div>
        </div>
        <div class="tcol">
          <div class="elCtn">
            <el-select v-model="itemOD.style_no"
              placeholder="选择款号">
              <el-option v-for="(item,index) in documentInfo.orders"
                :key="index"
                :label="item.product_code"
                :value="item.product_code"></el-option>
            </el-select>
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
              v-model="itemOD.qty_pcs"
              @input="(ev)=>{itemOD.amount=Number(itemOD.qty_pcs)*Number(itemOD.unit_price);cmpOrderCount(itemOrder)}"></el-input>
          </div>
        </div>
        <div class="tcol">
          <div class="elCtn">
            <el-input placeholder="输入单价"
              v-model="itemOD.unit_price"
              @input="(ev)=>{itemOD.amount=Number(itemOD.qty_pcs)*Number(itemOD.unit_price);cmpOrderCount(itemOrder)}"></el-input>
          </div>
        </div>
        <div class="tcol">
          <div class="elCtn">
            <el-input placeholder="总价"
              v-model="itemOD.amount"
              @input="cmpOrderCount(itemOrder)"></el-input>
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
            @click="$deleteItem(itemOrder.price_data,indexPrice);cmpOrderCount(itemOrder)"></div>
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
              v-model="itemPrice.price"
              @input="cmpOrderCount(itemOrder)"></el-input>
          </div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol"
          style="border-right:0">
          <div class="label">TOTAL FOR:</div>
        </div>
        <div class="tcol infoCtn"
          style="border-right:0">
          <div class="text"
            style="width:200px;text-align:right">{{itemOrder.pcs}}</div>
          <div class="text"
            style="margin-left:12px">PCS</div>
        </div>
        <div class="tcol infoCtn">
          <div class="text"
            style="width:200px;text-align:right">{{itemOrder.amount}}</div>
          <div class="text"
            style="margin-left:12px">{{documentInfo.currency_system}}</div>
        </div>
      </div>
    </div>
    <div class="tbody">
      <div class="trow">
        <div class="tcol"
          style="border-right:0">
          <div class="label">TOTAL FOR:</div>
        </div>
        <div class="tcol infoCtn"
          style="border-right:0">
          <div class="text"
            style="width:200px;text-align:right">{{CLInfo.total_for.number}}</div>
          <div class="text"
            style="margin-left:12px">PCS</div>
        </div>
        <div class="tcol infoCtn">
          <div class="text"
            style="width:200px;text-align:right">{{CLInfo.total_for.price}}</div>
          <div class="text"
            style="margin-left:12px">{{documentInfo.currency_system}}</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol infoCtn">
          <div class="label">TOTAL VALUE:</div>
          <div class="text"
            style="margin-left:12px">{{CLInfo.total_for.enPrice}}</div>
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
              <el-input placeholder="银行地址"
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
                v-model="CLInfo.remarks"></el-input>
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
          <div class="btn backHoverBlue"
            @click="saveCL">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { documentInfo } from '@/assets/js/api'
import { CLInfo } from '@/types/document'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    CLInfo: CLInfo
    [propName: string]: any
  } {
    return {
      totalPrice: '',
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
        total_for: {
          number: '',
          price: '',
          enPrice: ''
        },
        order_info: [
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
    },
    clientEN() {
      // @ts-ignore
      return this.$parent.clientEN
    }
  },
  methods: {
    // 数字转化成英文
    numberToEnglish(num: number, moneyType: boolean) {
      let arr1 = ['', ' thousand', ' million', ' billion']
      let arr2 = ['zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
      let arr3 = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
      let arr4 = [
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen'
      ]
      const englist = (num: any) => {
        let strRet = ''
        if (num.length === 3 && num.substr(0, 3) !== '000') {
          if (num.substr(0, 1) !== '0') {
            strRet += arr3[num.substr(0, 1)] + ' hundred'
            if (num.substr(1, 2) !== '00') {
              strRet += ' and '
            }
          }
          num = num.substring(1)
        }
        if (num.length === 2) {
          if (num.substr(0, 1) === '0') {
            num = num.substring(1)
          } else if (num.substr(0, 1) === '1') {
            strRet += arr4[num.substr(1, 2)]
          } else {
            strRet += arr2[num.substr(0, 1)]
            if (num.substr(1, 1) !== '0') strRet += '-'
            num = num.substring(1)
          }
        }
        if (num.length === 1 && num.substr(0, 1) !== '0') {
          strRet += arr3[num.substr(0, 1)]
        }
        return strRet
      }
      const translate = (num: any) => {
        let len = num.length
        let j = 0
        let strRet = ''
        let cols = Math.ceil(len / 3)
        let first = len - cols * 3
        for (let i = first; i < len; i += 3) {
          ++j
          let num3 = ''
          if (i >= 0) {
            num3 = num.substring(i, i + 3)
          } else {
            num3 = num.substring(0, first + 3)
          }
          let strEng = englist(num3)
          if (strEng !== '') {
            if (strRet !== '') {
              strRet += ','
            }
            strRet += englist(num3) + arr1[cols - j]
          }
        }
        return strRet
      }
      const numArr = String(num).split('.')
      if (numArr.length > 2) {
        return 'NAN'
      } else if (numArr.length === 1) {
        return translate(numArr[0])
      } else if (numArr.length === 2 && +numArr[0] > 0) {
        return `${translate(numArr[0])} and ${!moneyType ? 'cents' : ''} ${translate(numArr[1])}`
      } else if (numArr.length === 2 && +numArr[0] === 0) {
        return moneyType ? `zero point ${translate(numArr[1])}` : `${translate(numArr[1])} cents`
      }
    },
    // 计算合计值
    cmpOrderCount(itemOrder: any) {
      itemOrder.pcs = itemOrder.order_data.reduce((total: number, cur: any) => {
        return total + Number(cur.qty_pcs)
      }, 0)
      itemOrder.amount =
        itemOrder.order_data.reduce((total: number, cur: any) => {
          return total + Number(cur.qty_pcs) * Number(cur.unit_price)
        }, 0) +
        itemOrder.price_data.reduce((total: number, cur: any) => {
          return total + Number(cur.price)
        }, 0)
      this.CLInfo.total_for.number = this.CLInfo.order_info.reduce((total: number, cur: any) => {
        return total + Number(cur.pcs)
      }, 0)
      this.CLInfo.total_for.price = this.CLInfo.order_info.reduce((total: number, cur: any) => {
        return total + Number(cur.amount)
      }, 0)
      // 算英文数字
      if (this.CLInfo.total_for.price === 0) {
        this.CLInfo.total_for.enPrice = `SAY US ZERO ${
          this.documentInfo.currency_system === '$' ? 'DOLLARS' : 'YUAN'
        } ONLY.`
      } else if (this.CLInfo.total_for.price > 0 && this.CLInfo.total_for.price < 1) {
        this.CLInfo.total_for.enPrice = `SAY US ${this.numberToEnglish(
          this.CLInfo.total_for.price,
          this.documentInfo.currency_system !== '$'
        )} ${this.documentInfo.currency_system === '$' ? '' : 'YUAN'} ONLY.`
          .toUpperCase()
          .replace(/,/g, ' ')
          .replace(/-/g, ' ')
      } else {
        this.CLInfo.total_for.enPrice = `SAY US ${this.numberToEnglish(
          this.CLInfo.total_for.price,
          this.documentInfo.currency_system !== '$'
        )} ${this.documentInfo.currency_system === '$' ? 'DOLLARS' : 'YUAN'} ONLY.`
          .toUpperCase()
          .replace(/,/g, ' ')
          .replace(/-/g, ' ')
      }
    },
    saveCL() {
      const formCheck =
        this.$formCheck(this.CLInfo, [
          {
            key: 'to_company_name',
            errMsg: '请输入公司名称'
          },
          {
            key: 'to_company_address',
            errMsg: '请输入公司地址'
          },
          {
            key: 'invoice',
            errMsg: '请输入发票号码'
          },
          {
            key: 'po',
            errMsg: '请输入订单号'
          },
          {
            key: 'order_date',
            errMsg: '请选择下单日期'
          },
          {
            key: 'from_address',
            errMsg: '请输入生产地'
          },
          {
            key: 'to_address',
            errMsg: '请输入发货地'
          },
          {
            key: 'payment',
            errMsg: '请输入付款方式'
          },
          {
            key: 'shipment_date',
            errMsg: '请选择发货日期'
          },
          {
            key: 'bank',
            errMsg: '请输入银行名称'
          },
          {
            key: 'address',
            errMsg: '请输入银行地址'
          },
          {
            key: 'code',
            errMsg: '请输入银行行号'
          },
          {
            key: 'beneficiary',
            errMsg: '请输入收款人'
          },
          {
            key: 'account_no',
            errMsg: '请输入银行账号'
          }
        ]) ||
        this.CLInfo.order_info.some((item) => {
          return (
            this.$formCheck(item, [
              {
                key: 'order_no',
                errMsg: '请选择订单号'
              }
            ]) ||
            item.order_data.some((itemChild) => {
              return this.$formCheck(itemChild, [
                {
                  key: 'style_no',
                  errMsg: '请选择款号'
                },
                {
                  key: 'qty_pcs',
                  errMsg: '请输入产品数量'
                },
                {
                  key: 'unit_price',
                  errMsg: '请输入产品单价'
                }
              ])
            })
          )
        })
      if (!formCheck) {
        const formData = this.$clone(this.CLInfo)
        // @ts-ignore
        formData.document_id = Number(this.$route.query.id)
        // @ts-ignore 转字符串提交
        formData.order_info = JSON.stringify(formData.order_info)
        // @ts-ignore 转字符串提交
        formData.total_for = JSON.stringify(formData.total_for)
        documentInfo.createCL(formData).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      }
    }
  },
  mounted() {
    documentInfo
      .detailCL({
        document_id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.CLInfo = res.data.data
        this.CLInfo.total_for = JSON.parse(res.data.data.total_for)
        this.CLInfo.order_info = JSON.parse(res.data.data.order_info)
      })
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