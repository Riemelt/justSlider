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

Or you can do it anytime when slider is already created by overwriting previous callback.

```javascript
justSlider.updateOptions({
  onUpdate: callback,
});
```

## Development

### Install

```sh
git clone https://github.com/Riemelt/justSlider.git
cd justSlider
npm i
```

### Commands

Run demo on dev-server

```sh
npm start
```

Build demo in development mode. Built demo is located at `/demo` folder.

```sh
npm run dev:demo
```

Build demo in production mode. Built demo is located at `/demo` folder.

```sh
npm run build:demo
```

Build plugin in development mode. Built plugin is located at `/dist` folder.

```sh
npm run dev
```

Build plugin in production mode. Built plugin is located at `/dist` folder.

```sh
npm run build
```

Run unit-tests

```sh
npm test
```

## Architecture

Plugin's placed at `src/app` and its styles are at `src/styles`.
Entry point is `index.ts`, which imports styles and `just-slider-jquery.ts` file, which, in turn, creates the plugin by extending jquery object.

Application is made using MVP and Observer patterns. It's made out of JustSlider, Model, Presenter, View, Subview classes and EventManager class as a link between them.

User gets an instance of JustSlider class when creating slider with jquery on a DOM element. It stores initial slider values and provides API methods for user to update or get slider's state. In order to do so, it has Presenter instance and calls its methods.

EventManager is a mutual class that provides possibility to subscribe on slider changes to dispatch them lately everytime the events are triggered.

Presenter has instances of Model, View and EventManager. It initializes both model and view, registers events and creates user input handlers for View, using its API.

For example, View has `addCreateHandleHandlers` method. Presenter provides a callback to view, which will be called with slider changes when user interacts with slider. That callback, in turn, will update Model, where all the validations and logic are happening. Eventually Model updates slider's state and dispatches events via EventManager. In the end, these events will call View update methods and user will see the result.

Presenter also adds event listeners to the manager. Events trigger View to update visual part of the slider when new Model state is set and trigger `onUpdate` callback provived with slider options.

Model and View are independent and don't know anything about each other or Presenter. Though, they have EventManager instance to dispatch events on user inputs. 

Model class is responsible for all the buisness logic, validating and operating with data and slider's options. It recieves data, updates slider's state and dispatches events. Presenter is the only class that calls Model methods.

View generates all the HTML nodes and updates visual part of the application. It gets updated whenever events from EventManager are triggered. Some of view calculation halpers are stored in `View/utilities.ts` and shared with different subviews.

View is responsible for handling clicks on the slider and handling/creating/deleting/updating its subviews.

Each Subview class is also independent and provides methods like `update` and `setHandler` to the layer above.
