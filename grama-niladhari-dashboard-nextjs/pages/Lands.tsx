
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import { 
  Search, Plus, Maximize2, MapPin, 
  FileCheck, ClipboardList, Home, Layers, 
  Eye, Mountain, Navigation2, Compass, ArrowRight,
  Info, X, Map as MapIcon
} from 'lucide-react';
import { api, Land } from '../services/api';
import { Autocomplete } from '../components/ui/Autocomplete';

export const Lands: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Land>>({});
  const leafletMap = useRef<any>(null);
  const formMapRef = useRef<HTMLDivElement>(null);
  const formLeafletMap = useRef<any>(null);
  const drawnPolygon = useRef<any>(null);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await api.getLands(0, 100, 'id', 'ASC', searchTerm);
        setLands(response.lands || []);
      } catch (error) {
        console.error('Error fetching lands:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLands();
  }, [searchTerm]);

  // Calculate area in perches from polygon coordinates using spherical area calculation
  const calculateAreaInPerches = (coordinates: Array<{ latitude: number; longitude: number }>): number => {
    if (coordinates.length < 3) return 0;
    
    const R = 6378137; // Earth radius in meters (WGS84)
    let area = 0;
    const n = coordinates.length;
    
    // Convert to radians and calculate spherical area
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const lat1 = coordinates[i].latitude * Math.PI / 180;
      const lon1 = coordinates[i].longitude * Math.PI / 180;
      const lat2 = coordinates[j].latitude * Math.PI / 180;
      const lon2 = coordinates[j].longitude * Math.PI / 180;
      
      area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    
    // Calculate area in square meters
    const areaSqMeters = Math.abs(area * R * R / 2);
    
    // Convert square meters to perches (1 perch = 25.29285264 square meters)
    const perches = areaSqMeters / 25.29285264;
    return Math.round(perches * 100) / 100; // Round to 2 decimal places
  };

  useEffect(() => {
    // @ts-ignore
    const L = window.L;
    if (!L || !mapRef.current || (mapRef.current as any)._leaflet_id || lands.length === 0) return;

    try {
      const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([6.9271, 79.8612], 16);
      leafletMap.current = map;
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

      const landsGroup = L.featureGroup().addTo(map);

      lands.forEach(land => {
        if (land.coordinates && land.coordinates.length > 0) {
          const coords = land.coordinates.map(c => [c.latitude, c.longitude]);
          L.polygon(coords as any, { color: '#18181b', fillOpacity: 0.1, weight: 1.5 })
            .addTo(landsGroup)
            .on('click', (e: any) => {
              L.DomEvent.stopPropagation(e);
              setSelectedLand(land);
            });
        }
      });
    } catch (e) {
      console.error('Error initializing map:', e);
    }
  }, [lands]);

  // Initialize form map when modal opens
  useEffect(() => {
    // @ts-ignore
    const L = window.L;
    if (!L || !formMapRef.current || !(isCreateMode || isEditMode)) return;
    
    // Clean up previous map if exists
    if (formLeafletMap.current) {
      formLeafletMap.current.remove();
      formLeafletMap.current = null;
      drawnPolygon.current = null;
    }

    try {
      const map = L.map(formMapRef.current, { zoomControl: true, attributionControl: true }).setView([6.9271, 79.8612], 15);
      formLeafletMap.current = map;
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

      // Create editable layers group
      const editableLayers = L.featureGroup().addTo(map);
      
      // Add drawing control
      // @ts-ignore
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: false,
            shapeOptions: {
              color: '#18181b',
              fillColor: '#18181b',
              fillOpacity: 0.2,
              weight: 2
            }
          },
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: editableLayers,
          remove: true
        }
      });
      map.addControl(drawControl);

      // Handle polygon creation
      map.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        const geoJson = layer.toGeoJSON();
        const coordinates = geoJson.geometry.coordinates[0].map((coord: [number, number]) => ({
          latitude: coord[1], // GeoJSON uses [lng, lat]
          longitude: coord[0]
        }));

        // Remove previous polygon if exists
        if (drawnPolygon.current) {
          editableLayers.removeLayer(drawnPolygon.current);
        }

        // Add new polygon to editable group
        drawnPolygon.current = layer;
        editableLayers.addLayer(layer);

        // Calculate area and update form
        const area = calculateAreaInPerches(coordinates);
        setFormData({
          ...formData,
          coordinates,
          size: area
        });
      });

      // Handle polygon editing
      map.on(L.Draw.Event.EDITED, (e: any) => {
        const layers = e.layers;
        layers.eachLayer((layer: any) => {
          const geoJson = layer.toGeoJSON();
          const coordinates = geoJson.geometry.coordinates[0].map((coord: [number, number]) => ({
            latitude: coord[1],
            longitude: coord[0]
          }));

          const area = calculateAreaInPerches(coordinates);
          setFormData({
            ...formData,
            coordinates,
            size: area
          });
        });
      });

      // Handle polygon deletion
      map.on(L.Draw.Event.DELETED, () => {
        drawnPolygon.current = null;
        setFormData({
          ...formData,
          coordinates: undefined,
          size: 0
        });
      });

      // Load existing coordinates if editing
      if (isEditMode && formData.coordinates && formData.coordinates.length > 0) {
        const coords = formData.coordinates.map(c => [c.latitude, c.longitude]);
        const polygon = L.polygon(coords as any, {
          color: '#18181b',
          fillColor: '#18181b',
          fillOpacity: 0.2,
          weight: 2
        });
        drawnPolygon.current = polygon;
        editableLayers.addLayer(polygon);
        map.fitBounds(polygon.getBounds());
      }

      return () => {
        if (formLeafletMap.current) {
          formLeafletMap.current.remove();
          formLeafletMap.current = null;
        }
        drawnPolygon.current = null;
      };
    } catch (e) {
      console.error('Error initializing form map:', e);
    }
  }, [isCreateMode, isEditMode]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter text-left">Land Parcels</h1>
          <p className="text-zinc-500 mt-1">Registry of property boundaries and ownership.</p>
        </div>
        <Button 
          className="gap-2 h-11 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest"
          onClick={() => {
            setIsCreateMode(true);
            setFormData({});
            setSelectedLand(null);
          }}
        >
          <Plus size={16} /> New Entry
        </Button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-96 flex flex-col gap-4">
           <div className="bg-white border border-zinc-200 rounded-[32px] p-6 flex-1 overflow-y-auto">
             <div className="relative mb-6">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
               <input 
                 placeholder="Search parcels..." 
                 className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-bold"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <div className="space-y-2">
               {loading ? (
                 <div className="p-4 text-center text-zinc-400 text-xs">Loading...</div>
               ) : lands.length === 0 ? (
                 <div className="p-4 text-center text-zinc-400 text-xs">No lands found</div>
               ) : (
                 lands.map(land => (
                   <button 
                     key={land.id} 
                     onClick={() => setSelectedLand(land)}
                     className="w-full p-4 rounded-2xl border border-zinc-100 text-left hover:border-zinc-900 transition-all"
                   >
                     <p className="text-[8px] font-black text-zinc-400 uppercase mb-1">Parcel ID</p>
                     <p className="text-sm font-black text-zinc-900">LD-{land.id}</p>
                     {land.ownerName && (
                       <p className="text-[10px] text-zinc-400 mt-1">{land.ownerName}</p>
                     )}
                   </button>
                 ))
               )}
             </div>
           </div>
        </div>

        <div className="flex-1 bg-white border border-zinc-200 rounded-[40px] overflow-hidden relative shadow-2xl group">
          <div ref={mapRef} className="h-full w-full" />
          {selectedLand && (
            <aside className="absolute right-6 top-6 bottom-6 w-96 bg-white border border-zinc-200 rounded-[40px] shadow-2xl z-[1000] p-10 flex flex-col">
              <div className="flex justify-between mb-10">
                <h3 className="text-3xl font-black">LD-{selectedLand.id}</h3>
                <button onClick={() => setSelectedLand(null)}><X size={24} /></button>
              </div>
              <div className="space-y-8 flex-1">
                <div><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Land ID</label><p className="text-lg font-black">LD-{selectedLand.id}</p></div>
                <div><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Owner ID</label><p className="text-lg font-black">{selectedLand.owner || 'N/A'}</p></div>
                <div><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Owner Name</label><p className="text-lg font-black">{selectedLand.ownerName || 'N/A'}</p></div>
                <div><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Size (Perches)</label><p className="text-lg font-black">{selectedLand.size} {selectedLand.size === 1 ? 'Perch' : 'Perches'}</p></div>
                <div><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Land Type</label><p className="text-lg font-black">{selectedLand.landType || 'N/A'}</p></div>
                <div><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ownership</label><p className="text-lg font-black">{selectedLand.ownership || 'N/A'}</p></div>
                <div><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Coordinates</label><p className="text-xs font-medium text-zinc-600">{selectedLand.coordinates?.length || 0} points</p></div>
              </div>
              <Button 
                className="w-full h-16 rounded-[24px] text-[10px] font-black uppercase tracking-widest"
                onClick={() => {
                  setIsEditMode(true);
                  setFormData(selectedLand);
                }}
              >
                Update Parcel Data
              </Button>
            </aside>
          )}
        </div>
      </div>

      {/* Create/Edit Land Modal */}
      {(isCreateMode || isEditMode) && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => { setIsCreateMode(false); setIsEditMode(false); setFormData({}); }} />
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">
                {isCreateMode ? 'Register New Land Parcel' : 'Edit Land Parcel'}
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
                  drawnPolygon.current = null;
                }} 
                className="p-2 hover:bg-zinc-50 rounded-2xl"
              >
                <X size={24} />
              </button>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                if (!formData.coordinates || formData.coordinates.length < 3) {
                  alert('Please select a land area on the map first.');
                  return;
                }
                try {
                  if (isCreateMode) {
                    await api.createLand(formData);
                    alert('Land created successfully!');
                  } else if (selectedLand) {
                    await api.updateLand(selectedLand.id, formData);
                    alert('Land updated successfully!');
                  }
                  setIsCreateMode(false);
                  setIsEditMode(false);
                  setFormData({});
                  if (formLeafletMap.current) {
                    formLeafletMap.current.remove();
                    formLeafletMap.current = null;
                  }
                  drawnPolygon.current = null;
                  // Refresh lands list
                  const response = await api.getLands(0, 100, 'id', 'ASC', searchTerm);
                  setLands(response.lands || []);
                  if (selectedLand && !isCreateMode) {
                    const updated = await api.getLandById(selectedLand.id);
                    setSelectedLand(updated);
                  }
                } catch (error) {
                  console.error('Error saving land:', error);
                  alert('Failed to save land. Please try again.');
                }
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Select Land Area on Map *</label>
                <div 
                  ref={formMapRef}
                  className="w-full h-96 rounded-2xl border border-zinc-100 overflow-hidden"
                  style={{ minHeight: '384px' }}
                />
                <p className="text-[9px] text-zinc-400">Click the polygon tool in the top-left corner of the map to draw the land boundary</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Size (Perches) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    disabled
                    value={formData.size || ''}
                    className="w-full p-4 bg-zinc-100 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-600 cursor-not-allowed"
                    placeholder="Auto-calculated from map"
                  />
                  <p className="text-[9px] text-zinc-400">Automatically calculated from selected area</p>
                </div>
                <div className="space-y-2">
                  <Autocomplete
                    label="Owner"
                    value={formData.owner || ''}
                    onChange={(personId, personName) => {
                      setFormData({ 
                        ...formData, 
                        owner: personId,
                        ownerName: personName
                      });
                    }}
                    placeholder="Search for owner by name or NIC..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Land Type</label>
                  <input
                    type="text"
                    value={formData.landType || ''}
                    onChange={(e) => setFormData({ ...formData, landType: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="e.g. Residential, Agricultural"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Ownership</label>
                  <input
                    type="text"
                    value={formData.ownership || ''}
                    onChange={(e) => setFormData({ ...formData, ownership: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="e.g. Freehold, Leasehold"
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
                    drawnPolygon.current = null;
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-900 text-white shadow-xl"
                >
                  {isCreateMode ? 'Create Land' : 'Update Land'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
