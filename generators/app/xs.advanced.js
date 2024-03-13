import * as child_process from 'child_process'; 

async function getSystemInfo(){

    return new Promise((res, rej) => {
      child_process.exec('xs curl "/v2/info"', (error, stdout, stderr) => {
          if (error) {
            rej(`error: ${error.message}`);
          }
    
          if (stderr) {
            rej(`stderr: ${stderr}`);
          }
          const outputJson = JSON.parse(stdout);
    
          const authorizationEndpoint = outputJson.authorizationEndpoint;
          const controllerEndpoint = outputJson.controllerEndpoint;
    
          let hanaCockpit, deployService;
          for (let item of outputJson.serviceUrls) {
            if (item.key === "hana-cockpit") {
              hanaCockpit = item.value;
            } else if (item.key === "deploy-service") {
              deployService = item.value;
            }
          }
          console.log("Controller endpoint: "+controllerEndpoint);
          console.log("Authorization endpoint: "+authorizationEndpoint);
          console.log("Deployer endpoint: "+deployService);
          console.log("Hana Cockpit endpoint: "+hanaCockpit);
          const info = {
            authorizationEndpoint,
            controllerEndpoint,
            hanaCockpit,
            deployService
          };
          res(info);
        });
      });

}

function getHrttServiceUrl(){
    return new Promise((res, rej) => {
      child_process.exec('xs app hrtt-service', (error, stdout, stderr) => {
            if (error || stderr) {
              rej(`exec error: ${error || stderr}`);
            }
          
            const matches = stdout.match(/urls:\s*(.+)/);        
            if (matches && matches.length > 1) {
              console.log("HRTT service endpoint: "+matches[1]);
                res(matches[1])
            } else {
              rej('URL not found');
            }
          });
      });
}

function getSapHanaHostAndSqlPort(){
    return new Promise( (res, rej) => {
      child_process.exec('xs tenant-databases', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
        }
      
        const lines = stdout.split('\n');
        const headerIndex = lines.findIndex(line => line.includes('sql-port'));
        const portsIndex = lines[headerIndex].indexOf('sql-port');
        const hostIndex = lines[headerIndex].indexOf('master host');
        const sqlPorts = lines.slice(headerIndex + 1).map(line => {
          const portValue = line.substring(portsIndex, line.indexOf(' ', portsIndex)).trim();
          if(!isNaN(portValue)){
              return portValue;
          }
          
        }).filter(Boolean);
    
        const hosts = lines.slice(headerIndex + 1).map(line => {
            const hostValue = line.substring(hostIndex, line.indexOf(' ', hostIndex)).trim();
            if(!hostValue.startsWith('-')){
              return hostValue;
            }
          }).filter(Boolean);
        if(sqlPorts.length > 0 && hosts.length > 0){
          console.log(`Tenant database: ${hosts[0]}:${sqlPorts[0]}`);
          res({ host: hosts[0], port: sqlPorts[0] });
        }
      
        rej("no sql ports found");
      });
    } )
}

export const getXsUrls = async function(){
  const {host, port} = await getSapHanaHostAndSqlPort();
  const {
    authorizationEndpoint,
    controllerEndpoint,
    hanaCockpit,
    deployService } = await getSystemInfo();
  const hrttService = await getHrttServiceUrl();
  return{
    sqlPort: port, hanaHost: host,authorizationEndpoint,
    controllerEndpoint,
    hanaCockpit,
    deployService, hrttService
  }
}

// export const getXsUrls = getXsUrl;