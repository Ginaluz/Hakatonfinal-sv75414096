const express = require('express');
const bodyParser = require('body-parser');
const Culqi = require('culqi-node');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const products = [
  { id: 1, name: "2 Mancuernas", price: 50, stock: 50, category: 'Fitness' },
  { id: 2, name: "Banco ajustable", price: 50, stock: 50, category: 'Fitness' },
  { id: 3, name: "Kit de pesas con estuche", price: 50, stock: 50, category: 'Fitness' },
  { id: 4, name: "Pesas", price: 50, stock: 50, category: 'Fitness' },
  { id: 5, name: "Pesa de 30Kg", price: 50, stock: 50, category: 'Fitness' },
  { id: 6, name: "Bolsa de boxeo con pie", price: 50, stock: 50, category: 'Boxing' },
];

let users = [];
let cart = [];
let purchases = [];

// API - Home (Listado de productos)
app.get('/api/products', (req, res) => {
  res.json(products);
});

// API - Filtros de búsqueda
app.get('/api/products/search', (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  let filteredProducts = products;

  if (name) {
    filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= Number(minPrice));
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= Number(maxPrice));
  }

  res.json(filteredProducts);
});

// API - Categorías
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(product => product.category))];
  res.json(categories);
});

// API - Registro de usuarios
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.json({ message: 'Usuario registrado con éxito' });
});

// API - Login de usuarios
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ message: 'Inicio de sesión exitoso' });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

// API - Checkout (Carrito de compras)
app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  if (product && product.stock >= quantity) {
    cart.push({ productId, quantity });
    res.json({ message: 'Producto añadido al carrito' });
  } else {
    res.status(400).json({ message: 'Producto no disponible en la cantidad solicitada' });
  }
});

// API - Pasarela de pagos (Culqi)
const culqi = new Culqi({ privateKey: 'sk_test_SWyklAB8rIyjXmje' });  // Asegúrate de pasar un objeto con la propiedad privateKey
app.post('/api/checkout', async (req, res) => {
  const { token, installments } = req.body;
  try {
    const amount = cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product.price * item.quantity);
    }, 0);

    const charge = await culqi.charge.create({
      amount: amount * 100, // Convertir a centavos
      currency_code: 'PEN',
      email: 'test@example.com', // Este debe ser el email del usuario
      source_id: token,
      installments: installments
    });

    purchases.push(...cart);
    cart = [];
    res.json(charge);
  } catch (error) {
    res.status(500).json(error);
  }
});

// API - Mis Compras
app.get('/api/purchases', (req, res) => {
  res.json(purchases);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
