# 📁 Design Folder Structure

## Folder za Dizajn Aplikacije

Kreiraj sledeću folder strukturu za dizajn aplikacije:

```
design/
├── wireframes/                    # Wireframe mockupovi
│   ├── desktop/                   # Desktop wireframes
│   │   ├── dashboard/             # Dashboard wireframes
│   │   ├── offers/                # Offers management
│   │   ├── orders/                # Orders management
│   │   ├── customers/             # Customer management
│   │   ├── invoices/              # Invoice management
│   │   └── crm/                   # CRM screens
│   ├── mobile/                    # Mobile wireframes
│   │   ├── dashboard/             # Mobile dashboard
│   │   ├── offers/                # Mobile offers
│   │   └── customers/             # Mobile customers
│   └── tablet/                    # Tablet wireframes
│       └── dashboard/             # Tablet dashboard
│
├── mockups/                       # Visual mockups
│   ├── desktop/                   # Desktop mockups
│   │   ├── dashboard/             # Dashboard designs
│   │   ├── offers/                # Offers UI designs
│   │   ├── orders/                # Orders UI designs
│   │   ├── customers/             # Customer UI designs
│   │   ├── invoices/              # Invoice UI designs
│   │   ├── crm/                   # CRM UI designs
│   │   └── admin/                 # Admin panel designs
│   ├── mobile/                    # Mobile mockups
│   │   ├── dashboard/             # Mobile dashboard
│   │   ├── offers/                # Mobile offers
│   │   ├── orders/                # Mobile orders
│   │   └── customers/             # Mobile customers
│   └── tablet/                    # Tablet mockups
│       └── dashboard/             # Tablet dashboard
│
├── components/                    # UI komponente
│   ├── atoms/                     # Osnovni elementi
│   │   ├── buttons/               # Button komponente
│   │   ├── inputs/                # Input komponente
│   │   ├── typography/            # Typography
│   │   └── icons/                 # Icon komponente
│   ├── molecules/                 # Kombinovani elementi
│   │   ├── forms/                 # Form komponente
│   │   ├── cards/                 # Card komponente
│   │   ├── tables/                # Table komponente
│   │   └── navigation/            # Navigation komponente
│   └── organisms/                 # Kompleksni elementi
│       ├── headers/               # Header komponente
│       ├── sidebars/              # Sidebar komponente
│       ├── dashboards/            # Dashboard komponente
│       └── modals/                # Modal komponente
│
├── user-flows/                    # User flow dijagrami
│   ├── customer-journey/          # Customer journey maps
│   ├── sales-process/             # Sales process flows
│   ├── onboarding/                # User onboarding flows
│   └── error-handling/            # Error handling flows
│
├── prototypes/                    # Interaktivni prototipovi
│   ├── desktop/                   # Desktop prototipovi
│   ├── mobile/                    # Mobile prototipovi
│   └── tablet/                    # Tablet prototipovi
│
├── assets/                        # Design assets
│   ├── images/                    # Slike i ilustracije
│   │   ├── icons/                 # Icon slike
│   │   ├── illustrations/         # Ilustracije
│   │   └── backgrounds/           # Background slike
│   ├── fonts/                     # Font fajlovi
│   └── colors/                    # Color palette
│
├── style-guide/                   # Style guide
│   ├── colors/                    # Color system
│   ├── typography/                # Typography system
│   ├── spacing/                   # Spacing system
│   ├── components/                # Component library
│   └── patterns/                  # Design patterns
│
├── specifications/                # Design specifications
│   ├── responsive/                # Responsive specifications
│   ├── accessibility/             # Accessibility guidelines
│   ├── interactions/              # Interaction specifications
│   └── animations/                # Animation specifications
│
└── documentation/                 # Design dokumentacija
    ├── design-system/             # Design system docs
    ├── component-docs/            # Component documentation
    ├── guidelines/                # Design guidelines
    └── changelog/                 # Design changelog
```

## 📋 Preporučeni Tools za Dizajn

### **Wireframing**
- **Figma** - Collaborative design tool
- **Sketch** - Mac-only design tool
- **Adobe XD** - Cross-platform design tool
- **Balsamiq** - Rapid wireframing tool

### **Prototyping**
- **Figma** - Built-in prototyping
- **InVision** - Interactive prototyping
- **Principle** - Animation prototyping
- **Framer** - Advanced prototyping

