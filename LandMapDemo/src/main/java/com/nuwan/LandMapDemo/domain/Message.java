package com.nuwan.LandMapDemo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private Person sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private Person receiver;

    private String subject;

    @Column(length = 2000)
    private String content;

    @Column(nullable = false, updatable = false)
    private LocalDateTime sentAt = LocalDateTime.now();

    private boolean isRead = false;

    private LocalDateTime readAt;

    @Enumerated(EnumType.STRING)
    private MessageType messageType;

    public enum MessageType {
        GENERAL,
        MEETING_REQUEST,
        CERTIFICATE_REQUEST,
        COMPLAINT,
        INFORMATION,
        URGENT
    }

    @ManyToOne
    @JoinColumn(name = "related_request_id", nullable = true)
    private Request relatedRequest;
}

