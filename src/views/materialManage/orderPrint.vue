<template>
  <div class="printContainer"
    id="materialManageOrderPrint"
    v-loading="loading"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <template v-if="!isBreak">
      <div class="pmain">
        <div class="phead clearfix">
          <div class="fl">
            <div class="ptitle">{{title?title:company_name+'物料采购单'}}</div>
            <div class="prow">
              <div class="pcol">
                <div class="label">系统采购单编号：</div>
                <div class="info">{{ materialOrderInfo.code }}</div>
              </div>
            </div>
            <div class="prow">
              <div class="pcol">
                <div class="label">采购单创建信息：</div>
                <div class="info">{{ materialOrderInfo.created_at.slice(0, 10) }}{{materialOrderInfo.user_name?'，' + materialOrderInfo.user_name:''}}{{materialOrderInfo.user_phone?'，' + materialOrderInfo.user_phone:''}}</div>
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
                <div class="tcol bgGray headTitle">采购单号</div>
                <div class="tcol">{{materialOrderInfo.code || '暂无' }}</div>
                <div class="tcol bgGray headTitle">订单号</div>
                <div class="tcol">{{materialOrderInfo.time_code || materialOrderInfo.order_code || '暂无' }}</div>
                <div class="tcol bgGray headTitle">联系人</div>
                <div class="tcol">{{materialOrderInfo.contacts_name}}</div>
                <div class="tcol bgGray headTitle">联系电话</div>
                <div class="tcol">{{materialOrderInfo.contacts_phone}}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">计划单号</div>
                <div class="tcol">{{materialOrderInfo.plan_code || '暂无' }}</div>
                <div class="tcol bgGray headTitle">下单日期</div>
                <div class="tcol">{{ materialOrderInfo.order_time || '暂无' }}</div>
                <div class="tcol bgGray headTitle">交货日期</div>
                <div class="tcol">{{ materialOrderInfo.delivery_time || '暂无' }}</div>
                <div class="tcol bgGray headTitle">采购单位</div>
                <div class="tcol">{{ materialOrderInfo.client_name || '暂无' }}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">订购总数</div>
                <div class="tcol">{{materialOrderInfo.total_number}}</div>
                <div class="tcol bgGray headTitle">订购总额</div>
                <div class="tcol">{{materialOrderInfo.total_price}}元</div>
                <div class="tcol bgGray headTitle">备注信息</div>
                <div class="tcol"
                  style="min-width: 347px;">{{materialOrderInfo.desc}}</div>
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
                <div class="tcol bgGray label">合计数量</div>
                <div class="tcol"
                  style="flex:2">
                  {{ $toFixed(item.childrenMergeInfo.reduce((total,cur)=>total+Number(cur.number),0))}}{{item.childrenMergeInfo[0].unit}}
                </div>
                <div class="tcol bgGray label">合计价格</div>
                <div class="tcol"
                  style="flex:2">
                  {{ $toFixed(item.childrenMergeInfo.reduce((total,cur)=>total+(Number(cur.number)*Number(cur.price)),0))}}元
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
                    <div class="tcol"
                      style="flex:0.3">单价</div>
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
                      :style="tableLineHeight"
                      style="flex:0.3">
                      <template v-if="!editFlag">
                        {{ itemChild.price }}元
                      </template>
                      <template v-else>
                        <div class="elCtn">
                          <el-input v-model="itemChild.price"
                            placeholder="输入单价">
                            <template slot="append">元</template>
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
                <div class="tcol bgGray"
                  style="flex:0.3">注意事项</div>
                <div class="tcol"
                  style="flex: 4;text-align:left;display:block">
                  <div style="line-height:22px"
                    v-for="item,index in descArr"
                    :key="index">{{item?(index+1)+'.':''}}{{item}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="pmain"
        v-for="(item,index) in materialInfo"
        :key="item.material_id">
        <div class="phead clearfix">
          <div class="fl">
            <div class="ptitle">{{title?title:company_name+'物料采购单'}}</div>
            <div class="prow">
              <div class="pcol">
                <div class="label">系统采购单编号：</div>
                <div class="info">{{ materialOrderInfo.code }}</div>
              </div>
            </div>
            <div class="prow">
              <div class="pcol">
                <div class="label">采购单创建信息：</div>
                <div class="info">{{ materialOrderInfo.created_at.slice(0, 10) }}{{materialOrderInfo.user_name?'，' + materialOrderInfo.user_name:''}}{{materialOrderInfo.user_phone?'，' + materialOrderInfo.user_phone:''}}</div>
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
                <div class="tcol bgGray headTitle">采购单号</div>
                <div class="tcol">{{materialOrderInfo.code || '暂无' }}</div>
                <div class="tcol bgGray headTitle">订单号</div>
                <div class="tcol">{{materialOrderInfo.time_code || materialOrderInfo.order_code || '暂无' }}</div>
                <div class="tcol bgGray headTitle">联系人</div>
                <div class="tcol">{{materialOrderInfo.contacts_name}}</div>
                <div class="tcol bgGray headTitle">联系电话</div>
                <div class="tcol">{{materialOrderInfo.contacts_phone}}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">计划单号</div>
                <div class="tcol">{{materialOrderInfo.plan_code || '暂无' }}</div>
                <div class="tcol bgGray headTitle">下单日期</div>
                <div class="tcol">{{ materialOrderInfo.order_time || '暂无' }}</div>
                <div class="tcol bgGray headTitle">交货日期</div>
                <div class="tcol">{{ materialOrderInfo.delivery_time || '暂无' }}</div>
                <div class="tcol bgGray headTitle">采购单位</div>
                <div class="tcol">{{ materialOrderInfo.client_name || '暂无' }}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">订购总数</div>
                <div class="tcol">{{materialOrderInfo.total_number}}</div>
                <div class="tcol bgGray headTitle">订购总额</div>
                <div class="tcol">{{materialOrderInfo.total_price}}元</div>
                <div class="tcol bgGray headTitle">备注信息</div>
                <div class="tcol"
                  style="min-width: 347px;">{{materialOrderInfo.desc}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="thead bgWhite"
              style="height: auto">
              <div class="trow">
                <div class="tcol bgGray label">原料名称</div>
                <div class="tcol"
                  style="flex: 4">
                  {{ item.material_name }}
                </div>
                <div class="tcol bgGray label">合计数量</div>
                <div class="tcol"
                  style="flex:2">
                  {{ $toFixed(item.childrenMergeInfo.reduce((total,cur)=>total+Number(cur.number),0))}}{{item.childrenMergeInfo[0].unit}}
                </div>
                <div class="tcol bgGray label">合计价格</div>
                <div class="tcol"
                  style="flex:2">
                  {{ $toFixed(item.childrenMergeInfo.reduce((total,cur)=>total+(Number(cur.number)*Number(cur.price)),0))}}元
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
                    <div class="tcol"
                      style="flex:0.3">单价</div>
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
                      :style="tableLineHeight"
                      style="flex:0.3">
                      <template v-if="!editFlag">
                        {{ itemChild.price }}元
                      </template>
                      <template v-else>
                        <div class="elCtn">
                          <el-input v-model="itemChild.price"
                            placeholder="输入单价">
                            <template slot="append">元</template>
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
                <div class="tcol bgGray"
                  style="flex:0.3">注意事项</div>
                <div class="tcol"
                  style="flex: 4;text-align:left;display:block">
                  <div style="line-height:22px"
                    v-for="item,index in descArr"
                    :key="index">{{item?(index+1)+'.':''}}{{item}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
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
          <div class="row"
            v-for="(item,index) in descArr"
            :key="index">
            <span class="label">注意事项{{index+1}}：</span>
            <div class="info">
              <el-input v-model="descArr[index]"
                placeholder="请输入注意事项">
              </el-input>
              <div v-if="index===0"
                class="info_btn hoverBlue"
                @click="$addItem(descArr,'')">添加</div>
              <div v-if="index>0"
                class="info_btn hoverRed"
                @click="$deleteItem(descArr,index)">删除</div>
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
    <div class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop>
      <div class="setting_item"
        @click="windowMethod(2)">打印订购单</div>
      <div class="setting_item">设置行高 <el-input-number v-model="lineHeight"
          style="height:32px"
          :precision="1"
          size="small"
          :step="0.1"
          :min="0.7"
          :max="2"></el-input-number>
      </div>
      <div class="setting_item"
        @click="windowMethod(4)">切换到原料名称{{ isBreak ? '合并' : '拆分' }}页面</div>
      <div class="setting_item"
        @click="windowMethod(1)">刷新页面</div>
      <div class="setting_item"
        @click="windowMethod(3)">{{editFlag?'完成编辑':'编辑模式'}}</div>
      <div class="setting_item"
        @click="windowMethod(5)">标题备注设置</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialOrder } from '@/assets/js/api'
import { MaterialOrderInfo } from '@/types/materialOrder'
export default Vue.extend({
  data(): {
    materialOrderInfo: MaterialOrderInfo
    [propName: string]: any
  } {
    return {
      loading: false,
      showMenu: false,
      X_position: 0,
      Y_position: 0,
      isBreak: false,
      company_name: window.sessionStorage.getItem('company_name'),
      title: '',
      lineHeight: 1,
      editFlag: false,
      materialOrderInfo: {
        created_at: '',
        material_type: 1,
        order_id: '',
        plan_id: '',
        client_id: '',
        client_id_arr: [],
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        total_number: 0,
        total_price: 0,
        others_fee_data: [
          {
            desc: '', // 额外费用备注
            name: '',
            price: ''
          }
        ],
        desc: '',
        info_data: [
          {
            material_id: '',
            material_name: '',
            material_color: '',
            attribute: '',
            price: '',
            number: '',
            unit: 'kg'
          }
        ]
      },
      materialInfo: [],
      qrCodeUrl: '',
      settingFlag: false,
      descArr: []
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
        } else if (type === 3) {
          this.editFlag = !this.editFlag
          this.showMenu = false
        } else if (type === 4) {
          this.isBreak = !this.isBreak
          this.showMenu = false
        } else if (type === 5) {
          this.settingFlag = true
          this.showMenu = false
        }
      })
    },
    saveSetting() {
      this.$setLocalStorage('materialOrderPrintTitle', this.title)
      this.$setLocalStorage('materialOrderPrintDesc', JSON.stringify(this.descArr))
      this.$message.success('保存成功')
      this.settingFlag = false
    },
    resetSetting() {
      this.$setLocalStorage('materialOrderPrintTitle', '')
      this.$setLocalStorage('materialOrderPrintDesc', JSON.stringify(['']))
      this.title = ''
      this.descArr = ['']
      this.$message.success('已清空')
      this.settingFlag = false
    }
  },
  mounted() {
    this.title = this.$getLocalStorage('materialPlanPrintTitle') || ''
    this.descArr = this.$getLocalStorage('materialPlanPrintDesc')
      ? JSON.parse(this.$getLocalStorage('materialPlanPrintDesc'))
      : ['']
    materialOrder
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.materialOrderInfo = res.data.data
          this.materialInfo = this.$mergeData(this.materialOrderInfo.info_data, {
            mainRule: ['material_name', 'material_id']
          })
          // 生成二维码
          const QRCode = require('qrcode')
          QRCode.toDataURL('/materialManage/detail?id=' + `${this.materialOrderInfo.order_id}` + '&ifprint=true')
            .then((url: any) => {
              this.qrCodeUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
          this.windowMethod(2)
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialManage/orderPrint.less';
</style>