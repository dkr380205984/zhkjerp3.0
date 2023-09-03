<template>
  <div class="productDetail popup"
    v-show="show">
    <div class="main detailMain">
      <div class="titleCtn">
        <span class="text">产品详情</span>
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
                  <zh-image :data="productInfo.image_data"></zh-image>
                </div>
                <div style="text-align:center">{{productInfo.product_code}}</div>
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
                          <div class="label">产品名称：</div>
                          <div class="text">{{productInfo.name}}</div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <div class="label">客户款号：</div>
                          <div class="text">{{productInfo.style_code}}</div>
                        </div>
                        <div class="col">
                          <div class="label">产品款式：</div>
                          <div class="text">{{productInfo.style_data&&productInfo.style_data.length?productInfo.style_data.map((item)=>item.name).join(','):''}}</div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col"
                          style="min-height:32px;height:auto">
                          <div class="label">产品配色：</div>
                          <div class="text">
                            <span v-for="(item,index) in productInfo.color_data"
                              :key="item.id"
                              style="margin-right:12px">{{index+1}}.{{item.name}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col"
                          style="min-height:32px;height:auto">
                          <div class="label">产品描述：</div>
                          <div class="text"
                            v-html="productInfo.desc"></div>
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
                              v-for="item in productInfo.component_data"
                              :key="item.id">{{item.name}}{{item.number}}%</span>
                          </div>
                        </div>
                      </div>
                      <template v-if="productInfo.isTable">
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
                                      v-for="itemSize,indexSize in productInfo.size_data[0].size_arr"
                                      :key="indexSize + '表格模板'">
                                      {{indexSize === 0 ? '尺寸':''}}
                                    </div>
                                  </div>
                                  <div class="row title"
                                    style="height: 53px;margin:0">
                                    <div class="col"
                                      style="min-width: 101px;margin:unset;padding:unset;"
                                      :style="{'padding-left': (indexSize === 0?'0':'12')+'px'}"
                                      v-for="itemSize,indexSize in productInfo.size_data[0].size_arr"
                                      :key="indexSize + 'indexSize'">
                                      {{itemSize.name}}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="row"
                                v-for="item,index in productInfo.size_data"
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
                          v-for="(item,index) in productInfo.size_data"
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
                  v-for="(item) in productInfo.part_data"
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
                              @click="$openUrl('/craft/create?id='+productInfo.id+'&part_id='+item.id)">添加</span>)
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
                            :class="productInfo.craft_list_id?'yellow':'gray'">
                            <img :src="require('@/assets/image/common/craft_icon.png')" />
                          </div>
                          <div class="rectContent">
                            <div class="text title">工艺单</div>
                          </div>
                        </div>
                        <div class="menu">
                          <span class="opration"
                            @click="productInfo.craft_list_id?$openUrl('/craft/print?id='+productInfo.craft_list_id):$message.error('暂无工艺单')">打印</span>
                          <span class="opration"
                            @click="productInfo.craft_list_id?$openUrl('/craft/detail?id='+productInfo.craft_list_id):$openUrl('/craft/create?id='+productInfo.id)">{{productInfo.craft_list_id?'详情':'添加'}}</span>
                        </div>
                      </div>
                      <div class="rect">
                        <div class="rectMain">
                          <div class="icon"
                            :class="productInfo.rel_quote_info && productInfo.rel_quote_info.quote_id?'yellow':'gray'">
                            <img :src="require('@/assets/image/common/price_icon.png')" />
                          </div>
                          <div class="rectContent">
                            <div class="text title">报价单</div>
                          </div>
                        </div>
                        <div class="menu">
                          <template v-if="productInfo.rel_quote_info && productInfo.rel_quote_info.quote_id">
                            <span class="opration"
                              @click="$openUrl('/quotedPrice/print?id='+productInfo.rel_quote_info.quote_id)">打印</span>
                            <span class="opration"
                              @click="$openUrl('/quotedPrice/detail?id='+productInfo.rel_quote_info.quote_id)">详情</span>
                          </template>
                          <template v-else>
                            <span class="opration">无操作</span>
                          </template>
                        </div>
                      </div>
                      <div class="rect">
                        <div class="rectMain">
                          <div class="icon"
                            :class="productInfo.order_id?'yellow':'gray'">
                            <img :src="require('@/assets/image/common/plan_icon.png')" />
                          </div>
                          <div class="rectContent">
                            <div class="text title">订单</div>
                          </div>
                        </div>
                        <div class="menu">
                          <template v-if="productInfo.order_id">
                            <span class="opration"
                              @click="$openUrl('/order/detail?id='+productInfo.order_id)">详情</span>
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
                  v-if="productInfo.price">
                  <div class="tcol"
                    style="text-align:center">价格信息</div>
                  <div class="tcol"
                    style="flex:9">
                    <div class="detailCtn">
                      <div class="row">
                        <div class="col">
                          <div class="label">产品价格：</div>
                          <div class="text">{{productInfo.price}}</div>
                        </div>
                        <div class="col">
                          <div class="label">价格单位：</div>
                          <div class="text">{{productInfo.price_unit}}</div>
                        </div>
                      </div>
                      <div class="row">

                        <div class="col">
                          <div class="label">价格备注：</div>
                          <div class="text">{{productInfo.price_desc}}</div>
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
        v-show="!noOpr">
        <span class="btn borderBtn"
          @click="close">取消</span>
        <span class="btn backHoverBlue"
          @click="$openUrl('/tagEditPrint/editTag?id=' + productInfo.id + '&type=2')">
          <use xlink:href="#icon-dayindingdan"></use>
          编辑标签
        </span>
        <span class="btn backHoverOrange"
          @click="proId=null;pid=null;pid_status=null;addProductFlag = true;">修改</span>
      </div>
    </div>
    <template v-if="!noOpr">
      <product-edit :edit="true"
        :inDetail="true"
        :pid="null"
        :pid_status="null"
        :id="data?data.product_id :productInfo.id"
        :data="productInfo"
        :show="addProductFlag"
        @close="addProductFlag = false"
        @afterSave="getNewProduct"
        :quote_rel_product_data="productInfo"></product-edit>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { product } from '@/assets/js/api'
