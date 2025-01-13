async function loadYamlFile(path) {
  const response = await fetch(path);
  const text = await response.text();
  return jsyaml.load(text); // You'll need to include js-yaml library
}

async function loadDishData() {
  const folders = ['Interleaved', 'Language_Centric'];
  
  for (const folder of folders) {
    const containerId = `${folder}-dishes`;
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.error(`Container not found for ID: ${containerId}`);
      continue;
    }
    
    try {
      // Get list of dishes in the folder
      const dishList = await fetch(`${folder}/dishes.json`).then(r => r.json());
      
      for (const dish of dishList) {
        // Load actions and captions YAML files
        const actions = await loadYamlFile(`${folder}/${dish}/actions.yaml`);
        const captions = await loadYamlFile(`${folder}/${dish}/captions.yaml`);
        
        // Get video files
        const videos = Array.from({length: Object.keys(actions).length}, (_, i) => 
          `${folder}/${dish}/${i + 1}.mp4`
        );
        
        // Create and append the section
        const section = createDishSection(
          dish,
          videos,
          Object.values(actions),
          Object.values(captions)
        );
        container.innerHTML += section;
      }
    } catch (error) {
      console.error(`Error loading data for ${folder}:`, error);
    }
  }
} 