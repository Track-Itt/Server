const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const customerInvoiceRoutes = require('./routes/customerInvoiceRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const productRoutes=require('./routes/productRoutes');
const productTransferRoutes = require('./routes/productTransferRoutes');
const userRoutes = require('./routes/userRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const chartRoutes=require('./routes/chartRoutes');

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
dotenv.config();
connectDB();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
  
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/customerInvoice", customerInvoiceRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/warehouse", warehouseRoutes);
app.use("/productTransfer", productTransferRoutes);
app.use("/chart", chartRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`.yellow.bold);
});
