# 📏 Spacing System

## Base Unit

- **Base Unit**: 4px
- **All spacing values are multiples of 4px**
- **Ensures consistent spacing across the application**

## Spacing Scale

### Micro Spacing
- **1x**: 4px (0.25rem) - Minimal spacing
- **2x**: 8px (0.5rem) - Small spacing
- **3x**: 12px (0.75rem) - Compact spacing

### Small Spacing
- **4x**: 16px (1rem) - Standard spacing
- **5x**: 20px (1.25rem) - Medium spacing
- **6x**: 24px (1.5rem) - Large spacing

### Medium Spacing
- **8x**: 32px (2rem) - Section spacing
- **10x**: 40px (2.5rem) - Component spacing
- **12x**: 48px (3rem) - Layout spacing

### Large Spacing
- **16x**: 64px (4rem) - Page spacing
- **20x**: 80px (5rem) - Section spacing
- **24x**: 96px (6rem) - Major spacing

### Extra Large Spacing
- **32x**: 128px (8rem) - Hero spacing
- **40x**: 160px (10rem) - Page spacing
- **48x**: 192px (12rem) - Major layout spacing

## Usage Guidelines

### Component Spacing

#### Button Padding
- **Small**: 8px 12px (0.5rem 0.75rem)
- **Medium**: 12px 16px (0.75rem 1rem)
- **Large**: 16px 24px (1rem 1.5rem)

#### Input Padding
- **Small**: 8px 12px (0.5rem 0.75rem)
- **Medium**: 12px 16px (0.75rem 1rem)
- **Large**: 16px 20px (1rem 1.25rem)

#### Card Padding
- **Small**: 16px (1rem)
- **Medium**: 24px (1.5rem)
- **Large**: 32px (2rem)

### Layout Spacing

#### Container Padding
- **Mobile**: 16px (1rem)
- **Tablet**: 24px (1.5rem)
- **Desktop**: 32px (2rem)

#### Section Spacing
- **Between sections**: 48px (3rem)
- **Between subsections**: 32px (2rem)
- **Between components**: 24px (1.5rem)

#### Grid Spacing
- **Grid gap**: 24px (1.5rem)
- **Grid item margin**: 12px (0.75rem)

### Text Spacing

#### Line Height
- **Tight**: 1.2 (20% above font size)
- **Normal**: 1.5 (50% above font size)
- **Relaxed**: 1.75 (75% above font size)

#### Paragraph Spacing
- **Between paragraphs**: 16px (1rem)
- **Between sections**: 24px (1.5rem)

#### List Spacing
- **List item spacing**: 8px (0.5rem)
- **List margin**: 16px (1rem)

## Responsive Spacing

### Mobile (< 768px)
- **Container padding**: 16px (1rem)
- **Section spacing**: 32px (2rem)
- **Component spacing**: 16px (1rem)

### Tablet (768px - 1024px)
- **Container padding**: 24px (1.5rem)
- **Section spacing**: 40px (2.5rem)
- **Component spacing**: 20px (1.25rem)

### Desktop (> 1024px)
- **Container padding**: 32px (2rem)
- **Section spacing**: 48px (3rem)
- **Component spacing**: 24px (1.5rem)

## Spacing Utilities

### Margin Utilities
```css
.m-0 { margin: 0; }
.m-1 { margin: 4px; }
.m-2 { margin: 8px; }
.m-3 { margin: 12px; }
.m-4 { margin: 16px; }
.m-5 { margin: 20px; }
.m-6 { margin: 24px; }
.m-8 { margin: 32px; }
.m-10 { margin: 40px; }
.m-12 { margin: 48px; }
```

### Padding Utilities
```css
.p-0 { padding: 0; }
.p-1 { padding: 4px; }
.p-2 { padding: 8px; }
.p-3 { padding: 12px; }
.p-4 { padding: 16px; }
.p-5 { padding: 20px; }
.p-6 { padding: 24px; }
.p-8 { padding: 32px; }
.p-10 { padding: 40px; }
.p-12 { padding: 48px; }
```

### Gap Utilities
```css
.gap-0 { gap: 0; }
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.gap-5 { gap: 20px; }
.gap-6 { gap: 24px; }
.gap-8 { gap: 32px; }
```

## Best Practices

### Consistency
- Always use the spacing scale
- Maintain consistent spacing patterns
- Use spacing utilities for quick adjustments

### Hierarchy
- Use larger spacing for more important elements
- Maintain visual hierarchy through spacing
- Group related elements with smaller spacing

### Responsive Design
- Adjust spacing for different screen sizes
- Use relative units for scalable spacing
- Test spacing on various devices

### Accessibility
- Ensure sufficient spacing for touch targets
- Maintain readable line heights
- Provide adequate spacing for focus states
