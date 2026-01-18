import { useState, useEffect, useCallback } from 'react';
import { employeeApi } from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Search, Monitor, Package } from 'lucide-react';

export default function EmployeeDashboard() {
    const [devices, setDevices] = useState([]);
    const [filters, setFilters] = useState({ brand: '', minPrice: '', maxPrice: '' });

    const loadDevices = useCallback(async () => {
        try {
            const { data } = await employeeApi.getDevices(filters);
            setDevices(data);
        } catch (error) {
            console.error('Failed to load devices', error);
        }
    }, [filters]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDevices();
    }, [loadDevices]);

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
        <Layout title="Employee Portal" backgroundVariant="employee">
            {/* Filters */}
            <Card className="mb-8 p-4">
                <form onSubmit={applyFilters} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input
                            name="brand"
                            placeholder="Search by Brand (e.g. Apple)"
                            value={filters.brand}
                            onChange={handleFilterChange}
                            className="!pl-10"
                        />
                    </div>
                    <div className="w-full md:w-32">
                        <Input
                            name="minPrice"
                            type="number"
                            placeholder="Min $"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="w-full md:w-32">
                        <Input
                            name="maxPrice"
                            type="number"
                            placeholder="Max $"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <Button type="submit" className="w-full md:w-auto h-[42px]">
                        Filter Results
                    </Button>
                </form>
            </Card>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => (
                    <Card key={device.id} className="group hover:border-primary-500/30 transition-all duration-300">
                        <div className="aspect-video w-full bg-slate-900/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-white/5 relative">
                            {device.imageUrl ? (
                                <img src={device.imageUrl} alt={device.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <Monitor className="w-12 h-12 text-slate-600" />
                            )}

                            {device.activeDiscount > 0 && (
                                <div className="absolute top-2 right-2 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                    {device.activeDiscount}% OFF
                                </div>
                            )}
                        </div>

                        <div className="mb-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">{device.name}</h3>
                                    <p className="text-sm text-slate-400">{device.brand}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-white">${device.finalPrice}</div>
                                    {device.activeDiscount > 0 && (
                                        <div className="text-xs text-slate-500 line-through">${device.basePrice}</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-white/10">
                                <span className="text-slate-500">{device.supplier?.name}</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${device.stockQuantity > 0 ? 'bg-secondary-500/10 text-secondary-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {device.stockQuantity > 0 ? `${device.stockQuantity} In Stock` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <Button
                            onClick={() => handleLease(device.id)}
                            disabled={device.stockQuantity <= 0}
                            className={`w-full ${device.stockQuantity > 0 ? '' : 'opacity-50 cursor-not-allowed'}`}
                            variant={device.stockQuantity > 0 ? 'primary' : 'outline'}
                        >
                            {device.stockQuantity > 0 ? 'Lease Now' : 'Out of Stock'}
                        </Button>
                    </Card>
                ))}

                {devices.length === 0 && (
                    <div className="col-span-full py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                            <Package className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-300">No devices found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
