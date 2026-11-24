/** All visual tokens are defined here and exposed to CSS at startup. */
export const theme = {
  riskAccent: '#b45309', riskAccentHover: '#92400e', riskAccentSoft: '#fef3e7', riskAccentDark: '#f59e0b',
  riskLow: '#E7E3DA', riskMedium: '#E0B478', riskHigh: '#C9713A', riskCritical: '#94301A',
  riskLowInk: '#2A2419', riskMediumInk: '#3A2408', riskHighInk: '#FFF6EF', riskCriticalInk: '#FFF1EC',
  ppqAccent: '#4F46E5', ppqAccentHover: '#4338CA', ppqAccentSoft: '#EEF2FF', ppqAccentDark: '#6366F1',
  ppqA: '#16A34A', ppqASoft: '#ECFDF5', ppqAInk: '#15703A',
  ppqB: '#F59E0B', ppqBSoft: '#FFFBEB', ppqBInk: '#B45309',
  ppqC: '#94A3B8', ppqCSoft: '#F1F5F9', ppqCInk: '#475569',
  vsiAccent: '#0D9488', vsiAccentHover: '#0F766E', vsiAccentSoft: '#F0FDFA', vsiAccentDark: '#14B8A6',
  capacityAccent: '#4D7C0F', capacityAccentHover: '#3F6212', capacityAccentSoft: '#EEF6E2', capacityAccentDark: '#A3E635',
  equipmentAccent: '#44546A', equipmentAccentHover: '#334155', equipmentAccentSoft: '#E9EEF4', equipmentAccentDark: '#9FB3C8',
  manpowerAccent: '#A21CAF', manpowerAccentHover: '#86198F', manpowerAccentSoft: '#FBEAFC', manpowerAccentDark: '#E879F9',
  supplyAccent: '#0369A1', supplyAccentHover: '#075985', supplyAccentSoft: '#E0F2FE', supplyAccentDark: '#7DD3FC',
  supermarketAccent: '#78350F', supermarketAccentHover: '#5C2607', supermarketAccentSoft: '#F7EFE6', supermarketAccentDark: '#FDBA74',
  mhAccent: '#BE185D', mhAccentHover: '#9D174D', mhAccentSoft: '#FDF2F8', mhAccentDark: '#F472B6',
  layoutAccent: '#059669', layoutAccentHover: '#047857', layoutAccentSoft: '#ECFDF5', layoutAccentDark: '#34D399',
  visualAccent: '#0891B2', visualAccentHover: '#0E7490', visualAccentSoft: '#ECFEFF', visualAccentDark: '#22B8CF',
  visualPresent: '#059669', visualMissing: '#C2410C', visualNA: '#64748B',
  flowAccent: '#BE185D', flowAccentHover: '#9D174D', flowAccentSoft: '#FDEAF3', flowAccentDark: '#F472B6',
  vsmAccent: '#2563EB', vsmAccentHover: '#1D4ED8', vsmAccentSoft: '#EFF4FF', vsmAccentDark: '#60A5FA',
  trainingAccent: '#166534', trainingAccentHover: '#14532D', trainingAccentSoft: '#ECFDF3', trainingAccentDark: '#86EFAC',
  projectAccent: '#6D28D9', projectAccentHover: '#5B21B6', projectAccentSoft: '#F5F3FF', projectAccentDark: '#8B5CF6',
  projectCivil: '#7C5295', projectShifting: '#2563EB', projectCommissioning: '#0F766E',
  bg: '#EEEFF1', surface: '#FFFFFF', inset: '#F4F5F7', rowHover: '#E9EBEF',
  ink: '#111318', text: '#2B2F36', muted: '#5F6672', border: '#DDE0E5',
  orange: '#FF5A1F', orangeHover: '#E8480F', orangeTint: '#FFEDE5', orangeText: '#B83A0B',
  blue: '#2563EB', blueHover: '#1D4ED8', blueTint: '#EFF4FF', blueText: '#1D4ED8',
  green: '#16A34A', greenTint: '#E6F5EC', greenText: '#15703A',
  red: '#B42318', redTint: '#FDECEC',
  hatchColor: '#C9CDD4', darkMuted: '#B9BEC7', darkInset: '#24272D',
  fontUi: '"Geist", system-ui, sans-serif', fontMono: '"Geist Mono", monospace',
  titleSize: '60px', titleWeight: '300', titleTracking: '-0.035em',
  numberSize: '52px', numberWeight: '200', numberTracking: '-0.04em',
  panelTitleSize: '22px', bodySize: '14px',
  panelRadius: '28px', cardRadius: '24px', rowRadius: '16px', iconRadius: '14px', pillRadius: '999px',
  hatch: 'repeating-linear-gradient(135deg, #C9CDD4 0 1px, transparent 1px 6px)',
  meterGradient: 'linear-gradient(90deg, #FF5A1F, #FFAF87)',
  blueGradient: 'linear-gradient(90deg, #1D4ED8, #8CAAFE)',
  shadow: '0 10px 28px rgb(17 19 24 / 6%)',
};
export function applyTheme() {
  for (const [key, value] of Object.entries(theme)) {
    document.documentElement.style.setProperty('--' + key.replace(/[A-Z]/g, c => '-' + c.toLowerCase()), value);
  }
}

