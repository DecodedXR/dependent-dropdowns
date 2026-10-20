/** @OnlyCurrentDoc */ // asks Google for access to this spreadsheet only, not all your sheets

/**
 * Dependent Dropdowns for Google Sheets: the choices in one column depend on the value picked
 * in the column to its left (Country → City, Category → Product). Chain them for 3+ levels.
 *
 * Setup: make a sheet named "Lists". In row 1 put each parent choice as a header; under each
 * header, list its child choices. Then click a cell in the parent column of your data sheet and
 * choose ▾ Dropdowns → Make Next Column Depend On This One.
 */

const LISTS_SHEET = 'Lists';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('▾ Dropdowns')
    .addItem('Make Next Column Depend On This One', 'linkColumns')
    .addItem('Make This Column a Top-Level Dropdown', 'topLevel')
    .addItem('Refresh All Dropdowns', 'refreshAll')
    .addItem('Remove Links on This Sheet', 'unlinkSheet')
    .addToUi();
}

/** The parent column is the selected one; the child is the column to its right. */
function linkColumns() {
  const ui = SpreadsheetApp.getUi();
  if (!listsSheet_()) { ui.alert('Make a sheet named "' + LISTS_SHEET + '" first (see the setup note at the top of the script).'); return; }
  const sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() === LISTS_SHEET) { ui.alert('Select a column on your data sheet, not on "' + LISTS_SHEET + '".'); return; }
  const parent = SpreadsheetApp.getActiveRange().getColumn();
  const links = getLinks_().filter(l => !(l.sheet === sheet.getName() && l.child === parent + 1));
  links.push({ sheet: sheet.getName(), parent: parent, child: parent + 1 });
  saveLinks_(links);
  refreshSheet_(sheet);
  ui.alert('Column ' + colLetter_(parent + 1) + ' now offers the choices listed under the value picked in column ' + colLetter_(parent) + '.');
}

/** Top-level dropdown: the headers of the Lists sheet. */
function topLevel() {
  const lists = listsSheet_();
  if (!lists) { SpreadsheetApp.getUi().alert('Make a sheet named "' + LISTS_SHEET + '" first.'); return; }
  const sheet = SpreadsheetApp.getActiveSheet();
  const col = SpreadsheetApp.getActiveRange().getColumn();
  const headers = lists.getRange(1, 1, 1, Math.max(lists.getLastColumn(), 1)).getDisplayValues()[0].filter(String);
  const rows = Math.max(sheet.getMaxRows() - 1, 1);
  sheet.getRange(2, col, rows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(headers, true).setAllowInvalid(false).build());
}

function refreshAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  [...new Set(getLinks_().map(l => l.sheet))].forEach(n => { const s = ss.getSheetByName(n); if (s) refreshSheet_(s); });
}

function unlinkSheet() {
  const name = SpreadsheetApp.getActiveSheet().getName();
  saveLinks_(getLinks_().filter(l => l.sheet !== name));
  SpreadsheetApp.getUi().alert('Dependent dropdown links removed from "' + name + '". Existing dropdowns stay until you clear them.');
}

/** Simple trigger: runs on every edit, no permission prompt needed. */
function onEdit(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() === LISTS_SHEET) return;
  const links = getLinks_().filter(l => l.sheet === sheet.getName());
  if (!links.length) return;
  const first = e.range.getColumn(), last = first + e.range.getNumColumns() - 1;
  const top = Math.max(e.range.getRow(), 2), bottom = e.range.getRow() + e.range.getNumRows() - 1;
  if (bottom < top) return;
  const map = childMap_();
  cascadeOrder_(links, first, last).forEach(l => applyRows_(sheet, l, top, bottom, map, true));
}

/** Links to update after editing columns first..last, parents before children, following chains (A → B → C → …). */
function cascadeOrder_(links, first, last) {
  const queue = links.filter(l => l.parent >= first && l.parent <= last).sort((a, b) => a.parent - b.parent);
  const done = new Set(), out = [];
  while (queue.length) {
    const l = queue.shift();
    if (done.has(l.child)) continue;
    done.add(l.child);
    out.push(l);
    links.filter(g => g.parent === l.child).forEach(g => queue.push(g));
  }
  return out;
}

function refreshSheet_(sheet) {
  const map = childMap_();
  const bottom = Math.max(sheet.getLastRow(), 2);
  getLinks_().filter(l => l.sheet === sheet.getName()).sort((a, b) => a.parent - b.parent)
    .forEach(l => applyRows_(sheet, l, 2, bottom, map, false));
}

/** Set each row's child dropdown from its parent value. clearInvalid empties children that no longer fit. */
function applyRows_(sheet, link, top, bottom, map, clearInvalid) {
  const n = bottom - top + 1;
  const parents = sheet.getRange(top, link.parent, n, 1).getDisplayValues();
  const childRange = sheet.getRange(top, link.child, n, 1);
  const children = childRange.getDisplayValues();
  const rules = [], values = [];
  let changed = false;
  for (let i = 0; i < n; i++) {
    const choices = choicesFor_(map, parents[i][0]);
    rules.push([choices.length ? SpreadsheetApp.newDataValidation().requireValueInList(choices, true).setAllowInvalid(false).build() : null]);
    const keep = keepChild_(children[i][0], choices);
    if (clearInvalid && !keep) changed = true;
    values.push([clearInvalid && !keep ? '' : children[i][0]]);
  }
  if (changed) childRange.setValues(values);
  childRange.setDataValidations(rules);
}

/** Parent value → list of child choices, read from the Lists sheet. */
function childMap_() {
  const lists = listsSheet_();
  const map = {};
  if (!lists || !lists.getLastColumn()) return map;
  const data = lists.getRange(1, 1, Math.max(lists.getLastRow(), 1), lists.getLastColumn()).getDisplayValues();
  data[0].forEach((h, c) => {
    if (!h) return;
    map[h.trim().toLowerCase()] = data.slice(1).map(r => r[c]).filter(v => v !== '');
  });
  return map;
}

function choicesFor_(map, parentValue) {
  return map[String(parentValue).trim().toLowerCase()] || [];
}

/** Keep a child value only if it's blank or still one of the allowed choices. */
function keepChild_(value, choices) {
  return value === '' || choices.includes(value);
}

function listsSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LISTS_SHEET);
}

function getLinks_() {
  return JSON.parse(PropertiesService.getDocumentProperties().getProperty('links') || '[]');
}

function saveLinks_(links) {
  PropertiesService.getDocumentProperties().setProperty('links', JSON.stringify(links));
}

function colLetter_(n) {
  let s = '';
  for (; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + (n - 1) % 26) + s;
  return s;
}