### **Design Systems**
- **Figma** - Component libraries
- **Storybook** - Component documentation
- **Zeroheight** - Design system documentation

### **User Flow Tools**
- **Figma** - Flow diagrams
- **Draw.io** - Flowchart diagrams
- **Miro** - Collaborative whiteboarding
- **Lucidchart** - Professional diagrams

## 🎨 Design System Struktura

### **Color System**
```
colors/
├── primary/                       # Primary brand colors
├── secondary/                     # Secondary brand colors
├── neutral/                       # Neutral colors (grays)
├── semantic/                      # Semantic colors (success, error, warning)
└── data/                          # Data visualization colors
```

### **Typography System**
```
typography/
├── fonts/                         # Font files
├── scales/                        # Typography scales
├── weights/                       # Font weights
└── styles/                        # Text styles
```

### **Component Library**
```
components/
├── buttons/
│   ├── primary-button.sketch
│   ├── secondary-button.sketch
│   └── icon-button.sketch
├── forms/
│   ├── text-input.sketch
│   ├── select-dropdown.sketch
│   └── checkbox.sketch
└── layout/
    ├── header.sketch
    ├── sidebar.sketch
    └── footer.sketch
```

## 📱 Responsive Breakpoints

### **Desktop First Approach**
- **Desktop**: 1920px+ (Large screens)
- **Desktop**: 1440px+ (Standard desktop)
- **Desktop**: 1200px+ (Small desktop)
- **Tablet**: 768px+ (Tablet landscape)
- **Mobile**: 480px+ (Mobile landscape)
- **Mobile**: 320px+ (Mobile portrait)

### **Mobile First Approach**
- **Mobile**: 320px+ (Mobile portrait)
- **Mobile**: 480px+ (Mobile landscape)
- **Tablet**: 768px+ (Tablet portrait)
- **Tablet**: 1024px+ (Tablet landscape)
- **Desktop**: 1200px+ (Desktop)
- **Desktop**: 1440px+ (Large desktop)

## 🔄 Design Workflow

### **1. Research Phase**
- User research
- Competitive analysis
- Business requirements
- Technical constraints

### **2. Ideation Phase**
- Brainstorming
- Sketching
- Wireframing
- User flows

### **3. Design Phase**
- Visual design
- Component creation
- Style guide development
- Prototyping

### **4. Validation Phase**
- User testing
- Stakeholder review
- Technical feasibility
- Accessibility audit

### **5. Handoff Phase**
- Developer handoff
- Asset export
- Documentation
- Design system integration

## 📊 Design Metrics

### **Performance Metrics**
- Load time
- Interaction response
- Animation smoothness
- Accessibility score

### **User Experience Metrics**
- Task completion rate
- User satisfaction
- Error rate
- Time to complete tasks

### **Design Quality Metrics**
- Design system adoption
- Component reusability
- Consistency score
- Maintainability

## 🚀 Quick Start

1. **Kreiraj folder strukturu**:
   ```bash
   mkdir -p design/{wireframes,mockups,components,user-flows,prototypes,assets,style-guide,specifications,documentation}
   ```

2. **Setup design tool** (Figma preporučeno)

3. **Kreiraj design system** sa osnovnim komponentama

4. **Počni sa wireframing** za ključne stranice

5. **Iterativno razvijaj** dizajn na osnovu feedback-a

## 📝 Naming Conventions

### **Fajlovi**
- **Wireframes**: `wireframe-[screen-name]-[version].fig`
- **Mockups**: `mockup-[screen-name]-[version].fig`
- **Components**: `[component-name]-[state].fig`
- **Assets**: `[asset-name]-[size]-[format].png`

### **Komponente**
- **Atoms**: `atom-[element-name]`
- **Molecules**: `molecule-[component-name]`
- **Organisms**: `organism-[section-name]`
- **Templates**: `template-[page-name]`

### **Varijante**
- **States**: `[component]-[state]` (e.g., `button-hover`)
- **Sizes**: `[component]-[size]` (e.g., `button-large`)
- **Variants**: `[component]-[variant]` (e.g., `button-primary`)

Ovaj folder struktura će ti omogućiti da organizuješ sve dizajn materijale na strukturiran način i lakše saradjuješ sa timom.
