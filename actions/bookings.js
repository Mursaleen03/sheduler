"use server";

import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";

export async function createBooking(bookingData) {
  try {
    // Fixed: use correct Prisma method name
    const event = await db.event.findUnique({
      where: { id: bookingData.eventId },
      include: { user: true },
    });
    if (!event) {
      throw new Error("Event not found");
    }

    // use google calendar api to generate meet link and add event to host calendar
    const clerkUserId = event.user.clerkUserId;
    console.log("Creating booking for event", event.id, "host", clerkUserId);

    // Get the client and retrieve OAuth token
    const client = await clerkClient();

    // Method 1: Try getUserOauthAccessToken if available
    let token;
    try {
      const oauthTokens = await client.users.getUserOauthAccessToken(
        clerkUserId,
        "oauth_google"
      );
      console.log("OAuth tokens response:", oauthTokens);
      token = oauthTokens?.[0]?.token || oauthTokens?.token;
    } catch (e) {
      console.log(
        "getUserOauthAccessToken failed:",
        e.message,
        "Full error:",
        e
      );
    }

    if (!token) {
      console.log(
        "No token found. User may not have connected Google Calendar. ClerkUserId:",
        clerkUserId
      );
      throw new Error(
        "Host has not connected their Google Calendar. Please connect your Google Calendar in settings."
      );
    }

    // set up google OAuth client
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: token });
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const meetResponse = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `${bookingData.name} - ${event.title}`,
        description: bookingData.additionalInfo,
        start: { dateTime: bookingData.startTime },
        end: { dateTime: bookingData.endTime },
        attendees: [{ email: bookingData.email }, { email: event.user.email }],
        conferenceData: {
          createRequest: { requestId: `${event.id}-${Date.now()}` },
        },
      },
    });

    const meetLink = meetResponse?.data?.hangoutLink;
    const googleEventId = meetResponse?.data?.id;

    if (!meetLink) {
      console.warn("No meet link returned from Google API", meetResponse?.data);
    }

    const booking = await db.booking.create({
      data: {
        eventId: event.id,
        userId: event.userId || event.user.id,
        name: bookingData.name,
        email: bookingData.email,
        startTime: new Date(bookingData.startTime),
        endTime: new Date(bookingData.endTime),
        additionalInfo: bookingData.additionalInfo,
        meetLink: meetLink || "",
        googleEventId,
      },
    });

    return { success: true, booking, meetLink };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: error.message };
  }
}
