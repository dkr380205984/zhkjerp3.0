<template>
  <div class="printContainer"
    id="supPrint"
    @click.left="showMenu = false"
    @click.right="handleClickRight">
    <div class="pmain">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">{{title?title: company_name + '补纱单'}}</div>
          <div class="prow">
            <div class="pcol">
              <div class="label">系统编号：</div>
              <div class="info"
                style="white-space: nowrap;">{{materialSupplementInfo.code}}</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol">
              <div class="label">创建信息：</div>
              <div class="info"
                style="white-space: nowrap;">{{ materialSupplementInfo.created_at?materialSupplementInfo.created_at.slice(0, 10):'' }}{{materialSupplementInfo.user_name?'，' + materialSupplementInfo.user_name:''}}{{materialSupplementInfo.user_phone?'，' + materialSupplementInfo.user_phone:''}}</div>
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
              <div class="tcol">{{materialSupplementInfo.time_code || materialSupplementInfo.order_code}}</div>
              <div class="tcol bgGray headTitle">补纱单号</div>
              <div class="tcol">{{materialSupplementInfo.code}}</div>
              <div class="tcol bgGray headTitle">补纱单位</div>
              <div class="tcol">{{materialSupplementInfo.client_name}}</div>
            </div>
            <div class="trow"
              v-for="(item,index) in materialSupplementInfo.client_data"
              :key="index">
              <div class="tcol bgGray headTitle">承担单位</div>
              <div class="tcol">{{item.bear_client_name}}</div>
              <div class="tcol bgGray headTitle">承担金额</div>
              <div class="tcol">{{item.bear_price}}元</div>
              <div class="tcol bgGray headTitle">联系电话</div>
              <div class="tcol">{{materialSupplementInfo.contacts_phone}}</div>
            </div>
          </div>
        </div>
        <div class="tableCtn"
          v-for="(item,index) in materialInfo"
          :key="item.material_id">
          <div class="thead bgWhite"
            style="height: auto">
            <div class="trow">
              <div class="tcol bgGray label">原料名称</div>
              <div class="tcol"
                style="flex: 4">
                {{ item.material_name }}
              </div>
              <div class="tcol bgGray label">合计值</div>
              <div class="tcol"
                style="flex:2">
                {{$toFixed(item.childrenMergeInfo.reduce((total,cur)=>total+Number(cur.number),0))}}{{item.childrenMergeInfo[0].unit}}
              </div>
            </div>
            <div class="trow bgGray">
              <div class="tcol label">序号</div>
              <div class="tcol"
                style="flex: 4">
                <div class="trow">
                  <div class="tcol"
                    style="flex:0.3">颜色</div>
                  <div class="tcol"
                    style="flex:0.3">数量</div>
                  <div class="tcol">原样颜色</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              :style="tableLineHeight"
              v-for="(itemChild, indexChild) in item.childrenMergeInfo"
              :key="indexChild">
              <div class="tcol label">{{ indexChild + 1 }}</div>
              <div class="tcol"
                style="flex: 4">
                <div class="trow">
                  <div class="tcol"
                    :style="tableLineHeight"
                    style="flex:0.3">{{ itemChild.material_color }}</div>
                  <div class="tcol"
                    :style="tableLineHeight"
                    style="flex:0.3">
                    <template v-if="!editFlag">
                      {{ itemChild.number }}{{ itemChild.unit }}
                    </template>
                    <template v-else>
                      <div class="elCtn">
                        <el-input v-model="itemChild.number"
                          placeholder="输入数量">
                          <template slot="append">{{itemChild.unit}}</template>
                        </el-input>
                      </div>
                    </template>
                  </div>
                  <div class="tcol"
                    :style="tableLineHeight">
                    <div class="deleteIcon hoverRed"
                      v-show="editFlag"
                      @click="item.childrenMergeInfo.length>1?$deleteItem(item.childrenMergeInfo,indexChild):$deleteItem(materialPlanInfo,index)">删除本行</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tableCtn">
          <div class="thead bgWhite"
            style="height: auto">
            <div class="trow">
              <div class="tcol bgGray label">补纱原因</div>
              <div class="tcol"
                style="flex: 4">
                {{materialSupplementInfo.desc}}
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
      <div class="setting_item">设置行高 <el-input-number v-model="lineHeight"
          style="height:32px"
          :precision="1"
          size="small"
          :step="0.1"
          :min="0.7"
          :max="2"></el-input-number>
      </div>
      <div class="setting_item"
        @click="windowMethod(1)">刷新页面</div>
    </div>
  </div>
</template>

<script lang="ts">
import { materialSupplement } from '@/assets/js/api'
import { MaterialSupplementInfo } from '@/types/materialSupplement'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    materialSupplementInfo: MaterialSupplementInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      showMenu: false,
      lineHeight: 1,
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodePCUrl: '',
      qrCodeWXUrl: '',
      settingFlag: false,
      title: '',
      materialInfo: [],
      materialSupplementInfo: {
        order_id: '',
        rel_doc_id: '',
        client_id: '',
        client_name: '',
        client_data: [
          {
            bear_client_id: '',
            bear_price: ''
          }
        ],
        desc: '',
        info_data: [
          {
            id: '',
            tree_data: '',
            material_id: '',
            material_color: '',
            material_type: 1,
            number: '',
            unit: ''
          }
        ]
      },
      editFlag: false,
      descArr: [''] // 注意事项
    }
  },
  computed: {
    tableLineHeight(): object {
      let lineHeight = this.lineHeight
      return {
        height: 69 * lineHeight + 'px'
      }
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
    materialSupplement
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.materialSupplementInfo = res.data.data
          this.materialInfo = this.$mergeData(this.materialSupplementInfo.info_data, {
            mainRule: ['material_name', 'material_id']
          })
          const QRCode = require('qrcode')
          QRCode.toDataURL(`/materialManage/detail?id=${this.materialSupplementInfo.id}&supFlag=true`)
            .then((url: any) => {
              this.qrCodePCUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
          QRCode.toDataURL(
            `/pages/billingManagement/rawMaterialSupplement/rawMaterialSupplementDetail?id=${this.materialSupplementInfo.id}`
          )
            .then((url: any) => {
              this.qrCodeWXUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
          this.windowMethod(2)
        }
        this.loading = false
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialManage/supPrint.less';
</style>