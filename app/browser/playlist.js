import fs from "fs";
import path from "path";

import app from "app";

const appDataFolder = path.join(app.getPath("userData"));
const appDataFile = path.join(appDataFolder, "playlist.json");

export const savePlaylist = (videoIds) => {
  console.log("saving to", appDataFolder);
  try {
    fs.mkdirSync(appDataFolder);
  } catch(e) {}

  const data = JSON.stringify(videoIds);
  fs.writeFileSync(appDataFile, data);
};

export const loadPlaylist = (callback) => {
  try {
    const buffer = fs.readFileSync(appDataFile);
    const data = buffer.toString("utf8");
    const json = JSON.parse(data);
    callback(json);
  } catch (e) {
    console.log("No playlist to load!");
    callback([]);
  }
}
