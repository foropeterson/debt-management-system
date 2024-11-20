import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const { customers, debts } = useContext(AppContext);

  const totalDebt = debts.reduce(
    (sum, debt) => sum + parseFloat(debt.amount),
    0
  );

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Customers: {customers.length}</p>
      <p>Total Debt: ${totalDebt.toFixed(2)}</p>
    </div>
  );
};

export default Dashboard;
