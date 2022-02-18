<template>
  <div class="printContainer"
    id="productionPlanPrint"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <div class="pmain">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">{{title?title: company_name + '生产计划单'}}</div>
          <div class="prow">
            <div class="pcol wa">
              <div class="label">系统编号：</div>
              <div class="info"
                style="white-space: nowrap;">{{productionPlanInfo.code}}</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol wa">
              <div class="label">创建信息：</div>
              <div class="info"
                style="white-space: nowrap;">{{ productionPlanInfo.created_at?productionPlanInfo.created_at.slice(0, 10):'' }}{{productionPlanInfo.user_name?'，' + productionPlanInfo.user_name:''}}{{user_name?'，' + user_name:''}}</div>
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
              <div class="tcol bgGray label">订单号</div>
              <div class="tcol">{{productionPlanInfo.order_code}}</div>
              <div class="tcol bgGray label">生产单位</div>
              <div class="tcol">{{productionPlanInfo.client_name}}</div>
              <div class="tcol bgGray label">开单日期</div>
              <div class="tcol">{{productionPlanInfo.start_time}}</div>
              <div class="tcol bgGray label">分配总数</div>
              <div class="tcol">{{totalNumber}}</div>
            </div>
            <div class="trow">
              <div class="tcol bgGray label">下单客户</div>
              <div class="tcol">{{company_name}}</div>
              <div class="tcol bgGray label">生产工序</div>
              <div class="tcol">{{productionPlanInfo.process_name}}</div>
              <div class="tcol bgGray label">完成日期</div>
              <div class="tcol">{{productionPlanInfo.end_time}}</div>
              <div class="tcol bgGray label">分配总额</div>
              <div class="tcol">{{totalPrice}}元</div>
            </div>
          </div>
        </div>
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">产品编号</div>
              <div class="tcol">产品图片</div>
              <div class="tcol">尺码颜色</div>
              <div class="tcol">产品部位</div>
              <div class="tcol">尺寸克重</div>
              <div class="tcol">分配单价</div>
              <div class="tcol">分配数量</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="itemPro in productionPlanInfo.product_info_data"
              :key="itemPro.id">
              <div class="tcol">
                <span>{{itemPro.product_code||itemPro.system_code}}</span>
                <span>{{itemPro.category_name}}/{{itemPro.secondary_category_name}}</span>
              </div>
              <div class="tcol">
                <el-image :src="itemPro.image_data.length>0?itemPro.image_data[0]:require('@/assets/image/common/noPic.png')"
                  :preview-src-list="itemPro.image_data">
                </el-image>
              </div>
              <div class="tcol">{{itemPro.size_name}}/{{itemPro.color_name}}</div>
              <div class="tcol">{{itemPro.part_name}}</div>
              <div class="tcol">{{itemPro.size_info}}/{{itemPro.weight||0}}g</div>
              <div class="tcol">{{itemPro.price}}元</div>
              <div class="tcol">{{itemPro.number}}</div>
            </div>
          </div>
        </div>
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">原料名称</div>
              <div class="tcol">原料颜色</div>
              <div class="tcol">合计数量</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="itemMat in productionPlanInfo.material_info_data"
              :key="itemMat.id">
              <div class="tcol">{{itemMat.material_name}}</div>
              <div class="tcol">{{itemMat.material_color}}</div>
              <div class="tcol">{{itemMat.number}}{{itemMat.unit}}</div>
            </div>
            <div class="gray trow"
              v-if="productionPlanInfo.material_info_data.length===0">
              <div class="tcol">
                <span class="gray">该工序未分配任何物料</span>
              </div>
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
        @click="windowMethod(1)">刷新页面</div>
      <div class="setting_item"
        @click="windowMethod(2)">打印计划单</div>
      <div class="setting_item"
        @click="windowMethod(3)">打印设置</div>
    </div>
  </div>
</template>

<script lang="ts">
import { productionPlan } from '@/assets/js/api'
import { ProductionPlanInfo } from '@/types/productionPlan'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    productionPlanInfo: ProductionPlanInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      showMenu: false,
      user_name: window.sessionStorage.getItem('user_name'),
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodeUrl: '',
      settingFlag: false,
      title: '',
      descArr: [''], // 注意事项
      productionPlanInfo: {
        process_type: '',
        order_id: '',
        client_id: '',
        start_time: this.$getDate(new Date()),
        end_time: '',
        desc: '',
        total_price: '',
        total_number: '',
        process_id: '',
        process_name: '',
        process_name_arr: [],
        product_info_data: [
          {
            product_id: '',
            size_id: '',
            color_id: '',
            part_id: '',
            number: '',
            price: '',
            total_price: '',
            select_arr: '',
            image_data: []
          }
        ],
        material_info_data: [
          {
            material_id: '',
            material_name: '',
            material_color: '',
            number: '',
            unit: ''
          }
        ],
        others_fee_data: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ]
      }
    }
  },
  computed: {
    totalPrice(): number {
      return this.productionPlanInfo.product_info_data.reduce((total, item) => {
        return total + Number(item.total_price)
      }, 0)
    },
    totalNumber(): number {
      return this.productionPlanInfo.product_info_data.reduce((total, item) => {
        return total + Number(item.number)
      }, 0)
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
      this.$setLocalStorage('productionPlanPrintTitle', this.title)
      this.$setLocalStorage('productionPlanPrintDesc', JSON.stringify(this.descArr))
      this.$message.success('保存成功')
      this.settingFlag = false
    },
    resetSetting() {
      this.$setLocalStorage('productionPlanPrintTitle', '')
      this.$setLocalStorage('productionPlanPrintDesc', JSON.stringify(['']))
      this.title = ''
      this.descArr = ['']
      this.$message.success('已清空')
      this.settingFlag = false
    }
  },
  mounted() {
    productionPlan
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.productionPlanInfo = res.data.data
          const QRCode = require('qrcode')
          QRCode.toDataURL(`${this.productionPlanInfo.id}`)
            .then((url: any) => {
              this.qrCodeUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
        }
        this.loading = false
      })
  }
})
</script>


<style lang="less" scoped>
@import '~@/assets/css/productionPlan/print.less';
</style>