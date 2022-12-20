<template>
  <div id="documentCreate"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">选择订单</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="keyword"
              placeholder="可搜索订单号或产品编号"
              @keydown.enter.native="searchOrder"></el-input>
          </div>
          <div class="elCtn">
            <el-cascader @change="getContacts($event);searchOrder()"
              placeholder="筛选下单公司"
              v-model="client_id"
              filterable
              :options="clientList"
              clearable>
            </el-cascader>
          </div>
          <div class="elCtn">
            <el-select placeholder="请选择公司联系人"
              v-model="contacts_id"
              no-data-text="请先选择下单公司"
              filterable
              clearable
              @change="searchOrder">
              <el-option v-for="item in contactsList"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select @change="searchOrder"
              v-model="status"
              placeholder="筛选审核状态">
              <el-option value="null"
                label="全部"></el-option>
              <el-option value="0"
                label="待审核"></el-option>
              <el-option value="1"
                label="已审核"></el-option>
              <el-option value="2"
                label="已驳回"></el-option>
            </el-select>
          </div>
          <div class="btn backHoverBlue"
            @click="searchOrder">搜索</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select @change="searchOrder"
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
            <el-select @change="searchOrder"
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
              @change="searchOrder"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="elCtn">
            <el-select v-model="limit"
              placeholder="每页展示条数"
              @change="searchOrder">
              <el-option v-for="item in limitList"
                :key="item.value"
                :label="item.name"
                :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select v-model="type"
              placeholder="订单状态筛选"
              @change="searchOrder">
              <el-option label="全部"
                value="null"></el-option>
              <el-option label="已创建"
                :value="1"></el-option>
              <el-option label="进行中"
                :value="2"></el-option>
              <el-option label="已完成"
                :value="3"></el-option>
              <el-option label="已取消"
                :value="6"></el-option>
              <el-option label="已延期"
                :value="5"></el-option>
            </el-select>
          </div>
        </div>
        <div class="filterCtn clearfix">
          <div class="label">已勾选单据：</div>
          <div class="elCtn check"
            v-for="(item,index) in checkedCount"
            :key="item.id">
            <el-input v-model="item.code"
              disabled>
              <template slot="append">
                <i class="el-icon-close hoverRed"
                  style="cursor:pointer"
                  @click="checkedCount.splice(index,1)"></i>
              </template>
            </el-input>
          </div>
        </div>
        <zh-list :list="orderList"
          :check="true"
          :checkedCount="checkedCount"
          :listKey="originalSetting"
          :loading="orderLoading"
          :oprList="oprList"></zh-list>
        <div class="pageCtn">
          <el-pagination background
            :page-size="limit"
            layout="prev, pager, next, jumper"
            :total="total"
            :current-page.sync="page"
            @current-change="searchOrder">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">单证基本信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">PO Number</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入Po号"
                v-model="documentInfo.po">
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">Invoice Number</span>
              <span class="explanation"></span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入发票号码"
                v-model="documentInfo.invoice">
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">Payment Term</span>
              <span class="explanation"></span>
            </div>
            <div class="info elCtn">
              <el-autocomplete v-model="documentInfo.payment"
                :fetch-suggestions="querySearchPayment"
                placeholder="请选择付款方式"></el-autocomplete>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">TO (Company Name)</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-autocomplete v-model="documentInfo.to_company_name"
                :fetch-suggestions="querySearchCompanyName"
                @select="(ev)=>{documentInfo.to_company_address = ev.address}"
                placeholder="请选择公司名称"></el-autocomplete>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">TO (Address)</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="documentInfo.to_company_address"
                placeholder="请输入公司地址"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">Order Date</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-date-picker v-model="documentInfo.order_date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择下单日期">
              </el-date-picker>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">EX-factory Date</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-date-picker v-model="documentInfo.ex_factory_date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择离厂日期">
              </el-date-picker>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">Shipment Date</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-date-picker v-model="documentInfo.shipment_date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择发货日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">From</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-autocomplete v-model="documentInfo.from_address"
                :fetch-suggestions="querySearchPortName"
                placeholder="请选择生产地"></el-autocomplete>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">To</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-autocomplete v-model="documentInfo.to_address"
                :fetch-suggestions="querySearchPortName"
                placeholder="请选择发货地"></el-autocomplete>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">Currency System</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-select v-model="documentInfo.currency_system"
                filterable
                placeholder="请选择币制">
                <el-option v-for="(item,index) in moneyArr"
                  :key="index"
                  :label="`${item.name}(${item.sign})`"
                  :value="item.sign">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">Loading Port</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-autocomplete v-model="documentInfo.loading_port"
                :fetch-suggestions="querySearchPort"
                placeholder="请选择发货港口"></el-autocomplete>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">
              <span class="text">Destination Port</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-autocomplete v-model="documentInfo.destination_port"
                :fetch-suggestions="querySearchPort"
                placeholder="请选择到达港口"></el-autocomplete>
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
            @click="saveDocument()">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DocumentInfo } from '@/types/document'
