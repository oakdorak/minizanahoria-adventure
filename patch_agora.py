import re

with open('agora.js', 'r') as f:
    content = f.read()

# Replace saveConfig
save_config_search = """function saveConfig() {
  State.config.provider = document.getElementById('provider-select').value;
  State.config.apiUrl = document.getElementById('api-url').value;
  State.config.apiKey = document.getElementById('api-key').value;
  State.config.modelName = document.getElementById('model-name').value;

  localStorage.setItem('agora_config', JSON.stringify(State.config));
  updateStatusUI();"""

save_config_replace = """function saveConfig() {
  State.config.provider = document.getElementById('provider-select').value;
  State.config.apiUrl = document.getElementById('api-url').value;
  State.config.apiKey = document.getElementById('api-key').value;
  State.config.modelName = document.getElementById('model-name').value;

  // Create a copy of the config without the API key for localStorage
  const configToSave = { ...State.config };
  delete configToSave.apiKey;

  localStorage.setItem('agora_config', JSON.stringify(configToSave));

  // Save API key securely to sessionStorage only
  if (State.config.apiKey) {
    sessionStorage.setItem('agora_api_key', State.config.apiKey);
  } else {
    sessionStorage.removeItem('agora_api_key');
  }

  updateStatusUI();"""

content = content.replace(save_config_search, save_config_replace)

# Replace loadPersistedData
load_config_search = """function loadPersistedData() {
  const savedConfig = localStorage.getItem('agora_config');
  if (savedConfig) {
    State.config = JSON.parse(savedConfig);
    document.getElementById('provider-select').value = State.config.provider;
    document.getElementById('api-url').value = State.config.apiUrl;
    document.getElementById('api-key').value = State.config.apiKey;
    document.getElementById('model-name').value = State.config.modelName;
  }"""

load_config_replace = """function loadPersistedData() {
  const savedConfig = localStorage.getItem('agora_config');
  if (savedConfig) {
    const parsedConfig = JSON.parse(savedConfig);

    // Clear legacy API key from localStorage if it exists
    if (parsedConfig.apiKey) {
      delete parsedConfig.apiKey;
      localStorage.setItem('agora_config', JSON.stringify(parsedConfig));
    }

    // Merge parsed config with State.config
    State.config = { ...State.config, ...parsedConfig };

    document.getElementById('provider-select').value = State.config.provider || '';
    document.getElementById('api-url').value = State.config.apiUrl || '';
    document.getElementById('model-name').value = State.config.modelName || '';
  }

  // Load API key from sessionStorage
  const savedApiKey = sessionStorage.getItem('agora_api_key');
  if (savedApiKey) {
    State.config.apiKey = savedApiKey;
  }

  // Ensure the DOM reflects the state, whether it was empty, loaded from legacy or sessionStorage
  document.getElementById('api-key').value = State.config.apiKey || '';"""

content = content.replace(load_config_search, load_config_replace)

with open('agora.js', 'w') as f:
    f.write(content)
