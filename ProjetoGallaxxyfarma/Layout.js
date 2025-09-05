import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingCart, Package, LayoutDashboard, History, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/entities/User";

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const [user, setUser] = React.useState(null);
    const [cartCount, setCartCount] = React.useState(0);

    React.useEffect(() => {
        loadUser();
        updateCartCount();
    }, []);

    const loadUser = async () => {
        try {
            const currentUser = await User.me();
            setUser(currentUser);
        } catch (error) {
            console.log("User not authenticated");
        }
    };

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
    };

    const isActive = (pageName) => {
        return location.pathname === createPageUrl(pageName);
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to={createPageUrl("Products")} className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                                    Gallaxxyfarma
                                </h1>
                                <p className="text-xs text-slate-500">Pedidos inteligentes</p>
                            </div>
                        </Link>

                        <nav className="hidden md:flex space-x-1">
                            <Link
                                to={createPageUrl("Products")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                    isActive("Products")
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                }`}
                            >
                                Produtos
                            </Link>
                            <Link
                                to={createPageUrl("Cart")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 relative ${
                                    isActive("Cart")
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>Carrinho</span>
                                    {cartCount > 0 && (
                                        <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {cartCount}
                                        </Badge>
                                    )}
                                </div>
                            </Link>
                            <Link
                                to={createPageUrl("Orders")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                    isActive("Orders")
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <History className="w-4 h-4" />
                                    <span>Meus Pedidos</span>
                                </div>
                            </Link>
                            {isAdmin && (
                                <Link
                                    to={createPageUrl("Dashboard")}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                        isActive("Dashboard")
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Controle</span>
                                    </div>
                                </Link>
                            )}
                        </nav>

                        {user && (
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-slate-700">{user.full_name}</p>
                                    <p className="text-xs text-slate-500">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
                                </div>
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <nav className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-50">
                <div className="grid grid-cols-4 h-16">
                    <Link
                        to={createPageUrl("Products")}
                        className={`flex flex-col items-center justify-center space-y-1 ${
                            isActive("Products") ? "text-blue-600" : "text-slate-500"
                        }`}
                    >
                        <Package className="w-5 h-5" />
                        <span className="text-xs font-medium">Produtos</span>
                    </Link>
                    <Link
                        to={createPageUrl("Cart")}
                        className={`flex flex-col items-center justify-center space-y-1 relative ${
                            isActive("Cart") ? "text-blue-600" : "text-slate-500"
                        }`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="text-xs font-medium">Carrinho</span>
                        {cartCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">{cartCount}</span>
                            </div>
                        )}
                    </Link>
                    <Link
                        to={createPageUrl("Orders")}
                        className={`flex flex-col items-center justify-center space-y-1 ${
                            isActive("Orders") ? "text-blue-600" : "text-slate-500"
                        }`}
                    >
                        <History className="w-5 h-5" />
                        <span className="text-xs font-medium">Pedidos</span>
                    </Link>
                    {isAdmin && (
                        <Link
                            to={createPageUrl("Dashboard")}
                            className={`flex flex-col items-center justify-center space-y-1 ${
                                isActive("Dashboard") ? "text-emerald-600" : "text-slate-500"
                            }`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="text-xs font-medium">Controle</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="pb-20 md:pb-8">
                {children}
            </main>
        </div>
    );
}