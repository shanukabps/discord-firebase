import React, { useEffect, useState } from 'react'
import ChatHeader from './ChatHeader';
import './Channel.css'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import GifIcon from '@material-ui/icons/Gif';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Message from './Message';
import { useSelector } from 'react-redux';
import { selectChannelId, selectChannelName } from './features/appSlice';
import { selectUser } from './features/userSlice';
import db from './firebase';
import firebase from 'firebase'

function Channel() {
    const user = useSelector(selectUser)
    const channelId = useSelector(selectChannelId);
    const channelName = useSelector(selectChannelName)
    const [input, setInput] = useState("")
    const [messages, setMssages] = useState([])

    useEffect(() => {
        if (channelId) {

            db.collection('channels').doc(channelId).collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) =>
                    setMssages(snapshot.docs.map((doc) => doc.data()))
                )
        }
    }, [channelId])

    const sendMessage = e => {
        e.preventDefault()
        db.collection('channels').doc(channelId).collection('messages')
            .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                messages: input,
                user: user,

            })
        setInput("")
    }
    console.log(messages)
    return (
        <div className="chat">
            <ChatHeader channelName={channelName} />

            <div className="chat_message">

                {messages.map((message) => (
                    <Message
                        timestamp={message.timestamp}
                        messages={message.messages}
                        user={message.user}
                    />
                ))
                }

            </div>
            <div className="chat_input">
                <AddCircleIcon />
                <form >
                    <input value={input}
                        disabled={!channelId}
                        onChange={e => setInput(e.target.value)}
                        placeholder={"Messssage "} />
                    <button className="chat_inputbutton"
                        onClick={sendMessage}
                        type="submit">Send Message</button>
                </form>
                <div className="chat_inputIcons">
                    <BurstModeIcon />
                    <GifIcon />
                    <EmojiEmotionsIcon />

                </div>
            </div>
        </div>
    )
}

export default Channel
