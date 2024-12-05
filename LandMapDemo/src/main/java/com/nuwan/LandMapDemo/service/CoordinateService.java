package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.domain.Coordinate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoordinateService extends JpaRepository<Coordinate, Long> {
}
