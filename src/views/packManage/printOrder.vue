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
                <div class="label">单据编号：</div>
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
                <div class="tcol bgGray headTitle">关联订单号</div>
                <div class="tcol">{{packOrderInfo.order_code}}</div>
                <div class="tcol bgGray headTitle">订购总额</div>
                <div class="tcol">{{$toFixed(packOrderInfo.total_price,3,true)}}元</div>
                <div class="tcol bgGray headTitle">订购日期</div>
                <div class="tcol">{{packOrderInfo.order_time}}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">订购单位</div>
                <div class="tcol">{{packOrderInfo.client_name}}/{{packOrderInfo.contacts_phone}}</div>
                <div class="tcol bgGray headTitle">订购总数</div>
                <div class="tcol">{{$toFixed(packOrderInfo.total_number,0,true)}}</div>
                <div class="tcol bgGray headTitle">交货日期</div>
                <div class="tcol">{{packOrderInfo.delivery_time}}</div>
              </div>
              <div class="trow"
                v-for="(item,index) in packOrderInfo.others_fee_data"
                :key="index">
                <div class="tcol bgGray headTitle">额外费用名称</div>
                <div class="tcol">
                  {{item.name}}
                </div>
                <div class="tcol bgGray headTitle">额外费用金额</div>
                <div class="tcol">
                  {{item.price}}元
                </div>
                <div class="tcol bgGray headTitle">额外费用备注</div>
                <div class="tcol">
                  {{item.desc}}
                </div>
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
                <div class="tcol">{{itemChild.bulk_price?($toFixed(itemChild.bulk_price,3,true) +'元'):'-'}}</div>
                <div class="tcol">{{itemChild.count_price?($toFixed(itemChild.count_price,3,true) +'元'):'-'}}</div>
                <div class="tcol">{{$toFixed(itemChild.number,0,true)}}</div>
                <div class="tcol">{{itemChild.desc}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="thead bgWhite"
              style="height: auto">
              <div class="trow">
                <div class="tcol bgGray"
                  style="flex:0.3">注意事项</div>
                <div class="tcol"
                  style="flex: 4;text-align:left;display:block">
                  <div v-html="descArr.desc"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setting_sign_style"
        v-if="showMenu"
        :style="`left:${X_position || 0}px;top:${Y_position}px`"
        @click.stop>
        <div class="setting_item hoverBlue"
          @click="windowMethod(2)">打印</div>
        <div class="setting_item"
          @click="windowMethod(1)">刷新页面</div>
        <div class="setting_item"
          @click="windowMethod(3)">标题备注设置</div>
      </div>
      <div class="popup"
        v-show="settingFlag">
        <div class="main">
          <div class="titleCtn">
            <span class="text">打印设置</span>
            <span class="el-icon-close"
              @click="settingFlag = false"></span>
          </div>
          <div class="contentCtn">
            <div class="row">
              <span class="label">设置标题：</span>
              <div class="info">
                <el-input v-model="title"
                  placeholder="请输入常用标题"></el-input>
              </div>
            </div>
            <div class="row">
              <span class="label">注意事项：</span>
              <div class="info">
                <div id='editorPackOrder'
                  style="z-index: 0;position: relative;">
                </div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <span class="btn borderBtn"
              @click="settingFlag = false">取消</span>
            <span class="btn backHoverOrange"
              @click="resetSetting">清空设置</span>
            <span class="btn backHoverBlue"
              @click="saveSetting">保存</span>
          </div>
        </div>
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
      qrCodePCUrl: '',
      qrCodeWXUrl: '',
      settingFlag: false,
      title: '',
      descArr: {
        desc: '',
        editor: ''
      } // 注意事项
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
        } else if (type === 3) {
          this.settingFlag = true
          this.showMenu = false
        }
      })
    },
    saveSetting() {
      const realSave = {
        editor: '',
        desc: this.descArr.desc
      }
      this.$setLocalStorage('packOrderPrintTitle', this.title)
      this.$setLocalStorage('packOrderPrintDesc', JSON.stringify(realSave))
      this.$message.success('保存成功')
      this.settingFlag = false
    },
    resetSetting() {
      this.$setLocalStorage('packOrderPrintTitle', '')
      this.$setLocalStorage(
        'packOrderPrintDesc',
        JSON.stringify({
          desc: '',
          editor: ''
        })
      )
      this.title = ''
      this.descArr = {
        desc: '',
        editor: ''
      }
      this.$message.success('已清空')
      this.settingFlag = false
    }
  },
  mounted() {
    this.title = this.$getLocalStorage('packOrderPrintTitle') || ''
    this.descArr = this.$getLocalStorage('packOrderPrintDesc')
      ? JSON.parse(this.$getLocalStorage('packOrderPrintDesc'))
      : {
          desc: '',
          editor: ''
        }
    packManage
      .orderListDetail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.packOrderInfo = res.data.data
          const QRCode = require('qrcode')
          QRCode.toDataURL(`/packManage/detail?id=${this.packOrderInfo.order_id}`)
            .then((url: any) => {
              this.qrCodePCUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
          QRCode.toDataURL(`/pages/billingManagement/packingOrder/packingOrderDetail?id=${this.packOrderInfo.id}`)
            .then((url: any) => {
              this.qrCodeWXUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
          this.windowMethod(2)
        }
      })
    this.$initEditor(this.descArr, 'PackOrder')
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/packManage/printOrder.less';
</style>