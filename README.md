<p align="center">
  <img width="30%" src="https://raw.githubusercontent.com/andrewjamesbibby/forgery/master/screenshots/logo.png?raw=true">
  <br />
  A menu driven Laravel Forge command line tool.
  <br />
  Manage servers, sites, config, deployments and more with ease.
  <br />
  <br />
</p> 

<p align="center">
  <img width="80%" src="https://raw.githubusercontent.com/andrewjamesbibby/forgery/master/screenshots/main.png?raw=true">
</p>

## About The Project

When dealing with multiple servers on a daily basis it is important to have all information available when required.

Forgery makes it simple to manage all aspects of Forge server and site management. Forgery makes use of the Forge API to build up requests and display responses quickly and easily.

All user input is gathered via interactive menus which means no need to remember any command line flags or know which parameters an api call requires. Simply navigate around using the menus and inputs.

Note: Forgery has been developed and tested on Mac OS only. Please report an issue if there are any problems on other platforms.

## Getting Started

### Prerequisites

This tool requires that Node.js and NPM are both installed. Instructions to install can be found at [https://nodejs.org/en/](https://nodejs.org/en/)

### Installation

1/ Install globally: 
```
npm install -g @andrewjamesbibby/forgery
```

2/ Open Forgery anywhere:
```
forgery
```

3/ Navigate to 'Settings' and enter Forge API key when prompted

**Note: The API Key will be stored at ~/.config/configstore/forgery.json so ensure to remove this file if Forgery is uninstalled and no longer required**

4/ Now manage your servers!

## Screenshots

Create server

<p align="center">
  <img width="80%" src="https://raw.githubusercontent.com/andrewjamesbibby/forgery/master/screenshots/server.png?raw=true">
</p>    

Scheduler

<p align="center">
  <img width="80%" src="https://raw.githubusercontent.com/andrewjamesbibby/forgery/master/screenshots/scheduler.png?raw=true">
</p>

Firewall Rules

<p align="center">
  <img width="80%" src="https://raw.githubusercontent.com/andrewjamesbibby/forgery/master/screenshots/firewall.png?raw=true">
</p>

**Note: Some sub-menus (e.g for example when managing configuration or environment files) will open your default terminal editor such as nano. Once contents are saved the information will be transferred to the input field**

## Contributing
Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/your-feature`)
3. Commit your Changes (`git commit -m 'Add some feature'`)
4. Push to the Branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Twitter: [@andrewjbibby](https://twitter.com/andrewjbibby)

Project Link: [https://github.com/andrewjamesbibby/forgery](https://github.com/andrewjamesbibby/forgery)

Issues: [https://github.com/andrewjamesbibby/forgery/issues](https://github.com/andrewjamesbibby/forgery/issues)