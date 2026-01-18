package com.nuwan.LandMapDemo.dto;

import com.nuwan.LandMapDemo.domain.Certificate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CertificateDTO {
    private Long id;
    private String personId;
    private String personName;
    private Long requestId;
    private Certificate.CertificateType certificateType;
    private String certificateNumber;
    private String purpose;
    private String additionalDetails;
    private String generatedPdfPath;
    private LocalDateTime issuedDate;
    private String issuedById;
    private String issuedByName;
    private boolean isActive;
}

