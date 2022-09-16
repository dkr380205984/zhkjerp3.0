<template>
  <div id="homePage"
    class="bodyContainer">
    <div class="module">
      <div class="titleCtn">
        <div class="title">搜索</div>
      </div>
      <div class="content">
        <div class="searchCtn">
          <el-input class="input"
            placeholder="请输入产品/样品/报价单/订单信息按回车搜索"
            v-model="searchValue"
            @keydown.native.enter="searchInfo">
            <i slot="suffix"
              class="el-input__icon el-icon-search"></i>
            <el-select v-model="searchType"
              slot="prepend"
              class="select"
              placeholder="请选择"
              @change="searchInfo">
              <el-option label="所有"
                value="0"></el-option>
              <el-option label="订单"
                value="1"></el-option>
              <el-option label="样品订单"
                value="2"></el-option>
              <el-option label="报价单"
                value="3"></el-option>
              <el-option label="工艺单"
                value="4"></el-option>
              <el-option label="物料计划单"
                value="5"></el-option>
              <el-option label="原料采购单"
                value="6"></el-option>
              <el-option label="辅料采购单"
                value="7"></el-option>
              <el-option label="原料调取单"
                value="8"></el-option>
              <el-option label="原料加工单"
                value="9"></el-option>
              <el-option label="原料入库单"
                value="10"></el-option>
              <el-option label="辅料入库单"
                value="11"></el-option>
              <el-option label="原料出库单"
                value="12"></el-option>
              <el-option label="生产计划单"
                value="13"></el-option>
              <el-option label="装箱计划单"
                value="14"></el-option>
              <el-option label="装箱采购单"
                value="15"></el-option>
              <el-option label="装箱运输单"
                value="16"></el-option>
              <el-option label="检验入库单"
                value="17"></el-option>
              <el-option label="检验出库单"
                value="18"></el-option>
              <el-option label="成品入库单"
                value="19"></el-option>
            </el-select>
          </el-input>
          <div class="btn backHoverBlue"
            @click="searchInfo">搜索</div>
        </div>
        <div class="seachHistory">
          <div class="container">
            <span class="label gray">近期搜索记录：</span>
            <span class="normal gray"
              v-for="(item, index) in history"
              :key="index"
              @click="searchHistory(item)">{{
              item
            }}</span>
          </div>
          <div class="btn noBorder gray"
            @click="resetHistory">清空历史</div>
        </div>
        <div class="searchBox"
          v-show="showSearch"
          v-loading="searchLoading">
          <i class="el-icon-circle-close icons"
            @click="showSearch = false"></i>
          <div class="block"
            v-show="searchType === '0' || searchType === '1'">
            <div class="titled">相关订单</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">下单公司</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
              <span class="text">下单总数</span>
            </div>
            <div class="info"
              v-for="item in searchList.order"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code || item.system_code"
                @click="$openUrl('/order/detail?id=' + item.id)"></span>
              <span class="text">{{ item.client_name }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
              <span class="text">{{ item.total_number }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.order.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '2'">
            <div class="titled">相关样单</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">打样公司</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
              <span class="text">打样总数</span>
            </div>
            <div class="info"
              v-for="item in searchList.sampleOrder"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/sampleOrder/detail?id=' + item.id)"></span>
              <span class="text">{{ item.client_name }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
              <span class="text">{{ item.total_number }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.sampleOrder.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '3'">
            <div class="titled">相关报价单</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">标题</span>
              <span class="text">询价公司</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.quotedPrice"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/quotedPrice/detail?id=' + item.id)"></span>
              <span class="text">{{ item.title }}</span>
              <span class="text">{{ item.client_name }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.quotedPrice.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '4'">
            <div class="titled">相关工艺单</div>
            <div class="info title">
              <span class="text">工艺单编号</span>
              <span class="text">标题</span>
              <span class="text">产/样品编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.craft"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/craft/detail?id=' + item.id)"></span>
              <span class="text">{{ item.title }}</span>
              <span class="text">{{ item.product_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.craft.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '5'">
            <div class="titled">相关物料计划</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.materialPlan"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/materialPlan/detail?id=' + item.doc_order_id + '&sampleOrderIndex=' + item.doc_order_time_id + '&planId='+ item.id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.materialPlan.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '6'">
            <div class="titled">相关物料采购</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.materialOrder"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/materialManage/detail?id=' + item.plan_id||item.sup_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.materialOrder.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '7'">
            <div class="titled">相关辅料采购</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.decorateOrder"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/accessoriesManage/detail?id=' + item.doc_order_id + '&sampleOrderIndex=' + item.doc_order_time_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.decorateOrder.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '8'">
            <div class="titled">相关物料调取</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.materialStock"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/materialManage/detail?id=' + item.plan_id||item.sup_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.materialStock.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '9'">
            <div class="titled">相关物料加工</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.materialProcess"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/materialManage/detail?id=' + item.plan_id||item.sup_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.materialProcess.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '10'">
            <div class="titled">相关物料入库</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.materialPush"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/materialStock/detail?id=' + item.doc_order_id + '&sampleOrderIndex=' + item.doc_order_time_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.materialPush.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '12'">
            <div class="titled">相关物料出库</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.materialPop"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/materialStock/detail?id=' + item.doc_order_id + '&sampleOrderIndex=' + item.doc_order_time_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.materialPop.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '13'">
            <div class="titled">相关生产计划</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.productionPlan"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/productionPlan/detail?id=' + item.doc_order_id + '&sampleOrderIndex=' + item.doc_order_time_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.productionPlan.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '14'">
            <div class="titled">相关装箱计划</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.packPlan"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/packManage/detail?id=' + item.doc_order_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.packPlan.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '15'">
            <div class="titled">相关装箱采购</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.packOrder"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/packManage/detail?id=' + item.doc_order_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.packOrder.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '16'">
            <div class="titled">相关装箱运输</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.packOut"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/boxManage/boxDetail?' + item.id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.packOut.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '17'">
            <div class="titled">相关检验入库</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.inspectionPush"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/inspection/detail?id=' + item.doc_order_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.inspectionPush.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '18'">
            <div class="titled">相关检验出库</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.inspectionPop"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/inspection/detail?id=' + item.doc_order_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.inspectionPop.length === 0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType === '0' || searchType === '19'">
            <div class="titled">相关成品入库</div>
            <div class="info title">
              <span class="text">编号</span>
              <span class="text">订/样单编号</span>
              <span class="text">创建时间</span>
              <span class="text">创建人</span>
            </div>
            <div class="info"
              v-for="item in searchList.produtionPush"
              :key="item.id">
              <span class="text hoverBlue"
                v-html="item.code"
                @click="$openUrl('/inspection/detail?id=' + item.doc_order_id)"></span>
              <span class="text">{{ item.order_code }}</span>
              <span class="text">{{ item.create_time }}</span>
              <span class="text">{{ item.user_name }}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.produtionPush.length === 0">暂无相关信息</div>
          </div>
        </div>
      </div>
    </div>
    <div class="fastEditCtn">
      <div class="first_line">
        <div class="fastEdit_item"
          v-for="(item, index) in userCheckedOpr"
          :key="index"
          @click="easyOprFlag ? false : $router.push(item.url)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <span class="name">{{ item.opr }}</span>
          <span class="editBtn delete el-icon-minus red"
            v-if="easyOprFlag"
            @click.stop="item.isChecked = false"></span>
        </div>
        <div class="edit_item"
          @click="easyOprFlag ? saveOpr() : (easyOprFlag = true)">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-zhuangshifuliaocangku"></use>
          </svg>
          <span class="name blue">{{ easyOprFlag ? '完成编辑' : '自定义编辑' }}</span>
        </div>
      </div>
      <div class="edit_line_box"
        :class="easyOprFlag ? false : 'hiddle'"
        :style="'height:' + userCanCheckedOpr.length * 132 + 'px'">
        <div class="edit_line"
          v-for="(item, index) in userCanCheckedOpr"
          :key="index">
          <div class="fastEdit_item"
            v-for="(itemN, indexN) in item"
            :key="indexN">
            <svg class="iconFont"
              aria-hidden="true">
              <use :xlink:href="'#' + itemN.icon"></use>
            </svg>
            <span class="name">{{ itemN.opr }}</span>
            <span class="editBtn add el-icon-plus green"
              v-if="easyOprFlag"
              @click.stop="addFastList(itemN)"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="flexCtn">
      <div class="leftCtn">
        <div class="module">
          <div class="titleCtn">
            <div class="title">待办事项以及系统通知
              <el-tooltip class="item"
                effect="dark"
                content="您可在设置页面关闭或者开启提醒，并设置提醒的时间或内容"
                placement="top">
                <i class="el-icon-setting hoverOrange"
                  style="line-height:38px;font-size:18px;cursor:pointer;"
                  @click="$openUrl('/setting/?pName=通知和审核设置&cName=推送设置')"></i>
              </el-tooltip>
              <div class="fr hoverBlue"
                style="font-size: 16px; font-weight: normal; cursor: pointer"
                @click="$router.push('/otherPage/msgList')">
                查看全部
              </div>
            </div>
          </div>
          <div class="content"
            style="overflow: auto">
            <div class="tableCtn"
              style="padding:0">
              <div class="thead">
                <div class="trow">
                  <div class="tcol"
                    style="max-width:50px">序号</div>
                  <div class="tcol"
                    style="max-width:100px">日期</div>
                  <div class="tcol">待办任务</div>
                  <div class="tcol"
                    style="max-width:70px">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in todoList"
                  :key="index">
                  <div class="tcol"
                    style="max-width:50px">{{index+1}}</div>
                  <div class="tcol"
                    style="max-width:100px">{{item.created_at.slice(0,10)}}</div>
                  <div class="tcol">
                    <span v-html="item.html"></span>
                  </div>
                  <div class="tcol"
                    style="max-width:70px">
                    <span class="blue"
                      style="cursor:pointer"
                      @click="todoUrl(item)">查看</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flexCtn">
      <div class="leftCtn">
        <div class="module">
          <div class="titleCtn">
            <div class="title">
              系统教学
              <div class="fr hoverBlue"
                style="font-size: 16px; font-weight: normal; cursor: pointer"
                @click="$openUrl('/tutorialSystem/list')">
                查看全部
              </div>
            </div>
          </div>
          <div class="content">
            <div class="line"
              v-for="(item, index) in tutorialSystemArr"
              :key="index">
              <div class="number">{{ index + 1 }}</div>
              <div class="text"
                @click.prevent="$openUrl('/tutorialSystem/detail?id=' + item.id)">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="middleCtn">
        <div class="module">
          <div class="titleCtn">
            <div class="title">
              织为云微信公众号
              <div class="fr hoverBlue"
                style="font-size: 16px; font-weight: normal; cursor: pointer"
                @click="wxFlag =true">
                查看教学
              </div>
            </div>
          </div>
          <div class="content">
            <div class="imgCtn">
              <img :src="wxImg" />
            </div>
          </div>
        </div>
      </div>
      <div class="rightCtn">
        <div class="module">
          <div class="titleCtn">
            <div class="title">
              版本公告
              <div class="fr hoverBlue"
                style="font-size: 16px; font-weight: normal; cursor: pointer"
                @click="showSystemMessageContent=true;getSystemMessage()">
                查看历史公告
              </div>
            </div>
          </div>
          <div class="content">
            <div class="noMsg"
              v-show="!systemMessageContent">暂无版本公告</div>
            <div class="msgCtn"
              v-html="systemMessageContent"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showSystemMessageContent">
      <div class="main"
        style="width: 1000px">
        <div class="titleCtn">
          <span class="text">通知列表</span>
          <div class="closeCtn"
            @click="showSystemMessageContent = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn"
          style="max-height: 1000px;">
          <div class="row">
            <div class="label">筛选条件：</div>
            <div class="info"
              style="line-height: 32px">
              <el-date-picker v-model="chooseMessageDate"
                @change="getSystemMessage"
                type="daterange"
                align="right"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
            <div class="btnCtn">
              <div class="borderBtn"
                @click="chooseMessageDate = [];getSystemMessage()">重置</div>
            </div>
          </div>
          <div class="row"
            style="height: 900px; overflow-y: scroll">
            <el-collapse v-model="activeNames"
              style="width: 100%">
              <el-collapse-item v-for="(item, index) in systemMessageContentList"
                :key="item + index"
                :name="index">
                <template slot="title">
                  {{ $rTime(item.updated_at) }}
                  <div style="
                      width: 680px;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      margin-left: 20px;
                    ">
                    {{ contentHtml(item.content) }}
                  </div>
                </template>
                <div v-html="item.content"></div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="wxFlag">
      <div class="main"
        style="width: 1000px">
        <div style="text-align:right;cursor:pointer;line-height:44px;margin-right:12px"
          class="hoverRed"
          @click="wxFlag=false">关闭教学</div>
        <el-image class="img"
          :src="wxjx"
          style="height:1024px"
          :preview-src-list="[require('@/assets/image/common/WXJX1.png'),require('@/assets/image/common/WXJX2.png'),require('@/assets/image/common/WXJX3.png'),require('@/assets/image/common/WXJX4.png')]"></el-image>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { homePage, todoInfo } from '@/assets/js/api'
import { tutorialSystem, systemMessage } from '@/assets/js/api'
export default Vue.extend({
  data() {
    return {
      wxFlag: false,
      wxjx: require('@/assets/image/common/WXJX.png'),
      wxImg: require('@/assets/image/common/wx.jpg'),
      activeNames: '',
      systemMessageContent: '',
      systemMessageContentList: [],
      showSystemMessageContent: false,
      chooseMessageDate: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      searchType: '0',
      searchValue: '',
      history: window.localStorage.getItem('searchHistory')
        ? JSON.parse(window.localStorage.getItem('searchHistory') as string)
        : [],
      showSearch: false,
      searchLoading: false,
      easyOprFlag: false,
      userEasyOpr: window.localStorage.getItem('userEasyOpr')
        ? JSON.parse(window.localStorage.getItem('userEasyOpr') as string)
        : [],
      easyOpr: [
        {
          id: '1-1',
          isChecked: false,
          opr: '添加报价单',
          icon: 'icon-baojiaguanli1',
          url: '/quotedPrice/create',
          check: true
        },
        {
          id: '1-3',
          isChecked: false,
          opr: '报价单列表',
          icon: 'icon-baojiaguanli1',
          url: '/quotedPrice/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          id: '3-1',
          isChecked: false,
          opr: '添加订单',
          icon: 'icon-dingdanguanli1',
          url: '/order/create'
        },
        {
          id: '3-3',
          isChecked: false,
          opr: '订单管理',
          icon: 'icon-dingdanguanli1',
          url: '/order/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          id: '2-1',
          isChecked: false,
          opr: '添加样单',
          icon: 'icon-yangdanguanli1',
          url: '/sampleOrder/create'
        },
        {
          id: '2-3',
          isChecked: false,
          opr: '样单管理',
          icon: 'icon-yangdanguanli1',
          url: '/sampleOrder/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          id: '15-1',
          isChecked: false,
          opr: '添加工艺单',
          icon: 'icon-gongyidanguanli',
          url: '/craft/create'
        },
        {
          id: '15-3',
          isChecked: false,
          opr: '工艺单列表',
          icon: 'icon-gongyidanguanli',
          url: '/craft/list?page=1&keyword&user_id='
        },
        {
          id: '4-1',
          isChecked: false,
          opr: '物料计划',
          icon: 'icon-wuliaojihua',
          url: '/materialPlan/list?page=1&keyword=&client_id=&user_id=&status=0&date=&&order_type=null'
        },
        {
          id: '4-3',
          isChecked: false,
          opr: '物料管理',
          icon: 'icon-wuliaoguanli',
          url: '/materialManage/list?page=1&type=1&code=&order_code=&date='
        },
        {
          id: '5-3',
          isChecked: false,
          opr: '原料管理',
          icon: 'icon-wuliaochuruku',
          url: '/materialStock/list?page=1&type=1'
        },
        {
          id: '6-3',
          isChecked: false,
          opr: '辅料管理',
          icon: 'icon-wuliaochuruku',
          url: '/accessoriesManage/list?page=1&type=1'
        },
        {
          id: '7-3',
          isChecked: false,
          opr: '物料出入库',
          icon: 'icon-wuliaochuruku',
          url: '/materialStock/list?page=1&type=1'
        },
        {
          id: '8-3',
          isChecked: false,
          opr: '生产计划',
          icon: 'icon-shengchanjihua',
          url: '/productionPlan/list?page=1&type=1'
        },
        {
          id: '9-3',
          isChecked: false,
          opr: '检验收发管理',
          icon: 'icon-shengchanpinjianyan',
          url: '/inspection/list?page=1&type=1'
        },
        {
          opr: '仓库管理',
          isChecked: false,
          id: '12-3',
          icon: 'icon-cangkuguanli',
          url: '/store/list?page=1&keyword=&user_id=&store_type=1'
        },
        {
          opr: '客户管理',
          isChecked: false,
          id: '13-1',
          icon: 'icon-kehuguanli',
          url: '/client/list?page=1&type=1&status=1&keyword='
        },
        {
          opr: '合作单位管理',
          isChecked: false,
          id: '13-2',
          icon: 'icon-kehuguanli',
          url: '/client/list?page=1&type=1&status=1&keyword='
        },
        {
          opr: '原料预订购',
          isChecked: false,
          id: '14-3',
          icon: 'icon-wuliaoyudinggou',
          url: '/materialPlanOrder/list?page=1&type=1'
        },
        {
          opr: '发货管理',
          isChecked: false,
          id: '10-3',
          icon: 'icon-zhuangxiangjihua',
          url: '/boxManage/list?page=1&type=1'
        },
        {
          opr: '车间管理',
          isChecked: false,
          id: '19-3',
          icon: 'icon-chejianguanli',
          url: '/workshopManagement/list?page=1&type=1'
        },
        {
          opr: '员工管理',
          isChecked: false,
          id: '17-3',
          icon: 'icon-yuangongguanli',
          url: '/workerManage/list?page=1&keyword=&department=&status=&type=&limit=10'
        },
        {
          opr: '报销单管理',
          isChecked: false,
          id: '18-3',
          icon: 'icon-chexiaodanguanli',
          url: '/reimbursementManage/list?page=1&status='
        }
        // {
        //   opr: '财务结算',
        //   isChecked: false,
        //   id: 22,
        //   icon: 'icon-chexiaodanguanli',
        //   url: '/settlement/collectionList?page=1&status='
        // }
      ],
      searchList: {
        order: [],
        sampleOrder: [],
        quotedPrice: [],
        materialPlan: [],
        craft: [],
        materialOrder: [],
        decorateOrder: [],
        materialStock: [],
        materialProcess: [],
        materialPush: [],
        materialPop: [],
        decoratePush: [],
        productionPlan: [],
        packPlan: [],
        packOrder: [],
        packOut: [],
        inspectionPush: [],
        inspectionPop: [],
        produtionPush: []
      },
      tutorialSystemArr: [],
      todoList: []
    }
  },
  methods: {
    contentHtml(content: string) {
      // 富文本编辑器的内容如何只获得文字去掉标签
      // content = content.replace(/<[^>]+>/g, '')
      // 在上面的基础上还去掉了换行<br/>
      content = content.replace(/<[^>]+>/g, '').replace(/(\n)/g, '')
      return content
    },
    getSystemMessage(e: any) {
      if (e) {
        systemMessage({
          start_time: e[0],
          end_time: e[1]
        }).then((res) => {
          this.systemMessageContentList = res.data.data.items
        })
      } else {
        systemMessage().then((res) => {
          this.systemMessageContentList = res.data.data.items
        })
      }
    },
    // 待办事项样式转换
    changeContentToHtml(str: string): string {
      return str
        .replaceAll('修改', '<span style="color:#FA9036">修改</span>')
        .replaceAll('审核', '<span style="color:#01B48C">审核</span>')
        .replace(/【.*】/, function (data) {
          return '<span style="color:#1a95ff">' + data + '</span>'
        })
    },
    newSplice(data: any[], index = 5, arr?: any) {
      if (data.length === 0 || !data) {
        return []
      }
      if (!arr) {
        arr = []
      }
      arr.push(data.splice(0, index))
      if (data.length > 0) {
        this.newSplice(data, index, arr)
      }
      return arr
    },
    searchInfo() {
      if (!this.searchValue) {
        return
      }
      this.searchLoading = true
      homePage
        .searchAll({
          keyword: this.searchValue,
          type: Number(this.searchType) ? Number(this.searchType) : ''
        })
        .then((res) => {
          if (res.data.status) {
            if (Number(this.searchType) === 1) {
              this.searchList.order = res.data.data
            } else if (Number(this.searchType) === 2) {
              this.searchList.sampleOrder = res.data.data
            } else if (Number(this.searchType) === 3) {
              this.searchList.quotedPrice = res.data.data
            } else if (Number(this.searchType) === 4) {
              this.searchList.craft = res.data.data
            } else if (Number(this.searchType) === 5) {
              this.searchList.materialPlan = res.data.data
            } else {
              this.searchList = {
                order: res.data.data.order,
                sampleOrder: res.data.data.sample_order,
                quotedPrice: res.data.data.quote,
                materialPlan: res.data.data.material_plan,
                craft: res.data.data.craft_list,
                materialOrder: res.data.data.material_order,
                decorateOrder: res.data.data.decorate_order,
                materialStock: res.data.data.material_transfer,
                materialProcess: res.data.data.material_process,
                materialPush: res.data.data.final_push,
                materialPop: res.data.data.final_pop,
                decoratePush: res.data.data.decorate_final_push,
                productionPlan: res.data.data.weave_plan,
                packPlan: res.data.data.pack_plan,
                packOrder: res.data.data.pack_order,
                packOut: res.data.data.transport_dispatch,
                inspectionPush: res.data.data.inspection_push,
                inspectionPop: res.data.data.inspection_pop,
                produtionPush: res.data.data.pro_inspection
              }
            }
          }
          if (!this.history.find((item: string) => item === this.searchValue)) {
            if (this.history.length < 10) {
              this.history.unshift(this.searchValue)
            } else {
              this.history.unshift(this.searchValue)
              this.history.pop()
            }
            window.localStorage.setItem('searchHistory', JSON.stringify(this.history))
          }
          this.showSearch = true
          this.searchLoading = false
        })
    },
    searchHistory(keyword: string) {
      this.searchValue = keyword
      this.searchInfo()
    },
    resetHistory() {
      this.history = []
      window.localStorage.setItem('searchHistory', JSON.stringify([]))
    },
    saveOpr() {
      window.localStorage.setItem('userEasyOpr', JSON.stringify(this.userCheckedOpr.map((itemM) => itemM.opr)))
      this.$message.success('编辑成功')
      this.easyOprFlag = false
    },
    deleteOpr(index: number) {
      this.userEasyOpr.splice(index, 1)
    },
    addFastList(item: any) {
      if (this.userCheckedOpr.length >= 6) {
        this.$message.warning('最多可添加6个快捷操作入口')
      } else {
        item.isChecked = true
      }
    },
    completeTodo(item: any) {
      if (item.status === 2) {
        return
      }
      this.$confirm('是否确认完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          todoInfo
            .complete({
              id: [item.id]
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('待办事项已完成')
                item.status = 2
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
    // doc_type 2 3的时候 doc_order_id和doc_order_time_id 分别对应plan_id和sup_id
    todoUrl(item: any) {
      if (item.doc_type === 1) {
        this.$openUrl('/order/detail?id=' + item.doc_id)
      } else if (item.doc_type === 2) {
        this.$openUrl(
          '/materialManage/detail?id=' +
            (item.doc_order_id || item.doc_order_time_id) +
            '&orderDocId=' +
            item.doc_id +
            (item.doc_order_time_id ? '&supFlag=true' : '')
        )
      } else if (item.doc_type === 3) {
        this.$openUrl(
          '/materialManage/detail?id=' +
            (item.doc_order_id || item.doc_order_time_id) +
            '&processDocId=' +
            item.doc_id +
            (item.doc_order_time_id ? '&supFlag=true' : '')
        )
      } else if (item.doc_type === 4) {
        this.$openUrl(
          '/productionPlan/detail?id=' +
            item.doc_order_id +
            '&sampleOrderIndex=' +
            item.doc_order_time_id +
            '&productionDocId=' +
            item.doc_id
        )
      } else if (item.doc_type === 5) {
        this.$openUrl('/quotedPrice/detail?id=' + item.doc_id)
      } else if (item.doc_type === 6) {
        this.$openUrl(
          '/materialStock/detail?id=' +
            item.doc_order_id +
            '&sampleOrderIndex=' +
            item.doc_order_time_id +
            '&stockDocId=' +
            item.doc_id
        )
      } else if (item.doc_type === 7) {
        this.$openUrl('/materialPlanOrder/detail?id=' + item.doc_id)
      } else if (item.doc_type === 9) {
        this.$openUrl(
          '/materialPlan/detail?id=' +
            item.doc_order_id +
            '&sampleOrderIndex=' +
            item.doc_order_time_id +
            '&materialPlanId=' +
            item.doc_id
        )
      } else if (item.doc_type === 10) {
        this.$openUrl('/materialManage/detail?id=' + item.doc_id + '&supFlag=1')
      } else if (item.doc_type === 11) {
        this.$openUrl('/packManage/detail?id=' + item.doc_order_id)
      } else if (item.doc_type === 13) {
        this.$openUrl('/boxManage/boxDetail?id=' + item.doc_id)
      } else if (item.doc_type === 14) {
        this.$openUrl('/workshopManagement/detail?id=' + item.doc_id)
      } else if (item.doc_type === 17) {
        this.$openUrl('/sampleOrder/detail?id=' + item.doc_id + '&sampleOrderIndex=' + item.doc_order_time_id)
      } else if (item.doc_type === 18) {
        this.$openUrl(
          '/accessoriesManage/detail?id=' + item.doc_order_id + '&sampleOrderIndex=' + item.doc_order_time_id
        )
      } else if (item.doc_type === 19) {
        this.$openUrl('/inspection/detail?id=' + item.doc_order_id)
      } else {
        this.$message.error('暂无该类型')
      }
    }
  },
  computed: {
    // 用户可选的操作
    userCanCheckedOpr(): any[] {
      return this.newSplice(
        this.easyOpr.filter((itemF) => !itemF.isChecked),
        7
      )
    },
    // 用户已选的操作
    userCheckedOpr(): any[] {
      return this.easyOpr.filter((itemF: any) => itemF.isChecked)
    }
  },
  mounted() {
    const moduleInfo = window.sessionStorage.getItem('module_id') as string
    this.easyOpr = moduleInfo
      ? this.easyOpr.filter((item) => {
          return JSON.parse(moduleInfo).indexOf(item.id) !== -1
        })
      : this.easyOpr
    let userEasyOpr = window.localStorage.getItem('userEasyOpr')
      ? JSON.parse(window.localStorage.getItem('userEasyOpr') as string)
      : []
    userEasyOpr.forEach((item: string) => {
      let flag = this.easyOpr.find((itemF) => itemF.opr === item)
      if (flag) {
        flag.isChecked = true
      }
    })
    Promise.all([
      tutorialSystem.list({ type: 1 }),
      todoInfo.list({
        todo_type: ['ERROR_TODO', 'CHECK_TODO'],
        limit: 10,
        page: 1,
        status: 1
      })
    ]).then((res) => {
      this.tutorialSystemArr = res[0].data.data.slice(0, 8)
      this.todoList = res[1].data.data.items
      this.todoList.forEach((item: any) => {
        item.html = this.changeContentToHtml(item.content)
      })
    })
    systemMessage().then((res: any) => {
      this.systemMessageContent = res.data.data.items.length > 0 ? res.data.data.items[0].content : ''
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/homePage.less';
</style>
<style lang="less">
#homePage {
  .searchCtn {
    .el-input-group__prepend {
      background-color: #fff !important;
    }
    .select {
      width: 120px;
      .el-input .el-input__inner {
        border-color: transparent !important;
      }
      .el-input .el-input__inner:focus {
        border-color: transparent !important;
      }
    }
  }
}
</style>