import { useMemo } from 'react';

const CELL_SIZE = 12;
const GAP = 3;
const STEP = CELL_SIZE + GAP;

function buildCalendar(posts) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Count posts per day (local date)
  const countMap = {};
  posts.forEach((p) => {
    const d = new Date(p.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    countMap[key] = (countMap[key] || 0) + 1;
  });

  // Start 52 weeks ago, aligned to Sunday
  const start = new Date(today);
  start.setDate(today.getDate() - 364);
  start.setDate(start.getDate() - start.getDay()); // back to Sunday

  const weeks = [];
  const cur = new Date(start);
  while (cur <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
      week.push({
        date: new Date(cur),
        key,
        count: countMap[key] || 0,
        future: new Date(cur) > today,
      });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  // Month labels: show label at first week of each new month
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const m = week[0].date.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({
        wi,
        label: week[0].date.toLocaleDateString('en-GB', { month: 'short' }),
      });
      lastMonth = m;
    }
  });

  return { weeks, monthLabels };
}

function cellLevel(count) {
  if (count === 0) return 'level-0';
  if (count === 1) return 'level-1';
  if (count === 2) return 'level-2';
  if (count === 3) return 'level-3';
  return 'level-4';
}

export default function ActivityHeatmap({ posts }) {
  const { weeks, monthLabels } = useMemo(() => buildCalendar(posts), [posts]);

  const totalWidth = weeks.length * STEP;

  return (
    <div className="heatmap-wrap">
      <p className="heatmap-title">Learning Activity — Last 12 Months</p>
      <div className="heatmap-outer">
        {/* Month labels */}
        <div className="heatmap-month-labels" style={{ width: totalWidth + 'px' }}>
          {monthLabels.map(({ wi, label }) => (
            <span
              key={wi}
              className="heatmap-month-label"
              style={{ left: wi * STEP + 'px' }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="heatmap-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="heatmap-week">
              {week.map((day) => (
                <div
                  key={day.key}
                  className={`heatmap-cell ${day.future ? 'future' : cellLevel(day.count)}`}
                  title={day.future ? '' : `${day.key}: ${day.count} ${day.count === 1 ? 'entry' : 'entries'}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="heatmap-legend-cells">
            {[0, 1, 2, 3, 4].map((l) => (
              <div key={l} className={`heatmap-cell level-${l}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
