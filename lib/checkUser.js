import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const name = `${user.firstName} ${user.lastName}`;
    const username = name.split(" ").join("-") + user.id.slice(-4);

    // Get the client instance
    const client = await clerkClient();
    
    await client.users.updateUser(user.id, {
      username: username,
    });

    // Use upsert to handle both create and update cases
    const loggedInUser = await db.user.upsert({
      where: {
        clerkUserId: user.id,
      },
      update: {
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username: username,
      },
      create: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username: username,
      },
    });

    return loggedInUser;
  } catch (error) {
    console.error('Error in checkUser:', error);
    return null;
  }
};