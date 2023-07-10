# Contributing

First off, thanks for considering contributing to OpString! 🙌

Within this document you can find guidelines for contributing to OpString.

* [Code of Conduct](#code-of-conduct)
* [Support Questions](#support-questions)
* [Issues and Bugs](#issues-and-bugs)
* [Feature Requests](#feature-requests)
* [Pull Requests](#pull-requests)
* [Coding Guidelines](#coding-guidelines)
* [Commit Message Guidelines](#commit-message-guidelines)
* [Licensing](#licensing)

## Code of Conduct

Let's keep OpString open and inclusive. Please read and follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Support Questions

For general support questions, check out the [Q&A section](https://github.com/meezwhite/OpMapper/discussions/categories/q-a) in Discussions.

## Issues and Bugs

If you find a bug in the source code or a mistake in the documentation, you can help by [submitting an issue](https://github.com/meezwhite/OpString/issues).

Guidelines:

1. Make sure the issue has not already been reported; use the search for issues.
2. If possible, include a simple example demonstrating the issue (e.g. via [CodePen](https://codepen.io/pen)) using the latest OpString version.
3. You are welcome to create an accompanying Pull Request with a fix. Check out the section on [Pull Requests](#pull-requests).

## Feature Requests

You can request a new feature by starting a discussion in the [Ideas section](https://github.com/meezwhite/OpString/discussions/categories/ideas) in Discussions.

Guidelines:

1. Make sure the feature has not already been requested; use the search for discussions.
2. You are welcome to create an accompanying Pull Request with your implementation, however, let us talk about it first in Discussions.

## Pull Requests

Pull Requests should be accompanied by an issue (for bugs and documentation mistakes) or a discussion (for patches, improvements, and feature requests) unless you're suggesting small changes.

Guidelines:

1. **Install system tools**
    * Any OS: `git`, `node >= 16.14.0`, `npm >= 8.3.0`
    * macOS: `sed`, `xargs` (both should be preinstalled)
    * Windows: TBD, check out [Roadmap](#roadmap)
2. **Fork, Clone, Configure remotes, Install dependencies**
    ```bash
    # Clone your fork of OpString
    git clone https://github.com/<your-username>/OpString
    # Navigate to the newly cloned directory
    cd OpString
    # Assign the original repository to a remote called upstream
    git remote add upstream https://github.com/meezwhite/OpString
    # Install dependencies
    npm i
    ```
3. **Get the latest changes from upstream** (Optional, but recommended)
    ```bash
    git checkout main
    git pull upstream main
    ```
4. **Create a new branch** to contain your changes. (Optional, but recommended)
    ```bash
    git checkout -b <topic-branch-name>
    ```
5. **Making changes**<br>
    * Make changes to `index.js`.
6. **Testing and examples**
    * Currently not available
7. **Document changes**
    * Annotate your changes inside `index.js` following [JSDoc](https://jsdoc.app).
    * Update the `README.md` file to reflect your changes accordingly.
8. **Commit changes**
    * Before commiting your changes:
        * (Optional) You can use [git rebase](https://help.github.com/articles/about-git-rebase) to clean up your commit history before submitting a Pull Request on GitHub.
    * Commit your changes following the [Commit Message Guidelines](#commit-message-guidelines) to the best of your ability.
9. **Locally rebase (or merge) upstream changes** (Optional, but recommended)
   * **Recommended:** Update your branch to the latest changes in the upstream main branch
        ```bash
        git pull --rebase upstream main
        ```
    * Alternative: Merge your changes with upstream changes
        ```bash
        git pull upstream main
        ```
10. **Push changes to your fork**
    ```bash
    # If you rebased, you'll need to force push
    git push -f origin <topic-branch-name>

    # Otherwise
    git push origin <topic-branch-name>
    ```
11. **Open a Pull Request** to OpString main branch with a clear title and description. ([GitHub info about using Pull Requests](https://help.github.com/articles/using-pull-requests))

## Coding Guidelines

To the best of your ability, please follow [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript).

## Commit Message Guidelines

Feel free to follow the guidelines below on how to construct your commit messages (based on [Angular's guidelines](https://github.com/angular/components/blob/272f50a139c39d676f5de36e346be60521f2779d/CONTRIBUTING.md#-commit-message-guidelines)).

But don't worry too much about them. 😌

```
<type>(<scope>): <subject>

<body>

<footer>
```
*NOTE: The `<scope>`, `<body>` and `<footer>` are optional.*

### Type

Should be one of the following:

* **feat**: Creates a new feature
* **fix**: Fixes a bug
* **docs**: Changes to documentation
* **test** or **example**: Adds, changes, improves example
* **refactor**: Refactor without any change in functionality or API
* **style**: Style changes (code formatting, missing semi-colons, white-spaces, etc.)
* **perf**: Improves performance without any change in functionality or API
* **build**: Changes to build system and tooling
* **chore**: Changes to meta files (e.g. *package.json*, *.gitignore*)

### Scope

Determine the scope using the following guidelines in order:

* If `<type>` is *style*, omit the scope.
* If `<type>` is *build*, `<scope>` should be either *darwin*, *win32* or *linux*
* If `<type>` is *docs*, `<scope>` should be either the name of the file that has been changed (e.g. *README*), or the name of the function for which the description has been changed (e.g. *execute*).
* If `<type>` is *chore*, `<scope>` should be the name of the file (e.g. *package.json* or *.gitignore*)
* If changes are exclusive to a library function, use that function's name (e.g. *constructor*, *append*, *insert*, *prepend*, *remove*, *execute*, *validateArguments*); otherwise, use *lib*.
* If changes are in regard to the builder use *builder*.
* Otherwise, omit the scope.

*NOTE: If you omit `<scope>`, also omit the parentheses.*

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body

Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes".

The body is the place to include the motivation for the change and contrast this with previous behavior.

### Footer

The footer is the place to mention **Breaking Changes** and reference GitHub issues that this commit tackles.

**Breaking Changes** should start with `BREAKING CHANGE:` followed by a space or two newlines. The rest of the commit message is then used for this.

**Referencing issues** should happen on the last line in the footer. You may reference multiple issues.

## Licensing

By making a contribution to OpString, you agree to license your work under the [MIT License](./LICENSE) and you agree to the Developer's Certificate of Origin 1.1, which you can find below or at https://developercertificate.org.

```
Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```
