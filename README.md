# What is the goal of Escherpad?

The mission of Escherpad is to create a note taking app that can save all
notes to your dropbox, and directly edit `README` and `gists` on GitHub.
It is meant to be a central entrance for all of your notes, making it easy to
search across backend services.

The file formats I frequently use include `R-markdown`, `LaTeX`, `jupyter 
notebook` and Emacs `Org mode`. We also use CSV's and spreadsheets. For 
biologists, they need viewers for genome sequence data, support for chemical 
diagrams and so on.

Escherpad wants to make it easy for professionals to search for personal note 
on work computer without the need to install anything locally,

For startups, Escherpad wants to replace unwieldy issue trackers and trello with
a clean list view and a search bar. Same applies to classrooms and QA 
sites.

When Escherpad is used by everyone, maybe we can start building AI assistants
which can automate otherwise manual tasks.

## How are we going to do all of these?

We do it in two steps:

### Step 1

We build a solid *real-time collaborative* backend on `spark` and `HBase`. This
is a hard technology and is not commoditized. Then we build a nice client that 
can demonstrate our potential and attract users. We ask users to pay for
the collaborative backend service. We allow free personal accounts under team 
account so that employees can just tag along.

Then we steadily add features until...

### Step 2
We raise investment, build a sales team, build iOS apps and branch out to other
applications:
- native iOS apps
- data dashboard and general analytics
- SQL database connectors
- database connected spread sheets

Specifically, we target the engineers in startups who are responsible for 
building BI (business intelligence) tools, and have them build up a large
collection of third party tools on our platform.

## What are the components?

Client Side
- Markdown WYSIWYG editor (org mode, R-markdown, Py-markdown)
- Integration with `DropBox`, `GitHub` etc

Server Side
- Real-time collaborative API
    - OT api
    - presence api (cursor movement etc, should **NOT** be OT)
- A scalable chat backend (Yes! we will make Slack <- doesn't solve the problem 
though)
