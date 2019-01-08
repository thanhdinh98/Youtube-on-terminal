const {app, BrowserWindow, ipcMain} = require('electron');

app.on('ready', ()=>{
    const win = new BrowserWindow({show: false, width: 540, height: 360});
    win.loadURL(`file://${__dirname}/index.html`);
    
    win.once(`ready-to-show`, ()=>{
        win.show();
        win.webContents.send('url', process.argv[2]);
    });
});

app.on('window-all-closed', ()=>{
    app.quit();
});
