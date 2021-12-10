<template>
  <div id="storeList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        :class="{'active':store_type===1}"
        @click="store_type=1;changeRouter">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-shaxianyuanliaocangku'></use>
        </svg>
        <span class="text">纱线原料仓库</span>
      </div>
      <div class="tag"
        :class="{'active':store_type===2}"
        @click="store_type=2;changeRouter">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-mianliaoyuanliaocangku'></use>
        </svg>
        <span class="text">面料原料仓库</span>
      </div>
      <!-- <div class="tag"
        :class="{'active':store_type===3}"
        @click="store_type=3;changeRouter">
        <i class="icon">图标</i>
        <span class="text">毛料原料仓库</span>
      </div> -->
      <div class="tag"
        :class="{'active':store_type===4}"
        @click="store_type=4;changeRouter">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-zhuangshifuliaocangku'></use>
        </svg>
        <span class="text">装饰辅料仓库</span>
      </div>
      <div class="tag"
        :class="{'active':store_type===5}"
        @click="store_type=5;changeRouter">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-chanpincangku'></use>
        </svg>
        <span class="text">产品仓库</span>
      </div>
      <div class="tag"
        :class="{'active':store_type===6}"
        @click="store_type=6;changeRouter">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href='#icon-baozhuangfuliaocangku'></use>
        </svg>
        <span class="text">包装辅料仓库</span>
      </div>
    </div>
    <div class="module">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-cascader :options="storeArr"
              clearable
              placeholder="请选择仓库"
              v-model="store_arr"
              @change="(ev)=>{store_id=ev[0];secondary_id=ev[1];changeRouter()}"></el-cascader>
          </div>
          <div class="elCtn">
            <el-autocomplete class="inline-input"
              v-model="material_name"
              :fetch-suggestions="searchMaterial"
              placeholder="物料名称"
              @keydown.enter.native="changeRouter"
              @change="changeRouter"></el-autocomplete>
          </div>
          <div class="elCtn">
            <el-autocomplete class="inline-input"
              v-model="material_color"
              :fetch-suggestions="searchColor"
              placeholder="物料颜色"
              @keydown.enter.native="changeRouter"></el-autocomplete>
          </div>
          <div class="elCtn">
            <el-select clearable
              v-model="attribute"
              placeholder="请选择属性"
              @change="changeRouter">
              <el-option v-for="item in yarnAttributeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
        </div>
        <div class="filterCtn">
          <div class="elCtn"
            style="width:184px">
            <el-input placeholder="批号"
              v-model="batch_code"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn"
            style="width:184px">
            <el-input placeholder="缸号"
              v-model="vat_code"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="elCtn"
            style="width:184px">
            <el-input placeholder="色号"
              v-model="color_code"
              @keydown.enter.native="changeRouter"></el-input>
          </div>
          <div class="btn backHoverGreen fr"
            @click="goStock(9)">物料入库</div>
          <div class="btn backHoverOrange fr"
            @click="goStock(10)">物料出库</div>
          <div class="btn backHoverBlue fr"
            @click="goStock(7)">物料移库</div>
          <div class="btn backHoverBlue fr"
            @click="$router.push('/store/create?store_type='+store_type)">添加仓库</div>
          <div class="btn backHoverGreen fr"
            @click="getStoreList();lookListFlag=true">仓库列表</div>
        </div>
        <div class="list"
          v-loading="loading">
          <div class="row title">
            <div class="col">仓库名称</div>
            <div class="col">物料名称</div>
            <div class="col">物料颜色</div>
            <div class="col"
              v-if="$route.query.store_type==='1'">物料属性</div>
            <div class="col">批号/缸号/色号</div>
            <div class="col">库存数量</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id"
            @click="item.check=!item.check;$forceUpdate()">
            <div class="col">
              <el-checkbox v-model="item.check"
                disabled>{{item.store}}/{{item.secondary_store}}</el-checkbox>
            </div>
            <div class="col">{{item.material_name}}</div>
            <div class="col">{{item.material_color}}</div>
            <div class="col"
              v-if="$route.query.store_type==='1'">{{item.attribute}}</div>
            <div class="col">{{item.batch_code}}/{{item.vat_code}}/{{item.color_code}}</div>
            <div class="col">{{item.number}}kg</div>
            <div class="col">
              <div class="oprCtn">
                <span class="opr hoverGreen"
                  @click.stop="goStock(9,item)">入库</span>
                <span class="opr hoverOrange"
                  @click.stop="goStock(10,item)">出库</span>
                <span class="opr hoverBlue"
                  @click.stop="goStock(7,item)">移库</span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">合计：</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"
              v-if="$route.query.store_type==='1'"></div>
            <div class="col"></div>
            <div class="col green">{{totalNumber}}kg</div>
            <div class="col"></div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 仓库列表 -->
    <div class="popup"
      v-show="lookListFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">仓库列表</span>
          <div class="closeCtn"
            @click="lookListFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="listCtn">
          <div class="list"
            v-loading="storeLoading">
            <div class="row title">
              <div class="col">仓库名称</div>
              <div class="col">仓库类型</div>
              <div class="col">关联单位</div>
              <div class="col">当前库存总数量</div>
              <div class="col">仓库备注</div>
              <div class="col">操作</div>
            </div>
            <div class="row"
              v-for="item in storeList"
              :key="item.id">
              <div class="col">{{item.name}}</div>
              <div class="col">{{item.type===1?'本厂仓库':item.type===2?'加工厂仓库':'供货商仓库'}}</div>
              <div class="col">{{item.client_name || '无'}}</div>
              <div class="col">{{item.total_number}}</div>
              <div class="col">{{item.desc}}</div>
              <div class="col">
                <div class="opr hoverBlue"
                  @click="store_type!==5?$router.push('/store/materialDetail?id='+item.id+'&store_type='+store_type):$router.push('/store/productDetail?id='+item.id +'&store_type='+store_type)">详情</div>
                <div class="opr hoverRed"
                  @click="deleteStore(item.id)">删除</div>
              </div>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next"
              :total="storeTotal"
              :current-page.sync="storePage"
              @current-change="getStoreList">
            </el-pagination>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="lookListFlag=false">关闭</span>
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
          <div class="editCtn"
            v-for="(itemStock,indexStock) in materialStockInfo"
            :key="indexStock">
            <div class="deleteIcon"
              @click="materialStockInfo.length>1?$deleteItem(materialStockInfo,index):$message.error('至少有一项库存')">
              <i class="el-icon-close"></i>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">选择仓库</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-cascader :options="storeArr"
                    placeholder="请选择仓库"
                    v-model="itemStock.store_arr"
                    @change="(ev)=>{itemStock.store_id=ev[0];itemStock.secondary_store_id=ev[1];}"></el-cascader>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">出入库类型</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="itemStock.action_type"
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
                v-if="itemStock.action_type===7">
                <div class="label">
                  <span class="text">移库仓库</span>
                </div>
                <div class="info elCtn">
                  <el-cascader :options="storeArr"
                    placeholder="请选择移库仓库"
                    v-model="itemStock.move_store_arr"
                    @change="(ev)=>{itemStock.move_store_id=ev[0];itemStock.move_secondary_store_id=ev[1]}"></el-cascader>
                </div>
              </div>
              <div class="col"
                v-if="itemStock.action_type!==7">
                <div class="label">
                  <span class="text">{{itemStock.action_type===9?'来源单位':'出库单位'}}</span>
                </div>
                <div class="info elCtn">
                  <el-cascader v-if="itemStock.action_type===9"
                    v-model="itemStock.tree_data"
                    placeholder="请选择单位信息"
                    :options="yarnClientInList"
                    filterable
                    clearable>
                  </el-cascader>
                  <el-cascader v-if="itemStock.action_type===10"
                    v-model="itemStock.tree_data"
                    placeholder="请选择单位信息"
                    :options="yarnClientOutList"
                    filterable
                    clearable>
                  </el-cascader>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in itemStock.info_data"
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
                      <el-cascader v-if="Number($route.query.store_type)===1||Number($route.query.store_type)===2"
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
                        v-if="Number($route.query.store_type)===4"
                        @change="getUnit($event,item)">
                        <el-option v-for="item in decorateMaterialList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="once"
                    v-if="Number($route.query.store_type)===1">
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
                @click="$addItem(itemStock.info_data,{
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
                @click="$deleteItem(itemStock.info_data,index)">删除</div>
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
                    v-model="itemStock.complete_time"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="itemStock.desc"
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
          <div class="row">
            <div class="label"
              style="line-height:32px">选择仓库：</div>
            <div class="elCtn info">
              <el-select v-model="materialLogExcel.store_id"
                placeholder="请选择仓库">
                <el-option v-for="item in storeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
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
          <div class="row">
            <div class="label"
              style="line-height:32px">选择仓库：</div>
            <div class="elCtn info">
              <el-select v-model="materialTotalExcel.store_id"
                placeholder="请选择仓库">
                <el-option v-for="item in storeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
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
import { storeType } from '@/assets/js/dictionary'
import { MaterialStockInfo } from '@/types/materialStock'
import { stockType, yarnAttributeArr } from '@/assets/js/dictionary'
interface StoreTotalInfo {
  check?: boolean
  number: number
  id: number
  batch_code: string
  vat_code: string
  color_code: string
  secondary_store_id: number
  store_id: number
  store: string
  secondary_store: string
  material_color: string
  material_id: number
  material_name: string
  attribute: string
  unit?: string
}
export default Vue.extend({
  data(): {
    materialStockInfo: MaterialStockInfo[]
    list: StoreTotalInfo[]
    [propName: string]: any
  } {
    return {
      storeLoading: true,
      loading: true,
      store_type: 1,
      store_id: '',
      secondary_id: '',
      store_arr: [],
      material_name: '',
      vat_code: '',
      batch_code: '',
      color_code: '',
      material_color: '',
      keyword: '',
      attribute: '',
      user_id: '',
      page: 1,
      total: 1,
      list: [],
      lookListFlag: false,
      storeTypeList: storeType,
      storeList: [],
      storePage: 1,
      storeTotal: 1,
      storeArr: [],
      yarnAttributeList: yarnAttributeArr,
      stockTypeList: stockType,
      materialStockFlag: false,
      materialStockInfo: [
        {
          material_type: 1,
          action_type: 9,
          rel_doc_type: '',
          rel_doc_id: '',
          rel_doc_code: '',
          complete_time: this.$getDate(new Date()),
          client_id: '',
          store_arr: [],
          tree_data: [],
          desc: '',
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
        }
      ],
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
      }
    }
  },
  filters: {},
  watch: {
    store_type(val) {
      this.changeRouter()
    },
    $route(val) {
      this.getFilters()
      this.getList()
      this.getStoreSelect()
    }
  },
  methods: {
    getStoreSelect() {
      store
        .list({
          store_type: this.store_type
        })
        .then((res) => {
          if (res.data.status) {
            this.storeArr = res.data.data.map((item: any) => {
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
    },
    // 原料颜色搜索
    searchColor(str: string, cb: any) {
      let results = str ? this.yarnColorList.filter(this.createFilter(str)) : this.yarnColorList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 原料名称搜索
    searchMaterial(str: string, cb: any) {
      store
        .getMatName({
          material_name: str,
          material_type: Number(this.$route.query.store_type)
        })
        .then((res) => {
          const data = res.data.data.map((item: any) => {
            return {
              value: item
            }
          })
          let results = str ? data.filter(this.createFilter(str)) : data.slice(0, 10)
          cb(results)
        })
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    changeRouter() {
      this.$router.push(
        '/store/list?page=' +
          this.page +
          '&keyword=' +
          this.keyword +
          '&store_type=' +
          this.store_type +
          '&store_id=' +
          this.store_id +
          '&secondary_id=' +
          this.secondary_id +
          '&material_name=' +
          this.material_name +
          '&material_color=' +
          this.material_color +
          '&attribute=' +
          this.attribute +
          '&vat_code=' +
          this.vat_code +
          '&color_code=' +
          this.color_code +
          '&batch_code=' +
          this.batch_code
      )
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.keyword = query.keyword || ''
      this.store_type = Number(query.store_type) || ''
      this.store_id = Number(query.store_id) || ''
      this.secondary_id = Number(query.secondary_id) || ''
      this.store_arr = Number(query.store_id) ? [Number(query.store_id), Number(query.secondary_id)] : []
      this.material_name = query.material_name || ''
      this.material_color = query.material_color || ''
      this.attribute = query.attribute || ''
      this.vat_code = query.vat_code || ''
      this.color_code = query.color_code || ''
      this.batch_code = query.batch_code || ''
    },
    reset() {
      this.$router.push(
        '/store/list?page=1&keyword=&store_type=&store_id=&secondary_id=&material_name=&material_color=&attribute=&vat_code=&color_code=&batch_code='
      )
    },
    getList() {
      this.loading = true
      store
        .searchMat({
          store_id: this.store_id,
          secondary_id: this.secondary_id,
          keyword: this.keyword,
          material_name: this.material_name,
          material_color: this.material_color,
          attribute: this.attribute,
          vat_code: this.vat_code,
          color_code: this.color_code,
          batch_code: this.batch_code,
          page: this.page,
          limit: 10,
          material_type: Number(this.$route.query.store_type)
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
          }
        })
    },
    goStock(type: 9 | 10, info?: StoreTotalInfo) {
      if (info) {
        this.materialStockInfo.length = 1
        this.materialStockInfo[0].store_arr = [info.store_id, info.secondary_store_id]
        this.materialStockInfo[0].store_id = info.store_id
        this.materialStockInfo[0].secondary_store_id = info.secondary_store_id
        this.materialStockInfo[0].info_data = [
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
        this.materialStockInfo = []
        this.list
          .filter((itemFilter) => itemFilter.check)
          .forEach((item) => {
            const finded = this.materialStockInfo.find(
              (itemFind) =>
                itemFind.store_id === item.store_id && itemFind.secondary_store_id === item.secondary_store_id
            )
            if (finded) {
              finded.info_data.push({
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
              })
            } else {
              this.materialStockInfo.push({
                material_type: Number(this.$route.query.store_type),
                action_type: type,
                rel_doc_type: '',
                rel_doc_id: '',
                rel_doc_code: '',
                complete_time: this.$getDate(new Date()),
                client_id: '',
                store_arr: [Number(item.store_id), Number(item.secondary_store_id)],
                tree_data: [],
                desc: '',
                store_id: item.store_id,
                secondary_store_id: item.secondary_store_id,
                move_store_id: '',
                move_secondary_store_id: '',
                move_store_arr: [],
                info_data: [
                  {
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
                ]
              })
            }
          })
      }
      if (this.materialStockInfo.length === 0) {
        this.materialStockInfo = [
          {
            material_type: Number(this.$route.query.store_type),
            action_type: type,
            rel_doc_type: '',
            rel_doc_id: '',
            rel_doc_code: '',
            complete_time: this.$getDate(new Date()),
            client_id: '',
            store_arr: [],
            tree_data: [],
            desc: '',
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
          }
        ]
      }
      this.materialStockInfo.forEach((item) => {
        item.action_type = type
      })
      this.materialStockFlag = true
      console.log(this.materialStockInfo)
    },
    // 把material_id转成tree_data
    findMaterial(id: number): any[] {
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
    getStoreList() {
      this.storeLoading = true
      store
        .list({
          store_type: this.store_type,
          page: 1,
          limit: 5
        })
        .then((res) => {
          if (res.data.status) {
            this.storeList = res.data.data.items
            this.storeTotal = res.data.data.total
          }
          this.storeLoading = false
        })
    },
    getCmpData() {
      this.materialStockInfo.forEach((itemStock) => {
        itemStock.material_type = Number(this.$route.query.store_type)
        itemStock.info_data.forEach((item) => {
          item.batch_code = item.batch_code || '无'
          item.vat_code = item.vat_code || '无'
          item.color_code = item.color_code || '无'
        })
      })
    },
    saveStock() {
      const formCheck = this.materialStockInfo.some((itemStock) => {
        return (
          this.$formCheck(itemStock, [
            {
              key: 'secondary_store_id',
              errMsg: '请选择二级仓库'
            }
          ]) ||
          itemStock.info_data.some((item) => {
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
        )
      })
      if (!formCheck) {
        this.getCmpData()
        materialStock.create({ data: this.materialStockInfo }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.materialStockFlag = false
            this.resetStockInfo()
            this.getList()
          }
        })
      }
    },
    exportMaterialLogExcel() {
      this.materialLogExcel.start_time = this.materialLogExcelDate.length > 0 ? this.materialLogExcelDate[0] : ''
      this.materialLogExcel.end_time = this.materialLogExcelDate.length > 0 ? this.materialLogExcelDate[1] : ''
      this.materialLogExcel.material_type = this.$route.query.store_type
      exportExcel.materialLog(this.materialLogExcel).then((res) => {
        if (res.data.status) {
          this.$message.success('导出成功')
          this.materialLogExcelFlag = false
          this.$openUrl(res.data.data)
        }
      })
    },
    exportMaterialTotalExcel() {
      this.materialTotalExcel.material_type = this.$route.query.store_type
      exportExcel.materialTotal(this.materialTotalExcel).then((res) => {
        if (res.data.status) {
          this.$message.success('导出成功')
          this.materialTotalExcelFlag = false
          this.$openUrl(res.data.data)
        }
      })
    },
    deleteStore(id: number) {
      this.$confirm('是否删除该仓库?已有库存的仓库无法删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          store.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getStoreList()
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
    resetStockInfo() {
      this.materialStockInfo = [
        {
          material_type: 1,
          action_type: 9,
          rel_doc_type: '',
          rel_doc_id: '',
          rel_doc_code: '',
          complete_time: this.$getDate(new Date()),
          client_id: '',
          store_arr: [],
          tree_data: [],
          desc: '',
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
        }
      ]
    }
  },
  computed: {
    totalNumber(): number {
      return this.list.reduce((total, cur) => {
        return total + cur.number
      }, 0)
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
    yarnTypeList() {
      if (this.store_type === 1) {
        return this.$store.state.api.yarnType.arr.filter((item: any) => item.value === 1)
      } else if (this.store_type === 2) {
        return this.$store.state.api.yarnType.arr.filter((item: any) => item.value === 2)
      } else if (this.store_type === 3) {
        return this.$store.state.api.yarnType.arr.filter((item: any) => item.value === 3)
      } else {
        return []
      }
    },
    decorateMaterialList(): any[] {
      return this.$store.state.api.decorateMaterial.arr
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
    }
  },
  created() {
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
    this.getFilters()
    this.getList()
    this.getStoreSelect()
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/store/list.less';
</style>
<style lang="less">
#storeList {
  .el-input-group__append {
    padding: 0 12px;
  }
  .UnitCtn {
    .el-input-group__append {
      padding: 0;
      .el-input {
        width: 38px;
        .el-input__inner {
          padding: 0 6px;
          border: 0;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
  // checkbox优化
  .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background: #fff;
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    cursor: pointer;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
  }
  input:disabled {
    cursor: pointer;
    color: -internal-light-dark(black, white);
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #409eff !important;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #fff;
  }
  // checkbox瞎几把改造到此为止
}
</style>