<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import PersonForm from '../components/PersonForm.vue';
import { createPerson, updatePerson, getPersonById } from '../services/personService';
import type { Person } from '../types/Person';

const props = defineProps<{
  id?: string;
}>();

const router = useRouter();
const isEditing = computed(() => !!props.id);
const title = computed(() => isEditing.value ? 'Editar Persona' : 'Crear Nueva Persona');
const person = ref<Person | null>(null);
const loading = ref(isEditing.value);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const isSubmitting = ref(false);

onMounted(async () => {
  if (isEditing.value && props.id) {
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
  }
});

const handleSubmit = async (personData: Omit<Person, 'id'> | Person) => {
  isSubmitting.value = true;
  error.value = null;
  successMessage.value = null;
  
  try {
    if (isEditing.value) {
      await updatePerson(personData as Person);
      successMessage.value = 'Persona actualizada exitosamente';
    } else {
      await createPerson(personData as Omit<Person, 'id'>);
      successMessage.value = 'Persona creada exitosamente';
    }
    
    // Navigate back after a short delay
    setTimeout(() => {
      router.push('/');
    }, 1500);
  } catch (err) {
    console.error('Error saving person:', err);
    error.value = isEditing.value 
      ? 'Error al actualizar la persona' 
      : 'Error al crear la persona';
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/');
};
</script>

<template>
  <div class="person-form-view">
    <div class="back-link" @click="handleCancel">
      &larr; Volver a la lista
    </div>
    
    <h2>{{ title }}</h2>
    
    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
      <p>Cargando datos...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    
    <PersonForm 
      v-else
      :person="person || undefined"
      :isEditing="isEditing"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.person-form-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 16px;
}

.back-link {
  color: #4b5563;
  margin-bottom: 16px;
  display: inline-block;
  cursor: pointer;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #111827;
}

h2 {
  margin: 0 0 24px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
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

.error-message {
  background-color: #fee2e2;
  color: #ef4444;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 24px;
}

.success-message {
  background-color: #d1fae5;
  color: #10b981;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 24px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>