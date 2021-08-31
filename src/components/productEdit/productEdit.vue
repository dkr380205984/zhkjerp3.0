<template>
  <div class="productEdit sidePopup"
    v-show="show">
    <div class="main"
      v-loading="loading">
      <div class="titleCtn">
        <span class="text">添加新产品</span>
        <div class="closeCtn"
          @click="close">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn">
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
                  <el-input placeholder="输入ABC查询有数据"
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
                    v-model="searchOrderCode">
                    <el-button slot="append"
                      icon="el-icon-search"
                      @click="$message.error('没做')"></el-button>
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
                        :label="item.id">{{item.product_code}}</el-radio>
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
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">产品配色组</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select placeholder="请选择产品配色组"
                    multiple
                    filterable
                    v-model="productInfo.color_data">
                    <el-option v-for="item in colourList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <!-- 占位 -->
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">产品图片</span>
                </div>
                <div class="fileCtn">
                  <el-upload class="upload"
                    action="https://upload.qiniup.com/"
                    accept="image/jpeg,image/gif,image/png,image/bmp"
                    :before-upload="beforeAvatarUpload"
                    :data="postData"
                    :on-remove="removeFile"
                    :on-success="successFile"
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
                  <span class="explanation">(必选)</span>
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
                <div class="label"
                  v-if="index===0">
                  <span class="text">大身尺码</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="item.size_id"
                    placeholder="请选择大身尺码"
                    no-data-text="请先选择品类">
                    <el-option v-for="item in sizeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="spaceBetween">
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
              @click="addPart">新增配件</div>
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
                    <span class="explanation">(必选)</span>
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
                  <div class="label"
                    v-if="index===1">
                    <span class="text">配件尺码</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select v-model="productInfo.size_data[index-1].size_id"
                      placeholder="同大身尺码"
                      no-data-text="请先选择品类"
                      disabled>
                      <el-option v-for="item in sizeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
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
      </div>
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="close">取消</span>
        <span class="btn"
          :class="{'backHoverBlue':!id&&!data,'backHoverOrange':id||data}"
          @click="saveProduct">{{!id&&!data?'确认添加':'确认修改'}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProductInfo } from '@/types/product'
