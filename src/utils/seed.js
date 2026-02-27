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
      category: 'Financial Analysis',
      tags: ['DCF', 'Valuation', 'WACC'],
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: 'seed-2',
      title: 'Built a dynamic budget tracker in Excel',
      content: `## What I built\n\nCreated a monthly budget tracker using structured tables and dynamic formulas.\n\n**Techniques used:**\n- \`XLOOKUP\` for category mapping\n- Conditional formatting heat-map on variance column\n- Pivot table summarising actuals vs budget by category\n- Data validation drop-downs for category selection\n\n## Key learning\n\nUsing a proper Table (\`Ctrl+T\`) instead of a plain range makes formulas auto-expand and keeps things much cleaner.`,
      category: 'Excel & Spreadsheets',
      tags: ['Excel', 'Budgeting', 'XLOOKUP', 'Pivot Tables'],
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'seed-3',
      title: 'Reading: The Intelligent Investor — Chapters 1–3',
      content: `## Summary\n\nWorking through Benjamin Graham's *The Intelligent Investor* alongside my placement.\n\n**Chapters 1–3 themes:**\n- Distinction between investment and speculation\n- Defensive vs enterprising investor approach\n- Inflation and its effect on asset allocation\n\n## Notes\n\nGraham's argument that most retail investors should behave defensively (index funds, bonds, rebalancing) is as relevant now as it was in the 1970s. The commentary by Jason Zweig is excellent for modern context.`,
      category: 'Reading',
      tags: ['Graham', 'Value Investing', 'Fundamentals'],
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ]);
}
