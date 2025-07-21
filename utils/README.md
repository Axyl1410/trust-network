# Utils Directory Structure

This directory contains utility functions organized by category for better maintainability and clarity.

## File Structure

```
utils/
├── index.ts          # Main entry point - re-exports all utilities
├── string.ts         # String manipulation utilities
├── css.ts            # CSS and styling utilities
├── validation.ts     # Validation and assertion utilities
├── date.ts           # Date and time utilities
├── array.ts          # Array manipulation utilities
├── format.ts         # Application-specific formatting utilities
└── README.md         # This documentation
```

## Utility Categories

### 📝 `string.ts` - String Utilities

- **`formatAddress`** - Formats wallet addresses (e.g., "0x1234...5678")
- **`capitalize`** - Capitalizes first letter of string
- **`toTitleCase`** - Converts string to title case
- **`truncate`** - Truncates string with suffix
- **`stripHtml`** - Removes HTML tags from string
- **`toSlug`** - Converts string to URL-friendly slug

### 🎨 `css.ts` - CSS and Styling Utilities

- **`cn`** - Merges class names with Tailwind conflict resolution
- **`createGradient`** - Creates linear gradient style objects
- **`createRadialGradient`** - Creates radial gradient style objects
- **`createBoxShadow`** - Creates box shadow style objects
- **`responsive`** - Generates responsive breakpoint classes

### ✅ `validation.ts` - Validation Utilities

- **`assertValue`** - Asserts value is not undefined
- **`isValidEmail`** - Validates email format
- **`isValidEthereumAddress`** - Validates Ethereum address format
- **`isValidUrl`** - Validates URL format
- **`isValidString`** - Validates string length
- **`isInRange`** - Validates number range
- **`isValidRating`** - Validates rating (1-5)

### 📅 `date.ts` - Date and Time Utilities

- **`formatTimestamp`** - Formats Unix timestamp to readable date
- **`formatRelativeTime`** - Formats date as relative time (e.g., "2 hours ago")
- **`getCurrentTimestamp`** - Gets current timestamp in seconds
- **`isToday`** - Checks if date is today
- **`isYesterday`** - Checks if date is yesterday
- **`formatSmartDate`** - Smart date formatting with relative time

### 🔢 `array.ts` - Array Utilities

- **`unique`** - Removes duplicate items from array
- **`groupBy`** - Groups array items by key function
- **`sortByMultiple`** - Sorts array by multiple criteria
- **`chunk`** - Chunks array into smaller arrays
- **`flatten`** - Flattens nested arrays
- **`findFirst`** - Finds first item matching predicate
- **`partition`** - Partitions array into matching/non-matching

### 🎯 `format.ts` - Application-Specific Formatting

- **`formatRating`** - Formats rating to star display
- **`formatNumber`** - Formats numbers with suffixes (K, M, B)
- **`formatCompanyName`** - Formats company names for display
- **`formatCommentContent`** - Formats comment content with truncation
- **`formatUserDisplayName`** - Formats user names from addresses
- **`formatCommentDate`** - Formats timestamps for comments
- **`formatWebsiteUrl`** - Formats website URLs for display

## Usage

### Import from main utils (recommended)

```typescript
import { formatAddress, cn, isValidEmail, formatRating } from "@/utils";
```

### Import from specific files (for specific use cases)

```typescript
import { formatAddress } from "@/utils/string";
import { cn } from "@/utils/css";
import { isValidEmail } from "@/utils/validation";
import { formatRating } from "@/utils/format";
```

### Import from lib/utils (backward compatibility)

```typescript
import { formatAddress, cn, isValidEmail, formatRating } from "@/lib/utils";
```

## Benefits of This Structure

### ✅ **Cleaner Organization**

- Utils are now at the root level, separate from lib
- Clear separation between utilities and library code
- More intuitive file structure

### ✅ **Maintainability**

- Utilities are organized by category
- Easy to find and update specific functions
- Clear separation of concerns

### ✅ **Scalability**

- Easy to add new utility categories
- No single large file to maintain
- Modular structure supports team development

### ✅ **Backward Compatibility**

- Main `lib/utils.ts` re-exports all utilities
- Existing imports continue to work
- Gradual migration possible

### ✅ **Developer Experience**

- Better IntelliSense organization
- Clearer function documentation
- Easier to understand utility relationships

## Adding New Utilities

1. **Identify the category** for your new utility
2. **Add to the appropriate file** in the utils directory
3. **Export from main index.ts** (already done via `export *`)
4. **Update this README** if adding a new category

## Best Practices

- Keep related utilities together in the same file
- Use descriptive function names
- Add JSDoc comments for all functions
- Maintain consistent naming conventions
- Avoid circular dependencies between utility files
- Test utilities thoroughly before adding

## Migration Notes

- **Old imports still work**: `@/lib/utils` → `@/lib/utils` (re-exports from root)
- **New imports available**: `@/utils` → direct access to root utils
- **Specific imports**: `@/utils/string`, `@/utils/css`, etc.
- **No breaking changes** to existing code
