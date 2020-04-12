module.exports = {
  apps: [
    {
      args: "",
      autorestart: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      exec_mode: "cluster",
      instances: 1,
      max_memory_restart: "1G",
      max_restarts: 9,
      name: "csv_manager",
      restart_delay: 1,
      script: "./build/main.js",
      source_map_support: false,
      watch: false,
    },
  ],
};
