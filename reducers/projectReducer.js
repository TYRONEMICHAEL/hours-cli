const projectReducer = {
  setProjects(state, projects, linkedProjects) {
    const filteredProjects = projects.filter((project) => {
      const projectTitle = `${project.project_data.title} - ${project.title}`;
      return linkedProjects.indexOf(projectTitle) > -1;
    });
    return Object.assign({}, state, { projects: filteredProjects });
  }
};

export default projectReducer;
