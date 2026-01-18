package com.nuwan.LandMapDemo.service.impl;

import com.nuwan.LandMapDemo.domain.Message;
import com.nuwan.LandMapDemo.domain.Person;
import com.nuwan.LandMapDemo.domain.Request;
import com.nuwan.LandMapDemo.dto.MessageDTO;
import com.nuwan.LandMapDemo.repository.MessageRepository;
import com.nuwan.LandMapDemo.repository.PersonRepository;
import com.nuwan.LandMapDemo.repository.RequestRepository;
import com.nuwan.LandMapDemo.service.MessageService;
import com.nuwan.LandMapDemo.utils.MessageUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final PersonRepository personRepository;
    private final RequestRepository requestRepository;

    @Override
    @Transactional
    public MessageDTO sendMessage(MessageDTO messageDTO) {
        try {
            Optional<Person> senderOpt = personRepository.findById(messageDTO.getSenderId());
            Optional<Person> receiverOpt = personRepository.findById(messageDTO.getReceiverId());
            
            if (senderOpt.isEmpty() || receiverOpt.isEmpty()) {
                return null;
            }
            
            Message message = new Message();
            message.setSender(senderOpt.get());
            message.setReceiver(receiverOpt.get());
            message.setSubject(messageDTO.getSubject());
            message.setContent(messageDTO.getContent());
            message.setMessageType(messageDTO.getMessageType());
            message.setSentAt(LocalDateTime.now());
            
            if (messageDTO.getRelatedRequestId() != null) {
                Optional<Request> requestOpt = requestRepository.findById(messageDTO.getRelatedRequestId());
                requestOpt.ifPresent(message::setRelatedRequest);
            }
            
            Message saved = messageRepository.save(message);
            return MessageUtils.toDTO(saved);
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    @Override
    public List<MessageDTO> getMessagesByReceiverId(String receiverId) {
        return messageRepository.findByReceiverIdOrderBySentAtDesc(receiverId)
                .stream()
                .map(MessageUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageDTO> getMessagesBySenderId(String senderId) {
        return messageRepository.findBySenderIdOrderBySentAtDesc(senderId)
                .stream()
                .map(MessageUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MessageDTO getMessageById(Long id) {
        return messageRepository.findById(id)
                .map(MessageUtils::toDTO)
                .orElse(null);
    }

    @Override
    @Transactional
    public boolean markAsRead(Long messageId) {
        try {
            Optional<Message> messageOpt = messageRepository.findById(messageId);
            if (messageOpt.isEmpty()) {
                return false;
            }
            
            Message message = messageOpt.get();
            message.setRead(true);
            message.setReadAt(LocalDateTime.now());
            messageRepository.save(message);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    @Override
    public Long getUnreadMessageCount(String receiverId) {
        return messageRepository.countUnreadMessagesByReceiverId(receiverId);
    }

    @Override
    public List<MessageDTO> getUnreadMessages(String receiverId) {
        Optional<Person> personOpt = personRepository.findById(receiverId);
        if (personOpt.isEmpty()) {
            return List.of();
        }
        
        return messageRepository.findByReceiverAndIsRead(personOpt.get(), false)
                .stream()
                .map(MessageUtils::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean deleteMessage(Long id) {
        try {
            messageRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }
}

