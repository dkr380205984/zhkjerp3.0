<template>
  <div id="workerManageUpdate"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">员工信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">员工编号</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工编号"
                v-model="orderInfo.code"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">员工姓名</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工姓名"
                v-model="orderInfo.code"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">所属部门</span>
              <span class="explanation">(必选)</span>
              <span class="explanation fr" style="color: #1a95ff" @click="addDepartment()">+ 添加新部门</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择部门"
                v-model="orderInfo.contacts_id">
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
              <span class="text">员工工种</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择员工工种"
                v-model="orderInfo.group_id">
                <el-option v-for="item in groupList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">入职时间</span>
            </div>
            <div class="info elCtn">
              <el-date-picker v-model="indate" type="date" placeholder="选择日期"> </el-date-picker>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">离职时间</span>
            </div>
            <div class="info elCtn">
              <el-date-picker v-model="outdate" type="date" placeholder="选择日期"> </el-date-picker>
            </div>
          </div>
        </div>
        <div class="row">
           <div class="col">
            <div class="label">
              <span class="text">负责工序</span>
            </div>
            <div class="info elCtn checkbox">
              <el-checkbox-group v-model="chooseProcess">
                <el-checkbox-button style="margin-left:10px;margin-top:10px" v-for="item in workProcedure" :label="item.label" :key="item.label">{{ item.label }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="info elCtn">
              <div class="row newProcess">
                <div class="col" style="flex:2">
                  <el-input placeholder="请输入新工序名称" v-model="title"></el-input>
                </div>
                <div class="col el-btn" style="flex:1">
                  <el-button>+ 添加新工序</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="col"></div>
          <div class="col"></div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn" style="border-bottom: 0">
        <div class="title">
          其它信息（全部为选填）
          <span class="orange" style="font-size: 14px" v-if="$route.query.again || $route.query.product_id"
            >(订单产品转报价/再次报价不能新增或者删除产品)</span
          >
        </div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">年龄</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工年龄" v-model="title"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">性别</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工性别" v-model="client_target_price"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">身份证号码</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工身份证号码" v-model="start_order_number"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">民族</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工民族" v-model="desc"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">学历</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工学历" v-model="desc"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">健康状况</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工健康状况" v-model="desc"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">工资卡银行</div>
            <div class="info elCtn">
              <el-input placeholder="请输入卡银行" v-model="desc"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">银行卡号</div>
            <div class="info elCtn">
              <el-input placeholder="请输入银行卡号" v-model="desc"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">是否缴纳社保</div>
            <div class="info elCtn">
              <el-input placeholder="请输入是否缴纳社保" v-model="desc"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注</div>
            <div class="info elCtn">
              <el-input placeholder="请输入其它备注" v-model="desc"></el-input>
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
            @click="saveOrder(false)">提交</div>
        </div>
      </div>
    </div>
    <product-edit :pid="pid"
      :pid_status="pid_status"
      :id="proId"
      :show="addProductFlag"
      @close="addProductFlag = false"
      @afterSave="getNewProduct"></product-edit>
    <product-detail :data="productDetail"
      :show="productShow"
      @close="productShow = false"></product-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { OrderInfo, OrderTime } from '@/types/order'
import { moneyArr } from '@/assets/js/dictionary'
import { ProductInfo } from '@/types/product'
import { client, order } from '@/assets/js/api'
interface OrderCreate extends OrderInfo {
  time_data: OrderTime
}
export default Vue.extend({
  data(): {
    productDetail: ProductInfo
    productList: ProductInfo[]
    orderInfo: OrderCreate
    [propName: string]: any
  } {
    return {
      loading: true,
      showTable: true,
      outdate:'',
      indate:'',
      unitArr: moneyArr,
           workProcedure: [
        {
          label: '拉毛',
          value: '0'
        },
        {
          label: '刺毛',
          value: '1'
        },
        {
          label: '捻须',
          value: '2'
        },
        {
          label: '穿线',
          value: '3'
        },
        {
          label: '打结',
          value: '4'
        },
        {
          label: '压皱',
          value: '5'
        },
        {
          label: '整烫',
          value: '6'
        },
        {
          label: '车缝',
          value: '7'
        },
        {
          label: '开片',
          value: '8'
        },
        {
          label: '轧光',
          value: '9'
        },
        {
          label: '水洗',
          value: '11'
        },
        {
          label: '烘干',
          value: '12'
        },
        {
          label: '套口',
          value: '13'
        },
        {
          label: '套缝',
          value: '14'
        },
        {
          label: '抽顶',
          value: '15'
        },
        {
          label: '剪球',
          value: '16'
        },
        {
          label: '吊球',
          value: '17'
        },
        {
          label: '绣花',
          value: '18'
        },
        {
          label: '印花',
          value: '19'
        },
        {
          label: '钉扣',
          value: '20'
        },
        {
          label: '烫钻',
          value: '21'
        },
        {
          label: '接指',
          value: '22'
        },
        {
          label: '麻缝',
          value: '23'
        },
        {
          label: '染色',
          value: '24'
        },
        {
          label: '切割',
          value: '25'
        },
        {
          label: '手工',
          value: '26'
        },
        {
          label: '检验',
          value: '27'
        },
        {
          label: '车标',
          value: '28'
        },
        {
          label: '包装',
          value: '29'
        },
        {
          label: '吊牌',
          value: '30'
        },
        {
          label: '打枪',
          value: '31'
        },
        {
          label: '装箱',
          value: '32'
        },
        {
          label: '下水',
          value: '33'
        },
        {
          label: '压花',
          value: '34'
        },
        {
          label: '平车',
          value: '35'
        },
        {
          label: '成品染色',
          value: '36'
        },
        {
          label: '下料',
          value: '37'
        },
        {
          label: '烫金',
          value: '38'
        },
        {
          label: '锁眼',
          value: '39'
        },
        {
          label: '钉珠',
          value: '40'
        },
        {
          label: '点胶',
          value: '41'
        },
        {
          label: '搓须',
          value: '42'
        },
        {
          label: '梭织',
          value: '43'
        },
        {
          label: '针织',
          value: '44'
        },
        {
          label: '精编',
          value: '45'
        }
      ],
      chooseProcess: [],
      orderInfo: {
        id: null,
        client_id: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '',
        settle_unit: '',
        order_type: 1,
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
          is_before_confirm: 2,
          is_send: 2,
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
      addProductFlag: false,
      productList: [],
      productShow: false,
      contactsList: [],
      productDetail: {
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
      pid: null,
      pid_status: null,
      proId: null,
      postData: {
        key: '',
        token: ''
      },
      pub_file_list: [],
      pri_file_list: []
    }
  },
  computed: {
    token(): string {
      return this.$store.state.status.token
    },
    clientList(): any[] {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    },
    groupList(): any[] {
      return this.$store.state.api.group.arr
    },
    orderTypeList(): any[] {
      return this.$store.state.api.orderType.arr
    },
    totalStyle(): number {
      return this.orderInfo.time_data.batch_data.reduce((total, current) => {
        return total + current.product_data.length
      }, 0)
    },
    totalPrice(): number {
      return this.orderInfo.time_data.batch_data.reduce((totalBatch, currentBatch) => {
        return (
          totalBatch +
          currentBatch.product_data.reduce((total, current) => {
            return (
              total +
              current.product_info.reduce((totalChild, itemChild) => {
                return totalChild + Number(itemChild.price) * Number(itemChild.number)
              }, 0)
            )
          }, 0)
        )
      }, 0)
    },
    totalNumber(): number {
      return this.orderInfo.time_data.batch_data.reduce((totalBatch, currentBatch) => {
        return (
          totalBatch +
          currentBatch.product_data.reduce((total, current) => {
            return (
              total +
              current.product_info.reduce((totalChild, itemChild) => {
                return totalChild + Number(itemChild.number)
              }, 0)
            )
          }, 0)
        )
      }, 0)
    }
  },
  methods: {
    getOrderProduct(orderInfo: OrderCreate): ProductInfo[] {
      const flattenArr: ProductInfo[] = [] // 存储return信息
      orderInfo.time_data.batch_data.forEach((itemBatch) => {
        itemBatch.product_data.forEach((itemPro) => {
          if (!itemPro.product_id) {
            return
          }
          flattenArr.push({
            system_code: itemPro.system_code,
            id: itemPro.product_id,
            product_type: 1,
            name: itemPro.name as string,
            product_code: itemPro.product_code,
            category: itemPro.category,
            secondary_category: itemPro.secondary_category,
            size_data: itemPro.size_data!,
            color_data: itemPro.color_data!,
            part_data: [],
            desc: '',
            image_data: [],
            component_data: []
          })
        })
      })
      return flattenArr
    },
    getColour(ev: number, info: any) {
      if (!ev) {
        return
      }
      info.size_color_list = []
      const product: ProductInfo = this.productList.find((item) => item.id === ev) as ProductInfo
      product.size_data.forEach((itemSize: any) => {
        product.color_data.forEach((itemColor: any) => {
          info.size_color_list.push({
            label: itemSize.name + '/' + itemColor.name,
            value: itemSize.id + '/' + itemColor.id
          })
        })
      })
    },
    getContacts(ev: number[]) {
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
    getNewProduct(product: ProductInfo) {
      this.productList.push(product)
      if (!this.orderInfo.time_data.batch_data[0].product_data[0].product_id) {
        this.orderInfo.time_data.batch_data[0].product_data = []
      }
      let productInfo = {
        product_id: product.id as number,
        quote_rel_product_id: '',
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
      product.size_data.forEach((itemSize: any) => {
        product.color_data.forEach((itemColor: any) => {
          productInfo.size_color_list.push({
            // @ts-ignore
            label: itemSize.name + '/' + itemColor.name,
            // @ts-ignore
            value: itemSize.id + '/' + itemColor.id
          })
        })
      })
      // @ts-ignore
      productInfo.product_info = productInfo.size_color_list.map((item: any) => {
        return {
          size_color: item.value,
          size_id: item.value.split('/')[0],
          color_id: item.value.split('/')[1],
          number: '',
          price: 0
        }
      })
      productInfo.quote_rel_product_id = product.quote_rel_product_id as string
      this.orderInfo.time_data.batch_data[0].product_data.push(productInfo)
    },
    getProductDetail(product: ProductInfo) {
      this.productShow = true
      this.productDetail = product
      console.log(product)
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
    successFile(response: { hash: string; key: string }, orderFile: any[]) {
      orderFile.push('https://file.zwyknit.com/' + response.key)
    },
    removeFile(file: { url: string; response: { hash: string; key: string } }, orderFile: any[]) {
      if (this.pub_file_list.find((item: any) => item.url === file.url)) {
        this.$deleteItem(this.pub_file_list, this.pub_file_list.map((item: any) => item.url).indexOf(file.url))
      } else if (this.pri_file_list.find((item: any) => item.url === file.url)) {
        this.$deleteItem(this.pri_file_list, this.pri_file_list.map((item: any) => item.url).indexOf(file.url))
      } else {
        this.$deleteItem(orderFile, orderFile.indexOf('https://file.zwyknit.com/' + file.response.key))
      }
    },
    getCmpData() {
      this.orderInfo.public_files = this.orderInfo.public_files.concat(this.pub_file_list.map((item: any) => item.url))
      this.orderInfo.private_files = this.orderInfo.private_files.concat(
        this.pri_file_list.map((item: any) => item.url)
      )
      this.orderInfo.client_id = (this.orderInfo.tree_data as number[])[2]
      this.orderInfo.tree_data = (this.orderInfo.tree_data as number[]).join(',')
      this.orderInfo.time_data.total_style = this.totalStyle
      this.orderInfo.time_data.total_number = this.totalNumber
      this.orderInfo.time_data.total_price = this.totalPrice
      this.orderInfo.time_data.batch_data.forEach((itemBatch) => {
        itemBatch.product_data.forEach((item) => {
          item.product_info.forEach((itemChild) => {
            itemChild.size_id = itemChild.size_color!.split('/')[0]
            itemChild.color_id = itemChild.size_color!.split('/')[1]
          })
        })
      })
    },
    deletePro(id: number, index: number, info: any[]) {
      this.$confirm('是否删除该产品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          order
            .deletePro({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$deleteItem(info, index)
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
    deleteProChild(id: number, index: number, info: any[]) {
      this.$confirm('是否删除该尺码颜色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          order
            .deleteProChild({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$deleteItem(info, index)
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
    saveOrder(ifCaogao: boolean) {
      if (ifCaogao) {
        this.orderInfo.is_draft = 1
        this.getCmpData()
        order.create(this.orderInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('草稿保存成功')
            this.$router.push('/order/list?page=1&keyword=&client_id=&user_id=&status=null&date=')
          }
        })
      } else {
        this.orderInfo.is_draft = 2
        const formCheck =
          this.$formCheck(this.orderInfo, [
            {
              key: 'tree_data',
              errMsg: '请选择下单公司',
              regNormal: 'checkArr'
            },
            {
              key: 'contacts_id',
              errMsg: '请选择联系人'
            },
            {
              key: 'group_id',
              errMsg: '请选择负责小组'
            }
          ]) ||
          this.$formCheck(this.orderInfo.time_data, [
            {
              key: 'order_time',
              errMsg: '请选择下单时间'
            }
          ]) ||
          this.orderInfo.time_data.batch_data.some((item) => {
            return (
              this.$formCheck(item, [
                {
                  key: 'delivery_time',
                  errMsg: '请选择发货日期'
                }
                // {
                //   key: 'batch_type_id',
                //   errMsg: '请选择批次类型'
                // }
              ]) ||
              item.product_data.some((itemChild) => {
                return (
                  this.$formCheck(itemChild, [
                    {
                      key: 'product_id',
                      errMsg: '请选择产品'
                    }
                  ]) ||
                  itemChild.product_info.some((itemPro) => {
                    return this.$formCheck(itemPro, [
                      {
                        key: 'size_color',
                        errMsg: '请选择尺码颜色'
                      },
                      {
                        key: 'price',
                        errMsg: '请输入下单单价'
                      },
                      {
                        key: 'number',
                        errMsg: '请输入下单数量'
                      }
                    ])
                  })
                )
              })
            )
          })
        if (
          this.orderInfo.time_data.batch_data.some((item) => {
            return this.$ifRepeatArray(item.product_data.map((itemChild) => itemChild.product_id) as string[])
          })
        ) {
          this.$message.error('相同产品请不要分多次添加')
          return
        }
        if (!formCheck) {
          this.getCmpData()
          order.create(this.orderInfo).then((res) => {
            if (res.data.status) {
              this.$message.success('修改成功')
              this.$router.push('/order/detail?id=' + this.$route.query.id)
            }
          })
        }
      }
    }
  },
  mounted() {
    // 这个页面调用了添加产品组件，已经拿过token了
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
        checkWhich: 'api/orderType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getOrderTypeAsync'
      }
    ])
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          // @ts-ignore
          this.orderInfo.time_data = this.orderInfo.time_data[0]
          this.productList = this.getOrderProduct(this.orderInfo)
          this.orderInfo.tree_data = (this.orderInfo.tree_data as string).split(',').map((item) => Number(item))
          this.getContacts(this.orderInfo.tree_data as number[])
          this.orderInfo.private_files = this.orderInfo.private_files || []
          this.pub_file_list = this.orderInfo.public_files.map((item: any, index: number) => {
            return {
              name: '文件' + (index + 1) + '.' + item.split('.')[item.split('.').length - 1],
              id: index,
              url: item
            }
          })
          this.pri_file_list = this.orderInfo.private_files.map((item: any, index: number) => {
            return {
              name: '文件' + (index + 1) + '.' + item.split('.')[item.split('.').length - 1],
              id: index,
              url: item
            }
          })
          this.orderInfo.time_data.batch_data.forEach((item) => {
            item.product_data.forEach((itemChild) => {
              this.getColour(Number(itemChild.product_id), itemChild)
              itemChild.product_info.forEach((itemPro) => {
                itemPro.size_color = itemPro.size_id + '/' + itemPro.color_id
              })
            })
          })
        }
        this.loading = false
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/workerManage/update.less';
</style>
<style lang="less">
#workerManageUpdate {
  .noPadRight {
    .el-input--suffix .el-input__inner {
      padding-right: 0;
    }
  }

  .el-checkbox-button .el-checkbox-button__inner{
    border-radius: 4px;
    border: 1px solid #D9D9D9;
    background: #F5F5F5;
    color: rgba(0, 0, 0, 65%);
    padding: 4px 23px;
  }
  
  .el-checkbox-button.is-checked .el-checkbox-button__inner{
    border-radius: 4px;
    border: 1px solid #D9D9D9;
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    padding: 4px 23px;
    box-shadow: unset ;
  }
  .el-btn .el-button{
    height: 32px;
    padding: 6px 20px;
  }
}
</style>