<template>
  <div class="productEdit sidePopup"
    v-show="show">
    <div :class="inDetail?'inDetailMain main':'main'"
      v-loading="loading">
      <div class="titleCtn">
        <span class="text">{{edit?"修改产品":"添加新产品"}}
          <el-checkbox v-if="!edit"
            v-model="repeatAdd">{{repeatAdd?'关闭连续添加':'开启连续添加'}}
          </el-checkbox>
        </span>
        <div class="closeCtn"
          @click="close">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn">
        <!-- 新增保存产品并入库模块 -->
        <template v-if="ifStore">
          <div class="stepCtn">
            <div class="step"
              :class="{'active':step===1}">
              <div class="circle">
                <span class="white">1</span>
              </div>
              <div class="name">添加产品</div>
            </div>
            <div class="step"
              :class="{'active':step===2}">
              <div class="circle">
                <span class="white">2</span>
              </div>
              <div class="name">录入库存</div>
            </div>
          </div>
        </template>
        <template v-if="step===1">
          <div class="module">
            <div class="titleCtn">
              <div class="title"
                style="display: flex;align-items: center;">导入已有产品
                <el-switch style="margin-left:8px"
                  v-model="need_import">
                </el-switch>
              </div>
            </div>
            <div class="editCtn"
              v-show="need_import">
              <div class="row">
                <div class="col">
                  <div class="label">搜索产品号查询</div>
                  <div class="info elCtn">
                    <el-input placeholder="输入产品号查询"
                      v-model="searchProductCode"
                      @keydown.enter.native="searchProduct">
                      <el-button slot="append"
                        icon="el-icon-search"
                        @click="searchProduct"></el-button>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">搜索订单号查询</div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入订单号查询"
                      v-model="searchOrderCode"
                      @keydown.enter.native="searchProduct">
                      <el-button slot="append"
                        icon="el-icon-search"
                        @click="searchProduct"></el-button>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">查询结果</div>
                  <div class="noData"
                    v-if="searchList.length===0">暂无查询结果</div>
                  <div class="searchCtn">
                    <div class="once">
                      <el-radio-group v-model="productId"
                        @change="getImport">
                        <el-radio v-for="item in searchList"
                          :key="item.id"
                          :label="item.id">{{item.product_code || item.system_code}}</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="module">
            <div class="titleCtn">
              <div class="title">基本信息</div>
            </div>
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">产品编号</span>
                    <span class="explanation">(不填由系统生成)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入产品编号"
                      v-model="productInfo.product_code"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">客户款号</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入客户款号"
                      v-model="productInfo.style_code"></el-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">产品名称</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入产品名称"
                      v-model="productInfo.name"></el-input>
                  </div>
                </div>
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
                      content="添加新品类"
                      placement="top">
                      <i class="el-icon-upload hoverOrange fr"
                        style="line-height:38px;font-size:18px;cursor:pointer;"
                        @click="$openUrl('/setting?pName=产品设置&cName=品类')"></i>
                    </el-tooltip>
                  </div>
                  <div class="info elCtn">
                    <el-cascader placeholder="请选择品类"
                      v-model="productInfo.type"
                      :options="productTypeList"
                      @change="getUnit"></el-cascader>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">默认单位</span>
                    <span class="explanation">(系统默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="选择品类后生成"
                      v-model="productInfo.unit"
                      disabled>
                    </el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">产品款式</span>
                    <span class="explanation">(必选)</span>
                    <el-tooltip class="item"
                      effect="dark"
                      content="设置成功后请点击此按钮刷新数据"
                      placement="top">
                      <i class="el-icon-refresh hoverGreen fr"
                        style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                        @click="$checkCommonInfo([{
                        checkWhich: 'api/productStyle',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getProductStyleAsync',
                        forceUpdate:true
                      }])"></i>
                    </el-tooltip>
                    <el-tooltip class="item"
                      effect="dark"
                      content="添加新款式"
                      placement="top">
                      <i class="el-icon-upload hoverOrange fr"
                        style="line-height:38px;font-size:18px;cursor:pointer;"
                        @click="$openUrl('/setting?pName=产品设置&cName=款式')"></i>
                    </el-tooltip>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择产品款式"
                      v-model="productInfo.style_data"
                      multiple>
                      <el-option v-for="item in productStyleList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in productInfo.color_data"
                :key="index">
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">产品配色组</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-autocomplete class="inline-input"
                      v-model="item.name"
                      :fetch-suggestions="searchColour"
                      placeholder="请输入产品配色"></el-autocomplete>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="index===0"
                  @click="$addItem(productInfo.color_data,{
                  id:'',
                  name:''
                })">添加</div>
                <div class="opr hoverRed"
                  v-if="index>0"
                  @click="$deleteItem(productInfo.color_data,index)">删除</div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">产品图片
                      <el-checkbox v-model="productInfo.cvFlag"
                        @change="changeCVOpration">{{productInfo.cvFlag?'关闭复制粘贴图片上传功能':'开启复制粘贴图片上传功能'}}
                      </el-checkbox>
                    </span>
                  </div>
                  <div class="cvImageCtn"
                    v-show="productInfo.cvFlag || productInfo.cv_list.length>0">
                    <div class="cvImage"
                      v-for="indexImage of productInfo.cvImageLength"
                      :key="indexImage">
                      <template v-if="productInfo.cv_list[indexImage-1]!==null">
                        <img :id="'cvImg'+indexImage"
                          :src="require('@/assets/image/common/cv.png')">
                        <i class="icon el-icon-close"
                          @click="deleteCvImage(indexImage-1)"></i>
                      </template>
                    </div>
                  </div>
                  <div class="fileCtn">
                    <el-upload class="upload"
                      action="https://upload.qiniup.com/"
                      accept="image/jpeg,image/gif,image/png,image/bmp"
                      :before-upload="beforeAvatarUpload"
                      :data="postData"
                      :file-list="productInfo.file_list"
                      :on-remove="removeFile"
                      :on-success="successFile"
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
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">产品其它描述或备注</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="productInfo.desc"
                      placeholder="请输入产品其它描述或备注"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="module">
            <div class="titleCtn">
              <div class="title">大身信息</div>
            </div>
            <div class="editCtn">
              <div class="row"
                v-for="(item,index) in productInfo.component_data"
                :key="'Component' + index">
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">大身成分</span>
                    <el-tooltip class="item"
                      effect="dark"
                      content="设置成功后请点击此按钮刷新数据"
                      placement="top">
                      <i class="el-icon-refresh hoverGreen fr"
                        style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                        @click="$checkCommonInfo([{
                        checkWhich: 'api/ingredient',
                        getInfoMethed: 'dispatch',
                        getInfoApi: 'getIngredientAsync',
                        forceUpdate:true
                      }])"></i>
                    </el-tooltip>
                    <el-tooltip class="item"
                      effect="dark"
                      content="添加新成分"
                      placement="top">
                      <i class="el-icon-upload hoverOrange fr"
                        style="line-height:38px;font-size:18px;cursor:pointer;"
                        @click="$openUrl('/setting?pName=产品设置&cName=成分')"></i>
                    </el-tooltip>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择成分"
                      v-model="item.component_id">
                      <el-option v-for="item in ingredientList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">成分比例</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入成分比例"
                      v-model="item.number">
                      <template slot="append">%</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="index===0"
                  @click="$addItem(productInfo.component_data,{component_id:'',number:''})">添加</div>
                <div class="opr hoverRed"
                  v-if="index>0"
                  @click="$deleteItem(productInfo.component_data,index)">删除</div>
              </div>
              <div class="row"
                v-for="(item,index) in productInfo.size_data"
                :key="'Size' + index">
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">大身尺码</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-autocomplete class="inline-input"
                          v-model="item.size_name"
                          :fetch-suggestions="searchSize"
                          placeholder="输入大身尺码"></el-autocomplete>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">大身克重</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="大身克重"
                          v-model="item.weight">
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">大身尺寸</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="大身尺寸"
                          v-model="item.size_info">
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="index===0"
                  @click="addSize">添加</div>
                <div class="opr hoverRed"
                  v-if="index>0"
                  @click="deleteSize(index)">删除</div>
              </div>
            </div>
          </div>
          <div class="module">
            <div class="titleCtn flexBetween">
              <div class="title"
                style="display: flex;align-items: center;">配件信息
                <el-switch style="margin-left:8px"
                  v-model="have_part">
                </el-switch>
              </div>
              <div class="btn borderBtn blue"
                @click="addPart"
                v-show="have_part">新增配件</div>
            </div>
            <div class="editCtn"
              v-show="have_part">
              <div class="partCtn"
                v-for="(item,index) in productInfo.part_data"
                :key="index">
                <div class="row">
                  <div class="col">
                    <div class="label">
                      <span class="text"><span class="mark"
                          v-if="productInfo.part_data.length>1">{{index+1}}</span>配件名称</span>
                      <span class="explanation">(必填)</span>
                      <span class="fr hoverRed"
                        @click="$deleteItem(productInfo.part_data,index)">删除此配件</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="请输入配件名称"
                        v-model="item.name"></el-input>
                    </div>
                  </div>
                  <div class="col">
                    <div class="label">
                      <span class="text">配件单位</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="请输入配件单位"
                        v-model="item.unit"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row"
                  v-for="(itemComponent,indexComponent) in item.part_component_data"
                  :key="'Component' + indexComponent">
                  <div class="col">
                    <div class="label"
                      v-if="indexComponent===0">
                      <span class="text">配件成分</span>
                    </div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择成分"
                        v-model="itemComponent.component_id">
                        <el-option v-for="item in ingredientList"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="col">
                    <div class="label"
                      v-if="indexComponent===0">
                      <span class="text">成分比例</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="请输入成分比例"
                        v-model="itemComponent.number">
                        <template slot="append">%</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="opr hoverBlue"
                    v-if="indexComponent===0"
                    @click="$addItem(item.part_component_data,{component_id:'',number:''})">添加</div>
                  <div class="opr hoverRed"
                    v-if="indexComponent>0"
                    @click="$deleteItem(item.part_component_data,index)">删除</div>
                </div>
                <div class="row"
                  v-for="index in productInfo.size_data.length"
                  :key="'Size' + index">
                  <div class="col">
                    <div class="spaceBetween">
                      <div class="once">
                        <div class="label"
                          v-if="index===1">
                          <span class="text">配件尺码</span>
                          <span class="explanation">(必选)</span>
                        </div>
                        <div class="info elCtn">
                          <el-autocomplete class="inline-input"
                            v-model="productInfo.size_data[index-1].size_name"
                            :fetch-suggestions="searchSize"
                            placeholder="同大身尺码"
                            disabled></el-autocomplete>
                        </div>
                      </div>
                      <div class="once">
                        <div class="label"
                          v-if="index===1">
                          <span class="text">配件克重</span>
                        </div>
                        <div class="info elCtn">
                          <el-input placeholder="配件克重"
                            v-model="item.part_size_data[index-1].weight">
                          </el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="spaceBetween">
                      <div class="once">
                        <div class="label"
                          v-if="index===1">
                          <span class="text">配件尺寸</span>
                        </div>
                        <div class="info elCtn">
                          <el-input placeholder="配件尺寸"
                            v-model="item.part_size_data[index-1].size_info">
                          </el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="step===2">
          <div class="module">
            <div class="titleCtn">
              <div class="title">入库信息</div>
            </div>
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">入库产品信息</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="默认"
                      v-model="stockProInfo"
                      disabled></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">入库仓库</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader :options="storeArr"
                      placeholder="请选择仓库"
                      v-model="productStockInfo.store_arr"
                      @change="(ev)=>{productStockInfo.store_id=ev[0];productStockInfo.secondary_store_id=ev[1]}"></el-cascader>
                  </div>
                </div>
              </div>
              <div class="row"
                v-for="(item,index) in productStockInfo.info_data"
                :key="index">
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">尺码颜色</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="尺码颜色"
                      v-model="item.color_size">
                      <el-option v-for="item in sizeColorList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">入库数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="入库数量"
                      v-model="item.number"></el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="index===0"
                  @click="$addItem(productStockInfo.info_data,{
                    product_id: '',
                    size_id: '',
                    color_id: '',
                    color_size: '',
                    price: '',
                    number: ''
                  })">添加</div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(productStockInfo.info_data,index)">删除</div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">入库时间</span>
                    <span class="explanation">(默认)</span>
                  </div>
                  <div class="info elCtn">
                    <el-date-picker style="width:100%"
                      class="once"
                      placeholder="操作日期"
                      value-format="yyyy-MM-dd"
                      v-model="productStockInfo.complete_time"></el-date-picker>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">备注信息</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="备注信息"
                      v-model="productStockInfo.desc"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="close">取消</span>
        <span class="btn"
          :class="{'backHoverBlue':!id&&!data,'backHoverOrange':id||data}"
          @click="saveProduct"
          v-if="!ifStore">{{!id&&!data?'确认添加':'确认修改'}}</span>
        <span class="btn"
          :class="{'backHoverOrange':step===1,'backHoverBlue':step===2}"
          v-if="ifStore"
          @click="step===1?saveProduct():saveProductStock()">
          {{step===1?'下一步':'确认入库'}}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProductStockInfo } from '@/types/productStock'
