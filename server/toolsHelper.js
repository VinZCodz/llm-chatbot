import { tavily } from "@tavily/core";

const tvly = new tavily({ apiKey: process.env.TVLY_API_KEY, max_results: 1});

export const getSearchResults = async (query) => {
    const response = await tvly.search(`${query}`);
    return response.results.map(_=>_.content).join("\n");
}

//Boiler Plate for tool declaration. 
export const tools = [
    {
        "type": "function",
        "function": {
            "name": "getSearchResults",
            "description": "Get the real time search results for the user queries",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The user query",
                    }
                },
                "required": ["query"],
            },
        },
    },
];

export const availableFunctions = {
    getSearchResults,
};