import createElement from "./createElement"
import updateChildren from "./updateChildren"


// oldVnode和newVnode是同一节点执行的函数
export default function patchVnode(oldVnode, newVnode) {
  // 判断oldVnode和newVnode是不是同一个对象
  if(oldVnode === newVnode) {
    // 什么都不做
    console.log("什么都不做");
  } else {
    // 判断newVnode中有没有text属性
    if(newVnode.text && (!newVnode.children || newVnode.children.length == 0)) {
      // newVnode有text属性 没有children
      console.log("newVnode有text属性");
      // oldVnode和newVnode的text属性相同
      if(oldVnode.text == newVnode.text) {
        console.log("什么都不用做");
      } else {
        // oldVnode和newVnode的text属性不相同
        oldVnode.elm.innerText = newVnode.text;
      }
    } else {
      // newVnode没有text属性 有children
      // 判断oldVnode有没有children
      if(oldVnode.children === undefined || oldVnode.children.length == 0) {
        // oldVnode没有children newVnode有children
        console.log("newVnode.children", newVnode.children);
        // 先清空oldVnode中的text
        oldVnode.elm.innerHTML = ""
        // 在将newVnode中的children插入   遍历
        newVnode.children.forEach(item => {
          let dom = createElement(item)
          console.log("dom", dom);
          oldVnode.elm.appendChild(dom)
        })

      } else {
        //oldVnode有children  newVnode有children  最复杂的情况 
        // 子节点优化策略
        updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
        
      }
    }
  }
}