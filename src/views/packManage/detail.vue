<template>
  <div id="packManageDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">包装计划信息</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">包装名称</div>
            <div class="tcol">长</div>
            <div class="tcol">宽</div>
            <div class="tcol">高</div>
            <div class="tcol">属性或说明</div>
            <div class="tcol">图片</div>
            <div class="tcol">计划数量</div>
            <div class="tcol">已订购数量</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow">
            <div class="tcol">包装名称</div>
            <div class="tcol">长</div>
            <div class="tcol">宽</div>
            <div class="tcol">高</div>
            <div class="tcol">属性或说明</div>
            <div class="tcol">图片</div>
            <div class="tcol">计划数量</div>
            <div class="tcol">已订购数量</div>
          </div>
          <div class="trow">
            <div class="tcol gray"
              style="text-align:center">暂无计划包装信息</div>
          </div>
        </div>
      </div>
      <div class="buttonList">
        <div class="btn backHoverBlue">
          <i class="el-icon-s-grid"></i>
          <span class="text">包装订购操作</span>
        </div>
        <div class="otherInfoCtn">
          <div class="otherInfo">
            <div class="btn backHoverBlue">
              <svg class="iconFont"
                aria-hidden="true"
                @click="goOrderPack('plan')">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">计划订购</span>
            </div>
            <div class="btn backHoverOrange"
              @click="goOrderPack('direct')">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">直接订购</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="packOrderLog.length>0">
      <el-tabs type="border-card"
        v-model="packOrderLogIndex">
        <el-tab-pane v-for="(item,index) in packOrderLog"
          :key="index"
          :name="item.id.toString()"
          :label="'订购单'+(index+1)">
          <div class="titleCtn">
            <div class="title">订购信息</div>
          </div>
          <div class="detailCtn">
            <div class="row">
              <div class="col">
                <div class="label">单据编号：</div>
                <div class="text">{{item.code}}</div>
              </div>
              <div class="col">
                <div class="label">创建人：</div>
                <div class="text">{{item.user_name}}</div>
              </div>
              <div class="col">
                <div class="label">订购单位：</div>
                <div class="text">{{item.client_name}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">订购日期：</div>
                <div class="text">{{item.order_time}}</div>
              </div>
              <div class="col">
                <div class="label">交货日期：</div>
                <div class="text">{{item.delivery_time}}</div>
              </div>
              <div class="col">
                <div class="label">更新时间：</div>
                <div class="text">{{item.created_at}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">订购总数：</div>
                <div class="text">{{item.total_number}}</div>
              </div>
              <div class="col">
                <div class="label">订购总额：</div>
                <div class="text">{{item.total_price}}元</div>
              </div>
              <div class="col"></div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">备注信息</div>
                <div class="text">{{item.desc}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">包装名称</div>
                <div class="tcol">包装规格</div>
                <div class="tcol">体积单价</div>
                <div class="tcol">数量单价</div>
                <div class="tcol">订购数量</div>
                <div class="tcol">备注信息</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.info_data"
                :key="indexChild">
                <div class="tcol">{{itemChild.pack_material_name}}</div>
                <div class="tcol">
                  <template v-if="Number(itemChild.price_type)===1">
                    {{itemChild.length}}*{{itemChild.width}}*{{itemChild.height}}m
                  </template>
                  <template v-else-if="Number(itemChild.price_type)===2">
                    {{itemChild.length}}*{{itemChild.width}}m
                  </template>
                  <template v-else-if="Number(itemChild.price_type)===3">
                    {{itemChild.length}}
                  </template>
                </div>
                <div class="tcol">{{itemChild.bulk_price}}元</div>
                <div class="tcol">{{itemChild.count_price}}元</div>
                <div class="tcol">{{itemChild.number}}</div>
                <div class="tcol">{{itemChild.desc}}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="popup"
      v-show="packOrderFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">包装订购信息</span>
          <div class="closeCtn">
            <span class="el-icon-close"
              @click="packOrderFlag = false"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn"
            v-for="(item,index) in packOrderInfo"
            :key="index">
            <div class="deleteIcon"
              @click="packOrderInfo.length>1?$deleteItem(packOrderInfo,index):$message.error('至少有一家订购单位')">
              <i class="el-icon-close"></i>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">订购单位</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-cascader placeholder="请选择订购单位"
                    v-model="item.client_id_arr"
                    :options="packClientList"
                    @change="(ev)=>{item.client_id=ev[2]}"></el-cascader>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">下单日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    placeholder="请选择时间"
                    value-format="yyyy-MM-dd"
                    v-model="item.order_time"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">交货日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    placeholder="请选择交货日期"
                    value-format="yyyy-MM-dd"
                    v-model="item.delivery_time"></el-date-picker>
                </div>
              </div>
            </div>
            <div class="rowCtn"
              v-for="(itemChild,indexChild) in item.info_data"
              :key="indexChild">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">计价类型</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select v-model="itemChild.price_type"
                      placeholder="请选择计价类型">
                      <el-option :value="1"
                        label="纸箱:面积"></el-option>
                      <el-option :value="2"
                        label="胶袋:面积"></el-option>
                      <el-option :value="3"
                        label="其他"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">包装辅料名称</span>
                    <span class="explanation">(必选)</span>
                    <el-tooltip class="item"
                      effect="dark"
                      content="设置成功后请点击此按钮刷新数据"
                      placement="top">
                      <i class="el-icon-refresh hoverGreen fr"
                        style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                        @click="$checkCommonInfo([{
                        checkWhich: 'api/packMaterial',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getPackMaterialAsync',
                        forceUpdate:true
                      }])"></i>
                    </el-tooltip>
                    <el-tooltip class="item"
                      effect="dark"
                      content="添加新包装辅料"
                      placement="top">
                      <i class="el-icon-upload hoverOrange fr"
                        style="line-height:38px;font-size:18px;cursor:pointer"
                        @click="$openUrl('/setting/?pName=物料设置&cName=包装辅料')"></i>
                    </el-tooltip>
                  </div>
                  <div class="info elCtn">
                    <el-select v-model="itemChild.pack_material_id"
                      placeholder="请选择包装辅料名称"
                      filterable>
                      <el-option v-for="item in packMaterialList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">包装尺寸</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info elCtn"
                    style="flex-direction:row;display: flex;">
                    <template v-if="itemChild.price_type!==3">
                      <el-input style="margin-right:12px"
                        v-model="itemChild.length"
                        placeholder="长"></el-input>
                      <el-input style="margin-right:12px"
                        v-model="itemChild.width"
                        placeholder="宽"></el-input>
                      <el-input v-if="itemChild.price_type!==2"
                        v-model="itemChild.height"
                        placeholder="高"></el-input>
                    </template>
                    <template v-else>
                      <el-input v-model="itemChild.length"
                        placeholder="尺寸规格"></el-input>
                    </template>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">包装属性或说明</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemChild.desc"
                      placeholder="包装属性或说明"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label">
                        <span class="text">体积单价（元/平米）</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-input v-model="itemChild.bulk_price"
                          placeholder="单价"
                          @input="(ev)=>{return getCountPrice(ev,itemChild)}">
                          <template slot="append">元/㎡</template>
                        </el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label">
                        <span class="text">数量单价（元/个）</span>
                      </div>
                      <div class="info elCtn">
                        <el-input v-model="itemChild.count_price"
                          placeholder="单价">
                          <template slot="append">元/个</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">订购数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemChild.number"
                      placeholder="订购数量"></el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexChild===0"
                  @click="$addItem(item.info_data,{
                    price_type: 1,
                    pack_material_id: '',
                    length: '',
                    width: '',
                    height: '',
                    desc: '',
                    bulk_price: '',
                    count_price: '',
                    number: ''
                  })">添加</div>
                <div class="opr hoverRed"
                  v-if="indexChild>0"
                  @click="$deleteItem(item.info_data,indexChild)">删除</div>
              </div>
            </div>
            <div class="row"
              v-for="(itemOther,indexOther) in item.others_fee_data"
              :key="'other'+indexOther">
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">额外费用名称</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入额外费用名称"
                    v-model="itemOther.name"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">额外费用金额</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入额外费用金额"
                    v-model="itemOther.price">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">额外费用备注</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入额外费用备注"
                    v-model="itemOther.desc"></el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexOther===0"
                @click="$addItem(item.others_fee_data,{
                  desc: '',
                  name: '',
                  price: ''
                })">添加</div>
              <div class="opr hoverRed"
                v-if="indexOther>0"
                @click="$deleteItem(item.others_fee_data,indexOther)">删除</div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">订购备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入订购备注信息"
                    v-model="item.desc"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">订购总价</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="自动计算"
                    v-model="totalOrderPriceList[index]"
                    disabled>
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">订购总数</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="自动计算"
                    v-model="totalOrderNumberList[index]"
                    disabled>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="btn backHoverBlue"
            style="margin-bottom:16px"
            @click="$addItem(packOrderInfo,{
              order_id: '',
              client_id_arr:[],
              client_id: '',
              client_name: '',
              order_time: $getDate(new Date()),
              delivery_time: '',
              desc: '',
              file_url: '',
              total_price: '',
              total_number: '',
              others_fee_data: [
                {
                  desc: '', // 额外费用备注
                  name: '',
                  price: ''
                }
              ],
              info_data: [
                {
                  price_type: 1,
                  pack_material_id: '',
                  length: '',
                  width: '',
                  height: '',
                  desc: '',
                  bulk_price: '',
                  count_price: '',
                  number: ''
                }
              ]
            })">添加订购单位</div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="packOrderFlag = false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveOrderPack">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, packManage } from '@/assets/js/api'
