package com.nuwan.LandMapDemo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class HouseDTO {

    private String id;

    private String name;

    private String villageArea;

    private Long land;

    private List<String> members;

    private String houseHolder;

    private double latitude;

    private double longitude;
}
