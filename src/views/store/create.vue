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
                v-model="storeInfo.type">
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
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择关联单位"
                v-model="storeInfo.client_id"></el-select>
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
                v-model="storeInfo.secondary_store[index]"></el-input>
            </div>
          </div>
          <div class="opr hoverBlue"
            @click="storeInfo.secondary_store.push('')"
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
          <div class="btn backHoverBlue"
            @click="saveStore">提交</div>
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
      testValue: '',
      storeInfo: {
        name: '',
        type: 1,
        client_id: '',
        manager_id: '',
        desc: '',
        secondary_store: ['']
      },
      storeTypeList: storeType,
      userList: []
    }
  },
  methods: {
    saveStore() {
      store.create(this.storeInfo).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
        }
      })
    }
  },
  mounted() {
    user.list().then((res) => {
      if (res.data.status) {
        this.userList = res.data.data
      }
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/store/create.less';
</style>