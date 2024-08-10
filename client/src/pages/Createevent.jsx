import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { app } from '../firebase.js'
import { Swiper, SwiperSlide } from "swiper/react";
import mapboxgl from 'mapbox-gl';
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import MapComponent from '../components/MapComponent.jsx';
const steps = [
  { id: 'Step 1', name: 'Event Information', fields: ['selectedCategory', 'numberOfPeople'] },
  { id: 'Step 2', name: 'Create your event', fields: ['eventTitle', 'eventDate', 'startTime', 'endTime', 'location', 'ticketPrice', 'capacity'] },
  { id: 'Step 3', name: 'Complete' }
];

const category = [
  'Comedy', 'Food & Drink', 'Music', 'Community & Culture', 'Hobbies & Special Interest', 'Performing & Visual Arts',
  'Parties', 'Fashion & Beauty', 'Business & Professional', 'Non-Profit', 'Religion & Spirituality', 'Family & Education',
  'Health & Wellness', 'Events Company, Agency, or Promoter', 'Sports & Fitness', 'Other'
];
mapboxgl.accessToken = "pk.eyJ1IjoicGFydGhpazEwMDAiLCJhIjoiY2x3dGdiN3VoMDM4eDJsczdnMzF6ZDEwMiJ9._0J8bPx46q5D5zgnIpd4DQ";

