import React from 'react';
import './KPI.css';
import { motion } from 'framer-motion';

const KPI = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  iconBgClass = "icon-blue",
  delay = 0 
}) => {
  return (
    <motion.div 
      className="premium-kpi-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay }}
      whileHover={{ y: -2, boxShadow: 'var(--shadow-md)', borderColor: 'var(--primary)' }}
    >
      <div className="premium-kpi-header">
        <h4 className="premium-kpi-title">{title}</h4>
        <div className={`premium-kpi-icon ${iconBgClass}`}>
          {icon}
        </div>
      </div>
      <div className="premium-kpi-body">
        <span className="premium-kpi-value">{value}</span>
      </div>
      {(trend || trendValue) && (
        <div className="premium-kpi-footer">
          {trendValue && (
            <span className={`premium-kpi-trend ${trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-neutral'}`}>
              {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''}{trendValue}
            </span>
          )}
          <span className="premium-kpi-comparison">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default KPI;
