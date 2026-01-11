import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";

export default function AddExpenseModal({ groupId, onClose, onSuccess }) {
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const [payer, setPayer] = useState("");
  const [selected, setSelected] = useState(new Set());

  const [mode, setMode] = useState("EQUAL"); // EQUAL | CUSTOM
  const [customSplits, setCustomSplits] = useState({});

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setMembersLoading(true);
        const res = await api.get(`/groups/${groupId}/members`);

        const m = res.data.members || [];
        setMembers(m);

        if (m.length > 0) {
          setPayer(m[0]._id);
          setSelected(new Set(m.map((x) => x._id)));
        }
      } catch (err) {
        console.error("Members fetch failed:", err);
      } finally {
        setMembersLoading(false);
      }
    };

    loadMembers();
  }, [groupId]);

  const selectedMembers = useMemo(
    () => members.filter((m) => selected.has(m._id)),
    [members, selected]
  );

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const equalSplits = useMemo(() => {
    const total = Number(amount);
    if (!total || selectedMembers.length === 0) return {};
    const each = total / selectedMembers.length;

    const splits = {};
    for (const m of selectedMembers) splits[m._id] = Number(each.toFixed(2));
    return splits;
  }, [amount, selectedMembers]);

  const splitsToSend = mode === "EQUAL" ? equalSplits : customSplits;

  const handleCustomSplit = (id, val) => {
    setCustomSplits((prev) => ({
      ...prev,
      [id]: Number(val),
    }));
  };

  const submit = async () => {
    if (!title.trim()) return alert("Title required");
    if (!amount || Number(amount) <= 0) return alert("Valid amount required");
    if (!payer) return alert("Select payer");
    if (selectedMembers.length === 0) return alert("Select participants");

    const sum = Object.values(splitsToSend).reduce((a, b) => a + Number(b || 0), 0);
    if (Math.abs(sum - Number(amount)) > 0.5) {
      return alert(`Split total (${sum}) must equal amount (${amount})`);
    }

    try {
      setSaving(true);
      await api.post(`/groups/${groupId}/expenses`, {
        title,
        payer,
        splits: splitsToSend,
      });

      alert("Expense added successfully");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Create expense failed:", err);
      alert(err?.response?.data?.message || "Failed to add expense");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Add New Expense</h2>
                <p className="text-xs text-slate-500">Record a payment for the group.</p>
            </div>
            <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {membersLoading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-500">Loading members...</p>
                </div>
            ) : members.length === 0 ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center">
                    No members found. Invite someone to the group first.
                </div>
            ) : (
                <>
                    {/* 1. Title & Amount Row */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </span>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Weekend Dinner"
                                    className="w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl outline-none border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
                                <input
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    type="number"
                                    className="w-full pl-8 p-3 bg-slate-50 text-slate-900 rounded-xl outline-none border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-bold text-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Paid By Selection */}
                    <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Paid By</label>
                         <div className="relative">
                            <select
                                value={payer}
                                onChange={(e) => setPayer(e.target.value)}
                                className="w-full p-3 bg-white text-slate-900 rounded-xl outline-none border border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none cursor-pointer"
                            >
                                {members.map((m) => (
                                <option key={m._id} value={m._id}>
                                    {m.username}
                                </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                         </div>
                    </div>

                    {/* 3. Split Mode Toggle */}
                    <div className="p-1 bg-slate-100 rounded-lg flex">
                        <button
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                                mode === "EQUAL" 
                                ? "bg-white text-cyan-600 shadow-sm" 
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                            onClick={() => setMode("EQUAL")}
                        >
                            Equal Split
                        </button>
                        <button
                             className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                                mode === "CUSTOM" 
                                ? "bg-white text-cyan-600 shadow-sm" 
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                            onClick={() => setMode("CUSTOM")}
                        >
                            Custom Split
                        </button>
                    </div>

                    {/* 4. Participants List */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Split Amongst</label>
                             {mode === "EQUAL" && (
                                <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">
                                    ₹{selectedMembers.length ? (Number(amount) / selectedMembers.length).toFixed(2) : "0"}/person
                                </span>
                             )}
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                            {members.map((m) => (
                                <div
                                    key={m._id}
                                    className={`
                                        flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer
                                        ${selected.has(m._id) 
                                            ? "bg-cyan-50 border-cyan-200" 
                                            : "bg-white border-slate-200 hover:border-slate-300"
                                        }
                                    `}
                                    onClick={() => toggleSelect(m._id)}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Checkbox Visual */}
                                        <div className={`
                                            w-5 h-5 rounded flex items-center justify-center border transition-colors
                                            ${selected.has(m._id) ? "bg-cyan-500 border-cyan-500" : "bg-white border-slate-300"}
                                        `}>
                                            {selected.has(m._id) && (
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </div>
                                        <span className={`text-sm font-medium ${selected.has(m._id) ? "text-cyan-900" : "text-slate-700"}`}>
                                            {m.username}
                                        </span>
                                    </div>

                                    {/* Custom Amount Input */}
                                    {mode === "CUSTOM" && selected.has(m._id) && (
                                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                            <span className="text-slate-400 text-sm mr-1">₹</span>
                                            <input
                                                type="number"
                                                value={customSplits[m._id] || ""}
                                                onChange={(e) => handleCustomSplit(m._id, e.target.value)}
                                                className="w-20 p-1 text-right bg-white border border-slate-300 rounded focus:border-cyan-500 outline-none text-sm font-bold text-slate-800"
                                                placeholder="0"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
             <button
                disabled={saving || membersLoading}
                onClick={submit}
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {saving ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                    </>
                ) : "Save Expense"}
            </button>
        </div>

      </div>
    </div>
  );
}