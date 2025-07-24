import { Bell, Search, Menu, User, Settings, LogOut, UserCircle, ChevronDown } from "lucide-react"
import React, { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const Navbar = ({ onMenuClick }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false)
  const [adminData, setAdminData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    mobile: {
      countryCode: '+91',
      number: ''
    },
    city: ""
  })

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/api/user/admin')
        const data = await response.json()
        if (data.status === 'success' && data.data.users.length > 0) {
          setAdminData(data.data.users[0])
          setFormData({
            name: data.data.users[0].fullName,
            email: data.data.users[0].email,
            role: data.data.users[0].role,
            mobile: data.data.users[0].mobile || { countryCode: '+91', number: '' },
            city: data.data.users[0].city
          })
        }
      } catch (error) {
        console.error('Error fetching admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate mobile number before submission
      if (formData.mobile.number && !/^[0-9]{10,15}$/.test(formData.mobile.number)) {
        alert('Please enter a valid mobile number (10-15 digits)');
        return;
      }

      const response = await fetch(`/api/user/${adminData?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedData = await response.json();
      if (updatedData.status === 'success') {
        setAdminData(updatedData.data.user);
        setIsDialogOpen(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'mobile') {
      // Validate mobile number format
      if (!/^[0-9]{10,15}$/.test(value)) {
        alert('Please enter a valid mobile number (10-15 digits)');
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name === 'mobile' ? 'mobile' : name]: name === 'mobile' ? value : value
    }));
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-lg fixed w-[85%] top-0 z-50 border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Startup Vapi
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-48"></div>
              </div>
              <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-10"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-lg fixed w-[85%] top-0 z-50 border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Startup Vapi
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>

            <button className="relative p-2 text-gray-400 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-orange-400 ring-2 ring-white animate-pulse"></span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex border-none items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
                  <div className="w-9 h-9 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      {adminData?.fullName || 'Admin User'}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                      {adminData?.role || 'Administrator'}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 bg-white border border-gray-200 shadow-xl rounded-xl p-2 mt-2"
              >
                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{adminData?.fullName || 'Admin User'}</div>
                      <div className="text-xs text-gray-500">{adminData?.email || 'admin@startupvapi.com'}</div>
                    </div>
                  </div>
                </div>
                
                <DropdownMenuItem 
                  onClick={() => setIsProfileViewOpen(true)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors duration-150"
                >
                  <UserCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">View Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors duration-150"
                >
                  <Settings className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Update Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2 border-gray-200" />
                
                <DropdownMenuItem className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 cursor-pointer transition-colors duration-150">
                  <LogOut className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isProfileViewOpen} onOpenChange={setIsProfileViewOpen}>
              <DialogContent className="sm:max-w-md bg-white ">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-900">Profile Information</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    View your account details and information.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{adminData?.fullName || 'Admin User'}</h3>
                      <p className="text-sm text-gray-600">{adminData?.role || 'Administrator'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-3">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{adminData?.fullName || 'Admin User'}</p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-3">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{adminData?.email || 'admin@startupvapi.com'}</p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-3">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Mobile</label>
                      <p className="mt-1 text-sm text-gray-900">{adminData?.mobile.countryCode + adminData?.mobile.number || 'Administrator'}</p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-3">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</label>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-sm text-gray-900">Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsProfileViewOpen(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsProfileViewOpen(false)
                        setIsDialogOpen(true)
                      }}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-900">Update Profile</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Update your profile information
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="mt-1 block w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="mt-1 block w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="countryCode">Country Code</Label>
                      <Input
                        id="countryCode"
                        name="countryCode"
                        type="text"
                        value={formData.mobile.countryCode || '+91'}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            mobile: {
                              ...prev.mobile,
                              countryCode: e.target.value
                            }
                          }));
                        }}
                        placeholder="Enter your country code"
                        className="mt-1 block w-fit"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobileNumber">Mobile Number</Label>
                      <Input
                        id="mobileNumber"
                        name="mobile"
                        type="text"
                        value={formData.mobile.number}
                        onChange={handleInputChange}
                        placeholder="Enter your mobile number"
                        className="mt-1 block w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className="mt-1 block w-full"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm"
                    >
                      Update Profile
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar