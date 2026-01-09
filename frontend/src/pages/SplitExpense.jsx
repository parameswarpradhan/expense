import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

// Helper Component for Radio/Checkbox Items
const UserSelectionItem = ({ user, type, selectedValue, onChange, disabled = false, currentUsername }) => {
    const isChecked = type === 'radio' ? (selectedValue === user.username) : selectedValue.includes(user.username);
    const isCurrentUser = user.username === currentUsername;
    const id = `${type}-${user.username}`;
    
    return (
        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition duration-150">
            <input 
                type={type} 
                name={type} 
                value={user.username} 
                id={id} 
                checked={isChecked}
                onChange={onChange}
                disabled={disabled}
                // Custom Tailwind styling for radio/checkbox
                className="
                    h-5 w-5 text-cyan-500 bg-gray-700 border-gray-600 rounded 
                    focus:ring-cyan-500 focus:ring-2 appearance-none 
                    checked:bg-cyan-500 checked:border-transparent 
                    cursor-pointer
                " 
            />
            <label htmlFor={id} className="text-gray-200 font-medium cursor-pointer flex items-center">
                {user.username}
                {isCurrentUser && <span className="text-cyan-400 font-normal ml-2">(You)</span>}
            </label>
        </div>
    );
};


export default function SplitExpense() {
    const { user, url, setUserData,triggerRefresh } = useContext(AuthContext);
    const currentUsername = user?.username;
    
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState(null); 
    const [fetchError, setFetchError] = useState(null);

    const [refresh, setRefresh] = useState(false);
    const [details, setDetails] = useState("");
    const [selectedUser, setSelectedUser] = useState(""); 
    const [amount, setAmount] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const navigate=useNavigate();
    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url + 'entry', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
                setUserData(result);
            } catch (error) {
                setFetchError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refresh, url, setUserData]);

    // --- Handlers ---
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        
        // Prevent the current user from deselecting themselves if they are the last one selected
        // This is a safety measure to enforce good UX in most split apps.
        if (value === currentUsername && !checked && selectedUsers.length === 1) {
             setSubmitError("You cannot remove yourself if you are the only one selected in the split.");
             return;
        }

        if (checked) {
            setSelectedUsers((prev) => [...prev, value]);
        } else {
            setSelectedUsers((prev) => prev.filter((u) => u !== value));
        }
    };

    const handleDetails = (e) => { setDetails(e.target.value); }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        if (!selectedUser) { setSubmitError("Please select who contributed the money."); return; }
        if (selectedUsers.length === 0) { setSubmitError("Please select users to divide the expense between."); return; }
        if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) { setSubmitError("Please enter a valid amount greater than zero."); return; }

        const payload = {
            given: selectedUser,
            divided: selectedUsers,
            amount: parseFloat(amount),
            details: details
        };

        try {
            const response = await fetch(url + "entry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to record expense. Server rejected the submission.");

            alert("Expense recorded successfully!");
            if (triggerRefresh) {
                triggerRefresh();
            }
            setDetails("");
            setAmount("");
            setSelectedUser(""); // Reset form completely
            setSelectedUsers([]);
            
            setRefresh((prev) => !prev);
            navigate("/");
        } catch (err) {
            console.error(err);
            setSubmitError(err.message || "Error submitting entry. Please try again.");
        }
    };

    // --- Loading and Error States ---
    if (loading) {
        return <p className="text-center text-gray-400 pt-10">Fetching user data...</p>;
    }
    if (fetchError) {
        return <p className="text-center text-red-400 pt-10">Error loading users: {fetchError}</p>;
    }
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500 pt-10">No users available to split with.</p>;
    }
    
    // --- Main Form Render ---
    return (
        <div className="max-w-4xl mx-auto p-2 sm:p-4">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-white">Record New Expense</h1>
                <p className="text-base font-light text-cyan-400/80">Input the transaction details and splitting arrangements below.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Contribution Details (Compact) */}
                <div className="space-y-4 p-5 bg-white/5 rounded-xl border border-white/10">
                    <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Expense Amount & Title</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Amount Input */}
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount Paid (₹)</label>
                            <input 
                                className="w-full p-3 text-white bg-gray-800 rounded-md border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none placeholder-gray-400" 
                                type="number" 
                                id="amount" 
                                name="amount" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                placeholder="500.00"
                                min="0.01"
                                step="0.01"
                                required
                            />
                        </div>

                        {/* Details Input */}
                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-1">Description / Purpose</label>
                            <input 
                                className="w-full p-3 text-white bg-gray-800 rounded-md border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none placeholder-gray-400" 
                                type="text" 
                                id="details" 
                                name="details" 
                                value={details} 
                                onChange={handleDetails} 
                                placeholder="Dinner, groceries, utilities, etc."
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* 2 & 3. Who Paid & Divided Between (SIDE-BY-SIDE) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* LEFT: Who Paid (Radio Buttons) */}
                    <div className="space-y-4 p-5 bg-white/5 rounded-xl border border-white/10">
                        <h2 className="text-xl font-semibold text-white border-b border-cyan-500/30 pb-2">Who Paid?</h2>
                        <p className="text-sm text-gray-400">Select the contributor.</p>
                        
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-2"> {/* Added scroll for compact view */}
                            {data.map((user) => (
                                <UserSelectionItem
                                    key={`paid-${user.username}`}
                                    user={user}
                                    type="radio"
                                    selectedValue={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    currentUsername={currentUsername}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Divided Between (Checkboxes) */}
                    <div className="space-y-4 p-5 bg-white/5 rounded-xl border border-white/10">
                        <h2 className="text-xl font-semibold text-white border-b border-cyan-500/30 pb-2">Split Equally Among</h2>
                        <p className="text-sm text-gray-400">Select all users who share the expense.</p>
                        
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-2"> {/* Added scroll for compact view */}
                            {data.map((user) => (
                                <UserSelectionItem
                                    key={`divided-${user.username}`}
                                    user={user}
                                    type="checkbox"
                                    selectedValue={selectedUsers}
                                    onChange={handleCheckboxChange}
                                    currentUsername={currentUsername}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* 4. Submission & Error */}
                {submitError && (
                    <p className="text-sm text-red-400 text-center font-bold">
                        {submitError}
                    </p>
                )}

                <button
                    type="submit"
                    className="
                        w-full bg-cyan-500 text-gray-900 font-bold 
                        py-3 rounded-lg shadow-lg shadow-cyan-500/50 
                        hover:bg-cyan-400 transition duration-200 text-base 
                        uppercase tracking-widest disabled:bg-gray-700 disabled:text-gray-400
                    "
                >
                    RECORD EXPENSE
                </button>
            </form>
        </div>
    );
}