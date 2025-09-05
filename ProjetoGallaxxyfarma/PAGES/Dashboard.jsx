import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order } from "@/entities/Order";
import { OrderItem } from "@/entities/OrderItem";
import { User } from "@/entities/User";
import { format } from "date-fns";
import { 
    Clock, Package, Truck, CheckCircle, XCircle, MapPin, 
    TrendingUp, DollarSign, ShoppingBag, Phone, Mail
} from "lucide-react";

export default function DashboardPage() {
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState({});
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        revenue: 0
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const calculateStats = () => {
            const pending = orders.filter(o => ["pendente", "confirmado", "em_preparacao", "saiu_para_entrega"].includes(o.status)).length;
            const completed = orders.filter(o => o.status === "entregue").length;
            const revenue = orders.filter(o => o.status === "entregue").reduce((sum, o) => sum + (o.total_amount || 0), 0);

            setStats({
                total: orders.length,
                pending,
                completed,
                revenue
            });
        };

        calculateStats();
    }, [orders]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const currentUser = await User.me();
            setUser(currentUser);

            if (currentUser.role !== 'admin') {
                alert("Acesso negado. Apenas administradores podem acessar esta área.");
                return;
            }
            
            const allOrders = await Order.list("-created_date");
            setOrders(allOrders);

            // Load items for each order
            const itemsData = {};
            for (const order of allOrders) {
                const items = await OrderItem.filter({ order_id: order.id });
                itemsData[order.id] = items;
            }
            setOrderItems(itemsData);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
        setIsLoading(false);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await Order.update(orderId, { status: newStatus });
            setOrders(orders.map(order => 
                order.id === orderId 
                    ? { ...order, status: newStatus }
                    : order
            ));
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Erro ao atualizar status do pedido");
        }
    };

    const statusConfig = {
        pendente: { icon: Clock, color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pendente" },
        confirmado: { icon: CheckCircle, color: "bg-blue-100 text-blue-800 border-blue-200", label: "Confirmado" },
        em_preparacao: { icon: Package, color: "bg-purple-100 text-purple-800 border-purple-200", label: "Em Preparação" },
        saiu_para_entrega: { icon: Truck, color: "bg-orange-100 text-orange-800 border-orange-200", label: "Saiu para Entrega" },
        entregue: { icon: CheckCircle, color: "bg-green-100 text-green-800 border-green-200", label: "Entregue" },
        cancelado: { icon: XCircle, color: "bg-red-100 text-red-800 border-red-200", label: "Cancelado" }
    };

    const filteredOrders = selectedStatus === "all" 
        ? orders 
        : orders.filter(order => order.status === selectedStatus);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="animate-pulse bg-slate-200 rounded-xl h-24"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (user?.role !== 'admin') {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <div className="text-8xl mb-6">🚫</div>
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Acesso Negado</h2>
                <p className="text-slate-500">Apenas administradores podem acessar esta área.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-slate-800 mb-8"
            >
                Controle de Pedidos
            </motion.h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 font-medium">Total de Pedidos</p>
                                    <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                                </div>
                                <ShoppingBag className="w-8 h-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-600 font-medium">Em Andamento</p>
                                    <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 font-medium">Concluídos</p>
                                    <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-600 font-medium">Faturamento</p>
                                    <p className="text-2xl font-bold text-emerald-700">R$ {stats.revenue.toFixed(2)}</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-emerald-600" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                        <SelectItem value="em_preparacao">Em Preparação</SelectItem>
                        <SelectItem value="saiu_para_entrega">Saiu para Entrega</SelectItem>
                        <SelectItem value="entregue">Entregue</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Orders List */}
            <AnimatePresence>
                {filteredOrders.map((order, index) => {
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
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-lg">
                                                Pedido #{order.id.slice(-8)}
                                            </CardTitle>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {format(new Date(order.created_date), "dd/MM/yyyy 'às' HH:mm")}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                            <Select 
                                                value={order.status} 
                                                onValueChange={(value) => updateOrderStatus(order.id, value)}
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pendente">Pendente</SelectItem>
                                                    <SelectItem value="confirmado">Confirmado</SelectItem>
                                                    <SelectItem value="em_preparacao">Em Preparação</SelectItem>
                                                    <SelectItem value="saiu_para_entrega">Saiu para Entrega</SelectItem>
                                                    <SelectItem value="entregue">Entregue</SelectItem>
                                                    <SelectItem value="cancelado">Cancelado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <span className="text-lg font-bold text-blue-600">
                                                R$ {order.total_amount?.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Customer Info */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <h4 className="font-semibold text-slate-700 mb-3">Informações do Cliente:</h4>
                                            <div className="space-y-2 text-sm">
                                                <p><strong>Nome:</strong> {order.customer_name}</p>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-slate-500" />
                                                    <span>{order.customer_email}</span>
                                                </div>
                                                {order.customer_phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-slate-500" />
                                                        <span>{order.customer_phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                Endereço de Entrega:
                                            </h4>
                                            <p className="text-sm text-slate-600">{order.delivery_address}</p>
                                            {order.notes && (
                                                <p className="text-sm text-slate-500 mt-2">
                                                    <strong>Observações:</strong> {order.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-3">Itens do Pedido:</h4>
                                        <div className="space-y-2">
                                            {items.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
                                                    <div>
                                                        <span className="font-medium">{item.product_name}</span>
                                                        <span className="text-slate-500 ml-2">
                                                            x{item.quantity} | R$ {item.unit_price?.toFixed(2)} cada
                                                        </span>
                                                    </div>
                                                    <span className="font-medium text-slate-700">
                                                        R$ {item.total_price?.toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {filteredOrders.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="text-8xl mb-6">📋</div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                        Nenhum pedido encontrado
                    </h3>
                    <p className="text-slate-500">
                        {selectedStatus === "all" ? "Ainda não há pedidos no sistema" : "Nenhum pedido com este status"}
                    </p>
                </motion.div>
            )}
        </div>
    );
}