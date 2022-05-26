

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


poi nella home:
https://www.dexterindustries.com/howto/run-a-program-on-your-raspberry-pi-at-startup/
```sh
sudo nano /etc/rc.local
```

e aggiungi