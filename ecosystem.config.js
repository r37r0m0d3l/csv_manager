module.exports = {
  apps: [
    {
      name: "csv_manager",
      script: "./build/main.js",
      args: "",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      exec_mode: "cluster",
      source_map_support: false,
      max_restarts: 9,
      restart_delay: 1,
    },
  ],
};
