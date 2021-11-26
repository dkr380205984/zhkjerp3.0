<template>
  <div class="indexMain">
    <div class="header">
      <div class="navCtn">
        <div class="leftCtn">
          <div class="companyCtn"
            @click="$router.push('/homePage')">
            <div class="logo">
              <img :src="logo" />
            </div>
            <div class="name">{{companyName}}</div>
          </div>
          <zh-nav :data="navCmp"></zh-nav>
        </div>
        <div class="rightCtn">
          <!-- <i v-show="false"
            class="el-icon-data-line elIcon"
            @click="$router.push('/other/chartIndex')"></i> -->
          <!-- <div class="msgCtn">
            <el-badge :is-dot="total>0">
              <i class="el-icon-bell elIcon"
                @click="$router.push('/other/msgList')"></i>
            </el-badge>
            <div class="msgTop"></div>
            <div class="msgBox">
              <div class="msgOpr">
                <span>消息通知</span>
                <span @click="readAll">全部标记已读</span>
              </div>
              <div class="msgContent">
                <div class="noMsg"
                  v-show="msgList.length===0">暂无新通知</div>
                <div class="oneMsg"
                  v-for="item in msgList"
                  :key="item.id">
                  <div class="oneMsgLeft">
                    <div class="oneMsgLine1">
                      <span class="oneMsgTitle"
                        @click="readMsg(item)"
                        :class="{'must':item.type==='紧急','normal':item.type==='普通','important':item.type==='重要'}">{{item.title}}</span>
                      <span class="mark"
                        :class="{'blue':item.tag==='工序'||item.tag==='审核','purple':item.tag==='公司','yellow':item.tag==='系统' || item.tag === '版本更新公告'}">{{item.tag}}</span>
                    </div>
                    <div class="oneMsgLine2">
                      <div class="oneMsgInfo"
                        v-html="item.content"></div>
                    </div>
                  </div>
                  <div class="oneMsgRight">
                    <div class="oneMsgLine1">{{item.create_time.slice(0,10)}}</div>
                    <div class="oneMsgLine2">{{item.user_name}}</div>
                  </div>
                </div>
              </div>
              <div class="msgBottom"><span @click="$router.push('/other/msgList')">查看全部通知</span></div>
            </div>
          </div> -->
          <i class="el-icon-setting elIcon"
            v-show="haveSet"
            @click="$router.push('/setting?pName=产品设置&cName=品类')"></i>
          <!-- <i class="el-icon-s-data elIcon"
            v-show="haveSet"
            @click="$router.push('/order/orderStat/page=1&&keyword=&&date=&&group_id=&&company_id=')"></i>
          <div class="headImg">{{userName.charAt(userName.length-1)}}</div>
          <div class="selectCtn">
            <el-dropdown @command="commondHandler"
              trigger="click">
              <span class="el-dropdown-link">
                个人中心<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="sendMsg">发布通知</el-dropdown-item>
                <el-dropdown-item command="changePas"
                  divided>修改密码</el-dropdown-item>
                <el-dropdown-item command="logout"
                  divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div> -->
        </div>
      </div>
    </div>
    <div class="breadCtn">
      <div class="bread">
        <zh-bread></zh-bread>
      </div>
    </div>
    <div class="body">
      <div class="main">
        <!-- keep-alive是Vue提供的一个抽象组件，用来对组件进行缓存  -->
        <router-view />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { navInfo } from '@/types/nav'
export default Vue.extend({
  data(): {
    newNavData: navInfo[]
    moduleArr: null | string
    [propName: string]: any
  } {
    return {
      moduleArr: window.sessionStorage.getItem('module_id'),
      userName: window.sessionStorage.getItem('user_name'),
      logo: window.sessionStorage.getItem('logo') || require('@/assets/image/common/noPic.png'),
      companyName: window.sessionStorage.getItem('company_name') || '未登录',
      msgList: [],
      total: 0,
      changePasPopupFlag: false,
      verificationCode: '',
      lastTime: null,
      resetTime: 0,
      sendIntervalTime: 60, // 方便后期修改间隔时间
      firstPasd: '',
      lastPasd: '',
      newNavData: [
        {
          name: '报价管理',
          id: 1,
          icon: 'icon-baojiaguanli',
          url: '/quotedPrice/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          name: '样单管理',
          id: 2,
          icon: 'icon-yangdanguanli',
          url: '/sampleOrder/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          name: '订单管理',
          id: 3,
          icon: 'icon-dingdanguanli',
          url: '/order/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          name: '其它管理',
          id: null,
          icon: 'icon-qitaguanli',
          url: '/menu'
        }
      ]
    }
  },
  computed: {
    telephoneComp() {
      const telephone = window.sessionStorage.getItem('telephone') || false
      if (telephone) return String().concat(telephone.slice(0, 3)).concat('****').concat(telephone.slice(-4))
      return telephone
    },
    title() {
      return this.$store.state.title
    },
    breadUrl() {
      return this.$store.state.breadUrl
    },
    haveSet(): boolean {
      return !this.moduleArr || JSON.parse(this.moduleArr) !== -1
    },
    navCmp(): navInfo[] {
      if (this.moduleArr) {
        return this.newNavData.filter((item: navInfo) => {
          return item.id ? this.moduleArr!.indexOf(item.id as string) !== -1 : true
        })
      } else {
        return this.newNavData
      }
    }
  },
  mounted() {
    // console.log(window.sessionStorage.getItem('module_id'))
    // console.log(this.moduleArr)
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/index.less';
</style>