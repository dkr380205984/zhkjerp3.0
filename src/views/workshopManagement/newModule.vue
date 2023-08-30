<template>
  <div id="newModule" class="bodyContainer">
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn" style="position: relative">
            <el-cascader
              style="width: 95%"
              v-model="process"
              :options="processList"
              :show-all-levels="false"
              filterable
              placeholder="工序筛选"
              clearable
            ></el-cascader>
            <el-tooltip class="item" effect="dark" content="保存工序筛选" placement="top">
              <i
                class="el-icon-upload hoverOrange"
                @click="
                  $setLocalStorage('process', process)
                  $message.success('保存成功')
                "
              ></i>
            </el-tooltip>
          </div>
          <!-- <div class="btn backHoverBlue fr" style="margin-left: 20px" @click="updateNumber(3)">其它功能</div> -->
          <div class="btn backHoverOrange fl" style="margin-left: 20px" @click="showSetting = true">列表设置</div>
        </div>
      </div>
      <div class="listCtn">
        <zh-list :list="showList" :listKey="listKey" :loading="loading" :oprList="oprList"></zh-list>
        <div class="pageCtn">
          <el-pagination
            background
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="list.length"
            :current-page.sync="page"
            @current-change="getShowList"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module" v-loading="loadingModule">
      <div class="listCtn log">
        <div class="filterCtn">
          <div class="elCtn">
            <div class="filterLabel">订单号：</div>
            <el-input
              v-model="ruleForm.order_code"
              placeholder="输入订单号搜索"
              style="width: 250px"
              @keyup.enter.native="openOrderCode"
            ></el-input>
            <div class="blueBtn" @click="openOrderCode">查找</div>
          </div>
          <div class="elCtn">
            <div class="filterLabel">产品编号：</div>
            <el-input
              v-model="ruleForm.product_code"
              placeholder="输入产品编号搜索"
              style="width: 250px"
              @keyup.enter.native="openProductCode"
            ></el-input>
            <div class="blueBtn" @click="openProductCode">查找</div>
          </div>
          <div class="elCtn">
            <div class="filterLabel">尺码颜色：</div>
            <el-select
              v-model="ruleForm.size_color_id"
              @change="changeSizeColor"
              placeholder="请选择尺码颜色"
              style="width: 250px"
            >
              <el-option
                v-for="(item, index) in ruleForm.selectSizeColor"
                :key="index + 'ruleForm.selectSizeColor'"
                :label="item.name"
                :value="item.size_color_id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <div class="filterLabel">生产工序：</div>
            <el-cascader
              v-model="ruleForm.process"
              filterable
              :options="processList"
              :show-all-levels="false"
              placeholder="请选择工序"
              style="width: 250px"
              @change="getProcessDesc(ruleForm.process)"
            ></el-cascader>
            <div class="op0">查找</div>
          </div>
          <div class="elCtn" style="width: calc(91% - 416px)">
            <div class="filterLabel">工序说明：</div>
            <el-select
              v-model="ruleForm.process_desc"
              multiple
              filterable
              allow-create
              default-first-option
              collapse-tags
              placeholder="请填写工序说明"
              style="width: calc(100% - 100px)"
            >
              <el-option
                v-for="(itemSon, indexSon) in processDesc"
                :key="itemSon + indexSon"
                :label="itemSon"
                :value="itemSon"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <div class="filterLabel">员工姓名：</div>
            <el-select
              v-model="ruleForm.staff_id"
              placeholder="员工姓名或编号搜索"
              filterable
              style="width: 250px"
              @change="changeStaff"
            >
              <el-option v-for="item in staffList" :key="item.value" :label="item.label" :value="item.id"> </el-option>
            </el-select>
            <div class="op0">查找</div>
          </div>
          <div class="elCtn">
            <div class="filterLabel">结算单价：</div>
            <el-input
              v-model="ruleForm.price"
              type="number"
              placeholder="请输入结算单价"
              style="width: 250px"
            ></el-input>
            <div class="op0">查找</div>
          </div>
          <div class="elCtn">
            <div class="filterLabel">操作日期：</div>
            <el-date-picker
              v-model="ruleForm.date"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              style="width: 250px !important"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <div class="filterLabel">完成数量：</div>
            <el-input
              v-model="ruleForm.complete_num"
              type="number"
              placeholder="请输入完成数量"
              @input="getComplete"
              style="width: 250px"
            >
              <template slot="append">件</template>
            </el-input>
            <div class="op0">查找</div>
          </div>
          <div class="elCtn">
            <div class="filterLabel">额外数量：</div>
            <el-input
              v-model="ruleForm.extra_num"
              type="number"
              placeholder="额外数量、加头数量"
              @input="getComplete"
              style="width: 250px"
            >
              <template slot="append">件</template>
            </el-input>
            <div class="op0">查找</div>
          </div>
          <div class="elCtn">
            <div class="filterLabel">合计数量：</div>
            <el-input v-model="ruleForm.number" type="number" placeholder="自动计算" disabled style="width: 250px">
            </el-input>
          </div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <div class="filterLabel">B品数量：</div>
            <el-input v-model="ruleForm.b_number" type="number" placeholder="请输入B品数量" style="width: 250px">
              <template slot="append">件</template>
            </el-input>
            <div class="op0">查找</div>
          </div>
          <div class="elCtn">
            <div class="filterLabel">次品数量：</div>
            <el-input
              v-model="ruleForm.shoddy_number"
              type="number"
              placeholder="次品数量、加头数量"
              style="width: 250px"
            >
              <template slot="append">件</template>
            </el-input>
            <div class="op0">查找</div>
          </div>
          <div class="elCtn">
            <div class="filterLabel">次品原因：</div>
            <el-select
              v-model="ruleForm.shoddy_reason"
              multiple
              filterable
              allow-create
              default-first-option
              collapse-tags
              placeholder="请选择次品原因"
              style="width: 250px"
              @change="$forceUpdate"
            >
              <el-option
                v-for="item in substandardReason"
                :key="item.value + 'ciPinReason'"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="listCtn clearfix">
        <div class="btn backHoverBlue fl" @click="confirmSubmit">确认{{ isEdit ? '修改' : '提交' }}</div>
        <div class="btn backHoverOrange fl" style="margin-left: 20px" @click="clearAll">全部清空</div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
    <!-- 列表设置 -->
    <zh-list-setting
      @close="showSetting = false"
      @afterSave="getListSetting"
      :show="showSetting"
      :id="listSettingId"
      :type="17"
      :data.sync="listKey"
      :originalData="originalSetting"
    ></zh-list-setting>
    <el-dialog title="选择订单" width="70%" :visible.sync="showOrderCode" :before-close="closeOrderCode" class="log">
      <div class="filterCtn">
        <div class="elCtn">
          <div class="filterLabel">订单类型：</div>
          <el-select v-model="order_type" style="width: 250px" placeholder="请选择订单类型" @change="getOrderList">
            <el-option label="全部" :value="''"> </el-option>
            <el-option label="订单" :value="1"> </el-option>
            <el-option label="样单" :value="2"> </el-option>
          </el-select>
        </div>
        <div class="elCtn">
          <div class="filterLabel">下单公司：</div>
          <el-cascader
            @change="getOrderList"
            placeholder="筛选下单公司"
            v-model="client_id"
            filterable
            :options="clientList"
            clearable
          >
          </el-cascader>
        </div>
      </div>
      <div v-loading="loadingOrder" style="margin-top: 16px">
        <div style="display: flex; color: #333333; justify-content: space-between">
          <div style="font-weight: bolder; font-size: 16px; width: 25%">订单类型</div>
          <div style="font-weight: bolder; font-size: 16px; width: 25%">订单号</div>
          <div style="font-weight: bolder; font-size: 16px; width: 25%">下单公司</div>
          <div style="font-weight: bolder; font-size: 16px; width: 25%">下单时间</div>
        </div>
        <div
          style="display: flex; color: #333333; justify-content: space-between; padding: 8px"
          v-for="(item, index) in orderList"
          class="orderItem"
          :key="index + 'orderList'"
          @click="changeOrderCode(item)"
        >
          <div style="font-size: 16px; width: 25%">{{ item.order_type === 1 ? '订单' : '样单' }}</div>
          <div style="font-size: 16px; width: 25%">{{ item.value }}</div>
          <div style="font-size: 16px; width: 25%">{{ item.client_name }}</div>
          <div style="font-size: 16px; width: 25%">{{ item.created_at }}</div>
        </div>
        <div class="listCtn" style="padding: 0">
          <div class="pageCtn">
            <el-pagination
              background
              :page-size="10"
              layout="prev, pager, next, jumper"
              :total="orderTotal"
              :current-page.sync="orderPage"
              @current-change="getOrderList"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="popup" v-show="addOrder" v-loading="showPopupLoading" element-loading-target>
      <div class="main">
        <div class="titleCtn">
          <span class="text">选择产品</span>
          <div class="closeCtn">
            <span class="el-icon-close" @click="closeAddOrder()"></span>
          </div>
        </div>
        <div class="contentCtn log" style="padding-top: 15px; max-height: 700px">
          <div class="filterCtn">
            <div class="elCtn">
              <div class="filterLabel">订单类型：</div>
              <el-select
                v-model="order_type"
                style="width: 250px"
                placeholder="请选择订单类型"
                @change="openProductCode"
              >
                <el-option label="全部" :value="''"> </el-option>
                <el-option label="订单" :value="1"> </el-option>
                <el-option label="样单" :value="2"> </el-option>
              </el-select>
            </div>
          </div>
          <div class="editCtn packOrder">
            <div class="tableCtn">
              <div class="tbody hasTop">
                <div class="trow">
                  <div class="tcol bgGray">订单类型</div>
                  <div class="tcol bgGray">订单号</div>
                  <div class="tcol bgGray">产品编号</div>
                  <div class="tcol bgGray">产品名称</div>
                  <div class="tcol bgGray">产品描述</div>
                  <div class="tcol bgGray">产品图片</div>
                  <div class="tcol bgGray">尺码/颜色</div>
                  <div class="tcol bgGray">尺寸/克重</div>
                  <div class="tcol bgGray">计划生产数量</div>
                  <div class="tcol bgGray">检验入库数量</div>
                </div>
                <div class="trow" v-for="(item, index) in productList" :key="index + 'productionScheduleUpdate'">
                  <div class="tcol">{{ item.order_type == 1 ? '订单' : '样单' }}</div>
                  <div class="tcol">{{ item.code }}</div>
                  <div class="tcol noPad" style="flex: 9.8">
                    <div class="trow" v-for="(itemPro, indexPro) in item.product_info" :key="indexPro + 'pro'">
                      <div class="tcol">{{ itemPro.product_code }}<br />{{ itemPro.category }}</div>
                      <div class="tcol">{{ itemPro.name }}</div>
                      <div class="tcol">{{ contentHtml(itemPro.desc) }}</div>
                      <div class="tcol">
                        <el-image
                          :src="
                            itemPro.image_data.length > 0
                              ? itemPro.image_data[0]
                              : require('@/assets/image/common/noPic.png')
                          "
                          :preview-src-list="itemPro.image_data"
                          fit="cover"
                          style="width: 45px; height: 45px; padding: 10px 0"
                        ></el-image>
                      </div>
                      <div class="tcol noPad" style="flex: 4.85; cursor: pointer">
                        <div
                          class="trow colorItem"
                          v-for="(itemSizeColor, indexSizeColor) in itemPro.colorSizeInfo"
                          @click="chooseColorSize(item, itemPro, itemSizeColor)"
                          :key="itemSizeColor.size_id + 'color' + indexSizeColor"
                        >
                          <div class="tcol" @click="itemSizeColor.check = !itemSizeColor.check">
                            {{ (itemSizeColor.size_name || '无数据') + '/' + (itemSizeColor.color_name || '无数据') }}
                          </div>
                          <div class="tcol" @click="itemSizeColor.check = !itemSizeColor.check">
                            {{ (itemSizeColor.size_info || '无数据') + '/' + (itemSizeColor.weight || 0) }}
                          </div>
                          <div class="tcol" @click="itemSizeColor.check = !itemSizeColor.check">
                            {{ itemSizeColor.number }}
                          </div>
                          <div class="tcol" @click="itemSizeColor.check = !itemSizeColor.check">
                            {{ itemSizeColor.inspection_number }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 5px; margin-top: 5px; display: flex; justify-content: flex-end; padding-right: 25px">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="productTotal"
            :current-page.sync="productPage"
            @current-change="openProductCode"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { process, listSetting, staff, exportExcel, workshop, check, order, checkPriceBeyond } from '@/assets/js/api'
import { number } from 'echarts'
export default Vue.extend({
  name: 'newModule',
  data(): {
    departmentList: { id: string | number; name: string }[]
    [propName: string]: any
  } {
    return {
      loading: false,
      loadingModule: false,
      showSetting: false,
      showOrderCode: false,
      addOrder: false,
      showPopupLoading: false,
      loadingOrder: false,
      order_type: '',
      client_id: '',
      page: 1,
      orderPage: 1,
      productPage: 1,
      orderTotal: 0,
      productTotal: 0,
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
          key: 'staff_label',
          name: '员工编号姓名',
          ifShow: true,
          ifLock: false,
          index: 6
        },
        {
          key: 'size_color_name',
          name: '尺码颜色',
          ifShow: true,
          ifLock: false,
          index: 7
        },
        {
          key: 'price',
          name: '结算单价（元/件）',
          ifShow: true,
          ifLock: false,
          index: 8
        },
        {
          key: 'complete_num',
          name: '完成数量（件）',
          ifShow: true,
          ifLock: false,
          index: 9
        },
        {
          key: 'extra_num',
          name: '额外数量（件）',
          ifShow: true,
          ifLock: false,
          index: 10
        },
        {
          key: 'number',
          name: '合计数量（件）',
          ifShow: true,
          ifLock: false,
          index: 11
        },
        {
          key: 'total_price',
          name: '结算总价（元）',
          ifShow: true,
          ifLock: false,
          index: 12
        },
        {
          key: 'b_number',
          name: 'B品数量（件）',
          ifShow: true,
          ifLock: false,
          index: 13
        },
        {
          key: 'shoddy_number',
          name: '次品数量（件）',
          ifShow: true,
          ifLock: false,
          index: 14
        },
        {
          key: 'shoddy_reason',
          name: '次品原因',
          ifShow: true,
          ifLock: false,
          index: 15
        },
        {
          key: 'date',
          name: '操作日期',
          ifShow: true,
          ifLock: false,
          index: 16
        }
      ],
      substandardReason: [
        {
          value: '织造原因',
          label: '织造原因'
        },
        {
          value: '捻须原因',
          label: '捻须原因'
        },
        {
          value: '拉毛原因',
          label: '拉毛原因'
        },
        {
          value: '刺毛原因',
          label: '刺毛原因'
        },
        {
          value: '水洗原因',
          label: '水洗原因'
        },
        {
          value: '车缝原因',
          label: '车缝原因'
        },
        {
          value: '套口原因',
          label: '套口原因'
        },
        {
          value: '整烫原因',
          label: '整烫原因'
        },
        {
          value: '手工原因',
          label: '手工原因'
        },
        {
          value: '其它原因',
          label: '其它原因'
        }
      ],
      list: [],
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
      staffList: [],
      orderList: [],
      productList: [],
      processDesc: [],
      editForm: {},
      originalForm: {
        order_code: '',
        product_code: '',
        size_name: '',
        color_name: '',
        size_color: '',
        process: '',
        process_desc: '',
        staff_id: '',
        price: '',
        date: this.$moment(new Date()).format('YYYY-MM-DD'),
        complete_num: '',
        extra_num: '',
        number: '',
        b_number: '',
        shoddy_number: '',
        shoddy_reason: ''
      },
      ruleForm: {
        order_code: '',
        product_code: '',
        size_name: '',
        color_name: '',
        size_color: '',
        process: '',
        process_desc: '',
        staff_id: '',
        price: '',
        date: this.$moment(new Date()).format('YYYY-MM-DD'),
        complete_num: '',
        extra_num: '',
        number: '',
        b_number: '',
        shoddy_number: '',
        shoddy_reason: ''
      },
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
    openOrderCode() {
      this.showOrderCode = true
      this.getOrderList()
    },
    openProductCode() {
      this.addOrder = true
      this.showPopupLoading = true
      if (!this.ruleForm.order_id || this.ruleForm.order_code === '') {
        order
          .simpleList({
            order_code: this.ruleForm.order_code,
            product_code: this.ruleForm.product_code,
            order_type: this.order_type,
            client_id: this.client_id,
            page: this.productPage,
            limit: 10
          })
          .then((res) => {
            res.data.data.items.forEach((item: any) => {
              item.product_info = item.product_data.map((itemColor: any) => {
                itemColor.colorSizeInfo = this.$clone(itemColor.product_info)
                return itemColor
              })
            })
            this.productTotal = res.data.data.total
            this.productList = res.data.data.items
            this.showPopupLoading = false
          })
      } else {
        order.detail({ id: this.ruleForm.order_id }).then((res) => {
          let data = res.data.data
          this.productList = [
            {
              id: data.id,
              group_id: data.group_id,
              order_type: data.order_type,
              code: data.code,
              system_code: data.system_code,
              client_name: data.client_name,
              product_info: []
            }
          ]
          data.time_data[0].batch_data[0].product_data.forEach((item: any) => {
            this.productList[0].product_info.push({
              product_code: item.product_code,
              desc: item.desc,
              product_id: item.product_id,
              name: item.name,
              image_data: item.image_data,
              category: item.category + (item.secondary_category ? '/' + item.secondary_category : ''),
              colorSizeInfo: item.product_info
            })
          })
          this.showPopupLoading = false
        })
      }
    },
    closeOrderCode() {
      this.showOrderCode = false
      this.order_type = ''
      this.client_id = ''
      this.orderList = []
    },
    getOrderList() {
      this.loadingOrder = true
      this.$forceUpdate()
      order
        .simpleList({
          order_code: this.ruleForm.order_code,
          order_type: this.order_type,
          client_id: this.client_id ? this.client_id[2] : '',
          page: this.orderPage,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            let arr: any = []
            res.data.data.items.forEach((item: any) => {
              arr.push({
                value: item.code,
                id: item.id,
                created_at: item.created_at,
                client_name: item.client_name,
                order_type: item.order_type
              })
            })
            this.orderList = arr
            this.orderTotal = res.data.data.total
          } else {
            this.orderList = []
          }
          this.loadingOrder = false
        })
    },
    changeOrderCode(item: any) {
      this.ruleForm.order_code = item.value
      this.closeOrderCode()
      this.openProductCode()
    },
    closeAddOrder() {
      this.addOrder = false
      this.order_type = ''
      this.productList = []
    },
    contentHtml(content: string) {
      if (content === null) return ''
      // 富文本编辑器的内容如何只获得文字去掉标签
      // content = content.replace(/<[^>]+>/g, '')
      // 在上面的基础上还去掉了换行<br/>
      content = content.replace(/<[^>]+>/g, '').replace(/(\n)/g, '')
      return content
    },
    chooseColorSize(item: any, itemPro: any, itemSizeColor: any) {
      this.ruleForm.selectSizeColor = itemPro.colorSizeInfo.map((itemSon: any) => {
        itemSon.name = itemSon.size_name + '/' + itemSon.color_name
        itemSon.size_color_id = itemSon.size_id + ',' + itemSon.color_id
        return itemSon
      })
      this.ruleForm.group_id = item.group_id
      this.ruleForm.product_id = itemPro.product_id
      this.ruleForm.client_name = item.client_name
      this.ruleForm.size_name = itemSizeColor.size_name
      this.ruleForm.color_name = itemSizeColor.color_name
      this.ruleForm.size_id = itemSizeColor.size_id
      this.ruleForm.color_id = itemSizeColor.color_id
      this.ruleForm.size_color_name = itemSizeColor.name
      this.ruleForm.size_color_id = itemSizeColor.size_id + ',' + itemSizeColor.color_id
      this.ruleForm.product_code = itemPro.product_code
      this.ruleForm.product_info = this.$clone(itemPro)
      this.ruleForm.order_id = item.id
      this.ruleForm.order_code = item.code
      this.closeAddOrder()
    },
    getProcessDesc(processName: any) {
      process
        .list({
          name: processName[1]
        })
        .then((res: any) => {
          this.processDesc = res.data.data[0].process_desc ? res.data.data[0].process_desc.split(',') : []
        })
      this.$forceUpdate()
    },
    getComplete() {
      this.ruleForm.number = (Number(this.ruleForm.complete_num) + Number(this.ruleForm.extra_num)).toFixed(2)
    },
    changeStaff(e: number) {
      let obj = this.staffList.find((item: any) => {
        return item.id === e
      })
      this.ruleForm.staff_name = obj.name
      this.ruleForm.staff_code = obj.code
      this.ruleForm.staff_label = obj.label
    },
    changeSizeColor(e: any) {
      let obj = this.ruleForm.selectSizeColor.find((item: any) => {
        return item.size_color_id === e
      })
      this.ruleForm.size_name = obj.size_name
      this.ruleForm.color_name = obj.color_name
      this.ruleForm.size_id = obj.size_id
      this.ruleForm.color_id = obj.color_id
      this.ruleForm.size_color_name = obj.name
      this.$forceUpdate()
    },
    lostEdit(item: any) {
      this.ruleForm = this.$clone(item)
      this.ruleForm.process_desc = this.ruleForm.process_desc ? this.ruleForm.process_desc.split(',') : []
      this.ruleForm.shoddy_reason = this.ruleForm.shoddy_reason ? this.ruleForm.shoddy_reason.split(',') : []
      this.$forceUpdate()
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
      if (!this.ruleForm.order_code) {
        this.$message.error('请填写订单号')
        return
      }
      if (!this.ruleForm.product_code) {
        this.$message.error('请填写产品遍号')
        return
      }
      if (!this.ruleForm.size_color_id) {
        this.$message.error('请选择尺码颜色')
        return
      }
      if (!this.ruleForm.process || this.ruleForm.process.length === 0) {
        this.$message.error('请填写选择生产工序')
        return
      }
      if (!this.ruleForm.complete_num) {
        this.$message.error('请填写完成数量')
        return
      }
      if (!this.ruleForm.order_code) {
        this.$message.error('请填写订单号')
        return
      }

      this.loadingModule = true
      const checkArr: any[] = [
        {
          process_name: this.ruleForm.process[1],
          product_id: this.ruleForm.product_id,
          size_id: this.ruleForm.size_id,
          color_id: this.ruleForm.color_id,
          price: this.ruleForm.price
        }
      ]

      let params: {
        type?: number
        data: Array<{
          id: number | string | null
          staff_id: number | string
          order_id: number | string
          group_id: number | string
          process_name: number | string
          process_type: number | string
          process_desc: string
          extra_number: number | string
          product_id: number | string
          size_id: number | string
          color_id: number | string
          number: number | string
          number_B: number | string
          price: number | string
          total_price: number | string
          shoddy_number: number | string
          shoddy_reason: string
          complete_time: string
        }>
      } = {
        data: [
          {
            id: this.ruleForm.id || null,
            staff_id: this.ruleForm.staff_id,
            order_id: this.ruleForm.order_id,
            group_id: this.ruleForm.group_id,
            process_name: this.ruleForm.process[1],
            process_type: this.ruleForm.process[0],
            process_desc: this.ruleForm.process_desc.toString(),
            extra_number: this.ruleForm.extra_num || 0,
            product_id: this.ruleForm.product_id,
            size_id: this.ruleForm.size_id,
            color_id: this.ruleForm.color_id,
            number: this.ruleForm.complete_num,
            number_B: this.ruleForm.b_number,
            price: this.ruleForm.price || 0,
            total_price: (this.ruleForm.price || 0) * (this.ruleForm.number || 0),
            shoddy_number: this.ruleForm.shoddy_number || 0,
            shoddy_reason: this.ruleForm.shoddy_reason.toString(),
            complete_time: this.ruleForm.date
          }
        ]
      }

      // 查询单据单价是否超过报价
      checkPriceBeyond({
        doc_type: 14,
        data: checkArr
      }).then((res) => {
        if (this.isEdit) {
          params.type = 1
        }
        if (res.data.data.length === 0) {
          workshop.save(params).then((res) => {
            if (res.data.status) {
              if (this.isEdit) {
                let index = this.list.findIndex((item: { id: number }) => item.id === this.ruleForm.id)
                let obj = this.$clone(this.ruleForm)
                obj.process_name = obj.process[1]
                obj.process_desc = obj.process_desc.toString()
                obj.shoddy_reason = obj.shoddy_reason.toString()
                obj.date = this.$moment(obj.date).format('YYYY-MM-DD')
                obj.total_price = obj.price * obj.number
                this.list[index] = this.$clone(obj)
                this.isEdit = false
                this.$message.success('修改成功')
              } else {
                let obj = this.$clone(this.ruleForm)
                obj.id = res.data.data[0]
                obj.process_name = obj.process[1]
                obj.process_desc = obj.process_desc.toString()
                obj.shoddy_reason = obj.shoddy_reason.toString()
                obj.date = this.$moment(obj.date).format('YYYY-MM-DD')
                obj.total_price = obj.price * obj.number
                this.list.push(obj)
                this.$message.success('提交成功')
              }
              this.ruleForm.b_number = ''
              this.ruleForm.number = ''
              this.ruleForm.extra_num = ''
              this.ruleForm.shoddy_number = ''
              this.ruleForm.complete_num = ''
              this.ruleForm.shoddy_reason = []
              this.getShowList()
            }
          })
          this.loadingModule = false
        } else {
          const createHtml = this.$createElement
          this.$msgbox({
            message: createHtml(
              'p',
              undefined,
              res.data.data.map((item: string) => {
                return createHtml('p', undefined, item)
              })
            ),
            title: '提示',
            showCancelButton: true,
            confirmButtonText: '继续提交',
            cancelButtonText: '取消提交',
            type: 'warning'
          })
            .then(() => {
              workshop.save(params).then((res) => {
                if (res.data.status) {
                  if (this.isEdit) {
                    let index = this.list.findIndex((item: { id: number }) => item.id === this.ruleForm.id)
                    let obj = this.$clone(this.ruleForm)
                    obj.process_name = obj.process[1]
                    obj.process_desc = obj.process_desc.toString()
                    obj.shoddy_reason = obj.shoddy_reason.toString()
                    obj.date = this.$moment(obj.date).format('YYYY-MM-DD')
                    obj.total_price = obj.price * obj.number
                    this.list[index] = this.$clone(obj)
                    this.isEdit = false
                    this.$message.success('修改成功')
                  } else {
                    let obj = this.$clone(this.ruleForm)
                    obj.id = res.data[0]
                    obj.process_name = obj.process[1]
                    obj.process_desc = obj.process_desc.toString()
                    obj.shoddy_reason = obj.shoddy_reason.toString()
                    obj.date = this.$moment(obj.date).format('YYYY-MM-DD')
                    obj.total_price = obj.price * obj.number
                    this.list.push(obj)
                    this.$message.success('提交成功')
                  }
                  this.ruleForm.b_number = ''
                  this.ruleForm.number = ''
                  this.ruleForm.extra_num = ''
                  this.ruleForm.shoddy_number = ''
                  this.ruleForm.complete_num = ''
                  this.ruleForm.shoddy_reason = []
                  this.getShowList()
                }
              })
              this.loadingModule = false
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              })
            })
        }
      })
    }
  },
  computed: {
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    }
  },
  created() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      }
    ])
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
          staff
            .list({
              status: 1,
              department: this.departmentName
            })
            .then((ress) => {
              this.staffList = ress.data.data.map((item: any) => {
                item.label = item.code.slice(item.code.length - 4) + '-' + item.name
                return item
              })
            })
        }
      })

    // 拿到工序
    process.list({ type: 2 }).then((res) => {
      let arr: any = []
      res.data.data.forEach((item: any) => {
        arr.push({
          label: item.code ? item.code + '-' + item.name : item.name,
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
            label: item.code ? item.code + '-' + item.name : item.name,
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
    let processName = this.$getLocalStorage('process') ? this.$getLocalStorage('process').split(',') : []
    this.getProcessDesc(processName)

    // @ts-ignore
    processName = processName.length > 0 ? [Number(processName[0]), processName[1]] : processName
    this.process = processName
    this.originalForm.process = this.process
    this.ruleForm.process = this.process

    this.getListSetting()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/workshopManagement/newModule.less';
.log {
  .filterCtn {
    display: flex;
    width: 100%;
    .elCtn {
      display: flex;
      align-items: center;
      width: 400px;
    }
  }

  .op0 {
    opacity: 0;
  }

  .blueBtn {
    cursor: pointer;
    background: #51adfd;
    color: white;
    padding: 5px 8px;
    border-radius: 4px;
  }

  .filterLabel {
    width: 100px;
    display: inline-block;
  }
}

.orderItem {
  cursor: pointer !important;
  &:hover {
    background-color: #51adfd;
    color: white !important;
  }
}

.colorItem {
  &:hover {
    background: #51adfd;
    color: white;
  }
}
</style>
