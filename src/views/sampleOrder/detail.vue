<template>
  <div id="sampleOrderDetail"
    class="bodyContainer">
    <div class="module">
      <el-tabs type="border-card"
        v-model="sampleOrderIndex">
        <el-tab-pane v-for="(item,index) in sampleOrderInfo.time_data"
          :key="item.id"
          :label="'第'+(index+1)+'次打样'"
          :name="index.toString()">
          <div class="titleCtn">
            <div class="title">样单信息</div>
          </div>
          <div class="detailCtn">
            <div class="row">
              <div class="col">
                <div class="label">样单号：</div>
                <div class="text">{{sampleOrderInfo.code}}</div>
              </div>
              <div class="col">
                <div class="label">样单类型：</div>
                <div class="text">{{sampleOrderInfo.time_data[sampleOrderIndex].order_type}}</div>
              </div>
              <div class="col">
                <div class="label">下单时间：</div>
                <div class="text">{{sampleOrderInfo.time_data[sampleOrderIndex].order_time}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">打样公司：</div>
                <div class="text">{{sampleOrderInfo.client_name}}</div>
              </div>
              <div class="col">
                <div class="label">公司联系人：</div>
                <div class="text">{{sampleOrderInfo.contacts_name}}</div>
              </div>
              <div class="col">
                <div class="label">负责组/人：</div>
                <div class="text">{{sampleOrderInfo.group_name}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">创建人：</div>
                <div class="text">{{sampleOrderInfo.group_name}}</div>
              </div>
              <div class="col">
                <div class="label">创建时间：</div>
                <div class="text">ABC</div>
              </div>
              <div class="col">
                <div class="label">样单状态：</div>
                <div class="text">ABC</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">打样款数：</div>
                <div class="text">{{sampleOrderInfo.time_data[sampleOrderIndex].total_style}}款</div>
              </div>
              <div class="col">
                <div class="label">打样总数：</div>
                <div class="text">{{sampleOrderInfo.time_data[sampleOrderIndex].total_number}}</div>
              </div>
              <div class="col">
                <div class="label">打样总额：</div>
                <div class="text">{{sampleOrderInfo.time_data[sampleOrderIndex].total_price}}元</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">完成时间：</div>
                <div class="text">ABC</div>
              </div>
              <div class="col">
                <div class="label">是否加急：</div>
                <div class="text">ABC</div>
              </div>
              <div class="col">
                <div class="label">打样次数：</div>
                <div class="text">{{sampleOrderInfo.time_data.length}}次</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">公开文件：</div>
                <div class="text">ABC</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text">{{sampleOrderInfo.desc}}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">样品信息</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">样品编号</div>
            <div class="tcol">样品名称</div>
            <div class="tcol">样品图片</div>
            <div class="tcol noPad"
              style="flex:3">
              <div class="trow">
                <div class="tcol">尺码颜色</div>
                <div class="tcol">打样单价</div>
                <div class="tcol">打样数量</div>
              </div>
            </div>
            <div class="tcol">样品单据状态</div>
            <div class="tcol">样品描述</div>
            <div class="tcol">修改意见</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in sampleOrderInfo.time_data[sampleOrderIndex].batch_data[0].product_data"
            :key="index">
            <div class="tcol">
              <span>{{item.product_code||'无编号'}}</span>
              <span class="gray">({{item.category}}/{{item.type}})</span>
            </div>
            <div class="tcol">{{item.product_name}}</div>
            <div class="tcol">
              <div class="imageCtn">
                <!-- <el-image style="width:100%;height:100%"
                  :src="item.image_data.length>0?item.image_data[0].image_url:''"
                  :preview-src-list="item.image_data.map((item)=>item.image_url)">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"
                      style="font-size:42px"></i>
                  </div>
                </el-image> -->
              </div>
            </div>
            <div class="tcol noPad"
              style="flex:3">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.product_info"
                :key="indexChild">
                <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                <div class="tcol">{{itemChild.price}}元</div>
                <div class="tcol">{{itemChild.number}}</div>
              </div>
            </div>
            <div class="tcol stateCtn">
              <div class="state"
                @click="$router.push('/craft/create?id=' + item.product_id)">
                <div class="circle backGray"></div>
                <div class="text gray">工艺单</div>
              </div>
              <div class="state"
                @click="$router.push('/ingredient/create?id=' + item.product_id)">
                <div class="circle backBlue"></div>
                <div class="text blue">配料单</div>
              </div>
            </div>
            <div class="tcol">样品描述</div>
            <div class="tcol">修改意见</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">流程进度</div>
      </div>
      <div class="normalCtn">
        <div class="processCtn">
          <div class="label"></div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="buttonList"
            style="margin-left:12px">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">样单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">修改样单</span>
                </div>
                <div class="btn backHoverOrange">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">审核样单</span>
                </div>
                <div class="btn backHoverRed">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">删除样单</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$router.push('/sampleOrder/again?id='+$route.query.id + '&sampleOrderIndex=' + sampleOrderIndex)">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">继续打样</span>
                </div>
                <div class="btn backHoverBlue">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">打印样单</span>
                </div>
                <div class="btn backHoverBlue">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">邮件分享</span>
                </div>
                <div class="btn backHoverGreen">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">生成订单</span>
                </div>
                <div class="btn backHoverBlue">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">操作记录</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SampleOrderInfo, SampleOrderTime } from '@/types/sampleOrder'
import { sampleOrder } from '@/assets/js/api'
interface SampleOrderDetail extends SampleOrderInfo {
  time_data: SampleOrderTime[]
}
export default Vue.extend({
  data(): {
    sampleOrderInfo: SampleOrderDetail
    [propName: string]: any
  } {
    return {
      sampleOrderIndex: '0', // el-tab组件需要string数据
      sampleOrderInfo: {
        id: null,
        client_id: '',
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
  mounted() {
    sampleOrder
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        console.log(res)
        this.sampleOrderInfo = res.data.data
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/sampleOrder/detail.less';
</style>