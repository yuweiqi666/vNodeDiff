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

// 创建虚拟节点
var myVnode1 = h("a", { props: {href: "http://www.atguigu.com"} }, "张三")

console.log(myVnode1);

var myVnode2 = h("div", {}, "我是一个盒子")


var myVnode3 = h("ul", {class: {"father": true}}, [
  h("li",  "香蕉"),
  h("li",  "苹果"),
  h("li",  "梨子")
])

console.log(myVnode3)

// 让虚拟节点上树

const container = document.getElementById("container")

patch(container, myVnode3)
