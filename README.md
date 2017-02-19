# What is the goal of Escherpad?

I want to create a note taking app that can save notes to my dropbox, and 
directly edit `README`'s on GitHub, search for my gists etc. I want to be
able to search for all of my notes here.

The report file formats I use include `R-markdown`, `LaTeX`, `jupyter notebook` 
and Emacs `Org mode`. We also use CSV's and spreadsheets in general. For 
biologists, we provide `plasmid` viewer, support for chemical diagrams and so
on. We add viewers without bloating the app. We load viewers inside iframes,
and communicate with them through frame messaging API.

I want you to use Escherpad as the **only** note taking app you ever need to 
fire up, where you can search for **any** note you have taken.

I want professionals to use this for both work **and** personal stuff on work
computer without the need to install anything locally on work computer

For small startups, I want to replace unweldy issue trackers and trello with
Escherpad. For classroom I want to replace Q and A sites.

I want to have people's documents, and build AI that can help them automate
manual work.

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