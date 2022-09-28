<template>
  <div id="payTimeDetail" class="bodyContainer" v-loading="loading">
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">计时更新</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          选择部门：
          <div class="elCtn" style="position: relative">
            <el-select
              style="width: 95%"
              @change="changeDepartment()"
              v-model="department"
              placeholder="部门筛选"
              clearable
            >
              <el-option
                v-for="(item, index) in departmentList"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" content="保存部门筛选" placement="top">
              <i class="el-icon-upload hoverOrange" @click="$setLocalStorage('department', department)"></i>
            </el-tooltip>
          </div>
          <div class="elCtn" style="margin-left: 20px">
            <el-checkbox v-model="keyBoard" @change="changeKeyBoard">打开页面键盘</el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="tableCtn">
        <div class="tbody" style="overflow: auto" @mousewheel.prevent="listenWheel" ref="listId">
          <div class="trow" style="justify-content: start">
            <div class="tcol bgGray titleFix">员工姓名</div>
            <div class="tcol bgGray titleFix">生产工序</div>
            <div class="tcol bgGray titleFix">工序说明</div>
            <div class="tcol bgGray titleFix">计时方式</div>
            <div class="tcol bgGray titleFix">单价</div>
            <div class="tcol bgGray titleFix">时长</div>
            <div class="tcol bgGray titleFix">总价(元)</div>
            <div class="tcol bgGray titleFix">备注</div>
            <div class="tcol bgGray titleFix">操作</div>
          </div>
        </div>
        <div v-for="(staff, staffIndex) in list" :key="'staff' + staffIndex" style="font-size: 14px; color: #888888">
          <div class="trow" v-if="staff.show" style="justify-content: start; border-bottom: 1px solid #e9e9e9">
            <div class="tcol titleFix">
              <el-cascader
                placeholder="输入员工姓名搜索"
                v-model="staff.staffId"
                :options="processStaffList"
                filterable
                :show-all-levels="false"
                @change="getStaffIdList(staffIndex)"
              ></el-cascader>
            </div>
            <div class="tcol noPad" style="flex: 9.25">
              <div class="trow" v-for="(process, processIndex) in staff.processInfo" :key="'process' + processIndex">
                <div class="tcol">
                  <el-cascader
                    v-model="process.process_name"
                    filterable
                    :options="processList"
                    :show-all-levels="false"
                    clearable
                    @change="getProcessDesc(process, staffIndex)"
                  ></el-cascader>
                </div>
                <div class="tcol">
                  <el-select
                    v-model="process.process_desc"
                    @change="list[staffIndex].is_check = true"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    collapse-tags
                    placeholder="请填写工序说明"
                  >
                    <el-option
                      v-for="(itemSon, indexSon) in process.processDesc"
                      :key="itemSon.value + indexSon"
                      :label="itemSon.label"
                      :value="itemSon.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="tcol">
                  <el-select
                    v-model="process.time_type"
                    placeholder="请选择"
                    @change="list[staffIndex].is_check = true"
                  >
                    <el-option label="按小时计时" :value="1"> </el-option>
                    <el-option label="按天计时" :value="2"> </el-option>
                  </el-select>
                </div>
                <div class="tcol">
                  <zh-input
                    v-model="process.price"
                    :ref="'price-' + staffIndex + '-' + processIndex"
                    placeholder="请输入单价"
                    :keyBoard="keyBoard"
                    @keydown.native="
                      focusByKeydown($event, 'price', [staffIndex, processIndex], staff, ['processInfo', 'processDesc'])
                      list[staffIndex].is_check = true
                    "
                  ></zh-input>
                </div>
                <div class="tcol">
                  <zh-input
                    v-model="process.time_count"
                    :ref="'time_count-' + staffIndex + '-' + processIndex"
                    placeholder="请输入时长"
                    :keyBoard="keyBoard"
                    @keydown.native="
                      focusByKeydown($event, 'time_count', [staffIndex, processIndex], staff, [
                        'processInfo',
                        'processDesc'
                      ])
                      list[staffIndex].is_check = true
                    "
                  ></zh-input>
                </div>
                <div class="tcol">{{ ((process.price || 0) * (process.time_count || 0)).toFixed(3) }} 元</div>
                <div class="tcol">
                  <zh-input
                    v-model="process.desc"
                    :ref="'desc-' + staffIndex + '-' + processIndex"
                    placeholder="请输入备注"
                    @keydown.native="
                      focusByKeydown($event, 'desc', [staffIndex, processIndex], staff, ['processInfo', 'processDesc'])
                      list[staffIndex].is_check = true
                    "
                  ></zh-input>
                </div>
                <div
                  class="tcol"
                  style="flex-direction: row; width: 200px; align-items: center; justify-content: space-between"
                >
                  <div
                    class="hoverBlue"
                    v-if="!isCopy"
                    style="cursor: pointer"
                    @click="copyThis(staffIndex, processIndex)"
                  >
                    复制<br />该行
                  </div>
                  <div
                    class="hoverBlue"
                    v-if="isCopy && copyLine[1] === processIndex && copyLine[0] === staffIndex"
                    style="cursor: pointer"
                    @click="isCopy = false"
                  >
                    取消<br />复制
                  </div>
                  <div
                    class="hoverGreen"
                    v-if="isCopy && (copyLine[1] !== processIndex || copyLine[0] !== staffIndex)"
                    style="cursor: pointer"
                    @click="parseThis(staffIndex, processIndex)"
                  >
                    粘贴<br />该行
                  </div>
                  <div
                    class="hoverBlue"
                    style="cursor: pointer"
                    @click="
                      $addItem(staff.processInfo, {
                        process_name: '',
                        process_type: '',
                        process_desc: '',
                        processDesc: [],
                        time_type: '',
                        time_count: '',
                        price: '',
                        total_price: '',
                        desc: ''
                      })
                    "
                  >
                    添加<br />工序
                  </div>
                  <div
                    style="cursor: pointer"
                    class="hoverRed"
                    @click="checkDelete(staff, process, staffIndex, processIndex)"
                  >
                    删除<br />该行
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="elCtn">
      <el-button type="primary" size="small" @click="openDialog">批量添加员工</el-button>
    </div>
    <div class="elCtn" style="margin-left: 20px">
      <el-button type="primary" size="small" @click="addStaff">添加下一个员工</el-button>
    </div>
    <div class="elCtn" style="margin-left: 20px">
      <el-checkbox-group v-model="copyOption">
        <el-dropdown :hide-on-click="false" trigger="click">
          <el-button size="small" type="primary">
            设置复制项<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-checkbox label="process">生产工序</el-checkbox>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-checkbox label="proces_desc">工序说明</el-checkbox>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-checkbox label="time_type">计时方式</el-checkbox>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-checkbox label="price">结算单价</el-checkbox>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-checkbox label="time_count">时长</el-checkbox>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-checkbox label="desc">备注</el-checkbox>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-checkbox-group>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
          <div class="btn backHoverBlue fr" @click="workSave">确认提交</div>
        </div>
      </div>
    </div>
    <el-dialog title="批量添加员工" width="50%" :visible.sync="showDialog" :before-close="closeDialog">
      <div class="elCtn">
        <el-select v-model="lostAddStaffChooseProcess" placeholder="请选择">
          <el-option v-for="(item, index) in processStaffList" :key="item.value" :label="item.label" :value="index">
          </el-option>
        </el-select>
      </div>
      <el-checkbox-group v-model="staffIdList">
        <el-checkbox
          style="width: calc(100% / 8); margin-top: 10px"
          v-for="item in processStaffList[lostAddStaffChooseProcess].children"
          @change="changeMostStaff(item.id)"
          :key="item.id + '添加员工'"
          :label="item.id"
          >{{ item.code.slice(item.code.length - 4) + '-' + item.name }}</el-checkbox
        >
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirmData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { workshop, staff, process } from '@/assets/js/api'
import zhInput from '@/components/zhInput/zhInput.vue'
export default Vue.extend({
  components: { zhInput },
  data(): {
    [propName: string]: any
  } {
    return {
      loading: false,
      isCopy: false,
      showDialog: false,
      keyBoard: localStorage.showWorkShopKeyBoard === 'true',
      total: 0,
      page: 1,
      month: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
      additional: {},
      copyOption: ['process', 'proces_desc', 'time_type', 'price', 'time_count', 'desc'],
      processStaffList: [],
      lostAddStaffChooseProcess: 0,
      list: [
        {
          staffName: '',
          staffId: '',
          staffCode: '',
          show: true,
          processInfo: [
            {
              process_name: '',
              process_type: '',
              process_desc: '',
              processDesc: [],
              time_type: '',
              time_count: '',
              price: '',
              total_price: '',
              desc: ''
            }
          ]
        }
      ],
      oldList: [
        {
          staffName: '',
          staffId: '',
          staffCode: '',
          show: true,
          processInfo: [
            {
              process_name: '',
              process_type: '',
              process_desc: '',
              processDesc: [],
              time_type: '',
              time_count: '',
              price: '',
              total_price: '',
              desc: ''
            }
          ]
        }
      ],
      processList: [
        {
          value: 0,
          label: '推荐工序',
          children: []
        },
        {
          value: 2,
          label: '半成品加工工序',
          children: []
        },
        {
          value: 3,
          label: '成品加工工序',
          children: []
        }
      ],
      // 已经选择的id列表
      selectStaffIdList: [],
      // 未选择的id列表
      staffIdList: [],
      staffList: [],
      departmentList: [],
      department: Number(this.$getLocalStorage('department')) || '',
      departmentName: ''
    }
  },
  methods: {
    init() {
      let params = {}

      if (this.isAll) {
        params = { page: this.page, limit: 10 }
      } else {
        params = {
          staff_id: this.$route.query.id + '',
          page: this.page,
          limit: 10,
          month: +this.month.split('-')[1],
          year: this.month.split('-')[0]
        }
      }

      process.list({ type: 2 }).then((res) => {
        res.data.data.forEach((item: any) => {
          this.processList[1].children.push({ label: item.name, value: item.name })
        })
      })

      process.list({ type: 3 }).then((res) => {
        res.data.data.forEach((item: any) => {
          this.processList[2].children.push({ label: item.name, value: item.name })
        })
      })

      workshop.list(params).then((res) => {
        this.settlementLogList = res.data.data.items
        this.additional = res.data.data.additional
        this.total = res.data.data.total
      })
    },
    // 应用了个人组件，做一点点改动
    focusByKeydown(ev: any, key: string, indexArr: number[], father: any, keyArr: any[]) {
      // @ts-ignore
      if (!father) {
        // @ts-ignore
        father = this.$data
      }
      // key:ArrowUp
      if (ev.keyCode === 38) {
        if (indexArr.length === 3) {
          if (indexArr[2] === 0) {
            if (indexArr[1] === 0) {
              if (indexArr[0] > 0) {
                // @ts-ignore
                this.$refs[
                  key +
                    '-' +
                    (indexArr[0] - 1) +
                    '-' +
                    (father[keyArr[0]][indexArr[0] - 1][keyArr[1]].length - 1) +
                    '-' +
                    (father[keyArr[0]][indexArr[0] - 1][keyArr[1]][
                      father[keyArr[0]][indexArr[0] - 1][keyArr[1]].length - 1
                    ][keyArr[2]].length -
                      1)
                ][0].focus()
              }
            } else {
              // @ts-ignore
              this.$refs[
                key +
                  '-' +
                  indexArr[0] +
                  '-' +
                  (indexArr[1] - 1) +
                  '-' +
                  (father[keyArr[0]][indexArr[0]][keyArr[1]][indexArr[1] - 1][keyArr[2]].length - 1)
              ][0].focus()
            }
          } else {
            // @ts-ignore
            this.$refs[key + '-' + indexArr[0] + '-' + indexArr[1] + '-' + (indexArr[2] - 1)][0].focus()
          }
        } else if (indexArr.length === 2) {
          if (indexArr[1] === 0) {
            if (indexArr[0] > 0) {
              // @ts-ignore
              this.$refs[
                key + '-' + (indexArr[0] - 1) + '-' + (father[keyArr[0]][indexArr[0] - 1][keyArr[1]].length - 1)
              ][0].$refs.input.focus()
            }
          } else {
            // @ts-ignore
            this.$refs[key + '-' + indexArr[0] + '-' + (indexArr[1] - 1)][0].$refs.input.focus()
          }
        } else if (indexArr.length === 1) {
          if (indexArr[0] > 0) {
            // @ts-ignore
            this.$refs[key + '-' + (indexArr[0] - 1)][0].focus()
          }
        }
      }
      // key:ArrowDown
      else if (ev.keyCode === 40) {
        if (indexArr.length === 3) {
          if (indexArr[2] === father[keyArr[0]][indexArr[0]][keyArr[1]][indexArr[1]][keyArr[2]].length - 1) {
            if (indexArr[1] === father[keyArr[0]][indexArr[0]][keyArr[1]].length - 1) {
              if (indexArr[0] < father[keyArr[0]].length - 1) {
                // @ts-ignore
                this.$refs[key + '-' + (indexArr[0] + 1) + '-0-0'][0].focus()
              }
            } else {
              // @ts-ignore
              this.$refs[key + '-' + indexArr[0] + '-' + (indexArr[1] + 1) + '-0'][0].focus()
            }
          } else {
            // @ts-ignore
            this.$refs[key + '-' + indexArr[0] + '-' + indexArr[1] + '-' + (indexArr[2] + 1)][0].focus()
          }
        } else if (indexArr.length === 2) {
          if (indexArr[1] === father[keyArr[0]][indexArr[0]][keyArr[1]].length - 1) {
            if (indexArr[0] < father[keyArr[0]].length - 1) {
              // @ts-ignore
              this.$refs[key + '-' + (indexArr[0] + 1) + '-0'][0].$refs.input.focus()
            }
          } else {
            // @ts-ignore 这里改了！！！！！！！！！！！！！！！.$refs.input.focus()
            this.$refs[key + '-' + indexArr[0] + '-' + (indexArr[1] + 1)][0].$refs.input.focus()
          }
        } else if (indexArr.length === 1) {
          if (indexArr[0] < father[keyArr[0]].length - 1) {
            // @ts-ignore
            this.$refs[key + '-' + (indexArr[0] + 1)][0].focus()
          }
        }
      }
    },
    // 改变之后把对应的值赋给自身，把选中列表的id更新一下
    getStaffIdList(index: any) {
      const e = this.list[index].staffId

      // 先判断是否重复
      if (
        this.selectStaffIdList.findIndex((item: any) => {
          return item === e[1]
        }) >= 0
      ) {
        // 有重复先置空
        this.list[index].staffId = []
        this.$forceUpdate()
        let _this = this
        // 这里不写延时函数会导致页面不刷新的bug
        setTimeout(() => {
          // 然后通过旧数据还原
          _this.list = _this.$clone(_this.oldList)
          _this.$message.error('请勿选择相同员工')
        }, 200)

        return
      }

      // 拿到对应的员工信息
      let staffInfo = this.staffList.find((staff: any) => {
        return staff.id === e[1]
      })

      // 更新选中列表 以及赋值
      this.selectStaffIdList = []
      this.list.forEach((item: any) => {
        if (item.staffId[1] === staffInfo.id) {
          item.staffName = staffInfo.name
          item.staffCode = staffInfo.code
        }
        this.selectStaffIdList.push(item.staffId[1])
      })
      this.oldList = this.$clone(this.list)
    },
    // 提交数据到列表
    confirmData() {
      this.selectStaffIdList = this.$clone(this.staffIdList)
      if (this.staffIdList.length > 0) {
        // 增加判断
        this.staffIdList.forEach((staffId: number) => {
          // 如果重复则跳过
          let check = this.list.find((item: any) => {
            return item.staffId[1] === staffId
          })

          if (check) {
            return
          }

          let staffInfo = this.staffList.find((staff: any) => {
            return staff.id === staffId
          })
          this.list.push({
            staffName: staffInfo.name,
            staffId: ['', staffId],
            staffCode: staffInfo.code,
            show: true,
            processInfo: [
              {
                process_name: '',
                process_type: '',
                process_desc: '',
                processDesc: [],
                time_type: '',
                time_count: '',
                price: '',
                total_price: '',
                desc: ''
              }
            ]
          })
        })

        this.list.forEach((item: any, index: number) => {
          let a = this.selectStaffIdList.find((staff: any) => {
            return staff === item.staffId[1]
          })

          if (!a) {
            this.list.splice(index, 1)
          }
        })
      } else {
        this.list = [{
            staffName: '',
            staffId: '',
            staffCode: '',
            show: true,
            processInfo: [
              {
                process_name: '',
                process_type: '',
                process_desc: '',
                processDesc: [],
                time_type: '',
                time_count: '',
                price: '',
                total_price: '',
                desc: ''
              }
            ]
          }]
      }

      this.oldList = this.$clone(this.list)
      this.closeDialog()
    },
    changeMostStaff(id: number) {
      // 判断是否在已选中列表里面
      let check = !!this.selectStaffIdList.find((item: any) => {
        return item === id
      })

      // 判断现在是处于什么状态
      let checkType = !!this.staffIdList.find((item: any) => {
        return item === id
      })

      let staffInfo = this.list.find((staff: any) => {
        return staff.staffId[1] === id
      })

      // 在列表中且处于取消状态时
      if (check && !checkType && staffInfo.is_check) {
        this.$confirm('该员工存在数据，取消选择后，会清空数据，是否取消？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {})
          .catch(() => {
            this.staffIdList.push(id)
          })
      }
    },
    openDialog() {
      this.staffIdList = this.$clone(this.selectStaffIdList)
      this.oldList = this.$clone(this.list)
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
    },
    addStaff() {
      this.list.push({
        staffName: '',
        staffId: '',
        staffCode: '',
        show: true,
        processInfo: [
          {
            process_name: '',
            process_type: '',
            process_desc: '',
            processDesc: [],
            time_type: '',
            time_count: '',
            price: '',
            total_price: '',
            desc: ''
          }
        ]
      })
      this.oldList = this.$clone(this.list)
    },
    changeDepartment() {
      if (this.department === '') {
        this.$setLocalStorage('department', '')
        return
      }
      staff
        .departmentDetail({
          id: this.department
        })
        .then((res) => {
          this.departmentName = res.data.data.name
          staff
            .list({
              status: 1,
              department: res.data.data.name
            })
            .then((res) => {
              //   let arr = this.$clone(this.staffList)
              //   res.data.data.forEach((item: any) => {
              //     this.staffList.forEach((staff: any, index: number) => {
              //       if (item.id === staff.id) {
              //         this.$deleteItem(arr, index)
              //       }
              //     })
              //   })
              //   this.staffList = res.data.data.concat(arr)
              this.staffList = res.data.data
              this.processStaffList = this.$getProcessStaff(this.staffList)
            })
        })
    },
    selectListStaffMore(e: Array<Number>) {
      if (e.length === 0) {
        this.$message.error('至少有一个员工')
        this.selectStaffIdList = [
          this.list.filter((item: any) => {
            return item.show
          })[0].staff_id
        ]
        return
      }
      this.loading = true
      e.forEach((id: Number) => {
        let finder = this.list.find((item: any) => item.staffId[1] === id)
        if (finder === undefined) {
          let staffInfo = this.staffList.find((item: any) => item.id === id)
          this.$addItem(this.list, {
            staffName: staffInfo.name,
            staffCode: staffInfo.code,
            staffId: id,
            staff_id: id,
            show: true,
            processInfo: [
              {
                process_name: '',
                process_type: '',
                process_desc: '',
                processDesc: [],
                time_type: '',
                time_count: '',
                price: '',
                total_price: '',
                desc: ''
              }
            ]
          })
        } else {
          finder.show = true
        }
      })

      this.list.forEach((item: any) => {
        let idFinder = e.find((id: Number) => id === item.staffId[1])
        if (idFinder === undefined) {
          item.show = false
        }
      })

      this.loading = false
    },
    workSave() {
      this.loading = true

      let params: {
        type: 2
        data: Array<{
          id: number | string | null
          staff_id: number | string
          process_name: number | string
          process_type: number | string
          process_desc: string
          desc: string
          time_type: string | number
          time_count: string | number
          price: number | string
          total_price: number | string
        }>
      } = {
        type: 2,
        data: []
      }

      this.list.forEach((staff: any) => {
        // console.log(staff, 'staff')
        if (!staff.show) return
        staff.processInfo.forEach((process: any) => {
          // console.log(process, 'process')
          console.log(staff)
          params.data.push({
            id: null,
            staff_id: staff.staffId[1],
            process_name: process.process_name[1],
            process_type: process.process_name[0],
            process_desc: process.process_desc.toString(),
            price: process.price || 0,
            total_price: (process.price || 0) * (process.time_count || 0),
            desc: process.desc,
            time_type: process.time_type,
            time_count: process.time_count || 0
          })
        })
      })

      workshop.save(params).then((res) => {
        if (res.data.status) {
          this.$message.success('提交成功')
          this.numberUpdate = false
          this.$router.push('/workshopManagement/payTimeList?page=1&type=2')
        }
      })
      this.loading = false
    },
    copyThis(staffIndex: any, processIndex: any) {
      this.copyLine = [staffIndex, processIndex]
      this.isCopy = true
    },
    checkDelete(staff: any, process: any, staffIndex: number, processIndex: number) {
      if (staff.processInfo.length > 1) {
        this.$deleteItem(staff.processInfo, processIndex)
      } else {
        let newArrays = this.list.filter(function (item: any) {
          return item.show
        })
        if (newArrays.length > 1) {
          this.list[staffIndex].show = false
        } else {
          this.$message.error('至少有一个员工')
        }
      }
    },
    // 粘贴该行
    parseThis(staffIndex: any, processIndex: any) {
      let strCopyOption = this.copyOption.toString()

      // 复制工序
      if (strCopyOption.indexOf('process') != -1) {
        this.list[staffIndex].processInfo[processIndex].process_name =
          this.list[this.copyLine[0]].processInfo[this.copyLine[1]].process_name
      }

      // 复制工序说明
      if (strCopyOption.indexOf('proces_desc') != -1) {
        this.list[staffIndex].processInfo[processIndex].process_desc =
          this.list[this.copyLine[0]].processInfo[this.copyLine[1]].process_desc
      }

      // 复制计时方式
      if (strCopyOption.indexOf('time_type') != -1) {
        this.list[staffIndex].processInfo[processIndex].time_type =
          this.list[this.copyLine[0]].processInfo[this.copyLine[1]].time_type
      }

      // 复制单价
      if (strCopyOption.indexOf('price') != -1) {
        this.list[staffIndex].processInfo[processIndex].price =
          this.list[this.copyLine[0]].processInfo[this.copyLine[1]].price
      }

      // 复制时长
      if (strCopyOption.indexOf('time_count') != -1) {
        this.list[staffIndex].processInfo[processIndex].time_count =
          this.list[this.copyLine[0]].processInfo[this.copyLine[1]].time_count
      }

      // 复制备注
      if (strCopyOption.indexOf('desc') != -1) {
        this.list[staffIndex].processInfo[processIndex].desc =
          this.list[this.copyLine[0]].processInfo[this.copyLine[1]].desc
      }

      this.isCopy = false
    },
    getProcessDesc(item: any, staffIndex: number) {
      this.list[staffIndex].is_check = true
      process
        .list({
          name: item.process_name[1]
        })
        .then((res) => {
          if (res.data.status) {
            let str = item.process_name[1]
            item.processDesc = []
            if (!res.data.data.length) return

            let detailData = res.data.data.find((item: any) => {
              return item.name === str
            })

            if (detailData.process_desc) {
              detailData.process_desc.split(',').forEach((process_desc: any) => {
                item.processDesc.push({ label: process_desc, value: process_desc })
              })
            }
          } else {
            item.processDesc = []
          }
          this.$forceUpdate()
        })
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page) || 1
      this.month = query.month || new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
      this.id = query.id
    },
    changeKeyBoard(val: boolean) {
      localStorage.showWorkShopKeyBoard = val + ''
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push('/workshopManagement/payTimeDetail?page=' + (this.page || 1) + '&month=' + this.month)
    },
    handleSelectionChange(val: any) {
      this.chooseSettlementLogList = val
    },
    lostAgree() {
      if (this.chooseSettlementLogList.length === 0) {
        this.$message.error('请选择至少一条日志')
        return
      }

      let arr: any = []
      this.chooseSettlementLogList.forEach((settlementLog: any) => {
        arr.push(settlementLog.id)
      })

      workshop
        .check({
          id: arr,
          is_check: 1
        })
        .then((res) => {
          if (res.data.status === true) {
            this.$message.success('审核成功')
            this.init()
          }
        })
    },
    lostDelete() {
      if (this.chooseSettlementLogList.length === 0) {
        this.$message.error('请选择至少一条日志')
        return
      }

      let arr: any = []
      this.chooseSettlementLogList.forEach((settlementLog: any) => {
        arr.push(settlementLog.id)
      })

      workshop
        .delete({
          id: arr
        })
        .then((res) => {
          if (res.data.status === true) {
            this.$message.success('删除成功')
            this.init()
          }
        })
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.init()
    }
  },
  mounted() {
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

        staff
          .list({
            status: 1,
            department: this.departmentName
          })
          .then((res) => {
            this.staffList = res.data.data
            this.processStaffList = this.$getProcessStaff(this.staffList)
            // console.log(this.$getProcessStaff(this.staffList))
            res.data.data.forEach((item: any) => {
              if (item.process) {
                let processArr = item.process.split('/')
                processArr.forEach((name: String) => {
                  this.processList[0].children.push({
                    label: name,
                    value: name
                  })
                })
              }
              return
            })
          })
      })
    this.getFilters()
    this.init()
  }
})
</script>

<style lang="less">
@import '~@/assets/css/workshopManagement/payTimeDetail.less';
#payTimeDetail {
  .tcol {
    .el-input input {
      padding: 3px 0;
      border: none;
    }

    .zhInputCtn {
      .zhInputBox {
        .zhInput {
          border: 0;
          padding: 0;
        }
      }
    }

    .el-input__suffix {
      display: none;
    }
  }
}
</style>