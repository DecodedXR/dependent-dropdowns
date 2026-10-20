# Free Dependent Dropdowns for Google Sheets

![Free Dependent Dropdowns for Google Sheets](assets/cover.png)

Make the choices in one dropdown depend on another: pick **Country** and the **City** dropdown only shows that country's cities. It works on every row, chains to 3 or more levels (Region → Country → City), and clears a child that no longer fits when the parent changes. One Apps Script file, no add-on, and no `INDIRECT` or helper-column formulas.

- Keep all choices on one **Lists** sheet: parent values across row 1, their children underneath
- Pasting or filling many rows at once works too
- Edit the Lists sheet and choose **Refresh All Dropdowns** to update every row

New to this? Read the [step-by-step guide](https://decodedxr.github.io/dependent-dropdowns/dependent-drop-down-list-google-sheets.html).

## Setup (5 minutes)

1. Add a sheet named **Lists**. In row 1, put each parent choice as a header. Under each header, list its children:

   | USA | France | Japan |
   |---|---|---|
   | New York | Paris | Tokyo |
   | Chicago | Lyon | Osaka |

2. **Extensions → Apps Script**, delete the placeholder code, paste in `Code.gs`, save. Reload the sheet. A **▾ Dropdowns** menu appears.
3. On your data sheet, click any cell in the parent column (Country), then choose **▾ Dropdowns → Make This Column a Top-Level Dropdown**. Its dropdown now lists USA, France and Japan.
4. With a cell in that same column still selected, choose **▾ Dropdowns → Make Next Column Depend On This One**. The column to its right (City) now follows it.

Google asks for permission the first time you use the menu ("Google hasn't verified this app" → **Advanced → Go to (your project name) → Allow**; it's your own script, limited to this spreadsheet).

## Three or more levels

Add the second level's values as headers on the Lists sheet as well (New York, Chicago, … with their neighborhoods underneath). Then select the City column and choose **Make Next Column Depend On This One** again. Changing the Country clears both City and Neighborhood if they no longer fit.

## Notes

- The child column must be directly to the right of its parent.
- Row 1 of your data sheet is treated as headers and left alone.
- Header matching on the Lists sheet ignores capitalization and surrounding spaces.
- **Remove Links on This Sheet** stops the automatic updates. Existing dropdowns stay until you clear them with **Data → Data validation**.

## More free Google tools

- [All free Google Sheets scripts](https://github.com/DecodedXR/free-google-sheets-scripts): mail merge, PDF merge, reminders, Sheets to Calendar, CSV import, Forms tools.

## License

MIT. See `LICENSE`.
