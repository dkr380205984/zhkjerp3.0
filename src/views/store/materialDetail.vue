<template>
  <div id="storeDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">仓库信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">仓库名称：</div>
            <div class="text">{{storeDetail.name}}</div>
          </div>
          <div class="col">
            <div class="label">仓库类型：</div>
            <div class="text">{{storeDetail.type===1?'本厂仓库':storeDetail.type===2?'加工厂仓库':'供货商仓库'}}</div>
          </div>
          <div class="col">
            <div class="label">关联单位：</div>
            <div class="text">{{storeDetail.client_name||'无'}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注信息：</div>
            <div class="text">{{storeDetail.desc || '无'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">库存信息</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="storeTotalFilter.material_name"
              placeholder="请输入物料名称搜索"
              @change="storePage=1;$forceUpdate()"></el-input>
          </div>
          <div class="elCtn"
            style="width:184px">
            <el-input placeholder="批号"
              v-model="storeTotalFilter.batch_code"
              @change="storePage=1;$forceUpdate()"></el-input>
          </div>
          <div class="elCtn"
            style="width:184px">
            <el-input placeholder="缸号"
              v-model="storeTotalFilter.vat_code"
              @change="storePage=1;$forceUpdate()"></el-input>
          </div>
          <div class="elCtn"
            style="width:184px">
            <el-input placeholder="色号"
              v-model="storeTotalFilter.color_code"
              @change="storePage=1;$forceUpdate()"></el-input>
          </div>
          <div class="btn backHoverGreen fr"
            @click="goStock(9)">物料入库</div>
          <div class="btn backHoverOrange fr"
            @click="goStock(13)">物料出库</div>
          <div class="btn backHoverBlue fr"
            @click="goStock(7)">物料移库</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">物料名称</div>
            <div class="col">物料颜色</div>
            <div class="col">物料属性</div>
            <div class="col">批号</div>
            <div class="col">缸号</div>
            <div class="col">色号</div>
            <div class="col">库存数</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in storeTotalList"
            :key="item.id">
            <div class="col">
              <el-checkbox v-model="item.check">{{item.material_name}}</el-checkbox>
            </div>
            <div class="col">{{item.material_color}}</div>
            <div class="col">{{item.attribute || '无属性'}}</div>
            <div class="col">{{item.batch_code}}</div>
            <div class="col">{{item.vat_code}}</div>
            <div class="col">{{item.color_code}}</div>
            <div class="col">{{item.number}}kg</div>
            <div class="col">
              <div class="oprCtn">
                <span class="opr hoverGreen"
                  @click="goStock(9,item)">入库</span>
                <span class="opr hoverOrange"
                  @click="goStock(13,item)">出库</span>
                <span class="opr hoverBlue"
                  @click="goStock(7,item)">移库</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="storeTotal"
            :current-page.sync="storePage">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">出入库日志</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="storeLogFilter.code"
              placeholder="请输入单号搜索"
              @change="logPage=1;$forceUpdate()"></el-input>
          </div>
          <div class="elCtn">
            <el-select v-model="storeLogFilter.action_type"
              placeholder="筛选出入库类型"
              @change="logPage=1;$forceUpdate()"
              clearable>
              <el-option v-for="item in stockTypeList"
                :key="item.value"
                :value="item.value"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-cascader v-model="storeLogFilter.client_arr"
              placeholder="请选择单位信息"
              :options="yarnClientAllList"
              filterable
              clearable
              @change="logPage=1;$forceUpdate()">
            </el-cascader>
          </div>
          <div class="elCtn">
            <el-input v-model="storeLogFilter.material_name"
              placeholder="请输入物料名称搜索"
              @change="logPage=1;$forceUpdate()"></el-input>
          </div>
        </div>
        <div class="filterCtn">
          <div class="elCtn"
            style="width:184px">
            <el-input placeholder="批号"
              v-model="storeLogFilter.batch_code"
              @change="logPage=1;$forceUpdate()"></el-input>
          </div>
          <div class="elCtn"
            style="width:184px">
            <el-input placeholder="缸号"
              v-model="storeLogFilter.vat_code"
              @change="logPage=1;$forceUpdate()"></el-input>
          </div>
          <div class="elCtn"
            style="width:184px">
            <el-input placeholder="色号"
              v-model="storeLogFilter.color_code"
              @change="logPage=1;$forceUpdate()"></el-input>
          </div>
        </div>
        <div class="tableCtn noPad">
          <div class="thead">
            <div class="trow">
              <div class="tcol">单据编号</div>
              <div class="tcol">出入库类型</div>
              <div class="tcol">库存转移</div>
              <div class="tcol noPad"
                style="flex:4">
                <div class="trow">
                  <div class="tcol">物料名称</div>
                  <div class="tcol">颜色/属性</div>
                  <div class="tcol">批号/缸号/色号</div>
                  <div class="tcol">数量</div>
                </div>
              </div>
              <div class="tcol">关联单据</div>
              <div class="tcol">日期</div>
              <div class="tcol">操作</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in storeLogList"
              :key="item.id">
              <div class="tcol">{{item.code}}</div>
              <div class="tcol"
                :class="item.action_type|materialStockTypeClassFilter">{{item.action_type|materialStockTypeFilter}}</div>
              <div class="tcol">
                <template v-if="item.action_type===1">
                  <div class="changeCtn">
                    <span>{{item.client_name}}</span>
                    <span class="el-icon-s-unfold green"></span>
                    <span>{{item.store}}/{{item.secondary_store}}</span>
                  </div>
                </template>
                <template v-else-if="item.action_type===2 || item.action_type===4">
                  <div class="changeCtn">
                    <span>{{item.client_name}}</span>
                    <span class="el-icon-s-unfold green"></span>
                    <span>{{item.store}}/{{item.secondary_store}}</span>
                  </div>
                </template>
                <template v-else-if="item.action_type===3 || item.action_type===5 || item.action_type===10 || item.action_type===13">
                  <div class="changeCtn">
                    <span>{{item.store}}/{{item.secondary_store}}</span>
                    <span class="el-icon-s-unfold orange"></span>
                    <span>{{item.client_name}}</span>
                  </div>
                </template>
                <template v-else-if="item.action_type===6 || item.action_type===9 || item.action_type===10 || item.action_type===11 || item.action_type===12">
                  <div class="changeCtn">
                    <span>{{item.store}}/{{item.secondary_store}}</span>
                  </div>
                </template>
                <template v-else-if="item.action_type===7">
                  <div class="changeCtn">
                    <span>{{item.store}}/{{item.secondary_store}}</span>
                    <span class="el-icon-s-unfold orange"></span>
                    <span>{{item.move_store}}/{{item.move_secondary_store}}</span>
                  </div>
                </template>
                <template v-else-if="item.action_type===8">
                  <div class="changeCtn">
                    <span>{{item.store}}/{{item.secondary_store}}</span>
                    <span class="el-icon-s-unfold green"></span>
                    <span>{{item.move_store}}/{{item.move_secondary_store}}</span>
                  </div>
                </template>
              </div>
              <div class="tcol noPad"
                style="flex:4">
                <div class="trow"
                  v-for="itemChild in item.info_data"
                  :key="itemChild.id">
                  <div class="tcol">{{itemChild.material_name}}</div>
                  <div class="tcol">{{itemChild.material_color}}/{{itemChild.attribute ||'无属性'}}</div>
                  <div class="tcol"
                    :class="itemChild.batch_code||itemChild.vat_code?'':'gray'">{{itemChild.batch_code||'无'}}/{{itemChild.vat_code||'无'}}/{{itemChild.color_code||'无'}}</div>
                  <div class="tcol">{{itemChild.number}}kg</div>
                </div>
              </div>
              <div class="tcol">
                {{item.rel_doc_info.code || '无'}}
              </div>
              <div class="tcol">{{item.complete_time}}</div>
              <div class="tcol oprCtn">
                <span class="opr hoverRed"
                  @click="deleteStoreLog(item.id)">删除</span>
                <span class="opr hoverBlue"
                  @click="$openUrl('/store/materialLogPrint?id='+item.id + '&type=' + item.action_type)">打印</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="logTotal"
            :current-page.sync="logPage">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="materialStockFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">库存操作</span>
          <div class="closeCtn"
            @click="materialStockFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">选择二级仓库</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="materialStockInfo.secondary_store_id"
                    placeholder="请选择二级仓库">
                    <el-option v-for="item in storeDetail.secondary_store"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">出入库类型</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="materialStockInfo.action_type"
                    placeholder="默认"
                    disabled>
                    <el-option v-for="item in stockTypeList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col"
                v-if="materialStockInfo.action_type===7">
                <div class="label">
                  <span class="text">移库仓库</span>
                </div>
                <div class="info elCtn">
                  <el-cascader :options="storeArr"
                    placeholder="请选择移库仓库"
                    v-model="materialStockInfo.move_store_arr"
                    @change="(ev)=>{materialStockInfo.move_store_id=ev[0];materialStockInfo.move_secondary_store_id=ev[1]}"></el-cascader>
                </div>
              </div>
              <div class="col"
                v-if="materialStockInfo.action_type!==7">
                <div class="label">
                  <span class="text">{{materialStockInfo.action_type===9?'来源单位':'出库单位'}}</span>
                </div>
                <div class="info elCtn">
                  <el-cascader v-if="materialStockInfo.action_type===9"
                    v-model="materialStockInfo.tree_data"
                    placeholder="请选择单位信息"
                    :options="yarnClientInList"
                    filterable
                    clearable>
                  </el-cascader>
                  <el-cascader v-if="materialStockInfo.action_type===10"
                    v-model="materialStockInfo.tree_data"
                    placeholder="请选择单位信息"
                    :options="yarnClientOutList"
                    filterable
                    clearable>
                  </el-cascader>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in materialStockInfo.info_data"
              :key="index">
              <div class="col">
                <div class="spaceBetween">
                  <div class="once"
                    style="flex:2">
                    <div class="label"
                      v-if="index===0">
                      <span class="text">物料名称</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="info elCtn">
                      <el-cascader v-if="materialStockInfo.material_type===1||materialStockInfo.material_type===2"
                        placeholder="物料名称"
                        :show-all-levels="false"
                        v-model="item.tree_data"
                        :options="yarnTypeList"
                        filterable
                        @change="(ev)=>{item.material_id=ev[2]}"
                        clearable>
                      </el-cascader>
                      <el-select v-model="item.material_id"
                        placeholder="请选择辅料"
                        filterable
                        v-if="materialStockInfo.material_type===4"
                        @change="getUnit($event,item)">
                        <el-option v-for="item in decorateMaterialList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="once"
                    v-if="materialStockInfo.material_type===1">
                    <div class="label"
                      v-if="index===0">
                      <span class="text">属性</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="info elCtn">
                      <el-select placeholder="属性"
                        v-model="item.attribute">
                        <el-option v-for="item in yarnAttributeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="once">
                    <div class="label"
                      v-if="index===0">
                      <span class="text">颜色</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="info elCtn">
                      <el-autocomplete class="inline-input"
                        v-model="item.material_color"
                        :fetch-suggestions="searchColor"
                        placeholder="颜色"></el-autocomplete>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="spaceBetween">
                  <div class="once">
                    <div class="label"
                      v-if="index===0">
                      <span class="text">批号</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="批号"
                        v-model="item.batch_code"></el-input>
                    </div>
                  </div>
                  <div class="once">
                    <div class="label"
                      v-if="index===0">
                      <span class="text">缸号</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="缸号"
                        v-model="item.vat_code"></el-input>
                    </div>
                  </div>
                  <div class="once">
                    <div class="label"
                      v-if="index===0">
                      <span class="text">色号</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="色号"
                        v-model="item.color_code"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="spaceBetween">
                  <div class="once">
                    <div class="label"
                      v-if="index===0">
                      <span class="text">数量</span>
                      <span class="explanation">(必填)</span>
                    </div>
                    <div class="info elCtn UnitCtn">
                      <el-input placeholder="数量"
                        v-model="item.number">
                        <template slot="append">
                          <el-input v-model="item.unit"
                            placeholder="单位"></el-input>
                        </template>
                      </el-input>
                    </div>
                  </div>
                  <div class="once">
                    <div class="label"
                      v-if="index===0">
                      <span class="text">件数</span>
                    </div>
                    <div class="info elCtn">
                      <el-input placeholder="数量"
                        v-model="item.item">
                        <template slot="append">件</template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="opr hoverBlue"
                v-if="index===0"
                @click="$addItem(materialStockInfo.info_data,{
                  material_id: '',
                  material_color: '',
                  color_code: '',
                  batch_code: '',
                  vat_code: '',
                  attribute: '',
                  number: '',
                  unit:'kg',
                  item: '', // 件数
                  rel_doc_info_id: '' // 采购单调取单加工单子项id
                })">添加</div>
              <div class="opr hoverRed"
                v-if="index>0"
                @click="$deleteItem(materialStockInfo.info_data,index)">删除</div>
            </div>
            <div class="row">
              <div class="col"
                style="max-width:322px">
                <div class="label">
                  <span class="text">操作日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    class="once"
                    placeholder="操作日期"
                    value-format="yyyy-MM-dd"
                    v-model="materialStockInfo.complete_time"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="materialStockInfo.desc"
                    placeholder="备注信息"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="materialStockFlag = false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveStock">确认</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="materialLogExcelFlag">
      <div class="main"
        style="width:500px">
        <div class="titleCtn">
          <span class="text">导出EXCEL筛选条件</span>
          <div class="closeCtn"
            @click="materialLogExcelFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="explainCtn"
            style="margin:12px 0">未选项默认为导出所有。</div>
          <div class="row">
            <div class="label"
              style="line-height:32px">选择日期：</div>
            <div class="elCtn info">
              <el-date-picker v-model="materialLogExcelDate"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </div>
          <div class="row">
            <div class="label"
              style="line-height:32px">操作类型：</div>
            <div class="elCtn info">
              <el-select v-model="materialLogExcel.action_type"
                clearable>
                <el-option v-for="item in stockTypeList"
                  :key="item.name"
                  :value="item.value"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label"
              style="line-height:32px">选择物料：</div>
            <div class="elCtn info">
              <el-cascader placeholder="请选择要导出的库存物料"
                :show-all-levels="false"
                v-model="materialLogExcel.material_arr"
                :options="yarnTypeList"
                @change="(ev)=>{materialLogExcel.material_id=ev[2]}"
                clearable>
              </el-cascader>
            </div>
          </div>
          <div class="row">
            <div class="label"
              style="line-height:32px">选择单位：</div>
            <div class="elCtn info">
              <el-cascader placeholder="请选择要导出的单位"
                :show-all-levels="false"
                v-model="materialLogExcel.client_arr"
                :options="clientTypeList"
                @change="(ev)=>{materialLogExcel.client_id=ev[2]}"
                clearable>
              </el-cascader>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="materialLogExcelFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="exportMaterialLogExcel">确认导出</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="materialTotalExcelFlag">
      <div class="main"
        style="width:500px">
        <div class="titleCtn">
          <span class="text">导出EXCEL筛选条件</span>
          <div class="closeCtn"
            @click="materialTotalExcelFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="explainCtn"
            style="margin:12px 0">未选项默认为导出所有。</div>
          <div class="row">
            <div class="label"
              style="line-height:32px">选择物料：</div>
            <div class="elCtn info">
              <el-cascader placeholder="请选择要导出的库存物料"
                :show-all-levels="false"
                v-model="materialTotalExcel.material_arr"
                :options="yarnTypeList"
                @change="(ev)=>{materialTotalExcel.material_id=ev[2]}"
                clearable>
              </el-cascader>
            </div>
          </div>
          <!-- <div class="row">
            <div class="label"
              style="line-height:32px">排序规则：</div>
            <div class="elCtn info"
              style="line-height:32px">
              <el-radio v-model="radio"
                label="1">从多到少</el-radio>
              <el-radio v-model="radio"
                label="2">从少到多</el-radio>
            </div>
          </div> -->
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="materialTotalExcelFlag=false">取消</span>
          <span class="btn backHoverBlue"
            @click="exportMaterialTotalExcel">确认导出</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <span class="btn backHoverGreen"
            @click="materialTotalExcelFlag = true">导出库存数量EXCEL</span>
          <span class="btn backHoverGreen"
            @click="materialLogExcelFlag = true">导出库存日志EXCEL</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { store, materialStock, exportExcel } from '@/assets/js/api'
import { yarnAttributeArr } from '@/assets/js/dictionary'
import { StoreDetail } from '@/types/store'
import { MaterialStockInfo, MaterialStockLog } from '@/types/materialStock'
import { stockType } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    materialStockInfo: MaterialStockInfo
    storeDetail: StoreDetail
    [propName: string]: any
  } {
    return {
      testValue: [],
      loading: true,
      stockTypeList: stockType,
      storeDetail: {
        name: '',
        type: 1,
        client_id: '',
        manager_id: '',
        manager_name: '',
        tree_data: [],
        desc: '',
        store_type: 1,
        secondary_store: [],
        store_log: [],
        store_total: []
      },
      materialStockFlag: false,
      materialStockInfo: {
        material_type: 1,
        action_type: 9,
        rel_doc_type: '',
        rel_doc_id: '',
        rel_doc_code: '',
        complete_time: this.$getDate(new Date()),
        client_id: '',
        tree_data: [],
        desc: '',
        store_arr: [],
        store_id: '',
        secondary_store_id: '',
        move_store_id: '',
        move_secondary_store_id: '',
        move_store_arr: [],
        info_data: [
          {
            tree_data: [],
            material_id: '',
            material_color: '',
            color_code: '',
            batch_code: '',
            vat_code: '',
            attribute: '',
            number: '',
            item: '', // 件数
            unit: 'kg',
            rel_doc_info_id: '' // 采购单调取单加工单子项id
          }
        ],
        selectList: []
      },
      yarnAttributeList: yarnAttributeArr,
      storePage: 1,
      logPage: 1,
      defaultSecondaryId: 0,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      materialLogExcelFlag: false,
      materialLogExcelDate: [],
      materialLogExcel: {
        store_id: '',
        material_type: '',
        material_name: '',
        client_id: '',
        start_time: '',
        end_time: '',
        action_type: '',
        client_arr: [],
        material_arr: []
      },
      materialTotalExcelFlag: false,
      materialTotalExcel: {
        store_id: '',
        material_type: '',
        material_name: '',
        material_arr: []
      },
      storeArr: [],
      storeLogFilter: {
        code: '',
        action_type: '',
        client_arr: '',
        material_name: '',
        vat_code: '',
        color_code: '',
        batch_code: '',
        start_time: '',
        end_time: ''
      },
      storeTotalFilter: {
        material_name: '',
        vat_code: '',
        color_code: '',
        batch_code: ''
      }
    }
  },
  computed: {
    decorateMaterialList(): any[] {
      return this.$store.state.api.decorateMaterial.arr
    },
    storeTotalList(): any[] {
      return this.storeDetail.store_total
        .filter((item: any) => {
          if (this.storeTotalFilter.material_name) {
            return item.material_name.toLowerCase().indexOf(this.storeTotalFilter.material_name.toLowerCase()) !== -1
          } else {
            return true
          }
        })
        .filter((item: any) => {
          if (this.storeTotalFilter.vat_code) {
            return item.vat_code.toLowerCase().indexOf(this.storeTotalFilter.vat_code.toLowerCase()) !== -1
          } else {
            return true
          }
        })
        .filter((item: any) => {
          if (this.storeTotalFilter.color_code) {
            return item.color_code.toLowerCase().indexOf(this.storeTotalFilter.color_code.toLowerCase()) !== -1
          } else {
            return true
          }
        })
        .filter((item: any) => {
          if (this.storeTotalFilter.batch_code) {
            return item.batch_code.toLowerCase().indexOf(this.storeTotalFilter.batch_code.toLowerCase()) !== -1
          } else {
            return true
          }
        })
        .slice((this.storePage - 1) * 5, this.storePage * 5)
    },
    storeTotal(): number {
      return this.storeDetail.store_total
        .filter((item: any) => {
          if (this.storeTotalFilter.material_name) {
            return item.material_name.toLowerCase().indexOf(this.storeTotalFilter.material_name.toLowerCase()) !== -1
          } else {
            return true
          }
        })
        .filter((item: any) => {
          if (this.storeTotalFilter.vat_code) {
            return item.vat_code.toLowerCase().indexOf(this.storeTotalFilter.vat_code.toLowerCase()) !== -1
          } else {
            return true
          }
        })
        .filter((item: any) => {
          if (this.storeTotalFilter.color_code) {
            return item.color_code.toLowerCase().indexOf(this.storeTotalFilter.color_code.toLowerCase()) !== -1
          } else {
            return true
          }
        })
        .filter((item: any) => {
          if (this.storeTotalFilter.batch_code) {
            return item.batch_code.toLowerCase().indexOf(this.storeTotalFilter.batch_code.toLowerCase()) !== -1
          } else {
            return true
          }
        }).length
    },
    storeLogList(): MaterialStockInfo[] {
      return this.storeDetail.store_log
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.code) {
            return (item.code as string).toLowerCase().indexOf(this.storeLogFilter.code.toLowerCase()) !== -1
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.action_type) {
            return item.action_type === this.storeLogFilter.action_type
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.client_arr.length > 0) {
            return item.client_id === this.storeLogFilter.client_arr[2]
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.material_name) {
            return item.info_data.some((itemChild) => {
              return (
                (itemChild.material_name as string)
                  .toLowerCase()
                  .indexOf(this.storeLogFilter.material_name.toLowerCase()) !== -1
              )
            })
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.batch_code) {
            return item.info_data.some((itemChild) => {
              return (
                (itemChild.batch_code as string).toLowerCase().indexOf(this.storeLogFilter.batch_code.toLowerCase()) !==
                -1
              )
            })
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.vat_code) {
            return item.info_data.some((itemChild) => {
              return (
                (itemChild.vat_code as string).toLowerCase().indexOf(this.storeLogFilter.vat_code.toLowerCase()) !== -1
              )
            })
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.color_code) {
            return item.info_data.some((itemChild) => {
              return (
                (itemChild.color_code as string).toLowerCase().indexOf(this.storeLogFilter.color_code.toLowerCase()) !==
                -1
              )
            })
          } else {
            return true
          }
        })
        .slice((this.logPage - 1) * 5, this.logPage * 5)
    },
    logTotal(): number {
      return this.storeDetail.store_log
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.code) {
            return (item.code as string).toLowerCase().indexOf(this.storeLogFilter.code.toLowerCase()) !== -1
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.action_type) {
            return item.action_type === this.storeLogFilter.action_type
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.client_arr.length > 0) {
            return item.client_id === this.storeLogFilter.client_arr[2]
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.material_name) {
            return item.info_data.some((itemChild) => {
              return (
                (itemChild.material_name as string)
                  .toLowerCase()
                  .indexOf(this.storeLogFilter.material_name.toLowerCase()) !== -1
              )
            })
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.batch_code) {
            return item.info_data.some((itemChild) => {
              return (
                (itemChild.batch_code as string).toLowerCase().indexOf(this.storeLogFilter.batch_code.toLowerCase()) !==
                -1
              )
            })
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.vat_code) {
            return item.info_data.some((itemChild) => {
              return (
                (itemChild.vat_code as string).toLowerCase().indexOf(this.storeLogFilter.vat_code.toLowerCase()) !== -1
              )
            })
          } else {
            return true
          }
        })
        .filter((item: MaterialStockInfo) => {
          if (this.storeLogFilter.color_code) {
            return item.info_data.some((itemChild) => {
              return (
                (itemChild.color_code as string).toLowerCase().indexOf(this.storeLogFilter.color_code.toLowerCase()) !==
                -1
              )
            })
          } else {
            return true
          }
        }).length
    },
    yarnTypeList() {
      if (this.storeDetail.store_type === 1) {
        return this.$store.state.api.yarnType.arr.filter((item: any) => item.value === 1)
      } else if (this.storeDetail.store_type === 2) {
        return this.$store.state.api.yarnType.arr.filter((item: any) => item.value === 2)
      } else if (this.storeDetail.store_type === 3) {
        return this.$store.state.api.yarnType.arr.filter((item: any) => item.value === 3)
      } else {
        return []
      }
    },
    yarnColorList() {
      return this.$store.state.api.yarnColor.arr.map((item: { name: any }) => {
        return {
          value: item.name,
          label: item.name
        }
      })
    },
    clientTypeList() {
      return this.$store.state.api.clientType.arr
    },
    yarnClientInList() {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '纱线原料单位')
    },
    yarnClientOutList() {
      return this.$store.state.api.clientType.arr.filter(
        (item: { label: string }) =>
          item.label === '原料加工单位' || item.label === '生产织造单位' || item.label === '生产加工单位'
      )
    },
    yarnClientAllList() {
      return this.$store.state.api.clientType.arr.filter(
        (item: { label: string }) =>
          item.label === '纱线原料单位' ||
          item.label === '原料加工单位' ||
          item.label === '生产织造单位' ||
          item.label === '生产加工单位'
      )
    }
  },
  methods: {
    init() {
      this.loading = true
      store
        .detail({
          id: Number(this.$route.query.id)
        })
        .then((res) => {
          if (res.data.status) {
            this.storeDetail = res.data.data
            this.storeDetail.secondary_store.forEach((item) => {
              if (item.is_default === 1) {
                this.defaultSecondaryId = item.id
              }
            })
          }
          this.loading = false
        })
    },
    getUnit(ev: number, info: MaterialStockLog) {
      info.unit = this.decorateMaterialList.find((item) => item.id === ev).unit
    },
    // 原料颜色搜索
    searchColor(str: string, cb: any) {
      let results = str ? this.yarnColorList.filter(this.createFilter(str)) : this.yarnColorList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    goStock(type: 9 | 13, info?: MaterialStockLog) {
      this.materialStockInfo.secondary_store_id = this.defaultSecondaryId || ''
      this.materialStockInfo.action_type = type
      if (info) {
        this.materialStockInfo.info_data = [
          {
            tree_data: this.findMaterial(info.material_id as number),
            material_id: info.material_id,
            material_color: info.material_color,
            color_code: info.color_code,
            batch_code: info.batch_code,
            vat_code: info.vat_code,
            attribute: info.attribute,
            number: '',
            item: '',
            rel_doc_info_id: '',
            unit: info.unit || 'kg'
          }
        ]
      } else {
        this.materialStockInfo.info_data = this.storeTotalList
          .filter((item) => item.check)
          .map((item) => {
            return {
              tree_data: this.findMaterial(item.material_id),
              material_id: item.material_id,
              material_color: item.material_color,
              color_code: item.color_code,
              batch_code: item.batch_code,
              vat_code: item.vat_code,
              attribute: item.attribute,
              number: '',
              item: '',
              rel_doc_info_id: '',
              unit: item.unit || 'kg'
            }
          })
      }

      // 如果没有勾选物料,给默认选项
      if (this.materialStockInfo.info_data.length === 0) {
        this.materialStockInfo.info_data = [
          {
            tree_data: [],
            material_id: '',
            material_color: '',
            color_code: '',
            batch_code: '',
            vat_code: '',
            attribute: '',
            number: '',
            item: '',
            rel_doc_info_id: '',
            unit: 'kg'
          }
        ]
      }

      this.materialStockFlag = true
    },
    // 把material_id转成tree_data
    findMaterial(id: number): any[] {
      console.log(this.yarnTypeList, id)
      let treeData: any[] = []
      this.yarnTypeList.forEach((item: any) => {
        item.children.forEach((itemSecond: any) => {
          itemSecond.children.find((itemThird: any) => {
            if (itemThird.value === id) {
              treeData = [item.value, itemSecond.value, itemThird.value]
            }
          })
        })
      })
      return treeData
    },
    getCmpData() {
      this.materialStockInfo.client_id =
        this.materialStockInfo.tree_data!.length > 0 ? this.materialStockInfo.tree_data![2] : ''
      this.materialStockInfo.material_type = Number(this.$route.query.store_type)
      this.materialStockInfo.store_id = Number(this.$route.query.id)
      this.materialStockInfo.info_data.forEach((item) => {
        item.batch_code = item.batch_code || '无'
        item.vat_code = item.vat_code || '无'
        item.color_code = item.color_code || '无'
      })
    },
    saveStock() {
      const formCheck =
        this.$formCheck(this.materialStockInfo, [
          {
            key: 'secondary_store_id',
            errMsg: '请选择二级仓库'
          }
        ]) ||
        this.materialStockInfo.info_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'material_id',
              errMsg: '请选择物料名称'
            },
            // {
            //   key: 'attribute',
            //   errMsg: '请选择物料属性'
            // },
            {
              key: 'material_color',
              errMsg: '请选择物料颜色'
            },
            {
              key: 'number',
              errMsg: '请输入数量'
            }
          ])
        })
      if (!formCheck) {
        this.getCmpData()
        materialStock.create({ data: [this.materialStockInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.materialStockFlag = false
            this.init()
          }
        })
      }
    },
    deleteStoreLog(id: number) {
      this.$confirm('是否删除该日志', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialStock.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.init()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    exportMaterialLogExcel() {
      this.materialLogExcel.start_time = this.materialLogExcelDate.length > 0 ? this.materialLogExcelDate[0] : ''
      this.materialLogExcel.end_time = this.materialLogExcelDate.length > 0 ? this.materialLogExcelDate[1] : ''
      this.materialLogExcel.store_id = this.$route.query.id
      this.materialLogExcel.material_type = this.$route.query.store_type
      this.loading = true
      exportExcel.materialLog(this.materialLogExcel).then((res) => {
        if (res.data.status) {
          this.$message.success('导出成功')
          this.materialLogExcelFlag = false
          this.$openUrl(res.data.data)
        }
        this.loading = false
      })
    },
    exportMaterialTotalExcel() {
      this.materialLogExcel.store_id = this.$route.query.id
      this.materialLogExcel.material_type = this.$route.query.store_type
      this.loading = true
      exportExcel.materialTotal(this.materialTotalExcel).then((res) => {
        if (res.data.status) {
          this.$message.success('导出成功')
          this.materialTotalExcelFlag = false
          this.$openUrl(res.data.data)
        }
        this.loading = false
      })
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      },
      {
        checkWhich: 'api/yarnColor',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnColorAsync'
      },
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/decorateMaterial',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getDecorateMaterialAsync'
      }
    ])
    this.materialStockInfo.material_type = Number(this.$route.query.store_type)
    store
      .list({
        store_type: this.store_type
      })
      .then((res) => {
        if (res.data.status) {
          // 移库仓库
          this.storeArr = res.data.data
            .filter((item: any) => item.id !== Number(this.$route.query.id))
            .map((item: any) => {
              return {
                label: item.name,
                value: item.id,
                children: item.secondary_store.map((itemChild: any) => {
                  return {
                    label: itemChild.name,
                    value: itemChild.id
                  }
                })
              }
            })
        }
      })
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/store/materialDetail.less';
</style>
<style lang="less">
#storeDetail {
  .UnitCtn {
    .el-input-group__append {
      padding: 0;
      .el-input {
        width: 45px;
        .el-input__inner {
          padding: 0 8px;
          border: 0;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
}
</style>