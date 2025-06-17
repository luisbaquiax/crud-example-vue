import { Person } from '../types/Person';

// Simulated JSON storage key
const STORAGE_KEY = 'vue-person-crud-data';

/**
 * Initialize with some sample data
 */
const initStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialData: Person[] = [
      { id: 1, name: 'Juan', lastName: 'Pérez' },
      { id: 2, name: 'María', lastName: 'Gómez' },
      { id: 3, name: 'Carlos', lastName: 'Rodríguez' }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
};

/**
 * Get all persons
 */
export const getAllPersons = async (): Promise<Person[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  initStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return JSON.parse(data || '[]');
};

/**
 * Get person by id
 */
export const getPersonById = async (id: number): Promise<Person | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const persons = await getAllPersons();
  return persons.find(person => person.id === id);
};

/**
 * Create a new person
 */
export const createPerson = async (person: Omit<Person, 'id'>): Promise<Person> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const persons = await getAllPersons();
  
  // Generate a new ID (in a real app, this would be handled by the backend)
  const maxId = persons.length > 0 
    ? Math.max(...persons.map(p => p.id)) 
    : 0;
  
  const newPerson: Person = {
    ...person,
    id: maxId + 1
  };
  
  persons.push(newPerson);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persons));
  
  return newPerson;
};

/**
 * Update an existing person
 */
export const updatePerson = async (person: Person): Promise<Person> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const persons = await getAllPersons();
  const index = persons.findIndex(p => p.id === person.id);
  
  if (index === -1) {
    throw new Error(`Person with id ${person.id} not found`);
  }
  
  persons[index] = person;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persons));
  
  return person;
};

/**
 * Delete a person
 */
export const deletePerson = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const persons = await getAllPersons();
  const filteredPersons = persons.filter(person => person.id !== id);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPersons));
};