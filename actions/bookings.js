
export async function createBooking(bookingData) {
    try {
        const event = await db.event.findunique({
            where: { id: bookingData.eventId },
            include: { user: true },
        });
        if (!event) {
            throw new Error("Event not found");
        }

        // use google calender to generate  meet link and add event to host calender
    } catch (error) {
        
    }
}