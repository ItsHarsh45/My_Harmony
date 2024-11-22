const HF_TOKEN = "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"; // Replace with your token

export async function generateImage(prompt: string): Promise<Blob> {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.blob();
}