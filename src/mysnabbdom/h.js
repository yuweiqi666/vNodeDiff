import vnode from "./vnode"
   
/**
 * 低配版本h函数必须接受三个参数 
 * 
 * 调用时的参数形态必须是下面三种之一 
 *  1. h("", {}, "")
 *  2. h("", {}, [])
 *  3. h("", {}, h())
 */

export default function(sel, data, c) {
  // 检查参数的个数
  if(arguments.length !== 3) {
    throw new Error("对不起， 低配版h函数必须传三个参数")
  }
  // 检查参数的类型
  if(typeof c == "string" || typeof c == "number") {
    // 形态1
    return vnode(sel, data, undefined, c, undefined)
  } else if(Array.isArray(c)) {
    let children = []
    // 形态2
    // 遍历数组c  里面的元素必须是对象
    for(let i = 0; i < c.length; i++) {
      if(!(typeof c[i] == "object" && c[i].hasOwnProperty("sel"))) {
        return new Error("传入的数组参数有项不是h函数")
      } else {
        children.push(c[i])
      }
    }
    // 循环结束  children收集完毕 返回虚拟节点
    return vnode(sel, data, children, undefined, undefined)

  } else if(typeof c == "object" && c.hasOwnProperty("sel")) {
    // 形态3
    let children = [c]

    return vnode(sel, data, children, undefined, undefined)
    
  } else {
    return new Error("传入的参数类型不对")
  }
   
}
