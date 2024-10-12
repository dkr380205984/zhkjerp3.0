<template>
  <div class="printContainer"
    id="reimbursementManagePrint"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <div class="pmain">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">{{ company_name + '报销单' }}</div>
          <div class="prow">
            <div class="pcol wa">
              <div class="label">报销单号：</div>
              <div class="info"
                style="white-space: nowrap">{{ receiptInfo.code }}</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol wa">
              <div class="label">创建信息：</div>
              <div class="info">
                {{ receiptInfo.created_at ? receiptInfo.created_at.slice(0, 10) : ''
                }}{{ receiptInfo.user.name ? ' - ' + receiptInfo.user.name : ''
}}{{ receiptInfo.user.phone ? ' - ' + receiptInfo.user.phone : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pbody"
        style="min-height:1380px">
        <div class="tableCtn pageOne">
          <div class="module">
            <div class="tbody hasTop"
              style="text-align: left">
              <div class="trow">
                <div class="tcol bgGray">报销人</div>
                <div class="tcol">{{ receiptInfo.name }}</div>
                <div class="tcol bgGray">审核人</div>
                <div class="tcol">{{  receiptInfo.check_user?receiptInfo.check_user.join(',') :''}}</div>
              </div>
              <div class="trow"
                v-for="(item, index) in receiptInfo.receipt_contents"
                :key="index">
                <div class="tcol noPad">
                  <div class="trow">
                    <div class="tcol bgGray"
                      style="flex: 0.349">报销内容{{ index + 1 }}</div>
                    <div class="tcol"
                      style="flex: 1.5">{{ item.name }}</div>
                  </div>
                  <div class="trow">
                    <div class="tcol bgGray"
                      style="flex: 0.349">申请报销金额（元）</div>
                    <div class="tcol"
                      style="flex: 1.5">{{ item.amount }}</div>
                  </div>
                </div>
              </div>
              <div class="trow">
                <div class="tcol bgGray"
                  style="flex: 0.349">合计</div>
                <div class="tcol"
                  style="flex: 1.5">{{ receiptInfo.amount }} 元</div>
              </div>
            </div>
          </div>
        </div>
        <template v-if="showOrderImage==='1'">
          <div class="tableCtn">
            <div class="tbody hasTop">
              <div class="trow"
                v-if="receiptInfo.image_data.length>3">
                <div class="tcol imageFather">
                  <span style="
                  position: absolute;
                  right: 15px;
                  top: 0;
                  bottom: 0;
                  float: right;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="receiptInfo.imageIndex1 = receiptInfo.imageIndex1===receiptInfo.image_data.length-1?0:receiptInfo.imageIndex1+1">下一张</span>
                  <span style="
                  position: absolute;
                  left: 15px;
                  top: 0;
                  bottom: 0;
                  float: right;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="receiptInfo.imageIndex1 = receiptInfo.imageIndex1===0?receiptInfo.image_data.length-1:receiptInfo.imageIndex1-1">上一张</span>
                  <el-image style="width:100%;height:100%"
                    :src="receiptInfo.image_data.length>0?receiptInfo.image_data[receiptInfo.imageIndex1]:''">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
                <div class="tcol imageFather">
                  <span style="
                  position: absolute;
                  right: 15px;
                  top: 0;
                  bottom: 0;
                  float: right;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="receiptInfo.imageIndex2 = receiptInfo.imageIndex2===receiptInfo.image_data.length-1?0:receiptInfo.imageIndex2+1">下一张</span>
                  <span style="
                  position: absolute;
                  left: 15px;
                  top: 0;
                  bottom: 0;
                  float: right;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="receiptInfo.imageIndex2 = receiptInfo.imageIndex2===0?receiptInfo.image_data.length-1:receiptInfo.imageIndex2-1">上一张</span>
                  <el-image style="width:100%;height:100%"
                    :src="receiptInfo.image_data.length>0?receiptInfo.image_data[receiptInfo.imageIndex2]:''">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
                <div class="tcol imageFather">
                  <span style="
                  position: absolute;
                  right: 15px;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="receiptInfo.imageIndex3 = receiptInfo.imageIndex3===receiptInfo.image_data.length-1?0:receiptInfo.imageIndex3+1">下一张</span>
                  <span style="
                  position: absolute;
                  left: 15px;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="receiptInfo.imageIndex3 = receiptInfo.imageIndex3===0?receiptInfo.image_data.length-1:receiptInfo.imageIndex3-1">上一张</span>
                  <el-image style="width:100%;height:100%"
                    :src="receiptInfo.image_data.length>0?receiptInfo.image_data[receiptInfo.imageIndex3]:''">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
              </div>
              <div class="trow"
                v-else>
                <div class="tcol imageFather"
                  v-for="indexImage in 3"
                  :key="indexImage">
                  <el-image style="width:100%;height:100%"
                    :src="receiptInfo.image_data[indexImage-1]">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <template v-if="showOrderImage==='2'">
        <div style="page-break-before: always;page-break-after:always;width: 982px;min-height:1500px"
          v-for="itemPic,indexPic in receiptInfo.image_data"
          :key="indexPic">
          <div class="imageFather"
            style="display:block;text-align:center">
            <div style="position:relative;display:inline-block;margin:auto">
              <img style="max-height:1490px;max-width:982px;"
                :src="itemPic" />
              <span class="hoverBlue"
                style=" 
                  position: absolute;
                  left: 0;
                  right:0;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  width:4em;
                  z-index: 1;
                  background: #ccc;"
                @click="deleteImage(receiptInfo,indexPic)">隐藏图片</span>
            </div>

          </div>
        </div>
      </template>
      <template v-if="showOrderImage==='3'">
        <div style="page-break-before: always;page-break-after:always;width: 982px;height:1500px;display:flex;flex-direction:column">
          <div style="flex:1;display:flex">
            <div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative"
              v-for="index in 3"
              :key="index"
              class="imageFather">
              <img :src="receiptInfo.image_data[index-1]"
                style="max-width:100%"
                v-if="receiptInfo.image_data[index-1]" />
              <span class="hoverBlue"
                v-if="receiptInfo.image_data[index-1]"
                style=" 
                  position: absolute;
                  left: 0;
                  right:0;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  width:4em;
                  z-index: 1;
                  background: #ccc;"
                @click="deleteImage(receiptInfo,index)">隐藏图片</span>
            </div>
          </div>
          <div style="flex:1;display:flex">
            <div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative"
              v-for="index in 3"
              :key="index"
              class="imageFather">
              <img :src="receiptInfo.image_data[index+2]"
                style="max-width:100%"
                v-if="receiptInfo.image_data[index+2]" />
              <span class="hoverBlue"
                v-if="receiptInfo.image_data[index+2]"
                style=" 
                  position: absolute;
                  left: 0;
                  right:0;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  width:4em;
                  z-index: 1;
                  background: #ccc;"
                @click="deleteImage(receiptInfo,index+2)">隐藏图片</span>
            </div>
          </div>
        </div>
      </template>
      <template v-if="showOrderImage==='4'">
        <div style="page-break-before: always;page-break-after:always;width: 982px;height:1500px;display:flex;flex-direction:column">
          <div style="flex:1;display:flex">
            <div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative"
              v-for="index in 3"
              :key="index"
              class="imageFather">
              <img :src="receiptInfo.image_data[index-1]"
                style="max-width:100%"
                v-if="receiptInfo.image_data[index-1]" />
              <span class="hoverBlue"
                v-if="receiptInfo.image_data[index-1]"
                style=" 
                  position: absolute;
                  left: 0;
                  right:0;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  width:4em;
                  z-index: 1;
                  background: #ccc;"
                @click="deleteImage(receiptInfo,index)">隐藏图片</span>
            </div>
          </div>
          <div style="flex:1;display:flex">
            <div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative"
              v-for="index in 3"
              :key="index"
              class="imageFather">
              <img :src="receiptInfo.image_data[index+2]"
                style="max-width:100%"
                v-if="receiptInfo.image_data[index+2]" />
              <span class="hoverBlue"
                v-if="receiptInfo.image_data[index+2]"
                style=" 
                  position: absolute;
                  left: 0;
                  right:0;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  width:4em;
                  z-index: 1;
                  background: #ccc;"
                @click="deleteImage(receiptInfo,index+2)">隐藏图片</span>
            </div>
          </div>
          <div style="flex:1;display:flex">
            <div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative"
              v-for="index in 3"
              :key="index"
              class="imageFather">
              <img :src="receiptInfo.image_data[index+5]"
                style="max-width:100%"
                v-if="receiptInfo.image_data[index+5]" />
              <span class="hoverBlue"
                v-if="receiptInfo.image_data[index+5]"
                style=" 
                  position: absolute;
                  left: 0;
                  right:0;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  width:4em;
                  z-index: 1;
                  background: #ccc;"
                @click="deleteImage(receiptInfo,index+5)">隐藏图片</span>
            </div>
          </div>
          <div style="flex:1;display:flex">
            <div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative"
              v-for="index in 3"
              :key="index"
              class="imageFather">
              <img :src="receiptInfo.image_data[index+8]"
                style="max-width:100%"
                v-if="receiptInfo.image_data[index+8]" />
              <span class="hoverBlue"
                v-if="receiptInfo.image_data[index+8]"
                style=" 
                  position: absolute;
                  left: 0;
                  right:0;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  width:4em;
                  z-index: 1;
                  background: #ccc;"
                @click="deleteImage(receiptInfo,index+8)">隐藏图片</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop>
      <div class="setting_item"
        @click="windowMethod(1)">刷新</div>
      <div class="setting_item"
        @click="windowMethod(2)">打印</div>
      <div class="setting_item"
        @click="showOrderImage='1'">图片不单独打印-任选3图</div>
      <div class="setting_item"
        @click="showOrderImage='2'">图片单独打印-1图</div>
      <div class="setting_item"
        @click="showOrderImage='3'">图片单独打印-6图</div>
      <div class="setting_item"
        @click="showOrderImage='4'">图片单独打印-12图</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { receipt } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodeUrl: '',
      showMenu: false,
      X_position: 0,
      Y_position: 0,
      showOrderImage: this.$getLocalStorage('showOrderImage') || '1',
      receiptInfo: {
        image_data: [],
        check_user: '',
        certificate: '',
        user: {
          name: '',
          phone: ''
        },
        reviewer: {
          name: ''
        }
      }
    }
  },
  methods: {
    handleClickRight(e: any, type = true) {
      this.showMenu = type
      this.X_position = e.clientX
      this.Y_position = e.clientY
      e.preventDefault()
      e.stopPropagation()
    },
    windowMethod(type: 1 | 2) {
      this.showMenu = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          window.print()
        }
      })
    }
  },
  mounted() {
    receipt
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.receiptInfo = res.data.data
        this.receiptInfo.check_user = this.receiptInfo.check_user || ''
        this.receiptInfo.image_data = this.receiptInfo.certificate ? this.receiptInfo.certificate.split(',') : []
        Object.prototype.toString.call(this.receiptInfo.reviewer) === '[object Object]'
          ? this.receiptInfo.reviewer
          : (this.receiptInfo.reviewer = { name: '' })

        // 生成二维码
        const QRCode = require('qrcode')
        QRCode.toDataURL(`${this.receiptInfo.code}`)
          .then((url: any) => {
            this.receiptInfo.url = url
            this.$forceUpdate()
          })
          .catch((err: any) => {
            console.error(err)
          })
      })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/reimbursementManage/print.less';
</style>