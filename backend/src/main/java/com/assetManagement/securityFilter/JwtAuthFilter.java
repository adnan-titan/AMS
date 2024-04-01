package com.assetManagement.securityFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Objects;
import java.util.logging.Logger;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;


@Component
@Slf4j

public class JwtAuthFilter extends OncePerRequestFilter {
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public JwtAuthFilter(@Lazy UserDetailsService userDetailsService, @Lazy JwtUtil jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader(AUTHORIZATION);

        log.info(String.valueOf(request));
        log.info("Auth Header  :" + authHeader);
        log.info("Path "+request.getServletPath());
        if (authHeader ==null ) {
            log.info("inside null authfilter");

                if (request.getServletPath().equals("/") || request.getServletPath().equals("/user/signUp") || request.getServletPath().equals("/user/checkUser")
                        || request.getServletPath().equals("/user/signIn") || request.getServletPath().equals("/refresh/token")) {
                    log.info("in the authorization");


                }
                else{
                    log.error("Error in :{}", "unauthorized");
                    response.setHeader("error","unauthorized" );
                    response.setStatus(FORBIDDEN.value());
                    //response.sendError(FORBIDDEN.value());
                    HashMap<String, String> error = new HashMap<>();
                    response.setContentType(APPLICATION_JSON_VALUE);
                    error.put("error_message", "unauthorized");
                    new ObjectMapper().writeValue(response.getOutputStream(), error);

                }
            filterChain.doFilter(request, response);

        }

//        else if(!Objects.requireNonNull(authHeader).startsWith("Bearer")){
//            filterChain.doFilter(request,response);
//            return;
//        }
        else {
            try {

                String jwtToken = authHeader.substring(7);
                String username = jwtUtil.extractUsername(jwtToken);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    log.info("username {}", userDetails.getUsername());
                    if (jwtUtil.validateToken(jwtToken, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(userDetails.getUsername(), null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (JwtException jwtException) {
                log.error("Error in JWT validation: {}", jwtException.getMessage());

                response.setHeader("error", "unauthorized");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);

                HashMap<String, String> error = new HashMap<>();
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                error.put("error_message", "unauthorized (token tampering detected)");
                new ObjectMapper().writeValue(response.getOutputStream(), error);
            }

            filterChain.doFilter(request, response);
        }
    }
}
