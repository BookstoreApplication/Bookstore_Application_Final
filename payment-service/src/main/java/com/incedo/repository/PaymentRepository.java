package com.incedo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.incedo.entity.Payment;
import com.incedo.entity.PaymentStatus;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

	public List<Payment> findByOrderId(Long orderId);

	// Returns true if there is ANY record for this orderId where status is NOT
	// FAILED
	boolean existsByOrderIdAndStatusNot(Long orderId, PaymentStatus status);

	List<Payment> findByStatus(PaymentStatus status);

	Payment findByTransactionId(String transactionId);
}
