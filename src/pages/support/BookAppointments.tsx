import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MessageCircle, Award, BookOpen, Heart, Users, Star, ChevronRight, AlertCircle, Globe, Settings } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useAppointmentStore } from '../../stores/useAppointmentStore';
import { useNavigate } from 'react-router-dom';

// Types
interface Therapist {
  id: number;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  education: string;
  certifications: string[];
  approach: string;
  ageGroups: string;
  languages: string[];
  availability: string;
  image: string;
  specialFocus: string[];
  sessionTypes: string[];
}

interface Appointment {
  therapistId: string;
  userId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  sessionType: string;
  preferredLanguage: string;
  createdAt: any;
}

const therapists: Therapist[] = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    title: 'Child & Adolescent Psychiatrist',
    specialty: 'Anxiety & Depression in Teens',
    experience: '15 years experience',
    education: 'MD from Stanford University',
    certifications: ['Board Certified in Child & Adolescent Psychiatry', 'Cognitive Behavioral Therapy Certified'],
    approach: 'I specialize in helping teens navigate anxiety, depression, and academic stress using a combination of CBT and mindfulness techniques. I create a safe, judgment-free space where young people can express themselves freely.',
    ageGroups: '12-20 years',
    languages: ['English', 'Hindi','Kannada'],
    availability: 'Mon-Fri',
    image: 'https://cdn.hexahealth.com/Image/webp/480x480/4230ad0e-a4e6-49ab-9af9-2aa9cb7ace7b.webp',
    specialFocus: ['Academic Stress', 'Social Anxiety', 'Depression', 'Self-Esteem'],
    sessionTypes: ['Individual Therapy', 'Family Sessions', 'Group Therapy'],
  },
  {
    id: 2,
    name: 'Dr. Rajesh Malhotra',
    title: 'Adolescent Psychologist',
    specialty: 'Teen Identity & Social Issues',
    experience: '12 years experience',
    education: 'PhD in Clinical Psychology from Yale',
    certifications: ['Licensed Clinical Psychologist', 'LGBTQ+ Youth Counseling Certified'],
    approach: 'My practice focuses on helping teenagers explore their identity, manage social relationships, and build self-confidence. I use a strengths-based approach combined with narrative therapy.',
    ageGroups: '13-20 years',
    languages: ['English', 'Hindi'],
    availability: 'Tue-Sat',
    image: 'https://www.amritahospitals.org/_next/image?url=https%3A%2F%2Fadmin.amritahospitals.org%2Fsites%2Fdefault%2Ffiles%2F2023-05%2FDr.%2520Rajesh%2520Jose-amritahospitals-kochi.jpg&w=3840&q=75',
    specialFocus: ['Identity Development', 'LGBTQ+ Youth', 'Peer Relationships', 'Cultural Issues'],
    sessionTypes: ['Individual Therapy', 'Group Support Sessions'],
  },
  {
    id: 3,
    name: 'Dr. Deepa Iyer',
    title: 'Teen Trauma Specialist',
    specialty: 'Trauma & Resilience Building',
    experience: '10 years experience',
    education: 'PsyD from Columbia University',
    certifications: ['Trauma-Focused CBT Certified', 'EMDR Certified'],
    approach: 'I help young people heal from trauma and build resilience through evidence-based treatments. My practice combines trauma-focused CBT with creative expression and mindfulness.',
    ageGroups: '12-18 years',
    languages: ['English', 'Malayalam'],
    availability: 'Mon-Thu',
    image: 'https://www.asterhospitals.in/sites/default/files/2024-03/Dr%20Deepa%20Rajmohan.jpg',
    specialFocus: ['Trauma Recovery', 'Anxiety', 'Family Conflicts', 'Emotional Regulation'],
    sessionTypes: ['Individual Therapy', 'Family Therapy', 'Art Therapy'],
  },
  {
    id: 4,
    name: 'Dr. Kavya Reddy',
    title: 'Youth Mental Health Specialist',
    specialty: 'Digital Age Mental Health',
    experience: '8 years experience',
    education: 'PhD in Clinical Psychology from UC Berkeley',
    certifications: ['Digital Media & Youth Mental Health Certified', 'DBT Certified'],
    approach: 'I specialize in helping teens navigate mental health challenges in the digital age, including social media impact, online relationships, and cyber-bullying.',
    ageGroups: '12-20 years',
    languages: ['English', 'Telugu', 'Hindi'],
    availability: 'Wed-Sun',
    image: 'https://www.motherhoodindia.com/wp-content/uploads/2021/09/Bangalore-Hebbal-Dr-Shovna-KC-PT.jpg',
    specialFocus: ['Social Media Impact', 'Gaming Addiction', 'Cyberbullying', 'Digital Wellness'],
    sessionTypes: ['Individual Therapy', 'Parent Consultations'],
  },
  {
    id: 5,
    name: 'Dr. Sanjay Gupta',
    title: 'Adolescent Behavioral Specialist',
    specialty: 'ADHD & Executive Functioning',
    experience: '14 years experience',
    education: 'PhD from Johns Hopkins University',
    certifications: ['ADHD Specialist Certification', 'Behavioral Therapy Certified'],
    approach: 'I help teens with ADHD and executive functioning challenges develop practical strategies for academic success and daily life management.',
    ageGroups: '12-19 years',
    languages: ['English', 'Hindi','Kannada'],
    availability: 'Mon-Fri',
    image: 'https://drsanjaygupta.info/wp-content/uploads/2023/12/Untitled-design-3.png',
    specialFocus: ['ADHD Management', 'Executive Functioning', 'Academic Skills', 'Behavior Management'],
    sessionTypes: ['Individual Therapy', 'Skills Training', 'Parent-Teen Sessions'],
  }
];

