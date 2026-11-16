// Refreshes the snapshot of GitHub contributions that the Record section renders
// before (or instead of) its live request. Run with: npm run contributions
import { writeFile } from 'node:fs/promises';

const USER = 'Niteshh-DeV';
const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`);
if (!response.ok) throw new Error(`Contributions request failed: ${response.status}`);

const { total, contributions } = await response.json();
const snapshot = {
  user: USER,
  fetchedAt: new Date().toISOString().slice(0, 10),
  total: total.lastYear,
  days: contributions.map(({ date, count, level }) => ({ date, count, level })),
};

await writeFile(new URL('../src/data/contributions.json', import.meta.url), JSON.stringify(snapshot) + '\n');
console.log(`Saved ${snapshot.days.length} days, ${snapshot.total} contributions.`);
