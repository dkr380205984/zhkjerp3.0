<template>
  <div class="printContainer"
    id="reimbursementManagePrint"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <div class="pmain">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">{{ company_name + '报销单' }}</div>
          <div class="prow">
            <div class="pcol wa">
              <div class="label">系统报价编号：</div>
              <div class="info"
                style="white-space: nowrap;">{{ quotedPriceInfo.code }}}}</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol wa">
              <div class="label">报价创建信息：</div>
              <div class="info">{{ quotedPriceInfo.created_at ? quotedPriceInfo.created_at.slice(0, 10) : '' }}{{ quotedPriceInfo.user_name?'，'+quotedPriceInfo.user_name:'' }}{{ quotedPriceInfo.user_phone?'，'+quotedPriceInfo.user_phone:'' }}</div>
            </div>
          </div>
        </div>
        <div class="fr">
          <!-- <div class="remark">打开微信扫一扫 更新每日生产进度</div> -->
          <div class="pImage">
            <img :src="qrCodeUrl"
              width="100%"
              alt="" />
          </div>
        </div>
      </div>
      <div class="pbody">
        <div class="tableCtn pageOne">
          <div class="module">
            <div class="tbody hasTop">
              <div class="trow">
                <div class="tcol bgGray">报价客户</div>
                <div class="tcol">{{ quotedPriceInfo.client_name }}</div>
                <div class="tcol bgGray">客户联系人</div>
                <div class="tcol">{{ quotedPriceInfo.contacts_name }}</div>
                <div class="tcol bgGray">报价币种</div>
                <div class="tcol">{{ quotedPriceInfo.settle_unit }}</div>
                <div class="tcol bgGray">币种汇率</div>
                <div class="tcol">{{ quotedPriceInfo.exchange_rate }}</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray">报价标题</div>
                <div class="tcol">{{ quotedPriceInfo.title }}</div>
                <div class="tcol bgGray">系统报价</div>
                <div class="tcol">{{ quotedPriceInfo.system_total_price }}</div>
                <div class="tcol bgGray">实际报价</div>
                <div class="tcol">{{ quotedPriceInfo.real_quote_price }}</div>
                <div class="tcol bgGray">审核状态</div>
                <div class="tcol">{{ quotedPriceInfo.is_check == 0 ? '待审核' : (quotedPriceInfo.is_check == 1 ?'已审核':'已驳回') }}</div>
              </div>
            </div>
          </div>
          <div v-for="(item, index) in quotedPriceInfo.product_data"
            :key="item.id">
            <div class="module">
              <div class="tbody hasTop productInfo">
                <div class="trow">
                  <div class="tcol bgGray">产品品类</div>
                  <div class="tcol bgGray">产品图片</div>
                  <div class="tcol bgGray">客户目标价格</div>
                  <div class="tcol bgGray">客户最低起订量</div>
                  <div class="tcol bgGray big">产品描述/客户要求</div>
                </div>
                <div class="trow">
                  <div class="tcol">{{ item.category_name }}/{{ item.secondary_category }}</div>
                  <div class="tcol">
                    <div class="imageCtn">
                      <el-image style="width: 100%; height: 100%"
                        :src="item.image_data.length > 0 ? item.image_data[0] : ''"
                        :preview-src-list="item.image_data">
                        <div slot="error"
                          class="image-slot">
                          <i class="el-icon-picture-outline"
                            style="font-size: 42px"></i>
                        </div>
                      </el-image>
                    </div>
                  </div>
                  <div class="tcol">{{ item.client_target_price }}元</div>
                  <div class="tcol">{{ item.start_order_number }}</div>
                  <div class="tcol big">{{ item.desc }}</div>
                </div>
              </div>
            </div>
            <div class="module">
              <div class="tbody hasTop">
                <div class="trow">
                  <div class="tcol bgGray">原料或辅料名称</div>
                  <div class="tcol bgGray">预计数量</div>
                  <div class="tcol bgGray">预计损耗</div>
                  <div class="tcol bgGray">单价</div>
                  <div class="tcol bgGray">总价</div>
                </div>
                <div class="trow"
                  v-for="(itemYarn, indexYarn) in item.material_data"
                  :key="'Yarn' + indexYarn">
                  <div class="tcol circlrParent">
                    <div class="circle backHoverOrange">原</div>
                    {{ itemYarn.material_name }}
                  </div>
                  <div class="tcol">{{ itemYarn.weight }}{{ itemYarn.unit }}</div>
                  <div class="tcol">{{ itemYarn.loss }}%</div>
                  <div class="tcol">{{ itemYarn.price }}元</div>
                  <div class="tcol">{{ $toFixed(itemYarn.total_price) }}元</div>
                </div>
                <div class="trow"
                  v-for="(itemDecorateMaterial, indexDecorateMaterial) in item.assist_material_data"
                  :key="'DecorateMaterial' + indexDecorateMaterial">
                  <div class="tcol circlrParent">
                    <div class="circle backHoverGreen">辅</div>
                    {{ itemDecorateMaterial.material_name }}
                  </div>
                  <div class="tcol">{{ itemDecorateMaterial.number }}{{ itemDecorateMaterial.unit }}</div>
                  <div class="tcol">{{ itemDecorateMaterial.loss }}%</div>
                  <div class="tcol">{{ itemDecorateMaterial.price }}元</div>
                  <div class="tcol">{{ $toFixed(itemDecorateMaterial.total_price) }}元</div>
                </div>
                <div class="trow">
                  <div class="tcol bgGray f0922">费用名称</div>
                  <div class="tcol bgGray f3">费用说明</div>
                  <div class="tcol bgGray f0922">总价</div>
                </div>
                <div class="trow"
                  v-for="(itemWeave, indexWeave) in item.weave_data"
                  :key="'Weave' + indexWeave">
                  <div class="tcol circlrParent f0922 f0922">
                    <div class="circle"
                      :class="{ backHoverBlue: itemWeave.name, backGray: !itemWeave.name }">织</div>
                    {{ itemWeave.name || '无' }}
                  </div>
                  <div class="tcol f3">{{ itemWeave.desc || '无' }}</div>
                  <div class="tcol f0922">{{ $toFixed(itemWeave.total_price) }}元</div>
                </div>
                <div class="trow"
                  v-for="(itemHalfProcess, indexHalfProcess) in item.semi_product_data"
                  :key="'HalfProcess' + indexHalfProcess">
                  <div class="tcol circlrParent f0922">
                    <div class="circle"
                      :class="{ backHoverBlue: itemHalfProcess.process_name, backGray: !itemHalfProcess.process_name }">
                      半
                    </div>
                    {{ itemHalfProcess.process_name.join(',') || '无' }}
                  </div>
                  <div class="tcol f3">{{ itemHalfProcess.desc || '无' }}</div>
                  <div class="tcol f0922">{{  $toFixed(itemHalfProcess.total_price) }}元</div>
                </div>
                <div class="trow"
                  v-for="(itemFinishedProcess, indexFinishedProcess) in item.production_data"
                  :key="'FinishedProcess' + indexFinishedProcess">
                  <div class="tcol circlrParent f0922">
                    <div class="circle"
                      :class="{ backHoverBlue: itemFinishedProcess.name, backGray: !itemFinishedProcess.name }">
                      成
                    </div>
                    {{ itemFinishedProcess.name.join(',') || '无' }}
                  </div>
                  <div class="tcol f3">{{ itemFinishedProcess.desc || '无' }}</div>
                  <div class="tcol f0922">{{$toFixed(itemFinishedProcess.total_price)}}元</div>
                </div>
                <div class="trow"
                  v-for="(itemPackMaterial, indexPackMaterial) in item.pack_material_data"
                  :key="'PackMaterial' + indexPackMaterial">
                  <div class="tcol circlrParent f0922">
                    <div class="circle"
                      :class="{
                        backHoverBlue: itemPackMaterial.material_name,
                        backGray: !itemPackMaterial.material_name
                      }">
                      包
                    </div>
                    {{ itemPackMaterial.material_name || '无' }}
                  </div>
                  <div class="tcol f3">{{ itemPackMaterial.desc || '无' }}</div>
                  <div class="tcol f0922">{{ $toFixed(itemPackMaterial.total_price)}}元</div>
                </div>
                <div class="trow"
                  v-for="(itemOther, indexOther) in item.other_fee_data"
                  :key="'Other' + indexOther">
                  <div class="tcol circlrParent f0922">
                    <div class="circle"
                      :class="{ backHoverBlue: itemOther.name, backGray: !itemOther.name }">其</div>
                    {{ itemOther.name || '无' }}
                  </div>
                  <div class="tcol f3">{{ itemOther.desc || '无' }}</div>
                  <div class="tcol f0922">{{  $toFixed(itemOther.total_price) }}元</div>
                </div>
                <div class="trow"
                  v-for="(itemOther, indexOther) in item.no_production_fee_data"
                  :key="'NoPro' + indexOther">
                  <div class="tcol circlrParent f0922">
                    <div class="circle"
                      :class="{ backHoverBlue: itemOther.name, backGray: !itemOther.name }">非</div>
                    {{ itemOther.name || '无' }}
                  </div>
                  <div class="tcol f3">{{ itemOther.desc || '无' }}</div>
                  <div class="tcol f0922">{{ $toFixed(itemOther.total_price) }}元</div>
                </div>
                <div class="trow">
                  <div class="tcol circlrParent f0922">
                    <div class="circle"
                      :class="{ backHoverBlue: item.transport_fee, backGray: !item.transport_fee }">
                      运
                    </div>
                    {{ item.transport_fee ? '运输费用' : '无' }}
                  </div>
                  <div class="tcol f3">{{ item.transport_fee_desc || '无' }}</div>
                  <div class="tcol f0922">{{  $toFixed(item.transport_fee) }}元</div>
                </div>
                <div class="trow">
                  <div class="tcol bgGray f0922">小计</div>
                  <div class="tcol bgGray f3"></div>
                  <div class="tcol bgGray f0922">{{  $toFixed(productTotalPrice[index]) }}元</div>
                </div>
              </div>
            </div>
          </div>
          <div class="module">
            <div class="tbody hasTop">
              <div class="trow">
                <div class="tcol bgGray f0922">费用名称</div>
                <div class="tcol bgGray f3">费用比例</div>
                <div class="tcol bgGray f0922">总价</div>
              </div>
              <div class="trow">
                <div class="tcol f0922">基本佣金</div>
                <div class="tcol f3">{{ quotedPriceInfo.commission_percentage }}%</div>
                <div class="tcol f0922">{{  $toFixed(quotedPriceInfo.commission_price) }}元</div>
              </div>
              <div class="trow">
                <div class="tcol f0922">基本税率</div>
                <div class="tcol f3">{{ quotedPriceInfo.rate_taxation }}%</div>
                <div class="tcol f0922">{{  $toFixed(quotedPriceInfo.rate_price) }}元</div>
              </div>
              <div class="trow">
                <div class="tcol f0922">基本利润</div>
                <div class="tcol f3">{{ quotedPriceInfo.profit_percentage }}%</div>
                <div class="tcol f0922">{{  $toFixed(quotedPriceInfo.profit_price) }}元</div>
              </div>
              <div class="trow">
                <div class="tcol bgGray f0922">合计总价</div>
                <div class="tcol bgGray f3"></div>
                <div class="tcol bgGray f0922">{{  $toFixed(totalPrice) }}元</div>
              </div>
            </div>
          </div>
          <div class="module">
            <div class="tbody hasTop">
              <div class="trow">
                <div class="tcol bgGray f047">其它说明与备注</div>
                <div class="tcol"
                  style="flex: 2 2%;">{{ quotedPriceInfo.otherComment }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop>
      <div class="setting_item"
        @click="windowMethod(1)">刷新</div>
      <div class="setting_item"
        @click="windowMethod(2)">打印</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { QuotedPriceInfo } from '@/types/quotedPrice'
import { quotedPrice } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    quotedPriceInfo: QuotedPriceInfo
    [propName: string]: any
  } {
    return {
      company_name: window.sessionStorage.getItem('company_name'),
      qrCodeUrl: '',
      showMenu: false,
      X_position: 0,
      Y_position: 0,
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
        rel_order: [],
        product_data: [
          {
            total_price: '',
            product_id: '',
            type: [],
            category_id: '',
            secondary_category_id: '',
            secondary_category: '',
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
                process_name: [],
                desc: '',
                total_price: ''
              }
            ],
            production_data: [
              {
                name: [],
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
            ],
            no_production_fee_data: [
              {
                id: '',
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
    handleClickRight(e: any, type = true) {
      this.showMenu = type
      this.X_position = e.clientX
      this.Y_position = e.clientY
      e.preventDefault()
      e.stopPropagation()
    },
    windowMethod(type: 1 | 2) {
      this.showMenu = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          window.print()
        }
      })
    }
  },
  computed: {
    productTotalPrice(): string[] {
      return this.quotedPriceInfo.product_data.map((item) => {
        return (
          Number(item.transport_fee) +
          item.material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.assist_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.weave_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.semi_product_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.production_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.pack_material_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.other_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0) +
          item.no_production_fee_data.reduce((totalChild, currentChild) => {
            return totalChild + Number(currentChild.total_price)
          }, 0)
        ).toFixed(2)
      })
    },
    totalPrice(): string {
      let quotedPriceInfo = this.quotedPriceInfo
      let total =
        Number(quotedPriceInfo.commission_price) +
        Number(quotedPriceInfo.rate_price) +
        Number(quotedPriceInfo.profit_price)
      return String(total.toFixed(2))
    }
  },
  mounted() {
    quotedPrice
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        // console.log(res.data.data)
        this.quotedPriceInfo = res.data.data

        // 生成二维码
        const QRCode = require('qrcode')
        QRCode.toDataURL(`${this.quotedPriceInfo.code}`)
          .then((url: any) => {
            this.qrCodeUrl = url
            // console.log(this.qrCodeUrl)
          })
          .catch((err: any) => {
            console.error(err)
          })
      })
  }
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/reimbursementManage/print.less';
</style>