import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../components/FullScreenLoader";
import NotificationBell from "../components/NotificationBell"; // ✅ NEW

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
      const res = await api.post("/groups", { name: newGroupName, members: [] });
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
      alert("Joined group successfully");
      navigate(`/groups/${res.data.groupId}`);
    } catch (err) {
      console.error("Join group error:", err);
      alert(err?.response?.data?.message || "Join failed");
    }
  };

  if (loading) return <FullScreenLoader text="Loading workspace..." />;

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Background Texture */}
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* --- 1. HERO SECTION (With Illustration) --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-10 overflow-hidden relative">
          {/* ✅ Top-right Bell */}
          <div className="absolute top-4 right-4">
            <NotificationBell />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
            {/* Text & Actions */}
            <div className="flex-1 w-full">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                My Workspaces
              </h1>

              <p className="text-slate-500 mb-8 max-w-lg">
                Create a new group for a trip, project, or flatmates, or join an
                existing one using an invite code.
              </p>

              {/* Action Forms (Compact) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Create */}
                <form
                  onSubmit={createGroup}
                  className="flex gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-cyan-100 transition-all"
                >
                  <input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="New Group Name"
                    className="flex-1 bg-transparent px-3 outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
                  />
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-slate-800 transition-colors">
                    Create
                  </button>
                </form>

                {/* Join */}
                <form
                  onSubmit={joinGroup}
                  className="flex gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-cyan-100 transition-all"
                >
                  <input
                    value={inviteToken}
                    onChange={(e) => setInviteToken(e.target.value)}
                    placeholder="Enter Invite Token"
                    className="flex-1 bg-transparent px-3 outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
                  />
                  <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-slate-100 transition-colors">
                    Join
                  </button>
                </form>
              </div>
            </div>

            {/* VISUAL ILLUSTRATION (SVG) */}
            <div className="hidden md:block w-64 h-40 relative">
              <svg
                viewBox="0 0 200 150"
                className="w-full h-full drop-shadow-xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="100" cy="75" r="60" fill="#ecfeff" />
                <circle cx="150" cy="40" r="30" fill="#f0f9ff" />

                <rect
                  x="70"
                  y="55"
                  width="60"
                  height="40"
                  rx="8"
                  fill="#fff"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <line
                  x1="80"
                  y1="65"
                  x2="120"
                  y2="65"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="80"
                  y1="75"
                  x2="100"
                  y2="75"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <line
                  x1="100"
                  y1="55"
                  x2="100"
                  y2="30"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <line
                  x1="130"
                  y1="75"
                  x2="160"
                  y2="75"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <line
                  x1="70"
                  y1="75"
                  x2="40"
                  y2="75"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                <circle cx="100" cy="30" r="12" fill="#06b6d4" />
                <circle cx="160" cy="75" r="12" fill="#3b82f6" />
                <circle cx="40" cy="75" r="12" fill="#64748b" />

                <path d="M96 30l4-4 4 4" stroke="white" strokeWidth="2" fill="none" />
                <path d="M156 75h8" stroke="white" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* --- 2. LIST SECTION --- */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Active Groups ({groups.length})
          </h2>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
            <p className="text-slate-400 font-medium">No groups created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((g) => (
              <div
                key={g._id}
                onClick={() => navigate(`/groups/${g._id}`)}
                className="
                  cursor-pointer bg-white p-4 rounded-xl border border-slate-200 shadow-sm 
                  hover:border-cyan-400 hover:shadow-md transition-all duration-200
                  flex items-center gap-4 group
                "
              >
                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 truncate group-hover:text-cyan-700 transition-colors">
                    {g.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {g.members?.length || 0} members
                  </p>
                </div>

                <div className="text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
