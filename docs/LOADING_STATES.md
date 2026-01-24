# Loading States Documentation

This document describes the loading state components and patterns used throughout the Dale Resume Builder application.

## Overview

Loading states provide visual feedback to users while content is being fetched or processed. All loading components follow these principles:

1. **Match Content Structure**: Skeletons should match the shape and layout of actual content
2. **Smooth Transitions**: Use fade-in animations when content loads
3. **Accessibility**: Include proper ARIA labels and screen reader announcements
4. **Performance**: Use CSS animations (not JavaScript) for better performance

## Loading Components

### `<WizardSkeleton />`

Full-page loading skeleton for the resume builder wizard.

**Usage:**
```tsx
import { WizardSkeleton } from '@/components/loading';

<Suspense fallback={<WizardSkeleton />}>
  <ResumeBuilder />
</Suspense>
```

**Displays:**
- Left panel with tab navigation skeleton
- Form fields skeleton
- Right panel with preview skeleton
- Matches exact layout of loaded wizard

---

### `<StepSkeleton />`

Loading skeleton for individual wizard steps.

**Usage:**
```tsx
import { StepSkeleton } from '@/components/loading';

{isLoading ? <StepSkeleton /> : <StepContent />}
```

**Displays:**
- Step header skeleton
- Form fields (4 inputs)
- Action buttons skeleton

---

### `<PreviewSkeleton />`

Loading skeleton for resume preview panel.

**Usage:**
```tsx
import { PreviewSkeleton } from '@/components/loading';

{isLoading ? <PreviewSkeleton /> : <ResumePreview data={resumeData} />}
```

**Displays:**
- Resume header (name, contact)
- Summary section
- Experience entries (2)
- Education entries (2)
- Skills tags

---

### `<CardSkeleton />` & `<CardGridSkeleton />`

Loading skeletons for resume cards on the resumes list page.

**Usage:**
```tsx
import { CardSkeleton, CardGridSkeleton } from '@/components/loading';

// Single card
<CardSkeleton />

// Grid of cards
<CardGridSkeleton count={6} />
```

**Props:**
- `count` (CardGridSkeleton): Number of skeleton cards to display (default: 6)

---

### `<Spinner />`

Animated spinner for general loading states.

**Usage:**
```tsx
import { Spinner } from '@/components/loading';

<Spinner size="md" label="Loading resume..." />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `className`: Additional CSS classes
- `label`: Optional text label displayed below spinner

**Sizes:**
- `sm`: 16px (h-4 w-4) - For inline/button states
- `md`: 32px (h-8 w-8) - For section loading
- `lg`: 48px (h-12 w-12) - For full-page loading

---

### `<FullPageSpinner />`

Full-screen loading spinner.

**Usage:**
```tsx
import { FullPageSpinner } from '@/components/loading';

<FullPageSpinner label="Loading application..." />
```

**Props:**
- `label`: Optional text label

---

### `<InlineSpinner />`

Small spinner for buttons and inline states.

**Usage:**
```tsx
import { InlineSpinner } from '@/components/loading';

<Button>
  {isLoading ? <InlineSpinner /> : 'Save'}
</Button>
```

**Props:**
- `className`: Additional CSS classes

---

## Usage Patterns

### 1. Initial Page Load

Use skeleton loaders that match the content structure:

```tsx
<Suspense fallback={<WizardSkeleton />}>
  <ResumeBuilder />
</Suspense>
```

### 2. Data Fetching

Show skeletons while data is being fetched:

```tsx
{isLoading ? (
  <CardGridSkeleton count={resumes.length || 6} />
) : (
  <ResumeGrid resumes={resumes} />
)}
```

### 3. Button Actions

Use inline spinners for button loading states:

```tsx
<Button isDisabled={isSubmitting}>
  {isSubmitting && <InlineSpinner className="mr-2" />}
  {isSubmitting ? 'Saving...' : 'Save Resume'}
</Button>
```

### 4. Section Loading

Use spinners for partial page updates:

```tsx
{isLoading ? (
  <Spinner size="lg" label="Generating preview..." />
) : (
  <ResumePreview data={resumeData} />
)}
```

### 5. Optimistic Updates

Show content immediately, then update:

```tsx
// Show skeleton briefly while data loads
{isInitialLoad && <StepSkeleton />}

// Then show actual content with fade-in
<div className={isInitialLoad ? '' : 'animate-in fade-in duration-300'}>
  {content}
</div>
```

---

## Animation Classes

All loading components use Tailwind CSS animations:

### Pulse Animation
```css
animate-pulse
```
Used for skeleton loaders to create a subtle pulsing effect.

### Spin Animation
```css
animate-spin
```
Used for spinner components to create a rotating effect.

### Fade In Animation
```css
animate-in fade-in duration-300
```
Used when transitioning from loading to loaded state.

---

## Accessibility Considerations

### ARIA Roles
All loading components include proper ARIA attributes:

```tsx
<div role="status" aria-label="Loading">
  <span className="sr-only">Loading...</span>
</div>
```

### Screen Reader Announcements
Use live regions to announce when content finishes loading:

```tsx
import { LiveAnnouncer, useAnnouncer } from '@/components/accessibility/live-announcer';

const { announce } = useAnnouncer();

useEffect(() => {
  if (!isLoading && data) {
    announce('Resume loaded successfully');
  }
}, [isLoading, data, announce]);
```

### Focus Management
After content loads, ensure focus is managed appropriately:

```tsx
useEffect(() => {
  if (!isLoading && contentRef.current) {
    contentRef.current.focus();
  }
}, [isLoading]);
```

---

## Best Practices

### DO:
✅ Match skeleton structure to actual content layout
✅ Use `animate-pulse` for skeleton loaders
✅ Include ARIA labels for screen readers
✅ Show loading states for operations > 300ms
✅ Use inline spinners for button actions
✅ Fade in content when loading completes

### DON'T:
❌ Show spinners for instant operations
❌ Use JavaScript animations (use CSS instead)
❌ Nest multiple loading states
❌ Forget to handle loading errors
❌ Show generic "Loading..." text without context

---

## Performance Tips

1. **Lazy Load Skeletons**: Import loading components dynamically if they're rarely used
2. **Minimize Reflows**: Use fixed heights/widths on skeletons to prevent layout shifts
3. **CSS Animations**: Always use CSS animations over JavaScript for better performance
4. **Debounce Fast Loads**: Don't show loaders for operations that complete instantly

---

## Testing Loading States

### Manual Testing
1. **Slow Network**: Use Chrome DevTools to throttle network (3G)
2. **Fast Loads**: Verify no flash of loading state for instant operations
3. **Error States**: Test loading → error transitions
4. **Accessibility**: Test with screen reader to verify announcements

### Automated Testing
```tsx
it('shows loading skeleton while data is fetching', () => {
  const { getByRole } = render(<ResumeList />);
  expect(getByRole('status')).toBeInTheDocument();
});

it('hides loading state when data loads', async () => {
  const { queryByRole } = render(<ResumeList />);
  await waitForElementToBeRemoved(() => queryByRole('status'));
});
```

---

## Related Documentation

- [Accessibility Guide](./ACCESSIBILITY.md) - ARIA and screen reader support
- [Animation Guide](./ANIMATIONS.md) - Motion and transitions
- [Component Library](./COMPONENTS.md) - Base component documentation
