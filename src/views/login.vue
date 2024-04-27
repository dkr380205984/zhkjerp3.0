<template>
  <div id="login">
    <div class="leftCtn">
      <div class="title">
        织为云 <br />
        协同织造平台
      </div>
      <div class="input_container account">
        <div class="icon">
          <i class="el-icon-user"></i>
        </div>
        <el-input class="input_item"
          v-model="loginInfo.user_name"
          placeholder="请输入帐号"></el-input>
      </div>
      <div class="input_container password">
        <div class="icon">
          <i class="el-icon-lock"></i>
        </div>
        <el-input :type="showPwd ? 'text' : 'password'"
          class="input_item"
          v-model="loginInfo.password"
          placeholder="请输入密码"></el-input>
        <i :class="showPwd ? 'blue' : 'gray'"
          class="el-icon-view"
          style="position: relative; right: 20px; cursor: pointer; font-weight: bold"
          @click="showPwd = !showPwd"></i>
      </div>
      <div class="rememberOrForgetCtn">
        <div class="remember_psd">
          <el-checkbox v-model="remPsd">记住密码</el-checkbox>
        </div>
        <div class="forget_psd"
          @click="showForgetPassword = true">忘记密码？</div>
      </div>
      <div class="login"
        @click="goLogin">登录</div>
      <!-- <div class="buy_account">没有账号？<span class="buy_link">去购买</span></div> -->
      <div class="bottomInfo">
        <div class="line">
          ©zwyknit.com版权所有 数据应用服务：浙ICP备 <a target="_blank"
            href="http://www.miit.gov.cn/">19041626号</a>
        </div>
      </div>
    </div>
    <div class="rightCtn">
      <img :src="require('@/assets/image/login/login_1.jpg')"
        style="width: 100%"
        alt="" />
    </div>
    <!-- 新设备弹窗 -->
    <div class="popup"
      v-show="showNewClient">
      <div class="main">
        <div class="titleCtn">
          <span class="text">新设备验证</span>
          <div class="closeCtn"
            @click="showNewClient = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <span>由于检测到您使用新浏览器登陆，为了保护您的数据安全。我们发送了一条短信验证码到您的手机上，请输入短信验证码，验证通过后方可登陆。</span>
          </div>
          <div class="row">
            <span class="label">手机号：</span>
            <span class="info"
              style="line-height: 32px">
              {{ loginInfo.user_name.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}
            </span>
          </div>
          <div class="row">
            <span class="label">手机验证码：</span>
            <span class="info">
              <el-input placeholder="请输入手机验证码"
                v-model="newClient.sms_code">
                <template slot="append">
                  <span style="cursor: pointer"
                    @click="sendPhoneCode">{{
                    codeTime === 60 ? '获取验证码' : codeTime === 0 ? '重新发送' : codeTime + '秒后重新发送'
                  }}</span>
                </template>
              </el-input>
            </span>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="showNewClient = false">取消</span>
          <span class="btn backHoverBlue"
            @click="checkSmsCode">确认</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showForgetPassword">
      <div class="main">
        <div class="titleCtn">
          <span class="text">忘记密码</span>
          <div class="closeCtn"
            @click="showForgetPassword = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <span class="label">手机号：</span>
            <span class="info">
              <el-input placeholder="请输入手机号"
                v-model="forgetPasswordInfo.telephone"> </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">手机验证码：</span>
            <span class="info">
              <el-input placeholder="请输入手机验证码"
                v-model="forgetPasswordInfo.sms_code">
                <template slot="append">
                  <span style="cursor: pointer"
                    @click="changeCodeTime">{{
                    codeTime === 60 ? '获取验证码' : codeTime === 0 ? '重新发送' : codeTime + '秒后重新发送'
                  }}</span>
                </template>
              </el-input>
            </span>
          </div>
          <div class="row">
            <span class="label">新密码：</span>
            <span class="info">
              <el-input placeholder="请输入新密码"
                type="password"
                v-model="forgetPasswordInfo.new_pass"></el-input>
            </span>
          </div>
          <!-- <div class="row">
            <span class="label">安全验证：</span>
            <span class="info">
              <el-input placeholder='请输入右侧的4位安全验证码'
                v-model="imageCode">
                <template slot="append">
                  <div style="font-size:0">
                    <img :src="verificationCode.canvas"
                      @click="verificationCode.updatedCode()"
                      style="width:70px;height:30px;cursor:pointer"
                      title="点击换一个"
                      alt="4位安全验证码">
                  </div>
                </template>
              </el-input>
            </span>
          </div> -->
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn"
            @click="showForgetPassword = false">取消</span>
          <span class="btn backHoverBlue"
            @click="goChangePassword">确认修改</span>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="bindClient">
      <div class="main">
        <div class="titleCtn">
          <span class="text">绑定公司</span>
        </div>
        <div class="contentCtn">
          <div class="explainCtn">检测到你在多家公司拥有帐号,请绑定其中一家公司后登录.</div>
          <el-radio v-for="item in companyInfo"
            :key="item.company_id"
            style="display: block; padding: 12px"
            v-model="bindClientId"
            :label="item.company_id">{{ item.company_name }}</el-radio>
        </div>
        <div class="oprCtn">
          <span class="btn backHoverBlue"
            @click="goBindClient">确认绑定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCoder, forgetPassword, login, getAuthorization, userCompanySetting } from '@/assets/js/api'
