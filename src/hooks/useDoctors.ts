import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Doctor, Specialty, DoctorSortOption } from '../types/doctor';

export function useDoctors() {
  const { doctors, loading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<DoctorSortOption>('recommended');

  const filteredDoctors = useMemo(() => {
    let result = [...doctors];

    // Search query (name, specialty, role, city)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.role.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.address.toLowerCase().includes(q)
      );
    }

    // Specialty filter
    if (selectedSpecialty !== 'all') {
      result = result.filter(d => d.specialty.toLowerCase() === selectedSpecialty.toLowerCase());
    }

    // City filter
    if (selectedCity !== 'all') {
      result = result.filter(d => d.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience-desc':
        result.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case 'recommended':
      default:
        result.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));
        break;
    }

    return result;
  }, [doctors, searchQuery, selectedSpecialty, selectedCity, sortBy]);

  const nearbyDoctors = useMemo(() => {
    return doctors.filter(d => (d.distanceKm || 0) <= 5);
  }, [doctors]);

  const recommendedDoctors = useMemo(() => {
    return doctors.filter(d => d.isRecommended);
  }, [doctors]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedCity('all');
    setSortBy('recommended');
  };

  return {
    doctors,
    filteredDoctors,
    nearbyDoctors,
    recommendedDoctors,
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    selectedCity,
    setSelectedCity,
    sortBy,
    setSortBy,
    clearFilters,
    loading,
  };
}
