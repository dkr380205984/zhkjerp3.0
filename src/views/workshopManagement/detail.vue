<template>
  <div id="workshopManagementDetail" class="bodyContainer" v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">下单信息</div>
      </div>
      <div class="tableCtn">
        <div class="filterCtn" style="height: 50px">
          <div class="btn backHoverBlue fr" @click="dataChange()">数量更新</div>
        </div>
        <div class="thead">
          <div class="trow">
            <div class="tcol">产品信息</div>
            <div class="tcol noPad" style="flex: 8.7">
              <div class="trow">
                <div class="tcol" style="flex: 0.2; text-align: center">
                  <el-checkbox v-model="isCheckAllSizeColor" @change="chooseAllSizeColor"></el-checkbox>
                </div>
                <div class="tcol">尺码颜色</div>
                <div class="tcol">下单数量</div>
                <div class="tcol">下机数量</div>
                <div class="tcol noPad" style="flex: 3">
                  <div class="trow">
                    <div class="tcol">工序</div>
                    <div class="tcol">合计完成数量</div>
                    <div class="tcol">差值</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow" v-for="(itemPro, itemProIndex) in product_arr" :key="itemProIndex">
            <div class="tcol">
              <span>{{ itemPro.product_code }}</span>
              <span>（{{ itemPro.category + '/' + itemPro.secondary_category }}）</span>
            </div>
            <div class="tcol noPad" style="flex: 8.7">
              <div
                class="trow"
                v-for="(itemColorSize, itemColorSizeIndex) in itemPro.product_info"
                :key="itemColorSizeIndex"
              >
                <div class="tcol" style="flex: 0.2; text-align: center">
                  <el-checkbox
                    v-model="itemColorSize.checkSizeColor"
                    @change="forceUpdate(itemColorSize.checkSizeColor, itemPro)"
                  ></el-checkbox>
                </div>
                <div class="tcol">
                  <span>{{ itemColorSize.size_name + '/' + itemColorSize.color_name || '无' }}</span>
                </div>
                <div class="tcol">
                  <span>{{ itemColorSize.number }}</span>
                </div>
                <div class="tcol">
                  <span>{{ itemColorSize.inspection_number }}</span>
                </div>
                <div class="tcol noPad" style="flex: 3">
                  <div
                    class="trow"
                    v-for="(itemChild, indexChild) in itemColorSize.product_inspection_info"
                    :key="indexChild"
                  >
                    <!-- <div class="tcol" style="flex: 0.3; text-align: center">
                      <el-checkbox
                        v-model="itemChild.checkProcess"
                        @change="chooseProcess(itemPro, itemChild.checkProcess, itemProIndex)"
                      ></el-checkbox>
                    </div> -->
                    <div class="tcol">
                      {{ itemChild.process_name }}
                    </div>
                    <div class="tcol">
                      {{ itemChild.number }}
                    </div>
                    <div :class="itemChild.number - itemColorSize.number > 0 ? 'green tcol' : 'red tcol'">
                      {{ itemChild.number - itemColorSize.number }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module clearfix" v-show="processWorkerList.length !== 0">
      <el-tabs v-model="tabChoose" type="border-card">
        <el-tab-pane
          v-for="(item, index) in processWorkerList"
          :key="index"
          :label="item.process_name"
          :name="item.process_name"
        >
          <div class="titleCtn">
            <div class="title">完成报表</div>
          </div>
          <div class="tableCtn">
            <div class="filterCtn" style="overflow: hidden; margin-bottom: 10px">
              <div>工序说明：{{ item.allProcessDesc }}</div>
              <div class="btn backHoverBlue fr" @click="secondDataChance()">数量更新</div>
            </div>
            <div class="thead">
              <div class="trow">
                <div class="tcol">人员</div>
                <div class="tcol" style="flex: 1.5">产品编号</div>
                <div class="tcol noPad" style="flex: 8.7">
                  <div class="trow">
                    <div class="tcol">结算工序</div>
                    <div class="tcol">结算单价(元/件)</div>
                    <div class="tcol noPad" style="flex: 8.7">
                      <div class="trow">
                        <div class="tcol" style="text-align: center; flex: 0.2">
                          <el-checkbox v-model="processWorkerListCheck" @change="chooseWorkerProcess"></el-checkbox>
                        </div>
                        <div class="tcol">尺码颜色</div>
                        <div class="tcol">完成数量</div>
                        <div class="tcol">额外数量</div>
                        <div class="tcol">次品数量</div>
                        <div class="tcol">结算小计(元)</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tcol">结算合计(元)</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trowContainer" v-for="(itemInfo, itemInfoIndex) in item.info" :key="itemInfoIndex">
                <div
                  class="trow"
                  v-for="(itemInfoChild, itemInfoChildIndex) in itemInfo.info"
                  :key="itemInfoChildIndex"
                >
                  <div class="tcol">
                    <div>{{ itemInfo.staff_code.substring(itemInfo.staff_code.length - 4) }}</div>
                    <div>{{ itemInfo.staff_name }}</div>
                  </div>
                  <div class="tcol" style="flex: 1.5">{{ itemInfoChild.product_code }}</div>
                  <div class="tcol noPad" style="flex: 8.7">
                    <div
                      class="trowContainer"
                      v-for="(itemGrandSon, itemGrandSonIndex) in itemInfoChild.info"
                      :key="itemGrandSonIndex"
                    >
                      <div
                        class="trowContainer"
                        v-for="(itemProcessDesc, itemProcessDescIndex) in itemGrandSon.info"
                        :key="itemProcessDescIndex"
                      >
                        <div
                          class="trow"
                          v-for="(itemPrice, itemPriceIndex) in itemProcessDesc.info"
                          :key="itemPriceIndex"
                        >
                          <div class="tcol">
                            {{ item.process_name }}
                          </div>
                          <div class="tcol">
                            {{ itemProcessDesc.price }}
                          </div>
                          <div class="tcol noPad" style="flex: 8.7">
                            <div
                              class="trowContainer"
                              v-for="(itemSize, sizeIndex) in itemPrice.info"
                              :key="sizeIndex + 'sizeIndex'"
                            >
                              <div class="trow">
                                <div class="tcol" style="text-align: center; flex: 0.2">
                                  <el-checkbox
                                    v-model="itemSize.checked"
                                    @change="completeTable(itemSize.checked, item, itemProcessDesc)"
                                  ></el-checkbox>
                                </div>
                                <div class="tcol">
                                  {{ itemPrice.size_name + '/' + itemSize.color_name || '无' }}
                                </div>
                                <div class="tcol">
                                  {{ itemSize.info.number }}
                                </div>
                                <div class="tcol">
                                  {{ itemSize.info.extra_number }}
                                </div>
                                <div class="tcol">
                                  {{ itemSize.info.shoddy_number }}
                                </div>
                                <div class="tcol">
                                  {{ itemSize.info.total_price }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tcol">{{ itemInfoChild.allColorSizePrice }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module clearfix" v-show="processWorkerList.length !== 0">
      <div class="titleCtn">
        <div class="title">结算日志</div>
      </div>
      <div class="tableCtn">
        <el-table
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          :row-key="rowKey"
          :data="settlementLogList"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="loadingSet"
        >
          <el-table-column type="selection" width="55" :reserve-selection="true" fixed> </el-table-column>
          <el-table-column prop="id" label="序号" width="70" fixed></el-table-column>
          <el-table-column prop="created_at" label="添加时间" width="110" fixed> </el-table-column>
          <el-table-column prop="user_name" label="操作人" width="110" fixed> </el-table-column>
          <el-table-column label="审核状态" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.is_check === 0" class="orange">审核中</div>
              <div v-if="scope.row.is_check === 1" class="blue">通过</div>
              <div v-if="scope.row.is_check === 2" class="red">不通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="process_name" label="工序"> </el-table-column>
          <el-table-column label="工序说明" width="120">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.process_desc || '无工序说明'"
                placement="top-start"
              >
                <span class="blue" style="cursor: pointer">查看</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="staff_name" label="人员" width="120">
            <template slot-scope="scope">
              <div>{{ scope.row.staff_code.substring(scope.row.staff_code.length - 4) }}</div>
              <div>{{ scope.row.staff_name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="product_code" label="产品编号" width="120"> </el-table-column>
          <el-table-column label="颜色尺码" width="120">
            <template slot-scope="scope">{{
              (scope.row.size_name || '无尺码数据') + '/' + (scope.row.color_name || '无颜色数据')
            }}</template>
          </el-table-column>
          <el-table-column prop="number" label="完成数量" width="120"> </el-table-column>
          <el-table-column prop="extra_number" label="额外数量" width="120"> </el-table-column>
          <el-table-column prop="shoddy_number" label="次品数量" width="120"> </el-table-column>
          <el-table-column label="次品原因" width="120">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.shoddy_reason || '无次品原因'"
                placement="top-start"
              >
                <span class="blue" style="cursor: pointer">查看</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="结算单价(元/件)" width="150"> </el-table-column>
          <el-table-column prop="total_price" label="结算总价(元)" fixed="right" width="120"> </el-table-column>
        </el-table>
        <div class="pageCtn fr" style="overflew: hidden; margin-top: 20px">
          <el-pagination
            background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="getSettlementList"
          >
          </el-pagination>
        </div>
        <div class="buttonList" style="margin-bottom: 20px">
          <div style="margin-top: 20px; margin-left: 32px" class="btn backHoverBlue" @click="lostAgree">批量通过</div>
          <div style="margin-top: 20px; margin-left: 32px" class="btn backHoverRed" @click="lostDelete">批量删除</div>
        </div>
      </div>
    </div>
    <!-- 生产进度 -->
    <div class="popup" v-show="numberUpdate" v-loading="showPopupLoading" element-loading-target>
      <div class="main">
        <div class="titleCtn">
          <span class="text">生产进度更新</span>
          <div class="closeCtn">
            <span
              class="el-icon-close"
              @click="
                numberUpdate = false
                this.selectStaffIdList = []
              "
            ></span>
          </div>
        </div>
        <div class="contentCtn" style="padding-top: 15px; padding-bottom: 15px; max-height: 800px">
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
          </div>
          <el-checkbox v-model="outCiPin"
            >结算工资去除次品数量
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">
                勾选前，工资计算公式 = 结算单价 * （完成数量 + 额外数量）<br />勾选后，工资计算公式 = 结算单价 *
                （完成数量 + 额外数量 - 次品数量）
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-checkbox>
          <el-checkbox v-model="keyBoard" @change="changeKeyBoard">打开页面键盘</el-checkbox>
          <div class="tableCtn fixedTableCtn" style="padding-left: 0; padding-right: 0">
            <div class="cover" style="position: relative; z-index: 99">
              <div class="fixedRight tbody">
                <div class="trow" style="justify-content: start">
                  <div class="tcol bgGray" style="min-width: 200px">操作</div>
                </div>
                <div
                  v-for="(settlementLog, settlementLogIndex) in productionScheduleUpdate"
                  :key="'process' + settlementLogIndex"
                >
                  <div
                    class="trow"
                    style="justify-content: start; border-bottom: 1px solid #e9e9e9"
                    v-if="settlementLog.show"
                  >
                    <div class="tcol noPad">
                      <div
                        class="trow"
                        v-for="(itemDetail, indexDetail) in settlementLog.product_info"
                        :key="indexDetail + 'indexDetail'"
                      >
                        <div class="tcol" style="width: 0; flex: unset; padding: 0; border-right: unset"></div>
                        <div class="tcol" style="width: 0; flex: unset; padding: 0; border-right: unset"></div>
                        <div class="tcol" style="width: 0; flex: unset; padding: 0; border-right: unset"></div>
                        <div class="tcol" style="width: 0; flex: unset; padding: 0; border-right: unset"></div>
                        <div class="tcol" style="width: 0; flex: unset; padding: 0; border-right: unset"></div>
                        <div class="tcol" style="width: 0; flex: unset; padding: 0; border-right: unset"></div>
                        <div
                          class="tcol"
                          style="
                            flex-direction: row;
                            width: 200px;
                            align-items: center;
                            justify-content: space-between;
                            height: 46px;
                            border-bottom: unset;
                            align-self: center;
                          "
                        >
                          <div
                            class="hoverBlue"
                            v-if="!isCopy"
                            style="cursor: pointer"
                            @click="copyThis(settlementLogIndex, indexDetail)"
                          >
                            复制<br />该行
                          </div>
                          <div
                            class="hoverBlue"
                            v-if="isCopy && copyLine[0] === settlementLogIndex && copyLine[1] === indexDetail"
                            style="cursor: pointer"
                            @click="isCopy = false"
                          >
                            取消<br />复制
                          </div>
                          <div
                            class="hoverGreen"
                            v-if="isCopy && (copyLine[0] !== settlementLogIndex || copyLine[1] !== indexDetail)"
                            style="cursor: pointer"
                            @click="parseThis(settlementLogIndex, indexDetail)"
                          >
                            粘贴<br />该行
                          </div>
                          <div
                            class="hoverBlue"
                            style="cursor: pointer"
                            @click="addSettlementLog(settlementLogIndex, 'product', indexDetail)"
                          >
                            添加<br />产品
                          </div>
                          <div
                            class="hoverBlue"
                            style="cursor: pointer"
                            @click="addSettlementLog(settlementLogIndex, 'process')"
                          >
                            添加<br />工序
                          </div>
                          <div
                            style="cursor: pointer"
                            class="hoverRed"
                            @click="checkDelete(settlementLogIndex, indexDetail)"
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
            <div class="tbody" style="overflow: auto" @mousewheel.prevent="listenWheel" ref="listId">
              <div class="trow" style="justify-content: start">
                <div class="tcol bgGray" style="min-width: 101px">员工姓名</div>
                <div class="tcol bgGray" style="min-width: 101px">生产工序</div>
                <div class="tcol bgGray" style="min-width: 101px">工序说明</div>
                <div class="tcol bgGray" style="min-width: 101px">结算单价</div>
                <div class="tcol bgGray titleFix">产品编号</div>
                <div class="tcol bgGray" style="min-width: 150px">尺码颜色</div>
                <div class="tcol bgGray titleFix">完成数量</div>
                <div class="tcol bgGray titleFix">额外数量</div>
                <div class="tcol bgGray titleFix">次品数</div>
                <div class="tcol bgGray titleFix">次品原因</div>
                <div class="tcol bgGray" style="min-width: 200px">操作</div>
              </div>
              <div
                v-for="(settlementLog, settlementLogIndex) in productionScheduleUpdate"
                :key="'process' + settlementLogIndex"
              >
                <div
                  class="trow"
                  style="justify-content: start; border-bottom: 1px solid #e9e9e9"
                  v-if="settlementLog.show"
                >
                  <div class="tcol" style="min-width: 101px; max-width: 101px">
                    <el-cascader
                      placeholder="员工姓名搜索"
                      v-model="settlementLog.staffId"
                      :options="processStaffList"
                      filterable
                      :show-all-levels="false"
                      @change="getStaffIdList(settlementLogIndex)"
                    ></el-cascader>
                  </div>
                  <div class="tcol noPad" style="overflow: unset">
                    <div class="trow">
                      <div class="tcol" style="min-width: 101px; max-width: 101px">
                        <el-cascader
                          v-model="settlementLog.process"
                          filterable
                          :options="processList"
                          :show-all-levels="false"
                          clearable
                          placeholder="请选择工序"
                          @change="getProcessDesc(settlementLog, settlementLogIndex)"
                        ></el-cascader>
                      </div>
                      <div class="tcol" style="min-width: 101px; max-width: 101px">
                        <el-select
                          v-model="settlementLog.process_desc"
                          multiple
                          filterable
                          allow-create
                          default-first-option
                          collapse-tags
                          placeholder="请填写工序说明"
                          @change="settlementLog.is_check = true"
                        >
                          <el-option
                            v-for="(itemSon, indexSon) in settlementLog.processDesc"
                            :key="itemSon.value + indexSon"
                            :label="itemSon.label"
                            :value="itemSon.value"
                          >
                          </el-option>
                        </el-select>
                      </div>
                      <div class="tcol" style="min-width: 101px; max-width: 101px">
                        <div style="display: flex; align-items: top">
                          <div style="width: 82px; line-height: 38px">
                            <zh-input
                              v-model="settlementLog.price"
                              placeholder="结算单价"
                              :keyBoard="keyBoard"
                              type="number"
                              @change="settlementLog.is_check = true"
                            ></zh-input>
                          </div>
                          <div style="width: 3em; font-size: 14px; line-height: 38px">元/件</div>
                        </div>
                      </div>
                      <div class="tcol noPad">
                        <div
                          class="trow"
                          v-for="(itemDetail, indexDetail) in settlementLog.product_info"
                          :key="indexDetail + 'indexDetail'"
                        >
                          <div class="tcol titleFix">
                            <el-select
                              v-model="itemDetail.product_id"
                              filterable
                              remote
                              placeholder="请选择产品编号"
                              @change="changPro(settlementLog, itemDetail.product_id, indexDetail)"
                            >
                              <el-option
                                v-for="(itemSon, i) in product_arr"
                                :key="i + '产品orderList'"
                                :label="itemSon.product_code"
                                :value="itemSon.product_id"
                              >
                              </el-option>
                            </el-select>
                          </div>
                          <div class="tcol" style="display: block; position: relative; min-width: 150px">
                            <el-select
                              v-model="itemDetail.chooseId"
                              placeholder="请选择尺码颜色"
                              @change="
                                $forceUpdate()
                                settlementLog.is_check = true
                              "
                            >
                              <el-option
                                v-for="(colorItem, colorIndex) in itemDetail.colorList"
                                :key="colorItem.size_id + ',' + colorItem.color_id + colorIndex"
                                :label="colorItem.name"
                                :value="colorItem.value"
                              >
                              </el-option>
                            </el-select>
                            <i
                              class="el-icon-circle-plus-outline"
                              style="cursor: pointer; position: absolute; right: 15%; top: 30%"
                              @click="addSizeColor(settlementLog, itemDetail, indexDetail)"
                            ></i>
                            <i
                              class="el-icon-remove-outline"
                              style="cursor: pointer; position: absolute; right: 5%; top: 30%"
                              @click="deleteSizeColor(settlementLog, indexDetail)"
                            ></i>
                          </div>
                          <div class="tcol titleFix">
                            <div style="display: flex; align-items: center">
                              <zh-input
                                v-model="itemDetail.number"
                                placeholder="请输入完成数量"
                                :keyBoard="keyBoard"
                                type="number"
                                @change="settlementLog.is_check = true"
                              ></zh-input>
                              <div style="line-height: 38px">件</div>
                            </div>
                          </div>
                          <div class="tcol titleFix">
                            <div style="display: flex; align-items: center">
                              <zh-input
                                v-model="itemDetail.extra_number"
                                placeholder="请输入额外数量"
                                :keyBoard="keyBoard"
                                type="number"
                                @change="settlementLog.is_check = true"
                              ></zh-input>
                              <div style="line-height: 38px">件</div>
                            </div>
                          </div>
                          <div class="tcol titleFix">
                            <div style="display: flex; align-items: center">
                              <zh-input
                                v-model="itemDetail.shoddy_number"
                                placeholder="请输入次品数量"
                                :keyBoard="keyBoard"
                                type="number"
                                @change="settlementLog.is_check = true"
                              ></zh-input>
                              <div style="line-height: 38px">件</div>
                            </div>
                          </div>
                          <div class="tcol titleFix">
                            <el-select
                              v-model="itemDetail.shoddy_reason"
                              multiple
                              filterable
                              allow-create
                              default-first-option
                              collapse-tags
                              placeholder="请选择次品原因"
                              @change="settlementLog.is_check = true"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="elCtn">
            <div class="btn backHoverBlue" @click="openDialog">批量添加员工</div>
          </div>
          <div class="elCtn" style="margin-left: 20px">
            <div
              class="btn backHoverBlue"
              @click="
                $addItem(productionScheduleUpdate, {
                  staffName: '',
                  staffCode: '',
                  staffId: '',
                  staff_id: '',
                  show: true,
                  process: '',
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
              "
            >
              添加下个员工
            </div>
          </div>
          <div class="elCtn" style="margin-left: 20px">
            <el-checkbox-group v-model="copyOption">
              <el-dropdown :hide-on-click="false" trigger="click">
                <el-button size="small" type="primary" style="font-size: 16px; padding: 0 24px; line-height: 30px">
                  设置复制项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item> <el-checkbox label="process">生产工序</el-checkbox></el-dropdown-item>
                  <el-dropdown-item> <el-checkbox label="proces_desc">工序说明</el-checkbox></el-dropdown-item>
                  <el-dropdown-item> <el-checkbox label="price">结算单价</el-checkbox></el-dropdown-item>
                  <el-dropdown-item> <el-checkbox label="size_color">尺码颜色</el-checkbox></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-checkbox-group>
          </div>
        </div>
        <div class="oprCtn">
          <span
            class="btn borderBtn"
            @click="
              numberUpdate = false
              selectStaffIdList = []
            "
            >取消</span
          >
          <span class="btn backHoverBlue" @click="workSave">确认提交</span>
        </div>
      </div>
    </div>
    <el-dialog title="批量添加员工" width="70%" :visible.sync="showDialog" :before-close="closeDialog">
      <div class="elCtn">
        <el-select v-model="lostAddStaffChooseProcess" placeholder="请选择">
          <el-option v-for="(item, index) in processStaffList" :key="item.value" :label="item.label" :value="index">
          </el-option>
        </el-select>
      </div>
      <div class="elCtn" style="margin-left: 20px">
        <el-button type="primary" size="small" @click="checkAllStaff">全部选中</el-button>
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
    <div class="bottomFixBar">
      <div class="main">
        <!-- 报价单表格 -->
        <div class="priceCtn fl">
          <div
            class="btn"
            :class="{ backHoverBlue: priceProcessList.length > 0, backGray: priceProcessList.length === 0 }"
            @click="showPrice = !showPrice"
          >
            {{ priceProcessList.length > 0 ? (showPrice ? '关闭报价' : '查看报价') : '暂无报价' }}
          </div>
          <div class="priceTable" v-show="showPrice && priceProcessList.length > 0">
            <div class="module">
              <div class="titleCtn">
                <div class="title">报价信息</div>
              </div>
              <div class="contentCtn">
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">产品信息</div>
                      <div class="tcol noPad" style="flex: 4">
                        <div class="trow">
                          <div class="tcol">加工类型</div>
                          <div class="tcol">加工工序</div>
                          <div class="tcol">备注信息</div>
                          <div class="tcol">单价</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow" v-for="(item, index) in priceProcessList" :key="index">
                      <div class="tcol">{{ item.productInfo }}</div>
                      <div class="tcol noPad" style="flex: 4">
                        <div class="trow" v-for="(itemChild, indexChild) in item.childrenMergeInfo" :key="indexChild">
                          <div class="tcol">{{ itemChild.type }}</div>
                          <div class="tcol">{{ itemChild.process }}</div>
                          <div class="tcol">{{ itemChild.desc }}</div>
                          <div class="tcol">{{ itemChild.price }}元</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, process, quotedPrice, staff, workshop } from '@/assets/js/api'
import { OrderInfo } from '@/types/order'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import zhInput from '@/components/zhInput/zhInput.vue'
export default Vue.extend({
  components: { zhInput },
  data(): {
    orderInfo: OrderInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      keyBoard: localStorage.showWorkShopKeyBoard === 'true',
      showPopupLoading: false,
      showDialog: false,
      loadingSet: false,
      selectStaffIdList: [],
      staffIdList: [],
      oldList: [],
      lostAddStaffChooseProcess: 0,
      page: 1,
      total: 0,
      orderIndex: '0',
      product_arr: [],
      departmentName: '',
      department: '',
      departmentList: [],
      processStaffList: [{ children: [] }],
      copyOption: ['process', 'proces_desc', 'price', 'size_color'],
      isCopy: false,
      outCiPin: false,
      tabChoose: '',
      // 颜色尺码是否全选
      isCheckAllSizeColor: false,
      processWorkerListCheck: false,
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
      allWorkList: [
        {
          value: 3,
          label: '工序负责人员',
          children: []
        },
        {
          value: '',
          label: '所有人员',
          children: []
        }
      ],
      productionScheduleUpdate: [
        {
          staffName: '',
          staffCode: '',
          staffId: '',
          staff_id: '',
          show: true,
          process: '',
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
      ],
      settlementLogList: [],
      chooseSettlementLogList: [],
      processWorkerList: [],
      processList: [],
      processDescList: [],
      workList: [],
      orderInfo: {
        id: null,
        client_id: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '',
        settle_unit: '',
        order_type: 1,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: this.$getDate(new Date()),
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
            is_before_confirm: 2,
            is_send: 2,
            batch_data: [
              {
                id: '',
                batch_number: 1,
                batch_title: '',
                batch_type_id: '',
                delivery_time: '',
                is_urgent: 2,
                is_draft: 2,
                total_style: '',
                total_number: '',
                total_price: '',
                desc: '',
                product_data: [
                  {
                    product_id: '',
                    size_color_list: [],
                    image_data: [],
                    product_info: [
                      {
                        size_color: '',
                        size_id: '',
                        color_id: '',
                        number: '',
                        price: ''
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      numberUpdate: false,
      showPrice: false,
      priceProcessList: [] // 报价单报价信息
    }
  },
  methods: {
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
    init() {
      this.loading = true
      this.processList = []
      this.order_id = this.$route.query.id
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
              department: res.data.data.name
            })
            .then((res) => {
              let arr: any = []
              this.staffList = res.data.data.concat(arr)
              this.processStaffList = this.$getProcessStaff(this.staffList)
            })
        })
      workshop.detail({ order_id: this.order_id }).then((res) => {
        res.data.data.forEach((items: any) => {
          items.allProcessDesc = []
          items.info.forEach((item: any) => {
            item.info.forEach((itemSon: any) => {
              let number = 0
              itemSon.info.forEach((itemGrandSon: any) => {
                items.allProcessDesc.push(itemGrandSon.process_desc)
                itemGrandSon.info.forEach((itemProcessDesc: any) => {
                  itemProcessDesc.info.forEach((itemPrice: any) => {
                    itemPrice.info.forEach((itemSize: any) => {
                      number += itemSize.info.total_price
                    })
                  })
                })
              })
              itemSon.allColorSizePrice = number
            })
          })
          items.allProcessDesc = items.allProcessDesc.toString().replace(/^,+/, '').replace(/,+$/, '')
          let _this = this
          items.allProcessDesc.split(',').forEach((item: any) => {
            _this.processDescList.push({ value: item })
          })
        })
        this.processWorkerList = res.data.data
        this.tabChoose = res.data.data[0]?.process_name
      })

      this.getSettlementList()
      let allArr: any = []
      process.list({ type: 2 }).then((res) => {
        let arr: any = []
        res.data.data.forEach((item: any) => {
          arr.push({
            label: item.code + '-' + item.name,
            value: item.name
          })
          allArr.push({
            label: item.code + '-' + item.name,
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
              label: item.code + '-' + item.name,
              value: item.name
            })
            allArr.push({
              label: item.code + '-' + item.name,
              value: item.name
            })
          })
          this.processList.push({
            label: '成品加工工序',
            value: 3,
            children: arr
          })
          this.processList.unshift({
            label: '所有工序',
            value: '',
            children: allArr
          })
        })
      })

      order
        .processList({
          order_id: Number(this.$route.query.id)
        })
        .then((res) => {
          if (res.data.status) {
            let arr: any = []
            res.data.data.forEach((item: any) => {
              arr.push({
                label: item,
                value: item
              })
            })
          }
        })

      this.getWorkList('')
      this.loading = false
    },
    rowKey(row: { id: any }) {
      return row.id
    },
    getSettlementList() {
      this.loadingSet = true
      workshop.list({ order_id: this.order_id, page: this.page, limit: 10 }).then((res) => {
        this.settlementLogList = res.data.data.items
        this.additional = res.data.data.additional
        this.total = res.data.data.total
        this.loadingSet = false
      })
    },
    // 添加产品工序
    addSettlementLog(index: number, type: string, proIndex: number) {
      let isPro = type === 'product'
      let staffInfo = this.productionScheduleUpdate[index]
      if (isPro) {
        this.productionScheduleUpdate[index].product_info.splice(proIndex + 1, 0, {
          code: '',
          size_name: '',
          color_name: '',
          number: '',
          extra_number: '',
          shoddy_number: '',
          shoddy_reason: []
        })
      } else {
        this.productionScheduleUpdate.splice(index + 1, 0, {
          staffName: staffInfo.name,
          staffCode: staffInfo.code,
          staffId: staffInfo.staffId,
          staff_id: staffInfo.staffId,
          show: true,
          process: '',
          processDesc: [],
          process_desc: [],
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
    },
    // 更改部门
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
    // 拿到工序说明
    getProcessDesc(settlementLog: any, settlementLogIndex: number) {
      // 员工层级数据检查
      this.productionScheduleUpdate[settlementLogIndex].is_check = true
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
    // querySearch(queryString: string, cb: any) {
    //   if (this.processDescList === undefined || this.processDescList.length === 0) {
    //     cb([])
    //     return
    //   }

    //   cb(this.processDescList)
    // },

    // 删除尺码颜色
    deleteSizeColor(settlementLog: any, indexDetail: number) {
      settlementLog.product_info.length > 1
        ? this.$deleteItem(settlementLog.product_info, indexDetail)
        : this.$message.error('至少有一个产品')
      this.$forceUpdate()
    },
    // 增加尺码颜色
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
    // 删除该行
    checkDelete(settlementLogIndex: number, indexPro: number) {
      let staff = this.productionScheduleUpdate[settlementLogIndex]
      if (staff.product_info.length > 1) {
        if (staff.is_check) {
          this.$confirm('该员工下可能有已经填写的数据，是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$deleteItem(staff.product_info, indexPro)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        } else {
          this.$deleteItem(staff.product_info, indexPro)
        }
      } else {
        this.staffDelete(settlementLogIndex)
      }
    },
    // 删除员工
    staffDelete(settlementLogIndex: number) {
      let staff = this.productionScheduleUpdate[settlementLogIndex]
      if (this.productionScheduleUpdate.length > 1) {
        if (staff.is_check) {
          this.$confirm('该员工下可能有已经填写的数据，是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$deleteItem(this.productionScheduleUpdate, settlementLogIndex)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        } else {
          this.$deleteItem(this.productionScheduleUpdate, settlementLogIndex)
        }
      } else {
        this.$message.error('至少有一个员工')
        return
      }
    },
    // 批量添加员工
    openDialog() {
      this.staffIdList = this.$clone(this.selectStaffIdList)
      this.oldList = this.$clone(this.productionScheduleUpdate)
      this.showDialog = true
    },
    // 关闭批量选择员工弹窗
    closeDialog() {
      this.showDialog = false
    },
    // 选择员工，改变之后把对应的值赋给自身，把选中列表的id更新一下
    getStaffIdList(index: any) {
      const e = this.productionScheduleUpdate[index].staffId
      this.productionScheduleUpdate[index].staff_id = e[1]

      // 拿到对应的员工信息
      let staffInfo = this.staffList.find((staff: any) => {
        return staff.id === e[1]
      })

      // 更新选中列表 以及赋值
      this.selectStaffIdList = []
      this.productionScheduleUpdate.forEach((item: any) => {
        if (item.staffId[1] === staffInfo.id) {
          item.staffName = staffInfo.name
          item.staffCode = staffInfo.code
        }
        this.selectStaffIdList.push(item.staffId[1])
      })
      this.oldList = this.$clone(this.productionScheduleUpdate)
    },
    // 全选员工
    checkAllStaff(e: any) {
      let arr = this.processStaffList[this.lostAddStaffChooseProcess].children.map((item: any) => {
        return item.id
      })

      this.staffIdList = this.staffIdList.concat(arr)
      this.staffIdList = Array.from(new Set(this.staffIdList))
    },
    // 提交数据到列表
    confirmData() {
      this.selectStaffIdList = this.$clone(this.staffIdList)
      if (this.staffIdList.length > 0) {
        // 增加判断
        this.staffIdList.forEach((staffId: number, staffIndex: number) => {
          // 如果重复则跳过
          let check = this.productionScheduleUpdate.find((item: any) => {
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
            this.productionScheduleUpdate[0].staffName = staffInfo.name
            this.productionScheduleUpdate[0].staffCode = staffInfo.code
            this.productionScheduleUpdate[0].staffId = ['', staffId]
            this.productionScheduleUpdate[0].staff_id = staffId
            this.productionScheduleUpdate[0].show = true
            return
          }

          this.productionScheduleUpdate.push({
            staffName: staffInfo.name,
            staffCode: staffInfo.code,
            staffId: ['', staffId],
            staff_id: staffId,
            show: true,
            process: '',
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

        this.productionScheduleUpdate.forEach((item: any, index: number) => {
          if (item.staffId === '') return

          let a = this.selectStaffIdList.find((staff: any) => {
            return staff === item.staffId[1]
          })

          if (!a) {
            this.productionScheduleUpdate.splice(index, 1)
          }
        })
      } else {
        this.productionScheduleUpdate = [
          {
            staffName: '',
            staffCode: '',
            staffId: '',
            staff_id: '',
            show: true,
            process: '',
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

      this.oldList = this.$clone(this.productionScheduleUpdate)
      this.closeDialog()
    },
    // 保存
    workSave() {
      this.loading = true

      let params: {
        data: Array<{
          id: number | string | null
          staff_id: number | string
          order_id: number | string
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

      let emptyStaff = this.productionScheduleUpdate.find((item: any) => {
        return item.staffId === '' || item.staffId.length === 0
      })

      if (emptyStaff) {
        this.$message.error('请填写完整员工姓名')
        this.loading = false
        return
      }

      let error = false

      this.productionScheduleUpdate.forEach((settlementLog: any) => {
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
          params.data.push({
            id: null,
            order_id: this.$route.query.id + '',
            staff_id: settlementLog.staffId[1],
            process_name: settlementLog.process[1],
            process_type: settlementLog.process[0],
            process_desc: settlementLog.process_desc ? settlementLog.process_desc.toString() : '',
            extra_number: product_info.extra_number || 0,
            size_id: product_info.size_id || product_info.chooseId.split(',')[0] || 0,
            color_id: product_info.color_id || product_info.chooseId.split(',')[1] || 0,
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
        })
      })

      if (error) return

      workshop.save(params).then((res) => {
        if (res.data.status) {
          this.$message.success('提交成功')
          this.numberUpdate = false
          this.selectStaffIdList = []
          this.processWorkerListCheck = false
          this.init()
          this.resetProductionScheduleUpdate()
        }
      })
      this.loading = false
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
    chooseWorkerProcess(bol: any) {
      this.processWorkerList.forEach((processWorkerItem: any) => {
        if (processWorkerItem.process_name === this.tabChoose) {
          processWorkerItem.info.forEach((staffNameItem: any) => {
            staffNameItem.info.forEach((productCodeItem: any) => {
              productCodeItem.info.forEach((process_desc: any) => {
                process_desc.process_desc = (process_desc.process_desc + '').split(',')
                process_desc.info.forEach((item: any) => {
                  item.info.forEach((itemPrice: any) => {
                    itemPrice.info.forEach((itemSize: any) => {
                      itemSize.checked = bol
                      if (bol) {
                        if (processWorkerItem.checked === undefined) {
                          processWorkerItem.checked = []
                        }
                        if (item.checked === undefined) {
                          item.checked = []
                        }
                        processWorkerItem.checked.push(bol)
                        item.checked.push(bol)
                      } else {
                        this.$deleteItem(processWorkerItem.checked, 0)
                        this.$deleteItem(item.checked, 0)
                      }
                    })
                  })
                })
              })
            })
          })
        }
      })
    },
    confirmSubmit() {
      let params: {
        data: Array<{
          order_id: number | string
          staff_id: number | string
          process_name: number | string
          process_type: number | string
          process_desc: string
          extra_number: number | string
          order_product_id: number | string
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
      const data: any = []

      this.productionScheduleUpdate.forEach((items: any) => {
        if (items.productId === '') {
          this.$message.error('请选择加工产品')
          throw Error()
        }
        if (items.process === '') {
          this.$message.error('请选择工序')
          throw Error()
        }
        items.infoData.forEach((item: any) => {
          if (item.worker === '') {
            this.$message.error('请选择员工')
            throw Error()
          }
          item.sizeColorList.forEach((itemChild: any) => {
            if (itemChild.complete_time === undefined) {
              this.$message.error('请选择日期')
              throw Error()
            }
            let obj: {
              id: number | string
              staff_id: number | string
              order_id: number | string
              process_name: string | number
              process_desc: string
              process_type: string | number
              order_product_id: string | number
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
            } = {
              id: '',
              order_id: this.order_id,
              process_name: items.process[1],
              process_type: items.process[0],
              process_desc: items.process_desc ? items.process_desc.toString() : '',
              order_product_id: items.productNameId,
              product_id: items.productId,
              price: items.unitPrice || 0,
              staff_id: item.worker[1],
              size_id: itemChild.chooseId.split(',')[0],
              extra_number: itemChild.extra_number || 0,
              color_id: itemChild.chooseId.split(',')[1],
              number: itemChild.complete_number || 0,
              total_price: this.outCiPin
                ? ((itemChild.complete_number || 0) + (itemChild.extra_number || 0) - (itemChild.shoddy_number || 0)) *
                  (items.unitPrice || 0)
                : ((itemChild.complete_number || 0) + (itemChild.extra_number || 0)) * (items.unitPrice || 0),
              shoddy_number: itemChild.shoddy_number || 0,
              shoddy_reason: itemChild.shoddy_reason ? itemChild.shoddy_reason.toString() : '',
              complete_time: itemChild.complete_time
            }
            data.push(obj)
            params.data = data
          })
        })
      })

      workshop.save(params).then((res) => {
        if (res.data.status) {
          this.$message.success('提交成功')
          this.numberUpdate = false
          this.selectStaffIdList = []
          location.reload()
        }
      })
    },
    dataChange() {
      // 如果没选，那么给他一个默认的
      this.resetProductionScheduleUpdate()
      if (!this.product_arr.some((res: any) => res.checkSizeColor !== undefined && res.checkSizeColor.length !== 0)) {
        this.numberUpdate = true
        return
      }

      let arr: any = []
      this.productionScheduleUpdate[0].product_info = []

      this.product_arr.forEach((item: any, index: any) => {
        if (item.checkSizeColor === undefined || item.checkSizeColor.length === 0) {
          return
        }

        item.product_info.forEach((itemColor: any) => {
          let obj: any = {}
          itemColor.product_id = item.product_id

          if (itemColor.checkSizeColor) {
            obj = this.$clone(itemColor)
            obj.chooseId = obj.size_id + ',' + obj.color_id
            obj.number = ''
            obj.colorList = item.product_info.map((items: any) => {
              return {
                value: items.size_id + ',' + items.color_id,
                name: items.size_name + '/' + items.color_name
              }
            })
            arr.push(obj)
          }
        })
      })

      this.productionScheduleUpdate[0].product_info = arr
      this.numberUpdate = true
    },
    // 第二个数据格式转换
    secondDataChance() {
      this.showPopupLoading = true
      if (!this.processWorkerList.some((res: any) => res.checked !== undefined && res.checked.length !== 0)) {
        this.resetProductionScheduleUpdate()
        this.numberUpdate = true
        this.showPopupLoading = false
        return
      }

      let arr: any = []

      this.processWorkerList.forEach((processWorker: any) => {
        if (processWorker.process_name === this.tabChoose) {
          processWorker.info.forEach((staffNameItem: any) => {
            let obj: any = {
              staffName: staffNameItem.staff_name,
              staffCode: staffNameItem.staff_code,
              process: ['', processWorker.process_name],
              show: true,
              product_info: []
            }
            staffNameItem.info.forEach((productCodeItem: any) => {
              productCodeItem.info.forEach((process_desc: any) => {
                process_desc.info.forEach((itemPrice: any) => {
                  obj.price = Number(itemPrice.price)
                  itemPrice.info.forEach((itemSize: any) => {
                    itemSize.info.forEach((itemColor: any) => {
                      if (itemColor.checked === undefined || itemColor.checked === false) return
                      this.selectStaffIdList.push(itemColor.info.staff_id)
                      obj.staffId = ['', itemColor.info.staff_id]
                      itemColor.info.number = ''
                      itemColor.info.shoddy_number = ''
                      itemColor.info.extra_number = ''
                      itemColor.info.chooseId = itemColor.info.size_id + ',' + itemColor.info.color_id
                      itemColor.info.colorList = this.product_arr
                        .find((item: any) => {
                          return item.product_id == itemColor.info.product_id
                        })
                        .product_info.map((item: any) => {
                          return {
                            name: item.size_name + '/' + item.color_name,
                            value: item.size_id + ',' + item.color_id
                          }
                        })

                      obj.product_info.push(itemColor.info)
                    })
                    if (
                      itemPrice.checked === undefined ||
                      itemPrice.checked.length === 0 ||
                      obj.product_info.length < 1
                    ) {
                      return
                    }
                    arr.push(obj)
                  })
                })
              })
            })
          })
          this.showPopupLoading = false
        }
      })

      this.staffIdList = [...new Set(this.selectStaffIdList)]
      this.productionScheduleUpdate = arr
      this.numberUpdate = true
    },
    changPro(settlementLog: any, id: number, indexDetail: number) {
      let proInfo = this.product_arr.find((item: any) => {
        return item.product_id == id
      })

      let colorList: any = []
      proInfo.product_info.forEach((item: any) => {
        colorList.push({ name: item.size_name + '/' + item.color_name, value: item.size_id + ',' + item.color_id })
      })

      settlementLog.product_info[indexDetail].product_code = proInfo.product_code
      settlementLog.product_info[indexDetail].chooseId = colorList[0].value
      settlementLog.product_info[indexDetail].colorList = colorList
    },
    chooseProcess(item: any, check: any, itemProIndex: any) {
      if (item.checkProcess === undefined) {
        item.checkProcess = []
      }
      if (check) {
        item.checkProcess.push(check)
      } else {
        if (item.checkProcess.length !== 0) {
          this.$deleteItem(item.checkProcess, 0)
        }
      }
      item.product_info[itemProIndex].checkProcess = check
      this.$forceUpdate()
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
    getWorkList(res: any) {
      process
        .list({
          name: res === '' ? res : res.process[1]
        })
        .then((ress) => {
          if (res === '') {
            res = {}
          }
          res.processDescList = []
          if (ress.data.data[0]?.process_desc) {
            let _this = this
            res.processDescList = ress.data.data[0].process_desc.split(',')
            let arr: Array<{ value: string }> = []
            res.processDescList.forEach((item: any) => {
              _this.processDescList.push({
                value: item
              })
            })
          }
          this.$forceUpdate()
        })
      staff.list({ keyword: res === '' ? res : res.process[1], status: 1 }).then((ress: any) => {
        let arr: any = []
        ress.data.data.forEach((worker: any) => {
          arr.push({
            value: worker.id,
            label: worker.code.substring(worker.code.length - 4) + ' ' + worker.name
          })
        })
        this.allWorkList[0].children = arr
      })
      staff.list({ keyword: '', status: 1 }).then((ress: any) => {
        let arr: any = []
        ress.data.data.forEach((worker: any) => {
          arr.push({
            value: worker.id,
            label: worker.code.substring(worker.code.length - 4) + ' ' + worker.name
          })
        })
        this.allWorkList[1].children = arr
      })
    },
    getColorList(res: any) {
      let product_info = this.product_arr.find((val: any) => {
        return val.id === res.productNameId
      })

      res.productId = product_info.product_id
      res.infoData.forEach((el: any) => {
        let arr: any = []

        product_info.product_info.forEach((item: any) => {
          arr.push(JSON.parse(JSON.stringify(item)))
        })

        el.sizeColorList = arr
      })
    },
    chooseAllSizeColor(bol: boolean) {
      // 判断是否全部选择
      this.isCheckAllSizeColor = bol

      this.product_arr.forEach((itemPro: any) => {
        itemPro.product_info.forEach((itemSizeColor: any) => {
          if (bol) {
            if (itemPro.checkSizeColor === undefined) {
              itemPro.checkSizeColor = []
            }
            itemPro.checkSizeColor.push(bol)
          } else {
            itemPro.checkSizeColor = []
          }
          itemSizeColor.checkSizeColor = bol
        })
      })
    },
    forceUpdate(checked: any, itemPro: any) {
      if (itemPro.checkSizeColor === undefined) {
        itemPro.checkSizeColor = []
      }
      if (checked) {
        itemPro.checkSizeColor.push(checked)
      } else {
        if (itemPro.checkSizeColor.length !== 0) {
          this.$deleteItem(itemPro.checkSizeColor, 0)
        }
      }
      this.$forceUpdate()
    },
    // 复制该行
    copyThis(staffIndex: any, proIndex: any) {
      this.copyLine = [staffIndex, proIndex]
      this.isCopy = true
    },
    // 粘贴该行
    parseThis(staffIndex: number, proIndex: number) {
      let strCopyOption = this.copyOption.toString()
      // 员工层级数据检查
      this.productionScheduleUpdate[staffIndex].is_check = this.productionScheduleUpdate[this.copyLine[0]].is_check

      // 复制工序
      if (strCopyOption.indexOf('process') != -1) {
        this.productionScheduleUpdate[staffIndex].process = this.productionScheduleUpdate[this.copyLine[0]].process
      }

      // 复制工序说明
      if (strCopyOption.indexOf('proces_desc') != -1) {
        this.productionScheduleUpdate[staffIndex].process_desc =
          this.productionScheduleUpdate[this.copyLine[0]].process_desc
      }

      // 复制结算单价
      if (strCopyOption.indexOf('price') != -1) {
        this.productionScheduleUpdate[staffIndex].price = this.productionScheduleUpdate[this.copyLine[0]].price
      }

      // 复制尺码颜色
      if (strCopyOption.indexOf('size_color') != -1) {
        this.productionScheduleUpdate[staffIndex].product_info[proIndex] = this.$clone(
          this.productionScheduleUpdate[this.copyLine[0]].product_info[this.copyLine[1]]
        )
        this.productionScheduleUpdate[staffIndex].product_info[proIndex].number = ''
        this.productionScheduleUpdate[staffIndex].product_info[proIndex].extra_number = ''
        this.productionScheduleUpdate[staffIndex].product_info[proIndex].shoddy_number = ''
        this.productionScheduleUpdate[staffIndex].product_info[proIndex].shoddy_reason = []
      }

      this.isCopy = false
    },
    resetProductionScheduleUpdate() {
      this.productionScheduleUpdate = [
        {
          staffName: '',
          staffCode: '',
          staffId: '',
          staff_id: '',
          show: true,
          process: '',
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
      // this.select
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
            let a: any = this.$refs
            a.multipleTable.clearSelection()
          }
        })
    },
    handleSelectionChange(val: any) {
      this.chooseSettlementLogList = val
    },
    changeKeyBoard(val: boolean) {
      localStorage.showWorkShopKeyBoard = val + ''
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
    }
  },
  mounted() {
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.order_id = res.data.data.time_data[this.orderIndex].id
        this.orderInfo = res.data.data
        res.data.data.time_data[0].batch_data.forEach((item: any) => {
          item.product_data.forEach((itemPro: any) => {
            this.product_arr.push(itemPro)
          })
        })
        this.init()
      })
    // 优化报价信息
    quotedPrice
      .detailByOrder({
        order_id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          if (res.data.data.length > 0) {
            res.data.data.forEach((item: QuotedPriceInfo) => {
              item.product_data.forEach((itemPro) => {
                itemPro.semi_product_data.forEach((itemProcess) => {
                  this.priceProcessList.push({
                    type: '半成品加工工序',
                    productInfo: itemPro.rel_product_info
                      ? itemPro.rel_product_info.product_code +
                        '(' +
                        itemPro.category_name +
                        '/' +
                        itemPro.secondary_category +
                        ')'
                      : itemPro.category_name + '/' + itemPro.secondary_category,
                    process: itemProcess.name,
                    desc: itemProcess.desc,
                    price: itemProcess.total_price
                  })
                })
                itemPro.production_data.forEach((itemProcess) => {
                  this.priceProcessList.push({
                    type: '成品加工工序',
                    productInfo: itemPro.rel_product_info
                      ? itemPro.rel_product_info.product_code +
                        '(' +
                        itemPro.category_name +
                        '/' +
                        itemPro.secondary_category +
                        ')'
                      : itemPro.category_name + '/' + itemPro.secondary_category,
                    process: itemProcess.name,
                    desc: itemProcess.desc,
                    price: itemProcess.total_price
                  })
                })
              })
            })
            this.priceProcessList = this.$mergeData(this.priceProcessList, {
              mainRule: 'productInfo'
            })
          }
        }
      })
  }
})
</script>

<style lang="less">
@import '~@/assets/css/workshopManagement/detail.less';
</style>
<style lang="less">
#workshopManagementDetail {
  .el-tabs__content {
    padding: 0;
  }
  .tbody {
    .el-input input {
      padding: 3px 0;
      border: none;
    }

    .el-input__suffix {
      display: none;
    }
  }
  .zhInputCtn {
    border: none;
    .zhInputBox {
      .zhInput {
        padding: 0;
        border: 0;
      }
    }
    .zhInputAppend {
      border-left: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
  .el-select__input {
    margin-left: 0;
  }
}
</style>