import { createContext, useContext } from "react";

export const OrderContext = createContext(null)

export const useOrder = () => useContext(OrderContext)