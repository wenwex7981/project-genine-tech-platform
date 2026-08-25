"use client";

import React, { useEffect, useRef, useState } from "react";

interface AudioMeterProps {
  isRecording: boolean;
}

export const AudioMeter: React.FC<AudioMeterProps> = ({ isRecording }) => {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRecording) {
      // Clean up when recording stops
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setVolume(0);
      return;
    }

    const startAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        streamRef.current = stream;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          
          // Map 0-255 to 0-100 percentage (can tweak multiplier for sensitivity)
          const volumePercentage = Math.min(100, Math.max(0, average * 1.5));
          
          setVolume(volumePercentage);
          requestRef.current = requestAnimationFrame(updateVolume);
        };

        updateVolume();
      } catch (err) {
        console.error("Error accessing microphone for volume meter:", err);
      }
    };

    startAudio();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording]);

  if (!isRecording) return null;

  return (
    <div className="w-full flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/10 mt-2">
      <div className="text-xs font-bold text-white/70 uppercase tracking-widest whitespace-nowrap">Input Level</div>
      <div className="flex-1 h-3 bg-black/50 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
        {/* The moving volume bar */}
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-200 rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]"
          style={{ width: `${volume}%` }}
        />
      </div>
    </div>
  );
};
