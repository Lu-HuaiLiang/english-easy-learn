import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import cssText from "data-text:~/contents/search.css"

export const config: PlasmoCSConfig = {
  matches: ["https://www.plasmo.com/*"]
}

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const GetSearchList = async (inputValue) =>
  fetch(
    `https://dict.youdao.com/suggest?num=5&ver=3.0&doctype=json&cache=false&le=en&q=${inputValue}`
  )
    .then((res) => res.json())
    .then((res) => res.data);

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.body

// Use this to optimize unmount lookups
export const getShadowHostId = () => "plasmo-inline-example-unique-id"

const PlasmoInline = () => {

  const onChange = (e) => {
    GetSearchList(e.target.value).then((res) => {
      if (res.entries) {
        console.log('==word', res.entries);
      }
    });
  }

  return (
    <div
      className="lingo-search-wrapper"
    >
        <div className="lingo-search">
          <input className="lingo-search-input" onChange={onChange} placeholder="输入想要翻译的内容"></input>
        </div>
    </div>
  )
}

export default PlasmoInline
