<template>
  <div id="materialPlanCreate"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"
      :sampleOrderIndex="orderIndex"></order-detail>
    <div class="module">
      <div class="titleCtn flexBetween">
        <div class="title">生产计划单</div>
        <div class="btn"
          :class="{'backHoverBlue':confirmFlag===1,'backHoverOrange':confirmFlag===2}"
          @click="confirmPlanNum">{{confirmFlag===1?'确认生产数量':'重置生产数量'}}</div>
      </div>
      <div class="tableCtn">
        <div class="description">
          <span>请输入产品各部位需要原料生产的数量，填写完成后点击
            <span class="blue">确认生产数量</span>
            按钮开始填写产品物料信息。
            <span class="red">注意：</span>
            未填写计划生产数量的部位，或者填写值为0的产品部位将不计入物料填写。
          </span>
        </div>
        <div class="thead">
          <div class="trow">
            <div class="tcol">产品品类</div>
            <div class="tcol noPad"
              style="flex:7">
              <div class="trow">
                <div class="tcol">尺码颜色</div>
                <div class="tcol">下单数量</div>
                <div class="tcol">已计划数量</div>
                <div class="tcol">总数量百分比</div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow">
                    <div class="tcol">产品部位</div>
                    <div class="tcol">计划生产数量</div>
                    <div class="tcol">操作</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="item in materialPlanInfo.production_plan_data"
            :key="item.product_id">
            <div class="tcol">
              <span>{{item.product_code || item.system_code}}</span>
              <span>{{item.category}}/{{item.secondary_category}}</span>
            </div>
            <div class="tcol noPad"
              style="flex:7">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.product_data"
                :key="indexChild">
                <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                <div class="tcol">{{itemChild.order_number}}</div>
                <div class="tcol">{{getHasPlanNumber(item.product_id,itemChild.color_name,itemChild.size_name)}}</div>
                <div class="tcol">
                  <div class="elCtn">
                    <el-input placeholder="百分比"
                      v-model="itemChild.add_percent"
                      @input="getPlanNum($event,itemChild)">
                      <template slot="append">%</template>
                    </el-input>
                  </div>
                </div>
                <div class="tcol noPad"
                  style="flex:3">
                  <div class="trow"
                    v-for="(itemPart,indexPart) in itemChild.info_data"
                    :key="indexPart">
                    <div class="tcol">
                      <div class="elCtn">
                        <el-select v-model="itemPart.part_id">
                          <el-option v-for="item in item.part_data"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="tcol">
                      <div class="elCtn UnitCtn">
                        <el-input v-model="itemPart.number"
                          placeholder="数量"
                          @change="getMaterialPlanDetail(itemPart.part_id,itemPart.number,itemChild)">
                          <template slot="append">
                            <el-input v-model="itemPart.unit"
                              placeholder="单位"
                              disabled></el-input>
                          </template>
                        </el-input>
                      </div>
                    </div>
                    <div class="tcol oprCtn">
                      <div class="gray"
                        v-if="item.part_data.length===1">无配件信息</div>
                      <div class="opr hoverBlue"
                        v-if="itemChild.info_data.length<item.part_data.length"
                        @click="$addItem(itemChild.info_data,{
                          unit: '',
                          name: '',
                          part_id: '', // 下拉框选id用
                          number: ''
                        })">添加</div>
                      <div class="opr hoverRed"
                        v-if="itemChild.info_data.length>1"
                        @click="$deleteItem(itemChild.info_data,indexPart)">删除</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-show="confirmFlag===2">
      <el-tabs type="border-card"
        v-model="materialPlanInfo.type"
        @tab-click="changeMaterialPlanType">
        <el-tab-pane label="按尺码配色"
          name="1">
          <div class="description">
            <span>如果您的产品不同尺码、色组将<span class="green">由多个单位生产</span>，我们建议您按<span class="green">尺码颜色</span>进行填写。</span>
          </div>
          <div class="flattenTableCtn noPad">
            <div class="thead">
              <div class="trow">
                <div class="tcol">产品品类</div>
                <div class="tcol">尺码颜色</div>
                <div class="tcol">产品部位</div>
                <div class="tcol">下单数量</div>
                <div class="tcol">计划生产数量</div>
                <div class="tcol">操作</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trowCtn"
                v-for="(item,index) in materialPlanInfo.material_plan_data"
                :key="index">
                <div class="trow">
                  <div class="tcol">
                    <span>{{item.product_code}}</span>
                    <span>{{item.category}}/{{item.secondary_category}}</span>
                  </div>
                  <div class="tcol">{{item.size_name}}/{{item.color_name}}</div>
                  <div class="tcol">{{item.part_name}}</div>
                  <div class="tcol">{{item.order_number}}</div>
                  <div class="tcol">{{item.number}}</div>
                  <div class="tcol oprCtn">
                    <span class="opr blue"
                      @click="$addItem(item.info_data,{
                        process_name_arr:[],
                        process_name: '',
                        tree_data: [],
                        material_id: '',
                        material_type: '',
                        material_color: '',
                        assist_material_number: '',
                        need_number: '',
                        production_number: '',
                        loss: '',
                        final_number: '',
                        unit: 'kg'
                    })">新增物料</span>
                    <div class="opr hoverRed"
                      @click="item.info_data=[]">不需要物料</div>
                  </div>
                </div>
                <div class="childrenCtn"
                  v-if="item.info_data.length>0">
                  <div class="trow">
                    <div class="tcol">计划工序
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一工序"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="copyInfo(item.info_data,['process_name_arr','process_name','process_type'])">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcol">原料名称
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一原料"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="copyInfo(item.info_data,['tree_data','material_name','material_id'])">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcol">原料颜色
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一颜色"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="copyInfo(item.info_data,['material_color'])">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcol">单个数量</div>
                    <div class="tcol">所需数量</div>
                    <div class="tcol">原料损耗
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一损耗"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="copyInfo(item.info_data,['loss']);changeAllLoss(item.info_data)">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcol">最终数量
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一数量"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="copyInfo(item.info_data,['final_number','unit'])">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcol">操作</div>
                  </div>
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.info_data"
                    :key="indexChild">
                    <div class="tcol">
                      <div class="elCtn">
                        <el-cascader placeholder="选择工序"
                          :show-all-levels="false"
                          v-model="itemChild.process_name_arr"
                          :options="item.processList&&item.processList.length>0?item.processList:processList"
                          @change="(ev)=>{itemChild.process_type=ev[0];itemChild.process_name=ev[1]}"
                          filterable
                          clearable>
                        </el-cascader>
                      </div>
                    </div>
                    <div class="tcol">
                      <div class="elCtn"
                        v-if="!itemChild.has_plan">
                        <el-cascader placeholder="物料名称"
                          :show-all-levels="false"
                          v-model="itemChild.tree_data"
                          :options="yarnTypeList"
                          @change="getMatId($event,itemChild)"
                          filterable
                          clearable>
                        </el-cascader>
                      </div>
                      <span class="text"
                        v-else>{{itemChild.material_name||(item.material_id===-1?'金丝':'银丝')}}</span>
                    </div>
                    <div class="tcol">
                      <div class="elCtn">
                        <el-autocomplete class="inline-input"
                          v-model="itemChild.material_color"
                          :fetch-suggestions="searchColor"
                          placeholder="物料颜色"></el-autocomplete>
                      </div>
                    </div>
                    <div class="tcol">
                      <span class="blue"
                        v-if="itemChild.has_plan">{{itemChild.production_number}}g</span>
                      <div class="elCtn"
                        v-else>
                        <el-input class="UnitCtn"
                          v-model="itemChild.production_number"
                          placeholder="无计划值"
                          @input="(ev)=>{
                            itemChild.need_number=numberAutoMethod(Number(ev)*item.number/(itemChild.unit==='g'?1000:1));
                            itemChild.final_number=numberAutoMethod((Number(itemChild.loss)/100+1)*itemChild.need_number)
                          }">
                          <template slot="append">
                            <el-input v-model="itemChild.unit"
                              placeholder="单位"></el-input>
                          </template>
                        </el-input>
                      </div>
                    </div>
                    <div class="tcol">
                      <span class="blue"
                        v-if="itemChild.need_number">{{itemChild.need_number}}{{itemChild.unit==='g'?'kg':itemChild.unit}}</span>
                      <span v-else
                        class="gray">0{{itemChild.unit==='g'?'kg':itemChild.unit}}</span>
                    </div>
                    <div class="tcol">
                      <div class="elCtn">
                        <el-input v-model="itemChild.loss"
                          placeholder="损耗"
                          @input="(ev)=>itemChild.final_number=numberAutoMethod((Number(ev)/100+1)*itemChild.need_number)">
                          <template slot="append">%</template>
                        </el-input>
                      </div>
                    </div>
                    <div class="tcol">
                      <div class="elCtn">
                        <el-input v-model="itemChild.final_number"
                          placeholder="数量"
                          @input="(ev)=>itemChild.loss = $toFixed((itemChild.final_number<=itemChild.need_number || !itemChild.need_number)?0:(itemChild.final_number-itemChild.need_number)/itemChild.need_number*100)">
                          <template slot="append">
                            {{itemChild.unit==='g'?'kg':itemChild.unit}}
                          </template>
                        </el-input>
                      </div>
                    </div>
                    <div class="tcol">
                      <div class="oprCtn">
                        <span class="opr blue"
                          @click="$addItem(item.info_data,{
                            process_name_arr:[],
                            process_name: '',
                            tree_data: [],
                            material_id: '',
                            material_type: '',
                            material_color: '',
                            assist_material_number: '',
                            need_number: '',
                            production_number: '',
                            loss: '',
                            final_number: '',
                            unit: 'g'
                        })">添加</span>
                        <span class="opr orange"
                          @click="$addItem(item.info_data,$clone(itemChild))">复制</span>
                        <span class="opr red"
                          @click="item.info_data.length>1?$deleteItem(item.info_data,indexChild):$message.error('至少有一项，可以不填')">删除</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="childrenCtn"
                  v-else>
                  <div class="trow">
                    <div class="tcol gray"
                      style="text-align: center;">确认不需要物料</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按产品款式"
          name="2">
          <div class="description">
            <span>如果您的产品不同尺码、色组将<span class="green">由一个单位生产</span>，我们建议您按<span class="green">相同产品</span>进行填写。</span>
          </div>
          <div class="flattenTableCtn noPad">
            <div class="thead">
              <div class="trow">
                <div class="tcol">产品品类</div>
                <div class="tcol">产品部位</div>
                <div class="tcol">下单数量</div>
                <div class="tcol">计划生产数量</div>
                <div class="tcol">操作</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trowCtn"
                v-for="(item,index) in materialPlanInfo.material_plan_data"
                :key="index">
                <div class="trow">
                  <div class="tcol">
                    <span>{{item.product_code}}</span>
                    <span>{{item.category}}/{{item.secondary_category}}</span>
                  </div>
                  <div class="tcol">{{item.part_name}}</div>
                  <div class="tcol">{{item.order_number}}</div>
                  <div class="tcol">{{item.number}}</div>
                  <div class="tcol oprCtn">
                    <span class="opr blue"
                      @click="$addItem(item.info_data,{
                        process_name_arr:[],
                        process_name: '',
                        tree_data: [],
                        material_id: '',
                        material_type: '',
                        material_color: '',
                        assist_material_number: '',
                        need_number: '',
                        production_number: '',
                        loss: '',
                        final_number: '',
                        unit: 'g'
                    })">新增物料</span>
                    <div class="opr hoverRed"
                      @click="item.info_data=[]">不需要物料</div>
                  </div>
                </div>
                <div class="childrenCtn"
                  v-if="item.info_data.length>0">
                  <div class="trow">
                    <div class="tcol">计划工序
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一工序"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="copyInfo(item.info_data,['process_name_arr','process_name','process_type'])">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcol">原料名称
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一原料"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="copyInfo(item.info_data,['tree_data','material_name','material_id'])">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcol">原料颜色
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一颜色"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="copyInfo(item.info_data,['material_color'])">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcol">单个数量</div>
                    <div class="tcol">所需数量</div>
                    <div class="tcol">原料损耗
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一损耗"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="copyInfo(item.info_data,['loss']);changeAllLoss(item.info_data)">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcol">最终数量
                      <el-tooltip class="item"
                        effect="dark"
                        content="统一数量"
                        placement="top">
                        <svg class="iconFont copyIcon hoverBlue"
                          aria-hidden="true"
                          @click="copyInfo(item.info_data,['final_number','unit'])">
                          <use xlink:href='#icon-tongbushuju1'></use>
                        </svg>
                      </el-tooltip>
                    </div>
                    <div class="tcol">操作</div>
                  </div>
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.info_data"
                    :key="indexChild">
                    <div class="tcol">
                      <div class="elCtn">
                        <el-cascader placeholder="选择工序"
                          :show-all-levels="false"
                          v-model="itemChild.process_name_arr"
                          :options="item.processList&&item.processList.length>0?item.processList:processList"
                          @change="(ev)=>{itemChild.process_type=ev[0];itemChild.process_name=ev[1]}"
                          filterable
                          clearable>
                        </el-cascader>
                      </div>
                    </div>
                    <div class="tcol">
                      <div class="elCtn"
                        v-if="!itemChild.has_plan">
                        <el-cascader placeholder="物料名称"
                          :show-all-levels="false"
                          v-model="itemChild.tree_data"
                          :options="yarnTypeList"
                          filterable
                          @change="getMatId($event,itemChild)"
                          clearable>
                        </el-cascader>
                      </div>
                      <span class="text"
                        v-else>{{itemChild.material_name||(item.material_id===-1?'金丝':'银丝')}}</span>
                    </div>
                    <div class="tcol">
                      <div class="elCtn">
                        <el-autocomplete class="inline-input"
                          v-model="itemChild.material_color"
                          :fetch-suggestions="searchColor"
                          placeholder="物料颜色"></el-autocomplete>
                      </div>
                    </div>
                    <div class="tcol">
                      <span class="blue"
                        v-if="itemChild.has_plan">{{itemChild.production_number}}g</span>
                      <div class="elCtn"
                        v-else>
                        <el-input class="UnitCtn"
                          v-model="itemChild.production_number"
                          placeholder="无计划值"
                          @input="(ev)=>{
                            itemChild.need_number=numberAutoMethod(Number(ev)*item.number/(itemChild.unit==='g'?1000:1));
                            itemChild.final_number=numberAutoMethod((Number(itemChild.loss)/100+1)*itemChild.need_number)
                          }">
                          <template slot="append">
                            <el-input v-model="itemChild.unit"
                              placeholder="单位"></el-input>
                          </template>
                        </el-input>
                      </div>
                    </div>
                    <div class="tcol">
                      <span class="blue"
                        v-if="itemChild.need_number">{{itemChild.need_number}}{{itemChild.unit==='g'?'kg':itemChild.unit}}</span>
                      <span v-else
                        class="gray">0{{itemChild.unit==='g'?'kg':itemChild.unit}}</span>
                    </div>
                    <div class="tcol">
                      <div class="elCtn">
                        <el-input v-model="itemChild.loss"
                          placeholder="损耗"
                          @input="(ev)=>itemChild.final_number=numberAutoMethod((Number(ev)/100+1)*itemChild.need_number)">
                          <template slot="append">%</template>
                        </el-input>
                      </div>
                    </div>
                    <div class="tcol">
                      <div class="elCtn">
                        <el-input v-model="itemChild.final_number"
                          placeholder="数量"
                          @input="(ev)=>itemChild.loss = $toFixed((itemChild.final_number<=itemChild.need_number || !itemChild.need_number)?0:(itemChild.final_number-itemChild.need_number)/itemChild.need_number*100)">
                          <template slot="append">
                            {{itemChild.unit==='g'?'kg':itemChild.unit}}
                          </template>
                        </el-input>
                      </div>
                    </div>
                    <div class="tcol">
                      <div class="oprCtn">
                        <span class="opr blue"
                          @click="$addItem(item.info_data,{
                          process_name_arr:[],
                          process_name: '',
                          tree_data: [],
                          material_id: '',
                          material_type: '',
                          material_color: '',
                          assist_material_number: '',
                          need_number: '',
                          production_number: '',
                          loss: '',
                          final_number: '',
                          unit: 'g'
                        })">添加</span>
                        <span class="opr orange"
                          @click="$addItem(item.info_data,$clone(itemChild))">复制</span>
                        <span class="opr red"
                          @click="item.info_data.length>1?$deleteItem(item.info_data,indexChild):$message.error('至少有一项，可以不填')">删除</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="childrenCtn"
                  v-else>
                  <div class="trow">
                    <div class="tcol gray"
                      style="text-align: center;">确认不需要物料</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="module"
      v-show="confirmFlag===2">
      <div class="titleCtn">
        <div class="title">所需原料预览</div>
      </div>
      <div class="tableCtn">
        <div class="description">
          <span>表格信息由物料计划自动生成，请填写物料计划。</span>
        </div>
        <div class="thead"
          v-if="materialPlanInfo.material_plan_gather_data.length>0">
          <div class="trow">
            <div class="tcol">序号</div>
            <div class="tcol">原料名称</div>
            <div class="tcol">原料颜色</div>
            <div class="tcol">所需数量</div>
            <div class="tcol">原料损耗</div>
            <div class="tcol">最终数量</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in materialPlanInfo.material_plan_gather_data"
            :key="index">
            <div class="tcol">{{index+1}}</div>
            <div class="tcol">{{item.material_name}}</div>
            <div class="tcol">{{item.material_color}}</div>
            <div class="tcol">{{item.need_number}}{{item.unit==='g'?'kg':item.unit}}</div>
            <div class="tcol">
              <div class="elCtn">
                <el-input v-model="item.loss"
                  placeholder="原料损耗"
                  @input="getMaterialFinalNum($event,item)">
                  <template slot="append">%</template>
                </el-input>
              </div>
            </div>
            <div class="tcol">
              <div class="elCtn">
                <el-input v-model="item.final_number"
                  placeholder="最终数量">
                  <template slot="append">{{item.unit==='g'?'kg':item.unit}}</template>
                </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">备注信息</div>
            <div class="info elCtn">
              <el-input placeholder="请输入备注信息"
                v-model="materialPlanInfo.desc"></el-input>
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
          <div class="btn backHoverBlue"
            @click="saveMaterialPlan">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { order, materialPlan } from '@/assets/js/api'
