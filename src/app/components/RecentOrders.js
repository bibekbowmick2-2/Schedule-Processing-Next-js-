import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext,useRef } from "react";
import { ContextProvider } from "../AuthProviders/AuthProvider";
import { useSession } from "next-auth/react";
import { IoMdPrint } from "react-icons/io";
import Loader from "./Loader";

const RecentOrders = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const name = session?.user?.name;

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("/api/addtask");
      return res.data.tasks;
    },
    enabled: !!role && !!name,
  });

  const { editTask, deleteTask } = useContext(ContextProvider);
  const filteredTask = tasks.filter((task) => task.assignedTo === name);



  //const printRef = useRef();

  // const handlePrint = () => {
  //   const printContents = printRef.current.innerHTML;
  //   const originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;
  //   window.location.reload();
  // };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-900">
          {role === "admin" ? "Recent Tasks" : "My Assigned Tasks"}
        </h2>
        <button
          onClick={()=>window.print()}
          className="text-blue-900 hover:underline flex items-center gap-2"
        >
          <IoMdPrint className="text-2xl" />
          Print
        </button>
      </div>

      <div className="overflow-x-auto print-area">
        <table className="w-full">
          <thead>
            <tr>
            
            <th className="text-left py-2 px-4">Serial No</th>
              <th className="text-left py-2 px-4">Task Creator</th>
              <th className="text-left py-2 px-4">Task</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Time</th>
              <th className="text-left py-2 px-4">Priority</th>
              <th className="text-left py-2 px-4">Assigned To</th>
              {role === "admin" && (
                <th className="text-left py-2 px-4">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {(role === "admin" ? tasks : filteredTask).map((task, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{task.name}</td>
                <td className="py-2 px-4">{task.task}</td>
                <td className="py-2 px-4">{task.date}</td>
                <td className="py-2 px-4">{task.time}</td>
                <td className="py-2 px-4">{task.priority}</td>
                <td className="py-2 px-4">{task.assignedTo}</td>
                {role === "admin" && (
                  <td className="py-2 px-4">
                    <div className="flex gap-2 no-print">
                      <button
                        className="btn btn-success"
                        onClick={() => editTask(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-error"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {(role === "admin" ? tasks : filteredTask).length === 0 && (
          <div className="text-center text-red-500 mt-4 text-xl font-medium ">
            No tasks found. <Loader/>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
