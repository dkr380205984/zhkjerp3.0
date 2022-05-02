<template>
  <div id="boxDetailDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">装箱出库详情</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">出库单号：</div>
            <div class="text">{{boxInfo.code}}</div>
          </div>
          <div class="col">
            <div class="label">创建人：</div>
            <div class="text">{{boxInfo.user_name}}</div>
          </div>
          <div class="col">
            <div class="label">创建日期：</div>
            <div class="text">{{boxInfo.created_at}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">总箱数：</div>
            <div class="text">{{boxInfo.total_box}}箱</div>
          </div>
          <div class="col">
            <div class="label">总毛重：</div>
            <div class="text">{{boxInfo.total_gross_weight}}kg</div>
          </div>
          <div class="col">
            <div class="label">总净重：</div>
            <div class="text">{{boxInfo.total_net_weight}}kg</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">总体积：</div>
            <div class="text">{{boxInfo.total_bulk}}m³</div>
          </div>
          <div class="col">
            <div class="label">运输单价：</div>
            <div class="text">{{boxInfo.price}}元/m³</div>
          </div>
          <div class="col">
            <div class="label">体积价：</div>
            <div class="text">{{boxInfo.price_bulk}}元</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">额外费用：</div>
            <div class="text">{{boxInfo.others_fee}}元</div>
          </div>
          <div class="col">
            <div class="label">运输总价：</div>
            <div class="text">{{boxInfo.total_price}}元</div>
          </div>
          <div class="col">
            <div class="label">结算状态：</div>
            <div class="text"
              :class="{'green':boxInfo.has_invoice===1||boxInfo.has_pay===1,'gray':boxInfo.has_invoice!==1&&boxInfo.has_pay!==1}">{{boxInfo.has_invoice===1||boxInfo.has_pay===1?'已结算':'待结算'}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">运输单位：</div>
            <div class="text">{{boxInfo.client_name}}</div>
          </div>
          <div class="col">
            <div class="label">运输城市：</div>
            <div class="text">{{boxInfo.city}}</div>
          </div>
          <div class="col">
            <div class="label">运输地址：</div>
            <div class="text">{{boxInfo.address}}</div>
          </div>
        </div>
        <div class="row"
          v-for="item in boxInfo.others_fee_data"
          :key="item.id">
          <div class="col">
            <div class="label">额外费用：</div>
            <div class="text">{{item.name}}</div>
          </div>
          <div class="col">
            <div class="label">费用价格：</div>
            <div class="text">{{item.price}}元</div>
          </div>
          <div class="col">
            <div class="label">费用备注：</div>
            <div class="text">{{item.desc}}</div>
          </div>
        </div>
      </div>
      <div class="tableCtn"
        v-for="item in packPlanLogCopy"
        :key="item.id">
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
          <div class="trow">
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
                    <div class="tcol">{{itemPro.transport_number}}</div>
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
      <div v-for="itemOrder in orderInfoCopy"
        :key="itemOrder.id">
        <div :class="itemBatchIndex===0?'detailCtn':'detailCtn noPadTop'"
          v-for="(itemBatch,itemBatchIndex) in itemOrder.time_data[0].batch_data"
          :key="itemBatch.id">
          <div class="tableCtn noPadBtm"
            style="padding-left:0;padding-right:0">
            <div class="thead">
              <div class="trow">
                <div class="tcol">订单/批次</div>
                <div class="tcol">发货时间</div>
                <div class="tcol noPad"
                  style="flex:4.7">
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
                <div class="tcol">
                  <span>{{itemOrder.code}}</span>
                  <span>第{{itemBatch.batch_number}}批</span>
                </div>
                <div class="tcol">
                  <span class="green">{{itemBatch.delivery_time}}</span>
                </div>
                <div class="tcol noPad"
                  style="flex:4.7">
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
                          {{itemChild.real_number}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tcol">
                  {{itemBatch.total_box_count}}
                </div>
                <div class="tcol">
                  {{itemBatch.total_gross_weight}}
                </div>
                <div class="tcol">
                  {{itemBatch.total_net_weight}}
                </div>
                <div class="tcol">
                  {{itemBatch.total_bulk}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 只看当前出库单信息，不需要看订单汇总信息 -->
      <!-- <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">产品信息</div>
            <div class="tcol">尺码颜色</div>
            <div class="tcol">计划发货数量</div>
            <div class="tcol">实际发货数量</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in batchInfo"
            :key="index">
            <div class="tcol">{{item.product_code}}
              <span>({{item.category}}/{{item.secondary_category}})</span>
            </div>
            <div class="tcol">{{item.size_name}}/{{item.color_name}}</div>
            <div class="tcol">{{item.number}}</div>
            <div class="tcol">{{item.transport_number}}</div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverGreen"
            @click="otherFeeFlag=true;boxInfo.others_fee_data?otherFeeInfo.data=boxInfo.others_fee_data:''">{{boxInfo.others_fee_data?'修改':'新增'}}额外费用</div>
          <div class="btn backHoverBlue"
            @click="$openUrl('/boxManage/print?id='+$route.query.id)">打印</div>
          <div class="btn backHoverOrange"
            @click="Number($getsessionStorage('has_check'))!==1&&(boxInfo.has_invoice===1||boxInfo.has_pay===1)?$message.error('单据已结算，无法修改，可联系管理员操作'):(orderInfoCopy.length>0?$router.push('/boxManage/orderDetail?boxId='+$route.query.id):$router.push('/boxManage/detail?boxId='+$route.query.id))">修改</div>
        </div>
      </div>
    </div>
    <!-- 额外费用 -->
    <div class="popup"
      v-show="otherFeeFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">额外费用</span>
          <div class="closeCtn"
            @click="otherFeeFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="rowCtn"
            v-for="item,index in otherFeeInfo.data"
            :key="index">
            <div class="closeCtn"
              @click="otherFeeInfo.data.length>1?$deleteItem(otherFeeInfo.data,index):$message.error('不能少于一项')">
              <span class="el-icon-close hoverRed"></span>
            </div>
            <div class="row">
              <div class="label">费用名称：</div>
              <div class="info elCtn">
                <el-input v-model="item.name"
                  placeholder="费用名称"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">额外费用：</div>
              <div class="info elCtn">
                <el-input v-model="item.price"
                  placeholder="额外费用">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">备注信息：</div>
              <div class="info elCtn">
                <el-input v-model="item.desc"
                  placeholder="备注信息"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="otherFeeFlag=false">取消</span>
          <span class="btn backHoverGreen"
            @click="$addItem(otherFeeInfo.data,{
              name: '',
              price: '',
              desc: ''
            })">新增额外费用</span>
          <span class="btn backHoverBlue"
            @click="saveOtherFee">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { boxManage } from '@/assets/js/api'
import { BoxInfo } from '@/types/boxManage'
import { PackPlanInfo } from '@/types/packManage'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    boxInfo: BoxInfo
    packPlanLog: Array<{
      transport_info: string // 记录一个字符串保存N多信息
      plan_id: number | string
      plan_info: PackPlanInfo
    }>
    packPlanLogCopy: PackPlanInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      packPlanLogCopy: [], // 前端保存的发货单具体信息，只能看，不能做任何操作
      packPlanLog: [],
      batchInfo: [],
      orderInfoCopy: [], // 前端保存的订单发货具体信息，只能看，不能做任何操作
      boxInfo: {
        code: '',
        user_name: '',
        created_at: '',
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
      otherFeeFlag: false,
      otherFeeInfo: {
        id: '',
        data: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ]
      }
    }
  },
  methods: {
    saveOtherFee() {
      const formCheck = this.otherFeeInfo.data.some((item: any) => {
        return this.$formCheck(item, [
          {
            key: 'name',
            errMsg: '请输入名称'
          },
          {
            key: 'price',
            errMsg: '请输入费用'
          }
        ])
      })
      if (!formCheck) {
        this.loading = true
        this.otherFeeInfo.id = this.$route.query.id
        boxManage.addOtherFee(this.otherFeeInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.otherFeeFlag = false
            this.init()
          }
        })
      }
    },
    init() {
      this.loading = true
      boxManage
        .detail({
          id: Number(this.$route.query.id)
        })
        .then((res) => {
          if (res.data.status) {
            this.boxInfo = res.data.data
            // @ts-ignore
            this.packPlanLog = this.boxInfo.rel_plan
            this.packPlanLog.forEach((itemPack) => {
              itemPack.transport_info = JSON.parse(itemPack.transport_info)
              itemPack.plan_info.data.forEach((itemData) => {
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
            // @ts-ignore
            this.packPlanLogCopy = this.packPlanLog.map((item) => item.transport_info)
            // @ts-ignore
            this.batchInfo = this.boxInfo.rel_batch
            this.orderInfoCopy = this.boxInfo.order_transport_info ? JSON.parse(this.boxInfo.order_transport_info) : []
          }
          console.log(this.packPlanLog)
          this.loading = false
        })
    }
  },
  mounted() {
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/boxManage/boxDetail.less';
</style>