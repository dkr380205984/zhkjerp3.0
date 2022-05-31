<template>
  <div id="materialStockDetail"
    class="bodyContainer"
    v-loading="loading">
    <order-detail :data="orderInfo"></order-detail>
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">物料采购单入库</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">采购单号</div>
            <div class="tcol">采购单位</div>
            <div class="tcol noPad"
              style="flex:5">
              <div class="trow">
                <div class="tcol">物料名称</div>
                <div class="tcol">订购属性</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow">
                    <div class="tcol">初始/染色颜色</div>
                    <div class="tcol">采购/已加工数量</div>
                  </div>
                </div>
                <div class="tcol">入库数量</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="(item,index) in materialOrderList"
            :key="index">
            <div class="tcol">
              <el-checkbox v-model="item.checkAll"
                @change="getAllCheck($event,item)">{{item.code}}</el-checkbox>
            </div>
            <div class="tcol">{{item.client_name}}</div>
            <div class="tcol noPad"
              style="flex:5">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.info_data"
                :key="indexChild">
                <div class="tcol">
                  <el-checkbox v-model="itemChild.check"
                    @change="$forceUpdate()">{{itemChild.material_name}}</el-checkbox>
                </div>
                <div class="tcol">{{itemChild.attribute}}</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow"
                    v-if="itemChild.process_info.filter((item)=>item.process==='染色').length===0">
                    <div class="tcol">
                      <span style="display:flex;align-items:center">
                        <div class="backHoverOrange"
                          style="display: inline-block;
                          width: 22px;
                          line-height: 22px;
                          height: 22px;
                          text-align: center;
                          border-radius: 50%;
                          color:white;
                          font-size:14px;
                          margin-right:8px">初</div>{{itemChild.material_color}}
                      </span>
                    </div>
                    <div class="tcol">{{itemChild.number}}{{itemChild.unit||'kg'}}</div>
                  </div>
                  <div class="trow"
                    v-else
                    v-for="(itemSon,indexSon) in itemChild.process_info.filter((item)=>item.process==='染色')"
                    :key="indexSon">
                    <div class="tcol">
                      <span style="display:flex;align-items:center">
                        <div class="backHoverGreen"
                          style="display: inline-block;
                          width: 22px;
                          line-height: 22px;
                          height: 22px;
                          text-align: center;
                          border-radius: 50%;
                          color:white;
                          font-size:14px;
                          margin-right:8px">染</div>
                        {{itemSon.after_color}}
                      </span>
                    </div>
                    <div class="tcol">{{itemSon.number}}{{itemChild.unit||'kg'}}</div>
                  </div>
                  <!-- 没染完 -->
                  <div class="trow"
                    v-if="itemChild.process_info.filter((item)=>item.process==='染色').length>0
                    &&
                    itemChild.process_info.filter((item)=>item.process==='染色').reduce((total,cur)=>(total+Number(cur.number)),0)<Number(itemChild.number)">
                    <div class="tcol">
                      <span style="display:flex;align-items:center">
                        <div class="backHoverOrange"
                          style="display: inline-block;
                          width: 22px;
                          line-height: 22px;
                          height: 22px;
                          text-align: center;
                          border-radius: 50%;
                          color:white;
                          font-size:14px;
                          margin-right:8px">初</div>{{itemChild.material_color}}
                      </span>
                    </div>
                    <div class="tcol">{{itemChild.number - itemChild.process_info.filter((item)=>item.process==='染色').reduce((total,cur)=>(total+Number(cur.number)),0)}}{{itemChild.unit||'kg'}}</div>
                  </div>
                </div>
                <div class="tcol">{{itemChild.final_push_number||0}}{{itemChild.unit||'kg'}}</div>
              </div>
            </div>
          </div>
          <div class="trow"
            v-if="materialOrderList.length===0">
            <div class="tcol gray"
              style="text-align:center">暂无单据</div>
          </div>
        </div>
      </div>
      <div class="buttonList">
        <div class="btn backHoverBlue"
          :class="{'backGray':materialOrderList.filter((item) => {
                return item.info_data.some((itemChild) => itemChild.check)
              }).length===0}"
          @click="goStock(4)">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-xiugaidingdan"></use>
          </svg>
          <span class="text">最终入库</span>
        </div>
      </div>
    </div>
    <div class="module clearfix"
      v-show="materialJHDQList.length>0">
      <div class="titleCtn">
        <div class="title">计划调取单入库</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">调取单号</div>
            <div class="tcol">来源仓库</div>
            <div class="tcol noPad"
              style="flex:5">
              <div class="trow">
                <div class="tcol">原料名称</div>
                <div class="tcol">调取属性</div>
                <div class="tcol">批号/缸号/色号</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow">
                    <div class="tcol">调取/染色颜色</div>
                    <div class="tcol">调取/已加工数量</div>
                  </div>
                </div>
                <div class="tcol">已入库数量</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="item in materialJHDQList"
            :key="item.id">
            <div class="tcol">
              <el-checkbox v-model="item.checkAll"
                @change="getAllCheck($event,item)">{{item.code}}</el-checkbox>
            </div>
            <div class="tcol">{{item.store}}/{{item.secondary_store}}</div>
            <div class="tcol noPad"
              style="flex:5">
              <div class="trow"
                v-for="(itemChild,indexChild) in item.info_data"
                :key="indexChild">
                <div class="tcol">
                  <el-checkbox v-model="itemChild.check"
                    @change="$forceUpdate()">{{itemChild.material_name}}
                  </el-checkbox>
                </div>
                <div class="tcol">{{itemChild.attribute}}</div>
                <div class="tcol">{{itemChild.batch_code}}/{{itemChild.vat_code}}/{{itemChild.color_code}}</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow"
                    v-if="itemChild.process_info.filter((item)=>item.process==='染色').length===0">
                    <div class="tcol">
                      <span style="display:flex;align-items:center">
                        <div class="backHoverOrange"
                          style="display: inline-block;
                          width: 22px;
                          line-height: 22px;
                          height: 22px;
                          text-align: center;
                          border-radius: 50%;
                          color:white;
                          font-size:14px;
                          margin-right:8px">调</div>{{itemChild.material_color}}
                      </span>
                    </div>
                    <div class="tcol">{{itemChild.number}}{{itemChild.unit||'kg'}}</div>
                  </div>
                  <div class="trow"
                    v-else
                    v-for="(itemSon,indexSon) in itemChild.process_info.filter((item)=>item.process==='染色')"
                    :key="indexSon">
                    <div class="tcol">
                      <span style="display:flex;align-items:center">
                        <div class="backHoverGreen"
                          style="display: inline-block;
                          width: 22px;
                          line-height: 22px;
                          height: 22px;
                          text-align: center;
                          border-radius: 50%;
                          color:white;
                          font-size:14px;
                          margin-right:8px">染</div>
                        {{itemSon.after_color}}
                      </span>
                    </div>
                    <div class="tcol">{{itemSon.number}}{{itemChild.unit||'kg'}}</div>
                  </div>
                  <!-- 没染完 -->
                  <div class="trow"
                    v-if="itemChild.process_info.filter((item)=>item.process==='染色').length>0&&itemChild.process_info.filter((item)=>item.process==='染色').reduce((total,cur)=>(total+cur.number),0)<itemChild.number">
                    <div class="tcol">
                      <span style="display:flex;align-items:center">
                        <div class="backHoverOrange"
                          style="display: inline-block;
                          width: 22px;
                          line-height: 22px;
                          height: 22px;
                          text-align: center;
                          border-radius: 50%;
                          color:white;
                          font-size:14px;
                          margin-right:8px">调</div>{{itemChild.material_color}}
                      </span>
                    </div>
                    <div class="tcol">{{itemChild.number - itemChild.process_info.filter((item)=>item.process==='染色').reduce((total,cur)=>(total+cur.number),0)}}{{itemChild.unit||'kg'}}</div>
                  </div>
                </div>
                <div class="tcol">{{itemChild.final_push_number||0}}{{itemChild.unit||'kg'}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttonList">
        <div class="btn backHoverBlue">
          <i class="el-icon-s-grid"></i>
          <span class="text">调取单操作</span>
        </div>
        <div class="otherInfoCtn">
          <div class="otherInfo">
            <div class="btn backHoverBlue"
              @click="goStock(7)">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">调取入库</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module clearfix"
      v-show="materialBSDQList.length>0">
      <div class="titleCtn">
        <div class="title">补纱调取单入库</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">调取单号</div>
            <div class="tcol">来源仓库</div>
            <div class="tcol noPad"
              style="flex:5">
              <div class="trow">
                <div class="tcol">原料名称</div>
                <div class="tcol">调取属性</div>
                <div class="tcol">批号/缸号/色号</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow">
                    <div class="tcol">调取/染色颜色</div>
                    <div class="tcol">调取/已加工数量</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="item in materialBSDQList"
            :key="item.id">
            <div class="tcol">
              <el-checkbox v-model="item.checkAll"
                @change="getAllCheck($event,item)">{{item.code}}</el-checkbox>
            </div>
            <div class="tcol">{{item.store}}/{{item.secondary_store}}</div>
            <div class="tcol noPad"
              style="flex:5"
              v-for="(itemChild,indexChild) in item.info_data"
              :key="indexChild">
              <div class="trow">
                <div class="tcol">
                  <el-checkbox v-model="itemChild.check"
                    @change="$forceUpdate()">{{itemChild.material_name}}
                  </el-checkbox>
                </div>
                <div class="tcol">{{itemChild.attribute}}</div>
                <div class="tcol">{{itemChild.batch_code}}/{{itemChild.vat_code}}/{{itemChild.color_code}}</div>
                <div class="tcol noPad"
                  style="flex:2">
                  <div class="trow"
                    v-if="itemChild.process_info.filter((item)=>item.process==='染色').length===0">
                    <div class="tcol">
                      <span style="display:flex;align-items:center">
                        <div class="backHoverOrange"
                          style="display: inline-block;
                          width: 22px;
                          line-height: 22px;
                          height: 22px;
                          text-align: center;
                          border-radius: 50%;
                          color:white;
                          font-size:14px;
                          margin-right:8px">调</div>{{itemChild.material_color}}
                      </span>
                    </div>
                    <div class="tcol">{{itemChild.number}}{{itemChild.unit||'kg'}}</div>
                  </div>
                  <div class="trow"
                    v-else
                    v-for="(itemSon,indexSon) in itemChild.process_info.filter((item)=>item.process==='染色')"
                    :key="indexSon">
                    <div class="tcol">
                      <span style="display:flex;align-items:center">
                        <div class="backHoverGreen"
                          style="display: inline-block;
                          width: 22px;
                          line-height: 22px;
                          height: 22px;
                          text-align: center;
                          border-radius: 50%;
                          color:white;
                          font-size:14px;
                          margin-right:8px">染</div>
                        {{itemSon.after_color}}
                      </span>
                    </div>
                    <div class="tcol">{{itemSon.number}}{{itemChild.unit||'kg'}}</div>
                  </div>
                  <!-- 没染完 -->
                  <div class="trow"
                    v-if="itemChild.process_info.filter((item)=>item.process==='染色').length>0&&itemChild.process_info.filter((item)=>item.process==='染色').reduce((total,cur)=>(total+cur.number),0)<itemChild.number">
                    <div class="tcol">
                      <span style="display:flex;align-items:center">
                        <div class="backHoverOrange"
                          style="display: inline-block;
                          width: 22px;
                          line-height: 22px;
                          height: 22px;
                          text-align: center;
                          border-radius: 50%;
                          color:white;
                          font-size:14px;
                          margin-right:8px">调</div>{{itemChild.material_color}}
                      </span>
                    </div>
                    <div class="tcol">{{itemChild.number - itemChild.process_info.filter((item)=>item.process==='染色').reduce((total,cur)=>(total+cur.number),0)}}{{itemChild.unit||'kg'}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="buttonList">
        <div class="btn backHoverBlue">
          <i class="el-icon-s-grid"></i>
          <span class="text">补纱单操作</span>
        </div>
        <div class="otherInfoCtn">
          <div class="otherInfo">
            <div class="btn backHoverBlue"
              @click="goStock(8)">
              <svg class="iconFont"
                aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">调取入库</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 物料加工单暂时没人管出入库，隐藏 -->
    <div class="module clearfix"
      v-show="false">
      <div class="titleCtn">
        <div class="title">物料加工单</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">加工单号</div>
            <div class="tcol">加工单位</div>
            <div class="tcol">工序</div>
            <div class="tcol noPad"
              style="flex:4">
              <div class="trow">
                <div class="tcol">纱线名称</div>
                <div class="tcol">加工详情</div>
                <div class="tcol">加工数量</div>
              </div>
            </div>
            <div class="tcol">截止日期</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="itemProcess in materialProcessList"
            :key="itemProcess.id">
            <div class="tcol">
              <el-checkbox v-model="itemProcess.checkAll"
                @change="getAllCheck($event,itemProcess)">{{itemProcess.code}}
              </el-checkbox>
            </div>
            <div class="tcol">{{itemProcess.client_name}}</div>
            <div class="tcol">{{itemProcess.process}}</div>
            <div class="tcol noPad"
              style="flex:4">
              <div class="trow"
                v-for="(itemMat,indexMat) in itemProcess.info_data"
                :key="indexMat">
                <div class="tcol">
                  <el-checkbox v-model="itemMat.check"
                    @change="$forceUpdate()">{{itemMat.material_order_name}}
                  </el-checkbox>
                </div>
                <div class="tcol">
                  <div class="changeTo"
                    v-if="itemProcess.process==='染色'">
                    <span>白胚</span>
                    <i class="el-icon-s-unfold blue"
                      style="margin:0 4px"></i>
                    <span>{{itemMat.after_color}}</span>
                  </div>
                  <div class="changeTo"
                    v-if="itemProcess.process==='倒纱'">
                    <span>{{itemMat.before_attribute}}</span>
                    <i class="el-icon-s-unfold blue"
                      style="margin:0 4px"></i>
                    <span>{{itemMat.after_attribute}}</span>
                  </div>
                </div>
                <div class="tcol">{{itemMat.number}}{{itemMat.unit}}</div>
              </div>
            </div>
            <div class="tcol">{{itemProcess.delivery_time}}</div>
          </div>
          <div class="trow"
            v-if="materialProcessList.length===0">
            <div class="tcol gray"
              style="text-align:center">暂无单据</div>
          </div>
        </div>
      </div>
      <div class="buttonList">
        <div class="btn backHoverBlue"
          @click="goStock(3)">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-xiugaidingdan"></use>
          </svg>
          <span class="text">中转出库</span>
        </div>
      </div>
    </div>
    <div class="module clearfix">
      <div class="titleCtn">
        <div class="title">半成品加工单最终出库</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">加工单号</div>
            <div class="tcol">加工单位</div>
            <div class="tcol noPad"
              style="flex:5">
              <div class="trow">
                <div class="tcol">纱线名称</div>
                <div class="tcol">纱线颜色</div>
                <div class="tcol">所需数量</div>
                <div class="tcol">出库数量</div>
                <div class="tcol">结余入库数</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="item in productionPlanList"
            :key="item.id"
            v-show="item.material_info_data.length>0">
            <div class="tcol">
              <el-checkbox v-model="item.checkAll"
                @change="getAllCheck($event,item)">{{item.code}}</el-checkbox>
            </div>
            <div class="tcol">
              <span>{{item.client_name}}</span>
              <span class="green">({{item.process_name}})</span>
            </div>
            <div class="tcol noPad"
              style="flex:5">
              <template v-if="item.material_info_data.length===0">
                <span class="gray"
                  style="text-align:center">不需要计划物料</span>
              </template>
              <div class="trow"
                v-for="(itemMat,indexMat) in item.material_info_data"
                :key="indexMat + 'plan'">
                <div class="tcol">
                  <el-checkbox v-model="itemMat.check"
                    @change="$forceUpdate()">
                    <span style="display:flex;align-items:center">
                      <div class="backHoverOrange"
                        style="display: inline-block;
                          width: 22px;
                          line-height: 22px;
                          height: 22px;
                          text-align: center;
                          border-radius: 50%;
                          color:white;
                          font-size:14px;
                          margin-right:8px">计</div>{{itemMat.material_name}}
                    </span>
                  </el-checkbox>
                </div>
                <div class="tcol">{{itemMat.material_color}}</div>
                <div class="tcol">{{itemMat.number}}{{itemMat.unit}}</div>
                <div class="tcol">{{itemMat.final_pop_number||0}}{{itemMat.unit}}</div>
                <div class="tcol">暂无数据</div>
              </div>
              <!-- 补纱单 -->
              <template v-for="(itemMat) in item.sup_data">
                <div v-for="itemChild in itemMat.info_data"
                  :key="itemChild.id"
                  class="trow">
                  <div class="tcol">
                    <el-checkbox v-model="itemChild.check"
                      @change="$forceUpdate()">
                      <span style="display:flex;align-items:center">
                        <div class="backHoverGreen"
                          style="display: inline-block;
                          width: 22px;
                          line-height: 22px;
                          height: 22px;
                          text-align: center;
                          border-radius: 50%;
                          color:white;
                          font-size:14px;
                          margin-right:8px">补</div>{{itemChild.material_name}}
                      </span>
                    </el-checkbox>
                  </div>
                  <div class="tcol">{{itemChild.material_color}}</div>
                  <div class="tcol">{{itemChild.number}}{{itemChild.unit||'kg'}}</div>
                  <div class="tcol">{{itemChild.final_pop_number || 0}}{{itemChild.unit||'kg'}}</div>
                  <div class="tcol">暂无数据</div>
                </div>
              </template>
            </div>
          </div>
          <div class="trow"
            v-if="productionPlanList.length===0">
            <div class="tcol gray"
              style="text-align:center">暂无单据</div>
          </div>
        </div>
      </div>
      <div class="buttonList">
        <div class="btn backHoverOrange"
          :class="{'backGray':productionPlanList.filter((item) => {return item.material_info_data.some((itemChild) => itemChild.check) || (item.sup_data&&item.sup_data.some((itemChild) => {return itemChild.info_data.some((itemSon) => itemSon.check)}))}).length!==1}"
          @click="goStock(6)"
          style="margin-right:12px">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-xiugaidingdan"></use>
          </svg>
          <span class="text">结余入库</span>
        </div>
        <div class="btn backHoverBlue"
          :class="{'backGray':productionPlanList.filter((item) => {
                return (
                  item.material_info_data.some((itemChild) => itemChild.check) ||
                 item.sup_data&&( item.sup_data.some((itemChild) => {
                    return itemChild.info_data.some((itemSon) => itemSon.check)
                  }))
                )
              }).length!==1}"
          @click="goStock(5)">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-xiugaidingdan"></use>
          </svg>
          <span class="text">生产出库</span>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">出入库单据</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol">单据编号</div>
            <div class="tcol">出入库类型</div>
            <div class="tcol">库存转移</div>
            <div class="tcol noPad"
              style="flex:5">
              <div class="trow">
                <div class="tcol">纱线名称</div>
                <div class="tcol">颜色/属性</div>
                <div class="tcol">批号/缸号</div>
                <div class="tcol">色号</div>
                <div class="tcol">数量</div>
              </div>
            </div>
            <div class="tcol">操作人</div>
            <div class="tcol">操作日期</div>
            <div class="tcol">操作</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow"
            v-for="item in materialStockList"
            :key="item.id">
            <div class="tcol">{{item.code}}</div>
            <div class="tcol"
              :class="item.action_type|materialStockTypeClassFilter">{{item.action_type|materialStockTypeFilter}}</div>
            <div class="tcol">
              <template v-if="item.action_type===1">
                <div class="changeCtn">
                  <span>{{item.client_name}}</span>
                  <span class="el-icon-s-unfold green"></span>
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                </div>
              </template>
              <template v-else-if="item.action_type===2 || item.action_type===4">
                <div class="changeCtn">
                  <span>{{item.client_name}}</span>
                  <span class="el-icon-s-unfold green"></span>
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                </div>
              </template>
              <template v-else-if="item.action_type===3 || item.action_type===5 || item.action_type===10">
                <div class="changeCtn">
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                  <span class="el-icon-s-unfold orange"></span>
                  <span>{{item.client_name}}</span>
                </div>
              </template>
              <template v-else-if="item.action_type===6 || item.action_type===9 || item.action_type===11 || item.action_type===12">
                <div class="changeCtn">
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                </div>
              </template>
              <template v-else-if="item.action_type===7">
                <div class="changeCtn">
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                  <span class="el-icon-s-unfold orange"></span>
                  <span>{{item.move_store}}/{{item.move_secondary_store}}</span>
                </div>
              </template>
              <template v-else-if="item.action_type===8">
                <div class="changeCtn">
                  <span>{{item.store}}/{{item.secondary_store}}</span>
                  <span class="el-icon-s-unfold green"></span>
                  <span>{{item.move_store}}/{{item.move_secondary_store}}</span>
                </div>
              </template>
            </div>
            <div class="tcol noPad"
              style="flex:5">
              <div class="trow"
                v-for="itemChild in item.info_data"
                :key="itemChild.id">
                <div class="tcol">{{itemChild.material_name}}</div>
                <div class="tcol">{{itemChild.material_color}}/{{itemChild.attribute}}</div>
                <div class="tcol"
                  :class="itemChild.batch_code||itemChild.vat_code?'':'gray'">{{itemChild.batch_code||'无'}}/{{itemChild.vat_code||'无'}}</div>
                <div class="tcol"
                  :class="itemChild.color_code?'':'gray'">{{itemChild.color_code||'无'}}</div>
                <div class="tcol">{{itemChild.number}}{{itemChild.unit || 'kg'}}</div>
              </div>
            </div>
            <div class="tcol">{{item.user_name}}</div>
            <div class="tcol">{{item.created_at.slice(0,10)}}</div>
            <div class="tcol oprCtn">
              <div class="opr hoverRed"
                @click="deleteMaterialStockList(item.id)">删除</div>
              <div class="opr hoverBlue"
                @click="$openUrl('/store/materialLogPrint?id='+item.id + '&type=' + item.action_type)">打印</div>
            </div>
          </div>
          <div class="trow"
            v-if="materialStockList.length===0">
            <div class="tcol gray"
              style="text-align:center">暂无单据</div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="materialStockFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">{{stockTypeList[materialStockInfo.action_type - 1].name}}</span>
          <div class="closeCtn"
            @click="closeStock">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="editCtn">
            <div class="row">
              <div class="col">
                <div class="label">
                  <span class="text">选择仓库</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="materialStockInfo.stock_id"
                    placeholder="本厂仓库/主仓库（默认)"
                    disabled></el-select>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">单据编号</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="materialStockInfo.rel_doc_code"
                    placeholder="默认"
                    disabled></el-input>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">出入库类型</span>
                  <span class="explanation">(默认)</span>
                </div>
                <div class="info elCtn">
                  <el-select v-model="materialStockInfo.action_type"
                    placeholder="默认"
                    disabled>
                    <el-option v-for="item in stockTypeList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.name"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in materialStockInfo.info_data"
              :key="index">
              <!-- 入库操作 -->
              <template v-if="materialStockInfo.action_type!==3 && materialStockInfo.action_type!==5">
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">单据物料</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-select :class="{'error':mustFlag&&!item.rel_doc_info_id}"
                          placeholder="单据物料"
                          v-model="item.rel_doc_info_id"
                          @change="getMatId($event,item)">
                          <el-option v-for="item in materialStockInfo.selectList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">属性</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-autocomplete class="once"
                          v-model="item.attribute"
                          :fetch-suggestions="searchAttribute"
                          placeholder="属性"></el-autocomplete>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">颜色</span>
                        <span class="explanation">(必选)</span>
                      </div>
                      <div class="info elCtn">
                        <el-autocomplete v-model="item.material_color"
                          :fetch-suggestions="searchColor"
                          placeholder="颜色"></el-autocomplete>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">批号</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="批号"
                          v-model="item.batch_code"></el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">缸号</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="缸号"
                          v-model="item.vat_code"></el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">色号</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="色号"
                          v-model="item.color_code"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">数量</span>
                        <span class="explanation">(必填)</span>
                      </div>
                      <div class="info elCtn">
                        <el-input :class="{'error':mustFlag&&!item.number}"
                          placeholder="数量"
                          v-model="item.number">
                          <template slot="append">{{item.unit}}</template>
                        </el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">件数</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="数量"
                          v-model="item.item">
                          <template slot="append">件</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <!-- 出库操作,必须从入库物料里面选 -->
              <template v-else>
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">单据物料</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select :class="{'error':mustFlag&&!item.rel_doc_info_id}"
                      placeholder="单据物料"
                      v-model="item.rel_doc_info_id"
                      @change="getMatId($event,item)">
                      <el-option v-for="item in materialStockInfo.selectList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="index===0">
                    <span class="text">出库物料</span>
                    <span class="explanation">(必选)</span>
                  </div>
                  <div class="info elCtn">
                    <el-select v-model="item.out_id"
                      placeholder="请选择已入库物料进行出库"
                      @change="getStoreOut($event,item)">
                      <el-option v-for="(item,index) in item.stockInList"
                        :key="index"
                        :value="item.material_id + '分隔符' + item.material_color + '分隔符' + item.attribute+ '分隔符' + item.batch_code+ '分隔符' + item.vat_code+ '分隔符' + item.color_code"
                        :label="item.material_name + '/' + item.material_color + '/' + item.attribute + '/' + (item.batch_code||'无批号')+ '/' + (item.vat_code||'无缸号')+ '/' + (item.color_code||'无色号')"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="spaceBetween">
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">数量</span>
                        <span class="explanation">(必填)</span>
                      </div>
                      <div class="info elCtn">
                        <el-input :class="{'error':mustFlag&&!item.number}"
                          placeholder="数量"
                          v-model="item.number"></el-input>
                      </div>
                    </div>
                    <div class="once">
                      <div class="label"
                        v-if="index===0">
                        <span class="text">件数</span>
                        <span class="explanation">(必填)</span>
                      </div>
                      <div class="info elCtn">
                        <el-input placeholder="件数"
                          v-model="item.item"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div class="opr hoverBlue"
                v-if="index===0"
                @click="$addItem(materialStockInfo.info_data,{
                  material_id: '',
                  material_color: '',
                  color_code: '',
                  batch_code: '',
                  vat_code: '',
                  attribute: '',
                  number: '',
                  item: '', // 件数
                  rel_doc_info_id: '' // 采购单调取单加工单子项id
                })">添加</div>
              <div class="opr hoverRed"
                v-if="index>0"
                @click="$deleteItem(materialStockInfo.info_data,index)">删除</div>
            </div>
            <div class="row">
              <div class="col"
                style="max-width:322px">
                <div class="label">
                  <span class="text">选择日期</span>
                  <span class="explanation">(必选)</span>
                </div>
                <div class="info elCtn">
                  <el-date-picker style="width:100%"
                    class="once"
                    placeholder="入库日期"
                    value-format="yyyy-MM-dd"
                    v-model="materialStockInfo.complete_time"></el-date-picker>
                </div>
              </div>
              <div class="col">
                <div class="label">
                  <span class="text">备注信息</span>
                </div>
                <div class="info elCtn">
                  <el-input v-model="materialStockInfo.desc"
                    placeholder="备注信息"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="closeStock">取消</span>
          <span class="btn backHoverBlue"
            @click="saveMaterialStock">确认</span>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
    <!-- 结余入库 -->
    <store-surplus @afterSave="storeSurplusFlag=false;init()"
      @close="storeSurplusFlag=false"
      :materialList="storeSurplusInfo.materialList"
      :orderId="storeSurplusInfo.order_id"
      :orderCode="storeSurplusInfo.order_code"
      :show="storeSurplusFlag"></store-surplus>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MaterialOrderInfo } from '@/types/materialOrder'
