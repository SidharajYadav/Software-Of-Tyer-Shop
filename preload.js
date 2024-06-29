const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openOwnerWindow: () => ipcRenderer.send('open-owner-window'),
  generateBill: (customer, tires) => ipcRenderer.send('generate-bill', customer, tires),
  addCustomer: (customer) => ipcRenderer.send('add-customer', customer),
  addTire: (tire) => ipcRenderer.send('add-tire', tire),
  getCustomers: (callback) => ipcRenderer.on('customers', (event, data) => callback(data)),
  getTires: (callback) => ipcRenderer.on('tires', (event, data) => callback(data)),
  getBillDetails: (callback) => ipcRenderer.on('bill-details', (event, data) => callback(data)),
});
