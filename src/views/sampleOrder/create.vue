<template>
  <div id="sampleOrderCreate"
    class="bodyContainer"
    v-loading="loading"
    @keydown="saveSuccess=false">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">样单号</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入样单号"
                v-model="sampleOrderInfo.code"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">样单类型</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select :class="{'error':mustFlag&&!sampleOrderInfo.time_data.order_type_id}"
                placeholder="请选择样单类型"
                v-model="sampleOrderInfo.time_data.order_type_id">
                <el-option v-for="item in sampleOrderTypeList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">下单日期</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-date-picker :class="{'error':mustFlag&&!sampleOrderInfo.time_data.order_time}"
                placeholder="请选择下单日期"
                v-model="sampleOrderInfo.time_data.order_time"
                value-format="yyyy-MM-dd"></el-date-picker>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">打样公司</span>
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
                content="添加新公司"
                placement="top">
                <i class="el-icon-upload hoverOrange fr"
                  style="line-height:38px;font-size:18px;cursor:pointer;"
                  @click="$openUrl('/client/create?type=1')"></i>
              </el-tooltip>
            </div>
            <div class="info elCtn">
              <el-cascader :class="{'error':mustFlag&&sampleOrderInfo.tree_data.length===0}"
                placeholder="请选择打样公司"
                v-model="sampleOrderInfo.tree_data"
                :options="clientList"
                @change="getContacts">
              </el-cascader>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">公司联系人</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择公司联系人"
                v-model="sampleOrderInfo.contacts_id"
                no-data-text="请先选择下单公司"
                clearable>
                <el-option v-for="item in contactsList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">负责小组/人</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择负责小组/人"
                v-model="sampleOrderInfo.group_id"
                clearable>
                <el-option v-for="item in groupList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="quotedPriceProductList.length>0">
      <div class="titleCtn">
        <div class="title">报价样品表</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">序号</div>
            <div class="tcol">样品品类</div>
            <div class="tcol">样品图片</div>
            <div class="tcol">实际报价</div>
            <div class="tcol">样品描述</div>
            <div class="tcol">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in quotedPriceProductList"
            :key="item.id">
            <div class="tcol">{{index+1}}</div>
            <div class="tcol">{{item.category_name}}/{{item.secondary_category}}</div>
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
            <div class="tcol">{{item.client_target_price}}元</div>
            <div class="tcol"
              v-html="item.desc"></div>
            <div class="tcol oprCtn">
              <div class="opr hoverBlue"
                @click="supplementInfo(item)"
                v-if="!item.has_change">补充信息</div>
              <div class="opr orange"
                v-else>已转换</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn flexBetween">
        <div class="title">添加样品</div>
        <div class="btn backHoverBlue"
          @click="addSampleFlag = true"
          v-show="quotedPriceProductList.length===0">添加新样品</div>
      </div>
      <div class="noDate"
        v-show="sampleList.length === 0">暂无样品信息</div>
      <div class="checkList"
        v-show="sampleList.length>0">
        <div class="label">已选样品：</div>
        <div class="once"
          v-for="(item,index) in sampleList"
          :key="item.id">
          <span class="text">{{item.product_code || item.system_code}}/({{item.category}}/{{item.secondary_category}})</span>
          <span class="el-icon-view detailIcon hoverBlue"
            @click="getSampleDetail(item)"></span>
          <span class="el-icon-delete deleteIcon hoverRed"
            @click="$deleteItem(sampleList,index)"></span>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">打样数量及交期</div>
      </div>
      <div class="editCtn">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">样品编号</div>
              <div class="tcol noPad"
                style="flex:4">
                <div class="trow">
                  <div class="tcol">尺码颜色</div>
                  <div class="tcol">打样单价</div>
                  <div class="tcol"
                    style="flex:0.8">打样数量</div>
                  <div class="tcol"
                    style="flex:0.6">送样数量</div>
                  <div class="tcol"
                    style="flex:0.6">留底数量</div>
                  <div class="tcol">操作</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in sampleOrderInfo.time_data.batch_data[0].product_data"
              :key="index">
              <div class="tcol"
                style="position:relative">
                <div class="elCtn"
                  style="width:87%">
                  <el-select :class="{'error':mustFlag&&!item.product_id}"
                    v-model="item.product_id"
                    placeholder="选择样品"
                    @change="getColour($event,item)"
                    no-data-text="请先添加/导入样品">
                    <el-option v-for="item in sampleList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.product_code + '/' + (item.name ||'无样品名称')"></el-option>
                  </el-select>
                  <el-tooltip class="item"
                    effect="dark"
                    content="统一单价和数量"
                    placement="top">
                    <svg class="iconFont copyIcon hoverBlue"
                      aria-hidden="true">
                      <use xlink:href='#icon-tongbushuju1'
                        @click="$copyInfo(item.product_info,['price','number'])"></use>
                    </svg>
                  </el-tooltip>
                </div>
              </div>
              <div class="tcol noPad"
                style="flex:4">
                <div class="trow"
                  v-for="(itemChild,indexChild) in item.product_info"
                  :key="indexChild">
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select :class="{'error':mustFlag&&!itemChild.size_color}"
                        v-model="itemChild.size_color"
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
                        :class="{'error':mustFlag&&!itemChild.sample_number}"
                        v-model="itemChild.sample_number"
                        placeholder="送样数量"
                        @keydown.native="$focusByKeydown($event,'sample_number',[index,indexChild],sampleOrderInfo.time_data.batch_data[0],['product_data','product_info'])">
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol"
                    style="flex:0.6">
                    <div class="elCtn">
                      <el-input :ref="'keep_number'+ '-'+index+'-'+indexChild"
                        :class="{'error':mustFlag&&!itemChild.keep_number}"
                        v-model="itemChild.keep_number"
                        placeholder="留底数量"
                        @keydown.native="$focusByKeydown($event,'keep_number',[index,indexChild],sampleOrderInfo.time_data.batch_data[0],['product_data','product_info'])">
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol oprCtn">
                    <div class="opr hoverBlue"
                      @click="$addItem(item.product_info,{
                        sample_number:'',
                        keep_number:'',
                        size_color: [], // 用于下拉框选择尺码颜色
                        size_id: '',
                        color_id: '',
                        number: '',
                        price: ''
                      })">新增尺码</div>
                    <div class="opr hoverRed"
                      @click="item.product_info.length>1?$deleteItem(item.product_info,indexChild):$deleteItem(sampleOrderInfo.time_data.batch_data[0].product_data,index)">删除</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="oprRow"
            style="margin-right:0">
            <div class="once"
              @click="$addItem(sampleOrderInfo.time_data.batch_data[0].product_data, {
                product_id: '',
                size_color_list: [],
                product_info: [
                  {
                    size_color: [], 
                    size_id: '',
                    color_id: '',
                    number: '',
                    sample_number:'',
                    keep_number:'',
                    price: ''
                  }
                ]
              })">新增样品
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">计划完成时间</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-date-picker :class="{'error':mustFlag&&!sampleOrderInfo.time_data.complete_time}"
                placeholder="请选择计划完成时间"
                v-model="sampleOrderInfo.time_data.complete_time"
                value-format="yyyy-MM-dd"></el-date-picker>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">
              <span class="text">是否加急打样</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-radio-group v-model="sampleOrderInfo.time_data.is_urgent">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">打样款数</span>
              <span class="explanation">(自动计算))</span>
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
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">文件信息</span>
            </div>
            <div class="info">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                :before-upload="beforeAvatarUpload"
                :data="postData"
                :on-remove="removeFile"
                :on-success="successFile"
                ref="uploada">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">可上传文档/图片信息，文件大小不能超过10M</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入备注信息"
                v-model="sampleOrderInfo.desc"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverBlue"
            @click="saveSampleOrder(false)">提交</div>
        </div>
      </div>
    </div>
    <sample-edit :show="addSampleFlag"
      :quote_product_id="quotedPriceProductInfo.id"
      :quote_rel_product_data="quotedPriceProductInfo"
      @close="addSampleFlag = false"
      @afterSave="getNewSample"></sample-edit>
    <sample-detail :noOpr="true"
      :data="sampleDetail"
      :show="sampleShow"
      @close="sampleShow = false"></sample-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SampleInfo } from '@/types/sample'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import { SampleOrderInfo, SampleOrderTime } from '@/types/sampleOrder'
