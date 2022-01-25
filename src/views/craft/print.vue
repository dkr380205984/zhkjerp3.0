<template>
  <div class="printContainer"
    id="craftPrint"
    @click="showMenu = false"
    @click.right="handleClickRight">
    <div class="pmain">
      <div class="phead clearfix">
        <div class="fl">
          <div class="ptitle">{{company_name + '打印工艺单'}}</div>
          <div class="prow">
            <div class="pcol">
              <div class="label">系统编号：</div>
              <div class="info">{{craftInfo.craft_code}}</div>
            </div>
            <div class="pcol">
              <div class="label">手机号：</div>
              <div class="info">{{craftInfo.user_phone}}</div>
            </div>
          </div>
          <div class="prow">
            <div class="pcol">
              <div class="label">创建人：</div>
              <div class="info">{{craftInfo.user_name}}</div>
            </div>
            <div class="pcol">
              <div class="label">创建日期：</div>
              <div class="info">{{craftInfo.create_time&&craftInfo.create_time.slice(0,10)}}</div>
            </div>
          </div>
        </div>
        <div class="fr">
          <div class="pImage">
            <el-image :src="craftInfo.product_info&&craftInfo.product_info.image_data.length>0?craftInfo.product_info.image_data[0]:require('@/assets/image/common/noPic.png')"
              :preview-src-list="craftInfo.product_info?craftInfo.product_info.image_data:[]">
            </el-image>
          </div>
          <div class="pImage">
            <img :src="qrCodeUrl"
              width="100%"
              alt="" />
          </div>
        </div>
      </div>
      <div class="pbody">
        <div class="tableCtn pageOne">
          <div class="tbody hasTop">
            <div class="trow">
              <div class="tcol bgGray label">产品名称</div>
              <div class="tcol">{{craftInfo.product_info && craftInfo.product_info.product_code}}
                <span v-if="!craftInfo.product_id&&!craftInfo.part_id">无产品信息</span>
              </div>
              <div class="tcol bgGray label">客户款号</div>
              <div class="tcol">{{craftInfo.product_info && craftInfo.product_info.product_code}}</div>
              <div class="tcol bgGray label">其它信息</div>
              <div class="tcol"></div>
            </div>
            <div class="trow">
              <div class="tcol bgGray label">工艺单名称</div>
              <div class="tcol">{{craftInfo.title}}</div>
              <div class="tcol bgGray label">大身规格</div>
              <div class="tcol">{{craftInfo.size}}</div>
              <div class="tcol bgGray label">大身克重</div>
              <div class="tcol">{{craftInfo.weight}}g</div>
            </div>
            <div class="trow">
              <div class="tcol w50 horizontal bgGray">原料经向</div>
              <div class="tcol noPad">
                <div class="trow">
                  <div class="tcol bgGray label">经向原料</div>
                  <div class="tcol flexRow">
                    <span v-for="(item,index) in craftInfo.warp_data.material_data"
                      :key="index"
                      v-show="item.material_name"
                      style="margin-right:12px">
                      <span class="name">{{item.material_name}}：</span>
                      <span class="methods"
                        v-for="(itemApply,indexApply) in item.apply"
                        :key="itemApply">{{itemApply|filterIndex}}{{indexApply===item.apply.length-1?'':'/'}}</span>;
                    </span>
                  </div>
                </div>
                <div class="trow"
                  style="min-height:192px">
                  <div class="tcol w50 horizontal">经向排列</div>
                  <template v-if="craftInfo.warp_data.warp_rank[0]&&craftInfo.warp_data.warp_rank[0].length>16">
                    <div class="tcol noPad">
                      <div class="alignCenter">查看附件信息</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="tcol noPad">
                      <div class="trow h32"
                        v-for="(item,index) in craftInfo.warp_data.warp_rank"
                        :key="index"
                        :style="{'display':index!==5||ifShowWarpMerge3?'flex':'none'}">
                        <template v-if="index===0||index===2">
                          <div class="tcol"
                            v-for="(itemChild,indexChild) in item"
                            :key="indexChild">
                            {{itemChild}}
                          </div>
                        </template>
                        <template v-if="index===3||index===4||index===5||index===6">
                          <div class="tcol"
                            v-for="(itemChild,indexChild) in getMergeInfo(craftInfo.warp_data.merge_data,index,craftInfo.warp_data.warp_rank[index].length)"
                            :key="indexChild"
                            :style="{'min-width':6.25*itemChild.colspan + '%'}">
                            <span class="sign left"
                              :class="'style'+signType"
                              v-if="itemChild.colspan>1">
                              <span class="auto_long_arrow left_to_right"
                                v-if="signType==='3'"></span>
                            </span>
                            {{item[itemChild.col]}}
                            <span class="sign right"
                              :class="'style'+signType"
                              v-if="itemChild.colspan>1">
                              <span class="auto_long_arrow right_to_left"
                                v-if="signType==='3'"></span>
                            </span>
                          </div>
                        </template>
                        <template v-if="index===1">
                          <div class="tcol"
                            v-for="(itemChild,indexChild) in item"
                            :key="indexChild">
                            {{itemChild|filterIndex}}
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="trow">
              <div class="tcol w50 horizontal bgGray">整经工艺</div>
              <div class="tcol noPad">
                <div class="trow">
                  <div class="tcol bgGray label">整经总头纹</div>
                  <div class="tcol">{{craftInfo.warp_data.weft}}
                    <span class="unit">根</span>
                  </div>
                  <div class="tcol bgGray label">边型</div>
                  <div class="tcol">{{craftInfo.warp_data.side || '无'}}</div>
                  <div class="tcol bgGray label">综页</div>
                  <div class="tcol">{{craftInfo.warp_data.sum_up || '0'}}
                    <span class="unit">页</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol bgGray label">整经门幅</div>
                  <div class="tcol">{{craftInfo.warp_data.width || '0'}}
                    <span class="unit">cm</span>
                  </div>
                  <div class="tcol bgGray label">机型</div>
                  <div class="tcol">{{craftInfo.warp_data.machine || '无'}}</div>
                  <div class="tcol bgGray label">其它</div>
                  <div class="tcol"></div>
                </div>
              </div>
            </div>
            <div class="trow">
              <div class="tcol w50 horizontal bgGray">穿综筘工艺</div>
              <div class="tcol noPad">
                <div class="trow">
                  <div class="tcol bgGray label">筘号</div>
                  <div class="tcol">{{craftInfo.warp_data.reed || '0'}}
                    <span class="unit">筘</span>
                  </div>
                  <div class="tcol bgGray label">穿筘法</div>
                  <div class="tcol">{{craftInfo.warp_data.reed_method || '0'}}
                    <span class="unit">根/筘</span>
                  </div>
                  <div class="tcol bgGray label">筘幅</div>
                  <div class="tcol">{{craftInfo.warp_data.reed_width || '0'}}
                    <span class="unit">cm</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol w50 horizontal">穿综法</div>
                  <div class="tcol noPad">
                    <div class="trow">
                      <div class="tcol label">穿综法循环：</div>
                      <div class="tcol">
                        {{craftInfo.draft_method|filterThroughMethod}}
                      </div>
                    </div>
                    <div class="trow">
                      <div class="tcol label">纹版图：</div>
                      <div class="tcol">
                        <template v-if="ifShowGL">
                          <div class="GLCtn"
                            v-for="(item1,index1) in craftInfo.draft_method.GL"
                            :key="index1">
                            <div class="mark">{{alphabet[index1]}}：
                            </div>
                            <div v-for="(item2,index2) in item1"
                              :key="index2"
                              class="deltaCtn"
                              :class="{'moreMargin':GLXuhao[index1]&&findGLRepeat(index1,GLXuhao[index1][index2],'end')}">
                              <div class="repeatLeft"
                                v-show="GLXuhao[index1]&&findGLRepeat(index1,GLXuhao[index1][index2],'start')"></div>
                              <div class="leftCtn">
                                <span :content="GLXuhao[index1] ? GLXuhao[index1][index2] : index2+1">{{GLXuhao[index1] ? GLXuhao[index1][index2] : ''}}</span>
                              </div>
                              <div class="rightCtn">
                                <div class="hehe">
                                  <span class="haha">{{item2[0].value}}</span>
                                  <div class="normal"
                                    :class="item2[0].mark"
                                    v-show="item2[0].mark"></div>
                                </div>
                                <div class="hehe">
                                  <span class="haha">{{item2[1].value}}</span>
                                  <div class="normal"
                                    :class="item2[1].mark"
                                    v-show="item2[1].mark"></div>
                                </div>
                                <div class="hehe">
                                  <span class="haha">{{item2[2].value}}</span>
                                  <div class="normal"
                                    :class="item2[2].mark"
                                    v-show="item2[2].mark"></div>
                                </div>
                              </div>
                              <div class="repeatRight"
                                v-show="GLXuhao[index1]&&findGLRepeat(index1,GLXuhao[index1][index2],'end')">
                                <div class="repeatTime"
                                  v-if="GLXuhao[index1]&&findGLRepeat(index1,GLXuhao[index1][index2],'end')">✖{{findGLRepeat(index1,GLXuhao[index1][index2],'end').repeat}}遍</div>
                              </div>
                            </div>
                          </div>
                        </template>
                        <div class="alignCenter"
                          v-else>查看附件信息</div>
                      </div>
                    </div>
                    <div class="trow">
                      <div class="tcol label">穿综法备注：</div>
                      <div class="tcol">{{craftInfo.draft_method.PMDesc || '无'}}</div>
                    </div>
                    <div class="trow">
                      <div class="tcol label">纹版图备注：</div>
                      <div class="tcol">{{craftInfo.draft_method.GLDesc || '无'}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow">
              <div class="tcol w50 horizontal bgGray">织造工艺</div>
              <div class="tcol noPad">
                <div class="trow">
                  <div class="tcol bgGray label">组织法</div>
                  <div class="tcol">{{craftInfo.weft_data.organization_name||'无'}}</div>
                  <div class="tcol bgGray label">机上坯幅</div>
                  <div class="tcol">{{craftInfo.weft_data.peifu || '0'}}
                    <span class="unit">cm</span>
                  </div>
                  <div class="tcol bgGray label">纬密</div>
                  <div class="tcol">{{craftInfo.weft_data.weimi || '0'}}
                    <span class="unit">梭/cm</span>
                  </div>
                  <div class="tcol bgGray label">齿牙</div>
                  <div class="tcol"></div>
                </div>
                <div class="trow">
                  <div class="tcol bgGray label">让位要求</div>
                  <div class="tcol flexRow">
                    <span>内长：</span>
                    {{craftInfo.weft_data.neichang}}cm；
                    <span style="margin-left:22px">让位：</span>
                    {{craftInfo.weft_data.rangwei}}cm
                  </div>
                  <div class="tcol bgGray label">总计</div>
                  <div class="tcol">{{craftInfo.weft_data.total}}
                    <span class="unit">根</span>
                  </div>
                </div>
                <div class="trow">
                  <div class="tcol bgGray label"
                    style="max-width: 93px;">纬向原料</div>
                  <div class="tcol flexRow">
                    <span v-for="(item,index) in craftInfo.weft_data.material_data"
                      :key="index"
                      v-show="item.material_name"
                      style="margin-right:12px">
                      <span class="name">{{item.material_name}}：</span>
                      <span class="methods"
                        v-for="(itemApply,indexApply) in item.apply"
                        :key="itemApply">{{itemApply|filterIndex}}{{indexApply===item.apply.length-1?'':'/'}}</span>;
                    </span>
                  </div>
                </div>
                <div class="trow"
                  style="min-height:192px">
                  <div class="tcol w50 horizontal">纬向排列</div>
                  <div class="tcol noPad">
                    <template v-if="craftInfo.weft_data.weft_rank[0]&&craftInfo.weft_data.weft_rank[0].length>16">
                      <div class="tcol noPad">
                        <div class="alignCenter">查看附件信息</div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="trow h32"
                        v-for="(item,index) in craftInfo.weft_data.weft_rank"
                        :key="index"
                        :style="{'display':index!==5||ifShowWeftMerge3?'flex':'none'}">
                        <template v-if="index===0||index===2">
                          <div class="tcol"
                            v-for="(itemChild,indexChild) in item"
                            :key="indexChild">
                            {{itemChild}}
                          </div>
                        </template>
                        <template v-if="index===3||index===4||index===5||index===6">
                          <div class="tcol"
                            v-for="(itemChild,indexChild) in getMergeInfo(craftInfo.weft_data.merge_data,index,craftInfo.weft_data.weft_rank[index].length)"
                            :key="indexChild"
                            :style="{'min-width':6.25*itemChild.colspan + '%'}">
                            <span class="sign left"
                              :class="'style'+signType"
                              v-if="itemChild.colspan>1">
                              <span class="auto_long_arrow left_to_right"
                                v-if="signType==='3'"></span>
                            </span>
                            {{item[itemChild.col]}}
                            <span class="sign right"
                              :class="'style'+signType"
                              v-if="itemChild.colspan>1">
                              <span class="auto_long_arrow right_to_left"
                                v-if="signType==='3'"></span>
                            </span>
                          </div>
                        </template>
                        <template v-if="index===1">
                          <div class="tcol"
                            v-for="(itemChild,indexChild) in item"
                            :key="indexChild">
                            {{itemChild|filterIndex}}
                          </div>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="trow">
              <div class="tcol w50 horizontal bgGray">配色工艺</div>
              <div class="tcol noPad"
                style="min-height:205px">
                <template v-if="ifShowColorWeight">
                  <div class="tcol noPad">
                    <template v-if="colourInfoType===1">
                      <div class="trow">
                        <div class="tcol label bgGray">经纬信息</div>
                        <div class="tcol noPad">
                          <div class="trow h32">
                            <div class="tcol alignCenter bgGray"
                              style="min-width:20%"
                              v-for="index in maxJia"
                              :key="index">{{(index-1)|filterIndex}}</div>
                          </div>
                          <div class="trow h32">
                            <div class="tcol noPad flexRow"
                              v-for="index in maxJia"
                              :key="index"
                              style="min-width:20%">
                              <div class="tcol"
                                style="max-width:100%;min-width:auto">经</div>
                              <div class="tcol"
                                style="max-width:100%;min-width:auto;border-right:0">纬</div>
                            </div>
                          </div>
                        </div>
                        <div class="tcol label bgGray">下机时间</div>
                      </div>
                      <div class="trow">
                        <div class="tcol label bgGray">根数</div>
                        <div class="tcol noPad">
                          <div class="trow flexRow">
                            <div class="tcol noPad flexRow"
                              v-for="index in maxJia"
                              :key="index"
                              style="min-width:20%;max-width:20%;border-right:1px solid #010101">
                              <div class="tcol alignCenter"
                                style="max-width:100%;min-width:auto">{{colorWeigth.warp_data[0].color_scheme[index-1]?colorWeigth.warp_data[0].color_scheme[index-1].number||0:'0'}}</div>
                              <div class="tcol alignCenter"
                                style="max-width:100%;min-width:auto;border-right:0">{{colorWeigth.weft_data[0].color_scheme[index-1]?colorWeigth.weft_data[0].color_scheme[index-1].number||0:'0'}}</div>
                            </div>
                          </div>
                        </div>
                        <div class="tcol label">{{craftInfo.product_time}}</div>
                      </div>
                      <div class="trow">
                        <div class="tcol label bgGray">克重</div>
                        <div class="tcol noPad">
                          <div class="trow flexRow">
                            <div class="tcol noPad flexRow"
                              v-for="index in maxJia"
                              :key="index"
                              style="min-width:20%;max-width:20%;border-right:1px solid #010101">
                              <div class="tcol alignCenter"
                                style="max-width:100%;min-width:auto">{{colorWeigth.warp_data[0].color_scheme[index-1]?colorWeigth.warp_data[0].color_scheme[index-1].weight:''}}g</div>
                              <div class="tcol alignCenter"
                                style="max-width:100%;min-width:auto;border-right:0">{{colorWeigth.weft_data[0].color_scheme[index-1]?colorWeigth.weft_data[0].color_scheme[index-1].weight:'0'}}g</div>
                            </div>
                          </div>
                        </div>
                        <div class="tcol label bgGray">织造数量</div>
                      </div>
                      <div class="trow"
                        v-for="(itemColour,indexColour) in colorWeigth.warp_data"
                        :key="indexColour">
                        <div class="tcol label bgGray">{{itemColour.colour_name || '配色组' + (indexColour+1)}}</div>
                        <div class="tcol noPad">
                          <div class="trow flexRow">
                            <div class="tcol noPad flexRow"
                              v-for="index in maxJia"
                              :key="index"
                              style="min-width:20%;max-width:20%;border-right:1px solid #010101">
                              <template v-if="colorWeigth.warp_data[0].color_scheme[index-1]&&colorWeigth.weft_data[0].color_scheme[index-1]&&colorWeigth.warp_data[0].color_scheme[index-1].name===colorWeigth.weft_data[0].color_scheme[index-1].name">
                                <div class="tcol alignCenter"
                                  style="max-width:100%;min-width:auto">
                                  {{colorWeigth.warp_data[0].color_scheme[index-1].name}}
                                </div>
                              </template>
                              <template v-else>
                                <div class="tcol alignCenter"
                                  style="max-width:100%;min-width:auto">{{colorWeigth.warp_data[0].color_scheme[index-1]?colorWeigth.warp_data[0].color_scheme[index-1].name:''}}</div>
                                <div class="tcol alignCenter"
                                  style="max-width:100%;min-width:auto;border-right:0">{{colorWeigth.weft_data[0].color_scheme[index-1]?colorWeigth.weft_data[0].color_scheme[index-1].name:'0'}}</div>
                              </template>
                            </div>
                          </div>
                        </div>
                        <div class="tcol label">{{itemColour.weave_number}}</div>
                      </div>
                    </template>
                    <template v-if="colourInfoType===2">
                      <div class="trow">
                        <div class="tcol w50 horizontal bgGray">配色工艺</div>
                        <div class="tcol noPad">
                          <div class="trow">
                            <div class="tcol label bgGray">经纬信息</div>
                            <div class="tcol noPad">
                              <div class="trow h32">
                                <div class="tcol alignCenter bgGray"
                                  :style="{'min-width':10*colorWeigth.warp_data[0].color_scheme.length + '%'}">经向</div>
                                <div class="tcol alignCenter bgGray"
                                  :style="{'min-width':10*colorWeigth.weft_data[0].color_scheme.length + '%'}">纬向</div>
                              </div>
                              <div class="trow h32">
                                <div class="tcol alignCenter maxW10"
                                  v-for="(item,index) in colorWeigth.warp_data[0].color_scheme"
                                  :key="index+'warp'">{{index|filterIndex}}</div>
                                <div class="tcol alignCenter maxW10"
                                  v-for="(item,index) in colorWeigth.weft_data[0].color_scheme"
                                  :key="index+'weft'">{{index|filterIndex}}</div>
                              </div>
                            </div>
                            <div class="tcol label bgGray">下机时间</div>
                          </div>
                          <div class="trow">
                            <div class="tcol label bgGray">根数</div>
                            <div class="tcol noPad">
                              <div class="trow flexRow">
                                <div class="tcol alignCenter maxW10"
                                  v-for="(item,index) in colorWeigth.warp_data[0].color_scheme"
                                  :key="index+'warp'">{{item.number || 0}}</div>
                                <div class="tcol alignCenter maxW10"
                                  v-for="(item,index) in colorWeigth.weft_data[0].color_scheme"
                                  :key="index+'weft'">{{item.number || 0}}</div>
                              </div>
                            </div>
                            <div class="tcol label">{{craftInfo.product_time}}</div>
                          </div>
                          <div class="trow">
                            <div class="tcol label bgGray">克重</div>
                            <div class="tcol noPad">
                              <div class="trow flexRow">
                                <div class="tcol alignCenter maxW10"
                                  v-for="(item,index) in colorWeigth.warp_data[0].color_scheme"
                                  :key="index+'warp'">{{item.weight}}g</div>
                                <div class="tcol alignCenter maxW10"
                                  v-for="(item,index) in colorWeigth.weft_data[0].color_scheme"
                                  :key="index+'weft'">{{item.weight}}g</div>
                              </div>
                            </div>
                            <div class="tcol label bgGray">织造数量</div>
                          </div>
                          <div class="trow"
                            v-for="(itemColour,indexColour) in colorWeigth.warp_data"
                            :key="indexColour">
                            <div class="tcol label bgGray">{{itemColour.colour_name || '配色组' + (indexColour+1)}}</div>
                            <div class="tcol noPad">
                              <div class="trow flexRow">
                                <div class="tcol alignCenter maxW10"
                                  v-for="(item,index) in itemColour.color_scheme"
                                  :key="index+'warp'">{{item.name}}</div>
                                <div class="tcol alignCenter maxW10"
                                  v-for="(item,index) in colorWeigth.weft_data[indexColour].color_scheme"
                                  :key="index+'weft'">{{item.name}}</div>
                              </div>
                            </div>
                            <div class="tcol label">{{itemColour.weave_number}}</div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
                <template v-else>
                  <div class="alignCenter">查看附件信息</div>
                </template>
              </div>
            </div>
            <div class="trow">
              <div class="tcol bgGray label">后道工序</div>
              <div class="tcol"></div>
              <div class="tcol bgGray label">备注信息</div>
              <div class="tcol"></div>
            </div>
          </div>
        </div>
        <template v-if="craftInfo.warp_data.warp_rank[0]&&craftInfo.warp_data.warp_rank[0].length>16">
          <div class="tableCtn"
            v-for="(itemFather,indexFather) in $sliceToArray(craftInfo.warp_data.warp_rank[0], 16)"
            :key="indexFather + 'warp_rank'">
            <div class="tbody hasTop">
              <div class="trow">
                <div class="tcol w50 horizontal bgGray">原料经向</div>
                <div class="tcol noPad">
                  <div class="trow h32"
                    v-for="index in 7"
                    :key="index"
                    :style="{'display':index!==6||ifShowWarpMerge3?'flex':'none'}">
                    <template v-if="index===1||index===3">
                      <div class="tcol"
                        v-for="(itemChild,indexChild) in $sliceToArray(craftInfo.warp_data.warp_rank[index-1], 16)[indexFather]"
                        :key="indexChild">
                        {{itemChild}}
                      </div>
                    </template>
                    <template v-if="index===7||index===4||index===5||index===6">
                      <div class="tcol bold"
                        v-for="(itemChild,indexChild) in getMergeSliceInfo(getMergeInfo(craftInfo.warp_data.merge_data,index-1,craftInfo.warp_data.warp_rank[index-1].length))[indexFather]"
                        :key="indexChild"
                        :style="{'min-width':6.25*itemChild.colspan + '%'}">
                        <span class="sign left"
                          :class="'style'+signType"
                          v-if="itemChild.start&&itemChild.colspan>1">
                          <span class="auto_long_arrow left_to_right"
                            v-if="signType==='3'"></span>
                        </span>
                        <!-- itemChild.oldCol===0||itemChild.oldCol处理以下0判断为false -->
                        {{$sliceToArray(craftInfo.warp_data.warp_rank[index-1], 16)[(itemChild.oldCol===0||itemChild.oldCol)?Math.floor(itemChild.oldCol/16):indexFather][itemChild.oldCol||itemChild.oldCol===0?(itemChild.oldCol%16):(itemChild.col%16)]}}
                        <span class="sign right"
                          :class="'style'+signType"
                          v-if="itemChild.end&&itemChild.colspan>1">
                          <span class="auto_long_arrow right_to_left"
                            v-if="signType==='3'"></span>
                        </span>
                      </div>
                    </template>
                    <template v-if="index===2">
                      <div class="tcol"
                        v-for="(itemChild,indexChild) in $sliceToArray(craftInfo.warp_data.warp_rank[index-1], 16)[indexFather]"
                        :key="indexChild">
                        {{itemChild|filterIndex}}
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="craftInfo.weft_data.weft_rank[0]&&craftInfo.weft_data.weft_rank[0].length>16">
          <div class="tableCtn"
            v-for="(itemFather,indexFather) in $sliceToArray(craftInfo.weft_data.weft_rank[0], 16)"
            :key="indexFather + 'weft_rank'">
            <div class="tbody hasTop">
              <div class="trow">
                <div class="tcol w50 horizontal bgGray">原料纬向</div>
                <div class="tcol noPad">
                  <div class="trow h32"
                    v-for="index in 7"
                    :key="index"
                    :style="{'display':index!==6||ifShowWarpMerge3?'flex':'none'}">
                    <template v-if="index===1||index===3">
                      <div class="tcol"
                        v-for="(itemChild,indexChild) in $sliceToArray(craftInfo.weft_data.weft_rank[index-1], 16)[indexFather]"
                        :key="indexChild">
                        {{itemChild}}
                      </div>
                    </template>
                    <template v-if="index===7||index===4||index===5||index===6">
                      <div class="tcol"
                        v-for="(itemChild,indexChild) in getMergeSliceInfo(getMergeInfo(craftInfo.weft_data.merge_data,index-1,craftInfo.weft_data.weft_rank[index-1].length))[indexFather]"
                        :key="indexChild"
                        :style="{'min-width':6.25*itemChild.colspan + '%'}">
                        <span class="sign left"
                          :class="'style'+signType"
                          v-if="itemChild.start&&itemChild.colspan>1">
                          <span class="auto_long_arrow left_to_right"
                            v-if="signType==='3'"></span>
                        </span>
                        <!-- itemChild.oldCol===0||itemChild.oldCol处理以下0判断为false -->
                        {{$sliceToArray(craftInfo.weft_data.weft_rank[index-1], 16)[(itemChild.oldCol===0||itemChild.oldCol)?Math.floor(itemChild.oldCol/16):indexFather][itemChild.oldCol||itemChild.oldCol===0?(itemChild.oldCol%16):(itemChild.col%16)]}}
                        <span class="sign right"
                          :class="'style'+signType"
                          v-if="itemChild.end&&itemChild.colspan>1">
                          <span class="auto_long_arrow right_to_left"
                            v-if="signType==='3'"></span>
                        </span>
                      </div>
                    </template>
                    <template v-if="index===2">
                      <div class="tcol"
                        v-for="(itemChild,indexChild) in $sliceToArray(craftInfo.weft_data.weft_rank[index-1], 16)[indexFather]"
                        :key="indexChild">
                        {{itemChild|filterIndex}}
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="colourInfoType===3">
          <div class="tableCtn">
            <div class="tbody hasTop">
              <div class="trow">
                <div class="tcol w50 horizontal bgGray">配色工艺</div>
                <div class="tcol noPad">
                  <div class="trow">
                    <div class="tcol label bgGray">经向信息</div>
                    <div class="tcol noPad">
                      <div class="trow">
                        <div class="tcol alignCenter bgGray">经向</div>
                      </div>
                      <div class="trow">
                        <div class="tcol alignCenter"
                          v-for="(item,index) in colorWeigth.warp_data[0].color_scheme"
                          :key="index">{{index|filterIndex}}</div>
                      </div>
                    </div>
                    <div class="tcol label bgGray">下机时间</div>
                  </div>
                  <div class="trow">
                    <div class="tcol label bgGray">根数</div>
                    <div class="tcol noPad">
                      <div class="trow">
                        <div class="tcol alignCenter"
                          v-for="(item,index) in colorWeigth.warp_data[0].color_scheme"
                          :key="index">{{item.number || 0}}</div>
                      </div>
                    </div>
                    <div class="tcol label">{{craftInfo.product_time}}</div>
                  </div>
                  <div class="trow">
                    <div class="tcol label bgGray">克重</div>
                    <div class="tcol noPad">
                      <div class="trow">
                        <div class="tcol alignCenter"
                          v-for="(item,index) in colorWeigth.warp_data[0].color_scheme"
                          :key="index">{{item.weight}}g</div>
                      </div>
                    </div>
                    <div class="tcol label bgGray">织造数量</div>
                  </div>
                  <div class="trow"
                    v-for="(itemColour,indexColour) in colorWeigth.warp_data"
                    :key="indexColour">
                    <div class="tcol label bgGray">{{itemColour.colour_name || '配色组' + (indexColour+1)}}</div>
                    <div class="tcol noPad">
                      <div class="trow">
                        <div class="tcol alignCenter"
                          v-for="(item,index) in itemColour.color_scheme"
                          :key="index">{{item.name}}</div>
                      </div>
                    </div>
                    <div class="tcol label">{{itemColour.weave_number}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tableCtn">
            <div class="tbody hasTop">
              <div class="trow">
                <div class="tcol w50 horizontal bgGray">配色工艺</div>
                <div class="tcol noPad">
                  <div class="trow">
                    <div class="tcol label bgGray">纬向信息</div>
                    <div class="tcol noPad">
                      <div class="trow">
                        <div class="tcol alignCenter bgGray">纬向</div>
                      </div>
                      <div class="trow">
                        <div class="tcol alignCenter"
                          v-for="(item,index) in colorWeigth.weft_data[0].color_scheme"
                          :key="index">{{index|filterIndex}}</div>
                      </div>
                    </div>
                    <div class="tcol label bgGray">下机时间</div>
                  </div>
                  <div class="trow">
                    <div class="tcol label bgGray">根数</div>
                    <div class="tcol noPad">
                      <div class="trow">
                        <div class="tcol alignCenter"
                          v-for="(item,index) in colorWeigth.weft_data[0].color_scheme"
                          :key="index">{{item.number || 0}}</div>
                      </div>
                    </div>
                    <div class="tcol label">{{craftInfo.product_time}}</div>
                  </div>
                  <div class="trow">
                    <div class="tcol label bgGray">克重</div>
                    <div class="tcol noPad">
                      <div class="trow">
                        <div class="tcol alignCenter"
                          v-for="(item,index) in colorWeigth.weft_data[0].color_scheme"
                          :key="index">{{item.weight}}g</div>
                      </div>
                    </div>
                    <div class="tcol label bgGray">织造数量</div>
                  </div>
                  <div class="trow"
                    v-for="(itemColour,indexColour) in colorWeigth.weft_data"
                    :key="indexColour">
                    <div class="tcol label bgGray">{{itemColour.colour_name || '配色组' + (indexColour+1)}}</div>
                    <div class="tcol noPad">
                      <div class="trow">
                        <div class="tcol alignCenter"
                          v-for="(item,index) in itemColour.color_scheme"
                          :key="index">{{item.name}}</div>
                      </div>
                    </div>
                    <div class="tcol label">{{itemColour.weave_number}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="!ifShowColorWeight&&colourInfoType===1">
          <div class="tableCtn"
            v-for="index in Math.ceil(maxJia/5)"
            :key="index">
            <div class="tbody hasTop">
              <div class="trow">
                <div class="tcol w50 horizontal bgGray">配色工艺</div>
                <div class="tcol noPad">
                  <div class="trow">
                    <div class="tcol label bgGray">经纬信息</div>
                    <div class="tcol noPad">
                      <div class="trow h32">
                        <div class="tcol alignCenter bgGray"
                          style="min-width:20%"
                          :style="indexChild===5?'border-right:0':''"
                          v-for="indexChild in ((index*5)<maxJia?'':maxJia%5) || 5"
                          :key="indexChild">{{(indexChild+5*(index-1)-1)|filterIndex}}</div>
                      </div>
                      <div class="trow h32">
                        <div class="tcol noPad flexRow"
                          v-for="indexChild in ((index*5)<maxJia?'':maxJia%5) || 5"
                          :key="indexChild"
                          style="min-width:20%"
                          :style="indexChild===5?'border-right:0':''">
                          <div class="tcol"
                            style="max-width:100%;min-width:auto">经</div>
                          <div class="tcol"
                            style="max-width:100%;min-width:auto;border-right:0">纬</div>
                        </div>
                      </div>
                    </div>
                    <div class="tcol label bgGray">下机时间</div>
                  </div>
                  <div class="trow">
                    <div class="tcol label bgGray">根数</div>
                    <div class="tcol noPad">
                      <div class="trow flexRow">
                        <div class="tcol noPad flexRow"
                          v-for="indexChild in ((index*5)<maxJia?'':maxJia%5) || 5"
                          :key="indexChild"
                          :style="indexChild===5?'border-right:0':''"
                          style="min-width:20%;max-width:20%;border-right:1px solid #010101">
                          <div class="tcol alignCenter"
                            style="max-width:100%;min-width:auto">{{colorWeigth.warp_data[0].color_scheme[(indexChild+5*(index-1)-1)]?colorWeigth.warp_data[0].color_scheme[(indexChild+5*(index-1)-1)].number||0:'0'}}</div>
                          <div class="tcol alignCenter"
                            style="max-width:100%;min-width:auto;border-right:0">{{colorWeigth.weft_data[0].color_scheme[(indexChild+5*(index-1)-1)]?colorWeigth.weft_data[0].color_scheme[(indexChild+5*(index-1)-1)].number||0:'0'}}</div>
                        </div>
                      </div>
                    </div>
                    <div class="tcol label">{{craftInfo.product_time}}</div>
                  </div>
                  <div class="trow">
                    <div class="tcol label bgGray">克重</div>
                    <div class="tcol noPad">
                      <div class="trow flexRow">
                        <div class="tcol noPad flexRow"
                          v-for="indexChild in ((index*5)<maxJia?'':maxJia%5) || 5"
                          :key="indexChild"
                          :style="indexChild===5?'border-right:0':''"
                          style="min-width:20%;max-width:20%;border-right:1px solid #010101">
                          <div class="tcol alignCenter"
                            style="max-width:100%;min-width:auto">{{colorWeigth.warp_data[0].color_scheme[(indexChild+5*(index-1)-1)]?colorWeigth.warp_data[0].color_scheme[(indexChild+5*(index-1)-1)].weight:''}}g</div>
                          <div class="tcol alignCenter"
                            style="max-width:100%;min-width:auto;border-right:0">{{colorWeigth.weft_data[0].color_scheme[(indexChild+5*(index-1)-1)]?colorWeigth.weft_data[0].color_scheme[(indexChild+5*(index-1)-1)].weight:'0'}}g</div>
                        </div>
                      </div>
                    </div>
                    <div class="tcol label bgGray">织造数量</div>
                  </div>
                  <div class="trow"
                    v-for="(itemColour,indexColour) in colorWeigth.warp_data"
                    :key="indexColour">
                    <div class="tcol label bgGray">{{itemColour.colour_name || '配色组' + (indexColour+1)}}</div>
                    <div class="tcol noPad">
                      <div class="trow flexRow">
                        <div class="tcol noPad flexRow"
                          v-for="indexChild in ((index*5)<maxJia?'':maxJia%5) || 5"
                          :key="indexChild"
                          :style="indexChild===5?'border-right:0':''"
                          style="min-width:20%;max-width:20%;border-right:1px solid #010101">
                          <template v-if="colorWeigth.warp_data[0].color_scheme[(indexChild+5*(index-1)-1)]&&colorWeigth.weft_data[0].color_scheme[(indexChild+5*(index-1)-1)]&&colorWeigth.warp_data[0].color_scheme[(indexChild+5*(index-1)-1)].name===colorWeigth.weft_data[0].color_scheme[(indexChild+5*(index-1)-1)].name">
                            <div class="tcol alignCenter"
                              style="max-width:100%;min-width:auto">
                              {{colorWeigth.warp_data[0].color_scheme[(indexChild+5*(index-1)-1)].name}}
                            </div>
                          </template>
                          <template v-else>
                            <div class="tcol alignCenter"
                              style="max-width:100%;min-width:auto">{{colorWeigth.warp_data[0].color_scheme[(indexChild+5*(index-1)-1)]?colorWeigth.warp_data[0].color_scheme[(indexChild+5*(index-1)-1)].name:'无'}}</div>
                            <div class="tcol alignCenter"
                              style="max-width:100%;min-width:auto;border-right:0">{{colorWeigth.weft_data[0].color_scheme[(indexChild+5*(index-1)-1)]?colorWeigth.weft_data[0].color_scheme[(indexChild+5*(index-1)-1)].name:'无'}}</div>
                          </template>
                        </div>
                      </div>
                    </div>
                    <div class="tcol label">{{itemColour.weave_number}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="tableCtn"
          v-if="!ifShowGL">
          <div class="tbody hasTop">
            <div class="trow">
              <div class="tcol w50 horizontal bgGray">纹版图</div>
              <div class="tcol noPad">
                <div class="GLCtn"
                  v-for="(item1,index1) in craftInfo.draft_method.GL"
                  :key="index1">
                  <div class="mark">{{alphabet[index1]}}：
                  </div>
                  <div v-for="(item2,index2) in item1"
                    :key="index2"
                    class="deltaCtn"
                    :class="{'moreMargin':GLXuhao[index1]&&findGLRepeat(index1,GLXuhao[index1][index2],'end')}">
                    <div class="repeatLeft"
                      v-show="GLXuhao[index1]&&findGLRepeat(index1,GLXuhao[index1][index2],'start')"></div>
                    <div class="leftCtn">
                      <span :content="GLXuhao[index1] ? GLXuhao[index1][index2] : index2+1">{{GLXuhao[index1] ? GLXuhao[index1][index2] : ''}}</span>
                    </div>
                    <div class="rightCtn">
                      <div class="hehe">
                        <span class="haha">{{item2[0].value}}</span>
                        <div class="normal"
                          :class="item2[0].mark"
                          v-show="item2[0].mark"></div>
                      </div>
                      <div class="hehe">
                        <span class="haha">{{item2[1].value}}</span>
                        <div class="normal"
                          :class="item2[1].mark"
                          v-show="item2[1].mark"></div>
                      </div>
                      <div class="hehe">
                        <span class="haha">{{item2[2].value}}</span>
                        <div class="normal"
                          :class="item2[2].mark"
                          v-show="item2[2].mark"></div>
                      </div>
                    </div>
                    <div class="repeatRight"
                      v-show="GLXuhao[index1]&&findGLRepeat(index1,GLXuhao[index1][index2],'end')">
                      <div class="repeatTime"
                        v-if="GLXuhao[index1]&&findGLRepeat(index1,GLXuhao[index1][index2],'end')">✖{{findGLRepeat(index1,GLXuhao[index1][index2],'end').repeat}}遍</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="setting_sign_style"
      v-if="showMenu"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click.stop>
      <div class="setting_item"
        @click="windowMethod(1)">刷新</div>
      <div class="setting_item"
        @click="windowMethod(2)">打印</div>
      <div class="setting_item"
        @click="windowMethod(3)">打印设置</div>
    </div>
    <div class="popup"
      v-if="showPrintSettingFlag"
      @click.right.stop.prevent>
      <div class="main">
        <div class="titleCtn">
          <span class="text">打印设置</span>
          <span class="el-icon-close"
            @click="showPrintSettingFlag = false"></span>
        </div>
        <div class="contentCtn">
          <div class="row">
            <span class="label"
              style="width:8em;padding-top:12px">表格遍数模式：</span>
            <span class="info"
              style="height:auto">
              <el-radio-group v-model="signType"
                style="display:flex;flex-direction:column;justify-content:space-between;margin-top:10px">
                <el-radio label="1">
                  <span class="labelCtn">
                    <span style="margin-right:12px">模式一</span>
                    <span class="signCtn">
                      <span class="sign style1 right"></span>
                      <span class="sign style1 left"></span>
                    </span>
                  </span>
                </el-radio>
                <el-radio label="2">
                  <span class="labelCtn">
                    <span style="margin-right:12px">模式二</span>
                    <span class="signCtn">
                      <span class="sign style2 right"></span>
                      <span class="sign style2 left"></span>
                    </span>
                  </span>
                </el-radio>
                <el-radio label="3">
                  <span class="labelCtn">
                    <span style="margin-right:12px">模式三</span>
                    <span class="signCtn">
                      <span class="sign style3 right">
                        <span class="auto_long_arrow right_to_left"></span>
                      </span>
                      <span class="sign style3 left">
                        <span class="auto_long_arrow left_to_right"></span>
                      </span>
                    </span>
                  </span>
                </el-radio>
              </el-radio-group>
            </span>
          </div>
          <div class="row">
            <span class="label"
              style="width:7em;padding-top:12px">配色工艺排列：</span>
            <span class="info"
              style="height:auto">
              <el-radio-group v-model="colourInfoType"
                style="display:flex;flex-direction:column;justify-content:space-between;margin-top:10px">
                <el-radio :label="1"><span class="labelCtn">按主夹排列</span> </el-radio>
                <el-radio :label="2"
                  v-if="colorWeigth.warp_data[0].color_scheme.length + colorWeigth.weft_data[0].color_scheme.length <=10"><span class="labelCtn">按经纬排列</span> </el-radio>
                <el-radio :label="3"><span class="labelCtn">按经纬排列，且不缩小字体</span> </el-radio>
              </el-radio-group>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { craft } from '@/assets/js/api'
import { CraftInfo, DraftMethods, GLReapeat, MergeDataInfo } from '@/types/craft'
// 配色根数重量数组
interface ColorWeigthInfo {
  warp_data: Array<{
    weave_number: number
    colour_name: string
    color_scheme: Array<{
      name: string
      number: number
      weight: number
    }>
  }>
  weft_data: Array<{
    weave_number: number
    colour_name: string
    color_scheme: Array<{
      name: string
      number: number
      weight: number
    }>
  }>
}
export default Vue.extend({
  data(): {
    colorWeigth: ColorWeigthInfo
    GLRepeatXuhao: GLReapeat[][]
    craftInfo: CraftInfo
    [propName: string]: any
  } {
    return {
      signType: '3',
      qrCodeUrl: '',
      company_name: window.sessionStorage.getItem('company_name'),
      X_position: 0,
      Y_position: 0,
      showMenu: false,
      showPrintSetting: false,
      showPrintSettingFlag: false,
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
      GLRepeatXuhao: [],
      GLXuhao: [], // 纹版图循环重算序号
      completeGL: [], // 纹版图根据纹版图循环补充完整
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
      colorWeigth: {
        warp_data: [
          {
            weave_number: 0,
            colour_name: '',
            color_scheme: []
          }
        ],
        weft_data: [
          {
            weave_number: 0,
            colour_name: '',
            color_scheme: []
          }
        ]
      },
      colourInfoType: 1
    }
  },
  methods: {
    handleClickRight(e: any, type = true) {
      this.showMenu = type
      this.X_position = e.clientX
      this.Y_position = e.clientY
      e.preventDefault()
      e.stopPropagation()
    },
    windowMethod(type: 1 | 2 | 3) {
      this.showMenu = false
      this.showPrintSetting = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          window.print()
        } else if (type === 3) {
          this.showPrintSettingFlag = true
        }
      })
    },
    findGLRepeat(index: number, xuhao: number, type: 'start' | 'end') {
      return this.GLRepeatXuhao[index].find((item) => item[type] === xuhao && item.repeat !== 1)
    },
    // 合并项信息处理
    getMergeInfo(mergeTable: MergeDataInfo[], row: number, length: number): MergeDataInfo[] {
      const mergeArr = mergeTable
        .filter((item) => item.row === row)
        .sort((a, b) => {
          return a.col - b.col
        })
      let saveMerge: MergeDataInfo[] = []
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
    // 合并项信息二次处理,主要是为了解决表格一行放不下需要多张表展示
    getMergeSliceInfo(info: MergeDataInfo[]): MergeDataInfo[][] {
      let sliceMergeData: MergeDataInfo[][] = []
      let i = 0
      let j = 0
      info.forEach((item) => {
        if (!sliceMergeData[j]) {
          sliceMergeData.push([])
        }
        i = i + item.colspan
        if (i === 16) {
          // 直接嵌入
          sliceMergeData[j].push({
            col: item.col,
            colspan: item.colspan,
            row: item.row,
            oldCol: item.col,
            start: true,
            end: true
          })
          j++
          i = 0
        } else if (i > 16) {
          // 先把剩下的格子填满
          sliceMergeData[j].push({
            col: item.col,
            colspan: 16 - i + item.colspan,
            row: item.row,
            oldCol: item.col,
            start: true,
            end: false
          })
          i = i - 16
          while (i > 16) {
            j++
            sliceMergeData.push([
              {
                oldCol: item.col,
                col: j * 16,
                colspan: 16,
                row: item.row,
                start: false,
                end: false
              }
            ])
            i = i - 16
          }
          if (i > 0) {
            j++
            sliceMergeData.push([
              {
                oldCol: item.col,
                col: j * 16,
                colspan: i,
                row: item.row,
                start: false,
                end: true
              }
            ])
          }
        } else {
          sliceMergeData[j].push({
            oldCol: item.col,
            col: item.col,
            colspan: item.colspan,
            row: item.row,
            start: true,
            end: true
          })
        }
        // if (i === 16) {
        //   sliceMergeData[j].push({
        //     col: item.col,
        //     colspan: 1,
        //     row: item.row
        //   })
        //   j++
        //   i = 0
        // } else if (i > 16) {
        //   sliceMergeData[j].push({
        //     col: item.col,
        //     colspan: 16 - i + item.colspan,
        //     row: item.row
        //   })
        //   j++
        //   sliceMergeData[j] = []
        //   i = i - (16 - i + item.colspan)
        //   while (i > 16) {
        //     sliceMergeData[j].push({
        //       oldCol: item.col,
        //       col: j * 16,
        //       colspan: 16,
        //       row: item.row
        //     })
        //     i = i - 16
        //     j++
        //     sliceMergeData[j] = []
        //   }
        //   if (i > 0) {
        //     sliceMergeData[j].push({
        //       oldCol: item.col,
        //       col: j * 16,
        //       colspan: item.col + item.colspan - j * 16,
        //       row: item.row
        //     })
        //     i = item.col + item.colspan - j * 16
        //   }
        // } else {
        //   sliceMergeData[j].push(item)
        // }
      })
      return sliceMergeData
    }
  },
  filters: {
    // 匹配主/夹名称
    filterIndex(index: number): string {
      if (index === 0) {
        return '主'
      } else {
        return '夹' + index
      }
    },
    filterThroughMethod(items: DraftMethods) {
      let str = ''
      let romanNum = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ']
      if (items.PMFlag === 'normal') {
        items.PM.forEach((item, key) => {
          str +=
            (romanNum[key] || key + 1) +
            '【' +
            item.number +
            '根（' +
            item.value +
            '）' +
            '】' +
            (item.repeat && item.repeat !== 1 ? 'x' + item.repeat + '遍' : '') +
            (key !== items.PM.length - 1 ? '。' : '')
        })
      } else if (items.PMFlag === 'complex') {
        items.PM.forEach((item, key) => {
          str += romanNum[key] || key + 1
          str += `【${item.total}根`
          item.children!.forEach((value, index) => {
            str += '{' + value.number + '根'
            value.children!.forEach((val, ind) => {
              str +=
                '（' +
                val.value +
                '）' +
                (val.repeat && val.repeat !== 1 ? 'x' + val.repeat + '遍' : '') +
                (ind !== value.children!.length - 1 ? '，' : '')
            })
            str += '}' + (index !== item.children!.length - 1 ? '+' : '')
          })
          str += `】${item.repeat && item.repeat !== 1 ? 'x' + item.repeat + '遍' : ''}`
        })
      }
      return str
    }
  },
  computed: {
    maxJia(): number {
      return Math.max(
        this.colorWeigth.warp_data[0].color_scheme.length,
        this.colorWeigth.weft_data[0].color_scheme.length
      )
    },
    // 是否展示纹版图
    ifShowGL(): boolean {
      return this.craftInfo.draft_method.GL.length === 1 && this.craftInfo.draft_method.GL[0].length < 5
    },
    // 是否展示配色克重信息
    ifShowColorWeight(): boolean {
      // 按主夹排列
      if (this.colourInfoType === 1) {
        return (
          this.colorWeigth.warp_data[0].color_scheme &&
          this.colorWeigth.weft_data[0].color_scheme &&
          Math.max(
            this.colorWeigth.warp_data[0].color_scheme.length,
            this.colorWeigth.weft_data[0].color_scheme.length
          ) <= 5
        )
      } else if (this.colourInfoType === 2) {
        return true
      } else {
        return false
      }
    },
    // 是否展示第三个合并项
    ifShowWarpMerge3(): boolean {
      return (this.craftInfo.warp_data.merge_data as MergeDataInfo[]).filter((item) => item.row === 5).length > 0
    },
    ifShowWeftMerge3(): boolean {
      return (this.craftInfo.weft_data.merge_data as MergeDataInfo[]).filter((item) => item.row === 5).length > 0
    }
  },
  mounted() {
    craft
      .detail({
        id: Number(this.$route.query.id)
      })
      .then((res) => {
        if (res.data.status) {
          this.craftInfo = res.data.data
          // 生成二维码
          const QRCode = require('qrcode')
          QRCode.toDataURL(`${this.craftInfo.craft_code}`)
            .then((url: any) => {
              this.qrCodeUrl = url
              // console.log(this.qrCodeUrl)
            })
            .catch((err: any) => {
              console.error(err)
            })
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

          // 处理配色组根数和重量信息
          this.colorWeigth.warp_data = []
          this.colorWeigth.weft_data = []
          this.craftInfo.warp_data.color_data.forEach((item) => {
            this.colorWeigth.warp_data.push({
              weave_number: item.weave_number as number,
              colour_name: item.color_name as string,
              color_scheme: item.color_scheme.map((itemChild) => {
                return {
                  name: itemChild.name,
                  number: itemChild.number as number,
                  weight: Math.round(
                    itemChild.material_weight!.reduce((total, cur) => {
                      return total + Number(cur.weight * 1000)
                    }, 0)
                  )
                }
              })
            })
          })
          this.craftInfo.weft_data.color_data.forEach((item) => {
            this.colorWeigth.weft_data.push({
              weave_number: item.weave_number as number,
              colour_name: item.color_name as string,
              color_scheme: item.color_scheme.map((itemChild) => {
                return {
                  name: itemChild.name,
                  number: itemChild.number as number,
                  weight: Math.round(
                    itemChild.material_weight!.reduce((total, cur) => {
                      return total + Number(cur.weight * 1000)
                    }, 0)
                  )
                }
              })
            })
          })
        }

        console.log(
          // @ts-ignore
          this.getMergeInfo(this.craftInfo.warp_data.merge_data, 3, this.craftInfo.warp_data.warp_rank[3].length),
          this.getMergeSliceInfo(
            // @ts-ignore
            this.getMergeInfo(this.craftInfo.warp_data.merge_data, 3, this.craftInfo.warp_data.warp_rank[3].length)
          )
        )
        console.log(this.$sliceToArray(this.craftInfo.warp_data.warp_rank[3], 16))
      })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/craft/print.less';
</style>