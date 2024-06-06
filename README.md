# Courier Company App

## About

### Includes

This application consists of 3 parts:

- client (React)
- server (NodeJS)
- database (MySQL)

### Features

User

- ADMIN access only
- list of users
- create user

Registered Vehicle

- ADMIN can see all registered vehicle
- DRIVER can see only their vehicle
- register new vehicle-driver
- status check for maintenance detail for specific vehicle

Vehicle Type

- ADMIN access only
- list of vehicle available within the company
- create new vehicle
- modify existing

Maintenance Type

- ADMIN access only
- list of type of maintenance for a vehicle
- create new type of maintenance
- modify existing

## RUN

### Prerequisites

- docker 19.03.13 ++

### Start

Clone the application from github and run docker compose to start the application

```
git clone https://github.com/kenjix002/courier_company_test.git
cd courier_company_test
docker compose up -d
```

### Login credential

To start, do use the following users. One as a admin, while the other as a driver

```
User:   Admin
Pass:   Admin@123


User:   Driver
Pass:   Admin@123
```
