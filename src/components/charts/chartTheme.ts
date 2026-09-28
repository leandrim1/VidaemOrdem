/** Tokens visuais compartilhados pelos gráficos (seguem o tema claro/escuro via CSS vars). */
export const CHART = {
  grid: 'var(--vo-chart-grid)',
  axis: 'var(--vo-chart-axis)',
  income: 'var(--vo-chart-1)',
  expense: 'var(--vo-chart-2)',
  surface: 'var(--vo-surface)',
  tick: { fill: 'var(--vo-muted)', fontSize: 12 },
} as const

export const LEGEND_INCOME_EXPENSE = [
  { label: 'Receitas', color: CHART.income },
  { label: 'Despesas', color: CHART.expense },
]
