package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.domain.Complain;
import com.nuwan.LandMapDemo.domain.Land;
import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.dto.ComplainDTO;
import com.nuwan.LandMapDemo.dto.LandDTO;
import com.nuwan.LandMapDemo.dto.PersonDTO;
import com.nuwan.LandMapDemo.dto.PersonFundDTO;
import com.nuwan.LandMapDemo.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/person")
public class PersonController {

    private final PersonService personService;

    @PostMapping("/")
    public ResponseEntity<Void> createPerson(@RequestBody PersonDTO personDTO) {
        if (personService.createPerson(personDTO)) return new ResponseEntity<>(HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getPersons(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "order_by", defaultValue = "id") String orderBy,
            @RequestParam(name = "order", defaultValue = "ASC") String order) {

        if (!order.equalsIgnoreCase("ASC") && !order.equalsIgnoreCase("DESC")) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (page < 0 || size <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Page<PersonDTO> paginatedPersons = personService.getPersons(page, size, orderBy, order);

        Map<String, Object> response = new HashMap<>();
        response.put("totalElements", paginatedPersons.getTotalElements());
        response.put("persons", paginatedPersons.getContent());
        response.put("currentPage", paginatedPersons.getNumber());
        response.put("totalPages", paginatedPersons.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<PersonDTO> getPersonById(@PathVariable(name = "id") String id) {
        PersonDTO personDTO = personService.getPersonById(id);
        if (personDTO != null) return new  ResponseEntity<>(personDTO, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonDTO> updatePersonById(
            @PathVariable(name = "id") String id,
            @RequestBody PersonDTO personDTO
    ) {
        PersonDTO updatedPersonDTO = personService.updatePerson(id, personDTO);
        if (updatedPersonDTO != null) return new ResponseEntity<>(updatedPersonDTO, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePersonById(@PathVariable(name = "id") String id) {
        if (personService.deletePerson(id)) return new ResponseEntity<>(HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{person_id}/add_land/{land_id}")
    public ResponseEntity<Void> addLandToPerson(
            @PathVariable(name = "person_id") String person_id,
            @PathVariable(name = "land_id") Long land_id
    ) {
        if (personService.addLandToPerson(person_id, land_id)) return new ResponseEntity<>(HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/{person_id}/add_fund/{fund_id}")
    public ResponseEntity<Void> addFundToPerson(
            @PathVariable(name = "person_id") String person_id,
            @PathVariable(name = "fund_id") Long fund_id
    ) {
        if (personService.addFundToPerson(person_id, fund_id)) return new ResponseEntity<>(HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/search")
    public List<PersonDTO> searchPersons(@RequestParam("keyword") String keyword) {
        return personService.searchPersons(keyword);
    }

    @GetMapping("/{person_id}/lands")
    public List<LandDTO> getLands(@PathVariable(name = "person_id") String id) {
        return personService.getLands(id);
    }

    @GetMapping("/{person_id}/complains")
    public List<ComplainDTO> getComplains(@PathVariable(name = "person_id") String id) {
        return personService.getComplains(id);
    }

    @GetMapping("/{person_id}/funds")
    public List<PersonFundDTO> getFunds(@PathVariable(name = "person_id") String id) {
        return personService.getFunds(id);
    }

    @GetMapping("/filterByAge")
    public ResponseEntity<List<PersonDTO>> filterPersonsByAge(
            @RequestParam(name = "minAge", required = false) Integer minAge,
            @RequestParam(name = "maxAge", required = false) Integer maxAge
    ) {
        List<PersonDTO> filteredPersons = personService.filterPersonsByAge(minAge, maxAge);
        return new ResponseEntity<>(filteredPersons, HttpStatus.OK);
    }

    @GetMapping("/filterByDob")
    public ResponseEntity<List<PersonDTO>> filterPersonsByDob(
            @RequestParam(name = "dobStart", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dobStart,
            @RequestParam(name = "dobEnd", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dobEnd
    ) {
        List<PersonDTO> filteredPersons = personService.filterPersonsByDob(dobStart, dobEnd);
        return new ResponseEntity<>(filteredPersons, HttpStatus.OK);
    }

    @GetMapping("/check-existing/{id}")
    public boolean checkExisting(@PathVariable("id") String id) {
        return personService.checkExisting(id);
    }

}
