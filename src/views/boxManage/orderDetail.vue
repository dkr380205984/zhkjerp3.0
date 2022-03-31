<template>
  <div id="boxOrderDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">发货信息</div>
      </div>
      <div :class="itemBatchIndex===0?'detailCtn':'detailCtn noPadTop'"
        v-for="(itemBatch,itemBatchIndex) in orderInfo.time_data[0].batch_data"
        :key="itemBatch.id">
        <div class="tableCtn noPadBtm"
          style="padding-left:0;padding-right:0">
          <div class="thead">
            <div class="trow">
              <div class="tcol"
                style="flex:0.72">批次序号</div>
              <div class="tcol">发货时间</div>
              <div class="tcol noPad"
                style="flex:8.7">
                <div class="trow">
                  <div class="tcol">产品品类</div>
                  <div class="tcol noPad"
                    style="flex:3">
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
                style="flex:0.72">
                <span>第{{itemBatch.batch_number}}批</span>
              </div>
              <div class="tcol">
                <span class="green">{{itemBatch.delivery_time}}</span>
              </div>
              <div class="tcol noPad"
                style="flex:8.7">
                <div class="trow"
                  v-for="itemPro in itemBatch.product_data"
                  :key="itemPro.id">
                  <div class="tcol">
                    <span>{{itemPro.product_code||itemPro.system_code||'无编号'}}</span>
                    <span class="gray">({{itemPro.category}}/{{itemPro.secondary_category}})</span>
                  </div>
                  <div class="tcol noPad"
                    style="flex:3">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in itemPro.product_info"
                      :key="indexChild">
                      <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcol">{{itemChild.number}}</div>
                      <div class="tcol">
                        <div class="elCtn">
                          <el-input v-model="itemChild.real_number"
                            placeholder="实际发货数量"></el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tcol">
                <div class="elCtn">
                  <el-input @input="computedEverything"
                    v-model="itemBatch.total_box_count"
                    placeholder="总箱数">
                  </el-input>
                </div>
              </div>
              <div class="tcol">
                <div class="elCtn">
                  <el-input @input="computedEverything"
                    v-model="itemBatch.total_gross_weight"
                    placeholder="总毛重">
                  </el-input>
                </div>
              </div>
              <div class="tcol">
                <div class="elCtn">
                  <el-input @input="computedEverything"
                    v-model="itemBatch.total_net_weight"
                    placeholder="总净重">
                  </el-input>
                </div>
              </div>
              <div class="tcol">
                <div class="elCtn">
                  <el-input @input="computedEverything"
                    v-model="itemBatch.total_bulk"
                    placeholder="总体积">
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">填写发货单</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col"
            style="max-width:253px">
            <div class="label">
              <span class="text">运输单位</span>
              <span class="explanation">(必填)</span>
              <el-tooltip class="item"
                effect="dark"
                content="设置成功后请点击此按钮刷新数据"
                placement="top">
                <i class="el-icon-refresh hoverGreen fr"
                  style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                  @click="$checkCommonInfo([{
                    checkWhich: 'api/clientType',
                    getInfoMethed: 'dispatch',
                    getInfoApi: 'getClientTypeAsync',
                    forceUpdate:true
                  }])"></i>
              </el-tooltip>
              <el-tooltip class="item"
                effect="dark"
                content="添加运输单位"
                placement="top">
                <i class="el-icon-upload hoverOrange fr"
                  style="line-height:38px;font-size:18px;cursor:pointer;"
                  @click="$openUrl('/client/create?type=2')"></i>
              </el-tooltip>
            </div>
            <div class="info elCtn">
              <el-cascader v-model="boxInfo.tree_data"
                placeholder="请选择运输单位"
                @change="(ev)=>{boxInfo.client_id=ev[2]}"
                :options="boxClientList"></el-cascader>
            </div>
          </div>
          <div class="col"
            style="max-width:253px">
            <div class="label">
              <span class="text">运输城市</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-autocomplete class="inline-input"
                v-model="boxInfo.city"
                :fetch-suggestions="searchCity"
                placeholder="请输入运输城市"></el-autocomplete>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">运输地址</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-autocomplete class="inline-input"
                v-model="boxInfo.address"
                :fetch-suggestions="searchAddress"
                placeholder="请输入运输城市"></el-autocomplete>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">总箱数</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="boxInfo.total_box"
                placeholder="请输入总箱数"
                disabled>
                <template slot="append">箱</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">总毛重</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="boxInfo.total_gross_weight"
                placeholder="请输入总毛重"
                disabled>
                <template slot="append">kg</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">总净重</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="boxInfo.total_net_weight"
                placeholder="请输入总净重"
                disabled>
                <template slot="append">kg</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">总体积</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="boxInfo.total_bulk"
                placeholder="请输入总体积"
                disabled>
                <template slot="append">m³</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">运输单价</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="boxInfo.price"
                placeholder="请输入运输单价"
                @input="(ev)=>{
                  boxInfo.price_bulk = $toFixed(Number(ev)*Number(boxInfo.total_bulk));
                  boxInfo.total_price = $toFixed(Number(boxInfo.price_bulk)+ Number(boxInfo.others_fee))
                }">
                <template slot="append">元/m³</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">运输体积价</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="boxInfo.price_bulk"
                placeholder="运输体积价"
                disabled>
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">额外费用</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="boxInfo.others_fee"
                placeholder="请输入额外费用"
                @input="(ev)=>{boxInfo.total_price = $toFixed(Number(ev)+Number(boxInfo.total_price))}">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">运输总价</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input disabled
                v-model="boxInfo.total_price"
                placeholder="请输入运输总价">
                <template slot="append">元</template>
              </el-input>
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
            @click="saveBox">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { boxManage, order } from '@/assets/js/api'
