import { useEffect, useRef, useState } from "react";
import Chatboticon from "./Components/Chatboticon";
import ChatForm from "./Components/ChatForm";
import ChatMessage from "./Components/ChatMessage";
export const App = () => {
const VITE_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

 const [ChatHistory, setChatHistory] = useState([]);
 const [showChatbot, setShowChatbot] = useState(false);
 const chatbodyref = useRef()
  const GenerateBotResponse = async(history)=>{
    // helper function to update chat history
    const updateHistory = (text) =>{
      
    setChatHistory((prev) =>[...prev.filter(msg => msg.text !=="thinking..."),{role : 'model',text}]);
    };
  history = history.map(item => ({
  role: item.role,
  parts: [{ text: item.text }]
}));

     const requestOptions = {

      method: "POST",
      headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": "AIzaSyBs3YD7xZSft9StZBPmVNKMUZ4e3SonDrI"
                  },
      // header: {'Content-Type':'application/json'},
      body: JSON.stringify({contents:history})
    }
  try{
    // make the api call to get the bots response
    const response = await fetch(VITE_API_URL,requestOptions);
    const data = await response.json();
    if(!response.ok)throw new Error(data.error.message || "something went worng!");
    console.log(data)
    // clean and update chat history with bot's response
    const apiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text
    ?.replace(/\*\*(.*?)\*\*/g, "$1") ?.trim() || "No response";

      updateHistory(apiResponseText);

  }
  catch(error){
     if (error.message.includes("retry")) {
    setTimeout(() => {
      GenerateBotResponse(history);
    }, 40000); // 40 seconds
  }
  };
  };
 useEffect(() => {
  if (!chatbodyref.current) return;

  chatbodyref.current.scrollTo({
    top: chatbodyref.current.scrollHeight,
    behavior: "smooth"
  });
}, [ChatHistory]);


  return (
  <div className={`container ${showChatbot ? 'show-chatbot': ""}`}> 
  <button onClick= {() => {setShowChatbot(prev => !prev)}} id="chatbot-toggler">
     {showChatbot ? (
      <span className="material-symbols-rounded">close</span>
    ) : (
      <span className="material-symbols-rounded">mode_comment</span>
    )}
  </button>
    <div className="chatbot-popup">
      {/* chat bot header */}
      <div className="chat-header">
        <div className="header-info">
           <Chatboticon />
          <h2 className="logo-text">chatbot</h2>
        </div>
        <button  onClick= {() => {setShowChatbot(prev => !prev)}} className="material-symbols-rounded">
keyboard_arrow_down
</button>
      </div>
        {/* chat bot body */}
      <div ref = {chatbodyref} className="chat-body">
      <div className="message bot-message">
           <Chatboticon />
           <p className="message-text">
            hey there  <br /> how can i help  you today ?
           </p>

      </div>
      {/* render the chat history  dynamically */}
      {ChatHistory.map((chat,index) =>(
        <ChatMessage  key = {index} chat = {chat}/>
      ))}
     
      </div>
          {/* chat bot footer */}
      <div className="chat-footer">
        <ChatForm    chathistory = {ChatHistory} setChatHistory = {setChatHistory} generateBotResponse = {GenerateBotResponse} />
      
      </div>
    </div>
  </div>
    
  )
}
