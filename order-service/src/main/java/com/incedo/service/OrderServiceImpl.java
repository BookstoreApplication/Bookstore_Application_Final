package com.incedo.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.incedo.dto.BookResponseDTO;
import com.incedo.dto.OrderDTO;
import com.incedo.dto.PaymentRequestDTO;
import com.incedo.dto.PaymentResponseDTO;
import com.incedo.entity.Order;
import com.incedo.entity.OrderItem;
import com.incedo.exception.InsufficientStockException;
import com.incedo.repository.OrderRepository;

import jakarta.transaction.Transactional;

@Service
public class OrderServiceImpl implements OrderService {

	private final OrderRepository orderRepository;

	private BookClient bookClient;
	private PaymentClient paymentClient;

	private ModelMapper modelMapper;

	public OrderServiceImpl(OrderRepository orderRepository, BookClient bookClient, ModelMapper modelMapper, PaymentClient paymentClient) {
		this.orderRepository = orderRepository;
		this.bookClient = bookClient;
		this.modelMapper = modelMapper;
		this.paymentClient = paymentClient;
	}

	@Override
	@Transactional
	public OrderDTO placeOrder(OrderDTO request) {
		Order order = new Order();
		order.setUserId(request.getUserId());
		order.setPaymentId(request.getPaymentId());

		BigDecimal totalOrderPrice = BigDecimal.ZERO;

		for (OrderItem itemDTO : request.getOrderItems()) {
			// 1. Fetch real book data from Book Service
			BookResponseDTO book = bookClient.getBookById(itemDTO.getBookId());

			// IMPROVEMENT: Stock Validation
			if (book.getStockQuantity() < itemDTO.getQuantity()) {
				throw new InsufficientStockException("Book: " + book.getTitle() + " is out of stock!");
			}

			bookClient.reduceStock(itemDTO.getBookId(), itemDTO.getQuantity());

			// 2. Create OrderItem with current book price
			OrderItem item = new OrderItem();
			item.setBookId(book.getId());
			item.setQuantity(itemDTO.getQuantity());
			item.setPrice(book.getPrice()); // Storing price as it is NOW

			// 3. Calculate: Price * Quantity
			BigDecimal itemTotal = book.getPrice().multiply(new BigDecimal(itemDTO.getQuantity()));
			totalOrderPrice = totalOrderPrice.add(itemTotal);

			order.addOrderItem(item);
		}

		order.setTotalPrice(totalOrderPrice); // Stored in 'orders' table
		Order savedOrder = orderRepository.save(order);
		
		// 2. Prepare Payment Request
	    PaymentRequestDTO paymentRequest = new PaymentRequestDTO();
	    paymentRequest.setOrderId(savedOrder.getId());
	    paymentRequest.setAmount(savedOrder.getTotalPrice());
	    
	    
	    try {
			// 3. Call Payment Service
	        PaymentResponseDTO paymentResponse = paymentClient.initiatePayment(paymentRequest);
	        
	        // 4. Update Order with Payment Info
	        savedOrder.setPaymentId(paymentResponse.getId());
	        
	        return modelMapper.map(orderRepository.save(savedOrder), OrderDTO.class);
	        
	    } catch (Exception e) {
	        // Handle payment service failure (e.g., mark order as PAYMENT_FAILED)
//	        savedOrder.setStatus("PAYMENT_FAILED");
//	        orderRepository.save(savedOrder);
	        throw new RuntimeException("Payment Service is currently unavailable.");
	    }
	}

	@Override
	public List<OrderDTO> getAllOrders() {
		return orderRepository.findAll().stream().map(order -> new OrderDTO(order.getId(), order.getUserId(),
				order.getOrderItems(), order.getPaymentId(), order.getTotalPrice())).collect(Collectors.toList());
	}

	@Override
	public OrderDTO getOrderById(Long id) {
		Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));

		return new OrderDTO(order.getId(), order.getUserId(), order.getOrderItems(), order.getPaymentId(),
				order.getTotalPrice());
	}

	@Override
	public void deleteOrder(Long id) {
		orderRepository.deleteById(id);
	}
}