import { client, sampleOrder, quotedPrice } from '@/assets/js/api'
interface SampleOrderCreate extends SampleOrderInfo {
  time_data: SampleOrderTime
}
export default Vue.extend({
  data(): {
    sampleOrderInfo: SampleOrderCreate
    sampleDetail: SampleInfo
    sampleList: SampleInfo[]
    [propName: string]: any
  } {
    return {
      loading: false, // 报价单转样单需要loading报价单详情
      sampleShow: false,
      mustFlag: false,
      saveLock: false,
      sampleDetail: {
        product_type: 2,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category: '',
        secondary_category: '',
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
            id: '',
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
                id: '',
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
      sampleList: [],
      sampleOrderInfo: {
        id: null,
        client_id: '',
        tree_data: [],
        group_id: Number(this.$getsessionStorage('group_id')) || Number(this.$getLocalStorage('group_id')) || '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '', // 订单用无用字段
        settle_unit: '', // 订单用无用字段
        order_type: 2,
        code: '',
        desc: '',
        time_data: {
          id: '',
          order_time: this.$getDate(new Date()),
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
              batch_type_id: '',
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
      },
      contactsList: [],
      postData: {
        key: '',
        token: ''
      },
      quotedPriceProductInfo: {
        id: '',
        category_id: '',
        type_id: ''
      },
      saveSuccess: true,
      quotedPriceProductList: [] // 报价单转过来的产品信息
    }
  },
  computed: {
    token(): string {
      return this.$store.state.status.token
    },
    clientList(): any[] {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    },
    sampleOrderTypeList(): any[] {
      return this.$store.state.api.sampleOrderType.arr
    },
    groupList(): any[] {
      return this.$store.state.api.group.arr
    },
    totalStyle(): number {
      return this.sampleOrderInfo.time_data.batch_data[0].product_data.length
    },
    totalPrice(): number {
      return this.sampleOrderInfo.time_data.batch_data[0].product_data.reduce((total, current) => {
        return (
          total +
          current.product_info.reduce((totalChild, itemChild) => {
            return totalChild + Number(itemChild.price) * Number(itemChild.number)
          }, 0)
        )
      }, 0)
    },
    totalNumber(): number {
      return this.sampleOrderInfo.time_data.batch_data[0].product_data.reduce((total, current) => {
        return (
          total +
          current.product_info.reduce((totalChild, itemChild) => {
            return totalChild + Number(itemChild.number)
          }, 0)
        )
      }, 0)
    }
  },
  methods: {
    // 报价单转样单逻辑
    getQuotedPrice() {
      if (this.$route.query.quotedPriceId) {
        this.loading = true
        quotedPrice
          .detail({
            id: Number(this.$route.query.quotedPriceId)
          })
          .then((res) => {
            const quotedPriceInfo: QuotedPriceInfo = res.data.data
            this.sampleOrderInfo.tree_data = (quotedPriceInfo.tree_data as string)
              .split(',')
              .map((item) => Number(item))
            this.sampleOrderInfo.group_id = quotedPriceInfo.group_id
            this.sampleOrderInfo.rel_quote_id = Number(this.$route.query.quotedPriceId)
            this.getContacts(this.sampleOrderInfo.tree_data)
            this.sampleOrderInfo.contacts_id = quotedPriceInfo.contacts_id
            this.quotedPriceProductList = quotedPriceInfo.product_data
            this.loading = false
          })
      }
    },
    getColour(ev: number, info: any) {
      info.size_color_list = []
      const product: SampleInfo = this.sampleList.find((item) => item.id === ev) as SampleInfo
      product.size_data.forEach((itemSize: any) => {
        product.color_data.forEach((itemColor: any) => {
          info.size_color_list.push({
            label: itemSize.name + '/' + itemColor.name,
            value: itemSize.id + '/' + itemColor.id
          })
        })
      })
      info.quote_product_id = product.quote_product_id
      info.product_info = info.size_color_list.map((item: any) => {
        return {
          size_color: item.value,
          size_id: item.value.split('/')[0],
          color_id: item.value.split('/')[1],
          number: '',
          price: 0
        }
      })
    },
    getContacts(ev: number[]) {
      this.sampleOrderInfo.contacts_id = ''
      if (ev) {
        client
          .detail({
            id: ev[2]
          })
          .then((res) => {
            if (res.data.status) {
              this.contactsList = res.data.data.contacts_data
            }
          })
      }
    },
    getSampleDetail(sample: SampleInfo) {
      this.sampleShow = true
      this.sampleDetail = sample
    },
    getNewSample(sample: SampleInfo) {
      if (this.quotedPriceProductInfo) {
        // 标记一下报价产品已经转换了，不能二次转换了
        this.quotedPriceProductInfo.has_change = true
        sample.quote_product_id = this.quotedPriceProductInfo.id
      }
      this.sampleList.push(sample)
    },
    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.postData.token = this.token
      this.postData.key = Date.parse(new Date() + '') + '.' + fileFormat
      // const isJPG = file.type === 'image/jpeg'
      // const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    successFile(response: { hash: string; key: string }) {
      this.sampleOrderInfo.public_files.push('https://file.zwyknit.com/' + response.key)
    },
    removeFile(file: { response: { hash: string; key: string } }) {
      this.$deleteItem(
        this.sampleOrderInfo.public_files,
        this.sampleOrderInfo.public_files.indexOf('https://file.zwyknit.com/' + file.response.key)
      )
    },
    // 把通过计算属性得到的价格以及通过级联选择器选到的id赋给表单数据
    getCmpData(is_draft: 1 | 2) {
      this.sampleOrderInfo.time_data.is_draft = is_draft
      this.sampleOrderInfo.client_id = (this.sampleOrderInfo.tree_data as number[])[2] || ''
      this.sampleOrderInfo.tree_data = (this.sampleOrderInfo.tree_data as number[]).join(',')
      this.sampleOrderInfo.time_data.total_style = this.totalStyle
      this.sampleOrderInfo.time_data.total_number = this.totalNumber
      this.sampleOrderInfo.time_data.total_price = this.totalPrice
      this.sampleOrderInfo.time_data.batch_data[0].product_data.forEach((item) => {
        item.product_info.forEach((itemChild) => {
          itemChild.size_id = itemChild.size_color!.split('/')[0]
          itemChild.color_id = itemChild.size_color!.split('/')[1]
        })
      })
    },
    saveSampleOrder(ifCaogao: boolean) {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      if (!ifCaogao) {
        const formCheck =
          this.$formCheck(this.sampleOrderInfo, [
            {
              key: 'tree_data',
              errMsg: '请选择打样公司',
              regNormal: 'checkArr'
            }
          ]) ||
          this.$formCheck(this.sampleOrderInfo.time_data, [
            {
              key: 'order_type_id',
              errMsg: '请选择样单类型'
            },
            {
              key: 'order_time',
              errMsg: '请选择下单时间'
            },
            {
              key: 'complete_time',
              errMsg: '请选择计划完成时间'
            }
          ]) ||
          this.sampleOrderInfo.time_data.batch_data[0].product_data.some((item) => {
            return (
              this.$formCheck(item, [
                {
                  key: 'product_id',
                  errMsg: '请选择样品'
                }
              ]) ||
              item.product_info.some((itemChild) => {
                return this.$formCheck(itemChild, [
                  {
                    key: 'size_color',
                    errMsg: '请选择尺码颜色'
                  },
                  // {
                  //   key: 'price',
                  //   errMsg: '请输入打样单价'
                  // },
                  {
                    key: 'number',
                    errMsg: '请输入打样数量'
                  }
                ])
              })
            )
          })
        if (
          this.$ifRepeatArray(
            this.sampleOrderInfo.time_data.batch_data[0].product_data.map((item) => item.product_id) as string[]
          )
        ) {
          this.$message.error('相同样品请不要分多次添加')
          return
        }
        if (!formCheck) {
          this.getCmpData(2)
          this.loading = true
          this.saveLock = true
          sampleOrder.create(this.sampleOrderInfo).then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.saveSuccess = true
              this.$router.push('/sampleOrder/list?page=1&keyword=&client_id=&user_id=&status=0&date=')
            }
            this.loading = false
            this.saveLock = false
          })
        } else {
          this.mustFlag = true
        }
      } else {
        const formCheck = this.$formCheck(this.sampleOrderInfo, [
          {
            key: 'code',
            errMsg: '草稿必填样单号/样单名称用于标识'
          },
          {
            key: 'tree_data',
            errMsg: '请选择打样公司',
            regNormal: 'checkArr'
          }
        ])
        if (!formCheck) {
          this.getCmpData(1)
          this.loading = true
          sampleOrder.create(this.sampleOrderInfo).then((res) => {
            if (res.data.status) {
              this.$message.success('已保存第一次打样为草稿信息,请在详情页及时完善信息')
              this.saveSuccess = true
              this.$router.push('/sampleOrder/list?page=1&keyword=&client_id=&user_id=&status=null0&date=')
            }
            this.loading = false
          })
        }
      }
    },
    supplementInfo(sampleInfo: SampleInfo) {
      this.addSampleFlag = true
      this.quotedPriceProductInfo = sampleInfo
    }
  },
  mounted() {
    // 这个页面调用了添加样品组件，已经拿过token了
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/sampleOrderType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getSampleOrderTypeAsync'
      }
    ])
    this.getQuotedPrice()
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
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/sampleOrder/create.less';
</style>
<style lang="less">
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
#sampleOrderCreate {
  .error {
    .el-input__inner {
      border-color: red !important;
    }
  }
}
</style>