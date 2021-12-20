<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: '三码合一工控端桌面程序',
        //这里为全局监听socket事件消息
        sockets: {
            connect: function () {//vue客户端和socket.io服务器端建立连接以后触发的方法
                console.log('连接成功...socket connected')
            },
            disconnect() {
                console.log("Socket 断开...socket disconnect");
            },
            testBoradcastEvent:function (val) {
                console.log("这是渲染线程console.log的方法，ipcRenderer.send给主线程，在控制台也会打印");
                val.title = "广播通知";
                this.$electron.ipcRenderer.send('toMain', val);
            }
        },
        mounted() {
            //监听网络变化
            window.addEventListener('online', function(){
                const option = {
                    title: '提示!',
                    body: '网络已连接',
                    icon: require('path').join(__static, 'notify.ico')
                };
                const myNotification = new window.Notification(option.title,option);
            });
            window.addEventListener('offline', function(){
                const option = {
                    title: '提示!',
                    body: '网络已经断开，请检查您的网络设置!',
                    icon: require('path').join(__static, 'notify.ico')
                };
                const myNotification = new window.Notification(option.title,option);
            });

            //监听右键菜单
            window.addEventListener('contextmenu',(e)=>{
                e.preventDefault();
                //给主进程广播事件   注意this指向
                this.$electron.ipcRenderer.send('contextmenu');
            })

            window.onresize=()=>{
                console.log("窗口高度变为：",document.documentElement.clientHeight+"px");
            }
        }
    }
</script>

<style>
    /* CSS */
</style>
