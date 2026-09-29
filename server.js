const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory Database for Demo
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        description: "High-quality noise-canceling wireless headphones with up to 30 hours of battery life.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 149.99,
        description: "Sleek smartwatch with heart rate tracking, GPS, and custom watch faces.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        name: "Ergonomic Gaming Chair",
        price: 220.00,
        description: "Comfortable lumbar-support chair designed for long gaming or working hours.",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 4,
        name: "Mechanical Keyboard",
        price: 79.50,
        description: "RGB backlit mechanical keyboard with tactile switches for responsive typing.",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60"
    }
];

const orders = [];

// --- API ENDPOINTS ---

// Get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Get single product details by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

// Process Order Endpoint
app.post('/api/orders', (req, res) => {
    const { customerInfo, cartItems, totalAmount } = req.body;

    if (!customerInfo || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid order data." });
    }

    const newOrder = {
        orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        customerInfo,
        cartItems,
        totalAmount,
        date: new Date()
    };

    orders.push(newOrder);

    console.log("New Order Received:", newOrder);

    res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        orderId: newOrder.orderId
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});