import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newGroupName, setNewGroupName] = useState("");
  const [inviteToken, setInviteToken] = useState("");

  const navigate = useNavigate();

  const loadGroups = async () => {
    try {
      const res = await api.get("/me/groups");
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error("Load groups error:", err);
      // In a real app, use a toast notification here
      alert(err?.response?.data?.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const createGroup = async (e) => {
    e.preventDefault();

    if (!newGroupName.trim()) return alert("Group name required");

    try {
      const res = await api.post("/groups", {
        name: newGroupName,
        members: [] // backend adds owner automatically
      });

      setNewGroupName("");
      await loadGroups();

      if (res.data.groupId) navigate(`/groups/${res.data.groupId}`);

    } catch (err) {
      console.error("Create group error:", err);
      alert(err?.response?.data?.message || "Create group failed");
    }
  };

  const joinGroup = async (e) => {
    e.preventDefault();
    if (!inviteToken.trim()) return alert("Invite token required");

    try {
      const res = await api.post(`/groups/join/${inviteToken}`);
      alert("Joined group ✅");
      navigate(`/groups/${res.data.groupId}`);
    } catch (err) {
      console.error("Join group error:", err);
      alert(err?.response?.data?.message || "Join failed");
    }
  };

  // Loading State Skeleton
  if (loading) return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
        <div className="md:col-span-2 space-y-4">
            <div className="h-8 w-1/3 bg-slate-200 rounded"></div>
            <div className="h-24 bg-slate-200 rounded-xl"></div>
            <div className="h-24 bg-slate-200 rounded-xl"></div>
        </div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
    </div>
  );

  return (
    <div className="min-h-full w-full bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your expense groups and memberships.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: Groups List (Takes up 2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Your Groups
                    </h2>
                    <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                        {groups.length} Active
                    </span>
                </div>

                {groups.length === 0 ? (
                  /* Empty State Design */
                  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg">No groups found</h3>
                    <p className="text-slate-500 max-w-xs mt-1">You aren't part of any expense groups yet. Create one or join via invite.</p>
                  </div>
                ) : (
                  /* Groups Grid */
                  <div className="grid gap-4">
                    {groups.map((g) => (
                      <div
                        key={g._id}
                        className="group relative p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all duration-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                            {/* Generated Avatar based on group name */}
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xl uppercase">
                                {g.name.charAt(0)}
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-cyan-700 transition-colors">
                                    {g.name}
                                </h3>
                                <div className="flex items-center text-sm text-slate-500 gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    {g.members?.length || 0} Members
                                </div>
                            </div>
                        </div>

                        <button
                          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-cyan-600 bg-slate-50 hover:bg-cyan-50 px-4 py-2 rounded-lg transition-colors"
                          onClick={() => navigate(`/groups/${g._id}`)}
                        >
                          Open
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* RIGHT COLUMN: Actions (Sticky Sidebar) */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* Create Group Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Start New Group</h2>
                    </div>
                    
                    <form onSubmit={createGroup} className="flex flex-col gap-3">
                        <input
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="e.g. Hawaii Trip 2026"
                            className="w-full p-3 rounded-lg bg-slate-50 text-slate-900 border border-slate-200 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        />
                        <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 hover:shadow-lg transition-all">
                            Create Group
                        </button>
                    </form>
                </div>

                {/* Join Group Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Have an invite?</h2>
                    </div>

                    <form onSubmit={joinGroup} className="flex flex-col gap-3">
                        <input
                            value={inviteToken}
                            onChange={(e) => setInviteToken(e.target.value)}
                            placeholder="Paste token here"
                            className="w-full p-3 rounded-lg bg-slate-50 text-slate-900 border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono text-sm"
                        />
                        <button className="w-full bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-lg hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-all">
                            Join Group
                        </button>
                    </form>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
}