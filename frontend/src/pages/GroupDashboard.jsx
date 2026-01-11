import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import AddExpenseModal from "../components/AddExpenseModal";
import socket from "../socket";
import NotificationBell from "../components/NotificationBell";

export default function GroupDashboard() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [group, setGroup] = useState(null);

  const [balances, setBalances] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [settlements, setSettlements] = useState([]);

  // ✅ NEW: pending settlements
  const [pendingSettlements, setPendingSettlements] = useState([]);

  // ✅ NEW: myId
  const [myId, setMyId] = useState(null);

  const [inviteLink, setInviteLink] = useState("");
  const [activeTab, setActiveTab] = useState("SUMMARY"); // SUMMARY | SETTLE | EXPENSES | LEDGER

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Load all data
  const load = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [groupRes, balRes, ledgerRes, expRes, settleRes,meRes] =
        await Promise.all([
          api.get(`/groups/${groupId}`),
          api.get(`/groups/${groupId}/balances`),
          api.get(`/groups/${groupId}/ledger`),
          api.get(`/groups/${groupId}/expenses`),
          api.get(`/groups/${groupId}/settlements`),
          api.get(`/me`)
        ]);

      setBalances(balRes.data);
      setLedger(ledgerRes.data.entries || []);
      setExpenses(expRes.data.expenses || []);
      setSettlements(settleRes.data.settlements || []);
      setPendingSettlements(settleRes.data.pending || []);
      setGroup(groupRes.data);

      // ✅ myId from localStorage (NO /me API)
      setMyId(meRes.data.user._id);
    } catch (err) {
      console.error("Group dashboard load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load(false);
  }, [groupId]);

  // ✅ SOCKET
  useEffect(() => {
    if (!groupId) return;

    socket.emit("join_group", groupId);

    socket.on("settlement_requested", (data) => {
      if (data.groupId === groupId) {
        alert(` New settlement request: ₹${data.amount}`);
        load(true);
      }
    });

    socket.on("settlement_completed", (data) => {
      if (data.groupId === groupId) {
        alert(`✅ Settlement completed: ₹${data.amount}`);
        load(true);
      }
    });

    socket.on("settlement_rejected", (data) => {
      if (data.groupId === groupId) {
        alert(`❌ Settlement rejected: ₹${data.amount}`);
        load(true);
      }
    });

    socket.on("expense_created", (data) => {
      if (data.groupId === groupId) {
        alert(`✅ New expense: ${data.title} (₹${data.amount})`);
        load(true);
      }
    });

    socket.on("notification:new", (data) => {
      if (data.groupId === groupId) {
        load(true);
      }
    });

    return () => {
      socket.off("settlement_requested");
      socket.off("settlement_completed");
      socket.off("settlement_rejected");
      socket.off("expense_created");
      socket.off("notification:new");
    };
  }, [groupId]);

  // ✅ Invite
  const generateInvite = async () => {
    try {
      const res = await api.post(`/groups/${groupId}/invite`);
      const full = `${res.data.inviteLink}`;
      setInviteLink(full.split("/")[2]);
    } catch (err) {
      console.error("Invite error:", err);
      alert(err?.response?.data?.message || "Invite generation failed");
    }
  };

  const copyInvite = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    alert("Invite Token copied to clipboard");
  };

  

  // ✅ Actions (2-way settlement)

  // Debtor clicks: Request Settlement
  const requestPaid = async (s) => {
    try {
      await api.post(`/groups/${groupId}/settlements/request`, {
        fromId: s.fromId,
        toId: s.toId,
        amount: s.amount,
      });

      alert("✅ Payment requested. Waiting for receiver confirmation.");
      load(true);
    } catch (err) {
      console.error("Request paid error:", err);
      alert(err?.response?.data?.message || "Failed to request settlement");
    }
  };

  // Receiver confirms
  // Receiver confirms
const confirmSettlement = async (requestId) => {
  try {
    await api.post(`/groups/${groupId}/settlements/confirm`, {
      requestId,            // ✅ FIXED (backend expects requestId)
      action: "CONFIRM",
    });

    alert("✅ Confirmed! Settlement completed.");
    load(true);
  } catch (err) {
    console.error("Confirm settlement error:", err);
    alert(err?.response?.data?.message || "Failed to confirm settlement");
  }
};

