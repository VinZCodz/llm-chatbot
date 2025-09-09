import Groq from "groq-sdk";
import { tools, availableFunctions } from './toolsHelper.js';
import fs from "fs/promises";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const instructions = await fs.readFile("systemPrompt.txt", "utf-8");
const messages = [{ "role": "system", "content": instructions }];

const invokeLLM = async () =>
    await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: messages,
        tools: tools,
        tool_choice: "auto"
    });

export const runLLMClient = async (userMsg) => {
    try {
        messages.push({ "role": "user", "content": userMsg });

        const response = await invokeLLM();
        const responseMessage = response.choices[0].message;

        if (!responseMessage.tool_calls)
            return responseMessage.content;
        else {
            const toolCalls = responseMessage.tool_calls || [];

            messages.push(responseMessage);

            //Boiler Plate for tool calling. 
            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionToCall = availableFunctions[functionName];
                const functionArgs = JSON.parse(toolCall.function.arguments);
                const functionResponse = await functionToCall?.(functionArgs.query);

                //Boiler Plate for passing back. 
                if (functionResponse) {
                    messages.push({
                        role: "tool",
                        content: functionResponse,
                        tool_call_id: toolCall.id,
                    });
                }
            }
            
            //Boiler Plate for passing back. 
            const finalResponse = await invokeLLM();

            return finalResponse.choices[0].message.content;
        }

    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
};