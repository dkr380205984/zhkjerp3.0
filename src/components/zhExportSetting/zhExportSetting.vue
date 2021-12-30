<template>
  <div class="zhExportSetting popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">导出为excel表格</div>
        <div class="closeCtn"
          @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="contentCtn">
        <div class="flex">
          <div class="orange">{{ dataName }}</div>
          <div class="filterCtn clearfix" style="width:30%">
            <div class="btn backHoverOrange fr"
              @click="resetAll">恢复为初始设置</div>
          </div>
        </div>
        <div class="listCtn">
          <div class="list">
            <div class="row title">
              <div class="col">字段名称</div>
              <div class="col">是否导出</div>
              <div class="col">排序操作</div>
            </div>
            <div class="row"
              v-for="item in selfData"
              :key="item.index">
              <div class="col">{{item.name}}</div>
              <div class="col">
                <el-checkbox v-model="item.ifExport"
                  :disabled="item.ifMust||(!!item.from)">{{item.ifExport?'导出':'不导出'}}</el-checkbox>
              </div>
              <div class="col">
                <div class="opr"
                  :class="item.index===0?'disable':'hoverBlue'" 
                  @click="changeIndex(item.index,1)">上移</div>
                <div class="opr"
                  :class="item.index===selfData.length-1?'disable':'hoverBlue'"
                  @click="changeIndex(item.index,2)">下移</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="btn borderBtn"
          @click="close">关闭</div>
        <div class="btn backHoverBlue"
          @click="saveSetting">保存设置</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { exportExcel } from '@/assets/js/api'
export default Vue.extend({
  props: {
    api: String,
    show: {
      type: Boolean,
      required: true
    },
  
    data: {
      type: Array,
      required: true
    },
    originalData: {
      type: Array,
      required: true
    }
  },
  data(): {
    selfData: any,
    dataName: String,
  } {
    return {
      selfData: [],
      dataName:''
    }
  },
  watch: {
    // 由于列表数据是异步的，所以我们监听父组件传过来的值
    data(newVal) {
      this.selfData = this.$clone(newVal)
      this.selfData.forEach((item:any,index:number) => {
        if(index===0){
          this.dataName = item.name
        } else {
          this.dataName +=`、${item.name}`
        }
      });
    }
  },
  methods: {
    close() {
      this.$emit('close', this.selfData)
    },
    // 1上移 2下移
    changeIndex(index: number, type: 1 | 2) {
      if (type === 2) {
        if (index === this.selfData.length - 1) {
          this.$message.warning('已经是最后一栏')
        } else {
          this.selfData[index + 1].index = index
          this.selfData[index].index = index + 1
          this.selfData.sort((a:any, b:any) => {
            return a.index - b.index
          })
        }
      } else if (type === 1) {
        if (index === 0) {
          this.$message.warning('已经是第一栏')
        } else {
          this.selfData[index - 1].index = index
          this.selfData[index].index = index - 1
          this.selfData.sort((a:any, b:any) => {
            return a.index - b.index
          })
        }
      } else {
        this.$message.error('程序出错，请联系系统管理员')
      }
    },
    // 恢复初始设置
    resetAll() {
      this.$confirm('是否将列表恢复成系统初始设置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.selfData = this.$clone(this.originalData)
          this.$message({
            type: 'success',
            message: '已重置!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    saveSetting() {
      this.$emit('beforeSave', this.selfData)
      // console.log(this.selfData)
      this.$emit('afterSave', this.selfData)
      // exportExcel[this.api]({
      //     client_id: this.id,
      //   })
      //   .then((res: any) => {
      //     if (res.data.status) {
      //       this.$message.success('保存设置成功')
      //       this.$emit('afterSave', res.data.data)
      this.close()
      //     }
      //   })
    }
  }
})
</script>

<style lang="less" scoped>
@import './zhExportSetting.less';
</style>
