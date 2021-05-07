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

  let keyMap = null

  // 循环开始
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 判断命中之前要先判断指针位置是不是undefined
    if(!oldStartNode) {
      oldStartNode = oldChild[++oldStartIndex]
    }

    if(!oldEndNode) {
      oldEndNode = oldChild[--oldEndIndex]
    }

  


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
      console.log("四种都没有命中");
      // 将oldNewIndex和oldEndIndex之间的虚拟节点的key保存起来
      if(!keyMap) {
        keyMap = {}
        for(let i = oldStartIndex; i <= oldEndIndex; i++) {
          let key = oldChild[i].key
          if(key !== undefined) {
            keyMap[key] = i
          }
        }
        console.log("keyMap", keyMap);
        // 寻找当前newStartNode在keyMAP中的映射
        const idxInOld = keyMap[newStartNode.key]
        if(idxInOld) {
          // idxInOld不是undefined表示不是全新的项 要移动
          let elmToMove = oldChild[idxInOld]
          //新老节点对比
          patchVnode(elmToMove, newStartNode)
          // 移动的节点位置打上标记undefined
          oldChild[idxInOld] = undefined
          // 移动节点
          parentNode.insertBefore(elmToMove.elm, oldStartNode.elm)

        } else {
          // idxInOld是undefined表示这个是全新的一项
          parentNode.insertBefore(createElement(newStartNode), oldStartNode.elm)
        }
      }
      // 指针下移  只移新前
      newStartNode = newChild[++newStartIndex]
    }

  }

  // 循环结束 // 循环结束后移动节点不需要将原来的位置进行undefined因为 后面不需要去循环命中了
  if(newStartIndex > newEndIndex) {
    console.log(123);
    // 删除 旧前与旧后之间的节点
    oldChild.slice(oldStartIndex, oldEndIndex + 1)
    for(let i = oldStartIndex; i <= oldEndIndex; i++) {
      if(oldChild[i]) {
         parentNode.removeChild(oldChild[i].elm)
      }
    }
  } else if(oldStartIndex > oldEndIndex) {
    // 新增新前和新后之间的节点
    if(oldEndIndex < 0) {
        for(let i = newStartIndex; i <= newEndIndex; i++) {
        parentNode.insertBefore(createElement(newChild[i]) ,oldStartNode.elm)
      } 
    } else {
        for(let i = newStartIndex; i <= newEndIndex; i++) {
        parentNode.insertBefore(createElement(newChild[i]) ,oldEndNode.elm.nextSibling)
      } 
    }
  }
  console.log("精细化对比后的oldChild", oldChild);
}