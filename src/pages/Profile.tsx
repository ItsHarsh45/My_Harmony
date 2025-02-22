import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Calendar, Edit2, Clock, AlertCircle, Globe, Settings
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useAppointmentStore } from '../stores/useAppointmentStore';

interface Therapist {
  id: number;
  name: string;
  title: string;
  specialty: string;
}

interface Appointment {
  id?: string;
  therapistId: string;
  userId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  sessionType: string;
  preferredLanguage: string;
}

const therapists: Therapist[] = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    title: 'Child & Adolescent Psychiatrist',
    specialty: 'Anxiety & Depression in Teens'
  },
  {
    id: 2,
    name: 'Dr. Rajesh Malhotra',
    title: 'Adolescent Psychologist',
    specialty: 'Teen Identity & Social Issues'
  },
  {
    id: 3,
    name: 'Dr. Deepa Iyer',
    title: 'Teen Trauma Specialist',
    specialty: 'Trauma & Resilience Building'
  },
  {
    id: 4,
    name: 'Dr. Kavya Reddy',
    title: 'Youth Mental Health Specialist',
    specialty: 'Digital Age Mental Health'
  },
  {
    id: 5,
    name: 'Dr. Sanjay Gupta',
    title: 'Adolescent Behavioral Specialist',
    specialty: 'ADHD & Executive Functioning'
  }
];

export default function Profile() {
  const { user, updateProfile, loading: authLoading } = useAuthStore();
  const { 
    appointments, 
    loadAppointments, 
    loading: appointmentLoading, 
    error: appointmentError 
  } = useAppointmentStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAppointments();
      setName(user.displayName || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);

    try {
      await updateProfile({ displayName: name });
      setIsEditing(false);
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update profile');
    }
  };

  const getTherapistInfo = (therapistId: string) => {
    const therapist = therapists.find(t => t.id === parseInt(therapistId));
    return therapist || { name: 'Unknown Therapist', title: '', specialty: '' };
  };

  const currentDate = new Date();
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const upcomingAppointments = sortedAppointments.filter(apt => {
    const aptDate = new Date(`${apt.date} ${apt.time}`);
    return aptDate >= currentDate && apt.status === 'scheduled';
  });

  const pastAppointments = sortedAppointments.filter(apt => {
    const aptDate = new Date(`${apt.date} ${apt.time}`);
    return aptDate < currentDate || apt.status === 'completed' || apt.status === 'cancelled';
  });

  const renderAppointmentCard = (appointment: Appointment) => {
    const aptDate = new Date(`${appointment.date} ${appointment.time}`);
    const therapist = getTherapistInfo(appointment.therapistId);
    
    return (
      <div 
        key={appointment.id}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-fuchsia-200 transition-colors"
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-fuchsia-600" />
                <span className="font-medium">
                  {aptDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-gray-600">{appointment.time}</p>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{therapist.name}</p>
                <p className="text-sm text-gray-500">{therapist.title}</p>
                <p className="text-sm text-fuchsia-600">{therapist.specialty}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              appointment.status === 'scheduled' ? 'bg-green-100 text-green-700' :
              appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
          </div>

          {/* Session Type and Language Section */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-fuchsia-600" />
              <span className="text-sm text-gray-600">
                {appointment.sessionType || 'Individual Therapy'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-fuchsia-600" />
              <span className="text-sm text-gray-600">
                {appointment.preferredLanguage || 'English'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-fuchsia-50 to-pink-50 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 flex items-center justify-center text-white text-4xl font-bold">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{user.displayName || 'User'}</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-5 w-5 text-fuchsia-600" />
                  {user.email}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5 text-fuchsia-600" />
                  Member since {new Date(user.metadata.creationTime).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <form onSubmit={handleUpdateProfile} className="mt-8 border-t pt-8">
              <div className="space-y-6">
                {updateError && (
                  <div className="mb-4 p-4 bg-red-50 rounded-lg text-red-600">
                    {updateError}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white rounded-lg hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 transition-colors disabled:opacity-50"
                  >
                    {authLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Your Appointments</h2>
          
          {appointmentError && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p>{appointmentError}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-4 px-4 font-medium transition-colors relative ${
                activeTab === 'upcoming' ? 'text-fuchsia-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming ({upcomingAppointments.length})
              {activeTab === 'upcoming' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-fuchsia-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-4 px-4 font-medium transition-colors relative ${
                activeTab === 'past' ? 'text-fuchsia-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past ({pastAppointments.length})
              {activeTab === 'past' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-fuchsia-600" />
              )}
            </button>
          </div>

          {appointmentLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'upcoming' ? (
                upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map(renderAppointmentCard)
                ) : (
                  <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
                )
              ) : (
                pastAppointments.length > 0 ? (
                  pastAppointments.map(renderAppointmentCard)
                ) : (
                  <p className="text-gray-500 text-center py-8">No past appointments</p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}