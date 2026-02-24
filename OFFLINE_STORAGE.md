# Offline Storage with Dexie.js

This application uses **Dexie.js** (IndexedDB wrapper) for persistent, offline-capable storage.

## Features

✅ **Fully Offline**: Data persists in the browser's IndexedDB even when offline
✅ **Automatic Initialization**: Seeds database with initial papers on first load
✅ **Real-time Sync**: All CRUD operations immediately sync to IndexedDB
✅ **Large Capacity**: Can store thousands of papers (much larger than localStorage)
✅ **Fast Queries**: Indexed fields for quick filtering and searching

## How It Works

### Database Schema

- **Database Name**: `SnowballingDatabase`
- **Table**: `papers`
- **Indexed Fields**: `id`, `round`, `direction`, `authors`, `year`, `title`, `journal`, `wosIndex`, `relevance`, `included`, `doi`

### Duplicate Prevention

The database prevents duplicate entries using a composite check:
- **Unique Key**: `title` + `authors` + `year`
- Seed papers are only added once (checked on initialization)
- Manual additions check for duplicates before inserting
- User receives clear error message if duplicate detected

### Seeds Initialization

Seeds are added only **once** when the database is first created:
1. Check if database is empty
2. If empty, load seed papers from JSON
3. Check each seed for duplicates (skips if exists)
4. Add only unique papers
5. Set `initialized` flag to prevent re-checking

**Result**: Seed papers never get duplicated, even if you refresh the page or reopen the browser.

### Storage Location

Data is stored in your browser's IndexedDB:
- **Chrome/Edge**: `%LOCALAPPDATA%\Google\Chrome\User Data\Default\IndexedDB`
- **Firefox**: Profile folder under `storage/default`
- **Safari**: `~/Library/Safari/Databases`

### Operations

All paper operations are async and automatically persist:

```typescript
// Add paper
await papersDb.add(newPaper);

// Update paper
await papersDb.update(paperId, changes);

// Delete paper
await papersDb.delete(paperId);

// Get all papers
await papersDb.getAll();
```

## Offline Usage

1. **Load the app** - Papers are loaded from IndexedDB
2. **Go offline** - Disconnect from internet
3. **Add/Edit/Delete papers** - All changes persist locally
4. **Close browser** - Data is saved
5. **Reopen later** - All data is still there, even offline

## Data Persistence

- Data persists **per browser per domain**
- Survives browser restart
- Survives page refresh
- **Does not sync** between browsers or devices (local only)
- Survives offline mode

## Clearing Data

To reset the database:
1. Open browser DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Find IndexedDB → SnowballingDatabase
4. Delete the database

Or programmatically:
```javascript
await papersDb.clear(); // Clear all papers
```

## Technical Details

- **Library**: Dexie.js v4.3.0
- **Storage**: IndexedDB API
- **TypeScript**: Fully typed
- **Auto-increment IDs**: Handles ID generation automatically
- **Transaction safety**: All operations are atomic

## Browser Support

Works in all modern browsers:
- Chrome/Edge 24+
- Firefox 16+
- Safari 10+
- Opera 15+
- All mobile browsers with IndexedDB support

## File Structure

```
src/
  db/
    papersDb.ts          # Dexie database service with duplicate prevention
  composables/
    usePapers.ts         # Papers management composable (CRUD operations)
    useSeedPapers.ts     # Seed papers data loader
  views/
    SnowballingTracker.vue  # Main view using usePapers composable
  types/
    paper.ts             # Paper interface
```

## Why Dexie.js?

- ✅ Simple, Promise-based API
- ✅ TypeScript-friendly
- ✅ Better than localStorage (no 5-10MB limit)
- ✅ Indexed queries for fast filtering
- ✅ Observable queries (can add real-time sync later)
- ✅ Migration support with versioning
- ✅ Minimal bundle size (~100KB)
