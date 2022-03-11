<template>
  <div class="popup storeSurplus"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <div class="text">结余入库</div>
        <div class="closeCtn"
          @click="close">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="contentCtn">
        <div class="editCtn">
          <div class="row">
            <div class="col">
              <div class="label">
                <span class="text">选择仓库</span>
                <span class="explanation">(默认)</span>
              </div>
              <div class="info elCtn">
                <el-cascader :options="storeArr"
                  clearable
                  placeholder="请选择仓库"
                  v-model="materialStockInfo.store_arr"
                  @change="(ev)=>{materialStockInfo.store_id=ev[0];materialStockInfo.secondary_id=ev[1]}"></el-cascader>
              </div>
            </div>
            <div class="col">
              <div class="label">
                <span class="text">结余订单号</span>
                <span class="explanation">(默认)</span>
              </div>
              <div class="info elCtn">
                <el-input v-model="orderCode"
                  placeholder="默认"
                  disabled></el-input>
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
                  <el-option :value="6"
                    label="结余入库"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in materialStockInfo.info_data"
            :key="index">
            <div class="col">
              <div class="spaceBetween">
                <div class="once">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">单据物料</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader placeholder="物料名称"
                      :show-all-levels="false"
                      v-model="item.tree_data"
                      :options="yarnTypeList"
                      filterable
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
                    <el-autocomplete class="once"
                      v-model="item.attribute"
                      :fetch-suggestions="searchAttribute"
                      placeholder="属性"></el-autocomplete>
                  </div>
                </div>
                <div class="once">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">颜色</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-autocomplete v-model="item.material_color"
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
                  <div class="info elCtn">
                    <el-input placeholder="数量"
                      v-model="item.number">
                      <template slot="append">{{item.unit}}</template>
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
              style="max-width:342px">
              <div class="label">
                <span class="text">选择日期</span>
                <span class="explanation">(必选)</span>
              </div>
              <div class="info elCtn">
                <el-date-picker style="width:100%"
                  class="once"
                  placeholder="入库日期"
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
          @click="close">取消</span>
        <span class="btn backHoverBlue"
          @click="saveMaterialStock">确认</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { store, materialStock } from '@/assets/js/api'
import { yarnAttributeArr } from '@/assets/js/dictionary'
import { MaterialStockInfo } from '@/types/materialStock'
export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    orderCode: {
      type: String,
      required: true
    },
    orderId: {
      type: [Number, String],
      required: true
    },
    materialList: {
      type: Array,
      required: false,
      default: []
    }
  },
  data(): {
    materialStockInfo: MaterialStockInfo
    [propName: string]: any
  } {
    return {
      yarnAttributeList: yarnAttributeArr,
      storeArr: [],
      materialStockInfo: {
        material_type: 1,
        order_id: '',
        action_type: 6,
        rel_doc_type: '',
        rel_doc_id: '',
        rel_doc_code: '',
        complete_time: this.$getDate(new Date()),
        client_id: '',
        desc: '',
        store_id: '',
        store_arr: [],
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
            unit: 'kg',
            rel_doc_info_id: '' // 采购单调取单加工单子项id
          }
        ]
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.reset()
        if (this.materialList.length > 0) {
          this.materialStockInfo.info_data = this.materialList.map((item: any) => {
            return {
              tree_data: this.findMaterial(item.material_id),
              material_id: item.material_id,
              material_color: item.material_color,
              color_code: '',
              batch_code: '',
              vat_code: '',
              attribute: item.attribute,
              number: item.number,
              item: '', // 件数
              unit: item.unit,
              rel_doc_info_id: '' // 采购单调取单加工单子项id
            }
          })
        }
      }
    }
  },
  computed: {
    yarnColorList() {
      return this.$store.state.api.yarnColor.arr.map((item: { name: any }) => {
        return {
          value: item.name,
          label: item.name
        }
      })
    },
    yarnTypeList() {
      return this.$store.state.api.yarnType.arr
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    reset() {
      this.materialStockInfo = {
        material_type: 1,
        order_id: '',
        action_type: 6,
        rel_doc_type: '',
        rel_doc_id: '',
        rel_doc_code: '',
        complete_time: this.$getDate(new Date()),
        client_id: '',
        desc: '',
        store_id: '',
        secondary_store_id: '',
        store_arr: [],
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
        ]
      }
    },
    getCmpData() {
      this.materialStockInfo.order_id = this.orderId
      this.materialStockInfo.info_data.forEach((item) => {
        item.batch_code = item.batch_code || '无'
        item.vat_code = item.vat_code || '无'
        item.color_code = item.color_code || '无'
      })
    },
    saveMaterialStock() {
      const formCheck =
        this.$formCheck(this.materialStockInfo, [
          {
            key: 'store_id',
            errMsg: '请选择仓库'
          }
        ]) ||
        this.materialStockInfo.info_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'material_id',
              errMsg: '请选择物料'
            },
            {
              key: 'material_color',
              errMsg: '请输入颜色'
            },
            {
              key: 'attribute',
              errMsg: '请输入属性'
            }
          ])
        })
      if (!formCheck) {
        this.getCmpData()
        materialStock.create({ data: [this.materialStockInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('结余入库成功')
            this.$emit('afterSave', this.materialStockInfo)
          }
        })
      }
    },
    // 原料颜色搜索
    searchColor(str: string, cb: any) {
      let results = str ? this.yarnColorList.filter(this.createFilter(str)) : this.yarnColorList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 原料属性搜索
    searchAttribute(str: string, cb: any) {
      let results = str ? this.yarnAttributeList.filter(this.createFilter(str)) : this.yarnAttributeList.slice(0, 10)
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
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
    }
  },
  mounted() {
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
    this.$checkCommonInfo([
      {
        checkWhich: 'api/yarnColor',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnColorAsync'
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import './storeSurplus.less';
</style>