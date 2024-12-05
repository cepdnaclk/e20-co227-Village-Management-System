package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Complain;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplainRepository extends JpaRepository<Complain, Long> {

    List<Complain> findAllByOrderByTimeDesc();

    @Query("SELECT c FROM Complain c WHERE " +
            "(c.complain LIKE %:keyword% OR " +
            "c.person.name LIKE %:keyword% OR " +
            "CAST(c.time AS string) LIKE %:keyword% OR " +
            "CAST(c.completeTime AS string) LIKE %:keyword%)")
    Page<Complain> searchComplains(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT c FROM Complain c WHERE " +
            "(c.complain LIKE %:keyword% OR " +
            "c.person.name LIKE %:keyword% OR " +
            "CAST(c.time AS string) LIKE %:keyword% OR " +
            "CAST(c.completeTime AS string) LIKE %:keyword%)")
    List<Complain> searchComplains(@Param("keyword") String keyword, Sort sort);
}
