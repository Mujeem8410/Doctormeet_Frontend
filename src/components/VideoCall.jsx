import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaExpand, FaCompress, FaComments } from "react-icons/fa";
import ChatPanel from "./ChatPanel";
import AppointmentInfo from "./AppointmentInfo";
import { SOCKET_URL } from "../utils/runtimeConfig";

export default function PatientVideoCall() {
  const { roomId, appointmentId } = useParams();
  const [status, setStatus] = useState("Connecting...");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState("good");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const localVideo = useRef();
  const remoteVideo = useRef();
  const socket = useRef();
  const pc = useRef();
  const callStartTime = useRef(null);
  const timerInterval = useRef(null);

  useEffect(() => {
    init();
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
      socket.current?.disconnect();
      pc.current?.close();
    };
  }, []);

  useEffect(() => {
    if (status === "Connected" && !callStartTime.current) {
      callStartTime.current = Date.now();
      timerInterval.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime.current) / 1000));
      }, 1000);
    }
  }, [status]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  async function init() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.current.srcObject = stream;

      socket.current = io(SOCKET_URL);
      socket.current.emit("join-video-room", roomId);

      pc.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          {
              urls: "turn:openrelay.metered.ca:80",
              username: "openrelay",
              credential: "openrelay"
          }
        ],
      });

      stream.getTracks().forEach((track) => pc.current.addTrack(track, stream));

      const remoteStream = new MediaStream();
      remoteVideo.current.srcObject = remoteStream;

      pc.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
        console.log("🎥 Remote track received:", event.track.kind);
        setStatus("Connected");
      };

      pc.current.onicecandidate = ({ candidate }) => {
        if (candidate) socket.current.emit("ice-candidate", candidate, roomId);
      };

      pc.current.onconnectionstatechange = () => {
        const state = pc.current.connectionState;
        switch (state) {
          case "connected":
            setStatus("Connected");
            setConnectionQuality("good");
            break;
          case "connecting":
            setStatus("Connecting...");
            break;
          case "failed":
            setStatus("Connection Failed");
            setConnectionQuality("poor");
            break;
          case "disconnected":
            setStatus("Disconnected");
            setConnectionQuality("poor");
            break;
        }
      };

      // PATIENT IS THE OFFERER: Listener for the Answer
      socket.current.on("answer", async (data) => {
        const desc = typeof data === "string" ? JSON.parse(data) : data;
        if (!desc?.type || !desc?.sdp) return;
        if (pc.current.signalingState === "have-local-offer") {
          await pc.current.setRemoteDescription(new RTCSessionDescription(desc));
        }
      });

      // PATIENT IS THE OFFERER: Ignores offers (for simplicity)
      socket.current.on("offer", (data) => {
        console.warn("Ignoring unexpected offer, Patient is the designated Offerer.", data);
      });

      socket.current.on("ice-candidate", async (candidate) => {
        try {
          await pc.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("Error adding received ice candidate", err);
        }
      });

      // Initial offer creation at the end of init()
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket.current.emit("offer", pc.current.localDescription, roomId);
    } catch (error) {
      console.error("Error initializing video call:", error);
      setStatus("Error: " + error.message);
    }
  }

  const toggleMute = () => {
    const audioTrack = localVideo.current.srcObject.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localVideo.current.srcObject.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  const endCall = () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    socket.current?.disconnect();
    pc.current?.close();
    window.location.href = "/patient/dashboard";
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <AppointmentInfo appointmentId={appointmentId} userType="patient" />
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${connectionQuality === 'good' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-white font-medium">Patient Room: {roomId}</span>
          </div>
          <div className="text-white/80 text-sm">
            Status: {status}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-black/50 px-4 py-2 rounded-lg">
            <span className="text-white font-mono text-lg">{formatTime(callDuration)}</span>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isFullscreen ? <FaCompress className="text-white" /> : <FaExpand className="text-white" />}
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative p-4 transition-all duration-300 flex justify-center min-h-0 overflow-hidden">
        {/* Remote Video (Main) */}
        <div className="w-full h-full relative rounded-xl overflow-hidden bg-gray-900">
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg">
            <span className="text-white text-sm">Doctor</span>
          </div>
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-24 left-4 w-56 h-40 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
          <video
            ref={localVideo}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
            <span className="text-white text-xs">You</span>
          </div>
          {isMuted && (
            <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
              <FaMicrophoneSlash className="text-white text-xs" />
            </div>
          )}
          {isVideoOff && (
            <div className="absolute top-2 left-2 bg-red-500 rounded-full p-1">
              <FaVideoSlash className="text-white text-xs" />
            </div>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-black/30 backdrop-blur-md p-6 border-t border-white/10">
        <div className="flex justify-center items-center space-x-6">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-all duration-200 ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {isMuted ? (
              <FaMicrophoneSlash className="text-white text-xl" />
            ) : (
              <FaMicrophone className="text-white text-xl" />
            )}
          </button>

          {/* Video Toggle Button */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all duration-200 ${
              isVideoOff
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {isVideoOff ? (
              <FaVideoSlash className="text-white text-xl" />
            ) : (
              <FaVideo className="text-white text-xl" />
            )}
          </button>

          {/* End Call Button */}
          <button
            onClick={endCall}
            className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200"
          >
            <FaPhoneSlash className="text-white text-xl" />
          </button>

          {/* Chat Button (Placeholder) */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`p-4 rounded-full transition-all duration-200 ${
              isChatOpen ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'
            }`}
            title="Toggle Chat"
          >
            <FaComments className="text-white text-xl" />
          </button>
        </div>
      </div>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        socket={socket.current}
        roomId={roomId}
        userType="patient"
      />
    </div>
  );
}
