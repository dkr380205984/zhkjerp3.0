<template>
  <div id="quotedPriceCreate"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">修改报价单</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">报价单标题</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入报价单标题"
                v-model="quotedPriceInfo.title"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">询价客户</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-cascader placeholder="请选择询价客户"
                v-model="quotedPriceInfo.tree_data"
                :options="clientList"
                @change="getContacts"
                clearable
                filterable>
              </el-cascader>
            </div>
          </div>
          <div class="col">
            <div class="label">公司联系人</div>
            <div class="info elCtn">
              <el-select placeholder="请选择公司联系人"
                v-model="quotedPriceInfo.contacts_id"
                no-data-text="请先选择询价客户"
                clearable>
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
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择负责小组/人"
                v-model="quotedPriceInfo.group_id"
                clearable>
                <el-option v-for="item in groupList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">报价币种</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择报价币种"
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
              <span class="text">币种汇率
                <el-tooltip class="item"
                  effect="dark"
                  content="点击查看实时币种汇率"
                  placement="top-start">
                  <em class="el-icon-question"
                    @click="$openUrl('http://forex.hexun.com/rmbhl/#zkRate')"></em>
                </el-tooltip>
              </span>
              <span class="explanation">(必填,例：100人民币=600美元,填入"600"。)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入币种汇率"
                v-model="quotedPriceInfo.exchange_rate"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn"
        style="border-bottom:0">
        <div class="title">添加产品描述</div>
      </div>
      <div v-for="(item,index) in quotedPriceInfo.product_data"
        :key="index">
        <div class="lineInfo">
          <div class="text">产品{{index+1}}</div>
          <div class="deleteIcon"
            @click="quotedPriceInfo.product_data.length>1?$deleteItem(quotedPriceInfo.product_data,index):$message.error('至少有一项产品描述')">删除</div>
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
              <div class="label">产品描述
                <span class="explanation">(请输入产品描述，如产品的尺寸、克重、成分、工艺、配料等信息)</span>
              </div>
              <div class="info"
                :id="'editor'+index"
                style="z-index: 0;position: relative;">
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
                  :file-list="item.file_list"
                  :on-remove="function(file){return removeFile(file, index)}"
                  :on-success="function(response){return successFile(response, index)}"
                  ref="uploada"
                  list-type="picture">
                  <div class="uploadBtn">
                    <i class="el-icon-upload"></i>
                    <span>上传图片</span>
                  </div>
                  <div slot="tip"
                    class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
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
                      v-model="itemYarn.tree_data"
                      :options="yarnTypeList"
                      clearable
                      filterable></el-cascader>
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
                    @change="cmpTotalPrice(itemYarn)"
                    :disabled="itemYarn.tree_data.length===0">
                    <template slot="append">
                      <input class="unit"
                        v-model="itemYarn.unit"
                        placeholder="单位"
                        :disabled="itemYarn.tree_data.length===0" />
                    </template>
                  </el-input>
                  <el-input class="once"
                    v-model="itemYarn.loss"
                    placeholder="损耗"
                    @change="cmpTotalPrice(itemYarn)"
                    :disabled="itemYarn.tree_data.length===0">
                    <template slot="append">%</template>
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexYarn===0">
                  <div class="once">单价</div>
                  <div class="once">小计</div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once"
                    v-model="itemYarn.price"
                    placeholder="单价"
                    @change="cmpTotalPrice(itemYarn)"
                    :disabled="itemYarn.tree_data.length===0">
                    <template slot="append">元/{{itemYarn.unit==='g'?'kg':itemYarn.unit || '单位'}}</template>
                  </el-input>
                  <el-input class="once"
                    v-model="itemYarn.total_price"
                    placeholder="小计"
                    :disabled="itemYarn.tree_data.length===0">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexYarn===0"
                @click="$addItem(item.material_data,{
                  id:'',
                  tree_data:[],
                  material_id: '',
                  weight: '',
                  loss: '',
                  price: '',
                  total_price: '',
                  unit: 'g'
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="deleteInfo(item.material_data,itemYarn,indexYarn,'deleteProMat')">删除</div>
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
                    clearable
                    filterable>
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
                    @change="cmpTotalPrice(itemDecorateMaterial)"
                    :disabled="!itemDecorateMaterial.material_id">
                    <template slot="append">
                      <input class="unit"
                        v-model="itemDecorateMaterial.unit"
                        placeholder="单位"
                        :disabled="!itemDecorateMaterial.material_id" />
                    </template>
                  </el-input>
                  <el-input class="once"
                    v-model="itemDecorateMaterial.loss"
                    placeholder="损耗"
                    @change="cmpTotalPrice(itemDecorateMaterial)"
                    :disabled="!itemDecorateMaterial.material_id">
                    <template slot="append">%</template>
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween"
                  v-if="indexDecorateMaterial===0">
                  <div class="once">单价</div>
                  <div class="once">小计</div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once"
                    v-model="itemDecorateMaterial.price"
                    placeholder="单价"
                    @change="cmpTotalPrice(itemDecorateMaterial)"
                    :disabled="!itemDecorateMaterial.material_id">
                    <template slot="append">元/{{itemDecorateMaterial.unit||'单位'}}</template>
                  </el-input>
                  <el-input class="once"
                    v-model="itemDecorateMaterial.total_price"
                    placeholder="小计"
                    :disabled="!itemDecorateMaterial.material_id">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexDecorateMaterial===0"
                @click="$addItem(item.assist_material_data,{
                  id:'',
                  material_name: '',
                  number: '',
                  loss: '',
                  price: '',
                  total_price: ''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="deleteInfo(item.assist_material_data,itemDecorateMaterial,indexDecorateMaterial,'deleteProAss')">删除</div>
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
                    placeholder="织造说明"
                    :disabled="!itemWeave.name">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexWeave===0">
                  <span class="text">小计</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemWeave.total_price"
                    placeholder="小计"
                    :disabled="!itemWeave.name">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexWeave===0"
                @click="$addItem(item.weave_data,{
                  id:'',
                 number:'',
                 name:'',
                 total_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="deleteInfo(item.weave_data,itemWeave,indexWeave,'deleteWeave')">删除</div>
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
                  <el-select v-model="itemHalfProcess.name"
                    placeholder="请选择加工工序"
                    clearable
                    filterable>
                    <el-option v-for="item in halfProcessList"
                      :key="item.name"
                      :value="item.name"
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
                    placeholder="加工说明"
                    :disabled="!itemHalfProcess.name">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexHalfProcess===0">
                  <span class="text">小计</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemHalfProcess.total_price"
                    placeholder="小计"
                    :disabled="!itemHalfProcess.name">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexHalfProcess===0"
                @click="$addItem(item.semi_product_data,{
                 id:'',
                 desc:'',
                 name:'',
                 total_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="deleteInfo(item.semi_product_data,itemHalfProcess,indexHalfProcess,'deleteSemi')">删除</div>
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
                    clearable
                    filterable>
                    <el-option v-for="item in finishedList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"></el-option>
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
                    placeholder="加工说明"
                    :disabled="!itemFinishedProcess.name">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexFinishedProcess===0">
                  <span class="text">小计</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemFinishedProcess.total_price"
                    placeholder="小计"
                    :disabled="!itemFinishedProcess.name">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexFinishedProcess===0"
                @click="$addItem(item.production_data,{
                id:'',
                 desc:'',
                 name:'',
                 total_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="deleteInfo(item.production_data,itemFinishedProcess,indexFinishedProcess,'deleteInspection')">删除</div>
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
                    clearable
                    filterable>
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
                    placeholder="辅料说明"
                    :disabled="!itemPackMaterial.material_id">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexPackMaterial===0">
                  <span class="text">小计</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemPackMaterial.total_price"
                    placeholder="小计"
                    :disabled="!itemPackMaterial.material_id">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexPackMaterial===0"
                @click="$addItem(item.pack_material_data,{
                  id:'',
                 desc:'',
                 name:'',
                 total_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="deleteInfo(item.pack_material_data,itemPackMaterial,indexPackMaterial,'deletePack')">删除</div>
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
                    placeholder="费用说明"
                    :disabled="!itemOther.name">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexOther===0">
                  <span class="text">小计</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemOther.total_price"
                    placeholder="小计"
                    :disabled="!itemOther.name">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexOther===0"
                @click="$addItem(item.other_fee_data,{
                  id:'',
                 desc:'',
                 name:'',
                 total_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="deleteInfo(item.other_fee_data,itemOther,indexOther,'deleteOther')">删除</div>
            </div>
            <div class="row"
              v-for="(itemNoPro,indexNoPro) in item.no_production_fee_data"
              :key="'NoPro' + indexNoPro">
              <div class="col">
                <div class="label"
                  v-if="indexNoPro===0">
                  <span class="text">非生产型费用</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemNoPro.name"
                    placeholder="非生产型费用"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexNoPro===0">
                  <span class="text">费用说明</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemNoPro.desc"
                    placeholder="费用说明"
                    :disabled="!itemNoPro.name">
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label"
                  v-if="indexNoPro===0">
                  <span class="text">小计</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemNoPro.total_price"
                    placeholder="小计"
                    :disabled="!itemNoPro.name">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexNoPro===0"
                @click="$addItem(item.no_production_fee_data,{
                  id:'',
                 desc:'',
                 name:'',
                 total_price:''
                })">添加</div>
              <div class="opr hoverRed"
                v-else
                @click="$deleteItem(item.no_production_fee_data,indexOther)">删除</div>
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
          合计：<span class="blue">{{realTotalPrice}}元<span v-if="quotedPriceInfo.settle_unit!=='元'">{{'/'+realTotalPriceChange+quotedPriceInfo.settle_unit}}</span></span>
        </div>
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverOrange"
            @click="saveQuotedPrice(true)">保存为草稿</div>
          <div class="btn backHoverBlue"
            @click="saveQuotedPrice(false)">确认修改</div>
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
      loading: true,
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
        client_id: '',
        tree_data: [],
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
            secondary_category_id: '',
            image_data: [],
            client_target_price: '',
            start_order_number: '',
            desc: '',
            transport_fee_desc: '',
            transport_fee: '',
            material_data: [
              {
                id: '',
                tree_data: [],
                material_id: '',
                material_name: '',
                weight: '',
                loss: '',
                price: '',
                total_price: '',
                unit: 'g'
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
                name: '',
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
      contactsList: [],
      weaveList: [{ value: '针织织造' }, { value: '梭织织造' }, { value: '制版费' }]
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
            }, 0) +
            current.no_production_fee_data.reduce((totalChild, currentChild) => {
              return totalChild + Number(currentChild.total_price)
            }, 0)
          )
        }, 0)
        .toFixed(2)
    },
    // 总合计——含各种税 quotedPriceInfo.system_total_price
    realTotalPrice(): string {
      return (
        Number(this.totalPrice) /
        (1 -
          ((Number(this.quotedPriceInfo.commission_percentage) / 100 || 0) +
            (Number(this.quotedPriceInfo.profit_percentage) / 100 || 0) +
            Number(this.quotedPriceInfo.rate_taxation) / 100 || 0))
      ).toFixed(2)
    },
    // 总合计，按照汇率转换后
    realTotalPriceChange(): string {
      return ((Number(this.realTotalPrice) / Number(this.quotedPriceInfo.exchange_rate)) * 100).toFixed(2)
    },
    // quotedPriceInfo.commission_price
    commissionPrice(): string {
      return (Number(this.realTotalPrice) * (Number(this.quotedPriceInfo.commission_percentage) / 100 || 0)).toFixed(2)
    },
    // quotedPriceInfo.profit_price
    profitPrice(): string {
      return (Number(this.realTotalPrice) * (Number(this.quotedPriceInfo.profit_percentage) / 100 || 0)).toFixed(2)
    },
    // quotedPriceInfo.rate_price
    ratePrice(): string {
      return (Number(this.realTotalPrice) * (Number(this.quotedPriceInfo.rate_taxation) / 100 || 0)).toFixed(2)
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
    },
    finishedList() {
      return this.$store.state.api.staffProcess.arr
    }
  },
  methods: {
    addPro() {
      this.$addItem(this.quotedPriceInfo.product_data, {
        total_price: '',
        product_id: '',
        type: [],
        category_id: '',
        secondary_category_id: '',
        image_data: [],
        client_target_price: '',
        start_order_number: '',
        desc: '',
        transport_fee_desc: '',
        transport_fee: '',
        editor: '',
        material_data: [
          {
            id: '',
            tree_data: [],
            material_id: '',
            material_name: '',
            weight: '',
            loss: '',
            price: '',
            total_price: '',
            unit: 'g'
          }
        ],
        assist_material_data: [
          {
            id: '',
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
            id: '',
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        semi_product_data: [
          {
            id: '',
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        production_data: [
          {
            id: '',
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        pack_material_data: [
          {
            id: '',
            material_id: '',
            material_name: '',
            desc: '',
            total_price: ''
          }
        ],
        other_fee_data: [
          {
            id: '',
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
      })
      const index = Number(this.quotedPriceInfo.product_data.length - 1)
      this.$nextTick(() => {
        this.$initEditor(this.quotedPriceInfo.product_data[index], index)
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
    removeFile(file: { response: { hash: string; key: string }; url: string }, index: number) {
      if (this.quotedPriceInfo.product_data[index].file_list?.find((item) => item.url === file.url)) {
        this.$deleteItem(
          this.quotedPriceInfo.product_data[index].file_list!,
          this.quotedPriceInfo.product_data[index].file_list!.map((item) => item.url).indexOf(file.url)
        )
      } else {
        this.$deleteItem(
          this.quotedPriceInfo.product_data[index].image_data,
          this.quotedPriceInfo.product_data[index].image_data!.indexOf('https://file.zwyknit.com/' + file.response.key)
        )
      }
    },
    getUnit(ev: string, info: DecorateMaterialInfo) {
      info.unit = this.decorateMaterialList.find((item) => item.id === ev)!.unit
    },
    getContacts(ev: number[], init?: boolean) {
      if (ev) {
        client
          .detail({
            id: ev[2]
          })
          .then((res) => {
            if (res.data.status) {
              if (!init) {
                this.quotedPriceInfo.contacts_id = ''
              }
              this.contactsList = res.data.data.contacts_data
            }
          })
      }
    },
    // 辅助计算产品原料和装饰辅料的小计，小计本身可直接修改
    cmpTotalPrice(info: {
      total_price: number
      weight: number
      loss: any
      price: number
      number: number
      unit?: string
    }) {
      // 为了纱线单独做数量为g单价为kg的判断
      if (info.unit === 'g') {
        info.total_price = this.$toFixed(
          ((Number(info.weight || info.number) || 0) *
            (1 + (Number(info.loss) || 0) / 100) *
            (Number(info.price) || 0)) /
            1000
        )
      } else {
        info.total_price = this.$toFixed(
          (Number(info.weight || info.number) || 0) * (1 + (Number(info.loss) || 0) / 100) * (Number(info.price) || 0)
        )
      }
    },
    // 把通过计算属性得到的价格以及通过级联选择器选到的id赋给表单数据
    getCmpData() {
      this.quotedPriceInfo.id = Number(this.$route.query.id)
      this.quotedPriceInfo.total_number = this.quotedPriceInfo.product_data.length
      this.quotedPriceInfo.commission_price = this.commissionPrice
      this.quotedPriceInfo.rate_price = this.ratePrice
      this.quotedPriceInfo.profit_price = this.profitPrice
      this.quotedPriceInfo.total_cost_price = this.totalPrice
      this.quotedPriceInfo.system_total_price = this.realTotalPrice
      this.quotedPriceInfo.client_id = this.quotedPriceInfo.tree_data && (this.quotedPriceInfo.tree_data as number[])[2]
      this.quotedPriceInfo.tree_data =
        this.quotedPriceInfo.tree_data && (this.quotedPriceInfo.tree_data as number[]).join(',') // 保存公司原始数据包含一级二级分类
      this.quotedPriceInfo.product_data.forEach((item) => {
        item.editor = ''
        item.image_data = item.image_data.concat(item.file_list!.map((item) => item.url)) // 新旧图拼接
        item.category_id = item.type && item.type[0]
        item.secondary_category_id = item.type && item.type[1]
        item.material_data.forEach((itemChild) => {
          console.log(itemChild.tree_data)
          itemChild.material_id =
            itemChild.tree_data!.length > 0 ? itemChild.tree_data && (itemChild.tree_data as number[])[2] : ''
          itemChild.tree_data = itemChild.tree_data && (itemChild.tree_data as number[]).join(',')
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
          }, 0) +
          item.no_production_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0)
      })
    },
    saveQuotedPrice(ifCaogao: boolean) {
      this.quotedPriceInfo.is_draft = ifCaogao ? 1 : 2
      if (!ifCaogao) {
        const formCheck =
          this.$formCheck(this.quotedPriceInfo, [
            {
              key: 'tree_data',
              errMsg: '请选择询价客户',
              regNormal: 'checkArr'
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
          this.quotedPriceInfo.product_data.some((item, index) => {
            // 选择已有产品和直接添加产品描述验证不同

            return (
              this.$formCheck(item, [
                {
                  key: 'transport_fee',
                  errMsg: '产品' + (index + 1) + '请输入运费'
                },
                {
                  key: 'type',
                  errMsg: '请选择产品' + (index + 1) + '品类',
                  regNormal: 'checkArr'
                }
              ]) ||
              item.material_data.some((itemChild) => {
                return (
                  itemChild.tree_data &&
                  this.$formCheck(itemChild, [
                    {
                      key: 'tree_data',
                      errMsg: '请选择产品' + (index + 1) + '原料',
                      regNormal: 'checkArr'
                    },
                    // {
                    //   key: 'weight',
                    //   errMsg: '请输入产品' + (index + 1) + '原料预计数量'
                    // },
                    {
                      key: 'unit',
                      errMsg: '物料的单位只能为g，kg或m',
                      regExp: /^g$|^m$|^kg$/,
                      regNegate: true
                    }
                    // {
                    //   key: 'price',
                    //   errMsg: '请输入产品' + (index + 1) + '原料单价'
                    // }
                  ])
                )
              }) ||
              item.assist_material_data.some((itemChild) => {
                return (
                  itemChild.material_id &&
                  this.$formCheck(itemChild, [
                    {
                      key: 'material_id',
                      errMsg: '请选择产品' + (index + 1) + '装饰辅料'
                    },
                    // {
                    //   key: 'number',
                    //   errMsg: '请输入产品' + (index + 1) + '装饰辅料预计数量'
                    // },
                    {
                      key: 'unit',
                      errMsg: '请输入产品' + (index + 1) + '装饰辅料数量单位'
                    }
                    // {
                    //   key: 'price',
                    //   errMsg: '请输入产品' + (index + 1) + '装饰辅料单价'
                    // }
                  ])
                )
              }) ||
              item.weave_data.some((itemChild) => {
                return (
                  itemChild.name &&
                  this.$formCheck(itemChild, [
                    {
                      key: 'name',
                      errMsg: '请选择产品' + (index + 1) + '织造明细'
                    },
                    {
                      key: 'total_price',
                      errMsg: '请输入产品' + (index + 1) + '织造小计'
                    }
                  ])
                )
              }) ||
              item.semi_product_data.some((itemChild) => {
                return (
                  itemChild.name &&
                  this.$formCheck(itemChild, [
                    {
                      key: 'name',
                      errMsg: '请选择产品' + (index + 1) + '半成品加工工序'
                    },
                    {
                      key: 'total_price',
                      errMsg: '请输入产品' + (index + 1) + '半成品加工小计'
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
                      errMsg: '请选择产品' + (index + 1) + '成品加工工序'
                    },
                    {
                      key: 'total_price',
                      errMsg: '请输入产品' + (index + 1) + '成品加工小计'
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
                      errMsg: '请选择产品' + (index + 1) + '包装辅料'
                    },
                    {
                      key: 'total_price',
                      errMsg: '请输入产品' + (index + 1) + '包装辅料小计'
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
                      errMsg: '请输入产品' + (index + 1) + '其他费用名称'
                    },
                    {
                      key: 'total_price',
                      errMsg: '请输入产品' + (index + 1) + '其他费用小计'
                    }
                  ])
                )
              }) ||
              item.no_production_fee_data.some((itemChild) => {
                return (
                  itemChild.name &&
                  this.$formCheck(itemChild, [
                    {
                      key: 'name',
                      errMsg: '请输入产品' + (index + 1) + '非生产型费用名称'
                    },
                    {
                      key: 'total_price',
                      errMsg: '请输入产品' + (index + 1) + '非生产型费用小计'
                    }
                  ])
                )
              })
            )
          })
        if (!formCheck) {
          this.getCmpData()
          quotedPrice.create(this.quotedPriceInfo).then((res) => {
            if (res.data.status) {
              this.$message.success('修改成功')
              this.$router.push('/quotedPrice/detail?id=' + Number(this.$route.query.id))
            } else {
              // 提交不成功把tree_data反复横跳改来改去
              // @ts-ignore
              this.quotedPriceInfo.tree_data = this.quotedPriceInfo.tree_data.split(',')
              this.quotedPriceInfo.product_data.forEach((item) => {
                item.material_data.forEach((itemChild) => {
                  // @ts-ignore
                  itemChild.tree_data = itemChild.tree_data.split(',')
                })
              })
            }
          })
        }
      } else {
        this.getCmpData()
        quotedPrice.create(this.quotedPriceInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('草稿保存成功')
            this.$router.push('/quotedPrice/list?page=1&keyword=&client_id=&user_id=&status=0&date=')
          }
        })
      }
    },
    getUpdateInfo() {
      this.quotedPriceInfo.tree_data = this.quotedPriceInfo.tree_data
        ? (this.quotedPriceInfo.tree_data as string).split(',').map((item) => Number(item))
        : []
      if (this.quotedPriceInfo.tree_data.length > 0) {
        this.getContacts(this.quotedPriceInfo.tree_data, true) //标记一下是初始化
      }

      this.quotedPriceInfo.product_data.forEach((item, index) => {
        this.$initEditor(item, index)
        item.file_list = item.image_data.map((itemImage, index) => {
          return {
            id: index,
            url: itemImage
          }
        })
        item.image_data = [] // 清空image_data数据，用于存储新的url字符串，提交的时候拼接file_list剩下的就行
        item.type = item.category_id ? [item.category_id as number, item.secondary_category_id as number] : []
        item.material_data.forEach((itemMat) => {
          itemMat.tree_data = itemMat.tree_data
            ? (itemMat.tree_data as string).split(',').map((item) => Number(item))
            : []
        })
      })
    },
    deleteInfo<T extends { id: number | string }>(
      arr: T[],
      info: T,
      index: number,
      type:
        | 'deleteProMat'
        | 'deleteProAss'
        | 'deleteWeave'
        | 'deleteSemi'
        | 'deleteInspection'
        | 'deletePack'
        | 'deleteOther'
    ) {
      if (!info.id) {
        arr.splice(index, 1)
      } else {
        this.loading = true
        quotedPrice[type]({
          id: info.id
        }).then((res) => {
          if (res.data.status) {
            arr.splice(index, 1)
            this.loading = false
          }
        })
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
        checkWhich: 'api/staffProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStaffProcessAsync'
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
    quotedPrice
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.quotedPriceInfo = res.data.data
          this.getUpdateInfo()
          this.loading = false
        }
      })
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