import { BoxInfo } from '@/types/boxManage'
import { OrderInfo, OrderTime } from '@/types/order'
import { CascaderInfo } from '@/types/vuex'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  data(): {
    orderInfo: OrderDetail
    boxInfo: BoxInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      orderInfo: {
        id: null,
        client_id: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '', // 订单用无用字段
        settle_unit: '', // 订单用无用字段
        order_type: 1,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: '',
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
            batch_data: [
              {
                id: '',
                batch_number: 1,
                batch_title: '',
                batch_type: '',
                delivery_time: '',
                is_urgent: 2,
                is_draft: 2,
                total_style: '',
                total_number: '',
                total_price: '',
                desc: '',
                product_data: [
                  {
                    product_id: '',
                    size_color_list: [], // 用于下拉框选择尺码颜色
                    product_info: [
                      {
                        size_color: '', // 用于下拉框选择尺码颜色
                        size_id: '',
                        color_id: '',
                        number: '',
                        price: ''
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      boxInfo: {
        rel_plan: [],
        client_id: '',
        tree_data: [],
        city: '',
        address: '',
        total_box: '',
        total_gross_weight: '',
        total_net_weight: '',
        total_bulk: '',
        price: '',
        others_fee: '',
        total_price: '',
        price_bulk: '',
        order_transport_info: '',
        transport_number_data: [
          {
            order_product_info_id: '',
            transport_number: ''
          }
        ]
      },
      cityList: JSON.parse(this.$getLocalStorage('boxCity')) || [],
      addressList: JSON.parse(this.$getLocalStorage('boxAddress')) || []
    }
  },
  computed: {
    boxClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '运输单位')
    }
  },
  methods: {
    searchAddress(str: string, cb: any) {
      let results = str
        ? this.addressList.filter((item: any) => {
            return item.value.toLowerCase().indexOf(str.toLowerCase()) === 0
          })
        : this.addressList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    searchCity(str: string, cb: any) {
      let results = str
        ? this.cityList.filter((item: any) => {
            return item.value.toLowerCase().indexOf(str.toLowerCase()) === 0
          })
        : this.cityList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    getCmpData() {
      this.boxInfo.order_transport_info = JSON.stringify(this.orderInfo.time_data[0])
      this.boxInfo.transport_number_data = []
      this.orderInfo.time_data[0].batch_data.forEach((item) => {
        item.product_data.forEach((itemPro) => {
          itemPro.product_info.forEach((itemChild) => {
            if (itemChild.real_number) {
              this.boxInfo.transport_number_data.push({
                order_product_info_id: itemChild.id as number,
                transport_number: itemChild.real_number as string
              })
            }
          })
        })
      })
    },
    saveBox() {
      const formCheck = this.$formCheck(this.boxInfo, [
        {
          key: 'client_id',
          errMsg: '请选择运输单位'
        },
        {
          key: 'city',
          errMsg: '请输入运输城市'
        },
        {
          key: 'address',
          errMsg: '请输入运输地址'
        },
        {
          key: 'total_price',
          errMsg: '请输入运输总价'
        }
      ])
      if (!formCheck) {
        this.getCmpData()
        if (this.addressList.length === 10) {
          this.addressList.pop()
        }
        if (!this.addressList.find((item: any) => item.value === this.boxInfo.address)) {
          this.addressList.unshift({
            value: this.boxInfo.address
          })
        }
        if (this.cityList.length === 10) {
          this.cityList.pop()
        }
        if (!this.cityList.find((item: any) => item.value === this.boxInfo.city)) {
          this.cityList.unshift({
            value: this.boxInfo.city
          })
        }
        window.localStorage.setItem('boxAddress', JSON.stringify(this.addressList))
        window.localStorage.setItem('boxCity', JSON.stringify(this.cityList))
        boxManage.create(this.boxInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.$router.push('/boxManage/boxDetail?id=' + res.data.data)
          }
        })
      }
    },
    computedEverything() {
      const totalData = this.orderInfo.time_data[0].batch_data.reduce(
        (total, cur: any) => {
          return {
            total_box: Number(cur.total_box_count) + total.total_box,
            total_gross_weight: Number(cur.total_gross_weight) + total.total_gross_weight,
            total_net_weight: Number(cur.total_net_weight) + total.total_net_weight,
            total_bulk: Number(cur.total_bulk) + total.total_bulk
          }
        },
        {
          total_box: 0,
          total_gross_weight: 0,
          total_net_weight: 0,
          total_bulk: 0
        }
      )
      this.boxInfo.total_box = totalData.total_box
      this.boxInfo.total_gross_weight = this.$toFixed(totalData.total_gross_weight)
      this.boxInfo.total_net_weight = this.$toFixed(totalData.total_net_weight)
      this.boxInfo.total_bulk = this.$toFixed(totalData.total_bulk, 3)
      this.boxInfo.price_bulk = this.$toFixed(Number(this.boxInfo.price) * Number(this.boxInfo.total_bulk))
      this.boxInfo.total_price = this.$toFixed(Number(this.boxInfo.price_bulk) + Number(this.boxInfo.others_fee))
      this.$forceUpdate()
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      }
    ])
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          this.orderInfo.time_data[0].batch_data.forEach((item) => {
            // @ts-ignore 给批次新增一些发货信息
            item.total_box_count = ''
            // @ts-ignore
            item.total_gross_weight = ''
            // @ts-ignore
            item.total_net_weight = ''
            // @ts-ignore
            item.total_bulk = ''
          })
          this.computedEverything()
        }
        this.loading = false
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/boxManage/orderDetail.less';
</style>