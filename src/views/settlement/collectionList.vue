<template>
  <div id="collectionList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag active">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-kehuguanli"></use>
          </svg>
        </div>
        <span class="text">应收款客户</span>
      </div>
      <div class="tag"
        @click="$router.push('/settlement/paymentList?page=&limit&type=&keyword=&status=&clientType=&tag_id=&only_delete=&year=&settle_unit=')">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
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
            <el-input placeholder="搜索公司名称"
              v-model="keyword"
              @change="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-select placeholder="筛选客户状态"
              v-model="status"
              @change="changeRouter">
              <el-option label="全部"
                :value="null"></el-option>
              <el-option label="合作中"
                :value="1"></el-option>
              <el-option label="暂停合作"
                :value="0"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select placeholder="客户类型筛选"
              v-model="clientType"
              @change="tag_id='';getClientTag($event)"
              clearable>
              <el-option v-for="item in clientTypeList"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="year"
              @change="changeRouter"
              value-format="yyyy"
              type="year"
              placeholder="选择年">
            </el-date-picker>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select placeholder="客户标签筛选"
              v-model="tag_id"
              @change="changeRouter"
              clearable>
              <el-option v-for="item in clientTagList"
                :key="item.value"
                :value="item.value"
                :label="item.label"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select placeholder="筛选币种"
              v-model="settle_unit"
              @change="changeRouter"
              clearable>
              <el-option v-for="item in unitArr"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                class="between">
                <span>{{item.name}}</span>
                <span class="gray">({{item.short}})</span>
              </el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select v-model="limit"
              placeholder="每页展示条数"
              @change="changeRouter">
              <el-option v-for="item in limitList"
                :key="item.value"
                :label="item.name"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-checkbox v-model="only_delete"
              @change="changeRouter"
              :true-label="1">查询已删除的数据</el-checkbox>
          </div>
        </div>
        <div class="description">当前统计默认值：下单年份：{{year}}年；下单客户：默认所有；币种：{{settle_unit||'所有'}}；合作状态：{{status===0?'暂停合作':status===1?'合作中':'全部'}}</div>
        <div class="list"
          v-loading="loading"
          style="font-size:14px">
          <div class="row title">
            <div class="col">公司简称</div>
            <div class="col">公司全称</div>
            <div class="col">客户类型</div>
            <div class="col sortCol"
              style="flex:1.2">
              <span>下单总额</span>
              <div class="sortCtn">
                <div class="el-icon-caret-top"
                  :class="{'active':sortCol==='total_order_price'&&sort==='asc'}"
                  @click="sortCol='total_order_price';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  :class="{'active':sortCol==='total_order_price'&&sort==='desc'}"
                  @click="sortCol='total_order_price';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">下单总数 <div class="sortCtn">
                <div class="el-icon-caret-top"
                  :class="{'active':sortCol==='total_order_number'&&sort==='asc'}"
                  @click="sortCol='total_order_number';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  :class="{'active':sortCol==='total_order_number'&&sort==='desc'}"
                  @click="sortCol='total_order_number';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">发货总额 <div class="sortCtn">
                <div class="el-icon-caret-top"
                  :class="{'active':sortCol==='total_transport_price'&&sort==='asc'}"
                  @click="sortCol='total_transport_price';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  :class="{'active':sortCol==='total_transport_price'&&sort==='desc'}"
                  @click="sortCol='total_transport_price';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">发货总数 <div class="sortCtn">
                <div class="el-icon-caret-top"
                  :class="{'active':sortCol==='total_transport_number'&&sort==='asc'}"
                  @click="sortCol='total_transport_number';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  :class="{'active':sortCol==='total_transport_number'&&sort==='desc'}"
                  @click="sortCol='total_transport_number';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">开票总额 <div class="sortCtn">
                <div class="el-icon-caret-top"
                  :class="{'active':sortCol==='total_invoice_price'&&sort==='asc'}"
                  @click="sortCol='total_invoice_price';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  :class="{'active':sortCol==='total_invoice_price'&&sort==='desc'}"
                  @click="sortCol='total_invoice_price';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col"
              style="flex:1.1">收款总额￥<div class="sortCtn">
                <div class="el-icon-caret-top"
                  :class="{'active':sortCol==='total_collect_price_rmb'&&sort==='asc'}"
                  @click="sortCol='total_collect_price_rmb';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  :class="{'active':sortCol==='total_collect_price_rmb'&&sort==='desc'}"
                  @click="sortCol='total_collect_price_rmb';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">收款总额$<div class="sortCtn">
                <div class="el-icon-caret-top"
                  :class="{'active':sortCol==='total_collect_price_usd'&&sort==='asc'}"
                  @click="sortCol='total_collect_price_usd';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  :class="{'active':sortCol==='total_collect_price_usd'&&sort==='desc'}"
                  @click="sortCol='total_collect_price_usd';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">扣款总额 <div class="sortCtn">
                <div class="el-icon-caret-top"
                  :class="{'active':sortCol==='total_deduct_price'&&sort==='asc'}"
                  @click="sortCol='total_deduct_price';sort='asc';getList()"></div>
                <div class="el-icon-caret-bottom"
                  :class="{'active':sortCol==='total_deduct_price'&&sort==='desc'}"
                  @click="sortCol='total_deduct_price';sort='desc';getList()"></div>
              </div>
            </div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">{{item.name}}</div>
            <div class="col">{{item.alias}}</div>
            <div class="col">{{item.client_type_name}}</div>
            <div class="col"
              style="font-size:14px;flex:1.2">
              <template v-if="!settle_unit">
                {{$toFixed(item.total_order_price,3,true)}}
              </template>
              <template v-else-if="settle_unit==='元'">
                {{$toFixed(item.total_order_price_rmb,3,true)}}
              </template>
              <template v-else-if="settle_unit==='美元'">
                {{$toFixed(item.total_order_price_usd,3,true)}}
              </template>
              万{{settle_unit||'元'}}
            </div>
            <div class="col">{{item.total_order_number}}万件</div>
            <div class="col">
              <template v-if="!settle_unit">
                {{$toFixed(item.total_transport_price,3,true)}}
              </template>
              <template v-else-if="settle_unit==='元'">
                {{$toFixed(item.total_transport_price_rmb,3,true)}}
              </template>
              <template v-else-if="settle_unit==='美元'">
                {{$toFixed(item.total_transport_price_usd,3,true)}}
              </template>
              万{{settle_unit||'元'}}
            </div>
            <div class="col">{{$toFixed(item.total_transport_number,3,true)}}万件</div>
            <div class="col">{{$toFixed(item.total_invoice_price,3,true)}}万元</div>
            <div class="col"
              style="flex:1.1">{{$toFixed(item.total_collect_price_rmb,3,true)}}万元</div>
            <div class="col">{{$toFixed(item.total_collect_price_usd,3,true)}}万美元</div>
            <div class="col">{{$toFixed(item.total_deduct_price,3,true)}}万元</div>
            <div class="col oprCtn">
              <span class="opr hoverBlue"
                @click="$router.push('/settlement/collectionDetail?id='+item.id)">详情</span>
            </div>
          </div>
          <div class="row">
            <div class="col green">合计：</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col green bold"
              style="flex:1.2">{{totalData.total_order_price}}万{{settle_unit||'元'}}</div>
            <div class="col green bold">{{$toFixed(totalData.total_order_number,3,true)}}万件</div>
            <div class="col green bold">{{$toFixed(totalData.total_transport_price,3,true)}}万{{settle_unit||'元'}}</div>
            <div class="col green bold">{{$toFixed(totalData.total_transport_number,3,true)}}万件</div>
            <div class="col green bold">{{$toFixed(totalData.total_invoice_price,3,true)}}万元</div>
            <div class="col green bold">{{$toFixed(totalData.total_collect_price_rmb,3,true)}}万元</div>
            <div class="col green bold">{{$toFixed(totalData.total_collect_price_usd,3,true)}}万美元</div>
            <div class="col green bold">{{$toFixed(totalData.total_deduct_price,3,true)}}万元</div>
            <div class="col"></div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter($event,true)">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn"
          style="float:left">
          <div class="buttonList">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">批量导入单据</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange"
                  @click="importExcelData('开票单据')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">开票单据</span>
                </div>
                <div class="btn backHoverRed"
                  @click="importExcelData('对方扣款单据')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">扣款单据</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="importExcelData('收款单据','元')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">人民币收款</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="importExcelData('收款单据','美元')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">美元收款</span>
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
                <div class="btn backHoverOrange"
                  @click="downloadExcel('开票单据模板')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">开票单据</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="downloadExcel('收款单据模板')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">收款单据</span>
                </div>
                <div class="btn backHoverRed"
                  @click="downloadExcel('扣款单据模板')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">扣款单据</span>
                </div>
              </div>
            </div>
          </div>
          <span class="btn hoverBlue">
            <el-tooltip class="item"
              effect="dark"
              placement="top">
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
          <span class="btn backHoverGreen"
            @click="excelFlag = true">导出EXCEL</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="excelFlag">
      <div class="main"
        style="width:500px">
        <div class="titleCtn">
          <span class="text">导出EXCEL筛选条件</span>
          <div class="closeCtn"
            @click="excelFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label"
              style="line-height:32px">选择类型：</div>
            <div class="elCtn info">
              <el-select placeholder="客户类型筛选"
                v-model="clientTypeExcel"
                clearable>
                <el-option v-for="item in clientTypeList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label"
              style="line-height:32px">选择年份：</div>
            <div class="elCtn info">
              <el-date-picker type="year"
                v-model="yearExcel"
                placeholder="选择年份"
                value-format="yyyy"></el-date-picker>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="excelFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="exportExcel">确认导出</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { client, clientType, collection, deduct, invoice } from '@/assets/js/api'
