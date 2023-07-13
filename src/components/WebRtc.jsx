import React, { useEffect, useRef, useState } from 'react';

const WebRtc = ({ remoteStream }) => {
    const remoteRef = useRef();
    remoteRef.current.srcObject = remoteStream;
    console.log(remoteRef.current)
    return (
        <div>
            <video autoPlay ref={remoteRef}> </video>
        </div>
    )
}

export default WebRtc;