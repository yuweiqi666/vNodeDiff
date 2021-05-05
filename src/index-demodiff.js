import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from "snabbdom";

// 创建patch函数

const patch = init([classModule, propsModule, styleModule, eventListenersModule]) 

const vNode1 = h("ul", {}, [
  h("li", {key: "A"}, "A"),
  h("li", {key: "B"}, "B"),
  h("li", {key: "C"}, "C"),
  h("li", {key: "D"}, "D"),
])

const vNode2 = h("ul", {}, h("section", {}, [
  h("li", {key: "E"}, "E"),
  h("li", {key: "B"}, "B"),
  h("li", {key: "C"}, "C"),
  h("li", {key: "D"}, "D")
]))


const container = document.querySelector("#container")

const btn = document.querySelector("button")

patch(container, vNode1)

btn.addEventListener("click", function() {
  patch(vNode1, vNode2)
})

