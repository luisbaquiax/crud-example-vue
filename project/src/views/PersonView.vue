<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Person } from '../types/Person';
import { getPersonById } from '../services/personService';

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const person = ref<Person | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const personId = parseInt(props.id);
    if (isNaN(personId)) {
      error.value = 'ID de persona inválido';
      loading.value = false;
      return;
    }
    
    const result = await getPersonById(personId);
    if (!result) {
      error.value = 'Persona no encontrada';
    } else {
      person.value = result;
    }
  } catch (err) {
    console.error('Error loading person:', err);
    error.value = 'Error al cargar los datos de la persona';
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="person-view">
    <div class="back-link" @click="goBack">
      &larr; Volver a la lista
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
      <p>Cargando datos...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <button @click="goBack" class="btn-back">
        Volver a la lista
      </button>
    </div>
    
    <div v-else-if="person" class="person-details">
      <div class="person-header">
        <h2>Detalles de Persona</h2>
        <router-link 
          :to="`/person/${person.id}/edit`" 
          class="btn-edit"
        >
          Editar
        </router-link>
      </div>
      
      <div class="detail-card">
        <div class="detail-row">
          <span class="detail-label">ID:</span>
          <span class="detail-value">{{ person.id }}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Nombre:</span>
          <span class="detail-value">{{ person.name }}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Apellido:</span>
          <span class="detail-value">{{ person.lastName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.person-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 16px;
}

.back-link {
  color: #4b5563;
  margin-bottom: 24px;
  display: inline-block;
  cursor: pointer;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #111827;
}

.loading-state, .error-state {
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
  color: #ef4444;
}

.btn-back {
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.2s ease;
}

.btn-back:hover {
  background-color: #e5e7eb;
}

.person-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.btn-edit {
  background-color: #10b981;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn-edit:hover {
  background-color: #059669;
}

.detail-card {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.detail-row {
  display: flex;
  margin-bottom: 16px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: 500;
  width: 100px;
  color: #4b5563;
}

.detail-value {
  color: #111827;
  flex-grow: 1;
}

@media (max-width: 640px) {
  .person-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .btn-edit {
    width: 100%;
    text-align: center;
  }
}
</style>