<template>
  <div id="sampleCreate"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">样单号</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入样单号"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">样单类型</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择样单类型"></el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">下单日期</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-date-picker placeholder="请选择下单日期"></el-date-picker>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">打样公司</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择打样公司"></el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">公司联系人</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择公司联系人"></el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">负责小组/人</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请选择负责小组/人"></el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn flexBetween">
        <div class="title">添加样品</div>
        <div class="btn backHoverBlue"
          @click="addSampleFlag = true">添加新样品</div>
      </div>
      <div class="listCtn"></div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">打样数量及交期</div>
      </div>
      <div class="editCtn">
        <div class="tableCtn"></div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">计划完成时间</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-date-picker placeholder="请选择计划完成时间"></el-date-picker>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">
              <span class="text">是否加急打样</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-radio-group>
                <el-radio>是</el-radio>
                <el-radio>否</el-radio>
              </el-radio-group>
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
              <el-select placeholder="请输入打样款数"></el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">打样总数</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请输入打样总数"></el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">打样总费用</span>
              <span class="explanation">(自动计算)</span>
            </div>
            <div class="info elCtn">
              <el-select placeholder="请输入打样总费用"></el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">文件信息</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">备注信息</span>
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
          <div class="btn backHoverOrange">保存为草稿</div>
          <div class="btn backHoverBlue">提交</div>
        </div>
      </div>
    </div>
    <div class="sidePopup"
      v-show="addSampleFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">添加新样品</span>
          <div class="closeCtn"
            @click="addSampleFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="module">
            <div class="titleCtn">
              <div class="title">基本信息</div>
            </div>
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">样品编号</span>
                    <span class="explanation">(不填由系统生成)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入样品编号"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">客户款号</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入客户款号"></el-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">样品名称</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入样品名称"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">默认单位</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择默认单位"></el-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">样品品类</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请选择样品品类"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">样品款式</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择样品款式"></el-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">样品配色组</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请选择样品配色组"></el-input>
                  </div>
                </div>
                <div class="opr hoverBlue">添加</div>
                <div class="col">
                  <!-- 占位 -->
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">样品图片</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请选择样品配色组"></el-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">样品其它描述或备注</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请选择样品配色组"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="module">
            <div class="titleCtn">
              <div class="title">大身信息</div>
            </div>
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">大身成分</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请输入样品编号"></el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">成分比例</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入成分比例">
                      <template slot="append">%</template>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">大身尺码</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择大身尺码"></el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label">
                        <span class="text">大身克重</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="大身克重">
                        </el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label">
                        <span class="text">大身尺寸</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="大身尺寸">
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="opr hoverBlue">添加</div>
              </div>
            </div>
          </div>
          <div class="module">
            <div class="titleCtn">
              <div class="title">配件信息</div>
            </div>
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">配件名称</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入配件名称"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">配件单位</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入配件单位"></el-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">配件成分</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请输入样品编号"></el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label">
                    <span class="text">成分比例</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入成分比例">
                      <template slot="append">%</template>
                    </el-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">配件尺码</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择配件尺码"></el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label">
                        <span class="text">配件克重</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="配件克重">
                        </el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label">
                        <span class="text">配件尺寸</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="配件尺寸">
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn">取消</span>
          <span class="btn backHoverBlue">确认添加</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      addSampleFlag: true
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/sample/create.less';
</style>
<style lang="less">
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>