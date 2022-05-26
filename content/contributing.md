---
title: contributing @ OPN
---

<!-- see live @ http://openphysicsnotes.org/contributing.md -->
<!-- TODO change with https when available -->

# Contributing

::: note
This is a temporary workflow, in the future this process will be made easier, an on-line real time collaborative editor app will be provided.
:::

Everyone can contribute to this notes and its relative website, at the moment, the only way to do that is through github repo contribution: this allows to track changes an attribution.

The basic steps are:
1. install necessary software
1. fork the repo
1. make changes
1. make a pull request

In case you have been added to the contributors, this reduces to:
1. install necessary software
1. make changes
1. push changes

## Software

### Node, npm

The server is written in typescript, we use node to execute our server so you have to download and install it.
You can download it from [nodejs.org](https://nodejs.org/it/download/).

::: warning
For Windows users.  
You are advised to use the `.msi` installer that will take care of everything. In other cases, you might need to add `node` and `npm` to the system `PATH` in order to be able to easily execute all the steps
:::

### Any text editor

You can use your preferred text editor, we suggest [VSCode](https://code.visualstudio.com/) for its simplicity and integration.

If you use VSCode, you may be interested in the following plugins:
 - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) for spell checking of your documents
 - [Markdown Emoji](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-emoji) if you want to see emoji in VSCode default preview window

::: note
We hope we can provide a VSCode extension soon to make it easier editing without starting the local server
:::

### Git

Use your favorite git app, for example [Github Desktop](https://desktop.github.com/) that is very simple to use

## Forking

If you are not an approved contributor, you have to fork the project in order to make changes. Simply go to [GitHub](https://github.com/) and fork the [main repo](https://github.com/OpenPhysicsNotes/openphysicsnotes)

You can now clone the fork on your computer and start making changes.

## Start editing

You can now start editing the project. At the time of writing, the content is in the `/content` folder.

If you use VSCode, you may simply:
```sh
code .
```
or, if you just want to edit something and ignore the rest of the project:
```sh
code ./content/path/to/some/article/folder/
```

::: note
See the [cheat-sheet](/cheatsheet/)
::: todo
`tip`
:::
:::

### Committing changes

Remember to commit only the necessary content avoid committing temporary or unnecessary files.
Avoid committing large files.

::: todo
provide a way of sharing large files separately
:::

### Open a preview

To open a preview you need to execute the following commands:
 1. `npm install`: this will download the necessary libraries
 1. `npm start`: to open a server on `localhost`
 1. on your browser, open http://localhost:8000/

::: note
if you edit a `.md` article, the web page automatically refreshes on file save.
:::

### Publish on the local network

If you want the content to be visible to the local network you have to use:
```sh
node ./dist/print_network_interfaces.js
```
to get a list of network interfaces on your computer, for example:
```
VirtualBox Host-Only Network: fe80::545:11d:d85c:28b7 IPv6 false
VirtualBox Host-Only Network: 192.168.56.1 IPv4 false
Wi-Fi: fe80::70d3:9d84:8081:4513 IPv6 false
Wi-Fi: 10.0.0.101 IPv4 false
Loopback Pseudo-Interface 1: ::1 IPv6 true
Loopback Pseudo-Interface 1: 127.0.0.1 IPv4 true
```
::: todo
remove automatic language detection in code blocks!!!
:::
Choose the correct one, for example `Wi-Fi` and then:
```sh
(sudo) node ./dist/index.js Wi-Fi
```

You can now access the website from the LAN. If you want to access it from the outside you can use [localtunnel](https://github.com/localtunnel/localtunnel) or enable port forwarding on your router.

## Pull request

When you like your changes, create a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) so that your changes are merged into the website

## Congratulations

You are now a contributor! :tada::tada::tada:

Your changes will be visible on the website soon! :sparkles: