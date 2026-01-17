package in.ganeshmane.billingsoftware.repository;

import in.ganeshmane.billingsoftware.entity.CategoryEntity;
import in.ganeshmane.billingsoftware.io.CategoryResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity,Long> {
    Optional<CategoryEntity> findByCategoryId(String categoryId);
    @Query("SELECT c FROM CategoryEntity c")
    List<CategoryEntity> findAllWithItems();

}
