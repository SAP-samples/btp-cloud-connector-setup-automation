//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // this is strongly discouraged
import Generator from "yeoman-generator";

import {createSystemMappings} from "./cloud.connector.js"
import { createDestinations } from "./btp.destination.js";
import * as fs from "fs";
const regions = [
  "cn40.platform.sapcloud.cn",
  "br10.hana.ondemand.com",
  "jp10.hana.ondemand.com	",
  "ap10.hana.ondemand.com	",
  "ap11.hana.ondemand.com	",
  "ap12.hana.ondemand.com	",
  "ca10.hana.ondemand.com	",
  "cf.eu10.hana.ondemand.com",
  "eu10-002.hana.ondemand.com",
  "eu10-003.hana.ondemand.com",
  "eu10-004.hana.ondemand.com",
  "eu11.hana.ondemand.com",
  "us10.hana.ondemand.com",
  "us10-001.hana.ondemand.com",
  "us10-002.hana.ondemand.com",
  "ap21.hana.ondemand.com",
  "<Enter Manually>"
];

export default class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "cloudConnectorUrl",
        message: "Provide Cloud Connector Url",
        validate: (input) => !!input || "This field is required",
      },
      {
        type: "input",
        'default': 'Administrator',
        name: "cloudConnectorUsername",
        message: "Provide Cloud Connector Username",
        validate: (input) => !!input || "This field is required",
      },
      {
        type: "password",
        name: "cloudConnectorPassword",
        message: "Provide Cloud Connector Password",
        validate: (input) => {
          if (!input) {
            return "This field is required";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "sapBtpSubaccountRegion",
        message: "Choose SAP BTP Subaccount region",
        choices: regions,
        validate: (input) => !!input || "This field is required",
      },
      {
        type: "input",
        name: "sapBtpSubaccountRegionManual",
        when: (answers) => answers.sapBtpSubaccountRegion === '<Enter Manually>',
        message: "Enter SAP BTP Subaccount region",
        choices: regions,
        validate: (input) => !!input || "This field is required",
      },
      {
        type: "input",
        name: "sapBtpSubaccountId",
        message: "Provide SAP BTP Subaccount ID",
        validate: (input) => !!input || "This field is required",
      },
      {
        type: "input",
        name: "locationId",
        message: "Provide Location ID",
        validate: () => true,
      },
      {
        type: "input",
        name: "destinationDir",
        message: "Provide Absolute path to the folder for destinations",
        validate: (input) => {
          if (!input) {
            return "This field is required";
          }
          if(!fs.existsSync){
            return "Path does not exist, please provide a valid path";
          }
          return true;
        },
      },
    ]);
  }

  async writing() {
    const allUrls = await createSystemMappings(
      this.answers.cloudConnectorUrl,
      this.answers.cloudConnectorUsername,
      this.answers.cloudConnectorPassword,
      this.answers.sapBtpSubaccountRegionManual || this.answers.sapBtpSubaccountRegion,
      this.answers.sapBtpSubaccountId
    );
    await createDestinations(this.answers.destinationDir, this.answers.locationId, allUrls);
  }
};
