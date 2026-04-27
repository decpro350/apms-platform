const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Password hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // 2. Maintenance Provider Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@apms.pro' },
    update: {},
    create: {
      email: 'admin@apms.pro',
      password: hashedPassword,
      firstName: 'APMS',
      lastName: 'Admin',
      role: 'PROVIDER_ADMIN',
    },
  });
  console.log('Created Provider Admin');

  // 3. Clients (3 Property Owners)
  const clientsData = [
    { name: 'Redwood Properties', email: 'billing@redwood.com', threshold: 500, emergency: 1000 },
    { name: 'Skyline Real Estate', email: 'finance@skyline.com', threshold: 750, emergency: 1500 },
    { name: 'Urban Living Group', email: 'accounting@urbanliving.com', threshold: 300, emergency: 800 },
  ];

  const clients = [];
  for (const c of clientsData) {
    const client = await prisma.client.create({
      data: {
        name: c.name,
        billingEmail: c.email,
        defaultApprovalThreshold: c.threshold,
        emergencyApprovalLimit: c.emergency,
      },
    });
    clients.push(client);

    // Create a Client Owner user for each client
    await prisma.user.create({
      data: {
        email: `owner@${c.name.split(' ')[0].toLowerCase()}.com`,
        password: hashedPassword,
        firstName: 'Client',
        lastName: 'Owner',
        role: 'CLIENT_OWNER',
        clientId: client.id,
      },
    });
  }
  console.log('Created 3 Clients and Owners');

  // 4. Properties (5 total)
  const propertyNames = ['Sunset Gardens', 'Oak Ridge', 'The Summit', 'Riverfront Lofts', 'Valley View'];
  const properties = [];
  for (let i = 0; i < 5; i++) {
    const property = await prisma.property.create({
      data: {
        clientId: clients[i % 3].id,
        name: propertyNames[i],
        address: `${100 + i * 50} Main St, Springfield`,
        type: 'Apartment Complex',
      },
    });
    properties.push(property);
  }
  console.log('Created 5 Properties');

  // 5. Buildings (8 total)
  const buildings = [];
  for (let i = 0; i < 8; i++) {
    const building = await prisma.building.create({
      data: {
        propertyId: properties[i % 5].id,
        name: `Building ${String.fromCharCode(65 + i)}`,
      },
    });
    buildings.push(building);
  }
  console.log('Created 8 Buildings');

  // 6. Units (20 total) & 7. Tenants (15 total)
  const tenants = [];
  for (let i = 0; i < 20; i++) {
    const unit = await prisma.unit.create({
      data: {
        buildingId: buildings[i % 8].id,
        number: `Unit ${101 + i}`,
        floor: Math.floor(i / 8) + 1,
        occupancyStatus: i < 15 ? 'Occupied' : 'Vacant',
      },
    });

    if (i < 15) {
      const user = await prisma.user.create({
        data: {
          email: `tenant${i + 1}@example.com`,
          password: hashedPassword,
          firstName: `Tenant`,
          lastName: `${i + 1}`,
          role: 'TENANT',
        },
      });

      const tenant = await prisma.tenant.create({
        data: {
          userId: user.id,
          unitId: unit.id,
        },
      });
      tenants.push(tenant);
    }
  }
  console.log('Created 20 Units and 15 Tenants');

  // 8. Technicians (4)
  const technicians = [];
  const roles = ['Plumbing', 'Electrical', 'HVAC', 'General'];
  for (let i = 0; i < 4; i++) {
    const user = await prisma.user.create({
      data: {
        email: `tech${i + 1}@apms.pro`,
        password: hashedPassword,
        firstName: `Tech`,
        lastName: `${i + 1}`,
        role: 'TECHNICIAN',
      },
    });

    const tech = await prisma.technician.create({
      data: {
        userId: user.id,
        specialty: roles[i],
      },
    });
    technicians.push(tech);
  }
  console.log('Created 4 Technicians');

  // 9. Vendors (3)
  const vendors = [];
  for (let i = 0; i < 3; i++) {
    const user = await prisma.user.create({
      data: {
        email: `vendor${i + 1}@external.com`,
        password: hashedPassword,
        firstName: `Vendor`,
        lastName: `${i + 1}`,
        role: 'VENDOR',
      },
    });

    const vendor = await prisma.vendor.create({
      data: {
        userId: user.id,
        companyName: `Expert ${roles[i]} Services`,
        specialty: roles[i],
      },
    });
    vendors.push(vendor);
  }
  console.log('Created 3 Vendors');

  // 10. Maintenance Categories
  const categories = [];
  for (const role of roles) {
    const cat = await prisma.maintenanceCategory.create({
      data: { name: role },
    });
    categories.push(cat);
  }

  // 11. Work Orders (25 total)
  const statuses = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'];
  for (let i = 0; i < 25; i++) {
    const tenant = tenants[i % 15];
    const unit = await prisma.unit.findUnique({ where: { id: tenant.unitId }, include: { building: { include: { property: true } } } });
    
    const wo = await prisma.workOrder.create({
      data: {
        clientId: unit.building.property.clientId,
        propertyId: unit.building.property.id,
        unitId: unit.id,
        tenantId: tenant.id,
        categoryId: categories[i % 4].id,
        title: `Maintenance Request #${i + 1}`,
        description: `This is a sample description for work order #${i + 1}. Fix needed for ${roles[i % 4].toLowerCase()} issue.`,
        status: statuses[i % 5],
        priority: i % 10 === 0 ? 'EMERGENCY' : i % 3 === 0 ? 'HIGH' : 'MEDIUM',
      },
    });

    // Assignments for some
    if (wo.status !== 'SUBMITTED') {
      await prisma.workOrderAssignment.create({
        data: {
          workOrderId: wo.id,
          technicianId: technicians[i % 4].id,
        },
      });
    }

    // Costs for completed/closed
    if (['COMPLETED', 'CLOSED'].includes(wo.status)) {
      await prisma.workOrderCost.create({
        data: {
          workOrderId: wo.id,
          type: 'Labor',
          amount: 150.0,
          description: 'Standard repair labor',
        },
      });
      await prisma.workOrderCost.create({
        data: {
          workOrderId: wo.id,
          type: 'Material',
          amount: 45.0,
          description: 'Parts used',
        },
      });
    }
  }
  console.log('Created 25 Work Orders');

  // 12. Estimates & Approvals (6)
  for (let i = 0; i < 6; i++) {
    const wo = await prisma.workOrder.findFirst({ where: { status: 'SUBMITTED' } });
    if (wo) {
      await prisma.estimate.create({
        data: {
          workOrderId: wo.id,
          amount: 850.0,
          description: 'Extensive repair required for mainline. Requires parts and 4 hours labor.',
          approvalStatus: i % 2 === 0 ? 'PENDING' : 'APPROVED',
        },
      });
    }
  }
  console.log('Created 6 Estimates');

  // 13. Invoices (5)
  for (let i = 0; i < 5; i++) {
    const client = clients[i % 3];
    await prisma.invoice.create({
      data: {
        clientId: client.id,
        status: i % 2 === 0 ? 'SENT' : 'PAID',
        totalAmount: 1250.0,
        lineItems: {
          create: [
            { description: 'Monthly Maintenance Service', amount: 1000.0 },
            { description: 'Emergency Callout #1024', amount: 250.0 },
          ],
        },
      },
    });
  }
  console.log('Created 5 Invoices');

  // 14. Notifications (30)
  for (let i = 0; i < 30; i++) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        title: `System Alert #${i + 1}`,
        message: `This is a sample notification message for event #${i + 1}.`,
      },
    });
  }
  console.log('Created 30 Notifications');

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
