<template>
  <div id="craftCreate"
    class="bodyContainer"
    v-loading="loading">
    <div class="module"
      v-if="!$route.query.id">
      <div class="titleCtn">
        <div class="title">选择产品/样品</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input v-model="keyword"
              placeholder="搜索产品/样品编号"
              @keydown.enter.native="getProList"></el-input>
          </div>
          <div class="elCtn">
            <el-input v-model="product_name"
              placeholder="搜索产品/样品名称"
              @keydown.enter.native="getProList"></el-input>
          </div>
          <div class="elCtn">
            <el-select v-model="product_type"
              placeholder="请选择类型"
              @change="getProList">
              <el-option label="全部"
                :value="0"></el-option>
              <el-option label="产品"
                :value="1"></el-option>
              <el-option label="样品"
                :value="2"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select v-model="user_id"
              placeholder="请选择创建人"
              @change="getProList"
              clearable>
              <el-option v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">编号</div>
            <div class="col">品类</div>
            <div class="col">名称</div>
            <div class="col">图片</div>
            <div class="col">创建人</div>
            <div class="col">创建日期</div>
            <div class="col">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col ">
              <span class="circle"
                :class="{'backHoverBlue':item.product_type===1,'backHoverOrange':item.product_type===2}">{{item.product_type===1?'产':'样'}}</span>
              <span style="cursor:pointer"
                @click="proId=item.id;item.product_type===1?productShow=true:sampleShow=true">{{item.product_code || item.system_code}}</span>
            </div>
            <div class="col">{{item.category}}/{{item.secondary_category}}</div>
            <div class="col">{{item.name}}</div>
            <div class="col">
              <div class="imageCtn">
                <el-image :src="item.image_data.length>0?item.image_data[0]:require('@/assets/image/common/noPic.png')"
                  :preview-src-list="item.image_data">
                </el-image>
              </div>
            </div>
            <div class="col">{{item.user_name}}</div>
            <div class="col">{{item.created_at.slice(0,10)}}</div>
            <div class="col oprCtn">
              <div class="opr"
                :class="{'hoverBlue':!item.check,'hoverOrange':item.check}"
                @click="initProInfo(item.id);item.check=true">{{item.check?'已选择':'添加工艺'}}</div>
            </div>
          </div>
          <div class="pageCtn">
            <el-pagination background
              :page-size="10"
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="page"
              @current-change="getProList">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="module"
      v-if="$route.query.id">
      <div class="titleCtn">
        <div class="title">基本信息</div>
      </div>
      <div class="detailCtn">
        <div class="row">
          <div class="col">
            <div class="label">{{productType}}编号：</div>
            <div class="text">{{productInfo.product_code||productInfo.system_code}}</div>
          </div>
          <div class="col">
            <div class="label">{{productType}}名称：</div>
            <div class="text">{{productInfo.name||'无'}}</div>
          </div>
          <div class="col">
            <div class="label">{{productType}}品类：</div>
            <div class="text">{{productInfo.category}}/{{productInfo.secondary_category}}</div>
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
        <div class="row"
          v-for="(item) in productInfo.part_data"
          :key="item.id">
          <div class="col">
            <div class="label">配件名称：</div>
            <div class="text">
              <span style="margin-right:12px">{{item.name}}(单位:{{item.unit}})</span>
            </div>
          </div>
          <div class="col">
            <div class="label">配件成分：</div>
            <div class="text">
              <span style="margin-right:12px"
                v-for="itemChild in item.part_component_data"
                :key="itemChild.id">{{itemChild.name}}{{itemChild.number}}%</span>
            </div>
          </div>
          <div class="col">
            <div class="label">尺码信息：</div>
            <div class="text">
              <span v-for="(itemChild,indexChild) in item.part_size_data"
                :key="itemChild.id"
                style="margin-right:12px"> {{indexChild+1}}.&nbsp;{{itemChild.name}}&nbsp;{{itemChild.weight}}g&nbsp;{{itemChild.size_info}}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
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
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title"
          style="display:flex;
            align-items: center;
            justify-content: space-between;">原料经向
          <div class="btn backHoverOrange"
            style="height:32px;font-weight: normal;"
            @click="openImport">导入旧版工艺单</div>
        </div>
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
                v-model="itemColour.color_id"
                @change="keepColourSame('warp')"
                :class="{'error':colourList.length>0&&mustFlag&&!itemColour.color_id}">
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
                @click="addColour">添加色组</span>
              <span class="btn hoverRed"
                @click="deleteColour(indexColour)">删除色组</span>
              <zh-color-picker v-for="(itemColor,indexColor) in itemColour.color_scheme"
                :key="indexColor + itemColour.color_scheme[indexColor]"
                class="color"
                v-model="itemColour.color_scheme[indexColor]"
                :content="filterIndex(indexColor)"
                :colorArr="yarnColorList"></zh-color-picker>
              <div class="borderBtn"
                @click="addColor('warp')">
                <i class="el-icon-plus"></i>
              </div>
              <div class="borderBtn"
                @click="deleteColor('warp')">
                <i class="el-icon-minus"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label"
              style="width:220px">
              <span class="text">主要原料</span>
              <span class="explanation">(必选)</span>
              <el-tooltip class="item"
                effect="dark"
                content="设置成功后请点击此按钮刷新数据"
                placement="top">
                <i class="el-icon-refresh hoverGreen fr"
                  style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                  @click="$checkCommonInfo([{
                    checkWhich: 'api/material',
                    getInfoMethed: 'dispatch',
                    getInfoApi: 'getMaterialAsync',
                    forceUpdate:true
                  }])"></i>
              </el-tooltip>
              <el-tooltip class="item"
                effect="dark"
                content="添加新原料"
                placement="top">
                <i class="el-icon-upload hoverOrange fr"
                  style="line-height:38px;font-size:18px;cursor:pointer;"
                  @click="$openUrl('/setting/?pName=物料设置&cName=纱线原料')"></i>
              </el-tooltip>
            </div>
            <div class="elCtn">
              <el-select placeholder="请选择主要原料"
                v-model="craftInfo.warp_data.material_data[0].material_id"
                @change="cmpYarnCoefficient"
                :class="{'error':mustFlag&&!craftInfo.warp_data.material_data[0].material_id}"
                filterable>
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
              v-show="indexMat>0"
              filterable>
              <el-select class="colour noBottom"
                placeholder="请选择次要原料"
                v-model="itemMat.material_id"
                clearable
                @change="cmpYarnCoefficient"
                filterable>
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
                class="jia"
                clearable>
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
                v-model="itemMat.material_id"
                @change="cmpYarnCoefficient"
                clearable>
                <el-option v-for="item in assistMaterialList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"></el-option>
              </el-select>
              <span class="btn hoverBlue"
                @click="$addItem(craftInfo.warp_data.assist_material,{material_id: '',apply: [],number: ''})">添加原料</span>
              <span class="btn hoverRed">删除原料</span>
              <el-select v-for="(item,index) in itemMat.apply"
                :key="index"
                v-model="itemMat.apply[index]"
                placeholder="夹"
                class="jia"
                clearable>
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
                  @click="craftInfo.warp_data.back_status=2"
                  :class="{'active':craftInfo.warp_data.back_status===2}">单</span>
                <span class="text"
                  @click="craftInfo.warp_data.back_status=1"
                  :class="{'active':craftInfo.warp_data.back_status===1}">双</span>
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
              提示1：可使用乘以[ ]遍，最后一遍去掉[ ]列到[ ]列。例如：乘以[4]遍，最后一遍去掉[17]列到[19]列；注意只需要在括号中输入需要乘的遍数，和需要去掉的列数即可。删除括号符号会导致功能失效。
              <br />
              提示2：可以在第三个合并项里使用"顺一遍倒一遍"功能，注意不要在第一个/第二个合并项里使用！不要修改"顺一遍倒一遍"文字信息
              <br />
              提示3：停撬功能，可以点击表格序号，选择需要标记的符号。
            </div>
          </div>
        </div>
        <div class="row"
          v-show="craftInfo.warp_data.back_status===1">
          <div class="col">
            <div class="label">
              <span class="text">经向反面</span>
              <el-input v-model="insertNumber.warpBack"
                class="element"
                placeholder="请输入插入列数">
                <template slot="append">列</template>
              </el-input>
              <div class="btn backHoverBlue"
                @click="insertCol('warpBack')">插入</div>
              <el-input v-model="invertedOrder.warpBack[0]"
                class="element"
                placeholder="倒序从第几列开始">
                <template slot="append">列</template>
              </el-input>
              <span style="color:#E9E9E9;margin:0 0 0 12px">~</span>
              <el-input v-model="invertedOrder.warpBack[1]"
                class="element"
                placeholder="倒序到第几列结束">
                <template slot="append">列</template>
              </el-input>
              <div class="btn backHoverBlue"
                @click="invertedCol('warpBack')">倒序一遍</div>
              <div class="btn borderBtn"
                @click="resetTable('warpBack')">重置</div>
            </div>
            <div class="hotTable">
              <div ref="warpBack"></div>
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
              <el-autocomplete class="inline-input"
                v-model="craftInfo.warp_data.side"
                :fetch-suggestions="searchSide"
                placeholder="请选择边型"></el-autocomplete>
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
              <el-autocomplete class="inline-input"
                v-model="craftInfo.warp_data.machine"
                :fetch-suggestions="searchMachine"
                placeholder="请选择机型"></el-autocomplete>
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
              <el-input v-model="craftInfo.warp_data.reed"
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
              <el-input v-model="craftInfo.warp_data.reed_method"
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
              <el-input v-model="craftInfo.warp_data.sum_up"
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
              <span class="explanation">(根据筘幅说明计算)</span>
            </div>
            <div class="info elCtn">
              <el-input :class="{'error':mustFlag&&!craftInfo.warp_data.reed_width}"
                v-model="craftInfo.warp_data.reed_width"
                disabled
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
                v-model="craftInfo.warp_data.reed_width_explain[0]"
                placeholder="请输入筘幅">
                <template slot="append">cm</template>
              </el-input>
              <el-input style="width:376px;margin:0 12px"
                v-model="craftInfo.warp_data.reed_width_explain[1]"
                placeholder="请输入筘幅">
                <template slot="append">cm</template>
              </el-input>
              <el-input style="width:200px"
                v-model="craftInfo.warp_data.reed_width_explain[2]"
                placeholder="请输入筘幅">
                <template slot="append">cm</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col flex3">
            <div class="label">
              <span class="text">选择常用穿综法</span>
              <el-tooltip class="item"
                effect="dark"
                content="保存本次穿综法"
                placement="top">
                <i class="el-icon-upload hoverOrange fr"
                  style="line-height:38px;font-size:18px;cursor:pointer;"
                  @click="saveDraftMethods"></i>
              </el-tooltip>
            </div>
            <div class="info elCtn">
              <el-select v-model="draftMethod"
                placeholder="请选择常用穿综法"
                @change="getDraftMethod">
                <el-option v-for="item in draftMethodList"
                  :key="item.id"
                  :value="item.pattern_loop"
                  :label="item.name">
                  <span class="green">{{item.name}}</span>
                  <span class="red fr"
                    @click.stop="deleteDraftMethods(item.id)">删除</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">纹版图</span>
              <i class="sliderCtn">
                <span class="text"
                  :class="{'active':craftInfo.draft_method.GLFlag==='normal'}"
                  @click="craftInfo.draft_method.GLFlag = 'normal'">普通</span>
                <span class="text"
                  :class="{'active':craftInfo.draft_method.GLFlag==='complex'}"
                  @click="craftInfo.draft_method.GLFlag = 'complex'">高级</span>
              </i>
              <div class="btn backHoverBlue"
                v-show="craftInfo.draft_method.GLFlag === 'complex'"
                @click="addGL">添加纹版</div>
            </div>
            <div class="GLCtn"
              v-for="(item1,index1) in craftInfo.draft_method.GL"
              :key="index1">
              <div class="mark">{{alphabet[index1]}}：
              </div>
              <div v-for="(item2,index2) in item1"
                :key="index2"
                class="deltaCtn">
                <div class="leftCtn">
                  <span :content="index2+1"
                    @click="changeState(craftInfo.draft_method.GL[index1][index2],index1,index2)">{{index2+1}}</span>
                  <div class="copyBtn hoverBlue"
                    @click="copyGL(index1,index2)">复制</div>
                  <div class="copyBtn hoverRed"
                    style="top:92px;"
                    @click="deleteGLChildren(index1,index2)">删除</div>
                </div>
                <div class="rightCtn">
                  <div class="hehe">
                    <el-input placeholder="数字间用逗号分隔"
                      v-model="item2[0].value"></el-input>
                    <div class="normal"
                      :class="item2[0].mark"
                      @click="changeStateChild(item2[0])">{{!item2[0].mark?'停撬':''}}</div>
                  </div>
                  <div class="hehe">
                    <el-input placeholder="数字间用逗号分隔"
                      v-model="item2[1].value"></el-input>
                    <div class="normal"
                      :class="item2[1].mark"
                      @click="changeStateChild(item2[1])">{{!item2[1].mark?'停撬':''}}</div>
                  </div>
                  <div class="hehe">
                    <el-input placeholder="非必填项"
                      v-model="item2[2].value"></el-input>
                    <div class="normal"
                      :class="item2[2].mark"
                      @click="changeStateChild(item2[2])">{{!item2[2].mark?'停撬':''}}</div>
                  </div>
                </div>
              </div>
              <div class="borderBtn position"
                @click="addGLChildren(index1)">
                <i class="el-icon-plus"></i>
              </div>
              <div class="borderBtn position"
                @click="deleteGLChildren(index1)"
                v-show="item1.length>1">
                <i class="el-icon-minus"></i>
              </div>
              <div v-show="craftInfo.draft_method.GLFlag==='complex'"
                class="borderBtn position hoverRed"
                @click="deleteGL(index1)"
                style="border:0">
                <i class="el-icon-delete"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">纹版图循环</span>
              <span class="explanation">(序号填写请以纹版图的序号为准)</span>
            </div>
            <div style="position:relative"
              v-for="(item,index) in craftInfo.draft_method.GLRepeat"
              :key="index">
              <div style="position:absolute;line-height:32px;color:rgba(0,0,0,0.65)">{{alphabet[index]}}：</div>
              <div style="display:block;padding-left:32px;margin:12px 0"
                v-for="(itemChild,indexChild) in item"
                :key="indexChild">
                <div class="elCtn">
                  <el-input style="width:100px;text-align:center"
                    placeholder="序号"
                    type="number"
                    v-model="itemChild.start">
                  </el-input>
                </div>
                <span style="margin:0 20px;color:#666">到</span>
                <div class="elCtn">
                  <el-input style="width:100px;text-align:center"
                    placeholder="序号"
                    type="number"
                    v-model="itemChild.end">
                  </el-input>
                </div>
                <span style="margin:0 20px;color:#666">✖</span>
                <div class="elCtn">
                  <el-input style="width:140px;text-align:center"
                    placeholder="遍数"
                    type="number"
                    v-model="itemChild.repeat">
                    <template slot="append">遍</template>
                  </el-input>
                </div>
                <div class="position borderBtn"
                  style="padding: 0 8px;margin-left: 12px;"
                  @click="$addItem(item,{
                    start: '',
                    end: '',
                    repeat: ''
                  })">
                  <i class="el-icon-plus"></i>
                </div>
                <div class="position borderBtn"
                  style="padding: 0 8px;margin-left: 12px;"
                  @click="item.length>1?$deleteItem(item,indexChild):$message.error('至少有一项，可以不填')">
                  <i class="el-icon-minus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">穿综循环</span>
              <i class="sliderCtn">
                <span class="text"
                  :class="{'active':craftInfo.draft_method.PMFlag==='normal'}"
                  @click="craftInfo.draft_method.PMFlag = 'normal'">普通</span>
                <span class="text"
                  :class="{'active':craftInfo.draft_method.PMFlag==='complex'}"
                  @click="craftInfo.draft_method.PMFlag = 'complex'">高级</span>
              </i>
              <div class="btn backHoverBlue"
                @click="$addItem(craftInfo.draft_method.PM,{
                  value: '',
                  repeat: '',
                  number: '',
                  total: 0,
                  children: [{
                    number: '',
                    children: [{
                      value: '',
                      repeat: ''
                    }]
                  }]
                })">添加循环</div>
            </div>
            <div class="treeCtn">
              <div class="node"
                v-for="(item1,index1) in craftInfo.draft_method.PM"
                :key="index1">
                <div class="numbers">{{romanNum[index1]}}</div>
                <div class="lineCol"
                  v-show="craftInfo.draft_method.PMFlag === 'complex'"></div>
                <div class="deleteBtn"
                  @click="craftInfo.draft_method.PM.length>1?$deleteItem(craftInfo.draft_method.PM,index1):$message.error('至少有一种穿综循环')">删除</div>
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
                <div class="nodeBtn"
                  v-show="craftInfo.draft_method.PMFlag === 'complex'"
                  @click="$addItem(item1.children,{
                    number: '',
                    children: [
                      {
                        value: '',
                        repeat: ''
                      }
                    ]
                  })"
                  style="border:0;background:#1A95FF;color:#fff;height:26px;margin-top:4px;;line-height:26px;width:26px">
                  <i class="el-icon-plus"></i>
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
                        <div class="oprText"
                          :class="{'add':index3===0,'delete':index3>0}"
                          @click="index3>0?(item2.children.length>1?$deleteItem(item2.children,index3):$message.error('至少有一行')):$addItem(item2.children,{
                            value: '',
                            repeat: ''
                          })">{{index3>0?'删除行':'新增行'}}</div>
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
            <div class="label">
              <span class="text">纹版图备注</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入纹版图备注"
                v-model="craftInfo.draft_method.GLDesc"></el-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">穿综循环备注</span>
            </div>
            <div class="info elCtn">
              <el-input placeholder="请输入穿综循环备注"
                v-model="craftInfo.draft_method.PMDesc"></el-input>
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
              <el-autocomplete class="inline-input"
                v-model="craftInfo.weft_data.organization"
                :fetch-suggestions="searchOrganization"
                placeholder="请选择组织法"></el-autocomplete>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">机上坯幅</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="craftInfo.weft_data.peifu"
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
              <el-input v-model="craftInfo.weft_data.peifu_explain"
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
              <el-input v-model="craftInfo.weft_data.shangchiya"
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
              <el-input v-model="craftInfo.weft_data.xiachiya"
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
              <el-input v-model="weimi"
                disabled
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
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="craftInfo.weft_data.neichang"
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
              <el-input :class="{'error':mustFlag&&!craftInfo.weft_data.rangwei}"
                v-model="craftInfo.weft_data.rangwei"
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
              <el-input v-model="craftInfo.weft_data.total"
                disabled
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
      <div class="titleCtn flexBetween">
        <div class="title">原料纬向</div>
        <div class="btn backHoverBlue"
          @click="syncWarpInfo">同步经向信息</div>
      </div>
      <div class="editCtn">
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">配色信息</span>
              <span class="explanation">(必选)</span>
            </div>
            <div class="elCtn colourCtn"
              v-for="(itemColour,indexColour) in craftInfo.weft_data.color_data"
              :key="indexColour">
              <el-select class="colour"
                placeholder="请选择产品配色组"
                v-model="itemColour.color_id"
                @change="keepColourSame('weft')"
                :class="{'error':colourList.length>0&&mustFlag&&!itemColour.color_id}">
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
                @click="addColour">添加色组</span>
              <span class="btn hoverRed"
                @click="deleteColour(indexColour)">删除色组</span>
              <zh-color-picker v-for="(itemColor,indexColor) in itemColour.color_scheme"
                :key="indexColor + itemColour.color_scheme[indexColor]"
                class="color"
                v-model="itemColour.color_scheme[indexColor]"
                :content="filterIndex(indexColor)"
                :colorArr="yarnColorList"></zh-color-picker>
              <div class="borderBtn"
                @click="addColor('weft')">
                <i class="el-icon-plus"></i>
              </div>
              <div class="borderBtn"
                @click="deleteColor('weft')">
                <i class="el-icon-minus"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label"
              style="width:220px">
              <span class="text">主要原料</span>
              <span class="explanation">(必选)</span>
              <el-tooltip class="item"
                effect="dark"
                content="设置成功后请点击此按钮刷新数据"
                placement="top">
                <i class="el-icon-refresh hoverGreen fr"
                  style="line-height:38px;font-size:18px;margin-left:8px;cursor:pointer"
                  @click="$checkCommonInfo([{
                    checkWhich: 'api/material',
                    getInfoMethed: 'dispatch',
                    getInfoApi: 'getMaterialAsync',
                    forceUpdate:true
                  }])"></i>
              </el-tooltip>
              <el-tooltip class="item"
                effect="dark"
                content="添加新原料"
                placement="top">
                <i class="el-icon-upload hoverOrange fr"
                  style="line-height:38px;font-size:18px;cursor:pointer;"
                  @click="$openUrl('/setting/?pName=物料设置&cName=纱线原料')"></i>
              </el-tooltip>
            </div>
            <div class="elCtn">
              <el-select placeholder="请选择主要原料"
                v-model="craftInfo.weft_data.material_data[0].material_id"
                @change="cmpYarnCoefficient"
                :class="{'error':mustFlag&&!craftInfo.weft_data.material_data[0].material_id}"
                filterable>
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
              v-for="(itemMat,indexMat) in craftInfo.weft_data.material_data"
              :key="indexMat + 'ciyao'"
              v-show="indexMat>0">
              <el-select class="colour noBottom"
                placeholder="请选择次要原料"
                v-model="itemMat.material_id"
                @change="cmpYarnCoefficient"
                clearable
                filterable>
                <el-option v-for="item in materialList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
              <span class="btn hoverBlue"
                @click="$addItem(craftInfo.weft_data.material_data,{material_id: '',apply: [''],type_materail: 1})">添加原料</span>
              <span class="btn hoverRed"
                @click="craftInfo.weft_data.material_data.length>2?$deleteItem(craftInfo.weft_data.material_data,indexMat):$message.error('至少有一项，可以不选')">删除原料</span>
              <el-select v-for="(item,index) in itemMat.apply"
                :key="index"
                v-model="itemMat.apply[index]"
                placeholder="夹"
                class="jia"
                clearable>
                <el-option v-for="item in weftJiaList"
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
          v-for="(itemMat,indexMat) in craftInfo.weft_data.assist_material"
          :key="indexMat + 'fuzhu'">
          <div class="col">
            <div class="label">
              <span class="text">辅助原料</span>
            </div>
            <div class="elCtn colourCtn">
              <el-select class="colour"
                placeholder="请选择辅助原料"
                v-model="itemMat.material_id"
                @change="cmpYarnCoefficient"
                clearable>
                <el-option v-for="item in assistMaterialList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"></el-option>
              </el-select>
              <span class="btn hoverBlue"
                @click="$addItem(craftInfo.weft_data.assist_material,{material_id: '',apply: [],number: ''})">添加原料</span>
              <span class="btn hoverRed">删除原料</span>
              <el-select v-for="(item,index) in itemMat.apply"
                :key="index"
                v-model="itemMat.apply[index]"
                placeholder="夹"
                class="jia"
                clearable>
                <el-option v-for="item in weftJiaList"
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
              <span class="text">纬向排列</span>
              <i class="sliderCtn">
                <span class="text"
                  @click="craftInfo.weft_data.back_status=2"
                  :class="{'active':craftInfo.weft_data.back_status===2}">单</span>
                <span class="text"
                  @click="craftInfo.weft_data.back_status=1"
                  :class="{'active':craftInfo.weft_data.back_status===1}">双</span>
              </i>
              <el-input v-model="insertNumber.weft"
                class="element"
                placeholder="请输入插入列数">
                <template slot="append">列</template>
              </el-input>
              <div class="btn backHoverBlue"
                @click="insertCol('weft')">插入</div>
              <el-input v-model="invertedOrder.weft[0]"
                class="element"
                placeholder="倒序从第几列开始">
                <template slot="append">列</template>
              </el-input>
              <span style="color:#E9E9E9;margin:0 0 0 12px">~</span>
              <el-input v-model="invertedOrder.weft[1]"
                class="element"
                placeholder="倒序到第几列结束">
                <template slot="append">列</template>
              </el-input>
              <div class="btn backHoverBlue"
                @click="invertedCol('weft')">倒序一遍</div>
              <div class="btn borderBtn"
                @click="resetTable('weft')">重置</div>
            </div>
            <div class="hotTable">
              <div ref="weft"></div>
            </div>
            <div style="color:rgba(0,0,0,0.45)">
              <br />
              提示1：可使用乘以[ ]遍，最后一遍去掉[ ]列到[ ]列。例如：乘以[4]遍，最后一遍去掉[17]列到[19]列；注意只需要在括号中输入需要乘的遍数，和需要去掉的列数即可。删除括号符号会导致功能失效。
              <br />
              提示2：可以在第三个合并项里使用"顺一遍倒一遍"功能，注意不要在第一个/第二个合并项里使用！不要修改"顺一遍倒一遍"文字信息
              <br />
              提示3：停撬功能，可以点击表格序号，选择需要标记的符号。
            </div>
          </div>
        </div>
        <div class="row"
          v-show="craftInfo.weft_data.back_status===1">
          <div class="col">
            <div class="label">
              <span class="text">经向反面</span>
              <el-input v-model="insertNumber.weftBack"
                class="element"
                placeholder="请输入插入列数">
                <template slot="append">列</template>
              </el-input>
              <div class="btn backHoverBlue"
                @click="insertCol('weftBack')">插入</div>
              <el-input v-model="invertedOrder.weftBack[0]"
                class="element"
                placeholder="倒序从第几列开始">
                <template slot="append">列</template>
              </el-input>
              <span style="color:#E9E9E9;margin:0 0 0 12px">~</span>
              <el-input v-model="invertedOrder.weftBack[1]"
                class="element"
                placeholder="倒序到第几列结束">
                <template slot="append">列</template>
              </el-input>
              <div class="btn backHoverBlue"
                @click="invertedCol('weftBack')">倒序一遍</div>
              <div class="btn borderBtn"
                @click="resetTable('weftBack')">重置</div>
            </div>
            <div class="hotTable">
              <div ref="weftBack"></div>
            </div>
          </div>
        </div>
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
              <span class="text">选择纬向克重机算公式</span>
            </div>
            <div class="info elCtn">
              <el-radio-group v-model="craftInfo.calc_weight_way">
                <el-radio :label="1">根数*筘幅</el-radio>
                <el-radio :label="2">根数*机上坯幅</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">
              <span class="text">工艺单名称</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input :class="{'error':mustFlag&&!craftInfo.title}"
                v-model="craftInfo.title"
                placeholder="请输入工艺单名称"></el-input>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">大身规格</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="craftInfo.size"
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
              <el-input v-model="craftInfo.weight"
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
              <el-select v-model="craftInfo.process_data"
                placeholder="请选择后道工序"
                multiple>
                <el-option v-for="item in processList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row"
          v-for="(item,index) in craftInfo.yarn_coefficient"
          :key="index">
          <div class="col">
            <div class="label"
              v-if="index===0">
              <span class="text">物料系数</span>
              <span class="explanation">(必填)</span>
            </div>
            <div class="info elCtn">
              <el-input :class="{'error':mustFlag&&!item.value}"
                v-model="item.value"
                placeholder="请输入物料系数">
                <template slot="prepend">{{item.name}}</template>
                <template slot="append">g/m</template>
              </el-input>
            </div>
          </div>
          <div class="col">
            <div class="label"
              v-if="index===0">
              <span class="text">穿筘法</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="item.chuankou"
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
                v-model="craftInfo.product_time"
                value-format="yyyy-MM-dd"
                placeholder="请选择下机时间"></el-date-picker>
            </div>
          </div>
          <div class="col">
            <div class="label">
              <span class="text">其他信息</span>
            </div>
            <div class="info elCtn">
              <el-input v-model="craftInfo.other_info"
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
              <el-input v-model="craftInfo.desc"
                placeholder="请输入备注信息">
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup">
      <div class="loading"></div>
    </div>
    <div class="bottomFixBar">
      <div class="main"
        style="display: flex;justify-content: space-between;align-items:center">
        <div>
          <div class="elCtn">
            <el-select v-model="searchCraftKey"
              filterable
              remote
              reserve-keyword
              placeholder="输入编号导入工艺单"
              :remote-method="(ev)=>{return $debounce(ev,timer,searchCraft)}"
              :loading="searchLoading"
              @change="getCraftDetail">
              <el-option v-for="item in searchList"
                :key="item.id"
                :value="item.id">
                <span style="float:left"
                  class="blue">{{item.craft_code}}</span>
                <span style="float:right;color:#8492a6;font-size:12px">{{item.title}}</span>
              </el-option>
            </el-select>
          </div>
          <span class="green"
            style="margin-left:24px"
            v-show="searchList.length>0">检测到有关联产品的工艺信息，点击输入框快速导入</span>
        </div>
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
          <div class="btnCtn"
            style="float:left">
            <using-tutorials :show="showUsing"
              @close="showUsing=false"
              :list="usingList"
              :title="'工艺单使用教程'">
              <div class="btn backHoverGreen"
                @click="showUsing=true">使用教程</div>
            </using-tutorials>
          </div>
          <div class="btn backHoverOrange"
            @click="saveCraft(true)">保存为草稿</div>
          <div class="btn backHoverBlue"
            @click="saveCraft(false)">提交</div>
        </div>
      </div>
    </div>
    <!-- 不需要操作的产品详情 -->
    <product-detail :id="proId"
      :show="productShow"
      :noOpr="true"
      @close="productShow = false"></product-detail>
    <sample-detail :id="proId"
      :show="sampleShow"
      :noOpr="true"
      @close="sampleShow = false"></sample-detail>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/handsontable@7.3.0/dist/handsontable.full.min.js"></script>
