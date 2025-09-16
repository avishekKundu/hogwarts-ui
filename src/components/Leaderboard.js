/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { fetchLeaderboard, streamLeaderboard } from "../services/service.js";
import "./Leaderboard.css";

const Leaderboard = () => {
    const [data, setData] = useState([
        { name: "Gryff", points: 0 },
        { name: "Raven", points: 0 },
        { name: "Slyth", points: 0 },
        { name: "Huff", points: 0 },
    ]);
    const [timeWindow, setTimeWindow] = useState("all");
    const [streaming, setStreaming] = useState(false);
    const eventSourceRef = useRef(null);

    useEffect(() => {
        if (!streaming) {
            stopStream();
            loadInitialData();
        } else {
            startStream();
        }

        return () => stopStream();
    }, [timeWindow, streaming]);

    const loadInitialData = async () => {
        try {
            const result = await fetchLeaderboard(timeWindow);
            setData(
                result.map((item) => ({
                    name: item.category,
                    points: item.points,
                }))
            );
        } catch (err) {
            console.error("Failed to load leaderboard:", err);
        }
    };

    const startStream = async () => {
        const es = streamLeaderboard(timeWindow);
        es.addEventListener("init", (event) => {
            try {
                const initData = JSON.parse(event.data);
                setData(
                    initData.map((d) => ({
                        name: d.category,
                        points: d.points,
                    }))
                );
            } catch (err) {
                console.error("Error parsing init event:", err);
            }
        });
        es.addEventListener("update", (event) => {
            try {
                const updates = JSON.parse(event.data);
                setData((prevData) => {
                    const updatedMap = new Map(prevData.map((item) => [item.name, item]));
                    updates.forEach((update) => {
                        updatedMap.set(update.category, {
                            name: update.category,
                            points: update.points,
                        });
                    });
                    return Array.from(updatedMap.values());
                });
            } catch (err) {
                console.error("Error parsing update event:", err);
            }
        });
        es.onerror = (err) => {
            console.error("Stream error:", err);
            es.close();
        };
        eventSourceRef.current = es;
    };

    const stopStream = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    };

    const toggleStreaming = () => {
        setStreaming((prev) => !prev);
    };

    const options = [
        { value: "all", label: "All Time" },
        { value: "5m", label: "Last 5 Min" },
        { value: "1h", label: "Last 1 Hour" },
    ];

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h3>📊 Live Leaderboard</h3>
                <div className="controls">
                    <button className="btn" onClick={toggleStreaming}>
                        {streaming ? "⏸ Stop Updates" : "▶ Start Updates"}
                    </button>
                    <select
                        className="dropdown"
                        value={timeWindow}
                        onChange={(e) => setTimeWindow(e.target.value)}
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="points" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`${value}`, "Points"]} />
                    <Bar dataKey="points" fill="#3b82f6" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Leaderboard;
