import React, { useEffect, useRef, useState } from "react";
import api from "../api/api";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("notification load error:", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    // ✅ join user room from localStorage
    const me = JSON.parse(localStorage.getItem("user") || "null");
    if (me?._id) {
      socket.emit("join_user", me._id);
    }

    // ✅ realtime notifications
    socket.on("notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  // ✅ close dropdown ONLY when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markReadAll = async () => {
    try {
      await api.post("/notifications/read-all");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("mark read all error:", err);
    }
  };

  const gotoGroup = (groupId) => {
    setOpen(false);
    if (groupId) navigate(`/groups/${groupId}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setOpen((v) => !v); // ✅ minimise only by clicking bell
          if (!open) loadNotifications();
        }}
        className="relative p-2 rounded-full hover:bg-white/10 text-white text-xl"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Notifications</h3>

            <button
              onClick={markReadAll}
              className="text-xs font-bold text-cyan-700 hover:text-cyan-900"
            >
              Mark all read
            </button>
          </div>

          {/* ✅ Scrollable notifications */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => gotoGroup(n.groupId)}
                  className={`px-4 py-3 border-b border-slate-100 text-sm cursor-pointer ${
                    n.isRead ? "bg-white" : "bg-yellow-50"
                  }`}
                >
                  <p className="text-slate-800 font-semibold">{n.title}</p>
                  <p className="text-slate-500 text-xs mt-1">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
