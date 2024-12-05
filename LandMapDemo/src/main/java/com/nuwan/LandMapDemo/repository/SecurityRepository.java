package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.Security;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SecurityRepository extends JpaRepository<Security, Long> {

    Optional<Security> findByPersonId(String personId);

}
