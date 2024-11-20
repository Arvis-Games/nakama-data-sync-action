# GitHub Action: nakama-data-sync-action

The action synchronizes data between servers.

## Input Parameters

### Required Parameters

1. **nakama-dev-server-url**
    - **Description**: The URL of the Nakama development server, used for interacting with the development environment during the deployment process.
    - **Required**: Yes

2. **nakama-prod-server-url**
    - **Description**: The URL of the Nakama production server, where live environments are hosted and updated.
    - **Required**: Yes

3. **nakama-dev-system-id**
    - **Description**: A unique identifier for the Nakama development system, used for authentication and environment-specific configurations.
    - **Required**: Yes

4. **nakama-dev-auth-token**
    - **Description**: The authentication token for the Nakama development environment, required for secure API access.
    - **Required**: Yes

5. **nakama-prod-auth-token**
    - **Description**: The authentication token for the Nakama production environment, enabling secure updates to the live system.
    - **Required**: Yes

6. **nakama-system-login-id**
    - **Description**: The system login ID used for accessing and managing Nakama server environments during automated workflows.
    - **Required**: Yes

### Optional Parameters

7. **configuration-key**
    - **Description**: A key representing the configuration settings, defaulting to "Configuration," for environment-specific customization.
    - **Required**: No
    - **Default Value**: `Configuration`

8. **config-versions-key**
    - **Description**: A key representing versioned configurations, defaulting to "ConfigVersions," used for tracking and applying specific versions of configurations.
    - **Required**: No
    - **Default Value**: `ConfigVersions`  