// Receiver rejects
const rejectSettlement = async (requestId) => {
  try {
    await api.post(`/groups/${groupId}/settlements/confirm`, {
      requestId,            // ✅ FIXED
      action: "REJECT",
    });

    alert("❌ Settlement rejected.");
    load(true);
  } catch (err) {
    console.error("Reject settlement error:", err);
    alert(err?.response?.data?.message || "Failed to reject settlement");
  }
};


  // Receiver reminder (to debtor)
  const sendReminder = async (s) => {
    try {
      await api.post(`/groups/${groupId}/settlements/remind`, {
        toId: s.fromId, // ✅ debtor gets reminder
        amount: s.amount,
      });

      alert("✅ Reminder sent!");
    } catch (err) {
      console.error("reminder error:", err);
      alert(err?.response?.data?.message || "Failed to send reminder");
    }
  };

  // ✅ Build lookup so we can prevent duplicate requests
  const pendingLookup = useMemo(() => {
    const map = new Map();

    for (const p of pendingSettlements) {
      const key = `${p.fromId}_${p.toId}_${Number(p.amount)}`;
      map.set(key, p);
    }

    return map;
  }, [pendingSettlements]);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Loading dashboard...</p>
      </div>
    );
  }

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
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Group Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                {group?.name?.charAt(0) || "G"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {group?.name}
                </h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{group?.members?.length || 0} members</span>
                  <span>•</span>
                  <span>Created by {group?.owner?.username}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <NotificationBell groupId={groupId} />

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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Expense
              </button>
            </div>
          </div>

          {/* Invite link */}
          {inviteLink && (
            <div className="mt-4 p-3 bg-cyan-50 border border-cyan-100 rounded-lg flex items-center justify-between gap-4 animate-fade-in">
              <div className="flex-1 truncate text-sm text-cyan-800 font-mono bg-white/50 px-2 py-1 rounded border border-cyan-200/50">
                {inviteLink}
              </div>
              <button
                onClick={copyInvite}
                className="text-xs font-bold text-cyan-700 hover:text-cyan-900 uppercase tracking-wide"
              >
                Copy Token
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
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
                ${
                  activeTab === t.key
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
            <svg
              className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            REFRESH
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* SUMMARY */}
        {activeTab === "SUMMARY" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider">
                You are owed
              </h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-emerald-600">
                  ₹{balances?.youGet || 0}
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider">
                You owe
              </h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-red-600">
                  ₹{balances?.youOwe || 0}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm text-white">
              <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider">
                Net Balance
              </h3>
              <div className="mt-2">
                <span
                  className={`text-3xl font-bold ${
                    (balances?.youGet - balances?.youOwe) >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {((balances?.youGet || 0) - (balances?.youOwe || 0)) >= 0
                    ? "+"
                    : "-"}
                  ₹
                  {Math.abs(
                    (balances?.youGet || 0) - (balances?.youOwe || 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* EXPENSES */}
        {activeTab === "EXPENSES" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Expense History</h3>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {expenses.length} Records
              </span>
            </div>

            {expenses.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <p>No expenses recorded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {expenses.map((e) => (
                  <div
                    key={e._id}
                    className="p-4 hover:bg-slate-50 transition-colors flex justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{e.title}</p>
                      <p className="text-xs text-slate-400">
                        Paid by{" "}
                        <span className="font-medium text-slate-600">
                          {e.paidBy?.username || "Unknown"}
                        </span>{" "}
                        • {new Date(e.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹{e.amount}</p>
                      <p className="text-xs text-slate-400">
                        split by {e.splitBetween?.length || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTLE */}
        {activeTab === "SETTLE" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 text-center">
              <h3 className="text-emerald-800 font-bold text-lg">
                Who owes who?
              </h3>
              <p className="text-emerald-600 text-sm">
                Receiver must confirm settlement request.
              </p>
            </div>

            {/* ✅ Pending confirmations */}
            {pendingSettlements.length > 0 && (
              <div className="mb-6 space-y-3">
                <h3 className="text-slate-800 font-bold">
                  Pending confirmations
                </h3>

                {pendingSettlements.map((p) => (
                  <div
                    key={p._id}
                    className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex justify-between items-center"
                  >
                    <div className="text-sm text-slate-700">
                      <b>{p.fromName}</b> requested settlement to{" "}
                      <b>{p.toName}</b> of ₹{p.amount}
                    </div>

                    <div className="flex gap-2">
                      {p.canConfirm ? (
                        <>
                          <button
                            onClick={() => confirmSettlement(p._id)}
                            className="px-3 py-1 rounded bg-green-600 text-white font-bold text-sm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => rejectSettlement(p._id)}
                            className="px-3 py-1 rounded bg-red-600 text-white font-bold text-sm"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500 font-semibold">
                          Waiting for receiver confirmation...
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ Settlement Suggestions */}
            {settlements.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                <h3 className="text-lg font-bold text-slate-900">
                  All Settled Up!
                </h3>
                <p className="text-slate-500">No pending debts in this group.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {settlements.map((s, idx) => {
                  // ✅ compute roles
                  const debtorId = s.fromId; // pays
                  const receiverId = s.toId; // receives

                  const iAmDebtor = myId && myId === debtorId;
                  const iAmReceiver = myId && myId === receiverId;

                  // ✅ pending exists?
                  const key = `${s.fromId}_${s.toId}_${Number(s.amount)}`;
                  const pending = pendingLookup.get(key);

                  return (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">
                          {s.fromName}
                        </span>
                        <span className="text-slate-400 text-sm">pays</span>
                        <span className="font-bold text-slate-800">
                          {s.toName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-emerald-600">
                          ₹{s.amount}
                        </span>

                        {/* ✅ if pending exists, show status */}
                        {pending ? (
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded">
                            Request Already Sent ✅
                          </span>
                        ) : (
                          <>
                            {/* ✅ ONLY debtor can request paid */}
                            {iAmDebtor && (
                              <button
                                onClick={() => requestPaid(s)}
                                className="text-xs font-bold text-white bg-slate-900 px-3 py-2 rounded hover:bg-slate-800"
                              >
                                Request Paid
                              </button>
                            )}

                            {/* ✅ ONLY receiver can remind debtor */}
                            {iAmReceiver && (
                              <button
                                onClick={() => sendReminder(s)}
                                className="text-xs font-bold text-white bg-orange-600 px-3 py-2 rounded hover:bg-orange-700"
                              >
                                Remind
                              </button>
                            )}

                            {/* ✅ if not debtor or receiver (shouldn't happen), show nothing */}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* LEDGER */}
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
                        <span className="mx-1 text-slate-400">•</span>₹
                        {entry?.data?.amount}
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
