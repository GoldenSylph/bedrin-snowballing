# Bedrin Snowballing

A an offline-capable literature review tracker for systematic snowballing methodology. Built with Vue 3, TypeScript, and IndexedDB for persistent local storage.

## Overview

Bedrin Snowballing is a web application designed to help researchers manage literature reviews using the snowballing method. It tracks papers discovered through forward and backward citation analysis across multiple rounds, allowing you to organize, filter, and export your research findings.

### What is Snowballing?

Snowballing is a literature review method where you:
1. Start with seed papers (initial set of relevant papers)
2. Examine their references (backward snowballing)
3. Find papers that cite them (forward snowballing)
4. Repeat the process for multiple rounds to build a comprehensive literature corpus

## Features

### Core Functionality
- **Paper Management**: Add, edit, and delete papers with comprehensive metadata
- **Seed Papers**: Pre-loaded with 5 initial papers to demonstrate the workflow
- **Multi-round Tracking**: Track papers across seeds and multiple rounds (Round 1-3)
- **Direction Tracking**: Mark papers as backward, forward, or no direction
- **Relevance Assessment**: Rate papers as High, Medium, Low, or Pending
- **Inclusion Status**: Track whether papers are included, excluded, or pending review

### Data Management
- **Offline Storage**: All data persists locally in IndexedDB (browser-native database)
- **Offline-First**: Works completely offline after initial load
- **Duplicate Prevention**: Automatically prevents duplicate papers based on title, authors, and year
- **CSV Export**: Export your entire paper database to CSV for external analysis

### User Interface
- **Real-time Statistics**: Live dashboard showing paper counts by status, direction, and relevance
- **Advanced Filtering**: Filter by round, inclusion status, and direction
- **Full-text Search**: Search across title, authors, keywords, journal, and notes
- **Inline Editing**: Edit papers directly in the table view
- **Responsive Design**: Clean, modern interface with semantic HTML and BEM methodology

## Technology Stack

### Frontend Framework
- **Vue 3.5.28**: Modern reactive framework with Composition API
- **TypeScript 5.9.3**: Type-safe development
- **Vue Router 5.0.2**: Client-side routing
- **Vite 7.3.1**: Fast build tool with HMR

### Data Layer
- **Dexie.js 4.3.0**: Wrapper for IndexedDB with TypeScript support
- **IndexedDB**: Browser-native database for offline storage

### Styling
- **SASS 1.97.3**: CSS preprocessor with variables and nesting
- **BEM Methodology**: Block Element Modifier naming convention for maintainable CSS

### Development Tools
- **Bun**: Fast JavaScript runtime and package manager
- **Prettier**: Code formatting
- **Vue DevTools**: Browser extension for debugging

## Getting Started

### Prerequisites
- Node.js 20.19.0+ or Node.js 22.12.0+
- Bun (recommended) or npm

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd bedrin-snowballing
```

2. Install dependencies:
```sh
bun install
```

3. Start the development server:
```sh
bun dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```sh
bun run build
```

The built files will be in the `dist/` directory.

## Usage Guide

### Adding Papers

1. Click the "Add Paper" button in the controls section
2. Fill in the paper details:
   - **Required**: Authors, Year, Title
   - **Optional**: Journal, DOI, Keywords, Notes
   - **Metadata**: Round, Direction, WoS Index, Relevance, Inclusion Status
3. Click "Save Paper" to add it to the database

### Editing Papers

1. Click the "Edit" button (yellow) on any paper row
2. Modify the fields inline
3. Click "Save" (green) to persist changes or "Cancel" (gray) to discard

### Filtering and Searching

- **Search Bar**: Type to filter papers by title, authors, keywords, journal, or notes
- **Round Filter**: Show papers from specific rounds or all rounds
- **Status Filter**: Filter by inclusion status (Yes/No/Pending)
- **Direction Filter**: Filter by citation direction

### Exporting Data

Click the "Export CSV" button to download your entire paper database as a CSV file. The file will be named `snowballing-papers-YYYY-MM-DD.csv` and includes all paper metadata.

### Statistics Dashboard

