<template>
  <div id="quotedPriceDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item"
            effect="dark"
            content="点击查看审核日志"
            placement="bottom">
            <img :src="quotedPriceInfo.is_check|checkFilter" />
          </el-tooltip>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">报价单号：</div>
            <div class="text blue">{{quotedPriceInfo.code}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">报价标题：</div>
            <div class="text">{{quotedPriceInfo.title}}</div>
          </div>
          <div class="col">
            <div class="label">报价公司：</div>
            <div class="text">{{quotedPriceInfo.client_name}}</div>
          </div>
          <div class="col">
            <div class="label">公司联系人：</div>
            <div class="text">{{quotedPriceInfo.contacts_name}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">负责组/人：</div>
            <div class="text">{{quotedPriceInfo.group_name}}</div>
          </div>
          <div class="col">
            <div class="label">结算单位：</div>
            <div class="text">{{quotedPriceInfo.settle_unit}}</div>
          </div>
          <div class="col">
            <div class="label">结算汇率：</div>
            <div class="text">{{quotedPriceInfo.exchange_rate}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">创建人：</div>
            <div class="text">{{quotedPriceInfo.user_name}}</div>
          </div>
          <div class="col">
            <div class="label">更新时间：</div>
            <div class="text">{{quotedPriceInfo.created_at.slice(0,10)}}</div>
          </div>
          <div class="col">
            <div class="label">审核状态：</div>
            <div class="text">暂无字段</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">系统报价：</div>
            <div class="text">{{quotedPriceInfo.system_total_price}}元</div>
          </div>
          <div class="col">
            <div class="label">实际报价：</div>
            <div class="text">{{quotedPriceInfo.total_cost_price}}元</div>
          </div>
          <div class="col">
            <div class="label">客户报价：</div>
            <div class="text">{{quotedPriceInfo.real_quote_price}}元</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注信息：</div>
            <div class="text">{{quotedPriceInfo.desc}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">产品描述</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">产品品类</div>
            <div class="tcol">产品图片</div>
            <div class="tcol">客户目标价格</div>
            <div class="tcol">客户最低起订量</div>
            <div class="tcol">产品描述/客户要求</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="item in quotedPriceInfo.product_data"
            :key="item.id">
            <div class="tcol">{{item.category_name}}/{{item.type_name}}</div>
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
            <div class="tcol">{{item.client_target_price}}元</div>
            <div class="tcol">{{item.start_order_number}}</div>
            <div class="tcol">{{item.desc}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <el-tabs type="border-card">
        <el-tab-pane :label="'产品'+(index+1)"
          v-for="(item,index) in quotedPriceInfo.product_data"
          :key="item.id">
          <div class="listCtn">
            <div class="list">
              <div class="row title">
                <div class="col">物料名称
                  <el-tooltip class="item"
                    effect="dark"
                    content="物料包含原料、辅料"
                    placement="top">
                    <i class="el-icon-question gray"
                      style="margin-left:4px"></i>
                  </el-tooltip>
                </div>
                <div class="col">预计数量</div>
                <div class="col">预计损耗</div>
                <div class="col">单价</div>
                <div class="col">总价</div>
              </div>
              <div class="row"
                v-for="(itemYarn,indexYarn) in item.material_data"
                :key="'Yarn' + indexYarn">
                <div class="col">
                  <div class="circle backHoverOrange">原</div>{{itemYarn.material_name}}
                </div>
                <div class="col">{{itemYarn.weight}}{{itemYarn.unit}}</div>
                <div class="col">{{itemYarn.loss}}%</div>
                <div class="col">{{itemYarn.price}}元</div>
                <div class="col">{{itemYarn.total_price}}元</div>
              </div>
              <div class="row"
                v-for="(itemDecorateMaterial,indexDecorateMaterial) in item.assist_material_data"
                :key="'DecorateMaterial' + indexDecorateMaterial">
                <div class="col">
                  <div class="circle backHoverGreen">辅</div>{{itemDecorateMaterial.material_name}}
                </div>
                <div class="col">{{itemDecorateMaterial.number}}{{itemDecorateMaterial.unit}}</div>
                <div class="col">{{itemDecorateMaterial.loss}}%</div>
                <div class="col">{{itemDecorateMaterial.price}}元</div>
                <div class="col">{{itemDecorateMaterial.total_price}}元</div>
              </div>
              <div class="row title">
                <div class="col">费用名称
                  <el-tooltip class="item"
                    effect="dark"
                    content="织：产品织造；半：半成品加工；成：成品加工；包：包装辅料；其：其他费用；运：运输费用。"
                    placement="top">
                    <i class="el-icon-question gray"
                      style="margin-left:4px"></i>
                  </el-tooltip>
                </div>
                <div class="col">费用说明</div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">总价</div>
              </div>
              <div class="row"
                v-for="(itemWeave,indexWeave) in item.weave_data"
                :key="'Weave'+indexWeave">
                <div class="col">
                  <div class="circle backHoverBlue">织</div>{{itemWeave.name}}
                </div>
                <div class="col">{{itemWeave.desc}}</div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">{{itemWeave.total_price}}元</div>
              </div>
              <div class="row"
                v-for="(itemHalfProcess,indexHalfProcess) in item.semi_product_data"
                :key="'HalfProcess' + indexHalfProcess">
                <div class="col">
                  <div class="circle backHoverBlue">半</div>{{itemHalfProcess.process_name}}
                </div>
                <div class="col">{{itemHalfProcess.desc}}</div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">{{itemHalfProcess.total_price}}元</div>
              </div>
              <div class="row"
                v-for="(itemFinishedProcess,indexFinishedProcess) in item.production_data"
                :key="'FinishedProcess' + indexFinishedProcess">
                <div class="col">
                  <div class="circle backHoverBlue">成</div>{{itemFinishedProcess.name}}
                </div>
                <div class="col">{{itemFinishedProcess.desc}}</div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">{{itemFinishedProcess.total_price}}元</div>
              </div>
              <div class="row"
                v-for="(itemPackMaterial,indexPackMaterial) in item.pack_material_data"
                :key="'PackMaterial' + indexPackMaterial">
                <div class="col">
                  <div class="circle backHoverBlue">包</div>{{itemPackMaterial.material_name}}
                </div>
                <div class="col">{{itemPackMaterial.desc}}</div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">{{itemPackMaterial.total_price}}元</div>
              </div>
              <div class="row"
                v-for="(itemOther,indexOther) in item.other_fee_data"
                :key="'Other' + indexOther">
                <div class="col">
                  <div class="circle backHoverBlue">其</div>{{itemOther.name}}
                </div>
                <div class="col">{{itemOther.desc}}</div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">{{itemOther.total_price}}元</div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="circle backHoverBlue">运</div>运输费用
                </div>
                <div class="col">{{item.transport_fee_desc}}</div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col">{{item.transport_fee}}元</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">订单费用</div>
      </div>
      <div class="listCtn">
        <div class="list">
          <div class="row title">
            <div class="col">费用名称</div>
            <div class="col">费用占比</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col">合计费用</div>
          </div>
          <div class="row">
            <div class="col">客户佣金</div>
            <div class="col">{{quotedPriceInfo.commission_percentage}}%</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col">{{quotedPriceInfo.commission_price}}元</div>
          </div>
          <div class="row">
            <div class="col">预计税率</div>
            <div class="col">{{quotedPriceInfo.rate_taxation}}%</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col">{{quotedPriceInfo.rate_price}}元</div>
          </div>
          <div class="row">
            <div class="col">预计利润</div>
            <div class="col">{{quotedPriceInfo.profit_percentage}}%</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col">{{quotedPriceInfo.profit_price}}元</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="fl"
          style="line-height:56px">
          合计：<span class="blue">0元</span>
        </div>
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="buttonList"
            style="margin-left:12px">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">报价单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange"
                  @click="$router.push('/quotedPrice/update?id='+$route.query.id)">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">修改报价</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="checkFlag=true">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">审核报价</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteQuotedPrice">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">删除报价</span>
                </div>
                <div class="btn backHoverBlue">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">打印报价</span>
                </div>
                <div class="btn backHoverGreen"
                  @click="$router.push('/sampleOrder/create?quotedPriceId='+ $route.query.id)">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">生成样单</span>
                </div>
                <div class="btn backHoverGreen"
                  @click="$router.push('/order/create?quotedPriceId='+ $route.query.id)">
                  <i class="iconfont">&#xe63b;</i>
                  <span class="text">生成订单</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <zh-check @close="checkFlag=false"
      :show="checkFlag"
      :pid="$route.query.id"
      :check_type="5"
      :reason="['驳回理由1','驳回理由2','驳回理由3','驳回理由4','驳回理由5']"></zh-check>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import { quotedPrice } from '@/assets/js/api'
import zhCheck from '@/components/zhCheck/zhCheck.vue'
export default Vue.extend({
  components: { zhCheck },
  data(): {
    [propName: string]: any
    quotedPriceInfo: QuotedPriceInfo
  } {
    return {
      loading: true,
      checkFlag: false,
      quotedPriceInfo: {
        id: null,
        is_draft: 1,
        title: '',
        client_id: '',
        tree_data: '',
        client_name: '',
        contacts_id: '',
        contacts_name: '',
        group_id: '',
        group_name: '',
        settle_unit: '元',
        exchange_rate: '',
        total_number: '',
        total_cost_price: '',
        commission_percentage: '',
        commission_price: '',
        rate_taxation: '',
        rate_price: '',
        profit_percentage: '',
        profit_price: '',
        desc: '',
        real_quote_price: '',
        system_total_price: 0,
        created_at: '',
        product_data: [
          {
            total_price: '',
            product_id: '',
            type: [],
            category_id: '',
            type_id: '',
            image_data: [],
            client_target_price: '',
            start_order_number: '',
            desc: '',
            transport_fee_desc: '',
            transport_fee: '',
            material_data: [
              {
                material_name: '',
                weight: '',
                loss: '',
                price: '',
                total_price: '',
                unit: 'kg'
              }
            ],
            assist_material_data: [
              {
                material_name: '',
                number: '',
                loss: '',
                price: '',
                total_price: '',
                unit: ''
              }
            ],
            weave_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            semi_product_data: [
              {
                process_name: '',
                desc: '',
                total_price: ''
              }
            ],
            production_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            pack_material_data: [
              {
                material_name: '',
                desc: '',
                total_price: ''
              }
            ],
            other_fee_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    deleteQuotedPrice() {
      this.$confirm('是否删除报价单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          quotedPrice
            .delete({
              id: Number(this.$route.query.id)
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$router.push('/quotedPrice/list?page=1&keyword=&client_id=&user_id=&status=0&date=')
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  mounted() {
    quotedPrice
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.quotedPriceInfo = res.data.data
        this.loading = false
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/quotedPrice/detail.less';
</style>
<style lang="less">
#quotedPriceDetail {
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
}
</style>