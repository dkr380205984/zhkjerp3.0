<template>
  <div class="orderDetail">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item"
            effect="dark"
            content="点击查看审核日志"
            placement="bottom">
            <img :src="null|checkFilter" />
          </el-tooltip>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">订单号：</div>
            <div class="text">{{orderInfo.code}}</div>
          </div>
          <div class="col">
            <div class="label">创建人：</div>
            <div class="text">{{orderInfo.user_name}}</div>
          </div>
          <div class="col">
            <div class="label">创建时间：</div>
            <div class="text">{{orderInfo.create_time}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">订单公司：</div>
            <div class="text">{{orderInfo.client_name}}</div>
          </div>
          <div class="col">
            <div class="label">联系人：</div>
            <div class="text">{{orderInfo.contacts_name}}</div>
          </div>
          <div class="col">
            <div class="label">负责组/人：</div>
            <div class="text">{{orderInfo.group_name}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">结算单位：</div>
            <div class="text">{{orderInfo.settle_unit}}</div>
          </div>
          <div class="col flex3">
            <div class="label">结算汇率：</div>
            <div class="text">{{orderInfo.settle_tax}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">订单状态：</div>
            <div class="text">{{orderInfo.status}}</div>
          </div>
          <div class="col flex3">
            <div class="label">下单时间：</div>
            <div class="text">{{orderInfo.time_data[0].order_time}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">下单款数：</div>
            <div class="text">{{orderInfo.time_data[0].total_style}}款</div>
          </div>
          <div class="col">
            <div class="label">下单总数：</div>
            <div class="text">{{orderInfo.time_data[0].total_number}}</div>
          </div>
          <div class="col">
            <div class="label">下单总额：</div>
            <div class="text">{{orderInfo.time_data[0].total_price}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">产前样寄送：</div>
            <div class="text"
              :class="orderInfo.time_data[0].is_send===1?'green':'gray'">{{orderInfo.time_data[0].is_send===1?'是':'否'}}</div>
          </div>
          <div class="col">
            <div class="label">产前确认：</div>
            <div class="text"
              :class="orderInfo.time_data[0].is_before_confirm===1?'green':'gray'">{{orderInfo.time_data[0].is_before_confirm?'是':'否'}}</div>
          </div>
          <div class="col">
            <div class="label">是否加急：</div>
            <div class="text"
              :class="orderInfo.time_data[0].is_urgent===1?'green':'gray'">{{orderInfo.time_data[0].is_urgent?'是':'否'}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">相关文件：</div>
            <div class="fileCtn">
              <div class="once"
                v-for="(item,index) in orderInfo.time_data[0].public_files"
                :key="index">
                <div class="fileIcon">
                  <i class="el-icon-platform-eleme"></i>
                </div>
                <div class="name">文件{{index+1}}</div>
                <a class="opr hoverBlue"
                  :href="item">点击下载</a>
              </div>
              <div class="once">
                <div class="fileIcon">
                  <i class="el-icon-platform-eleme"></i>
                </div>
                <div class="name">示例</div>
                <div class="opr">下载不了</div>
              </div>
              <div class="once">
                <div class="fileIcon">
                  <i class="el-icon-picture-outline"></i>
                </div>
                <div class="name">文件名称左边是根据文件后缀给图标类型</div>
                <div class="opr">下载</div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注信息：</div>
            <div class="text"
              :class="orderInfo.desc?'':'gray'">{{orderInfo.desc || '无备注信息'}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { OrderInfo, OrderTime } from '@/types/order'
import { order } from '@/assets/js/api'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  props: {
    data: {
      required: false
    },
    id: {
      type: Number,
      required: false
    }
  },
  data(): {
    orderInfo: OrderDetail
    [propName: string]: any
  } {
    return {
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
      }
    }
  },
  watch: {
    data(newVal: OrderDetail) {
      this.orderInfo = newVal
    }
  },
  mounted() {
    if (this.id) {
      order
        .detail({
          id: Number(this.$route.query.id)
        })
        .then((res) => {
          if (res.data.status) {
            this.orderInfo = res.data.data
          }
        })
    }
  }
})
</script>

<style lang="less" scoped>
@import './orderDetail.less';
</style>