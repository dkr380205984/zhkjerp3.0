<template>
  <div id="sampleOrderAgain"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">样单号：</div>
            <div class="text">{{sampleOrderInfo.code}}</div>
          </div>
          <div class="col">
            <div class="label">打样公司：</div>
            <div class="text">{{sampleOrderInfo.client_name}}</div>
          </div>
          <div class="col">
            <div class="label">联系人：</div>
            <div class="text">{{sampleOrderInfo.contacts_name}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">负责小组：</div>
            <div class="text">{{sampleOrderInfo.group_name}}</div>
          </div>
          <div class="col">
            <div class="label">备注信息：</div>
            <div class="text">{{sampleOrderInfo.desc}}</div>
          </div>
          <div class="col">
            <!-- 占位符 -->
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">修改样品</div>
      </div>
      <div class="notes">已确认的样品不会出现在表格中，表格中的样品被修改后需要重新填写工艺信息。</div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">样品编号</div>
            <div class="tcol">样品名称</div>
            <div class="tcol">样品图片</div>
            <div class="tcol">样品尺码</div>
            <div class="tcol">样品配色</div>
            <div class="tcol">修改状态</div>
            <div class="tcol">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in sampleList"
            :key="index">
            <div class="tcol">
              <span>{{item.product_code || item.system_code}}</span>
              <span class="gray">({{item.category}}/{{item.secondary_category}})</span>
            </div>
            <div class="tcol">{{item.name}}</div>
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
            <div class="tcol">{{item.size_data.map((item)=>item.name).join('/')}}</div>
            <div class="tcol">{{item.color_data.map((item)=>item.name).join('/')}}</div>
            <div class="tcol"
              :class="item.ifUpadate?'green':'orange'">{{item.if_update?'已修改':'待修改'}}</div>
            <div class="tcol oprCtn">
              <div class="opr hoverBlue"
                @click="getSampleDetail(item.product_id)">详情</div>
              <div class="opr hoverOrange"
                @click="getSampleUpdate(item.product_id)">新增修改意见</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">打样数量及交期</div>
      </div>
      <div class="editCtn">
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">样品编号</div>
              <div class="tcol noPad"
                style="flex:4">
                <div class="trow">
                  <div class="tcol">尺码颜色</div>
                  <div class="tcol">打样单价</div>
                  <div class="tcol">打样数量</div>
                  <div class="tcol">操作</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow"
              v-for="(item,index) in sampleOrderTime.batch_data[0].product_data"
              :key="index">
              <div class="tcol">
                <div class="elCtn">
                  <el-select v-model="item.product_id"
                    placeholder="选择样品"
                    @change="getColour($event,item)"
                    no-data-text="请先添加修改意见">
                    <el-option v-for="item in sampleUpdateList"
                      :key="item.product_id"
                      :value="item.product_id"
                      :label="item.system_code + '/' + item.name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="tcol noPad"
                style="flex:4">
                <div class="trow"
                  v-for="(itemChild,indexChild) in item.product_info"
                  :key="indexChild">
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select v-model="itemChild.size_color"
                        placeholder="尺码颜色"
                        no-data-text="请先选择产品">
                        <el-option v-for="item in item.size_color_list"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input v-model="itemChild.price"
                        placeholder="打样单价">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input v-model="itemChild.number"
                        placeholder="打样数量">
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol oprCtn">
                    <div class="opr hoverBlue"
                      @click="$addItem(item.product_info,{
                        size_color: [], // 用于下拉框选择尺码颜色
                        size_id: '',
                        color_id: '',
                        number: '',
                        price: ''
                      })">新增尺码</div>
                    <div class="opr hoverRed"
                      @click="item.product_info.length>1?$deleteItem(item.product_info,indexChild):$deleteItem(sampleOrderTime.batch_data[0].product_data,index)">删除</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="oprRow"
            style="margin-right:0">
            <div class="once"
              @click="$addItem(sampleOrderTime.batch_data[0].product_data, {
                product_id: '',
                size_color_list: [],
                product_info: [
                  {
                    size_color: [], 
                    size_id: '',
                    color_id: '',
                    number: '',
                    price: ''
                  }
                ]
              })">新增样品
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">计划完成时间</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-date-picker style="width:100%"
                placeholder="请选择计划完成时间"
                v-model="sampleOrderTime.complete_time"
                value-format="yyyy-MM-dd"></el-date-picker>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">
              <span class="text">是否加急打样</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-radio-group v-model="sampleOrderTime.is_urgent">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">样单类型</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择样单类型"
                v-model="sampleOrderTime.order_type_id">
                <el-option v-for="item in sampleOrderTypeList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">打样款数</span>
              <span class="explanation">(自动计算))</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入打样总数"
                v-model="totalStyle"
                disabled></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">打样总数</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入打样总数"
                v-model="totalNumber"
                disabled></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">打样总费用</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入打样总费用"
                v-model="totalPrice"
                disabled></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入备注信息"
                v-model="sampleOrderTime.batch_data[0].desc"></el-input>
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
          <div class="btn backHoverBlue"
            @click="saveSampleOrder">提交</div>
        </div>
      </div>
    </div>
    <sample-detail :id="sampleId"
      :show="sampleShow"
      :noOpr="true"
      @close="sampleShow = false"></sample-detail>
    <sample-edit :pid="sampleId"
      :id="sampleId"
      :ifIdea="true"
      :show="editSampleShow"
      @close="editSampleShow = false"
      @afterSave="getNewSample"></sample-edit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SampleInfo } from '@/types/sample'
