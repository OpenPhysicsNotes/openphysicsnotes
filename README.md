# openphysicsnotes
Open Physics Notes **server** and **content** main repository.

Visit our website @ [openphysicsnotes.org](openphysicsnotes.org)!

## About this project

This project is aimed to provide a common way of **sharing notes**, *lessons* and *exercises* for **physics**, **math** or any **other** discipline.

Out there there are a lots of students managed shared folders with free notes, pdf and other awesome content :hugs:. For example, at UniPi we have:
 - [studentifisicapisa.altervista.org](http://studentifisicapisa.altervista.org/cartella-mega/?doing_wp_cron=1652290811.6795101165771484375000)
 - [Mega Folder](https://mega.nz/#F!uJsACb7Z!CgzObPGHkau7CNd3LcKjOw)
 - other internal drives with not-so-legal content i cannot post

So we came with the idea of a unified place to share content. Not by writing separate PDFs (hard to collaborate with) but a more dynamic website so that it is easier to collaborate, create notes for a courses, make alternative note courses it you don't like the existing ones.  
Also we will provide a simple Mega-like sharing system for additional content and large files so that Mega folders would not be needed anymore.

<!-- TODO sharing system -->

Note that this website **is not** a *encyclopedia*, use [WikipediA](wikipedia.org) for that. Anyway we hope to add a wikipedia style app to organize theorems and useful equations in the future!

## Ideas to implement

 - [x] a web server
 - [ ] (optional) a static website generator?
 - [ ] a file sharing portal
 - [ ] a theorems organization system
 - [ ] a collaborative web app to make it easier to collaborate
 - [ ] a better content organization
 - [ ] write extensive guides and contributing tips
 - [ ] create an awesome graphics
 - [ ] use 3rd level domains for the editing app, sharing content, wiki, and other stuff
 - [ ] TODO use [creativecommons.org](https://creativecommons.org/)
 - [ ] dark/light theme
 - [ ] a [two.js](https://two.js.org/) based or inspired graphics library that allows contributors to easily write professional drawings, with the possibility of fluid animations. (The problem is how to make intellisense work in such files for a library like this, see [working with javascript](https://code.visualstudio.com/docs/nodejs/working-with-javascript))
 - [ ] [pyscript](https://pyscript.net/)
 - [ ] serve content using a react application instead od dynamically generated html, or use a react application in `edit.openphysicsnotes.org`, a VS like website that uses browser storage to make changes and push on github or any other cloud.
 - [ ] `raw.*.org`
 - [ ] `drive.*.org`
 - [ ] `raw.drive.*.org`
 - [ ] edit link like mdn + edit directly on `github.dev`
 - [ ] opn preview plugin + something like `.opn.config.json/yaml` and relative schema
 - [ ] caching
 - [ ] pdf and latex exportation
 - [ ] un file config.ts per fare in modo che alcune impostazioni come live reload sia abilitato solo in development; move reloader in a separate file instead of plain js inside the html
 - [ ] [compression](https://www.npmjs.com/package/compression)
 - [ ] add allowed extensions such as lcml or lcmd and add a vscode extension for a correct preview or extend default MD preview

## Stuff organization

At the moment, there is only one big repository, in the future this will change and we will separate the content in one or multiple repos.

In this repo you will find:
 - `server/`: the folder containing all the server scripts, you can use `npm start` to start a local preview server
 - `content/`: the folder containing the website and **notes** content.

For any info on how to contribute, see [contributing.md](./contributing.md)

## Discussion

Please use the [GiHub Discussion](https://github.com/OpenPhysicsNotes/openphysicsnotes/discussions) and use [GitHub Issues](https://github.com/OpenPhysicsNotes/openphysicsnotes/issues) to point out problems, make proposals, suggestions or request project clarifications.

---

Enjoy :wink:
