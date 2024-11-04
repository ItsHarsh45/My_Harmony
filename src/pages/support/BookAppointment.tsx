import React, { useState } from 'react';
import { Calendar, Clock, MessageCircle, Award, BookOpen, Heart, Users, Star, ChevronRight } from 'lucide-react';

const therapists = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      title: 'Child & Adolescent Psychiatrist',
      specialty: 'Anxiety & Depression in Teens',
      experience: '15 years experience',
      education: 'MD from Stanford University',
      certifications: ['Board Certified in Child & Adolescent Psychiatry', 'Cognitive Behavioral Therapy Certified'],
      approach: 'I specialize in helping teens navigate anxiety, depression, and academic stress using a combination of CBT and mindfulness techniques. I create a safe, judgment-free space where young people can express themselves freely.',
      ageGroups: '12-20 years',
      languages: ['English', 'Spanish'],
      availability: 'Mon-Fri',
      image: '/api/placeholder/150/150',
      specialFocus: ['Academic Stress', 'Social Anxiety', 'Depression', 'Self-Esteem'],
      sessionTypes: ['Individual Therapy', 'Family Sessions', 'Group Therapy'],
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      title: 'Adolescent Psychologist',
      specialty: 'Teen Identity & Social Issues',
      experience: '12 years experience',
      education: 'PhD in Clinical Psychology from Yale',
      certifications: ['Licensed Clinical Psychologist', 'LGBTQ+ Youth Counseling Certified'],
      approach: 'My practice focuses on helping teenagers explore their identity, manage social relationships, and build self-confidence. I use a strengths-based approach combined with narrative therapy.',
      ageGroups: '13-20 years',
      languages: ['English', 'Mandarin'],
      availability: 'Tue-Sat',
      image: '/api/placeholder/150/150',
      specialFocus: ['Identity Development', 'LGBTQ+ Youth', 'Peer Relationships', 'Cultural Issues'],
      sessionTypes: ['Individual Therapy', 'Group Support Sessions'],
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      title: 'Teen Trauma Specialist',
      specialty: 'Trauma & Resilience Building',
      experience: '10 years experience',
      education: 'PsyD from Columbia University',
      certifications: ['Trauma-Focused CBT Certified', 'EMDR Certified'],
      approach: 'I help young people heal from trauma and build resilience through evidence-based treatments. My practice combines trauma-focused CBT with creative expression and mindfulness.',
      ageGroups: '12-18 years',
      languages: ['English', 'Spanish'],
      availability: 'Mon-Thu',
      image: '/api/placeholder/150/150',
      specialFocus: ['Trauma Recovery', 'Anxiety', 'Family Conflicts', 'Emotional Regulation'],
      sessionTypes: ['Individual Therapy', 'Family Therapy', 'Art Therapy'],
    },
    {
      id: 4,
      name: 'Dr. Aisha Patel',
      title: 'Youth Mental Health Specialist',
      specialty: 'Digital Age Mental Health',
      experience: '8 years experience',
      education: 'PhD in Clinical Psychology from UC Berkeley',
      certifications: ['Digital Media & Youth Mental Health Certified', 'DBT Certified'],
      approach: 'I specialize in helping teens navigate mental health challenges in the digital age, including social media impact, online relationships, and cyber-bullying.',
      ageGroups: '12-20 years',
      languages: ['English', 'Hindi', 'Gujarati'],
      availability: 'Wed-Sun',
      image: '/api/placeholder/150/150',
      specialFocus: ['Social Media Impact', 'Gaming Addiction', 'Cyberbullying', 'Digital Wellness'],
      sessionTypes: ['Individual Therapy', 'Online Sessions', 'Parent Consultations'],
    },
    {
      id: 5,
      name: 'Dr. James Wilson',
      title: 'Adolescent Behavioral Specialist',
      specialty: 'ADHD & Executive Functioning',
      experience: '14 years experience',
      education: 'PhD from Johns Hopkins University',
      certifications: ['ADHD Specialist Certification', 'Behavioral Therapy Certified'],
      approach: 'I help teens with ADHD and executive functioning challenges develop practical strategies for academic success and daily life management.',
      ageGroups: '12-19 years',
      languages: ['English'],
      availability: 'Mon-Fri',
      image: '/api/placeholder/150/150',
      specialFocus: ['ADHD Management', 'Executive Functioning', 'Academic Skills', 'Behavior Management'],
      sessionTypes: ['Individual Therapy', 'Skills Training', 'Parent-Teen Sessions'],
    }
  ];
  
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];
export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showTherapistDetails, setShowTherapistDetails] = useState(false);

  const handleTherapistSelect = (therapist) => {
    setSelectedTherapist(therapist);
    setShowTherapistDetails(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* Main content with proper top spacing */}
      <div className="max-w-7xl mx-auto px-4 pt-20"> {/* Changed py-12 to pt-20 */}
        {/* Hero Section */}
        <div className="relative mt-8"> {/* Added margin top */}
          <div className="text-center mb-12">
            <Heart className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Youth Mental Health Care
            </h1>
            <p className="text-xl text-gray-600">Find the right therapist for ages 12-20</p>
          </div>

          {!showTherapistDetails ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {therapists.map((therapist) => (
                <button
                  key={therapist.id}
                  onClick={() => handleTherapistSelect(therapist)}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-left border-2 border-transparent hover:border-purple-200"
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
                        {therapist.specialFocus.slice(0, 2).map((focus) => (
                          <span key={focus} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {focus}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
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
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-300 outline-none"
                  />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Select Time
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
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

                {selectedDate && selectedTime && (
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MessageCircle className="h-5 w-5 text-purple-600" />
                        <span>Session with {selectedTherapist.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <span>{selectedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="h-5 w-5 text-purple-600" />
                        <span>{selectedTime}</span>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center gap-2">
                      Confirm Booking
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}