import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load environment variables
config();

const prisma = new PrismaClient();

// Generisanje 20 kompanija svake vrste
const generateCompanies = () => {
  const companies = [];
  const cities = ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Zagreb', 'Ljubljana', 'Sarajevo', 'Podgorica', 'Skopje'];
  const countries = ['RS', 'HR', 'SI', 'BA', 'ME', 'MK'];
  const companyTypes = ['CUSTOMER', 'SUPPLIER', 'PARTNER', 'INTERNAL'] as const;
  
  const businessNames = {
    CUSTOMER: ['TechCorp Solutions', 'Digital Innovations', 'Enterprise Systems', 'Cloud Services Inc', 'Software Solutions'],
    SUPPLIER: ['Global Imports LLC', 'Manufacturing Plus', 'Supply Chain Experts', 'Hardware Supplies', 'Distribution Network'],
    PARTNER: ['Innovation Partners', 'Strategic Ventures', 'Business Partners Co', 'Consulting Group', 'Financial Partners'],
    INTERNAL: ['Collector Dashboard', 'Internal Operations', 'Main Company', 'Headquarters', 'Core Business']
  };

  let companyId = 1;
  
  companyTypes.forEach(type => {
    for (let i = 0; i < 20; i++) {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const nameTemplate = businessNames[type][Math.floor(Math.random() * businessNames[type].length)];
      const suffix = i > 0 ? ` ${i + 1}` : '';
      
      companies.push({
        name: `${nameTemplate}${suffix}`,
        type,
        taxNumber: `${type.substring(0, 2).toUpperCase()}${companyId.toString().padStart(8, '0')}`,
        registrationNumber: `REG${companyId.toString().padStart(6, '0')}`,
        city,
        country,
        address: `${city} Street ${Math.floor(Math.random() * 200) + 1}`,
      });
      companyId++;
    }
  });

  return companies;
};

const companies = generateCompanies();

const firstNames = [
  'Marko', 'Ana', 'Nikola', 'Jelena', 'Stefan', 'Milica', 'Aleksandar', 'Jovana', 'Đorđe', 'Tamara',
  'Ivan', 'Sanja', 'Miloš', 'Jovana', 'Petar', 'Marija', 'Luka', 'Jelena', 'Nemanja', 'Milena',
  'Filip', 'Teodora', 'Stefan', 'Ana', 'Marko', 'Jovana', 'Nikola', 'Milica', 'Aleksandar', 'Tamara'
];

const lastNames = [
  'Petrović', 'Jovanović', 'Nikolić', 'Đorđević', 'Ilić', 'Marković', 'Stanković', 'Pavlović', 'Simić', 'Kovačević',
  'Milošević', 'Radović', 'Popović', 'Tomić', 'Lazić', 'Mitić', 'Đukić', 'Stefanović', 'Milošević', 'Radulović'
];

const positions = [
  'CEO', 'CTO', 'CFO', 'Sales Manager', 'Marketing Director', 'Product Manager', 'HR Manager', 'Operations Manager',
  'Business Development', 'Project Manager', 'Account Manager', 'Technical Lead', 'Finance Director', 'IT Manager',
  'Customer Success', 'Quality Assurance', 'Procurement Manager', 'Logistics Coordinator', 'Legal Counsel', 'Data Analyst'
];

const departments = [
  'Executive', 'Sales', 'Marketing', 'IT', 'Finance', 'Operations', 'Human Resources', 'Customer Success',
  'Business Development', 'Quality Assurance', 'Procurement', 'Logistics', 'Legal', 'Data Analytics', 'Research & Development'
];

const tags = [
  ['vip', 'decision_maker'], ['technical', 'senior'], ['sales'], ['marketing'], ['finance'], ['operations'],
  ['customer_success'], ['business_development'], ['quality'], ['procurement'], ['logistics'], ['legal'],
  ['data_analytics'], ['research'], ['junior'], ['mid_level'], ['executive'], ['manager'], ['director'], ['specialist']
];

const productCategories = [
  'Software', 'Hardware', 'Services', 'Consulting', 'Training', 'Support', 'Maintenance', 'Custom Development',
  'Cloud Solutions', 'Data Analytics', 'Security', 'Integration', 'Automation', 'Digital Transformation',
  'Mobile Apps', 'Web Development', 'Database', 'Infrastructure', 'Networking', 'Backup Solutions'
];

const currencies = ['EUR', 'USD', 'RSD', 'HRK'];
const statuses = {
  offer: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
  order: ['DRAFT', 'CONFIRMED', 'FULFILLED', 'CANCELLED'],
  delivery: ['PREPARED', 'DELIVERED', 'SIGNED'],
  invoice: ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']
};

