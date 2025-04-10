const SERVER_URL = 'http://localhost:3000';

export type PromptResult = { success: true, response: string } | { success: false, error: string }

export async function testPrompt(): Promise<PromptResult> {
  console.log('prompting...')
  
  const response = await fetch(`${SERVER_URL}`, {
    method: 'POST',
    mode: 'cors',
    // credentials: 'include',
  }).then(response => response.json())

  console.log('prompting done!')

  return { success: true, response: response.text };
}

export async function testImagePrompt(imageB64: string): Promise<PromptResult> {
  console.log('image prompting...')

  const response = await fetch(`${SERVER_URL}/image`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ imageB64 }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json());

  console.log('mage prompting done!');

  return { success: true, response: response.text }
}