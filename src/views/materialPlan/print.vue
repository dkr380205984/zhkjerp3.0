<template>
  <div class="printContainer"
    id="materialPlanPrint"
    v-loading="loading"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <template v-if="!isBreak">
      <div class="pmain">
        <div class="phead clearfix">
          <div class="fl">
            <div class="ptitle">{{title?title:company_name+'物料计划单'}}</div>
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
            <div class="thead">
              <div class="trow">
                <div class="tcol">产品信息</div>
                <div class="tcol"
                  v-if="materialPlanType===1">尺码颜色</div>
                <div class="tcol">产品部位</div>
                <div class="tcol">计划生产数量</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(item,index) in productInfo"
                :key="index">
                <div class="tcol">
                  <div>{{item.product_code||item.system_code}}</div>
                  <div>{{item.category}}/{{item.secondary_category}}</div>
                </div>
                <div class="tcol"
                  v-if="materialPlanType===1">{{item.size_name}}/{{item.color_name}}</div>
                <div class="tcol">{{item.part_name}}</div>
                <div class="tcol">{{item.number}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            v-for="(item,index) in materialPlanInfo"
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
                  {{ item.childrenMergeInfo.reduce((total,cur)=>total+Number(cur.final_number),0)}}{{item.childrenMergeInfo[0].unit}}
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
                        {{ itemChild.final_number }}{{ itemChild.unit }}
                      </template>
                      <template v-else>
                        <div class="elCtn">
                          <el-input v-model="itemChild.final_number"
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
                <div class="tcol bgGray label">其它备注</div>
                <div class="tcol"
                  style="flex: 4;text-align:left">{{ otherInfo.desc }}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray label">注意事项</div>
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
        v-for="(item,index) in materialPlanInfo"
        :key="item.material_id">
        <div class="phead clearfix">
          <div class="fl">
            <div class="ptitle">{{title?title:company_name+'物料计划单'}}</div>
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
            <div class="thead">
              <div class="trow">
                <div class="tcol">产品信息</div>
                <div class="tcol"
                  v-if="materialPlanType===1">尺码颜色</div>
                <div class="tcol">产品部位</div>
                <div class="tcol">计划生产数量</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(item,index) in productInfo"
                :key="index">
                <div class="tcol">
                  <div>{{item.product_code||item.system_code}}</div>
                  <div>{{item.category}}/{{item.secondary_category}}</div>
                </div>
                <div class="tcol"
                  v-if="materialPlanType===1">{{item.size_name}}/{{item.color_name}}</div>
                <div class="tcol">{{item.part_name}}</div>
                <div class="tcol">{{item.number}}</div>
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
                <div class="tcol bgGray label">合计值</div>
                <div class="tcol"
                  style="flex:2">
                  {{ item.childrenMergeInfo.reduce((total,cur)=>total+Number(cur.final_number),0)}}{{item.childrenMergeInfo[0].unit}}
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
                        {{ itemChild.final_number }}{{ itemChild.unit }}
                      </template>
                      <template v-else>
                        <div class="elCtn">
                          <el-input v-model="itemChild.final_number"
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
                <div class="tcol bgGray"
                  style="flex:0.3">其它备注</div>
                <div class="tcol"
                  style="flex: 4;text-align:left">{{ otherInfo.desc }}</div>
              </div>
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
        @click="windowMethod(2)">打印计划单</div>
      <div class="setting_item"
        @click="windowMethod(3)">{{editFlag?'完成编辑':'编辑模式'}}</div>
      <div class="setting_item"
        @click="windowMethod(5)">打印设置</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlan } from '@/assets/js/api'
import { MaterailPlanData } from '@/types/materialPlan'
export default Vue.extend({
  data(): {
    productInfo: MaterailPlanData[]
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
      productInfo: [],
      materialPlanInfo: [],
      materialPlanType: 1,
      otherInfo: {
        code: '',
        order_code: '',
        user_name: '',
        user_phone: '',
        created_at: '',
        client_name: '',
        group_name: ''
      },
      editFlag: false,
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
      this.$setLocalStorage('materialPlanPrintTitle', this.title)
      this.$setLocalStorage('materialPlanPrintDesc', JSON.stringify(this.descArr))
      this.$message.success('保存成功')
      this.settingFlag = false
    },
    resetSetting() {
      this.$setLocalStorage('materialPlanPrintTitle', '')
      this.$setLocalStorage('materialPlanPrintDesc', JSON.stringify(['']))
      this.title = ''
      this.descArr = ['']
      this.$message.success('已清空')
      this.settingFlag = false
    }
  },
  mounted() {
    const proIdArr = JSON.parse(this.$route.query.proId as string)
    this.title = this.$getLocalStorage('materialPlanPrintTitle') || ''
    this.descArr = this.$getLocalStorage('materialPlanPrintDesc')
      ? JSON.parse(this.$getLocalStorage('materialPlanPrintDesc'))
      : ['']
    materialPlan
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.otherInfo = res.data.data
        this.materialPlanType = this.otherInfo.type
        this.productInfo = this.otherInfo.material_plan_data.filter((item: any) => {
          return proIdArr.indexOf(item.id) !== -1
        })
        // 物料根据所选产品信息重新计算
        const material_plan_gather_data: any[] = []
        this.productInfo.forEach((item) => {
          item.info_data.forEach((itemChild) => {
            const finded = material_plan_gather_data.find(
              (itemFind) =>
                itemFind.material_color === itemChild.material_color && itemFind.material_id === itemChild.material_id
            )
            if (finded) {
              finded.final_number = Number(finded.final_number) + Number(itemChild.final_number)
            } else {
              material_plan_gather_data.push({
                final_number: itemChild.final_number,
                material_color: itemChild.material_color,
                material_name: itemChild.material_name,
                unit: itemChild.unit,
                material_id: itemChild.material_id
              })
            }
          })
        })
        this.materialPlanInfo = this.$mergeData(material_plan_gather_data, {
          mainRule: ['material_name', 'material_id']
        })
        // 生成二维码
        const QRCode = require('qrcode')
        QRCode.toDataURL('/materialPlan/detail?id=' + `${this.otherInfo.top_order_id}` + '&ifprint=true')
          .then((url: any) => {
            this.qrCodeUrl = url
          })
          .catch((err: any) => {
            console.error(err)
          })
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