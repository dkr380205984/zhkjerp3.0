<template>
  <div class="printContainer ">
    <div class="pmain crosswise">
      <div class="phead clearfix">
        <div class="fl">
          <!-- &lt;是小于号 -->
          <div class="ptitle">织为云产品{{(Number(productStockInfo.action_type)&lt;4)?'入库':'出库'}}单</div>
          <div class="prow">
            <div class="pcol">
              <div class="label">系统编号：</div>
              <div class="info">{{productStockInfo.code}}</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol">
              <div class="label">创建人：</div>
              <div class="info">{{productStockInfo.user_name}}</div>
            </div>
            <div class="pcol">
              <div class="label">创建日期：</div>
              <div class="info">{{productStockInfo.created_at}}</div>
            </div>
          </div>
        </div>
        <!-- <div class="fr">
          <div class="pImage">
            <img :src="qrCodeUrl"
              width="100%"
              alt="" />
          </div>
        </div> -->
      </div>
      <div class="pbody">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">产品编号/品类</div>
              <div class="tcol">产品名称</div>
              <div class="tcol">客户款号</div>
              <div class="tcol">尺码颜色</div>
              <div class="tcol">单价</div>
              <div class="tcol">数量</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in productStockInfo.info_data"
              :key="index">
              <div class="tcol">
                <span>{{item.product_code}}</span>
                <span>{{item.category}}/{{item.secondary_category}}</span>
              </div>
              <div class="tcol">{{item.product_name}}</div>
              <div class="tcol">{{item.style_code}}</div>
              <div class="tcol">{{item.size_name}}/{{item.color_name}}</div>
              <div class="tcol">{{item.price}}元</div>
              <div class="tcol">{{item.number}}</div>
            </div>
          </div>
          <div class="thead"
            style="border-top:0">
            <div class="trow">
              <div class="tcol">关联单据编号</div>
              <div class="tcol bgWhite">{{productStockInfo.order_code||'无'}}</div>
              <div class="tcol">{{productStockInfo.action_type|productStockTypeFilter}}日期</div>
              <div class="tcol bgWhite">{{productStockInfo.created_at}}</div>
              <div class="tcol">备注信息</div>
              <div class="tcol bgWhite">{{productStockInfo.desc}}</div>
            </div>
          </div>
          <div class="thead"
            style="border-top:0">
            <div class="trow">
              <div class="tcol">仓库名称</div>
              <div class="tcol bgWhite">{{productStockInfo.store}}/{{productStockInfo.secondary_store}}</div>
              <div class="tcol">{{productStockInfo.action_type===1||productStockInfo.action_type===2||productStockInfo.action_type===3?'送货人':'提货人'}}签字</div>
              <div class="tcol bgWhite"></div>
              <div class="tcol">仓管签字</div>
              <div class="tcol bgWhite"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { store } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      productStockInfo: {
        action_type: 1,
        complete_time: this.$getDate(new Date()),
        tree_data: [], // 存公司或者移库仓库用
        client_id: '',
        move_store_id: '',
        move_secondary_store_id: '',
        desc: '',
        store_id: '',
        secondary_store_id: '',
        store: '',
        secondary_store: '',
        store_arr: [], // 前端下拉框用
        info_data: [
          {
            product_code: '',
            name: '',
            category: '',
            secondary_category: '',
            product_id: '',
            size_id: '',
            color_id: '',
            price: '',
            size_name: '',
            color_name: '',
            number: ''
          }
        ]
      }
    }
  },
  mounted() {
    store
      .proDetail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.productStockInfo = res.data.data
        }
      })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/printEasy.less';
</style>