<template>
  <div id="quotedPriceCreate"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">添加报价单</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">报价单标题</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入报价单标题"
                v-model="quotedPriceInfo.title"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">报价公司</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-cascader placeholder="请选择报价公司"
                v-model="quotedPriceInfo.client_id"
                :options="clientList"
                @change="getContacts">
              </el-cascader>
            </div>
          </div>
          <div class="col">
            <div class="label">公司联系人</div>
            <div class="info elCtn">
              <el-select placeholder="请选择公司联系人"
                v-model="quotedPriceInfo.contacts_id"
                no-data-text="请先选择报价公司">
                <el-option v-for="item in contactsList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">负责小组/人</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择负责小组/人"
                v-model="quotedPriceInfo.group_id">
                <el-option v-for="item in groupList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">结算单位</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择结算单位"
                v-model="quotedPriceInfo.settle_unit">
                <el-option v-for="item in unitArr"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                  class="between">
                  <span>{{item.name}}</span>
                  <span class="gray">({{item.short}})</span>
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">汇率
                <el-tooltip class="item"
                  effect="dark"
                  content="点击查看实时汇率"
                  placement="top-start">
                  <em class="el-icon-question"
                    @click="$openUrl('http://forex.hexun.com/rmbhl/#zkRate')"></em>
                </el-tooltip>
              </span>
              <span class="explanation">(必填,例：100人民币=600美元,填入"600"。)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入汇率"
                v-model="quotedPriceInfo.exchange_rate"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">添加产品描述</div>
      </div>
      <div v-for="(item,index) in quotedPriceInfo.product_data"
        :key="index">
        <div class="lineInfo">
          <div class="text">产品{{index+1}}</div>
          <div class="deleteIcon"
            @click="$deleteItem(quotedPriceInfo.product_data,index)">删除</div>
        </div>
        <div class="editCtn">
          <div class="row">
            <div class="col">
              <div class="label">
                <span class="text">产品品类</span>
                <span class="explanation">(必选)</span>
              </div>
              <div class="info elCtn">
                <el-cascader placeholder="请选择品类"
                  v-model="item.type"
                  :options="productTypeList"></el-cascader>
              </div>
            </div>
            <div class="col">
              <div class="label"> 客户目标价格</div>
              <div class="info elCtn">
                <el-input placeholder="请输入客户目标价格"
                  v-model="item.client_target_price">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </div>
            <div class="col">
              <div class="label">客户最低起订量</div>
              <div class="info elCtn">
                <el-input placeholder="请输入客户最低起订量"
                  v-model="item.start_order_number"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="label">产品描述</div>
              <div class="info elCtn">
                <el-input placeholder="请输入产品描述"
                  v-model="item.desc"></el-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="label">产品图片</div>
              <div class="info">
                <el-upload class="upload"
                  action="https://upload.qiniup.com/"
                  accept="image/jpeg,image/gif,image/png,image/bmp"
                  :before-upload="beforeAvatarUpload"
                  :data="postData"
                  :on-remove="function(file){return removeFile(file, index)}"
                  :on-success="function(response){return successFile(response, index)}"
                  ref="uploada"
                  list-type="picture">
                  <div class="uploadBtn">
                    <i class="el-icon-upload"></i>
                    <span>上传图片</span>
                  </div>
                  <div slot="tip"
                    class="el-upload__tip">只能上传一张jpg/png图片文件，且不超过10M</div>
                </el-upload>
              </div>
            </div>
          </div>
          <div v-if="index===quotedPriceInfo.product_data.length-1"
            class="oprRow">
            <div class="once"
              @click="addPro">新增产品描述
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <el-tabs type="border-card">
        <el-tab-pane :label="'产品'+(index+1)"
          v-for="(item,index) in quotedPriceInfo.product_data"
          :key="index">
          <div class="titleCtn">
            <div class="title">报价信息</div>
          </div>
          <div class="editCtn">
            <div class="row"
              v-for="(itemYarn,indexYarn) in item.material_data"
              :key="'Yarn' + indexYarn">
              <div class="col">
                <div class="label"
                  v-if="indexYarn===0">
                  <span class="text">产品原料</span>
                </div>
                <div class="info elCtn">
                  <div class="info elCtn">
                    <el-cascader placeholder="请选择原料"
                      v-model="itemYarn.material_id"
                      :options="yarnTypeList"
                      clearable></el-cascader>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexYarn===0">
                  <div class="once">预计数量</div>
                  <div class="once">预计损耗</div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once unitAppend"
                    v-model="itemYarn.weight"
                    placeholder="数量"
                    @change="cmpTotalPrice(itemYarn)">
                    <template slot="append">
                      <input class="unit"
                        v-model="itemYarn.unit"
                        placeholder="单位" />
                    </template>
                  </el-input>
                  <el-input class="once"
                    v-model="itemYarn.loss"
                    placeholder="损耗"
                    @change="cmpTotalPrice(itemYarn)">
                    <template slot="append">%</template>
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexYarn===0">
                  <div class="once">单价</div>
                  <div class="once">总价</div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once"
                    v-model="itemYarn.price"
                    placeholder="单价"
                    @change="cmpTotalPrice(itemYarn)">
                    <template slot="append">元/{{itemYarn.unit || '单位'}}</template>
                  </el-input>
                  <el-input class="once"
                    v-model="itemYarn.total_price"
                    placeholder="总价">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexYarn===0"
                @click="$addItem(item.material_data,{
                  material_id: [],
                  weight: '',
                  loss: '',
                  price: '',
                  total_price: '',
                  unit: 'kg'
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="$deleteItem(item.material_data,indexYarn)">删除</div>
            </div>
            <div class="row"
              v-for="(itemDecorateMaterial,indexDecorateMaterial) in item.assist_material_data"
              :key="'DecorateMaterial' + indexDecorateMaterial">
              <div class="col">
                <div class="label"
                  v-if="indexDecorateMaterial===0">
                  <span class="text">装饰辅料</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="itemDecorateMaterial.material_id"
                    @change="getUnit($event,itemDecorateMaterial)"
                    placeholder="请选择装饰辅料"
                    clearable>
                    <el-option v-for="item in decorateMaterialList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexDecorateMaterial===0">
                  <div class="once">预计数量</div>
                  <div class="once">预计损耗</div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once unitAppend"
                    v-model="itemDecorateMaterial.number"
                    placeholder="数量"
                    @change="cmpTotalPrice(itemDecorateMaterial)">
                    <template slot="append">
                      <input class="unit"
                        v-model="itemDecorateMaterial.unit"
                        placeholder="单位" />
                    </template>
                  </el-input>
                  <el-input class="once"
                    v-model="itemDecorateMaterial.loss"
                    placeholder="损耗"
                    @change="cmpTotalPrice(itemDecorateMaterial)">
                    <template slot="append">%</template>
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexDecorateMaterial===0">
                  <div class="once">单价</div>
                  <div class="once">总价</div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once"
                    v-model="itemDecorateMaterial.price"
                    placeholder="单价"
                    @change="cmpTotalPrice(itemDecorateMaterial)">
                    <template slot="append">元/{{itemDecorateMaterial.unit||'单位'}}</template>
                  </el-input>
                  <el-input class="once"
                    v-model="itemDecorateMaterial.total_price"
                    placeholder="总价">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexDecorateMaterial===0"
                @click="$addItem(item.assist_material_data,{
                  material_name: '',
                  number: '',
                  loss: '',
                  price: '',
                  total_price: ''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="$deleteItem(item.assist_material_data,indexDecorateMaterial)">删除</div>
            </div>
            <div class="row"
              v-for="(itemWeave,indexWeave) in item.weave_data"
              :key="'Weave'+indexWeave">
              <div class="col">
                <div class="label"
                  v-if="indexWeave===0">
                  <span class="text">织造明细</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="itemWeave.name"
                    placeholder="请选择织造明细"
                    clearable>
                    <el-option v-for="item in weaveList"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexWeave===0">
                  <span class="text">织造说明</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemWeave.desc"
                    placeholder="织造说明">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexWeave===0">
                  <span class="text">总价</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemWeave.total_price"
                    placeholder="总价">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexWeave===0"
                @click="$addItem(item.weave_data,{
                 number:'',
                 name:'',
                 total_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="$deleteItem(item.weave_data,indexWeave)">删除</div>
            </div>
            <div class="row"
              v-for="(itemHalfProcess,indexHalfProcess) in item.semi_product_data"
              :key="'HalfProcess' + indexHalfProcess">
              <div class="col">
                <div class="label"
                  v-if="indexHalfProcess===0">
                  <span class="text">半成品加工</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="itemHalfProcess.process_id"
                    placeholder="请选择加工工序"
                    clearable>
                    <el-option v-for="item in halfProcessList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexHalfProcess===0">
                  <span class="text">加工说明</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemHalfProcess.desc"
                    placeholder="加工说明">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexHalfProcess===0">
                  <span class="text">总价</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemHalfProcess.total_price"
                    placeholder="总价">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexHalfProcess===0"
                @click="$addItem(item.semi_product_data,{
                 desc:'',
                 name:'',
                 total_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="$deleteItem(item.semi_product_data,indexHalfProcess)">删除</div>
            </div>
            <div class="row"
              v-for="(itemFinishedProcess,indexFinishedProcess) in item.production_data"
              :key="'FinishedProcess' + indexFinishedProcess">
              <div class="col">
                <div class="label"
                  v-if="indexFinishedProcess===0">
                  <span class="text">成品加工</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="itemFinishedProcess.name"
                    placeholder="请选择加工工序"
                    clearable>
                    <el-option v-for="item in finishedList"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexFinishedProcess===0">
                  <span class="text">加工说明</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemFinishedProcess.desc"
                    placeholder="加工说明">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexFinishedProcess===0">
                  <span class="text">总价</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemFinishedProcess.total_price"
                    placeholder="总价">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexFinishedProcess===0"
                @click="$addItem(item.production_data,{
                 desc:'',
                 name:'',
                 total_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="$deleteItem(item.production_data,indexFinishedProcess)">删除</div>
            </div>
            <div class="row"
              v-for="(itemPackMaterial,indexPackMaterial) in item.pack_material_data"
              :key="'PackMaterial' + indexPackMaterial">
              <div class="col">
                <div class="label"
                  v-if="indexPackMaterial===0">
                  <span class="text">包装辅料</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="itemPackMaterial.material_id"
                    placeholder="请选择包装辅料"
                    clearable>
                    <el-option v-for="item in packMaterialList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexPackMaterial===0">
                  <span class="text">辅料说明</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemPackMaterial.desc"
                    placeholder="辅料说明">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexPackMaterial===0">
                  <span class="text">总价</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemPackMaterial.total_price"
                    placeholder="总价">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexPackMaterial===0"
                @click="$addItem(item.pack_material_data,{
                 desc:'',
                 name:'',
                 total_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="$deleteItem(item.pack_material_data,indexPackMaterial)">删除</div>
            </div>
            <div class="row"
              v-for="(itemOther,indexOther) in item.other_fee_data"
              :key="'Other' + indexOther">
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">其他费用</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemOther.name"
                    placeholder="其他费用"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">费用说明</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemOther.desc"
                    placeholder="费用说明">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">总价</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemOther.total_price"
                    placeholder="总价">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexOther===0"
                @click="$addItem(item.other_fee_data,{
                 desc:'',
                 name:'',
                 total_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="$deleteItem(item.other_fee_data,indexOther)">删除</div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">
                  <span class="text">运输费用</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="item.transport_fee"
                    placeholder="运输费用">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="col flex3">
                <div class="label">
                  <span class="text">费用说明</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="item.transport_fee_desc"
                    placeholder="费用说明">
                  </el-input>
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
      <div class="editCtn">
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">报价产品数量</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="quotedPriceInfo.product_data.length"
                disabled
                placeholder="请输入报价产品数量">
                <template slot="append">款</template>
              </el-input>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">产品成本价合计</div>
            <div class="info elCtn">
              <el-input v-model="totalPrice"
                disabled
                placeholder="请输入产品成本价合计">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">客户佣金百分比</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="quotedPriceInfo.commission_percentage"
                placeholder="请输入客户佣金百分比">
                <template slot="append">%</template>
              </el-input>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">佣金费用</div>
            <div class="info elCtn">
              <el-input v-model="commissionPrice"
                placeholder="请输入佣金费用"
                disabled>
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">预计税率</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="quotedPriceInfo.rate_taxation"
                placeholder="请输入预计税率">
                <template slot="append">%</template>
              </el-input>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">税费</div>
            <div class="info elCtn">
              <el-input v-model="ratePrice"
                disabled
                placeholder="请输入税费">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">预计利润百分比</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="quotedPriceInfo.profit_percentage"
                placeholder="请输入预计利润百分比">
                <template slot="append">%</template>
              </el-input>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">利润</div>
            <div class="info elCtn">
              <el-input v-model="profitPrice"
                disabled
                placeholder="请输入利润">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">其它说明与备注</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="quotedPriceInfo.desc"
                placeholder="请输入其它说明与备注">
              </el-input>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">最终客户报价</div>
            <div class="info elCtn">
              <el-input v-model="quotedPriceInfo.real_quote_price"
                placeholder="请输入最终客户报价">
                <template slot="append">元</template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="fl"
          style="line-height:56px">
          合计：<span class="blue">{{realTotalPrice}}元</span>
        </div>
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverOrange"
            @click="saveQuotedPrice(true)">保存为草稿</div>
          <div class="btn backHoverBlue"
            @click="saveQuotedPrice(false)">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { QuotedPriceInfo } from '@/types/quotedPrice'
