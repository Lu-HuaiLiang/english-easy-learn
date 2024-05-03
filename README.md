# 🍊 english-easy-learn（Chrome插件）

👏 欢迎使用 [english-easy-learn](https://github.com/Lu-HuaiLiang/english-easy-learn-chrome-extension)，开发 [english-easy-learn](https://github.com/Lu-HuaiLiang/english-easy-learn-chrome-extension) 的最初目的是为了辅助我个人的英语学习。在最初的版本，[english-easy-learn](https://github.com/Lu-HuaiLiang/english-easy-learn-chrome-extension) 只有查单词和翻译的功能，后面为了改善我自己的发音，和更好的识别生词，我加入了朗读功能和生词本功能。这些特性对于我在记忆单词、理解单词、习惯英语发音方面，有很好的帮助。独乐乐不如众乐乐，所以我决定把它开源了，希望也对于你有所帮助。如果遇到什么问题或者有什么新想法想法🌟

欢迎给我提[issue](https://github.com/Lu-HuaiLiang/english-easy-learn-chrome-extension/issues)。如果你也喜欢 [english-easy-learn](https://github.com/Lu-HuaiLiang/english-easy-learn-chrome-extension)，也记得帮我点个Star🌟，感谢！

### 一、直接下载使用｜Quick Use

如何安装插件？先打开开发者模式，然后点击加载已解压的扩展程序即可!!!

### 二、主要能力｜Highlighted Features

1. 📝 划词查单词
2. 📝 划词句子翻译｜支持 unlimited Google Translation（需要本地外网环境）
3. 📻 划句子朗读
4. 🌟 记录生词，并在原文标记高亮出来。支持自主备份生词、导出生词、清空生词！

> 🚫 生词本不支持（联网），只支持本地存储！
> 原因：作为开源项目，需要租赁服务器，校验登陆信息，花销很大。
> 注意⚠️如果你卸载掉了插件会使得生词本丢失，因为每一次添加生词，都只是添加到了插件的`chrome.storage.sync`上，卸载掉了插件，会意味着存储跟着也一起卸载掉。所以如果不得不卸载掉插件的时候，请记得在弹窗中点击“复制生词本的所有生词”进行备份。重新安装插件之后，可以直接一键导入。

# 本地调试
框架采用的是 [plasmo](https://github.com/PlasmoHQ/plasmo)

可以用以下命令，在项目的根路径调试!!!
```sh
npm i
npm run dev
```



