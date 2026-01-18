import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supplierApi } from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Plus, Edit2, Package, Box, Percent, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SupplierDashboard() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDevices = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await supplierApi.getDevices();
            setDevices(data);
        } catch (error) {
            console.error('Failed to load devices', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDevices();
    }, [loadDevices]);

    // Calculate stats
    const stats = {
        total: devices.length,
        active: devices.filter(d => d.active).length,
        lowStock: devices.filter(d => d.stockQuantity < 5).length,
    };

    return (
        <Layout title="Dashboard" backgroundVariant="supplier">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-violet-500/20 rounded-xl">
                            <Package className="w-6 h-6 text-violet-400" />
                        </div>
                        <Badge variant="primary" size="sm">Total</Badge>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.total}</h3>
                    <p className="text-sm text-slate-400">Total Devices</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        <Badge variant="success" size="sm">Active</Badge>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.active}</h3>
                    <p className="text-sm text-slate-400">Active Listings</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-500/20 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-amber-400" />
                        </div>
                        <Badge variant="warning" size="sm">Alert</Badge>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.lowStock}</h3>
                    <p className="text-sm text-slate-400">Low Stock Items</p>
                </motion.div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-white mb-1">My Listings</h2>
                    <p className="text-slate-400">Manage your device inventory</p>
                </div>
                <Link to="/supplier/device/new">
                    <Button size="md">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Device
                    </Button>
                </Link>
            </div>

            {/* Device List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-white/5 rounded-2xl p-6 h-96" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devices.map((device, index) => (
                        <motion.div
                            key={device.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="group hover:border-primary-500/30 transition-all duration-300 relative overflow-hidden h-full flex flex-col">
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4 z-10 flex gap-2">
                                    {!device.active && (
                                        <Badge variant="default" size="sm">
                                            Inactive
                                        </Badge>
                                    )}
                                    {device.stockQuantity < 5 && device.active && (
                                        <Badge variant="warning" size="sm">
                                            Low Stock
                                        </Badge>
                                    )}
                                </div>

                                {/* Image */}
                                <div className="aspect-video w-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-white/5 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    {device.imageUrl ? (
                                        <img src={device.imageUrl} alt={device.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <Package className="w-16 h-16 text-slate-600" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="mb-4 flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors line-clamp-1">
                                                {device.name}
                                            </h3>
                                            <p className="text-sm text-slate-400">{device.brand}</p>
                                        </div>
                                        <Badge variant="primary" size="lg" className="ml-2">
                                            ${device.basePrice}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Box className="w-4 h-4 text-slate-400" />
                                        <span className={device.stockQuantity < 5 ? 'text-amber-400 font-medium' : 'text-slate-400'}>
                                            Stock: {device.stockQuantity}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-white/10">
                                    <Link to={`/supplier/device/${device.id}/edit`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Edit2 className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Link to={`/supplier/device/${device.id}/stock`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Box className="w-3 h-3 mr-1" />
                                            Stock
                                        </Button>
                                    </Link>
                                    <Link to={`/supplier/device/${device.id}/offer`} className="flex-1">
                                        <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 border-0">
                                            <Percent className="w-3 h-3 mr-1" />
                                            Offer
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && devices.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full py-16 text-center"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 backdrop-blur-sm border border-white/10">
                        <Package className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-300 mb-2">No devices yet</h3>
                    <p className="text-slate-500 mb-6">Start by adding your first device listing</p>
                    <Link to="/supplier/device/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Device
                        </Button>
                    </Link>
                </motion.div>
            )}
        </Layout>
    );
}
