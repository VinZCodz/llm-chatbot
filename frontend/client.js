let configurations = "";

fetch('./config.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(config => {
        configurations = config;
    })
    .catch(error => console.error('Failed to load configuration:', error));

const postChat = async (message) => {
    const response = await fetch(`${configurations.baseUrl}/v1/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
    });
    return response.json();
};
