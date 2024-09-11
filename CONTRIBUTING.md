# Contributor's guide

Before you start, consider taking a look at the [documentation](https://librereader.pages.dev/). It will give you a good understanding of the project and can help you understand the context of your contributions.

## How to contribute

This project encourages contributions from the community. You can contribute in the following areas:

- **Feedback**: Help make the project better by sharing your ideas. Start a conversation by opening a [feedback discussion](https://github.com/ju4n97/librereader/discussions). Once discussed and accepted, an issue will be created, allowing you to work on it or leave it for others to work on.
- **Documentation**: Help improve the project’s documentation. Small changes like fixing typos or broken links can be submitted directly as a PR. For bigger changes, start a conversation by opening a [feedback discussion](https://github.com/ju4n97/librereader/discussions).
- **Bug discovery**: Help improve the project’s stability by identifying and reporting bugs. Before flagging an issue, [ensure it hasn't already been addressed](https://github.com/ju4n97/librereader/issues). If no one else has reported it, you can either fix it yourself or leave it for others to fix.

## Contribution workflow

1. **Open an issue**: Users start new issues for various reasons such as reporting bugs or proposing changes.
2. **Review and labeling**: The maintainers review the new issues and label them as follows:
   - `duplicate`: Issues that duplicate another and require consolidation.
   - `blocked`: Issues impeded by dependencies or external factors.
   - `needs owner`: Issues ready for work, awaiting volunteer contribution.
   - `needs revision`: Issues lacking necessary information or clarity.
   - `under review`: Issues pending further discussion or decision-making.
   - `wontfix`: Issues falling outside the project's scope and not planned for resolution.
   - `breaking change`: Issues that introduce significant alterations to the project's codebase or functionality, potentially breaking backward compatibility or requiring substantial reworking of existing implementations.
3. **Volunteer**: You or other volunteers can express interest in resolving issues by offering solutions or volunteering for ownership.
4. **Assignment**: The maintainers assign issues to volunteers, making them the issue’s "owner".
5. **Pull request submission**: The issue owner submits a pull request with the proposed changes to resolve the issue.
6. **Review and merge**: The maintainers review the pull request, provide feedback if necessary, and merge it into the main repository upon approval.

## Good first issues

If you’re new to the codebase, consider starting with issues labeled as [good first issue](https://github.com/ju4n97/librereader/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+-label%3A%22blocked+by+upstream%22). These issues are relatively straightforward to work on. Before you start, make sure there’s no existing PR for the issue and that it hasn’t been assigned to anyone yet. Once you’ve found an issue you’d like to work on, notify the maintainers by commenting on the issue. This ensures proper coordination and prevents overlapping.

## Coding style

This project uses [Biome](https://biomejs.dev/) for linting and formatting. You can see the enabled rules in [biome.jsonc](biome.jsonc).

## Git workflow

The git branching model used in this project aligns with [trunk-based development](https://trunkbaseddevelopment.com/).

1. **Development**: Developers work on temporary branches to add new features or fix errors. Changes should be frequently integrated with the main branch (`master`) to minimize merge conflicts.
2. **Code review**: Once changes are complete, a pull request should be created to merge the temporary branch with `master`. The PR should be reviewed and approved by at least one maintainer before merging.
3. **Merge and release**: The pull request is merged into `master`, triggering an automatic release workflow.

```mermaid
gitGraph
    commit
    commit
    branch feature/branch1
    checkout feature/branch1
    commit
    commit
    checkout main
    merge feature/branch1
    commit
    commit
```

## Changesets workflow

This project uses [Changesets](https://github.com/changesets/changesets) for streamlined package versioning, automated changelog generation, and automated GitHub releases.

1. **Implement changes**: Make all necessary adjustments to the feature you're working on.
2. **Generate changeset**: Run `bun changeset` to generate a new changeset and follow the prompts. Remember to maintain [SemVer](https://semver.org/) compliance.
   - `patch`: for bug fixes.
   - `minor`: for new features.
   - `major`: for breaking changes.
3. **Commit changes**: Commit your changes along with the newly generated changeset.
4. **Submit a pull request**: Submit a pull request to integrate your changes. Once your pull request is merged and the packages are released, you'll see your descriptive changes in the changelog of the affected packages.

> [!NOTE]
> No need to generate a changeset if you're not working directly on a workspace package.

## License

By contributing to this project, you agree to license your contributions under the project’s [license](LICENSE).
