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
          <div class="msgCtn">
            <el-badge :is-dot="total>0">
              <i class="el-icon-bell elIcon"
                @click="$router.push('/otherPage/msgList')"></i>
            </el-badge>
            <div class="msgTop"></div>
            <div class="msgBox"
              v-loading="msgLoading">
              <div class="msgOpr">
                <span>待办事项</span>
                <span class="hoverBlue"
                  @click="getTodoList">刷新待办事项</span>
              </div>
              <div class="msgContent">
                <div class="noMsg"
                  v-show="msgList.length===0">暂无新通知</div>
                <div class="oneMsg"
                  v-for="item in msgList"
                  :key="item.id"
                  @click="todoUrl(item)">
                  <div class="oneMsgLeft">
                    <div class="oneMsgLine1">
                      <span class="mark orange">{{item.doc_type|filterType}}</span>
                      <span class="oneMsgTitle"
                        v-html="changeContentToHtml(item.content)"></span>
                    </div>
                    <!-- <div class="oneMsgLine2">
                      <div class="oneMsgInfo"
                        v-html="item.content"></div>
                    </div> -->
                  </div>
                  <div class="oneMsgRight">
                    <div class="oneMsgLine1">{{item.updated_at.slice(0,10)}}</div>
                    <div class="oneMsgLine2">{{item.user_name}}</div>
                  </div>
                </div>
              </div>
              <div class="msgBottom"><span @click="$router.push('/otherPage/msgList')">查看全部</span></div>
            </div>
          </div>
          <!-- <i class="el-icon-setting elIcon"
            v-show="haveSet"
            @click="$router.push('/setting?pName=产品设置&cName=品类')"></i> -->
          <!-- <i class="el-icon-s-data elIcon"
            @click="$router.push('/order/orderStat/page=1&&keyword=&&date=&&group_id=&&company_id=')"></i> -->
          <i class="el-icon-s-data elIcon"
            @click="$openUrl('/deliveryVisualization')"></i>
          <div class="headImg">{{userName.charAt(userName.length-1)}}</div>
          <div class="selectCtn">
            <el-dropdown @command="commondHandler"
              trigger="click">
              <span class="el-dropdown-link">
                个人中心<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="changePas">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout"
                  divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <div class="breadCtn"
      ref="breadCtn">
      <div class="bread">
        <zh-bread></zh-bread>
      </div>
    </div>
    <div class="body"
      :style="{'max-height':'calc(100% - '+ breadHeight +'px)'}">
      <div class="main">
        <!-- keep-alive是Vue提供的一个抽象组件，用来对组件进行缓存  -->
        <router-view />
      </div>
    </div>
    <div class="popup"
      v-if="changePasPopupFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">修改密码</span>
          <span class="el-icon-close"
            @click="closePopup"></span>
        </div>
        <div class="contentCtn">
          <div class="row">
            <span class="label">新密码：</span>
            <span class="info">
              <el-input placeholder="请输入新密码"
                v-model="firstPasd">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">确认密码：</span>
            <span class="info">
              <el-input placeholder="请再次输入新密码"
                v-model="lastPasd">
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">验证码：</span>
            <span class="info">
              <el-input placeholder="请输入验证码"
                v-model="verificationCode">
                <template slot="append">
                  <div :class="{'canHandle':!resetTime,'notHandle':resetTime}"
                    @click="sendVerificationCode">{{resetTime ? `${resetTime}s后重试` : '发送验证码'}}</div>
                </template>
              </el-input>
              <div class="prompt"
                v-if="resetTime">已向{{telephoneComp}}发送验证码,请注意查收</div>
              <div class="prompt"
                v-else>点击发送验证码,将会向手机号{{telephoneComp}}发送验证码</div>
            </span>
          </div>
        </div>
        <div class="oprCtn">
          <div class="btn borderBtn"
            @click="closePopup">取消</div>
          <div class="btn backHoverOrange"
            @click="changePasd">修改</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Pusher from 'pusher-js' // 全局方法
