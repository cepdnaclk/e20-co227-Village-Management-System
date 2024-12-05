package com.nuwan.LandMapDemo.dto;

import com.nuwan.LandMapDemo.domain.Coordinate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LandDTO {

    private Long id;

    private double size;

    private String owner;

    private String ownerName;

    private String landType;

    private String ownership;

    private List<Coordinate> coordinates;
}
