# Just Slider

A jQuery plugin, customizable and responsive range slider for modern browsers. Requires jquery to work.

Compatible with

* node v18.10.0
* jquery v3.6.1

## [Demo](https://riemelt.github.io/justSlider/index.html)

## Install

```sh
npm i just-slider
```

## Usage

```javascript
import "just-slider";
import "just-slider/dist/just-slider.css";

$("#element").justSlider(options);
```

## Documentation

### Options

### min `number` = 0

Minimum possible value of the slider.

### max `number` = 100

Maximum possible value of the slider.

### step `number` = 10

Step size.

### from `number` = 0

Sets value of the first handle.

### to `number` = 100

Sets value of the second handle. It'll be disabled if range is false.

### orientation `"horizontal" | "vertical"` = "horizontal"

Sets slider's orientation. For horizontal case, slider's direction is from left to right. For vertical, it is from bottom to top.

### direction `"forward" | "backward"` = "forward"

Sets slider's direction.

### range `boolean` = false

If true, two handles will be enabled instead of one.

### tooltips `boolean` = false

Shows tooltips attached to handles, indicating their current values.

### progressBar `boolean` = false

Shows progress bar between two handles if range mode is enabled. Otherwise bar is in between minimum and first handle values.

### precision `number` = 0

Amount of decimals of handle values. If 0, values are integral.

### scale `ScaleOptions` = null

Shows scale next to the slider. Customizable with its own options. It has divisions with little lines and values.

### ScaleOptions

### type `"steps" | "set"` = "steps"

In "steps" mode scale will generate divisions with values depending on `step` property. One value per step.
In "set" mode it'll take `set` property and will generate divisions per every set value.

### set `number[]` = [0, 25, 50, 75, 100]

Set is taken when scale `type` is set to "set" mode. Values in array are percentages. It will always start at 0 and end with 100 as min and max values of the slider.

### density `number` = 3

Calculates little divisions between values on slider's scale. For instance, if set to 3, scale will generate a line every 3% of the slider's range in between the divisions with values.

### numbers `boolean` = true

Shows numbers on scale.

### lines `boolean` = true

Shows little lines (divisions) on scale.

### onUpdate `(state) => void`

Callback, which will be triggered whenever slider's state changes. State argument has all of slider's properties mentioned above.

### Example

```javascript
const options = {
  min: 5,
  max: 50,
  from: 25,
  orientation: "vertical",
  scale: {
    type: "set",
    set: [0, 50, 100],
    lines: false,
  }
}

$("div.container").justSlider(options);
```

## API

When justSlider is created, it returns an instance with methods to get and set different data.

```javascript
const justSlider = $("div.container").justSlider(options);

justSlider.updateOptions({
  from: 1000,
});
```

### updateOptions(options)

Updates slider's options. Same properties as on initialization.

### update(type, value)

Sets handle value.

* type `"from" | "to"` — handle that is going to be changed
* value `number` — new value

### getState() => `State`

Returns slider's state.


### get() => `number | number[]`

Returns handle values. Single number if range is false. Otherwise it's an array of 2 numbers.

### $slider() => `JQuery<HTMLElement>`

Returns generated html node of the slider.

### reset()

Resets handle values to the state they were initialized with.

## Events

To subscribe on slider changes, set a callback function on initialization.

```javascript
function callback(state) {
  const { from, to } = state;
  // code
}

const justSlider = $("div.container").justSlider({
  ...options,
  onUpdate: callback,
});
```

Or you can do it anytime when slider is already created by rewriting previous callback.

```javascript
justSlider.updateOptions({
  onUpdate: callback,
});
```