export default function Form() {
  SwiperCore.use([Navigation]);
  const [uploading, setUploading] = useState(false);
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;
  const [showMore, setShowMore] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageUploadError, setImageUploadError] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: '',
      starttime: '',
      endtime: '',
      location: '',
      ticketprice: '',
      capacity: '',
      imageUrls: [],
      selectedCategory: '',
    }
  });
  console.log(formData);
  console.log(files)
  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImages(files[i]));
      }
      const urls = await Promise.all(promises).catch((err) => { setImageUploadError('image upload failed ') });
      console.log('All files uploaded:', urls);

      setValue('imageUrls', [...watch('imageUrls'), ...urls]);
      setImageUploadError(false);
      setUploading(false);

    }
    else {
      setImageUploadError("you can only 6 images per events");
    }


  };
  const storeImages = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name; // Corrected file name construction
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error('Upload failed:', error);
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    // Get the current image URLs from the form state
    const currentImageUrls = watch('imageUrls');

    // Remove the image at the specified index
    const updatedImageUrls = currentImageUrls.filter((_, i) => i !== index);

    // Update the form state with the new image URLs
    setValue('imageUrls', updatedImageUrls);
  };
  const selectedCategory = watch('selectedCategory')
  const handleButtonClick = (category) => {
    setValue('selectedCategory', category);
  };
  const imageUrls = watch('imageUrls');



  const currentUser = { _id: 'user-id' };

  const processForm = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch("/api/event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userRef: currentUser._id,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      console.log('Success:', result);
      // Handle successful submission here

    } catch (err) {
      setError(err.message);
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };


  const next = async () => {
    const fields = steps[currentStep].fields;

    if (currentStep === 0) {
      // Validate current step fields
      const isValid = await trigger(['selectedCategory']);
      if (!isValid) return;
    } else if (currentStep === 1) {
      // Validate step 1 fields
      const isValid = await trigger(fields);
      if (!isValid) return;
    } else {
      // Process form data on last step
      await handleSubmit(processForm)();
      return;
    }

    // Move to the next step if validation passes
    setFormData(prevData => ({ ...prevData, ...watch() }));
    setPreviousStep(currentStep);
    setCurrentStep(step => step + 1);
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep(step => step - 1);
    }
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };


  return (
    <section className='absolute inset-0 flex flex-col justify-between p-40'>
      {/* Steps */}
      <nav aria-label='Progress'>
        <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
          {steps.map((step, index) => (
            <li key={step.name} className='md:flex-1'>
              {currentStep > index ? (
                <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-sky-600 transition-colors'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                  aria-current='step'
                >
                  <span className='text-sm font-medium text-sky-600'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              ) : (
                <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-gray-500 transition-colors'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className='mt-12 py-12' onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h2 className='text-2xl font-semibold text-black'>
              Let’s get to know you first!
            </h2>
            <p className='mt-1 text-sm leading-6 text-black'>
              What type of events do you host?*
            </p>
            <div className="p-6">
              <div className="flex flex-wrap gap-4">
                {category.slice(0, showMore ? undefined : 7).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleButtonClick(category)}
                    className={`px-4 py-2 rounded-lg font-semibold text-white ${selectedCategory === category ? 'bg-blue-500' : 'bg-gray-500'} hover:bg-blue-600 transition-colors`}
                  >
                    {category}
                  </button>
                ))}

              </div>
              <button
                type="button"
                onClick={handleShowMore}
                className="mt-4 text-sky-600 hover:underline"
              >
                {showMore ? 'Show Less' : 'Show More'}
              </button>
            </div>
            <p className='mt-1 text-sm p-3 text-black'>
              On average, how big are your events?*
            </p>
            <div className="">
              <select
                id="number-of-people"
                title="Number of people"
                aria-labelledby="label-number-of-people"

                // {...register('numberOfPeople', { required: true })}
                className="block w-1/3 mt-1 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:ring-sky-700 focus:border-sky-700 sm:text-sm p-2"
              >
                <option value="" disabled hidden>Number of people</option>
                <option value="25">Up to 25 people</option>
                <option value="100">Up to 100 people</option>
                <option value="250">Up to 250 people</option>
                <option value="500">More than 250 people</option>
                <option value="">I'm not sure yet</option>
              </select>
              {errors.numberOfPeople && <p className="mt-1 text-sm text-red-600">Number of people is required</p>}
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='p-24 py-4'>
              <h2 className='text-2xl font-bold text-black'>Create an event</h2>
              <p className='mt-1 text-sm text-black'>
                Answer a few questions about your event
              </p>
              <section className="pt-7">
                <h2 className="text-2xl font-semibold text-gray-900">Event Details</h2>
                <form className="space-y-6 mt-4">
                  {/* Event Title */}
                  <div>
                    <label htmlFor="event-title" className="block text-sm font-medium text-gray-700">Event title *</label>
                    <input
                      id="event-title"
                      type="text"
                      placeholder="Enter event title"
                      {...register('title', { required: true })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                    {error.title && <p className="mt-1 text-sm text-red-600">Event title is required</p>}
                  </div>

                  <label htmlFor="event-title" className="block text-sm font-medium text-gray-700">Event Description *</label>
                  <div>
                    <textarea
                      type="text"
                      placeholder="Description"
                      className="border p-3 rounded-lg"
                      id="description"

                      {...register('description', { required: true })}
                    />
                  </div>
                  {/* Event Date */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">When does your event start and end?</label>
                    <input
                      id="event-date"
                      type="date"
                      {...register('date', { required: true })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                    {error.date && <p className="mt-1 text-sm text-red-600">Date is required</p>}
                  </div>

                  {/* Event Start and End Time */}
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">Start time</label>
                      <input
                        id="start-time"
                        type="time"
                        {...register('starttime', { required: true })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                      {error.starttime && <p className="mt-1 text-sm text-red-600">Start time is required</p>}
                    </div>
                    <div className="flex-1">
                      <label htmlFor="endtime" className="block text-sm font-medium text-gray-700">End time</label>
                      <input
                        id="end-time"
                        type="time"
                        {...register('endtime', { required: true })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      />
                      {error.endtime && <p className="mt-1 text-sm text-red-600">End time is required</p>}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Where is it located?</label>
                    <input
                      id="location"
                      type="text"
                      placeholder="Enter location"
                      {...register('location', { required: true })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                    {error.location && <p className="mt-1 text-sm text-red-600">Location is required</p>}
                  </div>

                  {/* Ticket Price */}
                  <div>
                    <label htmlFor="ticket-price" className="block text-sm font-medium text-gray-700">How much do you want to charge for tickets? *</label>
                    <input
                      id="ticket-price"
                      type="number"
                      placeholder="0.00"
                      {...register('ticketprice', { required: true })}
                      className="mt-1 block border border-gray-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                    {error.ticketprice && <p className="mt-1 text-sm text-red-600">Ticket price is required</p>}
                  </div>

                  {/* Capacity */}
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">What's the capacity for your event? *</label>
                    <input
                      id="capacity"
                      type="number"
                      placeholder="0"
                      {...register('capacity', { required: true })}
                      className="mt-1 block border border-gray-300 rounded-md shadow-sm p-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                    {error.capacity && <p className="mt-1 text-sm text-red-600">Capacity is required</p>}
                  </div>



                  <p className='font-semibold'>
                    Images:
                    <span className='font-normal text-gray-600 ml-2'>
                      The first image will be the cover (max 6)
                    </span>
                  </p>
                  <div className='flex gap-4'>
                    <input
                      onChange={(e) => setFiles(e.target.files)}
                      className='p-3 border border-gray-300 rounded w-full'
                      type='file'
                      id='images'
                      accept='image/*'
                      multiple
                    />
                    <button
                      type='button'
                      disabled={uploading}
                      onClick={handleImageSubmit}
                      className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  <p className="text-red-700 text-sm">
                    {imageUploadError && imageUploadError}
                  </p>
                  {watch('imageUrls').length > 0 &&
                    watch('imageUrls').map((url, index) => (
                      <div
                        key={index}
                        className="flex justify-between p-3 border items-center"
                      >
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="w-20 h-20 object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                </form>
              </section>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Complete
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Review and submit your information.
            </p>

            <div>
              <Swiper navigation>
                {imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div
                      className="h-[550px]"
                      style={{
                        background: `url(${url}) center no-repeat`,
                        backgroundSize: "cover",
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>

            </div>
            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold'>Event Information</h3>
                <p><strong>Category:</strong> {category}</p>
                <p><strong>Number of people:</strong> {formData.numberOfPeople}</p>
              </div>
              <div>
                <h3 className='text-lg font-semibold'>Event Details</h3>
                <p><strong>Title:</strong> {formData.title}</p>
                <p><strong>Date:</strong> {formData.date}</p>
                <p><strong>Start Time:</strong> {formData.startTime}</p>
                <p><strong>End Time:</strong> {formData.endTime}</p>

                <p><strong>Location:</strong> {formData.location}</p>
                <div className="col-span-8 offset-3 mb-3">
                  <h3>Where you'll be</h3>
                  <MapComponent location={formData.location} />
                </div>
                <p><strong>Ticket Price:</strong> ${formData.ticketPrice}</p>
                <p><strong>Capacity:</strong> {formData.capacity}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className='flex justify-between mt-12'>
          <button
            type='button'
            onClick={prev}
            disabled={currentStep === 0}
            className='inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2'
          >
            <svg
              className='-ml-1 mr-2 h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 19l-7-7 7-7'
              />
            </svg>
            Previous
          </button>

          <button
            type='button'
            onClick={next}
            className='inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2'
          >
            Next
            <svg
              className='-ml-1 mr-2 h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}
