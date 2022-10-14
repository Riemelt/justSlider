import "../app";
import "./styles/demo.scss";

$(".js-demo__slider").justSlider({
  from: 20,
  to: 40,
  min: 0,
  max: 104,
  step: 10, 
  isRange: false,
  orientation: "horizontal",
});