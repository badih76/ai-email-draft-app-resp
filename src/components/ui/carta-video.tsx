'use client'

import { useRef, useState } from "react";
import { Button } from '@/components/ui/button'; // Assuming shadcn button
import { Volume2, VolumeOff } from 'lucide-react'

const VIDEO_SOURCE = "/CartaAiVideo.mp4";

function CartaVideo() {
    const refVid = useRef<HTMLVideoElement>(null);
    const [ muted, setMuted ] = useState<boolean>(true);

    const toggleMute = () => {
        let muted = true;

        if (refVid.current) {
        // Toggle the muted property on the video element itself
        muted = !refVid.current.muted;
        setMuted(muted);
        }
    };

    return (
        <div className="w-fit mx-auto h-full object-contain
             flex flex-col justify-center items-center
             px-4 md:px-6 lg:px-48 py-4">
            <div className="relative h-full aspect-video max-w-full mx-auto">
                <video
                    ref={refVid}
                    // REQUIRED ATTRIBUTES FOR AUTOPLAY AND LOOPING
                    autoPlay 
                    loop 
                    muted={muted}
                    playsInline 
                    // controls
                    // STYLING (using Tailwind CSS)
                    // className="w-[70%] object-cover border-2 border-red-600"
                    className="w-full h-full object-cover block"
                    // OTHER OPTIONAL ATTRIBUTES
                    // preload="auto" // Helps the browser decide how to load the video
                    >
                    <source src={VIDEO_SOURCE} type="video/mp4" />
                    {/* Fallback for browsers that don't support the video tag */}
                    Your browser does not support the video tag.
                </video>

                <div className="cursor-pointer
                            absolute bottom-5 right-5 
                            text-4xl bg-white rounded-full">
                    <div onClick={toggleMute} 
                        className="cursor-pointer p-1
                            text-4xl bg-white w-fit
                            border-2 border-indigo-600 rounded-full">
                        {muted ? 
                            // '🔊' : '🔇'
                            <Volume2 className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9" 
                                color="#4F46E5" />
                            : <VolumeOff 
                                className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9" 
                                color="#4F46E5"/>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartaVideo