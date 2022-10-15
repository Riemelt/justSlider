import "../app";
import "./styles/demo.scss";

$(".js-demo__slider").justSlider({
  from: 20,
  to: 45,
  min: -100,
  max: 100,
  step: 1, 
  isRange: true,
  orientation: "horizontal",
  direction: "forward",
});