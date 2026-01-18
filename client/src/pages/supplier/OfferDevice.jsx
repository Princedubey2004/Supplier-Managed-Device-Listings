import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supplierApi } from '../../services/api';
import Layout from '../../components/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ArrowLeft, Percent, Box } from 'lucide-react';

export default function OfferDevice() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [currentDevice, setCurrentDevice] = useState(null);
    const [offerForm, setOfferForm] = useState({
        discount: '', startDate: '', endDate: ''
    });

    useEffect(() => {
        loadDevice();
    }, [id]);

    const loadDevice = async () => {
        try {
            const { data } = await supplierApi.getDevices();
            const device = data.find(d => d.id === id);
            if (device) {
                setCurrentDevice(device);
            } else {
                alert('Device not found');
                navigate('/supplier');
            }
        } catch (error) {
            console.error('Failed to load device', error);
            navigate('/supplier');
        }
    };

    const handleCreateOffer = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await supplierApi.createOffer(id, {
                discount: parseFloat(offerForm.discount),
                startDate: offerForm.startDate,
                endDate: offerForm.endDate
            });
            alert('Offer created successfully!');
            navigate('/supplier');
        } catch (error) {
            alert('Error creating offer: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!currentDevice) return null;

    return (
        <Layout title="Create Offer" backgroundVariant="supplier">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/supplier')} className="pl-0 hover:bg-transparent text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
            </div>

            <Card className="max-w-xl mx-auto border-purple-500/30">
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
                        <h3 className="text-purple-300 flex items-center text-sm font-medium">
                            <Percent className="w-4 h-4 mr-1" />
                            New Special Offer
                        </h3>
                    </div>
                </div>

                <form onSubmit={handleCreateOffer} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <Input
                            label="Discount Amount (%)"
                            type="number"
                            step="0.01"
                            value={offerForm.discount}
                            onChange={e => setOfferForm({ ...offerForm, discount: e.target.value })}
                            required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Start Date"
                                type="date"
                                value={offerForm.startDate}
                                onChange={e => setOfferForm({ ...offerForm, startDate: e.target.value })}
                                required
                            />
                            <Input
                                label="End Date"
                                type="date"
                                value={offerForm.endDate}
                                onChange={e => setOfferForm({ ...offerForm, endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                        <Button type="button" variant="outline" onClick={() => navigate('/supplier')}>Cancel</Button>
                        <Button type="submit" variant="secondary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Offer'}
                        </Button>
                    </div>
                </form>
            </Card>
        </Layout>
    );
}