import { SampleOrderInfo, SampleOrderTime } from '@/types/sampleOrder'
import { sampleOrder, sample } from '@/assets/js/api'
interface SampleInfoExtend extends SampleInfo {
  product_id: number
  if_update?: boolean
}
export default Vue.extend({
  data(): {
    sampleList: SampleInfoExtend[]
    sampleOrderTime: SampleOrderTime
    sampleOrderInfo: SampleOrderInfo
    [propName: string]: any
  } {
    return {
      loading: true,
      editSampleShow: false,
      sampleId: '',
      sampleShow: false,
      sampleUpdateList: [],
      sampleOrderInfo: {
        id: null,
        client_id: '',
        tree_data: [],
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '', // 订单用无用字段
        settle_unit: '', // 订单用无用字段
        order_type: 2,
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
                    size_data: [],
                    color_data: [],
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
      },
      sampleOrderTime: {
        order_id: '',
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
                status: 1,
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
      },
      sampleList: []
    }
  },
  computed: {
    token(): string {
      return this.$store.state.status.token
    },
    totalStyle(): number {
      return this.sampleOrderTime.batch_data[0].product_data.length
    },
    totalPrice(): number {
      return this.sampleOrderTime.batch_data[0].product_data.reduce((total, current) => {
        return (
          total +
          current.product_info.reduce((totalChild, itemChild) => {
            return totalChild + Number(itemChild.price) * Number(itemChild.number)
          }, 0)
        )
      }, 0)
    },
    totalNumber(): number {
      return this.sampleOrderTime.batch_data[0].product_data.reduce((total, current) => {
        return (
          total +
          current.product_info.reduce((totalChild, itemChild) => {
            return totalChild + Number(itemChild.number)
          }, 0)
        )
      }, 0)
    },
    sampleOrderTypeList(): any[] {
      return this.$store.state.api.sampleOrderType.arr
    }
  },
  methods: {
    getSampleDetail(id: number) {
      this.sampleShow = true
      this.sampleId = id
    },
    getSampleUpdate(id: number) {
      this.editSampleShow = true
      this.sampleId = id
    },
    getColour(ev: number, info: any) {
      info.size_color_list = []
      const product: SampleInfo = this.sampleList.find((item) => item.product_id === ev) as SampleInfo
      product.size_data.forEach((itemSize: any) => {
        product.color_data.forEach((itemColor: any) => {
          info.size_color_list.push({
            label: itemSize.name + '/' + itemColor.name,
            value: itemSize.id + '/' + itemColor.id
          })
        })
      })
      info.product_info = info.size_color_list.map((item: any) => {
        return {
          size_color: item.value,
          size_id: item.value.split('/')[0],
          color_id: item.value.split('/')[1],
          number: '',
          price: 0
        }
      })
    },
    // 样品修改保存后，把原先跟旧样品相关的信息替换成新的样品
    getNewSample(sample: SampleInfoExtend) {
      this.sampleOrderTime.batch_data[0].product_data.forEach((item) => {
        if (item.product_id === this.sampleId) {
          this.$message.warning('已经修改的样品信息已经被全部重置，请重新选择新的样品进行打样操作')
          item = {
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
        }
      })
      const index = this.sampleList.map((item) => item.product_id).indexOf(this.sampleId)
      sample.product_id = sample.id as number
      this.sampleList[index] = sample
      this.sampleList[index].if_update = true
      this.sampleUpdateList = this.sampleList.filter((item) => item.if_update)
      // 关闭修改窗口
      this.editSampleShow = false
    },
    // 把通过计算属性得到的价格以及通过级联选择器选到的id赋给表单数据
    getCmpData() {
      this.sampleOrderTime.order_time = this.$getDate(new Date())
      this.sampleOrderTime.order_id = Number(this.$route.query.id)
      this.sampleOrderTime.total_style = this.totalStyle
      this.sampleOrderTime.total_number = this.totalNumber
      this.sampleOrderTime.total_price = this.totalPrice
      this.sampleOrderTime.batch_data[0].product_data.forEach((item) => {
        item.pid_status = 3
        item.product_info.forEach((itemChild) => {
          itemChild.size_id = itemChild.size_color!.split('/')[0]
          itemChild.color_id = itemChild.size_color!.split('/')[1]
        })
      })
    },
    saveSampleOrder() {
      const formCheck =
        this.sampleList.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'if_update',
              errMsg: '请对客户确认修改样品进行修改或给出修改意见后提交'
            }
          ])
        }) ||
        this.$formCheck(this.sampleOrderTime, [
          {
            key: 'order_type_id',
            errMsg: '请选择样单类型'
          },
          {
            key: 'complete_time',
            errMsg: '请选择计划完成时间'
          }
        ]) ||
        this.sampleOrderTime.batch_data[0].product_data.some((item) => {
          return (
            this.$formCheck(item, [
              {
                key: 'product_id',
                errMsg: '请选择样品'
              }
            ]) ||
            item.product_info.some((itemChild) => {
              return this.$formCheck(itemChild, [
                {
                  key: 'size_color',
                  errMsg: '请选择尺码颜色'
                },
                // {
                //   key: 'price',
                //   errMsg: '请输入打样单价'
                // },
                {
                  key: 'number',
                  errMsg: '请输入打样数量'
                }
              ])
            })
          )
        })
      if (
        this.$ifRepeatArray(this.sampleOrderTime.batch_data[0].product_data.map((item) => item.product_id) as string[])
      ) {
        this.$message.error('相同样品请不要分多次添加')
        return false
      }
      if (!formCheck) {
        this.getCmpData()
        sampleOrder.again(this.sampleOrderTime).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
            this.$router.push('/sampleOrder/detail?id=' + this.$route.query.id)
          }
        })
      }
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'api/sampleOrderType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getSampleOrderTypeAsync'
      }
    ])
    Promise.all([
      sampleOrder.detail({
        id: Number(this.$route.query.id)
      }),
      sampleOrder.confirmList({
        order_id: Number(this.$route.query.id),
        status: [6]
      })
    ]).then((res) => {
      this.sampleOrderInfo = res[0].data.data
      this.sampleList = res[1].data.data as SampleInfoExtend[]
      this.loading = false
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/sampleOrder/again.less';
</style>