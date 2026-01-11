import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoggedOutLanding from "./LoggedOutLanding";
import { AuthContext } from "../Context/AuthContext.jsx";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  return <LoggedOutLanding />;
}
