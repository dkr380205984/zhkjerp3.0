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
            :content="orderInfo.time_data[0].is_check===3?'点击查看异常处理办法':'点击查看审核日志'"
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
            <div class="text">{{orderInfo.settle_tax}}</div>
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
              :class="orderInfo.desc?'':'gray'">{{orderInfo.desc || '无备注信息'}}</div>
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
            <div class="tcol">修改意见</div>
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
            <div class="tcol">{{item.client_edit_idea||'无'}}</div>
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
        hideTitle="点击查看图表">
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
                  <div class="tcol center">
                    <span>
                      调取信息
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'更新日期:'+(materialUpdateTime.transfer?materialUpdateTime.transfer:'暂无')"
                        placement="top">
                        <i class="el-icon-info blue"></i>
                      </el-tooltip>
                    </span>
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
                    <span>
                      采购信息
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'更新日期:'+(materialUpdateTime.order?materialUpdateTime.order:'暂无')"
                        placement="top">
                        <i class="el-icon-info blue"></i>
                      </el-tooltip>
                    </span>
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
                    <span>
                      加工信息
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'更新日期:'+(materialUpdateTime.process?materialUpdateTime.process:'暂无')"
                        placement="top">
                        <i class="el-icon-info blue"></i>
                      </el-tooltip>
                    </span>
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
                    <span>
                      入库信息
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'更新日期:'+(materialUpdateTime.push?materialUpdateTime.push:'暂无')"
                        placement="top">
                        <i class="el-icon-info blue"></i>
                      </el-tooltip>
                    </span>
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
                    <span>
                      出库信息
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'更新日期:'+(materialUpdateTime.pop?materialUpdateTime.pop:'暂无')"
                        placement="top">
                        <i class="el-icon-info blue"></i>
                      </el-tooltip>
                    </span>
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
        hideTitle="点击查看图表">
        <div class="tableCtn samallFont">
          <div class="thead"
            style="height:auto">
            <div class="trow">
              <div class="tcol center"
                style="min-width: 379px;">
                <span>
                  下单信息
                  <el-tooltip class="item"
                    effect="dark"
                    :content="'更新日期:'+(productionUpdateTime.order?productionUpdateTime.order:'暂无')"
                    placement="top">
                    <i class="el-icon-info blue"></i>
                  </el-tooltip>
                </span>
              </div>
              <div class="tcol center"
                style="min-width: 235px;">
                <span>
                  计划信息
                  <el-tooltip class="item"
                    effect="dark"
                    :content="'更新日期:'+(productionUpdateTime.plan?productionUpdateTime.plan:'暂无')"
                    placement="top">
                    <i class="el-icon-info blue"></i>
                  </el-tooltip>
                </span>
              </div>
              <div class="tcol center"
                style="min-width: 208px;">
                <span>
                  生产分配信息
                  <el-tooltip class="item"
                    effect="dark"
                    :content="'更新日期:'+(productionUpdateTime.weave?productionUpdateTime.weave:'暂无')"
                    placement="top">
                    <i class="el-icon-info blue"></i>
                  </el-tooltip>
                </span>
              </div>
              <div class="tcol center">
                <span>
                  数量更新信息
                  <el-tooltip class="item"
                    effect="dark"
                    :content="'更新日期:'+(productionUpdateTime.complete?productionUpdateTime.complete:'暂无')"
                    placement="top">
                    <i class="el-icon-info blue"></i>
                  </el-tooltip>
                </span>
              </div>
              <div class="tcol center">
                <span>
                  检验收发信息
                  <el-tooltip class="item"
                    effect="dark"
                    :content="'更新日期:'+(productionUpdateTime.inspection?productionUpdateTime.inspection:'暂无')"
                    placement="top">
                    <i class="el-icon-info blue"></i>
                  </el-tooltip>
                </span>
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
                      <div class="tcol">计划数量</div>
                      <div class="tcol noPad"
                        style="flex:6">
                        <div class="trow">
                          <div class="tcol">生产单位</div>
                          <div class="tcol noPad"
                            style="flex:5">
                            <div class="trow">
                              <div class="tcol">生产工序</div>
                              <div class="tcol">完成数量</div>
                              <div class="tcol">检验入库数量</div>
                              <div class="tcol">次品数量</div>
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
                      <div class="tcol">{{itemSize.data.plan_number}}</div>
                      <div class="tcol noPad"
                        style="flex:6">
                        <div class="trow"
                          v-for="(itemClient,indexClient) in itemSize.data.weave_info"
                          :key="indexClient">
                          <div class="tcol">{{itemClient.client_name}}</div>
                          <div class="tcol noPad"
                            style="flex:5">
                            <div class="trow"
                              v-for="(itemChild,indexChild) in itemClient.data"
                              :key="indexChild">
                              <div class="tcol">{{itemChild.process_name}}</div>
                              <div class="tcol">{{itemChild.data.real_number}}</div>
                              <div class="tcol">{{itemChild.data.inspection_number}}</div>
                              <div class="tcol">{{itemChild.data.shoddy_number}}</div>
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
                    <div class="tcol">费用平均单价</div>
                    <div class="tcol">产品平均单价</div>
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
                    <div class="tcol">-</div>
                    <div class="tcol">{{financialInfo.material.material.gather.product_pre_price}}元</div>
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
                    <div class="tcol">费用平均单价</div>
                    <div class="tcol">产品平均单价</div>
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
                    <div class="tcol">-</div>
                    <div class="tcol">{{financialInfo.material.decorate.gather.product_pre_price}}元</div>
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
                    <div class="tcol">费用平均单价</div>
                    <div class="tcol">产品平均单价</div>
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
                    <div class="tcol">-</div>
                    <div class="tcol">{{item.product_pre_price}}元</div>
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
                    <div class="tcol">费用平均单价</div>
                    <div class="tcol">产品平均单价</div>
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
                    <div class="tcol">-</div>
                    <div class="tcol">{{financialInfo.pack.gather.product_pre_price}}元</div>
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
                        <div class="tcol">费用平均单价</div>
                        <div class="tcol">产品平均单价</div>
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
                        <div class="tcol">-</div>
                        <div class="tcol">{{item.product_pre_price}}元</div>
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
                <div class="btn backHoverRed"
                  @click="cancelOrder">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">取消订单</span>
                </div>
                <div class="btn backHoverGreen"
                  @click="$router.push('/boxManage/orderDetail?id='+$route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">装箱出库</span>
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
import { order } from '@/assets/js/api'
import { OrderBatch, OrderInfo, OrderTime } from '@/types/order'
import zhCheckDetail from '@/components/zhCheck/zhCheckDetail.vue'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  components: { zhCheckDetail },
  data(): {
    orderInfo: OrderDetail
    [propName: string]: any
  } {
    return {
      loading: true,
      checkFlag: false,
      checkAll: false,
      checkDetailFlag: false,
      show_material: false,
      show_production: false,
      show_financial: false,
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
    goQuotedPrice(item: any) {
      if (item.rel_quote_info.quote_id) {
        this.$openUrl('/quotedPrice/detail?id=' + item.rel_quote_info.quote_id)
      } else {
        this.$confirm('是否添加新的报价单?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '添加新报价单',
          cancelButtonText: '去报价单列表查询已有报价单绑定',
          type: 'warning'
        })
          .then(() => {
            this.$openUrl('/quotedPrice/create?orderId=' + this.$route.query.id + '&product_id=' + item.product_id)
          })
          .catch((action: any) => {
            if (action === 'cancel') {
              this.$openUrl('/quotedPrice/list?page=1&keyword=&client_id=&user_id=&status=null&date=')
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
      this.$confirm('是否确认完成该批次，确认后订单将不能进行其他操作?', '提示', {
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
      this.$confirm('是否取消该订单?', '提示', {
        confirmButtonText: '确认取消',
        cancelButtonText: '取消',
        type: 'warning'
      })
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
                this.$router.push('/order/list?page=1&keyword=&client_id=&user_id=&status=null0&date=')
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
          Promise.all([
            order.materialDetail({
              order_id: Number(this.orderInfo.time_data[0].id)
            }),
            order.productionDetail({
              order_time_id: Number(this.orderInfo.time_data[0].id)
            })
          ]).then((res) => {
            this.materialDetail = res[0].data.data.data
            this.materialProgress = res[0].data.data.progress
            this.productionDetail = res[1].data.data.data
            this.productionProgress = res[1].data.data.progress
            this.productionUpdateTime = res[1].data.data.update_time
            this.materialUpdateTime = res[0].data.data.update_time
            this.loading = false
          })
        }
      })
    // 财务信息
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
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/order/detail.less';
</style>