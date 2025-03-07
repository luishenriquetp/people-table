'use client'
import { useCallback, useEffect, useState } from 'react';
import { getPeople } from '@/app/api/route';
import { Person } from '@/types';
import { PeopleFilters } from '@/components/PeopleFilters';
import { Loader } from '@/components/Loader';
import { PeopleTable } from '@/components/PeopleTable';
import { useParams, useSearchParams } from 'next/navigation';

const getCenturyRange = (century: number): [number, number] => {
  const start = (century - 1) * 100 + 1;
  const end = century * 100;

  return [start, end];
};

export default function PeoplePage (){
  const searchParams = useSearchParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSex = searchParams.get('sex');
  const query = searchParams.get('query') || '';
  const centuries = searchParams.getAll('centuries') || [];

  const { selectedPerson } = useParams();

  useEffect(() => {
    getPeople()
      .then(setPeople)
      .catch(() => setError('Something went wrong while fetching the data.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!people.length || !selectedPerson) {
      return;
    }

    document
      .getElementById(selectedPerson.toString())
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [selectedPerson, people]);

  const filterPeople = useCallback(() => {
    let filtered = people;

    if (getSex) {
      filtered = people.filter(person => person.sex === getSex);
    }

    if (query) {
      filtered = filtered.filter(
        person =>
          person.name.toLowerCase().includes(query.toLowerCase()) ||
          person.motherName?.toLowerCase().includes(query.toLowerCase()) ||
          person.fatherName?.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (centuries.length > 0) {
      filtered = filtered.filter(person =>
        centuries.some(century => {
          const [start, end] = getCenturyRange(parseInt(century, 10));

          return person.born >= start && person.born <= end;
        }),
      );
    }

    return filtered;
  }, [people, getSex, query, centuries]);

  const filteredPeople = filterPeople();

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          <div className="column is-7-tablet is-narrow-desktop">
            {!isLoading && (
              <PeopleFilters
                getSex={getSex}
                query={query}
                centuries={centuries}
              />
            )}
          </div>

          <div className="column">
            <div className="box table-container">
              {isLoading && <Loader />}

              {error && (
                <p data-cy="peopleLoadingError" className="has-text-danger">
                  Something went wrong
                </p>
              )}

              {!people.length && !isLoading && (
                <p data-cy="noPeopleMessage">
                  There are no people on the server
                </p>
              )}

              {people.length > 0 && !isLoading && !error && (
                <PeopleTable
                  people={people}
                  selectedPerson={selectedPerson.toString() || null}
                  filteredPeople={filteredPeople}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};