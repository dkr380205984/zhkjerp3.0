<template>
  <div id="newModule"
    class="bodyContainer">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn"
            style="position: relative">
            <el-select style="width: 95%"
              @change="changeDepartment()"
              v-model="department"
              placeholder="部门筛选"
              clearable>
              <el-option v-for="(item, index) in departmentList"
                :key="index"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
            <el-tooltip class="item"
              effect="dark"
              content="保存部门筛选"
              placement="top">
              <i class="el-icon-upload hoverOrange"
                @click="
                  $setLocalStorage('department', department)
                  $message.success('保存成功')
                "></i>
            </el-tooltip>
          </div>
          <div class="elCtn"
            style="position: relative">
            <el-cascader style="width: 95%"
              v-model="process"
              :options="processList"
              :show-all-levels="false"
              filterable
              placeholder="工序筛选"
              clearable></el-cascader>
            <el-tooltip class="item"
              effect="dark"
              content="保存工序筛选"
              placement="top">
              <i class="el-icon-upload hoverOrange"
                @click="
                  $setLocalStorage('process', process)
                  $message.success('保存成功')
                "></i>
            </el-tooltip>
          </div>
          <div class="btn backHoverBlue fr"
            style="margin-left: 20px"
            @click="updateNumber(3)">其它功能</div>
          <div class="btn backHoverOrange fl"
            style="margin-left: 20px"
            @click="showSetting = true">列表设置</div>
        </div>
      </div>
      <div class="listCtn">
        <zh-list :list="showList"
          :listKey="listKey"
          :loading="loading"
          :oprList="oprList"></zh-list>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="list.length"
            :current-page.sync="page"
            @current-change="getShowList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        日志添加区
      </div>
      <div class="listCtn clearfix">
        <div class="btn backHoverBlue fl"
          @click="confirmSubmit">确认{{ isEdit ? '修改' : '提交' }}</div>
        <div class="btn backHoverOrange fl"
          style="margin-left: 20px"
          @click="clearAll">全部清空</div>
      </div>
    </div>
    <!-- 列表设置 -->
    <zh-list-setting @close="showSetting = false"
      @afterSave="getListSetting"
      :show="showSetting"
      :id="listSettingId"
      :type="17"
      :data.sync="listKey"
      :originalData="originalSetting"></zh-list-setting>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { process, listSetting, staff, exportExcel, workshop, check } from '@/assets/js/api'
