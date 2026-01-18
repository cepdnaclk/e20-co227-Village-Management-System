import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, User } from 'lucide-react';
import { api, Person } from '../../services/api';

interface AutocompleteProps {
  value: string;
  onChange: (personId: string, personName: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Search by name or NIC...',
  label,
  disabled = false,
  required = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load selected person details when value changes
  useEffect(() => {
    if (value && !selectedPerson) {
      const loadPerson = async () => {
        try {
          const person = await api.getPersonById(value);
          setSelectedPerson(person);
          setSearchTerm(person.name || value);
        } catch (error) {
          console.error('Error loading person:', error);
        }
      };
      loadPerson();
    } else if (!value) {
      setSelectedPerson(null);
      setSearchTerm('');
    }
  }, [value]);

  // Debounced search
  const searchPersons = useCallback(async (term: string) => {
    if (term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const results = await api.searchPersons(term);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching persons:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchTerm && !selectedPerson) {
        searchPersons(searchTerm);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, selectedPerson, searchPersons]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setSearchTerm(person.name || person.id);
    setShowSuggestions(false);
    onChange(person.id, person.name || person.id);
  };

  const handleClear = () => {
    setSelectedPerson(null);
    setSearchTerm('');
    setShowSuggestions(false);
    onChange('', '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (selectedPerson) {
      setSelectedPerson(null);
      onChange('', '');
    }
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          {label} {required && '*'}
        </label>
      )}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className="w-full pl-12 pr-10 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900/5 disabled:bg-zinc-100 disabled:cursor-not-allowed"
          />
          {selectedPerson && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <X size={16} className="text-zinc-400" />
            </button>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-zinc-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto">
            {loading && (
              <div className="p-4 text-center text-zinc-400 text-sm">Searching...</div>
            )}
            {suggestions.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => handleSelect(person)}
                className="w-full p-4 flex items-center gap-3 hover:bg-zinc-50 transition-colors text-left border-b border-zinc-50 last:border-b-0"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-sm">
                  {person.name?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-900 truncate">{person.name || 'Unknown'}</p>
                  <p className="text-xs text-zinc-400 font-medium">{person.id}</p>
                  {person.phoneNumber && (
                    <p className="text-xs text-zinc-400">{person.phoneNumber}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
        {showSuggestions && !loading && searchTerm.length >= 2 && suggestions.length === 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-zinc-200 rounded-2xl shadow-2xl p-4 text-center text-zinc-400 text-sm">
            No persons found
          </div>
        )}
      </div>
    </div>
  );
};

