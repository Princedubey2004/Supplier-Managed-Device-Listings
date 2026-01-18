import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Background from '../components/ui/Background';
import { ArrowRight, Zap, Shield, TrendingUp, Users, Package, CheckCircle } from 'lucide-react';

export default function LandingPage() {
    const features = [
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Instant device listing and real-time inventory management',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security for all your transactions',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: TrendingUp,
            title: 'Growing Network',
            description: 'Join 500+ suppliers and thousands of satisfied customers',
            color: 'from-emerald-500 to-teal-500',
        },
        {
            icon: Users,
            title: 'Easy Collaboration',
            description: 'Seamless connection between suppliers and buyers',
            color: 'from-purple-500 to-pink-500',
        },
    ];

    const stats = [
        { number: '500+', label: 'Active Suppliers' },
        { number: '10K+', label: 'Devices Listed' },
        { number: '99.9%', label: 'Uptime' },
        { number: '24/7', label: 'Support' },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            <Background variant="default" />

            {/* Hero Section */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Badge variant="primary" size="lg" className="mb-6" animated>
                            Welcome to the Future of Device Leasing
                        </Badge>

                        <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 bg-gradient-to-r from-primary-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                            Tortoise
                        </h1>

                        <p className="text-2xl md:text-3xl text-slate-200 mb-4 font-medium">
                            Lease Devices. Expand Possibilities.
                        </p>

                        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto">
                            The modern platform connecting suppliers and buyers through seamless device leasing.
                            List your products, manage inventory, or find the perfect device—all in one place.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/register">
                                <Button size="lg" className="text-lg px-8 py-4 group">
                                    Get Started
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-sm text-slate-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative z-10 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                            Why Choose Tortoise?
                        </h2>
                        <p className="text-xl text-slate-400">
                            Everything you need to manage device leasing efficiently
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="relative z-10 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                            How It Works
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* For Suppliers */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Package className="w-8 h-8 text-violet-400" />
                                For Suppliers
                            </h3>
                            {['Create your account', 'List your devices', 'Manage inventory', 'Track leases'].map((step, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-lg text-slate-200">{step}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* For Buyers */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Users className="w-8 h-8 text-emerald-400" />
                                For Buyers
                            </h3>
                            {['Browse available devices', 'Request a lease', 'Manage your devices', 'Easy returns'].map((step, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-lg text-slate-200">{step}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative z-10 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-12 rounded-3xl bg-gradient-to-r from-primary-500/20 to-violet-500/20 backdrop-blur-md border border-white/20"
                    >
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-slate-300 mb-8">
                            Join thousands of suppliers and buyers on Tortoise today
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button size="lg" className="text-lg px-8 py-4 group">
                                    Create Account
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 py-8 px-4 border-t border-white/10">
                <div className="max-w-6xl mx-auto text-center text-slate-400">
                    <p>&copy; 2026 Tortoise. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
