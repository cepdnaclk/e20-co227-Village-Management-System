package com.nuwan.LandMapDemo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EventDTO {
    private Long id;

    private String title;

    private String description;

    private LocalDateTime start;

    private LocalDateTime end;

    private boolean finished;
}
