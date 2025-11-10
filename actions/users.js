"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUserName(username) {
    const { userId } = await auth();
    
    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Trim username from start
    const trimmedUsername = username.trim();

    // Validation
    if (!trimmedUsername || trimmedUsername.length < 3) {
        throw new Error("Username must be at least 3 characters");
    }

    // Check if username already exists
    const existingUsername = await db.user.findUnique({
        where: { username: trimmedUsername },
    });

    // clerkUserId se compare karo, id se nahi
    if (existingUsername && existingUsername.clerkUserId !== userId) {
        throw new Error("Username already taken");
    }

    try {
        //  STEP 1: Pehle Clerk update karo
        const clerk = await clerkClient();
        await clerk.users.updateUser(userId, { 
            username: trimmedUsername 
        });

        //  STEP 2: Phir Database update karo (sirf ek baar)
        await db.user.update({
            where: { clerkUserId: userId },
            data: { username: trimmedUsername },
        });


        return { success: true, username: trimmedUsername };

    } catch (error) {
        console.error(" Update error:", error);
        throw new Error(error.message || "Failed to update username");
    }
}