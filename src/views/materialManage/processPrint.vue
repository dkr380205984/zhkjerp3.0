<template>
  <div class="printContainer"
    id="materialManageProcessPrint"
    v-loading="loading"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <template v-if="!isBreak">
      <div class="pmain">
        <div class="phead clearfix">
          <div class="fl">
            <div class="ptitle">{{title?title:company_name+'原料加工单'}}</div>
            <div class="prow">
              <div class="pcol">
                <div class="label">系统采购单编号：</div>
                <div class="info">{{ materialProcessInfo.code }}</div>
              </div>
            </div>
            <div class="prow">
              <div class="pcol">
                <div class="label">采购单创建信息：</div>
                <div class="info">{{ materialProcessInfo.created_at.slice(0, 10) }}{{materialProcessInfo.user_name?'，' + materialProcessInfo.user_name:''}}{{materialProcessInfo.user_phone?'，' + materialProcessInfo.user_phone:''}}</div>
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
                <div class="tcol bgGray headTitle">计划单号</div>
                <div class="tcol">{{materialProcessInfo.plan_code || '暂无' }}</div>
                <div class="tcol bgGray headTitle">加工单号</div>
                <div class="tcol">{{materialProcessInfo.code || '暂无' }}</div>
                <div class="tcol bgGray headTitle">下单日期</div>
                <div class="tcol">{{ materialProcessInfo.order_time || '暂无' }}</div>
                <div class="tcol bgGray headTitle">交货日期</div>
                <div class="tcol">{{ materialProcessInfo.delivery_time || '暂无' }}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">采购单位</div>
                <div class="tcol">{{ materialProcessInfo.client_name || '暂无' }}</div>
                <div class="tcol bgGray headTitle">加工总数</div>
                <div class="tcol">{{$toFixed(materialProcessInfo.total_number,3,true)}}</div>
                <div class="tcol bgGray headTitle">加工总额</div>
                <div class="tcol">{{$toFixed(materialProcessInfo.total_price,3,true)}}元</div>
                <div class="tcol bgGray headTitle">联系电话</div>
                <div class="tcol">{{materialProcessInfo.contacts_phone}}</div>
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
                  {{ $toFixed(item.childrenMergeInfo.reduce((total,cur)=>total+Number(cur.number),0),3,true)}}{{item.childrenMergeInfo[0].unit}}
                </div>
                <div class="tcol bgGray label">合计价格</div>
                <div class="tcol"
                  style="flex:2">
                  {{ $toFixed(item.childrenMergeInfo.reduce((total,cur)=>total+(Number(cur.number)*Number(cur.price)),0),3,true)}}元
                </div>
              </div>
              <div class="trow bgGray">
                <div class="tcol label">序号</div>
                <div class="tcol"
                  style="flex: 4">
                  <div class="trow">
                    <div class="tcol"
                      style="flex:0.3">加工详情</div>
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
                      style="flex:0.3">
                      <div class="tcol">
                        <template v-if="materialProcessInfo.process==='染色'">
                          <div class="changeCtn">
                            <span>白胚</span>
                            <span class="el-icon-right"></span>
                            <span>{{itemChild.after_color}}</span>
                          </div>
                        </template>
                        <template v-if="materialProcessInfo.process==='倒纱'">
                          <span>{{itemChild.before_attribute}}</span>
                          <span class="el-icon-right"></span>
                          <span>{{itemChild.after_attribute}}</span>
                        </template>
                        <template v-if="materialProcessInfo.process==='并线'">
                          <span>{{itemChild.bingxian_desc}}</span>
                        </template>
                        <template v-if="materialProcessInfo.process==='膨纱'">
                          <span>{{itemChild.pengsha_desc}}</span>
                        </template>
                        <template v-if="materialProcessInfo.process==='切割'">
                          <span>{{itemChild.qiege_desc}}</span>
                        </template>
                      </div>
                    </div>
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
              <div class="trow"
                v-for="(item,index) in materialProcessInfo.others_fee_data"
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
    </template>
    <template v-else>
      <div class="pmain"
        v-for="(item,index) in materialInfo"
        :key="item.material_id">
        <div class="phead clearfix">
          <div class="fl">
            <div class="ptitle">{{title?title:company_name+'物料加工单'}}</div>
            <div class="prow">
              <div class="pcol">
                <div class="label">系统采购单编号：</div>
                <div class="info">{{ materialProcessInfo.code }}</div>
              </div>
            </div>
            <div class="prow">
              <div class="pcol">
                <div class="label">采购单创建信息：</div>
                <div class="info">{{ materialProcessInfo.created_at.slice(0, 10) }}{{materialProcessInfo.user_name?'，' + materialProcessInfo.user_name:''}}{{materialProcessInfo.user_phone?'，' + materialProcessInfo.user_phone:''}}</div>
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
                <div class="tcol bgGray headTitle">采购单号</div>
                <div class="tcol">{{materialProcessInfo.code || '暂无' }}</div>
                <div class="tcol bgGray headTitle">采购单位</div>
                <div class="tcol">{{ materialProcessInfo.client_name || '暂无' }}</div>
                <div class="tcol bgGray headTitle">下单日期</div>
                <div class="tcol">{{ materialProcessInfo.order_time || '暂无' }}</div>
                <div class="tcol bgGray headTitle">交货日期</div>
                <div class="tcol">{{ materialProcessInfo.delivery_time || '暂无' }}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">加工总数</div>
                <div class="tcol">{{$toFixed(materialProcessInfo.total_number,3,true)}}</div>
                <div class="tcol bgGray headTitle">加工总额</div>
                <div class="tcol">{{$toFixed(materialProcessInfo.total_price,3,true)}}元</div>
                <div class="tcol bgGray headTitle"></div>
                <div class="tcol"></div>
                <div class="tcol bgGray headTitle"></div>
                <div class="tcol"></div>
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
                  {{ $toFixed(item.childrenMergeInfo.reduce((total,cur)=>total+Number(cur.number),0),3,true)}}{{item.childrenMergeInfo[0].unit}}
                </div>
                <div class="tcol bgGray label">合计价格</div>
                <div class="tcol"
                  style="flex:2">
                  {{ $toFixed(item.childrenMergeInfo.reduce((total,cur)=>total+(Number(cur.number)*Number(cur.price)),0),3,true)}}元
                </div>
              </div>
              <div class="trow bgGray">
                <div class="tcol label">序号</div>
                <div class="tcol"
                  style="flex: 4">
                  <div class="trow">
                    <div class="tcol"
                      style="flex:0.3">加工详情</div>
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
                      style="flex:0.3">
                      <div class="tcol">
                        <template v-if="materialProcessInfo.process==='染色'">
                          <div class="changeCtn">
                            <span>白胚</span>
                            <span class="el-icon-right"></span>
                            <span>{{itemChild.after_color}}</span>
                          </div>
                        </template>
                        <template v-if="materialProcessInfo.process==='倒纱'">
                          <span>{{itemChild.before_attribute}}</span>
                          <span class="el-icon-right"></span>
                          <span>{{itemChild.after_attribute}}</span>
                        </template>
                        <template v-if="materialProcessInfo.process==='并线'">
                          <span>{{itemChild.bingxian_desc}}</span>
                        </template>
                        <template v-if="materialProcessInfo.process==='膨纱'">
                          <span>{{itemChild.pengsha_desc}}</span>
                        </template>
                        <template v-if="materialProcessInfo.process==='切割'">
                          <span>{{itemChild.qiege_desc}}</span>
                        </template>
                      </div>
                    </div>
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
              <div class="trow"
                v-for="(item,index) in materialProcessInfo.others_fee_data"
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
          <div class="row">
            <span class="label">注意事项：</span>
            <div class="info">
              <div id='editorMaterialProcess'
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
    <div class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop>
      <div class="setting_item hoverBlue"
        @click="windowMethod(2)">打印加工单</div>
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
import { materialProcess } from '@/assets/js/api'
import { MaterialProcessInfo } from '@/types/materialProcess'
export default Vue.extend({
  data(): {
    materialProcessInfo: MaterialProcessInfo
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
      materialProcessInfo: {
        total_price: 0,
        total_number: 0,
        created_at: '',
        order_id: '',
        plan_id: '',
        process: '',
        material_order_id: '',
        material_transfer_id: '',
        client_id: '',
        client_id_arr: [],
        order_time: this.$getDate(new Date()),
        delivery_time: '',
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
            material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
            material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
            before_attribute: '', // 原属性
            after_attribute: '',
            after_color: '', // 加工后颜色
            price: '',
            number: '',
            unit: 'kg',
            pengsha_desc: '', // 膨纱要求
            qiege_desc: '', // 切割要求
            bingxian_desc: '' // 并线要求
          }
        ]
      },
      materialInfo: [],
      qrCodePCUrl: '',
      qrCodeWXUrl: '',
      settingFlag: false,
      descArr: {
        desc: '',
        editor: ''
      }
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
      const realSave = {
        editor: '',
        desc: this.descArr.desc
      }
      this.$setLocalStorage('materialProcessPrintTitle', this.title)
      this.$setLocalStorage('materialProcessPrintDesc', JSON.stringify(realSave))
      this.$message.success('保存成功')
      this.settingFlag = false
    },
    resetSetting() {
      this.$setLocalStorage('materialProcessPrintTitle', '')
      this.$setLocalStorage(
        'materialProcessPrintDesc',
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
    this.title = this.$getLocalStorage('materialProcessPrintTitle') || ''
    this.descArr = this.$getLocalStorage('materialProcessPrintDesc')
      ? JSON.parse(this.$getLocalStorage('materialProcessPrintDesc'))
      : {
          desc: '',
          editor: ''
        }
    materialProcess
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.materialProcessInfo = res.data.data
          this.materialProcessInfo.info_data.forEach((item) => {
            this.materialProcessInfo.total_price = 0
            this.materialProcessInfo.total_number = 0
            // @ts-ignore
            this.materialProcessInfo.total_price += Number(item.price) * Number(item.number)
            // @ts-ignore
            this.materialProcessInfo.total_number += Number(item.number)
            item.material_name = item.material_order_name || item.material_transfer_name
          })
          this.materialInfo = this.$mergeData(this.materialProcessInfo.info_data, {
            mainRule: ['material_name']
          })
          // 生成二维码
          const QRCode = require('qrcode')
          QRCode.toDataURL(
            '/materialManage/detail?id=' +
              (this.materialProcessInfo.plan_id
                ? this.materialProcessInfo.plan_id
                : this.materialProcessInfo.sup_id + '&supFlag=1')
          )
            .then((url: any) => {
              this.qrCodePCUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
          QRCode.toDataURL(
            '/pages/billingManagement/rawMaterialProcessingOrder/rawMaterialProcessingOrderDetail?id=' +
              this.materialProcessInfo.id
          )
            .then((url: any) => {
              this.qrCodeWXUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
          this.windowMethod(2)
        }
      })
    this.$initEditor(this.descArr, 'MaterialProcess')
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialManage/processPrint.less';
</style>