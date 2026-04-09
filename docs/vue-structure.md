# agent.md — Vue 3 Composition API Best Practices

## Purpose

This document provides guidelines and best practices for building scalable, maintainable, and performant applications using the Vue 3 Composition API.

---

## Core Principles

### 1. Prefer Composition Over Options API

* Use the Composition API for better logic reuse and organization.
* Group related logic by feature, not by option type (data, methods, etc.).

### 2. Keep Components Small and Focused

* Each component should have a single responsibility.
* Extract reusable logic into composables (`useX`).

### 3. Use Composables for Reusability

* Store reusable logic in `/composables`.
* Naming convention: `useFeatureName.ts`

```js
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return { count, increment }
}
```

---

## Reactivity Best Practices

### 1. Use `ref` vs `reactive` Correctly

* Use `ref` for primitives.
* Use `reactive` for objects.

```js
const count = ref(0)
const state = reactive({ name: 'John' })
```

### 2. Avoid Overusing `reactive`

* Prefer `ref` + object assignment when possible for better type inference.

### 3. Destructure Carefully

* Destructuring reactive objects breaks reactivity.
* Use `toRefs()` when needed.

```js
const state = reactive({ name: 'John' })
const { name } = toRefs(state)
```

---

## Lifecycle Hooks

* Use lifecycle hooks inside `setup()`.
* Keep them minimal and delegate logic to functions.

```js
onMounted(() => {
  fetchData()
})
```

---

## Computed & Watch

### Computed

* Use for derived state.
* Must be side-effect free.

```js
const fullName = computed(() => `${first.value} ${last.value}`)
```

### Watch

* Use for side effects (API calls, logging, etc.).

```js
watch(count, (newVal) => {
  console.log(newVal)
})
```

### watchEffect

* Use for automatic dependency tracking.
* Avoid when dependencies should be explicit.

---

## Script Setup Syntax

* Prefer `<script setup>` for cleaner components.
* Reduces boilerplate and improves readability.

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>
```

---

## Props & Emits

### Props

```js
const props = defineProps({
  title: String
})
```

### Emits

```js
const emit = defineEmits(['update'])
```

* Always validate props.
* Use TypeScript when possible.

---

## TypeScript Best Practices

* Always type refs and composables.

```ts
const count = ref<number>(0)
```

* Use interfaces for complex structures.

---

## State Management

* Use composables for local state.
* Use a store (e.g., Pinia) for global state.
* Avoid prop drilling.

---

## Error Handling

* Handle async errors explicitly.

```js
try {
  await fetchData()
} catch (e) {
  console.error(e)
}
```

---

## Performance Tips

* Use `computed` instead of methods where possible.
* Avoid unnecessary watchers.
* Lazy load components when possible.
* Use `v-memo` and `v-once` where appropriate.

---

## Folder Structure

```
src/
  components/
  composables/
  views/
  stores/
```

---

## Naming Conventions

* Components: `PascalCase.vue`
* Composables: `useFeature.ts`
* Variables: `camelCase`

---

## Testing

* Test composables independently.
* Mock dependencies when needed.

---

## Common Pitfalls

* Losing reactivity when destructuring.
* Overusing watchers instead of computed.
* Mixing Options API and Composition API unnecessarily.

---

## Summary

* Organize logic by feature.
* Extract reusable logic into composables.
* Prefer explicit, readable code over clever abstractions.
* Keep components simple and focused.

---

## End of File
