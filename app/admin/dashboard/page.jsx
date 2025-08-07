'use client';
import React, { useState, useEffect } from 'react';
import {
    FaTachometerAlt, FaBoxes, FaClipboardList, FaUsers, FaCog, FaSignOutAlt,
    FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaTimes, FaDollarSign, FaSortAmountUp, FaCalendarAlt, FaSpinner, FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // Adjust the import path as necessary
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [message, setMessage] = useState(''); // Global dashboard message
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [errorProducts, setErrorProducts] = useState(null);

    // New state for success modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Mock Data (will be replaced by fetched data for products)
    const [orders, setOrders] = useState([
        { id: 'ORD001', customer: 'Jane Doe', total: 24000, status: 'Delivered', date: '2024-06-15' },
        { id: 'ORD002', customer: 'John Smith', total: 9500, status: 'Processing', date: '2024-07-01' },
        { id: 'ORD003', customer: 'Alice Johnson', total: 13500, status: 'Shipped', date: '2024-07-05' },
        { id: 'ORD004', customer: 'Bob Williams', total: 11000, status: 'Pending', date: '2024-07-08' },
    ]);

    const [users, setUsers] = useState([]); // Initialize as empty array for fetched data
    const [loadingUsers, setLoadingUsers] = useState(false); // New state for user loading
    const [errorUsers, setErrorUsers] = useState(null);     // New state for user errors


    // --- EFFECT HOOK TO FETCH PRODUCTS ---
    useEffect(() => {
        if (activeTab === 'stock') {
            const fetchProducts = async () => {
                setLoadingProducts(true);
                setErrorProducts(null);
                try {
                    const res = await fetch('http://localhost:8000/api/products'); // Ensure this matches your backend URL

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.error || `Failed to fetch products. Status: ${res.status}`);
                    }

                    const data = await res.json();
                    setProducts(data);
                } catch (error) {
                    console.error("Error fetching products:", error);
                    setErrorProducts(error.message || 'Failed to fetch products.');
                } finally {
                    setLoadingProducts(false);
                }
            };

            fetchProducts();
        }
    }, [activeTab]);

    // --- NEW EFFECT HOOK TO FETCH USERS ---
    useEffect(() => {
        if (activeTab === 'users') {
            const fetchUsers = async () => {
                setLoadingUsers(true);
                setErrorUsers(null);
                try {
                    const res = await fetch('http://localhost:8000/api/users'); // Assuming this is your user API endpoint

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.error || `Failed to fetch users. Status: ${res.status}`);
                    }

                    const data = await res.json();
                    setUsers(data);
                } catch (error) {
                    console.error("Error fetching users:", error);
                    setErrorUsers(error.message || 'Failed to fetch users.');
                } finally {
                    setLoadingUsers(false);
                }
            };

            fetchUsers();
        }
    }, [activeTab]); // Dependency array: re-run when activeTab changes

    // Dashboard Stats
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    // Product Management Handlers
    const handleAddProduct = () => {
        setCurrentProduct({ _id: null, name: '', quantity: 0, price: 0, imageUrl: '', color: '', size: '' });
        setIsModalOpen(true);
        setMessage(''); // Clear global message when opening modal
    };

    const handleEditProduct = (product) => {
        setCurrentProduct({ ...product, quantity: product.quantity }); // Ensure quantity is passed
        setIsModalOpen(true);
        setMessage(''); // Clear global message when opening modal
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setMessage(''); // Clear previous message
            try {
                const res = await fetch(`http://localhost:8000/api/products/${id}`, { // Correct DELETE endpoint
                    method: 'DELETE',
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Failed to delete product. Status: ${res.status}`);
                }

                setProducts(products.filter(p => p._id !== id));
                setMessage('Product deleted successfully!');
            } catch (error) {
                console.error("Error deleting product:", error);
                setMessage(`Error deleting product: ${error.message}`);
            }
        }
    };

    // This function is now responsible for making the API call.
    // It will return true on success, false on failure (or throw error).
    const handleSaveProductApiCall = async (productData) => {
        const isNewProduct = !productData._id;
        let finalProductData = { ...productData };

        if (productData.image instanceof File) {
            // Step 1: Upload the image if a new file is selected
            const imageFormData = new FormData();
            imageFormData.append('image', productData.image);
            imageFormData.append('name', productData.name);
            imageFormData.append('quantity', productData.quantity);
            imageFormData.append('price', productData.price);
            imageFormData.append('color', productData.color);
            imageFormData.append('size', productData.size);

            const imageUploadRes = await fetch('http://localhost:8000/api/products/upload', {
                method: 'POST',
                body: imageFormData,
            });

            if (!imageUploadRes.ok) {
                const errorData = await imageUploadRes.json();
                throw new Error(errorData.error || `Failed to upload image. Status: ${imageUploadRes.status}`);
            }

            const imageData = await imageUploadRes.json();
            finalProductData.imageUrl = imageData.imageUrl;
            finalProductData.imagePublicId = imageData.imagePublicId;
            delete finalProductData.image;
        } else if (!isNewProduct && finalProductData.image) {
            // If it's an existing product and 'image' is not a File (means it's a string URL or empty),
            // ensure 'image' property is removed from finalProductData to avoid sending it to JSON body
            // if the backend is not expecting it. The imageUrl and imagePublicId are already correct.
            delete finalProductData.image;
        }


        // Step 2: Save/Update Product Data (with or without new image URL)
        const url = isNewProduct ? 'http://localhost:8000/api/products' : `http://localhost:8000/api/products/${finalProductData._id}`;
        const method = isNewProduct ? 'POST' : 'PATCH';

        const { _id, ...dataToSend } = finalProductData;
        if (dataToSend.stock !== undefined) {
            dataToSend.quantity = dataToSend.stock;
            delete dataToSend.stock;
        }

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Failed to save product. Status: ${res.status}`);
        }

        const savedProduct = await res.json();
        console.log('Product saved successfully from API:', savedProduct);

        // Update local state in DashboardPage
        if (isNewProduct) {
            setProducts(prevProducts => [...prevProducts, savedProduct]);
        } else {
            setProducts(prevProducts =>
                prevProducts.map(p => (p._id === savedProduct._id ? savedProduct : p))
            );
        }

        // Set success message and show the success modal
        setSuccessMessage(`Product ${isNewProduct ? 'added' : 'updated'} successfully!`);
        setShowSuccessModal(true);
        setIsModalOpen(false); // Dismiss the product modal
        setCurrentProduct(null); // Clear current product

        return true; // Indicate success
    };


    // Order Management Handlers (unchanged)
    const handleUpdateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    // User Management Handlers (updated for fetching)
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

    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
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

                        {message && (
                            <div className={`p-3 mb-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {message}
                            </div>
                        )}

                        {loadingProducts && <div className="text-center text-amber-700">Loading products...</div>}
                        {errorProducts && <div className="text-center text-red-600">{errorProducts}</div>}

                        {!loadingProducts && !errorProducts && products.length === 0 && (
                            <div className="text-center text-amber-600">No products found. Add a new product!</div>
                        )}

                        {!loadingProducts && !errorProducts && products.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-xl shadow-md">
                                    <thead className="bg-amber-100">
                                        <tr>
                                            {/* Removed Product ID Header */}
                                            <th className="py-3 px-4 text-left text-amber-800 font-semibold rounded-tl-xl">Image</th>
                                            <th className="py-3 px-4 text-left text-amber-800 font-semibold">Name</th>
                                            <th className="py-3 px-4 text-left text-amber-800 font-semibold">Stock</th>
                                            <th className="py-3 px-4 text-left text-amber-800 font-semibold">Price (Ksh)</th>
                                            <th className="py-3 px-4 text-left text-amber-800 font-semibold">Color</th>
                                            <th className="py-3 px-4 text-left text-amber-800 font-semibold">Size</th>
                                            <th className="py-3 px-4 text-left text-amber-800 font-semibold rounded-tr-xl">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product._id} className="border-b border-amber-100 last:border-b-0 hover:bg-amber-50">
                                                {/* Removed Product ID Data Cell */}
                                                <td className="py-3 px-4">
                                                    <img src={product.imageUrl || '/images/placeholder.jpg'} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                                                </td>
                                                <td className="py-3 px-4 text-amber-900 font-medium">{product.name}</td>
                                                <td className="py-3 px-4 text-amber-900">{product.quantity}</td>
                                                <td className="py-3 px-4 text-amber-900">{product.price.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-amber-900">{product.color || 'N/A'}</td>
                                                <td className="py-3 px-4 text-amber-900">{product.size || 'N/A'}</td>
                                                <td className="py-3 px-4 flex gap-2">
                                                    <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-800 transition-colors"><FaEdit /></button>
                                                    <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-800 transition-colors"><FaTrash /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
                        {loadingUsers && <div className="text-center text-amber-700">Loading users...</div>}
                        {errorUsers && <div className="text-center text-red-600">{errorUsers}</div>}
                        
                        {!loadingUsers && !errorUsers && users.length === 0 && (
                            <div className="text-center text-amber-600">No users found.</div>
                        )}

                        {!loadingUsers && !errorUsers && users.length > 0 && (
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
                                            // Assuming user objects have an '_id' or 'id' property
                                            <tr key={user._id || user.id} className="border-b border-amber-100 last:border-b-0 hover:bg-amber-50">
                                                <td className="py-3 px-4 text-amber-900">{user._id || user.id}</td>
                                                <td className="py-3 px-4 text-amber-900 font-medium">{user.name}</td>
                                                <td className="py-3 px-4 text-amber-900">{user.email}</td>
                                                <td className="py-3 px-4">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleUpdateUserRole(user._id || user.id, e.target.value)}
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
                                                    <button onClick={() => handleDeleteUser(user._id || user.id)} className="text-red-600 hover:text-red-800 transition-colors"><FaTrash /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-custom {
                    animation: spin 1s linear infinite;
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
                <button className="w-full text-left flex items-center gap-3 py-3 px-4 rounded-lg bg-amber-700 hover:bg-amber-600 transition-colors duration-200 mt-8" onClick={handleLogout}>
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
                    onSave={handleSaveProductApiCall} // Pass the API call function
                    onClose={() => {
                        setIsModalOpen(false);
                        setCurrentProduct(null); // Clear product when modal closes
                    }}
                />
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal
                    message={successMessage}
                    onClose={() => setShowSuccessModal(false)}
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

// Product Add/Edit Modal Component (with custom blur background and visible text)
const ProductModal = ({ product, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        _id: product._id || null,
        name: product.name || '',
        quantity: product.quantity || 0,
        price: product.price || 0,
        image: null, // This will hold the File object for upload
        imageUrl: product.imageUrl || '', // This is the URL of the existing image
        color: product.color || '',
        size: product.size || ''
    });

    const [imagePreview, setImagePreview] = useState(product.imageUrl || '');
    const [isSaving, setIsSaving] = useState(false); // State for loading indicator
    const [modalMessage, setModalMessage] = useState(''); // State for in-modal feedback

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setModalMessage(''); // Clear message on input change

        if (name === 'image' && files && files[0]) {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setModalMessage('');

        try {
            await onSave(formData); // onSave now handles showing the success modal itself
        } catch (error) {
            console.error("Error saving product in modal:", error);
            setModalMessage(`Error: ${error.message || 'Failed to save product.'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const productColors = ['Black', 'Brown', 'White', 'Blue', 'Green', 'Red', 'Yellow', 'Multi-color', 'Other'];
    const productSizes = ['6', '7', '8', '9', '10', '11', '12', 'S', 'M', 'L', 'XL'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
            <style jsx>{`
                .modal-overlay {
                    background-color: rgba(0, 0, 0, 0.4); /* Slightly darker translucent black */
                    backdrop-filter: blur(12px); /* Increased blur strength */
                    -webkit-backdrop-filter: blur(12px); /* For Safari support */
                }
                /* New rule for input/select text color */
                .modal-content input[type="text"],
                .modal-content input[type="number"],
                .modal-content input[type="file"],
                .modal-content select {
                    color: #4a5568; /* A dark gray color for text inside fields */
                }
                /* Optional: Adjust placeholder color if needed */
                .modal-content input::placeholder,
                .modal-content select::placeholder {
                    color: #a0aec0; /* Lighter gray for placeholder */
                }
            `}</style>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative animate-scaleIn overflow-y-auto max-h-[90vh] modal-content"> {/* Added modal-content class */}
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                    aria-label="Close"
                    disabled={isSaving}
                >
                    <FaTimes />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-amber-900">{product._id ? 'Edit Product' : 'Add New Product'}</h2>

                {modalMessage && (
                    <div className={`p-3 mb-4 rounded-md ${modalMessage.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {modalMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-amber-800 text-sm font-semibold mb-2">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="quantity" className="block text-amber-800 text-sm font-semibold mb-2">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-amber-800 text-sm font-semibold mb-2">Price (Ksh)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-amber-800 text-sm font-semibold mb-2">Product Image</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full p-3 border border-amber-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm text-amber-700 mb-2">Current Image:</p>
                                <img src={imagePreview} alt="Product Preview" className="w-32 h-32 object-cover rounded-md shadow-sm" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="color" className="block text-amber-800 text-sm font-semibold mb-2">Color</label>
                        <select
                            id="color"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="">Select Color</option>
                            {productColors.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="size" className="block text-amber-800 text-sm font-semibold mb-2">Size</label>
                        <select
                            id="size"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="">Select Size</option>
                            {productSizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-5 rounded-full transition duration-200"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-200 flex items-center justify-center gap-2"
                            disabled={isSaving}
                        >
                            {isSaving ? <FaSpinner className="animate-spin-custom" /> : product._id ? <FaEdit /> : <FaPlus />}
                            {isSaving ? 'Saving...' : product._id ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Success Modal Component (unchanged as it has no input fields)
const SuccessModal = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto-close after 3 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
            <style jsx>{`
                .modal-overlay {
                    background-color: rgba(0, 0, 0, 0.4); /* Slightly darker translucent black */
                    backdrop-filter: blur(12px); /* Increased blur strength */
                    -webkit-backdrop-filter: blur(12px); /* For Safari support */
                }
            `}</style>
            <div className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-sm relative animate-scaleIn">
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <FaTimes />
                </button>
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-700 mb-2">Success!</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-200"
                >
                    Got It!
                </button>
            </div>
        </div>
    );
};