package com.nuwan.LandMapDemo.service.impl;

import com.itextpdf.html2pdf.HtmlConverter;
import com.nuwan.LandMapDemo.domain.Certificate;
import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.Request;
import com.nuwan.LandMapDemo.dto.CertificateDTO;
import com.nuwan.LandMapDemo.dto.CertificateGenerationRequestDTO;
import com.nuwan.LandMapDemo.repository.CertificateRepository;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.repository.RequestRepository;
import com.nuwan.LandMapDemo.service.CertificateService;
import com.nuwan.LandMapDemo.utils.CertificateUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final PersonRepository personRepository;
    private final RequestRepository requestRepository;
    private static final String CERTIFICATE_DIR = "certificates/";

    @Override
    @Transactional
    public CertificateDTO generateCertificate(CertificateGenerationRequestDTO requestDTO) {
        try {
            Optional<Person> personOpt = personRepository.findById(requestDTO.getPersonId());
            Optional<Person> issuedByOpt = personRepository.findById(requestDTO.getIssuedById());
            
            if (personOpt.isEmpty() || issuedByOpt.isEmpty()) {
                return null;
            }
            
            Certificate certificate = new Certificate();
            certificate.setPerson(personOpt.get());
            certificate.setIssuedBy(issuedByOpt.get());
            certificate.setCertificateType(requestDTO.getCertificateType());
            certificate.setPurpose(requestDTO.getPurpose());
            certificate.setAdditionalDetails(requestDTO.getAdditionalDetails());
            certificate.setCertificateNumber(generateCertificateNumber());
            certificate.setIssuedDate(LocalDateTime.now());
            
            if (requestDTO.getRequestId() != null) {
                Optional<Request> requestOpt = requestRepository.findById(requestDTO.getRequestId());
                requestOpt.ifPresent(certificate::setRequest);
            }
            
            Certificate saved = certificateRepository.save(certificate);
            
            // Generate PDF
            byte[] pdfBytes = generateCertificatePdf(saved.getId());
            String pdfPath = saveCertificatePdf(saved.getId(), pdfBytes);
            saved.setGeneratedPdfPath(pdfPath);
            saved = certificateRepository.save(saved);
            
            return CertificateUtils.toDTO(saved);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    @Override
    public CertificateDTO getCertificateById(Long id) {
        return certificateRepository.findById(id)
                .map(CertificateUtils::toDTO)
                .orElse(null);
    }

    @Override
    public List<CertificateDTO> getCertificatesByPersonId(String personId) {
        return certificateRepository.findByPersonId(personId)
                .stream()
                .map(CertificateUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CertificateDTO> getAllCertificates() {
        return certificateRepository.findAll()
                .stream()
                .map(CertificateUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public byte[] generateCertificatePdf(Long certificateId) {
        try {
            Optional<Certificate> certOpt = certificateRepository.findById(certificateId);
            if (certOpt.isEmpty()) {
                return null;
            }
            
            Certificate cert = certOpt.get();
            String htmlContent = generateCertificateHtml(cert);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            HtmlConverter.convertToPdf(htmlContent, outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            System.out.println("Error generating PDF: " + e);
            return null;
        }
    }

    @Override
    public String generateCertificateNumber() {
        String prefix = "CERT-";
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uniqueId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return prefix + timestamp + "-" + uniqueId;
    }

    @Override
    @Transactional
    public boolean deleteCertificate(Long id) {
        try {
            certificateRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    private String generateCertificateHtml(Certificate cert) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'>");
        html.append("<style>body{font-family:Arial;padding:40px;line-height:1.6;}");
        html.append(".header{text-align:center;margin-bottom:30px;}");
        html.append(".content{margin:20px 0;}");
        html.append(".footer{margin-top:40px;text-align:right;}</style></head><body>");
        
        html.append("<div class='header'>");
        html.append("<h1>Certificate of ").append(cert.getCertificateType().toString().replace("_", " ")).append("</h1>");
        html.append("<p>Certificate Number: ").append(cert.getCertificateNumber()).append("</p>");
        html.append("</div>");
        
        html.append("<div class='content'>");
        html.append("<p>This is to certify that <strong>").append(cert.getPerson().getName()).append("</strong>");
        html.append(" (NIC: ").append(cert.getPerson().getId()).append(")");
        html.append(" is a resident of this area.</p>");
        
        if (cert.getPurpose() != null && !cert.getPurpose().isEmpty()) {
            html.append("<p><strong>Purpose:</strong> ").append(cert.getPurpose()).append("</p>");
        }
        
        if (cert.getAdditionalDetails() != null && !cert.getAdditionalDetails().isEmpty()) {
            html.append("<p><strong>Additional Details:</strong> ").append(cert.getAdditionalDetails()).append("</p>");
        }
        
        html.append("</div>");
        
        html.append("<div class='footer'>");
        html.append("<p>Issued on: ").append(cert.getIssuedDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))).append("</p>");
        if (cert.getIssuedBy() != null) {
            html.append("<p>Issued by: ").append(cert.getIssuedBy().getName()).append("</p>");
            html.append("<p>Grama Niladhari</p>");
        }
        html.append("</div>");
        
        html.append("</body></html>");
        return html.toString();
    }

    private String saveCertificatePdf(Long certificateId, byte[] pdfBytes) {
        try {
            File dir = new File(CERTIFICATE_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            String fileName = "certificate_" + certificateId + ".pdf";
            File file = new File(dir, fileName);
            
            try (FileOutputStream fos = new FileOutputStream(file)) {
                fos.write(pdfBytes);
            }
            
            return file.getAbsolutePath();
        } catch (IOException e) {
            System.out.println("Error saving PDF: " + e);
            return null;
        }
    }
}

