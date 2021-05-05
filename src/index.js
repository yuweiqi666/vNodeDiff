import patch from "./mysnabbdom/patch"

import h from "./mysnabbdom/h"

const container = document.querySelector("#container")

const btn = document.querySelector("button")

const myVnode1 = h("ul", {}, [
  h("li", {key: "A"}, "A"),
  h("li", {key: "B"}, "B"),
  h("li", {key: "C"}, "C")
])

const myVnode2 = h("ul", {}, [
  h("li", {key: "A"}, "A"),
  h("li", {key: "B"}, "B"),
  h("li", {key: "M"}, "M"),
  h("li", {key: "N"}, "N"),
  h("li", {key: "C"}, "C"),
  h("li", {key: "P"}, "P"),
  h("li", {key: "Q"}, "Q")
])

patch(container, myVnode1)

btn.addEventListener("click", function() {
  patch(myVnode1, myVnode2)
})



