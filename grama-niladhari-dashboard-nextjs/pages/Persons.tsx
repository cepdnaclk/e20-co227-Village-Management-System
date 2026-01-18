import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Search, Filter, ArrowRight, Heart, Users, X, Network, Info, UserPlus, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, Person, PersonRelationship } from '../services/api';

interface PersonWithRelationships extends Person {
  relationships?: PersonRelationship[];
  age?: number;
  image?: string;
}

export const Persons: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'family'>('profile');
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonWithRelationships | null>(null);
  const [relationships, setRelationships] = useState<PersonRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Person>>({});

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await api.getPersons(0, 100, 'id', 'ASC');
        setPersons(response.persons || []);
      } catch (error) {
        console.error('Error fetching persons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersons();
  }, []);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      if (selectedId) {
        try {
          const [personData, relationshipsData] = await Promise.all([
            api.getPersonById(selectedId),
            api.getRelationshipsByPersonId(selectedId)
          ]);
          if (personData) {
            setSelectedPerson({
              ...personData,
              relationships: relationshipsData,
              age: personData.dob ? new Date().getFullYear() - new Date(personData.dob).getFullYear() : undefined,
              image: `https://picsum.photos/seed/${personData.id}/200/200`
            });
            setRelationships(relationshipsData);
          }
        } catch (error) {
          console.error('Error fetching person details:', error);
        }
      }
    };
    fetchPersonDetails();
  }, [selectedId]);

  const filteredPersons = useMemo(() => {
    if (!search) return persons;
    return persons.filter(p => 
      (p.name?.toLowerCase().includes(search.toLowerCase()) || '') ||
      (p.id?.toLowerCase().includes(search.toLowerCase()) || '')
    );
  }, [search, persons]);

  const handleNodeClick = (id: string) => {
    setSelectedId(id);
    setActiveTab('profile');
  };

  const calculateAge = (dob?: string): number => {
    if (!dob) return 0;
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  const FamilyTreeNode = ({ name, type, age, id, isSubject = false }: { name: string; type: string; age: number; id: string; isSubject?: boolean }) => {
    const getRelationshipLabel = (relType: string) => {
      const labels: Record<string, string> = {
        'FATHER': 'FATHER',
        'MOTHER': 'MOTHER',
        'SON': 'SON',
        'DAUGHTER': 'DAUGHTER',
        'HUSBAND': 'SPOUSE',
        'WIFE': 'SPOUSE',
        'BROTHER': 'SIBLING',
        'SISTER': 'SIBLING',
        'GRANDFATHER': 'GRANDFATHER',
        'GRANDMOTHER': 'GRANDMOTHER',
      };
      return labels[relType] || relType;
    };
    
    return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: isSubject ? 1.05 : 1 }}
      whileHover={{ y: -3, scale: isSubject ? 1.08 : 1.03 }}
      onClick={(e) => {
        e.stopPropagation();
        handleNodeClick(id);
      }}
      className={`group cursor-pointer p-5 rounded-3xl border transition-all text-center min-w-[160px] relative z-20 ${
        isSubject 
          ? 'bg-zinc-900 border-zinc-900 text-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)]' 
          : 'bg-white border-zinc-200 hover:border-zinc-900 shadow-sm'
      }`}
    >
      <div className={`text-[8px] font-black uppercase tracking-[0.25em] mb-2 px-2 py-0.5 rounded-full inline-block ${isSubject ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-50 text-zinc-400'}`}>
        {isSubject ? 'IDENTITY' : getRelationshipLabel(type)}
      </div>
      <p className="text-xs font-black truncate leading-tight tracking-tight">{name}</p>
      <div className="flex items-center justify-center gap-2 mt-3">
        {age > 0 && <span className={`text-[10px] font-bold ${isSubject ? 'text-zinc-500' : 'text-zinc-400'}`}>{age}y</span>}
        {!isSubject && age > 0 && <div className="w-1 h-1 rounded-full bg-zinc-200" />}
        {!isSubject && <ArrowRight size={10} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />}
      </div>
    </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">Village Population</h1>
          <p className="text-zinc-500 mt-1 font-medium">Divisional registry for genealogical and administrative records.</p>
        </div>
        <Button 
          className="h-11 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-zinc-100 flex items-center gap-2"
          onClick={() => {
            setIsCreateMode(true);
            setFormData({});
            setSelectedId(null);
          }}
        >
          <UserPlus size={14} /> Register Resident
        </Button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* List Section */}
        <div className="flex-1 bg-white border border-zinc-200 rounded-[32px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-zinc-100 flex gap-4 bg-zinc-50/50">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
              <input 
                placeholder="Search by Identity (NIC), Full Name, or Address..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all"><Filter size={18}/></Button>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-50 px-2 scrollbar-hide">
            {loading ? (
              <div className="p-6 text-center text-zinc-400">Loading...</div>
            ) : filteredPersons.length === 0 ? (
              <div className="p-6 text-center text-zinc-400">No persons found</div>
            ) : (
              filteredPersons.map((person) => (
                <div 
                  key={person.id}
                  onClick={() => { setSelectedId(person.id); setActiveTab('profile'); }}
                  className={`p-6 flex items-center justify-between hover:bg-zinc-50 cursor-pointer transition-all rounded-2xl group ${selectedId === person.id ? 'bg-zinc-50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-[18px] bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-sm shadow-sm border border-zinc-100">
                        {person.name?.[0] || '?'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Active Registry" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-sm tracking-tight">{person.name || 'Unknown'}</h3>
                      <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-0.5 leading-none">{person.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right hidden xl:block">
                      <p className="text-[10px] text-zinc-300 font-black uppercase tracking-widest">Household ID</p>
                      <p className="text-sm font-black text-zinc-900 mt-0.5">#{person.house || 'N/A'}</p>
                    </div>
                    <ArrowRight size={18} className="text-zinc-200 group-hover:text-zinc-900 transition-all translate-x-0 group-hover:translate-x-1" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profile/Detail Drawer Section */}
        <aside className="w-[580px] bg-white border border-zinc-200 rounded-[40px] overflow-hidden flex flex-col shadow-sm animate-in slide-in-from-right-4 duration-500 relative">
          {!selectedPerson ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-16 space-y-10">
              <div className="w-40 h-40 bg-zinc-50 rounded-[56px] text-zinc-200 shadow-inner flex items-center justify-center relative overflow-hidden group">
                <Users size={80} className="group-hover:scale-110 transition-transform duration-1000 opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
              </div>
              <div className="max-w-[320px]">
                <h3 className="text-xl font-black text-zinc-900 mb-3 tracking-tighter uppercase tracking-[0.1em]">Population Archive</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">Select a resident from the population list to view their administrative metadata, spatial records, and genealogical network.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Detail Header */}
              <div className="px-10 pt-10 space-y-8">
                <div className="flex justify-between items-start">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative"
                  >
                    <img 
                      src={selectedPerson.image} 
                      alt={selectedPerson.fullName} 
                      className="w-24 h-24 rounded-[32px] object-cover shadow-2xl ring-8 ring-zinc-50" 
                    />
                    <div className="absolute -bottom-2 -right-2 p-2 bg-zinc-900 text-white rounded-2xl shadow-xl">
                      <FileCheck size={16} />
                    </div>
                  </motion.div>
                  <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-zinc-50" onClick={() => setSelectedId(null)}>
                    <X size={20} className="text-zinc-400" />
                  </Button>
                </div>
                
                <div className="animate-in slide-in-from-left duration-500">
                  <h2 className="text-4xl font-black text-zinc-900 tracking-tighter leading-none">{selectedPerson.name || 'Unknown'}</h2>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.25em]">{selectedPerson.id}</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-200" />
                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.25em]">Resident</span>
                  </div>
                </div>

                <div className="flex border-b border-zinc-100">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`pb-5 px-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === 'profile' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                  >
                    Metadata
                    {activeTab === 'profile' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 w-full h-1 bg-zinc-900 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab('family')}
                    className={`pb-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === 'family' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                  >
                    Genealogical Graph
                    {activeTab === 'family' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 w-full h-1 bg-zinc-900 rounded-full" />}
                  </button>
                </div>
              </div>

              {/* Tab Content Area */}
              <div className="flex-1 overflow-y-auto px-10 py-10 scrollbar-hide">
                <AnimatePresence mode="wait">
                  {activeTab === 'profile' ? (
                    <motion.div 
                      key="profile"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="space-y-12 pb-10"
                    >
                      <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">NIC / ID</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.id || 'N/A'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Name</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.name || 'N/A'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Chronological Age</label>
                          <p className="text-base font-black text-zinc-900">{calculateAge(selectedPerson.dob)} Years</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Date of Birth</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.dob ? new Date(selectedPerson.dob).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Phone Number</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.phoneNumber || 'N/A'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Gender</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.gender || 'N/A'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Occupation</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.occupation || 'N/A'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Income</label>
                          <p className="text-base font-black text-zinc-900">LKR {selectedPerson.income?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Behavior</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.behavior || 'N/A'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Health</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.health || 'N/A'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Religion</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.religion || 'N/A'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Nation</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.nation || 'N/A'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">House ID</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.house || 'N/A'}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Lands Count</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.lands?.length || 0}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Funds Count</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.funds?.length || 0}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Complaints Count</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.complains?.length || 0}</p>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] leading-none block">Requests Count</label>
                          <p className="text-base font-black text-zinc-900">{selectedPerson.requests?.length || 0}</p>
                        </div>
                      </div>

                      <div className="pt-6 grid grid-cols-2 gap-4">
                        <Button 
                          variant="outline" 
                          className="h-16 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] border-zinc-200 hover:bg-zinc-50"
                          onClick={() => {
                            setIsEditMode(true);
                            setFormData(selectedPerson);
                          }}
                        >
                          Edit Person
                        </Button>
                        <Button className="h-16 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-900 text-white shadow-2xl shadow-zinc-100 transition-transform active:scale-95">
                          View Documents
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="family"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="min-h-full flex flex-col items-center py-6"
                    >
                      <div className="w-full relative">
                        <div className="flex flex-col items-center relative z-10">
                          
                          {/* ANCESTRAL LEVEL */}
                          <div className="flex gap-10 mb-16 relative">
                            {relationships.filter(r => ['FATHER', 'MOTHER', 'GRANDFATHER', 'GRANDMOTHER'].includes(r.relationshipType)).map((rel) => {
                              const relatedPerson = rel.person1Id === selectedPerson.id ? rel.person2Id : rel.person1Id;
                              return (
                                <div key={rel.id} className="relative">
                                  <FamilyTreeNode 
                                    id={relatedPerson}
                                    name={rel.person1Id === selectedPerson.id ? rel.person2Name : rel.person1Name}
                                    type={rel.relationshipType}
                                    age={0}
                                  />
                                  <div className="absolute left-1/2 bottom-[-40px] w-px h-[40px] bg-zinc-200" />
                                </div>
                              );
                            })}
                            {relationships.filter(r => ['FATHER', 'MOTHER'].includes(r.relationshipType)).length === 0 && (
                              <div className="p-10 rounded-[40px] border border-zinc-100 border-dashed text-center min-w-[180px] opacity-30 flex flex-col items-center justify-center">
                                <Info size={24} className="mb-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest">No Ascendants</span>
                              </div>
                            )}
                          </div>

                          {/* CORE LEVEL */}
                          <div className="flex items-center gap-12 relative my-10">
                            {relationships.some(r => ['FATHER', 'MOTHER'].includes(r.relationshipType)) && (
                              <div className="absolute -top-[50px] left-1/2 -translate-x-1/2 w-px h-[50px] bg-zinc-200 z-0" />
                            )}
                            
                            <FamilyTreeNode 
                              id={selectedPerson.id} 
                              name={selectedPerson.name || 'Unknown'} 
                              type="Identity" 
                              age={calculateAge(selectedPerson.dob)} 
                              isSubject 
                            />
                            
                            {relationships.find(r => ['HUSBAND', 'WIFE'].includes(r.relationshipType)) && (() => {
                              const spouse = relationships.find(r => ['HUSBAND', 'WIFE'].includes(r.relationshipType))!;
                              const spouseId = spouse.person1Id === selectedPerson.id ? spouse.person2Id : spouse.person1Id;
                              const spouseName = spouse.person1Id === selectedPerson.id ? spouse.person2Name : spouse.person1Name;
                              return (
                                <>
                                  <div className="w-12 h-px bg-zinc-200 flex items-center justify-center relative">
                                    <motion.div 
                                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                      transition={{ repeat: Infinity, duration: 4 }}
                                      className="p-1.5 bg-white border border-zinc-100 rounded-full shadow-sm"
                                    >
                                      <Heart size={10} className="text-zinc-300 fill-zinc-100" />
                                    </motion.div>
                                  </div>
                                  <FamilyTreeNode 
                                    id={spouseId}
                                    name={spouseName}
                                    type={spouse.relationshipType}
                                    age={0}
                                  />
                                </>
                              );
                            })()}
                          </div>

                          {/* DESCENDANT LEVEL */}
                          {relationships.some(r => ['SON', 'DAUGHTER'].includes(r.relationshipType)) && (
                            <>
                              <div className="w-px h-12 bg-zinc-200 z-0" />
                              <div className="flex gap-10 mt-12 relative">
                                {relationships.filter(r => ['SON', 'DAUGHTER'].includes(r.relationshipType)).map(rel => {
                                  const childId = rel.person1Id === selectedPerson.id ? rel.person2Id : rel.person1Id;
                                  const childName = rel.person1Id === selectedPerson.id ? rel.person2Name : rel.person1Name;
                                  return (
                                    <div key={rel.id} className="relative">
                                      <div className="absolute -top-12 left-1/2 w-px h-12 bg-zinc-200 z-0" />
                                      <FamilyTreeNode 
                                        id={childId}
                                        name={childName}
                                        type={rel.relationshipType}
                                        age={0}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          )}

                          {/* COLLATERAL KINSHIP */}
                          {relationships.some(r => ['BROTHER', 'SISTER'].includes(r.relationshipType)) && (
                            <div className="mt-20 w-full pt-12 border-t border-zinc-50 border-dashed">
                               <p className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.3em] mb-8 text-center">Collateral Siblings</p>
                               <div className="flex flex-wrap justify-center gap-4">
                                {relationships.filter(r => ['BROTHER', 'SISTER'].includes(r.relationshipType)).map(rel => {
                                  const siblingId = rel.person1Id === selectedPerson.id ? rel.person2Id : rel.person1Id;
                                  const siblingName = rel.person1Id === selectedPerson.id ? rel.person2Name : rel.person1Name;
                                  return (
                                    <motion.button 
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      key={rel.id}
                                      onClick={() => handleNodeClick(siblingId)}
                                      className="px-8 py-4 bg-zinc-50 border border-zinc-100 rounded-[24px] text-[10px] font-black text-zinc-500 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all uppercase tracking-widest shadow-sm flex items-center gap-3"
                                    >
                                      {siblingName}
                                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100" />
                                    </motion.button>
                                  );
                                })}
                               </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-20 p-8 bg-zinc-50 border border-zinc-100 rounded-[40px] flex gap-6 items-start">
                        <div className="p-4 bg-white text-zinc-900 rounded-3xl shadow-sm border border-zinc-100 flex-shrink-0">
                          <Network size={24} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 leading-none">Graph Orchestration</p>
                          <p className="text-xs text-zinc-400 leading-relaxed font-medium">Relationships are reactive. Select any biological node to re-pivot the registry core and explore kinship networks in real-time.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Create/Edit Person Modal */}
      {(isCreateMode || isEditMode) && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => { setIsCreateMode(false); setIsEditMode(false); setFormData({}); }} />
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">
                {isCreateMode ? 'Register New Resident' : 'Edit Resident'}
              </h2>
              <button onClick={() => { setIsCreateMode(false); setIsEditMode(false); setFormData({}); }} className="p-2 hover:bg-zinc-50 rounded-2xl">
                <X size={24} />
              </button>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  // Prepare data for backend - ensure DOB is in correct format
                  const submitData: Partial<Person> = {
                    ...formData,
                    dob: formData.dob || undefined, // Keep as date string, backend will parse
                    income: formData.income || 0,
                    funds: formData.funds || [],
                    lands: formData.lands || [],
                    complains: formData.complains || [],
                    requests: formData.requests || []
                  };

                  console.log('Submitting person data:', submitData);

                  if (isCreateMode) {
                    await api.createPerson(submitData);
                    alert('Person created successfully!');
                  } else if (selectedPerson) {
                    await api.updatePerson(selectedPerson.id, submitData);
                    alert('Person updated successfully!');
                  }
                  setIsCreateMode(false);
                  setIsEditMode(false);
                  setFormData({});
                  // Refresh persons list
                  const response = await api.getPersons(0, 100, 'id', 'ASC');
                  setPersons(response.persons || []);
                  if (selectedPerson && !isCreateMode) {
                    const updated = await api.getPersonById(selectedPerson.id);
                    setSelectedPerson({ ...updated, relationships, age: updated.dob ? calculateAge(updated.dob) : undefined, image: selectedPerson.image });
                  }
                } catch (error) {
                  console.error('Error saving person:', error);
                  alert('Failed to save person: ' + (error instanceof Error ? error.message : 'Unknown error'));
                }
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">NIC / ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.id || ''}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    disabled={isEditMode}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Enter NIC"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob ? formData.dob.split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Gender</label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'MALE' | 'FEMALE' })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation || ''}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Occupation"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Income</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.income || ''}
                    onChange={(e) => setFormData({ ...formData, income: parseFloat(e.target.value) || 0 })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">House ID</label>
                  <input
                    type="text"
                    value={formData.house || ''}
                    onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="House ID"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Behavior</label>
                  <input
                    type="text"
                    value={formData.behavior || ''}
                    onChange={(e) => setFormData({ ...formData, behavior: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Behavior"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Health</label>
                  <input
                    type="text"
                    value={formData.health || ''}
                    onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Health Status"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Religion</label>
                  <input
                    type="text"
                    value={formData.religion || ''}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Religion"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Nation</label>
                  <input
                    type="text"
                    value={formData.nation || ''}
                    onChange={(e) => setFormData({ ...formData, nation: e.target.value })}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5"
                    placeholder="Nation"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
                  onClick={() => { setIsCreateMode(false); setIsEditMode(false); setFormData({}); }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-900 text-white shadow-xl"
                >
                  {isCreateMode ? 'Create Person' : 'Update Person'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
