import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import { 
  Plus, Home, Layers, 
  Navigation2, ArrowRight,
  Route, X, Map as MapIcon, Shield, 
  Activity, ZoomIn, ZoomOut,
  MousePointer2, Building2, Trees, Tractor,
  Maximize, MoreVertical, Search
} from 'lucide-react';

type ViewMode = 'blueprint' | 'satellite' | 'terrain';

interface SpatialLand {
  id: string;
  coords: [number, number][];
  owner: string;
  type: 'Residential' | 'Agricultural' | 'Commercial';
  area: string;
  value: string;
}

interface SpatialHouse {
  id: string;
  pos: [number, number];
  number: string;
  owner: string;
  residents: number;
}

const MOCK_LANDS: SpatialLand[] = [
  { 
    id: 'LD-4000', 
    coords: [[6.9271, 79.8612], [6.9285, 79.8632], [6.9265, 79.8642], [6.9255, 79.8622]], 
    owner: 'Nimal Sirisena', 
    type: 'Residential',
    area: '42.5 Perches',
    value: 'LKR 12.5M'
  },
  { 
    id: 'LD-4001', 
    coords: [[6.9281, 79.8622], [6.9295, 79.8642], [6.9275, 79.8652], [6.9265, 79.8632]], 
    owner: 'Kamal Perera', 
    type: 'Agricultural',
    area: '85.0 Perches',
    value: 'LKR 8.2M'
  },
  { 
    id: 'LD-4002', 
    coords: [[6.9291, 79.8632], [6.9305, 79.8652], [6.9285, 79.8662], [6.9275, 79.8642]], 
    owner: 'Saman Kumara', 
    type: 'Commercial',
    area: '22.1 Perches',
    value: 'LKR 45.0M'
  },
];

const MOCK_HOUSES: SpatialHouse[] = [
  { id: 'H-101', pos: [6.9268, 79.8625], number: '124B', owner: 'Sunil Gamage', residents: 5 },
  { id: 'H-102', pos: [6.9260, 79.8638], number: '12C', owner: 'Nimali Silva', residents: 3 },
  { id: 'H-103', pos: [6.9295, 79.8648], number: '88/2', owner: 'Aruni Silva', residents: 4 },
];

const MOCK_ROADS = [
  { name: 'Main Road', coords: [[6.9250, 79.8600], [6.9300, 79.8680]], type: 'primary' },
  { name: 'Green Lane', coords: [[6.9265, 79.8620], [6.9285, 79.8625]], type: 'secondary' },
  { name: 'Temple Road', coords: [[6.9285, 79.8625], [6.9280, 79.8660]], type: 'secondary' },
];

