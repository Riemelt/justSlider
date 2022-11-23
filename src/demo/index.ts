import "jquery";
import Demo from "./Demo";
import "../app";
import "./styles/demo.scss";

(function($) {
  const className = "demo";
  const data = require("./data.json");
  const $component = $(`.js-${className}`);

  new Demo($component, data);
}(jQuery));