import React, { useEffect, useRef, useState } from 'react';

const WebRtc = ({ localStream, selectedRoom, webRtcSocket }) => {
    
    useEffect(() => {
        // let selectedCandidate = {}; 
    // RTC peerConnection
        const share = async() => {
            webRtcSocket.emit('join', selectedRoom);
        }

        let peerInfo = {};

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
        const icecandidate = (data) => {
            if (data.candidate) {
                webRtcSocket.emit("icecandidate", {
                    candidate : data.candidate,
                    selectedRoom,
                });
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
        webRtcSocket.on('enter', async({
            userId
        }) => {
            console.log(userId, "님이 방에 참가")
            console.log(peerInfo)
            await makePeerConnect(userId);
            const offer = await peerInfo[userId].peerConnection.createOffer();
            await peerInfo[userId].peerConnection.setLocalDescription(offer);
            webRtcSocket.emit("offer", { offer, selectedRoom });
            console.log("send offer");
        });
    
        // 기존 유저로부터 보이스 연결 수신을 받음
        webRtcSocket.on("offer", async({
            userId,
            offer
        }) => {
            console.log("receive answer : ", userId)
            if (!peerInfo[userId]) {
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
        });
    
        // 신규 유저로부터 응답을 받음
        webRtcSocket.on("answer", async({
            userId,
            answer,
            toUserId
        }) => {
            console.log("receive answer : ", userId)
            if (peerInfo[toUserId] === undefined) {
                await peerInfo[userId].peerConnection.setRemoteDescription(answer);
            };
        });
    
        // 연결 후보를 수신 받음
        webRtcSocket.on("icecandidate", async({
            userId,
            candidate
        }) => {
            // if (selectedCandidate[candidate.candidate] === undefined) {
            //     selectedCandidate[candidate.candidate] = true;
                await peerInfo[userId].peerConnection.addIceCandidate(candidate);
            // };
        });

        // 연결 해제 - 타인
        webRtcSocket.on("someoneLeaveRoom", async({ userId }) => {
            console.log(userId, "님이 퇴장")
            if (peerInfo[userId]){
                peerInfo[userId].peerConnection.close();
                delete peerInfo[userId];
                console.log(peerInfo[userId])
            }
        })

        // 연결 해제 - 본인
        webRtcSocket.on("youLeaveRoom", async({ userId }) => {
            for (let user in peerInfo){
                peerInfo[user].peerConnection.close();
                delete peerInfo[user]
            }
            console.log("퇴장", peerInfo);
            webRtcSocket.emit("exit", selectedRoom);
        });

    share();
        return (() => {
            webRtcSocket.emit("leaveRoom", selectedRoom);
        })
    }, [])
    
    return (
        <div>
        1
        </div>
    )
}

export default WebRtc;