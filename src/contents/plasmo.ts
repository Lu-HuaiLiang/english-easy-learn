import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.baidu.com/*"]
}

// function Content() {
//   const [mainModalVisiable, setMainModalVisiable] = useState(false)
//   return (
//     《
//   )
// }

window.addEventListener("load", () => {
  console.log("content script loaded")
  document.body.style.background = "green"
})
