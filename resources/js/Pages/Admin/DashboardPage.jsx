import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StatCard } from '@/Components/ReusableUI';
import { Briefcase, DollarSign, Archive } from 'lucide-react';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalFleet: 0,
        fleetAvailable: 0,
        ordersThisMonth: 0,
        ordersInProgress: 0,
        pendingPayments: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        // UPDATE URL API: Tambahkan /api/ di depan
        axios.get('/api/admin/dashboard-stats')
            .then(response => {
                const data = response.data;
                setStats({
                    totalFleet: data.totalFleet,
                    fleetAvailable: data.fleetAvailable,
                    ordersThisMonth: data.ordersThisMonth,
                    ordersInProgress: data.ordersInProgress,
                    pendingPayments: data.pendingPayments,
                });
                setRecentOrders(data.recentOrders);
            })
            .catch(error => console.error("Gagal mengambil stats dashboard:", error));
    }, []);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Armada" value={stats.totalFleet} subtext={`${stats.fleetAvailable} tersedia`} icon={Briefcase} iconBgColor="bg-blue-500" />
                <StatCard label="Pesanan Bulan Ini" value={stats.ordersThisMonth} subtext={`${stats.ordersInProgress} dalam proses`} icon={Archive} iconBgColor="bg-purple-500" />
                <StatCard label="Pembayaran Pending" value={stats.pendingPayments} subtext="Menunggu verifikasi" icon={DollarSign} iconBgColor="bg-yellow-500" />
            </div>

            <div>
                <h3 className="text-base font-semibold text-slate-700 mb-4">Pesanan Terbaru</h3>
                <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 space-y-3">
                    {recentOrders.length > 0 ? recentOrders.map((order) => (
                        <div key={order.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-medium text-slate-800 text-sm">{order.id}</p>
                                <p className="text-xs text-slate-500">{order.customer} - {order.route}</p>
                            </div>
                            <span className="text-xs text-slate-400">{order.date}</span>
                        </div>
                    )) : (
                        <p className="text-sm text-slate-400 text-center py-4">Belum ada pesanan terbaru.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;