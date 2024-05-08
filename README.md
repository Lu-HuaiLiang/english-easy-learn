# 🍊 english-easy-learn（Chrome插件）

👏 欢迎使用 [english-easy-learn](https://github.com/Lu-HuaiLiang/english-easy-learn-chrome-extension)，开发 [english-easy-learn](https://github.com/Lu-HuaiLiang/english-easy-learn-chrome-extension) 的最初目的是为了辅助我个人的英语学习。在最初的产品版本，[english-easy-learn](https://github.com/Lu-HuaiLiang/english-easy-learn-chrome-extension) 只有查单词和翻译的功能，后面为了改善我自己的发音，和更好的识别生词，我加入了朗读功能和生词本功能。这些特性对于我在记忆单词、理解单词、习惯英语发音方面，有很好的帮助。独乐乐不如众乐乐，所以我决定把它开源了，希望也对于你有所帮助。

如果遇到什么问题或者有什么新想法想法💡，欢迎给我提[issue](https://github.com/Lu-HuaiLiang/english-easy-learn-chrome-extension/issues)。如果你也喜欢 [english-easy-learn](https://github.com/Lu-HuaiLiang/english-easy-learn-chrome-extension)，也记得帮我点个Star🌟，感谢！

![image](https://github.com/Lu-HuaiLiang/english-easy-learn/assets/49161826/80ae65a3-dad4-423a-97f1-68af07005414)

### 零、单词数据来源

来源于 [youdao-dictionary-23w6k](https://github.com/Lu-HuaiLiang/youdao-dictionary-23w6k)

### 一、使用指南｜Quick Use

直接下载这个库 [english-easy-learn-prod](https://github.com/Lu-HuaiLiang/english-easy-learn-prod/tree/main) ，即可开箱📦使用。

### 二、主要能力｜Highlighted Features

1. 📝 划词查单词
2. 📝 划词句子翻译｜支持 unlimited Google Translation（需要本地外网环境）
3. 📻 划句子朗读
4. 🌟 记录生词，并在原文标记出来。支持自主备份生词、导出生词、清空生词！
5. 🚫 支持白名单模式，可以只针对特定网站，应用插件功能。想要在该网站使用插件能力，可以直接勾选。刷新页面之后即刻生效！

> 🚫 生词本不支持（联网），只支持本地存储！
> 原因：作为开源项目，需要租赁服务器，校验登陆信息，以及维护生词本服务，花销很大。
>
> ⚠️注意：如果卸载掉了插件，这会使得生词本丢失。因为每一次添加生词，都只是添加到了插件的`chrome.storage.sync`上，卸载掉了插件，会意味着存储跟着也一起卸载掉。所以如果不得不卸载掉插件，请先记得在弹窗中点击“复制生词本的所有生词”进行备份。重新安装插件之后，可以直接一键导入原本的生词。

#### IMG 一些产品展示图

![image](https://github.com/Lu-HuaiLiang/english-search/assets/49161826/882d450b-d2b2-4cf9-adb6-fe92784f43a1)
![image](https://github.com/Lu-HuaiLiang/english-search/assets/49161826/0491959e-3f03-4c35-a41a-50e9b7349293)
![image](https://github.com/Lu-HuaiLiang/english-search/assets/49161826/519ed1ab-8b1e-4aad-9fcb-cfcc546d961f)

## 更新日志

- 2023.5.8 将黑名单改为白名单，这样缩小了使用插件的场景。不会出现乱出的现象。
- 2023.5.8 popup新增github链接。方便查看文档。

## 未来规划

迭代频率不会特别高，但有 P0 bug 肯定会修复

- [ ] floatBtn的相对偏移位置，从划词的区域，变为鼠标手区域。
- [ ] 尝试加上 eslint。
- [ ] popup弹窗加上 github logo
- [ ] 支持PDF网页划词
- [ ] 增加埋点，收集没有收录的单词，例如：plummeted。

## 本地调试

框架采用的是 [plasmo](https://github.com/PlasmoHQ/plasmo)

开发环境下调试，可以用以下命令，在项目的根路径调试!!!

```sh
npm i
npm run dev
```

生产环境下调试，在根目录下，执行以下命令，就可以得到一个新生成的文件夹build了。

里面有个文件夹`chrome-mv3-dev`，就是我们要的产物了。

```sh
npm i
npm run build
```

## 学习交流

下面是我的个人微信，如果你对徒步、对编程、对语言学习，很感兴趣，欢迎👏一起学习交流。共勉！

![image](https://github.com/Lu-HuaiLiang/english-easy-learn/assets/49161826/f9e9cbed-d0ef-444c-acf6-37fbecfa60ef)
