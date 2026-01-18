import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';
import Button from './ui/Button';
import Background from './ui/Background';
import ProfileModal from './profile/ProfileModal';

const Layout = ({ children, title, backgroundVariant = 'default' }) => {
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    return (
        <div className="min-h-screen relative overflow-hidden text-slate-100">
            <Background variant={backgroundVariant} />

            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

            <nav className="glass-panel border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link
                            to={user?.role === 'SUPPLIER' ? '/supplier' : '/employee'}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 hover:opacity-80 cursor-pointer"
                        >
                            <div className="bg-primary-500/20 p-2 rounded-lg">
                                <Menu className="w-6 h-6 text-primary-400" />
                            </div>
                            <h1 className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                                {title || 'Dashboard'}
                            </h1>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsProfileOpen(true)}
                                className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                            >
                                {user?.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.name || "Profile"}
                                        className="w-6 h-6 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-400 transition-all"
                                    />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center ring-2 ring-transparent group-hover:ring-indigo-400 transition-all">
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                    {user?.name || user?.email}
                                </span>
                            </button>
                            <Button variant="ghost" onClick={logout} className="p-2">
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
                {children}
            </main>
        </div>
    );
};

export default Layout;
