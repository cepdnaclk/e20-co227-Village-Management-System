package com.nuwan.LandMapDemo.service.impl;

import com.nuwan.LandMapDemo.domain.House;
import com.nuwan.LandMapDemo.domain.Land;
import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.dto.HouseDTO;
import com.nuwan.LandMapDemo.repository.HouseRepository;
import com.nuwan.LandMapDemo.repository.LandRepository;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.service.HouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HouseServiceImpl implements HouseService {

    private final HouseRepository houseRepository;
    private final LandRepository landRepository;
    private final PersonRepository personRepository;

    @Override
    public boolean createHouse(HouseDTO houseDTO) {
        House house = new House();
        Person person;
        Land land;

        house.setId(houseDTO.getId());
        house.setName(houseDTO.getName());
        house.setVillageArea(houseDTO.getVillageArea());
        house.setLatitude(houseDTO.getLatitude());
        house.setLongitude(houseDTO.getLongitude());

        if (houseDTO.getHouseHolder() != null) {
            person = personRepository.findById(houseDTO.getHouseHolder()).orElse(null);
            if (person != null) {
                house.setHouseHolder(person);
            } else {
                return false;
            }
        }

        if (houseDTO.getLand() != null) {
            land = landRepository.findById(houseDTO.getLand()).orElse(null);
            if (land != null) {
                house.setLand(land);
            } else {
                return false;
            }
        }
        House savedHouse = houseRepository.save(house);
        if (houseDTO.getMembers() != null) {
            for (String personId : houseDTO.getMembers()) {
                person = personRepository.findById(personId).orElse(null);
                if (person != null) {
                    person.setHouse(savedHouse);
                    personRepository.save(person);
                } else {
                    return false;
                }
            }
        }

        return true;
    }

    @Override
    public HouseDTO updateHouse(String id, HouseDTO houseDTO) {
        House house = houseRepository.findById(id).orElseThrow(() -> new RuntimeException("House not found"));
        Person person;
        Land land;

        house.setId(houseDTO.getId());
        house.setName(houseDTO.getName());
        house.setVillageArea(houseDTO.getVillageArea());
        house.setLatitude(houseDTO.getLatitude());
        house.setLongitude(houseDTO.getLongitude());

        if (houseDTO.getHouseHolder() != null) {
            person = personRepository.findById(houseDTO.getHouseHolder()).orElseThrow(() -> new RuntimeException("HouseHolder not found"));;
            house.setHouseHolder(person);
        }

        if (houseDTO.getLand() != null) {
            land = landRepository.findById(houseDTO.getLand()).orElseThrow(() -> new RuntimeException("Land not found"));
            house.setLand(land);
        }

        if (houseDTO.getMembers() != null) {
            for (String personId : houseDTO.getMembers()) {
                person = personRepository.findById(personId).orElseThrow(() -> new RuntimeException("Members not found"));
                person.setHouse(house);
                personRepository.save(person);
            }
        }

        House updatedHouse = houseRepository.save(house);
        return toDTO(updatedHouse);
    }

    @Override
    public void deleteHouse(String id) {
        List<Person> persons = personRepository.findByHouseId(id);
        for (Person person : persons) {
            person.setHouse(null);
            personRepository.save(person);
        }
        houseRepository.deleteById(id);
    }

    @Override
    public HouseDTO getHouseById(String id) {
        House house = houseRepository.findById(id).orElseThrow(() -> new RuntimeException("House not found"));
        return toDTO(house);
    }


    @Override
    public List<HouseDTO> getAllHouses() {
        return houseRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<HouseDTO> getHousesByLandId(Long landId) {
        // Assuming Land has a relationship with House and can be queried
        // This requires adding a custom query method in the repository
        return houseRepository.findAllByLandId(landId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private HouseDTO toDTO(House house) {
        HouseDTO houseDTO = new HouseDTO();
        Land land;

        houseDTO.setId(house.getId());
        houseDTO.setName(house.getName());
        houseDTO.setVillageArea(house.getVillageArea());
        houseDTO.setLatitude(house.getLatitude());
        houseDTO.setLongitude(house.getLongitude());
        if (house.getHouseHolder() != null) houseDTO.setHouseHolder(house.getHouseHolder().getId());
        if (house.getLand() != null) houseDTO.setLand(house.getLand().getId());

        List<String> members = new ArrayList<>();

        for (Person member : house.getMembers()) {
            members.add(member.getId());
        }
        houseDTO.setMembers(members);

        return houseDTO;
    }

    @Override
    public boolean checkExisting(String id) {
        // Check if a house with the given id exists in the database
        return houseRepository.existsById(id);
    }

}
