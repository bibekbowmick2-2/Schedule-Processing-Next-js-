"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Card from "../../components/Card";
import RecentOrders from "../../components/RecentOrders";
import RecentCustomers from "../../components/RecentCustomers";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import RecentGraph from "../../components/RecentGraph";
import Calendar from "../../components/Calendar";

export default function Panel({ params }) {
  const [view, setView] = useState(null); 

  
  useEffect(() => {
    async function fetchParams() {
      const { view} = await params; 
      setView(view || "home"); 
    }
    fetchParams();
  }, [params]);



  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("/api/addtask");
      return res.data.tasks;
    },
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("/api/users");
      return res.data.users;
    },
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-20" : "ml-64"}`}>
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <Card title="Total Tasks" value={tasks.length} icon="eye-outline" />
          <Card title="Priority Tasks" value="80" icon="cart-outline" />
          <Card title="Total Team Members" value={users.length} icon="chatbubbles-outline" />
          <Card title="Earning" value="$7,842" icon="cash-outline" />
        </div>

        
        {view === "home" ? (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 p-6">
            <RecentOrders />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <RecentGraph />
              <RecentCustomers />
            </div>
          </div>
        ) :( view === "events" ? (
          <Calendar />
        ) : (
          <div className="p-6 text-center text-xl font-semibold text-gray-600">
            Loading view...
          </div>
        ))}
      </div>
    </div>
  );
}
