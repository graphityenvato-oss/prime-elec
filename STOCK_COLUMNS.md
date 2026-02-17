# Stock.xlsx Columns

## Sheets

- `Sheet1`

## Sheet1 Columns

- `Brand`
- `Category`
- `Category Image`
- `Sub-Category`
- `Sub-Category Image`
- `Order No#` (`Order#` is also accepted by importer)
- `Code`
- `Description`
- `Type`
- `Mode`
- `Mounting`
- `Power (W)`
- `IP`
- `Color`
- `Control Voltage (VAC)`
- `PDT`
- `Current (A)`
- `Load Voltage (VAC)`
- `Control Voltage (VDC)`
- `Heat Sink`
- `Input Voltage (V)`
- `Output Voltage (V)`
- `Voltage Adjust. (V)`
- `DC ok Relays`
- `Voltage (V)`
- `LED Indicator`
- `Test Button`
- `Poles/Pins`
- `Functions`
- `Max Contin. Volt. (V)`
- `Arresting Capacity`
- `Visual Indicator`
- `Remote Signalling`
- `Material`
- `Levers`
- `Wiring Method`
- `Thread Hole`
- `Specification`
- `Locking Category`
- `Dimension`
- `Positions`
- `Rated Volt. (V)`
- `Rated Curr. (A)`
- `Cross Section`
- `Width (mm)`
- `Marking`
- `Packing Unit`
- `Suitable For`

## Product Notes

- Each product row belongs to `Brand`, `Category`, and `Sub-Category`.
- Each product includes:
  - `Order No#`
  - `Code (Title)`
  - `Description`
- Product title is the `Code`.
- The fixed product columns are:
  - `Brand`
  - `Category`
  - `Category Image`
  - `Sub-Category`
  - `Sub-Category Image`
  - `Order#`
  - `Code`
  - `Description`
- Any column added after `Description` is treated as a product detail.
- If a detail column cell is empty for a product, that detail is omitted for that product.
- Each `Category` has `Category Image`.
- Each `Sub-Category` has `Sub-Category Image`.
- Each product uses the `Sub-Category Image` as its product image.
- Duplicate `Brand`, `Category`, and `Sub-Category` values should be treated as one unique entry each.
- Image paths are under the `images/` folder; use the name after `images/` as the image name.
- For `Category Image`, values like `images/A/B/C` mean multiple images: `A`, `B`, and `C` (each segment after `images/` is one image).
