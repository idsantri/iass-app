<script setup>
import Member from '@/services/Member';

const {
    data,
    loading,
    execute: loadData,
    errorMessage,
    successMessage,
} = Member.getAll({}, { immediate: false, sMessage: false, resetDataOnRequest: true });
</script>

<template>
    <div>
        <q-btn @click="loadData()" :loading="loading">load data</q-btn>

        <!-- Success Message -->
        <div class="text-positive q-mt-sm">✅ {{ successMessage }}</div>

        <!-- Error Message -->
        <div class="text-negative q-mt-sm">❌ {{ errorMessage }}</div>

        <h3>Loading... {{ loading }}</h3>

        <div v-if="data">
            <div v-for="member in data.members" :key="member.id">
                {{ member.nama }}
            </div>
        </div>
    </div>
</template>