import { MaterialStockInfo, MaterialStockLog } from '@/types/materialStock'
import { ProductionPlanInfo } from '@/types/productionPlan'
import { MaterialProcessInfo } from '@/types/materialProcess'
import { materialOrder, store, materialStock, productionPlan, order } from '@/assets/js/api'
import { stockType, yarnAttributeArr } from '@/assets/js/dictionary'
import { OrderInfo, OrderTime } from '@/types/order'
interface OrderDetail extends OrderInfo {
  time_data: OrderTime[]
}
export default Vue.extend({
  data(): {
    orderInfo: OrderDetail
    materialProcessList: MaterialProcessInfo[]
    materialOrderList: MaterialOrderInfo[]
    materialStockInfo: MaterialStockInfo
    materialStockList: MaterialStockInfo[]
    materialJHDQList: MaterialStockInfo[]
    materialBSDQList: MaterialStockInfo[]
    productionPlanList: ProductionPlanInfo[]
    [propName: string]: any
  } {
    return {
      loading: true,
      saveLock: false,
      mustFlag: false,
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
      orderIndex: 0,
      order_id: '',
      materialOrderList: [],
      materialProcessList: [],
      stockTypeList: stockType,
      materialStockFlag: false,
      materialStockInfo: {
        material_type: 1,
        order_id: '',
        action_type: 1,
        rel_doc_type: '',
        rel_doc_id: '',
        rel_doc_code: '',
        complete_time: this.$getDate(new Date()),
        client_id: '',
        desc: '',
        store_id: -1,
        secondary_store_id: -1,
        info_data: [
          {
            material_id: '',
            material_color: '',
            color_code: '',
            batch_code: '',
            vat_code: '',
            attribute: '',
            number: '',
            item: '', // 件数
            unit: 'kg',
            rel_doc_info_id: '' // 采购单调取单加工单子项id
          }
        ],
        selectList: []
      },
      materialStockList: [],
      materialJHDQList: [], // 计划调取单，实际上和出入库日志是同一个接口
      materialBSDQList: [], // 补纱调取单，实际上和出入库日志是同一个接口
      productionPlanList: [],
      storeInList: [],
      yarnAttributeList: yarnAttributeArr,
      storeSurplusFlag: false,
      storeSurplusInfo: {
        materialList: [],
        order_id: '',
        order_code: ''
      }
    }
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        materialOrder.list({
          order_id: Number(this.order_id)
        }),
        materialStock.list({
          order_id: Number(this.order_id)
        }),
        productionPlan.list({
          order_id: Number(this.order_id)
        })
      ]).then((res) => {
        this.materialOrderList = res[0].data.data
        this.materialProcessList = []
        res[0].data.data.forEach((item: any) => {
          this.materialProcessList = this.materialProcessList.concat(item.process_info)
        })
        // 出入库日志把调取单过滤掉
        this.materialStockList = res[1].data.data.filter(
          (item: any) => item.action_type !== 10 && item.action_type !== 12
        )
        this.materialJHDQList = res[1].data.data.filter((item: any) => item.action_type === 10) // 计划调取
        console.log(this.materialJHDQList)
        this.materialBSDQList = res[1].data.data.filter((item: any) => item.action_type === 12) // 补纱调取
        // 统计入库日志用于出库
        const flattenStock = this.$flatten(
          this.$flatten(
            this.materialStockList.map((item) => {
              item.info_data.forEach((itemChild) => {
                // @ts-ignore
                delete itemChild.id
              })
              return item
            })
          )
        ).filter((item) => item.action_type !== 3 && item.action_type !== 5)
        this.storeInList = this.$mergeData(flattenStock, {
          mainRule: [
            'material_name',
            'material_color',
            'attribute',
            'batch_code',
            'vat_code',
            'color_code',
            'material_id'
          ],
          otherRule: [{ name: 'number', type: 'add' }]
        })
        this.productionPlanList = res[2].data.data
        this.loading = false
      })
    },
    // 原料颜色搜索
    searchColor(str: string, cb: any) {
      let results = str ? this.yarnColorList.filter(this.createFilter(str)) : this.yarnColorList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 原料属性搜索
    searchAttribute(str: string, cb: any) {
      let results = str ? this.yarnAttributeList.filter(this.createFilter(str)) : this.yarnAttributeList.slice(0, 10)
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    getAllCheck(ev: boolean, info: any) {
      console.log(info)
      info.info_data
        ? info.info_data.forEach((item: any) => (item.check = ev))
        : info.material_info_data.forEach((item: any) => (item.check = ev))
      if (info.sup_data && info.sup_data.length > 0) {
        info.sup_data.forEach((item: any) => {
          item.info_data.forEach((itemChild: any) => (itemChild.check = ev))
        })
      }
    },
    goStock(type: number) {
      if (type === 1 || type === 4) {
        this.getOrderInfo(type)
      } else if (type === 3) {
        this.getProcessInfo(type)
      } else if (type === 5) {
        this.getInspectionInfo()
      } else if (type === 7 || type === 8) {
        this.getDiaoquInfo(type)
      } else if (type === 6) {
        // 结余入库用组件的逻辑
        const checkLength = this.productionPlanList.filter((item) => {
          return (
            item.material_info_data.some((itemChild) => itemChild.check) ||
            item.sup_data!.some((itemChild) => {
              return itemChild.info_data.some((itemSon) => itemSon.check)
            })
          )
        }).length
        if (checkLength > 1 || checkLength === 0) {
          this.$message.error('只能选择一张加工单进行出库操作')
          return
        }
        this.storeSurplusFlag = true
        this.storeSurplusInfo.order_code = this.orderInfo.code
        this.storeSurplusInfo.order_id = this.orderInfo.id
        this.storeSurplusInfo.materialList = []

        this.productionPlanList.forEach((item) => {
          item.material_info_data.forEach((itemChild) => {
            if (itemChild.check) {
              // 如果需要记录是那一张加工单结余可能会有用的字段
              // this.materialStockInfo.client_id = item.client_id
              // this.materialStockInfo.rel_doc_code = item.code
              // this.materialStockInfo.rel_doc_id = item.id as number
              this.storeSurplusInfo.materialList.push({
                material_color: itemChild.material_color,
                material_id: itemChild.material_id,
                attribute: '筒纱',
                number: itemChild.number,
                unit: itemChild.unit
              })
            }
          })
          item.sup_data!.forEach((itemSup) => {
            itemSup.info_data.forEach((itemChild) => {
              if (itemChild.check) {
                this.storeSurplusInfo.materialList.push({
                  material_color: itemChild.material_color,
                  material_id: itemChild.material_id,
                  attribute: '筒纱',
                  number: itemChild.number,
                  unit: itemChild.unit
                })
              }
            })
          })
        })
      }
    },
    // 采购单中转入库和最终入库初始化
    getOrderInfo(type: 1 | 4) {
      const checkLength = this.materialOrderList.filter((item) => {
        return item.info_data.some((itemChild) => itemChild.check)
      }).length
      if (checkLength === 0) {
        this.$message.error('请选择采购单进行入库操作')
        return
      }
      if (checkLength > 1) {
        this.$message.error('只能选择一张采购单进行入库操作')
        return
      }
      this.materialStockInfo.action_type = type
      this.materialStockInfo.selectList = []
      this.materialOrderList.forEach((item) => {
        item.info_data.forEach((itemChild) => {
          if (itemChild.check) {
            this.materialStockInfo.rel_doc_code = item.code
            this.materialStockInfo.rel_doc_id = item.id as number
            this.materialStockInfo.selectList!.push({
              value: itemChild.id as number,
              name:
                itemChild.material_name + '/' + (itemChild.material_color || '未知颜色') + '/' + itemChild.attribute,
              material_color: itemChild.material_color,
              material_id: itemChild.material_id,
              attribute: itemChild.attribute,
              yarn_type: itemChild.yarn_type,
              number: itemChild.number,
              unit: itemChild.unit
            })
          }
        })
      })
      if (type === 1) {
        this.materialStockInfo.info_data = this.materialStockInfo.selectList.map((item) => {
          return {
            material_id: item.material_id as number,
            material_color: item.material_color as string,
            color_code: '',
            batch_code: '',
            vat_code: '',
            attribute: item.attribute as string,
            number: item.number as string,
            item: '', // 件数
            unit: item.unit,
            rel_doc_info_id: item.value // 采购单调取单加工单子项id
          }
        })
      } else {
        this.materialStockInfo.info_data = []
        this.materialOrderList.forEach((item) => {
          item.info_data.forEach((itemChild) => {
            if (itemChild.check) {
              this.materialStockInfo.rel_doc_code = item.code
              this.materialStockInfo.rel_doc_id = item.id as number
              if (itemChild.process_info!.filter((item) => item.process === '染色').length > 0) {
                itemChild
                  .process_info!.filter((item) => item.process === '染色')
                  .forEach((itemProcess) => {
                    this.materialStockInfo.info_data.push({
                      yarn_type: itemChild.yarn_type,
                      material_id: itemChild.material_id as number,
                      material_color: itemProcess.after_color,
                      color_code: '',
                      batch_code: '',
                      vat_code: '',
                      attribute: itemChild.attribute === '面料' ? '面料' : '筒纱',
                      number: itemProcess.number,
                      item: '', // 件数
                      unit: itemProcess.unit,
                      rel_doc_info_id: itemChild.id // 采购单调取单加工单子项id
                    })
                  })
                if (
                  itemChild.process_info!.filter((item) => item.process === '染色').length > 0 &&
                  itemChild
                    .process_info!.filter((item) => item.process === '染色')
                    .reduce((total, cur) => total + Number(cur.number), 0) < Number(itemChild.number)
                ) {
                  this.materialStockInfo.info_data.push({
                    yarn_type: itemChild.yarn_type,
                    material_id: itemChild.material_id as number,
                    material_color: itemChild.material_color as string,
                    color_code: '',
                    batch_code: '',
                    vat_code: '',
                    attribute: itemChild.attribute === '面料' ? '面料' : '筒纱',
                    number:
                      Number(itemChild.number) -
                      itemChild
                        .process_info!.filter((item) => item.process === '染色')
                        .reduce((total, cur) => total + cur.number, 0),
                    item: '', // 件数
                    unit: itemChild.unit,
                    rel_doc_info_id: itemChild.id // 采购单调取单加工单子项id
                  })
                }
              } else {
                this.materialStockInfo.info_data.push({
                  yarn_type: itemChild.yarn_type,
                  material_id: itemChild.material_id as number,
                  material_color: itemChild.material_color as string,
                  color_code: '',
                  batch_code: '',
                  vat_code: '',
                  attribute: itemChild.attribute === '面料' ? '面料' : '筒纱',
                  number: itemChild.number as string,
                  item: '', // 件数
                  unit: itemChild.unit,
                  rel_doc_info_id: itemChild.id // 采购单调取单加工单子项id
                })
              }
            }
          })
        })
      }
      this.materialStockFlag = true
    },
    // 入库选采购单的时候给material_id赋值
    getMatId(id: number, info: MaterialStockLog) {
      const finded: any = this.materialStockInfo.selectList!.find((itemFind) => itemFind.value === id)
      info.yarn_type = finded.yarn_type as number
      info.material_id = finded.material_id as number
      info.unit = finded.unit
      console.log(finded)
    },
    // 出库选入库信息的时候赋值
    getStoreOut(value: string, info: MaterialStockLog) {
      const valueArr = value.split('分隔符')
      info.material_id = valueArr[0]
      info.material_color = valueArr[1]
      info.attribute = valueArr[2]
      info.batch_code = valueArr[3]
      info.vat_code = valueArr[4]
      info.color_code = valueArr[5]
    },
    // 加工单中转出库初始化
    getProcessInfo(type: 3) {
      const checkLength = this.materialProcessList.filter((item) => {
        return item.info_data.some((itemChild) => itemChild.check)
      }).length
      if (checkLength === 0) {
        this.$message.error('请选择加工单进行出库操作')
        return
      }
      if (checkLength > 1) {
        this.$message.error('只能选择一张加工单进行出库操作')
        return
      }
      this.materialStockInfo.action_type = type
      this.materialStockInfo.selectList = []
      this.materialProcessList.forEach((item) => {
        item.info_data.forEach((itemChild) => {
          if (itemChild.check) {
            this.materialStockInfo.rel_doc_code = item.code
            this.materialStockInfo.rel_doc_id = item.id as number
            this.materialStockInfo.selectList!.push({
              value: itemChild.id as number,
              name:
                itemChild.material_order_name +
                '/' +
                (itemChild.material_color || itemChild.after_color || '未知颜色') +
                '/' +
                (itemChild.after_attribute || '未知属性'),
              material_color: itemChild.material_color || itemChild.after_color,
              material_id: itemChild.order_material_id,
              attribute: itemChild.after_attribute,
              number: itemChild.number,
              unit: itemChild.unit
            })
          }
        })
      })
      this.materialStockInfo.info_data = this.materialStockInfo.selectList.map((item) => {
        return {
          stockInList: this.storeInList.filter((itemFind: any) => itemFind.material_id === item.material_id),
          material_id: '',
          material_color: '',
          color_code: '',
          batch_code: '',
          vat_code: '',
          attribute: '',
          number: item.number as string,
          item: '', // 件数
          unit: item.unit,
          rel_doc_info_id: item.value // 采购单调取单加工单子项id
        }
      })
      console.log(this.materialStockInfo.info_data)
      this.materialStockFlag = true
    },
    // 半成品加工出库
    getInspectionInfo() {
      const checkLength = this.productionPlanList.filter((item) => {
        return (
          item.material_info_data.some((itemChild) => itemChild.check) ||
          item.sup_data!.some((itemChild) => {
            return itemChild.info_data.some((itemSon) => itemSon.check)
          })
        )
      }).length
      if (checkLength === 0) {
        this.$message.error('请选择加工单进行出库操作')
        return
      }
      if (checkLength > 1) {
        this.$message.error('只能选择一张加工单进行出库操作')
        return
      }
      this.materialStockInfo.action_type = 5
      this.materialStockInfo.selectList = []
      this.productionPlanList.forEach((item) => {
        item.material_info_data.forEach((itemChild) => {
          if (itemChild.check) {
            this.materialStockInfo.client_id = item.client_id
            this.materialStockInfo.rel_doc_code = item.code
            this.materialStockInfo.rel_doc_id = item.id as number
            this.materialStockInfo.selectList!.push({
              value: itemChild.id as number,
              name: itemChild.material_name + '/' + (itemChild.material_color || '未知颜色'),
              material_color: itemChild.material_color,
              material_id: itemChild.material_id,
              attribute: itemChild.yarn_type === 1 ? '筒纱' : '面料', // 根据最终入库是筒纱推测最终出库也是筒纱
              number: itemChild.number,
              unit: itemChild.unit
            })
          }
        })
        item.sup_data!.forEach((itemSup) => {
          itemSup.info_data.forEach((itemChild) => {
            if (itemChild.check) {
              this.materialStockInfo.client_id = itemSup.client_id
              this.materialStockInfo.rel_doc_code = item.code
              this.materialStockInfo.rel_doc_id = item.id as number
              this.materialStockInfo.selectList!.push({
                value: itemChild.id as number,
                name: itemChild.material_name + '/' + (itemChild.material_color || '未知颜色'),
                material_color: itemChild.material_color,
                material_id: itemChild.material_id,
                attribute: itemChild.yarn_type === 1 ? '筒纱' : '面料', // 根据最终入库是筒纱推测最终出库也是筒纱
                number: itemChild.number,
                unit: itemChild.unit
              })
            }
          })
        })
      })
      this.materialStockInfo.info_data = []
      this.materialStockInfo.selectList.forEach((item) => {
        const inList = this.storeInList.filter(
          (itemFind: any) =>
            itemFind.material_id === item.material_id &&
            itemFind.material_color === item.material_color &&
            itemFind.attribute === '筒纱'
        )
        console.log(inList)
        if (inList.length === 0) {
          this.materialStockInfo.info_data.push({
            stockInList: inList,
            material_id: '',
            material_color: '',
            color_code: '',
            batch_code: '',
            vat_code: '',
            attribute: '',
            number: item.number as string,
            item: '', // 件数
            unit: item.unit,
            rel_doc_info_id: item.value,
            out_id: ''
          })
        } else {
          inList.forEach((itemStore: any) => {
            this.materialStockInfo.info_data.push({
              stockInList: inList,
              material_id: itemStore.material_id,
              material_color: itemStore.material_color,
              color_code: itemStore.color_code,
              batch_code: itemStore.batch_code,
              vat_code: itemStore.vat_code,
              attribute: itemStore.attribute,
              number: itemStore.number as string,
              item: '', // 件数
              unit: item.unit,
              rel_doc_info_id: item.value,
              out_id:
                itemStore.material_id +
                '分隔符' +
                itemStore.material_color +
                '分隔符' +
                itemStore.attribute +
                '分隔符' +
                itemStore.batch_code +
                '分隔符' +
                itemStore.vat_code +
                '分隔符' +
                itemStore.color_code
            })
          })
        }
      })
      this.materialStockFlag = true
    },
    // 调取单入库
    getDiaoquInfo(type: 7 | 8) {
      if (type === 7) {
        const checkLength = this.materialJHDQList.filter((item) => {
          return item.info_data.some((itemChild) => itemChild.check)
        }).length
        if (checkLength === 0) {
          this.$message.error('请选择调取单进行入库操作')
          return
        }
        if (checkLength > 1) {
          this.$message.error('只能选择一张调取单进行入库操作')
          return
        }
        this.materialStockInfo.action_type = 11
        this.materialStockInfo.selectList = []
        this.materialStockInfo.info_data = []
        this.materialJHDQList.forEach((item) => {
          item.info_data.forEach((itemChild) => {
            if (itemChild.check) {
              this.materialStockInfo.selectList!.push({
                value: itemChild.id as number,
                name: itemChild.material_name + '/' + (itemChild.material_color || '未知颜色'),
                material_color: itemChild.material_color,
                material_id: itemChild.material_id,
                attribute: itemChild.attribute,
                vat_code: itemChild.vat_code,
                color_code: itemChild.color_code,
                batch_code: itemChild.batch_code,
                number: itemChild.number,
                unit: itemChild.unit
              })
            }
          })
        })
        this.materialJHDQList.forEach((item) => {
          item.info_data.forEach((itemChild) => {
            if (itemChild.check) {
              this.materialStockInfo.rel_doc_code = item.code
              this.materialStockInfo.rel_doc_id = item.id as number
              if (itemChild.process_info!.filter((item) => item.process === '染色').length > 0) {
                itemChild
                  .process_info!.filter((item) => item.process === '染色')
                  .forEach((itemProcess) => {
                    this.materialStockInfo.info_data.push({
                      material_id: itemChild.material_id as number,
                      material_color: itemProcess.after_color,
                      vat_code: itemChild.vat_code,
                      color_code: itemChild.color_code,
                      batch_code: itemChild.batch_code,
                      attribute: '筒纱',
                      number: itemProcess.number,
                      item: '', // 件数
                      unit: itemProcess.unit,
                      rel_doc_info_id: itemChild.id // 采购单调取单加工单子项id
                    })
                  })
                if (
                  itemChild.process_info!.filter((item) => item.process === '染色').length > 0 &&
                  itemChild
                    .process_info!.filter((item) => item.process === '染色')
                    .reduce((total, cur) => total + cur.number, 0) < itemChild.number
                ) {
                  this.materialStockInfo.info_data.push({
                    material_id: itemChild.material_id as number,
                    material_color: itemChild.material_color as string,
                    vat_code: itemChild.vat_code,
                    color_code: itemChild.color_code,
                    batch_code: itemChild.batch_code,
                    attribute: '筒纱',
                    number:
                      Number(itemChild.number) -
                      itemChild
                        .process_info!.filter((item) => item.process === '染色')
                        .reduce((total, cur) => total + cur.number, 0),
                    item: '', // 件数
                    unit: itemChild.unit,
                    rel_doc_info_id: itemChild.id // 采购单调取单加工单子项id
                  })
                }
              } else {
                this.materialStockInfo.info_data.push({
                  stockInList: this.storeInList.filter(
                    (itemFind: any) => itemFind.material_id === itemChild.material_id
                  ),
                  material_id: itemChild.material_id,
                  material_color: itemChild.material_color,
                  attribute: itemChild.attribute,
                  vat_code: itemChild.vat_code,
                  color_code: itemChild.color_code,
                  batch_code: itemChild.batch_code,
                  number: itemChild.number as string,
                  item: '', // 件数
                  unit: itemChild.unit,
                  rel_doc_info_id: itemChild.id
                })
              }
            }
          })
        })
      } else {
        const checkLength = this.materialBSDQList.filter((item) => {
          return item.info_data.some((itemChild) => itemChild.check)
        }).length
        if (checkLength === 0) {
          this.$message.error('请选择调取单进行入库操作')
          return
        }
        if (checkLength > 1) {
          this.$message.error('只能选择一张调取单进行入库操作')
          return
        }
        this.materialStockInfo.action_type = 11
        this.materialStockInfo.selectList = []
        this.materialStockInfo.info_data = []
        this.materialBSDQList.forEach((item) => {
          item.info_data.forEach((itemChild) => {
            if (itemChild.check) {
              this.materialStockInfo.selectList!.push({
                value: itemChild.id as number,
                name: itemChild.material_name + '/' + (itemChild.material_color || '未知颜色'),
                material_color: itemChild.material_color,
                material_id: itemChild.material_id,
                attribute: itemChild.attribute,
                vat_code: itemChild.vat_code,
                color_code: itemChild.color_code,
                batch_code: itemChild.batch_code,
                number: itemChild.number,
                unit: itemChild.unit
              })
            }
          })
        })
        this.materialBSDQList.forEach((item) => {
          item.info_data.forEach((itemChild) => {
            if (itemChild.check) {
              this.materialStockInfo.rel_doc_code = item.code
              this.materialStockInfo.rel_doc_id = item.id as number
              if (itemChild.process_info!.filter((item) => item.process === '染色').length > 0) {
                this.materialStockInfo.info_data = []
                itemChild
                  .process_info!.filter((item) => item.process === '染色')
                  .forEach((itemProcess) => {
                    this.materialStockInfo.info_data.push({
                      material_id: itemChild.material_id as number,
                      material_color: itemProcess.after_color,
                      vat_code: itemChild.vat_code,
                      color_code: itemChild.color_code,
                      batch_code: itemChild.batch_code,
                      attribute: '筒纱',
                      number: itemProcess.number,
                      item: '', // 件数
                      unit: itemProcess.unit,
                      rel_doc_info_id: itemChild.id // 采购单调取单加工单子项id
                    })
                  })
                if (
                  itemChild.process_info!.filter((item) => item.process === '染色').length > 0 &&
                  itemChild
                    .process_info!.filter((item) => item.process === '染色')
                    .reduce((total, cur) => total + cur.number, 0) < itemChild.number
                ) {
                  this.materialStockInfo.info_data.push({
                    material_id: itemChild.material_id as number,
                    material_color: itemChild.material_color as string,
                    vat_code: itemChild.vat_code,
                    color_code: itemChild.color_code,
                    batch_code: itemChild.batch_code,
                    attribute: '筒纱',
                    number:
                      Number(itemChild.number) -
                      itemChild
                        .process_info!.filter((item) => item.process === '染色')
                        .reduce((total, cur) => total + cur.number, 0),
                    item: '', // 件数
                    unit: itemChild.unit,
                    rel_doc_info_id: itemChild.id // 采购单调取单加工单子项id
                  })
                }
              } else {
                this.materialStockInfo.info_data.push({
                  stockInList: this.storeInList.filter(
                    (itemFind: any) => itemFind.material_id === itemChild.material_id
                  ),
                  material_id: itemChild.material_id,
                  material_color: itemChild.material_color,
                  attribute: itemChild.attribute,
                  vat_code: itemChild.vat_code,
                  color_code: itemChild.color_code,
                  batch_code: itemChild.batch_code,
                  number: itemChild.number as string,
                  item: '', // 件数
                  unit: itemChild.unit,
                  rel_doc_info_id: itemChild.id
                })
              }
            }
          })
        })
      }
      this.materialStockFlag = true
    },
    getCmpData() {
      this.materialStockInfo.order_id = Number(this.order_id)
      this.materialStockInfo.info_data.forEach((item) => {
        item.batch_code = item.batch_code || '无'
        item.vat_code = item.vat_code || '无'
        item.color_code = item.color_code || '无'
      })
    },
    saveMaterialStock() {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      const formCheck = this.materialStockInfo.info_data.some((item) => {
        return this.$formCheck(item, [
          {
            key: 'rel_doc_info_id',
            errMsg: '请选择单据物料'
          },
          {
            key: 'material_id',
            errMsg: '请选择物料'
          },
          {
            key: 'number',
            errMsg: '请输入数量'
          }
        ])
      })
      if (!formCheck) {
        this.getCmpData()
        this.saveLock = true
        this.loading = true
        materialStock.create({ data: [this.materialStockInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.materialStockFlag = false
            this.init()
          }
          this.saveLock = false
          this.loading = false
          this.mustFlag = false
        })
      } else {
        this.mustFlag = true
      }
    },
    closeStock() {
      this.materialStockFlag = false
    },
    deleteMaterialStockList(id: number) {
      this.$confirm('是否删除该出入库单据?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          materialStock
            .delete({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('删除成功')
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  computed: {
    yarnColorList() {
      return this.$store.state.api.yarnColor.arr.map((item: { name: any }) => {
        return {
          value: item.name,
          label: item.name
        }
      })
    }
  },
  mounted() {
    this.$checkCommonInfo([
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
          this.order_id = res.data.data.time_data[this.orderIndex].id
          this.init()
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/materialStock/detail.less';
</style>
<style lang="less">
#materialStockDetail {
  .error {
    .el-input__inner {
      border-color: red !important;
    }
  }
}
</style>