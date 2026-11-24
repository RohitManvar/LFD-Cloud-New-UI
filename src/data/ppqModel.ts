import { type PPQProduct, type PPQFamily, type ABCGrade } from './mock';

export function fmtNum(n: number): string {
  return n.toLocaleString('en-IN');
}

export function fmtCurrency(n: number): string {
  if (n >= 10000000) {
    return '₹' + (n / 10000000).toFixed(2) + ' Cr';
  }
  if (n >= 100000) {
    return '₹' + (n / 100000).toFixed(1) + ' L';
  }
  return '₹' + n.toLocaleString('en-IN');
}

export function ppqSummary(products: PPQProduct[], families: PPQFamily[]) {
  const totalProducts = products.length;
  const totalQty = products.reduce((acc, p) => acc + p.annual_qty, 0);
  const totalRevenue = products.reduce((acc, p) => acc + p.revenue, 0);

  const vitalProducts = products.filter(p => p.abc_qty === 'A');
  const vitalQty = vitalProducts.reduce((acc, p) => acc + p.annual_qty, 0);
  const vitalRevenue = vitalProducts.reduce((acc, p) => acc + p.revenue, 0);

  const vitalQtyPct = totalQty ? Math.round((vitalQty / totalQty) * 100) : 0;
  const vitalRevPct = totalRevenue ? Math.round((vitalRevenue / totalRevenue) * 100) : 0;

  const selectedFamily = families.find(f => f.selected_for_vsm) || families[0];

  const counts: Record<ABCGrade, number> = { A: 0, B: 0, C: 0 };
  products.forEach(p => { counts[p.abc_qty]++; });

  return {
    totalProducts,
    totalQty,
    totalRevenue,
    vitalCount: vitalProducts.length,
    vitalQty,
    vitalRevenue,
    vitalQtyPct,
    vitalRevPct,
    selectedFamily,
    counts,
  };
}
