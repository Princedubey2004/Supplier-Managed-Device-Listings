
import { useState, useEffect } from 'react';
import { supplierApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SupplierDashboard() {
    const { user, logout } = useAuth();
    const [devices, setDevices] = useState([]);

    // UI State
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [offeringDevice, setOfferingDevice] = useState(null);

    // Form State
    const [deviceForm, setDeviceForm] = useState({
        name: '', brand: '', basePrice: '', stockQuantity: '', imageUrl: '', active: true
    });
    // New state for Key-Value Specs
    const [specsKV, setSpecsKV] = useState([{ key: '', value: '' }]);

    const [offerForm, setOfferForm] = useState({
        discount: '', startDate: '', endDate: ''
    });

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        try {
            const { data } = await supplierApi.getDevices();
            setDevices(data);
        } catch (error) {
            console.error('Failed to load devices', error);
        }
    };

    const handleSaveDevice = async (e) => {
        e.preventDefault();

        // Convert KV array to Object
        const specsObj = specsKV.reduce((acc, item) => {
            if (item.key.trim()) {
                acc[item.key.trim()] = item.value.trim();
            }
            return acc;
        }, {});

        try {
            const payload = {
                ...deviceForm,
                specs: specsObj,
                basePrice: parseFloat(deviceForm.basePrice),
                stockQuantity: parseInt(deviceForm.stockQuantity),
                active: deviceForm.active
            };

            if (editingDevice) {
                await supplierApi.updateDevice(editingDevice.id, payload);
            } else {
                await supplierApi.createDevice(payload);
            }

            closeForms();
            loadDevices();
        } catch (error) {
            alert('Error saving device: ' + error.message);
        }
    };

    const handleCreateOffer = async (e) => {
        e.preventDefault();
        try {
            await supplierApi.createOffer(offeringDevice.id, {
                discount: parseFloat(offerForm.discount),
                startDate: offerForm.startDate,
                endDate: offerForm.endDate
            });
            closeForms();
            loadDevices();
            alert('Offer created successfully!');
        } catch (error) {
            alert('Error creating offer: ' + error.message);
        }
    };

    const handleUpdateStock = async (id, currentQty) => {
        const newQty = prompt("Enter new TOTAL stock quantity:", currentQty);
        if (newQty !== null) {
            try {
                await supplierApi.updateStock(id, parseInt(newQty));
                loadDevices();
            } catch (error) {
                alert('Error updating stock');
            }
        }
    };

    const startEdit = (device) => {
        setEditingDevice(device);
        setDeviceForm({
            name: device.name,
            brand: device.brand,
            basePrice: device.basePrice,
            stockQuantity: device.stockQuantity,
            imageUrl: device.imageUrl || '',
            active: device.active
        });

        // Parse existing specs into KV array
        let initialKV = [];
        if (device.specs && Object.keys(device.specs).length > 0) {
            initialKV = Object.entries(device.specs).map(([key, value]) => ({ key, value }));
        } else {
            initialKV = [{ key: '', value: '' }];
        }
        setSpecsKV(initialKV);

        setShowAddForm(true);
        setOfferingDevice(null);
    };

    const startAdd = () => {
        setEditingDevice(null);
        setDeviceForm({ name: '', brand: '', basePrice: '', stockQuantity: '', imageUrl: '', active: true });
        setSpecsKV([{ key: '', value: '' }]); // Reset KV
        setShowAddForm(true);
        setOfferingDevice(null);
    };

    const closeForms = () => {
        setShowAddForm(false);
        setEditingDevice(null);
        setOfferingDevice(null);
        setOfferForm({ discount: '', startDate: '', endDate: '' });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold">Supplier Dashboard - {user.name}</h1>
                        </div>
                        <div className="flex items-center">
                            <button onClick={logout} className="text-gray-500 hover:text-gray-700">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
                        {!showAddForm && !offeringDevice && (
                            <button
                                onClick={startAdd}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Add Device
                            </button>
                        )}
                    </div>

                    {/* Device Form (Create/Edit) */}
                    {showAddForm && (
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h3 className="text-lg font-medium mb-4">{editingDevice ? 'Edit Device' : 'Add New Device'}</h3>
                            <form onSubmit={handleSaveDevice} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <input className="border p-2 rounded" placeholder="Device Name" value={deviceForm.name} onChange={e => setDeviceForm({ ...deviceForm, name: e.target.value })} required />
                                <input className="border p-2 rounded" placeholder="Brand" value={deviceForm.brand} onChange={e => setDeviceForm({ ...deviceForm, brand: e.target.value })} required />
                                <input className="border p-2 rounded" placeholder="Base Price ($)" type="number" step="0.01" value={deviceForm.basePrice} onChange={e => setDeviceForm({ ...deviceForm, basePrice: e.target.value })} required />
                                <input className="border p-2 rounded" placeholder="Stock Quantity" type="number" value={deviceForm.stockQuantity} onChange={e => setDeviceForm({ ...deviceForm, stockQuantity: e.target.value })} required />
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
                                    {specsKV.map((spec, index) => (
                                        <div key={index} className="flex space-x-2 mb-2">
                                            <input
                                                className="border p-2 rounded flex-1"
                                                placeholder="Key (e.g. Color)"
                                                value={spec.key}
                                                onChange={e => {
                                                    const newSpecs = [...specsKV];
                                                    newSpecs[index].key = e.target.value;
                                                    setSpecsKV(newSpecs);
                                                }}
                                            />
                                            <input
                                                className="border p-2 rounded flex-1"
                                                placeholder="Value (e.g. Red)"
                                                value={spec.value}
                                                onChange={e => {
                                                    const newSpecs = [...specsKV];
                                                    newSpecs[index].value = e.target.value;
                                                    setSpecsKV(newSpecs);
                                                }}
                                            />
                                            {specsKV.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newSpecs = specsKV.filter((_, i) => i !== index);
                                                        setSpecsKV(newSpecs);
                                                    }}
                                                    className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setSpecsKV([...specsKV, { key: '', value: '' }])}
                                        className="mt-1 text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        + Add Spec
                                    </button>
                                </div>
                                <input className="border p-2 rounded sm:col-span-2" placeholder="Image URL" value={deviceForm.imageUrl} onChange={e => setDeviceForm({ ...deviceForm, imageUrl: e.target.value })} />
                                <div className="sm:col-span-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={deviceForm.active}
                                        onChange={e => setDeviceForm({ ...deviceForm, active: e.target.checked })}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                                        Make Available (Visible to Employees)
                                    </label>
                                </div>
                                <div className="col-span-2 flex justify-end space-x-3">
                                    <button type="button" onClick={closeForms} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">{editingDevice ? 'Update' : 'Create'}</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Offer Form */}
                    {offeringDevice && (
                        <div className="bg-white p-6 rounded-lg shadow mb-6 border-2 border-indigo-100">
                            <h3 className="text-lg font-medium mb-4">Add Offer for {offeringDevice.name}</h3>
                            <form onSubmit={handleCreateOffer} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Discount Amount ($)</label>
                                    <input className="mt-1 block w-full border p-2 rounded" type="number" step="0.01" value={offerForm.discount} onChange={e => setOfferForm({ ...offerForm, discount: e.target.value })} required />
                                </div>
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <input className="mt-1 block w-full border p-2 rounded" type="date" value={offerForm.startDate} onChange={e => setOfferForm({ ...offerForm, startDate: e.target.value })} required />
                                </div>
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                                    <input className="mt-1 block w-full border p-2 rounded" type="date" value={offerForm.endDate} onChange={e => setOfferForm({ ...offerForm, endDate: e.target.value })} required />
                                </div>
                                <div className="col-span-3 flex justify-end space-x-3">
                                    <button type="button" onClick={closeForms} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Create Offer</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Device List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {devices.map((device) => (
                                <li key={device.id} className={`p-4 flex flex-col sm:flex-row justify-between items-center hover:bg-gray-50 ${!device.active ? 'bg-gray-100 opacity-75' : ''}`}>
                                    <div className="mb-4 sm:mb-0">
                                        <div className="flex items-center">
                                            <h3 className="text-lg font-medium text-indigo-600">{device.name}</h3>
                                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {device.brand}
                                            </span>
                                            {!device.active && (
                                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-600 text-white">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">Stock: {device.stockQuantity} | Base Price: ${device.basePrice}</p>

                                        {/* Display Active Offers if any */}
                                        {device.offers && device.offers.length > 0 && (
                                            <div className="mt-1 text-xs text-purple-600">
                                                {device.offers.length} Offer(s) active
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => startEdit(device)}
                                            className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStock(device.id, device.stockQuantity)}
                                            className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Stock
                                        </button>
                                        <button
                                            onClick={() => { setOfferingDevice(device); setShowAddForm(false); }}
                                            className="px-3 py-1 border border-transparent rounded text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                                        >
                                            Add Offer
                                        </button>
                                    </div>
                                </li>
                            ))}
                            {devices.length === 0 && (
                                <li className="p-10 text-center text-gray-500">
                                    No devices yet. Click "Add Device" to start.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
