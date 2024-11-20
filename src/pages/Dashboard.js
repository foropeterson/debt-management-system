import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const getInitialCustomers = () => {
    const savedCustomers = localStorage.getItem("customers");
    return savedCustomers ? JSON.parse(savedCustomers) : [];
  };

  const [customers, setCustomers] = useState(getInitialCustomers);
  const [newCustomer, setNewCustomer] = useState({ name: "", comment: "" });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newDebt, setNewDebt] = useState({ debtAmount: "", paidAmount: "" });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0);

  const saveCustomersToLocalStorage = (updatedCustomers) => {
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name.trim()) {
      alert("Customer name is required.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      name: newCustomer.name.trim(),
      comment: newCustomer.comment.trim(),
      debtAmount: 0,
      paidAmount: 0,
      isPaid: true,
    };

    const updatedCustomers = [...customers, newEntry];
    setCustomers(updatedCustomers);
    saveCustomersToLocalStorage(updatedCustomers);
    setNewCustomer({ name: "", comment: "" });
  };

  const handleAddDebt = (e) => {
    e.preventDefault();
    const debtAmount = parseFloat(newDebt.debtAmount) || 0;
    const paidAmount = parseFloat(newDebt.paidAmount) || 0;

    if (debtAmount <= 0 || paidAmount < 0) {
      alert("Please enter valid amounts.");
      return;
    }

    if (paidAmount > debtAmount) {
      alert("Paid amount cannot exceed the debt amount.");
      return;
    }

    const updatedCustomers = customers.map((customer) =>
      customer.id === selectedCustomer.id
        ? {
            ...customer,
            debtAmount: customer.debtAmount + debtAmount,
            paidAmount: customer.paidAmount + paidAmount,
            isPaid:
              customer.paidAmount + paidAmount >=
              customer.debtAmount + debtAmount,
          }
        : customer
    );

    setCustomers(updatedCustomers);
    saveCustomersToLocalStorage(updatedCustomers);
    setSelectedCustomer(null);
    setNewDebt({ debtAmount: "", paidAmount: "" });
  };

  const handleDeleteCustomer = (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmation) return;

    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
    saveCustomersToLocalStorage(updatedCustomers);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Customer Dashboard</h1>

      {/* Stats Section */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Total Customers</h2>
          <p>{customers.length}</p>
        </div>
        <div className="stat-card">
          <h2>Total Debts</h2>
          <p>
            {formatCurrency(
              customers.reduce((acc, customer) => acc + customer.debtAmount, 0)
            )}
          </p>
        </div>
        <div className="stat-card">
          <h2>Total Paid</h2>
          <p>
            {formatCurrency(
              customers.reduce((acc, customer) => acc + customer.paidAmount, 0)
            )}
          </p>
        </div>
      </div>

      {/* Add Customer Form */}
      <div className="form-section">
        <h2>Add New Customer</h2>
        <form onSubmit={handleAddCustomer} className="form">
          <label htmlFor="customer-name">Customer Name</label>
          <input
            id="customer-name"
            type="text"
            placeholder="Enter customer name"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            required
          />
          <label htmlFor="customer-comment">Comment</label>
          <textarea
            id="customer-comment"
            placeholder="Enter a comment (optional)"
            value={newCustomer.comment}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, comment: e.target.value })
            }
          ></textarea>
          <button className="btn-primary" type="submit">
            Add Customer
          </button>
        </form>
      </div>

      {/* Add Debt Form */}
      {selectedCustomer && (
        <div className="form-section">
          <h2>Add Debt for {selectedCustomer.name}</h2>
          <form onSubmit={handleAddDebt} className="form">
            <label htmlFor="debt-amount">Debt Amount</label>
            <input
              id="debt-amount"
              type="number"
              placeholder="Enter debt amount"
              value={newDebt.debtAmount}
              onChange={(e) =>
                setNewDebt({ ...newDebt, debtAmount: e.target.value })
              }
              required
            />
            <label htmlFor="paid-amount">Paid Amount</label>
            <input
              id="paid-amount"
              type="number"
              placeholder="Enter paid amount"
              value={newDebt.paidAmount}
              onChange={(e) =>
                setNewDebt({ ...newDebt, paidAmount: e.target.value })
              }
              required
            />
            <button className="btn-primary" type="submit">
              Add Debt
            </button>
          </form>
        </div>
      )}

      {/* Customer List */}
      <div className="customer-list">
        <h2>Customer List</h2>
        {customers.length === 0 ? (
          <p>No customers added yet. Use the form above to get started.</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <h3>{customer.name}</h3>
              <p>Total Debt: {formatCurrency(customer.debtAmount)}</p>
              <p>Paid Amount: {formatCurrency(customer.paidAmount)}</p>
              <p>
                <strong>Comment:</strong> {customer.comment || "No comment"}
              </p>
              <button
                className="btn-secondary"
                onClick={() => setSelectedCustomer(customer)}
              >
                Add Debt
              </button>
              <button
                className="btn-warning"
                onClick={() => handleDeleteCustomer(customer.id)}
              >
                Delete Customer
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          2024 @ Foro Peterson. All rights reserved. This system belongs to Foro
          Peterson.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
