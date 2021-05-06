import patchVnode from "./patchVnode"
import createElement from "./createElement"
// 判断是不是同一个虚拟节点
function checkSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key
}

export default function updateChildren(parentNode, oldChild, newChild) {
  // 旧前指针
  let oldStartIndex = 0
  // 旧前节点
  let oldStartNode = oldChild[oldStartIndex]

  // 旧后指针
  let oldEndIndex = oldChild.length -1
  // 旧后节点
  let oldEndNode = oldChild[oldEndIndex]

  // 新前指针
  let newStartIndex = 0
  let newStartNode = newChild[newStartIndex]

  // 新后指针
  let newEndIndex = newChild.length - 1
  let newEndNode = newChild[newEndIndex]


  // 循环开始
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if(checkSameVnode(oldStartNode, newStartNode)) {
      // 1.新前与旧前
      // 递归精细化对比
      patchVnode(oldStartNode, newStartNode)
      oldStartNode = oldChild[++oldStartIndex] 
      newStartNode = newChild[++newStartIndex] 
    } else if(checkSameVnode(oldEndNode, newEndNode)){
      // 2.新后与旧后
      // 递归精细化对比
      patchVnode(oldEndNode, newEndNode)
      oldEndNode = oldChild[--oldEndIndex]
      newEndNode = newChild[--newEndIndex]
    } else if(checkSameVnode(oldStartNode, newEndNode)) {
      // 3.新后与旧前
      patchVnode(oldStartNode, newEndNode)
        // 新后指向的节点移动到旧后节点的后面
        // 插入一个已经在dom树上的节点就是移动节点
      parentNode.insertBefore(oldStartNode.elm, oldEndNode.elm.nextSibling)
      // oldChild[oldStartIndex] = undefined
      newEndNode = newChild[--newEndIndex] 
      oldStartNode = oldChild[++oldStartIndex]

    } else if(checkSameVnode(oldEndNode, newStartNode)) {
      // 4.新前与旧后
      patchVnode(oldEndNode, newStartNode)
      // 插入一个已经在dom树上的节点就是移动节点
      parentNode.insertBefore(oldEndNode.elm, oldStartNode.elm)
      // oldChild[oldEndIndex] = undefined
      newStartNode = newChild[++newStartIndex]
      oldEndNode = oldChild[--oldEndIndex] 
    } else {
      // 四种都没有命中
      oldChild.forEach(item => {
        if(item.sel == newChild[newStartIndex].sel && item.key == newChild[newStartIndex].key) {
          item = undefined
        }
        oldChild[newStartIndex - 1] = newChild[newStartIndex]
      })
    }

  }

  // 循环结束
  if(newStartIndex > newEndIndex) {
    // 删除 旧前与旧后之间的节点
    oldChild.slice(oldStartIndex, oldEndIndex + 1)
    let num = oldEndIndex - oldStartIndex + 1
    for(let i = oldStartIndex; i < num; i++) {
      parentNode.removeChild(oldChild[oldStartIndex].elm)
    }
  } else if(oldStartIndex > oldEndIndex) {
    // 新增新前和新后之间的节点
    let num = newEndIndex - newStartIndex + 1
    for(let i = newStartIndex; i < num; i++) {
      parentNode.insertBefore(createElement(newChild[newStartIndex]) ,oldEndNode.elm.nextSibling)
    } 
  }


  console.log("精细化对比后的oldChild", oldChild);
}