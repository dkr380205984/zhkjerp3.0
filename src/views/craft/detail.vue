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
                  <span class="colorText"
                    :style="{'background':itemColor.color}">{{filterIndex(indexColor)}}</span>
                  <span class="name">{{itemColor.name}}</span>
                </div>
              </div>
            </div>
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

<script lang="ts">
import Vue from 'vue'
import { craft } from '@/assets/js/api'
import { CraftInfo } from '@/types/craft'
export default Vue.extend({
  data(): {
    craftInfo: CraftInfo
    [propName: string]: any
  } {
    return {
      loading: true,
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
    }
  },
  mounted() {
    craft
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        console.log(res)
        if (res.data.status) {
          this.craftInfo = res.data.data
          this.loading = false
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/craft/detail.less';
</style>