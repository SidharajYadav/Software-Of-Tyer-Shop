function addCustomer() {
    const customerName = document.getElementById('customer-name').value;
    const customerContact = document.getElementById('customer-contact').value;
    const customerCity = document.getElementById('customer-city').value;
    window.electron.addCustomer({ name: customerName, contactNumber: customerContact, city: customerCity });
  }
  
  function addTire() {
    const tireBrand = document.getElementById('tire-brand').value;
    const tireSize = document.getElementById('tire-size').value;
    const tireQuantity = document.getElementById('tire-quantity').value;
    const tirePrice = document.getElementById('tire-price').value;
    window.electron.addTire({ brand: tireBrand, size: tireSize, quantity: tireQuantity, price: tirePrice });
  }
  
  function generateBill() {
    const customerName = document.getElementById('customer-name').value;
    const customerContact = document.getElementById('customer-contact').value;
    const customerCity = document.getElementById('customer-city').value;
  
    window.electron.getCustomers(customers => {
      const customer = customers.find(c => c.name === customerName && c.contactNumber === customerContact && c.city === customerCity);
      if (customer) {
        window.electron.getTires(tires => {
          const billTires = tires.map(tire => ({
            id: tire.id,
            name: tire.brand, // Display brand instead of name
            size: tire.size,
            quantity: tire.quantity,
            price: tire.price,
            totalPrice: tire.price * tire.quantity,
          }));
          window.electron.generateBill(customer, billTires);
        });
      }
    });
  }
  
  function viewOwner() {
    window.electron.openOwnerWindow();
  }
  
  if (document.getElementById('stock-list')) {
    window.electron.getTires(tires => {
      const stockList = document.getElementById('stock-list');
      stockList.innerHTML = '';
      tires.forEach(tire => {
        const listItem = document.createElement('li');
        listItem.textContent = `${tire.brand} - ${tire.size} - ${tire.quantity} in stock`;
        stockList.appendChild(listItem);
      });
    });
  }
  
  if (document.getElementById('bill-details')) {
    window.electron.getBillDetails((customer, tires) => {
      const billDetails = document.getElementById('bill-details');
      let billHTML = `<p><strong>Shop Name:</strong> Your Shop Name</p>`; // Replace with your shop's name
      billHTML += `<p><strong>Shop Contact:</strong> Your Shop Contact</p>`; // Replace with your shop's contact
      billHTML += `<p><strong>Customer Name:</strong> ${customer.name}</p>`;
      billHTML += `<p><strong>Contact Number:</strong> ${customer.contactNumber}</p>`;
      billHTML += `<p><strong>City:</strong> ${customer.city}</p>`;
      billHTML += '<h2>Tires Purchased</h2>';
      tires.forEach(tire => {
        billHTML += `<p>${tire.quantity} x ${tire.brand} - ${tire.size} - Price: $${tire.price} - Total: $${tire.totalPrice}</p>`;
      });
      billDetails.innerHTML = billHTML;
    });
  }
  