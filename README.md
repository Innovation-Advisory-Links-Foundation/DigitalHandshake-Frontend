# <img src="resources/logo.svg" alt="DHSLogo" width="400px">

**A blockchain-based solution for making digital handshakes guaranteeing transparency on identity, code and payments.**

- Building a new concept of trust from platform to code through an EOSIO blockchain-based solution.
- Democratic and decentralized dispute mechanism involving the selection of pseudo-random professionals reducing the cost-benefit ratio.
- Decentralized escrow service designed to secure tokens payments and automatically redistribute amounts based on handshake status.
- Accelerates the digitalization process for those who cannot sustain the costs by providing a unique and priceless digital identity.

You can learn more about the main challenges of building trust for digitally signed handshake agreements to the article on our [OverTheBlock Medium](https://medium.com/overtheblock/) page.

## Table of Contents

- [Workflow](#workflow)
- [Frontend](#frontend)
- [Getting Started](#getting-started)
  - [Prerequisities](#prerequisities)
  - [Configuration](#configuration)
  - [Usage](#usage)
- [Screenshoots](#screenshoots)
- [Development Rules](#development-rules)
  - [Commit](#commit)
  - [Branch](#branch)
- [License](#license)

## Workflow

<div align="center">
    <img 
        align="center" 
        src="./resources/workflow.svg" 
        alt="Workflow"
    />
    </div>
<p align="center"> <i>Figure 1.</i> The high-level overview of Digital Handshake workflow. </p>

Figure 1 shows an example of the high-level overview of our solution's workflow for the digital handshake. As we can see, the different types of actors and process steps for the correct definition and conclusion of the agreement are presented. Specifically, there are two different categories of stakeholders:

- **Users.** An individual registered on the platform and uniquely recognized in the blockchain through a human-readable address. The user can have the Dealer's role when it posts a request for a particular service (e.g., I need a website!) or Bidder's role when it proposes to satisfy a particular request for a service. A user can play both roles, one for each handshake.

- **Jurors.** Professionals or legal experts recorded on the platform assisting parties in the judgment of a dispute. It does not have a concrete motivation to participate in the handshake but is interested in receiving new dispute assignments to increase earnings.

The on-chain business logic is broken down into three smart contracts, where each solves a particular function:

- **Token.** A standard ERC20 token (DHS) offers price stability when making any form of payment.

- **Service.** All features for stipulating digital handshakes. Interacts with the escrow for automating token redistribution according to handshake status.

- **Escrow.** A service that locks amounts of DHS tokens for automating payments.

## Frontend

<div align="center">
    <img 
        align="center" 
        src="./resources/architecture.svg" 
        alt="Architecture"
    />
    </div>
<p align="center"> <i>Figure 2.</i> The high-level overview of Digital Handshake architecture. </p>

Figure 2 shows the architecture of the proof-of-concept of a decentralized application (dApp). The frontend is a React web application. To reduce complexity in user access, we have implemented a custom login component with a password. This works like the classic client-side wallet providers comply with the key's security rules and is easily digestible by the user. Provides a tabular layout that allows users to move quickly between the various handshakes through a sorting and filtering system. The user bar that shows rating, current balance and quantity of tokens locked allows always to keep track of token movements. Communicate directly with the blockchain and off-chain database through two different ad-hoc services. The blockchain service was implemented from scratch with the eosjs library to ensure greater freedom in managing transactions and related feedback.

## Getting Started

### Prerequisities

You need to have the following installed:

- [git](https://git-scm.com/downloads) >= _2.21.0_
- [node](https://nodejs.org/en/download/) >= _10.16.0_
- [npm](https://www.npmjs.com/get-npm) >= _6.14.4_

### Configuration

Clone the repository and install the packages:

```bash
git clone https://github.com/Innovation-Advisory-Links-Foundation/DigitalHandshake-Frontend.git
cd DigitalHandshake-Frontend
npm install
```

```bash
NODE_PATH=src
# absolute path for require()
# DO NOT CHANGE NOR REMOVE THE ABOVE

REACT_APP_EOS_DHS_SERVICE_CONTRACT="dhsservice"
REACT_APP_EOS_DHS_TOKEN_CONTRACT="dhstoken"
REACT_APP_EOS_DHS_ESCROW_CONTRACT="dhsescrow"
REACT_APP_EOS_HTTP_ENDPOINT="http://localhost:8888"
REACT_APP_MONGODB_EXPRESS_NODE_SERVER_ENDPOINT="http://localhost:8080"
REACT_APP_USER_API="api/v1/users"
REACT_APP_NEGOTIATIONS_API="api/v1/negotiations"
REACT_APP_MOTIVATIONS_API="api/v1/motivations"
```

- The `REACT_APP_EOS_DHS_SERVICE_CONTRACT`, `REACT_APP_EOS_DHS_TOKEN_CONTRACT` and `REACT_APP_EOS_DHS_ESCROW_CONTRACT` are the names of the smart contracts.
- The `REACT_APP_EOS_HTTP_ENDPOINT` represents the endpoint of the EOSIO development node.
- The `REACT_APP_MONGODB_EXPRESS_NODE_SERVER_ENDPOINT` represents the endpoint of the Express NodeJS server which receives requests for the MongoDB instance.
- The `REACT_APP_USER_API`, `REACT_APP_NEGOTIATIONS_API` and `REACT_APP_MOTIVATIONS_API` are the names of the rest API main routes.

### Usage

To start the ReactJS application.

```bash
npm start
```

Run ESLint to check the syntax of your TypeScript code.

```bash
npm run code:lint
```

Run ESLint along with Prettier for syntax checking, style and code fix to your TypeScript code.

```bash
npm run code:fix
```

## Screenshoots

TODO

## Development Rules

### Commit

See how a minor change to your commit message style can make you a better programmer.
Boilerplate
Format: `<type>(<scope>): <subject>`

`<scope>` is optional

#### Example

```
[feat]: add hat wobble
^----^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

More Examples:

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semicolons, etc.; no production code change)
- `refactor`: (refactoring production code, e.g., renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc.; no production code change)

**References**:

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Commit Messages](https://seesparkbox.com/foundry/semantic_commit_messages)
- [Git Commit Msg](http://karma-runner.github.io/1.0/dev/git-commit-msg.html)

### Branch

- The _master_ branch must be used for releases only.
- There is a dev branch, used to merge all sub dev branch.
- Avoid long descriptive names for long-lived branches.
- No CamelCase.
- Use grouping tokens (words) at the beginning of your branch names (in a similar way to the `type` of commit).
- Define and use small lead tokens to differentiate branches in a meaningful way to your workflow.
- Use slashes to separate parts of your branch names.
- Remove branch after merge if it is not essential.

Examples:

    git branch -b docs/README
    git branch -b test/one-function
    git branch -b feat/side-bar
    git branch -b style/header

## License

This repository is released under the [GNU-GPL3](https://github.com/Innovation-Advisory-Links-Foundation/DigitalHandshake-Frontend/blob/master/LICENSE) License.

---

Digital Handshake Frontend © 2021+, [LINKS Foundation](https://linksfoundation.com/)
