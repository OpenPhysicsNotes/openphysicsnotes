

initial update
```sh
sudo apt update
sudo apt upgrade
```

install node
https://www.golinuxcloud.com/install-nodejs-and-npm-on-raspberry-pi/
```sh
sudo su
curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
sudo apt install nodejs
```

setup del progetto
```
cd ... roba varia
https://github.com/OpenPhysicsNotes/openphysicsnotes
cd openphysicsnotes
npm install
```

per aggiornare:
```
git pull
```

per compilare e far partire in localhost con un solo comando:
```
npm start
```

per compilare e basta:
```
npm run build
```

per visualizzare le reti:
```
node ./dist/print_network_interfaces.js
```

e poi per esempio:
```
sudo node ./dist/index.js wlan0
```
sudo è necessario per aprire una porta alla rete


poi setup vnc e risoluzione a vuoto ....


## HTTPS

https://letsencrypt.org/getting-started/, cosigliato dalla[guida google](https://support.google.com/domains/answer/7630973?hl=it&visit_id=637891518268132376-3152206&rd=1)

https://certbot.eff.org/instructions?ws=other&os=debianbuster

```
sudo apt update
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo snap refresh
sudo certbot certonly --standalone
```

non mi funziona... allora:

```
sudo apt install certbot
sudo certbot certonly --standalone
```
email associata: luca.ciucci99@gmail.com
