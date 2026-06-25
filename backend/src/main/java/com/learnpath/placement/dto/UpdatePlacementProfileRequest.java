package com.learnpath.placement.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record UpdatePlacementProfileRequest(
        @DecimalMin(value = "0.00", message = "CGPA must be at least 0.00")
        @DecimalMax(value = "10.00", message = "CGPA must be at most 10.00")
        @Digits(integer = 2, fraction = 2, message = "CGPA format must be up to 4 digits with 2 decimals")
        BigDecimal currentCgpa,

        @DecimalMin(value = "0.00", message = "Target package must be at least 0.00")
        @Digits(integer = 4, fraction = 2, message = "Target package format must be up to 6 digits with 2 decimals")
        BigDecimal targetPackageLpa,

        @Size(max = 200, message = "Preferred location cannot exceed 200 characters")
        String preferredLocation
) {}
