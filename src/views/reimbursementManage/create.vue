<template>
  <div id="reimbursementManageCreate" class="bodyContainer" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">添加报价单</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">报销人</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入报价单标题" v-model="quotedPriceInfo.title"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">所属小组</span>
            </div>
            <div class="info elCtn">
              <el-cascader
                placeholder="请选择所属小组"
                v-model="quotedPriceInfo.tree_data"
                :options="clientList"
                @change="getContacts"
                :disabled="!!$route.query.again"
                clearable
                filterable
              >
              </el-cascader>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="listCtn">
              <div class="list">
                <div class="row title">
                  <div class="col">报销内容</div>
                  <div class="col">报销金额（元）</div>
                  <div class="col">操作</div>
                </div>
                <div class="row" v-for="(item, index) in 2" :key="index">
                  <div class="col elCtn">
                    <el-input placeholder="请输入报销内容" v-model="item.title"></el-input>
                  </div>
                  <div class="col elCtn">
                    <el-input placeholder="请输入报销金额" v-model="item.title"></el-input>
                  </div>
                  <div class="col">
                    <div>
                      <span class="opr hoverBlue" style="top:20%" @click="$router.push('/reimbursementManage/detail?id=' + item.id)"
                        >添加</span
                      >
                      <span class="opr hoverRed" style="top:20%;left:20%" @click="deleteReimbursement(item)">删除</span>
                    </div>
                  </div>
                </div>
                <div class="row title">
                  <div class="col" style="flex:1">合计费用</div>
                  <div class="col" style="flex:2">{{22}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text" style="margin-right:20px">上传报销凭证</span>
               <el-checkbox v-model="cvFlag"
                  @change="changeCVOpration">{{cvFlag?'关闭复制粘贴图片上传功能':'开启复制粘贴图片上传功能'}}
                </el-checkbox>
            </div>
            <div class="info">
              <div class="cvImageCtn"
                v-show="cvFlag || cv_list">
                <div class="cvImage"
                  v-for="indexImage of 1"
                  :key="indexImage">
                  <template v-if="cv_list!==null">
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
                  :file-list="file_list"
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
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
          <div class="btn backHoverBlue" @click="saveQuotedPrice(false)">提交</div>
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
      cvFlag:false,
      unitArr: moneyArr,
      postData: {
        key: '',
        token: ''
      },
      productIndex: '0', // 目前选中的产品
      quotedPriceInfo: {
        id: null,
        is_draft: 1,
        title: '',
        client_id: '',
        tree_data: [],
        contacts_id: '',
        group_id: '',
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
        product_data: [
          {
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
                price_info: []
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
                process_id: [],
                process_name: [],
                desc: '',
                total_price: ''
              }
            ],
            production_data: [
              {
                id: '',
                name: [],
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
        ]
      },
      contactsList: [],
      weaveList: [{ value: '针织织造' }, { value: '梭织织造' }, { value: '制版费' }],
      searchQuotedPrice: '',
      searchQuotedPriceList: [],
      desc: '',
      showContent: false,
      quotedImage: '',
      notify: null,
      imgId: ''
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
      if (ev) {
        yarn
          .detail({
            id: ev[2]
          })
          .then((res) => {
            if (res.data.status) {
              info.price_info = res.data.data.rel_price
            }
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
            process_id: [],
            process_name: [],
            desc: '',
            total_price: ''
          }
        ],
        production_data: [
          {
            id: '',
            name: [],
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
    },
    removeFile(file: { response: { hash: string; key: string } }, index: number) {
      this.$deleteItem(
        this.quotedPriceInfo.product_data[index].image_data,
        this.quotedPriceInfo.product_data[index].image_data.indexOf('https://file.zwyknit.com/' + file.response.key)
      )
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
        item.image_data = item.file_list
          ? item.image_data.concat(item.file_list!.map((item) => item.url))
          : item.image_data // 新旧图拼接
        item.image_data = item.cv_list ? item.cv_list.filter((item) => !!item).concat(item.image_data) : item.image_data // cv图拼接
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
            if (item.product_id) {
              this.$message.error('暂时不支持')
              return false
            } else {
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
                        key: 'weight',
                        errMsg: '请输入产品' + (index + 1) + '原料预计数量'
                      },
                      {
                        key: 'unit',
                        errMsg: '物料的单位只能为g，kg或m',
                        regExp: /^g$|^m$|^kg$/,
                        regNegate: true
                      },
                      {
                        key: 'price',
                        errMsg: '请输入产品' + (index + 1) + '原料单价'
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
                      },
                      {
                        key: 'number',
                        errMsg: '请输入产品' + (index + 1) + '装饰辅料预计数量'
                      },
                      {
                        key: 'unit',
                        errMsg: '请输入产品' + (index + 1) + '装饰辅料数量单位'
                      },
                      {
                        key: 'price',
                        errMsg: '请输入产品' + (index + 1) + '装饰辅料单价'
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
                    itemChild.process_id!.length > 0 &&
                    this.$formCheck(itemChild, [
                      {
                        key: 'process_id',
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
                    itemChild.name!.length > 0 &&
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
            }
          })
        if (!formCheck) {
          this.getCmpData()
          quotedPrice.create(this.quotedPriceInfo).then((res) => {
            if (res.data.status) {
              this.$message.success('创建成功')
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
          })
        }
      } else {
        this.getCmpData()
        quotedPrice.create(this.quotedPriceInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('草稿保存成功')
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

      this.quotedPriceInfo.product_data.forEach((item) => {
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
            document
              .getElementById('cvImg' + 1)
              // .getElementById(arr[0] + 'cvImg' + _this.quotedPriceInfo.product_data[arr[0]].cvImageLength)
              .setAttribute('src', base64)
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
                document
                  .getElementById(arr[0] + 'cvImg' + _this.quotedPriceInfo.product_data[arr[0]].cvImageLength)
                  .setAttribute('src', 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key)
                _this.$message.success('上传成功')
                // @ts-ignore
                _this.quotedPriceInfo.product_data[arr[0]].cv_list.push(
                  // @ts-ignore
                  'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                )
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
    console.log(this.$route.query.isEdit)
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
                      price_info: []
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
                      process_id: [],
                      process_name: [],
                      desc: '',
                      total_price: ''
                    }
                  ],
                  production_data: [
                    {
                      id: '',
                      name: [],
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
            // @ts-ignore
            data.time_data[0].batch_data.forEach((item) => {
              this.quotedPriceInfo.product_data = this.quotedPriceInfo.product_data.concat(
                item.product_data.map((item: any) => {
                  return {
                    cv_list: [],
                    cvFlag: false,
                    total_price: '',
                    product_id: '',
                    order_product_id: item.id,
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
                        price_info: []
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
                        process_id: [],
                        process_name: [],
                        desc: '',
                        total_price: ''
                      }
                    ],
                    production_data: [
                      {
                        id: '',
                        name: [],
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
            // 如果是产品转报价，过滤掉其他产品
            if (this.$route.query.product_id) {
              this.quotedPriceInfo
              this.quotedPriceInfo.product_data = this.quotedPriceInfo.product_data.filter(
                (item) => Number(item.order_product_id) === Number(this.$route.query.order_product_id)
              )
            }
          }
          this.loading = false
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
@import '~@/assets/css/reimbursementManage/create.less';
</style>
<style lang="less">
#reimbursementManageCreate {
  .el-tabs__content {
    padding: 0;
  }
}
</style>