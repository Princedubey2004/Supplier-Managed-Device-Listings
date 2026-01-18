import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Background from '../components/ui/Background';
import { motion } from 'framer-motion';
import { Zap, Shield, TrendingUp, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await login(email, password);
            if (result.success) {
                const userRole = result.role;
                if (userRole === 'SUPPLIER') {
                    navigate('/supplier');
                } else {
                    navigate('/employee');
                }
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
            title: 'Lightning Fast',
            description: 'Manage your inventory in real-time',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security for your data',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: TrendingUp,
            title: 'Grow Your Business',
            description: 'Analytics and insights at your fingertips',
            color: 'from-emerald-500 to-teal-500',
        },
    ];

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            <Background variant="default" />

            {/* Left Panel - Branding & Features */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-12">
                        <h1 className="text-5xl font-heading font-bold text-white mb-4 bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
                            Device Management
                        </h1>
                        <p className="text-xl text-slate-300">
                            Streamline your supplier operations with our powerful platform
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
                    <Badge variant="primary" size="sm">Trusted by 500+ suppliers</Badge>
                    <Badge variant="success" size="sm">99.9% Uptime</Badge>
                </motion.div>
            </div>

            {/* Right Panel - Login Form */}
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
                                Welcome Back
                            </h2>
                            <p className="text-slate-300">Sign in to access your dashboard</p>
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

                            <Input
                                id="email"
                                type="email"
                                label="Email Address"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />

                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
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

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition-colors">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-600 bg-slate-800 text-primary-500 focus:ring-2 focus:ring-primary-500/50"
                                    />
                                    Remember me
                                </label>
                                <a href="#" className="text-primary-300 hover:text-primary-200 transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Sign in
                            </Button>

                            <div className="text-center mt-4">
                                <Link
                                    to="/register"
                                    className="text-sm text-primary-300 hover:text-primary-200 transition-colors inline-flex items-center gap-1"
                                >
                                    Don't have an account? <span className="font-semibold">Register now →</span>
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
                        <Badge variant="primary" size="sm">500+ Suppliers</Badge>
                        <Badge variant="success" size="sm">99.9% Uptime</Badge>
                        <Badge variant="info" size="sm">Fast & Secure</Badge>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
