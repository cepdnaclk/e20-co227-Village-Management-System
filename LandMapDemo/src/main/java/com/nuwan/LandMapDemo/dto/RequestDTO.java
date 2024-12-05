package com.nuwan.LandMapDemo.dto;

import com.nuwan.LandMapDemo.domain.Request;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RequestDTO {

    private Long id;

    private String person;

    private Request.RequestType requestType;

    private LocalDateTime time;

    private Long event;
}
