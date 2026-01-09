import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";
import CountUp from "react-countup";
import { Link } from "react-router-dom";


const MetricCard = ({ title, value, colorClass }) => {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const textColor = colorClass || (isNegative ? "text-green-400" : "text-red-400");

  return (
    <div className="bg-white/5 p-6 rounded-xl shadow-2xl border border-white/10 flex flex-col justify-between hover:bg-white/10 transition duration-300">
      <h3 className="text-sm font-light uppercase text-gray-400 mb-4">{title}</h3>
      <div className="flex items-center justify-between">
        <p className={`text-4xl font-extrabold ${textColor} tracking-tight`}>
          <CountUp
            start={0}
            end={absValue || 0}
            duration={2}
            decimals={2}
            prefix="₹"
          />
        </p>
      </div>
      <p className={`text-xs mt-3 ${isNegative ? "text-green-300" : "text-red-300"}`}>
        {isNegative
          ? "You are owed this amount."
          : value > 0
          ? "You owe this amount."
          : "No pending balance."}
      </p>
    </div>
  );
};

export default function Dashboard() {
  const { user, userData, transactions, loading } = useContext(AuthContext);

  if (loading) {
    return <p className="text-center text-gray-400">Loading Dashboard...</p>;
  }

  if (!user) {
    return <p className="text-center text-red-400">Please log in to view your dashboard.</p>;
  }

  const totalBalance = userData?.balance || 0;
  const balanceValue = totalBalance < 0 ? totalBalance : 0;
  const oweValue = totalBalance > 0 ? totalBalance : 0;

  
  const sortedTransactions = transactions
    ? [...transactions].sort((a, b) => {
       
        const dateA = new Date(a.timestamp || a.date || a._id);
        const dateB = new Date(b.timestamp || b.date || b._id);
        
        
        return dateB - dateA; 
      })
    : [];

  return (
    <div className="min-h-full space-y-10">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h1 className="text-5xl font-extrabold text-white mb-2 tracking-wide">
          Welcome, {user?.username}
        </h1>
        <h3 className="text-xl font-light text-cyan-400">
          Your Expense Splitting Dashboard
        </h3>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Your Balance"
          value={balanceValue}
          colorClass="text-green-400"
        />

        <MetricCard
          title="Amount You Owe"
          value={oweValue}
          colorClass="text-red-400"
        />

        <div className="bg-cyan-500/10 p-6 rounded-xl shadow-2xl border border-cyan-500/30 flex flex-col items-center justify-center text-center hover:bg-cyan-500/20 transition duration-300">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Quick Action</h3>
          <Link
            to="/createEntry"
            className="bg-cyan-500 text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg shadow-cyan-500/50 hover:bg-cyan-400 transition duration-200 text-lg"
          >
            Split Expense
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="pt-4">
        <h2 className="text-3xl font-semibold text-white mb-6 border-b border-white/10 pb-2">
          Recent Activity
        </h2>

        
        {sortedTransactions.length > 0 ? (
          <ul className="space-y-4">
            {/* Slice the sorted array */}
            {sortedTransactions.slice(0, 5).map((tx) => (
              <li
                key={tx._id}
                className={`flex justify-between items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition duration-200 border-l-4 ${
                  tx.amount < 0 ? "border-red-500" : "border-green-500" 
                }`}
              >
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-50">{tx.details || tx.description || 'No Description'}</p> {/* Use tx.details if that's the field from your form */}
                  <p className="text-sm text-gray-400">
                    {new Date(tx.timestamp || tx.date || tx._id).toLocaleDateString("en-IN", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}
                  </p>
                </div>
                <p
                  className={`text-xl font-bold ${
                    tx.amount < 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  ₹{Math.abs(tx.amount).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No transactions found.</p>
        )}

        <div className="text-center mt-6">
          <Link
            to="/history"
            className="text-cyan-400 hover:text-cyan-300 transition duration-150 font-medium"
          >
            View All Transactions →
          </Link>
        </div>
      </div>
    </div>
  );
}