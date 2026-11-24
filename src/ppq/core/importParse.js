// ─────────────────────────────────────────────────────────────────────────────
// PPQ import — the sheet-shaped half, with no React in it.
//
// Split out of ProductImportModal so it can be run against real client
// workbooks without a browser. The modal owns the stages, the mapping UI and
// the preview; everything here is a pure function of a grid of cells.
//
// ── The three layouts this has to read ──────────────────────────────────────
//
//   1. ONE PROCESSES COLUMN   "Cutting > Welding > Paint" in a single cell.
//   2. ONE PROCESS PER COLUMN a BOM sheet: each column holds the NAME of the
//                             next step in the route.
//   3. A PROCESS MATRIX       the official LFD "PPQ Template.xlsx": each column
//                             IS a process, named in the header, with a tick in
//                             the cell where the product uses it.
//
// (2) and (3) look identical until you read a cell, and getting them the wrong
// way round is not a subtle failure — reading the matrix as a BOM sheet gives
// every product thirty-five processes called "false".
// ─────────────────────────────────────────────────────────────────────────────

export const FIELDS = [
  { key: 'name', label: 'Product Name', required: true, desc: 'Item / product description' },
  { key: 'code', label: 'Product Code', desc: 'ERP item code' },
  { key: 'annual_qty', label: 'Annual Quantity', desc: 'Units produced or sold per year' },
  { key: 'annual_value', label: 'Annual Sales Value', desc: 'Revenue per year' },
  { key: 'group_name', label: 'Group', desc: 'Product group / category' },
  { key: 'uom', label: 'UOM', desc: 'Unit of measure' },
  { key: 'features', label: 'Features', desc: 'Distinguishing features' },
  { key: 'processes', label: 'Processes', desc: 'Route as one separated list' },
];

export const ALIASES = {
  // 'product line' is the official LFD template's wording, listed explicitly so
  // it matches on the exact pass rather than falling through to the looser
  // "contains" pass, where column order decides the winner.
  name: ['item name', 'product name', 'product line', 'product', 'item', 'description', 'part name', 'name', 'specific description', 'material description'],
  code: ['item code', 'product code', 'part code', 'code', 'sku', 'material', 'item no', 'part no', 'material code'],
  annual_qty: ['annual quantity', 'annual qty', 'total sum', 'quantity', 'qty', 'volume', 'total qty', 'annual volume', 'yearly qty', 'sales qty', 'production qty', 'total'],
  // The official template carries ONE combined column, "Yearly Value/Demand".
  // It lands on value rather than quantity because that is what it says first,
  // and because a study with only a value still ranks and paretos correctly.
  annual_value: ['annual sales value', 'yearly value demand', 'value demand', 'sales value', 'annual value', 'yearly value', 'revenue', 'value', 'turnover', 'amount', 'sales', 'net value', 'annual revenue'],
  group_name: ['group', 'category', 'family', 'product group', 'item group', 'segment'],
  uom: ['uom', 'unit', 'units', 'unit of measure'],
  features: ['features', 'feature', 'specification', 'specifications', 'spec', 'remarks'],
  processes: ['processes', 'process', 'process route', 'routing', 'route', 'operations', 'process flow'],
};

// Columns that are a row number or a formula result, never a process. The
// official template's "Total Processes" is a COUNTIF over the matrix, and
// importing it as a process step would give every product a phantom.
export const NON_PROCESS = ['no', 'sr no', 's no', 'sl no', 'serial', 'sr', 'total processes', 'total process'];

export const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/** Split a "Cutting > Welding, Paint" style cell into ordered steps. */
export const splitProcesses = (v) => String(v ?? '')
  .split(/[>;,|/\n]+|->|=>/)
  .map((s) => s.trim())
  .filter(Boolean);

/**
 * Is this cell a tick rather than a name?
 *
 * true = ticked, false = explicitly not ticked, null = it is text, so it is a
 * process NAME and the caller should use the value.
 */
export const tickOf = (v) => {
  if (typeof v === 'boolean') return v;
  const s = String(v ?? '').trim().toLowerCase();
  if (s === '') return false;
  if (['true', 'yes', 'y', 'x', '✓', '✔', '1'].includes(s)) return true;
  if (['false', 'no', 'n', '0', '-', 'na', 'n/a'].includes(s)) return false;
  return null;   // a real word — treat it as the process name
};

/**
 * A column of ticks: every cell is a tick, and at least one cell has something
 * in it. The "something" clause matters — an entirely empty column is unknown,
 * not a matrix, and treating it as one would stop a blank template from
 * mapping its own product-name column.
 */
export const isTickColumn = (rows, col) => {
  let filled = 0;
  for (const r of rows) {
    if (tickOf(r[col]) === null) return false;
    if (String(r[col] ?? '').trim() !== '') filled += 1;
  }
  return filled > 0;
};

