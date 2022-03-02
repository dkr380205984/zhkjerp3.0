<template>
  <div id="reimbursementManageDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">报销信息</div>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item"
            effect="dark"
            content="点击查看审核日志"
            placement="bottom">
            <img :src="orderInfo.time_data[0].is_check|checkFilter" />
          </el-tooltip>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">报销单号：</div>
            <div class="text">{{orderInfo.code}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">报销人：</div>
            <div class="text">{{orderInfo.user_name}}</div>
          </div>
          <div class="col">
            <div class="label">所属小组：</div>
            <div class="text">{{orderInfo.created_at}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">创建人：</div>
            <div class="text">{{orderInfo.client_name}}</div>
          </div>
          <div class="col">
            <div class="label">创建时间：</div>
            <div class="text">{{orderInfo.contacts_name}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">相关凭证：</div>
            <div class="text">{{orderInfo.group_name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">报销明细</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">序号</div>
            <div class="tcol">报销内容</div>
            <div class="tcol">报销金额（元）</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in 3"
            :key="index">
            <div class="tcol">
              <span class="blue"
                style="cursor:pointer"
                @click="productDetail=item;productShow=true">{{item.product_code||item.system_code}}</span>
              <span class="gray">({{item.category}}/{{item.secondary_category}})</span>
            </div>
            <div class="tcol">{{111}}</div>
            <div class="tcol">{{item.desc||'无'}}</div>
          </div>
        </div>
        <div class="thead">
          <div class="trow">
            <div class="tcol" style="border-right:none">合计费用</div>
            <div class="tcol"></div>
            <div class="tcol">{{3000}}</div>
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
            <div class="btn backHoverOrange"
              @click="checkFlag=true">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-shenhedingdan"></use>
              </svg>
              <span class="text">审核</span>
            </div>
            <div class="btn backHoverOrange"
              @click="$router.push('/order/update?id=' + $route.query.id)">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">修改</span>
            </div>
            <div class="btn backHoverBlue">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-dayindingdan"></use>
              </svg>
              <span class="text">打印</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order } from '@/assets/js/api'
import { OrderInfo, OrderTime } from '@/types/order'
import zhImage from '@/components/zhImage/zhImage.vue'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  components: { zhImage },
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
      oprLogFlag: false,
      oprLog: [],
      materialDetail: [],
      productionDetail: [],
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
    },
    // 操作记录
    checkOpr() {
      this.loading = true
      order
        .oprLog({
          id: Number(this.$route.query.id)
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
    }
  },
  created() {
    // console.log(
    //   this.$checkCommonInfo([
    //     {
    //       checkWhich: 'api/group',
    //       getInfoMethed: 'dispatch',
    //       getInfoApi: 'getGroupAsync'
    //     }
    //   ])
    // )
  },
  mounted() {
    // order
    //   .detail({
    //     id: Number(this.$route.query.id)
    //   })
    //   .then((res) => {
    //     if (res.data.status) {
    //       this.orderInfo = res.data.data
    //       // 整理产品信息
    //       this.orderInfo.time_data.forEach((itemTime) => {
    //         itemTime.batch_data.forEach((itemBatch) => {
    //           this.productList = this.productList.concat(itemBatch.product_data)
    //         })
    //       })
    //       Promise.all([
    //         order.materialDetail({
    //           order_id: Number(this.orderInfo.time_data[0].id)
    //         }),
    //         order.productionDetail({
    //           order_time_id: Number(this.orderInfo.time_data[0].id)
    //         })
    //       ]).then((res) => {
    //         this.materialDetail = res[0].data.data
    //         this.productionDetail = res[1].data.data
    //       })
    //     }
    //   })
    this.loading = false
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/reimbursementManage/detail.less';
</style>