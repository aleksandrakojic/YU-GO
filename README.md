# `Yu-Go DAO`

YU-GO DAO a un contexte social et un modèle de conception centré sur les femmes qui utilise les technologies blockchain avec son potentiel pour donner des pouvoirs aux communautés marginalisées grâce à la décentralisation.

L'objectif principal du DAO est d'impliquer les organisations non-gouvernementales et les activistes des droits des femmes dans le but de protéger, émanciper et autonomiser les femmes sur le territoire de l'ex-Yougoslavie, en promouvant différentes formes de valeur communautaire, en améliorant l'organisation autour d'actions communes et l'engagement des utilisateurs finaux à travers prise de décision démocratique, système de vote automatisé et transfert de fonds instantané pour les actions proposées grâce à une technologie blockchain.

Ce projet est réalisé avec [react-moralis](https://github.com/MoralisWeb3/react-moralis) et [Moralis](https://moralis.io?utm_source=github&utm_medium=readme&utm_campaign=ethereum-boilerplate).

Veuillez voir [official documentation](https://docs.moralis.io/#user) pour toutes informations sur les fonctionnalités de Moralis.

# Sommaire

- [ Mise en place](#-quick-start)
- [ Fonctionnement](#-fonctionnement)
- [ YG Token](#-yg-token)

# Mise en place

📄 Clone ou fork `Yu-Go`:

```sh
git clone https://github.com/aleksandraDev/YU-GO
```

💿 Installation des dépendances:

```sh
cd YU-GO
npm install
```

✏ Renomme `.env.example` en `.env` dans le dossier principale puis renseigner votre `appId` et `serverUrl` provenant de Moralis ([How to start Moralis Server](https://docs.moralis.io/moralis-server/getting-started/create-a-moralis-server))
Exemple:

```jsx
REACT_APP_MORALIS_APPLICATION_ID = xxxxxxxxxxxx
REACT_APP_MORALIS_SERVER_URL = https://xxxxxx.grandmoralis.com:2053/server
```

🚴‍♂️ Lancement de l'App:

```sh
npm start
```

🚴‍♂️ Lancement du Ganache Local:

```sh
npm run devchain
```

🚴‍♂️ Deploiement :

```sh
npm run deploy
```

# Fonctionnement

![alt text](https://i.ibb.co/GCBR8jz/how-it-works.png)

Le YU-GO DAO n'a pas besoin d'autorité centrale. Au lieu de cela, le groupe prend des décisions collectivement et démocratiquement avec transparence, équité et fiabilité en votant sur les actions préalables proposées par les organisations, où l'organisation de la proposition gagnante obtient des paiements automatiques autorisés pour financer et réaliser son action.

Les fonds pour la réalisation des actions proviennent des organismes subventionnaires, qui disposent d'un budget dédié au financement de nouveaux projets. Les organismes subventionnaires proposent un certain fond à travers un concours où d'autres organismes peuvent postuler avec leurs propositions d'action. Après fin automatique de l'application à la date proposée par le concours créé, les membres de DAO peuvent voter pour les actions proposées. La fin du vote est suivie de transferts automatiques de fonds aux organisations des actions gagnantes qui sont portées du budget proposé par concours.

Chaque organisation est catégorisé par sa thematique et pays. Lorsqu'un concours est proposé, seul les orgnisations qui correspondent à la thématique et le pays peuvent participer au vote.

L'historique des votes est stocké d'une manière transparent sur la blockchain. Cependant les données utilisateurs et organisation sont stocké (nom, prenom, tel, ... ) sur la base de donnée Moralis.

# YG Token

Chaque organisation achète un token de participation à la plateforme. Potentiellement, avec une souscription mensuelle/annuelle. A la fin de la souscription, le token est burné. Le token n'est transferable que par l'owner.
