<template>
  <div id="workshopStaffDetail" class="bodyContainer" style="min-height: 1000px" v-loading="loading">
    <div class="module clearfix">
      <div class="detailCtn">
        <div class="elCtn">
          <el-select style="width: 95%" @change="changeDepartment()" v-model="department" placeholder="部门筛选" clearable>
            <el-option v-for="(item, index) in departmentList" :key="index + item.name" :value="item.id"
              :label="item.name"></el-option>
          </el-select>
        </div>
        <div class="elCtn">
          <el-select v-model="order_type" placeholder="订单类型">
            <el-option value="" label="订单/样单"></el-option>
            <el-option :value="1" label="仅订单"></el-option>
            <el-option :value="2" label="仅样单"></el-option>
          </el-select>
        </div>
        <div class="elCtn" style="margin-left: 20px">
          <el-cascader placeholder="筛选下单公司" v-model="client_id" :options="clientList" filterable clearable>
          </el-cascader>
        </div>
        <div class="elCtn" style="margin-left: 20px">
          <el-checkbox v-model="outCiPin">结算工资去除次品数量
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">
                勾选前，工资计算公式 = 结算单价 * （完成数量 + 额外数量）<br />勾选后，工资计算公式 = 结算单价 *
                （完成数量 + 额外数量 - 次品数量）
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-checkbox>
          <el-checkbox v-model="keyBoard" @change="changeKeyBoard">打开页面键盘</el-checkbox>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="tableCtn fixedTableCtn">
        <div class="cover" style="position: relative; z-index: 99">
          <div class="fixedRight tbody">
            <div class="trow" style="justify-content: start">
              <div class="tcol bgGray" style="min-width: 200px">操作</div>
            </div>
            <div v-for="(settlementLog, settlementLogIndex) in settlementLogList" :key="'process' + settlementLogIndex">
              <div class="trow" style="justify-content: start; border-bottom: 1px solid #e9e9e9"
                v-if="settlementLog.show">
                <div class="tcol noPad" style="width: 0; flex: unset; border-right: unset">
                  <div class="trow" v-for="(itemDetail, indexDetail) in settlementLog.product_info"
                    :key="indexDetail + 'indexDetail'">
                    <div class="tcol"></div>
                  </div>
                </div>
                <div class="tcol" style="
                      flex-direction: row;
                      width: 200px;
                      align-items: center;
                      justify-content: space-between;
                      height: 46px;
                      align-self: center;
                    ">
                  <div class="hoverBlue" v-if="!isCopy" style="cursor: pointer" @click="copyThis(settlementLogIndex)">
                    复制<br />该行
                  </div>
                  <div class="hoverBlue" v-if="isCopy && copyLine[0] === settlementLogIndex" style="cursor: pointer"
                    @click="isCopy = false">
                    取消<br />复制
                  </div>
                  <div class="hoverGreen" v-if="isCopy && copyLine[0] !== settlementLogIndex" style="cursor: pointer"
                    @click="parseThis(settlementLogIndex)">
                    粘贴<br />该行
                  </div>
                  <div class="hoverBlue" style="cursor: pointer" @click="addSettlementLog(settlementLogIndex, 'order')">
                    添加<br />订单
                  </div>
                  <div class="hoverBlue" style="cursor: pointer" @click="addSettlementLog(settlementLogIndex, 'process')">
                    添加<br />工序
                  </div>
                  <div style="cursor: pointer" class="hoverRed" @click="checkDelete(settlementLogIndex)">
                    删除<br />该行
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody" style="overflow: auto" @mousewheel.prevent="listenWheel" ref="listId">
          <div class="trow" style="justify-content: start">
            <div class="tcol bgGray" style="min-width: 101px">员工姓名</div>
            <div class="tcol bgGray" style="min-width: 101px">生产工序</div>
            <div class="tcol bgGray" style="min-width: 101px">工序说明</div>
            <div class="tcol bgGray" style="min-width: 101px">结算单价</div>
            <div class="tcol bgGray titleFix">订单号</div>
            <div class="tcol bgGray titleFix">产品编号</div>
            <div class="tcol bgGray" style="min-width: 150px">尺码颜色</div>
            <div class="tcol bgGray titleFix">完成数量</div>
            <div class="tcol bgGray titleFix">额外数量</div>
            <div class="tcol bgGray titleFix">次品数</div>
            <div class="tcol bgGray titleFix">次品原因</div>
            <div class="tcol bgGray" style="min-width: 200px">操作</div>
          </div>
          <div v-for="(settlementLog, settlementLogIndex) in             settlementLogList            "
            :key="'process' + settlementLogIndex">
            <div class="trow" style="justify-content: start; border-bottom: 1px solid #e9e9e9" v-if="settlementLog.show">
              <div class="tcol" style="min-width: 101px; max-width: 101px">
                <el-cascader placeholder="员工姓名搜索" v-model="settlementLog.staffId" :options="processStaffList" filterable
                  :show-all-levels="false" @change="getStaffIdList(settlementLogIndex)"></el-cascader>
              </div>
              <div class="tcol noPad" style="overflow: unset">
                <div class="trow">
                  <div class="tcol" style="min-width: 101px; max-width: 101px">
                    <el-cascader v-model="settlementLog.process" filterable :options="processList"
                      :show-all-levels="false" clearable placeholder="请选择工序"
                      @change="getProcessDesc(settlementLog, settlementLogIndex)"></el-cascader>
                  </div>
                  <div class="tcol" style="min-width: 101px; max-width: 101px">
                    <el-select v-model="settlementLog.process_desc" multiple filterable allow-create default-first-option
                      collapse-tags placeholder="请填写工序说明" @change="settlementLog.is_check = true">
                      <el-option v-for="(itemSon, indexSon) in settlementLog.processDesc" :key="itemSon.value + indexSon"
                        :label="itemSon.label" :value="itemSon.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="tcol" style="min-width: 101px; max-width: 101px">
                    <div style="display: flex; align-items: top">
                      <div style="width: 82px; line-height: 38px">
                        <zh-input v-model="settlementLog.price" placeholder="结算单价" :keyBoard="keyBoard" type="number"
                          @change="settlementLog.is_check = true"></zh-input>
                      </div>
                      <div style="width: 3em; font-size: 14px; line-height: 38px">元/件</div>
                    </div>
                  </div>
                  <div class="tcol noPad">
                    <div class="trow">
                      <div class="tcol titleFix">
                        <el-select v-model="settlementLog.order_code" filterable remote placeholder="请输入订单编号"
                          loading-text=" 搜索中(输入更多关键字可提高搜索速度) " :loading="searchLoading" :remote-method="(ev) => {
                              return $debounce(ev, timer, querySearchAsync)
                            }
                            " @change="handleSelect(settlementLog, settlementLogIndex)"
                          @focus="querySearchAsync(settlementLog.order_code)">
                          <div style="display: flex; padding: 0 10px; width: 500px">
                            <div style="flex: 1">订单号</div>
                            <div style="flex: 1">下单公司</div>
                            <div style="flex: 1">下单时间</div>
                          </div>
                          <el-option v-for="(item, index) in orderList" :key="item.value + index + 'order'"
                            :label="item.label" :value="item.value + ',' + item.id">
                            <div style="display: flex">
                              <span style="flex: 1">{{ item.value }}</span>
                              <span style="flex: 1"> {{ item.client_name }} </span>
                              <span style="flex: 1">{{ item.created_at }}</span>
                            </div>
                          </el-option>
                        </el-select>
                      </div>
                      <div class="tcol noPad">
                        <div class="trow"
                          v-for="(itemDetail, indexDetail) in             settlementLog.product_info            "
                          :key="indexDetail + 'indexDetail'">
                          <div class="tcol titleFix">
                            <el-select v-if="!settlementLog.order_code" v-model="itemDetail.code" filterable remote
                              placeholder="请输入产品编号" loading-text="搜索中(输入更多关键字可提高搜索速度)" :loading="searchLoading"
                              :remote-method="(ev) => {
                                  return $debounce(ev, timer, querySearchAsync1)
                                }
                                " :ref="'input' + settlementLogIndex + indexDetail"
                              @change="handleSelect(settlementLog, settlementLogIndex, 2, itemDetail.code, itemSon)"
                              @focus="querySearchAsync1(itemDetail.code)">
                              <div style="display: flex; padding: 0 10px; width: 800px">
                                <div style="flex: 1">产品编号</div>
                                <div style="flex: 1">所属订单号</div>
                                <div style="flex: 1">包含色组</div>
                                <div style="flex: 1">下单公司</div>
                                <div style="flex: 1">下单时间</div>
                              </div>
                              <el-option v-for="(itemSon, i) in orderList"
                                :key="itemSon.value + settlementLogIndex + indexDetail + i + 'orderList'"
                                :label="itemSon.product_name" :value="itemSon.product_name + ',' + itemSon.value">
                                <div style="display: flex; white-space: normal">
                                  <span style="flex: 1">{{ itemSon.product_name }}</span>
                                  <span style="flex: 1">{{ itemSon.value }}</span>
                                  <span style="width: 150px; overflow: hidden; margin-right: 10px">{{
                                    itemSon.colorGroup
                                  }}</span>
                                  <span style="flex: 1"> {{ itemSon.client_name }} </span>
                                  <span style="flex: 1">{{ itemSon.created_at }}</span>
                                </div>
                              </el-option>
                            </el-select>
                            <!-- 有订单编号情况 -->
                            <el-select v-if="settlementLog.order_code" v-model="itemDetail.product_id" filterable remote
                              placeholder="请选择产品编号" @change="changPro(settlementLog, itemDetail.product_id, indexDetail)">
                              <el-option v-for="(itemSon, i) in settlementLog.product_detail_info"
                                :key="itemSon.value + settlementLogIndex + indexDetail + i + 'orderList'"
                                :label="itemSon.product_code" :value="itemSon.product_id">
                              </el-option>
                            </el-select>
                          </div>
                          <div class="tcol" style="display: block; position: relative; min-width: 150px">
                            <el-select v-model="itemDetail.chooseId" placeholder="请选择尺码颜色"
                              @change="$forceUpdate()
                                                                                                                                                                                                                                                                                                                                                                                                                                settlementLog.is_check = true
                                                                                                                                                                                                                                                                                                                                                                                                                              ">
                              <el-option
                                v-for="(            colorItem, colorIndex            ) in             itemDetail.colorList            "
                                :key=" colorItem.size_id + ',' + colorItem.color_id + colorIndex "
                                :label=" colorItem.name " :value=" colorItem.value ">
                              </el-option>
                            </el-select>
                            <i class="el-icon-circle-plus-outline"
                              style="cursor: pointer; position: absolute; right: 15%; top: 30%"
                              @click=" addSizeColor(settlementLog, itemDetail, indexDetail) "></i>
                            <i class="el-icon-remove-outline"
                              style="cursor: pointer; position: absolute; right: 5%; top: 30%"
                              @click=" deleteSizeColor(settlementLog, indexDetail) "></i>
                          </div>
                          <div class="tcol titleFix">
                            <div style="display: flex; align-items: center">
                              <zh-input v-model=" itemDetail.number " placeholder="请输入完成数量" :keyBoard=" keyBoard "
                                type="number" @change=" settlementLog.is_check = true "></zh-input>
                              <div style="line-height: 38px">件</div>
                            </div>
                          </div>
                          <div class="tcol titleFix">
                            <div style="display: flex; align-items: center">
                              <zh-input v-model=" itemDetail.extra_number " placeholder="请输入额外数量" :keyBoard=" keyBoard "
                                type="number" @change=" settlementLog.is_check = true "></zh-input>
                              <div style="line-height: 38px">件</div>
                            </div>
                          </div>
                          <div class="tcol titleFix">
                            <div style="display: flex; align-items: center">
                              <zh-input v-model=" itemDetail.shoddy_number " placeholder="请输入次品数量" :keyBoard=" keyBoard "
                                type="number" @change=" settlementLog.is_check = true "></zh-input>
                              <div style="line-height: 38px">件</div>
                            </div>
                          </div>
                          <div class="tcol titleFix">
                            <el-select v-model=" itemDetail.shoddy_reason " multiple filterable allow-create
                              default-first-option collapse-tags placeholder="请选择次品原因"
                              @change=" settlementLog.is_check = true ">
                              <el-option v-for="            item             in             substandardReason            "
                                :key=" item.value + 'ciPinReason' " :label=" item.label " :value=" item.value ">
                              </el-option>
                            </el-select>
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
      </div>
    </div>
    <div style="overflow: hidden; margin-top: 20px; margin-bottom: 20px">
      <div class="elCtn">
        <el-button size="small" type="primary" @click=" openDialog "
          style="padding-top: 7px; padding-bottom: 7px; font-size: 16px">
          批量添加员工
        </el-button>
      </div>
      <div class="elCtn" style="margin-left: 20px">
        <el-button size="small" type="primary" @click=" addStaff "
          style="padding-top: 7px; padding-bottom: 7px; font-size: 16px">
          添加下个员工
        </el-button>
      </div>
      <div class="elCtn" style="margin-left: 20px">
        <el-checkbox-group v-model=" copyOption ">
          <el-dropdown :hide-on-click=" false " trigger="click">
            <el-button size="small" type="primary">
              设置复制项<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-tooltip class="item" effect="dark" placement="right" style="margin-left: 10px">
              <div slot="content">注：订单如未勾选，尺码颜色将无法复制</div>
              <i class="el-icon-question"></i>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-checkbox label="process">生产工序</el-checkbox>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox label="proces_desc">工序说明</el-checkbox>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox label="price">结算单价</el-checkbox>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox label="order_code">订单编号</el-checkbox>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox label="size_color">尺码颜色</el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-checkbox-group>
      </div>
    </div>
    <!-- 生产进度 -->
    <div class="popup" v-show=" addOrder " v-loading=" showPopupLoading " element-loading-target>
      <div class="main">
        <div class="titleCtn">
          <span class="text">添加订单</span>
          <div class="closeCtn">
            <span class="el-icon-close" @click=" closeAddOrder() "></span>
          </div>
        </div>
        <div class="contentCtn" style="padding-top: 15px; max-height: 700px">
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
                  <div class="tcol bgGray" style="flex: 0.2">
                    <el-checkbox v-model=" checkAll " @change=" checkAllOrder "></el-checkbox>
                  </div>
                </div>
                <div class="trow"
                  v-for="(            item, index            ) in             productionScheduleUpdate            "
                  :key=" index + 'productionScheduleUpdate' ">

                  <div class="tcol">{{ item.order_type == 1 ? '订单' : '样单' }}</div>
                  <div class="tcol">{{ item.code }}</div>
                  <div class="tcol noPad" style="flex: 10.3">
                    <div class="trow"
                      v-for="(            itemPro, indexPro            ) in             item.product_info            "
                      :key=" indexPro + 'pro' ">
                      <div class="tcol">{{ itemPro.product_code }}<br />{{ itemPro.category }}</div>
                      <div class="tcol">{{ itemPro.name }}</div>
                      <div class="tcol">{{ contentHtml(itemPro.desc) }}</div>
                      <div class="tcol">
                        <el-image
                          :src=" itemPro.img.length > 0 ? itemPro.img[0] : require('@/assets/image/common/noPic.png') "
                          :preview-src-list=" itemPro.img " fit="cover"
                          style="width: 45px; height: 45px; padding: 10px 0"></el-image>
                      </div>
                      <div class="tcol noPad" style="flex: 5.34">
                        <div class="trow"
                          v-for="(            itemSizeColor, indexSizeColor            ) in             itemPro.colorSizeInfo            "
                          :key=" itemSizeColor.size_id + 'color' + indexSizeColor ">
                          <div class="tcol" @click=" itemSizeColor.check = !itemSizeColor.check ">
                            {{ (itemSizeColor.size_name || '无数据') + '/' + (itemSizeColor.color_name || '无数据') }}
                          </div>
                          <div class="tcol" @click=" itemSizeColor.check = !itemSizeColor.check ">
                            {{ (itemSizeColor.size_info || '无数据') + '/' + (itemSizeColor.weight || 0) }}
                          </div>
                          <div class="tcol" @click=" itemSizeColor.check = !itemSizeColor.check ">{{ itemSizeColor.number
                            }}
                          </div>
                          <div class="tcol" @click=" itemSizeColor.check = !itemSizeColor.check ">{{
                            itemSizeColor.inspection_number }}</div>
                          <div class="tcol" style="flex: 0.2">
                            <el-checkbox v-model=" itemSizeColor.check "></el-checkbox>
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
          <el-pagination background :page-size=" limit " layout="prev, pager, next, jumper" :total=" total "
            :current-page.sync=" page " @current-change=" changeParams ">
          </el-pagination>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" @click=" closeAddOrder() ">取消</span>
          <span class="btn backHoverBlue" @click=" confirmSubmit ">确认选择</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn" @click=" $router.go(-1) ">返回</div>
          <div class="btn backHoverBlue fr" @click=" workSave ">确认提交</div>
        </div>
      </div>
    </div>
    <el-dialog title="批量添加员工" width="70%" :visible.sync=" showDialog " :before-close=" closeDialog ">
      <div class="elCtn">
        <el-select v-model=" lostAddStaffChooseProcess " placeholder="请选择">
          <el-option v-for="(            item, index            ) in             processStaffList            "
            :key=" item.value " :label=" item.label " :value=" index ">
          </el-option>
        </el-select>
      </div>
      <div class="elCtn" style="margin-left: 20px">
        <el-button type="primary" size="small" @click=" checkAllStaff ">全部选中</el-button>
      </div>
      <el-checkbox-group v-model=" staffIdList ">
        <el-checkbox style="width: calc(100% / 8); margin-top: 10px"
          v-for="            item             in             processStaffList[lostAddStaffChooseProcess].children            "
          @change=" changeMostStaff(item.id) " :key=" item.id + '添加员工' " :label=" item.id ">{{
          item.code.slice(item.code.length - 4) + '-' + item.name
          }}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" closeDialog ">取 消</el-button>
        <el-button type="primary" @click=" confirmData ">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { staff, process, workshop, order, checkPriceBeyond } from '@/assets/js/api'
