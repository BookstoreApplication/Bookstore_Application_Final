import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const OrderContext = createContext(undefined);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  const createOrder = useCallback(async (orderPayload) => {
    try {
      const response = await axios.post("/api/orders/user-only", orderPayload);
      const newOrder = response.data;
      setOrders((prev) => [newOrder, ...prev]);
      setCurrentOrder(newOrder);
      return newOrder;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  }, []);

  const processPayment = useCallback(async (paymentPayload) => {
    try {
      const response = await axios.post("/api/payment/user-only", paymentPayload);
      return response.data;
    } catch (error) {
      console.error("Payment failed:", error);
      throw error;
    }
  }, []);

  const updatePayment = useCallback(async (paymentId, updatePayload) => {
    try {
      const response = await axios.patch(`/api/payment/user-only/${paymentId}`, updatePayload);
      return response.data;
    } catch (error) {
      console.error("Update Payment failed:", error);
      throw error;
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("/api/orders/user-only");
      setOrders(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      throw error;
    }
  }, []);

  return (
    <OrderContext.Provider value={{ orders, currentOrder, createOrder, processPayment, updatePayment, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
