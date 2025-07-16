// import fs from 'fs';
// import path from 'path';
// import dotenv from 'dotenv';
// import { google } from '@ai-sdk/google';
// import { cosineSimilarity, embed, embedMany, generateText } from 'ai';

// dotenv.config();

// export async function main(){
//     const db: {embedding: number[], text: string}[] = [];
//     const essay = fs.readFileSync(path.join(__dirname, 'essay.txt'), 'utf8');

//     const chunks = essay
//     .split('.')
//     .map(chunk => chunk.trim())
//     .filter(chunk => chunk.length > 0 && chunk !== '\n');
//     console.log("Number of chunks: ",chunks.length);

//     const {embeddings} = await embedMany({
//         model: google.textEmbeddingModel('text-embedding-004', {
//         outputDimensionality: 512,    
//         }),
//         values: chunks,
//     });

//     embeddings.forEach((e,i) => {
//         db.push({
//             embedding: e,
//             text: chunks[i],
//         })
//     });

//     const input = "What were the two main things the author worked on before college?";

//     const {embedding} = await embed({
//         model: google.textEmbeddingModel('text-embedding-004', {
//         outputDimensionality: 512,    
//         }),
//         value: input,
//     });

//     const context = db.map(item => ({
//         document: item,
//         similarity: cosineSimilarity(embedding, item.embedding),
//     }))
//     .sort((a,b) => b.similarity - a.similarity)
//     .slice(0, 3)
//     .map(r => r.document.text)
//     .join('\n');

//     const {response} = await generateText({
//         model: google('gemini-1.5-flash'),
//         system: `Answer the following question based only on the provided context:${context}. Do not include any additional explanation but it should include details of the answer.`,
//         prompt: input,
//     });
//     const content: any = response.messages[0].content[0];
//     console.log(content.text);
// }


