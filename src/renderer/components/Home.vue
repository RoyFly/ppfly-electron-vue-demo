<template>
    <div id="wrapper">
        <img id="logo" src="~@/assets/itime.png" alt="electron-vue">
        <main>
            <div class="left-side">
        <span class="title">
          欢迎使用三码合一工控端桌面程序
        </span>
                <system-information></system-information>
            </div>

            <div class="right-side">
                <div class="doc">
                    <div class="title">首页面</div>
                    <button @click="open('http://www.iufc.cn')">创联致信</button>
                    <br><br>
                </div>
                <div class="doc">
                    <div class="title alt">功能测试</div>
                    <button class="alt" @click="apiTest()">后台接口</button><br>
                    <button class="alt" @click="sendMsg()">socketio发送消息</button>
                    <button class="alt" @click="testBeep()">testBeep</button>
                    <!--<button class="alt" @click="testBeep()">testBeep</button>-->
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import SystemInformation from './LandingPage/SystemInformation'
    import {apiDict} from '../api'

    export default {
        name: 'home',
        components: {SystemInformation},
        sockets: {
            testSendEvent:function (val) {
                const option = {
                    title: '单聊通知',
                    body: val.content,
                    icon: require('path').join(__static, 'notify.ico')
                };
                const myNotification = new window.Notification(option.title, option);

                myNotification.onclick = () => {
                    console.log('点击了');
                    this.$electron.shell.openExternal(val.url);
                }
            }
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            apiTest() {
                // 使用年限
                apiDict.getDictParamsOfParentId({
                    paramId: '04cdef9914da0a440114da0d2ff30001'
                }).then(res => {
                    console.log(res);
                    alert("id" + res[0]["id"] + ">>>serviceName=" + res[0]["serviceName"]);
                })

            },
            sendMsg() {
                //发送群聊消息
                this.$socket.emit("groupChatEvent", {
                    content: "李克强会见美国客人：中方将继续成为外国投资的热土",
                    url: "https://www.chinanews.com/gn/2018/09-07/8621613.shtml"
                });
            },
            testBeep: function () {
                //系统声音 播放 beep 声音.
                this.$electron.shell.beep();
            }
        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    #wrapper {
        background: radial-gradient(
                ellipse at top left,
                rgba(255, 255, 255, 1) 40%,
                rgba(229, 229, 229, .9) 100%
        );
        height: 100vh;
        padding: 60px 80px;
        width: 100vw;
    }

    #logo {
        height: auto;
        margin-bottom: 20px;
        width: 80px;
    }

    main {
        display: flex;
        justify-content: space-between;
    }

    main > div {
        flex-basis: 50%;
    }

    .left-side {
        display: flex;
        flex-direction: column;
    }

    .welcome {
        color: #555;
        font-size: 23px;
        margin-bottom: 10px;
    }

    .title {
        color: #2c3e50;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 6px;
    }

    .title.alt {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .doc p {
        color: black;
        margin-bottom: 10px;
    }

    .doc button {
        font-size: .8em;
        cursor: pointer;
        outline: none;
        padding: 0.75em 2em;
        border-radius: 2em;
        display: inline-block;
        color: #fff;
        background-color: #4fc08d;
        transition: all 0.15s ease;
        box-sizing: border-box;
        border: 1px solid #4fc08d;
    }

    .doc button.alt {
        color: #42b983;
        background-color: transparent;
    }
</style>
