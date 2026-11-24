export interface ParsedGrid {cols:string[];dataRows:Record<string,unknown>[];mapping:Record<string,string>;matrixCols:string[]}
export const FIELDS: {key:string;label:string;required?:boolean;desc:string}[];
export const NON_PROCESS: string[];
export function norm(value:unknown):string;
export function splitProcesses(value:unknown):string[];
export function parseGrid(grid:unknown[][]):ParsedGrid;
export function processesOf(row:Record<string,unknown>, config:{mapping:Record<string,string>;processCols:string[]}):string[];

export const ALIASES: Record<string,string[]>;
