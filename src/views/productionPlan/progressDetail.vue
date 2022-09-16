<template>
  <div id="productionPlanProgressDetail"
    class="bodyContainer"
    v-loading="loading">
    <!-- <template v-if="$route.query.planId">
      <div class="module">
        <div class="titleCtn">
          <div class="title">基本信息</div>
        </div>
        <div class="detailCtn">
          <div class="row">
            <div class="col">
              <div class="label">计划单号：</div>
              <div class="text">{{productionPorgressInfo.code}}</div>
            </div>
            <div class="col">
              <div class="label">订单号：</div>
              <div class="text">{{productionPorgressInfo.order.code}}</div>
            </div>
            <div class="col">
              <div class="label">创建人：</div>
              <div class="text">{{productionPorgressInfo.user.name}}</div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="label">下单公司：</div>
              <div class="text">{{productionPorgressInfo.customer.name}}</div>
            </div>
            <div class="col">
              <div class="label">产品名：</div>
              <div class="text">{{productionPorgressInfo.product.product_code}}/{{productionPorgressInfo.product.name}}</div>
            </div>
            <div class="col">
              <div class="label">加工作坊：</div>
              <div class="text">{{productionPorgressInfo.client.name}}</div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="label">分派工序：</div>
              <div class="text">{{productionPorgressInfo.process_name}}</div>
            </div>
            <div class="col">
              <div class="label">分派时间：</div>
              <div class="text">{{productionPorgressInfo.start_time}}</div>
            </div>
            <div class="col">
              <div class="label">交货时间：</div>
              <div class="text">{{productionPorgressInfo.end_time}}</div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="label">加工状态：</div>
              <div class="text"><span :class="productionPorgressInfo.status|filterStatusClass">{{productionPorgressInfo.status|filterStatus}}</span></div>
            </div>
            <div class="col">
              <div class="label">加工总价：</div>
              <div class="text">{{productionPorgressInfo.weave_plan_product_info.list.reduce((total,cur)=>total+Number(cur.total_price),0)}}元</div>
            </div>
            <div class="col">
              <div class="label">加工总数：</div>
              <div class="text">{{productionPorgressInfo.real_number}}</div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="label">产品图片：</div>
              <div class="imgCtn">
                <el-image style="width:120px;max-height:120px"
                  :src="productionPorgressInfo.product.rel_image2.length>0?productionPorgressInfo.product.rel_image2[0].image_url:''"
                  :preview-src-list="productionPorgressInfo.product.rel_image2.map((item)=>item.image_url)">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"
                      style="font-size:42px"></i>
                  </div>
                </el-image>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="label">备注信息：</div>
              <div class="text">{{productionPorgressInfo.desc}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="titleCtn">
          <div class="title">派单完成情况</div>
        </div>
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">尺码颜色</div>
              <div class="tcol">部位信息</div>
              <div class="tcol">单价（元）</div>
              <div class="tcol">计划数量（件）</div>
              <div class="tcol">加工状态</div>
              <div class="tcol">完成数量（件）</div>
              <div class="tcol">差额（件）</div>
              <div class="tcol">小计（元）</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in productionPorgressInfo.weave_plan_product_info.list"
              :key="item.id">
              <div class="tcol">{{item.size.size_name}}/{{item.color.color_name}}</div>
              <div class="tcol">{{item.part_name}}</div>
              <div class="tcol">{{item.price}}元</div>
              <div class="tcol">{{item.number}}</div>
              <div class="tcol">{{item.status|filterStatus}}</div>
              <div class="tcol">{{item.number}}/{{item.real_number}}</div>
              <div class="tcol">{{item.real_number - item.number}}</div>
              <div class="tcol">{{item.total_price}}元</div>
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="titleCtn">
          <div class="title">生产记录</div>
        </div>
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">生产时间</div>
              <div class="tcol">尺码颜色</div>
              <div class="tcol">加工数量</div>
              <div class="tcol">差额</div>
              <div class="tcol">生产进度</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in productionPorgressInfo.weave_plan_product_info.yields"
              :key="item.id">
              <div class="tcol">{{item.created_at.slice(0,10)}}</div>
              <div class="tcol">{{item.weave_plan_product_info.size.size_name}}/{{item.weave_plan_product_info.color.color_name}}</div>
              <div class="tcol">{{item.number}}</div>
              <div class="tcol">{{item.difference}}</div>
              <div class="tcol">{{item.weave_plan_product_info.real_number}}/{{item.weave_plan_product_info.number}}</div>
            </div>
          </div>
        </div>
      </div>
    </template> -->
    <div class="module">
      <div class="titleCtn">
        <div class="title">外协单位小程序更新日志</div>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="row title">
            <div class="col">订单号</div>
            <div class="col">生产单号</div>
            <div class="col">单位(工序)</div>
            <div class="col">产品信息</div>
            <div class="col">尺码颜色</div>
            <div class="col">更新数量</div>
            <div class="col">更新时间</div>
            <div class="col">备注信息</div>
            <div class="col">操作人</div>
          </div>
          <div class="row"
            v-for="item in mini_program_update_log"
            :key="item.id">
            <div class="col">{{item.order_code}}</div>
            <div class="col">{{item.weave_code}}</div>
            <div class="col">{{item.client_name}}
              <span class="green">({{item.process_name}})</span>
            </div>
            <div class="col">{{item.product_code}}</div>
            <div class="col">{{item.size_name}}/{{item.color_name}}</div>
            <div class="col">{{$toFixed(item.number,0,true)}}</div>
            <div class="col">{{item.update_time}}</div>
            <div class="col">{{item.desc}}</div>
            <div class="col">{{item.user_name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">本厂更新日志</div>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="row title">
            <div class="col">订单号</div>
            <div class="col">生产单号</div>
            <div class="col">单位(工序)</div>
            <div class="col">产品信息</div>
            <div class="col">尺码颜色</div>
            <div class="col">更新数量</div>
            <div class="col">更新时间</div>
            <div class="col">备注信息</div>
            <div class="col">操作人</div>
          </div>
          <div class="row"
            v-for="item in admin_update_log"
            :key="item.id">
            <div class="col">{{item.order_code}}</div>
            <div class="col">{{item.weave_code}}</div>
            <div class="col">{{item.client_name}}
              <span class="green">({{item.process_name}})</span>
            </div>
            <div class="col">{{item.product_code}}</div>
            <div class="col">{{item.size_name}}/{{item.color_name}}</div>
            <div class="col">{{$toFixed(item.number,0,true)}}</div>
            <div class="col">{{item.update_time}}</div>
            <div class="col">{{item.desc}}</div>
            <div class="col">{{item.user_name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { productionProgress } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      // productionPorgressInfo: {
      //   client: { name: '' },
      //   code: '',
      //   customer: { name: '' },
      //   start_time: '',
      //   end_time: '',
      //   number: '',
      //   order: { code: '' },
      //   process_name: '',
      //   product: { name: '', product_code: '', rel_image2: [] },
      //   real_number: '',
      //   user: { name: '' },
      //   desc: '',
      //   status: 0,
      //   weave_plan_product_info: {
      //     list: [],
      //     yields: []
      //   }
      // },
      admin_update_log: [],
      mini_program_update_log: []
    }
  },
  filters: {
    filterStatusClass(val: number) {
      const arr = ['', 'orange', 'red', 'blue', 'green']
      return arr[val]
    },
    filterStatus(val: number) {
      const arr = ['', '已分配', '已逾期', '生产中', '生产完成']
      return arr[val]
    }
  },
  mounted() {
    productionProgress
      .updateLog({
        plan_id: Number(this.$route.query.planId) || '',
        order_id: Number(this.$route.query.orderId) || ''
      })
      .then((res) => {
        if (res.data.status) {
          const data = res.data.data
          this.admin_update_log = data.admin_update_log
          this.mini_program_update_log = data.mini_program_update_log
        }
        this.loading = false
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/productionPlan/progressDetail.less';
</style>