export declare class BillCalculatorUI {
    private calculator;
    private currentBillId;
    private isDarkTheme;
    constructor();
    private initializeUI;
    toggleTheme(): void;
    private applyTheme;
    createNewBill(): void;
    selectBill(billId: string): void;
    deleteBill(billId: string): void;
    deleteCurrentBill(): void;
    showPersonModal(): void;
    closePersonModal(): void;
    addPersonFromModal(): void;
    showItemModal(): void;
    closeItemModal(): void;
    addItemFromModal(): void;
    addItem(): void;
    toggleDividerFromTable(itemId: string, personId: string): void;
    removePerson(personId: string): void;
    removeItem(itemId: string): void;
    private updateBillsList;
    private updateSummaryTable;
    exportTableToImage(): void;
    private createTableImageCanvas;
}
//# sourceMappingURL=BillCalculatorUI.d.ts.map