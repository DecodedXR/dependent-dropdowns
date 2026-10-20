---
title: How to make a dependent drop-down list in Google Sheets (every row, any depth)
description: Create dependent dropdowns in Google Sheets where the second list changes based on the first, for every row and 3+ levels. Free script, no INDIRECT or helper columns.
image: https://decodedxr.github.io/dependent-dropdowns/assets/cover.png
---
{% raw %}

# How to make a dependent drop-down list in Google Sheets (every row, any depth)

A dependent drop-down list changes its choices based on another cell: pick a **Category** and the **Product** list shows only that category's products. Google Sheets has no built-in option for this. The usual workaround (named ranges plus `INDIRECT` or `FILTER` in helper columns) works for a single row but gets messy across hundreds of rows, and doesn't clear the old choice when the first column changes.

This guide uses [Dependent Dropdowns](https://github.com/DecodedXR/dependent-dropdowns), a free, MIT-licensed Apps Script that handles every row, multi-level chains and cleanup.

## Step 1: Put the choices on a "Lists" sheet

Add a sheet and name it exactly **Lists**. Put each first-level choice in row 1, and list its options underneath:

| Fruit | Vegetable | Grain |
|---|---|---|
| Apple | Carrot | Rice |
| Banana | Potato | Oats |
| Cherry | Spinach | |

Columns can have different lengths. Keep it tidy: this one sheet is now the single place to edit all your choices.

## Step 2: Add the script

1. **Extensions → Apps Script**, delete the placeholder code, paste in [`Code.gs`](https://github.com/DecodedXR/dependent-dropdowns/blob/main/Code.gs), and **Save**.
2. Reload the spreadsheet. A **▾ Dropdowns** menu appears.

## Step 3: Make the first dropdown

On your data sheet, click any cell in the column that holds the first choice (say column A, "Type") and choose **▾ Dropdowns → Make This Column a Top-Level Dropdown**. Every row in column A now offers Fruit, Vegetable and Grain.

The first time you use the menu, approve Google's permission prompt ("Google hasn't verified this app" → **Advanced → Go to (your project name) → Allow**). The script only asks for access to this spreadsheet.

## Step 4: Make the second dropdown depend on it

With a cell in column A still selected, choose **▾ Dropdowns → Make Next Column Depend On This One**. Column B now offers only the options under whatever is picked in column A on the same row. Pick "Vegetable" in A2, and B2 offers Carrot, Potato and Spinach.

If you change A2 to "Fruit", B2's "Carrot" no longer fits, so it's cleared automatically and B2 offers fruits instead.

## Three or more levels

Need Category → Product → Size? Add the second-level values as headers on the Lists sheet too, with their options underneath:

| Fruit | Vegetable | Apple | Banana |
|---|---|---|---|
| Apple | Carrot | Small | Bunch |
| Banana | Potato | Large | Single |

Then select column B and choose **Make Next Column Depend On This One** again. Column C follows column B, and changing column A resets both B and C when they no longer fit.

## FAQ

**Does it work when I paste many rows at once?** Yes. Pasted or filled ranges are processed row by row.

**I added options to the Lists sheet. How do I update the dropdowns?** **▾ Dropdowns → Refresh All Dropdowns**.

**Does everyone who edits the sheet need to install anything?** No. The script lives in the spreadsheet and runs for everyone who edits it.

**Can the child column be somewhere other than right next to the parent?** Not in this script: the child is always the column directly to the right.

**Is it free?** Yes, MIT licensed.

---

[Get the script on GitHub](https://github.com/DecodedXR/dependent-dropdowns) · [More free Google Sheets scripts](https://decodedxr.github.io/free-google-sheets-scripts/)
{% endraw %}
