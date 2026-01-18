package com.nuwan.LandMapDemo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = true)
    private Request request;

    @Enumerated(EnumType.STRING)
    private CertificateType certificateType;

    public enum CertificateType {
        CHARACTER_CERTIFICATE,
        RESIDENCE_CERTIFICATE,
        INCOME_CERTIFICATE,
        FAMILY_CERTIFICATE,
        BIRTH_CERTIFICATE,
        DEATH_CERTIFICATE,
        MARRIAGE_CERTIFICATE,
        OTHER
    }

    private String certificateNumber;

    private String purpose;

    private String additionalDetails;

    private String generatedPdfPath;

    @Column(nullable = false, updatable = false)
    private LocalDateTime issuedDate = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "issued_by_person_id")
    private Person issuedBy; // Grama Niladhari who issued the certificate

    private boolean isActive = true;
}

