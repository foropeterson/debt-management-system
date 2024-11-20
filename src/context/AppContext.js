import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    const savedDebts = JSON.parse(localStorage.getItem("debts")) || [];
    setCustomers(savedCustomers);
    setDebts(savedDebts);
  }, []);

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [customers, debts]);

  const addCustomer = (customer) => setCustomers([...customers, customer]);
  const addDebt = (debt) => setDebts([...debts, debt]);

  return (
    <AppContext.Provider value={{ customers, debts, addCustomer, addDebt }}>
      {children}
    </AppContext.Provider>
  );
};
