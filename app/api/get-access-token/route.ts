const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export async function POST() {
  try {
    console.log("API Key exists:", !!HEYGEN_API_KEY);
    console.log("API Key length:", HEYGEN_API_KEY?.length);

    if (!HEYGEN_API_KEY) {
      console.error("API key is missing!");
      return new Response("API key is missing", {
        status: 500,
      });
    }

    const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    console.log("Base URL:", baseApiUrl);

    const url = `${baseApiUrl}/v1/streaming.create_token`;
    console.log("Fetching token from:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": HEYGEN_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", res.status);
    console.log("Response ok:", res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API error response:", errorText);
      return new Response(`HeyGen API error: ${res.status} - ${errorText}`, {
        status: res.status,
      });
    }

    const data = await res.json();
    console.log("Token received successfully");

    if (!data?.data?.token) {
      console.error("No token in response:", data);
      return new Response("No token in API response", {
        status: 500,
      });
    }

    return new Response(data.data.token, {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return new Response(`Failed to retrieve access token: ${error}`, {
      status: 500,
    });
  }
}
