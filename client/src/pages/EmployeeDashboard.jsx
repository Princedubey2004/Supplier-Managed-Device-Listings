
import { useState, useEffect } from 'react';
import { employeeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EmployeeDashboard() {
    const { user, logout } = useAuth();
    const [devices, setDevices] = useState([]);
    const [filters, setFilters] = useState({ brand: '', minPrice: '', maxPrice: '' });

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        try {
            const { data } = await employeeApi.getDevices(filters);
            setDevices(data);
        } catch (error) {
            console.error('Failed to load devices', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = (e) => {
        e.preventDefault();
        loadDevices();
    };

    const handleLease = async (id) => {
        if (window.confirm("Confirm lease for this device?")) {
            try {
                await employeeApi.leaseDevice(id);
                alert("Lease successful!");
                loadDevices();
            } catch (error) {
                alert("Lease failed: " + (error.response?.data?.error || error.message));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold">Employee Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-gray-500">{user.email}</span>
                            <button onClick={logout} className="text-gray-500 hover:text-gray-700">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Filters */}
                    <form onSubmit={applyFilters} className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Brand</label>
                            <input name="brand" value={filters.brand} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="Apple, Dell..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Min Price</label>
                            <input name="minPrice" type="number" value={filters.minPrice} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Max Price</label>
                            <input name="maxPrice" type="number" value={filters.maxPrice} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="1000" />
                        </div>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 h-10">Filter</button>
                    </form>

                    {/* Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {devices.map((device) => (
                            <div key={device.id} className="bg-white overflow-hidden shadow rounded-lg">
                                {device.imageUrl && <img src={device.imageUrl} alt={device.name} className="h-48 w-full object-cover" />}
                                <div className="p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{device.name}</h3>
                                            <p className="text-sm text-gray-500">{device.brand}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${device.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {device.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500">Supplier: {device.supplier?.name}</p>
                                        <div className="mt-2 flex items-baseline">
                                            <span className="text-2xl font-semibold text-gray-900">${device.finalPrice}</span>
                                            {device.activeDiscount > 0 && (
                                                <span className="ml-2 text-sm text-gray-500 line-through">${device.basePrice}</span>
                                            )}
                                        </div>
                                        {device.activeDiscount > 0 && (
                                            <p className="text-sm text-green-600 font-medium">{device.activeDiscount}% OFF</p>
                                        )}
                                    </div>

                                    <div className="mt-5">
                                        <button
                                            onClick={() => handleLease(device.id)}
                                            disabled={device.stockQuantity <= 0}
                                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${device.stockQuantity > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                        >
                                            {device.stockQuantity > 0 ? 'Lease Device' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
