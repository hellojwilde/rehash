### v0.5.1 (2014-04-05)

#### BUGFIX

- Ensure that we don't fail with an undefined value on return key on `CalendarGrid`. Add appropriate failing test case, along with others for `CalendarGridKeyBindings`.

### v0.5.0 (2014-04-04)

#### BUGFIX

- `DateInput` should update its internal correctly now when an outside component changes its `value` property.

#### CHANGES

- Move onto v0.5.0 of `react-pick` and rectify everything to work with its changes. Drop `inputComponent` as an option.
- Expose `Calendar` as a widget publicly.
- There is now a `buttonComponent` option for configuring button classes.

### v0.4.1 (2014-04-04)

#### BUGFIX

- Instead of storing a tuple of a date and a formatted value and trying to box and unbox, just make `value` the a `moment` date that we pass around in `<TimeInput>`. This should have no impact on implementing apps except for significant bug reductions.
- Add support for `inputValueFormat` in `<TimeInput>`.

### v0.4.0 (2014-04-04)

#### CHANGES

- Move onto v0.4.0 of `react-pick`. 
- Make locations of prop insertions in `DateInput` a little more consistent with what `Combobox` does. 
- Add support for `onComplete`, like in `Combobox`. 
- Ensure that we properly unbox the moment value in `TimeInput`.

### v0.3.1 (2015-04-03)

#### BUGFIX

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