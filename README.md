# Personal Website
As of October 2023, I've decided to overhaul my website, moving from my ReactJS-based approach to a minimal, statically-generated, bloat-free Hugo-based approach. The entire website (excluding photos) is under 2MB.
The primary motivation is to start a blog focusing on documenting my endless homelab tinkering and other projects.
ReactJS, while pretty, is tedious to use if you'd like to add a brand new page for each blog post (at least, the way I had it set up).
Additionally, the `react-router` plugin for ReactJS, which allows routing to different pages, has one large inherent flaw.
Say you're viewing a web page that you've created, `www.example.com/test`. If you refresh this page, you will be presented with a 404 error.
React client-sided routing is the culprit, and [this](https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually) Stack Overflow discussion gives a good overview of why this issue exists.


## Technical Details
### Framework/Tools
Hugo


### Build/Deploy process
`./deploy.sh [test]`

First, create and fill out the env file - `cp sample.env .env`.
When run, this script will retrieve your resume PDF present at `RESUME_URL`, create the music data JSON by interfacing with Plex, and build a production-optimized static website.

If the optional `test` argument is provided, this script will serve a development instance of this website at `LOCAL_MACHINE_IP`.

If this argument is not provided, the script will deploy the website to production by copying all files to `WEBSITE_DEPLOY_DIR`
When deployed to production, the updated website will immediately be available.
Since this is a static website rather than a website that uses a database, there is zero system downtime between deployments.


## Content
### Home
A simple home page with my name and job title.

### Resume
An image of my most up-to-date resume from Github, plus a link to download the full PDF.

### Projects
A frequently updated blog page about any sort of project that I'm doing. The base page lists all topics that I've written about.

### Music
A page dedicated to listing each album I've listened to, along with its full average track rating. Once I've rated each track in an album from 1-5, it is eligible to show up on this page.
Daily, I run a script which scans my music library which indicates which albums have been fully rated, gives the album a rating (average of each track rating), and puts the information into a JSON with supporting metadata.

### About
A small page with more details about me and the content of this website.
