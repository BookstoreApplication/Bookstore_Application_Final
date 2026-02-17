package com.incedo.service;

import java.util.List;

import com.incedo.dto.OrderDTO;

public interface OrderService {

	OrderDTO placeOrder(OrderDTO dto);

	List<OrderDTO> getAllOrders();

	OrderDTO getOrderById(Long id);

	void deleteOrder(Long id);

}
