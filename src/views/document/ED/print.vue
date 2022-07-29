<template>
  <div class='tableCtn'
    id='EDPrint'>
    <div class="headerCtn">
      <div class="top">
        <div class="title">中华人民共和国海关出口货物报关单</div>
      </div>
      <div class="bottom">
        <div class="bottom_item">预录入编号： </div>
        <div class="bottom_item">海关编号： </div>
        <div class="bottom_item right"
          style="width:180px"> 页码/页数：
        </div>
      </div>
    </div>
    <div class="tbody">
      <div class="trow">
        <div class="tcol infoCtnCol">
          <div class="label">境内发货人</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">出境关别</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">出口日期</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">申报日期</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">备案号</div>
          <div class="text">AAA</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol infoCtnCol">
          <div class="label">境外收货人</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">运输方式</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">运输工具名称及航次号</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol"
          style="min-width: 504px;">
          <div class="label">提运单号</div>
          <div class="text">AAA</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol infoCtnCol">
          <div class="label">生产销售单位</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">监管方式</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">免征性质</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol"
          style="min-width: 504px;">
          <div class="label">许可证</div>
          <div class="text">AAA</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol infoCtnCol">
          <div class="label">合同协议号</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">贸易国(地区)</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">运抵国(地区)</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">指运港</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">离境口岸</div>
          <div class="text">AAA</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol infoCtnCol"
          style="min-width:243px">
          <div class="label">包装种类</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol"
          style="max-width:113px">
          <div class="label">件数</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol"
          style="max-width:113px">
          <div class="label">毛重(千克)</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol"
          style="max-width:113px">
          <div class="label">净重(千克)</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol"
          style="max-width:113px">
          <div class="label">成交方式</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">运费</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">保费</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">杂费</div>
          <div class="text">AAA</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol infoCtn">
          <div class="label">随附单证及编号：</div>
          <div class="text">AAAAA</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol infoCtn">
          <div class="label">标记喷码及备注：</div>
          <div class="text">AAAAA</div>
        </div>
      </div>
      <div class="trow"
        style="font-size:14px">
        <div class="tcol"
          style="flex:0.5">项目</div>
        <div class="tcol">商品编号</div>
        <div class="tcol"
          style="flex:1.2">商品名称及规格型号</div>
        <div class="tcol"
          style="flex:0.5">数量</div>
        <div class="tcol"
          style="flex:0.5">单位</div>
        <div class="tcol"
          style="flex:0.5">单价</div>
        <div class="tcol"
          style="flex:0.7">总价</div>
        <div class="tcol"
          style="flex:0.5">币制</div>
        <div class="tcol">原产国(地区)</div>
        <div class="tcol">最终目的国(地区)</div>
        <div class="tcol">境内货源地</div>
        <div class="tcol"
          style="flex:0.7">征免</div>
      </div>
      <div class="trow"
        style="font-size:14px">
        <div class="tcol"
          style="flex:0.5"></div>
        <div class="tcol"></div>
        <div class="tcol"
          style="flex:1.2"></div>
        <div class="tcol"
          style="flex:0.5"></div>
        <div class="tcol"
          style="flex:0.5"></div>
        <div class="tcol"
          style="flex:0.5"></div>
        <div class="tcol"
          style="flex:0.7"></div>
        <div class="tcol"
          style="flex:0.5"></div>
        <div class="tcol"></div>
        <div class="tcol"></div>
        <div class="tcol"></div>
        <div class="tcol"
          style="flex:0.7"></div>
      </div>
      <div class="trow noBorder">
        <div class="tcol infoCtn">
          <div class="label">特殊关系确认：</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">价格影响确认：</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">支付特许权使用费确认：</div>
          <div class="text">AAA</div>
        </div>
        <div class="tcol infoCtn">
          <div class="label">自报自缴：</div>
          <div class="text">AAA</div>
        </div>
      </div>
      <div class="trow">
        <div class="tcol noPad"
          style="flex:3">
          <div class="trow noBorder">
            <div class="tcol infoCtnCol">
              <div class="label">报关人员</div>
              <div class="text">AAA</div>
            </div>
            <div class="tcol infoCtnCol">
              <div class="label">报关人员证号</div>
              <div class="text">AAA</div>
            </div>
            <div class="tcol infoCtnCol">
              <div class="label">电话</div>
              <div class="text">AAA</div>
            </div>
          </div>
          <div class="trow noBorder">
            <div class="tcol infoCtnCol">
              <div class="label">申报单位</div>
              <div class="text">AAA</div>
            </div>
            <div class="tcol infoCtnCol">
              <div class="label">申报单位(签章)</div>
              <div class="text">AAA</div>
            </div>
            <div class="tcol infoCtnCol"
              style="position:relative">
              <div class="text"
                style="font-size:12px;position:absolute;right:8px;bottom:8px">兹申明对以上内容承担如实申报、依法纳税责任</div>
            </div>
          </div>
        </div>
        <div class="tcol infoCtnCol">
          <div class="label">海关批注及签章</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
<style lang="less" scoped>
@import '~@/assets/css/document/ED/print.less';
</style>