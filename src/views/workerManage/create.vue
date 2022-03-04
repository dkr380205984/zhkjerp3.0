<template>
  <div id="workerManageCreate" class="bodyContainer" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">添加员工</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">员工姓名</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工姓名" v-model="staffInfo.name"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">手机号</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工手机号" v-model="staffInfo.phone"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">所属部门</span>
              <span class="explanation">(必选)</span>
              <span class="explanation fr" style="color: #1a95ff" @click="showAddDepartment()">+ 添加新部门</span>
            </div>
            <div class="info elCtn">
              <el-select
                placeholder="请选择部门"
                v-model="staffInfo.department"
                no-data-text="请先选择询价客户"
                clearable
                :disabled="!!$route.query.again"
              >
                <el-option
                  v-for="item in departmentList"
                  :key="item.id"
                  :value="item.name"
                  :label="item.name"
                ></el-option>
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
              <el-select placeholder="请选择员工工种" v-model="staffInfo.type" clearable>
                <el-option :value="1" label="临时工"></el-option>
                <el-option :value="2" label="合同工"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">入职时间</span>
            </div>
            <div class="info elCtn">
              <el-date-picker v-model="staffInfo.entry_time" type="date" placeholder="选择日期"> </el-date-picker>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">离职时间</span>
            </div>
            <div class="info elCtn">
              <el-date-picker v-model="staffInfo.resign_time" type="date" placeholder="选择日期"> </el-date-picker>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">负责工序</span>
            </div>
            <div class="info elCtn checkbox">
              <el-checkbox-group v-model="staffInfo.process">
                <el-checkbox-button
                  style="margin-left: 10px; margin-top: 10px"
                  v-for="item in workProcedure"
                  :label="item.label"
                  :key="item.label"
                  >{{ item.label }}</el-checkbox-button
                >
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="info elCtn">
              <div class="row newProcess">
                <div class="col" style="flex: 2">
                  <el-input placeholder="请输入新工序名称" v-model="newProcessName"></el-input>
                </div>
                <div class="col el-btn" style="flex: 1">
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
              <el-input placeholder="请输入员工年龄" v-model="staffInfo.age"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">性别</div>
            <div class="info elCtn">
              <el-select placeholder="请选择员工性别" v-model="staffInfo.sex" clearable>
                <el-option :value="1" label="男"></el-option>
                <el-option :value="2" label="女"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">身份证号码</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工身份证号码" v-model="staffInfo.id_number"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">民族</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工民族" v-model="staffInfo.nation"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">学历</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工学历" v-model="staffInfo.education"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">健康状况</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工健康状况" v-model="staffInfo.health"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">工资卡银行</div>
            <div class="info elCtn">
              <el-input placeholder="请输入卡银行" v-model="staffInfo.bank"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">银行卡号</div>
            <div class="info elCtn">
              <el-input placeholder="请输入银行卡号" v-model="staffInfo.card_number"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">是否缴纳社保</div>
            <div class="info elCtn">
              <el-select placeholder="请选择是否缴纳社保" v-model="staffInfo.sex" clearable>
                <el-option :value="1" label="否"></el-option>
                <el-option :value="2" label="是"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注</div>
            <div class="info elCtn">
              <el-input placeholder="请输入其它备注" v-model="staffInfo.desc"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
          <div class="btn backHoverBlue" @click="addStaff()">提交</div>
        </div>
      </div>
    </div>
    <div class="popup" v-show="isAddDepartment">
      <div class="main" style="width: 1000px">
        <div class="titleCtn">
          <span class="text">添加新部门</span>
          <div class="closeCtn" @click="isAddDepartment = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn" style="min-height: 70px; display: flex; justify-content: center">
          <el-input v-model="newDepartName" style="height: 32px" placeholder="请输入新部门名字"></el-input>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" @click="isAddDepartment = false">取消</span>
          <span class="btn backHoverBlue" @click="addDepartment()">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PackMaterialInfo, DecorateMaterialInfo } from '@/types/materialSetting'
