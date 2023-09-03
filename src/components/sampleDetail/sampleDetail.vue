<template>
  <div class="sampleDetail popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">样品详情</span>
        <div class="closeCtn"
          @click="close">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn"
        v-loading="!getDataFlag">
        <div class="tableCtn">
          <div class="tbody">
            <div class="trow">
              <div class="tcol">
                <div style="max-height:400px">
                  <zh-image :data="sampleInfo.image_data"></zh-image>
                </div>
                <div style="text-align:center">{{sampleInfo.product_code}}</div>
              </div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol"
                    style="text-align:center">基本信息</div>
                  <div class="tcol"
                    style="flex:9">
                    <div class="detailCtn">
                      <div class="row">
                        <div class="col">
                          <div class="label">样品名称：</div>
                          <div class="text">{{sampleInfo.name}}</div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <div class="label">客户款号：</div>
                          <div class="text">{{sampleInfo.style_code}}</div>
                        </div>
                        <div class="col">
                          <div class="label">样品款式：</div>
                          <div class="text">{{sampleInfo.style_data&&sampleInfo.style_data.length?sampleInfo.style_data.map((item)=>item.name).join(','):''}}</div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col"
                          style="min-height:32px;height:auto">
                          <div class="label">样品配色：</div>
                          <div class="text">
                            <span v-for="(item,index) in sampleInfo.color_data"
                              :key="item.id"
                              style="margin-right:12px">{{index+1}}.{{item.name}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col"
                          style="min-height:32px;height:auto">
                          <div class="label">样品描述：</div>
                          <div class="text"
                            v-html="sampleInfo.desc"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"
                    style="text-align:center">大身信息</div>
                  <div class="tcol"
                    style="flex:9">
                    <div class="detailCtn">
                      <div class="row">
                        <div class="col">
                          <div class="label">大身成分：</div>
                          <div class="text">
                            <span style="margin-right:12px"
                              v-for="item in sampleInfo.component_data"
                              :key="item.id">{{item.name}}{{item.number}}%</span>
                          </div>
                        </div>
                      </div><template v-if="sampleInfo.isTable">
                        <div class="row showProTableTypeCtn"
                          style="width:640px;overflow-x:scroll"
                          :ref="0"
                          @mousewheel.prevent="listenWheel">
                          <div class="listCtn"
                            style="padding: 0;">
                            <div class="list">
                              <div class="row title"
                                style="height:102px;">
                                <div class="col"
                                  style="margin:unset;max-width:165px;min-width:165px">子款号</div>
                                <div class="col"
                                  style="margin:unset;padding:unset;max-width:165px;min-width:165px">条码号码</div>
                                <div class="col"
                                  style="margin:unset;min-width:120px;max-width:120px">尺码</div>
                                <div class="col"
                                  style="margin:unset;min-width:120px;max-width:120px">克重</div>
                                <div class="col"
                                  style="padding: 0;height:unset">
                                  <div class="row title"
                                    style="padding:unset;height: 51px;margin:0">
                                    <div class="col"
                                      style="min-width: 100px;margin:unset;padding:unset"
                                      :style="{'padding-left': (indexSize === 0?'0':'12')+'px'}"
                                      v-for="itemSize,indexSize in sampleInfo.size_data[0].size_arr"
                                      :key="indexSize + '表格模板'">
                                      {{indexSize === 0 ? '尺寸':''}}
                                    </div>
                                  </div>
                                  <div class="row title"
                                    style="height: 53px;margin:0">
                                    <div class="col"
                                      style="min-width: 101px;margin:unset;padding:unset;"
                                      :style="{'padding-left': (indexSize === 0?'0':'12')+'px'}"
                                      v-for="itemSize,indexSize in sampleInfo.size_data[0].size_arr"
                                      :key="indexSize + 'indexSize'">
                                      {{itemSize.name}}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="row"
                                v-for="item,index in sampleInfo.size_data"
                                :key="index + '大身listBody'">
                                <div class="col"
                                  style="margin:unset;max-width:165px;min-width:165px">
                                  {{item.child_style_code}}
                                </div>
                                <div class="col"
                                  style="margin:unset;padding:unset;max-width:165px;min-width:165px">
                                  {{item.brcode_number}}
                                </div>
                                <div class="col"
                                  style="margin:unset;min-width:120px;max-width:120px">
                                  {{item.name}}
                                </div>
                                <div class="col"
                                  style="margin:unset;min-width:120px;max-width:120px">
                                  {{item.weight}}
                                </div>
                                <div class="col"
                                  style="min-width: 200px;padding: 0;height:unset">
                                  <div class="row"
                                    style="height: 57px;padding:0">
                                    <div class="col"
                                      style="min-width: 101px;margin:unset;padding:unset;"
                                      :style="{'padding-left': (indexSize === 0?'0':'12')+'px'}"
                                      v-for="itemSize,indexSize in item.size_arr"
                                      :key="indexSize + 'indexSizeListBody'">
                                      {{itemSize.value}}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="row"
                          v-for="(item,index) in sampleInfo.size_data"
                          :key="item.id">
                          <div class="col">
                            <div class="label">{{index===0?'大身尺码：':''}}</div>
                            <div class="text">{{index+1}}.&nbsp;{{item.name}}&nbsp;{{item.weight}}g&nbsp;{{item.size_info}}</div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="trow"
                  v-for="(item) in sampleInfo.part_data"
                  :key="item.id">
                  <div class="tcol"
                    style="text-align:center">配件信息</div>
                  <div class="tcol"
                    style="flex:9">
                    <div class="detailCtn">
                      <div class="row">
                        <div class="col">
                          <div class="label">配件名称：</div>
                          <div class="text">{{item.name}}</div>
                        </div>
                        <div class="col">
                          <div class="label">配件单位：</div>
                          <div class="text">{{item.unit}}</div>
                        </div>
                        <div class="col">
                          <div class="label">配件工艺：</div>
                          <div class="text gray"
                            v-if="!item.craft_list_id">暂无(
                            <span class="hoverBlue"
                              style="cursor:pointer"
                              @click="$openUrl('/craft/create?id='+sampleInfo.id+'&part_id='+item.id)">添加</span>)
                          </div>
                          <div class="text"
                            v-else>
                            <span class="hoverBlue"
                              style="cursor:pointer"
                              @click="$openUrl('/craft/detail?id='+item.craft_list_id)">查看</span>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <div class="label">配件成分：</div>
                          <div class="text">
                            <span style="margin-right:12px"
                              v-for="itemChild in item.part_component_data"
                              :key="itemChild.id">{{itemChild.name}}{{itemChild.number}}%</span>
                          </div>
                        </div>
                      </div>
                      <div class="row"
                        v-for="(itemChild,indexChild) in item.part_size_data"
                        :key="itemChild.id">
                        <div class="col">
                          <div class="label">{{indexChild===0?'配件尺码：':''}}</div>
                          <div class="text">{{indexChild+1}}.&nbsp;{{itemChild.name}}&nbsp;{{itemChild.weight}}g&nbsp;{{itemChild.size_info}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"
                    style="text-align:center">关联单据</div>
                  <div class="tcol"
                    style="flex:9">
                    <div class="rectCtn">
                      <div class="rect">
                        <div class="rectMain">
                          <div class="icon"
                            :class="sampleInfo.craft_list_id?'yellow':'gray'">
                            <img :src="require('@/assets/image/common/craft_icon.png')" />
                          </div>
                          <div class="rectContent">
                            <div class="text title">工艺单</div>
                          </div>
                        </div>
                        <div class="menu">
                          <span class="opration">打印</span>
                          <span class="opration"
                            @click="sampleInfo.craft_list_id?$openUrl('/craft/detail?id='+sampleInfo.craft_list_id):$openUrl('/craft/create?id='+sampleInfo.id)">{{sampleInfo.craft_list_id?'详情':'添加'}}</span>
                        </div>
                      </div>
                      <div class="rect">
                        <div class="rectMain">
                          <div class="icon"
                            :class="sampleInfo.quote_rel_product_id?'yellow':'gray'">
                            <img :src="require('@/assets/image/common/price_icon.png')" />
                          </div>
                          <div class="rectContent">
                            <div class="text title">报价单</div>
                          </div>
                        </div>
                        <div class="menu">
                          <template v-if="sampleInfo.quote_rel_product_id">
                            <span class="opration"
                              @click="$openUrl('/quotedPrice/print?id='+sampleInfo.quote_rel_product_id)">打印</span>
                            <span class="opration"
                              @click="$openUrl('/quotedPrice/detail?id='+sampleInfo.quote_rel_product_id)">详情</span>
                          </template>
                          <template v-else>
                            <span class="opration">无操作</span>
                          </template>
                        </div>
                      </div>
                      <div class="rect">
                        <div class="rectMain">
                          <div class="icon"
                            :class="sampleInfo.quote_rel_product_id?'yellow':'gray'">
                            <img :src="require('@/assets/image/common/plan_icon.png')" />
                          </div>
                          <div class="rectContent">
                            <div class="text title">样单</div>
                          </div>
                        </div>
                        <div class="menu">
                          <template v-if="sampleInfo.order_id">
                            <span class="opration"
                              @click="$openUrl('/sampleOrder/detail?id='+sampleInfo.order_id)">详情</span>
                          </template>
                          <template v-else>
                            <span class="opration">无操作</span>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow"
                  v-if="sampleInfo.price">
                  <div class="tcol"
                    style="text-align:center">价格信息</div>
                  <div class="tcol"
                    style="flex:9">
                    <div class="detailCtn">
                      <div class="row">
                        <div class="col">
                          <div class="label">样品价格：</div>
                          <div class="text">{{sampleInfo.price}}</div>
                        </div>
                        <div class="col">
                          <div class="label">价格单位：</div>
                          <div class="text">{{sampleInfo.price_unit}}</div>
                        </div>
                      </div>
                      <div class="row">

                        <div class="col">
                          <div class="label">价格备注：</div>
                          <div class="text">{{sampleInfo.price_desc}}</div>
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
      <div class="oprCtn"
        v-if="!noOpr">
        <span class="btn borderBtn"
          @click="close">取消</span>
        <span class="btn backHoverBlue"
          @click="$openUrl('/tagEditPrint/editTag?id=' + sampleInfo.id+'&type=2')">
          <use xlink:href="#icon-dayindingdan"></use>
          编辑标签
        </span>
        <span class="btn backHoverOrange"
          @click="proId=null;pid=null;pid_status=null;addProductFlag = true;">修改</span>
      </div>
    </div>
    <template v-if="!noOpr">
      <sample-edit :edit="true"
        :inDetail="true"
        :pid="null"
        :pid_status="null"
        :id="data?data.product_id :sampleInfo.id"
        :data="sampleInfo"
        :show="addProductFlag"
        @close="addProductFlag = false"
        @afterSave="getNewSample"
        :quote_rel_product_data="sampleInfo"></sample-edit>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { sample } from '@/assets/js/api'
import { SampleInfo } from '@/types/sample'
export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    id: {
      type: [Number, String],
      required: false
    },
    data: {
      required: false
    },
    // 页面只看详情不需要操作
    noOpr: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data(): {
    sampleInfo: SampleInfo
    [propName: string]: any
  } {
    return {
      addProductFlag: false,
      sampleInfo: {
        product_type: 2,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category: '',
        secondary_category: '',
        image_data: [],
        desc: '',
        style_data: [], // 款式
        component_data: [
          {
            component_id: '',
            number: '' // 成分信息
          }
        ],
        size_data: [
          {
            id: '',
            size_id: '',
            size_info: '',
            weight: ''
          }
        ], // 尺码组
        color_data: [], // 配色组
        // 配件信息
        part_data: [
          {
            name: '',
            unit: '',
            part_size_data: [
              {
                id: '',
                size_id: '',
                size_info: '',
                weight: ''
              }
            ],
            part_component_data: [
              {
                component_id: '',
                number: '' // 成分信息
              }
            ]
          }
        ]
      },
      getDataFlag: false
    }
  },
  watch: {
    // 打开样品详情窗口之前需要获取样品详情
    show(val) {
      if (val) {
        this.$emit('beforeGet')
        if (this.data) {
          this.sampleInfo = this.changeSampleInfoData(this.data as SampleInfo)
          this.sampleInfo.id = this.sampleInfo.product_id
          this.getDataFlag = true
        } else {
          sample
            .detail({
              id: this.id
            })
            .then((res) => {
              if (res.data.status) {
                this.$emit('afterGet')
                this.sampleInfo = this.changeSampleInfoData(res.data.data)
                this.getDataFlag = true
              }
            })
        }
      }
    }
  },
  methods: {
    close() {
      this.getDataFlag = false
      this.$emit('close')
    },
    getNewSample(val: any) {
      this.sampleInfo = this.changeSampleInfoData(val)
      this.$emit('afterDetailUpdate', val)
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
      this.$refs[0].scrollLeft += step
    },
    changeSampleInfoData(param: any) {
      param = this.$clone(param)
      param.isTable = this.$isJSON(param.size_data[0].size_info) || this.$isJSON(param.size_data[0].size_arr)
      if (param.isTable) {
        param.size_data.forEach((item: any) => {
          item.size_arr = JSON.parse(item.size_info)
        })
      }
      return param
    }
  }
})
</script>

<style lang="less" scoped>
@import './sampleDetail.less';
</style>