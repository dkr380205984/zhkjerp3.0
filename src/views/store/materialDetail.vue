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
        <div class="filterCtn clearfix">
          <div class="btn backHoverGreen fr"
            @click="goStock(9)">物料入库</div>
          <div class="btn backHoverOrange fr"
            @click="goStock(10)">物料出库</div>
          <div class="btn backHoverBlue fr"
            @click="goStock(7)">物料移库</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">纱线名称</div>
            <div class="col">纱线颜色</div>
            <div class="col">纱线属性</div>
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
            <div class="col">{{item.attribute}}</div>
            <div class="col">{{item.batch_code}}</div>
            <div class="col">{{item.vat_code}}</div>
            <div class="col">{{item.color_code}}</div>
            <div class="col">{{item.number}}kg</div>
            <div class="col">
              <div class="oprCtn">
                <span class="opr hoverGreen"
                  @click="goStock(9,item)">入库</span>
                <span class="opr hoverOrange"
                  @click="goStock(10,item)">出库</span>
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
        <div class="tableCtn noPad">
          <div class="thead">
            <div class="trow">
              <div class="tcol">单据编号</div>
              <div class="tcol">出入库类型</div>
              <div class="tcol">单位名称</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol">纱线名称</div>
                  <div class="tcol">颜色/属性</div>
                  <div class="tcol">批号/缸号</div>
                  <div class="tcol">色号</div>
                  <div class="tcol">数量</div>
                </div>
              </div>
              <div class="tcol">日期</div>
              <div class="tcol">备注信息</div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="item in storeLogList"
              :key="item.id">
              <div class="tcol">{{item.code}}</div>
              <div class="tcol"
                :class="item.action_type|materialStockTypeClassFilter">{{item.action_type|materialStockTypeFilter}}</div>
              <div class="tcol">{{item.client_name}}</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow"
                  v-for="itemChild in item.info_data"
                  :key="itemChild.id">
                  <div class="tcol">{{itemChild.material_name}}</div>
                  <div class="tcol">{{itemChild.material_color}}/{{itemChild.attribute}}</div>
                  <div class="tcol"
                    :class="itemChild.batch_code||itemChild.vat_code?'':'gray'">{{itemChild.batch_code||'无'}}/{{itemChild.vat_code||'无'}}</div>
                  <div class="tcol"
                    :class="itemChild.color_code?'':'gray'">{{itemChild.color_code||'无'}}</div>
                  <div class="tcol">{{itemChild.number}}kg</div>
                </div>
              </div>
              <div class="tcol">{{item.complete_time}}</div>
              <div class="tcol">{{item.desc}}</div>
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
              <div class="col"></div>
            </div>
            <div class="row"
              v-for="(item,index) in materialStockInfo.info_data"
              :key="index">
              <div class="col">
                <div class="spaceBetween">
                  <div class="once">
                    <div class="label"
                      v-if="index===0">
                      <span class="text">物料名称</span>
                      <span class="explanation">(必选)</span>
                    </div>
                    <div class="info elCtn">
                      <el-cascader placeholder="物料名称"
                        :show-all-levels="false"
                        v-model="item.tree_data"
                        :options="yarnTypeList"
                        @change="(ev)=>{item.material_id=ev[2]}"
                        clearable>
                      </el-cascader>
                    </div>
                  </div>
                  <div class="once">
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
                      <el-select placeholder="颜色"
                        v-model="item.material_color">
                        <el-option v-for="item in yarnColorList"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
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
                    <div class="info elCtn">
                      <el-input placeholder="数量"
                        v-model="item.number">
                        <template slot="append">kg</template>
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
                  <span class="text">选择日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    class="once"
                    placeholder="选择日期"
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
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { store, materialStock } from '@/assets/js/api'
import { yarnAttributeArr } from '@/assets/js/dictionary'
import { StoreDetail } from '@/types/store'
import { MaterialStockInfo, MaterialStockLog } from '@/types/materialStock'
import { CascaderInfo } from '@/types/vuex'
import { stockType } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    materialStockInfo: MaterialStockInfo
    storeDetail: StoreDetail
    [propName: string]: any
  } {
    return {
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
        action_type: 9,
        rel_doc_type: '',
        rel_doc_id: '',
        rel_doc_code: '',
        complete_time: this.$getDate(new Date()),
        client_id: '',
        desc: '',
        store_id: '',
        secondary_store_id: '',
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
            rel_doc_info_id: '' // 采购单调取单加工单子项id
          }
        ],
        selectList: []
      },
      yarnAttributeList: yarnAttributeArr,
      storeTotal: 1,
      storePage: 1,
      logTotal: 1,
      logPage: 1
    }
  },
  computed: {
    storeTotalList(): any[] {
      return this.storeDetail.store_total.slice((this.storePage - 1) * 5, this.storePage * 5)
    },
    storeLogList(): any[] {
      return this.storeDetail.store_log.slice((this.logPage - 1) * 5, this.logPage * 5)
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
    yarnColorList(): CascaderInfo {
      return this.$store.state.api.yarnColor.arr
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
          }
          this.loading = false
        })
    },
    goStock(type: 9 | 10, info?: MaterialStockLog) {
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
            rel_doc_info_id: ''
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
              rel_doc_info_id: ''
            }
          })
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
            {
              key: 'attribute',
              errMsg: '请选择物料属性'
            },
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
        materialStock.create(this.materialStockInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.materialStockFlag = false
            this.init()
          }
        })
      }
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
      }
    ])
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/store/materialDetail.less';
</style>