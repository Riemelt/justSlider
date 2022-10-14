import "../app";
import "./styles/demo.scss";

$(".js-demo__slider").justSlider({
  from: 20,
  to: 45,
  min: 0,
  max: 104,
  step: 1, 
  isRange: false,
  orientation: "vertical",
});