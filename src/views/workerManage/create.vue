<template>
  <div id="workerManageCreate"
    class="bodyContainer"
    v-loading="loading">
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
              <el-input placeholder="请输入员工姓名"
                v-model="staffInfo.name"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">手机号</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工手机号"
                v-model="staffInfo.phone"></el-input>
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
              <el-select v-model="staffInfo.department"
                clearable>
                <el-option v-for="item in departmentList"
                  :key="item.id"
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
                v-model="staffInfo.type"
                clearable>
                <el-option :value="1"
                  label="临时工"></el-option>
                <el-option :value="2"
                  label="合同工"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">入职时间</span>
            </div>
            <div class="info elCtn">
              <el-date-picker v-model="staffInfo.entry_time"
                type="date"
                placeholder="选择日期"> </el-date-picker>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text"
                style="margin-right: 10px">离职时间</span>
              <el-tooltip class="item"
                effect="dark"
                placement="top">
                <div slot="content">
                  合同工不填写离职时间默认为长期员工，<br />
                  临时工不填写离职时间默认一个月后离职
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <div class="info elCtn">
              <el-date-picker v-model="staffInfo.resign_time"
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
              <el-checkbox-group v-model="staffInfo.process">
                <el-checkbox-button style="margin-left: 10px; margin-top: 10px"
                  v-for="item in workProcedure"
                  :label="item.name"
                  :key="item.name">{{ item.name }}</el-checkbox-button>
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
                v-model="staffInfo.age"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">性别</div>
            <div class="info elCtn">
              <el-select placeholder="请选择员工性别"
                v-model="staffInfo.sex"
                clearable>
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
                v-model="staffInfo.id_number"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">民族</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工民族"
                v-model="staffInfo.nation"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">学历</div>
            <div class="info elCtn">
              <el-select placeholder="请选择员工学历"
                v-model="staffInfo.education"
                clearable>
                <el-option value="小学"
                  label="小学"></el-option>
                <el-option value="初中"
                  label="初中"></el-option>
                <el-option value="高中/职高"
                  label="高中/职高"></el-option>
                <el-option value="大学/大专"
                  label="大学/大专"></el-option>
                <el-option value="研究生"
                  label="研究生"></el-option>
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">健康状况</div>
            <div class="info elCtn">
              <el-input placeholder="请输入员工健康状况"
                v-model="staffInfo.health"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">工资卡银行</div>
            <div class="info elCtn">
              <el-input placeholder="请输入卡银行"
                v-model="staffInfo.bank"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">银行卡号</div>
            <div class="info elCtn">
              <el-input placeholder="请输入银行卡号"
                v-model="staffInfo.card_number"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">是否缴纳社保</div>
            <div class="info elCtn">
              <el-select placeholder="请选择是否缴纳社保"
                v-model="staffInfo.social_security"
                clearable>
                <el-option :value="1"
                  label="否"></el-option>
                <el-option :value="2"
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
                v-model="staffInfo.desc"></el-input>
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
            @click="addStaff()">提交</div>
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
import { staff, process } from '@/assets/js/api'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: false,
      isAddDepartment: false,
      departmentList: [],
      newDepartName: '',
      staffInfo: {
        name: '',
        phone: '',
        department: '',
        type: '',
        entry_time: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
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
        id: ''
      },
      workProcedure: [],
      chooseProcess: [],
      newProcessName: ''
    }
  },
  methods: {
    init() {
      this.departmentList = []
      this.newDepartName = ''
      this.staffInfo = {
        name: '',
        phone: '',
        department: '',
        type: '',
        entry_time: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
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
        id: ''
      }
      this.workProcedure = []
      this.chooseProcess = []
      this.getWorkProcedure()
      this.getDepartmentList()
    },
    // 工序列表
    getWorkProcedure() {
      this.loading = true
      process
        .list({
          type: 3
        })
        .then((res: any) => {
          process
            .list({
              type: 2
            })
            .then((ress: any) => {
              this.workProcedure = res.data.data.concat(ress.data.data)
              this.loading = false
            })
        })
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
    getNowFormatDate() {
      let date = new Date()
      let seperator1 = '-'
      let year = date.getFullYear()
      let month: any = date.getMonth() + 1
      let strDate: any = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },

    dateDiff(a: any) {
      a = '2022-03-01'
      let b = this.getNowFormatDate()
      let arr = a.split('-')
      let starttime = new Date(arr[0], arr[1], arr[2])
      let starttimes = starttime.getTime()

      let arrs: any = b.split('-')
      let lktime = new Date(arrs[0], arrs[1], arrs[2])
      let lktimes = lktime.getTime()

      if (starttimes >= lktimes) {
        alert('开始时间大于离开时间，请检查')
        return false
      } else return true
    },

    // 添加员工
    addStaff() {
      let staffInfo = this.staffInfo
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
      if (staffInfo.phone !== '') {
        if (!this.$checkPhone(staffInfo.phone)) {
          this.$message.error('输入的手机号格式不正确')
          return
        }
      }
      if (staffInfo.id_number !== '') {
        if (!this.$checkIdCardNumber(staffInfo.id_number)) {
          this.$message.error('输入的身份证号不合法')
          return
        }
      }

      staffInfo.process = staffInfo.process.toString().replaceAll(',', '/')
      staff
        .list({
          name: this.staffInfo.name
        })
        .then((res) => {
          if (res.data.data.length > 0) {
            this.$confirm('系统里已存在' + this.staffInfo.name + '，是否继续添加?', '提示', {
              confirmButtonText: '继续添加',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                staff.addStaff(staffInfo).then((res: any) => {
                  if (res.data.status) {
                    this.$message.success('添加成功')
                    this.init()
                  }
                })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
          } else {
            staff.addStaff(staffInfo).then((res: any) => {
              if (res.data.status) {
                this.$message.success('添加成功')
                this.init()
              }
            })
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
              process_desc: '',
              id: '',
              rel_tag: []
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
    this.init()
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