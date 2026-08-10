import mongoose from "mongoose";
import Department from "../models/Department.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



export const createDepartment = asyncHandler(async (req, res) => {
 const {
        name,
        code,
        description
    } = req.body;



    if (!name || !code) {

        throw new ApiError(
            400,
            "Department name and code are required."
        );

    }



    const departmentName = name.trim();
    const departmentCode = code.trim().toUpperCase();

  
    const existingDepartmentName = await Department.findOne({
        name: {
            $regex: `^${departmentName}$`,
            $options: "i"
        }
    });

    if (existingDepartmentName) {

        throw new ApiError(
            409,
            "Department name already exists."
        );

    }

    

    const existingDepartmentCode = await Department.findOne({
        code: departmentCode
    });

    if (existingDepartmentCode) {

        throw new ApiError(
            409,
            "Department code already exists."
        );

    }

  

    const department = await Department.create({

        name: departmentName,

        code: departmentCode,

        description: description?.trim() || "",

        createdBy: req.user._id

    });

 

    return res.status(201).json(

        new ApiResponse(

            201,

            "Department created successfully.",

            department

        )

    );

});



export const getDepartments = asyncHandler(async (req, res) => {

  

    let {

        

        status,

        sortBy = "createdAt",

        order = "desc"

    } = req.query;

   

   
   

    const query = {};

   

  


    if (status) {

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



   


const totalDepartments = await Department.countDocuments(query);



const departments = await Department.find(query)

    .populate(
        "createdBy",
        "name email"
    )

    .sort(sort)

    .skip(skip)

    .limit(limit);







return res.status(200).json(

    new ApiResponse(

        200,

        "Departments fetched successfully.",

        {

            departments,

            pagination: {

                totalDepartments,

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


export const getDepartmentById = asyncHandler(async (req, res) => {

   

    const { id } = req.params;

   
    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new ApiError(
            400,
            "Invalid Department ID."
        );

    }

  
    const department = await Department.findById(id)

        .populate(
            "createdBy",
            "name email role"
        );

   

    if (!department) {

        throw new ApiError(
            404,
            "Department not found."
        );

    }

    

    return res.status(200).json(

        new ApiResponse(

            200,

            "Department fetched successfully.",

            department

        )

    );

});



export const updateDepartment = asyncHandler(async (req, res) => {

   

    const { id } = req.params;

 

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new ApiError(
            400,
            "Invalid Department ID."
        );

    }


    const department = await Department.findById(id);


    if (!department) {

        throw new ApiError(
            404,
            "Department not found."
        );

    }

   

    const {
        name,
        code,
        description,
        status
    } = req.body;

  

    const departmentName =
        name?.trim().replace(/\s+/g, " ");

    const departmentCode =
        code?.trim().toUpperCase();

    const departmentDescription =
        description?.trim();

   

    if (departmentName) {

    const existingDepartmentName = await Department.findOne({

        name: {
            $regex: `^${departmentName}$`,
            $options: "i"
        },

        _id: {
            $ne: department._id
        }

    });

    if (existingDepartmentName) {

        throw new ApiError(
            409,
            "Department name already exists."
        );

    }

}


if (departmentCode) {

    const existingDepartmentCode = await Department.findOne({

        code: departmentCode,

        _id: {
            $ne: department._id
        }

    });

    if (existingDepartmentCode) {

        throw new ApiError(
            409,
            "Department code already exists."
        );

    }

}



if (departmentName) {

    department.name = departmentName;

}



if (departmentCode) {

    department.code = departmentCode;

}



if (departmentDescription !== undefined) {

    department.description = departmentDescription;

}



if (status !== undefined) {

    const validStatuses = [

        "Active",

        "Inactive"

    ];

    if (!validStatuses.includes(status)) {

        throw new ApiError(
            400,
            "Invalid department status."
        );

    }

    department.status = status;

}



await department.save();



await department.populate(
    "createdBy",
    "name email role"
);



return res.status(200).json(

    new ApiResponse(

        200,

        "Department updated successfully.",

        department

    )

);

});




export const deleteDepartment = asyncHandler(async (req, res) => {

  

    const { id } = req.params;

   

    if (!mongoose.Types.ObjectId.isValid(id)) {

        throw new ApiError(
            400,
            "Invalid Department ID."
        );

    }

   

    const department = await Department.findById(id);

   

    if (!department) {

        throw new ApiError(
            404,
            "Department not found."
        );

    }

   
   await department.deleteOne();
   return res.status(200).json(

    new ApiResponse(

        200,

        "Department deleted successfully.",

        null

    )

);

});