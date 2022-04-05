<template>
  <div class="popup"
    v-show="show">
    <div class="main"
      style="width:1000px"
      v-loading="loading">
      <div class="titleCtn">
        <span class="text">关联单据</span>
        <div class="closeCtn"
          @click="$emit('close')">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn">
        <div class="tableCtn"
          style="padding-left:0;padding-right:0">
          <div class="thead">
            <div class="trow">
              <div class="tcol">关联页面</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol">单据类型</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcol">单据编号</div>
                      <div class="tcol">创建人</div>
                      <div class="tcol">创建时间</div>
                      <div class="tcol">操作</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-if="showWhich.material_plan && orderLogInfo.material_plan.length>0">
              <div class="tcol">原料计划</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol">原料计划单</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.material_plan"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/materialPlan/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.material && (orderLogInfo.material.order.length>0 || orderLogInfo.material.transfer.length>0 || orderLogInfo.material.process.length>0 || orderLogInfo.material.sup.length>0 || orderLogInfo.decorate.length>0)">
              <div class="tcol">物料管理</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow"
                  v-if="orderLogInfo.material.order.length>0">
                  <div class="tcol">原料订购单</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.material.order"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl(item.plan_id?
                          ('/materialManage/detail?id='+item.plan_id):('/materialManage/detail?id='+item.sup_id+'&supFlag=true')
                          )">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow"
                  v-if="orderLogInfo.material.transfer.length>0">
                  <div class="tcol">原料调取单</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.material.transfer"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl(item.plan_id?
                          ('/materialManage/detail?id='+item.plan_id):('/materialManage/detail?id='+item.sup_id+'&supFlag=true')
                          )">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow"
                  v-if="orderLogInfo.material.sup.length>0">
                  <div class="tcol">原料补纱单</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.material.sup"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl(item.plan_id?
                          ('/materialManage/detail?id='+item.plan_id):('/materialManage/detail?id='+item.sup_id+'&supFlag=true')
                          )">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow"
                  v-if="orderLogInfo.material.process.length>0">
                  <div class="tcol">原料加工单</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.material.process"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl(item.plan_id?
                          ('/materialManage/detail?id='+item.plan_id):('/materialManage/detail?id='+item.sup_id+'&supFlag=true')
                          )">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow"
                  v-if="orderLogInfo.decorate.length>0">
                  <div class="tcol">辅料订购单</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.decorate"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/accessoriesManage/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.material_push && orderLogInfo.material_push.transfer_push.length>0">
              <div class="tcol">原料出入库</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol">调取最终入库</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.material_push.transfer_push"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/materialStock/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow"
                  v-if="orderLogInfo.material_push.order_push.length>0">
                  <div class="tcol">订购最终入库</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.material_push.order_push"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/materialStock/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow"
                  v-if="orderLogInfo.material_push.production_pop.length>0">
                  <div class="tcol">生产最终出库</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.material_push.production_pop"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/materialStock/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.weave_plan && orderLogInfo.weave_plan.length>0">
              <div class="tcol">生产管理</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol">生产日志</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.weave_plan"
                      :key="index">
                      <div class="tcol">{{item.code || '无'}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/productionPlan/detail?id='+order_id+'&supFlag=true')">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.inspection && (orderLogInfo.inspection.push.length>0||orderLogInfo.inspection.pop.length>0)">
              <div class="tcol">检验收发</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow"
                  v-if="orderLogInfo.inspection.push.length>0">
                  <div class="tcol">检验入库</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.inspection.push"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/inspection/detail?id='+order_id)">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow"
                  v-if="orderLogInfo.inspection.pop.length>0">
                  <div class="tcol">生产出库</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.inspection.pop"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/inspection/detail?id='+order_id)">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.production_inspection && orderLogInfo.production_inspection.length>0">
              <div class="tcol">车间管理</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol">结算日志</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.production_inspection"
                      :key="index">
                      <div class="tcol">{{item.code || '无'}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/workshopManagement/detail?id='+order_id)">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.pack && (orderLogInfo.pack.plan.length>0 || orderLogInfo.pack.order.length>0)">
              <div class="tcol">包装管理</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow"
                  v-if="orderLogInfo.pack.plan.length>0">
                  <div class="tcol">包装计划单</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.pack.plan"
                      :key="index">
                      <div class="tcol">{{item.code || '无'}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/packManage/detail?id='+order_id)">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow"
                  v-if="orderLogInfo.pack.order.length>0">
                  <div class="tcol">包装订购单</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.pack.order"
                      :key="index">
                      <div class="tcol">{{item.code || '无'}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/packManage/detail?id='+order_id)">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.transport && orderLogInfo.transport.length>0">
              <div class="tcol">发货管理</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol">运输发货单</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.transport"
                      :key="index">
                      <div class="tcol">{{item.code || '无'}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/boxManage/boxDetail?id='+item.id)">详情</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order } from '@/assets/js/api'
export default Vue.extend({
  props: {
    show: {
      default: false
    },
    order_id: {
      default: ''
    },
    order_time_id: {
      default: ''
    },
    showWhich: {
      default: () => {
        return {
          decorate: true,
          inspection: true,
          material: true,
          material_plan: true,
          material_push: true,
          pack: true,
          production_inspection: true,
          transport: true,
          weave_plan: true
        }
      }
    }
  },
  data() {
    return {
      loading: true,
      orderLogInfo: {
        decorate: [],
        inspection: {
          push: [],
          pop: []
        },
        material: {
          order: [],
          process: [],
          sup: [],
          transfer: []
        },
        material_plan: [],
        material_push: {
          order_push: [],
          production_pop: [],
          transfer_push: []
        },
        pack: {
          plan: [],
          order: []
        },
        production_inspection: [],
        transport: [],
        weave_plan: []
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.loading = true
        order
          .logList({
            order_id: this.order_time_id
          })
          .then((res) => {
            if (res.data.status) {
              this.orderLogInfo = res.data.data
              this.loading = false
            }
          })
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhOrderLog.less';
</style>