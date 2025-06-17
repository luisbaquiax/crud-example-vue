<script setup lang="ts">
import { Person } from '../types/Person';

defineProps<{
  person: Person;
}>();
</script>

<template>
  <div class="person-card">
    <div class="person-info">
      <span class="person-id">#{{ person.id }}</span>
      <h3>{{ person.name }} {{ person.lastName }}</h3>
    </div>
    
    <div class="person-actions">
      <router-link :to="`/person/${person.id}`" class="btn view">
        Ver
      </router-link>
      <router-link :to="`/person/${person.id}/edit`" class="btn edit">
        Editar
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.person-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.person-card:hover {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.person-info {
  display: flex;
  flex-direction: column;
}

.person-id {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 4px;
}

h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.person-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.view {
  background-color: #eff6ff;
  color: #3b82f6;
}

.view:hover {
  background-color: #dbeafe;
}

.edit {
  background-color: #f0fdfa;
  color: #10b981;
}

.edit:hover {
  background-color: #ccfbf1;
}

@media (max-width: 640px) {
  .person-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .person-actions {
    margin-top: 12px;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>