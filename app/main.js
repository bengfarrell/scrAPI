var app = require('app');  // Module to control application life.
var path = require('path');
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;
var secondaryWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    var injectscript = escape(__dirname + '/inject/test.js');
    mainWindow = new BrowserWindow( { width: '800px', height: '600px', 'web-preferences': { 'web-security': false } });
    mainWindow.loadUrl('http://craigslist.org' );
    mainWindow.openDevTools();
    mainWindow.getWebContents().on('did-finish-load', function() {
        var remotejs = "var js = document.createElement('script'); \
                        js.src = 'file://' + unescape('" + injectscript + "'); \
                        console.log(js); \
                        document.getElementsByTagName('body')[0].appendChild(js);";

        this.executeJavaScript(remotejs);
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

var ipc = require('ipc');
ipc.on('ready', function(site) {
    console.log(site.uri + ' is ready' );
    mainWindow.webContents.send('parseRequest', { selector: 'li', key: { name: 'thing', selector: 'a' }, value: { name: 'isa', selector: '[href]' } });
});

ipc.on('parseResponse', function(event, arg) {
    console.log(arg)
});