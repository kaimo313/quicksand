console.log("流沙---> content-script", chrome);

// 设置明亮主题
function setLightThemes() {
    document.getElementById("userSkin").className = "skin-yellow user-skin-White";
}

// 设置暗黑主题
function setDarkThemes() {
    document.getElementById("userSkin").className = "skin-blackwhale user-skin-Black";
}

// 切换主题
function switchThemes(type = "light") {
    if(type === "dark") {
        setDarkThemes();
    } else {
        setLightThemes();
    }
}

// 初始化设置
chrome.storage.local.get(['theme'], res => {
    let { theme } = res;
    console.log("初始化设置 theme--->", theme);
    switchThemes(theme);
});

// 监听消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("监听消息--->", request, sender, sendResponse);
    // 接收信息返回给发送方
    sendResponse("接收到主题切换");
    const { theme } = request;
    switchThemes(theme);
});
