<template>
  <div id="craftCreate"
    class="bodyContainer">
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
            <img :src="null|checkFilter" />
          </el-tooltip>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">产品编号：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品名称：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品品类：</div>
            <div class="text blue"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">产品编号：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品名称：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品品类：</div>
            <div class="text blue"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">产品成分：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品配色：</div>
            <div class="text blue"></div>
          </div>
          <div class="col">
            <div class="label">产品规格：</div>
            <div class="text blue"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">备注信息：</div>
            <div class="text blue"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">原料经向</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">配色信息</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="elCtn colourCtn"
              v-for="(itemColour,indexColour) in craftInfo.warp_data.color_data"
              :key="indexColour">
              <el-select class="colour"
                placeholder="请选择产品配色组"
                v-model="itemColour.color_id">
                <el-option v-for="item in colourList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
              <el-input class="colour"
                style="margin-left: 12px;margin-bottom: 12px;"
                placeholder="计划织造数量"
                v-model="itemColour.weave_number">
                <template slot="append">条</template>
              </el-input>
              <span class="btn hoverBlue"
                @click="$addItem(craftInfo.warp_data.color_data,{
                  color_id: '',
                  weave_number: '',
                  color_scheme: [
                    {
                      color: '',
                      name: ''
                    }
                  ]})">添加色组</span>
              <span class="btn hoverRed"
                @click="craftInfo.warp_data.color_data.length>1?$deleteItem(craftInfo.warp_data.color_data,indexColour):$message.error('至少有一个配色组')">删除色组</span>
              <zh-color-picker v-for="(itemColor,indexColor) in itemColour.color_scheme"
                :key="indexColor"
                class="color"
                v-model="itemColour.color_scheme[indexColor]"
                :content="filterIndex(0)"
                :colorArr="yarnColorList"></zh-color-picker>
              <div class="borderBtn"
                @click="$addItem(itemColour.color_scheme,{
                  color: '',
                  name: ''
                })">
                <i class="el-icon-plus"></i>
              </div>
              <div class="borderBtn"
                @click="itemColour.color_scheme.length>1?$deleteItem(itemColour.color_scheme,itemColour.color_scheme.length-1):$message.error('至少有一种颜色')">
                <i class="el-icon-minus"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">主要原料</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="elCtn">
              <el-select placeholder="请选择主要原料"
                v-model="craftInfo.warp_data.material_data[0].material_id">
                <el-option v-for="item in materialList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">次要原料</span>
            </div>
            <div class="elCtn colourCtn"
              v-for="(itemMat,indexMat) in craftInfo.warp_data.material_data"
              :key="indexMat + 'ciyao'"
              v-show="indexMat>0">
              <el-select class="colour noBottom"
                placeholder="请选择次要原料"
                v-model="itemMat.material_id">
                <el-option v-for="item in materialList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
              <span class="btn hoverBlue"
                @click="$addItem(craftInfo.warp_data.material_data,{material_id: '',apply: [''],type_materail: 1})">添加原料</span>
              <span class="btn hoverRed"
                @click="craftInfo.warp_data.material_data.length>2?$deleteItem(craftInfo.warp_data.material_data,indexMat):$message.error('至少有一项，可以不选')">删除原料</span>
              <el-select v-for="(item,index) in itemMat.apply"
                :key="index"
                v-model="itemMat.apply[index]"
                placeholder="夹"
                class="jia">
                <el-option v-for="item in warpJiaList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <div class="borderBtn"
                @click="$addItem(itemMat.apply,'')">
                <i class="el-icon-plus"></i>
              </div>
              <div class="borderBtn"
                @click="itemMat.apply.length>1?$deleteItem(itemMat.apply,itemMat.apply.length-1):$message.error('至少有一项')">
                <i class="el-icon-minus"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="row"
          v-for="(itemMat,indexMat) in craftInfo.warp_data.assist_material"
          :key="indexMat + 'fuzhu'">
          <div class="col">
            <div class="label">
              <span class="text">辅助原料</span>
            </div>
            <div class="elCtn colourCtn">
              <el-select class="colour"
                placeholder="请选择辅助原料"
                v-model="itemMat.material_id"></el-select>
              <span class="btn hoverBlue"
                @click="$addItem(craftInfo.warp_data.assist_material,{material_id: '',apply: [],number: ''})">添加原料</span>
              <span class="btn hoverRed">删除原料</span>
              <el-select v-for="(item,index) in itemMat.apply"
                :key="index"
                v-model="itemMat.apply[index]"
                placeholder="夹"
                class="jia">
                <el-option v-for="item in warpJiaList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <div class="borderBtn"
                @click="$addItem(itemMat.apply,'')">
                <i class="el-icon-plus"></i>
              </div>
              <div class="borderBtn"
                @click="itemMat.apply.length>1?$deleteItem(itemMat.apply,itemMat.apply.length-1):$message.error('至少有一项')">
                <i class="el-icon-minus"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">经向排列</span>
              <i class="sliderCtn">
                <span class="text"
                  @click="ifDouble.warp=false"
                  :class="{'active':!ifDouble.warp}">单</span>
                <span class="text"
                  @click="ifDouble.warp=true"
                  :class="{'active':ifDouble.warp}">双</span>
              </i>
              <el-input v-model="insertNumber.warp"
                class="element"
                placeholder="请输入插入列数">
                <template slot="append">列</template>
              </el-input>
              <div class="btn backHoverBlue"
                @click="insertCol('warp')">插入</div>
              <el-input v-model="invertedOrder.warp[0]"
                class="element"
                placeholder="倒序从第几列开始">
                <template slot="append">列</template>
              </el-input>
              <span style="color:#E9E9E9;margin:0 0 0 12px">~</span>
              <el-input v-model="invertedOrder.warp[1]"
                class="element"
                placeholder="倒序到第几列结束">
                <template slot="append">列</template>
              </el-input>
              <div class="btn backHoverBlue"
                @click="invertedCol('warp')">倒序一遍</div>
              <div class="btn borderBtn"
                @click="resetTable('warp')">重置</div>
            </div>
            <div class="hotTable">
              <!-- <hot-table :settings="tableData.warp"></hot-table> -->
              <div ref="warp"></div>
            </div>
            <div style="color:rgba(0,0,0,0.45)">
              <br />
              提示1：可使用乘以[ ]遍，最后一遍去掉[ ]列到[ ]列。例如：乘以[4]遍，最后一遍去掉[17]列到[19]列；
              <br />
              提示2：可以在第二个合并项里使用"顺一遍倒一遍"功能，注意不要在第一个合并项里使用！不要修改"顺一遍倒一遍"文字信息
              <br />
              提示3：停撬功能可以点击纹版图序号单独标记
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">整经工艺</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">整经头纹</span>
              <span class="explanation">(根据经向排列自动计算)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="craftInfo.warp_data.weft"
                disabled
                placeholder="根据经向排列自动计算">
                <template slot="append">根</template>
              </el-input>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">
              <span class="text">边型</span>
            </div>
            <div class="info elCtn">
              <el-select v-model="craftInfo.warp_data.side_id"
                placeholder="请选择边型">
                <el-option v-for="item in sideList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">整经门幅</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="craftInfo.warp_data.width"
                placeholder="请输入整经门幅">
                <template slot="append">cm</template>
              </el-input>
            </div>
          </div>
          <div class="col flex3">
            <div class="label">
              <span class="text">机型</span>
            </div>
            <div class="info elCtn">
              <el-select v-model="craftInfo.warp_data.machine_id"
                placeholder="请选择机型">
                <el-option v-for="item in machineList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">穿综筘工艺</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">筘号</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入筘号">
                <template slot="append">筘</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">穿筘法</span>
              <span class="explanation">(不同原料穿筘法不同请在其他信息中补充)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入穿筘法">
                <template slot="append">根/筘</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">综页</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入综页">
                <template slot="append">页</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">筘幅</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入筘幅">
                <template slot="append">cm</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">筘幅说明</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn spaceBetween">
              <el-input style="width:200px"
                v-model="testValue"
                placeholder="请输入筘幅">
                <template slot="append">cm</template>
              </el-input>
              <el-input style="width:376px;margin:0 12px"
                v-model="testValue"
                placeholder="请输入筘幅">
                <template slot="append">cm</template>
              </el-input>
              <el-input style="width:200px"
                v-model="testValue"
                placeholder="请输入筘幅">
                <template slot="append">cm</template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">织造工艺</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">组织法</span>
            </div>
            <div class="info elCtn">
              <el-select v-model="testValue"
                placeholder="请选择组织法">
              </el-select>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">机上坯幅</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入机上坯幅">
                <template slot="append">cm</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">坯幅说明</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入坯幅说明">
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">上齿牙</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入上齿牙">
                <template slot="append">牙</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">下齿牙</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入下齿牙">
                <template slot="append">牙</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">纬密</span>
              <span class="explanation">(根据纬向排列自动计算)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="根据纬向排列自动计算">
                <template slot="append">梭/cm</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">让位说明</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入内长">
                <template slot="prepend">内长</template>
                <template slot="append">cm</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text"></span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入让位">
                <template slot="prepend">让位</template>
                <template slot="append">cm</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text"></span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入总计">
                <template slot="prepend">总计</template>
                <template slot="append">梭</template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">原料纬向</div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">其他信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">组织法</span>
            </div>
            <div class="info elCtn">
              <el-radio-group>
                <el-radio>根数*筘幅</el-radio>
                <el-radio>根数*机上坯幅</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">工艺单名称</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入工艺单名称"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">大身规格</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入大身规格">
                <template slot="append">cm</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">大身克重</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入大身克重">
                <template slot="append">g</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">后道工序</span>
            </div>
            <div class="info elCtn">
              <el-select v-model="testValue"
                placeholder="请选择后道工序"></el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">物料系数</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入物料系数">
                <template slot="prepend">未选择</template>
                <template slot="append">g/m</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">穿筘法</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入穿筘法，默认为经向穿筘法">
                <template slot="append">根/筘</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">下机时间</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="info elCtn">
              <el-date-picker style="width:100%"
                v-model="testValue"
                value-format="yyyy-MM-dd"
                placeholder="请选择下机时间"></el-date-picker>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">其他信息</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入其他信息">
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">备注信息</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="testValue"
                placeholder="请输入备注信息">
              </el-input>
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
          <div class="btn backHoverOrange"
            @click="saveCraft(true)">保存为草稿</div>
          <div class="btn backHoverBlue"
            @click="saveCraft(false)">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/handsontable@7.3.0/dist/handsontable.full.min.js"></script>