import { ProductInfo } from '@/types/product'
import { CascaderInfo } from '@/types/vuex'
import { product, productStock, store } from '@/assets/js/api'
export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    ifStore: {
      type: Boolean,
      required: false
    },
    inDetail: {
      type: Boolean,
      required: false
    },
    edit: {
      type: Boolean,
      required: false
    },
    // 这个参数用于保存后是否清空数据
    afterSaveClear: {
      type: Boolean,
      required: false,
      default: true
    },
    // 修改产品用
    id: {
      type: [Number, String],
      required: false
    },
    // 样品转产品用
    pid: {
      type: [Number, String],
      required: false
    },
    pid_status: {
      type: [Number],
      required: false
    },
    // 修改产品用
    data: {
      required: false
    },
    // 报价单初始化样品用,该参数和修改样品的参数互斥
    quote_product_id: {
      type: [Number, String],
      required: false
    },
    // 报价单描述信息
    quote_rel_product_data: {
      required: false
    }
  },
  data(): {
    productStockInfo: ProductStockInfo
    searchList: ProductInfo[]
    productInfo: ProductInfo
    [propName: string]: any
  } {
    return {
      loading: false,
      have_part: false,
      need_import: false,
      repeatAdd: false, // 连续添加产品
      step: 1,
      notify: '',
      searchOrderCode: '', // 搜产单编号导入
      searchProductCode: '', // 搜产品编号导入
      searchList: [],
      productId: '',
      sizeList: [],
      postData: {
        key: '',
        token: ''
      },
      productInfo: {
        id: null,
        product_type: 1,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category_id: '',
        secondary_category_id: '',
        type: [], // 品类下拉框
        image_data: [],
        file_list: [],
        cv_list: [],
        cvFlag: false,
        cvImageLength: 1,
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
            id: '',
            size_name: '',
            size_id: '',
            size_info: '',
            weight: ''
          }
        ], // 尺码组
        color_data: [
          {
            id: '',
            name: ''
          }
        ], // 配色组
        // 配件信息
        part_data: [
          {
            name: '',
            unit: '',
            part_size_data: [
              {
                id: '',
                size_name: '',
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
      productStockInfo: {
        action_type: 1,
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
        store_arr: [], // 前端下拉框用
        info_data: [
          {
            product_id: '',
            size_id: '',
            color_id: '',
            price: '',
            number: '',
            color_size: ''
          }
        ]
      },
      sizeColorList: [],
      stockProId: '',
      stockProInfo: '', // 出入库展示用
      storeArr: []
    }
  },
  computed: {
    token(): string {
      return this.$store.state.status.token
    },
    productTypeList(): CascaderInfo[] {
      return this.$store.state.api.productType.arr
    },
    ingredientList(): Array<{ name: string; id: number }> {
      return this.$store.state.api.ingredient.arr
    },
    colourList(): Array<{ value: string; label: string }> {
      return this.$store.state.api.colour.arr.map((item: { name: any }) => {
        return {
          value: item.name,
          label: item.name
        }
      })
    },
    productStyleList(): Array<{ name: string; id: number }> {
      return this.$store.state.api.productStyle.arr
    }
  },
  watch: {
    // 打开产品详情窗口之前需要获取产品详情
    show(val) {
      if (val) {
        if (this.quote_product_id) {
          this.productInfo.quote_product_id = this.quote_product_id
          const quotedPriceProductInfo = this.quote_rel_product_data as ProductInfo
          this.productInfo.type = [
            quotedPriceProductInfo.category_id as number,
            quotedPriceProductInfo.secondary_category_id as number
          ]
          this.getUnit(this.productInfo.type)
          this.productInfo.desc = quotedPriceProductInfo.desc
          this.productInfo.file_list = quotedPriceProductInfo.image_data.map((item, index) => {
            return {
              id: index,
              url: item
            }
          })
          this.productInfo.cv_list = []
          this.productInfo.image_data = []
        } else {
          if (this.data) {
            this.changeDetailToEdit(this.data)
          } else {
            if (this.id) {
              this.getImport(Number(this.id))
            }
          }
        }
      } else {
        if (this.notify) {
          this.notify.close()
        }
        this.deletePasteImage()
      }
    }
  },
  methods: {
    searchColour(str: string, cb: any) {
      let results = str ? this.colourList.filter(this.createFilter(str)) : this.colourList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    searchSize(str: string, cb: any) {
      let results = str ? this.sizeList.filter(this.createFilter(str)) : this.sizeList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    searchProduct() {
      if (this.searchProductCode || this.searchOrderCode) {
        this.loading = true
        product
          .list({
            limit: 99,
            page: 1,
            product_type: 1,
            product_code: this.searchProductCode,
            order_code: this.searchOrderCode
          })
          .then((res) => {
            if (res.data.status) {
              this.searchList = res.data.data.items
            }
            this.loading = false
          })
      }
    },
    getImport(ev: number) {
      this.loading = true
      product
        .detail({
          id: ev
        })
        .then((res) => {
          const data = res.data.data
          this.changeDetailToEdit(data)
          this.loading = false
        })
    },
    close() {
      this.$emit('close', this.productInfo)
      this.reset()
    },
    getUnit(ev: number[]) {
      const finded = this.productTypeList.find((item) => item.value === ev[0])
      this.sizeList = finded!.size?.map((item) => {
        return {
          value: item.name
        }
      })
      this.productInfo.unit = finded!.unit!
    },
    // 尺码的逻辑包含大身+配件尺码的添加&删除
    addSize() {
      this.$addItem(this.productInfo.size_data, { id: '', size_name: '', size_id: '', weight: '', size_info: '' })
      this.productInfo.part_data.forEach((item) => {
        this.$addItem(item.part_size_data!, { id: '', size_name: '', size_id: '', weight: '', size_info: '' })
      })
    },
    deleteSize(index: number) {
      this.$deleteItem(this.productInfo.size_data, index)
      this.productInfo.part_data.forEach((item) => {
        this.$deleteItem(item.part_size_data!, index)
      })
    },
    addPart() {
      this.$addItem(this.productInfo.part_data, {
        name: '',
        unit: '',
        part_size_data: this.productInfo.size_data.map(() => {
          return {
            id: '',
            size_name: '',
            size_id: '',
            size_info: '',
            weight: ''
          }
        }),
        part_component_data: [
          {
            component_id: '',
            number: '' // 成分信息
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
    successFile(response: { hash: string; key: string }) {
      this.productInfo.image_data.push('https://file.zwyknit.com/' + response.key)
    },
    removeFile(file: { response: { hash: string; key: string }; url: string }) {
      if (this.productInfo.file_list!.find((item) => item.url === file.url)) {
        this.$deleteItem(
          this.productInfo.file_list!,
          this.productInfo.file_list!.map((item) => item.url).indexOf(file.url)
        )
      } else {
        this.$deleteItem(
          this.productInfo.image_data,
          this.productInfo.image_data.indexOf('https://file.zwyknit.com/' + file.response.key)
        )
      }
    },
    getCmpData() {
      if ((this.id || this.data) && this.edit) {
        this.productInfo.id = this.id || (this.data as ProductInfo).id
      } else {
        this.productInfo.id = null
      }
      this.productInfo.category_id = this.productInfo.type![0]
      this.productInfo.secondary_category_id = this.productInfo.type![1]
      this.productInfo.image_data = this.productInfo.image_data.concat(
        this.productInfo.file_list!.map((item) => item.url)
      ) // 新旧图拼接
      this.productInfo.image_data = this.productInfo.cv_list
        ? this.productInfo.cv_list.filter((item) => !!item).concat(this.productInfo.image_data)
        : this.productInfo.image_data // cv图拼接
      if (this.have_part) {
        this.productInfo.part_data.forEach((item) => {
          item.part_size_data!.forEach((itemChild, indexChild) => {
            itemChild.size_name = this.productInfo.size_data[indexChild].size_name
            itemChild.size_id = this.productInfo.size_data[indexChild].size_id
          })
        })
      } else {
        this.productInfo.part_data = []
      }
    },
    saveProduct() {
      this.$emit('beforeSave', this.productInfo)
      console.log(this.productInfo)
      const formCheck =
        this.$formCheck(this.productInfo, [
          {
            key: 'type',
            errMsg: '请选择产品品类',
            regNormal: 'checkArr'
          },
          {
            key: 'style_data',
            errMsg: '请选择产品款式',
            regNormal: 'checkArr'
          }
        ]) ||
        this.productInfo.color_data.some((item: any) => {
          return this.$formCheck(item, [
            {
              key: 'name',
              errMsg: '请输入产品配色组'
            }
          ])
        }) ||
        this.productInfo.size_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'size_name',
              errMsg: '请选择大身尺码'
            },
            {
              key: 'weight',
              errMsg: '请输入大身克重'
            },
            {
              key: 'size_info',
              errMsg: '请输入大身尺寸'
            }
          ])
        })
      let partFormCheck: boolean = false
      if (this.have_part && !formCheck) {
        partFormCheck = this.productInfo.part_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'name',
              errMsg: '请输入配件名称'
            },
            {
              key: 'unit',
              errMsg: '请输入配件单位'
            }
          ])
        })
      }
      this.getCmpData()
      if (!formCheck && !partFormCheck) {
        this.loading = true
        product.create(this.productInfo).then((res) => {
          if (res.data.status) {
            this.$message.success(this.eidt ? '修改成功' : '添加成功')
            this.$emit('afterSave', res.data.data)
            if (this.ifStore) {
              this.sizeColorList = []
              const proInfo: ProductInfo = res.data.data
              this.stockProId = proInfo.id
              this.stockProInfo = proInfo.product_code
              proInfo.size_data.forEach((itemSize) => {
                proInfo.color_data.forEach((itemColor: any) => {
                  this.sizeColorList.push({
                    value: itemSize.id + '/' + itemColor.id,
                    label: itemSize.name + '/' + itemColor.name
                  })
                })
              })
              this.step = 2
            } else {
              if (this.afterSaveClear) {
                this.reset()
              }
              if (!this.repeatAdd) {
                this.$emit('close', res.data.data)
              }
            }
          }
          this.loading = false
        })
      }
    },
    reset() {
      this.need_import = false
      this.searchList = []
      this.productInfo = {
        id: null,
        product_type: 1,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category_id: '',
        secondary_category_id: '',
        type: [], // 品类下拉框
        image_data: [],
        file_list: [],
        cv_list: [],
        cvFlag: false,
        cvImageLength: 1,
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
            id: '',
            size_name: '',
            size_id: '',
            size_info: '',
            weight: ''
          }
        ], // 尺码组
        color_data: [
          {
            id: '',
            name: ''
          }
        ], // 配色组
        // 配件信息
        part_data: [
          {
            name: '',
            unit: '',
            part_size_data: [
              {
                id: '',
                size_name: '',
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
      }
      if (this.notify) {
        this.notify.close()
      }
      this.deletePasteImage()
    },
    changeDetailToEdit(data: any) {
      this.productInfo = {
        id: this.pid ? null : this.id, // 打样的时候id用于查询样品，还得新建产品
        pid: this.pid,
        pid_status: this.pid ? this.pid_status : null,
        product_type: 1,
        name: data.name,
        product_code: data.product_code,
        style_code: data.style_code,
        unit: data.unit,
        category_id: data.category_id,
        secondary_category_id: data.secondary_category_id,
        type: [data.category_id, data.secondary_category_id],
        image_data: [],
        file_list: data.image_data.map((item: any, index: number) => {
          return {
            id: index,
            url: item
          }
        }),
        cv_list: [],
        cvFlag: false,
        cvImageLength: 1,
        desc: data.desc,
        style_data: data.style_data.map((item: any) => item.id),
        component_data: data.component_data.map((item: any) => {
          return {
            component_id: item.id,
            number: item.number
          }
        }),
        size_data: data.size_data.map((item: any) => {
          return {
            id: item.id,
            size_name: item.name,
            size_info: item.size_info,
            weight: item.weight
          }
        }), // 尺码组
        color_data: data.color_data, // 配色组
        // 配件信息
        part_data: data.part_data.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            unit: item.unit,
            part_size_data: item.part_size_data
              ? item.part_size_data.map((item: any) => {
                  return {
                    size_name: item.name,
                    size_id: item.id,
                    size_info: item.size_info,
                    weight: item.weight
                  }
                })
              : [
                  {
                    size_name: '',
                    size_id: '',
                    size_info: '',
                    weight: ''
                  }
                ],
            part_component_data: item.part_component_data
              ? item.part_component_data.map((item: any) => {
                  return {
                    component_id: item.id,
                    number: item.number
                  }
                })
              : [
                  {
                    component_id: '',
                    number: '' // 成分信息
                  }
                ]
          }
        })
      }
      this.have_part = this.productInfo.part_data.length > 0
      this.getUnit([data.category_id as number, data.secondary_category_id as number])
    },
    getCmpStockData() {
      this.productStockInfo.info_data.forEach((item) => {
        item.product_id = this.stockProId
        item.size_id = item.color_size!.split('/')[0]
        item.color_id = item.color_size!.split('/')[1]
      })
    },
    // 保存入库数据
    saveProductStock() {
      const formCheck =
        this.$formCheck(this.productStockInfo, [
          {
            key: 'store_arr',
            errMsg: '请选择入库仓库',
            regNormal: 'checkArr'
          }
        ]) ||
        this.productStockInfo.info_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'color_size',
              errMsg: '请选择尺码颜色'
            },
            {
              key: 'number',
              errMsg: '请输入入库数量'
            }
          ])
        })
      if (!formCheck) {
        this.loading = true
        this.getCmpStockData()
        productStock.create(this.productStockInfo).then((res) => {
          if (res.data.status) {
            this.reset()
            this.$message.success('入库成功')
            this.$emit('afterStockSave', res.data.data)
            this.productStockInfo = {
              action_type: 1,
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
                  color_size: '',
                  number: ''
                }
              ]
            }
            this.loading = false
          }
        })
      }
    },
    getStore() {
      store
        .list({
          store_type: 5
        })
        .then((res) => {
          if (res.data.status) {
            this.storeArr = res.data.data.map((item: any) => {
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
    },
    // 打开复制粘贴图片功能
    changeCVOpration(flag: boolean) {
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
      this.$forceUpdate()
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
            // @ts-ignore
            document.getElementById('cvImg' + _this.productInfo.cvImageLength).setAttribute('src', base64)
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
                _this.$message.success('上传成功')
                // @ts-ignore
                _this.productInfo.cv_list.push(
                  // @ts-ignore
                  'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                )
                _this.productInfo.cvImageLength = Number(_this.productInfo.cvImageLength) + 1
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
    deleteCvImage(imageIndex: number) {
      if (this.productInfo.cv_list![imageIndex]) {
        // @ts-ignore 标记特殊值，软删除图片，上传的时候过滤掉就行了
        this.productInfo.cv_list[imageIndex] = null
        this.$message.success('删除成功')
        this.$forceUpdate()
      } else {
        this.$message.error('请先上传图片')
      }
    }
  },
  mounted() {
    if (this.ifStore) {
      this.getStore()
    }
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
        checkWhich: 'api/ingredient',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getIngredientAsync'
      },
      {
        checkWhich: 'api/colour',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getColourAsync'
      },
      {
        checkWhich: 'api/productStyle',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getProductStyleAsync'
      }
    ])
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
@import './productEdit.less';
</style>