import vnode from "./vnode"
import createElement from "./createElement"
import patchVnode from "./patchVnode"

export default function patch(oldVnode, newVnode) {
  // 判断传的第一个参数时dom节点还是虚拟节点
  if(oldVnode.sel == "" || oldVnode.sel == undefined) {
    //传入的第一个参数是dom节点  此时需要包装成虚拟节点
    oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)

    // console.log("oldVnode", oldVnode);
  }

  // 判断oldVnode和newVnode是不是同一个节点
  if(oldVnode.key == newVnode.key && oldVnode.sel == newVnode.sel) {
    // 是同一个节点
    patchVnode(oldVnode, newVnode)
  } else {
    // 不是同一个节点 暴力插入新的 删除旧的
    var newVnodedom = createElement(newVnode)
     //插入新的
    oldVnode.elm.parentNode.insertBefore(newVnodedom, oldVnode.elm)
     //删除旧的
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}