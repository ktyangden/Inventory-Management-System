import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Products from './components/Products';
import InsertProduct from './components/InsertProduct'
import UpdateProduct from './components/UpdateProduct';
import About from './components/About';
import Categories from './components/Categories';
import Suppliers from './components/Suppliers';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar title="IMS" about="About" />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/insertproduct" element={<InsertProduct />} />
          <Route path="/updateproduct/:id" element={<UpdateProduct />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
