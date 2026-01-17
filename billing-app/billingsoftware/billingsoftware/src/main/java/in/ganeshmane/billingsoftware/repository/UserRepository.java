package in.ganeshmane.billingsoftware.repository;

import in.ganeshmane.billingsoftware.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface UserRepository extends JpaRepository<UserEntity,Long> {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByUserId(String userId);
}
