import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/entities/Order";
import { OrderItem } from "@/entities/OrderItem";
import { User } from "@/entities/User";
import { format } from "date-fns";
import { Clock, Package, Truck, CheckCircle, XCircle, MapPin } from "lucide-react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState({});
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const currentUser = await User.me();
            setUser(currentUser);
            
            const userOrders = await Order.filter(
                { customer_email: currentUser.email }, 
                "-created_date"
            );
            setOrders(userOrders);

            // Load items for each order
            const itemsData = {};
            for (const order of userOrders) {
                const items = await OrderItem.filter({ order_id: order.id });
                itemsData[order.id] = items;
            }
            setOrderItems(itemsData);
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
        }
        setIsLoading(false);
    };

    const statusConfig = {
        pendente: {
            icon: Clock,
            color: "bg-yellow-100 text-yellow-800 border-yellow-200",
            label: "Pendente"
        },
        confirmado: {
            icon: CheckCircle,
            color: "bg-blue-100 text-blue-800 border-blue-200",
            label: "Confirmado"
        },
        em_preparacao: {
            icon: Package,
            color: "bg-purple-100 text-purple-800 border-purple-200",
            label: "Em Preparação"
        },
        saiu_para_entrega: {
            icon: Truck,
            color: "bg-orange-100 text-orange-800 border-orange-200",
            label: "Saiu para Entrega"
        },
        entregue: {
            icon: CheckCircle,
            color: "bg-green-100 text-green-800 border-green-200",
            label: "Entregue"
        },
        cancelado: {
            icon: XCircle,
            color: "bg-red-100 text-red-800 border-red-200",
            label: "Cancelado"
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-slate-200 rounded-xl h-32"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="text-8xl mb-6">📋</div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">
                        Nenhum pedido encontrado
                    </h2>
                    <p className="text-slate-500 mb-8">
                        Você ainda não fez nenhum pedido conosco
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-slate-800 mb-8"
            >
                Meus Pedidos
            </motion.h1>

            <AnimatePresence>
                {orders.map((order, index) => {
                    const status = statusConfig[order.status] || statusConfig.pendente;
                    const StatusIcon = status.icon;
                    const items = orderItems[order.id] || [];

                    return (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="mb-6"
                        >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-lg">
                                                Pedido #{order.id.slice(-8)}
                                            </CardTitle>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {format(new Date(order.created_date), "dd/MM/yyyy 'às' HH:mm")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={`${status.color} border flex items-center gap-2 px-3 py-1`}>
                                                <StatusIcon className="w-4 h-4" />
                                                {status.label}
                                            </Badge>
                                            <span className="text-lg font-bold text-blue-600">
                                                R$ {order.total_amount?.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Order Items */}
                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-3">Itens do Pedido:</h4>
                                        <div className="space-y-2">
                                            {items.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                    <div>
                                                        <span className="font-medium">{item.product_name}</span>
                                                        <span className="text-slate-500 ml-2">x{item.quantity}</span>
                                                    </div>
                                                    <span className="font-medium text-slate-700">
                                                        R$ {item.total_price?.toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Delivery Info */}
                                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-slate-700">Endereço de Entrega:</h4>
                                            <p className="text-slate-600 mt-1">{order.delivery_address}</p>
                                            {order.notes && (
                                                <p className="text-sm text-slate-500 mt-2">
                                                    <strong>Observações:</strong> {order.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}