import zhInput from '@/components/zhInput/zhInput.vue'
import DeliveryVisualization from '../deliveryVisualization.vue'
export default Vue.extend({
  components: { zhInput, DeliveryVisualization },
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      keyBoard: localStorage.showWorkShopKeyBoard === 'true',
      showPopupLoading: false,
      showDialog: false,
      reqTime: '',
      page: 1,
      limit: 10,
      total: 0,
      lostAddStaffChooseProcess: 0,
      order_type: '',
      selectStaffIdList: [],
      staffIdList: [],
      oldList: [],
      copyLine: [],
      copyOption: ['process', 'proces_desc', 'price', 'order_code', 'product_code', 'size_color'],
      client_id: '',
      staffList: [],
      orderList: [],
      isCopy: false,
      outCiPin: false,
      searchLoading: false,
      idDone: false,
      checkAll: false,
      staffInfo: {},
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
      productionScheduleUpdate: [
        {
          productNameId: '',
          productId: '',
          process: this.$getLocalStorage('process') ? [Number(this.$getLocalStorage('process').split(',')[0]), this.$getLocalStorage('process').split(',')[1]] : [],
          process_desc: '',
          unitPrice: 0,
          order_type: 1,
          infoData: [
            {
              date: '',
              worker: '',
              sizeColorList: [{}],
              substandardReason: []
            }
          ]
        }
      ],
      paramsArr: [],
      settlementLogList: [],
      processList: [],
      processStaffList: [{ children: [] }],
      addOrder: false,
      staffArr: [],
      departmentList: [],
      department: Number(this.$getLocalStorage('department')) || '',
      departmentName: ''
    }
  },
  methods: {
    init() {
      this.loading = true

      process.list({ type: 2 }).then((res) => {
        res.data.data.forEach((item: any) => {
          this.processList[0].children.push({ label: item.code + '-' + item.name, value: item.name })
        })
      })

      process.list({ type: 3 }).then((res) => {
        res.data.data.forEach((item: any) => {
          this.processList[1].children.push({ label: item.code + '-' + item.name, value: item.name })
        })
      })

      this.loading = false
    },
    checkAllStaff(e: any) {
      let arr = this.processStaffList[this.lostAddStaffChooseProcess].children.map((item: any) => {
        return item.id
      })

      this.staffIdList = this.staffIdList.concat(arr)
      this.staffIdList = Array.from(new Set(this.staffIdList))
    },
    addSettlementLog(index: number, type: string) {
      let isOrder = type === 'order'
      let staffInfo = this.settlementLogList[index]
      let process = this.$getLocalStorage('process') ? this.$getLocalStorage('process').split(',') : []
      // @ts-ignore
      process = process.length > 0 ? [Number(process[0]), process[1]] : process
      this.settlementLogList.splice(index + 1, 0, {
        staffName: staffInfo.name,
        staffCode: staffInfo.code,
        staffId: staffInfo.staffId,
        staff_id: staffInfo.staffId,
        show: true,
        process: isOrder ? staffInfo.process : process,
        processDesc: isOrder ? staffInfo.processDesc : [],
        process_desc: isOrder ? staffInfo.process_desc : [],
        order_code: '',
        product_info: [
          {
            code: '',
            size_name: '',
            color_name: '',
            number: '',
            extra_number: '',
            shoddy_number: '',
            shoddy_reason: []
          }
        ]
      })
    },
    contentHtml(content: string) {
      if (content === null) return ''
      // 富文本编辑器的内容如何只获得文字去掉标签
      // content = content.replace(/<[^>]+>/g, '')
      // 在上面的基础上还去掉了换行<br/>
      content = content.replace(/<[^>]+>/g, '').replace(/(\n)/g, '')
      return content
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
              let arr = this.$clone(this.staffArr)
              res.data.data.forEach((item: any) => {
                this.staffArr.forEach((staff: any, index: number) => {
                  if (item.id === staff.id) {
                    this.$deleteItem(arr, index)
                  }
                })
              })
              this.staffList = res.data.data.concat(arr)
              this.processStaffList = this.$getProcessStaff(this.staffList)
            })
        })
    },

    changeParams(e: any) {
      // @ts-ignore
      this.handleSelect(...this.paramsArr)
    },
    getProcessDesc(settlementLog: any, settlementLogIndex: number) {
      // 员工层级数据检查
      this.settlementLogList[settlementLogIndex].is_check = true
      process
        .list({
          name: settlementLog.process[1]
        })
        .then((res) => {
          if (res.data.status) {
            let str = settlementLog.process[1]
            settlementLog.processDesc = []
            if (!res.data.data.length) return

            let detailData = res.data.data.find((item: any) => {
              return item.name === str
            })

            if (detailData.process_desc) {
              detailData.process_desc.split(',').forEach((process_desc: any) => {
                settlementLog.processDesc.push({ label: process_desc, value: process_desc })
              })
            }
          } else {
            settlementLog.processDesc = []
          }
          this.$forceUpdate()
        })
    },
    closeAddOrder() {
      this.addOrder = false
      this.settlementLogList[this.lastOneChoose.settlementLogIndex].order_code = ''
    },
    copyWorkerInfo(item: any, itemSizeColor: any) {
      if (item.productId === '') {
        this.$message.error('请先选择产品')
        return
      }
      this.$addItem(item.infoData, {
        date: '',
        worker: '',
        sizeColorList: JSON.parse(JSON.stringify(itemSizeColor.sizeColorList)),
        substandardReason: []
      })
    },
    completeTable(checked: any, item: any, itemRoot: any) {
      if (checked) {
        if (item.checked === undefined) {
          item.checked = []
        }
        if (itemRoot.checked === undefined) {
          itemRoot.checked = []
        }
        item.checked.push(checked)
        itemRoot.checked.push(checked)
      } else {
        this.$deleteItem(item.checked, 0)
        this.$deleteItem(itemRoot.checked, 0)
      }
      this.$forceUpdate()
    },
    deleteSizeColor(settlementLog: any, indexDetail: number) {
      settlementLog.product_info.length > 1
        ? this.$deleteItem(settlementLog.product_info, indexDetail)
        : this.$message.error('至少有一个产品')
      this.$forceUpdate()
    },
    addSizeColor(settlementLog: any, itemDetail: any, indexDetail: number) {
      this.$addItem(settlementLog.product_info, {
        product_id: itemDetail.product_id,
        product_code: itemDetail.product_code,
        size_name: '',
        color_name: '',
        number: '',
        colorList: settlementLog.product_info[indexDetail].colorList || [],
        extra_number: '',
        shoddy_number: '',
        shoddy_reason: []
      })
      this.$forceUpdate()
    },
    copyThis(staffIndex?: any, index?: any, orderIndex?: any) {
      this.copyLine = [staffIndex, index, orderIndex]
      this.isCopy = true
    },
    checkDelete(settlementLogIndex: number) {
      let staff = this.settlementLogList[settlementLogIndex]
      if (staff.is_check) {
        this.$confirm('该订单下可能有已经填写的数据，是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$deleteItem(this.settlementLogList, settlementLogIndex)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$deleteItem(this.settlementLogList, settlementLogIndex)
      }
    },
    detailStaff(settlementLogList: any, settlementLogIndex: number) {
      let a = this.selectStaffIdList.filter((item: any) => {
        return item !== settlementLogList[settlementLogIndex].staffId
      })
      this.selectStaffIdList = a
      this.$deleteItem(settlementLogList, settlementLogIndex)
    },
    handleSelect(settlementLog: any, settlementLogIndex: number, type = 1, product_code = '', otherParam?: any) {
      this.loading = true
      if (this.isDone) return

      this.idDone = true
      this.lastOneChoose = {
        settlementLogIndex
      }

      let params = {}
      if (type === 1) {
        settlementLog.order_code = settlementLog.order_code.split(',')[0]
        params = { keyword: settlementLog.order_code, page: 1, limit: 10, order_type: this.order_type }
      } else if (type === 2) {
        params = {
          product_code: product_code.split(',')[0],
          page: this.page,
          limit: this.limit,
          order_type: this.order_type
        }
      }

      order.simpleList(params).then((res) => {
        if (type === 1) {
          order.detail({ id: res.data.data.items[0].id }).then((ress) => {
            let data = ress.data.data
            this.productionScheduleUpdate = [
              {
                id: data.id,
                group_id: data.group_id,
                order_type: data.order_type,
                code: data.code,
                indexStaff: settlementLogIndex,
                system_code: data.system_code,
                product_info: []
              }
            ]
            data.time_data[0].batch_data[0].product_data.forEach((item: any) => {
              this.productionScheduleUpdate[0].product_info.push({
                product_code: item.product_code,
                desc: item.desc,
                product_id: item.product_id,
                name: item.name,
                img: item.image_data,
                category: item.category + (item.secondary_category ? '/' + item.secondary_category : ''),
                colorSizeInfo: item.product_info
              })
            })
          })
        } else if (type === 2) {
          let data = res.data.data.items
          let info = [
            data.find((item: any) => {
              return item.code === product_code.split(',')[1]
            })
          ]

          this.productionScheduleUpdate = []
          this.total = res.data.data.total

          info.forEach((items: any, index: number) => {
            this.productionScheduleUpdate.push({
              id: items.id,
              code: items.code,
              group_id: data.group_id,
              indexStaff: settlementLogIndex,
              order_type: items.order_type,
              system_code: items.system_code,
              product_info: []
            })
            items.product_data.forEach((item: any) => {
              this.productionScheduleUpdate[index].product_info.push({
                product_code: item.product_code,
                desc: item.desc,
                product_id: item.product_id,
                name: item.name,
                img: item.image_data,
                category: item.category + (item.secondary_category ? '/' + item.secondary_category : ''),
                colorSizeInfo: item.product_info
              })
            })
          })
        }

        this.addOrder = true
        this.loading = false
        this.idDone = false
      })
    },
    selectStaff(id: number) {
      this.loading = true
      let end = false
      for (let i = 0; i < this.settlementLogList.length; i++) {
        const settlementLog = this.settlementLogList[i]
        if (settlementLog.staffId === id) {
          end = true
          break
        } else if (settlementLog.staff_id === id && settlementLog.staffId !== id) {
          settlementLog.staffId = id
          this.selectStaffIdList.push(id)
        }
      }

      if (end) {
        this.loading = false
        this.settlementLogList.forEach((settlementLog: any) => {
          if (settlementLog.staff_id === id && settlementLog.staffId !== id) {
            this.$message.error('请勿选择相同的员工')
            this.selectStaffIdList.splice(
              this.selectStaffIdList.findIndex((item: number) => {
                return item === settlementLog.staffId
              }),
              1
            )
            settlementLog.staff_id = ''
            settlementLog.staffId = ''
          }
        })
        return
      }

      let arr = this.settlementLogList
        .map((item: any) => {
          return item.staffId
        })
        .filter((item: any) => {
          return item != ''
        })

      this.selectStaffIdList = arr

      staff
        .detail({
          id: id
        })
        .then((res) => {
          if (res.data.status) {
            let arr = this.processList[0].children.map((item: any) => {
              return item.value
            })

            if (res.data.data.process) {
              arr = arr.concat(res.data.data.process.split('/'))
              arr = [...new Set(arr)]

              this.processList[0].children = arr.map((item: any) => {
                return { value: item, label: item }
              })
            }

            this.settlementLogList.forEach((item: any) => {
              if (item.staff_id === id) {
                if (res.data.data.process) {
                  if (res.data.data.process.split('/').length === 1) {
                    item.processInfo.forEach((itemProcess: any) => {
                      itemProcess.process = [0, res.data.data.process]
                    })
                  }
                }
              }
            })
          }

          this.loading = false
        })
    },
    querySearchAsync(str: string) {
      this.orderList = []
      if (str === '' || str === undefined) {
        return
      }
      this.searchLoading = true
      order
        .simpleList({
          order_code: str,
          order_type: this.order_type,
          client_id: this.client_id[2] || '',
          page: 1,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            if (new Date(res.headers.date) > new Date(this.reqTime) || this.reqTime === '') {
              this.reqTime = res.headers.date
              let arr: any = []
              res.data.data.items.forEach((item: any) => {
                arr.push({ value: item.code, id: item.id, created_at: item.created_at, client_name: item.client_name })
              })
              this.orderList = arr
            }
          } else {
            this.orderList = []
          }
          this.searchLoading = false
        })
    },
    querySearchAsync1(str: string) {
      this.orderList = []
      if (str === '' || str === undefined) {
        return
      }
      this.searchLoading = true
      order
        .simpleList({
          product_code: str,
          order_type: this.order_type,
          client_id: this.client_id[2] || '',
          page: 1,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            if (new Date(res.headers.date) > new Date(this.reqTime) || this.reqTime === '') {
              this.reqTime = res.headers.date
              let arr: any = []
              res.data.data.items.forEach((item: any) => {
                item.product_data.forEach((itemPro: any) => {
                  if (itemPro.product_code.indexOf(str) != -1) {
                    let colorGroup = ''
                    itemPro.product_info.forEach((itemColor: any, index: number) => {
                      colorGroup += index + 1 + '.' + itemColor.color_name + '；'
                    })

                    arr.push({
                      value: item.code,
                      id: item.id,
                      created_at: item.created_at,
                      client_name: item.client_name,
                      colorGroup: colorGroup.slice(0, colorGroup.length - 1),
                      product_name: itemPro.product_code
                    })
                  }
                })
              })
              this.orderList = arr
            }
          } else {
            this.orderList = []
          }
          this.searchLoading = false
        })
    },
    copyUp() {
      let obj = this.$clone(this.settlementLogList[this.settlementLogList.length - 1])
      obj.staffCode = ''
      obj.staffId = ''
      obj.staffName = ''
      obj.show = true
      obj.processInfo.forEach((item: any) => {
        item.product_info.forEach((itemPro: any) => {
          itemPro.product_detail_info.forEach((itemDetailPro: any) => {
            itemDetailPro.sizeColorInfo.forEach((itemColor: any) => {
              itemColor.extra_number = ''
              itemColor.shoddy_number = ''
              itemColor.number = ''
              itemColor.shoddy_reason = []
            })
          })
        })
      })

      this.settlementLogList.push(obj)
    },
    checkAllOrder(e: any) {
      this.productionScheduleUpdate.forEach((items: any) => {
        items.product_info.forEach((item: any) => {
          item.colorSizeInfo.forEach((sizeColor: any) => {
            sizeColor.check = e
          })
        })
        this.$forceUpdate()
      })
    },
    confirmSubmit() {
      let arr: any = []

      this.productionScheduleUpdate.forEach((items: any, index: number) => {
        let haveTrue = false

        items.product_info.forEach((product_info: any) => {
          product_info.colorSizeInfo.forEach((color: any) => {
            if (color.check) product_info.check = true
            if (haveTrue || color.check) {
              haveTrue = true
            }
          })
        })

        if (!haveTrue) return
        arr.push({
          order_code: items.code,
          order_type: items.order_type,
          order_id: items.id,
          group_id: items.group_id,
          product_detail_info: []
        })
        items.product_info.forEach((product_info: any) => {
          let colorList: any = []

          product_info.colorSizeInfo.forEach((color: any) => {
            colorList.push({
              name: (color.size_name || '无数据') + '/' + (color.color_name || '无数据'),
              value: color.size_id + ',' + color.color_id
            })
            color.colorList = colorList

            if (!color.check) return
            color.number = ''
            color.chooseId = color.size_id + ',' + color.color_id
            arr[arr.length - 1].product_detail_info.push({
              code: product_info.product_code,
              product_id: product_info.product_id,
              ...color
            })
          })
        })
        this.settlementLogList[items.indexStaff].is_check = true
        this.settlementLogList[items.indexStaff].order_id = arr[0].order_id
        this.settlementLogList[items.indexStaff].group_id = arr[0].group_id
        this.settlementLogList[items.indexStaff].order_code = arr[0].order_code
        this.settlementLogList[items.indexStaff].product_info = arr[0].product_detail_info
        this.settlementLogList[items.indexStaff].product_detail_info = items.product_info
        this.checkAll = false
      })

      this.addOrder = false
      this.orderList = []
      this.$forceUpdate()
    },
    addStaff() {
      let process = this.$getLocalStorage('process') ? this.$getLocalStorage('process').split(',') : []
      // @ts-ignore
      process = process.length > 0 ? [Number(process[0]), process[1]] : process
      this.settlementLogList.push({
        staffName: '',
        staffCode: '',
        staffId: '',
        staff_id: '',
        show: true,
        process: process,
        order_code: '',
        product_info: [
          {
            code: '',
            size_name: '',
            color_name: '',
            number: '',
            extra_number: '',
            shoddy_number: '',
            shoddy_reason: []
          }
        ]
      })
      this.oldList = this.$clone(this.settlementLogList)
    },
    // 改变之后把对应的值赋给自身，把选中列表的id更新一下
    getStaffIdList(index: any) {
      const e = this.settlementLogList[index].staffId
      this.settlementLogList[index].staff_id = e[1]

      // 拿到对应的员工信息
      let staffInfo = this.staffList.find((staff: any) => {
        return staff.id === e[1]
      })

      // 更新选中列表 以及赋值
      this.selectStaffIdList = []
      this.settlementLogList.forEach((item: any) => {
        if (item.staffId[1] === staffInfo.id) {
          item.staffName = staffInfo.name
          item.staffCode = staffInfo.code
        }
        this.selectStaffIdList.push(item.staffId[1])
      })
      this.oldList = this.$clone(this.settlementLogList)
    },
    // 批量添加员工
    openDialog() {
      this.staffIdList = this.$clone(this.selectStaffIdList)
      this.oldList = this.$clone(this.settlementLogList)
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
    },
    changPro(settlementLog: any, id: number, indexDetail: number) {
      let proInfo = settlementLog.product_detail_info.find((item: any) => {
        return item.product_id == id
      })

      let colorList: any = []

      proInfo.colorSizeInfo.forEach((item: any) => {
        colorList.push({ name: item.size_name + '/' + item.color_name, value: item.size_id + ',' + item.color_id })
      })

      settlementLog.product_info[indexDetail].product_code = proInfo.product_code
      settlementLog.product_info[indexDetail].chooseId = colorList[0].value
      settlementLog.product_info[indexDetail].colorList = colorList
    },
    // 提交数据到列表
    confirmData() {
      this.selectStaffIdList = this.$clone(this.staffIdList)
      if (this.staffIdList.length > 0) {
        // 增加判断
        this.staffIdList.forEach((staffId: number, staffIndex: number) => {
          // 如果重复则跳过
          let check = this.settlementLogList.find((item: any) => {
            return item.staffId[1] === staffId
          })

          if (check) {
            return
          }

          let staffInfo = this.staffList.find((staff: any) => {
            return staff.id === staffId
          })

          // 第一行自动覆盖
          if (staffIndex === 0) {
            this.settlementLogList[0].staffName = staffInfo.name
            this.settlementLogList[0].staffCode = staffInfo.code
            this.settlementLogList[0].staffId = ['', staffId]
            this.settlementLogList[0].staff_id = staffId
            this.settlementLogList[0].show = true
            return
          }

          let process = this.$getLocalStorage('process') ? this.$getLocalStorage('process').split(',') : []
          // @ts-ignore
          process = process.length > 0 ? [Number(process[0]), process[1]] : process
          this.settlementLogList.push({
            staffName: staffInfo.name,
            staffCode: staffInfo.code,
            staffId: ['', staffId],
            staff_id: staffId,
            show: true,
            process: process,
            order_code: '',
            product_info: [
              {
                code: '',
                size_name: '',
                color_name: '',
                number: '',
                extra_number: '',
                shoddy_number: '',
                shoddy_reason: []
              }
            ]
          })
        })

        this.settlementLogList.forEach((item: any, index: number) => {
          if (item.staffId === '') return

          let a = this.selectStaffIdList.find((staff: any) => {
            return staff === item.staffId[1]
          })

          if (!a) {
            this.settlementLogList.splice(index, 1)
          }
        })
      } else {
        let process = this.$getLocalStorage('process') ? this.$getLocalStorage('process').split(',') : []
        // @ts-ignore
        process = process.length > 0 ? [Number(process[0]), process[1]] : process
        this.settlementLogList = [
          {
            staffName: '',
            staffCode: '',
            staffId: '',
            staff_id: '',
            show: true,
            process: process,
            order_code: '',
            product_info: [
              {
                code: '',
                size_name: '',
                color_name: '',
                number: '',
                extra_number: '',
                shoddy_number: '',
                shoddy_reason: []
              }
            ]
          }
        ]
      }

      this.oldList = this.$clone(this.settlementLogList)
      this.closeDialog()
    },
    // 更改员工时点击
    changeMostStaff(id: number) {
      // 判断是否在已选中列表里面
      let check = !!this.selectStaffIdList.find((item: any) => {
        return item === id
      })

      // 判断现在是处于什么状态
      let checkType = !!this.staffIdList.find((item: any) => {
        return item === id
      })

      let staffInfo = this.settlementLogList.find((staff: any) => {
        return staff.staffId[1] === id
      })

      // 在列表中且处于取消状态时
      if (check && !checkType && staffInfo.is_check) {
        this.$confirm('该员工存在数据，取消选择后，会清空数据，是否取消？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => { })
          .catch(() => {
            this.staffIdList.push(id)
          })
      }
    },
    workSave() {
      this.loading = true

      let params: {
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
          price: number | string
          total_price: number | string
          shoddy_number: number | string
          shoddy_reason: string
          complete_time: string
        }>
      } = {
        data: []
      }

      let emptyStaff = this.settlementLogList.find((item: any) => {
        return item.staffId === ''
      })

      if (emptyStaff) {
        this.$message.error('请填写完整员工姓名')
        this.loading = false
        return
      }

      let error = false
      const checkArr: any[] = [] // 查询单据单价是否超过报价
      this.settlementLogList.forEach((settlementLog: any) => {
        // console.log(settlementLog, 'settlementLog')
        if (settlementLog.process[1] === '' || settlementLog.process.length === 0) {
          this.$message.error('请选择工序')
          error = true
          this.loading = false
          throw new Error('未选择工序')
        }

        if (settlementLog.order_code === '') {
          this.$message.error('请选择订单')
          error = true
          this.loading = false
          throw new Error('未选择订单')
        }

        settlementLog.product_info.forEach((product_info: any) => {
          // console.log(product_info, 'product_info')
          params.data.push({
            id: null,
            order_id: settlementLog.order_id,
            group_id: settlementLog.group_id,
            staff_id: settlementLog.staff_id,
            process_name: settlementLog.process[1],
            process_type: settlementLog.process[0],
            process_desc: settlementLog.process_desc.toString(),
            extra_number: product_info.extra_number || 0,
            size_id: product_info.size_id || 0,
            color_id: product_info.color_id || 0,
            number: product_info.number || 0,
            shoddy_number: product_info.shoddy_number || 0,
            shoddy_reason: product_info.shoddy_reason ? product_info.shoddy_reason.toString() : '',
            product_id: product_info.product_id,
            price: settlementLog.price || 0,
            total_price: this.outCiPin
              ? ((product_info.number || 0) + (product_info.extra_number || 0) - (product_info.shoddy_number || 0)) *
              (settlementLog.price || 0)
              : ((product_info.number || 0) + (product_info.extra_number || 0)) * (settlementLog.price || 0),
            complete_time: this.$GetDateStr(0)
          })
          checkArr.push({
            process_name: settlementLog.process[1],
            product_id: product_info.product_id,
            size_id: product_info.size_id,
            color_id: product_info.color_id,
            price: product_info.price
          })
        })
      })

      if (error) return
      // 查询单据单价是否超过报价
      checkPriceBeyond({
        doc_type: 14,
        data: checkArr
      }).then((res) => {
        if (res.data.data.length === 0) {
          workshop.save(params).then((res) => {
            if (res.data.status) {
              this.$message.success('提交成功')
              this.numberUpdate = false
              this.$router.push('/workshopManagement/payTimeList?page=1&type=1  ')
            }
          })
          this.loading = false
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
                  this.$message.success('提交成功')
                  this.numberUpdate = false
                  this.$router.push('/workshopManagement/payTimeList?page=1&type=1  ')
                }
              })
              this.loading = false
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              })
            })
        }
      })
    },
    // 粘贴该行
    parseThis(staffIndex: number) {
      let strCopyOption = this.copyOption.toString()
      // 员工层级数据检查
      this.settlementLogList[staffIndex].is_check = this.settlementLogList[this.copyLine[0]].is_check

      // 复制工序
      if (strCopyOption.indexOf('process') != -1) {
        this.settlementLogList[staffIndex].process = this.settlementLogList[this.copyLine[0]].process
      }

      // 复制工序说明
      if (strCopyOption.indexOf('proces_desc') != -1) {
        this.settlementLogList[staffIndex].process_desc = this.settlementLogList[this.copyLine[0]].process_desc
      }

      // 复制结算单价
      if (strCopyOption.indexOf('price') != -1) {
        this.settlementLogList[staffIndex].price = this.settlementLogList[this.copyLine[0]].price
      }

      // 复制订单
      if (strCopyOption.indexOf('order_code') != -1) {
        this.settlementLogList[staffIndex].order_code = this.settlementLogList[this.copyLine[0]].order_code
        this.settlementLogList[staffIndex].order_id = this.settlementLogList[this.copyLine[0]].order_id

        if (strCopyOption.indexOf('size_color') != -1) {
          this.settlementLogList[staffIndex].product_info = this.$clone(
            this.settlementLogList[this.copyLine[0]].product_info
          )

          this.settlementLogList[staffIndex].product_info.forEach((itemPro: any) => {
            itemPro.extra_number = ''
            itemPro.number = ''
            itemPro.shoddy_number = ''
            itemPro.shoddy_reason = []
          })

          this.settlementLogList[staffIndex].product_detail_info = this.$clone(
            this.settlementLogList[this.copyLine[0]].product_detail_info
          )
        }
      }

      this.isCopy = false
    },
    selectListStaffMore(e: Array<Number>) {
      if (e.length === 0) {
        this.$message.error('至少有一个员工')
        this.selectStaffIdList = [
          this.settlementLogList.filter((item: any) => {
            return item.show
          })[0].staff_id
        ]
        return
      }
      this.loading = true
      e.forEach((id: Number) => {
        let finder = this.settlementLogList.find((item: any) => item.staffId === id)
        if (finder === undefined) {
          let staffInfo = this.staffList.find((item: any) => item.id === id)
          let process = this.$getLocalStorage('process') ? this.$getLocalStorage('process').split(',') : []
          // @ts-ignore
          process = process.length > 0 ? [Number(process[0]), process[1]] : process
          this.$addItem(this.settlementLogList, {
            staffName: staffInfo.name,
            staffCode: staffInfo.code,
            staffId: id,
            staff_id: id,
            show: true,
            process: process,
            order_code: '',
            product_info: [
              {
                code: '',
                size_name: '',
                color_name: '',
                number: '',
                extra_number: '',
                shoddy_number: '',
                shoddy_reason: []
              }
            ]
          })
        } else {
          finder.show = true
        }
      })

      this.settlementLogList.forEach((item: any) => {
        let idFinder = e.find((id: Number) => id === item.staffId)
        if (idFinder === undefined) {
          item.show = false
        }
      })

      this.loading = false
    },
    // 监听一下鼠标滚轮
    listenWheel(ev: any) {
      const detail = ev.wheelDelta || ev.detail
      // 定义滚动方向，其实也可以在赋值的时候写
      const moveForwardStep = 1
      const moveBackStep = -1
      // 定义滚动距离
      let step = 0
      // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
      if (detail < 0) {
        step = moveForwardStep * 50
      } else {
        step = moveBackStep * 50
      }
      // @ts-ignore 对需要滚动的元素进行滚动操作
      this.$refs['listId'].scrollLeft += step
    },
    changeKeyBoard(val: boolean) {
      localStorage.showWorkShopKeyBoard = val + ''
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
          })
      })

    this.loading = true
    this.settlementLogList = []
    let _this = this
    let staffArr = JSON.parse(_this.$route.query.staffInfo + '')
    this.staffArr = staffArr.map((item: any) => {
      item.id = Number(item.id)
      return item
    })

    this.selectStaffIdList = this.staffArr.map((item: any) => {
      return item.id
    })

    let arr: any = [
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
    ]
    let arr1: any = []

    if (staffArr.length === 0) {
      let process = this.$getLocalStorage('process') ? this.$getLocalStorage('process').split(',') : [0, '']
      // @ts-ignore
      process = process.length > 0 ? [Number(process[0]), process[1]] : process
      this.settlementLogList.push({
        staffName: '',
        staffCode: '',
        staffId: '',
        staff_id: '',
        show: true,
        process: process,
        order_code: '',
        product_info: [
          {
            code: '',
            size_name: '',
            color_name: '',
            number: '',
            extra_number: '',
            shoddy_number: '',
            shoddy_reason: []
          }
        ]
      })
    }

    staffArr.forEach((staff: any) => {
      if (staff.process) {
        let processArr = staff.process.split('/')
        if (processArr.length === 1) {
          this.settlementLogList.push({
            staffName: staff.name,
            staffCode: staff.code,
            staffId: +staff.id,
            staff_id: +staff.id,
            show: true,
            process: [0, processArr[0]],
            order_code: '',
            product_info: [
              {
                code: '',
                size_name: '',
                color_name: '',
                number: '',
                extra_number: '',
                shoddy_number: '',
                shoddy_reason: []
              }
            ]
          })
        } else {
          let process = this.$getLocalStorage('process') ? this.$getLocalStorage('process').split(',') : [0, '']
          // @ts-ignore
          process = process.length > 0 ? [Number(process[0]), process[1]] : process
          this.settlementLogList.push({
            staffName: staff.name,
            staffCode: staff.code,
            staffId: +staff.id,
            staff_id: +staff.id,
            show: true,
            process: [0, process],
            order_code: '',
            product_info: [
              {
                code: '',
                size_name: '',
                color_name: '',
                number: '',
                extra_number: '',
                shoddy_number: '',
                shoddy_reason: []
              }
            ]
          })
        }
      } else {
        let process = this.$getLocalStorage('process') ? this.$getLocalStorage('process').split(',') : [0, '']
        // @ts-ignore
        process = process.length > 0 ? [Number(process[0]), process[1]] : process
        this.settlementLogList.push({
          staffName: staff.name,
          staffCode: staff.code,
          staffId: +staff.id,
          staff_id: +staff.id,
          show: true,
          process: process,
          order_code: '',
          product_info: [
            {
              code: '',
              size_name: '',
              color_name: '',
              number: '',
              extra_number: '',
              shoddy_number: '',
              shoddy_reason: []
            }
          ]
        })
      }

      staff.process.split('/').forEach((processs: any) => {
        if (processs !== '') {
          arr1.push(processs)
        }
      })
    })

    arr1 = [...new Set(arr1)]
    arr1.forEach((processs: string) => {
      arr[0].children.push({ label: processs, value: processs })
    })

    this.processList = arr

    this.init()
  },
  created() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
  },
  computed: {
    clientList(): any {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    }
  }
})
</script>

