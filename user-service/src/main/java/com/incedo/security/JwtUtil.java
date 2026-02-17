package com.incedo.security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private static final String SECRET_KEY = "MySuperSecureKeyThatIsAtLeast32CharsLong";

	// Token validity: 1 hour
	private static final long JWT_EXPIRATION = 1000 * 60 * 60;

	private Key getSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(java.util.Base64.getEncoder().encodeToString(SECRET_KEY.getBytes()));
		return Keys.hmacShaKeyFor(keyBytes);
	}

	// 🔹 Generate Token
	public String generateToken(String email, String role) {

		return Jwts.builder().setSubject(email).claim("role", role).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
				.signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
	}

	// 🔹 Extract Email
	public String extractEmail(String token) {
		return extractAllClaims(token).getSubject();
	}

	// 🔹 Extract Role
	public String extractRole(String token) {
		return extractAllClaims(token).get("role", String.class);
	}

	// 🔹 Validate Token
	public boolean validateToken(String token) {
		try {
			extractAllClaims(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	// 🔹 Extract Claims
	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
	}
}
