package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.dto.HouseDTO;
import com.nuwan.LandMapDemo.service.HouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/house")
@Controller
@RequiredArgsConstructor
public class HouseController {

    private final HouseService houseService;

    @PostMapping
    public ResponseEntity<Void> createHouse(@RequestBody HouseDTO houseDTO) {
        System.out.println(houseDTO);
        if(houseService.createHouse(houseDTO)) return new ResponseEntity<>(HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HouseDTO> updateHouse(@PathVariable String id, @RequestBody HouseDTO houseDTO) {
        HouseDTO updatedHouse = houseService.updateHouse(id, houseDTO);
        return new ResponseEntity<>(updatedHouse, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHouse(@PathVariable String id) {
        houseService.deleteHouse(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HouseDTO> getHouseById(@PathVariable String id) {
        HouseDTO house = houseService.getHouseById(id);
        return new ResponseEntity<>(house, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<HouseDTO>> getAllHouses() {
        List<HouseDTO> houses = houseService.getAllHouses();
        return new ResponseEntity<>(houses, HttpStatus.OK);
    }

    @GetMapping("/by-land/{landId}")
    public ResponseEntity<List<HouseDTO>> getHousesByLandId(@PathVariable Long landId) {
        List<HouseDTO> houses = houseService.getHousesByLandId(landId);
        if (houses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(houses, HttpStatus.OK);
    }

    @GetMapping("/check-existing/{id}")
    public boolean checkExisting(@PathVariable("id") String id) {
        return houseService.checkExisting(id);
    }
}
