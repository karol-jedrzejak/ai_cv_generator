'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { technologiesApi } from '@/lib/api/technologies';
import type { TechnologyOption } from '@/types/technology';

interface Props {
  value: TechnologyOption[];
  onChange: (technologies: TechnologyOption[]) => void;
  onError: (message: string | null) => void;
  disabled?: boolean;
  label?: string;
}

function formatCategory(category: string) {
  return category
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function TechnologyMultiSelect({
  value,
  onChange,
  onError,
  disabled = false,
  label = 'Technologie',
}: Props) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<TechnologyOption[]>([]);
  const [searching, setSearching] = useState(false);

  const options = useMemo(() => {
    const results = new Map<string, TechnologyOption>();
    for (const technology of value) results.set(technology.id, technology);
    for (const technology of searchResults) results.set(technology.id, technology);
    return [...results.values()];
  }, [searchResults, value]);

  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      setSearching(true);
      onError(null);
      try {
        const results = await technologiesApi.search(search.trim());
        if (active) {
          setSearchResults(
            results.map(({ id, name, category }) => ({
              id,
              name,
              category,
            })),
          );
        }
      } catch (error) {
        if (active) {
          setSearchResults([]);
          onError(
            error instanceof Error
              ? error.message
              : 'Nie udało się pobrać technologii.',
          );
        }
      } finally {
        if (active) setSearching(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [onError, search]);

  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      inputValue={search}
      loading={searching}
      disabled={disabled}
      filterOptions={(items) => items}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      onInputChange={(_, input, reason) => {
        if (reason === 'input' || reason === 'clear') {
          setSearch(input);
        }
      }}
      onChange={(_, selected) => {
        onChange(selected);
        setSearch('');
      }}
      noOptionsText={
        search.trim().length < 2
          ? 'Wpisz minimum 2 znaki'
          : 'Nie znaleziono technologii'
      }
      loadingText="Wyszukiwanie..."
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option.id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <div id={option.id}>
            <Typography>{option.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatCategory(option.category)}
            </Typography>
          </div>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Wyszukaj i dodaj używane technologie"
          helperText="Możesz wybrać wiele technologii. Wpisz co najmniej 2 znaki, aby wyszukać."
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {searching && <CircularProgress size={18} />}
                  {params.slotProps.input?.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