import { OrderInfo, OrderProductFlatten, OrderProductMerge, OrderTime } from '@/types/order'
import { MaterialPlanInfo, MaterailPlanData } from '@/types/materialPlan'
import { QuotedPriceProduct } from '@/types/quotedPrice'
import { CascaderInfo } from '@/types/vuex'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  data(): {
    materialDetialInfo: MaterialPlanInfo[]
    materialPlanInfo: MaterialPlanInfo
    orderInfo: OrderDetail
    [propName: string]: any
  } {
    return {
      loading: true,
      justWatch: false, // 这个字段专门用于监听物料概览，在某些特定操作下无法触发watch的时候手动触发重新计算
      confirmFlag: 1,
      settingMethod: 1, // 数字取整方式
      orderIndex: 0, // 多张订单/样单
      orderInfo: {
        id: null,
        client_id: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '',
        settle_unit: '',
        order_type: 1,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: this.$getDate(new Date()),
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
            is_before_confirm: 2,
            is_send: 2,
            batch_data: [
              {
                id: '',
                batch_number: 1,
                batch_title: '',
                batch_type_id: '',
                delivery_time: '',
                is_urgent: 2,
                is_draft: 2,
                total_style: '',
                total_number: '',
                total_price: '',
                desc: '',
                product_data: [
                  {
                    product_id: '',
                    size_color_list: [],
                    product_info: [
                      {
                        size_color: '',
                        size_id: '',
                        color_id: '',
                        number: '',
                        price: ''
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      materialDetialInfo: [],
      materialPlanInfo: {
        order_id: '',
        type: '1', // 1、按颜色尺码 2.按产品
        desc: '',
        is_draft: 2,
        production_plan_data: [
          {
            product_id: '',
            part_data: [],
            product_data: [
              {
                material_info: [],
                size_color: [],
                color_id: '',
                size_id: '',
                add_percent: '',
                order_number: '',
                info_data: [
                  {
                    part_id: '',
                    number: ''
                  }
                ]
              }
            ]
          }
        ],
        material_plan_data: [],
        material_plan_gather_data: []
      }
    }
  },
  computed: {
    processList() {
      return [
        {
          label: '织造工序',
          value: '织造工序',
          children: [
            { label: '针织织造', value: '针织织造' },
            { label: '梭织织造', value: '梭织织造' },
            { label: '制版费', value: '制版费' }
          ]
        },
        {
          label: '成品加工工序',
          value: '成品加工工序',
          children: this.$store.state.api.staffProcess.arr.map((item: any) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        },
        {
          label: '半成品加工工序',
          value: '半成品加工工序',
          children: this.$store.state.api.halfProcess.arr.map((item: any) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        }
      ]
    },
    yarnTypeList(): CascaderInfo[] {
      return this.$store.state.api.yarnType.arr
    },
    yarnColorList() {
      return this.$store.state.api.yarnColor.arr.map((item: { name: any }) => {
        return {
          value: item.name,
          label: item.name
        }
      })
    }
  },
  watch: {
    // 监听物料计划表的变化，来计算所需物料概览
    'materialPlanInfo.material_plan_data': {
      handler: function (materailPlanData: MaterailPlanData[]) {
        console.log(this.justWatch)
        this.materialPlanInfo.material_plan_gather_data = []
        const flattenYarnList: CascaderInfo[] = []
        this.yarnTypeList.forEach((item) => {
          item.children!.forEach((itemChild) => {
            itemChild.children!.forEach((itemSon) => {
              flattenYarnList.push(itemSon)
            })
          })
        })
        materailPlanData.forEach((item) => {
          item.info_data.forEach((itemChild) => {
            if (itemChild.material_id || itemChild.tree_data!.length > 0) {
              const finded = this.materialPlanInfo.material_plan_gather_data.find(
                (item) =>
                  item.material_id === (itemChild.material_id || itemChild.tree_data![2]) &&
                  item.material_color === itemChild.material_color
              )
              if (finded) {
                finded.need_number = Number(itemChild.need_number) + Number(finded.need_number)
                finded.final_number = Number(itemChild.final_number) + Number(finded.final_number)
                finded.loss =
                  finded.final_number >= finded.need_number
                    ? this.$toFixed((finded.final_number / finded.need_number - 1) * 100)
                    : 0
                this.$toFixed(100 * (Number(finded.final_number) / Number(finded.need_number) - 1))
              } else {
                this.materialPlanInfo.material_plan_gather_data.push({
                  material_name:
                    itemChild.material_name || this.$findId(flattenYarnList, itemChild.tree_data![2], 'label', 'value'),
                  material_id: itemChild.material_id || itemChild.tree_data![2],
                  material_type: 1, // 目前只有原料
                  material_color: itemChild.material_color,
                  need_number: Number(itemChild.need_number),
                  loss: itemChild.need_number
                    ? this.$toFixed(100 * (Number(itemChild.final_number) / Number(itemChild.need_number) - 1))
                    : 0,
                  final_number: Number(itemChild.final_number),
                  unit: itemChild.unit
                })
              }
            }
          })
        })
      },
      deep: true
    }
  },
  methods: {
    // 原料颜色搜索
    searchColor(str: string, cb: any) {
      let results = str ? this.yarnColorList.filter(this.createFilter(str)) : this.yarnColorList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    // 小数点处理方式
    numberAutoMethod(num: number | string) {
      const number = Number(num)
      if (number || number === 0) {
        if (+this.settingMethod === 1) {
          // 向上取整
          return Math.ceil(number)
        } else if (+this.settingMethod === 2) {
          // 四舍五入
          return Math.round(number)
        } else if (+this.settingMethod === 3) {
          // @ts-ignore 向下取整
          return parseInt(number)
        } else {
          return this.$toFixed(number)
        }
      } else if (isNaN(num as number)) {
        return ''
      } else {
        throw new TypeError('“' + num + '”is not a number')
      }
    },
    // 计划生产数量 = 下单数量*(数量百分比+1)
    getPlanNum(rate: number, productInfo: any) {
      productInfo.info_data.forEach((item: any) => {
        // 只能确定大身数量，配件数量不计算
        if (item.part_id === 0) {
          item.number = this.numberAutoMethod(productInfo.order_number * (rate / 100 + 1))
          this.getMaterialPlanDetail(0, item.number, productInfo)
        }
      })
    },
    // 数量百分比 = 计划生产数量/下单数量 - 1
    // 物料最终数量 = 物料计划数量*(原料损耗百分比+1)
    getMaterialFinalNum(rate: number, materail: any) {
      materail.final_number = this.numberAutoMethod(materail.need_number * (rate / 100 + 1))
    },
    // 从订单里面拿到产品信息
    getOrderProduct(orderInfo: OrderDetail): OrderProductMerge[] {
      const flattenArr: OrderProductFlatten[] = [] // 存储return信息
      orderInfo.time_data[this.orderIndex].batch_data.forEach((itemBatch) => {
        itemBatch.product_data.forEach((itemPro) => {
          itemPro.product_info.forEach((itemChild) =>
            flattenArr.push({
              material_info: itemChild.material_info || [],
              quote_product_id: itemPro.quote_product_id,
              quote_rel_product_info: itemPro.quote_rel_product_info,
              color_id: itemChild.color_id,
              color_name: itemChild.color_name,
              size_id: itemChild.size_id,
              size_name: itemChild.size_name,
              order_number: itemChild.number,
              price: itemChild.price,
              product_code: itemPro.product_code,
              system_code: itemPro.system_code,
              name: itemPro.name,
              product_id: itemPro.product_id,
              category: itemPro.category,
              secondary_category: itemPro.secondary_category,
              process_data: itemPro.process_data,
              plan_number: itemChild.plan_number,
              part_data: [
                {
                  name: '大身',
                  id: 0, // 大身给零，接口写的
                  unit: '件'
                }
              ].concat(itemPro.part_data as any[])
            })
          )
        })
      })
      const mergeArr: OrderProductMerge[] = this.$mergeData(flattenArr, {
        mainRule: 'product_id',
        otherRule: [
          { name: 'name' },
          { name: 'system_code' },
          { name: 'secondary_category' },
          { name: 'category' },
          { name: 'product_code' },
          { name: 'part_data' },
          { name: 'process_data' },
          { name: 'quote_product_id' },
          { name: 'quote_rel_product_info' }
        ],
        childrenRule: {
          mainRule: ['color_id', 'size_id'],
          otherRule: [
            { name: 'size_name' },
            { name: 'color_name' },
            { name: 'order_number', type: 'add' },
            { name: 'plan_number', type: 'add' },
            { name: 'price' },
            { name: 'material_info' }
          ]
        }
      })
      return mergeArr
    },
    getProductionData() {
      console.log(this.getOrderProduct(this.orderInfo))
      this.materialPlanInfo.production_plan_data = this.getOrderProduct(this.orderInfo).map((item) => {
        const cloneItem: any = this.$clone(item)
        cloneItem.product_data = item.childrenMergeInfo.map((itemChild) => {
          // @ts-ignore
          itemChild.add_percent = 0
          // @ts-ignore
          itemChild.info_data = item.part_data.map((itemPart) => {
            return {
              unit: itemPart.unit,
              name: itemPart.name,
              part_id: itemPart.id, // 下拉框选id用
              // @ts-ignore
              number: itemPart.id === 0 ? itemChild.order_number : ''
            }
          })
          return itemChild
        })
        return cloneItem
      })
      console.log(this.materialPlanInfo.production_plan_data)
    },
    // 计算所需物料--按尺码颜色
    getMaterialPlanDetail(partId?: number, number?: number, proInfo?: any) {
      if (partId || partId === 0) {
        const finded = this.materialPlanInfo.material_plan_data.find(
          (itemFind) =>
            itemFind.part_id === partId &&
            itemFind.color_id === proInfo.color_id &&
            itemFind.size_id === proInfo.size_id
        )
        if (finded) {
          finded.number = number
        } else {
        }
      }
    },
    confirmPlanNum() {
      if (this.confirmFlag === 1) {
        this.initMaterialPlan()
      } else {
        this.$confirm('此操作会重置物料填写信息，是否重置产品数量?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.materialPlanInfo.material_plan_data = []
            this.initMaterialPlan()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消重置'
            })
          })
      }
    },
    // 初始化material_plan_data
    initMaterialPlan() {
      // 计算所需物料--1.按尺码颜色 2.按照产品
      if (this.materialPlanInfo.type === '1') {
        this.materialPlanInfo.production_plan_data.forEach((item) => {
          item.product_data.forEach((itemChild) => {
            itemChild.info_data.forEach((itemPart) => {
              // 过滤掉空值和0
              itemPart.number = itemPart.number || 0
              if (itemPart.number && Number(itemPart.number) !== 0) {
                this.materialPlanInfo.material_plan_data.push({
                  product_code: item.product_code || item.system_code,
                  category: item.category,
                  secondary_category: item.secondary_category,
                  part_id: itemPart.part_id,
                  part_name: itemPart.name,
                  color_name: itemChild.color_name,
                  color_id: itemChild.color_id,
                  size_id: itemChild.size_id,
                  size_name: itemChild.size_name,
                  product_id: item.product_id,
                  number: itemPart.number || 0,
                  order_number: itemChild.order_number,
                  loss: '',
                  processList: item.quote_product_id ? this.getProcessInfo(item.quote_rel_product_info!) : [],
                  // 只有大身有工艺单
                  info_data:
                    itemPart.part_id === 0 && itemChild.material_info.length > 0
                      ? itemChild.material_info.map((itemMat) => {
                          return {
                            process_name_arr: ['织造工序', '梭织织造'],
                            process_name: '梭织织造',
                            process_type: '织造工序',
                            tree_data: [],
                            material_id: itemMat.material_id,
                            material_name: itemMat.material_name,
                            material_type: itemMat.material_type,
                            material_color: itemMat.material_color,
                            assist_material_number: '',
                            need_number: this.numberAutoMethod(itemMat.number * Number(itemPart.number)),
                            production_number: itemMat.number * 1000,
                            loss: '',
                            final_number: '',
                            unit: 'g',
                            has_plan: true
                          }
                        })
                      : this.findPartCraftMaterial(
                          itemPart.part_id,
                          itemChild.color_id,
                          item.product_id,
                          itemPart.number
                        )
                })
              }
            })
          })
        })
      } else {
        this.materialPlanInfo.production_plan_data.forEach((item) => {
          item.product_data.forEach((itemChild) => {
            itemChild.info_data.forEach((itemPart) => {
              // 过滤掉空值和0
              itemPart.number = itemPart.number || 0
              if (itemPart.number && Number(itemPart.number) !== 0) {
                const finded = this.materialPlanInfo.material_plan_data.find(
                  (itemFind) => itemFind.product_id === item.product_id && itemFind.part_id === itemPart.part_id
                )
                if (finded) {
                  // 计划数量加一加
                  finded.number = Number(finded.number) + Number(itemPart.number)
                  finded.order_number = Number(finded.order_number) + Number(itemChild.order_number)
                  // 物料重复的加一加，没有重复的拼一拼
                  if (itemPart.part_id === 0) {
                    itemChild.material_info.forEach((itemMat) => {
                      const findMat = finded.info_data.find(
                        (itemFindMat) =>
                          itemFindMat.material_name === itemMat.material_name &&
                          itemFindMat.material_color === itemMat.material_color
                      )
                      if (findMat) {
                        findMat.need_number += this.numberAutoMethod((itemMat.number * Number(itemPart.number)) / 1000)
                      } else {
                        finded.info_data.push({
                          process_name_arr: [],
                          process_name: '',
                          tree_data: [],
                          material_id: itemMat.material_id,
                          material_name: itemMat.material_name,
                          material_type: itemMat.material_type,
                          material_color: itemMat.material_color,
                          assist_material_number: '',
                          need_number: this.numberAutoMethod(itemMat.number * Number(itemPart.number)),
                          production_number: itemMat.number * 1000,
                          loss: '',
                          final_number: '',
                          unit: 'g',
                          has_plan: true
                        })
                      }
                    })
                  }
                } else {
                  this.materialPlanInfo.material_plan_data.push({
                    product_code: item.product_code || item.system_code,
                    category: item.category,
                    secondary_category: item.secondary_category,
                    part_id: itemPart.part_id,
                    part_name: itemPart.name,
                    color_name: '',
                    color_id: '',
                    size_id: '',
                    size_name: '',
                    product_id: item.product_id,
                    number: itemPart.number || 0,
                    order_number: itemChild.order_number,
                    loss: '',
                    info_data:
                      itemChild.material_info.length > 0
                        ? itemChild.material_info.map((itemMat) => {
                            return {
                              process_name_arr: [],
                              process_name: '',
                              tree_data: [],
                              material_id: itemMat.material_id,
                              material_name: itemMat.material_name,
                              material_type: itemMat.material_type,
                              material_color: itemMat.material_color,
                              assist_material_number: '',
                              need_number: this.numberAutoMethod((itemMat.number * Number(itemPart.number)) / 1000),
                              production_number: itemMat.number,
                              loss: '',
                              final_number: '',
                              has_plan: true,
                              unit: 'g'
                            }
                          })
                        : [
                            {
                              process_name_arr: [],
                              process_name: '',
                              tree_data: [],
                              material_id: '',
                              material_type: '',
                              material_color: '',
                              assist_material_number: '',
                              need_number: '',
                              production_number: '',
                              loss: '',
                              final_number: '',
                              unit: 'g'
                            }
                          ]
                  })
                }
              }
            })
          })
        })
      }
      console.log(this.materialPlanInfo)
      this.confirmFlag = 2
    },
    // 工序信息
    getProcessInfo(info: QuotedPriceProduct): any[] {
      let processArr: any[] = []
      info.weave_data!.forEach((item) => {
        processArr.push(item.name)
      })
      info.semi_product_data.forEach((item) => {
        processArr = processArr.concat(item.process_name)
      })
      info.production_data.forEach((item) => {
        processArr = processArr.concat(item.name)
      })
      return [
        {
          label: '推荐工序',
          value: '推荐工序',
          children: Array.from(new Set(processArr)).map((item) => {
            return { value: item, label: item }
          })
        }
      ].concat(this.processList)
    },
    // 配件的工艺信息用单独的函数去order_info里寻找，这样就不需要破坏前面只有大身有工艺单的逻辑
    findPartCraftMaterial(
      partId: number | string,
      colorId: number | string,
      proId: number | string,
      planNum: number | string
    ) {
      const initData = [
        {
          process_name_arr: [],
          process_name: '',
          tree_data: [],
          material_id: '',
          material_type: '',
          material_color: '',
          assist_material_number: '',
          need_number: '',
          production_number: '',
          loss: '',
          unit: 'g',
          final_number: ''
        }
      ]
      let proList: any[] = []
      this.orderInfo.time_data[this.orderIndex].batch_data.forEach((item) => {
        item.product_data.forEach((itemPro) => {
          proList.push(itemPro)
        })
      })
      const findPro = proList.find((item) => Number(item.product_id) === Number(proId))
      const findPart = findPro.part_data.find((item: any) => Number(item.id) === partId)
      if (findPart && findPart.material_info && findPart.material_info.length > 0) {
        const findMat = findPart.material_info.find((item: any) => Number(item.color_id) === Number(colorId))
        if (findMat) {
          return findMat.info_data.map((itemMat: any) => {
            return {
              process_name: '梭织织造',
              process_type: '织造工序',
              process_name_arr: ['织造工序', '梭织织造'],
              tree_data: [],
              material_id: itemMat.material_id,
              material_name: itemMat.material_name,
              material_type: itemMat.material_type,
              material_color: itemMat.material_color,
              assist_material_number: '',
              need_number: this.numberAutoMethod(itemMat.number * Number(planNum)),
              production_number: itemMat.number * 1000,
              loss: '',
              final_number: '',
              unit: 'kg',
              has_plan: true
            }
          })
        }
      } else {
        return initData
      }
      return initData
    },
    changeMaterialPlanType() {
      this.materialPlanInfo.material_plan_data = []
      this.initMaterialPlan()
      this.$message.success('已切换填写方式')
    },
    getMatId(ev: number[], info: any) {
      info.material_id = ev![2]
      if (this.yarnTypeList.find((item) => item.value === ev[0])?.label === '面料') {
        info.unit = 'm'
      } else {
        info.unit = 'g'
      }
    },
    getCmpData() {
      this.materialPlanInfo.order_id = Number(this.orderInfo.time_data[this.orderIndex].id)
      this.materialPlanInfo.material_plan_data.forEach((item) => {
        item.info_data.forEach((itemChild) => {
          // @ts-ignore
          itemChild.tree_data = itemChild.tree_data ? itemChild.tree_data.join(',') : itemChild.tree_data
          itemChild.unit = itemChild.unit === 'g' ? 'kg' : itemChild.unit
        })
      })
      this.materialPlanInfo.material_plan_gather_data.forEach((item) => {
        item.unit = item.unit === 'g' ? 'kg' : item.unit
      })
    },
    saveMaterialPlan() {
      if (this.materialPlanInfo.material_plan_data.length === 0) {
        this.$message.warning('请确认生产数量')
        return
      }
      const formCheck =
        // this.materialPlanInfo.production_plan_data.some((item) => {
        //   return item.product_data.some((itemChild) => {
        //     return itemChild.info_data.some((itemPart) => {
        //       return this.$formCheck(itemPart, [
        //         {
        //           key: 'number',
        //           errMsg: '请输入计划生产数量'
        //         }
        //       ])
        //     })
        //   })
        // }) ||
        this.materialPlanInfo.material_plan_data.some((item) => {
          return item.info_data.some((itemChild) => {
            return this.$formCheck(itemChild, [
              {
                key: 'process_name',
                errMsg: '检测到有未选择工序信息，请补充'
              },
              {
                key: 'material_id',
                errMsg: '检测到有未选择的物料名称，请补充'
              },
              {
                key: 'material_color',
                errMsg: '检测到有未选择的物料颜色，请补充'
              },
              {
                key: 'final_number',
                errMsg: '检测到有未填写的物料最终数量，请补充'
              },
              {
                key: 'unit',
                errMsg: '物料的单位只能为g,kg或m',
                regExp: /^g$|^m$|^kg$/,
                regNegate: true
              }
            ])
          })
        })
      if (!formCheck) {
        this.getCmpData()
        materialPlan.create(this.materialPlanInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.$router.push('/materialPlan/detail?id=' + this.$route.query.id)
          }
        })
      }
    },
    // 复制逻辑
    getUpdateData() {
      this.materialPlanInfo.material_plan_data.forEach((item) => {
        item.info_data.forEach((itemChild) => {
          // @ts-ignore
          itemChild.tree_data = itemChild.tree_data && itemChild.tree_data.split(',').map((item) => Number(item))
        })
      })
      this.materialPlanInfo.production_plan_data.forEach((item) => {
        item.part_data = [
          {
            name: '大身',
            id: 0, // 大身给零，接口写的
            unit: '件'
          }
        ].concat(
          // @ts-ignore
          item.product_detail!.part_data
        )
      })
    },
    // 统一输入行逻辑
    copyInfo(info: any, keyArr: string[]) {
      info.forEach((item: any, index: number) => {
        if (index !== 0) {
          keyArr.forEach((key) => {
            item[key] = info[0][key]
          })
        }
      })
      this.justWatch = !this.justWatch
    },
    // 统一损耗逻辑
    changeAllLoss(info: any) {
      info.forEach((itemChild: any) => {
        itemChild.final_number = this.numberAutoMethod((Number(itemChild.loss) / 100 + 1) * itemChild.need_number)
      })
    },
    // 因为多批次产品合并问题导致后端无法计算plan_number，所需前端根据物料计划单列表累加已计划的数量
    getHasPlanNumber(id: number, color: string, size: string) {
      console.log(this.materialDetialInfo)
      if (this.materialDetialInfo.length === 0) {
        return 0
      } else {
        return this.materialDetialInfo.reduce((total, cur) => {
          return (
            total +
            cur.material_plan_data.reduce((totalChild, curChild) => {
              // @ts-ignore
              return totalChild +
                (Number(curChild.product_id) === id && curChild.size_name === size && curChild.color_name === color)
                ? Number(curChild.number)
                : 0
            }, 0)
          )
        }, 0)
      }
    },
    getMaterialPlan() {
      materialPlan
        .list({
          order_id: Number(this.orderInfo.time_data[this.orderIndex].id)
        })
        .then((res) => {
          if (res.data.status) {
            this.materialDetialInfo = res.data.data
          }
        })
    }
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      },
      {
        checkWhich: 'api/halfProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getHalfProcessAsync'
      },
      {
        checkWhich: 'api/staffProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getStaffProcessAsync'
      },
      {
        checkWhich: 'api/yarnType',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnTypeAsync'
      },
      {
        checkWhich: 'api/yarnColor',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getYarnColorAsync'
      }
    ])
    order
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.orderInfo = res.data.data
          this.orderInfo.time_data.forEach((item, index) => {
            if (item.id === Number(this.$route.query.sampleOrderIndex)) {
              this.orderIndex = index
            }
          })
          this.getProductionData()
          // 别问我添加页面为什么要拿详情接口，因为有继续添加，要计算一个已计划数量值
          this.getMaterialPlan()
          this.loading = false
        }
      })
    // 复制逻辑
    if (this.$route.query.copyId) {
      materialPlan
        .detail({
          id: this.$route.query.copyId
        })
        .then((res) => {
          this.materialPlanInfo = res.data.data
          this.materialPlanInfo.type = this.materialPlanInfo.type.toString()
          this.getUpdateData()
          this.confirmFlag = 2
          this.loading = false
        })
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialPlan/create.less';
</style>
<style lang="less">
#materialPlanCreate {
  .el-tabs__content {
    padding: 20px 32px;
  }
  .UnitCtn {
    .el-input-group__append {
      padding: 0;
      .el-input {
        width: 45px;
        .el-input__inner {
          padding: 0 8px;
          border: 0;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
}
</style>