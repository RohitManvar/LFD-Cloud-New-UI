import { riskBands, type RiskItem, type RiskBand } from './mock.ts';
export function rpn(scores: (number | null)[]): number | null {
  return scores.length === 3 && scores.every(v => v !== null && Number.isInteger(v) && v >= 1 && v <= 5) ? scores.reduce<number>((a, b) => a * b!, 1) : null;
}
export const scoreOf = (r: RiskItem) => rpn([r.severity, r.occurrence, r.detection]);
export const residualOf = (r: RiskItem) => rpn([r.residual_severity, r.residual_occurrence, r.residual_detection]);
export function bandOf(score: number | null): RiskBand {
  if (score === null) return 'unscored';
  return score >= riskBands.critical ? 'critical' : score >= riskBands.high ? 'high' : score >= riskBands.medium ? 'medium' : 'low';
}
export const rankedRisks = (items: RiskItem[]) => [...items].sort((a, b) => (scoreOf(b) ?? -1) - (scoreOf(a) ?? -1) || (b.severity ?? 0) - (a.severity ?? 0));
export function riskSummary(items: RiskItem[]) {
  const counts: Record<RiskBand, number> = { critical: 0, high: 0, medium: 0, low: 0, unscored: 0 };
  items.forEach(r => counts[bandOf(scoreOf(r))]++);
  const reassessed = items.filter(r => scoreOf(r) !== null && residualOf(r) !== null);
  const before = reassessed.reduce((total, r) => total + scoreOf(r)!, 0);
  const after = reassessed.reduce((total, r) => total + residualOf(r)!, 0);
  return { total: items.length, counts, scored: items.length - counts.unscored,
    urgent: counts.critical + counts.high, max: Math.max(0, ...items.map(r => scoreOf(r) ?? 0)),
    mitigated: items.filter(r => r.mitigation.trim()).length, owners: items.filter(r => r.owner.trim()).length,
    completed: items.filter(r => r.status === 'Completed').length,
    reassessed: reassessed.length, reduction: before ? Math.round((before - after) / before * 100) : null };
}
