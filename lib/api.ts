import { ChatMode } from "@/components/chatUI/chatBar";
import { paths } from "@/documentation/api/schema";
import createClient from "openapi-fetch";

const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
});

export function getUserFromLocalStorage() {
  return JSON.parse(localStorage.getItem("user") as string);
}

/**
 * Sends an authentication request to the server with the provided destination and sends the magic link to the user.
 * @param destination - The destination to authenticate with.
 * @returns A Promise that resolves to the response from the authentication request, or null if an error occurs.
 */
export async function auth(destination: string) {
  try {
    const response = await client.POST("/auth", {
      body: { destination: destination },
    });
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Performs a callback request to the server with the provided token.
 * @param token - The token to be included in the request.
 * @returns A Promise that resolves to the response from the server, or null if an error occurs.
 */
export async function callback(token: string) {
  try {
    const response = await client.GET("/auth/callback", {
      params: { query: { token: token } },
    });
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Refreshes the access token using the refresh token.
 * @param {string} accessToken - The current access token.
 * @param {string} refreshToken - The refresh token.
 * @returns {Promise<any>} - The response from the server.
 */
export async function refreshTokens(accessToken: string, refreshToken: string) {
  try {
    const response = await client.POST("/auth/refresh", {
      body: {
        refreshToken: accessToken,
        accessToken: refreshToken,
      },
    });
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUser(email: string) {
  try {
    const response = await client.GET(`/users/${email}` as any);
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Updates a user with the specified ID.
 * @param {string} id - The ID of the user to update.
 * @param {any} data - The data to update the user with.
 * @returns {Promise<any>} - A promise that resolves to the response from the server, or null if an error occurs.
 */
export async function updateUser(id: string, data: any) {
  try {
    const response = await client.POST(`/users/${id}` as any, {
      body: data,
    });
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function initPayment(firstName: string, email: string, duration: "monthly" | "yearly" | "halfYearly") {
  if (!getUserFromLocalStorage()) {
    return null;
  }
  try {
    const response = await client.POST("/payments", {
      body: {
        firstName: firstName,
        email: email,
        userId: getUserFromLocalStorage().id,
        duration: duration
      },
    });
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function verifyPayment(ref: string) {
  try {
    const response = await client.GET("/payments/verify", {
      params: { query: { paymentId: ref } },
    });
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Sets the Api_key of Dify according to the user's field of Study
 * @param field - The user's field of study
 * @returns A Promise that resolves to the response from the server, or null if an error occurs.
 */
export async function setApiKey(field: string) {
  try {
    const response = await client.POST(`/chat/setAPIKey/${field}` as any);

    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * gets the user's conversations
 * @param userId - The user's id
 * @returns A Promise that resolves to the response from the server, or null if an error occurs.
 */
export async function getConversations(): Promise<any> {
  if (!getUserFromLocalStorage()) {
    return null;
  }
  try {
    const response = await client.GET(
      `/chat/conversations/${getUserFromLocalStorage().id}` as any
    );

    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}
/**
 * gets the user's conversations
 * @param action - Specify whether NewChat or ContinueChat
 * @param userId - The user's id
 * @param query - The user's prompt
 * @returns A Promise that resolves to the response from the server, or null if an error occurs.
 */
export async function chatWithAlexis(
  action: string,
  userId: string,
  query: string,
  uploadedFiles: any[] | null,

  mode: ChatMode | null,
  conversation_id?: string
): Promise<any> {
  const response = await client.POST(`/chat/${action}` as any, {
    body: {
      user: userId,
      query: query,
      uploadedFiles: uploadedFiles,

      mode: mode,
      conversation_id: conversation_id,
    },
  });

  return response.data[response.data?.length - 3];
}

export async function getConversationMessages(
  conversation_id: string
): Promise<any> {
  if (!getUserFromLocalStorage()) {
    return [];
  }
  const response = await client.GET(
    `/chat/conversations/${getUserFromLocalStorage().id
    }/${conversation_id}` as any
  );

  return response.data;
}

export async function rateAlexisResponse(
  userId: string,
  message_id: string,
  rating: string | null
): Promise<any> {
  const response = await client.POST(
    `/chat/conversations/response/rating` as any,
    {
      body: {
        user: userId,
        message_id: message_id,
        rating: rating,
      },
    }
  );

  return response.data;
}

export async function showMoreOrLessDetails(
  userId: string,
  conversation_id: string,
  message: string,
  preference: string | null
): Promise<any> {
  const response = await client.POST(
    `/chat/conversations/response/details` as any,
    {
      body: {
        user: userId,
        conversation_id: conversation_id,
        message: message,
        preference: preference,
      },
    }
  );
  return response.data[response.data?.length - 3];
}

export async function regenerateResponse(
  userId: string,
  conversation_id: string,
  message: string
): Promise<any> {
  const response = await client.POST(
    `/chat/conversations/response/regenerate` as any,
    {
      body: {
        user: userId,
        conversation_id: conversation_id,
        message: message,
      },
    }
  );
  return response.data[response.data?.length - 3];
}

export async function uploadFileToDify(
  file: File,
  userId: string
): Promise<any> {
  try {
    const response = await client.POST(
      `/chat/conversations/file/upload` as any,
      {
        body: { file: file, user: userId },
        bodySerializer: (body) => {
          const formData = new FormData();
          formData.append("file", body.file);
          formData.append("user", body.user);

          return formData;
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function renameConversation(
  userId: string | undefined,
  conversation_id: string,
  name: string
): Promise<any> {
  const response = await client.POST(
    `/chat/conversations/${userId}/${conversation_id}/${name}` as any
  );
  if (!response.data.id) {
    throw new Error("error");
  }
  return response.data;
}

export async function deleteConversation(
  userId: string | undefined,
  conversation_id: string
): Promise<any> {

  const response = await client.DELETE(
    `/chat/conversations/${userId}/${conversation_id}` as any
  );

  return response;
}
