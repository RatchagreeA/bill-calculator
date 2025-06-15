import { Bill, PersonSummary } from './types';
export declare class BillCalculator {
    private bills;
    createBill(name: string): string;
    getBills(): Bill[];
    getBill(billId: string): Bill | undefined;
    deleteBill(billId: string): boolean;
    addPerson(billId: string, name: string): boolean;
    addItem(billId: string, name: string, price: number): boolean;
    togglePersonAsDivider(billId: string, itemId: string, personId: string): boolean;
    calculateBillSummary(billId: string): PersonSummary[];
    removePerson(billId: string, personId: string): boolean;
    removeItem(billId: string, itemId: string): boolean;
    private generateId;
}
//# sourceMappingURL=BillCalculator.d.ts.map