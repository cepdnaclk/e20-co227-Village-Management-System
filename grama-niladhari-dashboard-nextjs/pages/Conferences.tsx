
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { 
  Video, 
  ExternalLink, 
  Users, 
  Calendar, 
  Clock, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  Maximize2, 
  MessageSquare,
  Settings,
  X as LucideX,
  Loader2,
  AlertTriangle,
  RefreshCcw,
  Plus
} from 'lucide-react';
import { api, VideoConference } from '../services/api';

type ConnectionStatus = 'idle' | 'connecting' | 'active' | 'error';

export const Conferences: React.FC = () => {
  const [activeMeeting, setActiveMeeting] = useState<VideoConference | null>(null);
  const [conferences, setConferences] = useState<VideoConference[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [connStatus, setConnStatus] = useState<ConnectionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  // In a real app, this would come from auth context
  const gramaNiladhariId = 'GN001';

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const data = await api.getConferencesByGramaNiladhariId(gramaNiladhariId);
        setConferences(data);
      } catch (error) {
        console.error('Error fetching conferences:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConferences();
  }, [gramaNiladhariId]);

  const startCall = async (conference: VideoConference) => {
    setConnStatus('connecting');
    setErrorMessage(null);
    
    try {
      // Update conference status to ONGOING
      await api.startConference(conference.id);
      
      // Optimized constraints for faster initialization and lower timeout risk
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }, 
        audio: true 
      });
      
      setStream(mediaStream);
      setActiveMeeting(conference);
      setConnStatus('active');
    } catch (err: any) {
      console.error("Media Device Error:", err);
      setConnStatus('error');
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage("Camera or Microphone access was denied. Please update your browser permissions.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage("No camera or microphone found. Please check your hardware connections.");
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMessage("Your camera is already in use by another application or failed to start.");
      } else {
        setErrorMessage("A timeout occurred while initializing your video source. Please try again.");
      }
    }
  };

  const endCall = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    if (activeMeeting) {
      try {
        await api.endConference(activeMeeting.id);
      } catch (error) {
        console.error('Error ending conference:', error);
      }
    }
    
    setStream(null);
    setActiveMeeting(null);
    setConnStatus('idle');
    setErrorMessage(null);
    setIsCameraOn(true);
    setIsMicOn(true);
    
    // Refresh conferences
    const data = await api.getConferencesByGramaNiladhariId(gramaNiladhariId);
    setConferences(data);
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  useEffect(() => {
    if (activeMeeting && localVideoRef.current && stream && connStatus === 'active') {
      localVideoRef.current.srcObject = stream;
    }
  }, [activeMeeting, stream, connStatus]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Loading Overlay
  if (connStatus === 'connecting') {
    return (
      <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center mb-8">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tighter mb-2">Initializing Hardware</h2>
        <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">Connecting to divisional secure video nodes. Please allow browser access to your camera and microphone.</p>
      </div>
    );
  }

  // Error State
  if (connStatus === 'error' && errorMessage) {
    return (
      <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-[28px] flex items-center justify-center mb-8 text-red-500 shadow-2xl shadow-red-500/10">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tighter mb-3">Connection Failure</h2>
        <p className="text-zinc-400 text-sm max-w-md leading-relaxed mb-10">{errorMessage}</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setConnStatus('idle')} className="h-14 px-10 rounded-2xl border-white/10 text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest">
            Back to Dashboard
          </Button>
          <Button onClick={() => meetings[0] && startCall(meetings[0])} className="h-14 px-10 rounded-2xl bg-white text-zinc-950 text-[10px] font-black uppercase tracking-widest gap-2">
            <RefreshCcw size={14} /> Retry Hardware
          </Button>
        </div>
      </div>
    );
  }

  if (activeMeeting && connStatus === 'active') {
    return (
      <div className="fixed inset-0 z-[60] bg-zinc-950 flex flex-col animate-in fade-in duration-500 overflow-hidden">
        {/* Call Header Overlay */}
        <header className="absolute top-0 inset-x-0 h-20 px-10 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-50">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[18px] flex items-center justify-center text-white shadow-2xl">
              <VideoIcon size={24} />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">{activeMeeting.title}</h2>
              <div className="flex items-center gap-3">
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest leading-none">ID: {activeMeeting.meetingId || activeMeeting.id}</p>
                <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none">Encryption Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 backdrop-blur-xl rounded-2xl">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-zinc-900 bg-zinc-700" />)}
              </div>
              <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">4 In Call</span>
            </div>
            <button onClick={endCall} className="p-3 text-zinc-400 hover:text-white transition-colors">
              <LucideX size={24} />
            </button>
          </div>
        </header>

        {/* Video Grid Area */}
        <div className="flex-1 p-8 pt-24 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0 bg-zinc-950">
          {/* Remote Participant (Simulated) */}
          <div className="relative bg-zinc-900/40 border border-white/5 rounded-[48px] overflow-hidden flex items-center justify-center group shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            
            <div className="text-center space-y-6">
              <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-white/5 flex items-center justify-center text-5xl font-black text-zinc-600 mx-auto shadow-2xl ring-1 ring-white/5">
                DS
              </div>
              <div className="space-y-1">
                <p className="text-zinc-200 font-black text-lg tracking-tight">Divisional Secretary</p>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">District Hub</p>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 z-20">
              <div className="px-5 py-2 bg-black/60 border border-white/10 backdrop-blur-2xl rounded-2xl flex items-center gap-3 shadow-2xl">
                 <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">District Admin</span>
              </div>
            </div>
          </div>

          {/* Local Participant (Real User Media) */}
          <div className="relative bg-zinc-900/40 border border-white/5 rounded-[48px] overflow-hidden flex items-center justify-center group shadow-inner">
            {!isCameraOn ? (
              <div className="text-center space-y-6">
                <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-white/5 flex items-center justify-center text-5xl font-black text-zinc-600 mx-auto shadow-2xl">
                  GN
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-200 font-black text-lg tracking-tight">Grama Niladhari</p>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Local Division (You)</p>
                </div>
              </div>
            ) : (
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover mirror-view transition-all duration-700 ease-in-out"
              />
            )}
            
            <div className="absolute bottom-8 left-8 z-20 flex items-center gap-3">
              <div className="px-5 py-2 bg-zinc-900/80 border border-white/10 backdrop-blur-2xl rounded-2xl flex items-center gap-3 shadow-2xl">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Self</span>
              </div>
              {!isMicOn && (
                <div className="p-2 bg-red-600 rounded-xl shadow-lg shadow-red-600/20 animate-in zoom-in-50 duration-200">
                  <MicOff size={14} className="text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call Controls Footer */}
        <footer className="h-32 bg-zinc-950 flex items-center justify-center px-20 relative">
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleMic}
              className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                isMicOn ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-red-600 text-white shadow-2xl shadow-red-600/30 ring-4 ring-red-600/10'
              }`}
            >
              {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>
            <button 
              onClick={toggleCamera}
              className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                isCameraOn ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-red-600 text-white shadow-2xl shadow-red-600/30 ring-4 ring-red-600/10'
              }`}
            >
              {isCameraOn ? <VideoIcon size={22} /> : <VideoOff size={22} />}
            </button>
            
            <div className="w-px h-10 bg-white/10 mx-4" />
            
            <button 
              onClick={endCall}
              className="w-20 h-14 bg-red-600 text-white rounded-[24px] flex items-center justify-center hover:bg-red-700 transition-all shadow-2xl shadow-red-600/40 ring-4 ring-red-600/20 group hover:w-28 duration-300"
            >
              <PhoneOff size={24} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="absolute right-20 flex items-center gap-4">
             <button className="w-14 h-14 bg-zinc-900 border border-white/5 rounded-[22px] flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:bg-zinc-800">
               <MessageSquare size={20} />
             </button>
             <button className="w-14 h-14 bg-zinc-900 border border-white/5 rounded-[22px] flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:bg-zinc-800">
               <Maximize2 size={20} />
             </button>
          </div>
        </footer>
        
        <style dangerouslySetInnerHTML={{ __html: `.mirror-view { transform: scaleX(-1); }` }} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Video Conferences</h1>
          <p className="text-zinc-500 mt-1">Virtual meetings with divisional authorities and citizens.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsScheduleOpen(true)} className="gap-2 h-11 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-zinc-200 transition-all active:scale-95">
            <Plus size={16} /> Schedule Meeting
          </Button>
          {conferences.find(c => c.status === 'ONGOING') && (
            <Button 
              onClick={() => {
                const ongoing = conferences.find(c => c.status === 'ONGOING');
                if (ongoing) startCall(ongoing);
              }} 
              className="gap-2 h-11 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-200 bg-red-600 hover:bg-red-700 transition-all active:scale-95"
            >
              <VideoIcon size={16} /> Join Active Meeting
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 p-8 text-center text-zinc-400">Loading conferences...</div>
        ) : conferences.length === 0 ? (
          <div className="col-span-3 p-8 text-center text-zinc-400">No conferences scheduled</div>
        ) : (
          conferences.map((conf) => {
            const confDate = new Date(conf.scheduledDateTime);
            const dateStr = confDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const timeStr = confDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const isPast = confDate < new Date();
            const isLive = conf.status === 'ONGOING';
            const isScheduled = conf.status === 'SCHEDULED' && !isPast;
            
            return (
              <div key={conf.id} className="bg-white border border-zinc-200 rounded-[32px] p-8 flex flex-col relative group hover:shadow-2xl hover:border-zinc-300 transition-all duration-500">
                <div className="flex items-start justify-between mb-8">
                  <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
                    <Video size={24} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${
                      isLive ? 'bg-red-50 text-red-600 animate-pulse' : 
                      isScheduled ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-400'
                    }`}>
                      {conf.status}
                    </span>
                    <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">{conf.meetingId || `MTG-${conf.id}`}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-zinc-900 mb-2 tracking-tight leading-tight">{conf.title}</h3>
                {conf.villagerName && (
                  <p className="text-xs text-zinc-500 mb-4">With: {conf.villagerName}</p>
                )}
                
                <div className="mt-auto pt-10 space-y-4">
                  <div className="flex items-center gap-8 py-4 border-t border-zinc-50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Date</span>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
                        <Calendar size={12} className="text-zinc-300" /> {dateStr}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Time</span>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
                        <Clock size={12} className="text-zinc-300" /> {timeStr}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    {!isPast && conf.status !== 'COMPLETED' && conf.status !== 'CANCELLED' ? (
                      <>
                        <Button 
                          onClick={() => startCall(conf)}
                          className={`flex-1 gap-3 text-[10px] font-black uppercase tracking-[0.2em] h-12 rounded-2xl shadow-xl transition-all active:scale-95 ${
                            isLive ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 'bg-zinc-900 shadow-zinc-100'
                          }`}
                        >
                          {isLive ? 'Join Now' : 'Join Meeting'} <ExternalLink size={14} />
                        </Button>
                        {conf.meetingLink && (
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-12 w-12 rounded-2xl border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-900"
                            onClick={() => window.open(conf.meetingLink, '_blank')}
                          >
                            <ExternalLink size={16} />
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button variant="outline" className="w-full gap-2 text-[10px] font-black uppercase tracking-[0.2em] h-12 rounded-2xl border-zinc-200">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isScheduleOpen && (
        <div className="fixed inset-0 z-[10000] flex justify-end">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsScheduleOpen(false)} />
          <aside className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 p-12 flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">Schedule Conference</h2>
              <button onClick={() => setIsScheduleOpen(false)} className="p-3 hover:bg-zinc-50 rounded-2xl border border-zinc-100">
                <LucideX size={24} />
              </button>
            </div>

            <form 
              className="space-y-10 flex-1 overflow-y-auto pr-2 scrollbar-hide"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const villagerId = formData.get('villagerId') as string;
                const date = formData.get('date') as string;
                const time = formData.get('time') as string;
                const description = formData.get('description') as string;

                const scheduledDateTime = new Date(`${date}T${time}`);

                try {
                  await api.scheduleConference({
                    title,
                    description,
                    gramaNiladhariId,
                    villagerId,
                    scheduledDateTime: scheduledDateTime.toISOString(),
                    status: 'SCHEDULED'
                  });
                  setIsScheduleOpen(false);
                  // Refresh conferences
                  const data = await api.getConferencesByGramaNiladhariId(gramaNiladhariId);
                  setConferences(data);
                } catch (error) {
                  console.error('Error scheduling conference:', error);
                  alert('Failed to schedule conference. Please try again.');
                }
              }}
            >
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Conference Title</label>
                <input 
                  name="title"
                  placeholder="e.g. Land Dispute Discussion" 
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/5" 
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Villager NIC</label>
                <input 
                  name="villagerId"
                  placeholder="Enter villager NIC" 
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/5" 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Date</label>
                  <input 
                    name="date"
                    type="date" 
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-black focus:outline-none" 
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Time</label>
                  <input 
                    name="time"
                    type="time" 
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-black focus:outline-none" 
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Description</label>
                <textarea 
                  name="description"
                  rows={4} 
                  placeholder="Meeting agenda and objectives..." 
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 resize-none" 
                />
              </div>

              <Button type="submit" className="w-full h-16 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-zinc-200 mt-auto">
                Schedule Conference
              </Button>
            </form>
          </aside>
        </div>
      )}

      <section className="bg-zinc-900 text-white rounded-[48px] p-20 text-center relative overflow-hidden shadow-2xl">
        <div className="max-w-xl mx-auto space-y-10 relative z-10">
          <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[32px] flex items-center justify-center mx-auto border border-white/10 text-white shadow-2xl">
            <Calendar size={40} />
          </div>
          <div className="space-y-4">
            <h4 className="text-4xl font-black tracking-tighter">Virtual Public Office Hours</h4>
            <p className="text-sm text-zinc-400 font-medium leading-loose px-10">
              Direct access to divisional administrative support. Join our recurring virtual meeting every Friday for general inquiries and expedited service requests.
            </p>
          </div>
          <Button variant="outline" className="h-14 px-12 rounded-2xl border-white/10 text-white hover:bg-white hover:text-zinc-900 transition-all font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl">
            Register for Recurring Alert
          </Button>
        </div>
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none scale-150 rotate-12 select-none">
          <VideoIcon size={320} />
        </div>
      </section>
    </div>
  );
};
