import patch from "./mysnabbdom/patch"

import h from "./mysnabbdom/h"

const container = document.querySelector("#container")

const btn = document.querySelector("button")

const myVnode1 = h("ul", {}, [
  h("li", {key: "A"}, "A"),
  h("li", {key: "B"}, "B"),
  h("li", {key: "C"}, "C"),
  h("li", {key: "D"}, "D"),
  h("li", {key: "E"}, "E")
])

const myVnode2 = h("ul", {}, [
  h("li", {key: "Q"}, "Q"),
  h("li", {key: "E"}, "E"),
  h("li", {key: "A"}, "A"),
  h("li", {key: "B"}, "B"),
  h("li", {key: "D"}, "D"),
  h("li", {key: "C"}, "C")
])

patch(container, myVnode1)

btn.addEventListener("click", function() {
  patch(myVnode1, myVnode2)
})



