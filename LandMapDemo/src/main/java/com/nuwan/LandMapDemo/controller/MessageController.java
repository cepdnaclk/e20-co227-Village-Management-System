package com.nuwan.LandMapDemo.controller;

import com.nuwan.LandMapDemo.dto.MessageDTO;
import com.nuwan.LandMapDemo.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody MessageDTO messageDTO) {
        MessageDTO sent = messageService.sendMessage(messageDTO);
        if (sent != null) {
            return new ResponseEntity<>(sent, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<List<MessageDTO>> getMessagesByReceiverId(@PathVariable String receiverId) {
        List<MessageDTO> messages = messageService.getMessagesByReceiverId(receiverId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @GetMapping("/sender/{senderId}")
    public ResponseEntity<List<MessageDTO>> getMessagesBySenderId(@PathVariable String senderId) {
        List<MessageDTO> messages = messageService.getMessagesBySenderId(senderId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageDTO> getMessageById(@PathVariable Long id) {
        MessageDTO message = messageService.getMessageById(id);
        if (message != null) {
            return new ResponseEntity<>(message, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        if (messageService.markAsRead(id)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/receiver/{receiverId}/unread/count")
    public ResponseEntity<Long> getUnreadMessageCount(@PathVariable String receiverId) {
        Long count = messageService.getUnreadMessageCount(receiverId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/receiver/{receiverId}/unread")
    public ResponseEntity<List<MessageDTO>> getUnreadMessages(@PathVariable String receiverId) {
        List<MessageDTO> messages = messageService.getUnreadMessages(receiverId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        if (messageService.deleteMessage(id)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

