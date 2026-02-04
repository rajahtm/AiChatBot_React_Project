import React, { useRef } from 'react'


 const ChatForm = ({chathistory,setChatHistory,generateBotResponse}) => {
    const inputref = useRef();
     const handleFormSubmit = (e) =>{
             e.preventDefault();
             const usermessage = inputref.current.value.trim();
             if(!usermessage) return;
            //  console.log(usermessage)
            // update chat history with the user's message
             setChatHistory(history =>[...history,{role:'user',text:usermessage}]);
             setTimeout(()=>{
                // add a thinking ... placeholder  for the bots  response
                     setChatHistory(history =>[...history,{role:'model',text:"thinking..."}]);
                // call the function  to generate the bot's response
                     generateBotResponse([...chathistory,{role:'user',text:usermessage}]);
                   
                      
             },1000);
//  clear  input atutomatically
     inputref.current.value = "";
 };
  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
        <input ref = {inputref} type="text"  placeholder = "type hear ..." className="message-input"  required/>
              <button className="material-symbols-rounded">
arrow_upward
</button>

      </form>
  )
}
export default ChatForm;