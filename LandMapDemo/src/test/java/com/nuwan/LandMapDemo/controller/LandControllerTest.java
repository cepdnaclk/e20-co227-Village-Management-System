package com.nuwan.LandMapDemo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nuwan.LandMapDemo.dto.LandDTO;
import com.nuwan.LandMapDemo.service.LandService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LandController.class)
public class LandControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LandService landService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testCreateLand() throws Exception {
        LandDTO landDTO = new LandDTO();
        when(landService.createLand(any(LandDTO.class))).thenReturn(true);

        mockMvc.perform(post("/api/land")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(landDTO)))
                .andExpect(status().isCreated());
    }

    @Test
    void testGetLandById() throws Exception {
        LandDTO landDTO = new LandDTO();
        when(landService.getLandById(anyLong())).thenReturn(landDTO);

        mockMvc.perform(get("/api/land/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size").exists());
    }


    @Test
    void testUpdateLandById() throws Exception {
        LandDTO landDTO = new LandDTO();
        when(landService.updateLandById(anyLong(), any(LandDTO.class))).thenReturn(landDTO);

        mockMvc.perform(put("/api/land/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(landDTO)))
                .andExpect(status().isOk());
    }

    @Test
    void testGetLandsWithinPolygon() throws Exception {
        List<LandDTO> lands = List.of(new LandDTO(/* initialize with test data */));
        when(landService.getLandsWithinPolygon(anyList())).thenReturn(lands);

        List<Object> polygonCoordinates = List.of(
                Map.of("lat", 10.0, "lng", 20.0),
                Map.of("lat", 15.0, "lng", 25.0)
        );

        mockMvc.perform(post("/api/land/within-polygon")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(polygonCoordinates)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0]").exists()); // Check for at least one land item
    }


    @Test
    void testCreateLandWithInvalidData() throws Exception {
        LandDTO invalidLandDTO = new LandDTO();
        // Set invalid data for your DTO if necessary

        when(landService.createLand(any(LandDTO.class))).thenReturn(false); // Simulate failure

        mockMvc.perform(post("/api/land")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidLandDTO)))
                .andExpect(status().isBadRequest()); // Adjust based on your actual error handling
    }
    @Test
    void testGetLandByIdWhenNotFound() throws Exception {
        when(landService.getLandById(anyLong())).thenReturn(null); // Simulate not found

        mockMvc.perform(get("/api/land/1"))
                .andExpect(status().isNotFound()); // Adjust based on your actual status code
    }


}
