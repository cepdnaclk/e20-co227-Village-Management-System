import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { 
  Calendar as CalendarIcon, MapPin, Clock, Plus, 
  ChevronLeft, ChevronRight, X, LayoutGrid, 
  List, AlertCircle, Info, Users, Bell, ArrowRight
} from 'lucide-react';
import { api, Event } from '../services/api';

export const Events: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('calendar');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  // In a real app, this would come from auth context
  const gramaNiladhariId = 'GN001';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEventsByGramaNiladhariId(gramaNiladhariId);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [gramaNiladhariId]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">Scheduling Hub</h1>
          <p className="text-zinc-500 mt-1">Orchestrate community engagements and institutional summits.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-zinc-200 rounded-2xl p-1 flex gap-1 shadow-sm">
            <button 
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:bg-zinc-50'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('agenda')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'agenda' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:bg-zinc-50'}`}
            >
              <List size={18} />
            </button>
          </div>
          <Button onClick={() => setIsScheduleOpen(true)} className="gap-2 h-11 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-zinc-200">
            <Plus size={16} /> Schedule Summit
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        <div className="flex-1 bg-white border border-zinc-200 rounded-[40px] p-10 shadow-sm overflow-hidden flex flex-col relative">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-6">
              <h2 className="text-4xl font-black text-zinc-900 tracking-tighter">May 2024</h2>
              <div className="flex gap-1 bg-zinc-50 p-1 rounded-xl">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white"><ChevronLeft size={16}/></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white"><ChevronRight size={16}/></Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 ring-1 ring-zinc-200" />)}
              </div>
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Village Council</span>
            </div>
          </div>
          
          {viewMode === 'calendar' ? (
            <div className="flex-1 grid grid-cols-7 gap-px bg-zinc-100 border border-zinc-100 rounded-[32px] overflow-hidden">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                <div key={day} className="bg-zinc-50/50 p-4 text-[10px] font-black text-zinc-400 text-center tracking-[0.2em]">{day}</div>
              ))}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const hasEvent = day === 20 || day === 22 || day === 25;
                const isToday = day === 18;
                return (
                  <div key={i} className={`bg-white min-h-[120px] p-4 relative group cursor-pointer transition-all hover:bg-zinc-50/80 ${isToday ? 'ring-2 ring-inset ring-zinc-900 z-10' : ''}`}>
                    <span className={`text-sm font-black ${isToday ? 'text-zinc-900' : 'text-zinc-300'}`}>{day}</span>
                    {hasEvent && (
                      <div className="mt-4 space-y-1.5">
                        <div className="h-1.5 w-full bg-zinc-900 rounded-full animate-in slide-in-from-left duration-300" />
                        <p className="text-[9px] font-black text-zinc-900 truncate leading-none uppercase tracking-tighter">Event Active</p>
                      </div>
                    )}
                    {isToday && <div className="absolute top-4 right-4 w-2 h-2 bg-zinc-900 rounded-full animate-pulse" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-4 space-y-4">
              {loading ? (
                <div className="p-8 text-center text-zinc-400">Loading events...</div>
              ) : events.length === 0 ? (
                <div className="p-8 text-center text-zinc-400">No events scheduled</div>
              ) : (
                events.map((ev) => {
                  const eventDate = new Date(ev.start);
                  const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const timeStr = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={ev.id} className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100 flex items-center justify-between group hover:bg-zinc-900 hover:text-white transition-all duration-300">
                      <div className="flex gap-8 items-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center shadow-sm group-hover:bg-zinc-800 border border-zinc-100 group-hover:border-zinc-700">
                          <span className="text-[10px] font-black uppercase text-zinc-400 mb-0.5">{dateStr.split(' ')[0]}</span>
                          <span className="text-xl font-black">{dateStr.split(' ')[1]}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-black tracking-tight">{ev.title}</h4>
                          <div className="flex items-center gap-6 mt-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60"><Clock size={12} /> {timeStr}</div>
                            {ev.location && (
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60"><MapPin size={12} /> {ev.location}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        {ev.attendeeNames && ev.attendeeNames.length > 0 && (
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Attendees</p>
                            <p className="text-sm font-bold">{ev.attendeeNames.length} Residents</p>
                          </div>
                        )}
                        <Button variant="ghost" size="icon" className="rounded-full group-hover:text-white"><ArrowRight size={20}/></Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <aside className="w-96 flex flex-col gap-6">
          <section className="bg-zinc-900 text-white rounded-[40px] p-8 space-y-8 shadow-2xl overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 mb-6">Divisional Capacity</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-widest">
                    <span className="text-zinc-400">Public Office Hours</span>
                    <span className="text-white">82% Used</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[82%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-widest">
                    <span className="text-zinc-400">Field Inspections</span>
                    <span className="text-white">12 Available</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-600 w-[40%]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <CalendarIcon size={180} />
            </div>
          </section>

          <section className="bg-white border border-zinc-200 rounded-[40px] p-8 flex-1 flex flex-col shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-8">Scheduling Alerts</h3>
            <div className="space-y-6 flex-1 overflow-y-auto">
              {[
                { type: 'CONFLICT', msg: 'Residency audit overlaps with council meeting on May 22nd.', icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                { type: 'UPDATE', msg: 'Agriculture summit location shifted to Central Pavilion.', icon: Info, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                { type: 'ATTENDEES', msg: '14 new residents RSVP\'d for the Health Clinic.', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className={`p-3 h-fit rounded-2xl border ${alert.color} shrink-0`}><alert.icon size={18}/></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">{alert.type}</p>
                    <p className="text-xs font-medium text-zinc-600 leading-relaxed">{alert.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest border-zinc-200 mt-6">
              Mute All Alerts
            </Button>
          </section>
        </aside>
      </div>

      {isScheduleOpen && (
        <div className="fixed inset-0 z-[10000] flex justify-end">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-500" onClick={() => setIsScheduleOpen(false)} />
          <aside className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-700 p-12 flex flex-col">
            <div className="flex justify-between items-center mb-16">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-zinc-900 tracking-tighter">Schedule Summit</h2>
                <p className="text-zinc-400 text-xs font-medium">New entry into the divisional village calendar.</p>
              </div>
              <button onClick={() => setIsScheduleOpen(false)} className="p-4 hover:bg-zinc-50 rounded-[24px] border border-zinc-100 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form 
              className="space-y-10 flex-1 overflow-y-auto pr-4 scrollbar-hide"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const date = formData.get('date') as string;
                const time = formData.get('time') as string;
                const location = formData.get('location') as string;
                const description = formData.get('description') as string;
                const eventType = formData.get('eventType') as string;

                const startDateTime = new Date(`${date}T${time}`);
                const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours default

                try {
                  await api.createEvent({
                    title,
                    description,
                    start: startDateTime.toISOString(),
                    end: endDateTime.toISOString(),
                    location,
                    eventType,
                    gramaNiladhariId,
                    status: 'SCHEDULED'
                  });
                  setIsScheduleOpen(false);
                  // Refresh events
                  const data = await api.getEventsByGramaNiladhariId(gramaNiladhariId);
                  setEvents(data);
                } catch (error) {
                  console.error('Error creating event:', error);
                  alert('Failed to create event. Please try again.');
                }
              }}
            >
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Summit Identification</label>
                <input 
                  name="title"
                  placeholder="Event Title (e.g. Village Development Council)" 
                  className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-[24px] text-sm font-black placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all" 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Target Date</label>
                  <input 
                    name="date"
                    type="date" 
                    className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-[24px] text-sm font-black focus:outline-none" 
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Start Time</label>
                  <input 
                    name="time"
                    type="time" 
                    className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-[24px] text-sm font-black focus:outline-none" 
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Event Type</label>
                <select 
                  name="eventType"
                  className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-[24px] text-sm font-black focus:outline-none"
                  required
                >
                  <option value="MEETING">Meeting</option>
                  <option value="VILLAGE_EVENT">Village Event</option>
                  <option value="OFFICE_WORK">Office Work</option>
                  <option value="FIELD_VISIT">Field Visit</option>
                  <option value="TRAINING">Training</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Spatial Coordinates</label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={20} />
                  <input 
                    name="location"
                    placeholder="Physical Venue / Zoom Link" 
                    className="w-full pl-14 pr-5 py-5 bg-zinc-50 border border-zinc-100 rounded-[24px] text-sm font-black placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Strategic Intent</label>
                <textarea 
                  name="description"
                  rows={4} 
                  placeholder="Briefly define the core agenda and objectives..." 
                  className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-[24px] text-sm font-medium placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 resize-none transition-all" 
                />
              </div>

              <div className="bg-zinc-900 text-white rounded-[32px] p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl"><Bell size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Public Notification</p>
                    <p className="text-xs font-bold">Alert all village residents via SMS/Email</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-zinc-700 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all translate-x-6" />
                </div>
              </div>
            </form>

            <div className="pt-10 flex gap-4">
              <Button onClick={() => setIsScheduleOpen(false)} variant="ghost" className="flex-1 h-16 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                Cancel
              </Button>
              <Button type="submit" className="flex-[2] h-16 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-zinc-200">
                Publish to Calendar
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
