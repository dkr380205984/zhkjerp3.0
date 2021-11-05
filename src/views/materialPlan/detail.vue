<template>
  <div id="materialPlanDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <el-tabs type="border-card"
        v-model="materialPlanIndex">
        <el-tab-pane v-for="(itemFather,indexFather) in materialPlanInfo"
          :key="indexFather"
          :name="itemFather.id.toString()"
          :label="'计划单'+(indexFather+1)">
          <div class="titleCtn">
            <div class="title">生产计划</div>
          </div>
          <div class="detailCtn">
            <div class="row">
              <div class="col">
                <div class="label">单据编号：</div>
                <div class="text">{{itemFather.code}}</div>
              </div>
              <div class="col">
                <div class="label">创建人：</div>
                <div class="text">{{itemFather.user_name}}</div>
              </div>
              <div class="col">
                <div class="label">更新时间：</div>
                <div class="text">{{itemFather.created_at.slice(0,10)}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">关联订单：</div>
                <div class="text">{{itemFather.order_code}}</div>
              </div>
              <div class="col">
                <div class="label">采购状态：</div>
                <div class="text">没有</div>
              </div>
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text"
                  :class="itemFather.desc?'':'gray'">{{itemFather.desc || '无'}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            style="padding-top:0">
            <div class="thead">
              <div class="trow">
                <div class="tcol">产品品类</div>
                <div class="tcol noPad"
                  style="flex:7">
                  <div class="trow">
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">下单数量</div>
                    <div class="tcol">已计划</div>
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
                v-for="item in itemFather.production_plan_data"
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
                    <div class="tcol">{{itemChild.order_number}}</div>
                    <div class="tcol">{{itemChild.info_data.reduce((total,cur)=>{return total+cur.number},0)}}</div>
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
          <div class="titleCtn">
            <div class="title">工序物料详情</div>
          </div>
          <template v-if="Number(itemFather.type)===1">
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">产品信息</div>
                  <div class="tcol">尺码颜色</div>
                  <div class="tcol">产品部位</div>
                  <div class="tcol">计划生产数量</div>
                  <div class="tcol noPad"
                    style="flex:6">
                    <div class="trow">
                      <div class="tcol">工序名称</div>
                      <div class="tcol">物料名称</div>
                      <div class="tcol">物料颜色</div>
                      <div class="tcol">损耗</div>
                      <div class="tcol">合计最终数量</div>
                      <div class="tcol">平均所需物料</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in itemFather.material_plan_data"
                  :key="index">
                  <div class="tcol">
                    <span>{{item.product_code||item.system_code}}</span>
                    <span>{{item.category}}/{{item.type}}</span>
                  </div>
                  <div class="tcol">{{item.color_name}}/{{item.size_name}}</div>
                  <div class="tcol">{{item.part_name}}</div>
                  <div class="tcol">{{item.order_number}}</div>
                  <div class="tcol noPad"
                    style="flex:6">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.info_data"
                      :key="indexChild">
                      <div class="tcol">{{itemChild.process_name}}</div>
                      <div class="tcol">{{itemChild.material_name}}</div>
                      <div class="tcol">{{itemChild.material_color}}</div>
                      <div class="tcol">{{itemChild.loss}}%</div>
                      <div class="tcol">{{itemChild.final_number}}kg</div>
                      <div class="tcol">{{$toFixed(itemChild.final_number/item.order_number*1000)}}g</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">产品信息</div>
                  <div class="tcol">产品部位</div>
                  <div class="tcol">计划生产数量</div>
                  <div class="tcol noPad"
                    style="flex:6">
                    <div class="trow">
                      <div class="tcol">工序名称</div>
                      <div class="tcol">物料名称</div>
                      <div class="tcol">物料颜色</div>
                      <div class="tcol">损耗</div>
                      <div class="tcol">合计最终数量</div>
                      <div class="tcol">平均所需物料</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in itemFather.material_plan_data"
                  :key="index">
                  <div class="tcol">
                    <span>{{item.product_code||item.system_code}}</span>
                    <span>{{item.category}}/{{item.type}}</span>
                  </div>
                  <div class="tcol">{{item.part_name}}</div>
                  <div class="tcol">{{item.order_number}}</div>
                  <div class="tcol noPad"
                    style="flex:6">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.info_data"
                      :key="indexChild">
                      <div class="tcol">{{itemChild.process_name}}</div>
                      <div class="tcol">{{itemChild.material_name}}</div>
                      <div class="tcol">{{itemChild.material_color}}</div>
                      <div class="tcol">{{itemChild.loss}}%</div>
                      <div class="tcol">{{itemChild.final_number}}kg</div>
                      <div class="tcol">{{$toFixed(itemChild.final_number/item.order_number*1000)}}g</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
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
                v-for="(item,index) in itemFather.material_plan_gather_data"
                :key="index">
                <div class="tcol">{{index+1}}</div>
                <div class="tcol">{{item.material_name}}</div>
                <div class="tcol">{{item.material_color}}</div>
                <div class="tcol">{{item.need_number}}kg</div>
                <div class="tcol">{{item.loss}}%</div>
                <div class="tcol">{{item.final_number}}kg</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverOrange"
            @click="goUpdate">修改</div>
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
    materialPlanInfo: MaterialPlanInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      materialPlanIndex: '0',
      materialPlanInfo: []
    }
  },
  methods: {
    goUpdate() {
      this.$router.push('/materialPlan/update?id=' + this.materialPlanIndex)
    }
  },
  mounted() {
    materialPlan
      .list({
        top_order_id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.materialPlanInfo = res.data.data
          this.materialPlanIndex = this.materialPlanInfo[0].id?.toString()
        }
        this.loading = false
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialPlan/detail.less';
</style>
<style lang="less">
#materialPlanDetail {
  .el-tabs__content {
    padding: 0;
  }
}
</style>