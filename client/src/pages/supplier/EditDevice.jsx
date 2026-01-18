import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supplierApi } from '../../services/api';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';

export default function EditDevice() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [deviceForm, setDeviceForm] = useState({
        name: '', brand: '', basePrice: '', stockQuantity: '', imageUrl: '', active: true
    });
    const [specsKV, setSpecsKV] = useState([{ key: '', value: '' }]);

    useEffect(() => {
        if (isEditing) {
            loadDevice();
        }
    }, [id]);

    const loadDevice = async () => {
        try {
            const { data } = await supplierApi.getDevices();
            // In a real app with optimized API, should fetch specific device by ID
            // For now, filtering from the list to reuse existing API
            const device = data.find(d => d.id === id);
            if (device) {
                setDeviceForm({
                    name: device.name,
                    brand: device.brand,
                    basePrice: device.basePrice,
                    stockQuantity: device.stockQuantity,
                    imageUrl: device.imageUrl || '',
                    active: device.active
                });

                if (device.specs && Object.keys(device.specs).length > 0) {
                    setSpecsKV(Object.entries(device.specs).map(([key, value]) => ({ key, value })));
                }
            }
        } catch (error) {
            console.error('Failed to load device', error);
            alert('Failed to load device details');
            navigate('/supplier');
        }
    };

    const handleSaveDevice = async (e) => {
        e.preventDefault();
        setLoading(true);

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

            if (isEditing) {
                await supplierApi.updateDevice(id, payload);
            } else {
                await supplierApi.createDevice(payload);
            }

            navigate('/supplier');
        } catch (error) {
            alert('Error saving device: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title={isEditing ? 'Edit Device' : 'Add Device'} backgroundVariant="supplier">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/supplier')} className="pl-0 hover:bg-transparent text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
            </div>

            <Card className="max-w-3xl mx-auto border-primary-500/30">
                <h2 className="text-2xl font-heading font-bold mb-6 text-primary-300">
                    {isEditing ? 'Edit Device Details' : 'List New Device'}
                </h2>

                <form onSubmit={handleSaveDevice} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Device Name" placeholder="e.g. iPhone 15 Pro" value={deviceForm.name} onChange={e => setDeviceForm({ ...deviceForm, name: e.target.value })} required />
                        <Input label="Brand" placeholder="e.g. Apple" value={deviceForm.brand} onChange={e => setDeviceForm({ ...deviceForm, brand: e.target.value })} required />
                        <Input label="Base Price ($)" type="number" step="0.01" value={deviceForm.basePrice} onChange={e => setDeviceForm({ ...deviceForm, basePrice: e.target.value })} required />
                        <Input label="Stock Quantity" type="number" value={deviceForm.stockQuantity} onChange={e => setDeviceForm({ ...deviceForm, stockQuantity: e.target.value })} required />
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="block text-sm font-medium text-slate-300 mb-3">Specifications</label>
                        {specsKV.map((spec, index) => (
                            <div key={index} className="flex gap-4 mb-3">
                                <Input
                                    placeholder="Key (e.g. Color)"
                                    value={spec.key}
                                    onChange={e => {
                                        const newSpecs = [...specsKV];
                                        newSpecs[index].key = e.target.value;
                                        setSpecsKV(newSpecs);
                                    }}
                                    className="!mb-0"
                                />
                                <Input
                                    placeholder="Value (e.g. Red)"
                                    value={spec.value}
                                    onChange={e => {
                                        const newSpecs = [...specsKV];
                                        newSpecs[index].value = e.target.value;
                                        setSpecsKV(newSpecs);
                                    }}
                                    className="!mb-0"
                                />
                                {specsKV.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            const newSpecs = specsKV.filter((_, i) => i !== index);
                                            setSpecsKV(newSpecs);
                                        }}
                                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300 px-3"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setSpecsKV([...specsKV, { key: '', value: '' }])}
                            className="text-primary-300 hover:text-primary-200"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Spec
                        </Button>
                    </div>

                    <Input label="Image URL" placeholder="https://example.com/image.jpg" value={deviceForm.imageUrl} onChange={e => setDeviceForm({ ...deviceForm, imageUrl: e.target.value })} />

                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 w-fit">
                        <input
                            type="checkbox"
                            id="active"
                            checked={deviceForm.active}
                            onChange={e => setDeviceForm({ ...deviceForm, active: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="active" className="text-sm font-medium text-slate-300 cursor-pointer">
                            Visible to Employees
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                        <Button type="button" variant="outline" onClick={() => navigate('/supplier')}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (isEditing ? 'Update Device' : 'Create Device')}
                        </Button>
                    </div>
                </form>
            </Card>
        </Layout>
    );
}
