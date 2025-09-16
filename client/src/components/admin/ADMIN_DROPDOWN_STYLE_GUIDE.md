# ADMIN DROPDOWN STYLING GUIDE (LOCKED PATTERN)

**Date Locked**: August 8, 2025
**Status**: MANDATORY - DO NOT CHANGE

## Required Dropdown Menu Styling Pattern

All dropdown menus in the admin interface MUST follow this exact pattern:

### DropdownMenuContent Styling
```tsx
<DropdownMenuContent className="bg-charcoal/95 backdrop-blur-xl border border-white/20 text-white">
```

### DropdownMenuItem Styling

#### Standard Menu Items
```tsx
<DropdownMenuItem className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">
```

#### Destructive Actions (Delete, Remove, etc.)
```tsx
<DropdownMenuItem className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 focus:text-red-400">
```

#### Warning Actions (Verify, Resend, etc.)
```tsx
<DropdownMenuItem className="text-amber-400 hover:bg-amber-500/20 focus:bg-amber-500/20 focus:text-amber-400">
```

#### Admin/Special Actions
```tsx
<DropdownMenuItem className="text-flame-red hover:bg-red-500/20 focus:bg-red-500/20 focus:text-flame-red">
```

### DropdownMenuSeparator Styling
```tsx
<DropdownMenuSeparator className="bg-white/20" />
```

## NEVER USE IN ADMIN INTERFACE:
- ❌ `text-gray-900` (black text on dark background = invisible)
- ❌ `text-gray-600` (dark gray text on dark background = invisible)
- ❌ `bg-white` (white background on dark theme = jarring)
- ❌ `hover:bg-gray-100` (light gray hover on dark theme = inconsistent)
- ❌ `hover:bg-gray-50` (very light gray on dark theme = inconsistent)

## COMPONENTS USING THIS PATTERN:
- ✅ UserMenu.tsx (main user dropdown)
- ✅ UserMenuHeader.tsx
- ✅ UserMenuItems.tsx
- ✅ EmailVerificationItem.tsx
- ✅ SignOutItem.tsx
- ✅ BulkActionsDropdown.tsx
- ✅ UserCard.tsx (user management dropdown)
- ✅ OrderActions.tsx (order management dropdown)
- ✅ CategoryManager.tsx (blog category dropdown)

## RATIONALE:
This pattern ensures all dropdown text is visible on the dark admin interface background, maintains consistent branding with the Salt & Scoville color scheme, and provides proper hover/focus states for accessibility.

## ENFORCEMENT:
Any future dropdown additions to admin interface MUST follow this exact pattern. No exceptions.