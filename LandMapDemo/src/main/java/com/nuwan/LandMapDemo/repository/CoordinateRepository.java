package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Coordinate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoordinateRepository extends JpaRepository<Coordinate, Long> {

    void deleteByLandId(Long id);

}
