const fs = require('fs');

const text = fs.readFileSync('src/data/poems.ts', 'utf8');
const idRe = /id:\s*(\d+)/g;
let m;
const poems = [];
while ((m = idRe.exec(text)) !== null) {
  poems.push(Number(m[1]));
}
console.log('Found poem ids (in file order):', poems);

// sample likes payload we might receive from backend
const sampleLikes = {
  '0': 2,
  '1': 5,
  '17': 10,
  'poem-3': 4,
  '42': 3
};
console.log('\nSample incoming likes:', sampleLikes);

const migrationMap = {};
const removeKeys = new Set();

Object.entries(sampleLikes).forEach(([key, rawCount]) => {
  const count = Number(rawCount) || 0;
  if (!count) return;

  if (/^\d+$/.test(key)) {
    const num = Number(key);
    // prefer matching poem id
    const poemById = poems.find((p) => p === num);
    if (poemById) {
      const poemId = `poem-${poemById}`;
      migrationMap[poemId] = Math.max(migrationMap[poemId] ?? 0, count);
      removeKeys.add(key);
      return;
    }

    // fallback: treat as old index
    const index = num;
    if (!poems[index]) return;
    const poemId = `poem-${poems[index]}`;
    migrationMap[poemId] = Math.max(migrationMap[poemId] ?? 0, count);
    removeKeys.add(key);
    return;
  }

  // non-numeric keys are copied as-is
  migrationMap[key] = Math.max(migrationMap[key] ?? 0, count);
});

console.log('\nComputed migration map (to be merged into stable keys):', migrationMap);
console.log('Keys to remove:', Array.from(removeKeys));

// simulate merging with existing likes
const existing = {
  'poem-3': 1,
  'poem-17': 7
};
console.log('\nExisting likes:', existing);
const merged = { ...existing };
Object.keys(migrationMap).forEach((k) => {
  merged[k] = Math.max(merged[k] ?? 0, migrationMap[k]);
});
removeKeys.forEach((k) => delete merged[k]);
console.log('\nMerged likes result:', merged);
