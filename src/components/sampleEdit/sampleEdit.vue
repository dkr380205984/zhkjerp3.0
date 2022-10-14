<template>
  <div class="sampleEdit sidePopup" v-if="show">
    <div :class="inDetail ? 'inDetailMain main' : 'main'" v-loading="loading">
      <div class="titleCtn">
        <span class="text"
          >{{ edit ? '修改样品' : '添加新样品' }}
          <el-checkbox v-if="!edit" v-model="repeatAdd">{{ repeatAdd ? '关闭连续添加' : '开启连续添加' }} </el-checkbox>
        </span>
        <div class="closeCtn" @click="close">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn">
        <div class="module">
          <div class="titleCtn">
            <div class="title" style="display: flex; align-items: center">
              导入已有样品
              <el-switch style="margin-left: 8px" v-model="need_import"> </el-switch>
            </div>
          </div>
          <div class="editCtn" v-show="need_import">
            <div class="row">
              <div class="col">
                <div class="label">搜索样品号查询</div>
                <div class="info elCtn">
                  <el-input
                    placeholder="输入样品号查询"
                    v-model="searchSampleCode"
                    @keydown.enter.native="searchSample"
                  >
                    <el-button slot="append" icon="el-icon-search" @click="searchSample"></el-button>
                  </el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">搜索样单号查询</div>
                <div class="info elCtn">
                  <el-input
                    placeholder="请输入样单号查询"
                    v-model="searchSampleOrderCode"
                    @keydown.enter.native="searchSample"
                  >
                    <el-button slot="append" icon="el-icon-search" @click="searchSample"></el-button>
                  </el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">查询结果</div>
                <div class="noData" v-if="searchList.length === 0">暂无查询结果</div>
                <div class="searchCtn">
                  <div class="once">
                    <el-radio-group v-model="sampleId" @change="getImport">
                      <el-radio v-for="item in searchList" :key="item.id" :label="item.id">{{
                        item.product_code || item.system_code
                      }}</el-radio>
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
                  <span class="text">样品编号</span>
                  <span class="explanation">(不填由系统生成)</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入样品编号" v-model="sampleInfo.product_code"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">客户款号</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入客户款号" v-model="sampleInfo.style_code"></el-input>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">样品名称</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入样品名称" v-model="sampleInfo.name"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">样品品类</span>
                  <span class="explanation">(必选)</span>
                  <el-tooltip class="item" effect="dark" content="设置成功后请点击此按钮刷新数据" placement="top">
                    <i
                      class="el-icon-refresh hoverGreen fr"
                      style="line-height: 38px; font-size: 18px; margin-left: 8px; cursor: pointer"
                      @click="
                        $checkCommonInfo([
                          {
                            checkWhich: 'api/productType',
                            getInfoMethed: 'dispatch',
                            getInfoApi: 'getProductTypeAsync',
                            forceUpdate: true
                          }
                        ])
                      "
                    ></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="添加新品类" placement="top">
                    <i
                      class="el-icon-upload hoverOrange fr"
                      style="line-height: 38px; font-size: 18px; cursor: pointer"
                      @click="$openUrl('/setting?pName=产品设置&cName=品类')"
                    ></i>
                  </el-tooltip>
                </div>
                <div class="info elCtn" :class="{ error: mustFlag && !sampleInfo.type }">
                  <el-cascader
                    placeholder="请选择品类"
                    v-model="sampleInfo.type"
                    :options="productTypeList"
                    @change="getUnit"
                  ></el-cascader>
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
                  <el-input placeholder="选择品类后生成" v-model="sampleInfo.unit" disabled> </el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">样品款式</span>
                  <span class="explanation">(必选)</span>
                  <el-tooltip class="item" effect="dark" content="设置成功后请点击此按钮刷新数据" placement="top">
                    <i
                      class="el-icon-refresh hoverGreen fr"
                      style="line-height: 38px; font-size: 18px; margin-left: 8px; cursor: pointer"
                      @click="
                        $checkCommonInfo([
                          {
                            checkWhich: 'api/productStyle',
                            getInfoMethed: 'dispatch',
                            getInfoApi: 'getProductStyleAsync',
                            forceUpdate: true
                          }
                        ])
                      "
                    ></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="添加新款式" placement="top">
                    <i
                      class="el-icon-upload hoverOrange fr"
                      style="line-height: 38px; font-size: 18px; cursor: pointer"
                      @click="$openUrl('/setting?pName=产品设置&cName=款式')"
                    ></i>
                  </el-tooltip>
                </div>
                <div class="info elCtn">
                  <el-select
                    :class="{ error: mustFlag && sampleInfo.style_data.length === 0 }"
                    placeholder="请选择样品款式"
                    v-model="sampleInfo.style_data"
                    multiple
                  >
                    <el-option
                      v-for="item in productStyleList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="row" v-for="(item, index) in sampleInfo.color_data" :key="index">
              <div class="col">
                <div class="label" v-if="index === 0">
                  <span class="text">样品配色组</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-autocomplete
                    :class="{ error: mustFlag && !item.name }"
                    class="inline-input"
                    v-model="item.name"
                    :fetch-suggestions="searchColour"
                    placeholder="请输入样品配色"
                  ></el-autocomplete>
                </div>
              </div>
              <div
                class="opr hoverBlue"
                v-if="index === 0"
                @click="
                  $addItem(sampleInfo.color_data, {
                    id: '',
                    name: ''
                  })
                "
              >
                添加
              </div>
              <div class="opr hoverRed" v-if="index > 0 && !item.id" @click="$deleteItem(sampleInfo.color_data, index)">
                删除
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text"
                    >样品
                    <el-checkbox v-model="sampleInfo.cvFlag" @change="changeCVOpration"
                      >{{ sampleInfo.cvFlag ? '关闭复制粘贴图片上传功能' : '开启复制粘贴图片上传功能' }}
                    </el-checkbox>
                  </span>
                </div>
                <div class="cvImageCtn" v-show="sampleInfo.cvFlag || sampleInfo.cv_list.length > 0">
                  <div class="cvImage" v-for="indexImage of sampleInfo.cvImageLength" :key="indexImage">
                    <template v-if="sampleInfo.cv_list[indexImage - 1] !== null">
                      <img :id="'cvImg' + indexImage" :src="require('@/assets/image/common/cv.png')" />
                      <i class="icon el-icon-close" @click="deleteCvImage(indexImage - 1)"></i>
                    </template>
                  </div>
                </div>
                <div class="info imgInfo">
                  <el-upload
                    class="upload"
                    action="https://upload.qiniup.com/"
                    accept="image/jpeg,image/gif,image/png,image/bmp"
                    :before-upload="beforeAvatarUpload"
                    :data="postData"
                    :file-list="sampleInfo.file_list"
                    :before-remove="beforeRemove"
                    :on-success="successFile"
                    :on-preview="handlePictureCardPreview"
                    ref="uploada"
                    list-type="picture-card"
                  >
                    <div class="uploadBtn">
                      <i class="el-icon-upload"></i>
                      <span>上传图片</span>
                    </div>
                    <div slot="tip" class="el-upload__tip">
                      只能上传jpg/png图片文件，且不超过10M(请勿上传带特殊字符的图片)
                    </div>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible" append-to-body>
                    <img width="100%" :src="dialogImageUrl" alt="" />
                  </el-dialog>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">样品其它描述或备注</span>
                </div>
                <div id="editor" style="z-index: 0; position: relative"></div>
              </div>
            </div>
            <div class="row" v-if="ifIdea">
              <div class="col">
                <div class="label">
                  <span class="text">修改意见</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="sampleInfo.client_edit_idea" placeholder="请输入修改意见"></el-input>
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
            <div class="row" v-for="(item, index) in sampleInfo.component_data" :key="'Component' + index">
              <div class="col">
                <div class="label" v-if="index === 0">
                  <span class="text">大身成分</span>
                  <el-tooltip class="item" effect="dark" content="设置成功后请点击此按钮刷新数据" placement="top">
                    <i
                      class="el-icon-refresh hoverGreen fr"
                      style="line-height: 38px; font-size: 18px; margin-left: 8px; cursor: pointer"
                      @click="
                        $checkCommonInfo([
                          {
                            checkWhich: 'api/ingredient',
                            getInfoMethed: 'dispatch',
                            getInfoApi: 'getIngredientAsync',
                            forceUpdate: true
                          }
                        ])
                      "
                    ></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="添加新成分" placement="top">
                    <i
                      class="el-icon-upload hoverOrange fr"
                      style="line-height: 38px; font-size: 18px; cursor: pointer"
                      @click="$openUrl('/setting?pName=产品设置&cName=成分')"
                    ></i>
                  </el-tooltip>
                </div>
                <div class="info elCtn">
                  <el-autocomplete
                    class="inline-input"
                    v-model="item.component_name"
                    :fetch-suggestions="searchIngredient"
                    placeholder="请输入成分"
                  ></el-autocomplete>
                </div>
              </div>
              <div class="col">
                <div class="label" v-if="index === 0">
                  <span class="text">成分比例</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入成分比例" v-model="item.number">
                    <template slot="append">%</template>
                  </el-input>
                </div>
              </div>
              <div
                class="opr hoverBlue"
                v-if="index === 0"
                @click="$addItem(sampleInfo.component_data, { component_name: '', number: '' })"
              >
                添加
              </div>
              <div class="opr hoverRed" v-if="index > 0" @click="$deleteItem(sampleInfo.component_data, index)">
                删除
              </div>
            </div>
            <div class="row" v-for="(item, index) in sampleInfo.size_data" :key="'Size' + index">
              <div class="col">
                <div class="spaceBetween">
                  <div class="once">
                    <div class="label" v-if="index === 0">
                      <span class="text">大身尺码</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="info elCtn">
                      <el-autocomplete
                        :class="{ error: mustFlag && !item.size_name }"
                        class="inline-input"
                        v-model="item.size_name"
                        :fetch-suggestions="searchSize"
                        placeholder="请选择大身尺码"
                      ></el-autocomplete>
                    </div>
                  </div>
                  <div class="once">
                    <div class="label" v-if="index === 0">
                      <span class="text">大身克重</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="大身克重" v-model="item.weight"> </el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="spaceBetween">
                  <div class="once">
                    <div class="label" v-if="index === 0">
                      <span class="text">大身尺寸</span>
                    </div>
                    <div class="info elCtn">
                      <el-autocomplete
                        class="inline-input"
                        v-model="item.size_info"
                        :fetch-suggestions="searchSizeInfo"
                        placeholder="大身尺寸"
                      ></el-autocomplete>
                    </div>
                  </div>
                </div>
              </div>
              <div class="opr hoverBlue" v-if="index === 0" @click="addSize">添加</div>
              <div class="opr hoverRed" v-if="index > 0 && !item.id" @click="deleteSize(index)">删除</div>
            </div>
          </div>
        </div>
        <div class="module">
          <div class="titleCtn flexBetween">
            <div class="title" style="display: flex; align-items: center">
              配件信息
              <el-switch style="margin-left: 8px" v-model="have_part"> </el-switch>
            </div>
            <div class="btn borderBtn blue" @click="addPart" v-show="have_part">新增配件</div>
          </div>
          <div class="editCtn" v-show="have_part">
            <div class="partCtn" v-for="(item, index) in sampleInfo.part_data" :key="index">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text"
                      ><span class="mark" v-if="sampleInfo.part_data.length > 1">{{ index + 1 }}</span
                      >配件名称</span
                    >
                    <span class="explanation">(必填)</span>
                    <span class="fr hoverRed" @click="$deleteItem(sampleInfo.part_data, index)" v-if="!item.id"
                      >删除此配件</span
                    >
                  </div>
                  <div class="info elCtn">
                    <el-input
                      :class="{ error: mustFlag && !item.name }"
                      placeholder="请输入配件名称"
                      v-model="item.name"
                    ></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">配件单位</span>
                  </div>
                  <div class="info elCtn">
                    <el-autocomplete
                      class="inline-input"
                      v-model="item.unit"
                      :fetch-suggestions="searchUnit"
                      placeholder="单位"
                    ></el-autocomplete>
                  </div>
                </div>
              </div>
              <div
                class="row"
                v-for="(itemComponent, indexComponent) in item.part_component_data"
                :key="'Component' + indexComponent"
              >
                <div class="col">
                  <div class="label" v-if="indexComponent === 0">
                    <span class="text">配件成分</span>
                  </div>
                  <div class="info elCtn">
                    <el-autocomplete
                      class="inline-input"
                      v-model="itemComponent.component_name"
                      :fetch-suggestions="searchIngredient"
                      placeholder="请输入成分"
                    ></el-autocomplete>
                  </div>
                </div>
                <div class="col">
                  <div class="label" v-if="indexComponent === 0">
                    <span class="text">成分比例</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入成分比例" v-model="itemComponent.number">
                      <template slot="append">%</template>
                    </el-input>
                  </div>
                </div>
                <div
                  class="opr hoverBlue"
                  v-if="indexComponent === 0"
                  @click="$addItem(item.part_component_data, { component_name: '', number: '' })"
                >
                  添加
                </div>
                <div
                  class="opr hoverRed"
                  v-if="indexComponent > 0"
                  @click="$deleteItem(item.part_component_data, index)"
                >
                  删除
                </div>
              </div>
              <div class="row" v-for="index in sampleInfo.size_data.length" :key="'Size' + index">
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label" v-if="index === 1">
                        <span class="text">配件尺码</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-autocomplete
                          class="inline-input"
                          v-model="sampleInfo.size_data[index - 1].size_name"
                          :fetch-suggestions="searchSize"
                          placeholder="同大身尺码"
                          disabled
                        ></el-autocomplete>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label" v-if="index === 1">
                        <span class="text">配件克重</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="配件克重" v-model="item.part_size_data[index - 1].weight"> </el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label" v-if="index === 1">
                        <span class="text">配件尺寸</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="配件尺寸" v-model="item.part_size_data[index - 1].size_info"> </el-input>
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
        <span class="btn borderBtn" @click="close">取消</span>
        <span class="btn" :class="{ backHoverBlue: !id && !data, backHoverOrange: id || data }" @click="saveSample">{{
          !id && !data ? '确认添加' : '确认修改'
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SampleInfo } from '@/types/sample'
import { CascaderInfo } from '@/types/vuex'
import { sample } from '@/assets/js/api'
export default Vue.extend({
  props: {
    // 注意：修改样品有两种情况，一种是继续打样，表面修改，实际新增，一种就是普通的修改样品
    edit: {
      type: Boolean,
      required: false
    },
    inDetail: {
      type: Boolean,
      required: false
    },
    show: {
      type: Boolean,
      required: true
    },
    // 这个参数用于保存后是否清空数据
    afterSaveClear: {
      type: Boolean,
      required: false,
      default: true
    },
    // 修改样品状态，并新增一个新的样品用
    pid: {
      type: [Number, String],
      required: false
    },
    pid_status: {
      type: [Number],
      required: false
    },
    // 修改样品用
    id: {
      type: [Number, String],
      required: false
    },
    // 修改样品用
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
    },
    // 是否有修改意见
    ifIdea: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data(): {
    searchList: SampleInfo[]
    sampleInfo: SampleInfo
    [propName: string]: any
  } {
    return {
      loading: false,
      saveLock: false,
      have_part: false,
      mustFlag: false,
      need_import: false,
      repeatAdd: false,
      dialogVisible: false,
      dialogImageUrl: '',
      notify: '',
      searchSampleOrderCode: '', // 搜样单编号导入
      searchSampleCode: '', // 搜样品编号导入
      searchList: [],
      sampleId: '',
      sizeList: [],
      postData: {
        key: '',
        token: ''
      },
      sampleInfo: {
        id: null,
        pid: null,
        pid_status: null,
        quote_product_id: '',
        product_type: 2,
        editor: '',
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
            component_name: '',
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
        color_data: [{ id: '', name: '' }], // 配色组
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
                component_name: '',
                number: '' // 成分信息
              }
            ]
          }
        ],
        client_edit_idea: ''
      }
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
      return this.$store.state.api.ingredient.arr.map((item: { name: any }) => {
        return {
          value: item.name,
          label: item.name
        }
      })
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
    // 打开样品详情窗口之前需要获取样品详情
    show(val) {
      if (val) {
        // 修改样单里的样品需要新建样品，并修改原样品的状态
        if (this.quote_product_id) {
          this.sampleInfo.quote_product_id = this.quote_product_id
          const quotedPriceProductInfo = this.quote_rel_product_data as SampleInfo
          this.sampleInfo.type = [
            quotedPriceProductInfo.category_id as number,
            quotedPriceProductInfo.secondary_category_id as number
          ]
          this.getUnit(this.sampleInfo.type)
          this.sampleInfo.desc = quotedPriceProductInfo.desc
          this.sampleInfo.file_list = quotedPriceProductInfo.image_data.map((item, index) => {
            return {
              id: index,
              url: item
            }
          })
          this.$nextTick(() => {
            this.$initEditor(this.sampleInfo)
          })
        } else {
          if (this.data) {
            this.changeDetailToEdit(this.data as SampleInfo)
          } else {
            if (this.id) {
              this.getImport(Number(this.id))
            } else {
              this.$nextTick(() => {
                this.$initEditor(this.sampleInfo)
              })
            }
          }
        }
        this.sampleInfo.image_data = []
        this.sampleInfo.cv_list = []
      } else {
        if (this.notify) {
          this.notify.close()
        }
        this.deletePasteImage()
      }
    }
  },
  methods: {
    searchIngredient(str: string, cb: Function) {
      cb(str ? this.ingredientList.filter(this.createFilter(str)) : this.ingredientList)
    },
    searchColour(str: string, cb: any) {
      let results = str ? this.colourList.filter(this.createFilter(str)) : this.colourList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    searchSizeInfo(str: string, cb: any) {
      const unitArr = [
        {
          value: '长*宽+须头：'
        },
        {
          value: '长*宽+翻边：'
        },
        {
          value: '长*宽+翻边+毛球：'
        },
        {
          value: '长度*掌宽：'
        },
        {
          value: '长*宽：'
        }
      ]
      let results = str ? unitArr.filter(this.createFilter(str)) : unitArr.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handlePictureCardPreview(file: any) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    searchUnit(str: string, cb: any) {
      const unitArr = [
        {
          value: '个'
        },
        {
          value: '条'
        },
        {
          value: '组'
        },
        {
          value: '顶'
        },
        {
          value: '片'
        },
        {
          value: '件'
        }
      ]
      let results = str ? unitArr.filter(this.createFilter(str)) : unitArr.slice(0, 10)
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
    searchSample() {
      if (this.searchSampleCode || this.searchSampleOrderCode) {
        this.loading = true
        sample
          .list({
            limit: 99,
            page: 1,
            // product_type: 2, // 导入可以搜产品
            product_code: this.searchSampleCode,
            order_code: this.searchSampleOrderCode
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
      sample
        .detail({
          id: ev
        })
        .then((res) => {
          const data = res.data.data
          data.product_code = '' // 导入产品不要把产品编号导进来
          this.changeDetailToEdit(data)
          this.loading = false
        })
    },
    close() {
      this.$emit('close', this.sampleInfo)
      this.reset()
    },
    getUnit(ev: number[]) {
      const finded = this.productTypeList.find((item) => item.value === ev[0])
      this.sizeList = finded!.size?.map((item) => {
        return {
          value: item.name
        }
      })
      this.sampleInfo.unit = finded!.unit!
    },
    // 尺码的逻辑包含大身+配件尺码的添加&删除
    addSize() {
      this.$addItem(this.sampleInfo.size_data, { id: '', size_name: '', size_id: '', weight: '', size_info: '' })
      this.sampleInfo.part_data.forEach((item) => {
        this.$addItem(item.part_size_data, { id: '', size_name: '', size_id: '', weight: '', size_info: '' })
      })
    },
    deleteSize(index: number) {
      this.$deleteItem(this.sampleInfo.size_data, index)
      this.sampleInfo.part_data.forEach((item) => {
        this.$deleteItem(item.part_size_data, index)
      })
    },
    addPart() {
      this.$addItem(this.sampleInfo.part_data, {
        name: '',
        unit: '',
        part_size_data: this.sampleInfo.size_data.map(() => {
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
            component_name: '',
            number: '' // 成分信息
          }
        ]
      })
    },
    beforeAvatarUpload(file: any, fileList: any) {
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
      this.sampleInfo.image_data.push('https://file.zwyknit.com/' + response.key)
    },
    beforeRemove(file: any, fileList: any) {
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
              console.log(item)
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

          this.removeFile(file)
        }).catch(() => {
          this.$message({
              type: 'info',
              message: '已取消删除'
          });          
        });
        return false;
    },
    removeFile(file: { response: { hash: string; key: string }; url: string }) {
      if (this.sampleInfo.file_list!.find((item) => item.url === file.url)) {
        this.$deleteItem(
          this.sampleInfo.file_list!,
          this.sampleInfo.file_list!.map((item) => item.url).indexOf(file.url)
        )
      } else {
        this.$deleteItem(
          this.sampleInfo.image_data,
          this.sampleInfo.image_data.indexOf('https://file.zwyknit.com/' + file.response.key)
        )
      }
    },
    getCmpData() {
      // 注意继续打样修改是新增样品
      if ((this.id || this.data) && this.edit) {
        this.sampleInfo.id = this.id || (this.data as SampleInfo).id
      } else {
        this.sampleInfo.id = null
      }
      this.sampleInfo.category_id = this.sampleInfo.type![0]
      this.sampleInfo.secondary_category_id = this.sampleInfo.type![1]
      this.sampleInfo.image_data = this.sampleInfo.image_data.concat(this.sampleInfo.file_list!.map((item) => item.url)) // 新旧图拼接
      this.sampleInfo.image_data = this.sampleInfo.cv_list
        ? this.sampleInfo.cv_list.filter((item) => !!item).concat(this.sampleInfo.image_data)
        : this.sampleInfo.image_data // cv图拼接
      if (this.have_part) {
        this.sampleInfo.part_data.forEach((item) => {
          item.part_size_data.forEach((itemChild, indexChild) => {
            itemChild.size_name = this.sampleInfo.size_data[indexChild].size_name
            itemChild.size_id = this.sampleInfo.size_data[indexChild].size_id
          })
        })
      } else {
        this.sampleInfo.part_data = []
      }
    },
    saveSample() {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      this.$emit('beforeSave', this.sampleInfo)
      const formCheck =
        this.$formCheck(this.sampleInfo, [
          {
            key: 'type',
            errMsg: '请选择样品品类',
            regNormal: 'checkArr'
          },
          {
            key: 'style_data',
            errMsg: '请选择样品款式',
            regNormal: 'checkArr'
          }
        ]) ||
        this.sampleInfo.color_data.some((item: any) => {
          return this.$formCheck(item, [
            {
              key: 'name',
              errMsg: '请输入样品配色组'
            }
          ])
        }) ||
        this.sampleInfo.size_data.some((item) => {
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
        partFormCheck = this.sampleInfo.part_data.some((item) => {
          return (
            this.$formCheck(item, [
              {
                key: 'name',
                errMsg: '请输入配件名称'
              },
              {
                key: 'unit',
                errMsg: '请输入配件单位'
              }
            ]) ||
            item.part_size_data.some((itemChild) => {
              return this.$formCheck(itemChild, [
                {
                  key: 'weight',
                  errMsg: '请输入配件克重'
                },
                {
                  key: 'size_info',
                  errMsg: '请输入配件尺寸'
                }
              ])
            })
          )
        })
      } else {
        this.mustFlag = true
      }
      this.getCmpData()
      if (!formCheck && !partFormCheck) {
        this.loading = true
        this.sampleInfo.editor.destroy()
        this.sampleInfo.editor = ''
        this.saveLock = true
        sample.create(this.sampleInfo).then((res) => {
          if (res.data.status) {
            this.$message.success(this.edit ? '修改成功' : '添加成功')
            this.$emit('afterSave', res.data.data)
            if (this.afterSaveClear) {
              this.reset()
            }
            if (!this.repeatAdd) {
              this.$emit('close', res.data.data)
            }
          }
          this.loading = false
          this.saveLock = false
        })
      }
    },
    reset() {
      this.sampleId = ''
      this.need_import = false
      this.searchList = []
      this.sampleInfo = {
        id: null,
        pid: null,
        pid_status: null,
        quote_product_id: '',
        product_type: 2,
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
            component_name: '',
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
        color_data: [{ id: '', name: '' }], // 配色组
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
                component_name: '',
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
      // 编辑器防止重复创建报错
      if (this.sampleInfo.editor) {
        this.sampleInfo.editor.destroy()
        this.sampleInfo.editor = null
      }
      this.sampleInfo = {
        id: this.pid ? null : this.id, // 打样的时候id用于查询样品，还得新建产品
        pid: this.pid,
        pid_status: this.pid ? this.pid_status : null,
        product_type: 2,
        name: data.name,
        product_code: data.product_code,
        style_code: data.style_code,
        unit: data.unit,
        category_id: data.category_id,
        secondary_category_id: data.secondary_category_id,
        type: [data.category_id as number, data.secondary_category_id as number],
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
        component_data:
          data.component_data.length > 0
            ? data.component_data.map((item: any) => {
                return {
                  component_name: item.name,
                  number: item.number
                }
              })
            : [
                {
                  component_name: '',
                  number: ''
                }
              ],
        size_data: data.size_data.map((item: any) => {
          return {
            id: this.edit ? item.id : '', // 修改的时候不能删除，导入的时候把id去了，前端就可以判断可以删除了
            size_name: item.name,
            size_info: item.size_info,
            weight: item.weight
          }
        }), // 尺码组
        color_data: data.color_data.map((item: any) => {
          return {
            id: this.edit ? item.id : '', // 修改的时候不能删除，导入的时候把id去了，前端就可以判断可以删除了
            name: item.name
          }
        }), // 配色组
        // 配件信息
        part_data: data.part_data.map((item: any) => {
          return {
            id: this.edit ? item.id : '',
            name: item.name,
            unit: item.unit,
            part_size_data: item.part_size_data.map((item: any) => {
              return {
                size_name: item.name,
                size_id: item.id,
                size_info: item.size_info,
                weight: item.weight
              }
            }),
            part_component_data: item.part_component_data.map((item: any) => {
              return {
                component_name: item.name,
                number: item.number
              }
            })
          }
        })
      }
      this.have_part = this.sampleInfo.part_data.length > 0
      this.getUnit([data.category_id as number, data.secondary_category_id as number])
      this.$nextTick(() => {
        this.$initEditor(this.sampleInfo)
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
            document.getElementById('cvImg' + _this.sampleInfo.cvImageLength).setAttribute('src', base64)
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
                _this.sampleInfo.cv_list.push(
                  // @ts-ignore
                  'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                )
                _this.sampleInfo.cvImageLength = Number(_this.sampleInfo.cvImageLength) + 1
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
      if (this.sampleInfo.cv_list![imageIndex]) {
        // @ts-ignore 标记特殊值，软删除图片，上传的时候过滤掉就行了
        this.sampleInfo.cv_list[imageIndex] = null
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
@import './sampleEdit.less';
</style>
<style lang="less">
.error {
  .el-input .el-input__inner {
    border-color: red !important;
  }
}
</style>