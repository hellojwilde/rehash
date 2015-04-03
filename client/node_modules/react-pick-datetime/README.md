# react-pick-datetime

Accessible widgets for picking dates and times, implemented in React. 

Built on top of [react-pick](https://github.com/hellojwilde/react-pick) and [moment](http://momentjs.com/).

## Demo

[http://jwilde.me/react-pick-datetime/](http://jwilde.me/react-pick-datetime/)

## Installation & Usage

`npm install react-pick-datetime`

You'll need to make sure that you somehow include `react-pick`'s `style.css` file (or your own CSS) in your CSS bundle.

### What's Inside?

- [`<TimeInput>`](https://github.com/hellojwilde/react-pick-datetime/blob/master/src/TimeInput.js) - Autocompleting time input, where the user can type a time, and times similar to the one that they're typing get autocompleted in both a menu and in "type ahead" text.
- [`<DateInput>`](https://github.com/hellojwilde/react-pick-datetime/blob/master/src/DateInput.js) - Input with a keyboard-navigable calendar popup letting the user select and modify dates.