import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export const generate_text_ai = async ({system,messages,prompt}:{system:string,messages?:any[],prompt?:string}):Promise<string> => {
    const {response} = await generateText({
        model: google('gemini-1.5-flash'),
        system:system,
        messages: messages ? messages :undefined,
        prompt: prompt ? prompt : undefined
      });
      
      // Extract text content similar to image upload
      const message:any = response?.messages?.[0];
      return message.content[0].text
}

