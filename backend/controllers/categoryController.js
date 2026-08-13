import mongoose from "mongoose";

import Category from "../models/Category.js";
import Department from "../models/Department.js";
import Ticket from "../models/Ticket.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";



export const createCategory = asyncHandler(async (req, res) => {

  
    const {
        name,
        code,
        description,
        department
    } = req.body;

  

    if (!name || !code || !department) {

        throw new ApiError(
            400,
            "Category name, code and department are required."
        );

    }

  

    if (!mongoose.Types.ObjectId.isValid(department)) {

        throw new ApiError(
            400,
            "Invalid Department ID."
        );

    }

  

    const categoryName = name.trim().replace(/\s+/g, " ");

    const categoryCode = code.trim().toUpperCase();

    const categoryDescription = description?.trim() || "";



    const existingDepartment = await Department.findById(department);

    if (!existingDepartment) {

        throw new ApiError(
            404,
            "Department not found."
        );

    }

   

    const existingCategoryName = await Category.findOne({

        name: {
            $regex: `^${categoryName}$`,
            $options: "i"
        },

        department

    });

    if (existingCategoryName) {

        throw new ApiError(
            409,
            "Category name already exists in this department."
        );

    }

  

    const existingCategoryCode = await Category.findOne({

        code: categoryCode

    });

    if (existingCategoryCode) {

        throw new ApiError(
            409,
            "Category code already exists."
        );

    }

   

    const category = await Category.create({

        name: categoryName,

        code: categoryCode,

        description: categoryDescription,

        department,

        createdBy: req.user._id

    });

  

    await category.populate([
        {
            path: "department",
            select: "name code"
        },
        {
            path: "createdBy",
            select: "name email"
        }
    ]);

  

    return res.status(201).json(

        new ApiResponse(

            201,

            "Category created successfully.",

            category

        )

    );

});



export const getCategories = asyncHandler(async (req, res) => {

   

    let {

        page = 1,

        limit = 10,

        search = "",

        department,

        status,

        sortBy = "createdAt",

        order = "desc"

    } = req.query;

  
    page = Number(page);

    limit = Number(limit);

   

    if (page < 1) page = 1;

    if (limit < 1) limit = 10;

    if (limit > 100) limit = 100;

   
    const skip = (page - 1) * limit;

   

    const query = {};

  

    if (search) {

        query.$or = [

            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                code: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }

        ];

    }

   

    if (department) {

        if (!mongoose.Types.ObjectId.isValid(department)) {

            throw new ApiError(
                400,
                "Invalid Department ID."
            );

        }

        query.department = department;

    }

  
    if (status) {

        const validStatuses = [

            "Active",

            "Inactive"

        ];

        if (!validStatuses.includes(status)) {

            throw new ApiError(
                400,
                "Invalid category status."
            );

        }

        query.status = status;

    }

   

    const allowedSortFields = [

        "name",

        "code",

        "status",

        "createdAt",

        "updatedAt"

    ];

    if (!allowedSortFields.includes(sortBy)) {

        sortBy = "createdAt";

    }

    

    const sort = {

        [sortBy]: order === "asc" ? 1 : -1

    };

   


const totalCategories = await Category.countDocuments(query);



const categories = await Category.find(query)

    .populate(
        "department",
        "name code"
    )

    .populate(
        "createdBy",
        "name email"
    )

    .sort(sort)

    .skip(skip)

    .limit(limit);



const totalPages = Math.ceil(totalCategories / limit);



return res.status(200).json(

    new ApiResponse(

        200,

        "Categories fetched successfully.",

        {

            categories,

            pagination: {

                totalCategories,

                totalPages,

                currentPage: page,

                limit,

                hasNextPage: page < totalPages,

                hasPreviousPage: page > 1

            }

        }

    )

);

});


export const getCategoryById = asyncHandler(async (req, res) => {

  

    const { id } = req.params;

   

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new ApiError(
            400,
            "Invalid Category ID."
        );

    }


    const category = await Category.findById(id)

        .populate(
            "department",
            "name code"
        )

        .populate(
            "createdBy",
            "name email role"
        );


    if (!category) {

        throw new ApiError(
            404,
            "Category not found."
        );

    }

    
    return res.status(200).json(

        new ApiResponse(

            200,

            "Category fetched successfully.",

            category

        )

    );

});




export const updateCategory = asyncHandler(async (req, res) => {


    const { id } = req.params;

 
    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new ApiError(
            400,
            "Invalid Category ID."
        );

    }

    

    const category = await Category.findById(id);

   

    if (!category) {

        throw new ApiError(
            404,
            "Category not found."
        );

    }

   

    const {
        name,
        code,
        description,
        department,
        status
    } = req.body;

   

    const categoryName =
        name?.trim().replace(/\s+/g, " ");

    const categoryCode =
        code?.trim().toUpperCase();

    const categoryDescription =
        description?.trim();

   

    if (department !== undefined) {

        if (!mongoose.Types.ObjectId.isValid(department)) {

            throw new ApiError(
                400,
                "Invalid Department ID."
            );

        }

        const existingDepartment = await Department.findById(department);

        if (!existingDepartment) {

            throw new ApiError(
                404,
                "Department not found."
            );

        }

    }

   


  

if (categoryName) {

    const existingCategoryName = await Category.findOne({

        name: {
            $regex: `^${categoryName}$`,
            $options: "i"
        },

        department: department || category.department,

        _id: {
            $ne: category._id
        }

    });

    if (existingCategoryName) {

        throw new ApiError(
            409,
            "Category name already exists in this department."
        );

    }

}



if (categoryCode) {

    const existingCategoryCode = await Category.findOne({

        code: categoryCode,

        _id: {
            $ne: category._id
        }

    });

    if (existingCategoryCode) {

        throw new ApiError(
            409,
            "Category code already exists."
        );

    }

}




if (categoryName !== undefined) {

    category.name = categoryName;

}


if (categoryCode !== undefined) {

    category.code = categoryCode;

}



if (description !== undefined) {

    category.description = categoryDescription;

}



if (department !== undefined) {

    category.department = department;

}



if (status !== undefined) {

    const validStatuses = [

        "Active",

        "Inactive"

    ];

    if (!validStatuses.includes(status)) {

        throw new ApiError(
            400,
            "Invalid category status."
        );

    }

    category.status = status;

}




await category.save();



await category.populate([
    {
        path: "department",
        select: "name code"
    },
    {
        path: "createdBy",
        select: "name email role"
    }
]);



return res.status(200).json(

    new ApiResponse(

        200,

        "Category updated successfully.",

        category

    )

);
});





export const deleteCategory = asyncHandler(async (req, res) => {

  

    const { id } = req.params;

  

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new ApiError(
            400,
            "Invalid Category ID."
        );

    }

    const category = await Category.findById(id);

   

    if (!category) {

        throw new ApiError(
            404,
            "Category not found."
        );

    }

    const hasTickets = await Ticket.exists({ category: category._id });

    if (hasTickets) {
        throw new ApiError(
            400,
            "Category cannot be deleted because it is assigned to one or more tickets."
        );
    }

    await category.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, "Category deleted successfully.", null)
    );

});
