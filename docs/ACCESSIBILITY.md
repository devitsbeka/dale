# Accessibility Documentation

Dale Resume Builder is designed to meet WCAG 2.1 Level AA accessibility standards.

## WCAG 2.1 AA Compliance Checklist

### ✅ Perceivable

#### 1.1 Text Alternatives
- All images and icons have appropriate ARIA labels
- Decorative icons are hidden from screen readers with `aria-hidden="true"`
- All form inputs have associated labels

#### 1.3 Adaptable
- Semantic HTML structure with proper heading hierarchy (h1 → h2 → h3)
- Landmark regions defined with ARIA roles
- Proper reading order maintained
- Form fields programmatically associated with labels

#### 1.4 Distinguishable
- Color contrast ratio meets 4.5:1 minimum for text
- Text can be resized up to 200% without loss of content
- Focus indicators visible on all interactive elements
- Color is not the only visual means of conveying information

### ✅ Operable

#### 2.1 Keyboard Accessible
- All functionality available via keyboard
- Tab order follows logical reading sequence
- Custom components built with React Aria for keyboard support
- No keyboard traps (focus can move in and out of all components)

#### 2.2 Enough Time
- No time limits on form completion
- Auto-save prevents data loss

#### 2.4 Navigable
- Skip link provided to bypass repetitive navigation
- Page titles describe content
- Focus order follows DOM order
- Link purpose clear from link text or context
- Multiple ways to find pages (navigation, search)

### ✅ Understandable

#### 3.1 Readable
- Language of page identified (`lang="en"` on html element)
- Clear, concise labels for all form fields

#### 3.2 Predictable
- Navigation consistent across pages
- Components behave consistently
- Context changes only on explicit user action

#### 3.3 Input Assistance
- Error messages provided for form validation
- Labels and instructions provided for inputs
- Error prevention through validation
- Required fields clearly marked

### ✅ Robust

#### 4.1 Compatible
- Valid HTML structure
- Elements have complete start and end tags
- ARIA roles, states, and properties valid
- Status messages announced via ARIA live regions

## Components with Accessibility Features

### Input Components
- Built on React Aria Components
- Automatic ARIA labels and descriptions
- Error state announcements
- Required field indicators
- Keyboard navigation support

### Dialog/Modal Components
- **ShareDialog**: Focus trap, ARIA role="dialog", aria-modal="true", aria-labelledby
- **ResumeImportDialog**: Focus trap, ARIA role="dialog", aria-modal="true", aria-labelledby
- Escape key closes dialogs
- Focus returns to trigger element on close

### Form Steps
- Clear heading hierarchy
- Progress indicators with ARIA states
- Error messages with role="alert"
- Required field validation

### Navigation
- Skip to main content link
- Keyboard-accessible tabs
- Current step indicated visually and programmatically
- Tab panels properly associated with tab controls

## Accessibility Utilities

### `<SkipLink />`
Allows keyboard users to skip repetitive navigation and jump directly to main content.

**Usage:**
```tsx
<SkipLink />
```

### `<LiveAnnouncer />`
Announces dynamic content changes to screen readers using ARIA live regions.

**Usage:**
```tsx
const { message, announce } = useAnnouncer();

announce("Resume saved successfully");

<LiveAnnouncer message={message} />
```

### `useFocusTrap()`
Traps keyboard focus within a modal or dialog, preventing keyboard navigation outside the component.

**Usage:**
```tsx
const dialogRef = useFocusTrap<HTMLDivElement>(true);

<div ref={dialogRef} role="dialog">
  {/* Dialog content */}
</div>
```

## Testing Recommendations

### Keyboard Navigation
1. Tab through all interactive elements
2. Ensure focus is visible
3. Test Escape key in dialogs
4. Verify arrow keys work in select/combobox components

### Screen Reader Testing
- **macOS**: VoiceOver (Cmd+F5)
- **Windows**: NVDA (free) or JAWS
- **Mobile**: TalkBack (Android), VoiceOver (iOS)

### Automated Testing Tools
- **axe DevTools**: Chrome/Firefox extension for automated accessibility audits
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built into Chrome DevTools

### Color Contrast
Use tools like:
- Chrome DevTools color picker (shows contrast ratio)
- WebAIM Contrast Checker
- Stark plugin for Figma/Chrome

## Known Limitations

### PDF Export
- PDF generation uses Puppeteer for consistent output
- PDF accessibility tags not yet implemented (planned for future release)
- Users can download accessible HTML version as alternative

### Rich Text Editor
- Limited to ATS-safe formatting (no images, tables, colors)
- Keyboard shortcuts documented in UI
- Full keyboard navigation supported

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Aria Documentation](https://react-spectrum.adobe.com/react-aria/)
- [WebAIM Articles](https://webaim.org/articles/)
- [The A11Y Project](https://www.a11yproject.com/)

## Reporting Accessibility Issues

If you encounter any accessibility barriers, please:
1. Open an issue on GitHub with the "accessibility" label
2. Include your assistive technology (screen reader, browser, OS version)
3. Describe the specific barrier encountered
4. Provide steps to reproduce

We are committed to maintaining and improving accessibility for all users.
