<template>
  <div id="craftDetail"
    class="bodyContainer"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="detailCtn"
        style="padding-bottom:0">
        <div class="row">
          <div class="col">
            <div class="label">工艺单编号：</div>
            <div class="text">{{craftInfo.craft_code}}
              <span class="hoverBlue"
                style="cursor:pointer;font-size:14px"
                @click="$copyTextInfo(craftInfo.code)">复制</span>
            </div>
          </div>
          <div class="col">
            <div class="label">创建日期：</div>
            <div class="text">{{craftInfo.create_time && craftInfo.create_time.slice(0,10)}}</div>
          </div>
          <div class="col">
            <div class="label">创建人：</div>
            <div class="text">{{craftInfo.user_name}}</div>
          </div>
        </div>
      </div>
      <template v-if="!craftInfo.product_id&&!craftInfo.part_id">
        <div class="detailCtn gray"
          style="padding-top:0">
          未绑定产品信息
        </div>
      </template>
      <template v-else>
        <template v-if="craftInfo.part_id">
          <div class="detailCtn"
            style="padding-top:0">
            <div class="row">
              <div class="col">
                <div class="label">配件名称：</div>
                <div class="text">{{craftInfo.part_info.name}}</div>
              </div>
              <div class="col">
                <div class="label">配件单位：</div>
                <div class="text">{{craftInfo.part_info.unit}}</div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="detailCtn"
            style="padding-top:0">
            <div class="row">
              <div class="col">
                <div class="label">{{productType}}编号：</div>
                <div class="text">{{productInfo.product_code||productInfo.system_code}}</div>
              </div>
              <div class="col">
                <div class="label">{{productType}}名称：</div>
                <div class="text">{{productInfo.title||'无'}}</div>
              </div>
              <div class="col">
                <div class="label">{{productType}}品类：</div>
                <div class="text">{{productInfo.category_name}}/{{productInfo.secondary_category_name}}</div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">{{productType}}配色：</div>
                <div class="text">
                  <span v-for="(item,index) in productInfo.color_data"
                    :key="item.id"
                    style="margin-right:12px">{{index+1}}.{{item.name}}</span>
                </div>
              </div>
              <div class="col">
                <div class="label">{{productType}}描述：</div>
                <div class="text"
                  v-html="productInfo.desc"></div>
              </div>
            </div>
            <div class="row">
              <div class="col flex3">
                <div class="label">大身成分：</div>
                <div class="text">
                  <span style="margin-right:12px"
                    v-for="item in productInfo.component_data"
                    :key="item.id">{{item.name}}{{item.number}}%</span>
                </div>
              </div>
              <div class="col">
                <div class="label">尺码信息：</div>
                <div class="text">
                  <span v-for="(item,index) in productInfo.size_data"
                    :key="item.id"
                    style="margin-right:12px"> {{index+1}}.&nbsp;{{item.name}}&nbsp;{{item.weight}}g&nbsp;{{item.size_info}}</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">{{productType}}图片：</div>
                <div class="imgCtn"
                  style="max-height:100px">
                  <el-image :key="index"
                    class="img"
                    v-for="(item,index) in productInfo.image_data"
                    style="height:100%"
                    :src="item"
                    :preview-src-list="[item]">
                    <div slot="error"
                      class="image-slot">
                      <i class="el-icon-picture-outline"
                        style="font-size:42px"></i>
                    </div>
                  </el-image>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">备注信息：</div>
                <div class="text"
                  v-html="productInfo.desc"></div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">原料经向</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">配色方案：</div>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in craftInfo.warp_data.color_data"
                :key="index">
                <span class="circle">{{index+1}}</span>
                <span>{{item.color_name}}：</span>
                <div class="colorBox"
                  v-for="(itemColor,indexColor) in item.color_scheme"
                  :key="indexColor">
                  <el-tooltip class="item"
                    effect="dark"
                    :content="filterColorWeigth(itemColor)"
                    placement="top">
                    <div>
                      <span class="colorText"
                        :style="{'background':itemColor.color}">{{filterIndex(indexColor)}}</span>
                      <span class="name">{{itemColor.name}}</span>
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row"
          v-for="(item,index) in craftInfo.warp_data.material_data"
          :key="index">
          <template v-if="item.material_name">
            <div class="col">
              <span class="label">{{index===0?'主要':'次要'}}原料：</span>
              <div class="text">
                <span>{{item.material_name}}</span>
                <div class="colorBox"
                  v-for="(itemApply,indexApply) in item.apply"
                  :key="indexApply">
                  <span class="colorText">{{filterIndex(itemApply)}}</span>
                  <span class="name">{{cmpIndexWeight(itemApply, craftInfo.warp_data.color_data[0].color_scheme,1)}}g</span>
                </div>
              </div>
            </div>
          </template>
        </div>
        <template v-if="craftInfo.warp_data.assist_material.length>0&&craftInfo.warp_data.assist_material[0].material_id">
          <div class="row"
            v-for="(item,index) in craftInfo.warp_data.assist_material"
            :key="index">
            <div class="col">
              <span class="label">辅助原料：</span>
              <div class="text">
                <span>{{item.material_id===-1?'金丝':'银丝'}}</span>
                <div class="colorBox"
                  v-for="(itemApply,indexApply) in item.apply"
                  :key="indexApply">
                  <span class="colorText">{{filterIndex(itemApply)}}</span>
                  <span class="name">{{cmpIndexWeight(itemApply, craftInfo.warp_data.color_data[0].color_scheme,2)}}g</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="row">
          <div class="col">
            <span class="label">经向信息：</span>
            <hot-table :settings="tableData.warp"
              ref="warp">
            </hot-table>
          </div>
        </div>
        <div class="row"
          v-if="craftInfo.warp_data.back_status===1">
          <div class="col">
            <span class="label">经向反面：</span>
            <hot-table :settings="tableData.warpBack"
              ref="warpBack">
            </hot-table>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">整经工艺</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col flex3">
            <div class="label">整经头纹：</div>
            <div class="text">{{craftInfo.warp_data.weft}}根</div>
          </div>
          <div class="col flex3">
            <div class="label">边型：</div>
            <div class="text">{{craftInfo.warp_data.side || '无'}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">整经门幅：</div>
            <div class="text">{{craftInfo.warp_data.width || '0'}}cm</div>
          </div>
          <div class="col flex3">
            <div class="label">机型：</div>
            <div class="text">{{craftInfo.warp_data.machine || '无'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">穿综筘工艺</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">筘号：</div>
            <div class="text">{{craftInfo.warp_data.reed || '0'}}筘</div>
          </div>
          <div class="col">
            <div class="label">穿筘法：</div>
            <div class="text">{{craftInfo.warp_data.reed_method || '0'}}根/筘</div>
          </div>
          <div class="col">
            <div class="label">综页：</div>
            <div class="text">{{craftInfo.warp_data.sum_up || '0'}}页</div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">筘幅：</div>
            <div class="text">{{craftInfo.warp_data.reed_width || '0'}}cm</div>
          </div>
          <div class="col flex3">
            <div class="label">筘幅说明：</div>
            <div class="text">{{craftInfo.warp_data.reed_width_data || '无'}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col"
            style="flex-direction: column;">
            <div class="label">纹版图：</div>
            <div class="GLCtn"
              v-for="(item1,index1) in craftInfo.draft_method.GL"
              :key="index1">
              <div class="mark">{{alphabet[index1]}}：
                <span class="hoverBlue"
                  style="cursor:pointer;line-height: 32px;position: absolute;left: 0;top: calc(50% + 27px);"
                  @click="showGL(index1)">预览</span>
              </div>
              <div v-for="(item2,index2) in item1"
                :key="index2"
                class="deltaCtn">
                <div class="leftCtn">
                  <span :content="GLXuhao[index1] ? GLXuhao[index1][index2] : index2+1">{{GLXuhao[index1] ? GLXuhao[index1][index2] : ''}}</span>
                </div>
                <div class="rightCtn">
                  <div class="hehe">
                    <el-input v-model="item2[0].value"
                      disabled></el-input>
                    <div class="normal"
                      :class="item2[0].mark">{{!item2[0].mark?'停撬':''}}</div>
                  </div>
                  <div class="hehe">
                    <el-input v-model="item2[1].value"
                      disabled></el-input>
                    <div class="normal"
                      :class="item2[1].mark">{{!item2[1].mark?'停撬':''}}</div>
                  </div>
                  <div class="hehe">
                    <el-input v-model="item2[2].value"
                      disabled></el-input>
                    <div class="normal"
                      :class="item2[2].mark">{{!item2[2].mark?'停撬':''}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row"
          v-if="craftInfo.draft_method.GLRepeat.length>0">
          <div class="col">
            <div class="label">纹版图循环：</div>
            <div class="info">
              <div style="position:relative"
                v-for="(item,index) in GLRepeatXuhao"
                :key="index">
                <div style="position:absolute;line-height:32px;color:rgba(0,0,0,0.65)">{{alphabet[index]}}：</div>
                <div style="display:block;padding-left:32px;margin:3px 0"
                  v-for="(itemChild,indexChild) in item"
                  :key="indexChild">
                  <div class="elCtn">
                    <el-input style="width:100px;text-align:center"
                      disabled
                      type="number"
                      v-model="itemChild.start">
                    </el-input>
                  </div>
                  <span style="margin:0 20px;color:#666">到</span>
                  <div class="elCtn">
                    <el-input style="width:100px;text-align:center"
                      disabled
                      type="number"
                      v-model="itemChild.end">
                    </el-input>
                  </div>
                  <span style="margin:0 20px;color:#666">✖</span>
                  <div class="elCtn">
                    <el-input style="width:140px;text-align:center"
                      disabled
                      type="number"
                      v-model="itemChild.repeat">
                      <template slot="append">遍</template>
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">穿综循环：</div>
            <div class="treeCtn">
              <div class="node"
                v-for="(item1,index1) in craftInfo.draft_method.PM"
                :key="index1">
                <div class="numbers">{{romanNum[index1]}}</div>
                <div class="lineCol"
                  v-show="craftInfo.draft_method.PMFlag === 'complex'"></div>
                <div class="nodeBox">
                  <div class="box box1">
                    <el-input v-if="craftInfo.draft_method.PMFlag === 'normal'"
                      placeholder="根数"
                      v-model="item1.number">
                    </el-input>
                    <el-input v-if="craftInfo.draft_method.PMFlag === 'complex'"
                      placeholder="总数"
                      v-model="item1.total"
                      disabled>
                    </el-input>
                    <em class="unit right">根</em>
                  </div>
                  <div class="box box2">
                    <div class="lines">
                      <div class="line1">
                        <el-input v-if="craftInfo.draft_method.PMFlag === 'normal'"
                          placeholder="穿综循环"
                          v-model="item1.value">
                        </el-input>
                      </div>
                      <div class="line2">
                        <em class="unit left">×</em>
                        <el-input style="padding-left:5px;box-sizing:border-box;"
                          placeholder="遍数"
                          v-model="item1.repeat">
                        </el-input>
                        <em class="unit right">遍</em>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="nodeChild"
                  v-show="craftInfo.draft_method.PMFlag === 'complex'"
                  v-for="(item2,index2) in item1.children"
                  :key="index2">
                  <div class="nodeBox">
                    <div class="lineRow"></div>
                    <div class="nodeBtn deleteBtn"
                      @click="item1.children.length>1?$deleteItem(item1.children,index2):$message.error('至少有一种穿综循环')">
                      <i class="el-icon-minus"></i>
                    </div>
                    <div class="box box1">
                      <div class="elCtn">
                        <el-input placeholder="根数"
                          v-model="item2.number">
                        </el-input>
                      </div>
                      <em class="unit right">根</em>
                    </div>
                    <div class="box box2">
                      <div class="lines"
                        v-for="(item3,index3) in item2.children"
                        :key="index3">
                        <div class="line1">
                          <el-input placeholder="穿综循环"
                            v-model="item3.value">
                          </el-input>
                        </div>
                        <div class="line2">
                          <em class="unit left">×</em>
                          <el-input style="padding-left:5px;box-sizing:border-box;"
                            placeholder="遍数"
                            v-model="item3.repeat">
                          </el-input>
                          <em class="unit right">遍</em>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">纹版图备注：</div>
            <div class="text">{{craftInfo.draft_method.GLDesc || '无'}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">穿综法备注：</div>
            <div class="text">{{craftInfo.draft_method.PMDesc || '无'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">织造工艺</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">组织法：</div>
            <div class="text">{{craftInfo.weft_data.organization_name||'无'}}</div>
          </div>
          <div class="col">
            <div class="label">机上坯幅：</div>
            <div class="text">{{craftInfo.weft_data.peifu || '0'}}cm</div>
          </div>
          <div class="col">
            <div class="label">坯幅说明：</div>
            <div class="text">{{craftInfo.weft_data.peifu_data || '无'}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">上齿牙：</div>
            <div class="text">{{craftInfo.weft_data.shangchiya || '0'}}牙</div>
          </div>
          <div class="col">
            <div class="label">下齿牙：</div>
            <div class="text">{{craftInfo.weft_data.xiachiya || '0'}}牙</div>
          </div>
          <div class="col">
            <div class="label">纬密：</div>
            <div class="text">{{craftInfo.weft_data.weimi || '0'}}梭/cm</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">内长：</div>
            <div class="text">{{craftInfo.weft_data.neichang}}cm</div>
          </div>
          <div class="col">
            <div class="label">让位：</div>
            <div class="text">{{craftInfo.weft_data.rangwei}}</div>
          </div>
          <div class="col">
            <div class="label">总计：</div>
            <div class="text">{{craftInfo.weft_data.total}}根</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">原料纬向</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">配色方案：</div>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in craftInfo.weft_data.color_data"
                :key="index">
                <span class="circle">{{index+1}}</span>
                <span>{{item.color_name}}：</span>
                <div class="colorBox"
                  v-for="(itemColor,indexColor) in item.color_scheme"
                  :key="indexColor">
                  <el-tooltip class="item"
                    effect="dark"
                    :content="filterColorWeigth(itemColor)"
                    placement="top">
                    <div>
                      <span class="colorText"
                        :style="{'background':itemColor.color}">{{filterIndex(indexColor)}}</span>
                      <span class="name">{{itemColor.name}}</span>
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row"
          v-for="(item,index) in craftInfo.weft_data.material_data"
          :key="index">
          <template v-if="item.material_name">
            <div class="col">
              <span class="label">{{index===0?'主要':'次要'}}原料：</span>
              <div class="text">
                <span>{{item.material_name}}</span>
                <div class="colorBox"
                  v-for="(itemApply,indexApply) in item.apply"
                  :key="indexApply">
                  <span class="colorText">{{filterIndex(itemApply)}}</span>
                  <span class="name">{{cmpIndexWeight(itemApply, craftInfo.weft_data.color_data[0].color_scheme,1)}}g</span>
                </div>
              </div>
            </div>
          </template>
        </div>
        <template v-if="craftInfo.weft_data.assist_material.length>0&&craftInfo.weft_data.assist_material[0].material_id">
          <div class="row"
            v-for="(item,index) in craftInfo.weft_data.assist_material"
            :key="index">
            <div class="col">
              <span class="label">辅助原料：</span>
              <div class="text">
                <span>{{item.material_id===-1?'金丝':'银丝'}}</span>
                <div class="colorBox"
                  v-for="(itemApply,indexApply) in item.apply"
                  :key="indexApply">
                  <span class="colorText">{{filterIndex(itemApply)}}</span>
                  <span class="name">{{cmpIndexWeight(itemApply, craftInfo.weft_data.color_data[0].color_scheme,2)}}g</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="row">
          <div class="col">
            <span class="label">纬向信息：</span>
            <hot-table :settings="tableData.weft"
              ref="weft">
            </hot-table>
          </div>
        </div>
        <div class="row"
          v-if="craftInfo.weft_data.back_status===1">
          <div class="col">
            <span class="label">纬向反面：</span>
            <hot-table :settings="tableData.weftBack"
              ref="weftBack">
            </hot-table>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">其他信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">名称：</div>
            <div class="text">{{craftInfo.title}}</div>
          </div>
          <div class="col">
            <div class="label">大身规格：</div>
            <div class="text">{{craftInfo.size}}</div>
          </div>
          <div class="col">
            <div class="label">大身克重：</div>
            <div class="text">{{craftInfo.weight}}g</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">后道工序：</div>
            <div class="text">{{craftInfo.process_data.map((item)=>item.process_name).join('；')}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">物料系数：</div>
            <div class="lineCtn">
              <div class="line"
                v-for="(item,index) in craftInfo.yarn_coefficient"
                :key="index">
                {{item.name}}：{{item.value}}g <span style="margin-left:15px;color:#1a95ff">{{item.chuankou?item.chuankou + '根/筘':''}}</span></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">下机时间：</div>
            <div class="text">{{craftInfo.product_time}}</div>
          </div>
          <div class="col">
            <div class="label">其他信息：</div>
            <div class="text">{{craftInfo.other_info}}</div>
          </div>
          <div class="col">
            <div class="label">备注信息：</div>
            <div class="text">{{craftInfo.desc}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">产品净重：</div>
            <div class="text blue">{{jingzhong}}g</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">上传图像：</div>
            <div class="imageCtn">
              <el-image style="width:150px;height:150px;margin-right:16px"
                v-for="(item,index) in craftInfo.image_data"
                :key="index"
                :src="item.file_url || ''"
                :preview-src-list="[item.file_url]">
              </el-image>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">仿真图像：</div>
            <div class="btnList">
              <div class="button"
                v-for="(item,index) in craftInfo.warp_data.color_data"
                :key="index"
                :class="{'active':item.color_id===selectColour}"
                @click="getCanvas(item.color_id,index)">{{item.color_name || '无配色'}}</div>
            </div>
          </div>
        </div>
        <div class="row"
          style="position:relative"
          v-show="selectColour!==-1">
          <span class="hoverBlue"
            style="position: absolute;
              left: 0px;
              top: -1em;
              color: rgb(26, 149, 255);
              cursor: pointer;
              right: 0;
              margin: auto;
              text-align: center;"
            @click="uploadImg">上传当前配色图片</span>
          <div class="col"
            style="margin:0">
            <div class="canvasCtn">
              <div class="mark"
                v-show="craftInfo.warp_data.back_status===1 || craftInfo.weft_data.back_status===1">
                <span>正面</span>
              </div>
              <canvas ref="myCanvas"
                style="display:none"
                width="2400"
                :height="canvasHeight"></canvas>
              <img ref="img"
                @mousedown.prevent="showMagnifier=true"
                @mousemove="enlargeImg($event)"
                @mouseup="showMagnifier=false"
                @mouseleave="showMagnifier=false"
                :style="{'height':canvasHeight/4 + 'px'}"
                :class="{'cursorMagnifier':showMagnifier}"
                src="" />
              <canvas class="floatRightTop"
                ref="magnifier"
                width="200"
                height="200" />
            </div>
          </div>
        </div>
        <div class="row"
          style="position:relative"
          v-show="selectColour!==-1&&(craftInfo.warp_data.back_status===1||craftInfo.weft_data.back_status===1)">
          <div class="col"
            style="margin:0">
            <div class="canvasCtn">
              <div class="mark">
                <span>反面</span>
              </div>
              <canvas ref="myCanvasBack"
                style="display:none"
                width="2400"
                :height="canvasHeight"></canvas>
              <img ref="imgBack"
                :style="{'height':canvasHeight/4 + 'px'}"
                :class="{'cursorMagnifier':showMagnifier}"
                src="" />
              <canvas class="floatRightTop"
                ref="magnifierBack"
                width="200"
                height="200" />
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
          <div class="buttonList"
            style="margin-left:12px">
            <div class="btn backHoverBlue">
              <i class="el-icon-s-grid"></i>
              <span class="text">工艺操作</span>
            </div>
            <div class="otherInfoCtn">
              <div class="otherInfo">
                <div class="btn backHoverOrange"
                  @click="$router.push('/craft/update?id='+$route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-xiugaidingdan"></use>
                  </svg>
                  <span class="text">修改工艺</span>
                </div>
                <div class="btn backHoverRed"
                  @click="deleteCraft">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-shanchudingdan"></use>
                  </svg>
                  <span class="text">删除工艺</span>
                </div>
                <div class="btn backHoverGreen"
                  @click="$openUrl('/craft/print?id='+$route.query.id)">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-dayindingdan"></use>
                  </svg>
                  <span class="text">打印工艺</span>
                </div>
                <div class="btn backHoverBlue"
                  @click="$router.push('/materialPlan/create?id=' + craftInfo.order_id + '&sampleOrderIndex='+craftInfo.order_time_id + '&product_id='+craftInfo.product_info.product_id)"
                  v-show="craftInfo.order_id">
                  <svg class="iconFont"
                    aria-hidden="true">
                    <use xlink:href="#icon-wuliaojihua1"></use>
                  </svg>
                  <span class="text">物料计划</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showGLFlag">
      <div class="main">
        <div class="titleCtn">
          <div class="text">预览纹版图</div>
          <i class="el-icon-close"
            @click="showGLFlag=false"></i>
        </div>
        <div class="contentCtn">
          <div class="GLCtns">
            <div class="rowLine"
              v-for="(item,index) in GLYulan"
              :key="index">
              <div class="col"
                v-for="(itemChild,indexChild) in item"
                :key="indexChild"
                :class="{'black':itemChild===1,'white':itemChild===0}"></div>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="showGLFlag = false">取消</span>
          <span class="btn backHoverBlue"
            @click="showGLFlag = false">确认</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showImageLoading">
      <img class="loadingImg"
        :src="require('@/assets/image/common/craft_loading2.gif')">
    </div>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/handsontable@7.3.0/dist/handsontable.full.min.js"></script>
<script lang="ts">
interface WarpCanvas {
  color: number // 这里的color指的是主夹，不是字符串颜色
  PM: string
}
interface WeftCanvas {
  color: number
  GL: string
}
import Vue from 'vue'
import { craft } from '@/assets/js/api'
import { CraftInfo, GLReapeat, GLInfo } from '@/types/craft'
import { ProductInfo } from '@/types/product'
import { languages } from '@/assets/js/dictionary'
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
import { navInfo } from '@/types/nav'
Handsontable.languages.registerLanguageDictionary(languages as any) // 注册中文字典
export default Vue.extend({
  components: {
    HotTable
  },
  data(): {
    completeGL: GLInfo[][][]
    craftInfo: CraftInfo
    productInfo: ProductInfo
    GLRepeatXuhao: GLReapeat[][]
    warpCanvas: WarpCanvas[]
    weftCanvas: WeftCanvas[]
    warpCanvasBack: WarpCanvas[]
    weftCanvasBack: WeftCanvas[]
    [propName: string]: any
  } {
    return {
      loading: true,
      tableData: { warp: {}, warpBack: {}, weft: {}, weftBack: {} },
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
      craftInfo: {
        id: '',
        product_id: '',
        title: '',
        size: '', // 大身规格
        weight: '', // 大身克重
        other_info: '',
        desc: '',
        is_draft: 1,
        calc_weight_way: 1, // 计算公式
        product_time: '', //下机时间
        process_data: [],
        yarn_coefficient: [
          {
            id: '',
            name: '',
            value: '',
            chuankou: ''
          }
        ],
        draft_method: {
          PM: [
            {
              value: '', // 循环的值，用逗号分割
              repeat: '', // 循环次数
              number: '', // 纱线根数
              total: 0, // 高级穿综法统计值
              children: [
                {
                  number: '',
                  children: [
                    {
                      value: '',
                      repeat: ''
                    }
                  ]
                }
              ]
            }
          ],
          PMFlag: 'normal',
          GL: [
            [
              [
                {
                  value: '',
                  mark: ''
                },
                {
                  value: '',
                  mark: ''
                },
                {
                  value: '',
                  mark: ''
                }
              ]
            ]
          ],
          GLFlag: 'normal',
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
          warp_rank: [],
          warp_rank_back: [],
          merge_data: '',
          merge_data_back: '',
          weft: '', // 总头纹
          width: '', // 整经门幅
          side: '', // 边型
          machine: '', // 机型
          reed: '', // 筘号
          reed_method: '', // 穿筘法
          reed_width: '', // 筘幅
          reed_width_explain: ['', '', ''], // 筘幅说明
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
          weft_rank: [],
          weft_rank_back: [],
          merge_data: '',
          merge_data_back: '',
          organization: '', // 组织法
          peifu: '', // 胚服
          weimi: '', // 纬密
          shangchiya: '', // 上齿牙
          xiachiya: '', // 下齿牙
          neichang: '', // 内长
          rangwei: '', // 让位
          total: '', // 总计
          back_status: 2, // 1：有，2：无
          peifu_explain: '' // 胚服说明
        },
        material_info: []
      },
      productInfo: {
        product_type: 1,
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
            id: '',
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
                id: '',
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
      canvasHeight: 0,
      GLRepeatXuhao: [],
      GLXuhao: [], // 纹版图循环重算序号
      completeGL: [], // 纹版图根据纹版图循环补充完整
      warpCanvas: [],
      warpCanvasBack: [],
      weftCanvas: [],
      weftCanvasBack: [],
      showMagnifier: false, // 放大镜
      showImageLoading: false,
      showGLFlag: false,
      GLYulan: [],
      selectColour: -1 // 选择配色
    }
  },
  methods: {
    deleteCraft() {
      this.$confirm('是否删除工艺单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          craft
            .delete({
              id: Number(this.$route.query.id)
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$router.go(-1)
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
    // 预览纹版图
    showGL(GLIndex: number) {
      let GLArr: any[][] = []
      this.completeGL[GLIndex].forEach((item) => {
        item.forEach((itemChild) => {
          if (itemChild.value) {
            GLArr.push(itemChild.value.split(','))
          }
        })
      })
      let max = 0
      GLArr.forEach((item) => {
        item.forEach((itemChild) => {
          if (Number(itemChild) > max) {
            max = Number(itemChild)
          }
        })
      })
      GLArr = GLArr.map((item) => {
        return new Array(max - 2).fill(0).map((itemChild, indexChild) => {
          if (item.find((itemFind) => Number(itemFind) === indexChild + 3)) {
            itemChild = 1
          }
          return itemChild
        })
      })
      // 把黑白格在经向和纬向上重复四遍
      GLArr = GLArr.map((item) => {
        return item.concat(item).concat(item)
      })
      this.GLYulan = []
      for (let i = 0; i < 3; i++) {
        GLArr.forEach((item) => {
          this.GLYulan.push(item)
        })
      }
      this.showGLFlag = true
    },
    // 匹配主/夹名称
    filterIndex(index: number): string {
      if (index === 0) {
        return '主'
      } else {
        return '夹' + index
      }
    },
    // 用配色表已经算好的克重计算主夹克重
    cmpIndexWeight(applyIndex: number, colorScheme: any[], material_type: 1 | 2) {
      if (!applyIndex && applyIndex !== 0) {
        return 0
      }
      return (
        colorScheme[applyIndex].material_weight
          ? colorScheme[applyIndex].material_weight
              .filter((item: any) => item.material_type === material_type)
              .reduce((total: number, current: any) => {
                return total + Number(current.weight)
              }, 0) * 1000
          : 0
      ).toFixed(1)
    },
    filterColorWeigth(itemColor: any) {
      return itemColor.material_weight
        ? itemColor.material_weight
            .map((item: any) => item.material_name + ':' + this.$toFixed(item.weight * 1000) + 'g')
            .join(';')
        : ''
    },
    // 穿综法1-2合并，此时你访问table[6][2]，返回的结果是null，所以我们需要table[6][1]的值,所以我们需要一个函数返回1
    getPMorGLIndex(PMorGLMerge: any[], index: number): number {
      const finded = PMorGLMerge.find((item) => item.col <= index && item.col + item.colspan - 1 >= index)
      return finded.col
    },
    // 展开工艺单
    getFlatTable(table: Array<Array<any>>, type: 'warp' | 'weft' | 'warpBack' | 'weftBack'): any[] {
      const GLorPM = type === 'warp' || type === 'warpBack' ? 'Ⅰ' : 'A'
      const mergeTable = this.tableData[type].mergeCells
      // 获取完整的合并项信息
      const firstMerge = this.getMergeInfo(mergeTable, 3, table[0].length)
      const secondMerge = this.getMergeInfo(mergeTable, 4, table[0].length)
      const thirdMerge = this.getMergeInfo(mergeTable, 5, table[0].length)
      const PMorGLMerge = this.getMergeInfo(mergeTable, 6, table[0].length)
      let firstArr: { order: number; number: any }[][] = []
      firstMerge.forEach((item) => {
        let temporaryStorage = [] // 临时存储合并项
        for (let i = item.col; i < item.col + item.colspan; i++) {
          temporaryStorage.push({
            jia: Number(table[1][i]), // 主夹信息,计算克重的时候用
            order: parseInt(table[0][i]),
            number: table[2][i],
            GLorPM: table[6][this.getPMorGLIndex(PMorGLMerge, i)] || GLorPM
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
          // 在这里倒一遍，根据py暗号state = special
          if (forNum.state === 'special') {
            thirdArr.push(
              this.$clone(realStorage)
                .map((item) => {
                  return item.reverse()
                })
                .reverse()
            ) // 注意reverse会改变原数组
          }
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
      state?: string
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
          number: 1,
          state: 'special'
        }
      }
      let arr = info.split(']')
      return {
        number: arr[0].split('[')[1] as unknown as number,
        start: arr[1].split('[')[1] as unknown as number | undefined,
        end: arr[2].split('[')[1] as unknown as number | undefined
      }
    },
    // 初始化计算画图信息
    initCanvasInfo() {
      // 将纹版图循环补充完整
      // 例如1-2循环2次，5-6循环两次，补充3-4循环1次进去
      let GLRepeatComplete: GLReapeat[][] = []
      if (
        this.craftInfo.draft_method.GLRepeat.length > 0 &&
        this.craftInfo.draft_method.GLRepeat.every((item) => {
          return item.every((itemChild) => !itemChild.start)
        })
      ) {
        // 如果所有的文版循环选项都为空则处理一个简单的空数组
        this.craftInfo.draft_method.GLRepeat = []
      }
      this.craftInfo.draft_method.GLRepeat.forEach((item, index) => {
        GLRepeatComplete.push([])
        let start = 1
        item.forEach((itemChild: GLReapeat) => {
          if (!itemChild.start) {
            return
          }
          if (Number(itemChild.start) - start > 0) {
            GLRepeatComplete[index].push({
              start: start,
              end: Number(itemChild.start) - 1,
              repeat: 1
            })
          }
          GLRepeatComplete[index].push(itemChild)
          start = Number(itemChild.end) + 1
        })
        if (this.craftInfo.draft_method.GL[index].length >= start) {
          GLRepeatComplete[index].push({
            start: start,
            end: this.craftInfo.draft_method.GL[index].length,
            repeat: 1
          })
        }
      })
      // 如果没有纹板图循环，直接生成一个GLRepeatComplete
      if (this.craftInfo.draft_method.GLRepeat.length === 0) {
        this.craftInfo.draft_method.GL.forEach((item) => {
          GLRepeatComplete.push([
            {
              start: 1,
              end: item.length,
              repeat: 1
            }
          ])
        })
      }
      // 根据完整的GLrepeat得到完整的GL
      GLRepeatComplete.forEach((item, index) => {
        this.completeGL.push([])
        item.forEach((itemChild) => {
          for (let j = 0; j < itemChild.repeat; j++) {
            for (let i = Number(itemChild.start); i <= itemChild.end; i++) {
              this.completeGL[index].push(this.craftInfo.draft_method.GL[index][i - 1])
            }
          }
        })
      })

      // 纹版图序号单独计算
      // let GLRepeatXuhao: GLReapeat[][] = []
      GLRepeatComplete.forEach((item, index) => {
        this.GLRepeatXuhao.push([])
        let addNum: number = 0
        item.forEach((itemChild) => {
          this.GLRepeatXuhao[index].push({
            start: addNum + Number(itemChild.start),
            end: addNum + Number(itemChild.end),
            repeat: itemChild.repeat
          })
          addNum += (Number(itemChild.end) - Number(itemChild.start) + 1) * (Number(itemChild.repeat) - 1)
        })
      })

      this.GLRepeatXuhao.forEach((item, index) => {
        this.GLXuhao.push([])
        item.forEach((itemChild) => {
          for (let i = Number(itemChild.start); i <= itemChild.end; i++) {
            this.GLXuhao[index].push(i)
          }
        })
      })
      // 高度计算
      this.canvasHeight =
        (Number(this.craftInfo.weft_data.neichang) /
          (Number(this.craftInfo.calc_weight_way) === 1
            ? Number(this.craftInfo.warp_data.reed_width)
            : Number(this.craftInfo.weft_data.peifu))) *
        600 *
        4

      // 展开表格
      const warpTable = this.getFlatTable(this.craftInfo.warp_data.warp_rank, 'warp')
      const warpTableBack = this.getFlatTable(this.craftInfo.warp_data.warp_rank_back, 'warpBack')
      const weftTable = this.getFlatTable(this.craftInfo.weft_data.weft_rank, 'weft')
      const weftTableBack = this.getFlatTable(this.craftInfo.weft_data.weft_rank_back, 'weftBack')

      // 将展开的合并信息结合穿综和纹版信息
      let warpGetPMNum: any = []
      let weftGetGLNum: any = []
      let warpGetPMNumBack: any = []
      let weftGetGLNumBack: any = []
      warpTable.forEach((item) => {
        let len = warpGetPMNum.length
        if (len > 0) {
          if (warpGetPMNum[len - 1].PM === item.GLorPM) {
            warpGetPMNum[len - 1].number += parseInt(item.number)
          } else {
            warpGetPMNum.push({
              PM: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          warpGetPMNum.push({
            PM: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })
      weftTable.forEach((item) => {
        let len = weftGetGLNum.length
        if (len > 0) {
          if (weftGetGLNum[len - 1].GL === item.GLorPM) {
            weftGetGLNum[len - 1].number += parseInt(item.number)
          } else {
            weftGetGLNum.push({
              GL: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          weftGetGLNum.push({
            GL: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })

      warpTableBack.forEach((item) => {
        let len = warpGetPMNumBack.length
        if (len > 0) {
          if (warpGetPMNumBack[len - 1].PM === item.GLorPM) {
            warpGetPMNumBack[len - 1].number += parseInt(item.number)
          } else {
            warpGetPMNumBack.push({
              PM: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          warpGetPMNumBack.push({
            PM: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })
      weftTableBack.forEach((item) => {
        let len = weftGetGLNumBack.length
        if (len > 0) {
          if (weftGetGLNumBack[len - 1].GL === item.GLorPM) {
            weftGetGLNumBack[len - 1].number += parseInt(item.number)
          } else {
            weftGetGLNumBack.push({
              GL: item.GLorPM,
              number: parseInt(item.number)
            })
          }
        } else {
          weftGetGLNumBack.push({
            GL: item.GLorPM,
            number: parseInt(item.number)
          })
        }
      })

      let warpGetPM: any = []
      let weftGetGL: any = []
      let warpGetPMBack: any = []
      let weftGetGLBack: any = []
      // 普通穿综和高级穿综区别计算
      if (this.craftInfo.draft_method.PMFlag === 'complex') {
        warpGetPMNum.forEach((item: any) => {
          // 高级穿综
          let PM = this.craftInfo.draft_method.PM[this.romanNum.indexOf(item.PM)]
          let PMFlatArr: any = []
          PM.children!.forEach((itemPM) => {
            let PMVal: any[] = []
            itemPM.children!.forEach((itemChildren: any) => {
              for (let i = 0; i < parseInt(itemChildren.repeat); i++) {
                PMVal = PMVal.concat(itemChildren.value.split(','))
              }
            })
            const times = Math.floor(Number(itemPM.number) / PMVal.length) // 循环次数,取整数
            const remainder = Number(itemPM.number) % PMVal.length // 取余数
            for (let i = 0; i < times; i++) {
              PMFlatArr = PMFlatArr.concat(PMVal)
            }
            PMFlatArr = PMFlatArr.concat(PMVal.filter((item: any, index: number) => index < remainder))
          })
          const times = Math.floor(item.number / PMFlatArr.length)
          const remainder = item.number % PMFlatArr.length
          for (let i = 0; i < times; i++) {
            warpGetPM = warpGetPM.concat(PMFlatArr)
          }
          warpGetPM = warpGetPM.concat(PMFlatArr.filter((item: any, index: number) => index < remainder))
        })
        warpGetPMNumBack.forEach((item: any) => {
          let PM = this.craftInfo.draft_method.PM[this.romanNum.indexOf(item.PM)]
          let PMFlatArr: any = []
          PM.children!.forEach((itemPM) => {
            let PMVal: any[] = []
            itemPM.children!.forEach((itemChildren: any) => {
              for (let i = 0; i < parseInt(itemChildren.repeat); i++) {
                PMVal = PMVal.concat(itemChildren.value.split(','))
              }
            })
            const times = Math.floor(Number(itemPM.number) / PMVal.length) // 循环次数,取整数
            const remainder = Number(itemPM.number) % PMVal.length // 取余数
            for (let i = 0; i < times; i++) {
              PMFlatArr = PMFlatArr.concat(PMVal)
            }
            PMFlatArr = PMFlatArr.concat(PMVal.filter((item: any, index: number) => index < remainder))
          })
          const times = Math.floor(item.number / PMFlatArr.length)
          const remainder = item.number % PMFlatArr.length
          for (let i = 0; i < times; i++) {
            warpGetPMBack = warpGetPMBack.concat(PMFlatArr)
          }
          warpGetPMBack = warpGetPMBack.concat(PMFlatArr.filter((item: any, index: number) => index < remainder))
        })
      } else {
        this.craftInfo.draft_method.PM.forEach((item) => {
          const PMArr = item.value ? (item.value as string).split(',') : []
          const times = Math.floor(Number(item.number) / PMArr.length)
          const remainder = Number(item.number) % PMArr.length
          for (let i = 0; i < times; i++) {
            warpGetPM = warpGetPM.concat(PMArr)
          }
          warpGetPM = warpGetPM.concat(PMArr.filter((item, index) => index < remainder))
        })
        this.craftInfo.draft_method.PM.forEach((item) => {
          const PMArr = item.value ? (item.value as string).split(',') : []
          const times = Math.floor(Number(item.number) / PMArr.length)
          const remainder = Number(item.number) % PMArr.length
          for (let i = 0; i < times; i++) {
            warpGetPMBack = warpGetPMBack.concat(PMArr)
          }
          warpGetPMBack = warpGetPMBack.concat(PMArr.filter((item, index) => index < remainder))
        })
      }
      // 纹版图
      weftGetGLNum.forEach((item: any) => {
        let GL = this.mergeArray(this.completeGL[this.alphabet.indexOf(item.GL)])
          .map((item) => item.value)
          .filter((item) => item) // 剔除null
        let times = Math.floor(item.number / GL.length)
        let remainder = item.number % GL.length
        for (let i = 0; i < times; i++) {
          weftGetGL = weftGetGL.concat(GL)
        }
        weftGetGL = weftGetGL.concat(GL.filter((item, index) => index < remainder))
      })
      weftGetGLNumBack.forEach((item: any) => {
        let GL = this.mergeArray(this.completeGL[this.alphabet.indexOf(item.GL)])
          .map((item) => item.value)
          .filter((item) => item) // 剔除null
        let times = Math.floor(item.number / GL.length)
        let remainder = item.number % GL.length
        for (let i = 0; i < times; i++) {
          weftGetGLBack = weftGetGLBack.concat(GL)
        }
        weftGetGLBack = weftGetGLBack.concat(GL.filter((item, index) => index < remainder))
      })
      // 获取画图数据
      let warpCanvas: WarpCanvas[] = []
      let weftCanvas: WeftCanvas[] = []
      let warpCanvasBack: WarpCanvas[] = []
      let weftCanvasBack: WeftCanvas[] = []
      warpTable.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          warpCanvas.push({
            color: item.jia,
            PM: warpGetPM[warpCanvas.length]
          })
        }
      })
      weftTable.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          weftCanvas.push({
            color: item.jia,
            GL: weftGetGL[weftCanvas.length]
          })
        }
      })
      warpTableBack.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          warpCanvasBack.push({
            color: item.jia,
            PM: warpGetPMBack[warpCanvasBack.length]
          })
        }
      })
      weftTableBack.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          weftCanvasBack.push({
            color: item.jia,
            GL: weftGetGLBack[weftCanvasBack.length]
          })
        }
      })
      // 保存表格结合穿综纹版的数据
      this.warpCanvas = warpCanvas
      this.weftCanvas = weftCanvas
      this.warpCanvasBack = warpCanvasBack
      this.weftCanvasBack = weftCanvasBack
    },
    // 渲染图像
    getCanvas(colorId: number, index: number) {
      this.showImageLoading = true
      this.selectColour = colorId ? colorId : -index
      setTimeout(() => {
        const warpColor = this.craftInfo.warp_data.color_data.find((item) => item.color_id === colorId)!.color_scheme
        const weftColor = this.craftInfo.weft_data.color_data.find((item) => item.color_id === colorId)!.color_scheme
        let canvasMatrix: { x: number; y: number; width: number; height: number; color: string }[] = []
        let canvasMatrixBack: { x: number; y: number; width: number; height: number; color: string }[] = []
        let warpCK: number[] = [] // 穿筘信息补全
        this.craftInfo.warp_data.material_data.forEach((item) => {
          if (item.material_id) {
            item.apply.forEach((itemApply: any) => {
              const finded = this.craftInfo.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name)
              warpCK[Number(itemApply)] =
                finded && finded!.chuankou ? Number(finded!.chuankou) : Number(this.craftInfo.warp_data.reed_method)
            })
          }
        })
        // 经向平均长度
        const warpWidthPJ =
          (600 * 4) /
          this.warpCanvas.reduce((total, cur) => {
            return total + Number(warpCK[cur.color])
          }, 0)
        // 纬向平均长度
        const weftWidth = this.canvasHeight / this.weftCanvas.length
        this.warpCanvas.reduce((totalWarp, itemWarp) => {
          let warpWidth = warpWidthPJ * warpCK[itemWarp.color] // 重新计算经向，用穿筘法
          let reverseWeft = [...this.weftCanvas].reverse() // 纬向要反着画,我也不知道为啥,注意reverse会改变原数组,所以修改下指向
          reverseWeft.reduce((totalWeft, itemWeft) => {
            canvasMatrix.push({
              x: totalWarp,
              y: totalWeft,
              width: warpWidth,
              height: weftWidth,
              color: itemWeft.GL.replace(/，/g, ',')
                .split(',')
                .find((item) => item === itemWarp.PM)
                ? warpColor[itemWarp.color].color
                : weftColor[itemWeft.color].color
            })
            return totalWeft + weftWidth
          }, 0)
          return totalWarp + warpWidth
        }, 0)
        this.warpCanvasBack.reduce((totalWarp, itemWarp) => {
          let warpWidth = warpWidthPJ * warpCK[itemWarp.color] // 重新计算经向，用穿筘法
          let reverseWeft = [...this.weftCanvasBack].reverse() // 纬向要反着画,我也不知道为啥,注意reverse会改变原数组,所以修改下指向
          reverseWeft.reduce((totalWeft, itemWeft) => {
            canvasMatrixBack.push({
              x: totalWarp,
              y: totalWeft,
              width: warpWidth,
              height: weftWidth,
              color: itemWeft.GL.replace(/，/g, ',')
                .split(',')
                .find((item) => item === itemWarp.PM)
                ? warpColor[itemWarp.color].color
                : weftColor[itemWeft.color].color
            })
            return totalWeft + weftWidth
          }, 0)
          return totalWarp + warpWidth
        }, 0)
        let dom: any = this.$refs.myCanvas
        let ctx = dom.getContext('2d')
        ctx.beginPath()
        ctx.clearRect(0, 0, 2400, this.canvasHeight)
        canvasMatrix.forEach((item) => {
          ctx.fillStyle = item.color
          ctx.fillRect(item.x, item.y, item.width, item.height)
        })
        let domBack: any = this.$refs.myCanvasBack
        let ctxBack = domBack.getContext('2d')
        ctxBack.beginPath()
        ctxBack.clearRect(0, 0, 2400, this.canvasHeight)
        canvasMatrixBack.forEach((item) => {
          ctxBack.fillStyle = item.color
          ctxBack.fillRect(item.x, item.y, item.width, item.height)
        })
        let img: any = this.$refs.img
        img.src = dom.toDataURL() // canvas转图片
        let imgBack: any = this.$refs.imgBack
        imgBack.src = domBack.toDataURL()
        this.showImageLoading = false
        window.scrollTo(0, 9999)
      }, 100)
    },
    // 放大镜效果实现
    enlargeImg(point: { offsetX: number; offsetY: number }, ifBack: string) {
      // 放大镜效果实现
      if (this.showMagnifier && !ifBack) {
        const drawWidth = 50
        const drawHeight = 50
        let dom: any = this.$refs.magnifier
        let ctx = dom.getContext('2d')
        let img = this.$refs.img
        ctx.clearRect(0, 0, 200, 200)
        ctx.beginPath()
        ctx.drawImage(
          img,
          point.offsetX * 4 - drawWidth / 2,
          point.offsetY * 4 - drawHeight / 2,
          drawWidth,
          drawHeight,
          0,
          0,
          drawWidth * 4,
          drawHeight * 4
        )
      }
      if (this.showMagnifierBack && ifBack === 'back') {
        const drawWidth = 50
        const drawHeight = 50
        let dom: any = this.$refs.magnifierBack
        let ctx = dom.getContext('2d')
        let img = this.$refs.imgBack
        ctx.clearRect(0, 0, 200, 200)
        ctx.beginPath()
        ctx.drawImage(
          img,
          point.offsetX * 4 - drawWidth / 2,
          point.offsetY * 4 - drawHeight / 2,
          drawWidth,
          drawHeight,
          0,
          0,
          drawWidth * 4,
          drawHeight * 4
        )
      }
    },
    // 深拷贝函数
    deepClone(obj: any) {
      //可传入对象 或 数组
      //  判断是否为 null 或 undefined 直接返回该值即可,
      if (obj === null || !obj) return obj
      // 判断 是要深拷贝 对象 还是 数组
      if (Object.prototype.toString.call(obj) === '[object Object]') {
        //对象字符串化的值会为 "[object Object]"
        let target: any = {} //生成新的一个对象
        const keys = Object.keys(obj) //取出对象所有的key属性 返回数组 keys = [ ]
        //遍历复制值, 可用 for 循环代替性能较好
        keys.forEach((key) => {
          if (obj[key] && typeof obj[key] === 'object')
            //如果遇到的值又是 引用类型的 [ ] {} ,得继续深拷贝
            target[key] = this.deepClone(obj[key])
          //递归
          else target[key] = obj[key]
        })
        return target //返回新的对象
      } else if (Array.isArray(obj)) {
        // 数组同理
        let arr: any[] = []
        obj.forEach((item, index) => {
          if (item && typeof item === 'object') arr[index] = this.deepClone(item)
          else arr[index] = item
        })
        return arr
      }
    },
    // 上传图片
    uploadImg() {
      let _this = this
      let uploadData = {
        craft_id: Number(this.$route.query.id),
        is_back: 1,
        color_id: this.selectColour,
        file_url: ''
      }
      let uploadDataBack = {
        craft_id: Number(this.$route.query.id),
        is_back: 2,
        color_id: this.selectColour,
        file_url: ''
      }
      // if (this.craftInfo.image_data!.find((item) => item.color_id === this.selectColour)) {
      //   this.$message.error('请勿重复上传')
      //   return
      // }
      // 获取图片base64链接
      // @ts-ignore
      var image = _this.$refs.myCanvas.toDataURL('image/png')
      var url = 'https://upload.qiniup.com/'
      var xhr = new XMLHttpRequest()
      let formData = new FormData()
      formData.append('token', _this.token)
      // @ts-ignore
      let filename = Date.parse(new Date()) + '.jpg'
      formData.append('key', filename)
      formData.append('file', this.dataURLtoFile(image, filename))
      xhr.open('POST', url, true)
      xhr.send(formData)
      _this.loading = true
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          uploadData.file_url = 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
          _this.$message.success('上传成功')
          craft.uploadImg(uploadData).then((res) => {
            _this.craftInfo.image_data!.push(uploadData)
            _this.loading = false
            if (_this.craftInfo.warp_data.back_status === 1 || _this.craftInfo.weft_data.back_status === 1) {
              _this.loading = true
              // @ts-ignore
              var imageBack = _this.$refs.myCanvasBack.toDataURL('image/png')
              var urlBack = 'https://upload.qiniup.com/'
              var xhrBack = new XMLHttpRequest()
              let formData = new FormData()
              formData.append('token', _this.token)
              // @ts-ignore
              let filename = Date.parse(new Date()) + '.jpg'
              formData.append('key', filename)
              formData.append('file', _this.dataURLtoFile(imageBack, filename))
              xhrBack.open('POST', urlBack, true)
              xhrBack.send(formData)
              xhrBack.onreadystatechange = function () {
                if (xhrBack.readyState === 4) {
                  uploadDataBack.file_url = 'https://file.zwyknit.com/' + JSON.parse(xhrBack.responseText).key
                  uploadDataBack.is_back = 2
                  _this.$message.success('上传背面成功')
                  craft.uploadImg(uploadDataBack).then((res) => {
                    _this.loading = false
                    _this.craftInfo.image_data!.push(uploadDataBack)
                  })
                }
              }
            }
          })
        }
      }
    },
    dataURLtoFile(dataurl: string, filename: string) {
      var arr = dataurl.split(',')
      // @ts-ignore
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    }
  },
  computed: {
    // 产品净重
    jingzhong(): any {
      try {
        return (
          (this.craftInfo.warp_data.color_data[0]!.color_scheme.reduce((total, current) => {
            return (
              total +
              current.material_weight!.reduce((totalChild, currentChild) => {
                return totalChild + Number(currentChild.weight)
              }, 0)
            )
          }, 0) +
            this.craftInfo.weft_data.color_data[0]!.color_scheme.reduce((total, current) => {
              return (
                total +
                current.material_weight!.reduce((totalChild, currentChild) => {
                  return totalChild + Number(currentChild.weight)
                }, 0)
              )
            }, 0)) *
          1000
        ).toFixed(2)
      } catch (error) {
        return 0
      }
    },
    productType(): string {
      return this.productInfo.product_type === 1 ? '产品' : '样品'
    },
    token(): string {
      return this.$store.state.status.token
    }
  },
  created() {
    const initData = {
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
        cellProperties.readOnly = true
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
      contextMenu: false,
      className: 'handsontable',
      number: 1,
      licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
      width: '100%',
      height: 300
    }
    this.tableData.warp = this.deepClone(initData)
    this.tableData.warpBack = this.deepClone(initData)
    this.tableData.weft = this.deepClone(initData)
    this.tableData.weftBack = this.deepClone(initData)
  },
  mounted() {
    this.$checkCommonInfo([
      {
        checkWhich: 'status/token',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getTokenAsync'
      }
    ])
    craft
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.craftInfo = res.data.data
          if (this.craftInfo.is_draft === 1) {
            this.$message('请完善草稿信息')
            this.$router.push('/craft/update?id=' + this.$route.query.id)
          }
          this.productInfo = res.data.data.product_info
          this.tableData.warp.data = this.craftInfo.warp_data.warp_rank.map((item: any, index) => {
            return index !== 1
              ? item
              : item.map((itemJia: number) => {
                  return this.filterIndex(itemJia)
                })
          })
          this.tableData.warp.mergeCells = this.craftInfo.warp_data.merge_data
          this.tableData.warpBack.data = this.craftInfo.warp_data.warp_rank_back.map((item: any, index) => {
            return index !== 1
              ? item
              : item.map((itemJia: number) => {
                  return this.filterIndex(itemJia)
                })
          })
          this.tableData.warpBack.mergeCells = this.craftInfo.warp_data.merge_data_back
          this.tableData.weft.data = this.craftInfo.weft_data.weft_rank.map((item: any, index) => {
            return index !== 1
              ? item
              : item.map((itemJia: number) => {
                  return this.filterIndex(itemJia)
                })
          })
          this.tableData.weft.mergeCells = this.craftInfo.weft_data.merge_data
          this.tableData.weftBack.data = this.craftInfo.weft_data.weft_rank_back.map((item: any, index) => {
            return index !== 1
              ? item
              : item.map((itemJia: number) => {
                  return this.filterIndex(itemJia)
                })
          })
          this.tableData.weftBack.mergeCells = this.craftInfo.weft_data.merge_data_back
          this.initCanvasInfo()
          this.loading = false
        }
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/craft/detail.less';
</style>
<style lang="less">
#craftDetail {
  .el-input.is-disabled .el-input__inner {
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    cursor: default;
  }
  .treeCtn {
    .el-input__inner {
      border: 0 !important;
    }
  }
}
</style>
