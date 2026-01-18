package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Message;
import com.nuwan.LandMapDemo.domain.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiver(Person receiver);
    List<Message> findBySender(Person sender);
    List<Message> findByReceiverAndIsRead(Person receiver, boolean isRead);
    
    @Query("SELECT m FROM Message m WHERE m.receiver.id = :receiverId ORDER BY m.sentAt DESC")
    List<Message> findByReceiverIdOrderBySentAtDesc(@Param("receiverId") String receiverId);
    
    @Query("SELECT m FROM Message m WHERE m.sender.id = :senderId ORDER BY m.sentAt DESC")
    List<Message> findBySenderIdOrderBySentAtDesc(@Param("senderId") String senderId);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :receiverId AND m.isRead = false")
    Long countUnreadMessagesByReceiverId(@Param("receiverId") String receiverId);
}

