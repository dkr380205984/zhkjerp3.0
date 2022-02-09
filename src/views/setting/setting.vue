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
            :class="{'active':pName===key}"
            v-for="(item,key,index) in nav"
            :key="index"
            @click="pName=key">{{key}}</div>
        </div>
        <div class="navSon">
          <div class="nav"
            :class="{'active':cName===item}"
            v-for="(item,index) in nav[pName]"
            :key="index"
            @click="cName=item">{{item}}</div>
        </div>
        <div class="mainSetting">
          <template v-if="cName==='品类'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加新品类</div>
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
                  v-for="(item,index) in categoryArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">{{item.secondary_category.map((item)=>item.name).join(',')}}</div>
                  <div class="col">{{item.unit}}</div>
                  <div class="col">{{item.code}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteCategory(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="styleTotal"
                  :current-page.sync="stylePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='款式'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加新款式</div>
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
                  v-for="(item,index) in styleArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteStyle(item.id)">删除</span>
                  </div>
                </div>

              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="styleTotal"
                  :current-page.sync="stylePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='成分'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加成分</div>
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
                  v-for="(item,index) in ingredientArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteIngredient(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="ingredientTotal"
                  :current-page.sync="ingredientPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='配色组'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加配色组</div>
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
                  v-for="(item,index) in colourArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteColour(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="colourTotal"
                  :current-page.sync="colourPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='尺码'">
            <div class="listCtn">
              <div class="list">
                <div class="row title">
                  <div class="col">大类名称</div>
                  <div class="col">尺码信息</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in sizeArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span v-for="(itemSize,indexSize) in item.size"
                      :key="indexSize">{{indexSize>0?'/' + itemSize.name:itemSize.name}}</span>
                  </div>
                  <div class="col">
                    <span class="opr hoverBlue"
                      @click="addSize(item.id)">新增尺码</span>
                    <span class="opr hoverRed"
                      @click="delSize(item.child_size)">删除尺码</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="sizeTotal"
                  :current-page.sync="sizePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='订单类型'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加类型</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">类型</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in orderTypeArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteOrderType(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="orderTypeTotal"
                  :current-page.sync="orderTypePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='样单类型'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加类型</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">类型</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in sampleOrderTypeArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteSampleOrderType(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="sampleOrderTypeTotal"
                  :current-page.sync="sampleOrderTypePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='原料加工工序'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加原料加工工序</div>
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
                  v-for="(item,index) in materialProcessArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteMaterialProcess(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="materialProcessTotal"
                  :current-page.sync="materialProcessPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='半成品加工'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加加工工序</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('semiProcess')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('semiProcess')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">加工工序</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in halfProcessArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteHalfProcess(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="halfProcessTotal"
                  :current-page.sync="halfProcessPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='成品加工工序'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加成品加工工序</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('staffProcess')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('staffProcess')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">成品加工工序</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in staffProcessArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteStaffProcess(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="staffProcessTotal"
                  :current-page.sync="staffProcessPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='边型'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加边型</div>
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
                  v-for="(item,index) in sideArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteSide(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="sideTotal"
                  :current-page.sync="sidePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='机型'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加机型</div>
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
                  v-for="(item,index) in machineArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteMachine(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="machineTotal"
                  :current-page.sync="machinePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='组织法'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加组织法</div>
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
                  v-for="(item,index) in methodsArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteMethods(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="methodsTotal"
                  :current-page.sync="methodsPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='纱线颜色'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加颜色</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('yarnColor')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('yarnColor')">下载导入模板</div>
                <div class="hoverBlue fr"
                  style="cursor:pointer;line-height:32px"
                  @click="$openUrl('http://www.pantone.net.cn/pantone/search/input.htm')">查询潘通色号</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">纱线颜色</div>
                  <div class="col">色块</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in yarnColorArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <div class="rect"
                      :style="{'background':item.color_code}"></div>
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
                  layout="prev, pager, next"
                  :total="yarnColorTotal"
                  :current-page.sync="yarnColorPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='英文工厂信息'">
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
                    v-model="clientEN.fax">
                  </el-input>
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
                    :file-list="clientEN.signature ? [{url:clientEN.signature}] : []"
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
                    :file-list="clientEN.special_seal ? [{url:clientEN.special_seal}] : []"
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
          <template v-if="cName==='英文银行信息'">
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
          <template v-if="cName==='HS编码设置'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="elCtn fl">
                  <el-input placeholder="请输入HS编码查询"
                    v-model="searchHSCode"
                    clearable></el-input>
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
                    v-for="(item,index) in HSCodeList"
                    :key="index">
                    <div class="column">{{item.hs_code}}</div>
                    <div class="column">
                      <zh-overflow-text :content="item.product_name"></zh-overflow-text>
                    </div>
                    <div class="column">{{item.export}}</div>
                    <div class="column">{{item.export_rebate}}</div>
                    <div class="column">{{item.temporary_export || '暂无'}}</div>
                    <div class="column">{{item.vat_rate}}</div>
                    <div class="column">{{item.most_favored_nation}}</div>
                    <div class="column">{{item.provisional_import_tariff || '暂无'}}</div>
                    <div class="column">{{item.import_general_duty}}</div>
                    <div class="column">{{item.consumption}}</div>
                    <div class="column">{{item.first_legal_unit}}</div>
                    <div class="column">{{item.second_statutory_unit}}</div>
                    <div class="column">{{item.first_legal_unit_code}}</div>
                    <div class="column">{{item.second_legal_unit_code}}</div>
                    <div class="column">
                      <zh-overflow-text :content="item.regulatory_condition_info"
                        :line="2"></zh-overflow-text>
                    </div>
                    <div class="column">{{item.quarantine_category_code}}</div>
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
                      v-for="(item,index) in HSCodeList"
                      :key="index">
                      <div class="column">{{item.hs_code}}</div>
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
                  layout="prev, pager, next"
                  :total="HSCodeTotal"
                  :current-page.sync="HSCodePage"
                  @current-change="getHSCode">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='纱线原料'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加纱线</div>
                <div class="btn backHoverOrange fr"
                  @click="showYarn = true">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('yarn1')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">纱线名称</div>
                  <div class="col">纱线类型</div>
                  <div class="col">参考报价</div>
                  <div class="col">添加人</div>
                  <div class="col">添加时间</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in yarnList1"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">{{item.rel_type.join('/')}}</div>
                  <div class="col">{{item.rel_price|filterPrice}}</div>
                  <div class="col">{{item.user_name}}</div>
                  <div class="col">{{item.created_at}}</div>
                  <div class="col">
                    <span class="opr hoverBlue">
                      <el-popover placement="bottom"
                        title="报价详情"
                        width="600"
                        trigger="manual"
                        v-model="item.look">
                        <div class="tableCtn"
                          style="padding:0">
                          <div class="thead">
                            <div class="trow">
                              <div class="tcol">单位名称</div>
                              <div class="tcol">报价</div>
                              <div class="tcol">备注</div>
                            </div>
                          </div>
                          <div class="tbody">
                            <div class="trow"
                              v-for="(itemChild,indexChild) in item.rel_price"
                              :key="indexChild">
                              <div class="tcol">{{itemChild.client_name}}</div>
                              <div class="tcol">{{itemChild.price}}元/kg</div>
                              <div class="tcol">{{itemChild.desc || '无'}}</div>
                            </div>
                          </div>
                        </div>
                        <span slot="reference"
                          @click="item.look=!item.look">{{item.look?'关闭报价':'查看报价'}}</span>
                      </el-popover>
                    </span>
                    <span class="opr hoverRed"
                      @click="deleteYarn(item.id,1)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="yarnTotal1"
                  :current-page.sync="yarnPage1"
                  @current-change="getYarn(1)">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='面料原料'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加面料</div>
                <div class="btn backHoverOrange fr"
                  @click="showYarn = true">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('yarn2')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">面料名称</div>
                  <div class="col">面料类型</div>
                  <div class="col">参考报价</div>
                  <div class="col">添加人</div>
                  <div class="col">添加时间</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in yarnList2"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">{{item.rel_type.join('/')}}</div>
                  <div class="col">{{item.rel_price|filterPrice}}</div>
                  <div class="col">{{item.user_name}}</div>
                  <div class="col">{{item.created_at}}</div>
                  <div class="col">
                    <span class="opr hoverBlue">
                      <el-popover placement="bottom"
                        title="报价详情"
                        width="600"
                        trigger="manual"
                        v-model="item.look">
                        <div class="tableCtn"
                          style="padding:0">
                          <div class="thead">
                            <div class="trow">
                              <div class="tcol">单位名称</div>
                              <div class="tcol">报价</div>
                              <div class="tcol">备注</div>
                            </div>
                          </div>
                          <div class="tbody">
                            <div class="trow"
                              v-for="(itemChild,indexChild) in item.rel_price"
                              :key="indexChild">
                              <div class="tcol">{{itemChild.client_name}}</div>
                              <div class="tcol">{{itemChild.price}}元/kg</div>
                              <div class="tcol">{{itemChild.desc || '无'}}</div>
                            </div>
                          </div>
                        </div>
                        <span slot="reference"
                          @click="item.look=!item.look">{{item.look?'关闭报价':'查看报价'}}</span>
                      </el-popover>
                    </span>
                    <span class="opr hoverRed"
                      @click="deleteYarn(item.id,2)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="yarnTotal2"
                  :current-page.sync="yarnPage2"
                  @current-change="getYarn(2)">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='毛料原料'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加毛料</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">毛料名称</div>
                  <div class="col">毛料类型</div>
                  <div class="col">参考报价</div>
                  <div class="col">添加人</div>
                  <div class="col">添加时间</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in yarnList3"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">{{item.rel_type.join('/')}}</div>
                  <div class="col">{{item.rel_price|filterPrice}}</div>
                  <div class="col">{{item.user_name}}</div>
                  <div class="col">{{item.created_at}}</div>
                  <div class="col">
                    <span class="opr hoverRed">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="yarnTotal3"
                  :current-page.sync="yarnPage3"
                  @current-change="getYarn(1)">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='装饰辅料'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加辅料</div>
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
                  v-for="(item,index) in decorateMaterialArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">{{item.unit}}</div>
                  <div class="col">{{item.rel_price|filterPrice}}</div>
                  <div class="col">{{item.user_name}}</div>
                  <div class="col">{{item.created_at}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteDecorateMaterial(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="decorateMaterialTotal"
                  :current-page.sync="decorateMaterialPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='包装辅料'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加辅料</div>
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
                  v-for="(item,index) in packMaterialArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">{{item.unit}}</div>
                  <div class="col">计价方式</div>
                  <div class="col">参考报价</div>
                  <div class="col">添加人</div>
                  <div class="col">添加时间</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deletePackMaterial(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="packMaterialTotal"
                  :current-page.sync="packMaterialPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='纱线报价'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加报价</div>
              </div>
              <div class="list">
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">报价单位</div>
                      <div class="tcol noPad"
                        style="flex:5">
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
                      v-for="item in yarnPriceArr"
                      :key="item.id">
                      <div class="tcol">{{item.client_name}}</div>
                      <div class="tcol noPad"
                        style="flex:5">
                        <div class="trow"
                          v-for="(itemChild,indexChild) in item.info_data"
                          :key="indexChild">
                          <div class="tcol">{{itemChild.material_name}}</div>
                          <div class="tcol">{{itemChild.material_color}}</div>
                          <div class="tcol">{{itemChild.attribute}}</div>
                          <div class="tcol">{{itemChild.price}}元/kg</div>
                          <div class="tcol">{{itemChild.desc}}</div>
                        </div>
                      </div>
                      <div class="tcol oprCtn">
                        <span class="opr hoverOrange"
                          @click="yarnPrice=item;showPopup=true;yarnPriceUpdate=true">修改</span>
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
                  layout="prev, pager, next"
                  :total="yarnPriceTotal"
                  :current-page.sync="yarnPricePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='面料报价'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加报价</div>
              </div>
              <div class="list">
                <div class="tableCtn">
                  <div class="thead">
                    <div class="trow">
                      <div class="tcol">报价单位</div>
                      <div class="tcol noPad"
                        style="flex:5">
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
                      v-for="item in mianliaoPriceArr"
                      :key="item.id">
                      <div class="tcol">{{item.client_name}}</div>
                      <div class="tcol noPad"
                        style="flex:5">
                        <div class="trow"
                          v-for="(itemChild,indexChild) in item.info_data"
                          :key="indexChild">
                          <div class="tcol">{{itemChild.material_name}}</div>
                          <div class="tcol">{{itemChild.material_color}}</div>
                          <div class="tcol">{{itemChild.price}}元/kg</div>
                          <div class="tcol">{{itemChild.desc}}</div>
                        </div>
                      </div>
                      <div class="tcol oprCtn">
                        <span class="opr hoverOrange"
                          @click="mianliaoPrice=item;showPopup=true;mianliaoPriceUpdate=true">修改</span>
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
                  layout="prev, pager, next"
                  :total="mianliaoPriceTotal"
                  :current-page.sync="mianliaoPricePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='模板预加载'">
            <div class="listCtn">
              <div class="list">
                <div class="row title">
                  <div class="col">说明类型</div>
                  <div class="col">添加说明</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in priceRemarkList"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteSide(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="sideTotal"
                  :current-page.sync="sidePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='负责小组/人'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加小组/人</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">小组/人</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in groupArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteGroup(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="groupTotal"
                  :current-page.sync="groupPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='系统账户管理'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加帐号</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">姓名</div>
                  <div class="col">用户名</div>
                  <div class="col">手机号</div>
                  <div class="col">岗位</div>
                  <div class="col">小组</div>
                  <div class="col">审核权限</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in userArr"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">{{item.user_name}}</div>
                  <div class="col">{{item.phone}}</div>
                  <div class="col">{{item.station}}</div>
                  <div class="col">{{item.group_name}}</div>
                  <div class="col">{{item.has_check===1?'有审核权限':'无权限'}}</div>
                  <div class="col">
                    <span class="opr hoverRed"
                      @click="deleteUser(item.id)">删除</span>
                    <span class="opr hoverOrange"
                      @click="getUpdateUser(item)">修改</span>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="userTotal"
                  :current-page.sync="userPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='报价模板'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加报价模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">预设名称</div>
                  <div class="col">绑定品类</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in quotedPriceProductArr"
                  :key="index">
                  <div class="col">{{item.title}}</div>
                  <div class="col">{{item.category_name}}</div>
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
                  layout="prev, pager, next"
                  :total="groupTotal"
                  :current-page.sync="groupPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='报价说明'">
            <div class="listCtn">
              <div class="list">
                <div class="row title">
                  <div class="col">品类信息</div>
                  <div class="col">操作</div>
                </div>
                <div class="row"
                  v-for="(item,index) in categoryList"
                  :key="index">
                  <div class="col">{{item.name}}</div>
                  <div class="col">
                    <span class="opr hoverBlue"
                      @click="lookQuotedPriceDescDetail(item)">查看</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="cName==='基本信息'">
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
                    :file-list="[companyInfo.logo]"
                    ref="companyLogo">
                    <img v-if="companyInfo.logo"
                      :src="companyInfo.logo"
                      class="logo-img"
                      style="width:100%;height:100%">
                    <i v-else
                      class="el-icon-plus logo-icon"></i>
                  </el-upload>
                  <div class="prompt">点击或拖拽图片至上传框,只能上传jpg/png文件，且不超过6MB</div>
                </div>
              </div>
              <div class="row">
                <div class="label">公司二维码：</div>
                <div class="content border tc">
                  <div>
                    <img :src="qrCodeUrl"/>
                  </div>
                  <div>织为云外协生产小程序</div>
                  <div>微信扫一扫，在线管理加工单进度</div>
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
                    style="width:600px;"
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
                    v-model="companyInfo.email">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司地址：</span>
                <div class="content">
                  <el-input placeholder="请输入公司地址"
                    class="input-item"
                    v-model="companyInfo.address">
                  </el-input>
                </div>
              </div>
              <div class="btnCtn">
                <div class="btn backHoverBlue"
                  @click="saveCompany">保存修改</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showPopup">
      <template v-if="cName==='品类'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增品类</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              v-for="(item,index) in categoryInfo.secondary_category"
              :key="index">
              <div class="label">{{index===0?'二级品类：':''}}</div>
              <div class="info">
                <el-input placeholder="请输入二级品类名称"
                  v-model="item.name"></el-input>
                <div class="info_btn hoverBlue"
                  @click="$addItem(categoryInfo.secondary_category,{name:'',id:''})"
                  v-if="index===0">添加</div>
                <div class="info_btn hoverRed"
                  @click="$deleteItem(categoryInfo.secondary_category,index)"
                  v-if="index>0">删除</div>
              </div>
            </div>
            <div class="row">
              <div class="label">品类单位：</div>
              <div class="info">
                <el-input placeholder="请输入品类单位"
                  v-model="categoryInfo.unit"></el-input>
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveCategory">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='款式'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增款式</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveStyle">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='成分'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增成分</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveIngredient">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='配色组'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增配色</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveColour">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='尺码'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增尺码</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveSize">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='订单类型'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增订单类型</div>
            <div class="closeCtn"
              @click="showPopup=false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">订单类型：</div>
              <div class="info">
                <el-input placeholder="请输入订单类型"
                  v-model="orderTypeInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveOrderType">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='样单类型'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增样单类型</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveSampleOrderType">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='原料加工工序'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增原料加工工序</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveMaterialProcess">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='半成品加工'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增加工工序</div>
            <div class="closeCtn"
              @click="showPopup=false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">加工工序：</div>
              <div class="info">
                <el-input placeholder="请输入加工工序"
                  v-model="halfProcessInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveHalfProcess">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='成品加工工序'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增成品加工工序</div>
            <div class="closeCtn"
              @click="showPopup=false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">成品加工工序：</div>
              <div class="info">
                <el-input placeholder="请输入成品加工工序"
                  v-model="staffProcessInfo.name"></el-input>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveStaffProcess">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='边型'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增边型</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveSide">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='机型'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增机型</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveMachine">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='组织法'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增组织法</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveMethods">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='纱线颜色'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增颜色</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveYarnColor">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='纱线原料'">
        <div class="main"
          style="width:920px">
          <div class="titleCtn">
            <div class="text">新增纱线</div>
            <div class="closeCtn"
              @click="showPopup=false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">添加方式：</div>
              <div class="info"
                style="line-height:34px">
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
                  v-for="(itemYarn,indexYarn) in layoutData.yarnNameList"
                  :key="indexYarn">
                  <span class="name">{{itemYarn}}</span>
                  <span class="el-icon-close icon"
                    @click="$deleteItem(layoutData.yarnNameList,indexYarn)"></span>
                </span>
              </div>
            </div>
            <div class="row">
              <div class="label">选择类型：</div>
              <div class="info tagCtn">
                <span class="yarnNameTag"
                  :class="{'active':item.check,'unactive':!item.check}"
                  v-for="(item,index) in yarnTypeList1"
                  :key="item.id"
                  @click="item.check=!item.check;$forceUpdate()">
                  <span class="name">{{item.name}}</span>
                  <span class="el-icon-close icon"
                    @click.stop="deleteYarnType(item.id,index,1)"></span>
                </span>
                <span class="elCtn"
                  v-show="yarnTypeFlag1">
                  <el-input placeholder="输入新增类型"
                    v-model="yarnTypeInfo1.name"></el-input>
                </span>
                <span class="yarnNameTag"
                  :class="yarnTypeFlag1?'active':'addBtn'"
                  @click="yarnTypeFlag1?saveYarnType(1):yarnTypeFlag1=true">{{yarnTypeFlag1?'保存类型':'新增类型'}}
                  <i :class="yarnTypeFlag1?'el-icon-document-checked':'el-icon-plus'"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveYarn(1)">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='面料原料'">
        <div class="main"
          style="width:920px">
          <div class="titleCtn">
            <div class="text">新增面料</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
                  :class="{'active':item.check,'unactive':!item.check}"
                  v-for="(item,index) in yarnTypeList2"
                  :key="item.id"
                  @click="item.check=!item.check;$forceUpdate()">
                  <span class="name">{{item.name}}</span>
                  <span class="el-icon-close icon"
                    @click.stop="deleteYarnType(item.id,index,2)"></span>
                </span>
                <span class="elCtn"
                  v-show="yarnTypeFlag2">
                  <el-input placeholder="输入新增类型"
                    v-model="yarnTypeInfo2.name"></el-input>
                </span>
                <span class="yarnNameTag"
                  :class="yarnTypeFlag2?'active':'addBtn'"
                  @click="yarnTypeFlag2?saveYarnType(2):yarnTypeFlag2=true">{{yarnTypeFlag2?'保存类型':'新增类型'}}
                  <i :class="yarnTypeFlag2?'el-icon-document-checked':'el-icon-plus'"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveYarn(2)">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='毛料原料'">
        <div class="main"
          style="width:920px">
          <div class="titleCtn">
            <div class="text">新增毛料</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
                  :class="{'active':item.check,'unactive':!item.check}"
                  v-for="(item,index) in yarnTypeList3"
                  :key="item.id"
                  @click="item.check=!item.check;$forceUpdate()">
                  <span class="name">{{item.name}}</span>
                  <span class="el-icon-close icon"
                    @click.stop="deleteYarnType(item.id,index,3)"></span>
                </span>
                <span class="elCtn"
                  v-show="yarnTypeFlag3">
                  <el-input placeholder="输入新增类型"
                    v-model="yarnTypeInfo3.name"></el-input>
                </span>
                <span class="yarnNameTag"
                  :class="yarnTypeFlag3?'active':'addBtn'"
                  @click="yarnTypeFlag3?saveYarnType(3):yarnTypeFlag3=true">{{yarnTypeFlag3?'保存类型':'新增类型'}}
                  <i :class="yarnTypeFlag3?'el-icon-document-checked':'el-icon-plus'"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveYarn(3)">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='装饰辅料'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增辅料</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveDecorateMaterial">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='包装辅料'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增辅料</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
                style="line-height:34px">
                <el-radio-group v-model="packMaterialInfo.calc_type">
                  <el-radio label="面积">面积</el-radio>
                  <el-radio label="其他">其他</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="savePackMaterial">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='纱线报价'">
        <div class="main"
          style="width:1000px">
          <div class="titleCtn">
            <div class="text">纱线报价</div>
            <div class="closeCtn"
              @click="showPopup=false;yarnPriceUpdate=false;resetYarnPrice()">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">报价单位：</div>
              <div class="info">
                <span class="blue"
                  style="line-height:32px"
                  v-if="yarnPriceUpdate">{{yarnPrice.client_name}}</span>
                <el-cascader v-else
                  placeholder="请选择报价单位"
                  v-model="yarnPrice.client_id_arr"
                  :options="yarnClientList"
                  @change="(ev)=>{yarnPrice.client_id=ev[2]}"></el-cascader>
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">纱线名称</div>
                  <div class="tcol"
                    style="flex:0.5">属性</div>
                  <div class="tcol"
                    style="flex:0.5">颜色</div>
                  <div class="tcol"
                    style="flex:0.8">报价</div>
                  <div class="tcol">其它备注</div>
                  <div class="tcol"
                    style="flex:0.5">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in yarnPrice.info_data"
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
                    style="flex:0.5">
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
                    style="flex:0.5">
                    <div class="elCtn">
                      <el-autocomplete class="inline-input"
                        v-model="item.material_color"
                        :fetch-suggestions="searchColor"
                        placeholder="物料颜色"></el-autocomplete>
                    </div>
                  </div>
                  <div class="tcol"
                    style="flex:0.8">
                    <div class="elCtn">
                      <el-input v-model="item.price"
                        placeholder="单价">
                        <template slot="append">元/kg</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input v-model="item.desc"
                        placeholder="备注">
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol oprCtn"
                    style="flex:0.5">
                    <div class="opr hoverBlue"
                      v-if="index===0"
                      @click="$addItem(yarnPrice.info_data,{
                        id: '',
                        material_id: '',
                        material_arr: [],
                        material_color: '',
                        attribute: '',
                        price: '',
                        desc: ''
                    })">添加</div>
                    <div class="opr hoverRed"
                      v-if="index>0"
                      @click="$deleteItem(yarnPrice.info_data,index)">删除</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false;yarnPriceUpdate=false">取消</div>
            <div class="btn"
              :class="yarnPriceUpdate?'backHoverOrange':'backHoverBlue'"
              @click="saveYarnPrice">{{yarnPriceUpdate?'修改':'确认'}}</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='面料报价'">
        <div class="main"
          style="width:1000px">
          <div class="titleCtn">
            <div class="text">面料报价</div>
            <div class="closeCtn"
              @click="showPopup=false;yarnPriceUpdate=false;resetYarnPrice()">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">报价单位：</div>
              <div class="info">
                <span class="blue"
                  style="line-height:32px"
                  v-if="mianliaoPriceUpdate">{{mianliaoPrice.client_name}}</span>
                <el-cascader v-else
                  placeholder="请选择报价单位"
                  v-model="mianliaoPrice.client_id_arr"
                  :options="mianliaoClientList"
                  @change="(ev)=>{mianliaoPrice.client_id=ev[2]}"></el-cascader>
              </div>
            </div>
            <div class="tableCtn">
              <div class="thead">
                <div class="trow">
                  <div class="tcol">面料名称</div>
                  <div class="tcol">颜色</div>
                  <div class="tcol">报价</div>
                  <div class="tcol">其它备注</div>
                  <div class="tcol">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in mianliaoPrice.info_data"
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
                      <el-input v-model="item.price"
                        placeholder="单价">
                        <template slot="append">元/kg</template>
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol">
                    <div class="elCtn">
                      <el-input v-model="item.desc"
                        placeholder="备注">
                      </el-input>
                    </div>
                  </div>
                  <div class="tcol oprCtn">
                    <div class="opr hoverBlue"
                      v-if="index===0"
                      @click="$addItem(mianliaoPrice.info_data,{
                        id: '',
                        material_id: '',
                        material_arr: [],
                        material_color: '',
                        attribute: '',
                        price: '',
                        desc: ''
                    })">添加</div>
                    <div class="opr hoverRed"
                      v-if="index>0"
                      @click="$deleteItem(mianliaoPrice.info_data,index)">删除</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false;mianliaoPriceUpdate=false">取消</div>
            <div class="btn"
              :class="mianliaoPriceUpdate?'backHoverOrange':'backHoverBlue'"
              @click="saveMianliaoPrice">{{mianliaoPriceUpdate?'修改':'确认'}}</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='负责小组/人'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增小组/人</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
              @click="showPopup=false">取消</div>
            <div class="btn backHoverBlue"
              @click="saveGroup">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='系统账户管理'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">{{userUpdate?'修改':'新增'}}用户</div>
            <div class="closeCtn"
              @click="showPopup=false;resetUser()">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">姓名：</div>
              <div class="info">
                <el-input placeholder="请输入姓名"
                  v-model="userInfo.name"></el-input>
              </div>
            </div>
            <!-- <div class="row">
              <div class="label">用户名：</div>
              <div class="info">
                <el-input placeholder="请输入用户名"
                  v-model="userInfo.user_name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">密码：</div>
              <div class="info">
                <el-input placeholder="请输入密码"
                  v-model="userInfo.password"></el-input>
              </div>
            </div> -->
            <div class="row">
              <div class="label">手机号：</div>
              <div class="info">
                <el-input placeholder="请输入手机号"
                  v-model="userInfo.phone"
                  :disabled="userUpdate">
                </el-input>
              </div>
            </div>
            <div class="row"
              v-show="!userUpdate">
              <div class="label">验证码：</div>
              <div class="info">
                <el-input placeholder="请输入验证码"
                  v-model="userInfo.sms_code">
                  <template slot="append">
                    <span style="cursor: pointer;"
                      @click="getSmsCode">{{Number(smsIndex)?(Number(smsIndex)+'秒后重新发送'):smsIndex}}</span>
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
              <div class="label">审核权限：</div>
              <div class="info"
                style="line-height:32px">
                <el-radio v-model="userInfo.has_check"
                  :label="1">有</el-radio>
                <el-radio v-model="userInfo.has_check"
                  :label="2">无</el-radio>
              </div>
            </div>
            <div class="row"
              style="height:auto">
              <div class="label">系统模块：</div>
              <div class="info checkBoxCtn">
                <div class="checkbox"
                  v-for="item in systemModuleArr"
                  :key="item.id">
                  <el-checkbox v-model="item.check"
                    @change="getModuleChild($event,item.id,item.detail)">{{item.name}}</el-checkbox>
                </div>
              </div>
            </div>
            <div class="row"
              style="height:auto">
              <div class="label">模块细分：</div>
              <div class="info checkBoxCtn">
                <div class="checkbox"
                  v-for="item in systemModuleChild"
                  :key="item.id">
                  <el-checkbox v-model="item.check"
                    @change="getModuleChild($event,item.id)">{{item.name}}</el-checkbox>
                </div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false;resetUser()">取消</div>
            <div class="btn backHoverBlue"
              @click="userUpdate?updateUser():saveUser()">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='报价模板'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增报价模板</div>
            <div class="closeCtn"
              @click="showPopup=false;quotedPriceProductUpdate=false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="editCtn">
              <div class="row">
                <div class="col">
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
                </div>
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
                v-for="(itemWeave,indexWeave) in quotedPriceProduct.weave_data"
                :key="'Weave'+indexWeave">
                <div class="col">
                  <div class="label"
                    v-if="indexWeave===0">
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
                    v-if="indexWeave===0">
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
                  v-if="indexWeave===0"
                  @click="$addItem(quotedPriceProduct.weave_data,{
                 number:'',
                 name:'',
                 total_price:''
                })">添加</div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(quotedPriceProduct.weave_data,indexWeave)">删除</div>
              </div>
              <div class="row"
                v-for="(itemHalfProcess,indexHalfProcess) in quotedPriceProduct.semi_product_data"
                :key="'HalfProcess' + indexHalfProcess">
                <div class="col">
                  <div class="label"
                    v-if="indexHalfProcess===0">
                    <span class="text">半成品加工</span>
                  </div>
                  <div class="info elCtn">
                    <el-select v-model="itemHalfProcess.process_id"
                      placeholder="请选择加工工序"
                      clearable
                      multiple>
                      <el-option v-for="item in halfProcessStore"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexHalfProcess===0">
                    <span class="text">小计</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemHalfProcess.total_price"
                      placeholder="小计"
                      :disabled="itemHalfProcess.process_id.length===0">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexHalfProcess===0"
                  @click="$addItem(quotedPriceProduct.semi_product_data,{
                    desc:'',
                    name:'',
                    total_price:''
                  })">添加</div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(quotedPriceProduct.semi_product_data,indexHalfProcess)">删除</div>
              </div>
              <div class="row"
                v-for="(itemFinishedProcess,indexFinishedProcess) in quotedPriceProduct.production_data"
                :key="'FinishedProcess' + indexFinishedProcess">
                <div class="col">
                  <div class="label"
                    v-if="indexFinishedProcess===0">
                    <span class="text">成品加工</span>
                  </div>
                  <div class="info elCtn">
                    <el-select v-model="itemFinishedProcess.name"
                      placeholder="请选择加工工序"
                      clearable
                      multiple>
                      <el-option v-for="item in finishedList"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexFinishedProcess===0">
                    <span class="text">小计</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemFinishedProcess.total_price"
                      placeholder="小计"
                      :disabled="itemFinishedProcess.name.length===0">
                      <template slot="append">元</template>
                    </el-input>
                  </div>
                </div>
                <div class="opr hoverBlue"
                  v-if="indexFinishedProcess===0"
                  @click="$addItem(quotedPriceProduct.production_data,{
                    desc:'',
                    name:'',
                    total_price:''
                  })">添加</div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(quotedPriceProduct.production_data,indexFinishedProcess)">删除</div>
              </div>
              <div class="row"
                v-for="(itemPackMaterial,indexPackMaterial) in quotedPriceProduct.pack_material_data"
                :key="'PackMaterial' + indexPackMaterial">
                <div class="col">
                  <div class="label"
                    v-if="indexPackMaterial===0">
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
                    v-if="indexPackMaterial===0">
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
                  v-if="indexPackMaterial===0"
                  @click="$addItem(quotedPriceProduct.pack_material_data,{
                    desc:'',
                    name:'',
                    total_price:''
                    })">添加</div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(quotedPriceProduct.pack_material_data,indexPackMaterial)">删除</div>
              </div>
              <div class="row"
                v-for="(itemOther,indexOther) in quotedPriceProduct.other_fee_data"
                :key="'Other' + indexOther">
                <div class="col">
                  <div class="label"
                    v-if="indexOther===0">
                    <span class="text">其他费用</span>
                  </div>
                  <div class="info elCtn">
                    <el-input v-model="itemOther.name"
                      placeholder="其他费用"></el-input>
                  </div>
                </div>
                <div class="col">
                  <div class="label"
                    v-if="indexOther===0">
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
                  v-if="indexOther===0"
                  @click="$addItem(quotedPriceProduct.other_fee_data,{
                 desc:'',
                 name:'',
                 total_price:''
                })">添加</div>
                <div class="opr hoverRed"
                  v-else
                  @click="$deleteItem(quotedPriceProduct.other_fee_data,indexOther)">删除</div>
              </div>
            </div>
          </div>
          <div class="oprCtn">
            <div class="btn borderBtn"
              @click="showPopup=false;quotedPriceProductUpdate=false">取消</div>
            <div class="btn"
              :class="quotedPriceProductUpdate?'backHoverOrange':'backHoverBlue'"
              @click="saveQuotedPriceProduct">{{quotedPriceProductUpdate?'修改':'确认'}}</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='报价说明'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增报价说明</div>
            <div class="closeCtn"
              @click="showPopup=false">
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
                        style="width:100%;height:100%">
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
              @click="showPopup=false;quotedPriceProductUpdate=false">取消</div>
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
            @click="showYarn=false">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">选择类型：</div>
            <div class="info tagCtn">
              <span class="yarnNameTag"
                :class="{'active':item.check,'unactive':!item.check}"
                v-for="(item,index) in (cName==='纱线原料'?yarnTypeList1:yarnTypeList2)"
                :key="item.id"
                @click="item.check=!item.check;$forceUpdate()">
                <span class="name">{{item.name}}</span>
                <span class="el-icon-close icon"
                  @click.stop="deleteYarnType(item.id,index,1)"></span>
              </span>
              <span class="elCtn"
                v-show="yarnTypeFlag1">
                <el-input placeholder="输入新增类型"
                  v-model="yarnTypeInfo1.name"></el-input>
              </span>
              <span class="yarnNameTag"
                :class="yarnTypeFlag1?'active':'addBtn'"
                @click="yarnTypeFlag1?saveYarnType(1):yarnTypeFlag1=true">{{yarnTypeFlag1?'保存类型':'新增类型'}}
                <i :class="yarnTypeFlag1?'el-icon-document-checked':'el-icon-plus'"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btn borderBtn"
            @click="showYarn=false">取消</div>
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
            @click="deleteSizeFLag=false">
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
            @click="deleteSizeFLag=false">取消</div>
          <div class="btn backHoverBlue"
            @click="deleteSize">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IngredientInfo, ColourInfo, SizeSetting, SizeInfo, StyleInfo, CategoryInfo } from '@/types/productSetting'
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
import {
  category,
  style,
  ingredient,
  colour,
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
  user,
  quotedPrice,
  companyInfo,
  yarnPrice
} from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
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
      yarnAttributeArr: yarnAttributeArr,
      qrCodeUrl:'',
      postData: { token: '' },
      nav: {
        产品设置: ['品类', '款式', '成分', '配色组', '尺码'],
        订单设置: ['订单类型', '样单类型'],
        报价单设置: ['报价模板', '报价说明'],
        工序设置: ['半成品加工', '成品加工工序'],
        工艺单设置: ['边型', '机型', '组织法', '纱线颜色'],
        物料设置: ['纱线原料', '面料原料', '装饰辅料', '包装辅料', '纱线报价', '面料报价'],
        工厂信息设置: ['基本信息', '负责小组/人'],
        系统账户管理: ['系统账户管理']
        // 打印设置: ['打印设置']
        // 单证设置: [
        //   '英文工厂信息',
        //   '英文银行信息',
        //   'HS编码设置',
        //   '常用公司设置',
        //   '常用城市设置',
        //   '常用品名设置',
        //   '常用付款方式'
        // ]
      },
      pName: '',
      cName: '',
      showPopup: false,
      showYarn: false,
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
        name: '',
        id: null
      },
      materialProcessTotal: 1,
      materialProcessPage: 1,
      halfProcessList: [],
      halfProcessInfo: {
        type: 2,
        name: '',
        id: null
      },
      halfProcessTotal: 1,
      halfProcessPage: 1,
      staffProcessList: [],
      staffProcessInfo: {
        type: 3,
        name: '',
        id: null
      },
      staffProcessTotal: 1,
      staffProcessPage: 1,
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
      yarnList1: [],
      yarnInfo1: {
        id: null,
        name: '',
        type: 1,
        yarn_rel_type: []
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
        yarn_rel_type: []
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
        yarn_rel_type: []
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
        unit: ''
      },
      decorateMaterialList: [],
      decorateMaterialTotal: 1,
      decorateMaterialPage: 1,
      packMaterialInfo: {
        id: null,
        name: '',
        calc_type: '面积',
        unit: ''
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
      userInfo: {
        name: '',
        user_name: '',
        password: '',
        phone: '',
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
            unit: 'kg'
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
            unit: ''
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
            process_id: [],
            process_name: [],
            desc: '',
            total_price: ''
          }
        ],
        production_data: [
          {
            name: [],
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
            id: '',
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
      finishedList: [{ value: '车标' }, { value: '包装' }, { value: '人工' }, { value: '检验' }, { value: '水洗' }],
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
    getModuleChild(ev: boolean, id: number, detailInfo: any[]) {
      if (detailInfo) {
        this.systemModuleChild = detailInfo.map((item) => {
          return {
            id: item.id,
            name: item.name,
            check: ev
          }
        })
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
      } else if (this.cName === '订单类型') {
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
      } else if (this.cName === '纱线原料') {
        this.getYarnType(1)
        this.getYarn(1)
      } else if (this.cName === '面料原料') {
        this.getYarnType(2)
        this.getYarn(2)
      } else if (this.cName === '毛料原料') {
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
        this.getQuotedPriceProduct()
        this.getCategory()
      } else if (this.cName === '报价说明') {
        this.$checkCommonInfo([
          {
            checkWhich: 'status/token',
            getInfoMethed: 'dispatch',
            getInfoApi: 'getTokenAsync'
          }
        ])
        this.getCategory()
      } else if (this.cName === '基本信息') {
        this.getCompany()
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
          this.$downloadExcel([], [{ title: '生产工序名称', key: 'name' }], '生产工序模板')
          break
        case 'staffProcess':
          this.$downloadExcel([], [{ title: '成品加工工序名称', key: 'name' }], '成品加工工序模板')
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
            type: [false, 2]
          }
          api = process.create
          break
        case 'staffProcess':
          typeObj = {
            id: [false, null],
            name: ['成品加工工序名称'],
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
      category.list().then((res) => {
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
    deleteCategory(id: number) {
      this.$confirm('是否删除该品类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          category.delete({ id }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
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
          errMsg: '请输入订单类型'
        }
      ])
      if (!formCheck) {
        orderType.create(this.orderTypeInfo).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加订单类型成功'
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
      this.$confirm('是否删除该订单类型?', '提示', {
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
          errMsg: '请输入订单类型'
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
      this.$confirm('是否删除该订单类型?', '提示', {
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
          type: 2
        })
        .then((res) => {
          this.halfProcessList = res.data.data
          this.halfProcessTotal = this.halfProcessList.length
        })
    },
    saveHalfProcess() {
      const formCheck = this.$formCheck(this.halfProcessInfo, [
        {
          key: 'name',
          errMsg: '请输入加工工序'
        }
      ])
      if (!formCheck) {
        process
          .create({
            data: [this.halfProcessInfo]
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.halfProcessInfo = {
                type: 2,
                name: '',
                id: null
              }
              this.getHalfProcess()
            }
          })
      }
    },
    deleteHalfProcess(id: number) {
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
    getStaffProcess() {
      process
        .list({
          type: 3
        })
        .then((res) => {
          this.staffProcessList = res.data.data
          this.staffProcessTotal = this.staffProcessList.length
        })
    },
    saveStaffProcess() {
      const formCheck = this.$formCheck(this.staffProcessInfo, [
        {
          key: 'name',
          errMsg: '请输入加工工序'
        }
      ])
      if (!formCheck) {
        process
          .create({
            data: [this.staffProcessInfo]
          })
          .then((res) => {
            if (res.data.status) {
              this.$message.success('添加成功')
              this.staffProcessInfo = {
                type: 3,
                name: '',
                id: null
              }
              this.getStaffProcess()
            }
          })
      }
    },
    deleteStaffProcess(id: number) {
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
    buildYarnList() {
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
      const limit = ifAll ? 999 : 5
      yarn.list({ type: type, limit: limit, page: this['yarnPage' + type] }).then((res) => {
        this['yarnList' + type] = res.data.data.items
        this['yarnTotal' + type] = res.data.data.total
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
          id: null,
          name: this['yarnInfo' + type].name || this.layoutData.yarnNameList,
          type: type,
          yarn_rel_type: realType as number[]
        })
        .then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.getYarn(type)
          }
        })
    },
    deleteYarn(id: number, type: 1 | 2 | 3) {
      this.$confirm('是否删除该纱线?', '提示', {
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
                  message: '删除成功!'
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
      decorateMaterial.list().then((res) => {
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
        decorateMaterial.create(this.decorateMaterialInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.getDecorateMaterial()
          }
        })
      }
    },
    deleteDecorateMaterial(id: number) {
      this.$confirm('是否删除该装饰辅料?', '提示', {
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
                  message: '删除成功!'
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
      packMaterial.list().then((res) => {
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
    deletePackMaterial(id: number) {
      this.$confirm('是否删除该包装辅料?', '提示', {
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
                  message: '删除成功!'
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
    deleteGroup(id: number) {},
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
        station: '' // 岗位
      }
      this.userUpdate = false
    },
    getUpdateUser(userInfo: UserInfo) {
      this.showPopup = true
      this.userUpdate = true
      this.userInfo = userInfo
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
    deleteUser(id: number) {},
    getQuotedPriceProduct() {
      this.$checkCommonInfo([
        {
          checkWhich: 'api/packMaterial',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getPackMaterialAsync'
        },
        {
          checkWhich: 'api/halfProcess',
          getInfoMethed: 'dispatch',
          getInfoApi: 'getHalfProcessAsync'
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
      formData.other_fee_data = JSON.stringify(formData.other_fee_data)
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
                unit: 'kg'
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
                unit: ''
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
                process_id: [],
                process_name: [],
                desc: '',
                total_price: ''
              }
            ],
            production_data: [
              {
                name: [],
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
                id: '',
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
      formData.other_fee_data = formData.other_fee_data ? JSON.parse(formData.other_fee_data) : []
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
      companyInfo.detail().then((res) => {
        if (res.data.status) {
          this.companyInfo = res.data.data
          let _this = this
          let a = 'https://knit-m-beta.zwyknit.com/miniprogram?company_id=' + _this.companyInfo.company_id
        
          // 生成二维码
          const QRCode = require('qrcode')
          QRCode.toDataURL(a)
            .then((url: any) => {
              _this.qrCodeUrl = url
            })
            .catch((err: any) => {
              console.error(err)
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
          material_type: 1
        })
        .then((res) => {
          if (res.data.status) {
            this.yarnPriceList = res.data.data
            this.yarnPriceTotal = this.yarnPriceList.length
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
              key: 'attribute',
              errMsg: '请选择纱线属性'
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
            this.$message.success('添加成功')
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
          material_type: 2
        })
        .then((res) => {
          if (res.data.status) {
            this.mianliaoPriceList = res.data.data
            this.mianliaoPriceTotal = this.mianliaoPriceList.length
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
          // yarnPrice
          //   .delete({
          //     id: id
          //   })
          //   .then((res) => {
          //     if (res.data.status) {
          //       this.$message({
          //         type: 'success',
          //         message: '删除成功!'
          //       })
          //       this.getMianliaoPrice()
          //     }
          //   })
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
    }
  },
  computed: {
    // 纱线原料单位——纱线报价用
    yarnClientList() {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '纱线原料单位')
    },
    // 纱线原料单位——纱线报价用
    mianliaoClientList() {
      return this.$store.state.api.clientType.arr.filter((item: { label: string }) => item.label === '面料原料单位')
    },
    // 包装辅料——报价单里用
    packMaterialStore(): PackMaterialInfo[] {
      return this.$store.state.api.packMaterial.arr
    },
    // 半成品加工工序——报价单设置用
    halfProcessStore() {
      return this.$store.state.api.halfProcess.arr
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
      return this.decorateMaterialList.slice((this.decorateMaterialPage - 1) * 5, this.decorateMaterialPage * 5)
    },
    packMaterialArr(): PackMaterialInfo[] {
      return this.packMaterialList.slice((this.packMaterialPage - 1) * 5, this.packMaterialPage * 5)
    },
    groupArr(): GroupInfo[] {
      return this.groupInfoList.slice((this.groupPage - 1) * 5, this.groupPage * 5)
    },
    userArr(): UserInfo[] {
      return this.userList.slice((this.userPage - 1) * 5, this.userPage * 5)
    },
    quotedPriceProductArr(): QuotedPriceProduct[] {
      return this.quotedPriceProductList.slice((this.quotedPriceProductPage - 1) * 5, this.quotedPriceProductPage * 5)
    },
    yarnPriceArr(): YarnPrice[] {
      return this.yarnPriceList.slice((this.yarnPricePage - 1) * 5, this.yarnPricePage * 5)
    },
    mianliaoPriceArr(): YarnPrice[] {
      return this.mianliaoPriceList.slice((this.mianliaoPricePage - 1) * 5, this.mianliaoPricePage * 5)
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

.tc{
  text-align: center;
}

.border{
  border: 1px solid #DCDFE6;
  padding: 5px 30px;
}
</style>