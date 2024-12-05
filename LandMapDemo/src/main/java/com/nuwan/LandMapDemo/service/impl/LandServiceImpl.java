package com.nuwan.LandMapDemo.service.impl;

import com.nuwan.LandMapDemo.domain.Coordinate;
import com.nuwan.LandMapDemo.domain.Land;
import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.dto.LandDTO;
import com.nuwan.LandMapDemo.repository.CoordinateRepository;
import com.nuwan.LandMapDemo.repository.LandRepository;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.service.LandService;
import com.nuwan.LandMapDemo.utils.LandUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class LandServiceImpl implements LandService {

    private final LandRepository landRepository;

    private final CoordinateRepository coordinateRepository;

    private final PersonRepository personRepository;

    @Override
    @Transactional
    public boolean createLand(LandDTO landDTO) {
        try {
            Land land = new Land();
            Person owner = null;
            if (landDTO.getOwner() != null) {
                Optional<Person> person = personRepository.findById(landDTO.getOwner());
                if (person.isPresent()) owner = person.get();
                else return false;
            }

            land.setSize(landDTO.getSize());
            land.setLandType(landDTO.getLandType());
            land.setOwnership(landDTO.getOwnership());
            land.setOwner(owner);
            Land savedLand = landRepository.save(land);
            for (Coordinate coordinate : landDTO.getCoordinates()) {
                coordinate.setLand(savedLand);
                coordinateRepository.save(coordinate);
            }
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }

    }

    @Override
    public List<Land> getLands() {
        return landRepository.findAll();
    }

    @Override
    public LandDTO getLandById(Long id) {
        return landRepository.findById(id).map(LandUtils::toDTO).orElse(null);
    }

    @Override
    public List<Land> findLandAboveSize(double size) {
        return landRepository.getLandBySizeAfter(size);
    }

    @Override
    public List<LandDTO> getLandsWithinPolygon(List<Coordinate> coordinates) {
        List<Land> allLands = landRepository.findAll();
        List<Land> landsWithinPolygon = new ArrayList<>();

        for (Land land : allLands) {
            if (land.getCoordinates() != null && !land.getCoordinates().isEmpty()) {
                Coordinate centroid = LandUtils.calculateCentroid(land.getCoordinates());
                if (LandUtils.isPointInPolygon(centroid, coordinates)) {
                    landsWithinPolygon.add(land);
                }
            }
        }
        return landsWithinPolygon.stream().map(LandUtils::toDTO).collect(Collectors.toList());
    }

    @Override
    public Page<LandDTO> getLands(int page, int size, String orderBy, String order, String searchTerm) {
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(order), orderBy);
        Page<Land> landPage;

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            // Search lands by owner ID or person name
            landPage = landRepository.searchLands(searchTerm, pageable);
        } else {
            // Retrieve all lands without search
            landPage = landRepository.findAll(pageable);
        }
        // Map Land entities to DTOs
        return landPage.map(LandUtils::toDTO);
    }

    @Override
    public LandDTO getLandByCoordinate(Coordinate coordinate) {
        List<Land> allLands = landRepository.findAll();
        Land land = LandUtils.findLandContainingPoint(coordinate, allLands);
        if (land != null) return LandUtils.toDTO(land);
        return null;
    }

    @Override
    public boolean deleteLandById(Long id) {
        try {
            landRepository.deleteById(id);
            return true;
        }
        catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    @Override
    public boolean deleteLandsByOwnerId(String id) {
        try {
            landRepository.deleteLandsByOwnerId(id);
            return true;
        }
        catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    @Override
    public LandDTO updateLandById(Long id, LandDTO landDTO) {
        try {
            Optional<Land> existingLandOpt = landRepository.findById(id);
            if (existingLandOpt.isEmpty()) {
                return null;
            }

            Land existingLand = existingLandOpt.get();
            Person owner = null;

            if (landDTO.getOwner() != null) {
                Optional<Person> person = personRepository.findById(landDTO.getOwner());
                if (person.isPresent()) {
                    owner = person.get();
                } else {
                    return null;
                }
            }

            existingLand.setSize(landDTO.getSize());
            existingLand.setLandType(landDTO.getLandType());
            existingLand.setOwnership(landDTO.getOwnership());
            existingLand.setOwner(owner);

            Land updatedLand = landRepository.save(existingLand);
            coordinateRepository.deleteByLandId(id);


            if (landDTO.getCoordinates() != null) {
                for (Coordinate coordinate : landDTO.getCoordinates()) {
                    coordinate.setLand(updatedLand);
                    coordinateRepository.save(coordinate);
                }
            }
            return LandUtils.toDTO(updatedLand);
        }
        catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }
}
