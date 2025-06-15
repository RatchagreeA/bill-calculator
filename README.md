# Bill Calculator

A TypeScript-based bill calculator application that allows you to split bills among multiple people.

## Features

- ✅ Create and manage multiple bills
- ✅ Add multiple persons to each bill
- ✅ Add items with prices
- ✅ Select which persons split each item
- ✅ Automatic calculation of amounts owed
- ✅ Detailed summary table with breakdown

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bill-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development mode**
   ```bash
   npm run dev
   ```
   Opens at http://localhost:8080

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Serve built files**
   ```bash
   npm start
   ```

## Usage

1. **Create a Bill**: Enter a bill name and click "Create Bill"
2. **Add Persons**: Add people who will be splitting the bill
3. **Add Items**: Add items with their prices
4. **Select Dividers**: Click person buttons under each item to select who splits that item
5. **View Summary**: See the calculated amounts each person owes

## Project Structure

```
src/
├── types.ts           # TypeScript interfaces and types
├── BillCalculator.ts  # Core business logic
├── BillCalculatorUI.ts # User interface logic
└── main.ts           # Application entry point
```

## Technologies Used

- TypeScript
- Webpack
- HTML5/CSS3
- No external UI frameworks (vanilla implementation)
