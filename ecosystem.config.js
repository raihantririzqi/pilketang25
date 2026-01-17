module.exports = {
    apps: [
        {
            name: "user-app",
            cwd: "./front_end/user_app", // Sesuaikan nama folder frontend utama kamu
            script: "bun",
            args: "run start -- -p 3000",
            interpreter: "none",
        },
        {
            name: "backend-api",
            cwd: "./backend",
            script: "bun",
            args: "src/index.ts",
            env: {
                PORT: 3001
            }
        },
        {
            name: "scanner-app",
            cwd: "./front_end/scanner",
            script: "bun",
            args: "run start -- -p 3002",
            interpreter: "none",
        }
    ]
}