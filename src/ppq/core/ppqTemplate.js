// ─────────────────────────────────────────────────────────────────────────────
// The blank PPQ product template — the file a client fills in before Step 1.
//
// Step 1 accepts any sheet and maps its columns by name, which is what makes a
// real ERP export importable. That flexibility is for files that already exist.
// A client who has nothing yet needs the opposite: one file, in the shape the
// importer reads best, with the vocabulary already in it.
//
// ── Why it arrives with rows in it ──────────────────────────────────────────
//
// A template that arrives full gets edited; an empty header row gets stared at
// and closed. The six example products are obvious fiction (PRD-001…) and the
// help sheet says to delete them, but they answer the questions a blank grid
// leaves open: how do I write a route, what goes in a process cell, does the
// quantity go in as a year or a month.
//
// ── The layout, and why this one ────────────────────────────────────────────
//
// A PROCESS MATRIX: the product fields first, then one column per process with
// a tick where the product uses it. It is the layout of the official LFD
// "PPQ Template.xlsx", it survives a product whose route is not a straight
// line, and importParse reads it without any mapping being touched by hand.
//
// The first seven process columns carry ordinary process names to show what the
// header means — rename them. The five after are left as "Process 8".."Process
// 12", which `isProcessBand` recognises as matrix columns even while they are
// empty, so a template returned with spare columns untouched still imports
// cleanly. See the banded-header note in importParse.js.
//
// Written with exceljs, not xlsx: only exceljs writes the column widths, the
// frozen header and the cell dropdowns, and a template is the one file where
// how it looks on opening is the whole job.
// ─────────────────────────────────────────────────────────────────────────────

export const TEMPLATE_FILENAME = 'PPQ product template.xlsx';

/** The product fields, in the order the sheet carries them. */
const COLUMNS = [
  { header: 'No.', key: 'no', width: 6 },
  { header: 'Product Code', key: 'code', width: 14 },
  { header: 'Product Name', key: 'name', width: 34 },
  { header: 'Group', key: 'group_name', width: 13 },
  { header: 'UOM', key: 'uom', width: 8 },
  { header: 'Annual Quantity', key: 'annual_qty', width: 16 },
  { header: 'Annual Sales Value', key: 'annual_value', width: 18 },
  { header: 'Features', key: 'features', width: 30 },
];

// Named columns, to show what a process column is. Renaming these to the
// plant's own operations is the main thing a client does to this file.
export const EXAMPLE_PROCESSES = [
  'Cutting', 'Machining', 'Welding', 'Assembly', 'Painting', 'Inspection', 'Packing',
];

// Spare bands. Kept as "Process N" on purpose: importParse treats that wording
// as a matrix column whether or not anybody has ticked one, so a sheet returned
// with three of these renamed and two blank still reads correctly.
export const SPARE_BANDS = ['Process 8', 'Process 9', 'Process 10', 'Process 11', 'Process 12'];

export const PROCESS_COLUMNS = [...EXAMPLE_PROCESSES, ...SPARE_BANDS];

/** The tick. `tickOf` reads x, X, yes, 1 and a checkmark; the sheet asks for X. */
const TICK = 'X';

