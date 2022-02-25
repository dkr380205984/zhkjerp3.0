<template>
  <div id="quotedPriceDetail"
    class="bodyContainer"
    v-loading="loading">
    <el-tabs type="border-card"
      v-model="quotedIndex"
      @tab-click="getQuotedList">
      <el-tab-pane v-for="(item,index) in quotedList"
        :key="item"
        :label="'报价单'+(index+1)"
        :name="index.toString()">
        <div class="module">
          <div class="titleCtn">
            <div class="title">基本信息</div>
          </div>
          <div class="detailCtn">
            <div class="checkCtn">
              <!-- <el-tooltip class="item"
                effect="dark"
                content="点击查看审核日志"
                placement="bottom">
                <img :src="quotedPriceInfo.is_check|checkFilter" />
              </el-tooltip> -->
              <img :src="quotedPriceInfo.is_check|checkFilter" />
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">报价单号：</div>
                <div class="text blue">{{quotedPriceInfo.code}}</div>
              </div>
              <!-- <div class="col flex3"
                v-if="quotedPriceInfo.rel_order">
                <div class="label">关联单据：</div>
                <span class="gray"
                  v-if="!quotedPriceInfo.rel_order">无关联单据</span>
                <div class="text green">
                  <span v-for="item in quotedPriceInfo.rel_order"
                    :key="item.id"
                    style="cursor:pointer;margin-right:12px"
                    @click="$openUrl(item.order_type===1?('/order/detail?id='+item.order_id):('/sampleOrder/detail?id='+item.order_id))">{{item.code}}</span>
                </div>
              </div> -->
            </div>
            <div class="row">
              <div class="col">
                <div class="label">报价标题：</div>
                <div class="text">{{quotedPriceInfo.title}}</div>
              </div>
              <div class="col">
                <div class="label">询价客户：</div>
                <div class="text">{{quotedPriceInfo.client_name}}</div>
              </div>
              <div class="col">
                <div class="label">公司联系人：</div>
                <div class="text">{{quotedPriceInfo.contacts_name}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">负责组/人：</div>
                <div class="text">{{quotedPriceInfo.group_name}}</div>
              </div>
              <div class="col">
                <div class="label">报价币种：</div>
                <div class="text">{{quotedPriceInfo.settle_unit}}</div>
              </div>
              <div class="col">
                <div class="label">结算汇率：</div>
                <div class="text">{{quotedPriceInfo.exchange_rate}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">创建人：</div>
                <div class="text">{{quotedPriceInfo.user_name}}</div>
              </div>
              <div class="col flex3">
                <div class="label">更新时间：</div>
                <div class="text">{{quotedPriceInfo.created_at.slice(0,10)}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">系统报价：</div>
                <div class="text">{{quotedPriceInfo.system_total_price}}元</div>
              </div>
              <div class="col flex3">
                <div class="label">客户报价：</div>
                <div class="text">{{quotedPriceInfo.real_quote_price}}元</div>
              </div>
              <!-- <div class="col"
                v-if="quotedPriceInfo.rel_order.length>0">
                <div class="label">绑定单据：</div>
                <div class="text">
                  <span style="cursor:pointer"
                    v-for="item in quotedPriceInfo.rel_order"
                    :key="item.id"
                    class="blue"
                    @click="$openUrl(item.order_type===1?'/order/detail?id='+item.order_id:('/sampleOrder/detail?id='+item.order_id))">{{item.code}};</span>
                </div>
              </div> -->
            </div>
            <div class="row">
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text">{{quotedPriceInfo.desc}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="module">
          <div class="titleCtn">
            <div class="title">产品描述</div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">产品品类</div>
                <div class="tcol">产品图片</div>
                <div class="tcol">客户目标价格</div>
                <div class="tcol">客户最低起订量</div>
                <div class="tcol">产品描述/客户要求</div>
                <div class="tcol">是否已绑订单</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(item) in quotedPriceInfo.product_data"
                :key="item.id">
                <div class="tcol">{{item.category_name}}/{{item.secondary_category}}</div>
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
                <div class="tcol">{{item.client_target_price}}元</div>
                <div class="tcol">{{item.start_order_number}}</div>
                <div class="tcol">{{item.desc}}</div>
                <div class="tcol"
                  :class="{'blue':item.order_product_id,'gray':!item.order_product_id}">{{item.order_product_id?'已绑定':'未绑定'}}</div>
              </div>
              <template v-if="showCompareInfo">
                <div class="trow"
                  v-for="(item,index) in compareInfo.product_data"
                  :key="item.id">
                  <div class="tcol">{{item.category_name}}/{{item.secondary_category}}
                    <div class="tips">
                      <div class="lightGreen">报价单{{compareIndex+1}}产品</div>
                    </div>
                  </div>
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
                      <div class="tips"
                        v-if="compareDesc[index].image_data.change">
                        <span :class="{'lightGreen':compareDesc[index].image_data.change==='up','lightRed':compareDesc[index].image_data.change==='down'}">
                          {{compareDesc[index].image_data.change==='up'?'图片新增':'图片被删'}}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="tcol">{{item.client_target_price}}元
                    <div class="tips"
                      v-if="compareDesc[index].client_target_price.change">
                      <span :class="{'lightGreen':compareDesc[index].client_target_price.change==='up','lightRed':compareDesc[index].client_target_price.change==='down'}">
                        {{compareDesc[index].client_target_price.change==='up'?'上涨':'下降'}}{{compareDesc[index].client_target_price.number}}
                      </span>
                    </div>
                  </div>
                  <div class="tcol">{{item.start_order_number}}
                    <div class="tips"
                      v-if="compareDesc[index].start_order_number.change">
                      <span :class="{'lightGreen':compareDesc[index].start_order_number.change==='up','lightRed':compareDesc[index].start_order_number.change==='down'}">
                        {{compareDesc[index].start_order_number.change==='up'?'上涨':'下降'}}{{compareDesc[index].start_order_number.number}}
                      </span>
                    </div>
                  </div>
                  <div class="tcol">{{item.desc}}
                    <div class="tips"
                      v-if="compareDesc[index].desc.change">
                      <span class="lightGreen">描述变化</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="module">
          <el-tabs class="normalTab">
            <el-tab-pane :label="'产品'+(index+1)"
              v-for="(item,index) in quotedPriceInfo.product_data"
              :key="item.id">
              <div class="listCtn">
                <div class="list">
                  <div class="row title">
                    <div class="col">物料名称
                      <el-tooltip class="item"
                        effect="dark"
                        content="物料包含原料、辅料"
                        placement="top">
                        <i class="el-icon-question gray"
                          style="margin-left:4px"></i>
                      </el-tooltip>
                    </div>
                    <div class="col">预计数量</div>
                    <div class="col">预计损耗</div>
                    <div class="col">单价</div>
                    <div class="col">总价</div>
                  </div>
                  <div class="row"
                    v-for="(itemYarn,indexYarn) in item.material_data"
                    :key="'Yarn' + indexYarn">
                    <div class="col">
                      <div class="circle backHoverOrange">原</div>{{itemYarn.material_name}}
                      <div class="tips"
                        v-if="compareDesc[index] && compareDesc[index].material_data[indexYarn].change">
                        <span :class="{'lightRed':compareDesc[index].material_data[indexYarn].change==='add','lightGreen':compareDesc[index].material_data[indexYarn].change==='delete'}">
                          {{compareDesc[index].material_data[indexYarn].change==='add'?'新增原料':'删除物料'}}
                        </span>
                      </div>
                    </div>
                    <div class="col">{{itemYarn.weight}}{{itemYarn.unit}}
                      <div class="tips"
                        v-if="compareDesc[index] && compareDesc[index].material_data[indexYarn].weightChange">
                        <span :class="{'lightRed':compareDesc[index].material_data[indexYarn].weightChange==='up','lightGreen':compareDesc[index].material_data[indexYarn].weightChange==='down'}">
                          用料{{compareDesc[index].material_data[indexYarn].weigthNew}}{{itemYarn.unit}}{{compareDesc[index].material_data[indexYarn].weightChange==='up'?'上升':'下降'}}{{compareDesc[index].material_data[indexYarn].weightNumber}}%
                        </span>
                      </div>
                    </div>
                    <div class="col">{{itemYarn.loss}}%</div>
                    <div class="col">{{itemYarn.price}}元
                      <div class="tips"
                        v-if="compareDesc[index] && compareDesc[index].material_data[indexYarn].priceChange">
                        <span :class="{'lightRed':compareDesc[index].material_data[indexYarn].priceChange==='up','lightGreen':compareDesc[index].material_data[indexYarn].priceChange==='down'}">
                          单价{{compareDesc[index].material_data[indexYarn].priceNew}}元{{compareDesc[index].material_data[indexYarn].priceChange==='up'?'上升':'下降'}}{{compareDesc[index].material_data[indexYarn].priceNumber}}%
                        </span>
                      </div>
                    </div>
                    <div class="col">{{itemYarn.total_price.toFixed(2)}}元
                      <div class="tips"
                        v-if="compareDesc[index] && compareDesc[index].material_data[indexYarn].totalPriceChange">
                        <span :class="{'lightRed':compareDesc[index].material_data[indexYarn].totalPriceChange==='up','lightGreen':compareDesc[index].material_data[indexYarn].totalPriceChange==='down'}">
                          总价{{compareDesc[index].material_data[indexYarn].totalPriceNew}}元{{compareDesc[index].material_data[indexYarn].totalPriceChange==='up'?'上升':'下降'}}{{compareDesc[index].material_data[indexYarn].totalPriceNumber}}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="row"
                    v-for="(itemDecorateMaterial,indexDecorateMaterial) in item.assist_material_data"
                    :key="'DecorateMaterial' + indexDecorateMaterial">
                    <div class="col">
                      <div class="circle backHoverGreen">辅</div>{{itemDecorateMaterial.material_name}}
                      <div class="tips"
                        v-if="compareDesc[index] && compareDesc[index].assist_material_data[indexDecorateMaterial].change">
                        <span :class="{'lightRed':compareDesc[index].assist_material_data[indexDecorateMaterial].change==='add','lightGreen':compareDesc[index].assist_material_data[indexDecorateMaterial].change==='delete'}">
                          {{compareDesc[index].assist_material_data[indexDecorateMaterial].change==='add'?'新增原料':'删除物料'}}
                        </span>
                      </div>
                    </div>
                    <div class="col">{{itemDecorateMaterial.number}}{{itemDecorateMaterial.unit}}
                      <div class="tips"
                        v-if="compareDesc[index] && compareDesc[index].assist_material_data[indexDecorateMaterial].weightChange">
                        <span :class="{'lightRed':compareDesc[index].assist_material_data[indexDecorateMaterial].weightChange==='up','lightGreen':compareDesc[index].assist_material_data[indexDecorateMaterial].weightChange==='down'}">
                          用料{{compareDesc[index].assist_material_data[indexDecorateMaterial].weigthNew}}{{itemDecorateMaterial.unit}}{{compareDesc[index].assist_material_data[indexDecorateMaterial].weightChange==='up'?'上升':'下降'}}{{compareDesc[index].assist_material_data[indexDecorateMaterial].weightNumber}}%
                        </span>
                      </div>
                    </div>
                    <div class="col">{{itemDecorateMaterial.loss}}%</div>
                    <div class="col">{{itemDecorateMaterial.price}}元
                      <div class="tips"
                        v-if="compareDesc[index] && compareDesc[index].assist_material_data[indexDecorateMaterial].priceChange">
                        <span :class="{'lightRed':compareDesc[index].assist_material_data[indexDecorateMaterial].priceChange==='up','lightGreen':compareDesc[index].assist_material_data[indexDecorateMaterial].priceChange==='down'}">
                          单价{{compareDesc[index].assist_material_data[indexDecorateMaterial].priceNew}}元{{compareDesc[index].assist_material_data[indexDecorateMaterial].priceChange==='up'?'上升':'下降'}}{{compareDesc[index].assist_material_data[indexDecorateMaterial].priceNumber}}%
                        </span>
                      </div>
                    </div>
                    <div class="col">{{itemDecorateMaterial.total_price}}元
                      <div class="tips"
                        v-if="compareDesc[index] && compareDesc[index].assist_material_data[indexDecorateMaterial].totalPriceChange">
                        <span :class="{'lightRed':compareDesc[index].assist_material_data[indexDecorateMaterial].totalPriceChange==='up','lightGreen':compareDesc[index].assist_material_data[indexDecorateMaterial].totalPriceChange==='down'}">
                          总价{{compareDesc[index].assist_material_data[indexDecorateMaterial].totalPriceNew}}元{{compareDesc[index].assist_material_data[indexDecorateMaterial].totalPriceChange==='up'?'上升':'下降'}}{{compareDesc[index].assist_material_data[indexDecorateMaterial].totalPriceNumber}}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="list">
                    <div class="row title">
                      <div class="col">费用名称
                        <el-tooltip class="item"
                          effect="dark"
                          content="织：产品织造；半：半成品加工；成：成品加工；包：包装辅料；其：其他费用；非：非生产型费用；运：运输费用。"
                          placement="top">
                          <i class="el-icon-question gray"
                            style="margin-left:4px"></i>
                        </el-tooltip>
                      </div>
                      <div class="col">费用说明</div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col">总价</div>
                    </div>
                    <div class="row"
                      v-for="(itemWeave,indexWeave) in item.weave_data"
                      :key="'Weave'+indexWeave">
                      <div class="col">
                        <div class="circle"
                          :class="{'backHoverBlue':itemWeave.name,'backGray':!itemWeave.name}">织</div>{{itemWeave.name || '无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].weave_data[indexWeave] && compareDesc[index].weave_data[indexWeave].change">
                          <span :class="{'lightRed':compareDesc[index].weave_data[indexWeave].change==='add','lightGreen':compareDesc[index].weave_data[indexWeave].change==='delete'}">
                            {{compareDesc[index].weave_data[indexWeave].change==='add'?'新增织造':'删除织造'}}
                          </span>
                        </div>
                      </div>
                      <div class="col">{{itemWeave.desc||'无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].weave_data[indexWeave] && compareDesc[index].weave_data[indexWeave].desc">
                          <span :class="{'lightRed':compareDesc[index].weave_data[indexWeave].desc}">
                            更新说明：{{compareDesc[index].weave_data[indexWeave].desc}}
                          </span>
                        </div>
                      </div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col">{{itemWeave.total_price||0}}元
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].weave_data[indexWeave] && compareDesc[index].weave_data[indexWeave].priceChange">
                          <span :class="{'lightRed':compareDesc[index].weave_data[indexWeave].priceChange==='up','lightGreen':compareDesc[index].weave_data[indexWeave].priceChange==='down'}">
                            总价{{compareDesc[index].weave_data[indexWeave].priceNew}}元{{compareDesc[index].weave_data[indexWeave].priceChange==='up'?'上升':'下降'}}{{compareDesc[index].weave_data[indexWeave].priceNumber}}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="row"
                      v-for="(itemHalfProcess,indexHalfProcess) in item.semi_product_data"
                      :key="'HalfProcess' + indexHalfProcess">
                      <div class="col">
                        <div class="circle"
                          :class="{'backHoverBlue':itemHalfProcess.process_name,'backGray':!itemHalfProcess.process_name}">半</div>{{itemHalfProcess.process_name.join(',') || '无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].semi_product_data[indexHalfProcess] && compareDesc[index].semi_product_data[indexHalfProcess].change">
                          <span :class="{'lightRed':compareDesc[index].semi_product_data[indexHalfProcess].change==='add','lightGreen':compareDesc[index].semi_product_data[indexHalfProcess].change==='delete'}">
                            {{compareDesc[index].semi_product_data[indexHalfProcess].change==='add'?'新增加工':'删除加工'}}
                          </span>
                        </div>
                      </div>
                      <div class="col">{{itemHalfProcess.desc||'无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].semi_product_data[indexHalfProcess] && compareDesc[index].semi_product_data[indexHalfProcess].desc">
                          <span :class="{'lightRed':compareDesc[index].semi_product_data[indexHalfProcess].desc}">
                            更新说明：{{compareDesc[index].semi_product_data[indexHalfProcess].desc}}
                          </span>
                        </div>
                      </div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col">{{itemHalfProcess.total_price||0}}元
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].semi_product_data[indexHalfProcess] && compareDesc[index].semi_product_data[indexHalfProcess].priceChange">
                          <span :class="{'lightRed':compareDesc[index].semi_product_data[indexHalfProcess].priceChange==='up','lightGreen':compareDesc[index].semi_product_data[indexHalfProcess].priceChange==='down'}">
                            总价{{compareDesc[index].semi_product_data[indexHalfProcess].priceNew}}元{{compareDesc[index].semi_product_data[indexHalfProcess].priceChange==='up'?'上升':'下降'}}{{compareDesc[index].semi_product_data[indexHalfProcess].priceNumber}}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="row"
                      v-for="(itemFinishedProcess,indexFinishedProcess) in item.production_data"
                      :key="'FinishedProcess' + indexFinishedProcess">
                      <div class="col">
                        <div class="circle"
                          :class="{'backHoverBlue':itemFinishedProcess.name,'backGray':!itemFinishedProcess.name}">成</div>{{itemFinishedProcess.name.join(',')  || '无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].production_data[indexFinishedProcess] && compareDesc[index].production_data[indexFinishedProcess].change">
                          <span :class="{'lightRed':compareDesc[index].production_data[indexFinishedProcess].change==='add','lightGreen':compareDesc[index].production_data[indexFinishedProcess].change==='delete'}">
                            {{compareDesc[index].production_data[indexFinishedProcess].change==='add'?'新增加工':'删除加工'}}
                          </span>
                        </div>
                      </div>
                      <div class="col">{{itemFinishedProcess.desc||'无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].production_data[indexFinishedProcess] && compareDesc[index].production_data[indexFinishedProcess].desc">
                          <span :class="{'lightRed':compareDesc[index].production_data[indexFinishedProcess].desc}">
                            更新说明：{{compareDesc[index].production_data[indexFinishedProcess].desc}}
                          </span>
                        </div>
                      </div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col">{{itemFinishedProcess.total_price||0}}元
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].production_data[indexFinishedProcess] && compareDesc[index].production_data[indexFinishedProcess].priceChange">
                          <span :class="{'lightRed':compareDesc[index].production_data[indexFinishedProcess].priceChange==='up','lightGreen':compareDesc[index].production_data[indexFinishedProcess].priceChange==='down'}">
                            总价{{compareDesc[index].production_data[indexFinishedProcess].priceNew}}元{{compareDesc[index].production_data[indexFinishedProcess].priceChange==='up'?'上升':'下降'}}{{compareDesc[index].production_data[indexFinishedProcess].priceNumber}}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="row"
                      v-for="(itemPackMaterial,indexPackMaterial) in item.pack_material_data"
                      :key="'PackMaterial' + indexPackMaterial">
                      <div class="col">
                        <div class="circle"
                          :class="{'backHoverBlue':itemPackMaterial.material_name,'backGray':!itemPackMaterial.material_name}">包</div>{{itemPackMaterial.material_name || '无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].pack_material_data[indexPackMaterial] && compareDesc[index].pack_material_data[indexPackMaterial].change">
                          <span :class="{'lightRed':compareDesc[index].pack_material_data[indexPackMaterial].change==='add','lightGreen':compareDesc[index].pack_material_data[indexPackMaterial].change==='delete'}">
                            {{compareDesc[index].pack_material_data[indexPackMaterial].change==='add'?'新增包装':'删除包装'}}
                          </span>
                        </div>
                      </div>
                      <div class="col">{{itemPackMaterial.desc||'无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].pack_material_data[indexPackMaterial] && compareDesc[index].pack_material_data[indexPackMaterial].desc">
                          <span :class="{'lightRed':compareDesc[index].pack_material_data[indexPackMaterial].desc}">
                            更新说明：{{compareDesc[index].pack_material_data[indexPackMaterial].desc}}
                          </span>
                        </div>
                      </div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col">{{itemPackMaterial.total_price||0}}元
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].pack_material_data[indexPackMaterial] && compareDesc[index].pack_material_data[indexPackMaterial].priceChange">
                          <span :class="{'lightRed':compareDesc[index].pack_material_data[indexPackMaterial].priceChange==='up','lightGreen':compareDesc[index].pack_material_data[indexPackMaterial].priceChange==='down'}">
                            总价{{compareDesc[index].pack_material_data[indexPackMaterial].priceNew}}元{{compareDesc[index].pack_material_data[indexPackMaterial].priceChange==='up'?'上升':'下降'}}{{compareDesc[index].pack_material_data[indexPackMaterial].priceNumber}}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="row"
                      v-for="(itemOther,indexOther) in item.other_fee_data"
                      :key="'Other' + indexOther">
                      <div class="col">
                        <div class="circle"
                          :class="{'backHoverBlue':itemOther.name,'backGray':!itemOther.name}">其</div>{{itemOther.name || '无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].other_fee_data[indexOther] && compareDesc[index].other_fee_data[indexOther].change">
                          <span :class="{'lightRed':compareDesc[index].other_fee_data[indexOther].change==='add','lightGreen':compareDesc[index].other_fee_data[indexOther].change==='delete'}">
                            {{compareDesc[index].other_fee_data[indexOther].change==='add'?'新增项':'删除项'}}
                          </span>
                        </div>
                      </div>
                      <div class="col">{{itemOther.desc||'无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].other_fee_data[indexOther] && compareDesc[index].other_fee_data[indexOther].desc">
                          <span :class="{'lightRed':compareDesc[index].other_fee_data[indexOther].desc}">
                            更新说明：{{compareDesc[index].other_fee_data[indexOther].desc}}
                          </span>
                        </div>
                      </div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col">{{itemOther.total_price||0}}元
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].other_fee_data[indexOther] && compareDesc[index].other_fee_data[indexOther].priceChange">
                          <span :class="{'lightRed':compareDesc[index].other_fee_data[indexOther].priceChange==='up','lightGreen':compareDesc[index].other_fee_data[indexOther].priceChange==='down'}">
                            总价{{compareDesc[index].other_fee_data[indexOther].priceNew}}元{{compareDesc[index].other_fee_data[indexOther].priceChange==='up'?'上升':'下降'}}{{compareDesc[index].other_fee_data[indexOther].priceNumber}}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="row"
                      v-for="(itemOther,indexOther) in item.no_production_fee_data"
                      :key="'NoPro' + indexOther">
                      <div class="col">
                        <div class="circle"
                          :class="{'backHoverBlue':itemOther.name,'backGray':!itemOther.name}">非</div>{{itemOther.name || '无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].no_production_fee_data[indexOther] && compareDesc[index].no_production_fee_data[indexOther].change">
                          <span :class="{'lightRed':compareDesc[index].no_production_fee_data[indexOther].change==='add','lightGreen':compareDesc[index].no_production_fee_data[indexOther].change==='delete'}">
                            {{compareDesc[index].no_production_fee_data[indexOther].change==='add'?'新增项':'删除项'}}
                          </span>
                        </div>
                      </div>
                      <div class="col">{{itemOther.desc||'无'}}
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].no_production_fee_data[indexOther] && compareDesc[index].no_production_fee_data[indexOther].desc">
                          <span :class="{'lightRed':compareDesc[index].no_production_fee_data[indexOther].desc}">
                            更新说明：{{compareDesc[index].no_production_fee_data[indexOther].desc}}
                          </span>
                        </div>
                      </div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col">{{itemOther.total_price||0}}元
                        <div class="tips"
                          v-if="compareDesc[index] && compareDesc[index].no_production_fee_data[indexOther] && compareDesc[index].no_production_fee_data[indexOther].priceChange">
                          <span :class="{'lightRed':compareDesc[index].no_production_fee_data[indexOther].priceChange==='up','lightGreen':compareDesc[index].no_production_fee_data[indexOther].priceChange==='down'}">
                            总价{{compareDesc[index].no_production_fee_data[indexOther].priceNew}}元{{compareDesc[index].no_production_fee_data[indexOther].priceChange==='up'?'上升':'下降'}}{{compareDesc[index].no_production_fee_data[indexOther].priceNumber}}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <div class="circle"
                          :class="{'backHoverBlue':item.transport_fee,'backGray':!item.transport_fee}">运</div>{{item.transport_fee?'运输费用':'无'}}
                      </div>
                      <div class="col">{{item.transport_fee_desc||'无'}}
                        <div class="tips"
                          v-if="compareDesc[index]&&compareDesc[index].transport_fee.desc">
                          <span :class="{'lightGreen':compareDesc[index].transport_fee.desc}">描述变化</span>
                        </div>
                      </div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col">{{item.transport_fee||0}}元
                        <div class="tips"
                          v-if="compareDesc[index]&&compareDesc[index].transport_fee.desc">
                          <span :class="{'lightGreen':compareDesc[index].transport_fee.desc}">
                            总价{{compareDesc[index].transport_fee.priceNew}}元{{compareDesc[index].transport_fee.priceChange==='up'?'上升':'下降'}}{{compareDesc[index].transport_fee.priceNumber}}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <div class="circle backHoverGreen">合</div>产品合计费用
                      </div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col">
                        <span style="font-weight:bold;font-size:20px;">{{productTotalPrice[index]}}</span>元
                        <div class="tips"
                          v-if="showCompareInfo && productTotalPrice[index]!==compareProductTotalPrice[index]">
                          <div :class="{'lightGreen':productTotalPrice[index]>compareProductTotalPrice[index],'lightRed':productTotalPrice[index]<compareProductTotalPrice[index]}">
                            费用
                            {{productTotalPrice[index]>compareProductTotalPrice[index]?'下降':'上涨'}}
                            {{Math.abs(productTotalPrice[index]-compareProductTotalPrice[index]).toFixed(2)}}元</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="module">
          <div class="titleCtn">
            <div class="title">订单费用</div>
          </div>
          <div class="listCtn">
            <div class="list">
              <div class="row title">
                <div class="col">费用名称</div>
                <div class="col">费用占比</div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">合计费用</div>
              </div>
              <div class="row">
                <div class="col">客户佣金</div>
                <div class="col">{{quotedPriceInfo.commission_percentage}}%
                  <div class="tips"
                    v-if="showCompareInfo && quotedPriceInfo.commission_percentage!==compareInfo.commission_percentage">
                    <span :class="{'lightGreen':quotedPriceInfo.commission_percentage>compareInfo.commission_percentage,'lightRed':quotedPriceInfo.commission_percentage<compareInfo.commission_percentage}">
                      {{quotedPriceInfo.commission_percentage>compareInfo.commission_percentage?'下调':'上调'}}了{{Math.abs(quotedPriceInfo.commission_percentage-compareInfo.commission_percentage)}}%
                    </span>
                  </div>
                </div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">{{quotedPriceInfo.commission_price}}元
                  <div class="tips"
                    v-if="showCompareInfo && quotedPriceInfo.commission_price!==compareInfo.commission_price">
                    <span :class="{'lightGreen':quotedPriceInfo.commission_price>compareInfo.commission_price,'lightRed':quotedPriceInfo.commission_price<compareInfo.commission_price}">
                      {{quotedPriceInfo.commission_price>compareInfo.commission_price?'下降':'上涨'}}了{{Math.abs(quotedPriceInfo.commission_price-compareInfo.commission_price).toFixed(2)}}元
                    </span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">预计税率</div>
                <div class="col">{{quotedPriceInfo.rate_taxation}}%
                  <div class="tips"
                    v-if="showCompareInfo && quotedPriceInfo.rate_taxation!==compareInfo.rate_taxation">
                    <span :class="{'lightGreen':quotedPriceInfo.rate_taxation>compareInfo.rate_taxation,'lightRed':quotedPriceInfo.rate_taxation<compareInfo.rate_taxation}">
                      {{quotedPriceInfo.rate_taxation>compareInfo.rate_taxation?'下调':'上调'}}了{{Math.abs(quotedPriceInfo.rate_taxation-compareInfo.rate_taxation)}}%
                    </span>
                  </div>
                </div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">{{quotedPriceInfo.rate_price}}元
                  <div class="tips"
                    v-if="showCompareInfo && quotedPriceInfo.rate_price!==compareInfo.rate_price">
                    <span :class="{'lightGreen':quotedPriceInfo.rate_price>compareInfo.rate_price,'lightRed':quotedPriceInfo.rate_price<compareInfo.rate_price}">
                      {{quotedPriceInfo.rate_price>compareInfo.rate_price?'下降':'上涨'}}了{{Math.abs(quotedPriceInfo.rate_price-compareInfo.rate_price).toFixed(2)}}元
                    </span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">预计利润</div>
                <div class="col">{{quotedPriceInfo.profit_percentage}}%
                  <div class="tips"
                    v-if="showCompareInfo && quotedPriceInfo.profit_percentage!==compareInfo.profit_percentage">
                    <span :class="{'lightGreen':quotedPriceInfo.profit_percentage>compareInfo.profit_percentage,'lightRed':quotedPriceInfo.profit_percentage<compareInfo.profit_percentage}">
                      {{quotedPriceInfo.profit_percentage>compareInfo.profit_percentage?'下调':'上调'}}了{{Math.abs(quotedPriceInfo.profit_percentage-compareInfo.profit_percentage)}}%
                    </span>
                  </div>
                </div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">{{quotedPriceInfo.profit_price}}元
                  <div class="tips"
                    v-if="showCompareInfo && quotedPriceInfo.profit_price!==compareInfo.profit_price">
                    <span :class="{'lightGreen':quotedPriceInfo.profit_price<compareInfo.profit_price,'lightRed':quotedPriceInfo.profit_price>compareInfo.profit_price}">
                      {{quotedPriceInfo.profit_price>compareInfo.profit_price?'下降':'上涨'}}了{{Math.abs(quotedPriceInfo.profit_price-compareInfo.profit_price).toFixed(2)}}元
                    </span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">订单合计费用</div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">
                  <span style="font-weight:bold;font-size:20px;">{{realOrderPrice}}</span>元
                  <div class="tips"
                    v-if="showCompareInfo && realOrderPrice!==compareRealOrderPrice">
                    <div :class="{'lightGreen':realOrderPrice>compareRealOrderPrice,'lightRed':realOrderPrice<compareRealOrderPrice}">
                      费用
                      {{realOrderPrice>compareRealOrderPrice?'下降':'上涨'}}
                      {{Math.abs(realOrderPrice-compareRealOrderPrice).toFixed(2)}}元</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="bottomFixBar">
      <div class="main">
        <div class="fl"
          style="line-height:56px">
          合计：
          <span>
            <span class="blue"
              style="font-weight:bold;font-size:20px;">{{realTotalPrice}}</span>元
            <span v-if="quotedPriceInfo.settle_unit!=='元'">{{'/'+realTotalPriceChange+quotedPriceInfo.settle_unit}}</span>
          </span>
        </div>
        <div class="fl blue green"
          style="line-height:56px;margin-left:24px"
          v-if="showCompareInfo">
          正在与报价单{{compareIndex+1}}进行比较，
          总价{{compareRealTotalPrice}}元
        </div>
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="buttonList"
            style="margin-left:12px">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">报价单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange"
                  @click="$router.push('/quotedPrice/update?id='+quotedList[quotedIndex])">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">修改报价</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="checkFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shenhedingdan"></use>
                  </svg>
                  <span class="text">审核报价</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteQuotedPrice">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">删除报价</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$openUrl('/quotedPrice/print?id='+$route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-dayindingdan"></use>
                  </svg>
                  <span class="text">打印报价</span>
                </div>
                <div class="btn backHoverGreen"
                  @click="quotedPriceInfo.is_check===2?$message.error('该报价单审核未通过'):quotedPriceInfo.rel_order.length>0?$message.warning('已绑定单据，无法多次绑定'):$router.push('/sampleOrder/create?quotedPriceId='+ quotedList[quotedIndex])">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-wuliaojihua1"></use>
                  </svg>
                  <span class="text">生成样单</span>
                </div>
                <div class="btn backHoverGreen"
                  @click="quotedPriceInfo.is_check===2?$message.error('该报价单审核未通过'):quotedPriceInfo.rel_order.length>0?$message.warning('已绑定单据，无法多次绑定'):$router.push('/order/create?quotedPriceId='+ quotedList[quotedIndex])">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-wuliaojihua1"></use>
                  </svg>
                  <span class="text">生成订单</span>
                </div>
                <!-- <div class="btn backHoverOrange"
                  @click="quotedPriceInfo.rel_order.length>0?$message.warning('已绑定单据，无法多次绑定'):bindOrderFlag=true;bindOrderType=2;">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-wuliaojihua1"></use>
                  </svg>
                  <span class="text">绑定样单</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="quotedPriceInfo.rel_order.length>0?$message.warning('已绑定单据，无法多次绑定'):bindOrderFlag=true;bindOrderType=1;">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-wuliaojihua1"></use>
                  </svg>
                  <span class="text">绑定订单</span>
                </div> -->
                <div class="btn backHoverBlue"
                  @click="checkOpr">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">操作记录</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="$router.push('/quotedPrice/create?id='+quotedList[quotedIndex])">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">复制报价</span>
                </div>
                <div class="btn backHoverGreen"
                  @click="$router.push('/quotedPrice/create?id='+quotedList[quotedIndex] + '&again=true')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">再次报价</span>
                </div>
                <div class="btn backHoverGreen"
                  v-if="quotedList.length>1"
                  @click="compareFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-caozuojilu"></use>
                  </svg>
                  <span class="text">对比报价</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="oprLogFlag">
      <div class="main"
        style="width:1000px">
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
                <div class="tcol">序号</div>
                <div class="tcol">修改日期</div>
                <div class="tcol">修改人</div>
                <div class="tcol"
                  style="flex:4">产品修改详情</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(item,index) in oprLog"
                :key="item.id">
                <div class="tcol">{{index+1}}</div>
                <div class="tcol">{{item.update_time}}</div>
                <div class="tcol">{{item.user}}</div>
                <div class="tcol"
                  style="flex:4">
                  <div class="line"
                    v-if="item.update_data">
                    <span class="label">订单修改信息:</span>
                    <div class="line">{{item.update_data}}</div>
                  </div>
                  <div v-for="(itemPro,indexPro) in item.product_activity_log"
                    :key="indexPro">
                    <span>产品{{indexPro+1}}:</span>
                    <div class="line"
                      v-if="itemPro.product_update_data">
                      <span class="label">产品修改信息：</span>
                      <span>{{itemPro.product_update_data}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.material_activity_log && itemPro.material_activity_log.length>0">
                      <span class="label">原料修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.material_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.assist_material_activity_log && itemPro.assist_material_activity_log.length>0">
                      <span class="label">辅料修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.assist_material_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.weave_activity_log && itemPro.weave_activity_log.length>0">
                      <span class="label">织造修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.weave_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.semi_product_activity_log && itemPro.semi_product_activity_log.length>0">
                      <span class="label">半成品加工修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.semi_product_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.production_activity_log && itemPro.production_activity_log.length>0">
                      <span class="label">成品加工修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.production_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.pack_material_activity_log && itemPro.pack_material_activity_log.length>0">
                      <span class="label">包装辅料修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.pack_material_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.other_fee_activity_log && itemPro.other_fee_activity_log.length>0">
                      <span class="label">其他修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.others_fee_activity_log"
                        :key="indexChild">{{itemChild}}</span>
                    </div>
                    <div class="line"
                      v-if="itemPro.no_production_fee_activity_log && itemPro.no_production_fee_activity_log.length>0">
                      <span class="label">非生产型费用修改信息：</span>
                      <span v-for="(itemChild,indexChild) in itemPro.no_production_fee_activity_log"
                        :key="indexChild">{{itemChild}}</span>
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
    <div class="popup"
      v-show="bindOrderFlag">
      <div class="main"
        style="width:1000px">
        <div class="titleCtn">
          <span class="text">绑定单据</span>
          <div class="closeCtn"
            @click="bindOrderFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">搜索单据：</div>
            <div class="info">
              <div class="elCtn"
                style="width:100%">
                <el-autocomplete v-model="bindOrderValue"
                  :fetch-suggestions="searchOrder"
                  :placeholder="'请输入'+(bindOrderType===1?'订单号搜索':'样单号搜索')"
                  @select="selectId"></el-autocomplete>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="bindOrderFlag=false">取消</span>
          <span class="btn backHoverOrange"
            @click="$openUrl(bindOrderType===1?'/order/list?page=1&keyword=&client_id=&user_id=&status=null&date=':'/sampleOrder/list?page=1&keyword=&client_id=&user_id=&status=null&date=')">查看{{bindOrderType===1?'订单':'样单'}}列表</span>
          <span class="btn backHoverBlue"
            @click="saveBindOrder">确认</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="compareFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">对比单据</span>
          <div class="closeCtn"
            @click="compareFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="box"
            v-for="(item,index) in quotedList"
            :key="item.id"
            :class="{'backHoverBlue':compareIndex===index}"
            @click="compareIndex = index">
            第{{index+1}}次报价
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="compareFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="confirmCompare">确认</span>
        </div>
      </div>
    </div>
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{quotedPriceInfo.is_check=ev;$forceUpdate()}"
      :show="checkFlag"
      :pid="quotedList[quotedIndex]"
      :check_type="5"
      :reason="['物料价格偏低','织造费用偏低','加工费用偏低','包装费用偏低','人工费用偏低','运输费用偏低','基本利润偏低','整体报价偏低']"></zh-check>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import { quotedPrice, order } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
    quotedPriceInfo: QuotedPriceInfo
    compareInfo: QuotedPriceInfo
  } {
    return {
      loading: true,
      checkFlag: false,
      compareFlag: false,
      compareIndex: 0,
      showCompareInfo: false, // 是否展示对比数据
      compareDesc: [],
      quotedPriceInfo: {
        id: null,
        is_draft: 1,
        title: '',
        client_id: '',
        tree_data: '',
        client_name: '',
        contacts_id: '',
        contacts_name: '',
        group_id: '',
        group_name: '',
        settle_unit: '元',
        exchange_rate: '',
        total_number: '',
        total_cost_price: '',
        commission_percentage: '',
        commission_price: '',
        rate_taxation: '',
        rate_price: '',
        profit_percentage: '',
        profit_price: '',
        desc: '',
        real_quote_price: '',
        system_total_price: 0,
        created_at: '',
        rel_order: [],
        product_data: [
          {
            total_price: '',
            product_id: '',
            type: [],
            category_id: '',
            secondary_category_id: '',
            secondary_category: '',
            image_data: [],
            client_target_price: '',
            start_order_number: '',
            desc: '',
            transport_fee_desc: '',
            transport_fee: '',
            material_data: [
              {
                material_name: '',
                weight: '',
                loss: '',
                price: '',
                total_price: '',
                unit: 'kg'
              }
            ],
            assist_material_data: [
              {
                material_name: '',
                number: '',
                loss: '',
                price: '',
                total_price: '',
                unit: ''
              }
            ],
            weave_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            semi_product_data: [
              {
                process_name: [],
                desc: '',
                total_price: ''
              }
            ],
            production_data: [
              {
                name: [],
                desc: '',
                total_price: ''
              }
            ],
            pack_material_data: [
              {
                material_name: '',
                desc: '',
                total_price: ''
              }
            ],
            other_fee_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            no_production_fee_data: [
              {
                id: '',
                name: '',
                desc: '',
                total_price: ''
              }
            ]
          }
        ]
      },
      compareInfo: {
        id: null,
        is_draft: 1,
        title: '',
        client_id: '',
        tree_data: '',
        client_name: '',
        contacts_id: '',
        contacts_name: '',
        group_id: '',
        group_name: '',
        settle_unit: '元',
        exchange_rate: '',
        total_number: '',
        total_cost_price: '',
        commission_percentage: '',
        commission_price: '',
        rate_taxation: '',
        rate_price: '',
        profit_percentage: '',
        profit_price: '',
        desc: '',
        real_quote_price: '',
        system_total_price: 0,
        created_at: '',
        rel_order: [],
        product_data: [
          {
            total_price: '',
            product_id: '',
            type: [],
            category_id: '',
            secondary_category_id: '',
            secondary_category: '',
            image_data: [],
            client_target_price: '',
            start_order_number: '',
            desc: '',
            transport_fee_desc: '',
            transport_fee: '',
            material_data: [
              {
                material_name: '',
                weight: '',
                loss: '',
                price: '',
                total_price: '',
                unit: 'kg'
              }
            ],
            assist_material_data: [
              {
                material_name: '',
                number: '',
                loss: '',
                price: '',
                total_price: '',
                unit: ''
              }
            ],
            weave_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            semi_product_data: [
              {
                process_name: [],
                desc: '',
                total_price: ''
              }
            ],
            production_data: [
              {
                name: [],
                desc: '',
                total_price: ''
              }
            ],
            pack_material_data: [
              {
                material_name: '',
                desc: '',
                total_price: ''
              }
            ],
            other_fee_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            no_production_fee_data: [
              {
                id: '',
                name: '',
                desc: '',
                total_price: ''
              }
            ]
          }
        ]
      },
      oprLogFlag: false,
      oprLog: [],
      bindOrderFlag: false,
      bindOrderValue: '',
      bindOrderId: '',
      bindOrderType: '',
      quotedIndex: '0',
      quotedList: []
    }
  },
  computed: {
    // 订单总费用
    realOrderPrice(): string {
      return (
        Number(this.quotedPriceInfo.commission_price) +
        Number(this.quotedPriceInfo.profit_price) +
        Number(this.quotedPriceInfo.rate_price)
      ).toFixed(2)
    },
    compareRealOrderPrice(): string {
      return (
        Number(this.compareInfo.commission_price) +
        Number(this.compareInfo.profit_price) +
        Number(this.compareInfo.rate_price)
      ).toFixed(2)
    },
    // 总合计，按照汇率转换后
    realTotalPriceChange(): string {
      return ((Number(this.realTotalPrice) / Number(this.quotedPriceInfo.exchange_rate)) * 100).toFixed(2)
    },
    // 总合计——含各种税 quotedPriceInfo.system_total_price
    realTotalPrice(): string {
      return (
        Number(this.quotedPriceInfo.total_cost_price) /
        (1 -
          ((Number(this.quotedPriceInfo.commission_percentage) / 100 || 0) +
            (Number(this.quotedPriceInfo.profit_percentage) / 100 || 0) +
            Number(this.quotedPriceInfo.rate_taxation) / 100 || 0))
      ).toFixed(2)
    },
    compareRealTotalPrice(): string {
      return (
        Number(this.compareInfo.total_cost_price) /
        (1 -
          ((Number(this.compareInfo.commission_percentage) / 100 || 0) +
            (Number(this.compareInfo.profit_percentage) / 100 || 0) +
            Number(this.compareInfo.rate_taxation) / 100 || 0))
      ).toFixed(2)
    },
    // 产品项总价
    productTotalPrice(): string[] {
      return this.quotedPriceInfo.product_data.map((item) => {
        return (
          Number(item.transport_fee) +
          item.material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.assist_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.weave_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.semi_product_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.production_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.pack_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.other_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.no_production_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0)
        ).toFixed(2)
      })
    },
    // 对比报价单产品总价
    compareProductTotalPrice(): string[] {
      return this.compareInfo.product_data.map((item) => {
        return (
          Number(item.transport_fee) +
          item.material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.assist_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.weave_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.semi_product_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.production_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.pack_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.other_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.no_production_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0)
        ).toFixed(2)
      })
    }
  },
  methods: {
    // 确认对比
    confirmCompare() {
      if (this.compareIndex === Number(this.quotedIndex)) {
        this.$message.error('不能比较相同的报价单')
        return
      }
      this.loading = true
      this.compareDesc = []
      quotedPrice
        .detail({
          id: this.quotedList[this.compareIndex]
        })
        .then((res) => {
          if (res.data.status) {
            this.compareInfo = res.data.data
            this.quotedPriceInfo.product_data.forEach((item, index) => {
              this.compareDesc.push({
                image_data: {
                  change: ''
                },
                desc: {
                  change: ''
                },
                start_order_number: {
                  change: '',
                  number: 0
                },
                client_target_price: {
                  change: '',
                  number: 0
                },
                no_production_fee_data: [],
                material_data: [],
                assist_material_data: [],
                weave_data: [],
                semi_product_data: [],
                production_data: [],
                pack_material_data: [],
                other_fee_data: [],
                transport_fee: {
                  change: '',
                  number: 0,
                  desc: '',
                  pirceNew: 0
                }
              })
              // 对比字段逻辑，这里可以封装，懒得搞
              const comparePro = this.compareInfo.product_data[index]
              const compareDesc = this.compareDesc[index]
              // 手动夹断
              if (comparePro.image_data.length > item.image_data.length) {
                compareDesc.image_data.change = 'up'
              } else if (comparePro.image_data.length < item.image_data.length) {
                compareDesc.image_data.change = 'down'
              }
              // 手动夹断
              if (Number(comparePro.start_order_number) > Number(item.start_order_number)) {
                compareDesc.start_order_number.change = 'up'
              } else if (Number(comparePro.start_order_number) < Number(item.start_order_number)) {
                compareDesc.start_order_number.change = 'down'
              }
              compareDesc.start_order_number.number = (
                Math.abs(
                  (Number(comparePro.start_order_number) - Number(item.start_order_number)) /
                    Number(item.start_order_number)
                ) * 100
              ).toFixed(2)
              // 手动夹断
              if (Number(comparePro.client_target_price) > Number(item.client_target_price)) {
                compareDesc.client_target_price.change = 'up'
              } else if (Number(comparePro.client_target_price) < Number(item.client_target_price)) {
                compareDesc.client_target_price.change = 'down'
              }
              compareDesc.client_target_price.number = (
                Math.abs(
                  (Number(comparePro.client_target_price) - Number(item.client_target_price)) /
                    Number(item.client_target_price)
                ) * 100
              ).toFixed(2)
              // 手动夹断
              if (comparePro.desc !== item.desc) {
                compareDesc.desc.change = 'change'
              }
              // 手动夹断
              item.material_data.forEach((itemChild, indexChild) => {
                compareDesc.material_data.push({
                  change: '',
                  priceNew: 0,
                  priceNumber: 0,
                  priceChange: '',
                  weightChange: '',
                  weightNumber: 0,
                  weigthNew: 0,
                  totalPriceChange: '',
                  totalPriceNew: 0,
                  totalPriceNumber: 0
                })
                const finded = comparePro.material_data.find((item) => item.material_name === itemChild.material_name)
                if (!finded) {
                  compareDesc.material_data[indexChild].change = 'delete' //找不到说明被删了
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.price > itemChild.price) {
                    compareDesc.material_data[indexChild].priceChange = 'up'
                  } else if (finded.price < itemChild.price) {
                    compareDesc.material_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.material_data[indexChild].priceNew = finded.price
                  compareDesc.material_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.price) - Number(itemChild.price)) / Number(itemChild.price)) *
                    100
                  ).toFixed(2)

                  if (finded.weight > itemChild.weight) {
                    compareDesc.material_data[indexChild].weightChange = 'up'
                  } else if (finded.weight < itemChild.weight) {
                    compareDesc.material_data[indexChild].weightChange = 'down'
                  }
                  compareDesc.material_data[indexChild].weigthNew = finded.weight
                  compareDesc.material_data[indexChild].weightNumber = (
                    (Math.abs(Number(finded.weight) - Number(itemChild.weight)) / Number(itemChild.weight)) *
                    100
                  ).toFixed(2)

                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.material_data[indexChild].totalPriceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.material_data[indexChild].totalPriceChange = 'down'
                  }
                  compareDesc.material_data[indexChild].totalPriceNew = finded.total_price
                  compareDesc.material_data[indexChild].totalPriceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                }
              })
              comparePro.material_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.material_data.push({
                    change: 'add', // 标记是新增的
                    priceNew: 0,
                    priceNumber: 0,
                    priceChange: '',
                    weightChange: '',
                    weightNumber: 0,
                    weigthNew: 0,
                    totalPriceChange: '',
                    totalPriceNew: 0,
                    totalPriceNumber: 0
                  })
                  item.material_data.push(itemChild)
                })
              // 手动夹断
              item.assist_material_data.forEach((itemChild, indexChild) => {
                compareDesc.assist_material_data.push({
                  change: '',
                  priceNew: 0,
                  priceNumber: 0,
                  priceChange: '',
                  weightChange: '',
                  weightNumber: 0,
                  weigthNew: 0,
                  totalPriceChange: '',
                  totalPriceNew: 0,
                  totalPriceNumber: 0
                })
                const finded = comparePro.assist_material_data.find(
                  (item) => item.material_name === itemChild.material_name
                )
                if (!finded) {
                  compareDesc.assist_material_data[indexChild].change = 'delete' //找不到说明被删了
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.price > itemChild.price) {
                    compareDesc.assist_material_data[indexChild].priceChange = 'up'
                  } else if (finded.price < itemChild.price) {
                    compareDesc.assist_material_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.assist_material_data[indexChild].priceNew = finded.price
                  compareDesc.assist_material_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.price) - Number(itemChild.price)) / Number(itemChild.price)) *
                    100
                  ).toFixed(2)

                  if (finded.number > itemChild.number) {
                    compareDesc.assist_material_data[indexChild].weightChange = 'up'
                  } else if (finded.number < itemChild.number) {
                    compareDesc.assist_material_data[indexChild].weightChange = 'down'
                  }
                  compareDesc.assist_material_data[indexChild].weigthNew = finded.number
                  compareDesc.assist_material_data[indexChild].weightNumber = (
                    (Math.abs(Number(finded.number) - Number(itemChild.number)) / Number(itemChild.number)) *
                    100
                  ).toFixed(2)

                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.assist_material_data[indexChild].totalPriceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.assist_material_data[indexChild].totalPriceChange = 'down'
                  }
                  compareDesc.assist_material_data[indexChild].totalPriceNew = finded.total_price
                  compareDesc.assist_material_data[indexChild].totalPriceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                }
              })
              comparePro.assist_material_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.assist_material_data.push({
                    change: 'add', // 标记是新增的
                    priceNew: 0,
                    priceNumber: 0,
                    priceChange: '',
                    weightChange: '',
                    weightNumber: 0,
                    weigthNew: 0,
                    totalPriceChange: '',
                    totalPriceNew: 0,
                    totalPriceNumber: 0
                  })
                  item.assist_material_data.push(itemChild)
                })
              // 手动夹断
              item.weave_data.forEach((itemChild, indexChild) => {
                compareDesc.weave_data.push({
                  change: '',
                  priceNew: 0,
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.weave_data.find((item) => item.name === itemChild.name)
                if (!finded) {
                  compareDesc.weave_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.weave_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.weave_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.weave_data[indexChild].priceNew = finded.total_price
                  compareDesc.weave_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.weave_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.weave_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.weave_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.weave_data.push(itemChild)
                })
              // 手动夹断
              item.semi_product_data.forEach((itemChild, indexChild) => {
                compareDesc.semi_product_data.push({
                  change: '',
                  priceNew: '',
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.semi_product_data.find(
                  // @ts-ignore
                  (item) => item.process_name.join(',') === itemChild.process_name.join(',')
                )
                if (!finded) {
                  compareDesc.semi_product_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.semi_product_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.semi_product_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.semi_product_data[indexChild].priceNew = finded.total_price
                  compareDesc.semi_product_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.semi_product_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.semi_product_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.semi_product_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.semi_product_data.push(itemChild)
                })
              // 手动夹断
              item.production_data.forEach((itemChild, indexChild) => {
                compareDesc.production_data.push({
                  change: '',
                  priceNew: '',
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.production_data.find(
                  // @ts-ignore
                  (item) => item.name.join(',') === itemChild.name.join(',')
                )
                if (!finded) {
                  compareDesc.production_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.production_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.production_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.production_data[indexChild].priceNew = finded.total_price
                  compareDesc.production_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.production_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.production_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.production_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.production_data.push(itemChild)
                })
              // 手动夹断
              item.pack_material_data.forEach((itemChild, indexChild) => {
                compareDesc.pack_material_data.push({
                  change: '',
                  priceNew: '',
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.pack_material_data.find(
                  (item) => item.material_name === itemChild.material_name
                )
                if (!finded) {
                  compareDesc.pack_material_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.pack_material_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.pack_material_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.pack_material_data[indexChild].priceNew = finded.total_price
                  compareDesc.pack_material_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.pack_material_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.pack_material_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.pack_material_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.pack_material_data.push(itemChild)
                })
              // 手动夹断
              item.other_fee_data.forEach((itemChild, indexChild) => {
                compareDesc.other_fee_data.push({
                  change: '',
                  priceNew: '',
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.other_fee_data.find((item) => item.name === itemChild.name)
                if (!finded) {
                  compareDesc.other_fee_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.other_fee_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.other_fee_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.other_fee_data[indexChild].priceNew = finded.total_price
                  compareDesc.other_fee_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.other_fee_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.other_fee_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.other_fee_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.other_fee_data.push(itemChild)
                })
              // 手动夹断
              item.no_production_fee_data.forEach((itemChild, indexChild) => {
                compareDesc.no_production_fee_data.push({
                  change: '',
                  priceNew: '',
                  desc: '',
                  priceChange: '',
                  priceNumber: 0
                })
                const finded = comparePro.no_production_fee_data.find((item) => item.name === itemChild.name)
                if (!finded) {
                  compareDesc.no_production_fee_data[indexChild].change = 'delete'
                } else {
                  // @ts-ignore 加个标识，代表是旧的发生变化
                  finded.ifOld = true
                  if (finded.total_price > itemChild.total_price) {
                    compareDesc.no_production_fee_data[indexChild].priceChange = 'up'
                  } else if (finded.total_price < itemChild.total_price) {
                    compareDesc.no_production_fee_data[indexChild].priceChange = 'down'
                  }
                  compareDesc.no_production_fee_data[indexChild].priceNew = finded.total_price
                  compareDesc.no_production_fee_data[indexChild].priceNumber = (
                    (Math.abs(Number(finded.total_price) - Number(itemChild.total_price)) /
                      Number(itemChild.total_price)) *
                    100
                  ).toFixed(2)
                  if (finded.desc !== itemChild.desc) {
                    compareDesc.no_production_fee_data[indexChild].desc = finded.desc
                  }
                }
              })
              comparePro.no_production_fee_data
                .filter((item: any) => !item.ifOld)
                .forEach((itemChild: any) => {
                  compareDesc.no_production_fee_data.push({
                    change: 'add',
                    priceNew: '',
                    desc: '',
                    priceChange: '',
                    priceNumber: 0
                  })
                  item.no_production_fee_data.push(itemChild)
                })
              if (Number(item.transport_fee) > Number(comparePro.transport_fee)) {
                compareDesc.transport_fee.change = 'down'
              } else if (Number(item.transport_fee) < Number(comparePro.transport_fee)) {
                compareDesc.transport_fee.change = 'up'
              }
              compareDesc.number = Number(item.transport_fee)
                ? (
                    (Math.abs(Number(item.transport_fee) - Number(comparePro.transport_fee)) /
                      Number(item.transport_fee)) *
                    100
                  ).toFixed(2)
                : ''
              compareDesc.priceNew = Number(comparePro.transport_fee)
              compareDesc.transport_fee
              if (item.transport_fee_desc !== comparePro.transport_fee_desc) {
                compareDesc.desc = 'change'
              }
            })
          }
          this.compareFlag = false
          this.showCompareInfo = true
          this.loading = false
        })
    },
    init(id?: number) {
      this.loading = true
      this.showCompareInfo = false
      this.compareDesc = []
      quotedPrice
        .detail({
          id: id || Number(this.$route.query.id)
        })
        .then((res) => {
          this.quotedPriceInfo = res.data.data
          if (!id) {
            this.quotedList = [Number(this.$route.query.id)]
            // pid已经在关联id数组里了，所以不需要
            // if (this.quotedPriceInfo.pid) {
            //   this.quotedList.push(this.quotedPriceInfo.pid)
            // }
            if (this.quotedPriceInfo.rel_quote!.length > 0) {
              this.quotedList = this.quotedList.concat(this.quotedPriceInfo.rel_quote)
            }
          }
          this.loading = false
        })
    },
    checkOpr() {
      this.loading = true
      quotedPrice
        .oprLog({
          id: this.quotedList[this.quotedIndex]
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
    deleteQuotedPrice() {
      this.$confirm('是否删除报价单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          quotedPrice
            .delete({
              id: this.quotedList[this.quotedIndex]
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$router.push('/quotedPrice/list?page=1&keyword=&client_id=&user_id=&status=0&date=')
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
    saveBindOrder() {
      quotedPrice
        .bindOrder({
          quote_id: Number(this.quotedList[this.quotedIndex]),
          order_id: Number(this.bindOrderId)
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('绑定成功')
            this.bindOrderFlag = false
            this.init()
          }
        })
    },
    searchOrder(str: string, cb: any) {
      if (str) {
        order
          .list({
            page: 1,
            limit: 20,
            keyword: str,
            order_type: Number(this.bindOrderType)
          })
          .then((res) => {
            if (res.data.data.items.length > 0) {
              cb(
                res.data.data.items.map((item: any) => {
                  return {
                    value: item.system_code + '(' + item.code + ')' + '/' + item.client_name + '/' + item.user_name,
                    id: item.id
                  }
                })
              )
            } else {
              cb([])
            }
          })
      } else {
        cb([])
      }
    },
    selectId(ev: any) {
      this.bindOrderId = ev.id
    },
    getQuotedList() {
      this.init(this.quotedList[this.quotedIndex])
    }
  },
  mounted() {
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/quotedPrice/detail.less';
</style>
<style lang="less">
#quotedPriceDetail {
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
  .normalTab {
    .el-tabs__nav {
      margin-left: 32px !important;
    }
  }
}
</style>