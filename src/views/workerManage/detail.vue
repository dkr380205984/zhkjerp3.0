<template>
  <div id="workerManageDetail" class="bodyContainer" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">员工信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">员工编号：</div>
            <div class="text">{{ userDetailInfo.code }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">员工姓名：</div>
            <div class="text">{{ userDetailInfo.name }}</div>
          </div>
          <div class="col">
            <div class="label">手机号：</div>
            <div class="text">{{ userDetailInfo.phone }}</div>
          </div>
          <div class="col">
            <div class="label">所属部门：</div>
            <div class="text">{{ userDetailInfo.department }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">员工工种：</div>
            <div class="text">
              {{ userDetailInfo.type == '1' ? '临时工' : userDetailInfo.type == '2' ? '合同工' : '数据有误' }}
            </div>
          </div>
          <div class="col">
            <div class="label">入职时间：</div>
            <div class="text">{{ userDetailInfo.entry_time }}</div>
          </div>
          <div class="col">
            <div class="label">离职时间：</div>
            <div class="text">{{ userDetailInfo.resign_time }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">负责工序：</div>
            <div class="text" v-for="item in userDetailInfo.process" :key="item">{{ item }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">年龄：</div>
            <div class="text">{{ userDetailInfo.age }}</div>
          </div>
          <div class="col">
            <div class="label">性别：</div>
            <div class="text">
              {{ userDetailInfo.sex == '1' ? '女' : userDetailInfo.sex === '2' ? '男' : '' }}
            </div>
          </div>
          <div class="col">
            <div class="label">身份证号码：</div>
            <div class="text">{{ userDetailInfo.id_number }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">民族：</div>
            <div class="text">{{ userDetailInfo.nation }}</div>
          </div>
          <div class="col">
            <div class="label">学历：</div>
            <div class="text">{{ userDetailInfo.education }}</div>
          </div>
          <div class="col">
            <div class="label">健康状况：</div>
            <div class="text">{{ userDetailInfo.health }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">工资卡银行：</div>
            <div class="text">{{ userDetailInfo.bank }}</div>
          </div>
          <div class="col">
            <div class="label">银行卡号：</div>
            <div class="text">{{ userDetailInfo.card_number }}</div>
          </div>
          <div class="col">
            <div class="label">是否缴纳社保：</div>
            <div class="text">
              {{
                userDetailInfo.social_security == '1'
                  ? '否'
                  : userDetailInfo.social_security === '2'
                  ? '是'
                  : ''
              }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注：</div>
            <div class="text">{{ userDetailInfo.desc }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
          <div class="btn backHoverRed" @click="deleteWorker">
            <svg class="iconFont" aria-hidden="true">
              <use xlink:href="#icon-shanchudingdan"></use>
            </svg>
            <span class="text">离职</span>
          </div>
          <div class="btn backHoverOrange" @click="$router.push('/workerManage/update?id=' + userDetailInfo.id)">
            <svg class="iconFont" aria-hidden="true">
              <use xlink:href="#icon-xiugaidingdan"></use>
            </svg>
            <span class="text">修改</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { staff } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      userDetailInfo: {}
    }
  },
  methods: {
    init(id?: number) {
      this.loading = true

      staff
        .detail({
          id: id || Number(this.$route.query.id)
        })
        .then((res) => {
          if (res.data.data.process !== null) {
            res.data.data.process = res.data.data.process.toString()
          }

          if(res.data.data.entry_time !== null){
            res.data.data.entry_time = res.data.data.entry_time.slice(0, 10)
          }
          
          if(res.data.data.resign_time !== null){
            res.data.data.resign_time = res.data.data.resign_time.slice(0, 10)
          }
          this.userDetailInfo = res.data.data
          this.loading = false
        })
    },
    deleteWorker() {
      this.$confirm('是否离职该员工?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          staff
            .changeStaffStatus({
              data: [
                {
                  id: this.userDetailInfo.id,
                  status: 2
                }
              ]
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '离职成功!'
                })
                this.$router.push('/workerManage/list?page=1&keyword=&department=&status=&type=&limit=10')
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  mounted() {
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/workerManage/detail.less';
</style>
<style lang="less">
#workerManageDetail {
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
  .normalTab {
    .el-tabs__nav {
      margin-left: 32px !important;
    }
  }
}
</style>