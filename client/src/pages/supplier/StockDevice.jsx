import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supplierApi } from '../../services/api';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ArrowLeft, Box } from 'lucide-react';

export default function StockDevice() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [currentDevice, setCurrentDevice] = useState(null);
    const [stockQuantity, setStockQuantity] = useState('');

    useEffect(() => {
        loadDevice();
    }, [id]);

    const loadDevice = async () => {
        try {
            const { data } = await supplierApi.getDevices();
            const device = data.find(d => d.id === id);
            if (device) {
                setCurrentDevice(device);
                setStockQuantity(device.stockQuantity);
            } else {
                alert('Device not found');
                navigate('/supplier');
            }
        } catch (error) {
            console.error('Failed to load device', error);
            navigate('/supplier');
        }
    };

    const handleUpdateStock = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await supplierApi.updateStock(id, parseInt(stockQuantity));
            navigate('/supplier');
        } catch (error) {
            alert('Error updating stock: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!currentDevice) return null;

    return (
        <Layout title="Update Stock" backgroundVariant="supplier">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/supplier')} className="pl-0 hover:bg-transparent text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
            </div>

            <Card className="max-w-xl mx-auto border-primary-500/30">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
                        {currentDevice.imageUrl ? (
                            <img src={currentDevice.imageUrl} alt={currentDevice.name} className="w-full h-full object-cover" />
                        ) : (
                            <Box className="w-8 h-8 text-slate-500" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-bold text-white">{currentDevice.name}</h2>
                        <p className="text-slate-400 text-sm">Current Stock: {currentDevice.stockQuantity}</p>
                    </div>
                </div>

                <form onSubmit={handleUpdateStock} className="space-y-6">
                    <Input
                        label="New Stock Quantity"
                        type="number"
                        value={stockQuantity}
                        onChange={e => setStockQuantity(e.target.value)}
                        required
                        min="0"
                    />

                    <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                        <Button type="button" variant="outline" onClick={() => navigate('/supplier')}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Stock'}
                        </Button>
                    </div>
                </form>
            </Card>
        </Layout>
    );
}