<style lang="less">
@import '~@/assets/css/workshopManagement/staffDetail.less';
</style>
<style>
.popup .el-checkbox__inner {
  border-color: black;
  width: 20px;
  height: 20px;
}

.el-checkbox__inner::after {
  left: 6px;
  height: 12px;
  width: 5px;
}
</style>
<style lang="less">
#workshopStaffDetail {
  .tbody {
    .el-input__suffix {
      display: none;
    }
  }

  .zhInputCtn {
    .zhInputBox {
      height: 38px;
    }
  }

  .detailCtn {
    background: white;
    margin: 20px 0;
  }

  .tbody {
    .zhInputCtn {
      .zhInputBox {
        .zhInput {
          border: 0;
        }
      }
    }
  }

  .tbody {
    .el-input .el-input__inner {
      border: 0;
      padding: 0;
    }
  }

  .cpyy .el-input__inner {
    padding-right: 0;
    border: 0;
  }

  .closeCtn {
    cursor: pointer;
    width: 20px;
    height: 20px;
    color: #fff;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background: #2e394f;

    &:hover {
      background: #737375;
    }
  }

  .backHoverRed {
    color: #fff;
    background: #f5222d;

    &:hover {
      background: #fd5b63;
    }
  }

  .el-select__input {
    margin-left: 0;
  }
}

.el-select-dropdown__empty {
  padding-left: 20px;
  padding-right: 20px;
}

.el-select-dropdown__item {
  height: unset;
  overflow: unset;
}
</style>