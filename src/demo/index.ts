import "../demo/assets/favicons";
import "../app";
import "./styles/demo.scss";
import Demo from "./Demo";

(function($) {
  const className = "demo";
  const data = require("./data.json");
  const $component = $(`.js-${className}`);

  new Demo($component, data);
}(jQuery));