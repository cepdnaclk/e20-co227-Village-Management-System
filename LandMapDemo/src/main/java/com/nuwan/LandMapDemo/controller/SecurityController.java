package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.Security;
import com.nuwan.LandMapDemo.dto.SecurityDTO;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.repository.SecurityRepository;
import com.nuwan.LandMapDemo.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/security")
public class SecurityController {

    private final SecurityRepository securityRepository;
    private final PersonRepository personRepository;

    @Autowired
    public SecurityController(SecurityRepository securityRepository, PersonRepository personRepository) {
        this.securityRepository = securityRepository;
        this.personRepository = personRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<Security> createUserPassword(@RequestBody SecurityDTO securityDTO) {
        System.out.println(securityDTO);
        Security security = new Security();
        Optional<Person> person = personRepository.findById(securityDTO.getPerson());
        person.ifPresent(security::setPerson);

        // Generate salt and hash the password
        String salt = SecurityUtils.generateSalt();
        String hashedPassword = SecurityUtils.hashPassword(securityDTO.getPassword(), salt);

        // Store the salt and hashed password
        security.setSalt(salt);
        security.setPassword(hashedPassword);

        Security createdSecurity = securityRepository.save(security);
        return new ResponseEntity<>(createdSecurity, HttpStatus.CREATED);
    }


    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestParam String personId, @RequestParam String password) {
        Optional<Security> securityOpt = securityRepository.findByPersonId(personId);

        if (securityOpt.isPresent()) {
            Security security = securityOpt.get();
            String storedSalt = security.getSalt();
            String storedHash = security.getPassword();

            // Hash the provided password with the stored salt
            String providedHash = SecurityUtils.hashPassword(password, storedSalt);

            // Compare hashes
            if (storedHash.equals(providedHash)) {
                return new ResponseEntity<>("Login successful", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
            }
        }
        return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
    }

}
