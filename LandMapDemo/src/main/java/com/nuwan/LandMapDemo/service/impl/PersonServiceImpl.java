package com.nuwan.LandMapDemo.service.impl;

import com.nuwan.LandMapDemo.domain.Land;
import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.PersonFund;
import com.nuwan.LandMapDemo.dto.ComplainDTO;
import com.nuwan.LandMapDemo.dto.LandDTO;
import com.nuwan.LandMapDemo.dto.PersonDTO;
import com.nuwan.LandMapDemo.dto.PersonFundDTO;
import com.nuwan.LandMapDemo.repository.*;
import com.nuwan.LandMapDemo.service.PersonService;
import com.nuwan.LandMapDemo.utils.ComplainUtils;
import com.nuwan.LandMapDemo.utils.LandUtils;
import com.nuwan.LandMapDemo.utils.PersonFundUtils;
import com.nuwan.LandMapDemo.utils.PersonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonServiceImpl implements PersonService {

    private final PersonRepository personRepository;
    private final LandRepository landRepository;
    private final ComplainRepository complainRepository;
    private final PersonFundRepository personFundRepository;
    private final HouseRepository houseRepository;

    @Override
    public boolean createPerson(PersonDTO personDTO) {
        try {
            Person person = new Person();
            person.setId(personDTO.getId());
            person.setName(personDTO.getName());
            person.setOccupation(personDTO.getOccupation());
            person.setDob(personDTO.getDob());
            person.setIncome(personDTO.getIncome());
            person.setPhoneNumber(personDTO.getPhoneNumber());

            List<PersonFund> personFundsList = new ArrayList<>();
            if (personDTO.getFunds() != null) {
                for (Long fund : personDTO.getFunds()) {
                    personFundsList.add(personFundRepository.findById(fund).orElseThrow(() -> new RuntimeException("Fund is not found")));
                }
            }
            person.setFunds(personFundsList);

            List<Land> lands = new ArrayList<>();
            if (personDTO.getLands() != null) {;
                for (Long land : personDTO.getLands()) {
                    lands.add(landRepository.findById(land).orElseThrow(() -> new RuntimeException("Land is not found")));
                }
            }
            person.setLands(lands);

            if (personDTO.getHouse() != null) {
                person.setHouse(houseRepository.findById(personDTO.getHouse()).orElseThrow(() -> new RuntimeException("House is not find")));
            }

            personRepository.save(person);

            return true;

        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    @Override
    public PersonDTO updatePerson(String id, PersonDTO personDTO) {
        try {
            Optional<Person> existingPersonOpt = personRepository.findById(id);

            if (existingPersonOpt.isPresent()) {
                Person existingPerson = existingPersonOpt.get();
                // Update the fields
                existingPerson.setName(personDTO.getName());
                existingPerson.setOccupation(personDTO.getOccupation());
                existingPerson.setDob(personDTO.getDob());
                existingPerson.setPhoneNumber(personDTO.getPhoneNumber());
                existingPerson.setIncome(personDTO.getIncome());

                // Update funds
                List<PersonFund> updatedFunds = new ArrayList<>();
                if (personDTO.getFunds() != null) {
                    for (Long fundId : personDTO.getFunds()) {
                        updatedFunds.add(personFundRepository.findById(fundId).orElseThrow(() -> new RuntimeException("Fund not found")));
                    }
                }
                existingPerson.setFunds(updatedFunds);

                // Update lands
                List<Land> updatedLands = new ArrayList<>();
                if (personDTO.getLands() != null) {
                    for (Long landId : personDTO.getLands()) {
                        updatedLands.add(landRepository.findById(landId).orElseThrow(() -> new RuntimeException("Land not found")));
                    }
                }
                existingPerson.setLands(updatedLands);

                // Update house if exists
                if (personDTO.getHouse() != null) {
                    existingPerson.setHouse(houseRepository.findById(personDTO.getHouse()).orElseThrow(() -> new RuntimeException("House not found")));
                }

                // Save the updated person back to the repository
                Person updatedPerson = personRepository.save(existingPerson);

                return PersonUtils.toDTO(updatedPerson);
            } else {
                throw new RuntimeException("Person not found");
            }
        } catch (Exception e) {
            System.out.println("Error updating person: " + e.getMessage());
            return null;
        }
    }

    @Override
    public boolean deletePerson(String id) {
        try {
            Optional<Person> personOpt = personRepository.findById(id);

            if (personOpt.isPresent()) {
                Person person = personOpt.get();

                // Remove person's ownership of lands
                List<Land> lands = person.getLands();
                for (Land land : lands) {
                    land.setOwner(null);  // Or handle this in another appropriate way
                    landRepository.save(land);
                }

                // Now delete the person
                personRepository.delete(person);
                return true;
            } else {
                throw new RuntimeException("Person not found");
            }
        } catch (Exception e) {
            System.out.println("Error deleting person: " + e.getMessage());
            return false;
        }
    }

    @Override
    public PersonDTO getPersonById(String id) {
        return personRepository.findById(id).map(PersonUtils::toDTO).orElse(null);
    }

    @Override
    public Page<PersonDTO> getPersons(int page, int size, String orderBy, String order) {
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(order), orderBy);
        return personRepository.findAll(pageable).map(PersonUtils::toDTO);
    }

    @Override
    public boolean addLandToPerson(String person_id, Long land_id) {
        Optional<Person> person = personRepository.findById(person_id);
        Optional<Land> land = landRepository.findById(land_id);

        if (person.isPresent() && land.isPresent()) {
            land.get().setOwner(person.get());
            return true;
        }
        return false;
    }

    @Override
    public boolean addFundToPerson(String person_id, Long fund_id) {
        Optional<Person> personOpt = personRepository.findById(person_id);
        Optional<PersonFund> fundOpt = personFundRepository.findById(fund_id);

        if (personOpt.isPresent() && fundOpt.isPresent()) {
            Person person = personOpt.get();
            PersonFund fund = fundOpt.get();

            person.getFunds().add(fund);
            fund.getPersons().add(person);

            personRepository.save(person);
            personFundRepository.save(fund);

            return true;
        }

        return false;
    }

    public List<PersonDTO> searchPersons(String pattern) {
        return personRepository.searchPersons(pattern)
                .stream().
                map(PersonUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LandDTO> getLands(String id) {
        Optional<Person> person = personRepository.findById(id);

        return person.map(value -> value.getLands()
                .stream()
                .map(LandUtils::toDTO)
                .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    public List<PersonDTO> filterPersonsByAge(Integer minAge, Integer maxAge) {
        List<Person> allPersons = personRepository.findAll();

        return allPersons.stream()
                .filter(person -> {
                    LocalDate dob = person.getDob();
                    int age = Period.between(dob, LocalDate.now()).getYears();

                    return (minAge == null || age >= minAge) && (maxAge == null || age <= maxAge);
                })
                .map(PersonUtils::toDTO)
                .collect(Collectors.toList());
    }

    public List<PersonDTO> filterPersonsByDob(LocalDate dobStart, LocalDate dobEnd) {
        List<Person> allPersons = personRepository.findAll();

        return allPersons.stream()
                .filter(person -> {
                    LocalDate dob = person.getDob();

                    return (dobStart == null || !dob.isBefore(dobStart)) && (dobEnd == null || !dob.isAfter(dobEnd));
                })
                .map(PersonUtils::toDTO)
                .collect(Collectors.toList());
    }

    public List<ComplainDTO> getComplains(String id) {
        Optional<Person> person = personRepository.findById(id);
        return person.map(value -> value.getComplains().stream().map(ComplainUtils::toDTO).collect(Collectors.toList())).orElse(Collections.emptyList());
    }

    @Override
    public List<PersonFundDTO> getFunds(String id) {
        Optional<Person> person = personRepository.findById(id);
        return person.map(value -> value.getFunds().stream().map(PersonFundUtils::toDTO).collect(Collectors.toList())).orElse(Collections.emptyList());

    }

    @Override
    public boolean checkExisting(String id) {
        // Check if a house with the given id exists in the database
        return personRepository.existsById(id);
    }

}
