package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.dto.CertificateDTO;
import com.nuwan.LandMapDemo.dto.CertificateGenerationRequestDTO;
import com.nuwan.LandMapDemo.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/generate")
    public ResponseEntity<CertificateDTO> generateCertificate(@RequestBody CertificateGenerationRequestDTO requestDTO) {
        CertificateDTO certificate = certificateService.generateCertificate(requestDTO);
        if (certificate != null) {
            return new ResponseEntity<>(certificate, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateDTO> getCertificateById(@PathVariable Long id) {
        CertificateDTO certificate = certificateService.getCertificateById(id);
        if (certificate != null) {
            return new ResponseEntity<>(certificate, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<List<CertificateDTO>> getCertificatesByPersonId(@PathVariable String personId) {
        List<CertificateDTO> certificates = certificateService.getCertificatesByPersonId(personId);
        return new ResponseEntity<>(certificates, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<CertificateDTO>> getAllCertificates() {
        List<CertificateDTO> certificates = certificateService.getAllCertificates();
        return new ResponseEntity<>(certificates, HttpStatus.OK);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadCertificatePdf(@PathVariable Long id) {
        byte[] pdfBytes = certificateService.generateCertificatePdf(id);
        if (pdfBytes != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "certificate_" + id + ".pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        if (certificateService.deleteCertificate(id)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

