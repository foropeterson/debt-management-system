import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  // Helper function to get initial customers data from localStorage
  const getInitialCustomers = () => {
    const savedCustomers = localStorage.getItem("customers");
    return savedCustomers ? JSON.parse(savedCustomers) : [];
  };

  // State variables
  const [customers, setCustomers] = useState(getInitialCustomers());
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    invoiceNo: "",
    mobileNo: "",
    shopName: "",
    salesRep: "",
  });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newDebt, setNewDebt] = useState({
    description: "",
    amount: 0,
    paidAmount: 0,
    date: new Date().toISOString().split("T")[0], // Default to current date
  });
  const [installmentAmount, setInstallmentAmount] = useState(0); // New state for installment input
  const [error, setError] = useState(""); // Error state for validation messages

  // Format currency in KES
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0);

  // Save customers to localStorage
  const saveCustomersToLocalStorage = (updatedCustomers) => {
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
  };

  // Handle adding a new customer
  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name.trim()) {
      setError("Customer name is required.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      name: newCustomer.name.trim(),
      debts: [],
      ...newCustomer,
    };

    const updatedCustomers = [...customers, newEntry];
    setCustomers(updatedCustomers);
    saveCustomersToLocalStorage(updatedCustomers);
    setNewCustomer({
      name: "",
      invoiceNo: "",
      mobileNo: "",
      shopName: "",
      salesRep: "",
    });
    setError(""); // Clear any previous error messages
  };

  // Handle updating an existing customer
  const handleUpdateCustomer = (e) => {
    e.preventDefault();
    if (!editingCustomer) return;

    const updatedCustomers = customers.map((customer) =>
      customer.id === editingCustomer.id
        ? { ...editingCustomer, ...newCustomer }
        : customer
    );

    setCustomers(updatedCustomers);
    saveCustomersToLocalStorage(updatedCustomers);
    setEditingCustomer(null);
    setNewCustomer({
      name: "",
      invoiceNo: "",
      mobileNo: "",
      shopName: "",
      salesRep: "",
    });
    setError(""); // Clear any previous error messages
  };

  // Handle deleting a customer
  const handleDeleteCustomer = (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmation) return;

    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
    saveCustomersToLocalStorage(updatedCustomers);
    setSelectedCustomer(null); // Reset selected customer after deletion
  };

  // Handle adding a new debt
  const handleAddDebt = (e) => {
    e.preventDefault();
    if (
      !selectedCustomer ||
      !newDebt.description.trim() ||
      newDebt.amount <= 0
    ) {
      setError("Please provide valid debt details.");
      return;
    }

    const updatedCustomers = customers.map((customer) =>
      customer.id === selectedCustomer.id
        ? {
            ...customer,
            debts: [
              ...customer.debts,
              {
                id: Date.now(),
                description: newDebt.description.trim(),
                amount: parseFloat(newDebt.amount),
                paidAmount: parseFloat(newDebt.paidAmount),
                date: newDebt.date,
                installments: [], // Initialize empty installment array
                balance:
                  parseFloat(newDebt.amount) - parseFloat(newDebt.paidAmount), // Calculating balance
                status: "Unpaid",
              },
            ],
          }
        : customer
    );

    setCustomers(updatedCustomers);
    saveCustomersToLocalStorage(updatedCustomers);
    setNewDebt({
      description: "",
      amount: 0,
      paidAmount: 0,
      date: new Date().toISOString().split("T")[0],
    });
    setError(""); // Clear any previous error messages
  };

  // Handle marking debt as paid (with installments)
  const handleMarkAsPaid = (customerId, debtId) => {
    if (installmentAmount <= 0) {
      setError("Please enter a valid installment amount.");
      return;
    }

    const updatedCustomers = customers.map((customer) =>
      customer.id === customerId
        ? {
            ...customer,
            debts: customer.debts.map((debt) =>
              debt.id === debtId
                ? {
                    ...debt,
                    installments: [
                      ...debt.installments,
                      {
                        amount: installmentAmount,
                        date: new Date().toISOString(),
                      },
                    ],
                    paidAmount: debt.paidAmount + installmentAmount, // Adding installment
                    balance:
                      debt.amount - (debt.paidAmount + installmentAmount), // Recalculating balance
                    status:
                      debt.balance - installmentAmount <= 0 ? "Paid" : "Unpaid", // Update status if balance is 0 or less
                  }
                : debt
            ),
          }
        : customer
    );

    setCustomers(updatedCustomers);
    saveCustomersToLocalStorage(updatedCustomers);
    setInstallmentAmount(0); // Clear installment input after payment
    setError(""); // Clear any previous error messages
  };

  // Handle deleting a debt
  const handleDeleteDebt = (customerId, debtId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this debt?"
    );
    if (!confirmation) return;

    const updatedCustomers = customers.map((customer) =>
      customer.id === customerId
        ? {
            ...customer,
            debts: customer.debts.filter((debt) => debt.id !== debtId),
          }
        : customer
    );

    setCustomers(updatedCustomers);
    saveCustomersToLocalStorage(updatedCustomers);
    setSelectedCustomer(null); // Reset selected customer after debt deletion
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Customer & Debt Dashboard</h1>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Total Customers</h2>
          <p>{customers.length}</p>
        </div>
        <div className="stat-card">
          <h2>Total Debt</h2>
          <p>
            {formatCurrency(
              customers.reduce(
                (total, customer) =>
                  total +
                  customer.debts.reduce(
                    (sum, debt) =>
                      debt.status === "Unpaid" ? sum + debt.amount : sum,
                    0
                  ),
                0
              )
            )}
          </p>
        </div>
      </div>

      {/* Add or Edit Customer */}
      <div className="form-section">
        <h2>{editingCustomer ? "Edit Customer" : "Add New Customer"}</h2>
        <form
          onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
        >
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Invoice No"
            value={newCustomer.invoiceNo}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, invoiceNo: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Mobile No"
            value={newCustomer.mobileNo}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, mobileNo: e.target.value })
            }
          />
          <button type="submit">
            {editingCustomer ? "Update Customer" : "Add Customer"}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Customer List */}
      <div className="customer-list">
        <h2>Customer List</h2>
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <h3>{customer.name}</h3>
              <button onClick={() => setSelectedCustomer(customer)}>
                View Details
              </button>
              <button
                onClick={() => {
                  setEditingCustomer(customer);
                  setNewCustomer(customer);
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDeleteCustomer(customer.id)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No customers found.</p>
        )}
      </div>

      {/* Debt Management */}
      {selectedCustomer && (
        <div className="debt-section">
          <h2>Manage Debt for {selectedCustomer.name}</h2>

          {/* Add Debt */}
          <form onSubmit={handleAddDebt}>
            <input
              type="text"
              placeholder="Description"
              value={newDebt.description}
              onChange={(e) =>
                setNewDebt({ ...newDebt, description: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Debt Amount"
              value={newDebt.amount}
              onChange={(e) =>
                setNewDebt({ ...newDebt, amount: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Paid Amount"
              value={newDebt.paidAmount}
              onChange={(e) =>
                setNewDebt({ ...newDebt, paidAmount: e.target.value })
              }
            />
            <button type="submit">Add Debt</button>
          </form>

          {/* Installment Payment */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleMarkAsPaid(
                selectedCustomer.id,
                selectedCustomer.debts[0]?.id
              );
            }}
          >
            <input
              type="number"
              value={installmentAmount}
              onChange={(e) => setInstallmentAmount(e.target.value)}
              placeholder="Enter Installment Amount"
              required
            />
            <button type="submit">Mark as Paid</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
