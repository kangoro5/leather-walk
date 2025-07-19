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
    // NOTE: 'color' field added back to mock data
    const [products, setProducts] = useState([
        { id: 'PROD001', name: 'Classic Oxford', stock: 150, price: 12000, image: '/images/shoe1.jpg', color: 'Brown' },
        { id: 'PROD002', name: 'Modern Sneaker', stock: 200, price: 9500, image: '/images/shoe2.jpg', color: 'White' },
        { id: 'PROD003', name: 'Vintage Brogue', stock: 80, price: 13500, image: '/images/shoe3.jpg', color: 'Black' },
        { id: 'PROD004', name: 'Elegant Loafer', stock: 120, price: 11000, image: '/images/shoe4.jpg', color: 'Blue' },
        { id: 'PROD005', name: 'Urban Derby', stock: 90, price: 12500, image: '/images/shoe5.jpg', color: 'Grey' },
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
        // Initialize with default values, including 'color'
        setCurrentProduct({ id: '', name: '', stock: 0, price: 0, image: '', color: '' });
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

    const handleSaveProduct = async (productData) => {
        try {
            // Important: When sending a file, you typically use FormData
            // If productData.image is a File object, this needs special handling
            // For now, we assume if it's a string, it's a URL, otherwise it's a File

            const method = productData.id ? 'PUT' : 'POST';
            const url = productData.id ? `/api/products/${productData.id}` : '/api/products';

            const formDataToSend = new FormData();
            for (const key in productData) {
                // If the key is 'image' and its value is a File object, append it directly
                // Otherwise, append as a string
                if (key === 'image' && productData[key] instanceof File) {
                    formDataToSend.append(key, productData[key]);
                } else {
                    formDataToSend.append(key, productData[key]);
                }
            }

            // Note: When sending FormData, you usually don't set 'Content-Type': 'application/json'
            // The browser sets the correct 'multipart/form-data' header automatically.
            const res = await fetch(url, {
                method: method,
                // headers: { 'Content-Type': 'application/json' }, // REMOVE for FormData
                body: formDataToSend, // Send FormData
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Failed to save product. Status: ${res.status}`);
            }

            const savedProduct = await res.json();
            console.log('Product saved successfully to API:', savedProduct);
            alert('Product saved successfully!');

            // For demonstration, let's update local state with savedProduct if it comes back with a new image URL
            if (productData.id) {
                setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
            } else {
                setProducts([...products, savedProduct]); // Use the savedProduct from the API, which should have a real ID and image URL
            }

            setIsModalOpen(false);
            setCurrentProduct(null);

        } catch (e) {
            console.error("Error saving product:", e);
            alert(`There was an error saving the product: ${e.message}`);
        }
    };

    // Order Management Handlers (unchanged)
    const handleUpdateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    // User Management Handlers (unchanged)
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
                                        <th className="py-3 px-4 text-left text-amber-800 font-semibold">Color</th>
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
                                            <td className="py-3 px-4 text-amber-900">{product.color || 'N/A'}</td>
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
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out forwards;
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

// Helper Component for Sidebar Links (unchanged)
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

// Helper Component for Dashboard Stat Cards (unchanged)
const StatCard = ({ icon, title, value, color }) => (
    <div className={`p-6 rounded-xl shadow-md flex items-center gap-4 ${color}`}>
        <div className="text-5xl opacity-75">{icon}</div>
        <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    </div>
);

// Product Add/Edit Modal Component (MODIFIED for File Upload)
const ProductModal = ({ product, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        id: product.id || '',
        name: product.name || '',
        stock: product.stock || 0,
        price: product.price || 0,
        image: product.image || '', // This will hold a URL or a File object temporarily
        color: product.color || ''
    });

    // To display a preview of the image
    const [imagePreview, setImagePreview] = useState(product.image || '');

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'image' && files && files[0]) {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file })); // Store the File object
            setImagePreview(URL.createObjectURL(file)); // Create a URL for preview
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // The handleSaveProduct function is now set up to handle FormData,
        // which correctly transmits File objects.
        await onSave(formData);
    };

    const productColors = ['Black', 'Brown', 'White', 'Blue', 'Green', 'Red', 'Yellow', 'Multi-color', 'Other'];

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
                    <div>
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
                    </div>
                    <div>
                        <label htmlFor="color" className="block text-amber-800 text-sm font-semibold mb-2">Color</label>
                        <select
                            id="color"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-amber-900 bg-white"
                            required
                        >
                            <option value="">Select Color</option>
                            {productColors.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="image" className="block text-amber-800 text-sm font-semibold mb-2">Upload Image</label>
                        <input
                            type="file" // Changed to file input
                            id="image"
                            name="image"
                            accept="image/*" // Restrict to image files
                            onChange={handleChange}
                            className="w-full p-2 border border-amber-300 rounded-lg bg-white text-amber-900"
                            // If editing an existing product and there's no new file, it's not required.
                            // If adding a new product, it might be required (consider your backend).
                            // For simplicity, I'm making it required if adding, but not required if editing and an image already exists.
                            required={!product.id}
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Product Preview"
                                className="mt-3 w-24 h-24 object-cover rounded-lg border border-amber-200 shadow self-center"
                            />
                        )}
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