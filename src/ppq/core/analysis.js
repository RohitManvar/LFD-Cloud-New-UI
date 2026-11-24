// ─────────────────────────────────────────────────────────────────────────────
// PPQ analysis engine — every number the module shows is derived here.
//
// Pure functions over the saved product master: nothing is persisted, so a
// corrected quantity immediately re-ranks the tables, re-draws the pareto
// charts and re-groups the families. The backend stays the record of raw data.
//
// The method mirrors the manual PPQ workbook:
//   • contribution % and rank on revenue and on volume            (Step 2)
//   • cumulative % → ABC classes, the 80/20 cut                   (Step 3)
//   • product × process matrix                                    (Step 4)
//   • families by process similarity (Jaccard, average linkage)   (Step 5)
// ─────────────────────────────────────────────────────────────────────────────

/** Coerce anything the API or a spreadsheet hands us into a finite number. */
export const num = (v) => {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'number' ? v : Number(String(v).replace(/[, ]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/** Canonical form of a process name, so "Cutting " and "CUTTING" are one process. */
export const normalizeProcess = (p) => String(p || '').trim().toUpperCase().replace(/\s+/g, ' ');

/** A product's process route as a de-duplicated, normalized ordered list. */
export const processList = (product) => {
  const seen = new Set();
  const out = [];
  (product?.processes || []).forEach((p) => {
    const key = normalizeProcess(p);
    if (key && !seen.has(key)) { seen.add(key); out.push(key); }
  });
  return out;
};

/** Every distinct process across the study, in first-seen order (matrix columns). */
export const allProcesses = (products) => {
  const seen = new Set();
  const out = [];
  (products || []).forEach((p) => processList(p).forEach((proc) => {
    if (!seen.has(proc)) { seen.add(proc); out.push(proc); }
  }));
  return out;
};

/** Jaccard similarity of two process routes: shared / combined. 0–1. */
export const jaccard = (a, b) => {
  const A = a instanceof Set ? a : new Set(a);
  const B = b instanceof Set ? b : new Set(b);
  if (A.size === 0 && B.size === 0) return 0;   // two blank routes aren't "identical"
  let shared = 0;
  A.forEach((x) => { if (B.has(x)) shared += 1; });
  const union = A.size + B.size - shared;
  return union === 0 ? 0 : shared / union;
};

/**
 * The products Value Stream Identification works on: the ones ticked in Step 4,
 * or every product when none are ticked. Takes products or analysis rows.
 */
export const vsiScope = (list) => {
  const picked = (list || []).filter((p) => p.vsi_selected);
  return picked.length ? picked : (list || []);
};

// ── Step 2 & 3: contribution, ranking, pareto ────────────────────────────────

/**
 * Rank the product master on revenue and on volume, and classify each product
 * into an ABC band from its cumulative revenue share.
 *
 * `paretoThreshold` (default 80) is the cumulative-% cut for class A; class B
 * runs to 95%, everything after is class C.
 *
 * Returns:
 *   totals   — headline figures for the KPI cards
 *   rows     — the products, each enriched with contributions and ranks
 *   byRevenue / byQty — the same rows sorted, each carrying its cumulative %
 *   vsiRows  — the rows Step 5 groups (see vsiScope). The ranks and shares stay
 *              against the whole portfolio, so a VSM's share is still a share
 *              of the plant rather than of the pick.
 */
export function computeAnalysis(products, { paretoThreshold = 80 } = {}) {
  const list = (products || []).map((p) => ({
    ...p,
    qty: num(p.annual_qty),
    value: num(p.annual_value),
    route: processList(p),
  }));

  const revenue = list.reduce((s, p) => s + p.value, 0);
  const qty = list.reduce((s, p) => s + p.qty, 0);
  const processes = allProcesses(products);

  // Contribution shares. A study with no sales values still ranks on volume —
  // consultants often start with quantities and add values later.
  const rows = list.map((p) => ({
    ...p,
    revenuePct: revenue > 0 ? (p.value / revenue) * 100 : 0,
    qtyPct: qty > 0 ? (p.qty / qty) * 100 : 0,
    processCount: p.route.length,
  }));

  const rankInto = (key, rankKey) => {
    [...rows]
      .sort((a, b) => b[key] - a[key])
      .forEach((row, i) => { row[rankKey] = i + 1; });
  };
  rankInto('value', 'revenueRank');
  rankInto('qty', 'qtyRank');

  // Cumulative curves + ABC bands (classed on revenue share, the usual basis).
  const cumulative = (sorted, pctKey) => {
    let run = 0;
    return sorted.map((p) => {
      run += p[pctKey];
      const cumPct = Math.min(run, 100);
      let abc = 'C';
      if (cumPct <= paretoThreshold) abc = 'A';
      else if (cumPct <= 95) abc = 'B';
      return { ...p, cumPct, abc };
    });
  };

  const byRevenue = cumulative([...rows].sort((a, b) => b.value - a.value || b.qty - a.qty), 'revenuePct');
  const byQty = cumulative([...rows].sort((a, b) => b.qty - a.qty || b.value - a.value), 'qtyPct');

  // Push the revenue ABC class back onto the canonical rows so every table can
  // show it without re-deriving the sort.
  const abcByProduct = new Map(byRevenue.map((p) => [p.product_id, p.abc]));
  rows.forEach((r) => { r.abc = abcByProduct.get(r.product_id) || 'C'; });

  const vitalFew = byRevenue.filter((p) => p.abc === 'A');
  const vsiRows = vsiScope(rows);

  return {
    totals: {
      productCount: rows.length,
      // How many go on to Step 5, and whether that is a pick or the lot.
      vsiCount: vsiRows.length,
      vsiPicked: vsiRows.length < rows.length,
      revenue,
      qty,
      processCount: processes.length,
      // "n products drive x% of revenue" — the headline pareto finding.
      vitalFewCount: vitalFew.length,
      vitalFewPct: vitalFew.length ? vitalFew[vitalFew.length - 1].cumPct : 0,
      vitalFewSharePct: rows.length ? (vitalFew.length / rows.length) * 100 : 0,
    },
    rows,
    byRevenue,
    byQty,
    vsiRows,
    processes,
    paretoThreshold,
  };
}

// ── Step 5: product families by process similarity ───────────────────────────

const FAMILY_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Family name for the nth suggested group: Family A, Family B, … Family AA. */
export const familyLabel = (i) => {
  if (i < 26) return `VSM ${FAMILY_LABELS[i]}`;
  const first = Math.floor(i / 26) - 1;
  return `VSM ${FAMILY_LABELS[first]}${FAMILY_LABELS[i % 26]}`;
};

/**
 * Group products whose process routes are alike enough to share a value stream.
 *
 * Agglomerative clustering with average linkage: start with one cluster per
 * product, repeatedly merge the closest pair while their average pairwise
 * similarity is at least `threshold`. Average linkage (rather than single
 * linkage) stops a chain of loosely-related products from collapsing into one
 * sprawling family.
 *
 * Products with no process route can't be compared, so they are returned in
 * `ungrouped` instead of being forced into a family.
 */
export function suggestFamilies(products, threshold = 0.6) {
  const usable = [];
  const ungrouped = [];
  (products || []).forEach((p) => {
    const route = processList(p);
    if (route.length === 0) ungrouped.push(p);
    else usable.push({ product: p, set: new Set(route) });
  });

  // Pairwise similarity, computed once and reused by every linkage lookup.
  const sim = usable.map((a, i) => usable.map((b, j) => (i === j ? 1 : jaccard(a.set, b.set))));

  let clusters = usable.map((_, i) => [i]);

  const avgLinkage = (c1, c2) => {
    let total = 0;
    c1.forEach((i) => c2.forEach((j) => { total += sim[i][j]; }));
    return total / (c1.length * c2.length);
  };

  for (;;) {
    let best = { score: -1, a: -1, b: -1 };
    for (let a = 0; a < clusters.length; a += 1) {
      for (let b = a + 1; b < clusters.length; b += 1) {
        const score = avgLinkage(clusters[a], clusters[b]);
        if (score > best.score) best = { score, a, b };
      }
    }
    if (best.score < threshold || best.a < 0) break;
    const merged = [...clusters[best.a], ...clusters[best.b]];
    clusters = clusters.filter((_, i) => i !== best.a && i !== best.b);
    clusters.push(merged);
  }

  // Internal cohesion of a finished cluster — the number the report quotes.
  const cohesion = (members) => {
    if (members.length < 2) return 1;
    let total = 0;
    let pairs = 0;
    for (let i = 0; i < members.length; i += 1) {
      for (let j = i + 1; j < members.length; j += 1) { total += sim[members[i]][members[j]]; pairs += 1; }
    }
    return pairs ? total / pairs : 1;
  };

  // Biggest families first, then by revenue, so "Family A" is the headline one.
  const ordered = clusters
    .map((members) => ({
      members,
      revenue: members.reduce((s, i) => s + num(usable[i].product.annual_value), 0),
    }))
    .sort((x, y) => y.members.length - x.members.length || y.revenue - x.revenue);

  return {
    families: ordered.map((c, i) => ({
      family_id: null,                       // assigned by the backend on save
      name: familyLabel(i),
      member_ids: c.members.map((idx) => usable[idx].product.product_id),
      similarity: Number(cohesion(c.members).toFixed(4)),
      source: 'auto',
      notes: null,
    })),
    ungrouped,
  };
}

// ── Family roll-ups ──────────────────────────────────────────────────────────

/**
 * Everything a family card / the report / the VSM handoff needs about one
 * family: its members, totals, shares, the processes they all pass through and
 * the takt time its combined demand implies.
 */
export function familyStats(family, rows, study = {}) {
  const byId = new Map((rows || []).map((r) => [r.product_id, r]));
  const members = (family?.member_ids || []).map((id) => byId.get(id)).filter(Boolean);

  const revenue = members.reduce((s, p) => s + num(p.value ?? p.annual_value), 0);
  const qty = members.reduce((s, p) => s + num(p.qty ?? p.annual_qty), 0);
  const totalRevenue = (rows || []).reduce((s, p) => s + num(p.value ?? p.annual_value), 0);
  const totalQty = (rows || []).reduce((s, p) => s + num(p.qty ?? p.annual_qty), 0);

  // Processes shared by EVERY member (the family's common backbone) vs the
  // union (everything the family's value stream has to cover).
  const routes = members.map((p) => new Set(p.route || processList(p)));
  const union = new Set();
  routes.forEach((r) => r.forEach((x) => union.add(x)));
  const common = [...union].filter((proc) => routes.length > 0 && routes.every((r) => r.has(proc)));

  const workingDays = num(study.working_days) || 300;

  return {
    ...family,
    members,
    memberCount: members.length,
    revenue,
    qty,
    revenuePct: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0,
    qtyPct: totalQty > 0 ? (qty / totalQty) * 100 : 0,
    commonProcesses: common,
    allProcesses: [...union],
    dailyDemand: workingDays > 0 ? qty / workingDays : 0,
    monthlyDemand: qty / 12,
  };
}

/** Roll up every family, richest first — the ordering used across the module. */
export const familyBreakdown = (families, rows, study) =>
  (families || [])
    .map((f) => familyStats(f, rows, study))
    .sort((a, b) => b.revenue - a.revenue || b.memberCount - a.memberCount);

/**
 * Pick the family to recommend for VSM, and report what the pick is based on.
 *
 * A value stream maps products that FLOW the same way, so cohesion is the first
 * gate: members must share at least two process steps to count as a shared
 * route rather than a coincidence. Among the families that clear it, the pick
 * goes to the one carrying the most business — revenue when the study has
 * values, else volume.
 *
 * With neither figure there is no business basis at all, so the fallback ranks
 * on cohesion and reports `basis: 'cohesion'` for the caller to say out loud.
 * Size is deliberately never a tiebreak: the largest family is normally the
 * loosest one, so ranking on it recommends exactly the wrong group.
 */
export function recommendedFamily(fams, totals = {}) {
  const list = fams || [];
  if (!list.length) return null;

  const basis = num(totals.revenue) > 0 ? 'revenue' : num(totals.qty) > 0 ? 'volume' : 'cohesion';

  const rank = (xs) => [...xs].sort((a, b) => {
    if (basis === 'revenue') return b.revenue - a.revenue || b.qty - a.qty;
    if (basis === 'volume') return b.qty - a.qty || Number(b.similarity || 0) - Number(a.similarity || 0);
    return Number(b.similarity || 0) - Number(a.similarity || 0)
      || b.commonProcesses.length - a.commonProcesses.length;
  });

  const viable = list.filter((f) => f.commonProcesses.length >= 2);
  if (viable.length) return { family: rank(viable)[0], basis, viable: true };
  return { family: rank(list)[0], basis, viable: false };
}

// ── Step 7: report recommendations ───────────────────────────────────────────

/**
 * Turn the analysis into the plain-language findings the PPQ report carries.
 * Each item is { title, detail, tone } — tone drives the colour in the UI/PDF.
 */
export function recommendations(analysis, families, study = {}) {
  const out = [];
  const { totals, byRevenue, byQty, rows } = analysis;

  if (!rows.length) {
    return [{
      tone: 'warn',
      title: 'No products captured yet',
      detail: 'Add products in Step 1 — upload an Excel/CSV export or enter them manually — before generating a report.',
    }];
  }

  if (totals.vitalFewCount > 0 && totals.revenue > 0) {
    out.push({
      tone: 'good',
      title: `${totals.vitalFewCount} of ${totals.productCount} products drive ${totals.vitalFewPct.toFixed(1)}% of revenue`,
      detail: `That is ${totals.vitalFewSharePct.toFixed(0)}% of the portfolio carrying the bulk of the value. Focus the value stream work on these class-A products first.`,
    });
  }

  const topRev = byRevenue[0];
  if (topRev && topRev.value > 0) {
    out.push({
      tone: 'info',
      title: `Highest revenue product: ${topRev.name}`,
      detail: `${topRev.revenuePct.toFixed(1)}% of total revenue on an annual quantity of ${topRev.qty.toLocaleString()}.`,
    });
  }

  const topQty = byQty[0];
  if (topQty && topQty.qty > 0 && topRev && topQty.product_id !== topRev.product_id) {
    out.push({
      tone: 'info',
      title: `Highest volume product: ${topQty.name}`,
      detail: `${topQty.qtyPct.toFixed(1)}% of total volume. High volume with lower revenue share usually signals the flow-driven end of the portfolio — a strong VSM candidate.`,
    });
  }

  const fams = familyBreakdown(families, rows, study);
  const pick = recommendedFamily(fams, totals);
  if (pick) {
    const f = pick.family;
    const size = `${f.memberCount} product${f.memberCount === 1 ? '' : 's'}`;
    const shared = `${f.commonProcesses.length} common process${f.commonProcesses.length === 1 ? '' : 'es'}`;

    if (!pick.viable) {
      // Nothing in the study is tight enough to be a value stream. Saying so is
      // the useful answer — naming a "winner" here would send someone off to map
      // a group of products that don't actually share a route.
      out.push({
        tone: 'warn',
        title: `No VSM is tight enough to map yet — closest is ${f.name}`,
        detail: `${f.name} holds ${size} but they share only ${shared}, so they don't follow one route. Raise the similarity threshold in Step 5 to split the grouping, or fill in the missing process routes in Step 4, then generate VSMs again.`,
      });
    } else if (pick.basis === 'cohesion') {
      out.push({
        tone: 'info',
        title: `Most coherent VSM: ${f.name}`,
        detail: `${size} sharing ${shared}. This study has no quantities and no sales values, so VSMs can't be ranked by business impact — this pick reflects process similarity only. Add annual quantity in Step 1 for a demand-based recommendation.`,
      });
    } else {
      out.push({
        tone: 'good',
        title: `Recommended VSM: ${f.name}`,
        detail: `${size}, ${f.revenuePct.toFixed(1)}% of revenue and ${f.qtyPct.toFixed(1)}% of volume, sharing ${shared} — ranked on ${pick.basis}.`,
      });
    }
  }

  // A single family holding most of the portfolio is the signature of a
  // threshold set too low: average-linkage merging chains loosely-related
  // products together until one bucket swallows everything.
  // Needs enough groups and products for the ratio to mean anything — "60% of 5
  // products across 2 families" is arithmetic, not a finding.
  if (fams.length >= 3) {
    const grouped = fams.reduce((s, f) => s + f.memberCount, 0);
    const biggest = fams.reduce((m, f) => (f.memberCount > m.memberCount ? f : m), fams[0]);
    if (grouped >= 10 && biggest.memberCount / grouped >= 0.6) {
      out.push({
        tone: 'warn',
        title: `${biggest.name} holds ${((biggest.memberCount / grouped) * 100).toFixed(0)}% of all grouped products`,
        detail: `One catch-all VSM across ${fams.length} groups usually means the similarity threshold is too low — products are merging on a step they all happen to share. Raise it in Step 5 until the VSMs split into distinct routes.`,
      });
    }
  }

  // Only the products going on to Step 5 need a route: a study that ticked 40
  // of 1,300 has not left 1,260 unfinished.
  const noRoute = (analysis.vsiRows || rows).filter((r) => r.route.length === 0);
  if (noRoute.length) {
    out.push({
      tone: 'warn',
      title: `${noRoute.length} ${totals.vsiPicked ? 'picked ' : ''}product${noRoute.length === 1 ? '' : 's'} have no process route`,
      detail: totals.vsiPicked
        ? 'Products without processes can\'t be grouped into a VSM. Complete their routes in Step 4 so the grouping covers every product picked there.'
        : 'Products without processes can\'t be grouped into a VSM. Complete the process matrix in Step 4 so the grouping covers the whole portfolio.',
    });
  }

  const noValue = rows.filter((r) => r.value <= 0);
  if (totals.revenue === 0 && totals.qty === 0) {
    // Both figures missing — every contribution, rank, pareto bar and takt in
    // the study is zero. Almost always a column-mapping miss on import, so the
    // message points at that rather than at manual data entry.
    out.push({
      tone: 'warn',
      title: 'No quantities and no sales values captured',
      detail: 'Every product is missing both figures, so contribution %, rankings and both pareto charts are all zero. If your file did contain them, re-run the Step 1 upload and check the Annual Quantity / Annual Sales Value column mapping.',
    });
  } else if (totals.revenue === 0) {
    out.push({
      tone: 'warn',
      title: 'No sales values captured',
      detail: 'The analysis is running on quantity alone. Add annual sales values to rank the portfolio on revenue as well.',
    });
  } else if (noValue.length) {
    out.push({
      tone: 'warn',
      title: `${noValue.length} product${noValue.length === 1 ? '' : 's'} have no sales value`,
      detail: 'Revenue contribution and the revenue pareto only reflect products with a value. Add the missing figures for a complete ranking.',
    });
  }

  return out;
}

// ── Formatting helpers shared by the pages and the PDF ───────────────────────

export const fmtNum = (v, digits = 0) => {
  const n = num(v);
  return n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
};

/**
 * Compact money for tight table cells: 1.2 Cr / 3.4 L / 5,600.
 *
 * `ascii` swaps ₹ for "Rs." — PDF standard fonts (Helvetica et al) carry no
 * rupee glyph, so the symbol would silently render as a superscript one there.
 * Screens keep the real symbol.
 */
export const fmtMoney = (v, currency = 'INR', { ascii = false } = {}) => {
  const n = num(v);
  if (currency === 'INR') {
    const sym = ascii ? 'Rs.' : '₹';
    if (Math.abs(n) >= 1e7) return `${sym}${(n / 1e7).toFixed(2)} Cr`;
    if (Math.abs(n) >= 1e5) return `${sym}${(n / 1e5).toFixed(2)} L`;
    return `${sym}${fmtNum(n)}`;
  }
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  return fmtNum(n);
};

export const fmtPct = (v, digits = 1) => `${num(v).toFixed(digits)}%`;
