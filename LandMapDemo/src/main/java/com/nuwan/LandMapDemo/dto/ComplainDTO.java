package com.nuwan.LandMapDemo.dto;

import com.nuwan.LandMapDemo.domain.Complain;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ComplainDTO {
    private Long id;

    private String person;

    private String personName;

    private String complain;

    private LocalDateTime time = LocalDateTime.now();

    private LocalDateTime completeTime;

    private Complain.Status status = Complain.Status.PENDING;

    private String notes;
}
