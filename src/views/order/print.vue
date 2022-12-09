<template>
  <div class="printContainer"
    id="orderPrint"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <div class="pmain"
      v-for="(itemPro,index) in productArr"
      :key="index">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">{{title?title:company_name+'生产布置单'}}</div>
          <div class="prow">
            <div class="pcol">
              <div class="label">系统订单编号：</div>
              <div class="info">{{ orderInfo.system_code }}</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol">
              <div class="label">订单创建信息：</div>
              <div class="info">{{ orderInfo.created_at.slice(0, 10) }}{{orderInfo.user_name?'，' + orderInfo.user_name:''}}{{orderInfo.user_phone?'，' + orderInfo.user_phone:''}}</div>
            </div>
          </div>
        </div>
        <div class="fr">
          <div class="pImage">
            <img :src="qrCodePCUrl"
              alt="" />
            <span class="imgText">扫一扫打开电脑端系统</span>
          </div>
          <div class="pImage">
            <img :src="qrCodeWXUrl"
              alt="" />
            <span class="imgText">使用织为云工厂小程序扫一扫</span>
          </div>
        </div>
      </div>
      <div class="pbody">
        <div class="tableCtn">
          <div class="tbody hasTop">
            <div class="trow">
              <div class="tcol bgGray headTitle">订单号</div>
              <div class="tcol">{{orderInfo.code || '暂无' }}</div>
              <div class="tcol bgGray headTitle">下单客户</div>
              <div class="tcol">{{orderInfo.client_name}}</div>
              <div class="tcol bgGray headTitle">下单日期</div>
              <div class="tcol">{{orderInfo.created_at}}</div>
              <div class="tcol bgGray headTitle"
                v-if="showOrderPrice==='1'">下单币种</div>
              <div class="tcol"
                v-if="showOrderPrice==='1'">{{orderInfo.settle_unit}}</div>
            </div>
            <div class="trow">
              <div class="tcol bgGray headTitle">负责人/组</div>
              <div class="tcol">{{orderInfo.group_name || '暂无' }}</div>
              <div class="tcol bgGray headTitle">客户联系人</div>
              <div class="tcol">{{orderInfo.contacts_name || '暂无'}}</div>
              <div class="tcol bgGray headTitle">下单款数</div>
              <div class="tcol">{{orderInfo.time_data[0].total_style}}款</div>
              <div class="tcol bgGray headTitle"
                v-if="showOrderPrice==='1'">币种汇率</div>
              <div class="tcol"
                v-if="showOrderPrice==='1'">{{orderInfo.settle_tax}}</div>
            </div>
            <div class="trow">
              <div class="tcol bgGray headTitle">是否加急</div>
              <div class="tcol">{{orderInfo.time_data[0].is_urgent===1?'【加急订单】':'否'}}</div>
              <div class="tcol bgGray headTitle">审核状态</div>
              <div class="tcol">{{orderInfo.time_data[0].is_check|checkFilterSelf}}</div>
              <div class="tcol bgGray headTitle">下单总数</div>
              <div class="tcol">{{$toFixed(orderInfo.time_data[0].total_number,0,true)}}</div>
              <div class="tcol bgGray headTitle"
                v-if="showOrderPrice==='1'">下单总额</div>
              <div class="tcol"
                v-if="showOrderPrice==='1'">
                <span>{{$toFixed(orderInfo.time_data[0].total_price,3,true)}}{{orderInfo.settle_unit}}</span>
              </div>
            </div>
            <div class="trow">
              <div class="tcol bgGray headTitle"
                style="max-width:101.6px">备注信息</div>
              <div class="tcol"
                v-html="orderInfo.desc"></div>
            </div>
          </div>
        </div>
        <div class="tableCtn">
          <div class="tbody hasTop">
            <div class="trow">
              <div class="tcol bgGray headTitle">产品编号</div>
              <div class="tcol">{{itemPro.system_code || '暂无' }}</div>
              <div class="tcol bgGray headTitle">客户款号</div>
              <div class="tcol">{{itemPro.style_code || '暂无' }}</div>
              <div class="tcol bgGray headTitle">产品名称</div>
              <div class="tcol">{{itemPro.name || '暂无' }}</div>
              <div class="tcol bgGray headTitle">产品品类</div>
              <div class="tcol">{{itemPro.category}}/{{itemPro.secondary_category}}</div>
            </div>
            <div class="trow">
              <div class="tcol bgGray headTitle"
                style="max-width:101.6px">部位</div>
              <div class="tcol"
                style="max-width:101.6px">
                大身
              </div>
              <div class="tcol bgGray headTitle"
                style="max-width:101.6px">成分比例</div>
              <div class="tcol">{{itemPro.component_data.map((item)=>item.name+item.number+'%').join(',')}}</div>
            </div>
            <div class="trow">
              <div class="tcol bgGray headTitle">尺码/配色</div>
              <div class="tcol bgGray headTitle">克重</div>
              <div class="tcol bgGray headTitle">尺寸描述</div>
              <div class="tcol bgGray headTitle"
                v-if="showOrderPrice==='1'">下单单价</div>
              <div class="tcol bgGray headTitle">总下单数量</div>
            </div>
            <div class="trow"
              v-for="itemChild,indexChild in itemPro.childrenMergeInfo"
              :key="indexChild">
              <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
              <div class="tcol">{{itemChild.weight}}g</div>
              <div class="tcol">{{itemChild.size_info}}</div>
              <div class="tcol"
                v-if="showOrderPrice==='1'">{{itemChild.price}}元</div>
              <div class="tcol">{{itemChild.order_number}}</div>
            </div>
            <template v-for="itemPart in itemPro.part_data">
              <div class="trow"
                :key="itemPart.id"
                v-if="showOrderPeijian==='1'">
                <div class="tcol bgGray headTitle"
                  style="max-width:101.6px">部位</div>
                <div class="tcol"
                  style="max-width:101.6px">
                  {{itemPart.name}}
                </div>
                <div class="tcol bgGray headTitle"
                  style="max-width:101.6px">成分比例</div>
                <div class="tcol">{{itemPart.part_component_data.map((item)=>item.name+item.number+'%').join(',')}}</div>
              </div>
              <div class="trow"
                :key="itemPart.id + 'part'">
                <div class="tcol bgGray headTitle">尺码</div>
                <div class="tcol bgGray headTitle">克重</div>
                <div class="tcol bgGray headTitle">尺寸描述</div>
              </div>
              <div class="trow"
                v-for="itemChild,indexChild in itemPart.part_size_data"
                :key="'partSize'+indexChild">
                <div class="tcol">{{itemChild.name}}</div>
                <div class="tcol">{{itemChild.weight}}g</div>
                <div class="tcol">{{itemChild.size_info}}</div>
              </div>
            </template>
            <div class="trow">
              <div class="tcol bgGray headTitle">产品描述</div>
            </div>
            <div class="trow">
              <div class="tcol"
                v-html="itemPro.desc"></div>
            </div>
          </div>
        </div>
        <div class="tableCtn"
          v-if="showOrderBatch==='1'">
          <div class="tbody hasTop">
            <div class="trow">
              <div class="tcol bgGray headTitle">序号</div>
              <div class="tcol bgGray headTitle">发货时间</div>
              <div class="tcol bgGray headTitle">批次名称</div>
              <div class="tcol bgGray headTitle">批次类型</div>
              <div class="tcol bgGray headTitle">批次备注</div>
              <div class="tcol bgGray headTitle">尺码颜色</div>
              <div class="tcol bgGray headTitle">发货数量</div>
            </div>
            <template v-for="item,index in itemPro.childrenMergeInfo">
              <div class="trow"
                v-for="itemChild,indexChild in item.childrenMergeInfo"
                :key="indexChild">
                <div class="tcol">
                  {{cmpIndex(itemPro,index,indexChild)}}
                </div>
                <div class="tcol">{{itemChild.delivery_time}}</div>
                <div class="tcol">{{itemChild.batch_title}}</div>
                <div class="tcol">{{itemChild.batch_type_name}}</div>
                <div class="tcol">{{itemChild.batch_des}}</div>
                <div class="tcol">{{item.size_name}}/{{item.color_name}}</div>
                <div class="tcol">{{itemChild.number}}</div>
              </div>
            </template>
          </div>
        </div>
        <template v-if="showOrderImage==='1'">
          <div class="tableCtn">
            <div class="tbody hasTop">
              <div class="trow"
                v-if="itemPro.image_data.length>3">
                <div class="tcol imageFather">
                  <span style="
                  position: absolute;
                  right: 15px;
                  top: 0;
                  bottom: 0;
                  float: right;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="itemPro.imageIndex1 = itemPro.imageIndex1===itemPro.image_data.length-1?0:itemPro.imageIndex1+1">下一张</span>
                  <span style="
                  position: absolute;
                  left: 15px;
                  top: 0;
                  bottom: 0;
                  float: right;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="itemPro.imageIndex1 = itemPro.imageIndex1===0?itemPro.image_data.length-1:itemPro.imageIndex1-1">上一张</span>
                  <el-image style="width:100%;height:100%"
                    :src="itemPro.image_data.length>0?itemPro.image_data[itemPro.imageIndex1]:''">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
                <div class="tcol imageFather">
                  <span style="
                  position: absolute;
                  right: 15px;
                  top: 0;
                  bottom: 0;
                  float: right;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="itemPro.imageIndex2 = itemPro.imageIndex2===itemPro.image_data.length-1?0:itemPro.imageIndex2+1">下一张</span>
                  <span style="
                  position: absolute;
                  left: 15px;
                  top: 0;
                  bottom: 0;
                  float: right;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="itemPro.imageIndex2 = itemPro.imageIndex2===0?itemPro.image_data.length-1:itemPro.imageIndex2-1">上一张</span>
                  <el-image style="width:100%;height:100%"
                    :src="itemPro.image_data.length>0?itemPro.image_data[itemPro.imageIndex2]:''">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
                <div class="tcol imageFather">
                  <span style="
                  position: absolute;
                  right: 15px;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="itemPro.imageIndex3 = itemPro.imageIndex3===itemPro.image_data.length-1?0:itemPro.imageIndex3+1">下一张</span>
                  <span style="
                  position: absolute;
                  left: 15px;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  z-index: 1;
                  background: #ccc;"
                    class="hoverBlue"
                    @click="itemPro.imageIndex3 = itemPro.imageIndex3===0?itemPro.image_data.length-1:itemPro.imageIndex3-1">上一张</span>
                  <el-image style="width:100%;height:100%"
                    :src="itemPro.image_data.length>0?itemPro.image_data[itemPro.imageIndex3]:''">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
              </div>
              <div class="trow">
                <div class="tcol imageFather"
                  v-for="indexImage in 3"
                  :key="indexImage">
                  <el-image style="width:100%;height:100%"
                    :src="itemPro.image_data[indexImage-1]">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <template v-if="showOrderImage==='2'">
        <div style="page-break-after: always;">
          <div class="imageFather"
            style="display:flex;justify-content: center;position:relative"
            v-for="itemPic,indexPic in itemPro.image_data"
            :key="indexPic">
            <img style="max-height:1490px;max-width:982px;"
              :src="itemPic" />
            <span class="hoverBlue"
              style=" 
                  position: absolute;
                  left: 0;
                  right:0;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  cursor: pointer;
                  line-height: 32px;
                  height: 32px;
                  width:4em;
                  z-index: 1;
                  background: #ccc;"
              @click="deleteImage(itemPro,indexPic)">隐藏图片</span>
          </div>
        </div>
      </template>
    </div>

    <div class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop>
      <div class="setting_item"
        @click="windowMethod(1)">刷新页面</div>
      <div class="setting_item blue"
        @click="windowMethod(2)">打印</div>
      <div class="setting_item"
        @click="windowMethod(3)">{{showOrderPrice==='1'?'隐藏财务信息':'显示财务信息'}}</div>
      <div class="setting_item"
        @click="windowMethod(4)">{{showOrderBatch==='1'?'隐藏发货批次':'显示发货批次'}}</div>
      <div class="setting_item"
        @click="windowMethod(5)">{{showOrderPeijian==='1'?'隐藏配件信息':'显示配件信息'}}</div>
      <div class="setting_item"
        @click="windowMethod(6)">{{showOrderImage==='1'?'图片单独打印':'图片不单独打印'}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { order } from '@/assets/js/api'
import { OrderInfo, OrderProductFlatten, OrderProductMerge, OrderTime } from '@/types/order'
import Vue from 'vue'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
interface OrderProductFlattenWithBatch {
  batch_title: string
  batch_number: number
  batch_des: string
  batch_type_name?: string
  delivery_time: string
  component_data?: any[]
  weight?: string
  size_info?: string
  style_code?: string
  desc?: string
}
export default Vue.extend({
  data(): {
    orderInfo: OrderDetail
    [propName: string]: any
  } {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      title: '',
      showMenu: false,
      X_position: 0,
      Y_position: 0,
      qrCodePCUrl: '',
      qrCodeWXUrl: '',
      orderIndex: 0,
      productArr: [],
      showOrderPrice: this.$getLocalStorage('showOrderPrice') || '1',
      showOrderBatch: this.$getLocalStorage('showOrderBatch') || '1',
      showOrderPeijian: this.$getLocalStorage('showOrderPeijian') || '1',
      showOrderImage: this.$getLocalStorage('showOrderImage') || '1',
      orderInfo: {
        created_at: '',
        user_phone: '',
        user_name: '',
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
            send_info: {
              other_desc: '',
              info: [
                {
                  order_type: '',
                  send_time: '',
                  number: ''
                }
              ]
            },
            id: '',
            order_time: '',
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
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
  filters: {
    checkFilterSelf(val: number) {
      const arr = ['待审核', '已通过', '已驳回', '异常', '异常']
      return arr[val]
    }
  },
  methods: {
    windowMethod(type: number) {
      this.showPrintSetting = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          this.showMenu = false
          setTimeout(() => {
            window.print()
          }, 100)
        } else if (type === 3) {
          this.showMenu = false
          this.showOrderPrice = this.showOrderPrice === '1' ? '2' : '1'
          this.$setLocalStorage('showOrderPrice', this.showOrderPrice)
        } else if (type === 4) {
          this.showMenu = false
          this.showOrderBatch = this.showOrderBatch === '1' ? '2' : '1'
          this.$setLocalStorage('showOrderBatch', this.showOrderBatch)
        } else if (type === 5) {
          this.showMenu = false
          this.showOrderPeijian = this.showOrderPeijian === '1' ? '2' : '1'
          this.$setLocalStorage('showOrderPeijian', this.showOrderPeijian)
        } else if (type === 6) {
          this.showMenu = false
          this.showOrderImage = this.showOrderImage === '1' ? '2' : '1'
          this.$setLocalStorage('showOrderImage', this.showOrderImage)
        }
      })
    },
    cmpIndex(itemPro: any, index: any, indexChild: any) {
      return index === 0
        ? indexChild + 1
        : indexChild +
            1 +
            itemPro.childrenMergeInfo.reduce((total: any, cur: any, indexAdd: any) => {
              return total + (indexAdd < index ? cur.childrenMergeInfo.length : 0)
            }, 0)
    },
    handleClickRight(e: any, type = true) {
      this.showMenu = type
      this.X_position = e.clientX
      this.Y_position = e.clientY
      e.preventDefault()
      e.stopPropagation()
    },
    // 从订单里面拿到产品信息
    getOrderProduct(orderInfo: OrderDetail): OrderProductMerge[] {
      const flattenArr: OrderProductFlattenWithBatch[] = [] // 存储return信息
      orderInfo.time_data[this.orderIndex].batch_data.forEach((itemBatch) => {
        itemBatch.product_data.forEach((itemPro) => {
          itemPro.product_info.forEach((itemChild) =>
            flattenArr.push({
              batch_number: itemBatch.batch_number,
              batch_title: itemBatch.batch_title,
              batch_type_name: itemBatch.batch_type_name,
              delivery_time: itemBatch.delivery_time,
              batch_des: itemBatch.desc,
              component_data: itemPro.component_data,
              // @ts-ignore
              material_info: itemChild.material_info || [],
              quote_product_id: itemPro.quote_product_id,
              quote_rel_product_info: itemPro.quote_rel_product_info,
              color_id: itemChild.color_id,
              color_name: itemChild.color_name,
              size_id: itemChild.size_id,
              size_name: itemChild.size_name,
              order_number: itemChild.number,
              price: itemChild.price,
              product_code: itemPro.product_code,
              system_code: itemPro.system_code,
              // @ts-ignore
              style_code: itemPro.style_code,
              name: itemPro.name,
              product_id: itemPro.product_id as number,
              category: itemPro.category,
              secondary_category: itemPro.secondary_category,
              process_data: itemPro.process_data,
              plan_number: itemChild.plan_number,
              number: itemChild.number,
              weight: itemChild.weight,
              size_info: itemChild.size_info,
              image_data: itemPro.image_data,
              part_data: itemPro.part_data,
              desc: itemPro.desc,
              imageIndex1: 0,
              imageIndex2: 0,
              imageIndex3: 0
            })
          )
        })
      })
      const mergeArr: OrderProductMerge[] = this.$mergeData(flattenArr, {
        mainRule: 'product_id',
        otherRule: [
          { name: 'name' },
          { name: 'system_code' },
          { name: 'secondary_category' },
          { name: 'category' },
          { name: 'product_code' },
          { name: 'part_data' },
          { name: 'process_data' },
          { name: 'quote_product_id' },
          { name: 'quote_rel_product_info' },
          { name: 'component_data' },
          { name: 'image_data' },
          { name: 'style_code' },
          { name: 'desc' },
          { name: 'imageIndex1' },
          { name: 'imageIndex2' },
          { name: 'imageIndex3' }
        ],
        childrenRule: {
          mainRule: ['color_id', 'size_id'],
          otherRule: [
            { name: 'size_name' },
            { name: 'color_name' },
            { name: 'order_number', type: 'add' },
            { name: 'plan_number', type: 'add' },
            { name: 'price' },
            { name: 'material_info' },
            { name: 'weight' },
            { name: 'size_info' }
          ]
        }
      })
      return mergeArr
    },
    deleteImage(pro: any, index: number) {
      this.$confirm('是否隐藏该图片?隐藏后需要刷新页面才能重新显示图片', '提示', {
        confirmButtonText: '确认隐藏',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          pro.image_data.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  },
  mounted() {
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          this.productArr = this.getOrderProduct(this.orderInfo)
          // 生成二维码
          const QRCode = require('qrcode')
          QRCode.toDataURL(`/order/detail?id=${this.orderInfo.id}`)
            .then((url: any) => {
              this.qrCodePCUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
          QRCode.toDataURL(`/pages/order/detail?id=${this.orderInfo.id}`)
            .then((url: any) => {
              this.qrCodeWXUrl = url
            })
            .catch((err: any) => {
              console.error(err)
            })
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/order/print.less';
</style>