import { LoginInfo, ForgetPasswordInfo } from '@/types/logReg'
class VerificationCode {
  canvas: string
  W: any
  H: any
  constructor({ W, H }: any) {
    this.canvas = ''
    this.W = W
    this.H = H
    this.createdCanvas(W, H)
  }
  static code = Math.floor(Math.random() * 1679615).toString(36)
  updatedCode() {
    VerificationCode.code = Math.floor(Math.random() * 1679615).toString(36)
    this.createdCanvas(this.W, this.H)
  }
  createdCanvas(W: any, H: any) {
    const codeCanvas = document.createElement('canvas')
    codeCanvas.width = W
    codeCanvas.height = H
    const ctx: CanvasRenderingContext2D = codeCanvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = '#ccc'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#F40'
    ctx.textAlign = 'center'
    ctx.font = '46px Roboto Slab'
    VerificationCode.code.split('').forEach((item, index) => {
      ctx.setTransform(1, -0.12, 0.2, 1, 0, 12)
      ctx.fillText(item, (W / 4) * index + W / 8, H / 2 + 20)
    })
    this.canvas = codeCanvas.toDataURL()
  }
  checkCode(code: string) {
    if (code.toLocaleLowerCase() === VerificationCode.code.toLocaleLowerCase()) {
      return true
    }
    return false
  }
}
export default Vue.extend({
  data(): {
    loginInfo: LoginInfo
    forgetPasswordInfo: ForgetPasswordInfo
    [propName: string]: any
  } {
    return {
      showForgetPassword: false,
      showNewClient: false,
      remPsd: true,
      showPwd: false,
      newClient: {
        sms_code: ''
      },
      verificationCode: {
        canvas: ''
      },
      loginInfo: {
        user_name: window.localStorage.getItem('zhUsername') || '',
        password: window.localStorage.getItem('zhPassword') || ''
      },
      forgetPasswordInfo: {
        telephone: '',
        sms_code: '',
        new_pass: ''
      },
      imageCode: '',
      codeTime: 60,
      bindClient: false,
      bindClientId: '',
      companyInfo: [],
      authInfo: {}
    }
  },
  methods: {
    goChangePassword() {
      // if (!this.verificationCode.checkCode(this.imageCode)) {
      //   this.$message.warning('请输入正确的图形验证码')
      //   this.verificationCode.updatedCode()
      //   this.imageCode = ''
      //   return
      // }
      const formCheck = this.$formCheck(this.forgetPasswordInfo, [
        {
          key: 'telephone',
          errMsg: '请输入手机号'
        },
        {
          key: 'sms_code',
          errMsg: '请输入手机验证码'
        },
        {
          key: 'new_pass',
          errMsg: '请输入新密码'
        }
      ])
      if (formCheck) {
        return
      }
      forgetPassword(this.forgetPasswordInfo).then((res) => {
        if (res.data.status === false) return
        this.showForgetPassword = false
        this.$message.success('修改密码成功，请用新密码重新登录')
      })
    },
    goLogin() {
      const formCheck = this.$formCheck(this.loginInfo, [
        {
          key: 'user_name',
          errMsg: '请填写正确的手机号',
          regNormal: 'isPhone'
        },
        {
          key: 'password',
          errMsg: '请填写密码'
        }
      ])
      if (formCheck) {
        return
      }
      if (this.newClient.sms_code) {
        this.loginInfo.sms_code = this.newClient.sms_code
      }
      let lastActive: any = window.localStorage.getItem('lastActive')
      login(this.loginInfo).then((res) => {
        if (res.data.code === 200) {
          // 当他的活跃日期为空的时候以及他的活跃日期大于60天，进行验证码发送
          if (
            this.loginInfo.sms_code ||
            (this.$getDataType(lastActive) !== 'Null' && lastActive !== '' && this.$diffByDate(lastActive) > -60)
          ) {
            // window.sessionStorage.setItem('token', res.data.data.access_token)
            // window.sessionStorage.setItem('token_type', res.data.data.token_type)
            getAuthorization().then((res) => {
              // 用户信息里的公司信息先保存了，方便后续切换的时候使用
              // window.sessionStorage.setItem('user_company', JSON.stringify(res.data.data.company_info))
              // if (res.data.data.bind_company_id) {
              //   this.checkLogin(
              //     res,
              //     res.data.data.company_info.find((item: any) => {
              //       return item.company_id === res.data.data.bind_company_id
              //     })
              //   )
              // } else {
              //   if (res.data.data.company_info.length > 1) {
              //     // 多家公司
              //     this.authInfo = res
              //     this.companyInfo = res.data.data.company_info
              //     this.bindClient = true
              //   } else {
              //     // 给用户自动绑定唯一一家公司的id
              //     userCompanySetting({
              //       company_id: res.data.data.company_info[0].company_id
              //     }).then((res2) => {
              //       if (res2.data.status) {
              //         this.checkLogin(res, res.data.data.company_info[0])
              //       }
              //     })
              //   }
              // }
              this.checkLogin(res, {
                module_info: res.data.data.module_info || [],
                company_name: res.data.data.alias,
                logo: res.data.data.logo
              })
            })
          } else {
            window.localStorage.setItem('lastActive', '')
            this.showNewClient = true
          }
        } else {
          if (this.loginInfo.sms_code) {
            this.loginInfo.sms_code = ''
          } else {
            this.loginInfo.password = ''
          }
        }
      })
    },
    sendPhoneCode() {
      let phone = this.loginInfo.user_name
      getCoder.newClient({ phone: phone }).then((res) => {
        if (res.data.status) {
          this.timer()
        }
      })
    },
    checkSmsCode() {
      const formCheck = this.$formCheck(this.newClient, [
        {
          key: 'sms_code',
          errMsg: '请填写验证码'
        }
      ])
      if (formCheck) {
        return
      }
      this.goLogin()
    },
    checkLogin(res: any, companyInfo: any) {
      console.log(res)
      this.$message.success({ message: '登录成功', showClose: true })
      // const moduleId = (companyInfo.module_info ? JSON.parse(companyInfo.module_info) : []).concat(
      //   companyInfo.module_id_detail ? JSON.parse(companyInfo.module_id_detail) : []
      // )
      // console.log(moduleId)
      window.sessionStorage.setItem('group_id', res.data.data.group_id)
      window.sessionStorage.setItem('user_name', res.data.data.name)
      window.sessionStorage.setItem('company_id', res.data.data.company_id)
      window.sessionStorage.setItem('company_name', companyInfo.company_name)
      window.sessionStorage.setItem('full_name', companyInfo.full_name)
      window.sessionStorage.setItem('module_id', JSON.stringify(companyInfo.module_info))
      window.sessionStorage.setItem('logo', companyInfo.logo)
      window.sessionStorage.setItem('has_check', res.data.data.has_check)
      window.sessionStorage.setItem('user_id', res.data.data.user_id)
      window.sessionStorage.setItem('beyond_notice_can_print', res.data.data.beyond_notice_can_print)
      window.sessionStorage.setItem('beyond_price_can_print', res.data.data.beyond_price_can_print)
      // window.sessionStorage.setItem('group_name', res.data.data.group_name)
      window.sessionStorage.setItem('telephone', res.data.data.telephone || this.loginInfo.user_name)
      window.localStorage.setItem('zhUsername', this.loginInfo.user_name)
      if (this.remPsd) {
        window.localStorage.setItem('zhPassword', this.loginInfo.password)
      } else {
        window.localStorage.setItem('zhPassword', '')
      }
      this.$router.push('/homePage')
    },
    goRegisiter() {
      this.$message.error('暂未开放注册功能')
    },
    // 忘记密码
    forgetPsd() {
      if (!this.verificationCode.canvas) {
        this.verificationCode = new VerificationCode({ W: 220, H: 100 })
      }
      this.forgetPasswordInfo = {
        telephone: '',
        sms_code: '',
        new_pass: ''
      }
      this.verificationCode.updatedCode()
      this.showForgetPassword = true
    },
    changeCodeTime() {
      const formCheck = this.$formCheck(this.forgetPasswordInfo, [
        {
          key: 'telephone',
          errMsg: '请输入正确的手机号',
          regNormal: 'isPhone'
        }
      ])
      if (!formCheck) {
        if (this.codeTime === 60) {
          this.getCode()
        } else if (this.codeTime === 0) {
          this.codeTime = 59
          this.getCode()
        } else {
          this.$message.error('短信已发送，请' + this.codeTime + '秒后重试')
        }
      }
    },
    timer() {
      let time = setInterval(() => {
        if (this.codeTime > 0) {
          this.codeTime--
        } else {
          this.codeTime = 0
          clearInterval(time)
        }
      }, 1000)
    },
    getCode() {
      getCoder
        .forgetPassword({
          telephone: this.forgetPasswordInfo.telephone
        })
        .then(() => {
          this.timer()
        })
    },
    goBindClient() {
      if (this.bindClientId) {
        userCompanySetting({
          company_id: this.bindClientId
        }).then((res) => {
          if (res.data.status) {
            this.checkLogin(
              this.authInfo,
              this.authInfo.data.data.company_info.find((item: any) => {
                return item.company_id === this.bindClientId
              })
            )
          }
        })
      } else {
        this.$message.error('请至少选择一家公司进行绑定')
      }
    }
  },
  mounted() {}
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/login.less';
</style>
<style lang='less'>
#login {
  .leftCtn {
    .el-input__inner {
      padding-left: 36px;
      color: rgba(0, 0, 0, 0.65);
      background: transparent;
      border: none;
      font-size: 18px;
    }
    .el-carousel__container {
      height: 100%;
    }
    .el-carousel__indicator {
      .el-carousel__button {
        background: rgba(0, 0, 0, 0.65);
      }
      &.is-active {
        .el-carousel__button {
          background: #1a95ff;
          width: 40px;
        }
      }
    }
    .el-carousel__indicators--horizontal {
      bottom: 40px;
      right: 54px;
      left: auto;
    }
  }
}
</style>