import { number } from 'echarts'
export default Vue.extend({
  name: 'newModule',
  data(): {
    departmentList: { id: string | number; name: string }[]
    [porpName: string]: any
  } {
    return {
      loading: false,
      showSetting: false,
      page: 1,
      originalSetting: [
        {
          key: 'id',
          name: '序号',
          ifShow: true,
          ifLock: true,
          index: 0
        },
        {
          key: 'client_name',
          name: '下单公司',
          ifShow: true,
          ifLock: true,
          index: 1
        },
        {
          key: 'order_code',
          name: '订单号',
          ifShow: true,
          ifLock: false,
          index: 2
        },
        {
          key: 'product_code',
          name: '产品编号',
          ifShow: true,
          ifLock: false,
          index: 3
        },
        {
          key: 'process_name',
          name: '生产工序',
          ifShow: true,
          ifLock: false,
          index: 4
        },
        {
          key: 'process_desc',
          name: '工序说明',
          ifShow: true,
          ifLock: false,
          index: 5
        },
        {
          key: 'staff_code',
          name: '员工编号',
          ifShow: true,
          ifLock: false,
          index: 6
        },
        {
          key: 'staff_name',
          name: '员工姓名',
          ifShow: true,
          ifLock: false,
          index: 7
        },
        {
          key: 'size_name',
          name: '尺码',
          ifShow: true,
          ifLock: false,
          index: 8
        },
        {
          key: 'color_name',
          name: '颜色',
          ifShow: true,
          ifLock: false,
          index: 9
        },
        {
          key: 'price',
          name: '结算单价（元/件）',
          ifShow: true,
          ifLock: false,
          index: 10
        },
        {
          key: 'number',
          name: '完成数量（件）',
          ifShow: true,
          ifLock: false,
          index: 11
        },
        {
          key: 'extra_number',
          name: '额外数量（件）',
          ifShow: true,
          ifLock: false,
          index: 12
        },
        {
          key: 'total_number',
          name: '合计数量（件）',
          ifShow: true,
          ifLock: false,
          index: 13
        },
        {
          key: 'total_price',
          name: '结算总价（元）',
          ifShow: true,
          ifLock: false,
          index: 14
        },
        {
          key: 'b_number',
          name: 'B品数量（件）',
          ifShow: true,
          ifLock: false,
          index: 15
        },
        {
          key: 'shoddy_number',
          name: '次品数量（件）',
          ifShow: true,
          ifLock: false,
          index: 16
        },
        {
          key: 'shoddy_reason',
          name: '次品原因',
          ifShow: true,
          ifLock: false,
          index: 17
        },
        {
          key: 'group_name',
          name: '负责小组',
          ifShow: true,
          ifLock: false,
          index: 18
        },
        {
          key: 'complete_time',
          name: '创建时间',
          ifShow: true,
          ifLock: false,
          index: 19
        },
        {
          key: 'update_time',
          name: '更新时间',
          ifShow: true,
          ifLock: false,
          index: 20
        },
        {
          key: 'user_name',
          name: '创建人',
          ifShow: true,
          ifLock: false,
          index: 21
        }
      ],
      list: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
        { id: 13 },
        { id: 14 },
        { id: 15 },
        { id: 16 },
        { id: 17 },
        { id: 18 },
        { id: 19 },
        { id: 20 },
        { id: 21 }
      ],
      showList: [],
      listKey: [],
      listSettingId: null,
      oprList: [
        {
          name: '修改',
          class: 'hoverOrange',
          fn: (item: any) => {
            // @ts-ignore
            this.lostEdit(item)
          }
        },
        {
          name: '删除',
          class: 'hoverRed',
          fn: (item: any, index: any) => {
            // @ts-ignore
            this.lostDelete(item.id)
          }
        }
      ],
      department: '',
      departmentName: '',
      departmentList: [],
      process: '',
      processList: [],
      editForm: {},
      isEdit: false
    }
  },
  methods: {
    getListSetting() {
      this.loading = true
      listSetting
        .detail({
          type: 17
        })
        .then((res) => {
          this.listSettingId = res.data.data ? res.data.data.id : null
          this.listKey = res.data.data ? JSON.parse(res.data.data.value) : this.$clone(this.originalSetting)
          this.loading = false
        })
    },
    changeDepartment() {
      if (this.department === '') {
        this.$setLocalStorage('department', '')
        this.departmentName = ''
        return
      }
      staff
        .departmentDetail({
          id: this.department
        })
        .then((res) => {
          this.departmentName = res.data.data.name
        })
    },
    lostDelete(id: string | number) {
      let index = this.list.findIndex((item: { id: string | number }) => item.id === id)
      this.$deleteItem(this.list, index)
      this.getShowList()

      workshop
        .delete({
          id: [id]
        })
        .then((res) => {
          if (res.data.status === true) {
            this.$message.success('删除成功')
          }
        })
    },
    lostEdit(item: any) {
      this.editForm = this.$clone(item)
      this.isEdit = true
    },
    clearAll() {
      this.$confirm('该操作将会清空已填写内容。是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editForm = {}
        this.isEdit = false
        this.$message('清除成功')
      })
    },
    getShowList() {
      this.showList = this.list.slice((this.page - 1) * 10, this.page * 10)
      if (this.showList.length === 0 && this.page > 1) {
        this.page -= 1
        this.getShowList()
      }
    },
    confirmSubmit() {
      if (this.isEdit) {
        let index = this.list.findIndex((item: { id: number }) => item.id === this.editForm.id)
        this.list[index] = this.$clone(this.editForm)
        this.isEdit = false
        this.editForm = {}
        this.$message.success('修改成功')
      } else {
        this.list.push({ id: this.list.length + 1 })
        this.$message.success('提交成功')
      }
      this.getShowList()
    }
  },
  created() {
    // 拿到部门
    staff
      .departmentList({
        keyword: '',
        limit: ''
      })
      .then((res) => {
        if (res.data.status) {
          this.departmentList = res.data.data
          this.departmentName = res.data.data.find((res: any) => {
            return res.id == this.department
          })
          this.departmentName = this.departmentName?.name || ''
        }
      })

    // 拿到工序
    process.list({ type: 2 }).then((res) => {
      let arr: any = []
      res.data.data.forEach((item: any) => {
        arr.push({
          label: item.name,
          value: item.name
        })
      })
      this.processList.push({
        label: '半成品加工工序',
        value: 2,
        children: arr
      })
      process.list({ type: 3 }).then((res) => {
        let arr: any = []
        res.data.data.forEach((item: any) => {
          arr.push({
            label: item.name,
            value: item.name
          })
        })
        this.processList.push({
          label: '成品加工工序',
          value: 3,
          children: arr
        })
      })
    })

    this.department = Number(this.$getLocalStorage('department')) || ''
    let processName: any = this.$getLocalStorage('process') ? this.$getLocalStorage('process').split(',') : []

    processName = processName.length > 0 ? [Number(processName[0]), processName[1]] : processName
    this.process = processName

    this.getListSetting()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/workshopManagement/newModule.less';
</style>
