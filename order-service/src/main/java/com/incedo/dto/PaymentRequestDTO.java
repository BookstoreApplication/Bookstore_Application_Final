package com.incedo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.incedo.entity.PaymentStatus;

public class PaymentRequestDTO {
	private Long id;

	// Link to the Order in your Bookstore service
	private Long orderId;

	private BigDecimal amount;

	private String transactionId;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	private PaymentStatus status = PaymentStatus.PENDING;

	// ======================== Constructors ========================
	public PaymentRequestDTO(Long id, Long orderId, BigDecimal amount, String transactionId, LocalDateTime createdAt,
			LocalDateTime updatedAt) {
		super();
		this.id = id;
		this.orderId = orderId;
		this.amount = amount;
		this.transactionId = transactionId;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public PaymentRequestDTO() {
		super();
	}

	// ====================== Getters and Setters =======================
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public PaymentStatus getStatus() {
		return status;
	}

	public void setStatus(PaymentStatus status) {
		this.status = status;
	}

}
