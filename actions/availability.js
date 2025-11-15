'use server'; 

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserAvailability() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: {
            availability: {
                include: { days: true },
            }
        }
    });

    if (!user || !user.availability) {
        return null
    }

    const availabilityData = {
        timeGap: user.availability.timeGap,
    };

    [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ].forEach((day) => {
        const dayAvailability = user.availability.days.find(d => d.day === days.toUpperCase());

        availabilityData[day] = {
            isAvailable: !!dayAvailability,
            startTime: dayAvailability ? dayAvailability.startTime.toISOString().slice(11,16) : "09:00",
            endTime: dayAvailability ? dayAvailability.startTime.toISOString().slice(11,16) : "17:00",
        }
    });

    return availabilityData
}

export async function updateAvailability(data) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: {
            availability: true,
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const availabilityData = Object.entries(data).flatMap(([day, {isAvailable, startTime, endTime}]) => {
        if(isAvailable) {
            const baseDate = new Date().toISOString().split("T")[0];
            return [
                {
                    day: day.toUpperCase(),
                    startTime: new Date(`${baseDate}T${startTime}`),
                    endTime: new Date(`${baseDate}T${startTime}`)
                }
            ]
        }
        return []
    });

    if(user.availability){
        await db.availability.update({
            where:{ id: user.availability.id },
            data: {
                timeGap: data.timeGap,
                days: {
                    deleteMany: {},
                    create: availabilityData,
                }
            }
        });
    } else {
        await db.availability.create({
            data: {
                userId: user.id,
                timeGap: data.timeGap,
                days: {
                    create: availabilityData,
                }
            }
        });
    }
    return { success: true };
}