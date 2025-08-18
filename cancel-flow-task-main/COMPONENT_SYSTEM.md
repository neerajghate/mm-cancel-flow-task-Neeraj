# Reusable Component System

This document outlines the new reusable component system designed to reduce code duplication and improve consistency across the application.

## Overview

The component system is built with TypeScript and Tailwind CSS, providing a consistent design language and reducing redundant code. All components are located in `src/components/ui/` and can be imported from the main index file.

## Core Components

### Button Component

A comprehensive button system with multiple variants, sizes, and states.

```tsx
import { Button } from '../components/ui';

// Basic usage
<Button onClick={handleClick}>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="pill">Pill</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With states
<Button loading={true}>Loading...</Button>
<Button disabled={true}>Disabled</Button>

// With icons
<Button 
  leftIcon={<Icon />}
  rightIcon={<ArrowIcon />}
>
  With Icons
</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

**Variants:**
- `primary`: Main action button (purple theme)
- `secondary`: Secondary action button (white with border)
- `outline`: Transparent with border
- `ghost`: Transparent with hover effects
- `danger`: Destructive actions (red theme)
- `success`: Positive actions (green theme)
- `pill`: Rounded pill style for form selections

**Sizes:**
- `sm`: Small (px-3 py-1.5)
- `md`: Medium (px-4 py-2) - default
- `lg`: Large (px-6 py-3)
- `xl`: Extra Large (px-8 py-4)

### Modal Components

A complete modal system with header, body, and footer components.

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../components/ui';

// Basic modal
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalHeader onClose={onClose}>
    <h2>Modal Title</h2>
  </ModalHeader>
  
  <ModalBody>
    <p>Modal content goes here</p>
  </ModalBody>
  
  <ModalFooter>
    <Button onClick={onClose}>Cancel</Button>
    <Button variant="primary">Save</Button>
  </ModalFooter>
</Modal>

// Modal with custom size
<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  size="xl"
  showBackdrop={true}
  closeOnBackdropClick={true}
>
  {/* Content */}
</Modal>
```

**Modal Sizes:**
- `sm`: max-w-md
- `md`: max-w-lg (default)
- `lg`: max-w-2xl
- `xl`: max-w-5xl
- `full`: max-w-full with margins

**Modal Props:**
- `isOpen`: Controls modal visibility
- `onClose`: Function called when modal should close
- `size`: Modal size variant
- `showBackdrop`: Whether to show backdrop overlay
- `closeOnBackdropClick`: Whether clicking backdrop closes modal

### Progress Components

Components for showing progress through multi-step flows.

```tsx
import { Progress, StepProgress } from '../components/ui';

// Simple progress indicator
<Progress currentStep={2} totalSteps={5} />

// With custom text
<Progress 
  currentStep={2} 
  totalSteps={5}
  stepText="Step 2 of 5"
/>

// Detailed step progress
<StepProgress
  steps={[
    { title: "Step 1", description: "Description", status: "completed" },
    { title: "Step 2", description: "Description", status: "current" },
    { title: "Step 3", description: "Description", status: "pending" }
  ]}
  currentStep={2}
/>
```

**Step Statuses:**
- `pending`: Not yet started
- `current`: Currently active
- `completed`: Finished

### Form Components

Components for consistent form inputs and selections.

```tsx
import { FormField, PillSelection, TextInput, Textarea } from '../components/ui';

// Form field wrapper
<FormField 
  label="Email Address" 
  required={true}
  error={emailError}
>
  <TextInput 
    type="email" 
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</FormField>

// Pill selection for multiple choice
<PillSelection
  options={['Option 1', 'Option 2', 'Option 3']}
  value={selectedOption}
  onChange={setSelectedOption}
  columns={3}
/>

// Text input with validation
<TextInput
  label="Username"
  required={true}
  error={usernameError}
  helperText="Must be at least 3 characters"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// Textarea
<Textarea
  label="Description"
  placeholder="Enter description"
  rows={4}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

**PillSelection Columns:**
- `2`: Two-column grid
- `3`: Three-column grid
- `4`: Four-column grid

### Card Components

Layout components for consistent content containers.

```tsx
import { Card, CardHeader, CardBody, CardFooter, InfoCard } from '../components/ui';

// Basic card
<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  
  <CardBody>
    <p>Card content</p>
  </CardBody>
  
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Card with custom styling
<Card 
  padding="lg"
  shadow="xl"
  rounded="2xl"
  className="bg-gradient-to-r from-blue-50 to-indigo-50"