import { limitArr, moneyArr } from '@/assets/js/dictionary'
import { client, documentInfo, order } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    documentInfo: DocumentInfo
    [propName: string]: any
  } {
    return {
      orderLoading: false,
      orderList: [],
      checkedCount: [],
      originalSetting: [
        {
          key: 'system_code',
          name: '系统编号',
          ifShow: true,
          ifLock: true,
          ifCaogao: 'is_draft',
          caogaoArr: ['稿', '整'],
          index: 0
        },
        {
          key: 'code',
          name: '订单号',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'client_name',
          name: '下单公司',
          ifShow: true,
          ifLock: true,
          index: 2
        },
        {
          key: 'contacts_name',
          name: '公司联系人',
          ifShow: true,
          ifLock: false,
          index: 3
        },
        {
          key: 'product_code',
          otherkey: 'system_code',
          name: '产品编号',
          ifShow: true,
          ifLock: false,
          index: 4,
          from: 'product_data',
          mark: true
        },
        {
          key: 'image_data',
          name: '产品图片',
          ifShow: true,
          ifLock: false,
          ifImage: true,
          index: 5,
          from: 'product_data'
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
          key: 'status',
          name: '订单状态',
          ifShow: true,
          ifLock: false,
          index: 7,
          filterArr: ['', '已创建', '进行中', '已完成', '已结算', '已逾期', '已取消'],
          classArr: ['', 'orange', 'blue', 'green', 'green', 'red', 'gray']
        },
        {
          key: 'is_check',
          name: '审核状态',
          ifShow: true,
          ifLock: false,
          index: 8,
          filterArr: ['待审核', '已审核', '已驳回'],
          classArr: ['orange', 'green', 'red']
        },
        {
          key: 'total_number',
          name: '下单总数',
          ifShow: true,
          ifLock: false,
          index: 9,
          errVal: '0'
        },
        {
          key: 'total_price',
          name: '下单总额',
          ifShow: true,
          ifLock: false,
          index: 10,
          unit: '元',
          errVal: '0'
        },
        {
          key: 'group_name',
          name: '负责小组',
          ifShow: true,
          ifLock: false,
          index: 11
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 12
        },
        {
          key: 'order_time',
          name: '下单日期',
          ifShow: true,
          ifLock: false,
          index: 13
        }
      ],
      documentInfo: {
        id: '',
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
        currency_system: '',
        rel_order: []
      },
      paymentList: [],
      portList: [],
      moneyArr: moneyArr,
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
      oprList: [
        {
          name: '详情',
          class: 'hoverBlue',
          fn: (item: any) => {
            if (item.is_draft === 1) {
              this.$router.push('/order/update?id=' + item.id)
            } else {
              this.$router.push('/order/detail?id=' + item.id)
            }
          }
        }
      ],
      limitList: limitArr,
      group_id: '',
      user_id: '',
      type: 'null',
      status: 'null',
      date: [],
      keyword: '',
      contacts_id: '',
      contactsList: [],
      client_id: [],
      limit: 5,
      page: 1,
      total: 1
    }
  },
  computed: {
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    },
    userList() {
      return this.$store.state.api.user.arr
    },
    groupList() {
      return this.$store.state.api.group.arr
    }
  },
  methods: {
    searchOrder() {
      this.orderLoading = true
      order
        .list({
          order_type: 1,
          keyword: this.keyword,
          client_id: this.client_id.length > 0 ? this.client_id[2] : '',
          page: this.page,
          limit: this.limit,
          is_check: this.status,
          status: this.type,
          start_time: this.date.length > 0 ? this.date[0] : '',
          end_time: this.date.length > 0 ? this.date[1] : '',
          user_id: this.user_id,
          group_id: this.group_id,
          contacts_id: this.contacts_id
        })
        .then((res) => {
          if (res.data.status) {
            this.orderList = res.data.data.items
            this.total = res.data.data.total
          }
          this.orderLoading = false
        })
    },
    getContacts(ev: number[]) {
      if (ev && ev.length) {
        client
          .detail({
            id: ev[2]
          })
          .then((res) => {
            if (res.data.status) {
              this.contactsList = res.data.data.contacts_data
            }
          })
      } else {
        this.contacts_id = ''
      }
    },
    querySearchPayment(queryString: string, callback: Function) {
      callback(
        queryString
          ? this.paymentList.filter((itemF: any) => itemF.label.indexOf(queryString) !== -1)
          : this.paymentList
      )
    },
    querySearchCompanyName(queryString: string, callback: Function) {
      const returnData = this.clientList.map((itemM: any) => {
        return {
          value: itemM.name,
          label: itemM.name,
          address: itemM.address
        }
      })
      callback(queryString ? returnData.filter((itemF: any) => itemF.value.indexOf(queryString) !== -1) : returnData)
    },
    querySearchPortName(queryString: string, callback: Function) {
      const returnData = this.portList.map((itemM: any) => {
        return {
          value: itemM.value[0],
          label: itemM.label[0]
        }
      })
      callback(
        queryString
          ? returnData.filter((itemF: any) => itemF.label.indexOf(queryString.toUpperCase()) !== -1)
          : returnData
      )
    },
    querySearchPort(queryString: string, callback: Function) {
      const returnData = this.portList.map((itemM: any) => {
        return {
          value: itemM.value.join(','),
          label: itemM.label.join(',')
        }
      })
      callback(
        queryString
          ? returnData.filter((itemF: any) => itemF.label.indexOf(queryString.toUpperCase()) !== -1)
          : returnData
      )
    },
    saveDocument() {
      console.log(this.checkedCount)
      if (this.checkedCount.length === 0) {
        this.$message.error('请选择订单')
        return
      }
      const formCheck = this.$formCheck(this.documentInfo, [
        {
          key: 'po',
          errMsg: '请输入PO号'
        },
        {
          key: 'invoice',
          errMsg: '请输入发票号码'
        },
        {
          key: 'payment',
          errMsg: '请输入付款方式'
        },
        {
          key: 'to_company_name',
          errMsg: '请输入公司名称'
        },
        {
          key: 'to_company_address',
          errMsg: '请输入公司地址'
        },
        {
          key: 'order_date',
          errMsg: '请选择下单日期'
        },
        {
          key: 'ex_factory_date',
          errMsg: '请选择离厂日期'
        },
        {
          key: 'shipment_date',
          errMsg: '请选择发货日期'
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
          key: 'currency_system',
          errMsg: '请选择币制'
        },
        {
          key: 'loading_port',
          errMsg: '请输入发货港口'
        },
        {
          key: 'destination_port',
          errMsg: '请输入到达港口'
        }
      ])
      if (!formCheck) {
        this.documentInfo.rel_order = this.checkedCount.map((item: any) => item.id) //先保存一份字符串看看够不够用
        documentInfo.create(this.documentInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
          }
        })
      }
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
    this.searchOrder()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/document/create.less';
</style>