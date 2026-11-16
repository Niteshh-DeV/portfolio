import { useEffect, useMemo, useRef, useState } from 'react';
import snapshot from '@/data/contributions.json';
import { Reveal, SectionHead } from './Reveal';
import { Words } from './Kinetic';

/* --------------------------------------------------------------------------
   Semester GPA
   -------------------------------------------------------------------------- */

// null = result not confirmed yet; drawn as a gap, never as a guessed value
const semesters: { label: string; gpa: number | null }[] = [
  { label: '1st', gpa: 3.29 },
  { label: '2nd', gpa: 3.36 },
  { label: '3rd', gpa: null },
  { label: '4th', gpa: 3.46 },
  { label: '5th', gpa: 3.76 },
];

const GPA_MAX = 4;

function GpaChart() {
  const known = semesters.flatMap((semester, index) => (semester.gpa === null ? [] : [{ ...semester, gpa: semester.gpa, index }]));
  const floor = Math.floor(Math.min(...known.map((s) => s.gpa)) * 2) / 2;
  const ticks = [floor, (floor + GPA_MAX) / 2, GPA_MAX];

  // plot coordinates in percent; x leaves a margin so end labels stay inside
  const x = (index: number) => 8 + (index / (semesters.length - 1)) * 84;
  const y = (gpa: number) => ((gpa - floor) / (GPA_MAX - floor)) * 100;

  const first = known[0];
  const latest = known[known.length - 1];

  return (
    <div className="gpa">
      <div className="record__stats">
        <div className="stat">
          <span className="stat__value">{latest.gpa.toFixed(2)}</span>
          <span className="label">Latest — {latest.label} semester</span>
        </div>
        <div className="stat">
          <span className="stat__value">+{(latest.gpa - first.gpa).toFixed(2)}</span>
          <span className="label">Since the {first.label} semester</span>
        </div>
      </div>

      <figure className="gpa__figure">
        <figcaption className="label">Semester GPA — scale of {GPA_MAX.toFixed(1)}</figcaption>

        <div className="gpa__plot" role="img" aria-label="Line chart of GPA by semester. The same values are in the table that follows.">
          {ticks.map((tick) => (
            <span key={tick} className="gpa__tick label" style={{ bottom: `${y(tick)}%` }}>
              {tick.toFixed(1)}
            </span>
          ))}

          <svg className="gpa__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {known.slice(1).map((semester, i) => {
              const previous = known[i];
              // a dashed stroke bridges a semester whose result is still missing
              const bridgesGap = semester.index - previous.index > 1;
              return (
                <line
                  key={semester.label}
                  x1={x(previous.index)}
                  y1={100 - y(previous.gpa)}
                  x2={x(semester.index)}
                  y2={100 - y(semester.gpa)}
                  className={bridgesGap ? 'is-gap' : undefined}
                />
              );
            })}
          </svg>

          {known.map((semester, i) => {
            const change = i > 0 ? semester.gpa - known[i - 1].gpa : null;
            return (
              <button
                key={semester.label}
                type="button"
                className="gpa__point"
                style={{ left: `${x(semester.index)}%`, bottom: `${y(semester.gpa)}%` }}
                aria-label={`${semester.label} semester, GPA ${semester.gpa.toFixed(2)}`}
              >
                <span className="gpa__value">{semester.gpa.toFixed(2)}</span>
                <span className="gpa__tip" role="tooltip">
                  {semester.label} semester · GPA {semester.gpa.toFixed(2)}
                  {change !== null && ` · ${change >= 0 ? '+' : '−'}${Math.abs(change).toFixed(2)} on ${known[i - 1].label}`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="gpa__axis" aria-hidden="true">
          {semesters.map((semester, index) => (
            <span key={semester.label} className="label" style={{ left: `${x(index)}%` }}>
              {semester.label}
              {semester.gpa === null && <em>pending</em>}
            </span>
          ))}
        </div>

        <table className="sr-only">
          <caption>GPA by semester</caption>
          <thead>
            <tr>
              <th scope="col">Semester</th>
              <th scope="col">GPA</th>
            </tr>
          </thead>
          <tbody>
            {semesters.map((semester) => (
              <tr key={semester.label}>
                <th scope="row">{semester.label}</th>
                <td>{semester.gpa === null ? 'To be confirmed' : semester.gpa.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </div>
  );
}

/* --------------------------------------------------------------------------
   GitHub contributions
   -------------------------------------------------------------------------- */

interface Day {
  date: string;
  count: number;
  level: number;
}

const GITHUB_USER = snapshot.user;
const LIVE_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;

const dayFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' });
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

function Contributions() {
  const [days, setDays] = useState<Day[]>(snapshot.days);
  const [total, setTotal] = useState<number>(snapshot.total);
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // The snapshot renders immediately; a live answer replaces it when it arrives
  useEffect(() => {
    const controller = new AbortController();
    fetch(LIVE_URL, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data || !Array.isArray(data.contributions) || data.contributions.length === 0) return;
        setDays(data.contributions);
        if (typeof data.total?.lastYear === 'number') setTotal(data.total.lastYear);
      })
      .catch(() => {
        // offline or the service is down: the snapshot stays
      });
    return () => controller.abort();
  }, []);

  // On narrow screens the calendar scrolls sideways; start at the most recent week
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, [days]);

  const { leading, months, stats } = useMemo(() => {
    const leadingBlanks = toDate(days[0].date).getUTCDay();

    const monthLabels: { column: number; name: string }[] = [];
    days.forEach((day, index) => {
      const date = toDate(day.date);
      if (date.getUTCDate() !== 1 && index !== 0) return;
      const column = Math.floor((index + leadingBlanks) / 7) + 1;
      const last = monthLabels[monthLabels.length - 1];
      // skip a label that would collide with the one before it
      if (last && column - last.column < 3) return;
      monthLabels.push({ column, name: monthFormat.format(date) });
    });

    let streak = 0;
    let longest = 0;
    let busiest = days[0];
    let active = 0;
    days.forEach((day) => {
      streak = day.count > 0 ? streak + 1 : 0;
      longest = Math.max(longest, streak);
      if (day.count > 0) active += 1;
      if (day.count > busiest.count) busiest = day;
    });

    return { leading: leadingBlanks, months: monthLabels, stats: { longest, busiest, active } };
  }, [days]);

  const columns = Math.ceil((days.length + leading) / 7);

  const showTip = (e: React.MouseEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-date]');
    const scroller = scrollerRef.current;
    if (!cell || !scroller) {
      setTip(null);
      return;
    }
    const count = Number(cell.dataset.count);
    const box = cell.getBoundingClientRect();
    const frame = scroller.getBoundingClientRect();
    setTip({
      text: `${count === 0 ? 'No' : count} contribution${count === 1 ? '' : 's'} · ${dayFormat.format(toDate(cell.dataset.date ?? ''))}`,
      x: Math.min(Math.max(box.left + box.width / 2 - frame.left, 90), frame.width - 90),
      y: box.top - frame.top,
    });
  };

  return (
    <div className="commits">
      <div className="record__stats">
        <div className="stat">
          <span className="stat__value">{total.toLocaleString('en-US')}</span>
          <span className="label">Contributions in the last year</span>
        </div>
        <div className="stat">
          <span className="stat__value">{stats.active}</span>
          <span className="label">Active days</span>
        </div>
        <div className="stat">
          <span className="stat__value">{stats.longest}</span>
          <span className="label">Longest streak, in days</span>
        </div>
        <div className="stat">
          <span className="stat__value">{stats.busiest.count}</span>
          <span className="label">Busiest day — {dayFormat.format(toDate(stats.busiest.date))}</span>
        </div>
      </div>

      <figure className="commits__figure">
        <figcaption className="commits__caption">
          <span className="label">GitHub contributions — one square per day</span>
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            @{GITHUB_USER} <span className="link__arrow">↗</span>
          </a>
        </figcaption>

        <div className="commits__frame">
          <div className="commits__scroll" ref={scrollerRef} data-lenis-prevent-touch>
            <div className="commits__inner">
              <div className="commits__months" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} aria-hidden="true">
                {months.map((month) => (
                  <span key={`${month.name}-${month.column}`} className="label" style={{ gridColumnStart: month.column }}>
                    {month.name}
                  </span>
                ))}
              </div>

              <div
                className="commits__grid"
                role="img"
                aria-label={`${total} contributions in the last year across ${stats.active} active days; the longest streak was ${stats.longest} days.`}
                onMouseOver={showTip}
                onMouseLeave={() => setTip(null)}
              >
                {Array.from({ length: leading }, (_, index) => (
                  <span key={`blank-${index}`} />
                ))}
                {days.map((day) => (
                  <span key={day.date} className="commits__cell" data-level={day.level} data-date={day.date} data-count={day.count} />
                ))}
              </div>
            </div>
          </div>

          {tip && (
            <span className="commits__tip" style={{ left: tip.x, top: tip.y }} role="status">
              {tip.text}
            </span>
          )}
        </div>

        <div className="commits__legend label" aria-hidden="true">
          Less
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className="commits__cell" data-level={level} />
          ))}
          More
        </div>
      </figure>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function Record() {
  return (
    <section id="record" aria-label="Academic record and GitHub activity" className="section record">
      <SectionHead numeral="IV" label="Record — Semesters & commits" folio="04 / 06" />

      <div className="record__intro">
        <Words className="display" text="The *record*" />
        <Reveal delay={0.1}>
          <p>Two ledgers kept alongside the work: results from each semester of computer engineering, and a year of commits.</p>
        </Reveal>
      </div>

      <Reveal>
        <GpaChart />
      </Reveal>

      <Reveal>
        <Contributions />
      </Reveal>
    </section>
  );
}
