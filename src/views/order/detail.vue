<template>
  <div id="orderDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item"
            effect="dark"
            content="点击查看审核日志"
            placement="bottom">
            <img :src="orderInfo.time_data[0].is_check|checkFilter" />
          </el-tooltip>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">订单号：</div>
            <div class="text">{{orderInfo.code}}</div>
          </div>
          <div class="col">
            <div class="label">创建人：</div>
            <div class="text">{{orderInfo.user_name}}</div>
          </div>
          <div class="col">
            <div class="label">创建时间：</div>
            <div class="text">{{orderInfo.created_at}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">订单公司：</div>
            <div class="text">{{orderInfo.client_name}}</div>
          </div>
          <div class="col">
            <div class="label">联系人：</div>
            <div class="text">{{orderInfo.contacts_name}}</div>
          </div>
          <div class="col">
            <div class="label">负责组/人：</div>
            <div class="text">{{orderInfo.group_name}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">下单币种：</div>
            <div class="text">{{orderInfo.settle_unit}}</div>
          </div>
          <div class="col flex3">
            <div class="label">币种汇率</div>
            <div class="text">{{orderInfo.settle_tax || 100}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">订单状态：</div>
            <div class="text"
              :class="orderInfo.status|orderStatusClassFilter">{{orderInfo.status|orderStatusFilter}}</div>
          </div>
          <div class="col flex3">
            <div class="label">下单时间：</div>
            <div class="text">{{orderInfo.time_data[0].order_time}}</div>
          </div>
          <div class="col flex3">
            <div class="label">关联单据：</div>
            <div class="text green">
              <span v-if="orderInfo.rel_quote_id"
                style="cursor:pointer;margin-right:12px"
                @click="$openUrl('/quotedPrice/detail?id='+orderInfo.rel_quote_id)">{{orderInfo.rel_quote_code}}(报价单)</span>
              <span v-if="orderInfo.rel_order_id"
                style="cursor:pointer;margin-right:12px"
                @click="$openUrl('/sampleOrder/detail?id='+orderInfo.rel_order_id)">{{orderInfo.rel_order_code}}(报价单)</span>
              <span class="gray"
                v-if="!orderInfo.rel_quote_id&&!orderInfo.rel_order_id">无关联单据</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">下单款数：</div>
            <div class="text">{{orderInfo.time_data[0].total_style}}款</div>
          </div>
          <div class="col">
            <div class="label">下单总数：</div>
            <div class="text">{{orderInfo.time_data[0].total_number}}</div>
          </div>
          <div class="col">
            <div class="label">下单总额：</div>
            <div class="text">{{orderInfo.time_data[0].total_price}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">产前样寄送：</div>
            <div class="text"
              :class="orderInfo.time_data[0].is_send===1?'green':'gray'">{{orderInfo.time_data[0].is_send===1?'是':'否'}}</div>
          </div>
          <div class="col">
            <div class="label">产前确认：</div>
            <div class="text"
              :class="orderInfo.time_data[0].is_before_confirm===1?'green':'gray'">{{orderInfo.time_data[0].is_before_confirm===1?'是':'否'}}</div>
          </div>
          <div class="col">
            <div class="label">是否加急：</div>
            <div class="text"
              :class="orderInfo.time_data[0].is_urgent===1?'green':'gray'">{{orderInfo.time_data[0].is_urgent===1?'是':'否'}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">公开文件：</div>
            <div class="fileCtn">
              <div class="once"
                v-for="(item,index) in orderInfo.public_files"
                :key="index">
                <div class="fileIcon">
                  <svg v-if="item.split('.')[item.split('.').length-1]==='xlsx'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-Excel"></use>
                  </svg>
                  <svg v-else-if="item.split('.')[item.split('.').length-1]==='png'||item.split('.')[item.split('.').length-1]==='jpeg'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-tupian"></use>
                  </svg>
                  <svg v-else-if="item.split('.')[item.split('.').length-1]==='word'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-word"></use>
                  </svg>
                  <svg v-else-if="item.split('.')[item.split('.').length-1]==='pdf'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-pdf"></use>
                  </svg>
                  <svg v-else
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-qitawenjian"></use>
                  </svg>
                </div>
                <div class="name">文件{{index+1}}.{{item.split('.')[item.split('.').length-1]}}</div>
                <a class="opr hoverBlue"
                  :href="item"
                  target=_blank>点击下载</a>
              </div>
              <div class="text"
                v-if="orderInfo.public_files.length===0">
                <span class="gray">暂无相关文件信息</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row"
          v-if="orderInfo.private_files.length>0">
          <div class="col">
            <div class="label">私密文件：</div>
            <div class="fileCtn">
              <div class="once"
                v-for="(item,index) in orderInfo.private_files"
                :key="index">
                <div class="fileIcon">
                  <svg v-if="item.split('.')[item.split('.').length-1]==='xlsx'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-Excel"></use>
                  </svg>
                  <svg v-else-if="item.split('.')[item.split('.').length-1]==='png'||item.split('.')[item.split('.').length-1]==='jpeg'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-tupian"></use>
                  </svg>
                  <svg v-else-if="item.split('.')[item.split('.').length-1]==='word'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-word"></use>
                  </svg>
                  <svg v-else-if="item.split('.')[item.split('.').length-1]==='pdf'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-pdf"></use>
                  </svg>
                  <svg v-else
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-qitawenjian"></use>
                  </svg>
                </div>
                <div class="name">文件{{index+1}}.{{item.split('.')[item.split('.').length-1]}}</div>
                <a class="opr hoverBlue"
                  :href="item"
                  target=_blank>点击下载</a>
              </div>
              <div class="text"
                v-if="orderInfo.public_files.length===0">
                <span class="gray">暂无相关文件信息</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注信息：</div>
            <div class="text"
              :class="orderInfo.desc?'':'gray'">{{orderInfo.desc || '无备注信息'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">产品信息</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">产品编号</div>
            <div class="tcol">产品名称</div>
            <div class="tcol">产品图片</div>
            <div class="tcol noPad"
              style="flex:3">
              <div class="trow">
                <div class="tcol">尺码颜色</div>
                <div class="tcol">下单单价</div>
                <div class="tcol">下单数量</div>
              </div>
            </div>
            <div class="tcol">产品单据状态</div>
            <div class="tcol">产品描述</div>
            <div class="tcol">修改意见</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in productList"
            :key="index">
            <div class="tcol">
              <span class="blue"
                style="cursor:pointer"
                @click="productDetail=item;productShow=true">{{item.product_code||item.system_code}}</span>
              <span class="gray">({{item.category}}/{{item.secondary_category}})</span>
            </div>
            <div class="tcol">{{item.name}}</div>
            <div class="tcol">
              <div class="imageCtn">
                <el-image style="width:100%;height:100%"
                  :src="item.image_data.length>0?item.image_data[0]:''"
                  :preview-src-list="item.image_data">
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
                v-for="(itemChild,indexChild) in item.product_info"
                :key="indexChild">
                <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                <div class="tcol">{{itemChild.price}}{{orderInfo.settle_unit}}</div>
                <div class="tcol">{{itemChild.number}}</div>
              </div>
            </div>
            <div class="tcol stateCtn">
              <div class="state"
                @click="item.craft_list_id?$router.push('/craft/detail?id='+item.craft_list_id):$router.push('/craft/create?id=' + item.product_id)">
                <div class="circle"
                  :class="{'backGray':!item.craft_list_id,'backBlue':item.craft_list_id}">工</div>
              </div>
            </div>
            <div class="tcol">{{item.desc||'无'}}</div>
            <div class="tcol">{{item.client_edit_idea||'无'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">发货信息</div>
      </div>
      <div :class="itemBatchIndex===0?'detailCtn':'detailCtn noPadTop'"
        v-for="(itemBatch,itemBatchIndex) in orderInfo.time_data[0].batch_data"
        :key="itemBatch.id">
        <div class="tableCtn noPadBtm">
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
                  <div class="tcol">批次状态</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow">
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
                    <span>{{itemPro.product_code||itemPro.system_code||'无编号'}}</span>
                    <span class="gray">({{itemPro.category}}/{{itemPro.secondary_category}})</span>
                  </div>
                  <div class="tcol">
                    <el-image style="width:100%;height:100%"
                      :src="itemPro.image_data&&itemPro.image_data.length>0?itemPro.image_data[0]:''"
                      :preview-src-list="itemPro.image_data">
                      <div slot="error"
                        class="image-slot">
                        <i class="el-icon-picture-outline"
                          style="font-size:42px"></i>
                      </div>
                    </el-image>
                  </div>
                  <div class="tcol noPad"
                    style="flex:3">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in itemPro.product_info"
                      :key="indexChild">
                      <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcol">{{itemChild.number}}</div>
                      <div class="tcol">0</div>
                    </div>
                  </div>
                  <div class="tcol">暂无</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">生产汇总表</div>
      </div>
      <div class="tableCtn samallFont">
        <div class="thead">
          <div class="trow">
            <div class="tcol">产品信息</div>
            <div class="tcol">尺码颜色</div>
            <div class="tcol">下单数量</div>
            <div class="tcol">计划生产数量</div>
            <div class="tcol noPad"
              style="flex:6">
              <div class="trow">
                <div class="tcol">生产单位</div>
                <div class="tcol">生产工序</div>
                <div class="tcol">完成数量</div>
                <div class="tcol">检验入库数量</div>
                <div class="tcol">次品数量</div>
                <div class="tcol">次品率</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in productionDetail"
            :key="index">
            <div class="tcol">{{item.product_code}}</div>
            <div class="tcol">{{item.color}}/{{item.size}}</div>
            <div class="tcol">{{item.order_number}}</div>
            <div class="tcol">{{item.plan_number}}</div>
            <div class="tcol noPad"
              style="flex:6">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.weave_info"
                :key="indexChild">
                <div class="tcol">{{itemChild.client_name}}</div>
                <div class="tcol">{{itemChild.process_name}}</div>
                <div class="tcol">{{itemChild.real_number}}</div>
                <div class="tcol">{{itemChild.inspection_number}}</div>
                <div class="tcol">{{itemChild.shoddy_number}}</div>
                <div class="tcol">{{itemChild.shoddy_pre}}%</div>
              </div>
            </div>
          </div>
          <div class="trow"
            v-if="productionDetail.length===0">
            <div class="tcol gray"
              style="text-align:center">暂无生产信息</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">物料汇总信息</div>
      </div>
      <div class="tableCtn samallFont">
        <div class="thead"
          style="height:auto">
          <div class="trow">
            <div class="tcol w100">原料名称</div>
            <div class="tcol noPad"
              style="flex:2">
              <div class="trow">
                <div class="tcol">颜色</div>
                <div class="tcol">数量</div>
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:2">
              <div class="trow">
                <div class="tcol center">调取信息</div>
              </div>
              <div class="trow">
                <div class="tcol">调取仓库</div>
                <div class="tcol">调取数量</div>
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:2">
              <div class="trow">
                <div class="tcol center">采购信息</div>
              </div>
              <div class="trow">
                <div class="tcol">采购单位</div>
                <div class="tcol">采购数量</div>
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:3">
              <div class="trow">
                <div class="tcol center">加工信息</div>
              </div>
              <div class="trow">
                <div class="tcol">加工单位</div>
                <div class="tcol">加工工序</div>
                <div class="tcol">加工数量</div>
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:2">
              <div class="trow">
                <div class="tcol center">加工信息</div>
              </div>
              <div class="trow">
                <div class="tcol">出库单位</div>
                <div class="tcol">出库数量</div>
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:2">
              <div class="trow">
                <div class="tcol center">入库/结余信息</div>
              </div>
              <div class="trow">
                <div class="tcol">入库数</div>
                <div class="tcol">结余数量</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in materialDetail"
            :key="index + 'plan'">
            <div class="tcol w100">{{item.material_name}}</div>
            <div class="tcol noPad"
              style="flex:2">
              <div class="trow"
                v-for="(itemColor,indexColor) in item.color_info"
                :key="indexColor">
                <div class="tcol">{{itemColor.material_color}}</div>
                <div class="tcol">{{itemColor.number}}{{itemColor.unit}}</div>
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:2">
              <div class="trow"
                v-if="item.material_transfer_info.length===0">
                <div class="tcol gray">无调取信息</div>
              </div>
              <div class="trow"
                v-for="(itemTransfer,indexTransfer) in item.material_transfer_info"
                :key="indexTransfer">
                <div class="tcol">{{itemTransfer.store_name}}</div>
                <div class="tcol">{{itemTransfer.number}}</div>
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:2">
              <div class="trow"
                v-if="item.material_order_info.length===0">
                <div class="tcol gray">无订购信息</div>
              </div>
              <div class="trow"
                v-for="(itemOrder,indexOrder) in item.material_order_info"
                :key="indexOrder">
                <div class="tcol">{{itemOrder.client_name}}</div>
                <div class="tcol">{{itemOrder.number}}{{itemOrder.unit}}</div>
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:3">
              <div class="trow"
                v-for="(itemProcess,indexProcess) in item.material_process_info"
                :key="indexProcess">
                <div class="trow"
                  v-if="item.material_process_info.length===0">
                  <div class="tcol gray">无加工信息</div>
                </div>
                <div class="tcol">{{itemProcess.client_name}}</div>
                <div class="tcol">{{itemProcess.process}}</div>
                <div class="tcol">{{itemProcess.number}}{{itemProcess.unit}}</div>
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:2">
              <div class="trow"
                v-if="item.final_pop_info.length===0">
                <div class="tcol gray">无出库信息</div>
              </div>
              <div class="trow"
                v-for="(itemPop,indexPop) in  item.final_pop_info"
                :key="indexPop">
                <div class="tcol">{{itemPop.client_name}}</div>
                <div class="tcol">{{itemPop.number}}{{itemPop.unit}}</div>
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:2">
              <div class="trow"
                v-if="item.final_push_info.length===0">
                <div class="tcol gray">无入库信息</div>
              </div>
              <div class="trow"
                v-for="(itemPush,indexPush) in  item.final_push_info"
                :key="indexPush">
                <div class="tcol">{{itemPush.client_name}}</div>
                <div class="tcol">{{itemPush.number}}{{itemPush.unit}}</div>
              </div>
            </div>
          </div>
          <div class="trow"
            v-if="materialDetail.length===0">
            <div class="tcol gray"
              style="text-align:center">暂无物料信息</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="buttonList"
            style="margin-left:12px">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">订单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange"
                  @click="$router.push('/order/update?id=' + $route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">修改订单</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="checkFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shenhedingdan"></use>
                  </svg>
                  <span class="text">审核订单</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteOrder">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">删除订单</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$router.push('/materialPlan/create?id=' + $route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-wuliaojihua1"></use>
                  </svg>
                  <span class="text">物料计划</span>
                </div>
                <div class="btn backHoverBlue">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-dayindingdan"></use>
                  </svg>
                  <span class="text">打印订单</span>
                </div>
                <div class="btn backHoverBlue">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-youjianfenxiang"></use>
                  </svg>
                  <span class="text">邮件分享</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$router.push('/quotedPrice/create?orderId='+$route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">转报价单</span>
                </div>
                <div class="btn backHoverBlue">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">操作记录</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <product-detail :data="productDetail"
      :show="productShow"
      @close="productShow = false"></product-detail>
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{orderInfo.time_data[0].is_check=ev;$forceUpdate()}"
      :show="checkFlag"
      :pid="orderInfo.time_data[0].id"
      :check_type="1"
      :reason="['驳回理由1','驳回理由2','驳回理由3','驳回理由4','驳回理由5']"></zh-check>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order } from '@/assets/js/api'
import { OrderInfo, OrderTime } from '@/types/order'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  data(): {
    orderInfo: OrderDetail
    [propName: string]: any
  } {
    return {
      loading: true,
      checkFlag: false,
      orderInfo: {
        id: null,
        client_id: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '', // 订单用无用字段
        settle_unit: '', // 订单用无用字段
        order_type: 1,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: '',
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
            batch_data: [
              {
                id: '',
                batch_number: 1,
                batch_title: '',
                batch_type: '',
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
                    size_color_list: [], // 用于下拉框选择尺码颜色
                    product_info: [
                      {
                        size_color: '', // 用于下拉框选择尺码颜色
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
      productList: [],
      productDetail: {
        product_type: 1,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category: '',
        type: '',
        image_data: [],
        desc: '',
        style_data: [], // 款式
        component_data: [
          {
            component_id: '',
            number: '' // 成分信息
          }
        ],
        size_data: [
          {
            size_id: '',
            size_info: '',
            weight: ''
          }
        ], // 尺码组
        color_data: [], // 配色组
        // 配件信息
        part_data: [
          {
            name: '',
            unit: '',
            part_size_data: [
              {
                size_id: '',
                size_info: '',
                weight: ''
              }
            ],
            part_component_data: [
              {
                component_id: '',
                number: '' // 成分信息
              }
            ]
          }
        ]
      },
      materialDetail: [],
      productionDetail: [],
      productShow: false
    }
  },
  methods: {
    deleteOrder() {
      this.$confirm('是否删除该订单?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          order
            .delete({
              id: Number(this.$route.query.id)
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$router.push('/order/list?page=1&keyword=&client_id=&user_id=&status=null0&date=')
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    console.log(
      this.$checkCommonInfo([
        {
          checkWhich: 'api/group',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getGroupAsync'
        }
      ])
    )
  },
  mounted() {
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          // 整理产品信息
          this.orderInfo.time_data.forEach((itemTime) => {
            itemTime.batch_data.forEach((itemBatch) => {
              this.productList = this.productList.concat(itemBatch.product_data)
            })
          })
          Promise.all([
            order.materialDetail({
              order_id: Number(this.orderInfo.time_data[0].id)
            }),
            order.productionDetail({
              order_time_id: Number(this.orderInfo.time_data[0].id)
            })
          ]).then((res) => {
            this.materialDetail = res[0].data.data
            this.productionDetail = res[1].data.data
            this.loading = false
          })
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/order/detail.less';
</style>