import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const game=fs.readFileSync('game.js','utf8');
const requiredIds=['gameCanvas','runSelect','modeSelect','settingsDialog','contrastSetting','sensitivitySetting','hapticsSetting','tutorialDialog','boostButton','trailPreview','runProgressFill','shareButton','playReplayButton'];
for(const id of requiredIds)if(!html.includes(`id="${id}"`))throw new Error(`Missing required UI: ${id}`);
for(const token of ['ECHO MOUNTAIN','ELDORA','LOVELAND','ARAPAHOE BASIN','STEAMBOAT','snowboarder','boostEnergy'])if(!game.includes(token))throw new Error(`Missing gameplay feature: ${token}`);
JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
console.log('Alpine Rush smoke checks passed');
