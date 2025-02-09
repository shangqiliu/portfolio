import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
// Ensure projects is an array.
if (Array.isArray(projects)) {
  // Clear the container once before appending multiple projects.
  projectsTitle.textContent = `${projects.length} Projects`;
  renderProjects(projects, projectsContainer, 'h2');
} else {
  console.error('Expected projects to be an array, but got:', projects);
}

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
function renderPieChart(projectsGiven) {
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let svg = d3.select('svg'); 
  let legend = d3.select('.legend');
  let selectedIndex = -1;
  svg.selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year }; // TODO
  });
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  // TODO: clear up paths and legends
  newArcs.forEach((arc, idx) => {
    svg.append('path')
          .attr('d', arc)
          .attr('fill', colors(idx))
          .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;
            svg
              .selectAll('path')
              .attr('class', (_, idx) => (
                idx === selectedIndex ? 'selected' : ''
              ));
            legend
              .selectAll('li')
              .attr('class', (_, idx) => (
                idx === selectedIndex ? 'selected' : ''
              ));
            if (selectedIndex === -1) {
              renderProjects(projectsGiven, projectsContainer, 'h2');
            } else {
              // Get the year from the selected wedge's label
              const selectedYear = newData[selectedIndex].label;
              const filteredProjects = projects.filter(project => project.year === selectedYear);
              renderProjects(filteredProjects, projectsContainer, 'h2');
            }
          });
  })
  // update paths and legends, refer to steps 1.4 and 2.2
 
  newData.forEach((d, idx) => {
      legend.append('li')
            .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
  })
}
renderPieChart(projects)

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  // TODO: filter the projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // TODO: render updated projects!
  projectsTitle.textContent = `${filteredProjects.length} Projects`;
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects)
});


// let currentQuery = '';
// let selectedYear = null;

// function applyFilters() {
//   let filteredProjects = projects;
  
//   // Apply search filter if there is a query.
//   if (currentQuery.trim() !== '') {
//     filteredProjects = filteredProjects.filter(project => {
//       const values = Object.values(project).join('\n').toLowerCase();
//       return values.includes(currentQuery.toLowerCase());
//     });
//   }
  
//   // Apply year filter if a year is selected.
//   if (selectedYear !== null) {
//     filteredProjects = filteredProjects.filter(project => project.year === selectedYear);
//   }
  
//   // Update projects count and render projects.
//   projectsTitle.textContent = `${filteredProjects.length} Projects`;
//   renderProjects(filteredProjects, projectsContainer, 'h2');
  
//   // Re-render the pie chart with the filtered projects.
//   renderPieChart(projects);
// }
// function renderPieChart(projectsGiven) {
//   let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
//   let svg = d3.select('svg'); 
//   let legend = d3.select('.legend');
//   svg.selectAll('path').remove();
//   d3.select('.legend').selectAll('li').remove();
//   // re-calculate rolled data
//   let newRolledData = d3.rollups(
//     projectsGiven,
//     (v) => v.length,
//     (d) => d.year,
//   );
//   // re-calculate data
//   let newData = newRolledData.map(([year, count]) => {
//     return { value: count, label: year }; // TODO
//   });
//   // re-calculate slice generator, arc data, arc, etc.
//   let newSliceGenerator = d3.pie().value((d) => d.value);
//   let newArcData = newSliceGenerator(newData);
//   let newArcs = newArcData.map((d) => arcGenerator(d));
//   let colors = d3.scaleOrdinal(d3.schemeTableau10);
//   // TODO: clear up paths and legends
//   newArcs.forEach((arc, idx) => {
//     svg.append('path')
//           .attr('d', arc)
//           .attr('fill', colors(idx))
//           .on('click', () => {
//             const clickedYear = newData[idx].label;
//             selectedYear = (selectedYear === clickedYear) ? null : clickedYear;
            
//             // Update visual highlighting.
//             svg.selectAll('path')
//               .attr('class', (_, i) => (newData[i].label === selectedYear ? 'selected' : ''));
//             legend.selectAll('li')
//               .attr('class', (_, i) => (newData[i].label === selectedYear ? 'selected' : ''));
            
//             // Re-apply both filters.
//             applyFilters()
//             })
//           });
//   // update paths and legends, refer to steps 1.4 and 2.2
 
//   newData.forEach((d, idx) => {
//       legend.append('li')
//             .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//             .attr('class', 'legend-item')
//             .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
//   })
// }
// renderPieChart(projects)
// let searchInput = document.querySelector('.searchBar');
// searchInput.addEventListener('change', (event) => {
//   currentQuery = event.target.value;
//   applyFilters();
// });