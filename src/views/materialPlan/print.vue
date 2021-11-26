<template>
  <div class="printContainer"
    v-loading="loading">
    <div class="pmain">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">物料计划单</div>
          <div class="prow">
            <div class="pcol">
              <div class="label">系统编号：</div>
              <div class="info">{{otherInfo.code}}</div>
            </div>
            <div class="pcol">
              <div class="label">关联订单：</div>
              <div class="info">{{otherInfo.order_code}}</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol">
              <div class="label">创建人：</div>
              <div class="info">{{otherInfo.user_name}}</div>
            </div>
            <div class="pcol">
              <div class="label">创建日期：</div>
              <div class="info">{{otherInfo.created_at.slice(0,10)}}</div>
            </div>
          </div>
        </div>
        <div class="fr">
          <div class="remark">打开微信扫一扫 更新每日生产进度</div>
          <div class="pImage">假装有图</div>
        </div>
      </div>
      <div class="pbody">
        <div class="tableCtn hasTop">
          <div class="tbody">
            <div class="trow">
              <div class="tcol bgGray">下单客户</div>
              <div class="tcol">{{otherInfo.client_name ||'暂无'}}</div>
              <div class="tcol bgGray">负责人/小组</div>
              <div class="tcol">{{otherInfo.group_name ||'暂无'}}</div>
            </div>
          </div>
        </div>
        <div class="tableCtn"
          v-for="item in materialPlanInfo"
          :key="item.material_id">
          <div class="thead"
            style="height: auto;">
            <div class="trow">
              <div class="tcol">原料名称</div>
              <div class="tcol"
                style="flex:4;background:#fff">
                {{item.material_name}}
              </div>
            </div>
            <div class="trow">
              <div class="tcol">序号</div>
              <div class="tcol"
                style="flex:4">
                <div class="trow">
                  <div class="tcol">颜色</div>
                  <div class="tcol">数量</div>
                  <div class="tcol">原料损耗</div>
                  <div class="tcol">最终数量</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(itemChild,indexChild) in item.childrenMergeInfo"
              :key="indexChild">
              <div class="tcol">{{indexChild+1}}</div>
              <div class="tcol"
                style="flex:4">
                <div class="trow">
                  <div class="tcol">{{itemChild.material_color}}</div>
                  <div class="tcol">{{itemChild.need_number}}{{itemChild.unit}}</div>
                  <div class="tcol">{{itemChild.loss}}%</div>
                  <div class="tcol">{{itemChild.final_number}}{{itemChild.unit}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="premark">
      </div>
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
      loading: true,
      materialPlanIndex: '0',
      materialPlanInfo: [],
      otherInfo: {
        code: '',
        order_code: '',
        user_name: '',
        created_at: '',
        client_name: '',
        group_name: ''
      }
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
        setTimeout(() => {
          window.print()
        }, 1000)

        this.loading = false
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/printEasy.less';
</style>