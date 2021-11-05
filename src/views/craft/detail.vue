<template>
  <div id="craftDetail"
    class="bodyContainer"
    v-loading="loading">
    <!-- 产品信息组件 -->
    <div class="module">
      <div class="titleCtn">
        <div class="title">原料经向</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">配色方案：</div>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in craftInfo.warp_data.color_data"
                :key="index">
                <span class="circle">{{index+1}}</span>
                <span>{{item.product_color}}：</span>
                <div class="colorBox"
                  v-for="(itemColor,indexColor) in item.color_scheme"
                  :key="indexColor">
                  <el-tooltip class="item"
                    effect="dark"
                    :content="filterColorWeigth(itemColor)"
                    placement="top">
                    <div>
                      <span class="colorText"
                        :style="{'background':itemColor.color}">{{filterIndex(indexColor)}}</span>
                      <span class="name">{{itemColor.name}}</span>
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row"
          v-for="(item,index) in craftInfo.warp_data.material_data"
          :key="index">
          <div class="col">
            <span class="label">{{index===0?'主要':'次要'}}原料：</span>
            <div class="text">
              <span>{{item.material_name}}</span>
              <div class="colorBox"
                v-for="(itemApply,indexApply) in item.apply"
                :key="indexApply">
                <span class="colorText">{{filterIndex(itemApply)}}</span>
                <span class="name">{{cmpIndexWeight(itemApply, craftInfo.warp_data.color_data[index].color_scheme,1)}}g</span>
              </div>
            </div>
          </div>
        </div>
        <template v-if="craftInfo.warp_data.assist_material.length>0&&craftInfo.warp_data.assist_material[0].material_id">
          <div class="row"
            v-for="(item,index) in craftInfo.warp_data.assist_material"
            :key="index">
            <div class="col">
              <span class="label">辅助原料：</span>
              <div class="text">
                <span>{{item.material_name}}</span>
                <div class="colorBox"
                  v-for="(itemApply,indexApply) in item.apply"
                  :key="indexApply">
                  <span class="colorText">{{filterIndex(itemApply)}}</span>
                  <span class="name">{{cmpIndexWeight(itemApply, craftInfo.warp_data.color_data[index].color_scheme,2)}}g</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="row">
          <div class="col">
            <span class="label">经向信息：</span>
            <hot-table :settings="tableData.warp"
              ref="warp">
            </hot-table>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverOrange"
            @click="$router.push('/craft/update?id='+$route.query.id)">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/handsontable@7.3.0/dist/handsontable.full.min.js"></script>
