<template>
  <div id="storeCreate"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">仓库信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">仓库名称</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入仓库名称"
                v-model="storeInfo.name"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">仓库类型</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择仓库类型"
                v-model="storeInfo.type"
                @change="(ev)=>{storeInfo.tree_data=[]}">
                <el-option v-for="item in storeTypeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">关联单位</span>
              <span class="explanation">(本厂仓库不能选择关联单位)</span>
            </div>
            <div class="info elCtn">
              <el-cascader placeholder="请选择关联单位"
                v-model="storeInfo.tree_data"
                :options="clientList"
                @change="(ev)=>{storeInfo.client_id=ev[2]}"
                :disabled="storeInfo.type===1"></el-cascader>
            </div>
          </div>
        </div>
        <div class="row"
          v-for="(item,index) in storeInfo.secondary_store"
          :key="index">
          <div class="col flex3">
            <div class="label"
              v-if="index===0">
              <span class="text">二级仓库名称</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入二级仓库名称"
                v-model="item.name">
                <template slot="append">
                  <el-radio v-model="isDefault"
                    :label="index">{{isDefault===index?'默认仓库':'其他仓库'}}</el-radio>
                </template>
              </el-input>
            </div>
          </div>
          <div class="opr hoverBlue"
            @click="storeInfo.secondary_store.push({
              name:'',
              is_default:0
            })"
            v-if="index===0">添加</div>
          <div class="opr hoverRed"
            v-if="index>0"
            @click="storeInfo.secondary_store.splice(index,1)">删除</div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">仓库管理员</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择仓库管理员"
                v-model="storeInfo.manager_id">
                <el-option v-for="item in userList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入备注信息"
                v-model="storeInfo.desc"></el-input>
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
          <div class="btn"
            :class="{'backHoverBlue':!$route.query.id,'backHoverOrange':$route.query.id}"
            @click="saveStore">{{$route.query.id?'修改':'提交'}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { user, store } from '@/assets/js/api'
import { StoreInfo } from '@/types/store'
import { storeType } from '@/assets/js/dictionary'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    storeInfo: StoreInfo
    [propName: string]: any
  } {
    return {
      saveLock: false,
      storeInfo: {
        name: '',
        type: 1,
        client_id: '',
        manager_id: '',
        tree_data: [],
        desc: '',
        store_type: Number(this.$route.query.store_type) as 1 | 2 | 3 | 4 | 5 | 6,
        secondary_store: [
          {
            name: '',
            is_default: 0
          }
        ]
      },
      storeTypeList: storeType,
      userList: [],
      isDefault: 0
    }
  },
  computed: {
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) =>
        this.storeInfo.type === 2 ? Number(item.type) === 2 : Number(item.type) === 1
      )
    }
  },
  methods: {
    findClientId(id: number): number[] {
      let arr: number[] = []
      if (id) {
        this.clientList.forEach((item: any) => {
          item.children.forEach((itemChild: any) => {
            itemChild.children.forEach((itemFind: any) => {
              if (itemFind.value === id && arr.length === 0) {
                arr = [item.value, itemChild.value, itemFind.value]
              }
            })
          })
        })
      }
      return arr
    },
    saveStore() {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      this.storeInfo.secondary_store.forEach((item, index) => {
        if (index === this.isDefault) {
          item.is_default = 1
        }
      })
      this.saveLock = true
      store.create(this.storeInfo).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          if (this.$route.query.store_type === '5') {
            this.$router.push('/store/productList?page=1&keyword=&user_id=')
          } else {
            this.$router.push('/store/list?page=1&keyword=&user_id=&store_type=' + this.$route.query.store_type)
          }
        }
        this.saveLock = false
      })
    }
  },
  mounted() {
    user.list().then((res) => {
      if (res.data.status) {
        this.userList = res.data.data
      }
    })
    if (this.$route.query.id) {
      store
        .detail({
          id: Number(this.$route.query.id)
        })
        .then((res) => {
          const data = res.data.data
          this.storeInfo = {
            id: data.id,
            name: data.name,
            type: data.type,
            client_id: data.client_id || '',
            manager_id: data.manager_id || '',
            tree_data: [],
            desc: data.desc,
            store_type: Number(this.$route.query.store_type),
            secondary_store: data.secondary_store.map((item: any) => {
              return {
                id: item.id,
                name: item.name,
                is_default: item.is_default
              }
            })
          }
          this.$nextTick(() => {
            this.storeInfo.tree_data = this.findClientId(data.client_id)
          })
        })
    }
    this.$checkCommonInfo([
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/store/create.less';
</style>