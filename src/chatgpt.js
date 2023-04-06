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
  console.log(body);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body
  });

  let line = '';

  const parser = createParser(event => {
    if (event.type === 'event' && event.data !== '[DONE]') {
      const response = JSON.parse(event.data);
      const { choices } = response;
      const [choice] = choices;
      const { delta, finish_reason } = choice;
  
      if (finish_reason === null && 'content' in delta) {
        const { content } = delta;
        line += content;
        if (line.length > 0 && line.split('').some(char => '.!?,;:)\n'.includes(char))) {
          callback(line);
          line = '';
        }
      }
    }
  });
  const reader = response.body?.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const res = await reader.read();
    if (res.done) break;

    const textChunk = decoder.decode(res.value, { stream: true });
    parser.feed(textChunk);
  }
}
