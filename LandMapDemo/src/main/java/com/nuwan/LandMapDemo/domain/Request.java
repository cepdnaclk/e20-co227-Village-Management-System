package com.nuwan.LandMapDemo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    private RequestType requestType;

    public enum RequestType {
        CHARACTER_AND_RESIDENCE_CERTIFICATE,
        MEETING,
        INCOME_ASSESSMENT_FORM,
        UPDATE_DETAILS

    }

    @Column(nullable = false, updatable = false)
    private LocalDateTime time = LocalDateTime.now();

    @OneToOne
    @JoinColumn(name = "event_id", nullable = true)
    private Event event;

}
