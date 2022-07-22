<template>
  <div id="reimbursementManageUpdate"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">修改报销单</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">报销人</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select v-model="receiptInfo.staff"
                filterable
                placeholder="请选择报销人"
                value-key="id">
                <el-option v-for="item in staffList"
                  :key="item.id"
                  :label="item.code.substr(-4) + ' ' + item.name"
                  :value="item"> </el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">所属小组</span>
            </div>
            <div class="info elCtn">
              <el-select v-model="receiptInfo.group"
                placeholder="请选择所属小组"
                clearable>
                <el-option v-for="item in groupList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
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
                <div class="row"
                  v-for="(item, index) in receiptInfo.staff_departments"
                  :key="index">
                  <div class="col elCtn">
                    <el-input placeholder="请输入报销内容"
                      v-model="item.name"></el-input>
                  </div>
                  <div class="col elCtn">
                    <el-input placeholder="请输入报销金额"
                      v-model="item.amount"
                      type="number"></el-input>
                  </div>
                  <div class="col">
                    <div>
                      <span class="opr hoverBlue"
                        style="top: 20%"
                        @click="
                          $addItem(receiptInfo.staff_departments, {
                            name: '',
                            amount: ''
                          })
                        ">添加</span>
                      <span class="opr hoverRed"
                        style="top: 20%; left: 20%"
                        @click="deleteReimbursement(receiptInfo.staff_departments, index)">删除</span>
                    </div>
                  </div>
                </div>
                <div class="row title">
                  <div class="col"
                    style="flex: 1">合计费用</div>
                  <div class="col"
                    style="flex: 2">{{ receiptInfo.amount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text"
                style="margin-right: 20px">上传报销凭证</span>
              <el-checkbox v-model="cvFlag"
                @change="changeCVOpration">{{ cvFlag ? '关闭复制粘贴图片上传功能' : '开启复制粘贴图片上传功能' }}
              </el-checkbox>
            </div>
            <div class="info">
              <div class="cvImageCtn"
                v-show="cvFlag">
                <div class="cvImage"
                  v-for="indexImage of cvImageLength"
                  :key="indexImage">
                  <template v-if="cv_list[indexImage - 1] !== null">
                    <img :id="'cvImg' + indexImage"
                      :src="cv_list[indexImage - 1] || require('@/assets/image/common/cv.png')" />
                    <i class="icon el-icon-close"
                      @click="deleteCvImage(indexImage - 1)"></i>
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
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverBlue"
            @click="saveReceipt">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { receipt, staff } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
    receiptInfo: {
      staff: any
      group: string
      certificate: string
      staff_departments: Array<{
        name: string
        amount: number | string
      }>
      id: number | string
      amount: number | string
    }
  } {
    return {
      loading: true,
      cvFlag: false,
      cvImageLength: 1,
      cv_list: [],
      file_list: [],
      postData: {
        key: '',
        token: ''
      },
      receiptInfo: {
        staff: {},
        group: '',
        certificate: '',
        staff_departments: [
          {
            name: '',
            amount: ''
          }
        ],
        id: '',
        amount: 0
      },
      staffList: [],
      notify: null,
      imgId: ''
    }
  },
  watch: {
    'receiptInfo.staff_departments': {
      handler: function (a) {
        this.receiptInfo.amount = 0
        a.forEach((item: any) => {
          this.receiptInfo.amount = +this.receiptInfo.amount + (+item.amount || 0)
        })
      },
      deep: true
    }
  },
  computed: {
    groupList() {
      return this.$store.state.api.group.arr
    },
    token() {
      return this.$store.state.status.token
    }
  },
  methods: {
    getStaffList() {
      staff
        .list({
          status: 1
        })
        .then((res) => {
          this.staffList = res.data.data
        })
    },
    init() {
      receipt
        .detail({
          id: this.$route.query.id + ''
        })
        .then((res) => {
          let data = res.data.data
          if (res.data.data.certificate) {
            this.cv_list = res.data.data.certificate.split(',')
            this.cvImageLength = res.data.data.certificate.split(',').length + 1
          } else {
            this.cv_list = []
            this.cvImageLength = 1
          }
          this.receiptInfo = {
            group: data.group,
            staff: {
              id: data.staff_id,
              name: data.name
            },
            staff_departments: data.receipt_contents,
            id: this.$route.query.id + '',
            amount: 0,
            certificate: data.certificate
          }
          this.loading = false
        })
    },
    saveReceipt() {
      if (this.receiptInfo.staff.name === undefined) {
        this.$message.error('请选择报销人')
        return
      }
      if (
        this.receiptInfo.staff_departments.length === 1 &&
        (this.receiptInfo.staff_departments[0].amount === '' || this.receiptInfo.staff_departments[0].name === '')
      ) {
        this.$message.error('请填写报销内容和报销金额')
        return
      }
      let string = ''
      this.cv_list.forEach((item: string | null) => {
        if (item) {
          string += item + ','
        }
      })
      this.file_list.forEach((item: string | null) => {
        if (item) {
          string += item + ','
        }
      })
      string = string.substring(0, string.length - 1)
      receipt
        .save({
          name: this.receiptInfo.staff.name,
          staff_id: this.receiptInfo.staff.id,
          group: this.receiptInfo.group,
          certificate: string,
          staff_departments: this.receiptInfo.staff_departments,
          id: this.receiptInfo.id,
          amount: this.receiptInfo.amount
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
          }
        })
    },
    deleteReimbursement(arr: any, index: any) {
      if (arr.length === 1) {
        this.$message.error('至少保留一条报销记录')
        return
      }
      this.$deleteItem(arr, index)
    },
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

    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.postData.token = this.token
      this.postData.key = file.name.split('.')[0] + Date.parse(new Date() + '') + '.' + fileFormat
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
      this.file_list.push('https://file.zwyknit.com/' + response.key)
      this.cvImageLength = Number(this.cvImageLength) + 1
    },
    removeFile(file: { response: { hash: string; key: string } }, index: number) {
      this.$deleteItem(this.file_list, this.file_list.indexOf('https://file.zwyknit.com/' + file.response.key))
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
              // .getElementById('cvImg' + _this.cvImageLength)
              .getElementById('cvImg' + _this.cvImageLength)
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
                  .getElementById('cvImg' + _this.cvImageLength)
                  .setAttribute('src', 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key)
                _this.$message.success('上传成功')
                // @ts-ignore
                _this.cv_list.push(
                  // @ts-ignore
                  'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
                )
                _this.cvImageLength = Number(_this.cvImageLength) + 1
                // console.log(_this.cvImageLength)
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
      if (this.cv_list![imageIndex]) {
        // @ts-ignore 标记特殊值，软删除图片，上传的时候过滤掉就行了
        this.cv_list![imageIndex] = null
        this.$message.success('删除成功')
        this.$forceUpdate()
      } else {
        this.$message.error('请先上传图片')
      }
    }
  },
  mounted() {
    this.init()
    this.getStaffList()
    this.$checkCommonInfo([
      {
        checkWhich: 'api/staffProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStaffProcessAsync'
      },
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
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
@import '~@/assets/css/reimbursementManage/update.less';
</style>
<style lang="less">
#reimbursementManageUpdate {
  .el-tabs__content {
    padding: 0;
  }
}
</style>