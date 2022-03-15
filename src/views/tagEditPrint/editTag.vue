<template>
  <div id="editTag" class="bodyContainer" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">编辑标签</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div>尺码：</div>
            <el-checkbox-group v-model="sizeData">
              <el-checkbox
                v-for="(item, index) in productDetail.size_data"
                :key="`sizeData_${index}`"
                :label="item.name"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div>色组：</div>
            <el-checkbox-group v-model="colorData">
              <el-checkbox
                v-for="(item, index) in productDetail.color_data"
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
                <span class="tag_label">公司：</span>
                <el-input class="tag_info" v-model="company_name" disabled />
              </div>
              <div class="tag_item">
                <span class="tag_label">编号：</span>
                <el-input class="tag_info" v-model="item.product_code" disabled />
              </div>
              <div class="tag_item">
                <span class="tag_label">名称：</span>
                <el-input class="tag_info" v-model="item.name" maxlength="7" />
              </div>
              <div class="tag_item">
                <span class="tag_label">色组：</span>
                <el-input class="tag_info" v-model="item.color_data.name" disabled />
              </div>
              <div class="tag_item">
                <span class="tag_label">成分：</span>
                <el-input class="tag_info" v-model="item.component_data" />
              </div>
              <div class="tag_item">
                <span class="tag_label">规格：</span>
                <el-input class="tag_info" v-model="item.size_data.name" disabled />
              </div>
              <div class="tag_item">
                <span class="tag_label">尺寸：</span>
                <el-input class="tag_info" v-model="item.size_data.size_info" />
              </div>
              <div class="tag_item">
                <span class="tag_label">克重：</span>
                <el-input class="tag_info" v-model="item.size_data.weight" />
              </div>
              <div class="tag_item">
                <span class="tag_label">描述</span>
                <el-input show-word-limit type="textarea" class="tag_info" v-model="item.product_desc" maxlength="14" />
              </div>
              <div class="tag_item col">
                <img :src="qrCodeUrl" class="tag_qrCode" />
                <div class="tag_text">
                  打印时间：{{ new Date().getFullYear() +'-'+ ((new Date().getMonth()+1) &lt; 10?('0'+(new Date().getMonth()+1)):(new Date().getMonth()+1)) +'-'+ ((new Date().getDate()) &lt; 10?'0'+(new Date().getDate()):(new Date().getDate())) }}
                </div>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { product } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      user_name: window.sessionStorage.user_name,
      loading: true,
      checkFlag: false,
      qrCodeUrl: '',
      chooseData: [],
      sizeData: [],
      colorData: [],
      component_data: '',
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
  watch: {
    sizeData() {
      this.changeData()
    },
    colorData() {
      this.changeData()
    }
  },
  methods: {
    openUrl() {
      sessionStorage[`editTag_${this.$route.query.id}`] = JSON.stringify(this.chooseData)
      this.$openUrl('/tagEditPrint/tagPrint?id=' + this.$route.query.id)
    },
    changeData() {
      let size_data = this.sizeData
      let color_data = this.colorData
      this.chooseData.forEach((item: any) => {
        item.isCheck = false
      })
      this.chooseData.forEach((item: any) => {
        size_data.forEach((itemSize: any) => {
          color_data.forEach((itemColor: any) => {
            if (item.size_data.name === itemSize && item.color_data.name === itemColor) {
              item.isCheck = true
            }
          })
        })
      })
    }
  },
  mounted() {
    product
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.productDetail = res.data.data
          this.productDetail.component_data.forEach((itemComponent: any, index: number) => {
            this.component_data +=
              itemComponent.number +
              '%' +
              itemComponent.name +
              (index == this.productDetail.component_data.length - 1 ? '' : '/')
          })
          this.productDetail.size_data.forEach((itemSizeData: any) => {
            itemSizeData.weight = itemSizeData.weight + 'g'
          })
          // console.log('List',this.productDetail.size_data)
          this.sizeData.push(this.productDetail.size_data[0].name)
          this.colorData.push(this.productDetail.color_data[0].name)

          this.productDetail.size_data.forEach((item: any) => {
            this.productDetail.color_data.forEach((colorItem: any) => {
              this.chooseData.push(this.$clone(this.productDetail))
              if (this.chooseData.length === 1) {
                this.chooseData[0].isCheck = true
              } else {
                this.chooseData[this.chooseData.length - 1].isCheck = false
              }
              this.chooseData[this.chooseData.length - 1].component_data = this.component_data
              this.chooseData[this.chooseData.length - 1].color_data = colorItem
              this.chooseData[this.chooseData.length - 1].size_data = this.$clone(item)
              this.chooseData[this.chooseData.length - 1].client_name = sessionStorage.company_name
            })
          })
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
#editTag .el-input__count {
  bottom: -32px !important;
}
</style>