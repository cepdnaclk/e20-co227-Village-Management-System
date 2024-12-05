package com.nuwan.LandMapDemo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class PersonFund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    private String name;

    private double amount;

    @ManyToMany(mappedBy = "funds")
    private List<Person> persons = new ArrayList<>();

    private LocalDateTime updatedTime = LocalDateTime.now();

    @PreUpdate
    public void setLastUpdate() {
        this.updatedTime = LocalDateTime.now();
    }

}
