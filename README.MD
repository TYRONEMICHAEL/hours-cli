# Hours Github CLI
Pull your commits from your Github Tangent projects to submit for your hours.
The commits are are automatically taken and merged as comments.

## How it works.
Let's say you have forgotten to submit your hours for the last two weeks. The simple program will pull your commits from the last two weeks, and submit the hours for you automatically. The program looks at each of your projects and merges the commits for the days specified.

## How to?
* Duplicate and rename `credentials.sample.js` to `credentials.js`
* Enter your credentials in `credentials.js`
* Open and edit `hours.js`
* Edit the `from` and `to` fields in the format `{YYYY-MM-DD}`.
* Enter your repos in the following format: `{ProjectName}:{BranchName}`. Multiple projects can be entered separated by a space `{ProjectName}:{BranchName} {ProjectName}:{BranchName}`
* Link your repo to your Tangent project in the following format: `{ProjectTitle} - {ProjectDescription}` and `{RepoName}`
* Hours are set to a default of `8` hours. Change you as you wish.

## Limitations / TODOS
* Tests of course :)
* Overtime will need to be entered manually through the portal.
* If the program finds multiple projects worked on the same day, the hours are divided evenly. This will need to be rectified in the portal.
* Hours are the same for each day.
* Your hours will need to be submitted through the portal once your are happy.
