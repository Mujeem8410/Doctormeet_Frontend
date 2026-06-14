import "../components/common.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import EmergencyTriageModal from "./EmergencyTriageModal";
import FixedSOSButton from "./FixedSOSButton";
import { ToastContainer } from "react-toastify";

const handleEmergencyClick = () => {
  const modalElement = document.getElementById("emergency-modal");
  if (modalElement) {
    modalElement.classList.remove("hidden");
  }
};

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="px-4 pb-10 pt-24 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-[72rem]">
          <div className="overflow-hidden rounded-[26px] border border-white/60 bg-white/88 shadow-2xl backdrop-blur-xl">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="bg-gradient-to-br from-sky-700 via-blue-600 to-cyan-500 p-6 text-white lg:p-8">
                <div className="mb-4 inline-flex rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Digital Healthcare
                </div>
                <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
                  Book doctor appointments with less hassle.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-blue-50">
                  DocMeet helps patients connect with doctors quickly, manage
                  appointments smoothly, and get urgent support when time really
                  matters.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/login"
                    className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-900/20 transition hover:bg-blue-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Create Account
                  </Link>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                      Fast Booking
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Simple appointment flow
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                      Trusted Access
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Patient and doctor dashboards
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-100">
                      Emergency Help
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Quick SOS support flow
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:p-8">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Why DocMeet
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    One place for appointments, access, and care.
                  </h2>
                  

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        Patients can find and book available slots quickly.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        Doctors can manage professional details and clinic hours.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        Emergency help stays one tap away through SOS support.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-700">
                      Ready to continue?
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Login if you already have an account, or register to get
                      started with DocMeet.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        to="/login"
                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Go to Login
                      </Link>
                      <Link
                        to="/register"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Go to Register
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FixedSOSButton onClick={handleEmergencyClick} />
      <EmergencyTriageModal />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Home;
