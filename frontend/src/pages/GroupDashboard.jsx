import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import AddExpenseModal from "../components/AddExpenseModal";

export default function GroupDashboard() {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [group, setGroup] = useState(null);

    const [balances, setBalances] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [ledger, setLedger] = useState([]);
    const [settlements, setSettlements] = useState([]);

    const [inviteLink, setInviteLink] = useState("");
    const [activeTab, setActiveTab] = useState("SUMMARY"); // SUMMARY | SETTLE | EXPENSES | LEDGER

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const [groupRes, balRes, ledgerRes, expRes, settleRes] = await Promise.all([
                api.get(`/groups/${groupId}`),
                api.get(`/groups/${groupId}/balances`),
                api.get(`/groups/${groupId}/ledger`),
                api.get(`/groups/${groupId}/expenses`),
                api.get(`/groups/${groupId}/settlements`),
            ]);

            setBalances(balRes.data);
            setLedger(ledgerRes.data.entries || []);
            setExpenses(expRes.data.expenses || []);
            setSettlements(settleRes.data.settlements || []);
            setGroup(groupRes.data);
        } catch (err) {
            console.error("Group dashboard load error:", err);
            // alert(err?.response?.data?.message || "Failed to load group data");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        load(false);
    }, [groupId]);

    const generateInvite = async () => {
        try {
            const res = await api.post(`/groups/${groupId}/invite`);
            const full = `http://localhost:5173${res.data.inviteLink}`;
            setInviteLink(full);
        } catch (err) {
            console.error("Invite error:", err);
            alert(err?.response?.data?.message || "Invite generation failed");
        }
    };

    const copyInvite = async () => {
        if (!inviteLink) return;
        await navigator.clipboard.writeText(inviteLink);
        alert("Invite link copied to clipboard");
    };

    // LOADING STATE
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                <p className="font-medium">Loading dashboard...</p>
            </div>
        );
    }
    const markPaid = async (s) => {
  try {
    await api.post(`/groups/${groupId}/settlements/mark-paid`, {
      fromId: s.fromId,
      toId: s.toId,
      amount: s.amount,
    });

    alert("Marked as paid ✅");
    load(true);
  } catch (err) {
    console.error("Mark paid error:", err);
    alert(err?.response?.data?.message || "Failed to mark paid");
  }
};


    return (
        <div className="min-h-screen w-full bg-slate-50 pb-20">

            {/* --- HEADER SECTION --- */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-6">

                    {/* Breadcrumbs / Back */}
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 mb-4 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Back to Dashboard
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        {/* Group Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                                {group?.name?.charAt(0) || "G"}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                    {group?.name}
                                </h1>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        {group?.members?.length || 0} members
                                    </span>
                                    <span>•</span>
                                    <span>Created by {group?.owner?.username}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={generateInvite}
                                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all text-sm"
                            >
                                Invite Members
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Add Expense
                            </button>
                        </div>
                    </div>

                    {/* Invite Link Expandable */}
                    {inviteLink && (
                        <div className="mt-4 p-3 bg-cyan-50 border border-cyan-100 rounded-lg flex items-center justify-between gap-4 animate-fade-in">
                            <div className="flex-1 truncate text-sm text-cyan-800 font-mono bg-white/50 px-2 py-1 rounded border border-cyan-200/50">
                                {inviteLink}
                            </div>
                            <button
                                onClick={copyInvite}
                                className="text-xs font-bold text-cyan-700 hover:text-cyan-900 uppercase tracking-wide"
                            >
                                Copy Link
                            </button>
                        </div>
                    )}
                </div>

                {/* --- TABS --- */}
                <div className="max-w-6xl mx-auto px-6 flex items-center gap-8 border-t border-slate-100 mt-2 overflow-x-auto">
                    {[
                        { key: "SUMMARY", label: "Dashboard" },
                        { key: "EXPENSES", label: "Expenses" },
                        { key: "SETTLE", label: "Settle Up" },
                        { key: "LEDGER", label: "Activity" },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`
                                py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap
                                ${activeTab === t.key
                                    ? "border-cyan-500 text-cyan-700"
                                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                                }
                            `}
                        >
                            {t.label}
                        </button>
                    ))}

                    <button
                        onClick={() => load(true)}
                        className="ml-auto text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                        <svg className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        REFRESH
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* 1. SUMMARY TAB */}
                {activeTab === "SUMMARY" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Card: You are Owed */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg className="w-24 h-24 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                            </div>
                            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider">You are owed</h3>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-emerald-600">₹{balances?.youGet || 0}</span>
                                <span className="text-sm text-emerald-600/70 font-medium">in total</span>
                            </div>
                        </div>

                        {/* Card: You Owe */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg className="w-24 h-24 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            </div>
                            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider">You owe</h3>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-red-600">₹{balances?.youOwe || 0}</span>
                                <span className="text-sm text-red-600/70 font-medium">to others</span>
                            </div>
                        </div>

                        {/* Card: Net Balance */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden text-white">
                            <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider">Net Balance</h3>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className={`text-3xl font-bold ${(balances?.youGet - balances?.youOwe) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {((balances?.youGet || 0) - (balances?.youOwe || 0)) >= 0 ? "+" : "-"}
                                    ₹{Math.abs((balances?.youGet || 0) - (balances?.youOwe || 0))}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-4">Calculated across all group expenses.</p>
                        </div>
                    </div>
                )}


                {/* 2. EXPENSES TAB */}
                {activeTab === "EXPENSES" && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">Expense History</h3>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{expenses.length} Records</span>
                        </div>

                        {expenses.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                <p>No expenses recorded yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {expenses.map((e) => (
                                    <div key={e._id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:border group-hover:border-slate-200 group-hover:shadow-sm transition-all">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{e.title}</p>
                                                <p className="text-xs text-slate-400">
                                                    Paid by <span className="font-medium text-slate-600">{e.paidBy?.username || "Unknown"}</span> • {new Date(e.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">₹{e.amount}</p>
                                            <p className="text-xs text-slate-400">split by {e.splitBetween?.length || 0}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}


                {/* 3. SETTLE UP TAB */}
                {activeTab === "SETTLE" && (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 text-center">
                            <h3 className="text-emerald-800 font-bold text-lg">Who owes who?</h3>
                            <p className="text-emerald-600 text-sm">Suggested payments to settle all debts efficiently.</p>
                        </div>

                        {settlements.length === 0 ? (
                            <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">All Settled Up!</h3>
                                <p className="text-slate-500">No pending debts in this group.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {settlements.map((s, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800">{s.fromName || s.from}</span>
                                                <span className="text-slate-400 text-sm">pays</span>
                                                <span className="font-bold text-slate-800">{s.toName || s.to}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-lg text-emerald-600">₹{s.amount}</span>
                                            <button
                                                onClick={() => markPaid(s)}
                                                className="text-xs font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 hover:text-slate-600"
                                            >
                                                Mark Paid
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}


                {/* 4. LEDGER TAB */}
                {activeTab === "LEDGER" && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">Recent Activity</h3>
                        </div>
                        {ledger.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                <p>No activity recorded yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {ledger.map((entry) => (
                                    <div key={entry._id} className="p-4 flex items-start gap-4">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-slate-300"></div>
                                        <div>
                                            <p className="text-sm text-slate-700">
                                                <span className="font-bold">{entry.type}</span>
                                                <span className="mx-1 text-slate-400">•</span>
                                                ₹{entry?.data?.amount}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {new Date(entry.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* ✅ MODAL */}
            {showModal && (
                <AddExpenseModal
                    groupId={groupId}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => load(true)}
                />
            )}
        </div>
    );
}