const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { setupDatabase, db } = require('./db');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
}

function createOwnerWindow() {
  const ownerWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ownerWin.loadFile('owner.html');
}

function createBillWindow() {
  const billWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  billWin.loadFile('bill.html');
}

app.whenReady().then(() => {
  createWindow();
  setupDatabase();
});

ipcMain.on('open-owner-window', () => {
  createOwnerWindow();
});

ipcMain.on('generate-bill', (event, customer, tires) => {
  db('sales').insert(tires.map(tire => ({
    customerId: customer.id,
    tireId: tire.id,
    quantity: tire.quantity,
    totalPrice: tire.totalPrice,
  }))).then(() => {
    createBillWindow();
  });
});

ipcMain.on('fetch-customers', (event) => {
  db('customers').select().then(customers => {
    event.sender.send('customers', customers);
  });
});

ipcMain.on('fetch-tires', (event) => {
  db('tires').select().then(tires => {
    event.sender.send('tires', tires);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
