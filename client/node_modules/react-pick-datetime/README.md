# react-pick-datetime

[![Build Status](https://travis-ci.org/hellojwilde/react-pick-datetime.svg?branch=master)](https://travis-ci.org/hellojwilde/react-pick-datetime)

Accessible widgets for picking dates and times, implemented in React. 

Built on top of [react-pick](https://github.com/hellojwilde/react-pick) and [moment](http://momentjs.com/).

## Demo

[http://jwilde.me/react-pick-datetime/](http://jwilde.me/react-pick-datetime/)

## Installation & Usage

`npm install react-pick-datetime`

You'll need to make sure that you somehow include the following CSS files from both `react-pick` and `react-pick-datetime`:

- `'react-pick/lib/styles.css'`
- `'react-pick-datetime/lib/styles.css'`

Or, you could be awesome and write your own CSS for both. Up to you.

### What's Inside?

- [`<Calendar>`](https://github.com/hellojwilde/react-pick-datetime/blob/master/src/Calendar.js) - A calendar control that you can use all over the place for selecting dates directly.
- [`<DateInput>`](https://github.com/hellojwilde/react-pick-datetime/blob/master/src/DateInput.js) - Input with a keyboard-navigable calendar popup letting the user select and modify dates.
- [`<TimeInput>`](https://github.com/hellojwilde/react-pick-datetime/blob/master/src/TimeInput.js) - Autocompleting time input, where the user can type a time, and times similar to the one that they're typing get autocompleted in both a menu and in "type ahead" text.
