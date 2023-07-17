var globe = planetaryjs.planet();
//在planetaryjs中的中国坐标
var China = [250, -20, 0];
//获取dom元素
var canvas = document.getElementById("globe");


function initGlobe() {
    //加载我们的自定义“autorotate”插件，配置地球旋转角度
    globe.loadPlugin(autorotate(10));
    //配置生成地球的颜色
    globe.loadPlugin(planetaryjs.plugins.earth({
        topojson: { file: "data/world-110m.json" },
        oceans: { fill: '#000040' },
        land: { fill: '#1b72b0' },
        borders: { stroke: '#000055', lineWidth: 1, type: 'internal' }
    }));
    //配置鼠标拖动事件
    globe.loadPlugin(planetaryjs.plugins.drag({
        onDragStart() {
            this.plugins.autorotate.pause();
        },
        onDragEnd() {
            this.plugins.autorotate.resume();
        }
    }))
    //加载点插件,并配置颜色
    //ttl是显示的时间长短，
    //angle是ping的最大角度（它将在其TTL范围内增长到此大小）；默认为5
    globe.loadPlugin(planetaryjs.plugins.pings({
        color: "yellow", ttl: 2000, angle: 3
    }))
    //加载点
//    addPingsThing();
    //获取最近访客的地址点
    getAddr();
    //页面中加载globe的大小和位置
    globeLcation();
    //绘制globe的cavas
    globe.draw(canvas);
    //地球旋转的初始位置
    globe.projection.rotate(China);
    //监听窗口大小变化
    window.addEventListener("resize", () => globeLcation());
}

//页面中加载globe的大小和位置
function globeLcation() {
    const vw = window.innerWidth;

    //返回较大的那个值，通过下列式子 转换成了最大值为500，最小值为300
    const diam = Math.max(300, Math.min(500, vw - (vw * .6)));
    const radius = diam / 2;
    canvas.width = diam;
    canvas.height = diam;
    globe.projection.scale(radius).translate([radius, radius]);
    var vpx = -0.2 * diam + 220;
    $(".visitor-body").css("padding-top", vpx + "px");
    $(".visitor-body").css("padding-bottom", vpx + "px");

    //和globe无关的设置index主题的padding-top
    var indexTop = 0.05 * diam + 5;
    $(".index-h1").css("padding-top", indexTop + "vh");
    //和globe无关的设置skill-bg的padding-top
    var indexTop = 0.05 * diam + 5;
    $(".index-h1").css("padding-top", indexTop + "vh");
}

//自定义插件将自动围绕其垂直方向旋转地球
//轴每秒配置的度数
function autorotate(dps) {
    return function (planet) {
        var lastTick = null;
        var paused = false;
        planet.plugins.autorotate = {
            pause: function () {
                paused = true;
            },
            resume: function () {
                paused = false;
            },
            ispaused: function () {
                return paused;
            }
        };

        //并将钩子配置到其生命周期的某些部分。
        planet.onDraw(function () {
            if (paused || !lastTick) {
                lastTick = new Date();
            } else {
                var now = new Date();
                var delta = now - lastTick;
                //此插件使用内置投影（由D3提供）
                //每次我们画地球仪时都要旋转。
                var rotation = planet.projection.rotate();
                rotation[0] += dps * delta / 1000;

                if (rotation[0] >= 180)
                    rotation[0] -= 360;

                planet.projection.rotate(rotation);
                lastTick = now;
            }
        });
    };
};

////加载点
//function addPingsThing() {
//    d3.json("data/life.json", (error, data) => {
//        if (error) return console.error(error);
//            setInterval(() => {
//                for (const point of data.life) {
//                    globe.plugins.pings.add(point[0], point[1], { color: "white",ttl: 3000, angle: 5 });
//                }
//            }, 3000);
//    })
//}


//ajax获取最近访客的地址点
function getAddr() {
    $.ajax({
        url: "https://zk.zksky.top/zkSky/webData/getAddr",
        type: "GET",
        dataType: "json",
        data: {
            number:100,
        },
        headers: {},
        success: function (res) {
            setInterval(() => {
                //去重并渲染
                for (const point of res.data) {
                    const s1 = new Set();
                    const s2 = new Set();
                    if (s1.has(point.lng) && s2.has(point.lat)) {
                        continue;
                    }
                    globe.plugins.pings.add(point.lng, point.lat);
                    s1.add(point.lng);
                    s2.add(point.lat);
                }
            }, 2000);
        }
    })
}


/**
 * 监听空格键，按下时地球停在中国上方
 * 再次按下，继续转动
 */
$(document).keydown(function (event) {

    if (event.keyCode == 32) {
        var paused = globe.plugins.autorotate.ispaused();
        if (paused == false) {
            globe.projection.rotate([250, -20, 0]);
            globe.plugins.autorotate.pause();
        } else if (paused == true) {
            globe.plugins.autorotate.resume();
        }
        //去掉空格下滑事件
        return false;
    }
});