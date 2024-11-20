import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const Customers = () => {
  const { customers, addCustomer } = useContext(AppContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addCustomer({ id: Date.now(), name, phone });
    setName("");
    setPhone("");
  };

  return (
    <div>
      <h1>Customers</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Add Customer</button>
      </form>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.name} - {customer.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;
