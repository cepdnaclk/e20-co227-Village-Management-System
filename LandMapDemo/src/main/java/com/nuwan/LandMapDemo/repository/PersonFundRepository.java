package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.PersonFund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonFundRepository extends JpaRepository<PersonFund, Long> {
}
