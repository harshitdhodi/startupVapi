"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import UserForm from "./UserForm"

export default function UserProfileList() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user")
        const data = await response.json()
        console.log("API Response:", data); // Add this line to check the response

        if (data.status === "success") {
          setUsers(data.data.users)
          setFilteredUsers(data.data.users)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search term, role, and status
  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) =>
        statusFilter === "approved" ? user.isVerified : !user.isVerified
      )
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  // Function to handle status or role change
  const handleUserUpdate = async (userId, field, value) => {
    try {
      const payload = field === "isVerified" ? { isVerified: value === "approved" } : { role: value }
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
  
      const data = await response.json()
  
      if (data.status === "success") {
        // Update the users state with the new data
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId 
              ? { ...user, [field]: field === "isVerified" ? (value === "approved") : value }
              : user
          )
        )
      } else {
        console.error(`Failed to update ${field}:`, data.message)
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
    }
  }

  // Function to handle successful form submission
  const handleUserFormSuccess = () => {
    setIsAddUserModalOpen(false);
    setEditingUser(null);
    // Refresh the user list
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user");
        const data = await response.json();

        if (data.status === "success") {
          setUsers(data.data.users);
          setFilteredUsers(data.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  };

  // Function to handle edit button click
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsAddUserModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getPaymentStatus = (isVerified) => {
    return isVerified ? (
      <span className="text-green-600 font-medium">Paid</span>
    ) : (
      <span className="text-red-600 font-medium">Unpaid</span>
    )
  }

  const getParticipationPercentage = () => {
    return Math.floor(Math.random() * 50) + 50
  }

  const capitalizeRole = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mt-10 mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 border-orange-500"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32 [&>span]:line-clamp-1 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="jury">Jury</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 [&>span]:line-clamp-1 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-600">Total users: {filteredUsers.length}</div>
      </div>

      {/* Table */}
      <Card className="border-none shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">User</TableHead>
                <TableHead className="font-semibold text-gray-900">Role</TableHead>
                <TableHead className="font-semibold text-gray-900">Date of joining</TableHead>
                <TableHead className="font-semibold text-gray-900">Payment Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Participation</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                // const participationPercentage = getParticipationPercentage()
                return (
                  <TableRow key={user._id} className="hover:bg-gray-50">
                    <Link to={`/user/${user._id}`}>
                      <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
                    </Link>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleUserUpdate(user._id, "role", value)}
                      >
                        <SelectTrigger className="w-32 [&>span]:line-clamp-1 border-none shadow-none focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="jury">Jury</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{getPaymentStatus(user.isVerified)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-orange-500 rounded-full"
                            style={{
                              width: user.participation
                                ? `${user.participation.percentage}%`
                                : '0%'
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {user.participation
                            ? `${user.participation.percentage}%`
                            : '0%'
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.isVerified ? "approved" : "pending"}
                        onValueChange={(value) => handleUserUpdate(user._id, "isVerified", value)}
                      >
                        <SelectTrigger className="w-32 [&>span]:line-clamp-1 border-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-4 h-4 text-orange-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleUserUpdate(user._id, "isVerified", "pending")}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">No users found matching your criteria.</div>
      )}
    </div>
  );
}