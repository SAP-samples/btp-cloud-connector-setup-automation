## Description
This Yeoman generator helps you connect to a SAP BTP Subaccount in Cloud connector, add necessary System Mappings and resources to work access XS Advanced Systems in SAP Business Application Studio (BAS), and generate files for import in SAP BTP Destinations.

## Requirements
1. Node.js v18.14.2
2. Yeoman - If not installed, install it using `npm install -g yo`
3. XS Advanced CLI client 
4. Cloud Connector is installed
5. Ensure you're logged in and the target space is SAP.
6. You've connected to your SAP BTP Subaccount

## Download and Installation
First, build and install the generator using npm:

```bash
npm install && npm link
```

## Usage

To start the generator, navigate to the directory where you want to generate your project and run:

```bash
yo bas-xsa-connectivity
```

You will be prompted to enter the following information:

1. Cloud Connector Login Url
2. Cloud Connector Username
3. Cloud Connector Password
4. Cloud Connector Location ID
5. SAP BTP Subaccount Region
6. SAP BTP Subaccount ID
7. Directory for Destination Files

Once you have entered the required information, the generator will perform the following tasks:

1. Add necessary System Mappings and resources to work access XS Advanced Systems in SAP Business Application Studio (BAS)
2. Generate files for import in SAP BTP Destinations

After the generator completes its tasks, you should see your new files in the directory you specified.
Import these files in your **BTP Subaccount > Connectivity > Destinations**

## Known Issues
<!-- You may simply state "No known issues. -->

## How to obtain support
[Create an issue](https://github.com/SAP-samples/btp-cloud-connector-setup-automation/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing
If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License
Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
