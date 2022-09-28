<template>
  <div id="sampleOrderUpdate"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="editCtn">
        <div class="description">样单修改只能修改基本信息和文件信息，要修改打样/样品信息请在
          <span class="hoverBlue"
            style="cursor:pointer"
            @click="$router.push('/sampleOrder/detail?id=' + $route.query.id)">详情页</span>
          进行修改
        </div>
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
          </div>
          <div class="col">
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">打样公司</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-cascader placeholder="请选择打样公司"
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
                no-data-text="请先选择报价公司">
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
                v-model="sampleOrderInfo.group_id">
                <el-option v-for="item in groupList"
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
              <span class="text">文件信息</span>
            </div>
            <div class="info">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                :before-upload="beforeAvatarUpload"
                :data="postData"
                :file-list="file_list"
                :on-remove="removeFile"
                :on-success="successFile"
                ref="uploada">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">可上传文档/图片信息，文件大小不能超过10M(请勿上传带特殊字符的文件)</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div id='editorOrder'
              style="z-index: 0;position: relative;">
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
            @click="saveSampleOrder(false)">确认修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SampleInfo } from '@/types/sample'
import { SampleOrderInfo, SampleOrderTime } from '@/types/sampleOrder'
import { client, fileManage, sampleOrder } from '@/assets/js/api'
interface SampleOrderDetail extends SampleOrderInfo {
  time_data: SampleOrderTime[]
}
interface SampleOrderCreate extends SampleOrderInfo {
  time_data: SampleOrderTime
}
export default Vue.extend({
  data(): {
    [propName: string]: any
    sampleList: SampleInfo[]
    sampleOrderInfo: SampleOrderCreate
  } {
    return {
      loading: true,
      sampleOrderInfo: {
        id: null,
        client_id: '',
        tree_data: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '', // 订单用无用字段
        settle_unit: '', // 订单用无用字段
        order_type: 2,
        code: '',
        desc: '',
        editor: '',
        time_data: {
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
                  image_data: [],
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
      file_list: [], // 该字段存储旧的文件用于文件组件
      sampleList: [],
      contactsList: [],
      postData: {
        key: '',
        token: ''
      }
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
    }
  },
  methods: {
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
    saveSampleOrder() {
      // 新旧图拼接,接口说只要上传新的文件就行了，删除文件调单独接口
      // this.sampleOrderInfo.public_files = this.sampleOrderInfo.public_files.concat(
      //   this.file_list.map((item: any) => item.url)
      // )
      this.sampleOrderInfo.client_id = this.sampleOrderInfo.tree_data[2]
      this.sampleOrderInfo.tree_data = (this.sampleOrderInfo.tree_data as number[]).join(',')
      // @ts-ignore
      this.sampleOrderInfo.time_data = null
      this.sampleOrderInfo.editor = ''
      this.loading = true
      sampleOrder.create(this.sampleOrderInfo).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          this.loading = false
          this.$router.push('/sampleOrder/list?page=1&keyword=&client_id=&user_id=&status=0&date=')
        }
      })
    },
    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      const haveSpecial = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？；‘']/im
      if (haveSpecial.test(file.name.split('.')[0])) {
        this.$message.error('文件名称要以中文或字母的方式命名，不能带特殊字符，请重命名文件上传!')
        return false
      }
      this.postData.token = this.token
      this.postData.key = file.name.split('.')[0] + Date.parse(new Date() + '') + '.' + fileFormat
      // const isJPG = file.type === 'image/jpeg'
      // const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 10MB!')
        return false
      }
    },
    successFile(response: { hash: string; key: string }) {
      this.sampleOrderInfo.public_files.push('https://file.zwyknit.com/' + response.key)
    },
    removeFile(file: { url: string; response: { hash: string; key: string } }) {
      if (this.file_list.find((item: any) => item.url === file.url)) {
        fileManage
          .delete({
            id: this.file_list.find((item: any) => item.url === file.url).id
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.$deleteItem(this.file_list, this.file_list.map((item: any) => item.url).indexOf(file.url))
            }
          })
      } else {
        this.$deleteItem(
          this.sampleOrderInfo.public_files,
          this.sampleOrderInfo.public_files.indexOf('https://file.zwyknit.com/' + file.response.key)
        )
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
    sampleOrder
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.sampleOrderInfo = this.$clone(res.data.data)
        this.sampleOrderInfo.time_data = res.data.data.time_data[0]
        this.sampleOrderInfo.tree_data = (this.sampleOrderInfo.tree_data as string)
          .split(',')
          .map((item) => Number(item))
        this.sampleOrderInfo.client_id = this.sampleOrderInfo.tree_data[2]
        this.getContacts(this.sampleOrderInfo.tree_data as number[])
        this.sampleOrderInfo.contacts_id = res.data.data.contacts_id
        // 把public_files的东西放到file_list里，因为后台给的文件和upload组件需要的数据结构不同
        this.file_list = res.data.data.public_files.map((item: any, index: number) => {
          return {
            name: '文件' + (index + 1) + '.' + item.file_url.split('.')[item.file_url.split('.').length - 1],
            id: item.id,
            url: item.file_url
          }
        })
        this.sampleOrderInfo.public_files = []
        this.loading = false
        this.$nextTick(() => {
          this.$initEditor(this.sampleOrderInfo, 'Order')
        })
      })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/sampleOrder/update.less';
</style>