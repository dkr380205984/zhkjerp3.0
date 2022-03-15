<template>
  <div id="workerManageUpdate"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">员工信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">员工编号</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工编号"
                v-model="userDetailInfo.name"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">员工姓名</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工姓名"
                v-model="userDetailInfo.name"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">所属部门</span>
              <span class="explanation">(必选)</span>
              <span class="explanation fr"
                style="color: #1a95ff"
                @click="showAddDepartment()">+ 添加新部门</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择部门"
                v-model="userDetailInfo.department">
                <el-option v-for="item in departmentList"
                  :key="item.name"
                  :value="item.name"
                  :label="item.name"></el-option>
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
              <el-select placeholder="请选择员工工种"
                v-model="userDetailInfo.type">
                <el-option value="1"
                  label="临时工"></el-option>
                <el-option value="2"
                  label="合同工"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">入职时间</span>
            </div>
            <div class="info elCtn">
              <el-date-picker v-model="userDetailInfo.entry_time"
                type="date"
                placeholder="选择日期"> </el-date-picker>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">离职时间</span>
            </div>
            <div class="info elCtn">
              <el-date-picker v-model="userDetailInfo.resign_time"
                type="date"
                placeholder="选择日期"> </el-date-picker>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">负责工序</span>
            </div>
            <div class="info elCtn checkbox">
              <el-checkbox-group v-model="userDetailInfo.process">
                <el-checkbox-button style="margin-left: 10px; margin-top: 10px"
                  v-for="item in workProcedure"
                  :label="item.name"
                  :key="item.id">{{ item.name }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="info elCtn">
              <div class="row newProcess">
                <div class="col el-btn"
                  style="flex: 1">
                  <el-button @click="$openUrl('/setting/?pName=工序设置&cName=成品加工工序')">+ 添加新工序</el-button>
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
      <div class="titleCtn"
        style="border-bottom: 0">
        <div class="title">其它信息（全部为选填）</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">年龄</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工年龄"
                v-model="userDetailInfo.age"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">性别</div>
            <div class="info elCtn">
              <el-select placeholder="员工性别"
                v-model="userDetailInfo.sex">
                <el-option :value="1"
                  label="女"></el-option>
                <el-option :value="2"
                  label="男"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">身份证号码</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工身份证号码"
                v-model="userDetailInfo.id_number"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">民族</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工民族"
                v-model="userDetailInfo.nation"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">学历</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工学历"
                v-model="userDetailInfo.education"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">健康状况</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工健康状况"
                v-model="userDetailInfo.health"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">工资卡银行</div>
            <div class="info elCtn">
              <el-input placeholder="请输入卡银行"
                v-model="userDetailInfo.bank"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">银行卡号</div>
            <div class="info elCtn">
              <el-input placeholder="请输入银行卡号"
                v-model="userDetailInfo.card_number"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">是否缴纳社保</div>
            <div class="info elCtn">
              <el-select placeholder="是否缴纳社保"
                v-model="userDetailInfo.social_security">
                <el-option value="1"
                  label="否"></el-option>
                <el-option value="2"
                  label="是"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注</div>
            <div class="info elCtn">
              <el-input placeholder="请输入其它备注"
                v-model="userDetailInfo.desc"></el-input>
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
            @click="saveStaff()">提交</div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="isAddDepartment">
      <div class="main"
        style="width: 1000px">
        <div class="titleCtn">
          <span class="text">添加新部门</span>
          <div class="closeCtn"
            @click="isAddDepartment = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn"
          style="min-height: 70px; display: flex; justify-content: center">
          <el-input v-model="newDepartName"
            style="height: 32px"
            placeholder="请输入新部门名字"></el-input>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="isAddDepartment = false">取消</span>
          <span class="btn backHoverBlue"
            @click="addDepartment()">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { staff, process } from '@/assets/js/api'

export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      newDepartName: '',
      departmentList: [],
      isAddDepartment: false,
      newProcessName: '',
      workProcedure: [],
      userDetailInfo: {}
    }
  },
  methods: {
    showAddDepartment() {
      this.isAddDepartment = true
    },
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
    getDetail() {
      staff
        .detail({
          id: Number(this.$route.query.id)
        })
        .then((res) => {
          if (res.data.data.process !== null) {
            let arr: any = []
            res.data.data.process = res.data.data.process.split('/')
          } else {
            res.data.data.process = []
          }
          this.userDetailInfo = res.data.data
          this.loading = false
        })
    },
    // 工序列表
    getWorkProcedure() {
      process
        .list({
          type: 3
        })
        .then((res: any) => {
          this.workProcedure = res.data.data
          process
            .list({
              type: 2
            })
            .then((ress: any) => {
              ress.data.data.forEach((item: any) => {
                this.workProcedure.push(item)
              })
            })
        })
    },
    // 保存修改
    saveStaff() {
      let userDetailInfo = this.userDetailInfo

      if (userDetailInfo.name === '') {
        this.$message.error('员工姓名不能为空')
        return
      }
      if (userDetailInfo.department === '') {
        this.$message.error('所属部门不能为空')
        return
      }
      if (userDetailInfo.type === '') {
        this.$message.error('员工工种不能为空')
        return
      }

      userDetailInfo.process = userDetailInfo.process.toString().replaceAll(',', '/')

      if (userDetailInfo.resign_time === null) userDetailInfo.status = 1

      staff.addStaff(userDetailInfo).then((res: any) => {
        if (res.data.status) {
          this.$message.success('修改成功')
          this.getDetail()
          return
        }
      })
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
    addNewProcess() {
      process
        .create({
          data: [
            {
              type: 3,
              name: this.newProcessName,
              id: ''
            }
          ]
        })
        .then((res: any) => {
          if (res.data.status) {
            this.$message.success('工序添加成功')
            this.newProcessName = ''
            this.getWorkProcedure()
          }
        })
    }
  },
  mounted() {
    this.getWorkProcedure()
    this.getDepartmentList()
    this.getDetail()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/workerManage/update.less';
</style>
<style lang="less">
#workerManageUpdate {
  .noPadRight {
    .el-input--suffix .el-input__inner {
      padding-right: 0;
    }
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