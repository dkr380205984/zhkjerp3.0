<template>
  <div class="printContainer"
    id="packPrintOrder">
    <div class="printContainer"
      @click="showMenu = false"
      @click.right="handleClickRight">
      <div class="pmain crosswise">
        <div class="phead clearfix">
          <div class="fl">
            <div class="ptitle">{{title?title: company_name + '包装订购单'}}</div>
            <div class="prow">
              <div class="pcol wa">
                <div class="label">系统编号：</div>
                <div class="info"
                  style="white-space: nowrap;">{{packOrderInfo.code}}</div>
              </div>
            </div>
            <div class="prow">
              <div class="pcol wa"
                style="width:auto">
                <div class="label">创建信息：</div>
                <div class="info"
                  style="white-space: nowrap;">{{ packOrderInfo.created_at?packOrderInfo.created_at.slice(0, 10):'' }}{{packOrderInfo.user_name?'，' + packOrderInfo.user_name:''}}{{packOrderInfo.user_phone?'，' + packOrderInfo.user_phone:''}}</div>
              </div>
            </div>
          </div>
          <div class="fr">
            <!-- <div class="remark">打开微信扫一扫 更新每日生产进度</div> -->
            <div class="pImage">
              <img :src="qrCodeUrl"
                width="100%"
                alt="" />
            </div>
          </div>
        </div>
        <div class="pbody">
          <div class="tableCtn">
            <div class="tbody hasTop">
              <div class="trow">
                <div class="tcol bgGray headTitle">单据编号</div>
                <div class="tcol">{{packOrderInfo.code}}</div>
                <div class="tcol bgGray headTitle">订购总额</div>
                <div class="tcol">{{packOrderInfo.total_price}}元</div>
                <div class="tcol bgGray headTitle">订购日期</div>
                <div class="tcol">{{packOrderInfo.order_time}}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">订购单位</div>
                <div class="tcol">{{packOrderInfo.client_name}}/{{packOrderInfo.contacts_phone}}</div>
                <div class="tcol bgGray headTitle">订购总数</div>
                <div class="tcol">{{packOrderInfo.total_number}}</div>
                <div class="tcol bgGray headTitle">交货日期</div>
                <div class="tcol">{{packOrderInfo.delivery_time}}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle"
                  style="max-width:142.5px">备注信息</div>
                <div class="tcol">{{packOrderInfo.desc}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">包装名称</div>
                <div class="tcol">包装规格</div>
                <div class="tcol">面积单价</div>
                <div class="tcol">数量单价</div>
                <div class="tcol">订购数量</div>
                <div class="tcol">备注信息</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemChild,indexChild) in packOrderInfo.info_data"
                :key="indexChild">
                <div class="tcol">{{itemChild.pack_material_name}}</div>
                <div class="tcol">
                  <template v-if="Number(itemChild.price_type)===1">
                    {{itemChild.length}}*{{itemChild.width}}*{{itemChild.height}}cm
                  </template>
                  <template v-else-if="Number(itemChild.price_type)===2">
                    {{itemChild.length}}*{{itemChild.width}}cm + {{itemChild.height}}cm
                  </template>
                  <template v-else-if="Number(itemChild.price_type)===3">
                    {{itemChild.length}}
                  </template>
                </div>
                <div class="tcol">{{itemChild.bulk_price?(itemChild.bulk_price +'元'):'-'}}</div>
                <div class="tcol">{{itemChild.count_price?(itemChild.count_price +'元'):'-'}}</div>
                <div class="tcol">{{itemChild.number}}</div>
                <div class="tcol">{{itemChild.desc}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setting_sign_style"
        v-if="showMenu"
        :style="`left:${X_position || 0}px;top:${Y_position}px`"
        @click.stop>
        <div class="setting_item"
          @click="windowMethod(1)">刷新页面</div>
        <div class="setting_item"
          @click="windowMethod(2)">打印</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PackOrderInfo } from '@/types/packManage'
import Vue from 'vue'
import { packManage } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    packOrderInfo: PackOrderInfo
    [propName: string]: any
  } {
    return {
      packOrderInfo: {
        order_id: '',
        client_id: '',
        tree_data: [],
        client_name: '',
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        desc: '',
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
            file_url: '',
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
      },
      loading: true,
      showMenu: false,
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodeUrl: '',
      settingFlag: false,
      title: '',
      descArr: [''] // 注意事项
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
    windowMethod(type: number) {
      this.showPrintSetting = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          this.showMenu = false
          setTimeout(() => {
            window.print()
          }, 100)
        }
      })
    }
  },
  mounted() {
    packManage
      .orderListDetail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.packOrderInfo = res.data.data
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/packManage/printOrder.less';
</style>