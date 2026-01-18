package com.nuwan.LandMapDemo.utils;

import com.nuwan.LandMapDemo.domain.Message;
import com.nuwan.LandMapDemo.dto.MessageDTO;

public class MessageUtils {
    public static MessageDTO toDTO(Message message) {
        if (message == null) return null;
        
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getName());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setReceiverName(message.getReceiver().getName());
        dto.setSubject(message.getSubject());
        dto.setContent(message.getContent());
        dto.setSentAt(message.getSentAt());
        dto.setRead(message.isRead());
        dto.setReadAt(message.getReadAt());
        dto.setMessageType(message.getMessageType());
        if (message.getRelatedRequest() != null) {
            dto.setRelatedRequestId(message.getRelatedRequest().getId());
        }
        return dto;
    }
}

