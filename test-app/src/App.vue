<template>
  <div id="app">
    <div id="refreshbtn" ref="btnrefresh" v-show="show" @click="getCode">刷新验证二维码</div>
    <div id="refreshtime" v-show="!show">刷新时间: {{count}} 秒</div>
    <vue-qr :gifBgSrc="require('./assets/comeon2.gif')" :size="300" :dotScale="0.4" :text="qr" qid="testid"></vue-qr>  
    <div id='qr'>{{qr}}</div>
    <div id="myid">设备: {{id}}</div>
    <!-- <input type="button" value="测试验证" @click="validate()" /> -->
    <div id="scan_result" v-if="checkresult.state">
      <h1>恭喜你, 验证成功</h1>
      <ul>
        <li>扫描设备: {{checkresult.scanid}}</li>
        <li>验证时间: {{checkresult.checktime}}</li>
      </ul>
      <input type="button" ref="btnreset" @click="reset()" value="刷新验证二维码" />
      <div>还剩 {{delayResultCount}} 秒 自动关闭</div>
    </div>
  </div>
</template>

<script>
import vueQr from 'vue-qr'
import moment from 'moment'
import Stopwatch from 'timer-stopwatch'

const TIMER = 15000;

export default {
  name: 'app',
  components: {
    vueQr
  },
  data() {
    return {
      id: '',
      show: true,
      count: '',
      timer: null,
      qr: '',
      checkresult: {
        state: false,
        checktime: null,
        scanid: ''
      },
      delay: null,
      delayResult: null,
      delayResultCount: ''
    }
  },
  mounted() {
    // this.$socket.emit('login', this.loginId);
  },
  sockets: {
    connect() {
      this.id = this.$socket.id;
      this.delay = new Stopwatch(1000);
      var _this = this;
      this.delay.onDone(function() {
        _this.$refs.btnrefresh.click();
      });
      this.delay.start();
    },
    ok(data) {
      this.checkresult.checktime = moment().format('YYYY-MM-DD HH:mm:ss');
      this.checkresult.scanid = data;
      this.checkresult.state = true;

      this.delayResult = new Stopwatch(3000);
      var _this = this;
      this.delayResult.onTime(function(time) {
        _this.delayResultCount = Math.round(time.ms / 1000).toString();
      });
      this.delayResult.onDone(function() {
        _this.$refs.btnreset.click();
      });
      this.delayResult.start();
    },
    code(data) {
      this.qr = JSON.stringify(data);
    }
  },
  methods: {
    reset() {
      this.checkresult.checktime = '';
      this.checkresult.scanid = '';
      this.checkresult.state = false;

      this.timer.reset(TIMER);

      this.getCode();
    },
    getCode(){
      var _this = this;

      this.code();

      this.timer = new Stopwatch(TIMER);
      this.timer.onTime(function(time) {
        _this.count = Math.round(time.ms / 1000).toString();
      });
      this.timer.onDone(function() {
        _this.show = true;
        _this.getCode();
      });
      this.timer.start();
      this.show = false;
    },
    code() {
      var msg = {}
      msg.id = this.id;
      msg.command = 'code';
      msg.action = 'checkin';
      // msg.action = 'salarylogin';
      this.$socket.emit('event', msg);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#myid {
  padding: 5px;
  color: gray;
  font-size:8px;
}
#qr {
  border: solid 1px gray;
  padding: 5px;
  color: gray;
  font-size: 8px;
  width: 250px;
  word-break: break-all;
  margin: 0 auto;
  text-align: left;
}
#scan_result {
  background-color: yellowgreen;
  border: solid 1px gray;
  /* margin: 0px 300px 0px 300px; */
  color: white;
  font-size: 8px;
  margin: 0 auto;
  word-break: break-all;
  width: 300px;
  padding-bottom: 10px;
}
#scan_result ul li {
  text-align: left;
}
#scan_result input {
  border: solid 1px gray;
  background-color: white;
  margin: 10px;
}
#refreshbtn {
  border: solid 1px gray;
  margin: 0 auto;
  width: 150px;
  font-size: 9px;
  padding: 4px;
  /* margin: 10px; */
}
#refreshtime {
  color: gray;
  font-size: 8px;
  margin: 5px;
}
</style>
