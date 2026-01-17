package in.ganeshmane.billingsoftware.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.ganeshmane.billingsoftware.io.CategoryRequest;
import in.ganeshmane.billingsoftware.io.CategoryResponse;
import in.ganeshmane.billingsoftware.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/add-category")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(@RequestPart("category") String categoryRequestString,@RequestPart("file") MultipartFile file ){
        System.out.println("Raw category JSON: " + categoryRequestString);
        System.out.println("Received file: " + file.getOriginalFilename());
        ObjectMapper objectMapper = new ObjectMapper();
        CategoryRequest request = null;
        try{
            request = objectMapper.readValue(categoryRequestString,CategoryRequest.class);
            return categoryService.addCategory(request,file);
        }catch(JsonProcessingException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Exception Occurred while parsing JSON : "+e.getMessage());
        }
    }
    @GetMapping("/categories/all-categories")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public List<CategoryResponse> getAllCategories(){
        return categoryService.getAllCategories();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/delete-category/{categoryId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void deleteCategory(@PathVariable("categoryId")String categoryId){
        try{
         categoryService.deleteCategory(categoryId);
        }catch(Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Category Not Found");
        }
    }

}
