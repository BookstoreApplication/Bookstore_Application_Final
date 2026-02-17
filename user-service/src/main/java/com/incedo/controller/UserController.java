package com.incedo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.incedo.DTO.LoginRequestDTO;
import com.incedo.DTO.RegisterRequestDTO;
import com.incedo.entity.User;
import com.incedo.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	// Register user
	@PostMapping("/auth/register")
	public User registerUser(@RequestBody RegisterRequestDTO request) {
		return userService.register(request);
	}

	// Login User
	@PostMapping("/auth/login")
	public String loginUser(@RequestBody LoginRequestDTO request) {
		String token = userService.login(request);

		if (token == null) {
			return "Invalid credentials";
		}

		return token;
	}

	// Fetch by email
	@GetMapping("/fetch/{email}")
	public User getUserByEmail(@PathVariable String email) {
		return userService.getUserByEmail(email);
	}

	// Get users
	@GetMapping("/user-only")
	public List<User> getAllUsers() {
		return userService.getAllUsers();
	}
}
