import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const assets=['modern.css?v=2','performance.js?v=1','replay.js?v=1','game.js?v=13','pro-systems.js?v=2'];
for(const asset of assets)if(!html.includes(asset)||!fs.existsSync(asset.split('?')[0]))throw new Error(`Missing production asset: ${asset}`);
const sw=fs.readFileSync('sw.js','utf8');
for(const asset of assets)if(!sw.includes(asset))throw new Error(`Asset is not cached offline: ${asset}`);
if(!fs.existsSync('leaderboard.md'))throw new Error('Missing leaderboard contract');
console.log('Alpine Rush production checks passed');
