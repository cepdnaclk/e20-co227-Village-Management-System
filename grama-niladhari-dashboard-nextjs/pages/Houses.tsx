
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Search, Home, User, ArrowRight, MapPin, Users, Plus, X } from 'lucide-react';
import { api, House } from '../services/api';
import { Autocomplete } from '../components/ui/Autocomplete';

export const Houses: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<House>>({});
  const leafletMap = useRef<any>(null);
  const formMapRef = useRef<HTMLDivElement>(null);
  const formLeafletMap = useRef<any>(null);
  const locationMarker = useRef<any>(null);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const data = await api.getHouses();
        setHouses(data);
      } catch (error) {
        console.error('Error fetching houses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  useEffect(() => {
    // @ts-ignore
    const L = window.L;
    if (!L || !mapRef.current || (mapRef.current as any)._leaflet_id || houses.length === 0) return;

    try {
      const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([6.9271, 79.8612], 16);
      leafletMap.current = map;
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

      const icon = L.divIcon({ html: '<div class="w-6 h-6 bg-white border-2 border-zinc-900 rounded-lg flex items-center justify-center shadow-lg"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>', iconSize: [24,24] });
      
      houses.forEach(house => {
        if (house.coordinates) {
          L.marker([house.coordinates.latitude, house.coordinates.longitude] as any, { icon })
            .addTo(map)
            .on('click', () => setSelectedHouse(house));
        }
      });
    } catch (e) {
      console.error('Error initializing map:', e);
    }
  }, [houses]);

  // Initialize form map when modal opens
  useEffect(() => {
    // @ts-ignore
    const L = window.L;
    if (!L || !formMapRef.current || !(isCreateMode || isEditMode)) return;
    
    // Clean up previous map if exists
    if (formLeafletMap.current) {
      formLeafletMap.current.remove();
      formLeafletMap.current = null;
      locationMarker.current = null;
    }

    try {
      const map = L.map(formMapRef.current, { zoomControl: true, attributionControl: true }).setView([6.9271, 79.8612], 15);
      formLeafletMap.current = map;
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

      // Handle map click to set location
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        
        // Remove previous marker if exists
        if (locationMarker.current) {
          map.removeLayer(locationMarker.current);
        }

        // Add new marker
        const icon = L.divIcon({ 
          html: '<div class="w-6 h-6 bg-red-600 border-2 border-white rounded-full shadow-lg"></div>', 
          iconSize: [24, 24],
          className: 'location-marker'
        });
        locationMarker.current = L.marker([lat, lng], { icon, draggable: true }).addTo(map);

        // Update form data
        setFormData({
          ...formData,
          latitude: lat,
          longitude: lng,
          coordinates: { latitude: lat, longitude: lng }
        });

        // Handle marker drag
        locationMarker.current.on('dragend', (dragEvent: any) => {
          const newLat = dragEvent.target.getLatLng().lat;
          const newLng = dragEvent.target.getLatLng().lng;
          setFormData({
            ...formData,
            latitude: newLat,
            longitude: newLng,
            coordinates: { latitude: newLat, longitude: newLng }
          });
        });
      });

      // Load existing location if editing
      if (isEditMode && (formData.latitude || formData.coordinates?.latitude)) {
        const lat = formData.latitude || formData.coordinates?.latitude || 6.9271;
        const lng = formData.longitude || formData.coordinates?.longitude || 79.8612;
        
        const icon = L.divIcon({ 
          html: '<div class="w-6 h-6 bg-red-600 border-2 border-white rounded-full shadow-lg"></div>', 
          iconSize: [24, 24],
          className: 'location-marker'
        });
        locationMarker.current = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
        map.setView([lat, lng], 16);

        // Handle marker drag
        locationMarker.current.on('dragend', (dragEvent: any) => {
          const newLat = dragEvent.target.getLatLng().lat;
          const newLng = dragEvent.target.getLatLng().lng;
          setFormData({
            ...formData,
            latitude: newLat,
            longitude: newLng,
            coordinates: { latitude: newLat, longitude: newLng }
          });
        });
      }

      return () => {
        if (formLeafletMap.current) {
          formLeafletMap.current.remove();
          formLeafletMap.current = null;
        }
        locationMarker.current = null;
      };
    } catch (e) {
      console.error('Error initializing form map:', e);
    }
  }, [isCreateMode, isEditMode]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">Households</h1>
          <p className="text-zinc-500 mt-1">Residential occupancy and household leadership registry.</p>
        </div>
        <Button 
          className="h-11 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest gap-2"
          onClick={() => {
            setIsCreateMode(true);
            setFormData({});
            setSelectedHouse(null);
          }}
        >
          <Plus size={16}/> New House
        </Button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-[450px] bg-white border border-zinc-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-zinc-100 flex gap-3">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
               <input placeholder="Search households..." className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-bold" />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-50">
            {loading ? (
              <div className="p-6 text-center text-zinc-400">Loading...</div>
            ) : houses.length === 0 ? (
              <div className="p-6 text-center text-zinc-400">No houses found</div>
            ) : (
              houses.map((h) => (
                <div key={h.id} onClick={() => setSelectedHouse(h)} className="p-6 flex items-center justify-between hover:bg-zinc-50 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-100 rounded-xl text-zinc-500"><Home size={20}/></div>
                    <div><h4 className="font-black text-zinc-900 text-sm">#{h.id}</h4><p className="text-[10px] text-zinc-400 font-bold uppercase">House ID</p></div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-zinc-300 uppercase">Captain</p>
                    <p className="text-xs font-black text-zinc-900">{h.captainName || 'N/A'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 bg-white border border-zinc-200 rounded-[40px] overflow-hidden relative shadow-2xl">
          <div ref={mapRef} className="h-full w-full" />
          {selectedHouse && (
            <aside className="absolute right-6 top-6 bottom-6 w-96 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-[32px] shadow-2xl z-[2000] p-10 flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div><h3 className="text-3xl font-black">House #{selectedHouse.id}</h3><p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">House ID</p></div>
                <button onClick={() => setSelectedHouse(null)}><X size={24} /></button>
              </div>
              <div className="space-y-8 flex-1">
                <div><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Captain</label><p className="text-lg font-black">{selectedHouse.captainName || 'N/A'}</p></div>
                <div><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Captain ID</label><p className="text-lg font-black">{selectedHouse.captainId || 'N/A'}</p></div>
                {selectedHouse.landId && (
                  <div><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Land ID</label><p className="text-lg font-black">{selectedHouse.landId}</p></div>
                )}
              </div>
              <Button 
                className="w-full h-16 rounded-[24px] text-[10px] font-black uppercase tracking-widest"
                onClick={() => {
                  setIsEditMode(true);
                  setFormData(selectedHouse);
                }}
              >
                Edit Composition
              </Button>
            </aside>
          )}
        </div>
      </div>

      {/* Create/Edit House Modal */}
      {(isCreateMode || isEditMode) && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8">
          <div 
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" 
            onClick={() => { 
              setIsCreateMode(false); 
              setIsEditMode(false); 
              setFormData({});
              if (formLeafletMap.current) {
                formLeafletMap.current.remove();
                formLeafletMap.current = null;
              }
              locationMarker.current = null;
            }} 
          />
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">
                {isCreateMode ? 'Register New House' : 'Edit House'}
              </h2>
              <button 
                onClick={() => { 
                  setIsCreateMode(false); 
                  setIsEditMode(false); 
                  setFormData({});
                  if (formLeafletMap.current) {
                    formLeafletMap.current.remove();
                    formLeafletMap.current = null;
                  }
                  locationMarker.current = null;
                }} 
                className="p-2 hover:bg-zinc-50 rounded-2xl"
              >
                <X size={24} />
              </button>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  // Prepare data for backend - map frontend fields to backend DTO
                  const submitData: Partial<House> = {
                    id: formData.id,
                    name: formData.name,
                    villageArea: formData.villageArea,
                    land: formData.land || formData.landId,
                    houseHolder: formData.houseHolder || formData.captainId,
                    latitude: formData.latitude || formData.coordinates?.latitude,
                    longitude: formData.longitude || formData.coordinates?.longitude,
                    members: formData.members || []
                  };

                  console.log('Submitting house data:', submitData);

                  if (isCreateMode) {
                    await api.createHouse(submitData);
                    alert('House created successfully!');
                  } else if (selectedHouse) {
                    await api.updateHouse(selectedHouse.id, submitData);
                    alert('House updated successfully!');
                  }
                  setIsCreateMode(false);
                  setIsEditMode(false);
                  setFormData({});
                  // Refresh houses list
                  const data = await api.getHouses();
                  setHouses(data);
                  if (selectedHouse && !isCreateMode) {
                    const updated = await api.getHouseById(selectedHouse.id);
                    setSelectedHouse(updated);
                  }
                } catch (error) {
                  console.error('Error saving house:', error);
                  alert('Failed to save house: ' + (error instanceof Error ? error.message : 'Unknown error'));
                }
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">House ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.id || ''}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    disabled={isEditMode}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5 disabled:bg-zinc-100"
                    placeholder="Enter House ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">House Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="House Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Autocomplete
                  label="House Holder (Owner)"
                  value={formData.houseHolder || formData.captainId || ''}
                  onChange={(personId, personName) => {
                    setFormData({ 
                      ...formData, 
                      houseHolder: personId,
                      captainId: personId,
                      captainName: personName
                    });
                  }}
                  placeholder="Search for house holder by name or NIC..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Village Area</label>
                  <input
                    type="text"
                    value={formData.villageArea || ''}
                    onChange={(e) => setFormData({ ...formData, villageArea: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Village Area"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Land ID</label>
                  <input
                    type="number"
                    value={formData.land || formData.landId || ''}
                    onChange={(e) => {
                      const landId = e.target.value ? parseInt(e.target.value) : undefined;
                      setFormData({ ...formData, land: landId, landId: landId });
                    }}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Land ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Select Location on Map</label>
                <div 
                  ref={formMapRef}
                  className="w-full h-96 rounded-2xl border border-zinc-100 overflow-hidden"
                  style={{ minHeight: '384px' }}
                />
                <p className="text-[9px] text-zinc-400">Click on the map to set the house location. You can drag the marker to adjust.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude || formData.coordinates?.latitude || ''}
                    onChange={(e) => {
                      const lat = e.target.value ? parseFloat(e.target.value) : undefined;
                      setFormData({ 
                        ...formData, 
                        latitude: lat,
                        coordinates: { 
                          latitude: lat || 0,
                          longitude: formData.longitude || formData.coordinates?.longitude || 0
                        }
                      });
                      // Update marker position
                      if (formLeafletMap.current && locationMarker.current && lat) {
                        const lng = formData.longitude || formData.coordinates?.longitude || 79.8612;
                        locationMarker.current.setLatLng([lat, lng]);
                        formLeafletMap.current.setView([lat, lng], formLeafletMap.current.getZoom());
                      }
                    }}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Latitude"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude || formData.coordinates?.longitude || ''}
                    onChange={(e) => {
                      const lng = e.target.value ? parseFloat(e.target.value) : undefined;
                      setFormData({ 
                        ...formData, 
                        longitude: lng,
                        coordinates: { 
                          latitude: formData.latitude || formData.coordinates?.latitude || 0,
                          longitude: lng || 0
                        }
                      });
                      // Update marker position
                      if (formLeafletMap.current && locationMarker.current && lng) {
                        const lat = formData.latitude || formData.coordinates?.latitude || 6.9271;
                        locationMarker.current.setLatLng([lat, lng]);
                        formLeafletMap.current.setView([lat, lng], formLeafletMap.current.getZoom());
                      }
                    }}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Longitude"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
                  onClick={() => { 
                    setIsCreateMode(false); 
                    setIsEditMode(false); 
                    setFormData({});
                    if (formLeafletMap.current) {
                      formLeafletMap.current.remove();
                      formLeafletMap.current = null;
                    }
                    locationMarker.current = null;
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-900 text-white shadow-xl"
                >
                  {isCreateMode ? 'Create House' : 'Update House'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
