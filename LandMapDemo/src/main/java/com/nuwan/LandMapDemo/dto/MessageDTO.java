package com.nuwan.LandMapDemo.dto;

import com.nuwan.LandMapDemo.domain.Message;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageDTO {
    private Long id;
    private String senderId;
    private String senderName;
    private String receiverId;
    private String receiverName;
    private String subject;
    private String content;
    private LocalDateTime sentAt;
    private boolean isRead;
    private LocalDateTime readAt;
    private Message.MessageType messageType;
    private Long relatedRequestId;
}

