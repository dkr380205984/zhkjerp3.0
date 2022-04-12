<template>
  <div id="clientList"
    class="bodyContainer">
    <div class="topTagCtn">
      <div class="tag"
        :class="{'active':type===1}"
        @click="type=1;clientType='';changeRouter()">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-kehuguanli"></use>
          </svg>
        </div>
        <span class="text">客户管理</span>
      </div>
      <div class="tag"
        :class="{'active':type===2}"
        @click="type=2;clientType='';changeRouter()">
        <div class="iconCtn">
          <svg class="iconFont"
            aria-hidden="true">
            <use xlink:href="#icon-hezuodanweiguanli"></use>
          </svg>
        </div>
        <span class="text">合作单位管理</span>
      </div>
    </div>
    <div class="module"
      v-loading="loading">
      <div class="listCtn">
        <div class="filterCtn">
          <div class="elCtn">
            <el-input placeholder="搜索公司名称"
              v-model="keyword"
              @change="changeRouter"></el-input>
          </div>
          <div class="elCtn">
            <el-select placeholder="筛选客户状态"
              v-model="status"
              @change="changeRouter">
              <el-option label="全部"
                :value="null"></el-option>
              <el-option label="合作中"
                :value="1"></el-option>
              <el-option label="暂停合作"
                :value="0"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select placeholder="客户类型筛选"
              v-model="clientType"
              @change="tag_id='';getClientTag($event)"
              clearable>
              <el-option v-for="item in clientTypeArr"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="btn borderBtn"
            @click="reset">重置</div>
          <div class="btn backHoverBlue fr"
            @click="$router.push('/client/create?type='+$route.query.type)">{{type===1?'添加客户':'添加合作商'}}</div>
          <div class="fr">
            <i style="font-size:20px;line-height:32px;cursor:pointer;font-weight:bold"
              class="el-icon-chat-dot-square"
              :class="{'hoverRed':clientBindList.length>0}"
              @click="bindFlag = true"></i>
          </div>
        </div>
        <div class="filterCtn">
          <div class="elCtn">
            <el-select placeholder="客户标签筛选"
              v-model="tag_id"
              @change="changeRouter"
              clearable>
              <el-option v-for="item in clientTagList"
                :key="item.id"
                :value="item.id"
                :label="item.name"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-select v-model="limit"
              placeholder="每页展示条数"
              @change="changeRouter">
              <el-option v-for="item in limitList"
                :key="item.value"
                :label="item.name"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="elCtn">
            <el-checkbox v-model="only_delete"
              @change="changeRouter"
              :true-label="1">查询已删除的数据</el-checkbox>
          </div>
        </div>
        <div class="list">
          <div class="row title">
            <div class="col">公司简称</div>
            <div class="col">公司全称</div>
            <div class="col">客户类型</div>
            <div class="col">客户标签</div>
            <div class="col">客户状态</div>
            <div class="col">小程序绑定</div>
            <div class="col"
              style="flex:1.8">操作</div>
          </div>
          <div class="row"
            v-for="item in list"
            :key="item.id">
            <div class="col">{{item.name}}</div>
            <div class="col">{{item.alias}}</div>
            <div class="col">{{item.client_type_name}}</div>
            <div class="col">{{item.rel_tag_data.map((item)=>item.name).join('/')}}</div>
            <div class="col"
              :class="{'green':item.status===1,'red':item.status===0}">{{item.status===1?'合作中':'终止合作'}}</div>
            <div class="col"
              :class="{'green':item.workshop_id!=='0','orange':item.workshop_id==='0'}">{{item.workshop_id==='0'?'未绑定':('已绑定'+item.workshop.name)}}</div>
            <div class="col oprCtn"
              style="flex:1.8">
              <span class="opr hoverGreen"
                @click="deletebindClient(item.id)">{{item.workshop_id==='0'?'暂无操作':'解除绑定'}}</span>
              <span class="opr hoverBlue"
                @click="checkClient(item.id,item.status)">{{item.status===1?'终止合作':'继续合作'}}</span>
              <span class="opr hoverOrange"
                @click="$router.push('/client/update?id='+item.id + '&type='+$route.query.type)">修改</span>
              <span class="opr hoverRed"
                @click="deleteClient(item.id)">{{only_delete===1?'恢复数据':'删除'}}</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            @current-change="changeRouter">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="bindFlag">
      <div class="main">
        <div class="titleCtn">
          <div class="text">用户绑定合作单位</div>
          <div class="closeCtn"
            @click="bindFlag=false;getList()">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="contentCtn">
          <div class="box"
            v-for="item in clientBindList"
            :key="item.id">
            <div class="close hoverRed"
              @click="cancelBind(item.uuid)">忽略</div>
            <div class="userName">{{item.user.name}}</div>
            <div class="phone">{{item.user.user_name}}</div>
            <div class="elCtn client">
              <el-select v-model="item.client_id"
                placeholder="请选择合作单位"
                filterable
                :disabled="item.status===2">
                <el-option v-for="item in unBindClient"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
            <div class="process">{{item.user.process}}
              <span class="fr"
                :class="{'hoverBlue':item.status===1&&item.client_id,'gray':!item.client_id,'green':item.status===2}"
                @click="bindClient(item)">{{item.status===1?'确认绑定':'已绑定'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { client, clientBind, clientType } from '@/assets/js/api'
import { limitArr } from '@/assets/js/dictionary'
export default Vue.extend({
  data(): {
    [propName: string]: any
  } {
    return {
      loading: true,
      keyword: '',
      list: [],
      page: 1,
      total: 1,
      limit: 10,
      type: 1,
      status: 1,
      clientTypeList: [],
      clientType: '',
      clientBindList: [],
      unBindClient: [],
      tag_id: '',
      bindFlag: false,
      clientTagList: [],
      limitList: limitArr,
      only_delete: 0
    }
  },
  computed: {
    clientTypeArr(): any {
      return this.clientTypeList.filter((item: { type: string }) => Number(item.type) === Number(this.type))
    }
  },
  watch: {
    $route() {
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    getClientTag(ev: number) {
      this.clientTagList = this.clientTypeList.find((item: any) => item.id === ev).public_tag
      this.changeRouter()
    },
    getFilters() {
      const query = this.$route.query
      this.page = Number(query.page)
      this.limit = Number(query.limit) || 10
      this.type = Number(query.type)
      this.tag_id = Number(query.tag_id) || ''
      this.status = query.status === 'null' ? null : Number(query.status)
      this.keyword = query.keyword
      this.clientType = Number(query.clientType) || ''
      this.only_delete = Number(query.only_delete) || 0
      this.clientTagList = this.clientType
        ? this.clientTypeList.find((item: any) => item.id === Number(query.clientType)).public_tag
        : []
    },
    changeRouter(ev?: any) {
      if (ev !== this.page) {
        this.page = 1
      }
      this.$router.push(
        '/client/list?page=' +
          this.page +
          '&limit=' +
          this.limit +
          '&type=' +
          this.type +
          '&keyword=' +
          this.keyword +
          '&status=' +
          this.status +
          '&clientType=' +
          this.clientType +
          '&tag_id=' +
          this.tag_id +
          '&only_delete=' +
          this.only_delete
      )
    },
    reset() {
      this.$confirm('是否重置所有筛选条件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.status = 1
          this.clientType = ''
          this.tag_id = ''
          this.only_delete = 0
          this.changeRouter()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    getList() {
      this.loading = true
      client
        .list({
          limit: this.limit,
          page: this.page,
          name: this.keyword,
          status: this.status,
          only_delete: this.only_delete,
          tag_id: this.tag_id ? [this.tag_id] : null, // 筛选标签用的，暂时没用到
          client_type_id: this.clientType ? [this.clientType] : this.clientTypeArr.map((item: any) => item.id)
        })
        .then((res) => {
          if (res.data.status) {
            this.list = res.data.data.items
            this.total = res.data.data.total
            this.loading = false
          }
        })
    },
    checkClient(id: number, status: 1 | 2) {
      this.$confirm(status === 1 ? '是否终止合作?' : '是否重新合作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          client
            .check({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('操作成功')
                this.getList()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    deleteClient(id: number) {
      this.$confirm('是否删除该客户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          client
            .delete({
              id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('操作成功')
                this.getList()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    deletebindClient(id: number) {
      this.$confirm('是否解除绑定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          clientBind
            .unbind({
              client_id: id
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('操作成功')
                this.getList()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    },
    // 获取未绑定过用户的合作单位
    getUnBindClient(getClient?: boolean) {
      client
        .list({
          client_type_id: this.clientTypeList
            .filter((item: any) => item.name === '生产织造单位' || item.name === '生产加工单位')
            .map((item: any) => item.id),
          workshop_id: 0
        })
        .then((res) => {
          if (res.data.status) {
            this.unBindClient = res.data.data
            // 初始化的时候找一下有没有名字跟用户申请名字一样得单位
            if (getClient) {
              this.clientBindList.forEach((item: any) => {
                const finded = this.unBindClient.find((itemFind: any) => itemFind.name === item.user.name)
                if (finded) {
                  item.client_id = finded.id
                }
              })
            }
          }
        })
    },
    bindClient(info: any) {
      if (info.client_id && info.status === 1) {
        clientBind
          .bind({
            client_id: info.client_id,
            uuid: info.uuid
          })
          .then((res) => {
            if (res.data.status) {
              info.status = 2
              this.$message.success('绑定成功')
            }
          })
      } else if (info.client_id && info.status === 2) {
        this.$message.success('已绑定')
      } else if (!info.client_id) {
        this.$message.error('请选择需要绑定的单位')
      }
    },
    // 忽略消息
    cancelBind(uuid: string, index: number) {
      this.$confirm('是否忽略该用户申请绑定消息，忽略后将从申请列表删除此消息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          clientBind
            .cancel({
              uuid: uuid
            })
            .then((res) => {
              if (res.data.status) {
                this.$message.success('操作成功')
                clientBind.list().then((res) => {
                  if (res.data.status) {
                    this.clientBindList = res.data.data
                  }
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  },
  created() {
    // 由于列表需要用到type数据，所以这里不用checkCommonInfo
    clientType.list().then((res) => {
      this.clientTypeList = res.data.data
      this.getFilters()
      this.getList()
      clientBind.list().then((res) => {
        if (res.data.status) {
          this.clientBindList = res.data.data
          this.getUnBindClient(true)
        }
      })
    })
  }
})
</script>

<style lang="less" scoped>
@import '~@/assets/css/client/list.less';
</style>