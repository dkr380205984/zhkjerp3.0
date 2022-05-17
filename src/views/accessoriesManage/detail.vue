<template>
  <div id="accessoriesManageDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
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
            <div class="checkCtn">
              <el-tooltip class="item"
                effect="dark"
                content="点击查看审核日志"
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
                <div class="label">订购单位：</div>
                <div class="text">{{item.client_name}}</div>
              </div>
              <div class="col">
                <div class="label">下单日期：</div>
                <div class="text">{{item.order_time}}</div>
              </div>
            </div>
            <div class="row">
              <!-- <div class="col">
                <div class="label">订购总数：</div>
                <div class="text">{{item.total_number}}kg</div>
              </div>
              <div class="col">
                <div class="label">订购总额：</div>
                <div class="text">{{item.total_price}}元</div>
              </div> -->
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
                <div class="tcol">辅料名称</div>
                <div class="tcol">物料信息</div>
                <div class="tcol">订购数量</div>
                <div class="tcol">订购单价</div>
                <div class="tcol">订购总价</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.info_data"
                :key="indexChild">
                <div class="tcol">{{itemChild.material_name}}</div>
                <div class="tcol">{{itemChild.attribute}}</div>
                <div class="tcol">{{itemChild.number}}{{itemChild.unit}}</div>
                <div class="tcol">{{itemChild.price}}元</div>
                <div class="tcol">{{$toFixed(itemChild.price*itemChild.number)}}元</div>
              </div>
            </div>
          </div>
          <div class="buttonList">
            <div style="margin-right:12px"
              class="btn backHoverOrange"
              @click="Number($getsessionStorage('has_check'))!==1&&(item.has_invoice===1||item.has_pay===1)?$message.error('单据已结算，无法修改，可联系管理员操作'):materialOrderUpdataInfo=$clone(item);materialOrderUpdataFlag=true">
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 物料订购 -->
    <div class="popup"
      v-show="materialOrderFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">辅料订购</span>
          <div class="closeCtn"
            @click="closeOrder">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <template v-if="step===1">
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
                      v-model="itemMat.material_id"
                      @change="getUnit($event,itemMat)">
                      <el-option v-for="item in decorateMaterialList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexMat===0">
                    <span class="text">物料信息</span>
                    <span class="explanation"></span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="订购颜色、材质、属性或尺寸"
                      v-model="itemMat.attribute">
                    </el-input>
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
                      <template slot="append">{{itemMat.unit}}</template>
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
              style="margin-bottom:16px"
              @click="$addItem(materialOrderInfo,{
              material_type: 2,
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
          </template>
          <template v-if="step===2">
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">入库仓库</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader v-model="materialStockInfo.tree_data"
                      :options="storeList"
                      placeholder="请选择仓库"
                      @change="(ev)=>{materialStockInfo.store_id=ev[0];materialStockInfo.secondary_store_id=ev[1]}"></el-cascader>
                  </div>
                </div>
                <div class="col">
                </div>
                <div class="col">
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in materialStockInfo.info_data"
                :key="index">
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">单据物料</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="单据物料"
                      v-model="item.rel_doc_info_id"
                      @change="getMatId($event,item)">
                      <el-option v-for="item in materialStockInfo.selectList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
                <!-- <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">批号</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="批号"
                          v-model="item.batch_code"></el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">缸号</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="缸号"
                          v-model="item.vat_code"></el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">色号</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="色号"
                          v-model="item.color_code"></el-input>
                      </div>
                    </div>
                  </div>
                </div> -->
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="数量"
                      class="UnitCtn"
                      v-model="item.number">
                      <template slot="append">
                        <el-input v-model="item.unit"
                          placeholder="单位"></el-input>
                      </template>
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">件数</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="数量"
                      v-model="item.item">
                      <template slot="append">件</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="index===0"
                  @click="$addItem(materialStockInfo.info_data,{
                  material_id: '',
                  material_color: '',
                  color_code: '',
                  batch_code: '',
                  vat_code: '',
                  attribute: '',
                  number: '',
                  item: '', // 件数
                  rel_doc_info_id: '' // 采购单调取单加工单子项id
                })">添加</div>
                <div class="opr hoverRed"
                  v-if="index>0"
                  @click="$deleteItem(materialStockInfo.info_data,index)">删除</div>
              </div>
              <div class="row">
                <div class="col"
                  style="max-width:322px">
                  <div class="label">
                    <span class="text">入库日期</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-date-picker style="width:100%"
                      class="once"
                      placeholder="入库日期"
                      value-format="yyyy-MM-dd"
                      v-model="materialStockInfo.complete_time"></el-date-picker>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">备注信息</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="materialStockInfo.desc"
                      placeholder="备注信息"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeOrder">取消</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialOrder(false)"
            v-if="step===1">确认</span>
          <span class="btn backHoverGreen"
            @click="saveMaterialOrder(true)"
            v-if="step===1">订购并入库</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialStock"
            v-if="step===2">确认入库</span>
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
                <div class="label"
                  v-if="indexMat===0">
                  <span class="text">物料信息</span>
                  <span class="explanation"></span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="订购颜色、材质、属性或尺寸"
                    v-model="itemMat.attribute"
                    @focus="$focusInput($event)">
                  </el-input>
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
                    v-model="itemMat.price"
                    @focus="$focusInput($event)">
                    <template slot="append">元</template>
                  </el-input>
                  <el-input class="once"
                    placeholder="数量"
                    v-model="itemMat.number"
                    @focus="$focusInput($event)">
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
                    v-model="itemOther.name"
                    @focus="$focusInput($event)"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">额外费用金额</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入额外费用金额"
                    v-model="itemOther.price"
                    @focus="$focusInput($event)">
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
                    v-model="itemOther.desc"
                    @focus="$focusInput($event)"></el-input>
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
                    v-model="materialOrderUpdataInfo.desc"
                    @focus="$focusInput($event)"></el-input>
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
    <div class="bottomFixBar">
      <div class="main">
        <!-- 报价单表格 -->
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
                      <div class="tcol">{{item.price}}元/{{item.unit==='g'?'kg':item.unit}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn">
          <div class="btn backHoverBlue"
            @click="materialOrderFlag = true">订购辅料</div>
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, materialOrder, materialStock, store, quotedPrice } from '@/assets/js/api'
import { CascaderInfo } from '@/types/vuex'
import { MaterialOrderInfo, MaterialListInfo } from '@/types/materialOrder'
import { yarnAttributeArr, yarnProcessArr } from '@/assets/js/dictionary'
import { MaterialProcessInfo } from '@/types/materialProcess'
import { MaterialStockInfo } from '@/types/materialStock'
import { QuotedPriceInfo } from '@/types/quotedPrice'
export default Vue.extend({
  data(): {
    materialOrderInfo: MaterialOrderInfo[]
    materialOrderList: MaterialOrderInfo[]
    materialOrderUpdataInfo: MaterialOrderInfo
    materialStockInfo: MaterialStockInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      step: 1,
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
      materialOrderFlag: false,
      materialOrderUpdataFlag: false,
      yarnAttributeList: yarnAttributeArr,
      materialOrderInfo: [
        {
          total_number: 0,
          total_price: 0,
          material_type: 2,
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
      materialOrderIndex: '0',
      materialOrderList: [],
      materialOrderUpdataInfo: {
        material_type: 2,
        order_id: '',
        plan_id: '',
        client_id: '',
        client_id_arr: [],
        total_price: 0,
        total_number: 0,
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
      materialStockInfo: {
        material_type: 2,
        action_type: 4, // 采购单最终入库
        rel_doc_type: '',
        rel_doc_id: '',
        rel_doc_code: '',
        complete_time: this.$getDate(new Date()),
        client_id: '',
        desc: '',
        store_id: '',
        secondary_store_id: '',
        tree_data: [], //仓库下拉框
        selectList: [],
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
        ]
      },
      orderIndex: 0,
      storeList: [],
      showPrice: false,
      priceMaterialList: [] // 报价单报价信息
    }
  },
  computed: {
    orderClientList(): CascaderInfo[] {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '装饰辅料单位')
    },
    decorateMaterialList() {
      return this.$store.state.api.decorateMaterial.arr
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
    totalOrderNumber(): number {
      return this.materialOrderUpdataInfo.info_data.reduce((total, current) => {
        return total + Number(current.number)
      }, 0)
    },
    totalOrderPrice(): number {
      return (
        this.materialOrderUpdataInfo.info_data.reduce((total, current) => {
          return total + Number(current.number) * Number(current.price)
        }, 0) +
        this.materialOrderUpdataInfo.others_fee_data.reduce((total, current) => {
          return total + Number(current.price)
        }, 0)
      )
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        materialOrder.list({
          order_id: this.orderInfo.time_data[this.orderIndex].id,
          material_type: 2
        })
      ]).then((res) => {
        this.loading = false
        this.materialOrderList = res[0].data.data
        if (this.materialOrderList.length > 0) {
          this.materialOrderIndex = this.materialOrderList[0].id!.toString()
        }
      })
    },
    getUnit(ev: number, info: any) {
      info.unit = this.decorateMaterialList.find((item: any) => item.id === ev).unit
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
    resetOrderMaterial() {
      this.materialOrderInfo = [
        {
          material_type: 2,
          order_id: '',
          plan_id: '',
          client_id: '',
          client_id_arr: [],
          order_time: this.$getDate(new Date()),
          delivery_time: '',
          total_number: 0,
          total_price: 0,
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
    getMatOrderCmpData() {
      this.materialOrderInfo.forEach((item) => {
        item.client_id = item.client_id_arr![2]
        item.order_id = this.orderInfo.time_data[this.orderIndex].id
      })
    },
    saveMaterialOrder(ifStock: boolean) {
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
            if (ifStock) {
              this.goStock(res.data.data)
            } else {
              this.$message.success('辅料订购成功')
              this.materialOrderFlag = false
              this.resetOrderMaterial()
              this.init()
            }
          }
          this.loading = false
        })
      }
    },
    goStock(materialOrderList: MaterialOrderInfo[]) {
      materialOrderList.forEach((item) => {
        this.materialStockInfo.rel_doc_code = item.code
        this.materialStockInfo.rel_doc_id = item.id as number
        item.info_data.forEach((itemChild) => {
          this.materialStockInfo.selectList!.push({
            value: itemChild.id as number,
            name: itemChild.material_name + '/' + itemChild.attribute,
            material_color: itemChild.material_color,
            material_id: itemChild.material_id,
            attribute: itemChild.attribute,
            number: itemChild.number,
            unit: itemChild.unit
          })
        })
      })
      this.materialStockInfo.info_data = this.materialStockInfo.selectList!.map((item: any) => {
        return {
          material_id: item.material_id,
          material_color: item.material_color,
          color_code: '',
          batch_code: '',
          vat_code: '',
          attribute: item.attribute,
          number: item.number,
          item: '', // 件数
          unit: item.unit,
          rel_doc_info_id: item.value // 采购单调取单加工单子项id
        }
      })
      this.step = 2
      this.materialOrderFlag = true
    },
    saveMaterialStock() {
      const formCheck =
        this.$formCheck(this.materialStockInfo, [
          {
            key: 'tree_data',
            errMsg: '请选择仓库',
            regNormal: 'checkArr'
          }
        ]) ||
        this.materialStockInfo.info_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'rel_doc_info_id',
              errMsg: '请选择单据物料'
            },
            {
              key: 'material_id',
              errMsg: '请选择物料'
            }
          ])
        })
      if (!formCheck) {
        materialStock.create({ data: [this.materialStockInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.step = 1
            this.resetOrderMaterial()
            this.materialOrderFlag = false
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
        this.materialOrderUpdataInfo.order_id = this.$route.query.id as string
        materialOrder.create({ data: [this.materialOrderUpdataInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
            this.materialOrderUpdataFlag = false
            this.init()
          }
        })
      }
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
        checkWhich: 'api/decorateMaterial',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getDecorateMaterialAsync'
      }
    ])
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          this.orderInfo.time_data.forEach((item: any, index: number) => {
            if (item.id === Number(this.$route.query.sampleOrderIndex)) {
              this.orderIndex = index
            }
          })
          this.init()
          this.loading = false
        }
      })
    store
      .list({
        store_type: 4 // 装饰辅料仓库
      })
      .then((res) => {
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
                itemPro.assist_material_data.forEach((itemMat) => {
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
@import '~@/assets/css/accessoriesManage/detail.less';
</style>
<style lang="less">
#accessoriesManageDetail {
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
}
</style>