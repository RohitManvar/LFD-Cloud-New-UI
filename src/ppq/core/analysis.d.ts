import type { Product } from '../model';
export function num(value: unknown): number;
export function normalizeProcess(value: unknown): string;
export function processList(product: Pick<Product, 'processes'>): string[];
export function allProcesses(products: Product[]): string[];
export function vsiScope<T extends { vsi_selected?: boolean }>(products: T[]): T[];
export interface AnalysisRow extends Product {
 qty: number; value: number; route: string[]; revenuePct: number; qtyPct: number;
 revenueRank: number; qtyRank: number; processCount: number; abc: 'A'|'B'|'C';
}
export interface ParetoRow extends AnalysisRow { cumPct: number }
export interface Analysis {
 totals: {productCount:number;vsiCount:number;vsiPicked:boolean;revenue:number;qty:number;processCount:number;vitalFewCount:number;vitalFewPct:number;vitalFewSharePct:number};
 rows: AnalysisRow[]; byRevenue: ParetoRow[]; byQty: ParetoRow[]; vsiRows: AnalysisRow[]; processes: string[]; paretoThreshold: number;
}
export function computeAnalysis(products: Product[], options?: {paretoThreshold?:number}): Analysis;
export interface Family { family_id: string|null; name:string;member_ids:string[];similarity:number;source:string;notes:string|null }
export function suggestFamilies(products: Product[], threshold?:number): {families: Family[];ungrouped:Product[]};
export function recommendations(analysis:Analysis, families:Family[], study?:object): {title:string;detail:string;tone:string}[];

