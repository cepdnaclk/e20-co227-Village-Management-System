package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.domain.Coordinate;
import com.nuwan.LandMapDemo.domain.Land;
import com.nuwan.LandMapDemo.dto.LandDTO;
import com.nuwan.LandMapDemo.service.LandService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/land")
@RequiredArgsConstructor
public class LandController {

    private final LandService landService;

    @PostMapping
    public ResponseEntity<Void> createLand(@RequestBody LandDTO landDTO) {
        System.out.println(landDTO);
        if (landService.createLand(landDTO)) return new ResponseEntity<>(HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getLands(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "order_by", defaultValue = "id") String orderBy,
            @RequestParam(name = "order", defaultValue = "ASC") String order,
            @RequestParam(name = "search", required = false) String searchTerm) {

        // Validate the order parameter
        if (!order.equalsIgnoreCase("ASC") && !order.equalsIgnoreCase("DESC")) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Validate page and size parameters
        if (page < 0 || size <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Fetch paginated, sorted, and searched lands
        Page<LandDTO> paginatedLands = landService.getLands(page, size, orderBy, order, searchTerm);

        // Prepare the response
        Map<String, Object> response = new HashMap<>();
        response.put("totalElements", paginatedLands.getTotalElements());
        response.put("lands", paginatedLands.getContent());
        response.put("currentPage", paginatedLands.getNumber());
        response.put("totalPages", paginatedLands.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<LandDTO> getLandById(@PathVariable("id") Long id) {
        LandDTO land = landService.getLandById(id);
        if (land != null) return new ResponseEntity<>(land, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/within-polygon")
    public ResponseEntity<List<LandDTO>> getLandsWithinPolygon(@RequestBody List<Coordinate> coordinates) {
        List<LandDTO> lands = landService.getLandsWithinPolygon(coordinates);
        if (lands.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lands, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LandDTO> updateLandById(@PathVariable("id") Long id, @RequestBody LandDTO landDTO) {
        LandDTO updatedLandDTO =landService.updateLandById(id, landDTO);
        if (updatedLandDTO != null) return new ResponseEntity<>(updatedLandDTO, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/by-coordinate")
    public ResponseEntity<LandDTO> getLandByCoordinate(@RequestBody Coordinate coordinate) {
        LandDTO land = landService.getLandByCoordinate(coordinate);
        if (land != null) {
            return new ResponseEntity<>(land, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLandById(@PathVariable("id") Long id) {
        if (landService.deleteLandById(id)) return new ResponseEntity<>(HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
