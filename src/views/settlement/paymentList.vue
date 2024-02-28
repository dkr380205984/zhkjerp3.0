<template>
  <div id="paymentList" class="bodyContainer">
    <div class="topTagCtn">
      <div
        class="tag"
        @click="
          $router.push(
            '/settlement/collectionList?page=&limit&type=&keyword=&client_id=&status=&clientType=&tag_id=&only_delete=&year=&settle_unit='
          )
        "
      >
        <div class="iconCtn">
          <svg class="iconFont" aria-hidden="true">
            <use xlink:href="#icon-kehuguanli"></use>
          </svg>
        </div>
        <span class="text">应收款客户</span>
      </div>
      <div class="tag active">
        <div class="iconCtn">
          <svg class="iconFont" aria-hidden="true">
            <use xlink:href="#icon-hezuodanweiguanli"></use>
          </svg>
        </div>
        <span class="text">应付款单位</span>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-cascader placeholder="筛选下单公司"
              v-model="client_id"
              filterable
              :props="{emitPath:false}"
              :show-all-levels="false"
              :options="clientList"
              @change="changeRouter"
              clearable>
            </el-cascader>
          </div>
          <div class="elCtn">
            <el-select placeholder="筛选客户状态" v-model="status" @change="changeRouter">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="合作中" :value="1"></el-option>
              <el-option label="暂停合作" :value="0"></el-option>
            </el-select>
          </div>
          <!-- <div class="elCtn">
            <el-select
              placeholder="客户类型筛选"
              v-model="clientType"
              @change="
                tag_id = ''
                getClientTag($event)
              "
              clearable
            >
              <el-option v-for="item in clientTypeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div> -->
          <div class="elCtn">
            <el-date-picker v-model="year" @change="changeRouter" value-format="yyyy" type="year" placeholder="选择年">
            </el-date-picker>
          </div>
          <div class="elCtn">
            <el-select placeholder="待付款金额计算方式" v-model="methods" @change="changeRouter">
              <el-option label="计划总额 - 付款总额 - 扣款总额" value="1"></el-option>
              <el-option label="实际总额 - 付款总额 - 扣款总额" value="2"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn" @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <!-- <div class="elCtn">
            <el-select placeholder="客户标签筛选" v-model="tag_id" @change="changeRouter" clearable>
              <el-option v-for="item in clientTagList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div> -->
          
          <div class="elCtn">
            <el-select v-model="limit" placeholder="每页展示条数" @change="changeRouter">
              <el-option v-for="item in limitList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-checkbox v-model="only_delete" @change="changeRouter" :true-label="1">查询已删除的数据</el-checkbox>
          </div>
        </div>
        <div class="description">
          当前统计默认值：下单年份：{{ year }}年；下单客户：默认所有；币种：{{ settle_unit || '所有' }}；合作状态：{{
            status === 0 ? '暂停合作' : status === 1 ? '合作中' : '全部'
          }}
        </div>
        <div class="list" v-loading="loading" style="font-size:14px">
          <div class="row title">
            <div class="col">公司简称</div>
            <div class="col">客户类型</div>
            <div class="col">
              计划总额
              <div class="sortCtn">
                <div
                  class="el-icon-caret-top"
                  :class="{ active: sortCol === 'total_plan_price' && sort === 'asc' }"
                  @click="
                    sortCol = 'total_plan_price'
                    sort = 'asc'
                    getList()
                  "
                ></div>
                <div
                  class="el-icon-caret-bottom"
                  :class="{ active: sortCol === 'total_plan_price' && sort === 'desc' }"
                  @click="
                    sortCol = 'total_plan_price'
                    sort = 'desc'
                    getList()
                  "
                ></div>
              </div>
            </div>
            <div class="col">
              计划总数
              <div class="sortCtn">
                <div
                  class="el-icon-caret-top"
                  :class="{ active: sortCol === 'total_plan_number' && sort === 'asc' }"
                  @click="
                    sortCol = 'total_plan_number'
                    sort = 'asc'
                    getList()
                  "
                ></div>
                <div
                  class="el-icon-caret-bottom"
                  :class="{ active: sortCol === 'total_plan_number' && sort === 'desc' }"
                  @click="
                    sortCol = 'total_plan_number'
                    sort = 'desc'
                    getList()
                  "
                ></div>
              </div>
            </div>
            <div class="col">
              实际总额
              <div class="sortCtn">
                <div
                  class="el-icon-caret-top"
                  :class="{ active: sortCol === 'total_real_price' && sort === 'asc' }"
                  @click="
                    sortCol = 'total_real_price'
                    sort = 'asc'
                    getList()
                  "
                ></div>
                <div
                  class="el-icon-caret-bottom"
                  :class="{ active: sortCol === 'total_real_price' && sort === 'desc' }"
                  @click="
                    sortCol = 'total_real_price'
                    sort = 'desc'
                    getList()
                  "
                ></div>
              </div>
            </div>
            <div class="col">
              实际总数
              <div class="sortCtn">
                <div
                  class="el-icon-caret-top"
                  :class="{ active: sortCol === 'total_real_number' && sort === 'asc' }"
                  @click="
                    sortCol = 'total_real_number'
                    sort = 'asc'
                    getList()
                  "
                ></div>
                <div
                  class="el-icon-caret-bottom"
                  :class="{ active: sortCol === 'total_real_number' && sort === 'desc' }"
                  @click="
                    sortCol = 'total_real_number'
                    sort = 'desc'
                    getList()
                  "
                ></div>
              </div>
            </div>
            <div class="col">
              开票总额
              <div class="sortCtn">
                <div
                  class="el-icon-caret-top"
                  :class="{ active: sortCol === 'total_invoice_price' && sort === 'asc' }"
                  @click="
                    sortCol = 'total_invoice_price'
                    sort = 'asc'
                    getList()
                  "
                ></div>
                <div
                  class="el-icon-caret-bottom"
                  :class="{ active: sortCol === 'total_invoice_price' && sort === 'desc' }"
                  @click="
                    sortCol = 'total_invoice_price'
                    sort = 'desc'
                    getList()
                  "
                ></div>
              </div>
            </div>
            <div class="col">
              付款总额
              <div class="sortCtn">
                <div
                  class="el-icon-caret-top"
                  :class="{ active: sortCol === 'total_pay_price' && sort === 'asc' }"
                  @click="
                    sortCol = 'total_pay_price'
                    sort = 'asc'
                    getList()
                  "
                ></div>
                <div
                  class="el-icon-caret-bottom"
                  :class="{ active: sortCol === 'total_pay_price' && sort === 'desc' }"
                  @click="
                    sortCol = 'total_pay_price'
                    sort = 'desc'
                    getList()
                  "
                ></div>
              </div>
            </div>
            <div class="col">
              扣款总额
              <div class="sortCtn">
                <div
                  class="el-icon-caret-top"
                  :class="{ active: sortCol === 'total_deduct_price' && sort === 'asc' }"
                  @click="
                    sortCol = 'total_deduct_price'
                    sort = 'asc'
                    getList()
                  "
                ></div>
                <div
                  class="el-icon-caret-bottom"
                  :class="{ active: sortCol === 'total_deduct_price' && sort === 'desc' }"
                  @click="
                    sortCol = 'total_deduct_price'
                    sort = 'desc'
                    getList()
                  "
                ></div>
              </div>
            </div>
            <div class="col">
              待付款金额
              <div class="sortCtn">
                <div
                  class="el-icon-caret-top"
                  :class="{ active: sortCol === 'total_deduct_price' && sort === 'asc' }"
                  @click="
                    sortCol = 'wait_pay_price'
                    sort = 'asc'
                    getList()
                  "
                ></div>
                <div
                  class="el-icon-caret-bottom"
                  :class="{ active: sortCol === 'total_deduct_price' && sort === 'desc' }"
                  @click="
                    sortCol = 'wait_pay_price'
                    sort = 'desc'
                    getList()
                  "
                ></div>
              </div>
            </div>
            <div class="col">操作</div>
          </div>
          <div class="row" v-for="item in list" :key="item.id">
            <div class="col">{{ item.name }}</div>
            <div class="col">{{ item.client_type_name }}</div>
            <div class="col">{{ $toFixed(item.total_plan_price, 3, true) }}万元</div>
            <div class="col">
              <template v-if="item.client_type_name === '纱线原料单位' || item.client_type_name === '原料加工单位'">
                {{ $toFixed(item.total_plan_number / 1000, 3, true) }}吨
              </template>
              <template v-else-if="item.client_type_name === '面料原料单位'">
                {{ $toFixed(item.total_plan_number / 1000, 3, true) }}千米
              </template>
              <template
                v-else-if="item.client_type_name === '装饰辅料单位' || item.client_type_name === '包装辅料单位'"
              >
                {{ $toFixed(item.total_plan_number / 10000, 3, true) }}万个
              </template>
              <template
                v-else-if="item.client_type_name === '生产织造单位' || item.client_type_name === '生产加工单位'"
              >
                {{ $toFixed(item.total_plan_number / 10000, 3, true) }}万件
              </template>
              <template v-else-if="item.client_type_name === '运输单位'">
                {{ $toFixed(item.total_plan_number, 3, true) }}立方
              </template>
            </div>
            <div class="col">{{ $toFixed(item.total_real_price) }}万元</div>
            <div class="col">
              <template v-if="item.client_type_name === '纱线原料单位' || item.client_type_name === '原料加工单位'">
                {{ $toFixed(item.total_real_number / 1000, 3, true) }}吨
              </template>
              <template v-else-if="item.client_type_name === '面料原料单位'">
                {{ $toFixed(item.total_real_number / 1000, 3, true) }}千米
              </template>
              <template
                v-else-if="item.client_type_name === '装饰辅料单位' || item.client_type_name === '包装辅料单位'"
              >
                {{ $toFixed(item.total_real_number / 10000, 3, true) }}万个
              </template>
              <template
                v-else-if="item.client_type_name === '生产织造单位' || item.client_type_name === '生产加工单位'"
              >
                {{ $toFixed(item.total_real_number / 10000, 3, true) }}万件
              </template>
              <template v-else-if="item.client_type_name === '运输单位'">
                {{ $toFixed(item.total_real_number, 3, true) }}立方
              </template>
            </div>
            <div class="col">{{ $toFixed(item.total_invoice_price, 3, true) }}万元</div>
            <div class="col">{{ $toFixed(item.total_pay_price, 3, true) }}万元</div>
            <div class="col">{{ $toFixed(item.total_deduct_price, 3, true) }}万元</div>
            <div class="col">{{ $toFixed(item.wait_pay_price, 3, true) }}万元</div>
            <div class="col oprCtn">
              <span
                class="opr hoverBlue"
                @click="$router.push('/settlement/paymentDetail?id=' + item.id + '&type=' + item.client_type_name)"
                >详情</span
              >
            </div>
          </div>
          <div class="row">
            <div class="col green">合计：</div>
            <div class="col"></div>
            <div class="col green bold">{{ $toFixed(totalData.total_plan_price / 10000, 3, true) }}万元</div>
            <div class="col green bold">
              <template v-if="!clientTypeName">-</template>
              <template v-else-if="clientTypeName === '纱线原料单位' || clientTypeName === '原料加工单位'">
                {{ $toFixed(totalData.total_plan_number / 1000, 3, true) }}吨
              </template>
              <template v-else-if="clientTypeName === '面料原料单位'">
                {{ $toFixed(totalData.total_plan_number / 1000, 3, true) }}千米
              </template>
              <template v-else-if="clientTypeName === '装饰辅料单位' || clientTypeName === '包装辅料单位'">
                {{ $toFixed(totalData.total_plan_number / 10000, 3, true) }}万个
              </template>
              <template v-else-if="clientTypeName === '生产织造单位' || clientTypeName === '生产加工单位'">
                {{ $toFixed(totalData.total_plan_number / 10000, 3, true) }}万件
              </template>
              <template v-else-if="clientTypeName === '运输单位'">
                {{ $toFixed(totalData.total_plan_number, 3, true) }}立方
              </template>
            </div>
            <div class="col green bold">{{ $toFixed(totalData.total_real_price / 10000, 3, true) }}万元</div>
            <div class="col green bold">
              <template v-if="!clientTypeName">-</template>
              <template v-else-if="clientTypeName === '纱线原料单位' || clientTypeName === '原料加工单位'">
                {{ $toFixed(totalData.total_real_number / 1000, 3, true) }}吨
              </template>
              <template v-else-if="clientTypeName === '面料原料单位'">
                {{ $toFixed(totalData.total_real_number / 1000, 3, true) }}千米
              </template>
              <template v-else-if="clientTypeName === '装饰辅料单位' || clientTypeName === '包装辅料单位'">
                {{ $toFixed(totalData.total_real_number / 10000, 3, true) }}万个
              </template>
              <template v-else-if="clientTypeName === '生产织造单位' || clientTypeName === '生产加工单位'">
                {{ $toFixed(totalData.total_real_number / 10000, 3, true) }}万件
              </template>
              <template v-else-if="clientTypeName === '运输单位'">
                {{ $toFixed(totalData.total_real_number, 3, true) }}立方
              </template>
            </div>
            <div class="col green bold">{{ $toFixed(totalData.total_invoice_price, 3, true) }}万元</div>
            <div class="col green bold">{{ $toFixed(totalData.total_pay_price, 3, true) }}万元</div>
            <div class="col green bold">{{ $toFixed(totalData.total_deduct_price, 3, true) }}万元</div>
            <div class="col green bold">
              {{
                $toFixed(
                  totalData.total_real_price / 10000 - totalData.total_pay_price - totalData.total_deduct_price,
                  3,
                  true
                )
              }}万元
            </div>
            <div class="col"></div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination
            background
            :page-size="limit"
            layout="prev, pager, next, jumper"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter($event, true)"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn" style="float:left">
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">批量导入单据</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange" @click="importExcelData('开票单据')">
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">开票单据</span>
                </div>
                <div class="btn backHoverBlue" @click="importExcelData('付款单据')">
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">付款单据</span>
                </div>
                <div class="btn backHoverRed" @click="importExcelData('我方扣款单据')">
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">扣款单据</span>
                </div>
              </div>
            </div>
          </div>
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">下载导入模板</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange" @click="downloadExcel('开票单据模板')">
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">开票单据</span>
                </div>
                <div class="btn backHoverBlue" @click="downloadExcel('付款单据模板')">
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">付款单据</span>
                </div>
                <div class="btn backHoverRed" @click="downloadExcel('扣款单据模板')">
                  <svg class="iconFont" aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">扣款单据</span>
                </div>
              </div>
            </div>
          </div>
          <span class="btn hoverBlue">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">
                第一步：下载导入模板。<br />
                第二步：填写模板信息。注意：请填写客户或单位简称，且填写的简称必须与系统添加的简称保持一致；金额字段必须为数字；日期字段的格式必须为yyyy-mm-dd（2022-01-01）；订单号必须为系统订单编号；关联单据编号必须为系统关联编号；否则会出现无法导入或者导入错误的情况。<br />
                第三步：导入模板，完成导入
              </div>
              <span>导入教程</span>
            </el-tooltip>
          </span>
        </div>
        <div class="btnCtn">
          <span class="btn backHoverGreen" @click="excelFlag = true">导出EXCEL</span>
        </div>
      </div>
    </div>
    <div class="popup" v-show="excelFlag">
      <div class="main" style="width:500px">
        <div class="titleCtn">
          <span class="text">导出EXCEL筛选条件</span>
          <div class="closeCtn" @click="excelFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label" style="line-height:32px">选择类型：</div>
            <div class="elCtn info">
              <el-select placeholder="客户类型筛选" v-model="clientTypeExcel" clearable>
                <el-option
                  v-for="item in clientTypeList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label" style="line-height:32px">选择年份：</div>
            <div class="elCtn info">
              <el-date-picker
                type="year"
                v-model="yearExcel"
                placeholder="选择年份"
                value-format="yyyy"
              ></el-date-picker>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" @click="excelFlag = false">取消</span>
          <span class="btn backHoverBlue" @click="exportExcel">确认导出</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { client, clientType, deduct, invoice, payment } from '@/assets/js/api'
