# Hours Github CLI
Pull your commits from your Github Tangent projects to submit for your hours.
The commits are are automatically taken and merged as comments.

## Video
![overview](http://www.gfycat.com/FrayedDisastrousFossa)

## How it works.
Let's say you have forgotten to submit your hours for the last two weeks (which you probably shouldn't be forgetting). The simple program will pull your commits from the last two weeks, add them as a commit message and submit the hours for you automatically. The program looks at each of your projects and merges the commits for the days specified.

## How to?
* Duplicate and rename `config.sample.js` to `config.js`
* Enter your credentials in `config.js`
* Edit the `from` (Entries after this day) and `until` (Entries before this day) fields in the format `{YYYY-MM-DD}`
* Enter your repos in the following format: `{ProjectName}:{RepoName}`. Multiple projects can be entered separated by a space `{ProjectName}:{RepoName} {ProjectName}:{RepoName}`
* Hours are set to a default of `9` hours. Change you as you wish

## Limitations / TODOS
* Tests of course :)
* If the program finds multiple projects worked on the same day, the hours are divided evenly. So if your defaultHours is 8 hours and you worked on two different projects, your entries will be submitted as two different entries at 4 hours each
* Submit hours through the CLI
