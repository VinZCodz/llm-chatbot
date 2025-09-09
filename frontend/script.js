let inputMsg = document.querySelector('#input-msg');
const chatContainer = document.querySelector('#chat-container');
const sendBtn = document.querySelector('#send');

const generate = async (text) => {
    const userDiv = document.createElement('div');
    userDiv.className = 'flex justify-end';

    const msgDiv = document.createElement('div');
    msgDiv.className = 'bg-blue-600 text-white rounded-xl rounded-br-none p-4 shadow-lg max-w-lg';
    msgDiv.textContent = text;

    userDiv.appendChild(msgDiv);
    chatContainer.appendChild(userDiv);
    inputMsg.value = '';

    let llmResponse = "Replying...";
    await postChat(text)
        .then(response => {
            llmResponse = response.message; // JSON data returned from the server
        })
        .catch(error => {
            console.error('Error:', error);
            llmResponse = "Server Offline! Please try again after sometime."
        });

    const aiDiv = document.createElement('div');
    aiDiv.className = 'flex justify-start';

    const responseDiv = document.createElement('div');
    responseDiv.className = 'bg-zinc-700 text-gray-100 rounded-xl rounded-tl-none p-4 shadow-lg max-w-lg';
    responseDiv.textContent = llmResponse;

    aiDiv.appendChild(responseDiv);
    chatContainer.appendChild(aiDiv);
}

const handleEnter = async (e) => {
    if (e.key == 'Enter') {
        const text = inputMsg?.value.trim();
        if (!text)
            return;
        await generate(text);
    }
}

const handleClick = async (e) => {
    const text = inputMsg?.value.trim();
    if (!text)
        return;
    await generate(text);
}

inputMsg?.addEventListener('keyup', handleEnter);
sendBtn?.addEventListener('click', handleClick);