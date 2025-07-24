import { useState } from 'react';
import { X, Plus, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const EventRegistrationForm = ({ event, onClose, onSubmit, isCreateMode = false }) => {
  const [formData, setFormData] = useState({
    name: isCreateMode ? '' : '',
    email: isCreateMode ? '' : '',
    phone: isCreateMode ? '' : '',
    eventName: isCreateMode ? '' : event?.eventId?.name || '',
    description: isCreateMode ? '' : event?.description || '',
    date: isCreateMode ? '' : event?.date?.split('T')[0] || '',
    time: isCreateMode ? '' : event?.time || '',
    location: isCreateMode ? '' : event?.location || '',
    banner: isCreateMode ? '' : event?.banner || '',
    prize: isCreateMode ? '0' : event?.prize || '0',
    lastDate: isCreateMode ? '' : event?.lastDate?.split('T')[0] || '',
    youtubeLinks: isCreateMode ? [''] : event?.youtubeLinks || [''],
  });
const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleYoutubeLinkChange = (index, value) => {
    const newYoutubeLinks = [...formData.youtubeLinks];
    newYoutubeLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      youtubeLinks: newYoutubeLinks.filter(link => link.trim() !== '')
    }));
  };

  const addYoutubeLink = () => {
    setFormData(prev => ({
      ...prev,
      youtubeLinks: [...prev.youtubeLinks, '']
    }));
  };

  const removeYoutubeLink = (index) => {
    const newYoutubeLinks = formData.youtubeLinks.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      youtubeLinks: newYoutubeLinks.length > 0 ? newYoutubeLinks : ['']
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const formDataToSend = new FormData();
  
      // Add all form fields to FormData
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('prize', formData.prize);
      formDataToSend.append('lastDate', formData.lastDate);
      formDataToSend.append('eventId', formData.eventId);
  
      // Add banner file if it exists
      if (bannerFile) {
        formDataToSend.append('banner', bannerFile);
      }
  
      // Add youtube links from the formData state, not the FormData object
      formData.youtubeLinks.forEach((link) => {
        if (link) {
          formDataToSend.append('youtubeLinks', link);
        }
      });
  
      const response = await fetch('/api/event-details', {
        method: 'POST',
        body: formDataToSend, // Use the correct FormData instance
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }
  
      const result = await response.json();
      onSubmit?.(result);
      onClose();
  
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Failed to submit form' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRegistrationFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
      </div>
    </>
  );

  const renderEventFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="eventName">Event Name</Label>
        <Input
          id="eventName"
          name="eventName"
          type="text"
          required
          value={formData.eventName}
          onChange={handleChange}
          placeholder="Enter event name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter event description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Event Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Event Time</Label>
          <Input
            id="time"
            name="time"
            type="time"
            required
            value={formData.time}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          type="text"
          required
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter event location"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="banner">Banner Image</Label>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
            id="banner"
            required
          />
          {bannerPreview && (
            <div className="mt-2">
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="h-32 w-auto object-cover rounded-md border"
              />
            </div>
          )}
          {!bannerPreview && formData.banner && (
            <div className="text-sm text-gray-500">
              Current banner: {formData.banner}
            </div>
          )}
        </div>
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
              className="flex-1"
            />
            {formData.youtubeLinks.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeYoutubeLink(index)}
                className="text-red-500 hover:text-red-600"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addYoutubeLink}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add YouTube Link
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prize">Prize</Label>
          <Input
            id="prize"
            name="prize"
            type="text"
            required
            value={formData.prize}
            onChange={handleChange}
            placeholder="Enter prize details"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastDate">Last Date for Registration</Label>
          <Input
            id="lastDate"
            name="lastDate"
            type="date"
            required
            value={formData.lastDate}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isCreateMode ? 'Create New Event' : `Register for ${event?.eventId?.name}`}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isCreateMode ? renderEventFields() : renderRegistrationFields()}

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (isCreateMode ? 'Creating...' : 'Registering...')
                : (isCreateMode ? 'Create Event' : 'Register for Event')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationForm;