import { ProductInfo } from '@/types/product'
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
    // <!-- 任何有编辑页面的detail组件请务必去掉编辑功能，noOpr = true,因为wangeditor组件是填充到id里，新增和修改的editor重复了 -->
    // 页面只看详情不需要操作
    noOpr: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data(): {
    productInfo: ProductInfo
    [propName: string]: any
  } {
    return {
      qrCodeUrl: '',
      addProductFlag: false,
      productInfo: {
        product_type: 1,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category: '',
        type: '',
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
    // 打开产品详情窗口之前需要获取产品详情
    show(val) {
      if (val) {
        this.$emit('beforeGet')
        if (this.data) {
          this.productInfo = this.changeProductInfoData(this.data as ProductInfo)
          this.productInfo.id = this.productInfo.product_id // 订单过来的用product_id，id是订单用的
          this.getDataFlag = true
        } else {
          product
            .detail({
              id: this.id
            })
            .then((res) => {
              if (res.data.status) {
                this.$emit('afterGet')
                this.productInfo = this.changeProductInfoData(res.data.data)
                this.getDataFlag = true
              }
            })
        }
      }
    }
  },
  mounted() {},
  methods: {
    close() {
      this.getDataFlag = false
      this.$emit('close')
    },
    getNewProduct(val: any) {
      this.productInfo = this.changeProductInfoData(val)
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
    changeProductInfoData(param: any) {
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
@import './productDetail.less';
</style>

<style lang="less">
.list .row {
  background: unset !important;
  &:hover {
    background: unset !important;
  }
}
.list .row.title {
  background: #fafafa !important;
  &:hover {
    background: #fafafa !important;
  }
}
</style>