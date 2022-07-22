<template>
  <div id="packManageDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">发货信息</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol"
              style="flex:0.72">批次序号</div>
            <div class="tcol">发货时间</div>
            <div class="tcol">批次名称</div>
            <div class="tcol">批次类型</div>
            <div class="tcol">批次备注</div>
            <div class="tcol noPad"
              style="flex:8.7">
              <div class="trow">
                <div class="tcol">产品品类</div>
                <div class="tcol">产品图片</div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow">
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">计划发货数量</div>
                    <div class="tcol">实际发货数量</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="itemBatch in orderInfo.time_data[0].batch_data"
            :key="itemBatch.id">
            <div class="tcol"
              style="flex:0.72">
              <span>第{{itemBatch.batch_number}}批</span>
            </div>
            <div class="tcol">
              <span class="green">{{itemBatch.delivery_time}}</span>
            </div>
            <div class="tcol">
              <span>{{itemBatch.batch_title || '无'}}</span>
            </div>
            <div class="tcol">
              <span>{{itemBatch.batch_type_name}}</span>
            </div>
            <div class="tcol">
              <span>{{itemBatch.desc || '无'}}</span>
            </div>
            <div class="tcol noPad"
              style="flex:8.7">
              <div class="trow"
                v-for="itemPro in itemBatch.product_data"
                :key="itemPro.id">
                <div class="tcol">
                  <el-checkbox v-model="itemPro.check"
                    @change="(ev)=>{
                      itemPro.product_info.forEach((itemChild)=>{
                        itemChild.check = ev
                      })
                      $forceUpdate()}">
                    <span>{{itemPro.product_code||itemPro.system_code||'无编号'}}</span>
                    <span class="gray">({{itemPro.category}}/{{itemPro.secondary_category}})</span>
                  </el-checkbox>
                </div>
                <div class="tcol">
                  <div class="imageCtn">
                    <el-image style="width:100%;height:100%;margin-top:2px"
                      :src="itemPro.image_data.length>0?itemPro.image_data[0]:''"
                      :preview-src-list="itemPro.image_data">
                      <div slot="error"
                        class="image-slot">
                        <i class="el-icon-picture-outline"
                          style="font-size:42px"></i>
                      </div>
                    </el-image>
                  </div>
                </div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow"
                    v-for="(itemChild,indexChild) in itemPro.product_info"
                    :key="indexChild">
                    <div class="tcol">
                      <el-checkbox v-model="itemChild.check"
                        @change="$forceUpdate()">{{itemChild.size_name}}/{{itemChild.color_name}}</el-checkbox>
                    </div>
                    <div class="tcol">{{itemChild.number}}</div>
                    <div class="tcol"
                      :class="{'green':itemChild.transport_number&&itemChild.transport_number>=itemChild.number,'orange':itemChild.transport_number&&itemChild.transport_number<itemChild.number}">{{itemChild.transport_number||0}}
                      <span class="green"
                        v-if="itemChild.transport_number&&itemChild.transport_number>=itemChild.number">差值+{{itemChild.transport_number-itemChild.number}}</span>
                      <span class="red"
                        v-if="itemChild.transport_number&&itemChild.transport_number<itemChild.number">差值-{{itemChild.number - itemChild.transport_number}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttonList">
        <div style="margin-right:12px"
          class="btn backHoverBlue"
          :class="{'backGray': orderInfo.time_data[0].batch_data.filter((item) => {
                return item.product_data.some((itemPro) => {
                  return itemPro.product_info.some((itemChild) => {
                    return itemChild.check
                  })
                })
              }).length===0}"
          @click="goPlanPack(1)">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-xiugaidingdan"></use>
          </svg>
          <span class="text">合并装箱</span>
        </div>
        <div class="btn backHoverBlue"
          :class="{'backGray': orderInfo.time_data[0].batch_data.filter((item) => {
                return item.product_data.some((itemPro) => {
                  return itemPro.product_info.some((itemChild) => {
                    return itemChild.check
                  })
                })
              }).length===0}"
          @click="goPlanPack(2)">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-xiugaidingdan"></use>
          </svg>
          <span class="text">单独装箱</span>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="packPlanLog.length>0">
      <el-tabs type="border-card"
        v-model="packPlanLogIndex">
        <el-tab-pane v-for="(item,index) in packPlanLog"
          :key="index"
          :name="item.id.toString()"
          :label="'计划单'+(index+1)">
          <div class="detailCtn">
            <div class="row">
              <div class="col">
                <div class="label">单据编号：</div>
                <div class="text">{{item.code}}</div>
              </div>
              <div class="col">
                <div class="label">创建人：</div>
                <div class="text">{{item.user_name}}</div>
              </div>
              <div class="col">
                <div class="label">更新时间：</div>
                <div class="text">{{item.created_at.slice(0,10)}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">发货状态：</div>
                <div class="text">暂无</div>
              </div>
              <div class="col">
                <div class="label">发货数量：</div>
                <div class="text">{{item.total_delivery_number}}</div>
              </div>
              <div class="col">
                <div class="label">发货批次：</div>
                <div class="text">{{item.delivery_batch}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">批次名称：</div>
                <div class="text">{{item.batch_name}}</div>
              </div>
              <div class="col">
                <div class="label">发货日期：</div>
                <div class="text">{{item.delivery_time}}</div>
              </div>
              <div class="col">
              </div>
            </div>
          </div>
          <div class="tableCtn specialTable"
            style="padding:0;margin:0px 32px 20px 32px;max-width: calc(100% - 64px);">
            <div class="thead">
              <div class="trow outTrow">
                <div class="tcol noPad"
                  style="min-width:220px">
                  <div class="trow">
                    <div class="tcol">产品</div>
                    <div class="tcol">尺码颜色</div>
                  </div>
                </div>
                <div class="tcol">产品装袋说明</div>
                <div class="tcol noPad"
                  style="min-width:1650px">
                  <div class="trow">
                    <div class="tcol noPad"
                      style="min-width:110px">
                      <div class="trow">
                        <div class="tcol">数量/箱</div>
                      </div>
                    </div>
                    <div class="tcol">头箱号#</div>
                    <div class="tcol">尾箱号#</div>
                    <div class="tcol">箱数</div>
                    <div class="tcol">每箱毛重kg</div>
                    <div class="tcol">每箱净重kg</div>
                    <div class="tcol">总毛重kg</div>
                    <div class="tcol">总净重kg</div>
                    <div class="tcol">长cm</div>
                    <div class="tcol">宽cm</div>
                    <div class="tcol">高cm/封口</div>
                    <div class="tcol">单箱体积m³</div>
                    <div class="tcol">总体积m³</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow outTrow"
                v-for="(itemChild,indexChild) in item.data"
                :key="indexChild">
                <div class="tcol noPad"
                  style="min-width:220px">
                  <div class="trow"
                    v-for="(itemPro,indexPro) in itemChild.product_info"
                    :key="indexPro">
                    <div class="tcol">{{itemPro.product_code}}({{itemPro.category}}/{{itemPro.secondary_category}})</div>
                    <div class="tcol">{{itemPro.size_name}}/{{itemPro.color_name}}</div>
                  </div>
                </div>
                <div class="tcol">{{itemChild.desc}}</div>
                <div class="tcol noPad"
                  style="min-width:1650px">
                  <div class="trow"
                    v-for="(itemPack,indexPack) in itemChild.info_data"
                    :key="indexPack">
                    <div class="tcol noPad"
                      style="min-width:110px">
                      <div class="trow"
                        v-for="(itemChildPro,indexChildPro) in itemPack.product_info"
                        :key="indexChildPro">
                        <div class="tcol">{{itemChildPro.pack_number}}</div>
                      </div>
                    </div>
                    <div class="tcol">{{itemPack.first_box_number}}</div>
                    <div class="tcol">{{itemPack.last_box_number}}</div>
                    <div class="tcol">{{itemPack.box_count}}</div>
                    <div class="tcol">{{itemPack.box_gross_weight}}kg</div>
                    <div class="tcol">{{itemPack.box_net_weight}}kg</div>
                    <div class="tcol">{{itemPack.total_gross_weight}}kg</div>
                    <div class="tcol">{{itemPack.total_net_weight}}kg</div>
                    <div class="tcol">{{itemPack.length}}</div>
                    <div class="tcol">{{itemPack.width}}</div>
                    <div class="tcol">{{itemPack.height}}</div>
                    <div class="tcol">{{itemPack.single_bulk}}</div>
                    <div class="tcol">{{itemPack.total_bulk}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">包装名称</div>
                <div class="tcol">长</div>
                <div class="tcol">宽</div>
                <div class="tcol">高/封口</div>
                <div class="tcol">属性或说明</div>
                <div class="tcol">图片</div>
                <div class="tcol">计划数量</div>
                <div class="tcol">已订购数量</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemPack,indexPack) in item.gather_info"
                :key="indexPack">
                <div class="tcol">
                  <el-checkbox v-model="itemPack.check">{{itemPack.pack_material}}</el-checkbox>
                </div>
                <div class="tcol">{{itemPack.length}}</div>
                <div class="tcol">{{itemPack.width}}</div>
                <div class="tcol">{{itemPack.height}}</div>
                <div class="tcol">{{itemPack.desc}}</div>
                <div class="tcol">
                  <div class="imageCtn">
                    <el-image style="width:100%;height:100%;margin-top:2px"
                      :src="itemPack.file_url?itemPack.file_url:''"
                      :preview-src-list="[itemPack.file_url]">
                      <div slot="error"
                        class="image-slot">
                        <i class="el-icon-picture-outline"
                          style="font-size:42px"></i>
                      </div>
                    </el-image>
                  </div>
                </div>
                <div class="tcol">{{itemPack.number}}</div>
                <div class="tcol">暂无</div>
              </div>
              <div class="trow"
                v-if="item.gather_info.length===0">
                <div class="tcol gray"
                  style="text-align:center">暂无计划包装信息</div>
              </div>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">包装计划操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange"
                  @click="goUpdatePlanPack(item)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">修改计划</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deletePlanPack(item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">删除计划</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="goOrderPack('plan')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">计划订购</span>
                </div>
                <div class="btn backHoverGreen"
                  @click="$openUrl('/packManage/printPlan?id='+item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">打印计划</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module"
      v-if="packOrderLog.length>0">
      <el-tabs type="border-card"
        v-model="packOrderLogIndex">
        <el-tab-pane v-for="(item,index) in packOrderLog"
          :key="index"
          :name="item.id.toString()">
          <div slot="label">
            <div style="display:flex;flex-direction:column">
              <div style="line-height:20px;font-size:14px">订购单{{(index+1)}}</div>
              <div style="line-height:20px;font-size:14px">{{item.code}}</div>
            </div>
          </div>
          <div class="titleCtn">
            <div class="title">订购信息</div>
          </div>
          <div class="detailCtn">
            <div class="checkCtn"
              @click="checkDetailFlag=true">
              <el-tooltip class="item"
                effect="dark"
                :content="item.is_check>=3?'点击查看异常处理办法':'点击查看审核日志'"
                placement="bottom">
                <img :src="item.is_check|checkFilter" />
              </el-tooltip>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">单据编号：</div>
                <div class="text">{{item.code}}</div>
              </div>
              <div class="col">
                <div class="label">创建人：</div>
                <div class="text">{{item.user_name}}</div>
              </div>
              <div class="col">
                <div class="label">订购单位：</div>
                <div class="text">{{item.client_name}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">订购日期：</div>
                <div class="text">{{item.order_time}}</div>
              </div>
              <div class="col">
                <div class="label">交货日期：</div>
                <div class="text">{{item.delivery_time}}</div>
              </div>
              <div class="col">
                <div class="label">更新时间：</div>
                <div class="text">{{item.created_at}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">订购总数：</div>
                <div class="text">{{item.total_number}}</div>
              </div>
              <div class="col">
                <div class="label">订购总额：</div>
                <div class="text">{{item.total_price}}元</div>
              </div>
              <div class="col">
                <div class="label">结算状态：</div>
                <div class="text"
                  :class="{'green':item.has_invoice===1||item.has_pay===1,'gray':item.has_invoice!==1&&item.has_pay!==1}">{{item.has_invoice===1||item.has_pay===1?'已结算':'待结算'}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">备注信息</div>
                <div class="text">{{item.desc}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">包装名称</div>
                <div class="tcol">包装规格</div>
                <div class="tcol">面积单价</div>
                <div class="tcol">数量单价</div>
                <div class="tcol">订购数量</div>
                <div class="tcol">订购总价</div>
                <div class="tcol">备注信息</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.info_data"
                :key="indexChild">
                <div class="tcol">{{itemChild.pack_material_name}}</div>
                <div class="tcol">
                  <template v-if="Number(itemChild.price_type)===1">
                    {{itemChild.length}}*{{itemChild.width}}*{{itemChild.height}}cm
                  </template>
                  <template v-else-if="Number(itemChild.price_type)===2">
                    {{itemChild.length}}*{{itemChild.width}}cm + {{itemChild.height}}cm
                  </template>
                  <template v-else-if="Number(itemChild.price_type)===3">
                    {{itemChild.length}}
                  </template>
                </div>
                <div class="tcol">{{itemChild.bulk_price?(itemChild.bulk_price +'元'):'-'}}</div>
                <div class="tcol">{{itemChild.count_price?(itemChild.count_price +'元'):'-'}}</div>
                <div class="tcol">{{itemChild.number}}</div>
                <div class="tcol">{{$toFixed(itemChild.number*itemChild.count_price)}}元</div>
                <div class="tcol">{{itemChild.desc}}</div>
              </div>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">订购单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange"
                  @click="Number($getsessionStorage('has_check'))!==1&&(item.has_invoice===1||item.has_pay===1)?$message.error('单据已结算，无法修改，可联系管理员操作'):goUpdatePlanOrder(item)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">修改订购</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteOrderPack(item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">删除订购</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$openUrl('/packManage/printOrder?id=' + item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">打印订购</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="checkFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">审核单据</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="priceCtn fl">
          <div class="btn"
            :class="{'backHoverBlue':priceMaterialList.length>0,'backGray':priceMaterialList.length===0}"
            @click="showPrice=!showPrice">{{priceMaterialList.length>0?(showPrice?'关闭报价':'查看报价'):'暂无报价'}}</div>
          <div class="priceTable"
            v-show="showPrice && priceMaterialList.length>0">
            <div class="module">
              <div class="titleCtn">
                <div class="title">报价信息</div>
              </div>
              <div class="contentCtn">
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">原料名称</div>
                      <div class="tcol">单价</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="(item,index) in priceMaterialList"
                      :key="index">
                      <div class="tcol">{{item.material_name}}</div>
                      <div class="tcol">{{item.total_price}}元</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverOrange"
            @click="goOrderPack('direct')">直接订购</div>
        </div>
      </div>
    </div>
    <!-- 包装订购 -->
    <div class="popup"
      v-show="packOrderFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">包装订购信息</span>
          <div class="closeCtn">
            <span class="el-icon-close"
              @click="packOrderFlag = false;packOrderUpdateFlag=false"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn packOrder"
            v-for="(item,index) in packOrderInfo"
            :key="index">
            <div class="deleteIcon"
              @click="packOrderInfo.length>1?$deleteItem(packOrderInfo,index):$message.error('至少有一家订购单位')">
              <i class="el-icon-close"></i>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">订购单位</span>
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
                  <el-cascader :class="{'error':mustFlag&&item.tree_data.length===0}"
                    placeholder="请选择订购单位"
                    v-model="item.tree_data"
                    :options="packClientList"
                    @change="(ev)=>{item.client_id=ev[2]}"></el-cascader>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">下单日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    placeholder="请选择时间"
                    value-format="yyyy-MM-dd"
                    v-model="item.order_time"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">交货日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker :class="{'error':mustFlag&&!item.delivery_time}"
                    style="width:100%"
                    placeholder="请选择交货日期"
                    value-format="yyyy-MM-dd"
                    v-model="item.delivery_time"></el-date-picker>
                </div>
              </div>
            </div>
            <div :style="{'border-top':indexChild===0?'1px dotted #aaa':'0px'}"
              class="rowCtn"
              v-for="(itemChild,indexChild) in item.info_data"
              :key="indexChild">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">包装辅料名称</span>
                    <span class="explanation">(必选)</span>
                    <el-tooltip class="item"
                      effect="dark"
                      content="设置成功后请点击此按钮刷新数据"
                      placement="top">
                      <i class="el-icon-refresh hoverGreen fr"
                        style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                        @click="$checkCommonInfo([{
                        checkWhich: 'api/packMaterial',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getPackMaterialAsync',
                        forceUpdate:true
                      }])"></i>
                    </el-tooltip>
                    <el-tooltip class="item"
                      effect="dark"
                      content="添加新包装辅料"
                      placement="top">
                      <i class="el-icon-upload hoverOrange fr"
                        style="line-height:38px;font-size:18px;cursor:pointer"
                        @click="$openUrl('/setting/?pName=物料设置&cName=包装辅料')"></i>
                    </el-tooltip>
                  </div>
                  <div class="info elCtn">
                    <el-select :class="{'error':mustFlag&&!itemChild.pack_material_id}"
                      v-model="itemChild.pack_material_id"
                      placeholder="请选择包装辅料名称"
                      filterable
                      @change="getPackUnit($event,itemChild)">
                      <el-option v-for="item in packMaterialList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">计价类型</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select v-model="itemChild.price_type"
                      placeholder="请选择计价类型"
                      disabled>
                      <el-option :value="1"
                        label="纸箱:面积"></el-option>
                      <el-option :value="2"
                        label="胶袋:面积"></el-option>
                      <el-option :value="3"
                        label="其他"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">包装图片</span>
                  </div>
                  <div style="position: absolute;z-index:1">
                    <el-upload class="avatar-uploader"
                      action="https://upload.qiniup.com/"
                      :show-file-list="false"
                      :data="postData"
                      :on-success="(ev)=>{return successFile(ev,itemChild)}"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="itemChild.file_url"
                        :src="itemChild.file_url"
                        class="avatar">
                      <i v-else
                        class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">包装尺寸</span>
                    <span class="explanation">(必填,单位:cm)</span>
                  </div>
                  <div class="info elCtn"
                    style="flex-direction:row;display: flex;">
                    <template v-if="itemChild.price_type!==3">
                      <el-input style="margin-right:12px"
                        v-model="itemChild.length"
                        @focus="$focusInput($event)"
                        placeholder="长"></el-input>
                      <el-input style="margin-right:12px"
                        v-model="itemChild.width"
                        @focus="$focusInput($event)"
                        placeholder="宽"></el-input>
                      <el-input v-model="itemChild.height"
                        @focus="$focusInput($event)"
                        :placeholder="itemChild.price_type!==2?'高':'封口'"></el-input>
                    </template>
                    <template v-else>
                      <el-input v-model="itemChild.length"
                        @focus="$focusInput($event)"
                        placeholder="尺寸规格"></el-input>
                    </template>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">包装属性或说明</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemChild.desc"
                      @focus="$focusInput($event)"
                      placeholder="包装属性或说明"></el-input>
                  </div>
                </div>
                <div class="col"></div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label">
                        <span class="text">面积单价（元）</span>
                      </div>
                      <div class="info elCtn">
                        <el-input v-model="itemChild.bulk_price"
                          @focus="$focusInput($event)"
                          placeholder="单价">
                          <template slot="append">元</template>
                        </el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label">
                        <span class="text">数量单价（元/个）</span>
                      </div>
                      <div class="info elCtn">
                        <el-input v-model="itemChild.count_price"
                          @focus="$focusInput($event)"
                          placeholder="单价">
                          <template slot="append">元/个</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">订购数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input :class="{'error':mustFlag&&!itemChild.number}"
                      v-model="itemChild.number"
                      @focus="$focusInput($event)"
                      placeholder="订购数量"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="btn backHoverBlue"
                    style="height:32px;margin-top:38px"
                    v-if="indexChild===0"
                    @click="$addItem(item.info_data,{
                    price_type: 1,
                    pack_material_id: '',
                    length: '',
                    width: '',
                    height: '',
                    desc: '',
                    bulk_price: '',
                    count_price: '',
                    number: '',
                    file_url:''
                  })">添加包装</div>
                  <div class="btn backHoverRed"
                    style="height:32px;margin-top:38px"
                    v-if="indexChild>0"
                    @click="$deleteItem(item.info_data,indexChild)">删除包装</div>
                </div>
              </div>
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
                    @focus="$focusInput($event)"
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
                    @focus="$focusInput($event)"
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
                    @focus="$focusInput($event)"
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
                  <span class="text">订购备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入订购备注信息"
                    @focus="$focusInput($event)"
                    v-model="item.desc"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">订购总价</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="自动计算"
                    v-model="totalOrderPriceList[index]"
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
                  <el-input placeholder="自动计算"
                    v-model="totalOrderNumberList[index]"
                    disabled>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="btn backHoverBlue"
            style="margin-bottom:16px"
            @click="$addItem(packOrderInfo,{
              order_id: '',
              tree_data:[],
              client_id: '',
              client_name: '',
              order_time: $getDate(new Date()),
              delivery_time: '',
              desc: '',
              total_price: '',
              total_number: '',
              others_fee_data: [
                {
                  desc: '', // 额外费用备注
                  name: '',
                  price: ''
                }
              ],
              info_data: [
                {
                  file_url: '',
                  price_type: 1,
                  pack_material_id: '',
                  length: '',
                  width: '',
                  height: '',
                  desc: '',
                  bulk_price: '',
                  count_price: '',
                  number: ''
                }
              ]
            })"
            v-if="!packOrderUpdateFlag">添加订购单位</div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="packOrderFlag = false;packOrderUpdateFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveOrderPack()">{{packOrderUpdateFlag?'修改':'确认'}}</span>
          <span class="btn backHoverOrange"
            @click="saveOrderPack(true)">{{packOrderUpdateFlag?'修改并打印':'确认并打印'}}</span>
        </div>
      </div>
    </div>
    <!-- 装箱计划 -->
    <div class="popup"
      v-show="packPlanFlag">
      <div class="main"
        style="width: 1300px;">
        <div class="titleCtn">
          <span class="text">装箱计划</span>
          <div class="closeCtn"
            @click="packPlanFlag = false;packPlanStep=1">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn"
          style="max-height: 800px;">
          <template v-if="packPlanStep===1">
            <div class="editCtn packPlan">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">发货批次</span>
                  </div>
                  <div class="info">
                    <el-input v-model="packPlanInfo.batch_number"
                      placeholder="请输入发货批次"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">批次名称</span>
                  </div>
                  <div class="info">
                    <el-input v-model="packPlanInfo.batch_name"
                      placeholder="请输入批次名称"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">发货日期</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info">
                    <el-date-picker style="width:100%"
                      placeholder="请选择发货日期"
                      v-model="packPlanInfo.delivery_time"
                      value-format="yyyy-MM-dd"></el-date-picker>
                  </div>
                </div>
              </div>
              <div class="tableCtn specialTable"
                ref="packPlan"
                @mousewheel="listenWheel">
                <div class="thead">
                  <div class="trow outTrow">
                    <div class="tcol noPad"
                      style="min-width:220px">
                      <div class="trow">
                        <div class="tcol">产品</div>
                        <div class="tcol">尺码颜色</div>
                      </div>
                    </div>
                    <div class="tcol">产品装袋说明</div>
                    <div class="tcol noPad"
                      style="min-width:1650px">
                      <div class="trow">
                        <div class="tcol">包装操作</div>
                        <div class="tcol noPad"
                          style="min-width:110px">
                          <div class="trow">
                            <div class="tcol">数量/箱</div>
                          </div>
                        </div>
                        <div class="tcol">头箱号#</div>
                        <div class="tcol">尾箱号#</div>
                        <div class="tcol">箱数</div>
                        <div class="tcol">每箱毛重kg</div>
                        <div class="tcol">每箱净重kg</div>
                        <div class="tcol">总毛重kg</div>
                        <div class="tcol">总净重kg</div>
                        <div class="tcol">长cm</div>
                        <div class="tcol">宽cm</div>
                        <div class="tcol">高cm</div>
                        <div class="tcol">单箱体积m³</div>
                        <div class="tcol">总体积m³</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow outTrow"
                    v-for="(item,index) in packPlanInfo.data"
                    :key="index">
                    <div class="tcol noPad"
                      style="min-width:220px">
                      <div class="trow"
                        v-for="(itemPro,indexPro) in item.product_info"
                        :key="indexPro">
                        <div class="tcol">{{itemPro.product_show_info}}</div>
                        <div class="tcol">{{itemPro.size_name}}/{{itemPro.color_name}}</div>
                      </div>
                    </div>
                    <div class="tcol">
                      <textarea class="tableInput"
                        v-model="item.desc"
                        placeholder="产品装袋说明"></textarea>
                    </div>
                    <div class="tcol noPad"
                      style="min-width:1650px">
                      <div class="trow"
                        v-for="(itemPack,indexPack) in item.info_data"
                        :key="indexPack">
                        <div class="tcol">
                          <div class="oprCtn"
                            style="border-top:0;justify-content: flex-start;">
                            <div class="opr hoverBlue"
                              @click="addPlanPack(item)"
                              v-if="indexPack===0">添加纸箱</div>
                            <div class="opr hoverRed"
                              @click="$deleteItem(item.info_data,indexPack)"
                              v-if="indexPack>0">删除纸箱</div>
                          </div>
                        </div>
                        <div class="tcol noPad"
                          style="min-width:110px">
                          <div class="trow"
                            v-for="(itemChildPro,indexChildPro) in itemPack.product_info"
                            :key="indexChildPro">
                            <div class="tcol">
                              <input :ref="'pack_number-' + index + '-' + indexPack + '-' + indexChildPro"
                                class="tableInput"
                                v-model="itemChildPro.pack_number"
                                placeholder="数量"
                                @keydown="$focusByKeydown($event,'pack_number',[index,indexPack,indexChildPro],packPlanInfo,['data','info_data','product_info'])" />
                              <el-tooltip class="item"
                                effect="dark"
                                :content="itemChildPro.product_show_info"
                                placement="top-start">
                                <i class="el-icon-question unit"></i>
                              </el-tooltip>
                            </div>
                          </div>
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'first_box_number-' + index + '-' + indexPack"
                            v-model="itemPack.first_box_number"
                            placeholder="箱号(数字)"
                            @keydown="$focusByKeydown($event,'first_box_number',[index,indexPack],packPlanInfo,['data','info_data'])"
                            @input="(ev)=>{itemPack.box_count = Number(itemPack.last_box_number)?(Number(itemPack.last_box_number)-Number(itemPack.first_box_number)+1):0}" />
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'last_box_number-' + index + '-' + indexPack"
                            v-model="itemPack.last_box_number"
                            placeholder="箱号(数字)"
                            @keydown="$focusByKeydown($event,'last_box_number',[index,indexPack],packPlanInfo,['data','info_data'])"
                            @input="(ev)=>{itemPack.box_count = Number(itemPack.first_box_number)?(Number(itemPack.last_box_number)-Number(itemPack.first_box_number)+1):0}" />
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'box_count-' + index + '-' + indexPack"
                            v-model="itemPack.box_count"
                            @keydown="$focusByKeydown($event,'box_count',[index,indexPack],packPlanInfo,['data','info_data'])"
                            placeholder="箱数(默认)" />
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'total_gross_weight-' + index + '-' + indexPack"
                            v-model="itemPack.box_gross_weight"
                            placeholder="毛重"
                            @keydown="$focusByKeydown($event,'total_gross_weight',[index,indexPack],packPlanInfo,['data','info_data'])"
                            @input="(ev)=>{itemPack.total_gross_weight = $toFixed(Number(itemPack.box_gross_weight)*Number(itemPack.box_count))}" />
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'total_net_weight-' + index + '-' + indexPack"
                            v-model="itemPack.box_net_weight"
                            placeholder="净重"
                            @keydown="$focusByKeydown($event,'total_net_weight',[index,indexPack],packPlanInfo,['data','info_data'])"
                            @input="(ev)=>{itemPack.total_net_weight = $toFixed(Number(itemPack.box_net_weight)*Number(itemPack.box_count))}" />
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'total_gross_weight-' + index + '-' + indexPack"
                            v-model="itemPack.total_gross_weight"
                            @keydown="$focusByKeydown($event,'total_gross_weight',[index,indexPack],packPlanInfo,['data','info_data'])"
                            placeholder="总毛重" />
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'total_net_weight-' + index + '-' + indexPack"
                            v-model="itemPack.total_net_weight"
                            @keydown="$focusByKeydown($event,'total_net_weight',[index,indexPack],packPlanInfo,['data','info_data'])"
                            placeholder="总净重" />
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'length-' + index + '-' + indexPack"
                            v-model="itemPack.length"
                            placeholder="长"
                            @keydown="$focusByKeydown($event,'length',[index,indexPack],packPlanInfo,['data','info_data'])"
                            @input="(ev)=>{itemPack.single_bulk = $toFixed(Number(itemPack.length)*Number(itemPack.width)*Number(itemPack.height)/1000000,3);itemPack.total_bulk =  $toFixed(Number(itemPack.single_bulk)*Number(itemPack.box_count),3)}" />
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'width-' + index + '-' + indexPack"
                            v-model="itemPack.width"
                            placeholder="宽"
                            @keydown="$focusByKeydown($event,'width',[index,indexPack],packPlanInfo,['data','info_data'])"
                            @input="(ev)=>{itemPack.single_bulk = $toFixed(Number(itemPack.length)*Number(itemPack.width)*Number(itemPack.height)/1000000,3);itemPack.total_bulk =  $toFixed(Number(itemPack.single_bulk)*Number(itemPack.box_count),3)}" />
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'height-' + index + '-' + indexPack"
                            v-model="itemPack.height"
                            placeholder="高"
                            @keydown="$focusByKeydown($event,'height',[index,indexPack],packPlanInfo,['data','info_data'])"
                            @input="(ev)=>{itemPack.single_bulk = $toFixed(Number(itemPack.length)*Number(itemPack.width)*Number(itemPack.height)/1000000,3);itemPack.total_bulk =  $toFixed(Number(itemPack.single_bulk)*Number(itemPack.box_count),3)}" />
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'single_bulk-' + index + '-' + indexPack"
                            v-model="itemPack.single_bulk"
                            placeholder="单箱体积"
                            @keydown="$focusByKeydown($event,'single_bulk',[index,indexPack],packPlanInfo,['data','info_data'])"
                            @change="(ev)=>{itemPack.total_bulk = Number(itemPack.single_bulk)*Number(itemPack.box_count)}" />
                        </div>
                        <div class="tcol">
                          <input class="tableInput"
                            :ref="'total_bulk-' + index + '-' + indexPack"
                            v-model="itemPack.total_bulk"
                            @keydown="$focusByKeydown($event,'total_bulk',[index,indexPack],packPlanInfo,['data','info_data'])"
                            placeholder="总体积" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="tableCtn"
              style="padding-right:0;padding-left:0">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">包装名称</div>
                  <div class="tcol">单位</div>
                  <div class="tcol"
                    style="flex:0.5">长</div>
                  <div class="tcol"
                    style="flex:0.5">宽</div>
                  <div class="tcol"
                    style="flex:0.5">高/封口</div>
                  <div class="tcol">所需数量</div>
                  <div class="tcol">属性或说明</div>
                  <div class="tcol">图片</div>
                  <div class="tcol">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in packPlanInfo.gather_info"
                  :key="index">
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select v-model="item.pack_material_id"
                        placeholder="请选择包装辅料名称"
                        filterable
                        @change="(ev)=>{item.unit = packMaterialList.find((item) => item.id === ev).unit}">
                        <el-option v-for="item in packMaterialList"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="tcol">{{item.unit || '默认'}}</div>
                  <div class="tcol"
                    style="flex:0.5">
                    <div class="elCtn">
                      <el-input :disabled="item.isPlan"
                        placeholder="长"
                        v-model="item.length"></el-input>
                    </div>
                  </div>
                  <div class="tcol"
                    style="flex:0.5">
                    <div class="elCtn">
                      <el-input :disabled="item.isPlan"
                        placeholder="宽"
                        v-model="item.width"></el-input>
                    </div>
                  </div>
                  <div class="tcol"
                    style="flex:0.5">
                    <div class="elCtn">
                      <el-input :disabled="item.isPlan"
                        placeholder="高/封口"
                        v-model="item.height"></el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input v-model="item.number"
                        :disabled="item.isPlan"
                        placeholder="数量"></el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input v-model="item.desc"
                        placeholder="属性或说明"></el-input>
                    </div>
                  </div>
                  <div class="tcol"
                    style="padding:10px">
                    <el-upload class="avatar-uploader"
                      action="https://upload.qiniup.com/"
                      :show-file-list="false"
                      :data="postData"
                      :on-success="(ev)=>{return successFile(ev,item)}"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="item.file_url"
                        :src="item.file_url"
                        class="avatar">
                      <i v-else
                        class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                  <div class="tcol oprCtn"
                    style="justify-content: flex-start;">
                    <div class="opr hoverBlue"
                      @click="packPlanInfo.gather_info.push({
                        unit: '',
                        number: '',
                        pack_material_id: '',
                        length: '',
                        width: '',
                        height: '',
                        desc: '',
                        file_url: ''
                     })">添加</div>
                    <div class="opr hoverRed"
                      @click="item.isPlan?$message.error('计划包装不能删除'):$deleteItem(packPlanInfo.gather_info,index)">删除</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="packPlanFlag = false;packPlanStep=1">取消</span>
          <span class="btn backHoverOrange"
            @click="packPlanStep=1"
            v-if="packPlanStep===2">上一步</span>
          <span class="btn backHoverBlue"
            @click="packPlanStep===1?computedPackOrder():savePlanPack()">{{packPlanStep===1?'下一步':packPlanUpdateFlag?'确认修改':'确认保存'}}</span>
        </div>
      </div>
    </div>
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{packOrderLog.find((item)=>Number(item.id)===Number(packOrderLogIndex)).is_check=ev}"
      :show="checkFlag"
      :pid="packOrderLogIndex"
      :check_type="11"
      :reason="[]"></zh-check>
    <zh-check-detail :pid="packOrderLogIndex"
      :check_type="11"
      :show="checkDetailFlag"
      @close="checkDetailFlag=false"></zh-check-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, packManage, quotedPrice } from '@/assets/js/api'