import { PackMaterialInfo, DecorateMaterialInfo } from '@/types/materialSetting'
import { moneyArr } from '@/assets/js/dictionary'
import { client, quotedPrice } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
    quotedPriceInfo: QuotedPriceInfo
  } {
    return {
      value: '',
      unitArr: moneyArr,
      postData: {
        key: '',
        token: ''
      },

      productIndex: 0, // 目前选中的产品
      quotedPriceInfo: {
        id: null,
        is_draft: 1,
        title: '',
        client_id: [],
        contacts_id: '',
        group_id: '',
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
        product_data: [
          {
            total_price: '',
            product_id: '',
            type: [],
            category_id: '',
            type_id: '',
            image_data: [],
            client_target_price: '',
            start_order_number: '',
            desc: '',
            transport_fee_desc: '',
            transport_fee: '',
            material_data: [
              {
                material_id: [],
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
                material_id: '',
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
                process_id: '',
                process_name: '',
                desc: '',
                total_price: ''
              }
            ],
            production_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            pack_material_data: [
              {
                material_name: '',
                material_id: '',
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
            ]
          }
        ]
      },
      contactsList: [],
      weaveList: [{ value: '针织织造' }, { value: '梭织织造' }, { value: '制版费' }],
      finishedList: [{ value: '车标' }, { value: '包装' }, { value: '人工' }, { value: '检验' }, { value: '水洗' }]
    }
  },
  computed: {
    // 总成本价
    totalPrice(): string {
      return this.quotedPriceInfo.product_data
        .reduce((total, current) => {
          return (
            total +
            Number(current.transport_fee) +
            current.material_data.reduce((totalChild, currentChild) => {
              return totalChild + Number(currentChild.total_price)
            }, 0) +
            current.assist_material_data.reduce((totalChild, currentChild) => {
              return totalChild + Number(currentChild.total_price)
            }, 0) +
            current.weave_data.reduce((totalChild, currentChild) => {
              return totalChild + Number(currentChild.total_price)
            }, 0) +
            current.semi_product_data.reduce((totalChild, currentChild) => {
              return totalChild + Number(currentChild.total_price)
            }, 0) +
            current.production_data.reduce((totalChild, currentChild) => {
              return totalChild + Number(currentChild.total_price)
            }, 0) +
            current.pack_material_data.reduce((totalChild, currentChild) => {
              return totalChild + Number(currentChild.total_price)
            }, 0) +
            current.other_fee_data.reduce((totalChild, currentChild) => {
              return totalChild + Number(currentChild.total_price)
            }, 0)
          )
        }, 0)
        .toFixed(2)
    },
    // 总合计——含各种税 quotedPriceInfo.system_total_price
    realTotalPrice(): string {
      return (
        Number(this.totalPrice) *
        (1 -
          (Number(this.quotedPriceInfo.commission_percentage) / 100 || 0) +
          (Number(this.quotedPriceInfo.profit_percentage) / 100 || 0) +
          Number(this.quotedPriceInfo.rate_taxation) / 100 || 0)
      ).toFixed(2)
    },
    // quotedPriceInfo.commission_price
    commissionPrice(): string {
      return (Number(this.totalPrice) * (Number(this.quotedPriceInfo.commission_percentage) / 100 || 0)).toFixed(2)
    },
    // quotedPriceInfo.profit_price
    profitPrice(): string {
      return (Number(this.totalPrice) * (Number(this.quotedPriceInfo.profit_percentage) / 100 || 0)).toFixed(2)
    },
    // quotedPriceInfo.rate_price
    ratePrice(): string {
      return (Number(this.totalPrice) * (Number(this.quotedPriceInfo.rate_taxation) / 100 || 0)).toFixed(2)
    },
    token() {
      return this.$store.state.status.token
    },
    productTypeList() {
      return this.$store.state.api.productType.arr
    },
    yarnTypeList() {
      return this.$store.state.api.yarnType.arr
    },
    packMaterialList(): PackMaterialInfo[] {
      return this.$store.state.api.packMaterial.arr
    },
    decorateMaterialList(): DecorateMaterialInfo[] {
      return this.$store.state.api.decorateMaterial.arr
    },
    halfProcessList() {
      return this.$store.state.api.halfProcess.arr
    },
    groupList() {
      return this.$store.state.api.group.arr
    },
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    }
  },
  methods: {
    addPro() {
      this.$addItem(this.quotedPriceInfo.product_data, {
        total_price: '',
        product_id: '',
        type: [],
        category_id: '',
        type_id: '',
        image_data: [],
        client_target_price: '',
        start_order_number: '',
        desc: '',
        transport_fee_desc: '',
        transport_fee: '',
        material_data: [
          {
            material_id: [],
            material_name: '',
            weight: '',
            loss: '',
            price: '',
            total_price: '',
            unit: ''
          }
        ],
        assist_material_data: [
          {
            material_id: '',
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
            process_id: '',
            process_name: '',
            desc: '',
            total_price: ''
          }
        ],
        production_data: [
          {
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        pack_material_data: [
          {
            material_id: '',
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
        ]
      })
    },
    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.postData.token = this.token
      this.postData.key = Date.parse(new Date() + '') + '.' + fileFormat
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
    successFile(response: { hash: string; key: string }, index: number) {
      this.quotedPriceInfo.product_data[index].image_data!.push('https://file.zwyknit.com/' + response.key)
    },
    removeFile(file: { response: { hash: string; key: string } }, index: number) {
      this.$deleteItem(
        this.quotedPriceInfo.product_data[index].image_data as string[],
        this.quotedPriceInfo.product_data[index].image_data!.indexOf('https://file.zwyknit.com/' + file.response.key)
      )
    },
    getUnit(ev: string, info: DecorateMaterialInfo) {
      info.unit = this.decorateMaterialList.find((item) => item.id === ev)!.unit
    },
    getContacts(ev: string[]) {
      client
        .detail({
          id: ev[2]
        })
        .then((res) => {
          if (res.data.status) {
            this.quotedPriceInfo.contacts_id = ''
            this.contactsList = res.data.data.contacts_data
          }
        })
    },
    // 辅助计算产品原料和装饰辅料的总价，总价本身可直接修改
    cmpTotalPrice(info: { total_price: number; weight: number; loss: any; price: number; number: number }) {
      info.total_price = this.$toFixed(
        (Number(info.weight || info.number) || 0) * (1 + (Number(info.loss) || 0) / 100) * (Number(info.price) || 0)
      )
    },
    // 把通过计算属性得到的价格以及通过级联选择器选到的id赋给表单数据
    getCmpData() {
      this.quotedPriceInfo.total_number = this.quotedPriceInfo.product_data.length
      this.quotedPriceInfo.commission_price = this.commissionPrice
      this.quotedPriceInfo.rate_price = this.ratePrice
      this.quotedPriceInfo.profit_price = this.profitPrice
      this.quotedPriceInfo.total_cost_price = this.totalPrice
      this.quotedPriceInfo.system_total_price = this.realTotalPrice
      this.quotedPriceInfo.client_id = this.quotedPriceInfo.client_id && (this.quotedPriceInfo.client_id as string[])[2]
      this.quotedPriceInfo.product_data.forEach((item) => {
        item.category_id = item.type && item.type[0]
        item.type_id = item.type && item.type[1]
        item.material_data.forEach((itemChild) => {
          itemChild.material_id = itemChild.material_id && (itemChild.material_id as string[])[2]
        })
        item.total_price =
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
          }, 0)
      })
    },
    saveQuotedPrice(ifCaogao: boolean) {
      this.quotedPriceInfo.is_draft = ifCaogao ? 2 : 1
      if (!ifCaogao) {
        const formCheck =
          this.$formCheck(this.quotedPriceInfo, [
            {
              key: 'title',
              errMsg: '请输入报价单标题'
            },
            {
              key: 'client_id',
              errMsg: '请选择报价公司'
            },
            {
              key: 'group_id',
              errMsg: '请选择负责小组/人'
            },
            {
              key: 'commission_percentage',
              errMsg: '请输入佣金百分比'
            },
            {
              key: 'rate_taxation',
              errMsg: '请输入税率百分比'
            },
            {
              key: 'profit_percentage',
              errMsg: '请输入利润百分比'
            }
          ]) ||
          this.quotedPriceInfo.product_data.some((item) => {
            // 选择已有产品和直接添加产品描述验证不同
            if (item.product_id) {
              this.$message.error('暂时不支持')
              return false
            } else {
              return (
                this.$formCheck(item, [
                  {
                    key: 'transport_fee',
                    errMsg: '请输入运费'
                  },
                  {
                    key: 'type',
                    errMsg: '请选择产品品类'
                  },
                  {
                    key: 'type',
                    errMsg: '请选择产品品类'
                  },
                  {
                    key: 'client_target_price',
                    errMsg: '请输入客户目标价'
                  },
                  {
                    key: 'start_order_number',
                    errMsg: '请输入客户最低起订量'
                  }
                ]) ||
                item.material_data.some((itemChild) => {
                  return (
                    itemChild.material_id &&
                    this.$formCheck(itemChild, [
                      {
                        key: 'material_id',
                        errMsg: '请选择产品原料'
                      },
                      {
                        key: 'weight',
                        errMsg: '请输入产品原料预计数量'
                      },
                      {
                        key: 'unit',
                        errMsg: '请输入产品原料数量单位'
                      },
                      {
                        key: 'loss',
                        errMsg: '请输入产品原料预计损耗'
                      },
                      {
                        key: 'price',
                        errMsg: '请输入产品原料单价'
                      }
                    ])
                  )
                }) ||
                item.assist_material_data.some((itemChild) => {
                  return (
                    itemChild.material_id &&
                    this.$formCheck(itemChild, [
                      {
                        key: 'material_id',
                        errMsg: '请选择装饰辅料'
                      },
                      {
                        key: 'number',
                        errMsg: '请输入装饰辅料预计数量'
                      },
                      {
                        key: 'unit',
                        errMsg: '请输入装饰辅料数量单位'
                      },
                      {
                        key: 'loss',
                        errMsg: '请输入装饰辅料预计损耗'
                      },
                      {
                        key: 'price',
                        errMsg: '请输入装饰辅料单价'
                      }
                    ])
                  )
                }) ||
                item.weave_data.some((itemChild) => {
                  return (
                    itemChild.name &&
                    this.$formCheck(itemChild, [
                      {
                        key: 'name',
                        errMsg: '请选择织造明细'
                      },
                      {
                        key: 'total_price',
                        errMsg: '请输入织造总价'
                      }
                    ])
                  )
                }) ||
                item.semi_product_data.some((itemChild) => {
                  return (
                    itemChild.process_id &&
                    this.$formCheck(itemChild, [
                      {
                        key: 'process_id',
                        errMsg: '请选择半成品加工工序'
                      },
                      {
                        key: 'total_price',
                        errMsg: '请输入半成品加工总价'
                      }
                    ])
                  )
                }) ||
                item.production_data.some((itemChild) => {
                  return (
                    itemChild.name &&
                    this.$formCheck(itemChild, [
                      {
                        key: 'name',
                        errMsg: '请选择成品加工工序'
                      },
                      {
                        key: 'total_price',
                        errMsg: '请输入成品加工总价'
                      }
                    ])
                  )
                }) ||
                item.pack_material_data.some((itemChild) => {
                  return (
                    itemChild.material_id &&
                    this.$formCheck(itemChild, [
                      {
                        key: 'material_id',
                        errMsg: '请选择包装辅料'
                      },
                      {
                        key: 'total_price',
                        errMsg: '请输入包装辅料总价'
                      }
                    ])
                  )
                }) ||
                item.other_fee_data.some((itemChild) => {
                  return (
                    itemChild.name &&
                    this.$formCheck(itemChild, [
                      {
                        key: 'name',
                        errMsg: '请输入其他费用名称'
                      },
                      {
                        key: 'total_price',
                        errMsg: '请输入其他费用总价'
                      }
                    ])
                  )
                })
              )
            }
          })
        if (!formCheck) {
          this.getCmpData()
          quotedPrice.create(this.quotedPriceInfo).then((res) => {
            console.log(res)
            if (res.data.status) {
              this.$message.success('创建成功')
            }
          })
        }
      } else {
      }
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
        checkWhich: 'api/productType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getProductTypeAsync'
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      },
      {
        checkWhich: 'api/decorateMaterial',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getDecorateMaterialAsync'
      },
      {
        checkWhich: 'api/packMaterial',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getPackMaterialAsync'
      },
      {
        checkWhich: 'api/halfProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getHalfProcessAsync'
      },
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/quotedPrice/create.less';
</style>
<style lang="less">
#quotedPriceCreate {
  .el-tabs__content {
    padding: 0;
  }
}
</style>