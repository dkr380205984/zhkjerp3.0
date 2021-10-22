<template>
  <div class="bodyContainer"
    id="materialManageDetail"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">订单组件</div>
      </div>
    </div>
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">物料信息合计</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">单据编号：</div>
            <div class="text">ABCDE</div>
          </div>
          <div class="col">
            <div class="label">单据编号：</div>
            <div class="text">ABCDE</div>
          </div>
          <div class="col">
            <div class="label">单据编号：</div>
            <div class="text">ABCDE</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">单据编号：</div>
            <div class="text">ABCDE</div>
          </div>
          <div class="col">
            <div class="label">单据编号：</div>
            <div class="text">ABCDE</div>
          </div>
          <div class="col">
            <div class="label">单据编号：</div>
            <div class="text">ABCDE</div>
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
              <i class="iconfont">&#xe63b;</i>
              <span class="text">订购色纱</span>
            </div>
            <div class="btn backHoverBlue"
              @click="goOrderMaterial('白胚')">
              <i class="iconfont">&#xe63b;</i>
              <span class="text">订购白胚</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
                  @click="goProcessMaterial">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">物料加工</span>
                </div>
                <div class="btn backHoverOrange">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">单据修改</span>
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
              </div>
            </div>
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
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
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
                    <el-select v-else
                      class="once"
                      placeholder="颜色"
                      v-model="itemMat.material_color">
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
              <div class="opr hoverBlue"
                v-if="indexMat===0"
                @click="$addItem(item.info_data,{
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
            style="margin-bottom:16px">添加订购单位</div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeOrder">取消</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialOrder">确认</span>
        </div>
      </div>
    </div>
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
                  <el-select placeholder="请选择订购物料"
                    v-model="itemMat.material_order_info_id">
                    <el-option v-for="item in checkMaterialProcessList"
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
                    <el-select class="once"
                      placeholder="选择颜色"
                      v-model="itemMat.after_color"
                      filterable>
                      <el-option v-for="item in yarnColorList"
                        :key="item.name"
                        :value="item.name"
                        :label="item.name"></el-option>
                    </el-select>
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
import { materialPlan, materialOrder, materialProcess } from '@/assets/js/api'
import { CascaderInfo } from '@/types/vuex'
import { yarnAttributeArr, yarnProcessArr } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    materialPlanInfo: MaterialPlanInfo
    materialOrderInfo: MaterialOrderInfo[]
    materialProcessInfo: MaterialProcessInfo[]
    materialProcessList: MaterialProcessInfo[]
    materialOrderList: MaterialOrderInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      materialOrderFlag: false,
      materialProcessFlag: false,
      checkAllPlanFlag: false,
      checkAllOrderFlag: false,
      materialPlanInfo: {
        order_id: '',
        type: '1', // 1、按颜色尺码 2.按产品
        desc: '',
        is_draft: 2,
        production_plan_data: [],
        material_plan_data: [],
        material_plan_gather_data: []
      },
      materialOrderInfo: [
        {
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
      materialOrderList: [],
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
      materialProcessList: [],
      materialOrderIndex: '0', // el-tab-pane组件需要字符串
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
        })
      ]).then((res) => {
        this.materialPlanInfo = res[0].data.data
        this.materialOrderList = res[1].data.data
        if (this.materialOrderList.length > 0) {
          this.materialOrderIndex = this.materialOrderList[0].id!.toString()
        }
        this.loading = false
      })
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
      this.getMatOrderCmpData()
      materialOrder.create({ data: this.materialOrderInfo }).then((res) => {
        if (res.data.status) {
          this.$message.success('物料订购成功')
          this.materialOrderFlag = false
          this.resetOrderMaterial()
          this.init()
        }
      })
    },
    goProcessMaterial() {
      if (this.checkMaterialProcessList.length > 0) {
        this.materialProcessFlag = true
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
        item.material_order_id = this.materialOrderIndex
      })
    },
    saveMaterialProcess() {
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
  watch: {
    checkAllPlanFlag(val: boolean) {
      this.planMaterialList.forEach((item) => (item.check = val))
    },
    checkAllOrderFlag(val: boolean) {
      const nowOrder = this.materialOrderList.find((item) => item.id!.toString() === this.materialOrderIndex)
      nowOrder!.info_data.forEach((item) => (item.check = val))
    }
  },
  computed: {
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
    orderClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '纱线原料单位')
    },
    prcessClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '原料加工单位')
    },
    yarnColorList(): CascaderInfo[] {
      return this.$store.state.api.yarnColor.arr
    },
    totalOrderNumberList(): number[] {
      return this.materialOrderInfo.map((item) => {
        return item.info_data.reduce((total, current) => {
          return total + Number(current.number)
        }, 0)
      })
    },
    totalOrderPriceList(): number[] {
      return this.materialOrderInfo.map((item) => {
        return (
          item.info_data.reduce((total, current) => {
            return total + Number(current.number) * Number(current.price)
          }, 0) +
          item.others_fee_data.reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        )
      })
    },
    totalProcessNumberList(): number[] {
      return this.materialProcessInfo.map((item) => {
        return item.info_data.reduce((total, current) => {
          return total + Number(current.number)
        }, 0)
      })
    },
    totalProcessPriceList(): number[] {
      return this.materialProcessInfo.map((item) => {
        return (
          item.info_data.reduce((total, current) => {
            return total + Number(current.number) * Number(current.price)
          }, 0) +
          item.others_fee_data.reduce((total, current) => {
            return total + Number(current.price)
          }, 0)
        )
      })
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