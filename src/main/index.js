import {app, BrowserWindow, dialog, globalShortcut, ipcMain, Menu, screen, Tray, Notification} from 'electron'
//store
import '../renderer/store'
// 处理文件路径
const path = require('path');


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
let tray;
let canQuit = false;
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:8090` : `file://${__dirname}/index.html`;

/**
 * 设置系统托盘
 */
function createTray() {
    tray = new Tray(`${__static}\\icon.ico`)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '全屏',
            click: function () {
                mainWindow.maximize()
            }
        },
        {
            label: '最小化',
            click: function () {
                mainWindow.minimize()
            }
        },
        {
            label: '关于',
            click: function () {
                let win = new BrowserWindow({
                    width: 260,
                    height: 350,
                    center: true,
                    resizable: false,
                    maximizable: false,
                    minimizable: false,
                    parent: mainWindow
                })
                win.loadURL("http://www.baidu.com");
            }
        },
        {
            label: '退出',
            click: () => {
                app.quit()
            }
        }
    ]);
    // 设置鼠标指针在托盘图标上悬停时显示的文本
    tray.setToolTip('三码合一')
    tray.on('click', (event, bounds) => {
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        } else {
            mainWindow.show()
        }
    })
    tray.setContextMenu(contextMenu)
}

/**
 * 创建窗口
 */
function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        // 窗口是否全屏
        fullscreen: false,
        height: 563,
        useContentSize: true,
        // electron中设置了kiosk模式（类似ATM上的应用这种，默认全屏，且右上角的还原窗口大小、最小化、关闭按钮不存在的模式）
        // 但是electron还是可以使用alt + f4这种全局的快捷键强制关闭。
        // 更重要的是，这个快捷键无法通过再次被注册的形式被覆盖（因为已经被注册过了。后注册的被忽略了），也无法通过unregister或者unregisterAll这样的api来取消
        kiosk: false,
        width: 1000,
        webPreferences: {
            //可解决跨域
            webSecurity: false
        }
    });

    mainWindow.loadURL(winURL);

    const ses = mainWindow.webContents.session
    console.log("ses.getUserAgent()===", ses.getUserAgent());

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    mainWindow.on('close', (event) => {
        console.log("process.env.NODE_ENV=", process.env.NODE_ENV);
        if (!canQuit && (process.env.NODE_ENV !== 'development')) {
            event.preventDefault();
        }
    });
}

/**
 * 设置窗口顶部菜单栏
 */
function createMenu() {
    // darwin表示macOS，针对macOS的设置
    if (process.platform === 'darwin') {
        const template = [
            {
                label: 'App Demo',
                submenu: [
                    {
                        role: 'about'
                    },
                    {
                        role: 'quit'
                    }]
            }];
        let menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu)
    } else {
        // windows及linux系统
        Menu.setApplicationMenu(null)
    }
}

/**
 * 注销注册快捷键
 */
function createShortCut() {
    globalShortcut.unregisterAll();
    globalShortcut.register('Ctrl+1+2', () => {
        dialog.showMessageBox({
            type: 'info',
            title: '是否退出',
            message: '您确定是否退出该应用？',
            buttons: ['是', '否']
        }, (index) => {
            if (index === 0) {
                canQuit = true;
                app.quit();
            }
        })
    })
}

function showNotification(notify) {
    // app.setAppUserModelId(process.execPath);
    app.setAppUserModelId("三码合一");
    new Notification(notify).show()
}

/**
 * 当 Electron 完成初始化时，发出一次
 */
app.on('ready', () => {
    //设置系统托盘
    createTray();
    //创建窗口
    createWindow();
    //设置窗口菜单
    createMenu();
    //注销注册快捷键
    createShortCut();
});


/**
 * 当所有的窗口都被关闭时触发
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

/**
 * 接收渲染进程广播的数据
 */
ipcMain.on('toMain', (event, data) => {
    console.log("event====", event);
    console.log("data====", data);
    const notify = {
        title: data.title,
        body: data.content,
        icon: path.join(__static, 'notify.ico')
    };
    showNotification(notify);
});

/**
 * 当应用被激活时触发（mac OS）
 * 各种操作都可以触发此事件, 例如首次启动应用程序、尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它。
 */
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
