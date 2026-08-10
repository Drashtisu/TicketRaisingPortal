import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required."],
            trim: true,
            minlength: [2, "Category name must be at least 2 characters."],
            maxlength: [100, "Category name cannot exceed 100 characters."]
        },

        code: {
            type: String,
            required: [true, "Category code is required."],
            trim: true,
            uppercase: true,
            minlength: [2, "Category code must be at least 2 characters."],
            maxlength: [10, "Category code cannot exceed 10 characters."]
        },

        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: [500, "Description cannot exceed 500 characters."]
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: [true, "Department is required."]
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




categorySchema.index({ name: 1 });

categorySchema.index({ department: 1 });




categorySchema.index(
    {
        name: 1,
        department: 1
    },
    {
        unique: true
    }
);


categorySchema.index(
    {
        code: 1
    },
    {
        unique: true
    }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
