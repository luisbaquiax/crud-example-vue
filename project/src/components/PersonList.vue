<script setup lang="ts">
import { ref } from 'vue';
import PersonCard from './PersonCard.vue';
import { Person } from '../types/Person';
import { deletePerson } from '../services/personService';

const props = defineProps<{
  persons: Person[];
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const personToDelete = ref<Person | null>(null);
const showDeleteModal = ref(false);
const isDeleting = ref(false);

const openDeleteModal = (person: Person) => {
  personToDelete.value = person;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  setTimeout(() => {
    personToDelete.value = null;
  }, 300);
};

const confirmDelete = async () => {
  if (!personToDelete.value || isDeleting.value) return;
  
  isDeleting.value = true;
  
  try {
    await deletePerson(personToDelete.value.id);
    closeDeleteModal();
    emit('refresh');
  } catch (error) {
    console.error('Error deleting person:', error);
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="person-list">
    <div v-if="persons.length === 0" class="empty-state">
      <p>No hay personas registradas</p>
      <router-link to="/person/create" class="btn-add">
        Agregar una persona
      </router-link>
    </div>
    
    <template v-else>
      <div v-for="person in persons" :key="person.id" class="person-item">
        <PersonCard :person="person" />
        <button @click="openDeleteModal(person)" class="btn-delete">
          Eliminar
        </button>
      </div>
    </template>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <h3>Confirmar eliminación</h3>
        <p>¿Estás seguro que deseas eliminar a <strong>{{ personToDelete?.name }} {{ personToDelete?.lastName }}</strong>?</p>
        <p class="warning-text">Esta acción no se puede deshacer.</p>
        
        <div class="modal-actions">
          <button 
            class="btn-secondary" 
            @click="closeDeleteModal"
            :disabled="isDeleting"
          >
            Cancelar
          </button>
          <button 
            class="btn-danger" 
            @click="confirmDelete"
            :disabled="isDeleting"
          >
            {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.person-list {
  width: 100%;
}

.person-item {
  position: relative;
}

.btn-delete {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-delete:hover {
  background-color: #fecaca;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-state p {
  margin-bottom: 16px;
  color: #6b7280;
}

.btn-add {
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn-add:hover {
  background-color: #2563eb;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: scaleIn 0.2s ease;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #111827;
}

.warning-text {
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-danger:disabled {
  background-color: #fca5a5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 90%;
  }
  
  .modal-actions {
    flex-direction: column-reverse;
  }
  
  .btn-danger, .btn-secondary {
    width: 100%;
  }
}
</style>