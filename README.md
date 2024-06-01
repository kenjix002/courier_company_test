# courier_company_test

## To Run

### Docker

### About

Login

```
User:   Admin
Pass:   Admin@123
```

nodemon for development

```
npm i -g nodemon
```

sequelize

```
sequelize model:create --name Auth --attributes username:string, password:string
```

Add to Dockerfile
npm run migrate
npm run seed

default add
vehicle type - 2
maintenance_type - 4
user - 2

TODO
add controller user
add seeder

complete controller
middleware auth
