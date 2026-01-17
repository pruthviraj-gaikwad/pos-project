package in.ganeshmane.billingsoftware.service;

import in.ganeshmane.billingsoftware.entity.CategoryEntity;
import in.ganeshmane.billingsoftware.io.CategoryRequest;
import in.ganeshmane.billingsoftware.io.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
public interface CategoryService {
    CategoryResponse addCategory(CategoryRequest request, MultipartFile file);
    List<CategoryResponse> getAllCategories();
    void deleteCategory(String CategoryId);
}

