import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const game=fs.readFileSync('game.js','utf8');
const requiredIds=['gameCanvas','runSelect','modeSelect','settingsDialog','contrastSetting','sensitivitySetting','hapticsSetting','tutorialDialog','boostButton','tiltButton','quickDropButton','trailPreview','runProgressFill','shareButton','playReplayButton'];
for(const id of requiredIds)if(!html.includes(`id="${id}"`))throw new Error(`Missing required UI: ${id}`);
for(const asset of ['pro-systems.js?v=4','replay.js?v=5','game.js?v=116','mobile.js?v=3'])if(!html.includes(asset))throw new Error(`Missing runtime asset: ${asset}`);
for(const token of ['ECHO MOUNTAIN','ELDORA','LOVELAND','ARAPAHOE BASIN','STEAMBOAT','snowboarder','RIDER_PROFILES','quickDrop','boostEnergy'])if(!game.includes(token))throw new Error(`Missing gameplay feature: ${token}`);
JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
console.log('Alpine Rush smoke checks passed');
