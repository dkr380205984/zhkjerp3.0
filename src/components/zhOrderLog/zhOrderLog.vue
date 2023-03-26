<template>
  <div class="popup zhOrderLog"
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
              v-if="showWhich.craft_list">
              <div class="tcol">产品工艺单</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol">工艺单</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.craft_list"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/craft/detail?id='+item.id)">详情</span>
                      </div>
                    </div>
                    <div class="trow"
                      v-if="orderLogInfo.craft_list.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="gray opr">暂无操作</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.quote">
              <div class="tcol">产品报价单</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol">报价单</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.quote"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/quotedPrice/detail?id='+item.id)">详情</span>
                      </div>
                    </div>
                    <div class="trow"
                      v-if="orderLogInfo.quote.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="gray opr">暂无操作</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.material_plan">
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
                    <div class="trow"
                      v-if="orderLogInfo.material_plan.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/materialPlan/create?id='+order_id+'&sampleOrderIndex='+order_time_id)">添加</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.material">
              <div class="tcol">物料管理</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
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
                    <div class="trow"
                      v-if="orderLogInfo.material.order.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="gray opr">暂无操作</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow">
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
                    <div class="trow"
                      v-if="orderLogInfo.material.transfer.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="gray opr">暂无操作</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow">
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
                          @click="$openUrl('/materialManage/detail?id='+item.id+'&supFlag=true')">详情</span>
                      </div>
                    </div>
                    <div class="trow"
                      v-if="orderLogInfo.material.sup.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="gray opr">暂无操作</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow">
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
                    <div class="trow"
                      v-if="orderLogInfo.material.process.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="gray opr">暂无操作</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow">
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
                    <div class="trow"
                      v-if="orderLogInfo.decorate.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/accessoriesManage/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">添加</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.material_push">
              <div class="tcol">原料出入库</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol width1">调取最终入库</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.material_push.transfer_push"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                    </div>
                    <div class="trow"
                      v-if="orderLogInfo.material_push.transfer_push.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/materialStock/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">添加</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="orderLogInfo.material_push.transfer_push.length>0"
                    class="tcol width2 oprCtn">
                    <span class="blue opr"
                      @click="$openUrl('/materialStock/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">详情</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol width1">订购最终入库</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.material_push.order_push"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                    </div>
                    <div class="trow"
                      v-if="orderLogInfo.material_push.order_push.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/materialStock/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">添加</span>
                      </div>
                    </div>
                  </div>
                  <div class="tcol width2 oprCtn"
                    v-if="orderLogInfo.material_push.order_push.length>0">
                    <span class="blue opr"
                      @click="$openUrl('/materialStock/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">详情</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol width1">生产最终出库</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.material_push.production_pop"
                      :key="index">
                      <div class="tcol">{{item.code}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                    </div>
                    <div class="trow"
                      v-if="orderLogInfo.material_push.production_pop.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/materialStock/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">添加</span>
                      </div>
                    </div>
                  </div>
                  <div class="tcol width2 oprCtn"
                    v-if="orderLogInfo.material_push.production_pop.length>0">
                    <span class="blue opr"
                      @click="$openUrl('/materialStock/detail?id='+order_id+'&sampleOrderIndex='+order_time_id)">详情</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.weave_plan">
              <div class="tcol">生产管理</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol width1">生产日志</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(item,index) in orderLogInfo.weave_plan"
                      :key="index">
                      <div class="tcol">{{item.code || '无'}}</div>
                      <div class="tcol">{{item.user_name}}</div>
                      <div class="tcol">{{item.created_at}}</div>
                    </div>
                    <div class="trow"
                      v-if="orderLogInfo.weave_plan.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/productionPlan/detail?id='+order_id+'&sampleOrderIndex=' +order_time_id)">添加</span>
                      </div>
                    </div>
                  </div>
                  <div class="tcol oprCtn width2"
                    v-if="orderLogInfo.weave_plan.length>0">
                    <span class="blue opr"
                      @click="$openUrl('/productionPlan/detail?id='+order_id+'&sampleOrderIndex=' +order_time_id)">详情</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.inspection">
              <div class="tcol">检验收发</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol width1">检验入库</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-if="orderLogInfo.inspection.push.length>0">
                      <div class="tcol">共{{orderLogInfo.inspection.push.length}}条日志</div>
                      <div class="tcol"
                        style="display: block;">
                        <span v-for="(item,index) in Array.from(new Set(orderLogInfo.inspection.push.map((itemChild)=>itemChild.user_name)))"
                          :key="index">{{item}};</span>
                      </div>
                      <div class="tcol"
                        style="display: block;">
                        <span v-for="(item,index) in Array.from(new Set(orderLogInfo.inspection.push.map((itemChild)=>itemChild.created_at)))"
                          :key="index">{{item}};</span>
                      </div>
                    </div>
                    <div class="trow"
                      v-if="orderLogInfo.inspection.push.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/inspection/detail?id='+order_id)">添加</span>
                      </div>
                    </div>
                  </div>
                  <div class="tcol oprCtn width2"
                    v-if="orderLogInfo.inspection.push.length>0">
                    <span class="blue opr"
                      @click="$openUrl('/inspection/detail?id='+order_id)">详情</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol width1">生产出库</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-if="orderLogInfo.inspection.pop.length>0">
                      <div class="tcol">共{{orderLogInfo.inspection.pop.length}}条日志</div>
                      <div class="tcol"
                        style="display: block;">
                        <span v-for="(item,index) in Array.from(new Set(orderLogInfo.inspection.pop.map((itemChild)=>itemChild.user_name)))"
                          :key="index">{{item}};</span>
                      </div>
                      <div class="tcol"
                        style="display: block;">
                        <span v-for="(item,index) in Array.from(new Set(orderLogInfo.inspection.pop.map((itemChild)=>itemChild.created_at)))"
                          :key="index">{{item}};</span>
                      </div>
                    </div>
                    <div class="trow"
                      v-if="orderLogInfo.inspection.pop.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/inspection/detail?id='+order_id)">添加</span>
                      </div>
                    </div>
                  </div>
                  <div class="tcol oprCtn width2"
                    v-show="orderLogInfo.inspection.pop.length>0">
                    <span class="blue opr"
                      @click="$openUrl('/inspection/detail?id='+order_id)">详情</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.production_inspection">
              <div class="tcol">车间管理</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol width1">结算日志</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-if="orderLogInfo.production_inspection.length>0">
                      <div class="tcol">共{{orderLogInfo.production_inspection.length}}条日志</div>
                      <div class="tcol"
                        style="display: block;">
                        <span v-for="(item,index) in Array.from(new Set(orderLogInfo.production_inspection.map((itemChild)=>itemChild.user_name)))"
                          :key="index">{{item}};</span>
                      </div>
                      <div class="tcol"
                        style="display: block;">
                        <span v-for="(item,index) in Array.from(new Set(orderLogInfo.production_inspection.map((itemChild)=>itemChild.created_at)))"
                          :key="index">{{item}};</span>
                      </div>
                    </div>
                    <div class="trow"
                      v-if="orderLogInfo.production_inspection.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/workshopManagement/detail?id='+order_id)">添加</span>
                      </div>
                    </div>
                  </div>
                  <div class="tcol oprCtn width2"
                    v-if="orderLogInfo.production_inspection.length>0">
                    <span class="blue opr"
                      @click="$openUrl('/workshopManagement/detail?id='+order_id)">详情</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.pack">
              <div class="tcol">包装管理</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
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
                    <div class="trow"
                      v-if=" orderLogInfo.pack.plan.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/packManage/detail?id='+order_id)">添加</span>
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
                    <div class="trow"
                      v-if=" orderLogInfo.pack.order.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/packManage/detail?id='+order_id)">添加</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow"
              v-if="showWhich.transport">
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
                    <div class="trow"
                      v-if="orderLogInfo.transport.length===0">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol oprCtn"
                        style="justify-content:start">
                        <span class="blue opr"
                          @click="$openUrl('/boxManage/orderDetail?id='+JSON.stringify([order_id]))">去发货</span>
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
          quote: true,
          craft_list: true,
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
        quote: [],
        craft_list: [],
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