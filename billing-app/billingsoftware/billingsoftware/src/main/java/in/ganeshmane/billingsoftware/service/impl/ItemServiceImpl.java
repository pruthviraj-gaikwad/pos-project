package in.ganeshmane.billingsoftware.service.impl;

import in.ganeshmane.billingsoftware.entity.CategoryEntity;
import in.ganeshmane.billingsoftware.entity.ItemEntity;
import in.ganeshmane.billingsoftware.io.ItemRequest;
import in.ganeshmane.billingsoftware.io.ItemResponse;
import in.ganeshmane.billingsoftware.repository.CategoryRepository;
import in.ganeshmane.billingsoftware.repository.ItemRepository;
import in.ganeshmane.billingsoftware.service.FileUploadService;
import in.ganeshmane.billingsoftware.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
    private final FileUploadService fileUploadService;
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    @Override
    public ItemResponse addItem(ItemRequest request, MultipartFile file) {
        String imgUrl = fileUploadService.uploadFile(file);
        CategoryEntity categoryEntity = categoryRepository.findByCategoryId(request.getCategoryId()).orElseThrow(()->new RuntimeException("Category Not Found"));
        ItemEntity newItem = convertToEntity(request);
        newItem.setCategory(categoryEntity);
        newItem.setImgUrl(imgUrl);
        newItem = itemRepository.save(newItem);
        return convertToResponse(newItem);
    }

    private ItemResponse convertToResponse(ItemEntity itemEntity){
        return ItemResponse.builder()
                .itemId(itemEntity.getItemId())
                .name(itemEntity.getName())
                .description(itemEntity.getDescription())
                .price(itemEntity.getPrice())
                .imageUrl(itemEntity.getImgUrl())
                .categoryName(itemEntity.getCategory().getName())
                .categoryId(itemEntity.getCategory().getCategoryId())
                .createdAt(itemEntity.getCreatedAt())
                .updatedAt(itemEntity.getUpdatedAt())
                .build();
    }
    private ItemEntity convertToEntity(ItemRequest request){
        return ItemEntity.builder()
                .itemId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .build();
    }

    @Override
    public List<ItemResponse> allItems() {
        return itemRepository.findAll()
                .stream()
                .map((item)->convertToResponse(item))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteItem(String itemId) {
            ItemEntity itemEntity = itemRepository.findByItemId(itemId).orElseThrow(()->new UsernameNotFoundException("No item found at itemId : "+itemId));
            boolean isFileDeleted = fileUploadService.deleteFile(itemEntity.getImgUrl());
            if(isFileDeleted){
                itemRepository.delete(itemEntity);
            }else{
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Unable to Delete File");
            }
    }
}
