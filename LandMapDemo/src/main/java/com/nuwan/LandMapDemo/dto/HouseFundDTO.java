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
public class HouseFundDTO {
    Long id;

    private String name;

    private BigDecimal amount;

    private List<String> houses;

    private LocalDateTime updatedTime;

}
