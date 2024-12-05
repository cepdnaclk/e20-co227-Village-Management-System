package com.nuwan.LandMapDemo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PersonFundDTO {
    Long id;

    private String name;

    private double amount;

    private List<String> persons;

    private LocalDateTime updatedTime;
}
