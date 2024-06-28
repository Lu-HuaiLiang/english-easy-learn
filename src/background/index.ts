chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // 检查是否有URL的变化
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, { url: changeInfo.url });
    console.log('检查是否有URL的变化');
  }
});
