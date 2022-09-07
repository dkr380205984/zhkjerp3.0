<template>
  <div class="orderDetail">
    <div class="module">
      <el-tabs type="border-card"
        v-model="cardName">
        <el-tab-pane name="基本信息"
          label="基本信息">
          <div class="detailCtn">
            <div class="checkCtn">
              <el-tooltip class="item"
                effect="dark"
                :content="orderInfo.time_data[0].is_check>=3?'点击查看异常处理办法':'点击查看审核日志'"
                placement="bottom">
                <img :src="orderInfo.time_data[0].is_check|checkFilter" />
              </el-tooltip>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">{{orderInfo.order_type===1?'订':'样'}}单号：</div>
                <div class="text">{{orderInfo.code}}
                  <span v-if="orderInfo.order_type===2&&orderTime"
                    class="green">(第{{orderTime}}次打样)</span>
                </div>
              </div>
              <div class="col">
                <div class="label">创建人：</div>
                <div class="text">{{orderInfo.user_name}}</div>
              </div>
              <div class="col">
                <div class="label">创建时间：</div>
                <div class="text">{{orderInfo.created_at}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">{{orderInfo.order_type===1?'订':'样'}}单公司：</div>
                <div class="text">{{orderInfo.client_name}}</div>
              </div>
              <div class="col">
                <div class="label">联系人：</div>
                <div class="text">{{orderInfo.contacts_name}}</div>
              </div>
              <div class="col">
                <div class="label">负责组/人：</div>
                <div class="text">{{orderInfo.group_name}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">下单币种：</div>
                <div class="text">{{orderInfo.settle_unit}}</div>
              </div>
              <div class="col flex3">
                <div class="label">币种汇率</div>
                <div class="text">{{orderInfo.settle_tax || 100}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">{{orderInfo.order_type===1?'订':'样'}}单状态：</div>
                <div class="text"
                  :class="orderInfo.status|orderStatusClassFilter">{{orderInfo.status|orderStatusFilter}}</div>
              </div>
              <div class="col flex3">
                <div class="label">{{orderInfo.order_type===1?'下单':'打样'}}时间：</div>
                <div class="text">{{orderInfo.time_data[sampleOrderIndex].orderTime}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">{{orderInfo.order_type===1?'下单':'打样'}}款数：</div>
                <div class="text">{{orderInfo.time_data[sampleOrderIndex].total_style}}款</div>
              </div>
              <div class="col flex3">
                <div class="label">{{orderInfo.order_type===1?'下单':'打样'}}总数：</div>
                <div class="text">{{orderInfo.time_data[sampleOrderIndex].total_number}}</div>
              </div>
            </div>
            <div class="row"
              v-if="orderInfo.order_type===1">
              <div class="col">
                <div class="label">产前样寄送：</div>
                <div class="text"
                  :class="orderInfo.time_data[orderTime-1].is_send===1?'green':'gray'">{{orderInfo.time_data[orderTime-1].is_send===1?'是':'否'}}
                  <span class="hoverBlue"
                    style="cursor:pointer"
                    v-if="orderInfo.time_data[orderTime-1].is_send===1"
                    @click="sendFlag=true">(查看详情)</span>
                </div>
              </div>
              <div class="col">
                <div class="label">产前确认：</div>
                <div class="text"
                  :class="orderInfo.time_data[orderTime-1].is_before_confirm===1?'green':'gray'">{{orderInfo.time_data[orderTime-1].is_before_confirm===1?'是':'否'}}</div>
              </div>
              <div class="col">
                <div class="label">是否加急：</div>
                <div class="text"
                  :class="orderInfo.time_data[orderTime-1].is_urgent===1?'red':'gray'">{{orderInfo.time_data[orderTime-1].is_urgent===1?'【加急订单】':'否'}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">相关文件：</div>
                <div class="fileCtn">
                  <div class="once"
                    v-for="(item,index) in orderInfo.public_files"
                    :key="index">
                    <div class="fileIcon">
                      <svg v-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='xlsx'"
                        class="iconFont"
                        aria-hidden="true">
                        <use xlink:href="#icon-Excel"></use>
                      </svg>
                      <svg v-else-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='png'||item.file_url.split('.')[item.file_url.split('.').length-1]==='jpeg'||item.file_url.split('.')[item.file_url.split('.').length-1]==='jpg'"
                        class="iconFont"
                        aria-hidden="true">
                        <use xlink:href="#icon-tupian"></use>
                      </svg>
                      <svg v-else-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='word'"
                        class="iconFont"
                        aria-hidden="true">
                        <use xlink:href="#icon-word"></use>
                      </svg>
                      <svg v-else-if="item.file_url.split('.')[item.file_url.split('.').length-1]==='pdf'"
                        class="iconFont"
                        aria-hidden="true">
                        <use xlink:href="#icon-pdf"></use>
                      </svg>
                      <svg v-else
                        class="iconFont"
                        aria-hidden="true">
                        <use xlink:href="#icon-qitawenjian"></use>
                      </svg>
                    </div>
                    <div class="name">{{item.file_name}}.{{item.file_url.split('.')[item.file_url.split('.').length-1]}}</div>
                    <a class="opr hoverBlue"
                      :href="item"
                      target=_blank>点击下载</a>
                  </div>
                  <div class="text"
                    v-if="orderInfo.public_files.length===0">
                    <span class="gray">暂无相关文件信息</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text"
                  v-html="orderInfo.desc"></div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :name="(orderInfo.order_type===1?'产':'样')+'品信息'"
          :label="(orderInfo.order_type===1?'产':'样')+'品信息'">
          <div class="tableCtn">
            <div class="thead">
              <div class="trow">
                <div class="tcol">{{orderInfo.order_type===1?'产':'样'}}品编号</div>
                <div class="tcol">{{orderInfo.order_type===1?'产':'样'}}品图片</div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow">
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">克重尺寸</div>
                    <div class="tcol">{{orderInfo.order_type===1?'下单':'打样'}}数量</div>
                  </div>
                </div>
                <div class="tcol">工艺单状态</div>
                <div class="tcol">{{orderInfo.order_type===1?'产':'样'}}品描述</div>
                <div class="tcol">修改意见</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(item,index) in productList"
                :key="index">
                <div class="tcol">
                  <span class="blue"
                    style="cursor:pointer"
                    @click="proId=item.product_id;orderInfo.order_type===1?productShow=true:sampleShow=true">{{item.product_code||item.system_code}}</span>
                  <span :class="{'gray':!item.name}">{{item.name||'无名称'}}</span>
                  <span class="gray">({{item.category}}/{{item.secondary_category}})</span>
                </div>
                <div class="tcol">
                  <div class="imageCtn">
                    <el-image style="width:100%;height:100%"
                      :src="item.image_data.length>0?item.image_data[0]:''"
                      :preview-src-list="item.image_data">
                      <div slot="error"
                        class="image-slot">
                        <i class="el-icon-picture-outline"
                          style="font-size:42px"></i>
                      </div>
                    </el-image>
                  </div>
                </div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.product_info"
                    :key="indexChild">
                    <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                    <div class="tcol">
                      <span>克重:{{itemChild.weight}}g</span><span>尺寸:{{itemChild.size_info}}</span>
                    </div>
                    <div class="tcol">{{itemChild.number}}</div>
                  </div>
                </div>
                <div class="tcol stateCtn">
                  <div class="state">
                    <div class="circle"
                      :class="{'backGray':!item.craft_list_id,'backBlue':item.craft_list_id}">工</div>
                  </div>
                </div>
                <div class="tcol"
                  v-html="item.desc"></div>
                <div class="tcol">{{item.client_edit_idea||'无'}}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :name="(orderInfo.order_type===1?'发货信息':'打样信息')"
          :label="(orderInfo.order_type===1?'发货信息':'打样信息')">
          <template v-if="orderInfo.order_type===1">
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol"
                    style="flex:0.72">批次序号</div>
                  <div class="tcol">发货时间</div>
                  <div class="tcol">批次名称</div>
                  <div class="tcol">批次类型</div>
                  <div class="tcol">批次备注</div>
                  <div class="tcol noPad"
                    style="flex:8.7">
                    <div class="trow">
                      <div class="tcol">产品品类</div>
                      <div class="tcol">产品图片</div>
                      <div class="tcol noPad"
                        style="flex:3">
                        <div class="trow">
                          <div class="tcol">尺码颜色</div>
                          <div class="tcol">计划发货数量</div>
                          <div class="tcol">实际发货数量</div>
                        </div>
                      </div>
                      <div class="tcol">批次状态</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="itemBatch in orderInfo.time_data[sampleOrderIndex].batch_data"
                  :key="itemBatch.id">
                  <div class="tcol"
                    style="flex:0.72">
                    <span>第{{itemBatch.batch_number}}批</span>
                  </div>
                  <div class="tcol">
                    <span class="green">{{itemBatch.delivery_time}}</span>
                  </div>
                  <div class="tcol">
                    <span>{{itemBatch.batch_title || '无'}}</span>
                  </div>
                  <div class="tcol">
                    <span>{{itemBatch.batch_type_name}}</span>
                  </div>
                  <div class="tcol">
                    <span>{{itemBatch.desc || '无'}}</span>
                  </div>
                  <div class="tcol noPad"
                    style="flex:8.7">
                    <div class="trow"
                      v-for="itemPro in itemBatch.product_data"
                      :key="itemPro.id">
                      <div class="tcol">
                        <span>{{itemPro.product_code||itemPro.system_code||'无编号'}}</span>
                        <span :class="{'gray':!itemPro.name}">{{itemPro.name||'无名称'}}</span>
                        <span class="gray">({{itemPro.category}}/{{itemPro.secondary_category}})</span>
                      </div>
                      <div class="tcol">
                        <div class="imageCtn">
                          <el-image style="width:100%;height:100%;margin-top:2px"
                            :src="itemPro.image_data.length>0?itemPro.image_data[0]:''"
                            :preview-src-list="itemPro.image_data">
                            <div slot="error"
                              class="image-slot">
                              <i class="el-icon-picture-outline"
                                style="font-size:42px"></i>
                            </div>
                          </el-image>
                        </div>
                      </div>
                      <div class="tcol noPad"
                        style="flex:3">
                        <div class="trow"
                          v-for="(itemChild,indexChild) in itemPro.product_info"
                          :key="indexChild">
                          <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                          <div class="tcol">{{itemChild.number}}</div>
                          <div class="tcol">{{itemChild.transport_number||0}}</div>
                        </div>
                      </div>
                      <div class="tcol"
                        :class="{'blue':itemBatch.status===1,'green':itemBatch.status===2,'red':itemBatch.status===3}">
                        {{itemBatch.status===1?'进行中':(itemBatch.status===2?'已完成':'已逾期')}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">样品编号</div>
                  <div class="tcol">样品图片</div>
                  <div class="tcol noPad"
                    style="flex:3">
                    <div class="trow">
                      <div class="tcol">尺码颜色</div>
                      <div class="tcol">单价</div>
                      <div class="tcol">打样数量</div>
                      <div class="tcol">送样/留底数量</div>
                    </div>
                  </div>
                  <div class="tcol">样品描述</div>
                  <div class="tcol">客户确认状态</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in orderInfo.time_data[sampleOrderIndex].batch_data[0].product_data"
                  :key="index">
                  <!-- 判断样品信息是否完整 -->
                  <template v-if="item.category && item.color_data.length>0 && item.size_data.length>0">
                    <div class="tcol">
                      <span class="blue"
                        @click="sampleDetail=item;sampleShow = true"
                        style="cursor:pointer">{{item.product_code || item.system_code}}</span>
                      <span :class="{'gray':!item.name}">{{item.name||'无名称'}}</span>
                      <span class="gray">({{item.category}}/{{item.secondary_category}})</span>
                    </div>
                    <div class="tcol">
                      <div class="imageCtn">
                        <el-image style="width:100%;height:100%"
                          :src="item.image_data.length>0?item.image_data[0]:''"
                          :preview-src-list="item.image_data">
                          <div slot="error"
                            class="image-slot">
                            <i class="el-icon-picture-outline"
                              style="font-size:42px"></i>
                          </div>
                        </el-image>
                      </div>
                    </div>
                    <div class="tcol noPad"
                      style="flex:3">
                      <div class="trow"
                        v-for="(itemChild,indexChild) in item.product_info"
                        :key="indexChild">
                        <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                        <div class="tcol">{{itemChild.price}}{{orderInfo.settle_unit||'元'}}</div>
                        <div class="tcol">{{itemChild.number}}</div>
                        <div class="tcol">{{itemChild.sample_number||0}}/{{itemChild.keep_number||0}}</div>
                      </div>
                    </div>
                    <div class="tcol"
                      v-html="item.desc"></div>
                    <div class="tcol">
                      <span :class="item.status|productStatusClassFilter">{{item.status|productStatusFilter}}</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="tcol">
                      <span class="gray"
                        style="text-align:center">样品信息待补充</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 产前寄送样 -->
    <zh-order-send :editFlag="true"
      :time_id="orderInfo.time_data[orderTime-1].id"
      :data="orderInfo.time_data[orderTime-1].send_info"
      :show="sendFlag"
      @close="sendFlag=false"></zh-order-send>
    <!-- 不需要操作的产品详情 -->
    <product-detail :id="proId"
      :show="productShow"
      :noOpr="true"
      @close="productShow = false"></product-detail>
    <sample-detail :id="proId"
      :show="sampleShow"
      :noOpr="true"
      @close="sampleShow = false"></sample-detail>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { OrderInfo, OrderTime } from '@/types/order'
import { order } from '@/assets/js/api'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  props: {
    data: {
      required: false
    },
    // 用于标记打样次数
    sampleOrderIndex: {
      default: 0,
      type: Number,
      required: false
    },
    id: {
      type: [Number, String],
      required: false
    }
  },
  data(): {
    orderInfo: OrderDetail
    [propName: string]: any
  } {
    return {
      sendFlag: false,
      cardName: '基本信息',
      productList: [],
      proId: '',
      productShow: false,
      sampleShow: false,
      orderTime: 1,
      orderInfo: {
        id: null,
        client_id: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '', // 订单用无用字段
        settle_unit: '', // 订单用无用字段
        order_type: 1,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: '',
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
            is_send: 2,

            batch_data: [
              {
                id: '',
                batch_number: 1,
                batch_title: '',
                batch_type: '',
                delivery_time: '',
                is_urgent: 2,
                is_draft: 2,
                total_style: '',
                total_number: '',
                total_price: '',
                desc: '',
                product_data: [
                  {
                    image_data: [],
                    product_id: '',
                    size_color_list: [], // 用于下拉框选择尺码颜色
                    product_info: [
                      {
                        size_color: '', // 用于下拉框选择尺码颜色
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
      }
    }
  },
  watch: {
    data(newVal: OrderDetail) {
      this.orderInfo = newVal
      if (this.$route.query.sampleOrderIndex) {
        // 打样次数计算
        this.orderInfo.time_data.forEach((item, index) => {
          if (item.id === Number(this.$route.query.sampleOrderIndex)) {
            this.orderTime = index + 1
          }
        })
      }
      this.getProInfo()
    }
  },
  methods: {
    getProInfo() {
      if (this.orderInfo.order_type === 1) {
        this.orderInfo.time_data.forEach((itemTime) => {
          itemTime.batch_data.forEach((itemBatch) => {
            this.productList = this.productList.concat(itemBatch.product_data)
          })
        })
      } else {
        this.productList =
          this.orderInfo.time_data[this.orderTime - 1 || this.sampleOrderIndex || 0].batch_data[0].product_data
      }
    }
  },
  mounted() {
    if (this.id) {
      order
        .detail({
          id: this.id
        })
        .then((res) => {
          if (res.data.status) {
            this.orderInfo = res.data.data
            if (this.$route.query.sampleOrderIndex) {
              // 打样次数计算
              this.orderInfo.time_data.forEach((item, index) => {
                if (item.id === Number(this.$route.query.sampleOrderIndex)) {
                  this.orderTime = index + 1
                }
              })
            }
            this.getProInfo()
          }
        })
    }
  }
})
</script>

<style lang="less" scoped>
@import './orderDetail.less';
</style>
<style lang="less">
.orderDetail {
  .el-tabs__content {
    padding: 0 !important;
  }
}
</style>