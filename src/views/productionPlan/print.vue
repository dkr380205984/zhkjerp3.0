<template>
  <div class="printContainer"
    id="productionPlanPrint"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <div class="pmain">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">{{ company_name + '生产计划单'}}</div>
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
                style="white-space: nowrap;">{{ productionPlanInfo.created_at?productionPlanInfo.created_at.slice(0, 10):'' }}{{productionPlanInfo.user_name?'，' + productionPlanInfo.user_name:''}}{{productionPlanInfo.user_phone?'，' + productionPlanInfo.user_phone:''}}</div>
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
              <div class="tcol">暂无信息</div>
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
              <div class="tcol"></div>
            </div>
          </div>
        </div>
      </div>
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
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodeUrl: '',
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
            select_arr: ''
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
        others_fee: [
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
    handleClickRight() {}
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