import { Bill, Person, Item, PersonSummary } from './types';

export class BillCalculator {
  private bills: Bill[] = [];

  // Create a new bill
  createBill(name: string): string {
    const billId = this.generateId();
    const newBill: Bill = {
      id: billId,
      name,
      persons: [],
      items: []
    };
    this.bills.push(newBill);
    return billId;
  }

  // Get all bills
  getBills(): Bill[] {
    return this.bills;
  }

  // Get a specific bill
  getBill(billId: string): Bill | undefined {
    return this.bills.find(bill => bill.id === billId);
  }

  // Delete a bill
  deleteBill(billId: string): boolean {
    const billIndex = this.bills.findIndex(bill => bill.id === billId);
    if (billIndex === -1) return false;

    this.bills.splice(billIndex, 1);
    return true;
  }

  // Add person to a bill
  addPerson(billId: string, name: string): boolean {
    const bill = this.getBill(billId);
    if (!bill) return false;

    const personId = this.generateId();
    const newPerson: Person = {
      id: personId,
      name
    };
    bill.persons.push(newPerson);
    return true;
  }

  // Add item to a bill
  addItem(billId: string, name: string, price: number): boolean {
    const bill = this.getBill(billId);
    if (!bill) return false;

    const itemId = this.generateId();
    const newItem: Item = {
      id: itemId,
      name,
      price,
      dividers: []
    };
    bill.items.push(newItem);
    return true;
  }

  // Toggle person as divider for an item
  togglePersonAsDivider(billId: string, itemId: string, personId: string): boolean {
    const bill = this.getBill(billId);
    if (!bill) return false;

    const item = bill.items.find(item => item.id === itemId);
    if (!item) return false;

    const person = bill.persons.find(person => person.id === personId);
    if (!person) return false;

    const dividerIndex = item.dividers.indexOf(personId);
    if (dividerIndex === -1) {
      item.dividers.push(personId);
    } else {
      item.dividers.splice(dividerIndex, 1);
    }
    return true;
  }

  // Calculate summary for each person in a bill
  calculateBillSummary(billId: string): PersonSummary[] {
    const bill = this.getBill(billId);
    if (!bill) return [];

    const summaries: PersonSummary[] = [];

    bill.persons.forEach(person => {
      const summary: PersonSummary = {
        personId: person.id,
        personName: person.name,
        totalAmount: 0,
        itemBreakdown: []
      };

      bill.items.forEach(item => {
        if (item.dividers.includes(person.id)) {
          const splitAmount = item.price / item.dividers.length;
          summary.totalAmount += splitAmount;
          summary.itemBreakdown.push({
            itemName: item.name,
            itemPrice: item.price,
            splitAmount,
            splitWith: item.dividers.length
          });
        }
      });

      summaries.push(summary);
    });

    return summaries;
  }

  // Remove person from bill
  removePerson(billId: string, personId: string): boolean {
    const bill = this.getBill(billId);
    if (!bill) return false;

    const personIndex = bill.persons.findIndex(person => person.id === personId);
    if (personIndex === -1) return false;

    // Remove person from all item dividers
    bill.items.forEach(item => {
      const dividerIndex = item.dividers.indexOf(personId);
      if (dividerIndex !== -1) {
        item.dividers.splice(dividerIndex, 1);
      }
    });

    // Remove person from bill
    bill.persons.splice(personIndex, 1);
    return true;
  }

  // Remove item from bill
  removeItem(billId: string, itemId: string): boolean {
    const bill = this.getBill(billId);
    if (!bill) return false;

    const itemIndex = bill.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;

    bill.items.splice(itemIndex, 1);
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
