<template>
  <div class="keyBoard"
    @click.stop
    :style="{'left':left+'px','top':top+'px'}"
    v-show="show">
    <div class="rowNum">
      <div class="colNum"
        :class="{'active':activeNum==='1'}"
        @mousedown.stop="downEvent('1')"
        @mouseenter="activeNum='1'"
        @mouseleave="activeNum=''">1</div>
      <div class="colNum"
        :class="{'active':activeNum==='2'}"
        @mousedown.stop="downEvent('2')"
        @mouseenter="activeNum='2'"
        @mouseleave="activeNum=''">2</div>
      <div class="colNum"
        :class="{'active':activeNum==='3'}"
        @mousedown.stop="downEvent('3')"
        @mouseenter="activeNum='3'"
        @mouseleave="activeNum=''">3</div>
    </div>
    <div class="rowNum">
      <div class="colNum"
        :class="{'active':activeNum==='4'}"
        @mousedown.stop="downEvent('4')"
        @mouseenter="activeNum='4'"
        @mouseleave="activeNum=''">4</div>
      <div class="colNum"
        :class="{'active':activeNum==='5'}"
        @mousedown.stop="downEvent('5')"
        @mouseenter="activeNum='5'"
        @mouseleave="activeNum=''">5</div>
      <div class="colNum"
        :class="{'active':activeNum==='6'}"
        @mousedown.stop="downEvent('6')"
        @mouseenter="activeNum='6'"
        @mouseleave="activeNum=''">6</div>
    </div>
    <div class="rowNum">
      <div class="colNum"
        :class="{'active':activeNum==='7'}"
        @mousedown.stop="downEvent('7')"
        @mouseenter="activeNum='7'"
        @mouseleave="activeNum=''">7</div>
      <div class="colNum"
        :class="{'active':activeNum==='8'}"
        @mousedown.stop="downEvent('8')"
        @mouseenter="activeNum='8'"
        @mouseleave="activeNum=''">8</div>
      <div class="colNum"
        :class="{'active':activeNum==='9'}"
        @mousedown.stop="downEvent('9')"
        @mouseenter="activeNum='9'"
        @mouseleave="activeNum=''">9</div>
    </div>
    <div class="rowNum">
      <div class="colNum"
        :class="{'active':activeNum==='.'}"
        @mousedown.stop="downEvent('.')"
        @mouseenter="activeNum='.'"
        @mouseleave="activeNum=''">.</div>
      <div class="colNum"
        :class="{'active':activeNum==='0'}"
        @mousedown="downEvent('0')"
        @mouseenter="activeNum='0'"
        @mouseleave="activeNum=''">0</div>
      <div class="colNum"
        :class="{'active':activeNum==='删除'}"
        @mousedown="downEvent('删除')"
        @mouseenter="activeNum='删除'"
        @mouseleave="activeNum=''">删除</div>
    </div>
  </div>
</template>

<script>
import './zhBoarderkey.less'
export default {
  props: ['left', 'top', 'show'],
  data () {
    return {
      activeNum: ''
    }
  },
  methods: {
    downEvent (number) {
      this.$emit('getNum', number)
    }
  },
  mounted () {
    this.$nextTick(() => {
      const body = document.querySelector('body')
      if (body.append) {
        body.append(this.$el)
      } else {
        body.appendChild(this.$el)
      }
    })
  }
}
</script>
