# Zustand Stores

This directory contains Zustand stores for global state management.

## Available Stores

### `ui-store.ts`
Manages UI-related state:
- Sidebar open/close state
- Modal states
- Loading states

**Usage:**
```tsx
import { useUIStore } from '@/stores'

function MyComponent() {
  const { sidebarOpen, toggleSidebar, setLoading, isLoading } = useUIStore()
  
  const handleClick = () => {
    setLoading('myAction', true)
    // ... do something
    setLoading('myAction', false)
  }
  
  return (
    <button onClick={toggleSidebar}>
      {sidebarOpen ? 'Close' : 'Open'} Sidebar
    </button>
  )
}
```

### `resume-store.ts`
Manages resume-related state:
- Resume list
- Active resume
- Resume visibility
- Loading/uploading states

**Usage:**
```tsx
import { useResumeStore } from '@/stores'

function ResumeComponent() {
  const { resumes, activeResume, loading, setResumes } = useResumeStore()
  
  useEffect(() => {
    // Fetch resumes and update store
    fetchResumes().then(setResumes)
  }, [])
  
  // ...
}
```

## Creating a New Store

Use the `createStore` helper function:

```tsx
import { createStore } from './use-store'

interface MyState {
  count: number
  increment: () => void
  decrement: () => void
}

export const useMyStore = createStore<MyState>(
  'MyStore',
  (set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  }),
  {
    persist: true, // Optional: persist to localStorage
    storageKey: 'my-store', // Optional: custom storage key
  }
)
```

## Features

- **DevTools**: All stores are automatically connected to Redux DevTools
- **Persistence**: Optional localStorage persistence via `persist` middleware
- **TypeScript**: Full type safety
- **Selective Subscriptions**: Only re-render when subscribed values change

## Best Practices

1. **Keep stores focused**: One store per domain (UI, Resume, Auth, etc.)
2. **Use selectors**: Subscribe to only the state you need
   ```tsx
   // Good - only re-renders when sidebarOpen changes
   const sidebarOpen = useUIStore((state) => state.sidebarOpen)
   
   // Less optimal - re-renders on any UI state change
   const { sidebarOpen } = useUIStore()
   ```
3. **Actions over direct state mutation**: Always use actions to update state
4. **Computed values**: Use getters for derived state