export const VirtualVillage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('blueprint');
  const [activeLayers, setActiveLayers] = useState({
    lands: true,
    houses: true,
    roads: true,
  });

  const leafletMap = useRef<any>(null);
  const layersRef = useRef<any>({});

  const getLandStyle = (type: string) => {
    switch (type) {
      case 'Residential': return { color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 2 };
      case 'Agricultural': return { color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1, weight: 2 };
      case 'Commercial': return { color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, weight: 2 };
      default: return { color: '#18181b', fillColor: '#18181b', fillOpacity: 0.05, weight: 1.5 };
    }
  };

  const getRoadStyle = (type: string) => {
    switch (type) {
      case 'primary': return { color: '#18181b', weight: 6, opacity: 0.4 };
      case 'secondary': return { color: '#3f3f46', weight: 4, opacity: 0.3, dashArray: '8, 8' };
      default: return { color: '#18181b', weight: 2, opacity: 0.2 };
    }
  };

  useEffect(() => {
    // @ts-ignore
    const L = window.L;
    if (!L || !mapRef.current || (mapRef.current as any)._leaflet_id) return;

    try {
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([6.9271, 79.8612], 16);
      
      leafletMap.current = map;

      // Base Layers
      const blueprint = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png');
      const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
      const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');

      layersRef.current = { blueprint, satellite, terrain };
      blueprint.addTo(map);

      // Feature Layers
      const roadsLayer = L.featureGroup().addTo(map);
      MOCK_ROADS.forEach(road => {
        L.polyline(road.coords as any, getRoadStyle(road.type))
          .addTo(roadsLayer)
          .bindTooltip(road.name, { sticky: true, className: 'bg-zinc-900 text-white border-none rounded-lg text-[10px] px-2 py-1 font-bold' });
      });

      const landsLayer = L.featureGroup().addTo(map);
      MOCK_LANDS.forEach(land => {
        const polygon = L.polygon(land.coords as any, getLandStyle(land.type)).addTo(landsLayer);
        polygon.on('click', (e: any) => {
          L.DomEvent.stopPropagation(e);
          setSelectedAsset({ ...land, type: 'Land' });
        });
        polygon.on('mouseover', () => {
          polygon.setStyle({ fillOpacity: 0.3 });
        });
        polygon.on('mouseout', () => {
          polygon.setStyle({ fillOpacity: 0.1 });
        });
      });

      const housesLayer = L.featureGroup().addTo(map);
      MOCK_HOUSES.forEach(house => {
        const icon = L.divIcon({ 
          html: `<div class="w-8 h-8 bg-white border-2 border-zinc-900 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`, 
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        L.marker(house.pos as any, { icon })
          .addTo(housesLayer)
          .on('click', (e: any) => {
            L.DomEvent.stopPropagation(e);
            setSelectedAsset({ ...house, type: 'House' });
          });
      });

      layersRef.current.roadsLayer = roadsLayer;
      layersRef.current.landsLayer = landsLayer;
      layersRef.current.housesLayer = housesLayer;

      // Handle map click to deselect
      map.on('click', () => setSelectedAsset(null));

    } catch (e) {
      console.error("Leaflet init error:", e);
    }
  }, []);

  // Sync Base Layers
  useEffect(() => {
    if (!leafletMap.current) return;
    const { blueprint, satellite, terrain } = layersRef.current;
    if (!blueprint || !satellite || !terrain) return;

    [blueprint, satellite, terrain].forEach(l => {
      if (leafletMap.current.hasLayer(l)) leafletMap.current.removeLayer(l);
    });
    
    if (layersRef.current[viewMode]) {
      layersRef.current[viewMode].addTo(leafletMap.current);
    }
  }, [viewMode]);

  // Sync Feature Visibility
  useEffect(() => {
    if (!leafletMap.current) return;
    const { roadsLayer, landsLayer, housesLayer } = layersRef.current;
    if (!roadsLayer || !landsLayer || !housesLayer) return;

    if (activeLayers.roads) leafletMap.current.addLayer(roadsLayer); else leafletMap.current.removeLayer(roadsLayer);
    if (activeLayers.lands) leafletMap.current.addLayer(landsLayer); else leafletMap.current.removeLayer(landsLayer);
    if (activeLayers.houses) leafletMap.current.addLayer(housesLayer); else leafletMap.current.removeLayer(housesLayer);
  }, [activeLayers]);

  const zoomIn = () => leafletMap.current?.zoomIn();
  const zoomOut = () => leafletMap.current?.zoomOut();
  const resetCenter = () => leafletMap.current?.setView([6.9271, 79.8612], 16);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">Virtual Village</h1>
          <p className="text-zinc-500 font-medium text-sm">2D spatial twin with real-time registry synchronization.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white border border-zinc-200 rounded-2xl p-1 flex gap-1 shadow-sm ring-1 ring-black/5">
             {(['blueprint', 'satellite', 'terrain'] as ViewMode[]).map((mode) => (
               <button 
                key={mode} 
                onClick={() => setViewMode(mode)} 
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:bg-zinc-50'}`}
               >
                 {mode}
               </button>
             ))}
           </div>
           <Button className="h-11 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Plus size={14} /> New Registry Object</Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 relative">
        {/* Layer Manifest Sidebar */}
        <aside className="w-64 bg-white border border-zinc-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Layer Manifest</h3>
            <Layers size={14} className="text-zinc-300" />
          </div>
          <div className="p-4 space-y-2 flex-1">
            {[
              { id: 'lands', label: 'Land Registry', icon: MapIcon },
              { id: 'houses', label: 'Housing Assets', icon: Home },
              { id: 'roads', label: 'Infrastructure', icon: Route },
            ].map((layer) => (
              <button 
                key={layer.id} 
                onClick={() => setActiveLayers(p => ({...p, [layer.id]: !p[layer.id as keyof typeof activeLayers]}))} 
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${activeLayers[layer.id as keyof typeof activeLayers] ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' : 'text-zinc-500 hover:bg-zinc-50'}`}
              >
                <div className="flex items-center gap-3"><layer.icon size={16}/><span className="text-[11px] font-bold">{layer.label}</span></div>
                <div className={`w-1.5 h-1.5 rounded-full ${activeLayers[layer.id as keyof typeof activeLayers] ? 'bg-emerald-400' : 'bg-zinc-200'}`} />
              </button>
            ))}
          </div>
          <div className="p-6 border-t border-zinc-50 space-y-4">
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
               <div className="flex items-center gap-2 text-[9px] font-black uppercase text-emerald-600 mb-2"><Shield size={12} /> Encrypted Twin</div>
               <p className="text-[10px] text-emerald-800 leading-tight font-medium">GIS spatial data is synchronized with the State Registry core v2.4.</p>
            </div>
          </div>
        </aside>

        {/* Map Container */}
        <div className="flex-1 bg-white border border-zinc-200 rounded-[40px] overflow-hidden relative shadow-2xl group ring-1 ring-black/5">
          <div ref={mapRef} className="h-full w-full" />
          
          {/* Navigation Controls */}
          <div className="absolute left-6 bottom-6 flex flex-col gap-2 z-[1000]">
             <div className="flex flex-col gap-1 bg-white/90 backdrop-blur-md border border-zinc-200 p-1 rounded-2xl shadow-xl">
               <button onClick={zoomIn} className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 rounded-xl transition-colors text-zinc-900"><ZoomIn size={18} /></button>
               <button onClick={zoomOut} className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 rounded-xl transition-colors text-zinc-900"><ZoomOut size={18} /></button>
               <div className="h-px bg-zinc-100 mx-2 my-0.5" />
               <button onClick={resetCenter} className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 rounded-xl transition-colors text-zinc-900"><Maximize size={16} /></button>
             </div>
          </div>

          {/* Quick Stats Overlay */}
          <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-3">
             <div className="bg-white/90 backdrop-blur-md border border-zinc-200 rounded-2xl p-4 shadow-xl flex items-center gap-4">
                <div className="p-2 bg-zinc-900 rounded-xl text-white"><Activity size={16} /></div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 leading-none mb-1">Live Feed</p>
                  <p className="text-xs font-black text-zinc-900">142 Active Nodes</p>
                </div>
             </div>
          </div>

          {/* Contextual Detail Panel */}
          {selectedAsset && (
            <aside className="absolute right-6 top-6 bottom-6 w-80 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-[32px] shadow-2xl z-[2000] p-8 flex flex-col animate-in slide-in-from-right duration-500 border-l-8 border-l-zinc-900">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-zinc-900 leading-none">{selectedAsset.id}</h3>
                  <p className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em] mt-2">{selectedAsset.type} Manifest</p>
                </div>
                <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                <div className="space-y-4">
                   <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                     <label className="text-[8px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Owner of Record</label>
                     <p className="font-black text-sm text-zinc-900">{selectedAsset.owner || selectedAsset.number}</p>
                   </div>

                   {selectedAsset.type === 'Land' && (
                     <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                          <label className="text-[8px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Usage Type</label>
                          <div className="flex items-center gap-2">
                             {selectedAsset.type === 'Land' && selectedAsset.type === 'Agricultural' ? <Tractor size={12} className="text-emerald-500" /> : <Building2 size={12} className="text-blue-500" />}
                             <p className="font-black text-xs text-zinc-900">{selectedAsset.type}</p>
                          </div>
                        </div>
                        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                          <label className="text-[8px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Market Value</label>
                          <p className="font-black text-xs text-zinc-900">{selectedAsset.value || 'N/A'}</p>
                        </div>
                     </div>
                   )}

                   {selectedAsset.type === 'House' && (
                     <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                       <label className="text-[8px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Occupancy</label>
                       <p className="font-black text-sm text-zinc-900">{selectedAsset.residents} Residents</p>
                     </div>
                   )}

                   <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                     <label className="text-[8px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Area Mapping</label>
                     <p className="font-black text-sm text-zinc-900">{selectedAsset.area || 'N/A'}</p>
                   </div>
                </div>

                <div className="p-4 bg-zinc-900 text-white rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <Search size={14} className="text-zinc-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Digital Audit</span>
                   </div>
                   <ArrowRight size={14} className="text-zinc-500" />
                </div>
              </div>

              <div className="pt-6 mt-auto border-t border-zinc-100 flex flex-col gap-2">
                 <Button className="w-full h-12 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-zinc-100">Modify Attributes</Button>
                 <Button variant="outline" className="w-full h-12 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em]">Request Resurvey</Button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};