import { User } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const UserForm = ({ userId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    countryCode: '+91',
    number: '',
    DOB: '',
    gender: '',
    city: '',
    role: 'student',
    isVerified: false,
    photo: null,
    photoPreview: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch user data if in edit mode
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/user/${userId}`);
          const data = await response.json();
          
          if (data.status === 'success') {
            const user = data.data.user;
            setFormData(prev => ({
              ...prev,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              password: '',
              countryCode: user.mobile?.countryCode || '+91',
              number: user.mobile?.number || '',
              DOB: user.DOB ? new Date(user.DOB).toISOString().split('T')[0] : '',
              gender: user.gender || '',
              city: user.city || '',
              role: user.role || 'student',
              isVerified: user.isVerified || false,
              photoPreview: user.photo ? `/api/image/download/${user.photo}` : ''
            }));
          }
        } catch (error) {
          setError('Failed to load user data');
          console.error('Error fetching user:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUser();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'photo' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const uploadPhoto = async (file) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }
      
      const data = await response.json();
      return data.filename; // Assuming the API returns { filename: 'image-name.jpg' }
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    // Only validate password if it's a new user or if it's being changed
    if (!userId && !formData.password) {
      return 'Password is required';
    }
    
    if (formData.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password)) {
      return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Invalid email format';
    }
    
    if (!/^\d{10,15}$/.test(formData.number)) {
      return 'Mobile number must be 10-15 digits';
    }
    
    if (formData.DOB && new Date(formData.DOB) >= new Date()) {
      return 'Date of birth must be in the past';
    }
    
    if (!formData.firstName || !formData.lastName || !formData.city || !formData.gender) {
      return 'All required fields must be filled';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      
      let photoFilename = '';
      if (formData.photo) {
        photoFilename = await uploadPhoto(formData.photo);
      } else if (formData.photoPreview && formData.photoPreview.startsWith('blob:')) {
        // If it's a blob URL but no new file was selected, we need to re-upload
        const response = await fetch(formData.photoPreview);
        const blob = await response.blob();
        const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
        photoFilename = await uploadPhoto(file);
      } else if (formData.photoPreview) {
        // If it's a server URL, extract the filename
        const urlParts = formData.photoPreview.split('/');
        photoFilename = urlParts[urlParts.length - 1];
      }

      const url = userId ? `/api/user/${userId}` : '/api/user/add';
      const method = userId ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        mobile: {
          countryCode: formData.countryCode,
          number: formData.number
        },
        isVerified: formData.isVerified,
        photo: photoFilename || undefined
      };

      // Don't send password if it's empty (edit mode and password not changed)
      if (!formData.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save user');
      }

      const data = await response.json();
      setSuccess(userId ? 'User updated successfully!' : 'User created successfully!');
      
      // Reset form if it's a new user
      if (!userId) {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          countryCode: '+91',
          number: '',
          DOB: '',
          gender: '',
          city: '',
          role: 'student',
          isVerified: false,
          photo: null,
          photoPreview: ''
        });
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving the user');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && userId) {
    return <div className="text-center py-8">Loading user data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        {userId ? 'Edit User' : 'User Registration'}
      </h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 mb-4">
            {formData.photoPreview ? (
              <img 
                src={formData.photoPreview} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-orange-100 text-orange-700 px-4 py-2 rounded-md hover:bg-orange-200 transition-colors">
            {formData.photoPreview ? 'Change Photo' : 'Upload Photo'}
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          {isUploading && <p className="mt-2 text-sm text-gray-500">Uploading photo...</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
            disabled={!!userId} // Disable email field in edit mode
          />
        </div>

        {!userId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required={!userId}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Country Code</label>
            <input
              type="text"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="DOB"
              value={formData.DOB}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="student">Student</option>
              <option value="jury">Jury</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="isVerified"
              value={formData.isVerified ? 'verified' : 'pending'}
              onChange={(e) => setFormData({...formData, isVerified: e.target.value === 'verified'})}
              className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center space-x-4 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (userId ? 'Update User' : 'Register')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;