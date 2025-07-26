import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const EventRegistrationForm = ({ event, onClose, onSubmit, isCreateMode = false }) => {
  const { toast } = useToast();

  // Convert DD/MM/YYYY to YYYY-MM-DD for date inputs
  const formatToInputDate = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Convert YYYY-MM-DD to DD/MM/YYYY for submission
  const formatToSubmitDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const [formData, setFormData] = useState({
    name: isCreateMode ? '' : event?.name || '',
    max_seats: isCreateMode ? '' : event?.max_seats?.toString() || '',
    isStartUpVapiEvent: isCreateMode ? false : event?.isStartUpVapiEvent || false,
    banner: isCreateMode ? '' : event?.banner || '',
    date: isCreateMode ? '' : formatToInputDate(event?.date) || '',
    time: isCreateMode ? '' : event?.time || '',
    location: isCreateMode ? '' : event?.location || '',
    description: isCreateMode ? '' : event?.description || '',
    youtubeLinks: isCreateMode ? [''] : event?.youtubeLinks?.length ? [...event.youtubeLinks] : [''],
    prize: isCreateMode ? '' : event?.prize || '',
    lastDate: isCreateMode ? '' : formatToInputDate(event?.lastDate) || '',
  });

  const [errors, setErrors] = useState({});
  const [bannerFile, setBannerFile] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to start of day

    // Basic field validations
    if (!formData.name) newErrors.name = 'Event name is required';
    if (!formData.max_seats || isNaN(formData.max_seats) || parseInt(formData.max_seats) < 1)
      newErrors.max_seats = 'Must be a positive number';
    if (!formData.banner && !bannerFile) newErrors.banner = 'Banner image is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.time) newErrors.time = 'Event time is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.prize) newErrors.prize = 'Prize details are required';
    if (!formData.lastDate) newErrors.lastDate = 'Last registration date is required';

    // Date validations
    if (formData.date) {
      const eventDate = new Date(formData.date);
      if (eventDate <= now) {
        newErrors.date = 'Event date must be in the future';
      }
    }
    if (formData.lastDate) {
      const lastDate = new Date(formData.lastDate);
      if (lastDate <= now) {
        newErrors.lastDate = 'Last registration date must be in the future';
      }
      if (formData.date && lastDate > new Date(formData.date)) {
        newErrors.lastDate = 'Last registration date cannot be after event date';
      }
    }

    // YouTube link validation
    formData.youtubeLinks.forEach((link, index) => {
      if (link) {
        try {
          const url = new URL(link);
          if (!url.hostname.includes('youtube.com') && !url.hostname.includes('youtu.be') && !url.hostname.includes('youtube2.com')) {
            newErrors[`youtubeLink_${index}`] = 'Invalid YouTube URL';
          }
        } catch (e) {
          newErrors[`youtubeLink_${index}`] = 'Invalid URL';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields correctly',
        variant: 'destructive',
      });
      return;
    }

    try {
      const submitFormData = new FormData();

      // Add fields to FormData
      submitFormData.append('name', formData.name.trim());
      submitFormData.append('max_seats', formData.max_seats);
      submitFormData.append('isStartUpVapiEvent', formData.isStartUpVapiEvent.toString());
      submitFormData.append('date', formatToSubmitDate(formData.date));
      submitFormData.append('time', formData.time.trim());
      submitFormData.append('location', formData.location.trim());
      submitFormData.append('description', formData.description.trim());
      submitFormData.append('prize', formData.prize.trim());
      submitFormData.append('lastDate', formatToSubmitDate(formData.lastDate));

      // Add YouTube links
      formData.youtubeLinks.forEach((link, index) => {
        if (link) {
          submitFormData.append(`youtubeLinks[${index}]`, link.trim());
        }
      });

      // Add banner file
      if (bannerFile) {
        submitFormData.append('banner', bannerFile);
      } else if (formData.banner && !isCreateMode) {
        submitFormData.append('banner', formData.banner);
      }

      // Determine the API endpoint and method
      const url = isCreateMode ? '/api/event' : `/api/event/${event?._id}`;
      const method = isCreateMode ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        body: submitFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save event');
      }

      const result = await response.json();
      onSubmit(result);
      onClose();

      toast({
        title: 'Success',
        description: isCreateMode ? 'Event created successfully' : 'Event updated successfully',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      let errorMessage = error.message || 'Failed to save event';
      if (error.message.includes('Event with this name already exists')) {
        setErrors((prev) => ({ ...prev, name: 'Event with this name already exists' }));
        errorMessage = 'Event with this name already exists';
      } else if (error.message.includes('Invalid date format')) {
        setErrors((prev) => ({
          ...prev,
          date: error.message.includes('event date') ? error.message : prev.date,
          lastDate: error.message.includes('last registration date') ? error.message : prev.lastDate,
        }));
      } else if (error.message.includes('Validation Error')) {
        setErrors((prev) => ({ ...prev, general: error.message }));
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBannerFile(file);
    setFormData((prev) => ({
      ...prev,
      banner: file ? file.name : '',
    }));
    setErrors((prev) => ({ ...prev, banner: undefined }));
  };

  const handleYoutubeLinkChange = (index, value) => {
    const newYoutubeLinks = [...formData.youtubeLinks];
    newYoutubeLinks[index] = value;
    setFormData((prev) => ({
      ...prev,
      youtubeLinks: newYoutubeLinks,
    }));
    setErrors((prev) => ({ ...prev, [`youtubeLink_${index}`]: undefined }));
  };

  const addYoutubeLink = () => {
    setFormData((prev) => ({
      ...prev,
      youtubeLinks: [...prev.youtubeLinks, ''],
    }));
  };

  const removeYoutubeLink = (index) => {
    if (formData.youtubeLinks.length <= 1) return;
    const newYoutubeLinks = formData.youtubeLinks.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      youtubeLinks: newYoutubeLinks,
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`youtubeLink_${index}`];
      return newErrors;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isCreateMode ? 'Create New Event' : 'Edit Event'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_seats">Maximum Seats *</Label>
              <Input
                id="max_seats"
                name="max_seats"
                type="number"
                min="1"
                value={formData.max_seats}
                onChange={handleInputChange}
                className={errors.max_seats ? 'border-red-500' : ''}
              />
              {errors.max_seats && <p className="text-red-500 text-sm">{errors.max_seats}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isStartUpVapiEvent">Is StartUp Vapi Event</Label>
              <div className="flex items-center">
                <input
                  id="isStartUpVapiEvent"
                  name="isStartUpVapiEvent"
                  type="checkbox"
                  checked={formData.isStartUpVapiEvent}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <Label htmlFor="isStartUpVapiEvent" className="cursor-pointer">
                  {formData.isStartUpVapiEvent ? 'Yes' : 'No'}
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner">Banner *</Label>
              <Input
                id="banner"
                name="banner"
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className={errors.banner ? 'border-red-500' : ''}
              />
              {formData.banner && !bannerFile && !isCreateMode && (
                <p className="text-sm text-gray-500">Current: {formData.banner}</p>
              )}
              {errors.banner && <p className="text-red-500 text-sm">{errors.banner}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                className={errors.time ? 'border-red-500' : ''}
              />
              {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label>YouTube Links</Label>
            {formData.youtubeLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="url"
                  value={link}
                  onChange={(e) => handleYoutubeLinkChange(index, e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`flex-1 ${errors[`youtubeLink_${index}`] ? 'border-red-500' : ''}`}
                />
                {formData.youtubeLinks.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeYoutubeLink(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            {formData.youtubeLinks.some((_, index) => errors[`youtubeLink_${index}`]) && (
              <div className="space-y-1">
                {formData.youtubeLinks.map((_, index) =>
                  errors[`youtubeLink_${index}`] && (
                    <p key={index} className="text-red-500 text-sm">
                      Link {index + 1}: {errors[`youtubeLink_${index}`]}
                    </p>
                  )
                )}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addYoutubeLink}
              className="mt-2"
            >
              <Plus size={16} className="mr-1" />
              Add YouTube Link
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prize">Prize *</Label>
              <Input
                id="prize"
                name="prize"
                value={formData.prize}
                onChange={handleInputChange}
                className={errors.prize ? 'border-red-500' : ''}
              />
              {errors.prize && <p className="text-red-500 text-sm">{errors.prize}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastDate">Last Date for Registration *</Label>
              <Input
                id="lastDate"
                name="lastDate"
                type="date"
                value={formData.lastDate}
                onChange={handleInputChange}
                className={errors.lastDate ? 'border-red-500' : ''}
              />
              {errors.lastDate && <p className="text-red-500 text-sm">{errors.lastDate}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isCreateMode ? 'Create Event' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationForm;