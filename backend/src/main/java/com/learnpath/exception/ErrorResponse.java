package com.learnpath.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        boolean success,
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        String errorCode,
        Map<String, String> errors
) {}
