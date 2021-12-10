<template>
  <div id="sampleOrderDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">样单信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">样单号：</div>
            <div class="text">{{sampleOrderInfo.code}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">打样公司：</div>
            <div class="text">{{sampleOrderInfo.client_name}}</div>
          </div>
          <div class="col">
            <div class="label">公司联系人：</div>
            <div class="text">{{sampleOrderInfo.contacts_name}}</div>
          </div>
          <div class="col">
            <div class="label">负责组/人：</div>
            <div class="text">{{sampleOrderInfo.group_name}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">创建人：</div>
            <div class="text">{{sampleOrderInfo.group_name}}</div>
          </div>
          <div class="col">
            <div class="label">创建时间：</div>
            <div class="text">{{sampleOrderInfo.created_at}}</div>
          </div>
          <div class="col">
            <div class="label">样单状态：</div>
            <div class="text"
              :class="sampleOrderInfo.status|orderStatusClassFilter">{{sampleOrderInfo.status|orderStatusFilter}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">关联单据：</div>
            <div class="text green">
              <span class="gray"
                v-if="!sampleOrderInfo.rel_order">无关联单据</span>
              <span v-for="item in sampleOrderInfo.rel_order"
                :key="item.id"
                style="cursor:pointer;margin-right:12px"
                @click="$openUrl(item.order_type===1?('/order/detail?id='+item.id):('/sampleOrder/detail?id='+item.id))">{{item.code}}</span>
            </div>
          </div>
          <div class="col">
            <div class="label">备注信息：</div>
            <div class="text"
              :class="{'gray':!sampleOrderInfo.desc}">{{sampleOrderInfo.desc || '无备注信息'}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">文件信息：</div>
            <div class="fileCtn">
              <div class="once"
                v-for="(item,index) in sampleOrderInfo.public_files"
                :key="index">
                <div class="fileIcon">
                  <svg v-if="item.split('.')[item.split('.').length-1]==='xlsx'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-Excel"></use>
                  </svg>
                  <svg v-else-if="item.split('.')[item.split('.').length-1]==='png'||item.split('.')[item.split('.').length-1]==='jpeg'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-tupian"></use>
                  </svg>
                  <svg v-else-if="item.split('.')[item.split('.').length-1]==='word'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-word"></use>
                  </svg>
                  <svg v-else-if="item.split('.')[item.split('.').length-1]==='pdf'"
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-pdf"></use>
                  </svg>
                  <svg v-else
                    class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-qitawenjian"></use>
                  </svg>
                </div>
                <div class="name">文件{{index+1}}.{{item.split('.')[item.split('.').length-1]}}</div>
                <a class="opr hoverBlue"
                  :href="item"
                  target=_blank>点击下载</a>
              </div>
              <div class="text"
                v-if="sampleOrderInfo.public_files.length===0">
                <span class="gray">暂无相关文件信息</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row"
          style="margin-bottom:0">
          <div class="col">
            <div class="label">{{confirmSampleInfo.length>0?'已确认样品信息：':'暂无确认的样品信息'}}</div>
            <div class="text"></div>
          </div>
        </div>
      </div>
      <div class="tableCtn"
        style="padding-top:0"
        v-if="confirmSampleInfo.length>0">
        <div class="thead">
          <div class="trow">
            <div class="tcol noPad"
              style="flex:7">
              <div class="trow">
                <div class="tcol">样品编号</div>
                <div class="tcol">样品名称</div>
                <div class="tcol">样品图片</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow">
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">单价</div>
                    <div class="tcol">打样数量</div>
                  </div>
                </div>
                <div class="tcol">样品单据</div>
                <div class="tcol">样品描述</div>
              </div>
            </div>
            <div class="tcol">
              操作
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow">
            <div class="tcol noPad"
              style="flex:7">
              <div class="trow"
                v-for="(item,index) in confirmSampleInfo"
                :key="index">
                <div class="tcol">
                  <span class="blue"
                    style="cursor:pointer"
                    @click="sampleDetail=item;sampleShow=true">{{item.product_code||item.system_code}}</span>
                  <span class="gray">({{item.category}}/{{item.type}})</span>
                </div>
                <div class="tcol">{{item.name}}</div>
                <div class="tcol">
                  <div class="imageCtn">
                    <el-image style="width:100%;height:100%"
                      :src="item.image_data.length>0?item.image_data[0]:''"
                      :preview-src-list="item.image_data">
                      <div slot="error"
                        class="image-slot">
                        <i class="el-icon-picture-outline"
                          style="font-size:42px"></i>
                      </div>
                    </el-image>
                  </div>
                </div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.product_info"
                    :key="indexChild">
                    <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                    <div class="tcol">{{itemChild.price}}元</div>
                    <div class="tcol">{{itemChild.number}}</div>
                  </div>
                </div>
                <div class="tcol stateCtn">
                  <div class="state"
                    @click="item.craft_list_id?$router.push('/craft/detail?id='+item.craft_list_id):$router.push('/craft/create?id=' + item.product_id)">
                    <div v-if="item.category==='围巾'"
                      class="circle"
                      :class="{'backGray':!item.craft_list_id,'backBlue':item.craft_list_id}">工</div>
                    <div v-else
                      class="gray">无需工艺单</div>
                  </div>
                </div>
                <div class="tcol">{{item.desc}}</div>
              </div>
            </div>
            <div class="tcol oprCtn">
              <div class="opr hoverBlue"
                @click="changeToOrder">大货生产</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <el-tabs type="border-card"
        v-model="sampleOrderIndex">
        <el-tab-pane v-for="(item,index) in sampleOrderInfo.time_data"
          :key="item.id"
          :label="'第'+(index+1)+'次打样'"
          :name="index.toString()">
          <div class="detailCtn">
            <div class="checkCtn"
              style="top: 0px;">
              <!-- <el-tooltip class="item"
                effect="dark"
                content="点击查看审核日志"
                placement="bottom">
                <img :src="quotedPriceInfo.is_check|checkFilter" />
              </el-tooltip> -->
              <img :src="item.is_check|checkFilter" />
            </div>
            <div class="row">
              <div class="col">
                <div class="label">打样款数：</div>
                <div class="text">{{item.total_style}}款</div>
              </div>
              <div class="col">
                <div class="label">打样总数：</div>
                <div class="text">{{item.total_number}}</div>
              </div>
              <div class="col">
                <div class="label">打样总额：</div>
                <div class="text">{{item.total_price}}元</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">完成时间：</div>
                <div class="text"
                  :class="item.complete_time?'':'gray'">{{item.complete_time || '未填写'}}
                  <span v-if="item.complete_time"
                    :class="$diffByDate(item.complete_time)>0?'green':'red'">({{$diffByDate(item.complete_time)>0?'还剩'+$diffByDate(item.complete_time)+'天':'逾期'+Math.abs($diffByDate(item.complete_time))+'天'}})</span>
                </div>
              </div>
              <div class="col flex3">
                <div class="label">是否加急：</div>
                <div class="text"
                  :class="item.is_urgent===2?'gray':'red'">{{item.is_urgent===2?'否':'是'}}</div>
              </div>
              <div class="col">
                <div class="label">样单类型：</div>
                <div class="text"
                  :class="item.order_type?'':'gray'">{{item.order_type || '未填写'}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">下单时间：</div>
                <div class="text"
                  :class="item.order_time?'':'gray'">{{item.order_time || '未填写'}}</div>
              </div>
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text"
                  :class="item.batch_data[0].desc?'':'gray'">{{item.batch_data[0].desc || '未填写'}}</div>
              </div>
            </div>
          </div>
          <div class="tableCtn"
            style="padding-top:0">
            <div class="thead">
              <div class="trow">
                <div class="tcol">样品编号</div>
                <div class="tcol">样品名称</div>
                <div class="tcol">样品图片</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow">
                    <div class="tcol">尺码颜色</div>
                    <div class="tcol">单价</div>
                    <div class="tcol">打样数量</div>
                  </div>
                </div>
                <div class="tcol">工艺单状态</div>
                <!-- <div class="tcol">样品描述</div> -->
                <div class="tcol">客户确认状态</div>
                <div class="tcol">客户确认操作</div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="(item,index) in sampleOrderInfo.time_data[sampleOrderIndex].batch_data[0].product_data"
                :key="index">
                <!-- 判断样品信息是否完整 -->
                <template v-if="item.category && item.color_data.length>0 && item.size_data.length>0">
                  <div class="tcol">
                    <span class="blue"
                      @click="sampleDetail=item;sampleShow = true"
                      style="cursor:pointer">{{item.product_code||item.system_code}}</span>
                    <span class="gray">({{item.category}}/{{item.secondary_category}})</span>
                  </div>
                  <div class="tcol">{{item.name}}</div>
                  <div class="tcol">
                    <div class="imageCtn">
                      <el-image style="width:100%;height:100%"
                        :src="item.image_data.length>0?item.image_data[0]:''"
                        :preview-src-list="item.image_data">
                        <div slot="error"
                          class="image-slot">
                          <i class="el-icon-picture-outline"
                            style="font-size:42px"></i>
                        </div>
                      </el-image>
                    </div>
                  </div>
                  <div class="tcol noPad"
                    style="flex:2">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.product_info"
                      :key="indexChild">
                      <div class="tcol">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                      <div class="tcol">{{itemChild.price}}元</div>
                      <div class="tcol">{{itemChild.number}}</div>
                    </div>
                  </div>
                  <div class="tcol stateCtn">
                    <div class="state"
                      @click="item.craft_list_id?$router.push('/craft/detail?id='+item.craft_list_id):$router.push('/craft/create?id=' + item.product_id)">
                      <div v-if="item.category==='围巾'"
                        class="circle"
                        :class="{'backGray':!item.craft_list_id,'backBlue':item.craft_list_id}">工</div>
                      <div v-else
                        class="gray">无需工艺单</div>
                    </div>
                  </div>
                  <!-- <div class="tcol">{{item.desc}}</div> -->
                  <div class="tcol">
                    <span :class="item.status|productStatusClassFilter">{{item.status|productStatusFilter}}</span>
                  </div>
                  <div class="tcol oprCtn">
                    <el-dropdown style="cursor:pointer">
                      <span class="el-dropdown-link hoverBlue">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="confirmSample(item.product_id,item.status===2?1:2)"
                          :disabled="item.status===6 ||item.status===5 || item.status===4 || item.status===3">
                          <div :class="item.status===2?'hoverOrange':'hoverBlue'">{{item.status===2?'重新打样':'客户确认完成'}}</div>
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="item.status===4 || item.status===3"
                          @click.native="item.status===6?confirmSample(item.product_id,1):confirmSample(item.product_id,6)"><span class="hoverGreen">{{item.status===6?'重新待定':'确认继续打样'}}</span></el-dropdown-item>
                        <el-dropdown-item @click.native="confirmSample(item.product_id,item.status===5?1:5)"
                          :disabled="item.status===6 ||item.status===4 || item.status===3 || item.status===2">
                          <div class="hoverOrange">{{item.status===5?'重新打样':'取消打样'}}</div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </template>
                <template v-else>
                  <div class="tcol">
                    <span class="gray"
                      style="text-align:center">样品信息待补充</span>
                  </div>
                  <div class="tcol oprCtn"
                    @click="sampleId=item.product_id;addSampleFlag=true">
                    <div class="opr hoverBlue">补充信息</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="buttonList"
            style="margin-left:12px">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">样单操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange"
                  @click="$router.push('/sampleOrder/update?id='+$route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">修改样单</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteSampleOrder">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">删除样单</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="checkTimeData">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shenhedingdan"></use>
                  </svg>
                  <span class="text">打样审核</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="checkClient">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shenhedingdan"></use>
                  </svg>
                  <span class="text">客户确认</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="checkComplete">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shenhedingdan"></use>
                  </svg>
                  <span class="text">打样确认</span>
                </div>
                <div class="btn backHoverOrange"
                  @click="goUpdateOrderTime">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">打样修改</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="goContinue">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">继续打样</span>
                </div>
                <div class="btn backHoverBlue">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-dayindingdan"></use>
                  </svg>
                  <span class="text">打印样单</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="sampleOrderUpdateFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">修改第{{Number(sampleOrderIndex)+1}}次打样信息</span>
          <div class="closeCtn"
            @click="sampleOrderUpdateFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="description">
              <span>修改打样信息不能修改样品信息，如需修改样品请再次打样</span>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">样单类型</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="info elCtn">
                  <el-select placeholder="请选择样单类型"
                    v-model="sampleOrderTime.order_type_id">
                    <el-option v-for="item in sampleOrderTypeList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">完成时间</span>
                  <span class="explanation">(必填)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker placeholder="请选择完成时间"
                    v-model="sampleOrderTime.complete_time"
                    value-format="yyyy-MM-dd"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">是否加急打样</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-radio-group v-model="sampleOrderTime.is_urgent">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">样品信息</div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow">
                      <div class="tcol">尺码颜色</div>
                      <div class="tcol">打样单价</div>
                      <div class="tcol">打样数量</div>
                      <div class="tcol">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in sampleOrderTime.batch_data[0].product_data"
                  :key="index">
                  <div class="tcol">
                    <span class="blue">{{item.product_code || item.system_code}}</span>
                    <span>{{item.category}}/{{item.secondary_category}}</span>
                  </div>
                  <div class="tcol noPad"
                    style="flex:4">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.product_info"
                      :key="indexChild">
                      <div class="tcol">
                        <div class="elCtn">
                          <el-select v-model="itemChild.size_color"
                            placeholder="尺码颜色"
                            no-data-text="请先选择产品">
                            <el-option v-for="item in item.size_color_list"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="tcol">
                        <div class="elCtn">
                          <el-input v-model="itemChild.price"
                            placeholder="打样单价">
                            <template slot="append">元</template>
                          </el-input>
                        </div>
                      </div>
                      <div class="tcol">
                        <div class="elCtn">
                          <el-input v-model="itemChild.number"
                            placeholder="打样数量">
                          </el-input>
                        </div>
                      </div>
                      <div class="tcol oprCtn"
                        style="justify-content: flex-start;">
                        <div class="opr hoverBlue"
                          @click="$addItem(item.product_info,{
                            size_color: [], // 用于下拉框选择尺码颜色
                            size_id: '',
                            color_id: '',
                            number: '',
                            price: ''
                          })">新增尺码</div>
                        <div class="opr hoverRed"
                          @click="item.product_info.length>1?deleteProChild(itemChild.id,indexChild,item.product_info):deletePro(item.id,index,sampleOrderTime.batch_data[0].product_data)">删除</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">打样款数</span>
                  <span class="explanation">(自动计算)</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入打样总数"
                    v-model="totalStyle"
                    disabled></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">打样总数</span>
                  <span class="explanation">(自动计算)</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入打样总数"
                    v-model="totalNumber"
                    disabled></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">打样总费用</span>
                  <span class="explanation">(自动计算)</span>
                </div>
                <div class="info elCtn">
                  <el-input placeholder="请输入打样总费用"
                    v-model="totalPrice"
                    disabled></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="sampleOrderUpdateFlag = false">取消</span>
          <span class="btn backHoverOrange"
            @click="saveUpdate">确认修改</span>
        </div>
      </div>
    </div>
    <sample-edit :show="addSampleFlag"
      @close="addSampleFlag = false"
      @afterSave="getNewSample"></sample-edit>
    <sample-detail :data="sampleDetail"
      :show="sampleShow"
      @close="sampleShow = false"></sample-detail>
    <zh-check @close="checkFlag=false"
      @afterCheck="(ev)=>{sampleOrderInfo.time_data[sampleOrderIndex].is_check=ev;$forceUpdate()}"
      :show="checkFlag"
      :pid="sampleOrderInfo.time_data[sampleOrderIndex].id"
      :check_type="1"
      :reason="['驳回理由1','驳回理由2','驳回理由3','驳回理由4','驳回理由5']"></zh-check>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SampleInfo } from '@/types/sample'
import { SampleOrderInfo, SampleOrderTime } from '@/types/sampleOrder'
import { sampleOrder, completeCheck, clientCheck } from '@/assets/js/api'
interface SampleOrderDetail extends SampleOrderInfo {
  time_data: SampleOrderTime[]
}
export default Vue.extend({
  data(): {
    confirmSampleInfo: SampleOrderDetail[]
    sampleOrderInfo: SampleOrderDetail
    sampleOrderTime: SampleOrderTime
    [propName: string]: any
  } {
    return {
      loading: true,
      sampleShow: false,
      checkFlag: false,
      sampleDetail: {
        product_type: 2,
        name: '',
        product_code: '',
        style_code: '', // 客户款号
        unit: '',
        category: '',
        type: '',
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
      addSampleFlag: false,
      sampleOrderIndex: '0', // el-tab组件需要string数据
      sampleOrderInfo: {
        id: null,
        client_id: '',
        tree_data: '',
        group_id: '',
        contacts_id: '',
        public_files: [],
        private_files: [],
        settle_tax: '', // 订单用无用字段
        settle_unit: '', // 订单用无用字段
        order_type: 2,
        code: '',
        desc: '',
        time_data: [
          {
            id: '',
            order_time: '',
            order_type_id: '',
            complete_time: '',
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            is_urgent: 2,
            batch_data: [
              {
                id: '',
                batch_number: 1,
                batch_title: '',
                batch_type: '',
                delivery_time: '',
                is_urgent: 2,
                is_draft: 2,
                total_style: '',
                total_number: '',
                total_price: '',
                desc: '',
                product_data: [
                  {
                    image_data: [],
                    product_id: '',
                    size_color_list: [], // 用于下拉框选择尺码颜色
                    product_info: [
                      {
                        size_color: '', // 用于下拉框选择尺码颜色
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
      sampleOrderUpdateFlag: false,
      sampleOrderTime: {
        id: '',
        order_time: '',
        order_type_id: '',
        complete_time: '',
        is_draft: 2,
        total_style: '',
        total_number: '',
        total_price: '',
        is_urgent: 2,
        batch_data: [
          {
            id: '',
            batch_number: 1,
            batch_title: '',
            batch_type: '',
            delivery_time: '',
            is_urgent: 2,
            is_draft: 2,
            total_style: '',
            total_number: '',
            total_price: '',
            desc: '',
            product_data: [
              {
                image_data: [],
                product_id: '',
                size_color_list: [], // 用于下拉框选择尺码颜色
                product_info: [
                  {
                    size_color: '', // 用于下拉框选择尺码颜色
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
      },
      sampleId: '',
      confirmSampleInfo: [], // 已经确认的样品信息
      unConfirmSampleInfo: [] // 除了已确认的其他样品信息
    }
  },
  computed: {
    sampleOrderTypeList(): any[] {
      return this.$store.state.api.sampleOrderType.arr
    },
    totalStyle(): number {
      return this.sampleOrderTime.batch_data[0].product_data.length
    },
    totalPrice(): number {
      return this.sampleOrderTime.batch_data[0].product_data.reduce((total, current) => {
        return (
          total +
          current.product_info.reduce((totalChild, itemChild) => {
            return totalChild + Number(itemChild.price) * Number(itemChild.number)
          }, 0)
        )
      }, 0)
    },
    totalNumber(): number {
      return this.sampleOrderTime.batch_data[0].product_data.reduce((total, current) => {
        return (
          total +
          current.product_info.reduce((totalChild, itemChild) => {
            return totalChild + Number(itemChild.number)
          }, 0)
        )
      }, 0)
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        sampleOrder.detail({
          id: Number(this.$route.query.id)
        }),
        sampleOrder.confirmList({
          order_id: Number(this.$route.query.id),
          status: []
        })
      ]).then((res) => {
        this.sampleOrderInfo = res[0].data.data
        this.confirmSampleInfo = res[1].data.data.filter((item: any) => item.status === 2)
        this.unConfirmSampleInfo = res[1].data.data.filter((item: any) => item.status !== 2)
        this.$checkCommonInfo([
          {
            checkWhich: 'api/sampleOrderType',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getSampleOrderTypeAsync'
          }
        ])
        this.loading = false
      })
    },
    deletePro(id: number, index: number, info: any[]) {
      this.$confirm('是否删除该产品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sampleOrder
            .deletePro({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$deleteItem(info, index)
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
    deleteProChild(id: number, index: number, info: any[]) {
      this.$confirm('是否删除该尺码颜色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sampleOrder
            .deleteProChild({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$deleteItem(info, index)
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
    // 审核
    checkTimeData() {
      this.$confirm('是否审核第' + (Number(this.sampleOrderIndex) + 1) + '次打样信息', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.checkFlag = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 客户确认
    checkClient() {
      this.$confirm('客户是否确认第' + (Number(this.sampleOrderIndex) + 1) + '次打样信息', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          clientCheck
            .create({
              order_id: this.sampleOrderInfo.time_data[this.sampleOrderIndex].id as number
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('已确认')
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 打样确认完成
    checkComplete() {
      this.$confirm('是否确认第' + (Number(this.sampleOrderIndex) + 1) + '次打样信息已完成', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          completeCheck
            .create({
              order_id: this.sampleOrderInfo.time_data[this.sampleOrderIndex].id as number
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('已确认')
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    confirmSample(sampleId: number, status: 1 | 2 | 3 | 5 | 6) {
      const tipsArr = [
        '',
        '该样品是否需要重新打样？',
        '是否确认该样品已经被客户确认完成？',
        '',
        '',
        '该样品客户是否确认取消打样？',
        '该样品客户是否确认继续打样？'
      ]
      this.$confirm(tipsArr[status], '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          sampleOrder
            .confirm({
              id: sampleId,
              status: status
            })
            .then((res) => {
              if (res.data.status) {
                if (status === 2) {
                  this.$message.success('该样品已确认完成')
                } else if (status === 5) {
                  this.$message.success('该样品已确认不做')
                } else if (status === 6) {
                  this.$message.success('该样品已确认继续打样')
                } else {
                  this.$message.success('该样品已重新待定')
                }
                // @ts-ignore
                ;(this.sampleOrderInfo.time_data as SampleOrderTime[])[
                  this.sampleOrderIndex
                ].batch_data[0].product_data.find((item) => item.product_id === sampleId)!.status = status
              }
              // 重新获取已确认样品
              sampleOrder
                .confirmList({
                  order_id: Number(this.$route.query.id),
                  status: []
                })
                .then((res) => {
                  this.confirmSampleInfo = res.data.data.filter((item: any) => item.status === 2)
                  this.unConfirmSampleInfo = res.data.data.filter((item: any) => item.status !== 2)
                  this.loading = false
                })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    goContinue() {
      const unConfirmLength = this.unConfirmSampleInfo.filter((item: any) => item.status === 6).length
      if (unConfirmLength === 0) {
        this.$message.error('暂无客户确认需要继续打样的样品，请确认后继续打样')
        return
      }
      this.$confirm('客户确认需要继续打样的样品会进入继续打样，是否继续操作?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push(
            '/sampleOrder/again?id=' + this.$route.query.id + '&sampleOrderIndex=' + this.sampleOrderIndex
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 转大货生产
    changeToOrder() {
      if (
        this.sampleOrderInfo.time_data.some((item) => {
          return item.batch_data[0].product_data.some((itemChild) => itemChild.status === 1)
        })
      ) {
        this.$confirm('检测到还存在未修改也未确认的样品，是否将已确认的样品信息转大货生产？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push('/order/create?sampleOrderId=' + this.$route.query.id)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else {
        this.$router.push('/order/create?sampleOrderId=' + this.$route.query.id)
      }
    },
    deleteSampleOrder() {
      this.$confirm('只能删除还未进行任何后续操作的样单?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sampleOrder
            .delete({
              id: Number(this.$route.query.id)
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$router.push('/sampleOrder/list?page=1&keyword=&client_id=&user_id=&status=null0&date=')
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
    goUpdateOrderTime() {
      this.sampleOrderTime = this.sampleOrderInfo.time_data[this.sampleOrderIndex]
      this.sampleOrderTime.batch_data[0].product_data.forEach((item) => {
        item.size_color_list = []
        item.size_data?.forEach((itemSize) => {
          item.color_data?.forEach((itemColor) => {
            item.size_color_list.push({
              label: itemSize.name + '/' + itemColor.name,
              value: itemSize.id + '/' + itemColor.id
            })
          })
        })
        item.product_info.forEach((itemPro) => {
          itemPro.size_color = itemPro.size_id + '/' + itemPro.color_id
        })
      })
      this.sampleOrderUpdateFlag = true
    },
    getNewSample(sample: SampleInfo) {
      // this.sampleList.push(sample)
    },
    saveUpdate() {
      const formData = this.$clone(this.sampleOrderInfo)
      // @ts-ignore
      formData.time_data = this.$clone(this.sampleOrderTime)
      // @ts-ignore
      formData.time_data.batch_data[0].product_data.forEach((item) => {
        item.product_info.forEach((itemChild: any) => {
          itemChild.size_id = itemChild.size_color.split('/')[0]
          itemChild.color_id = itemChild.size_color.split('/')[1]
        })
      })
      sampleOrder.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('修改样单成功')
          this.sampleOrderUpdateFlag = false
          this.init()
        }
      })
    }
  },
  mounted() {
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/sampleOrder/detail.less';
</style>
<style lang="less">
#sampleOrderDetail {
  .el-tabs--border-card > .el-tabs__content {
    padding: 0;
  }
}
</style>