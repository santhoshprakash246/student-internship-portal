
import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import './App.css';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

function InternshipList() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All locations');

  useEffect(() => {
    fetch(`${API_URL}/api/internships`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load internships.');
        return response.json();
      })
      .then(setInternships)
      .catch(() => setError('Unable to load internships. Please try again.'));
    // Always stop the loading indicator, including after errors.
  }, []);

  useEffect(() => {
    // Loading is controlled by the request below.
  }, []);

  const locations = [
    'All locations',
    ...new Set(internships.map((item) => item.location).filter(Boolean)),
  ];

  const filteredInternships = internships.filter((item) => {
    const query = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !query ||
      [item.title, item.company, item.description, ...(item.skills || [])]
        .some((value) => String(value || '').toLowerCase().includes(query));

    const matchesLocation =
      locationFilter === 'All locations' ||
      item.location === locationFilter;

    return matchesSearch && matchesLocation;
  });

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="live-dot" />
            YOUR NEXT CHAPTER STARTS HERE
          </span>

          <h1>
            Small steps.
            <br />
            <span>Big futures.</span>
          </h1>

          <p>
            Discover opportunities that match your ambition. Learn by doing,
            grow your skills, and make your next move count.
          </p>

          <a className="button primary hero-button" href="#internships">
            Discover opportunities <span>↗</span>
          </a>

          <div className="hero-proof">
            <span className="proof-icon">✦</span>
            <span>
              <strong>Made for your growth</strong>
              <small>Explore. Apply. Get started.</small>
            </span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-core">
            <span>✳</span>
          </div>

          <div className="float-card float-top">
            <span className="float-icon">↗</span>
            <span>
              <strong>New possibilities</strong>
              <small>One click away</small>
            </span>
          </div>

          <div className="float-card float-bottom">
            <span className="float-icon purple">✦</span>
            <span>
              <strong>Your future, in motion</strong>
              <small>Start with one application</small>
            </span>
          </div>

          <span className="spark spark-one">✦</span>
          <span className="spark spark-two">✳</span>
        </div>
      </section>

      <section className="section" id="internships">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FIND YOUR FIT</span>
            <h2>
              Opportunities <span className="heading-accent">await.</span>
            </h2>
            <p className="section-subtitle">
              A good next step can change everything.
            </p>
          </div>

          <span className="count">
            <span className="count-dot" />
            {filteredInternships.length} opportunities
          </span>
        </div>

        <div className="search-toolbar">
          <label className="search-box">
            <span className="search-icon">⌕</span>
            <input
              aria-label="Search internships"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search roles, companies, or skills..."
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <label className="location-select">
            <span>⌖</span>
            <select
              aria-label="Filter by location"
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
            >
              {locations.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </select>
          </label>
        </div>

        {loading && <p>Loading internships...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && internships.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">✦</span>
            <h3>Fresh opportunities are on the way</h3>
            <p>
              There aren't any internships to show right now. Check back soon.
            </p>
          </div>
        )}

        {!loading && !error && internships.length > 0 &&
          filteredInternships.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">⌕</span>
              <h3>No matches this time</h3>
              <p>
                Try a different keyword or location to see more opportunities.
              </p>
              <button
                className="button secondary"
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('All locations');
                }}
              >
                Clear filters
              </button>
            </div>
          )}

        <div className="internship-grid">
          {filteredInternships.map((item) => (
            <article className="internship-card" key={item.id}>
              <div className="card-top">
                <div className="company-icon">
                  {item.company?.charAt(0) || 'I'}
                </div>
                <span className="tag">
                  <span className="tag-dot" />
                  Internship
                </span>
              </div>

              <h3>{item.title}</h3>
              <p className="company-name">{item.company}</p>
              <p className="description">{item.description}</p>

              <div className="meta">
                <span>
                  <span className="meta-symbol">⌖</span> {item.location}
                </span>
                <span>
                  <span className="meta-symbol">◷</span> {item.duration}
                </span>
              </div>

              <div className="card-bottom">
                <div>
                  <strong>{item.stipend}</strong>
                  <small>Monthly stipend</small>
                </div>

                <Link
                  className="button secondary"
                  to={`/internships/${item.id}`}
                >
                  View details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function InternshipDetails() {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [applicationId, setApplicationId] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    setInternship(null);

    fetch(`${API_URL}/api/internships/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Internship not found.');
        return response.json();
      })
      .then(setInternship)
      .catch(() => setError('Unable to load this internship.'));
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setApplicationId('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      studentName: formData.get('studentName').trim(),
      email: formData.get('email').trim(),
      rollNumber: formData.get('rollNumber').trim(),
      internship: id,
    };

    if (
      payload.studentName.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) ||
      !payload.rollNumber
    ) {
      setMessage('Please enter valid details in every field.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Application submission failed.');
      }

      setMessage(result.message || 'Application submitted successfully!');
      setApplicationId(result.application?._id || '');
      form.reset();
    } catch (err) {
      setMessage(
        `${err.message} Check that the backend and MongoDB are running.`
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="page"><p>Loading details...</p></main>;
  }

  if (error || !internship) {
    return (
      <main className="page">
        <p className="error">{error || 'Internship not found.'}</p>
        <Link to="/" className="text-link">← Back to internships</Link>
      </main>
    );
  }

  return (
    <main className="page details-layout">
      <section className="details-panel">
        <Link to="/" className="text-link">← All internships</Link>

        <div className="company-icon large">
          {internship.company.charAt(0)}
        </div>

        <span className="eyebrow">{internship.company}</span>
        <h1>{internship.title}</h1>
        <p className="description">{internship.description}</p>

        <div className="detail-facts">
          <div>
            <small>Location</small>
            <strong>{internship.location}</strong>
          </div>
          <div>
            <small>Duration</small>
            <strong>{internship.duration}</strong>
          </div>
          <div>
            <small>Stipend</small>
            <strong>{internship.stipend}</strong>
          </div>
        </div>

        <h3>Skills you'll work with</h3>
        <div className="skills">
          {(internship.skills || []).map((skill) => (
            <span className="skill" key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="form-panel">
        <span className="eyebrow">TAKE THE NEXT STEP</span>
        <h2>Apply for this internship</h2>
        <p className="muted">
          Fill in your details to submit your application.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="studentName">Full name</label>
          <input
            id="studentName"
            name="studentName"
            type="text"
            placeholder="Enter your full name"
            minLength="2"
            maxLength="100"
            autoComplete="name"
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="rollNumber">Roll number</label>
          <input
            id="rollNumber"
            name="rollNumber"
            type="text"
            placeholder="Enter your roll number"
            maxLength="30"
            required
          />

          <label htmlFor="internshipName">Selected internship</label>
          <input
            id="internshipName"
            value={internship.title}
            readOnly
          />

          <button
            className="button primary submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit application →'}
          </button>
        </form>

        {message && (
          <div className={applicationId ? 'success' : 'notice'} role="status">
            {message}
            {applicationId && <p>Application ID: {applicationId}</p>}
          </div>
        )}
      </section>
    </main>
  );
}

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadApplications() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/applications`);
      if (!response.ok) throw new Error('Unable to load applications.');

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <main className="page">
      <section className="section applications-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">APPLICATION TRACKER</span>
            <h1>Submitted applications</h1>
            <p className="muted">
              Review applications saved in the database.
            </p>
          </div>

          <button className="button secondary" onClick={loadApplications}>
            Refresh
          </button>
        </div>

        {loading && <p>Loading applications...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && applications.length === 0 && (
          <div className="empty-state">
            <h3>No applications yet</h3>
            <p>Explore internships and submit your first application.</p>
            <Link to="/" className="button primary">
              Explore internships
            </Link>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Roll number</th>
                  <th>Internship</th>
                  <th>Applied on</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td>{application.studentName}</td>
                    <td>{application.email}</td>
                    <td>{application.rollNumber}</td>
                    <td>{application.internshipTitle}</td>
                    <td>
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function NotFound() {
  return (
    <main className="page empty-state">
      <h1>Page not found</h1>
      <Link to="/" className="button primary">Back to home</Link>
    </main>
  );
}

function Portal() {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Student Internship Portal home">
            <span className="brand-mark">S</span>
            <span>
              Student Internship <span className="brand-accent">Portal</span>
            </span>
          </Link>

          <nav>
            <Link to="/">Internships</Link>
            <Link to="/applications">Applications</Link>
          </nav>

          <a href="#internships" className="header-cta">
            Find an internship ↗
          </a>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<InternshipList />} />
        <Route path="/internships/:id" element={<InternshipDetails />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="site-footer">
        <Link to="/" className="brand" aria-label="Student Internship Portal home">
          <span className="brand-mark">S</span>
          <span>
            Student Internship <span className="brand-accent">Portal</span>
          </span>
        </Link>
        <p>Connecting students with opportunities to grow.</p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Portal />
    </BrowserRouter>
  );
}
