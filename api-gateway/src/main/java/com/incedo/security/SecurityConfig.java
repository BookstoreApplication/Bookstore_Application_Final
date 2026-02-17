package com.incedo.security;

import java.util.Collection;
import java.util.stream.Collectors;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;

import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.secret-key}")
    private String secretKey;

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                // 1. PUBLIC: Anyone can login
                .pathMatchers("/api/users/auth/**","/api/users/fetch/**").permitAll()
                
                // 2. PROTECTED: Simple role-based rules
                .pathMatchers("/api/books/admin-only/**", "/api/orders/admin-only/**", "/api/payment/admin-only/**", "/api/users/admin-only/**").hasRole("ADMIN")
                .pathMatchers("/api/books/user-only/**", "/api/orders/user-only/**", "/api/payment/user-only/**", "/api/users/user-only/**").hasAnyRole("USER", "ADMIN")
                
                // 3. SECURED: Everything else needs a valid token
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth -> oauth
                .jwt(jwt -> jwt.jwtAuthenticationConverter(simpleRoleConverter()))
            )
            .build();
    }

    // This converts your JWT "roles" claim into Spring Security "ROLE_ADMIN"
    private Converter<Jwt, Mono<AbstractAuthenticationToken>> simpleRoleConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<String> roles = jwt.getClaimAsStringList("role"); 
            return roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList());
        });
        return new ReactiveJwtAuthenticationConverterAdapter(converter);
    }

    // Required to decode your JWT using the secret key
    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        SecretKeySpec spec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
        return NimbusReactiveJwtDecoder.withSecretKey(spec).build();
    }
}
