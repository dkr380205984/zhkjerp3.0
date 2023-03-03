<template>
  <div class="printContainer ">
    <div class="pmain crosswise">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">{{type|materialStockTypeFilter}}打印单</div>
          <div class="prow">
            <div class="pcol">
              <div class="label">系统编号：</div>
              <div class="info">{{materialStockInfo.code}}</div>
            </div>
            <div class="pcol">
              <div class="label">关联订单：</div>
              <div class="info">{{materialStockInfo.order_code}}</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol">
              <div class="label">创建人：</div>
              <div class="info">{{materialStockInfo.user_name}}</div>
            </div>
            <div class="pcol">
              <div class="label">{{[2,4,6,8,9,11,14].indexOf(type)!==-1?'入库':'出库'}}日期：</div>
              <div class="info">{{materialStockInfo.complete_time}}</div>
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
              <div class="tcol">{{type|materialStockTypeFilter}}仓库</div>
              <div class="tcol">原料名称</div>
              <div class="tcol">原料颜色</div>
              <div class="tcol">包装属性</div>
              <div class="tcol">批号</div>
              <div class="tcol">缸号</div>
              <div class="tcol">色号</div>
              <div class="tcol">{{type|materialStockTypeFilter}}数量</div>
              <div class="tcol">{{type|materialStockTypeFilter}}件数</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in materialStockInfo.info_data"
              :key="item.id">
              <div class="tcol">{{materialStockInfo.store}}/{{materialStockInfo.secondary_store}}</div>
              <div class="tcol">{{item.material_name}}</div>
              <div class="tcol">{{item.material_color}}</div>
              <div class="tcol">{{item.attribute}}</div>
              <div class="tcol">{{item.batch_code}}</div>
              <div class="tcol">{{item.vat_code}}</div>
              <div class="tcol">{{item.color_code}}</div>
              <div class="tcol">{{item.number}}{{item.unit}}</div>
              <div class="tcol">{{item.item}}件</div>
            </div>
          </div>
          <div class="thead"
            style="border-top:0">
            <div class="trow">
              <div class="tcol">关联单据编号</div>
              <div class="tcol bgWhite">{{type===1||type===2||type===4||type===6||type===8||type===9?materialStockInfo.order_code:materialStockInfo.rel_doc_code}}</div>
              <div class="tcol">操作类型</div>
              <div class="tcol bgWhite">{{type|materialStockTypeFilter}}</div>
              <div class="tcol">备注信息</div>
              <div class="tcol bgWhite">{{materialStockInfo.desc}}</div>
            </div>
          </div>
          <div class="thead"
            style="border-top:0">
            <div class="trow">
              <div class="tcol">{{type===1||type===2||type===4||type===6||type===8||type===9?'来源':'出库'}}单位</div>
              <div class="tcol bgWhite">{{materialStockInfo.client_name}}</div>
              <div class="tcol">{{type===1||type===2||type===4||type===6||type===8||type===9?'送货人':'提货人'}}签字</div>
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
import Vue from 'vue'
import { materialStock } from '@/assets/js/api'
import { MaterialStockInfo } from '@/types/materialStock'
export default Vue.extend({
  data(): {
    materialStockInfo: MaterialStockInfo
    [propName: string]: any
  } {
    return {
      type: 1,
      user_name: window.sessionStorage.getItem('user_name'),
      company_name: window.sessionStorage.getItem('company_name'),
      materialStockInfo: {
        top_order_id: '',
        material_type: 1,
        action_type: 9,
        rel_doc_type: '',
        rel_doc_id: '',
        rel_doc_code: '',
        complete_time: this.$getDate(new Date()),
        client_id: '',
        desc: '',
        store_id: '',
        secondary_store_id: '',
        info_data: [
          {
            tree_data: [],
            material_id: '',
            material_color: '',
            color_code: '',
            batch_code: '',
            vat_code: '',
            attribute: '',
            number: '',
            item: '', // 件数
            unit: 'kg',
            rel_doc_info_id: '' // 采购单调取单加工单子项id
          }
        ],
        selectList: []
      },
      qrCodeUrl: ''
    }
  },
  mounted() {
    this.type = Number(this.$route.query.type)
    materialStock
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.materialStockInfo = res.data.data
          // 生成二维码
          // const QRCode = require('qrcode')
          // QRCode.toDataURL(
          //   `/materialStock/detail?id=${this.materialStockInfo.top_order_id}&sampleOrderIndex=${this.materialStockInfo.order_id}`
          // )
          //   .then((url: any) => {
          //     this.qrCodeUrl = url
          //   })
          //   .catch((err: any) => {
          //     console.error(err)
          //   })
          // QRCode.toDataURL(`${Number(this.$route.query.id)}`)
          //   .then((url: any) => {
          //     this.qrCodeUrl = url
          //   })
          //   .catch((err: any) => {
          //     console.error(err)
          //   })
          setTimeout(() => {
            window.print()
          }, 1000)
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/printEasy.less';
</style>