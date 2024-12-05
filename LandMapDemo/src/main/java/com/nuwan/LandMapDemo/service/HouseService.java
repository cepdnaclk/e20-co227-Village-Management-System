package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.dto.HouseDTO;

import java.util.List;

public interface HouseService {
    boolean createHouse(HouseDTO houseDTO);

    HouseDTO updateHouse(String id, HouseDTO houseDTO);

    void deleteHouse(String id);

    HouseDTO getHouseById(String id);

    List<HouseDTO> getAllHouses();

    List<HouseDTO> getHousesByLandId(Long landId);

    boolean checkExisting(String id);
}
