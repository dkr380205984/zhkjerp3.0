<template>
  <div class="bodyContainer"
    id="setting">
    <div class="module">
      <div class="titleCtn">
        <div class="title">系统设置</div>
      </div>
      <div class="settingCtn">
        <div class="navFather">
          <div class="nav"
            :class="{ active: pName === key }"
            v-for="(item, key, index) in nav"
            :key="index"
            @click="pName = key">
            {{ key }}
          </div>
        </div>
        <div class="navSon">
          <div class="nav"
            :class="{ active: cName === item }"
            v-for="(item, index) in nav[pName]"
            :key="index"
            @click="cName = item">
            {{ item }}
          </div>
        </div>
        <div class="mainSetting">
          <template v-if="cName === '品类'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="
                    showPopup = true
                    categoryInfo.id = ''
                    ">
                  添加新品类
                </div>
                <el-checkbox class="fr"
                  style="line-height:32px"
                  v-model="checkCategoryDelete"
                  @change="getCategory">查询已删除</el-checkbox>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">品类</div>
                  <div class="col">二级品类</div>
                  <div class="col">单位</div>
                  <div class="col">编号</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in categoryArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">{{ item.secondary_category.map((item) => item.name).join(',') }}</div>
                  <div class="col">{{ item.unit }}</div>
                  <div class="col">{{ item.code }}</div>
                  <div class="col">
                    <span class="opr hoverOrange"
                      @click="updateCategory(item)">修改</span>
                    <span class="opr"
                      :class={hoverRed:!checkCategoryDelete,hoverGreen:checkCategoryDelete}
                      @click="deleteCategory(item.id)">{{checkCategoryDelete?'恢复':'删除'}}</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="categoryTotal"
                  :current-page.sync="categoryPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '款式'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加新款式</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('style')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('style')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">款式</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in styleArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteStyle(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="styleTotal"
                  :current-page.sync="stylePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '成分'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加成分</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('ingredient')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('ingredient')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">成分</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in ingredientArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteIngredient(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="ingredientTotal"
                  :current-page.sync="ingredientPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '配色组'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加配色组</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('colour')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('colour')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">配色组</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in colourArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteColour(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="colourTotal"
                  :current-page.sync="colourPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '尺码'">
            <div class="listCtn">
              <div class="list">
                <div class="row title">
                  <div class="col">大类名称</div>
                  <div class="col">尺码信息</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in sizeArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span v-for="(itemSize, indexSize) in item.size"
                      :key="indexSize">{{
                      indexSize > 0 ? '/' + itemSize.name : itemSize.name
                    }}</span>
                  </div>
                  <div class="col">
                    <span class="opr hoverBlue"
                      @click="addSize(item.id)">新增尺码</span>
                    <span class="opr hoverRed"
                      @click="delSize(item.size)">删除尺码</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="sizeTotal"
                  :current-page.sync="sizePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '尺寸模板'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加尺寸模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">模板名称</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in sizeModuleArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverBlue"
                      @click="lookSizeModule(item)">查看详情</span>
                    <span class="opr hoverRed"
                      @click="deleteSizeModule(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="sizeModuleTotal"
                  :current-page.sync="sizeModulePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '批次类型'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加类型</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">类型</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in orderTypeArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteOrderType(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="orderTypeTotal"
                  :current-page.sync="orderTypePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '样单类型'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加类型</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">类型</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in sampleOrderTypeArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteSampleOrderType(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="sampleOrderTypeTotal"
                  :current-page.sync="sampleOrderTypePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '原料加工工序'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加原料加工工序</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('yarnProcess')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('yarnProcess')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">原料加工工序</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in materialProcessArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteMaterialProcess(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="materialProcessTotal"
                  :current-page.sync="materialProcessPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '半成品加工'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <el-checkbox v-model="onlyDeleteProcess"
                  @change="getHalfProcess()">查询已删除</el-checkbox>
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加加工工序</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('semiProcess')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('semiProcess')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">工序编号</div>
                  <div class="col">加工工序</div>
                  <div class="col">工序标签</div>
                  <div class="col">工序说明</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in halfProcessArr"
                  :key="index">
                  <div class="col">{{ item.code }}</div>
                  <div class="col">{{ item.name }}</div>
                  <div class="col">{{item.rel_tag.map((item)=>item.name).join(',')}}</div>
                  <div class="col">
                    {{ item.process_desc || '暂无工序说明' }}
                  </div>
                  <div class="col">
                    <span class="opr hoverOrange"
                      @click="updateHalfProcess(item)">修改</span>
                    <span class="opr"
                      :class="{'hoverRed':!onlyDeleteProcess,'hoverOrange':onlyDeleteProcess}"
                      @click="deleteHalfProcess(item.id)">{{onlyDeleteProcess?'恢复':'删除'}}</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="halfProcessTotal"
                  :current-page.sync="halfProcessPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '成品加工工序'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <el-checkbox v-model="onlyDeleteProcess2"
                  @change="getStaffProcess()">查询已删除</el-checkbox>
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加成品加工工序</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('staffProcess')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('staffProcess')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">成品加工工序编号</div>
                  <div class="col">成品加工工序</div>
                  <div class="col">工序标签</div>
                  <div class="col">工序说明</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in staffProcessArr"
                  :key="index">
                  <div class="col">{{ item.code }}</div>
                  <div class="col">{{ item.name }}</div>
                  <div class="col">{{item.rel_tag.map((item)=>item.name).join(',')}}</div>
                  <div class="col">
                    {{ item.process_desc || '暂无工序说明' }}
                  </div>
                  <div class="col">
                    <span class="opr hoverOrange"
                      @click="updateStaffProcess(item)">修改</span>
                    <span class="opr"
                      :class="{'hoverRed':!onlyDeleteProcess2,'hoverOrange':onlyDeleteProcess2}"
                      @click="deleteStaffProcess(item.id)">{{onlyDeleteProcess2?'恢复':'删除'}}</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="staffProcessTotal"
                  :current-page.sync="staffProcessPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '边型'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加边型</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('side')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('side')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">边型</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in sideArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteSide(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="sideTotal"
                  :current-page.sync="sidePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '机型'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加机型</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('machine')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('machine')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">机型</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in machineArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteMachine(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="machineTotal"
                  :current-page.sync="machinePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '组织法'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加组织法</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('methods')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('methods')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">组织法</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in methodsArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteMethods(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="methodsTotal"
                  :current-page.sync="methodsPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '纱线颜色'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加颜色</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('yarnColor')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('yarnColor')">下载导入模板</div>
                <div class="hoverBlue fr"
                  style="cursor: pointer; line-height: 32px"
                  @click="$openUrl('http://www.pantone.net.cn/pantone/search/input.htm')">
                  查询潘通色号
                </div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">纱线颜色</div>
                  <div class="col">色块</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in yarnColorArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <div class="rect"
                      :style="{ background: item.color_code }"></div>
                  </div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteYarnColor(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="yarnColorTotal"
                  :current-page.sync="yarnColorPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '英文工厂信息'">
            <div class="documentSetting">
              <div class="row">
                <div class="label">公司英文名称(Company Name)：</div>
                <div class="content">
                  <el-input placeholder="请输入公司英文名称(Company Name)"
                    class="input-item"
                    v-model="clientEN.name">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <div class="label">公司统一社会信用代码(Company Social Credit Code)：</div>
                <div class="content">
                  <el-input placeholder="请输入公司统一社会信用代码(Company Social Credit Code)"
                    class="input-item"
                    v-model="clientEN.code">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司英文地址(Company Address)：</span>
                <div class="content">
                  <el-input class="input-item"
                    placeholder="请输入公司英文地址(Company Address)"
                    v-model="clientEN.address">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司电话(Telephone)：</span>
                <div class="content">
                  <el-input class="input-item"
                    placeholder="请输入公司电话(Telephone)"
                    v-model="clientEN.tel">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司传真(Fax)：</span>
                <div class="content">
                  <el-input class="input-item"
                    placeholder="请输入公司传真(Fax)"
                    v-model="clientEN.fax"> </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司签章(Company Signature)：</span>
                <div class="content upload">
                  <el-upload :before-upload="beforeUpload"
                    class="companySignatureUpload"
                    ref="companySignatureUpload"
                    action="https://upload.qiniup.com/"
                    drag
                    :data="postData"
                    :file-list="clientEN.signature ? [{ url: clientEN.signature }] : []"
                    :show-file-list="false"
                    :on-success="uploadSignatureSuccess">
                    <el-image class="showImg"
                      v-if="clientEN.signature"
                      :src="clientEN.signature"
                      fit="fill"></el-image>
                    <i v-else
                      class="el-icon-plus addIcon"></i>
                  </el-upload>
                  <div class="prompt">点击或拖拽至上传框,只能上传jpg/png文件，且不超过6MB</div>
                </div>
              </div>
              <div class="row">
                <span class="label">报关专用章：</span>
                <div class="content upload">
                  <el-upload :before-upload="beforeUpload"
                    class="companySignatureUpload"
                    ref="companyCustomsUpload"
                    action="https://upload.qiniup.com/"
                    drag
                    :data="postData"
                    :file-list="clientEN.special_seal ? [{ url: clientEN.special_seal }] : []"
                    :show-file-list="false"
                    :on-success="uploadCustomsSuccess">
                    <el-image class="showImg"
                      v-if="clientEN.special_seal"
                      :src="clientEN.special_seal"
                      fit="fill"></el-image>
                    <i v-else
                      class="el-icon-plus addIcon"></i>
                  </el-upload>
                  <div class="prompt">点击或拖拽至上传框,只能上传jpg/png文件，且不超过6MB</div>
                </div>
              </div>
              <div class="row clearfix">
                <div class="btn backHoverBlue fl"
                  @click="saveClientEN">保存填写信息</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '英文银行信息'">
            <div class="documentSetting">
              <div class="row">
                <div class="label">开户银行(Bank Name)：</div>
                <div class="content">
                  <el-input placeholder="请输入开户银行(Bank Name)"
                    class="input-item"
                    v-model="bankEN.name">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <div class="label">开户地址(Bank Address)：</div>
                <div class="content">
                  <el-input placeholder="请输入开户地址(Bank Address)"
                    class="input-item"
                    v-model="bankEN.address"
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">银行SWIFT码(SWIFT Code)：</span>
                <div class="content">
                  <el-input class="input-item"
                    placeholder="请输入银行SWIFT码(SWIFT Code)"
                    v-model="bankEN.code">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">收款人(Beneficiary)：</span>
                <div class="content">
                  <el-input class="input-item"
                    placeholder="请输入收款人(Beneficiary)"
                    v-model="bankEN.beneficiary">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">开户账号(Account No)：</span>
                <div class="content">
                  <el-input class="input-item"
                    placeholder="请输入开户账号(Account No)"
                    v-model="bankEN.account_no">
                  </el-input>
                </div>
              </div>
              <div class="row clearfix">
                <div class="btn backHoverBlue fl"
                  @click="saveBankEN">保存填写信息</div>
              </div>
            </div>
          </template>
          <template v-if="cName === 'HS编码设置'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="elCtn fl">
                  <el-input placeholder="请输入HS编码查询"
                    v-model="searchHSCode"
                    clearable
                    @keydown.native.enter="getHSCode"></el-input>
                </div>
                <div class="btn backHoverBlue fl"
                  @click="getHSCode(1)">点击查询</div>
              </div>
              <div class="fixedTableCtn">
                <div class="original">
                  <div class="row title">
                    <div class="column">HS编码</div>
                    <div class="column">商品名称</div>
                    <div class="column">出口税率</div>
                    <div class="column">出口退税税率</div>
                    <div class="column">出口暂定税率</div>
                    <div class="column">增值税率</div>
                    <div class="column">最惠国进口税率</div>
                    <div class="column">进口暂定税率</div>
                    <div class="column">进口普通税率</div>
                    <div class="column">消费税率</div>
                    <div class="column">第一法定单位</div>
                    <div class="column">第二法定单位</div>
                    <div class="column">第一法定单位代码</div>
                    <div class="column">第二法定单位代码</div>
                    <div class="column">监管条件详细信息</div>
                    <div class="column">检验检疫类别代码缩写</div>
                    <div class="column">检验检疫类别详细信息</div>
                    <div class="column">申报要素</div>
                  </div>
                  <div class="row"
                    v-for="(item, index) in HSCodeList"
                    :key="index">
                    <div class="column">{{ item.hs_code }}</div>
                    <div class="column">
                      <zh-overflow-text :content="item.product_name"></zh-overflow-text>
                    </div>
                    <div class="column">{{ item.export }}</div>
                    <div class="column">{{ item.export_rebate }}</div>
                    <div class="column">{{ item.temporary_export || '暂无' }}</div>
                    <div class="column">{{ item.vat_rate }}</div>
                    <div class="column">{{ item.most_favored_nation }}</div>
                    <div class="column">{{ item.provisional_import_tariff || '暂无' }}</div>
                    <div class="column">{{ item.import_general_duty }}</div>
                    <div class="column">{{ item.consumption }}</div>
                    <div class="column">{{ item.first_legal_unit }}</div>
                    <div class="column">{{ item.second_statutory_unit }}</div>
                    <div class="column">{{ item.first_legal_unit_code }}</div>
                    <div class="column">{{ item.second_legal_unit_code }}</div>
                    <div class="column">
                      <zh-overflow-text :content="item.regulatory_condition_info"
                        :line="2"></zh-overflow-text>
                    </div>
                    <div class="column">{{ item.quarantine_category_code }}</div>
                    <div class="column">
                      <zh-overflow-text :content="item.quarantine_category_details"
                        :line="2"></zh-overflow-text>
                    </div>
                    <div class="column">
                      <zh-overflow-text :content="item.declaration_elements"
                        :line="2"></zh-overflow-text>
                    </div>
                  </div>
                </div>
                <div class="cover">
                  <div class="fixedLeft">
                    <div class="row title">
                      <div class="column">HS编码</div>
                      <div class="column">商品名称</div>
                    </div>
                    <div class="row"
                      v-for="(item, index) in HSCodeList"
                      :key="index">
                      <div class="column">{{ item.hs_code }}</div>
                      <div class="column">
                        <zh-overflow-text :content="item.product_name"
                          :line="2"></zh-overflow-text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="HSCodeTotal"
                  :current-page.sync="HSCodePage"
                  @current-change="getHSCode">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '常用公司设置'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="elCtn">
                  <el-input placeholder="请输入公司名称按回车查询"
                    v-model="searchNormalClient"
                    clearable
                    @keydown.native.enter="getNormalClientList(1)"></el-input>
                </div>
                <div class="btn backHoverBlue fl"
                  @click="showPopup = true">添加常用公司</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">公司名称</div>
                  <div class="col">公司地址</div>
                  <div class="col">更新日期</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="item in normalClientList"
                  :key="item.id">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">{{ item.address }}</div>
                  <div class="col">{{ item.updated_at.slice(0, 10) }}</div>
                  <div class="col oprCtn">
                    <div class="opr hoverOrange"
                      @click="
                        normalClient = item
                        showPopup = true
                      ">
                      修改
                    </div>
                    <div class="opr hoverRed"
                      @click="deleteNormalClient(item.id)">删除</div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="normalClientTotal"
                  :current-page.sync="normalClientPage"
                  @current-change="getNormalClientList">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '常用城市设置'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="elCtn">
                  <el-input placeholder="请输入城市名称按回车查询"
                    v-model="searchNormalCity"
                    clearable
                    @keydown.native.enter="getNormalCityList(1)"></el-input>
                </div>
                <div class="btn backHoverBlue fl"
                  @click="showPopup = true">添加常用城市</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">常用国家(Country)</div>
                  <div class="col">常用城市 (City Name)</div>
                  <div class="col">更新日期</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="item in normalCityList"
                  :key="item.id">
                  <div class="col">{{ item.country }}</div>
                  <div class="col">{{ item.city }}</div>
                  <div class="col">{{ item.updated_at.slice(0, 10) }}</div>
                  <div class="col oprCtn">
                    <div class="opr hoverOrange"
                      @click="
                        normalCity = item
                        showPopup = true
                      ">
                      修改
                    </div>
                    <div class="opr hoverRed"
                      @click="deleteNormalCity(item.id)">删除</div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="normalCityTotal"
                  :current-page.sync="normalCityPage"
                  @current-change="getNormalCityList">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '常用品名设置'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="elCtn">
                  <el-input placeholder="请输入品名名称按回车查询"
                    v-model="searchNormalCategory"
                    clearable
                    @keydown.native.enter="getNormalCategoryList(1)"></el-input>
                </div>
                <div class="btn backHoverBlue fl"
                  @click="showPopup = true">添加品名</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">中文品类</div>
                  <div class="col">英文品名</div>
                  <div class="col">单位</div>
                  <div class="col">更新日期</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="item in normalCategoryList"
                  :key="item.id">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">{{ item.english }}</div>
                  <div class="col">{{ item.unit }}</div>
                  <div class="col">{{ item.updated_at.slice(0, 10) }}</div>
                  <div class="col oprCtn">
                    <div class="opr hoverOrange"
                      @click="
                        normalCategory = item
                        showPopup = true
                      ">
                      修改
                    </div>
                    <div class="opr hoverRed"
                      @click="deleteNormalCategory(item.id)">删除</div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="normalCategoryTotal"
                  :current-page.sync="normalCategoryPage"
                  @current-change="getNormalCategoryList">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '常用付款方式'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="elCtn">
                  <el-input placeholder="请输入付款名称按回车查询"
                    v-model="searchNormalPay"
                    clearable
                    @keydown.native.enter="getNormalPayList(1)"></el-input>
                </div>
                <div class="btn backHoverBlue fl"
                  @click="showPopup = true">添加付款方式</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">中文名称</div>
                  <div class="col">英文代号</div>
                  <div class="col">更新日期</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="item in normalPayList"
                  :key="item.id">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">{{ item.english }}</div>
                  <div class="col">{{ item.updated_at.slice(0, 10) }}</div>
                  <div class="col oprCtn">
                    <div class="opr hoverOrange"
                      @click="
                        normalPay = item
                        showPopup = true
                      ">
                      修改
                    </div>
                    <div class="opr hoverRed"
                      @click="deleteNormalPay(item.id)">删除</div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="normalPayTotal"
                  :current-page.sync="normalPayPage"
                  @current-change="getNormalPayList">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '纱线模拟'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加纱线模拟</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">模拟名称</div>
                  <div class="col">纱线直径</div>
                  <div class="col">纱线捻信息</div>
                  <div class="col">纱线边信息</div>
                  <div class="col">模拟图</div>
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
                    <span class="opr hoverOrange"
                      @click="updateCraft(item)">修改</span>
                    <span class="opr hoverRed"
                      @click="deleteCraft(item.id)">删除</span>
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
          </template>
          <template v-if="cName === '纱线原料'">
            <div class="listCtn"
              v-loading="yarnLoading">
              <div class="filterCtn clearfix">
                <div class="elCtn">
                  <el-input v-model="yarnKeyword1"
                    placeholder="搜索纱线名称"
                    @keydown.native.enter="getYarn(1)"></el-input>
                </div>
                <el-checkbox v-model="onlyDelete"
                  @change="getYarn(1)">查询已删除</el-checkbox>
                <div class="btn backHoverBlue fr"
                  @click="
                    showPopup = true
                    yarnInfo1.id = ''
                  ">
                  添加纱线
                </div>
                <div class="btn backHoverOrange fr"
                  @click="showYarn = true">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('yarn1')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col"
                    style="flex:2">纱线名称</div>
                  <div class="col">纱线类型</div>
                  <div class="col">参考报价</div>
                  <div class="col">添加信息</div>
                  <div class="col"
                    style="flex: 2">操作</div>
                </div>
                <div class="row"
                  v-for="item in yarnList1"
                  :key="item.id">
                  <div class="col"
                    style="flex:2">{{ item.name }}</div>
                  <div class="col">{{ item.rel_type.join('/') }}</div>
                  <div class="col">{{ item.rel_price | filterPrice }}</div>
                  <div class="col">{{ item.user_name }}/{{ item.created_at }}</div>
                  <div class="col"
                    style="flex: 2">
                    <span class="opr hoverBlue">
                      <el-popover placement="bottom"
                        title="报价详情"
                        width="600"
                        trigger="manual"
                        v-model="item.look">
                        <div class="tableCtn"
                          style="padding: 0">
                          <div class="thead">
                            <div class="trow">
                              <div class="tcol">单位名称</div>
                              <div class="tcol">报价</div>
                              <div class="tcol">备注</div>
                            </div>
                          </div>
                          <div class="tbody">
                            <div class="trow"
                              v-for="(itemChild, indexChild) in item.rel_price"
                              :key="indexChild">
                              <div class="tcol">{{ itemChild.client_name }}</div>
                              <div class="tcol">{{ itemChild.price }}元/kg</div>
                              <div class="tcol">{{ itemChild.desc || '无' }}</div>
                            </div>
                          </div>
                        </div>
                        <span slot="reference"
                          @click="item.look = !item.look">{{
                          item.look ? '关闭报价' : '查看报价'
                        }}</span>
                      </el-popover>
                    </span>
                    <span class="opr hoverOrange"
                      @click="updateYarn(item, 1)">修改</span>
                    <span class="opr hoverRed"
                      @click="deleteYarn(item.id, 1)">{{ onlyDelete ? '恢复' : '删除' }}</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="10"
                  layout="prev, pager, next, jumper"
                  :total="yarnTotal1"
                  :current-page.sync="yarnPage1"
                  @current-change="getYarn(1)">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '面料原料'">
            <div class="listCtn"
              v-loading="yarnLoading">
              <div class="filterCtn clearfix">
                <div class="elCtn">
                  <el-input v-model="yarnKeyword2"
                    placeholder="搜索面料名称"
                    @keydown.native.enter="getYarn(2)"></el-input>
                </div>
                <el-checkbox v-model="onlyDelete"
                  @change="getYarn(2)">查询已删除</el-checkbox>
                <div class="btn backHoverBlue fr"
                  @click="
                    showPopup = true
                    yarnInfo2.id = ''
                  ">
                  添加面料
                </div>
                <div class="btn backHoverOrange fr"
                  @click="showYarn = true">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('yarn2')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col"
                    style="flex:2">面料名称</div>
                  <div class="col">面料类型</div>
                  <div class="col">参考报价</div>
                  <div class="col">添加信息</div>
                  <div class="col"
                    style="flex: 2">操作</div>
                </div>
                <div class="row"
                  v-for="item in yarnList2"
                  :key="item.id">
                  <div class="col"
                    style="flex:2">{{ item.name }}</div>
                  <div class="col">{{ item.rel_type.join('/') }}</div>
                  <div class="col">{{ item.rel_price | filterPrice }}</div>
                  <div class="col">{{ item.user_name }}/{{ item.created_at }}</div>
                  <div class="col"
                    style="flex: 2">
                    <span class="opr hoverBlue">
                      <el-popover placement="bottom"
                        title="报价详情"
                        width="600"
                        trigger="manual"
                        v-model="item.look">
                        <div class="tableCtn"
                          style="padding: 0">
                          <div class="thead">
                            <div class="trow">
                              <div class="tcol">单位名称</div>
                              <div class="tcol">报价</div>
                              <div class="tcol">备注</div>
                            </div>
                          </div>
                          <div class="tbody">
                            <div class="trow"
                              v-for="(itemChild, indexChild) in item.rel_price"
                              :key="indexChild">
                              <div class="tcol">{{ itemChild.client_name }}</div>
                              <div class="tcol">{{ itemChild.price }}元/kg</div>
                              <div class="tcol">{{ itemChild.desc || '无' }}</div>
                            </div>
                          </div>
                        </div>
                        <span slot="reference"
                          @click="item.look = !item.look">{{
                          item.look ? '关闭报价' : '查看报价'
                        }}</span>
                      </el-popover>
                    </span>
                    <span class="opr hoverOrange"
                      @click="updateYarn(item, 2)">修改</span>
                    <span class="opr hoverRed"
                      @click="deleteYarn(item.id, 2)">{{ onlyDelete ? '恢复' : '删除' }}</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="10"
                  layout="prev, pager, next, jumper"
                  :total="yarnTotal2"
                  :current-page.sync="yarnPage2"
                  @current-change="getYarn(2)">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '毛料原料'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加毛料</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col"
                    style="flex:2">毛料名称</div>
                  <div class="col">毛料类型</div>
                  <div class="col">参考报价</div>
                  <div class="col">添加信息</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in yarnList3"
                  :key="index">
                  <div class="col"
                    style="flex:2">{{ item.name }}</div>
                  <div class="col">{{ item.rel_type.join('/') }}</div>
                  <div class="col">{{ item.rel_price | filterPrice }}</div>
                  <div class="col">{{ item.user_name }}/{{ item.created_at }}</div>
                  <div class="col">
                    <span class="opr hoverRed">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="yarnTotal3"
                  :current-page.sync="yarnPage3"
                  @current-change="getYarn(1)">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '装饰辅料'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="elCtn">
                  <el-input v-model="decorateMaterialKeyword"
                    placeholder="搜索辅料名称"
                    @keydown.native.enter="getDecorateMaterial"></el-input>
                </div>
                <el-checkbox v-model="onlyDelete"
                  @change="getDecorateMaterial">查询已删除</el-checkbox>
                <div class="btn backHoverBlue fr"
                  @click="
                    showPopup = true
                    decorateMaterialInfo.id = ''
                  ">
                  添加辅料
                </div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('decorateMaterial')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('decorateMaterial')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">辅料名称</div>
                  <div class="col">计量单位</div>
                  <div class="col">参考报价</div>
                  <div class="col">添加人</div>
                  <div class="col">添加时间</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in decorateMaterialArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">{{ item.unit }}</div>
                  <div class="col">{{ item.rel_price | filterPrice }}</div>
                  <div class="col">{{ item.user_name }}</div>
                  <div class="col">{{ item.created_at }}</div>
                  <div class="col">
                    <span class="opr hoverOrange"
                      @click="
                        decorateMaterialInfo = item
                        decorateMaterialInfo.price_info = item.rel_price.length > 0? item.rel_price: [{desc: '',price: '',client_id: '',client_id_arr: []}]
                        showPopup = true
                      ">修改</span>
                    <span class="opr hoverRed"
                      @click="deleteDecorateMaterial(item.id)">{{
                      onlyDelete ? '恢复' : '删除'
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="10"
                  layout="prev, pager, next, jumper"
                  :total="decorateMaterialTotal"
                  :current-page.sync="decorateMaterialPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '包装辅料'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="elCtn">
                  <el-input v-model="packMaterialKeyword"
                    placeholder="搜索辅料名称"
                    @keydown.native.enter="getPackMaterial"></el-input>
                </div>
                <el-checkbox v-model="onlyDelete"
                  @change="getPackMaterial">查询已删除</el-checkbox>
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加辅料</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">辅料名称</div>
                  <div class="col">计量单位</div>
                  <div class="col">计价方式</div>
                  <div class="col">参考报价</div>
                  <div class="col">添加人</div>
                  <div class="col">添加时间</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in packMaterialArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">{{ item.unit }}</div>
                  <div class="col">{{ item.calc_type | packCalcFilter }}</div>
                  <div class="col">{{ item.rel_price | filterPrice }}</div>
                  <div class="col">{{ item.user_name }}</div>
                  <div class="col">{{ item.created_at }}</div>
                  <div class="col">
                    <span class="opr hoverOrange"
                      @click="updatePackMaterial(item)">修改</span>
                    <span class="opr hoverRed"
                      @click="deletePackMaterial(item.id)">{{
                      onlyDelete ? '恢复' : '删除'
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="10"
                  layout="prev, pager, next, jumper"
                  :total="packMaterialTotal"
                  :current-page.sync="packMaterialPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '纱线报价'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="elCtn">
                  <el-input v-model="yarnPriceKeyword1"
                    placeholder="搜索纱线名称"
                    @keydown.native.enter="getYarnPrice"></el-input>
                </div>
                <div class="btn backHoverBlue fr"
                  @click="
                    resetYarnPrice()
                    showPopup = true
                  ">
                  添加报价
                </div>
                <div class="btn backHoverBlue fr"
                  @click="getYarnPrice">搜索</div>
              </div>
              <div class="list">
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">报价单位</div>
                      <div class="tcol noPad"
                        style="flex: 5">
                        <div class="trow">
                          <div class="tcol">纱线名称</div>
                          <div class="tcol">纱线颜色</div>
                          <div class="tcol">纱线属性</div>
                          <div class="tcol">报价</div>
                          <div class="tcol">备注</div>
                        </div>
                      </div>
                      <div class="tcol">操作</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="item in yarnPriceList"
                      :key="item.id">
                      <div class="tcol">{{ item.client_name }}</div>
                      <div class="tcol noPad"
                        style="flex: 5">
                        <div class="trow"
                          v-for="(itemChild, indexChild) in item.info_data"
                          :key="indexChild">
                          <div class="tcol">{{ itemChild.material_name }}</div>
                          <div class="tcol">{{ itemChild.material_color }}</div>
                          <div class="tcol">{{ itemChild.attribute }}</div>
                          <div class="tcol">{{ itemChild.price }}元/kg</div>
                          <div class="tcol">{{ itemChild.desc }}</div>
                        </div>
                      </div>
                      <div class="tcol oprCtn">
                        <span class="opr hoverOrange"
                          @click="
                            yarnPrice = item
                            showPopup = true
                            yarnPriceUpdate = true
                          ">修改</span>
                        <span class="opr hoverRed"
                          @click="deleteYarnPrice(item.id)">删除</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="yarnPriceTotal"
                  :current-page.sync="yarnPricePage"
                  @current-change="getYarnPrice">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '面料报价'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="elCtn">
                  <el-input v-model="yarnPriceKeyword2"
                    placeholder="搜索面料名称"
                    @keydown.native.enter="getMianliaoPrice"></el-input>
                </div>
                <div class="btn backHoverBlue fr"
                  @click="
                    resetYarnPrice()
                    showPopup = true
                  ">
                  添加报价
                </div>
                <div class="btn backHoverBlue fr"
                  @click="getMianliaoPrice">搜索</div>
              </div>
              <div class="list">
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">报价单位</div>
                      <div class="tcol noPad"
                        style="flex: 5">
                        <div class="trow">
                          <div class="tcol">面料名称</div>
                          <div class="tcol">面料颜色</div>
                          <div class="tcol">报价</div>
                          <div class="tcol">备注</div>
                        </div>
                      </div>
                      <div class="tcol">操作</div>
                    </div>
                  </div>
                  <div class="tbody">
                    <div class="trow"
                      v-for="item in mianliaoPriceList"
                      :key="item.id">
                      <div class="tcol">{{ item.client_name }}</div>
                      <div class="tcol noPad"
                        style="flex: 5">
                        <div class="trow"
                          v-for="(itemChild, indexChild) in item.info_data"
                          :key="indexChild">
                          <div class="tcol">{{ itemChild.material_name }}</div>
                          <div class="tcol">{{ itemChild.material_color }}</div>
                          <div class="tcol">{{ itemChild.price }}元/kg</div>
                          <div class="tcol">{{ itemChild.desc }}</div>
                        </div>
                      </div>
                      <div class="tcol oprCtn">
                        <span class="opr hoverOrange"
                          @click="
                            mianliaoPrice = item
                            showPopup = true
                            mianliaoPriceUpdate = true
                          ">修改</span>
                        <span class="opr hoverRed"
                          @click="deleteMianliaoPrice(item.id)">删除</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="mianliaoPriceTotal"
                  :current-page.sync="mianliaoPricePage"
                  @current-change="getMianliaoPrice">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '模板预加载'">
            <div class="listCtn">
              <div class="list">
                <div class="row title">
                  <div class="col">说明类型</div>
                  <div class="col">添加说明</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in priceRemarkList"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteSide(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="sideTotal"
                  :current-page.sync="sidePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '负责小组/人'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加小组/人</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">小组/人</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in groupArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteGroup(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="groupTotal"
                  :current-page.sync="groupPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '系统账户管理'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="
                    resetUser()
                    showPopup = true
                  ">
                  添加账号
                </div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">姓名</div>
                  <div class="col">用户名</div>
                  <div class="col">手机号</div>
                  <div class="col">岗位</div>
                  <div class="col">小组</div>
                  <div class="col">管理员权限</div>
                  <div class="col">启用账号</div>
                  <div class="col"
                    style="flex: 2">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in userArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">{{ item.user_name }}</div>
                  <div class="col">{{ item.phone }}</div>
                  <div class="col">{{ item.station }}</div>
                  <div class="col">{{ item.group_name }}</div>
                  <div class="col">{{ item.has_check === 1 ? '管理员' : '普通用户' }}</div>
                  <div class="col">{{ item.status === 1 ? '启用' : '禁用' }}</div>
                  <div class="col"
                    style="flex: 2">
                    <span class="opr"
                      :class="{ hoverRed: item.status === 1, hoverGreen: item.status !== 1 }"
                      @click="checkUser(item.id)">{{ item.status === 1 ? '禁用' : '启用' }}</span>
                    <!-- <span class="opr hoverRed"
                      @click="deleteUser(item.id)">删除</span> -->
                    <span class="opr hoverOrange"
                      @click="getUpdateUser(item)">修改</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="userTotal"
                  :current-page.sync="userPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '报价模板'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup = true">添加报价模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">预设名称</div>
                  <!-- <div class="col">绑定品类</div> -->
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in quotedPriceProductArr"
                  :key="index">
                  <div class="col">{{ item.title }}</div>
                  <!-- <div class="col">{{ item.category_name }}</div> -->
                  <div class="col">
                    <span class="opr hoverBlue"
                      @click="lookQuotedPriceProduct(item)">查看详情</span>
                    <span class="opr hoverRed"
                      @click="deleteQuotedPriceProduct(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="quotedPriceProductTotal"
                  :current-page.sync="quotedPriceProductPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName === '报价说明'">
            <div class="listCtn">
              <div class="list">
                <div class="row title">
                  <div class="col">品类信息</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item, index) in categoryArr"
                  :key="index">
                  <div class="col">{{ item.name }}</div>
                  <div class="col">
                    <span class="opr hoverBlue"
                      @click="lookQuotedPriceDescDetail(item)">查看</span>
                  </div>
                </div>
                <div class="pageCtn">
                  <el-pagination background
                    :page-size="5"
                    layout="prev, pager, next, jumper"
                    :total="categoryTotal"
                    :current-page.sync="categoryPage">
                  </el-pagination>
                </div>
              </div>
            </div>
          </template>
          <template v-if="cName === '基本信息'">
            <div class="companySetting">
              <div class="row">
                <div class="label">企业LOGO：</div>
                <div class="imgCtn">
                  <el-upload class="avatar-uploader"
                    drag
                    action="https://upload.qiniup.com/"
                    :show-file-list="false"
                    :on-success="uploadCompanySuccess"
                    :before-upload="beforeUpload"
                    :data="postData"
                    ref="companyLogo">
                    <img v-if="companyInfo.logo"
                      :src="companyInfo.logo"
                      class="logo-img"
                      style="width: 100%; height: 100%" />
                    <i v-else
                      class="el-icon-plus logo-icon"></i>
                  </el-upload>
                  <div class="prompt">点击或拖拽图片至上传框,只能上传jpg/png文件，且不超过6MB</div>
                </div>
              </div>
              <div class="row">
                <div class="label">公司二维码：</div>
                <div class="row"
                  style="align-items: flex-end">
                  <div class="content border tc"
                    style="width: 50%">
                    <div>
                      <img :src="qrCodeUrl"
                        width="50%" />
                    </div>
                    <div>织为云外协生产小程序</div>
                    <div>微信扫一扫，在线管理加工单进度</div>
                  </div>
                  <div class="btn backHoverBlue fl"
                    style="height: 33px; margin-left: 20px"
                    @click="$openUrl('/setting/printQRCode')">
                    点击打印
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="label">公司名称：</div>
                <div class="content">
                  <el-input placeholder="请输入公司名称"
                    class="input-item"
                    v-model="companyInfo.company_name"
                    disabled
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="row">
                <div class="label">公司简称：</div>
                <div class="content">
                  <el-input placeholder="请输入公司简称"
                    class="input-item"
                    v-model="companyInfo.alias"
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司简介:</span>
                <div class="content">
                  <el-input class="input-item"
                    style="width: 600px"
                    type="textarea"
                    placeholder="公司简介在200字以内..."
                    v-model="companyInfo.introduce"
                    :rows="7">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司邮箱：</span>
                <div class="content">
                  <el-input placeholder="请输入公司邮箱"
                    class="input-item"
                    v-model="companyInfo.email"> </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司地址：</span>
                <div class="content">
                  <el-input placeholder="请输入公司地址"
                    class="input-item"
                    v-model="companyInfo.address"> </el-input>
                </div>
              </div>
              <div class="btnCtn">
                <div class="btn backHoverBlue"
                  @click="saveCompany">保存修改</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '推送设置'">
            <div class="editCtn"
              style="padding: 20px 32px">
              <div class="row">
                <div class="col">
                  <div class="label">超额类的异常单据是否通知？</div>
                  <div class="info middle">
                    <el-radio v-model="pushCheckConfig.allow_push_err_doc"
                      :label="1">是</el-radio>
                    <el-radio v-model="pushCheckConfig.allow_push_err_doc"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">异常单据推送账号：</div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择账号"
                      v-model="pushCheckConfig.err_doc_push_user"
                      multiple>
                      <el-option v-for="item in userListCommon"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的单据是否通过公众号发送?</div>
                  <div class="info middle">
                    <el-radio v-model="pushCheckConfig.push_status"
                      :label="1">是</el-radio>
                    <el-radio v-model="pushCheckConfig.push_status"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div v-for="(item, index) in pushCheckConfig.push_user"
                :key="index">
                <div class="row">
                  <div class="col">
                    <div class="label">
                      推送账号：
                      <span class="red"
                        style="cursor: pointer"
                        v-if="index > 0"
                        @click="pushCheckConfig.push_user.splice(index, 1)">删除</span>
                    </div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择账号"
                        v-model="item.user_id">
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">推送单据：</div>
                    <div class="info middle">
                      <el-checkbox-group v-model="item.doc_type">
                        <el-checkbox v-for="item in pushStatusArr"
                          :key="item.value"
                          :label="item.value">{{
                          item.label
                        }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
              </div>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverOrange"
                  style="margin-right: 12px"
                  @click="
                    pushCheckConfig.push_user.push({
                      user_id: '',
                      doc_type: []
                    })
                  ">
                  新增账号
                </div>
                <div class="btn backHoverBlue"
                  @click="saveStatusConfig">保存设置</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '样品订单'">
            <div class="editCtn clearfix"
              style="padding: 20px 32px">
              <div class="smallTitle">发货通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="sampleOrderCheckConfig.data.dispatch_notice_condition"
                      :label="1">提前三天通知</el-radio>
                    <el-radio v-model="sampleOrderCheckConfig.data.dispatch_notice_condition"
                      :label="2">逾期通知</el-radio>
                    <el-radio v-model="sampleOrderCheckConfig.data.dispatch_notice_condition"
                      :label="3">不通知</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知对象(系统默认)</div>
                  <div class="info elCtn">
                    <el-radio>仅样单创建人</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知途径</div>
                  <div class="info elCtn">
                    <el-radio>默认包含系统通知</el-radio>
                    <el-checkbox :true-label="1"
                      :false-label="2"
                      v-model="sampleOrderCheckConfig.data.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                  </div>
                </div>
              </div>
              <div class="smallTitle">审核通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="sampleOrderCheckConfig.data.check_notice_condition"
                      :label="1">不通知，且需要人工审核</el-radio>
                    <el-radio v-model="sampleOrderCheckConfig.data.check_notice_condition"
                      :label="2">不通知，且均自动审核通过</el-radio>
                    <el-radio v-model="sampleOrderCheckConfig.data.check_notice_condition"
                      :label="3">通知，并设置通知条件</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="sampleOrderCheckConfig.data.check_notice_condition === 3">
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的下单客户（可多选）：</div>
                    <div class="info elCtn">
                      <el-cascader placeholder="筛选下单公司"
                        v-model="sampleOrderCheckConfig.data.client_id"
                        filterable
                        :props="{ multiple: true }"
                        :options="clientList"
                        clearable>
                      </el-cascader>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的创建人（可多选）：</div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择创建人"
                        v-model="sampleOrderCheckConfig.data.user_id"
                        filterable
                        multiple
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下打样数量，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="打样数量"
                        v-model="sampleOrderCheckConfig.data.number"></el-input>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="sampleOrderCheckConfig.data.check_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in sampleOrderCheckConfig.data.check_notice_user"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(sampleOrderCheckConfig.data.check_notice_user, { user_id: '', notice_for_wechat: '2' })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(sampleOrderCheckConfig.data.check_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的样单是否限制添加关联单据 ？</div>
                  <div class="info middle">
                    <el-radio v-model="sampleOrderCheckConfig.data.not_allow_add_rel_doc"
                      :label="1">是</el-radio>
                    <el-radio v-model="sampleOrderCheckConfig.data.not_allow_add_rel_doc"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的样单是否限制结算？</div>
                  <div class="info middle">
                    <el-radio v-model="sampleOrderCheckConfig.data.not_allow_settle"
                      :label="1">是</el-radio>
                    <el-radio v-model="sampleOrderCheckConfig.data.not_allow_settle"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverBlue"
                  @click="saveCheckConfig(17)">保存设置</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '大货订单'">
            <div class="editCtn clearfix"
              style="padding: 20px 32px">
              <div class="smallTitle">发货通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="orderCheckConfig.data.dispatch_notice_condition"
                      :label="1">提前七天通知</el-radio>
                    <el-radio v-model="orderCheckConfig.data.dispatch_notice_condition"
                      :label="2">逾期通知</el-radio>
                    <el-radio v-model="orderCheckConfig.data.dispatch_notice_condition"
                      :label="3">不通知</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知对象(系统默认)</div>
                  <div class="info elCtn">
                    <el-radio>仅订单创建人</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知途径</div>
                  <div class="info elCtn">
                    <el-radio>默认包含系统通知</el-radio>
                    <el-checkbox :true-label="1"
                      :false-label="2"
                      v-model="orderCheckConfig.data.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                  </div>
                </div>
              </div>
              <div class="smallTitle">审核通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="orderCheckConfig.data.check_notice_condition"
                      :label="1">不通知，且需要人工审核</el-radio>
                    <el-radio v-model="orderCheckConfig.data.check_notice_condition"
                      :label="2">不通知，且均自动审核通过</el-radio>
                    <el-radio v-model="orderCheckConfig.data.check_notice_condition"
                      :label="3">通知，并设置通知条件</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="orderCheckConfig.data.check_notice_condition === 3">
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的下单客户（可多选）：</div>
                    <div class="info elCtn">
                      <el-cascader placeholder="筛选下单公司"
                        v-model="orderCheckConfig.data.client_id"
                        filterable
                        :props="{ multiple: true }"
                        :options="clientList"
                        clearable>
                      </el-cascader>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的创建人（可多选）：</div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择创建人"
                        v-model="orderCheckConfig.data.user_id"
                        filterable
                        multiple
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下大货数量，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="大货数量"
                        v-model="orderCheckConfig.data.number"></el-input>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="orderCheckConfig.data.check_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in orderCheckConfig.data.check_notice_user"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="$addItem(orderCheckConfig.data.check_notice_user, { user_id: '', notice_for_wechat: '2' })">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(orderCheckConfig.data.check_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的订单是否限制后续操作？</div>
                  <div class="info middle">
                    <el-radio v-model="orderCheckConfig.data.not_allow_operate"
                      :label="1">是</el-radio>
                    <el-radio v-model="orderCheckConfig.data.not_allow_operate"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的订单是否限制添加关联单据 ？</div>
                  <div class="info middle">
                    <el-radio v-model="orderCheckConfig.data.not_allow_add_rel_doc"
                      :label="1">是</el-radio>
                    <el-radio v-model="orderCheckConfig.data.not_allow_add_rel_doc"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的订单是否限制结算？</div>
                  <div class="info middle">
                    <el-radio v-model="orderCheckConfig.data.not_allow_settle"
                      :label="1">是</el-radio>
                    <el-radio v-model="orderCheckConfig.data.not_allow_settle"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverBlue"
                  @click="saveCheckConfig(1)">保存设置</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '原料计划单'">
            <div class="editCtn clearfix"
              style="padding: 20px 32px">
              <div class="smallTitle">审核通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="materialPlanCheckConfig.data.check_notice_condition"
                      :label="1">不通知，且需要人工审核</el-radio>
                    <el-radio v-model="materialPlanCheckConfig.data.check_notice_condition"
                      :label="2">不通知，且均自动审核通过</el-radio>
                    <el-radio v-model="materialPlanCheckConfig.data.check_notice_condition"
                      :label="3">通知，并设置通知条件</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="materialPlanCheckConfig.data.check_notice_condition === 3">
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的创建人（可多选）：</div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择创建人"
                        v-model="materialPlanCheckConfig.data.user_id"
                        filterable
                        multiple
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">按照单据类型：</div>
                    <div class="info elCtn">
                      <el-select placeholder="单据类型"
                        v-model="materialPlanCheckConfig.data.order_type"
                        clearable>
                        <el-option label="仅订单自动通过"
                          :value="1"></el-option>
                        <el-option label="仅样单自动通过"
                          :value="2"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下下单数量，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="下单数量"
                        v-model="materialPlanCheckConfig.data.total_order_number"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下原料数量，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="原料数量"
                        v-model="materialPlanCheckConfig.data.total_material_number"></el-input>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="materialPlanCheckConfig.data.check_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in materialPlanCheckConfig.data.check_notice_user"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(materialPlanCheckConfig.data.check_notice_user, { user_id: '', notice_for_wechat: '2' })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(materialPlanCheckConfig.data.check_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的计划单是否限制添加关联单据 ？</div>
                  <div class="info middle">
                    <el-radio v-model="materialPlanCheckConfig.data.not_allow_add_rel_doc"
                      :label="1">是</el-radio>
                    <el-radio v-model="materialPlanCheckConfig.data.not_allow_add_rel_doc"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="smallTitle">修改异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="materialPlanCheckConfig.data.update_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="materialPlanCheckConfig.data.update_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知对象(系统默认)</div>
                  <div class="info elCtn">
                    <el-radio>仅计划单创建人</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知途径</div>
                  <div class="info elCtn">
                    <el-radio>默认包含系统通知</el-radio>
                    <el-checkbox :true-label="1"
                      :false-label="2"
                      v-model="materialPlanCheckConfig.data.update_notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                  </div>
                </div>
              </div>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverBlue"
                  @click="saveCheckConfig(9)">保存设置</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '原料采购单'">
            <div class="editCtn clearfix"
              style="padding: 20px 32px">
              <div class="smallTitle">审核通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="materialOrderCheckConfig.data.check_notice_condition"
                      :label="1">不通知，且需要人工审核</el-radio>
                    <el-radio v-model="materialOrderCheckConfig.data.check_notice_condition"
                      :label="2">不通知，且均自动审核通过</el-radio>
                    <el-radio v-model="materialOrderCheckConfig.data.check_notice_condition"
                      :label="3">通知，并设置通知条件</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="materialOrderCheckConfig.data.check_notice_condition === 3">
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的创建人（可多选）：</div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择创建人"
                        v-model="materialOrderCheckConfig.data.user_id"
                        filterable
                        multiple
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下采购总价，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="采购总价"
                        v-model="materialOrderCheckConfig.data.total_price"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下采购总数，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="采购总数"
                        v-model="materialOrderCheckConfig.data.total_number"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">输入可以自动审核通过的价格比例：</div>
                    <div class="info elCtn"
                      style="display: flex">
                      <el-input style="flex: 1; margin-right: 12px"
                        placeholder="数值"
                        v-model="materialOrderCheckConfig.data.contrast_quote_extent">
                        <template slot="append">%</template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="materialOrderCheckConfig.data.check_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in materialOrderCheckConfig.data.check_notice_user"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(materialOrderCheckConfig.data.check_notice_user, { user_id: '', notice_for_wechat: '2' })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(materialOrderCheckConfig.data.check_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的订购单是否限制后续操作？</div>
                  <div class="info middle">
                    <el-radio v-model="materialOrderCheckConfig.data.not_allow_operate"
                      :label="1">是</el-radio>
                    <el-radio v-model="materialOrderCheckConfig.data.not_allow_operate"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的订购单是否限制结算？</div>
                  <div class="info middle">
                    <el-radio v-model="materialOrderCheckConfig.data.not_allow_settle"
                      :label="1">是</el-radio>
                    <el-radio v-model="materialOrderCheckConfig.data.not_allow_settle"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="smallTitle">修改异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="materialOrderCheckConfig.data.update_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="materialOrderCheckConfig.data.update_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知对象(系统默认)</div>
                  <div class="info elCtn">
                    <el-radio>仅订购单创建人</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知途径</div>
                  <div class="info elCtn">
                    <el-radio>默认包含系统通知</el-radio>
                    <el-checkbox :true-label="1"
                      :false-label="2"
                      v-model="materialOrderCheckConfig.data.update_notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                  </div>
                </div>
              </div>
              <div class="smallTitle">超额异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="materialOrderCheckConfig.data.beyond_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="materialOrderCheckConfig.data.beyond_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="materialOrderCheckConfig.data.beyond_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in materialOrderCheckConfig.data.beyond_notice_user"
                  :key="index + 'chaoe'">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(materialOrderCheckConfig.data.beyond_notice_user, {
                        user_id: '',
                        notice_for_wechat: '2'
                      })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(materialOrderCheckConfig.data.beyond_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="smallTitle">价格异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="materialOrderCheckConfig.data.beyond_price_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="materialOrderCheckConfig.data.beyond_price_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="materialOrderCheckConfig.data.beyond_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in materialOrderCheckConfig.data.beyond_notice_user"
                  :key="index + 'chaoe'">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(materialOrderCheckConfig.data.beyond_notice_user, {
                        user_id: '',
                        notice_for_wechat: '2'
                      })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(materialOrderCheckConfig.data.beyond_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverBlue"
                  @click="saveCheckConfig(2)">保存设置</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '原料加工单'">
            <div class="editCtn clearfix"
              style="padding: 20px 32px">
              <div class="smallTitle">审核通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="materialProcessCheckConfig.data.check_notice_condition"
                      :label="1">不通知，且需要人工审核</el-radio>
                    <el-radio v-model="materialProcessCheckConfig.data.check_notice_condition"
                      :label="2">不通知，且均自动审核通过</el-radio>
                    <el-radio v-model="materialProcessCheckConfig.data.check_notice_condition"
                      :label="3">通知，并设置通知条件</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="materialProcessCheckConfig.data.check_notice_condition === 3">
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的创建人（可多选）：</div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择创建人"
                        v-model="materialProcessCheckConfig.data.user_id"
                        filterable
                        multiple
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下加工总价，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="加工总价"
                        v-model="materialProcessCheckConfig.data.total_price"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下加工总数，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="加工总数"
                        v-model="materialProcessCheckConfig.data.total_number"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">是否根据工序单价自动通过？</div>
                    <div class="info middle">
                      <el-radio v-model="materialProcessCheckConfig.data.by_process_price"
                        :label="1">是</el-radio>
                      <el-radio v-model="materialProcessCheckConfig.data.by_process_price"
                        :label="2">否</el-radio>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">按工序单价：</div>
                    <div class="info elCtn">
                      <el-input placeholder="加工单价"
                        v-model="materialProcessCheckConfig.data.ranse">
                        <template slot="prepend">染色低于</template>
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-input placeholder="加工单价"
                        v-model="materialProcessCheckConfig.data.daosha">
                        <template slot="prepend">倒纱低于</template>
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-input placeholder="加工单价"
                        v-model="materialProcessCheckConfig.data.bingxian">
                        <template slot="prepend">并线低于</template>
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-input placeholder="加工单价"
                        v-model="materialProcessCheckConfig.data.pengsha">
                        <template slot="prepend">膨纱低于</template>
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-input placeholder="加工单价"
                        v-model="materialProcessCheckConfig.data.qiege">
                        <template slot="prepend">切割低于</template>
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="materialProcessCheckConfig.data.check_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in materialProcessCheckConfig.data.check_notice_user"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(materialProcessCheckConfig.data.check_notice_user, {
                        user_id: '',
                        notice_for_wechat: '2'
                      })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(materialProcessCheckConfig.data.check_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的加工是否限制结算？</div>
                  <div class="info middle">
                    <el-radio v-model="materialProcessCheckConfig.data.not_allow_settle"
                      :label="1">是</el-radio>
                    <el-radio v-model="materialProcessCheckConfig.data.not_allow_settle"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="smallTitle">修改异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="materialProcessCheckConfig.data.update_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="materialProcessCheckConfig.data.update_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知对象(系统默认)</div>
                  <div class="info elCtn">
                    <el-radio>仅订购单创建人</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知途径</div>
                  <div class="info elCtn">
                    <el-radio>默认包含系统通知</el-radio>
                    <el-checkbox :true-label="1"
                      :false-label="2"
                      v-model="materialProcessCheckConfig.data.update_notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                  </div>
                </div>
              </div>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverBlue"
                  @click="saveCheckConfig(3)">保存设置</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '原料调取单'">
            <div class="editCtn"
              style="padding: 20px 32px">
              <div class="smallTitle">审核通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="materialStockCheckConfig.data.check_notice_condition"
                      :label="1">不通知，且需要人工审核</el-radio>
                    <el-radio v-model="materialStockCheckConfig.data.check_notice_condition"
                      :label="2">不通知，且均自动审核通过</el-radio>
                    <el-radio v-model="materialStockCheckConfig.data.check_notice_condition"
                      :label="3">通知，并设置通知条件</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="materialStockCheckConfig.data.check_notice_condition === 3">
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的创建人（可多选）：</div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择创建人"
                        v-model="materialStockCheckConfig.data.user_id"
                        filterable
                        multiple
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下调取总价，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="调取总价"
                        v-model="materialStockCheckConfig.data.total_price"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下调取总数，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="调取总数"
                        v-model="materialStockCheckConfig.data.total_number"></el-input>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="materialStockCheckConfig.data.check_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in materialStockCheckConfig.data.check_notice_user"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(materialStockCheckConfig.data.check_notice_user, { user_id: '', notice_for_wechat: '2' })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(materialStockCheckConfig.data.check_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="smallTitle">修改异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="materialStockCheckConfig.data.update_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="materialStockCheckConfig.data.update_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知对象(系统默认)</div>
                  <div class="info elCtn">
                    <el-radio>仅订购单创建人</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知途径</div>
                  <div class="info elCtn">
                    <el-radio>默认包含系统通知</el-radio>
                    <el-checkbox :true-label="1"
                      :false-label="2"
                      v-model="materialStockCheckConfig.data.update_notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                  </div>
                </div>
              </div>
              <div class="smallTitle">超额异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="materialStockCheckConfig.data.beyond_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="materialStockCheckConfig.data.beyond_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="materialStockCheckConfig.data.beyond_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in materialStockCheckConfig.data.beyond_notice_user"
                  :key="index + 'chaoe'">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(materialStockCheckConfig.data.beyond_notice_user, {
                        user_id: '',
                        notice_for_wechat: '2'
                      })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(materialStockCheckConfig.data.beyond_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverBlue"
                  @click="saveCheckConfig(6)">保存设置</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '辅料采购单'">
            <div class="editCtn clearfix"
              style="padding: 20px 32px">
              <div class="smallTitle">审核通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="accessoriesOrderCheckConfig.data.check_notice_condition"
                      :label="1">不通知，且需要人工审核</el-radio>
                    <el-radio v-model="accessoriesOrderCheckConfig.data.check_notice_condition"
                      :label="2">不通知，且均自动审核通过</el-radio>
                    <el-radio v-model="accessoriesOrderCheckConfig.data.check_notice_condition"
                      :label="3">通知，并设置通知条件</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="accessoriesOrderCheckConfig.data.check_notice_condition === 3">
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的创建人（可多选）：</div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择创建人"
                        v-model="accessoriesOrderCheckConfig.data.user_id"
                        filterable
                        multiple
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下采购总价，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="采购总价"
                        v-model="accessoriesOrderCheckConfig.data.total_price"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下采购总数，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="采购总数"
                        v-model="accessoriesOrderCheckConfig.data.total_number"></el-input>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="accessoriesOrderCheckConfig.data.check_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in accessoriesOrderCheckConfig.data.check_notice_user"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(accessoriesOrderCheckConfig.data.check_notice_user, {
                        user_id: '',
                        notice_for_wechat: '2'
                      })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(accessoriesOrderCheckConfig.data.check_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的订购单是否限制结算？</div>
                  <div class="info middle">
                    <el-radio v-model="accessoriesOrderCheckConfig.data.not_allow_settle"
                      :label="1">是</el-radio>
                    <el-radio v-model="accessoriesOrderCheckConfig.data.not_allow_settle"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="smallTitle">修改异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="accessoriesOrderCheckConfig.data.update_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="accessoriesOrderCheckConfig.data.update_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知对象(系统默认)</div>
                  <div class="info elCtn">
                    <el-radio>仅订购单创建人</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知途径</div>
                  <div class="info elCtn">
                    <el-radio>默认包含系统通知</el-radio>
                    <el-checkbox :true-label="1"
                      :false-label="2"
                      v-model="accessoriesOrderCheckConfig.data.update_notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                  </div>
                </div>
              </div>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverBlue"
                  @click="saveCheckConfig(18)">保存设置</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '生产计划单'">
            <div class="editCtn"
              style="padding: 20px 32px">
              <div class="smallTitle">审核通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="productionPlanCheckConfig.data.check_notice_condition"
                      :label="1">不通知，且需要人工审核</el-radio>
                    <el-radio v-model="productionPlanCheckConfig.data.check_notice_condition"
                      :label="2">不通知，且均自动审核通过</el-radio>
                    <el-radio v-model="productionPlanCheckConfig.data.check_notice_condition"
                      :label="3">通知，并设置通知条件</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="productionPlanCheckConfig.data.check_notice_condition === 3">
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的创建人（可多选）：</div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择创建人"
                        v-model="productionPlanCheckConfig.data.user_id"
                        filterable
                        multiple
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下生产数量，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="生产数量"
                        v-model="productionPlanCheckConfig.data.total_number"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下生产总价，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="生产总价"
                        v-model="productionPlanCheckConfig.data.total_price"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in productionPlanCheckConfig.data.contrast_quote_extent"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      v-if="index === 0">报价单工序对比比例介于该比例之间则自动通过：</div>
                    <div class="info elCtn"
                      style="display: flex">
                      <el-input style="flex: 1; margin-right: 12px"
                        placeholder="输入工序"
                        v-model="item.process_name">
                      </el-input>
                      <el-input style="flex: 1; margin-right: 12px"
                        placeholder="低于"
                        v-model="item.min">
                        <template slot="append">%</template>
                      </el-input>
                      <el-input style="flex: 1"
                        placeholder="高于"
                        v-model="item.max">
                        <template slot="append">%</template>
                      </el-input>
                      <div class="opr hoverBlue"
                        @click="
                          $addItem(productionPlanCheckConfig.data.contrast_quote_extent, {
                            process_name: '',
                            min: '',
                            max: ''
                          })
                        "
                        v-if="index === 0">
                        新增
                      </div>
                      <div class="opr hoverRed"
                        @click="$deleteItem(productionPlanCheckConfig.data.contrast_quote_extent, index)"
                        v-if="index > 0">
                        删除
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="productionPlanCheckConfig.data.check_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in productionPlanCheckConfig.data.check_notice_user"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(productionPlanCheckConfig.data.check_notice_user, {
                        user_id: '',
                        notice_for_wechat: '2'
                      })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(productionPlanCheckConfig.data.check_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的订购单是否限制结算？</div>
                  <div class="info middle">
                    <el-radio v-model="productionPlanCheckConfig.data.not_allow_settle"
                      :label="1">是</el-radio>
                    <el-radio v-model="productionPlanCheckConfig.data.not_allow_settle"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="smallTitle">价格异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="productionPlanCheckConfig.data.update_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="productionPlanCheckConfig.data.update_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <div class="smallTitle">修改异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="productionPlanCheckConfig.data.update_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="productionPlanCheckConfig.data.update_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知对象(系统默认)</div>
                  <div class="info elCtn">
                    <el-radio>仅计划单创建人</el-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">通知途径</div>
                  <div class="info elCtn">
                    <el-radio>默认包含系统通知</el-radio>
                    <el-checkbox :true-label="1"
                      :false-label="2"
                      v-model="productionPlanCheckConfig.data.update_notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                  </div>
                </div>
              </div>
              <div class="smallTitle">超额异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="productionPlanCheckConfig.data.beyond_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="productionPlanCheckConfig.data.beyond_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="productionPlanCheckConfig.data.beyond_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in productionPlanCheckConfig.data.beyond_notice_user"
                  :key="index + 'chaoe'">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(productionPlanCheckConfig.data.beyond_notice_user, {
                        user_id: '',
                        notice_for_wechat: '2'
                      })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(productionPlanCheckConfig.data.beyond_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverBlue"
                  @click="saveCheckConfig(4)">保存设置</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '包装采购单'">
            <div class="editCtn clearfix"
              style="padding: 20px 32px">
              <div class="smallTitle">审核通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="packOrderCheckConfig.data.check_notice_condition"
                      :label="1">不通知，且需要人工审核</el-radio>
                    <el-radio v-model="packOrderCheckConfig.data.check_notice_condition"
                      :label="2">不通知，且均自动审核通过</el-radio>
                    <el-radio v-model="packOrderCheckConfig.data.check_notice_condition"
                      :label="3">通知，并设置通知条件</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="packOrderCheckConfig.data.check_notice_condition === 3">
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的创建人（可多选）：</div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择创建人"
                        v-model="packOrderCheckConfig.data.user_id"
                        filterable
                        multiple
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下采购数量，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="采购数量"
                        v-model="packOrderCheckConfig.data.total_number"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下采购总价，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="采购总价"
                        v-model="packOrderCheckConfig.data.total_price"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">输入可以自动审核通过的报价单对比价格比例：</div>
                    <div class="info elCtn"
                      style="display: flex">
                      <el-input style="flex: 1; margin-right: 12px"
                        placeholder="数值"
                        v-model="packOrderCheckConfig.data.contrast_quote_extent">
                        <template slot="append">%</template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="packOrderCheckConfig.data.check_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in packOrderCheckConfig.data.check_notice_user"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(packOrderCheckConfig.data.check_notice_user, { user_id: '', notice_for_wechat: '2' })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(packOrderCheckConfig.data.check_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的订购单是否限制结算？</div>
                  <div class="info middle">
                    <el-radio v-model="packOrderCheckConfig.data.not_allow_settle"
                      :label="1">是</el-radio>
                    <el-radio v-model="packOrderCheckConfig.data.not_allow_settle"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverBlue"
                  @click="saveCheckConfig(11)">保存设置</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '工资结算单'">
            <div class="editCtn clearfix"
              style="padding: 20px 32px">
              <div class="smallTitle">审核通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="gongziCheckConfig.data.check_notice_condition"
                      :label="1">不通知，且需要人工审核</el-radio>
                    <el-radio v-model="gongziCheckConfig.data.check_notice_condition"
                      :label="2">不通知，且均自动审核通过</el-radio>
                    <el-radio v-model="gongziCheckConfig.data.check_notice_condition"
                      :label="3">通知，并设置通知条件</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="gongziCheckConfig.data.check_notice_condition === 3">
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的创建人（可多选）：</div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择创建人"
                        v-model="gongziCheckConfig.data.user_id"
                        filterable
                        multiple
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下结算数量，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="结算数量"
                        v-model="gongziCheckConfig.data.total_number"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下结算总价，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="结算总价"
                        v-model="gongziCheckConfig.data.total_price"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">输入可以自动审核通过的报价单对比价格比例：</div>
                    <div class="info elCtn"
                      style="display: flex">
                      <el-input style="flex: 1; margin-right: 12px"
                        placeholder="数值"
                        v-model="gongziCheckConfig.data.contrast_quote_extent">
                        <template slot="append">%</template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="gongziCheckConfig.data.check_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in gongziCheckConfig.data.check_notice_user"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="$addItem(gongziCheckConfig.data.check_notice_user, { user_id: '', notice_for_wechat: '2' })">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(gongziCheckConfig.data.check_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的工资结算单是否限制结算？</div>
                  <div class="info middle">
                    <el-radio v-model="gongziCheckConfig.data.not_allow_settle"
                      :label="1">是</el-radio>
                    <el-radio v-model="gongziCheckConfig.data.not_allow_settle"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="smallTitle">价格异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="gongziCheckConfig.data.update_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="gongziCheckConfig.data.update_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <div class="smallTitle">超额异常通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">是否通知(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="gongziCheckConfig.data.beyond_notice_condition"
                      :label="1">通知</el-radio>
                    <el-radio v-model="gongziCheckConfig.data.beyond_notice_condition"
                      :label="2">不通知</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="gongziCheckConfig.data.beyond_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in gongziCheckConfig.data.beyond_notice_user"
                  :key="index + 'chaoe'">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(gongziCheckConfig.data.beyond_notice_user, { user_id: '', notice_for_wechat: '2' })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(gongziCheckConfig.data.beyond_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverBlue"
                  @click="saveCheckConfig(14)">保存设置</div>
              </div>
            </div>
          </template>
          <template v-if="cName === '发货单'">
            <div class="editCtn clearfix"
              style="padding: 20px 32px">
              <div class="smallTitle">审核通知</div>
              <div class="row">
                <div class="col">
                  <div class="label">通知条件(单选)</div>
                  <div class="info middle">
                    <el-radio v-model="packOutCheckConfig.data.check_notice_condition"
                      :label="1">不通知，且需要人工审核</el-radio>
                    <el-radio v-model="packOutCheckConfig.data.check_notice_condition"
                      :label="2">不通知，且均自动审核通过</el-radio>
                    <el-radio v-model="packOutCheckConfig.data.check_notice_condition"
                      :label="3">通知，并设置通知条件</el-radio>
                  </div>
                </div>
              </div>
              <template v-if="packOutCheckConfig.data.check_notice_condition === 3">
                <div class="row">
                  <div class="col">
                    <div class="label">请选择可以自动审核通过的创建人（可多选）：</div>
                    <div class="info elCtn">
                      <el-select placeholder="请选择创建人"
                        v-model="packOutCheckConfig.data.user_id"
                        filterable
                        multiple
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下发货数量，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="发货数量"
                        v-model="packOutCheckConfig.data.total_number"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">少于以下发货总价，则自动通过：</div>
                    <div class="info elCtn">
                      <el-input placeholder="发货总价"
                        v-model="packOutCheckConfig.data.total_price"></el-input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">输入可以自动审核通过的报价单对比价格比例：</div>
                    <div class="info elCtn"
                      style="display: flex">
                      <el-input style="flex: 1; margin-right: 12px"
                        placeholder="数值"
                        v-model="packOutCheckConfig.data.contrast_quote_extent">
                        <template slot="append">%</template>
                      </el-input>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="packOutCheckConfig.data.check_notice_condition !== 2">
                <div class="row">
                  <div class="col">
                    <div class="label">通知对象与通知途径(必填)</div>
                  </div>
                </div>
                <div class="row"
                  v-for="(item, index) in packOutCheckConfig.data.check_notice_user"
                  :key="index">
                  <div class="col">
                    <div class="label"
                      style="display: flex; height: 32px; line-height: 32px">
                      {{ index + 1 }}、
                      <el-select placeholder="请选择通知人"
                        v-model="item.user_id"
                        filterable
                        clearable>
                        <el-option v-for="item in userListCommon"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="info elCtn"
                      style="margin-top: 12px">
                      <el-radio>默认包含系统通知</el-radio>
                      <el-checkbox :true-label="1"
                        :false-label="2"
                        v-model="item.notice_for_wechat">手机端-微信公众号通知</el-checkbox>
                    </div>
                  </div>
                  <span class="opr hoverBlue"
                    style="top: -71px"
                    v-if="index === 0"
                    @click="
                      $addItem(packOutCheckConfig.data.check_notice_user, { user_id: '', notice_for_wechat: '2' })
                    ">添加</span>
                  <span class="opr hoverRed"
                    style="top: -71px"
                    v-if="index > 0"
                    @click="$deleteItem(packOutCheckConfig.data.check_notice_user, index)">删除</span>
                </div>
              </template>
              <div class="row">
                <div class="col">
                  <div class="label">未审核的发货单是否限制结算？</div>
                  <div class="info middle">
                    <el-radio v-model="packOutCheckConfig.data.not_allow_settle"
                      :label="1">是</el-radio>
                    <el-radio v-model="packOutCheckConfig.data.not_allow_settle"
                      :label="2">否</el-radio>
                  </div>
                </div>
              </div>
              <div class="btnCtn fr"
                style="margin-top: 20px">
                <div class="btn backHoverBlue"
                  @click="saveCheckConfig(13)">保存设置</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showPopup">
      <template v-if="cName === '常用公司设置'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">{{ normalClient.id ? '修改' : '新增' }}常用公司</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">公司名称：</div>
              <div class="info">
                <el-input placeholder="请输入公司名称"
                  v-model="normalClient.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">公司地址：</div>
              <div class="info">
                <el-input placeholder="请输入公司地址"
                  v-model="normalClient.address"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveNormalClient">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '常用城市设置'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">{{ normalCity.id ? '修改' : '新增' }}常用城市</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">国家名称：</div>
              <div class="info">
                <el-input placeholder="请输入国家名称"
                  v-model="normalCity.country"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">城市名称：</div>
              <div class="info">
                <el-input placeholder="请输入城市名称"
                  v-model="normalCity.city"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveNormalCity">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '常用品名设置'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">{{ normalCategory.id ? '修改' : '新增' }}常用品名</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">品类名称：</div>
              <div class="info">
                <el-input placeholder="请输入品类名称"
                  v-model="normalCategory.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">英文名称：</div>
              <div class="info">
                <el-input placeholder="请输入英文名称"
                  v-model="normalCategory.english"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">单位：</div>
              <div class="info">
                <el-input placeholder="请输入单位"
                  v-model="normalCategory.unit"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveNormalCategory">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '常用付款方式'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">{{ normalPay.id ? '修改' : '新增' }}付款方式</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">付款方式：</div>
              <div class="info">
                <el-input placeholder="请输入付款方式"
                  v-model="normalPay.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">英文名称：</div>
              <div class="info">
                <el-input placeholder="请输入英文名称"
                  v-model="normalPay.english"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveNormalPay">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '品类'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">{{ categoryInfo.id ? '修改' : '新增' }}品类</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">品类名称：</div>
              <div class="info">
                <el-input placeholder="请输入品类名称"
                  v-model="categoryInfo.name"></el-input>
              </div>
            </div>
            <div class="row"
              v-for="(item, index) in categoryInfo.secondary_category"
              :key="index">
              <div class="label">{{ index === 0 ? '二级品类：' : '' }}</div>
              <div class="info">
                <el-input placeholder="请输入二级品类名称"
                  v-model="item.name"></el-input>
                <div class="info_btn hoverBlue"
                  @click="$addItem(categoryInfo.secondary_category, { name: '', id: '' })"
                  v-if="index === 0">
                  添加
                </div>
                <div class="info_btn hoverRed"
                  @click="
                    item.id ? deleteSecondCategory(item.id, index) : $deleteItem(categoryInfo.secondary_category, index)
                  "
                  v-if="index > 0">
                  删除
                </div>
              </div>
            </div>
            <div class="row">
              <div class="label">品类单位：</div>
              <div class="info">
                <el-autocomplete placeholder="请输入品类单位"
                  v-model="categoryInfo.unit"
                  :fetch-suggestions="searchProUnit"></el-autocomplete>
              </div>
            </div>
            <!-- <div class="row">
              <div class="label">品类编号：</div>
              <div class="info">
                <el-input placeholder="请输入品类单位"
                  v-model="categoryInfo.code"></el-input>
              </div>
            </div> -->
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveCategory">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '款式'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增款式</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">款式名称：</div>
              <div class="info">
                <el-input placeholder="请输入款式名称"
                  v-model="styleInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveStyle">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '成分'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增成分</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">成分名称：</div>
              <div class="info">
                <el-input placeholder="请输入成分名称"
                  v-model="ingredientInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveIngredient">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '配色组'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增配色</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">配色名称：</div>
              <div class="info">
                <el-input placeholder="请输入配色名称"
                  v-model="colourInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveColour">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '尺码'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增尺码</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">尺码名称：</div>
              <div class="info">
                <el-input placeholder="请输入尺码名称"
                  v-model="sizeInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveSize">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '尺寸模板'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增尺寸模板</div>
            <div class="closeCtn"
              @click="
                showPopup = false
                sizeModuleUpdate = false
                resetSizeModule()
              ">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">模板标题</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入模板标题"
                      v-model="updateSizeModule.name"></el-input>
                  </div>
                </div>
              </div>
              <div class="row"
                v-for="(itemContent, indexContent) in updateSizeModule.content"
                :key="'Content' + indexContent">
                <div class="col">
                  <div class="label"
                    v-if="indexContent === 0">
                    <span class="text">尺寸</span>
                  </div>
                  <div class="info elCtn">
                    <el-input :disabled='indexContent === 0'
                      v-model="itemContent.name"
                      placeholder="尺寸名称"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexContent === 0">
                    <span class="text">值</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemContent.value"
                      :placeholder="itemContent.name || '请先填写尺寸名称'"
                      :disabled="!itemContent.name">
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexContent === 0"
                  @click="
                  updateSizeModule.content.length === 10 ? 
                    $message.error('最多只能添加九条数据') :
                    $addItem(updateSizeModule.content, {
                      value: '',
                      name: '',
                    })
                  ">
                  添加
                </div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(updateSizeModule.content, indexContent)">
                  删除
                </div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="
                showPopup = false
                sizeModuleUpdate = false
                resetSizeModule()
              ">
              取消
            </div>
            <div class="btn"
              :class="sizeModuleUpdate ? 'backHoverOrange' : 'backHoverBlue'"
              @click="saveSizeModule">
              {{ sizeModuleUpdate ? '修改' : '确认' }}
            </div>
          </div>
        </div>
      </template>
      <template v-if="cName === '批次类型'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增批次类型</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">批次类型：</div>
              <div class="info">
                <el-input placeholder="请输入批次类型"
                  v-model="orderTypeInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveOrderType">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '样单类型'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增样单类型</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">样单类型：</div>
              <div class="info">
                <el-input placeholder="请输入样单类型"
                  v-model="sampleOrderTypeInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveSampleOrderType">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '原料加工工序'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增原料加工工序</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">原料加工工序：</div>
              <div class="info">
                <el-input placeholder="请输入原料加工工序"
                  v-model="materialProcessInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveMaterialProcess">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '半成品加工'">
        <div class="main"
          style="width:920px">
          <div class="titleCtn">
            <div class="text">{{ isHalfUpdate ? '修改加工工序' : '新增加工工序' }}</div>
            <div class="closeCtn"
              @click="cancelHalfProcess">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">工序编号：</div>
              <div class="info">
                <el-input placeholder="请输入工序编号（仅限数字）"
                  type="number"
                  v-model="halfProcessInfo.code"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label isMust">加工工序：</div>
              <div class="info">
                <el-input placeholder="请输入加工工序"
                  v-model="halfProcessInfo.name"></el-input>
              </div>
            </div>
            <div class="row"
              v-for="(item, index) in processHalfDescList"
              :key="'processHalfDescList' + index">
              <div class="label">工序说明{{ index + 1 }}：</div>
              <div class="info">
                <el-input placeholder="请输入工序说明"
                  v-model="processHalfDescList[index]"
                  :style="{ width: index === processHalfDescList.length - 1 ? '70%' : '100%' }"></el-input>
                <el-button style="margin-left: 20px"
                  v-if="index === processHalfDescList.length - 1"
                  @click="$addItem(processHalfDescList, '')">添加</el-button>
              </div>
            </div>
            <div class="row">
              <div class="label">工序标签：</div>
              <div class="info tagCtn">
                <span class="yarnNameTag"
                  :class="{ active: item.check, unactive: !item.check }"
                  v-for="(item, index) in halfProcessTypeList"
                  :key="item.id"
                  @click="item.check = !item.check;$forceUpdate()">
                  <span class="name">{{ item.name }}</span>
                  <span class="el-icon-close icon"
                    @click.stop="deleteHalfProcessType(item.id, index, 1)"></span>
                </span>
                <span class="elCtn"
                  v-show="halfProcessTypeFlag">
                  <el-input placeholder="输入新增类型"
                    v-model="halfProcessTypeInfo.name"></el-input>
                </span>
                <span class="yarnNameTag"
                  :class="halfProcessTypeFlag ? 'active' : 'addBtn'"
                  @click="halfProcessTypeFlag ? saveHalfProcessType() : (halfProcessTypeFlag = true)">{{ halfProcessTypeFlag ? '保存类型' : '新增类型' }}
                  <i :class="halfProcessTypeFlag ? 'el-icon-document-checked' : 'el-icon-plus'"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="cancelHalfProcess">取消</div>
            <div class="btn backHoverBlue"
              @click="saveHalfProcess">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '成品加工工序'">
        <div class="main"
          style="width:920px">
          <div class="titleCtn">
            <div class="text">{{ isStaffProcessUpdate ? '修改成品加工工序' : '新增成品加工工序' }}</div>
            <div class="closeCtn"
              @click="cancelStaffProcess">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label"
                style="width: 8em;">成品加工编号：</div>
              <div class="info">
                <el-input placeholder="请输入成品加工工序编号（仅限数字）"
                  type="number"
                  v-model="staffProcessInfo.code"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label isMust"
                style="width: 8em;">成品加工工序：</div>
              <div class="info">
                <el-input placeholder="请输入成品加工工序"
                  v-model="staffProcessInfo.name"></el-input>
              </div>
            </div>
            <div class="row"
              v-for="(item, index) in processStaffDescList"
              :key="'processStaffDescList' + index">
              <div class="label"
                style="width: 8em;">工序说明{{ index + 1 }}：</div>
              <div class="info">
                <el-input placeholder="请输入工序说明"
                  v-model="processStaffDescList[index]"
                  :style="{ width: index === processStaffDescList.length - 1 ? '70%' : '100%' }"></el-input>
                <el-button style="margin-left: 17px"
                  v-if="index === processStaffDescList.length - 1"
                  @click="$addItem(processStaffDescList, '')">添加</el-button>
              </div>
            </div>
            <div class="row">
              <div class="label">工序标签：</div>
              <div class="info tagCtn">
                <span class="yarnNameTag"
                  :class="{ active: item.check, unactive: !item.check }"
                  v-for="(item, index) in  staffProcessTypeList"
                  :key="item.id"
                  @click="item.check = !item.check;$forceUpdate()">
                  <span class="name">{{ item.name }}</span>
                  <span class="el-icon-close icon"
                    @click.stop="deleteStaffProcessType(item.id, index, 1)"></span>
                </span>
                <span class="elCtn"
                  v-show=" staffProcessTypeFlag">
                  <el-input placeholder="输入新增类型"
                    v-model="staffProcessTypeInfo.name"></el-input>
                </span>
                <span class="yarnNameTag"
                  :class=" staffProcessTypeFlag ? 'active' : 'addBtn'"
                  @click=" staffProcessTypeFlag ? saveStaffProcessType() : ( staffProcessTypeFlag = true)">{{  staffProcessTypeFlag ? '保存类型' : '新增类型' }}
                  <i :class=" staffProcessTypeFlag ? 'el-icon-document-checked' : 'el-icon-plus'"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="cancelStaffProcess">取消</div>
            <div class="btn backHoverBlue"
              @click="saveStaffProcess">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '边型'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增边型</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">边型：</div>
              <div class="info">
                <el-input placeholder="请输入边型"
                  v-model="sideInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveSide">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '机型'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增机型</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">机型：</div>
              <div class="info">
                <el-input placeholder="请输入机型"
                  v-model="machineInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveMachine">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '组织法'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增组织法</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">组织法：</div>
              <div class="info">
                <el-input placeholder="请输入组织法"
                  v-model="methodsInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveMethods">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '纱线颜色'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增颜色</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">颜色：</div>
              <div class="info">
                <el-input placeholder="请输入颜色"
                  v-model="yarnColorInfo.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">选择色块：</div>
              <div class="info">
                <el-color-picker v-model="yarnColorInfo.color_code"></el-color-picker>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveYarnColor">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '纱线模拟'">
        <div class="main"
          style="width: 920px">
          <div class="titleCtn">
            <div class="text">{{craftInfo.id?'修改':'新增'}}纱线模拟</div>
            <div class="closeCtn"
              @click="showPopup = false;resetCraft()">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="explanation red"
              style="margin:20px"
              v-if="craftInfo.id">注意！修改纱线请重新模拟图片上传！</div>
            <div class="row">
              <div class="label isMust">模拟名称：</div>
              <div class="info">
                <el-input placeholder="输入纱线模拟名称"
                  v-model="craftInfo.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label isMust">纱线直径：</div>
              <div class="info">
                <el-radio-group v-model="craftInfo.diameter"
                  size="small">
                  <el-radio-button :label="3">3格(0.9mm)</el-radio-button>
                  <el-radio-button :label="4">4格(1.2mm)</el-radio-button>
                  <el-radio-button :label="5">5格(1.5mm)</el-radio-button>
                  <el-radio-button :label="6">6格(1.8mm)</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="row">
              <div class="label isMust">需要捻?：</div>
              <div class="info middle">
                <el-radio-group v-model="craftInfo.twist_flag"
                  size="small">
                  <el-radio-button :label="1">需要</el-radio-button>
                  <el-radio-button :label="0">不需要</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="row">
              <div class="label">纱线捻粗细：</div>
              <div class="info">
                <el-radio-group v-model="craftInfo.twist_thickness"
                  size="small">
                  <el-radio-button :label="6">较粗</el-radio-button>
                  <el-radio-button :label="4">中等</el-radio-button>
                  <el-radio-button :label="2">较细</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="row">
              <div class="label">纱线捻数量：</div>
              <div class="info">
                <el-radio-group v-model="craftInfo.twist_number"
                  size="small">
                  <el-radio-button :label="10">密集</el-radio-button>
                  <el-radio-button :label="16">中等</el-radio-button>
                  <el-radio-button :label="22">宽松</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="row">
              <div class="label">纱线捻角度：</div>
              <div class="info">
                <el-radio-group v-model="craftInfo.twist_angle"
                  size="small">
                  <el-radio-button :label="1">角度1</el-radio-button>
                  <el-radio-button :label="2">角度2</el-radio-button>
                  <el-radio-button :label="3">角度3</el-radio-button>
                  <el-radio-button :label="4">角度4</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="row">
              <div class="label isMust">需要毛羽?：</div>
              <div class="info">
                <el-radio-group v-model="craftInfo.hairiness_flag"
                  size="small">
                  <el-radio-button :label="0">不需要</el-radio-button>
                  <el-radio-button :label="1">只需要边</el-radio-button>
                  <el-radio-button :label="2">只需要毛羽</el-radio-button>
                  <el-radio-button :label="3">只需要圈圈</el-radio-button>
                  <el-radio-button :label="4">需要圈圈和毛羽</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="row">
              <div class="label">毛羽长度：</div>
              <div class="info">
                <el-radio-group v-model="craftInfo.hairiness_length"
                  size="small">
                  <el-radio-button :label="1">长</el-radio-button>
                  <el-radio-button :label="2">中等</el-radio-button>
                  <el-radio-button :label="3">短</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="row">
              <div class="label">圈圈大小：</div>
              <div class="info">
                <el-radio-group v-model="craftInfo.circle_number"
                  size="small">
                  <el-radio-button :label="1">小</el-radio-button>
                  <el-radio-button :label="2">中</el-radio-button>
                  <el-radio-button :label="3">大</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="row">
              <div class="label isMust">密度：</div>
              <div class="info">
                <el-input placeholder="输入毛羽密度"
                  v-model="craftInfo.hairiness_density">
                  <template slot="append">%</template>
                </el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">模拟图：</div>
              <!-- 上下空5px,最多6根线，所以是10*10小格子 -->
              <canvas ref="myCanvas"
                width="730"
                height="60"
                style="border:1px solid #ccc;"></canvas>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false;resetCraft()">取消</div>
            <div class="btn backHoverOrange"
              @click="initCraftCanvas">模拟纱线</div>
            <div class="btn backHoverBlue"
              @click="saveCraft">保存</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '纱线原料'">
        <div class="main"
          style="width: 920px">
          <div class="titleCtn">
            <div class="text">{{ yarnInfo1.id ? '修改' : '新增' }}纱线</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row"
              v-if="!yarnInfo1.id">
              <div class="label">添加方式：</div>
              <div class="info"
                style="line-height: 34px">
                <el-radio-group v-model="yarnAddType">
                  <el-radio :label="true">名称添加</el-radio>
                  <el-radio :label="false">格式添加</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="row"
              v-if="yarnAddType">
              <div class="label">纱线名称：</div>
              <div class="info">
                <el-input placeholder="请输入纱线名称"
                  v-model="yarnInfo1.name"></el-input>
              </div>
            </div>
            <div class="row"
              v-if="!yarnAddType">
              <div class="label">格式添加：</div>
              <div class="info">
                <el-input placeholder="阈值"
                  v-model="layoutData.thresholdValues"
                  class="specialInput hasMargin"
                  @change="buildYarnList"></el-input>
                <el-input placeholder="取值"
                  v-model="layoutData.firstValue"
                  class="specialInput"
                  @change="buildYarnList"></el-input>
                -
                <el-input placeholder="取值"
                  v-model="layoutData.lastValue"
                  class="specialInput hasMargin"
                  @change="buildYarnList"></el-input>
                <el-select v-model="layoutData.unit"
                  class="specialInput hasMargin"
                  placeholder="支/cm/S/公分"
                  @change="buildYarnList">
                  <el-option v-for="item in layoutData.unitArr"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <el-input placeholder="纱线名称"
                  v-model="layoutData.yarnName"
                  class="specialInput hasMargin"
                  @change="buildYarnList"></el-input>
                <el-input placeholder="#"
                  v-model="layoutData.colorCodeUnit"
                  class="specialInput hasMargin"
                  @change="buildYarnList"></el-input>
                <el-input placeholder="色号"
                  v-model="layoutData.firstColorCode"
                  class="specialInput"
                  @change="buildYarnList"></el-input>
                -
                <el-input placeholder="色号"
                  v-model="layoutData.lastColorCode"
                  class="specialInput"
                  @change="buildYarnList"></el-input>
              </div>
            </div>
            <div class="row"
              v-if="!yarnAddType">
              <span class="label">名称预览：</span>
              <div class="info tagCtn">
                <span class="yarnNameTag"
                  v-for="(itemYarn, indexYarn) in layoutData.yarnNameList"
                  :key="indexYarn">
                  <span class="name">{{ itemYarn }}</span>
                  <span class="el-icon-close icon"
                    @click="$deleteItem(layoutData.yarnNameList, indexYarn)"></span>
                </span>
              </div>
            </div>
            <div class="row">
              <div class="label">选择类型：</div>
              <div class="info tagCtn">
                <span class="yarnNameTag"
                  :class="{ active: item.check, unactive: !item.check }"
                  v-for="(item, index) in yarnTypeList1"
                  :key="item.id"
                  @click="
                    item.check = !item.check
                    $forceUpdate()
                  ">
                  <span class="name">{{ item.name }}</span>
                  <span class="el-icon-close icon"
                    @click.stop="deleteYarnType(item.id, index, 1)"></span>
                </span>
                <span class="elCtn"
                  v-show="yarnTypeFlag1">
                  <el-input placeholder="输入新增类型"
                    v-model="yarnTypeInfo1.name"></el-input>
                </span>
                <span class="yarnNameTag"
                  :class="yarnTypeFlag1 ? 'active' : 'addBtn'"
                  @click="yarnTypeFlag1 ? saveYarnType(1) : (yarnTypeFlag1 = true)">{{ yarnTypeFlag1 ? '保存类型' : '新增类型' }}
                  <i :class="yarnTypeFlag1 ? 'el-icon-document-checked' : 'el-icon-plus'"></i>
                </span>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in yarnInfo1.price_info"
              :key="index">
              <div class="label">报价信息{{index+1}}：</div>
              <div class="info">
                <el-cascader v-if="!item.client_name"
                  style="width:220px;margin-right:12px"
                  placeholder="请选择报价单位"
                  v-model="item.client_id_arr"
                  :options="yarnClientList"
                  filterable
                  :show-all-levels="false"
                  @change="(ev) => {item.client_id = ev[2]}"></el-cascader>
                <div class="blue"
                  v-if="item.client_name"
                  style="width:220px;margin-right:12px;display:inline-block">{{item.client_name}}
                  <sapn class="hoverOrange"
                    style="cursor:pointer"
                    @click="item.client_name=''">重选</sapn>
                </div>
                <el-input placeholder="输入报价金额"
                  v-model="item.price"
                  style="width:220px;margin-right:12px"
                  @input="$forceUpdate()">
                  <template slot="append">元/kg</template>
                </el-input>
                <el-input style="width:250px"
                  placeholder="备注信息"
                  v-model="item.desc"
                  @input="$forceUpdate()">
                </el-input>
                <div v-if="index===0"
                  class="info_btn hoverBlue"
                  @click="$addItem(yarnInfo1.price_info,{price:'',client_id:'',client_id_arr:[],desc:''});$forceUpdate()">添加</div>
                <div v-else
                  class="info_btn hoverRed"
                  @click="$deleteItem(yarnInfo1.price_info,index);$forceUpdate()">删除</div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveYarn(1)">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '面料原料'">
        <div class="main"
          style="width: 920px">
          <div class="titleCtn">
            <div class="text">{{ yarnInfo2.id ? '修改' : '新增' }}面料</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">面料名称：</div>
              <div class="info">
                <el-input placeholder="请输入面料名称"
                  v-model="yarnInfo2.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">选择类型：</div>
              <div class="info tagCtn">
                <span class="yarnNameTag"
                  :class="{ active: item.check, unactive: !item.check }"
                  v-for="(item, index) in yarnTypeList2"
                  :key="item.id"
                  @click="
                    item.check = !item.check
                    $forceUpdate()
                  ">
                  <span class="name">{{ item.name }}</span>
                  <span class="el-icon-close icon"
                    @click.stop="deleteYarnType(item.id, index, 2)"></span>
                </span>
                <span class="elCtn"
                  v-show="yarnTypeFlag2">
                  <el-input placeholder="输入新增类型"
                    v-model="yarnTypeInfo2.name"></el-input>
                </span>
                <span class="yarnNameTag"
                  :class="yarnTypeFlag2 ? 'active' : 'addBtn'"
                  @click="yarnTypeFlag2 ? saveYarnType(2) : (yarnTypeFlag2 = true)">{{ yarnTypeFlag2 ? '保存类型' : '新增类型' }}
                  <i :class="yarnTypeFlag2 ? 'el-icon-document-checked' : 'el-icon-plus'"></i>
                </span>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in yarnInfo2.price_info"
              :key="index">
              <div class="label">报价信息{{index+1}}：</div>
              <div class="info">
                <el-cascader v-if="!item.client_name"
                  style="width:220px;margin-right:12px"
                  placeholder="请选择报价单位"
                  v-model="item.client_id_arr"
                  :options="mianliaoClientList"
                  filterable
                  @change="(ev) => {item.client_id = ev[2]}"
                  :show-all-levels="false"></el-cascader>
                <div class="blue"
                  v-if="item.client_name"
                  style="width:220px;margin-right:12px;display:inline-block">{{item.client_name}}
                  <sapn class="hoverOrange"
                    style="cursor:pointer"
                    @click="item.client_name=''">重选</sapn>
                </div>
                <el-input placeholder="输入报价金额"
                  v-model="item.price"
                  style="width:220px;margin-right:12px"
                  @input="$forceUpdate()">
                  <template slot="append">元/kg</template>
                </el-input>
                <el-input style="width:250px"
                  placeholder="备注信息"
                  v-model="item.desc"
                  @input="$forceUpdate()">
                </el-input>
                <div v-if="index===0"
                  class="info_btn hoverBlue"
                  @click="$addItem(yarnInfo2.price_info,{price:'',client_id:'',client_id_arr:[],desc:''});$forceUpdate()">添加</div>
                <div v-else
                  class="info_btn hoverRed"
                  @click="$deleteItem(yarnInfo2.price_info,index);$forceUpdate()">删除</div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveYarn(2)">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '毛料原料'">
        <div class="main"
          style="width: 920px">
          <div class="titleCtn">
            <div class="text">新增毛料</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">毛料名称：</div>
              <div class="info">
                <el-input placeholder="请输入毛料名称"
                  v-model="yarnInfo3.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">选择类型：</div>
              <div class="info tagCtn">
                <span class="yarnNameTag"
                  :class="{ active: item.check, unactive: !item.check }"
                  v-for="(item, index) in yarnTypeList3"
                  :key="item.id"
                  @click="
                    item.check = !item.check
                    $forceUpdate()
                  ">
                  <span class="name">{{ item.name }}</span>
                  <span class="el-icon-close icon"
                    @click.stop="deleteYarnType(item.id, index, 3)"></span>
                </span>
                <span class="elCtn"
                  v-show="yarnTypeFlag3">
                  <el-input placeholder="输入新增类型"
                    v-model="yarnTypeInfo3.name"></el-input>
                </span>
                <span class="yarnNameTag"
                  :class="yarnTypeFlag3 ? 'active' : 'addBtn'"
                  @click="yarnTypeFlag3 ? saveYarnType(3) : (yarnTypeFlag3 = true)">{{ yarnTypeFlag3 ? '保存类型' : '新增类型' }}
                  <i :class="yarnTypeFlag3 ? 'el-icon-document-checked' : 'el-icon-plus'"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveYarn(3)">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '装饰辅料'">
        <div class="main"
          style="width:920px">
          <div class="titleCtn">
            <div class="text">新增辅料</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">辅料名称：</div>
              <div class="info">
                <el-input placeholder="请输入辅料名称"
                  v-model="decorateMaterialInfo.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">计量单位：</div>
              <div class="info">
                <el-input placeholder="请输入计量单位"
                  v-model="decorateMaterialInfo.unit"></el-input>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in decorateMaterialInfo.price_info"
              :key="index">
              <div class="label">报价信息{{index+1}}：</div>
              <div class="info">
                <el-cascader v-if="!item.client_name"
                  style="width:220px;margin-right:12px"
                  placeholder="请选择报价单位"
                  v-model="item.client_id_arr"
                  :options="decorateMaterialClientList"
                  filterable
                  @change="(ev) => {item.client_id = ev[2]}"
                  :show-all-levels="false"></el-cascader>
                <div class="blue"
                  v-if="item.client_name"
                  style="width:220px;margin-right:12px;display:inline-block">{{item.client_name}}
                  <sapn class="hoverOrange"
                    style="cursor:pointer"
                    @click="item.client_name=''">重选</sapn>
                </div>
                <el-input placeholder="输入报价金额"
                  v-model="item.price"
                  style="width:220px;margin-right:12px"
                  @input="$forceUpdate()">
                  <template slot="append">元/kg</template>
                </el-input>
                <el-input style="width:250px"
                  placeholder="备注信息"
                  v-model="item.desc"
                  @input="$forceUpdate()">
                </el-input>
                <div v-if="index===0"
                  class="info_btn hoverBlue"
                  @click="$addItem(decorateMaterialInfo.price_info,{price:'',client_id:'',client_id_arr:[],desc:''});$forceUpdate()">添加</div>
                <div v-else
                  class="info_btn hoverRed"
                  @click="$deleteItem(decorateMaterialInfo.price_info,index);$forceUpdate()">删除</div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveDecorateMaterial">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '包装辅料'">
        <div class="main"
          style="width:920px">
          <div class="titleCtn">
            <div class="text">新增辅料</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">辅料名称：</div>
              <div class="info">
                <el-input placeholder="请输入辅料名称"
                  v-model="packMaterialInfo.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">计量单位：</div>
              <div class="info">
                <el-input placeholder="请输入计量单位"
                  v-model="packMaterialInfo.unit"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">计价方式：</div>
              <div class="info"
                style="line-height: 34px">
                <el-radio-group v-model="packMaterialInfo.calc_type">
                  <el-radio label="1">纸箱:面积</el-radio>
                  <el-radio label="2">胶袋:面积</el-radio>
                  <el-radio label="3">其他</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in packMaterialInfo.price_info"
              :key="index">
              <div class="label">报价信息{{index+1}}：</div>
              <div class="info">
                <el-cascader v-if="!item.client_name"
                  style="width:220px;margin-right:12px"
                  placeholder="请选择报价单位"
                  v-model="item.client_id_arr"
                  :options="packMaterialClientList"
                  filterable
                  :show-all-levels="false"
                  @change="(ev) => {item.client_id = ev[2]}"></el-cascader>
                <div class="blue"
                  v-if="item.client_name"
                  style="width:220px;margin-right:12px;display:inline-block">{{item.client_name}}
                  <sapn class="hoverOrange"
                    style="cursor:pointer"
                    @click="item.client_name=''">重选</sapn>
                </div>
                <el-input placeholder="输入报价金额"
                  v-model="item.price"
                  style="width:220px;margin-right:12px"
                  @input="$forceUpdate()">
                  <template slot="append">元/kg</template>
                </el-input>
                <el-input style="width:250px"
                  placeholder="备注信息"
                  v-model="item.desc"
                  @input="$forceUpdate()">
                </el-input>
                <div v-if="index===0"
                  class="info_btn hoverBlue"
                  @click="$addItem(packMaterialInfo.price_info,{price:'',client_id:'',client_id_arr:[],desc:''});$forceUpdate()">添加</div>
                <div v-else
                  class="info_btn hoverRed"
                  @click="$deleteItem(packMaterialInfo.price_info,index);$forceUpdate()">删除</div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="savePackMaterial">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '纱线报价'">
        <div class="main"
          style="width: 1000px">
          <div class="titleCtn">
            <div class="text">纱线报价</div>
            <div class="closeCtn"
              @click="
                showPopup = false
                yarnPriceUpdate = false
                resetYarnPrice()
              ">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">报价单位：</div>
              <div class="info">
                <span class="blue"
                  style="line-height: 32px"
                  v-if="yarnPriceUpdate">{{ yarnPrice.client_name }}</span>
                <el-cascader v-else
                  placeholder="请选择报价单位"
                  v-model="yarnPrice.client_id_arr"
                  :options="yarnClientList"
                  filterable
                  @change="
                    (ev) => {
                      yarnPrice.client_id = ev[2]
                    }
                  "></el-cascader>
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">纱线名称</div>
                  <div class="tcol"
                    style="flex: 0.5; flex-direction: row; align-items: center; justify-content: flex-start">
                    属性
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一属性"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        style="width: 16px; height: 16px"
                        aria-hidden="true"
                        @click="$copyInfo(yarnPrice.info_data, ['attribute'])">
                        <use xlink:href="#icon-tongbushuju1"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="tcol"
                    style="flex: 0.5; flex-direction: row; align-items: center; justify-content: flex-start">
                    颜色
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一颜色"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        style="width: 16px; height: 16px"
                        aria-hidden="true"
                        @click="$copyInfo(yarnPrice.info_data, ['material_color'])">
                        <use xlink:href="#icon-tongbushuju1"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="tcol"
                    style="flex: 0.8; flex-direction: row; align-items: center; justify-content: flex-start">
                    报价
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一报价"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        style="width: 16px; height: 16px"
                        aria-hidden="true"
                        @click="$copyInfo(yarnPrice.info_data, ['price'])">
                        <use xlink:href="#icon-tongbushuju1"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="tcol">其它备注</div>
                  <div class="tcol"
                    style="flex: 0.5">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item, index) in yarnPrice.info_data"
                  :key="index">
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="选择纱线"
                        v-model="item.material_id"
                        filterable>
                        <el-option v-for="item in yarnList1"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="tcol"
                    style="flex: 0.5">
                    <div class="elCtn">
                      <el-select placeholder="属性"
                        v-model="item.attribute">
                        <el-option v-for="item in yarnAttributeArr"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="tcol"
                    style="flex: 0.5">
                    <div class="elCtn">
                      <el-autocomplete class="inline-input"
                        v-model="item.material_color"
                        :fetch-suggestions="searchColor"
                        placeholder="物料颜色"></el-autocomplete>
                    </div>
                  </div>
                  <div class="tcol"
                    style="flex: 0.8">
                    <div class="elCtn">
                      <el-input :ref="'price-' + index"
                        v-model="item.price"
                        placeholder="单价"
                        @keydown.native="$focusByKeydown($event, 'price', [index], yarnPrice, ['info_data'])">
                        <template slot="append">元/kg</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input v-model="item.desc"
                        placeholder="备注"> </el-input>
                    </div>
                  </div>
                  <div class="tcol oprCtn"
                    style="flex: 0.5">
                    <div class="opr hoverBlue"
                      v-if="index === 0"
                      @click="
                        $addItem(yarnPrice.info_data, {
                          id: '',
                          material_id: '',
                          material_arr: [],
                          material_color: '',
                          attribute: '',
                          price: '',
                          desc: ''
                        })
                      ">
                      添加
                    </div>
                    <div class="opr hoverRed"
                      v-if="index > 0"
                      @click="$deleteItem(yarnPrice.info_data, index)">
                      删除
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="
                showPopup = false
                yarnPriceUpdate = false
              ">
              取消
            </div>
            <div class="btn"
              :class="yarnPriceUpdate ? 'backHoverOrange' : 'backHoverBlue'"
              @click="saveYarnPrice">
              {{ yarnPriceUpdate ? '修改' : '确认' }}
            </div>
          </div>
        </div>
      </template>
      <template v-if="cName === '面料报价'">
        <div class="main"
          style="width: 1000px">
          <div class="titleCtn">
            <div class="text">面料报价</div>
            <div class="closeCtn"
              @click="
                showPopup = false
                yarnPriceUpdate = false
                resetYarnPrice()
              ">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">报价单位：</div>
              <div class="info">
                <span class="blue"
                  style="line-height: 32px"
                  v-if="mianliaoPriceUpdate">{{
                  mianliaoPrice.client_name
                }}</span>
                <el-cascader v-else
                  placeholder="请选择报价单位"
                  v-model="mianliaoPrice.client_id_arr"
                  :options="mianliaoClientList"
                  filterable
                  @change="
                    (ev) => {
                      mianliaoPrice.client_id = ev[2]
                    }
                  "></el-cascader>
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">面料名称</div>
                  <div class="tcol">
                    颜色
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一颜色"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        style="width: 16px; height: 16px"
                        aria-hidden="true"
                        @click="$copyInfo(mianliaoPrice.info_data, ['material_color'])">
                        <use xlink:href="#icon-tongbushuju1"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="tcol">
                    报价
                    <el-tooltip class="item"
                      effect="dark"
                      content="统一颜色"
                      placement="top">
                      <svg class="iconFont copyIcon hoverBlue"
                        style="width: 16px; height: 16px"
                        aria-hidden="true"
                        @click="$copyInfo(mianliaoPrice.info_data, ['price'])">
                        <use xlink:href="#icon-tongbushuju1"></use>
                      </svg>
                    </el-tooltip>
                  </div>
                  <div class="tcol">其它备注</div>
                  <div class="tcol">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item, index) in mianliaoPrice.info_data"
                  :key="index">
                  <div class="tcol">
                    <div class="elCtn">
                      <el-select placeholder="选择面料"
                        v-model="item.material_id">
                        <el-option v-for="item in yarnList2"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-autocomplete class="inline-input"
                        v-model="item.material_color"
                        :fetch-suggestions="searchColor"
                        placeholder="物料颜色"></el-autocomplete>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input :ref="'price-' + index"
                        v-model="item.price"
                        placeholder="单价"
                        @keydown.native="$focusByKeydown($event, 'price', [index], mianliaoPrice, ['info_data'])">
                        <template slot="append">元</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input v-model="item.desc"
                        placeholder="备注"> </el-input>
                    </div>
                  </div>
                  <div class="tcol oprCtn">
                    <div class="opr hoverBlue"
                      v-if="index === 0"
                      @click="
                        $addItem(mianliaoPrice.info_data, {
                          id: '',
                          material_id: '',
                          material_arr: [],
                          material_color: '',
                          attribute: '',
                          price: '',
                          desc: ''
                        })
                      ">
                      添加
                    </div>
                    <div class="opr hoverRed"
                      v-if="index > 0"
                      @click="$deleteItem(mianliaoPrice.info_data, index)">
                      删除
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="
                showPopup = false
                mianliaoPriceUpdate = false
              ">
              取消
            </div>
            <div class="btn"
              :class="mianliaoPriceUpdate ? 'backHoverOrange' : 'backHoverBlue'"
              @click="saveMianliaoPrice">
              {{ mianliaoPriceUpdate ? '修改' : '确认' }}
            </div>
          </div>
        </div>
      </template>
      <template v-if="cName === '负责小组/人'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增小组/人</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">小组/人：</div>
              <div class="info">
                <el-input placeholder="请输入小组/人"
                  v-model="groupInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup = false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveGroup">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '系统账户管理'">
        <div class="main"
          style="width: 1000px">
          <div class="titleCtn">
            <div class="text">{{ userUpdate ? '修改' : '新增' }}用户</div>
            <div class="closeCtn"
              @click="
                showPopup = false
                resetUser()
              ">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn navCtn">
            <div class="navFather">
              <div class="nav"
                :class="{ active: userNav === '基本信息' }"
                @click="userNav = '基本信息'">基本信息</div>
              <div class="nav"
                :class="{ active: userNav === '细分权限' }"
                @click="userNav = '细分权限'">细分权限</div>
              <div class="nav"
                :class="{ active: userNav === '其他权限' }"
                @click="userNav = '其他权限'">其他权限</div>
            </div>
            <template v-if="userNav === '基本信息'">
              <div class="editCtn">
                <div class="row">
                  <div class="label">姓名：</div>
                  <div class="info">
                    <el-input placeholder="请输入姓名"
                      v-model="userInfo.name"></el-input>
                  </div>
                </div>
                <div class="row">
                  <div class="label">手机号：</div>
                  <div class="info">
                    <el-input placeholder="请输入手机号"
                      v-model="userInfo.phone"
                      :disabled="userUpdate"> </el-input>
                  </div>
                </div>
                <div class="row"
                  v-show="!userUpdate">
                  <div class="label">验证码：</div>
                  <div class="info">
                    <el-input placeholder="请输入验证码"
                      v-model="userInfo.sms_code">
                      <template slot="append">
                        <span style="cursor: pointer"
                          @click="getSmsCode">{{
                          Number(smsIndex) ? Number(smsIndex) + '秒后重新发送' : smsIndex
                        }}</span>
                      </template>
                    </el-input>
                  </div>
                </div>
                <div class="row">
                  <div class="label">小组：</div>
                  <div class="info">
                    <el-select placeholder="请选择小组"
                      v-model="userInfo.group_id">
                      <el-option v-for="item in groupInfoList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="row">
                  <div class="label">岗位：</div>
                  <div class="info">
                    <el-input placeholder="请输入岗位"
                      v-model="userInfo.station"></el-input>
                  </div>
                </div>
                <div class="row">
                  <div class="label">权限：</div>
                  <div class="info checkBoxCtn">
                    <div class="checkbox"
                      v-for="item in systemModuleArr"
                      :key="item.id">
                      <el-checkbox v-model="item.check"
                        @change="getModuleChild2($event, item.id, item.detail)">{{
                        item.name
                      }}</el-checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="userNav === '细分权限'">
              <div class="navSon">
                <div v-for="item in systemModuleArr"
                  :key="item.id"
                  @click="getModuleChild(item.name, item.detail)">
                  <div class="nav"
                    v-if="item.check"
                    :class="{ active: userNavSon === item.name }">
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <div class="editCtn">
                <div class="row">
                  <div>{{ userNavSon }}</div>
                  <div class="btnC">
                    <div class="btn backHoverBlue"
                      style="margin-left: 20px"
                      v-if="userNavSon"
                      @click="getModuleChildCheckAll(userNavSon)">勾选全部选项</div>
                  </div>
                </div>
                <div class="row"
                  style="height: auto;margin-top:0">
                  <div class="info checkBoxCtn">
                    <div class="checkbox"
                      v-for="item in systemModuleChild"
                      :key="item.id">
                      <el-checkbox v-model="item.check"
                        @change="getModuleChildCheck($event, item.id)">{{
                        item.name
                      }}</el-checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="userNav === '其他权限'">
              <div class="editCtn">
                <div class="row">
                  <div class="label"
                    style="width: 7em">
                    <el-tooltip content="是否只能查看/搜索个人创建的订单、样单、报价单等,不能查看其他人创建的单据。">
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                    查看权限：
                  </div>
                  <div class="info"
                    style="line-height: 32px">
                    <el-radio v-model="userInfo.only_search_self"
                      :label="1">仅能查看本人</el-radio>
                    <el-radio v-model="userInfo.only_search_self"
                      :label="2">查看所有</el-radio>
                  </div>
                </div>
                <div class="row">
                  <div class="label"
                    style="width: 7em">
                    <el-tooltip content="管理员拥有以下权限：所有单据审核、修改、删除权限；所有订单、样单详细信息查看权限。">
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                    管理权限：
                  </div>
                  <div class="info"
                    style="line-height: 32px">
                    <el-radio v-model="userInfo.has_check"
                      :label="1">管理员</el-radio>
                    <el-radio v-model="userInfo.has_check"
                      :label="2">普通用户</el-radio>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="
                showPopup = false
                resetUser()
              ">
              取消
            </div>
            <div class="btn backHoverBlue"
              @click="userUpdate ? updateUser() : saveUser()">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName === '报价模板'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增报价模板</div>
            <div class="closeCtn"
              @click="
                showPopup = false
                quotedPriceProductUpdate = false
                resetQuotedPriceProduct()
              ">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="editCtn">
              <div class="row">
                <!-- <div class="col">
                  <div class="label">
                    <span class="text">绑定品类</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择产品品类"
                      v-model="quotedPriceProduct.category_id">
                      <el-option v-for="item in categoryList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div> -->
                <div class="col">
                  <div class="label">
                    <span class="text">模板标题</span>
                  </div>
                  <div class="info elCtn">
                    <el-input placeholder="请输入模板标题"
                      v-model="quotedPriceProduct.title"></el-input>
                  </div>
                </div>
              </div>
              <div class="row"
                v-for="(itemWeave, indexWeave) in quotedPriceProduct.weave_data"
                :key="'Weave' + indexWeave">
                <div class="col">
                  <div class="label"
                    v-if="indexWeave === 0">
                    <span class="text">织造明细</span>
                  </div>
                  <div class="info elCtn">
                    <el-select v-model="itemWeave.name"
                      placeholder="请选择织造明细"
                      clearable>
                      <el-option v-for="item in weaveList"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexWeave === 0">
                    <span class="text">小计</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemWeave.total_price"
                      placeholder="小计"
                      :disabled="!itemWeave.name">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexWeave === 0"
                  @click="
                    $addItem(quotedPriceProduct.weave_data, {
                      number: '',
                      name: '',
                      total_price: ''
                    })
                  ">
                  添加
                </div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(quotedPriceProduct.weave_data, indexWeave)">
                  删除
                </div>
              </div>
              <div class="row"
                v-for="(itemHalfProcess, indexHalfProcess) in quotedPriceProduct.semi_product_data"
                :key="'HalfProcess' + indexHalfProcess">
                <div class="col">
                  <div class="label"
                    v-if="indexHalfProcess === 0">
                    <span class="text">半成品加工</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader v-model="itemHalfProcess.name"
                      placeholder="请选择加工工序"
                      :show-all-levels="false"
                      :props="{emitPath:false}"
                      clearable
                      :options="halfProcessStore">
                    </el-cascader>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexHalfProcess === 0">
                    <span class="text">小计</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemHalfProcess.total_price"
                      placeholder="小计"
                      :disabled="!itemHalfProcess.name">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexHalfProcess === 0"
                  @click="
                    $addItem(quotedPriceProduct.semi_product_data, {
                      desc: '',
                      name: '',
                      total_price: ''
                    })
                  ">
                  添加
                </div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(quotedPriceProduct.semi_product_data, indexHalfProcess)">
                  删除
                </div>
              </div>
              <div class="row"
                v-for="(itemFinishedProcess, indexFinishedProcess) in quotedPriceProduct.production_data"
                :key="'FinishedProcess' + indexFinishedProcess">
                <div class="col">
                  <div class="label"
                    v-if="indexFinishedProcess === 0">
                    <span class="text">成品加工</span>
                  </div>
                  <div class="info elCtn">
                    <el-cascader v-model="itemFinishedProcess.name"
                      placeholder="请选择加工工序"
                      :show-all-levels="false"
                      :props="{emitPath:false}"
                      clearable
                      :options="finishedList">
                    </el-cascader>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexFinishedProcess === 0">
                    <span class="text">小计</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemFinishedProcess.total_price"
                      placeholder="小计"
                      :disabled="!itemFinishedProcess.name">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexFinishedProcess === 0"
                  @click="
                    $addItem(quotedPriceProduct.production_data, {
                      desc: '',
                      name: '',
                      total_price: ''
                    })
                  ">
                  添加
                </div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(quotedPriceProduct.production_data, indexFinishedProcess)">
                  删除
                </div>
              </div>
              <div class="row"
                v-for="(itemPackMaterial, indexPackMaterial) in quotedPriceProduct.pack_material_data"
                :key="'PackMaterial' + indexPackMaterial">
                <div class="col">
                  <div class="label"
                    v-if="indexPackMaterial === 0">
                    <span class="text">包装辅料</span>
                  </div>
                  <div class="info elCtn">
                    <el-select v-model="itemPackMaterial.material_id"
                      placeholder="请选择包装辅料"
                      clearable>
                      <el-option v-for="item in packMaterialStore"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexPackMaterial === 0">
                    <span class="text">小计</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemPackMaterial.total_price"
                      placeholder="小计"
                      :disabled="!itemPackMaterial.material_id">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexPackMaterial === 0"
                  @click="
                    $addItem(quotedPriceProduct.pack_material_data, {
                      desc: '',
                      name: '',
                      total_price: ''
                    })
                  ">
                  添加
                </div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(quotedPriceProduct.pack_material_data, indexPackMaterial)">
                  删除
                </div>
              </div>
              <div class="row"
                v-for="(itemOther, indexOther) in quotedPriceProduct.other_fee_data"
                :key="'Other' + indexOther">
                <div class="col">
                  <div class="label"
                    v-if="indexOther === 0">
                    <span class="text">其他费用</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemOther.name"
                      placeholder="其他费用"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexOther === 0">
                    <span class="text">小计</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemOther.total_price"
                      placeholder="小计"
                      :disabled="!itemOther.name">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexOther === 0"
                  @click="
                    $addItem(quotedPriceProduct.other_fee_data, {
                      desc: '',
                      name: '',
                      total_price: ''
                    })
                  ">
                  添加
                </div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(quotedPriceProduct.other_fee_data, indexOther)">
                  删除
                </div>
              </div>
              <div class="row"
                v-for="(itemNoPro, indexNoPro) in quotedPriceProduct.no_production_fee_data"
                :key="'NoPro' + indexNoPro">
                <div class="col">
                  <div class="label"
                    v-if="indexNoPro === 0">
                    <span class="text">非生产型费用</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemNoPro.name"
                      placeholder="非生产型费用"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexNoPro === 0">
                    <span class="text">小计</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemNoPro.total_price"
                      placeholder="小计"
                      :disabled="!itemNoPro.name">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexNoPro === 0"
                  @click="
                    $addItem(quotedPriceProduct.no_production_fee_data, {
                      desc: '',
                      name: '',
                      total_price: ''
                    })
                  ">
                  添加
                </div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(quotedPriceProduct.no_production_fee_data, indexNoPro)">
                  删除
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">运输费用</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="quotedPriceProduct.transport_fee"
                      placeholder="运输费用">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="
                showPopup = false
                quotedPriceProductUpdate = false
                resetQuotedPriceProduct()
              ">
              取消
            </div>
            <div class="btn"
              :class="quotedPriceProductUpdate ? 'backHoverOrange' : 'backHoverBlue'"
              @click="saveQuotedPriceProduct">
              {{ quotedPriceProductUpdate ? '修改' : '确认' }}
            </div>
          </div>
        </div>
      </template>
      <template v-if="cName === '报价说明'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增报价说明</div>
            <div class="closeCtn"
              @click="showPopup = false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="editCtn">
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">品类</span>
                  </div>
                  <div class="info elCtn">
                    <el-select placeholder="请选择产品品类"
                      v-model="quotedPriceCategoryId"
                      disabled>
                      <el-option v-for="item in categoryList"
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
                    <span class="text">文字说明</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="quotedPriceDesc.desc"
                      placeholder="请输入报价说明"></el-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">
                    <span class="text">图片说明</span>
                  </div>
                  <div class="imgCtn">
                    <el-upload class="avatar-uploader"
                      drag
                      action="https://upload.qiniup.com/"
                      :show-file-list="false"
                      :on-success="uploadQuotedSuccess"
                      :before-upload="beforeUpload"
                      :data="postData"
                      :file-list="[quotedPriceDesc.type]"
                      ref="quotedLogo">
                      <img v-if="quotedPriceDesc.type"
                        :src="quotedPriceDesc.type"
                        class="logo-img"
                        style="width: 100%; height: 100%" />
                      <i v-else
                        class="el-icon-plus logo-icon"></i>
                    </el-upload>
                    <div class="prompt">点击或拖拽图片至上传框,只能上传jpg/png文件，且不超过6MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="
                showPopup = false
                quotedPriceProductUpdate = false
              ">
              取消
            </div>
            <div class="btn backHoverBlue"
              @click="saveQuotedPriceDesc">确认</div>
          </div>
        </div>
      </template>
    </div>
    <!-- 选择物料类型上传excel -->
    <div class="popup"
      v-show="showYarn">
      <div class="main">
        <div class="titleCtn">
          <div class="text">导入物料</div>
          <div class="closeCtn"
            @click="showYarn = false">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">选择类型：</div>
            <div class="info tagCtn">
              <span class="yarnNameTag"
                :class="{ active: item.check, unactive: !item.check }"
                v-for="(item, index) in cName === '纱线原料' ? yarnTypeList1 : yarnTypeList2"
                :key="item.id"
                @click="
                  item.check = !item.check
                  $forceUpdate()
                ">
                <span class="name">{{ item.name }}</span>
                <span class="el-icon-close icon"
                  @click.stop="deleteYarnType(item.id, index, 1)"></span>
              </span>
              <span class="elCtn"
                v-show="yarnTypeFlag1">
                <el-input placeholder="输入新增类型"
                  v-model="yarnTypeInfo1.name"></el-input>
              </span>
              <span class="yarnNameTag"
                :class="yarnTypeFlag1 ? 'active' : 'addBtn'"
                @click="yarnTypeFlag1 ? saveYarnType(1) : (yarnTypeFlag1 = true)">{{ yarnTypeFlag1 ? '保存类型' : '新增类型' }}
                <i :class="yarnTypeFlag1 ? 'el-icon-document-checked' : 'el-icon-plus'"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btn borderBtn"
            @click="showYarn = false">取消</div>
          <div class="btn backHoverBlue"
            @click="importExcelData('yarn1')">确定</div>
        </div>
      </div>
    </div>
    <!-- 删除尺码 -->
    <div class="popup"
      v-show="deleteSizeFLag">
      <div class="main">
        <div class="titleCtn">
          <div class="text">新增成分</div>
          <div class="closeCtn"
            @click="deleteSizeFLag = false">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">选择尺码：</div>
            <div class="info">
              <el-select v-model="deleteSizeId"
                placeholder="请选择删除尺码">
                <el-option v-for="item in deleteSizeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btn borderBtn"
            @click="deleteSizeFLag = false">取消</div>
          <div class="btn backHoverBlue"
            @click="deleteSize">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CraftParameter } from '@/types/craft'
import {
  IngredientInfo,
  ColourInfo,
  SizeSetting,
  SizeModuleSetting,
  SizeInfo,
  StyleInfo,
  CategoryInfo
} from '@/types/productSetting'
import { OrderType } from '@/types/orderSetting'
import { ProcessInfo } from '@/types/processSetting'
import { SideInfo, MachineInfo, MethodsInfo, YarnColorInfo } from '@/types/craftSetting'
import { YarnInfo, YarnTypeInfo } from '@/types/yarnSetting'
import { ClientEN, BankEN } from '@/types/billDocumentSetting'
import { PackMaterialInfo, DecorateMaterialInfo } from '@/types/materialSetting'
import { GroupInfo } from '@/types/factoryInfoSetting'
import { UserInfo } from '@/types/user'
import { QuotedPriceProduct } from '@/types/quotedPrice'
import { yarnAttributeArr, systemModule } from '@/assets/js/dictionary'
interface YarnTypeInfoHasCheck extends YarnTypeInfo {
  check: boolean
}
// 纱线报价
interface YarnPrice {
  id: string | number
  client_id: string | number
  material_type: 1 | 2
  info_data: Array<{
    id?: string | number
    material_id: string | number
    material_arr?: number[]
    material_color: string
    attribute: string
    price: string | number
    desc: string
  }>
}
// 审核设置
interface CheckConfigInfo {
  doc_type: number
  data: {
    auto_pass: 1 | 2 // 是否自动通过 1是 2否
    has_condition: 1 | 2 // 是否根据条件判断 1是 2否
    user_id: Array<number>
    client_id: Array<number>
    number?: any
    not_allow_operate: 1 | 2 // 	是否限制后续操作 1是 2否
    not_allow_add_rel_doc: 1 | 2 // 是否限制添加关联单据 1是 2否
    not_allow_settle: 1 | 2 // 限制结算 1是 2否
  }
}
import {
  category,
  style,
  ingredient,
  colour,
  sizeModule,
  size,
  orderType,
  process,
  craftSetting,
  yarnColor,
  billDocumentSetting,
  yarnType,
  yarn,
  decorateMaterial,
  packMaterial,
  group,
  clientBind,
  user,
  quotedPrice,
  companyInfo,
  yarnPrice,
  checkConfig,
  craft,
  processType
} from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
    craftInfo: CraftParameter
    categoryInfo: CategoryInfo
    categoryList: CategoryInfo[]
    styleInfo: StyleInfo
    styleList: StyleInfo[]
    ingredientInfo: IngredientInfo
    ingredientList: IngredientInfo[]
    colourInfo: ColourInfo
    colourList: ColourInfo[]
    sizeInfo: SizeInfo
    deleteSizeArr: SizeInfo[]
    sizeList: SizeSetting[]
    sizeModuleList: SizeModuleSetting[]
    orderTypeInfo: OrderType
    orderTypeList: OrderType[]
    sampleOrderTypeInfo: OrderType
    sampleOrderTypeList: OrderType[]
    materialProcessInfo: ProcessInfo
    materialProcessList: ProcessInfo[]
    halfProcessInfo: ProcessInfo
    halfProcessList: ProcessInfo[]
    staffProcessInfo: ProcessInfo
    staffProcessList: ProcessInfo[]
    sideInfo: SideInfo
    sideList: SideInfo[]
    machineInfo: MachineInfo
    machineList: MachineInfo[]
    methodsInfo: MethodsInfo
    methodsList: MachineInfo[]
    yarnColorInfo: YarnColorInfo
    yarnColorList: YarnColorInfo[]
    clientEN: ClientEN
    bankEN: BankEN
    yarnInfo1: YarnInfo
    yarnTypeInfo1: YarnTypeInfo
    yarnTypeList1: YarnTypeInfoHasCheck[]
    yarnInfo2: YarnInfo
    yarnTypeInfo2: YarnTypeInfo
    yarnTypeList2: YarnTypeInfoHasCheck[]
    yarnInfo3: YarnInfo
    yarnTypeInfo3: YarnTypeInfo
    yarnTypeList3: YarnTypeInfoHasCheck[]
    packMaterialInfo: PackMaterialInfo
    packMaterialList: PackMaterialInfo[]
    decorateMaterialInfo: DecorateMaterialInfo
    decorateMaterialList: DecorateMaterialInfo[]
    groupInfo: GroupInfo
    groupInfoList: GroupInfo[]
    quotedPriceProduct: QuotedPriceProduct
    quotedPriceProductList: QuotedPriceProduct[]
    yarnPrice: YarnPrice
    yarnPriceList: YarnPrice[]
    mianliaoPrice: YarnPrice
    mianliaoPriceList: YarnPrice[]
    qrCodeUrl: String
  } {
    return {
      craftList: [],
      craftPage: 1,
      craftTotal: 1,
      craftInfo: {
        id: '',
        name: '',
        image_url: '',
        diameter: 4,
        twist_flag: 0,
        twist_thickness: 4, // 捻粗细：下拉框选择密不密
        twist_number: 10, // 捻数量：下拉框选择密不密
        twist_angle: 1, // 捻角度：下拉框选择
        hairiness_flag: 1, // 是否需要毛羽:0不需要，1.毛边 2.毛羽 3.圈圈
        hairiness_length: 2, // 毛羽长度，下拉框
        circle_number: 2,
        hairiness_density: 30 // 毛羽密度，百分比
      },
      yarnAttributeArr: yarnAttributeArr,
      qrCodeUrl: '',
      postData: { token: '' },
      onlyDelete: false,
      onlyDeleteProcess: false,
      onlyDeleteProcess2: false,
      yarnLoading: false,
      yarnKeyword1: '',
      yarnKeyword2: '',
      decorateMaterialKeyword: '',
      packMaterialKeyword: '',
      yarnPriceKeyword1: '',
      yarnPriceKeyword2: '',
      nav: {
        产品设置: ['品类', '款式', '成分', '配色组', '尺码', '尺寸模板'],
        订单设置: ['批次类型', '样单类型'],
        报价单设置: ['报价模板', '报价说明'],
        工序设置: ['半成品加工', '成品加工工序'],
        工艺单设置: ['边型', '机型', '组织法', '纱线颜色', '纱线模拟'],
        物料设置: ['纱线原料', '面料原料', '装饰辅料', '包装辅料', '纱线报价', '面料报价'],
        工厂信息设置: ['基本信息', '负责小组/人'],
        系统账户管理: ['系统账户管理'],
        通知和审核设置: [
          // '推送设置',
          '样品订单',
          '大货订单',
          '原料计划单',
          '原料采购单',
          '原料加工单',
          '原料调取单',
          '辅料采购单',
          '生产计划单',
          '包装采购单',
          '工资结算单',
          '发货单'
        ],
        // 打印设置: ['打印设置']
        单证设置: [
          '英文工厂信息',
          '英文银行信息',
          'HS编码设置',
          '常用公司设置',
          '常用城市设置',
          '常用品名设置',
          '常用付款方式'
        ]
      },
      pushCheckConfig: {
        allow_push_err_doc: 1,
        err_doc_push_user: [],
        push_status: 1,
        push_user: [
          {
            user_id: '',
            doc_type: []
          }
        ]
      },
      pushStatusArr: [
        {
          value: 1,
          label: '订单'
        },
        {
          value: 2,
          label: '物料订购单'
        },
        {
          value: 3,
          label: '物料加工单'
        },
        {
          value: 4,
          label: '生产计划单'
        },
        {
          value: 5,
          label: '报价单'
        },
        {
          value: 6,
          label: '原料出入库单'
        },
        {
          value: 7,
          label: '原料预订购单'
        },
        {
          value: 8,
          label: '产品出入库单'
        },
        {
          value: 9,
          label: '物料计划单'
        },
        {
          value: 10,
          label: '补纱单'
        },
        {
          value: 11,
          label: '包装采购单'
        },
        {
          value: 12,
          label: '扣款单'
        },
        {
          value: 13,
          label: '运输单'
        },
        {
          value: 14,
          label: '车间管理单'
        },
        {
          value: 15,
          label: '开票单'
        },
        {
          value: 16,
          label: '收款单'
        },
        {
          value: 17,
          label: '样单'
        },
        {
          value: 18,
          label: '辅料采购单'
        }
      ],
      sampleOrderCheckConfig: {
        doc_type: 17,
        data: {
          check_notice_condition: 1, // 1 不通知人工审核 2不通知自动通过 3 通知带条件复制
          user_id: [], // 自动审核创建人id数组
          client_id: [], // 自动审核下单公司id数组
          number: '',
          not_allow_operate: 2, // 是否限制后续操作 1是 2否
          not_allow_add_rel_doc: 2, // 是否限制添加关联单据 1是 2否
          not_allow_settle: 2, // 限制结算 1是 2否
          dispatch_notice_condition: 1, // 1提前三天通知 2逾期通知 3不通知复制
          notice_for_wechat: '2',
          check_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ]
        }
      },
      orderCheckConfig: {
        doc_type: 1,
        data: {
          check_notice_condition: 1, // 1 不通知人工审核 2不通知自动通过 3 通知带条件复制
          user_id: [], // 自动审核创建人id数组
          client_id: [], // 自动审核下单公司id数组
          number: '',
          not_allow_operate: 2, // 是否限制后续操作 1是 2否
          not_allow_add_rel_doc: 2, // 是否限制添加关联单据 1是 2否
          not_allow_settle: 2, // 限制结算 1是 2否
          dispatch_notice_condition: 1, // 1提前三天通知 2逾期通知 3不通知复制
          notice_for_wechat: '2',
          check_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ]
        }
      },
      materialPlanCheckConfig: {
        doc_type: 9,
        data: {
          update_notice_condition: 1,
          update_notice_for_wechat: '2',
          check_notice_condition: 2,
          check_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          user_id: [],
          order_type: '',
          total_order_number: '',
          total_material_number: '',
          not_allow_add_rel_doc: 2 // 是否限制添加关联单据 1是 2否
        }
      },
      materialOrderCheckConfig: {
        doc_type: 2,
        data: {
          update_notice_condition: 1,
          update_notice_for_wechat: '2',
          check_notice_condition: 2,
          check_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          beyond_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          beyond_notice_condition: 1,
          user_id: [],
          total_number: '',
          total_price: '',
          contrast_quote_extent: '',
          not_allow_operate: 2, // 	是否限制后续操作 1是 2否
          not_allow_settle: 2 // 限制结算 1是 2否
        }
      },
      materialProcessCheckConfig: {
        doc_type: 3,
        data: {
          check_notice_condition: 2,
          check_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          update_notice_condition: 1,
          update_notice_for_wechat: '2',
          user_id: [],
          total_number: '',
          total_price: '',
          by_process_price: 1,
          ranse: '',
          daosha: '',
          bingxian: '',
          pengsha: '',
          qiege: '',
          not_allow_settle: 2 // 限制结算 1是 2否
        }
      },
      materialStockCheckConfig: {
        doc_type: 6,
        data: {
          update_notice_condition: 1,
          update_notice_for_wechat: '2',
          check_notice_condition: 2,
          check_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          beyond_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          beyond_notice_condition: 1,
          user_id: [],
          total_number: '',
          total_price: ''
        }
      },
      accessoriesOrderCheckConfig: {
        doc_type: 18,
        data: {
          update_notice_condition: 1,
          update_notice_for_wechat: '2',
          check_notice_condition: 2,
          check_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          user_id: [],
          total_number: '',
          total_price: '',
          not_allow_settle: 2 // 限制结算 1是 2否
        }
      },
      productionPlanCheckConfig: {
        doc_type: 4,
        data: {
          beyond_price_notice_condition: 1,
          update_notice_condition: 1,
          update_notice_for_wechat: '2',
          check_notice_condition: 2,
          check_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          beyond_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          beyond_notice_condition: 1,
          user_id: [],
          total_number: '',
          total_price: '',
          contrast_quote_extent: [
            {
              process_name: '',
              min: '',
              max: ''
            }
          ],
          not_allow_settle: 2 // 限制结算 1是 2否
        }
      },
      packOrderCheckConfig: {
        doc_type: 11,
        data: {
          check_notice_condition: 2,
          check_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          user_id: [],
          total_number: '',
          total_price: '',
          contrast_quote_extent: '',
          not_allow_settle: 2 // 限制结算 1是 2否
        }
      },
      gongziCheckConfig: {
        doc_type: 14,
        data: {
          beyond_price_notice_condition: 1,
          check_notice_condition: 2,
          check_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          beyond_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          beyond_notice_condition: 1,
          user_id: [],
          total_number: '',
          total_price: '',
          contrast_quote_extent: '',
          not_allow_settle: 2 // 限制结算 1是 2否
        }
      },
      packOutCheckConfig: {
        doc_type: 13,
        data: {
          check_notice_condition: 2,
          check_notice_user: [
            {
              user_id: '',
              notice_for_wechat: '2'
            }
          ],
          user_id: [],
          total_number: '',
          total_price: '',
          contrast_quote_extent: '',
          not_allow_settle: 2 // 限制结算 1是 2否
        }
      },
      pName: '',
      cName: '',
      showPopup: false,
      showYarn: false,
      showUpdateProcess: false,
      categoryInfo: {
        id: '',
        name: '',
        code: '',
        unit: '',
        secondary_category: [
          {
            name: '',
            id: ''
          }
        ]
      },
      categoryList: [],
      categoryTotal: 1,
      categoryPage: 1,
      checkCategoryDelete: false,
      styleInfo: {
        id: null,
        name: ''
      },
      styleList: [],
      styleTotal: 1,
      stylePage: 1,
      ingredientList: [],
      ingredientTotal: 1,
      ingredientPage: 1,
      ingredientInfo: {
        id: null,
        name: ''
      },
      colourList: [],
      colourTotal: 1,
      colourPage: 1,
      colourInfo: {
        id: null,
        name: '',
        color_code: ''
      },
      sizeList: [],
      sizeTotal: 1,
      sizePage: 1,
      sizeInfo: {
        category_id: '',
        id: null,
        name: ''
      },
      deleteSizeFLag: false, // 删除尺码专用
      deleteSizeArr: [], // 删除尺码专用
      deleteSizeId: '', // 删除尺码专用
      sizeModuleList: [],
      sizeModuleTotal: 1,
      sizeModulePage: 1,
      sizeModuleUpdate: false,
      updateSizeModule: {
        name: '',
        content: [
          {
            name: '整体',
            value: ''
          },
          {
            name: '',
            value: ''
          }
        ]
      },
      orderTypeInfo: {
        order_type: 1,
        id: null,
        name: ''
      },
      orderTypeList: [],
      orderTypePage: 1,
      orderTypeTotal: 1,
      sampleOrderTypeInfo: {
        order_type: 2,
        id: null,
        name: ''
      },
      sampleOrderTypeList: [],
      sampleOrderTypePage: 1,
      sampleOrderTypeTotal: 1,
      materialProcessList: [],
      materialProcessInfo: {
        type: 1,
        process_desc: '',
        name: '',
        id: null
      },
      materialProcessTotal: 1,
      materialProcessPage: 1,
      halfProcessList: [],
      halfProcessInfo: {
        code: '',
        type: 2,
        name: '',
        process_desc: '',
        rel_tag: [],
        id: null
      },
      halfProcessTotal: 1,
      halfProcessPage: 1,
      isHalfUpdate: false,
      halfProcessTypeList: [],
      halfProcessTypeFlag: false,
      halfProcessTypeInfo: {
        name: '',
        id: '',
        type: 2
      },
      staffProcessList: [],
      processHalfDescList: [''],
      staffProcessInfo: {
        code: '',
        type: 3,
        name: '',
        process_desc: '',
        id: null,
        rel_tag: []
      },
      staffProcessTotal: 1,
      staffProcessPage: 1,
      staffProcessTypeList: [],
      staffProcessTypeFlag: false,
      staffProcessTypeInfo: {
        name: '',
        id: '',
        type: 3
      },
      isStaffProcessUpdate: false,
      processStaffDescList: [''],
      sideList: [],
      sideInfo: {
        id: null,
        name: ''
      },
      sideTotal: 1,
      sidePage: 1,
      machineList: [],
      machineInfo: {
        id: null,
        name: ''
      },
      machineTotal: 1,
      machinePage: 1,
      methodsList: [],
      methodsInfo: {
        id: null,
        name: ''
      },
      methodsTotal: 1,
      methodsPage: 1,
      yarnColorList: [],
      yarnColorInfo: {
        id: null,
        name: '',
        color_code: ''
      },
      yarnColorCode: '',
      yarnColorTotal: 1,
      yarnColorPage: 1,
      clientEN: {
        name: '',
        code: '',
        address: '',
        signature: '',
        tel: '',
        fax: '',
        special_seal: ''
      },
      bankEN: {
        name: '',
        address: '',
        code: '',
        beneficiary: '',
        account_no: ''
      },
      HSCodePage: 1,
      HSCodeTotal: 1,
      HSCodeList: [],
      searchHSCode: '',
      normalClient: {
        name: '',
        address: '',
        id: ''
      },
      normalClientPage: 1,
      normalClientTotal: 1,
      normalClientList: [],
      searchNormalClient: '',
      normalCity: {
        country: '',
        city: '',
        id: ''
      },
      normalCityPage: 1,
      normalCityTotal: 1,
      normalCityList: [],
      searchNormalCity: '',
      normalCategory: {
        id: '',
        name: '',
        english: ''
      },
      normalCategoryPage: 1,
      normalCategoryTotal: 1,
      normalCategoryList: [],
      searchNormalCategory: '',
      normalPay: {
        name: '',
        englist: '',
        id: ''
      },
      normalPayPage: 1,
      normalPayTotal: 1,
      normalPayList: [],
      searchNormalPay: '',
      yarnList1: [],
      yarnInfo1: {
        id: null,
        name: '',
        type: 1,
        yarn_rel_type: [],
        price_info: [
          {
            price: '',
            client_id: '',
            client_id_arr: [],
            desc: ''
          }
        ]
      },
      yarnTotal1: 1,
      yarnPage1: 1,
      yarnAddType: true,
      yarnTypeInfo1: {
        id: null,
        type: 1,
        name: ''
      },
      yarnTypeFlag1: false, // 用于控制是否添加新类型
      yarnTypeList1: [],
      layoutData: {
        thresholdValues: '',
        firstValue: '',
        lastValue: '',
        unit: '',
        unitArr: [{ name: '支' }, { name: 'cm' }, { name: 'S' }, { name: '公分' }],
        yarnName: '',
        colorCodeUnit: '',
        firstColorCode: '',
        lastColorCode: '',
        yarnNameList: []
      },
      // 面料和毛料理论上和纱线只有type的区别以及添加时候只能名称添加，不能花里胡哨添加
      // 所以复制粘贴一份数据，2是面料，3是毛料
      yarnList2: [],
      yarnInfo2: {
        id: null,
        name: '',
        type: 2,
        yarn_rel_type: [],
        price_info: [
          {
            price: '',
            client_id: '',
            client_id_arr: [],
            desc: ''
          }
        ]
      },
      yarnTotal2: 1,
      yarnPage2: 1,
      yarnTypeInfo2: {
        id: null,
        type: 2,
        name: ''
      },
      yarnTypeFlag2: false,
      yarnTypeList2: [],
      yarnList3: [],
      yarnInfo3: {
        id: null,
        name: '',
        type: 3,
        yarn_rel_type: [],
        price_info: [
          {
            price: '',
            client_id: '',
            client_id_arr: [],
            desc: ''
          }
        ]
      },
      yarnTotal3: 1,
      yarnPage3: 1,
      yarnTypeInfo3: {
        id: null,
        type: 3,
        name: ''
      },
      yarnTypeFlag3: false,
      yarnTypeList3: [],
      decorateMaterialInfo: {
        id: null,
        name: '',
        unit: '',
        price_info: [
          {
            price: '',
            client_id: '',
            client_id_arr: [],
            desc: ''
          }
        ]
      },
      decorateMaterialList: [],
      decorateMaterialTotal: 1,
      decorateMaterialPage: 1,
      packMaterialInfo: {
        id: null,
        name: '',
        calc_type: '1',
        unit: '',
        price_info: [
          {
            price: '',
            client_id: '',
            client_id_arr: [],
            desc: ''
          }
        ]
      },
      packMaterialList: [],
      packMaterialTotal: 1,
      packMaterialPage: 1,
      groupInfo: {
        id: null,
        name: ''
      },
      groupInfoList: [],
      groupTotal: 1,
      groupPage: 1,
      userNav: '基本信息',
      userNavSon: '',
      userInfo: {
        name: '',
        user_name: '',
        password: '',
        phone: '',
        only_search_self: 2,
        is_admin: 2, // 1：超管 2：普通用户
        module_info: [],
        has_check: 2,
        group_id: '',
        sms_code: '',
        station: '' // 岗位
      },
      systemModuleArr: systemModule,
      systemModuleChild: [],
      smsIndex: '发送验证码',
      userList: [],
      userTotal: 1,
      userPage: 1,
      userUpdate: false,
      quotedPriceProduct: {
        category_id: '',
        image_data: [],
        desc: '',
        transport_fee_desc: '',
        transport_fee: '',
        material_data: [
          {
            tree_data: [],
            material_id: '',
            material_name: '',
            weight: '',
            loss: '',
            price: '',
            total_price: '',
            unit: 'kg',
            desc: ''
          }
        ],
        assist_material_data: [
          {
            material_id: '',
            material_name: '',
            number: '',
            loss: '',
            price: '',
            total_price: '',
            unit: '',
            desc: ''
          }
        ],
        weave_data: [
          {
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        semi_product_data: [
          {
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        production_data: [
          {
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        pack_material_data: [
          {
            material_name: '',
            material_id: '',
            desc: '',
            total_price: ''
          }
        ],
        other_fee_data: [
          {
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        no_production_fee_data: [
          {
            name: '',
            desc: '',
            total_price: ''
          }
        ]
      },
      quotedPriceProductList: [],
      quotedPriceProductTotal: 1,
      quotedPriceProductPage: 1,
      quotedPriceProductUpdate: false,
      weaveList: [{ value: '针织织造' }, { value: '梭织织造' }, { value: '制版费' }],
      companyInfo: {
        alias: '',
        logo: '',
        company_name: '',
        company_id: '',
        introduce: '',
        email: '',
        address: ''
      },
      yarnPrice: {
        id: '',
        client_id: '',
        material_type: 1,
        info_data: [
          {
            id: '',
            material_id: '',
            material_arr: [],
            material_color: '',
            attribute: '',
            price: '',
            desc: ''
          }
        ]
      },
      yarnPriceList: [],
      yarnPricePage: 1,
      yarnPriceTotal: 1,
      yarnPriceUpdate: false,
      mianliaoPrice: {
        id: '',
        client_id: '',
        material_type: 2,
        info_data: [
          {
            id: '',
            material_id: '',
            material_arr: [],
            material_color: '',
            attribute: '',
            price: '',
            desc: ''
          }
        ]
      },
      mianliaoPriceList: [],
      mianliaoPricePage: 1,
      mianliaoPriceTotal: 1,
      mianliaoPriceUpdate: false,
      quotedPriceCategoryId: '',
      quotedPriceDescList: [
        {
          name: '原料信息',
          type: 'material_data',
          desc: ''
        },
        {
          name: '辅料信息',
          type: 'assist_material_data',
          desc: ''
        },
        {
          name: '织造信息',
          type: 'weave_data',
          desc: ''
        },
        {
          name: '半成品加工信息',
          type: 'semi_product_data',
          desc: ''
        },
        {
          name: '成品加工信息',
          type: 'production_data',
          desc: ''
        },
        {
          name: '包装辅料信息',
          type: 'pack_material_data',
          desc: ''
        },
        {
          name: '其他信息',
          type: 'other_fee_data',
          desc: ''
        },
        {
          name: '运费说明',
          type: 'transport_fee',
          desc: ''
        }
      ],
      quotedPriceDesc: {
        name: '',
        type: '',
        desc: ''
      }
    }
  },
  filters: {
    filterPrice(priceArr: any[]): string {
      if (priceArr.length === 0) {
        return '暂无报价'
      } else if (priceArr.length === 1) {
        return priceArr[0].price + '元'
      } else {
        return (
          Math.min(...priceArr.map((item) => Number(item.price))) +
          '元-' +
          Math.max(...priceArr.map((item) => Number(item.price))) +
          '元'
        )
      }
    }
  },
  methods: {
    randomArray(arr: any[]) {
      for (let i = 0, len = arr.length; i < len; i++) {
        let index = Math.ceil(Math.random() * (len - 1))
        let tempValue = arr[i]
        arr[i] = arr[index]
        arr[index] = tempValue
      }
      return arr
    },
    myRandom(min: number, max: number) {
      return Math.round(Math.random() * (max - min) + min)
    },
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
    saveCraft() {
      const formCheck = this.$formCheck(this.craftInfo, [
        {
          key: 'name',
          errMsg: '请输入模拟名称'
        },
        {
          key: 'hairiness_density',
          errMsg: '请输入密度'
        }
      ])
      if (!formCheck) {
        craft.parameterCreate(this.craftInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
            this.showPopup = false
            this.resetCraft()
          }
          this.getCraftList()
        })
      }
    },
    initCraftCanvas() {
      const long = 140 // 设置的时候700/5 = 140个格子固定
      const initRectArr = new Array(this.craftInfo.diameter).fill([]).map(() => new Array(long).fill(0))
      const distance = this.craftInfo.twist_number
      const twistNum = Math.ceil(long / distance) // 向上取整
      const twistInitArr = this.randomArray(this.initTwistDistance(twistNum, distance)) // 捻距随机数组
      for (let i = 0; i < this.craftInfo.diameter; i++) {
        twistInitArr.reduce((total, item) => {
          for (let j = 0; j < this.craftInfo.twist_thickness; j++) {
            const y = total + j
            initRectArr[i][y] = 1
          }
          return total + item
        }, i * this.craftInfo.twist_angle)
      }
      // 优化掉结尾
      initRectArr.forEach((item) => {
        item.length = long
      })
      const rate = this.craftInfo.hairiness_density // 默认百分之三十
      // 随机2个画边的数组出来
      let lineArr1 = this.randomArray(
        new Array(Math.round(long * (rate / 100)))
          .fill(1)
          .concat(new Array(Math.round(long * ((100 - rate) / 100))).fill(0))
      )
      let lineArr2 = this.randomArray(
        new Array(Math.round(long * (rate / 100)))
          .fill(1)
          .concat(new Array(Math.round(long * ((100 - rate) / 100))).fill(0))
      )
      // 这里都用四舍五入会有误差，因此最后的随机数组截取一下长度就ok了
      lineArr1.length = long
      lineArr2.length = long
      let dom: any = this.$refs.myCanvas
      let ctx = dom.getContext('2d')
      ctx.beginPath()
      // 清空画布
      ctx.clearRect(0, 0, 730, 60)
      const r = 100
      const g = 100
      const b = 100
      const rgbReal = 'rgb(' + r + ',' + g + ',' + b + ')'
      const rgbSide1 = 'rgb(' + r * 0.96 + ',' + g * 0.96 + ',' + b * 0.96 + ')'
      const rgbSide2 = 'rgb(' + r * 0.92 + ',' + g * 0.92 + ',' + b * 0.92 + ')'
      const rgbShadow = 'rgb(' + r * 0.85 + ',' + g * 0.85 + ',' + b * 0.85 + ')'
      const rgbShadowSide1 = 'rgb(' + r * 0.85 * 0.96 + ',' + g * 0.85 * 0.96 + ',' + b * 0.85 * 0.96 + ')'
      const rgbShadowSide2 = 'rgb(' + r * 0.85 * 0.92 + ',' + g * 0.85 * 0.92 + ',' + b * 0.85 * 0.92 + ')'
      const rgbHairiness = 'rgb(' + r * 0.92 + ',' + g * 0.92 + ',' + b * 0.92 + ')'
      initRectArr.reduce((y: number, item: number[], index) => {
        item.reduce((x: number, itemChild) => {
          if (this.craftInfo.twist_flag) {
            if (itemChild === 0) {
              ctx.fillStyle =
                index === 0 || index === this.craftInfo.diameter - 1
                  ? rgbSide2
                  : index === 1 || index === this.craftInfo.diameter - 2
                  ? rgbSide1
                  : rgbReal
              ctx.fillRect(x, y, 5, 5)
            } else {
              ctx.fillStyle =
                index === 0 || index === this.craftInfo.diameter - 1
                  ? rgbShadowSide2
                  : index === 1 || index === this.craftInfo.diameter - 2
                  ? rgbShadowSide1
                  : rgbShadow
              ctx.fillRect(x, y, 5, 5)
            }
          } else {
            ctx.fillStyle =
              index === 0 || index === this.craftInfo.diameter - 1
                ? rgbSide2
                : index === 1 || index === this.craftInfo.diameter - 2
                ? rgbSide1
                : rgbReal
            ctx.fillRect(x, y, 5, 5)
          }
          return x + 5
        }, 15)
        return y + 5
      }, Math.round((60 - this.craftInfo.diameter * 5) / 2))
      const hairinessY1 = Math.round((60 - this.craftInfo.diameter * 5) / 2) - 5
      const hairinessY2 = Math.round((60 - this.craftInfo.diameter * 5) / 2) + 5 * this.craftInfo.diameter
      let r1 = 0
      let r2 = 0
      let r3 = 0
      let r4 = 0
      let xw = 0
      if (this.craftInfo.hairiness_length === 3) {
        r1 = this.myRandom(0, 2)
        r2 = this.myRandom(2, 4)
        r3 = this.myRandom(4, 6)
        r4 = this.myRandom(6, 8)
        xw = 12
      } else if (this.craftInfo.hairiness_length === 2) {
        r1 = this.myRandom(0, 3)
        r2 = this.myRandom(3, 6)
        r3 = this.myRandom(6, 9)
        r4 = this.myRandom(9, 12)
        xw = 12
      } else {
        r1 = this.myRandom(0, 4)
        r2 = this.myRandom(4, 8)
        r3 = this.myRandom(8, 12)
        r4 = this.myRandom(12, 16)
        xw = 12
      }
      lineArr1.reduce((x, item) => {
        if (item === 1) {
          ctx.fillStyle = rgbHairiness
          if (this.craftInfo.hairiness_flag === 1) {
            ctx.fillRect(x, hairinessY1, 5, 5)
          }
          if (this.craftInfo.hairiness_flag === 2 || this.craftInfo.hairiness_flag === 4) {
            const y1 = hairinessY1 - this.myRandom(r1, r2)
            const y2 = hairinessY1 - this.myRandom(r2, r3)
            const y3 = hairinessY1 - this.myRandom(r3, r4)
            const x1 = x + this.myRandom(-xw, xw)
            const x2 = x + this.myRandom(-xw, xw)
            const x3 = x + this.myRandom(-xw, xw)
            ctx.beginPath()
            ctx.strokeStyle = rgbHairiness
            ctx.lineWidth = 3
            ctx.moveTo(x, hairinessY1 + 5)
            ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
            ctx.stroke()
          }
          if (this.craftInfo.hairiness_flag === 3 || this.craftInfo.hairiness_flag === 4) {
            ctx.beginPath()
            ctx.strokeStyle = rgbHairiness
            ctx.lineWidth = 1
            for (let i = 0; i < this.myRandom(1, 5); i++) {
              const r =
                this.craftInfo.circle_number === 2
                  ? this.myRandom(3, 8)
                  : this.craftInfo.circle_number === 1
                  ? this.myRandom(2, 6)
                  : this.myRandom(4, 10)
              const rx = x + this.myRandom(0, 6)
              const ry = hairinessY1 + this.myRandom(0, 6)
              ctx.arc(rx, ry, r, 0, Math.PI * 2)
              ctx.stroke()
            }
          }
        }
        return x + 5
      }, 15)
      lineArr2.reduce((x, item) => {
        if (item === 1) {
          ctx.fillStyle = rgbHairiness
          if (this.craftInfo.hairiness_flag === 1) {
            ctx.fillRect(x, hairinessY2, 5, 5)
          }
          if (this.craftInfo.hairiness_flag === 2 || this.craftInfo.hairiness_flag === 4) {
            const y1 = hairinessY2 + this.myRandom(r1, r2)
            const y2 = hairinessY2 + this.myRandom(r2, r3)
            const y3 = hairinessY2 + this.myRandom(r3, r4)
            const x1 = x + this.myRandom(-xw, xw)
            const x2 = x + this.myRandom(-xw, xw)
            const x3 = x + this.myRandom(-xw, xw)
            ctx.beginPath()
            ctx.strokeStyle = rgbHairiness
            ctx.lineWidth = 3
            ctx.moveTo(x, hairinessY2)
            ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
            ctx.stroke()
          }
          if (this.craftInfo.hairiness_flag === 3 || this.craftInfo.hairiness_flag === 4) {
            ctx.beginPath()
            ctx.strokeStyle = rgbHairiness
            ctx.lineWidth = 1
            for (let i = 0; i < this.myRandom(1, 5); i++) {
              const r =
                this.craftInfo.circle_number === 2
                  ? this.myRandom(3, 8)
                  : this.craftInfo.circle_number === 1
                  ? this.myRandom(2, 6)
                  : this.myRandom(4, 10)
              const rx = x + this.myRandom(0, 6)
              const ry = hairinessY2 + this.myRandom(0, 6)
              ctx.arc(rx, ry, r, 0, Math.PI * 2)
              ctx.stroke()
            }
          }
        }
        return x + 5
      }, 15)

      // 上传图片
      window.setTimeout(() => {
        const _this = this
        var image = this.$refs.myCanvas.toDataURL('image/png')
        var url = 'https://upload.qiniup.com/'
        var xhr = new XMLHttpRequest()
        let formData = new FormData()
        formData.append('token', this.$store.state.status.token)
        // @ts-ignore
        let filename = Date.parse(new Date()) + '.jpg'
        formData.append('key', filename)
        formData.append('file', this.dataURLtoFile(image, filename))
        xhr.open('POST', url, true)
        xhr.send(formData)
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            _this.craftInfo.image_url = 'https://file.zwyknit.com/' + JSON.parse(xhr.responseText).key
          }
        }
      })
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
    },
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
    updateCraft(info: CraftParameter) {
      this.craftInfo = info
      this.showPopup = true
    },
    deleteCraft(id: number) {
      this.$confirm('是否删除该纱线模拟?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          craft
            .parameterDelete({
              id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('删除成功')
                this.getCraftList()
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
    resetCraft() {
      this.craftInfo = {
        id: '',
        name: '',
        image_url: '',
        diameter: 4,
        twist_flag: 0,
        twist_thickness: 4, // 捻粗细：下拉框选择密不密
        twist_number: 10, // 捻数量：下拉框选择密不密
        twist_angle: 1, // 捻角度：下拉框选择
        hairiness_flag: 1, // 是否需要毛羽:0不需要，1.毛边 2.毛羽 3.圈圈
        hairiness_length: 2, // 毛羽长度，下拉框
        circle_number: 2,
        hairiness_density: 30 // 毛羽密度，百分比
      }
    },
    getModuleChild(name: string, detailInfo: any[]) {
      this.userNavSon = name
      this.systemModuleChild = detailInfo.map((item) => {
        return {
          id: item.id,
          name: item.name,
          check: this.userInfo.module_info.indexOf(item.id) !== -1
        }
      })
    },
    getModuleChild2(ev: boolean, id: number, detailInfo: any[]) {
      if (detailInfo.length > 0) {
        if (ev) {
          this.userInfo.module_info.push(id)
          this.userInfo.module_info = this.userInfo.module_info.concat(detailInfo.map((item) => item.id))
          this.userInfo.module_info = Array.from(new Set(this.userInfo.module_info))
        } else {
          this.userInfo.module_info.splice(this.userInfo.module_info.indexOf(id), 1)
          detailInfo.forEach((item) => {
            if (this.userInfo.module_info.indexOf(item.id) !== -1) {
              this.userInfo.module_info.splice(this.userInfo.module_info.indexOf(item.id), 1)
            }
          })
        }
      } else {
        if (ev) {
          this.userInfo.module_info.push(id)
        } else {
          this.userInfo.module_info.splice(this.userInfo.module_info.indexOf(id), 1)
        }
      }

      this.$forceUpdate()
    },
    getModuleChildCheck(ev: boolean, id: string) {
      if (ev) {
        this.userInfo.module_info.push(id)
      } else {
        const index = this.userInfo.module_info.indexOf(id)
        if (index !== -1) {
          this.userInfo.module_info.splice(index, 1)
        }
      }
    },
    // 全选
    getModuleChildCheckAll(name: string) {
      let detailInfo = this.systemModuleArr.find((item: any) => {
        return item.name === name
      }).detail

      this.systemModuleChild = detailInfo.map((item: any) => {
        this.userInfo.module_info.push(item.id)
        item.check = true
        return {
          id: item.id,
          name: item.name,
          check: this.userInfo.module_info.indexOf(item.id) !== -1
        }
      })
    },
    // 用户注册获取验证码
    getSmsCode() {
      if (Number(this.smsIndex)) {
        this.$message.warning('请稍后发送')
        return
      }
      if (
        !this.$formCheck(this.userInfo, [
          {
            key: 'phone',
            regNormal: 'isPhone'
          }
        ])
      ) {
        user.getSms({ phone: this.userInfo.phone }).then((res) => {
          if (res.data.status) {
            this.$message.success('发送成功')
            this.smsIndex = 60
            setInterval(() => {
              if (this.smsIndex === 0) {
                this.smsIndex = '重新发送'
              } else {
                this.smsIndex--
              }
            }, 1000)
          }
        })
      }
    },
    // 原料颜色搜索
    searchColor(str: string, cb: any) {
      const searchList = [{ name: '白胚' }].concat(this.yarnColorList)
      let results = str ? searchList.filter(this.createFilter(str)) : searchList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(
        results.map((item) => {
          return {
            value: item.name
          }
        })
      )
    },
    // 产品品类单位搜索
    searchProUnit(str: string, cb: any) {
      const searchList = [
        { value: '条' },
        { value: '件' },
        { value: '个' },
        { value: '双' },
        { value: '只' },
        { value: '顶' },
        { value: '片' },
        { value: '米' },
        { value: '匹' }
      ]
      let results = str ? searchList.filter(this.createFilter(str)) : searchList.slice(0, 10)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString: string) {
      return (restaurant: any) => {
        return restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    uploadSignatureSuccess() {
      const fileArr = this.$refs.companySignatureUpload.uploadFiles.map(
        (item: { response: { key: string }; url: any }) => {
          return item.response ? 'https://file.zwyknit.com/' + item.response.key : item.url
        }
      )
      this.clientEN.signature = fileArr[1] || fileArr[0]
    },
    uploadCustomsSuccess() {
      const fileArr = this.$refs.companyCustomsUpload.uploadFiles.map(
        (item: { response: { key: string }; url: any }) => {
          return item.response ? 'https://file.zwyknit.com/' + item.response.key : item.url
        }
      )
      this.clientEN.special_seal = fileArr[1] || fileArr[0]
    },
    uploadCompanySuccess() {
      const fileArr = this.$refs.companyLogo.uploadFiles.map((item: { response: { key: string }; url: any }) => {
        return item.response ? 'https://file.zwyknit.com/' + item.response.key : item.url
      })
      this.companyInfo.logo = fileArr[1] || fileArr[0]
    },
    uploadQuotedSuccess() {
      const fileArr = this.$refs.quotedLogo.uploadFiles.map((item: { response: { key: string }; url: any }) => {
        return item.response ? 'https://file.zwyknit.com/' + item.response.key : item.url
      })
      this.quotedPriceDesc.type = fileArr[1] || fileArr[0]
    },
    beforeUpload: function (file: { name: string; type: string; size: number }) {
      let fileName = file.name.lastIndexOf('.') // 取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length // 取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength) // 截
      this.postData.key = Date.parse(new Date() as any) + '.' + fileFormat
      this.postData.token = this.$store.state.status.token
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 6
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 6MB!')
        return false
      }
    },
    getFilters() {
      const params = this.$route.query
      this.pName = params.pName as string
      this.cName = params.cName as string
    },
    // 这里可以做个优化，判断一下数据是否已经存在，可以不重新调接口获取数据
    getList() {
      this.onlyDelete = false
      if (this.cName === '款式') {
        this.getStyle()
      } else if (this.cName === '品类') {
        this.getCategory()
      } else if (this.cName === '成分') {
        this.getIngredient()
      } else if (this.cName === '配色组') {
        this.getColour()
      } else if (this.cName === '尺码') {
        this.getSize()
      } else if (this.cName === '尺寸模板') {
        this.getSizeModule()
      } else if (this.cName === '批次类型') {
        this.getOrderType()
      } else if (this.cName === '样单类型') {
        this.getSampleOrderType()
      } else if (this.cName === '原料加工工序') {
        this.getMaterialProcess()
      } else if (this.cName === '半成品加工') {
        this.getHalfProcess()
      } else if (this.cName === '成品加工工序') {
        this.getStaffProcess()
      } else if (this.cName === '边型') {
        this.getSide()
      } else if (this.cName === '机型') {
        this.getMachine()
      } else if (this.cName === '组织法') {
        this.getMethods()
      } else if (this.cName === '纱线颜色') {
        this.getYarnColor()
      } else if (this.cName === '英文工厂信息') {
        this.getClientEN()
      } else if (this.cName === '英文银行信息') {
        this.getBankEN()
      } else if (this.cName === 'HS编码设置') {
        this.getHSCode()
      } else if (this.cName === '常用公司设置') {
        this.getNormalClientList()
      } else if (this.cName === '常用城市设置') {
        this.getNormalCityList()
      } else if (this.cName === '常用品名设置') {
        this.getNormalCategoryList()
      } else if (this.cName === '常用付款方式') {
        this.getNormalPayList()
      } else if (this.cName === '纱线模拟') {
        this.$checkCommonInfo([
          {
            checkWhich: 'status/token',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getTokenAsync'
          }
        ])
        this.getCraftList()
      } else if (this.cName === '纱线原料') {
        this.$checkCommonInfo([
          {
            checkWhich: 'api/clientType',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getClientTypeAsync'
          }
        ])
        this.getYarnType(1)
        this.getYarn(1)
      } else if (this.cName === '面料原料') {
        this.$checkCommonInfo([
          {
            checkWhich: 'api/clientType',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getClientTypeAsync'
          }
        ])
        this.getYarnType(2)
        this.getYarn(2)
      } else if (this.cName === '毛料原料') {
        this.$checkCommonInfo([
          {
            checkWhich: 'api/clientType',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getClientTypeAsync'
          }
        ])
        this.getYarnType(3)
        this.getYarn(3)
      } else if (this.cName === '纱线报价') {
        this.getYarnPrice()
        this.getYarn(1, true) // 获取全部纱线
        this.getYarnColor()
      } else if (this.cName === '面料报价') {
        this.getMianliaoPrice()
        this.getYarn(2)
        this.getYarnColor()
      } else if (this.cName === '装饰辅料') {
        this.getDecorateMaterial()
      } else if (this.cName === '包装辅料') {
        this.getPackMaterial()
      } else if (this.cName === '负责小组/人') {
        this.getGroup()
      } else if (this.cName === '系统账户管理') {
        this.getUser()
        this.getGroup()
      } else if (this.cName === '报价模板') {
        this.checkCategoryDelete = false
        this.getQuotedPriceProduct()
        this.getCategory()
      } else if (this.cName === '报价说明') {
        this.checkCategoryDelete = false
        this.$checkCommonInfo([
          {
            checkWhich: 'status/token',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getTokenAsync'
          }
        ])
        this.getCategory()
      } else if (this.cName === '基本信息') {
        this.$checkCommonInfo([
          {
            checkWhich: 'status/token',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getTokenAsync'
          }
        ])
        this.getCompany()
      } else if (this.pName === '通知和审核设置') {
        this.$checkCommonInfo([
          {
            checkWhich: 'api/clientType',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getClientTypeAsync'
          },
          {
            checkWhich: 'api/user',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getUserAsync'
          }
        ])
        if (this.cName === '样品订单') {
          checkConfig
            .detail({
              doc_type: 17
            })
            .then((res) => {
              if (res.data.status && res.data.data) {
                this.sampleOrderCheckConfig = {
                  data: res.data.data,
                  doc_type: 17
                }
              }
            })
        } else if (this.cName === '大货订单') {
          checkConfig
            .detail({
              doc_type: 1
            })
            .then((res) => {
              if (res.data.status && res.data.data) {
                this.orderCheckConfig = {
                  data: res.data.data,
                  doc_type: 1
                }
              }
            })
        } else if (this.cName === '原料计划单') {
          checkConfig
            .detail({
              doc_type: 9
            })
            .then((res) => {
              if (res.data.status && res.data.data) {
                this.materialPlanCheckConfig = {
                  data: res.data.data,
                  doc_type: 9
                }
              }
            })
        } else if (this.cName === '原料采购单') {
          checkConfig
            .detail({
              doc_type: 2
            })
            .then((res) => {
              if (res.data.status && res.data.data) {
                this.materialOrderCheckConfig = {
                  data: res.data.data,
                  doc_type: 2
                }
              }
            })
        } else if (this.cName === '原料加工单') {
          checkConfig
            .detail({
              doc_type: 3
            })
            .then((res) => {
              if (res.data.status && res.data.data) {
                this.materialProcessCheckConfig = {
                  data: res.data.data,
                  doc_type: 3
                }
              }
            })
        } else if (this.cName === '原料调取单') {
          checkConfig
            .detail({
              doc_type: 6
            })
            .then((res) => {
              if (res.data.status && res.data.data) {
                this.materialStockCheckConfig = {
                  data: res.data.data,
                  doc_type: 6
                }
              }
            })
        } else if (this.cName === '辅料采购单') {
          checkConfig
            .detail({
              doc_type: 18
            })
            .then((res) => {
              if (res.data.status && res.data.data) {
                this.accessoriesOrderCheckConfig = {
                  data: res.data.data,
                  doc_type: 18
                }
              }
            })
        } else if (this.cName === '生产计划单') {
          checkConfig
            .detail({
              doc_type: 4
            })
            .then((res) => {
              if (res.data.status && res.data.data) {
                this.productionPlanCheckConfig = {
                  data: res.data.data,
                  doc_type: 4
                }
              }
            })
        } else if (this.cName === '包装采购单') {
          checkConfig
            .detail({
              doc_type: 11
            })
            .then((res) => {
              if (res.data.status && res.data.data) {
                this.packOrderCheckConfig = {
                  data: res.data.data,
                  doc_type: 11
                }
              }
            })
        } else if (this.cName === '工资结算单') {
          checkConfig
            .detail({
              doc_type: 14
            })
            .then((res) => {
              if (res.data.status && res.data.data) {
                this.gongziCheckConfig = {
                  data: res.data.data,
                  doc_type: 14
                }
              }
            })
        } else if (this.cName === '发货单') {
          checkConfig
            .detail({
              doc_type: 13
            })
            .then((res) => {
              if (res.data.status && res.data.data) {
                this.packOutCheckConfig = {
                  data: res.data.data,
                  doc_type: 13
                }
              }
            })
        } else {
          checkConfig.pushDetail().then((res) => {
            if (res.data.status && res.data.data) {
              this.pushCheckConfig = res.data.data
            }
          })
        }
      }
    },
    downLoadTemplete(type: string) {
      switch (type) {
        case 'yarn1':
          this.$downloadExcel([], [{ title: '纱线名称', key: 'name' }], '纱线名称模板')
          break
        case 'yarn2':
          this.$downloadExcel([], [{ title: '面料名称', key: 'name' }], '面料名称模板')
          break
        case 'decorateMaterial':
          this.$downloadExcel(
            [],
            [
              { title: '辅料名称', key: 'name' },
              { title: '计量单位', key: 'unit' }
            ],
            '辅料名称模板'
          )
          break
        case 'style':
          this.$downloadExcel([], [{ title: '款式名称', key: 'name' }], '产品款式模板')
          break
        case 'flower':
          this.$downloadExcel([], [{ title: '花型名称', key: 'name' }], '产品花型模板')
          break
        case 'ingredient':
          this.$downloadExcel([], [{ title: '成分名称', key: 'name' }], '产品成分模板')
          break
        case 'colour':
          this.$downloadExcel([], [{ title: '配色名称', key: 'name' }], '产品配色模板')
          break
        case 'side':
          this.$downloadExcel([], [{ title: '边型名称', key: 'name' }], '边型模板')
          break
        case 'machine':
          this.$downloadExcel([], [{ title: '机型名称', key: 'name' }], '机型模板')
          break
        case 'methods':
          this.$downloadExcel([], [{ title: '组织法名称', key: 'name' }], '组织法模板')
          break
        case 'yarn':
          this.$downloadExcel([], [{ title: '纱线原料名称', key: 'name' }], '纱线原料模板')
          break
        case 'yarnColor':
          this.$downloadExcel(
            [],
            [
              { title: '纱线颜色名称', key: 'name' },
              { title: '色块', key: 'color_code' }
            ],
            '纱线颜色模板'
          )
          break
        case 'decorateMaterial':
          this.$downloadExcel(
            [],
            [
              { title: '装饰辅料名称', key: 'name' },
              { title: '计量单位', key: 'unit' }
            ],
            '装饰辅料模板'
          )
          break
        case 'pack':
          this.$downloadExcel(
            [],
            [
              { title: '包装辅料名称', key: 'name' },
              { title: '计量单位', key: 'unit' },
              { title: `计价方式(注:'面积'填'1','其它'填'2',默认为'2')`, key: 'type' }
            ],
            '包装辅料模板'
          )
          break
        case 'yarnProcess':
          this.$downloadExcel([], [{ title: '原料加工工序名称', key: 'name' }], '原料加工工序模板')
          break
        case 'semiProcess':
          this.$downloadExcel(
            [],
            [
              { title: '生产工序名称', key: 'name' },
              { title: '生产工序编号', key: 'code' }
            ],
            '生产工序模板'
          )
          break
        case 'staffProcess':
          this.$downloadExcel(
            [],
            [
              { title: '成品加工工序名称', key: 'name' },
              { title: '成品加工工序编号', key: 'code' }
            ],
            '成品加工工序模板'
          )
          break
        default:
          this.$message.error('未知模板类型，下载失败！！！')
          break
      }
    },
    importExcelData(type: string) {
      const inputFile = document.createElement('input')
      inputFile.type = 'file'
      inputFile.accept = '.xlsx,.xls'
      inputFile.addEventListener('change', (e) => {
        this.getExcelData(e, this.saveImportData, type)
      })
      let click = document.createEvent('MouseEvents')
      click.initEvent('click', true, true)
      inputFile.dispatchEvent(click)
    },
    getExcelData(file: any, callBack: any, type: string) {
      const _this = this
      const XLSX = require('xlsx')
      const files = file.target.files
      const fileReader = new FileReader()
      fileReader.onload = function (e: any) {
        try {
          const data = e.target.result
          const bytes = new Uint8Array(data) // 无符号整型数组
          const len = bytes.byteLength
          const binarys = new Array(len) // 创建定长数组，存储文本
          for (let i = 0; i < len; i++) {
            binarys[i] = String.fromCharCode(bytes[i])
          }
          const workbook = XLSX.read(binarys.join(''), { type: 'binary' })
          if (!workbook) {
            return null
          }
          const r: any = {}
          workbook.SheetNames.forEach((name: string) => {
            // 遍历每张纸数据
            r[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name])
          })
          callBack && callBack(r, type)
        } catch (e) {
          _this.$message.error('文件类型不正确')
        }
      }
      fileReader.readAsArrayBuffer(files[0])
    },
    saveImportData(data: any, type: string) {
      let typeObj: any = {}
      let api = null
      switch (type) {
        case 'style':
          typeObj = {
            id: [false, null],
            name: ['款式名称']
          }
          api = style.create
          break
        case 'ingredient':
          typeObj = {
            id: [false, null],
            name: ['成分名称']
          }
          api = ingredient.create
          break
        case 'colour':
          typeObj = {
            id: [false, null],
            name: ['配色名称'],
            color_code: [false, null]
          }
          api = colour.create
          break
        case 'side':
          typeObj = {
            id: [false, null],
            name: ['边型名称']
          }
          api = craftSetting.createSide
          break
        case 'machine':
          typeObj = {
            id: [false, null],
            name: ['机型名称']
          }
          api = craftSetting.createMachine
          break
        case 'methods':
          typeObj = {
            id: [false, null],
            name: ['组织法名称']
          }
          api = craftSetting.createMethods
          break
        case 'yarn1':
          typeObj = {
            id: [false, null],
            name: ['纱线名称']
          }
          api = yarn.create
          break
        case 'yarn2':
          typeObj = {
            id: [false, null],
            name: ['面料名称']
          }
          api = yarn.create
          break
        case 'yarnColor':
          typeObj = {
            id: [false, null],
            name: ['纱线颜色名称'],
            color_code: ['色块', null]
          }
          api = yarnColor.create
          break
        case 'decorateMaterial':
          typeObj = {
            id: [false, null],
            name: ['辅料名称'],
            unit: ['计量单位']
          }
          api = decorateMaterial.create
          break
        // case 'pack':
        //   typeObj = {
        //     id: [false, null],
        //     name: ['包装辅料名称'],
        //     unit: ['计量单位'],
        //     type: [`计价方式(注:'面积'填'1','其它'填'2',默认为'2')`, 2],
        //     price_data: [false, []]
        //   }
        //   api = packag.create
        //   break
        case 'yarnProcess':
          typeObj = {
            id: [false, null],
            name: ['原料加工工序名称'],
            type: [false, 1]
          }
          api = process.create
          break
        case 'semiProcess':
          typeObj = {
            id: [false, null],
            name: ['生产工序名称'],
            code: ['生产工序编号'],
            type: [false, 2]
          }
          api = process.create
          break
        case 'staffProcess':
          typeObj = {
            id: [false, null],
            name: ['成品加工工序名称'],
            code: ['成品加工工序编号'],
            type: [false, 3]
          }
          api = process.create
          break
        default:
          this.$message.error('未知模板类型，导入失败！！！')
          return
      }
      let submitData = []
      for (const prop in data) {
        for (const key in data[prop]) {
          let obj: any = {}
          for (const indexType in typeObj) {
            if (typeObj[indexType][0]) {
              obj[indexType] = data[prop][key][typeObj[indexType][0]] || data[prop][key][typeObj[indexType][1]]
              if (obj[indexType] === undefined) {
                this.$message.error('解析失败，请使用标准模板或检测必填数据是否存在空的情况！！！')
                return
              }
            } else {
              obj[indexType] = typeObj[indexType][1]
            }
          }
          submitData.push(obj)
        }
      }
      if (submitData.length === 0) {
        this.$message.warning('未读取到可用参数')
        return
      }
      if (type === 'yarn1' || type === 'yarn2') {
        const realType = (type === 'yarn1' ? this.yarnTypeList1 : this.yarnTypeList2)
          .filter((item: { check: any }) => item.check)
          .map((item: { id: any }) => item.id)
        if (realType.length === 0) {
          this.$message.error('请至少选择一种类型')
          return
        }
        // @ts-ignore
        api({
          id: null,
          // @ts-ignore
          name: submitData.map((item) => item.name),
          type: type === 'yarn1' ? 1 : 2,
          yarn_rel_type: realType as number[]
        }).then((res) => {
          if (res.data.status !== false) {
            this.$message.success('导入成功,即将刷新数据')
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          }
        })
      } else {
        // @ts-ignore
        api({
          data: submitData
        }).then((res) => {
          if (res.data.status !== false) {
            this.$message.success('导入成功,即将刷新数据')
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          }
        })
      }
    },
    getCategory() {
      category
        .list({
          only_delete: this.checkCategoryDelete ? 1 : null
        })
        .then((res) => {
          if (res.data.status) {
            this.categoryList = res.data.data
            this.categoryTotal = this.categoryList.length
          }
        })
    },
    saveCategory() {
      const fromCheck =
        this.$formCheck(this.categoryInfo, [
          {
            key: 'name',
            errMsg: '品类不得为空'
          },
          {
            key: 'unit',
            errMsg: '单位不得为空'
          }
        ]) ||
        this.categoryInfo.secondary_category.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'name',
              errMsg: '二级品类不得为空'
            }
          ])
        })
      if (!fromCheck) {
        category.create(this.categoryInfo).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加品类成功'
            })
            this.categoryInfo = {
              id: '',
              name: '',
              code: '',
              unit: '',
              secondary_category: [
                {
                  name: '',
                  id: ''
                }
              ]
            }
            this.getCategory()
          }
        })
      }
    },
    resetQuotedPriceProduct() {
      this.quotedPriceProduct = {
        category_id: '',
        image_data: [],
        desc: '',
        transport_fee_desc: '',
        transport_fee: '',
        material_data: [
          {
            tree_data: [],
            material_id: '',
            material_name: '',
            weight: '',
            loss: '',
            price: '',
            total_price: '',
            unit: 'kg',
            desc: ''
          }
        ],
        assist_material_data: [
          {
            material_id: '',
            material_name: '',
            number: '',
            loss: '',
            price: '',
            total_price: '',
            unit: '',
            desc: ''
          }
        ],
        weave_data: [
          {
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        semi_product_data: [
          {
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        production_data: [
          {
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        pack_material_data: [
          {
            material_name: '',
            material_id: '',
            desc: '',
            total_price: ''
          }
        ],
        other_fee_data: [
          {
            name: '',
            desc: '',
            total_price: ''
          }
        ],
        no_production_fee_data: [
          {
            name: '',
            desc: '',
            total_price: ''
          }
        ]
      }
    },
    updateCategory(info: any) {
      this.categoryInfo = info
      this.showPopup = true
    },
    deleteCategory(id: number) {
      this.$confirm('是否' + (this.checkCategoryDelete ? '恢复' : '删除') + '该品类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          category.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: (this.checkCategoryDelete ? '恢复' : '删除') + '成功!'
              })
              this.getCategory()
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
    deleteSecondCategory(id: number, index: number) {
      this.$confirm('是否删除该二级品类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          category.deleteSecond({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$deleteItem(this.categoryInfo.secondary_category, index)
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
    getStyle() {
      style.list().then((res) => {
        if (res.data.status) {
          this.styleList = res.data.data
          this.styleTotal = this.styleList.length
        }
      })
    },
    saveStyle() {
      const fromCheck = this.$formCheck(this.styleInfo, [
        {
          key: 'name',
          errMsg: '款式不得为空'
        }
      ])
      if (!fromCheck) {
        style
          .create({
            data: [this.styleInfo]
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success({
                message: '添加款式成功'
              })
              this.styleInfo = {
                id: null,
                name: ''
              }
              this.getStyle()
            }
          })
      }
    },
    deleteStyle(id: number) {
      this.$confirm('是否删除该款式?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          style.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getStyle()
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
    getIngredient() {
      ingredient.list().then((res) => {
        if (res.data.status) {
          this.ingredientList = res.data.data
          this.ingredientTotal = this.ingredientList.length
        }
      })
    },
    saveIngredient() {
      const fromCheck = this.$formCheck(this.ingredientInfo, [
        {
          key: 'name',
          errMsg: '成分名称不得为空'
        }
      ])
      if (!fromCheck) {
        ingredient
          .create({
            data: [this.ingredientInfo]
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success({
                message: '添加成分成功'
              })
              this.ingredientInfo = {
                id: null,
                name: ''
              }
              this.getIngredient()
            }
          })
      }
    },
    deleteIngredient(id: number) {
      this.$confirm('是否删除该成分?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ingredient.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getIngredient()
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
    getColour() {
      colour.list().then((res) => {
        if (res.data.status) {
          this.colourList = res.data.data
          this.colourTotal = this.colourList.length
        }
      })
    },
    saveColour() {
      const formCheck = this.$formCheck(this.colourInfo, [
        {
          key: 'name',
          errMsg: '配色名称不得为空,不能包含特殊字符%或/',
          regExp: /(?=%|\/)/
        }
      ])
      if (!formCheck) {
        colour.create({ data: [this.colourInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加配色成功'
            })
            this.colourInfo = {
              id: null,
              name: '',
              color_code: ''
            }
            this.getColour()
          }
        })
      }
    },
    deleteColour(id: number) {
      this.$confirm('是否删除该配色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          colour.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getColour()
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
    lookSizeModule(info: QuotedPriceProduct) {
      let formData = this.$clone(info)
      ;(formData.content = formData.content
        ? JSON.parse(formData.content)
        : [
            {
              name: '整体',
              value: ''
            },
            {
              name: '',
              value: ''
            }
          ]),
        (this.updateSizeModule = formData)
      this.sizeModuleUpdate = true
      this.showPopup = true
    },
    getSizeModule() {
      sizeModule.list().then((res) => {
        if (res.data.status) {
          this.sizeModuleList = res.data.data
          this.sizeModuleTotal = this.sizeModuleList.length
        }
      })
    },
    deleteSizeModule(id: number) {
      this.$confirm('是否删除该模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sizeModule.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getSizeModule()
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
    saveSizeModule() {
      let formData = this.$clone(this.updateSizeModule)
      formData.content = JSON.stringify(formData.content)
      sizeModule.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.showPopup = false
          this.resetSizeModule()
          this.getSizeModule()
        }
      })
    },
    resetSizeModule() {
      this.updateSizeModule = {
        name: '',
        content: [
          {
            name: '整体',
            value: ''
          },
          {
            name: '',
            value: ''
          }
        ]
      }
    },
    getSize() {
      category.list().then((res) => {
        this.sizeList = res.data.data
        this.sizeTotal = this.sizeList.length
      })
    },
    addSize(id: number) {
      this.sizeInfo.category_id = id
      this.showPopup = true
    },
    delSize(item: SizeInfo[]) {
      this.deleteSizeArr = item
      this.deleteSizeFLag = true
    },
    saveSize() {
      const formCheck = this.$formCheck(this.sizeInfo, [
        {
          key: 'name',
          errMsg: '尺码名称不得为空,不能包含特殊字符%或/',
          regExp: /(?=%|\/)/
        }
      ])
      if (!formCheck) {
        size.create(this.sizeInfo).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加尺码成功'
            })
            this.sizeInfo.name = ''
            this.getSize()
          }
        })
      }
    },
    deleteSize() {
      size
        .delete({
          id: this.deleteSizeId
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '删除成功'
            })
            this.deleteSizeFLag = false
            this.deleteSizeId = ''
            this.getSize()
          }
        })
    },
    getOrderType() {
      orderType
        .list({
          order_type: 1
        })
        .then((res) => {
          this.orderTypeList = res.data.data
          this.orderTypeTotal = this.orderTypeList.length
        })
    },
    saveOrderType() {
      const formCheck = this.$formCheck(this.orderTypeInfo, [
        {
          key: 'name',
          errMsg: '请输入批次类型'
        }
      ])
      if (!formCheck) {
        orderType.create(this.orderTypeInfo).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加批次类型成功'
            })
            this.orderTypeInfo = {
              order_type: 1,
              id: null,
              name: ''
            }
            this.getOrderType()
          }
        })
      }
    },
    deleteOrderType(id: number) {
      this.$confirm('是否删除该批次类型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          orderType.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getOrderType()
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
    getSampleOrderType() {
      orderType
        .list({
          order_type: 2
        })
        .then((res) => {
          this.sampleOrderTypeList = res.data.data
          this.sampleOrderTypeTotal = this.sampleOrderTypeList.length
        })
    },
    saveSampleOrderType() {
      const formCheck = this.$formCheck(this.sampleOrderTypeInfo, [
        {
          key: 'name',
          errMsg: '请输入批次类型'
        }
      ])
      if (!formCheck) {
        orderType.create(this.sampleOrderTypeInfo).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加样单类型成功'
            })
            this.sampleOrderTypeInfo = {
              order_type: 2,
              id: null,
              name: ''
            }
            this.getSampleOrderType()
          }
        })
      }
    },
    deleteSampleOrderType(id: number) {
      this.$confirm('是否删除该批次类型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          orderType.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getSampleOrderType()
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
    getMaterialProcess() {
      process
        .list({
          type: 1
        })
        .then((res) => {
          this.materialProcessList = res.data.data
          this.materialProcessTotal = this.materialProcessList.length
        })
    },
    saveMaterialProcess() {
      const formCheck = this.$formCheck(this.materialProcessInfo, [
        {
          key: 'name',
          errMsg: '请输入原料加工工序'
        }
      ])
      if (!formCheck) {
        process
          .create({
            data: [this.materialProcessInfo]
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.getMaterialProcess()
            }
          })
      }
    },
    deleteMaterialProcess(id: number) {
      this.$confirm('是否删除该工序?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          process
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getMaterialProcess()
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
    getHalfProcess() {
      process
        .list({
          only_delete: this.onlyDeleteProcess ? 1 : 0,
          type: 2
        })
        .then((res) => {
          this.halfProcessList = res.data.data
          this.halfProcessTotal = this.halfProcessList.length
        })

      processType.list({ type: 2 }).then((res) => {
        this.halfProcessTypeList = res.data.data.filter((item: any) => item.id !== -1)
      })
    },
    saveHalfProcess() {
      const formCheck = this.$formCheck(this.halfProcessInfo, [
        {
          key: 'name',
          errMsg: '请输入加工工序'
        }
      ])
      this.halfProcessInfo.rel_tag = this.halfProcessTypeList
        .filter((item: any) => item.check)
        .map((item: any) => item.id)
      this.halfProcessInfo.process_desc = this.processHalfDescList.toString()
      this.halfProcessInfo.process_desc =
        this.halfProcessInfo.process_desc.substring(this.halfProcessInfo.process_desc.length - 1) == ','
          ? this.halfProcessInfo.process_desc.substring(0, this.halfProcessInfo.process_desc.length - 1)
          : this.halfProcessInfo.process_desc

      if (!formCheck) {
        process
          .create({
            data: [this.halfProcessInfo]
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.halfProcessInfo = {
                code: '',
                type: 2,
                process_desc: '',
                name: '',
                rel_tag: [],
                id: null
              }
              this.processHalfDescList = ['']
              this.showPopup = false
              this.isHalfUpdate = false
              this.getHalfProcess()
            }
          })
      }
    },
    cancelHalfProcess() {
      this.showPopup = false
      this.isHalfUpdate = false
      this.halfProcessInfo = {
        code: '',
        type: 2,
        process_desc: '',
        name: '',
        id: null,
        rel_tag: []
      }
      this.processHalfDescList = ['']
    },
    deleteHalfProcess(id: number) {
      this.$confirm('是否' + (this.onlyDeleteProcess ? '恢复' : '删除') + '该工序?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          process
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: (this.onlyDeleteProcess ? '恢复' : '删除') + '成功!'
                })
                this.getHalfProcess()
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
    saveHalfProcessType() {
      const formCheck = this.$formCheck(this.halfProcessTypeInfo, [
        {
          key: 'name',
          errMsg: '请输入工序标签'
        }
      ])
      if (!formCheck) {
        processType.create(this.halfProcessTypeInfo).then((res) => {
          if (res.data.status) {
            this.halfProcessTypeList.push({
              check: true,
              id: res.data.data.id,
              name: res.data.data.name
            })
            this.halfProcessTypeInfo.name = ''
            this.halfProcessTypeFlag = false
            this.$message.success('添加成功')
          }
        })
      }
    },
    deleteHalfProcessType(id: number, index: number) {
      this.$confirm('是否删除该工序标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          processType
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.halfProcessTypeList.splice(index, 1)
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
    getStaffProcess() {
      process
        .list({
          only_delete: this.onlyDeleteProcess2 ? 1 : 0,
          type: 3
        })
        .then((res) => {
          this.staffProcessList = res.data.data
          this.staffProcessTotal = this.staffProcessList.length
        })
      processType.list({ type: 3 }).then((res) => {
        this.staffProcessTypeList = res.data.data.filter((item: any) => item.id !== -1)
      })
    },
    saveStaffProcess() {
      const formCheck = this.$formCheck(this.staffProcessInfo, [
        {
          key: 'name',
          errMsg: '请输入加工工序'
        }
      ])
      this.staffProcessInfo.rel_tag = this.staffProcessTypeList
        .filter((item: any) => item.check)
        .map((item: any) => item.id)
      this.staffProcessInfo.process_desc = this.processStaffDescList.toString()
      this.staffProcessInfo.process_desc =
        this.staffProcessInfo.process_desc.substring(this.staffProcessInfo.process_desc.length - 1) == ','
          ? this.staffProcessInfo.process_desc.substring(0, this.staffProcessInfo.process_desc.length - 1)
          : this.staffProcessInfo.process_desc

      if (!formCheck) {
        process
          .create({
            data: [this.staffProcessInfo]
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.staffProcessInfo = {
                code: '',
                type: 3,
                process_desc: '',
                name: '',
                id: null,
                rel_tag: []
              }
              this.processStaffDescList = ['']
              this.showPopup = false
              this.isStaffProcessUpdate = false
              this.getStaffProcess()
            }
          })
      }
    },
    cancelStaffProcess() {
      this.showPopup = false
      this.isStaffProcessUpdate = false
      this.staffProcessInfo = {
        code: '',
        type: 3,
        process_desc: '',
        name: '',
        id: null,
        rel_tag: []
      }
      this.processStaffDescList = ['']
    },
    deleteStaffProcess(id: number) {
      this.$confirm('是否' + (this.onlyDeleteProcess2 ? '恢复' : '删除') + '该工序?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          process
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: (this.onlyDeleteProcess2 ? '恢复' : '删除') + '成功!'
                })
                this.getStaffProcess()
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
    saveStaffProcessType() {
      const formCheck = this.$formCheck(this.staffProcessTypeInfo, [
        {
          key: 'name',
          errMsg: '请输入工序标签'
        }
      ])
      if (!formCheck) {
        processType.create(this.staffProcessTypeInfo).then((res) => {
          if (res.data.status) {
            this.staffProcessTypeList.push({
              check: true,
              id: res.data.data.id,
              name: res.data.data.name
            })
            this.staffProcessTypeInfo.name = ''
            this.staffProcessTypeFlag = false
            this.$message.success('添加成功')
          }
        })
      }
    },
    deleteStaffProcessType(id: number, index: number) {
      this.$confirm('是否删除该工序标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          processType
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.staffProcessTypeList.splice(index, 1)
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
    updateHalfProcess(item: any) {
      this.isHalfUpdate = true
      this.showPopup = true
      this.halfProcessInfo.code = item.code || ''
      this.halfProcessInfo.name = item.name
      this.halfProcessInfo.id = item.id
      this.halfProcessTypeList.forEach((itemType: any) => {
        itemType.check = !!item.rel_tag.find((itemFind: any) => itemFind.id === itemType.id)
      })
      if (item.process_desc !== null) {
        this.processHalfDescList = item.process_desc.split(',')
      }
    },
    updateStaffProcess(item: any) {
      this.isStaffProcessUpdate = true
      this.showPopup = true
      this.staffProcessInfo.code = item.code
      this.staffProcessInfo.name = item.name
      this.staffProcessInfo.id = item.id
      this.staffProcessTypeList.forEach((itemType: any) => {
        itemType.check = !!item.rel_tag.find((itemFind: any) => itemFind.id === itemType.id)
      })
      if (item.process_desc !== null) {
        this.processStaffDescList = item.process_desc.split(',')
      }
    },
    getSide() {
      craftSetting.listSide().then((res) => {
        this.sideList = res.data.data
        this.sideTotal = this.sideList.length
      })
    },
    saveSide() {
      const formCheck = this.$formCheck(this.sideInfo, [
        {
          key: 'name',
          errMsg: '请输入边型'
        }
      ])
      if (!formCheck) {
        craftSetting
          .createSide({
            data: [this.sideInfo]
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.sideInfo = {
                id: null,
                name: ''
              }
              this.getSide()
            }
          })
      }
    },
    deleteSide(id: number) {
      this.$confirm('是否删除该边型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          craftSetting
            .deleteSide({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getSide()
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
    getMachine() {
      craftSetting.listMachine().then((res) => {
        this.machineList = res.data.data
        this.machineTotal = this.machineList.length
      })
    },
    saveMachine() {
      const formCheck = this.$formCheck(this.machineInfo, [
        {
          key: 'name',
          errMsg: '请输入机型'
        }
      ])
      if (!formCheck) {
        craftSetting
          .createMachine({
            data: [this.machineInfo]
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.machineInfo = {
                id: null,
                name: ''
              }
              this.getMachine()
            }
          })
      }
    },
    deleteMachine(id: number) {
      this.$confirm('是否删除该机型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          craftSetting
            .deleteMachine({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getMachine()
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
    getMethods() {
      craftSetting.listMethods().then((res) => {
        this.methodsList = res.data.data
        this.methodsTotal = this.methodsList.length
      })
    },
    saveMethods() {
      const formCheck = this.$formCheck(this.methodsInfo, [
        {
          key: 'name',
          errMsg: '请输入组织法'
        }
      ])
      if (!formCheck) {
        craftSetting
          .createMethods({
            data: [this.methodsInfo]
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.methodsInfo = {
                id: null,
                name: ''
              }
              this.getMethods()
            }
          })
      }
    },
    deleteMethods(id: number) {
      this.$confirm('是否删除该组织法?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          craftSetting
            .deleteMethods({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getMethods()
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
    getYarnColor() {
      yarnColor.list().then((res) => {
        this.yarnColorList = res.data.data
        this.yarnColorTotal = this.yarnColorList.length
      })
    },
    saveYarnColor() {
      const formCheck = this.$formCheck(this.yarnColorInfo, [
        {
          key: 'name',
          errMsg: '请输入颜色名称'
        },
        {
          key: 'color_code',
          errMsg: '请选择颜色色块'
        }
      ])
      if (!formCheck) {
        yarnColor
          .create({
            data: [this.yarnColorInfo]
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.yarnColorInfo = {
                color_code: '',
                name: '',
                id: null
              }
              this.getYarnColor()
            }
          })
      }
    },
    deleteYarnColor(id: number) {
      this.$confirm('是否删除该纱线颜色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          yarnColor
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getYarnColor()
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
    getClientEN() {
      // 获取token信息用于上传图片
      this.$checkCommonInfo([
        {
          checkWhich: 'status/token',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getTokenAsync'
        }
      ])
      billDocumentSetting.clientENDetail().then((res) => {
        if (res.data.status && res.data.data) {
          this.clientEN = res.data.data
        }
      })
    },
    saveClientEN() {
      const formCheck = this.$formCheck(this.clientEN, [
        {
          key: 'name',
          errMsg: '请输入公司英文名称(Company Name)'
        },
        {
          key: 'code',
          errMsg: '请输入公司统一社会信用代码(Company Social Credit Code)'
        },
        {
          key: 'address',
          errMsg: '请输入公司英文地址(Company Address)'
        },
        {
          key: 'tel',
          errMsg: '请输入电话号(Tel)'
        },
        {
          key: 'fax',
          errMsg: '请输入传真号(Fax)'
        },
        {
          key: 'signature',
          errMsg: '检测到未上传公司签章，请先上传'
        }
      ])
      if (!formCheck) {
        billDocumentSetting.clientENCreate(this.clientEN).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
            this.getClientEN()
          }
        })
      }
    },
    getBankEN() {
      billDocumentSetting.bankENDetail().then((res) => {
        if (res.data.status && res.data.data) {
          this.bankEN = res.data.data
        }
      })
    },
    saveBankEN() {
      const formCheck = this.$formCheck(this.clientEN, [
        {
          key: 'name',
          errMsg: '请输入开户银行(Bank Name)'
        },
        {
          key: 'address',
          errMsg: '请输入开户地址(Bank Address)'
        },
        {
          key: 'code',
          errMsg: '请输入银行SWIFT码(SWIFT Code)'
        },
        {
          key: 'beneficiary',
          errMsg: '请输入收款人(Beneficiary)'
        },
        {
          key: 'account_no',
          errMsg: '请输入开户账号(Account No)'
        }
      ])
      if (!formCheck) {
        billDocumentSetting.bankENCreate(this.bankEN).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
            this.getBankEN()
          }
        })
      }
    },
    getHSCode(page?: number) {
      const pages = page || this.HSCodePage
      billDocumentSetting
        .HSCodeList({
          page: pages,
          limit: 5,
          hs_code: this.searchHSCode
        })
        .then((res) => {
          this.HSCodeList = res.data.data
          this.HSCodeTotal = res.data.total
        })
    },
    getNormalClientList(page?: number) {
      const pages = page || this.normalClientPage
      billDocumentSetting
        .normalClientList({
          page: pages,
          limit: 5,
          name: this.searchNormalClient
        })
        .then((res) => {
          this.normalClientList = res.data.data.items
          this.normalClientTotal = res.data.data.total
        })
    },
    saveNormalClient() {
      const formCheck = this.$formCheck(this.normalClient, [
        {
          key: 'name',
          errMsg: '请输入公司名称'
        }
      ])
      if (!formCheck) {
        billDocumentSetting.normalClientCreate(this.normalClient).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
            this.showPopup = false
            this.getNormalClientList()
          }
        })
      }
    },
    deleteNormalClient(id: number) {
      this.$confirm('是否删除该常用公司?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          billDocumentSetting
            .normalClientDelete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getNormalClientList(1)
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
    getNormalCityList(page?: number) {
      const pages = page || this.normalCityPage
      billDocumentSetting
        .normalCityList({
          page: pages,
          limit: 5,
          name: this.searchNormalCity
        })
        .then((res) => {
          this.normalCityList = res.data.data.items
          this.normalCityTotal = res.data.data.total
        })
    },
    saveNormalCity() {
      const formCheck = this.$formCheck(this.normalCity, [
        {
          key: 'country',
          errMsg: '请输入国家名称'
        },
        {
          key: 'city',
          errMsg: '请输入城市名称'
        }
      ])
      if (!formCheck) {
        billDocumentSetting.normalCityCreate(this.normalCity).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
            this.showPopup = false
            this.getNormalCityList()
          }
        })
      }
    },
    deleteNormalCity(id: number) {
      this.$confirm('是否删除该常用城市?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          billDocumentSetting
            .normalCityDelete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getNormalCityList(1)
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
    getNormalCategoryList(page?: number) {
      const pages = page || this.normalCategoryPage
      billDocumentSetting
        .normalCategoryList({
          page: pages,
          limit: 5,
          name: this.searchNormalCategory
        })
        .then((res) => {
          this.normalCategoryList = res.data.data.items
          this.normalCategoryTotal = res.data.data.total
        })
    },
    saveNormalCategory() {
      const formCheck = this.$formCheck(this.normalCategory, [
        {
          key: 'name',
          errMsg: '请输入中文品名'
        }
      ])
      if (!formCheck) {
        billDocumentSetting.normalCategoryCreate(this.normalCategory).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
            this.showPopup = false
            this.getNormalCategoryList()
          }
        })
      }
    },
    deleteNormalCategory(id: number) {
      this.$confirm('是否删除该品名?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          billDocumentSetting
            .normalCategoryDelete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getNormalCategoryList(1)
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
    getNormalPayList(page?: number) {
      const pages = page || this.normalPayPage
      billDocumentSetting
        .normalPayList({
          page: pages,
          limit: 5,
          name: this.searchNormalPay
        })
        .then((res) => {
          this.normalPayList = res.data.data.items
          this.normalPayTotal = res.data.data.total
        })
    },
    saveNormalPay() {
      const formCheck = this.$formCheck(this.normalPay, [
        {
          key: 'name',
          errMsg: '请输入付款名称'
        }
      ])
      if (!formCheck) {
        billDocumentSetting.normalPayCreate(this.normalPay).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
            this.showPopup = false
            this.getNormalPayList()
          }
        })
      }
    },
    deleteNormalPay(id: number) {
      this.$confirm('是否删除该付款类型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          billDocumentSetting
            .normalPayDelete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getNormalPayList(1)
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
    buildYarnList(page?: number) {
      this.layoutData.yarnNameList = []
      let thresholdValues = Number(this.layoutData.thresholdValues)
      let fixedNum = thresholdValues.toString().split('.')[1] ? thresholdValues.toString().split('.')[1].length : 0
      let firstValue = Number(this.layoutData.firstValue)
      let lastValue = Number(this.layoutData.lastValue)
      let unit = this.layoutData.unit
      let yarnName = this.layoutData.yarnName
      let colorCodeUnit = this.layoutData.colorCodeUnit
      let firstColorCode = Number(this.layoutData.firstColorCode)
      let lastColorCode = Number(this.layoutData.lastColorCode)
      if (thresholdValues && (firstValue || firstValue === 0) && lastValue && unit && yarnName) {
        for (let i = firstValue; lastValue >= i; ) {
          if (colorCodeUnit && (firstColorCode || firstColorCode === 0) && lastColorCode) {
            for (let j = firstColorCode; lastColorCode >= j; j++) {
              this.layoutData.yarnNameList.push([i.toFixed(fixedNum), unit, yarnName, colorCodeUnit, j].join(''))
            }
          } else {
            this.layoutData.yarnNameList.push([i.toFixed(fixedNum), unit, yarnName].join(''))
          }
          i += thresholdValues
        }
      }
      console.log(this.layoutData.yarnNameList)
    },
    getYarnType(type: 1 | 2 | 3) {
      yarnType.list({ type: type }).then((res) => {
        this['yarnTypeList' + type] = res.data.data
      })
    },
    saveYarnType(type: 1 | 2 | 3) {
      const formCheck = this.$formCheck(this['yarnTypeInfo' + type], [
        {
          key: 'name',
          errMsg: '请输入纱线类型'
        }
      ])
      if (!formCheck) {
        yarnType.create(this['yarnTypeInfo' + type]).then((res) => {
          if (res.data.status) {
            this['yarnTypeList' + type].push({
              check: true,
              id: res.data.data.id,
              name: res.data.data.name,
              type: type
            })
            this['yarnTypeInfo' + type].name = ''
            this['yarnTypeFlag' + type] = false
            this.$message.success('添加成功')
          }
        })
      }
    },
    deleteYarnType(id: number, index: number, type: 1 | 2 | 3) {
      this.$confirm('是否删除该纱线类型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          yarnType
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this['yarnTypeList' + type].splice(index, 1)
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
    getYarn(type: 1 | 2 | 3, ifAll?: boolean) {
      this.yarnLoading = true
      const limit = ifAll ? 999 : 10
      yarn
        .list({
          type: type,
          limit: limit,
          page: this['yarnPage' + type],
          keyword: this['yarnKeyword' + type],
          only_delete: this.onlyDelete ? 1 : 0
        })
        .then((res) => {
          this['yarnList' + type] = res.data.data.items
          this['yarnTotal' + type] = res.data.data.total
          this.yarnLoading = false
        })
    },
    saveYarn(type: 1 | 2 | 3) {
      const realType = this['yarnTypeList' + type]
        .filter((item: { check: any }) => item.check)
        .map((item: { id: any }) => item.id)
      if (realType.length === 0) {
        this.$message.error('请至少选择一种类型')
        return
      }
      if (this.yarnAddType && !this['yarnInfo' + type].name) {
        this.$message.error('请填写名称')
        return
      }
      if (!this.yarnAddType && this.layoutData.yarnNameList.length === 0) {
        this.$message.error('请填写名称')
        return
      }
      yarn
        .create({
          id: this['yarnInfo' + type].id,
          name: this['yarnInfo' + type].name || this.layoutData.yarnNameList,
          type: type,
          yarn_rel_type: realType as number[],
          price_info: this['yarnInfo' + type].price_info
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('操作成功')
            this.getYarn(type)
            this.showPopup = false
          }
        })
    },
    updateYarn(info: any, type: 1 | 2 | 3) {
      this['yarnTypeList' + type].forEach((item: any) => {
        if (info.rel_type.indexOf(item.name) !== -1) {
          item.check = true
        }
      })
      this['yarnInfo' + type] = info
      this['yarnInfo' + type].price_info =
        info.rel_price.length > 0
          ? info.rel_price
          : [
              {
                desc: '',
                price: '',
                client_id: '',
                client_id_arr: []
              }
            ]
      this.showPopup = true
    },
    deleteYarn(id: number, type: 1 | 2 | 3) {
      this.$confirm('是否' + (this.onlyDelete ? '恢复' : '删除') + '该纱线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          yarn
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: (this.onlyDelete ? '恢复' : '删除') + '成功!'
                })
                this.getYarn(type)
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
    getDecorateMaterial() {
      decorateMaterial
        .list({
          keyword: this.decorateMaterialKeyword,
          only_delete: this.onlyDelete ? 1 : 0
        })
        .then((res) => {
          this.decorateMaterialList = res.data.data
          this.decorateMaterialTotal = res.data.data.length
        })
    },
    saveDecorateMaterial() {
      const formCheck = this.$formCheck(this.decorateMaterialInfo, [
        {
          key: 'name',
          errMsg: '请输入辅料名称'
        },
        {
          key: 'unit',
          errMsg: '请输入辅料单位'
        }
      ])
      if (!formCheck) {
        decorateMaterial.create({ data: [this.decorateMaterialInfo] }).then((res) => {
          if (res.data.status) {
            this.$message.success('操作成功')
            this.getDecorateMaterial()
            this.showPopup = false
          }
        })
      }
    },
    deleteDecorateMaterial(id: number) {
      this.$confirm('是否' + (this.onlyDelete ? '恢复' : '删除') + '该装饰辅料?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          decorateMaterial
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: (this.onlyDelete ? '恢复' : '删除') + '成功!'
                })
                this.getDecorateMaterial()
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
    getPackMaterial() {
      packMaterial
        .list({
          keyword: this.packMaterialKeyword,
          only_delete: this.onlyDelete ? 1 : 0
        })
        .then((res) => {
          this.packMaterialList = res.data.data
          this.packMaterialTotal = res.data.data.length
        })
    },
    savePackMaterial() {
      const formCheck = this.$formCheck(this.packMaterialInfo, [
        {
          key: 'name',
          errMsg: '请输入辅料名称'
        },
        {
          key: 'unit',
          errMsg: '请输入辅料单位'
        }
      ])
      if (!formCheck) {
        packMaterial.create(this.packMaterialInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.getPackMaterial()
          }
        })
      }
    },
    updatePackMaterial(info: any) {
      this.packMaterialInfo = info
      this.packMaterialInfo.price_info =
        info.rel_price.length > 0 ? info.rel_price : [{ desc: '', price: '', client_id: '', client_id_arr: [] }]
      this.showPopup = true
    },
    deletePackMaterial(id: number) {
      this.$confirm('是否' + (this.onlyDelete ? '恢复' : '删除') + '该包装辅料?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          packMaterial
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: (this.onlyDelete ? '恢复' : '删除') + '成功!'
                })
                this.getPackMaterial()
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
    getGroup() {
      group.list().then((res) => {
        if (res.data.status) {
          this.groupInfoList = res.data.data
          this.groupTotal = res.data.data.length
        }
      })
    },
    saveGroup() {
      const formCheck = this.$formCheck(this.groupInfo, [
        {
          key: 'name',
          errMsg: '请输入名字'
        }
      ])
      if (!formCheck) {
        group.create(this.groupInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.getGroup()
          }
        })
      }
    },
    deleteGroup(id: number) {
      this.$confirm('是否删除该小组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          group
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getGroup()
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
    getUser() {
      user.list().then((res) => {
        if (res.data.status) {
          this.userList = res.data.data
          this.userTotal = res.data.data.length
        }
      })
    },
    saveUser() {
      let formCheck = false
      if (!this.userUpdate) {
        formCheck = this.$formCheck(this.userInfo, [
          {
            key: 'phone',
            errMsg: '请填写手机号'
          },
          {
            key: 'sms_code',
            errMsg: '请填写验证码'
          }
        ])
      } else {
        formCheck = this.$formCheck(this.userInfo, [
          {
            key: 'phone',
            errMsg: '请填写手机号'
          }
        ])
      }

      if (!formCheck) {
        user.create(this.userInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.getUser()
            this.resetUser()
            this.showPopup = false
          }
        })
      }
    },
    updateUser() {
      let formCheck = false
      if (!this.userUpdate) {
        formCheck = this.$formCheck(this.userInfo, [
          {
            key: 'phone',
            errMsg: '请填写手机号'
          }
        ])
      } else {
        formCheck = this.$formCheck(this.userInfo, [
          {
            key: 'phone',
            errMsg: '请填写手机号'
          }
        ])
      }

      if (!formCheck) {
        this.getUpdateUser(this.userInfo)
        console.log(this.userInfo)
        user.update(this.userInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('修改成功')
            this.getUser()
            this.resetUser()
            this.showPopup = false
          }
        })
      }
    },
    resetUser() {
      this.userNav = '基本信息'
      this.userNavSon = ''
      this.userInfo = {
        name: '',
        user_name: '',
        password: '',
        phone: '',
        is_admin: 2, // 1：超管 2：普通用户
        module_info: [],
        has_check: 2,
        group_id: '',
        sms_code: '',
        only_search_self: 2,
        station: '' // 岗位
      }
      this.userUpdate = false
    },
    getUpdateUser(userInfo: UserInfo) {
      this.showPopup = true
      this.userUpdate = true
      this.userInfo = userInfo
      this.userNav = '基本信息'
      this.userNavSon = ''
      this.systemModuleArr.forEach((item: any) => {
        item.check = false
        if (
          this.userInfo.module_info &&
          (this.userInfo.module_info.indexOf(item.id) !== -1 ||
            this.userInfo.module_info.indexOf(item.id.toString()) !== -1)
        ) {
          item.check = true
        }
      })
      // 针对初始化为null做一下特殊处理
      if (!this.userInfo.module_info) {
        this.userInfo.module_info = []
      }
    },
    checkUser(id: number) {
      this.$confirm('是否修改用户状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          user
            .check({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.getUser()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
        })
    },
    deleteUser(id: number) {
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          user
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getUser()
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
    getQuotedPriceProduct() {
      this.$checkCommonInfo([
        {
          checkWhich: 'api/packMaterial',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getPackMaterialAsync'
        },
        {
          checkWhich: 'api/halfProcessType',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getHalfProcessTypeAsync'
        },
        {
          checkWhich: 'api/staffProcessType',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getStaffProcessTypeAsync'
        }
      ])
      quotedPrice.settingList().then((res) => {
        if (res.data.status) {
          this.quotedPriceProductList = res.data.data
          this.quotedPriceProductTotal = this.quotedPriceProductList.length
        }
      })
    },
    saveQuotedPriceProduct() {
      let formData = this.$clone(this.quotedPriceProduct)
      formData.weave_data = JSON.stringify(formData.weave_data)
      formData.semi_product_data = JSON.stringify(formData.semi_product_data)
      formData.pack_material_data = JSON.stringify(formData.pack_material_data)
      formData.others_data = JSON.stringify(formData.others_data)
      formData.production_data = JSON.stringify(formData.production_data)
      formData.others_fee_data = JSON.stringify(formData.other_fee_data)
      formData.no_production_fee_data = JSON.stringify(formData.no_production_fee_data)
      formData.material_data = JSON.stringify(formData.material_data)
      formData.assist_material_data = JSON.stringify(formData.assist_material_data)
      quotedPrice.settingCreate(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.quotedPriceProduct = {
            category_id: '',
            image_data: [],
            desc: '',
            transport_fee_desc: '',
            transport_fee: '',
            material_data: [
              {
                tree_data: [],
                material_id: '',
                material_name: '',
                weight: '',
                loss: '',
                price: '',
                total_price: '',
                unit: 'kg',
                desc: ''
              }
            ],
            assist_material_data: [
              {
                material_id: '',
                material_name: '',
                number: '',
                loss: '',
                price: '',
                total_price: '',
                unit: '',
                desc: ''
              }
            ],
            weave_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            semi_product_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            production_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            pack_material_data: [
              {
                material_name: '',
                material_id: '',
                desc: '',
                total_price: ''
              }
            ],
            other_fee_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ],
            no_production_fee_data: [
              {
                name: '',
                desc: '',
                total_price: ''
              }
            ]
          }
          this.showPopup = false
          this.getQuotedPriceProduct()
        }
      })
    },
    deleteQuotedPriceProduct(id: number) {
      this.$confirm('是否删除该报价模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          quotedPrice
            .settingDelete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getQuotedPriceProduct()
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
    lookQuotedPriceProduct(info: QuotedPriceProduct) {
      let formData = this.$clone(info)
      formData.weave_data = JSON.parse(formData.weave_data)
      formData.semi_product_data = JSON.parse(formData.semi_product_data)
      formData.pack_material_data = JSON.parse(formData.pack_material_data)
      // formData.others_data = JSON.parse(formData.others_data)
      formData.production_data = JSON.parse(formData.production_data)
      formData.no_production_fee_data = formData.no_production_fee_data
        ? JSON.parse(formData.no_production_fee_data)
        : [
            {
              name: '',
              desc: '',
              total_price: ''
            }
          ]
      formData.other_fee_data = formData.others_fee_data
        ? JSON.parse(formData.others_fee_data)
        : [
            {
              name: '',
              desc: '',
              total_price: ''
            }
          ]
      // formData.material_data = JSON.parse(formData.material_data)
      // formData.assist_material_data = JSON.parse(formData.assist_material_data)
      this.quotedPriceProduct = formData
      this.quotedPriceProductUpdate = true
      this.showPopup = true
    },
    getQuotedPriceDesc() {
      quotedPrice
        .descDetail({
          category_id: this.quotedPriceCategoryId
        })
        .then((res) => {
          if (res.data.status) {
            this.quotedPriceDesc.type = res.data.data.type
            this.quotedPriceDesc.desc = res.data.data.desc
          }
        })
    },
    saveQuotedPriceDesc() {
      quotedPrice
        .descCreate({
          type: this.quotedPriceDesc.type,
          category_id: this.quotedPriceCategoryId,
          desc: this.quotedPriceDesc.desc
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('添加说明成功')
            this.showPopup = false
          }
        })
    },
    lookQuotedPriceDescDetail(info: any) {
      this.quotedPriceCategoryId = info.id
      this.showPopup = true
      this.getQuotedPriceDesc()
    },
    getCompany() {
      let _this = this

      companyInfo.detail().then((res) => {
        if (res.data.status) {
          this.companyInfo = res.data.data

          clientBind.qrCode().then((res) => {
            _this.qrCodeUrl = res.data.data
          })
        }
      })
    },
    saveCompany() {
      companyInfo.create(this.companyInfo).then((res) => {
        if (res.data.status) {
          this.$message.success('保存成功')
          this.getCompany()
        }
      })
    },
    getYarnPrice() {
      this.$checkCommonInfo([
        {
          checkWhich: 'api/clientType',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getClientTypeAsync'
        }
      ])
      yarnPrice
        .list({
          limit: 5,
          page: this.yarnPricePage,
          keyword: this.yarnPriceKeyword1,
          material_type: 1
        })
        .then((res) => {
          if (res.data.status) {
            this.yarnPriceList = res.data.data.items
            this.yarnPriceTotal = res.data.data.total
          }
        })
    },
    resetYarnPrice() {
      this.yarnPrice = {
        id: '',
        client_id: '',
        material_type: 1,
        info_data: [
          {
            id: '',
            material_id: '',
            material_arr: [],
            material_color: '',
            attribute: '',
            price: '',
            desc: ''
          }
        ]
      }
    },
    saveYarnPrice() {
      const formCheck =
        this.$formCheck(this.yarnPrice, [
          {
            key: 'client_id',
            errMsg: '请选择报价单位'
          }
        ]) ||
        this.yarnPrice.info_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'material_id',
              errMsg: '请选择纱线名称'
            },
            {
              key: 'material_color',
              errMsg: '请输入纱线颜色'
            },
            {
              key: 'price',
              errMsg: '请输入单价'
            }
          ])
        })
      if (!formCheck) {
        yarnPrice.create(this.yarnPrice).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
            this.getYarnPrice()
            this.showPopup = false
            this.yarnPriceUpdate = false
            this.resetYarnPrice()
          }
        })
      }
    },
    deleteYarnPrice(id: number) {
      this.$confirm('是否删除该报价信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          yarnPrice
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getYarnPrice()
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
    getMianliaoPrice() {
      this.$checkCommonInfo([
        {
          checkWhich: 'api/clientType',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getClientTypeAsync'
        }
      ])
      yarnPrice
        .list({
          limit: 5,
          page: this.mianliaoPricePage,
          keyword: this.yarnPriceKeyword2,
          material_type: 2
        })
        .then((res) => {
          if (res.data.status) {
            this.mianliaoPriceList = res.data.data.items
            this.mianliaoPriceTotal = res.data.data.total
          }
        })
    },
    saveMianliaoPrice() {
      const formCheck =
        this.$formCheck(this.mianliaoPrice, [
          {
            key: 'client_id',
            errMsg: '请选择报价单位'
          }
        ]) ||
        this.mianliaoPrice.info_data.some((item) => {
          return this.$formCheck(item, [
            {
              key: 'material_id',
              errMsg: '请选择面料名称'
            },
            {
              key: 'material_color',
              errMsg: '请输入面料颜色'
            },
            {
              key: 'price',
              errMsg: '请输入单价'
            }
          ])
        })
      if (!formCheck) {
        yarnPrice.create(this.mianliaoPrice).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.getMianliaoPrice()
            this.showPopup = false
            this.mianliaoPriceUpdate = false
            this.resetMianliaoPrice()
          }
        })
      }
    },
    deleteMianliaoPrice(id: number) {
      this.$confirm('是否删除该报价信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          yarnPrice
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getMianliaoPrice()
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
    resetMianliaoPrice() {
      this.mianliaoPrice = {
        id: '',
        client_id: '',
        material_type: 2,
        info_data: [
          {
            id: '',
            material_id: '',
            material_arr: [],
            material_color: '',
            attribute: '',
            price: '',
            desc: ''
          }
        ]
      }
    },
    saveStatusConfig() {
      checkConfig.savePush(this.pushCheckConfig).then((res) => {
        if (res.data.status) {
          this.$message.success('保存成功')
        }
      })
    },
    saveCheckConfig(type: number) {
      if (type === 17) {
        checkConfig.save(this.sampleOrderCheckConfig).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      } else if (type === 1) {
        checkConfig.save(this.orderCheckConfig).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      } else if (type === 9) {
        checkConfig.save(this.materialPlanCheckConfig).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      } else if (type === 2) {
        checkConfig.save(this.materialOrderCheckConfig).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      } else if (type === 3) {
        checkConfig.save(this.materialProcessCheckConfig).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      } else if (type === 6) {
        checkConfig.save(this.materialStockCheckConfig).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      } else if (type === 18) {
        checkConfig.save(this.accessoriesOrderCheckConfig).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      } else if (type === 4) {
        checkConfig.save(this.productionPlanCheckConfig).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      } else if (type === 11) {
        checkConfig.save(this.packOrderCheckConfig).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      } else if (type === 14) {
        checkConfig.save(this.gongziCheckConfig).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      } else if (type === 13) {
        checkConfig.save(this.packOutCheckConfig).then((res) => {
          if (res.data.status) {
            this.$message.success('保存成功')
          }
        })
      }
    }
  },
  computed: {
    clientList() {
      return this.$store.state.api.clientType.arr.filter((item: { type: any }) => Number(item.type) === 1)
    },
    userListCommon() {
      return this.$store.state.api.user.arr
    },
    // 纱线原料单位——纱线报价用
    yarnClientList() {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '纱线原料单位')
    },
    // 纱线原料单位——纱线报价用
    mianliaoClientList() {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '面料原料单位')
    },
    // 装饰辅料单位
    decorateMaterialClientList() {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '装饰辅料单位')
    },
    packMaterialClientList() {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '包装辅料单位')
    },
    // 包装辅料——报价单里用
    packMaterialStore(): PackMaterialInfo[] {
      return this.$store.state.api.packMaterial.arr
    },
    // 半成品加工工序——报价单设置用
    halfProcessStore() {
      return this.$store.state.api.halfProcessType.arr.map((item: any) => {
        return {
          label: item.name,
          value: item.name,
          children: item.children.map((itemChild: any) => {
            return {
              label: itemChild.name,
              value: itemChild.name
            }
          })
        }
      })
    },
    finishedList() {
      return this.$store.state.api.staffProcessType.arr.map((item: any) => {
        return {
          label: item.name,
          value: item.name,
          children: item.children.map((itemChild: any) => {
            return {
              label: itemChild.name,
              value: itemChild.name
            }
          })
        }
      })
    },
    styleArr(): StyleInfo[] {
      return this.styleList.slice((this.stylePage - 1) * 5, this.stylePage * 5)
    },
    categoryArr(): CategoryInfo[] {
      return this.categoryList.slice((this.categoryPage - 1) * 5, this.categoryPage * 5)
    },
    ingredientArr(): IngredientInfo[] {
      return this.ingredientList.slice((this.ingredientPage - 1) * 5, this.ingredientPage * 5)
    },
    colourArr(): ColourInfo[] {
      return this.colourList.slice((this.colourPage - 1) * 5, this.colourPage * 5)
    },
    sizeArr(): SizeSetting[] {
      return this.sizeList.slice((this.sizePage - 1) * 5, this.sizePage * 5)
    },
    sizeModuleArr(): SizeModuleSetting[] {
      return this.sizeModuleList.slice((this.sizeModulePage - 1) * 5, this.sizeModulePage * 5)
    },
    orderTypeArr(): OrderType[] {
      return this.orderTypeList.slice((this.orderTypePage - 1) * 5, this.orderTypePage * 5)
    },
    sampleOrderTypeArr(): OrderType[] {
      return this.sampleOrderTypeList.slice((this.sampleOrderTypePage - 1) * 5, this.sampleOrderTypePage * 5)
    },
    materialProcessArr(): ProcessInfo[] {
      return this.materialProcessList.slice((this.materialProcessPage - 1) * 5, this.materialProcessPage * 5)
    },
    halfProcessArr(): ProcessInfo[] {
      return this.halfProcessList.slice((this.halfProcessPage - 1) * 5, this.halfProcessPage * 5)
    },
    staffProcessArr(): ProcessInfo[] {
      return this.staffProcessList.slice((this.staffProcessPage - 1) * 5, this.staffProcessPage * 5)
    },
    sideArr(): SideInfo[] {
      return this.sideList.slice((this.sidePage - 1) * 5, this.sidePage * 5)
    },
    machineArr(): MachineInfo[] {
      return this.machineList.slice((this.machinePage - 1) * 5, this.machinePage * 5)
    },
    methodsArr(): MachineInfo[] {
      return this.methodsList.slice((this.methodsPage - 1) * 5, this.methodsPage * 5)
    },
    yarnColorArr(): YarnColorInfo[] {
      return this.yarnColorList.slice((this.yarnColorPage - 1) * 5, this.yarnColorPage * 5)
    },
    decorateMaterialArr(): DecorateMaterialInfo[] {
      return this.decorateMaterialList.slice((this.decorateMaterialPage - 1) * 10, this.decorateMaterialPage * 10)
    },
    packMaterialArr(): PackMaterialInfo[] {
      return this.packMaterialList.slice((this.packMaterialPage - 1) * 10, this.packMaterialPage * 10)
    },
    groupArr(): GroupInfo[] {
      return this.groupInfoList.slice((this.groupPage - 1) * 5, this.groupPage * 5)
    },
    userArr(): UserInfo[] {
      return this.userList.slice((this.userPage - 1) * 5, this.userPage * 5)
    },
    quotedPriceProductArr(): QuotedPriceProduct[] {
      return this.quotedPriceProductList.slice((this.quotedPriceProductPage - 1) * 5, this.quotedPriceProductPage * 5)
    }
  },
  watch: {
    pName(
      newVal:
        | '产品设置'
        | '订单设置'
        | '报价单设置'
        | '工序设置'
        | '工艺单设置'
        | '物料设置'
        | '工厂信息设置'
        | '系统账户管理'
        | '打印设置'
        | '单证设置',
      oldVal
    ) {
      // 第一次进页面的时候pName是空字符串，不需要触发watch
      if (oldVal) {
        this.cName = this.nav[newVal][0]
      }
    },
    cName(newVal) {
      this.$router.push('/setting/?pName=' + this.pName + '&cName=' + newVal)
    },
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  mounted() {
    this.getFilters()
    this.getList()
    // @ts-ignore 根据权限开放菜单
    if (this.$getsessionStorage('module_id') && JSON.parse(this.$getsessionStorage('module_id')).length > 0) {
      const arr = JSON.parse(this.$getsessionStorage('module_id'))
      if (arr.indexOf('16-1') === -1) {
        delete this.nav['产品设置']
      }
      if (arr.indexOf('16-2') === -1) {
        delete this.nav['订单设置']
      }
      if (arr.indexOf('16-3') === -1) {
        delete this.nav['报价单设置']
      }
      if (arr.indexOf('16-4') === -1) {
        delete this.nav['工序设置']
      }
      if (arr.indexOf('16-5') === -1) {
        delete this.nav['工艺单设置']
      }
      if (arr.indexOf('16-6') === -1) {
        delete this.nav['物料设置']
      }
      if (arr.indexOf('16-7') === -1) {
        delete this.nav['工厂信息设置']
      }
      if (arr.indexOf('16-8') === -1) {
        delete this.nav['系统账户管理']
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/setting/setting.less';
</style>
<style lang="less">
.el-upload-dragger {
  line-height: 180px;
}

.tc {
  text-align: center;
}

.border {
  border: 1px solid #dcdfe6;
  padding: 5px 30px;
}
</style>