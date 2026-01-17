        // <div className="category-form-container">
        //     <h2>Add Category</h2>
        //     <div className="block-catagory">
        //     <label>Category Name</label>
        //     <input type="text" placeholder="Enter Category Name" onChange={(e)=>setCategory(e.target.value)}/>
        //     </div>
        //     <div className="block-catagory">

        //     <label>Description</label>
        //     <textarea name="description" id="textarea-category-form" rows={5} cols={40} placeholder="Enter Description" onChange={(e)=>setDesciption(e.target.value)}></textarea>
        //     </div>
        //     <div className="block-catagory">

        //     <label>Select Background</label>
        //     <input type="color" onChange={(e)=>setBackgroundColor(e.target.value)}/>
        //     </div>
        //     <div className="block-catagory">
        //         <label htmlFor="">File Upload </label>
        //     <input type="file" placeholder="Add File" onChange={(e)=>setImage(e.target.value)}/>
        //     </div>
        //     <div className="block-button">
        //         <button onClick={handleAddCategory} className="category-form-button">Add Category</button>
        //     </div>
        //     {error && <p>{error}</p>}

        // </div>

        /*
            const [categoryDetails,setCategoryDetails]=useState({
        category :'',
        description :'',
        bgColor : ''
    })

    const handleAddCategory = ()=>{
        if(!backgroundColor || !category || !description || !image ){
            console.log(category)
            console.log(description)
            console.log(image)
            console.log(backgroundColor);
            setError("Please All Fields Are Required");
            setTimeout(()=>{
                setError('');
            },3000)
        }else{
            categoryDetails.category=category;
            categoryDetails.description=description;
            categoryDetails.bgColor=backgroundColor;
            const uploadData =async ()=>{
                const response = await CategoryService.addCategory(categoryDetails,image);
                if(response.statusCode === 200){
                    setError("Added SuccessFully..!!");
                    setTimeout(()=>{
                        setError('');
                    },5000);
                }
            }
            uploadData();
        }
    }




        const handleSearch = (e) =>{
        setSearchText(e.target.value);
        if(searchText.trim() !== ''){
                filterCategories(searchText);
        }else{
            setFilteredCategories(categories);
        }
    }

    const filterCategories =(searchText) =>{
        const filtered = categories.filter((category) =>
            category.includes(searchText)
        );

        setFilteredCategories(filtered);
        console.log("Filtered : ",filtered);
    }

        */

