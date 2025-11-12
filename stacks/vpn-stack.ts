import { LocalExecProvisioner, TerraformStack } from "cdktf";
import { Resource } from "@cdktf/provider-null/lib/resource";
import { NullProvider } from "@cdktf/provider-null/lib/provider";
import { Construct } from "constructs";

type LocalExecProvisionerConfig = {
  command: string;
  when?: "create" | "destroy";
}

class InitLocalExecProvisioner implements LocalExecProvisioner {
  public readonly type: "local-exec" = "local-exec";
  public command: string;
  public when?: "create" | "destroy";
  constructor(config: LocalExecProvisionerConfig){
    this.command = config.command;
    this.when = config.when;
  }
}

export type OpenVPNConfig = {
  configPath: string;
  credentialsPath: string;
}

const connectToOpenVPNProfile = (config: OpenVPNConfig) => {
  const checkRunning = `pgrep -f "openvpn.*${config.configPath}" > /dev/null`;
  const connectCmd = `sudo openvpn --config "${config.configPath}" --auth-user-pass "${config.credentialsPath}" --daemon openvpn`;
  
  return `if ${checkRunning}; then echo "OpenVPN already connected with this config"; exit 0; fi; ${connectCmd} && echo "OpenVPN connecting in background"; exit 0`;
};

const disconnectFromOpenVPNProfile = (config: OpenVPNConfig) => {
  return `echo "Execute command: \n sudo pkill -f "openvpn.*${config.configPath}" \n OR \n sudo pkill "openvpn""`;
};

export class OpenVPNStack extends TerraformStack {
  constructor(scope: Construct, id: string, vpnConfig: OpenVPNConfig) {
    super(scope, id);

    // Add null provider
    new NullProvider(this, "null");

    // Step 1: Connect to OpenVPN on macOS
    new Resource(this, "ConnectOpenVPN", {
      provisioners: [
        new InitLocalExecProvisioner({
          command: connectToOpenVPNProfile(vpnConfig),
          when: "create"
        }),
        new InitLocalExecProvisioner({
          command: disconnectFromOpenVPNProfile(vpnConfig),
          when: "destroy"
        })
      ]
    });
  }
}
