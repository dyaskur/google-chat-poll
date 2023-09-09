# Contributors Guide

"Absolute Poll" is a Google Chat add-on application designed with an event-driven architecture. This means that the application will only engage with Google Chat when it receives events or webhooks from the platform. To handle these interactions, we have a single HTTP route defined in our index.ts file, and the routing is determined based on the specific event type.

For any further inquiries or questions related to this project, please don't hesitate to [reach out to me](https://github.com/dyaskur).

## Project Structure

The main files of the application are located inside `src` folder.

### `handler`

This folder contains all the necessary files to handle events originating from Google Chat webhooks or task schedulers.

### `card`

Within this folder, you will find the files responsible for generating Google Cards or the user interface (UI) of our application within Google Chat.

### `helpers`

In this folder is located the utility or helper files.

## Build & Deploy

to deploy this application you can use `yarn deploy` or `npm run deploy`. Make sure you have correct env state in *.env.yaml*

if you want to deploy manually to google could function console, you can get compiled javascript with `yarn build`.

## Unit tests

For every function or class you develop, it's essential to accompany it with corresponding unit tests for comprehensive coverage.

As additional context, the initial development of this application followed the Test-Driven Development (TDD) approach.
This involved creating JSON cards and unit tests as the initial steps, with subsequent code implementation to generate the cards or fulfill the test cases. 
However, it's worth noting that we have moved away from TDD, as it became complex to anticipate the visual outcome of JSON cards during development.
Nevertheless, when contributing, you are welcome to consider TDD as a beneficial practice.


## Conventions

You can follow [Google's TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

### Code Style

The project is equipped with [ESlint](https://eslint.org/) configuration files containing essential style rules.  
Please ensure that you run ESLint before making a commit. 

### Commits

The commit style adopted for this project is [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).  

We can enhance our commit creation process by employing IDE extensions. Here are some illustrative examples:

 * VSCode: [Conventional Commits Extension](https://marketplace.visualstudio.com/items?itemName=vivaxy.vde-conventional-commits) - created by vivaxy.
 * PhpStorm or other Jetbrains IDE: [Conventional Commits Plugin](https://plugins.jetbrains.com/plugin/13389-conventional-commit) - created by Edoardo Luppi.

### Other recommendations

Avoid committing very minor details such as fixing typos resulting from a previous commit. 
If you need to rectify a prior commit, refrain from creating a new one. Instead, you can undo the previous commit by following this tutorial:
https://stackoverflow.com/questions/927358/how-do-i-undo-the-most-recent-local-commits-in-git and then you can recommit again.

## Debug

To debug, you can follow these steps:

1. **Unit Testing:** Begin by checking the unit tests of your application. You can run and debug these tests using your preferred  IDE or code editor such as PhpStorm, VSCode, etc.

2. **UI Debugging:** For debugging the user interface (UI) of the card, you can utilize [https://gw-card-builder.web.app/](https://gw-card-builder.web.app/). This online tool allows you to visualize and interact with the card's UI for debugging purposes.

Due to the absence of a Google Card Emulator, local live UI debugging is currently not possible. 


Please feel free to reach out if you have any further questions or require assistance.