import { PackOrderInfo } from '@/types/packManage'
import { PackMaterialInfo } from '@/types/materialSetting'
import { CascaderInfo } from '@/types/vuex'
export default Vue.extend({
  data(): {
    packOrderLog: PackOrderInfo[]
    packOrderInfo: PackOrderInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      orderIndex: '0',
      orderInfo: {
        id: null,
        client_id: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '',
        settle_unit: '',
        order_type: 1,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: this.$getDate(new Date()),
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
            is_before_confirm: 2,
            is_send: 2,
            batch_data: [
              {
                id: '',
                batch_number: 1,
                batch_title: '',
                batch_type_id: '',
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
                    size_color_list: [],
                    product_info: [
                      {
                        size_color: '',
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
      packOrderFlag: false,
      packOrderInfo: [
        {
          order_id: '',
          client_id: '',
          client_id_arr: [],
          client_name: '',
          order_time: this.$getDate(new Date()),
          delivery_time: '',
          desc: '',
          file_url: '',
          total_price: '',
          total_number: '',
          others_fee_data: [
            {
              desc: '', // 额外费用备注
              name: '',
              price: ''
            }
          ],
          info_data: [
            {
              price_type: 1,
              pack_material_id: '',
              length: '',
              width: '',
              height: '',
              desc: '',
              bulk_price: '',
              count_price: '',
              number: ''
            }
          ]
        }
      ],
      packOrderLog: [],
      packOrderLogIndex: ''
    }
  },
  computed: {
    packMaterialList(): PackMaterialInfo[] {
      return this.$store.state.api.packMaterial.arr
    },
    packClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '包装辅料单位')
    },
    totalOrderNumberList(): number[] {
      return this.packOrderInfo.map((item) => {
        return item.info_data.reduce((total, current) => {
          return total + Number(current.number)
        }, 0)
      })
    },
    totalOrderPriceList(): string[] {
      return this.packOrderInfo.map((item) => {
        return (
          item.info_data.reduce((total, current) => {
            return total + Number(current.number) * Number(current.count_price)
          }, 0) +
          item.others_fee_data.reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        ).toFixed(2)
      })
    }
  },
  methods: {
    init() {
      Promise.all([
        packManage.orderList({
          order_id: this.order_id
        })
      ]).then((res) => {
        this.packOrderLog = res[0].data.data
        if (this.packOrderLog.length > 0) {
          this.packOrderLogIndex = this.packOrderLog[0].id!.toString()
        }
      })
      this.loading = false
    },
    resetOrderPack() {
      this.packOrderInfo = [
        {
          order_id: '',
          client_id: '',
          client_name: '',
          client_id_arr: [],
          order_time: this.$getDate(new Date()),
          delivery_time: '',
          desc: '',
          file_url: '',
          total_price: '',
          total_number: '',
          others_fee_data: [
            {
              desc: '', // 额外费用备注
              name: '',
              price: ''
            }
          ],
          info_data: [
            {
              price_type: 1,
              pack_material_id: '',
              length: '',
              width: '',
              height: '',
              desc: '',
              bulk_price: '',
              count_price: '',
              number: ''
            }
          ]
        }
      ]
    },
    goOrderPack(type: 'plan' | 'direct') {
      if (type === 'plan') {
        this.$message.error('请勾选计划信息订购')
      } else {
        this.resetOrderPack()
        this.packOrderFlag = true
      }
    },
    // 计算数量单个
    getCountPrice(bulkPrice: number, info: any) {
      console.log(info)
      if (info.price_type === 1 && info.length && info.width && info.height) {
        info.count_price = Number(info.length) * Number(info.width) * Number(info.height) * bulkPrice
      } else if (info.price_type === 2 && info.length && info.width) {
        info.count_price = Number(info.length) * Number(info.width) * bulkPrice
      }
    },
    getOrderCmpData() {
      this.packOrderInfo.forEach((item, index) => {
        item.order_id = this.order_id
        item.total_number = this.totalOrderNumberList[index]
        item.total_price = this.totalOrderPriceList[index]
      })
    },
    saveOrderPack() {
      const formCheck = this.packOrderInfo.some((item) => {
        return (
          this.$formCheck(item, [
            {
              key: 'client_id',
              errMsg: '请选择订购单位'
            },
            {
              key: 'delivery_time',
              errMsg: '请选择交货日期'
            }
          ]) ||
          item.info_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
              {
                key: 'pack_material_id',
                errMsg: '请选择包装辅料'
              },
              {
                key: 'number',
                errMsg: '请输入订购数量'
              }
            ])
          })
        )
      })
      if (!formCheck) {
        this.getOrderCmpData()
        packManage.createOrder({ data: this.packOrderInfo }).then((res) => {
          if (res.data.status) {
            this.$message.success('订购成功')
            this.packOrderFlag = false
            this.init()
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
      },
      {
        checkWhich: 'api/packMaterial',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPackMaterialAsync'
      }
    ])
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.order_id = res.data.data.time_data[this.orderIndex].id
        this.orderInfo = res.data.data
        this.init()
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/packManage/detail.less';
</style>
<style lang="less">
#packManageDetail {
  .el-tabs__content {
    padding: 0;
  }
}
</style>