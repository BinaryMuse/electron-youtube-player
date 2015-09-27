import app from "app";
import BrowserWindow from "browser-window";

let mainWindow = null;

const launchMainWindow = () => {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.maximize();
  mainWindow.loadUrl(`file://${__dirname}/../client/index.html`);
  // mainWindow.openDevTools();
  mainWindow.on('closed', () => mainWindow = null);
};

app.on('window-all-closed', () => app.quit());
app.on('ready', launchMainWindow);
