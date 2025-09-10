import NodeCache from "node-cache";
import fs from "fs/promises";

const myCache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // Cache items for 1 day.
const instructions = await fs.readFile("systemPrompt.txt", "utf-8");

export const getCachedData = async (key) => {
    let value = myCache.get(key);
    if (value) {
        console.log(`Cache hit for key: ${key}`);
        return value;
    }

    console.log(`Cache miss for key: ${key}, inserting new data: system prompt.`);
    value = [{ "role": "system", "content": instructions }]; //System prompt as first message.
    myCache.set(key, value);
    return value;
}

export const updateCacheData = async (key, data) => myCache.set(key, data);