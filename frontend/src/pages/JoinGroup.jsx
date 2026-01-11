import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function JoinGroup() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [msg, setMsg] = useState("Joining group...");

  useEffect(() => {
    const join = async () => {
      try {
        const res = await api.post(`/groups/join/${token}`);
        setMsg("✅ Joined successfully. Redirecting...");
        navigate(`/groups/${res.data.groupId}`);
      } catch (err) {
        setMsg(err?.response?.data?.message || "Join failed");
      }
    };

    join();
  }, [token, navigate]);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold">{msg}</h2>
    </div>
  );
}
