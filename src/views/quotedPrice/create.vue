<template>
  <div id="quotedPriceCreate"
    class="bodyContainer"
    v-loading="loading"
    @keydown="saveSuccess=false">
    <div class="module">
      <div class="titleCtn">
        <div class="title">添加报价单
          <div class="elCtn fr">
            <!-- 导入报价功能不应该在订单转报价的时候使用，因为不知道订单的哪个产品要和导入进来的报价单的哪个产品绑定，就很麻烦，优化了才能用 -->
            <el-select v-if="!$route.query.orderId&&!$route.query.sampleOrderId"
              v-model="searchQuotedPriceKey"
              filterable
              remote
              reserve-keyword
              placeholder="输入编号导入报价单"
              :remote-method="(ev)=>{return $debounce(ev,timer,searchQuotedPriceFn)}"
              :loading="searchLoading"
              @change="getImportDetail">
              <el-option v-for="item in searchList"
                :key="item.id"
                :value="item.id"
                :label="item.code">
                <span style="float:left"
                  class="blue">{{item.code}}</span>
                <span style="float:right;color:#8492a6;font-size:12px">{{item.title}}</span>
              </el-option>
            </el-select>
          </div>
        </div>
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
                content="添加新客户"
                placement="top">
                <i class="el-icon-upload hoverOrange fr"
                  style="line-height:38px;font-size:18px;cursor:pointer;"
                  @click="$openUrl('/client/create?type=1')"></i>
              </el-tooltip>
            </div>
            <div class="info elCtn">
              <el-cascader :class="{'error':mustFlag&&quotedPriceInfo.tree_data.length===0}"
                placeholder="请选择询价客户"
                v-model="quotedPriceInfo.tree_data"
                :options="clientList"
                @change="getContacts"
                :disabled="!!$route.query.again"
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
                clearable
                :disabled="!!$route.query.again">
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
                clearable
                :disabled="!!$route.query.again">
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
                v-model="quotedPriceInfo.settle_unit"
                :disabled="!!$route.query.again">
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
                  content="点击查看实时币种汇率,例：100人民币=600美元”改为“必填，6.8汇率则填680"
                  placement="top-start">
                  <em class="el-icon-question"
                    @click="$openUrl('http://forex.hexun.com/rmbhl/#zkRate')"></em>
                </el-tooltip>
              </span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input type="number"
                placeholder="请输入币种汇率"
                v-model="quotedPriceInfo.exchange_rate"
                :disabled="!!$route.query.again"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn"
        style="border-bottom:0">
        <div class="title">添加产品描述
          <span class="orange"
            style="font-size:14px"
            v-if="$route.query.again || $route.query.product_id || $route.query.orderId || $route.query.sampleOrderId">(订单/样单转报价或再次报价不能新增或者删除产品)</span>
        </div>
      </div>
      <div v-for="(item,index) in quotedPriceInfo.product_data"
        :key="index">
        <div class="lineInfo">
          <div class="text">产品{{index+1}}</div>
          <div class="deleteIcon blue"
            v-if="$route.query.product_id || $route.query.orderId || $route.query.sampleOrderId"
            @click="item.show=!item.show;$forceUpdate()">{{item.show?'关闭':'详情'}}
            <div class="printInfo"
              v-if="item.product_info && item.show">
              <div class="items">
                <div class="label">编号:</div>
                <div class="contents">{{item.product_info.product_code}}</div>
              </div>
              <div class="items">
                <div class="label">品类:</div>
                <div class="contents">{{item.product_info.category}}/{{item.product_info.secondary_category}}</div>
              </div>
              <div class="items">
                <div class="label">款式:</div>
                <div class="contents">{{item.product_info.style_data.map((itemChild)=>itemChild.name).join(',')}}</div>
              </div>
              <div class="items">
                <div class="label">成分:</div>
                <div class="contents">
                  <span style="margin-right:6px"
                    v-for="itemChild in item.product_info.component_data"
                    :key="itemChild.id">{{itemChild.name}}{{itemChild.number}}%</span>
                </div>
              </div>
              <div class="items">
                <div class="label">配色:</div>
                <div class="contents">
                  <span style="margin-right:6px"
                    v-for="itemChild in item.product_info.color_data"
                    :key="itemChild.id">{{itemChild.name}}</span>
                </div>
              </div>
              <div class="items"
                v-for="itemChild in item.product_info.size_data"
                :key="itemChild.id">
                <div class="label">尺码:</div>
                <div class="contents">{{itemChild.name}}&nbsp;{{itemChild.weight}}g&nbsp;{{itemChild.size_info}}</div>
              </div>
            </div>
          </div>
          <div class="deleteIcon"
            @click="quotedPriceInfo.product_data.length>1?$deleteItem(quotedPriceInfo.product_data,index):$message.error('至少有一项产品描述')"
            v-if="index===quotedPriceInfo.product_data.length-1 && !$route.query.again && !$route.query.product_id && !$route.query.orderId && !$route.query.sampleOrderId">删除</div>
        </div>
        <div class="editCtn">
          <div class="row">
            <div class="col">
              <div class="label">
                <span class="text">产品品类</span>
                <span class="explanation">(必选)</span>
                <el-tooltip class="item"
                  effect="dark"
                  content="设置成功后请点击此按钮刷新数据"
                  placement="top">
                  <i class="el-icon-refresh hoverGreen fr"
                    style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                    @click="$checkCommonInfo([{
                        checkWhich: 'api/productType',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getProductTypeAsync',
                        forceUpdate:true
                      }])"></i>
                </el-tooltip>
                <el-tooltip class="item"
                  effect="dark"
                  content="添加品类"
                  placement="top">
                  <i class="el-icon-upload hoverOrange fr"
                    style="line-height:38px;font-size:18px;cursor:pointer"
                    @click="$openUrl('/setting/?pName=产品设置&cName=品类')"></i>
                </el-tooltip>
              </div>
              <div class="info elCtn">
                <el-cascader :class="{'error':mustFlag&&item.type.length===0}"
                  :disabled="$route.query.again==='true'"
                  placeholder="请选择品类"
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
              <div class="label">产品图片
                <el-checkbox v-model="item.cvFlag"
                  @change="(ev)=>{return changeCVOpration(ev,index,item.cvImageLength)}">{{item.cvFlag?'关闭复制粘贴图片上传功能':'开启复制粘贴图片上传功能'}}
                </el-checkbox>
              </div>
              <!-- 
              <div class="cvImageCtn"
                v-show="item.cvFlag || item.cv_list.length>0">
                <div class="cvImage"
                  v-for="indexImage of item.cvImageLength"
                  :key="indexImage">
                  <template v-if="item.cv_list[indexImage-1]!==null">
                    <img :id="index + 'cvImg'+indexImage"
                      :src="require('@/assets/image/common/cv.png')">
                    <i class="icon el-icon-close"
                      @click="deleteCvImage(index,indexImage-1)"></i>
                  </template>
                </div>
              </div> -->
              <div class="info">
                <el-upload class="upload"
                  action="https://upload.qiniup.com/"
                  accept="image/jpeg,image/gif,image/png,image/bmp"
                  :before-upload="beforeAvatarUpload"
                  :data="postData"
                  :file-list="item.file_list"
                  :before-remove="function(file,fileList){return beforeRemove(file, index,fileList)}"
                  :on-success="function(response){return successFile(response, index)}"
                  :on-preview="handlePictureCardPreview"
                  ref="uploada"
                  list-type="picture-card">
                  <div class="uploadBtn">
                    <i class="el-icon-upload"></i>
                    <span>上传图片</span>
                  </div>
                  <div slot="tip"
                    class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M(请勿上传带特殊字符的图片)</div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </div>
            </div>
          </div>
          <div v-if="index===quotedPriceInfo.product_data.length-1 && !$route.query.again && !$route.query.product_id && !$route.query.orderId && !$route.query.sampleOrderId"
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
      <el-tabs type="border-card"
        v-model="productIndex">
        <el-tab-pane :label="'产品'+(index+1)"
          v-for="(item,index) in quotedPriceInfo.product_data"
          :key="index">
          <div class="titleCtn">
            <div class="title">报价信息
              <el-popover placement="top"
                title="报价说明"
                width="300"
                trigger="manual"
                v-model="showContent"
                v-if="Number(productIndex)===index">
                <div class="blue">{{desc}}</div>
                <el-image style="width: 100px; height: 100px"
                  :src="quotedImage"
                  :preview-src-list="[quotedImage]"></el-image>
                <span slot="reference"
                  class="hoverBlue"
                  style="font-size:12px;margin-left:8px;cursor:pointer"
                  @click="showContent?showContent=false:lookPriceDetail(item.type,'material_data')">{{showContent?'关闭说明':'查看说明'}}</span>
              </el-popover>
              <div class="fr elCtn"
                style="margin-top:2px">
                <div class="btn backHoverBlue"
                  style="line-height:32px;font-weight:normal;font-size:16px"
                  @click="$openUrl('/setting/?pName=报价单设置&cName=报价模板')">添加新模板</div>
              </div>
              <div class="fr elCtn"
                style="margin-right:24px">
                <el-select v-model="searchQuotedPrice"
                  placeholder="导入报价模板"
                  @change="getModules">
                  <el-option v-for="item in searchQuotedPriceList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.title"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="editCtn">
            <div class="row"
              v-for="(itemYarn,indexYarn) in item.material_data"
              :key="'Yarn' + indexYarn">
              <div class="col">
                <div class="label">
                  <span class="text">产品原料</span>
                  <el-tooltip class="item"
                    effect="dark"
                    content="设置成功后请点击此按钮刷新数据"
                    placement="top">
                    <i class="el-icon-refresh hoverGreen fr"
                      style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                      @click="$checkCommonInfo([{
                        checkWhich: 'api/yarnType',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getYarnTypeAsync',
                        forceUpdate:true
                      }])"></i>
                  </el-tooltip>
                  <el-tooltip class="item"
                    effect="dark"
                    content="添加新原料"
                    placement="top">
                    <i class="el-icon-upload hoverOrange fr"
                      style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                      @click="$openUrl('/setting/?pName=物料设置&cName=纱线原料')"></i>
                  </el-tooltip>
                  <el-popover placement="bottom"
                    title="报价详情"
                    width="600"
                    trigger="manual"
                    v-model="itemYarn.look">
                    <div class="tableCtn"
                      style="padding: 0">
                      <div class="thead">
                        <div class="trow">
                          <div class="tcol">单位名称</div>
                          <div class="tcol">报价</div>
                          <div class="tcol">备注</div>
                        </div>
                      </div>
                      <div class="tbody">
                        <div class="trow"
                          v-for="(itemChild, indexChild) in itemYarn.price_info"
                          :key="indexChild">
                          <div class="tcol">{{ itemChild.client_name }}</div>
                          <div class="tcol">{{ itemChild.price }}元/kg</div>
                          <div class="tcol">{{ itemChild.desc || '无' }}</div>
                        </div>
                      </div>
                    </div>
                    <span slot="reference"
                      @click="itemYarn.look = !itemYarn.look"
                      class="fr">
                      <span class="hoverBlue"
                        style="font-size:12px">{{itemYarn.look? '关闭报价' : '查看报价'}}</span>
                    </span>
                  </el-popover>
                </div>
                <div class="info elCtn">
                  <div class="info elCtn">
                    <el-cascader placeholder="请选择原料"
                      v-model="itemYarn.tree_data"
                      :options="yarnTypeList"
                      clearable
                      filterable
                      @change="getYarnPrice($event,itemYarn)"></el-cascader>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween">
                  <div class="once">预计数量</div>
                  <div class="once">预计损耗</div>
                </div>
                <div class="info elCtn spaceBetween"
                  v-if="itemYarn.tree_data[0]!==2">
                  <el-input class="once unitAppend"
                    v-model="itemYarn.weight"
                    placeholder="数量"
                    @input="itemYarn.price?cmpTotalPrice(itemYarn):''"
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
                    @input="itemYarn.price?cmpTotalPrice(itemYarn):''"
                    :disabled="itemYarn.tree_data.length===0">
                    <template slot="append">%</template>
                  </el-input>
                </div>
                <div class="info elCtn"
                  v-else>
                  <el-input class="once unitAppend"
                    v-model="itemYarn.desc"
                    placeholder="面料描述"
                    :disabled="itemYarn.tree_data.length===0">
                    <template slot="append">
                      <input class="unit"
                        v-model="itemYarn.unit"
                        placeholder="单位"
                        :disabled="itemYarn.tree_data.length===0" />
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label spaceBetween">
                  <div class="once">单价</div>
                  <div class="once">小计</div>
                </div>
                <div class="info elCtn spaceBetween">
                  <el-input class="once"
                    v-model="itemYarn.price"
                    placeholder="单价"
                    @input="cmpTotalPrice(itemYarn)"
                    :disabled="itemYarn.tree_data.length===0">
                    <template slot="append">元/{{itemYarn.unit==='g'?'kg':itemYarn.unit || '单位'}}</template>
                  </el-input>
                  <el-input class="once"
                    :ref="'material_data-'+index+'-'+indexYarn"
                    v-model="itemYarn.total_price"
                    placeholder="小计"
                    :disabled="itemYarn.tree_data.length===0"
                    @keydown.native="focusByKeydown($event,'material_data','','assist_material_data',index,indexYarn)">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexYarn===0"
                @click="$addItem(item.material_data,{
                  id:'',
                  desc:'',
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
                @click="$deleteItem(item.material_data,indexYarn)">删除</div>
            </div>
            <div class="row"
              v-for="(itemDecorateMaterial,indexDecorateMaterial) in item.assist_material_data"
              :key="'DecorateMaterial' + indexDecorateMaterial">
              <div class="col">
                <div class="label"
                  v-if="indexDecorateMaterial===0">
                  <span class="text">装饰辅料</span>
                  <el-tooltip class="item"
                    effect="dark"
                    content="设置成功后请点击此按钮刷新数据"
                    placement="top">
                    <i class="el-icon-refresh hoverGreen fr"
                      style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                      @click="$checkCommonInfo([{
                        checkWhich: 'api/decorateMaterial',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getDecorateMaterialAsync',
                        forceUpdate:true
                      }])"></i>
                  </el-tooltip>
                  <el-tooltip class="item"
                    effect="dark"
                    content="添加新辅料"
                    placement="top">
                    <i class="el-icon-upload hoverOrange fr"
                      style="line-height:38px;font-size:18px;cursor:pointer"
                      @click="$openUrl('/setting/?pName=物料设置&cName=装饰辅料')"></i>
                  </el-tooltip>
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
                <div class="label"
                  v-if="indexDecorateMaterial===0">
                  辅料说明
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemDecorateMaterial.desc"
                    placeholder="辅料说明"
                    :disabled="!itemDecorateMaterial.material_id">
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
                    @input="cmpTotalPrice(itemDecorateMaterial)"
                    :disabled="!itemDecorateMaterial.material_id">
                    <template slot="append">元/{{itemDecorateMaterial.unit||'单位'}}</template>
                  </el-input>
                  <el-input :ref="'assist_material_data-'+index+'-'+indexDecorateMaterial"
                    class="once"
                    v-model="itemDecorateMaterial.total_price"
                    placeholder="小计"
                    :disabled="!itemDecorateMaterial.material_id"
                    @keydown.native="focusByKeydown($event,'assist_material_data','material_data','weave_data',index,indexDecorateMaterial)">
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
                  total_price: '',
                  desc:''
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
                  <el-input :ref="'weave_data-'+index+'-'+indexWeave"
                    v-model="itemWeave.total_price"
                    placeholder="小计"
                    :disabled="!itemWeave.name"
                    @keydown.native="focusByKeydown($event,'weave_data','assist_material_data','semi_product_data',index,indexWeave)">
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
                @click="$deleteItem(item.weave_data,indexWeave)">删除</div>
            </div>
            <div class="row"
              v-for="(itemHalfProcess,indexHalfProcess) in item.semi_product_data"
              :key="'HalfProcess' + indexHalfProcess">
              <div class="col">
                <div class="label"
                  v-if="indexHalfProcess===0">
                  <span class="text">半成品加工</span>
                  <el-tooltip class="item"
                    effect="dark"
                    content="设置成功后请点击此按钮刷新数据"
                    placement="top">
                    <i class="el-icon-refresh hoverGreen fr"
                      style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                      @click="$checkCommonInfo([{
                        checkWhich: 'api/halfProcess',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getHalfProcessAsync',
                        forceUpdate:true
                      }])"></i>
                  </el-tooltip>
                  <el-tooltip class="item"
                    effect="dark"
                    content="添加新工序"
                    placement="top">
                    <i class="el-icon-upload hoverOrange fr"
                      style="line-height:38px;font-size:18px;cursor:pointer"
                      @click="$openUrl('/setting/?pName=工序设置&cName=半成品加工')"></i>
                  </el-tooltip>
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
                  <el-input :ref="'semi_product_data-'+index+'-'+indexHalfProcess"
                    v-model="itemHalfProcess.total_price"
                    placeholder="小计"
                    :disabled="!itemHalfProcess.name"
                    @keydown.native="focusByKeydown($event,'semi_product_data','weave_data','production_data',index,indexHalfProcess)">
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
                @click="$deleteItem(item.semi_product_data,indexHalfProcess)">删除</div>
            </div>
            <div class="row"
              v-for="(itemFinishedProcess,indexFinishedProcess) in item.production_data"
              :key="'FinishedProcess' + indexFinishedProcess">
              <div class="col">
                <div class="label"
                  v-if="indexFinishedProcess===0">
                  <span class="text">成品加工</span>
                  <el-tooltip class="item"
                    effect="dark"
                    content="设置成功后请点击此按钮刷新数据"
                    placement="top">
                    <i class="el-icon-refresh hoverGreen fr"
                      style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                      @click="$checkCommonInfo([{
                        checkWhich: 'api/staffProcess',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getStaffProcessAsync',
                        forceUpdate:true
                      }])"></i>
                  </el-tooltip>
                  <el-tooltip class="item"
                    effect="dark"
                    content="添加新工序"
                    placement="top">
                    <i class="el-icon-upload hoverOrange fr"
                      style="line-height:38px;font-size:18px;cursor:pointer"
                      @click="$openUrl('/setting/?pName=工序设置&cName=成品加工工序')"></i>
                  </el-tooltip>
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
                  <el-input :ref="'production_data-'+index+'-'+indexFinishedProcess"
                    v-model="itemFinishedProcess.total_price"
                    placeholder="小计"
                    :disabled="!itemFinishedProcess.name"
                    @keydown.native="focusByKeydown($event,'production_data','semi_product_data','pack_material_data',index,indexFinishedProcess)">
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
                @click="$deleteItem(item.production_data,indexFinishedProcess)">删除</div>
            </div>
            <div class="row"
              v-for="(itemPackMaterial,indexPackMaterial) in item.pack_material_data"
              :key="'PackMaterial' + indexPackMaterial">
              <div class="col">
                <div class="label"
                  v-if="indexPackMaterial===0">
                  <span class="text">包装辅料</span>
                  <el-tooltip class="item"
                    effect="dark"
                    content="设置成功后请点击此按钮刷新数据"
                    placement="top">
                    <i class="el-icon-refresh hoverGreen fr"
                      style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                      @click="$checkCommonInfo([{
                        checkWhich: 'api/packMaterial',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getPackMaterialAsync',
                        forceUpdate:true
                      }])"></i>
                  </el-tooltip>
                  <el-tooltip class="item"
                    effect="dark"
                    content="添加新包装辅料"
                    placement="top">
                    <i class="el-icon-upload hoverOrange fr"
                      style="line-height:38px;font-size:18px;cursor:pointer"
                      @click="$openUrl('/setting/?pName=物料设置&cName=包装辅料')"></i>
                  </el-tooltip>
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
                  <el-input :ref="'pack_material_data-'+index+'-'+indexPackMaterial"
                    v-model="itemPackMaterial.total_price"
                    placeholder="小计"
                    :disabled="!itemPackMaterial.material_id"
                    @keydown.native="focusByKeydown($event,'pack_material_data','production_data','other_fee_data',index,indexPackMaterial)">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="indexPackMaterial===0"
                @click="$addItem(item.pack_material_data,{
                  id: '',
                  material_name: '',
                  material_id: '',
                  desc: '',
                  total_price: ''
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
                  <el-autocomplete class="inline-input"
                    v-model="itemOther.name"
                    :fetch-suggestions="searchOtherFee"
                    placeholder="其他费用"></el-autocomplete>
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
                  <el-input :ref="'other_fee_data-'+index+'-'+indexOther"
                    v-model="itemOther.total_price"
                    placeholder="小计"
                    :disabled="!itemOther.name"
                    @keydown.native="focusByKeydown($event,'other_fee_data','pack_material_data','no_production_fee_data',index,indexOther)">
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
                @click="$deleteItem(item.other_fee_data,indexOther)">删除</div>
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
                  <el-autocomplete class="inline-input"
                    v-model="itemNoPro.name"
                    :fetch-suggestions="searchNoProFee"
                    placeholder="非生产型费用"></el-autocomplete>
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
                  <el-input :ref="'other_fee_data-'+index+'-'+indexNoPro"
                    v-model="itemNoPro.total_price"
                    placeholder="小计"
                    :disabled="!itemNoPro.name"
                    @keydown.native="focusByKeydown($event,'no_production_fee_data','other_fee_data','',index,indexNoPro)">
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
                  <el-input :class="{'error':mustFlag&&!item.transport_fee}"
                    v-model="item.transport_fee"
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
              <div class="col flex3">
                <div class="label">
                  <span class="text">成本合计</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="productTotalPrice[index]"
                    placeholder="成本合计"
                    disabled>
                    <template slot="append">元</template>
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
        <div class="title">订单费用
          <el-tooltip effect="dark"
            content="计算公式：系统报价 = 产品成本价之和 ➗ (1 - 佣金百分比 - 税率 - 预计利润百分比)"
            placement="top">
            <div class="el-icon el-icon-question"></div>
          </el-tooltip>

        </div>
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
              <el-input style="font-size:20px;"
                v-model="totalPrice"
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
              <el-input :class="{'error':mustFlag&&!quotedPriceInfo.commission_percentage}"
                v-model="quotedPriceInfo.commission_percentage"
                placeholder="请输入客户佣金百分比">
                <template slot="append">%</template>
              </el-input>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">佣金费用</div>
            <div class="info elCtn">
              <el-input style="font-size:20px;"
                v-model="commissionPrice"
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
              <el-input :class="{'error':mustFlag&&!quotedPriceInfo.rate_taxation}"
                v-model="quotedPriceInfo.rate_taxation"
                placeholder="请输入预计税率">
                <template slot="append">%</template>
              </el-input>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">税费</div>
            <div class="info elCtn">
              <el-input style="font-size:20px;"
                v-model="ratePrice"
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
              <el-input :class="{'error':mustFlag&&!quotedPriceInfo.profit_percentage}"
                v-model="quotedPriceInfo.profit_percentage"
                placeholder="请输入预计利润百分比">
                <template slot="append">%</template>
              </el-input>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">利润</div>
            <div class="info elCtn">
              <el-input style="font-size:20px;"
                v-model="profitPrice"
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
                <template slot="append">{{quotedPriceInfo.settle_unit}}</template>
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
          系统报价：<span class="blue">{{realTotalPrice}}元<span v-if="quotedPriceInfo.settle_unit!=='元'">{{'/'+realTotalPriceChange+quotedPriceInfo.settle_unit}}</span></span>
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
import { QuotedPriceInfo, QuotedPriceProduct } from '@/types/quotedPrice'
import { PackMaterialInfo, DecorateMaterialInfo } from '@/types/materialSetting'
import { moneyArr } from '@/assets/js/dictionary'
import { client, quotedPrice, yarn, sampleOrder, order } from '@/assets/js/api'
import Vue from 'vue'
import { SampleOrderInfo, SampleOrderTime } from '@/types/sampleOrder'
import { OrderInfo, OrderTime } from '@/types/order'
export default Vue.extend({
  data(): {
    [propName: string]: any
    quotedPriceInfo: QuotedPriceInfo
  } {
    return {
      loading: false,
      mustFlag: false,
      unitArr: moneyArr,
      searchQuotedPriceKey: '',
      searchLoading: false,
      searchList: [],
      postData: {
        key: '',
        token: ''
      },
      dialogImageUrl : '',
      dialogVisible :false,
      productIndex: '0', // 目前选中的产品
      quotedPriceInfo: {
        id: null,
        is_draft: 1,
        title: '',
        client_id: '',
        tree_data: [],
        contacts_id: '',
        group_id: Number(this.$getsessionStorage('group_id')) || Number(this.$getLocalStorage('group_id')) || '',
        settle_unit: '元',
        exchange_rate: '100',
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
        product_data: []
      },
      contactsList: [],
      weaveList: [{ value: '针织织造' }, { value: '梭织织造' }, { value: '制版费' }],
      searchQuotedPrice: '',
      searchQuotedPriceList: [],
      desc: '',
      showContent: false,
      quotedImage: '',
      notify: null,
      imgId: '',
      saveSuccess: true,
      saveLock: false,
      timer: '' // 导入报价单防抖定时器
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
    finishedList() {
      return this.$store.state.api.staffProcess.arr
    },
    groupList() {
      return this.$store.state.api.group.arr
    },
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    }
  },
  methods: {
    // 报价单专用的上下键处理
    focusByKeydown(ev: any, key: string, lastKey: string, nextKey: string, indexPro: number, indexChild: number) {
      if (ev.keyCode === 38) {
        if (indexChild === 0) {
          if (lastKey) {
            // @ts-ignore
            this.$refs[
              // @ts-ignore
              lastKey + '-' + indexPro + '-' + (this.quotedPriceInfo.product_data[indexPro][lastKey].length - 1)
            ][0].focus()
          }
        } else {
          // @ts-ignore
          this.$refs[key + '-' + indexPro + '-' + (indexChild - 1)][0].focus()
        }
      } else if (ev.keyCode === 40) {
        // @ts-ignore
        if (indexChild < this.quotedPriceInfo.product_data[indexPro][key].length - 1) {
          // @ts-ignore
          this.$refs[key + '-' + indexPro + '-' + (indexChild + 1)][0].focus()
        } else {
          if (nextKey) {
            // @ts-ignore
            this.$refs[nextKey + '-' + indexPro + '-0'][0].focus()
          }
        }
      }
    },
    searchQuotedPriceFn(key: string) {
      if (key) {
        this.seachLoading = true
        quotedPrice
          .list({
            page: 1,
            limit: 10,
            keyword: key
          })
          .then((res) => {
            if (res.data.status) {
              this.searchList = res.data.data.items
            }
            this.searchLoading = false
          })
      }
    },
    getImportDetail(id: number) {
      this.loading = true
      quotedPrice
        .detail({
          id: id
        })
        .then((res) => {
          if (res.data.status) {
            this.quotedPriceInfo.product_data.forEach((item) => {
              // 在赋值之前把编辑器销毁了再赋值
              item.editor.destroy()
              item.editor = null
            })
            this.quotedPriceInfo = res.data.data
            this.quotedPriceInfo.id = ''
            this.quotedPriceInfo.pid = ''
            this.getUpdateInfo()
            this.loading = false
          }
        })
    },
    changeCVOpration(flag: boolean, mark: number, imageLength: number) {
      if (this.notify) {
        this.notify.close()
        this.deletePasteImage()
      }
      if (flag) {
        this.notify = this.$notify({
          title: '警告！',
          message:
            '已开启复制粘贴图片上传功能，请勿在其余文字/数字输入框使用复制粘贴或使用ctrl+v键操作,操作完成后请关闭复制粘贴图片上传功能',
          type: 'warning',
          duration: 0,
          showClose: false
        })
        this.addPasteImage()
      }
      this.quotedPriceInfo.product_data.forEach((item, index) => {
        if (index !== mark) {
          item.cvFlag = false
        }
      })
      this.imgId = mark + 'cvImg' + imageLength
      this.$forceUpdate()
    },
    searchOtherFee(str: string, cb: Function) {
      const arr = [
        {
          value: '打样费'
        }
      ]
      cb(
        str
          ? arr.filter((item) => {
              return item.value.toLowerCase().indexOf(str.toLowerCase()) === 0
            })
          : arr
      )
    },
    searchNoProFee(str: string, cb: Function) {
      const arr = [
        {
          value: '管理费'
        }
      ]
      cb(
        str
          ? arr.filter((item) => {
              return item.value.toLowerCase().indexOf(str.toLowerCase()) === 0
            })
          : arr
      )
    },
    // 对比信息
    compareReturnInfo<T>(type: string, before: T, after: T) {
      if (type === 'image') {
      }
    },
    // 获取纱线报价
    getYarnPrice(ev: number[], info: any) {
      if (ev && ev.length > 0) {
        if (ev[0] === 2) {
          info.unit = 'm'
        }
        yarn
          .detail({
            id: ev[2]
          })
          .then((res) => {
            if (res.data.status) {
              info.price_info = res.data.data.rel_price
              info.price = Math.min(info.price_info.map((item: any) => item.price))
            }
            this.$forceUpdate()
          })
      }
    },
    // 获取报价单模板
    getModules(ev: number) {
      const finded = this.searchQuotedPriceList.find((item: any) => item.id === ev)
      this.quotedPriceInfo.product_data[this.productIndex].weave_data = JSON.parse(finded.weave_data)
      this.quotedPriceInfo.product_data[this.productIndex].semi_product_data = JSON.parse(finded.semi_product_data)
      this.quotedPriceInfo.product_data[this.productIndex].production_data = JSON.parse(finded.production_data)
      this.quotedPriceInfo.product_data[this.productIndex].pack_material_data = JSON.parse(finded.pack_material_data)
      // this.quotedPriceInfo.product_data[this.productIndex].other_fee_data = JSON.parse(finded.other_fee_data)
    },
    addPro() {
      this.$addItem(this.quotedPriceInfo.product_data, {
        cv_list: [],
        file_list: [],
        cvFlag: false,
        cvImageLength: 1,
        total_price: '',
        product_id: '',
        type: [],
        category_id: '',
        secondary_category_id: '',
        image_data: [],
        client_target_price: '',
        start_order_number: '',
        desc: '',
        editor: '',
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
            unit: 'g',
            desc: ''
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
            unit: '',
            desc: ''
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
      this.quotedPriceInfo.product_data[index].image_data.push('https://file.zwyknit.com/' + response.key)
      // @ts-ignore
      this.quotedPriceInfo.product_data[index].file_list.push({name: response.key, url: 'https://file.zwyknit.com/' + response.key})
    },
    beforeRemove(file:any, index:any, fileList:any){
      // 上传超过10M自动删除
      if(file.size && !(file.size / 1024 / 1024 < 10)){
        return
      }

      this.$confirm('即将删除图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          //执行删除操作,找到相同的删除
          let fileIndex = fileList.findIndex((item: any) => {
            if (item.id === 0 || item.id) {
              // console.log(item)
              return item.id === file.id
            } else if (item.response) {
              return item.response.key === file.response.key
            } else {
              return item.uid === file.uid
            }
          })

          this.$deleteItem(fileList, fileIndex)

          this.$message({
            type: 'success',
            message: '删除成功'
          })

          this.removeFile(file,index)
        }).catch(() => {
          this.$message({
              type: 'info',
              message: '已取消删除'
          });          
        });
        return false;
    },
    removeFile(file: { response: { hash: string; key: string }; url: string }, index: number) {
      if (this.quotedPriceInfo.product_data[index].file_list!.find((item) => item.url === file.url)) {
        this.$deleteItem(
          this.quotedPriceInfo.product_data[index].file_list!,
          this.quotedPriceInfo.product_data[index].file_list!.map((item) => item.url).indexOf(file.url)
        )
        this.$deleteItem(
          this.quotedPriceInfo.product_data[index].image_data,
          this.quotedPriceInfo.product_data[index].image_data.indexOf(file.url)
        )
      } else {
        this.$deleteItem(
          this.quotedPriceInfo.product_data[index].image_data,
          this.quotedPriceInfo.product_data[index].image_data.indexOf('https://file.zwyknit.com/' + file.response.key)
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
      this.quotedPriceInfo.id = ''
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
        item.editor = '' // 把editor清空，这里有个死循环，我都不知道死循环代码是怎么执行的，反正这个死循环提交了绝对有问题
        // 这里是创建页面，不需要在进行新旧图拼接这个操作,复制粘贴的图片也给到了image_data里面
        // item.image_data = item.file_list
        //   ? item.image_data.concat(item.file_list!.map((item) => item.url))
        //   : item.image_data // 新旧图拼接
        // item.image_data = item.cv_list ? item.cv_list.filter((item) => !!item).concat(item.image_data) : item.image_data // cv图拼接
        item.category_id = item.type && item.type[0]
        item.secondary_category_id = item.type && item.type[1]
        item.material_data.forEach((itemChild) => {
          itemChild.material_id = itemChild.tree_data && (itemChild.tree_data as number[])[2]
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
          }, 0)
      })
    },
    handlePictureCardPreview(file:any) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    saveQuotedPrice(ifCaogao: boolean) {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
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
                    {
                      key: 'unit',
                      errMsg: '物料的单位只能为g，kg或m',
                      regExp: /^g$|^m$|^kg$/,
                      regNegate: true
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
                      errMsg: '请选择产品' + (index + 1) + '装饰辅料'
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
          this.saveLock = true
          quotedPrice.create(this.quotedPriceInfo).then((res) => {
            if (res.data.status) {
              this.$message.success('创建成功')
              this.saveSuccess = true
              this.$router.push('/quotedPrice/detail?id=' + res.data.data)
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
            this.saveLock = false
          })
        } else {
          this.mustFlag = true
        }
      } else {
        this.getCmpData()
        quotedPrice.create(this.quotedPriceInfo).then((res) => {
          if (res.data.status) {
            this.saveSuccess = true
            this.$message.success('草稿保存成功')
            this.$router.push('/quotedPrice/detail?id=' + res.data.data)
          }
        })
      }
    },
    getUpdateInfo() {
      this.quotedPriceInfo.product_data.forEach((item) => {
        item.material_data.forEach((item) => {
          // @ts-ignore
          this.getYarnPrice(item.tree_data.split(','), item)
        })
      })
      this.quotedPriceInfo.tree_data = this.quotedPriceInfo.tree_data
        ? (this.quotedPriceInfo.tree_data as string).split(',').map((item) => Number(item))
        : []
      if (this.quotedPriceInfo.tree_data.length > 0) {
        this.getContacts(this.quotedPriceInfo.tree_data, true) //标记一下是初始化
      }

      this.quotedPriceInfo.product_data.forEach((item, index) => {
        this.$nextTick(() => {
          this.$initEditor(item, index)
        })
        item.file_list = item.image_data.map((itemImage, index) => {
          return {
            id: index,
            url: itemImage
          }
        })
        item.cv_list = []
        item.image_data = [] // 清空image_data数据，用于存储新的url字符串，提交的时候拼接file_list剩下的就行
        item.type = item.category_id ? [item.category_id as number, item.secondary_category_id as number] : []
        item.material_data.forEach((itemMat) => {
          itemMat.tree_data = itemMat.tree_data
            ? (itemMat.tree_data as string).split(',').map((item) => Number(item))
            : []
        })
      })
    },
    // 查看报价说明
    lookPriceDetail(type: Number[]) {
      if (type.length > 0) {
        quotedPrice
          .descDetail({
            category_id: type[0]
          })
          .then((res) => {
            if (res.data.status) {
              this.quotedImage = res.data.data.type
              this.desc = res.data.data.desc
              this.showContent = true
            } else {
              this.$message.warning('暂无说明')
            }
          })
      } else {
        this.$message.error('请先选择产品品类')
      }
    },
    dataURLtoFile(dataurl: string, filename: string) {
      var arr = dataurl.split(',')
      // @ts-ignore
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 复制粘贴图片
    // imgId,标记图片id
    pasteImage(event: any) {
      let _this = this
      // 只处理图片格式数据
      if (event.clipboardData || event.originalEvent) {
        let clipboardData = event.clipboardData || event.originalEvent.clipboardData
        if (clipboardData.items) {
          let blob
          for (let i = 0; i < clipboardData.items.length; i++) {
            if (clipboardData.items[i].type.indexOf('image') !== -1) {
              blob = clipboardData.items[i].getAsFile()
            }
          }
          let render = new FileReader()
          render.onload = function (evt: any) {
            //输出base64编码
            const base64 = evt.target.result
            const arr = _this.imgId.split('cvImg')
            // @ts-ignore
            // document
            //   .getElementById(arr[0] + 'cvImg' + _this.quotedPriceInfo.product_data[arr[0]].cvImageLength)
            //   .setAttribute('src', base64)
            var url = 'https://upload.qiniup.com/'
            var xhr = new XMLHttpRequest()
            let formData = new FormData()
            formData.append('token', _this.token)
            _this.loading = true
            // @ts-ignore
            let filename = Date.parse(new Date()) + '.jpg'
            formData.append('key', filename)
            formData.append('file', _this.dataURLtoFile(base64, filename))
            xhr.open('POST', url, true)
            xhr.send(formData)
            xhr.onreadystatechange = function () {
              _this.loading = false
              if (xhr.readyState === 4) {
                // @ts-ignore
                // document
                //   .getElementById(arr[0] + 'cvImg' + _this.quotedPriceInfo.product_data[arr[0]].cvImageLength)
                //   .setAttribute('src', 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key)
                _this.$message.success('上传成功')
                // @ts-ignore
                // _this.quotedPriceInfo.product_data[arr[0]].cv_list.push(
                //   // @ts-ignore
                //   'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                // )
                // // @ts-ignore
                // _this.quotedPriceInfo.product_data[arr[0]].cv_list.push(
                //   // @ts-ignore
                //   'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                // )
                // console.log(_this.quotedPriceInfo.product_data[arr[0]])
                // @ts-ignore
                _this.quotedPriceInfo.product_data[arr[0]].file_list.push({name: JSON.parse(xhr.responseText).key, url: 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key})
                _this.quotedPriceInfo.product_data[arr[0]].image_data.push('https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key)
                _this.quotedPriceInfo.product_data[arr[0]].cvImageLength =
                  Number(_this.quotedPriceInfo.product_data[arr[0]].cvImageLength) + 1
              }
            }
          }
          if (render.readAsDataURL && blob) {
            render.readAsDataURL(blob)
          }
        }
      }
    },
    addPasteImage() {
      document.addEventListener('paste', this.pasteImage)
    },
    deletePasteImage() {
      document.removeEventListener('paste', this.pasteImage)
    },
    // 删除复制粘贴的图片
    deleteCvImage(proIndex: number, imageIndex: number) {
      if (this.quotedPriceInfo.product_data[proIndex].cv_list![imageIndex]) {
        // @ts-ignore 标记特殊值，软删除图片，上传的时候过滤掉就行了
        this.quotedPriceInfo.product_data[proIndex].cv_list![imageIndex] = null
        this.$message.success('删除成功')
        this.$forceUpdate()
      } else {
        this.$message.error('请先上传图片')
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
        checkWhich: 'api/staffProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStaffProcessAsync'
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
    // 报价模板
    quotedPrice.settingList().then((res) => {
      if (res.data.status) {
        this.searchQuotedPriceList = res.data.data
      }
    })
    // 复制报价单 / 关联报价单
    if (this.$route.query.id) {
      this.loading = true
      quotedPrice
        .detail({
          id: Number(this.$route.query.id)
        })
        .then((res) => {
          if (res.data.status) {
            this.quotedPriceInfo.product_data.forEach((item) => {
              // 在赋值之前把编辑器销毁了再赋值
              item.editor.destroy()
              item.editor = null
            })
            this.quotedPriceInfo = res.data.data
            this.quotedPriceInfo.id = ''
            this.quotedPriceInfo.pid = this.$route.query.again
              ? this.quotedPriceInfo.pid || Number(this.$route.query.id)
              : ''
            this.getUpdateInfo()
            this.loading = false
          }
        })
    }
    // 样单转报价单逻辑
    if (this.$route.query.sampleOrderId) {
      this.loading = true
      sampleOrder
        .detail({
          id: Number(this.$route.query.sampleOrderId)
        })
        .then((res) => {
          if (res.data.status) {
            const data: SampleOrderInfo = res.data.data
            this.quotedPriceInfo.rel_order_id = Number(this.$route.query.sampleOrderId)
            this.quotedPriceInfo.tree_data = (data.tree_data as string).split(',').map((item: string) => Number(item))
            this.getContacts(this.quotedPriceInfo.tree_data as number[], true)
            this.quotedPriceInfo.contacts_id = data.contacts_id
            this.quotedPriceInfo.group_id = data.group_id
            this.quotedPriceInfo.product_data = (data.time_data as SampleOrderTime[])[
              Number(this.$route.query.sampleOrderIndex)
            ].batch_data[0].product_data
              .filter((item) => {
                // 过滤掉多个或同一批次里面相同的产品
                return !this.quotedPriceInfo.product_data.find((itemFind) => itemFind.product_id === item.product_id)
              })
              .map((item) => {
                return {
                  cv_list: [],
                  cvFlag: false,
                  total_price: '',
                  product_info: item,
                  product_id: item.product_id,
                  type: [item.category_id as number, item.secondary_category_id as number],
                  category_id: item.category_id,
                  secondary_category_id: item.secondary_category_id,
                  file_list: (item.image_data as string[]).map((itemImage, index) => {
                    return {
                      id: index,
                      url: itemImage
                    }
                  }),
                  image_data: [],
                  client_target_price: '',
                  start_order_number: '',
                  desc: item.desc,
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
                      unit: 'g',
                      price_info: [],
                      desc: ''
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
                      unit: '',
                      desc: ''
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
                      material_name: '',
                      material_id: '',
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
                }
              })
            // 如果是订单产品转报价，过滤掉其他产品
            if (this.$route.query.product_id) {
              this.quotedPriceInfo
              this.quotedPriceInfo.product_data = this.quotedPriceInfo.product_data.filter(
                (item) => Number(item.product_id) === Number(this.$route.query.product_id)
              )
            }
            // 把编辑器补上
            this.$nextTick(() => {
              this.quotedPriceInfo.product_data.forEach((item, index) => {
                if (index > 0) {
                  this.$initEditor(item, index)
                }
              })
            })
          }
          this.loading = false
        })
    }
    // 订单转报价单逻辑
    if (this.$route.query.orderId) {
      this.loading = true
      order
        .detail({
          id: Number(this.$route.query.orderId)
        })
        .then((res) => {
          if (res.data.status) {
            const data: OrderInfo = res.data.data
            this.quotedPriceInfo.rel_order_id = Number(this.$route.query.orderId)
            this.quotedPriceInfo.tree_data = (data.tree_data as string).split(',').map((item: string) => Number(item))
            this.getContacts(this.quotedPriceInfo.tree_data as number[], true)
            this.quotedPriceInfo.contacts_id = data.contacts_id
            this.quotedPriceInfo.group_id = data.group_id
            this.quotedPriceInfo.product_data = []
            // @ts-ignore filter过滤多批次重复产品
            data.time_data[0].batch_data.forEach((item) => {
              this.quotedPriceInfo.product_data = this.quotedPriceInfo.product_data.concat(
                item.product_data
                  .filter((itemCheck: any) => {
                    return !this.quotedPriceInfo.product_data.find(
                      (itemFind) => itemCheck.product_id === itemFind.product_id
                    )
                  })
                  .map((item: any) => {
                    return {
                      cv_list: [],
                      cvFlag: false,
                      total_price: '',
                      product_info: item,
                      product_id: item.product_id,
                      type: [item.category_id as number, item.secondary_category_id as number],
                      category_id: item.category_id,
                      secondary_category_id: item.secondary_category_id,
                      file_list: (item.image_data as string[]).map((itemImage, index) => {
                        return {
                          id: index,
                          url: itemImage
                        }
                      }),
                      image_data: [],
                      client_target_price: '',
                      start_order_number: '',
                      desc: item.desc,
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
                          unit: 'g',
                          price_info: [],
                          desc: ''
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
                          unit: '',
                          desc: ''
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
                          material_name: '',
                          material_id: '',
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
                    }
                  })
              )
            })
            // 如果是订单产品转报价，过滤掉其他产品
            if (this.$route.query.product_id) {
              this.quotedPriceInfo
              this.quotedPriceInfo.product_data = this.quotedPriceInfo.product_data.filter(
                (item) => Number(item.product_id) === Number(this.$route.query.product_id)
              )
            }
            // 把编辑器补上
            this.$nextTick(() => {
              this.quotedPriceInfo.product_data.forEach((item, index) => {
                if (index > 0) {
                  this.$initEditor(item, index)
                }
              })
            })
          }
          this.loading = false
        })
    }

    // 初始化编辑器
    if (this.quotedPriceInfo.product_data.length === 0 && !this.$route.query.id) {
      this.addPro()
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.saveSuccess) {
      next()
    } else {
      this.$confirm('是否离开添加页面，这会导致已填写的数据丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          next()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  },
  beforeDestroy() {
    if (this.notify) {
      this.notify.close()
    }
    this.deletePasteImage()
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
  .error {
    .el-input__inner {
      border-color: red !important;
    }
  }
}
</style>