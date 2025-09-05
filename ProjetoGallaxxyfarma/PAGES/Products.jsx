import React, { useState, useEffect } from "react";
import { Product } from "@/entities/Product";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProducts();
        loadCart();
    }, []);

    useEffect(() => {
        const filterProducts = () => {
            let filtered = products;

            if (searchTerm) {
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (selectedCategory !== "all") {
                filtered = filtered.filter(product => product.category === selectedCategory);
            }

            setFilteredProducts(filtered);
        };

        filterProducts();
    }, [products, searchTerm, selectedCategory]);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await Product.filter({ active: true }, "name");
            setProducts(data);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
        setIsLoading(false);
    };

    const loadCart = () => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
    };

    const addToCart = (product, quantity) => {
        const existingItem = cart.find(item => item.id === product.id);
        let newCart;

        if (existingItem) {
            newCart = cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            newCart = [...cart, { ...product, quantity }];
        }

        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        
        // Update cart count in parent
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    const getCartQuantity = (productId) => {
        const item = cart.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    const categories = [
        { value: "all", label: "Todas as Categorias" },
        { value: "bebidas", label: "Bebidas" },
        { value: "alimentos", label: "Alimentos" },
        { value: "limpeza", label: "Limpeza" },
        { value: "higiene", label: "Higiene" },
        { value: "outros", label: "Outros" }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4"
                >
                    Nossos Produtos
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-slate-600"
                >
                    Descubra nossa seleção premium de produtos
                </motion.p>
            </div>

            {/* Filters */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                    />
                </div>
                
                <div className="flex items-center space-x-2">
                    <Filter className="text-slate-500 w-5 h-5" />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            {/* Products Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-slate-200 rounded-xl h-80"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard
                                    product={product}
                                    onAddToCart={addToCart}
                                    cartQuantity={getCartQuantity(product.id)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            )}

            {!isLoading && filteredProducts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                        Nenhum produto encontrado
                    </h3>
                    <p className="text-slate-500">
                        Tente ajustar os filtros ou buscar por outros termos
                    </p>
                </motion.div>
            )}
        </div>
    );
}