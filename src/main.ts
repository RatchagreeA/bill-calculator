import { BillCalculatorUI } from './BillCalculatorUI';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new BillCalculatorUI();
});

// Export for global access
(window as any).BillCalculatorUI = BillCalculatorUI;
