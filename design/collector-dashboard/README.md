# T-2 Cloud Admin Panel

A comprehensive, enterprise-grade admin dashboard built with modern web technologies. This project provides a complete solution for cloud infrastructure management, customer analytics, and business operations.

## 🚀 Features

### Core Dashboard
- **Customer Analytics Dashboard** - Comprehensive customer insights and relationship management
- **VPS Cloud Management** - Complete VPS instance lifecycle management
- **E-commerce Integration** - Product catalog and order management
- **Project Management** - Task tracking and project analytics
- **Sales CRM** - Lead management and sales pipeline tracking

### Advanced Functionality
- **Real-time Analytics** - Interactive charts and data visualization
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Theme Customization** - Light/dark mode with custom color schemes
- **Role-based Access Control** - Secure authentication and authorization
- **Multi-language Support** - Internationalization ready

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5.8** - Type-safe development
- **Tailwind CSS 4.1** - Utility-first CSS framework

### UI Components
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful & consistent icon toolkit
- **Framer Motion** - Production-ready motion library

### Data & State Management
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation
- **TanStack Table** - Powerful table component

### Development Tools
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **SWC** - Fast JavaScript/TypeScript compiler

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── dashboard/               # Main dashboard application
│   │   ├── (auth)/             # Authenticated routes
│   │   │   ├── default/        # Customer Analytics Dashboard
│   │   │   ├── pages/          # Core pages (Products, Orders)
│   │   │   ├── sales/          # Sales and CRM modules
│   │   │   ├── ecommerce/      # E-commerce functionality
│   │   │   ├── project-management/ # Project tracking
│   │   │   ├── apps/           # Application modules
│   │   │   └── layout.tsx      # Dashboard layout
│   │   └── (guest)/            # Public routes (Login, Register)
│   ├── globals.css             # Global styles
│   ├── themes.css              # Theme definitions
│   └── layout.tsx              # Root layout
├── components/                  # Reusable components
│   ├── ui/                     # shadcn/ui components
│   ├── layout/                 # Layout components
│   └── theme-customizer/       # Theme customization
├── lib/                        # Utility functions
├── hooks/                      # Custom React hooks
└── public/                     # Static assets
```

## 🎯 Key Modules

### 1. Customer Analytics Dashboard
- **Summary Cards** - Key performance indicators
- **Project Overview Charts** - Visual project analytics
- **Success Metrics** - Business performance tracking
- **Recent Projects Table** - Project status overview
- **Reminders System** - Task and deadline management

### 2. VPS Cloud Management
- **VPS Products Table** - Comprehensive product catalog
- **Instance Management** - Deploy, monitor, and manage VPS
- **Service Categories** - GPU VPS, Managed Services, Add-ons
- **Real-time Monitoring** - Performance and resource tracking

### 3. E-commerce Platform
- **Product Catalog** - Rich product listings with images
- **Order Management** - Complete order lifecycle
- **Inventory Tracking** - Stock management and alerts
- **Customer Portal** - Self-service customer interface

### 4. Sales CRM
- **Lead Management** - Capture and track potential customers
- **Sales Pipeline** - Visual sales process management
- **Performance Analytics** - Sales team metrics
- **Customer Database** - Comprehensive customer profiles

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+ (LTS recommended)
- **npm**, **yarn**, or **pnpm** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/darioristic/t-2-cloud-admin-panel.git
   cd t-2-cloud-admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="your-database-url"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# External Services
STRIPE_SECRET_KEY="your-stripe-key"
AWS_ACCESS_KEY_ID="your-aws-key"
```

### Theme Customization
The application includes a comprehensive theme system:
- **Color Schemes** - Custom primary, secondary, and accent colors
- **Layout Options** - Sidebar positioning and navigation styles
- **Component Styling** - Consistent design system across all components

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Adaptive layouts for medium screens
- **Desktop Experience** - Full-featured desktop interface
- **Touch Friendly** - Optimized for touch interactions

## 🔒 Security Features

- **Authentication** - Secure login and registration
- **Authorization** - Role-based access control
- **Data Validation** - Input sanitization and validation
- **CSRF Protection** - Cross-site request forgery prevention
- **Secure Headers** - Security-focused HTTP headers

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📊 Performance

- **Code Splitting** - Automatic route-based code splitting
- **Image Optimization** - Next.js Image component optimization
- **Bundle Analysis** - Webpack bundle analyzer integration
- **Lazy Loading** - Component and route lazy loading
- **Caching** - Strategic caching strategies

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure responsive design compatibility
- Write comprehensive tests
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/darioristic/t-2-cloud-admin-panel/wiki)
- **Issues**: [GitHub Issues](https://github.com/darioristic/t-2-cloud-admin-panel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/darioristic/t-2-cloud-admin-panel/discussions)

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Next.js Team** - Amazing React framework
- **Vercel** - Deployment and hosting platform
- **Tailwind CSS** - Utility-first CSS framework

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**

*For more information, visit [https://github.com/darioristic/t-2-cloud-admin-panel](https://github.com/darioristic/t-2-cloud-admin-panel)*