import { PackOrderInfo, PackPlanInfo, PackPlanInfoData } from '@/types/packManage'
import { PackMaterialInfo } from '@/types/materialSetting'
import { CascaderInfo } from '@/types/vuex'
import { OrderInfo, OrderTime } from '@/types/order'
import { QuotedPriceInfo } from '@/types/quotedPrice'
export default Vue.extend({
  data(): {
    orderInfo: OrderInfo
    packPlanInfo: PackPlanInfo
    packPlanLog: PackPlanInfo[]
    packOrderLog: PackOrderInfo[]
    packOrderInfo: PackOrderInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      checkFlag: false,
      checkDetailFlag: false,
      orderIndex: '0',
      saveLock: false,
      mustFlag: false,
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
                    image_data: [],
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
      postData: {
        key: '',
        token: ''
      },
      packPlanStep: 1,
      packPlanFlag: false,
      packPlanUpdateFlag: false,
      packPlanInfo: {
        id: '',
        order_id: '',
        delivery_time: '',
        delivery_batch: '',
        batch_name: '',
        total_delivery_number: '',
        data: [
          {
            product_info: [
              {
                product_show_info: '',
                product_id: '',
                size_id: '',
                size_name: '',
                color_id: '',
                color_name: '',
                pack_number: ''
              }
            ],
            info_data: [
              {
                first_box_number: '',
                last_box_number: '',
                box_count: '',
                box_gross_weight: '',
                box_net_weight: '',
                total_gross_weight: '',
                total_net_weight: '',
                length: '',
                width: '',
                height: '',
                single_bulk: '',
                total_bulk: '',
                desc: '',
                product_info: [
                  {
                    product_id: '',
                    size_id: '',
                    color_id: '',
                    pack_number: ''
                  }
                ]
              }
            ],
            desc: ''
          }
        ],
        gather_info: [
          {
            unit: '',
            number: '',
            pack_material_id: '',
            length: '',
            width: '',
            height: '',
            desc: '',
            file_url: ''
          }
        ]
      },
      packPlanLog: [],
      packPlanLogIndex: '',
      packOrderFlag: false,
      packOrderUpdateFlag: false,
      packOrderInfo: [
        {
          order_id: '',
          client_id: '',
          tree_data: [],
          client_name: '',
          order_time: this.$getDate(new Date()),
          delivery_time: '',
          desc: '',
          total_price: '',
          total_number: '',
          others_fee_data: [
            {
              desc: '', // 额外费用备注
              name: '',
              price: ''
            }
          ],
          info_data: [
            {
              file_url: '',
              price_type: 1,
              pack_material_id: '',
              length: '',
              width: '',
              height: '',
              desc: '',
              bulk_price: '',
              count_price: '',
              number: ''
            }
          ]
        }
      ],
      packOrderLog: [],
      packOrderLogIndex: '',
      showPrice: false,
      priceMaterialList: [] // 报价单报价信息
    }
  },
  computed: {
    token(): string {
      return this.$store.state.status.token
    },
    packMaterialList(): PackMaterialInfo[] {
      return this.$store.state.api.packMaterial.arr
    },
    packClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '包装辅料单位')
    },
    totalOrderNumberList(): number[] {
      return this.packOrderInfo.map((item) => {
        return item.info_data.reduce((total, current) => {
          return total + Number(current.number)
        }, 0)
      })
    },
    totalOrderPriceList(): string[] {
      return this.packOrderInfo.map((item) => {
        return (
          item.info_data.reduce((total, current) => {
            return total + Number(current.number) * Number(current.count_price)
          }, 0) +
          item.others_fee_data.reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        ).toFixed(2)
      })
    }
  },
  methods: {
    // 监听一下鼠标滚轮
    listenWheel(ev: any) {
      const detail = ev.wheelDelta || ev.detail
      // 定义滚动方向，其实也可以在赋值的时候写
      const moveForwardStep = 1
      const moveBackStep = -1
      // 定义滚动距离
      let step = 0
      // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
      if (detail < 0) {
        step = moveForwardStep * 50
      } else {
        step = moveBackStep * 50
      }
      // @ts-ignore 对需要滚动的元素进行滚动操作
      this.$refs.packPlan.scrollLeft += step
    },
    init() {
      this.loading = true
      Promise.all([
        packManage.orderList({
          order_id: this.order_id
        }),
        packManage.planList({
          order_id: this.order_id
        })
      ]).then((res) => {
        this.packOrderLog = res[0].data.data
        if (this.packOrderLog.length > 0) {
          this.packOrderLogIndex = this.packOrderLog[0].id!.toString()
        }
        this.packPlanLog = res[1].data.data
        if (this.packPlanLog.length > 0) {
          this.packPlanLogIndex = this.packPlanLog[0].id!.toString()
        }
        this.loading = false
      })
      this.loading = false
    },
    resetOrderPack() {
      this.packOrderInfo = [
        {
          order_id: '',
          client_id: '',
          client_name: '',
          tree_data: [],
          order_time: this.$getDate(new Date()),
          delivery_time: '',
          desc: '',
          total_price: '',
          total_number: '',
          others_fee_data: [
            {
              desc: '', // 额外费用备注
              name: '',
              price: ''
            }
          ],
          info_data: [
            {
              file_url: '',
              price_type: 1,
              pack_material_id: '',
              length: '',
              width: '',
              height: '',
              desc: '',
              bulk_price: '',
              count_price: '',
              number: ''
            }
          ]
        }
      ]
    },
    goOrderPack(type: 'plan' | 'direct') {
      if (type === 'plan') {
        const finded = this.packPlanLog.find((item) => item.id === Number(this.packPlanLogIndex))
        const checkArr = finded!.gather_info.filter((item) => item.check)
        if (checkArr.length === 0) {
          this.$message.error('请勾选计划信息订购')
          return
        }
        this.resetOrderPack()
        this.packOrderInfo = [
          {
            order_id: '',
            client_id: '',
            client_name: '',
            tree_data: [],
            order_time: this.$getDate(new Date()),
            delivery_time: '',
            desc: '',
            total_price: '',
            total_number: '',
            others_fee_data: [
              {
                desc: '', // 额外费用备注
                name: '',
                price: ''
              }
            ],
            // @ts-ignore
            info_data: checkArr.map((item) => {
              return {
                file_url: item.file_url,
                price_type: 1,
                pack_material_id: item.pack_material_id,
                length: item.length,
                width: item.width,
                height: item.height,
                desc: item.desc,
                bulk_price: '',
                count_price: '',
                number: item.number
              }
            })
          }
        ]
        console.log(this.packOrderInfo)
        this.packOrderFlag = true
      } else {
        this.resetOrderPack()
        this.packOrderFlag = true
      }
    },
    goUpdatePlanOrder(info: PackOrderInfo) {
      const updateInfo = this.$clone(info)
      updateInfo.tree_data = JSON.parse(updateInfo.tree_data as string)
      updateInfo.info_data.forEach((item) => {
        item.price_type = Number(item.price_type) as 1 | 2 | 3
      })
      this.packOrderInfo = [updateInfo]
      this.packOrderFlag = true
      this.packOrderUpdateFlag = true
    },
    deleteOrderPack(id: number) {
      this.$confirm('是否删除该订购单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          packManage
            .deleteOrder({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
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
    // 计算数量单个,本来给面积单价用的，现在不知道怎么用
    // getCountPrice(bulkPrice: number, info: any) {
    //   if (info.price_type === 1 && info.length && info.width && info.height) {
    //     info.count_price = this.$toFixed(
    //       (Number(info.length) * Number(info.width) * Number(info.height) * bulkPrice) / 1000000
    //     )
    //   } else if (info.price_type === 2 && info.length && info.width) {
    //     info.count_price = this.$toFixed((Number(info.length) * Number(info.width) * bulkPrice) / 10000)
    //   }
    // },
    getOrderCmpData() {
      this.packOrderInfo.forEach((item, index) => {
        item.order_id = this.order_id
        item.total_number = this.totalOrderNumberList[index]
        item.total_price = this.totalOrderPriceList[index]
        item.tree_data = JSON.stringify(item.tree_data)
      })
    },
    saveOrderPack(ifprint?: boolean) {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      const formCheck = this.packOrderInfo.some((item) => {
        return (
          this.$formCheck(item, [
            {
              key: 'client_id',
              errMsg: '请选择订购单位'
            },
            {
              key: 'delivery_time',
              errMsg: '请选择交货日期'
            }
          ]) ||
          item.info_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
              {
                key: 'pack_material_id',
                errMsg: '请选择包装辅料'
              },
              {
                key: 'number',
                errMsg: '请输入订购数量'
              }
            ])
          })
        )
      })
      if (!formCheck) {
        this.getOrderCmpData()
        this.saveLock = true
        if (this.packOrderUpdateFlag) {
          packManage.UpdateOrder(this.packOrderInfo[0]).then((res) => {
            if (res.data.status) {
              this.$message.success('修改成功')
              this.packOrderFlag = false
              this.packorderUpdateFlag = false
              this.init()
              if (ifprint) {
                this.$openUrl('/packManage/printPlan?id=' + res.data.data)
              }
            }
            this.saveLock = false
          })
        } else {
          packManage.createOrder({ data: this.packOrderInfo }).then((res) => {
            if (res.data.status) {
              this.$message.success('订购成功')
              this.packOrderFlag = false
              this.init()
              if (ifprint) {
                this.$openUrl('/packManage/printPlan?id=' + res.data.data)
              }
            }
          })
        }
        this.mustFlag = false
      } else {
        this.mustFlag = true
      }
    },
    // 1合并装箱 2单独装箱
    goPlanPack(type: 1 | 2) {
      const checkArr = (this.orderInfo.time_data as OrderTime[])[0].batch_data.filter((item) => {
        return item.product_data.some((itemPro) => {
          return itemPro.product_info.some((itemChild) => {
            return itemChild.check
          })
        })
      })
      if (checkArr.length > 1) {
        this.$message.error('只能选单个批次的产品进行操作')
        return
      }
      this.resetPlanPack()
      if (type === 1) {
        this.packPlanInfo.data[0].product_info = []
      } else {
        this.packPlanInfo.data = []
      }
      ;(this.orderInfo.time_data as OrderTime[])[0].batch_data.forEach((item) => {
        item.product_data.forEach((itemPro) => {
          itemPro.product_info.forEach((itemChild) => {
            if (itemChild.check) {
              this.packPlanInfo.batch_number = '第' + item.batch_number + '批'
              this.packPlanInfo.batch_name = item.batch_title
              this.packPlanInfo.delivery_batch = item.id as number
              if (type === 1) {
                this.packPlanInfo.data[0].product_info.push({
                  product_show_info:
                    itemPro.product_code + '(' + itemPro.category + '/' + itemPro.secondary_category + ')',
                  product_id: itemPro.product_id,
                  order_product_info_id: itemChild.id as number,
                  size_id: itemChild.size_id,
                  size_name: itemChild.size_name,
                  color_id: itemChild.color_id,
                  color_name: itemChild.color_name,
                  pack_number: ''
                })
              } else {
                this.packPlanInfo.data.push({
                  product_info: [
                    {
                      product_show_info:
                        itemPro.product_code + '(' + itemPro.category + '/' + itemPro.secondary_category + ')',
                      product_id: itemPro.product_id,
                      order_product_info_id: itemChild.id as number,
                      size_id: itemChild.size_id,
                      size_name: itemChild.size_name,
                      color_id: itemChild.color_id,
                      color_name: itemChild.color_name,
                      pack_number: ''
                    }
                  ],
                  info_data: [
                    {
                      first_box_number: '',
                      last_box_number: '',
                      box_count: '',
                      box_gross_weight: '',
                      box_net_weight: '',
                      total_gross_weight: '',
                      total_net_weight: '',
                      length: '',
                      width: '',
                      height: '',
                      single_bulk: '',
                      total_bulk: '',
                      desc: '',
                      product_info: [
                        {
                          product_id: '',
                          size_id: '',
                          color_id: '',
                          pack_number: ''
                        }
                      ]
                    }
                  ],
                  desc: ''
                })
              }
            }
          })
        })
      })
      if (this.packPlanInfo.data.length === 0 || this.packPlanInfo.data[0].product_info.length === 0) {
        this.$message.error('请选择发货信息计划装箱')
        return
      }
      this.packPlanInfo.data.forEach((item) => {
        item.info_data = []
        this.addPlanPack(item)
      })
      this.packPlanFlag = true
    },
    // 新增包装
    addPlanPack(father: PackPlanInfoData) {
      father.info_data.push({
        first_box_number: '',
        last_box_number: '',
        box_count: '',
        box_gross_weight: '',
        box_net_weight: '',
        total_gross_weight: '',
        total_net_weight: '',
        length: '',
        width: '',
        height: '',
        single_bulk: '',
        total_bulk: '',
        desc: '',
        product_info: father.product_info.map((item) => {
          return {
            product_show_info: item.product_show_info + '/' + item.size_name + '/' + item.color_name,
            product_id: item.product_id,
            size_id: item.size_id,
            color_id: item.color_id,
            pack_number: ''
          }
        })
      })
    },
    resetPlanPack() {
      this.packPlanInfo = {
        id: '',
        order_id: '',
        delivery_time: this.$getDate(new Date()),
        delivery_batch: '',
        batch_name: '',
        total_delivery_number: '',
        data: [
          {
            product_info: [
              {
                product_show_info: '',
                product_id: '',
                size_id: '',
                size_name: '',
                color_id: '',
                color_name: '',
                pack_number: ''
              }
            ],
            info_data: [
              {
                first_box_number: '',
                last_box_number: '',
                box_count: '',
                box_gross_weight: '',
                box_net_weight: '',
                total_gross_weight: '',
                total_net_weight: '',
                length: '',
                width: '',
                height: '',
                single_bulk: '',
                total_bulk: '',
                desc: '',
                product_info: [
                  {
                    product_id: '',
                    size_id: '',
                    color_id: '',
                    pack_number: ''
                  }
                ]
              }
            ],
            desc: ''
          }
        ],
        gather_info: [
          {
            unit: '',
            number: '',
            pack_material_id: '',
            length: '',
            width: '',
            height: '',
            desc: '',
            file_url: ''
          }
        ]
      }
      this.packPlanUpdateFlag = false
    },
    computedPackOrder() {
      const formCheck = this.packPlanInfo.data.some((item) => {
        return item.info_data.some((itemChild) => {
          return this.$formCheck(itemChild, [
            {
              key: 'first_box_number',
              errMsg: '请填写头箱号'
            },
            {
              key: 'first_box_number',
              errMsg: '请填写尾箱号'
            },
            {
              key: 'box_count',
              errMsg: '请填写箱数'
            },
            {
              key: 'length',
              errMsg: '请填写长'
            },
            {
              key: 'width',
              errMsg: '请填写宽'
            },
            {
              key: 'height',
              errMsg: '请填写高'
            }
          ])
        })
      })
      if (!formCheck) {
        // 算一下发货产品总数量
        this.packPlanInfo.total_delivery_number = 0
        this.packPlanInfo.data.forEach((item) => {
          item.info_data.forEach((itemChild) => {
            itemChild.product_info.forEach((itemPro) => {
              this.packPlanInfo.total_delivery_number =
                Number(this.packPlanInfo.total_delivery_number) +
                Number(itemPro.pack_number) * Number(itemChild.box_count)
            })
          })
        })
        // 判断是否修改，修改就把原来的数据的number都清了
        if (!this.packPlanUpdateFlag) {
          this.packPlanInfo.gather_info = []
        } else {
          this.packPlanInfo.gather_info.forEach((item) => {
            item.number = 0
            item.isPlan = true
          })
        }
        this.packPlanInfo.data.forEach((item) => {
          item.info_data.forEach((itemPack) => {
            const finded = this.packPlanInfo.gather_info.find(
              (item) =>
                item.length === itemPack.length && item.width === itemPack.width && item.height === itemPack.height
            )
            if (finded) {
              finded.number = Number(finded.number) + Number(itemPack.box_count)
            } else {
              this.packPlanInfo.gather_info.push({
                isPlan: true,
                unit: '',
                number: Number(itemPack.box_count),
                pack_material_id: '',
                length: itemPack.length,
                width: itemPack.width,
                height: itemPack.height,
                desc: '',
                file_url: ''
              })
            }
          })
        })
        this.packPlanStep = 2
      }
    },
    getPlanCmpData() {
      this.packPlanInfo.order_id = this.order_id
      this.packPlanInfo.total_delivery_number = this.packPlanInfo.data.reduce((total, cur) => {
        return (
          total +
          cur.info_data.reduce((totalChild, curChild) => {
            return (
              totalChild +
              curChild.product_info.reduce((totalSon, curSon) => {
                return totalSon + Number(curSon.pack_number) * Number(curChild.box_count)
              }, 0)
            )
          }, 0)
        )
      }, 0)
    },
    savePlanPack() {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      const formCheck = this.packPlanInfo.gather_info.some((item) => {
        return this.$formCheck(item, [
          {
            key: 'pack_material_id',
            errMsg: '请选择包装'
          },
          {
            key: 'length',
            errMsg: '请输入长'
          },
          {
            key: 'width',
            errMsg: '请输入宽'
          },
          {
            key: 'number',
            errMsg: '请输入数量'
          }
        ])
      })
      if (!formCheck) {
        this.getPlanCmpData()
        this.saveLock = true
        packManage.createPlan(this.packPlanInfo).then((res) => {
          if (res.data.status) {
            this.$message.success(this.packPlanUpdateFlag ? '修改成功' : '添加成功')
            this.resetPlanPack()
            this.packPlanFlag = false
            this.packPlanStep = 1
            this.init()
          }
          this.saveLock = false
        })
      }
    },
    goUpdatePlanPack(info: PackPlanInfo) {
      this.packPlanInfo = info
      info.data.forEach((item) => {
        item.product_info.forEach((itemPro) => {
          itemPro.product_show_info =
            itemPro.product_code + '(' + itemPro.category + '/' + itemPro.secondary_category + ')'
        })
      })
      this.packPlanUpdateFlag = true
      this.packPlanFlag = true
    },
    deletePlanPack(id: number) {
      this.$confirm('是否删除该装箱计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          packManage
            .deletePlan({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
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
    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.postData.token = this.token
      this.postData.key = file.name.split('.')[0] + Date.parse(new Date() + '') + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    successFile(response: { hash: string; key: string }, info: any) {
      info.file_url = 'https://file.zwyknit.com/' + response.key
    },
    removeFile(file: { response: { hash: string; key: string }; url: string }) {
      // if (this.productInfo.file_list!.find((item) => item.url === file.url)) {
      //   this.$deleteItem(
      //     this.productInfo.file_list!,
      //     this.productInfo.file_list!.map((item) => item.url).indexOf(file.url)
      //   )
      // } else {
      //   this.$deleteItem(
      //     this.productInfo.image_data,
      //     this.productInfo.image_data.indexOf('https://file.zwyknit.com/' + file.response.key)
      //   )
      // }
    },
    // 选择包装辅料优化单位和计价方式
    getPackUnit(ev: number, info: any) {
      const finded = this.packMaterialList.find((item) => item.id === ev)
      info.price_type = Number(finded!.calc_type)
      info.unit = finded!.unit
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      },
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/packMaterial',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPackMaterialAsync'
      }
    ])
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.order_id = res.data.data.time_data[this.orderIndex].id
        this.orderInfo = res.data.data
        this.init()
      })
    // 优化报价信息
    quotedPrice
      .detailByOrder({
        order_id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          if (res.data.data.length > 0) {
            res.data.data.forEach((item: QuotedPriceInfo) => {
              item.product_data.forEach((itemPro) => {
                itemPro.pack_material_data.forEach((itemMat) => {
                  this.priceMaterialList.push(itemMat)
                })
              })
            })
          }
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/packManage/detail.less';
</style>
<style lang="less">
#packManageDetail {
  .error {
    .el-input__inner {
      border-color: red !important;
    }
  }
  .el-tabs__content {
    padding: 0;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #aaa;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 122px;
    height: 122px;
    line-height: 122px;
    text-align: center;
  }
  .avatar {
    width: 122px;
    height: 122px;
    display: block;
  }
}
</style>