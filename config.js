try {
    switch (process.env.NODE_ENV) {
        case 'development':
            process.env.DB_URL = `postgres://${process.env.PG_USERNAME}:${process.env.PG_PASSWORD}@${process.env.PG_HOSTNAME}:${process.env.PG_PORT}/${process.env.PG_DB_NAME}`;
            break;
        default:// 'staging' or 'production'
            process.env.DB_URL = `postgres://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
            break;
    }
} catch (err) {
    console.log(err, '\n\nError configuring the project. Have you set the environment veriables?');
}

exports.google = {
  clientID: '568090652942-7fs3jhjr48poa55gm3357bveh5umis31.apps.googleusercontent.com',
  clientSecret: 'Ad7In-4EsX8ak--IVcCtjzMo',
  callbackURL: 'http://timemap.us-west-2.elasticbeanstalk.com/auth/google/callback',
};
