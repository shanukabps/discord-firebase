import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import SidebarChannel from './SidebarChannel';
import SignalCellularAltIcon from '@material-ui/icons/SignalCellularAlt';
import InfoIcon from '@material-ui/icons/Info';
import CallIcon from '@material-ui/icons/Call';
import { Avatar } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import MicIcon from '@material-ui/icons/Mic';
import HeadsetIcon from '@material-ui/icons/Headset';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import db, { auth } from './firebase';




function Sidebar() {

    const user = useSelector(selectUser)
    const [channels, setChannels] = useState([])

    useEffect(() => {
        db.collection('channels').onSnapshot(snapshot =>
            setChannels(snapshot.docs.map((doc) => ({
                id: doc.id,
                channel: doc.data(),
            })))
        )

    }, [])
    const handelAddChannel = () => {
        const channelName = prompt("Enter a new channel name")

        if (channelName) {
            db.collection("channels").add({
                channelName: channelName
            })
        }



    }

    return (
        <div className="sidebar">

            <div className="sidebar_top">
                <h3>BPS</h3>
                <ExpandMoreIcon />
            </div>
            <div className="sidebar_channels">
                <div className="sidebar_channelsheader">
                    <div className="sidebar_header">
                        <ExpandMoreIcon />
                        <h4>channles...</h4>
                    </div>
                    <AddIcon onClick={handelAddChannel} className="sidebar_addchannel" />
                </div>



                <div className="sidebar_channelsList">
                    {
                        channels.map(({ id, channel }) => (
                            <SidebarChannel key={id} id={id} channelName={channel.channelName} />
                        ))
                    }

                </div>
            </div>

            <div className="sidebar_voice">
                <div className="signalIcon">
                    <SignalCellularAltIcon fontSize="large" />
                </div>
                <div className="sidebar_voiceInfor">

                    <h3>Voice Connected</h3>
                    <p>Stremed</p>
                </div>

                <div className="sidebar_voiceIcon">
                    <InfoIcon />
                    <CallIcon />

                </div>
            </div>
            <div className="sidebar_profile">
                <Avatar onClick={() => auth.signOut()} src={user.photo} />
                <div className="sidebar_profileInfor">

                    <h3>{user.displayName}</h3>
                    <p>#{user.uid.substring(0, 5)}</p>
                </div>
                <div className="sidebar_profileIcons">
                    <MicIcon />
                    <HeadsetIcon />
                    <SettingsIcon />
                </div>
            </div>

        </div>
    )
}

export default Sidebar
