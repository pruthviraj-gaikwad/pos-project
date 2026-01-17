import './DisplayCategory.css'
import Category from '../category/Category.jsx';
import { useEffect } from 'react';
const DisplayCategory = ({selectedCategory,setSelectedCategory , categories }) =>{
     if (!categories || categories.length === 0) {
        return <p>Loading categories...</p>; // or show a spinner
    }
    return (
        
        <div className="row g-3" style={{width : '100%',margin:0}}>
            {categories.map(category =>(
                <div className="col-md-3 col-sm-6" key={category.categoryId} style={{padding:'0,10px'}}>
                        <Category
                        categoryName = {category.name}
                        imgUrl = {category.imgUrl}
                        numberOfItems = {category.items}
                        bgColor = {category.bgColor}
                        isSelected={selectedCategory === category.categoryId}
                        onClick = {()=>setSelectedCategory(category.categoryId)}
                        />
                </div>
            ))}
        </div>
    );
}

export default DisplayCategory;