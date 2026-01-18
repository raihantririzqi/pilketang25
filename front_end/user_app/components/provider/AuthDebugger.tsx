"use client";

import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";

export function AuthDebugger() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const timestamp = new Date().toLocaleTimeString();
        const log = `[${timestamp}] User: ${user?.name || "null"} | Auth: ${isAuthenticated} | Loading: ${isLoading}`;
        setLogs((prev) => [...prev.slice(-20), log]); // Keep last 20 logs
    }, [user, isAuthenticated, isLoading]);

    return (
        <div className="fixed bottom-0 left-0 bg-black text-white p-4 text-xs max-w-md max-h-64 overflow-y-auto border-t-2 border-yellow-400 z-[9999]">
            <div className="font-bold mb-2">🔍 Auth Debugger</div>
            <div className="space-y-1 font-mono">
                {logs.map((log, i) => (
                    <div key={i} className={log.includes("null") ? "text-red-400" : "text-green-400"}>
                        {log}
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-2 border-t border-gray-600">
                <div className="text-yellow-300">Current State:</div>
                <div>User ID: {user?.id || "null"}</div>
                <div>User Name: {user?.name || "null"}</div>
                <div>Is Authenticated: {isAuthenticated ? "✅" : "❌"}</div>
                <div>Is Loading: {isLoading ? "⏳" : "✓"}</div>
            </div>
        </div>
    );
}
