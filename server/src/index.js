const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const propertyRoutes = require('./routes/properties');
const paymentRoutes = require('./routes/payments');
const messageRoutes = require('./routes/messages');
const fileRoutes = require('./routes/files');
const costRoutes = require('./routes/costs');
const estimateRoutes = require('./routes/estimates');
const invoiceRoutes = require('./routes/invoices');
const notificationRoutes = require('./routes/notifications');
const reportRoutes = require('./routes/reports');
const workOrderRoutes = require('./routes/workOrders');
// Import other routes here

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// API versioning
const API_V1 = '/api/v1';

app.use(`${API_V1}/auth`, authRoutes);
app.use(`${API_V1}/clients`, clientRoutes);
app.use(`${API_V1}/properties`, propertyRoutes);
app.use(`${API_V1}/payments`, paymentRoutes);
app.use(`${API_V1}/messages`, messageRoutes);
app.use(`${API_V1}/files`, fileRoutes);
app.use(`${API_V1}/costs`, costRoutes);
app.use(`${API_V1}/estimates`, estimateRoutes);
app.use(`${API_V1}/invoices`, invoiceRoutes);
app.use(`${API_V1}/notifications`, notificationRoutes);
app.use(`${API_V1}/reports`, reportRoutes);
app.use(`${API_V1}/work-orders`, workOrderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
