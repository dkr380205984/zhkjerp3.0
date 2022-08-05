<template>
  <div class="bodyContainer"
    id="clientCreate"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">公司编号</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入公司编号"
                v-model="clientInfo.code"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">公司简称</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入公司简称"
                v-model="clientInfo.name"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">公司全称</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入公司全称"
                v-model="clientInfo.alias"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">公司类型</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择公司分类"
                v-model="clientInfo.client_type_id"
                @change="getClientTag">
                <el-option v-for="item in clientTypeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col ">
            <div class="label">
              <span class="text">公司地址</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入公司地址"
                v-model="clientInfo.address"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">客户类型标签</div>
            <div class="info gray"
              v-if="clientTagList.length===0">请先选择公司类型</div>
            <div class="info tagCtn"
              v-if="clientTagList.length>0">
              <span class="yarnNameTag"
                :class="{'active':item.check,'unactive':!item.check}"
                v-for="(item,index) in clientTagList"
                :key="item.value + (item.check?item.check:'aaa')"
                @click="item.check=!item.check;$forceUpdate()">
                <span class="name">{{item.label}}</span>
                <span class="el-icon-close icon"
                  @click.stop="deleteClientTag(item.value,index,item.type)"></span>
              </span>
              <span class="elCtn"
                v-show="clientTagFlag">
                <el-input placeholder="输入新增类型"
                  v-model="clientTagInfo.name"></el-input>
              </span>
              <span class="yarnNameTag"
                :class="clientTagFlag?'active':'addBtn'"
                @click="clientTagFlag?saveClientTag():clientTagFlag=true">{{clientTagFlag?'保存类型':'新增类型'}}
                <i :class="clientTagFlag?'el-icon-document-checked':'el-icon-plus'"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">联系人</div>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="row title">
            <div class="col">姓名</div>
            <div class="col">职务</div>
            <div class="col">联系电话</div>
            <div class="col">常用邮箱</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="(item,index) in clientInfo.contacts_data"
            :key="index">
            <div class="col">
              <div class="elCtn">
                <el-input v-model="item.name"
                  placeholder="请输入姓名"></el-input>
              </div>
            </div>
            <div class="col">
              <div class="elCtn">
                <el-input v-model="item.station"
                  placeholder="请输入职务"></el-input>
              </div>
            </div>
            <div class="col">
              <div class="elCtn">
                <el-input v-model="item.phone"
                  placeholder="请输入联系电话"></el-input>
              </div>
            </div>
            <div class="col">
              <div class="elCtn">
                <el-input v-model="item.email"
                  placeholder="请输入常用邮箱"></el-input>
              </div>
            </div>
            <div class="col">
              <div class="opr hoverRed"
                @click="$deleteItem(clientInfo.contacts_data,index)">删除</div>
            </div>
          </div>
          <div class="oprRow">
            <div class="once"
              @click="$addItem(clientInfo.contacts_data,{id:'', name: '',phone: '',email: '',station: '' })">新增联系人
              <i class="el-icon-plus"></i>
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
          <div class="btn backHoverOrange"
            @click="saveClient">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ClientInfo, ClientTypeInfo } from '@/types/client'
import { client, clientType } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
    clientInfo: ClientInfo
    clientTagInfo: ClientTypeInfo
  } {
    return {
      loading: true,
      clientTagInfo: {
        type: Number(this.$route.query.type),
        client_type_id: null,
        id: null,
        name: ''
      },
      clientTagFlag: false,
      clientTagList: [],
      clientInfo: {
        code: '',
        id: null,
        name: '',
        alias: '',
        contacts_data: [
          {
            id: null,
            name: '',
            phone: '',
            email: '',
            station: ''
          }
        ],
        address: '',
        client_type_id: '',
        rel_tag_data: []
      }
    }
  },
  methods: {
    getClientTag(ev: number) {
      this.clientTagList = this.clientTypeList.find((item: { value: number }) => item.value === ev).children
    },
    deleteClientTag(id: number, index: number, type: 'public' | 'private') {
      if (type === 'public') {
        this.$message.error('该标签属于公共标签，不能由用户删除')
        return
      }
      this.$confirm('是否删除该客户标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          clientType.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.clientTagList.splice(index, 1)
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
    saveClientTag() {
      const formCheck = this.$formCheck(this.clientTagInfo, [
        {
          key: 'name',
          errMsg: '请输入标签名称'
        }
      ])
      if (!formCheck) {
        clientType
          .create({
            type: this.$route.query.type as string,
            client_type_id: this.clientInfo.client_type_id,
            name: this.clientTagInfo.name
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.clientTagList.push({
                label: this.clientTagInfo.name,
                value: res.data.data.id,
                check: true,
                type: 'private'
              })
              this.clientTagFlag = true
            }
          })
      }
    },
    saveClient() {
      this.clientInfo.rel_tag_data = this.clientTagList
        .filter((item: { check: boolean }) => item.check)
        .map((item: { value: any }) => item.value)
      if (this.clientInfo.rel_tag_data.length === 0) {
        this.$message.error('请至少选择一个标签')
        return
      }
      const formCheck = this.$formCheck(this.clientInfo, [
        {
          key: 'name',
          errMsg: '请填写公司名称'
        },
        {
          key: 'client_type_id',
          errMsg: '请选择公司类型'
        }
      ])
      //  ||
      // this.clientInfo.contacts_data.some((item) => {
      //   return this.$formCheck(item, [
      //     {
      //       key: 'name',
      //       errMsg: '请输入联系人姓名'
      //     },
      //     {
      //       key: 'phone',
      //       errMsg: '请输入联系人电话'
      //     }
      //   ])
      // })
      if (!formCheck) {
        client.create(this.clientInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
            // 更新缓存
            this.$checkCommonInfo([
              {
                checkWhich: 'api/clientType',
                getInfoMethed: 'dispatch',
                getInfoApi: 'getClientTypeAsync'
              }
            ])
          }
        })
      }
    }
  },
  computed: {
    clientTypeList() {
      return this.$store.state.api.clientType.arr.filter(
        (item: { type: string }) => Number(item.type) === Number(this.$route.query.type)
      )
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      }
    ])
    client.detail({ id: Number(this.$route.query.id) }).then((res) => {
      this.loading = false
      if (res.data.status) {
        this.clientInfo = res.data.data
        setTimeout(() => {
          this.getClientTag(this.clientInfo.client_type_id as number)
          console.log(this.clientTagList)
          this.clientTagList.forEach((item: any) => {
            const finded = this.clientInfo.rel_tag_data.find((itemFind: any) => itemFind.id === item.value)
            console.log(finded)
            if (finded) {
              item.check = true
            }
          })
        }, 1000)
      }
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/client/create.less';
</style>