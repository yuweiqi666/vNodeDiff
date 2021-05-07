# vNodeDiff
#### 手写h函数

> 1. 用于产生虚拟dom
>
> 2. h函数写法多样
>
>    1. h("div")
>
>    2. h("div", "文字")
>
>    3. h("div", [])
>
>       // 目前手写只实现4 5 6种形式
>
>    4. h("div", {}, [h(), h(), h()...])
>
>    5. h("div", {}, "文字")
>
>    6. h("div", {}, h())

````javascript
// h函数   返回时的vNode函数只是将传入的参数包成一个对象

export default function(sel, data, c) {
  // 检查参数的个数
  if(arguments.length !== 3) {
    throw new Error("对不起， 低配版h函数必须传三个参数")
  }
  // 检查参数的类型
  if(typeof c == "string" || typeof c == "number") {
    // 形态1  c是字符串或者是数字   h(sel, data, "文字")
    return vnode(sel, data, undefined, c, undefined)
  } else if(Array.isArray(c)) {
    let children = []
    // 形态2     c是数组       h(sel, data, [h(), h(), h()])
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
    // 形态3   c是对象       h(sel, data, h())
    let children = [c]

    return vnode(sel, data, children, undefined, undefined)
    
  } else {
    return new Error("传入的参数类型不对")
  }
   
}
````



* 虚拟节点的属性

  ````javascript
  {
      children: undefined,  // 节点的子元素
      data: {},        // 节点的属性 样式等
      elm: undefined,     //虚拟节点对应的真正的dom节点 undefined表示还没有上树
      key: undefined,     // key 唯一标识  服务于最小量更新
      sel: "div",          // 选择器
      text: "我是一个盒子"   // 文字 
  }
  ````

* 创建虚拟节点

  ````javascript
  var myVnode = h("a", { props: {href: "http://www.baidu.com"} }, "张三")
  
  console.log(myVnode)
  
  // 虚拟节点
  {
      children: undefined
  	data: {
          props: {
              href: "http://www.atguigu.com"
          }
      }
  	elm: undefined
  	key: undefined
  	sel: "a"
  	text: "张三"
  }
  ````

* **h函数嵌套使用，得到虚拟DOM树**

  ````javascript
  var myVnode3 = h("ul", {class: {"father": true}}, [
    h("li",  "香蕉"),  // 中间的对象可以省略
    h("li",  "苹果"),
    h("li",  "梨子", h("div", "嘻嘻哈哈")) // 嵌套一个子元素时数组可以省略
  ])
  
  ````




#### 手写diff算法（patch函数）

* patch函数执行流程

  > patch函数思路：
  >
  > 1. patch传两个参数 oldVnode 和newVnode
  >
  > 2. 先判断oldVnode是虚拟节点还是真实dom节点
  >
  > 3. 如果是真实dom节点就通过vnode函数包装为虚拟dom节点
  >
  > 4. 在判断oldVnode 和newVnode是不是同一个虚拟节点
  >
  > 5. 如果oldVnode和newVnode不是同一个虚拟节点 如果不是同一个虚拟节点
  >
  >    1. 封装createElement函数 参数为newVnode 
  >    2. createElement内部先将newVnode通过document.createElement()创建真实dom节点
  >    3. 判断newVnode中有没有子节点 如果么没有子节点直接innerText = newVnode.text 返回真实dom
  >    4. 如果有子节点就递归调用createElement() 递归结束 appendChild()最后返回真实dom
  >    5. insertBefore插入这个返回的真实dom
  >    6. removeChild删除旧的dom
  >
  >    ````javascript
  >    // createElement函数
  >    // 真正创建节点  将vnode创建为DOM  不进行插入
  >    export default function createElement(vnode) { 
  >      // 创建dom节点
  >      const domNode = document.createElement(vnode.sel)
  >      // 有子节点还是文本
  >      if(vnode.text !== "" && (vnode.children == undefined || vnode.children.length == 0)) {
  >        // 内部是文本
  >        domNode.innerText = vnode.text;
  >      } else if(Array.isArray(vnode.children) && vnode.children.length > 0) {
  >        // 内部是子节点 要递归创建子节点
  >        vnode.children.forEach(item => {
  >          const reldom = createElement(item)
  >          domNode.appendChild(reldom)
  >        })
  >      }
  >    
  >      // 补充elm属性
  >      vnode.elm = domNode
  >      // 返回elm elm属性是一个纯dom对象
  >      return vnode.elm
  >    }
  >    -----------------------------------------------------------------------------
  >    // patch函数
  >    export default function(oldVnode, newVnode) {
  >      // 判断传的第一个参数时dom节点还是虚拟节点
  >      if(oldVnode.sel == "" || oldVnode.sel == undefined) {
  >        //传入的第一个参数是dom节点  此时需要包装成虚拟节点
  >        oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)
  >    
  >        console.log("oldVnode", oldVnode);
  >      }
  >    
  >      // 判断oldVnode和newVnode是不是同一个节点
  >      if(oldVnode.key == newVnode.key && oldVnode.sel == newVnode.sel) {
  >        // 是同一个节点
  >      } else {
  >        console.log(123);
  >        // 不是同一个节点 暴力插入新的 删除旧的
  >        var newVnodedom = createElement(newVnode)
  >         //插入新的
  >        oldVnode.elm.parentNode.insertBefore(newVnodedom, oldVnode.elm)
  >         //删除旧的
  >        oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  >      }
  >    }
  >    ````
  >
  >    
  >
  > 6. 如果是同一个虚拟节点 进行精细化比较
  >
  >    

  ![patch函数_20210503110649](.\imgs\patch函数_20210503110649.png)



##### 精细化比较

* 精细化比较执行阶段

  ![精细化比较](.\imgs\精细化比较.png)

  * **精细化比较 最精彩的地方**

    * oldVnode和newVnode都有children

      ![diff优化策略](.\imgs\diff优化策略.png)

      > 四种命中方式（按顺序）：
      >
      > * 命中一种后就不在继续进行命中判断 没有命中就按顺序就进行下一种命中方式判断
      > * 循环移动指针的条件： 新前<=旧后  && 旧前 <= 旧后
      > * 旧节点先循环完毕，说明新节点中有需要插入的节点是（新前与新后之间的节点）
      > * 新节点先循环完毕，说明旧节点中有需要删除的节点是（旧前与旧后之前的节点）
      >
      > 1. 新前和旧前（命中后指针下移）
      >
      > 2. 新后与旧后（命中后指针上移）
      >
      > 3. 新后与旧前（移动新后指向的节点到旧后之后，之前旧前指针的位置标为undefined，旧前指针下移，新后指针上移）
      >
      >    ![新后与旧前](.\imgs\新后与旧前.png)
      >
      > 4. 新前与旧后（移动新前指向的节点到旧前节点之前，之前旧后指针的位置标为undefined，新前指针下移，旧后指针上移）
      >
      >    ![新前与旧后命中](.\imgs\新前与旧后命中.png)
      >
      > 5. 四种都没有命中就循环查找旧节点中有没有新前指向的节点，找到将节点移动到旧前节点之前，之前指针位置标为undefined，没有找到就在旧前节点之前新建该节点（然后新前指针下移）
      >
      >    ![四种都没有命中](.\imgs\四种都没有命中.png)

