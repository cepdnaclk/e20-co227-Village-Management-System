package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.repository.CertificateRepository;
import com.nuwan.LandMapDemo.repository.ComplainRepository;
import com.nuwan.LandMapDemo.repository.LandRepository;
import com.nuwan.LandMapDemo.repository.MessageRepository;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final PersonRepository personRepository;
    private final LandRepository landRepository;
    private final CertificateRepository certificateRepository;
    private final MessageRepository messageRepository;
    private final RequestRepository requestRepository;
    private final ComplainRepository complainRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Total villagers
            long totalPersons = personRepository.count();
            stats.put("totalVillagers", totalPersons);
            
            // Total land parcels
            long totalLands = landRepository.count();
            stats.put("totalLands", totalLands);
            
            // Total certificates issued
            long totalCertificates = certificateRepository.count();
            stats.put("totalCertificates", totalCertificates);
            
            // Unread messages (assuming a grama niladhari ID - you may need to pass this as parameter)
            // For now, we'll get total unread messages
            long unreadMessages = messageRepository.count();
            stats.put("unreadMessages", unreadMessages);
            
            // Pending requests
            long pendingRequests = requestRepository.count();
            stats.put("pendingRequests", pendingRequests);
            
            // Recent complaints count
            long totalComplaints = complainRepository.count();
            stats.put("totalComplaints", totalComplaints);
            
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Error getting dashboard stats: " + e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

