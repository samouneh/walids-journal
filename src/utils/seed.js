// Run this once in the browser console to seed sample posts:
// import { savePosts } from './storage'; savePosts(SEED);
// Or call seedIfEmpty() on first load.

import { getPosts, savePosts } from './storage';

export function seedIfEmpty() {
  if (getPosts().length > 0) return;

  savePosts([
    {
      id: 'seed-1',
      title: 'Started learning DCF valuation',
      content: `## What I covered today\n\nBegan working through discounted cash flow (DCF) modelling from scratch.\n\n**Key concepts:**\n- Free cash flow to firm (FCFF) vs equity (FCFE)\n- Terminal value using the Gordon Growth Model\n- WACC components: cost of debt, cost of equity (CAPM)\n\n## Takeaways\n\nBuilding a three-statement model first makes the DCF much easier to follow — the income statement feeds the cash flow adjustments.\n\nNext step: build a simple DCF for a public company using real filings.`,
      category: 'Markets & Investing',
      tags: ['DCF', 'Valuation', 'WACC'],
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: 'seed-2',
      title: 'Built a dynamic budget tracker in Excel',
      content: `## What I built\n\nCreated a monthly budget tracker using structured tables and dynamic formulas.\n\n**Techniques used:**\n- \`XLOOKUP\` for category mapping\n- Conditional formatting heat-map on variance column\n- Pivot table summarising actuals vs budget by category\n- Data validation drop-downs for category selection\n\n## Key learning\n\nUsing a proper Table (\`Ctrl+T\`) instead of a plain range makes formulas auto-expand and keeps things much cleaner.`,
      category: 'Financial Modelling',
      tags: ['Excel', 'Budgeting', 'XLOOKUP', 'Pivot Tables'],
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'seed-3',
      title: 'Reading: The Intelligent Investor — Chapters 1–3',
      content: `## Summary\n\nWorking through Benjamin Graham's *The Intelligent Investor* alongside my placement.\n\n**Chapters 1–3 themes:**\n- Distinction between investment and speculation\n- Defensive vs enterprising investor approach\n- Inflation and its effect on asset allocation\n\n## Notes\n\nGraham's argument that most retail investors should behave defensively (index funds, bonds, rebalancing) is as relevant now as it was in the 1970s. The commentary by Jason Zweig is excellent for modern context.`,
      category: 'Reading & Research',
      tags: ['Graham', 'Value Investing', 'Fundamentals'],
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'seed-4',
      title: 'Shell plc (SHEL.L) — Initiation of Coverage',
      content: `## Investment Thesis

Shell offers a rare combination of cash-generative upstream assets and an accelerating LNG business, trading at a meaningful discount to its US peers on both EV/EBITDA and free cash flow yield. The market is underpricing the resilience of its integrated gas segment and the optionality in its trading division.

**Rating: Buy — Target Price: 3,200p (+22% upside)**

## Key Financials

| Metric | 2023A | 2024E | 2025E |
|--------|-------|-------|-------|
| Revenue ($bn) | 316 | 298 | 285 |
| EBITDA ($bn) | 68 | 62 | 60 |
| FCF Yield | 9.8% | 10.4% | 11.1% |
| Net Debt ($bn) | 43 | 38 | 32 |

## Valuation

Using a sum-of-parts on the three core segments:
- **Upstream**: 6x EV/EBITDA on $28bn normalised EBITDA = $168bn
- **LNG / Integrated Gas**: 8x on $18bn EBITDA = $144bn
- **Downstream / Chemicals**: 4x on $8bn EBITDA = $32bn
- **Net debt deduction**: ($43bn)
- **Implied equity value**: $301bn vs current $247bn market cap

## Key Risks

- Oil price: every $10/bbl move = ~$3bn EBITDA impact
- LNG price normalisation as European storage refills
- Energy transition capex pressuring near-term FCF
- Regulatory risk on windfall taxes in UK/EU

## Catalysts

1. Q2 2024 buyback announcement ($3.5bn scheduled)
2. Ramp-up of QatarEnergy LNG offtake contracts (2026–2027)
3. Divestment of Singapore chemicals complex (proceeds ~$1.5bn)`,
      category: 'Markets & Investing',
      tags: ['Shell', 'Oil & Gas', 'Equity Research', 'LNG', 'Valuation'],
      type: 'analysis',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ]);
}
