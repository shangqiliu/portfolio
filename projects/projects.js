import { fetchJSON, renderProjects } from '../global.js';
async function init() {
    const projects = await fetchJSON('../lib/projects.json');
    const projectsContainer = document.querySelector('.projects');
    const projectsTitle = document.querySelector('.projects-title');
    // Ensure projects is an array.
    if (Array.isArray(projects)) {
      // Clear the container once before appending multiple projects.
      projectsTitle.textContent = `${projects.length} Projects`;
      projectsContainer.innerHTML = '';
      projects.forEach(project => {
        renderProjects(project, projectsContainer, 'h2');
      });
    } else {
      console.error('Expected projects to be an array, but got:', projects);
    }
  }
  
  init();