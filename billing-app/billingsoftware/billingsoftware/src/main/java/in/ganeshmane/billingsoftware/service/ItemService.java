package in.ganeshmane.billingsoftware.service;

import in.ganeshmane.billingsoftware.entity.ItemEntity;
import in.ganeshmane.billingsoftware.io.ItemRequest;
import in.ganeshmane.billingsoftware.io.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ItemService {
    ItemResponse addItem(ItemRequest request, MultipartFile file);
    List<ItemResponse> allItems();
    void deleteItem(String itemId);
//    ItemResponse updateItem(Long id);

}
