package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.domain.Coordinate;
import com.nuwan.LandMapDemo.domain.Land;

import java.util.List;

import com.nuwan.LandMapDemo.dto.LandDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LandService {
    boolean createLand(LandDTO land);
    List<Land> getLands();
    LandDTO getLandById(Long id);
    List<Land> findLandAboveSize(double size);
    List<LandDTO> getLandsWithinPolygon(List<Coordinate> coordinates);
    Page<LandDTO> getLands(int page, int size, String orderBy, String order, String searchTerm);
    LandDTO getLandByCoordinate(Coordinate coordinate);
    boolean deleteLandById(Long id);
    boolean deleteLandsByOwnerId(String id);
    LandDTO updateLandById(Long id, LandDTO landDTO);
}
