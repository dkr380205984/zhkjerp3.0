<template>
  <div class="bodyContainer"
    id="materialManageDetail"
    v-loading="loading">
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">物料信息合计</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">单据编号：</div>
            <div class="text">{{materialPlanInfo.code}}</div>
          </div>
          <div class="col">
            <div class="label">关联订单：</div>
            <div class="text">{{materialPlanInfo.order_code}}</div>
          </div>
          <div class="col">
            <div class="label">创建人：</div>
            <div class="text">{{materialPlanInfo.user_name}}</div>
          </div>
        </div>
      </div>
      <div class="tableCtn"
        style="padding-top:0">
        <div class="thead">
          <div class="trow">
            <div class="tcol"
              style="flex:0.3">
              <el-checkbox v-model="checkAllPlanFlag">全选</el-checkbox>
            </div>
            <div class="tcol">原料名称</div>
            <div class="tcol">原料颜色</div>
            <div class="tcol">所需数量</div>
            <div class="tcol">原料损耗</div>
            <div class="tcol">最终数量</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in planMaterialList"
            :key="index">
            <div class="tcol"
              style="flex:0.3">
              <el-checkbox v-model="item.check"
                @change="$forceUpdate()"></el-checkbox>
            </div>
            <div class="tcol">{{item.material_name}}</div>
            <div class="tcol">{{item.material_color}}</div>
            <div class="tcol">{{item.need_number}}kg</div>
            <div class="tcol">{{item.loss}}%</div>
            <div class="tcol">{{item.final_number}}kg</div>
          </div>
        </div>
      </div>
      <div class="buttonList">
        <div class="btn backHoverBlue">
          <i class="el-icon-s-grid"></i>
          <span class="text">计划单操作</span>
        </div>
        <div class="otherInfoCtn">
          <div class="otherInfo">
            <div class="btn backHoverBlue"
              @click="goOrderMaterial('色纱')">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">订购色纱</span>
            </div>
            <div class="btn backHoverBlue"
              @click="goOrderMaterial('白胚')">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">订购白胚</span>
            </div>
            <div class="btn backHoverOrange"
              @click="goStockMaterial()">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">库存调取</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 订购单列表 -->
    <div class="module">
      <el-tabs type="border-card"
        v-model="materialOrderIndex">
        <el-tab-pane v-for="(item,index) in materialOrderList"
          :key="index"
          :name="item.id.toString()"
          :label="'订购单'+(index+1)">
          <div class="titleCtn">
            <div class="title">订购信息</div>
          </div>
          <div class="detailCtn">
            <div class="row">
              <div class="col">
                <div class="label">单据编号：</div>
                <div class="text">{{item.code}}</div>
              </div>
              <div class="col">
                <div class="label">订购单位：</div>
                <div class="text">{{item.client_name}}</div>
              </div>
              <div class="col">
                <div class="label">下单日期：</div>
                <div class="text">{{item.order_time}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">订购总数：</div>
                <div class="text">{{item.total_number}}kg</div>
              </div>
              <div class="col">
                <div class="label">订购总额：</div>
                <div class="text">{{item.total_price}}元</div>
              </div>
              <div class="col">
                <div class="label">交货日期：</div>
                <div class="text">{{item.delivery_time}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text">{{item.desc}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            style="padding-top:0">
            <div class="thead">
              <div class="trow">
                <div class="tcol"
                  style="flex:0.3">
                  <el-checkbox v-model="checkAllOrderFlag">全选</el-checkbox>
                </div>
                <div class="tcol">原料名称</div>
                <div class="tcol">订购颜色</div>
                <div class="tcol">订购属性</div>
                <div class="tcol">订购数量</div>
                <div class="tcol">订购单价</div>
                <div class="tcol">加工数量</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.info_data"
                :key="indexChild">
                <div class="tcol"
                  style="flex:0.3">
                  <el-checkbox v-model="itemChild.check"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="tcol">{{itemChild.material_name}}</div>
                <div class="tcol">{{itemChild.material_color}}</div>
                <div class="tcol">{{itemChild.attribute}}</div>
                <div class="tcol">{{itemChild.number}}kg</div>
                <div class="tcol">{{itemChild.price}}元</div>
                <div class="tcol">加工数量</div>
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
                <div class="btn backHoverBlue"
                  @click="goProcessMaterial('订购加工')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">物料加工</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="materialOrderUpdataInfo=$clone(item);materialOrderUpdataFlag=true">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">单据修改</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteMaterialOrder(item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">删除单据</span>
                </div>
              </div>
            </div>
          </div>
          <div class="titleCtn"
            style="margin-top:32px">
            <div class="title">加工信息</div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">加工单号</div>
                <div class="tcol">加工单位</div>
                <div class="tcol">工序</div>
                <div class="tcol noPad"
                  style="flex:4">
                  <div class="trow">
                    <div class="tcol">纱线名称</div>
                    <div class="tcol">加工详情</div>
                    <div class="tcol">加工数量</div>
                    <div class="tcol">加工单价</div>
                  </div>
                </div>
                <div class="tcol">截止日期</div>
                <div class="tcol">备注信息</div>
                <div class="tcol">操作</div>
              </div>
            </div>
            <template v-if="item.process_info.length>0">
              <div class="tbody">
                <div class="trow"
                  v-for="itemProcess in item.process_info"
                  :key="itemProcess.id">
                  <div class="tcol"><span class="overText">{{itemProcess.code}}</span></div>
                  <div class="tcol">{{itemProcess.client_name}}</div>
                  <div class="tcol">{{itemProcess.process}}</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemMat,indexMat) in itemProcess.info_data"
                      :key="indexMat">
                      <div class="tcol">{{itemMat.material_order_name}}</div>
                      <div class="tcol">
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
                      <div class="tcol">{{itemMat.number}}kg</div>
                      <div class="tcol">{{itemMat.price}}元</div>
                    </div>
                  </div>
                  <div class="tcol">{{itemProcess.delivery_time}}</div>
                  <div class="tcol">{{itemProcess.desc}}</div>
                  <div class="tcol oprCtn">
                    <div class="opr hoverOrange"
                      @click="materialProcessUpdataInfo=$clone(itemProcess);materialProcessUpdataFlag=true">修改</div>
                    <div class="opr hoverRed"
                      @click="deleteMaterialProcess(itemProcess.id)">删除</div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="tbody">
                <div class="trow">
                  <div class="tcol gray"
                    style="text-align:center">
                    <span>暂无加工信息</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 调取单列表 -->
    <div class="module">
      <el-tabs type="border-card"
        v-model="materialStockIndex">
        <el-tab-pane v-for="(item,index) in materialStockLog"
          :key="index"
          :name="item.id.toString()"
          :label="'调取单'+(index+1)">
          <div class="titleCtn">
            <div class="title">调取信息</div>
          </div>
          <div class="detailCtn">
            <div class="row">
              <div class="col">
                <div class="label">单据编号：</div>
                <div class="text">{{item.code}}</div>
              </div>
              <div class="col">
                <div class="label">来源仓库：</div>
                <div class="text">{{item.store}}/{{item.secondary_store}}</div>
              </div>
              <div class="col">
              </div>
            </div>
          </div>
          <div class="tableCtn"
            style="padding-top:0">
            <div class="thead">
              <div class="trow">
                <div class="tcol"
                  style="flex:0.3">
                  <el-checkbox v-model="checkAllStockFlag">全选</el-checkbox>
                </div>
                <div class="tcol">原料名称</div>
                <div class="tcol">调取颜色</div>
                <div class="tcol">调取属性</div>
                <div class="tcol">批号/缸号/色号</div>
                <div class="tcol">调取数量</div>
                <div class="tcol">调取单价</div>
                <div class="tcol">加工数量</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.info_data"
                :key="indexChild">
                <div class="tcol"
                  style="flex:0.3">
                  <el-checkbox v-model="itemChild.check"
                    @change="$forceUpdate()"></el-checkbox>
                </div>
                <div class="tcol">{{itemChild.material_name}}</div>
                <div class="tcol">{{itemChild.material_color}}</div>
                <div class="tcol">{{itemChild.attribute}}</div>
                <div class="tcol">{{itemChild.batch_code}}/{{itemChild.vat_code}}/{{itemChild.color_code}}</div>
                <div class="tcol">{{itemChild.number}}kg</div>
                <div class="tcol">{{itemChild.price||0}}元</div>
                <div class="tcol">加工数量</div>
              </div>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">调取单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverBlue"
                  @click="goProcessMaterial('调取加工')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">物料加工</span>
                </div>
                <!-- <div class="btn backHoverOrange">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">单据修改</span>
                </div> -->
                <div class="btn backHoverRed"
                  @click="deleteMaterialStock(item.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">删除单据</span>
                </div>
              </div>
            </div>
          </div>
          <div class="titleCtn"
            style="margin-top:32px">
            <div class="title">加工信息</div>
          </div>
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">加工单号</div>
                <div class="tcol">加工单位</div>
                <div class="tcol">工序</div>
                <div class="tcol noPad"
                  style="flex:4">
                  <div class="trow">
                    <div class="tcol">纱线名称</div>
                    <div class="tcol">加工详情</div>
                    <div class="tcol">加工数量</div>
                    <div class="tcol">加工单价</div>
                  </div>
                </div>
                <div class="tcol">截止日期</div>
                <div class="tcol">备注信息</div>
                <div class="tcol">操作</div>
              </div>
            </div>
            <template v-if="item.process_info.length>0">
              <div class="tbody">
                <div class="trow"
                  v-for="itemProcess in item.process_info"
                  :key="itemProcess.id">
                  <div class="tcol"><span class="overText">{{itemProcess.code}}</span></div>
                  <div class="tcol">{{itemProcess.client_name}}</div>
                  <div class="tcol">{{itemProcess.process}}</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemMat,indexMat) in itemProcess.info_data"
                      :key="indexMat">
                      <div class="tcol">{{itemMat.material_transfer_name}}</div>
                      <div class="tcol">
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
                      <div class="tcol">{{itemMat.number}}kg</div>
                      <div class="tcol">{{itemMat.price}}元</div>
                    </div>
                  </div>
                  <div class="tcol">{{itemProcess.delivery_time}}</div>
                  <div class="tcol">{{itemProcess.desc}}</div>
                  <div class="tcol oprCtn">
                    <div class="opr hoverOrange"
                      @click="materialProcessUpdataInfo=$clone(itemProcess);materialProcessUpdataFlag=true">修改</div>
                    <div class="opr hoverRed"
                      @click="deleteMaterialProcess(item.id)">删除</div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="tbody">
                <div class="trow">
                  <div class="tcol gray"
                    style="text-align:center">
                    <span>暂无加工信息</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 物料订购 -->
    <div class="popup"
      v-show="materialOrderFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">物料订购</span>
          <div class="closeCtn"
            @click="closeOrder">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn"
            v-for="(item,index) in materialOrderInfo"
            :key="index">
            <div class="deleteIcon"
              @click="materialOrderInfo.length>1?$deleteItem(materialOrderInfo,index):$message.error('至少有一家订购单位')">
              <i class="el-icon-close"></i>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">订购单位</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-cascader placeholder="请选择订购单位"
                    v-model="item.client_id_arr"
                    :options="orderClientList"></el-cascader>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">订购时间</span>
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
                  <el-date-picker style="width:100%"
                    placeholder="请选择交货日期"
                    value-format="yyyy-MM-dd"
                    v-model="item.delivery_time"></el-date-picker>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemMat,indexMat) in item.info_data"
              :key="'mat' + indexMat">
              <div class="col">
                <div class="label"
                  v-if="indexMat===0">
                  <span class="text">物料名称</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select placeholder="请选择物料名称"
                    v-model="itemMat.material_id">
                    <el-option v-for="item in selectMaterialOrderList"
                      :key="item.material_id"
                      :value="item.material_id"
                      :label="item.material_name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">订购属性</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="once">
                    <span class="text">订购颜色</span>
                    <span class="explanation">(必选)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-select class="once"
                    placeholder="属性"
                    v-model="itemMat.attribute">
                    <el-option v-for="item in yarnAttributeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                  <template>
                    <el-input class="once"
                      placeholder="白胚"
                      disabled
                      v-if="itemMat.material_color==='白胚'"></el-input>
                    <el-autocomplete v-else
                      class="once"
                      v-model="itemMat.material_color"
                      :fetch-suggestions="searchColor"
                      placeholder="物料颜色"></el-autocomplete>
                  </template>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">订购单价</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="once">
                    <span class="text">订购数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once"
                    placeholder="单价"
                    v-model="itemMat.price">
                    <template slot="append">元</template>
                  </el-input>
                  <el-input class="once"
                    placeholder="数量"
                    v-model="itemMat.number">
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexMat===0"
                @click="$addItem(item.info_data,{
                  material_type:1,
                  material_id: '',
                  material_name: '',
                  material_color_id: itemMat.material_color_id===0?0:'',
                  attribute: '',
                  price: '',
                  number: '',
                  unit: 'kg'
                })">添加</div>
              <div class="opr hoverRed"
                v-if="indexMat>0"
                @click="$deleteItem(item.info_data,indexMat)">删除</div>
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
                  <span class="text">订购备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入订购备注信息"
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
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="btn backHoverBlue"
            style="margin-bottom:16px"
            @click="$addItem(materialOrderInfo,{
              order_id: '',
              plan_id: '',
              client_id: '',
              client_id_arr: [],
              order_time:$getDate(new Date()),
              delivery_time: '',
              others_fee_data: [
                {
                  desc: '', // 额外费用备注
                  name: '',
                  price: ''
                }
              ],
              desc: '',
              info_data: [
                {
                  material_type:1,
                  material_id: '',
                  material_name: '',
                  material_color: '',
                  attribute: '',
                  price: '',
                  number: '',
                  unit: 'kg'
                }
              ]
            })">添加订购单位</div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeOrder">取消</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialOrder">确认</span>
        </div>
      </div>
    </div>
    <!-- 物料调取 -->
    <div class="popup"
      v-show="materialStockFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">物料调取</span>
          <div class="closeCtn"
            @click="closeStock">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="stepCtn">
            <div class="step"
              :class="{'active':step===1}">
              <div class="circle">
                <span class="white">1</span>
              </div>
              <div class="name">选择库存</div>
            </div>
            <div class="step"
              :class="{'active':step===2}">
              <div class="circle">
                <span class="white">2</span>
              </div>
              <div class="name">调取信息</div>
            </div>
          </div>
          <template v-if="step===1">
            <div class="selectCtn">
              <div class="label">已选择物料：</div>
              <div class="boxCtn">
                <div class="box"
                  v-for="item in checkMaterialOrderList"
                  :key="item.id">{{item.material_name}}/{{item.material_color}}
                  <span class="el-icon-search closeIcon hoverGreen"
                    @click="materialStockFilter.material_name=item.material_name;materialStockFilter.material_color=item.material_color;searchMaterial()"></span>
                </div>
              </div>
            </div>
            <div class="listCtn">
              <div class="filterCtn">
                <div class="elCtn">
                  <el-input placeholder="物料名称"
                    v-model="materialStockFilter.material_name"></el-input>
                </div>
                <div class="elCtn">
                  <el-input placeholder="物料颜色"
                    v-model="materialStockFilter.material_color"></el-input>
                </div>
                <div class="elCtn">
                  <el-input placeholder="批号"
                    v-model="materialStockFilter.batch_code"></el-input>
                </div>
                <div class="elCtn">
                  <el-input placeholder="缸号"
                    v-model="materialStockFilter.vat_code"></el-input>
                </div>
                <div class="elCtn">
                  <el-input placeholder="色号"
                    v-model="materialStockFilter.color_code"></el-input>
                </div>
                <div class="elCtn">
                  <el-cascader placeholder="筛选仓库"
                    v-model="materialStockFilter.store_id_arr"
                    :options="storeList"
                    @change="searchMaterial"></el-cascader>
                </div>
                <div class="btn backHoverBlue fr"
                  @click="searchMaterial">搜索</div>
              </div>
              <div class="list"
                v-loading="searchLoading">
                <div class="row title">
                  <div class="col">仓库名称</div>
                  <div class="col">物料名称</div>
                  <div class="col">物料颜色</div>
                  <div class="col">物料属性</div>
                  <div class="col">批号/缸号/色号</div>
                  <div class="col">库存数量</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="item in materialStockList"
                  :key="item.id">
                  <div class="col">{{item.store}}/{{item.secondary_store}}</div>
                  <div class="col">{{item.material_name}}</div>
                  <div class="col">{{item.material_color}}</div>
                  <div class="col">{{item.attribute}}</div>
                  <div class="col">{{item.batch_code}}/{{item.vat_code}}/{{item.color_code}}</div>
                  <div class="col">{{item.number}}kg</div>
                  <div class="col">
                    <el-checkbox v-model="item.check"
                      @change="checkMaterialStock($event,item)"></el-checkbox>
                  </div>
                </div>
                <div class="pageCtn">
                  <el-pagination background
                    :page-size="5"
                    layout="prev, pager, next"
                    :total="searchTotal"
                    :current-page.sync="searchPage"
                    @current-change="searchMaterial">
                  </el-pagination>
                </div>
              </div>
            </div>
            <div class="selectCtn">
              <div class="label">计划调取物料：</div>
              <div class="boxCtn">
                <div class="box"
                  v-for="(item,index) in materialStockCheckList"
                  :key="item.id">{{item.material_name}}/{{item.material_color}}/{{item.attribute}}/{{item.batch_code}}/{{item.vat_code}}/{{item.color_code}}
                  <span class="el-icon-circle-close closeIcon hoverRed"
                    @click="$deleteItem(materialStockCheckList,index)"></span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="step===2">
            <div class="editCtn">
              <div class="row"
                v-for="(item,index) in materialStockInfo.info_data"
                :key="index">
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">库存物料</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择库存物料"
                      v-model="item.tree_data"
                      @change="getMatId($event,item)">
                      <el-option v-for="item in materialStockCheckList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.material_name+'/'+item.material_color +'/'+item.attribute +'/'+item.batch_code +'/'+item.vat_code +'/'+item.color_code"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">单据物料</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择单据物料"
                      v-model="item.rel_doc_info_id">
                      <el-option v-for="item in checkMaterialOrderList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.material_name+'/'+item.material_color"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label spaceBetween"
                    v-if="index===0">
                    <div class="once">
                      <span class="text">调取单价</span>
                      <span class="explanation">(选填)</span>
                    </div>
                    <div class="once">
                      <span class="text">调取数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                  </div>
                  <div class="info spaceBetween elCtn">
                    <div class="once">
                      <el-input placeholder="调取单价"
                        v-model="item.price">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                    <div class="once">
                      <el-input placeholder="调取数量"
                        v-model="item.number">
                        <template slot="append">kg</template>
                      </el-input>
                    </div>
                  </div>
                </div>
                <div class="opr hoverBlue">添加</div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">调取总价</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="调取总价"
                      disabled
                      v-model="totalStockPrice">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">调取总数</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="调取总数"
                      disabled
                      v-model="totalStockNumber">
                      <template slot="append">kg</template>
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">备注信息</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="备注信息"
                      v-model="materialStockInfo.desc">
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeStock">取消</span>
          <span class="btn backHoverBlue"
            @click="goCheckRealStock"
            v-if="step===1">填写实际调取值</span>
          <span class="btn backHoverOrange"
            @click="step=1"
            v-if="step===2">上一步</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialStock"
            v-if="step===2">确认调取</span>
        </div>
      </div>
    </div>
    <!-- 物料加工 -->
    <div class="popup"
      v-show="materialProcessFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">物料加工</span>
          <div class="closeCtn"
            @click="closeProcess">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn"
            v-for="(item,index) in materialProcessInfo"
            :key="index">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">加工单位</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-cascader placeholder="请选择加工单位"
                    v-model="item.client_id_arr"
                    :options="prcessClientList"></el-cascader>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">加工工序</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="item.process"
                    placeholder="选择加工工序"
                    @change="getProcess">
                    <el-option v-for="item in yarnProcessList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween">
                  <div class="once">
                    <span class="text">下单日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="once">
                    <span class="text">交货日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-date-picker style="width:100%"
                    class="once"
                    placeholder="下单日期"
                    value-format="yyyy-MM-dd"
                    v-model="item.order_time"></el-date-picker>
                  <el-date-picker style="width:100%"
                    class="once"
                    placeholder="交货日期"
                    value-format="yyyy-MM-dd"
                    v-model="item.delivery_time"></el-date-picker>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemMat,indexMat) in item.info_data"
              :key="'mat' + indexMat">
              <div class="col">
                <div class="label"
                  v-if="indexMat===0">
                  <span class="text">物料信息</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select v-if="materialProcessFlag==='订购加工'"
                    placeholder="请选择订购物料"
                    v-model="itemMat.material_order_info_id">
                    <el-option v-for="item in checkMaterialProcessList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.material_name + '/' + item.material_color + '/' + item.attribute"></el-option>
                  </el-select>
                  <el-select v-if="materialProcessFlag==='调取加工'"
                    placeholder="请选择调取物料"
                    v-model="itemMat.material_transfer_info_id">
                    <el-option v-for="item in checkMaterialStockList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.material_name + '/' + item.material_color + '/' + item.attribute"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <template v-if="!item.process">
                    <div class="once">
                      <span class="text">加工详情</span>
                      <span class="explanation">(请先选择加工工序)</span>
                    </div>
                  </template>
                  <template v-if="item.process==='染色'">
                    <div class="once">
                      <span class="text">加工前</span>
                      <span class="explanation">(默认)</span>
                    </div>
                    <div class="once">
                      <span class="text">加工后</span>
                      <span class="explanation">(必选)</span>
                    </div>
                  </template>
                  <template v-if="item.process==='倒纱'">
                    <div class="once">
                      <span class="text">加工前</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="once">
                      <span class="text">加工后</span>
                      <span class="explanation">(必选)</span>
                    </div>
                  </template>
                  <template v-if="item.process==='膨纱'">
                    <div class="once">
                      <span class="text">膨纱要求</span>
                    </div>
                  </template>
                  <template v-if="item.process==='并线'">
                    <div class="once">
                      <span class="text">并线描述</span>
                    </div>
                  </template>
                  <template v-if="item.process==='切割'">
                    <div class="once">
                      <span class="text">切割描述</span>
                    </div>
                  </template>
                </div>
                <div class="info elCtn spaceBetween">
                  <template v-if="!item.process">
                    <el-input v-model="item.process"
                      disabled
                      placeholder="请先选择加工工序"></el-input>
                  </template>
                  <template v-if="item.process==='染色'">
                    <el-input class="once"
                      placeholder="白胚"
                      disabled>
                    </el-input>
                    <el-autocomplete class="once"
                      v-model="itemMat.after_color"
                      :fetch-suggestions="searchColor"
                      placeholder="物料颜色"></el-autocomplete>
                  </template>
                  <template v-if="item.process==='倒纱'">
                    <el-select class="once"
                      placeholder="选择属性"
                      v-model="itemMat.before_attribute"
                      filterable>
                      <el-option v-for="item in yarnAttributeList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"></el-option>
                    </el-select>
                    <el-select class="once"
                      placeholder="选择属性"
                      v-model="itemMat.after_attribute"
                      filterable>
                      <el-option v-for="item in yarnAttributeList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"></el-option>
                    </el-select>
                  </template>
                  <template v-if="item.process==='膨纱'">
                    <el-input class="once"
                      placeholder="请输入膨纱要求"
                      v-model="itemMat.pengsha_desc">
                    </el-input>
                  </template>
                  <template v-if="item.process==='并线'">
                    <el-input class="once"
                      placeholder="请输入并线描述"
                      v-model="itemMat.bingxian_desc">
                    </el-input>
                  </template>
                  <template v-if="item.process==='切割'">
                    <el-input class="once"
                      placeholder="请输入切割描述"
                      v-model="itemMat.qiege_desc">
                    </el-input>
                  </template>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">加工单价</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="once">
                    <span class="text">加工数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once"
                    placeholder="单价"
                    v-model="itemMat.price">
                    <template slot="append">元</template>
                  </el-input>
                  <el-input class="once"
                    placeholder="数量"
                    v-model="itemMat.number">
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexMat===0"
                @click="$addItem(item.info_data,{
                  material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
                  material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
                  before_attribute: '', // 原属性
                  after_attribute: '',
                  before_color: null,
                  after_color: '', // 加工后颜色
                  price: '',
                  number: '',
                  unit: 'kg',
                  pengsha_desc: '', // 膨纱要求
                  qiege_desc: '', // 切割要求
                  bingxian_desc: '' // 并线要求
                })">添加</div>
              <div class="opr hoverRed"
                v-if="indexMat>0"
                @click="$deleteItem(item.info_data,indexMat)">删除</div>
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
                  <span class="text">订购备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入订购备注信息"
                    v-model="item.desc"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">订购总价</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="自动计算"
                    v-model="totalProcessPriceList[index]"
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
                    v-model="totalProcessNumberList[index]"
                    disabled>
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="btn backHoverBlue"
            style="margin-bottom:16px">添加加工单位</div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeProcess">取消</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialProcess">确认</span>
        </div>
      </div>
    </div>
    <!-- 物料订购单修改 -->
    <div class="popup"
      v-show="materialOrderUpdataFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">修改物料订购单</span>
          <div class="closeCtn"
            @click="materialOrderUpdataFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="description">订购单只能修改原有的单价和数量信息,选错单位或订错原料请删除订购单后重新下单</div>
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">订购单位</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="materialOrderUpdataInfo.client_name"
                    disabled></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">订购时间</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    placeholder="请选择时间"
                    value-format="yyyy-MM-dd"
                    v-model="materialOrderUpdataInfo.order_time"></el-date-picker>
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
                    v-model="materialOrderUpdataInfo.delivery_time"></el-date-picker>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemMat,indexMat) in materialOrderUpdataInfo.info_data"
              :key="'mat' + indexMat">
              <div class="col">
                <div class="label"
                  v-if="indexMat===0">
                  <span class="text">物料名称</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请选择物料名称"
                    v-model="itemMat.material_name"
                    disabled>
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">订购属性</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="once">
                    <span class="text">订购颜色</span>
                    <span class="explanation">(默认)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-select class="once"
                    placeholder="属性"
                    v-model="itemMat.attribute"
                    disabled>
                    <el-option v-for="item in yarnAttributeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                  <template>
                    <el-input class="once"
                      placeholder="白胚"
                      disabled
                      v-if="itemMat.material_color==='白胚'"></el-input>
                    <el-select v-else
                      class="once"
                      placeholder="颜色"
                      v-model="itemMat.material_color"
                      disabled>
                      <el-option v-for="item in yarnColorList"
                        :key="item.name"
                        :value="item.name"
                        :label="item.name"></el-option>
                    </el-select>
                  </template>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">订购单价</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="once">
                    <span class="text">订购数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once"
                    placeholder="单价"
                    v-model="itemMat.price">
                    <template slot="append">元</template>
                  </el-input>
                  <el-input class="once"
                    placeholder="数量"
                    v-model="itemMat.number">
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemOther,indexOther) in materialOrderUpdataInfo.others_fee_data"
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
                @click="$addItem(materialOrderUpdataInfo.others_fee_data,{
                  desc: '',
                  name: '',
                  price: ''
                })">添加</div>
              <div class="opr hoverRed"
                v-if="indexOther>0"
                @click="$deleteItem(materialOrderUpdataInfo.others_fee_data,indexOther)">删除</div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">订购备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入订购备注信息"
                    v-model="materialOrderUpdataInfo.desc"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">订购总价</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="自动计算"
                    v-model="totalOrderPrice"
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
                    v-model="totalOrderNumber"
                    disabled>
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="materialOrderUpdataFlag = false">取消</span>
          <span class="btn backHoverOrange"
            @click="updataMaterialOrder">确认修改</span>
        </div>
      </div>
    </div>
    <!-- 物料加工单修改 -->
    <div class="popup"
      v-show="materialProcessUpdataFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">修改物料加工单</span>
          <div class="closeCtn"
            @click="materialProcessUpdataFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="description">加工单不能修改加工单位,加工工序以及需要加工的物料名称</div>
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">加工单位</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请选择加工单位"
                    v-model="materialProcessUpdataInfo.client_name"
                    disabled></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">加工工序</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="materialProcessUpdataInfo.process"
                    placeholder="选择加工工序">
                    <el-option v-for="item in yarnProcessList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween">
                  <div class="once">
                    <span class="text">下单日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="once">
                    <span class="text">交货日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-date-picker style="width:100%"
                    class="once"
                    placeholder="下单日期"
                    value-format="yyyy-MM-dd"
                    v-model="materialProcessUpdataInfo.order_time"></el-date-picker>
                  <el-date-picker style="width:100%"
                    class="once"
                    placeholder="交货日期"
                    value-format="yyyy-MM-dd"
                    v-model="materialProcessUpdataInfo.delivery_time"></el-date-picker>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemMat,indexMat) in materialProcessUpdataInfo.info_data"
              :key="'mat' + indexMat">
              <div class="col">
                <div class="label"
                  v-if="indexMat===0">
                  <span class="text">物料名称</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请选择订购物料"
                    v-model="itemMat.material_order_name"
                    disabled>
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <template v-if="!materialProcessUpdataInfo.process">
                    <div class="once">
                      <span class="text">加工详情</span>
                      <span class="explanation">(请先选择加工工序)</span>
                    </div>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='染色'">
                    <div class="once">
                      <span class="text">加工前</span>
                      <span class="explanation">(默认)</span>
                    </div>
                    <div class="once">
                      <span class="text">加工后</span>
                      <span class="explanation">(必选)</span>
                    </div>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='倒纱'">
                    <div class="once">
                      <span class="text">加工前</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="once">
                      <span class="text">加工后</span>
                      <span class="explanation">(必选)</span>
                    </div>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='膨纱'">
                    <div class="once">
                      <span class="text">膨纱要求</span>
                    </div>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='并线'">
                    <div class="once">
                      <span class="text">并线描述</span>
                    </div>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='切割'">
                    <div class="once">
                      <span class="text">切割描述</span>
                    </div>
                  </template>
                </div>
                <div class="info elCtn spaceBetween">
                  <template v-if="!materialProcessUpdataInfo.process">
                    <el-input v-model="materialProcessUpdataInfo.process"
                      disabled
                      placeholder="请先选择加工工序"></el-input>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='染色'">
                    <el-input class="once"
                      placeholder="白胚"
                      disabled>
                    </el-input>
                    <el-autocomplete class="once"
                      v-model="itemMat.after_color"
                      :fetch-suggestions="searchColor"
                      placeholder="物料颜色"></el-autocomplete>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='倒纱'">
                    <el-select class="once"
                      placeholder="选择属性"
                      v-model="itemMat.before_attribute"
                      filterable>
                      <el-option v-for="item in yarnAttributeList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"></el-option>
                    </el-select>
                    <el-select class="once"
                      placeholder="选择属性"
                      v-model="itemMat.after_attribute"
                      filterable>
                      <el-option v-for="item in yarnAttributeList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"></el-option>
                    </el-select>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='膨纱'">
                    <el-input class="once"
                      placeholder="请输入膨纱要求"
                      v-model="itemMat.pengsha_desc">
                    </el-input>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='并线'">
                    <el-input class="once"
                      placeholder="请输入并线描述"
                      v-model="itemMat.bingxian_desc">
                    </el-input>
                  </template>
                  <template v-if="materialProcessUpdataInfo.process==='切割'">
                    <el-input class="once"
                      placeholder="请输入切割描述"
                      v-model="itemMat.qiege_desc">
                    </el-input>
                  </template>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexMat===0">
                  <div class="once">
                    <span class="text">加工单价</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="once">
                    <span class="text">加工数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once"
                    placeholder="单价"
                    v-model="itemMat.price">
                    <template slot="append">元</template>
                  </el-input>
                  <el-input class="once"
                    placeholder="数量"
                    v-model="itemMat.number">
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(itemOther,indexOther) in materialProcessUpdataInfo.others_fee_data"
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
                @click="$addItem(materialProcessUpdataInfo.others_fee_data,{
                  desc: '',
                  name: '',
                  price: ''
                })">添加</div>
              <div class="opr hoverRed"
                v-if="indexOther>0"
                @click="$deleteItem(materialProcessUpdataInfo.others_fee_data,indexOther)">删除</div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">订购备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入订购备注信息"
                    v-model="materialProcessUpdataInfo.desc"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">订购总价</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="自动计算"
                    v-model="totalProcessPrice"
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
                    v-model="totalProcessNumber"
                    disabled>
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="materialProcessUpdataFlag = false">取消</span>
          <span class="btn backHoverOrange"
            @click="updataMaterialProcess">确认修改</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MaterialOrderInfo, MaterialListInfo } from '@/types/materialOrder'
