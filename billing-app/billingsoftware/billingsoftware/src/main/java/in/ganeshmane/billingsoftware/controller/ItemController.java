package in.ganeshmane.billingsoftware.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.ganeshmane.billingsoftware.entity.ItemEntity;
import in.ganeshmane.billingsoftware.io.CategoryRequest;
import in.ganeshmane.billingsoftware.io.ItemRequest;
import in.ganeshmane.billingsoftware.io.ItemResponse;
import in.ganeshmane.billingsoftware.service.ItemService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/items")
public class ItemController {
    private final ItemService service;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add-item")
    @ResponseStatus(HttpStatus.CREATED)
    public ItemResponse addItems(@RequestPart("item") String itemString,@RequestPart("file") MultipartFile file){
          System.out.println(itemString);
          System.out.println(file.getOriginalFilename());
            ObjectMapper mapper = new ObjectMapper();
            ItemRequest itemRequest=null;
        try{
            itemRequest = mapper.readValue(itemString,ItemRequest.class);
            return service.addItem(itemRequest,file);
        }catch (JsonProcessingException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Error Occurred While JSON parsing");
        }
    }

    @GetMapping("/all-items")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public List<ItemResponse> allItems(){
        try{
            return service.allItems();
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Could Not Fetch items");
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete-item/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable String itemId){
        try{
            service.deleteItem(itemId);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Could not delete item");
        }
    }


}
