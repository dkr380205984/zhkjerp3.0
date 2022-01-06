<template>
  <div id="editTag" class="bodyContainer" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">编辑标签</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div>产品尺码：</div>
            <el-checkbox-group v-model="sizeData">
              <el-checkbox
                v-for="(item, index) in productList[0].size_data"
                :key="`sizeData_${index}`"
                :label="item.name"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div>产品色组：</div>
            <el-checkbox-group v-model="colorData">
              <el-checkbox
                v-for="(item, index) in productList[0].color_data"
                :key="`colorData_${index}`"
                :label="item.name"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="detailCtn noPadTop">
        <div class="flex">
          <div v-for="(item, index) in chooseData" :key="`editTag_${index}`">
            <div class="border" v-show="item.isCheck" :key="`editTag_${index}`">
                <div class="tag_item">
                    <span class="tag_label">产品公司：</span>
                    <el-input class="tag_info" v-model="company_name" disabled />
                </div>
                <div class="tag_item">
                    <span class="tag_label">产品编号：</span>
                    <el-input class="tag_info" v-model="item.product_code" disabled />
                </div>
                <div class="tag_item">
                    <span class="tag_label">产品名称：</span>
                    <el-input class="tag_info" v-model="item.name" />
                </div>
                <div class="tag_item">
                    <span class="tag_label">产品色组：</span>
                    <el-input class="tag_info" v-model="item.color_data.name" disabled/>
                </div>
                <div class="tag_item">
                    <span class="tag_label">产品成分：</span>
                    <el-input class="tag_info" v-model="item.component_data" />
                </div>
                <div class="tag_item">
                    <span class="tag_label">产品规格：</span>
                    <el-input class="tag_info" v-model="item.size_data.name" disabled/>
                </div>
                <div class="tag_item">
                    <span class="tag_label">产品尺寸：</span>
                    <el-input class="tag_info" v-model="item.size_data.size_info" />
                </div>
                <div class="tag_item">
                    <span class="tag_label">产品克重：</span>
                    <el-input class="tag_info" v-model="item.size_data.weight" />
                </div>
                <div class="tag_item">
                    <span class="tag_label">产品描述</span>
                     <el-input maxlength="30" show-word-limit type="textarea" class="tag_info" v-model="item.product_desc" />
                </div>
                <div class="tag_item col">
                    <img :src="qrCodeUrl" class="tag_qrCode" />
                    <div class="tag_text">打印时间：{{ new Date().getFullYear() +'-'+ ((new Date().getMonth()+1) &lt; 10?('0'+(new Date().getMonth()+1)):(new Date().getMonth()+1)) +'-'+ ((new Date().getDate()) &lt; 10?'0'+(new Date().getDate()):(new Date().getDate())) }}</div>
                    <div class="tag_text">打印员工：{{ user_name }}</div>
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
          <div class="buttonList" style="margin-left: 12px">
            <div class="btn backHoverBlue" @click="openUrl()">打印标签</div>
          </div>
        </div>
      </div>
    </div>
    <product-detail
      :data="productDetail"
      :orderInfo="orderInfo"
      :show="productShow"
      @close="productShow = false"
    ></product-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order } from '@/assets/js/api'
import { OrderInfo, OrderTime } from '@/types/order'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  data(): {
    orderInfo: OrderDetail
    [propName: string]: any
  } {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      user_name:window.sessionStorage.user_name,
      loading: true,
      checkFlag: false,
      qrCodeUrl: '',
      chooseData:[],
      sizeData: [],
      colorData: [],
      component_data: '',
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
      productList: [],
      productDetail: {
        product_type: 1,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category: '',
        type: '',
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
      },
      productShow: false
    }
  },
  watch:{
      sizeData(){
        this.changeData()
      },
      colorData(){
        this.changeData()
      }
  },
  methods: {
    openUrl() {
      sessionStorage[`editTag_${this.$route.query.id}`] = JSON.stringify(this.chooseData)
      //   let obj: any = JSON.parse(sessionStorage[`product_${this.$route.query.id}`])
      //   obj.company = this.orderInfo.client_name
      //   sessionStorage[`product_${this.$route.query.id}`] = JSON.stringify(this.productInfo)
      this.$openUrl('/tagEditPrint/tagPrint?id=' + this.$route.query.id)
    },
    changeData(){
        let size_data = this.sizeData
        let color_data = this.colorData
        this.chooseData.forEach((item:any) => {
            item.isCheck = false 
        })
        this.chooseData.forEach((item:any) => {
            size_data.forEach((itemSize:any) => {
                color_data.forEach((itemColor:any) => {                    
                    if(item.size_data.name === itemSize && item.color_data.name === itemColor){
                        item.isCheck = true
                    }
                });
            });
        });     
    },
    deleteOrder() {
      this.$confirm('是否删除该订单?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          order
            .delete({
              id: Number(this.$route.query.id)
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$router.push('/order/list?page=1&keyword=&client_id=&user_id=&status=null0&date=')
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    // console.log(
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      }
    ])
    // )
  },
  mounted() {
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          // console.log(this.orderInfo)
          // 整理产品信息
          this.orderInfo.time_data.forEach((itemTime) => {
            itemTime.batch_data.forEach((itemBatch) => {
              this.productList = this.productList.concat(itemBatch.product_data)
            })
          })
          this.productList[0].component_data.forEach((itemComponent: any, index: number) => {
            this.component_data +=
              itemComponent.number +
              '%' +
              itemComponent.name +
              (index == this.productList[0].component_data.length - 1 ? '' : '/')
          })
          this.productList[0].size_data.forEach((itemSizeData: any) => {
            itemSizeData.weight = itemSizeData.weight + 'g'
          })

          // console.log('List',this.productList[0].size_data)
          this.sizeData.push(this.productList[0].size_data[0].name)
          this.colorData.push(this.productList[0].color_data[0].name)
          
          this.productList[0].size_data.forEach((item:any )=> {
            this.productList[0].color_data.forEach((colorItem:any)=>{
                this.chooseData.push(this.$clone(this.productList[0]))
                if(this.chooseData.length===1){
                    this.chooseData[0].isCheck = true
                } else {
                    this.chooseData[this.chooseData.length-1].isCheck = false
                }
                this.chooseData[this.chooseData.length-1].component_data = this.component_data
                this.chooseData[this.chooseData.length-1].color_data = colorItem
                this.chooseData[this.chooseData.length-1].size_data = this.$clone(item)
                this.chooseData[this.chooseData.length-1].client_name = sessionStorage.company_name
            })
          });
          this.loading = false
        }
      })

    // 生成二维码
    const QRCode = require('qrcode')
    QRCode.toDataURL(`${1}`)
      .then((url: any) => {
        this.qrCodeUrl = url
        // console.log(this.qrCodeUrl)
      })
      .catch((err: any) => {
        console.error(err)
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/tagEditPrint/editTag.less';
</style>

<style lang="less">
    #editTag .el-input__count{
        bottom: -32px!important;
    }
</style>