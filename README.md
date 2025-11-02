# hyperv-deploy

Deploy VM on HyperV server using Terraform and CDKTF (Cloud Development Kit for Terraform).

## Prerequisites

This project requires the following dependencies to be installed:

### 1. Node.js

**Required Version:** Node.js >= 18.0

**Installation:**

- **macOS (using Homebrew):**
  ```bash
  brew install node
  ```

- **macOS (using nvm - recommended):**
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  nvm install --lts
  nvm alias default node
  nvm use default
  ```

- **Linux/Windows:** Download LTS version from [nodejs.org](https://nodejs.org/)

**Verify installation:**
```bash
node --version
npm --version
```

### 2. Terraform

Terraform is required for infrastructure provisioning.

**Installation:**

- **macOS (using Homebrew with HashiCorp tap):**
  ```bash
  brew tap hashicorp/tap
  brew install hashicorp/tap/terraform
  terraform -install-autocomplete
  ```

- **Other platforms:** Download from [terraform.io](https://www.terraform.io/downloads)

**Verify installation:**
```bash
terraform --version
```

### 3. CDKTF (Cloud Development Kit for Terraform)

CDKTF is installed as a Node.js package dependency when you install project dependencies (see Setup section below).

You can also install it globally:
```bash
npm install -g cdktf-cli
```

**Verify installation:**
```bash
cdktf --version
```

### 4. OpenVPN

The OpenVPN command-line tool is required for VPN connectivity.

**Note:** The OpenVPN Connect app (GUI application) and the `openvpn` command-line tool are separate. You need the command-line tool installed.

**Installation:**

- **macOS (using Homebrew):**
  ```bash
  brew install openvpn
  ```

- **Linux:** Install via your distribution's package manager
  - Ubuntu/Debian: `sudo apt-get install openvpn`
  - Fedora/RHEL: `sudo dnf install openvpn`

**Verify installation:**
```bash
openvpn --version
```

## Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hyperv-deploy
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Install CDKTF providers:**
   ```bash
   npm run get
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Configure sudo for OpenVPN (macOS):**
   
   On macOS, OpenVPN requires root privileges to create TUN/TAP network interfaces. To avoid password prompts during automation, configure sudo to run OpenVPN without a password.
   
   **Automated setup (recommended):**
   
   This command will automatically detect your username and OpenVPN path, then add the sudoers configuration:
   
   ```bash
   OPENVPN_PATH=$(which openvpn)
   CURRENT_USER=$(whoami)
   echo "$CURRENT_USER ALL=(ALL) NOPASSWD: $OPENVPN_PATH" | sudo tee /etc/sudoers.d/openvpn
   ```
   
   **Manual setup (alternative):**
   
   If you prefer to edit manually:
   
   ```bash
   # Get your username and OpenVPN path
   echo "Username: $(whoami)"
   echo "OpenVPN path: $(which openvpn)"
   
   # Then edit sudoers
   sudo visudo -f /etc/sudoers.d/openvpn
   ```
   
   Add this line (replace with your detected values):
   ```
   your_username ALL=(ALL) NOPASSWD: /path/to/openvpn
   ```

6. **Configure environment variables:**
   
   Copy the example environment file and edit with your OpenVPN paths:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your actual OpenVPN configuration file path and credentials file path.

## Usage

### Generate Terraform configuration:
```bash
npm run synth
```

### Apply infrastructure:
```bash
cdktf deploy
```

### Destroy infrastructure:
```bash
cdktf destroy
```

## Development

- **Watch mode (auto-compile TypeScript):**
  ```bash
  npm run watch
  ```

- **Run tests:**
  ```bash
  npm test
  ```

- **Upgrade CDKTF:**
  ```bash
  npm run upgrade
  ```
