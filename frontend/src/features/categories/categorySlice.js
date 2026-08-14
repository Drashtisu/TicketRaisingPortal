import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../api/categoryApi';




const initialState ={items :[],loading:false , error :""}


export  const fetchCategories =createAsyncThunk('/categories',async (params ={},thunkAPI)=>{
try{
 const  response = await getCategories(params);
 return  response.data.data.categories;
}
catch(error){
    return thunkAPI.rejectWithValue(error.response?.data?.message || "falied  to fetch  categories")
  }
});


export  const addCategory = createAsyncThunk('/categories/add', async(paylaod,thunkAPI)=>{
    try{
   const  response =await  createCategory(paylaod);
    return  response.data.data;
    }
    catch(error){
        return  thunkAPI.rejectWithValue(error.response?.data?.message || "failed  to create  category")
  }
});


export const  editCategory =createAsyncThunk ('/categories/edit',async ({id,paylaod} ,thunkAPI)=>{
    try{
        const  response =await updateCategory(id,paylaod)
        return  response.data.data
    }
    catch(error){
   return  thunkAPI.rejectWithValue(error.response?.data?.message || "failed  to edit  category")
  }
})

export const  removeCategory =createAsyncThunk('/categories/remove' ,async ({id,paylaod} ,thunkAPI)=>{
    try{

         await  deleteCategory();
        return id
    }
    catch(error){
        return  thunkAPI.rejectWithValue(error.response?.data?.message || "failed  to remove  category")
  }
})


const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.items = state.items.map((item) => item._id === action.payload._id ? action.payload : item);
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  }
});

export default categorySlice.reducer;
