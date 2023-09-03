<template>
  <div id="sampleOrderDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module"
      id="基本信息">
      <div class="titleCtn">
        <div class="title">样单信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">样单号：</div>
            <div class="text">{{sampleOrderInfo.code}}
              <span class="hoverBlue"
                style="cursor:pointer;font-size:14px"
                @click="$copyTextInfo(sampleOrderInfo.code)">复制</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">打样公司：</div>
            <div class="text">{{sampleOrderInfo.client_name}}</div>
          </div>
          <div class="col">
            <div class="label">公司联系人：</div>
            <div class="text">{{sampleOrderInfo.contacts_name}}</div>
          </div>
          <div class="col">
            <div class="label">负责组/人：</div>
            <div class="text">{{sampleOrderInfo.group_name}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">创建人：</div>
            <div class="text">{{sampleOrderInfo.user_name}}</div>
          </div>
          <div class="col">
            <div class="label">创建时间：</div>
            <div class="text">{{sampleOrderInfo.created_at}}</div>
          </div>
          <div class="col">
            <div class="label">样单状态：</div>
            <div class="text"
              :class="sampleOrderInfo.status|orderStatusClassFilter">{{sampleOrderInfo.status|orderStatusFilter}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注信息：</div>
            <div class="text"
              v-html="sampleOrderInfo.desc"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">文件信息：</div>
            <div class="fileCtn">
              <div class="once"
                v-for="(item,index) in sampleOrderInfo.public_files"
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
                  :href="item.file_url "
                  target=_blank
                  download>点击下载</a>
              </div>
              <div class="text"
                v-if="sampleOrderInfo.public_files.length===0">
                <span class="gray">暂无相关文件信息</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row"
          style="margin-bottom:0">
          <div class="col">
            <div class="label">{{confirmSampleInfo.length>0?'已确认样品信息：':'暂无确认的样品信息'}}</div>
            <div class="text"></div>
          </div>
        </div>
      </div>
      <div class="tableCtn"
        style="padding-top:0"
        v-if="confirmSampleInfo.length>0">
        <div class="box"
          v-for="(item,index) in confirmSampleInfo"
          :key="index">{{item.name||item.product_code||item.system_code}}({{item.category}}/{{item.secondary_category}})
          <span class="el-icon-view icon hoverBlue"
            @click="sampleDetail=item;sampleShow=true"></span>
        </div>
      </div>
    </div>
    <div class="module"
      id="打样信息">
      <el-tabs type="border-card"
        v-model="sampleOrderIndex">
        <el-tab-pane v-for="(item,index) in sampleOrderInfo.time_data"
          :key="item.id"
          :label="'第'+(index+1)+'次打样'"
          :name="index.toString()">
          <div class="detailCtn">
            <div class="checkCtn"
              style="top: 0px;"
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
                <div class="label">打样款数：</div>
                <div class="text">{{item.total_style}}款</div>
              </div>
              <div class="col">
                <div class="label">打样总数：</div>
                <div class="text">{{item.total_number}}</div>
              </div>
              <div class="col">
                <div class="label">打样总额：</div>
                <div class="text">{{item.total_price}}元</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">完成时间：</div>
                <div class="text"
                  :class="item.complete_time?'':'gray'">{{item.complete_time || '未填写'}}
                  <span v-if="item.complete_time && Number(item.status)<3"
                    :class="$diffByDate(item.complete_time)>0?'green':'red'">({{$diffByDate(item.complete_time)>0?'还剩'+$diffByDate(item.complete_time)+'天':'逾期'+Math.abs($diffByDate(item.complete_time))+'天'}})</span>
                </div>
              </div>
              <div class="col flex3">
                <div class="label">是否加急：</div>
                <div class="text"
                  :class="item.is_urgent===2?'gray':'red'">{{item.is_urgent===2?'否':'是'}}</div>
              </div>
              <div class="col">
                <div class="label">样单类型：</div>
                <div class="text"
                  :class="item.order_type?'':'gray'">{{item.order_type || '未填写'}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">下单时间：</div>
                <div class="text"
                  :class="item.order_time?'':'gray'">{{item.order_time || '未填写'}}</div>
              </div>
              <div class="col flex3">
                <div class="label">打样状态：</div>
                <div class="text"
                  :class="item.status|orderTimeStatusClass">{{item.status|orderTimeStatus}}</div>
              </div>
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text"
                  :class="item.batch_data[0].desc?'':'gray'">{{item.batch_data[0].desc || '未填写'}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            style="padding-top:0">
            <div class="thead">
              <div class="trow">
                <div class="tcol"
                  style="flex:1.2">样品编号</div>
                <div class="tcol"
                  style="flex:1.2">样品名称</div>
                <div class="tcol">样品图片</div>
                <div class="tcol noPad"
                  style="flex:4">
                  <div class="trow">
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">单价</div>
                    <div class="tcol">打样数量</div>
                    <div class="tcol">送样/留底数量</div>
                  </div>
                </div>
                <div class="tcol">关联单据</div>
                <!-- <div class="tcol">样品描述</div> -->
                <div class="tcol">客户确认状态</div>
                <div class="tcol">客户确认操作</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(item,index) in sampleOrderInfo.time_data[sampleOrderIndex].batch_data[0].product_data"
                :key="index">
                <!-- 判断样品信息是否完整 -->
                <template v-if="item.category && item.color_data.length>0 && item.size_data.length>0">
                  <div class="tcol"
                    style="flex:1.2">
                    <span class="blue"
                      @click="sampleDetail=item;sampleShow = true"
                      style="cursor:pointer">{{item.product_code || item.system_code}}</span>
                    <span class="gray">({{item.category}}/{{item.secondary_category}})</span>
                  </div>
                  <div class="tcol"
                    style="flex:1.2"
                    :class="{'gray':!item.name}">{{item.name || '无名称'}}</div>
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
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.product_info"
                      :key="indexChild">
                      <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcol">{{itemChild.price}}元</div>
                      <div class="tcol">{{itemChild.number}}</div>
                      <div class="tcol">{{itemChild.sample_number||0}}/{{itemChild.keep_number||0}}</div>
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
                  <!-- <div class="tcol">{{item.desc}}</div> -->
                  <div class="tcol">
                    <span :class="item.status|productStatusClassFilter">{{item.status|productStatusFilter}}</span>
                  </div>
                  <div class="tcol oprCtn">
                    <el-dropdown style="cursor:pointer">
                      <span class="el-dropdown-link hoverBlue">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="confirmSample(item.product_id,item.status===2?1:2)"
                          :disabled="item.status===6 ||item.status===5 || item.status===4 || item.status===3">
                          <div :class="item.status===2?'hoverOrange':'hoverGreen'">{{item.status===2?'重新打样':'确认大货生产'}}</div>
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="item.status===4 || item.status===3"
                          @click.native="item.status===6?confirmSample(item.product_id,1):confirmSample(item.product_id,6)"><span class="hoverBlue">{{item.status===6?'重新待定':'不确认继续打样'}}</span></el-dropdown-item>
                        <el-dropdown-item @click.native="confirmSample(item.product_id,item.status===5?1:5)"
                          :disabled="item.status===6 ||item.status===4 || item.status===3 || item.status===2">
                          <div class="hoverOrange">{{item.status===5?'重新打样':'不确认取消打样'}}</div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </template>
                <template v-else>
                  <div class="tcol">
                    <span class="gray"
                      style="text-align:center">样品信息待补充</span>
                  </div>
                  <div class="tcol oprCtn"
                    @click="sampleId=item.product_id;addSampleFlag=true">
                    <div class="opr hoverBlue">补充信息</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="titleCtn">
            <div class="title"
              style="display: flex;align-items: center;">物料汇总信息
            </div>
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
            <!-- 新接口，老接口代码已删除 -->
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
                          <div class="tcol"><span class="text">{{$toFixed(item.number,3,true)}}{{item.unit}}</span></div>
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
                          <div class="tcol"><span class="text">{{$toFixed(itemOrder.number,3,true)}}{{itemOrder.unit}}</span></div>
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
                          <div class="tcol"><span class="text">{{$toFixed(itemProcess.number,3,true)}}{{itemProcess.unit}}</span></div>
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
                          <div class="tcol"><span class="text">{{$toFixed(itemPush.number,3,true)}}{{itemPush.unit}}</span></div>
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
                          <div class="tcol"><span class="text">{{$toFixed(itemPop.number,3,true)}}{{itemPop.unit}}</span></div>
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="description"
      style="padding: 18px;
      background: #F0F0F0;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 24px;
      font-size: 18px;
      font-weight: bold;
      text-align:center"
      v-if="Number($getsessionStorage('has_check'))!==1">财务流程汇总仅管理员可见</div>
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
            style="margin-top:20px">样品费用</div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">样品编号</div>
                <div class="tcol">打样数量</div>
                <div class="tcol">平均单价</div>
                <div class="tcol">打样合计</div>
                <div class="tcol">操作</div>
              </div>
            </div>
            <div class="tbody"
              v-for="(item,index) in financialInfo.product"
              :key="index">
              <div class="trow">
                <div class="tcol">{{item.product_code}}</div>
                <div class="tcol">{{$toFixed(item.total_number,3,true)}}</div>
                <div class="tcol">{{item.pre_price}}{{sampleOrderInfo.settle_unit}}</div>
                <div class="tcol">{{$toFixed(item.total_price,3,true)}}{{sampleOrderInfo.settle_unit}}</div>
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
                    <div class="tcol">{{$toFixed(itemChild.number,3,true)}}</div>
                    <div class="tcol">{{itemChild.price}}{{sampleOrderInfo.settle_unit}}</div>
                    <div class="tcol">{{$toFixed(itemChild.total_price,3,true)}}{{sampleOrderInfo.settle_unit}}</div>
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
                  <div class="tcol blue">{{item.quote_info.price}}{{sampleOrderInfo.settle_unit}}</div>
                  <div class="tcol blue">{{$toFixed(item.quote_info.total_price,3,true)}}{{sampleOrderInfo.settle_unit}}</div>
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
                  <div>计划：{{$toFixed(financialInfo.material.material.gather.material_order.plan,3,true)}}</div>
                  <div>实际：{{$toFixed(financialInfo.material.material.gather.material_order.plan,3,true)}}</div>
                </div>
                <div class="tcol noPad"
                  style="flex:8">
                  <div class="trow">
                    <div class="tcol">
                      <div>计划：{{$toFixed(financialInfo.material.material.gather.material_transfer.plan,3,true)}}</div>
                      <div>实际：{{$toFixed(financialInfo.material.material.gather.material_transfer.plan,3,true)}}</div>
                    </div>
                    <div class="tcol">
                      <div>计划：{{$toFixed(financialInfo.material.material.gather.material_process.plan,3,true)}}</div>
                      <div>实际：{{$toFixed(financialInfo.material.material.gather.material_process.plan,3,true)}}</div>
                    </div>
                    <div class="tcol">{{$toFixed(financialInfo.material.material.gather.plan_price,3,true)}}元</div>
                    <div class="tcol">{{$toFixed(financialInfo.material.material.gather.real_price,3,true)}}元</div>
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
                        <div class="tcol">{{$toFixed(itemMat.number,3,true)}}</div>
                        <div class="tcol">{{$toFixed(itemMat.real_number,3,true)}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.total_price,3,true)}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.real_total_price,3,true)}}元</div>
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
                        <div class="tcol">{{$toFixed(itemMat.number,3,true)}}</div>
                        <div class="tcol">{{$toFixed(itemMat.real_number,3,true)}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.total_price,3,true)}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.real_total_price,3,true)}}元</div>
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
                        <div class="tcol">{{$toFixed(itemMat.number,3,true)}}</div>
                        <div class="tcol">{{$toFixed(itemMat.real_number,3,true)}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.total_price,3,true)}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.real_total_price,3,true)}}元</div>
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
                      <div class="tcol blue">{{$toFixed(financialInfo.material.material.gather.quote_info.quote_total_price,3,true)}}元</div>
                      <div class="tcol">-</div>
                      <div class="tcol blue">-</div>
                      <div class="tcol blue">{{financialInfo.material.material.gather.quote_info.pre_product_price}}元</div>
                      <div class="tcol blue">{{$toFixed(financialInfo.material.material.gather.quote_info.number,3,true)}}g</div>
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
                  <div>计划：{{$toFixed(financialInfo.material.decorate.gather.material_order.plan,3,true)}}</div>
                  <div>实际：{{$toFixed(financialInfo.material.decorate.gather.material_order.plan,3,true)}}</div>
                </div>
                <div class="tcol noPad"
                  style="flex:7">
                  <div class="trow">
                    <div class="tcol">
                      <div>计划：{{$toFixed(financialInfo.material.decorate.gather.material_transfer.plan,3,true)}}</div>
                      <div>实际：{{$toFixed(financialInfo.material.decorate.gather.material_transfer.plan,3,true)}}</div>
                    </div>
                    <div class="tcol">
                      <div>计划：{{$toFixed(financialInfo.material.decorate.gather.material_process.plan,3,true)}}</div>
                      <div>实际：{{$toFixed(financialInfo.material.decorate.gather.material_process.plan,3,true)}}</div>
                    </div>
                    <div class="tcol">{{$toFixed(financialInfo.material.decorate.gather.plan_price,3,true)}}元</div>
                    <div class="tcol">{{$toFixed(financialInfo.material.decorate.gather.real_price,3,true)}}元</div>
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
                        <div class="tcol">{{$toFixed(itemMat.number,3,true)}}</div>
                        <div class="tcol">{{$toFixed(itemMat.real_number,3,true)}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.total_price,3,true)}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.real_total_price,3,true)}}元</div>
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
                        <div class="tcol">{{$toFixed(itemMat.number,3,true)}}</div>
                        <div class="tcol">{{$toFixed(itemMat.real_number,3,true)}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.total_price,3,true)}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.real_total_price,3,true)}}元</div>
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
                        <div class="tcol">{{$toFixed(itemMat.number,3,true)}}</div>
                        <div class="tcol">{{$toFixed(itemMat.real_number,3,true)}}</div>
                        <div class="tcol">{{itemMat.price}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.total_price,3,true)}}元</div>
                        <div class="tcol">{{$toFixed(itemMat.real_total_price,3,true)}}元</div>
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
                      <div class="tcol blue">{{$toFixed(financialInfo.material.decorate.gather.quote_info.quote_total_price,3,true)}}元</div>
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
                    <div class="tcol">{{$toFixed(item.number,3,true)}}</div>
                    <div class="tcol">{{$toFixed(item.real_number,3,true)}}</div>
                    <div class="tcol">{{$toFixed(item.total_price,3,true)}}元</div>
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
                        <div class="tcol">{{$toFixed(itemPro.number,3,true)}}</div>
                        <div class="tcol">{{$toFixed(itemPro.real_number,3,true)}}</div>
                        <div class="tcol">{{itemPro.price}}元</div>
                        <div class="tcol">{{$toFixed(itemPro.total_price,3,true)}}元</div>
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
                      <div class="tcol blue">{{$toFixed(item.quote_info.quote_total_price,3,true)}}元</div>
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
                        <div class="tcol">{{$toFixed(item.number,3,true)}}</div>
                        <div class="tcol">{{item.extra_number}}</div>
                        <div class="tcol">{{$toFixed(item.total_price,3,true)}}元</div>
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
                            <div class="tcol">{{$toFixed(itemChild.number,3,true)}}</div>
                            <div class="tcol">{{itemChild.extra_number}}</div>
                            <div class="tcol red">{{itemChild.shoddy_number}}</div>
                            <div class="tcol">{{$toFixed(itemChild.total_price,3,true)}}元</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </template>
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
              <span class="text">样单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange"
                  @click="$router.push('/sampleOrder/update?id='+$route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">修改样单</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteSampleOrder">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">删除样单</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="checkTimeData">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shenhedingdan"></use>
                  </svg>
                  <span class="text">打样审核</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="goUpdateOrderTime">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">打样修改</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="goContinue">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">继续打样</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$openUrl('/sampleOrder/print?id='+$route.query.id+'&sampleOrderIndex='+sampleOrderIndex)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-dayindingdan"></use>
                  </svg>
                  <span class="text">打印样单</span>
                </div>
                <div class="btn"
                  :class="{'backHoverBlue':confirmSampleInfo.length>0,'backGray':confirmSampleInfo.length===0}"
                  @click="changeToOrder">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-dayindingdan"></use>
                  </svg>
                  <span class="text">转为订单</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$router.push('/quotedPrice/create?sampleOrderId='+$route.query.id+'&sampleOrderIndex='+sampleOrderIndex)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-dayindingdan"></use>
                  </svg>
                  <span class="text">转报价单</span>
                </div>
                <!-- <div class="btn backHoverBlue"
                  @click="checkClient">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shenhedingdan"></use>
                  </svg>
                  <span class="text">客户确认</span>
                </div> -->
                <div class="btn backHoverBlue"
                  @click="checkComplete">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shenhedingdan"></use>
                  </svg>
                  <span class="text">完成打样</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="sampleOrderUpdateFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">修改第{{Number(sampleOrderIndex)+1}}次打样信息</span>
          <div class="closeCtn"
            @click="sampleOrderUpdateFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="description">
              <span>修改打样信息不能修改样品信息，如需修改样品请再次打样</span>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">样单类型</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="info elCtn">
                  <el-select placeholder="请选择样单类型"
                    v-model="sampleOrderTime.order_type_id">
                    <el-option v-for="item in sampleOrderTypeList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">完成时间</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker placeholder="请选择完成时间"
                    v-model="sampleOrderTime.complete_time"
                    value-format="yyyy-MM-dd"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">是否加急打样</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-radio-group v-model="sampleOrderTime.is_urgent">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">样品信息</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcol">尺码颜色</div>
                      <div class="tcol">打样单价</div>
                      <div class="tcol"
                        style="flex:0.8">打样数量(必填)</div>
                      <div class="tcol"
                        style="flex:0.6">送样数量(选填)</div>
                      <div class="tcol"
                        style="flex:0.6">留底数量(选填)</div>
                      <div class="tcol">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in sampleOrderTime.batch_data[0].product_data"
                  :key="index">
                  <div class="tcol">
                    <span class="blue">{{item.product_code || item.system_code}}</span>
                    <span>{{item.category}}/{{item.secondary_category}}</span>
                  </div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.product_info"
                      :key="indexChild">
                      <div class="tcol">
                        <div class="elCtn">
                          <el-select v-model="itemChild.size_color"
                            placeholder="尺码颜色"
                            no-data-text="请先选择产品">
                            <el-option v-for="item in item.size_color_list"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="tcol">
                        <div class="elCtn">
                          <el-input v-model="itemChild.price"
                            placeholder="打样单价">
                            <template slot="append">元</template>
                          </el-input>
                        </div>
                      </div>
                      <div class="tcol"
                        style="flex:0.8">
                        <div class="elCtn">
                          <el-input :ref="'number'+ '-'+index+'-'+indexChild"
                            :class="{'error':mustFlag&&!itemChild.number}"
                            v-model="itemChild.number"
                            placeholder="打样数量"
                            @keydown.native="$focusByKeydown($event,'number',[index,indexChild],sampleOrderInfo.time_data.batch_data[0],['product_data','product_info'])">
                          </el-input>
                        </div>
                      </div>
                      <div class="tcol"
                        style="flex:0.6">
                        <div class="elCtn">
                          <el-input :ref="'sample_number'+ '-'+index+'-'+indexChild"
                            v-model="itemChild.sample_number"
                            placeholder="送样数量"
                            @input="(ev)=>{itemChild.keep_number=Number(itemChild.number)-Number(ev)}"
                            @keydown.native="$focusByKeydown($event,'sample_number',[index,indexChild],sampleOrderInfo.time_data.batch_data[0],['product_data','product_info'])">
                          </el-input>
                        </div>
                      </div>
                      <div class="tcol"
                        style="flex:0.6">
                        <div class="elCtn">
                          <el-input :ref="'keep_number'+ '-'+index+'-'+indexChild"
                            v-model="itemChild.keep_number"
                            placeholder="留底数量"
                            @input="(ev)=>{itemChild.sample_number=Number(itemChild.number)-Number(ev)}"
                            @keydown.native="$focusByKeydown($event,'keep_number',[index,indexChild],sampleOrderInfo.time_data.batch_data[0],['product_data','product_info'])">
                          </el-input>
                        </div>
                      </div>
                      <div class="tcol oprCtn"
                        style="justify-content: flex-start;">
                        <div class="opr hoverBlue"
                          @click="$addItem(item.product_info,{
                            sample_number:'',
                            keep_number:'',
                            ifNew:true,
                            size_color: '', // 用于下拉框选择尺码颜色
                            size_id: '',
                            color_id: '',
                            number: '',
                            price: ''
                          })">新增尺码</div>
                        <div class="opr hoverRed"
                          @click="deleteSampleSizeColor(item,itemChild,index,indexChild)">删除</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">打样款数</span>
                  <span class="explanation">(自动计算)</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入打样总数"
                    v-model="totalStyle"
                    disabled></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">打样总数</span>
                  <span class="explanation">(自动计算)</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入打样总数"
                    v-model="totalNumber"
                    disabled></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">打样总费用</span>
                  <span class="explanation">(自动计算)</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入打样总费用"
                    v-model="totalPrice"
                    disabled></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="sampleOrderUpdateFlag = false">取消</span>
          <span class="btn backHoverOrange"
            @click="saveUpdate">确认修改</span>
        </div>
      </div>
    </div>
    <!-- 侧边导航栏 -->
    <zh-side-nav :data="[{
      name:'基本信息',
      mark:'#基本信息'
    },{
      name:'打样信息',
      mark:'#打样信息'
    },{
      name:'财务概览',
      mark:'#财务概览'
    }]"></zh-side-nav>
    <!-- 关联单据 -->
    <zh-order-log :order_id="$route.query.id"
      :order_time_id="sampleOrderInfo.time_data[sampleOrderIndex].id"
      :show="orderLogFlag"
      @close="orderLogFlag=false"></zh-order-log>
    <sample-detail :id="sampleDetail.product_id"
      :show="sampleShow"
      @close="sampleShow = false"
      @afterDetailUpdate="afterSampleUpdate"></sample-detail>
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{sampleOrderInfo.time_data[sampleOrderIndex].is_check=ev;$forceUpdate()}"
      :show="checkFlag"
      :pid="sampleOrderInfo.time_data[sampleOrderIndex].id"
      :check_type="1"
      :reason="[]"></zh-check>
    <zh-check-detail :pid="sampleOrderInfo.time_data[sampleOrderIndex].id"
      :check_type="1"
      :show="checkDetailFlag"
      @close="checkDetailFlag=false"></zh-check-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SampleInfo } from '@/types/sample'
