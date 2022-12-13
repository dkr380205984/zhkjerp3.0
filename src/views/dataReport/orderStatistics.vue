<template>
  <div id="orderStatistics"
    class="bodyContainer"
    v-loading="loading">
    <div class="topTagCtn">
      <div class="tag active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-dingdanshujutubiao"></use>
        </svg>
        <span class="text">订单数据图表</span>
      </div>
      <div class="tag"
        @click="$router.push('/dataReport/sampleOrderStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yangdanshujutubiao"></use>
        </svg>
        <span class="text">样单数据图表</span>
      </div>
      <div class="tag"
        @click="$router.push('/dataReport/materialsUsePlanDataStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-yuanliaoshiyongtubiao"></use>
        </svg>
        <span class="text">原料使用图表</span>
      </div>
      <div class="tag"
        @click="$router.push('/dataReport/accessoriesDecorationOrderStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-fuliaoshiyongtubiao"></use>
        </svg>
        <span class="text">辅料使用图表</span>
      </div>
      <div class="tag"
        @click="$router.push('/dataReport/productionPlanChartStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-shengchanshujutubiao"></use>
        </svg>
        <span class="text">生产数据图表</span>
      </div>
      <div class="tag"
        @click="$router.push('/dataReport/transportationOutboundStatistics')">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-qitafeiyongtubiao"></use>
        </svg>
        <span class="text">其它费用图表</span>
      </div>
    </div>
    <div class="module noBackColor">
      <div class="cardCtn">
        <div class="card noBackColor noPad"
          style="width: 106%">
          <div class="screenCtn">
            <div class="screen"
              style="width: 66%">
              <el-date-picker v-model="filterData.start_time"
                type="year"
                @change="changeDate"
                placeholder="筛选下单年份">
              </el-date-picker>
            </div>
            <div class="screen">
              <el-cascader @change="
                  getContacts($event)
                  changeRouter()
                "
                placeholder="筛选下单公司"
                v-model="filterData.client_id"
                :show-all-levels="false"
                filterable
                :options="clientList"
                clearable>
              </el-cascader>
            </div>
            <div class="screen"
              style="margin-bottom: 0">
              <el-select @change="(ev) => getLocalStorage(ev, 'group_id')"
                v-model="filterData.group_id"
                placeholder="筛选负责小组"
                clearable>
                <el-option v-for="item in groupList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="screen"
              style="margin-bottom: 0">
              <el-select @change="changePeople"
                v-model="filterData.user_id"
                placeholder="筛选创建人"
                clearable>
                <el-option v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="screen"
              style="margin-bottom: 0">
              <el-select placeholder="筛选币种"
                clearable
                v-model="filterData.settle_unit"
                @change="changeRouter">
                <el-option v-for="item in filterCondition.currency"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                  class="between">
                  <span>{{ item.name }}</span>
                  <span class="gray">({{ item.short }})</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="card"
          style="margin-left: 4px">
          <div class="contentGrid">
            <h3>当前统计默认值</h3>
            <div class="item2">
              订单下单时间：<span class="blue">{{ formatDate2(filterData.start_time) }}-{{ formatDate2(filterData.end_time) }}</span>
            </div>
          </div>
          <div class="contentGrid">
            <div>
              下单小组：<span class="blue">{{ groupName || '所有' }}</span>
            </div>
            <div>
              下单公司：<span class="blue">{{ alias || '所有' }}</span>
            </div>
            <div>
              <el-tooltip class="item"
                effect="dark"
                content="已默认将美元按汇率转为人民币"
                placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
              币种：<span class="blue">{{ filterData.settle_unit || '所有' }}</span>
            </div>
            <div>
              创建人：<span class="blue">{{ createPeople || '所有' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <h3>下单总额</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ this.reportData.order.total_price }}</h2>
            </span>
            <h2 class="unit">万{{ filterData.settle_unit || '元' }}</h2>
          </div>
        </div>
        <div class="card">
          <h3>下单总数</h3>
          <div class="content">
            <span class="blue">
              <h2>{{ this.reportData.order.total_number }}</h2>
            </span>
            <h2 class="unit">万件</h2>
          </div>
        </div>
        <div class="card">
          <h3>出库总额</h3>
          <div class="content">
            <span class="green">
              <h2>{{ this.reportData.transport.price }}</h2>
            </span>
            <h2 class="unit">万{{ filterData.settle_unit || '元' }}</h2>
          </div>
        </div>
        <div class="card">
          <h3>出库总数</h3>
          <div class="content">
            <span class="green">
              <h2>{{ this.reportData.transport.transport_number }}</h2>
            </span>
            <h2 class="unit">万件</h2>
          </div>
        </div>
      </div>
      <div class="cardCtn">
        <div class="card">
          <el-tabs v-model="activeName"
            @tab-click="getList">
            <el-tab-pane label="下单数据"
              name="first">
              <zh-charts v-if="activeName === 'first'"
                :option="option1"></zh-charts>
              <div class="cardCtn">
                <div class="card">
                  <zh-charts :option="groupOption"></zh-charts>
                </div>
                <div class="card">
                  <zh-charts :option="companyOption"></zh-charts>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="出库数据"
              name="second">
              <zh-charts v-if="activeName === 'second'"
                :option="option1"></zh-charts>
            </el-tab-pane>
            <el-tab-pane label="利润分析表"
              name="third">
              <div class="flattenTableCtn">
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                  <div class="tcol">金额（¥）</div>
                  <div class="tcol">数量</div>
                  <div class="tcol">平均类目单价</div>
                  <div class="tcol">平均每件产品单价</div>
                </div>
                <div class="trow">
                  <div class="tcol">下单总额</div>
                  <div class="tcol">订单下单</div>
                  <div class="tcol">
                    <span class="green">¥{{$toFixed(profitAnalysisData.order.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.order.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="green">{{$toFixed(profitAnalysisData.order.order.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.order.order.total_number,2))}}件</span>
                  </div>
                  <div class="tcol"></div>
                  <div class="tcol"><span class="green">{{$toFixed(profitAnalysisData.order.order.avg)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">付费样单</div>
                  <div class="tcol">
                    <span class="green">¥{{$toFixed(profitAnalysisData.order.sample_order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.order.sample_order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="green">{{$toFixed(profitAnalysisData.order.sample_order.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.order.sample_order.total_number,2))}}件</span>
                  </div>
                  <div class="tcol"></div>
                  <div class="tcol"><span class="green">{{$toFixed(profitAnalysisData.order.sample_order.avg)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol fontNormal">小计</div>
                  <div class="tcol">
                    <span class="green">¥{{$toFixed(profitAnalysisData.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="green">{{$toFixed(profitAnalysisData.order.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.order.total_number,2))}}件</span>
                  </div>
                  <div class="tcol"></div>
                  <div class="tcol"><span class="green">{{$toFixed(profitAnalysisData.order.avg)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol">原料纱线成本</div>
                  <div class="tcol">订单采购成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.yarn.order.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.order.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.order.order.total_number,2,true)}}<span class="em">kg</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.order.order.total_number,2))}}千克</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.yarn.order.order.avg)}}<span class="em">元/kg</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.order.order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.yarn.order.order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">样单采购成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.yarn.order.sample_order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.order.sample_order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.order.sample_order.total_number,2,true)}}<span class="em">kg</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.order.sample_order.total_number,2))}}千克</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.yarn.order.sample_order.avg)}}<span class="em">元/kg</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.order.sample_order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.yarn.order.sample_order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol fontNormal">小计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.yarn.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.order.total_number,2,true)}}<span class="em">kg</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.order.total_number,2))}}千克</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.yarn.order.avg)}}<span class="em">元/kg</span></span></div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.yarn.order.avg_product)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">订单调取成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.yarn.transfer.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.transfer.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.transfer.order.total_number,2,true)}}<span class="em">kg</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.transfer.order.total_number,2))}}千克</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.yarn.transfer.order.avg)}}<span class="em">元/kg</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.transfer.order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.yarn.transfer.order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">样单调取成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.yarn.transfer.sample_order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.transfer.sample_order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.transfer.sample_order.total_number,2,true)}}<span class="em">kg</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.transfer.sample_order.total_number,2))}}千克</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.yarn.transfer.sample_order.avg)}}<span class="em">元/kg</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.transfer.sample_order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.yarn.transfer.sample_order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol fontNormal">小计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.yarn.transfer.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.transfer.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.transfer.total_number,2,true)}}<span class="em">kg</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.transfer.total_number,2))}}千克</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.transfer.avg)}}<span class="em">元/kg</span></span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.yarn.transfer.avg_product)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">订单加工成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.yarn.process.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.process.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.process.order.total_number,2,true)}}<span class="em">kg</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.process.order.total_number,2))}}千克</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.yarn.process.order.avg)}}<span class="em">元/kg</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.process.order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.yarn.process.order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">样单加工成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.yarn.process.sample_order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.process.sample_order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.process.sample_order.total_number,2,true)}}<span class="em">kg</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.process.sample_order.total_number,2))}}千克</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.yarn.process.sample_order.avg)}}<span class="em">元/kg</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.process.sample_order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.yarn.process.sample_order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol fontNormal">小计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.yarn.process.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.process.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.process.total_number,2,true)}}<span class="em">kg</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.process.total_number,2))}}千克</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.process.avg)}}<span class="em">元/kg</span></span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.yarn.process.avg_product)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">纱线成本合计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.yarn.process.total_price+profitAnalysisData.yarn.transfer.total_price+profitAnalysisData.yarn.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.process.total_price+profitAnalysisData.yarn.transfer.total_price+profitAnalysisData.yarn.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.yarn.process.total_number+profitAnalysisData.yarn.transfer.total_number+profitAnalysisData.yarn.order.total_number,2,true)}}<span class="em">kg</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.yarn.process.total_number+profitAnalysisData.yarn.transfer.total_number+profitAnalysisData.yarn.order.total_number,2))}}千克</span>
                  </div>
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                </div>
                <div class="trow">
                  <div class="tcol">原料面料成本</div>
                  <div class="tcol">订单采购成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.fabric.order.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.order.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.order.order.total_number,2,true)}}<span class="em">m</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.order.order.total_number,2))}}米</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.fabric.order.order.avg)}}<span class="em">元/m</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.order.order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.fabric.order.order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">样单采购成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.fabric.order.sample_order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.order.sample_order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.order.sample_order.total_number,2,true)}}<span class="em">m</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.order.sample_order.total_number,2))}}米</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.fabric.order.sample_order.avg)}}<span class="em">元/m</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.order.sample_order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.fabric.order.sample_order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol fontNormal">小计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.fabric.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.order.total_number,2,true)}}<span class="em">m</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.order.total_number,2))}}米</span>
                  </div>
                  <div class="tcol">
                    <!-- <span class="red">{{$toFixed(profitAnalysisData.fabric.order.avg)}}<span class="em">元/m</span></span> -->
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.fabric.order.avg_product)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">订单调取成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.fabric.transfer.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.transfer.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.transfer.order.total_number,2,true)}}<span class="em">m</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.transfer.order.total_number,2))}}米</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.fabric.transfer.order.avg)}}<span class="em">元/m</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.transfer.order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.fabric.transfer.order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">样单调取成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.fabric.transfer.sample_order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.transfer.sample_order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.transfer.sample_order.total_number,2,true)}}<span class="em">m</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.transfer.sample_order.total_number,2))}}米</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.fabric.transfer.sample_order.avg)}}<span class="em">元/m</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.transfer.sample_order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.fabric.transfer.sample_order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol fontNormal">小计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.fabric.transfer.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.transfer.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.transfer.total_number,2,true)}}<span class="em">m</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.transfer.total_number,2))}}米</span>
                  </div>
                  <div class="tcol">
                    <!-- <span class="red">{{$toFixed(profitAnalysisData.fabric.transfer.avg)}}<span class="em">元/m</span></span> -->
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.fabric.transfer.avg_product)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">订单加工成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.fabric.process.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.process.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.process.order.total_number,2,true)}}<span class="em">m</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.process.order.total_number,2))}}米</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.process.order.avg)}}<span class="em">元/m</span></span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.process.order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.fabric.process.order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">样单加工成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.fabric.process.sample_order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.process.sample_order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.process.sample_order.total_number,2,true)}}<span class="em">m</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.process.sample_order.total_number,2))}}米</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.fabric.process.sample_order.avg)}}<span class="em">元/m</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.process.sample_order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.fabric.process.sample_order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol fontNormal">小计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.fabric.process.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.process.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.process.total_number,2,true)}}<span class="em">m</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.process.total_number,2))}}米</span>
                  </div>
                  <div class="tcol">
                    <!-- <span class="red">{{$toFixed(profitAnalysisData.fabric.process.avg)}}<span class="em">元/m</span></span> -->
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.fabric.process.avg_product)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">面料成本合计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.fabric.process.total_price+profitAnalysisData.fabric.transfer.total_price+profitAnalysisData.fabric.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.process.total_price+profitAnalysisData.fabric.transfer.total_price+profitAnalysisData.fabric.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.fabric.process.total_number+profitAnalysisData.fabric.transfer.total_number+profitAnalysisData.fabric.order.total_number,2,true)}}<span class="em">m</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.fabric.process.total_number+profitAnalysisData.fabric.transfer.total_number+profitAnalysisData.fabric.order.total_number,2))}}米</span>
                  </div>
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                </div>
                <div class="trow">
                  <div class="tcol">装饰辅料成本</div>
                  <div class="tcol">订单采购成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.decorate.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.decorate.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.decorate.order.total_number,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.decorate.order.total_number,2))}}</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.decorate.order.avg)}}<span class="em">元/单位</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.decorate.order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.decorate.order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">样单采购成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.decorate.sample_order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.decorate.sample_order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.decorate.sample_order.total_number,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.decorate.sample_order.total_number,2))}}</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.decorate.sample_order.avg)}}<span class="em">元/单位</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.decorate.sample_order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.decorate.sample_order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol fontNormal">小计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.decorate.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.decorate.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.decorate.total_number,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.decorate.total_number,2))}}</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.decorate.avg)}}<span class="em">元/单位</span></span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.decorate.avg_product)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol">包装辅料成本</div>
                  <div class="tcol">包装辅料成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.pack.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.pack.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.pack.total_number,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.pack.total_number,2))}}</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.pack.avg)}}<span class="em">元/单位</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.pack.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.pack.avg_product/profitAnalysisData.order.avg*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">生产加工成本</div>
                  <div class="tcol">订单织造成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.production.weave.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.weave.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.weave.order.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.weave.order.total_number,2))}}件</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.production.weave.order.avg)}}<span class="em">元/件</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.weave.order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.production.weave.order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">样单织造成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.production.weave.sample_order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.weave.sample_order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.weave.sample_order.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.weave.sample_order.total_number,2))}}件</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.production.weave.sample_order.avg)}}<span class="em">元/件</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.weave.sample_order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.production.weave.sample_order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol fontNormal">小计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.production.weave.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.weave.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.weave.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.weave.total_number,2))}}件</span>
                  </div>
                  <div class="tcol">
                    <!-- <span class="red">{{$toFixed(profitAnalysisData.production.weave.avg)}}<span class="em">元/件</span></span> -->
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.production.weave.avg_product)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">订单加工成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.production.production.order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.production.order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.production.order.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.production.order.total_number,2))}}件</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.production.production.order.avg)}}<span class="em">元/件</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.production.order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.production.production.order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">样单加工成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.production.production.sample_order.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.production.sample_order.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.production.sample_order.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.production.sample_order.total_number,2))}}件</span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.production.production.sample_order.avg)}}<span class="em">元/件</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.production.sample_order.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.production.production.sample_order.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol fontNormal">小计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.production.production.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.production.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.production.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.production.total_number,2))}}件</span>
                  </div>
                  <div class="tcol">
                    <!-- <span class="red">{{$toFixed(profitAnalysisData.production.production.avg)}}<span class="em">元/件</span></span> -->
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.production.production.avg_product)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">生产成本合计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.production.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.production.total_number,2))}}件</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.production.avg)}}<span class="em">元/件</span></span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.production.avg_product)}}<span class="em">元/件</span></span></div>
                </div>
                <div class="trow">
                  <div class="tcol">人工工资成本</div>
                  <div class="tcol">计件工资</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.wage.wage_item.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.wage.wage_item.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.wage.wage_item.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.wage.wage_item.total_number,2))}}件</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.wage.wage_item.avg)}}<span class="em">元/件</span></span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.wage.wage_item.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.wage.wage_item.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol">计时工资</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.wage.wage_time.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.wage.wage_time.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.wage.wage_time.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.wage.wage_time.total_number,2))}}件</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.wage.wage_time.avg)}}<span class="em">元/件</span></span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.wage.wage_time.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.wage.wage_time.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"></div>
                  <div class="tcol fontNormal">小计</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.wage.wage_time.total_price + profitAnalysisData.wage.wage_item.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.wage.wage_time.total_price + profitAnalysisData.wage.wage_item.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.wage.wage_time.total_number + profitAnalysisData.wage.wage_item.total_number,2,true)}}<span class="em">件</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.wage.wage_time.total_number + profitAnalysisData.wage.wage_item.total_number,2))}}件</span>
                  </div>
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                </div>
                <div class="trow">
                  <div class="tcol">发货运输成本</div>
                  <div class="tcol">发货运输成本</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.dispatch.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.dispatch.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.dispatch.total_number,2,true)}}<span class="em">立方</span></span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.dispatch.total_number,2))}}<span class="em">立方</span></span>
                  </div>
                  <div class="tcol"><span class="red">{{$toFixed(profitAnalysisData.dispatch.avg)}}<span class="em">元/立方</span></span></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.dispatch.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.dispatch.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">报销费用</div>
                  <div class="tcol">报销费用</div>
                  <div class="tcol">
                    <span class="red">¥{{$toFixed(profitAnalysisData.receipt.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.receipt.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(profitAnalysisData.receipt.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.receipt.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">单位扣款费用</div>
                  <div class="tcol">单位扣款费用</div>
                  <div class="tcol">
                    <span class="green">¥{{$toFixed(profitAnalysisData.deduct.total_price,2,true)}}</span>
                    <span class="gray">{{$changeNumToHan($toFixed(profitAnalysisData.deduct.total_price,2))}}元整</span>
                  </div>
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                  <div class="tcol">
                    <span class="green">{{$toFixed(profitAnalysisData.deduct.avg_product)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(profitAnalysisData.deduct.total_price/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
                <div class="trow"
                  v-for="item,index in other_fee"
                  :key="index">
                  <div class="tcol">{{index===0?'其他成本':''}}</div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input v-model="item.name"
                        placeholder="费用名称"></el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn"
                      style="position:relative">
                      <el-input v-model="item.total_price"
                        placeholder="费用金额"
                        style="width:200px"
                        @input="changeNumToPrice($event,index)">\
                      </el-input>
                      <span class="opr"
                        style="position:absolute;right:0;line-height:32px"
                        :class="{'hoverRed':index>0,'hoverBlue':index===0}"
                        @click="index===0?$addItem(other_fee,{total_price:'',name:''}):$deleteItem(other_fee,index)">{{index===0?'添加':'删除'}}</span>
                    </div>
                  </div>
                  <div class="tcol"><span class="gray">{{item.hanPrice||'零'}}元整</span></div>
                  <div class="tcol"></div>
                  <div class="tcol">
                    <span class="red">{{$toFixed(Number(item.total_price.split(',').join(''))/profitAnalysisData.order.order.total_number)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(Number(item.total_price.split(',').join(''))/profitAnalysisData.order.order.total_number/profitAnalysisData.order.order.avg*100)}}%</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">预计利润</div>
                  <div class="tcol"></div>
                  <div class="tcol">
                    <span class="green">¥{{($toFixed(realProfit,2,true))}}</span>
                    <span class="gray">{{$changeNumToHan(realProfit)}}元整</span>
                  </div>
                  <div class="tcol"></div>
                  <div class="tcol"></div>
                  <div class="tcol">
                    <span class="green">{{$toFixed(realProfit/profitAnalysisData.order.total_number)}}<span class="em">元/件</span></span>
                    <span class="gray">{{$toFixed(realProfit/profitAnalysisData.order.total_price*100)}}%</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="bottomFixBar"
      v-if="activeName==='third'">
      <div class="main">
        <div class="btnCtn"
          @click="getExcelData()">
          <div class="btn backHoverGreen">导出利润分析表</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { statistics, client } from '@/assets/js/api'
import { moneyArr } from '@/assets/js/dictionary'
import zhCharts from '@/components/zhCharts/zhCharts.vue'
export default Vue.extend({
  components: { zhCharts },
  data(): {
    [porpName: string]: any
  } {
    return {
      loading: false,
      alias: '',
      option1: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: []
        },
        xAxis: [
          {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 万元'
            }
          },
          {
            type: 'value',
            name: '',
            min: 0,
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: '{value} 万件'
            }
          }
        ],
        series: [
          {
            type: 'bar',
            data: []
          },
          {
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      groupOption: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: []
          }
        ]
      },
      companyOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },

        dataZoom: [
          //给y轴设置滚动条
          {
            start: 0, //默认为0
            end: 100 - 1500 / 31, //默认为100
            type: 'slider',
            maxValueSpan: 10, //窗口的大小，显示数据的条数的
            show: true,
            handleSize: 0, //滑动条的 左右2个滑动条的大小
            height: '70%', //组件高度
            left: 650,
            right: 15,
            top: 50,
            borderColor: 'rgba(43,48,67,.8)',
            fillerColor: '#33384b',
            zoomLock: true,
            brushSelect: false,
            backgroundColor: 'rgba(43,48,67,.8)', //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            realtime: true, //是否实时更新
            yAxisIndex: [0, 1] //控制的 y轴
          }
        ],
        yAxis: {
          type: 'category',
          inverse: true,
          data: []
        },
        xAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar'
          }
        ]
      },
      groupName: '',
      createPeople: '',
      filterData: {
        start_time: '',
        end_time: '',
        client_id: '',
        user_id: '',
        group_id: '',
        settle_unit: ''
      },
      reportData: {
        order: {
          total_price: '',
          total_number: ''
        },
        transport: {
          price: ''
        }
      },
      filterCondition: {
        contactsList: [],
        currency: moneyArr
      },
      activeName: 'first',
      other_fee: [
        {
          name: '',
          total_price: ''
        }
      ],
      profitAnalysisExcelData: [], // excel标准格式
      profitAnalysisData: {
        order: {
          order: { total_price: 0, total_number: 0, avg: 0 },
          sample_order: { total_price: 0, total_number: 0, avg: 0 },
          total_number: 0,
          total_price: 0,
          avg: 0
        },
        decorate: {
          order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
          avg: 0,
          avg_product: 0,
          total_number: 0,
          total_price: 0,
          sample_order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 }
        },
        pack: {
          avg: 0,
          avg_product: 0,
          total_number: 0,
          total_price: 0
        },
        yarn: {
          order: {
            order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            sample_order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            total_number: 0,
            total_price: 0,
            avg: 0,
            avg_product: 0
          },
          transfer: {
            order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            sample_order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            total_number: 0,
            total_price: 0,
            avg_product: 0
          },
          process: {
            order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            sample_order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            total_number: 0,
            total_price: 0,
            avg_product: 0
          }
        },
        fabric: {
          order: {
            order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            sample_order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            total_number: 0,
            total_price: 0,
            avg_product: 0
          },
          transfer: {
            order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            sample_order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            total_number: 0,
            total_price: 0,
            avg_product: 0
          },
          process: {
            order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            sample_order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            total_number: 0,
            total_price: 0,
            avg_product: 0
          }
        },
        production: {
          weave: {
            order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            sample_order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            total_number: 0,
            total_price: 0,
            avg_product: 0
          },
          production: {
            order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            sample_order: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
            total_number: 0,
            total_price: 0,
            avg_product: 0
          }
        },
        wage: {
          wage_item: { total_number: 0, total_extra_number: 0, total_price: 0, avg_product: 0 },
          wage_time: { total_number: 0, total_extra_number: 0, total_price: 0, avg_product: 0 }
        },
        dispatch: { total_price: 0, total_number: 0, avg: 0, avg_product: 0 },
        receipt: { total_price: 0, avg_product: 0 },
        deduct: { total_price: 0, avg_product: 0 }
      }
    }
  },
  methods: {
    // 把数字改成金额
    changeNumToPrice(val: string, index: number) {
      const realNumStr = val.replace(/[^\d.]/g, '')
      const numStrArr = realNumStr.split('.')
      let zhengshu = ''
      let xiaoshu = ''
      if (numStrArr.length > 2) {
        this.other_fee[index].hanPrice = '请输入正确数字'
        return
      } else if (numStrArr.length === 2) {
        zhengshu = numStrArr[0]
        xiaoshu = numStrArr[1]
      } else {
        zhengshu = numStrArr[0]
      }
      const zhengshuArr = zhengshu.split('')
      this.other_fee[index].hanPrice = this.$changeNumToHan(Number(realNumStr))
      const length = Number(zhengshuArr.length)
      for (let i = length, j = 0; i > 0; i--) {
        j++
        if (j % 3 === 0 && i !== 1) {
          zhengshuArr.splice(i - 1, 0, ',')
        }
      }
      this.other_fee[index].total_price = zhengshuArr.join('') + (numStrArr.length === 2 ? '.' + xiaoshu : '')
    },
    getContacts(ev: number[]) {
      if (ev && ev.length) {
        client
          .detail({
            id: ev[2]
          })
          .then((res) => {
            if (res.data.status) {
              this.alias = res.data.data.alias || res.data.data.name
            }
          })
      } else {
        this.alias = '所有'
      }
    },
    getLocalStorage(ev: any, type: string) {
      let groupInfo = this.groupList.find((item: any) => {
        return this.filterData.group_id === item.id
      })
      this.groupName = '所有'
      if (groupInfo) {
        this.groupName = groupInfo.name
      }
      this.changeRouter()
    },
    changePeople(user_id: any) {
      this.createPeople = '所有'

      let obj = this.userList.find((item: any) => {
        return item.value === user_id
      })

      localStorage.create_user_name = ''

      if (obj) {
        localStorage.create_user_name = obj.label
        this.createPeople = obj.label
      }
      this.changeRouter()
    },
    changeUnit() {
      this.option1.tooltip.formatter = (params: any) => {
        var htmlStr = '<div>'
        htmlStr += params[0].name + '<br/>' //x轴的名称
        params.forEach((param: any, index: number) => {
          var color = param.color //图例颜色

          //为了保证和原来的效果一样，这里自己实现了一个点的效果
          htmlStr +=
            '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
            color +
            ';"></span>'

          //添加一个汉字，这里你可以格式你的数字或者自定义文本内容
          htmlStr +=
            param.seriesName +
            '：' +
            '<span style="color:' +
            color +
            ';margin-right:10px">' +
            param.value +
            '</span>' +
            (index === 1 ? '万件' : '万' + (this.filterData.settle_unit || '元'))

          htmlStr += '</div>'
        })

        return htmlStr
      }
      this.option1.yAxis[0].axisLabel.formatter = '{value} 万' + (this.filterData.settle_unit || '元')
      this.groupOption.tooltip.formatter = (params: any) => {
        return `
                <div>
                    ${params.marker}<span style="margin-left:10px;color:black;font-weight:bold">${
          params.data.name
        }：<span style="color:${params.color};font-weight:normal">${params.data.value}万${
          this.filterData.settle_unit || '元'
        }</span></span>
                </div>
              `
      }
      this.companyOption.tooltip.formatter = (params: any) => {
        return `
                <h4 style='color:#000000;margin:5px 0'>${params[0].axisValue}</h4>
                <span style='color:#A3A3A3;font-size:10px'>CNY：</span>
                <span style='color:#229CFB;font-size:14px;'>${this.filterData.settle_unit === '美元' ? '$' : '￥'}${
          params[0].value
        }万元</span>
            `
      }
    },
    getFilters() {
      const query = this.$route.query
      if (query.start_time === '' || query.start_time === undefined) {
        let date = new Date()
        let nowYear = date.getFullYear() + '-01-01'
        this.filterData.start_time = nowYear
        this.filterData.end_time = this.formatDate(new Date())
      } else {
        this.filterData.start_time = query.start_time
        this.filterData.end_time = query.end_time
      }
      this.filterData.client_id = query.client_id
        ? (query.client_id as string).split(',').map((item) => Number(item))
        : []
      this.filterData.user_id = query.user_id || this.$getLocalStorage('create_user') || ''
      this.filterData.group_id = Number(query.group_id) || Number(this.$getLocalStorage('group_id')) || ''
      this.filterData.settle_unit = query.settle_unit
      this.createPeople = this.$getLocalStorage('create_user_name')
      this.changeUnit()
      this.getContacts(this.filterData.client_id)
    },
    formatDate(date: Date) {
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
      )
    },
    formatDate2(date: string | Date) {
      if (typeof date === 'object') {
        this.formatDate(date)
      } else {
        return date.split('-')[0] + '年' + date.split('-')[1] + '月' + date.split('-')[2] + '日'
      }
    },
    changeDate(res: any) {
      if (res !== null) {
        this.filterData.start_time = res.getFullYear() + '-01-01'
        if (res.getFullYear() === new Date().getFullYear()) {
          this.filterData.end_time = this.formatDate(new Date())
        } else {
          this.filterData.end_time = res.getFullYear() + '-12-31'
        }
      } else {
        this.filterData.start_time = new Date().getFullYear() + '-01-01'
        this.filterData.end_time = this.formatDate(new Date())
      }
      this.changeRouter()
    },
    changeRouter() {
      this.$router.push(
        '/dataReport/orderStatistics?' +
          '&client_id=' +
          (this.filterData.client_id || '') +
          '&user_id=' +
          (this.filterData.user_id || '') +
          '&group_id=' +
          (this.filterData.group_id || '') +
          '&settle_unit=' +
          (this.filterData.settle_unit || '') +
          '&start_time=' +
          (this.filterData.start_time || '') +
          '&end_time=' +
          (this.filterData.end_time || '')
      )
    },
    getList() {
      this.loading = true
      if (this.activeName === 'third') {
        statistics
          .profitAnalysis({
            start_time: this.filterData.start_time,
            client_id: this.filterData.client_id.length > 0 ? this.filterData.client_id[2] : '',
            user_id: this.filterData.user_id,
            group_id: this.filterData.group_id,
            settle_unit: this.filterData.settle_unit,
            end_time: this.filterData.end_time
          })
          .then((res) => {
            if (res.data.status) {
              this.profitAnalysisData = res.data.data
            }
          })
      }
      statistics
        .order({
          start_time: this.filterData.start_time,
          client_id: this.filterData.client_id.length > 0 ? this.filterData.client_id[2] : '',
          user_id: this.filterData.user_id,
          group_id: this.filterData.group_id,
          settle_unit: this.filterData.settle_unit,
          end_time: this.filterData.end_time
        })
        .then((res) => {
          if (!res.data.status) {
            this.loading = false
            return
          }
          let data = res.data.data
          data.order.total_number = this.$formatNum(+(data.order.total_number / 10000).toFixed(2))
          data.order.total_price = this.$formatNum(+(data.order.total_price / 10000).toFixed(2))
          data.transport.price = this.$formatNum(+(data.transport.price / 10000).toFixed(2))
          data.transport.transport_number = this.$formatNum(+(data.transport.transport_number / 10000).toFixed(2))

          this.reportData = data
          this.option1.series[0].data = []
          this.option1.series[1].data = []
          this.groupOption.series[0].data = []
          this.companyOption.yAxis.data = []
          this.companyOption.series[0].data = []

          let orderPriceMax: any,
            orderPriceMin: any,
            orderNumberMax: any,
            orderNumberMin: any,
            outPriceMax: any,
            outPriceMin: any,
            outNumberMax: any,
            outNumberMin: any = 0

          if (data.order.report.month.length !== 0) {
            //  每月下单总额
            orderPriceMax = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
              return +num1.total_price > +num2.total_price ? num1 : num2
            })
            orderPriceMin = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
              return +num1.total_price < +num2.total_price ? num1 : num2
            })

            // 每月下单总数
            orderNumberMax = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
              return +num1.total_number > +num2.total_number ? num1 : num2
            })
            orderNumberMin = Object.values(data.order.report.month).reduce((num1: any, num2: any) => {
              return +num1.total_number < +num2.total_number ? num1 : num2
            })

            // 拿到每月下单总额的最大值和最小值
            orderPriceMax = +orderPriceMax.total_price
            orderPriceMin = +orderPriceMin.total_price

            // 拿到每月下单总数的最大值和最小值
            orderNumberMax = +orderNumberMax.total_number
            orderNumberMin = +orderNumberMin.total_number
          }

          if (data.transport.report.month.length !== 0) {
            //  每月出库总额
            outPriceMax = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
              return +num1.price > +num2.price ? num1 : num2
            })
            outPriceMin = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
              return +num1.price < +num2.price ? num1 : num2
            })

            // 每月出库总数
            outNumberMax = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
              return +num1.transport_number > +num2.transport_number ? num1 : num2
            })
            outNumberMin = Object.values(data.transport.report.month).reduce((num1: any, num2: any) => {
              return +num1.transport_number < +num2.transport_number ? num1 : num2
            })

            // 拿到每月出库总额的最大值和最小值
            outPriceMax = +outPriceMax.price
            outPriceMin = +outPriceMin.price

            // 拿到出库下单总数的最大值和最小值
            outNumberMax = +outNumberMax.transport_number
            outNumberMin = +outNumberMin.transport_number
          }

          if (this.activeName === 'first') {
            this.option1.series[0].name = '每月下单总额'
            this.option1.series[1].name = '每月下单总数'
            this.option1.legend.data = ['每月下单总额', '每月下单总数']
            this.option1.yAxis[0].name = '下单总额'
            this.option1.yAxis[1].name = '下单总数'

            // 每月下单总数 图表更新
            this.option1.yAxis[0].max = Math.ceil(Math.ceil(orderPriceMax / 10000 / 5)) * 5 || 10
            this.option1.yAxis[0].min = orderPriceMin && orderPriceMin < 0 ? Math.ceil(orderPriceMin / 10000) : 0
            this.option1.yAxis[0].interval = Math.ceil(orderPriceMax / 10000 / 5) || 10

            // 每月下单总额 图表更新
            this.option1.yAxis[1].max = Math.ceil(Math.ceil(orderNumberMax / 10000 / 5)) * 5 || 10
            this.option1.yAxis[1].min = orderNumberMin && orderNumberMin < 0 ? Math.ceil(orderNumberMin / 10000) : 0
            this.option1.yAxis[1].interval = Math.ceil(orderNumberMax / 10000 / 5) * 5 || 10

            this.option1.xAxis[0].data.forEach((itemMouth: any) => {
              let mouth = this.reportData.order.report.month.find((item: any) => {
                return item.mouth === itemMouth
              })
              if (mouth) {
                this.option1.series[0].data.push(+(+mouth.total_price / 10000).toFixed(2))
                this.option1.series[1].data.push(+(+mouth.total_number / 10000).toFixed(2))
              } else {
                this.option1.series[0].data.push(0)
                this.option1.series[1].data.push(0)
              }
            })

            // 饼图
            data.order.report.group.forEach((group: any) => {
              this.groupOption.series[0].data.push({
                name: group.group_name || '其它',
                value: (group.total_price / 10000).toFixed(2)
              })
            })

            // 横向柱状图
            data.order.report.client.forEach((client: any) => {
              this.companyOption.yAxis.data.push(client.client_name)
              this.companyOption.series[0].data.push((client.total_price / 10000).toFixed(2))
            })
          } else if (this.activeName === 'second') {
            this.option1.series[0].name = '每月出库总额'
            this.option1.series[1].name = '每月出库总数'
            this.option1.legend.data = ['每月出库总额', '每月出库总数']
            this.option1.yAxis[0].name = '出库总额'
            this.option1.yAxis[1].name = '出库总数'

            // 每月出库总数 图表更新
            this.option1.yAxis[0].max = Math.ceil(Math.ceil(outPriceMax / 10000 / 5)) * 5 || 10
            this.option1.yAxis[0].min = outPriceMin && outPriceMin < 0 ? Math.ceil(outPriceMin / 10000) : 0
            this.option1.yAxis[0].interval = Math.ceil(outPriceMax / 10000 / 5) || 10

            // 每月出库总额 图表更新
            this.option1.yAxis[1].max = Math.ceil(Math.ceil(outNumberMax / 10000 / 5)) * 5 || 10
            this.option1.yAxis[1].min = outNumberMin && outNumberMin < 0 ? Math.ceil(outNumberMin / 10000) : 0
            this.option1.yAxis[1].interval = Math.ceil(outNumberMax / 10000 / 5) * 5 || 10

            this.option1.xAxis[0].data.forEach((itemMouth: any) => {
              let mouth = this.reportData.transport.report.month.find((item: any) => {
                return item.mouth === itemMouth
              })
              if (mouth) {
                this.option1.series[0].data.push(+(+mouth.price / 10000).toFixed(2))
                this.option1.series[1].data.push(+(+mouth.transport_number / 10000).toFixed(2))
              } else {
                this.option1.series[0].data.push(0)
                this.option1.series[1].data.push(0)
              }
            })
          }
          this.loading = false
        })
    },
    // excel需要标准格式，自己转
    getExcelData() {
      const data = this.profitAnalysisData
      this.profitAnalysisExcelData = [
        {
          first_title: '下单总额',
          second_title: '订单下单',
          total_price: '￥' + data.order.order.total_price,
          number: data.order.order.total_number + '件',
          avg_product: data.order.order.avg + '元/件',
          avg: ''
        },
        {
          first_title: '',
          second_title: '付费样单',
          total_price: '￥' + data.order.sample_order.total_price,
          number: data.order.sample_order.total_number + '件',
          avg_product: data.order.sample_order.avg + '元/件',
          avg: ''
        },
        {
          first_title: '',
          second_title: '小计',
          total_price: '￥' + data.order.total_price,
          number: data.order.total_number + '件',
          avg_product: data.order.avg + '元/件',
          avg: ''
        },
        {
          first_title: '原料纱线成本',
          second_title: '订单采购成本',
          total_price: '￥' + data.yarn.order.order.total_price,
          number: data.yarn.order.order.total_number + 'kg',
          avg_product: data.yarn.order.order.avg_product + '元/件',
          avg: data.yarn.order.order.avg + '元/kg'
        },
        {
          first_title: '',
          second_title: '样单采购成本',
          total_price: '￥' + data.yarn.order.sample_order.total_price,
          number: data.yarn.order.sample_order.total_number + 'kg',
          avg_product: data.yarn.order.sample_order.avg_product + '元/件',
          avg: data.yarn.order.sample_order.avg + '元/kg'
        },
        {
          first_title: '',
          second_title: '小计',
          total_price: '￥' + data.yarn.order.total_price,
          number: data.yarn.order.total_number + 'kg',
          avg_product: data.yarn.order.avg_product + '元/件',
          avg: data.yarn.order.avg + '元/kg'
        },
        {
          first_title: '',
          second_title: '订单调取成本',
          total_price: '￥' + data.yarn.transfer.order.total_price,
          number: data.yarn.transfer.order.total_number + 'kg',
          avg_product: data.yarn.transfer.order.avg_product + '元/件',
          avg: data.yarn.transfer.order.avg + '元/kg'
        },
        {
          first_title: '',
          second_title: '样单调取成本',
          total_price: '￥' + data.yarn.transfer.sample_order.total_price,
          number: data.yarn.transfer.sample_order.total_number + 'kg',
          avg_product: data.yarn.transfer.sample_order.avg_product + '元/件',
          avg: data.yarn.transfer.sample_order.avg + '元/kg'
        },
        {
          first_title: '',
          second_title: '小计',
          total_price: '￥' + data.yarn.transfer.total_price,
          number: data.yarn.transfer.total_number + 'kg',
          avg_product: data.yarn.transfer.avg_product + '元/件',
          avg: data.yarn.transfer.avg + '元/kg'
        },
        {
          first_title: '',
          second_title: '订单加工成本',
          total_price: '￥' + data.yarn.process.order.total_price,
          number: data.yarn.process.order.total_number + 'kg',
          avg_product: data.yarn.process.order.avg_product + '元/件',
          avg: data.yarn.process.order.avg + '元/kg'
        },
        {
          first_title: '',
          second_title: '样单加工成本',
          total_price: '￥' + data.yarn.process.sample_order.total_price,
          number: data.yarn.process.sample_order.total_number + 'kg',
          avg_product: data.yarn.process.sample_order.avg_product + '元/件',
          avg: data.yarn.process.sample_order.avg + '元/kg'
        },
        {
          first_title: '',
          second_title: '小计',
          total_price: '￥' + data.yarn.process.total_price,
          number: data.yarn.process.total_number + 'kg',
          avg_product: data.yarn.process.avg_product + '元/件',
          avg: data.yarn.process.avg + '元/kg'
        },
        {
          first_title: '',
          second_title: '纱线成本合计',
          total_price:
            '￥' +
            this.$toFixed(
              data.yarn.process.total_price + data.yarn.transfer.total_price + data.yarn.order.total_price,
              2,
              true
            ),
          number:
            this.$toFixed(
              data.yarn.process.total_number + data.yarn.transfer.total_number + data.yarn.order.total_number,
              0,
              true
            ) + 'kg',
          avg_product: '',
          avg: ''
        },
        {
          first_title: '原料面料成本',
          second_title: '订单采购成本',
          total_price: '￥' + data.fabric.order.order.total_price,
          number: data.fabric.order.order.total_number + 'm',
          avg_product: data.fabric.order.order.avg_product + '元/件',
          avg: data.fabric.order.order.avg + '元/米'
        },
        {
          first_title: '',
          second_title: '样单采购成本',
          total_price: '￥' + data.fabric.order.sample_order.total_price,
          number: data.fabric.order.sample_order.total_number + 'm',
          avg_product: data.fabric.order.sample_order.avg_product + '元/件',
          avg: data.fabric.order.sample_order.avg + '元/米'
        },
        {
          first_title: '',
          second_title: '小计',
          total_price: '￥' + data.fabric.order.total_price,
          number: data.fabric.order.total_number + 'm',
          avg_product: data.fabric.order.avg_product + '元/件',
          avg: data.fabric.order.avg + '元/米'
        },
        {
          first_title: '',
          second_title: '订单调取成本',
          total_price: '￥' + data.fabric.transfer.order.total_price,
          number: data.fabric.transfer.order.total_number + 'm',
          avg_product: data.fabric.transfer.order.avg_product + '元/件',
          avg: data.fabric.transfer.order.avg + '元/米'
        },
        {
          first_title: '',
          second_title: '样单调取成本',
          total_price: '￥' + data.fabric.transfer.sample_order.total_price,
          number: data.fabric.transfer.sample_order.total_number + 'm',
          avg_product: data.fabric.transfer.sample_order.avg_product + '元/件',
          avg: data.fabric.transfer.sample_order.avg + '元/米'
        },
        {
          first_title: '',
          second_title: '小计',
          total_price: '￥' + data.fabric.transfer.total_price,
          number: data.fabric.transfer.total_number + 'm',
          avg_product: data.fabric.transfer.avg_product + '元/件',
          avg: data.fabric.transfer.avg + '元/米'
        },
        {
          first_title: '',
          second_title: '订单加工成本',
          total_price: '￥' + data.fabric.process.order.total_price,
          number: data.fabric.process.order.total_number + 'm',
          avg_product: data.fabric.process.order.avg_product + '元/件',
          avg: data.fabric.process.order.avg + '元/米'
        },
        {
          first_title: '',
          second_title: '样单加工成本',
          total_price: '￥' + data.fabric.process.sample_order.total_price,
          number: data.fabric.process.sample_order.total_number + 'm',
          avg_product: data.fabric.process.sample_order.avg_product + '元/件',
          avg: data.fabric.process.sample_order.avg + '元/米'
        },
        {
          first_title: '',
          second_title: '小计',
          total_price: '￥' + data.fabric.process.total_price,
          number: data.fabric.process.total_number + 'm',
          avg_product: data.fabric.process.avg_product + '元/件',
          avg: data.fabric.process.avg + '元/米'
        },
        {
          first_title: '',
          second_title: '面料成本合计',
          total_price:
            '￥' +
            this.$toFixed(
              data.fabric.process.total_price + data.fabric.transfer.total_price + data.fabric.order.total_price,
              2,
              true
            ),
          number:
            this.$toFixed(
              data.fabric.process.total_number + data.fabric.transfer.total_number + data.fabric.order.total_number,
              0,
              true
            ) + 'm',
          avg_product: '',
          avg: ''
        },
        {
          first_title: '装饰辅料成本',
          second_title: '订单采购成本',
          total_price: '￥' + data.decorate.order.total_price,
          number: data.decorate.order.total_number + '单位',
          avg_product: data.decorate.order.avg_product + '元/件',
          avg: data.decorate.order.avg + '元/单位'
        },
        {
          first_title: '',
          second_title: '样单采购成本',
          total_price: '￥' + data.decorate.sample_order.total_price,
          number: data.decorate.sample_order.total_number + '单位',
          avg_product: data.decorate.sample_order.avg_product + '元/件',
          avg: data.decorate.sample_order.avg + '元/单位'
        },
        {
          first_title: '',
          second_title: '小计',
          total_price: '￥' + data.decorate.total_price,
          number: data.decorate.total_number + '单位',
          avg_product: data.decorate.avg_product + '元/件',
          avg: data.decorate.avg + '元/单位'
        },
        {
          first_title: '包装辅料成本',
          second_title: '包装辅料成本',
          total_price: '￥' + data.pack.total_price,
          number: data.pack.total_number + '单位',
          avg_product: data.pack.avg_product + '元/件',
          avg: data.pack.avg + '元/单位'
        },
        {
          first_title: '生产加工成本',
          second_title: '订单织造成本',
          total_price: '￥' + data.production.weave.order.total_price,
          number: data.production.weave.order.total_number + '件',
          avg_product: data.production.weave.order.avg_product + '元/件',
          avg: data.production.weave.order.avg + '元/件'
        },
        {
          first_title: '',
          second_title: '样单织造成本',
          total_price: '￥' + data.production.weave.sample_order.total_price,
          number: data.production.weave.sample_order.total_number + '件',
          avg_product: data.production.weave.sample_order.avg_product + '元/件',
          avg: data.production.weave.sample_order.avg + '元/件'
        },
        {
          first_title: '',
          second_title: '小计',
          total_price: '￥' + data.production.weave.total_price,
          number: data.production.weave.total_number + '件',
          avg_product: data.production.weave.avg_product + '元/件',
          avg: data.production.weave.avg + '元/件'
        },
        {
          first_title: '',
          second_title: '订单加工成本',
          total_price: '￥' + data.production.production.order.total_price,
          number: data.production.production.order.total_number + '件',
          avg_product: data.production.production.order.avg_product + '元/件',
          avg: data.production.production.order.avg + '元/件'
        },
        {
          first_title: '',
          second_title: '样单加工成本',
          total_price: '￥' + data.production.production.sample_order.total_price,
          number: data.production.production.sample_order.total_number + '件',
          avg_product: data.production.production.sample_order.avg_product + '元/件',
          avg: data.production.production.sample_order.avg + '元/件'
        },
        {
          first_title: '',
          second_title: '小计',
          total_price: '￥' + data.production.production.total_price,
          number: data.production.production.total_number + '件',
          avg_product: data.production.production.avg_product + '元/件',
          avg: data.production.production.avg + '元/件'
        },
        {
          first_title: '',
          second_title: '生产成本合计',
          total_price: '￥' + data.production.total_price,
          number: data.production.total_number + '件',
          avg_product: data.production.avg_product + '元/件',
          avg: data.production.avg + '元/件'
        },
        {
          first_title: '人工工资成本',
          second_title: '计件工资',
          total_price: '￥' + data.wage.wage_item.total_price,
          number: data.wage.wage_item.total_number + '件',
          avg_product: data.wage.wage_item.avg_product + '元/件',
          avg: data.wage.wage_item.avg + '元/件'
        },
        {
          first_title: '',
          second_title: '计时工资',
          total_price: '￥' + data.wage.wage_time.total_price,
          number: data.wage.wage_time.total_number + '件',
          avg_product: data.wage.wage_time.avg_product + '元/件',
          avg: data.wage.wage_time.avg + '元/件'
        },
        {
          first_title: '',
          second_title: '小计',
          total_price: '￥' + data.wage.total_price,
          number: data.wage.total_number + '件',
          avg_product: data.wage.avg_product + '元/件',
          avg: data.wage.avg + '元/件'
        },
        {
          first_title: '发货运输成本',
          second_title: '发货运输成本',
          total_price: '￥' + data.dispatch.total_price,
          number: data.dispatch.total_number + '件',
          avg_product: data.dispatch.avg_product + '元/件',
          avg: data.dispatch.avg + '元/件'
        },
        {
          first_title: '报销费用',
          second_title: '报销费用',
          total_price: '￥' + data.receipt.total_price,
          number: '',
          avg_product: data.receipt.avg_product + '元/件',
          avg: ''
        },
        {
          first_title: '单位扣款费用',
          second_title: '单位扣款费用',
          total_price: '￥' + data.deduct.total_price,
          number: '',
          avg_product: data.deduct.avg_product + '元/件',
          avg: ''
        }
      ]
        .concat(
          this.other_fee
            .filter((item: any) => item.total_price)
            .map((item: any) => {
              return {
                first_title: '',
                second_title: item.name,
                total_price: '￥' + item.total_price,
                number: '',
                avg_product:
                  this.$toFixed((item.total_price / this.profitAnalysisData.order.total_price) * 100) + '元/件',
                avg: ''
              }
            })
        )
        .concat([
          {
            first_title: '预计利润',
            second_title: '',
            total_price: '￥' + this.realProfit,
            number: '',
            avg_product: this.$toFixed((this.realProfit / this.profitAnalysisData.order.total_price) * 100) + '元/件',
            avg: ''
          }
        ])

      this.$downloadExcel(
        this.profitAnalysisExcelData,
        [
          { title: '', key: 'first_title' },
          { title: '', key: 'second_title' },
          { title: '金额（¥）', key: 'total_price' },
          { title: '数量', key: 'number' },
          { title: '平均类目单价', key: 'avg' },
          { title: '平均每件产品单价', key: 'avg_product' }
        ],
        '利润统计表'
      )
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  computed: {
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    },
    groupList() {
      let groupInfo = this.$store.state.api.group.arr.find((item: any) => {
        return this.filterData.group_id === item.id
      })
      if (groupInfo) {
        this.groupName = groupInfo.name
      }
      return this.$store.state.api.group.arr
    },
    userList() {
      return this.$store.state.api.user.arr
    },
    realProfit(): any {
      const data = this.profitAnalysisData
      return this.$toFixed(
        data.order.order.total_price +
          data.order.sample_order.total_price +
          data.deduct.total_price -
          (data.dispatch.total_price +
            data.fabric.order.total_price +
            data.fabric.process.total_price +
            data.fabric.transfer.total_price +
            data.production.production.total_price +
            data.production.weave.total_price +
            data.receipt.total_price +
            data.wage.wage_item.total_price +
            data.wage.wage_time.total_price +
            data.yarn.order.total_price +
            data.yarn.process.total_price +
            data.yarn.transfer.total_price +
            data.decorate.order.total_price +
            data.decorate.sample_order.total_price +
            data.pack.total_price +
            this.other_fee.reduce((total: number, cur: any) => {
              return Number(cur.total_price.split(',').join('')) + total
            }, 0)),
        2
      )
    }
  },
  created() {
    this.getFilters()
    this.getList()
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
      {
        checkWhich: 'api/clientType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getClientTypeAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
  },
  beforeDestroy() {
    localStorage.create_user_name = ''
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/dataReport/orderStatistics.less';
</style>

<style lang="less">
#orderStatistics {
  .screen {
    overflow: hidden;
  }
  .el-input__inner {
    height: 100% !important;
    line-height: 30px;
    border: 0px;
  }
  .el-tabs__nav-wrap::after {
    background-color: white;
  }
}
</style>