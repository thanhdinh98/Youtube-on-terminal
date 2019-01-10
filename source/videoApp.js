const {app, BrowserWindow, ipcMain} = require('electron');

app.on('ready', ()=>{
    const win = new BrowserWindow({show: false, width: 560, height: 390});
    win.setMenuBarVisibility(false);

    win.loadURL(`file://${__dirname}/index.html`);
    
    win.once(`ready-to-show`, ()=>{
        win.show();
        win.webContents.send('url', process.argv[2]);
    });
});

app.on('window-all-closed', ()=>{
    app.quit();
});