<script lang="ts">
import Vue from 'vue'
import { craft } from '@/assets/js/api'
import { CraftInfo } from '@/types/craft'
import { languages } from '@/assets/js/dictionary'
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
Handsontable.languages.registerLanguageDictionary(languages as any) // 注册中文字典
export default Vue.extend({
  components: {
    HotTable
  },
  data(): {
    craftInfo: CraftInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      tableData: { warp: {}, warpBack: {}, weft: {}, weftBack: {} },
      craftInfo: {
        id: '',
        product_id: '',
        title: '',
        size: '', // 大身规格
        weight: '', // 大身克重
        other_info: '',
        desc: '',
        is_draft: 1,
        calc_weight_way: 1, // 计算公式
        product_time: '', //下机时间
        process_data: [],
        yarn_coefficient: [
          {
            id: '',
            name: '',
            value: '',
            chuankou: ''
          }
        ],
        draft_method: {
          PM: [
            {
              value: '', // 循环的值，用逗号分割
              repeat: '', // 循环次数
              number: '', // 纱线根数
              total: 0, // 高级穿综法统计值
              children: [
                {
                  number: '',
                  children: [
                    {
                      value: '',
                      repeat: ''
                    }
                  ]
                }
              ]
            }
          ],
          PMFlag: 'normal',
          GL: [
            [
              [
                {
                  value: '',
                  mark: ''
                },
                {
                  value: '',
                  mark: ''
                },
                {
                  value: '',
                  mark: ''
                }
              ]
            ]
          ],
          GLFlag: 'normal',
          GLRepeat: [
            [
              {
                start: '',
                end: '',
                repeat: ''
              }
            ]
          ],
          PMDesc: '',
          GLDesc: ''
        },
        warp_data: {
          color_data: [
            {
              color_id: '',
              weave_number: '',
              color_scheme: [
                {
                  color: '',
                  name: ''
                }
              ]
            }
          ],
          material_data: [
            {
              material_id: '',
              apply: ['0'],
              type_materail: 0
            },
            {
              material_id: '',
              apply: [''],
              type_materail: 1
            }
          ],
          assist_material: [
            {
              material_id: '',
              apply: [''],
              number: ''
            }
          ],
          warp_rank: [],
          warp_rank_back: [],
          merge_data: '',
          merge_data_back: '',
          weft: '', // 总头纹
          width: '', // 整经门幅
          side_id: '', // 边型
          machine_id: '', // 机型
          reed: '', // 筘号
          reed_method: '', // 穿筘法
          reed_width: '', // 筘幅
          reed_width_explain: ['', '', ''], // 筘幅说明
          sum_up: '', // 综页
          back_status: 2 // 反面
        },
        weft_data: {
          color_data: [
            {
              color_id: '',
              weave_number: '',
              color_scheme: [
                {
                  color: '',
                  name: ''
                }
              ]
            }
          ],
          material_data: [
            {
              material_id: '',
              apply: ['0'],
              type_materail: 0
            },
            {
              material_id: '',
              apply: [''],
              type_materail: 1
            }
          ],
          assist_material: [
            {
              material_id: '',
              apply: [''],
              number: ''
            }
          ],
          weft_rank: [],
          weft_rank_back: [],
          merge_data: '',
          merge_data_back: '',
          organization_id: '', // 组织法
          peifu: '', // 胚服
          weimi: '', // 纬密
          shangchiya: '', // 上齿牙
          xiachiya: '', // 下齿牙
          neichang: '', // 内长
          rangwei: '', // 让位
          total: '', // 总计
          back_status: 2, // 1：有，2：无
          peifu_explain: '' // 胚服说明
        },
        material_info: []
      }
    }
  },
  methods: {
    // 匹配主/夹名称
    filterIndex(index: number): string {
      if (index === 0) {
        return '主'
      } else {
        return '夹' + index
      }
    },
    // 用配色表已经算好的克重计算主夹克重
    cmpIndexWeight(applyIndex: number, colorScheme: any[], material_type: 1 | 2) {
      return colorScheme[applyIndex].material_weight
        ? colorScheme[applyIndex].material_weight
            .filter((item: any) => item.material_type === material_type)
            .reduce((total: number, current: any) => {
              return total + Number(current.weight)
            }, 0)
        : 0
    },
    filterColorWeigth(itemColor: any) {
      return itemColor.material_weight
        ? itemColor.material_weight.map((item: any) => item.material_name + ':' + item.weight + 'g').join(';')
        : ''
    }
  },
  created() {
    this.tableData.warp = {
      data: [[1], [null], [null], [null], [null], [null], [null]],
      rowHeaders: (index: any) => {
        let headerArr = ['序号', '主/夹', '根数', '合并项', '合并项', '合并项', '穿综法']
        return `<div style="height:38px;line-height:38px;color:rgba(0,0,0,0.65);display:table-row">${headerArr[index]}</div>`
      },
      rowHeaderWidth: 80,
      minCols: 1,
      autoColumnSize: true, // 自适应宽度
      cells: (row: any, col: any, prop: any) => {
        let cellProperties: any = {}
        cellProperties.readOnly = true
        cellProperties.renderer = function (
          instance: any,
          td: any,
          row: any,
          col: any,
          prop: any,
          value: any,
          cellProperties: any
        ) {
          // 清空节点并重新渲染
          Handsontable.dom.empty(td)
          let node = document.createElement('DIV')
          let CSS = td.style
          node.innerText = value
          td.appendChild(node)
          // 设置样式
          CSS.color = 'rgba(0,0,0,0.65)'
          CSS.width = '38px'
          CSS.height = '38px'
          CSS.lineHeight = '38px'
          CSS.textAlign = 'center'
          if (row === 0) {
            CSS.background = '#E9E9E9'
          }
          return td
        }
        return cellProperties
      },
      contextMenu: false,
      className: 'handsontable',
      number: 1,
      licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
      width: '100%',
      height: 280
    }
  },
  mounted() {
    craft
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.craftInfo = res.data.data
          this.tableData.warp.data = this.craftInfo.warp_data.warp_rank.map((item: any, index) => {
            return index !== 1
              ? item
              : item.map((itemJia: number) => {
                  return this.filterIndex(itemJia)
                })
          })
          this.tableData.warp.mergeCells = this.craftInfo.warp_data.merge_data
          this.loading = false
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/craft/detail.less';
</style>