<template>
  <div class="printContainer"
    id="sampleOrderPrint"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <div class="pmain">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">{{ company_name + (orderType===1?'订单':'样单') }}(第{{Number($route.query.sampleOrderIndex)+1}}次打样)</div>
          <div class="prow">
            <div class="pcol wa">
              <div class="label">系统{{orderType===1?'订单':'样单'}}编号：</div>
              <div class="info"
                style="white-space: nowrap;">{{sampleOrderInfo.client_name}}</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol wa">
              <div class="label">{{orderType===1?'订单':'样单'}}创建信息：</div>
              <div class="info"
                style="white-space: nowrap;">{{ sampleOrderInfo.created_at?sampleOrderInfo.created_at.slice(0, 10):'' }}{{sampleOrderInfo.user_name?'，' + sampleOrderInfo.user_name:''}}{{sampleOrderInfo.user_phone?'，' + sampleOrderInfo.user_phone:''}}</div>
            </div>
          </div>
        </div>
        <div class="fr">
          <div class="pImage">
            <img :src="qrCodePCUrl"
              alt="" />
            <span class="imgText">扫一扫打开电脑端系统</span>
          </div>
          <div class="pImage">
            <img :src="qrCodeWXUrl"
              alt="" />
            <span class="imgText">使用织为云工厂小程序扫一扫</span>
          </div>
        </div>
      </div>
      <div class="pbody">
        <div class="tableCtn">
          <div class="tbody hasTop">
            <div class="trow">
              <div class="tcol bgGray">{{orderType===1?'订单':'样单'}}号</div>
              <div class="tcol">{{sampleOrderInfo.code || '无'}}</div>
              <div class="tcol bgGray">{{orderType===1?'':'样单类型'}}</div>
              <div class="tcol">{{orderType===1?'':sampleOrderInfo.time_data[$route.query.sampleOrderIndex].order_type}}</div>
              <div class="tcol bgGray">下单日期</div>
              <div class="tcol">{{sampleOrderInfo.time_data[$route.query.sampleOrderIndex].order_time}}</div>
              <div class="tcol bgGray">完成日期</div>
              <div class="tcol">{{sampleOrderInfo.time_data[$route.query.sampleOrderIndex].complete_time}}</div>
            </div>
            <div class="trow">
              <div class="tcol bgGray">客户名称</div>
              <div class="tcol">{{sampleOrderInfo.client_name}}</div>
              <div class="tcol bgGray">客户联系人</div>
              <div class="tcol">{{sampleOrderInfo.contacts_name}}</div>
              <div class="tcol bgGray">负责人/组</div>
              <div class="tcol">{{sampleOrderInfo.group_name}}</div>
              <div class="tcol bgGray">{{orderType===1?'':'打样次数'}}</div>
              <div class="tcol">{{orderType===1?'':'第'+(Number($route.query.sampleOrderIndex)+1)+'次'}}</div>
            </div>
            <div class="trow">
              <div class="tcol bgGray">{{orderType===1?'产品':'样品'}}编号</div>
              <div class="tcol">{{sampleInfo.product_code||sampleInfo.system_code}}</div>
              <div class="tcol bgGray">客户款号</div>
              <div class="tcol">{{sampleInfo.style_code || '无'}}</div>
              <div class="tcol bgGray">{{orderType===1?'产品':'样品'}}名称</div>
              <div class="tcol">{{sampleInfo.name||'无'}}</div>
              <div class="tcol bgGray">{{orderType===1?'产品':'样品'}}品类</div>
              <div class="tcol">{{sampleInfo.category}}/{{sampleInfo.secondary_category}}</div>
            </div>
          </div>
        </div>
        <div class="tableCtn">
          <div class="tbody hasTop">
            <div class="trow">
              <div class="tcol bgGray label">部位</div>
              <div class="tcol label">大身</div>
              <div class="tcol bgGray label">成份比例</div>
              <div class="tcol"
                style="flex-direction: row;justify-content: start;align-items: center;">
                <span style="margin-right:12px"
                  v-for="item in sampleInfo.component_data"
                  :key="item.id">{{item.name}}{{item.number}}%</span>
              </div>
            </div>
            <div class="trow">
              <div class="tcol bgGray label">尺码</div>
              <div class="tcol bgGray label">配色组</div>
              <div class="tcol bgGray label">克重</div>
              <div class="tcol bgGray">尺寸描述</div>
              <div class="tcol bgGray label">打样数量</div>
              <div class="tcol bgGray label">送样/留底数量</div>
            </div>
            <div class="trow"
              v-for="item in sampleOrderInfo.time_data[$route.query.sampleOrderIndex].batch_data[0].product_data[sampleIndex].product_info"
              :key="item.id">
              <div class="tcol label">{{item.size_name}}</div>
              <div class="tcol label">{{item.color_name}}</div>
              <div class="tcol label">{{findSize(sampleInfo.size_data,item.size_name,'weight')}}</div>
              <div class="tcol">{{findSize(sampleInfo.size_data,item.size_name,'size_info')}}</div>
              <div class="tcol label">{{item.number}}</div>
              <div class="tcol label">{{item.sample_number||0}}/{{item.keep_number||0}}</div>
            </div>
          </div>
        </div>
        <div class="tableCtn"
          v-for="itemPart in sampleInfo.part_data"
          :key="itemPart.id">
          <div class="tbody hasTop">
            <div class="trow">
              <div class="tcol bgGray label">部位</div>
              <div class="tcol">{{itemPart.name}}</div>
              <div class="tcol bgGray label">成份比例</div>
              <div class="tcol"
                style="flex-direction: row;justify-content: start;align-items: center;">
                <span style="margin-right:12px"
                  v-for="item in itemPart.part_component_data"
                  :key="item.id">{{item.name}}{{item.number}}%</span>
              </div>
            </div>
            <div class="trow">
              <div class="tcol bgGray label">尺码</div>
              <div class="tcol bgGray label">配色组</div>
              <div class="tcol bgGray label">克重</div>
              <div class="tcol bgGray">尺寸描述</div>
              <div class="tcol bgGray label">打样数量</div>
            </div>
            <div class="trow"
              v-for="item in sampleOrderInfo.time_data[$route.query.sampleOrderIndex].batch_data[0].product_data[sampleIndex].product_info"
              :key="item.id">
              <div class="tcol label">{{item.size_name}}</div>
              <div class="tcol label">{{item.color_name}}</div>
              <div class="tcol label">{{findSize(itemPart.part_size_data,item.size_name,'weight')}}</div>
              <div class="tcol">{{findSize(itemPart.part_size_data,item.size_name,'size_info')}}</div>
              <div class="tcol label">/</div>
            </div>
          </div>
        </div>
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">描述信息</div>
              <div class="tcol">修改意见</div>
              <div class="tcol"
                v-for="(item,index) in sampleInfo.image_data"
                :key="index">
                图片{{index+1}}
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              style="min-height:120px">
              <div class="tcol"
                v-html="sampleInfo.desc"></div>
              <div class="tcol"></div>
              <div class="tcol"
                v-for="(item,index) in sampleInfo.image_data"
                :key="index">
                <div class="imageCtn"><img :src="item" /></div>
              </div>
            </div>
          </div>
        </div>
        <div class="tableCtn">
          <div class="tbody hasTop">
            <div class="trow">
              <div class="tcol bgGray label">其他说明</div>
              <div class="tcol"
                v-html="sampleOrderInfo.desc"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showPrintSettingFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">选择{{orderType===1?'产品':'样品'}}</span>
          <span class="el-icon-close"
            @click="showPrintSettingFlag = false"></span>
        </div>
        <div class="contentCtn"
          style="padding:20px">
          <el-radio v-model="sampleIndex"
            :label="index"
            v-for="(item,index) in sampleInfoList"
            :key="index">{{item.name||item.product_code||item.system_code}}</el-radio>
        </div>
      </div>
    </div>
    <div class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop>
      <div class="setting_item"
        @click="windowMethod(1)">刷新</div>
      <div class="setting_item"
        @click="windowMethod(2)">打印</div>
      <div class="setting_item"
        @click="windowMethod(3)"
        v-if="sampleInfoList.length>1">选择打印{{orderType===1?'产品':'样品'}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { sampleOrder, order } from '@/assets/js/api'
import { SampleOrderInfo, SampleOrderTime } from '@/types/sampleOrder'
export default Vue.extend({
  data(): {
    sampleOrderInfo: SampleOrderInfo
    [propName: string]: any
  } {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodePCUrl: '',
      qrCodeWXUrl: '',
      showMenu: false,
      X_position: 0,
      Y_position: 0,
      orderType: Number(this.$route.query.orderType),
      showPrintSettingFlag: false,
      sampleOrderInfo: {
        id: null,
        client_id: '',
        tree_data: [],
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '', // 订单用无用字段
        settle_unit: '', // 订单用无用字段
        order_type: 2,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: '',
            order_type_id: '',
            order_type: '',
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
                    image_data: [],
                    product_id: '',
                    size_color_list: [], // 用于下拉框选择尺码颜色
                    product_info: [
                      {
                        sample_number: '',
                        keep_number: '',
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
      sampleIndex: 0,
      sampleInfoList: [],
      sampleInfo: {
        image_data: [],
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
    }
  },
  watch: {
    sampleIndex(val) {
      this.sampleInfo = this.sampleInfoList[val]
    }
  },
  methods: {
    handleClickRight(e: any, type = true) {
      this.showMenu = type
      this.X_position = e.clientX
      this.Y_position = e.clientY
      e.preventDefault()
      e.stopPropagation()
    },
    windowMethod(type: 1 | 2) {
      let _this = this
      this.showMenu = false
      this.showPrintSettingFlag = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          window.print()
        } else {
          _this.showPrintSettingFlag = true
        }
      })
    },
    findSize(sizeArr: any[], sizeName: string, key: string) {
      if (sizeArr) {
        return sizeArr.find((item) => item.name === sizeName) ? sizeArr.find((item) => item.name === sizeName)[key] : ''
      } else {
        return ''
      }
    }
  },
  mounted() {
    sampleOrder
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.sampleOrderInfo = res.data.data
          this.sampleInfoList = (this.sampleOrderInfo.time_data as SampleOrderTime[])[
            Number(this.$route.query.sampleOrderIndex)
          ].batch_data[0].product_data
          this.sampleInfo = this.sampleInfoList[this.sampleIndex] // 默认第一个
          if (this.sampleInfoList.length > 1) {
            this.$message.warning('可通过右键菜单选择其他样品进行打印')
          }
          const QRCode = require('qrcode')
          QRCode.toDataURL(
            this.orderType === 1
              ? `/order/detail?id=${this.sampleOrderInfo.id}`
              : `/sampleOrder/detail?id=${this.sampleOrderInfo.id}`
          )
            .then((url: any) => {
              this.qrCodePCUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
          QRCode.toDataURL(
            this.orderType === 1
              ? `/pages/orderDetail/orderDetail?id=${this.sampleOrderInfo.id}`
              : `/pages/sampleOrderDetail/sampleOrderDetail?id=${this.sampleOrderInfo.id}`
          )
            .then((url: any) => {
              this.qrCodeWXUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/sampleOrder/print.less';
</style>