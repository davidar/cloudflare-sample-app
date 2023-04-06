import gprompt from './gprompt.txt';

export async function callChatGPT(message, env) {
  const apiKey = env.OPENAI_API_KEY;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const messages = [
    {
      role: 'system',
      content: gprompt,
    },
    {
      role: 'user',
      content: message,
    },
  ];

  const body = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: messages,
  });
  console.log(body);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body
  });

  const data = await response.json();
  console.log(JSON.stringify(data));

  return data.choices[0].message.content;
}
