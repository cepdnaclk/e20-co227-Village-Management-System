package com.nuwan.LandMapDemo.service;

import com.nuwan.LandMapDemo.dto.MessageDTO;

import java.util.List;

public interface MessageService {
    MessageDTO sendMessage(MessageDTO messageDTO);
    List<MessageDTO> getMessagesByReceiverId(String receiverId);
    List<MessageDTO> getMessagesBySenderId(String senderId);
    MessageDTO getMessageById(Long id);
    boolean markAsRead(Long messageId);
    Long getUnreadMessageCount(String receiverId);
    List<MessageDTO> getUnreadMessages(String receiverId);
    boolean deleteMessage(Long id);
}

