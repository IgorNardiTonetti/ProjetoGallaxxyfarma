import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus } from "lucide-react";

export default function ProductCard({ product, onAddToCart, cartQuantity = 0 }) {
    const [quantity, setQuantity] = React.useState(1);
    const [isAdding, setIsAdding] = React.useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        await onAddToCart(product, quantity);
        setIsAdding(false);
        setQuantity(1);
    };

    const categoryColors = {
        bebidas: "bg-blue-100 text-blue-800",
        alimentos: "bg-green-100 text-green-800",
        limpeza: "bg-yellow-100 text-yellow-800",
        higiene: "bg-purple-100 text-purple-800",
        outros: "bg-gray-100 text-gray-800"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-6xl text-slate-300">📦</div>
                        </div>
                    )}
                    {cartQuantity > 0 && (
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-blue-600 text-white">
                                {cartQuantity} no carrinho
                            </Badge>
                        </div>
                    )}
                </div>

                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-slate-800 leading-tight">{product.name}</h3>
                                <Badge className={categoryColors[product.category]}>
                                    {product.category}
                                </Badge>
                            </div>
                            {product.description && (
                                <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-2xl font-bold text-blue-600">
                                    R$ {product.price?.toFixed(2)}
                                </span>
                                {product.unit && (
                                    <span className="text-sm text-slate-500 ml-1">/{product.unit}</span>
                                )}
                            </div>
                            {product.stock && (
                                <span className="text-sm text-slate-500">
                                    {product.stock} disponível
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none hover:bg-slate-100"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="px-4 py-1 font-medium text-slate-700 min-w-[3rem] text-center">
                                    {quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none hover:bg-slate-100"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            <Button
                                onClick={handleAddToCart}
                                disabled={isAdding || !product.active}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200"
                            >
                                {isAdding ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                ) : (
                                    <>
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Adicionar
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}