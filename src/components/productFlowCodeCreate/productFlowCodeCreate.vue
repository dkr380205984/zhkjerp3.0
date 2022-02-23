<template>
  <div class="zhListSetting popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">生成生产流转码</div>
        <div class="closeCtn"
          @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="contentCtn">
        <div class="explainCtn"><span class="green">选择公司后，再输入本次生成数量，即可完成！</span></div>
        <div class="listCtn">
          <div class="filterCtn clearfix" style="display:flex">
            <div style="width:50%">
              <div style="display:flex;align-items: center;">
                <span style="width:30%">目标工厂：</span>
                <el-input style="width:50%;height:30px;" placeholder="搜索客户名称" v-model="searchName"></el-input>
              </div>
              <div style="position:relative;display:flex;align-items: center;margin-top:20px">
                <span style="width:30%">本次生成数：</span>
                <el-input style="width:50%;height:30px;" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="多少" v-model="number"></el-input>
                <span style="position: absolute; right:25%">张</span>
              </div>
            </div>
            <div style="width:50%;padding-left:20px">
              <div>目标工厂信息</div>
              <div style="display:flex;margin-top:20px">
                <div style="width:40%">客户名</div>
                <div style="width:60%">222</div>
              </div>
              <div style="display:flex;margin-top:20px">
                <div style="width:40%">已生成数</div>
                <div style="width:60%">333</div>
              </div>
              <div style="display:flex;margin-top:20px">
                <div style="width:40%">已使用数</div>
                <div style="width:60%">444</div>
              </div>
              <div style="display:flex;margin-top:200px"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="oprCtn">
        <div class="btn borderBtn"
          @click="close">取消</div>
        <div class="btn backHoverBlue"
          @click="confirmCreate">确认生成</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ListSetting } from '@/types/list'
import { listSetting } from '@/assets/js/api'
export default Vue.extend({
  props: {
    id: {
      type: [Number, Object]
    },
    show: {
      type: Boolean,
      required: true
    },
    // 1:报价单 2.样单 3.订单 4.物料计划 5.物料出入库 6.生产计划  7.产品检验 8.包装计划
    type: {
      type: Number,
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
    selfData: ListSetting[],
    number: String,
    searchName: String
  } {
    return {
      selfData: [],
      number:'',
      searchName:''
    }
  },
  watch: {
    // 由于列表数据是异步的，所以我们监听父组件传过来的值
    data(newVal) {
      this.selfData = this.$clone(newVal) as ListSetting[]
    }
  },
  methods: {
    close() {
      this.$emit('close', this.selfData)
    },
    // 1上移 2下移 3锁定在左侧
    // 注意：锁定在左侧操作需要重排index
    changeIndex(index: number, type: 1 | 2 | 3) {
      if (type === 3) {
        // 锁定和解锁分开处理
        if (this.selfData[index].ifLock) {
          const lockLength = this.selfData.filter((item) => item.ifLock).length
          this.selfData.forEach((item) => {
            item.index = item.index > lockLength - 2 && item.index < index ? item.index + 1 : item.index
          })
          this.selfData[index].index = lockLength - 1
          this.selfData.sort((a, b) => {
            return a.index - b.index
          })
        } else {
          const lockLength = this.selfData.filter((item) => item.ifLock).length
          this.selfData.forEach((item) => {
            item.index = item.index <= lockLength && item.index > index ? item.index - 1 : item.index
          })
          this.selfData[index].index = lockLength
          this.selfData.sort((a, b) => {
            return a.index - b.index
          })
        }
      } else if (type === 2) {
        const lockLength = this.selfData.filter((item) => item.ifLock).length
        if (index === lockLength - 1) {
          this.$message.warning('锁定栏不能下移到非锁定栏')
        } else if (index === this.selfData.length - 1) {
          this.$message.warning('已经是最后一栏')
        } else {
          this.selfData[index + 1].index = index
          this.selfData[index].index = index + 1
          this.selfData.sort((a, b) => {
            return a.index - b.index
          })
        }
      } else if (type === 1) {
        const lockLength = this.selfData.filter((item) => item.ifLock).length
        if (index === lockLength) {
          this.$message.warning('非锁定栏不能上移到锁定栏')
        } else if (index === 0) {
          this.$message.warning('已经是第一栏')
        } else {
          this.selfData[index - 1].index = index
          this.selfData[index].index = index - 1
          this.selfData.sort((a, b) => {
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
          this.selfData = this.$clone(this.originalData) as ListSetting[]
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
    // 恢复本次操作
    resetNow() {
      this.$confirm('是否重置本次所有操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.selfData = this.$clone(this.data) as ListSetting[]
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
    confirmCreate() {
      this.$emit('beforeSave', this.selfData)
      listSetting
        .create({
          id: this.id,
          type: this.type,
          value: JSON.stringify(this.selfData)
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('保存设置成功')
            this.$emit('afterSave', this.selfData)
            this.close()
          }
        })
    }
  }
})
</script>

<style lang="less" scoped>
@import './productFlowCodeCreate.less';
</style>
