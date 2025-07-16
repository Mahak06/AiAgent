import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
// import { tool } from 'ai';
// import { getGradeData } from './tools';

export const generatImageDescription = async (imageBase64: string) => {
    try {
        const {response} = await generateText({
            model: google('gemini-1.5-flash'),
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Describe this image in a witty bollywood style: As Karan Johar hosting "Koffee with Karan" with superstars as guest. The description should be in 4 line and should be witty with dark jokes.',
                  },
                  {
                    type: 'image',
                    image: imageBase64,
                  }
                ]
              }
            ]
          });
          return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

//using tool
// export const fetchResumeDetails = async () => {
//     try{
      
//       const {response} = await generateText({
//         model: google('gemini-1.5-flash'),
//         system: 'You are a helpful assistant who provides detailed information about student grades and performance. To get a student\'s grades, use the gradeTool with the student\'s name as a parameter.',
//         prompt: 'Use the gradeTool with name="John Smith" to get their grades and provide a detailed analysis of their performance.',
//         tools: {gradeTool: getGradeData},
//         maxSteps: 4,
//       });
//       return response;
//     }
//     catch(error){
//       console.log(error);
//       return "Unable to fetch"
//     }
// }

