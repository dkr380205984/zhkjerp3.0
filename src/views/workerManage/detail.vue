<template>
  <div id="workerManageDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">员工信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">员工编号：</div>
            <div class="text blue">{{quotedPriceInfo.code}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">员工姓名：</div>
            <div class="text">{{quotedPriceInfo.title}}</div>
          </div>
          <div class="col">
            <div class="label">手机号：</div>
            <div class="text">{{quotedPriceInfo.client_name}}</div>
          </div>
          <div class="col">
            <div class="label">所属部门：</div>
            <div class="text">{{quotedPriceInfo.contacts_name}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">员工工种：</div>
            <div class="text">{{quotedPriceInfo.group_name}}</div>
          </div>
          <div class="col">
            <div class="label">入职时间：</div>
            <div class="text">{{quotedPriceInfo.settle_unit}}</div>
          </div>
          <div class="col">
            <div class="label">离职时间：</div>
            <div class="text">{{quotedPriceInfo.exchange_rate}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">负责工序：</div>
            <div class="text">{{quotedPriceInfo.user_name}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">年龄：</div>
            <div class="text">{{quotedPriceInfo.system_total_price}}元</div>
          </div>
          <div class="col">
            <div class="label">性别：</div>
            <div class="text">{{quotedPriceInfo.real_quote_price}}元</div>
          </div>
          <div class="col">
            <div class="label">身份证号码：</div>
            <div class="text">{{quotedPriceInfo.real_quote_price}}元</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">民族：</div>
            <div class="text">{{quotedPriceInfo.system_total_price}}元</div>
          </div>
          <div class="col">
            <div class="label">学历：</div>
            <div class="text">{{quotedPriceInfo.real_quote_price}}元</div>
          </div>
          <div class="col">
            <div class="label">健康状况：</div>
            <div class="text">{{quotedPriceInfo.real_quote_price}}元</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">工资卡银行：</div>
            <div class="text">{{quotedPriceInfo.system_total_price}}元</div>
          </div>
          <div class="col">
            <div class="label">银行卡号：</div>
            <div class="text">{{quotedPriceInfo.real_quote_price}}元</div>
          </div>
          <div class="col">
            <div class="label">是否缴纳社保：</div>
            <div class="text">{{quotedPriceInfo.real_quote_price}}元</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注：</div>
            <div class="text">{{quotedPriceInfo.desc}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverRed"
            @click="deleteQuotedPrice">
            <svg class="iconFont"
              aria-hidden="true">
              <use xlink:href="#icon-shanchudingdan"></use>
            </svg>
            <span class="text">离职</span>
          </div>
          <div class="btn backHoverOrange"
            @click="$router.push('/workerManage/update?id='+quotedList[quotedIndex])">
            <svg class="iconFont"
              aria-hidden="true">
              <use xlink:href="#icon-xiugaidingdan"></use>
            </svg>
            <span class="text">修改</span>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="oprLogFlag">
      <div class="main"
        style="width:1000px">
        <div class="titleCtn">
          <span class="text">操作记录</span>
          <div class="closeCtn"
            @click="oprLogFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="tableCtn noPad"
            style="margin:12px 0">
            <div class="thead">
              <div class="trow">
                <div class="tcol">序号</div>
                <div class="tcol">修改日期</div>
                <div class="tcol">修改人</div>
                <div class="tcol"
                  style="flex:4">产品修改详情</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(item,index) in oprLog"
                :key="item.id">
                <div class="tcol">{{index+1}}</div>
                <div class="tcol">{{item.update_time}}</div>
                <div class="tcol">{{item.user}}</div>
                <div class="tcol"
                  style="flex:4">
                  <div class="line"
                    v-if="item.update_data">
                    <span class="label">订单修改信息:</span>
                    <div class="line">{{item.update_data}}</div>
                  </div>
                  <div v-for="(itemPro,indexPro) in item.product_activity_log"
                    :key="indexPro">
                    <span>产品{{indexPro+1}}:</span>
                    <div class="line"
                      v-if="itemPro.product_update_data">
                      <span class="label">产品修改信息：</span>
                      <span>{{itemPro.product_update_data}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.material_activity_log && itemPro.material_activity_log.length>0">
                      <span class="label">原料修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.material_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.assist_material_activity_log && itemPro.assist_material_activity_log.length>0">
                      <span class="label">辅料修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.assist_material_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.weave_activity_log && itemPro.weave_activity_log.length>0">
                      <span class="label">织造修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.weave_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.semi_product_activity_log && itemPro.semi_product_activity_log.length>0">
                      <span class="label">半成品加工修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.semi_product_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.production_activity_log && itemPro.production_activity_log.length>0">
                      <span class="label">成品加工修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.production_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.pack_material_activity_log && itemPro.pack_material_activity_log.length>0">
                      <span class="label">包装辅料修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.pack_material_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.other_fee_activity_log && itemPro.other_fee_activity_log.length>0">
                      <span class="label">其他修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.others_fee_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.no_production_fee_activity_log && itemPro.no_production_fee_activity_log.length>0">
                      <span class="label">非生产型费用修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.no_production_fee_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="oprLogFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="oprLogFlag=false">确认</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="bindOrderFlag">
      <div class="main"
        style="width:1000px">
        <div class="titleCtn">
          <span class="text">绑定单据</span>
          <div class="closeCtn"
            @click="bindOrderFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">搜索单据：</div>
            <div class="info">
              <div class="elCtn"
                style="width:100%">
                <el-autocomplete v-model="bindOrderValue"
                  :fetch-suggestions="searchOrder"
                  :placeholder="'请输入'+(bindOrderType===1?'订单号搜索':'样单号搜索')"
                  @select="selectId"></el-autocomplete>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="bindOrderFlag=false">取消</span>
          <span class="btn backHoverOrange"
            @click="$openUrl(bindOrderType===1?'/order/list?page=1&keyword=&client_id=&user_id=&status=null&date=':'/sampleOrder/list?page=1&keyword=&client_id=&user_id=&status=null&date=')">查看{{bindOrderType===1?'订单':'样单'}}列表</span>
          <span class="btn backHoverBlue"
            @click="saveBindOrder">确认</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="compareFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">对比单据</span>
          <div class="closeCtn"
            @click="compareFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="box"
            v-for="(item,index) in quotedList"
            :key="item.id"
            :class="{'backHoverBlue':compareIndex===index}"
            @click="compareIndex = index">
            第{{index+1}}次报价
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="compareFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="confirmCompare">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import { quotedPrice, order } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
    quotedPriceInfo: QuotedPriceInfo
    compareInfo: QuotedPriceInfo
  } {
    return {
      loading: true,
      checkFlag: false,
      compareFlag: false,
      compareIndex: 0,
      showCompareInfo: false, // 是否展示对比数据
      compareDesc: [],
      quotedPriceInfo: {
        id: null,
        is_draft: 1,
        title: '',
        client_id: '',
        tree_data: '',
        client_name: '',
        contacts_id: '',
        contacts_name: '',
        group_id: '',
        group_name: '',
        settle_unit: '元',
        exchange_rate: '',
        total_number: '',
        total_cost_price: '',
        commission_percentage: '',
        commission_price: '',
        rate_taxation: '',
        rate_price: '',
        profit_percentage: '',
        profit_price: '',
        desc: '',
        real_quote_price: '',
        system_total_price: 0,
        created_at: '',
        rel_order: [],
        product_data: [
          {
            total_price: '',
            product_id: '',
            type: [],
            category_id: '',
            secondary_category_id: '',
            secondary_category: '',
            image_data: [],
            client_target_price: '',
            start_order_number: '',
            desc: '',
            transport_fee_desc: '',
            transport_fee: '',
            material_data: [
              {
                material_name: '',
                weight: '',
                loss: '',
                price: '',
                total_price: '',
                unit: 'kg'
              }
            ],
            assist_material_data: [
              {
                material_name: '',
                number: '',
                loss: '',
                price: '',
                total_price: '',
                unit: ''
              }
            ],
            weave_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            semi_product_data: [
              {
                process_name: [],
                desc: '',
                total_price: ''
              }
            ],
            production_data: [
              {
                name: [],
                desc: '',
                total_price: ''
              }
            ],
            pack_material_data: [
              {
                material_name: '',
                desc: '',
                total_price: ''
              }
            ],
            other_fee_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            no_production_fee_data: [
              {
                id: '',
                name: '',
                desc: '',
                total_price: ''
              }
            ]
          }
        ]
      },
      compareInfo: {
        id: null,
        is_draft: 1,
        title: '',
        client_id: '',
        tree_data: '',
        client_name: '',
        contacts_id: '',
        contacts_name: '',
        group_id: '',
        group_name: '',
        settle_unit: '元',
        exchange_rate: '',
        total_number: '',
        total_cost_price: '',
        commission_percentage: '',
        commission_price: '',
        rate_taxation: '',
        rate_price: '',
        profit_percentage: '',
        profit_price: '',
        desc: '',
        real_quote_price: '',
        system_total_price: 0,
        created_at: '',
        rel_order: [],
        product_data: [
          {
            total_price: '',
            product_id: '',
            type: [],
            category_id: '',
            secondary_category_id: '',
            secondary_category: '',
            image_data: [],
            client_target_price: '',
            start_order_number: '',
            desc: '',
            transport_fee_desc: '',
            transport_fee: '',
            material_data: [
              {
                material_name: '',
                weight: '',
                loss: '',
                price: '',
                total_price: '',
                unit: 'kg'
              }
            ],
            assist_material_data: [
              {
                material_name: '',
                number: '',
                loss: '',
                price: '',
                total_price: '',
                unit: ''
              }
            ],
            weave_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            semi_product_data: [
              {
                process_name: [],
                desc: '',
                total_price: ''
              }
            ],
            production_data: [
              {
                name: [],
                desc: '',
                total_price: ''
              }
            ],
            pack_material_data: [
              {
                material_name: '',
                desc: '',
                total_price: ''
              }
            ],
            other_fee_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            no_production_fee_data: [
              {
                id: '',
                name: '',
                desc: '',
                total_price: ''
              }
            ]
          }
        ]
      },
      oprLogFlag: false,
      oprLog: [],
      bindOrderFlag: false,
      bindOrderValue: '',
      bindOrderId: '',
      bindOrderType: '',
      quotedIndex: '0',
      quotedList: []
    }
  },
  computed: {
    // 订单总费用
    realOrderPrice(): string {
      return (
        Number(this.quotedPriceInfo.commission_price) +
        Number(this.quotedPriceInfo.profit_price) +
        Number(this.quotedPriceInfo.rate_price)
      ).toFixed(2)
    },
    compareRealOrderPrice(): string {
      return (
        Number(this.compareInfo.commission_price) +
        Number(this.compareInfo.profit_price) +
        Number(this.compareInfo.rate_price)
      ).toFixed(2)
    },
    // 总合计，按照汇率转换后
    realTotalPriceChange(): string {
      return ((Number(this.realTotalPrice) / Number(this.quotedPriceInfo.exchange_rate)) * 100).toFixed(2)
    },
    // 总合计——含各种税 quotedPriceInfo.system_total_price
    realTotalPrice(): string {
      return (
        Number(this.quotedPriceInfo.total_cost_price) /
        (1 -
          ((Number(this.quotedPriceInfo.commission_percentage) / 100 || 0) +
            (Number(this.quotedPriceInfo.profit_percentage) / 100 || 0) +
            Number(this.quotedPriceInfo.rate_taxation) / 100 || 0))
      ).toFixed(2)
    },
    compareRealTotalPrice(): string {
      return (
        Number(this.compareInfo.total_cost_price) /
        (1 -
          ((Number(this.compareInfo.commission_percentage) / 100 || 0) +
            (Number(this.compareInfo.profit_percentage) / 100 || 0) +
            Number(this.compareInfo.rate_taxation) / 100 || 0))
      ).toFixed(2)
    },
    // 产品项总价
    productTotalPrice(): string[] {
      return this.quotedPriceInfo.product_data.map((item) => {
        return (
          Number(item.transport_fee) +
          item.material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.assist_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.weave_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.semi_product_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.production_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.pack_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.other_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.no_production_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0)
        ).toFixed(2)
      })
    },
    // 对比报价单产品总价
    compareProductTotalPrice(): string[] {
      return this.compareInfo.product_data.map((item) => {
        return (
          Number(item.transport_fee) +
          item.material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.assist_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.weave_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.semi_product_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.production_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.pack_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.other_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.no_production_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0)
        ).toFixed(2)
      })
    }
  },
  methods: {
    // 确认对比
    confirmCompare() {
      if (this.compareIndex === Number(this.quotedIndex)) {
        this.$message.error('不能比较相同的报价单')
        return
      }
      this.loading = true
      this.compareDesc = []
      quotedPrice
        .detail({
          id: this.quotedList[this.compareIndex]
        })
        .then((res) => {
          if (res.data.status) {
            this.compareInfo = res.data.data
            this.quotedPriceInfo.product_data.forEach((item, index) => {
              this.compareDesc.push({
                image_data: {
                  change: ''
                },
                desc: {
                  change: ''
                },
                start_order_number: {
                  change: '',
                  number: 0
                },
                client_target_price: {
                  change: '',
                  number: 0
                },
                no_production_fee_data: [],
                material_data: [],
                assist_material_data: [],
                weave_data: [],
                semi_product_data: [],
                production_data: [],
                pack_material_data: [],
                other_fee_data: [],
                transport_fee: {
                  change: '',
                  number: 0,
                  desc: '',
                  pirceNew: 0
                }
              })
              // 对比字段逻辑，这里可以封装，懒得搞
              const comparePro = this.compareInfo.product_data[index]
              const compareDesc = this.compareDesc[index]
              // 手动夹断
              if (comparePro.image_data.length > item.image_data.length) {
                compareDesc.image_data.change = 'up'
              } else if (comparePro.image_data.length < item.image_data.length) {
                compareDesc.image_data.change = 'down'
              }
              // 手动夹断
              if (Number(comparePro.start_order_number) > Number(item.start_order_number)) {
                compareDesc.start_order_number.change = 'up'
              } else if (Number(comparePro.start_order_number) < Number(item.start_order_number)) {
                compareDesc.start_order_number.change = 'down'
              }
              compareDesc.start_order_number.number = (
                Math.abs(
                  (Number(comparePro.start_order_number) - Number(item.start_order_number)) /
                    Number(item.start_order_number)
                ) * 100
              ).toFixed(2)
              // 手动夹断
              if (Number(comparePro.client_target_price) > Number(item.client_target_price)) {
                compareDesc.client_target_price.change = 'up'
              } else if (Number(comparePro.client_target_price) < Number(item.client_target_price)) {
                compareDesc.client_target_price.change = 'down'
              }
              compareDesc.client_target_price.number = (
                Math.abs(
                  (Number(comparePro.client_target_price) - Number(item.client_target_price)) /
                    Number(item.client_target_price)
                ) * 100
              ).toFixed(2)
              // 手动夹断
              if (comparePro.desc !== item.desc) {
                compareDesc.desc.change = 'change'
              }
              // 手动夹断
              item.material_data.forEach((itemChild, indexChild) => {
                compareDesc.material_data.push({
                  change: '',
                  priceNew: 0,
                  priceNumber: 0,
                  priceChange: '',
                  weightChange: '',
                  weightNumber: 0,
                  weigthNew: 0,
                  totalPriceChange: '',
                  totalPriceNew: 0,
                  totalPriceNumber: 0
                })
                const finded = comparePro.material_data.find((item) => item.material_name === itemChild.material_name)
                if (!finded) {
                  compareDesc.material_data[indexChild].change = 'delete' //找不到说明被删了
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.price > itemChild.price) {
                    compareDesc.material_data[indexChild].priceChange = 'up'
                  } else if (finded.price < itemChild.price) {
                    compareDesc.material_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.material_data[indexChild].priceNew = finded.price
                  compareDesc.material_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.price) - Number(itemChild.price)) / Number(itemChild.price)) *
                    100
                  ).toFixed(2)

                  if (finded.weight > itemChild.weight) {
                    compareDesc.material_data[indexChild].weightChange = 'up'
                  } else if (finded.weight < itemChild.weight) {
                    compareDesc.material_data[indexChild].weightChange = 'down'
                  }
                  compareDesc.material_data[indexChild].weigthNew = finded.weight
                  compareDesc.material_data[indexChild].weightNumber = (
                    (Math.abs(Number(finded.weight) - Number(itemChild.weight)) / Number(itemChild.weight)) *
                    100
                  ).toFixed(2)

                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.material_data[indexChild].totalPriceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.material_data[indexChild].totalPriceChange = 'down'
                  }
                  compareDesc.material_data[indexChild].totalPriceNew = finded.total_price
                  compareDesc.material_data[indexChild].totalPriceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                }
              })
              comparePro.material_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.material_data.push({
                    change: 'add', // 标记是新增的
                    priceNew: 0,
                    priceNumber: 0,
                    priceChange: '',
                    weightChange: '',
                    weightNumber: 0,
                    weigthNew: 0,
                    totalPriceChange: '',
                    totalPriceNew: 0,
                    totalPriceNumber: 0
                  })
                  item.material_data.push(itemChild)
                })
              // 手动夹断
              item.assist_material_data.forEach((itemChild, indexChild) => {
                compareDesc.assist_material_data.push({
                  change: '',
                  priceNew: 0,
                  priceNumber: 0,
                  priceChange: '',
                  weightChange: '',
                  weightNumber: 0,
                  weigthNew: 0,
                  totalPriceChange: '',
                  totalPriceNew: 0,
                  totalPriceNumber: 0
                })
                const finded = comparePro.assist_material_data.find(
                  (item) => item.material_name === itemChild.material_name
                )
                if (!finded) {
                  compareDesc.assist_material_data[indexChild].change = 'delete' //找不到说明被删了
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.price > itemChild.price) {
                    compareDesc.assist_material_data[indexChild].priceChange = 'up'
                  } else if (finded.price < itemChild.price) {
                    compareDesc.assist_material_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.assist_material_data[indexChild].priceNew = finded.price
                  compareDesc.assist_material_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.price) - Number(itemChild.price)) / Number(itemChild.price)) *
                    100
                  ).toFixed(2)

                  if (finded.number > itemChild.number) {
                    compareDesc.assist_material_data[indexChild].weightChange = 'up'
                  } else if (finded.number < itemChild.number) {
                    compareDesc.assist_material_data[indexChild].weightChange = 'down'
                  }
                  compareDesc.assist_material_data[indexChild].weigthNew = finded.number
                  compareDesc.assist_material_data[indexChild].weightNumber = (
                    (Math.abs(Number(finded.number) - Number(itemChild.number)) / Number(itemChild.number)) *
                    100
                  ).toFixed(2)

                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.assist_material_data[indexChild].totalPriceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.assist_material_data[indexChild].totalPriceChange = 'down'
                  }
                  compareDesc.assist_material_data[indexChild].totalPriceNew = finded.total_price
                  compareDesc.assist_material_data[indexChild].totalPriceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                }
              })
              comparePro.assist_material_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.assist_material_data.push({
                    change: 'add', // 标记是新增的
                    priceNew: 0,
                    priceNumber: 0,
                    priceChange: '',
                    weightChange: '',
                    weightNumber: 0,
                    weigthNew: 0,
                    totalPriceChange: '',
                    totalPriceNew: 0,
                    totalPriceNumber: 0
                  })
                  item.assist_material_data.push(itemChild)
                })
              // 手动夹断
              item.weave_data.forEach((itemChild, indexChild) => {
                compareDesc.weave_data.push({
                  change: '',
                  priceNew: 0,
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.weave_data.find((item) => item.name === itemChild.name)
                if (!finded) {
                  compareDesc.weave_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.weave_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.weave_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.weave_data[indexChild].priceNew = finded.total_price
                  compareDesc.weave_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.weave_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.weave_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.weave_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.weave_data.push(itemChild)
                })
              // 手动夹断
              item.semi_product_data.forEach((itemChild, indexChild) => {
                compareDesc.semi_product_data.push({
                  change: '',
                  priceNew: '',
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.semi_product_data.find(
                  // @ts-ignore
                  (item) => item.process_name.join(',') === itemChild.process_name.join(',')
                )
                if (!finded) {
                  compareDesc.semi_product_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.semi_product_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.semi_product_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.semi_product_data[indexChild].priceNew = finded.total_price
                  compareDesc.semi_product_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.semi_product_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.semi_product_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.semi_product_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.semi_product_data.push(itemChild)
                })
              // 手动夹断
              item.production_data.forEach((itemChild, indexChild) => {
                compareDesc.production_data.push({
                  change: '',
                  priceNew: '',
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.production_data.find(
                  // @ts-ignore
                  (item) => item.name.join(',') === itemChild.name.join(',')
                )
                if (!finded) {
                  compareDesc.production_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.production_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.production_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.production_data[indexChild].priceNew = finded.total_price
                  compareDesc.production_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.production_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.production_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.production_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.production_data.push(itemChild)
                })
              // 手动夹断
              item.pack_material_data.forEach((itemChild, indexChild) => {
                compareDesc.pack_material_data.push({
                  change: '',
                  priceNew: '',
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.pack_material_data.find(
                  (item) => item.material_name === itemChild.material_name
                )
                if (!finded) {
                  compareDesc.pack_material_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.pack_material_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.pack_material_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.pack_material_data[indexChild].priceNew = finded.total_price
                  compareDesc.pack_material_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.pack_material_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.pack_material_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.pack_material_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.pack_material_data.push(itemChild)
                })
              // 手动夹断
              item.other_fee_data.forEach((itemChild, indexChild) => {
                compareDesc.other_fee_data.push({
                  change: '',
                  priceNew: '',
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.other_fee_data.find((item) => item.name === itemChild.name)
                if (!finded) {
                  compareDesc.other_fee_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.other_fee_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.other_fee_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.other_fee_data[indexChild].priceNew = finded.total_price
                  compareDesc.other_fee_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.other_fee_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.other_fee_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.other_fee_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.other_fee_data.push(itemChild)
                })
              // 手动夹断
              item.no_production_fee_data.forEach((itemChild, indexChild) => {
                compareDesc.no_production_fee_data.push({
                  change: '',
                  priceNew: '',
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.no_production_fee_data.find((item) => item.name === itemChild.name)
                if (!finded) {
                  compareDesc.no_production_fee_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.no_production_fee_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.no_production_fee_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.no_production_fee_data[indexChild].priceNew = finded.total_price
                  compareDesc.no_production_fee_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.no_production_fee_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.no_production_fee_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.no_production_fee_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.no_production_fee_data.push(itemChild)
                })
              if (Number(item.transport_fee) > Number(comparePro.transport_fee)) {
                compareDesc.transport_fee.change = 'down'
              } else if (Number(item.transport_fee) < Number(comparePro.transport_fee)) {
                compareDesc.transport_fee.change = 'up'
              }
              compareDesc.number = Number(item.transport_fee)
                ? (
                    (Math.abs(Number(item.transport_fee) - Number(comparePro.transport_fee)) /
                      Number(item.transport_fee)) *
                    100
                  ).toFixed(2)
                : ''
              compareDesc.priceNew = Number(comparePro.transport_fee)
              compareDesc.transport_fee
              if (item.transport_fee_desc !== comparePro.transport_fee_desc) {
                compareDesc.desc = 'change'
              }
            })
          }
          this.compareFlag = false
          this.showCompareInfo = true
          this.loading = false
        })
    },
    init(id?: number) {
      this.loading = true
      this.showCompareInfo = false
      this.compareDesc = []
      quotedPrice
        .detail({
          id: id || Number(this.$route.query.id)
        })
        .then((res) => {
          this.quotedPriceInfo = res.data.data
          if (!id) {
            this.quotedList = [Number(this.$route.query.id)]
            // pid已经在关联id数组里了，所以不需要
            // if (this.quotedPriceInfo.pid) {
            //   this.quotedList.push(this.quotedPriceInfo.pid)
            // }
            if (this.quotedPriceInfo.rel_quote!.length > 0) {
              this.quotedList = this.quotedList.concat(this.quotedPriceInfo.rel_quote)
            }
          }
          this.loading = false
        })
    },
    checkOpr() {
      this.loading = true
      quotedPrice
        .oprLog({
          id: this.quotedList[this.quotedIndex]
        })
        .then((res) => {
          if (res.data.status) {
            this.oprLog = res.data.data
            if (this.oprLog.length > 0) {
              this.oprLogFlag = true
            } else {
              this.$message.warning('暂无操作记录')
            }
          }
          this.loading = false
        })
    },
    deleteQuotedPrice() {
      this.$confirm('是否离职该员工?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          quotedPrice
            .delete({
              id: this.quotedList[this.quotedIndex]
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$router.push('/quotedPrice/list?page=1&keyword=&client_id=&user_id=&status=0&date=')
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
    saveBindOrder() {
      // quotedPrice
      //   .bindOrder({
      // quote_id: Number(this.quotedList[this.quotedIndex]),
      // order_id: Number(this.bindOrderId)
      // })
      // .then((res) => {
      //   if (res.data.status) {
      //     this.$message.success('绑定成功')
      //     this.bindOrderFlag = false
      //     this.init()
      //   }
      // })
    },
    searchOrder(str: string, cb: any) {
      if (str) {
        order
          .list({
            page: 1,
            limit: 20,
            keyword: str,
            order_type: Number(this.bindOrderType)
          })
          .then((res) => {
            if (res.data.data.items.length > 0) {
              cb(
                res.data.data.items.map((item: any) => {
                  return {
                    value: item.system_code + '(' + item.code + ')' + '/' + item.client_name + '/' + item.user_name,
                    id: item.id
                  }
                })
              )
            } else {
              cb([])
            }
          })
      } else {
        cb([])
      }
    },
    selectId(ev: any) {
      this.bindOrderId = ev.id
    },
    getQuotedList() {
      this.init(this.quotedList[this.quotedIndex])
    }
  },
  mounted() {
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/workerManage/detail.less';
</style>
<style lang="less">
#workerManageDetail {
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
  .normalTab {
    .el-tabs__nav {
      margin-left: 32px !important;
    }
  }
}
</style>