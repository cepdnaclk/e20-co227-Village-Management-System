package com.nuwan.LandMapDemo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class HouseFund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    private String name;

    private BigDecimal amount;

    @ManyToMany(mappedBy = "funds")
    private List<House> houses;

    private LocalDateTime updatedTime;

    @PreUpdate
    public void setLastUpdate() {
        this.updatedTime = LocalDateTime.now();
    }
}