import { limitArr, moneyArr } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      settle_excel_unit: '元',
      clientTypeExcel: '',
      yearExcel: new Date().getFullYear().toString(),
      excelFlag: false,
      loading: true,
      keyword: '',
      list: [],
      totalList: [],
      page: 1,
      total: 1,
      limit: 10,
      type: 1, // 类型2，合作单位类型
      status: 1,
      clientType: '',
      tag_id: '',
      bindFlag: false,
      clientTypeList: [],
      clientTagList: [],
      limitList: limitArr,
      only_delete: 0,
      settle_unit: '',
      unitArr: moneyArr,
      year: new Date().getFullYear().toString(),
      totalData: {
        total_collect_price: 0,
        total_deduct_price: 0,
        total_invoice_price: 0,
        total_order_number: 0,
        total_order_price: 0,
        total_transport_number: 0,
        total_transport_price: 0
      },
      sortCol: 'total_order_price',
      sort: 'desc'
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
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
            { title: '扣款单位(必填，简称)', key: 'client_zh' },
            { title: '关联单号(选填)', key: 'doc_code' },
            { title: '扣款金额(必填)', key: 'price' },
            { title: '扣款原因(选填)', key: 'reason' }
          ],
          type
        )
      } else if (type === '收款单据模板') {
        this.$downloadExcel(
          [],
          [
            { title: '收款单位(必填，简称)', key: 'client_zh' },
            { title: '关联单号(选填)', key: 'doc_code' },
            { title: '收款金额(必填)', key: 'price' },
            { title: '备注信息(选填)', key: 'desc' },
            { title: '收款日期(必填)', key: 'complete_time' }
          ],
          type
        )
      }
    },
    importExcelData(type: string, settle_unit?: string) {
      this.settle_excel_unit = settle_unit
      const inputFile = document.createElement('input')
      inputFile.type = 'file'
      inputFile.accept = '.xlsx,.xls'
      inputFile.addEventListener('change', (e) => {
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
      fileReader.onload = function (e: any) {
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
          invoice_number: ['发票代码(选填)',''],
          invoice_code: ['发票号码(选填)',''],
          type: ['发票类型(默认专票)','专票'],
          tax_rate: ['税率(必填)'],
          price: ['开票金额(税价合计，必填)'],
          desc: ['备注信息(选填)', ''],
        }
      } else if (type === '收款单据') {
        typeObj = {
          doc_code: ['关联单号(选填)', ''],
          client_zh: ['收款单位(必填)'],
          price: ['收款金额(必填)'],
          desc: ['备注信息(选填)', ''],
          complete_time: ['收款日期(必填)']
        }
      } else if (type === '对方扣款单据') {
        typeObj = {
          doc_code: ['关联单号(选填)', ''],
          client_zh: ['扣款单位(必填)'],
          price: ['扣款金额(必填)'],
          reason: ['扣款原因(选填)', ''],
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
            invoice_type: 1,
            data: submitData
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('导入成功')
              this.getList()
            }
          })
      } else if (type === '收款单据') {
        // excel日期格式转前端日期格式
        submitData.forEach((item) => {
          const time: any = new Date((item.complete_time - 1) * 24 * 3600000 + 1)
          time.setYear(time.getFullYear() - 70)
          const year = time.getFullYear()
          const month = time.getMonth() + 1
          const date = time.getDate() - 1
          item.complete_time = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
        })
        collection
          .create({
            id: '',
            doc_type: '',
            client_id: '',
            settle_unit: this.settle_excel_unit,
            data: submitData
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('导入成功')
              this.getList()
            }
          })
      } else if (type === '对方扣款单据') {
        deduct
          .create({
            id: '',
            doc_type: '',
            client_id: '',
            deduct_type: 2,
            data: submitData
          })
          .then((res) => {
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
        .then((res) => {
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
          sort_col: this.sortCol,
          sort: this.sort,
          limit: this.limit,
          page: this.page,
          name: this.keyword,
          status: this.status,
          only_delete: this.only_delete,
          settle_unit: this.settle_unit,
          tag_id: this.tag_id ? [this.tag_id] : null, // 筛选标签用的，暂时没用到
          client_type_id: this.clientType ? [this.clientType] : this.clientTypeList.map((item: any) => item.id),
          year: this.year
        })
        .then((res) => {
          if (res.data.status) {
            this.total = res.data.data.items.length
            this.totalList = res.data.data.items
            this.list = res.data.data.items.slice((this.page - 1) * this.limit, this.page * this.limit)
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
      this.clientType = Number(query.clientType) || ''
      this.only_delete = Number(query.only_delete) || 0
      this.year = query.year || '' + new Date().getFullYear().toString()
      this.settle_unit = query.settle_unit || ''
      this.clientTagList = this.clientType
        ? this.clientTypeList.find((item: any) => item.id === Number(query.clientType)).public_tag
        : []
    },
    // 这个页面分页前端做
    changeRouter(ev?: any, justChangePage?: boolean) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/settlement/collectionList?page=' +
          this.page +
          '&limit=' +
          this.limit +
          '&type=' +
          this.type +
          '&keyword=' +
          this.keyword +
          '&status=' +
          this.status +
          '&clientType=' +
          this.clientType +
          '&tag_id=' +
          this.tag_id +
          '&only_delete=' +
          this.only_delete +
          '&year=' +
          this.year +
          '&settle_unit=' +
          this.settle_unit +
          '&justChangePage=' +
          (justChangePage || '')
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
          this.clientType = ''
          this.tag_id = ''
          this.only_delete = 0
          this.keyword = ''
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
    // 由于列表需要用到type数据，所以这里不用checkCommonInfo
    clientType.list().then((res) => {
      this.clientTypeList = res.data.data.filter((item: { type: string }) => Number(item.type) === Number(this.type))
      this.getFilters()
      this.getList()
    })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/settlement/collectionList.less';
</style>

