// src/pages/Donations.jsx
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Download, Search } from 'lucide-react';

export default function Donations() {
  const [donations, setDonations] = useLocalStorage('c3r_donations', [
    { id: 1, donorName: 'Mahindra & Mahindra (India) Ltd', amount: 5, category: 'Corporate', date: '2024-01-15', status: 'Completed' },
    { id: 2, donorName: 'HDFC Bank Ltd', amount: 7.5, category: 'Corporate', date: '2024-01-20', status: 'Completed' },
    { id: 3, donorName: 'Wipro Limited', amount: 7.5, category: 'Corporate', date: '2024-01-25', status: 'Completed' },
    { id: 4, donorName: 'Bajaj Auto', amount: 3, category: 'Corporate', date: '2024-02-01', status: 'Completed' },
  ]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filteredDonations = donations.filter(d => {
    const matchesSearch = d.donorName.toLowerCase().includes(search.toLowerCase());
    if (filterCategory === 'all') return matchesSearch;
    return matchesSearch && d.category === filterCategory;
  });

  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
  const exportData = () => { const blob = new Blob([JSON.stringify(donations, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `donations_${new Date().toISOString()}.json`; a.click(); URL.revokeObjectURL(url); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h2 className="text-lg font-semibold">Donation Management</h2><button onClick={exportData} className="btn-secondary text-sm flex items-center gap-1"><Download className="w-4 h-4" /> Export</button></div>

      <div className="grid grid-cols-2 gap-4"><div className="bg-indigo-50 rounded-xl p-4"><p className="text-xs text-indigo-600 font-medium">Total Donations</p><p className="text-2xl font-bold text-indigo-700">₹{totalAmount.toFixed(2)}L</p></div><div className="bg-green-50 rounded-xl p-4"><p className="text-xs text-green-600 font-medium">Total Donors</p><p className="text-2xl font-bold text-green-700">{donations.length}</p></div></div>

      <div className="flex gap-3"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search donor..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" /></div><select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-field w-40"><option value="all">All Categories</option><option>Corporate</option><option>Individual</option></select></div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left">Donor Name</th><th className="px-4 py-3 text-left">Amount (₹L)</th><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Status</th></tr></thead><tbody>{filteredDonations.map(d => (<tr key={d.id} className="border-b"><td className="px-4 py-3 font-medium">{d.donorName}</td><td className="px-4 py-3">₹{d.amount}L</td><td className="px-4 py-3">{d.category}</td><td className="px-4 py-3">{new Date(d.date).toLocaleDateString()}</td><td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">{d.status}</span></td></tr>))}</tbody></table></div></div>
    </div>
  );
}