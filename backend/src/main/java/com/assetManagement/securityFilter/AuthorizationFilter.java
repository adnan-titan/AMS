package com.assetManagement.securityFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;


@EqualsAndHashCode(callSuper = true)
@Slf4j

@Data
public class AuthorizationFilter extends OncePerRequestFilter{

    private AuthenticationManager authenticationManager;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,  FilterChain filterChain) throws ServletException, IOException {

        log.info("in authorization filter");

        if (request.getServletPath().equals("/user/signUp") || request.getServletPath().equals("/user/checkUser")
                || request.getServletPath().equals("user/signIn") || request.getServletPath().equals("/refresh/token")) {
            log.info("in the authorization");
            filterChain.doFilter(request, response);
        }
        else {
            String authorizationHeader = request.getHeader(AUTHORIZATION);
            log.info("authorization "+authorizationHeader);
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer")) {
                try {
                    String token = authorizationHeader.substring("Bearer ".length());
                    Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
                    JWTVerifier verifier = JWT.require(algorithm).build();
                    DecodedJWT decodedJWT = verifier.verify(token);
                    String username = decodedJWT.getSubject();
                    String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
                  Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    Arrays.stream(roles).forEach(role -> {
                        authorities.add(new SimpleGrantedAuthority(role));
                    });
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                    filterChain.doFilter(request, response);

                } catch (Exception exception) {
                    log.error("Error in :{}", exception.getMessage());
                    response.setHeader("error", exception.getMessage());
                    response.setStatus(FORBIDDEN.value());
                    //response.sendError(FORBIDDEN.value());
                    HashMap<String, String> error = new HashMap<>();
                    response.setContentType(APPLICATION_JSON_VALUE);
                    error.put("error_message", exception.getMessage());
                    new ObjectMapper().writeValue(response.getOutputStream(), error);
                }
            }
            /*else {
                log.error("Error in :{}", "unauthorized");
                response.setHeader("error","unauthorized" );
                response.setStatus(FORBIDDEN.value());
                //response.sendError(FORBIDDEN.value());
                HashMap<String, String> error = new HashMap<>();
                response.setContentType(APPLICATION_JSON_VALUE);
                error.put("error_message", "unauthorized");
                new ObjectMapper().writeValue(response.getOutputStream(), error);
                filterChain.doFilter(request,response);


            }*/
        }
    }

}
