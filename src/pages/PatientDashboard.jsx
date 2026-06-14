import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiMessageSquare,
  FiSearch,
  FiCpu,
  FiStar,
  FiVideo,
  FiX,
} from "react-icons/fi";
import PatientNavbar from "../components/PatientNavbar";
import API from "../utils/api";
import { toast } from "react-toastify";
import Avatar from "../components/Avatar";
import AIRecommendation from "../components/AIRecommendation";
import Footer from "../components/Footer";

const PatientDashboard = () => {
  const [specialization, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editReviewId, setEditReviewId] = useState(null);
  const [newReviewbtn, setReviewbtn] = useState(true);
  const [doctorReviews, setDoctorReviews] = useState({});
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [appointmentType, setAppointmentType] = useState("clinic");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  const cardClass =
    "rounded-[24px] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl";
  const sectionTitleClass =
    "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500";
  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

  const handleVideoCallJoin = async (appointment) => {
    try {
      setLoading(true);
      const accessRes = await API.get(`/video/check-access/${appointment.roomId}`);
      const accessData = accessRes.data;

      if (accessData.accessible) {
        window.open(
          `/video-call/${appointment.roomId}`,
          "_blank",
          "width=1200,height=700"
        );
      } else {
        toast.info(accessData.message);
      }
    } catch (error) {
      console.error("Video call access error:", error);
      toast.error("Cannot join video call at this time");
    } finally {
      setLoading(false);
    }
  };

  const handleAIRecommendation = (recommendedDoctors) => {
    setDoctors(recommendedDoctors);
    setShowAIRecommendation(true);
  };

  const resetToAllDoctors = () => {
    setSpecialization("");
    fetchDoctors();
    setShowAIRecommendation(false);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { text: userMessage, sender: "user" };
    setChatMessages((prev) => [...prev, newMessage]);
    setUserMessage("");

    try {
      setLoading(true);
      const res = await API.post("/chat/ai-chat", { message: userMessage });

      const aiResponse = {
        text: res.data.response,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("AI Chatbot error:", err);
      const errorMessage = {
        text: "Sorry, I'm having trouble responding. Please try again.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchAvailableSlots = async (doctorId) => {
    try {
      const res = await API.get(`/patient/doctor/${doctorId}/availability`);
      setAvailableSlots(res.data.availableSlots || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch available slots");
      setAvailableSlots([]);
    }
  };

  const handleBookAppointment = async (slot) => {
    try {
      setLoading(true);

      const appointmentData = {
        doctor: selectedDoctor._id,
        patient: userId,
        date: slot.date,
        time: `${slot.startTime} - ${slot.endTime}`,
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: "pending",
        appointmentType,
        appointmentSource: "website",
      };

      const res = await API.post("/patient/appointments", appointmentData);

      if (appointmentType === "video") {
        try {
          const videoRes = await API.post("/video/create-session", {
            appointmentId: res.data.appointment._id,
          });
          res.data.appointment.roomId = videoRes.data.roomId;
          res.data.appointment.meetingLink = `/video-call/${videoRes.data.roomId}`;
        } catch (videoError) {
          console.error("Video session creation failed:", videoError);
          toast.warning(
            "Appointment booked but video setup failed. Contact support."
          );
        }
      }

      await handleAdvancePayment(res.data.appointment._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancePayment = async (appointmentId) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const fee = selectedDoctor?.consultationFee
        ? Number(selectedDoctor.consultationFee)
        : 500;
      const advancePercent = 0.3;
      const advanceAmount = Math.round(fee * advancePercent);

      const { data: order } = await API.post("/payment/create-order", {
        amount: advanceAmount,
        appointmentId,
        paymentType: "advance",
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_yPcX4DfRzX1mKb",
        amount: order.amount,
        currency: "INR",
        name: "DocMeet",
        description: `30% Advance for ${
          appointmentType === "video" ? "Video" : "Clinic"
        } Appointment`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await API.post("/payment/verify-payment", {
              ...response,
              appointmentId,
              paymentType: "advance",
            });

            toast.success(
              `30% Advance payment successful! ${
                appointmentType === "video"
                  ? "Video call link will be available after doctor confirmation."
                  : "Waiting for doctor confirmation."
              }`
            );
            setShowModal(false);
            fetchHistory();
          } catch (error) {
            console.error("Advance payment verification error:", error);
            toast.error("Advance payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile || "+919999999999",
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: function () {
            toast.info("Advance payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Advance payment initialization failed");
    }
  };

  const handleBalancePayment = async (appointmentId, balance) => {
    const appointment = history.find((a) => a._id === appointmentId);

    if (!appointment) {
      toast.error("Appointment not found");
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const { data: order } = await API.post("/payment/create-order", {
        amount: balance,
        appointmentId,
        paymentType: "balance",
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_yPcX4DfRzX1mKb",
        amount: order.amount,
        currency: "INR",
        name: "DocMeet",
        description: `70% Balance Payment for ${
          appointment.appointmentType === "video" ? "Video" : "Clinic"
        } Appointment with Dr. ${appointment.doctor.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await API.post("/payment/verify-payment", {
              ...response,
              appointmentId,
              paymentType: "balance",
            });

            toast.success("70% Balance payment successful! Appointment completed.");
            fetchHistory();
          } catch (error) {
            console.error("Balance payment verification error:", error);
            toast.error("Balance payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile || "+919999999999",
        },
        theme: { color: "#ea580c" },
        modal: {
          ondismiss: function () {
            toast.info("Balance payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Balance payment initialization failed");
    }
  };

  const deleteReFetch = async () => {
    doctors.forEach((doc) => {
      fetchDoctorReviews(doc._id);
    });
  };

  const handleEdit = (id) => {
    const review = doctorReviews[selectedDoctor._id]?.find((r) => r._id === id);
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
      setEditReviewId(id);
      setShowFeedbackModal(true);
      setReviewbtn(false);
    }
  };

  const handleUpdateReview = async () => {
    if (!editReviewId) {
      toast.error("No review selected to edit.");
      return;
    }

    try {
      const res = await API.put(`/reviews/${editReviewId}`, {
        rating,
        comment,
      });
      toast.success(res.data.message);
      setShowFeedbackModal(false);
      setRating(0);
      setComment("");
      setEditReviewId(null);
      fetchDoctorReviews(selectedDoctor._id);
    } catch (err) {
      toast.error(
        "Failed to edit review: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/reviews/${id}`);
      toast.success(res.data.message);
      await deleteReFetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review" + err.message);
    }
  };

  const fetchDoctorReviews = async (doctorId) => {
    try {
      const res = await API.get(`/reviews/doctor/${doctorId}`);
      setDoctorReviews((prev) => ({ ...prev, [doctorId]: res.data }));
    } catch (err) {
      console.error("Failed to load reviews for", doctorId, err);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setRating(i)}
          className={`cursor-pointer text-2xl ${
            i <= rating ? "text-yellow-400" : "text-slate-300"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getPatientId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.id;
  };

  const fetchDoctors = async () => {
    try {
      const res = await API.get(`/patient/finddoc/?specialization=${specialization}`);
      setDoctors(res.data);
    } catch (err) {
      if (!err.response?.data?.message?.toLowerCase().includes("token")) {
        toast.error(
          err.response?.data?.message || "Failed to fetch doctor details"
        );
      }
    }
  };

  const fetchHistory = async () => {
    const id = getPatientId();
    if (!id) return;
    try {
      const res = await API.get(`/patient/${id}/history`);
      setHistory(res.data);
    } catch (err) {
      if (!err.response?.data?.message?.toLowerCase().includes("token")) {
        toast.error(
          err.response?.data?.message || "Failed to fetch appointment history"
        );
      }
      setHistory([]);
    }
  };

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      const res = await API.delete(`/patient/appointments/cancel/${id}`);
      toast.success(res.data.message);
      fetchHistory();
    } catch (err) {
      toast.error(
        "Failed to cancel appointment: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchDoctors();
      await fetchHistory();
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (doctors.length > 0) {
      doctors.forEach((doc) => {
        fetchDoctorReviews(doc._id);
      });
    }
  }, [doctors]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const totalAppointments = history.length;
  const confirmedAppointments = history.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;
  const videoAppointments = history.filter(
    (appointment) => appointment.appointmentType === "video"
  ).length;

  return (
    <div className="min-h-screen">
      <PatientNavbar />

      <div className="px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className={`${cardClass} overflow-hidden`}>
            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              <div className="bg-gradient-to-br from-sky-700 via-blue-600 to-cyan-500 p-6 text-white lg:p-8">
                <div className="mb-4 inline-flex rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Patient Workspace
                </div>
                <h1 className="text-[1.9rem] font-bold leading-tight sm:text-[2.2rem]">
                  Discover doctors and manage appointments with ease.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50">
                  Browse specialists, book clinic or video consultations, track
                  your appointment journey, and get guided recommendations from
                  one premium patient dashboard.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                      Doctors
                    </p>
                    <p className="mt-3 text-3xl font-bold">{doctors.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                      Appointments
                    </p>
                    <p className="mt-3 text-3xl font-bold">
                      {totalAppointments}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                      Video Visits
                    </p>
                    <p className="mt-3 text-3xl font-bold">
                      {videoAppointments}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:p-8">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-5">
                  <p className={sectionTitleClass}>Patient Overview</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Everything in one place
                  </h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-600">
                        Confirmed
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {confirmedAppointments}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-600">
                        Smart Assist
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        AI doctor suggestions and chatbot support available
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        Search by specialization or use AI recommendations.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        Pay your advance online and track appointment status.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        Join video consultations and leave doctor feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <div className={`${cardClass} p-5 sm:p-6`}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className={sectionTitleClass}>Find Care</p>
                  <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
                    <FiSearch className="text-blue-600" />
                    Browse Doctors
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Explore specialists and choose how you want to consult.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (showAIRecommendation) {
                      resetToAllDoctors();
                    }
                    setShowAIRecommendation(!showAIRecommendation);
                  }}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                    showAIRecommendation
                      ? "bg-slate-700 text-white hover:bg-slate-800"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {showAIRecommendation ? "Show All Doctors" : "AI Recommendation"}
                </button>
              </div>

              {showAIRecommendation && <AIRecommendation onDoctorsFound={handleAIRecommendation} />}

              {!showAIRecommendation && (
                <form
                  onSubmit={handleSearch}
                  className="mb-6 rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="Enter specialization e.g. cardiologist"
                      className={inputClass}
                    />
                    <button
                      type="submit"
                      className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Search
                    </button>
                  </div>
                </form>
              )}

              <div className="grid gap-4">
                {doctors.length > 0 ? (
                  doctors.map((doc) => {
                    const reviews = doctorReviews[doc._id] || [];
                    const avgRating =
                      reviews.length > 0
                        ? (
                            reviews.reduce((sum, review) => sum + review.rating, 0) /
                            reviews.length
                          ).toFixed(1)
                        : 0;
                    const totalReviews = reviews.length;

                    return (
                      <div
                        key={doc._id}
                        className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <Avatar src={doc.profileImage} size={54} />
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-lg font-bold text-slate-900">
                                    Dr. {doc.name}
                                  </h3>
                                  {avgRating > 0 && (
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                      ★ {avgRating} ({totalReviews} reviews)
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 text-sm font-semibold text-blue-600">
                                  {doc.specialization || "General Specialist"}
                                </p>
                              </div>
                            </div>

                            <div className="rounded-2xl bg-blue-50 px-4 py-3 text-right">
                              <p className="text-xs uppercase tracking-[0.18em] text-blue-500">
                                Consultation Fee
                              </p>
                              <p className="mt-1 text-xl font-bold text-slate-900">
                                ₹{doc.consultationFee}
                              </p>
                              <p className="text-xs text-slate-500">
                                Advance: ₹
                                {Math.round((doc.consultationFee || 500) * 0.3)}
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                              <p>
                                <span className="font-semibold text-slate-800">
                                  Clinic:
                                </span>{" "}
                                {doc.clinicName}
                              </p>
                              <p className="mt-1 flex items-start gap-2">
                                <FiMapPin className="mt-0.5 text-blue-500" />
                                <span>
                                  {doc.clinicAddress}, {doc.city}
                                </span>
                              </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                              <p>
                                <span className="font-semibold text-slate-800">
                                  Experience:
                                </span>{" "}
                                {doc.experience}
                              </p>
                              <p className="mt-1">
                                <span className="font-semibold text-slate-800">
                                  Qualification:
                                </span>{" "}
                                {doc.qualification || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => {
                                setSelectedDoctor(doc);
                                fetchAvailableSlots(doc._id);
                                setAppointmentType("clinic");
                                setShowModal(true);
                              }}
                              className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                              View Available Slots
                            </button>

                            <button
                              onClick={() => {
                                setSelectedDoctor(doc);
                                setShowFeedbackModal(true);
                              }}
                              className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                              Give Feedback
                            </button>
                          </div>

                          {doctorReviews[doc._id] &&
                            doctorReviews[doc._id].length > 0 && (
                              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="mb-3 text-sm font-semibold text-slate-800">
                                  Recent Reviews
                                </p>
                                <div className="space-y-3">
                                  {doctorReviews[doc._id]
                                    .slice(0, 3)
                                    .map((review, index) => (
                                      <div
                                        key={index}
                                        className="rounded-2xl bg-white px-4 py-3 shadow-sm"
                                      >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                          <p className="font-semibold text-slate-800">
                                            {review.patient?.name || "Anonymous"}
                                          </p>
                                          <p className="text-yellow-500">
                                            {"★".repeat(review.rating)}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm italic text-slate-600">
                                          {review.comment}
                                        </p>
                                        {String(review.patient?._id) === userId && (
                                          <div className="mt-3 flex gap-2">
                                            <button
                                              className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                                              onClick={() => handleEdit(review._id)}
                                            >
                                              Edit
                                            </button>
                                            <button
                                              className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                                              onClick={() => handleDelete(review._id)}
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
                    <p className="text-base font-semibold text-slate-700">
                      {showAIRecommendation
                        ? "No AI recommended doctors found."
                        : "No doctors found."}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {showAIRecommendation
                        ? "Try describing different symptoms for a better match."
                        : "Try another specialization search."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className={`${cardClass} p-5 sm:p-6`}>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <p className={sectionTitleClass}>Your Journey</p>
                  <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
                    <FiCalendar className="text-blue-600" />
                    Appointment History
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Track booking status, payments, and upcoming consultations.
                  </p>
                </div>
              </div>

              {history.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
                  <p className="text-base font-semibold text-slate-700">
                    No appointments found
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Your booked consultations will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((appointment) => {
                    const fee = appointment.doctor?.consultationFee;
                    const advance = Math.round(fee * 0.3);
                    const balance = fee - advance;

                    return (
                      <div
                        key={appointment._id}
                        className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-lg font-semibold text-slate-900">
                                  Dr. {appointment.doctor?.name}
                                </p>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    appointment.appointmentType === "video"
                                      ? "bg-violet-100 text-violet-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {appointment.appointmentType === "video"
                                    ? "Video"
                                    : "Clinic"}
                                </span>
                              </div>
                              <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                                <p>
                                  <span className="font-semibold text-slate-800">
                                    Date:
                                  </span>{" "}
                                  {appointment.date}
                                </p>
                                <p>
                                  <span className="font-semibold text-slate-800">
                                    Time:
                                  </span>{" "}
                                  {appointment.startTime} - {appointment.endTime}
                                </p>
                                {appointment.appointmentType === "clinic" && (
                                  <p className="sm:col-span-2">
                                    <span className="font-semibold text-slate-800">
                                      Clinic:
                                    </span>{" "}
                                    {appointment.doctor?.clinicName}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                Status
                              </p>
                              <p
                                className={`mt-1 text-sm font-semibold ${
                                  appointment.status === "confirmed"
                                    ? "text-emerald-600"
                                    : appointment.status === "rejected"
                                    ? "text-rose-600"
                                    : appointment.status === "pending"
                                    ? "text-amber-600"
                                    : appointment.status === "completed"
                                    ? "text-blue-600"
                                    : "text-slate-600"
                                }`}
                              >
                                {appointment.status.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          {appointment.appointmentType === "video" &&
                            appointment.status === "confirmed" && (
                              <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700">
                                Video link becomes available shortly before the
                                appointment.
                              </div>
                            )}

                          {appointment.paymentId && (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                              {appointment.status === "pending" && (
                                <p>
                                  30% advance paid (₹{advance}) • waiting for doctor
                                  confirmation
                                </p>
                              )}
                              {appointment.status === "confirmed" && (
                                <p>
                                  30% advance paid (₹{advance}) • pay remaining 70%
                                  balance (₹{balance})
                                </p>
                              )}
                              {appointment.status === "completed" && (
                                <p>100% payment completed (₹{fee}) • appointment finished</p>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3">
                            {appointment.appointmentType === "video" &&
                              appointment.status === "confirmed" && (
                                <button
                                  onClick={() => handleVideoCallJoin(appointment)}
                                  disabled={loading}
                                  className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
                                >
                                  {loading ? (
                                    <>
                                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                      Checking...
                                    </>
                                  ) : (
                                    <>
                                      <FiVideo size={16} />
                                      Join Video Call
                                    </>
                                  )}
                                </button>
                              )}

                            {appointment.status === "pending" && !appointment.paymentId && (
                              <button
                                onClick={() => handleCancel(appointment._id)}
                                className="rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                                disabled={loading}
                              >
                                Cancel Appointment
                              </button>
                            )}

                            {appointment.status === "confirmed" && appointment.paymentId && (
                              <button
                                onClick={() =>
                                  handleBalancePayment(appointment._id, balance)
                                }
                                className="rounded-2xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
                              >
                                Pay 70% Balance
                              </button>
                            )}

                            {appointment.status === "pending" && appointment.paymentId && (
                              <span className="rounded-2xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700">
                                30% Paid • Waiting for Doctor
                              </span>
                            )}

                            {appointment.status === "completed" && (
                              <span className="rounded-2xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                                Completed • Fully Paid
                              </span>
                            )}

                            {appointment.status === "rejected" && appointment.paymentId && (
                              <span className="rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">
                                Rejected • Refund Initiated
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
        <button
          onClick={() => setShowChatbot(true)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-2xl shadow-blue-300 transition hover:-translate-y-0.5 hover:shadow-blue-400"
        >
                    <FiCpu size={24} />
        </button>
      </div>

      {showModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-[26px] border border-white/60 bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 text-white">
              <h3 className="text-xl font-semibold text-center">
                Book Appointment - Dr. {selectedDoctor.name}
              </h3>
              <p className="mt-1 text-center text-sm opacity-90">
                {selectedDoctor.specialization}
              </p>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Consultation Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAppointmentType("clinic")}
                    className={`rounded-2xl border-2 p-4 text-center transition ${
                      appointmentType === "clinic"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="mb-1 flex justify-center text-blue-600">
                      <FiMapPin size={20} />
                    </div>
                    <div className="font-semibold text-slate-900">Clinic Visit</div>
                    <div className="mt-1 text-xs text-slate-500">Visit clinic</div>
                  </button>

                  <button
                    onClick={() => setAppointmentType("video")}
                    className={`rounded-2xl border-2 p-4 text-center transition ${
                      appointmentType === "video"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="mb-1 flex justify-center text-violet-600">
                      <FiVideo size={20} />
                    </div>
                    <div className="font-semibold text-slate-900">Video Call</div>
                    <div className="mt-1 text-xs text-slate-500">
                      Online consultation
                    </div>
                  </button>
                </div>

                <p className="mt-3 text-center text-xs text-slate-500">
                  {appointmentType === "video"
                    ? "Video link will be shared after doctor confirmation"
                    : "Visit clinic at your scheduled time"}
                </p>
              </div>

              <div className="max-h-72 overflow-y-auto">
                <h4 className="mb-3 font-semibold text-slate-700">Available Slots</h4>
                {availableSlots.length > 0 ? (
                  <div className="space-y-3">
                    {availableSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{slot.day}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            {slot.startTime} - {slot.endTime}
                          </p>
                          {slot.date && (
                            <p className="mt-1 text-xs text-slate-500">
                              Date: {slot.date}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleBookAppointment(slot)}
                          disabled={loading}
                          className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {loading ? "Booking..." : "Book"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                    <p className="font-semibold text-slate-700">
                      No available slots found
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Doctor hasn't set availability or all slots are booked.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChatbot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-[26px] border border-white/60 bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">AI Health Assistant</h3>
                  <p className="mt-1 text-sm opacity-90">
                    Ask about symptoms, doctors, or general care guidance
                  </p>
                </div>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[24rem] space-y-4 overflow-y-auto p-5">
              {chatMessages.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-slate-500">
                  <p className="font-semibold text-slate-700">
                    Hello! I’m your AI health assistant.
                  </p>
                  <p className="mt-2 text-sm">
                    Ask me about symptoms, doctors, or basic health guidance.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs rounded-2xl px-4 py-3 text-sm lg:max-w-md ${
                          msg.sender === "user"
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-slate-100 text-slate-800 rounded-bl-md"
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.timestamp && (
                          <p className="mt-1 text-xs opacity-70 text-right">
                            {msg.timestamp}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 p-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your health question..."
                  className={`${inputClass} flex-1`}
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !userMessage.trim()}
                  className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-[26px] border border-white/60 bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 text-white">
              <h3 className="text-xl font-semibold">
                Feedback for Dr. {selectedDoctor.name}
              </h3>
              <p className="mt-1 text-sm opacity-90">
                Share your consultation experience
              </p>
            </div>

            <button
              className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
              onClick={() => setShowFeedbackModal(false)}
            >
              <FiX size={18} />
            </button>

            <div className="space-y-5 p-6">
              <div className="flex gap-2">{renderStars()}</div>

              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback here..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />

              {newReviewbtn ? (
                <button
                  onClick={() => {
                    API.post("/reviews/submit", {
                      doctor: selectedDoctor._id,
                      rating,
                      comment,
                    })
                      .then((res) => {
                        toast.success(res.data.message);
                        setShowFeedbackModal(false);
                        fetchDoctorReviews(selectedDoctor._id);
                        setRating(0);
                        setComment("");
                      })
                      .catch((err) => {
                        toast.error(
                          "Failed to submit feedback: " +
                            (err.response?.data?.message || err.message)
                        );
                      });
                  }}
                  className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Submit Feedback
                </button>
              ) : (
                <button
                  className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  onClick={handleUpdateReview}
                >
                  Update Feedback
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PatientDashboard;