<script lang="ts">
import Vue from 'vue'
import { languages } from '@/assets/js/dictionary'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
Handsontable.languages.registerLanguageDictionary(languages as any) // 注册中文字典
import { CraftInfo, GLReapeat } from '@/types/craft'
import { product, craftSetting, craft } from '@/assets/js/api'
import { ProductInfo } from '@/types/product'
import { UsingTutorials } from '@/types/usingTutorials'
export default Vue.extend({
  data(): {
    craftInfo: CraftInfo
    productInfo: ProductInfo
    usingList: UsingTutorials[]
    [propName: string]: any
  } {
    return {
      loading: false,
      saveLock: false,
      mustFlag: false,
      showUsing: false,
      saveSuccess: false,
      proId: '',
      productShow: false,
      sampleShow: false,
      usingList: [
        {
          title: '如何添加主夹颜色？',
          content: [
            {
              title: '如何添加原料颜色名称？',
              content: [require('@/assets/image/craftCourse/1/1.png')]
            },
            {
              title: '如何查找潘通色号？',
              content: [require('@/assets/image/craftCourse/1/2.png')]
            },
            {
              title: '如何添加新的潘通色号？',
              content: [require('@/assets/image/craftCourse/1/3.png')]
            }
          ]
        },
        {
          title: '如何添加主夹纱线？',
          content: [
            {
              title: '如何添加金丝:银丝？',
              content: [require('@/assets/image/craftCourse/2/1.png')]
            },
            {
              title: '如何设置次要原料？',
              content: [require('@/assets/image/craftCourse/2/2.png')]
            }
          ]
        },
        {
          title: '如何使用排列表格？',
          content: [
            {
              title: '如何使用复制粘贴功能？',
              content: [require('@/assets/image/craftCourse/3/1.png')]
            },
            {
              title: '如何使用删除列功能？',
              content: [require('@/assets/image/craftCourse/3/2.png')]
            },
            {
              title: '如何添加合并型？',
              content: [require('@/assets/image/craftCourse/3/3.png')]
            },
            {
              title: '如何设置穿综法？',
              content: [require('@/assets/image/craftCourse/3/4.png')]
            },
            {
              title: '如何设置X几遍最后去掉波浪线？',
              content: [require('@/assets/image/craftCourse/3/5.png')]
            },
            {
              title: '如何设置顺一遍倒一遍？',
              content: [require('@/assets/image/craftCourse/3/6.png')]
            },
            {
              title: '如何设置停撬？',
              content: [require('@/assets/image/craftCourse/3/7.png')]
            }
          ]
        },
        {
          title: '如何使用纹版图？',
          content: [
            {
              title: '普通和高级纹版图的区别？',
              content: [require('@/assets/image/craftCourse/4/1.png')]
            },
            {
              title: '如何设置A,B纹版图？',
              content: [require('@/assets/image/craftCourse/4/2.png')]
            },
            {
              title: '如何设置纹板图x多遍？',
              content: [require('@/assets/image/craftCourse/4/3.png')]
            }
          ]
        },
        {
          title: '如何使用穿综循环？',
          content: [
            {
              title: '普通和高级穿综法的区别？',
              content: [require('@/assets/image/craftCourse/5/1.png')]
            },
            {
              title: '如何设置多循环的穿综法？',
              content: [require('@/assets/image/craftCourse/5/2.png')]
            }
          ]
        }
      ],
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
      list: [],
      page: 1,
      total: 1,
      keyword: '',
      product_name: '',
      user_id: '',
      product_type: 0,
      draftMethod: '',
      draftMethodList: [],
      searchCraftKey: '',
      assistMaterialList: [
        {
          label: '金丝',
          value: -1
        },
        {
          label: '银丝',
          value: -2
        }
      ],
      searchList: [],
      sideList: [],
      searchLoading: false,
      methodsList: [],
      machineList: [],
      testColor: {
        color: '',
        name: ''
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
      }
    }
  },
  watch: {
    // 计算筘幅
    'craftInfo.warp_data.reed_width_explain': {
      handler: function (newVal) {
        this.craftInfo.warp_data.reed_width = newVal.reduce((total: number, current: string) => {
          return total + Number(current)
        }, 0)
      },
      deep: true
    },
    // 计算穿综法总根数
    'craftInfo.draft_method.PM': {
      handler: function (newVal) {
        if (this.craftInfo.draft_method.PMFlag === 'complex') {
          newVal.forEach((item: any) => {
            item.total = item.children.reduce((sum: any, current: any) => {
              return sum + Number(current.number)
            }, 0)
          })
        }
      },
      deep: true
    }
  },
  computed: {
    processList() {
      return this.$store.state.api.halfProcess.arr
    },
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
    weftJiaList(): Array<{ label: string; value: number }> {
      return new Array(this.craftInfo.weft_data.color_data[0].color_scheme.length).fill('').map((item, index) => {
        return {
          value: index,
          label: this.filterIndex(index)
        }
      })
    },
    PMList(): string[] {
      return new Array(this.craftInfo.draft_method.PM.length).fill('').map((item, index) => this.romanNum[index])
    },
    GLList(): string[] {
      return new Array(this.craftInfo.draft_method.GL.length).fill('').map((item, index) => this.alphabet[index])
    },
    // 纬密
    weimi(): string {
      if (this.craftInfo.weft_data.neichang) {
        return (Number(this.craftInfo.weft_data.total) / Number(this.craftInfo.weft_data.neichang)).toFixed(2)
      } else {
        return '0'
      }
    },
    productType(): string {
      return this.productInfo.product_type === 1 ? '产品' : '样品'
    },
    userList() {
      return this.$store.state.api.user.arr
    }
  },
  methods: {
    // 导入旧版工艺单
    openImport() {
      this.$prompt('请粘贴旧版工艺单密钥导入', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }: any) => {
          craft
            .getOldCraft({
              export_key: value
            })
            .then((res) => {
              if (res.data.status) {
                const oldCraftInfo = res.data.data

                this.craftInfo.warp_data.back_status = oldCraftInfo.warp_data.back_status === 0 ? 2 : 1
                this.craftInfo.weft_data.back_status = oldCraftInfo.weft_data.back_status === 0 ? 2 : 1

                // 穿综法纹版图数据没变
                this.craftInfo.draft_method = JSON.parse(res.data.data.draft_method)

                // 处理颜色数据
                this.craftInfo.warp_data.color_data = oldCraftInfo.warp_data.color_data.map((item: any) => {
                  return {
                    color_id: '',
                    weave_number: '',
                    color_scheme: JSON.parse(item.color_scheme).map((item: any) => {
                      return {
                        color: item.value,
                        name: item.name
                      }
                    })
                  }
                })

                this.craftInfo.weft_data.color_data = oldCraftInfo.weft_data.color_data.map((item: any) => {
                  return {
                    color_id: '',
                    weave_number: '',
                    color_scheme: JSON.parse(item.color_scheme).map((item: any) => {
                      return {
                        color: item.value,
                        name: item.name
                      }
                    })
                  }
                })

                // 这里加个模板更新，让双面巾的html加载出来在操作
                this.$nextTick(() => {
                  this.tableData.warp.data = JSON.parse(oldCraftInfo.warp_data.warp_rank).map(
                    (item: any, index: number) => {
                      return index !== 1
                        ? item
                        : item.map((itemJia: any) => {
                            return this.filterIndex(itemJia)
                          })
                    }
                  )
                  // 插入一行合并项
                  this.tableData.warp.data.splice(
                    5,
                    0,
                    this.tableData.warp.data[0].map((item: any) => null)
                  )
                  this.tableData.warpBack.data = JSON.parse(oldCraftInfo.warp_data.warp_rank_back).map(
                    (item: any, index: number) => {
                      return index !== 1
                        ? item
                        : item.map((itemJia: any) => {
                            return this.filterIndex(itemJia)
                          })
                    }
                  )
                  // 插入一行合并项
                  this.tableData.warpBack.data.splice(
                    5,
                    0,
                    this.tableData.warpBack.data[0].map((item: any) => null)
                  )
                  this.tableData.weft.data = JSON.parse(oldCraftInfo.weft_data.weft_rank).map(
                    (item: any, index: number) => {
                      return index !== 1
                        ? item
                        : item.map((itemJia: any) => {
                            return this.filterIndex(itemJia)
                          })
                    }
                  )
                  // 插入一行合并项
                  this.tableData.weft.data.splice(
                    5,
                    0,
                    this.tableData.weft.data[0].map((item: any) => null)
                  )
                  this.tableData.weftBack.data = JSON.parse(oldCraftInfo.weft_data.weft_rank_back).map(
                    (item: any, index: number) => {
                      return index !== 1
                        ? item
                        : item.map((itemJia: any) => {
                            return this.filterIndex(itemJia)
                          })
                    }
                  )
                  // 插入一行合并项
                  this.tableData.weftBack.data.splice(
                    5,
                    0,
                    this.tableData.weftBack.data[0].map((item: any) => null)
                  )

                  this.tableData.warp.mergeCells = JSON.parse(oldCraftInfo.warp_data.merge_data)
                  this.tableData.weft.mergeCells = JSON.parse(oldCraftInfo.weft_data.merge_data)
                  this.tableData.warpBack.mergeCells = JSON.parse(oldCraftInfo.warp_data.merge_data_back)
                  this.tableData.weftBack.mergeCells = JSON.parse(oldCraftInfo.weft_data.merge_data_back)

                  this.tableData.warp.number = JSON.parse(oldCraftInfo.warp_data.warp_rank)[0].length
                  this.tableData.warpBack.number = JSON.parse(oldCraftInfo.warp_data.warp_rank_back)[0].length
                  this.tableData.weft.number = JSON.parse(oldCraftInfo.weft_data.weft_rank)[0].length
                  this.tableData.weftBack.number = JSON.parse(oldCraftInfo.weft_data.weft_rank_back)[0].length

                  this.tableHot.warp = new Handsontable((this.$refs as any).warp, this.tableData.warp)
                  this.tableHot.warpBack = new Handsontable((this.$refs as any).warpBack, this.tableData.warpBack)
                  this.tableHot.weft = new Handsontable((this.$refs as any).weft, this.tableData.weft)
                  this.tableHot.weftBack = new Handsontable((this.$refs as any).weftBack, this.tableData.weftBack)
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消导入'
          })
        })
    },
    getProList() {
      this.loading = true
      product
        .list({
          limit: 10,
          page: this.page,
          product_name: this.product_name,
          product_code: this.keyword,
          product_type: this.product_type,
          user_id: this.user_id,
          craft_status: 1 // 0是默认 1是没有
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
          }
          this.loading = false
        })
    },
    initProInfo(id: number, backFlag?: boolean) {
      this.loading = true
      product
        .detail({
          id: id
        })
        .then((res) => {
          this.productInfo = res.data.data
          this.colourList = res.data.data.color_data
          this.loading = false
          if (this.productInfo.category !== '梭织' && this.productInfo.secondary_category !== '梭织') {
            this.$confirm('检测到该产品非梭织产品，请选择其他产品或返回上一级?', '提示', {
              confirmButtonText: '继续添加',
              cancelButtonText: '返回上一级',
              type: 'warning'
            })
              .then(() => {
                this.getSearchList(id)
              })
              .catch(() => {
                if (backFlag) {
                  this.saveSuccess = true
                  this.$router.go(-1)
                } else {
                  this.getSearchList(id)
                }
              })
          } else {
            this.getSearchList(id)
          }
        })
    },
    getSearchList(id: number) {
      // 关联工艺单查询
      craft
        .list({
          page: 1,
          limit: 10,
          product_id: id
        })
        .then((res) => {
          if (res.data.status) {
            this.searchList = res.data.data.items
          }
        })
    },
    searchOrganization(str: string, cb: any) {
      let results = str ? this.methodsList.filter(this.createFilter(str)) : this.methodsList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    searchSide(str: string, cb: any) {
      let results = str ? this.sideList.filter(this.createFilter(str)) : this.sideList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    searchMachine(str: string, cb: any) {
      let results = str ? this.machineList.filter(this.createFilter(str)) : this.machineList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    // 保存穿综法
    saveDraftMethods() {
      this.$prompt('请输入穿综法名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then((obj: any) => {
          craft
            .czfCreate({
              name: obj.value as string,
              pattern_loop: JSON.stringify(this.craftInfo.draft_method)
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '穿综法' + obj.value + '已保存成功'
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消保存'
          })
        })
    },
    getDraftMethod() {
      this.craftInfo.draft_method = JSON.parse(this.draftMethod)
    },
    deleteDraftMethods(id: number) {
      this.$confirm('是否删除该穿综循环?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          craft
            .czfDelete({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.draftMethodList = this.draftMethodList.filter((item: any) => item.id !== id)
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
    // 搜索要导入的工艺单列表
    searchCraft(key: string) {
      this.searchLoading = true
      craft
        .list({
          page: 1,
          limit: 10,
          keyword: key
        })
        .then((res) => {
          if (res.data.status) {
            this.searchList = res.data.data.items
          }
          this.searchLoading = false
        })
    },
    getCraftDetail(ev: number) {
      this.loading = true
      if (ev) {
        craft
          .detail({
            id: ev
          })
          .then((res) => {
            if (res.data.status) {
              this.searchCraftKey = res.data.data.craft_code
              this.craftInfo = res.data.data

              // 清空id防止变成修改
              this.craftInfo.id = ''

              this.tableData.warp.mergeCells = this.craftInfo.warp_data.merge_data
              this.tableData.weft.mergeCells = this.craftInfo.weft_data.merge_data
              this.tableData.warpBack.mergeCells = this.craftInfo.warp_data.merge_data_back
              this.tableData.weftBack.mergeCells = this.craftInfo.weft_data.merge_data_back

              this.tableData.warp.number = this.craftInfo.warp_data.warp_rank[0].length
              this.tableData.warpBack.number = this.craftInfo.warp_data.warp_rank_back[0].length
              this.tableData.weft.number = this.craftInfo.weft_data.weft_rank[0].length
              this.tableData.weftBack.number = this.craftInfo.weft_data.weft_rank_back[0].length

              // 这里加个模板更新，让双面巾的html加载出来在操作
              this.$nextTick(() => {
                this.tableData.warp.data = this.craftInfo.warp_data.warp_rank.map((item: any, index) => {
                  return index !== 1
                    ? item
                    : item.map((itemJia: any) => {
                        return this.filterIndex(itemJia)
                      })
                })
                this.tableData.warpBack.data = this.craftInfo.warp_data.warp_rank_back.map((item: any, index) => {
                  return index !== 1
                    ? item
                    : item.map((itemJia: any) => {
                        return this.filterIndex(itemJia)
                      })
                })
                this.tableData.weft.data = this.craftInfo.weft_data.weft_rank.map((item: any, index) => {
                  return index !== 1
                    ? item
                    : item.map((itemJia: any) => {
                        return this.filterIndex(itemJia)
                      })
                })
                this.tableData.weftBack.data = this.craftInfo.weft_data.weft_rank_back.map((item: any, index) => {
                  return index !== 1
                    ? item
                    : item.map((itemJia: any) => {
                        return this.filterIndex(itemJia)
                      })
                })

                this.tableHot.warp = new Handsontable((this.$refs as any).warp, this.tableData.warp)
                this.tableHot.warpBack = new Handsontable((this.$refs as any).warpBack, this.tableData.warpBack)
                this.tableHot.weft = new Handsontable((this.$refs as any).weft, this.tableData.weft)
                this.tableHot.weftBack = new Handsontable((this.$refs as any).weftBack, this.tableData.weftBack)
              })

              // 清空克重数据，因为提交的时候需要重新计算
              this.craftInfo.warp_data.color_data.forEach((item) => {
                item.color_id = ''
                item.color_scheme.forEach((itemColor) => {
                  itemColor.number = 0
                  itemColor.material_weight!.forEach((itemWeight) => {
                    itemWeight.weight = 0
                  })
                })
              })
              this.craftInfo.weft_data.color_data.forEach((item) => {
                item.color_id = ''
                item.color_scheme.forEach((itemColor) => {
                  itemColor.number = 0
                  itemColor.material_weight!.forEach((itemWeight) => {
                    itemWeight.weight = 0
                  })
                })
              })
              // @ts-ignore
              this.craftInfo.process_data = this.craftInfo.process_data.map((item) => item.process_id)
            }
            this.loading = false
          })
      }
    },
    // 同步经纬颜色和物料
    syncWarpInfo() {
      this.craftInfo.weft_data.color_data = this.$clone(this.craftInfo.warp_data.color_data)
      this.craftInfo.weft_data.material_data = this.$clone(this.craftInfo.warp_data.material_data)
      this.craftInfo.warp_data.assist_material = this.$clone(this.craftInfo.warp_data.assist_material)
      this.$forceUpdate()
    },
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
            jia: Number(table[1][i]), // 主夹信息,计算克重的时候用
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
    // 添加色组——需要考虑所有色组的颜色个数相同,不需要参数是因为经纬项色组需要保持一致，所以不管是经向还是纬向添加色组都要保持同步
    addColour() {
      const colorWarpLength = this.craftInfo.warp_data.color_data[0].color_scheme.length
      const colorWeftLength = this.craftInfo.weft_data.color_data[0].color_scheme.length
      this.craftInfo.warp_data.color_data.push({
        color_id: '',
        weave_number: '',
        color_scheme: new Array(colorWarpLength).fill({
          color: '',
          name: ''
        })
      })
      this.craftInfo.weft_data.color_data.push({
        color_id: '',
        weave_number: '',
        color_scheme: new Array(colorWeftLength).fill({
          color: '',
          name: ''
        })
      })
    },
    deleteColour(indexColour: number) {
      if (this.craftInfo.warp_data.color_data.length > 1) {
        this.$deleteItem(this.craftInfo.weft_data.color_data, indexColour)
        this.$deleteItem(this.craftInfo.warp_data.color_data, indexColour)
      } else {
        this.$message.error('至少有一个配色组')
      }
    },
    // 添加颜色——需要考虑所有色组的颜色个数相同
    addColor(type: 'warp' | 'weft') {
      // @ts-ignore
      this.craftInfo[type + '_data'].color_data.forEach((item) => {
        item.color_scheme.push({
          color: '',
          name: ''
        })
      })
    },
    // 删除颜色——需要考虑所有色组的颜色个数相同
    deleteColor(type: 'warp' | 'weft') {
      // @ts-ignore
      if (this.craftInfo[type + '_data'].color_data[0].color_scheme.length > 1) {
        // @ts-ignore
        this.craftInfo[type + '_data'].color_data.forEach((item) => {
          item.color_scheme.splice(item.color_scheme.length - 1, 1)
        })
      } else {
        this.$message.error('至少有一种配色')
      }
    },
    // 保持配色组一致
    keepColourSame(type: 'warp' | 'weft') {
      if (type === 'warp') {
        this.craftInfo.weft_data.color_data.forEach((item, index) => {
          item.color_id = this.craftInfo.warp_data.color_data[index].color_id
          item.weave_number = this.craftInfo.warp_data.color_data[index].weave_number
        })
      } else {
        this.craftInfo.warp_data.color_data.forEach((item, index) => {
          item.color_id = this.craftInfo.weft_data.color_data[index].color_id
          item.weave_number = this.craftInfo.weft_data.color_data[index].weave_number
        })
      }
    },
    // 计算整经头文
    cmpWarpTotal() {
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
      const warpTableBack = this.getFlatTable(
        this.tableData.warpBack.data.map((item: any, index: number) => {
          if (index === 1) {
            return item.map((itemJia: any) => {
              return this.warpJiaList.find((itemFind: any) => itemFind.label === itemJia)
                ? (this.warpJiaList.find((itemFind: any) => itemFind.label === itemJia) as any).value
                : ''
            })
          } else {
            if (item.length === this.tableData.warpBack.number) {
              return item
            } else {
              for (let i = 0; i < this.tableData.warpBack.number; i++) {
                item[i] = item[i] || null
              }
              return item
            }
          }
        }),
        'warpBack'
      )
      let sum = 0
      warpTable.forEach((item: any, index: number) => {
        sum += Number(item.number)
      })
      warpTableBack.forEach((item: any, index: number) => {
        sum += Number(item.number)
      })
      this.craftInfo.warp_data.weft = sum
    },
    // 计算纬向根数
    cmpWeftTotal() {
      const weftTable = this.getFlatTable(
        this.tableData.weft.data.map((item: any, index: number) => {
          if (index === 1) {
            return item.map((itemJia: any) => {
              return this.weftJiaList.find((itemFind: any) => itemFind.label === itemJia)
                ? (this.weftJiaList.find((itemFind: any) => itemFind.label === itemJia) as any).value
                : ''
            })
          } else {
            if (item.length === this.tableData.weft.number) {
              return item
            } else {
              for (let i = 0; i < this.tableData.weft.number; i++) {
                item[i] = item[i] || null
              }
              return item
            }
          }
        }),
        'weft'
      )
      const weftTableBack = this.getFlatTable(
        this.tableData.weftBack.data.map((item: any, index: number) => {
          if (index === 1) {
            return item.map((itemJia: any) => {
              return this.weftJiaList.find((itemFind: any) => itemFind.label === itemJia)
                ? (this.weftJiaList.find((itemFind: any) => itemFind.label === itemJia) as any).value
                : ''
            })
          } else {
            if (item.length === this.tableData.weftBack.number) {
              return item
            } else {
              for (let i = 0; i < this.tableData.weftBack.number; i++) {
                item[i] = item[i] || null
              }
              return item
            }
          }
        }),
        'weftBack'
      )
      let sum = 0
      weftTable.forEach((item: any, index: number) => {
        sum += Number(item.number)
      })
      weftTableBack.forEach((item: any, index: number) => {
        sum += Number(item.number)
      })
      this.craftInfo.weft_data.total = sum
    },
    // 计算物料系数的物料
    cmpYarnCoefficient() {
      const idArr = Array.from(
        new Set(
          this.craftInfo.warp_data.material_data
            .map((item) => item.material_id)
            .concat(this.craftInfo.weft_data.material_data.map((item) => item.material_id))
            .concat(this.craftInfo.warp_data.assist_material.map((item) => item.material_id))
            .concat(this.craftInfo.weft_data.assist_material.map((item) => item.material_id))
            .filter((item) => !!item)
        )
      )
      // @ts-ignore
      this.craftInfo.yarn_coefficient =
        idArr.length > 0
          ? idArr.map((id) => {
              return {
                id: id,
                name:
                  id !== -1 && id !== -2
                    ? this.materialList.find((item: any) => item.id === id).name
                    : id === -1
                    ? '金丝'
                    : '银丝',
                value: '',
                chuankou: ''
              }
            })
          : {
              id: '',
              name: '',
              value: '',
              chuankou: ''
            }
    },
    copyGL(index1: number, index2: number) {
      this.craftInfo.draft_method.GL[index1].splice(
        index2,
        0,
        this.$clone(this.craftInfo.draft_method.GL[index1][index2])
      )
    },
    addGL() {
      this.$addItem(this.craftInfo.draft_method.GL, [
        [
          { value: '', mark: '' },
          { value: '', mark: '' },
          { value: '', mark: '' }
        ]
      ])
      this.$addItem(this.craftInfo.draft_method.GLRepeat, [
        {
          start: '',
          end: '',
          repeat: ''
        }
      ])
    },
    deleteGL(index: number) {
      if (this.craftInfo.draft_method.GL.length > 1) {
        this.$deleteItem(this.craftInfo.draft_method.GL, index)
        this.$deleteItem(this.craftInfo.draft_method.GLRepeat, index)
      } else {
        this.$message.error({
          message: '至少有一个纹版'
        })
      }
    },
    addGLChildren(index: number) {
      this.$addItem(this.craftInfo.draft_method.GL[index], [
        { value: '', mark: '' },
        { value: '', mark: '' },
        { value: '', mark: '' }
      ])
    },
    deleteGLChildren(index: number, index2: number) {
      if (this.craftInfo.draft_method.GL[index].length > 1) {
        if (index2 || index2 === 0) {
          this.craftInfo.draft_method.GL[index].splice(index2, 1)
        } else {
          this.craftInfo.draft_method.GL[index].pop()
        }
      } else {
        this.$message.error({
          message: '至少有一个纹版'
        })
      }
    },
    // 修改停撬状态
    changeStateChild(item: { mark: string; value: string }) {
      const index = this.markList.indexOf(item.mark)
      if (index < this.markList.length - 1) {
        item.mark = this.markList[index + 1]
      } else {
        item.mark = ''
      }
      this.$forceUpdate()
    },
    // 夹断表格空数据
    sliceTable(data: any[][]): any[][] {
      let sliceLength = data[1].length + 1
      data[1].some((item, index) => {
        if (item !== 0 && !item) {
          sliceLength = index
          return true
        }
        return false
      })
      return data.map((item) => {
        return item.slice(0, sliceLength)
      })
    },
    // 提交时获取特殊值 表格值，合并项等
    getCmpData() {
      this.craftInfo.part_id = Number(this.$route.query.part_id) || ''
      this.craftInfo.product_id = Number(this.$route.query.id) || Number(this.productInfo.id)
      this.craftInfo.warp_data.material_data[0].apply = this.warpJiaList
        .filter((item) => {
          return !this.craftInfo.warp_data.material_data.slice(1).some((itemChild) => {
            return itemChild.apply.some((itemFind: any) => itemFind && itemFind.toString() === item.value.toString())
          })
        })
        .map((item) => Number(item.value))
      this.craftInfo.weft_data.material_data[0].apply = this.weftJiaList
        .filter((item) => {
          return !this.craftInfo.weft_data.material_data.slice(1).some((itemChild) => {
            return itemChild.apply.some((itemFind: any) => itemFind && itemFind.toString() === item.value.toString())
          })
        })
        .map((item) => Number(item.value))
      this.craftInfo.weft_data.weimi = this.weimi

      // 调整穿综纹版逗号
      if (this.craftInfo.draft_method.PMFlag === 'normal') {
        this.craftInfo.draft_method.PM.forEach((item) => {
          item.value = item.value!.replace(/，|\./g, ',')
          item.repeat = Number(item.repeat) > 0 ? Number(item.repeat) : 1
        })
      } else {
        this.craftInfo.draft_method.PM.forEach((item) => {
          item.children?.forEach((itemChild) => {
            itemChild.children?.forEach((itemSon) => {
              itemSon.value = itemSon.value!.replace(/，|\./g, ',')
              itemSon.repeat = Number(itemSon.repeat) > 0 ? Number(itemSon.repeat) : 1
            })
          })
        })
      }
      this.craftInfo.draft_method.GL.forEach((item) => {
        item.forEach((itemChild) => {
          itemChild.forEach((itemSon) => {
            itemSon.value = itemSon.value ? itemSon.value.replace(/，|\./g, ',') : null
          })
        })
      })
      this.craftInfo.yarn_coefficient.forEach((item) => {
        if (!item.chuankou) {
          item.chuankou = this.craftInfo.warp_data.reed_method
        }
      })
      this.craftInfo.warp_data.merge_data = this.tableHot.warp.getPlugin('MergeCells').mergedCellsCollection.mergedCells
      this.craftInfo.warp_data.merge_data_back =
        this.tableHot.warpBack.getPlugin('MergeCells').mergedCellsCollection.mergedCells
      this.craftInfo.weft_data.merge_data = this.tableHot.weft.getPlugin('MergeCells').mergedCellsCollection.mergedCells
      this.craftInfo.weft_data.merge_data_back =
        this.tableHot.weftBack.getPlugin('MergeCells').mergedCellsCollection.mergedCells
      this.craftInfo.warp_data.warp_rank = this.sliceTable(
        this.tableData.warp.data.map((item: any[], index: number) => {
          if (index === 1) {
            return item.map((itemJia: any) => {
              return this.warpJiaList.find((itemFind: { label: any }) => itemFind.label === itemJia)
                ? this.warpJiaList.find((itemFind: { label: any }) => itemFind.label === itemJia)!.value
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
        })
      )
      this.craftInfo.warp_data.warp_rank_back = this.sliceTable(
        this.tableData.warpBack.data.map((item: any[], index: number) => {
          if (index === 1) {
            return item.map((itemJia: any) => {
              return this.warpJiaList.find((itemFind: { label: any }) => itemFind.label === itemJia)
                ? this.warpJiaList.find((itemFind: { label: any }) => itemFind.label === itemJia)!.value
                : ''
            })
          } else {
            if (item.length === this.tableData.warpBack.number) {
              return item
            } else {
              for (let i = 0; i < this.tableData.warpBack.number; i++) {
                item[i] = item[i] || null
              }
              return item
            }
          }
        })
      )
      this.craftInfo.weft_data.weft_rank = this.sliceTable(
        this.tableData.weft.data.map((item: any[], index: number) => {
          if (index === 1) {
            return item.map((itemJia: any) => {
              return this.weftJiaList.find((itemFind: { label: any }) => itemFind.label === itemJia)
                ? this.weftJiaList.find((itemFind: { label: any }) => itemFind.label === itemJia)!.value
                : ''
            })
          } else {
            if (item.length === this.tableData.weft.number) {
              return item
            } else {
              for (let i = 0; i < this.tableData.weft.number; i++) {
                item[i] = item[i] || null
              }
              return item
            }
          }
        })
      )
      this.craftInfo.weft_data.weft_rank_back = this.sliceTable(
        this.tableData.weftBack.data.map((item: any[], index: number) => {
          if (index === 1) {
            return item.map((itemJia: any) => {
              return this.weftJiaList.find((itemFind: { label: any }) => itemFind.label === itemJia)
                ? this.weftJiaList.find((itemFind: { label: any }) => itemFind.label === itemJia)!.value
                : ''
            })
          } else {
            if (item.length === this.tableData.weft.number) {
              return item
            } else {
              for (let i = 0; i < this.tableData.weft.number; i++) {
                item[i] = item[i] || null
              }
              return item
            }
          }
        })
      )
    },
    // 计算克重信息——具体到每种配色每个颜色，主要用于详情页展示
    getMaterialData() {
      // 获取展平的信息
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
      const warpTableBack = this.getFlatTable(
        this.tableData.warpBack.data.map((item: any, index: number) => {
          if (index === 1) {
            return item.map((itemJia: any) => {
              return this.warpJiaList.find((itemFind: any) => itemFind.label === itemJia)
                ? (this.warpJiaList.find((itemFind: any) => itemFind.label === itemJia) as any).value
                : ''
            })
          } else {
            if (item.length === this.tableData.warpBack.number) {
              return item
            } else {
              for (let i = 0; i < this.tableData.warpBack.number; i++) {
                item[i] = item[i] || null
              }
              return item
            }
          }
        }),
        'warpBack'
      )
      const weftTable = this.getFlatTable(
        this.tableData.weft.data.map((item: any, index: number) => {
          if (index === 1) {
            return item.map((itemJia: any) => {
              return this.weftJiaList.find((itemFind: any) => itemFind.label === itemJia)
                ? (this.weftJiaList.find((itemFind: any) => itemFind.label === itemJia) as any).value
                : ''
            })
          } else {
            if (item.length === this.tableData.weft.number) {
              return item
            } else {
              for (let i = 0; i < this.tableData.weft.number; i++) {
                item[i] = item[i] || null
              }
              return item
            }
          }
        }),
        'weft'
      )
      const weftTableBack = this.getFlatTable(
        this.tableData.weftBack.data.map((item: any, index: number) => {
          if (index === 1) {
            return item.map((itemJia: any) => {
              return this.weftJiaList.find((itemFind: any) => itemFind.label === itemJia)
                ? (this.weftJiaList.find((itemFind: any) => itemFind.label === itemJia) as any).value
                : ''
            })
          } else {
            if (item.length === this.tableData.weftBack.number) {
              return item
            } else {
              for (let i = 0; i < this.tableData.weftBack.number; i++) {
                item[i] = item[i] || null
              }
              return item
            }
          }
        }),
        'weftBack'
      )
      this.getColorWeight(warpTable, warpTableBack, 'warp_data')
      this.getColorWeight(weftTable, weftTableBack, 'weft_data')
    },
    // 计算克重信息——精确到每种配色每个颜色
    getColorWeight(
      front: Array<{ jia: number; order: number; number: number }>,
      behind: Array<{ jia: number; order: number; number: number }>,
      type: 'warp_data' | 'weft_data'
    ) {
      front.concat(behind).forEach((item) => {
        // 先算根数
        this.craftInfo[type].color_data.forEach((itemColour) => {
          itemColour.color_scheme[item.jia].number =
            (Number(itemColour.color_scheme[item.jia].number) || 0) + Number(item.number)
        })
      })
      // 算物料克重
      let xishu: number = 0 // 物料系数 * 根数 = weight
      if (type === 'warp_data') {
        xishu = Number(this.craftInfo.weft_data.neichang) + Number(this.craftInfo.weft_data.rangwei)
      } else {
        xishu =
          this.craftInfo.calc_weight_way === 1
            ? Number(this.craftInfo.warp_data.reed_width)
            : Number(this.craftInfo.weft_data.peifu)
      }
      xishu = xishu / 1000 / 100
      this.craftInfo[type].color_data.forEach((itemColour) => {
        itemColour.color_scheme.forEach((itemColor, indexColor) => {
          // 主要次要原料
          const findMat = this.craftInfo[type].material_data.find(
            (itemFind) => (itemFind.apply as number[]).indexOf(indexColor) !== -1
          )
          if (findMat) {
            const realMat = this.craftInfo.yarn_coefficient.find(
              (itemFind) => itemFind.id === (findMat && findMat.material_id)
            )
            itemColor.material_weight = [
              {
                material_type: 1,
                material_id: realMat!.id as unknown as number,
                material_name: realMat!.name,
                weight: Number(realMat?.value) * Number(itemColor.number) * xishu
              }
            ]
          }
          // 辅助原料
          const findMatAss = this.craftInfo[type].assist_material.find(
            (itemFind) => (itemFind.apply as number[]).indexOf(indexColor) !== -1
          )
          if (findMatAss) {
            const realMat = this.craftInfo.yarn_coefficient.find(
              (itemFind) => itemFind.id === (findMatAss && findMatAss.material_id)
            )
            if (itemColor.material_weight) {
              itemColor.material_weight.push({
                material_type: 2,
                material_id: realMat!.id as unknown as number,
                material_name: realMat!.name,
                weight: Number(realMat?.value) * Number(itemColor.number) * xishu
              })
            } else {
              itemColor.material_weight = [
                {
                  material_type: 2,
                  material_id: realMat!.id as unknown as number,
                  material_name: realMat!.name,
                  weight: Number(realMat?.value) * Number(itemColor.number) * xishu
                }
              ]
            }
          }
        })
      })
    },
    // 计算工艺单物料信息——精确到每种配色需要多少物料
    getMaterialDataTotal() {
      this.craftInfo.material_info = []
      this.craftInfo.warp_data.color_data.forEach((item, index) => {
        this.craftInfo.material_info.push({
          color_id: item.color_id,
          info_data: []
        })
        item.color_scheme.forEach((itemColor) => {
          itemColor.material_weight?.forEach((itemMat) => {
            this.craftInfo.material_info[index].info_data.push({
              material_type: itemMat.material_type,
              material_name: itemMat.material_name,
              material_color: itemColor.name,
              material_id: itemMat.material_id,
              number: itemMat.weight
            })
          })
        })
        this.craftInfo.weft_data.color_data[index].color_scheme.forEach((itemColor) => {
          itemColor.material_weight?.forEach((itemMat) => {
            this.craftInfo.material_info[index].info_data.push({
              material_type: itemMat.material_type,
              material_name: itemMat.material_name,
              material_color: itemColor.name,
              material_id: itemMat.material_id,
              number: itemMat.weight
            })
          })
        })
      })
      this.craftInfo.material_info.forEach((item) => {
        item.info_data = this.$mergeData(item.info_data, {
          mainRule: ['material_name', 'material_color', 'material_id', 'material_type'],
          otherRule: [{ name: 'number', type: 'add' }]
        }).map((item: any) => {
          return {
            material_type: item.material_type,
            material_name: item.material_name,
            material_color: item.material_color,
            material_id: item.material_id,
            number: item.number
          }
        })
      })
    },
    // 获取完整纹版图函数，详情页要用，这里先放放
    getCompleteGL() {
      // 补充纹版图循环
      let GLRepeatComplete: Array<Array<GLReapeat>> = []
      this.craftInfo.draft_method.GLRepeat.forEach((item, index) => {
        // 验证纹版图循环的完整性
        GLRepeatComplete.push([])
        let mark = 1
        item.forEach((itemChild) => {
          // 过滤掉无效的填法
          if (Number(itemChild.start) && Number(itemChild.end) && Number(itemChild.repeat)) {
            if (Number(itemChild.start) - mark > 0) {
              GLRepeatComplete[index].push({
                start: mark,
                end: Number(itemChild.start) - 1,
                repeat: 1
              })
            }
            GLRepeatComplete[index].push(itemChild)
            mark = Number(itemChild.end) + 1
          }
        })
        if (this.craftInfo.draft_method.GL[index].length >= mark) {
          GLRepeatComplete[index].push({
            start: mark,
            end: this.craftInfo.draft_method.GL[index].length,
            repeat: 1
          })
        }
      })
    },
    saveCraft(ifCaogao: boolean) {
      if (this.saveLock) {
        this.$message.error('请勿频繁点击')
        return
      }
      if (ifCaogao) {
        this.getCmpData()
        this.craftInfo.is_draft = 1
        this.saveLock = true
        craft.create(this.craftInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.saveSuccess = true
            this.$router.push('/craft/detail?id=' + res.data.data)
          }
          this.saveLock = false
        })
      } else {
        this.craftInfo.is_draft = 2
        let formCheck =
          this.$formCheck(this.craftInfo, [
            {
              key: 'title',
              errMsg: '请输入工艺单名称'
            }
          ]) ||
          this.craftInfo.warp_data.color_data.some((item) => {
            return (
              (this.colourList.length > 0
                ? this.$formCheck(item, [
                    {
                      key: 'color_id',
                      errMsg: '请选择经向产品配色'
                    }
                  ])
                : false) ||
              item.color_scheme.some((itemColor) => {
                return this.$formCheck(itemColor, [
                  {
                    key: 'color',
                    errMsg: '请选择经向色组颜色'
                  }
                ])
              })
            )
          }) ||
          this.craftInfo.weft_data.color_data.some((item) => {
            return (
              (this.colourList.length > 0
                ? this.$formCheck(item, [
                    {
                      key: 'color_id',
                      errMsg: '请选择纬向产品配色'
                    }
                  ])
                : false) ||
              item.color_scheme.some((itemColor) => {
                return this.$formCheck(itemColor, [
                  {
                    key: 'color',
                    errMsg: '请选择纬向色组颜色'
                  }
                ])
              })
            )
          }) ||
          this.$formCheck(this.craftInfo.warp_data.material_data[0], [
            {
              key: 'material_id',
              errMsg: '请选择经向主要原料'
            }
          ]) ||
          this.$formCheck(this.craftInfo.weft_data.material_data[0], [
            {
              key: 'material_id',
              errMsg: '请选择纬向主要原料'
            }
          ]) ||
          this.$formCheck(this.craftInfo.warp_data, [
            {
              key: 'reed_width',
              errMsg: '请填写筘幅说明',
              regNormal: 'isNum'
            }
          ]) ||
          this.$formCheck(this.craftInfo.weft_data, [
            {
              key: 'rangwei',
              errMsg: '请输入让位信息',
              regNormal: 'isNum'
            }
          ]) ||
          this.craftInfo.yarn_coefficient.some((item) => {
            return this.$formCheck(item, [
              {
                key: 'value',
                errMsg: '请输入物料系数(数字)',
                regNormal: 'isNum'
              }
            ])
          })
        if (formCheck) {
          this.mustFlag = true
          return
        }
        // this.tableData.warp.data[1].forEach((item: any) => {
        //   if (!item) {
        //     formCheck = true
        //   }
        // })
        // this.tableData.weft.data[1].forEach((item: any) => {
        //   if (!item) {
        //     formCheck = true
        //   }
        // })
        // if (formCheck) {
        //   this.mustFlag = true
        //   this.$message.error('经纬向表格内存在未选择的主夹信息，请检查修改后提交')
        //   return
        // }
        // this.tableData.warp.data[2].forEach((item: any) => {
        //   if (Number(item) !== 0 && !Number(item)) {
        //     formCheck = true
        //   }
        // })
        // this.tableData.weft.data[2].forEach((item: any) => {
        //   if (Number(item) !== 0 && !Number(item)) {
        //     formCheck = true
        //   }
        // })
        // if (formCheck) {
        //   this.mustFlag = true
        //   this.$message.error('经纬向表格内存在非数字填写，请检查修改后提交')
        //   return
        // }
        formCheck =
          this.checkSliceData(this.tableData.warp.data[1]) ||
          this.checkSliceData(this.tableData.warp.data[2]) ||
          this.checkSliceData(this.tableData.weft.data[1]) ||
          this.checkSliceData(this.tableData.weft.data[2])
        if (formCheck) {
          this.mustFlag = true
          this.$message.error('请完善经纬项信息')
        }
        if (!formCheck) {
          this.getCmpData()
          this.getMaterialData()
          this.getMaterialDataTotal()
          this.saveLock = true
          craft.create(this.craftInfo).then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.saveSuccess = true
              this.$router.push('/craft/detail?id=' + res.data.data)
            }
            this.saveLock = false
          })
        }
      }
    },
    // 判断数据是否断档
    checkSliceData(data: any[]) {
      let flag = false
      if (!data[0]) {
        return true
      }
      const indexData = data
        .map((item: any, index: number) => {
          return !item ? index : null
        })
        .filter((item: any) => !!item) as number[]
      for (let i = 0; i < indexData.length - 1; i++) {
        if (indexData[i + 1] - indexData[i] > 1) {
          flag = true
        }
      }
      return flag
    }
  },
  created() {
    // 默认表格
    const initData = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ]
    ]
    // handsometable设置项
    this.tableData.warp = {
      data: this.$clone(initData),
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
      number: 20,
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
        this.cmpWarpTotal()
      },
      licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
      mergeCells: true,
      width: '100%',
      height: 300
    }
    this.tableData.warpBack = {
      data: this.$clone(initData),
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
      number: 20,
      afterCreateCol: (index: any, amount: any) => {
        this.tableData.warpBack.number++
        for (let i = 0; i < this.tableData.warpBack.number; i++) {
          this.tableData.warpBack.data[0][i] = i + 1
        }
      },
      afterRemoveCol: (index: any, amount: any) => {
        this.tableData.warpBack.number--
        for (let i = 0; i < this.tableData.warpBack.number; i++) {
          this.tableData.warpBack.data[0][i] = i + 1
        }
      },
      afterChange: (changes: any, opt: any) => {
        this.cmpWarpTotal()
      },
      licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
      mergeCells: true,
      width: '100%',
      height: 300
    }
    this.tableData.weft = {
      data: this.$clone(initData),
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
          cellProperties.source = this.weftJiaList.map((item: { label: any }) => item.label)
        }
        if (row === 6) {
          cellProperties.type = 'dropdown'
          // @ts-ignore
          cellProperties.source = this.GLList
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
      number: 20,
      afterCreateCol: (index: any, amount: any) => {
        this.tableData.weft.number++
        for (let i = 0; i < this.tableData.weft.number; i++) {
          this.tableData.weft.data[0][i] = i + 1
        }
      },
      afterRemoveCol: (index: any, amount: any) => {
        this.tableData.weft.number--
        for (let i = 0; i < this.tableData.weft.number; i++) {
          this.tableData.weft.data[0][i] = i + 1
        }
      },
      afterChange: (changes: any, opt: any) => {
        this.cmpWeftTotal()
      },
      licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
      mergeCells: true,
      width: '100%',
      height: 300
    }
    this.tableData.weftBack = {
      data: this.$clone(initData),
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
          cellProperties.source = this.weftJiaList.map((item: { label: any }) => item.label)
        }
        if (row === 6) {
          cellProperties.type = 'dropdown'
          // @ts-ignore
          cellProperties.source = this.GLList
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
      number: 20,
      afterCreateCol: (index: any, amount: any) => {
        this.tableData.weftBack.number++
        for (let i = 0; i < this.tableData.weftBack.number; i++) {
          this.tableData.weftBack.data[0][i] = i + 1
        }
      },
      afterRemoveCol: (index: any, amount: any) => {
        this.tableData.weftBack.number--
        for (let i = 0; i < this.tableData.weftBack.number; i++) {
          this.tableData.weftBack.data[0][i] = i + 1
        }
      },
      afterChange: (changes: any, opt: any) => {
        this.cmpWeftTotal()
      },
      licenseKey: 'non-commercial-and-evaluation', // 申明非商业用途
      mergeCells: true,
      width: '100%',
      height: 300
    }
  },
  mounted() {
    this.tableHot.warp = new Handsontable((this.$refs as any).warp, this.tableData.warp)
    this.tableHot.warpBack = new Handsontable((this.$refs as any).warpBack, this.tableData.warpBack)
    this.tableHot.weft = new Handsontable((this.$refs as any).weft, this.tableData.weft)
    this.tableHot.weftBack = new Handsontable((this.$refs as any).weftBack, this.tableData.weftBack)
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
      },
      {
        checkWhich: 'api/halfProcess',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getHalfProcessAsync'
      },
      {
        checkWhich: 'api/user',
        getInfoMethed: 'dispatch',
        getInfoApi: 'getUserAsync'
      }
    ])
    Promise.all([
      craftSetting.listSide(),
      craftSetting.listMachine(),
      craftSetting.listMethods(),
      craft.czfList()
    ]).then((res) => {
      this.sideList = res[0].data.data.map((item: any) => {
        return {
          value: item.name
        }
      })
      this.machineList = res[1].data.data.map((item: any) => {
        return {
          value: item.name
        }
      })
      this.methodsList = res[2].data.data.map((item: any) => {
        return {
          value: item.name
        }
      })
      this.draftMethodList = res[3].data.data
    })
    if (this.$route.query.id) {
      this.initProInfo(Number(this.$route.query.id), true)
    } else {
      this.getProList()
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.saveSuccess) {
      next()
    } else {
      this.$confirm('是否离开添加页面，这会导致已填写的数据丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          next()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/craft/create.less';
</style>
<style lang="less">
#craftCreate {
  .error {
    .el-input__inner {
      border-color: red !important;
    }
  }
  .treeCtn {
    .el-input__inner {
      border: 0 !important;
    }
  }
  .GLCtn {
    .el-input__inner {
      height: 32px !important;
      margin-top: 3px;
    }
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 12px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: transparent;
  }
  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    height: 14px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
.el-message-box__input {
  height: 32px;
}
</style>
