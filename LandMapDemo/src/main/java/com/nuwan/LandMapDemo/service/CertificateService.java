package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.dto.CertificateDTO;
import com.nuwan.LandMapDemo.dto.CertificateGenerationRequestDTO;

import java.util.List;

public interface CertificateService {
    CertificateDTO generateCertificate(CertificateGenerationRequestDTO requestDTO);
    CertificateDTO getCertificateById(Long id);
    List<CertificateDTO> getCertificatesByPersonId(String personId);
    List<CertificateDTO> getAllCertificates();
    byte[] generateCertificatePdf(Long certificateId);
    String generateCertificateNumber();
    boolean deleteCertificate(Long id);
}

