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
                @click="$copyTextInfo(craftInfo.craft_code)">复制</span>
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
            <div class="text">{{craftInfo.warp_data.reed_width_explain?(craftInfo.warp_data.reed_width_explain.join('+')+'cm'):'无'}}</div>
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
              <div style="position:relative;display:inline-block"
                v-for="(item,index) in craftInfo.image_data"
                :key="index">
                <i class="el-icon-delete hoverRed"
                  style="position:absolute;right:20px;top:5px;z-index:1"
                  @click="deleteImg(item.id)"></i>
                <el-image style="width:150px;height:150px;margin-right:16px"
                  :src="item.file_url || ''"
                  :preview-src-list="[item.file_url]">
                </el-image>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">图像仿真</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">仿真类型：</div>
            <div style="line-height:36px">
              <el-switch v-model="craftFlag"
                active-text="纱线模拟仿真（速度慢，效果逼真）"
                inactive-text=" 像素格仿真（速度快，效果一般）">
              </el-switch>
              <el-tooltip class="item"
                effect="dark"
                :content="'利用模拟纱线数据进行仿真，仿真效果更真实。模拟时间一般在2-5分钟，请耐心等待，请不要中途关闭浏览器。'"
                placement="top">
                <i class="el-icon-question"
                  style="margin-left:12px"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="row"
          v-if="craftFlag">
          <div class="col">
            <div class="label">纱线选择：
              <span style="float:left">
                <el-tooltip class="item"
                  effect="dark"
                  content="设置成功后请点击此按钮刷新数据"
                  placement="top">
                  <i class="el-icon-refresh hoverGreen fr"
                    style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                    @click="getCraftList"></i>
                </el-tooltip>
                <el-tooltip class="item"
                  effect="dark"
                  content="新增纱线模拟"
                  placement="top">
                  <i class="el-icon-upload hoverOrange fr"
                    style="line-height:38px;font-size:18px;cursor:pointer;"
                    @click="$openUrl('/setting/?pName=工艺单设置&cName=纱线模拟')"></i>
                </el-tooltip>
              </span>
            </div>
            <div class="lineCtn">
              <div class="line">
                <span style="margin-right:12px">经向纱线模拟</span>
                <span class="gray"
                  v-if="!craftYarnWarp.id">默认参数：纱线直径4格(约{{4*(craftCuxiFlag?0.3:0.2)}}mm)；不需要捻；只需要毛羽，密度20%</span>
                <span class="orange"
                  v-if="craftYarnWarp.id">已选{{craftYarnWarp.name}}纱线：纱线直径{{craftYarnWarp.diameter}}格(约：{{$toFixed(craftYarnWarp.diameter*(craftCuxiFlag?0.3:0.2))}}mm)；{{craftYarnWarp.twist_flag===0?'不需要捻':
                    (craftYarnWarp.twist_thickness===2?'捻较细':craftYarnWarp.twist_thickness===4?'捻中等':'捻较粗') + '，' + 
                    (craftYarnWarp.twist_number===10?'比较稀疏':craftYarnWarp.twist_number===16?'中等密集':'非常密集') + '，' +
                    ['','角度1','角度2','角度3','角度4'] [craftYarnWarp.twist_angle]}}； {{['不需要','只需要边','只需要毛羽','只需要圈圈','需要圈圈和毛羽'][craftYarnWarp.hairiness_flag] + '，密度：' + craftYarnWarp.hairiness_density + '%'}}</span>
                <span class="blue"
                  style="margin-left:12px;cursor:pointer"
                  @click="craftYarnFlag = 'Warp'">(点击选择纱线)</span>
              </div>
              <div class="line">
                <span style="margin-right:12px">纬向纱线模拟</span>
                <span class="gray"
                  v-if="!craftYarnWeft.id">默认参数：纱线直径4格(约{{4*(craftCuxiFlag?0.3:0.2)}}mm)；不需要捻；只需要毛羽，密度20%</span>
                <span class="orange"
                  v-if="craftYarnWeft.id">已选{{craftYarnWeft.name}}纱线：纱线直径{{craftYarnWeft.diameter}}格(约：{{$toFixed(craftYarnWeft.diameter*(craftCuxiFlag?0.3:0.2))}}mm)；{{craftYarnWeft.twist_flag===0?'不需要捻':
                    (craftYarnWeft.twist_thickness===2?'捻较细':craftYarnWeft.twist_thickness===4?'捻中等':'捻较粗') + '，' + 
                    (craftYarnWeft.twist_number===10?'比较稀疏':craftYarnWeft.twist_number===16?'中等密集':'非常密集') + '，' +
                    ['','角度1','角度2','角度3','角度4'] [craftYarnWeft.twist_angle]}}； {{['不需要','只需要边','只需要毛羽','只需要圈圈','需要圈圈和毛羽'][craftYarnWeft.hairiness_flag] + '，密度：' + craftYarnWeft.hairiness_density + '%'}}</span>
                <span class="blue"
                  style="margin-left:12px;cursor:pointer"
                  @click="craftYarnFlag = 'Weft'">(点击选择纱线)</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row"
          v-if="craftFlag">
          <div class="col">
            <div class="label">毛羽朝向：</div>
            <div class="btnList">
              <div class="button"
                @click="hairiness_direction=0"
                :class="{'active':hairiness_direction===0}">默认</div>
              <div class="button"
                @click="hairiness_direction=1"
                :class="{'active':hairiness_direction===1}">朝上</div>
              <div class="button"
                @click="hairiness_direction=2"
                :class="{'active':hairiness_direction===2}">朝下</div>
              <div class="button"
                @click="hairiness_direction=3"
                :class="{'active':hairiness_direction===3}">朝左</div>
              <div class="button"
                @click="hairiness_direction=4"
                :class="{'active':hairiness_direction===4}">朝右</div>
            </div>
          </div>
        </div>
        <div class="row"
          v-if="craftFlag">
          <div class="col">
            <div class="label">图像比例：</div>
            <div style="line-height:36px">
              <el-switch v-model="craftDistanceFlag"
                active-text="比例可能失真，图像清晰版"
                inactive-text="比例更加真实，图像模糊版">
              </el-switch>
              <el-tooltip class="item"
                effect="dark"
                :content="'该选项可在图像比例失真的情况下开启，注意该选项不会影响图像渲染的速度，图像模糊只影响视觉效果，不影响图像质量'"
                placement="top">
                <i class="el-icon-question"
                  style="margin-left:12px"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="row"
          v-if="craftFlag">
          <div class="col">
            <div class="label">线条比例：</div>
            <div style="line-height:36px">
              <el-switch v-model="craftCuxiFlag"
                active-text="每格约0.3mm"
                inactive-text="每格约0.2mm">
              </el-switch>
              <el-tooltip class="item"
                effect="dark"
                :content="'需要更细的线条时，可以选择0.2mm比例'"
                placement="top">
                <i class="el-icon-question"
                  style="margin-left:12px"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="row"
          v-if="craftFlag">
          <div class="col">
            <div class="label">经向须头：</div>
            <div style="line-height:36px">
              <el-switch v-model="craftXutouWarpFlag"
                active-text="开启"
                inactive-text="关闭">
              </el-switch>
              <el-tooltip class="item"
                effect="dark"
                :content="'此开关可开启须头模拟,注意必须输入偶数为一股'"
                placement="top">
                <i class="el-icon-question"
                  style="margin-left:12px"></i>
              </el-tooltip>
            </div>
            <div class="elCtn"
              v-if="craftXutouWarpFlag"
              style="margin-left:12px;line-height:36px">
              <el-switch v-model="craftXutouWarpType"
                active-text="捻须"
                inactive-text="散须">
              </el-switch>
            </div>
            <div class="elCtn"
              v-if="craftXutouWarpFlag && craftXutouWarpType"
              style="margin-left:12px;margin-top:4px">
              <el-input placeholder="请输入每几捻为一股"
                v-model="tasselsWarpNum">
                <template slot="append">捻/股</template>
              </el-input>
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
              width:9em;
              left: 0px;
              top: -3em;
              cursor: pointer;
              right: 0;
              margin: auto;
              text-align: center;"
            @click="uploadImg"
            v-if="!craftFlag">上传当前配色图片</span>
          <span class="green"
            style="position: absolute;
              left: 0px;
              top: -1em;
              right: 0;
              margin: auto;
              text-align: center;"
            v-if="craftFlag">提示：效果图模拟完毕。请右键点击图片进行保存，右键保存图片的过程中由于图片过大可能导致电脑卡顿。请耐心等待。</span>
          <div class="col"
            style="margin:0">
            <div class="canvasCtn">
              <div class="mark"
                v-show="craftInfo.warp_data.back_status===1 || craftInfo.weft_data.back_status===1">
                <span>正面</span>
              </div>
              <canvas ref="myCanvas"
                style="display:none"
                :width="canvasWidth"
                :height="canvasHeight"></canvas>
              <img ref="img"
                @mousedown.prevent="showMagnifier=true"
                @mousemove="enlargeImg($event)"
                @mouseup="showMagnifier=false"
                @mouseleave="showMagnifier=false"
                :height="canvasHeight/canvasWidth*600"
                :class="{'cursorMagnifier':showMagnifier}"
                src="" />
              <canvas class="floatRightTop"
                v-show="showMagnifier"
                :style="{'left':canvasLeft,'top':canvasTop}"
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
                :width="canvasWidth"
                :height="canvasHeight"></canvas>
              <img ref="imgBack"
                @mousedown.prevent="showMagnifierBack=true"
                @mousemove="enlargeImg($event,'back')"
                @mouseup="showMagnifierBack=false"
                @mouseleave="showMagnifierBack=false"
                :height="canvasHeight/canvasWidth*600"
                :class="{'cursorMagnifier':showMagnifierBack}"
                src="" />
              <canvas class="floatRightTop"
                ref="magnifierBack"
                v-show="showMagnifierBack"
                :style="{'left':canvasLeft,'top':canvasTop}"
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
    <!-- 绑定仿真纱线 -->
    <div class="popup"
      v-show="craftYarnFlag">
      <div class="main"
        style="width:1000px">
        <div class="titleCtn">
          <span class="text">绑定仿真纱线</span>
          <div class="closeCtn"
            @click="craftYarnFlag=false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="listCtn">
          <div class="filterCtn clearfix">
          </div>
          <div class="list">
            <div class="row title">
              <div class="col">模拟名称</div>
              <div class="col">纱线直径</div>
              <div class="col">纱线捻信息</div>
              <div class="col">纱线边信息</div>
              <div class="col">模拟参考图</div>
              <div class="col">操作</div>
            </div>
            <div class="row"
              v-for="item in craftList"
              :key="item.id">
              <div class="col">{{item.name}}</div>
              <div class="col">{{item.diameter}}格</div>
              <div class="col">{{item.twist_flag===0?'不需要':
                    (item.twist_thickness===2?'较细':item.twist_thickness===4?'中等粗细':'较粗') + ',' + 
                    (item.twist_number===10?'比较稀疏':item.twist_number===16?'中等密集':'非常密集') + ',' +
                    ['','角度1','角度2','角度3','角度4'] [item.twist_angle]
                  }}</div>
              <div class="col">
                {{['不需要','只需要边','只需要毛羽','只需要圈圈','需要圈圈和毛羽'][item.hairiness_flag] + ',密度：' + item.hairiness_density + '%'}}
              </div>
              <div class="col">
                <el-image :style="{'height':item.diameter*10 + 'px'}"
                  :src="item.image_url"
                  fit="cover"></el-image>
              </div>
              <div class="col">
                <span class="opr hoverBlue"
                  @click="bindCraftYarn(item)">绑定</span>
              </div>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="5"
              layout="prev, pager, next, jumper"
              :total="craftTotal"
              :current-page.sync="craftPage"
              @current-change="getCraftList()">
            </el-pagination>
          </div>
        </div>
      </div>
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
interface LineData {
  number: number
  r: number
  g: number
  b: number
  width?: number
  height?: number
}
interface PointData {
  width: number
  height: number
  rr: number
  rg: number
  rb: number
  cr: number
  cg: number
  cb: number
  type: string | number
}

