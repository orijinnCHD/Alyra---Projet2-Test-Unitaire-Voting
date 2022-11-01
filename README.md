
# Test Unitaire

Ce projet propose un test unitaire en JS d'un smart contract de vote.

## Description

Dans le cadre d'un projet éducatif, une premiére approche de test unitaire dans de l'environnement blockchain. pour cela, nous utiliserons l'environnement de travial hardhat , ainsi que différents outils comme : gas-reporter, solidity coverage, la biblio de openZeppelin .
en restant dans une approche d'integration continue (CI) 







## environnement de travail

- linux
- node.js
- hardhat
- solidity


## outils de test

- openzeppelin-test-helper
- gas-reporter
- solidity coverage

## integration continue (CI)

- Github actions








## Installation

Clone the project

```bash
  git clone https://github.com/orijinnCHD/Alyra---Projet2-Test-Unitaire-Voting.git
```

Installer les dépendances

```bash
  npm install
```
## Démarrage des tests

Commencer les tests

```bash
  npx hardhat test test/TestVoting.js
```

Faire un coverage de test

```bash
  npx hardhat coverage
```


## La structure des tests

on a opté pour une structure de test  en 5 points :

- deployement
- variable
- core function
- require
- event


![describe 1](https://user-images.githubusercontent.com/110608787/199268411-0ca63f50-229b-4eb4-a0dd-d561bcf7d457.png)


![describe require](https://user-images.githubusercontent.com/110608787/199268631-624dd8f5-cc22-4dfd-a2c0-ede87b2c8b95.png)

![describe Event](https://user-images.githubusercontent.com/110608787/199268660-4ca51557-3caa-4fb9-9f40-cc37ef57956e.png)

## Resultat du test gas-reporter

![gas -reporterv2](https://user-images.githubusercontent.com/110608787/199269675-917617a4-9962-4ce0-8d0b-ca50fdc1ac84.png)


## Resultat du test coverage

![coverage](https://user-images.githubusercontent.com/110608787/199269361-35aee2dd-d4c9-424d-b846-ba4af7b4fd04.png)

## Integration sur GithubAction

Vous pouvez revoir l'ensemble de integration build-test-coverage sur github actions en cliquant sur la derniére integration 

![integration continue](https://user-images.githubusercontent.com/110608787/199271563-dc9008e4-73e4-4e54-a62c-b6dfd0ba0c9c.png)