import { SampleOrderInfo, SampleOrderTime } from '@/types/sampleOrder'
import { order, sampleOrder } from '@/assets/js/api'
interface SampleOrderDetail extends SampleOrderInfo {
  time_data: SampleOrderTime[]
}
export default Vue.extend({
  data(): {
    confirmSampleInfo: SampleOrderDetail[]
    sampleOrderInfo: SampleOrderDetail
    sampleOrderTime: SampleOrderTime
    [propName: string]: any
  } {
    return {
      loading: true,
      sampleShow: false,
      checkFlag: false,
      checkDetailFlag: false,
      show_financial: false,
      show_material: false,
      materialProgress: {
        material_pop: 0,
        material_push: 0
      },
      sampleDetail: {
        product_type: 2,
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
      addSampleFlag: false,
      sampleOrderIndex: '0', // el-tab组件需要string数据
      sampleOrderInfo: {
        id: null,
        client_id: '',
        tree_data: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '', // 订单用无用字段
        settle_unit: '', // 订单用无用字段
        order_type: 2,
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
                    image_data: [],
                    product_id: '',
                    size_color_list: [], // 用于下拉框选择尺码颜色
                    product_info: [
                      {
                        sample_number: '',
                        keep_number: '',
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
      sampleOrderUpdateFlag: false,
      sampleOrderTime: {
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
                image_data: [],
                product_id: '',
                size_color_list: [], // 用于下拉框选择尺码颜色
                product_info: [
                  {
                    sample_number: '',
                    keep_number: '',
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
      },
      sampleId: '',
      materialUpdateTime: {
        order: '',
        pop: '',
        process: '',
        push: '',
        transfer: ''
      },
      materialDetail: [],
      confirmSampleInfo: [], // 已经确认的样品信息
      unConfirmSampleInfo: [], // 除了已确认的其他样品信息
      orderLogFlag: false,
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
      }
    }
  },
  computed: {
    sampleOrderTypeList(): any[] {
      return this.$store.state.api.sampleOrderType.arr
    },
    totalStyle(): number {
      return this.sampleOrderTime.batch_data[0].product_data.length
    },
    totalPrice(): number {
      return this.sampleOrderTime.batch_data[0].product_data.reduce((total, current) => {
        return (
          total +
          current.product_info.reduce((totalChild, itemChild) => {
            return totalChild + Number(itemChild.price) * Number(itemChild.number)
          }, 0)
        )
      }, 0)
    },
    totalNumber(): number {
      return this.sampleOrderTime.batch_data[0].product_data.reduce((total, current) => {
        return (
          total +
          current.product_info.reduce((totalChild, itemChild) => {
            return totalChild + Number(itemChild.number)
          }, 0)
        )
      }, 0)
    }
  },
  filters: {
    orderTimeStatus(val: number) {
      const statusArr = ['', '已创建', '进行中', '已完成', '已结算', '已逾期', '已取消']
      return statusArr[val]
    },
    orderTimeStatusClass(val: number) {
      const statusArr = ['', 'orange', 'blue', 'green', 'green', 'red', 'gray']
      return statusArr[val]
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        sampleOrder.detail({
          id: Number(this.$route.query.id)
        }),
        sampleOrder.confirmList({
          order_id: Number(this.$route.query.id),
          status: []
        })
      ]).then((res) => {
        this.sampleOrderInfo = res[0].data.data
        this.confirmSampleInfo = res[1].data.data.filter((item: any) => item.status === 2)
        this.unConfirmSampleInfo = res[1].data.data.filter((item: any) => item.status !== 2)
        if (this.$route.query.sampleOrderIndex) {
          this.sampleOrderInfo.time_data.forEach((item, index) => {
            if (item.id === Number(this.$route.query.sampleOrderIndex)) {
              this.sampleOrderIndex = index.toString()
            }
          })
        } else {
          this.sampleOrderIndex = (this.sampleOrderInfo.time_data.length - 1).toString()
        }

        this.$checkCommonInfo([
          {
            checkWhich: 'api/sampleOrderType',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getSampleOrderTypeAsync'
          }
        ])
        sampleOrder
          .materialDetail({
            order_id: Number(this.sampleOrderInfo.time_data[this.sampleOrderIndex].id)
          })
          .then((res) => {
            if (res.data.status) {
              this.materialProgress = res.data.data.progress
              this.materialDetail = res.data.data.data
              this.materialUpdateTime = res.data.data.update_time
            }
            this.loading = false
          })
        this.loading = false
      })
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
            this.$openUrl(
              '/quotedPrice/create?sampleOrderId=' +
                this.$route.query.id +
                '&product_id=' +
                item.product_id +
                '&sampleOrderIndex=' +
                this.sampleOrderIndex
            )
          })
          .catch((action: any) => {
            if (action === 'cancel') {
              this.$openUrl(
                '/quotedPrice/list?page=1&keyword=&client_id=' +
                  this.sampleOrderInfo.client_id +
                  '&contacts_id=' +
                  this.sampleOrderInfo.contacts_id +
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
    deletePro(id: number, index: number, info: any[]) {
      this.$confirm('是否删除该产品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sampleOrder
            .deletePro({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$deleteItem(info, index)
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
    deleteProChild(id: number, index: number, info: any[]) {
      this.$confirm(
        '注意：点击确定删除该尺码颜色后，无需点击修改按钮，该尺码颜色将会直接从该样单中删除，是否需要删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          sampleOrder
            .deleteProChild({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$deleteItem(info, index)
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
    deleteSampleSizeColor(item: any, itemChild: any, index: number, indexChild: number) {
      if (item.product_info.length > 1) {
        if (itemChild.ifNew) {
          this.$deleteItem(item.product_info, indexChild)
        } else {
          this.deleteProChild(itemChild.id, indexChild, item.product_info)
        }
      } else {
        if (this.sampleOrderTime.batch_data[0].product_data.length > 1) {
          this.deletePro(item.id, index, this.sampleOrderTime.batch_data[0].product_data)
        } else {
          this.$message.error('不能删除最后一个样品')
        }
      }
    },
    // 审核
    checkTimeData() {
      this.$confirm('是否审核第' + (Number(this.sampleOrderIndex) + 1) + '次打样信息', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.checkFlag = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    confirmSample(sampleId: number, status: 1 | 2 | 3 | 5 | 6) {
      const tipsArr = [
        '',
        '该样品是否需要重新打样？',
        '是否确认该样品已经被客户确认完成？',
        '',
        '',
        '该样品客户是否确认取消打样？',
        '该样品客户是否确认继续打样？'
      ]
      this.$confirm(tipsArr[status], '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          sampleOrder
            .confirm({
              id: sampleId,
              status: status
            })
            .then((res) => {
              if (res.data.status) {
                if (status === 2) {
                  this.$message.success('该样品已确认完成')
                } else if (status === 5) {
                  this.$message.success('该样品已确认不做')
                } else if (status === 6) {
                  this.$message.success('该样品已确认继续打样')
                } else {
                  this.$message.success('该样品已重新待定')
                }
                // @ts-ignore
                ;(this.sampleOrderInfo.time_data as SampleOrderTime[])[
                  this.sampleOrderIndex
                ].batch_data[0].product_data.find((item) => item.product_id === sampleId)!.status = status
              }
              // 重新获取已确认样品
              sampleOrder
                .confirmList({
                  order_id: Number(this.$route.query.id),
                  status: []
                })
                .then((res) => {
                  this.confirmSampleInfo = res.data.data.filter((item: any) => item.status === 2)
                  this.unConfirmSampleInfo = res.data.data.filter((item: any) => item.status !== 2)
                  this.loading = false
                })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    goContinue() {
      const unConfirmLength = this.unConfirmSampleInfo.filter((item: any) => item.status === 6).length
      if (unConfirmLength === 0) {
        this.$message.error('暂无客户确认需要继续打样的样品，请确认后继续打样')
        return
      }
      this.$confirm('客户确认需要继续打样的样品会进入继续打样，是否继续操作?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push(
            '/sampleOrder/again?id=' + this.$route.query.id + '&sampleOrderIndex=' + this.sampleOrderIndex
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 转大货生产
    changeToOrder() {
      if (this.confirmSampleInfo.length === 0) {
        this.$message.warning('需要客户确认操作为大货生产的样品才能转为订单')
        return
      }
      if (
        this.sampleOrderInfo.time_data.some((item) => {
          return item.batch_data[0].product_data.some((itemChild) => itemChild.status === 1)
        })
      ) {
        this.$confirm('检测到还存在未修改也未确认的样品，是否将已确认的样品信息转大货生产？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push('/order/create?sampleOrderId=' + this.$route.query.id)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else {
        this.$router.push('/order/create?sampleOrderId=' + this.$route.query.id)
      }
    },
    deleteSampleOrder() {
      if (!this.$permissionsFlag('2-4')) {
        return
      }
      this.$confirm(
        this.sampleOrderInfo.status === 1
          ? '是否删除该订单？'
          : '该样单已在进行中，删除样单会将后续所有关联单据同步删除，是否继续？?',
        '提示',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          sampleOrder
            .delete({
              id: Number(this.$route.query.id)
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$router.push('/sampleOrder/list?page=1&keyword=&client_id=&user_id=&status=null0&date=')
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
    goUpdateOrderTime() {
      this.sampleOrderTime = this.sampleOrderInfo.time_data[this.sampleOrderIndex]
      this.sampleOrderTime.batch_data[0].product_data.forEach((item) => {
        item.size_color_list = []
        item.size_data?.forEach((itemSize) => {
          item.color_data?.forEach((itemColor) => {
            item.size_color_list.push({
              label: itemSize.name + '/' + itemColor.name,
              value: itemSize.id + '/' + itemColor.id
            })
          })
        })
        item.product_info.forEach((itemPro) => {
          itemPro.size_color = itemPro.size_id + '/' + itemPro.color_id
        })
      })
      this.sampleOrderUpdateFlag = true
    },
    afterSampleUpdate(sample: SampleInfo) {
      this.init()
    },
    saveUpdate() {
      const formData = this.$clone(this.sampleOrderInfo)
      // @ts-ignore
      formData.time_data = this.$clone(this.sampleOrderTime)
      // @ts-ignore
      formData.time_data.batch_data[0].product_data.forEach((item) => {
        item.product_info.forEach((itemChild: any) => {
          itemChild.size_id = itemChild.size_color.split('/')[0]
          itemChild.color_id = itemChild.size_color.split('/')[1]
        })
      })
      // @ts-ignore
      formData.time_data.total_style = this.totalStyle
      // @ts-ignore
      formData.time_data.total_number = this.totalNumber
      // @ts-ignore
      formData.time_data.total_price = this.totalPrice
      sampleOrder.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('修改样单成功')
          this.sampleOrderUpdateFlag = false
          this.init()
        }
      })
    },
    // 客户确认
    // checkClient() {
    //   this.$confirm('客户是否确认第' + (Number(this.sampleOrderIndex) + 1) + '次打样信息', '提示', {
    //     confirmButtonText: '确认',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       sampleOrder
    //         .clientCheck({
    //           order_id: this.sampleOrderInfo.time_data[this.sampleOrderIndex].id as number
    //         })
    //         .then((res) => {
    //           if (res.data.status) {
    //             this.$message.success('已确认')
    //             this.init()
    //           }
    //         })
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消'
    //       })
    //     })
    // },
    // 打样确认完成
    checkComplete() {
      this.$confirm('是否确认第' + (Number(this.sampleOrderIndex) + 1) + '次打样信息已完成', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sampleOrder
            .completeCheck({
              order_id: this.sampleOrderInfo.time_data[this.sampleOrderIndex].id as number
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('已确认')
                this.init()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  },
  mounted() {
    this.init()
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
@import '~@/assets/css/sampleOrder/detail.less';
</style>
<style lang="less">
#sampleOrderDetail {
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
}
</style>