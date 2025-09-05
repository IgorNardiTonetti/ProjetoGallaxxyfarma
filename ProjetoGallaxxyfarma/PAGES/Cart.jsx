import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Order } from "@/entities/Order";
import { OrderItem } from "@/entities/OrderItem";
import { User } from "@/entities/User";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: ""
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
        loadUser();
    }, []);

    const loadCart = () => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
    };

    const loadUser = async () => {
        try {
            const currentUser = await User.me();
            setUser(currentUser);
            setCustomerInfo(prev => ({
                ...prev,
                name: currentUser.full_name || "",
                email: currentUser.email || ""
            }));
        } catch (error) {
            console.log("Usuário não autenticado");
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const newCart = cart.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
        );
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeFromCart = (productId) => {
        const newCart = cart.filter(item => item.id !== productId);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    };

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = async () => {
        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
            alert("Por favor, preencha todos os campos obrigatórios");
            return;
        }

        setIsProcessing(true);

        try {
            // Create order
            const order = await Order.create({
                customer_name: customerInfo.name,
                customer_email: customerInfo.email,
                customer_phone: customerInfo.phone,
                delivery_address: customerInfo.address,
                notes: customerInfo.notes,
                total_amount: getTotalAmount(),
                status: "pendente"
            });

            // Create order items
            for (const item of cart) {
                await OrderItem.create({
                    order_id: order.id,
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_price: item.price * item.quantity
                });
            }

            // Clear cart
            localStorage.removeItem('cart');
            setCart([]);

            alert("Pedido realizado com sucesso!");
            navigate(createPageUrl("Orders"));
        } catch (error) {
            console.error("Erro ao processar pedido:", error);
            alert("Erro ao processar pedido. Tente novamente.");
        }

        setIsProcessing(false);
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="text-8xl mb-6">🛒</div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">
                        Seu carrinho está vazio
                    </h2>
                    <p className="text-slate-500 mb-8">
                        Adicione alguns produtos para continuar
                    </p>
                    <Button 
                        onClick={() => navigate(createPageUrl("Products"))}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-medium"
                    >
                        Ver Produtos
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-slate-800 mb-8"
            >
                Finalizar Pedido
            </motion.h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                                Itens do Pedido ({cart.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AnimatePresence>
                                {cart.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center space-x-4 p-4 border border-slate-200 rounded-xl"
                                    >
                                        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-2xl">📦</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800">{item.name}</h3>
                                            <p className="text-sm text-slate-500">R$ {item.price?.toFixed(2)} / {item.unit || 'un'}</p>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center border border-slate-300 rounded-lg">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-none"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <span className="px-3 py-1 font-medium min-w-[3rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-none"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            
                                            <span className="font-bold text-blue-600 min-w-[4rem] text-right">
                                                R$ {(item.price * item.quantity).toFixed(2)}
                                            </span>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </div>

                {/* Checkout Form */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Informações de Entrega</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nome Completo *</Label>
                                <Input
                                    id="name"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo(prev => ({...prev, name: e.target.value}))}
                                    className="mt-1"
                                    placeholder="Seu nome completo"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={customerInfo.email}
                                    onChange={(e) => setCustomerInfo(prev => ({...prev, email: e.target.value}))}
                                    className="mt-1"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Telefone *</Label>
                                <Input
                                    id="phone"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo(prev => ({...prev, phone: e.target.value}))}
                                    className="mt-1"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>

                            <div>
                                <Label htmlFor="address">Endereço de Entrega *</Label>
                                <Textarea
                                    id="address"
                                    value={customerInfo.address}
                                    onChange={(e) => setCustomerInfo(prev => ({...prev, address: e.target.value}))}
                                    className="mt-1 h-20"
                                    placeholder="Rua, número, bairro, cidade..."
                                />
                            </div>

                            <div>
                                <Label htmlFor="notes">Observações</Label>
                                <Textarea
                                    id="notes"
                                    value={customerInfo.notes}
                                    onChange={(e) => setCustomerInfo(prev => ({...prev, notes: e.target.value}))}
                                    className="mt-1 h-16"
                                    placeholder="Instruções especiais para entrega..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Resumo do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>R$ {getTotalAmount().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Taxa de entrega</span>
                                    <span className="text-green-600">Grátis</span>
                                </div>
                                <hr />
                                <div className="flex justify-between text-xl font-bold text-slate-800">
                                    <span>Total</span>
                                    <span className="text-blue-600">R$ {getTotalAmount().toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-medium"
                            >
                                {isProcessing ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                ) : (
                                    <CreditCard className="w-5 h-5 mr-2" />
                                )}
                                {isProcessing ? "Processando..." : "Confirmar Pedido"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}