import { CascaderInfo } from '@/types/vuex'
import { product } from '@/assets/js/api'
export default Vue.extend({
  props: {
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
    // 修改产品用
    id: {
      type: [Number, String],
      required: false
    },
    // 修改产品用
    data: {
      required: false
    }
  },
  data(): {
    searchList: ProductInfo[]
    productInfo: ProductInfo
    [propName: string]: any
  } {
    return {
      loading: false,
      have_part: true,
      need_import: false,
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
        type_id: '',
        type: [], // 品类下拉框
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
      return this.$store.state.api.ingredient.arr
    },
    colourList(): Array<{ name: string; id: number }> {
      return this.$store.state.api.colour.arr
    },
    productStyleList(): Array<{ name: string; id: number }> {
      return this.$store.state.api.productStyle.arr
    }
  },
  watch: {
    // 打开产品详情窗口之前需要获取产品详情
    show(val) {
      if (val) {
        if (this.data) {
          this.productInfo = this.data as ProductInfo
        } else {
          if (this.id) {
            this.getImport(Number(this.id))
          }
        }
      }
    }
  },
  methods: {
    searchProduct() {
      if (this.searchProductCode) {
        this.loading = true
        product
          .list({
            limit: 99,
            page: 1,
            product_type: 2,
            product_code: this.searchProductCode
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
          this.productInfo = {
            product_type: 1,
            name: data.name,
            product_code: data.product_code,
            style_code: data.style_code,
            unit: data.unit,
            category_id: data.category_id,
            type_id: data.type_id,
            type: [data.category_id, data.type_id],
            image_data: data.image_data.map((item: any) => item.image_url),
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
                size_id: item.id,
                size_info: item.size_info,
                weight: item.weight
              }
            }), // 尺码组
            color_data: data.color_data.map((item: any) => item.id), // 配色组
            // 配件信息
            part_data: data.part_data.map((item: any) => {
              return {
                name: item.name,
                unit: item.unit,
                part_size_data: item.part_size_data.map((item: any) => {
                  return {
                    size_id: item.id,
                    size_info: item.size_info,
                    weight: item.weight
                  }
                }),
                part_component_data: item.part_component_data.map((item: any) => {
                  return {
                    component_id: item.id,
                    number: item.number
                  }
                })
              }
            })
          }
          this.getUnit([data.category_id, data.type_id])
          this.loading = false
        })
    },
    close() {
      this.$emit('close', this.productInfo)
    },
    getUnit(ev: number[]) {
      const finded = this.productTypeList.find((item) => item.value === ev[0])
      this.sizeList = finded!.size
      this.productInfo.unit = finded!.unit!
    },
    // 尺码的逻辑包含大身+配件尺码的添加&删除
    addSize() {
      this.$addItem(this.productInfo.size_data, { size_id: '', weight: '', size_info: '' })
      this.productInfo.part_data.forEach((item) => {
        this.$addItem(item.part_size_data, { size_id: '', weight: '', size_info: '' })
      })
    },
    deleteSize(index: number) {
      this.$deleteItem(this.productInfo.size_data, index)
      this.productInfo.part_data.forEach((item) => {
        this.$deleteItem(item.part_size_data, index)
      })
    },
    addPart() {
      this.$addItem(this.productInfo.part_data, {
        name: '',
        unit: '',
        part_size_data: this.productInfo.size_data.map(() => {
          return {
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
    removeFile(file: { response: { hash: string; key: string } }) {
      this.$deleteItem(
        this.productInfo.image_data,
        this.productInfo.image_data.indexOf('https://file.zwyknit.com/' + file.response.key)
      )
    },
    getCmpData() {
      if (this.id || this.data) {
        this.productInfo.id = this.id || (this.data as ProductInfo).id
      } else {
        this.productInfo.id = null
      }
      this.productInfo.category_id = this.productInfo.type![0]
      this.productInfo.type_id = this.productInfo.type![1]
      if (this.have_part) {
        this.productInfo.part_data.forEach((item) => {
          item.part_size_data.forEach((itemChild, indexChild) => {
            itemChild.size_id = this.productInfo.size_data[indexChild].size_id
          })
        })
      } else {
        this.productInfo.part_data = []
      }
    },
    saveProduct() {
      this.$emit('beforeSave', this.productInfo)
      const formCheck =
        this.$formCheck(this.productInfo, [
          {
            key: 'style_code',
            errMsg: '请输入客户款号'
          },
          {
            key: 'name',
            errMsg: '请输入产品名称'
          },
          {
            key: 'type',
            errMsg: '请选择产品品类',
            regNormal: 'checkArr'
          },
          {
            key: 'style_data',
            errMsg: '请选择产品款式',
            regNormal: 'checkArr'
          },
          {
            key: 'color_data',
            errMsg: '请选择产品配色',
            regNormal: 'checkArr'
          }
        ]) ||
        this.productInfo.component_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'component_id',
              errMsg: '请选择大身成分'
            },
            {
              key: 'number',
              errMsg: '请输入成分比例'
            }
          ])
        }) ||
        this.productInfo.size_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'size_id',
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
            item.part_component_data.some((itemChild) => {
              return this.$formCheck(itemChild, [
                {
                  key: 'component_id',
                  errMsg: '请选择配件成分'
                },
                {
                  key: 'number',
                  errMsg: '请输入配件比例'
                }
              ])
            }) ||
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
      }
      this.getCmpData()
      if (!formCheck && !partFormCheck) {
        this.loading = true
        product.create(this.productInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.$emit('afterSave', res.data.data)
            if (this.afterSaveClear) {
              this.reset()
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
        product_type: 1,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category_id: '',
        type_id: '',
        type: [], // 品类下拉框
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
  }
})
</script>

<style lang="less" scoped>
@import './productEdit.less';
</style>