import { limitArr, moneyArr } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      clientTypeExcel: '',
      yearExcel: new Date().getFullYear().toString(),
      excelFlag: false,
      loading: true,
      keyword: '',
      client_id: '',
      // clientType: '',
      clientList: [],
      list: [],
      totalList: [],
      page: 1,
      total: 1,
      limit: 10,
      type: 2,
      status: 1,
      tag_id: '',
      bindFlag: false,
      clientTypeList: [],
      clientTagList: [],
      limitList: limitArr,
      only_delete: 0,
      settle_unit: '',
      unitArr: moneyArr,
      methods: '1',
      year: new Date().getFullYear().toString(),
      totalData: {
        total_pay_price: 0,
        total_deduct_price: 0,
        total_invoice_price: 0,
        total_plan_number: 0,
        total_plan_price: 0,
        total_real_number: 0,
        total_real_price: 0
      },
      sortCol: 'total_plan_price',
      sort: 'desc'
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  computed: {
    clientTypeName(): any {
      return this.$route.query.clientType
        ? this.clientTypeList.find((item: any) => item.id === Number(this.$route.query.clientType)).name
        : ''
    },
  },
  methods: {
    downloadExcel(type: string) {
      if (type === '开票单据模板') {
        this.$downloadExcel(
          [],
          [
            { title: '客户/单位名称(必填，系统简称)', key: 'client_zh' },
            { title: '关联单号(选填)', key: 'doc_code' },
            { title: '发票代码(选填)', key: 'invoice_number' },
            { title: '发票号码(选填)', key: 'invoice_code' },
            { title: '发票类型(默认专票)', key: 'type' },
            { title: '发票类型(订单开票、其它开票)', key: 'doc_type' },
            { title: '税率(必填)', key: 'tax_rate' },
            { title: '开票金额(税价合计，必填)', key: 'price' },
            { title: '备注信息(选填)', key: 'desc' }
          ],
          type
        )
      } else if (type === '扣款单据模板') {
        this.$downloadExcel(
          [],
          [
            { title: '扣款单位(必填)', key: 'client_zh' },
            { title: '关联单号(选填)', key: 'doc_code' },
            { title: '扣款金额(必填)', key: 'price' },
            { title: '扣款原因(必填)', key: 'reason' }
          ],
          type
        )
      } else if (type === '付款单据模板') {
        this.$downloadExcel(
          [],
          [
            { title: '付款单位(必填)', key: 'client_zh' },
            { title: '关联单号(选填)', key: 'doc_code' },
            { title: '付款金额(必填)', key: 'price' },
            { title: '备注信息(选填)', key: 'desc' },
            { title: '付款日期(必填)', key: 'complete_time' }
          ],
          type
        )
      }
    },
    importExcelData(type: string) {
      const inputFile = document.createElement('input')
      inputFile.type = 'file'
      inputFile.accept = '.xlsx,.xls'
      inputFile.addEventListener('change', e => {
        this.getExcelData(e, this.saveImportData, type)
      })
      let click = document.createEvent('MouseEvents')
      click.initEvent('click', true, true)
      inputFile.dispatchEvent(click)
    },
    getExcelData(file: any, callBack: any, type: string) {
      const _this = this
      const XLSX = require('xlsx')
      const files = file.target.files
      const fileReader = new FileReader()
      fileReader.onload = function(e: any) {
        try {
          const data = e.target.result
          const bytes = new Uint8Array(data) // 无符号整型数组
          const len = bytes.byteLength
          const binarys = new Array(len) // 创建定长数组，存储文本
          for (let i = 0; i < len; i++) {
            binarys[i] = String.fromCharCode(bytes[i])
          }
          const workbook = XLSX.read(binarys.join(''), { type: 'binary' })
          if (!workbook) {
            return null
          }
          const r: any = {}
          workbook.SheetNames.forEach((name: string) => {
            // 遍历每张纸数据
            r[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name])
          })
          callBack && callBack(r, type)
        } catch (e) {
          _this.$message.error('文件类型不正确')
        }
      }
      fileReader.readAsArrayBuffer(files[0])
    },
    saveImportData(data: any, type: string) {
      let typeObj: any = {}
      if (type === '开票单据') {
        typeObj = {
          doc_code: ['关联单号(选填)', ''],
          client_zh: ['客户/单位名称(必填，系统简称)'],
          invoice_number: ['发票代码(选填)', ''],
          invoice_code: ['发票号码(选填)', ''],
          type: ['发票类型(默认专票)', '专票'],
          doc_type: ['发票类型(订单开票、其它开票)', '订单开票'],
          tax_rate: ['税率(必填)', 13],
          price: ['开票金额(税价合计，必填)'],
          desc: ['备注信息(选填)', '']
        }
      } else if (type === '付款单据') {
        typeObj = {
          doc_code: ['关联单号(选填)', ''],
          client_zh: ['付款单位(必填)'],
          price: ['付款金额(必填)'],
          desc: ['备注信息(选填)', '']
        }
      } else if (type === '我方扣款单据') {
        typeObj = {
          doc_code: ['关联单号(选填)', ''],
          client_zh: ['扣款单位(必填)'],
          price: ['扣款金额(必填)'],
          reason: ['扣款原因(选填)', ''],
          complete_time: ['付款日期(必填)'],
          file_url: [false, null]
        }
      }
      let submitData = []
      for (const prop in data) {
        for (const key in data[prop]) {
          let obj: any = {}
          for (const indexType in typeObj) {
            if (typeObj[indexType][0]) {
              obj[indexType] = data[prop][key][typeObj[indexType][0]] || typeObj[indexType][1]
              if (obj[indexType] === undefined) {
                this.$message.error('解析失败，请使用标准模板或检测必填数据是否存在空的情况！！！')
                return
              }
            } else {
              obj[indexType] = typeObj[indexType][1]
            }
          }
          submitData.push(obj)
        }
      }
      if (submitData.length === 0) {
        this.$message.warning('未读取到可用参数')
        return
      }
      if (type === '开票单据') {
        invoice
          .create({
            id: '',
            doc_type: '',
            client_id: '',
            invoice_type: 2,
            data: submitData
          })
          .then(res => {
            if (res.data.status) {
              this.$message.success('导入成功')
              this.getList()
            }
          })
      } else if (type === '付款单据') {
        // excel日期格式转前端日期格式
        submitData.forEach(item => {
          const time: any = new Date((item.complete_time - 1) * 24 * 3600000 + 1)
          time.setYear(time.getFullYear() - 70)
          const year = time.getFullYear()
          const month = time.getMonth() + 1
          const date = time.getDate() - 1
          item.complete_time = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
        })
        payment
          .create({
            id: '',
            doc_type: '',
            client_id: '',
            data: submitData
          })
          .then(res => {
            if (res.data.status) {
              this.$message.success('导入成功')
              this.getList()
            }
          })
      } else if (type === '我方扣款单据') {
        deduct
          .create({
            id: '',
            doc_type: '',
            client_id: '',
            deduct_type: 1,
            data: submitData
          })
          .then(res => {
            if (res.data.status) {
              this.$message.success('导入成功')
              this.getList()
            }
          })
      }
    },
    exportExcel() {
      if (!this.clientTypeExcel || !this.yearExcel) {
        this.$message.error('请选择类型和年份')
        return
      }
      client
        .financialList({
          client_type_id: [this.clientTypeExcel],
          year: this.yearExcel,
          export_excel: 1
        })
        .then(res => {
          if (res.data.status) {
            window.location.href = res.data.data
            this.$message.success('导出成功')
          }
        })
    },
    getClientTag(ev: number) {
      if (ev) {
        this.clientTagList = this.clientTypeList.find((item: { id: number }) => item.id === ev).children
      } else {
        this.clientTagList = []
      }
      this.changeRouter()
    },
    getList() {
      if (this.totalList.length > 0 && this.$route.query.justChangePage) {
        this.list = this.totalList.slice((this.page - 1) * this.limit, this.page * this.limit)
        return
      }
      this.loading = true
      client
        .financialList({
          limit: this.limit,
          page: this.page,
          name: this.keyword,
          client_id: this.client_id,
          status: this.status,
          only_delete: this.only_delete,
          settle_unit: this.settle_unit,
          tag_id: this.tag_id ? [this.tag_id] : null, // 筛选标签用的，暂时没用到
          // client_type_id: this.clientType ? [this.clientType] : this.clientTypeList.map((item: any) => item.id),
          client_type_id: this.clientTypeList.map((item: any) => item.id),
          year: this.year
        })
        .then(res => {
          if (res.data.status) {
            this.total = res.data.data.items.length
            this.totalList = res.data.data.items
            this.totalList.forEach((item: any) => {
              if (this.methods === '1') {
                item.wait_pay_price = item.total_plan_price - item.total_pay_price - item.total_deduct_price
              } else {
                item.wait_pay_price = item.total_real_price - item.total_pay_price - item.total_deduct_price
              }
            })
            this.list = res.data.data.items
              .sort((a: any, b: any) => {
                if (this.sort === 'desc') {
                  return b[this.sortCol] - a[this.sortCol]
                } else {
                  return a[this.sortCol] - b[this.sortCol]
                }
              })
              .slice((this.page - 1) * this.limit, this.page * this.limit)

            this.totalData = res.data.data.additional
          }
          this.loading = false
        })
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page) || 1
      this.limit = Number(query.limit) || 10
      this.type = query.type || ''
      this.tag_id = Number(query.tag_id) || ''
      this.status = query.status ? (query.status === 'null' ? null : Number(query.status)) : 1
      this.keyword = query.keyword || ''
      this.client_id = query.client_id || ''
      // this.clientType = Number(query.clientType) || ''
      this.only_delete = Number(query.only_delete) || 0
      this.year = query.year || '' + new Date().getFullYear().toString()
      this.settle_unit = query.settle_unit || ''
      this.clientTagList = this.clientType
        ? this.clientTypeList.find((item: any) => item.id === Number(query.clientType)).public_tag
        : []
    },
    changeRouter(ev?: any, justChangePage?: boolean) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/settlement/paymentList?page=' +
          this.page +
          '&limit=' +
          this.limit +
          '&type=' +
          this.type +
          '&keyword=' +
          this.keyword +
          '&client_id=' +
          this.client_id +
          '&status=' +
          this.status +
          // '&clientType=' +
          // this.clientType +
          '&tag_id=' +
          this.tag_id +
          '&only_delete=' +
          this.only_delete +
          '&year=' +
          this.year +
          '&settle_unit=' +
          this.settle_unit +
          '&justChangePage=' +
          (justChangePage || '') +
          '&methods=' +
          this.methods
      )
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.status = 1
          // this.clientType = ''
          this.tag_id = ''
          this.only_delete = 0
          this.keyword = ''
          this.client_id = ''
          this.methods = '1'
          this.changeRouter()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    }
  },
  created() {
    this.page = Number(this.$route.query.page) || 1
    // 由于列表需要用到type数据，所以这里不用checkCommonInfo
    clientType.list().then(res => {
      this.clientTypeList = res.data.data.filter((item: { type: string }) => Number(item.type) === Number(this.type))
      this.clientList = res.data.data.filter((item:any) => {
        return item.type === '2'
      }).map((item:any) => {
        console.log(item)
        return {
          type: item.type,
          label: item.name,
          value: item.id as number,
          children: item.public_tag!.map((itemChild:any) => {
            return {
              type: 'public',
              label: itemChild.name,
              value: itemChild.id as number,
              children: itemChild.rel_client!.map((itemClient:any) => {
                return {
                  label: itemClient.code ? (itemClient.code + '-' + itemClient.name) : itemClient.name,
                  value: itemClient.id as number
                }
              })
            }
          }).concat(item.rel_tag!.map((itemChild:any) => {
            return {
              type: 'private',
              label: itemChild.name,
              value: itemChild.id as number,
              children: itemChild.rel_client!.map((itemClient:any) => {
                return {
                  label: itemClient.code ? (itemClient.code + '-' + itemClient.name) : itemClient.name,
                  value: itemClient.id as number
                }
              })
            }
          }))
        }
      })
      this.getFilters()
      this.getList()
    })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/settlement/paymentList.less';
</style>