interface DrawData {
  r: number
  g: number
  b: number
  type: 0 | 1 | 2 | 3 | 4 | 5
}
import Vue from 'vue'
import { craft } from '@/assets/js/api'
import { CraftInfo, GLReapeat, GLInfo, CraftParameter } from '@/types/craft'
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
    craftYarnWarp: CraftParameter
    craftYarnWeft: CraftParameter
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
      craftFlag: true,
      craftDistanceFlag: true,
      craftXutouWarpFlag: false,
      craftXutouWarpType: true,
      craftXutouHeight: 0, // 须头模拟拓展高度
      craftXutouWidth: 0, // 须头模拟拓展宽度
      craftYarnIndex: 0,
      craftYarnFlag: false,
      craftCuxiFlag: true,
      xutouHeight: 0,
      craftYarnWarp: {
        id: '',
        image_url: '',
        name: '',
        diameter: 4,
        twist_flag: 0,
        twist_thickness: 4, // 捻粗细：下拉框选择密不密
        twist_number: 10, // 捻数量：下拉框选择密不密
        twist_angle: 1, // 捻角度：下拉框选择
        hairiness_flag: 2, // 是否需要毛羽:0不需要，1.毛边 2.毛羽 3.圈圈
        hairiness_length: 2, // 毛羽长度，下拉框
        circle_number: 2,
        hairiness_density: 20 // 毛羽密度，百分比
      },
      hairiness_direction: 0, // 毛羽朝向
      craftYarnWeft: {
        id: '',
        image_url: '',
        name: '',
        diameter: 4,
        twist_flag: 0,
        twist_thickness: 4, // 捻粗细：下拉框选择密不密
        twist_number: 10, // 捻数量：下拉框选择密不密
        twist_angle: 1, // 捻角度：下拉框选择
        hairiness_flag: 2, // 是否需要毛羽:0不需要，1.毛边 2.毛羽 3.圈圈
        hairiness_length: 2, // 毛羽长度，下拉框
        circle_number: 2,
        hairiness_density: 20 // 毛羽密度，百分比
      },
      hairinessLengthArr: [],
      circleNumberArr: [],
      craftTotal: 1,
      craftPage: 1,
      craftList: [],
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
      canvasWidth: 0,
      canvasHeight: 0,
      canvasLeft: 0,
      canvasTop: 0,
      GLRepeatXuhao: [],
      GLXuhao: [], // 纹版图循环重算序号
      completeGL: [], // 纹版图根据纹版图循环补充完整
      warpCanvas: [],
      warpCanvasBack: [],
      weftCanvas: [],
      weftCanvasBack: [],
      showMagnifier: false, // 放大镜
      showMagnifierBack: false,
      showImageLoading: false,
      showGLFlag: false,
      GLYulan: [],
      selectColour: -1, // 选择配色
      warpTable: [],
      weftTable: [],
      warpTableBack: [],
      weftTableBack: [],
      warpDistance: 1, // 经向缝隙
      weftDistance: 1, // 纬向缝隙
      draftMethodMatrix: [], // 新版结合穿宗法纹版图的01矩阵
      rgbSide1: 0.96,
      rgbSide2: 0.92,
      rgbShadow: 0.85,
      ctx: null,
      dom: null,
      ctxBack: null,
      domBack: null,
      tasselsWarpNum: 12, // 默认十二根为一股
      tasselsWeftNum: 12
    }
  },
  methods: {
    getCraftList() {
      craft
        .parameterList({
          page: this.craftPage,
          limit: 5
        })
        .then((res) => {
          if (res.data.status) {
            this.craftList = res.data.data.items
            this.craftTotal = res.data.data.total
          }
        })
    },
    // 绑定纱线和仿真参数
    bindCraftYarn(info: CraftParameter) {
      this['craftYarn' + this.craftYarnFlag] = info
      this.craftYarnFlag = false
      this.$message.success('模拟纱线已绑定成功')
    },
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

      // 展开表格
      this.warpTable = this.getFlatTable(this.craftInfo.warp_data.warp_rank, 'warp')
      this.warpTableBack = this.getFlatTable(this.craftInfo.warp_data.warp_rank_back, 'warpBack')
      this.weftTable = this.getFlatTable(this.craftInfo.weft_data.weft_rank, 'weft')
      this.weftTableBack = this.getFlatTable(this.craftInfo.weft_data.weft_rank_back, 'weftBack')

      // 将展开的合并信息结合穿综和纹版信息
      let warpGetPMNum: any = []
      let weftGetGLNum: any = []
      let warpGetPMNumBack: any = []
      let weftGetGLNumBack: any = []
      this.warpTable.forEach((item: any) => {
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
      this.weftTable.forEach((item: any) => {
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

      this.warpTableBack.forEach((item: any) => {
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
      this.weftTableBack.forEach((item: any) => {
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
      this.warpTable.forEach((item: any) => {
        for (let i = 0; i < item.number; i++) {
          warpCanvas.push({
            color: item.jia,
            PM: warpGetPM[warpCanvas.length]
          })
        }
      })
      this.weftTable.forEach((item: any) => {
        for (let i = 0; i < item.number; i++) {
          weftCanvas.push({
            color: item.jia,
            GL: weftGetGL[weftCanvas.length]
          })
        }
      })
      this.warpTableBack.forEach((item: any) => {
        for (let i = 0; i < item.number; i++) {
          warpCanvasBack.push({
            color: item.jia,
            PM: warpGetPMBack[warpCanvasBack.length]
          })
        }
      })
      this.weftTableBack.forEach((item: any) => {
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
      this.$message.warning(
        '效果图正在仿真模拟，模拟时间一般需要1-5分钟，请耐心等待，中途不要关闭浏览器。如出现崩溃，请重复刷新浏览器页面再次模拟'
      )
      this.showImageLoading = true
      this.selectColour = colorId ? colorId : index
      this.dom = this.$refs.myCanvas
      this.ctx = this.dom.getContext('2d')
      this.domBack = this.$refs.myCanvasBack
      this.ctxBack = this.domBack.getContext('2d')
      // 初始化新版本所需要的数据，因为需要用到rgb，因此在选择完色组之后才能初始化
      if (this.craftFlag) {
        this.initComplexCanvas(colorId)
      } else {
        // 宽度定死
        this.canvasWidth = 2400
        // 高度计算
        this.canvasHeight =
          (Number(this.craftInfo.weft_data.neichang) /
            (Number(this.craftInfo.calc_weight_way) === 1
              ? Number(this.craftInfo.warp_data.reed_width)
              : Number(this.craftInfo.weft_data.peifu))) *
          600 *
          4
        setTimeout(() => {
          const warpColor = colorId
            ? this.craftInfo.warp_data.color_data.find((item) => item.color_id === colorId)!.color_scheme
            : this.craftInfo.warp_data.color_data.find((item, index) => index === this.selectColour)!.color_scheme
          const weftColor = colorId
            ? this.craftInfo.weft_data.color_data.find((item) => item.color_id === colorId)!.color_scheme
            : this.craftInfo.weft_data.color_data.find((item, index) => index === this.selectColour)!.color_scheme
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
          // 有反面的时候要注意可能经纬向有数据不存在的情况,这时候数据就等于正面的
          if (this.craftInfo.warp_data.back_status === 1 || this.craftInfo.weft_data.back_status === 1) {
            this.warpCanvasBack = this.warpCanvasBack.length > 0 ? this.warpCanvasBack : this.warpCanvas
            this.weftCanvasBack = this.weftCanvasBack.length > 0 ? this.weftCanvasBack : this.weftCanvas
          }
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
          this.ctxBack.beginPath()
          this.ctxBack.clearRect(0, 0, 2400, this.canvasHeight)
          canvasMatrixBack.forEach((item) => {
            this.ctxBack.fillStyle = item.color
            this.ctxBack.fillRect(item.x, item.y, item.width, item.height)
          })
          this.changeCanvasToImage()
        }, 100)
      }
    },
    // 把canvas放到image里
    changeCanvasToImage() {
      let img: any = this.$refs.img
      img.src = this.dom.toDataURL() // canvas转图片
      let imgBack: any = this.$refs.imgBack
      imgBack.src = this.domBack.toDataURL()
      this.showImageLoading = false
      window.scrollTo(0, 9999)
    },
    // 放大镜效果实现
    enlargeImg(point: any, ifBack: string) {
      // 放大镜效果实现
      this.canvasLeft = point.clientX + 10 + 'px'
      this.canvasTop = point.clientY - 200 + 'px'
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
          point.offsetX * (this.canvasWidth / 600) - drawWidth / 2,
          point.offsetY * (this.canvasWidth / 600) - drawHeight / 2,
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
          point.offsetX * (this.canvasWidth / 600) - drawWidth / 2,
          point.offsetY * (this.canvasWidth / 600) - drawHeight / 2,
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
    // 新版工艺单初始化
    initComplexCanvas(colourIndex: number) {
      this.draftMethodMatrix = []
      let reverseWeft = [...this.weftCanvas].reverse() // 纬向反着画
      // 根据穿宗法纹版图把01矩阵搞出来
      reverseWeft.forEach((itemWeft, indexWeft) => {
        this.draftMethodMatrix.push([])
        this.warpCanvas.forEach((itemWarp) => {
          this.draftMethodMatrix[indexWeft].push(
            itemWeft.GL.replace(/，/g, ',')
              .split(',')
              .find((item) => item === itemWarp.PM)
              ? 1
              : 0
          )
        })
      })
      // 把经纬向的01矩阵搞出来
      let warpRealData: LineData[] = []
      let weftRealData: LineData[] = []
      let warpBackRealData: LineData[] = []
      let weftBackRealData: LineData[] = []
      const matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/
      const warpColourArr = colourIndex
        ? this.craftInfo.warp_data.color_data
            .find((item) => item.color_id === colourIndex)!
            .color_scheme.map((item) => {
              return this.hexToRGB(item.color)
            })
        : this.craftInfo.warp_data.color_data
            .find((item, index) => index === this.selectColour)!
            .color_scheme.map((item) => {
              return this.hexToRGB(item.color)
            })

      const weftColourArr = colourIndex
        ? this.craftInfo.weft_data.color_data
            .find((item) => item.color_id === colourIndex)!
            .color_scheme.map((item) => {
              return this.hexToRGB(item.color)
            })
        : this.craftInfo.weft_data.color_data
            .find((item, index) => index === this.selectColour)!
            .color_scheme.map((item) => {
              return this.hexToRGB(item.color)
            })

      // warpTable,weftTable转成新版本所需要的数据
      warpRealData = this.warpTable.map((item: any) => {
        const color: any = matchColors.exec(warpColourArr[item.jia])
        return {
          number: Number(item.number),
          r: color[1],
          g: color[2],
          b: color[3],
          width: this.craftYarnWarp.diameter
        }
      })
      weftRealData = this.weftTable.map((item: any) => {
        const color: any = matchColors.exec(weftColourArr[item.jia])
        return {
          number: Number(item.number),
          r: color[1],
          g: color[2],
          b: color[3],
          height: this.craftYarnWeft.diameter
        }
      })
      weftRealData.reverse() // 纬向反着画
      warpBackRealData = this.warpTableBack.map((item: any) => {
        const color: any = matchColors.exec(warpColourArr[item.jia])
        return {
          number: Number(item.number),
          r: color[1],
          g: color[2],
          b: color[3],
          width: this.craftYarnWarp.diameter
        }
      })
      weftBackRealData = this.weftTableBack.map((item: any) => {
        const color: any = matchColors.exec(weftColourArr[item.jia])
        return {
          number: Number(item.number),
          r: color[1],
          g: color[2],
          b: color[3],
          height: this.craftYarnWeft.diameter
        }
      })
      weftBackRealData.reverse()
      // 计算经纬向的缝隙大小，约定1px≈0.3mm
      const warpDistance =
        (Number(this.craftInfo.warp_data.reed_width) * 10 -
          warpRealData.reduce((total, cur: any) => {
            return total + cur.number * cur.width * (this.craftCuxiFlag ? 0.3 : 0.2)
          }, 0)) /
        (Number(this.craftInfo.warp_data.weft) - 1) /
        (this.craftCuxiFlag ? 0.3 : 0.2)
      const weftDistance =
        (Number(this.craftInfo.weft_data.neichang) * 10 -
          weftRealData.reduce((total, cur: any) => {
            return total + cur.number * cur.height * (this.craftCuxiFlag ? 0.3 : 0.2)
          }, 0)) /
        (Number(this.craftInfo.weft_data.total) - 1) /
        (this.craftCuxiFlag ? 0.3 : 0.2)
      if (warpDistance < 0) {
        this.$message.warning('经过初步计算检测到经向缝隙小于0，建议选择更细的纱线')
      }
      if (weftDistance < 0) {
        this.$message.warning('经过初步计算检测到纬向缝隙小于0，建议选择更细的纱线')
      }
      if (this.craftDistanceFlag) {
        this.warpDistance = Math.round(warpDistance) < 1 ? 1 : Math.round(warpDistance)
        this.weftDistance = Math.round(weftDistance) < 1 ? 1 : Math.round(weftDistance)
      } else {
        this.warpDistance = warpDistance < 0 ? 0 : warpDistance
        this.weftDistance = weftDistance < 0 ? 0 : weftDistance
      }
      // 根据计算出来缝隙大小确定最终canvas的实际宽高像素,注意这个像素大概率和原来围巾的比例不一样，20是留白
      this.canvasHeight =
        20 +
        weftRealData.reduce((total, cur: any) => {
          return total + cur.number * cur.height
        }, 0) +
        this.weftDistance * (weftRealData.reduce((total, cur) => total + cur.number, 0) - 1)

      this.canvasWidth =
        20 +
        warpRealData.reduce((total, cur: any) => {
          return total + cur.number * cur.width
        }, 0) +
        this.warpDistance * (warpRealData.reduce((total, cur) => total + cur.number, 0) - 1)
      // 得到初始矩阵，只包含type01
      const matrixData = this.changeLineToMatrix(weftRealData, warpRealData)
      // const matrixBackData = this.changeLineToMatrix(weftBackRealData, warpBackRealData)
      // 宽高像素个数（数组个数）
      const matrixWidth = matrixData[0].reduce((total, item) => total + item.height, 0) + matrixData[0].length - 1
      const matrixHeight = matrixData.reduce((total, item) => total + item[0].width, 0) + matrixData.length - 1

      // 初始矩阵转换成更复杂的矩阵，包含type012345,该矩阵是最细节的点阵，理论上后续所有的图像部分都可以由这个数据绘制，实际上做了一层优化，把主体部分进行合并减少渲染的循环
      const weftCanvasData = this.initLineFn(matrixData, 'weft', matrixWidth)
      const warpCanvasData = this.initLineFn(this.transposeArr(matrixData), 'warp', matrixHeight)
      // const weftBackCanvasData = this.initLineFn(matrixBackData, 'weft', matrixWidth)
      // const warpBackCanvasData = this.initLineFn(this.transposeArr(matrixBackData), 'warp', matrixHeight)
      // 复杂矩阵主体部分优化后的数据,合并同类型的方块
      const weftCanvasMainData = this.initMainMatrix(weftCanvasData, this.warpDistance)
      const warpCanvasMainData = this.initMainMatrix(warpCanvasData, this.weftDistance)
      // const weftCanvasBackMainData = this.initMainMatrix(weftBackCanvasData, this.warpDistance)
      // const warpCanvasBackMainData = this.initMainMatrix(warpBackCanvasData, this.weftDistance)

      // console.log(weftRealData, warpRealData)
      // return

      // 绘制须头独立代码
      if (this.craftXutouWarpFlag) {
        this.tasselsWarpNum = Number(this.tasselsWarpNum)
        this.tasselsWeftNum = Number(this.tasselsWeftNum)
        // 第一步：确认须头长度
        const tasselsWarpWidth = (Number(this.craftInfo.weft_data.rangwei) / 2 / (this.craftCuxiFlag ? 0.3 : 0.2)) * 10 // 厘米转成毫米
        const tasselsWeftWidthLeft =
          (Number(this.craftInfo.warp_data.reed_width_explain[0]) / (this.craftCuxiFlag ? 0.3 : 0.2)) * 10
        const tasselsWeftWidthRight =
          (Number(this.craftInfo.warp_data.reed_width_explain[2]) / (this.craftCuxiFlag ? 0.3 : 0.2)) * 10
        // 第二步：获取经纬向须头数据,用realData+缝隙生成新的数据
        const tasselsWarp = this.changeLineToTassels(warpRealData)
        const tasselsWeft = this.changeLineToTassels(weftRealData)

        // 第三步：根据用户输入的捻参数确认须头坐标点阵
        const tasselsWarpForNum = Math.round(
          tasselsWarpWidth /
            (this.tasselsWarpNum *
              (this.craftYarnWarp.diameter + this.warpDistance) *
              (this.craftCuxiFlag ? 0.3 : 0.2)) /
            Math.SQRT2
        )
        this.xutouHeight = ((tasselsWarpForNum * this.tasselsWarpNum) / 2) * (1 + this.craftYarnWarp.diameter)

        if (this.craftXutouWarpType) {
          const tasselsWarpMatrix = this.getTasselsMatrix(
            tasselsWarp,
            [10, this.canvasHeight - 10 + this.xutouHeight],
            this.warpDistance,
            this.craftYarnWarp.diameter,
            tasselsWarpForNum,
            'warp'
          )
          this.drawTassels(this.ctx, true, tasselsWarpMatrix, 'warp')
        } else {
          this.drawTasselsEasy(this.ctx, tasselsWarp, 'warp', 'top')
          this.drawTasselsEasy(this.ctx, tasselsWarp, 'warp', 'bottom')
        }
        if (this.craftInfo.warp_data.back_status === 1 || this.craftInfo.weft_data.back_status === 1) {
          // 画反面的时候经向或者纬向没数据就用正面的
          if (weftBackRealData.length === 0) {
            weftBackRealData = weftRealData
          }
          if (warpBackRealData.length === 0) {
            warpBackRealData = warpRealData
          }
          const tasselsWarpBack = this.changeLineToTassels(warpBackRealData)
          const tasselsWeftBack = this.changeLineToTassels(weftBackRealData)
          if (this.craftXutouWarpType) {
            const tasselsWarpBackMatrix = this.getTasselsMatrix(
              tasselsWarpBack,
              [10, this.canvasHeight - 10 + this.xutouHeight],
              this.warpDistance,
              this.craftYarnWarp.diameter,
              tasselsWarpForNum,
              'warp'
            )
            this.drawTassels(this.ctxBack, true, tasselsWarpBackMatrix, 'warp')
          } else {
            this.drawTasselsEasy(this.ctxBack, tasselsWarpBack, 'warp', 'top')
            this.drawTasselsEasy(this.ctxBack, tasselsWarpBack, 'warp', 'bottom')
          }
        }

        this.canvasHeight += this.xutouHeight * 2
      }
      this.drawMainReal(this.ctx, weftCanvasMainData, 'weft')
      this.drawMainReal(this.ctx, warpCanvasMainData, 'warp')
      this.drawTwistShadow(this.ctx, weftCanvasData, 'weft', this.craftYarnWeft.twist_flag)
      this.drawTwistShadow(this.ctx, warpCanvasData, 'warp', this.craftYarnWarp.twist_flag)
      this.drawLine(
        this.ctx,
        weftCanvasData,
        'weft',
        this.craftYarnWeft.hairiness_density,
        this.craftYarnWeft.hairiness_flag === 2 || this.craftYarnWeft.hairiness_flag === 4,
        this.craftYarnWeft.hairiness_flag === 3 || this.craftYarnWeft.hairiness_flag === 4
      )
      this.drawLine(
        this.ctx,
        warpCanvasData,
        'warp',
        this.craftYarnWarp.hairiness_density,
        this.craftYarnWarp.hairiness_flag === 2 || this.craftYarnWarp.hairiness_flag === 4,
        this.craftYarnWarp.hairiness_flag === 3 || this.craftYarnWarp.hairiness_flag === 4
      )
      if (this.craftInfo.warp_data.back_status === 1 || this.craftInfo.weft_data.back_status === 1) {
        // 画反面的时候经向或者纬向没数据就用正面的
        if (weftBackRealData.length === 0) {
          weftBackRealData = weftRealData
        }
        if (warpBackRealData.length === 0) {
          warpBackRealData = warpRealData
        }
        const matrixBackData = this.changeLineToMatrix(weftBackRealData, warpBackRealData)
        const weftBackCanvasData = this.initLineFn(matrixBackData, 'weft', matrixWidth)
        const warpBackCanvasData = this.initLineFn(this.transposeArr(matrixBackData), 'warp', matrixHeight)
        const weftCanvasBackMainData = this.initMainMatrix(weftBackCanvasData, this.warpDistance)
        const warpCanvasBackMainData = this.initMainMatrix(warpBackCanvasData, this.weftDistance)
        this.drawMainReal(this.ctxBack, weftCanvasBackMainData, 'weft')
        this.drawMainReal(this.ctxBack, warpCanvasBackMainData, 'warp')
        this.drawTwistShadow(this.ctxBack, weftBackCanvasData, 'weft', this.craftYarnWeft.twist_flag)
        this.drawTwistShadow(this.ctxBack, warpBackCanvasData, 'warp', this.craftYarnWarp.twist_flag)
        this.drawLine(
          this.ctxBack,
          weftBackCanvasData,
          'weft',
          this.craftYarnWeft.hairiness_density,
          this.craftYarnWeft.hairiness_flag === 2 || this.craftYarnWeft.hairiness_flag === 4,
          this.craftYarnWeft.hairiness_flag === 3 || this.craftYarnWeft.hairiness_flag === 4
        )
        this.drawLine(
          this.ctxBack,
          warpBackCanvasData,
          'warp',
          this.craftYarnWarp.hairiness_density,
          this.craftYarnWarp.hairiness_flag === 2 || this.craftYarnWarp.hairiness_flag === 4,
          this.craftYarnWarp.hairiness_flag === 3 || this.craftYarnWarp.hairiness_flag === 4
        )
      }
      window.setTimeout(() => {
        this.changeCanvasToImage()
      })
    },
    // 把经纬向线数据转化成须头所需要的线数据，其实就是展开
    changeLineToTassels(data: LineData[]): Array<{ width: number; r: number; g: number; b: number }> {
      const returnData: { width: number; r: number; g: number; b: number }[] = []
      data.forEach((item) => {
        for (let i = 0; i < item.number; i++) {
          returnData.push({
            r: item.r,
            g: item.g,
            b: item.b,
            width: (item.width || item.height) as number
          })
        }
      })
      return returnData
    },
    // 把须头坐标矩阵确定下来:coordinate初始坐标，distance缝隙距离：捻须函数！！
    getTasselsMatrix(
      data: Array<{ width: number; r: number; g: number; b: number }>,
      coordinate: number[],
      distance: number,
      width: number,
      forNum: number,
      type: 'warp' | 'weft'
    ) {
      const returnData: {
        r: number
        g: number
        b: number
        coordinate: { x: number; y: number }[] | { x: number; y: number }[]
      }[] = []

      // 假设每12根捻在一起（暂定此数字必为偶数，即一股由均匀的左半股和右半股组成）
      const tasselsNum = type === 'warp' ? this.tasselsWarpNum : this.tasselsWeftNum

      // 先把data根据捻在一起的数据划分成均匀的矩阵
      /*
        1.先找到每一股捻的中点，以十二根为一股，中点坐标是 初始坐标 + 12*(线(width) + *缝隙(distance)) / 2
        2.确定中点坐标之后再确定每根线的折线点坐标
      */

      const realDistance = 1 // 约定1为捻须的绘制缝隙，防止缝隙过大，如果需要完全去掉缝隙，把这个字段设为0
      const space = tasselsNum * (width + distance) // 设定两个捻之间的距离
      const realWidth = (tasselsNum * (width + realDistance)) / 2

      let start = coordinate[0] + space * 0.5 - realWidth / 2 // 初始化起始坐标
      let end = coordinate[0] + space * 0.5 + realWidth / 2 // 初始化终点坐标
      let initY = coordinate[1]

      // 把data转化成以捻为一组的二维矩阵，注意这里的捻是半股，也就是左半股+右半股+左半股+右半股+...
      const strandMatrix = []
      for (let i = 0; i <= data.length; i += tasselsNum) {
        if (i + tasselsNum / 2 < data.length) {
          strandMatrix.push(data.slice(i, i + tasselsNum / 2))
          strandMatrix.push(data.slice(i + tasselsNum / 2, i + tasselsNum))
        }
      }

      // 下面的
      strandMatrix.forEach((item, index) => {
        if (index % 2 === 0) {
          item.forEach((itemChild, indexChild) => {
            const coordinate = []
            for (let i = 0; i < forNum; i++) {
              if (i % 2 === 0) {
                coordinate.push({
                  x: start + indexChild * (realDistance + width),
                  y: initY
                })
                coordinate.push({
                  x: end,
                  y: initY + realWidth - indexChild * (realDistance + width)
                })
              } else {
                coordinate.push({
                  x: end - indexChild * (realDistance + width),
                  y: initY
                })
                coordinate.push({
                  x: start,
                  y: initY + realWidth - indexChild * (realDistance + width)
                })
              }
              initY += realWidth
            }
            returnData.push({
              r: itemChild.r,
              g: itemChild.g,
              b: itemChild.b,
              coordinate: coordinate
            })
            initY = initY - forNum * realWidth
          })
        } else {
          item.forEach((itemChild, indexChild) => {
            const coordinate = []
            for (let i = 0; i < forNum; i++) {
              if (i % 2 === 0) {
                coordinate.push({
                  x: end - indexChild * (realDistance + width),
                  y: initY
                })
                coordinate.push({
                  x: start,
                  y: initY + realWidth - indexChild * (realDistance + width)
                })
              } else {
                coordinate.push({
                  x: start + indexChild * (realDistance + width),
                  y: initY
                })
                coordinate.push({
                  x: end,
                  y: initY + realWidth - indexChild * (realDistance + width)
                })
              }
              initY += realWidth
            }
            returnData.push({
              r: itemChild.r,
              g: itemChild.g,
              b: itemChild.b,
              coordinate: coordinate
            })
            initY = initY - forNum * realWidth
          })
          start += space
          end += space
        }
      })
      // 上面的
      start = coordinate[0] + space * 0.5 - realWidth / 2 // 初始化起始坐标
      end = coordinate[0] + space * 0.5 + realWidth / 2 // 初始化终点坐标
      initY = this.xutouHeight + 10
      strandMatrix.forEach((item, index) => {
        if (index % 2 === 0) {
          item.forEach((itemChild, indexChild) => {
            const coordinate = []
            for (let i = 0; i < forNum; i++) {
              if (i % 2 === 0) {
                coordinate.push({
                  x: start + indexChild * (realDistance + width),
                  y: initY
                })
                coordinate.push({
                  x: end,
                  y: initY - realWidth + indexChild * (realDistance + width)
                })
              } else {
                coordinate.push({
                  x: end - indexChild * (realDistance + width),
                  y: initY
                })
                coordinate.push({
                  x: start,
                  y: initY - realWidth + indexChild * (realDistance + width)
                })
              }
              initY -= realWidth
            }
            returnData.push({
              r: itemChild.r,
              g: itemChild.g,
              b: itemChild.b,
              coordinate: coordinate
            })
            initY = initY + forNum * realWidth
          })
        } else {
          item.forEach((itemChild, indexChild) => {
            const coordinate = []
            for (let i = 0; i < forNum; i++) {
              if (i % 2 === 0) {
                coordinate.push({
                  x: end - indexChild * (realDistance + width),
                  y: initY
                })
                coordinate.push({
                  x: start,
                  y: initY - realWidth + indexChild * (realDistance + width)
                })
              } else {
                coordinate.push({
                  x: start + indexChild * (realDistance + width),
                  y: initY
                })
                coordinate.push({
                  x: end,
                  y: initY - realWidth + indexChild * (realDistance + width)
                })
              }
              initY -= realWidth
            }
            returnData.push({
              r: itemChild.r,
              g: itemChild.g,
              b: itemChild.b,
              coordinate: coordinate
            })
            initY = initY + forNum * realWidth
          })
          start += space
          end += space
        }
      })
      return returnData
    },
    // 把经纬向线数据转化成点阵
    changeLineToMatrix(weftData: LineData[], warpData: LineData[]): PointData[][] {
      const weftLength = weftData.reduce((total, cur) => cur.number + total, 0)
      const warpLength = warpData.reduce((total, cur) => cur.number + total, 0)
      const returnData: PointData[][] = new Array(weftLength).fill(0).map(() => {
        return new Array(warpLength).fill(0).map(() => {
          return {
            width: 0,
            height: 0,
            rr: 0,
            rg: 0,
            rb: 0,
            cr: 0,
            cg: 0,
            cb: 0,
            type: ''
          }
        })
      })
      this.lineToMatrix(weftData, 'weft', warpLength, returnData)
      this.lineToMatrix(warpData, 'warp', weftLength, returnData)
      return returnData
    },
    lineToMatrix(info: LineData[], type: 'warp' | 'weft', length: number, returnData: PointData[][]) {
      let j = 0
      info.forEach((item) => {
        for (let i = j; i < item.number + j; i++) {
          for (let k = 0; k < length; k++) {
            if (type === 'weft') {
              returnData[i][k].height = item.height as number
              if (this.draftMethodMatrix[i][k] === 0) {
                returnData[i][k].type = 0
              }
              returnData[i][k].rr = item.r
              returnData[i][k].rg = item.g
              returnData[i][k].rb = item.b
            } else {
              returnData[k][i].width = item.width as number
              if (this.draftMethodMatrix[k][i] === 1) {
                returnData[k][i].type = 1
              }
              returnData[k][i].cr = item.r
              returnData[k][i].cg = item.g
              returnData[k][i].cb = item.b
            }
          }
        }
        j += item.number
      })
    },
    // 矩阵翻转90°函数
    transposeArr<T>(A: T[][]): T[][] {
      const rows = A.length
      const cols = A[0].length
      const result = new Array(cols).fill(new Array(rows).fill(''))
      for (let i = 0; i < cols; i++) {
        result[i] = []
        for (let j = 0; j < rows; j++) {
          result[i][j] = A[j][i]
        }
      }
      return result
    },
    initLineFn(data: PointData[][], type: 'warp' | 'weft', length: number) {
      let realMatrix: Array<Array<2 | DrawData[]>> = []
      if (type === 'warp') {
        data.forEach((item) => {
          const yHeight = item[0].height as number // 确认线的高度，一次就够，一根线是一样粗的，不用每次都获取
          realMatrix = realMatrix.concat(
            this.initLine(
              item,
              type,
              length,
              yHeight,
              this.craftYarnWarp.twist_angle,
              this.craftYarnWarp.twist_thickness
            )
          )
        })
      } else {
        data.forEach((item) => {
          const xWidth = item[0].width as number // 确认线的高度，一次就够，一根线是一样粗的，不用每次都获取
          realMatrix = realMatrix.concat(
            this.initLine(
              item,
              type,
              length,
              xWidth,
              this.craftYarnWeft.twist_angle,
              this.craftYarnWeft.twist_thickness
            )
          )
        })
      }
      realMatrix.pop()
      return realMatrix
    },
    /* 
      将已有的行列矩阵数据二次处理，一行一行一列一列的再仔细处理成新版本带各种纱线细节的矩阵
      细节包括捻，阴影，隔行
      矩阵中包含三种元素
      0:经向(纵向)实线像素，rgb为原色，大小为1像素
      1:阴影像素，原件(r，g，b);阴影(rs，gs，bs)：rs = r * 0.25，gs = g * 0.25，bs = b * 0.25(这是一个非常深的阴影)，目前取的0.75，大小为1像素
      2:留白像素，大小>1px，其中1px用于给画边预留，剩余部分通过公式计算得到空白缝隙
      3:实线透明像素，大小为1像素，透明度0
      4.留白实线像素，同4，和0大小不同的像素块 （所有的留白缝隙都需要绘制实线颜色，以模拟另外一层纱线从底部穿过的效果）
      5.留白阴影像素，同4，和1大小不同的像素块
    */
    initLine(
      data: PointData[],
      type: 'warp' | 'weft',
      long: number,
      short: number,
      angle = 1,
      thickness = 6
    ): Array<Array<2 | DrawData[]>> {
      /*
      解释下角度 和 粗细 
      现在有一个矩阵如下
      0,0,0,0,0,0,0,0,0,0,0,0,0
      0,0,0,0,0,0,0,0,0,0,0,0,0
      0,0,0,0,0,0,0,0,0,0,0,0,0
      0,0,0,0,0,0,0,0,0,0,0,0,0
      0,0,0,0,0,0,0,0,0,0,0,0,0
      
      假设angle = 1 , thickness = 5 
      我们可以这样画斜线
      1,0,0,0,0,0,0,0,0,1,0,0,0
      0,1,0,0,0,0,0,0,0,0,1,0,0
      0,0,1,0,0,0,0,0,0,0,0,1,0
      0,0,0,1,0,0,0,0,0,0,0,0,1
      0,0,0,0,1,0,0,0,0,0,0,0,0
      矩阵只标记了斜线主体部分的角度，以1为起始点，根据thickness参数随机加粗为1-5的粗细即可
      假设angle = 2
      我们可以这样画斜线
      1,0,0,0,0,0,0,0,0,0,0,0,0
      0,0,1,0,0,0,0,0,0,0,0,0,0
      0,0,0,0,1,0,0,0,0,0,0,0,0
      0,0,0,0,0,0,1,0,0,0,0,0,0
      0,0,0,0,0,0,0,0,1,0,0,0,0
    */
      // 初始化一个宽高矩阵
      const initRectArr = this.initRect(long, short)
      // 根据捻是否密集参数确认捻的数量
      let distanceAvg =
        this['craftYarnW' + type.slice(1)].twist_number + this['craftYarnW' + type.slice(1)].twist_thickness - 3 // 根据参数确定捻的距离 10 16 22
      let twistNumAvg = Math.round(long / distanceAvg) // 根据实际情况确定捻的实际数量平均值
      const twistNum = this.myRandom(twistNumAvg - 10, twistNumAvg + 10) // 捻的平均值再取一个随机数
      const distance = Math.floor(long / twistNum) // 距离向下取整，余数留给最后一捻
      const twistInitArr = this.randomArray(this.initTwistDistance(twistNum, distance)) // 捻距随机数组
      for (let i = 0; i < short; i++) {
        twistInitArr.reduce((total, item) => {
          // const randomDis = this.myRandom(0, 1)
          for (let j = 0; j < thickness; j++) {
            // const y = total + j + randomDis
            const y = total + j
            initRectArr[i][y] = 1
          }
          return total + item
        }, i * angle)
      }
      // 优化掉结尾
      initRectArr.forEach((item) => {
        item.length = long
      })
      // 先把实线+透明+阴影的矩阵算出来
      if (type === 'weft') {
        // 把条件写在外面是减少循环内的条件判断
        data.reduce((total: number, item: PointData, index: number) => {
          // type=1显示经纱颜色,纬向透明
          if (item.type === 1) {
            for (let i = total; i < total + item.height; i++) {
              for (let j = 0; j < short; j++) {
                initRectArr[j][i] = 3
              }
            }
            // 最后一次循环加阴影去掉
            if (index === data.length - 1) {
              return 0
            }
            // 为了减少判断再加一层循环，把最后一层留白元素：4，补上
            for (let j = 0; j < short; j++) {
              const type = initRectArr[j][total + item.height]
              initRectArr[j][total + item.height] = {
                type: type === 0 ? 4 : 5,
                r: Math.max(
                  j === 0 || j === short - 1 ? item.rr - 20 : j === 1 || j === short - 2 ? item.rr - 10 : item.rr,
                  0
                ),
                g: Math.max(
                  j === 0 || j === short - 1 ? item.rg - 20 : j === 1 || j === short - 2 ? item.rg - 10 : item.rg,
                  0
                ),
                b: Math.max(
                  j === 0 || j === short - 1 ? item.rb - 20 : j === 1 || j === short - 2 ? item.rb - 10 : item.rb,
                  0
                )
              }
            }
          } else {
            // 把需要绘制的rgb记录一下方便后续绘制
            for (let i = total; i < total + item.height; i++) {
              for (let j = 0; j < short; j++) {
                const type = initRectArr[j][i]
                initRectArr[j][i] = {
                  type: type,
                  r: Math.max(
                    j === 0 || j === short - 1 ? item.rr - 20 : j === 1 || j === short - 2 ? item.rr - 10 : item.rr,
                    0
                  ),
                  g: Math.max(
                    j === 0 || j === short - 1 ? item.rg - 20 : j === 1 || j === short - 2 ? item.rg - 10 : item.rg,
                    0
                  ),
                  b: Math.max(
                    j === 0 || j === short - 1 ? item.rb - 20 : j === 1 || j === short - 2 ? item.rb - 10 : item.rb,
                    0
                  )
                }
              }
            }
            // 最后一次循环加阴影去掉
            if (index === data.length - 1) {
              return 0
            }
            // 为了减少判断再加一层循环，把最后一层留白实线/阴影元素：4/5，补上
            for (let j = 0; j < short; j++) {
              const type = initRectArr[j][total + item.height]
              initRectArr[j][total + item.height] = {
                type: type === 0 ? 4 : 5,
                r: Math.max(
                  j === 0 || j === short - 1 ? item.rr - 20 : j === 1 || j === short - 2 ? item.rr - 10 : item.rr,
                  0
                ),
                g: Math.max(
                  j === 0 || j === short - 1 ? item.rg - 20 : j === 1 || j === short - 2 ? item.rg - 10 : item.rg,
                  0
                ),
                b: Math.max(
                  j === 0 || j === short - 1 ? item.rb - 20 : j === 1 || j === short - 2 ? item.rb - 10 : item.rb,
                  0
                )
              }
            }
          }
          return total + item.height + 1 // 这个加1加的就是缝隙
        }, 0)
      } else {
        data.reduce((total: number, item: PointData, index: number) => {
          // type=1显示经纱颜色,纬向透明
          if (item.type === 0) {
            for (let i = total; i < total + item.width; i++) {
              for (let j = 0; j < short; j++) {
                initRectArr[j][i] = 3
              }
            }
            // 最后一次循环加阴影去掉
            if (index === data.length - 1) {
              return 0
            }
            // 为了减少判断再加一层循环，把最后一层留白元素：4，补上
            for (let j = 0; j < short; j++) {
              const type = initRectArr[j][total + item.width]
              initRectArr[j][total + item.width] = {
                type: type === 0 ? 4 : 5,
                r: Math.max(
                  j === 0 || j === short - 1 ? item.cr - 20 : j === 1 || j === short - 2 ? item.cr - 10 : item.cr,
                  0
                ),
                g: Math.max(
                  j === 0 || j === short - 1 ? item.cg - 20 : j === 1 || j === short - 2 ? item.cg - 10 : item.cg,
                  0
                ),
                b: Math.max(
                  j === 0 || j === short - 1 ? item.cb - 20 : j === 1 || j === short - 2 ? item.cb - 10 : item.cb,
                  0
                )
              }
            }
          } else {
            // 把需要绘制的rgb记录一下方便后续绘制
            for (let i = total; i < total + item.width; i++) {
              for (let j = 0; j < short; j++) {
                const type = initRectArr[j][i]
                initRectArr[j][i] = {
                  type: type,
                  r: Math.max(
                    j === 0 || j === short - 1 ? item.cr - 20 : j === 1 || j === short - 2 ? item.cr - 10 : item.cr,
                    0
                  ),
                  g: Math.max(
                    j === 0 || j === short - 1 ? item.cg - 20 : j === 1 || j === short - 2 ? item.cg - 10 : item.cg,
                    0
                  ),
                  b: Math.max(
                    j === 0 || j === short - 1 ? item.cb - 20 : j === 1 || j === short - 2 ? item.cb - 10 : item.cb,
                    0
                  )
                }
              }
            }
            // 最后一次循环加阴影去掉
            if (index === data.length - 1) {
              return 0
            }
            // 为了减少判断再加一层循环，把最后一层留白实线/阴影元素：4/5，补上
            for (let j = 0; j < short; j++) {
              const type = initRectArr[j][total + item.width]
              initRectArr[j][total + item.width] = {
                type: type === 0 ? 4 : 5,
                r: Math.max(
                  j === 0 || j === short - 1 ? item.cr - 20 : j === 1 || j === short - 2 ? item.cr - 10 : item.cr,
                  0
                ),
                g: Math.max(
                  j === 0 || j === short - 1 ? item.cg - 20 : j === 1 || j === short - 2 ? item.cg - 10 : item.cg,
                  0
                ),
                b: Math.max(
                  j === 0 || j === short - 1 ? item.cb - 20 : j === 1 || j === short - 2 ? item.cb - 10 : item.cb,
                  0
                )
              }
            }
          }
          return total + item.width + 1 // 这个加1加的就是缝隙
        }, 0)
      }
      // 给每根线push一个全为2的数组作为留白(缝隙)
      initRectArr.push(new Array(long).fill(2))
      return initRectArr
    },
    // 把1*1小方块矩阵相同色块合并，转成1*N大长方形矩阵，优化绘制方块的个数，优化主体部分的绘制，节约渲染循环次数
    initMainMatrix(data: any, realWidth: number) {
      let mainMatrix: any[] = []
      data.forEach((item: any) => {
        if (item[0] !== 2) {
          const pushArr: any[] = []
          let j = 0
          item.forEach((itemChild: any) => {
            // 首次初始化
            if (!pushArr[j]) {
              if (itemChild === 3) {
                pushArr.push({ type: 3, rectLength: 0, r: '', g: '', b: '' })
              } else {
                pushArr.push({ type: 0, rectLength: 0, r: itemChild.r, g: itemChild.g, b: itemChild.b })
              }
            }
            if (itemChild === 3 && pushArr[j].type === 3) {
              pushArr[j].rectLength++
            } else if (
              (itemChild.type === 0 || itemChild.type === 1 || itemChild.type === 4 || itemChild.type === 5) &&
              pushArr[j].type === 0
            ) {
              if (itemChild.type === 0 || itemChild.type === 1) {
                pushArr[j].rectLength++
              } else {
                pushArr[j].rectLength += realWidth
              }
            } else {
              if (itemChild === 3) {
                pushArr.push({ type: 3, rectLength: 1, r: '', g: '', b: '' })
              } else {
                pushArr.push({
                  type: 0,
                  rectLength: itemChild.type === 0 || itemChild.type === 1 ? 1 : realWidth,
                  r: itemChild.r,
                  g: itemChild.g,
                  b: itemChild.b
                })
              }
              j++
            }
          })
          mainMatrix.push(pushArr)
        } else {
          mainMatrix.push([2])
        }
      })
      return mainMatrix
    },
    // 绘制主体优化过的部分
    drawMainReal(ctx: any, data: any[][], type: 'warp' | 'weft') {
      if (type === 'weft') {
        let initY = 10 + this.xutouHeight
        data.forEach((item) => {
          let initX = 10
          const timeOut = window.setTimeout(() => {
            // 空行用于画边,理论上画边的代码可以放在这里，但是因为画完一个方向，另一个方向的实线会覆盖边，因此我们把边的代码单拎出去重新画
            if (item[0] === 2) {
              initY += this.weftDistance
            } else {
              item.forEach((itemChild) => {
                if (itemChild.type === 3) {
                  initX += itemChild.rectLength
                } else {
                  ctx.fillStyle = this.randomRGB(itemChild.r, itemChild.g, itemChild.b, 1, -5, 5)
                  ctx.fillRect(initX, initY, itemChild.rectLength, 1)
                  initX += itemChild.rectLength
                }
              })
              initY++
            }
          })
        })
      } else {
        let initX = 10
        data.forEach((item) => {
          let initY = 10 + this.xutouHeight
          const timeOut = window.setTimeout(() => {
            // 优先处理空行，一层
            if (item[0] === 2) {
              initX += this.warpDistance
            } else {
              item.forEach((itemChild) => {
                if (itemChild.type === 3) {
                  initY += itemChild.rectLength
                } else {
                  ctx.fillStyle = this.randomRGB(itemChild.r, itemChild.g, itemChild.b, 1)
                  ctx.fillRect(initX, initY, 1, itemChild.rectLength)
                  initY += itemChild.rectLength
                }
              })
              initX++
            }
          })
        })
      }
    },
    // 绘制捻和阴影
    drawTwistShadow(ctx: any, data: any[][], type: 'warp' | 'weft', flag: 0 | 1) {
      if (flag === 0) {
        return
      }
      if (type === 'weft') {
        let initY = 10 + this.xutouHeight
        data.forEach((item, index) => {
          let initX = 10
          const timeOut = window.setTimeout(() => {
            // 空行用于画边,理论上画边的代码可以放在这里，但是因为画完一个方向，另一个方向的实线会覆盖边，因此我们把边的代码单拎出去重新画
            if (item[0] === 2) {
              initY += this.weftDistance
            } else {
              item.forEach((itemChild, indexChild) => {
                if (itemChild === 3) {
                  initX++
                } else {
                  if (itemChild.type === 0) {
                    // ctx.fillStyle = randomRGB(itemChild.r, itemChild.g, itemChild.b, 1, -5, 5)
                    // ctx.fillRect(initX, initY, 1, 1)
                    initX++
                  } else if (itemChild.type === 1) {
                    ctx.fillStyle = this.randomRGB(
                      Math.round(itemChild.r * 0.75),
                      Math.round(itemChild.g * 0.75),
                      Math.round(itemChild.b * 0.75),
                      1,
                      -5,
                      5
                    )
                    ctx.fillRect(initX, initY, 1, 1)
                    initX++
                  } else if (itemChild.type === 4) {
                    if (
                      (data[index][indexChild - 1] && data[index][indexChild - 1] === 3) ||
                      (data[index][indexChild + 1] && data[index][indexChild + 1] === 3)
                    ) {
                      ctx.fillStyle = this.randomRGB(itemChild.r + 5, itemChild.g + 5, itemChild.b + 5, 1)
                    } else {
                      ctx.fillStyle = this.randomRGB(itemChild.r, itemChild.g, itemChild.b, 1)
                    }
                    ctx.fillRect(initX, initY, this.warpDistance, 1)
                    initX += this.warpDistance
                  } else if (itemChild.type === 5) {
                    if (
                      (data[index][indexChild - 1] && data[index][indexChild - 1] === 3) ||
                      (data[index][indexChild + 1] && data[index][indexChild + 1] === 3)
                    ) {
                      ctx.fillStyle = this.randomRGB(
                        Math.round(itemChild.r * 0.75) + 5,
                        Math.round(itemChild.g * 0.75) + 5,
                        Math.round(itemChild.b * 0.75) + 5,
                        1
                      )
                    } else {
                      ctx.fillStyle = this.randomRGB(
                        Math.round(itemChild.r * 0.75),
                        Math.round(itemChild.g * 0.75),
                        Math.round(itemChild.b * 0.75),
                        1
                      )
                    }
                    ctx.fillRect(initX, initY, this.warpDistance, 1)
                    initX += this.warpDistance
                  }
                }
              })
              initY++
            }
          })
        })
      } else {
        let initX = 10
        data.forEach((item, index) => {
          let initY = 10 + this.xutouHeight
          const timeOut = window.setTimeout(() => {
            // 优先处理空行，一层
            if (item[0] === 2) {
              initX += this.warpDistance
            } else {
              item.forEach((itemChild, indexChild) => {
                if (itemChild === 3) {
                  initY++
                } else {
                  if (itemChild.type === 0) {
                    ctx.fillStyle = this.randomRGB(itemChild.r, itemChild.g, itemChild.b, 1, -5, 5)
                    ctx.fillRect(initX, initY, 1, 1)
                    initY++
                  } else if (itemChild.type === 1) {
                    ctx.fillStyle = this.randomRGB(
                      Math.round(itemChild.r * 0.75),
                      Math.round(itemChild.g * 0.75),
                      Math.round(itemChild.b * 0.75),
                      1,
                      -5,
                      5
                    )
                    ctx.fillRect(initX, initY, 1, 1)
                    initY++
                  } else if (itemChild.type === 4) {
                    if (
                      (data[index][indexChild - 1] && data[index][indexChild - 1] === 3) ||
                      (data[index][indexChild + 1] && data[index][indexChild + 1] === 3)
                    ) {
                      ctx.fillStyle = this.randomRGB(itemChild.r + 5, itemChild.g + 5, itemChild.b + 5, 1)
                    } else {
                      ctx.fillStyle = this.randomRGB(itemChild.r, itemChild.g, itemChild.b, 1)
                    }
                    ctx.fillRect(initX, initY, 1, this.weftDistance)
                    initY += this.weftDistance
                  } else if (itemChild.type === 5) {
                    if (
                      (data[index][indexChild - 1] && data[index][indexChild - 1] === 3) ||
                      (data[index][indexChild + 1] && data[index][indexChild + 1] === 3)
                    ) {
                      ctx.fillStyle = this.randomRGB(
                        Math.round(itemChild.r * 0.75) + 5,
                        Math.round(itemChild.g * 0.75) + 5,
                        Math.round(itemChild.b * 0.75) + 5,
                        1
                      )
                    } else {
                      ctx.fillStyle = this.randomRGB(
                        Math.round(itemChild.r * 0.75),
                        Math.round(itemChild.g * 0.75),
                        Math.round(itemChild.b * 0.75),
                        1
                      )
                    }
                    ctx.fillRect(initX, initY, 1, this.weftDistance)
                    initY += this.weftDistance
                  }
                }
              })
              initX++
            }
          })
        })
      }
    },
    // 绘制边
    drawLine(ctx: any, data: any, type: 'warp' | 'weft', rate: number, sideFlag = true, circleFlag = false) {
      if (type === 'weft') {
        let initY = 10 + this.xutouHeight
        // 绘制边的时候在最外层保存一下绘制毛羽的长度/圈圈的大小数据,该逻辑只要处理一次后面绘制每条边的时候均可以通用
        this.hairinessLengthArr = [[], [0, 3, 5, 9, 13], [0, 2, 4, 7, 10], [0, 1, 2, 4, 6]][
          this.craftYarnWeft.hairiness_length
        ]
        this.circleNumberArr = [[], [1, 5], [2, 7], [3, 10]][this.craftYarnWeft.circle_number]
        data.forEach((item: any[], index: number) => {
          const timeOut = window.setTimeout(() => {
            let initX = 10
            // 绘制边
            if (item[0] === 2) {
              // 随机2个画边的数组出来
              let lineArr1 = this.randomArray(
                new Array(Math.round(item.length * (rate / 100)))
                  .fill(1)
                  .concat(new Array(Math.round(item.length * ((100 - rate) / 100))).fill(0))
              )
              let lineArr2 = this.randomArray(
                new Array(Math.round(item.length * (rate / 100)))
                  .fill(1)
                  .concat(new Array(Math.round(item.length * ((100 - rate) / 100))).fill(0))
              )
              // 这里都用四舍五入会有误差，因此最后的随机数组截取一下长度就ok了
              lineArr1.length = item.length
              lineArr2.length = item.length
              const lastBro = data[index - 1]
              const nextBro = data[index + 1]
              // 现在来判断他是不是真的能画出来，根据他的邻居是3，还是0145来判断这个点能否显示
              // 注意不管是1*1还是1*N，在绘制的时候，均为1*1的像素点，只是坐标在加的时候有区别
              lineArr1 = lineArr1.map((itemChild, indexChild) => {
                if (itemChild === 0) {
                  if (lastBro[indexChild] === 3 || lastBro[indexChild].type === 0 || lastBro[indexChild].type === 1) {
                    return 0 // 1*1的空白点
                  } else if (lastBro[indexChild].type === 4 || lastBro[indexChild].type === 5) {
                    return 2 // 1*N的空白点
                  }
                } else {
                  if (lastBro[indexChild] === 3) {
                    return 0 // 1*1的空白点
                  } else if (lastBro[indexChild].type === 0) {
                    return 1 // 1*1的显示点
                  } else if (lastBro[indexChild].type === 1) {
                    return 4 // 1*1的显示点（阴影色）
                  } else if (lastBro[indexChild].type === 4) {
                    return 3 // 1*N的显示点
                  } else if (lastBro[indexChild].type === 5) {
                    return 5 // 1*N的显示点（阴影色）
                  }
                }
              })
              lineArr2 = lineArr2.map((itemChild, indexChild) => {
                if (itemChild === 0) {
                  if (nextBro[indexChild] === 3 || nextBro[indexChild].type === 0 || nextBro[indexChild].type === 1) {
                    return 0 // 1*1的空白点
                  } else if (nextBro[indexChild].type === 4 || nextBro[indexChild].type === 5) {
                    return 2 // 1*N的空白点
                  }
                } else {
                  if (nextBro[indexChild] === 3) {
                    return 0 // 1*1的空白点
                  } else if (nextBro[indexChild].type === 0) {
                    return 1 // 1*1的显示点
                  } else if (nextBro[indexChild].type === 1) {
                    return 4 // 1*1的显示点（阴影色）
                  } else if (nextBro[indexChild].type === 4) {
                    return 3 // 1*N的显示点
                  } else if (nextBro[indexChild].type === 5) {
                    return 5 // 1*N的显示点（阴影色）
                  }
                }
              })

              const children = lastBro.find((itemChild: { type: any }) => itemChild.type)
              let xWidth = initX
              lineArr1.forEach((itemChild) => {
                if (itemChild === 0) {
                  xWidth++
                } else if (itemChild === 1) {
                  ctx.fillStyle = this.randomRGB(children.r, children.g, children.b, 1)
                  ctx.fillRect(xWidth, initY, 1, 1)
                  this.drawSide(ctx, sideFlag, xWidth, initY, children, 'rowBottom')
                  this.drawCircle(ctx, circleFlag, xWidth, initY, children)
                  xWidth++
                } else if (itemChild === 2) {
                  xWidth += this.warpDistance
                } else if (itemChild === 3) {
                  ctx.fillStyle = this.randomRGB(children.r, children.g, children.b, 1)
                  ctx.fillRect(xWidth, initY, 1, 1)
                  this.drawSide(ctx, sideFlag, xWidth, initY, children, 'rowBottom')
                  this.drawCircle(ctx, circleFlag, xWidth, initY, children)
                  xWidth += this.warpDistance
                } else if (itemChild === 4) {
                  ctx.fillStyle = this.randomRGB(children.r * 0.75, children.g * 0.75, children.b * 0.75, 1)
                  ctx.fillRect(xWidth, initY, 1, 1)
                  this.drawSide(ctx, sideFlag, xWidth, initY, children, 'rowBottom', 0.75)
                  this.drawCircle(ctx, circleFlag, xWidth, initY, children, 0.75)
                  xWidth++
                } else if (itemChild === 5) {
                  ctx.fillStyle = this.randomRGB(children.r * 0.75, children.g * 0.75, children.b * 0.75, 1)
                  ctx.fillRect(xWidth, initY, 1, 1)
                  this.drawSide(ctx, sideFlag, xWidth, initY, children, 'rowBottom', 0.75)
                  this.drawCircle(ctx, circleFlag, xWidth, initY, children, 0.75)
                  xWidth += this.warpDistance
                }
              })
              const children2 = nextBro.find((itemChild: { type: any }) => itemChild.type)
              let xWidth2 = initX
              lineArr2.forEach((itemChild, indexChild) => {
                if (itemChild === 0) {
                  xWidth2++
                } else if (itemChild === 1) {
                  ctx.fillStyle = this.randomRGB(children2.r, children2.g, children2.b, 1)
                  ctx.fillRect(xWidth2, initY + this.weftDistance - 1, 1, 1)
                  this.drawSide(ctx, sideFlag, xWidth2, initY + this.weftDistance - 1, children2, 'rowTop')
                  this.drawCircle(ctx, circleFlag, xWidth2, initY + this.weftDistance - 1, children2)
                  xWidth2++
                } else if (itemChild === 2) {
                  xWidth2 += this.warpDistance
                } else if (itemChild === 3) {
                  ctx.fillStyle = this.randomRGB(children2.r, children2.g, children2.b, 1)
                  ctx.fillRect(xWidth2, initY + this.weftDistance - 1, 1, 1)
                  this.drawSide(ctx, sideFlag, xWidth2, initY + this.weftDistance - 1, children2, 'rowTop', 0.75)
                  this.drawCircle(ctx, circleFlag, xWidth2, initY + this.weftDistance - 1, children2, 0.75)
                  xWidth2 += this.warpDistance
                } else if (itemChild === 4) {
                  ctx.fillStyle = this.randomRGB(children2.r * 0.75, children2.g * 0.75, children2.b * 0.75, 1)
                  ctx.fillRect(xWidth2, initY + this.weftDistance - 1, 1, 1)
                  this.drawSide(ctx, sideFlag, xWidth2, initY + this.weftDistance - 1, children2, 'rowTop')
                  this.drawCircle(ctx, circleFlag, xWidth2, initY + this.weftDistance - 1, children2)
                  xWidth2++
                } else if (itemChild === 5) {
                  ctx.fillStyle = this.randomRGB(children2.r * 0.75, children2.g * 0.75, children2.b * 0.75, 1)
                  ctx.fillRect(xWidth2, initY + this.weftDistance - 1, 1, 1)
                  this.drawSide(ctx, sideFlag, xWidth2, initY + this.weftDistance - 1, children2, 'rowTop', 0.75)
                  this.drawCircle(ctx, circleFlag, xWidth2, initY + this.weftDistance - 1, children2, 0.75)
                  xWidth2 += this.warpDistance
                }
              })
              initY += this.weftDistance
            } else {
              item.forEach((itemChild) => {
                if (itemChild === 3) {
                  initX++
                } else {
                  if (itemChild.type === 0) {
                    initX++
                  } else if (itemChild.type === 1) {
                    initX++
                  } else if (itemChild.type === 4) {
                    initX += this.warpDistance
                  } else if (itemChild.type === 5) {
                    initX += this.warpDistance
                  }
                }
              })
              initY++
            }
          })
        })
      } else {
        // 经向一部分画圈圈得代码被注释掉，因为有个很诡异得bug会导致经向得最后一个元素全部都画了圈圈，就导致围巾得最后一行有一行很密集得圈圈，暂时不知道原因，注释掉了部分画圈圈的代码后解决了这个bug
        let initX = 10
        this.hairinessLengthArr = [[], [0, 3, 5, 9, 13], [0, 2, 4, 7, 10], [0, 1, 2, 4, 6]][
          this.craftYarnWarp.hairiness_length
        ]
        this.circleNumberArr = [[], [1, 5], [2, 7], [3, 10]][this.craftYarnWarp.circle_number]
        data.forEach((item: any[], index: number) => {
          let initY = 10 + this.xutouHeight
          const timeOut = window.setTimeout(() => {
            // 处理空行
            if (item[0] === 2) {
              // 随机2个画边的数组出来
              let lineArr1 = this.randomArray(
                new Array(Math.round(item.length * (rate / 100)))
                  .fill(1)
                  .concat(new Array(Math.round(item.length * ((100 - rate) / 100))).fill(0))
              )
              let lineArr2 = this.randomArray(
                new Array(Math.round(item.length * (rate / 100)))
                  .fill(1)
                  .concat(new Array(Math.round(item.length * ((100 - rate) / 100))).fill(0))
              )
              // 这里都用四舍五入会有误差，因此最后的随机数组截取一下长度就ok了
              lineArr1.length = item.length
              lineArr2.length = item.length
              const lastBro = data[index - 1]
              const nextBro = data[index + 1]
              // 现在来判断他是不是真的能画出来，根据他的邻居是3，还是0145来判断这个点能否显示
              // 注意不管是1*1还是1*N，在绘制的时候，均为1*1的像素点，只是坐标在加的时候有区别
              lineArr1 = lineArr1.map((itemChild, indexChild) => {
                if (itemChild === 0) {
                  if (
                    lastBro[indexChild] === 3 ||
                    lastBro[indexChild].type === 0 ||
                    lastBro[indexChild].type === 1 ||
                    indexChild === item.length - 1
                  ) {
                    return 0 // 1*1的空白点
                  } else if (lastBro[indexChild].type === 4 || lastBro[indexChild].type === 5) {
                    return 2 // 1*N的空白点
                  }
                } else {
                  if (lastBro[indexChild] === 3) {
                    return 0 // 1*1的空白点
                  } else if (lastBro[indexChild].type === 0) {
                    return 1 // 1*1的显示点
                  } else if (lastBro[indexChild].type === 4) {
                    return 3 // 1*N的显示点
                  } else if (lastBro[indexChild].type === 1) {
                    return 4 // 1*1的显示点（阴影色）
                  } else if (lastBro[indexChild].type === 5) {
                    return 5 // 1*N的显示点（阴影色）
                  }
                }
              })
              lineArr2 = lineArr2.map((itemChild, indexChild) => {
                if (itemChild === 0) {
                  if (nextBro[indexChild] === 3 || nextBro[indexChild].type === 0 || nextBro[indexChild].type === 1) {
                    return 0 // 1*1的空白点
                  } else if (nextBro[indexChild].type === 4 || nextBro[indexChild].type === 5) {
                    return 2 // 1*N的空白点
                  }
                } else {
                  if (nextBro[indexChild] === 3) {
                    return 0 // 1*1的空白点
                  } else if (nextBro[indexChild].type === 0) {
                    return 1 // 1*1的显示点
                  } else if (nextBro[indexChild].type === 4) {
                    return 3 // 1*N的显示点
                  } else if (nextBro[indexChild].type === 1) {
                    return 4 // 1*1的显示点（阴影色）
                  } else if (nextBro[indexChild].type === 5) {
                    return 5 // 1*N的显示点（阴影色）
                  }
                }
              })
              const children = lastBro.find((itemChild: { type: any }) => itemChild.type)
              let xWidth = initY
              lineArr1.forEach((itemChild) => {
                if (itemChild === 0) {
                  xWidth++
                } else if (itemChild === 1) {
                  ctx.fillStyle = this.randomRGB(children.r, children.g, children.b, 1)
                  ctx.fillRect(initX, xWidth, 1, 1)
                  this.drawSide(ctx, sideFlag, initX, xWidth, children, 'colRight')
                  this.drawCircle(ctx, circleFlag, initX, xWidth, children, 1)
                  xWidth++
                } else if (itemChild === 2) {
                  xWidth += this.weftDistance
                } else if (itemChild === 3) {
                  ctx.fillStyle = this.randomRGB(children.r, children.g, children.b, 1)
                  ctx.fillRect(initX, xWidth, 1, 1)
                  this.drawSide(ctx, sideFlag, initX, xWidth, children, 'colRight')
                  this.drawCircle(ctx, circleFlag, initX, xWidth, children, 1)
                  xWidth += this.weftDistance
                } else if (itemChild === 4) {
                  ctx.fillStyle = this.randomRGB(children.r * 0.75, children.g * 0.75, children.b * 0.75, 1)
                  ctx.fillRect(initX, xWidth, 1, 1)
                  this.drawSide(ctx, sideFlag, initX, xWidth, children, 'colRight', 0.75)
                  // this.drawCircle(ctx, circleFlag, initX, xWidth, children, 0.75)
                  xWidth++
                } else if (itemChild === 5) {
                  ctx.fillStyle = this.randomRGB(children.r * 0.75, children.g * 0.75, children.b * 0.75, 1)
                  ctx.fillRect(initX, xWidth, 1, 1)
                  this.drawSide(ctx, sideFlag, initX, xWidth, children, 'colRight', 0.75)
                  // this.drawCircle(ctx, circleFlag, initX, xWidth, children, 0.75)
                  xWidth += this.weftDistance
                }
              })
              const children2 = nextBro.find((itemChild: { type: any }) => itemChild.type)
              let xWidth2 = initY
              lineArr2.forEach((itemChild) => {
                if (itemChild === 0) {
                  xWidth2++
                } else if (itemChild === 1) {
                  ctx.fillStyle = this.randomRGB(children2.r, children2.g, children2.b, 1)
                  ctx.fillRect(initX + this.warpDistance - 1, xWidth2, 1, 1)
                  this.drawSide(ctx, sideFlag, initX + this.warpDistance - 1, xWidth2, children2, 'colLeft')
                  // this.drawCircle(ctx,circleFlag, initX + this.warpDistance - 1, xWidth, children2, 1)
                  xWidth2++
                } else if (itemChild === 2) {
                  xWidth2 += this.weftDistance
                } else if (itemChild === 3) {
                  ctx.fillStyle = this.randomRGB(children2.r, children2.g, children2.b, 1)
                  ctx.fillRect(initX + this.warpDistance - 1, xWidth2, 1, 1)
                  this.drawSide(ctx, sideFlag, initX + this.warpDistance - 1, xWidth2, children2, 'colLeft')
                  // this.drawCircle(ctx,circleFlag, initX + this.warpDistance - 1, xWidth, children2, 1)
                  xWidth2 += this.weftDistance
                } else if (itemChild === 4) {
                  ctx.fillStyle = this.randomRGB(children2.r * 0.75, children2.g * 0.75, children2.b * 0.75, 1)
                  ctx.fillRect(initX + this.warpDistance - 1, xWidth2, 1, 1)
                  this.drawSide(ctx, sideFlag, initX + this.warpDistance - 1, xWidth2, children2, 'colLeft', 0.75)
                  // this.drawCircle(ctx,circleFlag, initX + this.warpDistance - 1, xWidth, children2, 0.75)
                  xWidth2++
                } else if (itemChild === 5) {
                  ctx.fillStyle = this.randomRGB(children2.r * 0.75, children2.g * 0.75, children2.b * 0.75, 1)
                  ctx.fillRect(initX + this.warpDistance - 1, xWidth2, 1, 1)
                  this.drawSide(ctx, sideFlag, initX + this.warpDistance - 1, xWidth2, children2, 'colLeft', 0.75)
                  // this.drawCircle(ctx,circleFlag, initX + this.warpDistance - 1, xWidth, children2, 0.75)
                  xWidth2 += this.weftDistance
                }
              })
              initX += this.warpDistance
            } else {
              item.forEach((itemChild) => {
                if (itemChild === 3) {
                  initY++
                } else {
                  if (itemChild.type === 0) {
                    initY++
                  } else if (itemChild.type === 1) {
                    initY++
                  } else if (itemChild.type === 4) {
                    initY += this.weftDistance
                  } else if (itemChild.type === 5) {
                    initY += this.weftDistance
                  }
                }
              })
              initX++
            }
          })
        })
      }
    },
    // 绘制毛边
    drawSide(ctx: any, flag: boolean, initX: number, initY: number, children: DrawData, type: string, number = 1) {
      if (!flag) {
        return
      }
      const r1 = this.myRandom(this.hairinessLengthArr[0], this.hairinessLengthArr[1])
      const r2 = this.myRandom(this.hairinessLengthArr[1], this.hairinessLengthArr[2])
      const r3 = this.myRandom(this.hairinessLengthArr[2], this.hairinessLengthArr[3])
      const r4 = this.myRandom(this.hairinessLengthArr[3], this.hairinessLengthArr[4])
      const xw = 4
      let y1 = 0
      let x1 = 0
      let y2 = 0
      let x2 = 0
      let y3 = 0
      let x3 = 0
      if (this.hairiness_direction === 0) {
        if (type === 'rowBottom') {
          y1 = initY + this.myRandom(r1, r2)
          y2 = initY + this.myRandom(r2, r3)
          y3 = initY + this.myRandom(r3, r4)
          x1 = initX + this.myRandom(-xw, xw)
          x2 = initX + this.myRandom(-xw, xw)
          x3 = initX + this.myRandom(-xw, xw)
        } else if (type === 'rowTop') {
          y1 = initY - this.myRandom(r1, r2)
          y2 = initY - this.myRandom(r2, r3)
          y3 = initY - this.myRandom(r3, r4)
          x1 = initX + this.myRandom(-xw, xw)
          x2 = initX + this.myRandom(-xw, xw)
          x3 = initX + this.myRandom(-xw, xw)
        } else if (type === 'colRight') {
          y1 = initY + this.myRandom(-xw, xw)
          y2 = initY + this.myRandom(-xw, xw)
          y3 = initY + this.myRandom(-xw, xw)
          x1 = initX + this.myRandom(r1, r2)
          x2 = initX + this.myRandom(r2, r3)
          x3 = initX + this.myRandom(r3, r4)
        } else if (type === 'colLeft') {
          y1 = initY + this.myRandom(-xw, xw)
          y2 = initY + this.myRandom(-xw, xw)
          y3 = initY + this.myRandom(-xw, xw)
          x1 = initX - this.myRandom(r1, r2)
          x2 = initX - this.myRandom(r2, r3)
          x3 = initX - this.myRandom(r3, r4)
        }
      } else if (this.hairiness_direction === 1) {
        y1 = initY - this.myRandom(r1, r2)
        y2 = initY - this.myRandom(r2, r3)
        y3 = initY - this.myRandom(r3, r4)
        x1 = initX + this.myRandom(-xw, xw)
        x2 = initX + this.myRandom(-xw, xw)
        x3 = initX + this.myRandom(-xw, xw)
      } else if (this.hairiness_direction === 2) {
        y1 = initY + this.myRandom(r1, r2)
        y2 = initY + this.myRandom(r2, r3)
        y3 = initY + this.myRandom(r3, r4)
        x1 = initX + this.myRandom(-xw, xw)
        x2 = initX + this.myRandom(-xw, xw)
        x3 = initX + this.myRandom(-xw, xw)
      } else if (this.hairiness_direction === 3) {
        y1 = initY + this.myRandom(-xw, xw)
        y2 = initY + this.myRandom(-xw, xw)
        y3 = initY + this.myRandom(-xw, xw)
        x1 = initX - this.myRandom(r1, r2)
        x2 = initX - this.myRandom(r2, r3)
        x3 = initX - this.myRandom(r3, r4)
      } else if (this.hairiness_direction === 4) {
        y1 = initY + this.myRandom(-xw, xw)
        y2 = initY + this.myRandom(-xw, xw)
        y3 = initY + this.myRandom(-xw, xw)
        x1 = initX + this.myRandom(r1, r2)
        x2 = initX + this.myRandom(r2, r3)
        x3 = initX + this.myRandom(r3, r4)
      }

      ctx.beginPath()
      ctx.strokeStyle = this.randomRGB(children.r * number, children.g * number, children.b * number, 1)
      ctx.lineWidth = 0.5
      ctx.moveTo(initX, initY)
      ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
      ctx.stroke()
    },
    // 绘制圈圈纱
    drawCircle(ctx: any, flag: boolean, initX: number, initY: number, children: DrawData, number = 1) {
      if (!flag) {
        return
      }
      ctx.beginPath()
      ctx.strokeStyle = this.randomRGB(children.r * number, children.g * number, children.b * number, 0.5)
      ctx.lineWidth = 0.5
      const arc = Math.PI * 2
      // 画1-3次圆
      for (let i = 0; i < this.myRandom(1, 5); i++) {
        const r = this.myRandom(this.circleNumberArr[0], this.circleNumberArr[1])
        const x = initX + this.myRandom(0, 4)
        const y = initY + this.myRandom(0, 4)
        ctx.arc(x, y, r, 0, arc)
        ctx.stroke()
      }
    },
    // 绘制捻须
    drawTassels(
      ctx: any,
      flag: boolean,
      data: Array<{ coordinate: Array<{ x: number; y: number }>; r: number; g: number; b: number }>,
      type: 'warp' | 'weft'
    ) {
      if (!flag) {
        return
      }
      let forNum = type === 'warp' ? this.craftYarnWarp.diameter : this.craftYarnWeft.diameter // 一根线要画出阴影效果要拆成多个像素
      data.forEach((item) => {
        setTimeout(() => {
          ctx.beginPath()
          // 绘制单线段方法
          // ctx.lineWidth = 2
          // ctx.strokeStyle = 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')'
          // for (let i = 0; i < item.coordinate.length; i++) {
          //   if (i === 0) {
          //     ctx.moveTo(item.coordinate[i].x, item.coordinate[i].y)
          //   } else {
          //     ctx.lineTo(item.coordinate[i].x, item.coordinate[i].y)
          //     ctx.stroke()
          //   }
          // }
          // 绘制多线段方法
          // ctx.lineWidth = 1
          // for (let j = 0; j < forNum; j++) {
          //   if (j === 0 || j === forNum - 1) {
          //     const r = Math.max(0, item.r - 20)
          //     const b = Math.max(0, item.b - 20)
          //     const g = Math.max(0, item.g - 20)
          //     ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')'
          //   } else if (j === 1 || j === forNum - 2) {
          //     const r = Math.max(0, item.r - 10)
          //     const b = Math.max(0, item.b - 10)
          //     const g = Math.max(0, item.g - 10)
          //     ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')'
          //   } else {
          //     ctx.strokeStyle = 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')'
          //   }
          //   for (let i = 0; i < item.coordinate.length; i++) {
          //     if (i === 0) {
          //       ctx.moveTo(item.coordinate[i].x + j, item.coordinate[i].y)
          //     } else
          //       ctx.lineTo(item.coordinate[i].x + j, item.coordinate[i].y)
          //       ctx.stroke()
          //     }
          //   }
          // }
          // 绘制图形（四边形）方法
          for (let i = 0; i < item.coordinate.length; i++) {
            if (item.coordinate[i + 1] && item.coordinate[i + 1].x < item.coordinate[i].x) {
              if (i % 2 === 0) {
                ctx.fillStyle = 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')'
              } else {
                ctx.fillStyle =
                  'rgb(' +
                  Math.min(item.r + 20, 255) +
                  ',' +
                  Math.min(item.g + 20, 255) +
                  ',' +
                  Math.min(item.b + 20, 255) +
                  ')'
              }

              ctx.moveTo(item.coordinate[i].x, item.coordinate[i].y)
              ctx.lineTo(item.coordinate[i].x + forNum - 1, item.coordinate[i].y)
              ctx.lineTo(item.coordinate[i + 1].x + forNum - 1, item.coordinate[i + 1].y)
              ctx.lineTo(item.coordinate[i + 1].x, item.coordinate[i + 1].y)
              ctx.lineTo(item.coordinate[i].x, item.coordinate[i].y)
              ctx.fill()
            }
          }
          // 绘制须头模拟线的效果
          let randomArr = []
          for (let i = 10; i < 10 + this.xutouHeight; i += 4) {
            const randomNum = this.myRandom(0, 3)
            randomArr.push(i + randomNum)
          }
          const r1 = this.myRandom(1, 3)
          const r2 = this.myRandom(3, 6)
          const r3 = this.myRandom(6, 10)
          const r4 = this.myRandom(10, 14)
          const xw = 4
          let y1 = 0
          let x1 = 0
          let y2 = 0
          let x2 = 0
          let y3 = 0
          let x3 = 0

          randomArr.forEach((itemChild) => {
            const type = Math.round(this.myRandom(1, 4))
            if (type === 1) {
              y1 = itemChild + this.myRandom(r1, r2)
              y2 = itemChild + this.myRandom(r2, r3)
              y3 = itemChild + this.myRandom(r3, r4)
              x1 = item.coordinate[0].x + this.myRandom(-xw, xw)
              x2 = item.coordinate[0].x + this.myRandom(-xw, xw)
              x3 = item.coordinate[0].x + this.myRandom(-xw, xw)
            } else if (type === 2) {
              y1 = itemChild - this.myRandom(r1, r2)
              y2 = itemChild - this.myRandom(r2, r3)
              y3 = itemChild - this.myRandom(r3, r4)
              x1 = item.coordinate[0].x + this.myRandom(-xw, xw)
              x2 = item.coordinate[0].x + this.myRandom(-xw, xw)
              x3 = item.coordinate[0].x + this.myRandom(-xw, xw)
            } else if (type === 3) {
              y1 = itemChild + this.myRandom(-xw, xw)
              y2 = itemChild + this.myRandom(-xw, xw)
              y3 = itemChild + this.myRandom(-xw, xw)
              x1 = item.coordinate[0].x + this.myRandom(r1, r2)
              x2 = item.coordinate[0].x + this.myRandom(r2, r3)
              x3 = item.coordinate[0].x + this.myRandom(r3, r4)
            } else if (type === 4) {
              y1 = itemChild + this.myRandom(-xw, xw)
              y2 = itemChild + this.myRandom(-xw, xw)
              y3 = itemChild + this.myRandom(-xw, xw)
              x1 = item.coordinate[0].x - this.myRandom(r1, r2)
              x2 = item.coordinate[0].x - this.myRandom(r2, r3)
              x3 = item.coordinate[0].x - this.myRandom(r3, r4)
            }
            ctx.beginPath()
            ctx.lineWidth = 1
            ctx.strokeStyle = 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')'
            ctx.moveTo(item.coordinate[0].x, itemChild)
            ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
            ctx.stroke()
          })
        }, 0)
      })

      data.forEach((item) => {
        setTimeout(() => {
          ctx.beginPath()
          for (let i = 0; i < item.coordinate.length; i++) {
            if (item.coordinate[i + 1] && item.coordinate[i + 1].x > item.coordinate[i].x) {
              // const grd = ctx.createLinearGradient(
              //   item.coordinate[i].x,
              //   item.coordinate[i].y,
              //   item.coordinate[i + 1].x + forNum - 1,
              //   item.coordinate[i].y
              // )
              // grd.addColorStop(0, 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')')
              // grd.addColorStop(
              //   1,
              //   'rgb(' +
              //     Math.min(item.r + 20, 255) +
              //     ',' +
              //     Math.min(item.g + 20, 255) +
              //     ',' +
              //     Math.min(item.b + 20, 255) +
              //     ')'
              // )
              // ctx.fillStyle = grd
              // ctx.shadowOffsetX = -1
              // ctx.shadowOffsetY = -1
              // ctx.shadowColor =
              //   'rgb(' +
              //   Math.min(item.r + 20, 255) +
              //   ',' +
              //   Math.min(item.g + 20, 255) +
              //   ',' +
              //   Math.min(item.b + 20, 255) +
              //   ')'
              // ctx.shadowBlur = 1
              if (i % 2 === 0) {
                ctx.fillStyle = 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')'
              } else {
                ctx.fillStyle =
                  'rgb(' +
                  Math.min(item.r + 20, 255) +
                  ',' +
                  Math.min(item.g + 20, 255) +
                  ',' +
                  Math.min(item.b + 20, 255) +
                  ')'
              }
              ctx.moveTo(item.coordinate[i].x, item.coordinate[i].y)
              ctx.lineTo(item.coordinate[i].x + forNum - 1, item.coordinate[i].y)
              ctx.lineTo(item.coordinate[i + 1].x + forNum - 1, item.coordinate[i + 1].y)
              ctx.lineTo(item.coordinate[i + 1].x, item.coordinate[i + 1].y)
              ctx.lineTo(item.coordinate[i].x, item.coordinate[i].y)
              ctx.fill()
            }
          }
          // 绘制须头模拟线的效果
          let randomArr = []
          for (let i = item.coordinate[0].y; i < item.coordinate[item.coordinate.length - 1].y; i += 4) {
            const randomNum = this.myRandom(0, 3)
            randomArr.push(i + randomNum)
          }
          const r1 = this.myRandom(1, 3)
          const r2 = this.myRandom(3, 6)
          const r3 = this.myRandom(6, 10)
          const r4 = this.myRandom(10, 14)
          const xw = 4
          let y1 = 0
          let x1 = 0
          let y2 = 0
          let x2 = 0
          let y3 = 0
          let x3 = 0

          randomArr.forEach((itemChild) => {
            const type = Math.round(this.myRandom(1, 4))
            if (type === 1) {
              y1 = itemChild + this.myRandom(r1, r2)
              y2 = itemChild + this.myRandom(r2, r3)
              y3 = itemChild + this.myRandom(r3, r4)
              x1 = item.coordinate[0].x + this.myRandom(-xw, xw)
              x2 = item.coordinate[0].x + this.myRandom(-xw, xw)
              x3 = item.coordinate[0].x + this.myRandom(-xw, xw)
            } else if (type === 2) {
              y1 = itemChild - this.myRandom(r1, r2)
              y2 = itemChild - this.myRandom(r2, r3)
              y3 = itemChild - this.myRandom(r3, r4)
              x1 = item.coordinate[0].x + this.myRandom(-xw, xw)
              x2 = item.coordinate[0].x + this.myRandom(-xw, xw)
              x3 = item.coordinate[0].x + this.myRandom(-xw, xw)
            } else if (type === 3) {
              y1 = itemChild + this.myRandom(-xw, xw)
              y2 = itemChild + this.myRandom(-xw, xw)
              y3 = itemChild + this.myRandom(-xw, xw)
              x1 = item.coordinate[0].x + this.myRandom(r1, r2)
              x2 = item.coordinate[0].x + this.myRandom(r2, r3)
              x3 = item.coordinate[0].x + this.myRandom(r3, r4)
            } else if (type === 4) {
              y1 = itemChild + this.myRandom(-xw, xw)
              y2 = itemChild + this.myRandom(-xw, xw)
              y3 = itemChild + this.myRandom(-xw, xw)
              x1 = item.coordinate[0].x - this.myRandom(r1, r2)
              x2 = item.coordinate[0].x - this.myRandom(r2, r3)
              x3 = item.coordinate[0].x - this.myRandom(r3, r4)
            }
            ctx.beginPath()
            ctx.lineWidth = 1
            ctx.strokeStyle = 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')'
            ctx.moveTo(item.coordinate[0].x, itemChild)
            ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
            ctx.stroke()
          })
        }, 0)
      })
    },
    // 绘制散须
    drawTasselsEasy(
      ctx: any,
      data: Array<{ width: number; r: number; g: number; b: number }>,
      type: 'warp' | 'weft',
      direction: 'top' | 'bottom'
    ) {
      if (direction === 'top') {
        let initX = 10
        let initY = 10 + this.xutouHeight
        data.forEach((item, index) => {
          setTimeout(() => {
            if (index % 7 !== 0 && index % 17 !== 0 && index % 29 !== 0) {
              ctx.beginPath()
              ctx.lineWidth = item.width
              ctx.strokeStyle = 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')'
              ctx.moveTo(initX, initY)
              ctx.lineTo(initX, 10)
              ctx.stroke()
            }
            // 绘制须头模拟线的效果
            const randomArr = []
            for (let i = 10; i < initY; i += 4) {
              const randomNum = this.myRandom(0, 2)
              randomArr.push(i + randomNum)
            }
            const r1 = this.myRandom(1, 2)
            const r2 = this.myRandom(2, 4)
            const r3 = this.myRandom(4, 7)
            const r4 = this.myRandom(7, 10)
            const xw = 4
            let y1 = 0
            let x1 = 0
            let y2 = 0
            let x2 = 0
            let y3 = 0
            let x3 = 0

            randomArr.forEach((itemChild) => {
              const type = Math.round(this.myRandom(1, 4))
              if (type === 1) {
                y1 = itemChild + this.myRandom(r1, r2)
                y2 = itemChild + this.myRandom(r2, r3)
                y3 = itemChild + this.myRandom(r3, r4)
                x1 = initX + this.myRandom(-xw, xw)
                x2 = initX + this.myRandom(-xw, xw)
                x3 = initX + this.myRandom(-xw, xw)
              } else if (type === 2) {
                y1 = itemChild - this.myRandom(r1, r2)
                y2 = itemChild - this.myRandom(r2, r3)
                y3 = itemChild - this.myRandom(r3, r4)
                x1 = initX + this.myRandom(-xw, xw)
                x2 = initX + this.myRandom(-xw, xw)
                x3 = initX + this.myRandom(-xw, xw)
              } else if (type === 3) {
                y1 = itemChild + this.myRandom(-xw, xw)
                y2 = itemChild + this.myRandom(-xw, xw)
                y3 = itemChild + this.myRandom(-xw, xw)
                x1 = initX + this.myRandom(r1, r2)
                x2 = initX + this.myRandom(r2, r3)
                x3 = initX + this.myRandom(r3, r4)
              } else if (type === 4) {
                y1 = itemChild + this.myRandom(-xw, xw)
                y2 = itemChild + this.myRandom(-xw, xw)
                y3 = itemChild + this.myRandom(-xw, xw)
                x1 = initX - this.myRandom(r1, r2)
                x2 = initX - this.myRandom(r2, r3)
                x3 = initX - this.myRandom(r3, r4)
              }
              ctx.beginPath()
              ctx.lineWidth = 1
              ctx.strokeStyle = 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')'
              ctx.moveTo(initX, itemChild)
              ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
              ctx.stroke()
            })
            initX += item.width + this.warpDistance
          }, 0)
        })
      } else if (direction === 'bottom') {
        let initX = 10
        let initY = this.xutouHeight + this.canvasHeight - 10
        data.forEach((item, index) => {
          setTimeout(() => {
            if (index % 11 !== 0 && index % 19 !== 0 && index % 31 !== 0) {
              ctx.beginPath()
              ctx.lineWidth = item.width
              ctx.strokeStyle = 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')'
              ctx.moveTo(initX, initY)
              ctx.lineTo(initX, initY + this.xutouHeight)
              ctx.stroke()
            }
            // 绘制须头模拟线的效果
            const randomArr = []
            for (let i = initY; i < initY + this.xutouHeight; i += 4) {
              const randomNum = this.myRandom(0, 2)
              randomArr.push(i + randomNum)
            }
            const r1 = this.myRandom(1, 2)
            const r2 = this.myRandom(2, 4)
            const r3 = this.myRandom(4, 7)
            const r4 = this.myRandom(7, 10)
            const xw = 4
            let y1 = 0
            let x1 = 0
            let y2 = 0
            let x2 = 0
            let y3 = 0
            let x3 = 0

            randomArr.forEach((itemChild) => {
              const type = Math.round(this.myRandom(1, 4))
              if (type === 1) {
                y1 = itemChild + this.myRandom(r1, r2)
                y2 = itemChild + this.myRandom(r2, r3)
                y3 = itemChild + this.myRandom(r3, r4)
                x1 = initX + this.myRandom(-xw, xw)
                x2 = initX + this.myRandom(-xw, xw)
                x3 = initX + this.myRandom(-xw, xw)
              } else if (type === 2) {
                y1 = itemChild - this.myRandom(r1, r2)
                y2 = itemChild - this.myRandom(r2, r3)
                y3 = itemChild - this.myRandom(r3, r4)
                x1 = initX + this.myRandom(-xw, xw)
                x2 = initX + this.myRandom(-xw, xw)
                x3 = initX + this.myRandom(-xw, xw)
              } else if (type === 3) {
                y1 = itemChild + this.myRandom(-xw, xw)
                y2 = itemChild + this.myRandom(-xw, xw)
                y3 = itemChild + this.myRandom(-xw, xw)
                x1 = initX + this.myRandom(r1, r2)
                x2 = initX + this.myRandom(r2, r3)
                x3 = initX + this.myRandom(r3, r4)
              } else if (type === 4) {
                y1 = itemChild + this.myRandom(-xw, xw)
                y2 = itemChild + this.myRandom(-xw, xw)
                y3 = itemChild + this.myRandom(-xw, xw)
                x1 = initX - this.myRandom(r1, r2)
                x2 = initX - this.myRandom(r2, r3)
                x3 = initX - this.myRandom(r3, r4)
              }
              ctx.beginPath()
              ctx.lineWidth = 1
              ctx.strokeStyle = 'rgb(' + item.r + ',' + item.g + ',' + item.b + ')'
              ctx.moveTo(initX, itemChild)
              ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
              ctx.stroke()
            })
            initX += item.width + this.warpDistance
          }, 0)
        })
      }
    },
    // 初始化矩阵
    initRect(width: number, height: number) {
      return new Array(height).fill([]).map(() => new Array(width).fill(0))
    },
    // 随机函数
    myRandom(min: number, max: number): number {
      return Math.round(Math.random() * (max - min) + min)
    },
    // 颜色随机函数
    randomRGB(r: number, g: number, b: number, a: number, limitL: number = 0, limitR: number = 0): string {
      // 保证R,G,B加减的颜色是一样的，防止白色变成其他颜色情况
      const randomNum = this.myRandom(limitL, limitR)
      if ((limitL || limitL === 0) && limitR) {
        let realR = r + randomNum
        realR = realR > 255 ? 255 : realR
        realR = realR < 0 ? 0 : realR
        let realG = g + randomNum
        realR = realG > 255 ? 255 : realR
        realR = realG < 0 ? 0 : realR
        let realB = b + randomNum
        realR = realB > 255 ? 255 : realR
        realR = realB < 0 ? 0 : realR
        return 'rgb(' + realR + ',' + realG + ',' + realB + ',' + a + ')'
      } else {
        return 'rgb(' + r + ',' + g + ',' + b + ',' + a + ')'
      }
    },
    // 随机交换数组的值打乱数组
    randomArray(arr: any[]): any[] {
      for (let i = 0, len = arr.length; i < len; i++) {
        let index = Math.floor(Math.random() * (len - 1))
        let tempValue = arr[i]
        arr[i] = arr[index]
        arr[index] = tempValue
      }
      return arr
    },
    // 初始化一个随机的捻坐标
    initTwistDistance(twistNum: number, distance: number) {
      const distanceRandom = []
      for (let i = 0; i < twistNum / 2; i++) {
        const randomNum = this.myRandom(0, 3)
        distanceRandom.push(distance - randomNum)
        distanceRandom.push(distance + randomNum)
      }
      // 处理下奇数
      if (twistNum % 2 !== 0) {
        distanceRandom.push(distance)
      }
      return distanceRandom
    },
    // hex颜色转rgb
    hexToRGB(hex: string): string {
      let alpha = false
      let h: string | number = hex.slice(hex.startsWith('#') ? 1 : 0)
      if (h.length === 3) h = [...h].map((x) => x + x).join('')
      else if (h.length === 8) alpha = true
      h = parseInt(h, 16)
      return (
        'rgb' +
        (alpha ? 'a' : '') +
        '(' +
        (h >>> (alpha ? 24 : 16)) +
        ', ' +
        ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
        ', ' +
        ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
        (alpha ? `, ${h & 0x000000ff}` : '') +
        ')'
      )
    },
    // 删除图片
    deleteImg(id: number) {
      this.$confirm('是否删除该图像?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          craft.deleteImg({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // @ts-ignore
              this.craftInfo.image_data!.splice(this.craftInfo.image_data.map((item) => item.id).indexOf(id), 1)
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
    this.getCraftList()
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
          // @ts-ignore
          this.productInfo = this.craftInfo.product_info
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