>
  {/* Content */}
</Card>

// Info card for status displays
<InfoCard
  icon={<CheckIcon />}
  title="Subscription Status"
  value="Active"
  status="success"
/>
```

**Card Props:**
- `padding`: none, sm, md, lg
- `shadow`: none, sm, md, lg, xl, 2xl
- `rounded`: none, sm, md, lg, xl, 2xl

**InfoCard Statuses:**
- `success`: Green theme
- `warning`: Yellow theme
- `error`: Red theme
- `info`: Blue theme

## Utility Functions

### `cn()` Function

The `cn()` utility function combines `clsx` and `tailwind-merge` to safely merge class names and resolve Tailwind conflicts.

```tsx
import { cn } from '../lib/utils';

// Basic usage
<div className={cn('base-class', conditionalClass && 'conditional-class')}>

// With dynamic classes
<div className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' ? 'primary-class' : 'secondary-class'
)}>
```

## Best Practices

### 1. Component Composition

Use the composition pattern to build complex UIs:

```tsx
<Card>
  <CardHeader>
    <h2>Form Title</h2>
  </CardHeader>
  
  <CardBody>
    <FormField label="Name" required>
      <TextInput placeholder="Enter name" />
    </FormField>
  </CardBody>
  
  <CardFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Submit</Button>
  </CardFooter>
</Card>
```

### 2. Consistent Spacing

Use the built-in spacing from components rather than custom margins:

```tsx
// Good - uses component spacing
<CardBody>
  <div className="space-y-4">
    <FormField>...</FormField>
    <FormField>...</FormField>
  </div>
</CardBody>

// Avoid - custom margins
<CardBody>
  <FormField className="mb-4">...</FormField>
  <FormField className="mb-4">...</FormField>
</CardBody>
```

### 3. Variant Usage

Use semantic variants rather than custom styling:

```tsx
// Good - semantic variant
<Button variant="danger">Delete</Button>

// Avoid - custom styling
<Button className="bg-red-600 hover:bg-red-700">Delete</Button>
```

### 4. Responsive Design

Components are built with responsive design in mind. Use the built-in responsive classes:

```tsx
// Components handle responsive behavior automatically
<Modal size="xl"> {/* Responsive sizing */}
<Card className="overflow-hidden"> {/* Responsive overflow */}
```

## Migration Guide

### From Old Components

1. **Replace custom buttons:**
   ```tsx
   // Old
   <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
     Click me
   </button>
   
   // New
   <Button variant="primary">Click me</Button>
   ```

2. **Replace custom modals:**
   ```tsx
   // Old
   <div className="fixed inset-0 z-50 flex items-center justify-center">
     <div className="bg-white rounded-lg shadow-lg p-6">
       {/* Content */}
     </div>
   </div>
   
   // New
   <Modal isOpen={isOpen} onClose={onClose}>
     <ModalBody>
       {/* Content */}
     </ModalBody>
   </Modal>
   ```

3. **Replace custom form fields:**
   ```tsx
   // Old
   <div className="space-y-2">
     <label className="text-sm text-gray-700">Name</label>
     <input className="w-full px-3 py-2 border rounded" />
   </div>
   
   // New
   <FormField label="Name">
     <TextInput />
   </FormField>
   ```

### Benefits of Migration

- **Consistency**: All components follow the same design patterns
- **Maintainability**: Changes to design system update everywhere
- **Accessibility**: Built-in accessibility features
- **Performance**: Optimized rendering and reduced bundle size
- **Developer Experience**: Better TypeScript support and autocomplete

## Customization

### Theme Colors

The component system uses a consistent color palette. To customize:

1. Update the color values in individual components
2. Use CSS custom properties for dynamic theming
3. Override with Tailwind classes when needed

### Component Variants

To add new variants to existing components:

1. Extend the variant types in the component interface
2. Add the new variant styles to the variant definitions
3. Update the component logic to handle the new variant

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Ensure all required props are provided
2. **Styling conflicts**: Use `cn()` function to safely merge classes
3. **Responsive issues**: Check that components are properly wrapped

### Performance Considerations

- Components use React.memo where appropriate
- Avoid creating new objects/functions in render
- Use the `key` prop for dynamic lists

## Contributing

When adding new components:

1. Follow the existing component patterns
2. Include comprehensive TypeScript interfaces
3. Add proper JSDoc comments
4. Include examples in this documentation
5. Ensure accessibility compliance
6. Test with different screen sizes and themes
