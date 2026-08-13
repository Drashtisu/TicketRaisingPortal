import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        ticketNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: 150
        },

        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true
        },

        attachment: {
            type: String,
            default: ""
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
        },

        assignedAgent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        priority: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High",
                "Critical"
            ],
            default: null
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Assigned",
                "In Progress",
                "Resolved",
                "Closed",
                "Rejected",
                "Reopened"
            ],
            default: "Pending"
        },

        resolution: {
            type: String,
            default: ""
        },

        workLogs: [{
            message: {
                type: String,
                required: true,
                trim: true,
                maxlength: 1000
            },
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],

        startedAt: {
            type: Date,
            default: null
        },

        resolvedAt: {
            type: Date,
            default: null
        },

        reopenedCount: {
            type: Number,
            default: 0
        },

        closedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
