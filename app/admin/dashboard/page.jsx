'use client';
import React, { useState } from 'react';
import {
  FaTachometerAlt, FaBoxes, FaClipboardList, FaUsers, FaCog, FaSignOutAlt,
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaTimes, FaDollarSign, FaSortAmountUp, FaCalendarAlt
} from 'react-icons/fa';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'stock', 'orders', 'users', 'settings'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // For editing/adding products

  // Mock Data (replace with actual data from API or state management)
  const [products, setProducts] = useState([
    { id: 'PROD001', name: 'Classic Oxford', stock: 150, price: 12000, category: 'Formal', image: '/images/shoe1.jpg' },
    { id: 'PROD002', name: 'Modern Sneaker', stock: 200, price: 9500, category: 'Casual', image: '/images/shoe2.jpg' },
    { id: 'PROD003', name: 'Vintage Brogue', stock: 80, price: 13500, category: 'Formal', image: '/images/shoe3.jpg' },
    { id: 'PROD004', name: 'Elegant Loafer', stock: 120, price: 11000, category: 'Formal', image: '/images/shoe4.jpg' },
    { id: 'PROD005', name: 'Urban Derby', stock: 90, price: 12500, category: 'Casual', image: '/images/shoe5.jpg' },
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD001', customer: 'Jane Doe', total: 24000, status: 'Delivered', date: '2024-06-15' },
    { id: 'ORD002', customer: 'John Smith', total: 9500, status: 'Processing', date: '2024-07-01' },
    { id: 'ORD003', customer: 'Alice Johnson', total: 13500, status: 'Shipped', date: '2024-07-05' },
    { id: 'ORD004', customer: 'Bob Williams', total: 11000, status: 'Pending', date: '2024-07-08' },
  ]);

  const [users, setUsers] = useState([
    { id: 'USER001', name: 'Jane Doe', email: 'jane@example.com', role: 'Customer' },
    { id: 'USER002', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
    { id: 'USER003', name: 'Shop Manager', email: 'manager@example.com', role: 'Manager' },
  ]);

  // Dashboard Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Product Management Handlers
  const handleAddProduct = () => {
    setCurrentProduct({ id: '', name: '', stock: 0, price: 0, category: '', image: '' });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct({ ...product }); // Create a copy to avoid direct state mutation
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (productData) => {
    if (currentProduct.id) {
      // Edit existing product
      setProducts(products.map(p => p.id === productData.id ? productData : p));
    } else {
      // Add new product
      const newId = `PROD${String(products.length + 1).padStart(3, '0')}`;
      setProducts([...products, { ...productData, id: newId }]);
    }
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  // Order Management Handlers
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // User Management Handlers
  const handleUpdateUserRole = (userId, newRole) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
            <h2 className="text-3xl font-bold text-amber-900 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<FaBoxes />} title="Total Products" value={totalProducts} color="bg-blue-100 text-blue-800" />
              <StatCard icon={<FaSortAmountUp />} title="Total Stock Units" value={totalStock} color="bg-green-100 text-green-800" />
              <StatCard icon={<FaClipboardList />} title="Pending Orders" value={pendingOrders} color="bg-orange-100 text-orange-800" />
              <StatCard icon={<FaDollarSign />} title="Total Revenue" value={`Ksh ${totalRevenue.toLocaleString()}`} color="bg-purple-100 text-purple-800" />
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-bold text-amber-900 mb-4 border-b pb-2 border-amber-200">Recent Activity</h3>
              <ul className="space-y-3 text-amber-800">
                <li><span className="font-semibold">2024-07-10:</span> New product "Elegant Loafer" added.</li>
                <li><span className="font-semibold">2024-07-09:</span> Order ORD004 status changed to "Pending".</li>
                <li><span className="font-semibold">2024-07-08:</span> User Jane Doe updated profile.</li>
              </ul>
            </div>
          </div>
        );
      case 'stock':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 border-b pb-4 border-amber-200">Stock Management</h2>
            <button
              onClick={handleAddProduct}
              className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-200 flex items-center gap-2 mb-6"
            >
              <FaPlus /> Add New Product
            </button>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-md">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold rounded-tl-xl">ID</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Image</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Name</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Stock</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Price (Ksh)</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Category</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-b border-amber-100 last:border-b-0 hover:bg-amber-50">
                      <td className="py-3 px-4 text-amber-900">{product.id}</td>
                      <td className="py-3 px-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                      </td>
                      <td className="py-3 px-4 text-amber-900 font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-amber-900">{product.stock}</td>
                      <td className="py-3 px-4 text-amber-900">{product.price.toLocaleString()}</td>
                      <td className="py-3 px-4 text-amber-900">{product.category}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-800 transition-colors"><FaEdit /></button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800 transition-colors"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 border-b pb-4 border-amber-200">Order Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-md">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold rounded-tl-xl">Order ID</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Customer</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Total (Ksh)</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Status</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Date</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-amber-100 last:border-b-0 hover:bg-amber-50">
                      <td className="py-3 px-4 text-amber-900">{order.id}</td>
                      <td className="py-3 px-4 text-amber-900">{order.customer}</td>
                      <td className="py-3 px-4 text-amber-900">{order.total.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200
                            ${order.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                              order.status === 'Processing' ? 'bg-blue-200 text-blue-800' :
                              order.status === 'Shipped' ? 'bg-purple-200 text-purple-800' :
                              'bg-orange-200 text-orange-800'}
                          `}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-amber-900">{order.date}</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors"><FaEye /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 border-b pb-4 border-amber-200">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-md">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold rounded-tl-xl">User ID</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Name</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Email</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold">Role</th>
                    <th className="py-3 px-4 text-left text-amber-800 font-semibold rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-amber-100 last:border-b-0 hover:bg-amber-50">
                      <td className="py-3 px-4 text-amber-900">{user.id}</td>
                      <td className="py-3 px-4 text-amber-900 font-medium">{user.name}</td>
                      <td className="py-3 px-4 text-amber-900">{user.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200
                            ${user.role === 'Admin' ? 'bg-red-200 text-red-800' :
                              user.role === 'Manager' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-gray-200 text-gray-800'}
                          `}
                        >
                          <option value="Customer">Customer</option>
                          <option value="Manager">Manager</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 transition-colors"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 border-b pb-4 border-amber-200">Admin Settings</h2>
            <p className="text-amber-800 mb-6">Manage general settings for your dashboard and store operations.</p>
            <div className="space-y-4">
              <div className="bg-amber-50 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-amber-900 mb-2">General Preferences</h3>
                <label className="flex items-center text-amber-800">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-amber-600 rounded" />
                  <span className="ml-2">Enable email notifications for new orders</span>
                </label>
              </div>
              <div className="bg-amber-50 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-amber-900 mb-2">Security</h3>
                <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-full transition duration-200">
                  Change Admin Password
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-200 flex">
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

      {/* Sidebar Navigation */}
      <div className="w-64 bg-amber-800 text-white flex flex-col justify-between p-6 shadow-xl">
        <div>
          <div className="flex items-center mb-10">
            <FaTachometerAlt className="text-4xl text-amber-200 mr-3" />
            <span className="text-2xl font-bold tracking-wide">Admin Panel</span>
          </div>
          <nav className="space-y-3">
            <SidebarLink icon={<FaTachometerAlt />} label="Dashboard" tab="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={<FaBoxes />} label="Stock Management" tab="stock" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={<FaClipboardList />} label="Orders" tab="orders" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={<FaUsers />} label="Users" tab="users" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarLink icon={<FaCog />} label="Settings" tab="settings" activeTab={activeTab} setActiveTab={setActiveTab} />
          </nav>
        </div>
        <button className="w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg bg-amber-700 hover:bg-amber-600 transition-colors duration-200 mt-8">
          <FaSignOutAlt className="text-xl" /> Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <ProductModal
          product={currentProduct}
          onSave={handleSaveProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

// Helper Component for Sidebar Links
const SidebarLink = ({ icon, label, tab, activeTab, setActiveTab }) => (
  <button
    className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${
      activeTab === tab ? 'bg-amber-700 shadow-inner' : 'hover:bg-amber-700/50'
    }`}
    onClick={() => setActiveTab(tab)}
  >
    {icon} {label}
  </button>
);

// Helper Component for Dashboard Stat Cards
const StatCard = ({ icon, title, value, color }) => (
  <div className={`p-6 rounded-xl shadow-md flex items-center gap-4 ${color}`}>
    <div className="text-5xl opacity-75">{icon}</div>
    <div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

// Product Add/Edit Modal Component
const ProductModal = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState(product);

  // For image preview
  const [imagePreview, setImagePreview] = useState(formData.image || '');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If image is a File, you would handle upload here in a real app
    // For demo, just pass the preview URL or file name
    let productData = { ...formData };
    if (formData.image instanceof File) {
      productData.image = imagePreview; // Use preview as image src for demo
    }
    onSave(productData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-scaleIn">
        <button
          className="absolute top-4 right-4 text-amber-700 hover:text-red-600 text-2xl transition-colors duration-200"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <h2 className="text-3xl font-bold text-amber-900 mb-6 border-b pb-4 border-amber-200">
          {product.id ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Flex row for name and color */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="name" className="block text-amber-800 text-sm font-semibold mb-2">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-amber-900"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="color" className="block text-amber-800 text-sm font-semibold mb-2">Color</label>
              <select
                id="color"
                name="color"
                value={formData.color || ''}
                onChange={handleChange}
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-amber-900 bg-white"
                required
              >
                <option value="">Select color</option>
                <option value="Black">Black</option>
                <option value="Brown">Brown</option>
                <option value="Tan">Tan</option>
                <option value="Cognac">Cognac</option>
                <option value="Burgundy">Burgundy</option>
                <option value="Navy">Navy</option>
                <option value="Grey">Grey</option>
                <option value="White">White</option>
                <option value="Olive">Olive</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {/* Flex row for stock and size */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="stock" className="block text-amber-800 text-sm font-semibold mb-2">Stock Quantity</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-amber-900"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="size" className="block text-amber-800 text-sm font-semibold mb-2">Size</label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size || ''}
                onChange={handleChange}
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-amber-900"
                placeholder="e.g., 42, 43, 44"
                required
              />
            </div>
          </div>
          {/* Flex row for price and image */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="price" className="block text-amber-800 text-sm font-semibold mb-2">Price (Ksh)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-amber-900"
                required
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="image" className="block text-amber-800 text-sm font-semibold mb-2">Upload Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border border-amber-300 rounded-lg bg-white text-amber-900"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-3 w-24 h-24 object-cover rounded-lg border border-amber-200 shadow self-center"
                />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-5 rounded-full transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-200"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}