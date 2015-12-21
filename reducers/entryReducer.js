import moment from 'moment';

const entryReducer = {
  addEntry(state, commit) {
    const entries = Object.assign({}, state.entries);
    const key = moment(commit.date).format('YYYY-MM-DD');

    const newEntry = function (key, commit) {
      const newEntry = {};
      const commits = {};
      const projectIndex = state.projects.repoToProjectIndex[commit.repo];
      const project = state.projects.data[projectIndex];

      commits[commit.sha] = commit;

      newEntry[commit.repo] = {
        id: null,
        user: state.user.id,
        project_id: project.project_data.pk,
        project_task_id: project.id,
        status: 'Open',
        day: key,
        start_time: '08:00:00',
        end_time: '17:00:00',
        hours: commit.hours,
        overtime: 0,
        tags: '',
        comments: commit.message,
        commits
      };

      return newEntry;
    };

    // TODO: Update to be immutable
    const updateEntry = function(entry, commit, key) {
      const hours = commit.hours;

      if(entry[commit.repo]) {
        if(entry[commit.repo].commits[commit.sha]) return;
        entry[commit.repo].comments += `\n- ${commit.message}`;
        return entry[commit.repo].commits[commit.sha] = commit;
      }

      entry[commit.repo] = newEntry(key, commit)[commit.repo];

      Object.keys(entry).forEach((key) => {
        entry[key].hours = Math.ceil(hours / Object.keys(entry).length);
      });
    };

    if(!entries[key]) {
      entries[key] = newEntry(key, commit);
    } else {
      updateEntry(entries[key], commit, key);
    }

    return Object.assign({}, state, { entries });
  }
};

export default entryReducer;
