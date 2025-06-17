<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Person } from '../types/Person';

const props = defineProps<{
  person?: Person;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', person: Omit<Person, 'id'> | Person): void;
  (e: 'cancel'): void;
}>();

const name = ref('');
const lastName = ref('');
const errors = ref({ name: '', lastName: '' });
const isSubmitting = ref(false);

onMounted(() => {
  if (props.person) {
    name.value = props.person.name;
    lastName.value = props.person.lastName;
  }
});

const validate = (): boolean => {
  let isValid = true;
  errors.value = { name: '', lastName: '' };
  
  if (!name.value.trim()) {
    errors.value.name = 'El nombre es requerido';
    isValid = false;
  }
  
  if (!lastName.value.trim()) {
    errors.value.lastName = 'El apellido es requerido';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = () => {
  if (!validate() || isSubmitting.value) return;
  
  isSubmitting.value = true;
  
  const personData = props.isEditing && props.person
    ? { id: props.person.id, name: name.value, lastName: lastName.value }
    : { name: name.value, lastName: lastName.value };
    
  emit('submit', personData);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="person-form">
    <div class="form-group">
      <label for="name">Nombre</label>
      <input 
        id="name" 
        v-model="name" 
        type="text" 
        :class="{ 'input-error': errors.name }" 
        placeholder="Ingrese el nombre"
      />
      <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
    </div>
    
    <div class="form-group">
      <label for="lastName">Apellido</label>
      <input 
        id="lastName" 
        v-model="lastName" 
        type="text" 
        :class="{ 'input-error': errors.lastName }" 
        placeholder="Ingrese el apellido"
      />
      <div v-if="errors.lastName" class="error-message">{{ errors.lastName }}</div>
    </div>
    
    <div class="form-actions">
      <button 
        type="button" 
        class="btn-secondary" 
        @click="emit('cancel')"
      >
        Cancelar
      </button>
      <button 
        type="submit" 
        class="btn-primary" 
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Crear') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.person-form {
  max-width: 500px;
  margin: 0 auto;
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.error-message {
  margin-top: 4px;
  color: #ef4444;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary, .btn-secondary {
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}
</style>