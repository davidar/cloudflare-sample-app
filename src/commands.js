/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

export const AWW_COMMAND = {
  name: 'awwww',
  description: 'Drop some cuteness on this channel.',
};

export const INVITE_COMMAND = {
  name: 'invite',
  description: 'Get an invite link to add the bot to your server',
};

export const CHAT_COMMAND = {
  name: 'chat',
  description: 'Chat with the AI.',
  options: [
    {
      name: 'message',
      type: 3, // String
      description: 'The message you want to send to the AI.',
      required: true,
    },
  ],
};
