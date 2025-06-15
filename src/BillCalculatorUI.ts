import { BillCalculator } from './BillCalculator';
import { Bill, PersonSummary } from './types';

export class BillCalculatorUI {
  private calculator: BillCalculator;
  private currentBillId: string | null = null;
  private isDarkTheme: boolean;

  constructor() {
    this.calculator = new BillCalculator();
    // Load theme preference from localStorage
    this.isDarkTheme = localStorage.getItem('billCalculatorTheme') === 'dark' || 
                      (localStorage.getItem('billCalculatorTheme') === null && 
                       window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.initializeUI();
    this.applyTheme();
  }

  private initializeUI(): void {
    document.body.innerHTML = `
      <div class="container">
        <div class="app-header">
          <h1>Bill Calculator</h1>
          <button id="themeToggle" class="theme-toggle" onclick="billUI.toggleTheme()">
            <span class="theme-icon">🌙</span>
            <span class="theme-text">Dark</span>
          </button>
        </div>
        
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
              <p class="instructions-text">
                <strong>Instructions:</strong> Use "Add Person" and "Add Item" buttons to manage your bill. Check boxes to include a person in splitting an item's cost. 
                Use "Delete" buttons to remove people or items.
              </p>
              <div id="summaryTable"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hidden input for adding person -->
      <div id="personInputModal" class="modal-overlay">
        <div class="modal-content">
          <h4>Add New Person</h4>
          <div class="form-group">
            <input type="text" id="modalPersonName" placeholder="Enter person name" style="width: 200px;">
          </div>
          <div style="margin-top: 15px;">
            <button onclick="billUI.addPersonFromModal()" style="margin-right: 10px;">Add Person</button>
            <button onclick="billUI.closePersonModal()" class="secondary-btn">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Hidden input for adding item -->
      <div id="itemInputModal" class="modal-overlay">
        <div class="modal-content">
          <h4>Add New Item</h4>
          <div class="form-group">
            <input type="text" id="modalItemName" placeholder="Enter item name" style="width: 100%; margin-bottom: 10px;">
            <input type="number" id="modalItemPrice" placeholder="Enter price" step="0.01" style="width: 100%;">
          </div>
          <div style="margin-top: 15px;">
            <button onclick="billUI.addItemFromModal()" style="margin-right: 10px;">Add Item</button>
            <button onclick="billUI.closeItemModal()" class="secondary-btn">Cancel</button>
          </div>
        </div>
      </div>

      <style>
        :root {
          /* Light theme colors */
          --bg-primary: #ffffff;
          --bg-secondary: #f8f9fa;
          --bg-tertiary: #e9ecef;
          --text-primary: #212529;
          --text-secondary: #6c757d;
          --text-tertiary: #495057;
          --border-color: #dee2e6;
          --border-light: #e9ecef;
          --shadow: rgba(0, 0, 0, 0.1);
          
          /* Table colors - Light theme with better contrast */
          --table-bg: #ffffff;
          --table-header-bg: #343a40;
          --table-header-text: #ffffff;
          --table-row-odd: #f8f9fa;
          --table-row-even: #e9ecef;
          --table-row-hover: #dee2e6;
          --table-border: #495057;
          --table-person-bg: #6c757d;
          --table-person-text: #ffffff;
          --table-total-bg: #28a745;
          --table-total-text: #ffffff;
          
          /* Button colors */
          --btn-primary: #007bff;
          --btn-primary-hover: #0056b3;
          --btn-success: #28a745;
          --btn-success-hover: #218838;
          --btn-danger: #dc3545;
          --btn-danger-hover: #c82333;
          --btn-secondary: #6c757d;
          --btn-secondary-hover: #5a6268;
        }

        [data-theme="dark"] {
          /* Dark theme colors */
          --bg-primary: #1a1a1a;
          --bg-secondary: #2d2d2d;
          --bg-tertiary: #404040;
          --text-primary: #ffffff;
          --text-secondary: #cccccc;
          --text-tertiary: #aaaaaa;
          --border-color: #404040;
          --border-light: #555555;
          --shadow: rgba(0, 0, 0, 0.3);
          
          /* Table colors - Dark theme */
          --table-bg: #1f2937;
          --table-header-bg: #111827;
          --table-header-text: #f3f4f6;
          --table-row-odd: #374151;
          --table-row-even: #4b5563;
          --table-row-hover: #6b7280;
          --table-border: #374151;
          --table-person-bg: #374151;
          --table-person-text: #f9fafb;
          --table-total-bg: #059669;
          --table-total-text: #f0fff4;
          
          /* Button colors - keep same for consistency */
          --btn-primary: #007bff;
          --btn-primary-hover: #0056b3;
          --btn-success: #28a745;
          --btn-success-hover: #218838;
          --btn-danger: #ef4444;
          --btn-danger-hover: #dc2626;
          --btn-secondary: #6c757d;
          --btn-secondary-hover: #5a6268;
        }

        body {
          background-color: var(--bg-primary);
          color: var(--text-primary);
          transition: background-color 0.3s ease, color 0.3s ease;
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 20px; 
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--border-color);
        }

        .app-header h1 {
          margin: 0;
          color: var(--text-primary);
        }

        .theme-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .theme-toggle:hover {
          background-color: var(--border-color);
          transform: translateY(-1px);
        }

        .theme-icon {
          font-size: 16px;
          transition: transform 0.3s ease;
        }

        .section { 
          margin-bottom: 30px; 
          padding: 20px; 
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color); 
          border-radius: 8px; 
        }

        .subsection { 
          margin-bottom: 20px; 
          padding: 15px; 
          background-color: var(--bg-tertiary); 
          border-radius: 5px; 
        }

        .form-group { margin-bottom: 10px; }
        .form-group input { 
          margin-right: 10px; 
          padding: 8px; 
          border: 1px solid var(--border-color); 
          border-radius: 4px; 
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }
        .form-group button { 
          padding: 8px 15px; 
          background-color: var(--btn-primary); 
          color: white; 
          border: none; 
          border-radius: 4px; 
          cursor: pointer; 
        }
        .form-group button:hover { background-color: var(--btn-primary-hover); }

        .instructions-text {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 15px;
        }

        .secondary-btn {
          background-color: var(--btn-secondary) !important;
        }

        .secondary-btn:hover {
          background-color: var(--btn-secondary-hover) !important;
        }
        
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
          background-color: var(--bg-tertiary); 
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
          box-shadow: 0 4px 8px var(--shadow);
        }
        .bill-item.active { 
          background-color: var(--btn-primary); 
          color: white; 
          border-color: var(--btn-primary-hover);
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
          background-color: var(--btn-danger); 
          color: white; 
          border: none; 
          padding: 10px 20px; 
          border-radius: 4px; 
          cursor: pointer; 
          font-size: 14px;
        }
        .delete-bill-btn:hover { background-color: var(--btn-danger-hover); }
        
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
          background-color: var(--btn-success);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: normal;
        }
        .add-person-btn-external:hover { background-color: var(--btn-success-hover); }
        .add-item-btn-external {
          background-color: var(--btn-primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: normal;
        }
        .add-item-btn-external:hover { background-color: var(--btn-primary-hover); }
        
        /* Modal Styles */
        .modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          z-index: 1000;
        }

        .modal-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--bg-primary);
          color: var(--text-primary);
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px var(--shadow);
          border: 1px solid var(--border-color);
          min-width: 300px;
        }

        .modal-content h4 {
          margin-top: 0;
          color: var(--text-primary);
        }

        .modal-content input {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }
        
        /* Table Styles - Using CSS Variables */
        .summary-table-container {
          overflow-x: auto;
          margin-top: 15px;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px var(--shadow);
        }
        
        table { 
          width: 100%; 
          border-collapse: collapse; 
          background-color: var(--table-bg);
          color: var(--table-person-text);
          border-radius: 12px;
          overflow: hidden;
        }
        
        th, td { 
          padding: 16px 12px;
          text-align: center; 
          border: none;
          font-size: 14px;
          vertical-align: middle;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        
        th { 
          background-color: var(--table-header-bg);
          color: var(--table-header-text);
          font-weight: 600; 
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
          border-bottom: 1px solid var(--table-border);
        }
        
        /* Striped Columns Effect */
        td:nth-child(odd) {
          background-color: var(--table-row-odd);
        }
        
        td:nth-child(even) {
          background-color: var(--table-row-even);
        }
        
        /* Hover effects */
        tbody tr:hover td {
          background-color: var(--table-row-hover) !important;
          transform: scale(1.01);
        }
        
        /* Person column styles */
        .person-header {
          background-color: var(--table-header-bg) !important;
          color: var(--table-header-text) !important;
          font-weight: 600;
          min-width: 180px;
          width: 100%;
          height: 100%;
          padding: 16px;
          display: flex;
          align-items: center;
          text-align: left;
          border: none;
          margin: 0;
          box-sizing: border-box;
        }
        
        /* Person row cell - Full expansion */
        .person-row-cell {
          background-color: var(--table-person-bg) !important;
          color: var(--table-person-text) !important;
          font-weight: 500;
          min-width: 180px;
          width: 100%;
          height: 100%;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
          border: none;
          margin: 0;
          box-sizing: border-box;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        
        /* Parent td for person row */
        .person-cell {
          padding: 0 !important;
          position: relative;
          min-width: 180px;
          background-color: var(--table-person-bg) !important;
        }
        
        .person-name-column { 
          text-align: left !important; 
          font-weight: 600; 
          background-color: var(--table-person-bg) !important;
          color: var(--table-person-text) !important;
          min-width: 180px;
          padding: 0 !important;
          position: relative;
        }
        
        /* Item column styles */
        .item-header {
          background-color: var(--table-header-bg) !important;
          color: var(--table-header-text) !important;
          font-weight: 600;
          min-width: 120px;
          padding: 12px 8px;
          text-align: center;
        }
        
        .item-header-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .item-name-price {
          text-align: center;
          line-height: 1.3;
          color: var(--table-header-text);
        }
        
        .item-delete-btn {
          background-color: var(--btn-danger);
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        .item-delete-btn:hover { 
          background-color: var(--btn-danger-hover); 
          transform: scale(1.05);
        }
        
        /* Total column styles */
        .total-column {
          background-color: var(--table-total-bg) !important;
          color: var(--table-total-text) !important;
          font-weight: 700;
          min-width: 100px;
          padding: 16px;
        }
        
        .total-row { 
          font-weight: 700; 
          background-color: var(--table-total-bg) !important;
        }
        
        .total-row td {
          background-color: var(--table-total-bg) !important;
          color: var(--table-total-text) !important;
          padding: 16px;
          font-weight: 600;
        }
        
        /* Checkbox cell styles */
        .checkbox-cell {
          padding: 16px;
          position: relative;
        }
        
        .divider-checkbox {
          transform: scale(1.3);
          cursor: pointer;
          accent-color: var(--btn-success);
          margin-bottom: 8px;
        }
        
        .checkbox-cell small {
          display: block;
          font-size: 11px;
          font-weight: 500;
          margin-top: 4px;
        }
        
        .person-name {
          flex-grow: 1;
          color: var(--table-person-text);
        }
        
        .person-delete-btn {
          background-color: var(--btn-danger);
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
          margin-left: 12px;
          flex-shrink: 0;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .person-delete-btn:hover { 
          background-color: var(--btn-danger-hover); 
          transform: scale(1.05);
        }
        
        .add-person-btn {
          background-color: var(--btn-success);
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 500;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .add-person-btn:hover { 
          background-color: var(--btn-success-hover); 
          transform: scale(1.05);
        }
        
        .empty-cell {
          background-color: var(--table-row-even);
          color: var(--text-secondary);
          font-style: italic;
        }
        
        .amount-cell {
          font-weight: 600;
          background-color: var(--btn-success);
          color: white;
        }
        
        .item-info {
          display: inline-block;
          margin: 5px;
          padding: 6px 12px;
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .remove-btn { 
          background-color: var(--btn-danger); 
          color: white; 
          border: none; 
          padding: 4px 10px; 
          border-radius: 6px; 
          cursor: pointer; 
          margin-left: 8px;
          font-size: 11px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .remove-btn:hover { 
          background-color: var(--btn-danger-hover); 
          transform: scale(1.05);
        }
        
        .bill-delete-btn { 
          background-color: var(--btn-danger); 
          color: white; 
          border: none; 
          padding: 5px 10px; 
          border-radius: 3px; 
          cursor: pointer; 
          font-size: 12px;
        }
        .bill-delete-btn:hover { background-color: var(--btn-danger-hover); }
        
        .empty-state { 
          text-align: center; 
          padding: 40px; 
          color: var(--text-secondary); 
          font-style: italic; 
          flex: 1 1 100%;
        }
        
        .no-data-message {
          text-align: center;
          padding: 30px;
          color: var(--text-secondary);
          font-style: italic;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          border: 2px dashed var(--border-color);
        }
        
        .list-container {
          margin-top: 10px;
        }
        
        .empty-persons-message {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
          font-style: italic;
          border: 2px dashed var(--border-color);
          border-radius: 8px;
          margin: 20px 0;
          background-color: var(--bg-secondary);
        }
        
        .empty-items-message {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
          font-style: italic;
          border: 2px dashed var(--border-color);
          border-radius: 8px;
          margin: 20px 0;
          background-color: var(--bg-secondary);
        }
        
        /* Responsive design for smaller screens */
        @media (max-width: 768px) {
          .app-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          #billsList {
            flex-direction: column;
          }
          .bill-item {
            max-width: none;
          }
          
          th, td {
            padding: 12px 8px;
            font-size: 13px;
          }
          
          .person-header, .person-row-cell {
            min-width: 140px;
            padding: 12px;
          }
          
          .item-header {
            min-width: 100px;
            padding: 8px 6px;
          }
        }
      </style>
    `;

    // Make this instance globally available
    (window as any).billUI = this;
    this.updateBillsList();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('billCalculatorTheme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');

    if (this.isDarkTheme) {
      body.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeText) themeText.textContent = 'Light';
    } else {
      body.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeText) themeText.textContent = 'Dark';
    }
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
            <div class="bill-item-stats" style="color: ${bill.id === this.currentBillId ? '#ffffff' : 'var(--text-secondary)'};">
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
          <p style="color: var(--btn-success); font-weight: bold;">↗ Use the "Add Person" button above</p>
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
                      <small style="font-weight: normal; color: var(--text-secondary);">($${item.price.toFixed(2)})</small>
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
                <td class="person-cell">
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
                      <small style="color: ${amount > 0 ? 'var(--btn-success)' : 'var(--text-secondary)'}; font-weight: ${amount > 0 ? '600' : 'normal'};">
                        ${amount > 0 ? `$${amount.toFixed(2)}` : '-'}
                      </small>
                    </td>
                  `;
                }).join('')}
                <td class="total-column">$${personTotals[person.id].toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td class="person-cell">
                <div class="person-row-cell" style="background-color: var(--table-total-bg) !important;">
                  <span class="person-name" style="color: var(--table-total-text);">Total</span>
                </div>
              </td>
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
      if (e.key === 'Escape') {
        this.closePersonModal();
        this.closeItemModal();
      }
    });
  }
}
