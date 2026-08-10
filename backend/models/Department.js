import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Department name is required."],
            trim: true,
            unique: true,
            minlength: [2, "Department name must be at least 2 characters."],
            maxlength: [100, "Department name cannot exceed 100 characters."]
        },

        code: {
            type: String,
            required: [true, "Department code is required."],
            trim: true,
            uppercase: true,
            unique: true,
            minlength: [2, "Department code must be at least 2 characters."],
            maxlength: [10, "Department code cannot exceed 10 characters."]
        },

        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: [100, "Description cannot exceed 100 characters."]
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    },
    {
        timestamps: true
    }
);



const Department = mongoose.model("Department", departmentSchema);

export default Department;
