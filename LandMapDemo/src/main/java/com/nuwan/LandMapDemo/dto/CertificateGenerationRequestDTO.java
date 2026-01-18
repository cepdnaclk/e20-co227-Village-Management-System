package com.nuwan.LandMapDemo.dto;

import com.nuwan.LandMapDemo.domain.Certificate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CertificateGenerationRequestDTO {
    private String personId;
    private Long requestId;
    private Certificate.CertificateType certificateType;
    private String purpose;
    private String additionalDetails;
    private String issuedById; // Grama Niladhari ID
}

