<template>
  <div class="popup zhOrderCheck"
    v-show="show">
    <div class="main"
      style="width:1000px">
      <div class="titleCtn">
        <span class="text">产前确认</span>
        <div class="closeCtn"
          @click="$emit('close')">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn">
        <div class="stepCtn">
          <div class="step"
            :class="{'active':step===1}"
            @click="step=1">
            <div class="circle">
              <span class="white">1</span>
            </div>
            <div class="name">原料确认</div>
          </div>
          <div class="step"
            :class="{'active':step===2}"
            @click="step=2">
            <div class="circle">
              <span class="white">2</span>
            </div>
            <div class="name">半成品确认</div>
          </div>
          <div class="step"
            :class="{'active':step===3}"
            @click="step=3">
            <div class="circle">
              <span class="white">3</span>
            </div>
            <div class="name">成品确认</div>
          </div>
        </div>
        <template v-if="step===1">
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">原料类型</div>
                <div class="elCtn info">
                  <el-select placeholder="请选择原料类型">
                    <el-option label="纱线"
                      value="纱线"></el-option>
                    <el-option label="面料"
                      value="面料"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label">确认人</div>
                <div class="elCtn info">
                  <el-input placeholder="默认"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">确认时间</div>
                <div class="elCtn info">
                  <el-date-picker placeholder="请选择确认时间"
                    value-format="yyyy-MM-dd"></el-date-picker>
                </div>
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">确认类目</div>
                  <div class="tcol">是否确认</div>
                  <div class="tcol">不确认的物料(可多选)</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow">
                  <div class="tcol">纱线支数</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择物料"></el-select>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">纱线克重</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择物料"></el-select>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">纱线颜色</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择物料"></el-select>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">纱线质量</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择物料"></el-select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">其他说明</div>
                <div class="elCtn info">
                  <el-input placeholder="其他说明"></el-input>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="step===2">
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">确认人</div>
                <div class="elCtn info">
                  <el-input placeholder="默认"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">确认时间</div>
                <div class="elCtn info">
                  <el-date-picker placeholder="请选择确认时间"
                    value-format="yyyy-MM-dd"></el-date-picker>
                </div>
              </div>
              <div class="col"> </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">确认类目</div>
                  <div class="tcol">是否与确认样品一致</div>
                  <div class="tcol">不一致的产品(可多选)</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow">
                  <div class="tcol">半成品尺寸</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择产品"></el-select>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">半成品克重</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择产品"></el-select>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">半成品外观</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择产品"></el-select>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">半成品质量</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择产品"></el-select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">其他说明</div>
                <div class="elCtn info">
                  <el-input placeholder="其他说明"></el-input>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="step===3">
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">确认人</div>
                <div class="elCtn info">
                  <el-input placeholder="默认"></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">确认时间</div>
                <div class="elCtn info">
                  <el-date-picker placeholder="请选择确认时间"
                    value-format="yyyy-MM-dd"></el-date-picker>
                </div>
              </div>
              <div class="col">
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">确认类目</div>
                  <div class="tcol">是否与确认样品一致</div>
                  <div class="tcol">不一致的产品(可多选)</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow">
                  <div class="tcol">成品尺寸</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择产品"></el-select>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">成品克重</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择产品"></el-select>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">成品外观</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择产品"></el-select>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol">成品质量</div>
                  <div class="tcol flexRow">
                    <el-radio>是</el-radio>
                    <el-radio>否</el-radio>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="请选择产品"></el-select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">其他说明</div>
                <div class="elCtn info">
                  <el-input placeholder="其他说明"></el-input>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="oprCtn">
        <span class="btn borderBtn"
          @click="$emit('close')">取消</span>
        <span class="btn backHoverBlue">保存</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    show: {
      default: false
    }
  },
  data() {
    return {
      step: 2
    }
  }
})
</script>
<style lang="less" scoped>
@import './zhOrderCheck.less';
</style>