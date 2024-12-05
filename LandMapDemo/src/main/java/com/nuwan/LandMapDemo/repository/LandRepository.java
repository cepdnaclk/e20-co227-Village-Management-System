package com.nuwan.LandMapDemo.repository;

import com.nuwan.LandMapDemo.domain.Land;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LandRepository extends JpaRepository<Land, Long> {

    List<Land> getLandBySizeAfter(double size);

    List<Land> getLandsBySizeBetween(double size1, double size2);
    @Query("SELECT l FROM Land l JOIN l.owner p WHERE " +
            "CAST(l.owner.id AS string) LIKE %:keyword% OR " +
            "p.name LIKE %:keyword%")
    Page<Land> searchLands(@Param("keyword") String keyword, Pageable pageable);

    void deleteLandsByOwnerId(String id);

}
