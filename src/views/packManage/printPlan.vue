<template>
  <div class="printContainer"
    id="packPrintPlan">
    <div class="printContainer"
      id="packOrderPrint"
      @click="showMenu = false"
      @click.right="handleClickRight">
      <div class="pmain crosswise">
        <div class="phead clearfix">
          <div class="fl">
            <div class="ptitle">{{title?title: company_name + '装箱计划单'}}</div>
            <div class="prow">
              <div class="pcol wa">
                <div class="label">系统编号：</div>
                <div class="info"
                  style="white-space: nowrap;">{{packPlanInfo.code}}</div>
              </div>
            </div>
            <div class="prow">
              <div class="pcol wa"
                style="width:auto">
                <div class="label">创建信息：</div>
                <div class="info"
                  style="white-space: nowrap;">{{ packPlanInfo.created_at?packPlanInfo.created_at.slice(0, 10):'' }}{{packPlanInfo.user_name?'，' + packPlanInfo.user_name:''}}{{packPlanInfo.user_phone?'，' + packPlanInfo.user_phone:''}}</div>
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
                <div class="tcol bgGray headTitle">订单号</div>
                <div class="tcol">{{packPlanInfo.order_code}}</div>
                <div class="tcol bgGray headTitle">发货批次</div>
                <div class="tcol">{{packPlanInfo.delivery_batch}}</div>
                <div class="tcol bgGray headTitle">批次名称</div>
                <div class="tcol">{{packPlanInfo.batch_name}}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray headTitle">发货时间</div>
                <div class="tcol">{{packPlanInfo.delivery_time}}</div>
                <div class="tcol bgGray headTitle">发货数量</div>
                <div class="tcol">{{$toFixed(packPlanInfo.total_delivery_number,0,true)}}</div>
                <div class="tcol bgGray headTitle"></div>
                <div class="tcol"></div>
              </div>
            </div>
          </div>
          <div class="tableCtn noPadTabel">
            <div class="thead">
              <div class="trow">
                <div class="tcol noPad"
                  style="max-width:200px">
                  <div class="trow">
                    <div class="tcol">产品</div>
                    <div class="tcol">尺码颜色</div>
                  </div>
                </div>
                <div class="tcol"
                  style="max-width:125px">产品装袋说明</div>
                <div class="tcol noPad">
                  <div class="trow">
                    <div class="tcol noPad">
                      <div class="trow">
                        <div class="tcol">数量/箱</div>
                      </div>
                    </div>
                    <div class="tcol">头箱号#</div>
                    <div class="tcol">尾箱号#</div>
                    <div class="tcol">箱数</div>
                    <div class="tcol">每箱毛重kg</div>
                    <div class="tcol">每箱净重kg</div>
                    <div class="tcol">总毛重kg</div>
                    <div class="tcol">总净重kg</div>
                    <div class="tcol small">长cm</div>
                    <div class="tcol small">宽cm</div>
                    <div class="tcol small">高cm</div>
                    <div class="tcol">单箱体积m³</div>
                    <div class="tcol">总体积m³</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow outTrow"
                v-for="(itemChild,indexChild) in packPlanInfo.data"
                :key="indexChild">
                <div class="tcol noPad"
                  style="max-width:200px">
                  <div class="trow"
                    v-for="(itemPro,indexPro) in itemChild.product_info"
                    :key="indexPro">
                    <div class="tcol">{{itemPro.product_code}}({{itemPro.category}}/{{itemPro.secondary_category}})</div>
                    <div class="tcol">{{itemPro.size_name}}/{{itemPro.color_name}}</div>
                  </div>
                </div>
                <div class="tcol"
                  style="max-width:125px">{{itemChild.desc}}</div>
                <div class="tcol noPad">
                  <div class="trow"
                    v-for="(itemPack,indexPack) in itemChild.info_data"
                    :key="indexPack">
                    <div class="tcol noPad">
                      <div class="trow"
                        v-for="(itemChildPro,indexChildPro) in itemPack.product_info"
                        :key="indexChildPro">
                        <div class="tcol">{{itemChildPro.pack_number}}</div>
                      </div>
                    </div>
                    <div class="tcol">{{itemPack.first_box_number}}</div>
                    <div class="tcol">{{itemPack.last_box_number}}</div>
                    <div class="tcol">{{itemPack.box_count}}</div>
                    <div class="tcol">{{itemPack.box_gross_weight}}kg</div>
                    <div class="tcol">{{itemPack.box_net_weight}}kg</div>
                    <div class="tcol">{{itemPack.total_gross_weight}}kg</div>
                    <div class="tcol">{{itemPack.total_net_weight}}kg</div>
                    <div class="tcol small">{{itemPack.length}}</div>
                    <div class="tcol small">{{itemPack.width}}</div>
                    <div class="tcol small">{{itemPack.height}}</div>
                    <div class="tcol">{{itemPack.single_bulk}}</div>
                    <div class="tcol">{{itemPack.total_bulk}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">包装名称</div>
                <div class="tcol">长</div>
                <div class="tcol">宽</div>
                <div class="tcol">高</div>
                <div class="tcol">属性或说明</div>
                <div class="tcol">图片</div>
                <div class="tcol">计划数量</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemPack,indexPack) in packPlanInfo.gather_info"
                :key="indexPack">
                <div class="tcol">
                  {{itemPack.pack_material}}
                </div>
                <div class="tcol">{{itemPack.length}}</div>
                <div class="tcol">{{itemPack.width}}</div>
                <div class="tcol">{{itemPack.height}}</div>
                <div class="tcol">{{itemPack.desc}}</div>
                <div class="tcol">
                  <div class="imageCtn">
                    <el-image style="width:100%;height:100%;margin-top:2px"
                      :src="itemPack.file_url?itemPack.file_url:''"
                      :preview-src-list="[itemPack.file_url]">
                      <div slot="error"
                        class="image-slot">
                        <i class="el-icon-picture-outline"
                          style="font-size:42px"></i>
                      </div>
                    </el-image>
                  </div>
                </div>
                <div class="tcol">{{itemPack.number}}</div>
              </div>
              <div class="trow"
                v-if="packPlanInfo.gather_info.length===0">
                <div class="tcol gray"
                  style="text-align:center">暂无计划包装信息</div>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">其他说明</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow">
                <div class="tcol"
                  style="display:block">
                  <div style="line-height:22px"
                    v-for="item,index in descArr"
                    :key="index">{{item?(index+1)+'.':''}}{{item}}</div>
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
        <!-- <div class="setting_item">设置行高 <el-input-number v-model="lineHeight"
            style="height:32px"
            :precision="1"
            size="small"
            :step="0.1"
            :min="0.7"
            :max="2"></el-input-number>
        </div> -->
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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { packManage } from '@/assets/js/api'
import { PackPlanInfo } from '@/types/packManage'
export default Vue.extend({
  data(): {
    packPlanInfo: PackPlanInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      showMenu: false,
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodeUrl: '',
      settingFlag: false,
      title: '',
      descArr: [''], // 注意事项
      packPlanInfo: {
        id: '',
        order_id: '',
        order_code: '',
        delivery_time: '',
        delivery_batch: '',
        batch_name: '',
        total_delivery_number: '',
        data: [
          {
            product_info: [
              {
                product_show_info: '',
                product_id: '',
                size_id: '',
                size_name: '',
                color_id: '',
                color_name: '',
                pack_number: ''
              }
            ],
            info_data: [
              {
                first_box_number: '',
                last_box_number: '',
                box_count: '',
                box_gross_weight: '',
                box_net_weight: '',
                total_gross_weight: '',
                total_net_weight: '',
                length: '',
                width: '',
                height: '',
                single_bulk: '',
                total_bulk: '',
                desc: '',
                product_info: [
                  {
                    product_id: '',
                    size_id: '',
                    color_id: '',
                    pack_number: ''
                  }
                ]
              }
            ],
            desc: ''
          }
        ],
        gather_info: [
          {
            unit: '',
            number: '',
            pack_material_id: '',
            length: '',
            width: '',
            height: '',
            desc: '',
            file_url: ''
          }
        ]
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
          this.settingFlag = true
          this.showMenu = false
        }
      })
    },
    saveSetting() {
      this.$setLocalStorage('packPlanPrintTitle', this.title)
      this.$setLocalStorage('packPlanPrintDesc', JSON.stringify(this.descArr))
      this.$message.success('保存成功')
      this.settingFlag = false
    },
    resetSetting() {
      this.$setLocalStorage('packPlanPrintTitle', '')
      this.$setLocalStorage('packPlanPrintDesc', JSON.stringify(['']))
      this.title = ''
      this.descArr = ['']
      this.$message.success('已清空')
      this.settingFlag = false
    }
  },
  mounted() {
    this.title = this.$getLocalStorage('packPlanPrintTitle') || ''
    this.descArr = this.$getLocalStorage('packPlanPrintDesc')
      ? JSON.parse(this.$getLocalStorage('packPlanPrintDesc'))
      : ['']
    packManage
      .detailPlan({
        id: [Number(this.$route.query.id)]
      })
      .then((res) => {
        if (res.data.status) {
          this.packPlanInfo = res.data.data[0]
          const QRCode = require('qrcode')
          QRCode.toDataURL('/packManage/detail?id=' + `${this.packPlanInfo.order_id}`)
            .then((url: any) => {
              this.qrCodeUrl = url
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
@import '~@/assets/css/packManage/printPlan.less';
</style>