<template>
  <div class="printContainer">
    <div class="pmain">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">XXXXXXXX打印单</div>
          <div class="prow">
            <div class="pcol">
              <div class="label">巴巴爸爸笨比：</div>
              <div class="info">xxxxxxxxxx</div>
            </div>
            <div class="pcol">
              <div class="label">标题：</div>
              <div class="info">xxxxxxxxxx</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol">
              <div class="label">帆帆帆帆：</div>
              <div class="info">xxxxxxxxxx</div>
            </div>
            <div class="pcol">
              <div class="label">标题放方法：</div>
              <div class="info">xxxxxxxxxx</div>
            </div>
          </div>
        </div>
        <div class="fr">
          <div class="remark">打开微信扫一扫 更新每日生产进度</div>
          <div class="pImage">假装有图</div>
        </div>
      </div>
      <div class="pbody">
        <div class="tableCtn hasTop">
          <div class="tbody">
            <div class="trow">
              <div class="tcol bgGray">生产单号</div>
              <div class="tcol"></div>
              <div class="tcol bgGray">计划完成</div>
              <div class="tcol"></div>
              <div class="tcol bgGray">生产单位</div>
              <div class="tcol"></div>
            </div>
            <div class="trow">
              <div class="tcol bgGray">生产单号</div>
              <div class="tcol"></div>
              <div class="tcol bgGray">计划完成</div>
              <div class="tcol"></div>
              <div class="tcol bgGray">生产单位</div>
              <div class="tcol"></div>
            </div>
          </div>
        </div>
        <div class="tableCtn">
          <div class="thead">
            <div class="trow">
              <div class="tcol">生产单号</div>
              <div class="tcol">生产单位</div>
              <div class="tcol">计划完成</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol">产品信息</div>
                  <div class="tcol">尺码颜色</div>
                  <div class="tcol">部位及分配数量</div>
                  <div class="tcol">已完成数量</div>
                  <div class="tcol">已入库检验数量</div>
                </div>
              </div>
            </div>
          </div>
          <div class="tbody">
            <div class="trow">
              <div class="tcol">生产单号</div>
              <div class="tcol">生产单位</div>
              <div class="tcol">计划完成</div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol">产品信息</div>
                  <div class="tcol">尺码颜色</div>
                  <div class="tcol">部位及分配数量</div>
                  <div class="tcol">已完成数量</div>
                  <div class="tcol">已入库检验数量</div>
                </div>
                <div class="trow">
                  <div class="tcol">产品信息</div>
                  <div class="tcol">尺码颜色</div>
                  <div class="tcol">部位及分配数量</div>
                  <div class="tcol">已完成数量</div>
                  <div class="tcol">已入库检验数量</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="premark">
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
@import '~@/assets/css/printEasy.less';
</style>