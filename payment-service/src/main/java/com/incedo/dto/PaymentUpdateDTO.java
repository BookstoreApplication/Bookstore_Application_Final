package com.incedo.dto;

import com.incedo.entity.PaymentStatus;

public class PaymentUpdateDTO {
	private PaymentStatus status;
	private String transactionId;

	public PaymentUpdateDTO(PaymentStatus status, String transactionId) {
		super();
		this.status = status;
		this.transactionId = transactionId;
	}

	public PaymentUpdateDTO() {
		super();
	}

	public PaymentStatus getStatus() {
		return status;
	}

	public void setStatus(PaymentStatus status) {
		this.status = status;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

}
