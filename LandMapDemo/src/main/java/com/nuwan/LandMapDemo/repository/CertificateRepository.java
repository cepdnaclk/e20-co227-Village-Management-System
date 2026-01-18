package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Certificate;
import com.nuwan.LandMapDemo.domain.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByPerson(Person person);
    List<Certificate> findByPersonId(String personId);
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    
    @Query("SELECT c FROM Certificate c WHERE c.issuedDate BETWEEN :startDate AND :endDate")
    List<Certificate> findByIssuedDateBetween(@Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    List<Certificate> findByCertificateType(Certificate.CertificateType certificateType);
    List<Certificate> findByIsActive(boolean isActive);
}

