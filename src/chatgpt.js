import { createParser } from 'eventsource-parser';
import gprompt from './gprompt.txt';

export async function callChatGPT(message, env, callback) {
  const apiKey = env.OPENAI_API_KEY;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const messages = [
    {
      role: 'system',
      content: 'A helpful discord bot.' //gprompt,
    },
    {
      role: 'user',
      content: message,
    },
  ];

  const body = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: messages,
    stream: true,
  });

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body
  });

  const parser = createParser(event => {
    if (event.type === 'event' && event.data !== '[DONE]') {
      const response = JSON.parse(event.data);
      const { choices } = response;
      const [choice] = choices;
      const { delta, finish_reason } = choice;
      if (finish_reason === null && 'content' in delta) {
        const { content } = delta;
        callback(content);
      }
    }
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const res = await reader.read();
    if (res.done) break;
    parser.feed(decoder.decode(res.value, { stream: true }));
  }
}
