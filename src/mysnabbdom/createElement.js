// 真正创建节点  将vnode创建为DOM  不进行插入
export default function createElement(vnode) { 
  // 创建dom节点
  const domNode = document.createElement(vnode.sel)
  // 有子节点还是文本
  if(vnode.text !== "" && (vnode.children == undefined || vnode.children.length == 0)) {
    // 内部是文本
    domNode.innerText = vnode.text;
  } else if(Array.isArray(vnode.children) && vnode.children.length > 0) {
    // 内部是子节点 要递归创建子节点
    vnode.children.forEach(item => {
      const reldom = createElement(item)
      domNode.appendChild(reldom)
    })
  }

  // 补充elm属性
  vnode.elm = domNode
  // 返回elm elm属性是一个纯dom对象
  return vnode.elm
}