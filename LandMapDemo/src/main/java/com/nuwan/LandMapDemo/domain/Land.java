package com.nuwan.LandMapDemo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties("owner")
public class Land {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double size;

    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person owner;

    private String landType;

    private String ownership;

    @OneToMany(mappedBy = "land", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Coordinate> coordinates;

}
