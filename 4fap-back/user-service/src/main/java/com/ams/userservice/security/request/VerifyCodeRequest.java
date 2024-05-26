package com.ams.userservice.security.request;


import lombok.Data;

@Data
public class VerifyCodeRequest {
    private String email;
    private String code;
}