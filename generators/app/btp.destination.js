import * as fs from "fs";
import * as path from "path";
const createDestination = function (dir, data, fileName) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Path ${dir} does not exist`);
  }
  fs.writeFileSync(path.join(dir, fileName), data, { encoding: "utf8" });
}


export const createDestinations = function(dir, locationId, data){

    const {
        hanaHost,
        sqlPort,
        authorizationEndpoint,
        controllerEndpoint,
        hanaCockpit,
        deployService,
        hrttService
      } = data;

      let url = new URL(controllerEndpoint);
      const controllerHostname = url.hostname;
      const controllerPort = url.port;

      const controllerEndpointDestination = `#
#Created by automation script on ${new Date().toUTCString()}
Description=XS Advanced Controller
Type=HTTP
HTML5.DynamicDestination=True
Authentication=NoAuthentication
Name=SAP_XS_Advanced_Controller
WebIDEEnabled=True
CloudConnectorLocationId=${locationId}
ProxyType=OnPremise
URL=http\\://${url.hostname}\\:${url.port}
XsApiEndpoint=https\\\\\\://${controllerHostname}\\\\\\:${controllerPort}
`;

createDestination(dir, controllerEndpointDestination, 'XS_Advanced_Controller_Destination');

url = new URL(authorizationEndpoint);
      const xsuaaEndpointDestination = `#
#Created by automation script on ${new Date().toUTCString()}
Description=XS Advanced XSUAA
Type=HTTP
HTML5.DynamicDestination=True
Authentication=NoAuthentication
WebIDEUsage=xsuaa
Name=SAP_XS_Advanced_XSUAA
WebIDEEnabled=True
CloudConnectorLocationId=${locationId}
ProxyType=OnPremise
URL=http\\://${url.hostname}\\:${url.port}
XsApiEndpoint=https\\\\\\://${controllerHostname}\\\\\\:${controllerPort}
`;
createDestination(dir, xsuaaEndpointDestination, 'XS_Advanced_XSUAA_Destination');

url = new URL(deployService);
      const deployServiceDestination = `#
#Created by automation script on ${new Date().toUTCString()}
Description=XS Advanced MTA Deploy Service
Type=HTTP
HTML5.DynamicDestination=True
Authentication=NoAuthentication
WebIDESystem=True
Name=SAP_XS_Advanced_MTA_Deploy_Service
WebIDEEnabled=True
CloudConnectorLocationId=${locationId}
ProxyType=OnPremise
URL=http\\://${url.hostname}\\:${url.port}
XsApiEndpoint=https\\\\\\://${controllerHostname}\\\\\\:${controllerPort}
`;
createDestination(dir, deployServiceDestination, 'SAP_XS_Advanced_MTA_Deploy_Service_Destination');


url = new URL(hrttService);
      const hrttServiceeDestination = `#
#Created by automation script on ${new Date().toUTCString()}
Description=XS Advanced HRTT Service
Type=HTTP
HTML5.DynamicDestination=True
Authentication=NoAuthentication
WebIDEUsage=xs_hrtt
Name=SAP_XS_Advanced_HRTT_Service
WebIDEEnabled=True
CloudConnectorLocationId=${locationId}
ProxyType=OnPremise
URL=http\\://${url.hostname}\\:${url.port}
XsApiEndpoint=https\\\\\\://${controllerHostname}\\\\\\:${controllerPort}
`;
createDestination(dir, hrttServiceeDestination, 'SAP_XS_Advanced_HRTT_Service_Destination');


url = new URL(hanaCockpit);
      const hanaCockpitDestination = `#
#Created by automation script on ${new Date().toUTCString()}
Description=XS Advanced HANA Cockpit
Type=HTTP
HTML5.DynamicDestination=True
Authentication=NoAuthentication
WebIDEUsage=xs_cpt
Name=SAP_XS_Advanced_HANA_Cockpit
WebIDEEnabled=True
CloudConnectorLocationId=${locationId}
ProxyType=OnPremise
URL=http\\://${url.hostname}\\:${url.port}
XsApiEndpoint=https\\\\\\://${controllerHostname}\\\\\\:${controllerPort}
`;
createDestination(dir, hanaCockpitDestination, 'SAP_XS_Advanced_HANA_Cockpit_Destination');

const hostname = hanaHost;
const hanaDestination = `#
#Created by automation script on ${new Date().toUTCString()}
Description=SAP HANA Database
Type=HTTP
HTML5.DynamicDestination=True
Authentication=NoAuthentication
WebIDEUsage=xs_hdb
Name=SAP_HANA_DATABASE
WebIDEEnabled=True
CloudConnectorLocationId=${locationId}
ProxyType=OnPremise
URL=http\\://${hostname}\\:${sqlPort}
`;
createDestination(dir, hanaDestination, 'SAP_HANA_DATABASE_Destination');

}