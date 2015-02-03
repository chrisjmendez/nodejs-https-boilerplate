Basic HTTPS server using NODEJS
=


CLONING APP USING GIT

- Create ExpressJS app

```
	express <name of app>
``` 

CREATING A SELF-SIGNED CERTIFICATE FOR TESTING

- Create a self-closed certificate and private key. 

```
openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
```

- Using the csr.pem, ceate a public certificate called server.crt

```
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
```

- Temporary data for local self-signed 

```
Country Name (2 letter code) [AU]: US
State or Province Name (full name) [Some-State]:<Name of State>
Locality Name (eg, city) []:<Name of City>
Organization Name (eg, company) [Internet Widgits Pty Ltd]: <Name of Company>
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:localhost
Email Address []: mail@youremail.com
```

CONFIGURING NODEJS FOR HTTPS

- Place the Private Key ```key.pem``` and Public Certificate ```server.crt``` inside a new directory called ```/ssl``` so that your apps.js looks like this.

```
    var options = {
        key: process.env.SSL_PRIVATE_KEY || fs.readFileSync('./ssl/key.pem'),
        cert: process.env.SSL_PUBLIC_KEY || fs.readFileSync('./ssl/server.crt'),
        requestCert: true,
        rejectUnauthorized: false
    }
```



START YOUR ENGINES

- Set the app to "production" mode

```
 $ NODE_ENV=production nodemon app.js
```

VIEW ONLINE
```
 https://localhost:3000/
```

Resources
-

- [NodeJS https error](http://c343c.org/katharine/2015/01/28/node-js-https-pem-error-routinespem_read_biono-start-line/)
- [How to redirect HTTP to HTTPS](http://www.tonyerwin.com/2014/09/redirecting-http-to-https-with-nodejs.html)

SSL
- [Add SSL Certificate to Openshift App](https://www.techswag.nl/OpenShift/SSL/2014/01/17/add-ssl-certificate-to-openshift-app-with-custom-domain/)
- [Add SSL Certificate to Openshift by Cloudhosting Source](http://cloudhostingsource.com/setup-ssl-certificate-openshift/)

HTTPS
- [How to redirect access to https](https://help.openshift.com/hc/en-us/articles/202398810-How-to-redirect-traffic-to-HTTPS-)
