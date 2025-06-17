<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PersonList from '../components/PersonList.vue';
import { Person } from '../types/Person';
import { getAllPersons } from '../services/personService';

const persons = ref<Person[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchPersons = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    persons.value = await getAllPersons();
  } catch (err) {
    console.error('Error fetching persons:', err);
    error.value = 'No se pudieron cargar los datos. Intente nuevamente.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPersons);
</script>

<template>
  <div class="home-view">
    <div class="header">
      <h1>Gestión de Personas</h1>
      <router-link to="/person/create" class="btn-create">
        Nueva Persona
      </router-link>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
      <p>Cargando datos...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchPersons" class="btn-retry">
        Reintentar
      </button>
    </div>
    
    <PersonList 
      v-else 
      :persons="persons" 
      @refresh="fetchPersons" 
    />
  </div>
</template>

<style scoped>

.home-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #c1c9da;
}

.btn-create {
  background-color: #3b82f6;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;
}

.btn-create:hover {
  background-color: #2563eb;
}

.btn-create::before {
  content: "+";
  margin-right: 8px;
  font-size: 1.125rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
}

.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 32px 0;
  color: #ef4444;
}

.btn-retry {
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 12px;
  transition: background-color 0.2s ease;
}

.btn-retry:hover {
  background-color: #e5e7eb;
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .btn-create {
    width: 100%;
    justify-content: center;
  }
}
</style>