// Six products that make one point each: two share a full route (a family), one
// is high-volume and low-value, one is the reverse, one skips the middle of the
// line, one is bought-out and barely touches it.
export const EXAMPLE_PRODUCTS = [
  {
    code: 'PRD-001', name: 'Hydraulic cylinder 40 mm', group_name: 'Cylinders', uom: 'NOS',
    annual_qty: 12400, annual_value: 37200000, features: '40 mm bore, 250 mm stroke',
    route: ['Cutting', 'Machining', 'Welding', 'Assembly', 'Painting', 'Inspection', 'Packing'],
  },
  {
    code: 'PRD-002', name: 'Hydraulic cylinder 63 mm', group_name: 'Cylinders', uom: 'NOS',
    annual_qty: 8100, annual_value: 32400000, features: '63 mm bore, 250 mm stroke',
    route: ['Cutting', 'Machining', 'Welding', 'Assembly', 'Painting', 'Inspection', 'Packing'],
  },
  {
    code: 'PRD-003', name: 'Mounting bracket, pressed', group_name: 'Brackets', uom: 'NOS',
    annual_qty: 96000, annual_value: 9600000, features: '3 mm MS, zinc plated',
    route: ['Cutting', 'Welding', 'Painting', 'Packing'],
  },
  {
    code: 'PRD-004', name: 'Power pack assembly', group_name: 'Power packs', uom: 'SET',
    annual_qty: 640, annual_value: 28800000, features: '5 HP, tank mounted',
    route: ['Assembly', 'Inspection', 'Packing'],
  },
  {
    code: 'PRD-005', name: 'Piston rod, chrome plated', group_name: 'Rods', uom: 'NOS',
    annual_qty: 21500, annual_value: 12900000, features: 'Ø25 induction hardened',
    route: ['Cutting', 'Machining', 'Inspection', 'Packing'],
  },
  {
    code: 'PRD-006', name: 'Seal kit (bought out)', group_name: 'Spares', uom: 'SET',
    annual_qty: 5400, annual_value: 2700000, features: 'Traded item, kitted only',
    route: ['Packing'],
  },
];

/** How to fill it — the contract, written down for whoever fills this offline. */
const HELP_ROWS = [
  ['Product Name', 'Required. Everything else is optional.',
    'The wording the plant uses. One row per product or per variant — whichever level you want ranked. This is the only column the import refuses to run without.'],
  ['Product Code', 'The ERP item code',
    'Optional, but it is what lets a second upload be matched against the first. Fill it if you have it.'],
  ['Group', 'The ERP group or category',
    'Optional. Shown alongside the VSMs so you can see whether the process grouping agrees with how the business already talks about the portfolio.'],
  ['UOM', 'Unit of measure', 'NOS, SET, KGS, MTR — whatever the quantity is counted in.'],
  ['Annual Quantity', 'Units per YEAR, not per month',
    'Drives the volume pareto and the daily demand. A study without it still runs on value alone.'],
  ['Annual Sales Value', 'Revenue per YEAR, in the study currency',
    'Drives the revenue pareto and is the first basis the VSM recommendation ranks on. Enter it as a plain number — no currency symbol, no "Lakh", no thousands separator typed by hand.'],
  ['Features', 'What distinguishes this product from its neighbours',
    'Optional. Never calculated on; it is there so a reader of the report can tell two similar rows apart.'],
  ['', '', ''],
  ['THE PROCESS COLUMNS', 'One column per process, a tick per product', ''],
  ['Renaming them', 'The header IS the process name',
    'Replace Cutting, Machining, Welding … with your own operations. Keep them in the order material flows through the plant — that order becomes the route. Columns headed "Process 8" and up are spares: rename the ones you need and leave the rest alone.'],
  ['Ticking them', 'X in the cell where the product uses that process',
    'X, x, Yes or 1 all read as a tick. Blank, -, No or N/A read as not used. Do not type the process name into the cell — the name belongs in the header.'],
  ['More than 12 processes', 'Add columns',
    'Insert more columns to the right, headed with the process name, and tick them the same way. There is no limit on the PPQ side.'],
  ['A product with no route', 'Leave every process cell blank',
    'It still imports, and the report lists it as missing a route — bought-out and traded items usually end up here, which is correct.'],
  ['', '', ''],
  ['THE EXAMPLE ROWS', 'PRD-001 to PRD-006 are fiction', 'Delete all six before you send the file back. They are there to show the shape, not to be imported.'],
  ['Other layouts', 'This is not the only sheet the import reads', 'If you already have an export with the route written as one cell — "Cutting > Welding > Paint" — upload that instead. Step 1 reads it, and the "One column route" sheet in this file shows what it expects. Do not fill in both.'],
];

/**
 * Build the workbook. Split from the download so it can be written and read
 * straight back without a browser.
 */
