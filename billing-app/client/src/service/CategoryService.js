// src/service/categoryService.js
import apiClient from "./api";

export const addCategory = async (categoryObj, file) => {
    const formData = new FormData();
    if (!file) {
        console.log("No File");
        return;
    }
    formData.append("category", JSON.stringify(categoryObj));
    formData.append("file", file);

    return await apiClient.post("/admin/add-category", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const allCategories = async () => {
    return await apiClient.get("/categories/all-categories");
};

export const deleteCategory = async (categoryId) => {
    return await apiClient.delete(`/admin/delete-category/${categoryId}`);
};
