import * as dotenv from "dotenv";
import { App } from "cdktf";
import { OpenVPNStack } from "./stacks/vpn-stack";

// Load environment variables from .env file
dotenv.config();

const app = new App();
new OpenVPNStack(app, "vpn-stack", {
  configPath: process.env.OPENVPN_CONFIG_PATH || "./config.ovpn",
  credentialsPath: process.env.OPENVPN_CREDENTIALS_PATH || "./credentials.txt"
});
app.synth();
