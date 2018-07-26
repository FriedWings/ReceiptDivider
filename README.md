# ReceiptDivider

An Ionic 3 application targeted at iOS and Android, with a primary goal to track payments. 
There are three type of payments the application will have to deal with.
1. __Expenditure__ (money you have spent for yourself, i.e. buying coffee)
2. __Direct Payment__ (money passed between individuals, i.e. someone paying for your coffee or vice versa)
3. __Group Payment__ (money passed in a group, i.e. someone paying for a group dinner)

The feature separating this application from the pack is the functionality of being able to take a photo of the receipt, and automatically
enter the details into the application, allowing you to select the type of payment, and saving it onto the cloud.

The application will also be able to send SMS notifications to individuals who have yet to pay up!

## Progress
The application is currently in the middle stages of development. The primary key features left to complete are:
- Implement friends/contacts
- Finalize direct and group payment features
- Implement the 'receipt digitizer' feature

## Getting Started
### Prerequisites

- NodeJS (https://nodejs.org/en/)
- Ionic 3

```
npm install -g ionic
```

### Installing Dependencies

Inside the cloned repository, install dependencies using the npm command below

```
npm install
```

## Local Deployment

```
ionic serve --lab
```


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