<script lang="ts">
import Vue from 'vue'
import { languages } from '@/assets/js/dictionary'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
Handsontable.languages.registerLanguageDictionary(languages as any) // 注册中文字典
import { CraftInfo } from '@/types/craft'
import { product, craftSetting } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    craftInfo: CraftInfo
    [propName: string]: any
  } {
    return {
      testValue: '',
      sideList: [],
      methodsList: [],
      machineList: [],
      testColor: {
        color: '',
        name: ''
      },
      // 是否为双面巾
      ifDouble: {
        warp: false,
        weft: false
      },
      // 插入列数
      insertNumber: {
        warp: '',
        weft: '',
        warpBack: '',
        weftBack: ''
      },
      // 倒序
      invertedOrder: {
        warp: ['', ''],
        weft: ['', ''],
        warpBack: ['', ''],
        weftBack: ['', '']
      },
      romanNum: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ'],
      alphabet: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ],
      markList: ['', '⚫', '⬛', '🔷'],
      colourList: [],
      // tableHot 初始化表格信息，解决插入行合并项不见的问题
      tableHot: {
        warp: '',
        warpBack: '',
        weft: '',
        weftBack: ''
      },
      tableData: { warp: {}, warpBack: {}, weft: {}, weftBack: {} },
      craftInfo: {
        id: '',
        product_id: '',
        title: '',
        size: '', // 大身规格
        weight: '', // 大身克重
        other_info: '',
        desc: '',
        is_draft: 1,
        yarn_coefficient: [
          {
            name: '',
            value: '',
            chuankou: ''
          }
        ],
        draft_method: {
          PM: [
            {
              value: '',
              repeat: '',
              children: [
                {
                  value: '',
                  repeat: ''
                }
              ]
            }
          ],
          PMFlag: false,
          GL: [
            [
              [
                {
                  value: '',
                  mark: ''
                }
              ]
            ]
          ],
          GLFlag: false,
          GLRepeat: [
            [
              {
                start: '',
                end: '',
                repeat: ''
              }
            ]
          ],
          PMDesc: '',
          GLDesc: ''
        },
        warp_data: {
          color_data: [
            {
              color_id: '',
              weave_number: '',
              color_scheme: [
                {
                  color: '',
                  name: ''
                }
              ]
            }
          ],
          material_data: [
            {
              material_id: '',
              apply: ['0'],
              type_materail: 0
            },
            {
              material_id: '',
              apply: [''],
              type_materail: 1
            }
          ],
          assist_material: [
            {
              material_id: '',
              apply: [''],
              number: ''
            }
          ],
          warp_rank: '',
          warp_rank_back: '',
          merge_data: '',
          merge_data_back: '',
          weft: '', // 总头纹
          width: '', // 整经门幅
          side_id: '', // 边型
          machine_id: '', // 机型
          reed: '', // 筘号
          reed_method: '', // 穿筘法
          reed_width: '', // 筘幅
          reed_width_explain: '', // 筘幅说明
          sum_up: '', // 综页
          back_status: 2 // 反面
        },
        weft_data: {
          color_data: [
            {
              color_id: '',
              weave_number: '',
              color_scheme: [
                {
                  color: '',
                  name: ''
                }
              ]
            }
          ],
          material_data: [
            {
              material_id: '',
              apply: [],
              type_materail: 0
            },
            {
              material_id: '',
              apply: [],
              type_materail: 1
            }
          ],
          assist_material: [
            {
              material_id: '',
              apply: [],
              number: ''
            }
          ],
          warp_rank: '',
          warp_rank_back: '',
          merge_data: '',
          merge_data_back: '',
          organization_id: '', // 组织法
          peifu: '', // 胚服
          weimi: '', // 纬密
          shangchiya: '', // 上齿牙
          xiachiya: '', // 下齿牙
          neichang: '', // 内长
          rangwei: '', // 让位
          total: '', // 总计
          back_status: 2, // 1：有，2：无
          peifu_explain: '' // 胚服说明
        }
      }
    }
  },
  computed: {
    materialList() {
      return this.$store.state.api.material.arr
    },
    yarnColorList() {
      return this.$store.state.api.yarnColor.arr
    },
    warpJiaList(): Array<{ label: string; value: number }> {
      return new Array(this.craftInfo.warp_data.color_data[0].color_scheme.length).fill('').map((item, index) => {
        return {
          value: index,
          label: this.filterIndex(index)
        }
      })
    },
    PMList(): string[] {
      return new Array(this.craftInfo.draft_method.PM.length).fill('').map((item, index) => this.romanNum[index])
    }
  },
  methods: {
    // 匹配主/夹名称
    filterIndex(index: number): string {
      if (index === 0) {
        return '主'
      } else {
        return '夹' + index
      }
    },
    // 插入列
    insertCol(type: 'warp' | 'weft' | 'warpBack' | 'weftBack') {
      if (Number(this.insertNumber[type]) && Number(this.insertNumber[type]) > 0) {
        for (let i = 0; i < Number(this.insertNumber[type]); i++) {
          this.tableData[type].data.forEach((item: any, index: number) => {
            if (index === 0) {
              item.push(item.length + 1)
            } else {
              item.push('')
            }
          })
          this.tableData[type].number++
        }

        this.tableHot[type].loadData(this.tableData[type].data)
      } else {
        this.$message.error({
          message: '请输入正确的正整数'
        })
      }
    },
    invertedCol(type: 'warp' | 'weft' | 'warpBack' | 'weftBack') {
      if (
        Number(this.invertedOrder[type][0]) &&
        Number(this.invertedOrder[type][1]) &&
        Number(this.invertedOrder[type][0]) > 0 &&
        Number(this.invertedOrder[type][1]) > 0
      ) {
        let reverseArr = this.tableData[type].data.map((item: any) => {
          let copy = JSON.parse(JSON.stringify(item))
          return copy.slice(Number(this.invertedOrder[type][0] - 1), Number(this.invertedOrder[type][1])).reverse()
        })
        reverseArr.forEach((item: any, index: number) => {
          if (index === 0) {
            for (let i = 0; i < item.length; i++) {
              this.tableData[type].number++
              this.tableData[type].data[index].push(this.tableData[type].number)
            }
          } else {
            this.tableData[type].data[index] = this.tableData[type].data[index].concat(item)
          }
        })
        // 触发一下表格更新，重新获取数据
        this.tableHot[type].loadData(this.tableData[type].data)
      } else {
        this.$message.error({
          message: '请输入正确的正整数'
        })
      }
    },
    // 重置操作
    resetTable(type: 'warp' | 'weft' | 'warpBack' | 'weftBack') {
      this.$confirm('此操作将清空表格数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.tableData[type].number = 1
          this.tableData[type].data = [[1], [null], [null], [null], [null], [null], [null]]
          this.tableHot[type].loadData(this.tableData[type].data)
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 展开工艺单
    getFlatTable(table: Array<Array<any>>, type: 'warp' | 'weft' | 'warpBack' | 'weftBack'): any[] {
      if (!this.tableHot[type]) {
        return []
      }
      const mergeTable = this.tableHot[type].getPlugin('MergeCells').mergedCellsCollection.mergedCells // 合并项
      // 获取完整的合并项信息
      const firstMerge = this.getMergeInfo(mergeTable, 3, table[0].length)
      const secondMerge = this.getMergeInfo(mergeTable, 4, table[0].length)
      const thirdMerge = this.getMergeInfo(mergeTable, 5, table[0].length)
      let firstArr: { order: number; number: any }[][] = []
      firstMerge.forEach((item) => {
        let temporaryStorage = [] // 临时存储合并项
        for (let i = item.col; i < item.col + item.colspan; i++) {
          temporaryStorage.push({
            order: parseInt(table[0][i]),
            number: table[2][i]
          })
        }
        let forNum = this.getSpecial(table[item.row][item.col] || 1)
        for (let i = 0; i < forNum.number; i++) {
          let realStorage = temporaryStorage
          if (forNum.start && i === forNum.number - 1) {
            realStorage = temporaryStorage.filter((item) => {
              // @ts-ignore 最后一遍去掉start~end
              return item.order < forNum.start || item.order > forNum.end
            })
          }
          firstArr.push(realStorage)
        }
      })
      let secondArr: { order: number; number: any }[][][] = []
      secondMerge.forEach((item) => {
        let temporaryStorage = firstArr.filter((itemFilter) => {
          return itemFilter[0].order > item.col && itemFilter[0].order <= item.col + item.colspan
        })
        let forNum = this.getSpecial(table[item.row][item.col] || 1)
        for (let i = 0; i < forNum.number; i++) {
          let realStorage = temporaryStorage
          if (forNum.start && i === forNum.number - 1) {
            realStorage = temporaryStorage.filter((item) => {
              let flag = true
              item.forEach((itemChild) => {
                // @ts-ignore
                if (itemChild.order >= forNum.start && itemChild.order <= forNum.end) {
                  flag = false
                }
              })
              return flag
            })
          }
          secondArr.push(realStorage)
        }
      })
      let thirdArr: { order: number; number: any }[][][][] = []
      thirdMerge.forEach((item) => {
        let temporaryStorage = secondArr.filter((itemFilter) => {
          return itemFilter[0] && itemFilter[0][0].order > item.col && itemFilter[0][0].order <= item.col + item.colspan
        })
        let forNum = this.getSpecial(table[item.row][item.col] || 1)
        for (let i = 0; i < forNum.number; i++) {
          let realStorage = temporaryStorage
          thirdArr.push(realStorage)
        }
      })
      let flattenArr = this.mergeArray(thirdArr)
      return flattenArr
    },
    // 合并项信息处理
    getMergeInfo(mergeTable: any[], row: number, length: number) {
      const mergeArr = mergeTable
        .filter((item) => item.row === row)
        .sort((a, b) => {
          return a.col - b.col
        })
      let saveMerge = []
      let col = 0
      let mergeIndex = 0
      while (col < length) {
        if (mergeArr[mergeIndex]) {
          if (col < mergeArr[mergeIndex].col) {
            for (let i = 0; i < mergeArr[mergeIndex].col - col; i++) {
              saveMerge.push({
                col: i + col,
                colspan: 1,
                row: row
              })
            }
            col = mergeArr[mergeIndex].col
          } else {
            saveMerge.push({
              col: mergeArr[mergeIndex].col,
              colspan: mergeArr[mergeIndex].colspan,
              row: row
            })
            col = mergeArr[mergeIndex].col + mergeArr[mergeIndex].colspan
            mergeIndex++
          }
        } else {
          for (let i = col; i < length; i++) {
            saveMerge.push({
              col: i,
              colspan: 1,
              row: row
            })
          }
          col = length
        }
      }
      return saveMerge
    },
    // 合并数组
    mergeArray(arr: any[], saveArr?: any[]): any[] {
      let array = saveArr || []
      arr.forEach((item) => {
        if (Array.isArray(item)) {
          this.mergeArray(item, array)
        } else {
          array.push(item)
        }
      })
      return array
    },
    // 获取特殊数据,用于处理 乘以[n]遍，最后一遍去掉[x]列到[y]列
    getSpecial(info: string): {
      number: number
      start?: number
      end?: number
    } {
      if (Number(info)) {
        return {
          number: Number(info)
        }
      }
      // 要么就是"倒一遍"，要么就是特殊情况
      // 倒一遍数量直接翻倍就行，这里单纯算个根数直接循环2遍就行，画图的时候复杂一点
      if (info === '顺一遍倒一遍') {
        return {
          number: 2
        }
      }
      let arr = info.split(']')
      return {
        number: arr[0].split('[')[1] as unknown as number,
        start: arr[1].split('[')[1] as unknown as number | undefined,
        end: arr[2].split('[')[1] as unknown as number | undefined
      }
    },
    // 添加色组——需要考虑所有色组的颜色个数相同
    addColour() {},
    // 添加颜色——需要考虑所有色组的颜色个数相同
    addColor() {},
    // 删除颜色——需要考虑所有色组的颜色个数相同
    deleteColour() {},
    saveCraft(ifCaogao: boolean) {}
  },
  created() {
    // handsometable设置项
    this.tableData.warp = {
      data: [[1], [null], [null], [null], [null], [null], [null]],
      rowHeaders: (index: any) => {
        let headerArr = ['序号', '主/夹', '根数', '合并项', '合并项', '合并项', '穿综法']
        return `<div style="height:38px;line-height:38px;color:rgba(0,0,0,0.65);display:table-row">${headerArr[index]}</div>`
      },
      rowHeaderWidth: 80,
      minCols: 1,
      autoColumnSize: true, // 自适应宽度
      cells: (row: any, col: any, prop: any) => {
        let cellProperties: any = {}
        if (row === 0) {
          cellProperties.type = 'dropdown'
          // @ts-ignore
          cellProperties.source = this.markList.map((item: string) => col + 1 + ' ' + item)
        }
        if (row === 1) {
          cellProperties.type = 'dropdown'
          // @ts-ignore
          cellProperties.source = this.warpJiaList.map((item: { label: any }) => item.label)
        }
        if (row === 6) {
          cellProperties.type = 'dropdown'
          // @ts-ignore
          cellProperties.source = this.PMList
        }
        cellProperties.renderer = function (
          instance: any,
          td: any,
          row: any,
          col: any,
          prop: any,
          value: any,
          cellProperties: any
        ) {
          // 清空节点并重新渲染
          Handsontable.dom.empty(td)
          let node = document.createElement('DIV')
          let CSS = td.style
          node.innerText = value
          td.appendChild(node)
          // 设置样式
          CSS.color = 'rgba(0,0,0,0.65)'
          CSS.width = '38px'
          CSS.height = '38px'
          CSS.lineHeight = '38px'
          CSS.textAlign = 'center'
          if (row === 0) {
            CSS.background = '#E9E9E9'
          }
          return td
        }
        return cellProperties
      },
      contextMenu: [
        'mergeCells', // 合并单元格菜单
        'col_right',
        'col_left',
        'copy',
        '粘贴(Ctrl + V)',
        'undo',
        'redo',
        'remove_col'
      ],
      className: 'handsontable',
      number: 1,
      afterCreateCol: (index: any, amount: any) => {
        this.tableData.warp.number++
        for (let i = 0; i < this.tableData.warp.number; i++) {
          this.tableData.warp.data[0][i] = i + 1
        }
      },
      afterRemoveCol: (index: any, amount: any) => {
        this.tableData.warp.number--
        for (let i = 0; i < this.tableData.warp.number; i++) {
          this.tableData.warp.data[0][i] = i + 1
        }
      },
      afterChange: (changes: any, opt: any) => {
        // 计算整经头文
        const warpTable = this.getFlatTable(
          this.tableData.warp.data.map((item: any, index: number) => {
            if (index === 1) {
              return item.map((itemJia: any) => {
                return this.warpJiaList.find((itemFind: any) => itemFind.label === itemJia)
                  ? (this.warpJiaList.find((itemFind: any) => itemFind.label === itemJia) as any).value
                  : ''
              })
            } else {
              if (item.length === this.tableData.warp.number) {
                return item
              } else {
                for (let i = 0; i < this.tableData.warp.number; i++) {
                  item[i] = item[i] || null
                }
                return item
              }
            }
          }),
          'warp'
        )
        // let warpTableBack = this.getFlatTable(
        //   this.tableData.warpBack.data.map((item, index) => {
        //     if (index === 1) {
        //       return item.map((itemJia) => {
        //         return this.warpJiaList.find((itemFind) => itemFind.label === itemJia)
        //           ? this.warpJiaList.find((itemFind) => itemFind.label === itemJia).value
        //           : ''
        //       })
        //     } else {
        //       if (item.length === this.tableData.warpBack.number) {
        //         return item
        //       } else {
        //         for (let i = 0; i < this.tableData.warpBack.number; i++) {
        //           item[i] = item[i] || null
        //         }
        //         return item
        //       }
        //     }
        //   }),
        //   'warpBack'
        // )
        let sum = 0
        warpTable.forEach((item: any, index: number) => {
          sum += Number(item.number)
        })
        // warpTableBack.forEach((item:any, index:number) => {
        //   sum += Number(item.number)
        // })
        this.craftInfo.warp_data.weft = sum
      },
      licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
      mergeCells: true,
      width: '100%',
      height: 280
    }
  },
  mounted() {
    this.tableHot.warp = new Handsontable((this.$refs as any).warp, this.tableData.warp)
    this.$checkCommonInfo([
      {
        checkWhich: 'api/material',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getMaterialAsync'
      },
      {
        checkWhich: 'api/yarnColor',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnColorAsync'
      }
    ])
    Promise.all([craftSetting.listSide(), craftSetting.listMachine(), craftSetting.listMethods()]).then((res) => {
      this.sideList = res[0].data.data
      this.machineList = res[1].data.data
      this.methodsList = res[2].data.data
    })
    product
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        this.colourList = res.data.data.color_data
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/craft/create.less';
</style>