/**
 * "Process 1", "Process 12" — the official template's placeholder band names.
 *
 * These are matrix columns by name whether or not anybody has ticked one yet,
 * which is what lets a BLANK template still map its product columns: without
 * this, an untouched "Process 1" is just an empty column, and the loose
 * "contains" pass on the process aliases claims it as the separated-route
 * column. It is then read as a route with one step called "false".
 */
export const isProcessBand = (header) => /^process\s*\d+$/.test(norm(header));

/** Auto-match spreadsheet headers to PPQ fields; first exact hit wins. */
export function suggestMapping(headers) {
  const used = new Set();
  const map = {};
  FIELDS.forEach(({ key }) => {
    const aliases = ALIASES[key] || [];
    // Exact alias match first, then a "contains" pass for headers like
    // "Sum of MFG Qty." that carry extra words around the real label.
    let hit = headers.find((h) => !used.has(h) && aliases.includes(norm(h)));
    if (!hit) hit = headers.find((h) => !used.has(h) && aliases.some((a) => norm(h).includes(a)));
    if (hit) { map[key] = hit; used.add(hit); }
  });
  return map;
}

/**
 * Turn a raw grid of cells into columns, rows, a suggested mapping and the
 * matrix columns to pre-tick.
 *
 * ── Banded headers ──────────────────────────────────────────────────────────
 *
 * The official template splits its header across two rows: the process names
 * on one (D..AL, "Process 1".."Process 35") and the product field labels on the
 * next (A, B, C: "No.", "Product line", "Yearly Value/Demand"). Taking the
 * first row with two filled cells picks the process band and leaves the real
 * labels to be imported as a product called "Product line".
 *
 * So when the row below the detected header names a product field and the
 * detected row does not, the lower row is the real header and the upper one
 * fills in the columns it leaves blank.
 */
export function parseGrid(grid) {
  if (!grid || !grid.length) throw new Error('That sheet is empty.');

  const headerIdx = grid.findIndex((r) => r.filter((c) => String(c ?? '').trim()).length >= 2);
  if (headerIdx < 0) throw new Error('Could not find a header row in that sheet.');

  const namesAProduct = (row) => (row || [])
    .map((c) => norm(c))
    .filter(Boolean)
    .some((l) => ALIASES.name.includes(l));

  let labelRow = grid[headerIdx];
  let bodyStart = headerIdx + 1;
  const below = grid[headerIdx + 1];
  if (below && namesAProduct(below) && !namesAProduct(labelRow)) {
    const upper = labelRow;
    labelRow = below.map((c, i) => (String(c ?? '').trim() || upper[i] || ''));
    bodyStart = headerIdx + 2;
  }

  const rawHeaders = labelRow.map((h, i) => String(h ?? '').trim() || `Column ${i + 1}`);
  // De-duplicate blank/repeated headers so each column stays addressable.
  const seen = new Map();
  const cols = rawHeaders.map((h) => {
    const n = (seen.get(h) || 0) + 1;
    seen.set(h, n);
    return n > 1 ? `${h} (${n})` : h;
  });

  const dataRows = grid.slice(bodyStart)
    .map((r) => {
      const obj = {};
      cols.forEach((c, i) => { obj[c] = r[i] ?? ''; });
      return obj;
    })
    .filter((r) => Object.values(r).some((v) => String(v ?? '').trim()));

  if (!dataRows.length) throw new Error('No data rows found under the header.');

  // ── Find the matrix columns BEFORE mapping, not after ─────────────────────
  //
  // A column holding nothing but ticks cannot be a product name, a quantity or
  // a route list, so it must not be offered to the matcher at all. Mapping
  // first and subtracting afterwards is what let the official template's
  // "Process 1" get claimed as the separated-route column — and then read as a
  // route containing one step called "false".
  //
  // Columns named for a row number or a formula are excluded from BOTH, for the
  // same reason in reverse: "Total Processes" is a COUNTIF, and the loose
  // "contains" pass on the quantity aliases happily matches the word "total".
  const computed = (c) => NON_PROCESS.includes(norm(c));
  const matrixCols = cols.filter((c) => (
    !computed(c) && (isProcessBand(c) || isTickColumn(dataRows, c))
  ));
  const matrixSet = new Set(matrixCols);

  const mapping = suggestMapping(cols.filter((c) => !matrixSet.has(c) && !computed(c)));

  return { cols, dataRows, mapping, matrixCols };
}

/**
 * The processes on one row, from every layout at once.
 *
 * A ticked matrix column contributes its HEADER; a column holding a word
 * contributes the word. Both are appended after anything in a mapped
 * "Processes" list column, and the order is the order of the columns — which on
 * a route-per-column sheet is the route.
 */
export function processesOf(row, { mapping, processCols }) {
  const listed = mapping.processes ? splitProcesses(row[mapping.processes]) : [];
  const perColumn = [];
  (processCols || []).forEach((c) => {
    const tick = tickOf(row[c]);
    if (tick === true) perColumn.push(String(c).trim());
    else if (tick === null) {
      const name = String(row[c] ?? '').trim();
      if (name) perColumn.push(name);
    }
  });
  return [...listed, ...perColumn];
}
