const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('ai_fitness_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const err = await response.json();
      errorMsg = err.detail || err.message || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // Auth
  register: (data) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  login: (data) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  getProfile: () =>
    fetch(`${BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  updateProfile: (data) =>
    fetch(`${BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Foods catalogue
  getFoods: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/foods?${qs}`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse);
  },

  getFoodById: (id) =>
    fetch(`${BASE_URL}/foods/${id}`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  adjustFoodPrice: (foodId, newPrice) =>
    fetch(`${BASE_URL}/foods/adjust-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ food_id: foodId, new_cost_per_serving_inr: newPrice }),
    }).then(handleResponse),

  recalculateServing: (recipeId, servings) =>
    fetch(`${BASE_URL}/foods/recalculate-serving`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ recipe_id: recipeId, servings }),
    }).then(handleResponse),

  // Recipes
  getRecipes: () =>
    fetch(`${BASE_URL}/recipes`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  getRecipeById: (id) =>
    fetch(`${BASE_URL}/recipes/${id}`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  saveFavorite: (recipeId) =>
    fetch(`${BASE_URL}/recipes/save/${recipeId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  getFavorites: () =>
    fetch(`${BASE_URL}/recipes/favorites/list`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  removeFavorite: (recipeId) =>
    fetch(`${BASE_URL}/recipes/favorites/${recipeId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  // Scanner
  scanImage: (formData) =>
    fetch(`${BASE_URL}/scanner/scan-image`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    }).then(handleResponse),

  scanText: (formData) =>
    fetch(`${BASE_URL}/scanner/scan-text`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    }).then(handleResponse),

  getScanHistory: () =>
    fetch(`${BASE_URL}/scanner/history`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  // Recommendations
  getRecommendations: (preferences) =>
    fetch(`${BASE_URL}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(preferences),
    }).then(handleResponse),

  // Meal Planner
  generateMealPlan: (criteria) =>
    fetch(`${BASE_URL}/meal-plans/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(criteria),
    }).then(handleResponse),

  saveMealPlan: (plan) =>
    fetch(`${BASE_URL}/meal-plans/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(plan),
    }).then(handleResponse),

  getUserMealPlans: () =>
    fetch(`${BASE_URL}/meal-plans`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  // Shopping List
  getShoppingList: () =>
    fetch(`${BASE_URL}/shopping-lists`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  addShoppingItem: (item) =>
    fetch(`${BASE_URL}/shopping-lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(item),
    }).then(handleResponse),

  addFromRecipe: (recipeId) =>
    fetch(`${BASE_URL}/shopping-lists/from-recipe/${recipeId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  addBulkGrocery: (items) =>
    fetch(`${BASE_URL}/shopping-lists/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(items),
    }).then(handleResponse),

  toggleShoppingItem: (id) =>
    fetch(`${BASE_URL}/shopping-lists/${id}/toggle`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  deleteShoppingItem: (id) =>
    fetch(`${BASE_URL}/shopping-lists/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  clearCompletedShopping: () =>
    fetch(`${BASE_URL}/shopping-lists/clear/completed`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  // Daily Tracker
  getDailySummary: (date) => {
    const url = date ? `${BASE_URL}/tracker/summary?date=${date}` : `${BASE_URL}/tracker/summary`;
    return fetch(url, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse);
  },

  logMealItem: (item) =>
    fetch(`${BASE_URL}/tracker/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(item),
    }).then(handleResponse),

  deleteLoggedItem: (id) =>
    fetch(`${BASE_URL}/tracker/item/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  updateWaterIntake: (glasses, date) => {
    const qs = new URLSearchParams({ glasses, ...(date && { date }) }).toString();
    return fetch(`${BASE_URL}/tracker/water?${qs}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    }).then(handleResponse);
  },

  // AI Assistant Chatbot
  assistantChat: (message) =>
    fetch(`${BASE_URL}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ message }),
    }).then(handleResponse),
};

