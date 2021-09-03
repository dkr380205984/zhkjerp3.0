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
          <template v-if="cName==='款式'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加新款式</div>
                <div class="btn backHoverOrange fr">批量导入</div>
                <div class="btn backHoverGreen fr">下载导入模板</div>
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
          <template v-if="cName==='原料工序'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加原料工序</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('yarnProcess')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('yarnProcess')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">原料工序</div>
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
          <template v-if="cName==='结算工序'">
            <div class="listCtn">
              <div class="filterCtn clearfix">
                <div class="btn backHoverBlue fr"
                  @click="showPopup=true">添加结算工序</div>
                <div class="btn backHoverOrange fr"
                  @click="importExcelData('staffProcess')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('staffProcess')">下载导入模板</div>
              </div>
              <div class="list">
                <div class="row title">
                  <div class="col">结算工序</div>
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
                  @click="importExcelData('staffProcess')">批量导入</div>
                <div class="btn backHoverGreen fr"
                  @click="downLoadTemplete('staffProcess')">下载导入模板</div>
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
                  <div class="col">参考报价</div>
                  <div class="col">添加人</div>
                  <div class="col">添加时间</div>
                  <div class="col">
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
                  <div class="col">参考报价</div>
                  <div class="col">添加人</div>
                  <div class="col">添加时间</div>
                  <div class="col">
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
                  <div class="col">参考报价</div>
                  <div class="col">添加人</div>
                  <div class="col">添加时间</div>
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
                  <div class="col">参考报价</div>
                  <div class="col">添加人</div>
                  <div class="col">添加时间</div>
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
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showPopup">
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
      <template v-if="cName==='原料工序'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增原料工序</div>
            <div class="closeCtn"
              @click="showPopup=false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">原料工序：</div>
              <div class="info">
                <el-input placeholder="请输入原料工序"
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
      <template v-if="cName==='结算工序'">
        <div class="main">
          <div class="titleCtn">
            <div class="text">新增结算工序</div>
            <div class="closeCtn"
              @click="showPopup=false">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="contentCtn">
            <div class="row">
              <div class="label">结算工序：</div>
              <div class="info">
                <el-input placeholder="请输入结算工序"
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
import { IngredientInfo, ColourInfo, ProductTypeInfo, SizeInfo, StyleInfo } from '@/types/productSetting'
import { OrderType } from '@/types/orderSetting'
import { ProcessInfo } from '@/types/processSetting'
import { SideInfo, MachineInfo, MethodsInfo, YarnColorInfo } from '@/types/craftSetting'
import { YarnInfo, YarnTypeInfo } from '@/types/yarnSetting'
import { ClientEN, BankEN } from '@/types/billDocumentSetting'
import { PackMaterialInfo, DecorateMaterialInfo } from '@/types/materialSetting'
import { GroupInfo } from '@/types/factoryInfoSetting'
interface YarnTypeInfoHasCheck extends YarnTypeInfo {
  check: boolean
}
import {
  style,
  ingredient,
  colour,
  productType,
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
  group
} from '@/assets/js/api'
export default Vue.extend({
  data(): {
    [propName: string]: any
    styleInfo: StyleInfo
    styleList: StyleInfo[]
    ingredientInfo: IngredientInfo
    ingredientList: IngredientInfo[]
    colourInfo: ColourInfo
    colourList: ColourInfo[]
    sizeInfo: SizeInfo
    deleteSizeArr: SizeInfo[]
    sizeList: ProductTypeInfo[]
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
  } {
    return {
      postData: { token: '' },
      nav: {
        产品设置: ['款式', '成分', '配色组', '尺码'],
        订单设置: ['订单类型', '样单类型', '订单预警', '样单预警'],
        报价单设置: ['报价模板', '报价说明'],
        工序设置: ['原料工序', '半成品加工', '结算工序'],
        工艺单设置: ['边型', '机型', '组织法', '纱线颜色'],
        物料设置: ['纱线原料', '面料原料', '毛料原料', '装饰辅料', '包装辅料'],
        工厂信息设置: ['基本信息', '负责小组/人', '部门管理', '员工标签'],
        系统账户管理: ['系统账户管理'],
        打印设置: ['打印设置'],
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
      pName: '',
      cName: '',
      showPopup: false,
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
      groupPage: 1
    }
  },
  methods: {
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
      } else if (this.cName === '原料工序') {
        this.getMaterialProcess()
      } else if (this.cName === '半成品加工') {
        this.getHalfProcess()
      } else if (this.cName === '结算工序') {
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
      } else if (this.cName === '装饰辅料') {
        this.getDecorateMaterial()
      } else if (this.cName === '包装辅料') {
        this.getPackMaterial()
      } else if (this.cName === '负责小组/人') {
        this.getGroup()
      }
    },
    downLoadTemplete(type: string) {
      switch (type) {
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
        case 'material':
          this.$downloadExcel(
            [],
            [
              { title: '装饰辅料名称', key: 'name' },
              { title: '计量单位', key: 'unit' },
              { title: `是否需要织造(注:'是'填'1','否'填'0',默认为'0')`, key: 'need_weave' }
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
          this.$downloadExcel([], [{ title: '原料工序名称', key: 'name' }], '原料工序模板')
          break
        case 'semiProcess':
          this.$downloadExcel([], [{ title: '半成品加工工序名称', key: 'name' }], '半成品加工工序模板')
          break
        case 'staffProcess':
          this.$downloadExcel([], [{ title: '结算工序名称', key: 'name' }], '结算工序模板')
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
          console.log('文件类型不正确')
        }
      }
      fileReader.readAsArrayBuffer(files[0])
    },
    saveImportData(data: any, type: string) {
      console.log(data, type)
      let typeObj: any = {}
      let api = null
      switch (type) {
        // case 'flower':
        //   typeObj = {
        //     id: [false, null],
        //     name: ['花型名称']
        //   }
        //   api = flower.create
        //   break
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
        // case 'yarn':
        //   typeObj = {
        //     id: [false, null],
        //     name: ['纱线原料名称'],
        //     price_data: [false, []]
        //   }
        //   api = yarn.create
        //   break
        case 'yarnColor':
          typeObj = {
            id: [false, null],
            name: ['纱线颜色名称'],
            color_code: ['色块', null]
          }
          api = yarnColor.create
          break
        // case 'material':
        //   typeObj = {
        //     id: [false, null],
        //     name: ['装饰辅料名称'],
        //     unit: ['计量单位'],
        //     need_weave: [`是否需要织造(注:'是'填'1','否'填'0',默认为'0')`, 0],
        //     price_data: [false, []]
        //   }
        //   api = material.create
        //   break
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
            name: ['原料工序名称'],
            type: [false, 1]
          }
          api = process.create
          break
        case 'semiProcess':
          typeObj = {
            id: [false, null],
            name: ['半成品加工工序名称'],
            type: [false, 2]
          }
          api = process.create
          break
        case 'staffProcess':
          typeObj = {
            id: [false, null],
            name: ['结算工序名称'],
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
      productType.list().then((res) => {
        this.sizeList = res.data.data.items
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
            this.sizeInfo = {
              category_id: '',
              id: null,
              name: ''
            }
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
          errMsg: '请输入原料工序'
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
    getYarn(type: 1 | 2 | 3) {
      yarn.list({ type: type, limit: 5, page: this['yarnPage' + type] }).then((res) => {
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
    deleteGroup(id: number) {}
  },
  computed: {
    styleArr(): StyleInfo[] {
      return this.styleList.slice((this.stylePage - 1) * 5, this.stylePage * 5)
    },
    ingredientArr(): IngredientInfo[] {
      return this.ingredientList.slice((this.ingredientPage - 1) * 5, this.ingredientPage * 5)
    },
    colourArr(): ColourInfo[] {
      return this.colourList.slice((this.colourPage - 1) * 5, this.colourPage * 5)
    },
    sizeArr(): ProductTypeInfo[] {
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