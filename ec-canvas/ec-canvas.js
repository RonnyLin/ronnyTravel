import WxCanvas from './wx-canvas';
import * as echarts from './echarts';

let ctx;

Component({
  properties: {
    canvasId: {
      type: String,
      value: 'ec-canvas'
    },
    ec: {
      type: Object
    }
  },

  data: {
      touch:{
          distance: 0,
          scale: 1.5
      }
  },

  ready: function () {
    if (!this.data.ec) {
      console.warn('组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" '
        + 'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
      return;
    }

    if (!this.data.ec.lazyLoad) {
      this.init();
    }
  },

  methods: {
    init: function (callback) {
      const version = wx.version.version.split('.').map(n => parseInt(n, 10));
      const isValid = version[0] > 1 || (version[0] === 1 && version[1] > 9)
        || (version[0] === 1 && version[1] === 9 && version[2] >= 91);
      if (!isValid) {
        console.error('微信基础库版本过低，需大于等于 1.9.91。'
          + '参见：https://github.com/ecomfe/echarts-for-weixin'
          + '#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82');
        return;
      }

      ctx = wx.createCanvasContext(this.data.canvasId, this);

      const canvas = new WxCanvas(ctx, this.data.canvasId);

      echarts.setCanvasCreator(() => {
        return canvas;
      });

      var query = wx.createSelectorQuery().in(this);
      query.select('.ec-canvas').boundingClientRect(res => {
        if (typeof callback === 'function') {
          this.chart = callback(canvas, res.width, res.height);
        }
        else if (this.data.ec && this.data.ec.onInit) {
          this.chart = this.data.ec.onInit(canvas, res.width, res.height);
        }
      }).exec();
    },

    canvasToTempFilePath(opt) {
      if (!opt.canvasId) {
        opt.canvasId = this.data.canvasId;
      }
      
      ctx.draw(true, () => {
        wx.canvasToTempFilePath(opt, this);
      });
    },

    touchStart(e) {
      if (this.chart && e.touches.length ==1 ) {
        var touch = e.touches[0];
        this.chart._zr.handler.dispatch('mousedown', {
          zrX: touch.x,
          zrY: touch.y
        });
        this.chart._zr.handler.dispatch('mousemove', {
          zrX: touch.x,
          zrY: touch.y
        });
      }else {
          console.log('双手指触发开始')
          // 注意touchstartCallback 真正代码的开始
          // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug
          // 当两根手指放上去的时候，就将distance 初始化。
          let xMove = e.touches[1].x - e.touches[0].x;
          let yMove = e.touches[1].y - e.touches[0].y;
          let distance = Math.sqrt(xMove * xMove + yMove * yMove);
          this.data.touch.distance = distance;
      }
    },

    touchMove(e) {
        let touch = this.data.touch;
        let chart = this.chart;

        if (this.chart && e.touches.length == 1) {
            var touchs = e.touches[0];
            this.chart._zr.handler.dispatch('mousemove', {
                zrX: touchs.x,
                zrY: touchs.y
            });
        } else {
            console.log('双手指运动开始')
            let xMove = e.touches[1].x - e.touches[0].x;
            let yMove = e.touches[1].y - e.touches[0].y;
            // 新的 ditance
            let distance = Math.sqrt(xMove * xMove + yMove * yMove);
            let distanceDiff = distance - touch.distance;
            let newScale = touch.scale + 0.005 * distanceDiff
            // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
            if (newScale >= 3) {
                newScale = 3
            }
            if (newScale <= 0.6) {
                newScale = 0.6
            }

            touch.distance = distance;
            touch.scale = newScale;
            //手动设置画布的缩放
            if (chart) {
                chart.setOption({
                    geo: {
                        zoom: touch.scale
                    }
                })
            }

        }
    },
    touchEnd(e) {
      if (this.chart) {
        const touch = e.changedTouches ? e.changedTouches[0] : {};
        this.chart._zr.handler.dispatch('mouseup', {
          zrX: touch.x,
          zrY: touch.y
        });
        this.chart._zr.handler.dispatch('click', {
          zrX: touch.x,
          zrY: touch.y
        });
      }
    }
  }
});
