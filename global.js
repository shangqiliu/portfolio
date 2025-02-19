console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
// let navLinks = $$("nav a");
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );
// if (currentLink) {
// // or if (currentLink !== undefined)
// currentLink.classList.add('current');
// };
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/index.html', title: 'projects' },
    { url: 'contact/index.html', title: 'contact'},
    { url: 'resume/index.html', title: 'resume'},
    {url: 'meta/index.html', title: 'meta'},
    { url: 'https://github.com/shangqiliu', title: 'Github'}
  ];
let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // TODO create link and add it to nav
    const ARE_WE_HOME = document.documentElement.classList.contains('home');
    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
    }
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
      }
    if (a.host !== location.host) {
        a.target = "_blank";
    }
  };
document.body.insertAdjacentHTML(
'afterbegin',
`
    <label class="color-scheme">
        Theme:
        <select>
            <option value="auto">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>`
);
let select = document.querySelector("select")
select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
  });
if ("colorScheme" in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}
export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      console.log(response);
      const data = await response.json();
      return data; 
  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // write javascript that will allow dynamic heading levels based on previous function
  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  // Validate the headingLevel parameter.
  if (!validHeadings.includes(headingLevel)) {
      console.warn(`Invalid heading level "${headingLevel}" provided. Defaulting to "h2".`);
      headingLevel = 'h2';
  }
  containerElement.innerHTML = '';
  projects.forEach(project => {
    const article = document.createElement("article");
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
      <div>${project.year}</div>
    `;
    containerElement.appendChild(article);
  });
  
}
export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);
}