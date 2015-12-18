const projectReducer = {
  setProjects(state, projects, linkedProjects) {
    const projectsHash = {};
    const repoToProjectIndex = {};
    const linkedProjectsKeys = Object.keys(linkedProjects);

    const filteredProjects = projects.filter((project) => {
      const projectTitle = `${project.project_data.title} - ${project.title}`;
      return linkedProjectsKeys.indexOf(projectTitle) > -1;
    });

    filteredProjects.forEach((project, index) => {
      const projectTitle = `${project.project_data.title} - ${project.title}`;
      repoToProjectIndex[linkedProjects[projectTitle]] = index;
    });

    return Object.assign({}, state, { projects: { data: filteredProjects, repoToProjectIndex } });
  }
};

export default projectReducer;
