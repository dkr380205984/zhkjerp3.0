<template>
  <div id="reimbursementManageDetail" class="bodyContainer" v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <div class="title">报销信息</div>
      </div>
      <div class="detailCtn">
        <div class="checkCtn">
          <el-tooltip class="item" effect="dark" content="点击查看审核日志" placement="bottom">
            <img :src="receiptInfo.status | checkFilter" @click="lookDetailLog" />
          </el-tooltip>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">报销单号：</div>
            <div class="text">{{ receiptInfo.code }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">报销人：</div>
            <div class="text">{{ receiptInfo.name }}</div>
          </div>
          <div class="col">
            <div class="label">所属小组：</div>
            <div class="text">{{ receiptInfo.group }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">创建人：</div>
            <div class="text">{{ receiptInfo.user }}</div>
          </div>
          <div class="col">
            <div class="label">创建时间：</div>
            <div class="text">{{ receiptInfo.created_at }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">相关凭证：</div>
            <div class="text">
              <span v-for="(item, index) in receiptInfo.certificate" :key="item + index" style="margin-left: 20px">
                <el-image
                  :src="item"
                  :previewSrcList="receiptInfo.certificate"
                  style="width: 100px; height: 100px"
                  fix="cover"
                ></el-image>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <div class="title">报销明细</div>
      </div>
      <div class="tableCtn">
        <div class="thead">
          <div class="trow">
            <div class="tcol" style="flex: 0.5">序号</div>
            <div class="tcol" style="flex: 1.5">报销内容</div>
            <div class="tcol">报销金额（元）</div>
          </div>
        </div>
        <div class="tbody">
          <div class="trow" v-for="(item, index) in receiptInfo.staff_departments" :key="index">
            <div class="tcol" style="flex: 0.5">{{ index + 1 }}</div>
            <div class="tcol" style="flex: 1.5">{{ item.name || '无' }}</div>
            <div class="tcol">{{ item.amount || '无' }}</div>
          </div>
        </div>
        <div class="thead">
          <div class="trow">
            <div class="tcol" style="border-right: none">合计费用</div>
            <div class="tcol"></div>
            <div class="tcol">{{ receiptInfo.amount }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn" @click="$router.go(-1)">返回</div>
          <div class="buttonList" style="margin-left: 12px">
            <div class="btn backHoverOrange" @click="checkFlag = true">
              <svg class="iconFont" aria-hidden="true">
                <use xlink:href="#icon-shenhedingdan"></use>
              </svg>
              <span class="text">审核</span>
            </div>
            <div
              v-if="receiptInfo.status + 1 !== 2"
              class="btn backHoverOrange"
              @click="$router.push('/reimbursementManage/update?id=' + $route.query.id)"
            >
              <svg class="iconFont" aria-hidden="true">
                <use xlink:href="#icon-xiugaidingdan"></use>
              </svg>
              <span class="text">修改</span>
            </div>
            <div class="btn backHoverBlue" @click="$openUrl('/reimbursementManage/print?id=' + $route.query.id)">
              <svg class="iconFont" aria-hidden="true">
                <use xlink:href="#icon-dayindingdan"></use>
              </svg>
              <span class="text">打印</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup" v-show="checkFlag">
      <div class="main">
        <div class="titleCtn">
          <span class="text">报销单审核</span>
          <div class="closeCtn" @click="checkFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="row">
            <div class="label">是否通过：</div>
            <div class="info" style="line-height: 32px">
              <el-radio v-model="reviewerParams.status" :label="2">通过</el-radio>
              <el-radio v-model="reviewerParams.status" :label="3">驳回</el-radio>
            </div>
          </div>
          <div class="row" v-if="reviewerParams.status === 3">
            <div class="label">驳回理由：</div>
            <div class="info" style="min-height: 32px; height: auto">
              <el-input placeholder="请输入驳回理由" v-model="reviewerParams.content"></el-input>
            </div>
          </div>
          <div class="row" v-else></div>
          <div class="row">
            <div class="label">备注信息：</div>
            <div class="info">
              <el-input placeholder="请输入备注信息" v-model="reviewerParams.desc"></el-input>
            </div>
          </div>
        </div>
        <div class="oprCtn">
          <span class="btn borderBtn" @click="checkFlag = false">取消</span>
          <span class="btn backHoverBlue" @click="agreeCheck">确认</span>
        </div>
      </div>
    </div>
    <div class="popup" v-show="detailCheckFlag">
      <div class="main" style="min-width: 1000px">
        <div class="titleCtn">
          <span class="text">报销单审核详情</span>
          <div class="closeCtn" @click="detailCheckFlag = false">
            <span class="el-icon-close"></span>
          </div>
        </div>
        <div class="contentCtn">
          <div class="listCtn">
            <div class="list">
              <div class="row title">
                <div class="col">审核人</div>
                <div class="col" style="flex: 0.5">审核状态</div>
                <div class="col">审核时间</div>
                <div class="col">驳回理由</div>
                <div class="col">备注信息</div>
              </div>
              <div class="row" v-for="item in reviewerList" :key="item.id">
                <div class="col">{{ item.user.name }}</div>
                <div class="col" style="flex: 0.5" :class="{ red: item.status === 3, green: item.status === 2 }">
                  {{ item.status === 2 ? '通过' : '驳回' }}
                </div>
                <div class="col">{{ item.updated_at }}</div>
                <div class="col">{{ item.content }}</div>
                <div class="col">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { receipt } from '@/assets/js/api'
import zhImage from '@/components/zhImage/zhImage.vue'
export default Vue.extend({
  components: { zhImage },
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      checkFlag: false,
      detailCheckFlag: false,
      is_check: 2,
      reviewerParams: {
        content: '',
        desc: '',
        status: 2,
        id: this.$route.query.id
      },
      reviewerList: [],
      receiptInfo: {
        staff: {},
        group: '',
        certificate: '',
        staff_departments: [
          {
            name: '',
            amount: ''
          }
        ],
        id: '',
        user: '',
        amount: 0
      }
    }
  },
  methods: {
    init() {
      receipt
        .detail({
          id: this.$route.query.id + ''
        })
        .then((res) => {
          let data = res.data.data
          this.receiptInfo = {
            amount: data.amount,
            group: data.group,
            code: data.code,
            name: data.name,
            status: data.status - 1,
            created_at: data.created_at,
            staff_departments: data.receipt_contents,
            certificate: data.certificate.split(','),
            user: data.user.name
          }
          this.loading = false
        })
    },
    agreeCheck() {
      this.reviewerParams.status === 2 ? (this.reviewerParams.content = '') : ''
      receipt.reviewer(this.reviewerParams).then((res) => {
        if (res.data.status) {
          this.$message.success('审核修改成功')
          this.reviewerParams = {
            content: '',
            desc: '',
            status: 2,
            id: this.$route.query.id
          }
          this.checkFlag = false
          this.init()
        }
      })
    },
    lookDetailLog() {
      receipt
        .reviewerList({
          receipt_id: this.$route.query.id + ''
        })
        .then((res) => {
          this.reviewerList = res.data.data
        })
      this.detailCheckFlag = true
    }
  },
  mounted() {
    this.init()
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/reimbursementManage/detail.less';
</style>