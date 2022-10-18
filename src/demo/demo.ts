import "../app";
import "./styles/demo.scss";

$(".js-demo__slider").justSlider({
  from: -45,
  to: 90,
  min: -100,
  max: 100,
  step: 1, 
  range: true,
  orientation: "horizontal",
  direction: "forward",
  progressBar: true,
  tooltips: true,
});