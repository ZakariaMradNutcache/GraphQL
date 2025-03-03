import chalk from 'chalk';

import httpServer from './src/app.js';

const PORT = process.env.PORT;

httpServer.listen(PORT, err => {

    //Nous avons une erreur
    if(err) {
        console.log(chalk.red(err));
        process.exit(1);
    }

    console.log(chalk.blue.bold(`👍 Serveur en fonction sur le port ${PORT} 👍`))

});
