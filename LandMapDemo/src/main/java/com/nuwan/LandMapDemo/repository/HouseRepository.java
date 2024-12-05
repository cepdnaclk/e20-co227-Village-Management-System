package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.House;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HouseRepository extends JpaRepository<House, String > {

    List<House> findAllByLandId(Long id);

}
