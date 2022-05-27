<template>
  <div id="msgList"
    class="bodyContainer"
    v-loading="loading">
    <div class="head">
      <h2>全部待办任务
      </h2>
      <!-- <div class="readAll"
        @click="readAll">全部标记已读</div> -->
    </div>
    <div class="body">
      <el-tabs style="padding:0 40px"
        v-model="activeName"
        @tab-click="handleClick">
        <el-tab-pane name="null">
          <span slot="label">全部待办任务
            <el-badge class="mark"
              v-show="type.all>0"
              :value="type.all"
              :max="99" />
          </span>
        </el-tab-pane>
        <el-tab-pane name="1">
          <span slot="label">待完成任务
            <el-badge class="mark"
              v-show="type.todo>0"
              :value="type.todo"
              :max="99" />
          </span>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label">已完成任务
            <el-badge class="mark"
              v-show="type.havedo>0"
              :value="type.havedo"
              :max="99" />
          </span>
        </el-tab-pane>
      </el-tabs>
      <div class="scrollWarp"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled">
        <div class="list">
          <div class="oneMsg"
            :class="{'unread':item.status===1,'readed':item.status===2}"
            v-for="item in msgList"
            :key="item.id"
            @click="todoUrl(item)">
            <div class="oneMsgLeft">
              <div class="oneMsgLine1">
                <span class="mark orange">{{item.doc_type|filterType}}</span>
                <span class="oneMsgTitle"
                  v-html="changeContentToHtml(item.content)"></span>
              </div>
              <div class="oneMsgLine2">
                <div class="oneMsgInfo"
                  v-html="item.content"></div>
              </div>
            </div>
            <div class="oneMsgRight">
              <div class="oneMsgLine1">{{item.updated_at.slice(0,10)}}</div>
              <div class="oneMsgLine2">{{item.user_name}}</div>
            </div>
          </div>
        </div>
        <p v-if="noMore"
          style="text-align:center;color:#666;">加载完毕</p>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="borderBtn"
            @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { todoInfo } from '@/assets/js/api'
export default Vue.extend({
  data() {
    return {
      activeName: 'null',
      noMore: false,
      loading: false,
      pages: 1,
      type: {
        all: 0,
        todo: 0,
        havedo: 0
      },
      msgList: []
    }
  },
  computed: {
    disabled(): boolean {
      return this.loading || this.noMore
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
  methods: {
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
        this.$openUrl('/materialPlan/detail?id=' + item.doc_id)
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
    // 待办事项样式转换
    changeContentToHtml(str: string): string {
      return str
        .replaceAll('修改', '<span style="color:#FA9036">修改</span>')
        .replaceAll('审核', '<span style="color:#01B48C">审核</span>')
        .replace(/【.*】/, function (data) {
          return '<span style="color:#1a95ff">' + data + '</span>'
        })
    },
    handleClick() {
      this.noMore = false
      this.msgList = []
      this.pages = 1
      this.getList()
    },
    load() {
      this.pages++
      this.getList()
    },
    getList() {
      this.loading = true
      todoInfo
        .list({
          limit: 20,
          page: this.pages,
          status: this.activeName
        })
        .then((res) => {
          console.log(res)
          this.msgList = this.msgList.concat(res.data.data)
          if (res.data.data.length === 0) {
            this.noMore = true
          }
          this.loading = false
        })
    }
  },
  mounted() {}
})
</script>
<style lang="less" scoped>
@import '~@/assets/css/otherPage/msgList.less';
</style>
<style lang="less">
#msgList {
  .el-tabs__item {
    color: #666;
    font-weight: 400;
  }
  .el-badge__content.is-fixed {
    top: 7px;
    right: 4px;
  }
}
</style>
