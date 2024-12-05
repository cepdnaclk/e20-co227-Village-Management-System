package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.dto.ComplainDTO;
import com.nuwan.LandMapDemo.service.ComplainService;
import com.nuwan.LandMapDemo.utils.ComplainUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/complain")
public class ComplainController {

    private final ComplainService complainService;

    @PostMapping
    public ResponseEntity<Void> createComplain(@RequestBody  ComplainDTO complainDTO) {
        System.out.println(complainDTO);
        if (complainService.createComplain(complainDTO)) return new ResponseEntity<>(HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllComplains(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "order_by", defaultValue = "time") String orderBy,
            @RequestParam(name = "order", defaultValue = "DESC") String order,
            @RequestParam(name = "search", required = false) String searchTerm) {


        // Validate the order parameter
        if (!order.equalsIgnoreCase("ASC") && !order.equalsIgnoreCase("DESC")) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Validate page and size parameters
        if (page < 0 || size <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Fetch paginated and sorted complains
        Page<ComplainDTO> paginatedComplains = complainService.getAllComplains(page, size, orderBy, order, searchTerm);

        // Prepare the response
        Map<String, Object> response = new HashMap<>();
        response.put("totalElements", paginatedComplains.getTotalElements());
        response.put("complains", paginatedComplains.getContent());
        response.put("currentPage", paginatedComplains.getNumber());
        response.put("totalPages", paginatedComplains.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplainDTO> getComplainById(@PathVariable Long id) {
        ComplainDTO complainDTO = complainService.getComplainById(id);
        if (complainDTO != null) return new ResponseEntity<>(complainDTO, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComplainDTO> updateComplain(
            @PathVariable(name = "id") Long id, @RequestBody ComplainDTO complainDTO) {
        ComplainDTO updatedComplain = complainService.updateComplain(id, complainDTO);
        if (updatedComplain != null) {
            return ResponseEntity.ok(updatedComplain);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplain(@PathVariable(name = "id") Long id) {
        if (complainService.deleteComplain(id)) return new ResponseEntity<>(HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportComplaints(
            @RequestParam(name = "format") String format,
            @RequestParam(name = "order_by", defaultValue = "time") String orderBy,
            @RequestParam(name = "order", defaultValue = "DESC") String order,
            @RequestParam(name = "search", required = false) String searchTerm) throws IOException {

        List<ComplainDTO> complains = complainService.getAllComplains(orderBy, order, searchTerm);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        switch (format.toLowerCase()) {
            case "csv":
                outputStream = ComplainUtils.exportToCSV(complains);
                break;
            case "html":
                outputStream = ComplainUtils.exportToHTML(complains);
                break;
            case "json":
                outputStream = ComplainUtils.exportToJSON(complains);
                break;
            default:
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(outputStream.toByteArray()));

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=complaints." + format);

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(outputStream.size())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

}
