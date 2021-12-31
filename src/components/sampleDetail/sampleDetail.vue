<template>
  <div class="sampleDetail popup"
    v-show="show">
    <div class="main">
      <div class="titleCtn">
        <span class="text">样品详情</span>
        <div class="closeCtn"
          @click="close">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="contentCtn"
        v-loading="!getDataFlag">
        <div class="tableCtn">
          <div class="tbody">
            <div class="trow">
              <div class="tcol">
                <div>
                  <el-image :src="sampleInfo.image_data.length>0?sampleInfo.image_data[0]:require('@/assets/image/common/noPic.png')"
                    :preview-src-list="sampleInfo.image_data">
                  </el-image>
                </div>
                <div style="text-align:center">{{sampleInfo.product_code}}</div>
              </div>
              <div class="tcol noPad"
                style="flex:5">
                <div class="trow">
                  <div class="tcol"
                    style="text-align:center">基本信息</div>
                  <div class="tcol"
                    style="flex:9">
                    <div class="detailCtn">
                      <div class="row">
                        <div class="col">
                          <div class="label">样品名称：</div>
                          <div class="text">{{sampleInfo.name}}</div>
                        </div>
                        <div class="col">
                          <div class="label">客户款号：</div>
                          <div class="text">{{sampleInfo.style_data.map((item)=>item.name).join(',')}}</div>
                        </div>
                        <div class="col">
                          <div class="label">样品款式：</div>
                          <div class="text">{{sampleInfo.style_data.map((item)=>item.name).join(',')}}</div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <div class="label">样品配色：</div>
                          <div class="text">
                            <span v-for="(item,index) in sampleInfo.color_data"
                              :key="item.id"
                              style="margin-right:12px">{{index+1}}.{{item.name}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <div class="label">样品描述：</div>
                          <div class="text">{{sampleInfo.desc}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"
                    style="text-align:center">大身信息</div>
                  <div class="tcol"
                    style="flex:9">
                    <div class="detailCtn">
                      <div class="row">
                        <div class="col">
                          <div class="label">大身成分：</div>
                          <div class="text">
                            <span style="margin-right:12px"
                              v-for="item in sampleInfo.component_data"
                              :key="item.id">{{item.name}}{{item.number}}%</span>
                          </div>
                        </div>
                      </div>
                      <div class="row"
                        v-for="(item,index) in sampleInfo.size_data"
                        :key="item.id">
                        <div class="col">
                          <div class="label">{{index===0?'大身尺码：':''}}</div>
                          <div class="text">{{index+1}}.&nbsp;{{item.name}}&nbsp;{{item.weight}}g&nbsp;{{item.size_info}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow"
                  v-for="(item) in sampleInfo.part_data"
                  :key="item.id">
                  <div class="tcol"
                    style="text-align:center">配件信息</div>
                  <div class="tcol"
                    style="flex:9">
                    <div class="detailCtn">
                      <div class="row">
                        <div class="col">
                          <div class="label">配件名称：</div>
                          <div class="text">{{item.name}}</div>
                        </div>
                        <div class="col">
                          <div class="label">配件单位：</div>
                          <div class="text">{{item.unit}}</div>
                        </div>
                        <div class="col"></div>
                      </div>
                      <div class="row">
                        <div class="col">
                          <div class="label">配件成分：</div>
                          <div class="text">
                            <span style="margin-right:12px"
                              v-for="itemChild in item.part_component_data"
                              :key="itemChild.id">{{itemChild.name}}{{itemChild.number}}%</span>
                          </div>
                        </div>
                      </div>
                      <div class="row"
                        v-for="(itemChild,indexChild) in item.part_size_data"
                        :key="itemChild.id">
                        <div class="col">
                          <div class="label">{{indexChild===0?'配件尺码：':''}}</div>
                          <div class="text">{{indexChild+1}}.&nbsp;{{itemChild.name}}&nbsp;{{itemChild.weight}}g&nbsp;{{itemChild.size_info}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol"
                    style="text-align:center">关联单据</div>
                  <div class="tcol"
                    style="flex:9">
                    <div class="rectCtn">
                      <div class="rect">
                        <div class="rectMain">
                          <div class="icon"
                            :class="sampleInfo.craft_list_id?'yellow':'gray'">
                            <img :src="require('@/assets/image/common/craft_icon.png')" />
                          </div>
                          <div class="rectContent">
                            <div class="text title">工艺单</div>
                            <!-- <div class="text">创建人没给</div>
                            <div class="text">创建时间没给</div> -->
                          </div>
                        </div>
                        <div class="menu">
                          <span class="opration">打印</span>
                          <span class="opration"
                            @click="sampleInfo.craft_list_id?$openUrl('/craft/detail?id='+sampleInfo.craft_list_id):$openUrl('/craft/create?id='+sampleInfo.id)">{{sampleInfo.craft_list_id?'详情':'添加'}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn"
          v-show="!noOpr">
          <span class="btn borderBtn"
            @click="close">取消</span>
          <span class="btn backHoverOrange" @click="proId=null;pid=null;pid_status=null;addProductFlag = true;">修改</span>
        </div>
      </div>
    </div>
    <sample-edit 
      :edit="true"
      :inDetail="true"
      :pid="null"
      :pid_status="null"
      :id="data.id"
      :data ="sampleInfo"
      :show="addProductFlag"
      @close="addProductFlag = false"
      @afterSave="getNewSample"
      :quote_rel_product_data="sampleInfo"></sample-edit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { sample } from '@/assets/js/api'
import { SampleInfo } from '@/types/sample'
export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    id: {
      type: [Number, String],
      required: false
    },
    data: {
      required: false
    },
    // 页面只看详情不需要操作
    noOpr: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data(): {
    sampleInfo: SampleInfo
    [propName: string]: any
  } {
    return {
      addProductFlag:false,
      sampleInfo: {
        product_type: 2,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category: '',
        secondary_category: '',
        image_data: [],
        desc: '',
        style_data: [], // 款式
        component_data: [
          {
            component_id: '',
            number: '' // 成分信息
          }
        ],
        size_data: [
          {
            size_id: '',
            size_info: '',
            weight: ''
          }
        ], // 尺码组
        color_data: [], // 配色组
        // 配件信息
        part_data: [
          {
            name: '',
            unit: '',
            part_size_data: [
              {
                size_id: '',
                size_info: '',
                weight: ''
              }
            ],
            part_component_data: [
              {
                component_id: '',
                number: '' // 成分信息
              }
            ]
          }
        ]
      },
      getDataFlag: false
    }
  },
  watch: {
    // 打开样品详情窗口之前需要获取样品详情
    show(val) {
      if (val) {
        this.$emit('beforeGet')
        if (this.data) {
          this.sampleInfo = this.data as SampleInfo
          this.getDataFlag = true
        } else {
          sample
            .detail({
              id: this.id
            })
            .then((res) => {
              if (res.data.status) {
                this.$emit('afterGet')
                this.sampleInfo = res.data.data
                this.getDataFlag = true
              }
            })
        }
      }
    }
  },
  methods: {
    close() {
      this.getDataFlag = false
      this.$emit('close')
    },
    getNewSample(val:any){
      console.log(val)
    }
  }
})
</script>

<style lang="less" scoped>
@import './sampleDetail.less';
</style>