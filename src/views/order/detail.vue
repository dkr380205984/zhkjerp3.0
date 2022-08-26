<template>
  <div id="orderDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module"
      id="基本信息">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="detailCtn">
        <div class="checkCtn"
          @click="checkDetailFlag=true">
          <el-tooltip class="item"
            effect="dark"
            :content="orderInfo.time_data[0].is_check>=3?'点击查看异常处理办法':'点击查看审核日志'"
            placement="bottom">
            <img :src="orderInfo.time_data[0].is_check|checkFilter" />
          </el-tooltip>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">订单号：</div>
            <div class="text">{{orderInfo.code}}
              <span class="hoverBlue"
                style="cursor:pointer;font-size:14px"
                @click="$copyTextInfo(orderInfo.code)">复制</span>
            </div>
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
            <div class="label">下单款数：</div>
            <div class="text">{{orderInfo.time_data[0].total_style}}款</div>
          </div>
          <div class="col flex3">
            <div class="label">下单总数：</div>
            <div class="text">{{orderInfo.time_data[0].total_number}}</div>
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
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">下单币种：</div>
            <div class="text">{{orderInfo.settle_unit}}</div>
          </div>
          <div class="col flex3">
            <div class="label">币种汇率</div>
            <div class="text">{{orderInfo.settle_tax}}</div>
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
              :class="orderInfo.time_data[0].is_send===1?'green':'gray'">{{orderInfo.time_data[0].is_send===1?'是':'否'}}
              <span class="hoverBlue"
                style="cursor:pointer"
                v-if="orderInfo.time_data[0].is_send===1"
                @click="sendFlag=true">(查看详情)</span>
            </div>
          </div>
          <div class="col">
            <div class="label">产前确认：</div>
            <div class="text"
              :class="orderInfo.time_data[0].is_before_confirm===1?'green':'gray'">{{orderInfo.time_data[0].is_before_confirm===1?'是':'否'}}
              <span class="hoverBlue"
                style="cursor:pointer"
                v-if="orderInfo.time_data[0].is_before_confirm===1"
                @click="proCheckFlag=true">(产前确认)</span>
            </div>
          </div>
          <div class="col">
            <div class="label">是否加急：</div>
            <div class="text"
              :class="orderInfo.time_data[0].is_urgent===1?'red':'gray'">{{orderInfo.time_data[0].is_urgent===1?'【加急订单】':'否'}}</div>
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
                  <svg v-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='xlsx'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-Excel"></use>
                  </svg>
                  <svg v-else-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='png'||item.file_url.split('.')[item.file_url.split('.').length-1]==='jpeg'||item.file_url.split('.')[item.file_url.split('.').length-1]==='jpg'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-tupian"></use>
                  </svg>
                  <svg v-else-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='word'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-word"></use>
                  </svg>
                  <svg v-else-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='pdf'"
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
                <div class="name">文件{{index+1}}.{{item.file_url.split('.')[item.file_url.split('.').length-1]}}</div>
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
          v-if="orderInfo.private_files && orderInfo.private_files.length>0">
          <div class="col">
            <div class="label">私密文件：</div>
            <div class="fileCtn">
              <div class="once"
                v-for="(item,index) in orderInfo.private_files"
                :key="index">
                <div class="fileIcon">
                  <svg v-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='xlsx'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-Excel"></use>
                  </svg>
                  <svg v-else-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='png'||item.file_url.split('.')[item.file_url.split('.').length-1]==='jpeg'||item.file_url.split('.')[item.file_url.split('.').length-1]==='jpg'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-tupian"></use>
                  </svg>
                  <svg v-else-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='word'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-word"></use>
                  </svg>
                  <svg v-else-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='pdf'"
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
                <div class="name">文件{{index+1}}.{{item.file_url.split('.')[item.file_url.split('.').length-1]}}</div>
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
              v-html="orderInfo.desc"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      id="产品信息">
      <div class="titleCtn">
        <div class="title">产品信息</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">批次序号</div>
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
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in productList"
            :key="index">
            <div class="tcol">第{{item.batchIndex}}批</div>
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
                @click="item.craft_list_id?$openUrl('/craft/detail?id='+item.craft_list_id):$openUrl('/craft/create?id=' + item.product_id)">
                <div v-if="item.category==='梭织'||item.secondary_category==='梭织'"
                  class="circle"
                  :class="{'backGray':!item.craft_list_id,'backBlue':item.craft_list_id}">工</div>
                <div v-else
                  class="gray">无需工艺单</div>
              </div>
              <div class="state"
                @click="goQuotedPrice(item)">
                <div class="circle"
                  :class="{'backGray':!item.rel_quote_info.quote_id,'backBlue':item.rel_quote_info.quote_id}">报</div>
              </div>
            </div>
            <div class="tcol"
              v-html="item.desc"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      id="批次信息">
      <div class="titleCtn clearfix">
        <div class="title">批次信息 <div class="btn backHoverBlue fr"
            style="margin-top:11px;font-weight:normal"
            @click="confirmOrderBatch(orderInfo.time_data[0].batch_data.filter((item)=>item.check))">批量确认完成</div>
        </div>
      </div>
      <div :class="itemBatchIndex===0?'detailCtn':'detailCtn noPadTop'"
        v-for="(itemBatch,itemBatchIndex) in orderInfo.time_data[0].batch_data"
        :key="itemBatch.id">
        <div class="tableCtn noPadBtm">
          <div class="thead">
            <div class="trow">
              <div class="tcol"
                style="flex:0.5">
                <el-checkbox v-model="checkAll"
                  @change="(ev)=>{orderInfo.time_data[0].batch_data.forEach((item)=>item.check=ev);$forceUpdate()}">序号</el-checkbox>
              </div>
              <div class="tcol">发货时间</div>
              <div class="tcol">批次名称</div>
              <div class="tcol">批次类型</div>
              <div class="tcol">批次备注</div>
              <div class="tcol noPad"
                style="flex:7">
                <div class="trow">
                  <div class="tcol">产品品类</div>
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
              <div class="tcol">状态</div>
              <div class="tcol">操作</div>
            </div>
          </div>
          <div class="tbody"
            style="font-size:14px">
            <div class="trow">
              <div class="tcol"
                style="flex:0.5">
                <span>
                  <el-checkbox v-model="itemBatch.check"
                    @change="$forceUpdate()">{{itemBatch.batch_number}}</el-checkbox>
                </span>
              </div>
              <div class="tcol">
                <span class="green">{{itemBatch.delivery_time}}
                  <span v-if="Number(itemBatch.status)<2"
                    :class="$diffByDate(itemBatch.delivery_time)>0?'green':'red'">({{$diffByDate(itemBatch.delivery_time)>0?'还剩'+$diffByDate(itemBatch.delivery_time)+'天':'逾期'+Math.abs($diffByDate(itemBatch.delivery_time))+'天'}})</span>
                </span>
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
                style="flex:7">
                <div class="trow"
                  v-for="itemPro in itemBatch.product_data"
                  :key="itemPro.id">
                  <div class="tcol">
                    <span>{{itemPro.product_code||itemPro.system_code||'无编号'}}</span>
                    <span class="gray">({{itemPro.category}}/{{itemPro.secondary_category}})</span>
                  </div>
                  <div class="tcol noPad"
                    style="flex:3">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in itemPro.product_info"
                      :key="indexChild">
                      <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
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
              <div class="tcol"
                :class="{'blue':itemBatch.status===1,'green':itemBatch.status===2,'red':itemBatch.status===3}">
                {{itemBatch.status===1?'进行中':(itemBatch.status===2?'已完成':'已逾期')}}
              </div>
              <div class="tcol oprCtn">
                <div class="opr hoverBlue"
                  @click="confirmOrderBatch([itemBatch])">确认完成</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      id="物料汇总信息">
      <div class="titleCtn">
        <div class="title">物料汇总信息</div>
      </div>
      <div class="processCtn">
        <div class="process">
          <div class="active"
            :style="{'width':(materialProgress.material_push>100?100:materialProgress.material_push)+'%'}"></div>
          <span class="left">原料入库进度</span>
          <span class="right">{{materialProgress.material_push}}%</span>
        </div>
        <div class="process">
          <div class="active"
            :style="{'width':(materialProgress.material_pop>100?100:materialProgress.material_pop)+'%'}"></div>
          <span class="left">原料出库进度</span>
          <span class="right">{{materialProgress.material_pop}}%</span>
        </div>
      </div>
      <zh-drop-down :buttonStyle="'padding:20px'"
        :show="show_material"
        :showAsync="!show_material"
        hideTitle="点击查看图表"
        @beforeShow="getMaterialDetail">
        <!-- 老接口 -->
        <!-- <div class="tableCtn samallFont">
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
                  <div class="tcol center">
                    <span>调取信息</span>
                    <span>更新日期:{{materialUpdateTime.transfer?materialUpdateTime.transfer:'暂无'}}</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">调取仓库</div>
                  <div class="tcol">调取数量</div>
                </div>
              </div>
              <div class="tcol noPad"
                style="flex:2">
                <div class="trow">
                  <div class="tcol center">
                    <span>采购信息</span>
                    <span>更新日期:{{materialUpdateTime.order?materialUpdateTime.order:'暂无'}}</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">采购单位</div>
                  <div class="tcol">采购数量</div>
                </div>
              </div>
              <div class="tcol noPad"
                style="flex:3">
                <div class="trow">
                  <div class="tcol center">
                    <span>加工信息</span>
                    <span>更新日期:{{materialUpdateTime.process?materialUpdateTime.process:'暂无'}}</span>
                  </div>
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
                  <div class="tcol center">
                    <span>入库信息</span>
                    <span>更新日期:{{materialUpdateTime.push?materialUpdateTime.push:'暂无'}}</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">入库仓库</div>
                  <div class="tcol">入库数量</div>
                </div>
              </div>
              <div class="tcol noPad"
                style="flex:2">
                <div class="trow">
                  <div class="tcol center">
                    <span>出库信息</span>
                    <span>更新日期:{{materialUpdateTime.pop?materialUpdateTime.pop:'暂无'}}</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">出库单位</div>
                  <div class="tcol">出库数量</div>
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
            </div>
            <div class="trow"
              v-if="materialDetail.length===0">
              <div class="tcol gray"
                style="text-align:center">暂无物料信息</div>
            </div>
          </div>
        </div> -->
        <!-- 新接口 -->
        <div class="scrollCtn"
          @mousewheel.prevent="listenWheel"
          ref="materialRef">
          <div class="tableCtn samallFont">
            <div class="thead"
              style="height:auto">
              <div class="trow">
                <div class="tcol">单据编号</div>
                <div class="tcol">原料名称</div>
                <div class="tcol noPad flex2">
                  <div class="trow">
                    <div class="tcol">颜色</div>
                    <div class="tcol">数量</div>
                  </div>
                </div>
                <div class="tcol noPad flex3">
                  <div class="trow">
                    <div class="tcol center">
                      <span>调取信息</span>
                      <span>更新日期:{{materialUpdateTime.transfer?materialUpdateTime.transfer:'暂无'}}</span>
                    </div>
                  </div>
                  <div class="trow">
                    <div class="tcol">调取仓库</div>
                    <div class="tcol">调取数量</div>
                    <div class="tcol">调取颜色</div>
                  </div>
                </div>
                <div class="tcol noPad flex3">
                  <div class="trow">
                    <div class="tcol center">
                      <span>采购信息</span>
                      <span>更新日期:{{materialUpdateTime.order?materialUpdateTime.order:'暂无'}}</span>
                    </div>
                  </div>
                  <div class="trow">
                    <div class="tcol">采购单位</div>
                    <div class="tcol">采购数量</div>
                    <div class="tcol">采购颜色</div>
                  </div>
                </div>
                <div class="tcol noPad flex4">
                  <div class="trow">
                    <div class="tcol center">
                      <span>加工信息</span>
                      <span>更新日期:{{materialUpdateTime.process?materialUpdateTime.process:'暂无'}}</span>
                    </div>
                  </div>
                  <div class="trow">
                    <div class="tcol">加工单位</div>
                    <div class="tcol">加工工序</div>
                    <div class="tcol">加工数量</div>
                    <div class="tcol">加工工序</div>
                  </div>
                </div>
                <div class="tcol noPad flex2">
                  <div class="trow">
                    <div class="tcol center">
                      <span>入库信息</span>
                      <span>更新日期:{{materialUpdateTime.push?materialUpdateTime.push:'暂无'}}</span>
                    </div>
                  </div>
                  <div class="trow">
                    <div class="tcol">入库仓库</div>
                    <div class="tcol">入库数量</div>
                  </div>
                </div>
                <div class="tcol noPad flex2">
                  <div class="trow">
                    <div class="tcol center">
                      <span>出库信息</span>
                      <span>更新日期:{{materialUpdateTime.pop?materialUpdateTime.pop:'暂无'}}</span>
                    </div>
                  </div>
                  <div class="trow">
                    <div class="tcol">出库单位</div>
                    <div class="tcol">出库数量</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <template v-for="(itemFather,indexFather) in materialDetail">
                <div class="trow"
                  v-for="(item,index) in itemFather.data"
                  :key=" 'plan'+index + '-' + indexFather">
                  <div class="tcol"><span class="text">{{itemFather.plan_code}}</span></div>
                  <div class="tcol"><span class="text">{{item.material_name}}</span></div>
                  <div class="tcol noPad flex2">
                    <div class="trow">
                      <div class="tcol"><span class="text">{{item.material_color}}</span></div>
                      <div class="tcol"><span class="text">{{item.number}}{{item.unit}}</span></div>
                    </div>
                  </div>
                  <div class="tcol noPad flex3">
                    <div class="trow"
                      v-if="item.material_transfer.length===0">
                      <div class="tcol gray">无调取信息</div>
                    </div>
                    <div class="trow"
                      v-for="(itemTransfer,indexTransfer) in item.material_transfer"
                      :key="indexTransfer">
                      <div class="tcol"><span class="text">{{itemTransfer.store}}</span></div>
                      <div class="tcol"><span class="text">{{itemTransfer.number}}</span></div>
                      <div class="tcol"><span class="text">{{itemTransfer.material_color}}</span></div>
                    </div>
                  </div>
                  <div class="tcol noPad flex3">
                    <div class="trow"
                      v-if="item.material_order.length===0">
                      <div class="tcol gray">无订购信息</div>
                    </div>
                    <div class="trow"
                      v-for="(itemOrder,indexOrder) in item.material_order"
                      :key="indexOrder">
                      <div class="tcol"><span class="text">{{itemOrder.client_name}}</span></div>
                      <div class="tcol"><span class="text">{{itemOrder.number}}{{itemOrder.unit}}</span></div>
                      <div class="tcol"><span class="text">{{itemOrder.material_color}}</span></div>
                    </div>
                  </div>
                  <div class="tcol noPad flex4">
                    <div class="trow"
                      v-if="item.material_process.length===0">
                      <div class="tcol gray">无加工信息</div>
                    </div>
                    <div class="trow"
                      v-for="(itemProcess,indexProcess) in item.material_process"
                      :key="indexProcess">
                      <div class="tcol"><span class="text">{{itemProcess.client_name}}</span></div>
                      <div class="tcol"><span class="text">{{itemProcess.process}}</span></div>
                      <div class="tcol"><span class="text">{{itemProcess.number}}{{itemProcess.unit}}</span></div>
                      <div class="tcol">
                        <template v-if="itemProcess.process==='染色'">
                          <div class="changeCtn text">
                            <span>白胚</span>
                            <span class="el-icon-s-unfold blue"></span>
                            <span>{{itemProcess.after_color}}</span>
                          </div>
                        </template>
                        <template v-if="itemProcess.process==='倒纱'">
                          <div class="changeCtn text">
                            <span>{{itemProcess.before_attribute}}</span>
                            <span class="el-icon-s-unfold blue"></span>
                            <span>{{itemProcess.after_attribute}}</span>
                          </div>
                        </template>
                        <template v-if="itemProcess.process==='并线'">
                          <span class="text">{{itemProcess.bingxian_desc}}</span>
                        </template>
                        <template v-if="itemProcess.process==='膨纱'">
                          <span class="text">{{itemProcess.pengsha_desc}}</span>
                        </template>
                        <template v-if="itemProcess.process==='切割'">
                          <span class="text">{{itemProcess.qiege_desc}}</span>
                        </template>
                      </div>
                    </div>
                  </div>
                  <div class="tcol noPad flex2">
                    <div class="trow"
                      v-if="item.final_push.length===0">
                      <div class="tcol gray">无入库信息</div>
                    </div>
                    <div class="trow"
                      v-for="(itemPush,indexPush) in  item.final_push"
                      :key="indexPush">
                      <div class="tcol"><span class="text">{{itemPush.store}}</span></div>
                      <div class="tcol"><span class="text">{{itemPush.number}}{{itemPush.unit}}</span></div>
                    </div>
                  </div>
                  <div class="tcol noPad flex2">
                    <div class="trow"
                      v-if="item.final_pop.length===0">
                      <div class="tcol gray">无出库信息</div>
                    </div>
                    <div class="trow"
                      v-for="(itemPop,indexPop) in item.final_pop"
                      :key="indexPop">
                      <div class="tcol"><span class="text">{{itemPop.client_name}}</span></div>
                      <div class="tcol"><span class="text">{{itemPop.number}}{{itemPop.unit}}</span></div>
                    </div>
                  </div>
                </div>
              </template>
              <div class="trow"
                v-if="materialDetail.length===0">
                <div class="tcol gray"
                  style="text-align:center">暂无物料信息</div>
              </div>
            </div>
          </div>
        </div>
      </zh-drop-down>
    </div>
    <div class="module"
      id="生产汇总表">
      <div class="titleCtn">
        <div class="title"
          style="display: flex;align-items: center;">生产汇总表
        </div>
      </div>
      <div class="processCtn">
        <div class="process">
          <div class="active"
            :style="{'width':(productionProgress.weave>100?100:productionProgress.weave) + '%'}"></div>
          <span class="left">生产织造进度(此进度为外协小程序申报数量)</span>
          <span class="right">{{productionProgress.weave}}%</span>
        </div>
        <div class="process">
          <div class="active"
            :style="{'width':(productionProgress.inspection>100?100:productionProgress.inspection)+'%'}"></div>
          <span class="left">检验入库进度(此进度为本厂检验车间申报数量)</span>
          <span class="right">{{productionProgress.inspection}}%</span>
        </div>
      </div>
      <zh-drop-down :buttonStyle="'padding:20px'"
        :show="show_production"
        :showAsync="!show_production"
        @beforeShow="getProductionDetail"
        hideTitle="点击查看图表">
        <div class="tableCtn samallFont">
          <div class="thead"
            style="height:auto">
            <div class="trow">
              <div class="tcol center"
                style="min-width: 491px;">
                <span>下单信息</span>
                <span>更新日期:{{productionUpdateTime.order?productionUpdateTime.order:'暂无'}}</span>
              </div>
              <!-- <div class="tcol center"
                style="min-width: 235px;">
                <span>计划信息</span>
                <span>更新日期:{{productionUpdateTime.plan?productionUpdateTime.plan:'暂无'}}</span>
              </div> -->
              <div class="tcol center"
                style="min-width: 329px;">
                <span>生产分配信息</span>
                <span>更新日期:{{productionUpdateTime.weave?productionUpdateTime.weave:'暂无'}}</span>
              </div>
              <div class="tcol center"
                style="max-width: 198px;">
                <span>数量更新信息</span>
                <span>更新日期:{{productionUpdateTime.complete?productionUpdateTime.complete:'暂无'}}</span>
              </div>
              <div class="tcol center">
                <span>检验收发信息</span>
                <span>更新日期:{{productionUpdateTime.inspection?productionUpdateTime.inspection:'暂无'}}</span>
              </div>
            </div>
            <div class="trow">
              <div class="tcol">产品信息</div>
              <div class="tcol noPad"
                style="flex:10">
                <div class="trow">
                  <div class="tcol">产品颜色</div>
                  <div class="tcol noPad"
                    style="flex:9">
                    <div class="trow">
                      <div class="tcol">产品尺码</div>
                      <div class="tcol">下单数量</div>
                      <div class="tcol noPad"
                        style="flex:8">
                        <div class="trow">
                          <div class="tcol">生产单位</div>
                          <div class="tcol noPad"
                            style="flex:6">
                            <div class="trow">
                              <div class="tcol">生产工序</div>
                              <div class="tcol">计划数量</div>
                              <div class="tcol">完成数量</div>
                              <div class="tcol">检验入库数量</div>
                              <div class="tcol">半次/全次数量</div>
                              <div class="tcol">次品率</div>
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
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in productionDetail"
              :key="index">
              <div class="tcol">{{item.product_code}}</div>
              <div class="tcol noPad"
                style="flex:10">
                <div class="trow"
                  v-for="(itemColor,indexColor) in item.data"
                  :key="indexColor">
                  <div class="tcol">{{itemColor.color_name}}</div>
                  <div class="tcol noPad"
                    style="flex:9">
                    <div class="trow"
                      v-for="(itemSize,indexSize) in itemColor.data"
                      :key="indexSize">
                      <div class="tcol">{{itemSize.size_name}}</div>
                      <div class="tcol">{{itemSize.data.order_number}}</div>
                      <div class="tcol noPad"
                        style="flex:8">
                        <div class="trow"
                          v-for="(itemClient,indexClient) in itemSize.data.weave_info"
                          :key="indexClient">
                          <div class="tcol">{{itemClient.client_name}}</div>
                          <div class="tcol noPad"
                            style="flex:6">
                            <div class="trow"
                              v-for="(itemChild,indexChild) in itemClient.data"
                              :key="indexChild">
                              <div class="tcol">{{itemChild.process_name}}</div>
                              <div class="tcol">{{itemChild.data.plan_number}}</div>
                              <div class="tcol">{{itemChild.data.real_number}}</div>
                              <div class="tcol">{{itemChild.data.inspection_number}}</div>
                              <div class="tcol">{{itemChild.data.part_shoddy_number||0}}/{{itemChild.data.shoddy_number}}</div>
                              <div class="tcol">{{itemChild.data.shoddy_pre}}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
      </zh-drop-down>
    </div>
    <div class="description"
      style="padding: 18px;
      background: #F0F0F0;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 24px;
      font-size: 18px;
      font-weight: bold;
      text-align:center">财务流程汇总仅管理员可见</div>
    <template v-if="Number($getsessionStorage('has_check'))===1">
      <div class="module"
        id="财务概览">
        <div class="titleCtn">
          <div class="title"
            style="display: flex;align-items: center;">财务概览
            <span style="font-size:14px;margin-left:8px">(绑定报价单后可进行流程工序价格对比)</span>
          </div>
        </div>
        <template>
          <div class="titleIn"
            style="margin-top:20px">产品费用</div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">产品编号</div>
                <div class="tcol">下单数量</div>
                <div class="tcol">平均单价</div>
                <div class="tcol">下单合计</div>
                <div class="tcol">操作</div>
              </div>
            </div>
            <div class="tbody"
              v-for="(item,index) in financialInfo.product"
              :key="index">
              <div class="trow">
                <div class="tcol">{{item.product_code}}</div>
                <div class="tcol">{{item.total_number}}</div>
                <div class="tcol">{{item.pre_price}}{{orderInfo.settle_unit}}</div>
                <div class="tcol">{{item.total_price}}{{orderInfo.settle_unit}}</div>
                <div class="tcol oprCtn">
                  <div class="opr hoverBlue"
                    @click="item.showDetail=!item.showDetail;$forceUpdate()">{{item.showDetail?'收起详情':'展开详情'}}</div>
                </div>
              </div>
              <template v-if="item.showDetail">
                <div class="thead"
                  style="border-top:0">
                  <div class="trow">
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">数量</div>
                    <div class="tcol">单价</div>
                    <div class="tcol">总价</div>
                    <div class="tcol"></div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.detail"
                    :key="indexChild">
                    <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                    <div class="tcol">{{itemChild.number}}</div>
                    <div class="tcol">{{itemChild.price}}{{orderInfo.settle_unit}}</div>
                    <div class="tcol">{{itemChild.total_price}}{{orderInfo.settle_unit}}</div>
                    <div class="tcol"></div>
                  </div>
                </div>
              </template>
              <div class="thead"
                style="border-top:0"
                v-if="item.quote_info">
                <div class="trow">
                  <div class="tcol">报价费用</div>
                  <div class="tcol">-</div>
                  <div class="tcol blue">{{item.quote_info.price}}{{orderInfo.settle_unit}}</div>
                  <div class="tcol blue">{{item.quote_info.total_price}}{{orderInfo.settle_unit}}</div>
                  <div class="tcol"
                    :class="{'red':item.quote_info.change.indexOf('上浮')!==-1,'green':item.quote_info.change.indexOf('下降')!==-1}">{{item.quote_info.change}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="titleIn">物料费用</div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">费用类型</div>
                <div class="tcol">采购合计数量</div>
                <div class="tcol noPad"
                  style="flex:8">
                  <div class="trow">
                    <div class="tcol">调取合计数量</div>
                    <div class="tcol">加工合计数量</div>
                    <div class="tcol">计划合计费用</div>
                    <div class="tcol">实际合计费用</div>
                    <div class="tcol">产品计划平均单价</div>
                    <div class="tcol">产品实际平均单价</div>
                    <div class="tcol">产品平均克重</div>
                    <div class="tcol">操作</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow">
                <div class="tcol">
                  <div>原料费用</div>
                </div>
                <div class="tcol">
                  <div>计划：{{financialInfo.material.material.gather.material_order.plan}}</div>
                  <div>实际：{{financialInfo.material.material.gather.material_order.plan}}</div>
                </div>
                <div class="tcol noPad"
                  style="flex:8">
                  <div class="trow">
                    <div class="tcol">
                      <div>计划：{{financialInfo.material.material.gather.material_transfer.plan}}</div>
                      <div>实际：{{financialInfo.material.material.gather.material_transfer.plan}}</div>
                    </div>
                    <div class="tcol">
                      <div>计划：{{financialInfo.material.material.gather.material_process.plan}}</div>
                      <div>实际：{{financialInfo.material.material.gather.material_process.plan}}</div>
                    </div>
                    <div class="tcol">{{financialInfo.material.material.gather.plan_price}}元</div>
                    <div class="tcol">{{financialInfo.material.material.gather.real_price}}元</div>
                    <div class="tcol">{{financialInfo.material.material.gather.product_pre_price}}元</div>
                    <div class="tcol">{{financialInfo.material.material.gather.pre_price}}元</div>
                    <div class="tcol">{{financialInfo.material.material.gather.pre_number}}g</div>
                    <div class="tcol oprCtn">
                      <div class="opr hoverBlue"
                        @click="financialInfo.material.material.showDetail=!financialInfo.material.material.showDetail;$forceUpdate()">{{financialInfo.material.material.showDetail?'收起详情':'展开详情'}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <template v-if="financialInfo.material.material.showDetail">
                <div class="thead"
                  style="border-top:0">
                  <div class="trow">
                    <div class="tcol">类型</div>
                    <div class="tcol">单位/仓库</div>
                    <div class="tcol noPad"
                      style="flex:8">
                      <div class="trow">
                        <div class="tcol">原料名称</div>
                        <div class="tcol">属性颜色</div>
                        <div class="tcol">计划数量</div>
                        <div class="tcol">最终入库数量</div>
                        <div class="tcol">单价</div>
                        <div class="tcol">计划费用</div>
                        <div class="tcol">实际费用</div>
                        <div class="tcol"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(itemOrder,indexOrder) in financialInfo.material.material.detail.material_order"
                    :key="'order' + indexOrder">
                    <div class="tcol">订购</div>
                    <div class="tcol">{{itemOrder.client_name}}</div>
                    <div class="tcol noPad"
                      style="flex:8">
                      <div class="trow"
                        v-for="(itemMat,indexMat) in itemOrder.info"
                        :key="indexMat">
                        <div class="tcol">{{itemMat.material_name}}</div>
                        <div class="tcol">{{itemMat.attribute}}/{{itemMat.material_color}}</div>
                        <div class="tcol">{{itemMat.number}}</div>
                        <div class="tcol">{{itemMat.real_number}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{itemMat.total_price}}元</div>
                        <div class="tcol">{{itemMat.real_total_price}}元</div>
                        <div class="tcol"></div>
                      </div>
                    </div>
                  </div>
                  <div class="trow"
                    v-for="(itemTransfer,indexTransfer) in financialInfo.material.material.detail.material_transfer"
                    :key="'transfer' + indexTransfer">
                    <div class="tcol">调取</div>
                    <div class="tcol">{{itemTransfer.store}}</div>
                    <div class="tcol noPad"
                      style="flex:8">
                      <div class="trow"
                        v-for="(itemMat,indexMat) in itemTransfer.info"
                        :key="indexMat">
                        <div class="tcol">{{itemMat.material_name}}</div>
                        <div class="tcol">{{itemMat.attribute}}/{{itemMat.material_color}}</div>
                        <div class="tcol">{{itemMat.number}}</div>
                        <div class="tcol">{{itemMat.real_number}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{itemMat.total_price}}元</div>
                        <div class="tcol">{{itemMat.real_total_price}}元</div>
                        <div class="tcol"></div>
                      </div>
                    </div>
                  </div>
                  <div class="trow"
                    v-for="(itemProcess,indexProcess) in financialInfo.material.material.detail.material_process"
                    :key="'process' + indexProcess">
                    <div class="tcol">{{itemProcess.process}}</div>
                    <div class="tcol">{{itemProcess.client_name}}</div>
                    <div class="tcol noPad"
                      style="flex:8">
                      <div class="trow"
                        v-for="(itemMat,indexMat) in itemProcess.info"
                        :key="indexMat">
                        <div class="tcol">{{itemMat.material_order_name || itemMat.material_transfer_name}}</div>
                        <div class="tcol"
                          style="flex-direction:row;align-items:center;justify-content: start;">
                          <template v-if="itemProcess.process==='染色'">
                            <div class="changeCtn">
                              <span>白胚</span>
                              <span class="el-icon-s-unfold blue"></span>
                              <span>{{itemMat.after_color}}</span>
                            </div>
                          </template>
                          <template v-if="itemProcess.process==='倒纱'">
                            <span>{{itemMat.before_attribute}}</span>
                            <span class="el-icon-s-unfold blue"></span>
                            <span>{{itemMat.after_attribute}}</span>
                          </template>
                          <template v-if="itemProcess.process==='并线'">
                            <span>{{itemMat.bingxian_desc}}</span>
                          </template>
                          <template v-if="itemProcess.process==='膨纱'">
                            <span>{{itemMat.pengsha_desc}}</span>
                          </template>
                          <template v-if="itemProcess.process==='切割'">
                            <span>{{itemMat.qiege_desc}}</span>
                          </template>
                        </div>
                        <div class="tcol">{{itemMat.number}}</div>
                        <div class="tcol">{{itemMat.real_number}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{itemMat.total_price}}元</div>
                        <div class="tcol">{{itemMat.real_total_price}}元</div>
                        <div class="tcol"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div class="thead"
                v-if="financialInfo.material.material.gather.quote_info">
                <div class="trow">
                  <div class="tcol">报价费用</div>
                  <div class="tcol">-</div>
                  <div class="tcol noPad"
                    style="flex:8">
                    <div class="trow">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol blue">{{financialInfo.material.material.gather.quote_info.quote_total_price}}元</div>
                      <div class="tcol">-</div>
                      <div class="tcol blue">-</div>
                      <div class="tcol blue">{{financialInfo.material.material.gather.quote_info.pre_product_price}}元</div>
                      <div class="tcol blue">{{financialInfo.material.material.gather.quote_info.number}}g</div>
                      <div class="tcol"
                        :class="{'red':financialInfo.material.material.gather.quote_info.change.indexOf('上浮')!==-1,'green':financialInfo.material.material.gather.quote_info.change.indexOf('下降')!==-1}">{{financialInfo.material.material.gather.quote_info.change}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">费用类型</div>
                <div class="tcol">采购合计数量</div>
                <div class="tcol noPad"
                  style="flex:7">
                  <div class="trow">
                    <div class="tcol">调取合计数量</div>
                    <div class="tcol">加工合计数量</div>
                    <div class="tcol">计划合计费用</div>
                    <div class="tcol">实际合计费用</div>
                    <div class="tcol">产品计划平均单价</div>
                    <div class="tcol">产品实际平均单价</div>
                    <div class="tcol">操作</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow">
                <div class="tcol">
                  <div>辅料费用</div>
                </div>
                <div class="tcol">
                  <div>计划：{{financialInfo.material.decorate.gather.material_order.plan}}</div>
                  <div>实际：{{financialInfo.material.decorate.gather.material_order.plan}}</div>
                </div>
                <div class="tcol noPad"
                  style="flex:7">
                  <div class="trow">
                    <div class="tcol">
                      <div>计划：{{financialInfo.material.decorate.gather.material_transfer.plan}}</div>
                      <div>实际：{{financialInfo.material.decorate.gather.material_transfer.plan}}</div>
                    </div>
                    <div class="tcol">
                      <div>计划：{{financialInfo.material.decorate.gather.material_process.plan}}</div>
                      <div>实际：{{financialInfo.material.decorate.gather.material_process.plan}}</div>
                    </div>
                    <div class="tcol">{{financialInfo.material.decorate.gather.plan_price}}元</div>
                    <div class="tcol">{{financialInfo.material.decorate.gather.real_price}}元</div>
                    <div class="tcol">{{financialInfo.material.decorate.gather.product_pre_price}}元</div>
                    <div class="tcol">{{financialInfo.material.decorate.gather.pre_price}}元</div>
                    <div class="tcol oprCtn">
                      <div class="opr hoverBlue"
                        @click="financialInfo.material.decorate.showDetail=!financialInfo.material.decorate.showDetail;$forceUpdate()">{{financialInfo.material.decorate.showDetail?'收起详情':'展开详情'}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <template v-if="financialInfo.material.decorate.showDetail">
                <div class="thead"
                  style="border-top:0">
                  <div class="trow">
                    <div class="tcol">类型</div>
                    <div class="tcol">单位/仓库</div>
                    <div class="tcol noPad"
                      style="flex:7">
                      <div class="trow">
                        <div class="tcol">原料名称</div>
                        <div class="tcol">属性颜色</div>
                        <div class="tcol">计划数量</div>
                        <div class="tcol">最终入库数量</div>
                        <div class="tcol">单价</div>
                        <div class="tcol">计划费用</div>
                        <div class="tcol">实际费用</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(itemOrder,indexOrder) in financialInfo.material.decorate.detail.material_order"
                    :key="'order' + indexOrder">
                    <div class="tcol">订购</div>
                    <div class="tcol">{{itemOrder.client_name}}</div>
                    <div class="tcol noPad"
                      style="flex:7">
                      <div class="trow"
                        v-for="(itemMat,indexMat) in itemOrder.info"
                        :key="indexMat">
                        <div class="tcol">{{itemMat.material_name}}</div>
                        <div class="tcol">{{itemMat.attribute}}/{{itemMat.material_color}}</div>
                        <div class="tcol">{{itemMat.number}}</div>
                        <div class="tcol">{{itemMat.real_number}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{itemMat.total_price}}元</div>
                        <div class="tcol">{{itemMat.real_total_price}}元</div>
                      </div>
                    </div>
                  </div>
                  <div class="trow"
                    v-for="(itemTransfer,indexTransfer) in financialInfo.material.decorate.detail.material_transfer"
                    :key="'transfer' + indexTransfer">
                    <div class="tcol">调取</div>
                    <div class="tcol">{{itemTransfer.store}}</div>
                    <div class="tcol noPad"
                      style="flex:7">
                      <div class="trow"
                        v-for="(itemMat,indexMat) in itemTransfer.info"
                        :key="indexMat">
                        <div class="tcol">{{itemMat.material_name}}</div>
                        <div class="tcol">{{itemMat.attribute}}/{{itemMat.material_color}}</div>
                        <div class="tcol">{{itemMat.number}}</div>
                        <div class="tcol">{{itemMat.real_number}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{itemMat.total_price}}元</div>
                        <div class="tcol">{{itemMat.real_total_price}}元</div>
                      </div>
                    </div>
                  </div>
                  <div class="trow"
                    v-for="(itemProcess,indexProcess) in financialInfo.material.decorate.detail.material_process"
                    :key="'process' + indexProcess">
                    <div class="tcol">{{itemProcess.process}}</div>
                    <div class="tcol">{{itemProcess.client_name}}</div>
                    <div class="tcol noPad"
                      style="flex:7">
                      <div class="trow"
                        v-for="(itemMat,indexMat) in itemProcess.info"
                        :key="indexMat">
                        <div class="tcol">{{itemMat.material_order_name || itemMat.material_transfer_name}}</div>
                        <div class="tcol">{{itemMat.after_attribute}}/{{itemMat.after_color}}</div>
                        <div class="tcol">{{itemMat.number}}</div>
                        <div class="tcol">{{itemMat.real_number}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{itemMat.total_price}}元</div>
                        <div class="tcol">{{itemMat.real_total_price}}元</div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div class="thead"
                v-if="financialInfo.material.decorate.gather.quote_info">
                <div class="trow">
                  <div class="tcol">报价费用</div>
                  <div class="tcol">-</div>
                  <div class="tcol noPad"
                    style="flex:7">
                    <div class="trow">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol blue">{{financialInfo.material.decorate.gather.quote_info.quote_total_price}}元</div>
                      <div class="tcol">-</div>
                      <div class="tcol blue">-</div>
                      <div class="tcol blue">{{financialInfo.material.decorate.gather.quote_info.pre_product_price}}元</div>
                      <div class="tcol"
                        :class="{'red':financialInfo.material.decorate.gather.quote_info.change.indexOf('上浮')!==-1,'green':financialInfo.material.decorate.gather.quote_info.change.indexOf('下降')!==-1}">{{financialInfo.material.decorate.gather.quote_info.change}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="titleIn">生产费用</div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">费用工序</div>
                <div class="tcol naPad"
                  style="flex:6">
                  <div class="trow">
                    <div class="tcol">工序说明</div>
                    <div class="tcol">生产数量</div>
                    <div class="tcol">实际完成数量</div>
                    <div class="tcol">计划合计费用</div>
                    <div class="tcol">产品计划平均单价</div>
                    <div class="tcol">产品实际平均单价</div>
                  </div>
                </div>
                <div class="tcol">操作</div>
              </div>
            </div>
            <div class="tbody"
              v-for="(item,index) in financialInfo.weave"
              :key="index">
              <div class="trow">
                <div class="tcol">{{item.process_name}}</div>
                <div class="tcol naPad"
                  style="flex:6">
                  <div class="trow">
                    <div class="tcol">{{item.process_desc}}</div>
                    <div class="tcol">{{item.number}}</div>
                    <div class="tcol">{{item.real_number}}</div>
                    <div class="tcol">{{item.total_price}}元</div>
                    <div class="tcol">{{item.product_pre_price}}元</div>
                    <div class="tcol">{{item.pre_price}}元</div>
                  </div>
                </div>
                <div class="tcol oprCtn">
                  <div class="opr hoverBlue"
                    @click="item.showDetail=!item.showDetail;$forceUpdate()">{{item.showDetail?'收起详情':'展开详情'}}</div>
                </div>
              </div>
              <template v-if="item.showDetail">
                <div class="thead">
                  <div class="trow">
                    <div class="tcol">单位名称</div>
                    <div class="tcol naPad"
                      style="flex:6">
                      <div class="trow">
                        <div class="tcol">产品信息</div>
                        <div class="tcol">尺码颜色</div>
                        <div class="tcol">计划数量</div>
                        <div class="tcol">完成数量</div>
                        <div class="tcol">单价</div>
                        <div class="tcol">计划小计</div>
                      </div>
                    </div>
                    <div class="tcol"></div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(itemClient,indexClient) in item.detail"
                    :key="indexClient">
                    <div class="tcol">{{itemClient.client}}</div>
                    <div class="tcol naPad"
                      style="flex:6">
                      <div class="trow"
                        v-for="(itemPro,indexPro) in itemClient.product_info"
                        :key="indexPro">
                        <div class="tcol">
                          <span>{{itemPro.product_code}}</span>
                          <span>({{itemPro.category_name}}/{{itemPro.secondary_category_name}})</span>
                        </div>
                        <div class="tcol">{{itemPro.size_name}}/{{itemPro.color_name}}</div>
                        <div class="tcol">{{itemPro.number}}</div>
                        <div class="tcol">{{itemPro.real_number}}</div>
                        <div class="tcol">{{itemPro.price}}元</div>
                        <div class="tcol">{{itemPro.total_price}}元</div>
                      </div>
                    </div>
                    <div class="tcol"></div>
                  </div>
                </div>
              </template>
              <div class="thead"
                v-if="item.quote_info">
                <div class="trow">
                  <div class="tcol">报价费用</div>
                  <div class="tcol naPad"
                    style="flex:6">
                    <div class="trow">
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol">-</div>
                      <div class="tcol blue">{{item.quote_info.quote_total_price}}元</div>
                      <div class="tcol blue">-</div>
                      <div class="tcol blue">{{item.quote_info.pre_product_price}}元</div>
                    </div>
                  </div>
                  <div class="tcol"
                    :class="{'red':item.quote_info.change.indexOf('上浮')!==-1,'green':item.quote_info.change.indexOf('下降')!==-1}">{{item.quote_info.change}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="titleIn">包装辅料</div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">费用类型</div>
                <div class="tcol noPad"
                  style="flex:6">
                  <div class="trow">
                    <div class="tcol">计划订购数量</div>
                    <div class="tcol">计划费用合计</div>
                    <div class="tcol">产品计划平均单价</div>
                    <div class="tcol">-</div>
                    <div class="tcol">操作</div>
                    <div class="tcol"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow">
                <div class="tcol">包装辅料</div>
                <div class="tcol noPad"
                  style="flex:6">
                  <div class="trow">
                    <div class="tcol">{{financialInfo.pack.gather.plan_number}}</div>
                    <div class="tcol">{{financialInfo.pack.gather.total_price}}元</div>
                    <div class="tcol">{{financialInfo.pack.gather.product_pre_price}}元</div>
                    <div class="tcol">-</div>
                    <div class="tcol oprCtn">
                      <div class="opr hoverBlue"
                        @click="financialInfo.pack.showDetail=!financialInfo.pack.showDetail;$forceUpdate()">{{financialInfo.pack.showDetail?'收起详情':'展开详情'}}</div>
                    </div>
                    <div class="tcol"></div>
                  </div>
                </div>
              </div>
              <template v-if="financialInfo.pack.showDetail">
                <div class="thead"
                  style="border-top:0">
                  <div class="trow">
                    <div class="tcol">采购单位</div>
                    <div class="tcol noPad"
                      style="flex:6">
                      <div class="trow">
                        <div class="tcol">辅料名称</div>
                        <div class="tcol">尺寸</div>
                        <div class="tcol">属性或说明</div>
                        <div class="tcol">计划订购数量</div>
                        <div class="tcol">单价</div>
                        <div class="tcol">总价</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in financialInfo.pack.detail"
                    :key="index">
                    <div class="tcol">{{item.client_name}}</div>
                    <div class="tcol noPad"
                      style="flex:6">
                      <div class="trow"
                        v-for="(itemPack,indexPack) in item.info"
                        :key="indexPack">
                        <div class="tcol">{{itemPack.pack_material_name}}</div>
                        <div class="tcol">{{itemPack.length}}cm*{{itemPack.width}}cm*{{itemPack.height}}cm</div>
                        <div class="tcol">{{itemPack.desc}}</div>
                        <div class="tcol">{{itemPack.number}}</div>
                        <div class="tcol">{{itemPack.count_price}}元</div>
                        <div class="tcol">{{itemPack.total_price}}元</div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div class="thead"
                v-if="financialInfo.pack.gather.quote_info">
                <div class="trow">
                  <div class="tcol">报价费用</div>
                  <div class="tcol noPad"
                    style="flex:6">
                    <div class="trow">
                      <div class="tcol">-</div>
                      <div class="tcol blue">{{financialInfo.pack.gather.quote_info.quote_total_price}}元</div>
                      <div class="tcol blue">-</div>
                      <div class="tcol blue">{{financialInfo.pack.gather.quote_info.pre_product_price}}元</div>
                      <div class="tcol"
                        :class="{'red':financialInfo.pack.gather.quote_info.change.indexOf('上浮')!==-1,'green':financialInfo.pack.gather.quote_info.change.indexOf('下降')!==-1}">{{financialInfo.pack.gather.quote_info.change}}</div>
                      <div class="tcol"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="titleIn">车间工资</div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">费用工序</div>
                <div class="tcol noPad"
                  style="flex:7">
                  <div class="trow">
                    <div class="tcol">工序说明</div>
                    <div class="tcol noPad"
                      style="flex:6">
                      <div class="trow">
                        <div class="tcol">完成数量</div>
                        <div class="tcol">额外数量</div>
                        <div class="tcol">合计结算总价</div>
                        <div class="tcol">产品计划平均单价</div>
                        <div class="tcol">-</div>
                        <div class="tcol">操作</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody"
              v-for="(item,index) in financialInfo.production_inspection"
              :key="index">
              <div class="trow">
                <div class="tcol">{{item.process_name}}</div>
                <div class="tcol noPad"
                  style="flex:7">
                  <div class="trow">
                    <div class="tcol">{{item.desc}}</div>
                    <div class="tcol noPad"
                      style="flex:6">
                      <div class="trow">
                        <div class="tcol">{{item.number}}</div>
                        <div class="tcol">{{item.extra_number}}</div>
                        <div class="tcol">{{item.total_price}}元</div>
                        <div class="tcol">{{item.product_pre_price}}元</div>
                        <div class="tcol">-</div>
                        <div class="tcol oprCtn">
                          <div class="opr hoverBlue"
                            @click="item.showDetail=!item.showDetail;$forceUpdate()">{{item.showDetail?'收起详情':'展开详情'}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <template v-if="item.showDetail">
                <div class="thead"
                  style="border-top:0">
                  <div class="trow">
                    <div class="tcol">员工姓名</div>
                    <div class="tcol noPad"
                      style="flex:7">
                      <div class="trow">
                        <div class="tcol">产品信息</div>
                        <div class="tcol noPad"
                          style="flex:6">
                          <div class="trow">
                            <div class="tcol">尺码颜色</div>
                            <div class="tcol">结算单价</div>
                            <div class="tcol">完成数量</div>
                            <div class="tcol">额外数量</div>
                            <div class="tcol">次品数量</div>
                            <div class="tcol">结算小计</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(itemStaff,indexStaff) in item.detail"
                    :key="indexStaff">
                    <div class="tcol">{{itemStaff.staff_name}}</div>
                    <div class="tcol noPad"
                      style="flex:7">
                      <div class="trow"
                        v-for="(itemPro,indexPro) in itemStaff.info"
                        :key="indexPro">
                        <div class="tcol">{{itemPro.product_code}}</div>
                        <div class="tcol noPad"
                          style="flex:6">
                          <div class="trow"
                            v-for="(itemChild,indexChild) in itemPro.info"
                            :key="indexChild">
                            <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                            <div class="tcol">{{itemChild.price}}元</div>
                            <div class="tcol">{{itemChild.number}}</div>
                            <div class="tcol">{{itemChild.extra_number}}</div>
                            <div class="tcol red">{{itemChild.shoddy_number}}</div>
                            <div class="tcol">{{itemChild.total_price}}元</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <!-- <div class="thead"
              v-if="item.quote_info">
              <div class="trow">
                <div class="tcol">报价费用</div>
                <div class="tcol noPad"
                  style="flex:7">
                  <div class="trow">
                    <div class="tcol">-</div>
                    <div class="tcol noPad"
                      style="flex:6">
                      <div class="trow">
                        <div class="tcol">-</div>
                        <div class="tcol">-</div>
                        <div class="tcol blue">{{item.quote_info.quote_total_price}}元</div>
                        <div class="tcol blue">{{item.quote_info.pre_price}}元</div>
                        <div class="tcol blue">{{item.quote_info.pre_product_price}}元</div>
                        <div class="tcol"
                          :class="{'red':item.quote_info.change.indexOf('上浮')!==-1,'green':item.quote_info.change.indexOf('下降')!==-1}">{{item.quote_info.change}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            </div>
          </div>
        </template>
      </div>
    </template>
    <!-- <div class="module">
      <div class="titleCtn">
        <div class="title">装箱运输</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">费用类型</div>
            <div class="tcol">运输立方</div>
            <div class="tcol noPad">计划费用合计</div>
            <div class="tcol">费用平均单价</div>
            <div class="tcol">产品平均单价</div>
            <div class="tcol">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow">
            <div class="tcol">费用类型</div>
            <div class="tcol">运输立方</div>
            <div class="tcol noPad">计划费用合计</div>
            <div class="tcol">费用平均单价</div>
            <div class="tcol">产品平均单价</div>
            <div class="tcol">操作</div>
          </div>
        </div>
        <div class="thead"
          style="border-top:0">
          <div class="trow">
            <div class="tcol">运输单位</div>
            <div class="tcol">运输城市/地址</div>
            <div class="tcol noPad">
              <div class="trow">
                <div class="tcol">总箱数</div>
                <div class="tcol">毛重</div>
                <div class="tcol">净重</div>
              </div>
            </div>
            <div class="tcol">总体积</div>
            <div class="tcol">运输单价</div>
            <div class="tcol">运输总价</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow">
            <div class="tcol">运输单位</div>
            <div class="tcol">运输城市/地址</div>
            <div class="tcol noPad">
              <div class="trow">
                <div class="tcol">总箱数</div>
                <div class="tcol">毛重</div>
                <div class="tcol">净重</div>
              </div>
            </div>
            <div class="tcol">总体积</div>
            <div class="tcol">运输单价</div>
            <div class="tcol">运输总价</div>
          </div>
        </div>
        <div class="thead"
          style="border-top:0">
          <div class="trow">
            <div class="tcol">报价费用</div>
            <div class="tcol">-</div>
            <div class="tcol noPad">0</div>
            <div class="tcol">-f</div>
            <div class="tcol">0</div>
            <div class="tcol">同比增长</div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- <div class="module">
      <div class="titleCtn">
        <div class="title">扣款费用</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">扣款项目</div>
            <div class="tcol">扣款单位</div>
            <div class="tcol">扣款原因</div>
            <div class="tcol">扣款金额</div>
            <div class="tcol">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow">
            <div class="tcol">扣款项目</div>
            <div class="tcol">扣款单位</div>
            <div class="tcol">扣款原因</div>
            <div class="tcol">扣款金额</div>
            <div class="tcol">操作</div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn"
          style="float:left"
          @click="orderLogFlag=true">
          <div class="btn backHoverBlue ">关联单据</div>
        </div>
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
                <!-- <div class="btn backHoverBlue">
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
                </div> -->
                <div class="btn backHoverOrange"
                  @click="$router.push('/order/create?id='+$route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">复制订单</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$router.push('/quotedPrice/create?orderId='+$route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">转报价单</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="checkOpr">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">操作记录</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="cancelOrderFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">订单结余</span>
                </div>
                <div class="btn backHoverRed"
                  @click="cancelOrder">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">取消订单</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 操作记录 -->
    <div class="popup"
      v-show="oprLogFlag">
      <div class="main"
        style="width:1200px">
        <div class="titleCtn">
          <span class="text">操作记录</span>
          <div class="closeCtn"
            @click="oprLogFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="tableCtn noPad"
            style="margin:12px 0">
            <div class="thead">
              <div class="trow">
                <div class="tcol"
                  style="max-width:22px">序号</div>
                <div class="tcol"
                  style="max-width:89px">修改日期</div>
                <div class="tcol"
                  style="max-width:66px">修改人</div>
                <div class="tcol">订单修改详情</div>
                <div class="tcol noPad"
                  style="flex:4">
                  <div class="trow">
                    <div class="tcol">批次修改详情</div>
                    <div class="tcol noPad"
                      style="flex:3">
                      <div class="trow">
                        <div class="tcol">产品修改详情</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(item,index) in oprLog"
                :key="item.id">
                <div class="tcol"
                  style="max-width:22px">{{index+1}}</div>
                <div class="tcol"
                  style="max-width:89px">{{item.update_time.slice(0,10)}}</div>
                <div class="tcol"
                  style="max-width:66px">{{item.user}}</div>
                <div class="tcol">
                  <div class="line"
                    v-if="item.update_data">
                    <span class="label blue">订单修改信息:</span>
                    <div class="line">{{item.update_data}}</div>
                  </div>
                  <div class="line"
                    v-if="item.order_time_activity_log[0].update_data">
                    <span class="label blue">其他修改信息:</span>
                    <div class="line">{{item.order_time_activity_log[0].update_data}}</div>
                  </div>
                </div>
                <div class="tcol noPad"
                  style="flex:4">
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.order_time_activity_log[0].batch_activity_log"
                    :key="indexChild">
                    <div class="tcol">
                      <div class="line">
                        <span class="label">
                          <span class="blue">批次:</span>
                          <span>第{{itemChild.batch_number}}批</span>
                        </span>
                      </div>
                      <div class="line"
                        v-if="itemChild.update_data">
                        <span class="label blue">批次修改信息:</span>
                        <div class="line">{{itemChild.update_data}}</div>
                      </div>
                    </div>
                    <div class="tcol noPad"
                      style="flex:3">
                      <div class="trow"
                        v-for="(itemPro,indexPro) in itemChild.batch_product_activity_log"
                        :key="indexPro">
                        <div class="tcol">
                          <div class="line">
                            <span class="label blue">产品{{indexPro+1}}修改信息:</span>
                            <div class="line"
                              v-for="itemSon in itemPro.product_info_activity_log"
                              :key="itemSon.id">{{itemSon.update_data}}</div>
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
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="oprLogFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="oprLogFlag=false">确认</span>
        </div>
      </div>
    </div>
    <!-- 订单结余 -->
    <div class="popup"
      v-if="cancelOrderFlag">
      <div class="main"
        style="width:1200px">
        <div class="titleCtn">
          <span class="text">订单结余</span>
          <div class="closeCtn"
            @click="cancelOrderBack">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn"
          style="min-height:400px">
          <div class="stepCtn">
            <div class="step"
              :class="{'active':cancleOrderStep===1}">
              <div class="circle">
                <span class="white">1</span>
              </div>
              <div class="name">原料结余</div>
            </div>
            <div class="step"
              :class="{'active':cancleOrderStep===2}">
              <div class="circle">
                <span class="white">2</span>
              </div>
              <div class="name">产品结余</div>
            </div>
          </div>
          <template v-if="cancleOrderStep===1">
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">入库仓库</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader :options="yarnStoreArr"
                      placeholder="请选择仓库"
                      v-model="materialStockInfo.store_arr"></el-cascader>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">关联单据</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="orderInfo.code"
                      placeholder="关联单据"
                      disabled></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">出入库类型</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <div class="disableInput">订单结余入库</div>
                  </div>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in materialStockInfo.info_data"
                :key="index">
                <div class="col"
                  style="min-width:200px">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">物料名称</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="原料名称"
                      v-model="item.material_id"
                      @change="getMatUnit($event,item)">
                      <el-option v-for="(item,index) in materialDetail"
                        :key="index"
                        :label="item.material_name"
                        :value="item.material_id"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">物料颜色</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info elCtn">
                    <el-autocomplete placeholder="物料颜色"
                      v-model="item.material_color"
                      :fetch-suggestions="(str,cb)=>{return searchColor(str,cb,item.colorList)}"></el-autocomplete>
                  </div>
                </div>
                <div class="col"
                  style="max-width:88px">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">属性</span>
                  </div>
                  <div class="info elCtn">
                    <el-autocomplete class="once"
                      v-model="item.attribute"
                      :fetch-suggestions="searchAttribute"
                      placeholder="物料属性"></el-autocomplete>
                  </div>
                </div>
                <div class="col"
                  style="max-width:88px">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">批号</span>
                  </div>
                  <div class="info elCtn">
                    <el-input :ref="'batch_code-'+index"
                      @keydown.native="$focusByKeydown($event,'batch_code',[index],materialStockInfo,['info_data'])"
                      placeholder="批号"
                      v-model="item.batch_code"></el-input>
                  </div>
                </div>
                <div class="col"
                  style="max-width:88px">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">缸号</span>
                  </div>
                  <div class="info elCtn">
                    <el-input :ref="'vat_code-'+index"
                      @keydown.native="$focusByKeydown($event,'vat_code',[index],materialStockInfo,['info_data'])"
                      placeholder="缸号"
                      v-model="item.vat_code"></el-input>
                  </div>
                </div>
                <div class="col"
                  style="max-width:88px">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">色号</span>
                  </div>
                  <div class="info elCtn">
                    <el-input :ref="'color_code-'+index"
                      @keydown.native="$focusByKeydown($event,'color_code',[index],materialStockInfo,['info_data'])"
                      placeholder="色号"
                      v-model="item.color_code"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">入库数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input :ref="'number-'+index"
                      @keydown.native="$focusByKeydown($event,'number',[index],materialStockInfo,['info_data'])"
                      placeholder="数量"
                      v-model="item.number">
                      <template slot="append">{{item.unit}}</template>
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">入库件数</span>
                  </div>
                  <div class="info elCtn">
                    <el-input :ref="'item-'+index"
                      @keydown.native="$focusByKeydown($event,'item',[index],materialStockInfo,['info_data'])"
                      placeholder="入库件数"
                      v-model="item.item"></el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="index===0"
                  @click="$addItem(materialStockInfo.info_data,{
                    material_name: '',
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
                  })">添加</div>
                <div class="opr hoverRed"
                  v-if="index>0"
                  @click="$deleteItem(materialStockInfo.info_data,index)">删除</div>
              </div>
              <div class="row">
                <div class="col"
                  style="min-width: 685px;">
                  <div class="label">
                    <span class="text">备注信息</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="materialStockInfo.desc"
                      placeholder="备注信息"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">入库日期</span>
                  </div>
                  <div class="info elCtn">
                    <el-date-picker style="width:100%"
                      placeholder="请选择入库日期"
                      v-model="materialStockInfo.complete_time"
                      value-format="yyyy-MM-dd"></el-date-picker>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="cancleOrderStep===2">
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">入库仓库</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader :options="proStoreArr"
                      placeholder="请选择仓库"
                      v-model="productStockInfo.store_arr"></el-cascader>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">关联单据</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="orderInfo.code"
                      placeholder="关联单据"
                      disabled></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">出入库类型</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <div class="disableInput">{{productStockInfo.action_type | productStockTypeFilter}}</div>
                  </div>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in productStockInfo.info_data"
                :key="index">
                <div class="col"
                  style="min-width: 685px;">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">产品信息</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select v-model="item.tree_data"
                      placeholder="产品信息">
                      <el-option v-for="(item,index) in productAllList"
                        :key="index"
                        :label="item.product_code + '('+item.category + '/' +item.secondary_category+')' + '/' + item.size_name + '/' + item.color_name"
                        :value="item.product_id+'/'+item.size_id+'/'+item.color_id"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">产品价值</span>
                      </div>
                      <div class="info elCtn">
                        <el-input :ref="'price-'+index"
                          v-model="item.price"
                          placeholder="产品价值"
                          @keydown.native="$focusByKeydown($event,'price',[index],productStockInfo,['info_data'])"></el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">入库数</span>
                        <span class="explanation">(不填为0)</span>
                      </div>
                      <div class="info elCtn">
                        <el-input :ref="'number-'+index"
                          v-model="item.number"
                          placeholder="入库数"
                          @keydown.native="$focusByKeydown($event,'number',[index],productStockInfo,['info_data'])"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="index===0"
                  @click="$addItem(productStockInfo.info_data,{
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
                    number: '',
                    tree_data: ''
                  })">添加</div>
                <div class="opr hoverRed"
                  v-if="index>0"
                  @click="$deleteItem(productStockInfo.info_data,index)">删除</div>
              </div>
              <div class="row">
                <div class="col"
                  style="min-width: 685px;">
                  <div class="label">
                    <span class="text">备注信息</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="productStockInfo.desc"
                      placeholder="备注信息"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">入库日期</span>
                  </div>
                  <div class="info elCtn">
                    <el-date-picker style="width:100%"
                      placeholder="请选择入库日期"
                      v-model="productStockInfo.complete_time"
                      value-format="yyyy-MM-dd"></el-date-picker>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="cancelOrderBack">取消</span>
          <span class="btn backHoverOrange"
            v-if="cancleOrderStep!==1"
            @click="cancleOrderStep--">结余物料</span>
          <span class="btn backHoverGreen"
            v-if="cancleOrderStep!==2"
            @click="cancleOrderStep++">结余产品</span>
          <span class="btn backHoverBlue"
            @click="cancleOrderStep===1?saveMatRest():saveProRest()">确认结余</span>
        </div>
      </div>
    </div>
    <!-- 产前寄送样 -->
    <zh-order-send :editFlag="true"
      :time_id="orderInfo.time_data[0].id"
      :data="orderInfo.time_data[0].send_info"
      :show="sendFlag"
      @close="sendFlag=false"></zh-order-send>
    <!-- 产前确认 -->
    <zh-order-check :show="proCheckFlag"
      @close="proCheckFlag=false"></zh-order-check>
    <!-- 关联单据 -->
    <zh-order-log :order_id="$route.query.id"
      :order_time_id="orderInfo.time_data[0].id"
      :show="orderLogFlag"
      @close="orderLogFlag=false"></zh-order-log>
    <product-detail :data="productDetail"
      :show="productShow"
      @close="productShow = false"></product-detail>
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{orderInfo.time_data[0].is_check=ev;$forceUpdate()}"
      :show="checkFlag"
      :pid="orderInfo.time_data[0].id"
      :check_type="1"
      :reason="[]"></zh-check>
    <zh-check-detail :pid="orderInfo.time_data[0].id"
      :check_type="1"
      :show="checkDetailFlag"
      @close="checkDetailFlag=false"></zh-check-detail>
    <!-- 侧边导航栏 -->
    <zh-side-nav :data="[{
      name:'基本信息',
      mark:'#基本信息'
    },{
      name:'产品信息',
      mark:'#产品信息'
    },{
      name:'生产汇总表',
      mark:'#生产汇总表'
    },{
      name:'批次信息',
      mark:'#批次信息'
    },{
      name:'物料汇总信息',
      mark:'#物料汇总信息'
    },{
      name:'财务概览',
      mark:'#财务概览'
    }]"></zh-side-nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { materialStock, order, productStock, store } from '@/assets/js/api'
import { OrderBatch, OrderInfo, OrderProductFlatten, OrderProductMerge, OrderTime } from '@/types/order'
import { ProductStockInfo } from '@/types/productStock'
import { MaterialStockInfo } from '@/types/materialStock'
import { yarnAttributeArr } from '@/assets/js/dictionary'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  data(): {
    materialStockInfo: MaterialStockInfo
    productStockInfo: ProductStockInfo
    orderInfo: OrderDetail
    [propName: string]: any
  } {
    return {
      proCheckFlag: false,
      sendFlag: false,
      loading: true,
      checkFlag: false,
      checkAll: false,
      checkDetailFlag: false,
      show_material: false,
      show_production: false,
      show_financial: false,
      cancelOrderFlag: false,
      cancelOrderChangeFlag: false,
      productAllList: [],
      cancleOrderStep: 1,
      proStoreArr: [],
      yarnStoreArr: [],
      productStockInfo: {
        action_type: 2,
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
        rel_doc_id: '',
        rel_doc_code: '',
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
            number: '',
            tree_data: ''
          }
        ]
      },
      materialStockInfo: {
        material_type: 1,
        action_type: 6,
        rel_doc_type: '',
        rel_doc_id: '',
        rel_doc_code: '',
        complete_time: this.$getDate(new Date()),
        client_id: '',
        store_arr: [],
        tree_data: [],
        desc: '',
        store_id: '',
        secondary_store_id: '',
        move_store_id: '',
        move_secondary_store_id: '',
        move_store_arr: [],
        info_data: [
          {
            material_name: '',
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
            send_info: {
              other_desc: '',
              info: [
                {
                  order_type: '',
                  send_time: '',
                  number: ''
                }
              ]
            },
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
      oprLogFlag: false,
      oprLog: [],
      materialDetail: [],
      productionDetail: [],
      productionProgress: {
        weave: 0,
        inspection: 0
      },
      materialProgress: {
        material_pop: 0,
        material_push: 0
      },
      materialUpdateTime: {
        order: '',
        pop: '',
        process: '',
        push: '',
        transfer: ''
      },
      productionUpdateTime: {
        complete: '',
        inspection: '',
        weave: '',
        order: '',
        plan: ''
      },
      productShow: false,
      financialInfo: {
        product: [],
        material: {
          decorate: {
            detail: {
              material_order: [],
              material_process: [],
              material_transfer: []
            },
            gather: {
              plan_price: 0,
              pre_price: 0,
              product_pre_price: 0,
              real_price: 0,
              material_order: {
                plan: 0,
                real: 0
              },
              material_process: {
                plan: 0,
                real: 0
              },
              material_transfer: {
                plan: 0,
                real: 0
              },
              quote_info: {
                quote_total_price: 0,
                pre_product_price: 0,
                pre_price: 0,
                change: ''
              }
            }
          },
          material: {
            detail: {
              material_order: [],
              material_process: [],
              material_transfer: []
            },
            gather: {
              plan_price: 0,
              pre_price: 0,
              product_pre_price: 0,
              real_price: 0,
              material_order: {
                plan: 0,
                real: 0
              },
              material_process: {
                plan: 0,
                real: 0
              },
              material_transfer: {
                plan: 0,
                real: 0
              },
              quote_info: {
                quote_total_price: 0,
                pre_product_price: 0,
                pre_price: 0,
                change: ''
              }
            }
          }
        },
        pack: {
          detail: [],
          gather: {
            plan_number: 0,
            pre_price: 0,
            product_pre_price: 0,
            total_price: 0,
            quote_info: {
              quote_total_price: 0,
              pre_product_price: 0,
              pre_price: 0,
              change: ''
            }
          }
        }
      },
      orderLogFlag: false
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
      this.$refs.materialRef.scrollLeft += step
    },
    getMatUnit(id: number, info: any) {
      const finded = this.materialDetail.find((item: any) => item.material_id === id)
      info.unit = finded.color_info[0].unit
      info.colorList = finded.color_info
    },
    searchAttribute(str: string, cb: Function) {
      let results = str
        ? yarnAttributeArr.filter((item: any) => {
            return item.value.toLowerCase().indexOf(str.toLowerCase()) === 0
          })
        : yarnAttributeArr.slice(0, 10)
      cb(results)
    },
    searchColor(str: string, cb: Function, colorList: any[]) {
      if (colorList) {
        const realColorList = colorList.map((item) => {
          return {
            value: item.material_color
          }
        })
        let results = str
          ? realColorList.filter((item) => {
              return item.value.toLowerCase().indexOf(str.toLowerCase()) === 0
            })
          : realColorList.slice(0, 10)
        // 调用 callback 返回建议列表的数据
        cb(results)
      } else {
        cb([])
      }
    },
    saveMatRest() {
      const formCheck =
        this.$formCheck(this.materialStockInfo, [
          {
            key: 'store_arr',
            regNormal: 'checkArr',
            errMsg: '请选择入库仓库'
          }
        ]) ||
        this.materialStockInfo.info_data.some((item) => {
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
              errMsg: '请输入入库数量'
            }
          ])
        })
      if (!formCheck) {
        this.getMatCmpData()
        materialStock.create({ data: [this.materialStockInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('结余入库成功')
            this.cancelOrderFlag = true
            this.cancleOrderStep = 2
          }
        })
      }
    },
    getMatCmpData() {
      // @ts-ignore
      this.materialStockInfo.store_id = this.materialStockInfo.store_arr[0]
      // @ts-ignore
      this.materialStockInfo.secondary_store_id = this.materialStockInfo.store_arr[1]
      this.materialStockInfo.info_data.forEach((item) => {
        item.batch_code = item.batch_code || '无'
        item.vat_code = item.vat_code || '无'
        item.color_code = item.color_code || '无'
      })
    },
    getProCmpData() {
      // @ts-ignore
      this.productStockInfo.store_id = this.productStockInfo.store_arr[0]
      // @ts-ignore
      this.productStockInfo.secondary_store_id = this.productStockInfo.store_arr[1]
      this.productStockInfo.info_data.forEach((item) => {
        const arr = item.tree_data!.split('/')
        item.product_id = arr[0]
        item.size_id = arr[1]
        item.color_id = arr[2]
      })
    },
    saveProRest() {
      const formCheck =
        this.$formCheck(this.productStockInfo, [
          {
            key: 'store_arr',
            errMsg: '请选择仓库',
            regNormal: 'checkArr'
          }
        ]) ||
        this.productStockInfo.info_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'tree_data',
              errMsg: '请选择产品信息'
            },
            {
              key: 'number',
              errMsg: '请输入入库数'
            }
          ])
        })
      if (!formCheck) {
        this.getProCmpData()
        productStock.create(this.productStockInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('结余入库成功')
            this.cancelOrderFlag = true
          }
        })
      }
    },
    // 取消订单关闭
    cancelOrderBack() {
      if (!this.cancelOrderChangeFlag) {
        this.cancelOrderFlag = false
      } else {
        this.$confirm('检测到已有原料结余/产品结余操作，现在关闭窗口无法撤销操作，是否继续?', '提示', {
          confirmButtonText: '继续关闭',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {})
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
    },
    goQuotedPrice(item: any) {
      if (item.rel_quote_info.quote_id) {
        this.$openUrl('/quotedPrice/detail?id=' + item.rel_quote_info.quote_id)
      } else {
        this.$confirm('是否添加新的报价单?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '添加新报价单',
          cancelButtonText: '复制订单号去报价单列表查询已有报价单绑定',
          type: 'warning'
        })
          .then(() => {
            this.$openUrl('/quotedPrice/create?orderId=' + this.$route.query.id + '&product_id=' + item.product_id)
          })
          .catch((action: any) => {
            if (action === 'cancel') {
              this.$copyTextInfo(this.orderInfo.code)
              this.$openUrl(
                '/quotedPrice/list?page=1&keyword=&client_id=' +
                  this.orderInfo.client_id +
                  '&contacts_id=' +
                  this.orderInfo.contacts_id +
                  '&status=null&date='
              )
            } else {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            }
          })
      }
    },
    confirmOrderBatch(batch: OrderBatch[]) {
      if (batch.length === 0) {
        this.$message.error('请选择要确认完成的批次')
        return
      }
      let transportFlag = true
      let transportIndex = 0
      batch.forEach((item, index) => {
        item.product_data.forEach((itemPro) => {
          itemPro.product_info.forEach((itemChild) => {
            // @ts-ignore
            if (Number(itemChild.transport_number) === 0) {
              transportFlag = false
              transportIndex = index + 1
            }
          })
        })
      })
      if (!transportFlag) {
        this.$confirm('检测到第' + transportIndex + '批次中包含未发货的产品，填写实际发货数量后才能确认完成?', '提示', {
          confirmButtonText: '填写实际发货数量',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push('/boxManage/orderDetail?id=' + this.$route.query.id)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        return
      }
      this.$confirm('请仔细确认实际发货数量，确认完成后，完成状态无法撤销。?', '提示', {
        confirmButtonText: '确认完成',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          order
            .confirmBatch({
              batch_id: batch.map((item) => Number(item.id))
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '批次确认完成!'
                })
                batch.forEach((item) => (item.status = 2))
                this.$forceUpdate()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    cancelOrder() {
      this.$confirm(
        '确认提交后，订单状态将切换为“已取消”，且状态不能撤回。该订单将从列表中过滤，如需查询，请通过订单状态筛选，进行查询。是否继续？?',
        '提示',
        {
          confirmButtonText: '确认取消',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          order
            .cancel({
              id: Number(this.orderInfo.time_data[0].id)
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '取消成功!'
                })
                window.location.reload()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    deleteOrder() {
      this.$confirm(
        this.orderInfo.status === 1
          ? '是否删除该订单？'
          : '该订单已在进行中，删除订单会将后续所有关联单据同步删除，是否继续？',
        '提示',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
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
    },
    // 操作记录
    checkOpr() {
      this.loading = true
      order
        .oprLog({
          id: Number(this.$route.query.id)
        })
        .then((res) => {
          if (res.data.status) {
            this.oprLog = res.data.data
            if (this.oprLog.length > 0) {
              this.oprLogFlag = true
            } else {
              this.$message.warning('暂无操作记录')
            }
          }
          this.loading = false
        })
    },
    // 从订单里面拿到产品信息
    getOrderProduct(orderInfo: OrderDetail): OrderProductMerge[] {
      const flattenArr: OrderProductFlatten[] = [] // 存储return信息
      orderInfo.time_data[0].batch_data.forEach((itemBatch) => {
        itemBatch.product_data.forEach((itemPro) => {
          itemPro.product_info.forEach((itemChild) =>
            flattenArr.push({
              material_info: itemChild.material_info || [],
              quote_product_id: itemPro.quote_product_id,
              quote_rel_product_info: itemPro.quote_rel_product_info,
              color_id: itemChild.color_id,
              color_name: itemChild.color_name,
              size_id: itemChild.size_id,
              size_name: itemChild.size_name,
              order_number: itemChild.number,
              price: itemChild.price,
              product_code: itemPro.product_code,
              system_code: itemPro.system_code,
              name: itemPro.name,
              product_id: itemPro.product_id,
              category: itemPro.category,
              secondary_category: itemPro.secondary_category,
              process_data: itemPro.process_data,
              plan_number: itemChild.plan_number,
              part_data: [
                {
                  name: '大身',
                  id: 0, // 大身给零，接口写的
                  unit: '件'
                }
              ].concat(itemPro.part_data as any[])
            })
          )
        })
      })
      const mergeArr: OrderProductMerge[] = this.$mergeData(flattenArr, {
        mainRule: ['product_id', 'color_id', 'size_id'],
        otherRule: [
          { name: 'name' },
          { name: 'system_code' },
          { name: 'secondary_category' },
          { name: 'category' },
          { name: 'product_code' },
          { name: 'part_data' },
          { name: 'process_data' },
          { name: 'quote_product_id' },
          { name: 'quote_rel_product_info' },
          { name: 'color_name' },
          { name: 'size_name' }
        ]
      })
      return mergeArr
    },
    getMaterialDetail(init?: boolean) {
      if (this.materialDetail.length === 0) {
        order
          .materialDetail({
            order_id: Number(this.orderInfo.time_data[0].id)
          })
          .then((res) => {
            this.loading = false
            if (res.data.status) {
              this.materialDetail = res.data.data.data
              this.materialProgress = res.data.data.progress
              this.materialUpdateTime = res.data.data.update_time
              this.$nextTick(() => {
                if (!init) {
                  this.show_material = true
                }
              })
            }
          })
      } else {
        this.$nextTick(() => {
          this.show_material = true
        })
      }
    },
    getProductionDetail(init?: boolean) {
      if (this.productionDetail.length === 0) {
        order
          .productionDetail({
            order_time_id: Number(this.orderInfo.time_data[0].id)
          })
          .then((res) => {
            this.loading = false
            if (res.data.status) {
              this.productionDetail = res.data.data.data
              this.productionProgress = res.data.data.progress
              this.productionUpdateTime = res.data.data.update_time
              this.$nextTick(() => {
                if (!init) {
                  this.show_production = true
                }
              })
            }
          })
      } else {
        this.$nextTick(() => {
          this.show_production = true
        })
      }
    }
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
            itemTime.batch_data.forEach((itemBatch, indexBatch) => {
              this.productList = this.productList.concat(
                itemBatch.product_data.map((item) => {
                  // @ts-ignore 产品信息里加个批次序号，用于区分不同批次相同产品
                  item.batchIndex = indexBatch + 1
                  return item
                })
              )
            })
          })
          this.productAllList = this.getOrderProduct(this.orderInfo)
          // 无loading加载汇总表
          this.getMaterialDetail(true)
          this.getProductionDetail(true)
          this.loading = false
        }
      })
    // 财务信息--仅管理员可见
    if (Number(this.$getsessionStorage('has_check')) === 1) {
      order
        .financial({
          order_id: Number(this.$route.query.id),
          product_id: ''
        })
        .then((res) => {
          if (res.data.status) {
            this.financialInfo = res.data.data
          }
        })
    }
    // 结余仓库
    store.list({}).then((res) => {
      if (res.data.status) {
        this.yarnStoreArr = res.data.data
          .filter((item: any) => item.store_type === 1 || item.store_type === 2)
          .map((item: any) => {
            return {
              label: item.name,
              value: item.id,
              children: item.secondary_store.map((itemChild: any) => {
                return {
                  label: itemChild.name,
                  value: itemChild.id
                }
              })
            }
          })
        this.proStoreArr = res.data.data
          .filter((item: any) => item.store_type === 5)
          .map((item: any) => {
            return {
              label: item.name,
              value: item.id,
              children: item.secondary_store.map((itemChild: any) => {
                return {
                  label: itemChild.name,
                  value: itemChild.id
                }
              })
            }
          })
      }
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/order/detail.less';
</style>