async function main() {
  console.log('🌱 Starting enhanced seed with 20 entities per type...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.invoice.deleteMany({});
  await prisma.delivery.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.offer.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.relationship.deleteMany({});
  await prisma.company.deleteMany({});

  console.log('🏢 Creating 80 companies (20 per type)...');
  const createdCompanies = [];

  for (const company of companies) {
    const created = await prisma.company.create({
      data: {
        ...company,
        email: `info@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+381${Math.floor(10000000 + Math.random() * 90000000)}`,
        postalCode: `${Math.floor(10000 + Math.random() * 90000)}`,
        notes: `${company.type} company based in ${company.city}, ${company.country}`,
      },
    });
    createdCompanies.push(created);
    console.log(`  ✓ Created: ${created.name} (${created.type})`);
  }

  console.log(`\n👥 Creating 80 contacts (1 per company)...`);
  let contactCount = 0;

  for (let i = 0; i < createdCompanies.length; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const selectedTags = tags[Math.floor(Math.random() * tags.length)];
    const company = createdCompanies[i];

    const contact = await prisma.contact.create({
      data: {
        companyId: company.id,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+381${Math.floor(60000000 + Math.random() * 40000000)}`,
        position,
        department,
        tags: selectedTags,
        isPrimary: true,
        notes: `Primary contact for ${company.name} - ${position} in ${department}`,
      },
    });
    contactCount++;
    console.log(`  ✓ Created: ${contact.firstName} ${contact.lastName} (${company.name})`);
  }

  // Create relationships
  console.log('\n🔗 Creating 20 relationships...');
  const relationshipCount = 20;
  
  for (let i = 0; i < relationshipCount; i++) {
    const sourceIdx = Math.floor(Math.random() * createdCompanies.length);
    let targetIdx = Math.floor(Math.random() * createdCompanies.length);
    
    // Ensure source and target are different
    while (targetIdx === sourceIdx) {
      targetIdx = Math.floor(Math.random() * createdCompanies.length);
    }

    const types: Array<'SUPPLIER' | 'CUSTOMER' | 'PARTNER'> = ['SUPPLIER', 'CUSTOMER', 'PARTNER'];
    const relationType = types[Math.floor(Math.random() * types.length)];

    try {
      await prisma.relationship.create({
        data: {
          sourceCompanyId: createdCompanies[sourceIdx].id,
          targetCompanyId: createdCompanies[targetIdx].id,
          relationType,
          status: 'ACTIVE',
        },
      });
      console.log(`  ✓ ${createdCompanies[sourceIdx].name} → ${createdCompanies[targetIdx].name} (${relationType})`);
    } catch (error) {
      // Skip if relationship already exists
      console.log(`  ⊘ Relationship already exists, skipping...`);
    }
  }

  // Create Offers
  console.log('\n📋 Creating 20 offers...');
  const createdOffers = [];
  const internalCompanies = createdCompanies.filter(c => c.type === 'INTERNAL');
  const customers = createdCompanies.filter(c => c.type === 'CUSTOMER');

  for (let i = 0; i < 20; i++) {
    const customer = customers[i % customers.length];
    const internalCompany = internalCompanies[Math.floor(Math.random() * internalCompanies.length)];
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + Math.floor(Math.random() * 60) + 7); // 7-67 days

    const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const items = [];
    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const category = productCategories[Math.floor(Math.random() * productCategories.length)];
      const quantity = Math.floor(Math.random() * 20) + 1;
      const price = Math.floor(Math.random() * 1000) + 50;
      const taxRate = 20;
      const total = quantity * price * (1 + taxRate / 100);
      
      items.push({
        productId: `PROD-${i}-${j}`,
        productName: `${category} Solution ${j + 1}`,
        quantity,
        price,
        taxRate,
        total,
      });
      
      subtotal += quantity * price;
    }

    const tax = subtotal * 0.2;
    const total = subtotal + tax;
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const status = statuses.offer[Math.floor(Math.random() * statuses.offer.length)];

    const offer = await prisma.offer.create({
      data: {
        offerNo: `OFF-${Date.now()}-${i.toString().padStart(3, '0')}`,
        companyId: internalCompany.id,
        customerId: customer.id,
        items,
        subtotal,
        tax,
        total,
        currency,
        validUntil,
        status,
        notes: `Comprehensive ${status.toLowerCase()} offer for ${customer.name}`,
      },
    });
    createdOffers.push(offer);
    console.log(`  ✓ Created offer: ${offer.offerNo} for ${customer.name} (${status})`);
  }

  // Create Orders
  console.log('\n📦 Creating 20 orders...');
  const createdOrders = [];
  
  for (let i = 0; i < 20; i++) {
    const customer = customers[i % customers.length];
    const internalCompany = internalCompanies[Math.floor(Math.random() * internalCompanies.length)];
    const offer = Math.random() > 0.5 ? createdOffers[Math.floor(Math.random() * createdOffers.length)] : null;

    const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const items = [];
    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const category = productCategories[Math.floor(Math.random() * productCategories.length)];
      const quantity = Math.floor(Math.random() * 15) + 1;
      const price = Math.floor(Math.random() * 800) + 30;
      const taxRate = 20;
      const total = quantity * price * (1 + taxRate / 100);
      
      items.push({
        productId: `PROD-${i}-${j}`,
        productName: `${category} Service ${j + 1}`,
        quantity,
        price,
        taxRate,
        total,
      });
      
      subtotal += quantity * price;
    }

    const tax = subtotal * 0.2;
    const total = subtotal + tax;
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const status = statuses.order[Math.floor(Math.random() * statuses.order.length)];

    const order = await prisma.order.create({
      data: {
        orderNo: `ORD-${Date.now()}-${i.toString().padStart(3, '0')}`,
        companyId: internalCompany.id,
        customerId: customer.id,
        offerId: offer?.id,
        items,
        subtotal,
        tax,
        total,
        currency,
        status,
        notes: offer ? `Created from offer ${offer.offerNo}` : `Direct order for ${customer.name}`,
      },
    });
    createdOrders.push(order);
    console.log(`  ✓ Created order: ${order.orderNo} for ${customer.name} (${status})`);
  }

  // Create Deliveries
  console.log('\n🚚 Creating 20 deliveries...');
  const createdDeliveries = [];
  const fulfilledOrders = createdOrders.filter(o => o.status === 'FULFILLED');
  const confirmedOrders = createdOrders.filter(o => o.status === 'CONFIRMED');

  for (let i = 0; i < 20; i++) {
    const availableOrders = [...fulfilledOrders, ...confirmedOrders];
    const order = availableOrders[i % availableOrders.length];
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 14) + 1); // 1-14 days

    const items = order.items as any[];
    const status = statuses.delivery[Math.floor(Math.random() * statuses.delivery.length)];

    const delivery = await prisma.delivery.create({
      data: {
        deliveryNo: `DEL-${Date.now()}-${i.toString().padStart(3, '0')}`,
        orderId: order.id,
        deliveryDate,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
        })),
        status,
        notes: `Delivery for order ${order.orderNo} - ${status.toLowerCase()}`,
        signedBy: status === 'SIGNED' ? 'Customer Representative' : null,
        signedAt: status === 'SIGNED' ? new Date() : null,
      },
    });
    createdDeliveries.push(delivery);
    console.log(`  ✓ Created delivery: ${delivery.deliveryNo} (${status})`);
  }

  // Create Invoices
  console.log('\n💰 Creating 20 invoices...');
  let invoiceCount = 0;

  for (let i = 0; i < 20; i++) {
    const customer = customers[i % customers.length];
    const internalCompany = internalCompanies[Math.floor(Math.random() * internalCompanies.length)];
    const delivery = Math.random() > 0.3 ? createdDeliveries[Math.floor(Math.random() * createdDeliveries.length)] : null;
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 7); // 7-37 days

    const itemCount = Math.floor(Math.random() * 4) + 1; // 1-4 items
    const items = [];
    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const category = productCategories[Math.floor(Math.random() * productCategories.length)];
      const quantity = Math.floor(Math.random() * 25) + 1;
      const price = Math.floor(Math.random() * 1200) + 40;
      const taxRate = 20;
      const total = quantity * price * (1 + taxRate / 100);
      
      items.push({
        productId: `PROD-${i}-${j}`,
        productName: `${category} Product ${j + 1}`,
        quantity,
        price,
        taxRate,
        total,
      });
      
      subtotal += quantity * price;
    }

    const tax = subtotal * 0.2;
    const total = subtotal + tax;
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const status = statuses.invoice[Math.floor(Math.random() * statuses.invoice.length)];
    const issueDate = new Date();
    issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 30)); // Last 30 days

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo: `INV-${Date.now()}-${i.toString().padStart(3, '0')}`,
        companyId: internalCompany.id,
        customerId: customer.id,
        deliveryId: delivery?.id,
        items,
        subtotal,
        tax,
        total,
        currency,
        type: 'ISSUED',
        status,
        issueDate,
        dueDate,
        paidAt: status === 'PAID' ? new Date() : null,
        notes: `Invoice for ${customer.name}${delivery ? ` - Delivery ${delivery.deliveryNo}` : ''}`,
      },
    });
    invoiceCount++;
    console.log(`  ✓ Created invoice: ${invoice.invoiceNo} for ${customer.name} (${status})`);
  }

  console.log('\n✅ Enhanced seed completed!');
  console.log(`\n📊 Summary:`);
  console.log(`   • ${createdCompanies.length} companies created (20 per type)`);
  console.log(`   • ${contactCount} contacts created`);
  console.log(`   • ${relationshipCount} relationships created`);
  console.log(`   • ${createdOffers.length} offers created`);
  console.log(`   • ${createdOrders.length} orders created`);
  console.log(`   • ${createdDeliveries.length} deliveries created`);
  console.log(`   • ${invoiceCount} invoices created`);
  console.log(`\n🚀 Ready to test the application!`);
  console.log(`   Companies: http://localhost:3000/dashboard/contacts/companies`);
  console.log(`   Contacts: http://localhost:3000/dashboard/contacts/contacts`);
  console.log(`   Relationships: http://localhost:3000/dashboard/contacts/relationships`);
  console.log(`   Offers: http://localhost:3000/dashboard/sales/offers`);
  console.log(`   Orders: http://localhost:3000/dashboard/sales/orders`);
  console.log(`   Deliveries: http://localhost:3000/dashboard/operations/deliveries`);
  console.log(`   Invoices: http://localhost:3000/dashboard/finance/invoices\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

