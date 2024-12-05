package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.dto.ComplainDTO;
import com.nuwan.LandMapDemo.dto.LandDTO;
import com.nuwan.LandMapDemo.dto.PersonDTO;
import com.nuwan.LandMapDemo.dto.PersonFundDTO;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface PersonService {

    boolean createPerson(PersonDTO personDTO);

    PersonDTO updatePerson(String id, PersonDTO personDTO);

    boolean deletePerson(String id);

    PersonDTO getPersonById(String id);

    Page<PersonDTO> getPersons(int page, int size, String orderBy, String order);

    boolean addLandToPerson(String person_id, Long land_id);

    boolean addFundToPerson(String person_id, Long fund_id);

    List<PersonDTO> searchPersons(String id);

    List<LandDTO> getLands(String id);

    List<PersonDTO> filterPersonsByAge(Integer minAge, Integer maxAge);

    List<PersonDTO> filterPersonsByDob(LocalDate dobStart, LocalDate dobEnd);

    List<ComplainDTO> getComplains(String id);

    List<PersonFundDTO> getFunds(String id);

    boolean checkExisting(String id);
}
