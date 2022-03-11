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
            </el-select>
          </el-input>
          <div class="btn backHoverBlue"
            @click="searchInfo">搜索</div>
        </div>
        <div class="seachHistory">
          <div class="container">
            <span class="label gray">近期搜索记录：</span>
            <span class="normal gray"
              v-for="(item,index) in history"
              :key="index"
              @click="searchHistory(item)">{{item}}</span>
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
            v-show="searchType==='0'||searchType==='1'">
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
              <span class="text">{{item.client_name}}</span>
              <span class="text">{{item.create_time}}</span>
              <span class="text">{{item.user_name}}</span>
              <span class="text">{{item.total_number}}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.order.length===0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType==='0'||searchType==='2'">
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
              <span class="text">{{item.client_name}}</span>
              <span class="text">{{item.create_time}}</span>
              <span class="text">{{item.user_name}}</span>
              <span class="text">{{item.total_number}}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.sampleOrder.length===0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType==='0'||searchType==='3'">
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
              <span class="text">{{item.title}}</span>
              <span class="text">{{item.client_name}}</span>
              <span class="text">{{item.create_time}}</span>
              <span class="text">{{item.user_name}}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.quotedPrice.length===0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType==='0'||searchType==='4'">
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
              <span class="text">{{item.title}}</span>
              <span class="text">{{item.product_code}}</span>
              <span class="text">{{item.create_time}}</span>
              <span class="text">{{item.user_name}}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.craft.length===0">暂无相关信息</div>
          </div>
          <div class="block"
            v-show="searchType==='0'||searchType==='5'">
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
                @click="$openUrl('/materialPlan/detail?id=' + item.id)"></span>
              <span class="text">{{item.order_code}}</span>
              <span class="text">{{item.create_time}}</span>
              <span class="text">{{item.user_name}}</span>
            </div>
            <div class="noMsg"
              v-if="searchList.materialPlan.length===0">暂无相关信息</div>
          </div>
        </div>
      </div>
    </div>
    <div class="fastEditCtn">
      <div class="first_line">
        <div class="fastEdit_item"
          v-for="(item,index) in userCheckedOpr"
          :key="index"
          @click="easyOprFlag ? false : $router.push(item.url)">
          <svg class="iconFont"
            aria-hidden="true">
            <use :xlink:href="'#' + item.icon"></use>
          </svg>
          <span class="name">{{item.opr}}</span>
          <span class="editBtn delete el-icon-minus red"
            v-if="easyOprFlag"
            @click.stop="item.isChecked = false"></span>
        </div>
        <div class="edit_item"
          @click="easyOprFlag ? saveOpr() : easyOprFlag = true">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-zhuangshifuliaocangku"></use>
          </svg>
          <span class="name blue">{{easyOprFlag ? '完成编辑' : '自定义编辑'}}</span>
        </div>
      </div>
      <div class="edit_line_box"
        :class="easyOprFlag ? false : 'hiddle'"
        :style="'height:' + userCanCheckedOpr.length * 132 + 'px'">
        <div class="edit_line"
          v-for="(item,index) in userCanCheckedOpr"
          :key="index">
          <div class="fastEdit_item"
            v-for="(itemN,indexN) in item"
            :key="indexN">
            <svg class="iconFont"
              aria-hidden="true">
              <use :xlink:href="'#' + itemN.icon"></use>
            </svg>
            <span class="name">{{itemN.opr}}</span>
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
            <div class="title">版本更新公告</div>
          </div>
          <div class="content"
            style="overflow: auto;">
            <div v-html="systemMessageContent"></div>
          </div>
        </div>
      </div>
      <div class="rightCtn">
        <div class="module">
          <div class="titleCtn">
            <div class="title">系统教学<div class="fr hoverBlue"
                style="font-size:16px;font-weight:normal;cursor:pointer"
                @click="$openUrl('/tutorialSystem/list')">查看全部</div>
            </div>
          </div>
          <div class="content">
            <div class="line"
              v-for="(item,index) in tutorialSystemArr"
              :key="index">
              <div class="number">{{index + 1}}</div>
              <div class="text"
                @click.prevent="$openUrl('/tutorialSystem/detail?id=' + item.id)">{{item.title}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { homePage } from '@/assets/js/api'
import { tutorialSystem, systemMessage } from '@/assets/js/api'
export default Vue.extend({
  data() {
    return {
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
          opr: '客户与合作商管理',
          isChecked: false,
          id: '13-3',
          icon: 'icon-kehuguanli',
          url: '/client/list?page=1&type=1&status=1&keyword='
        },
        {
          opr: '原料预订购',
          isChecked: false,
          id: '14-3',
          icon: 'icon-wuliaoyudinggou',
          url: '/materialPlanOrder/list?page=1&type=1'
        }
      ],
      searchList: {
        order: [],
        sampleOrder: [],
        quotedPrice: [],
        materialPlan: [],
        craft: []
      },
      tutorialSystemArr: [],
      systemMessageContent: ''
    }
  },
  methods: {
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
                craft: res.data.data.craft_list
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
    Promise.all([tutorialSystem.list({ type: 1 }), systemMessage()]).then((res) => {
      this.tutorialSystemArr = res[0].data.data.slice(0, 8)
      this.systemMessageContent =
        res[1].data.data.data.length > 0 ? res[1].data.data.data[0].content : '暂无版本更新公告'
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
