import Ticket from "../models/Ticket.js";

const generateTicketNumber = async () => {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const date = `${year}${month}${day}`;

    
    const todayStart = new Date(year, now.getMonth(), now.getDate());

    const todayEnd = new Date(year, now.getMonth(), now.getDate() + 1);

    const count = await Ticket.countDocuments({
        createdAt: {
            $gte: todayStart,
            
            $lt: todayEnd
        }
    });

    const serial = String(count + 1).padStart(6, "0");

    return `TKT-${date}-${serial}`;
};

export default generateTicketNumber;