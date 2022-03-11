<template>
  <div id="boxDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">计划单信息</div>
      </div>
      <div class="detailCtn">
        <div class="tableCtn"
          v-for="item in packPlanLog"
          :key="item.id"
          style="padding-left:0;padding-right:0">
          <div class="thead">
            <div class="trow">
              <div class="tcol">计划单号</div>
              <div class="tcol">订单号</div>
              <div class="tcol noPad"
                style="flex:8">
                <div class="trow">
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcol">产品</div>
                      <div class="tcol">尺码颜色</div>
                      <div class="tcol">计划装箱数量</div>
                      <div class="tcol">实际装箱数量</div>
                    </div>
                  </div>
                  <div class="tcol"
                    style="flex:0.5">总箱数</div>
                  <div class="tcol"
                    style="flex:0.5">总毛重</div>
                  <div class="tcol"
                    style="flex:0.5">总净重</div>
                  <div class="tcol"
                    style="flex:0.5">总体积</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in packPlanLog"
              :key="item.id">
              <div class="tcol">{{item.code}}</div>
              <div class="tcol">{{item.order_code}}</div>
              <div class="tcol noPad"
                style="flex:8">
                <div class="trow"
                  v-for="(itemData,indexData) in item.data"
                  :key="indexData">
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemPro,indexPro) in itemData.product_info"
                      :key="indexPro">
                      <div class="tcol">
                        <span>{{itemPro.product_code}}</span>
                        <span>{{itemPro.category}}/{{itemPro.secondary_category}}</span>
                      </div>
                      <div class="tcol">{{itemPro.size_name}}/{{itemPro.color_name}}</div>
                      <div class="tcol">{{itemPro.pack_number_all}}</div>
                      <div class="tcol">
                        <div class="elCtn">
                          <el-input v-model="itemPro.transport_number"
                            placeholder="实际数量"></el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tcol"
                    style="flex:0.5">{{itemData.total_box_count}}箱</div>
                  <div class="tcol"
                    style="flex:0.5">{{itemData.total_gross_weight}}kg</div>
                  <div class="tcol"
                    style="flex:0.5">{{itemData.total_net_weight}}kg</div>
                  <div class="tcol"
                    style="flex:0.5">{{itemData.total_bulk}}m³</div>
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
                placeholder="请输入总箱数">
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
                placeholder="请输入总毛重">
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
                placeholder="请输入总净重">
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
                placeholder="请输入总体积">
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
                @change="(ev)=>{boxInfo.total_price = $toFixed(Number(ev)*Number(boxInfo.total_box) + Number(boxInfo.others_fee))}">
                <template slot="append">元/箱</template>
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
                @change="(ev)=>{boxInfo.total_price = $toFixed(Number(ev)*Number(boxInfo.total_bulk)+ Number(boxInfo.others_fee))}">
                <template slot="append">元/m³</template>
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
                @change="(ev)=>{boxInfo.total_price = $toFixed(Number(ev)+Number(boxInfo.total_price))}">
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
              <el-input v-model="boxInfo.total_price"
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
import { boxManage, packManage } from '@/assets/js/api'
import { BoxInfo } from '@/types/boxManage'
import { PackPlanInfo } from '@/types/packManage'
import { CascaderInfo } from '@/types/vuex'
export default Vue.extend({
  data(): {
    boxInfo: BoxInfo
    packPlanLog: PackPlanInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      packPlanLog: [],
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
      this.boxInfo.rel_plan = JSON.parse(this.$route.query.id as string) as number[]
      this.boxInfo.transport_number_data = []
      this.packPlanLog.forEach((item) => {
        item.data.forEach((itemChild) => {
          itemChild.product_info.forEach((itemPro) => {
            this.boxInfo.transport_number_data.push({
              transport_number: Number(itemPro.transport_number) || Number(itemPro.pack_number_all),
              order_product_info_id: itemPro.order_product_info_id as number
            })
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
          }
        })
      }
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
    packManage
      .detailPlan({
        id: JSON.parse(this.$route.query.id as string) as number[]
      })
      .then((res) => {
        if (res.data.status) {
          this.packPlanLog = res.data.data
          this.packPlanLog.forEach((itemPack) => {
            itemPack.data.forEach((itemData) => {
              itemData.total_box_count = itemData.info_data.reduce((total, cur) => {
                return total + Number(cur.box_count)
              }, 0)
              itemData.total_bulk = itemData.info_data.reduce((total, cur) => {
                return total + Number(cur.total_bulk)
              }, 0)
              itemData.total_gross_weight = itemData.info_data.reduce((total, cur) => {
                return total + Number(cur.total_gross_weight)
              }, 0)
              itemData.total_net_weight = itemData.info_data.reduce((total, cur) => {
                return total + Number(cur.total_net_weight)
              }, 0)
              itemData.product_info.forEach((itemPro) => {
                itemPro.pack_number_all = 0
                itemData.info_data.forEach((itemInfo) => {
                  itemInfo.product_info.forEach((itemChild) => {
                    if (
                      itemChild.product_id === itemPro.product_id &&
                      itemChild.size_id === itemPro.size_id &&
                      itemChild.color_id === itemPro.color_id
                    ) {
                      itemPro.pack_number_all =
                        Number(itemPro.pack_number_all) + Number(itemChild.pack_number) * Number(itemInfo.box_count)
                    }
                  })
                })
              })
            })
          })
          const totalData = this.packPlanLog.reduce(
            (totalPlan, curPlan) => {
              return {
                total_box:
                  totalPlan.total_box +
                  curPlan.data.reduce((total, cur) => {
                    return total + Number(cur.total_box_count)
                  }, 0),
                total_gross_weight:
                  totalPlan.total_gross_weight +
                  curPlan.data.reduce((total, cur) => {
                    return total + Number(cur.total_gross_weight)
                  }, 0),
                total_net_weight:
                  totalPlan.total_net_weight +
                  curPlan.data.reduce((total, cur) => {
                    return total + Number(cur.total_net_weight)
                  }, 0),
                total_bulk:
                  totalPlan.total_bulk +
                  curPlan.data.reduce((total, cur) => {
                    return total + Number(cur.total_bulk)
                  }, 0)
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
          this.boxInfo.total_gross_weight = totalData.total_gross_weight
          this.boxInfo.total_net_weight = totalData.total_net_weight
          this.boxInfo.total_bulk = totalData.total_bulk
        }
        this.loading = false
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/boxManage/detail.less';
</style>