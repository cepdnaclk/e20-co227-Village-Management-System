package com.nuwan.LandMapDemo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LandFilterDTO {
    private Double minSize;
    private Double maxSize;
    private String landType;
    private String ownership;
    private String ownerId;
    private String ownerName;
    private String searchTerm;
}

