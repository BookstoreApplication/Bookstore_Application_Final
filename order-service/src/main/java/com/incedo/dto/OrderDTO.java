package com.incedo.dto;

import java.math.BigDecimal;
import java.util.List;

import com.incedo.entity.OrderItem;

public class OrderDTO {

    private Long id;
    private Long userId;
    private List<OrderItem> orderItems;
    private BigDecimal totalPrice;
    private Long paymentId;

    public BigDecimal getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(BigDecimal totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Long getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(Long paymentId) {
		this.paymentId = paymentId;
	}

	public OrderDTO() {
    }

    public OrderDTO(Long id, Long userId, List<OrderItem> orderItems, Long paymentId, BigDecimal totalPrice) {
        this.id = id;
        this.userId = userId;
        this.orderItems = orderItems;
        this.paymentId = paymentId;
        this.totalPrice=totalPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
}
