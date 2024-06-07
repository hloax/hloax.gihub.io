const chatInput = document.querySelector('.chat-input textarea');
const sendBtn = document.querySelector('.chat-input span');
const chatbox = document.querySelector('.chatbox');

let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://hloax.pythonanywhere.com/chat";
    const messageElement = incomingChatLi.querySelector('p');

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: [{ role: 'user_input', content: userMessage }]
        })
    }

    console.log("Sending request with options:", requestOptions);

    fetch(API_URL, requestOptions)
        .then(res => {
            console.log("Response headers:", res.headers);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            const responseText = data.response;
            messageElement.textContent = responseText;
            console.log(data);
        })
        .catch((error) => {
            console.error("Error during fetch:", error);
            messageElement.textContent = "Sorry I had a problem on my side, please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    //generateResponse(incomingChatL);
    setTimeout(() => {
        let incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

sendBtn.addEventListener('click', handleChat);
