<template>
  <div id="productionPlanDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
    <div class="module">
      <el-tabs type="border-card"
        v-model="materialPlanIndex"
        :before-leave="getMaterialPlanDetail">
        <el-tab-pane v-for="(item,index) in materialPlanList"
          :key="index"
          :name="item.id.toString()">
          <div slot="label">
            <div style="display:flex;flex-direction:column">
              <div style="line-height:20px;font-size:14px">计划单{{(index+1)}}</div>
              <div style="line-height:20px;font-size:14px">{{item.code}}</div>
            </div>
          </div>
          <div class="titleCtn">
            <div class="title">计划加工</div>
          </div>
          <div class="detailCtn">
            <div class="checkCtn"
              @click="checkType=9;checkDetailFlag=true">
              <el-tooltip class="item"
                effect="dark"
                :content="materialPlanDetail.is_check>=3?'点击查看异常处理办法':'点击查看审核日志'"
                placement="bottom">
                <img :src="materialPlanDetail.is_check|checkFilter" />
              </el-tooltip>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">单据编号：</div>
                <div class="text">{{materialPlanDetail.code}}</div>
              </div>
              <div class="col">
                <div class="label">创建人：</div>
                <div class="text">{{materialPlanDetail.user_name}}</div>
              </div>
              <div class="col">
                <div class="label">更新时间：</div>
                <div class="text">{{materialPlanDetail.created_at.slice(0,10)}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">关联订单：</div>
                <div class="text">{{materialPlanDetail.order_code}}</div>
              </div>
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text"
                  :class="materialPlanDetail.desc?'':'gray'">{{materialPlanDetail.desc || '无'}}</div>
              </div>
              <div class="col">
                <div class="label">计划工序：</div>
                <div class="text">已计划<span class="green">{{materialPlanDetail.weave_plan_count||0}}</span>张</div>
              </div>
            </div>
          </div>
          <!-- 按尺码配色填 -->
          <template v-if="Number(materialPlanDetail.type)===1">
            <div class="description">
              <span>生产加工的物料信息由物料计划确定，如需补充加工步骤所需的物料请<span class="orange">修改物料计划单</span>。注意！已经分配过生产计划的物料计划单不能被修改。</span>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">
                    <el-checkbox v-model="checkAllColorSize"
                      @change="(ev)=>{materialPlanDetail.material_plan_data.forEach((item)=>item.check=ev)}">产品信息</el-checkbox>
                  </div>
                  <div class="tcol">产品部位</div>
                  <div class="tcol">尺码颜色</div>
                  <div class="tcol">下单数量</div>
                  <div class="tcol">计划生产数量</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(itemPro,indexPro) in materialPlanDetail.material_plan_data"
                  :key="indexPro">
                  <div class="tcol">
                    <el-checkbox v-model="itemPro.check"
                      @change="$forceUpdate()">
                      <span>{{itemPro.name||itemPro.product_code||itemPro.system_code}}</span>
                      <span>({{itemPro.category}}/{{itemPro.secondary_category}})</span>
                    </el-checkbox>
                  </div>
                  <div class="tcol">{{itemPro.part_name}}</div>
                  <div class="tcol">{{itemPro.size_name}}/{{itemPro.color_name}}</div>
                  <div class="tcol">{{itemPro.order_number}}</div>
                  <div class="tcol">{{itemPro.number}}</div>
                </div>
              </div>
            </div>
          </template>
          <!-- 按产品款式填 -->
          <template v-else>
            <div class="description">
              <span>由于计划单是按照产品款式进行填写的，所以<span class="green">同一款产品只能被分配给同一家单位进行生产</span>，如需分配给不同加工单位请<span class="orange">修改物料计划单</span>。</span>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">
                    <el-checkbox v-model="checkAllPro"
                      @change="(ev)=>{materialPlanDetail.material_plan_data.forEach((item)=>item.check=ev)}">产品信息</el-checkbox>
                  </div>
                  <div class="tcol">产品部位</div>
                  <div class="tcol">下单数量</div>
                  <div class="tcol">计划生产数量</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(itemPro,indexPro) in materialPlanDetail.material_plan_data"
                  :key="indexPro">
                  <div class="tcol">
                    <el-checkbox v-model="itemPro.check"
                      @change="$forceUpdate()"> {{itemPro.name||itemPro.product_code||itemPro.system_code}}</el-checkbox>
                  </div>
                  <div class="tcol">{{itemPro.part_name}}</div>
                  <div class="tcol">{{itemPro.order_number}}</div>
                  <div class="tcol">{{itemPro.number}}</div>
                </div>
              </div>
            </div>
          </template>
          <div class="buttonList">
            <div class="btn backHoverOrange"
              :class="{'backGray':checkList().length===0}"
              @click="getProductionPlan">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">内部派单</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module"
      v-if="productionPlanList.length>0">
      <el-tabs type="border-card"
        v-model="productionPlanIndex">
        <el-tab-pane v-for="(item,index) in productionPlanList"
          :key="index"
          :name="item.id.toString()">
          <div slot="label">
            <div style="display:flex;flex-direction:column">
              <div style="line-height:20px;font-size:14px">加工单{{(index+1)}}</div>
              <div style="line-height:20px;font-size:14px">{{item.process_name}}({{item.code}})</div>
            </div>
          </div>
          <div class="titleCtn">
            <div class="title">加工单据</div>
          </div>
          <div class="detailCtn">
            <div class="checkCtn"
              @click="checkType=4;checkDetailFlag=true;is_check=item.is_check">
              <el-tooltip class="item"
                effect="dark"
                :content="item.is_check>=3?'点击查看异常处理办法':'点击查看审核日志'"
                placement="bottom">
                <img :src="item.is_check|checkFilter" />
              </el-tooltip>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">加工单号：</div>
                <div class="text">{{item.code}}</div>
              </div>
              <div class="col">
                <div class="label">关联计划单：</div>
                <div class="text">{{item.plan_code}}</div>
              </div>
              <div class="col">
                <div class="label">加工单位：</div>
                <div class="text">{{item.client_name}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">加工日期：</div>
                <div class="text">{{item.start_time}}</div>
              </div>
              <div class="col">
                <div class="label">交货日期：</div>
                <div class="text">{{item.end_time}}</div>
              </div>
              <div class="col">
                <div class="label">结算状态：</div>
                <div class="text"
                  :class="{'green':item.has_invoice===1||item.has_pay===1,'gray':item.has_invoice!==1&&item.has_pay!==1}">{{item.has_invoice===1||item.has_pay===1?'已结算':'待结算'}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">工序说明：</div>
                <div class="text">{{item.process_desc||'无'}}</div>
              </div>
              <div class="col flex3">
                <div class="label">创建人：</div>
                <div class="text">{{item.user_name||'无'}}</div>
              </div>
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text"
                  :class="{'gray':!item.desc}">{{item.desc || '无'}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            style="padding-top:0">
            <div class="thead">
              <div class="trow">
                <div class="tcol">序号</div>
                <div class="tcol">产品信息</div>
                <div class="tcol">产品部位</div>
                <div class="tcol">尺码颜色</div>
                <div class="tcol">加工数量</div>
                <div class="tcol">加工单价</div>
                <div class="tcol">加工总价</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemPro,indexPro) in item.product_info_data"
                :key="indexPro">
                <div class="tcol">{{indexPro+1}}</div>
                <div class="tcol">
                  <span>{{itemPro.product_code||itemPro.system_code}}</span>
                  <span>{{itemPro.category_name}}/{{itemPro.secondary_category_name}}</span>
                </div>
                <div class="tcol">
                  {{itemPro.part_name}}
                </div>
                <div class="tcol">{{itemPro.size_name?itemPro.size_name + '/' + itemPro.color_name:'未选择尺码颜色'}}</div>
                <div class="tcol">{{itemPro.number}}</div>
                <div class="tcol">{{itemPro.price}}元</div>
                <div class="tcol">{{$toFixed(itemPro.price*itemPro.number)}}元</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            v-if="item.material_info_data.length>0">
            <div class="thead">
              <div class="trow">
                <div class="tcol">序号</div>
                <div class="tcol">物料名称</div>
                <div class="tcol">物料颜色</div>
                <div class="tcol">分配数量</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemMat,indexMat) in item.material_info_data"
                :key="indexMat">
                <div class="tcol">
                  <el-checkbox v-model="itemMat.check">{{indexMat+1}}</el-checkbox>
                </div>
                <div class="tcol">{{itemMat.material_name}}</div>
                <div class="tcol">{{itemMat.material_color}}</div>
                <div class="tcol">{{itemMat.number}}{{itemMat.unit}}</div>
              </div>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">加工单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverBlue"
                  style="margin-right:12px"
                  @click="$router.push('/productionPlan/progressList??page=1&user_id=&status=1&date=&limit=10&group_id=&listType=1&process_name_arr=&client_id=&contacts_id&keyword='+item.code)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">更新数量</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$openUrl('/productionPlan/print?id='+item.id+'&order_id='+$route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">打印单据</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteProductionPlan(item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">删除单据</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="Number($getsessionStorage('has_check'))!==1&&(item.has_invoice===1||item.has_pay===1)?$message.error('单据已结算，无法修改，可联系管理员操作'):goUpdate(item)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">修改单据</span>
                </div>
                <div class="btn backHoverGreen"
                  @click="goMaterialSupplement(item)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">补充物料</span>
                </div>
                <div class="btn backHoverGreen"
                  @click="goDeduct(item,4)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">单据扣款</span>
                </div>
                <div class="btn"
                  :class="item.deduct_data && item.deduct_data.length>0?'backHoverBlue':'backGray'"
                  @click="getDeduct(item.deduct_data)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">扣款记录</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="divideProductionPlan(item)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">拆分单据</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="storeSurplus(item.material_info_data)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">结余入库</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="checkType=4;checkFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">审核单据</span>
                </div>
              </div>
            </div>
          </div>
          <div class="titleCtn"
            style="margin-top:40px"
            v-if="item.sup_data&&item.sup_data.length>0">
            <div class="title">加工物料补充</div>
          </div>
          <div class="tableCtn"
            v-if="item.sup_data&&item.sup_data.length>0">
            <div class="thead">
              <div class="trow">
                <div class="tcol">补纱单编号</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow">
                    <div class="tcol">承担单位</div>
                    <div class="tcol">承担金额</div>
                  </div>
                </div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow">
                    <div class="tcol">物料名称</div>
                    <div class="tcol">物料颜色</div>
                    <div class="tcol">物料数量</div>
                  </div>
                </div>
                <div class="tcol">备注信息</div>
                <div class="tcol">操作</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="itemChild in item.sup_data"
                :key="itemChild.id">
                <div class="tcol">{{itemChild.code}}</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow"
                    v-for="(itemClient,indexClient) in itemChild.client_data"
                    :key="indexClient">
                    <div class="tcol">{{itemClient.bear_client_name}}</div>
                    <div class="tcol">{{itemClient.bear_price}}元</div>
                  </div>
                </div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow"
                    v-for="itemMat in itemChild.info_data"
                    :key="itemMat.id">
                    <div class="tcol">{{itemMat.material_name}}</div>
                    <div class="tcol">{{itemMat.material_color}}</div>
                    <div class="tcol">{{itemMat.number}}{{itemMat.unit}}</div>
                  </div>
                </div>
                <div class="tcol">{{itemChild.desc}}</div>
                <div class="tcol oprCtn">
                  <div class="opr hoverBlue"
                    @click="$openUrl('/materialManage/supPrint?id='+itemChild.id)">打印</div>
                  <div class="opr hoverRed"
                    @click="deleteMaterialSupplement(itemChild.id)">删除</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="popup"
      v-show="productionPlanFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">生产计划单填写</span>
          <div class="closeCtn"
            @click="productionPlanFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="stepCtn">
            <div class="step"
              :class="{'active':!materialPlanFlag}">
              <div class="circle">
                <span class="white">1</span>
              </div>
              <div class="name">排产信息</div>
            </div>
            <div class="step"
              :class="{'active':materialPlanFlag}">
              <div class="circle">
                <span class="white">2</span>
              </div>
              <div class="name">原料信息</div>
            </div>
          </div>
          <template v-if="!materialPlanFlag">
            <div class="editCtn"
              v-for="(item,index) in productionPlanInfo"
              :key="index">
              <div class="deleteIcon"
                @click="productionPlanInfo.length>1?$deleteItem(productionPlanInfo,index):$message.error('至少有一家加工单位')">
                <i class="el-icon-close"></i>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">加工单位</span>
                    <span class="explanation">(必选)</span>
                    <el-tooltip class="item"
                      effect="dark"
                      content="设置成功后请点击此按钮刷新数据"
                      placement="top">
                      <i class="el-icon-refresh hoverGreen fr"
                        style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                        @click="$checkCommonInfo([{
                        checkWhich: 'api/clientType',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getClientTypeAsync',
                        forceUpdate:true
                      }])"></i>
                    </el-tooltip>
                    <el-tooltip class="item"
                      effect="dark"
                      content="添加新单位"
                      placement="top">
                      <i class="el-icon-upload hoverOrange fr"
                        style="line-height:38px;font-size:18px;cursor:pointer;"
                        @click="$openUrl('/client/create?type=2')"></i>
                    </el-tooltip>
                  </div>
                  <div class="info elCtn">
                    <el-cascader :class="{'error':mustFlag&&!item.client_id_arr}"
                      placeholder="请选择加工单位"
                      v-model="item.client_id_arr"
                      :options="processClientList"
                      @change="(ev)=>{item.client_id=ev[2]}"
                      filterable></el-cascader>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label">
                        <span class="text">加工工序</span>
                        <span class="explanation">(必选)</span>
                        <el-tooltip class="item"
                          effect="dark"
                          content="设置成功后请点击此按钮刷新数据"
                          placement="top">
                          <i class="el-icon-refresh hoverGreen fr"
                            style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                            @click="$checkCommonInfo([{
                              checkWhich: 'api/staffProcess',
                              getInfoMethed: 'dispatch',
                              getInfoApi: 'getStaffProcessAsync',
                              forceUpdate:true
                            }])"></i>
                        </el-tooltip>
                        <el-tooltip class="item"
                          effect="dark"
                          content="添加新工序"
                          placement="top">
                          <i class="el-icon-upload hoverOrange fr"
                            style="line-height:38px;font-size:18px;cursor:pointer;"
                            @click="$openUrl('/setting/?pName=工序设置&cName=半成品加工')"></i>
                        </el-tooltip>
                      </div>
                      <div class="info elCtn">
                        <el-cascader :class="{'error':mustFlag&&item.process_name_arr.length===0}"
                          placeholder="选择工序"
                          :show-all-levels="false"
                          v-model="item.process_name_arr"
                          :options="processList"
                          @change="(ev)=>{item.process_type=ev[0];item.process_name=ev[1];getProcessDesc(ev,item)}"
                          filterable
                          clearable>
                        </el-cascader>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label">
                        <span class="text">工序说明</span>
                      </div>
                      <div class="info elCtn">
                        <el-input v-model="item.process_desc"
                          placeholder="工序说明"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label">
                        <span class="text">订购时间</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-date-picker style="width:100%"
                          placeholder="请选择时间"
                          value-format="yyyy-MM-dd"
                          v-model="item.start_time"></el-date-picker>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label">
                        <span class="text">交货日期</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-date-picker :class="{'error':mustFlag&&!item.end_time}"
                          style="width:100%"
                          placeholder="请选择交货日期"
                          value-format="yyyy-MM-dd"
                          v-model="item.end_time"></el-date-picker>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row"
                v-for="(itemPro,indexPro) in item.product_info_data"
                :key="'pro'+ indexPro">
                <div class="col">
                  <div class="label"
                    v-if="indexPro===0">
                    <span class="text">产品信息</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select :class="{'error':mustFlag&&!itemPro.select_arr}"
                      placeholder="请选择产品信息"
                      v-model="itemPro.select_arr"
                      @change="getProInfo($event,itemPro)">
                      <el-option v-for="(item,index) in checkList()"
                        :key="index"
                        :value="item.product_id+'/'+ item.part_id+'/'+item.size_id+'/'+ item.color_id + '/'+item.id"
                        :label="item.size_name?(item.name||item.product_code||item.system_code)+'('+ item.category+'/'+item.secondary_category+')'+'/'+ item.part_name+'/'+item.size_name+'/'+ item.color_name:(item.name||item.product_code||item.system_code)+'/'+ item.part_name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="indexPro===0">
                        <span class="text">单价</span>
                        <span class="explanation">(必填)</span>
                        <el-tooltip class="item"
                          effect="dark"
                          content="统一单价"
                          placement="top">
                          <svg class="iconFont copyIcon hoverBlue"
                            aria-hidden="true"
                            @click="$copyInfo(item.product_info_data,['price'])">
                            <use xlink:href='#icon-tongbushuju1'></use>
                          </svg>
                        </el-tooltip>
                      </div>
                      <div class="info elCtn">
                        <el-input :ref="'price'+ '-'+index+'-'+indexPro"
                          :class="{'error':mustFlag&&!itemPro.price}"
                          v-model="itemPro.price"
                          placeholder="请输入单价"
                          @keydown.native="$focusByKeydown($event,'price',[index,indexPro],'',['productionPlanInfo','product_info_data'])"
                          @input="(ev)=>{itemPro.total_price=$toFixed(Number(ev)*Number(itemPro.number))}">
                          <template slot="append">元</template>
                        </el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="indexPro===0">
                        <span class="text">数量</span>
                        <span class="explanation">(必填)</span>
                      </div>
                      <div class="info elCtn">
                        <el-input :ref="'number'+ '-'+index+'-'+indexPro"
                          :class="{'error':mustFlag&&!itemPro.number}"
                          v-model="itemPro.number"
                          @keydown.native="$focusByKeydown($event,'number',[index,indexPro],'',['productionPlanInfo','product_info_data'])"
                          :disabled="materialPlanList.find((item) => Number(item.id) === Number(materialPlanIndex))&&materialPlanList.find((item) => Number(item.id) === Number(materialPlanIndex)).type===2"
                          @input="(ev)=>{itemPro.total_price=$toFixed(Number(ev)*Number(itemPro.price))}"
                          placeholder="请输入数量">
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexPro===0">
                    <span class="text">合计总价</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemPro.total_price"
                      placeholder="默认"
                      disabled>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexPro===0"
                  @click="$addItem(item.product_info_data,{
                    product_id: '',
                    size_id: '',
                    color_id: '',
                    part_id: '',
                    number: '',
                    price: '',
                    total_price: '',
                    select_arr: ''
                  })">添加</div>
                <div class="opr hoverRed"
                  v-if="indexPro>0"
                  @click="$deleteItem(item.product_info_data,indexPro)">删除</div>
              </div>
              <div class="row"
                v-for="(itemOther,indexOther) in item.others_fee_data"
                :key="'other'+indexOther">
                <div class="col">
                  <div class="label"
                    v-if="indexOther===0">
                    <span class="text">额外费用名称</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入额外费用名称"
                      v-model="itemOther.name"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexOther===0">
                    <span class="text">额外费用金额</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入额外费用金额"
                      v-model="itemOther.price">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexOther===0">
                    <span class="text">额外费用备注</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入额外费用备注"
                      v-model="itemOther.desc"></el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexOther===0"
                  @click="$addItem(item.others_fee_data,{
                  desc: '',
                  name: '',
                  price: ''
                })">添加</div>
                <div class="opr hoverRed"
                  v-if="indexOther>0"
                  @click="$deleteItem(item.others_fee_data,indexOther)">删除</div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">备注信息</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入备注信息"
                      v-model="item.desc"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">加工总价</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="totalPlanPriceList[index]"
                      placeholder="自动计算"
                      disabled>
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">订购总数</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="totalPlanNumberList[index]"
                      placeholder="自动计算"
                      disabled>
                      <template slot="append">kg</template>
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
            <!-- 物料计划单按照尺码颜色填才能分给多家单位 -->
            <div class="btn backHoverBlue"
              style="margin-bottom:16px"
              v-if="materialPlanList.find((item) => Number(item.id) === Number(materialPlanIndex))&&materialPlanList.find((item) => Number(item.id) === Number(materialPlanIndex)).type===1"
              @click="$addItem(productionPlanInfo, {
                process_desc:'',
                process_type: '',
                order_id: '',
                client_id: '',
                start_time: $getDate(new Date()),
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
                others_fee_data: [
                  {
                    name: '',
                    price: '',
                    desc: ''
                  }
                ]
              })">添加加工单位</div>
            <div class="btn backHoverOrange"
              style="margin-bottom:16px;margin-left:12px"
              v-if="materialPlanList.find((item) => Number(item.id) === Number(materialPlanIndex))&&materialPlanList.find((item) => Number(item.id) === Number(materialPlanIndex)).type===1"
              @click="$addItem(productionPlanInfo, $clone(productionPlanInfo[0]))">复制第一组信息</div>
          </template>
          <template v-else>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">单位名称</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcol">物料名称</div>
                      <div class="tcol">物料颜色</div>
                      <div class="tcol">所需数量</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in productionPlanInfo"
                  :key="index">
                  <div class="tcol">
                    <span>{{item.client_name||'未选择单位'}}</span>
                    <span class="green">({{item.process_name}})</span>
                  </div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="gray trow"
                      v-if="item.material_info_data.length===0">
                      <div class="tcol">
                        <span class="gray">该工序未分配任何物料</span>
                      </div>
                    </div>
                    <div class="trow"
                      v-for="(itemMat,indexMat) in item.material_info_data"
                      :key="indexMat">
                      <div class="tcol">{{itemMat.material_name}}</div>
                      <div class="tcol">{{itemMat.material_color}}</div>
                      <div class="tcol">{{itemMat.number}}{{itemMat.unit}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="productionPlanFlag = false">取消</span>
          <span class="btn backHoverOrange"
            @click="materialPlanFlag?materialPlanFlag=false:getMaterialInfo(true)">{{materialPlanFlag?'查看排产信息':'查看物料分配'}}</span>
          <span class="btn backHoverBlue"
            @click="saveProductionPlan()">确认</span>
          <span class="btn backHoverOrange"
            @click="saveProductionPlan(true)">确认并打印</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="materialSupplementFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">补充物料填写</span>
          <div class="closeCtn"
            @click="materialSupplementFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">补物料单位</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input disabled
                    placeholder="默认为加工单位"
                    v-model="materialSupplementInfo.client_name"></el-input>
                </div>
              </div>
              <div class="col"></div>
              <div class="col"></div>
            </div>
            <div class="row"
              v-for="(item,index) in materialSupplementInfo.client_data"
              :key="index+'client_data'">
              <div class="col">
                <div class="label"
                  v-if="index===0">
                  <span class="text">承担单位</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select placeholder="请选择承担单位"
                    v-model="item.bear_client_id"
                    :class="{'error':mustFlag&&!item.bear_client_id}">
                    <el-option :value="materialSupplementInfo.client_id"
                      :label="materialSupplementInfo.client_name"></el-option>
                    <el-option :value="-1"
                      label="本厂"></el-option>
                    <el-option v-for="item in bearClientArr"
                      :key="item.client_id"
                      :value="item.client_id"
                      :label="item.client_name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="index===0">
                  <span class="text">承担金额</span>
                  <span class="explanation">(不填默认为0)</span>
                </div>
                <div class="info elCtn">
                  <el-input :ref="'bear_price'+ '-'+index"
                    placeholder="请输入承担金额"
                    v-model="item.bear_price"
                    @keydown.native="$focusByKeydown($event,'bear_price',[index],materialSupplementInfo,['client_data'])">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="index===0"
                @click="$addItem(materialSupplementInfo.client_data, {
                  bear_client_id:'',
                  bear_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-if="index>0"
                @click="$deleteItem(materialSupplementInfo.client_data, index)">删除</div>
              <div class="col"></div>
            </div>
            <div class="row"
              v-for="(item,index) in materialSupplementInfo.info_data"
              :key="index + 'info_data'">
              <div class="col">
                <div class="label"
                  v-show="index===0">
                  <span class="text">物料名称/颜色</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select :class="{'error':mustFlag&&!item.tree_data}"
                    v-model="item.tree_data"
                    placeholder="请选择物料名称/颜色"
                    @change="getMatId($event,item)">
                    <el-option v-for="item in materialSupplementSelect"
                      :key="item.material_id + 'dkr' + item.material_color + 'dkr' + (item.unit || 'kg')"
                      :label="item.material_name + '/' + item.material_color"
                      :value="item.material_id + 'dkr' + item.material_color + 'dkr'+ (item.unit || 'kg')"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col"
                style="max-width:322px">
                <div class="label"
                  v-show="index===0">
                  <span class="text">物料数量</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="info elCtn UnitCtn">
                  <el-input :class="{'error':mustFlag&&!item.number}"
                    placeholder="请输入物料数量"
                    v-model="item.number">
                    <template slot="append">
                      <el-input v-model="item.unit"
                        placeholder="单位"></el-input>
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="index===0"
                @click="$addItem(materialSupplementInfo.info_data, {
                  id: '',
                  material_id: '',
                  material_color: '',
                  material_type: 1,
                  number: '',
                  tree_data:''
                })">添加</div>
              <div class="opr hoverRed"
                v-if="index>0"
                @click="$deleteItem(materialSupplementInfo.info_data, index)">删除</div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">备注信息</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-autocomplete class="once"
                    v-model="materialSupplementInfo.desc"
                    :fetch-suggestions="searchReason"
                    placeholder="原因填写"></el-autocomplete>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="materialSupplementFlag = false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialSupplement">确认</span>
        </div>
      </div>
    </div>
    <!-- 拆分单据 -->
    <div class="popup"
      v-if="dividePlanFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">生产计划拆分</span>
          <div class="closeCtn"
            @click="dividePlanFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="stepCtn">
            <div class="step"
              :class="{'active':!materialDivideFlag}">
              <div class="circle">
                <span class="white">1</span>
              </div>
              <div class="name">排产信息</div>
            </div>
            <div class="step"
              :class="{'active':materialDivideFlag}">
              <div class="circle">
                <span class="white">2</span>
              </div>
              <div class="name">原料信息</div>
            </div>
          </div>
          <template v-if="!materialDivideFlag">
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">原分配单位</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input disabled
                      placeholder="默认为加工单位"
                      v-model="productionDivideInfo[0].client_name"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">原分配单位</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input disabled
                      placeholder="默认为加工单位"
                      v-model="productionDivideInfo[0].process_name"></el-input>
                  </div>
                </div>
                <div class="col"></div>
              </div>
            </div>
            <div class="editCtn"
              v-for="(item,index) in productionDivideInfo.slice(1)"
              :key="index">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">加工单位</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader :class="{'error':mustFlag&&orderInfo.client_id_arr.length===0}"
                      placeholder="请选择加工单位"
                      v-model="item.client_id_arr"
                      :options="processClientList"
                      @change="(ev)=>{item.client_id=ev[2]}"
                      filterable></el-cascader>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">加工工序</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="item.process_name"
                      disabled></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label">
                        <span class="text">订购时间</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-date-picker :class="{'error':mustFlag&&!item.start_time}"
                          style="width:100%"
                          placeholder="请选择时间"
                          value-format="yyyy-MM-dd"
                          v-model="item.start_time"></el-date-picker>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label">
                        <span class="text">交货日期</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-date-picker :class="{'error':mustFlag&&!item.end_time}"
                          style="width:100%"
                          placeholder="请选择交货日期"
                          value-format="yyyy-MM-dd"
                          v-model="item.end_time"></el-date-picker>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row"
                v-for="(itemPro,indexPro) in item.product_info_data"
                :key="'pro'+ indexPro">
                <div class="col">
                  <div class="label"
                    v-if="indexPro===0">
                    <span class="text">产品信息</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择产品信息"
                      v-model="itemPro.select_arr"
                      @change="getProInfo($event,itemPro)"
                      :class="{'error':mustFlag&&!itemPro.select_arr}">
                      <el-option v-for="(item,index) in productionDivideInfo[0].product_info_data"
                        :key="index"
                        :value="item.product_id+'/'+ item.part_id+'/'+item.size_id+'/'+ item.color_id"
                        :label="item.size_name?(item.name||item.product_code||item.system_code)+'/'+ item.part_name+'/'+item.size_name+'/'+ item.color_name:(item.name||item.product_code||item.system_code)+'/'+ item.part_name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="indexPro===0">
                        <span class="text">单价</span>
                        <span class="explanation">(必填)</span>
                      </div>
                      <div class="info elCtn">
                        <el-input :class="{'error':mustFlag&&!itemPro.price}"
                          v-model="itemPro.price"
                          placeholder="请输入单价"
                          @input="(ev)=>{itemPro.total_price=Number(ev)*Number(itemPro.number)}">
                          <template slot="append">元</template>
                        </el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="indexPro===0">
                        <span class="text">数量</span>
                        <span class="explanation">(必填)</span>
                      </div>
                      <div class="info elCtn">
                        <el-input :class="{'error':mustFlag&&!itemPro.number}"
                          v-model="itemPro.number"
                          @input="(ev)=>{itemPro.total_price=$toFixed(Number(ev)*Number(itemPro.price))}"
                          placeholder="请输入数量">
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexPro===0">
                    <span class="text">合计总价</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemPro.total_price"
                      placeholder="默认"
                      disabled>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverRed"
                  @click="item.product_info_data.length>1?$deleteItem(item.product_info_data,indexPro):$deleteItem(productionDivideInfo,index)">删除</div>
              </div>
              <div class="row"
                v-for="(itemOther,indexOther) in item.others_fee_data"
                :key="'other'+indexOther">
                <div class="col">
                  <div class="label"
                    v-if="indexOther===0">
                    <span class="text">额外费用名称</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入额外费用名称"
                      v-model="itemOther.name"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexOther===0">
                    <span class="text">额外费用金额</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入额外费用金额"
                      v-model="itemOther.price">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexOther===0">
                    <span class="text">额外费用备注</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入额外费用备注"
                      v-model="itemOther.desc"></el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexOther===0"
                  @click="$addItem(item.others_fee_data,{
                  desc: '',
                  name: '',
                  price: ''
                })">添加</div>
                <div class="opr hoverRed"
                  v-if="indexOther>0"
                  @click="$deleteItem(item.others_fee_data,indexOther)">删除</div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">备注信息</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入备注信息"
                      v-model="item.desc"></el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn backHoverBlue"
              style="margin-bottom:16px"
              @click="addDivideClient">添加分配单位</div>
          </template>
          <template v-else>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">单位名称</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcol">物料名称</div>
                      <div class="tcol">物料颜色</div>
                      <div class="tcol">所需数量</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in productionDivideInfo"
                  :key="index">
                  <div class="tcol">
                    <span>{{item.client_name||'未选择单位'}}</span>
                    <span class="green">({{item.process_name}})</span>
                  </div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="gray trow"
                      v-if="item.material_info_data.length===0">
                      <div class="tcol">
                        <span class="gray">该工序未分配任何物料</span>
                      </div>
                    </div>
                    <div class="trow"
                      v-for="(itemMat,indexMat) in item.material_info_data"
                      :key="indexMat">
                      <div class="tcol">{{itemMat.material_name}}</div>
                      <div class="tcol">{{itemMat.material_color}}</div>
                      <div class="tcol">{{itemMat.number}}{{itemMat.unit}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="dividePlanFlag = false">取消</span>
          <span class="btn backHoverOrange"
            @click="materialDivideFlag?materialDivideFlag=false:getDivideMaterialInfo(true)">{{materialDivideFlag?'查看排产信息':'查看物料分配'}}</span>
          <span class="btn backHoverBlue"
            @click="saveDivideProductionPlan">确认重新分配</span>
        </div>
      </div>
    </div>
    <!-- 修改单据 -->
    <div class="popup"
      v-if="updateFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">生产计划单修改</span>
          <div class="closeCtn"
            @click="updateFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">加工单位</span>
                  <span class="explanation">(必选)</span>
                  <el-tooltip class="item"
                    effect="dark"
                    content="设置成功后请点击此按钮刷新数据"
                    placement="top">
                    <i class="el-icon-refresh hoverGreen fr"
                      style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                      @click="$checkCommonInfo([{
                        checkWhich: 'api/clientType',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getClientTypeAsync',
                        forceUpdate:true
                      }])"></i>
                  </el-tooltip>
                  <el-tooltip class="item"
                    effect="dark"
                    content="添加新单位"
                    placement="top">
                    <i class="el-icon-upload hoverOrange fr"
                      style="line-height:38px;font-size:18px;cursor:pointer;"
                      @click="$openUrl('/client/create?type=2')"></i>
                  </el-tooltip>
                </div>
                <div class="info elCtn">
                  <el-cascader placeholder="请选择加工单位"
                    v-model="productionPlanUpdateInfo.client_id_arr"
                    :options="processClientList"
                    @change="(ev)=>{productionPlanUpdateInfo.client_id=ev[2]}"
                    filterable></el-cascader>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">加工工序</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="productionPlanUpdateInfo.process_name"
                    placeholder="加工工序"
                    disabled></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">工序说明</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="productionPlanUpdateInfo.process_desc"
                    placeholder="工序说明"></el-input>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemPro,indexPro) in productionPlanUpdateInfo.product_info_data"
              :key="'pro'+ indexPro">
              <div class="col">
                <div class="label"
                  v-if="indexPro===0">
                  <span class="text">产品信息</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input disabled
                    v-model="itemPro.product_code"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="spaceBetween">
                  <div class="once">
                    <div class="label"
                      v-if="indexPro===0">
                      <span class="text">单价</span>
                      <span class="explanation">(必填)</span>
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一单价"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="$copyInfo(productionPlanUpdateInfo.product_info_data,['price'])">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="info elCtn">
                      <el-input v-model="itemPro.price"
                        placeholder="请输入单价"
                        :ref="'price'+'-'+indexPro"
                        @keydown.native="$focusByKeydown($event,'price',[indexPro],productionPlanUpdateInfo,['product_info_data'])"
                        @focus="$focusInput($event)"
                        @input="(ev)=>{itemPro.total_price=$toFixed(Number(ev)*Number(itemPro.number))}">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="once">
                    <div class="label"
                      v-if="indexPro===0">
                      <span class="text">数量</span>
                      <span class="explanation">(默认)</span>
                    </div>
                    <div class="info elCtn">
                      <el-input disabled
                        v-model="itemPro.number"
                        @input="(ev)=>{itemPro.total_price=$toFixed(Number(ev)*Number(itemPro.price))}"
                        placeholder="请输入数量">
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexPro===0">
                  <span class="text">合计总价</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemPro.total_price"
                    placeholder="默认"
                    disabled>
                  </el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">订购时间</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    placeholder="请选择时间"
                    value-format="yyyy-MM-dd"
                    v-model="productionPlanUpdateInfo.start_time"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">交货日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    placeholder="请选择交货日期"
                    value-format="yyyy-MM-dd"
                    v-model="productionPlanUpdateInfo.end_time"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入备注信息"
                    @focus="$focusInput($event)"
                    v-model="productionPlanUpdateInfo.desc"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="updateFlag = false">取消</span>
          <span class="btn backHoverOrange"
            @click="updateProductionPlan">修改</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <!-- 报价单表格 -->
        <div class="priceCtn fl">
          <div class="btn"
            :class="{'backHoverBlue':priceProcessList.length>0,'backGray':priceProcessList.length===0}"
            @click="showPrice=!showPrice">{{priceProcessList.length>0?(showPrice?'关闭报价':'查看报价'):'暂无报价'}}</div>
          <div class="priceTable"
            v-show="showPrice && priceProcessList.length>0">
            <div class="module">
              <div class="titleCtn">
                <div class="title">报价信息</div>
              </div>
              <div class="contentCtn">
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">产品信息</div>
                      <div class="tcol noPad"
                        style="flex:4">
                        <div class="trow">
                          <div class="tcol">加工类型</div>
                          <div class="tcol">加工工序</div>
                          <div class="tcol">备注信息</div>
                          <div class="tcol">单价</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="(item,index) in priceProcessList"
                      :key="index">
                      <div class="tcol">{{item.productInfo}}</div>
                      <div class="tcol noPad"
                        style="flex:4">
                        <div class="trow"
                          v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                          :key="indexChild">
                          <div class="tcol">{{itemChild.type}}</div>
                          <div class="tcol">{{itemChild.process}}</div>
                          <div class="tcol">{{itemChild.desc}}</div>
                          <div class="tcol">{{itemChild.price}}元</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn"
          style="float:left">
          <div class="btn backHoverGreen"
            @click="showAssociatedPage=true">
            <span class="text">关联页面</span>
          </div>
        </div>
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
    <!-- 扣款 -->
    <zh-deduct :show="deductFlag"
      @close="deductFlag = false;init()"
      :type="deductInfo.type"
      :data="[{id:deductInfo.doc_id,code:deductInfo.doc_code}]"
      :order_id="$route.query.id"
      :client_id="deductInfo.client_id"
      :client_name="deductInfo.client_name"></zh-deduct>
    <zh-deduct-detail :show="deductDetailFlag"
      @close="deductDetailFlag = false"
      :data="deductDetail"></zh-deduct-detail>
    <!-- 结余入库 -->
    <store-surplus @afterSave="storeSurplusFlag=false;init()"
      @close="storeSurplusFlag=false"
      :materialList="storeSurplusInfo.materialList"
      :orderId="storeSurplusInfo.order_id"
      :orderCode="storeSurplusInfo.order_code"
      :show="storeSurplusFlag"></store-surplus>
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{checkType===9?(materialPlanInfo.find((item)=>Number(item.id)===Number(materialPlanIndex)).is_check=ev):(productionPlanList.find((item)=>Number(item.id)===Number(productionPlanIndex)).is_check=ev)}"
      :show="checkFlag"
      :pid="checkType===9?materialPlanIndex:productionPlanIndex"
      :check_type="checkType"
      :reason="[]"></zh-check>
    <zh-check-detail :pid="checkType===9?materialPlanIndex:productionPlanIndex"
      :check_type="checkType"
      :show="checkDetailFlag"
      @close="checkDetailFlag=false"
      :is_check="is_check"
      :errMsg="is_check===3?[
        '由于【计划单生产以及原料数量】发生了修改。该生产计划单已变为异常状态。以下为异常单据处理办法：',
        '1. 修改此生产计划单，同步最新的生产以及原料分配数量。注意：已计划的产品不能删除，但可以将数量改为0。实际已入库的产品，可以在检验收发页面进行结余操作。',
        '2. 如果该单据没有后续检验入库单，您也可以删除该单据再新建一张。',
        '3. 如果您不想修改生产计划单，您也可以直接点击审核通过，并新建一张生产计划单，以补充新的生产数量。',]:[
        '由于【分配数量】超过了【计划数量】的10%。该生产计划单已变为异常状态。以下为异常单据处理办法：',
        '1. 检查分配数量。如果分配数量录入错误，您可以修改单据，或删除重新创建。',
        '2. 如果录入的数量为实际分配数量，则无需操作，或点击审核通过即可。']
      "></zh-check-detail>
    <associated-page :data="associatedPage"
      @close="showAssociatedPage = false"
      :nowPage="true"
      :show="showAssociatedPage"></associated-page>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  materialPlan,
  order,
  productionPlan,
  materialSupplement,
  clientInOrder,
  quotedPrice,
  checkBeyond
} from '@/assets/js/api'
import { ProductionMaterialPlanInfo, ProductionPlanInfo } from '@/types/productionPlan'
import { MaterialPlanInfo, MaterailPlanData } from '@/types/materialPlan'
import { MaterialSupplementInfo } from '@/types/materialSupplement'
import { CascaderInfo } from '@/types/vuex'
import { OrderInfo, OrderTime } from '@/types/order'
import { QuotedPriceInfo } from '@/types/quotedPrice'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  data(): {
    materialPlanList: MaterialPlanInfo[]
    productionPlanInfo: ProductionPlanInfo[]
    productionPlanUpdateInfo: ProductionPlanInfo
    productionDivideInfo: ProductionPlanInfo[]
    productionPlanList: ProductionPlanInfo[]
    materialSupplementInfo: MaterialSupplementInfo
    orderInfo: OrderDetail
    [propName: string]: any
  } {
    return {
      loading: true,
      saveLock: false,
      checkFlag: false,
      is_check: 0,
      checkDetailFlag: false,
      checkType: 9,
      storeSurplusFlag: false,
      mustFlag: false,
      storeSurplusInfo: {
        materialList: [],
        order_id: '',
        order_code: ''
      },
      updateFlag: false,
      deductFlag: false,
      deductDetailFlag: false,
      deductDetail: [],
      deductInfo: {
        client_id: '',
        client_name: '',
        doc_id: '',
        doc_code: '',
        type: 2
      },
      order_id: 0,
      orderIndex: '0',
      orderInfo: {
        id: null,
        client_id: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '',
        settle_unit: '',
        order_type: 1,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: this.$getDate(new Date()),
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
            is_before_confirm: 2,
            is_send: 2,
            batch_data: [
              {
                id: '',
                batch_number: 1,
                batch_title: '',
                batch_type_id: '',
                delivery_time: '',
                is_urgent: 2,
                is_draft: 2,
                total_style: '',
                total_number: '',
                total_price: '',
                desc: '',
                product_data: [
                  {
                    product_id: '',
                    size_color_list: [],
                    product_info: [
                      {
                        size_color: '',
                        size_id: '',
                        color_id: '',
                        number: '',
                        price: ''
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      materialPlanList: [],
      materialPlanIndex: '0',
      materialPlanDetail: {
        created_at: '',
        order_id: '',
        type: '1', // 1、按颜色尺码 2.按产品
        desc: '',
        is_draft: 2,
        production_plan_data: [
          {
            product_id: '',
            part_data: [],
            product_data: [
              {
                material_info: [],
                size_color: [],
                color_id: '',
                size_id: '',
                add_percent: '',
                order_number: '',
                info_data: [
                  {
                    part_id: '',
                    number: ''
                  }
                ]
              }
            ]
          }
        ],
        material_plan_data: [],
        material_plan_gather_data: []
      },
      productionPlanFlag: false,
      materialPlanFlag: false,
      materialDivideFlag: false,
      dividePlanFlag: false,
      checkAllColorSize: false,
      checkAllPro: false,
      productionPlanInfo: [
        {
          process_desc: '',
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
          others_fee_data: [
            {
              name: '',
              price: '',
              desc: ''
            }
          ]
        }
      ],
      productionPlanUpdateInfo: {
        process_desc: '',
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
        others_fee_data: [
          {
            name: '',
            price: '',
            desc: ''
          }
        ]
      },
      productionPlanList: [],
      productionPlanIndex: '0',
      materialSupplementFlag: false,
      materialSupplementSelect: [], // 可补的纱线
      materialSupplementInfo: {
        order_id: '',
        rel_doc_id: '',
        client_id: '',
        client_name: '',
        client_data: [
          {
            bear_client_id: '',
            bear_price: ''
          }
        ],
        desc: '',
        info_data: [
          {
            id: '',
            tree_data: '',
            material_id: '',
            material_color: '',
            material_type: 1,
            number: '',
            unit: ''
          }
        ]
      },
      productionDivideInfo: [],
      bearClientArr: [], // 所有的相关承担单位，包括纱线订购厂，加工厂之类的
      showPrice: false,
      orderProcess: {
        label: '推荐工序',
        value: '推荐工序',
        children: []
      },
      showAssociatedPage: false,
      associatedPage: [
        {
          name: '原料计划',
          url: '/materialPlan/detail?id=' + this.$route.query.id
        }
      ],
      priceProcessList: [] // 报价单报价信息
    }
  },
  computed: {
    processClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter(
        (item: { label: string }) => item.label === '生产织造单位' || item.label === '生产加工单位'
      )
    },
    processList(): any[] {
      const normalProcessList = [
        {
          label: '织造工序',
          value: '织造工序',
          children: [
            { label: '针织织造', value: '针织织造', process_desc: '' },
            { label: '梭织织造', value: '梭织织造', process_desc: '' },
            { label: '制版费', value: '制版费', process_desc: '' }
          ]
        },
        {
          label: '成品加工工序',
          value: '成品加工工序',
          children: this.$store.state.api.staffProcess.arr.map((item: any) => {
            return {
              label: item.name,
              value: item.name,
              process_desc: item.process_desc
            }
          })
        },
        {
          label: '半成品加工工序',
          value: '半成品加工工序',
          children: this.$store.state.api.halfProcess.arr.map((item: any) => {
            return {
              label: item.name,
              value: item.name,
              process_desc: item.process_desc
            }
          })
        }
      ]
      return this.orderProcess.children.length > 0 ? [this.orderProcess].concat(normalProcessList) : normalProcessList
    },
    // 被选中的产品的物料信息展开
    checkMaterialFlattenList(): any[] {
      // 由于process_name_arr是数组，展开的时候多展开一层，所以去掉process_name_arr
      let checkListToChange = this.$clone(this.checkList())
      checkListToChange.forEach((item) => {
        item.info_data.forEach((itemChild) => {
          delete itemChild.process_name_arr
        })
      })
      return this.$flatten(this.$flatten(checkListToChange))
    },
    totalPlanNumberList(): string[] {
      return this.productionPlanInfo.map((item) => {
        return item.product_info_data
          .reduce((total, current) => {
            return total + Number(current.number)
          }, 0)
          .toFixed(2)
      })
    },
    totalPlanPriceList(): string[] {
      return this.productionPlanInfo.map((item) => {
        return (
          item.product_info_data.reduce((total, current) => {
            return total + Number(current.number) * Number(current.price)
          }, 0) +
          item.others_fee_data.reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        ).toFixed(2)
      })
    },
    yarnColorList() {
      return this.$store.state.api.yarnColor.arr.map((item: { name: any }) => {
        return {
          value: item.name,
          label: item.name
        }
      })
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        materialPlan.list({
          order_id: this.order_id
        }),
        productionPlan.list({
          order_id: this.order_id
        })
      ]).then((res) => {
        this.loading = false
        this.materialPlanList = res[0].data.data
        if (this.materialPlanList.length > 0) {
          this.materialPlanIndex = this.materialPlanList[0].id?.toString()
          this.getMaterialPlanDetail(this.materialPlanIndex)
        } else {
          this.$message.warning('该订单还未创建物料计划单,请填写计划单信息')
          this.$router.push('/materialPlan/create?id=' + this.$route.query.id)
        }
        this.productionPlanList = res[1].data.data
        if (this.productionPlanList.length > 0) {
          this.productionPlanIndex = this.productionPlanList[0].id?.toString()
        }
      })
    },
    searchReason(str: string, cb: any) {
      const reasonArr = [
        {
          value: '本厂工艺问题'
        },
        {
          value: '纱线数量问题'
        },
        {
          value: '纱线质量问题'
        },
        {
          value: '纱线颜色问题'
        },
        {
          value: '条数多织'
        },
        {
          value: '次品重织'
        },
        {
          value: '其他原因'
        }
      ]
      let results = str
        ? reasonArr.filter((info: any) => {
            info.value.toLowerCase().indexOf(str.toLowerCase()) === 0
          })
        : reasonArr
      cb(results)
    },
    getProInfo(ev: string, info: any) {
      const idArr = ev.split(',')
      info.product_id = Number(idArr[0])
      info.part_id = Number(idArr[1])
      info.size_id = Number(idArr[2])
      info.color_id = Number(idArr[3])
      // info.plan_id = Number(idArr[4])
      info.plan_id = this.materialPlanIndex
    },
    getProductionPlan() {
      const checkLength = this.checkList().length
      if (checkLength === 0) {
        this.$message.error('请选择产品信息进行加工操作')
        return
      }
      this.productionPlanInfo[0].product_info_data = this.checkList().map((item) => {
        return {
          // plan_id: item.id,
          plan_id: Number(this.materialPlanIndex),
          product_id: item.product_id,
          size_id: item.size_id,
          color_id: item.color_id,
          part_id: item.part_id,
          number: item.number as number,
          price: '',
          total_price: '',
          select_arr: item.product_id + '/' + item.part_id + '/' + item.size_id + '/' + item.color_id + '/' + item.id
        }
      })
      this.productionPlanFlag = true
    },
    // 根据加工单选的信息计算物料信息
    getMaterialInfo(ifShow: boolean = false) {
      console.log(this.productionPlanInfo)
      // 填写方式
      const edit_type = this.materialPlanList.find((item) => Number(item.id) === Number(this.materialPlanIndex))?.type
      this.productionPlanInfo.forEach((item) => {
        // 获取单位名称————展示用
        this.processClientList.forEach((item1) => {
          item1.children?.forEach((item2) => {
            item2.children?.forEach((item3) => {
              if (item3.value === item.client_id) {
                item.client_name = item3.label
              }
            })
          })
        })
        item.material_info_data = []
        item.product_info_data.forEach((itemChild) => {
          const matList = this.checkMaterialFlattenList.filter((itemFind) => {
            if (edit_type === 1) {
              // 物料计划单按照尺码颜色匹配
              return (
                itemFind.process_name === item.process_name &&
                itemFind.product_id === itemChild.product_id &&
                itemFind.part_id === itemChild.part_id &&
                itemFind.color_id === itemChild.color_id &&
                itemFind.size_id === itemChild.size_id
              )
            } else {
              // 按照产品id匹配
              return (
                itemFind.process_name === item.process_name &&
                itemFind.product_id === itemChild.product_id &&
                itemFind.part_id === itemChild.part_id
              )
            }
          })
          item.material_info_data = item.material_info_data.concat(
            matList.map((itemMat) => {
              return {
                material_id: itemMat.material_id,
                material_name: itemMat.material_name,
                material_color: itemMat.material_color,
                number: this.$toFixed((itemMat.final_number / itemMat.number) * Number(itemChild.number)),
                unit: itemMat.unit
              }
            })
          )
        })
      })
      this.productionPlanInfo.forEach((itemMerge) => {
        itemMerge.material_info_data = this.$mergeData(itemMerge.material_info_data, {
          mainRule: ['material_id', 'material_color'],
          otherRule: [{ name: 'number', type: 'add' }, { name: 'material_name' }, { name: 'unit' }]
        }).map((itemMat: any) => {
          return {
            material_id: itemMat.material_id,
            material_name: itemMat.material_name,
            material_color: itemMat.material_color,
            unit: itemMat.unit,
            number: itemMat.number
          }
        })
      })
      this.materialPlanFlag = ifShow
    },
    getCmpData() {
      const finded = this.materialPlanList.find((item) => Number(item.id) === Number(this.materialPlanIndex))
      const edit_type = finded!.type
      this.productionPlanInfo.forEach((item, index) => {
        item.plan_id = this.materialPlanIndex
        item.order_id = this.order_id
        item.total_price = this.totalPlanPriceList[index]
        item.total_number = this.totalPlanNumberList[index]
        // 按产品款式填的自动补充所有尺码配色
        if (edit_type === 2) {
          let colorSizeInfo: any[] = []
          item.product_info_data.forEach((itemPro) => {
            const findPlanPro = finded!.production_plan_data.find(
              (itemFind) => itemFind.product_id === itemPro.product_id
            )
            // 这一步单纯是为了展开函数不能有两个number，把后台给的无用number给去掉
            findPlanPro!.product_data.forEach((itemChild) => {
              delete itemChild.number
            })
            // 把计划单信息按照尺码配色全部展开
            const allColorSizeInfo = this.$flatten(this.$flatten(findPlanPro!.product_data))
            colorSizeInfo = colorSizeInfo.concat(
              allColorSizeInfo
                .filter((item) => item.part_id === itemPro.part_id)
                .map((itemReal) => {
                  return {
                    product_id: itemPro.product_id,
                    size_id: itemReal.size_id,
                    color_id: itemReal.color_id,
                    part_id: itemPro.part_id,
                    number: itemReal.number,
                    price: itemPro.price,
                    total_price: itemPro.total_price,
                    select_arr: itemPro.select_arr
                  }
                })
            )
          })
          item.product_info_data = colorSizeInfo
        }
      })
    },
    saveProductionPlan(ifprint?: boolean) {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      const formcheck = this.productionPlanInfo.some((item) => {
        return (
          this.$formCheck(item, [
            {
              key: 'client_id',
              errMsg: '请选择加工单位'
            },
            {
              key: 'process_name',
              errMsg: '请选择加工工序'
            },
            {
              key: 'start_time',
              errMsg: '请选择订购日期'
            },
            {
              key: 'end_time',
              errMsg: '请选择交货日期'
            }
          ]) ||
          item.product_info_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
              {
                key: 'select_arr',
                errMsg: '请选择产品信息'
              },
              {
                key: 'price',
                errMsg: '请输入加工单价'
              },
              {
                key: 'number',
                errMsg: '请输入加工数量'
              }
            ])
          })
        )
      })
      if (!formcheck) {
        // 获取物料信息
        this.getMaterialInfo()
        this.getCmpData()
        const checkArr: any[] = []
        this.productionPlanInfo.forEach((item) => {
          item.product_info_data.forEach((itemChild) => {
            checkArr.push({
              process_name: item.process_name,
              plan_id: itemChild.plan_id,
              part_id: itemChild.part_id,
              product_id: itemChild.product_id,
              size_id: itemChild.size_id,
              color_id: itemChild.color_id,
              number: itemChild.number
            })
          })
        })
        checkBeyond({
          doc_type: 4,
          data: checkArr
        }).then((res) => {
          if (res.data.data.length === 0) {
            this.saveProductionPlanFn(ifprint)
          } else {
            const createHtml = this.$createElement
            this.$msgbox({
              message: createHtml(
                'p',
                undefined,
                res.data.data.map((item: string) => {
                  return createHtml('p', undefined, item)
                })
              ),
              title: '提示',
              showCancelButton: true,
              confirmButtonText: '继续提交',
              cancelButtonText: '取消提交',
              type: 'warning'
            })
              .then(() => {
                this.productionPlanInfo.forEach((item) => (item.is_check = 4))
                this.saveProductionPlanFn(ifprint)
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消提交'
                })
              })
          }
        })
      } else {
        this.mustFlag = true
      }
    },
    saveProductionPlanFn(ifprint?: boolean) {
      this.saveLock = true
      this.loading = true
      productionPlan
        .create({
          data: this.productionPlanInfo
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.productionPlanFlag = false
            this.loading = false
            this.init()
            if (ifprint) {
              this.$openUrl('/productionPlan/print?id=' + res.data.data + '&order_id=' + this.$route.query.id)
            }
          }
          this.mustFlag = false
          this.saveLock = false
        })
    },
    goUpdate(info: ProductionPlanInfo) {
      this.productionPlanUpdateInfo = this.$clone(info)
      // 获取单位名称————展示用
      this.processClientList.forEach((item1) => {
        item1.children?.forEach((item2) => {
          item2.children?.forEach((item3) => {
            if (item3.value === this.productionPlanUpdateInfo.client_id) {
              // @ts-ignore
              this.productionPlanUpdateInfo.client_id_arr = [item1.value, item2.value, item3.value]
            }
          })
        })
      })
      this.updateFlag = true
    },
    updateProductionPlan() {
      this.loading = true
      productionPlan.update(this.productionPlanUpdateInfo).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          this.updateFlag = false
          this.loading = false
          this.init()
        }
      })
    },
    deleteProductionPlan(id: number) {
      this.$confirm('是否删除该加工单据?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          productionPlan
            .delete({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('删除成功')
                this.init()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 原料颜色搜索
    searchColor(str: string, cb: any) {
      let results = str ? this.yarnColorList.filter(this.createFilter(str)) : this.yarnColorList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    getMatId(str: string, info: any) {
      const realVal = str.split('dkr')
      console.log(realVal)
      info.material_id = realVal[0]
      info.material_color = realVal[1]
      info.unit = realVal[2] || 'kg'
    },
    // 补纱逻辑
    goMaterialSupplement(info: ProductionPlanInfo) {
      this.materialSupplementFlag = true
      this.materialSupplementInfo.order_id = this.order_id
      this.materialSupplementInfo.client_id = info.client_id
      this.materialSupplementInfo.rel_doc_id = info.id as number
      this.materialSupplementInfo.client_name = info.client_name
      this.materialSupplementSelect = info.material_info_data
    },
    saveMaterialSupplement() {
      const formCheck =
        this.materialSupplementInfo.client_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'bear_client_id',
              errMsg: '请选择承担单位'
            }
          ])
        }) ||
        this.materialSupplementInfo.info_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'material_id',
              errMsg: '请选择物料名称'
            },
            {
              key: 'material_color',
              errMsg: '请输入物料颜色'
            },
            {
              key: 'number',
              errMsg: '请输入物料数量'
            }
          ])
        })
      if (!formCheck) {
        this.loading = true
        materialSupplement.create(this.materialSupplementInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.materialSupplementFlag = false
            this.init()
          }
          this.loading = false
          this.mustFlag = false
        })
      } else {
        this.mustFlag = true
      }
    },
    deleteMaterialSupplement(id: number) {
      this.$confirm('是否删除该补纱单据?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialSupplement
            .delete({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('删除成功')
                this.init()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 扣款
    goDeduct(info: any, type: 2 | 3) {
      this.deductInfo.client_id = info.client_id
      this.deductInfo.client_name = info.client_name
      this.deductInfo.doc_id = info.id
      this.deductInfo.doc_code = info.code
      this.deductInfo.type = type
      this.deductFlag = true
    },
    getDeduct(info: any[]) {
      if (!info || info.length === 0) {
        this.$message.warning('暂无扣款信息')
      } else {
        this.deductDetail = info
        this.deductDetailFlag = true
      }
    },
    // 拆单子
    divideProductionPlan(info: ProductionPlanInfo) {
      this.productionDivideInfo = [this.$clone(info)]
      this.addDivideClient()
      this.dividePlanFlag = true
    },
    // 拆分单据新增加工单位
    addDivideClient() {
      this.productionDivideInfo.push(this.$clone(this.productionDivideInfo[0]))
      const index = this.productionDivideInfo.length - 1
      this.productionDivideInfo[index].total_number = 0
      this.productionDivideInfo[index].client_id_arr = []
      this.productionDivideInfo[index].client_id = ''
      this.productionDivideInfo[index].id = ''
      this.productionDivideInfo[index].total_number = ''
      this.productionDivideInfo[index].product_info_data.forEach((item) => {
        item.total_price = ''
        item.number = ''
        item.select_arr = item.product_id + '/' + item.part_id + '/' + item.size_id + '/' + item.color_id
      })
      this.productionDivideInfo[index].start_time = this.$getDate(new Date())
    },
    // 拆分单子计算物料，类似于getMaterialInfo，不想把逻辑搞更复杂，再写一个专用的
    getDivideMaterialInfo(ifShow: boolean = false) {
      let checkListToChange = this.$clone(
        this.materialPlanList.find((item) => Number(item.id) === Number(this.materialPlanIndex))
      )!.material_plan_data
      checkListToChange.forEach((item) => {
        item.info_data.forEach((itemChild) => {
          delete itemChild.process_name_arr
        })
      })
      const checkMaterialFlattenList = this.$flatten(this.$flatten(checkListToChange))
      this.productionDivideInfo.forEach((item) => {
        // 获取单位名称————展示用
        this.processClientList.forEach((item1) => {
          item1.children?.forEach((item2) => {
            item2.children?.forEach((item3) => {
              if (item3.value === item.client_id) {
                item.client_name = item3.label
              }
            })
          })
        })
        item.material_info_data = []
        item.product_info_data.forEach((itemChild) => {
          const matList = checkMaterialFlattenList.filter((itemFind) => {
            return (
              itemFind.process_name === item.process_name &&
              itemFind.product_id === itemChild.product_id &&
              itemFind.part_id === itemChild.part_id &&
              itemFind.color_name === itemChild.color_name &&
              itemFind.size_name === itemChild.size_name
            )
          })
          item.material_info_data = item.material_info_data.concat(
            matList.map((itemMat) => {
              return {
                material_id: itemMat.material_id,
                material_name: itemMat.material_name,
                material_color: itemMat.material_color,
                number: this.$toFixed((itemMat.final_number / itemMat.number) * Number(itemChild.number)),
                unit: itemMat.unit
              }
            })
          )
        })
      })
      this.productionDivideInfo.forEach((itemMerge) => {
        itemMerge.material_info_data = this.$mergeData(itemMerge.material_info_data, {
          mainRule: ['material_id', 'material_color'],
          otherRule: [{ name: 'number', type: 'add' }, { name: 'material_name' }, { name: 'unit' }]
        }).map((itemMat: any) => {
          return {
            material_id: itemMat.material_id,
            material_name: itemMat.material_name,
            material_color: itemMat.material_color,
            unit: itemMat.unit,
            number: itemMat.number
          }
        })
      })
      this.materialDivideFlag = ifShow
    },
    saveDivideProductionPlan() {
      const formcheck = this.productionDivideInfo.some((item) => {
        return (
          this.$formCheck(item, [
            {
              key: 'client_id',
              errMsg: '请选择加工单位'
            }
          ]) ||
          item.product_info_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
              {
                key: 'product_id',
                errMsg: '请选择产品信息'
              },
              {
                key: 'price',
                errMsg: '请输入分配单价'
              },
              {
                key: 'number',
                errMsg: '请输入分配数量'
              }
            ])
          })
        )
      })
      if (!formcheck) {
        let errMsg = ''
        this.productionDivideInfo.forEach((item, index) => {
          if (index === 0) {
            item.product_info_data.forEach((itemChild) => {
              this.productionDivideInfo.slice(1).forEach((itemFind) => {
                itemFind.product_info_data.forEach((itemSon) => {
                  if (
                    itemSon.product_id === itemChild.product_id &&
                    itemSon.size_name === itemChild.size_name &&
                    itemSon.color_name === itemChild.color_name &&
                    itemSon.part_id === itemChild.part_id
                  ) {
                    itemChild.number = Number(itemChild.number) - Number(itemSon.number)
                    if (itemChild.number < 0) {
                      errMsg = '拆分数量大于分配数量,请重新分配'
                    }
                  }
                })
              })
            })
          }
        })
        this.getDivideMaterialInfo()
        if (!errMsg) {
          this.loading = true
          productionPlan
            .create({
              data: this.productionDivideInfo
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('拆分成功')
                this.dividePlanFlag = false
                this.loading = false
                this.init()
              }
            })
          this.mustFlag = false
        } else {
          this.$message.error(errMsg)
        }
      } else {
        this.mustFlag = true
      }
    },
    // 被选中的产品信息
    checkList(): MaterailPlanData[] {
      return this.materialPlanDetail.material_plan_data.filter((item: any) => item.check)
    },
    // 结余逻辑
    storeSurplus(materialInfo: ProductionMaterialPlanInfo[]) {
      this.storeSurplusInfo.materialList = materialInfo.filter((item) => item.check)
      this.storeSurplusInfo.order_code = this.orderInfo.code
      this.storeSurplusInfo.order_id = this.orderInfo.id
      this.storeSurplusFlag = true
    },
    // 优化工序说明
    getProcessDesc(ev: any[], info: any) {
      info.process_desc =
        this.processList
          .find((item) => {
            return item.value === ev[0]
          })
          .children.find((itemChild: any) => {
            return itemChild.value === ev[1]
          }).process_desc || ''
    },
    getMaterialPlanDetail(id: string) {
      this.loading = true
      materialPlan
        .detail({
          id: Number(id)
        })
        .then((res) => {
          this.materialPlanDetail = res.data.data
          this.loading = false
        })
    }
  },
  mounted() {
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.orderInfo = res.data.data
        this.orderInfo.time_data.forEach((item, index) => {
          if (item.id === Number(this.$route.query.sampleOrderIndex)) {
            this.orderIndex = index
          }
        })
        this.order_id = res.data.data.time_data[this.orderIndex].id
        clientInOrder({
          order_id: this.order_id
        }).then((res) => {
          this.bearClientArr = res.data.data[2]
            .concat(res.data.data[3])
            .concat(res.data.data[5])
            .concat(res.data.data[4])
        })
        this.init()
      })

    // 优化工序信息
    order
      .processList({
        order_id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderProcess.children = res.data.data.map((item: any) => {
            return {
              value: item,
              label: item,
              process_desc: ''
            }
          })
        }
      })
    // 优化报价信息
    quotedPrice
      .detailByOrder({
        order_time_id: Number(this.$route.query.sampleOrderIndex)
      })
      .then((res) => {
        if (res.data.status) {
          if (res.data.data.length > 0) {
            res.data.data.forEach((item: QuotedPriceInfo) => {
              item.product_data.forEach((itemPro) => {
                itemPro.weave_data.forEach((itemProcess) => {
                  this.priceProcessList.push({
                    type: '织造工序',
                    productInfo: itemPro.rel_product_info
                      ? itemPro.rel_product_info.product_code +
                        '(' +
                        itemPro.category_name +
                        '/' +
                        itemPro.secondary_category +
                        ')'
                      : itemPro.category_name + '/' + itemPro.secondary_category,
                    process: itemProcess.name,
                    desc: itemProcess.desc,
                    price: itemProcess.total_price
                  })
                })
                itemPro.semi_product_data.forEach((itemProcess) => {
                  this.priceProcessList.push({
                    type: '半成品加工工序',
                    productInfo: itemPro.rel_product_info
                      ? itemPro.rel_product_info.product_code +
                        '(' +
                        itemPro.category_name +
                        '/' +
                        itemPro.secondary_category +
                        ')'
                      : itemPro.category_name + '/' + itemPro.secondary_category,
                    process: itemProcess.name,
                    desc: itemProcess.desc,
                    price: itemProcess.total_price
                  })
                })
                itemPro.production_data.forEach((itemProcess) => {
                  this.priceProcessList.push({
                    type: '成品加工工序',
                    productInfo: itemPro.rel_product_info
                      ? itemPro.rel_product_info.product_code +
                        '(' +
                        itemPro.category_name +
                        '/' +
                        itemPro.secondary_category +
                        ')'
                      : itemPro.category_name + '/' + itemPro.secondary_category,
                    process: itemProcess.name,
                    desc: itemProcess.desc,
                    price: itemProcess.total_price
                  })
                })
              })
            })
            this.priceProcessList = this.$mergeData(this.priceProcessList, {
              mainRule: 'productInfo'
            })
          }
        }
      })

    this.$checkCommonInfo([
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/staffProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStaffProcessAsync'
      },
      {
        checkWhich: 'api/halfProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getHalfProcessAsync'
      },
      {
        checkWhich: 'api/yarnColor',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnColorAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/productionPlan/detail.less';
</style>
<style lang="less">
#productionPlanDetail {
  .el-tabs__content {
    padding: 0;
  }
  .UnitCtn {
    .el-input-group__append {
      padding: 0;
      .el-input {
        width: 45px;
        .el-input__inner {
          padding: 0 8px;
          border: 0;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
  .error {
    .el-input__inner {
      border-color: red !important;
    }
  }
}
</style>