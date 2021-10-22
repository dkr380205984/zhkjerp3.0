<template>
  <div id="materialPlanDetail"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">订单组件</div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">生产计划</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">产品品类</div>
            <div class="tcol noPad"
              style="flex:7">
              <div class="trow">
                <div class="tcol">尺码颜色</div>
                <div class="tcol">下单数量</div>
                <div class="tcol">已计划数量</div>
                <div class="tcol">总数量百分比</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow">
                    <div class="tcol">产品部位</div>
                    <div class="tcol">计划生产数量</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="item in materialPlanInfo.production_plan_data"
            :key="item.product_id">
            <div class="tcol">
              <span>{{item.product_code}}</span>
              <span>{{item.category}}/{{item.type}}</span>
            </div>
            <div class="tcol noPad"
              style="flex:7">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.product_data"
                :key="indexChild">
                <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                <div class="tcol">{{itemChild.number}}</div>
                <div class="tcol">已计划数量</div>
                <div class="tcol">{{itemChild.add_percent}}%</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow"
                    v-for="(itemPart,indexPart) in itemChild.info_data"
                    :key="indexPart">
                    <div class="tcol">{{itemPart.part_name}}</div>
                    <div class="tcol">{{itemPart.number}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">工序物料详情</div>
      </div>
      <template v-if="Number(materialPlanInfo.type)===1">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">产品品类</div>
              <div class="tcol">产品部位</div>
              <div class="tcol">计划生产数量</div>
              <div class="tcol"
                style="flex:9">
                <div class="trow">
                  <div class="tcol">工序名称</div>
                  <div class="tcol">物料名称</div>
                  <div class="tcol">物料颜色</div>
                  <div class="tcol">配料数量</div>
                  <div class="tcol">生产数量</div>
                  <div class="tcol">合计所需数量</div>
                  <div class="tcol">损耗</div>
                  <div class="tcol">合计最终数量</div>
                  <div class="tcol">平均所需物料</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else></template>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">物料信息合计</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">序号</div>
            <div class="tcol">原料名称</div>
            <div class="tcol">原料颜色</div>
            <div class="tcol">所需数量</div>
            <div class="tcol">原料损耗</div>
            <div class="tcol">最终数量</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in materialPlanInfo.material_plan_gather_data"
            :key="index">
            <div class="tcol">{{index+1}}</div>
            <div class="tcol">{{item.material_name}}</div>
            <div class="tcol">{{item.material_color_name}}</div>
            <div class="tcol">{{item.need_number}}</div>
            <div class="tcol">{{item.loss}}%</div>
            <div class="tcol">{{item.final_number}}kg</div>
          </div>
        </div>
      </div>
      <!-- <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">备注信息</div>
            <div class="info">{{materialPlanInfo.desc}}</div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverOrange">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialPlan } from '@/assets/js/api'
import { MaterialPlanInfo } from '@/types/materialPlan'
export default Vue.extend({
  data(): {
    materialPlanInfo: MaterialPlanInfo
    [propName: string]: any
  } {
    return {
      materialPlanInfo: {
        order_id: '',
        type: '1', // 1、按颜色尺码 2.按产品
        desc: '',
        is_draft: 2,
        production_plan_data: [],
        material_plan_data: [],
        material_plan_gather_data: []
      }
    }
  },
  mounted() {
    materialPlan
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        console.log(res)
        if (res.data.status) {
          this.materialPlanInfo = res.data.data
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialPlan/detail.less';
</style>