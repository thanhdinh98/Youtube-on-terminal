const {app, BrowserWindow, ipcMain} = require('electron');
const {url, vidTitle} = JSON.parse(process.argv[2]);


app.on('ready', ()=>{
    const win = new BrowserWindow({show: false, width: 560, height: 385, title: vidTitle});
    win.setMenuBarVisibility(false);

    win.loadURL(`file://${__dirname}/index.html`);
    
    win.once(`ready-to-show`, ()=>{
        win.show();
        win.webContents.send('url', url);
    });
});

app.on('window-all-closed', ()=>{
    app.quit();
});
