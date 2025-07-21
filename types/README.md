# Types Directory Structure

This directory contains TypeScript type definitions organized by category for better maintainability and clarity.

## File Structure

```
types/
├── index.ts          # Main entry point - re-exports all types
├── contract.ts       # Smart contract related types
├── service.ts        # Service function types
├── components.ts     # Component and UI types
├── forms.ts          # Form and data input types
├── common.ts         # Common utility types
└── README.md         # This documentation
```

## Type Categories

### 📄 `contract.ts` - Smart Contract Types

- **Company** - Company data structure from smart contract
- **Comment** - Comment data structure from smart contract
- **CompanyRatingStats** - Company statistics
- **CompanySearchResult** - Search results
- **CommentTuple** - Contract function return tuple for comments
- **CompanyTuple** - Contract function return tuple for companies
- **Event Types** - Smart contract event interfaces

### 🔧 `service.ts` - Service Function Types

- **Parameter Types** - Input parameters for service functions
- **Return Types** - Service function return structures
- **Thirdweb Types** - Readonly types for thirdweb data

### 🧩 `components.ts` - Component Types

- **Props Types** - Component prop interfaces
- **UI Types** - UI component data structures
- **Transaction Types** - Transaction dialog related types

### 📝 `forms.ts` - Form and Data Types

- **Form Data** - Form input data structures
- **Search Filters** - Search and filtering options
- **Pagination** - Pagination related types

### 🔄 `common.ts` - Common Utility Types

- **API Response** - API response structures
- **Wallet Info** - Wallet and account types
- **Error Types** - Error handling structures
- **Loading States** - Loading state management
- **Navigation** - Navigation structure types

## Usage

### Import from main index (recommended)

```typescript
import { Company, Comment, CreateCommentProps } from "@/types";
```

### Import from specific files (for specific use cases)

```typescript
import { Company, Comment } from "@/types/contract";
import { CreateCommentProps } from "@/types/components";
import { ApiResponse } from "@/types/common";
```

## Benefits of This Structure

### ✅ **Maintainability**

- Types are organized by category
- Easy to find and update specific types
- Clear separation of concerns

### ✅ **Scalability**

- Easy to add new type categories
- No single large file to maintain
- Modular structure supports team development

### ✅ **Backward Compatibility**

- Main `index.ts` re-exports all types
- Existing imports continue to work
- Gradual migration possible

### ✅ **Developer Experience**

- Better IntelliSense organization
- Clearer type documentation
- Easier to understand type relationships

## Adding New Types

1. **Identify the category** for your new type
2. **Add to the appropriate file** in the types directory
3. **Export from main index.ts** (already done via `export *`)
4. **Update this README** if adding a new category

## Best Practices

- Keep related types together in the same file
- Use descriptive interface names
- Add JSDoc comments for complex types
- Maintain consistent naming conventions
- Avoid circular dependencies between type files
