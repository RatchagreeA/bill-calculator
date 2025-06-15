# Bill Calculator 📊

A modern, responsive web application for splitting bills among multiple people with an intuitive interface and powerful features.

![Bill Calculator Demo](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

## 🚀 Features

### Core Functionality
- **Multi-Bill Management**: Create and manage multiple bills simultaneously
- **Dynamic Person/Item Management**: Add people and items with real-time updates
- **Flexible Cost Splitting**: Choose who splits each item cost with checkbox interface
- **Smart Calculations**: Automatic calculation of individual amounts and totals
- **Interactive Summary Table**: Visual matrix showing who owes what for each item

### User Experience
- **🌙 Dark/Light Theme**: Toggle between themes with persistent preferences
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **⌨️ Keyboard Support**: Enter to submit forms, Escape to close modals
- **🎯 Intuitive Interface**: Clean, modern design with clear visual hierarchy

### Advanced Features
- **📷 Export to Image**: Generate high-quality PNG exports of bill summaries
- **💾 Local Storage**: Automatically saves theme preferences
- **🎨 Theme-Aware Export**: Exported images respect current theme selection
- **🔄 Real-time Updates**: Instant recalculation when splitting preferences change

## 🛠️ Technology Stack

### Core Technologies
- **TypeScript**: Static typing for enhanced code reliability
- **HTML5**: Modern semantic markup with Canvas API
- **CSS3**: Advanced styling with custom properties and responsive design
- **Vanilla JavaScript**: No external frameworks - pure web standards

### Key APIs & Features
- **Canvas API**: For generating exportable images
- **LocalStorage API**: Persistent user preferences
- **CSS Custom Properties**: Dynamic theming system
- **Flexbox & Grid**: Responsive layout systems
- **Media Queries**: Mobile-first responsive design

### Architecture Patterns
- **Object-Oriented Programming**: Clean separation of concerns
- **MVC Pattern**: Business logic separated from presentation
- **Event-Driven Architecture**: Reactive user interface
- **Module System**: ES6 imports/exports for code organization

## 📦 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bill-calculator.git
   cd bill-calculator
   ```

2. **Install dependencies** (if using TypeScript compiler)
   ```bash
   npm install -g typescript
   ```

3. **Compile TypeScript** (if needed)
   ```bash
   tsc src/*.ts --outDir dist --target ES2020 --module ESNext
   ```

4. **Serve the application**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

5. **Open in browser**
   ```
   http://localhost:8000
   ```

### File Structure
```
bill-calculator/
├── src/
│   ├── BillCalculator.ts      # Core business logic
│   ├── BillCalculatorUI.ts    # User interface layer
│   └── types.ts               # TypeScript interfaces
├── index.html                 # Main HTML file
├── README.md                  # Project documentation
└── package.json              # Project configuration
```

## 📖 Usage Guide

### Creating Your First Bill
1. **Enter a bill name** in the input field
2. **Click "Create Bill"** to initialize
3. **Add people** using the "+ Add Person" button
4. **Add items** with names and prices using "+ Add Item"
5. **Check boxes** to assign people to split specific items
6. **View real-time calculations** in the summary table

### Managing Bills
- **Switch between bills** by clicking on bill cards
- **Delete bills** using the delete button (with confirmation)
- **Export summaries** as images using the "📷 Export" button

### Advanced Usage
- **Theme Switching**: Click the theme toggle in the header
- **Keyboard Shortcuts**: 
  - `Enter` to submit forms
  - `Escape` to close modals
- **Mobile Support**: Full touch interface on mobile devices

## 🎯 Key Features Explained

### Interactive Summary Table
```
┌─────────────┬─────────┬─────────┬─────────┬─────────┐
│ Person      │ Item 1  │ Item 2  │ Item 3  │ Total   │
├─────────────┼─────────┼─────────┼─────────┼─────────┤
│ Alice       │ ✓ $5.00 │    -    │ ✓ $3.33 │ $8.33   │
│ Bob         │ ✓ $5.00 │ ✓ $4.00 │ ✓ $3.33 │ $12.33  │
│ Charlie     │    -    │ ✓ $4.00 │ ✓ $3.34 │ $7.34   │
├─────────────┼─────────┼─────────┼─────────┼─────────┤
│ Total       │ $10.00  │ $8.00   │ $10.00  │ $28.00  │
└─────────────┴─────────┴─────────┴─────────┴─────────┘
```

### Theme System
- **Auto-detection**: Respects system dark mode preference
- **Manual override**: Toggle button in header
- **Persistent**: Remembers choice across sessions
- **Export-aware**: Generated images match current theme

## 🎨 Customization

### Theme Colors
Customize colors by modifying CSS custom properties in `BillCalculatorUI.ts`:

```css
:root {
  --bg-primary: #ffffff;          /* Main background */
  --text-primary: #212529;        /* Primary text */
  --btn-primary: #007bff;         /* Primary buttons */
  --table-header-bg: #343a40;     /* Table headers */
}
```

### Responsive Breakpoints
```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

## 🚦 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 80+     | ✅ Full Support |
| Firefox | 75+     | ✅ Full Support |
| Safari  | 13+     | ✅ Full Support |
| Edge    | 80+     | ✅ Full Support |

## 🔧 Development

### Building from Source
```bash
# Compile TypeScript
tsc --watch

# Run development server
npm run dev
```

### Code Structure
- **`BillCalculator.ts`**: Core business logic and data management
- **`BillCalculatorUI.ts`**: UI components and user interactions
- **`types.ts`**: TypeScript interfaces and type definitions

### Adding Features
1. Add business logic to `BillCalculator` class
2. Update UI in `BillCalculatorUI` class
3. Add new types to `types.ts` if needed
4. Update styles in the CSS section

## 📸 Screenshots

### Light Theme
- Clean, professional interface
- High contrast for readability
- Intuitive button placement

### Dark Theme
- Easy on the eyes
- Modern dark aesthetic
- Consistent color scheme

### Mobile Interface
- Touch-friendly controls
- Responsive table layout
- Optimized for small screens

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes** with clear, commented code
4. **Add tests** if applicable
5. **Commit changes**: `git commit -m "Add new feature"`
6. **Push to branch**: `git push origin feature/new-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Ensure accessibility compliance
- Test across multiple browsers
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Modern CSS techniques for theming
- Canvas API for image generation
- TypeScript community for best practices
- Contributors and testers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/RatchagreeA/bill-calculator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/RatchagreeA/bill-calculator/discussions)
- **Email**: ratchagree@gmail.com

---

**Made with ❤️ using modern web technologies**

*Perfect for restaurants, shared expenses, group activities, and any situation where you need to split costs fairly among multiple people.*
