### v0.3.1 (2015-04-03)

### BUGFIX

- [b74bc7b](https://github.com/hellojwilde/react-pick-datetime/commit/8a935b3) - Actually add the styles into the build.

### v0.3.1 (2015-04-03)

#### FEATURES

- [8a935b3](https://github.com/hellojwilde/react-pick-datetime/commit/8a935b3) - Make it cleaner to replace the inputComponent with some other one.

### v0.3.0 (2015-04-03)

From now on, `react-pick-datetime` versions will track `react-pick` versions.

#### REFACTOR OF AWESOME, ROUND 2

Over in `react-pick`, there were some pretty massive changes. `TimeCombobox` is now called `TimeInput`, and works with `react-pick` v0.3.0.
 
#### ALL HAIL THE GREAT `DATEINPUT`

There's now a new `DateInput` component. 

We're expecting that the public facing API for it won't change much in the near future, but the internals likely will as we try to expose `DatePopup` as a more generally usable component (e.g. usable as something other than just a popup attached to an input).