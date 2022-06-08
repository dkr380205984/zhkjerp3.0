<template>
  <div id="fileManageList"
    class="bodyContainer"
    @click.left="showMenu=false">
    <div class="module"
      @click.right="handleClickRight">
      <div class="titleCtn">
        <div class="title">文件列表</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="keyword"
              placeholder="搜索文件名称"></el-input>
          </div>
          <div class="elCtn">
            <el-select v-model="type"
              placeholder="筛选文件标签">
              <el-option v-for="item in typeArr"
                :key="item.value"
                :value="item.value"
                :label="item.label"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-cascader placeholder="筛选公司"
              v-model="client_id"
              filterable
              :options="clientList"
              clearable>
            </el-cascader>
          </div>
          <div class="elCtn hasIcon">
            <el-select v-model="group_id"
              placeholder="筛选负责小组"
              clearable>
              <el-option v-for="item in groupList"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn hasIcon">
            <el-select v-model="user_id"
              placeholder="筛选创建人"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="changeRouter"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="elCtn">
            <el-select v-model="limit"
              placeholder="每页展示条数"
              @change="changeRouter">
              <el-option v-for="item in limitList"
                :key="item.value"
                :label="item.name"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="btn backHoverBlue fr"
            @click="uploadFlag=true">上传文件</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">文件名称</div>
            <div class="col">文件标签</div>
            <div class="col">上传时间</div>
            <div class="col">所属公司</div>
            <div class="col">所属小组</div>
            <div class="col">上传人</div>
            <div class="col">操作</div>
          </div>
          <div class="row">
            <div class="col">文件名称</div>
            <div class="col">文件标签</div>
            <div class="col">上传时间</div>
            <div class="col">所属公司</div>
            <div class="col">所属小组</div>
            <div class="col">上传人</div>
            <div class="col">
              <div class="opr hoverBlue">下载</div>
              <div class="opr hoverRed">删除</div>
              <div class="opr hoverGreen"
                @click="shareFile">分享</div>
            </div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">文件名称</div>
            <div class="col">文件标签</div>
            <div class="col">上传时间</div>
            <div class="col">所属公司</div>
            <div class="col">所属小组</div>
            <div class="col">上传人</div>
            <div class="col">
              <div class="opr hoverBlue">下载</div>
              <div class="opr hoverRed"
                @click="deleteFile(item.id)">删除</div>
              <div class="opr hoverGreen"
                @click="shareFile(item)">分享</div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="getList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop>
      <div class="setting_item"
        @click="windowMethod(1)">批量下载</div>
      <div class="setting_item"
        @click="windowMethod(2)">批量删除</div>
    </div>
    <div class="popup"
      v-show="shareFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">分享文件</span>
          <div class="closeCtn"
            @click="shareFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="explainCtn">发送通知给该用户，被通知用户，点击通知链接后，可直接下载。 注意：私密文件不可分享。</div>
          <div class="row">
            <div class="label">文件名称：</div>
            <div class="info text">AAAAAAAAAA</div>
          </div>
          <div class="row">
            <div class="label">分享用户：</div>
            <div class="info elCtn">
              <el-select v-model="user_id"
                placeholder="选择用户"
                multiple
                clearable>
                <el-option v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="shareFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveShareFile">确认</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="uploadFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">分享文件</span>
          <div class="closeCtn"
            @click="uploadFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row"
            style="margin-bottom:20px">
            <div class="label">上传文件：</div>
            <div class="info elCtn">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                :before-upload="beforeAvatarUpload"
                :data="postData"
                :on-remove="(ev)=>{return removeFile(ev,uploadInfo.file)}"
                :on-success="(ev)=>{return successFile(ev,uploadInfo.file)}"
                ref="uploada">
                <div class="uploadBtn">
                  <i class="el-icon-upload"></i>
                  <span>上传文件</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">可以上传word、excel、pdf等格式的文件，且不超过20M</div>
              </el-upload>
            </div>
          </div>
          <div class="row">
            <div class="label">文件类型：</div>
            <div class="info elCtn"
              style="align-items:center;display: flex;">
              <el-radio v-model="uploadInfo.type"
                label="1">公开文件</el-radio>
              <el-radio v-model="uploadInfo.type"
                label="2">私密文件</el-radio>
            </div>
          </div>
          <div class="row">
            <div class="label">所属公司：</div>
            <div class="info elCtn">
              <div class="elCtn">
                <el-cascader placeholder="选择公司"
                  v-model="uploadInfo.client_id"
                  filterable
                  :options="clientList"
                  clearable>
                </el-cascader>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="label">文件标签：</div>
            <div class="info elCtn">
              <el-select v-model="uploadInfo.mark"
                placeholder="筛选文件标签">
                <el-option v-for="item in typeArr"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="uploadFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveUploadFile">确认上传</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { limitArr } from '@/assets/js/dictionary'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      limitList: limitArr,
      loading: false,
      keyword: '',
      page: 1,
      limit: 10,
      total: 1,
      type: '',
      client_id: [],
      group_id: '',
      user_id: '',
      date: [],
      list: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      typeArr: [
        {
          value: 1,
          label: '询价文件'
        },
        {
          value: 2,
          label: '订单合同'
        },
        {
          value: 3,
          label: '工艺资料'
        },
        {
          value: 4,
          label: '生产资料'
        },
        {
          value: 5,
          label: '辅料资料'
        },
        {
          value: 6,
          label: '装箱资料'
        },
        {
          value: 7,
          label: '进仓资料'
        },
        {
          value: 8,
          label: '财务票据'
        },
        {
          value: 9,
          label: '内部文件'
        },
        {
          value: 10,
          label: '其它文件'
        }
      ],
      showMenu: false,
      showPrintSetting: false,
      shareFlag: false,
      uploadFlag: false,
      uploadInfo: {
        type: '1',
        client_id: [],
        mark: '',
        file: []
      },
      postData: {
        key: '',
        token: ''
      }
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  computed: {
    clientList() {
      return this.$store.state.api.clientType.arr
    },
    userList() {
      return this.$store.state.api.user.arr
    },
    groupList() {
      return this.$store.state.api.group.arr
    },
    token(): string {
      return this.$store.state.status.token
    }
  },
  methods: {
    beforeAvatarUpload(file: any) {
      const fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length // 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.postData.token = this.token
      this.postData.key = Date.parse(new Date() + '') + '.' + fileFormat
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('文件大小不能超过 20MB!')
        return false
      }
    },
    successFile(response: { hash: string; key: string }, orderFile: any[]) {
      orderFile.push('https://file.zwyknit.com/' + response.key)
    },
    removeFile(file: { response: { hash: string; key: string } }, orderFile: any[]) {
      this.$deleteItem(orderFile, orderFile.indexOf('https://file.zwyknit.com/' + file.response.key))
    },
    handleClickRight(e: any, type = true) {
      this.showMenu = type
      this.X_position = e.clientX
      this.Y_position = e.clientY
      e.preventDefault()
      e.stopPropagation()
    },
    windowMethod(type: number) {
      this.showPrintSetting = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
        } else if (type === 2) {
        }
      })
    },
    getList() {},
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.client_id = []
          this.keyword = ''
          this.user_id = ''
          this.group_id = ''
          this.date = []
          this.type = ''
          this.limit = 10
          this.changeRouter()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    changeRouter() {
      this.$router.push(
        '/fileManage/list?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&client_id=' +
          this.client_id +
          '&user_id=' +
          this.user_id +
          '&group_id=' +
          this.group_id +
          '&type=' +
          this.type +
          '&date=' +
          this.date +
          '&limit=' +
          this.limit
      )
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.client_id = query.client_id ? (query.client_id as string).split(',').map((item) => Number(item)) : []
      this.keyword = query.keyword || ''
      this.type = Number(query.type) || ''
      this.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.date = query.date ? (query.date as string).split(',') : []
      this.limit = Number(query.limit) || 10
    },
    deleteFile(id: number) {
      this.$confirm('是否删除该文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {})
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    shareFile(info: any) {
      this.shareFlag = true
    },
    saveShareFile() {},
    saveUploadFile() {}
  },
  created() {
    this.getFilters()
    this.getList()
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
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/fileManage/list.less';
</style>