# Call of Cthulhu Character Sheet

An Angular v20 application designed for Android tablets to help players track their Call of Cthulhu RPG characters. Built with Tailwind CSS for a responsive, tablet-optimized experience.

![Character Sheet Screenshot](https://github.com/user-attachments/assets/7aed33be-483d-420e-b9dd-b711a6f92e25)

## Features

- **Complete Character Management**: Track all essential character information including characteristics, skills, equipment, and notes
- **Tablet-Optimized Design**: Responsive layout specifically designed for Android tablet use
- **Call of Cthulhu Theme**: Custom color scheme and styling that fits the horror RPG aesthetic
- **Auto-Calculated Attributes**: Automatically calculates derived stats like Hit Points and Magic Points
- **Comprehensive Skills List**: Includes all core Call of Cthulhu skills with customizable skill additions
- **Local Storage**: Save and load characters using browser localStorage
- **Real-time Updates**: All changes are reflected immediately in derived attributes

## Technical Stack

- **Angular v20.3.2**: Latest Angular framework with standalone components
- **Tailwind CSS v3**: Utility-first CSS framework for rapid UI development
- **TypeScript**: Strongly typed JavaScript for better development experience
- **Node.js v20**: Latest LTS version for optimal performance

## Prerequisites

Before running this application, make sure you have:

- Node.js 20.x or higher installed
- npm package manager
- Angular CLI 20.x

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lucaspouchot/call-of-cthulhu-character-sheet.git
   cd call-of-cthulhu-character-sheet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

For tablet testing, use your browser's developer tools to simulate tablet viewport (768x1024).

## Building for Production

To build the project for production deployment:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Testing

Run the unit tests:

```bash
ng test
```

Run tests in headless mode:

```bash
ng test --watch=false --browsers=ChromeHeadless
```

## Character Sheet Usage

### Basic Information
- Enter character name, occupation, and age in the Character Information section

### Characteristics
- Input the 8 core characteristics (STR, DEX, INT, CON, APP, POW, SIZ, EDU)
- The application automatically calculates and displays the characteristic modifiers

### Derived Attributes
- **Hit Points**: Automatically calculated as (CON + SIZ) / 10
- **Sanity**: Current/Maximum (POW is the maximum)
- **Magic Points**: Automatically calculated as POW / 5
- **Luck**: Manual input field

### Skills
- **Core Skills**: Complete list of Call of Cthulhu skills with base values
- **Custom Skills**: Add your own skills with the "Add Custom Skill" button
- Remove custom skills using the × button

### Equipment & Notes
- Equipment section for tracking gear and weapons
- Background & Notes section for character backstory and campaign notes

### Save/Load System
- **Save Character**: Stores current character data in browser localStorage
- **Load Character**: Retrieves previously saved character data
- **New Character**: Clears all fields to start fresh (with confirmation)

## Tablet Optimization Features

- **Responsive Grid Layout**: Adapts to tablet screen sizes (768px - 1024px)
- **Touch-Friendly Inputs**: Large input fields and buttons for touch interaction
- **Optimized Typography**: Readable fonts and sizing for tablet viewing
- **Efficient Layout**: Information organized in logical sections for tablet use

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Call of Cthulhu RPG system by Chaosium Inc.
- Angular team for the excellent framework
- Tailwind CSS for the utility-first CSS framework