import { MaterialProcessInfo } from '@/types/materialProcess'
import { MaterialPlanInfo, MaterialPlanGatherData } from '@/types/materialPlan'
import { materialPlan, materialOrder, materialProcess, store, materialStock } from '@/assets/js/api'
import { CascaderInfo } from '@/types/vuex'
import { yarnAttributeArr, yarnProcessArr } from '@/assets/js/dictionary'
import { MaterialStockInfo } from '@/types/materialStock'
export default Vue.extend({
  data(): {
    materialPlanInfo: MaterialPlanInfo
    materialOrderInfo: MaterialOrderInfo[]
    materialOrderUpdataInfo: MaterialOrderInfo
    materialProcessInfo: MaterialProcessInfo[]
    materialProcessUpdataInfo: MaterialProcessInfo
    materialProcessList: MaterialProcessInfo[]
    materialOrderList: MaterialOrderInfo[]
    materialStockInfo: MaterialStockInfo
    materialStockLog: MaterialStockInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      materialOrderFlag: false,
      materialStockFlag: false,
      step: 1,
      materialProcessFlag: false,
      checkAllPlanFlag: false,
      checkAllOrderFlag: false,
      checkAllStockFlag: false,
      materialOrderUpdataFlag: false,
      materialProcessUpdataFlag: false,
      searchLoading: false,
      storeList: [],
      materialPlanInfo: {
        order_id: '',
        type: '1', // 1、按颜色尺码 2.按产品
        desc: '',
        is_draft: 2,
        production_plan_data: [],
        material_plan_data: [],
        material_plan_gather_data: []
      },
      searchPage: 1,
      searchTotal: 1,
      materialOrderInfo: [
        {
          material_type: 1,
          order_id: '',
          plan_id: '',
          client_id: '',
          client_id_arr: [],
          order_time: this.$getDate(new Date()),
          delivery_time: '',
          others_fee_data: [
            {
              desc: '', // 额外费用备注
              name: '',
              price: ''
            }
          ],
          desc: '',
          info_data: [
            {
              material_id: '',
              material_name: '',
              material_color: '',
              attribute: '',
              price: '',
              number: '',
              unit: 'kg'
            }
          ]
        }
      ],
      materialOrderUpdataInfo: {
        material_type: 1,
        order_id: '',
        plan_id: '',
        client_id: '',
        client_id_arr: [],
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        others_fee_data: [
          {
            desc: '', // 额外费用备注
            name: '',
            price: ''
          }
        ],
        desc: '',
        info_data: [
          {
            material_id: '',
            material_name: '',
            material_color: '',
            attribute: '',
            price: '',
            number: '',
            unit: 'kg'
          }
        ]
      },
      materialOrderList: [],
      materialStockFilter: {
        material_id: '',
        material_name: '',
        store_id_arr: [],
        store_id: '',
        second_store_id: '',
        vat_code: '',
        batch_code: '',
        color_code: '',
        material_color: ''
      },
      materialStockInfo: {
        action_type: 10, // 仓库出库绑定订单
        rel_doc_type: '',
        rel_doc_id: '',
        rel_doc_code: '',
        complete_time: this.$getDate(new Date()),
        client_id: '',
        desc: '',
        store_id: '',
        secondary_store_id: '',
        info_data: [
          {
            material_id: '',
            material_color: '',
            color_code: '',
            batch_code: '',
            vat_code: '',
            attribute: '',
            number: '',
            item: '', // 件数
            rel_doc_info_id: '' // 采购单调取单加工单子项id
          }
        ],
        selectList: []
      },
      materialStockArr: [],
      materialStockCheckList: [],
      materialStockLog: [],
      materialProcessInfo: [
        {
          order_id: '',
          plan_id: '',
          process: '',
          material_order_id: '',
          material_transfer_id: '',
          client_id: '',
          client_id_arr: [],
          order_time: this.$getDate(new Date()),
          delivery_time: '',
          others_fee_data: [
            {
              desc: '', // 额外费用备注
              name: '',
              price: ''
            }
          ],
          desc: '',
          info_data: [
            {
              material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
              material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
              before_attribute: '', // 原属性
              after_attribute: '',
              after_color: '', // 加工后颜色
              price: '',
              number: '',
              unit: 'kg',
              pengsha_desc: '', // 膨纱要求
              qiege_desc: '', // 切割要求
              bingxian_desc: '' // 并线要求
            }
          ]
        }
      ],
      materialProcessUpdataInfo: {
        order_id: '',
        plan_id: '',
        process: '',
        material_order_id: '',
        material_transfer_id: '',
        client_id: '',
        client_id_arr: [],
        order_time: this.$getDate(new Date()),
        delivery_time: '',
        others_fee_data: [
          {
            desc: '', // 额外费用备注
            name: '',
            price: ''
          }
        ],
        desc: '',
        info_data: [
          {
            material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
            material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
            before_attribute: '', // 原属性
            after_attribute: '',
            after_color: '', // 加工后颜色
            price: '',
            number: '',
            unit: 'kg',
            pengsha_desc: '', // 膨纱要求
            qiege_desc: '', // 切割要求
            bingxian_desc: '' // 并线要求
          }
        ]
      },
      materialProcessList: [],
      materialOrderIndex: '0', // el-tab-pane组件需要字符串
      materialStockIndex: '0',
      yarnAttributeList: yarnAttributeArr,
      yarnProcessList: yarnProcessArr
    }
  },
  methods: {
    // 初始化函数没有拿加工信息，是因为所有采购和加工信息都放在采购单列表里了
    init() {
      this.loading = true
      Promise.all([
        materialPlan.detail({
          id: Number(this.$route.query.id)
        }),
        materialOrder.list({
          plan_id: Number(this.$route.query.id)
        }),
        materialStock.list({
          action_type: 10,
          plan_id: Number(this.$route.query.id)
        })
      ]).then((res) => {
        this.materialPlanInfo = res[0].data.data
        this.materialOrderList = res[1].data.data
        if (this.materialOrderList.length > 0) {
          this.materialOrderIndex = this.materialOrderList[0].id!.toString()
        }
        this.materialStockLog = res[2].data.data
        if (this.materialStockLog.length > 0) {
          this.materialStockIndex = this.materialStockLog[0].id!.toString()
        }
        this.loading = false
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
    // 加工工序优化
    getProcess(ev: string) {
      if (ev === '染色') {
        if (this.materialProcessFlag === '订购加工') {
          this.materialProcessInfo.forEach((item) => {
            item.info_data.forEach((itemChild) => {
              const finded = this.checkMaterialProcessList.find(
                (itemFind) => itemFind.id === itemChild.material_order_info_id
              )
              if (finded) {
                itemChild.after_color = finded.material_color
              }
            })
          })
        } else {
          this.materialProcessInfo.forEach((item) => {
            item.info_data.forEach((itemChild) => {
              const finded = this.checkMaterialStockList.find(
                (itemFind) => itemFind.id === itemChild.material_transfer_info_id
              )
              if (finded) {
                itemChild.after_color = finded.material_color
              }
            })
          })
        }
      }
    },
    goOrderMaterial(type: '白胚' | '色纱') {
      if (this.checkMaterialOrderList.length > 0) {
        this.materialOrderFlag = true
        if (type === '色纱') {
          this.materialOrderInfo[0].info_data = this.checkMaterialOrderList.map((item) => {
            return {
              material_id: item.material_id,
              material_name: '',
              material_color: item.material_color,
              attribute: '',
              price: '',
              number: item.final_number,
              unit: 'kg'
            }
          })
        } else {
          this.materialOrderInfo[0].info_data = []
          this.checkMaterialOrderList.forEach((item) => {
            const finded = this.materialOrderInfo[0].info_data.find(
              (itemFind) => itemFind.material_id === item.material_id
            )
            if (finded) {
              finded!.number = Number(item.final_number) + Number(finded!.number)
            } else {
              this.materialOrderInfo[0].info_data.push({
                material_id: item.material_id,
                material_name: '',
                material_color: '白胚',
                attribute: '',
                price: '',
                number: item.final_number,
                unit: 'kg'
              })
            }
          })
        }
      } else {
        this.$message.error('请在表格中选择需要订购的物料')
      }
    },
    resetOrderMaterial() {
      this.materialOrderInfo = [
        {
          material_type: 1,
          order_id: '',
          plan_id: '',
          client_id: '',
          client_id_arr: [],
          order_time: this.$getDate(new Date()),
          delivery_time: '',
          others_fee_data: [
            {
              desc: '', // 额外费用备注
              name: '',
              price: ''
            }
          ],
          desc: '',
          info_data: [
            {
              material_id: '',
              material_name: '',
              material_color: '',
              attribute: '',
              price: '',
              number: '',
              unit: 'kg'
            }
          ]
        }
      ]
    },
    closeOrder() {
      this.$confirm('关闭页面会导致已填写的数据丢失，且不会保存，是否确认关闭订购页面?', '提示', {
        confirmButtonText: '确认关闭',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.materialOrderFlag = false
          this.resetOrderMaterial()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭'
          })
        })
    },
    getMatOrderCmpData() {
      this.materialOrderInfo.forEach((item) => {
        item.client_id = item.client_id_arr![2]
        item.order_id = this.materialPlanInfo.order_id
        item.plan_id = this.$route.query.id
      })
    },
    saveMaterialOrder() {
      const formCheck = this.materialOrderInfo.some((item) => {
        return this.$formCheck(item, [
          {
            key: 'client_id_arr',
            errMsg: '请选择订购单位',
            regNormal: 'checkArr'
          },
          {
            key: 'delivery_time',
            errMsg: '请选择发货日期'
          } ||
            item.info_data.some((itemChild) => {
              return this.$formCheck(itemChild, [
                {
                  key: 'material_id',
                  errMsg: '请选择物料名称'
                },
                {
                  key: 'attribute',
                  errMsg: '请选择物料属性'
                },
                {
                  key: 'material_color',
                  errMsg: '请选择物料颜色'
                },
                {
                  key: 'price',
                  errMsg: '请输入订购单价'
                },
                {
                  key: 'number',
                  errMsg: '请输入订购数量'
                }
              ])
            })
        ])
      })
      if (!formCheck) {
        this.getMatOrderCmpData()
        this.loading = true
        materialOrder.create({ data: this.materialOrderInfo }).then((res) => {
          if (res.data.status) {
            this.$message.success('物料订购成功')
            this.materialOrderFlag = false
            this.resetOrderMaterial()
            this.init()
          }
        })
      }
    },
    deleteMaterialOrder(id: number) {
      this.$confirm('是否删除该订购单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialOrder.delete({ id }).then((res) => {
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
    updataMaterialOrder() {
      const formCheck = this.$formCheck(this.materialOrderUpdataInfo, [
        {
          key: 'delivery_time',
          errMsg: '请选择发货日期'
        } ||
          this.materialOrderUpdataInfo.info_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
              {
                key: 'price',
                errMsg: '请输入订购单价'
              },
              {
                key: 'number',
                errMsg: '请输入订购数量'
              }
            ])
          })
      ])
      if (!formCheck) {
        this.loading = true
        this.materialOrderUpdataInfo.order_id = this.materialPlanInfo.order_id
        materialOrder.create({ data: [this.materialOrderUpdataInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
            this.materialOrderUpdataFlag = false
            this.init()
          }
        })
      }
    },
    goStockMaterial() {
      if (this.checkMaterialOrderList.length > 0) {
        this.materialStockInfo.info_data = this.checkMaterialOrderList.map((item) => {
          return {
            material_id: '',
            material_color: '',
            color_code: '',
            batch_code: '',
            vat_code: '',
            attribute: '',
            number: item.final_number,
            item: '', // 件数
            rel_doc_info_id: item.id // 采购单调取单加工单子项id
          }
        })
        this.step = 1
        this.materialStockFlag = true
      } else {
        this.$message.error('请在表格中选择需要调取的物料')
      }
    },
    // 填写实际调取值
    goCheckRealStock() {
      if (this.materialStockCheckList.length === 0) {
        this.$message.error('请选择需要调取的物料')
      } else {
        this.materialStockInfo.rel_doc_id = this.$route.query.id
        this.step = 2
      }
    },
    getMatId(id: number, info: any) {
      const finded = this.materialStockCheckList.find((item: any) => item.id === id)
      info.material_id = finded.material_id
      info.materail_name = finded.material_name
      info.material_color = finded.material_color
      info.attribute = finded.attribute
      info.batch_code = finded.batch_code
      info.color_code = finded.color_code
      info.vat_code = finded.vat_code
    },
    resetStockMaterial() {
      this.materialStockFilter = {
        material_id: '',
        material_name: '',
        store_id_arr: [],
        store_id: '',
        second_store_id: '',
        vat_code: '',
        batch_code: '',
        color_code: '',
        material_color: ''
      }
    },
    searchMaterial() {
      store
        .searchMat({
          material_id: '',
          store_id: this.materialStockFilter.store_id_arr.length > 0 ? this.materialStockFilter.store_id_arr[0] : '',
          secondary_id:
            this.materialStockFilter.store_id_arr.length > 0 ? this.materialStockFilter.store_id_arr[1] : '',
          keyword: '',
          material_name: this.materialStockFilter.material_name,
          material_color: this.materialStockFilter.material_color,
          vat_code: this.materialStockFilter.vat_code,
          color_code: this.materialStockFilter.color_code,
          batch_code: this.materialStockFilter.batch_code
        })
        .then((res) => {
          if (res.data.status) {
            this.materialStockArr = res.data.data
            this.searchTotal = this.materialStockArr.length
          }
        })
    },
    checkMaterialStock(ev: boolean, info: any) {
      if (ev) {
        if (this.materialStockCheckList.find((item: any) => item.id === info.id)) {
          this.$message.error('请不要重复选择物料')
        } else if (
          this.materialStockCheckList.length > 0 &&
          this.materialStockCheckList.find(
            (item: any) => item.store_id !== info.store_id || item.secondary_store_id !== info.secondary_store_id
          )
        ) {
          this.$message.error('只能选择同一仓库的物料进行调取，如有需要请分两次调取')
        } else {
          this.materialStockCheckList.push(info)
          this.materialStockInfo.store_id = this.materialStockCheckList[0].store_id
          this.materialStockInfo.secondary_store_id = this.materialStockCheckList[0].secondary_store_id
          this.$message.success('选取成功')
        }
      } else {
        let deleteIndex = null
        this.materialStockCheckList.find((item: any, index: number) => {
          return item.id === info.id && (deleteIndex = index)
        })
        this.$deleteItem(this.materialStockCheckList, deleteIndex)
      }
    },
    closeStock() {
      this.$confirm('关闭页面会导致已填写的数据丢失，且不会保存，是否确认关闭订购页面?', '提示', {
        confirmButtonText: '确认关闭',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.materialStockFlag = false
          this.resetStockMaterial()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭'
          })
        })
    },
    saveMaterialStock() {
      const formCheck = this.materialStockInfo.info_data.some((item) => {
        return this.$formCheck(item, [
          {
            key: 'tree_data',
            errMsg: '请选择库存数据'
          },
          {
            key: 'rel_doc_info_id',
            errMsg: '请选择单价信息'
          },
          {
            key: 'number',
            errMsg: '请输入调取数量'
          }
        ])
      })
      if (!formCheck) {
        materialStock.create(this.materialStockInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('调取成功')
            this.step = 1
            this.materialStockFlag = false
            this.init()
          }
        })
      }
    },
    deleteMaterialStock(id: number) {
      this.$confirm('是否删除该调取单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialStock.delete({ id }).then((res) => {
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
    goProcessMaterial(type: '订购加工' | '调取加工') {
      if (type === '订购加工') {
        if (this.checkMaterialProcessList.length > 0) {
          this.materialProcessFlag = type
          this.materialProcessInfo[0].info_data = this.checkMaterialProcessList.map((item) => {
            return {
              material_order_info_id: item.id, // 采购单子项id 可以通过这个查询到原纱线id，颜色id
              material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
              before_attribute: item.attribute, // 原属性
              after_attribute: '',
              before_color: null,
              after_color: '', // 加工后颜色
              price: '',
              number: item.number,
              unit: 'kg',
              pengsha_desc: '', // 膨纱要求
              qiege_desc: '', // 切割要求
              bingxian_desc: '' // 并线要求
            }
          })
        } else {
          this.$message.error('请在表格中选择需要加工的物料')
        }
      } else {
        if (this.checkMaterialStockList.length > 0) {
          this.materialProcessFlag = type
          this.materialProcessInfo[0].info_data = this.checkMaterialStockList.map((item) => {
            return {
              material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
              material_transfer_info_id: item.id, // 调取单子项id 可以通过这个查询到原纱线id，颜色id
              before_attribute: item.attribute, // 原属性
              after_attribute: '',
              before_color: null,
              after_color: '', // 加工后颜色
              price: '',
              number: item.number,
              unit: 'kg',
              pengsha_desc: '', // 膨纱要求
              qiege_desc: '', // 切割要求
              bingxian_desc: '' // 并线要求
            }
          })
        } else {
          this.$message.error('请在表格中选择需要加工的物料')
        }
      }
    },
    resetProcessMaterial() {
      this.materialProcessInfo = [
        {
          order_id: '',
          plan_id: '',
          process: '',
          material_order_id: '',
          material_transfer_id: '',
          client_id: '',
          client_id_arr: [],
          order_time: this.$getDate(new Date()),
          delivery_time: '',
          others_fee_data: [
            {
              desc: '', // 额外费用备注
              name: '',
              price: ''
            }
          ],
          desc: '',
          info_data: [
            {
              material_order_info_id: '', // 采购单子项id 可以通过这个查询到原纱线id，颜色id
              material_transfer_info_id: '', // 调取单子项id 可以通过这个查询到原纱线id，颜色id
              before_attribute: '', // 原属性
              after_attribute: '',
              after_color: '', // 加工后颜色
              price: '',
              number: '',
              unit: 'kg',
              pengsha_desc: '', // 膨纱要求
              qiege_desc: '', // 切割要求
              bingxian_desc: '' // 并线要求
            }
          ]
        }
      ]
    },
    closeProcess() {
      this.$confirm('关闭页面会导致已填写的数据丢失，且不会保存，是否确认关闭订购页面?', '提示', {
        confirmButtonText: '确认关闭',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.materialProcessFlag = false
          this.resetProcessMaterial()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭'
          })
        })
    },
    getMatProcessCmpData() {
      this.materialProcessInfo.forEach((item) => {
        item.client_id = item.client_id_arr![2]
        item.order_id = this.materialPlanInfo.order_id
        item.plan_id = this.$route.query.id
        item.material_order_id = this.materialProcessFlag === '订购加工' ? this.materialOrderIndex : ''
        item.material_transfer_id = this.materialProcessFlag === '调取加工' ? this.materialStockIndex : ''
      })
    },
    saveMaterialProcess() {
      const formCheck = this.materialProcessInfo.some((item) => {
        return (
          this.$formCheck(item, [
            {
              key: 'client_id_arr',
              errMsg: '请选择订购单位',
              regNormal: 'checkArr'
            },
            {
              key: 'process',
              errMsg: '请选择工序'
            },
            {
              key: 'delivery_time',
              errMsg: '请选择发货日期'
            }
          ]) ||
          item.info_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
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
      if (!formCheck) {
        this.getMatProcessCmpData()
        materialProcess.create({ data: this.materialProcessInfo }).then((res) => {
          if (res.data.status) {
            this.$message.success('加工单添加成功')
            this.materialProcessFlag = false
            this.resetProcessMaterial()
            this.init()
          }
        })
      }
    },
    updataMaterialProcess() {
      const formCheck = this.materialProcessUpdataInfo.info_data.some((itemChild) => {
        return this.$formCheck(itemChild, [
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
      if (!formCheck) {
        this.materialProcessUpdataInfo.order_id = this.materialPlanInfo.order_id
        materialProcess.create({ data: [this.materialProcessUpdataInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
            this.materialProcessUpdataFlag = false
            this.init()
          }
        })
      }
    },
    deleteMaterialProcess(id: number) {
      this.$confirm('是否删除该加工单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialProcess.delete({ id }).then((res) => {
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
    }
  },
  watch: {
    checkAllPlanFlag(val: boolean) {
      this.planMaterialList.forEach((item) => (item.check = val))
    },
    checkAllOrderFlag(val: boolean) {
      const nowOrder = this.materialOrderList.find((item) => item.id!.toString() === this.materialOrderIndex)
      nowOrder!.info_data.forEach((item) => (item.check = val))
    },
    checkAllStockFlag(val: boolean) {
      const nowStock = this.materialStockLog.find((item) => item.id!.toString() === this.materialStockIndex)
      nowStock!.info_data.forEach((item) => (item.check = val))
    }
  },
  computed: {
    materialStockList(): any[] {
      return this.materialStockArr.slice((this.searchPage - 1) * 5, this.searchPage * 5)
    },
    planMaterialList(): MaterialPlanGatherData[] {
      return this.materialPlanInfo.material_plan_gather_data.filter((item) => item.material_type === 1)
    },
    checkMaterialOrderList(): MaterialPlanGatherData[] {
      // 这里加入checkAllPlanFlag的打印是因为全选之后这里的computed不触发更新
      console.log(this.checkAllPlanFlag)
      return this.planMaterialList.filter((item) => item.check)
    },
    selectMaterialOrderList(): any[] {
      return this.$mergeData(this.checkMaterialOrderList, {
        mainRule: ['material_id'],
        otherRule: [{ name: 'material_name' }]
      })
    },
    checkMaterialProcessList(): MaterialListInfo[] {
      console.log(this.checkAllOrderFlag)
      const nowOrder = this.materialOrderList.find((item) => item.id!.toString() === this.materialOrderIndex)
      return nowOrder ? nowOrder!.info_data.filter((item) => item.check) : []
    },
    checkMaterialStockList(): any[] {
      console.log(this.checkAllStockFlag)
      const nowStock = this.materialStockLog.find((item) => item.id!.toString() === this.materialStockIndex)
      return nowStock ? nowStock!.info_data.filter((item) => item.check) : []
    },
    orderClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '纱线原料单位')
    },
    prcessClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '原料加工单位')
    },
    yarnColorList() {
      return this.$store.state.api.yarnColor.arr.map((item: { name: any }) => {
        return {
          value: item.name,
          label: item.name
        }
      })
    },
    totalOrderNumberList(): number[] {
      return this.materialOrderInfo.map((item) => {
        return item.info_data.reduce((total, current) => {
          return total + Number(current.number)
        }, 0)
      })
    },
    totalOrderPriceList(): string[] {
      return this.materialOrderInfo.map((item) => {
        return (
          item.info_data.reduce((total, current) => {
            return total + Number(current.number) * Number(current.price)
          }, 0) +
          item.others_fee_data.reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        ).toFixed(2)
      })
    },
    totalOrderNumber(): number {
      return this.materialOrderUpdataInfo.info_data.reduce((total, current) => {
        return total + Number(current.number)
      }, 0)
    },
    totalOrderPrice(): string {
      return (
        this.materialOrderUpdataInfo.info_data.reduce((total, current) => {
          return total + Number(current.number) * Number(current.price)
        }, 0) +
        this.materialOrderUpdataInfo.others_fee_data.reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
      ).toFixed(2)
    },
    totalProcessNumberList(): number[] {
      return this.materialProcessInfo.map((item) => {
        return item.info_data.reduce((total, current) => {
          return total + Number(current.number)
        }, 0)
      })
    },
    totalProcessPriceList(): string[] {
      return this.materialProcessInfo.map((item) => {
        return (
          item.info_data.reduce((total, current) => {
            return total + Number(current.number) * Number(current.price)
          }, 0) +
          item.others_fee_data.reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        ).toFixed(2)
      })
    },
    totalProcessNumber(): number {
      return this.materialProcessUpdataInfo.info_data.reduce((total, current) => {
        return total + Number(current.number)
      }, 0)
    },
    totalProcessPrice(): string {
      return (
        this.materialProcessUpdataInfo.info_data.reduce((total, current) => {
          return total + Number(current.number) * Number(current.price)
        }, 0) +
        this.materialProcessUpdataInfo.others_fee_data.reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
      ).toFixed(2)
    },
    totalStockNumber(): number {
      return this.materialStockInfo.info_data.reduce((total, current) => {
        return total + Number(current.number)
      }, 0)
    },
    totalStockPrice(): string {
      return this.materialStockInfo.info_data
        .reduce((total, current) => {
          return total + Number(current.number) * Number(current.price)
        }, 0)
        .toFixed(2)
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/yarnColor',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnColorAsync'
      }
    ])
    store.list().then((res) => {
      if (res.data.status) {
        this.storeList = res.data.data.map((item: any) => {
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
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialManage/detail.less';
</style>
<style lang="less">
#materialManageDetail {
  .el-tabs__content {
    padding: 0;
  }
}
</style>