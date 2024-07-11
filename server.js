const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const secretKey = 'your_secret_key'; // Убедитесь, что этот ключ совпадает с тем, который использовался при генерации токена

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use(limiter);

const readJSONFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

const writeJSONFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const users = [{ username: 'admin', password: 'password' }];

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(403);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const products = await readJSONFile('products.json');
    const newProduct = req.body;
    products.push(newProduct);
    await writeJSONFile('products.json', products);
    res.status(201).send('Product added');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Error adding product');
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const products = await readJSONFile('products.json');
    const updatedProduct = req.body;
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      await writeJSONFile('products.json', products);
      res.status(200).send('Product updated');
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const products = await readJSONFile('products.json');
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index !== -1) {
      products.splice(index, 1);
      await writeJSONFile('products.json', products);
      res.status(200).send('Product deleted');
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await readJSONFile('products.json');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

app.get('/api/products/search', async (req, res) => {
  try {
    const products = await readJSONFile('products.json');
    const { name, minPrice, maxPrice } = req.query;
    let filteredProducts = products;

    if (name) {
      filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => {
        return product.bundles.some(bundle => bundle.price >= parseFloat(minPrice));
      });
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => {
        return product.bundles.some(bundle => bundle.price <= parseFloat(maxPrice));
      });
    }

    res.json(filteredProducts);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).send('Error searching products');
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orders = await readJSONFile('orders.json');
    const newOrder = {
      id: uuidv4(),
      ...req.body,
      status: 'Pending', // Присваиваем статус "Pending"
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    await writeJSONFile('orders.json', orders);
    res.status(201).send('Order created');
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Error creating order');
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await readJSONFile('orders.json');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders');
  }
});

app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const orders = await readJSONFile('orders.json');
    const index = orders.findIndex(order => order.id === req.params.id);
    if (index !== -1) {
      orders[index].status = status;
      await writeJSONFile('orders.json', orders);
      res.status(200).send('Order status updated');
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).send('Error updating order status');
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
