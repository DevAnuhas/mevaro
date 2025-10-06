"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Ban, Shield, User } from "lucide-react"

// Mock users (ORM-ready: User table)
const mockUsers = [
  {
    id: "user-1",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    role: "user",
    uploadCount: 45,
    downloadCount: 123,
    status: "active",
    createdAt: "2023-06-15T10:30:00Z",
  },
  {
    id: "user-2",
    name: "Prof. Michael Torres",
    email: "mtorres@artschool.edu",
    role: "user",
    uploadCount: 67,
    downloadCount: 89,
    status: "active",
    createdAt: "2023-08-22T14:20:00Z",
  },
  {
    id: "user-3",
    name: "Emma Wilson",
    email: "emma.w@student.edu",
    role: "user",
    uploadCount: 12,
    downloadCount: 234,
    status: "active",
    createdAt: "2023-11-10T09:15:00Z",
  },
  {
    id: "user-4",
    name: "James Rodriguez",
    email: "j.rodriguez@tech.edu",
    role: "user",
    uploadCount: 89,
    downloadCount: 156,
    status: "active",
    createdAt: "2023-05-03T16:45:00Z",
  },
  {
    id: "user-5",
    name: "Spam Account",
    email: "spam@example.com",
    role: "user",
    uploadCount: 0,
    downloadCount: 2,
    status: "banned",
    createdAt: "2024-01-14T12:00:00Z",
  },
]

export function UserManagementTable() {
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null)
  const [banDialog, setBanDialog] = useState(false)

  const handleBanUser = (userId: string) => {
    // ORM-ready: UPDATE User SET status='banned' WHERE id=?
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: "banned" } : u)))
    setBanDialog(false)
    setSelectedUser(null)
  }

  const handleUnbanUser = (userId: string) => {
    // ORM-ready: UPDATE User SET status='active' WHERE id=?
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: "active" } : u)))
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Uploads</TableHead>
                <TableHead className="text-center">Downloads</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge variant="default" className="gap-1">
                          <Shield className="h-3 w-3" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary">User</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-medium">{user.uploadCount}</TableCell>
                    <TableCell className="text-center font-medium">{user.downloadCount}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      {user.status === "banned" ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-500 text-white">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.status === "active" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => {
                            setSelectedUser(user)
                            setBanDialog(true)
                          }}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Ban
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleUnbanUser(user.id)}>
                          Unban
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Ban Dialog */}
      <Dialog open={banDialog} onOpenChange={setBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban {selectedUser?.name}? This user will no longer be able to access the platform
              or upload materials.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => selectedUser && handleBanUser(selectedUser.id)}>
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
