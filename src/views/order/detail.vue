<template>
  <div id="orderDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
    <div class="module">
      <div class="titleCtn">
        <div class="title">产品信息</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">产品编号</div>
            <div class="tcol">产品名称</div>
            <div class="tcol">产品图片</div>
            <div class="tcol noPad"
              style="flex:3">
              <div class="trow">
                <div class="tcol">尺码颜色</div>
                <div class="tcol">下单单价</div>
                <div class="tcol">下单数量</div>
              </div>
            </div>
            <div class="tcol">产品单据状态</div>
            <div class="tcol">产品描述</div>
            <div class="tcol">修改意见</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in productList"
            :key="index">
            <div class="tcol">
              <span class="blue"
                style="cursor:pointer"
                @click="productDetail=item;productShow=true">{{item.product_code||item.system_code}}</span>
              <span class="gray">({{item.category}}/{{item.secondary_category}})</span>
            </div>
            <div class="tcol">{{item.name}}</div>
            <div class="tcol">
              <div class="imageCtn">
                <el-image style="width:100%;height:100%"
                  :src="item.image_data.length>0?item.image_data[0]:''"
                  :preview-src-list="item.image_data">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"
                      style="font-size:42px"></i>
                  </div>
                </el-image>
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:3">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.product_info"
                :key="indexChild">
                <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                <div class="tcol">{{itemChild.price}}元</div>
                <div class="tcol">{{itemChild.number}}</div>
              </div>
            </div>
            <div class="tcol stateCtn">
              <div class="state"
                @click="item.craft_list_id?$router.push('/craft/detail?id='+item.craft_list_id):$router.push('/craft/create?id=' + item.product_id)">
                <div class="circle"
                  :class="{'backGray':!item.craft_list_id,'backBlue':item.craft_list_id}">工</div>
              </div>
            </div>
            <div class="tcol">{{item.desc||'无'}}</div>
            <div class="tcol">{{item.client_edit_idea||'无'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">发货信息</div>
      </div>
      <div :class="itemBatchIndex===0?'detailCtn':'detailCtn noPadTop'"
        v-for="(itemBatch,itemBatchIndex) in orderInfo.time_data[0].batch_data"
        :key="itemBatch.id">
        <div class="tableCtn noPadBtm">
          <div class="thead">
            <div class="trow">
              <div class="tcol"
                style="flex:0.72">批次序号</div>
              <div class="tcol">发货时间</div>
              <div class="tcol">批次名称</div>
              <div class="tcol">批次类型</div>
              <div class="tcol">批次备注</div>
              <div class="tcol noPad"
                style="flex:8.7">
                <div class="trow">
                  <div class="tcol">产品品类</div>
                  <div class="tcol">产品图片</div>
                  <div class="tcol noPad"
                    style="flex:3">
                    <div class="trow">
                      <div class="tcol">尺码颜色</div>
                      <div class="tcol">计划发货数量</div>
                      <div class="tcol">实际发货数量</div>
                    </div>
                  </div>
                  <div class="tcol">批次状态</div>
                </div>
              </div>
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
              <div class="tcol">
                <span>{{itemBatch.batch_title || '无'}}</span>
              </div>
              <div class="tcol">
                <span>{{itemBatch.batch_type_name}}</span>
              </div>
              <div class="tcol">
                <span>{{itemBatch.desc || '无'}}</span>
              </div>
              <div class="tcol noPad"
                style="flex:8.7">
                <div class="trow"
                  v-for="itemPro in itemBatch.product_data"
                  :key="itemPro.id">
                  <div class="tcol">
                    <span>{{itemPro.product_code||'无编号'}}</span>
                    <span class="gray">({{itemPro.category}}/{{itemPro.secondary_category}})</span>
                  </div>
                  <div class="tcol">
                    <div class="trow"
                      v-for="(itemImage,indexImage) in itemPro.image_data"
                      :key="indexImage">
                      <div class="imageCtn">
                        <el-image style="width:100%;height:100%;margin-top:2px"
                          :src="itemPro.image_data.length>0?itemImage:''"
                          :preview-src-list="itemPro.image_data">
                          <div slot="error"
                            class="image-slot">
                            <i class="el-icon-picture-outline"
                              style="font-size:42px"></i>
                          </div>
                        </el-image>
                      </div>
                    </div>
                  </div>
                  <div class="tcol noPad"
                    style="flex:3">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in itemPro.product_info"
                      :key="indexChild">
                      <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcol">{{itemChild.number}}</div>
                      <div class="tcol">0</div>
                    </div>
                  </div>
                  <div class="tcol">暂无</div>
                </div>
              </div>
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
          <div class="buttonList"
            style="margin-left:12px">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">订单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange"
                  @click="$router.push('/order/update?id=' + $route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">修改订单</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="checkFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shenhedingdan"></use>
                  </svg>
                  <span class="text">审核订单</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteOrder">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">删除订单</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$router.push('/materialPlan/create?id=' + $route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-wuliaojihua1"></use>
                  </svg>
                  <span class="text">物料计划</span>
                </div>
                <div class="btn backHoverBlue">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-dayindingdan"></use>
                  </svg>
                  <span class="text">打印订单</span>
                </div>
                <div class="btn backHoverBlue">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-youjianfenxiang"></use>
                  </svg>
                  <span class="text">邮件分享</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$router.push('/quotedPrice/create?orderId='+$route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">转报价单</span>
                </div>
                <div class="btn backHoverBlue">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">操作记录</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <product-detail :data="productDetail"
      :show="productShow"
      @close="productShow = false"></product-detail>
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{orderInfo.time_data[0].is_check=ev;$forceUpdate()}"
      :show="checkFlag"
      :pid="orderInfo.time_data[0].id"
      :check_type="1"
      :reason="['驳回理由1','驳回理由2','驳回理由3','驳回理由4','驳回理由5']"></zh-check>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order } from '@/assets/js/api'
import { OrderInfo, OrderTime } from '@/types/order'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  data(): {
    orderInfo: OrderDetail
    [propName: string]: any
  } {
    return {
      loading: true,
      checkFlag: false,
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
      productList: [],
      productDetail: {
        product_type: 1,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category: '',
        type: '',
        image_data: [],
        desc: '',
        style_data: [], // 款式
        component_data: [
          {
            component_id: '',
            number: '' // 成分信息
          }
        ],
        size_data: [
          {
            size_id: '',
            size_info: '',
            weight: ''
          }
        ], // 尺码组
        color_data: [], // 配色组
        // 配件信息
        part_data: [
          {
            name: '',
            unit: '',
            part_size_data: [
              {
                size_id: '',
                size_info: '',
                weight: ''
              }
            ],
            part_component_data: [
              {
                component_id: '',
                number: '' // 成分信息
              }
            ]
          }
        ]
      },
      productShow: false
    }
  },
  methods: {
    deleteOrder() {
      this.$confirm('是否删除该订单?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          order
            .delete({
              id: Number(this.$route.query.id)
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$router.push('/order/list?page=1&keyword=&client_id=&user_id=&status=null0&date=')
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    console.log(
      this.$checkCommonInfo([
        {
          checkWhich: 'api/group',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getGroupAsync'
        }
      ])
    )
  },
  mounted() {
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          console.log(this.orderInfo)
          // 整理产品信息
          this.orderInfo.time_data.forEach((itemTime) => {
            itemTime.batch_data.forEach((itemBatch) => {
              this.productList = this.productList.concat(itemBatch.product_data)
            })
          })
          this.loading = false
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/order/detail.less';
</style>