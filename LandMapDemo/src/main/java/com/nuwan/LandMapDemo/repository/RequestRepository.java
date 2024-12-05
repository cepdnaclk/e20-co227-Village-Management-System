package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Request;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, Long> {
}
