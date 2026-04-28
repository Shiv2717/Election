import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Megaphone, Users, CheckCircle, Trophy, ExternalLink, CalendarPlus, MapPin, PlayCircle } from 'lucide-react';

const iconMap = {
  FileText,
  Megaphone,
  Users,
  CheckCircle,
  Trophy
};

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -45 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 15 }
  }
};

const StepDetail = ({ step, index }) => {
  const IconComponent = iconMap[step.icon] || FileText;

  const getGoogleCalendarUrl = (event) => {
    if (!event) return '#';
    const text = encodeURIComponent(event.text);
    const details = encodeURIComponent(event.details);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${event.dates}&details=${details}`;
  };

  const getGoogleMapsSearchUrl = (query) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  return (
    <motion.div
      id={`step-${step.id}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="glass-panel step-detail-panel"
      style={{ marginBottom: '5rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative gradient blur behind the card */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px',
        background: 'var(--accent-saffron)', filter: 'blur(80px)', opacity: 0.1, zIndex: -1
      }} />

      <motion.div className="step-header" variants={itemVariants}>
        <motion.div className="step-icon" variants={iconVariants}>
          <IconComponent size={32} />
        </motion.div>
        <div>
          <h2 className="step-title">Step {index}: {step.title}</h2>
          <p className="step-short-desc">{step.shortDesc}</p>
        </div>
      </motion.div>

      <div className="step-content">
        <motion.p className="step-details" variants={itemVariants}>
          {step.details}
        </motion.p>

        {/* Google Services Integrations */}
        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {step.calendarEvent && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={getGoogleCalendarUrl(step.calendarEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className="google-btn calendar-btn"
            >
              <CalendarPlus size={18} />
              Save to Google Calendar
            </motion.a>
          )}

          {step.mapQuery && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={getGoogleMapsSearchUrl(step.mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="google-btn maps-btn"
            >
              <MapPin size={18} />
              Find on Google Maps
            </motion.a>
          )}
        </motion.div>

        {/* YouTube Embed */}
        {step.youtubeId && (
          <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
            <h4 className="resources-title flex items-center gap-2">
              <PlayCircle size={18} color="var(--accent-saffron)" />
              Video Guide
            </h4>
            <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '0.75rem', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}>
              <iframe width="725" height="425" src="https://www.youtube-nocookie.com/embed/ZJReQ8ao0SU?si=cw3IUmL5vDBM4tF8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} style={{ marginTop: '2rem' }}>
          <h4 className="resources-title">Helpful Resources</h4>
          <div className="resources-grid">
            {step.resources.map((resource, i) => (
              <motion.a
                key={i}
                whileHover={{ scale: 1.02, y: -5 }}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card group"
              >
                <div className="resource-header">
                  <span className="resource-title">{resource.title}</span>
                  <ExternalLink size={16} className="resource-icon" />
                </div>
                <span className="resource-desc">{resource.desc}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StepDetail;
