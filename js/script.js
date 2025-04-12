// 自定义的 document.ready() 方法，用于在 DOM 加载完成后执行回调函数。
(function () {
    // 检测是否为 IE 浏览器
    var ie = !!(window.attachEvent && !window.opera);
    // 检测是否为早期版本的 WebKit 浏览器
    var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
    // 存储回调函数的数组
    var fn = [];
    // 执行所有存储的回调函数
    var run = function () {
        for (var i = 0; i < fn.length; i++) fn[i]();
    };
    var d = document;

    // 定义 document.ready 方法
    d.ready = function (f) {
        // 如果不是 IE 或早期 WebKit 且支持 addEventListener，则直接绑定 DOMContentLoaded 事件
        if (!ie && !wk && d.addEventListener)
            return d.addEventListener('DOMContentLoaded', f, false);

        // 将回调函数存储到数组中，如果已经有回调函数，则直接返回
        if (fn.push(f) > 1) return;

        // 如果是 IE 浏览器，使用 doScroll 方法检测 DOM 是否加载完成
        if (ie)
            (function () {
                try {
                    d.documentElement.doScroll('left'); // 检测 DOM 是否可用
                    run(); // 执行回调函数
                } catch (err) {
                    setTimeout(arguments.callee, 0); // 如果未加载完成，继续检测
                }
            })();
        // 如果是早期 WebKit 浏览器，使用定时器检测 readyState
        else if (wk)
            var t = setInterval(function () {
                if (/^(loaded|complete)$/.test(d.readyState)) {
                    clearInterval(t); // 清除定时器
                    run(); // 执行回调函数
                }
            }, 0);
    };
})();

// 使用自定义的 document.ready 方法
document.ready(
    // 定义 toggleTheme 函数，用于切换主题
    () => {
        // 定义全局对象 _Blog
        var _Blog = window._Blog || {};
        // 从 localStorage 中获取当前主题
        const currentTheme = window.localStorage && window.localStorage.getItem('theme');
        // 判断当前主题是否为暗色主题
        const isDark = currentTheme === 'dark';
        // 获取页面的 body 元素
        const pagebody = document.getElementsByTagName('body')[0];

        // 根据当前主题设置页面初始状态
        if (isDark) {
            document.getElementById("switch_default").checked = true; // 设置桌面端开关为选中状态
            document.getElementById("mobile-toggle-theme").innerText = "· Dark"; // 设置移动端显示为暗色主题
        } else {
            document.getElementById("switch_default").checked = false; // 设置桌面端开关为未选中状态
            document.getElementById("mobile-toggle-theme").innerText = "· Light"; // 设置移动端显示为亮色主题
        }

        // 定义切换主题的逻辑
        _Blog.toggleTheme = function () {
            if (isDark) {
                pagebody.classList.add('dark-theme'); // 添加暗色主题类
                document.getElementById("mobile-toggle-theme").innerText = "· Dark"; // 更新移动端显示
            } else {
                pagebody.classList.remove('dark-theme'); // 移除暗色主题类
                document.getElementById("mobile-toggle-theme").innerText = "· Light"; // 更新移动端显示
            }

            // 为桌面端切换按钮绑定点击事件
            document.getElementsByClassName('toggleBtn')[0].addEventListener('click', () => {
                if (pagebody.classList.contains('dark-theme')) {
                    pagebody.classList.remove('dark-theme'); // 切换为亮色主题
                } else {
                    pagebody.classList.add('dark-theme'); // 切换为暗色主题
                }
                // 将当前主题保存到 localStorage
                window.localStorage &&
                window.localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            });

            // 为移动端切换按钮绑定点击事件
            document.getElementById('mobile-toggle-theme').addEventListener('click', () => {
                if (pagebody.classList.contains('dark-theme')) {
                    pagebody.classList.remove('dark-theme'); // 切换为亮色主题
                    document.getElementById("mobile-toggle-theme").innerText = "· Light"; // 更新移动端显示
                } else {
                    pagebody.classList.add('dark-theme'); // 切换为暗色主题
                    document.getElementById("mobile-toggle-theme").innerText = "· Dark"; // 更新移动端显示
                }
                // 将当前主题保存到 localStorage
                window.localStorage &&
                window.localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            });
        };

        // 初始化主题切换逻辑
        _Blog.toggleTheme();
    }
);
