<template>
  <div class="printContainer"
    id="materialPlanPrint"
    v-loading="loading"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <div v-if="isBreak">
      <div class="pmain"
        v-for="item in materialPlanInfo"
        :key="item.material_id">
        <div class="phead clearfix">
          <div class="fl">
            <div class="ptitle">{{company_name}}物料计划单</div>
            <div class="prow">
              <div class="pcol">
                <div class="label">系统计划单编号：</div>
                <div class="info">{{ otherInfo.code }}</div>
              </div>
            </div>
            <div class="prow">
              <div class="pcol">
                <div class="label">计划单创建信息：</div>
                <div class="info">{{ otherInfo.created_at.slice(0, 10) }}{{otherInfo.user_name?'，' + otherInfo.user_name:''}}{{otherInfo.user_phone?'，' + otherInfo.user_phone:''}}</div>
              </div>
            </div>
          </div>
          <div class="fr">
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
                <div class="tcol bgGray headTitle">订单号</div>
                <div class="tcol"
                  style="flex:1.2">{{ otherInfo.order_code || '暂无' }}</div>
                <div class="tcol bgGray headTitle">下单客户</div>
                <div class="tcol">{{ otherInfo.client_name || '暂无' }}</div>
                <div class="tcol bgGray headTitle">下单日期</div>
                <div class="tcol">{{ otherInfo.order_time || '暂无' }}</div>
                <div class="tcol bgGray headTitle"
                  style="flex:0.73">负责人/小组</div>
                <div class="tcol">{{ otherInfo.group_name || '暂无' }}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle"></div>
                <div class="tcol"
                  style="flex:1.2"></div>
                <div class="tcol bgGray headTitle"></div>
                <div class="tcol"></div>
                <div class="tcol bgGray headTitle"></div>
                <div class="tcol"></div>
                <div class="tcol bgGray headTitle"
                  style="flex:0.73"></div>
                <div class="tcol"></div>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="thead bgWhite"
              style="height: auto">
              <div class="trow">
                <div class="tcol bgGray"
                  style="flex:0.3">原料名称</div>
                <div class="tcol"
                  style="flex: 4">
                  {{ item.material_name }}
                </div>
              </div>
              <div class="trow bgGray">
                <div class="tcol"
                  style="flex:0.3">序号</div>
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
                <div class="tcol"
                  style="flex:0.3">{{ indexChild + 1 }}</div>
                <div class="tcol"
                  style="flex: 4">
                  <div class="trow">
                    <div class="tcol"
                      :style="tableLineHeight"
                      style="flex:0.3">{{ itemChild.material_color }}</div>
                    <div class="tcol"
                      :style="tableLineHeight"
                      style="flex:0.3">{{ itemChild.final_number }}{{ itemChild.unit }}</div>
                    <div class="tcol"
                      :style="tableLineHeight"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pbody">
          <div class="tableCtn">
            <div class="thead bgWhite"
              style="height: auto">
              <div class="trow">
                <div class="tcol bgGray"
                  style="flex:0.3">其它备注</div>
                <div class="tcol"
                  style="flex: 4;text-align:left">{{ otherInfo.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="pmain">
        <div class="phead clearfix">
          <div class="fl">
            <div class="ptitle">物料计划单</div>
            <div class="prow">
              <div class="pcol">
                <div class="label">系统计划单编号：</div>
                <div class="info">{{ otherInfo.code }}</div>
              </div>
            </div>
            <div class="prow">
              <div class="pcol">
                <div class="label">计划单创建信息：</div>
                <div class="info">{{ otherInfo.created_at.slice(0, 10) + '，' + otherInfo.user_name + '，' + otherInfo.user_phone }}</div>
              </div>
            </div>
          </div>
          <div class="fr">
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
                <div class="tcol bgGray headTitle">订单号</div>
                <div class="tcol"
                  style="flex:1.2">{{ otherInfo.order_code || '暂无' }}</div>
                <div class="tcol bgGray headTitle">下单客户</div>
                <div class="tcol">{{ otherInfo.client_name || '暂无' }}</div>
                <div class="tcol bgGray headTitle">下单日期</div>
                <div class="tcol">{{ otherInfo.order_time || '暂无' }}</div>
                <div class="tcol bgGray headTitle"
                  style="flex:0.73">负责人/小组</div>
                <div class="tcol">{{ otherInfo.group_name || '暂无' }}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle"></div>
                <div class="tcol"
                  style="flex:1.2"></div>
                <div class="tcol bgGray headTitle"></div>
                <div class="tcol"></div>
                <div class="tcol bgGray headTitle"></div>
                <div class="tcol"></div>
                <div class="tcol bgGray headTitle"
                  style="flex:0.73"></div>
                <div class="tcol"></div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            v-for="item in materialPlanInfo"
            :key="item.material_id">
            <div class="thead bgWhite"
              style="height: auto">
              <div class="trow">
                <div class="tcol bgGray"
                  style="flex:0.3">原料名称</div>
                <div class="tcol"
                  style="flex: 4">
                  {{ item.material_name }}
                </div>
              </div>
              <div class="trow bgGray">
                <div class="tcol"
                  style="flex:0.3">序号</div>
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
                <div class="tcol"
                  style="flex:0.3">{{ indexChild + 1 }}</div>
                <div class="tcol"
                  style="flex: 4">
                  <div class="trow">
                    <div class="tcol"
                      :style="tableLineHeight"
                      style="flex:0.3">{{ itemChild.material_color }}</div>
                    <div class="tcol"
                      :style="tableLineHeight"
                      style="flex:0.3">{{ itemChild.final_number }}{{ itemChild.unit }}</div>
                    <div class="tcol"
                      :style="tableLineHeight"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pbody">
          <div class="tableCtn">
            <div class="thead bgWhite"
              style="height: auto">
              <div class="trow">
                <div class="tcol bgGray"
                  style="flex:0.3">其它备注</div>
                <div class="tcol"
                  style="flex: 4;text-align:left">{{ otherInfo.desc }}</div>
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
      <div class="setting_item"
        @click="windowMethod(3)">设置行高 <el-input-number v-model="lineHeight"
          style="height:32px"
          :precision="1"
          size="small"
          :step="0.1"
          :min="1"
          :max="3"></el-input-number>
      </div>
      <div class="setting_item"
        @click="windowMethod(4)">切换到原料名称{{ isBreak ? '合并' : '拆分' }}页面</div>
      <div class="setting_item"
        @click="windowMethod(1)">刷新页面</div>
      <div class="setting_item"
        @click="windowMethod(2)">打印计划单</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlan } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      isBreak: false,
      loading: true,
      lineHeight: 1,
      showMenu: false,
      qrCodeUrl: '',
      X_position: 0,
      Y_position: 0,
      materialPlanIndex: '0',
      materialPlanInfo: [],
      otherInfo: {
        code: '',
        order_code: '',
        user_name: '',
        user_phone: '',
        created_at: '',
        client_name: '',
        group_name: ''
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
    windowMethod(type: 1 | 2) {
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
        } else if (type === 4) {
          this.isBreak = !this.isBreak
          this.showMenu = false
        }
      })
    }
  },
  mounted() {
    materialPlan
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.otherInfo = res.data.data
        this.materialPlanInfo = this.$mergeData(res.data.data.material_plan_gather_data, {
          mainRule: ['material_name', 'material_id']
        })

        // 生成二维码
        const QRCode = require('qrcode')
        QRCode.toDataURL(`${this.otherInfo.code}`)
          .then((url: any) => {
            this.qrCodeUrl = url
            // console.log(this.qrCodeUrl)
          })
          .catch((err: any) => {
            console.error(err)
          })
        // setTimeout(() => {
        //   window.print()
        // }, 1000)

        this.loading = false
      })
  },
  computed: {
    tableLineHeight(): object {
      let lineHeight = this.lineHeight
      return {
        height: 69 * lineHeight + 'px'
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialPlan/print.less';
</style>