The collapsible statistics section shows:
- Total papers in database
- Papers by inclusion status (Included, Excluded, Pending)
- Seed papers count
- Papers by direction (Backward, Forward)
- High relevance papers count

## Project Structure

```
src/
├── assets/
│   ├── main.scss           # Global SCSS styles with BEM methodology
│   └── seed-papers.json    # Initial seed papers data
├── components/
│   ├── AddPaperForm.vue    # Form for adding new papers
│   ├── ControlsSection.vue # Search, filters, and action buttons
│   ├── HeaderSection.vue   # Page header with research question
│   ├── PapersTable.vue     # Table with inline editing
│   └── StatsSection.vue    # Statistics dashboard
├── composables/
│   ├── useExportCsv.ts     # CSV export composable
│   ├── usePapers.ts        # Papers CRUD operations and state
│   └── useSeedPapers.ts    # Seed papers loader
├── db/
│   └── papersDb.ts         # Dexie database configuration
├── router/
│   └── index.ts            # Vue Router configuration
├── types/
│   └── paper.ts            # TypeScript type definitions
├── views/
│   └── SnowballingTracker.vue  # Main application view
├── App.vue                 # Root component
└── main.ts                 # Application entry point
```

## Data Persistence

### IndexedDB Storage

All papers are stored in IndexedDB, a browser-native database that provides:
- **Large Storage Capacity**: Stores much more data than localStorage
- **Offline Access**: Data persists even when offline
- **Fast Queries**: Indexed fields for quick lookups
- **Structured Data**: Stores complex objects without serialization

### Database Schema

```typescript
interface Paper {
  id: number;              // Auto-increment primary key
  round: Round;            // 'Seed' | 'Round 1' | 'Round 2' | 'Round 3'
  direction: Direction;    // 'No direction' | 'Backward' | 'Forward'
  authors: string;         // Paper authors
  year: number;            // Publication year
  title: string;           // Paper title
  journal: string;         // Journal name
  wosIndex: WosIndex;      // Web of Science index
  keywords: string;        // Comma-separated keywords
  relevance: Relevance;    // 'High' | 'Medium' | 'Low' | 'Pending'
  included: IncludedStatus; // 'Yes' | 'No' | 'Pending'
  notes: string;           // Research notes
  doi: string;             // Digital Object Identifier
}
```

### Duplicate Prevention

The system automatically prevents duplicate papers by checking:
- Paper title (case-insensitive)
- Authors (case-insensitive)
- Publication year

If a duplicate is detected, the user is notified and the paper is not added.

### Data Portability

Use the "Export CSV" feature to create backups or transfer data to other tools like Excel, R, or Python for advanced analysis.

## Development

### Recommended IDE Setup

**VS Code** with the following extensions:
- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- Disable Vetur if installed (conflicts with Vue Official)

### Recommended Browser Setup

**Chromium-based browsers** (Chrome, Edge, Brave):
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Turn on Custom Object Formatters](http://bit.ly/object-formatters)

**Firefox**:
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Turn on Custom Object Formatters](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

### Type Support for `.vue` Imports

TypeScript cannot handle type information for `.vue` imports by default. This project uses `vue-tsc` for type checking and requires [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) in your editor to make the TypeScript language service aware of `.vue` types.

### Code Style

- **TypeScript**: Semicolons everywhere
- **CSS**: BEM methodology (Block__Element--Modifier)
- **Vue**: Composition API with `<script setup>`
- **HTML**: Semantic HTML5 elements (header, nav, section, article, etc.)

### Available Scripts

```sh
bun dev          # Start development server with HMR
bun run build    # Type-check and build for production
bun run preview  # Preview production build locally
bun run type-check  # Run TypeScript type checking
bun run format   # Format code with Prettier
```

## Browser Support

This application requires a modern browser with support for:
- ES2020+
- IndexedDB API
- CSS Grid and Flexbox
- Web Components

**Tested browsers:**
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

## Configuration

See [Vite Configuration Reference](https://vite.dev/config/) for build customization options.

## License

This project is private and not licensed for public use.

## Contributing

This is a private research tool. Contact the repository owner for contribution guidelines.
