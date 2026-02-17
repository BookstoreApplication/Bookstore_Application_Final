package com.incedo.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.incedo.dto.PaymentRequestDTO;
import com.incedo.dto.PaymentResponseDTO;

@FeignClient(name = "payment-service")
public interface PaymentClient {

    @PostMapping("/api/payment/user-only")
    PaymentResponseDTO initiatePayment(@RequestBody PaymentRequestDTO request);
}