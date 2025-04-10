const SERVER_URL = 'http://localhost:3000';

export type PromptResult = { success: true, response: string } | { success: false, error: string }

export async function sendTextPrompt(taskCode: string, userInput: string): Promise<PromptResult> {
  // console.log('prompting...')
  
  const response = await fetch(`${SERVER_URL}/text/${taskCode}`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ userInput }),
    headers: {
      "Content-Type": "application/json",
    }
  }).then(response => response.json())

  console.log('prompting done!')

  return { success: true, response: response.text };
}

export async function sendImagePrompt(taskCode: string, imageB64: string): Promise<PromptResult> {
  console.log('image prompting...')

  const response = await fetch(`${SERVER_URL}/image/${taskCode}`, {
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