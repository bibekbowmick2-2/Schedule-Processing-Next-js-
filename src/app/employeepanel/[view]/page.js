"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import Card from "@/app/components/Card";
import RecentOrders from "@/app/components/RecentOrders";
import RecentGraph from "@/app/components/RecentGraph";
import RecentCustomers from "@/app/components/RecentCustomers";
import Calendar from "@/app/components/Calendar";
import EventManagement from "@/app/components/EventManagement";
import ADDTASK from "@/app/components/ADDTASK";
import Profile from "@/app/components/Profile";


export default function EmployeePanel({ params }) {
  const [view, setView] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchParams = async () => {
      const { view } = await params;
      setView(view || "home");
    };
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="md:flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className={`md:flex-1 transition-all duration-300 md:ml-64`}>
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <Card title="Total Tasks" value={tasks.length} icon="eye-outline" />
          <Card title="Priority Tasks" value="80" icon="cart-outline" />
          <Card
            title="Total Team Members"
            value={users.length}
            icon="chatbubbles-outline"
          />
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
        ) : view === "events" ? (
          <Calendar />
        ) : view === "eventmanagement" ? (
          <div className="p-6">
            <EventManagement />
          </div>
        ) :  view === "addtasks" ? (
          <div className="p-6">
            <ADDTASK />
          </div>
        ): view === "profile" ? (
          <div className="p-6">
            <Profile />
          </div>
        ): (
          <div className="p-6 text-center text-xl font-semibold text-gray-600">
            Loading view...
          </div>
        )}
      </div>
    </div>
  );
}