export async function buildPPQTemplate() {
  const ExcelJS = (await import('exceljs')).default || (await import('exceljs'));
  const wb = new ExcelJS.Workbook();
  wb.creator = 'LFD Cloud';
  wb.created = new Date();

  // ── Sheet 1: the grid. It leads, because the importer reads sheet one. ────
  const ws = wb.addWorksheet('Products');
  ws.columns = [
    ...COLUMNS.map((c) => ({ header: c.header, key: c.key, width: c.width })),
    ...PROCESS_COLUMNS.map((p) => ({ header: p, key: `p_${p}`, width: 12 })),
  ];

  const head = ws.getRow(1);
  head.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
  head.alignment = { vertical: 'middle', wrapText: true };
  head.height = 30;
  // The process headers are the cells a client edits, so they are marked as
  // editable rather than looking like part of the form.
  PROCESS_COLUMNS.forEach((p, i) => {
    const cell = head.getCell(COLUMNS.length + i + 1);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF115E59' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true, textRotation: 90 };
  });
  ws.views = [{ state: 'frozen', xSplit: 3, ySplit: 1 }];

  EXAMPLE_PRODUCTS.forEach((p, i) => {
    const row = { no: i + 1, ...p };
    delete row.route;
    PROCESS_COLUMNS.forEach((c) => { row[`p_${c}`] = p.route.includes(c) ? TICK : ''; });
    ws.addRow(row);
  });

  const qtyCol = COLUMNS.findIndex((c) => c.key === 'annual_qty') + 1;
  const valCol = COLUMNS.findIndex((c) => c.key === 'annual_value') + 1;
  const firstProc = COLUMNS.length + 1;
  const lastProc = COLUMNS.length + PROCESS_COLUMNS.length;

  // Formats and the tick dropdown, down past the examples so the rows a client
  // adds behave like the rows that came with the file.
  for (let r = 2; r <= 200; r += 1) {
    ws.getCell(r, qtyCol).numFmt = '#,##0';
    ws.getCell(r, valCol).numFmt = '#,##0.00';
    for (let c = firstProc; c <= lastProc; c += 1) {
      const cell = ws.getCell(r, c);
      cell.alignment = { horizontal: 'center' };
      cell.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${TICK}"`],
        showErrorMessage: true,
        errorTitle: 'Tick, or leave it blank',
        error: 'Put an X where the product uses this process. The process NAME goes in the header, not in the cell.',
      };
    }
  }

  // ── Sheet 2: the contract ────────────────────────────────────────────────
  const help = wb.addWorksheet('How to fill');
  help.columns = [
    { header: 'Column', key: 'c', width: 22 },
    { header: 'Means', key: 'm', width: 44 },
    { header: 'How to fill it', key: 'h', width: 86 },
  ];
  help.getRow(1).font = { bold: true };
  HELP_ROWS.forEach(([c, m, h]) => help.addRow({ c, m, h }));
  help.eachRow((row) => { row.alignment = { wrapText: true, vertical: 'top' }; });

  // ── Sheet 3: the alternative layout, for a client who already has a route ─
  //
  // Documentation only — the importer reads sheet one, so nothing here is ever
  // parsed. It exists because "send us your own export" is easier to act on
  // once you have seen what an acceptable one looks like.
  const alt = wb.addWorksheet('One column route');
  alt.columns = [
    { header: 'Product Code', key: 'code', width: 14 },
    { header: 'Product Name', key: 'name', width: 34 },
    { header: 'Annual Quantity', key: 'qty', width: 16 },
    { header: 'Annual Sales Value', key: 'value', width: 18 },
    { header: 'Processes', key: 'route', width: 62 },
  ];
  alt.getRow(1).font = { bold: true };
  EXAMPLE_PRODUCTS.forEach((p) => alt.addRow({
    code: p.code, name: p.name, qty: p.annual_qty, value: p.annual_value,
    route: p.route.join(' > '),
  }));
  alt.getCell('G2').value = 'The same six products, written the other way: one Processes column, '
    + 'the route separated by > , ; or |. If your ERP exports like this, upload it as it is — '
    + 'there is no need to transpose it into the matrix on sheet one. Use ONE of the two layouts, '
    + 'not both.';
  alt.getCell('G2').font = { italic: true, color: { argb: 'FF64748B' } };
  alt.getCell('G2').alignment = { wrapText: true, vertical: 'top' };

  return wb;
}

/** Save it, with the Safari-safe revoke the other exporters use. */
export async function downloadPPQTemplate(filename = TEMPLATE_FILENAME) {
  const wb = await buildPPQTemplate();
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default downloadPPQTemplate;
