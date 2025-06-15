export interface Person {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  dividers: string[]; // Person IDs who will split this item
}

export interface Bill {
  id: string;
  name: string;
  persons: Person[];
  items: Item[];
}

export interface PersonSummary {
  personId: string;
  personName: string;
  totalAmount: number;
  itemBreakdown: {
    itemName: string;
    itemPrice: number;
    splitAmount: number;
    splitWith: number;
  }[];
}
