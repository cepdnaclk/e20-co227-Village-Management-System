package com.nuwan.LandMapDemo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class House {

    @Id
    private String id;

    private String name;

    private String villageArea;

    @ManyToOne
    @JoinColumn(name = "land_id")
    Land land;

    @OneToMany(mappedBy = "house", cascade = CascadeType.MERGE)
    private List<Person> members;

    @OneToOne
    @JoinColumn(name = "house_holder_id")
    private Person houseHolder;

    private double latitude;

    private double longitude;

    @ManyToMany
    @JoinTable(
            joinColumns = @JoinColumn(name = "house_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "fund_id", referencedColumnName = "id")
    )
    private List<HouseFund> funds;

}
