console.log("流沙---> service-worker", chrome);

// 设置主题类型
function setThemeType(type) {
    chrome.storage.local.set({ theme: type }, () => {
        console.log('设置主题模式为：', type);
    });
}

// 通过 tabs 发送消息改变主题类型
// tabs api，必须被注册在 manifest 的 permissions 字段中给插件使用，这里不然获取不到 url。
function changeThemeByTabs(themeType){
    chrome.tabs.query({}, tabs => {
        console.log("获取 tabs", tabs);
        for (var i = 0; i < tabs.length; i++) {
            console.log(`tabs[${i}].url`, tabs[i].url);
            try {
                const location = new URL(tabs[i].url);
                const host = location.host;
                console.log(host, host.includes("blog.csdn.net"));
                if (host.includes("blog.csdn.net")) {
                    console.log(tabs[i].id, tabs[i], themeType);
                    // 向选项卡发送消息
                    chrome.tabs.sendMessage(tabs[i].id, {
                        theme: themeType
                    }, response => {
                        // 将打印出"接收到主题切换";
                        console.log(response);
                    });
                }
            }
            catch (e) {
                console.error("报错--->", e);
            }
        }
    });
}

// 添加插件监听被安装事件
// 在 onInstalled 监听器内部，扩展使用 storage API 设置一个值。这将允许多个扩展组件访问该值并进行更新。
// 大部分 API，包括 storage api，必须被注册在 manifest 的 permissions 字段中给插件使用。
chrome.runtime.onInstalled.addListener(() => {
    console.log("插件已安装");
    // 设置主题类型
    setThemeType("light");
});

// 添加图标点击事件监听
chrome.action.onClicked.addListener(() => {
    console.log('1、点击了流沙插件图标');
    // 获取主题类型
    chrome.storage.local.get(["theme"], res => {
        console.log("2、缓存的theme", res);
        let { theme } = res;
        // 修改初始值
        theme = theme === "light" ? "dark" : "light";
        console.log("3、切换 theme 为：", theme);
        // 设置图标
        chrome.action.setIcon({
            path: "icons/popup_" + theme + "_32.png"
        });
        // 设置title
        chrome.action.setTitle({
            title: theme === "light" ? "流沙：明亮模式" : "流沙：暗黑模式"
        });
        // 设置主题类型
        setThemeType(theme);
        // 通过 tabs 发送消息改变主题类型
        changeThemeByTabs(theme);
    });
});