import { getXsUrls } from "./xs.advanced.js";
import  axios from "axios";
import https from "https";


let sapBtpSubaccountRegion;
let sapBtpSubaccountId;

async function addSystemMapping(
  data,
  cloudConnectorUrl,
  cloudConnectorUsername,
  cloudConnectorPassword,
  subAccountRegion,
  subAccountId
) {
  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: process.env['NODE_TLS_REJECT_UNAUTHORIZED'] != '0',
    }),
    auth: {
      username: cloudConnectorUsername,
      password: cloudConnectorPassword,
    },
  });

  try {
    const res = await instance.post(
      `${cloudConnectorUrl}/api/v1/configuration/subaccounts/${subAccountRegion}/${subAccountId}/systemMappings`,
      data
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

function getSystemMappingForOtherSapSystem(data, description) {
  return {
    virtualHost: data.host,
    virtualPort: data.port,
    localHost: data.host,
    localPort: data.port,
    protocol: "HTTPS",
    backendType: "otherSAPsys",
    hostInHeader: "VIRTUAL",
    authenticationMode: "NONE",
    description: description,
  };
}

function getSystemMappingForSapHanaSystem(data) {
  return {
    virtualHost: data.host,
    virtualPort: data.port,
    localHost: data.host,
    localPort: data.port,
    protocol: "TCPS",
    backendType: "hana",
    authenticationMode: "NONE",
    description: "SAP HANA Database",
  };
}

export const createSystemMappings = async function(
  cloudConnectorUrl,
  cloudConnectorUsername,
  cloudConnectorPassword,
  subAccountRegion,
  subAccountId
) {
  sapBtpSubaccountRegion = subAccountRegion;
  sapBtpSubaccountId = subAccountId;
  const {
    hanaHost,
    sqlPort,
    authorizationEndpoint,
    controllerEndpoint,
    hanaCockpit,
    deployService,
    hrttService
  } = await getXsUrls();

  let url = new URL(authorizationEndpoint);
  const xsUaaMapping = getSystemMappingForOtherSapSystem(
    { host: url.hostname, port: (parseInt(url.port)) },
    "XS Advanced UAA"
  );
  await addSystemMapping(
    xsUaaMapping,
    cloudConnectorUrl,
    cloudConnectorUsername,
    cloudConnectorPassword,
    subAccountRegion,
    subAccountId
  ); // add xsuaa mapping
  createSystemMappingResource(`${url.hostname}:${(parseInt(url.port))}`, cloudConnectorUrl, cloudConnectorUsername, cloudConnectorPassword, subAccountRegion, subAccountId);

  url = new URL(controllerEndpoint);
  const xsControllerMapping = getSystemMappingForOtherSapSystem(
    { host: url.hostname, port: (parseInt(url.port)) },
    "XS Advanced Controller"
  );
  await addSystemMapping(
    xsControllerMapping,
    cloudConnectorUrl,
    cloudConnectorUsername,
    cloudConnectorPassword,
    subAccountRegion,
    subAccountId
  ); // add xsa contoller mapping
  createSystemMappingResource(`${url.hostname}:${(parseInt(url.port))}`, cloudConnectorUrl, cloudConnectorUsername, cloudConnectorPassword, subAccountRegion, subAccountId);

  url = new URL(hanaCockpit);
  const hanaCockpitMapping = getSystemMappingForOtherSapSystem(
    { host: url.hostname, port: (parseInt(url.port)) },
    "SAP HANA Cockpit"
  );
  await addSystemMapping(
    hanaCockpitMapping,
    cloudConnectorUrl,
    cloudConnectorUsername,
    cloudConnectorPassword,
    subAccountRegion,
    subAccountId
  ); // add hana cockpit mapping
  createSystemMappingResource(`${url.hostname}:${(parseInt(url.port))}`, cloudConnectorUrl, cloudConnectorUsername, cloudConnectorPassword, subAccountRegion, subAccountId);

  url = new URL(hrttService);
  const hrttServiceMapping = getSystemMappingForOtherSapSystem(
    { host: url.hostname, port: (parseInt(url.port)) },
    "SAP HANA Runtime Tooling"
  );
  await addSystemMapping(
    hrttServiceMapping,
    cloudConnectorUrl,
    cloudConnectorUsername,
    cloudConnectorPassword,
    subAccountRegion,
    subAccountId
  ); // add hrtt-service mapping
  createSystemMappingResource(`${url.hostname}:${(parseInt(url.port))}`, cloudConnectorUrl, cloudConnectorUsername, cloudConnectorPassword, subAccountRegion, subAccountId, subAccountRegion, subAccountId);

  url = new URL(deployService);
  const deployServiceMapping = getSystemMappingForOtherSapSystem(
    { host: url.hostname, port: (parseInt(url.port)) },
    "MTA Deploy Service"
  );
  await addSystemMapping(
    deployServiceMapping,
    cloudConnectorUrl,
    cloudConnectorUsername,
    cloudConnectorPassword,
    subAccountRegion,
    subAccountId
  ); // add deploy-service mapping
  createSystemMappingResource(`${url.hostname}:${(parseInt(url.port))}`, cloudConnectorUrl, cloudConnectorUsername, cloudConnectorPassword, subAccountRegion, subAccountId);

  const hanaMapping = getSystemMappingForSapHanaSystem(
    { host: hanaHost, port: sqlPort },
    "SAP HANA Database"
  );
  await addSystemMapping(
    hanaMapping,
    cloudConnectorUrl,
    cloudConnectorUsername,
    cloudConnectorPassword,
    subAccountRegion,
    subAccountId
  );// add sap hana db mapping

  return {
    hanaHost,
    sqlPort,
    authorizationEndpoint,
    controllerEndpoint,
    hanaCockpit,
    deployService,
    hrttService
  }
}

async function createSystemMappingResource(hostAndPort, cloudConnectorUrl, cloudConnectorUsername, cloudConnectorPassword, sapBtpSubaccountRegion, sapBtpSubaccountId){
  const data = {
    id: '/',
    enabled: true
  }
  
  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: process.env['NODE_TLS_REJECT_UNAUTHORIZED'] != '0',
    }),
    auth: {
      username: cloudConnectorUsername,
      password: cloudConnectorPassword,
    },
  });

  const res = await instance.post(
    cloudConnectorUrl + `/api/v1/configuration/subaccounts/${sapBtpSubaccountRegion}/${sapBtpSubaccountId}/systemMappings/${hostAndPort}/resources`,
    data
  );
  return res.data;

}