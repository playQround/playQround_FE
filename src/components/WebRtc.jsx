import React, { useEffect, useRef } from 'react';

const WebRtc = ({ localStream, selectedRoom, webRtcSocket }) => {
    const peerControl = useRef({});
    const shareRef = useRef(false);
    const peerInfo = peerControl.current;
    
    // share();
    useEffect(() => {
        // let selectedCandidate = {}; 
        // RTC peerConnection
        
        const share = async() => {
            if (!shareRef.current) {
                webRtcSocket.emit('join', selectedRoom);
                shareRef.current = true;
            }
        }

        const makePeerConnect = async(userId) => {
            peerInfo[userId] = new Object();
            peerInfo[userId].peerConnection = new RTCPeerConnection({
                "iceServers": [{
                    urls: 'stun:stun.l.google.com:19302'
                }]
            });
            peerInfo[userId].peerConnection.addEventListener("icecandidate", icecandidate);
            peerInfo[userId].peerConnection.addEventListener("addstream", addStream);

            for (let track of localStream.getTracks()) {
                await peerInfo[userId].peerConnection.addTrack(track, localStream);
            }
        };
    
        // 연결 후보 교환
        const icecandidate = async(data) => {
            try {
                if (data.candidate) {
                    webRtcSocket.emit("icecandidate", {
                        candidate : data.candidate,
                        selectedRoom,
                    });
                }

            } catch (error) {
                console.log("send candidate error : ", error);
            }
        };
    
        // 상대 영상 & 비디오 추가
        const addStream = (data) => {
            let videoArea = document.createElement("video");
            videoArea.autoplay = true;
            videoArea.srcObject = data.stream;
            let container = document.getElementById("root");
            container.appendChild(videoArea);
        };
    
        // RTC socket

        // 타 유저 보이스 채널 입장 확인
        const handleEnter = async( { userId }) => {
            try{
                if (peerInfo[userId] === undefined){
                    await makePeerConnect(userId);
                    console.log(peerInfo[userId].peerConnection.connectionState)
                    const offer = await peerInfo[userId].peerConnection.createOffer();
                    await peerInfo[userId].peerConnection.setLocalDescription(offer);
                    webRtcSocket.emit("offer", { offer, selectedRoom });
                }

            } catch (error){
                console.log("send offer error : ", error);
            }
        }

        // 기존 유저로부터 보이스 연결 수신을 받음
        const handleOffer = async({ userId, offer }) => {
            try{
                if (peerInfo[userId] === undefined) {
                    await makePeerConnect(userId);
                    await peerInfo[userId].peerConnection.setRemoteDescription(offer);
        
                    const answer = await peerInfo[userId].peerConnection.createAnswer(offer);
        
                    await peerInfo[userId].peerConnection.setLocalDescription(answer);
                    webRtcSocket.emit("answer", {
                        answer,
                        toUserId: userId,
                        selectedRoom,
                    });
                }
            } catch (error) {
                console.log("receive offer and send answer error : ",error);
            }
        }

        // 신규 유저로부터 응답을 받음
        const handleAnswer = async({ userId, answer, toUserId}) => {
            try {
                if (peerInfo[toUserId] === undefined) {
                    await peerInfo[userId].peerConnection.setRemoteDescription(answer);
                };

            } catch (error) {
                console.log("receive and set answer error : ", error);
            }
        }

        // 연결 후보를 수신 받음
        const handleIceCandidate = async({ userId, candidate }) => {
            try{ 
                // if (selectedCandidate[candidate.candidate] === undefined) {
                //     selectedCandidate[candidate.candidate] = true;
                    await peerInfo[userId].peerConnection.addIceCandidate(candidate);
                // };

            } catch (error) {
                console.log("set candidate error : ", error);
            }
        }

        // 연결 해제 - 타인
        const handleSomeoneLeaveRoom = async({ userId }) => {
            if (peerInfo[userId]){
                peerInfo[userId].peerConnection.close();
                delete peerInfo[userId];
            }
        }

        // 연결 해제 - 본인
        const handleYouLeaveRoom = async({ userId }) => {
            for (let user in peerInfo){
                console.log(user)
                peerInfo[user].peerConnection.close();
                delete peerInfo[user]
            }
            webRtcSocket.emit("exit", selectedRoom);  
        };

        webRtcSocket.on('enter', handleEnter);
        webRtcSocket.on('offer', handleOffer);
        webRtcSocket.on('answer', handleAnswer);
        webRtcSocket.on('icecandidate', handleIceCandidate);
        webRtcSocket.on('someoneLeaveRoom', handleSomeoneLeaveRoom);
        webRtcSocket.on('youLeaveRoom', handleYouLeaveRoom);

        share();
        
        return (() => {
            webRtcSocket.emit("leaveRoom", selectedRoom);
            webRtcSocket.off('enter', handleEnter);
            webRtcSocket.off('offer', handleOffer);
            webRtcSocket.off('answer', handleAnswer);
            webRtcSocket.off('icecandidate', handleIceCandidate);
            webRtcSocket.off('someoneLeaveRoom', handleSomeoneLeaveRoom);
            webRtcSocket.off('youLeaveRoom', handleYouLeaveRoom);
        })
    }, [])

    return (
        <div>
        </div>
    )
}

export default React.memo(WebRtc);