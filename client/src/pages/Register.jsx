import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Background from '../components/ui/Background';
import { motion } from 'framer-motion';
import { Zap, Shield, Users, Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'EMPLOYEE',
        name: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await register(formData);
            if (result.success) {
                navigate('/login');
            } else {
                setError(result.error);
            }
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        {
            icon: Zap,
            title: 'Get Started Instantly',
            description: 'List your first device in under 2 minutes',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: Shield,
            title: 'Secure Platform',
            description: 'Your data protected with enterprise-grade encryption',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Users,
            title: 'Join 500+ Suppliers',
            description: 'Be part of our growing leasing community',
            color: 'from-purple-500 to-pink-500',
        },
    ];

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            <Background variant="default" />

            {/* Left Panel - Features */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-12">
                        <h1 className="text-5xl font-heading font-bold text-white mb-4 bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
                            Welcome to Tortoise
                        </h1>
                        <p className="text-xl text-slate-300">
                            Start leasing devices and grow your business today
                        </p>
                    </div>

                    <div className="space-y-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                            >
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color}`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-slate-400">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-3"
                >
                    <Badge variant="primary" size="sm">Free to start</Badge>
                    <Badge variant="success" size="sm">No credit card required</Badge>
                </motion.div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <Card className="glass-card">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-heading font-bold text-white mb-2">
                                Create Account
                            </h2>
                            <p className="text-slate-300">Join Tortoise to manage devices</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                    I want to:
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'SUPPLIER' })}
                                        className={`p-4 rounded-xl border-2 transition-all ${formData.role === 'SUPPLIER'
                                                ? 'border-primary-500 bg-primary-500/10'
                                                : 'border-white/10 bg-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="text-white font-semibold mb-1">Lease Devices</div>
                                        <div className="text-xs text-slate-400">As a Supplier</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'EMPLOYEE' })}
                                        className={`p-4 rounded-xl border-2 transition-all ${formData.role === 'EMPLOYEE'
                                                ? 'border-primary-500 bg-primary-500/10'
                                                : 'border-white/10 bg-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="text-white font-semibold mb-1">Find Devices</div>
                                        <div className="text-xs text-slate-400">As a Buyer</div>
                                    </button>
                                </div>
                            </div>

                            <Input
                                id="name"
                                type="text"
                                label="Full Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                autoComplete="name"
                            />

                            <Input
                                id="email"
                                type="email"
                                label="Email Address"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                autoComplete="email"
                            />

                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Create Account
                            </Button>

                            <div className="text-center mt-4">
                                <Link
                                    to="/login"
                                    className="text-sm text-primary-300 hover:text-primary-200 transition-colors inline-flex items-center gap-1"
                                >
                                    Already have an account? <span className="font-semibold">Sign in →</span>
                                </Link>
                            </div>
                        </form>
                    </Card>

                    {/* Mobile Features Preview */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="lg:hidden mt-6 flex gap-2 justify-center flex-wrap"
                    >
                        <Badge variant="primary" size="sm">Free to Start</Badge>
                        <Badge variant="success" size="sm">500+ Suppliers</Badge>
                        <Badge variant="info" size="sm">Secure Platform</Badge>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
