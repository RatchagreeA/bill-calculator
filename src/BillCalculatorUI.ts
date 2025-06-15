import { BillCalculator } from './BillCalculator';
import { Bill, PersonSummary } from './types';

export class BillCalculatorUI {
  private calculator: BillCalculator;
  private currentBillId: string | null = null;

  constructor() {
    this.calculator = new BillCalculator();
    this.initializeUI();
  }

  private initializeUI(): void {
    document.body.innerHTML = `
      <div class="container">
        <h1>Bill Calculator</h1>
        
        <!-- Bill Management -->
        <div class="section">
          <h2>Bills</h2>
          <div class="form-group">
            <input type="text" id="billName" placeholder="Enter bill name">
            <button onclick="billUI.createNewBill()">Create Bill</button>
          </div>
          <div id="billsList"></div>
        </div>

        <!-- Current Bill Management -->
        <div id="currentBillSection" style="display: none;">
          <div class="section">
            <div class="bill-header">
              <h2 id="currentBillTitle">Current Bill</h2>
              <button class="delete-bill-btn" onclick="billUI.deleteCurrentBill()">Delete Bill</button>
            </div>
            
            <!-- Add Person -->
            <div class="subsection">
              <h3>Add Person</h3>
              <div class="form-group">
                <input type="text" id="personName" placeholder="Enter person name">
                <button onclick="billUI.addPerson()">Add Person</button>
              </div>
            </div>

            <!-- Add Item -->
            <div class="subsection">
              <h3>Add Item</h3>
              <div class="form-group">
                <input type="text" id="itemName" placeholder="Enter item name">
                <input type="number" id="itemPrice" placeholder="Enter price" step="0.01">
                <button onclick="billUI.addItem()">Add Item</button>
              </div>
            </div>

            <!-- Items and Dividers -->
            <div class="subsection">
              <h3>Items & Dividers</h3>
              <div id="itemsList"></div>
            </div>

            <!-- Summary Table -->
            <div class="subsection">
              <h3>Payment Summary</h3>
              <div id="summaryTable"></div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
        .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .subsection { margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
        .form-group { margin-bottom: 10px; }
        .form-group input { margin-right: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
        .form-group button { padding: 8px 15px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .form-group button:hover { background-color: #0056b3; }
        .bill-item { 
          padding: 10px; 
          margin: 5px 0; 
          background-color: #e9ecef; 
          border-radius: 4px; 
          cursor: pointer; 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
        }
        .bill-item.active { background-color: #007bff; color: white; }
        .bill-item-content { flex-grow: 1; }
        .bill-item-actions { display: flex; gap: 10px; }
        .bill-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 20px; 
        }
        .delete-bill-btn { 
          background-color: #dc3545; 
          color: white; 
          border: none; 
          padding: 10px 20px; 
          border-radius: 4px; 
          cursor: pointer; 
          font-size: 14px;
        }
        .delete-bill-btn:hover { background-color: #c82333; }
        .item-row { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .divider-buttons { margin-top: 10px; }
        .divider-btn { margin: 2px; padding: 5px 10px; border: 1px solid #007bff; background-color: white; color: #007bff; border-radius: 3px; cursor: pointer; }
        .divider-btn.active { background-color: #007bff; color: white; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { 
          padding: 12px; 
          text-align: center; 
          border: 1px solid #ddd; 
          font-size: 14px;
        }
        th { 
          background-color: #f8f9fa; 
          font-weight: bold; 
          white-space: nowrap;
        }
        .person-name-column { 
          text-align: left !important; 
          font-weight: bold; 
          background-color: #f8f9fa;
          min-width: 120px;
        }
        .total-row { 
          font-weight: bold; 
          background-color: #e9ecef; 
        }
        .total-column {
          background-color: #e9ecef;
          font-weight: bold;
        }
        .empty-cell {
          background-color: #f8f9fa;
          color: #6c757d;
          font-style: italic;
        }
        .amount-cell {
          font-weight: 500;
        }
        .remove-btn { background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px; }
        .remove-btn:hover { background-color: #c82333; }
        .bill-delete-btn { 
          background-color: #dc3545; 
          color: white; 
          border: none; 
          padding: 5px 10px; 
          border-radius: 3px; 
          cursor: pointer; 
          font-size: 12px;
        }
        .bill-delete-btn:hover { background-color: #c82333; }
        .empty-state { 
          text-align: center; 
          padding: 40px; 
          color: #6c757d; 
          font-style: italic; 
        }
        .summary-table-container {
          overflow-x: auto;
          margin-top: 15px;
        }
        .no-data-message {
          text-align: center;
          padding: 20px;
          color: #6c757d;
          font-style: italic;
        }
      </style>
    `;

    // Make this instance globally available
    (window as any).billUI = this;
    this.updateBillsList();
  }