import { navInfo } from '@/types/nav'
import { changePassword, getCoder, productionProgress, systemMessage, todoInfo } from '@/assets/js/api'
export default Vue.extend({
  data(): {
    navData: navInfo[]
    moduleArr: string
    [propName: string]: any
  } {
    return {
      breadHeight: 100,
      moduleArr: window.sessionStorage.getItem('module_id') as string,
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
      navData: [
        {
          name: '报价管理',
          id: 1,
          icon: 'icon-baojiaguanli1',
          url: '/quotedPrice/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          name: '样单管理',
          id: 2,
          icon: 'icon-yangdanguanli1',
          url: '/sampleOrder/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          name: '订单管理',
          id: 3,
          icon: 'icon-dingdanguanli1',
          url: '/order/list?page=1&keyword=&client_id=&user_id=&status=null&date='
        },
        {
          name: '数据报表',
          id: 4,
          icon: 'icon-shujubaobiao',
          url: '/dataReport/orderStatistics'
        },
        {
          name: '单据管理',
          id: '20-1',
          icon: 'icon-danjuguanli',
          url: '/billingManagement/rawMaterialPlan?page=1'
        },
        {
          name: '其它管理',
          id: null,
          icon: 'icon-qitaguanli1',
          url: '/menu'
        }
      ],
      msgLoading: false
    }
  },
  watch: {
    $route() {
      // @ts-ignore
      this.breadHeight = 64 + this.$refs.breadCtn.clientHeight
    }
  },
  methods: {
    getTodoList() {
      this.msgLoading = true
      todoInfo
        .list({
          limit: 10,
          page: 1,
          status: 1
        })
        .then((res) => {
          if (res.data.status) {
            this.msgList = res.data.data
            this.total = this.msgList.length
          }
          this.msgLoading = false
        })
    },
    todoUrl(item: any) {
      if (item.doc_type === 1) {
        this.$openUrl('/order/detail?id=' + item.doc_id)
      } else if (item.doc_type === 2) {
        this.$openUrl('/materialManage/detail?id=' + item.doc_order_id || item.doc_order_time_id)
      } else if (item.doc_type === 3) {
        this.$openUrl('/materialManage/detail?id=' + item.doc_order_id || item.doc_order_time_id)
      } else if (item.doc_type === 4) {
        this.$openUrl('/productionPlan/detail?id=' + item.doc_order_id + '&sampleOrderIndex=' + item.doc_order_time_id)
      } else if (item.doc_type === 5) {
        this.$openUrl('/quotedPrice/detail?id=' + item.doc_id)
      } else if (item.doc_type === 6) {
        this.$openUrl('/materialStock/detail?id=' + item.doc_order_id + '&sampleOrderIndex=' + item.doc_order_time_id)
      } else if (item.doc_type === 7) {
        this.$openUrl('/materialPlanOrder/detail?id=' + item.doc_id)
      } else if (item.doc_type === 9) {
        this.$openUrl('/materialPlan/detail?id=' + item.doc_order_id + '&sampleOrderIndex=' + item.doc_order_time_id)
      } else if (item.doc_type === 10) {
        this.$openUrl('/materialManage/detail?id=' + item.doc_id + '&supFlag=1')
      } else if (item.doc_type === 11) {
        this.$openUrl('/packManage/detail?id=' + item.doc_order_id)
      } else if (item.doc_type === 13) {
        this.$openUrl('/boxManage/boxDetail?id=' + item.doc_id)
      } else if (item.doc_type === 14) {
        this.$openUrl('/workshopManagement/detail?id=' + item.doc_id)
      } else if (item.doc_type === 17) {
        this.$openUrl('/sampleOrder/detail?id=' + item.doc_id)
      } else if (item.doc_type === 18) {
        this.$openUrl(
          '/accessoriesManage/detail?id=' + item.doc_order_id + '&sampleOrderIndex=' + item.doc_order_time_id
        )
      }
    },
    commondHandler(ev: string) {
      if (ev === 'logout') {
        window.sessionStorage.setItem('user_name', '')
        window.sessionStorage.setItem('company_id', '')
        window.sessionStorage.setItem('company_name', '')
        window.sessionStorage.setItem('full_name', '')
        window.sessionStorage.setItem('module_id', '')
        window.sessionStorage.setItem('logo', '')
        window.sessionStorage.setItem('has_check', '')
        this.$message.success('已退出登录')
        this.$router.push('/login')
      } else if (ev === 'changePas') {
        this.changePasPopupFlag = true
      }
    },
    closePopup() {
      this.changePasPopupFlag = false
    },
    // 发送验证码
    sendVerificationCode() {
      const outTime = (new Date().getTime() - this.lastTime) / 1000
      if (!this.lastTime || outTime > this.sendIntervalTime) {
        getCoder
          .forgetPassword({
            telephone: this.telephoneComp
          })
          .then((res) => {
            if (res.data.status !== false) {
              this.$message.success(`我们已向您的手机号发送一条6位长度验证码，请注意查收`)
              this.lastTime = new Date().getTime() // 记录点击时间
              this.sendInterval()
            }
          })
      } else {
        this.$message.warning(`${this.resetTime}s后在重试`)
      }
    },
    // 重试倒计时
    sendInterval() {
      const outTime = (new Date().getTime() - this.lastTime) / 1000
      this.resetTime = Math.ceil(this.sendIntervalTime - outTime)
      if (outTime <= this.sendIntervalTime) {
        window.requestAnimationFrame(() => {
          this.sendInterval()
        })
      }
    },
    changePasd() {
      if (!/^[0-9]{6}$/.test(this.verificationCode)) {
        this.$message.error('请输入正确的4位数字验证码')
        return
      }
      if (!this.firstPasd || !this.lastPasd) {
        this.$message.error('请输入新密码')
        return
      }
      if (this.firstPasd !== this.lastPasd) {
        this.$message.warning('请确认输入的密码一致')
      } else {
        changePassword({
          sms_code: this.verificationCode,
          new_password: this.firstPasd
        }).then((res) => {
          if (res.data.status !== false) {
            this.$message.success('修改密码成功，请重新登录')
            this.$router.push('/login')
          }
        })
      }
    },
    // 扫码枪监听事件
    smqListener(e: any) {
      let curryCode = e.which || e.keyCode
      const curryTime = new Date().getTime()
      if (curryCode === 13 && curryTime - this.lastTime <= 30) {
        // 当按键为enter时调用callback
        if (!this.code) return
        if (
          this.code.substring(0, 40) === 'https://knit-m-api.zwyknit.com/bindOrder' ||
          this.code.substring(0, 39) === 'https://knit_beta.zwyknit.com/bindOrder'
        ) {
          let params = this.$getQueryArgs(this.code)
          productionProgress
            .codeInfo({
              hash: params.hash
            })
            .then((res) => {
              if (res.data.status) {
                this.$router.push(
                  '/inspection/detail?id=' +
                    res.data.data.order_id +
                    '&code=' +
                    res.data.data.code_product_info[0].weave_plan.code +
                    '&product_id=' +
                    res.data.data.product.id +
                    'isBarcodeScanner=true'
                )
              }
            })
          return
        }
        if (this.scannerEvent) {
          this.scannerEvent(this.code)
        } else {
          // 默认开新窗口跳转页面
          this.$openUrl(this.code)
        }
        this.code = ''
      } else if (curryCode === 16) {
        this.lastTime = curryTime
      } else if (curryCode === 13) {
        this.lastTime = curryTime
      } else {
        if (curryTime - this.lastTime <= 30) {
          this.code += e.key
        } else if (curryTime - this.lastTime > 100) {
          this.code = e.key
        }
        this.lastTime = curryTime
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
    }
  },
  computed: {
    telephoneComp(): string {
      const telephone = window.sessionStorage.getItem('telephone') || ''
      if (telephone) return String().concat(telephone.slice(0, 3)).concat('****').concat(telephone.slice(-4))
      return telephone
    },
    title() {
      return this.$store.state.title
    },
    breadUrl() {
      return this.$store.state.breadUrl
    },
    // haveSet(): boolean {
    //   return !this.moduleArr || JSON.parse(this.moduleArr) !== -1
    // },
    navCmp(): navInfo[] {
      if (this.moduleArr) {
        return JSON.parse(this.moduleArr).length > 0
          ? this.navData.filter((item: navInfo) => {
              return item.id ? JSON.parse(this.moduleArr).indexOf(item.id) !== -1 : true
            })
          : this.navData
      } else {
        return this.navData
      }
    }
  },
  filters: {
    filterType(val: number) {
      const arr = [
        '',
        '订单',
        '物料订购单',
        '物料加工单',
        '生产计划单',
        '报价单',
        '原料出入库单',
        '原料预订购单',
        '产品出入库单',
        '物料计划单',
        '补纱单',
        '包装采购单',
        '扣款单',
        '运输单',
        '车间管理单',
        '开票单',
        '收款单',
        '样单',
        '辅料采购单'
      ]
      return arr[val]
    }
  },
  mounted() {
    this.getTodoList()
    window.addEventListener('keydown', this.smqListener, false)
    // 消息通知
    let vue = this
    let pusher = new Pusher('9df11d97766e328a79c4', {
      cluster: 'ap3',
      forceTLS: true
    })
    let channel = pusher.subscribe('knit_server_' + this.$getsessionStorage('user_id'))
    channel.bind('knit_server_event', function (data: any) {
      vue.$notify({
        title: data.content.title,
        dangerouslyUseHTMLString: true,
        duration: 0,
        message: vue.changeContentToHtml(data.content)
      })
    })
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.smqListener, false)
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/index.less';
</style>