import { moneyArr } from '@/assets/js/dictionary'
import { quotedPrice, order, staff } from '@/assets/js/api'
import Vue from 'vue'
import { OrderInfo } from '@/types/order'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: false,
      unitArr: moneyArr,
      isAddDepartment: false,
      departmentList: [],
      newDepartName: '',
      staffInfo: {
        name: '',
        phone: '',
        department: '',
        type: '',
        entry_time: '',
        resign_time: '',
        process: [],
        age: '',
        sex: '',
        id_number: '',
        nation: '',
        education: '',
        health: '',
        bank: '',
        card_number: '',
        social_security: '',
        desc: '',
        id:''
      },
      postData: {
        key: '',
        token: ''
      },
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
      contactsList: [],
      newProcessName: '',
      searchQuotedPrice: '',
      searchQuotedPriceList: [],
      desc: '',
      showContent: false,
      quotedImage: '',
      notify: null,
      imgId: '',
      indate: '',
      outdate: ''
    }
  },
  computed: {
    token() {
      return this.$store.state.status.token
    },
    productTypeList() {
      return this.$store.state.api.productType.arr
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
      // this.quotedPriceInfo.product_data.forEach((item, index) => {
      //   if (index !== mark) {
      //     item.cvFlag = false
      //   }
      // })
      this.imgId = mark + 'cvImg' + imageLength
      this.$forceUpdate()
    },
    showAddDepartment() {
      this.isAddDepartment = true
    },
    addDepartment() {
      if (this.newDepartName === '') {
        this.$message.error('部门名字不能为空')
        return
      }
      staff
        .departmentAdd({
          id: '',
          name: this.newDepartName
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('部门添加成功')
            this.getDepartmentList()
            this.isAddDepartment = false
          }
        })
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
      // this.quotedPriceInfo.product_data[index].image_data.push('https://file.zwyknit.com/' + response.key)
    },
    removeFile(file: { response: { hash: string; key: string } }, index: number) {
      // this.$deleteItem(
      // this.quotedPriceInfo.product_data[index].image_data,
      // this.quotedPriceInfo.product_data[index].image_data.indexOf('https://file.zwyknit.com/' + file.response.key)
      // )
    },
    getUnit(ev: string, info: DecorateMaterialInfo) {
      info.unit = this.decorateMaterialList.find((item) => item.id === ev)!.unit
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
              .getElementById(arr[0] + 'cvImg' + _this.quotedPriceInfo.product_data[arr[0]].cvImageLength)
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
    },
    // 获取部门信息
    getDepartmentList() {
      staff
        .departmentList({
          keyword: '',
          limit: ''
        })
        .then((res) => {
          if (res.data.status) {
            this.departmentList = res.data.data
          }
        })
    },

    // 添加员工
    addStaff() {
      let staffInfo = this.staffInfo

      staffInfo.process = staffInfo.process.toString()
      console.log(staffInfo)
      if (staffInfo.name === '') {
        this.$message.error('员工姓名不能为空')
        return
      }
      if (staffInfo.department === '') {
        this.$message.error('所属部门不能为空')
        return
      }
      if (staffInfo.type === '') {
        this.$message.error('员工工种不能为空')
        return
      }

      staff.addStaff(staffInfo).then((res: any) => {
        if(res.data.status){
          this.$message.success('添加成功')
          return
        }
      })
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

    // process.list({type:1}).then(res => {
    //   console.log(res)
    // })

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
            // if (this.$route.query.product_id) {
            //   this.quotedPriceInfo
            //   this.quotedPriceInfo.product_data = this.quotedPriceInfo.product_data.filter(
            //     (item) => Number(item.order_product_id) === Number(this.$route.query.order_product_id)
            //   )
            // }
          }
          this.loading = false
        })
    }

    this.getDepartmentList()
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
@import '~@/assets/css/workerManage/create.less';
</style>
<style lang="less">
#workerManageCreate {
  .el-tabs__content {
    padding: 0;
  }

  .el-checkbox-button .el-checkbox-button__inner {
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    background: #f5f5f5;
    color: rgba(0, 0, 0, 65%);
    padding: 4px 23px;
  }

  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    padding: 4px 23px;
    box-shadow: unset;
  }
  .el-btn .el-button {
    height: 32px;
    padding: 6px 20px;
  }
}
</style>