  createNewBill(): void {
    const billNameInput = document.getElementById('billName') as HTMLInputElement;
    const billName = billNameInput.value.trim();
    
    if (!billName) {
      alert('Please enter a bill name');
      return;
    }

    const billId = this.calculator.createBill(billName);
    billNameInput.value = '';
    this.updateBillsList();
    this.selectBill(billId);
  }

  selectBill(billId: string): void {
    this.currentBillId = billId;
    const bill = this.calculator.getBill(billId);
    if (!bill) return;

    document.getElementById('currentBillTitle')!.textContent = `Current Bill: ${bill.name}`;
    document.getElementById('currentBillSection')!.style.display = 'block';
    
    this.updateBillsList();
    this.updateItemsList();
    this.updateSummaryTable();
  }

  deleteBill(billId: string): void {
    const bill = this.calculator.getBill(billId);
    if (!bill) return;

    const confirmMessage = `Are you sure you want to delete "${bill.name}"?\n\nThis will permanently remove:\n- ${bill.persons.length} person(s)\n- ${bill.items.length} item(s)\n- All associated data\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      const success = this.calculator.deleteBill(billId);
      if (success) {
        // If we're deleting the currently selected bill, hide the current bill section
        if (this.currentBillId === billId) {
          this.currentBillId = null;
          document.getElementById('currentBillSection')!.style.display = 'none';
        }
        this.updateBillsList();
      } else {
        alert('Failed to delete bill. Please try again.');
      }
    }
  }

  deleteCurrentBill(): void {
    if (!this.currentBillId) return;
    this.deleteBill(this.currentBillId);
  }

  addPerson(): void {
    if (!this.currentBillId) return;

    const personNameInput = document.getElementById('personName') as HTMLInputElement;
    const personName = personNameInput.value.trim();
    
    if (!personName) {
      alert('Please enter a person name');
      return;
    }

    this.calculator.addPerson(this.currentBillId, personName);
    personNameInput.value = '';
    this.updateItemsList();
    this.updateSummaryTable();
  }

  addItem(): void {
    if (!this.currentBillId) return;

    const itemNameInput = document.getElementById('itemName') as HTMLInputElement;
    const itemPriceInput = document.getElementById('itemPrice') as HTMLInputElement;
    
    const itemName = itemNameInput.value.trim();
    const itemPrice = parseFloat(itemPriceInput.value);
    
    if (!itemName || isNaN(itemPrice) || itemPrice <= 0) {
      alert('Please enter valid item name and price');
      return;
    }

    this.calculator.addItem(this.currentBillId, itemName, itemPrice);
    itemNameInput.value = '';
    itemPriceInput.value = '';
    this.updateItemsList();
    this.updateSummaryTable();
  }

  toggleDivider(itemId: string, personId: string): void {
    if (!this.currentBillId) return;

    this.calculator.togglePersonAsDivider(this.currentBillId, itemId, personId);
    this.updateItemsList();
    this.updateSummaryTable();
  }

  removePerson(personId: string): void {
    if (!this.currentBillId) return;

    if (confirm('Are you sure you want to remove this person?')) {
      this.calculator.removePerson(this.currentBillId, personId);
      this.updateItemsList();
      this.updateSummaryTable();
    }
  }

  removeItem(itemId: string): void {
    if (!this.currentBillId) return;

    if (confirm('Are you sure you want to remove this item?')) {
      this.calculator.removeItem(this.currentBillId, itemId);
      this.updateItemsList();
      this.updateSummaryTable();
    }
  }

  private updateBillsList(): void {
    const billsList = document.getElementById('billsList')!;
    const bills = this.calculator.getBills();
    
    if (bills.length === 0) {
      billsList.innerHTML = '<div class="empty-state">No bills created yet. Create your first bill above!</div>';
      return;
    }

    billsList.innerHTML = bills.map(bill => {
      const totalAmount = this.calculator.calculateBillSummary(bill.id)
        .reduce((sum, summary) => sum + summary.totalAmount, 0);
      
      return `
        <div class="bill-item ${bill.id === this.currentBillId ? 'active' : ''}">
          <div class="bill-item-content" onclick="billUI.selectBill('${bill.id}')">
            <div><strong>${bill.name}</strong></div>
            <div style="font-size: 12px; color: ${bill.id === this.currentBillId ? '#ffffff' : '#6c757d'};">
              ${bill.persons.length} person(s) • ${bill.items.length} item(s) • Total: $${totalAmount.toFixed(2)}
            </div>
          </div>
          <div class="bill-item-actions">
            <button class="bill-delete-btn" onclick="event.stopPropagation(); billUI.deleteBill('${bill.id}')">
              Delete
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  private updateItemsList(): void {
    if (!this.currentBillId) return;

    const bill = this.calculator.getBill(this.currentBillId);
    if (!bill) return;

    const itemsList = document.getElementById('itemsList')!;
    
    itemsList.innerHTML = `
      ${bill.items.length === 0 ? '<p>No items added yet.</p>' : ''}
      ${bill.items.map(item => `
        <div class="item-row">
          <div>
            <strong>${item.name}</strong> - $${item.price.toFixed(2)}
            <button class="remove-btn" onclick="billUI.removeItem('${item.id}')">Remove</button>
          </div>
          <div class="divider-buttons">
            <strong>Split with:</strong>
            ${bill.persons.map(person => `
              <button class="divider-btn ${item.dividers.includes(person.id) ? 'active' : ''}"
                      onclick="billUI.toggleDivider('${item.id}', '${person.id}')">
                ${person.name}
              </button>
            `).join('')}
            ${bill.persons.length === 0 ? '<span>No persons added yet.</span>' : ''}
          </div>
          ${item.dividers.length > 0 ? `<div><small>Split ${item.dividers.length} ways = $${(item.price / item.dividers.length).toFixed(2)} each</small></div>` : ''}
        </div>
      `).join('')}
      
      ${bill.persons.length > 0 ? `
        <div style="margin-top: 20px;">
          <strong>Persons:</strong>
          ${bill.persons.map(person => `
            <span style="display: inline-block; margin: 5px; padding: 5px 10px; background-color: #e9ecef; border-radius: 3px;">
              ${person.name}
              <button class="remove-btn" style="margin-left: 5px; padding: 2px 5px; font-size: 12px;" onclick="billUI.removePerson('${person.id}')">×</button>
            </span>
          `).join('')}
        </div>
      ` : ''}
    `;
  }

  private updateSummaryTable(): void {
    if (!this.currentBillId) return;

    const bill = this.calculator.getBill(this.currentBillId);
    const summaryTable = document.getElementById('summaryTable')!;
    
    if (!bill) {
      summaryTable.innerHTML = '<div class="no-data-message">Bill not found.</div>';
      return;
    }

    if (bill.persons.length === 0 || bill.items.length === 0) {
      summaryTable.innerHTML = `
        <div class="no-data-message">
          ${bill.persons.length === 0 ? 'No persons added yet.' : ''}
          ${bill.items.length === 0 ? 'No items added yet.' : ''}
          ${bill.persons.length === 0 && bill.items.length === 0 ? 'Add persons and items to see the payment summary.' : ''}
        </div>
      `;
      return;
    }

    // Create matrix data structure
    const matrix: { [personId: string]: { [itemId: string]: number } } = {};
    const itemTotals: { [itemId: string]: number } = {};
    const personTotals: { [personId: string]: number } = {};

    // Initialize matrix and totals
    bill.persons.forEach(person => {
      matrix[person.id] = {};
      personTotals[person.id] = 0;
      bill.items.forEach(item => {
        matrix[person.id][item.id] = 0;
        if (!itemTotals[item.id]) {
          itemTotals[item.id] = 0;
        }
      });
    });

    // Fill matrix with calculated amounts
    bill.items.forEach(item => {
      if (item.dividers.length > 0) {
        const splitAmount = item.price / item.dividers.length;
        item.dividers.forEach(personId => {
          if (matrix[personId]) {
            matrix[personId][item.id] = splitAmount;
            personTotals[personId] += splitAmount;
            itemTotals[item.id] += splitAmount;
          }
        });
      }
    });

    const grandTotal = Object.values(personTotals).reduce((sum, total) => sum + total, 0);

    summaryTable.innerHTML = `
      <div class="summary-table-container">
        <table>
          <thead>
            <tr>
              <th class="person-name-column">Person</th>
              ${bill.items.map(item => `<th>${item.name}</th>`).join('')}
              <th class="total-column">Total</th>
            </tr>
          </thead>
          <tbody>
            ${bill.persons.map(person => `
              <tr>
                <td class="person-name-column">${person.name}</td>
                ${bill.items.map(item => {
                  const amount = matrix[person.id][item.id];
                  return `<td class="${amount > 0 ? 'amount-cell' : 'empty-cell'}">
                    ${amount > 0 ? `$${amount.toFixed(2)}` : '-'}
                  </td>`;
                }).join('')}
                <td class="total-column">$${personTotals[person.id].toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td class="person-name-column">Total</td>
              ${bill.items.map(item => `
                <td>$${itemTotals[item.id].toFixed(2)}</td>
              `).join('')}
              <td class="total-column">$${grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }
}
