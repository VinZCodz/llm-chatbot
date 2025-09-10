import Groq from "groq-sdk";
import { tools, availableFunctions } from './toolsHelper.js';
import { getCachedData, updateCacheData } from './cache.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const invokeLLM = async (messages) =>
    await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: messages,
        tools: tools,
        tool_choice: "auto"
    });

export const runLLMClient = async (userMsg, sessionId) => {
    try {
        const messages = await getCachedData(sessionId);
        messages.push({ "role": "user", "content": userMsg });
        
        const response = await invokeLLM(messages);
        const responseMessage = response.choices[0].message;

        if (!responseMessage.tool_calls){
            messages.push({ "role": "assistant", "content": responseMessage.content });
            await updateCacheData(sessionId, messages);
            return responseMessage.content;
        }
        else {
            const toolCalls = responseMessage.tool_calls || [];

            const toolMessages=[responseMessage];

            //Boiler Plate for tool calling. 
            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionToCall = availableFunctions[functionName];
                const functionArgs = JSON.parse(toolCall.function.arguments);
                const functionResponse = await functionToCall?.(functionArgs.query);

                //Boiler Plate for passing back. 
                if (functionResponse) {
                    toolMessages.push({
                        role: "tool",
                        content: functionResponse,
                        tool_call_id: toolCall.id,
                    });
                }
            }
            
            //Boiler Plate for passing back. 
            const finalResponse = await invokeLLM([...messages, ...toolMessages]);

            messages.push({ "role": "assistant", "content": finalResponse.choices[0].message.content });
            await updateCacheData(sessionId, messages);

            return finalResponse.choices[0].message.content;
        }

    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
};