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

            <!-- Interactive Summary Table -->
            <div class="subsection">
              <div class="summary-header">
                <h3>Payment Summary & Management</h3>
                <div class="action-buttons">
                  <button id="addPersonBtn" class="add-person-btn-external" onclick="billUI.showPersonModal()" style="display: none;">
                    + Add Person
                  </button>
                  <button id="addItemBtn" class="add-item-btn-external" onclick="billUI.showItemModal()" style="display: none;">
                    + Add Item
                  </button>
                </div>
              </div>
              <p style="color: #6c757d; font-size: 14px; margin-bottom: 15px;">
                <strong>Instructions:</strong> Use "Add Person" and "Add Item" buttons to manage your bill. Check boxes to include a person in splitting an item's cost. 
                Use "Delete" buttons to remove people or items.
              </p>
              <div id="summaryTable"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hidden input for adding person -->
      <div id="personInputModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h4>Add New Person</h4>
          <div class="form-group">
            <input type="text" id="modalPersonName" placeholder="Enter person name" style="width: 200px;">
          </div>
          <div style="margin-top: 15px;">
            <button onclick="billUI.addPersonFromModal()" style="margin-right: 10px;">Add Person</button>
            <button onclick="billUI.closePersonModal()" style="background-color: #6c757d;">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Hidden input for adding item -->
      <div id="itemInputModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 300px;">
          <h4>Add New Item</h4>
          <div class="form-group">
            <input type="text" id="modalItemName" placeholder="Enter item name" style="width: 100%; margin-bottom: 10px;">
            <input type="number" id="modalItemPrice" placeholder="Enter price" step="0.01" style="width: 100%;">
          </div>
          <div style="margin-top: 15px;">
            <button onclick="billUI.addItemFromModal()" style="margin-right: 10px;">Add Item</button>
            <button onclick="billUI.closeItemModal()" style="background-color: #6c757d;">Cancel</button>
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
        
        /* Bills List - Horizontal Layout */
        #billsList {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 15px;
        }
        .bill-item { 
          flex: 1 1 300px;
          min-width: 280px;
          max-width: 350px;
          padding: 15px; 
          background-color: #e9ecef; 
          border-radius: 8px; 
          cursor: pointer; 
          display: flex; 
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }
        .bill-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .bill-item.active { 
          background-color: #007bff; 
          color: white; 
          border-color: #0056b3;
        }
        .bill-item-content { 
          flex-grow: 1; 
          margin-bottom: 10px;
        }
        .bill-item-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .bill-item-stats {
          font-size: 12px;
          line-height: 1.4;
        }
        .bill-item-actions { 
          display: flex; 
          justify-content: flex-end;
          margin-top: 10px;
        }
        
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
        
        /* Summary header with action buttons */
        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .action-buttons {
          display: flex;
          gap: 10px;
        }
        .add-person-btn-external {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: normal;
        }
        .add-person-btn-external:hover { background-color: #218838; }
        .add-item-btn-external {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: normal;
        }
        .add-item-btn-external:hover { background-color: #0056b3; }
        
        /* Table Styles - Fixed borders and connections */
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 10px; 
          border: 1px solid #ddd;
        }
        th, td { 
          padding: 0; 
          text-align: center; 
          border: 1px solid #ddd; 
          font-size: 14px;
          vertical-align: middle;
          box-sizing: border-box;
        }
        th { 
          background-color: #f8f9fa; 
          font-weight: bold; 
          white-space: nowrap;
          border: 1px solid #ddd;
        }
        
        /* Person column styles - Full cell expansion */
        .person-header {
          background-color: #f8f9fa !important;
          font-weight: bold;
          min-width: 180px;
          width: 100%;
          height: 100%;
          padding: 12px;
          display: flex;
          align-items: center;
          text-align: left;
          border: none;
          margin: 0;
          box-sizing: border-box;
        }
        .person-row-cell {
          background-color: #f8f9fa !important;
          font-weight: bold;
          min-width: 180px;
          width: 100%;
          height: 100%;
          padding: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
          border: none;
          margin: 0;
          box-sizing: border-box;
        }
        .person-name-column { 
          text-align: left !important; 
          font-weight: bold; 
          background-color: #f8f9fa !important;
          min-width: 180px;
          border: 1px solid #ddd;
          padding: 12px;
        }
        
        /* Item column styles */
        .item-header {
          background-color: #f8f9fa !important;
          font-weight: bold;
          min-width: 120px;
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        .item-header-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .item-name-price {
          text-align: center;
          line-height: 1.2;
        }
        .item-delete-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 2px 6px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 10px;
          font-weight: normal;
        }
        .item-delete-btn:hover { background-color: #c82333; }
        
        /* Total column styles */
        .total-column {
          background-color: #e9ecef !important;
          font-weight: bold;
          min-width: 100px;
          border: 1px solid #ddd;
          padding: 12px;
        }
        .total-row { 
          font-weight: bold; 
          background-color: #e9ecef !important;
        }
        .total-row td {
          background-color: #e9ecef !important;
          border: 1px solid #ddd;
          padding: 12px;
        }
        
        /* Checkbox cell styles */
        .checkbox-cell {
          background-color: #fff !important;
          padding: 12px;
          border: 1px solid #ddd;
        }
        
        .person-name {
          flex-grow: 1;
        }
        .person-delete-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
          margin-left: 10px;
          flex-shrink: 0;
        }
        .person-delete-btn:hover { background-color: #c82333; }
        .add-person-btn {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 10px;
          font-weight: normal;
          flex-shrink: 0;
        }
        .add-person-btn:hover { background-color: #218838; }
        .empty-cell {
          background-color: #f8f9fa;
          color: #6c757d;
          font-style: italic;
        }
        .amount-cell {
          font-weight: 500;
          background-color: #e8f5e8;
        }
        .divider-checkbox {
          transform: scale(1.2);
          cursor: pointer;
        }
        .item-info {
          display: inline-block;
          margin: 5px;
          padding: 5px 10px;
          background-color: #e9ecef;
          border-radius: 3px;
          font-size: 12px;
        }
        .remove-btn { 
          background-color: #dc3545; 
          color: white; 
          border: none; 
          padding: 3px 8px; 
          border-radius: 3px; 
          cursor: pointer; 
          margin-left: 8px;
          font-size: 11px;
        }
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
          flex: 1 1 100%;
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
        .list-container {
          margin-top: 10px;
        }
        .empty-persons-message {
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
          font-style: italic;
          border: 2px dashed #ddd;
          border-radius: 8px;
          margin: 20px 0;
        }
        .empty-items-message {
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
          font-style: italic;
          border: 2px dashed #ddd;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        /* Responsive design for smaller screens */
        @media (max-width: 768px) {
          #billsList {
            flex-direction: column;
          }
          .bill-item {
            max-width: none;
          }
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
    this.updateSummaryTable();
  }

  deleteBill(billId: string): void {
    const bill = this.calculator.getBill(billId);
    if (!bill) return;

    const confirmMessage = `Are you sure you want to delete "${bill.name}"?\n\nThis will permanently remove:\n- ${bill.persons.length} person(s)\n- ${bill.items.length} item(s)\n- All associated data\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      const success = this.calculator.deleteBill(billId);
      if (success) {
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

  showPersonModal(): void {
    document.getElementById('personInputModal')!.style.display = 'block';
    setTimeout(() => document.getElementById('modalPersonName')!.focus(), 100);
  }

  closePersonModal(): void {
    document.getElementById('personInputModal')!.style.display = 'none';
    (document.getElementById('modalPersonName') as HTMLInputElement).value = '';
  }

  addPersonFromModal(): void {
    if (!this.currentBillId) return;

    const personNameInput = document.getElementById('modalPersonName') as HTMLInputElement;
    const personName = personNameInput.value.trim();
    
    if (!personName) {
      alert('Please enter a person name');
      return;
    }

    this.calculator.addPerson(this.currentBillId, personName);
    this.closePersonModal();
    this.updateSummaryTable();
  }

  showItemModal(): void {
    document.getElementById('itemInputModal')!.style.display = 'block';
    setTimeout(() => document.getElementById('modalItemName')!.focus(), 100);
  }

  closeItemModal(): void {
    document.getElementById('itemInputModal')!.style.display = 'none';
    (document.getElementById('modalItemName') as HTMLInputElement).value = '';
    (document.getElementById('modalItemPrice') as HTMLInputElement).value = '';
  }

  addItemFromModal(): void {
    if (!this.currentBillId) return;

    const itemNameInput = document.getElementById('modalItemName') as HTMLInputElement;
    const itemPriceInput = document.getElementById('modalItemPrice') as HTMLInputElement;
    
    const itemName = itemNameInput.value.trim();
    const itemPrice = parseFloat(itemPriceInput.value);
    
    if (!itemName || isNaN(itemPrice) || itemPrice <= 0) {
      alert('Please enter valid item name and price');
      return;
    }

    this.calculator.addItem(this.currentBillId, itemName, itemPrice);
    this.closeItemModal();
    this.updateSummaryTable();
  }

  addItem(): void {
    // This method is kept for backward compatibility but now redirects to modal
    this.showItemModal();
  }

  toggleDividerFromTable(itemId: string, personId: string): void {
    if (!this.currentBillId) return;

    this.calculator.togglePersonAsDivider(this.currentBillId, itemId, personId);
    this.updateSummaryTable();
  }

  removePerson(personId: string): void {
    if (!this.currentBillId) return;

    const bill = this.calculator.getBill(this.currentBillId);
    const person = bill?.persons.find(p => p.id === personId);
    
    if (confirm(`Remove "${person?.name}" from this bill?`)) {
      this.calculator.removePerson(this.currentBillId, personId);
      this.updateSummaryTable();
    }
  }

  removeItem(itemId: string): void {
    if (!this.currentBillId) return;

    const bill = this.calculator.getBill(this.currentBillId);
    const item = bill?.items.find(i => i.id === itemId);
    
    if (confirm(`Remove "${item?.name}" ($${item?.price.toFixed(2)}) from this bill?`)) {
      this.calculator.removeItem(this.currentBillId, itemId);
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
            <div class="bill-item-title">${bill.name}</div>
            <div class="bill-item-stats" style="color: ${bill.id === this.currentBillId ? '#ffffff' : '#6c757d'};">
              👥 ${bill.persons.length} person(s)<br>
              🧾 ${bill.items.length} item(s)<br>
              💰 Total: $${totalAmount.toFixed(2)}
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

  private updateSummaryTable(): void {
    if (!this.currentBillId) return;

    const bill = this.calculator.getBill(this.currentBillId);
    const summaryTable = document.getElementById('summaryTable')!;
    const addPersonBtn = document.getElementById('addPersonBtn')!;
    const addItemBtn = document.getElementById('addItemBtn')!;
    
    if (!bill) {
      summaryTable.innerHTML = '<div class="no-data-message">Bill not found.</div>';
      addPersonBtn.style.display = 'none';
      addItemBtn.style.display = 'none';
      return;
    }

    // Always show both buttons when bill is selected
    addPersonBtn.style.display = 'inline-block';
    addItemBtn.style.display = 'inline-block';

    if (bill.items.length === 0) {
      summaryTable.innerHTML = `
        <div class="no-data-message">
          No items to split yet. Add items first to see the payment summary.
        </div>
      `;
      return;
    }

    // If no persons, show special message with add person option
    if (bill.persons.length === 0) {
      summaryTable.innerHTML = `
        <div class="empty-persons-message">
          <h4>No persons added yet</h4>
          <p>Add people to split the bill costs</p>
          <p style="color: #28a745; font-weight: bold;">↗ Use the "Add Person" button above</p>
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
              <th style="padding: 0;">
                <div class="person-header">
                  Person
                </div>
              </th>
              ${bill.items.map(item => `
                <th class="item-header">
                  <div class="item-header-content">
                    <div class="item-name-price">
                      ${item.name}<br>
                      <small style="font-weight: normal; color: #6c757d;">($${item.price.toFixed(2)})</small>
                    </div>
                    <button class="item-delete-btn" onclick="billUI.removeItem('${item.id}')" title="Delete ${item.name}">
                      Delete
                    </button>
                  </div>
                </th>
              `).join('')}
              <th class="total-column">Total</th>
            </tr>
          </thead>
          <tbody>
            ${bill.persons.map(person => `
              <tr>
                <td style="padding: 0;">
                  <div class="person-row-cell">
                    <span class="person-name">${person.name}</span>
                    <button class="person-delete-btn" onclick="billUI.removePerson('${person.id}')">
                      Delete
                    </button>
                  </div>
                </td>
                ${bill.items.map(item => {
                  const amount = matrix[person.id][item.id];
                  const isChecked = item.dividers.includes(person.id);
                  
                  return `
                    <td class="checkbox-cell">
                      <input type="checkbox" 
                             class="divider-checkbox" 
                             ${isChecked ? 'checked' : ''} 
                             onchange="billUI.toggleDividerFromTable('${item.id}', '${person.id}')"
                             id="checkbox_${person.id}_${item.id}">
                      <br>
                      <small style="color: ${amount > 0 ? '#28a745' : '#6c757d'}; font-weight: ${amount > 0 ? 'bold' : 'normal'};">
                        ${amount > 0 ? `$${amount.toFixed(2)}` : '-'}
                      </small>
                    </td>
                  `;
                }).join('')}
                <td class="total-column">$${personTotals[person.id].toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td class="person-name-column">Total</td>
              ${bill.items.map(item => `
                <td class="total-column">$${itemTotals[item.id].toFixed(2)}</td>
              `).join('')}
              <td class="total-column">$${grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    // Add keyboard support for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && document.getElementById('personInputModal')!.style.display === 'block') {
        this.addPersonFromModal();
      }
      if (e.key === 'Enter' && document.getElementById('itemInputModal')!.style.display === 'block') {
        this.addItemFromModal();
      }
      if (e.key === 'Escape' && document.getElementById('personInputModal')!.style.display === 'block') {
        this.closePersonModal();
      }
      if (e.key === 'Escape' && document.getElementById('itemInputModal')!.style.display === 'block') {
        this.closeItemModal();
      }
    });
  }
}
