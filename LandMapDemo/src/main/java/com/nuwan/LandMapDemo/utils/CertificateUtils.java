package com.nuwan.LandMapDemo.utils;

import com.nuwan.LandMapDemo.domain.Certificate;
import com.nuwan.LandMapDemo.dto.CertificateDTO;

public class CertificateUtils {
    public static CertificateDTO toDTO(Certificate certificate) {
        if (certificate == null) return null;
        
        CertificateDTO dto = new CertificateDTO();
        dto.setId(certificate.getId());
        dto.setPersonId(certificate.getPerson().getId());
        dto.setPersonName(certificate.getPerson().getName());
        if (certificate.getRequest() != null) {
            dto.setRequestId(certificate.getRequest().getId());
        }
        dto.setCertificateType(certificate.getCertificateType());
        dto.setCertificateNumber(certificate.getCertificateNumber());
        dto.setPurpose(certificate.getPurpose());
        dto.setAdditionalDetails(certificate.getAdditionalDetails());
        dto.setGeneratedPdfPath(certificate.getGeneratedPdfPath());
        dto.setIssuedDate(certificate.getIssuedDate());
        if (certificate.getIssuedBy() != null) {
            dto.setIssuedById(certificate.getIssuedBy().getId());
            dto.setIssuedByName(certificate.getIssuedBy().getName());
        }
        dto.setActive(certificate.isActive());
        return dto;
    }
}

