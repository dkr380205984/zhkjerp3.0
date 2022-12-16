<template>
  <div id="paymentDetail"
    class="bodyContainer">
    <div class="module"
      id="基本信息">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">客户简称：</div>
            <div class="text">{{ clientFinancial.name }}</div>
          </div>
          <div class="col">
            <div class="label">客户全称：</div>
            <div class="text">{{ clientFinancial.alias }}</div>
          </div>
          <div class="col">
            <div class="label">客户状态：</div>
            <div class="text">{{ clientFinancial.status === 1 ? '合作中' : '暂停合作' }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">公司地址：</div>
            <div class="text"></div>
          </div>
          <div class="col flex3">
            <div class="label">客户类型：</div>
            <div class="text">{{ clientFinancial.client_type_name }}</div>
          </div>
        </div>
        <div class="label">联系人信息</div>
        <div v-for="(item,index) in clientFinancial.contacts_data"
          :key="item.id">
          <div class="row"
            v-if="index<=1">
            <div class="col specialInfo">
              <div class="info">
                <div class="row"
                  style="margin:0">
                  <div class="col flex3">
                    <div class="label">姓名：</div>
                    <div class="text">{{item.name}}</div>
                  </div>
                  <div class="col flex3">
                    <div class="label">电话：</div>
                    <div class="text">{{item.phone}}</div>
                  </div>
                  <div class="col">
                    <div class="label">职务：</div>
                    <div class="text">{{item.station}}</div>
                  </div>
                  <div class="col">
                    <div class="label">邮箱：</div>
                    <div class="text">{{item.email}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <zh-drop-down :buttonStyle="'padding:20px'"
          v-if="clientFinancial.contacts_data.length > 2"
          position="bottom"
          :show="showContacts"
          hideTitle="展开">
          <div v-for="(item,index) in clientFinancial.contacts_data"
            :key="item.id">
            <div class="row"
              v-if="index>1"
              :style="index === 2?'margin-top:0':''">
              <div class="col specialInfo">
                <div class="info">
                  <div class="row"
                    v-if="index > 1"
                    style="margin:0">
                    <div class="col flex3">
                      <div class="label">姓名：</div>
                      <div class="text">{{item.name}}</div>
                    </div>
                    <div class="col flex3">
                      <div class="label">电话：</div>
                      <div class="text">{{item.phone}}</div>
                    </div>
                    <div class="col">
                      <div class="label">职务：</div>
                      <div class="text">{{item.station}}</div>
                    </div>
                    <div class="col">
                      <div class="label">邮箱：</div>
                      <div class="text">{{item.email}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </zh-drop-down>
        <div class="label">财务信息</div>
        <div v-for="(item,index) in clientFinancial.financial_data"
          :key="item.id">
          <div class="row"
            v-if="index<=1">
            <div class="col specialInfo">
              <div class="info">
                <div class="row"
                  style="margin:0">
                  <div class="col flex3">
                    <div class="label">户名：</div>
                    <div class="text">{{item.account}}</div>
                  </div>
                  <div class="col flex3">
                    <div class="label">纳税识别号：</div>
                    <div class="text">{{item.tax_number}}</div>
                  </div>
                  <div class="col flex3">
                    <div class="label">电话：</div>
                    <div class="text">{{item.phone}}</div>
                  </div>
                  <div class="col">
                    <div class="label">开户行：</div>
                    <div class="text">{{item.bank}}</div>
                  </div>
                  <div class="col">
                    <div class="label">账号：</div>
                    <div class="text">{{item.bank_number}}</div>
                  </div>
                  <div class="col">
                    <div class="label">备注：</div>
                    <div class="text">{{item.desc}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <zh-drop-down :buttonStyle="'padding:20px'"
          v-if="clientFinancial.financial_data.length > 2"
          position="bottom"
          :show="showContacts"
          hideTitle="展开">
          <div v-for="(item,index) in clientFinancial.financial_data"
            :key="item.id">
            <div class="row"
              v-if="index>1"
              :style="index === 2?'margin-top:0':''">
              <div class="col specialInfo">
                <div class="info">
                  <div class="row"
                    v-if="index > 1"
                    style="margin:0">
                    <div class="col flex3">
                      <div class="label">户名：</div>
                      <div class="text">{{item.account}}</div>
                    </div>
                    <div class="col flex3">
                      <div class="label">纳税识别号：</div>
                      <div class="text">{{item.tax_number}}</div>
                    </div>
                    <div class="col flex3">
                      <div class="label">电话：</div>
                      <div class="text">{{item.phone}}</div>
                    </div>
                    <div class="col">
                      <div class="label">开户行：</div>
                      <div class="text">{{item.bank}}</div>
                    </div>
                    <div class="col">
                      <div class="label">账号：</div>
                      <div class="text">{{item.bank_number}}</div>
                    </div>
                    <div class="col">
                      <div class="label">备注：</div>
                      <div class="text">{{item.desc}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </zh-drop-down>
      </div>
    </div>
    <div class="module"
      id="统计报表">
      <el-tabs type="border-card">
        <el-tab-pane label="统计数据">
          <div class="titleCtn"
            style="padding: 0 15px">
            <div class="title">统计报表</div>
          </div>
          <div class="listCtn"
            style="padding-bottom: 0; padding-left: 15px; padding-right: 15px">
            <div class="filterCtn"
              style="margin-bottom: 0">
              <div class="elCtn">
                <el-date-picker v-model="year"
                  @change="getFinancialDetail"
                  value-format="yyyy"
                  type="year"
                  placeholder="选择年">
                </el-date-picker>
              </div>
            </div>
          </div>
          <template v-if="clientType === 2">
            <div class="specialCtn"
              style="padding: 20px 15px">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">计划订购数量</span>
                        <span class="number blue">{{
                            $route.query.type === '装饰辅料单位'
                              ? $toFixed(clientFinancial.total_plan_number / 10000, 3, true)
                              : $toFixed(clientFinancial.total_plan_number / 1000, 3, true)
                          }}
                          <span class="unit">{{
                            $route.query.type === '纱线原料单位'
                              ? '吨'
                              : $route.query.type === '面料原料单位'
                              ? '千米'
                              : '万'
                          }}</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">计划订购总额</span>
                        <span class="number blue">
                          {{ $toFixed(clientFinancial.total_plan_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">实际入库数量</span>
                        <span class="number blue">{{
                            $route.query.type === '装饰辅料单位'
                              ? $toFixed(clientFinancial.total_real_number / 10000, 3, true)
                              : $toFixed(clientFinancial.total_real_number / 1000, 3, true)
                          }}
                          <span class="unit">{{
                            $route.query.type === '纱线原料单位'
                              ? '吨'
                              : $route.query.type === '面料原料单位'
                              ? '千米'
                              : '万'
                          }}</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">实际入库总额</span>
                        <span class="number green">
                          {{ $toFixed(clientFinancial.total_real_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">合计额外费用</span>
                        <span class="number blue">{{ $toFixed(clientFinancial.total_others_fee, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">合计扣款金额</span>
                        <span class="number orange">{{ $toFixed(clientFinancial.total_deduct_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">对方已开票金额</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_invoice_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">我方已付款金额</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_pay_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="infoCtn"
                    style="padding: 0">
                    <p style="margin: 8px 12px">
                      <span style="font-weight: bold">1.补原料统计：</span>
                      <span>共涉及补原料</span>
                      <span class="blue">{{ clientFinancial.sup.number }}kg</span>
                      <span>，需要承担</span>
                      <span class="red">{{ clientFinancial.sup.price }}元</span>
                      <span>，详情见关联页面-补原料单列表。</span>
                    </p>
                    <p style="margin: 8px 12px">
                      <span style="font-weight: bold">2.逾期率统计：</span>
                      <span>共出现逾期</span>
                      <span class="blue">{{ clientFinancial.delay.delay }}次</span>
                      <span>，约占所有单据的</span>
                      <span class="red">{{ clientFinancial.delay.pre }}%</span>
                      <span>，详情见关联页面-生产计划单列表。</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="clientType === 3">
            <div class="specialCtn"
              style="padding: 20px 15px">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">计划加工数量</span>
                        <span class="number blue">{{ $toFixed(clientFinancial.total_plan_number / 1000, 3, true) }}
                          <span class="unit">吨或千米</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">计划加工总额</span>
                        <span class="number blue">
                          {{ $toFixed(clientFinancial.total_plan_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">实际加工数量</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_real_number / 1000, 3, true) }}
                          <span class="unit">吨或千米</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">实际加工总额</span>
                        <span class="number green">
                          {{ $toFixed(clientFinancial.total_real_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">合计额外费用</span>
                        <span class="number blue">{{ $toFixed(clientFinancial.total_others_fee, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">合计扣款金额</span>
                        <span class="number orange">{{ $toFixed(clientFinancial.total_deduct_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">对方已开票金额</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_invoice_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">我方已付款金额</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_pay_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="infoCtn"
                    style="padding: 0">
                    <p style="margin: 8px 12px">
                      <span style="font-weight: bold">1.补原料统计：</span>
                      <span>共涉及补原料</span>
                      <span class="blue">{{ clientFinancial.sup.number }}kg</span>
                      <span>，需要承担</span>
                      <span class="red">{{ clientFinancial.sup.price }}元</span>
                      <span>，详情见关联页面-补原料单列表。</span>
                    </p>
                    <p style="margin: 8px 12px">
                      <span style="font-weight: bold">2.逾期率统计：</span>
                      <span>共出现逾期</span>
                      <span class="blue">{{ clientFinancial.delay.delay }}次</span>
                      <span>，约占所有单据的</span>
                      <span class="red">{{ clientFinancial.delay.pre }}%</span>
                      <span>，详情见关联页面-生产计划单列表。</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="clientType === 4">
            <div class="specialCtn"
              style="padding: 20px 15px">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">计划生产数量</span>
                        <span class="number blue">{{ $toFixed(clientFinancial.total_plan_number / 10000, 3, true) }}
                          <span class="unit">万件</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">计划生产总额</span>
                        <span class="number blue">
                          {{ $toFixed(clientFinancial.total_plan_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">实际生产数量</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_real_number / 10000, 3, true) }}
                          <span class="unit">万件</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">实际生产总额</span>
                        <span class="number green">
                          {{ $toFixed(clientFinancial.total_real_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">合计额外费用</span>
                        <span class="number blue">{{ $toFixed(clientFinancial.total_others_fee, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">合计扣款金额</span>
                        <span class="number orange">{{ $toFixed(clientFinancial.total_deduct_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">对方已开票金额</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_invoice_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">我方已付款金额</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_pay_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="infoCtn"
                    style="padding: 0">
                    <p style="margin: 8px 12px">
                      <span style="font-weight: bold">1.补原料统计：</span>
                      <span>共涉及补原料</span>
                      <span class="blue">{{ clientFinancial.sup.number }}kg</span>
                      <span>，需要承担</span>
                      <span class="red">{{ clientFinancial.sup.price }}元</span>
                      <span>，详情见关联页面-补原料单列表。</span>
                    </p>
                    <p style="margin: 8px 12px">
                      <span style="font-weight: bold">2.检验入库统计：</span>
                      <span>共出现次品</span>
                      <span class="blue">{{ clientFinancial.shoddy.shoddy_number }}件</span>
                      <span>，全次品</span>
                      <span class="red">{{ clientFinancial.shoddy.part_shoddy_number }}件</span>
                      <span>，需扣款</span>
                      <span class="red">{{ clientFinancial.shoddy.deduct_price }}元</span>
                      <span>，详情见关联页面-检验入库单列表。</span>
                    </p>
                    <p style="margin: 8px 12px">
                      <span style="font-weight: bold">3.逾期率统计：</span>
                      <span>共出现逾期</span>
                      <span class="blue">{{ clientFinancial.delay.delay }}次</span>
                      <span>，约占所有单据的</span>
                      <span class="red">{{ clientFinancial.delay.pre }}%</span>
                      <span>，详情见关联页面-生产计划单列表。</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="clientType === 11">
            <div class="specialCtn"
              style="padding: 20px 15px">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">计划订购数量</span>
                        <span class="number blue">{{ $toFixed(clientFinancial.total_plan_number / 10000, 3, true) }}
                          <span class="unit">万个</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">计划订购总额</span>
                        <span class="number blue">
                          {{ $toFixed(clientFinancial.total_plan_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">实际订购数量</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_real_number / 10000, 3, true) }}
                          <span class="unit">万个</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">实际订购总额</span>
                        <span class="number green">
                          {{ $toFixed(clientFinancial.total_real_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">合计额外费用</span>
                        <span class="number blue">{{ $toFixed(clientFinancial.total_others_fee, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">合计扣款金额</span>
                        <span class="number orange">{{ $toFixed(clientFinancial.total_deduct_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">对方已开票金额</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_invoice_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">我方已付款金额</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_pay_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="clientType === 13">
            <div class="specialCtn"
              style="padding: 20px 15px">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">计划发货立方</span>
                        <span class="number blue">{{ $toFixed(clientFinancial.total_plan_number, 3, true) }}
                          <span class="unit">立方</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">计划发货总额</span>
                        <span class="number blue">
                          {{ $toFixed(clientFinancial.total_plan_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">实际发货数量</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_real_number, 3, true) }}
                          <span class="unit">立方</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">实际发货总额</span>
                        <span class="number green">
                          {{ $toFixed(clientFinancial.total_real_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">合计额外费用</span>
                        <span class="number blue">{{ $toFixed(clientFinancial.total_others_fee, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">合计扣款金额</span>
                        <span class="number orange">{{ $toFixed(clientFinancial.total_deduct_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">对方已开票金额</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_invoice_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                    <div class="col">
                      <div class="infoCtn">
                        <span class="title">我方已付款金额</span>
                        <span class="number green">{{ $toFixed(clientFinancial.total_pay_price, 3, true) }}
                          <span class="unit">万元</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="统计图表"
          v-if="$route.query.type === '纱线原料单位' || $route.query.type === '面料原料单位'">
          <div class="titleCtn"
            style="padding: 0 15px">
            <div class="title">统计报表</div>
          </div>
          <div class="listCtn"
            style="padding-bottom: 0; padding-left: 15px; padding-right: 15px">
            <div class="filterCtn"
              style="margin-bottom: 0">
              <div class="elCtn">
                <el-date-picker v-model="staticYear"
                  @change="getStaticData"
                  value-format="yyyy"
                  type="year"
                  placeholder="选择年">
                </el-date-picker>
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: end; padding-right: 50px">
            <div style="width: 150px">
              <el-select v-model="sortWay"
                @change="getStaticData">
                <el-option label="订购数量排序"
                  :value="1"> </el-option>
                <el-option label="入库数量排序"
                  :value="2"> </el-option>
                <el-option label="平均单价排序"
                  :value="3"> </el-option>
              </el-select>
            </div>
          </div>
          <zh-charts :option="optionStatic"
            style="width: 1334px"></zh-charts>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module"
      id="单据列表">
      <el-tabs type="border-card">
        <el-tab-pane label="订购单据">
          <div class="titleCtn"
            style="padding: 0 15px">
            <div class="title">单据列表</div>
          </div>
          <div class="listCtn"
            v-loading="listLoading"
            style="padding-left: 10px; padding-right: 10px">
            <!-- 物料订购 -->
            <template v-if="clientType === 2">
              <div class="filterCtn">
                <div class="elCtn">
                  <el-input v-model="materialOrderFilter.keyword"
                    placeholder="筛选订购单号/订单号"
                    @keydown.enter.native="getBill"></el-input>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialOrderFilter.user_id"
                    placeholder="筛选创建人"
                    clearable>
                    <el-option v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-date-picker v-model="materialOrderFilter.date"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="订购日期"
                    end-placeholder="订购日期"
                    :picker-options="pickerOptions"
                    @change="getBill"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
                <div class="elCtn">
                  <el-date-picker v-model="materialOrderFilter.pushDate"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="入库日期"
                    end-placeholder="入库日期"
                    :picker-options="pickerOptions"
                    @change="getBill"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
                <div class="btn borderBtn"
                  @click="reset">重置</div>
              </div>
              <div class="filterCtn">
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialOrderFilter.group_id"
                    placeholder="筛选负责小组"
                    clearable>
                    <el-option v-for="item in groupList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialOrderFilter.has_invoice"
                    placeholder="筛选开票状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已开票"
                      value="1"></el-option>
                    <el-option label="待开票"
                      value="2"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialOrderFilter.has_pay"
                    placeholder="筛选付款状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已付款"
                      value="1"></el-option>
                    <el-option label="待付款"
                      value="2"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialOrderFilter.has_deduct"
                    placeholder="筛选扣款状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已扣款"
                      value="1"></el-option>
                    <el-option label="待扣款"
                      value="2"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="filterCtn">
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialOrderFilter.is_check"
                    placeholder="筛选审核状态">
                    <el-option value="null"
                      label="全部"></el-option>
                    <el-option value="1"
                      label="已审核"></el-option>
                    <el-option value="2"
                      label="待审核"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-cascader v-if="$route.query.type!=='装饰辅料单位'"
                    placeholder="筛选原料名称"
                    v-model="materialOrderFilter.material_name"
                    :options="yarnTypeList"
                    clearable
                    filterable
                    @change="getBill"></el-cascader>
                  <el-select v-if="$route.query.type==='装饰辅料单位'"
                    v-model="materialOrderFilter.material_name"
                    placeholder="筛选辅料名称"
                    clearable
                    filterable
                    @change="getBill">
                    <el-option v-for="item in decorateMaterialList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="filterCtn"
                style="overflow: hidden">
                <div class="btn backHoverBlue"
                  @click="goPayment(materialOrderCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量付款</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="goInvoice(materialOrderCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量开票</span>
                </div>
                <div class="btn backHoverRed"
                  @click="goDeduct(materialOrderCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量扣款</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="getMatStsList(updatePriceInfo.date)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">更新结算单价</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="changeShowAll(materialOrderList, '', 'showAllFlag')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">{{ showAllFlag ? '全部展开' : '全部收起' }}</span>
                </div>
              </div>
              <div class="filterCtn clearfix">
                <div class="label">已勾选单据：</div>
                <div class="elCtn check"
                  v-for="(item, index) in materialOrderCheckList"
                  :key="item.id">
                  <el-input v-model="item.code"
                    disabled>
                    <template slot="append">
                      <i class="el-icon-close hoverRed"
                        style="cursor: pointer"
                        @click="materialOrderCheckList.splice(index, 1)"></i>
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col"
                    style="flex: 0.1">
                    <el-checkbox v-model="checkAll"
                      @change="(ev) => checkAllInfo(ev, materialOrderList, materialOrderCheckList)">
                    </el-checkbox>
                  </div>
                  <div class="col">订购单号</div>
                  <div class="col">关联单号</div>
                  <div class="col numberWidth">订购数量</div>
                  <div class="col numberWidth">订购金额</div>
                  <div class="col numberWidth">入库数量</div>
                  <div class="col numberWidth">入库金额</div>
                  <div class="col">审核状态</div>
                  <div class="col circleCtn">票据状态</div>
                  <div class="col">创建人</div>
                  <div class="col">创建时间</div>
                  <div class="col">入库时间</div>
                  <div class="col oprWidth">操作</div>
                </div>
                <div v-for="(item, index) in materialOrderList"
                  :key="index">
                  <div class="row">
                    <div class="col"
                      style="flex: 0.1">
                      <el-checkbox v-model="item.checked"
                        @change="(ev) => getCheckInfo(ev, item, materialOrderCheckList)">
                      </el-checkbox>
                    </div>
                    <div class="col blue"
                      style="cursor: pointer"
                      @click="openMaterialOrder(item)"><span>{{ item.code }}
                        <span v-if="item.plan_id">(计划单)</span>
                        <span v-else-if="item.sup_id">(补纱单)</span>
                        <span v-else-if="item.reserve_id">(预订购)</span>
                        <span v-else>(辅料)</span></span>
                    </div>
                    <div class="col blue"
                      style="cursor: pointer"
                      @click="$openUrl('/order/detail?id=' + item.top_order_id)">
                      {{ item.order_code }}
                    </div>
                    <div class="col numberWidth">{{ $toFixed(item.total_number, 3, true) }}</div>
                    <div class="col numberWidth">{{ $toFixed(item.total_price, 3, true) }}</div>
                    <div class="col numberWidth"
                      :class="{ red: item.total_push_number > item.total_number }">
                      {{ $toFixed(item.total_push_number, 3, true) }}
                    </div>
                    <div class="col numberWidth">{{ $toFixed(item.total_push_price, 3, true) }}</div>
                    <div class="col">
                      <div v-if="item.is_check === 0"
                        class="orange">未审核</div>
                      <div v-if="item.is_check === 1"
                        class="blue">已通过</div>
                      <div v-if="item.is_check === 2"
                        class="red">已驳回</div>
                      <div v-if="item.is_check > 2"
                        class="red">异常</div>
                    </div>
                    <div class="col circleCtn">
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'开票金额:' + item.has_invoice + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ blue: Number(item.has_invoice) > 0 }">票</div>
                      </el-tooltip>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'付款金额:' + item.has_pay + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ green: Number(item.has_pay) > 0 }">付</div>
                      </el-tooltip>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'扣款金额:' + item.has_deduct + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ red: Number(item.has_deduct) > 0 }">扣</div>
                      </el-tooltip>
                    </div>
                    <div class="col">{{ item.user_name }}</div>
                    <div class="col">{{ item.created_at }}</div>
                    <div class="col">{{ item.push_time }}</div>
                    <div class="col oprWidth">
                      <span class="opr hoverBlue"
                        @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                    </div>
                  </div>
                  <div v-if="item.isShow"
                    style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
                    <div class="tableCtn"
                      style="padding-top: 0">
                      <template v-if="item.detail.info_data.length > 0">
                        <div v-if="$route.query.type !== '面料原料单位' && $route.query.type !== '纱线原料单位'"
                          class="btn backBlue"
                          style="margin: 12px 24px 12px 0"
                          @click="
                            item.showStock = false
                            $forceUpdate()
                          "
                          :class="{ backGray: !item.showStock }">
                          查看订购信息
                        </div>
                        <div v-if="$route.query.type !== '面料原料单位' && $route.query.type !== '纱线原料单位'"
                          class="btn backBlue"
                          style="margin: 12px 24px 12px 0"
                          @click="
                            item.showStock = true
                            $forceUpdate()
                          "
                          :class="{ backGray: item.showStock }">
                          查看出入库信息
                        </div>
                      </template>
                      <template v-if="!item.showStock">
                        <div class="row">
                          <div class="col">
                            <div class="label">关联计划单：</div>
                            <div :class="item.detail.plan_code ? 'hoverBlue text' : 'text'"
                              :style="item.detail.plan_code ? { cursor: 'pointer' } : {}"
                              @click="
                                item.detail.plan_code
                                  ? $router.push('/materialManage/detail?id=' + item.detail.plan_id)
                                  : ''
                              ">
                              {{ item.detail.plan_code || '无' }}
                            </div>
                          </div>
                          <div class="col"
                            v-if="$route.query.type === '面料原料单位' || $route.query.type === '纱线原料单位'">
                            <div class="label">额外费用：</div>
                            <div class="text">
                              <others-fee-data :data="item.others_fee_data"></others-fee-data>
                            </div>
                          </div>
                          <div class="col">
                            <div class="label">备注信息：</div>
                            <div>
                              {{ item.detail.desc || '无' }}
                            </div>
                          </div>
                        </div>
                        <div class="thead">
                          <div class="trow">
                            <div class="tcol">原料名称</div>
                            <div class="tcol">订购颜色</div>
                            <div class="tcol">计划颜色</div>
                            <div class="tcol">订购属性</div>
                            <div class="tcol">订购数量</div>
                            <div class="tcol"
                              v-if="$route.query.type === '面料原料单位' || $route.query.type === '纱线原料单位'">
                              入库数量
                            </div>
                            <div class="tcol">订购单价</div>
                            <div class="tcol">结算单价</div>
                          </div>
                        </div>
                        <div class="tbody">
                          <div class="trow"
                            v-for="(itemChild, indexChild) in item.detail.info_data"
                            :key="indexChild">
                            <div class="tcol">{{ itemChild.material_name }}</div>
                            <div class="tcol">{{ itemChild.material_color }}</div>
                            <div class="tcol">{{ itemChild.plan_color || itemChild.sup_color }}</div>
                            <div class="tcol">{{ itemChild.attribute }}</div>
                            <div class="tcol">{{ $toFixed(itemChild.number, 3, true) }}{{ itemChild.unit }}</div>
                            <div class="tcol"
                              v-if="$route.query.type === '面料原料单位' || $route.query.type === '纱线原料单位'">
                              {{ $toFixed(itemChild.final_push_number, 3, true) }}
                            </div>
                            <div class="tcol">{{ itemChild.price }}元</div>
                            <div class="tcol">
                              {{ itemChild.settle_price ? itemChild.settle_price + '元' : '暂无' }}
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="item.showStock">
                        <div class="thead">
                          <div class="trow">
                            <div class="tcol">入库仓库</div>
                            <div class="tcol">原料名称</div>
                            <div class="tcol">入库颜色</div>
                            <div class="tcol">入库属性</div>
                            <div class="tcol">入库数量</div>
                          </div>
                        </div>
                        <div class="tbody"
                          v-for="itemChild in item.detail.final_push_log"
                          :key="itemChild.id">
                          <div class="trow"
                            v-for="itemMat in itemChild.info_data"
                            :key="itemMat.id">
                            <div class="tcol">{{ itemChild.store }}/{{ itemChild.secondary_store }}</div>
                            <div class="tcol">{{ itemMat.material_name }}</div>
                            <div class="tcol">{{ itemMat.material_color }}</div>
                            <div class="tcol">{{ itemMat.attribute }}</div>
                            <div class="tcol">{{ $toFixed(itemMat.number, 3, true) }}{{ itemMat.unit }}</div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <div style="margin-top: 20px">
                  <span style="line-height: 35px; margin-left: 40px">
                    合计订购数量：
                    <span class="green"
                      style="font-weight: bold">
                      {{
                        $route.query.type === '装饰辅料单位'
                          ? $toFixed(materialOrderSts.total_order_number / 10000, 3, true)
                          : $toFixed(materialOrderSts.total_order_number / 1000, 3, true)
                      }}
                      <span class="unit">{{
                        $route.query.type === '纱线原料单位'
                          ? '吨'
                          : $route.query.type === '面料原料单位'
                          ? '千米'
                          : '万'
                      }}</span>
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计订购金额：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(materialOrderSts.total_order_price / 10000, 3, true) }} 万元
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计入库数量：
                    <span class="green"
                      style="font-weight: bold">
                      {{
                        $route.query.type === '装饰辅料单位'
                          ? $toFixed(materialOrderSts.total_push_number / 10000, 3, true)
                          : $toFixed(materialOrderSts.total_push_number / 1000, 3, true)
                      }}
                      <span class="unit">{{
                        $route.query.type === '纱线原料单位'
                          ? '吨'
                          : $route.query.type === '面料原料单位'
                          ? '千米'
                          : '万'
                      }}</span>
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计入库金额：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(materialOrderSts.total_push_price / 10000, 3, true) }} 万元
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计额外费用：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(materialOrderSts.total_others_fee / 10000, 3, true) }} 万元
                    </span>
                  </span>
                </div>
              </div>
            </template>
            <!-- 物料加工 -->
            <template v-else-if="clientType === 3">
              <div class="filterCtn">
                <div class="elCtn">
                  <el-input v-model="materialProcessFilter.keyword"
                    placeholder="筛选订购单号/订单号"
                    @keydown.enter.native="getBill"></el-input>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialProcessFilter.user_id"
                    placeholder="筛选创建人"
                    clearable>
                    <el-option v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-date-picker v-model="materialProcessFilter.date"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="getBill"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialProcessFilter.is_check"
                    placeholder="筛选审核状态">
                    <el-option value="null"
                      label="全部"></el-option>
                    <el-option value="1"
                      label="已审核"></el-option>
                    <el-option value="2"
                      label="待审核"></el-option>
                  </el-select>
                </div>
                <div class="btn borderBtn"
                  @click="reset">重置</div>
              </div>
              <div class="filterCtn">
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialProcessFilter.group_id"
                    placeholder="筛选负责小组"
                    clearable>
                    <el-option v-for="item in groupList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialProcessFilter.has_invoice"
                    placeholder="筛选开票状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已开票"
                      value="1"></el-option>
                    <el-option label="待开票"
                      value="2"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialProcessFilter.has_pay"
                    placeholder="筛选付款状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已付款"
                      value="1"></el-option>
                    <el-option label="待付款"
                      value="2"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="materialProcessFilter.has_deduct"
                    placeholder="筛选扣款状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已扣款"
                      value="1"></el-option>
                    <el-option label="待扣款"
                      value="2"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="filterCtn">
                <div class="elCtn">
                  <el-cascader placeholder="筛选原料名称"
                    v-model="materialProcessFilter.material_name"
                    :options="yarnTypeList"
                    clearable
                    filterable
                    @change="getBill"></el-cascader>
                </div>
                <div class="btn backHoverBlue"
                  @click="goPayment(materialProcessCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量付款</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="goInvoice(materialProcessCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量开票</span>
                </div>
                <div class="btn backHoverRed"
                  @click="goDeduct(materialProcessCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量扣款</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="changeShowAll(materialProcessList, '', 'showAllFlag')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">{{ showAllFlag ? '全部展开' : '全部收起' }}</span>
                </div>
              </div>
              <div class="filterCtn clearfix">
                <div class="label">已勾选单据：</div>
                <div class="elCtn check"
                  v-for="(item, index) in materialProcessCheckList"
                  :key="item.id">
                  <el-input v-model="item.code"
                    disabled>
                    <template slot="append">
                      <i class="el-icon-close hoverRed"
                        style="cursor: pointer"
                        @click="materialProcessCheckList.splice(index, 1)"></i>
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col"
                    style="flex: 0.1">
                    <el-checkbox v-model="checkAll"
                      @change="(ev) => checkAllInfo(ev, materialProcessList, materialProcessCheckList)">
                    </el-checkbox>
                  </div>
                  <div class="col">加工单号</div>
                  <div class="col">关联单号</div>
                  <div class="col numberWidth">加工数量</div>
                  <div class="col numberWidth">加工金额</div>
                  <div class="col numberWidth">完成数量</div>
                  <div class="col numberWidth">完成金额</div>
                  <div class="col">审核状态</div>
                  <div class="col circleCtn">票据状态</div>
                  <div class="col">创建人</div>
                  <div class="col">创建时间</div>
                  <div class="col oprWidth">操作</div>
                </div>
                <div v-for="(item, index) in materialProcessList"
                  :key="index">
                  <div class="row">
                    <div class="col"
                      style="flex: 0.1">
                      <el-checkbox v-model="item.checked"
                        @change="(ev) => getCheckInfo(ev, item, materialProcessCheckList)"></el-checkbox>
                    </div>
                    <div class="col blue"
                      style="cursor: pointer"
                      @click="$openUrl('/materialManage/detail?id=' + item.plan_id)">
                      {{ item.code }}
                    </div>
                    <div class="col blue"
                      style="cursor: pointer"
                      @click="$openUrl('/order/detail?id=' + item.top_order_id)">
                      {{ item.order_code || '无编号' }}
                    </div>
                    <div class="col numberWidth">{{ $toFixed(item.total_number, 3, true) }}</div>
                    <div class="col numberWidth">{{ $toFixed(item.total_price, 3, true) }}</div>
                    <div class="col numberWidth"
                      :class="{ red: Number(item.total_push_number) < Number(item.total_number) }">
                      {{ $toFixed(item.total_push_number, 3, true) }}
                    </div>
                    <div class="col numberWidth">{{ $toFixed(item.total_push_price, 3, true) }}</div>
                    <div class="col">
                      <div v-if="item.is_check === 0"
                        class="orange">未审核</div>
                      <div v-if="item.is_check === 1"
                        class="blue">已通过</div>
                      <div v-if="item.is_check === 2"
                        class="red">已驳回</div>
                      <div v-if="item.is_check > 2"
                        class="red">异常</div>
                    </div>
                    <div class="col circleCtn">
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'开票金额:' + item.has_invoice + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ blue: Number(item.has_invoice) > 0 }">票</div>
                      </el-tooltip>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'付款金额:' + item.has_pay + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ green: Number(item.has_pay) > 0 }">付</div>
                      </el-tooltip>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'扣款金额:' + item.has_deduct + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ red: Number(item.has_deduct) > 0 }">扣</div>
                      </el-tooltip>
                    </div>
                    <div class="col">{{ item.user_name }}</div>
                    <div class="col">{{ item.created_at }}</div>
                    <div class="col oprWidth">
                      <span class="opr hoverBlue"
                        @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                    </div>
                  </div>
                  <div v-if="item.isShow"
                    style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
                    <div class="tableCtn"
                      v-if="item.detail.info_data.length > 0">
                      <div class="row">
                        <div class="col">
                          <div class="label">关联单据：</div>
                          <div :class="item.detail.plan_code ? 'hoverBlue text' : 'text'"
                            :style="item.detail.plan_code ? { cursor: 'pointer' } : {}"
                            @click="
                              item.detail.plan_code
                                ? $router.push('/materialManage/detail?id=' + item.detail.plan_id)
                                : ''
                            ">
                            {{ item.detail.plan_code || '无' }}
                          </div>
                        </div>
                        <div class="col">
                          <div class="label">额外费用：</div>
                          <div class="text">
                            <others-fee-data :data="item.others_fee_data"></others-fee-data>
                          </div>
                        </div>
                        <div class="col">
                          <div class="label">备注信息：</div>
                          <div>
                            {{ item.detail.desc || '无' }}
                          </div>
                        </div>
                      </div>
                      <div class="thead">
                        <div class="trow">
                          <div class="tcol">加工单位</div>
                          <div class="tcol"
                            style="flex: 0.5">工序</div>
                          <div class="tcol noPad"
                            style="flex: 3">
                            <div class="trow">
                              <div class="tcol">纱线名称</div>
                              <div class="tcol">加工详情</div>
                              <div class="tcol"
                                style="flex: 0.5">数量</div>
                              <div class="tcol"
                                style="flex: 0.5">完成数量</div>
                              <div class="tcol"
                                style="flex: 0.5">单价</div>
                            </div>
                          </div>
                          <div class="tcol"
                            style="flex: 0.8">截止日期</div>
                        </div>
                      </div>
                      <div class="tbody"
                        style="font-size: 14px">
                        <div class="trow">
                          <div class="tcol">{{ item.detail.client_name }}</div>
                          <div class="tcol"
                            style="flex: 0.5">{{ item.detail.process }}</div>
                          <div class="tcol noPad"
                            style="flex: 3">
                            <div class="trow"
                              v-for="(itemMat, indexMat) in item.detail.info_data"
                              :key="indexMat">
                              <div class="tcol">
                                {{ itemMat.material_order_name || itemMat.material_transfer_name }}
                              </div>
                              <div class="tcol">
                                <template v-if="item.detail.process === '染色'">
                                  <div class="changeCtn">
                                    <span>白胚</span>
                                    <span class="el-icon-s-unfold blue"></span>
                                    <span>{{ itemMat.after_color }}</span>
                                  </div>
                                </template>
                                <template v-if="item.detail.process === '倒纱'">
                                  <div class="changeCtn">
                                    <span>{{ itemMat.before_attribute }}</span>
                                    <span class="el-icon-s-unfold blue"></span>
                                    <span>{{ itemMat.after_attribute }}</span>
                                  </div>
                                </template>
                                <template v-if="item.detail.process === '并线'">
                                  <span>{{ itemMat.bingxian_desc }}</span>
                                </template>
                                <template v-if="item.detail.process === '膨纱'">
                                  <span>{{ itemMat.pengsha_desc }}</span>
                                </template>
                                <template v-if="item.detail.process === '切割'">
                                  <span>{{ itemMat.qiege_desc }}</span>
                                </template>
                              </div>
                              <div class="tcol"
                                style="flex: 0.5">
                                {{ $toFixed(itemMat.number, 3, true) }}{{ itemMat.unit }}
                              </div>
                              <div class="tcol"
                                style="flex: 0.5">
                                {{ $toFixed(itemMat.push_number, 3, true) }}
                              </div>
                              <div class="tcol"
                                style="flex: 0.5">{{ itemMat.price }}元</div>
                            </div>
                          </div>
                          <div class="tcol"
                            style="flex: 0.8">{{ item.detail.delivery_time }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="margin-top: 20px">
                  <span style="line-height: 35px; margin-left: 40px">
                    合计加工数量：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(materialProcessSts.total_number / 1000, 3, true) }} 吨或千米
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计加工金额：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(materialProcessSts.total_price / 10000, 3, true) }} 万元
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计完成数量：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(materialProcessSts.total_push_number / 1000, 3, true) }} 吨或千米
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计完成金额：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(materialProcessSts.total_push_price / 10000, 3, true) }} 万元
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计额外费用：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(materialProcessSts.total_others_fee / 10000, 3, true) }} 万元
                    </span>
                  </span>
                </div>
              </div>
            </template>
            <!-- 生产织造 -->
            <template v-else-if="clientType === 4">
              <div class="filterCtn">
                <div class="elCtn">
                  <el-input v-model="productionPlanFilter.keyword"
                    placeholder="筛选订购单号/订单号"
                    @keydown.enter.native="getBill"></el-input>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="productionPlanFilter.user_id"
                    placeholder="筛选创建人"
                    clearable>
                    <el-option v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-date-picker v-model="productionPlanFilter.date"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="getBill"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="productionPlanFilter.is_check"
                    placeholder="筛选审核状态">
                    <el-option value="null"
                      label="全部"></el-option>
                    <el-option value="1"
                      label="已审核"></el-option>
                    <el-option value="2"
                      label="待审核"></el-option>
                  </el-select>
                </div>
                <div class="btn borderBtn"
                  @click="reset">重置</div>
              </div>
              <div class="filterCtn">
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="productionPlanFilter.group_id"
                    placeholder="筛选负责小组"
                    clearable>
                    <el-option v-for="item in groupList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="productionPlanFilter.has_invoice"
                    placeholder="筛选开票状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已开票"
                      value="1"></el-option>
                    <el-option label="待开票"
                      value="2"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="productionPlanFilter.has_pay"
                    placeholder="筛选付款状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已付款"
                      value="1"></el-option>
                    <el-option label="待付款"
                      value="2"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="productionPlanFilter.has_deduct"
                    placeholder="筛选扣款状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已扣款"
                      value="1"></el-option>
                    <el-option label="待扣款"
                      value="2"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue"
                  @click="goPayment(productionPlanCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量付款</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="goInvoice(productionPlanCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量开票</span>
                </div>
                <div class="btn backHoverRed"
                  @click="goDeduct(productionPlanCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量扣款</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="changeShowAll(productionPlanList, '', 'showAllFlag')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">{{ showAllFlag ? '全部展开' : '全部收起' }}</span>
                </div>
              </div>
              <div class="filterCtn clearfix">
                <div class="label">已勾选单据：</div>
                <div class="elCtn check"
                  v-for="(item, index) in productionPlanCheckList"
                  :key="item.id">
                  <el-input v-model="item.code"
                    disabled>
                    <template slot="append">
                      <i class="el-icon-close hoverRed"
                        style="cursor: pointer"
                        @click="productionPlanCheckList.splice(index, 1)"></i>
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col"
                    style="flex: 0.1">
                    <el-checkbox v-model="checkAll"
                      @change="(ev) => checkAllInfo(ev, productionPlanList, productionPlanCheckList)">
                    </el-checkbox>
                  </div>
                  <div class="col">生产单号</div>
                  <div class="col">关联单号</div>
                  <div class="col numberWidth">计划数量</div>
                  <div class="col numberWidth">计划金额</div>
                  <div class="col numberWidth">完成数量</div>
                  <div class="col numberWidth">半次/全次数</div>
                  <div class="col">审核状态</div>
                  <div class="col circleCtn">票据状态</div>
                  <div class="col">创建人</div>
                  <div class="col">创建时间</div>
                  <div class="col oprWidth">操作</div>
                </div>
                <div v-for="(item, index) in productionPlanList"
                  :key="index">
                  <div class="row">
                    <div class="col"
                      style="flex: 0.1">
                      <el-checkbox v-model="item.checked"
                        @change="(ev) => getCheckInfo(ev, item, productionPlanCheckList)"></el-checkbox>
                    </div>
                    <div class="col blue"
                      style="cursor: pointer"
                      @click="
                        $openUrl(
                          '/productionPlan/detail?id=' + item.top_order_id + '&sampleOrderIndex=' + item.order_id
                        )
                      ">
                      {{ item.code }}
                    </div>
                    <div class="col blue"
                      style="cursor: pointer"
                      @click="$openUrl('/order/detail?id=' + item.top_order_id)">
                      {{ item.order_code }}
                    </div>
                    <div class="col numberWidth">{{ $toFixed(item.total_number, 3, true) }}</div>
                    <div class="col numberWidth">{{ $toFixed(item.total_price, 3, true) }}</div>
                    <div class="col numberWidth"
                      :class="{ red: Number(item.total_real_number) < Number(item.total_number) }">
                      {{ $toFixed(item.total_real_number, 3, true) }} ({{
                        Number(item.total_real_number) > Number(item.total_number) ? '+' : ''
                      }}{{
                        parseInt(
                          ((Number(item.total_real_number) - Number(item.total_number)) / Number(item.total_number)) *
                            100
                        ) + '%'
                      }})
                    </div>
                    <div class="col numberWidth">
                      {{ item.total_part_shoddy_number }}/{{ item.total_shoddy_number }}
                    </div>
                    <div class="col">
                      <div v-if="item.is_check === 0"
                        class="orange">未审核</div>
                      <div v-if="item.is_check === 1"
                        class="blue">已通过</div>
                      <div v-if="item.is_check === 2"
                        class="red">已驳回</div>
                      <div v-if="item.is_check > 2"
                        class="red">异常</div>
                    </div>
                    <div class="col circleCtn">
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'开票金额:' + item.has_invoice + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ blue: Number(item.has_invoice) > 0 }">票</div>
                      </el-tooltip>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'付款金额:' + item.has_pay + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ green: Number(item.has_pay) > 0 }">付</div>
                      </el-tooltip>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'扣款金额:' + item.has_deduct + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ red: Number(item.has_deduct) > 0 }">扣</div>
                      </el-tooltip>
                    </div>
                    <div class="col">{{ item.user_name }}</div>
                    <div class="col">{{ item.created_at }}</div>
                    <div class="col oprWidth">
                      <span class="opr hoverBlue"
                        @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                    </div>
                  </div>
                  <div v-if="item.isShow"
                    style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
                    <div class="titleCtn">
                      <div class="title">基本信息</div>
                    </div>
                    <div class="detailCtn"
                      style="padding-bottom: 0">
                      <div class="row">
                        <div class="col">
                          <div class="label">加工工序：</div>
                          <div class="text">{{ item.detail.process_name || '无' }}</div>
                        </div>
                        <div class="col">
                          <div class="label">工序说明：</div>
                          <div class="text">{{ item.detail.process_desc || '无' }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="tableCtn">
                      <div class="thead">
                        <div class="trow">
                          <div class="tcol">计划生产费用</div>
                          <div class="tcol">实际生产费用</div>
                          <div class="tcol">额外费用</div>
                          <div class="tcol">扣款费用</div>
                          <div class="tcol">补原料承担费用</div>
                          <div class="tcol">计划合计费用</div>
                          <div class="tcol">实际合计费用</div>
                        </div>
                      </div>
                      <div class="tbody">
                        <div class="trow">
                          <div class="tcol green">{{ $toFixed(item.total_price - item.others_fee, 3, true) }}元</div>
                          <div class="tcol green">{{ $toFixed(item.real_fee, 3, true) }}元</div>
                          <div class="tcol"
                            :class="{ green: item.others_fee > 0, gray: item.others_fee === 0 }">
                            {{ $toFixed(item.others_fee, 3, true) }}元
                          </div>
                          <div class="tcol"
                            :class="{ red: item.deduct_fee > 0, gray: item.deduct_fee === 0 }">
                            {{ $toFixed(item.deduct_fee, 3, true) }}元
                          </div>
                          <div class="tcol"
                            :class="{ red: item.sup_fee > 0, gray: item.sup_fee === 0 }">
                            {{ $toFixed(item.sup_fee, 3, true) }}元
                          </div>
                          <div class="tcol green">
                            {{ $toFixed(item.total_price - item.deduct_fee - item.sup_fee, 3, true) }}元
                          </div>
                          <div class="tcol green">
                            {{ $toFixed(item.real_fee + item.others_fee - item.deduct_fee - item.sup_fee, 3, true) }}元
                          </div>
                        </div>
                        <div class="trow">
                          <div class="tcol gray">详情见下表</div>
                          <div class="tcol gray">详情见下表</div>
                          <div class="tcol gray">详情见上方</div>
                          <div class="tcol">
                            <span style="cursor: pointer"
                              :class="item.deduct_data && item.deduct_data.length > 0 ? 'blue' : 'gray'"
                              @click="getDeduct(item.deduct_data)">扣款费用明细</span>
                          </div>
                          <div class="tcol gray">详情见下表</div>
                          <div class="tcol gray">计划费用</div>
                          <div class="tcol gray">实际费用</div>
                        </div>
                      </div>
                    </div>
                    <div class="tableCtn">
                      <div class="thead">
                        <div class="trow">
                          <div class="tcol">产品信息</div>
                          <div class="tcol">产品部位</div>
                          <div class="tcol">尺码颜色</div>
                          <div class="tcol">加工数量</div>
                          <div class="tcol">检验/完成数量</div>
                          <div class="tcol">加工单价</div>
                          <div class="tcol">加工总价</div>
                          <div class="tcol">检验/完成总价</div>
                        </div>
                      </div>
                      <div class="tbody">
                        <div class="trow"
                          v-for="(itemPro, indexPro) in item.detail.product_info_data"
                          :key="indexPro">
                          <div class="tcol hoverBlue"
                            style="cursor: pointer"
                            @click="showProduct(itemPro)">
                            <span>{{ itemPro.product_code || itemPro.system_code }}</span>
                            <span>{{ itemPro.category_name }}/{{ itemPro.secondary_category_name }}</span>
                          </div>
                          <div class="tcol">
                            {{ itemPro.part_name }}
                          </div>
                          <div class="tcol">
                            {{ itemPro.size_name ? itemPro.size_name + '/' + itemPro.color_name : '未选择尺码颜色' }}
                          </div>
                          <div class="tcol">{{ $toFixed(itemPro.number, 3, true) }}</div>
                          <div class="tcol">{{ $toFixed(itemPro.inspection_number || 0, 3, true) }}</div>
                          <div class="tcol">{{ itemPro.price }}元</div>
                          <div class="tcol">{{ $toFixed(itemPro.price * itemPro.number, 3, true) }}元</div>
                          <div class="tcol">{{ $toFixed(itemPro.inspection_price, 3, true) }}元</div>
                        </div>
                      </div>
                    </div>
                    <div class="titleCtn"
                      style="margin-top: 40px"
                      v-if="item.detail.sup_data.length > 0">
                      <div class="title">加工物料补充</div>
                    </div>
                    <div class="tableCtn"
                      v-if="item.detail.sup_data.length > 0">
                      <div class="thead">
                        <div class="trow">
                          <div class="tcol">补纱单编号</div>
                          <div class="tcol noPad"
                            style="flex: 2">
                            <div class="trow">
                              <div class="tcol">承担单位</div>
                              <div class="tcol">承担金额</div>
                            </div>
                          </div>
                          <div class="tcol noPad"
                            style="flex: 3">
                            <div class="trow">
                              <div class="tcol">物料名称</div>
                              <div class="tcol">物料颜色</div>
                              <div class="tcol">物料数量</div>
                            </div>
                          </div>
                          <div class="tcol">备注信息</div>
                        </div>
                      </div>
                      <div class="tbody">
                        <div class="trow"
                          v-for="itemChild in item.detail.sup_data"
                          :key="itemChild.id">
                          <div class="tcol">{{ itemChild.code }}</div>
                          <div class="tcol noPad"
                            style="flex: 2">
                            <div class="trow"
                              v-for="(itemClient, indexClient) in itemChild.client_data"
                              :key="indexClient">
                              <div class="tcol">{{ itemClient.bear_client_name }}</div>
                              <div class="tcol">{{ itemClient.bear_price }}元</div>
                            </div>
                          </div>
                          <div class="tcol noPad"
                            style="flex: 3">
                            <div class="trow"
                              v-for="itemMat in itemChild.info_data"
                              :key="itemMat.id">
                              <div class="tcol">{{ itemMat.material_name }}</div>
                              <div class="tcol">{{ itemMat.material_color }}</div>
                              <div class="tcol">{{ itemMat.number }}{{ itemMat.unit }}</div>
                            </div>
                          </div>
                          <div class="tcol">{{ itemChild.desc }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="margin-top: 20px">
                  <span style="line-height: 35px; margin-left: 40px">
                    合计计划数量：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(productionPlanSts.total_number / 10000, 3, true) }} 万件
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计计划金额：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(productionPlanSts.total_price / 10000, 3, true) }} 万元
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计完成数量：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(productionPlanSts.total_real_number / 10000, 3, true) }} 万件
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计完成金额：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(productionPlanSts.total_real_price / 10000, 3, true) }} 万元
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计额外费用：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(productionPlanSts.total_others_fee / 10000, 3, true) }} 万元
                    </span>
                  </span>
                </div>
              </div>
            </template>
            <!-- 包装订购 -->
            <template v-else-if="clientType === 11">
              <div class="filterCtn">
                <div class="elCtn">
                  <el-input v-model="packOrderFilter.keyword"
                    placeholder="筛选订购单号/订单号"
                    @keydown.enter.native="getBill"></el-input>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="packOrderFilter.user_id"
                    placeholder="筛选创建人"
                    clearable>
                    <el-option v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-date-picker v-model="packOrderFilter.date"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="getBill"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="packOrderFilter.is_check"
                    placeholder="筛选审核状态">
                    <el-option value="null"
                      label="全部"></el-option>
                    <el-option value="1"
                      label="已审核"></el-option>
                    <el-option value="2"
                      label="待审核"></el-option>
                  </el-select>
                </div>
                <div class="btn borderBtn"
                  @click="reset">重置</div>
              </div>
              <div class="filterCtn">
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="packOrderFilter.group_id"
                    placeholder="筛选负责小组"
                    clearable>
                    <el-option v-for="item in groupList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="packOrderFilter.has_invoice"
                    placeholder="筛选开票状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已开票"
                      value="1"></el-option>
                    <el-option label="待开票"
                      value="2"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="packOrderFilter.has_pay"
                    placeholder="筛选付款状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已付款"
                      value="1"></el-option>
                    <el-option label="待付款"
                      value="2"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="packOrderFilter.has_deduct"
                    placeholder="筛选扣款状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已扣款"
                      value="1"></el-option>
                    <el-option label="待扣款"
                      value="2"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue"
                  @click="goPayment(packOrderCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量付款</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="goInvoice(packOrderCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量开票</span>
                </div>
                <div class="btn backHoverRed"
                  @click="goDeduct(packOrderCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量扣款</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="changeShowAll(packOrderList, '', 'showAllFlag')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">{{ showAllFlag ? '全部展开' : '全部收起' }}</span>
                </div>
              </div>
              <div class="filterCtn clearfix">
                <div class="label">已勾选单据：</div>
                <div class="elCtn check"
                  v-for="(item, index) in packOrderCheckList"
                  :key="item.id">
                  <el-input v-model="item.code"
                    disabled>
                    <template slot="append">
                      <i class="el-icon-close hoverRed"
                        style="cursor: pointer"
                        @click="packOrderCheckList.splice(index, 1)"></i>
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col"
                    style="flex: 0.1">
                    <el-checkbox v-model="checkAll"
                      @change="(ev) => checkAllInfo(ev, packOrderList, packOrderCheckList)">
                    </el-checkbox>
                  </div>
                  <div class="col">订购单号</div>
                  <div class="col">关联单号</div>
                  <div class="col numberWidth">订购数量</div>
                  <div class="col numberWidth">订购金额</div>
                  <div class="col">审核状态</div>
                  <div class="col circleCtn">票据状态</div>
                  <div class="col">创建人</div>
                  <div class="col">创建时间</div>
                  <div class="col oprWidth">操作</div>
                </div>
                <div v-for="(item, index) in packOrderList"
                  :key="index">
                  <div class="row">
                    <div class="col"
                      style="flex: 0.1">
                      <el-checkbox v-model="item.checked"
                        @change="(ev) => getCheckInfo(ev, item, packOrderCheckList)"></el-checkbox>
                    </div>
                    <div class="col blue"
                      style="cursor: pointer"
                      @click="$openUrl('/packManage/detail?id=' + item.top_order_id)">
                      {{ item.code }}
                    </div>
                    <div class="col blue"
                      style="cursor: pointer"
                      @click="
                        $openUrl(
                          '/productionPlan/detail?id=' + item.top_order_id + '&sampleOrderIndex=' + item.order_id
                        )
                      ">
                      {{ item.order_code }}
                    </div>
                    <div class="col numberWidth">{{ $toFixed(item.total_number, 3, true) }}</div>
                    <div class="col numberWidth">{{ $toFixed(item.total_price, 3, true) }}</div>
                    <div class="col">
                      <div v-if="item.is_check === 0"
                        class="orange">未审核</div>
                      <div v-if="item.is_check === 1"
                        class="blue">已通过</div>
                      <div v-if="item.is_check === 2"
                        class="red">已驳回</div>
                      <div v-if="item.is_check > 2"
                        class="red">异常</div>
                    </div>
                    <div class="col circleCtn">
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'开票金额:' + item.has_invoice + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ blue: Number(item.has_invoice) > 0 }">票</div>
                      </el-tooltip>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'付款金额:' + item.has_pay + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ green: Number(item.has_pay) > 0 }">付</div>
                      </el-tooltip>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'扣款金额:' + item.has_deduct + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ red: Number(item.has_deduct) > 0 }">扣</div>
                      </el-tooltip>
                    </div>
                    <div class="col">{{ item.user_name }}</div>
                    <div class="col">{{ item.created_at }}</div>
                    <div class="col oprWidth">
                      <span class="opr hoverBlue"
                        @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                    </div>
                  </div>
                  <div v-if="item.isShow"
                    style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
                    <div class="tableCtn">
                      <div class="thead">
                        <div class="trow">
                          <div class="tcol">包装名称</div>
                          <div class="tcol">包装规格</div>
                          <div class="tcol">属性或说明</div>
                          <div class="tcol">面积单价</div>
                          <div class="tcol">数量单价</div>
                          <div class="tcol">订购数量</div>
                          <div class="tcol">备注信息</div>
                        </div>
                      </div>
                      <div class="tbody">
                        <div class="trow"
                          v-for="(itemChild, indexChild) in item.detail.info_data"
                          :key="indexChild">
                          <div class="tcol">{{ itemChild.pack_material_name }}</div>
                          <div class="tcol">
                            <template v-if="Number(itemChild.price_type) === 1">
                              {{ itemChild.length }}*{{ itemChild.width }}*{{ itemChild.height }}cm
                            </template>
                            <template v-else-if="Number(itemChild.price_type) === 2">
                              {{ itemChild.length }}*{{ itemChild.width }}cm
                            </template>
                            <template v-else-if="Number(itemChild.price_type) === 3">
                              {{ itemChild.length }}
                            </template>
                          </div>
                          <div class="tcol">{{ itemChild.desc }}</div>
                          <div class="tcol">{{ itemChild.bulk_price ? itemChild.bulk_price + '元' : '-' }}</div>
                          <div class="tcol">{{ itemChild.count_price ? itemChild.count_price + '元' : '-' }}</div>
                          <div class="tcol">{{ $toFixed(itemChild.number, 3, true) }}</div>
                          <div class="tcol">{{ itemChild.desc }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="margin-top: 20px">
                  <span style="line-height: 35px; margin-left: 40px">
                    合计订购数量：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(packOrderSts.total_number / 10000, 3, true) }} 万个
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计订购金额：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(packOrderSts.total_price / 10000, 3, true) }} 万元
                    </span>
                  </span>
                  <span style="line-height: 35px; margin-left: 40px">
                    合计额外费用：
                    <span class="green"
                      style="font-weight: bold">
                      {{ $toFixed(packOrderSts.total_others_fee / 10000, 3, true) }} 万元
                    </span>
                  </span>
                </div>
              </div>
            </template>
            <!-- 发货单 -->
            <template v-else-if="clientType === 13">
              <div class="filterCtn">
                <div class="elCtn">
                  <el-input v-model="boxManageFilter.keyword"
                    placeholder="筛选订购单号/订单号"
                    @keydown.enter.native="getBill"></el-input>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="boxManageFilter.user_id"
                    placeholder="筛选创建人"
                    clearable>
                    <el-option v-for="item in userList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-date-picker v-model="boxManageFilter.date"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    @change="getBill"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="boxManageFilter.is_check"
                    placeholder="筛选审核状态">
                    <el-option value="null"
                      label="全部"></el-option>
                    <el-option value="1"
                      label="已审核"></el-option>
                    <el-option value="2"
                      label="待审核"></el-option>
                  </el-select>
                </div>
                <div class="btn borderBtn"
                  @click="reset">重置</div>
              </div>
              <div class="filterCtn">
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="boxManageFilter.group_id"
                    placeholder="筛选负责小组"
                    clearable>
                    <el-option v-for="item in groupList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="boxManageFilter.has_invoice"
                    placeholder="筛选开票状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已开票"
                      value="1"></el-option>
                    <el-option label="待开票"
                      value="2"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="boxManageFilter.has_pay"
                    placeholder="筛选付款状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已付款"
                      value="1"></el-option>
                    <el-option label="待付款"
                      value="2"></el-option>
                  </el-select>
                </div>
                <div class="elCtn">
                  <el-select @change="getBill"
                    v-model="boxManageFilter.has_deduct"
                    placeholder="筛选扣款状态"
                    clearable>
                    <el-option label="全部"
                      value="null"></el-option>
                    <el-option label="已扣款"
                      value="1"></el-option>
                    <el-option label="待扣款"
                      value="2"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue"
                  @click="goPayment(packOrderCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量付款</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="goInvoice(packOrderCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量开票</span>
                </div>
                <div class="btn backHoverRed"
                  @click="goDeduct(packOrderCheckList)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">批量扣款</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="changeShowAll(boxManageList, '', 'showAllFlag')">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">{{ showAllFlag ? '全部展开' : '全部收起' }}</span>
                </div>
              </div>
              <div class="filterCtn clearfix">
                <div class="label">已勾选单据：</div>
                <div class="elCtn check"
                  v-for="(item, index) in packOrderCheckList"
                  :key="item.id">
                  <el-input v-model="item.code"
                    disabled>
                    <template slot="append">
                      <i class="el-icon-close hoverRed"
                        style="cursor: pointer"
                        @click="packOrderCheckList.splice(index, 1)"></i>
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col"
                    style="flex: 0.1">
                    <el-checkbox v-model="checkAll"
                      @change="(ev) => checkAllInfo(ev, packOrderList, boxManageCheckList)">
                    </el-checkbox>
                  </div>
                  <div class="col">发货单号</div>
                  <div class="col numberWidth">运输立方</div>
                  <div class="col numberWidth">运输金额</div>
                  <div class="col">审核状态</div>
                  <div class="col circleCtn">票据状态</div>
                  <div class="col">创建人</div>
                  <div class="col">创建时间</div>
                  <div class="col oprWidth">操作</div>
                </div>
                <div v-for="(item, index) in boxManageList"
                  :key="index">
                  <div class="row">
                    <div class="col"
                      style="flex: 0.1">
                      <el-checkbox v-model="item.checked"
                        @change="(ev) => getCheckInfo(ev, item, boxManageCheckList)"></el-checkbox>
                    </div>
                    <div class="col blue"
                      style="cursor: pointer"
                      @click="$openUrl('/boxManage/boxDetail?id=' + item.id)">
                      {{ item.code }}
                    </div>
                    <div class="col numberWidth">{{ $toFixed(item.total_bulk, 3, true) }}</div>
                    <div class="col numberWidth">{{ $toFixed(item.total_price, 3, true) }}</div>
                    <div class="col">
                      <div v-if="item.is_check === 0"
                        class="orange">未审核</div>
                      <div v-if="item.is_check === 1"
                        class="blue">已通过</div>
                      <div v-if="item.is_check === 2"
                        class="red">已驳回</div>
                    </div>
                    <div class="col circleCtn">
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'开票金额:' + item.has_invoice + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ blue: Number(item.has_invoice) > 0 }">票</div>
                      </el-tooltip>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'付款金额:' + item.has_pay + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ green: Number(item.has_pay) > 0 }">付</div>
                      </el-tooltip>
                      <el-tooltip class="item"
                        effect="dark"
                        :content="'扣款金额:' + item.has_deduct + '元'"
                        placement="top">
                        <div class="circle"
                          :class="{ red: Number(item.has_deduct) > 0 }">扣</div>
                      </el-tooltip>
                    </div>
                    <div class="col">{{ item.user_name }}</div>
                    <div class="col">{{ item.created_at }}</div>
                    <div class="col oprWidth">
                      <span class="opr hoverBlue"
                        @click="changeShow(item)">{{ item.isShow ? '收起' : '展开' }}</span>
                    </div>
                  </div>
                  <div v-if="item.isShow"
                    style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
                    <div class="detailCtn">
                      <div class="row">
                        <div class="col">
                          <div class="label">总箱数：</div>
                          <div class="text">{{ $toFixed(item.detail.total_box, 3, true) }}箱</div>
                        </div>
                        <div class="col">
                          <div class="label">总毛重：</div>
                          <div class="text">{{ $toFixed(item.detail.total_gross_weight, 3, true) }}kg</div>
                        </div>
                        <div class="col">
                          <div class="label">总净重：</div>
                          <div class="text">{{ $toFixed(item.detail.total_net_weight, 3, true) }}kg</div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <div class="label">总体积：</div>
                          <div class="text">{{ $toFixed(item.detail.total_bulk, 3, true) }}m³</div>
                        </div>
                        <div class="col">
                          <div class="label">运输单价：</div>
                          <div class="text">{{ item.detail.price }}元/m³</div>
                        </div>
                        <div class="col">
                          <div class="label">体积价：</div>
                          <div class="text">{{ item.detail.price_bulk }}元</div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <div class="label">额外费用：</div>
                          <div class="text">{{ item.detail.others_fee }}元</div>
                        </div>
                        <div class="col">
                          <div class="label">运输总价：</div>
                          <div class="text">{{ $toFixed(item.detail.total_price, 3, true) }}元</div>
                        </div>
                        <div class="col"></div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <div class="label">运输单位：</div>
                          <div class="text">{{ item.detail.client_name }}</div>
                        </div>
                        <div class="col">
                          <div class="label">运输城市：</div>
                          <div class="text">{{ item.detail.city }}</div>
                        </div>
                        <div class="col">
                          <div class="label">运输地址：</div>
                          <div class="text">{{ item.detail.address }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="margin-top: 20px">
                <span style="line-height: 35px; margin-left: 40px">
                  合计运输立方：
                  <span class="green"
                    style="font-weight: bold">
                    {{ $toFixed(boxManageSts.total_number / 10000, 3, true) }} 立方
                  </span>
                </span>
                <span style="line-height: 35px; margin-left: 40px">
                  合计运输金额：
                  <span class="green"
                    style="font-weight: bold">
                    {{ $toFixed(boxManageSts.total_price / 10000, 3, true) }} 万元
                  </span>
                </span>
                <span style="line-height: 35px; margin-left: 40px">
                  合计额外费用：
                  <span class="green"
                    style="font-weight: bold">
                    {{ $toFixed(boxManageSts.total_others_fee / 10000, 3, true) }} 万元
                  </span>
                </span>
              </div>
            </template>
            <div class="pageCtn">
              <el-pagination background
                :page-size="10"
                layout="prev, pager, next"
                :total="listTotal"
                :current-page.sync="listPage"
                @current-change="getBill">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="补纱单据"
          v-if="(clientType === 2 && $route.query.type !== '装饰辅料单位') || clientType === 3 || clientType === 4">
          <div class="titleCtn"
            style="padding: 0 15px">
            <div class="title">单据列表</div>
          </div>
          <div class="listCtn"
            v-loading="listLoading"
            style="padding-left: 10px; padding-right: 10px">
            <div class="filterCtn">
              <div class="elCtn">
                <el-input v-model="subParams.code"
                  placeholder="筛选补充单号/订单号"
                  @keydown.enter.native="getSupList"
                  @clear="getSupList"
                  clearable></el-input>
              </div>
              <div class="elCtn">
                <el-select @change="(ev) => getLocalStorage(ev, 'create_user')"
                  v-model="subParams.user_id"
                  placeholder="筛选创建人"
                  clearable>
                  <el-option v-for="item in userList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </div>
              <div class="elCtn">
                <el-date-picker v-model="subParams.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="getSupList"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
              <div class="elCtn">
                <el-select @change="getSupList"
                  v-model="subParams.is_check"
                  placeholder="筛选审核状态">
                  <el-option value="null"
                    label="全部"></el-option>
                  <el-option value="0"
                    label="待审核"></el-option>
                  <el-option value="1"
                    label="已审核"></el-option>
                  <el-option value="2"
                    label="待驳回"></el-option>
                  <el-option value="3"
                    label="状态异常"></el-option>
                </el-select>
              </div>
              <div class="btn borderBtn"
                @click="reset">重置</div>
            </div>
            <div class="filterCtn">
              <div class="elCtn">
                <el-select @change="getSupList"
                  v-model="subParams.group_id"
                  placeholder="筛选负责小组"
                  clearable>
                  <el-option v-for="item in groupList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"></el-option>
                </el-select>
              </div>
              <div class="btn backHoverBlue"
                @click="changeShowAll(subList, 'sub', 'subShowAllFlag')">
                <svg class="iconFont"
                  aria-hidden="true">
                  <use xlink:href="#icon-xiugaidingdan"></use>
                </svg>
                <span class="text">{{ subShowAllFlag ? '全部展开' : '全部收起' }}</span>
              </div>
              <div class="btn backHoverRed"
                @click="goDeduct(checkAllSubList, false, 'sub')">
                <svg class="iconFont"
                  aria-hidden="true">
                  <use xlink:href="#icon-xiugaidingdan"></use>
                </svg>
                <span class="text">批量扣款</span>
              </div>
            </div>
            <div class="filterCtn clearfix">
              <div class="label">已勾选单据：</div>
              <div class="elCtn check"
                v-for="(item, index) in checkAllSubList"
                :key="item.id">
                <el-input v-model="item.code"
                  disabled>
                  <template slot="append">
                    <i class="el-icon-close hoverRed"
                      style="cursor: pointer"
                      @click="checkAllSubList.splice(index, 1)"></i>
                  </template>
                </el-input>
              </div>
            </div>
            <div class="list">
              <div class="row title">
                <div class="col"
                  style="flex: 0.05">
                  <el-checkbox v-model="checkSubAll"
                    @change="(ev) => checkAllInfo(ev, subList, checkAllSubList)">
                  </el-checkbox>
                </div>
                <div class="col"
                  style="flex: 1.2">补充单号</div>
                <div class="col">关联订单号</div>
                <div class="col">补原料单位</div>
                <div class="col">补原料数量</div>
                <div class="col">原因</div>
                <div class="col">采购状态</div>
                <div class="col">审核状态</div>
                <div class="col">创建人</div>
                <div class="col">创建时间</div>
                <div class="col"
                  style="flex: 1.4">操作</div>
              </div>
              <div v-for="(item, index) in subList"
                :key="index">
                <div class="row">
                  <div class="col"
                    style="flex: 0.05">
                    <el-checkbox v-model="item.checked"
                      @change="(ev) => getCheckInfo(ev, item, checkAllSubList)"></el-checkbox>
                  </div>
                  <div class="col hoverBlue"
                    style="flex: 1.2; cursor: pointer"
                    @click="$router.push('/materialManage/detail?supFlag=1&id=' + item.id)">
                    {{ item.code }}
                  </div>
                  <div class="col hoverBlue"
                    style="cursor: pointer;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      width:100px
                      flex:unset;
                      display:block;"
                    :title="item.order_code || '无编号，点击查看详情'"
                    @click="
                      $router.push(
                        (item.order_type === 1 || item.order_type === null || item.order_type === undefined
                          ? '/order/detail?id='
                          : '/sampleOrder/detail?id=') + item.top_order_id
                      )
                    ">
                    <span v-if="item.order_type === 1"
                      class="circleItem backOrange">订</span>
                    <span v-if="item.order_type === 2"
                      class="circleItem backBlue">样</span>
                    {{ item.order_code || '无编号，点击查看详情' }}
                  </div>
                  <div class="col">{{ item.client_name }}</div>
                  <div class="col">{{ $toFixed(item.total_plan_number, 3, true) }}</div>
                  <div class="col">
                    <el-tooltip class="item"
                      effect="dark"
                      :content="item.desc || '无'"
                      placement="top">
                      <span style="border-bottom: 1px solid #606266">查看</span>
                    </el-tooltip>
                  </div>
                  <div class="col">
                    <div class="green"
                      v-if="item.material_order_progress > 0 && item.material_order_progress < 100">
                      采购中
                    </div>
                    <div class="orange"
                      v-if="item.material_order_progress === 0">未进行</div>
                    <div class="blue"
                      v-if="item.material_order_progress >= 100">已完成</div>
                  </div>
                  <div class="col">
                    <div v-if="item.is_check === 0"
                      class="orange">待审核</div>
                    <div v-else-if="item.is_check === 1"
                      class="blue">已审核</div>
                    <div v-else-if="item.is_check === 2"
                      class="red">已驳回</div>
                    <div v-else
                      class="red">状态异常</div>
                  </div>
                  <div class="col">{{ item.user_name }}</div>
                  <div class="col">{{ item.created_at }}</div>
                  <div class="col"
                    style="flex: 1.4">
                    <span class="opr hoverBlue"
                      @click="changeShow(item, 'sub')">{{
                      item.isShow ? '收起' : '展开'
                    }}</span>
                  </div>
                </div>
                <div v-if="item.isShow"
                  style="border: 1px solid #e8e8e8; transform: translateY(-1px); background: #eee">
                  <div class="tableCtn">
                    <div class="row">
                      <div class="col">
                        <div class="label">关联扣款单：</div>
                        <div v-if="item.detail.deduct_log.length === 0"
                          class="gray">无关联扣款单</div>
                        <div v-else>
                          <span class="blue"
                            v-for="(itemDeduct, indexDeduct) in item.detail.deduct_log"
                            :key="'补纱扣款' + indexDeduct"><span v-if="indexDeduct !== 0">，</span>{{ itemDeduct.code }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="thead">
                      <div class="trow">
                        <div class="tcol">补纱单编号</div>
                        <div class="tcol noPad"
                          style="flex: 2">
                          <div class="trow">
                            <div class="tcol">承担单位</div>
                            <div class="tcol">承担金额</div>
                          </div>
                        </div>
                        <div class="tcol noPad"
                          style="flex: 3">
                          <div class="trow">
                            <div class="tcol">物料名称</div>
                            <div class="tcol">物料颜色</div>
                            <div class="tcol">物料数量</div>
                          </div>
                        </div>
                        <div class="tcol">备注信息</div>
                      </div>
                    </div>
                    <div class="tbody">
                      <div class="trow">
                        <div class="tcol">{{ item.detail.code }}</div>
                        <div class="tcol noPad"
                          style="flex: 2">
                          <div class="trow"
                            v-for="(itemClient, indexClient) in item.detail.client_data"
                            :key="indexClient">
                            <div class="tcol">{{ itemClient.bear_client_name }}</div>
                            <div class="tcol">{{ $toFixed(itemClient.bear_price, 3, true) }}元</div>
                          </div>
                        </div>
                        <div class="tcol noPad"
                          style="flex: 3">
                          <div class="trow"
                            v-for="itemMat in item.detail.info_data"
                            :key="itemMat.id">
                            <div class="tcol">{{ itemMat.material_name }}</div>
                            <div class="tcol">{{ itemMat.material_color }}</div>
                            <div class="tcol">{{ $toFixed(itemMat.number, 3, true) }}{{ itemMat.unit }}</div>
                          </div>
                        </div>
                        <div class="tcol">{{ item.detail.desc || '无' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top: 20px">
              <span style="line-height: 35px; margin-left: 40px">
                合计补原料数量：
                <span class="green"
                  style="font-weight: bold">
                  {{ $toFixed(subAdditional.total_number / 1000, 3, true) }} 吨或千米
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计本厂承担金额：
                <span class="green"
                  style="font-weight: bold">
                  -{{ $toFixed(subAdditional.self_client_price / 10000, 3, true) }} 万元
                </span>
              </span>
              <span style="line-height: 35px; margin-left: 40px">
                合计外协承担金额：
                <span class="green"
                  style="font-weight: bold">
                  {{ $toFixed(subAdditional.client_price / 10000, 3, true) }} 万元
                </span>
              </span>
            </div>
            <div class="pageCtn">
              <el-pagination background
                :page-size="10"
                layout="prev, pager, next"
                :total="subTotal"
                :current-page.sync="subPage"
                @current-change="getSupList">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="$route.query.type === '纱线原料单位'"
          label="纱线汇总表">
          <div class="titleCtn"
            style="padding: 0 15px">
            <div class="title">单据列表</div>
          </div>
          <div class="listCtn"
            v-loading="listLoading"
            style="padding-left: 10px; padding-right: 10px">
            <div class="filterCtn">
              <div class="elCtn">
                <el-input v-model="clientDateParams.keyword"
                  placeholder="筛选纱线名称"
                  @keydown.enter.native="getClientDate('纱线原料单位')"
                  @clear="getClientDate('纱线原料单位')"
                  clearable></el-input>
              </div>
              <div class="elCtn">
                <el-date-picker v-model="clientDateParams.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="getClientDate('纱线原料单位')"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
              <div class="btn borderBtn"
                @click="reset">重置</div>
              <div class="btn backHoverOrange"
                @click="
                  updatePriceFlag = true
                  getMatStsList(updatePriceInfo.date)
                ">
                <svg class="iconFont"
                  aria-hidden="true">
                  <use xlink:href="#icon-xiugaidingdan"></use>
                </svg>
                <span class="text">更新结算单价</span>
              </div>
            </div>
            <div class="list">
              <div class="row title">
                <div class="col">纱线名称</div>
                <div class="col">订购颜色</div>
                <div class="col">订购属性</div>
                <div class="col">
                  计划订购数量
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'number' && sort === 'asc' }"
                      @click="
                        sortCol = 'number'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'number' && sort === 'desc' }"
                      @click="
                        sortCol = 'number'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>

                <div class="col">
                  实际入库数量
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'push_number' && sort === 'asc' }"
                      @click="
                        sortCol = 'push_number'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'push_number' && sort === 'desc' }"
                      @click="
                        sortCol = 'push_number'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
                <div class="col">平均订购单价</div>
                <div class="col">平均结算单价</div>
                <div class="col">
                  计划订购总价
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'total_price' && sort === 'asc' }"
                      @click="
                        sortCol = 'total_price'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'total_price' && sort === 'desc' }"
                      @click="
                        sortCol = 'total_price'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
                <div class="col">
                  实际入库总价
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'total_push_price' && sort === 'asc' }"
                      @click="
                        sortCol = 'total_push_price'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'total_push_price' && sort === 'desc' }"
                      @click="
                        sortCol = 'total_push_price'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
              </div>
              <div v-for="(item, index) in selectClientDateList"
                :key="index">
                <div class="row">
                  <div class="col">
                    {{ item.material_name }}
                  </div>
                  <div class="col">
                    {{ item.material_color }}
                  </div>
                  <div :class="item.attribute ? 'col' : 'col gray'">
                    {{ item.attribute || '无' }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.number,2,true) }} kg
                  </div>
                  <div class="col">
                    {{ $toFixed(item.push_number,2,true) }} kg
                  </div>
                  <div class="col">
                    {{ $toFixed(item.avg_price,3,true) }} kg/元
                  </div>
                  <div :class="item.avg_settle_price == 0?'col gray': 'col'">
                    {{ item.avg_settle_price == 0?'未填写':($toFixed(item.avg_settle_price,3,true) + 'kg/元') }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.total_price,3,true) }} 元
                  </div>
                  <div class="col">
                    {{ $toFixed(item.total_push_price,3,true) }} 元
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pageCtn fr">
            <el-pagination background
              :page-size="10"
              layout="prev, pager, next"
              :total="clientDateList.length"
              :current-page.sync="clientDatePage"
              @current-change="changeSelectClient">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="$route.query.type === '面料原料单位'"
          label="面料汇总表">
          <div class="titleCtn"
            style="padding: 0 15px">
            <div class="title">单据列表</div>
          </div>
          <div class="listCtn"
            v-loading="listLoading"
            style="padding-left: 10px; padding-right: 10px">
            <div class="filterCtn">
              <div class="elCtn">
                <el-input v-model="clientDateParams.keyword"
                  placeholder="筛选面料名称"
                  @keydown.enter.native="getClientDate('面料原料单位')"
                  @clear="getClientDate('面料原料单位')"
                  clearable></el-input>
              </div>
              <div class="elCtn">
                <el-date-picker v-model="clientDateParams.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="getClientDate('面料原料单位')"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
              <div class="btn borderBtn"
                @click="reset">重置</div>
              <div class="btn backHoverOrange"
                @click="
                  updatePriceFlag = true
                  getMatStsList(updatePriceInfo.date)
                ">
                <svg class="iconFont"
                  aria-hidden="true">
                  <use xlink:href="#icon-xiugaidingdan"></use>
                </svg>
                <span class="text">更新结算单价</span>
              </div>
            </div>
            <div class="list">
              <div class="row title">
                <div class="col">面料名称</div>
                <div class="col">订购颜色</div>
                <div class="col">订购属性</div>
                <div class="col">
                  计划订购数量
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'number' && sort === 'asc' }"
                      @click="
                        sortCol = 'number'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'number' && sort === 'desc' }"
                      @click="
                        sortCol = 'number'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>

                <div class="col">
                  实际入库数量
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'push_number' && sort === 'asc' }"
                      @click="
                        sortCol = 'push_number'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'push_number' && sort === 'desc' }"
                      @click="
                        sortCol = 'push_number'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
                <div class="col">平均订购单价</div>
                <div class="col">平均结算单价</div>
                <div class="col">
                  计划订购总价
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'total_price' && sort === 'asc' }"
                      @click="
                        sortCol = 'total_price'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'total_price' && sort === 'desc' }"
                      @click="
                        sortCol = 'total_price'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
                <div class="col">
                  实际入库总价
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'total_push_price' && sort === 'asc' }"
                      @click="
                        sortCol = 'total_push_price'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'total_push_price' && sort === 'desc' }"
                      @click="
                        sortCol = 'total_push_price'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
              </div>
              <div v-for="(item, index) in selectClientDateList"
                :key="index">
                <div class="row">
                  <div class="col">
                    {{ item.material_name }}
                  </div>
                  <div class="col">
                    {{ item.material_color }}
                  </div>
                  <div :class="item.attribute ? 'col' : 'col gray'">
                    {{ item.attribute || '无' }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.number,2,true) }} 米
                  </div>
                  <div class="col">
                    {{ $toFixed(item.push_number,2,true) }} 米
                  </div>
                  <div class="col">
                    {{ $toFixed(item.avg_price,3,true) }} 米/元
                  </div>
                  <div :class="item.avg_settle_price == 0?'col gray': 'col'">
                    {{ item.avg_settle_price == 0?'未填写':($toFixed(item.avg_settle_price,3,true) + '米/元') }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.total_price,3,true) }} 元
                  </div>
                  <div class="col">
                    {{ $toFixed(item.total_push_price,3,true) }} 元
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pageCtn fr">
            <el-pagination background
              :page-size="10"
              layout="prev, pager, next"
              :total="clientDateList.length"
              :current-page.sync="clientDatePage"
              @current-change="changeSelectClient">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="$route.query.type === '装饰辅料单位'"
          label="辅料汇总表">
          <div class="titleCtn"
            style="padding: 0 15px">
            <div class="title">单据列表</div>
          </div>
          <div class="listCtn"
            v-loading="listLoading"
            style="padding-left: 10px; padding-right: 10px">
            <div class="filterCtn">
              <div class="elCtn">
                <el-input v-model="clientDateParams.keyword"
                  placeholder="筛选辅料名称"
                  @keydown.enter.native="getClientDate('装饰辅料单位')"
                  @clear="getClientDate('装饰辅料单位')"
                  clearable></el-input>
              </div>
              <div class="elCtn">
                <el-date-picker v-model="clientDateParams.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="getClientDate('装饰辅料单位')"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
              <div class="btn borderBtn"
                @click="reset">重置</div>
              <div class="btn backHoverOrange"
                @click="
                  updatePriceFlag = true
                  getMatStsList(updatePriceInfo.date)
                ">
                <svg class="iconFont"
                  aria-hidden="true">
                  <use xlink:href="#icon-xiugaidingdan"></use>
                </svg>
                <span class="text">更新结算单价</span>
              </div>
            </div>
            <div class="list">
              <div class="row title">
                <div class="col">辅料名称</div>
                <div class="col">订购属性</div>
                <div class="col">
                  计划订购数量
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'number' && sort === 'asc' }"
                      @click="
                        sortCol = 'number'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'number' && sort === 'desc' }"
                      @click="
                        sortCol = 'number'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>

                <div class="col">
                  实际入库数量
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'push_number' && sort === 'asc' }"
                      @click="
                        sortCol = 'push_number'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'push_number' && sort === 'desc' }"
                      @click="
                        sortCol = 'push_number'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
                <div class="col">平均订购单价</div>
                <div class="col">平均结算单价</div>
                <div class="col">
                  计划订购总价
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'total_price' && sort === 'asc' }"
                      @click="
                        sortCol = 'total_price'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'total_price' && sort === 'desc' }"
                      @click="
                        sortCol = 'total_price'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
                <div class="col">
                  实际入库总价
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'total_push_price' && sort === 'asc' }"
                      @click="
                        sortCol = 'total_push_price'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'total_push_price' && sort === 'desc' }"
                      @click="
                        sortCol = 'total_push_price'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
              </div>
              <div v-for="(item, index) in selectClientDateList"
                :key="index">
                <div class="row">
                  <div class="col">
                    {{ item.material_name }}
                  </div>
                  <div :class="item.attribute ? 'col' : 'col gray'">
                    {{ item.attribute || '无' }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.number,2,true) }} {{item.unit}}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.push_number,2,true) }} {{item.unit}}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.avg_price,3,true) }} {{item.unit+'/元'}}
                  </div>
                  <div :class="item.avg_settle_price == 0?'col gray': 'col'">
                    {{ item.avg_settle_price == 0?'未填写':($toFixed(item.avg_settle_price,3,true) + item.unit+'/元') }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.total_price,3,true) }} 元
                  </div>
                  <div class="col">
                    {{ $toFixed(item.total_push_price,3,true) }} 元
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pageCtn fr">
            <el-pagination background
              :page-size="10"
              layout="prev, pager, next"
              :total="clientDateList.length"
              :current-page.sync="clientDatePage"
              @current-change="changeSelectClient">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="$route.query.type === '包装辅料单位'"
          label="包装汇总表">
          <div class="titleCtn"
            style="padding: 0 15px">
            <div class="title">单据列表</div>
          </div>
          <div class="listCtn"
            v-loading="listLoading"
            style="padding-left: 10px; padding-right: 10px">
            <div class="filterCtn">
              <div class="elCtn">
                <el-input v-model="clientDateParams.keyword"
                  placeholder="筛选包装名称"
                  @keydown.enter.native="getClientDate('包装辅料单位')"
                  @clear="getClientDate('包装辅料单位')"
                  clearable></el-input>
              </div>
              <div class="elCtn">
                <el-date-picker v-model="clientDateParams.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="getClientDate('包装辅料单位')"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
              <div class="btn borderBtn"
                @click="reset">重置</div>
              <div class="btn backHoverOrange"
                @click="
                  updatePriceFlag = true
                  getMatStsList(updatePriceInfo.date)
                ">
                <svg class="iconFont"
                  aria-hidden="true">
                  <use xlink:href="#icon-xiugaidingdan"></use>
                </svg>
                <span class="text">更新结算单价</span>
              </div>
            </div>
            <div class="list">
              <div class="row title">
                <div class="col">包装名称</div>
                <div class="col">包装规格</div>
                <div class="col">属性说明</div>
                <div class="col">
                  订购数量
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'number' && sort === 'asc' }"
                      @click="
                        sortCol = 'number'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'number' && sort === 'desc' }"
                      @click="
                        sortCol = 'number'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
                <div class="col">平均订购单价</div>
                <div class="col">
                  计划订购总价
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'total_price' && sort === 'asc' }"
                      @click="
                        sortCol = 'total_price'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'total_price' && sort === 'desc' }"
                      @click="
                        sortCol = 'total_price'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
              </div>
              <div v-for="(item, index) in selectClientDateList"
                :key="index">
                <div class="row">
                  <div class="col">
                    {{ item.material_name }}
                  </div>
                  <div class="col">
                    <template v-if="Number(item.price_type) === 1">
                      {{ item.length }}*{{ item.width }}*{{ item.height }}cm
                    </template>
                    <template v-else-if="Number(item.price_type) === 2">
                      {{ item.length }}*{{ item.width }}cm
                    </template>
                    <template v-else-if="Number(item.price_type) === 3">
                      {{ item.length }}
                    </template>
                  </div>
                  <div :class="item.desc ? 'col' : 'col gray'">
                    {{ item.desc || '无' }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.number,2,true) }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.avg_price,3,true) }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.total_price,3,true) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pageCtn fr">
            <el-pagination background
              :page-size="10"
              layout="prev, pager, next"
              :total="clientDateList.length"
              :current-page.sync="clientDatePage"
              @current-change="changeSelectClient">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="$route.query.type === '原料加工单位'"
          label="加工汇总表">
          <div class="titleCtn"
            style="padding: 0 15px">
            <div class="title">单据列表</div>
          </div>
          <div class="listCtn"
            v-loading="listLoading"
            style="padding-left: 10px; padding-right: 10px">
            <div class="filterCtn">
              <div class="elCtn">
                <el-input v-model="clientDateParams.keyword"
                  placeholder="筛选原料名称"
                  @keydown.enter.native="getClientDate('原料加工单位')"
                  @clear="getClientDate('原料加工单位')"
                  clearable></el-input>
              </div>
              <div class="elCtn">
                <el-select v-model="clientDateParams.process"
                  placeholder="选择加工工序"
                  clearable
                  @clear="getClientDate('原料加工单位')"
                  @change="getClientDate('原料加工单位')">
                  <el-option v-for="item in processList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </div>
              <div class="elCtn">
                <el-date-picker v-model="clientDateParams.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="getClientDate('原料加工单位')"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
              <div class="btn borderBtn"
                @click="reset">重置</div>
            </div>
            <div class="list">
              <div class="row title">
                <div class="col">物料名称</div>
                <div class="col">加工工序</div>
                <div class="col">
                  计划加工数量
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'number' && sort === 'asc' }"
                      @click="
                        sortCol = 'number'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'number' && sort === 'desc' }"
                      @click="
                        sortCol = 'number'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
                <div class="col">
                  实际加工数量
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'push_number' && sort === 'asc' }"
                      @click="
                        sortCol = 'push_number'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'push_number' && sort === 'desc' }"
                      @click="
                        sortCol = 'push_number'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
                <div class="col">加工单价</div>
                <div class="col">
                  计划加工总价
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'total_price' && sort === 'asc' }"
                      @click="
                        sortCol = 'total_price'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'total_price' && sort === 'desc' }"
                      @click="
                        sortCol = 'total_price'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
                <div class="col">
                  实际加工总价
                  <div class="sortCtn">
                    <div class="el-icon-caret-top"
                      :class="{ active: sortCol === 'total_push_price' && sort === 'asc' }"
                      @click="
                        sortCol = 'total_push_price'
                        sort = 'asc'
                        sortClientDate()
                      "></div>
                    <div class="el-icon-caret-bottom"
                      :class="{ active: sortCol === 'total_push_price' && sort === 'desc' }"
                      @click="
                        sortCol = 'total_push_price'
                        sort = 'desc'
                        sortClientDate()
                      "></div>
                  </div>
                </div>
              </div>
              <div v-for="(item, index) in selectClientDateList"
                :key="index">
                <div class="row">
                  <div :class="item.material_name?'col':'col gray'">
                    {{ item.material_name || '无'}}
                  </div>
                  <div class="col">
                    {{ item.process }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.number,2,true) }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.push_number,2,true) }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.avg_price,3,true) }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.total_price,3,true) }}
                  </div>
                  <div class="col">
                    {{ $toFixed(item.total_push_price,3,true) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pageCtn fr">
            <el-pagination background
              :page-size="10"
              layout="prev, pager, next"
              :total="clientDateList.length"
              :current-page.sync="clientDatePage"
              @current-change="changeSelectClient">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module"
      id="扣款单据">
      <div class="titleCtn">
        <div class="title">扣款单据</div>
      </div>
      <div class="listCtn"
        v-loading="deductLoading">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="deductOrderCode"
              placeholder="搜索订单号"
              @keydown.enter.native="getDeductLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="deductKeyword"
              placeholder="搜索票据编号"
              @keydown.enter.native="getDeductLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-select @change="getDeductLogList"
              v-model="deductUser"
              placeholder="筛选创建人"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="deductDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getDeductLogList"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="backHoverBlue btn">搜索</div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">票据编号</div>
            <div class="col">关联单号</div>
            <div class="col">扣款金额</div>
            <div class="col">扣款原因</div>
            <div class="col">图片信息</div>
            <div class="col">开票人</div>
            <div class="col">开票日期</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in deductLog"
            :key="item.id">
            <div class="col">{{ item.code }}</div>
            <div class="col">{{ item.rel_doc_code || '未关联' }}</div>
            <div class="col">{{ $toFixed(item.price, 3, true) }}元</div>
            <div class="col">{{ item.reason }}</div>
            <div class="col">
              <div class="imageCtn">
                <el-image style="width: 100%; height: 100%"
                  :src="item.file_url ? item.file_url : ''"
                  :preview-src-list="[item.file_url]">
                  <div slot="error"
                    class="image-slot">
                    <i class="el-icon-picture-outline"
                      style="font-size: 42px"></i>
                  </div>
                </el-image>
              </div>
            </div>
            <div class="col">{{ item.user_name }}</div>
            <div class="col">{{ item.create_time }}</div>
            <div class="col oprCtn">
              <span class="opr orange"
                @click="goDeduct([item], true)">修改</span>
              <span class="opr red"
                @click="deleteDeduct(item.id)">删除</span>
            </div>
          </div>
          <div class="row">
            <div class="col">合计：</div>
            <div class="col"></div>
            <div class="col green bold">{{ deductTotalPrice }}万元</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="deductTotal"
            :current-page.sync="deductPage"
            @current-change="getDeductLogList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module"
      id="付款单据">
      <div class="titleCtn">
        <div class="title">付款单据</div>
      </div>
      <div class="listCtn"
        v-loading="paymentLoading">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="paymentOrderCode"
              placeholder="搜索订单号"
              @keydown.enter.native="getPaymentLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="paymentKeyword"
              placeholder="搜索票据编号"
              @keydown.enter.native="getPaymentLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-select @change="getPaymentLogList"
              v-model="paymentUser"
              placeholder="筛选创建人"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="paymentDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getPaymentLogList"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="backHoverBlue btn">搜索</div>
        </div>
        <div class="filterCtn clearfix"></div>
        <div class="list">
          <div class="row title">
            <div class="col">票据编号</div>
            <div class="col">关联单号</div>
            <div class="col">付款金额</div>
            <div class="col">备注信息</div>
            <div class="col">付款人</div>
            <div class="col">付款日期</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in paymentLog"
            :key="item.id">
            <div class="col">{{ item.code }}</div>
            <div class="col">{{ item.rel_doc_code || '未关联' }}</div>
            <div class="col">{{ $toFixed(item.price, 3, true) }}元</div>
            <div class="col">{{ item.desc }}</div>
            <div class="col">{{ item.user_name }}</div>
            <div class="col">{{ item.created_at }}</div>
            <div class="col oprCtn">
              <span class="opr orange"
                @click="goPayment([item], true)">修改</span>
              <span class="opr red"
                @click="deletePayment(item.id)">删除</span>
            </div>
          </div>
          <div class="row">
            <div class="col">合计：</div>
            <div class="col"></div>
            <div class="col green bold">{{ paymentTotalPrice }}万元</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="paymentTotal"
            :current-page.sync="paymentPage"
            @current-change="getPaymentLogList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module"
      id="开票单据">
      <div class="titleCtn">
        <div class="title">开票单据</div>
      </div>
      <div class="listCtn"
        v-loading="invoiceLoading">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="invoiceOrderCode"
              placeholder="搜索订单号"
              @keydown.enter.native="getInvoiceLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="invoiceKeyword"
              placeholder="搜索票据编号"
              @keydown.enter.native="getInvoiceLogList"></el-input>
          </div>
          <div class="elCtn">
            <el-select @change="getInvoiceLogList"
              v-model="invoiceUser"
              placeholder="筛选创建人"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-date-picker v-model="invoiceDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getInvoiceLogList"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="backHoverBlue btn">搜索</div>
        </div>
        <div class="filterCtn clearfix">
          <div class="elCtn">
            <el-input v-model="invoiceCode"
              placeholder="搜索开票号码"
              @keydown.enter.native="getInvoiceLogList"></el-input>
          </div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">票据编号</div>
            <div class="col">关联单号</div>
            <div class="col">开票金额</div>
            <div class="col">不含税金额</div>
            <div class="col">税额</div>
            <div class="col">开票号码</div>
            <div class="col">备注信息</div>
            <div class="col">开票人</div>
            <div class="col">开票日期</div>
            <div class="col"
              style="flex:1.1">操作</div>
          </div>
          <div class="row"
            v-for="item in invoiceLog"
            :key="item.id">
            <div class="col">{{ item.code }}</div>
            <div class="col">{{ item.rel_doc_code || '未关联' }}</div>
            <div class="col">{{ $toFixed(item.price, 3, true) }}元</div>
            <div class="col">{{ $toFixed(item.price_no_tax, 3, true) }}元</div>
            <div class="col">{{ $toFixed(item.price_tax, 3, true) }}元</div>
            <div class="col">{{ item.invoice_code }}</div>
            <div class="col">{{ item.desc }}</div>
            <div class="col">{{ item.user_name }}</div>
            <div class="col">{{ item.created_at }}</div>
            <div class="col oprCtn"
              style="flex:1.1">
              <span class="opr blue"
                @click="
                  goPayment(
                    [
                      {
                        order_id: item.order_id,
                        doc_code: item.order_code,
                        rel_doc_id: item.rel_doc_id,
                        price: item.price,
                        desc: '',
                        complete_time: $getDate(new Date())
                      }
                    ],
                    false,
                    true
                  )
                ">付款</span>
              <span class="opr orange"
                @click="goInvoice([item], true)">修改</span>
              <span class="opr red"
                @click="deleteInvoice(item.id)">删除</span>
            </div>
          </div>
          <div class="row">
            <div class="col">合计：</div>
            <div class="col"></div>
            <div class="col green bold">{{ invoiceTotalPrice }}万元</div>
            <div class="col green bold">{{ invoiceTotalNoTaxPrice }}万元</div>
            <div class="col green bold">{{ invoiceTotalTaxPrice }}万元</div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"></div>
            <div class="col"
              style="flex:1.1"></div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="invoiceTotal"
            :current-page.sync="invoicePage"
            @current-change="getInvoiceLogList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn"
          style="float: left"
          v-if="clientType === 2 || clientType === 3 || clientType === 4">
          <div class="btn backHoverGreen"
            @click="getAssociatedPage">查看其他关联单据</div>
        </div>
        <div class="btnCtn">
          <span class="btn backHoverBlue"
            @click="$router.push('/client/update?id='+$route.query.id+'&type=2')">修改单位信息</span>
        </div>
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btn backHoverGreen"
            @click="goUrl">导出数据表报</div>
        </div>
      </div>
    </div>
    <!-- 付款 -->
    <zh-payment :type="clientType"
      :invoiceChange="invoiceChange"
      :update="paymentUpdate"
      :show="paymentFlag"
      :data="paymentData"
      :client_name="clientFinancial.name"
      :client_id="$route.query.id"
      @close="paymentFlag = false"
      @afterPayment="init()"></zh-payment>
    <!-- 开票 -->
    <zh-invoice :type="clientType"
      :invoice_type="2"
      :update="invoiceUpdate"
      :show="invoiceFlag"
      :data="invoiceData"
      :client_name="clientFinancial.name"
      :client_id="$route.query.id"
      @close="invoiceFlag = false"
      @afterInvoice="init()"></zh-invoice>
    <!-- 扣款 -->
    <zh-deduct :type="clientType"
      :deduct_type="1"
      :update="deductUpdate"
      :show="deductFlag"
      :data="deductData"
      :client_name="clientFinancial.name"
      :client_id="$route.query.id"
      @close="deductFlag = false"
      @afterDeduct="init()"></zh-deduct>
    <!-- 补纱扣款 -->
    <zh-deduct :type="10"
      :deduct_type="1"
      :update="deductUpdate"
      :show="subDeductFlag"
      :data="deductData"
      :client_name="clientFinancial.name"
      :client_id="$route.query.id"
      @close="subDeductFlag = false"
      @afterDeduct="init()"></zh-deduct>
    <zh-deduct-detail :show="deductDetailFlag"
      @close="deductDetailFlag = false"
      :data="deductDetail"></zh-deduct-detail>
    <!-- 产品详情 -->
    <product-detail :id="productDetailId"
      :show="productShow"
      :noOpr="true"
      @close="productShow = false"></product-detail>
    <!-- 批量修改结算单价功能 -->
    <div class="popup"
      id="updatePrice"
      v-show="updatePriceFlag">
      <div class="main"
        style="width:1200px">
        <div class="titleCtn">
          <span class="text">批量修改结算单价</span>
          <div class="closeCtn"
            @click="updatePriceFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="explainCtn">
            <p>1.必须筛选日期跨度尽量不要超过一年</p>
            <p>2.点击提交后只会更新重新填写的结算单价</p>
          </div>
          <div class="listCtn">
            <div class="filterCtn">
              <div class="elCtn">
                <el-autocomplete v-model="updatePriceInfo.material_name"
                  :fetch-suggestions="searchMaterialNew"
                  placeholder="物料名称搜索"
                  @keydown.native.enter="getMatShowList"
                  @select="getMatShowList"
                  @clear="getMatShowList"
                  clearable></el-autocomplete>
              </div>
              <div class="elCtn">
                <el-autocomplete :fetch-suggestions="searchAttribute"
                  v-model="updatePriceInfo.attribute"
                  placeholder="物料属性"
                  @keydown.native.enter="getMatShowList"
                  @change="getMatShowList"
                  clearable></el-autocomplete>
              </div>
              <div class="elCtn">
                <el-select v-model="updatePriceInfo.material_color"
                  placeholder="请选择种类"
                  clearable
                  @keydown.native.enter="getMatShowList"
                  @change="getMatShowList">
                  <el-option label="色纱"
                    value="色纱"></el-option>
                  <el-option label="白胚"
                    value="白胚"></el-option>
                </el-select>
              </div>
              <div class="elCtn"
                style="width: 250px">
                <el-date-picker v-model="updatePriceInfo.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  @change="getMatStsList">
                </el-date-picker>
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">日期</div>
                  <div class="tcol noPad"
                    style="flex: 9">
                    <div class="trow">
                      <div class="tcol">原料名称</div>
                      <div class="tcol">颜色</div>
                      <div class="tcol">属性</div>
                      <div class="tcol">订购单价</div>
                      <div class="tcol">订购总数</div>
                      <div class="tcol">已结算单价</div>
                      <div class="tcol">修改结算单价</div>
                      <div class="tcol"
                        v-if="$route.query.type === '纱线原料单位' || $route.query.type === '面料原料单位'">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-if="this.updatePriceOriginList.length === 0">
                  <div class="tcol red"
                    style="text-align: center">请筛选日期后搜索纱线数据</div>
                </div>
                <div class="trow"
                  v-for="(item, index) in updatePriceShowList"
                  :key="index">
                  <div class="tcol">{{ item.created_at }}</div>
                  <div class="tcol noPad"
                    style="flex: 9">
                    <div class="trow"
                      v-for="(itemChild, indexChild) in item.realChildren"
                      :key="indexChild">
                      <div class="tcol">{{ itemChild.material_name }}</div>
                      <div class="tcol">{{ itemChild.material_color }}</div>
                      <div class="tcol">{{ itemChild.attribute }}</div>
                      <div class="tcol blue">{{ itemChild.price }}元/kg</div>
                      <div class="tcol">{{ itemChild.number }}kg</div>
                      <div class="tcol"
                        :class="{ blue: itemChild.settle_price, gray: !itemChild.settle_price }">
                        {{ itemChild.settle_price === 0 ? '未填写' : itemChild.settle_price + '元' }}
                      </div>
                      <div class="tcol">
                        <div class="elCtn">
                          <el-input placeholder="单价"
                            v-model="itemChild.new_settle_price"></el-input>
                        </div>
                      </div>
                      <div class="tcol"
                        v-if="$route.query.type === '纱线原料单位' || $route.query.type === '面料原料单位'">
                        <span class="btn backHoverBlue"
                          style="padding: 0 8px;"
                          @click="updatePriceFlag = false
                        searchAboutList(item.created_at,itemChild.material_name)">查询关联单据</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="updatePriceFlag = false">取消</span>
          <span class="btn backHoverBlue"
            @click="saveUpdatePrice">提交更新</span>
        </div>
      </div>
    </div>
    <!-- 关联页面 -->
    <associated-page :data="associatedPage"
      :nowPage="false"
      @close="showAssociatedPage = false"
      :show="showAssociatedPage"></associated-page>
  </div>
</template>

<script lang="ts">
import {
  client,
  payment,
  deduct,
  invoice,
  materialOrder,
  materialProcess,
  productionPlan,
  materialSupplement,
  packManage,
  boxManage,
  process,
  yarn,
  updateSettlePrice,
  statistics
} from '@/assets/js/api'
import { yarnAttributeArr, yarnProcessArr } from '@/assets/js/dictionary'
import { DecorateMaterialInfo } from '@/types/materialSetting'
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      invoiceChange: false,
      productDetailId: '',
      productShow: false,
      paymentLoading: false,
      paymentFlag: false,
      paymentData: [],
      paymentLog: [],
      paymentTotalPrice: 0,
      paymentTotal: 1,
      paymentPage: 1,
      paymentUpdate: false,
      paymentOrderCode: '',
      paymentKeyword: '',
      paymentDate: [],
      paymentUser: '',
      invoiceLoading: false,
      invoiceFlag: false,
      invoiceData: [],
      invoiceTotalPrice: 0,
      invoiceTotalNoTaxPrice: 0,
      invoiceTotalTaxPrice: 0,
      invoiceLog: [],
      invoiceTotal: 1,
      invoicePage: 1,
      invoiceUpdate: false,
      invoiceOrderCode: '',
      invoiceKeyword: '',
      invoiceCode: '',
      invoiceDate: [],
      invoiceUser: '',
      deductLoading: false,
      deductFlag: false,
      deductData: [],
      deductLog: [],
      deductTotalPrice: 0,
      deductTotal: 1,
      deductPage: 1,
      deductUpdate: false,
      deductOrderCode: '',
      deductKeyword: '',
      deductDate: [],
      deductUser: '',
      clientFinancial: {
        total_pay_price: 0,
        total_deduct_price: 0,
        total_invoice_price: 0,
        total_plan_number: 0,
        total_plan_price: 0,
        total_real_number: 0,
        total_real_price: 0,
        status: 0,
        name: '',
        client_type_name: '',
        alias: '',
        contacts_data: [],
        financial_data: [],
        sup: {
          number: 0,
          price: 0
        },
        delay: {
          pre: 0,
          delay: 0
        },
        shoddy: {
          shoddy_number: 0,
          part_shoddy_number: 0,
          deduct_price: 0
        }
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      checkAll: false,
      showContacts: false,
      year: new Date().getFullYear().toString(),
      listPage: 1,
      listTotal: 1,
      materialOrderFilter: {
        pushDate: [],
        date: [],
        user_id: '',
        keyword: '',
        group_id: '',
        is_check: '',
        has_invoice: '',
        has_deduct: '',
        has_pay: '',
        material_name: []
      },
      materialOrderSts: {
        total_order_number: 0,
        total_order_price: 0,
        total_push_number: 0,
        total_push_price: 0,
        total_other_fee: 0
      },
      materialOrderList: [],
      materialOrderCheckList: [],
      materialProcessFilter: {
        date: [],
        user_id: '',
        keyword: '',
        group_id: '',
        is_check: '',
        has_invoice: '',
        has_deduct: '',
        has_pay: '',
        material_name: []
      },
      materialProcessSts: {
        total_number: 0,
        total_price: 0,
        total_push_number: 0,
        total_push_price: 0,
        total_settle_price: 0,
        total_other_fee: 0
      },
      materialProcessList: [],
      processList: yarnProcessArr,
      materialProcessCheckList: [],
      productionPlanFilter: {
        date: [],
        user_id: '',
        keyword: '',
        group_id: '',
        is_check: '',
        has_invoice: '',
        has_deduct: '',
        has_pay: ''
      },
      productionPlanSts: {
        total_number: 0,
        total_price: 0,
        total_push_number: 0,
        total_push_price: 0,
        total_settle_price: 0,
        total_other_fee: 0
      },
      productionPlanList: [],
      productionPlanCheckList: [],
      packOrderSts: {
        total_number: 0,
        total_price: 0,
        total_other_fee: 0
      },
      packOrderFilter: {
        date: [],
        user_id: '',
        keyword: '',
        group_id: '',
        is_check: '',
        has_invoice: '',
        has_deduct: '',
        has_pay: ''
      },
      packOrderList: [],
      packOrderCheckList: [],
      boxManageFilter: {
        date: [],
        user_id: '',
        keyword: '',
        group_id: '',
        is_check: '',
        has_invoice: '',
        has_deduct: '',
        has_pay: ''
      },
      boxManageSts: {
        total_number: 0,
        total_price: 0,
        total_other_fee: 0
      },
      // 补纱单据相关开始
      subTotal: 1,
      subPage: 1,
      subAdditional: {},
      checkAllSubList: [],
      checkSubAll: false,
      subShowAllFlag: true,
      subParams: {
        bear_client_id: this.$route.query.id,
        group_id: '',
        keyword: '',
        status: '',
        date: [],
        user_id: '',
        limit: 10
      },
      subList: [],
      subDeductFlag: false,
      // 补纱单据相关结束
      boxManageList: [],
      boxManageCheckList: [],
      accessoriesFilter: {
        date: [],
        user_id: '',
        keyword: '',
        group_id: '',
        is_check: '',
        has_invoice: '',
        has_deduct: '',
        has_pay: ''
      },
      accessoriesSts: {
        total_number: 0,
        total_price: 0
      },
      accessoriesList: [],
      accessoriesCheckList: [],
      listLoading: false,
      updatePriceFlag: false,
      updatePriceInfo: {
        material_name: '',
        material_color: '',
        settle_price: '',
        attribute: '',
        start_time: '',
        end_time: '',
        date: [],
        client_id: null
      },
      updatePriceOriginList: [],
      updatePriceShowList: [],
      updatePriceYarnList: [],
      yarnAttributeList: yarnAttributeArr,
      yarnList: [],
      showAllFlag: true,
      deductDetailFlag: false,
      deductDetail: [],
      associatedPage: [],
      showAssociatedPage: false,
      // 数据报表相关
      staticYear: new Date().getFullYear().toString(),
      sortWay: 1,
      optionStatic: {
        color: ['#229CFB', '#8E44AD', '#1FB48C', '#F39C25', '#D3541A'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          formatter: (params: any) => {
            var htmlStr = '<div>'
            htmlStr += params[0].name //x轴的名称
            params.forEach((param: any, index: number) => {
              var color = param.color //图例颜色

              //为了保证和原来的效果一样，这里自己实现了一个点的效果
              htmlStr +=
                '<br /><span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
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
                (index < 2 ? 'kg' : '元/kg')
            })
            htmlStr += '</div>'

            return htmlStr
          }
        },
        dataZoom: [
          {
            start: 0, //默认为0
            end: 100 - 1500 / 31, //默认为100
            type: 'slider',
            maxValueSpan: 10, //窗口的大小，显示数据的条数的
            show: true,
            handleSize: 0, //滑动条的 左右2个滑动条的大小
            height: '5%', //组件高度
            left: 65,
            right: 85,
            bottom: 20,
            borderColor: 'rgba(43,48,67,.8)',
            fillerColor: '#33384b',
            zoomLock: true,
            brushSelect: false,
            backgroundColor: 'rgba(43,48,67,.8)', //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            realtime: true, //是否实时更新
            xAxisIndex: [0] //控制的 x轴
          }
        ],
        legend: {
          data: ['订购数量', '平均单价']
        },
        xAxis: [
          {
            type: 'category',
            data: [],
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
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: '{value} kg'
            }
          },
          {
            type: 'value',
            show: false,
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 元/kg'
            }
          },
          {
            type: 'value',
            show: false,
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 元/kg'
            }
          },
          {
            type: 'value',
            show: false,
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 元/kg'
            }
          },
          {
            type: 'value',
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 元/kg'
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '订购数量',
            data: []
          },
          {
            type: 'line',
            name: '入库数量',
            symbolSize: 0, // symbol的大小设置为0让线的小圆点不显示
            showSymbol: false, // 不显示symbol不显示
            lineStyle: {
              width: 0, // 线宽是0不显示线
              color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
            },
            data: []
          },
          {
            type: 'line',
            name: '平均单价',
            yAxisIndex: 1,
            data: []
          },
          {
            type: 'line',
            name: '最高单价',
            symbolSize: 0, // symbol的大小设置为0让线的小圆点不显示
            showSymbol: false, // 不显示symbol不显示
            lineStyle: {
              width: 0, // 线宽是0不显示线
              color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
            },
            data: []
          },
          {
            type: 'line',
            name: '最低单价',
            symbolSize: 0, // symbol的大小设置为0让线的小圆点不显示
            showSymbol: false, // 不显示symbol不显示
            lineStyle: {
              width: 0, // 线宽是0不显示线
              color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
            },
            data: []
          }
        ]
      },
      // 汇总表相关
      clientDateParams: {
        client_id: this.$route.query.id,
        date: [new Date().getFullYear() + '-01-01', new Date().getFullYear() + '-12-31'],
        keyword: '',
        process: '',
        yarn_type: this.$route.query.type === '纱线原料单位' ? 1 : this.$route.query.type === '面料原料单位' ? 2 : ''
      },
      sortCol: 'number',
      sort: 'desc',
      clientDateList: [],
      selectClientDateList: [],
      clientDateTotal: 1,
      clientDatePage: 1,
      clientDateLimit: 0
    }
  },
  computed: {
    userList() {
      return this.$store.state.api.user.arr
    },
    groupList() {
      return this.$store.state.api.group.arr
    },
    clientType() {
      const filter: any = {
        面料原料单位: 2,
        纱线原料单位: 2,
        装饰辅料单位: 2,
        原料加工单位: 3,
        生产织造单位: 4,
        生产加工单位: 4,
        包装辅料单位: 11,
        运输单位: 13
      }
      return filter[this.$route.query.type as string]
    },
    yarnTypeList() {
      return this.$store.state.api.yarnType.arr.map((item: any) => {
        return {
          label: item.label,
          value: item.label,
          children: item.children.map((itemChild: any) => {
            return {
              label: itemChild.label,
              value: itemChild.label,
              children: itemChild.children.map((itemSon: any) => {
                return { label: itemSon.label, value: itemSon.label }
              })
            }
          })
        }
      })
    },
    decorateMaterialList(): DecorateMaterialInfo[] {
      return this.$store.state.api.decorateMaterial.arr
    }
  },
  methods: {
    // 查看其他关联单据
    getAssociatedPage() {
      if (this.clientType === 4) {
        this.associatedPage = [
          {
            name: '检验入库单据',
            url:
              '/billingManagement/inspectionReceiptDocument?page=1&keyword=&client_id=&user_id=&group_id=&process=&order_type=&status=null&type=null&date=&limit=10&contacts_id=&single_client_id=' +
              this.$route.query.id
          }
        ]
      } else if (this.clientType === 2) {
        if (this.$route.query.type === '纱线原料单位') {
          this.associatedPage = [
            {
              name: '关联出入库单',
              url:
                '/billingManagement/shaXianInOutList?page=1&keyword=&client_id=&user_id=&group_id=&shaxianName=&action_type=&store_id=&status=null&type=null&order_type=&date=&limit=10&contacts_id=&single_client_id=' +
                this.$route.query.id
            }
          ]
        } else if (this.$route.query.type === '面料原料单位') {
          this.associatedPage = [
            {
              name: '关联出入库单',
              url:
                '/billingManagement/fabricWarehousing?page=1&keyword=&client_id=&user_id=&group_id=&store_id=&status=null&material_name=&action_type=&type=null&order_type=&date=&limit=10&contacts_id=&single_client_id=' +
                this.$route.query.id
            }
          ]
        } else if (this.$route.query.type === '装饰辅料单位') {
          this.associatedPage = [
            {
              name: '关联出入库单',
              url: '/billingManagement/auxiliaryInOutList?&single_client_id=' + this.$route.query.id
            }
          ]
        }
      }
      this.showAssociatedPage = true
    },
    getMatStsList(date: string[]) {
      materialOrder
        .stsList({
          client_id: Number(this.$route.query.id),
          start_time: date[0],
          end_time: date[1]
        })
        .then((res) => {
          if (res.data.status) {
            res.data.data.forEach((item: any) => {
              item.settle_price = Number(item.settle_price)
              item.number = Number(item.number)
              item.price = Number(item.price)
              this.updatePriceYarnList.push(item)
            })
            this.updatePriceYarnList = Array.from(
              new Set(this.updatePriceYarnList.map((item: any) => item.material_name))
            ).map((item) => {
              return {
                value: item
              }
            })
            const mergeList = this.$mergeData(res.data.data, {
              mainRule: 'created_at',
              childrenRule: {
                mainRule: ['material_name', 'attribute', 'price', 'settle_price']
              }
            })
            mergeList.forEach((item: any) => {
              item.childrenMergeInfo.forEach((itemChild: any) => {
                itemChild.baipeiNum = itemChild.childrenMergeInfo
                  .filter((itemMin: any) => itemMin.material_color === '白胚')
                  .reduce((total: number, cur: any) => {
                    return total + Number(cur.number)
                  }, 0)
                itemChild.seshaNum = itemChild.childrenMergeInfo
                  .filter((itemMin: any) => itemMin.material_color !== '白胚')
                  .reduce((total: number, cur: any) => {
                    return total + Number(cur.number)
                  }, 0)
              })
              item.realChildren = []
              item.childrenMergeInfo.forEach((itemChild: any) => {
                if (itemChild.baipeiNum > 0) {
                  item.realChildren.push({
                    new_settle_price: '',
                    settle_price: itemChild.settle_price,
                    material_name: itemChild.material_name,
                    price: itemChild.price,
                    attribute: itemChild.attribute,
                    number: itemChild.baipeiNum,
                    material_color: '白胚'
                  })
                }
                if (itemChild.seshaNum > 0) {
                  item.realChildren.push({
                    new_settle_price: '',
                    settle_price: itemChild.settle_price,
                    material_name: itemChild.material_name,
                    price: itemChild.price,
                    attribute: itemChild.attribute,
                    number: itemChild.seshaNum,
                    material_color: '色纱'
                  })
                }
              })
            })
            this.updatePriceOriginList = mergeList
            this.updatePriceFlag = true
            this.getMatShowList()
          }
        })
    },
    // 前端做筛选
    getMatShowList() {
      this.updatePriceShowList = this.$clone(this.updatePriceOriginList).filter((item: any) => {
        item.realChildren = item.realChildren.filter((itemChild: any) => {
          let nameFlag = this.updatePriceInfo.material_name
            ? itemChild.material_name.toLowerCase().indexOf(this.updatePriceInfo.material_name.toLowerCase()) === 0
            : true
          let attrFlag = this.updatePriceInfo.attribute
            ? itemChild.attribute.toLowerCase().indexOf(this.updatePriceInfo.attribute.toLowerCase()) === 0
            : true
          let colorFlag = this.updatePriceInfo.material_color
            ? itemChild.material_color.toLowerCase().indexOf(this.updatePriceInfo.material_color.toLowerCase()) === 0
            : true
          return nameFlag && attrFlag && colorFlag
        })
        return item.realChildren.length > 0
      })
    },
    saveUpdatePrice() {
      const formData: any[] = []
      this.updatePriceShowList.forEach((item: any) => {
        item.realChildren.forEach((itemChild: any) => {
          if (itemChild.new_settle_price) {
            formData.push({
              material_name: itemChild.material_name,
              material_color: itemChild.material_color,
              settle_price: itemChild.new_settle_price,
              attribute: itemChild.attribute,
              price: itemChild.price,
              start_time: this.updatePriceInfo.date[0],
              end_time: this.updatePriceInfo.date[1],
              client_id: this.$route.query.id
            })
          }
        })
      })
      if (formData.length > 0) {
        updateSettlePrice({ data: formData }).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
          }
          this.updatePriceInfo = {
            material_name: '',
            material_color: '',
            settle_price: '',
            attribute: '',
            start_time: '',
            end_time: '',
            date: [new Date().getFullYear() + '-01-01', this.$formatDate(new Date())],
            client_id: null
          }
          this.updatePriceOriginList = []
          this.updatePriceShowList = []
          this.updatePriceFlag = false
        })
      } else {
        this.$message.error('请填写修改单价')
      }
    },
    // 补纱单据
    getSupList() {
      this.listLoading = true
      this.checkSubAll = false
      this.subShowAllFlag = true
      let subParams = this.subParams

      if (subParams.date.length === 0) {
        ;(subParams.start_time = ''), (subParams.end_time = '')
      } else {
        ;(subParams.start_time = subParams.date[0]), (subParams.end_time = subParams.date[1])
      }

      subParams.page = this.subPage
      materialSupplement.list(subParams).then((res) => {
        if (res.data.status) {
          this.subList = res.data.data.items
          this.subTotal = res.data.data.total
          this.subAdditional = res.data.data.additional
        }
        this.listLoading = false
      })
    },
    // 物料订购单跳转
    openMaterialOrder(info: any) {
      if (info.plan_id) {
        this.$openUrl('/materialManage/detail?id=' + info.plan_id)
      } else if (info.sup_id) {
        this.$openUrl('/materialManage/detail?id=' + info.sup_id + '&supFlag=1')
      } else if (info.reserve_id) {
        this.$openUrl('/materialPlanOrder/detail?id=' + info.client_id)
      } else {
        // 都没有说明是辅料单子，不需要计划
        this.$router.push('/accessoriesManage/detail?id=' + info.top_order_id + '&sampleOrderIndex=' + info.order_id)
      }
    },
    // 跳转单据列表去导数据
    goUrl() {
      if (this.$route.query.type === '面料原料单位') {
        this.$openUrl(
          '/billingManagement/rawMaterialPurchaseOrder?single_client_id=' +
            this.$route.query.id +
            '&group_id=' +
            this.materialOrderFilter.group_id +
            '&keyword=' +
            this.materialOrderFilter.keyword
        )
      } else if (this.$route.query.type === '纱线原料单位') {
        this.$openUrl(
          '/billingManagement/rawMaterialPurchaseOrder?single_client_id=' +
            this.$route.query.id +
            '&group_id=' +
            this.materialOrderFilter.group_id +
            '&keyword=' +
            this.materialOrderFilter.keyword
        )
      } else if (this.$route.query.type === '装饰辅料单位') {
        this.$openUrl(
          '/billingManagement/auxiliaryMaterialPurchaseOrder?single_client_id=' +
            this.$route.query.id +
            '&group_id=' +
            this.accessoriesFilter.group_id +
            '&keyword=' +
            this.accessoriesFilter.keyword
        )
      } else if (this.$route.query.type === '原料加工单位') {
        this.$openUrl(
          '/billingManagement/rawMaterialProcessingOrder?single_client_id=' +
            this.$route.query.id +
            '&group_id=' +
            this.materialProcessFilter.group_id +
            '&keyword=' +
            this.materialProcessFilter.keyword
        )
      } else if (this.$route.query.type === '生产织造单位') {
        this.$openUrl(
          '/billingManagement/productionPlan?single_client_id=' +
            this.$route.query.id +
            '&group_id=' +
            this.productionPlanFilter.group_id +
            '&keyword=' +
            this.productionPlanFilter.keyword
        )
      } else if (this.$route.query.type === '生产加工单位') {
        this.$openUrl(
          '/billingManagement/productionPlan?single_client_id=' +
            this.$route.query.id +
            '&group_id=' +
            this.productionPlanFilter.group_id +
            '&keyword=' +
            this.productionPlanFilter.keyword
        )
      } else if (this.$route.query.type === '包装辅料单位') {
        this.$openUrl(
          '/billingManagement/packingOrder?single_client_id=' +
            this.$route.query.id +
            '&group_id=' +
            this.packOrderFilter.group_id +
            '&keyword=' +
            this.packOrderFilter.keyword
        )
      } else if (this.$route.query.type === '运输单位') {
        this.$openUrl(
          '/billingManagement/transportationDeliveryOrder?single_client_id=' +
            this.$route.query.id +
            '&group_id=' +
            this.boxManageFilter.group_id +
            '&keyword=' +
            this.boxManageFilter.keyword
        )
      }
    },
    showProduct(item: any) {
      this.productShow = true
      this.productDetailId = item.product_id
    },
    exportExcel(type?: number, payType?: string) {
      this.loading = true

      if (!type) {
        if (this.clientType === 2) {
          let material_name = ''
          if (this.$route.query.type === '装饰辅料单位') {
            material_name = this.materialOrderFilter.material_name || ''
          } else {
            material_name = this.materialOrderFilter.material_name.length
              ? this.materialOrderFilter.material_name[2]
              : ''
          }
          // 物料订购单
          materialOrder
            .list({
              code: this.materialOrderFilter.keyword,
              export_excel: 1,
              client_id: Number(this.$route.query.id),
              group_id: this.materialOrderFilter.group_id,
              is_check: this.materialOrderFilter.is_check,
              has_invoice: this.materialOrderFilter.has_invoice,
              material_name: material_name,
              has_deduct: this.materialOrderFilter.has_deduct,
              has_pay: this.materialOrderFilter.has_pay,
              start_time:
                this.materialOrderFilter.date && this.materialOrderFilter.date.length > 0
                  ? this.materialOrderFilter.date[0]
                  : '',
              end_time:
                this.materialOrderFilter.date && this.materialOrderFilter.date.length > 0
                  ? this.materialOrderFilter.date[1]
                  : '',
              start_push_time:
                this.materialOrderFilter.pushDate && this.materialOrderFilter.pushDate.length > 0
                  ? this.materialOrderFilter.pushDate[0]
                  : '',
              end_push_time:
                this.materialOrderFilter.pushDate && this.materialOrderFilter.pushDate.length > 0
                  ? this.materialOrderFilter.pushDate[1]
                  : ''
            })
            .then((res) => {
              window.location.href = res.data.data
              this.loading = false
            })
        } else if (this.clientType === 3) {
          // 物料加工单
          materialProcess
            .list({
              code: this.materialProcessFilter.keyword,
              client_id: Number(this.$route.query.id),
              group_id: this.materialProcessFilter.group_id,
              is_check: this.materialProcessFilter.is_check,
              has_invoice: this.materialProcessFilter.has_invoice,
              has_deduct: this.materialProcessFilter.has_deduct,
              material_name: this.materialProcessFilter.material_name.length
                ? this.materialProcessFilter.material_name[2]
                : '',
              has_pay: this.materialProcessFilter.has_pay,
              start_time:
                this.materialProcessFilter.date && this.materialProcessFilter.date.length > 0
                  ? this.materialProcessFilter.date[0]
                  : '',
              end_time:
                this.materialProcessFilter.date && this.materialProcessFilter.date.length > 0
                  ? this.materialProcessFilter.date[1]
                  : '',
              export_excel: 1
            })
            .then((res) => {
              window.location.href = res.data.data
              this.loading = false
            })
        } else if (this.clientType === 4) {
          // 生产计划单
          productionPlan
            .list({
              code: this.productionPlanFilter.keyword,
              client_id: Number(this.$route.query.id),
              export_excel: 1,
              group_id: this.productionPlanFilter.group_id,
              is_check: this.productionPlanFilter.is_check,
              has_invoice: this.productionPlanFilter.has_invoice,
              has_deduct: this.productionPlanFilter.has_deduct,
              has_pay: this.productionPlanFilter.has_pay,
              start_time:
                this.productionPlanFilter.date && this.productionPlanFilter.date.length > 0
                  ? this.productionPlanFilter.date[0]
                  : '',
              end_time:
                this.productionPlanFilter.date && this.productionPlanFilter.date.length > 0
                  ? this.productionPlanFilter.date[1]
                  : ''
            })
            .then((res) => {
              window.location.href = res.data.data
              this.loading = false
            })
        } else if (this.clientType === 11) {
          // 包装订购单
          packManage
            .orderList({
              code: this.packOrderFilter.keyword,
              client_id: Number(this.$route.query.id),
              group_id: this.packOrderFilter.group_id,
              is_check: this.packOrderFilter.is_check,
              has_invoice: this.packOrderFilter.has_invoice,
              has_deduct: this.packOrderFilter.has_deduct,
              has_pay: this.packOrderFilter.has_pay,
              start_time:
                this.packOrderFilter.date && this.packOrderFilter.date.length > 0 ? this.packOrderFilter.date[0] : '',
              end_time:
                this.packOrderFilter.date && this.packOrderFilter.date.length > 0 ? this.packOrderFilter.date[1] : '',
              export_excel: 1
            })
            .then((res) => {
              window.location.href = res.data.data
              this.loading = false
            })
        } else if (this.clientType === 13) {
          // 发货单
          boxManage
            .list({
              code: this.boxManageFilter.keyword,
              client_id: Number(this.$route.query.id),
              group_id: this.boxManageFilter.group_id,
              is_check: this.boxManageFilter.is_check,
              has_invoice: this.boxManageFilter.has_invoice,
              has_deduct: this.boxManageFilter.has_deduct,
              has_pay: this.boxManageFilter.has_pay,
              start_time:
                this.boxManageFilter.date && this.boxManageFilter.date.length > 0 ? this.boxManageFilter.date[0] : '',
              end_time:
                this.boxManageFilter.date && this.boxManageFilter.date.length > 0 ? this.boxManageFilter.date[1] : '',
              export_excel: 1
            })
            .then((res) => {
              window.location.href = res.data.data
              this.loading = false
            })
        }
      } else {
        let start_time = ''
        let end_time = ''
        let y = new Date().getFullYear()
        let m = new Date().getMonth() + 1
        // @ts-ignore
        let q = Math.floor(m % 3 == 0 ? m / 3 : m / 3 + 1)

        switch (type) {
          case 1:
            start_time = new Date(y, m - 1, 1).toLocaleDateString().replaceAll('/', '-')
            end_time = new Date(y, m, 0).toLocaleDateString().replaceAll('/', '-')
            break
          case 2:
            start_time = new Date(y, (q - 1) * 3, 1).toLocaleDateString().replaceAll('/', '-')
            end_time = new Date(y, q * 3, 0).toLocaleDateString().replaceAll('/', '-')
            break
          case 3:
            start_time = y + '-01-01'
            end_time = y + '-12-31'
            break
        }
        if (payType === 'invoice') {
          invoice
            .list({
              start_time: start_time,
              end_time: end_time,
              export_excel: 1,
              client_id: this.$route.query.id as string
            })
            .then((res) => {
              window.location.href = res.data.data
              this.loading = false
            })
        } else if (payType === 'deduct') {
          deduct
            .list({
              start_time: start_time,
              end_time: end_time,
              export_excel: 1,
              client_id: this.$route.query.id as string
            })
            .then((res) => {
              window.location.href = res.data.data
              this.loading = false
            })
        } else {
          payment
            .list({
              start_time: start_time,
              end_time: end_time,
              export_excel: 1,
              client_id: this.$route.query.id as string
            })
            .then((res) => {
              window.location.href = res.data.data
              this.loading = false
            })
        }
      }
    },
    getFinancialDetail() {
      client
        .financialDetail({
          id: Number(this.$route.query.id),
          year: this.year
        })
        .then((res) => {
          if (res.data.status) {
            this.clientFinancial = res.data.data
          } else {
            this.clientFinancial.total_pay_price = 0
            this.clientFinancial.total_deduct_price = 0
            this.clientFinancial.total_invoice_price = 0
            this.clientFinancial.total_plan_number = 0
            this.clientFinancial.total_plan_price = 0
            this.clientFinancial.total_real_number = 0
            this.clientFinancial.total_real_price = 0
          }
        })
    },
    searchAboutList(time: string, name: string) {
      this.materialOrderFilter.material_name = name
      this.materialOrderFilter.date = [time, time]
      this.getBill()
    },
    // 获取不同的单据
    getBill(init?: 'init') {
      this.listLoading = true
      this.checkAll = false
      this.showAllFlag = true
      if (this.clientType === 2) {
        let material_name = ''
        if (this.$route.query.type === '装饰辅料单位') {
          material_name = this.materialOrderFilter.material_name || ''
        } else {
          material_name = this.materialOrderFilter.material_name.length ? this.materialOrderFilter.material_name[2] : ''
        }
        // 物料订购单
        materialOrder
          .list({
            code: this.materialOrderFilter.keyword,
            client_id: Number(this.$route.query.id),
            page: this.listPage,
            limit: 10,
            group_id: this.materialOrderFilter.group_id,
            is_check: this.materialOrderFilter.is_check,
            has_invoice: this.materialOrderFilter.has_invoice,
            has_deduct: this.materialOrderFilter.has_deduct,
            has_pay: this.materialOrderFilter.has_pay,
            material_name: material_name,
            start_time:
              this.materialOrderFilter.date && this.materialOrderFilter.date.length > 0
                ? this.materialOrderFilter.date[0]
                : '',
            end_time:
              this.materialOrderFilter.date && this.materialOrderFilter.date.length > 0
                ? this.materialOrderFilter.date[1]
                : '',
            start_push_time:
              this.materialOrderFilter.pushDate && this.materialOrderFilter.pushDate.length > 0
                ? this.materialOrderFilter.pushDate[0]
                : '',
            end_push_time:
              this.materialOrderFilter.pushDate && this.materialOrderFilter.pushDate.length > 0
                ? this.materialOrderFilter.pushDate[1]
                : ''
          })
          .then((res) => {
            this.materialOrderList = res.data.data.items
            this.listTotal = res.data.data.total
            this.materialOrderSts = res.data.data.additional
            this.listLoading = false
          })
      } else if (this.clientType === 3) {
        // 物料加工单
        materialProcess
          .list({
            code: this.materialProcessFilter.keyword,
            client_id: Number(this.$route.query.id),
            page: this.listPage,
            group_id: this.materialProcessFilter.group_id,
            material_name: this.materialProcessFilter.material_name.length
              ? this.materialProcessFilter.material_name[2]
              : '',
            is_check: this.materialProcessFilter.is_check,
            has_invoice: this.materialProcessFilter.has_invoice,
            has_deduct: this.materialProcessFilter.has_deduct,
            has_pay: this.materialProcessFilter.has_pay,
            start_time:
              this.materialProcessFilter.date && this.materialProcessFilter.date.length > 0
                ? this.materialProcessFilter.date[0]
                : '',
            end_time:
              this.materialProcessFilter.date && this.materialProcessFilter.date.length > 0
                ? this.materialProcessFilter.date[1]
                : '',
            limit: 10
          })
          .then((res) => {
            this.materialProcessList = res.data.data.items
            this.listTotal = res.data.data.total
            this.materialProcessSts = res.data.data.additional
            this.listLoading = false
          })
      } else if (this.clientType === 4) {
        // 生产计划单
        productionPlan
          .list({
            code: this.productionPlanFilter.keyword,
            client_id: Number(this.$route.query.id),
            page: this.listPage,
            group_id: this.productionPlanFilter.group_id,
            is_check: this.productionPlanFilter.is_check,
            has_invoice: this.productionPlanFilter.has_invoice,
            has_deduct: this.productionPlanFilter.has_deduct,
            has_pay: this.productionPlanFilter.has_pay,
            start_time:
              this.productionPlanFilter.date && this.productionPlanFilter.date.length > 0
                ? this.productionPlanFilter.date[0]
                : '',
            end_time:
              this.productionPlanFilter.date && this.productionPlanFilter.date.length > 0
                ? this.productionPlanFilter.date[1]
                : '',
            limit: 10
          })
          .then((res) => {
            this.productionPlanList = res.data.data.items
            this.listTotal = res.data.data.total
            this.productionPlanSts = res.data.data.additional
            this.listLoading = false
          })
      } else if (this.clientType === 11) {
        // 包装订购单
        packManage
          .orderList({
            code: this.packOrderFilter.keyword,
            client_id: Number(this.$route.query.id),
            page: this.listPage,
            group_id: this.packOrderFilter.group_id,
            is_check: this.packOrderFilter.is_check,
            has_invoice: this.packOrderFilter.has_invoice,
            has_deduct: this.packOrderFilter.has_deduct,
            has_pay: this.packOrderFilter.has_pay,
            start_time:
              this.packOrderFilter.date && this.packOrderFilter.date.length > 0 ? this.packOrderFilter.date[0] : '',
            end_time:
              this.packOrderFilter.date && this.packOrderFilter.date.length > 0 ? this.packOrderFilter.date[1] : '',
            limit: 10
          })
          .then((res) => {
            this.packOrderList = res.data.data.items
            this.listTotal = res.data.data.total
            this.packOrderSts = res.data.data.additional
            this.listLoading = false
          })
      } else if (this.clientType === 13) {
        // 发货单
        boxManage
          .list({
            code: this.boxManageFilter.keyword,
            client_id: Number(this.$route.query.id),
            page: this.listPage,
            group_id: this.boxManageFilter.group_id,
            is_check: this.boxManageFilter.is_check,
            has_invoice: this.boxManageFilter.has_invoice,
            has_deduct: this.boxManageFilter.has_deduct,
            has_pay: this.boxManageFilter.has_pay,
            start_time:
              this.boxManageFilter.date && this.boxManageFilter.date.length > 0 ? this.boxManageFilter.date[0] : '',
            end_time:
              this.boxManageFilter.date && this.boxManageFilter.date.length > 0 ? this.boxManageFilter.date[1] : '',
            limit: 10
          })
          .then((res) => {
            this.boxManageList = res.data.data.items
            this.listTotal = res.data.data.total
            this.boxManageSts = res.data.data.additional
            this.listLoading = false
          })
      }
      if (init !== 'init') {
        document.querySelector('#单据列表')!.scrollIntoView(true)
      }
    },
    changeShowAll(info: any[], type?: string, which: string = 'showAllFlag') {
      info.forEach((item) => {
        if (this[which]) {
          this.changeShow(item, type)
        } else {
          item.isShow = false
        }
      })
      this[which] = !this[which]
    },
    changeShow(item: any, type?: string) {
      this.listLoading = true
      if (!item.detail) {
        if (type === 'sub') {
          materialSupplement
            .detail({
              id: item.id
            })
            .then((res) => {
              if (res.status) {
                item.detail = res.data.data
                item.isShow = true
                this.$forceUpdate()
              }
              this.listLoading = false
            })
        } else if (this.clientType === 2) {
          materialOrder
            .detail({
              id: item.id
            })
            .then((res) => {
              if (res.status) {
                item.detail = res.data.data
                item.isShow = true
                this.$forceUpdate()
              }
              this.listLoading = false
            })
        } else if (this.clientType === 3) {
          materialProcess
            .detail({
              id: item.id
            })
            .then((res) => {
              if (res.status) {
                item.detail = res.data.data
                item.isShow = true
                this.$forceUpdate()
              }
              this.listLoading = false
            })
        } else if (this.clientType === 4) {
          productionPlan
            .detail({
              id: item.id
            })
            .then((res) => {
              if (res.status) {
                item.detail = res.data.data
                // 算一下乱七八糟一堆费用
                item.others_fee = item.detail.others_fee_data.reduce((total: any, cur: any) => {
                  return total + Number(cur.price)
                }, 0)
                item.deduct_fee = item.detail.deduct_data.reduce((total: any, cur: any) => {
                  return total + Number(cur.price)
                }, 0)
                item.sup_fee = item.detail.sup_data.reduce((total: any, cur: any) => {
                  return (
                    total +
                    cur.client_data.reduce((totalChild: any, curChild: any) => {
                      return totalChild + (curChild.bear_client_id === item.client_id ? Number(curChild.bear_price) : 0)
                    }, 0)
                  )
                }, 0)
                item.real_fee = this.$toFixed(
                  item.detail.product_info_data.reduce((total: any, cur: any) => {
                    return total + Number(cur.real_number) * Number(cur.price)
                  }, 0)
                )
                item.isShow = true
                this.$forceUpdate()
              }
              this.listLoading = false
            })
        } else if (this.clientType === 11) {
          packManage
            .orderListDetail({
              id: item.id
            })
            .then((res) => {
              if (res.status) {
                item.detail = res.data.data
                item.isShow = true
                this.$forceUpdate()
              }
              this.listLoading = false
            })
        } else if (this.clientType === 13) {
          boxManage
            .detail({
              id: item.id
            })
            .then((res) => {
              if (res.status) {
                item.detail = res.data.data
                item.isShow = true
                this.$forceUpdate()
              }
              this.listLoading = false
            })
        }
      } else {
        item.isShow = !item.isShow
        this.listLoading = false
      }
    },
    getDeduct(info: any[]) {
      if (!info || info.length === 0) {
        this.$message.warning('暂无扣款信息')
      } else {
        this.deductDetail = info
        this.deductDetailFlag = true
      }
    },
    getCheckInfo(ev: boolean, item: any, checkList: any[]) {
      if (ev) {
        if (!checkList.find((itemFind) => itemFind.id === item.id)) {
          checkList.push(item)
        }
      } else {
        const index = checkList.map((itemFind) => itemFind.id).indexOf(item.id)
        if (index !== -1) {
          checkList.splice(index, 1)
        }
      }
      this.$forceUpdate()
    },
    checkAllInfo(ev: boolean, list: any[], checkList: any[]) {
      list.forEach((item) => {
        item.checked = ev
        this.getCheckInfo(ev, item, checkList)
      })
      this.$forceUpdate()
    },
    getPaymentLogList() {
      this.paymentLoading = true
      payment
        .list({
          order_id: '',
          client_id: this.$route.query.id as string,
          order_code: this.paymentOrderCode,
          code: this.paymentKeyword,
          start_time: this.paymentDate.length > 1 ? this.paymentDate[0] : '',
          end_time: this.paymentDate.length > 1 ? this.paymentDate[1] : '',
          user_id: this.paymentUser,
          page: this.paymentPage,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            this.paymentLog = res.data.data.items
            this.paymentTotal = res.data.data.total
            this.paymentTotalPrice = this.$toFixed(res.data.data.additional.total_price / 10000, 3, true)
          }
          this.paymentLoading = false
        })
    },
    goPayment(data: any[], update?: boolean, invoiceChange?: boolean) {
      this.invoiceChange = invoiceChange
      this.paymentUpdate = update
      this.paymentData = data
      this.paymentFlag = true
    },
    deletePayment(id: number) {
      this.$confirm('是否删除该付款单据?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          payment.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getPaymentLogList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getInvoiceLogList() {
      this.invoiceLoading = true
      invoice
        .list({
          order_id: '',
          client_id: this.$route.query.id as string,
          order_code: this.invoiceOrderCode,
          code: this.invoiceKeyword,
          invoice_code: this.invoiceCode,
          start_time: this.invoiceDate.length > 1 ? this.invoiceDate[0] : '',
          end_time: this.invoiceDate.length > 1 ? this.invoiceDate[1] : '',
          user_id: this.invoiceUser,
          page: this.invoicePage,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            this.invoiceLog = res.data.data.items
            this.invoiceTotal = res.data.data.total
            this.invoiceTotalPrice = this.$toFixed(res.data.data.additional.total_price / 10000, 3, true)
            this.invoiceTotalNoTaxPrice = this.$toFixed(res.data.data.additional.total_price_no_tax / 10000, 3, true)
            this.invoiceTotalTaxPrice = this.$toFixed(res.data.data.additional.total_price_tax / 10000, 3, true)
          }
          this.invoiceLoading = false
        })
    },
    goInvoice(data: any[], update?: boolean) {
      this.invoiceUpdate = update
      this.invoiceData = data
      this.invoiceFlag = true
    },
    deleteInvoice(id: number) {
      this.$confirm('是否删除该开票单据?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          invoice.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getInvoiceLogList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getDeductLogList() {
      this.deductLoading = true
      deduct
        .list({
          order_id: '',
          client_id: this.$route.query.id as string,
          order_code: this.deductOrderCode,
          code: this.deductKeyword,
          start_time: this.deductDate.length > 1 ? this.deductDate[0] : '',
          end_time: this.deductDate.length > 1 ? this.deductDate[1] : '',
          user_id: this.deductUser,
          page: this.deductPage,
          limit: 10
        })
        .then((res) => {
          if (res.data.status) {
            this.deductLog = res.data.data.items
            this.deductTotal = res.data.data.total
            this.deductTotalPrice = this.$toFixed(res.data.data.additional.total_price / 10000, 3, true)
          }
          this.deductLoading = false
        })
    },
    goDeduct(data: any[], update?: boolean, type?: string) {
      this.deductUpdate = update
      this.deductData = data
      if (type === 'sub') {
        this.subDeductFlag = true
      } else {
        this.deductFlag = true
      }
    },
    deleteDeduct(id: number) {
      this.$confirm('是否删除该扣款单据?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deduct.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message.success('删除成功')
              this.getDeductLogList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    reset() {
      this.clientDateParams = {
        client_id: this.$route.query.id,
        date: [new Date().getFullYear() + '-01-01', new Date().getFullYear() + '-12-31'],
        keyword: '',
        process: '',
        yarn_type: this.$route.query.type === '纱线原料单位' ? 1 : this.$route.query.type === '面料原料单位' ? 2 : ''
      }
      this.subParams = {
        bear_client_id: this.$route.query.id,
        group_id: '',
        code: '',
        is_check: '',
        date: [],
        user_id: '',
        limit: 10
      }
      this.materialOrderFilter = {
        date: [],
        user_id: '',
        keyword: '',
        group_id: '',
        is_check: '',
        has_invoice: '',
        has_deduct: '',
        has_pay: ''
      }
      this.materialProcessFilter = {
        date: [],
        user_id: '',
        keyword: '',
        group_id: '',
        is_check: '',
        has_invoice: '',
        has_deduct: '',
        has_pay: ''
      }
      this.productionPlanFilter = {
        date: [],
        user_id: '',
        keyword: '',
        group_id: '',
        is_check: '',
        has_invoice: '',
        has_deduct: '',
        has_pay: ''
      }
      this.packOrderFilter = {
        date: [],
        user_id: '',
        keyword: '',
        group_id: '',
        is_check: '',
        has_invoice: '',
        has_deduct: '',
        has_pay: ''
      }
      this.boxManageFilter = {
        date: [],
        user_id: '',
        keyword: '',
        group_id: '',
        is_check: '',
        has_invoice: '',
        has_deduct: '',
        has_pay: ''
      }
      this.getBill()
      if (
        (this.clientType === 2 && this.$route.query.type !== '装饰辅料单位') ||
        this.clientType === 3 ||
        this.clientType === 4
      ) {
        this.getSupList()
      }
      this.getClientDate(this.$route.query.type)
    },
    // 重置数据图表
    resetStatic() {
      this.optionStatic = {
        color: ['#229CFB', '#8E44AD', '#1FB48C', '#F39C25', '#D3541A'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          formatter: (params: any) => {
            var htmlStr = '<div>'
            htmlStr += params[0].name //x轴的名称
            params.forEach((param: any, index: number) => {
              var color = param.color //图例颜色

              //为了保证和原来的效果一样，这里自己实现了一个点的效果
              htmlStr +=
                '<br /><span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
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
                (index < 2 ? 'kg' : '元/kg')
            })
            htmlStr += '</div>'

            return htmlStr
          }
        },
        dataZoom: [
          {
            start: 0, //默认为0
            end: 100 - 1500 / 31, //默认为100
            type: 'slider',
            maxValueSpan: 10, //窗口的大小，显示数据的条数的
            show: true,
            handleSize: 0, //滑动条的 左右2个滑动条的大小
            height: '5%', //组件高度
            left: 65,
            right: 85,
            bottom: 20,
            borderColor: 'rgba(43,48,67,.8)',
            fillerColor: '#33384b',
            zoomLock: true,
            brushSelect: false,
            backgroundColor: 'rgba(43,48,67,.8)', //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            realtime: true, //是否实时更新
            xAxisIndex: [0] //控制的 x轴
          }
        ],
        legend: {
          data: ['订购数量', '平均单价']
        },
        xAxis: [
          {
            type: 'category',
            data: [],
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
            max: 500,
            interval: 100,
            axisLabel: {
              formatter: '{value} kg'
            }
          },
          {
            type: 'value',
            show: false,
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 元/kg'
            }
          },
          {
            type: 'value',
            show: false,
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 元/kg'
            }
          },
          {
            type: 'value',
            show: false,
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 元/kg'
            }
          },
          {
            type: 'value',
            name: '',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} 元/kg'
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: '订购数量',
            data: []
          },
          {
            type: 'line',
            name: '入库数量',
            symbolSize: 0, // symbol的大小设置为0让线的小圆点不显示
            showSymbol: false, // 不显示symbol不显示
            lineStyle: {
              width: 0, // 线宽是0不显示线
              color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
            },
            data: []
          },
          {
            type: 'line',
            name: '平均单价',
            yAxisIndex: 1,
            data: []
          },
          {
            type: 'line',
            name: '最高单价',
            symbolSize: 0, // symbol的大小设置为0让线的小圆点不显示
            showSymbol: false, // 不显示symbol不显示
            lineStyle: {
              width: 0, // 线宽是0不显示线
              color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
            },
            data: []
          },
          {
            type: 'line',
            name: '最低单价',
            symbolSize: 0, // symbol的大小设置为0让线的小圆点不显示
            showSymbol: false, // 不显示symbol不显示
            lineStyle: {
              width: 0, // 线宽是0不显示线
              color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
            },
            data: []
          }
        ]
      }
    },
    // 拿到最大最小值
    getData(arr: any, n1: any, n2: any, n3: any, n4: any) {
      n1 = arr.reduce((num1: any, num2: any) => {
        return +num1.number > +num2.number ? num1 : num2
      })
      n2 = arr.reduce((num1: any, num2: any) => {
        return +num1.number < +num2.number ? num1 : num2
      })
      n3 = arr.reduce((num1: any, num2: any) => {
        return +num1.avg_price > +num2.avg_price ? num1 : num2
      })
      n4 = arr.reduce((num1: any, num2: any) => {
        return +num1.avg_price < +num2.avg_price ? num1 : num2
      })

      n1 = +n1.number
      n2 = +n2.number
      n3 = +n3.avg_price
      n4 = +n4.avg_price
      return [n1, n2, n3, n4]
    },
    // 获取数据报表
    getStaticData() {
      statistics
        .materialClient({
          year: this.staticYear,
          client_id: this.$route.query.id + ''
        })
        .then((res) => {
          this.resetStatic()
          let data = res.data.data
          let maxNumber, minNumber, maxPrice, minPrice
          let arr: any = []

          if (this.sortWay === 1) {
            data.sort(function (a: any, b: any) {
              return b.number - a.number
            })
          } else if (this.sortWay === 2) {
            data.sort(function (a: any, b: any) {
              return b.push_number - a.push_number
            })
          } else if (this.sortWay === 3) {
            data.sort(function (a: any, b: any) {
              return b.avg_price - a.avg_price
            })
          }

          if (data.length > 0) {
            arr = this.getData(data, maxNumber, minNumber, maxPrice, minPrice)
            maxNumber = arr[0]
            minNumber = arr[1]
            maxPrice = arr[2]
            minPrice = arr[3]
          }

          //   采购数量 图表更新
          this.optionStatic.yAxis[0].max = Math.ceil(Math.ceil(maxNumber / 5)) * 5 || 10
          this.optionStatic.yAxis[0].min = minNumber && minNumber < 0 ? Math.ceil(minNumber) : 0
          this.optionStatic.yAxis[0].interval = Math.ceil(maxNumber / 5) || 10

          //   采购金额 图表更新
          this.optionStatic.yAxis[1].max = Math.ceil(Math.ceil(maxPrice / 5)) * 5 || 10
          this.optionStatic.yAxis[1].min = minPrice && minPrice < 0 ? Math.ceil(minPrice) : 0
          this.optionStatic.yAxis[1].interval = Math.ceil(maxPrice / 5) || 10

          data.forEach((item: any) => {
            this.optionStatic.xAxis[0].data.push(item.material_name)
            this.optionStatic.series[0].data.push(item.number)
            this.optionStatic.series[1].data.push(item.push_number)
            this.optionStatic.series[2].data.push(item.avg_price)
            this.optionStatic.series[3].data.push(item.max_price)
            this.optionStatic.series[4].data.push(item.min_price)
          })
        })
    },
    init() {
      this.updatePriceInfo.date = [new Date().getFullYear() + '-01-01', this.$formatDate(new Date())]
      if (this.$route.query.type === '纱线原料单位' || this.$route.query.type === '面料原料单位') {
        this.getStaticData()
      }
      this.getClientDate(this.$route.query.type)
      this.getFinancialDetail()
      this.getBill('init')
      this.getSupList()
      this.getPaymentLogList()
      this.getInvoiceLogList()
      this.getDeductLogList()
    },
    // 汇总表
    getClientDate(type: any) {
      this.listLoading = true
      this.clientDateParams.start_time = this.clientDateParams.date[0]
      this.clientDateParams.end_time = this.clientDateParams.date[1]

      // 根据不同类型删除对应属性
      if (type !== '原料加工单位') {
        delete this.clientDateParams.process
      }
      if (type !== '纱线原料单位' && type !== '面料原料单位') {
        delete this.clientDateParams.yarn_type
      }

      // 请求接口
      if (type === '纱线原料单位' || type === '面料原料单位') {
        statistics.materialClientDate(this.clientDateParams).then((res) => {
          // 加个判断，让下面异步执行的函数变成同步执行的函数
          if (res.data.status) {
            let arr: any = []
            res.data.data.forEach((item: any) => {
              item.info.forEach((itemColor: any) => {
                itemColor.info.forEach((itemDetail: any) => {
                  let obj = itemDetail
                  obj.material_name = item.material_name
                  obj.material_color = itemColor.material_color
                  arr.push(obj)
                })
              })
            })
            this.clientDateList = arr
            this.sortFun()
          }
        })
      } else if (type === '装饰辅料单位') {
        statistics.decorateClientDate(this.clientDateParams).then((res) => {
          // 加个判断，让下面异步执行的函数变成同步执行的函数
          if (res.data.status) {
            let arr: any = []
            res.data.data.forEach((item: any) => {
              item.info.forEach((itemDetail: any) => {
                let obj = itemDetail
                obj.material_name = item.material_name
                arr.push(obj)
              })
            })
            this.clientDateList = arr
            this.sortFun()
          }
        })
      } else if (type === '包装辅料单位') {
        statistics.packClientDate(this.clientDateParams).then((res) => {
          // 加个判断，让下面异步执行的函数变成同步执行的函数
          if (res.data.status) {
            let arr: any = []
            res.data.data.forEach((item: any) => {
              item.info.forEach((itemPrice: any) => {
                itemPrice.info.forEach((itemLength: any) => {
                  itemLength.info.forEach((itemWidth: any) => {
                    itemWidth.info.forEach((itemHeight: any) => {
                      itemHeight.info.forEach((itemDetail: any) => {
                        let obj = itemDetail
                        obj.material_name = item.material_name
                        obj['length'] = itemLength['length']
                        obj.width = itemWidth.width
                        obj.price_type = itemPrice.price_type
                        obj.height = itemHeight.height
                        arr.push(obj)
                      })
                    })
                  })
                })
              })
            })
            this.clientDateList = arr
            this.sortFun()
          }
        })
      } else if (type === '原料加工单位') {
        statistics.processClientDate(this.clientDateParams).then((res) => {
          // 加个判断，让下面异步执行的函数变成同步执行的函数
          if (res.data.status) {
            let arr: any = []
            res.data.data.forEach((item: any) => {
              item.info.forEach((itemDetail: any) => {
                let obj = itemDetail
                obj.material_name = item.material_name
                arr.push(obj)
              })
            })
            this.clientDateList = arr
            this.sortFun()
          }
        })
      }
    },
    // 中转站，不用每次都写一遍重复的代码
    sortFun() {
      this.sortClientDate()
      this.listLoading = false
    },
    changeSelectClient(page: any) {
      this.selectClientDateList = this.clientDateList.slice((page - 1) * 10, page * 10)
    },
    // 汇总表排序
    sortClientDate() {
      let sortCol = this.sortCol
      let sort = this.sort
      this.clientDateList.sort(function (a: any, b: any) {
        if (sort === 'asc') {
          return a[sortCol] - b[sortCol]
        }
        if (sort === 'desc') {
          return b[sortCol] - a[sortCol]
        }
      })
      this.selectClientDateList = this.clientDateList.slice(0, 10)
    },
    // 原料名称搜索
    searchMaterial(str: string, cb: any) {
      let results = str ? this.yarnList.filter(this.createFilter(str)) : this.yarnList.slice(0, 10)
      cb(results)
    },
    searchMaterialNew(str: string, cb: any) {
      console.log(this.updatePriceYarnList)
      let results = str ? this.updatePriceYarnList.filter(this.createFilter(str)) : this.updatePriceYarnList
      cb(results)
    },
    // 原料属性搜索
    searchAttribute(str: string, cb: any) {
      let results = str ? this.yarnAttributeList.filter(this.createFilter(str)) : this.yarnAttributeList
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value && restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    }
  },
  mounted() {
    this.init()
    yarn.list().then((res) => {
      if (res.data.status) {
        this.yarnList = res.data.data.map((item: any) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      }
    })
    this.$checkCommonInfo([
      {
        checkWhich: 'api/group',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getGroupAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      },
      {
        checkWhich: 'api/decorateMaterial',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getDecorateMaterialAsync'
      }
    ])
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/settlement/paymentDetail.less';
</style>