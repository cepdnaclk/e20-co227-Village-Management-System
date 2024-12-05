package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.dto.PersonFundDTO;
import com.nuwan.LandMapDemo.service.PersonFundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/person-fund")
public class PersonFundController {

    private final PersonFundService personFundService;

    // Create a new PersonFund
    @PostMapping
    public ResponseEntity<PersonFundDTO> createPersonFund(@RequestBody PersonFundDTO personFundDTO) {
        System.out.println("Controller");
        PersonFundDTO createdFund = personFundService.createPersonFund(personFundDTO);
        return new ResponseEntity<>(createdFund, HttpStatus.CREATED);
    }

    // Update an existing PersonFund by id
    @PutMapping("/{id}")
    public ResponseEntity<PersonFundDTO> updatePersonFund(@PathVariable Long id, @RequestBody PersonFundDTO personFundDTO) {
        PersonFundDTO updatedFund = personFundService.updatePersonFund(id, personFundDTO);
        return ResponseEntity.ok(updatedFund);
    }

    // Get a PersonFund by id
    @GetMapping("/{id}")
    public ResponseEntity<PersonFundDTO> getPersonFund(@PathVariable Long id) {
        PersonFundDTO personFundDTO = personFundService.getPersonFund(id);
        return ResponseEntity.ok(personFundDTO);
    }

    // Delete a PersonFund by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePersonFund(@PathVariable Long id) {
        personFundService.deletePersonFund(id);
        return ResponseEntity.noContent().build();
    }

    // Get all PersonFunds
    @GetMapping
    public ResponseEntity<List<PersonFundDTO>> getAllPersonFunds() {
        List<PersonFundDTO> personFunds = personFundService.getAllPersonFunds();
        return ResponseEntity.ok(personFunds);
    }

}
