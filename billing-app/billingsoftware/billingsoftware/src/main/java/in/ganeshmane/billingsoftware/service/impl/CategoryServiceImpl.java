package in.ganeshmane.billingsoftware.service.impl;

import in.ganeshmane.billingsoftware.entity.CategoryEntity;
import in.ganeshmane.billingsoftware.io.CategoryRequest;
import in.ganeshmane.billingsoftware.io.CategoryResponse;
import in.ganeshmane.billingsoftware.repository.CategoryRepository;
import in.ganeshmane.billingsoftware.repository.ItemRepository;
import in.ganeshmane.billingsoftware.service.CategoryService;
import in.ganeshmane.billingsoftware.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private  CategoryRepository categoryRepository;
    @Autowired
    private FileUploadService fileUploadService;
    private final ItemRepository itemRepository;
    @Override
    public CategoryResponse addCategory(CategoryRequest request,MultipartFile file) {
        try{
        String imgUrl = fileUploadService.uploadFile(file);
        CategoryEntity newCategory = convertToEntity(request,imgUrl);
        newCategory = categoryRepository.save(newCategory);
        return convertToResponse(newCategory);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Could not upload image to server"+e.getMessage());
        }
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllWithItems()
                .stream()
                .map(categoryEntity ->convertToResponse(categoryEntity) )
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCategory(String CategoryId) {
        try{
           CategoryEntity existingCategory =  categoryRepository.findByCategoryId(CategoryId).orElseThrow(()-> new RuntimeException("Category Not Available."));

           if(fileUploadService.deleteFile(existingCategory.getImgUrl())){
                categoryRepository.delete(existingCategory);
//                  categoryRepository.findById(CategoryId).orElseThrow(()->new Exception("Error No room available"));
//                  categoryRepository.deleteById(CategoryId);
//                  return true;
           }else{
               throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Could not delete Image : ");
           }
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Category Id Not Found : "+e.getMessage());
//            return false;
        }
    }

    private CategoryResponse convertToResponse(CategoryEntity newCategory){

        return CategoryResponse.builder()
                .categoryId(newCategory.getCategoryId())
                .name(newCategory.getName())
                .bgColor(newCategory.getBgColor())
                .description(newCategory.getDescription())
                .imgUrl(newCategory.getImgUrl())
                .createdAt(newCategory.getCreatedAt())
                .updatedAt(newCategory.getUpdatedAt())
                .items(itemRepository.countByCategoryId(newCategory.getId()))
                .build();
    }
    private CategoryEntity convertToEntity(CategoryRequest request,String imgUrl){
       return CategoryEntity.builder()
                .categoryId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
               .imgUrl(imgUrl)
                .bgColor(request.getBgColor())
                .build();
    }
}