const BASE_TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

function BookAppointment() {
  const { user } = useAuthStore();
  const { appointments, bookAppointment, loadAppointments, loading, error } = useAppointmentStore();
  const navigate = useNavigate();
  
  // State management
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [showTherapistDetails, setShowTherapistDetails] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(BASE_TIME_SLOTS);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [selectedSessionType, setSelectedSessionType] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    loadAppointments();
  }, [user, navigate, loadAppointments]);

  // Validation helper
  const isValidDate = (date: string): boolean => {
    if (!date) return false;
    try {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(selectedDate.getTime())) return false;
      return selectedDate >= today;
    } catch {
      return false;
    }
  };

  // Selection handlers
  const handleTherapistSelect = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setShowTherapistDetails(true);
    resetBookingForm();
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate('');
    setSelectedTime('');
    setBookingError('');
    setAvailabilityError('');
    
    if (!isValidDate(date)) {
      setBookingError('Please select a valid future date');
      return;
    }
    
    setSelectedDate(date);
  };

  const resetBookingForm = () => {
    setSelectedDate('');
    setSelectedTime('');
    setSelectedSessionType('');
    setSelectedLanguage('');
    setBookingError('');
    setBookingSuccess(false);
  };

  // Availability checking
  useEffect(() => {
    let isMounted = true;
    
    const checkAvailability = async () => {
      if (!selectedDate || !selectedTherapist) {
        setAvailableTimeSlots(BASE_TIME_SLOTS);
        setAvailabilityError('');
        return;
      }

      if (!isValidDate(selectedDate)) {
        setAvailabilityError('Please select a valid future date');
        setAvailableTimeSlots([]);
        return;
      }

      setIsCheckingAvailability(true);
      setAvailabilityError('');

      try {
        const appointmentsRef = collection(db, 'appointments');
        const appointmentQuery = query(
          appointmentsRef,
          where('therapistId', '==', selectedTherapist.id.toString()),
          where('date', '==', selectedDate),
          where('status', '==', 'scheduled')
        );

        const querySnapshot = await getDocs(appointmentQuery);
        if (!isMounted) return;

        const bookedTimes = querySnapshot.docs.map(doc => doc.data().time);
        const currentDate = new Date();
        const selectedDateTime = new Date(selectedDate);
        
        const availableTimes = BASE_TIME_SLOTS.filter(time => {
          if (bookedTimes.includes(time)) return false;

          const [timeStr, period] = time.split(' ');
          const [hours, minutes] = timeStr.split(':');
          let hour = parseInt(hours);

          if (period === 'PM' && hour !== 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;

          const timeDate = new Date(selectedDateTime);
          timeDate.setHours(hour, parseInt(minutes), 0, 0);

          return timeDate > currentDate;
        });

        if (availableTimes.length === 0) {
          setAvailabilityError('No available time slots for this date. Please select another date.');
          setAvailableTimeSlots([]);
        } else {
          setAvailableTimeSlots(availableTimes);
          setAvailabilityError('');
        }

        if (selectedTime && !availableTimes.includes(selectedTime)) {
          setSelectedTime('');
          setBookingError('Previously selected time is no longer available.');
        }

      } catch (err: any) {
        console.error('Error checking availability:', err);
        
        if (err.code === 'permission-denied') {
          setAvailabilityError('You do not have permission to view availability.');
        } else if (err.code === 'unavailable') {
          setAvailabilityError('Service temporarily unavailable. Please try again in a few moments.');
        } else {
          setAvailabilityError('Error checking appointment availability. Please try again later.');
        }
        
        setAvailableTimeSlots([]);
      } finally {
        if (isMounted) {
          setIsCheckingAvailability(false);
        }
      }
    };

    const timeoutId = setTimeout(checkAvailability, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [selectedDate, selectedTherapist, selectedTime]);

  // Booking handler
  const handleBooking = async () => {
    if (!user || !selectedTherapist || !selectedDate || !selectedTime || !selectedSessionType || !selectedLanguage) {
      setBookingError('Please select all required booking information including session type and preferred language');
      return;
    }

    setIsBookingInProgress(true);
    setBookingError('');

    try {
      const appointment: Appointment = {
        therapistId: selectedTherapist.id.toString(),
        userId: user.uid,
        date: selectedDate,
        time: selectedTime,
        status: 'scheduled',
        sessionType: selectedSessionType,
        preferredLanguage: selectedLanguage,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'appointments'), appointment);
      setBookingSuccess(true);
      await loadAppointments();
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err: any) {
      console.error('Booking error:', err);
      setBookingError('Failed to book appointment. Please try again.');
    } finally {
      setIsBookingInProgress(false);
    }
  };

  // Render functions
  const renderTimeSlots = () => {
    if (isCheckingAvailability) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (availabilityError) {
      return (
        <div className="p-4 bg-red-50 rounded-xl text-red-600 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{availabilityError}</p>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          Select Time
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {availableTimeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-xl border-2 transition text-sm ${
                selectedTime === time
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSessionTypeSelector = () => {
    if (!selectedTherapist) return null;

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-600" />
          Select Session Type
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {selectedTherapist.sessionTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedSessionType(type)}
              className={`p-3 rounded-xl border-2 transition text-sm ${
                selectedSessionType === type
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguageSelector = () => {
    if (!selectedTherapist) return null;

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-purple-600" />
          Select Preferred Language
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {selectedTherapist.languages.map((language) => (
            <button
              key={language}
              onClick={() => setSelectedLanguage(language)}
              className={`p-3 rounded-xl border-2 transition text-sm ${
                selectedLanguage === language
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTherapistDetails = () => {
    if (!selectedTherapist) return null;

    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <button
          onClick={() => setShowTherapistDetails(false)}
          className="text-purple-600 mb-6 flex items-center hover:text-purple-700"
        >
          ← Back to all therapists
        </button>
        
        <div className="flex items-start gap-6 mb-8">
          <img
            src={selectedTherapist.image}
            alt={selectedTherapist.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedTherapist.name}</h2>
            <p className="text-purple-600 font-medium">{selectedTherapist.title}</p>
            <p className="text-gray-600 mt-2">{selectedTherapist.experience}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Approach & Philosophy
            </h3>
            <p className="text-gray-700">{selectedTherapist.approach}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Education & Certifications
            </h3>
            <p className="text-gray-700 mb-2">{selectedTherapist.education}</p>
            <ul className="list-disc list-inside text-gray-700">
              {selectedTherapist.certifications.map((cert) => (
                <li key={cert}>{cert}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Languages Spoken
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTherapist.languages.map((language) => (
                <span
                  key={language}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              Areas of Focus
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTherapist.specialFocus.map((focus) => (
                <span
                  key={focus}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Session Types
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTherapist.sessionTypes.map((type) => (
                <span
                  key={type}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookingSummary = () => {
    if (!selectedTherapist || !selectedDate || !selectedTime) return null;

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-700">
            <MessageCircle className="h-5 w-5 text-purple-600" />
            <span>Session with {selectedTherapist.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>{new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="h-5 w-5 text-purple-600" />
            <span>{selectedTime}</span>
          </div>
          {selectedSessionType && (
            <div className="flex items-center gap-2 text-gray-700">
              <Settings className="h-5 w-5 text-purple-600" />
              <span>Session Type: {selectedSessionType}</span>
            </div>
          )}
          {selectedLanguage && (
            <div className="flex items-center gap-2 text-gray-700">
              <Globe className="h-5 w-5 text-purple-600" />
              <span>Preferred Language: {selectedLanguage}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleBooking}
          disabled={isBookingInProgress || bookingSuccess || !selectedSessionType || !selectedLanguage}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBookingInProgress ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Confirm Booking
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    );
  };

  if (loading && !appointments.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-20">
        <div className="relative mt-8">
          <div className="text-center mb-12">
            <Heart className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Book Your Session
            </h1>
            <p className="text-xl text-gray-600">Find the right therapist for your journey</p>
          </div>

          {(error || bookingError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p>{error || bookingError}</p>
            </div>
          )}

          {bookingSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-600">
              <Star className="h-5 w-5" />
              <p>Appointment booked successfully! Redirecting to your appointments...</p>
            </div>
          )}

          {!showTherapistDetails ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {therapists.map((therapist) => (
                <button
                  key={therapist.id}
                  onClick={() => handleTherapistSelect(therapist)}
                  className="bg-white p-6 rounded-2xl transition text-left border-2 border-transparent hover:border-purple-200"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={therapist.image}
                      alt={therapist.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{therapist.name}</h3>
                      <p className="text-purple-600 font-medium">{therapist.title}</p>
                      <p className="text-sm text-gray-600 mt-2">{therapist.experience}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {therapist.languages.map((language) => (
                          <span
                            key={language}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {therapist.specialFocus.slice(0, 2).map((focus) => (
                          <span
                            key={focus}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                          >
                            {focus}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : selectedTherapist && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {renderTherapistDetails()}
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Select Date
                  </h2>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-300 outline-none"
                  />
                </div>

                {selectedDate && renderTimeSlots()}
                {selectedDate && selectedTime && renderSessionTypeSelector()}
                {selectedDate && selectedTime && selectedSessionType && renderLanguageSelector()}
                {selectedDate && selectedTime && selectedSessionType && selectedLanguage && renderBookingSummary()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;